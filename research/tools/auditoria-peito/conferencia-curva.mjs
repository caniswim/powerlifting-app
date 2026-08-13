#!/usr/bin/env node
/**
 * CONFERENCIA INDEPENDENTE DA CURVA DE PEITORAL.
 *
 * Escrito do zero para NAO compartilhar nenhuma linha com `curva-peito.mjs`:
 *   - nao usa `ts-resolve.mjs` nem `getExerciseMuscleMap` (o parecer usa);
 *     recorta o literal `venaBlock1Weeks` de generated.ts e JSON.parse.
 *   - classifica o tecido por exerciseId explicito, e IMPRIME a lista de todos
 *     os exerciseId do bloco para que nenhum caia fora em silencio.
 *   - conta series de trabalho, de aquecimento, reps e carga por semana.
 *
 * Se divergir de curva-peito.mjs, a divergencia e o achado.
 *
 * Uso: node research/tools/auditoria-peito/conferencia-curva.mjs [--json]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const GEN = join(ROOT, 'src/data/program/vena-block1/generated.ts');
const src = readFileSync(GEN, 'utf8');

/** Recorta um literal `export const NOME... = <json>;` no fim do arquivo. */
function recorta(nome) {
  const marca = src.indexOf(`export const ${nome}`);
  if (marca < 0) throw new Error(`nao achei ${nome}`);
  const abre = src.indexOf('=', marca);
  // primeiro [ ou { depois do =
  let i = abre + 1;
  while (' \n\r\t'.includes(src[i])) i += 1;
  const aberto = src[i];
  const fechado = aberto === '[' ? ']' : '}';
  let prof = 0;
  let dentroStr = false;
  let esc = false;
  for (let j = i; j < src.length; j += 1) {
    const c = src[j];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { dentroStr = !dentroStr; continue; }
    if (dentroStr) continue;
    if (c === aberto) prof += 1;
    else if (c === fechado) {
      prof -= 1;
      if (prof === 0) return JSON.parse(src.slice(i, j + 1));
    }
  }
  throw new Error(`literal ${nome} nao fecha`);
}

const semanasProg = recorta('venaBlock1Weeks');
const MEASURES = recorta('VENA_BLOCK1_MEASURES');
const ENTRADAS = recorta('VENA_BLOCK1_ENTRADAS');
const TM = Number(ENTRADAS.tm_partida_supino_kg);

/**
 * Tecido, por exerciseId. Escrito a mao de proposito: assim um exercicio novo
 * aparece na lista de DESCONHECIDOS em vez de sumir por muscleMap vazio.
 *   maximo   = o peitoral chega ao comprimento maximo sob carga
 *   truncado = amplitude limitada acima da profundidade da lesao
 */
const TECIDO = {
  supino_pausado_competicao: 'maximo',
  floor_press: 'truncado',
  db_press_inclinado: 'alongado',
  crucifixo_peck_deck: 'alongado',
};
/** Exercicios do bloco que NAO sao de peitoral (para a lista de conferencia). */
const NAO_PEITO = new Set();

const linhas = [];
const idsVistos = new Map();
for (const w of semanasProg) {
  w.days.forEach((d, di) => {
    for (const b of d.exercises) {
      idsVistos.set(b.exerciseId, (idsVistos.get(b.exerciseId) ?? 0) + 1);
      const tecido = TECIDO[b.exerciseId];
      if (!tecido) { NAO_PEITO.add(b.exerciseId); continue; }
      linhas.push({
        semana: w.weekNumber,
        dia: di + 1,
        ex: b.exerciseId,
        countsAs: b.countsAs,
        papel: b.role,
        tecido,
        sets: b.sets ?? 0,
        warm: b.warmupSets ?? 0,
        reps: b.reps,
        rpe: b.rpe == null ? null : Number(String(b.rpe).replace(',', '.')),
        pctMax: typeof b.percentMax === 'number' ? b.percentMax : null,
        pctMin: typeof b.percentMin === 'number' ? b.percentMin : null,
        pausa: b.pauseSec ?? 0,
      });
    }
  });
}

const SEM = [...new Set(linhas.map((l) => l.semana))].sort((a, b) => a - b);
const rMin = (r) => Number(String(r).split('-')[0]);
const rMax = (r) => Number(String(r).split('-').at(-1));
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);

const porSemana = SEM.map((s) => {
  const L = linhas.filter((l) => l.semana === s);
  const t = (tec) => sum(L.filter((l) => l.tecido === tec), (l) => l.sets);
  const pausadas = L.filter((l) => l.pausa > 0);
  return {
    semana: s,
    trab: sum(L, (l) => l.sets),
    warm: sum(L, (l) => l.warm),
    maximo: t('maximo'),
    truncado: t('truncado'),
    // "barra sobre o peitoral" = as duas linhas de barra: supino pausado + floor press
    barra: sum(L.filter((l) => l.ex === 'supino_pausado_competicao' || l.ex === 'floor_press'), (l) => l.sets),
    supinoPausado: sum(L.filter((l) => l.ex === 'supino_pausado_competicao'), (l) => l.sets),
    floorPress: sum(L.filter((l) => l.ex === 'floor_press'), (l) => l.sets),
    alongado: sum(L.filter((l) => l.countsAs === 'peito_alongado'), (l) => l.sets),
    repsMin: sum(L, (l) => l.sets * rMin(l.reps)),
    repsMax: sum(L, (l) => l.sets * rMax(l.reps)),
    repsPausadasTrab: sum(pausadas, (l) => l.sets * rMin(l.reps)),
    warmPausado: sum(pausadas, (l) => l.warm),
    picoPct: Math.max(0, ...L.filter((l) => l.pctMax != null).map((l) => l.pctMax)),
    pausaMax: Math.max(...L.map((l) => l.pausa)),
    rpeMax: Math.max(...L.map((l) => l.rpe ?? 0)),
  };
});

const out = { porSemana, linhas, TM };
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

console.log('# 0. TODO exerciseId do bloco, e como foi classificado');
for (const [id, n] of [...idsVistos].sort()) {
  console.log(`   ${id.padEnd(34)} ${String(n).padStart(3)}x  ${TECIDO[id] ? 'PEITO/' + TECIDO[id] : '-'}`);
}

console.log();
console.log(`# 1. CURVA (TM supino de partida = ${TM} kg)`);
console.log('sem | trab | warm | TOTAL | barra | pausado | floor | along | maximo | trunc | reps      | pico%  | pausaMax | RPEmax');
for (const r of porSemana) {
  console.log([
    String(r.semana).padStart(3), String(r.trab).padStart(4), String(r.warm).padStart(4),
    String(r.trab + r.warm).padStart(5), String(r.barra).padStart(5),
    String(r.supinoPausado).padStart(7), String(r.floorPress).padStart(5),
    String(r.alongado).padStart(5), String(r.maximo).padStart(6), String(r.truncado).padStart(5),
    `${r.repsMin}-${r.repsMax}`.padStart(9),
    (r.picoPct ? (r.picoPct * 100).toFixed(1) : '-').padStart(6),
    `${r.pausaMax}s`.padStart(8), String(r.rpeMax).padStart(6),
  ].join(' | '));
}

console.log();
console.log('# 2. DISTRIBUICOES S1-S16');
const dist = (c) => [...new Set(porSemana.filter((r) => r.semana <= 16).map((r) => r[c]))];
for (const c of ['barra', 'trab', 'warm', 'supinoPausado', 'floorPress', 'alongado', 'maximo', 'truncado']) {
  const v = dist(c);
  console.log(`   ${c.padEnd(16)} {${v.join(', ')}}  ${v.length === 1 ? 'INVARIANTE' : 'varia'}`);
}
const compMax = [...new Set(porSemana.filter((r) => r.semana <= 16).map((r) => r.maximo + r.alongado))];
console.log(`   compMax(max+along) {${compMax.join(', ')}}`);
console.log('   conferencia: maximo == supinoPausado?  ' + porSemana.every((r) => r.maximo === r.supinoPausado));

console.log();
console.log('# 3. CONTRA VENA_BLOCK1_MEASURES (medicao do proprio gerador)');
let div = 0;
console.log('sem | supinoSeries | minha barra | repsPausadas | minhas reps pausadas | direct.soma | meu trab');
for (const m of MEASURES) {
  const r = porSemana.find((x) => x.semana === m.weekNumber);
  const d = m.direct ?? {};
  const dsum = (d.supino_pausado ?? 0) + (d.supino_acessorio ?? 0) + (d.peito_alongado ?? 0);
  const ok1 = m.supinoSeries === r.barra;
  const ok2 = m.repsPausadas === r.repsPausadasTrab;
  const ok3 = dsum === r.trab;
  if (!ok1 || !ok2 || !ok3) div += 1;
  console.log(`${String(m.weekNumber).padStart(3)} | ${String(m.supinoSeries).padStart(12)} | ${String(r.barra).padStart(11)}${ok1 ? ' ' : '!'}`
    + ` | ${String(m.repsPausadas).padStart(12)} | ${String(r.repsPausadasTrab).padStart(20)}${ok2 ? ' ' : '!'}`
    + ` | ${String(dsum).padStart(11)} | ${String(r.trab).padStart(8)}${ok3 ? '' : ' !'}`);
}
console.log(`   divergencias: ${div}`);

console.log();
console.log('# 4. AQUECIMENTO — de onde saem as 18 series');
for (const s of [1, 8, 16, 17, 18]) {
  const L = linhas.filter((l) => l.semana === s && l.warm > 0);
  console.log(`   S${s}: ` + L.map((l) => `D${l.dia}/${l.ex}=${l.warm}${l.pausa > 0 ? '(pausado)' : ''}`).join(' '));
}
const totalWarmPausado = porSemana.filter((r) => r.semana <= 16).map((r) => r.warmPausado);
console.log(`   aquecimentos EM LINHA PAUSADA por semana S1-S16: {${[...new Set(totalWarmPausado)].join(', ')}}`);

console.log();
console.log('# 5. OS SEIS EIXOS NOMEADOS PELO §1.2, do gerado');
const ax = (s, f, campo) => { const l = linhas.find((x) => x.semana === s && f(x)); return l ? l[campo] : null; };
const EIXOS = {
  'SUP-V1': (s) => ax(s, (l) => l.dia === 1 && l.ex === 'supino_pausado_competicao', 'sets'),
  'FP-SETS': (s) => ax(s, (l) => l.dia === 1 && l.ex === 'floor_press', 'sets'),
  'SUP-V4': (s) => ax(s, (l) => l.dia === 4 && l.ex === 'supino_pausado_competicao' && l.papel === 'volume', 'sets'),
  'FP4-SETS': (s) => ax(s, (l) => l.dia === 4 && l.ex === 'floor_press', 'sets'),
  'PAUSA-P': (s) => ax(s, (l) => l.papel === 'pratica' && l.ex === 'supino_pausado_competicao', 'pausa'),
  'PEC-SETS': (s) => ax(s, (l) => l.countsAs === 'peito_alongado', 'sets'),
  'FP-RPE': (s) => ax(s, (l) => l.dia === 1 && l.ex === 'floor_press', 'rpe'),
  'FP4-RPE': (s) => ax(s, (l) => l.dia === 4 && l.ex === 'floor_press', 'rpe'),
};
const nomes = Object.keys(EIXOS);
const V = {};
for (const s of SEM) { V[s] = {}; for (const n of nomes) V[s][n] = EIXOS[n](s); }
console.log('     ' + nomes.map((n) => n.padStart(9)).join(''));
for (const s of SEM) console.log(`S${String(s).padStart(2)}  ` + nomes.map((n) => String(V[s][n] ?? '-').padStart(9)).join(''));

console.log();
console.log('# 6. RECUO DE CADA EIXO: o que acontece com o TOTAL sobre o peitoral');
console.log('   (recuo = voltar o eixo ao valor da semana anterior em que ele era menor;');
console.log('    total = series de trabalho sobre o peitoral naquela semana)');
/**
 * Simula o recuo de UM eixo numa semana: acha o valor imediatamente anterior
 * distinto e menor na propria coluna, aplica a derivacao do markdown
 * (FP-SETS = 7 - SUP-V1, FP4-SETS = 5 - SUP-V4, PEC-RPE = 5 + PEC-SETS) e
 * recalcula.
 */
function recuoDe(eixo, s) {
  const atual = Number(V[s][eixo]);
  let anterior = null;
  for (let k = s - 1; k >= 1; k -= 1) {
    const v = Number(V[k]?.[eixo]);
    if (Number.isFinite(v) && v !== atual) { anterior = v; break; }
  }
  if (anterior == null) return { eixo, s, nota: 'sem valor anterior distinto' };
  const base = porSemana.find((r) => r.semana === s);
  const delta = { series: 0, nota: '' };
  if (eixo === 'SUP-V1') {
    // recua supino pausado D1; FP-SETS = 7 - SUP-V1 sobe na mesma medida
    delta.series = (anterior - atual) + ((7 - anterior) - (7 - atual));
    delta.nota = `SUP-V1 ${atual}->${anterior}, FP-SETS ${7 - atual}->${7 - anterior} (derivado)`;
  } else if (eixo === 'SUP-V4') {
    delta.series = (anterior - atual) + ((5 - anterior) - (5 - atual));
    delta.nota = `SUP-V4 ${atual}->${anterior}, FP4-SETS ${5 - atual}->${5 - anterior} (derivado)`;
  } else if (eixo === 'FP-SETS') {
    // FP-SETS e DERIVADO. Recua-lo isoladamente e impossivel sem quebrar a
    // derivacao; se for feito assim mesmo, SUP-V1 tem que subir.
    delta.series = 0;
    delta.nota = `FP-SETS e derivado de SUP-V1: recuar FP-SETS ${atual}->${anterior} exige SUP-V1 SUBIR de ${7 - atual} para ${7 - anterior}`;
  } else if (eixo === 'FP4-SETS') {
    delta.series = 0;
    delta.nota = `FP4-SETS e derivado de SUP-V4: recuar exige SUP-V4 SUBIR de ${5 - atual} para ${5 - anterior}`;
  } else if (eixo === 'PEC-SETS') {
    // 2 linhas de peito_alongado por semana (halter inclinado + peck deck)
    const nLinhas = linhas.filter((l) => l.semana === s && l.countsAs === 'peito_alongado').length;
    delta.series = (anterior - atual) * nLinhas;
    delta.nota = `PEC-SETS ${atual}->${anterior} em ${nLinhas} linhas; PEC-RPE ${5 + atual}->${5 + anterior}`;
  } else if (eixo === 'PAUSA-P') {
    delta.series = 0;
    delta.nota = `PAUSA-P ${atual}s->${anterior}s (nao mexe em series)` + (anterior > atual ? '  ** RECUO SOBE A PAUSA **' : '');
  } else if (eixo === 'FP-RPE' || eixo === 'FP4-RPE') {
    delta.series = 0;
    delta.nota = `${eixo} ${atual}->${anterior} (teto de RPE, nao mexe em series)`;
  }
  return { eixo, s, antes: base.trab, depois: base.trab + delta.series, delta: delta.series, nota: delta.nota };
}
for (const eixo of nomes) {
  // usa a ultima semana do bloco em que o eixo esta no valor mais alto
  const s = 16;
  const r = recuoDe(eixo, s);
  console.log(`   ${eixo.padEnd(9)} S${s}: total ${r.antes ?? '-'} -> ${r.depois ?? '-'} (${r.delta >= 0 ? '+' : ''}${r.delta ?? 0})   ${r.nota ?? r.nota}`);
}
console.log();
console.log('   Mesmo teste em TODA semana em que o eixo tem valor anterior distinto:');
for (const eixo of nomes) {
  const ls = [];
  for (const s of SEM.filter((x) => x <= 16)) {
    const r = recuoDe(eixo, s);
    if (r.delta != null) ls.push(`S${s}:${r.delta >= 0 ? '+' : ''}${r.delta}`);
  }
  console.log(`   ${eixo.padEnd(9)} ${ls.join(' ')}`);
}

console.log();
console.log('# 7. BARRA SOBRE O PEITORAL, decomposta (a soma que da 22)');
for (const s of SEM) {
  const L = linhas.filter((l) => l.semana === s && (l.ex === 'supino_pausado_competicao' || l.ex === 'floor_press'));
  const porDia = {};
  for (const l of L) porDia[l.dia] = (porDia[l.dia] ?? 0) + l.sets;
  const tot = Object.values(porDia).reduce((a, b) => a + b, 0);
  console.log(`   S${String(s).padStart(2)}: ` + Object.entries(porDia).map(([d, n]) => `D${d}=${n}`).join(' ') + `  TOTAL=${tot}`);
}
