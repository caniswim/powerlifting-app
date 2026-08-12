/**
 * ABSORVER OS 12 CEGOS E01–E12 no research/kb/CANARIOS.json.
 *
 * Por que este arquivo existe, e não um copiar-e-colar à mão: os campos
 * `recuperados`, `abriuOTopico`, `gavetasComResposta` e `veredito` do bloco
 * `perguntaDoAtleta` são MEDIDA, não prosa, e o `check-canarios.mjs` recomputa
 * os quatro a cada execução e reprova se divergirem. Escrevê-los à mão é
 * convidar o modo de falha nº 3 desta casa (documento e código divergindo em
 * silêncio) para dentro do arquivo que mede exatamente isso.
 *
 * A prosa (`porque`, `esperado`, `frases`, `historia`) vem do
 * CANARIOS-CEGOS-E.json e está embutida aqui, porque aquele arquivo é APAGADO
 * no fim: duas cópias do mesmo canário divergem em silêncio.
 *
 *   node research/tools/auditoria-onda2f/absorver-cegos.mjs          (só mostra)
 *   node research/tools/auditoria-onda2f/absorver-cegos.mjs --grava  (escreve)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, carregarTopicos } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, telaDaResposta, perfilarTopicos, termosDaPergunta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const ARQUIVO = join(ROOT, 'research/kb/CANARIOS.json');

const CONJUNTO = 'cego-2026-08-13 (E01-E12, escrito pelo workflow da onda 2F, absorvido a partir deste commit)';

/** A prosa dos doze, transcrita do CANARIOS-CEGOS-E.json antes de ele ser apagado. */
const PROSA = [
  {
    id: 'E01',
    pergunta: 'descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha',
    sustenta: ['V089-24', 'V089-25'],
    topicoDaResposta: 'dor',
    frases: ["you don't want to completely rest", 'slow velocity variations'],
    porque: 'A base chama isso de tendinite e responde no vocabulário clínico; o atleta diz `incômodo no peito` e `descansar totalmente`. A gaveta `dor` ABRE e mesmo assim entrega uma das duas: V089-24 sai, V089-25 fica fora do corte da seção. Para este atleta, com histórico de peitoral, a resposta errada é a mais intuitiva — parar de vez.',
    esperado: 'não descansar completamente, porque com tendinite o descanso total piora o quadro; o contorno é variação de velocidade lenta — tempo e pausas — porque a tensão no tendão depende do peso E da velocidade em que ele é movido.',
  },
  {
    id: 'E02',
    pergunta: 'abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar',
    sustenta: ['V167-17', 'V167-18'],
    topicoDaResposta: 'dor',
    frases: ['flare', 'inerente ao movimento'],
    porque: 'A palavra da base é `flare`, que o atleta não usa: ele descreve o gesto. As duas claims moram nas três gavetas que a pergunta parece pedir — supino, ombros e dor — e `supino` (694) e `ombros` ABREM e não entregam nenhuma das duas. É soterramento dentro da gaveta, não roteamento. A resposta é de duas metades que precisam sair juntas: V167-17 admite que a dor acontece, V167-18 diz que ela não é inerente ao movimento.',
    esperado: 'a dor de ombro no flare acontece com algumas pessoas, e ele não a considera inerente ao movimento — é algo a que o corpo precisa de tempo para se acostumar.',
  },
  {
    id: 'E03',
    pergunta: 'eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita',
    sustenta: ['F001-37', 'F001-47'],
    topicoDaResposta: 'cinto',
    frases: ['não pode tocar o cinto', 'tocar o cinto'],
    porque: 'Resposta ESTREITA de sim/não com duas claims de regulamento, e ela mora numa gaveta minúscula (`cinto`, 54) que não abre; abre `supino` (694), que ETIQUETA as duas e as soterra. O atleta diz `fivela`, palavra que não está na lista de entrada de nenhuma das 74 gavetas.',
    esperado: 'não aceita: a barra não pode tocar o cinto, e tocar o cinto é uma das causas listadas de anulação do supino.',
  },
  {
    id: 'E04',
    pergunta: 'seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos',
    sustenta: ['F001-14', 'F001-28'],
    topicoDaResposta: 'pegada',
    frases: ['polegar não precisa envolver a barra', 'polegar envolvendo a barra'],
    porque: 'A resposta é um PAR que se contradiz de propósito: no agacho o polegar NÃO precisa envolver a barra (F001-14), no supino ele TEM de envolver (F001-28). A pergunta pede explicitamente os três movimentos, e entregar só uma das duas produz a resposta errada para o outro. `dedão` não está na lista de entrada de nenhuma gaveta; a base diz `polegar` e `thumbless`.',
    esperado: 'depende do movimento: no agacho o polegar não precisa envolver a barra; no supino a pegada tem de ser com o polegar envolvendo a barra.',
  },
  {
    id: 'E05',
    pergunta: 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo',
    sustenta: ['F001-79'],
    topicoDaResposta: 'equipamento',
    frases: ['meia de cano até a canela'],
    porque: 'Resposta ESTREITA de uma claim só, e `equipamento` não abre. `perna` abre `pernas` (125) e `sumo` (145), duas gavetas de MÚSCULO e de TÉCNICA; a gaveta de REGRA não entra. É o item que desclassifica na inspeção de equipamento se o atleta descobrir no dia.',
    esperado: 'meia de cano até a canela é obrigatória no terra, para cobrir e proteger as canelas.',
  },
  {
    id: 'E06',
    pergunta: 'meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda',
    sustenta: ['V174-12', 'V174-16'],
    topicoDaResposta: 'strap',
    numeros: [100],
    frases: ['a barra, as anilhas e as straps'],
    porque: 'Gaveta MINÚSCULA (`strap`, 15 claims) contra enormes; `equipamento` abre e não entrega nenhuma das duas. Nenhuma palavra da pergunta está na lista de entrada de `strap`: o atleta descreve o SINTOMA (o número não se repete), não a causa, porque a causa é justamente o que ele não sabe.',
    esperado: 'o gap de cerca de 100 lb entre terra de academia e de competição vem de três coisas — a barra, as anilhas e as straps — e com strap a barra fica praticamente pendurada fora da mão, cortando ainda mais amplitude.',
  },
  {
    id: 'E07',
    pergunta: 'durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao',
    sustenta: ['V015-10', 'V015-12'],
    topicoDaResposta: 'sono',
    frases: ['horário consistente', 'mais importante que a própria duração'],
    porque: 'Uma pergunta literalmente sobre sono não abre a gaveta `sono` (57): a lista de entrada dela tem `dormir`, `horário de dormir`, `consistência de sono`, e a pergunta diz `durmo` e `cada dia numa hora diferente`. `recuperacao` (368) abre e não entrega. Sem isso a resposta vira `durma mais`, que é o conselho errado para quem já dorme sete horas.',
    esperado: 'conta: o item número um da higiene de sono é o horário consistente, e há pesquisa indicando que a consistência do horário pode ser mais importante que a própria duração do sono.',
  },
  {
    id: 'E08',
    pergunta: 'na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso',
    sustenta: ['G031-37', 'G031-38', 'G029-17'],
    topicoDaResposta: 'antropometria',
    frases: ['fêmur encosta no acetábulo', 'arredondamento da lombar é inevitável', 'esbarrar em si mesmo'],
    porque: '`antropometria` (78) e `profundidade` (87) são pequenas e a rota abre `agacho` (990) mais três gavetas sem relação (frequencia, ordem-exercicio, cinto). A resposta muda a decisão inteira: a resposta padrão — mobilidade, mais alongamento, corrigir a forma — é a errada e faz o atleta perseguir uma correção que o osso dele não permite. `amasso contra mim mesmo` e `do meu osso` não estão na lista de entrada de nenhuma gaveta.',
    esperado: 'é do osso: o fêmur encosta no acetábulo e gera o arredondamento e a sensação de amontoado no fundo; a falta de profundidade vem de esbarrar em si mesmo no quadril; e para esse levantador algum arredondamento da lombar é inevitável, porque é o que permite contornar a articulação e atingir a profundidade.',
  },
  {
    id: 'E09',
    pergunta: 'uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida',
    sustenta: ['G008-27', 'G008-29', 'G008-43'],
    topicoDaResposta: 'carga-de-treino',
    frases: ['stress index', 'banda estreita'],
    porque: 'A gaveta certa é a segunda MENOR desta base com resposta útil (`carga-de-treino`, 13 claims) e ela não abre; abrem `volume` (750) e `progressao` (741), 1 para 57. As palavras da pergunta (`séries`, `carga`, `semana`) são exatamente as que pertencem às gavetas gigantes, então a diluição aqui é estrutural. A resposta é o nome de uma ferramenta que o atleta não sabe que existe.',
    esperado: 'existe: o stress index, criado por Mike Tuchscherer, que serve justamente para comparar entre si séries de estresse diferentes — e a razão de certas progressões serem brutalmente efetivas é que a gestão de volume e intensidade cria uma banda estreita de stress index.',
  },
  {
    id: 'E10',
    pergunta: 'posso passar esparadrapo no dedao pra segurar melhor a barra no terra',
    sustenta: ['F001-100'],
    topicoDaResposta: 'equipamento',
    numeros: [2],
    frases: ['não pode ser usada como ajuda para segurar a barra'],
    porque: 'Resposta ESTREITA de uma claim só, e a resposta é um `sim, mas` que o atleta não adivinha: a fita é permitida E não pode ser usada como ajuda para segurar a barra, que é literalmente o motivo declarado na pergunta. `esparadrapo` não está na lista de entrada de nenhuma das 74 gavetas; a base diz `fita médica` e `tape`.',
    esperado: 'a fita em si é permitida — duas camadas de fita médica em volta dos polegares — mas ela não pode ser usada como ajuda para segurar a barra, que é exatamente o uso pedido.',
  },
  {
    id: 'E11',
    pergunta: 'no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa',
    sustenta: ['F001-30'],
    topicoDaResposta: 'setup',
    frases: ['movimento de pé é permitido'],
    porque: 'Resposta ESTREITA de sim/não com uma claim só, e ela é o contrário do que o atleta teme. `supino` (694) ABRE, etiqueta a claim e a soterra: F001-30 é a 57ª de `supino` e a 35ª de `setup`. `queima a tentativa` não está em entrada nenhuma — o regulamento diz `anula`, `nulo`, `luz vermelha`. Errar aqui faz o atleta amarrar o pé e perder leg drive por medo de uma regra que não existe.',
    esperado: 'não queima: movimento de pé é permitido durante o supino, desde que o pé continue plano na plataforma.',
  },
  {
    id: 'E12',
    pergunta: 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca',
    sustenta: ['V127-15', 'V127-13'],
    topicoDaResposta: 'lesao',
    frases: ['variações auto-limitantes', 'leg drive'],
    porque: 'A resposta só serve inteira, e as duas metades moram em gavetas diferentes: V127-15 (lesao/dor/volume) diz que SIM; V127-13 (selecao-exercicio/supino/volume) é a condição que impede o estrago. Para este atleta — reexposição gradual do supino após peitoral rompido — devolver só o `pode` sem a condição é o erro que custa a competição. Este é o único dos doze em que a rota entrega as duas metades.',
    esperado: 'pode: quem se detona num movimento pode fazer a maior parte ou até todo o trabalho com variações auto-limitantes — com a condição de não depender demais de uma variação em que o leg drive não é praticado, para não deixar o leg drive deficiente no supino principal.',
  },
];

/**
 * O SETUP É COPIADO DO `check-canarios.mjs` LINHA A LINHA — de propósito. Se
 * este arquivo montasse o glossário ou o índice de outro jeito, os quatro
 * campos medidos aqui divergiriam dos que o gate recomputa, e o gate reprovaria
 * o próprio canário que este arquivo acabou de gravar.
 */
const { claims, porId } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICS = carregarTopicos(ROOT);
const INDICE = indexar(claims);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const PERFIS = perfilarTopicos(claims);
const tela = { porSecao: 18, secoes: 5 };

const novos = PROSA.map((p) => {
  const r = responder(claims, p.pergunta, {
    topicos: TOPICS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: INDICE, perfis: PERFIS, tela,
  });
  const rotas = r.rotas.map((x) => x.topico);
  const naTela = telaDaResposta(r).map((x) => x.id);
  const recuperados = p.sustenta.filter((i) => naTela.includes(i));
  const gavetas = rotas.filter((t) => p.sustenta.some((i) => (porId.get(i)?.topic ?? []).includes(t))).sort();
  const veredito = recuperados.length === p.sustenta.length ? 'passa' : 'falha';

  const can = {
    id: p.id,
    familia: 'presente-escondido',
    conjunto: CONJUNTO,
    pergunta: p.pergunta,
    porque: p.porque,
    esperado: p.esperado,
    sustenta: p.sustenta,
  };
  if (p.numeros) can.numeros = p.numeros;
  can.frases = p.frases;
  can.historia = `Escrito às cegas pelo workflow da onda 2F em 13/08/2026, contra a base e não contra a ferramenta. node research/tools/check-evidence.mjs ${p.sustenta.join(' ')} -> ${p.sustenta.length} de ${p.sustenta.length} existem. Pela porta nova, com o comando impresso antes da conclusão: node research/tools/auditoria-onda2f/cegos.mjs. Pelo caminho do agente (três modelos escolhendo a gaveta com o glossário): node research/tools/auditoria-onda2f/placar-agente.mjs.`;
  can.perguntaDoAtleta = {
    descricao: 'a pergunta acima, na voz do atleta, pela porta nova: node research/tools/check-evidence.mjs --pergunta "<pergunta>"',
    topicoDaResposta: p.topicoDaResposta,
    tela,
    medidoEm: '2026-08-13',
    abriuOTopico: rotas.includes(p.topicoDaResposta),
    gavetasComResposta: gavetas,
    recuperados,
    veredito,
  };
  return can;
});

const placar = {
  algum: novos.filter((c) => c.perguntaDoAtleta.recuperados.length > 0).length,
  todos: novos.filter((c) => c.perguntaDoAtleta.veredito === 'passa').length,
  semGaveta: novos.filter((c) => c.perguntaDoAtleta.gavetasComResposta.length === 0).length,
  abriuOTopico: novos.filter((c) => c.perguntaDoAtleta.abriuOTopico).length,
};
for (const c of novos) {
  const pa = c.perguntaDoAtleta;
  console.log(
    `${c.id}  ${pa.veredito.padEnd(5)}  ${pa.recuperados.length}/${c.sustenta.length}  `
      + `gavetas=[${pa.gavetasComResposta.join(', ') || '—'}]  abriuOTopico=${pa.abriuOTopico}`,
  );
}
console.log(`\nALGUM ${placar.algum}/12 · TODOS ${placar.todos}/12 · sem gaveta ${placar.semGaveta}/12 · abriu o tópico ${placar.abriuOTopico}/12`);

if (process.argv.includes('--grava')) {
  const doc = JSON.parse(readFileSync(ARQUIVO, 'utf8'));
  const semE = doc.canarios.filter((c) => !/^E\d\d$/.test(c.id));
  doc.canarios = [...semE, ...novos];
  writeFileSync(ARQUIVO, `${JSON.stringify(doc, null, 1)}\n`);
  console.log(`\n✓ gravado: ${doc.canarios.length} canários em ${ARQUIVO}`);
}
