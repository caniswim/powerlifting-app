import { medir, porId } from './auditoria-onda2d.mjs';

export const CEGOS = [
  { id: 'D01', pequena: true, p: 'voltando ao supino com pouca carga, o musculo principal do movimento ja recebe estimulo cheio ou eu so treino tecnica', espera: ['V142-25','V096-17','V128-15','V103-31'], gavetas: ['peito','supino','intensidade'] },
  { id: 'D02', pequena: true, p: 'se eu travar no meio da descida do agacho, posso subir um pouco e descer de novo pra pegar a profundidade', espera: ['F001-02','F001-03'], gavetas: ['regras-ipf','agacho'] },
  { id: 'D03', pequena: true, p: 'vale a pena gastar com suplemento e massagem ou tem coisa mais basica que responde pela maior parte da recuperacao', espera: ['V015-07','V015-09','V008-10'], gavetas: ['sono','recuperacao','nutricao'] },
  { id: 'D04', pequena: true, p: 'puxo e agacho no mesmo dia e desconfio que isso esteja estragando a tecnica do segundo movimento', espera: ['G038-13','G038-21','G048-55'], gavetas: ['ordem-exercicio','agacho','fadiga'] },
  { id: 'D05', pequena: true, p: 'eu puxo de pernas abertas, preciso treinar do jeito tradicional tambem e quanto disso', espera: ['V088-01','V088-16','V088-21'], gavetas: ['convencional','sumo','terra'] },
  { id: 'D06', pequena: true, p: 'se eu mexer o pe depois que o juiz mandar devolver a barra, queima a tentativa', espera: ['F001-11'], gavetas: ['comandos-ipf','agacho'] },
  { id: 'D07', pequena: true, p: 'meus aquecimentos de agacho estao levando meia hora inteira, da pra emendar um no outro', espera: ['V003-07','V003-10','V003-22'], gavetas: ['descanso-entre-series','aquecimento'] },
  { id: 'D08', pequena: true, p: 'no agacho eu subo com o quadril na frente e o tronco cai pra frente, mexer em onde a barra fica apoiada resolve', espera: ['G027-39','G027-41','G029-20'], gavetas: ['barra-baixa','antropometria','agacho'] },
  { id: 'D09', pequena: false, p: 'a ressonancia apontou uma alteracao no tendao, isso explica o incomodo que eu sinto', espera: ['V001-22','V001-21'], gavetas: ['dor','lesao'] },
  { id: 'D10', pequena: false, p: 'fiquei com medo de forcar depois que me explicaram que o problema era desequilibrio muscular, isso piora o quadro', espera: ['V001-23','V001-24','V001-25'], gavetas: ['dor','mentalidade','lesao'] },
  { id: 'D11', pequena: true, p: 'estou meio adoentado essa semana, vale forcar a sessao pesada ou nao', espera: ['G034-01','G034-10','G034-20'], gavetas: ['saude','recuperacao'] },
  { id: 'D12', pequena: true, p: 'entre as variacoes de supino tem alguma que valha pra praticamente todo mundo', espera: ['V103-07','V103-11','V103-01'], gavetas: ['tier-list','supino','selecao-exercicio'] },
];

if (process.argv[1] && process.argv[1].endsWith('cegos.mjs')) {
  let algum = 0, todos = 0, soterrados = 0;
  const linhas = [];
  for (const c of CEGOS) {
    const m = medir(c.p);
    const pos = {};
    for (const id of c.espera) {
      const i = m.telaIds.indexOf(id);
      const iToda = m.ordemToda.findIndex((x) => x.id === id);
      pos[id] = { tela: i >= 0 ? i + 1 : null, toda: iToda >= 0 ? iToda + 1 : null, existe: porId.has(id) };
    }
    const achados = c.espera.filter((id) => pos[id].tela !== null);
    // gaveta certa: alguma rota aberta contem alguma claim esperada
    const gavetasComResposta = m.rotas.filter((t) => c.espera.some((id) => (porId.get(id)?.topic ?? []).includes(t)));
    const abriuGavetaDeclarada = c.gavetas.filter((g) => m.rotas.includes(g));
    if (achados.length > 0) algum++;
    if (achados.length === c.espera.length) todos++;
    const sot = gavetasComResposta.length > 0 && achados.length < c.espera.length;
    if (sot) soterrados++;
    linhas.push({ id: c.id, achados, faltam: c.espera.filter((i)=>!achados.includes(i)), pos, rotas: m.rotas, vagas: m.vagas, tamanhoTela: m.tamanhoTela, gavetasComResposta, abriuGavetaDeclarada, soterrado: sot });
  }
  console.log(JSON.stringify({ algum, todos, soterrados, linhas }, null, 1));
}
