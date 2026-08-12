#!/usr/bin/env node
/**
 * O CAMINHO DO AGENTE CONTRA O DETERMINÍSTICO, nos MESMOS 12 canários cegos.
 *
 * Cinco ondas mediram `--pergunta`. Nenhuma mediu o caminho que vai para
 * produção: um modelo lê as 74 gavetas do `--topicos`, escolhe, e roda
 * `--pergunta "<q>" --topic <gaveta>`. Este script pontua esse caminho.
 *
 * DUAS PRECAUÇÕES, e as duas existem por causa do falso achado da onda 2D:
 *
 *   1. `--topic` lê UM valor e descarta o resto EM SILÊNCIO (confirmado por
 *      `topic-parse.mjs`, e reconferido aqui na abertura). Por isso um roteador
 *      que escolheu 4 gavetas vira 4 COMANDOS, e a tela dele é a UNIÃO das 4.
 *      Cada comando executado é impresso em `comandos.txt`.
 *   2. "id na tela" é contado por DUAS réguas: ESTRITA (o id saiu como entrada
 *      listada — bloco detalhado, linha compacta, ou "já saiu inteira") e FROUXA
 *      (o id aparece em qualquer lugar da saída, inclusive dentro de
 *      `conflita:`/`condições:` de outra claim). Se as duas divergirem, o número
 *      que vale é o ESTRITO e a divergência sai impressa — id citado no rodapé
 *      de outra claim não é a base tendo respondido.
 *
 * Uso: node research/tools/auditoria-onda2f/placar-agente.mjs
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos } from '../kb.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');

const rodar = (args) =>
  execFileSync('node', [CLI, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** ESTRITA: o id abriu uma entrada listada na tela. */
const idsListados = (saida) => {
  const achados = new Set();
  for (const linha of saida.split('\n')) {
    const m = linha.match(/^\s*(?:\d+º\s+)?(?:✓\s*)?([A-Z]\d{3}-\d+)(?:\s|$)/);
    if (m) achados.add(m[1]);
  }
  return achados;
};
/** FROUXA: o id aparece em qualquer lugar da saída. */
const idsQualquerLugar = (saida) =>
  new Set([...saida.matchAll(/\b([A-Z]\d{3}-\d+)\b/g)].map((m) => m[1]));

// ── OS 12 CANÁRIOS CEGOS, com os ids provados e as gavetas certas ───────────
const CANARIOS = [
  ['E01', 'descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha',
    ['V089-24', 'V089-25'], ['dor', 'lesao']],
  ['E02', 'abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar',
    ['V167-17', 'V167-18'], ['dor', 'supino', 'ombros']],
  ['E03', 'eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita',
    ['F001-37', 'F001-47'], ['cinto', 'supino', 'erro-comum']],
  ['E04', 'seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos',
    ['F001-14', 'F001-28'], ['pegada', 'agacho', 'supino']],
  ['E05', 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo',
    ['F001-79'], ['equipamento', 'terra']],
  ['E06', 'meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda',
    ['V174-12', 'V174-16'], ['strap', 'terra', 'equipamento']],
  ['E07', 'durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao',
    ['V015-10', 'V015-12'], ['sono', 'recuperacao']],
  ['E08', 'na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso',
    ['G031-37', 'G031-38', 'G029-17'], ['antropometria', 'profundidade', 'agacho']],
  ['E09', 'uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida',
    ['G008-27', 'G008-29', 'G008-43'], ['carga-de-treino', 'volume', 'meta-metodologia']],
  ['E10', 'posso passar esparadrapo no dedao pra segurar melhor a barra no terra',
    ['F001-100'], ['equipamento', 'pegada']],
  ['E11', 'no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa',
    ['F001-30'], ['setup', 'supino']],
  ['E12', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca',
    ['V127-15', 'V127-13'], ['lesao', 'dor', 'selecao-exercicio']],
];

// ── O QUE OS TRÊS ROTEADORES ESCOLHERAM, sem ver o gabarito ─────────────────
// A ORDEM É A QUE ELES DERAM: o primeiro item é a gaveta PRINCIPAL.
const ROTEADORES = {
  'roteador 1': {
    E01: ['dor', 'recuperacao', 'lesao'],
    E02: ['supino', 'ombros', 'tecnica'],
    E03: ['supino', 'erro-comum', 'regras-ipf'],
    E04: ['pegada', 'regras-ipf', 'erro-comum'],
    E05: ['equipamento', 'sapato', 'terra'],
    E06: ['teste-de-forca', 'equipamento', 'training-max'],
    E07: ['sono', 'recuperacao'],
    E08: ['agacho', 'antropometria', 'profundidade', 'mobilidade'],
    E09: ['carga-de-treino', 'volume', 'intensidade'],
    E10: ['equipamento', 'regras-ipf', 'pegada'],
    E11: ['supino', 'erro-comum', 'regras-ipf', 'setup'],
    E12: ['ombros', 'dor', 'selecao-exercicio', 'supino'],
  },
  'roteador 2': {
    E01: ['dor', 'peito', 'recuperacao', 'lesao'],
    E02: ['ombros', 'supino', 'aprendizado-motor'],
    E03: ['supino', 'regras-ipf', 'erro-comum'],
    E04: ['pegada', 'regras-ipf', 'erro-comum'],
    E05: ['equipamento', 'sapato', 'terra'],
    E06: ['teste-de-forca', 'equipamento', 'competicao'],
    E07: ['sono', 'recuperacao'],
    E08: ['agacho', 'profundidade', 'antropometria', 'mobilidade'],
    E09: ['carga-de-treino', 'volume', 'intensidade'],
    E10: ['equipamento', 'regras-ipf', 'pegada', 'terra'],
    E11: ['erro-comum', 'regras-ipf', 'supino', 'setup'],
    E12: ['ombros', 'dor', 'lesao', 'selecao-exercicio'],
  },
  'roteador 3': {
    E01: ['dor', 'lesao', 'peito'],
    E02: ['tecnica', 'ombros', 'dor'],
    E03: ['regras-ipf', 'erro-comum', 'supino'],
    E04: ['pegada', 'regras-ipf', 'erro-comum'],
    E05: ['equipamento', 'regras-ipf', 'terra'],
    E06: ['teste-de-forca', 'equipamento', 'competicao'],
    E07: ['sono', 'recuperacao'],
    E08: ['agacho', 'antropometria', 'mobilidade', 'profundidade'],
    E09: ['carga-de-treino', 'volume', 'intensidade'],
    E10: ['equipamento', 'regras-ipf', 'pegada'],
    E11: ['erro-comum', 'regras-ipf', 'supino', 'setup'],
    E12: ['lesao', 'ombros', 'selecao-exercicio'],
  },
};

// ── 0. A CONFERÊNCIA DE PARSING, antes de qualquer conclusão ────────────────
console.log('='.repeat(78));
console.log('0. O QUE O COMANDO DE FATO EXECUTA');
console.log('='.repeat(78));
{
  const q = CANARIOS[0][1];
  const um = rodar(['--pergunta', q, '--topic', 'dor']);
  const tres = rodar(['--pergunta', q, '--topic', 'dor', 'lesao', 'recuperacao']);
  console.log(`  --topic dor                    → ${um.length} chars`);
  console.log(`  --topic dor lesao recuperacao  → ${tres.length} chars`);
  console.log(um === tres
    ? '  IDÊNTICOS: `--topic` lê UM valor. Cada gaveta escolhida vira UM comando; a tela é a união.'
    : '  DIFERENTES: `--topic` aceita vários. O parsing MUDOU — reveja a montagem abaixo.');

  const TOPICOS = carregarTopicos(ROOT);
  const nomes = new Set(TOPICOS.keys ? TOPICOS.keys() : Object.keys(TOPICOS));
  const inventadas = new Set();
  for (const escolhas of Object.values(ROTEADORES)) {
    for (const ts of Object.values(escolhas)) for (const t of ts) if (!nomes.has(t)) inventadas.add(t);
  }
  console.log(`  vocabulário fechado: ${nomes.size} gavetas`);
  console.log(inventadas.size === 0
    ? '  NENHUMA gaveta inventada: os 3 roteadores só citaram nomes que existem.'
    : `  GAVETAS INVENTADAS: ${[...inventadas].join(', ')}`);
}

// ── 1. O DETERMINÍSTICO SOZINHO ────────────────────────────────────────────
const log = [];
const determinista = {};
for (const [caso, q, esperados] of CANARIOS) {
  const args = ['--pergunta', q];
  const saida = rodar(args);
  log.push(`# ${caso} · determinístico\nnode research/tools/check-evidence.mjs --pergunta ${JSON.stringify(q)}\n`);
  const estrito = idsListados(saida);
  const frouxo = idsQualquerLugar(saida);
  const secoes = [...saida.matchAll(/GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
  determinista[caso] = {
    esperados,
    achouEstrito: esperados.filter((i) => estrito.has(i)),
    achouFrouxo: esperados.filter((i) => frouxo.has(i)),
    secoes,
    chars: saida.length,
  };
}

// ── 2. CADA ROTEADOR ───────────────────────────────────────────────────────
const placar = {};
for (const [nome, escolhas] of Object.entries(ROTEADORES)) {
  placar[nome] = {};
  for (const [caso, q, esperados, certas] of CANARIOS) {
    const ts = escolhas[caso];
    const estrito = new Set();
    const frouxo = new Set();
    let chars = 0;
    for (const t of ts) {
      const args = ['--pergunta', q, '--topic', t];
      const saida = rodar(args);
      log.push(`# ${caso} · ${nome} · gaveta ${t}\nnode research/tools/check-evidence.mjs --pergunta ${JSON.stringify(q)} --topic ${t}\n`);
      chars += saida.length;
      for (const i of idsListados(saida)) estrito.add(i);
      for (const i of idsQualquerLugar(saida)) frouxo.add(i);
    }
    const achouEstrito = esperados.filter((i) => estrito.has(i));
    const achouFrouxo = esperados.filter((i) => frouxo.has(i));
    placar[nome][caso] = {
      ts,
      gavetaCerta: ts.some((t) => certas.includes(t)),
      achouEstrito,
      achouFrouxo,
      completo: achouEstrito.length === esperados.length,
      esperados,
      chars,
    };
  }
}

// ── 3. AS TABELAS ──────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(78)}`);
console.log('1. POR CANÁRIO — ids esperados que APARECERAM na tela (régua estrita)');
console.log('='.repeat(78));
console.log('caso  esperados                     determ.  rot1     rot2     rot3');
for (const [caso, , esperados] of CANARIOS) {
  const cel = (o) => `${o.achouEstrito.length}/${esperados.length}`.padEnd(8);
  console.log(`${caso}   ${esperados.join(' ').padEnd(29)} ${cel(determinista[caso])} `
    + `${cel(placar['roteador 1'][caso])} ${cel(placar['roteador 2'][caso])} ${cel(placar['roteador 3'][caso])}`);
}

console.log(`\n${'='.repeat(78)}`);
console.log('2. PLACAR — as três contagens que a tarefa pede');
console.log('='.repeat(78));
console.log('roteador       gaveta certa   id na tela   TODOS os ids');
const resumo = [];
for (const nome of Object.keys(ROTEADORES)) {
  const l = Object.values(placar[nome]);
  const g = l.filter((x) => x.gavetaCerta).length;
  const t = l.filter((x) => x.achouEstrito.length > 0).length;
  const c = l.filter((x) => x.completo).length;
  resumo.push({ roteador: nome, gavetaCerta: g, idsNaTela: t, completos: c });
  console.log(`${nome.padEnd(14)} ${String(g).padEnd(14)} ${String(t).padEnd(12)} ${c}   (de 12)`);
}
{
  const l = Object.values(determinista);
  const t = l.filter((x) => x.achouEstrito.length > 0).length;
  const c = l.filter((x) => x.achouEstrito.length === x.esperados.length).length;
  console.log(`${'DETERMINÍSTICO'.padEnd(14)} ${'(n/a)'.padEnd(14)} ${String(t).padEnd(12)} ${c}   (de 12)`);
  resumo.push({ roteador: 'DETERMINISTICO', gavetaCerta: -1, idsNaTela: t, completos: c });
}

// ── 4. RÉGUA ESTRITA vs FROUXA ─────────────────────────────────────────────
console.log(`\n${'='.repeat(78)}`);
console.log('3. A DIVERGÊNCIA ENTRE AS DUAS RÉGUAS (id listado vs id só mencionado)');
console.log('='.repeat(78));
let divergencias = 0;
for (const nome of [...Object.keys(ROTEADORES)]) {
  for (const [caso] of CANARIOS) {
    const x = placar[nome][caso];
    const extra = x.achouFrouxo.filter((i) => !x.achouEstrito.includes(i));
    if (extra.length) {
      divergencias++;
      console.log(`  ${nome} ${caso}: ${extra.join(' ')} aparece na saída mas NÃO como entrada listada`);
    }
  }
}
for (const [caso] of CANARIOS) {
  const d = determinista[caso];
  const extra = d.achouFrouxo.filter((i) => !d.achouEstrito.includes(i));
  if (extra.length) {
    divergencias++;
    console.log(`  determinístico ${caso}: ${extra.join(' ')} mencionado, não listado`);
  }
}
if (!divergencias) console.log('  nenhuma: as duas réguas dão o mesmo número.');

// ── 5. UNANIMIDADE ─────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(78)}`);
console.log('4. UNANIMIDADE — os três escolheram a MESMA gaveta principal?');
console.log('='.repeat(78));
let unanimes = 0;
let unanimesConjunto = 0;
for (const [caso] of CANARIOS) {
  const principais = Object.keys(ROTEADORES).map((n) => placar[n][caso].ts[0]);
  const ok = new Set(principais).size === 1;
  if (ok) unanimes++;
  const conjuntos = Object.keys(ROTEADORES).map((n) => [...placar[n][caso].ts].sort().join('+'));
  const okc = new Set(conjuntos).size === 1;
  if (okc) unanimesConjunto++;
  console.log(`  ${caso}  ${ok ? 'SIM' : 'não'}  principais: ${principais.join(' | ')}${okc ? '   (conjunto idêntico)' : ''}`);
}
console.log(`\n  gaveta PRINCIPAL igual nos três: ${unanimes}/12`);
console.log(`  CONJUNTO inteiro igual nos três: ${unanimesConjunto}/12`);

// ── 6. CUSTO ───────────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(78)}`);
console.log('5. CUSTO POR CONSULTA (chars → tokens a ~4 chars/token)');
console.log('='.repeat(78));
const listaTopicos = rodar(['--topicos']);
console.log(`  --topicos (o glossário no prompt): ${listaTopicos.length} chars ≈ ${Math.round(listaTopicos.length / 4)} tokens`);
for (const nome of Object.keys(ROTEADORES)) {
  const l = Object.values(placar[nome]);
  const media = l.reduce((a, x) => a + x.chars, 0) / l.length;
  const nT = l.reduce((a, x) => a + x.ts.length, 0) / l.length;
  console.log(`  ${nome}: ${nT.toFixed(1)} comandos/pergunta, tela média ${Math.round(media)} chars ≈ ${Math.round(media / 4)} tokens`);
}
{
  const l = Object.values(determinista);
  const media = l.reduce((a, x) => a + x.chars, 0) / l.length;
  console.log(`  determinístico: 1 comando, tela média ${Math.round(media)} chars ≈ ${Math.round(media / 4)} tokens`);
}

// ── 7. ONDE A GAVETA ESTAVA CERTA E O ID NÃO VEIO ──────────────────────────
console.log(`\n${'='.repeat(78)}`);
console.log('6. O DEFEITO QUE IMPORTA: gaveta certa escolhida e o id NÃO apareceu');
console.log('='.repeat(78));
for (const nome of Object.keys(ROTEADORES)) {
  for (const [caso, , esperados] of CANARIOS) {
    const x = placar[nome][caso];
    if (x.gavetaCerta && x.achouEstrito.length < esperados.length) {
      const faltam = esperados.filter((i) => !x.achouEstrito.includes(i));
      console.log(`  ${nome} ${caso}: abriu [${x.ts.join(', ')}] e faltou ${faltam.join(' ')}`);
    }
  }
}

mkdirSync(join(AQUI, 'saida'), { recursive: true });
writeFileSync(join(AQUI, 'saida/comandos.txt'), log.join('\n'));
writeFileSync(join(AQUI, 'saida/placar.json'), JSON.stringify({ resumo, unanimes, unanimesConjunto, placar, determinista }, null, 2));
console.log(`\n  ${log.length} comandos executados, todos gravados em auditoria-onda2f/saida/comandos.txt`);
