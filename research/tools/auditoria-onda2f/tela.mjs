#!/usr/bin/env node
/**
 * UMA DEFINIÇÃO DE TELA? — nos DOIS sentidos, sobre 12 perguntas cegas + 5.
 *
 * O `secoes.test.mjs` cobra só um sentido (todo id de `r.tela` aparece na saída)
 * e só na fisgada. O sentido que falta é o caro: a CLI imprime id que NÃO está
 * na tela? Se imprime, a trava conta uma coisa e o agente lê outra.
 *
 * Uso: node research/tools/auditoria-onda2f/tela.mjs
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta, telaDaResposta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const PERGUNTAS = [
  ...JSON.parse(readFileSync(join(AQUI, 'cegos.json'), 'utf8')).map((c) => c.q),
  'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',
  'como melhorar meu agacho?',
  'quanto descansar entre as séries?',
  'o cinto pode ter mais de 13 mm de espessura na IPF',
  'quanto baixar o peso quando o RPE vem acima do alvo?',
];

let faltando = 0;
let sobrando = 0;
for (const q of PERGUNTAS) {
  const r = responder(claims, q, {
    topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: IDX, perfis: PERFIS,
  });
  const naTela = new Set(telaDaResposta(r).map((x) => x.id));
  const out = execFileSync('node', [CLI, '--pergunta', q], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  // só o corpo da tela: as linhas de claim, nunca os comandos sugeridos
  const impressos = new Set(
    out.split('\n')
      // fora: os comandos sugeridos, a PROSA fixa da CLI (que cita V033-03/04/05
      // como exemplo histórico) e os campos `condições:`/`conflita:` — que são
      // conteúdo de uma claim JÁ na tela, não uma linha da tela.
      .filter((l) => !l.trim().startsWith('node '))
      .filter((l) => !/condições:|conflita:/.test(l))
      .filter((l) => !/^\s{2,}(a saída, não a busca|nenhuma: foi ele)/.test(l))
      .flatMap((l) => [...l.matchAll(/\b([A-Z]\d{3}-\d+)\b/g)].map((m) => m[1])),
  );
  const f = [...naTela].filter((i) => !impressos.has(i));
  const s = [...impressos].filter((i) => !naTela.has(i));
  faltando += f.length;
  sobrando += s.length;
  if (f.length || s.length) {
    console.log(`  ${q.slice(0, 50)}…`);
    if (f.length) console.log(`     na tela e NÃO impressos: ${f.join(', ')}`);
    if (s.length) console.log(`     impressos e FORA da tela: ${s.join(', ')}`);
  }
}
console.log(`\n${PERGUNTAS.length} perguntas · ${faltando} id(s) na tela e não impressos · ${sobrando} id(s) impressos e fora da tela`);
console.log(faltando === 0 && sobrando === 0 ? 'A CLI imprime exatamente `telaDaResposta()`, nos dois sentidos.' : 'A CLI e a trava contam coisas diferentes.');
