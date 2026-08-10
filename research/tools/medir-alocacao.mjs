#!/usr/bin/env node
/**
 * A VARREDURA QUE ESCOLHE OS NÚMEROS DA ALOCAÇÃO.
 *
 * Roda TODO canário com ids esperados — os 19 de `ROTAS.json` e os 34 de
 * `CANARIOS.json` (P01–P18, C01–C05, C16–C19, B01–B12) — contra uma combinação
 * de `piso`, `expoente` e `cotaAfim`, e reporta:
 *
 *   ids     — quantos ids esperados chegam à tela, somados
 *   casos   — em quantos canários TODOS os ids chegam
 *   algum   — em quantos chega ao menos um
 *   tela    — o tamanho MEDIANO da tela (o número que mede "saber devolver
 *             pouco": era 40 em 32 de 33 perguntas)
 *
 * Não é trava. É o instrumento, e ele existe porque escolher constante por gosto
 * é o que esta casa proíbe.
 *
 * Uso:
 *   node research/tools/medir-alocacao.mjs                       # a grade inteira
 *   node research/tools/medir-alocacao.mjs --detalhe             # caso a caso, no default
 *   node research/tools/medir-alocacao.mjs --expoente 1 --detalhe
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
import {
  responder, perfilarTopicos, termosDaPergunta, PISO_VAGAS, COTA_AFIM, EXPOENTE_SURPRESA,
} from './roteador.mjs';
import { carregarGlossario, indexarGlossario } from './glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};

const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const idx = indexar(claims);
const perfis = perfilarTopicos(claims);

const rotas = JSON.parse(readFileSync(join(ROOT, 'research/kb/ROTAS.json'), 'utf8'));
const cans = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));

const CASOS = [];
for (const c of rotas.casos) {
  if (c.familia !== 'mapeia' || !(c.sustenta ?? []).length) continue;
  CASOS.push({
    id: c.id,
    pergunta: c.pergunta,
    ids: c.sustenta,
    teto: c.tetoDeTela ?? rotas.tetoDeTela,
    forcar: c.forcaTopico ? [c.forcaTopico] : [],
    viaPaginaAoLado: c.viaPaginaAoLado ?? [],
    proibidos: c.topicosProibidos ?? [],
  });
}
for (const c of cans.canarios ?? []) {
  if (c.familia !== 'presente' && c.familia !== 'presente-escondido') continue;
  if (!(c.sustenta ?? []).length || !c.pergunta) continue;
  CASOS.push({
    id: c.id, pergunta: c.pergunta, ids: c.sustenta, teto: 40, forcar: [], viaPaginaAoLado: [], proibidos: [],
  });
}

// Os três casos NOMEADOS pela onda 2D, que não são canários de arquivo nenhum:
// o alvo mínimo declarado no briefing.
CASOS.push({
  id: 'FISG',
  pergunta: 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',
  ids: ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'],
  teto: 40,
  forcar: [],
  viaPaginaAoLado: [],
  proibidos: [],
});

// As perguntas de PRECISÃO: nenhuma tem resposta larga, e a tela delas mede o
// preço da alocação generosa.
const ESTREITAS = [
  'o cinto pode ter mais de 13 mm de espessura na IPF',
  'a munhequeira pode ter mais de 1 metro de comprimento na IPF',
  'com quanta antecedência eu tenho que escolher a categoria de peso',
];

function telaDe(r) {
  const ordem = [];
  const visto = new Set();
  const push = (c, canal) => {
    if (visto.has(c.id)) return;
    visto.add(c.id);
    ordem.push({ id: c.id, canal });
  };
  for (const x of r.claims) push(x.c, 'rota');
  for (const x of r.params.lista) push(x.c, 'param');
  for (const v of r.ligacoes ?? []) push(v.c, 'ligacao');
  for (const v of r.vizinhos) push(v.c, v.canal ?? 'viz');
  return ordem;
}

function medir(opts, { detalhe = false, canais = {} } = {}) {
  let ids = 0;
  let idsTotal = 0;
  let completos = 0;
  let algum = 0;
  let paginaAoLado = 0;
  let paginaAoLadoTotal = 0;
  let injecao = 0;
  const tamanhos = [];
  for (const caso of CASOS) {
    const r = responder(claims, caso.pergunta, {
      topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx, perfis, vagas: opts, canais, teto: caso.teto, forcar: caso.forcar,
    });
    const tela = telaDe(r).slice(0, caso.teto);
    const pos = new Map(tela.map((x, i) => [x.id, i + 1]));
    const achou = caso.ids.filter((i) => pos.has(i));
    ids += achou.length;
    idsTotal += caso.ids.length;
    if (achou.length === caso.ids.length) completos += 1;
    if (achou.length > 0) algum += 1;
    tamanhos.push(tela.length);
    const doLado = new Set(r.vizinhos.filter((v) => v.canal === 'rota').map((v) => v.c.id));
    paginaAoLadoTotal += caso.viaPaginaAoLado.length;
    paginaAoLado += caso.viaPaginaAoLado.filter((i) => doLado.has(i)).length;
    injecao += caso.proibidos.filter((t) => r.rotas.some((x) => x.topico === t)).length;
    if (detalhe) {
      console.log(
        `  ${caso.id.padEnd(4)} tela=${String(tela.length).padStart(2)}/${caso.teto}  `
          + `${achou.length}/${caso.ids.length}  `
          + caso.ids.map((i) => `${i}@${pos.get(i) ?? '—'}`).join(' '),
      );
    }
  }
  for (const q of ESTREITAS) {
    const r = responder(claims, q, {
      topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx, perfis, vagas: opts, canais,
    });
    tamanhos.push(telaDe(r).slice(0, 40).length);
    if (detalhe) console.log(`  estreita tela=${telaDe(r).slice(0, 40).length}  "${q.slice(0, 50)}"`);
  }
  tamanhos.sort((a, b) => a - b);
  return {
    ids,
    idsTotal,
    completos,
    algum,
    casos: CASOS.length,
    mediana: tamanhos[Math.floor(tamanhos.length / 2)],
    maxTela: tamanhos[tamanhos.length - 1],
    paginaAoLado: `${paginaAoLado}/${paginaAoLadoTotal}`,
    injecao,
  };
}

const detalhe = process.argv.includes('--detalhe');
if (process.argv.includes('--legado')) {
  console.log('\nA CAMADA DE 11/08 — ranking global, corte em 40 (estrategia: global)');
  // Os orçamentos de 11/08: rota 40, param 12 (TETO_PARAM), lado 8
  // (DETALHE_ROTEADO) e ledger inexistente.
  console.log(JSON.stringify(
    medir({ estrategia: 'global' }, { detalhe, canais: { rota: 40, param: 12, ligacao: 0, lado: 8 } }),
    null, 0,
  ));
  process.exit(0);
}
if (arg('--grade') === 'canais') {
  console.log('\nrota/param/lig/lado cota | ids      casos algum | tela(med/max) pagAoLado');
  for (const c of (arg('--canaisGrade') ?? '40,6,8,2|36,6,8,2|32,6,8,2|28,6,8,2|24,6,8,2|24,6,6,2').split('|')) {
    const [rota, param, ligacao, lado] = c.split(',').map(Number);
    for (const cotaAfim of (arg('--cotas') ?? '0.25,0.5,1').split(',').map(Number)) {
      const m = medir({ piso: Number(arg('--piso') ?? PISO_VAGAS), cotaAfim, expoente: Number(arg('--expoente') ?? EXPOENTE_SURPRESA) }, { canais: { rota, param, ligacao, lado } });
      console.log(`${c.padEnd(19)} ${String(cotaAfim).padStart(4)} | ${String(m.ids).padStart(3)}/${m.idsTotal}  ${String(m.completos).padStart(2)}/${m.casos}  ${String(m.algum).padStart(2)}/${m.casos} | ${String(m.mediana).padStart(3)}/${String(m.maxTela).padStart(3)}      ${m.paginaAoLado}`);
    }
  }
  process.exit(0);
}
if (detalhe || arg('--piso') || arg('--cotaAfim') || arg('--expoente') || arg('--canais')) {
  const opts = {
    piso: Number(arg('--piso') ?? PISO_VAGAS),
    cotaAfim: Number(arg('--cotaAfim') ?? COTA_AFIM),
    expoente: Number(arg('--expoente') ?? EXPOENTE_SURPRESA),
  };
  const canais = arg('--canais')
    ? Object.fromEntries(['rota', 'param', 'ligacao', 'lado'].map((k, i) => [k, Number(arg('--canais').split(',')[i])]))
    : {};
  console.log(`\npiso=${opts.piso} cotaAfim=${opts.cotaAfim} canais=${JSON.stringify(canais)}`);
  console.log(JSON.stringify(medir(opts, { detalhe, canais }), null, 0));
  process.exit(0);
}

console.log('\npiso  exp cota | ids      casos algum | tela(med/max) pagAoLado injecao');
for (const piso of (arg('--pisos') ?? '1,3,5,8').split(',').map(Number)) {
  for (const expoente of (arg('--expoentes') ?? '1,2,3,4').split(',').map(Number)) {
    for (const cotaAfim of (arg('--cotas') ?? '0,0.25,0.5,1').split(',').map(Number)) {
      const m = medir({ piso, expoente, cotaAfim });
      console.log(
        `${String(piso).padStart(4)} ${String(expoente).padStart(4)} ${String(cotaAfim).padStart(4)} | `
          + `${String(m.ids).padStart(3)}/${m.idsTotal}  ${String(m.completos).padStart(2)}/${m.casos}  ${String(m.algum).padStart(2)}/${m.casos} | `
          + `${String(m.mediana).padStart(3)}/${String(m.maxTela).padStart(3)}      ${m.paginaAoLado}      ${m.injecao}`,
      );
    }
  }
}
