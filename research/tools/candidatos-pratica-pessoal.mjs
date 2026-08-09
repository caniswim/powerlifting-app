#!/usr/bin/env node
/**
 * Gera a LISTA DE TRABALHO do retag de `pratica-pessoal`.
 *
 * A regra da fronteira está em `research/kb/PROTOCOLO-EXTRACAO.md`; o raciocínio
 * e o tamanho do que ela move estão em `research/kb/FRONTEIRA-MODO.md`. Este
 * arquivo existe para que a lista seja REPRODUZÍVEL — o defeito nº 1 desta base
 * é agente copiando convenção do vizinho, e uma lista colada num markdown é
 * exatamente isso: uma convenção sem como ser recontada.
 *
 * O QUE ELE NÃO É. Não é medida. Ele é um detector léxico sobre o `verbatim`
 * inglês, e um detector léxico não sabe se "six days a week" é o que o Vena faz
 * ou o que o programa do Nuckols manda. Conferido à mão nos **115** acertos do
 * Tier A: **9 falsos positivos, ~92 % de precisão**, e os 9 estão nomeados um a
 * um no `FRONTEIRA-MODO.md` §4.3 para a onda 2 não os mover.
 *
 * A RECALL é que é ruim — hábito sem advérbio ("depois do cinto ele coloca as
 * joelheiras", `G048-52`; "o segundo dia é Spoto press", `V170-38`) não tem
 * marcador nenhum e este script não o vê. O caso que mede o buraco é `V003-18`
 * ("ele cronometra todos os descansos: 5 min em agacho e terra, 3 min no
 * supino"): é rotina inequívoca, está nos casos de fronteira do protocolo, e
 * **não sai em nenhum dos dois tiers**.
 *
 * **QUANTO É "ruim": ~22 %, e o número é medido, não estimado.** A primeira
 * versão deste cabeçalho dizia *"Tier A + Tier B dão 248 ids; a amostra estima
 * ~425, então o detector enxerga pouco mais da metade"* — e essa conta divide um
 * número de CANDIDATOS por um número de ACERTOS, isto é, conta os próprios
 * falsos positivos como cobertura. Pelos números do próprio documento (Tier A com
 * ~92 % de precisão, Tier B com "precisão bem menor") os 248 candidatos valem no
 * máximo ~170 acertos, e "metade" já cai para ~40 %.
 *
 * Medido de fora, numa amostra cega de 40 claims que não passou pelo detector
 * (`--recall`): 9 eram prática habitual pela regra do protocolo, e o detector via
 * **2**. Recall ~22 %, IC 95 % (Wilson) de 6 % a 55 % — n = 9 não compra mais do
 * que isso, e o ponto não depende da precisão do intervalo: **o detector não
 * enxerga a maior parte do trabalho.**
 *
 * Então: **o Tier A é para revisar e mover; a ausência daqui não é absolvição.**
 * E — a consequência que custa caro — **nenhuma catraca pode usar a saída deste
 * script como universo.** Uma catraca que conte "Tier A que ainda não está em
 * `pratica-pessoal`" chega a zero retagando 115 claims e deixa ~300 misfiladas,
 * verde. Ver `FRONTEIRA-MODO.md` §5.
 *
 * Uso:
 *   node research/tools/candidatos-pratica-pessoal.mjs           # resumo
 *   node research/tools/candidatos-pratica-pessoal.mjs --tier A  # lista
 *   node research/tools/candidatos-pratica-pessoal.mjs --tier B
 *   node research/tools/candidatos-pratica-pessoal.mjs --ids     # só ids
 *   node research/tools/candidatos-pratica-pessoal.mjs --amostra # a amostra à mão
 *   node research/tools/candidatos-pratica-pessoal.mjs --ic      # o IC do §4.1
 *   node research/tools/candidatos-pratica-pessoal.mjs --tempo   # passado por gaveta
 *   node research/tools/candidatos-pratica-pessoal.mjs --recall # a amostra cega e o recall
 *
 * `--amostra` reimprime EXATAMENTE as 60 claims que o `FRONTEIRA-MODO.md` §4 diz
 * ter lido à mão (`narrativa` + `PESSOAL`, ordenadas por id, uma a cada 24).
 * Existe para que o número da amostra seja recontável por outra pessoa — o
 * `ESTADO.md` abre dizendo que número de qualidade sem instrumento nomeado é
 * opinião com cara de medida, e uma amostra que só o autor sabe refazer é isso.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');

/**
 * TAXA — recorrência com unidade de tempo. É o marcador forte: "por semana"
 * transforma a frase numa DOSE, e dose é o que se copia.
 */
const TAXA =
  /\b(per (?:week|day|session)|times (?:a|per) (?:week|day)|days? (?:a|per) week|every (?:day|week|session|single day|morning|night)|each (?:week|day|session)|weekly|daily|a week\b)\b/i;

/**
 * HABITO — recorrência sem unidade de tempo: política, default, rotina.
 * Marcador fraco: pega o hábito, mas também pega "I usually think that…", que
 * é `opiniao`. Por isso é Tier B e não Tier A.
 */
const HABITO =
  /\b(usually|always|typically|generally|normally|routinely|i try to|i try and|i like to|i tend to|i prefer|i aim|i never|my normal|my regular|my go-?to|whenever i|for the most part)\b/i;

/**
 * EPIS — anti-marcador. Evento único e datado. Se ele aparece, a frase é
 * `narrativa` mesmo tendo um advérbio de frequência colado ("last week I hit an
 * all-time PR"), e o candidato sai do Tier A.
 */
const EPIS =
  /\b(last (?:week|time|meet|cycle|year|month)|yesterday|today|this (?:set|rep|attempt)|first attempt|second attempt|third attempt|opener|pr\b|all-?time)\b/i;

const claims = [];
for (const f of readdirSync(EXTRACT).filter((f) => f.endsWith('.jsonl'))) {
  const txt = readFileSync(join(EXTRACT, f), 'utf8').trim();
  if (!txt) continue;
  for (const linha of txt.split('\n')) {
    if (linha.trim()) claims.push(JSON.parse(linha));
  }
}

/**
 * `relato-de-programa` e `avaliacao-de-terceiro` ficam de fora do universo: a
 * frequência que aparece neles é do programa alheio ou do corpo alheio, não da
 * prática dele. Mover isso para `pratica-pessoal` seria reintroduzir, de trás
 * para frente, o achatamento que aqueles dois valores existem para desfazer.
 */
const IGNORA = new Set(['relato-de-programa', 'avaliacao-de-terceiro', 'prescricao', 'estudo']);

const universo = claims.filter(
  (c) => c.scope === 'PESSOAL' && c.modo && !IGNORA.has(c.modo)
);
const temDose = (c) => (c.params || []).length > 0;
const vb = (c) => c.verbatim || '';

const tierA = universo.filter((c) => TAXA.test(vb(c)) && temDose(c) && !EPIS.test(vb(c)));
const setA = new Set(tierA.map((c) => c.id));
const tierB = universo.filter(
  (c) => !setA.has(c.id) && (TAXA.test(vb(c)) || HABITO.test(vb(c))) && !EPIS.test(vb(c))
);

const dist = (s) => {
  const d = {};
  for (const c of s) d[c.modo] = (d[c.modo] || 0) + 1;
  return Object.entries(d).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(' ');
};

const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const tier = arg('--tier');
const soIds = process.argv.includes('--ids');

/**
 * `--tempo` reconta o número que decidiu a fusão de `anedota` em `narrativa`:
 * quanto de PASSADO tem cada uma das duas gavetas. Se a fronteira que os 18 lotes
 * usaram (passado → `anedota`) fosse real, isto sairia perto de 0 % contra 100 %.
 * Sai 32 % contra 48 %, que é borrão, não fronteira — e é o argumento inteiro do
 * `FRONTEIRA-MODO.md` §1.2. Fica no código porque número de qualidade sem
 * instrumento nomeado é opinião com cara de medida (`ESTADO.md`, topo).
 */
const PASSADO =
  /\b(i (?:did|was|had|hit|went|got|used to|ended up|started|tried|felt|ran|pulled|squatted|benched|lost|gained|took|made|came|found|noticed|realized|competed|dropped|stopped|quit)|i'?ve (?:been|had|done|seen|hit|noticed|gotten|run)|we were|it was|last (?:time|week|year|month|meet|cycle|block)|back (?:then|when|in)|years ago|when i was|at the time|that (?:day|session|meet))\b/i;

if (process.argv.includes('--tempo')) {
  for (const m of ['narrativa', 'anedota']) {
    const s = claims.filter((c) => c.modo === m && c.scope === 'PESSOAL');
    const p = s.filter((c) => PASSADO.test(vb(c))).length;
    console.log(`${m.padEnd(10)} PESSOAL  n=${String(s.length).padStart(4)}  com passado no verbatim: ${p} (${((p / s.length) * 100).toFixed(0)} %)`);
  }
  process.exit(0);
}

/**
 * `--ic` reconta o número que o `FRONTEIRA-MODO.md` §4.1 usa para dimensionar a
 * onda 2. As três constantes abaixo são a ÚNICA coisa aqui que é leitura humana:
 * as 60 claims que `--amostra` imprime foram classificadas à mão. Todo o resto —
 * o universo e o intervalo — é calculado, e por isso é recontável por outra
 * pessoa sem refazer a leitura.
 *
 * O intervalo é Wilson e não normal de propósito: com n = 60 e p perto de 0,25,
 * a aproximação normal escorrega para baixo e devolve um limite inferior que a
 * amostra não sustenta. Estava escrito "Wilson" no documento com um número que
 * não era de Wilson — que é exatamente o defeito nº 3 desta casa, documento e
 * código divergindo em silêncio, cometido dentro do arquivo que o denuncia.
 */
const AMOSTRA_N = 60;
const AMOSTRA_INEQUIVOCAS = 15;
const AMOSTRA_MISTAS = 7;

/** Wilson score interval, 95 %. Devolve [lo, hi] em proporção. */
function wilson(k, n, z = 1.96) {
  const p = k / n;
  const den = 1 + (z * z) / n;
  const centro = (p + (z * z) / (2 * n)) / den;
  const margem = (z / den) * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return [centro - margem, centro + margem];
}

if (process.argv.includes('--ic')) {
  const universo = claims.filter(
    (c) => c.modo === 'narrativa' && c.scope === 'PESSOAL'
  ).length;
  console.log(`universo: narrativa|PESSOAL = ${universo} claims`);
  console.log(`amostra à mão: n = ${AMOSTRA_N} (--amostra imprime quais)\n`);
  for (const [rot, k] of [
    ['só as inequívocas', AMOSTRA_INEQUIVOCAS],
    ['somando as mistas', AMOSTRA_INEQUIVOCAS + AMOSTRA_MISTAS],
  ]) {
    const p = k / AMOSTRA_N;
    const [lo, hi] = wilson(k, AMOSTRA_N);
    console.log(
      `${rot.padEnd(18)} ${k}/${AMOSTRA_N} = ${(p * 100).toFixed(1)} % → ` +
        `${Math.round(p * universo)} claims, ` +
        `IC 95 % (Wilson) ${Math.round(lo * universo)}–${Math.round(hi * universo)}`
    );
  }
  console.log(
    '\nA faixa é o que n = 60 compra. Não estreite o número sem aumentar a amostra.'
  );
  process.exit(0);
}

/**
 * `--recall` — a amostra CEGA, e a única medida do buraco de recall que não sai
 * do próprio detector.
 *
 * Por que cega: a amostra do `--amostra` foi lida pelo autor da regra, e um
 * detector avaliado contra a lista de quem o escreveu mede concordância, não
 * cobertura. Esta aqui foi sorteada por passo fixo sobre `narrativa` + `anedota`
 * + `fato` em `PESSOAL`, EXCLUINDO os ids já citados nos três documentos — para
 * que quem classificou não estivesse lendo a resposta do outro.
 *
 * `CEGA_HABITO` é a única leitura humana: os ids que, aplicando a regra do
 * `PROTOCOLO-EXTRACAO.md` sem consultar as listas, foram julgados
 * `pratica-pessoal`. Todo o resto é calculado — inclusive a interseção com os
 * tiers, que é o número que importa.
 */
const CEGA_PASSO = 45;
const CEGA_OFFSET = 11;
const CEGA_TAMANHO = 40;
/** Ids citados em FRONTEIRA-MODO.md, PROTOCOLO-EXTRACAO.md e neste cabeçalho. */
const CEGA_EXCLUI = new Set(
  `V043-09 V043-13 V043-22 V043-24 V059-12 V117-11 G019-35 V170-03 V003-18 G040-17
   V015-03 V118-15 V024-02 V044-01 V173-05 V152-19 V028-08 V083-03 V009-20 V175-11
   V170-33 G035-07 G048-52 V170-38 V027-01 V078-22 V050-23 V106-02 V133-26 V175-63
   V006-24 V034-25 V003-04 V003-05 V003-10 V003-30 V075-03 V075-05 V039-27 G034-04
   G041-15 V033-03 V033-04 V036-03 V020-03 V173-12 G048-16 V110-17`.split(/\s+/)
);
/** Julgados `pratica-pessoal` à mão, às cegas, entre os 40. */
const CEGA_HABITO = `G012-03 G044-07 V033-06 V038-05 V081-26 V088-19 V135-12 V169-08 V175-05`
  .split(/\s+/);

if (process.argv.includes('--recall')) {
  const uni = claims
    .filter(
      (c) =>
        c.scope === 'PESSOAL' &&
        ['narrativa', 'anedota', 'fato'].includes(c.modo) &&
        !CEGA_EXCLUI.has(c.id)
    )
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  const cega = [];
  for (let i = CEGA_OFFSET; i < uni.length && cega.length < CEGA_TAMANHO; i += CEGA_PASSO) {
    cega.push(uni[i]);
  }
  const vistos = CEGA_HABITO.filter((id) => setA.has(id) || new Set(tierB.map((c) => c.id)).has(id));
  const universoTotal = claims.filter(
    (c) => c.scope === 'PESSOAL' && ['narrativa', 'anedota', 'fato'].includes(c.modo)
  ).length;
  const [plo, phi] = wilson(CEGA_HABITO.length, cega.length);
  const [rlo, rhi] = wilson(vistos.length, CEGA_HABITO.length);

  console.log(`amostra cega: ${cega.length} de ${uni.length} elegíveis (passo ${CEGA_PASSO}, offset ${CEGA_OFFSET})`);
  console.log(`  ids: ${cega.map((c) => c.id).join(' ')}\n`);
  console.log(`prática habitual à mão: ${CEGA_HABITO.length}/${cega.length} = ${((100 * CEGA_HABITO.length) / cega.length).toFixed(1)} %`);
  console.log(
    `  → sobre ${universoTotal} claims narrativa+anedota+fato|PESSOAL: ` +
      `${Math.round((CEGA_HABITO.length / cega.length) * universoTotal)} claims, ` +
      `IC 95 % (Wilson) ${Math.round(plo * universoTotal)}–${Math.round(phi * universoTotal)}`
  );
  console.log('  (corrobora a amostra do §4.1, que foi lida por outra pessoa e sobre outro recorte)\n');
  console.log(`RECALL do detector: ${vistos.length}/${CEGA_HABITO.length} = ${((100 * vistos.length) / CEGA_HABITO.length).toFixed(0)} % ` +
    `— IC 95 % (Wilson) ${(rlo * 100).toFixed(0)}–${(rhi * 100).toFixed(0)} %`);
  console.log(`  vistos: ${vistos.join(' ') || '(nenhum)'}`);
  console.log(`  cegos:  ${CEGA_HABITO.filter((id) => !vistos.includes(id)).join(' ')}`);
  console.log('\nÉ por isso que nenhuma catraca pode ter a saída deste script como universo.');
  process.exit(0);
}

if (process.argv.includes('--amostra')) {
  const n = claims
    .filter((c) => c.modo === 'narrativa' && c.scope === 'PESSOAL')
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  const PASSO = 24;
  const amostra = [];
  for (let i = 0; i < n.length && amostra.length < 60; i += PASSO) amostra.push(n[i]);
  for (const c of amostra) {
    console.log(`${c.id}  ${c.claim}`);
    console.log(`      VB: ${vb(c).slice(0, 140)}`);
  }
  console.error(`\n${amostra.length} de ${n.length} narrativa|PESSOAL, passo ${PASSO}.`);
  process.exit(0);
}

const alvo = tier === 'A' ? tierA : tier === 'B' ? tierB : null;

if (!alvo) {
  console.log(`universo PESSOAL elegível: ${universo.length}`);
  console.log(`Tier A (taxa no verbatim + dose declarada): ${tierA.length}  [${dist(tierA)}]`);
  console.log(`Tier B (recorrência sem taxa ou sem dose):  ${tierB.length}  [${dist(tierB)}]`);
  console.log('\n--tier A | --tier B para a lista, --ids para só os ids.');
  console.log('Recall é ruim de propósito conhecido: ver o cabeçalho deste arquivo.');
} else {
  for (const c of alvo.sort((a, b) => (a.id < b.id ? -1 : 1))) {
    if (soIds) console.log(c.id);
    else console.log(`${c.id}  [${c.modo}]  ${c.claim}`);
  }
  console.error(`\n${alvo.length} claims no Tier ${tier}.`);
}
