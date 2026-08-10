#!/usr/bin/env node
/**
 * BANCADA DE MEDIÇÃO DA ALOCAÇÃO DE VAGAS.
 *
 * Não é trava — é o instrumento com que a alocação foi calibrada. Ele roda um
 * conjunto de perguntas com alvo conhecido e imprime, para cada uma: quantas
 * vagas cada gaveta roteada levou, em que posição cada id alvo caiu, e quantas
 * claims a tela devolveu no total.
 *
 * Existe separado de `check-rotas.mjs` porque as duas coisas são diferentes: a
 * trava afirma um resultado e falha se ele mudar; esta bancada mostra a
 * distribuição, que é o que se olha para escolher um número.
 *
 * Uso:
 *   node research/tools/medir-vagas.mjs             # os casos nomeados
 *   node research/tools/medir-vagas.mjs --canarios  # os P##/C## do CANARIOS.json
 *   node research/tools/medir-vagas.mjs --pergunta "…" --ids V079-34,V001-06
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta } from './roteador.mjs';
import { carregarGlossario, indexarGlossario } from './glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};

const { claims, porId } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const idx = indexar(claims);
const perfis = perfilarTopicos(claims);

const CASOS = [
  {
    nome: 'FISGADA',
    pergunta: 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',
    ids: ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'],
  },
  {
    nome: 'ORDEM',
    pergunta: 'quando cai agacho e supino na mesma sessão, tanto faz qual eu faço primeiro',
    ids: ['G014-10', 'G016-10'],
  },
  {
    nome: 'CINTO',
    pergunta: 'o cinto pode ter mais de 13 mm de espessura na IPF',
    ids: ['F001-83', 'F001-84'],
  },
  {
    nome: 'DESCANSO',
    pergunta: 'quanto descansar entre as séries?',
    ids: [],
  },
  {
    nome: 'PROTEINA',
    pergunta: 'quanto de proteína por dia',
    ids: [],
  },
];

const perguntaAvulsa = arg('--pergunta');
if (perguntaAvulsa) {
  CASOS.length = 0;
  CASOS.push({
    nome: 'AVULSA',
    pergunta: perguntaAvulsa,
    ids: (arg('--ids') ?? '').split(',').map((x) => x.trim()).filter(Boolean),
  });
}

if (process.argv.includes('--canarios')) {
  const doc = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));
  CASOS.length = 0;
  for (const c of doc.canarios ?? []) {
    if (c.familia !== 'presente' && c.familia !== 'presente-escondido') continue;
    CASOS.push({ nome: c.id, pergunta: c.pergunta, ids: c.sustenta ?? [] });
  }
}

const telaDe = (r) => {
  const ordem = [];
  const visto = new Set();
  const push = (c, canal) => {
    if (visto.has(c.id)) return;
    visto.add(c.id);
    ordem.push({ id: c.id, canal });
  };
  for (const x of r.claims) push(x.c, 'rota');
  for (const x of r.params.lista) push(x.c, 'param');
  for (const v of r.vizinhos) push(v.c, v.canal ?? 'viz');
  for (const v of r.ligacoes ?? []) push(v.c, 'ligacao');
  return ordem;
};

const canais = arg('--canais')
  ? Object.fromEntries(['rota', 'param', 'ligacao', 'lado'].map((k, i) => [k, Number(arg('--canais').split(',')[i])]))
  : {};
const opcoes = {};
if (arg('--piso')) opcoes.piso = Number(arg('--piso'));
if (arg('--cotaAfim')) opcoes.cotaAfim = Number(arg('--cotaAfim'));
if (arg('--expoente')) opcoes.expoente = Number(arg('--expoente'));

let achouTotal = 0;
let idsTotal = 0;
let completos = 0;
for (const caso of CASOS) {
  const r = responder(claims, caso.pergunta, {
    topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx, perfis, canais, vagas: opcoes,
  });
  const tela = telaDe(r).slice(0, 40);
  const posicao = new Map(tela.map((x, i) => [x.id, i + 1]));
  const vagas = new Map();
  for (const x of r.claims) {
    const t = x.topicos[0] ?? '?';
    vagas.set(t, (vagas.get(t) ?? 0) + 1);
  }
  const distrib = r.rotas
    .map((rt) => `${rt.topico}(${rt.claims})=${r.vagas?.get(rt.topico) ?? '?'}:${r.claims.filter((x) => x.topicos[0] === rt.topico).length}`)
    .join('  ');
  const achou = caso.ids.filter((i) => posicao.has(i));
  achouTotal += achou.length;
  idsTotal += caso.ids.length;
  if (caso.ids.length > 0 && achou.length === caso.ids.length) completos += 1;
  console.log(`\n${caso.nome.padEnd(10)} tela=${tela.length}  rota=${r.claims.length}  param=${r.params.lista.length}  viz=${r.vizinhos.length}`);
  console.log(`           ${distrib || '(não mapeou: ' + r.motivo + ')'}`);
  if (caso.ids.length > 0) {
    console.log(`           alvo: ${caso.ids.map((i) => `${i}@${posicao.get(i) ?? '—'}`).join(' ')}   ${achou.length}/${caso.ids.length}`);
  }
}
console.log(`\nTOTAL ids na tela: ${achouTotal}/${idsTotal} · casos completos: ${completos}/${CASOS.filter((c) => c.ids.length > 0).length}\n`);
