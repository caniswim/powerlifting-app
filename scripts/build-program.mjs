#!/usr/bin/env node
/**
 * Gera src/data/program/powerbuilding2/generated.ts a partir do markdown de
 * origem em src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md.
 *
 * O markdown é a fonte de verdade: o gerador normaliza as 8 colunas de cada
 * linha da tabela sem interpretar nada além do necessário (reps, %1RM, RPE e
 * notas saem verbatim). A expansão de cada linha em séries individuais
 * acontece em runtime, em src/domain/setPlan.ts.
 *
 * Uso: node scripts/build-program.mjs [--check]
 *   --check  não escreve nada; falha se o arquivo gerado estiver desatualizado.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EXERCISE_MAP } from './exercise-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md');
const OUT = join(ROOT, 'src/data/program/powerbuilding2/generated.ts');

/** Contagens esperadas — travas contra parse silenciosamente incompleto. */
const EXPECTED_DAYS = 54;
const EXPECTED_ROWS = 373;

/**
 * Mesociclos. O markdown não nomeia blocos; a única marcação explícita é a
 * semana 8 ("SEMI-DELOAD WEEK") e a 12 ("FINAL WEEK). O restante é a leitura
 * do progresso de intensidade ao longo das 12 semanas.
 */
const WEEK_META = {
  block1: {
    weeks: [1, 2, 3, 4],
    macrocycle: 1,
    blockName: 'Bloco 1 — Acumulação',
    blockType: 'accumulation',
    blockObjective: 'Construir base de volume e técnica alternando semanas full body (5 dias) e upper/lower (4 dias).',
  },
  block2: {
    weeks: [5, 6, 7],
    macrocycle: 2,
    blockName: 'Bloco 2 — Intensificação',
    blockType: 'intensification',
    blockObjective: 'Top sets mais pesadas mantendo o volume acessório.',
  },
  deload: {
    weeks: [8],
    macrocycle: 2,
    blockName: 'Semi-Deload',
    blockType: 'deload',
    blockObjective: 'Semana mais leve: evite a falha, treine com cargas reduzidas.',
    isDeload: true,
  },
  block3: {
    weeks: [9, 10, 11],
    macrocycle: 3,
    blockName: 'Bloco 3 — Pico de Intensidade',
    blockType: 'intensification',
    blockObjective: 'Singles e duplas pesadas nos básicos, densidade máxima nos acessórios.',
  },
  final: {
    weeks: [12],
    macrocycle: 3,
    blockName: 'Semana Final',
    blockType: 'realization',
    blockObjective: 'Fechamento do ciclo com AMRAPs e trabalho de qualidade. Não há teste formal de 1RM.',
  },
};

function metaForWeek(weekNumber) {
  for (const meta of Object.values(WEEK_META)) {
    if (meta.weeks.includes(weekNumber)) return meta;
  }
  throw new Error(`Semana ${weekNumber} sem mesociclo definido`);
}

/** Rótulo do dia (verbatim do markdown) -> DayType. */
function dayTypeFor(label, dayIndex) {
  const l = label.toLowerCase();
  if (l.includes('arm &')) return 'arms_hypertrophy';
  if (l.startsWith('full body')) {
    if (l.includes('strength')) return 'fb_strength';
    if (l.includes('hypertrophy')) return 'fb_hypertrophy';
    // "Full Body - Continued" aparece duas vezes na semana; o índice desempata.
    return dayIndex <= 1 ? 'fb_continued_a' : 'fb_continued_b';
  }
  if (l.startsWith('lower body')) {
    return l.includes('continued') || l.includes('final') ? 'lower_body_continued' : 'lower_body';
  }
  if (l.startsWith('upper body')) {
    return l.includes('continued') || l.includes('final') ? 'upper_body_continued' : 'upper_body';
  }
  throw new Error(`Rótulo de dia não reconhecido: "${label}"`);
}

/** "3-4 MIN" -> 180 | "0 MIN" -> 0 | "N/A" -> undefined */
function parseRest(raw) {
  if (!raw || raw === 'N/A') return undefined;
  const m = raw.match(/^(\d+)(?:-(\d+))?\s*MIN$/i);
  if (!m) throw new Error(`Descanso não reconhecido: "${raw}"`);
  return Number(m[1]) * 60;
}

/** "82.5-87.5%" -> { min: 0.825, max: 0.875 } */
function parsePercent(raw) {
  if (!raw || raw === 'N/A') return undefined;
  const m = raw.match(/^([\d.]+)(?:-([\d.]+))?%$/);
  if (!m) throw new Error(`%1RM não reconhecido: "${raw}"`);
  const min = Number(m[1]) / 100;
  const max = m[2] ? Number(m[2]) / 100 : min;
  return { min, max };
}

function parse(md) {
  const lines = md.split('\n');
  const days = [];
  let current = null;
  let pendingWeekLabel = new Map();

  for (const line of lines) {
    const weekHeader = line.match(/^## WEEK (\d+)(?:\s*\((.+)\))?\s*$/);
    if (weekHeader) {
      if (weekHeader[2]) pendingWeekLabel.set(Number(weekHeader[1]), weekHeader[2]);
      continue;
    }

    const dayHeader = line.match(/^### WEEK (\d+) - DAY (\d+) \((.+)\)\s*$/);
    if (dayHeader) {
      current = {
        weekNumber: Number(dayHeader[1]),
        dayNumber: Number(dayHeader[2]),
        dayLabel: dayHeader[3],
        rows: [],
        restNote: undefined,
      };
      days.push(current);
      continue;
    }

    if (!current) continue;

    const restNote = line.match(/^\*\*(SUGGESTED REST DAY.*?)\*\*\s*$/);
    if (restNote) {
      current.restNote = restNote[1];
      continue;
    }

    if (!line.startsWith('| ') || line.includes('|---') || line.startsWith('| Exercise')) continue;
    const cols = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    if (cols.length !== 8) throw new Error(`Linha com ${cols.length} colunas: ${line}`);
    current.rows.push(cols);
  }

  return { days, weekLabels: pendingWeekLabel };
}

function buildExercise(cols, weekNumber, dayNumber, index) {
  const [rawLabel, warmRaw, workRaw, reps, pctRaw, rpe, restRaw, notes] = cols;

  const superset = rawLabel.match(/^([A-C])([12]):\s*(.+)$/);
  let label = superset ? superset[3] : rawLabel;

  const entry = EXERCISE_MAP[label];
  if (!entry) throw new Error(`Exercício não mapeado: "${label}" (semana ${weekNumber}, dia ${dayNumber})`);

  const optional = / \(Optional\)$/.test(label);
  // O nome exibido preserva o rótulo do programa, menos o marcador de opcional
  // e o "[OR ...]" — a variação vira campo próprio.
  const exerciseName = label.replace(/ \(Optional\)$/, '').replace(/\s*\[OR .+?\]$/, '');

  const percent = parsePercent(pctRaw);
  const perSide = / each$/.test(workRaw) || /each/.test(reps);
  const unit = /sec$/.test(reps) ? 'seconds' : undefined;

  const ex = {
    blockId: `w${weekNumber}d${dayNumber}b${index}`,
    exerciseId: entry.id,
    exerciseName,
    rawLabel,
    sets: Number(workRaw.replace(' each', '')),
    reps,
    rpe,
    warmupSets: Number(warmRaw),
  };
  if (notes) ex.notes = notes;
  if (superset) {
    ex.supersetGroup = superset[1];
    ex.supersetOrder = Number(superset[2]);
  }
  const restSec = parseRest(restRaw);
  if (restSec !== undefined) {
    ex.restSec = restSec;
    ex.restLabel = restRaw;
  }
  if (percent) {
    ex.percent1RM = pctRaw;
    ex.percentMin = percent.min;
    ex.percentMax = percent.max;
  }
  if (perSide) ex.perSide = true;
  if (optional) ex.optional = true;
  if (unit) ex.unit = unit;
  if (entry.alt) {
    ex.alternatives = entry.alt.map(([name]) => name);
    ex.alternativeIds = entry.alt.map(([, id]) => id);
  }
  return ex;
}

function build() {
  const md = readFileSync(SRC, 'utf8');
  const { days, weekLabels } = parse(md);

  if (days.length !== EXPECTED_DAYS) {
    throw new Error(`Esperado ${EXPECTED_DAYS} dias, encontrado ${days.length}`);
  }
  const rowCount = days.reduce((n, d) => n + d.rows.length, 0);
  if (rowCount !== EXPECTED_ROWS) {
    throw new Error(`Esperado ${EXPECTED_ROWS} linhas de exercício, encontrado ${rowCount}`);
  }

  const byWeek = new Map();
  for (const day of days) {
    const dayIndex = day.dayNumber - 1;
    const exercises = day.rows.map((cols, i) => buildExercise(cols, day.weekNumber, day.dayNumber, i));
    const entry = {
      dayType: dayTypeFor(day.dayLabel, dayIndex),
      dayLabel: day.dayLabel,
      dayIndex,
      exercises,
    };
    if (day.restNote) {
      entry.restNote = day.restNote;
      entry.restDaysAfter = 1;
    } else {
      entry.restDaysAfter = 0;
    }
    if (!byWeek.has(day.weekNumber)) byWeek.set(day.weekNumber, []);
    byWeek.get(day.weekNumber).push(entry);
  }

  const weeks = [...byWeek.keys()].sort((a, b) => a - b).map((weekNumber) => {
    const meta = metaForWeek(weekNumber);
    const week = {
      weekNumber,
      macrocycle: meta.macrocycle,
      blockName: meta.blockName,
      blockType: meta.blockType,
      blockObjective: meta.blockObjective,
      isDeload: meta.isDeload === true,
      days: byWeek.get(weekNumber),
    };
    const label = weekLabels.get(weekNumber);
    if (label) week.weekLabel = label;
    return week;
  });

  const sourceHash = createHash('sha256').update(md).digest('hex').slice(0, 16);
  const totalSessions = weeks.reduce((n, w) => n + w.days.length, 0);

  const header = `/**
 * ARQUIVO GERADO — não edite à mão.
 *
 * Origem: src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md
 * Gerador: scripts/build-program.mjs
 * sha256(origem): ${sourceHash}
 *
 * ${weeks.length} semanas · ${totalSessions} sessões · ${rowCount} blocos de prescrição.
 * Para regenerar: npm run build:program
 */
import type { PrescribedWeek } from '../../../types';

/** Hash do markdown de origem que produziu este arquivo. */
export const POWERBUILDING2_SOURCE_HASH = '${sourceHash}';

export const powerbuilding2Weeks: PrescribedWeek[] = `;

  const body = JSON.stringify(weeks, null, 2);
  return { content: `${header}${body};\n`, weeks: weeks.length, totalSessions, rowCount };
}

const result = build();
const check = process.argv.includes('--check');

if (check) {
  let existing = '';
  try {
    existing = readFileSync(OUT, 'utf8');
  } catch {
    /* arquivo ainda não existe */
  }
  if (existing !== result.content) {
    console.error('generated.ts está desatualizado em relação ao markdown. Rode: npm run build:program');
    process.exit(1);
  }
  console.log(`OK — ${result.weeks} semanas, ${result.totalSessions} sessões, ${result.rowCount} blocos.`);
} else {
  writeFileSync(OUT, result.content);
  console.log(`Gerado ${OUT}\n  ${result.weeks} semanas · ${result.totalSessions} sessões · ${result.rowCount} blocos de prescrição.`);
}
