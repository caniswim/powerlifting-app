#!/usr/bin/env node
/**
 * O CONTROLE QUE DECIDE O VEREDITO: o agente ganhou por ESCOLHER MELHOR, ou só
 * por OLHAR MAIS?
 *
 * O placar bruto compara coisas de tamanhos diferentes, e comparar assim é como
 * a onda 2D produziu um achado que não existia:
 *
 *   determinístico : 1 tela, até 5 seções × 18 claims  =  90 vagas
 *   agente         : 3 telas, 1 seção × 60 claims cada = 180 vagas
 *
 * Um placar em que um lado tem o dobro das vagas não mede escolha, mede orçamento.
 * Aqui o determinístico recebe O MESMO instrumento: pegam-se as gavetas que a
 * ROTA AUTOMÁTICA escolheu (as N primeiras seções), e força-se cada uma num
 * comando separado, exatamente como o agente faz. Mesmo número de comandos,
 * mesmo teto de 60, mesma união.
 *
 * O que sobrar de diferença é escolha de gaveta, e só isso.
 *
 * Uso: node research/tools/auditoria-onda2f/controle-orcamento.mjs
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const rodar = (a) => execFileSync('node', [CLI, ...a], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const idsListados = (saida) => {
  const s = new Set();
  for (const linha of saida.split('\n')) {
    const m = linha.match(/^\s*(?:\d+º\s+)?(?:✓\s*)?([A-Z]\d{3}-\d+)(?:\s|$)/);
    if (m) s.add(m[1]);
  }
  return s;
};

const CANARIOS = [
  ['E01', 'descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha', ['V089-24', 'V089-25']],
  ['E02', 'abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar', ['V167-17', 'V167-18']],
  ['E03', 'eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita', ['F001-37', 'F001-47']],
  ['E04', 'seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos', ['F001-14', 'F001-28']],
  ['E05', 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo', ['F001-79']],
  ['E06', 'meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda', ['V174-12', 'V174-16']],
  ['E07', 'durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao', ['V015-10', 'V015-12']],
  ['E08', 'na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso', ['G031-37', 'G031-38', 'G029-17']],
  ['E09', 'uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida', ['G008-27', 'G008-29', 'G008-43']],
  ['E10', 'posso passar esparadrapo no dedao pra segurar melhor a barra no terra', ['F001-100']],
  ['E11', 'no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa', ['F001-30']],
  ['E12', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca', ['V127-15', 'V127-13']],
];

// quantas gavetas cada roteador-modelo abriu, por caso — para igualar o nº de comandos
const NCOMANDOS = { E01: 3, E02: 3, E03: 3, E04: 3, E05: 3, E06: 3, E07: 2, E08: 4, E09: 3, E10: 3, E11: 4, E12: 3 };

console.log('='.repeat(84));
console.log('CONTROLE DE ORÇAMENTO — determinístico com o MESMO instrumento do agente');
console.log('='.repeat(84));
console.log('caso  esperados                  auto(1 tela)  auto-forçado(N telas)  gavetas que a rota deu');

let brutoOk = 0; let brutoTodos = 0;
let ctrlOk = 0; let ctrlTodos = 0;
const detalhe = [];

for (const [caso, q, esperados] of CANARIOS) {
  const auto = rodar(['--pergunta', q]);
  const gavetas = [...auto.matchAll(/GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
  const achouAuto = esperados.filter((i) => idsListados(auto).has(i));

  const n = NCOMANDOS[caso];
  const forcadas = gavetas.slice(0, n);
  const uniao = new Set();
  for (const t of forcadas) for (const i of idsListados(rodar(['--pergunta', q, '--topic', t]))) uniao.add(i);
  const achouCtrl = esperados.filter((i) => uniao.has(i));

  if (achouAuto.length) brutoOk++;
  if (achouAuto.length === esperados.length) brutoTodos++;
  if (achouCtrl.length) ctrlOk++;
  if (achouCtrl.length === esperados.length) ctrlTodos++;

  detalhe.push({ caso, gavetas, forcadas, achouAuto, achouCtrl, esperados });
  console.log(`${caso}   ${esperados.join(' ').padEnd(26)} ${`${achouAuto.length}/${esperados.length}`.padEnd(13)} `
    + `${`${achouCtrl.length}/${esperados.length}`.padEnd(22)} ${gavetas.slice(0, n).join(', ')}`);
}

console.log(`\n  determinístico, 1 tela (como é hoje) .......: ${brutoOk}/12 com id · ${brutoTodos}/12 completos`);
console.log(`  determinístico, N telas forçadas (controle) : ${ctrlOk}/12 com id · ${ctrlTodos}/12 completos`);
console.log('  agente (média dos 3 modelos) ...............: 9/12 com id · 8,3/12 completos');

console.log(`\n${'='.repeat(84)}`);
console.log('ONDE A ROTA AUTOMÁTICA E OS MODELOS DISCORDAM DE GAVETA');
console.log('='.repeat(84));
const ESC1 = { E01: ['dor', 'recuperacao', 'lesao'], E02: ['supino', 'ombros', 'tecnica'], E03: ['supino', 'erro-comum', 'regras-ipf'], E04: ['pegada', 'regras-ipf', 'erro-comum'], E05: ['equipamento', 'sapato', 'terra'], E06: ['teste-de-forca', 'equipamento', 'training-max'], E07: ['sono', 'recuperacao'], E08: ['agacho', 'antropometria', 'profundidade', 'mobilidade'], E09: ['carga-de-treino', 'volume', 'intensidade'], E10: ['equipamento', 'regras-ipf', 'pegada'], E11: ['supino', 'erro-comum', 'regras-ipf', 'setup'], E12: ['ombros', 'dor', 'selecao-exercicio', 'supino'] };
for (const d of detalhe) {
  const mod = ESC1[d.caso];
  const soRota = d.forcadas.filter((t) => !mod.includes(t));
  const soModelo = mod.filter((t) => !d.forcadas.includes(t));
  console.log(`  ${d.caso}  rota: [${d.forcadas.join(', ')}]`);
  console.log(`        modelo: [${mod.join(', ')}]   só-rota: ${soRota.join(',') || '—'}   só-modelo: ${soModelo.join(',') || '—'}`);
}
