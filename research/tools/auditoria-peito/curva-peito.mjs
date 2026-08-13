#!/usr/bin/env node
/**
 * A CURVA REAL DE EXPOSICAO DO PEITORAL — semana a semana, do GERADOR.
 *
 * Sucede `exposicao-peito.mjs` (que nunca chegou a ser rodado ate o fim pelo
 * agente que morreu) e `conta-peito.mjs` (que so olha as duas linhas de barra).
 * As diferencas que importam:
 *
 *   1. Conta AQUECIMENTO. `warmupSets` existe em toda linha e o §1.2 manda
 *      pausar 1,0 s "INCLUSIVE NOS 3 AQUECIMENTOS". Nenhum script anterior o
 *      somou, e a restricao R3 (supino >= 22 series) tambem nao.
 *   2. Separa por POSICAO do tecido, nao so por exercicio: comprimento maximo
 *      sob carga (supino pausado, peito alongado) x amplitude truncada
 *      (floor press, ~2 cm acima da profundidade da lesao).
 *   3. Traz carga (%TM), pausa e proximidade da falha (RPE) para a mesma linha,
 *      porque V089-25 diz que o strain depende do peso E da velocidade.
 *   4. Reconstroi os 8 eixos do §1.2 A PARTIR DO GERADO, nao da grade markdown
 *      (o `eixos-degrau.mjs` le o markdown).
 *
 * Nenhum numero e digitado aqui.
 *
 * Uso:
 *   node research/tools/auditoria-peito/curva-peito.mjs            # tabelas
 *   node research/tools/auditoria-peito/curva-peito.mjs --linhas   # toda linha
 *   node research/tools/auditoria-peito/curva-peito.mjs --json
 */
import '../../../scripts/ts-resolve.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

await import(join(ROOT, 'src/data/exercises/definitions.ts'));
await import(join(ROOT, 'src/data/exercises/powerbuilding.ts'));
await import(join(ROOT, 'src/data/exercises/vena.ts'));
const { getExerciseMuscleMap } = await import(join(ROOT, 'src/domain/exerciseRegistry.ts'));
const { venaBlock1Weeks, VENA_BLOCK1_ENTRADAS, VENA_BLOCK1_MEASURES } = await import(
  join(ROOT, 'src/data/program/vena-block1/generated.ts')
);

const TODAS = process.argv.includes('--linhas');
const JSON_OUT = process.argv.includes('--json');

const TM_SUPINO = Number(VENA_BLOCK1_ENTRADAS.tm_partida_supino_kg);

const peitoDe = (id) => getExerciseMuscleMap(id).peito ?? 0;

/**
 * Posicao do tecido. NAO e classificacao inventada: sai do proprio documento —
 * floor press "para ~2 cm ACIMA da profundidade da lesao" e existe para pagar R3
 * "SEM gastar exposicao em comprimento maximo"; supino pausado pausa NO peito;
 * `countsAs: peito_alongado` e o rotulo do proprio gerador.
 */
function posicao(l) {
  if (l.countsAs === 'peito_alongado') return 'alongado';
  if (l.exercicio === 'floor_press') return 'truncado';
  if (l.countsAs === 'supino_pausado') return 'maximo';
  return 'outro';
}

const repsMin = (r) => Number(String(r).split('-')[0]);
const repsMax = (r) => Number(String(r).split('-').at(-1));

const linhas = [];
for (const w of venaBlock1Weeks) {
  w.days.forEach((d, di) => {
    for (const b of d.exercises) {
      const peito = peitoDe(b.exerciseId);
      if (peito <= 0) continue;
      const l = {
        semana: w.weekNumber,
        dia: di + 1,
        dayType: d.dayType,
        exercicio: b.exerciseId,
        countsAs: b.countsAs,
        papel: b.role,
        series: b.sets ?? 0,
        aquec: b.warmupSets ?? 0,
        reps: b.reps,
        rpe: b.rpe ?? null,
        // ⚠️ `percent1RM` e STRING ("90%"). Os numeros sao percentMin/percentMax.
        // `exposicao-peito.mjs` lia `percent1RM` como numero e por isso nunca
        // imprimiu carga nenhuma. Aqui usamos o campo numerico.
        pctRaw: b.percent1RM ?? null,
        pct: typeof b.percentMax === 'number' ? b.percentMax : null,
        pctMin: typeof b.percentMin === 'number' ? b.percentMin : null,
        pausaS: b.pauseSec ?? 0,
        pesoPeito: peito,
      };
      l.posicao = posicao(l);
      l.kg = l.pct != null ? Math.round(l.pct * TM_SUPINO * 10) / 10 : null;
      linhas.push(l);
    }
  });
}

const semanas = [...new Set(linhas.map((l) => l.semana))].sort((a, b) => a - b);
const soma = (ls, f, campo = 'series') => ls.filter(f).reduce((a, l) => a + l[campo], 0);

const resumo = semanas.map((s) => {
  const ls = linhas.filter((l) => l.semana === s);
  const porPos = (p) => soma(ls, (l) => l.posicao === p);
  return {
    semana: s,
    trabalho: soma(ls, () => true),
    aquec: soma(ls, () => true, 'aquec'),
    barra: soma(ls, (l) => l.posicao === 'maximo' || l.posicao === 'truncado'),
    maximo: porPos('maximo'),
    truncado: porPos('truncado'),
    alongado: porPos('alongado'),
    // Exposicao em comprimento maximo = pausado + alongado. E a categoria que o
    // desenho diz querer poupar, e e a unica que sobe.
    comprimentoMaximo: porPos('maximo') + porPos('alongado'),
    repsMin: ls.reduce((a, l) => a + l.series * repsMin(l.reps), 0),
    repsMax: ls.reduce((a, l) => a + l.series * repsMax(l.reps), 0),
    // Reps pausadas SOB CARGA, incluindo aquecimento (todo aquecimento de
    // supino pausado e pausado por §1.2/SPEC §2.2).
    repsPausadasWork: ls.filter((l) => l.pausaS > 0)
      .reduce((a, l) => a + l.series * repsMin(l.reps), 0),
    seriesPausadasComAquec: soma(ls, (l) => l.pausaS > 0) + soma(ls, (l) => l.pausaS > 0, 'aquec'),
    sessoes: new Set(ls.map((l) => l.dia)).size,
    picoPct: Math.max(0, ...ls.filter((l) => l.pct != null).map((l) => l.pct)),
    picoKg: Math.max(0, ...ls.filter((l) => l.kg != null).map((l) => l.kg)),
    // Tonelagem-proxy sobre o peitoral, so nas linhas que declaram %: series x
    // reps(piso) x %TM x TM. As linhas de RPE (floor press, halter, peck deck)
    // NAO entram — o programa nao lhes da carga, e inventar uma seria fabricar.
    tonelagemPct: ls.filter((l) => l.kg != null)
      .reduce((a, l) => a + l.series * repsMin(l.reps) * l.kg, 0),
    seriesSemCarga: soma(ls, (l) => l.kg == null),
    pausaMax: Math.max(...ls.map((l) => l.pausaS)),
    rpeMax: Math.max(...ls.map((l) => Number(l.rpe) || 0)),
  };
});

if (JSON_OUT) {
  console.log(JSON.stringify({ resumo, linhas, TM_SUPINO }, null, 2));
  process.exit(0);
}

console.log('# 1. A CURVA, POR SEMANA  (TM supino de partida = ' + TM_SUPINO + ' kg)');
console.log('   trab = series de trabalho | aquec = series de aquecimento (todas pausadas no supino)');
console.log('   max = pausado no peito (comprimento maximo) | trunc = floor press (~2 cm acima da lesao)');
console.log('   along = peito_alongado (halter inclinado + peck deck)');
console.log();
console.log('sem | trab | aquec | TOTAL | barra | max | trunc | along | compMax | reps(min-max) | pico%TM | picoKg | tonKg(%) | pausaMax | RPEmax | sess');
for (const r of resumo) {
  console.log(
    [
      String(r.semana).padStart(3),
      String(r.trabalho).padStart(4),
      String(r.aquec).padStart(5),
      String(r.trabalho + r.aquec).padStart(5),
      String(r.barra).padStart(5),
      String(r.maximo).padStart(3),
      String(r.truncado).padStart(5),
      String(r.alongado).padStart(5),
      String(r.comprimentoMaximo).padStart(7),
      `${r.repsMin}-${r.repsMax}`.padStart(13),
      (r.picoPct ? (r.picoPct * 100).toFixed(1) : '-').padStart(7),
      (r.picoKg || '-').toString().padStart(6),
      String(Math.round(r.tonelagemPct)).padStart(8),
      `${r.pausaMax}s`.padStart(8),
      String(r.rpeMax).padStart(6),
      String(r.sessoes).padStart(4),
    ].join(' | '),
  );
}

console.log();
console.log('# 2. INVARIANTES: o que cai, o que nao cai');
const dist = (campo) => [...new Set(resumo.filter((r) => r.semana <= 16).map((r) => r[campo]))];
for (const campo of ['barra', 'trabalho', 'maximo', 'truncado', 'alongado', 'comprimentoMaximo', 'aquec']) {
  const v = dist(campo);
  console.log(`   ${campo.padEnd(18)} S1-S16: {${v.join(', ')}}  -> ${v.length === 1 ? 'INVARIANTE' : `varia (${Math.min(...v)}..${Math.max(...v)})`}`);
}

console.log();
console.log('# 3. TENSAO POR LINHA — pico do bloco em cada dimensao');
const comPct = linhas.filter((l) => l.pct != null);
const maisPesada = comPct.reduce((a, l) => (l.pct > a.pct ? l : a));
const maisLonga = linhas.reduce((a, l) => (l.pausaS > a.pausaS ? l : a));
const maisPerto = linhas.reduce((a, l) => (Number(l.rpe) > Number(a.rpe) ? l : a));
const fmt = (l) => `S${l.semana} D${l.dia} ${l.exercicio} ${l.series}x${l.reps}`
  + ` @${l.pct != null ? (l.pct * 100).toFixed(1) + '% do TM = ' + l.kg + ' kg' : 'sem % (so RPE)'}`
  + ` RPE ${l.rpe} pausa ${l.pausaS}s pos=${l.posicao}`;
console.log('   CARGA MAXIMA        : ' + fmt(maisPesada));
console.log('   PAUSA MAIS LONGA    : ' + fmt(maisLonga));
console.log('   MAIS PERTO DA FALHA : ' + fmt(maisPerto));

console.log();
console.log('   Series a >=80% do TM em comprimento maximo, por semana:');
for (const s of semanas) {
  const ls = linhas.filter((l) => l.semana === s && l.pct != null && l.pct >= 0.8 && l.posicao === 'maximo');
  if (!ls.length) continue;
  console.log(`     S${String(s).padStart(2)}: ` + ls.map((l) => `D${l.dia} ${l.series}x${l.reps} @${(l.pct * 100).toFixed(1)}% (${l.kg} kg) RPE ${l.rpe} pausa ${l.pausaS}s`).join(' + '));
}

console.log();
console.log('   Toda linha com pausa >= 2,0 s:');
for (const l of linhas.filter((x) => x.pausaS >= 2)) console.log('     ' + fmt(l));

console.log();
console.log('   Toda linha de peitoral com RPE >= 9 (proximidade da falha):');
for (const l of linhas.filter((x) => Number(x.rpe) >= 9)) console.log('     ' + fmt(l));

console.log();
console.log('# 4. OS 8 EIXOS DO §1.2, RECONSTRUIDOS DO GERADO');
// SUP-V1 = series de supino pausado papel volume em D1; FP-SETS = floor press D1;
// SUP-V4 = supino pausado papel volume em D4; FP4-SETS = floor press D4;
// PEC-SETS = series de CADA linha de peito_alongado; PAUSA-P = pausa do papel pratica.
const eixo = (s, f) => {
  const ls = linhas.filter((l) => l.semana === s && f(l));
  return ls.length ? ls[0] : null;
};
const EIXOS = {
  'SUP-V1': (s) => eixo(s, (l) => l.dia === 1 && l.countsAs === 'supino_pausado')?.series,
  'FP-SETS': (s) => eixo(s, (l) => l.dia === 1 && l.exercicio === 'floor_press')?.series,
  'SUP-V4': (s) => eixo(s, (l) => l.dia === 4 && l.countsAs === 'supino_pausado' && l.papel === 'volume')?.series,
  'FP4-SETS': (s) => eixo(s, (l) => l.dia === 4 && l.exercicio === 'floor_press')?.series,
  'PAUSA-P': (s) => eixo(s, (l) => l.papel === 'pratica' && l.countsAs === 'supino_pausado')?.pausaS,
  'PEC-SETS': (s) => eixo(s, (l) => l.countsAs === 'peito_alongado')?.series,
  'FP-RPE': (s) => eixo(s, (l) => l.dia === 1 && l.exercicio === 'floor_press')?.rpe,
  'FP4-RPE': (s) => eixo(s, (l) => l.dia === 4 && l.exercicio === 'floor_press')?.rpe,
};
const nomes = Object.keys(EIXOS);
const val = {};
for (const s of semanas) { val[s] = {}; for (const n of nomes) val[s][n] = EIXOS[n](s); }
console.log('     ' + nomes.map((n) => n.padStart(9)).join(''));
for (const s of semanas) {
  console.log(`S${String(s).padStart(2)}  ` + nomes.map((n) => String(val[s][n] ?? '—').padStart(9)).join(''));
}

console.log();
console.log('   Somas de controle: FP-SETS + SUP-V1 e FP4-SETS + SUP-V4');
for (const s of semanas) {
  const a = Number(val[s]['SUP-V1']); const b = Number(val[s]['FP-SETS']);
  const c = Number(val[s]['SUP-V4']); const d = Number(val[s]['FP4-SETS']);
  console.log(`     S${String(s).padStart(2)}: SUP-V1+FP-SETS = ${a}+${b} = ${a + b}`
    + ` | SUP-V4+FP4-SETS = ${c}+${d} = ${c + d}`
    + ` | D2+D3 (constantes) = ${soma(linhas.filter((l) => l.semana === s && (l.dia === 2 || l.dia === 3)), (l) => l.countsAs === 'supino_pausado')}`);
}

console.log();
console.log('# 5. O EIXO QUE MUDOU MAIS RECENTEMENTE (do gerado)');
const mud = {};
for (let i = 1; i < semanas.length; i += 1) {
  const s = semanas[i]; const p = semanas[i - 1];
  mud[s] = nomes.filter((n) => String(val[s][n]) !== String(val[p][n]));
}
for (const s of semanas) {
  let ultima = null;
  for (let k = s; k >= 2; k -= 1) if (mud[k]?.length) { ultima = k; break; }
  if (!ultima) { console.log(`   S${String(s).padStart(2)}: nenhum eixo mudou ainda — a regra nao tem referente`); continue; }
  const set = mud[ultima];
  const detalhe = set.map((n) => `${n} ${val[ultima - 1][n]}->${val[ultima][n]}`).join(' · ');
  console.log(`   S${String(s).padStart(2)}: ultima mudanca na S${ultima} -> `
    + (set.length === 1 ? `UNICO: ${set[0]} (${detalhe})` : `AMBIGUO (${set.length}): ${detalhe}`));
}

console.log();
console.log('# 6. CONFERE CONTRA A MEDICAO DO PROPRIO GERADOR (VENA_BLOCK1_MEASURES)');
console.log('sem | supinoSeries(gerador) | barra(auditoria) | repsPausadas(gerador) | repsPausadasTrab(auditoria) | direct.soma | trabalho(auditoria)');
for (const m of VENA_BLOCK1_MEASURES) {
  const r = resumo.find((x) => x.semana === m.weekNumber);
  const d = m.direct ?? {};
  const somaDirect = (d.supino_pausado ?? 0) + (d.supino_acessorio ?? 0) + (d.peito_alongado ?? 0);
  console.log(
    `${String(m.weekNumber).padStart(3)} | ${String(m.supinoSeries).padStart(20)} | ${String(r.barra).padStart(16)}`
    + ` | ${String(m.repsPausadas).padStart(21)} | ${String(r.repsPausadasWork).padStart(27)}`
    + ` | ${String(somaDirect).padStart(11)} | ${String(r.trabalho).padStart(19)}`,
  );
}

if (TODAS) {
  console.log();
  console.log('# 7. TODA LINHA DE PEITORAL DO BLOCO');
  console.log('sem dia exercicio                     papel      series x reps  aquec  %TM/kg        RPE  pausa  posicao');
  for (const l of linhas) {
    console.log(
      `${String(l.semana).padStart(3)} D${l.dia}  ${l.exercicio.padEnd(28)} ${String(l.papel).padEnd(10)}`
      + ` ${String(l.series).padStart(2)}x${String(l.reps).padEnd(6)} ${String(l.aquec).padStart(4)}`
      + ` ${(l.pct != null ? (l.pct * 100).toFixed(1) + '% / ' + l.kg + 'kg' : '—').padEnd(14)}`
      + ` ${String(l.rpe ?? '—').padStart(4)} ${String(l.pausaS) + 's'} ${l.posicao}`,
    );
  }
}
