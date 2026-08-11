#!/usr/bin/env node
/**
 * A VARREDURA QUE ESCOLHE OS NÚMEROS DA TELA POR SEÇÃO.
 *
 * Substitui `medir-alocacao.mjs` e `medir-vagas.mjs`, que mediam a repartição de
 * um orçamento único — a coisa que deixou de existir em 13/08/2026, quando a
 * tela plana virou uma seção por gaveta.
 *
 * Roda TODO canário com id esperado — os 19 de `ROTAS.json` e os 61 de
 * `CANARIOS.json` — contra uma combinação de `porSecao`, `secoes`,
 * `ligacoesDaSecao` e `ladoDaSecao`, e reporta:
 *
 *   ids     — quantos ids esperados chegam à tela, somados
 *   casos   — em quantos canários TODOS os ids chegam
 *   algum   — em quantos chega ao menos um
 *   posMed  — a posição MEDIANA do primeiro id esperado na tela (precisão do
 *             topo: era 8 em 12/08, 6 em 11/08)
 *   tela    — o tamanho MEDIANO da tela em ids (o custo)
 *   estr    — o tamanho MEDIANO da tela nas perguntas ESTREITAS (saber devolver
 *             pouco: 32 de 33 perguntas devolviam exatamente 40 em 11/08)
 *
 * **Não é trava.** É o instrumento, e ele existe porque escolher constante por
 * gosto é o que esta casa proíbe. A tabela que escolheu os números de hoje está
 * no `RECUPERACAO.md` §23, e este comando a reproduz.
 *
 * Uso:
 *   node research/tools/medir-secoes.mjs                    # a grade de porSecao
 *   node research/tools/medir-secoes.mjs --grade ligacoes   # a grade do ledger
 *   node research/tools/medir-secoes.mjs --grade lado       # a grade da página ao lado
 *   node research/tools/medir-secoes.mjs --detalhe --porSecao 12
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { indexar, carregarVocabulario } from './busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta, telaDaResposta } from './roteador.mjs';
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
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const rotas = JSON.parse(readFileSync(join(ROOT, 'research/kb/ROTAS.json'), 'utf8'));
const cans = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));

const CASOS = [];
for (const c of rotas.casos) {
  if (c.familia !== 'mapeia' || !(c.sustenta ?? []).length) continue;
  CASOS.push({
    id: c.id,
    pergunta: c.pergunta,
    ids: c.sustenta,
    forcar: c.forcaTopico ? [c.forcaTopico] : [],
    forcada: (c.tela ?? rotas.tela).porSecaoForcada,
  });
}
for (const c of cans.canarios ?? []) {
  if (c.familia !== 'presente' && c.familia !== 'presente-escondido') continue;
  if (!(c.sustenta ?? []).length || !c.pergunta) continue;
  CASOS.push({
    id: c.id, pergunta: c.pergunta, ids: c.sustenta, forcar: [], forcada: undefined,
  });
}

/** Perguntas de resposta ESTREITA — uma linha do regulamento, um sim/não. */
const ESTREITAS = [
  'o cinto pode ter mais de 13 mm de espessura na IPF',
  'a IPF permite meia sem ser a de terra',
  'quantos comandos tem o supino na IPF',
  'joelheira pode ter mais de 30 cm',
  'a barra tem de encostar no peito no supino',
];

const mediana = (xs) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

function medir(orcamento) {
  const { porSecao, secoes, ligacoes, lado, afins } = orcamento;
  let ids = 0;
  let completos = 0;
  let algum = 0;
  let totalIds = 0;
  const posicoes = [];
  const posSecao = [];
  const tamanhos = [];
  const detalhe = [];
  for (const caso of CASOS) {
    const r = responder(claims, caso.pergunta, {
      topicos: TOPICOS,
      glossario: GLOSSARIO,
      vocabulario: VOCAB,
      idx: IDX,
      perfis: PERFIS,
      forcar: caso.forcar,
      tela: {
        porSecao, secoes, porSecaoForcada: caso.forcada ?? porSecao, ligacoes, lado, afins,
      },
    });
    const tela = telaDaResposta(r).map((x) => x.id);
    const achados = caso.ids.filter((i) => tela.includes(i));
    ids += achados.length;
    totalIds += caso.ids.length;
    if (achados.length === caso.ids.length) completos += 1;
    if (achados.length > 0) {
      algum += 1;
      posicoes.push(Math.min(...achados.map((i) => tela.indexOf(i) + 1)));
      /**
       * A POSIÇÃO DENTRO DA SEÇÃO — a leitura que a forma nova induz. Quem lê
       * cinco blocos rotulados não lê uma lista de 86; lê o topo de cada bloco.
       * A posição na concatenação continua sendo medida ao lado, porque foi ela
       * que a onda anterior publicou e comparar com outra coisa seria trocar a
       * régua no meio da medição.
       */
      const linhas = telaDaResposta(r);
      posSecao.push(Math.min(...achados.map((i) => {
        const l = linhas.find((x) => x.id === i);
        return l ? l.posicaoNaSecao : 999;
      })));
    }
    tamanhos.push(new Set(tela).size);
    detalhe.push({ id: caso.id, achados: achados.length, de: caso.ids.length, tela: new Set(tela).size });
  }
  const estreitas = ESTREITAS.map((q) => {
    const r = responder(claims, q, {
      topicos: TOPICOS,
      glossario: GLOSSARIO,
      vocabulario: VOCAB,
      idx: IDX,
      perfis: PERFIS,
      tela: { porSecao, secoes, ligacoes, lado, afins },
    });
    return new Set(telaDaResposta(r).map((x) => x.id)).size;
  });
  return {
    ids, totalIds, completos, algum, casos: CASOS.length, detalhe,
    posMed: mediana(posicoes),
    posSecMed: mediana(posSecao),
    telaMed: mediana(tamanhos),
    estrMed: mediana(estreitas),
  };
}

const base = {
  porSecao: Number(arg('--porSecao') ?? 18),
  secoes: Number(arg('--secoes') ?? 5),
  ligacoes: Number(arg('--ligacoes') ?? 16),
  lado: Number(arg('--lado') ?? 8),
  afins: Number(arg('--afins') ?? 6),
};

const GRADES = {
  porSecao: [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 40],
  secoes: [1, 2, 3, 4, 5, 6, 8],
  ligacoes: [0, 2, 3, 4, 6, 8, 12],
  lado: [0, 1, 2, 3, 4, 6, 8],
  afins: [0, 1, 2, 3, 4, 6, 8, 12],
};

const qual = arg('--grade') ?? 'porSecao';
if (!GRADES[qual]) {
  console.error(`--grade "${qual}" não existe. Use: ${Object.keys(GRADES).join(', ')}`);
  process.exit(2);
}

console.log(`\n${CASOS.length} canários com id esperado · base ${JSON.stringify(base)}`);
console.log(`varrendo "${qual}"\n`);
console.log(`${qual.padEnd(9)} ids/tot     completos  algum  posMed  posSec  telaMed  estreitaMed`);
for (const v of GRADES[qual]) {
  const m = medir({ ...base, [qual]: v });
  const marca = v === base[qual] ? '  ← hoje' : '';
  console.log(
    `${String(v).padEnd(9)} ${String(m.ids).padStart(3)}/${String(m.totalIds).padEnd(4)}   `
      + `${String(m.completos).padStart(3)}/${m.casos}    ${String(m.algum).padStart(3)}    `
      + `${String(m.posMed).padStart(4)}    ${String(m.posSecMed).padStart(4)}    `
      + `${String(m.telaMed).padStart(5)}    ${String(m.estrMed).padStart(6)}${marca}`,
  );
}

if (process.argv.includes('--detalhe')) {
  const m = medir(base);
  console.log('\ncaso a caso, no orçamento de base:');
  for (const d of m.detalhe) {
    console.log(`  ${d.id.padEnd(5)} ${d.achados}/${d.de}  tela=${d.tela}`);
  }
}
console.log('');
