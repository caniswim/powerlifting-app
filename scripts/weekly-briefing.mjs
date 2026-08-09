#!/usr/bin/env node
/**
 * Briefing semanal — o produto final da camada de dados.
 *
 * Puxa do Firestore os rollups já agregados e imprime markdown denso, pronto
 * para colar numa conversa de análise. Nenhum log cru é lido: tudo que sai
 * daqui foi calculado pelo app no momento da escrita.
 *
 *   npm run briefing                  # últimas 4 semanas
 *   npm run briefing -- --weeks 8     # janela maior
 *   npm run briefing -- --week 6      # uma semana específica, em detalhe
 *   npm run briefing -- --sessions    # + últimas sessões (custo: +N leituras)
 *   npm run briefing -- --out brief.md
 *
 * Custo típico: 6 leituras (athlete + state + 4 semanas).
 *
 * ⚠️ Os caminhos abaixo repetem `src/services/firebase/paths.ts`. Mexeu num,
 * mexa no outro. (Os rótulos de dor NÃO são mais cópia: vêm de
 * `src/domain/painRegions.ts`, que o Node executa direto por só ter import de
 * tipo. O mesmo tratamento serve para qualquer outro enumerado repetido aqui.)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// .env
// ---------------------------------------------------------------------------

function loadEnv() {
  try {
    const raw = readFileSync(resolve(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // sem .env: cai nas variáveis já exportadas no shell
  }
}

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { weeks: null, week: null, sessions: false, out: null, json: false, allWeeks: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--weeks') args.weeks = Number(argv[++i]);
    else if (a === '--week') args.week = Number(argv[++i]);
    else if (a === '--sessions') args.sessions = true;
    else if (a === '--all-weeks') args.allWeeks = true;
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

const HELP = `Briefing semanal a partir do Firestore.

  --weeks N      quantas semanas trazer (padrão 4, ou BRIEFING_WEEKS)
  --week N       detalhar uma semana específica
  --all-weeks    detalhe completo de todas as semanas da janela
  --sessions     inclui as sessões da semana mais recente (custo: +N leituras)
  --out ARQUIVO  grava em vez de imprimir
  --json         despeja os documentos crus em JSON
`;

// ---------------------------------------------------------------------------
// Formatação
// ---------------------------------------------------------------------------

const formatters = new Map();
const fmt = (dec) => {
  if (!formatters.has(dec)) formatters.set(dec, new Intl.NumberFormat('pt-BR', { maximumFractionDigits: dec }));
  return formatters.get(dec);
};
const nf0 = fmt(0);

const n = (v, dec = 1) => (v === null || v === undefined || Number.isNaN(v) ? '—' : fmt(dec).format(v));
const kg = (v) => (v ? `${nf0.format(v)} kg` : '—');
const pct = (v) => (v === null || v === undefined ? '—' : `${fmt(1).format(v)}%`);
/** Delta entre parênteses, com sinal. String vazia quando não há delta. */
const signed = (v, dec = 1) => {
  if (v === null || v === undefined || v === 0) return '';
  const s = fmt(dec).format(Math.abs(v));
  return v > 0 ? ` (+${s})` : ` (−${s})`;
};
const day = (iso) => (iso ? String(iso).slice(0, 10).split('-').reverse().slice(0, 2).join('/') : '—');

/** Só as entradas com valor, ordenadas do maior para o menor. */
function topEntries(obj, limit = 99) {
  return Object.entries(obj ?? {})
    .filter(([, v]) => v)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

const DAY_LABELS = {
  squat_emphasis: 'Agacho', bench_emphasis: 'Supino', deadlift_emphasis: 'Terra',
  bench_volume: 'Supino vol.', arms_shoulders: 'Braços',
  fb_strength: 'FB força', fb_continued_a: 'FB cont.', fb_hypertrophy: 'FB hiper',
  fb_continued_b: 'FB cont.', arms_hypertrophy: 'Braços',
  lower_body: 'Inferior', upper_body: 'Superior',
  lower_body_continued: 'Inferior cont.', upper_body_continued: 'Superior cont.',
};
const dayLabel = (t) => DAY_LABELS[t] ?? t;

/**
 * Rótulos de dor lidos do MESMO módulo que a UI usa.
 *
 * Esta tabela era uma terceira cópia manual do enumerado — a segunda ficou
 * escondida dentro de `useSurveyTrends`. Quando `left_chest`/`right_chest`
 * entraram, as duas cópias teriam impresso a chave crua justamente na região que
 * o gate de §1.2 governa. `painRegions.ts` só tem import de tipo, então o Node
 * o executa direto.
 */
const { painRegionLabels } = await import(
  pathToFileURL(resolve(ROOT, 'src/domain/painRegions.ts')).href
);
const PAIN_LABELS = Object.fromEntries(
  Object.entries(painRegionLabels).map(([k, v]) => [k, v.toLowerCase()]),
);

const DEPTH_LABELS = { below_parallel: 'abaixo', at_parallel: 'paralelo', above_parallel: 'ACIMA', unknown: '?' };
const BAR_LABELS = {
  ipf_calibrated: 'IPF', stiff: 'rígida', gym_barbell: 'academia', deadlift_bar: 'terra',
  safety_squat: 'SSB', trap: 'trap', smith: 'smith', other: 'outra',
};
const PLATE_LABELS = {
  calibrated: 'calibrada', steel: 'ferro', rubber_bumper: 'bumper',
  thick_plastic: 'PLÁSTICO GROSSA', other: 'outra',
};
const GEAR_LABELS = { belt: 'cinto', straps: 'STRAP', kneeSleeves: 'joelheira', wristWraps: 'munhequeira' };

// ---------------------------------------------------------------------------
// Renderização
// ---------------------------------------------------------------------------

function renderHeader(athlete, state) {
  const p = athlete?.profile ?? {};
  const bw = state?.bodyweight ?? {};
  const next = state?.nextSession;
  const lines = [];

  lines.push(`# Briefing — ${athlete?.programName ?? 'programa'} · ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('## Estado');
  lines.push(
    `Semana **${state?.currentWeek ?? '—'}/${athlete?.totalWeeks ?? '—'}** · `
    + `sessão ${((state?.sessionIndex ?? 0) + 1)}/${state?.totalSessions ?? '—'}`
    + (next ? ` · próxima: ${dayLabel(next.dayType)} (${next.blockName}${next.isDeload ? ', DELOAD' : ''})` : ''),
  );
  lines.push(
    `Marcas de trabalho: agacho ${n(p.squat1RM, 0)} · supino ${n(p.bench1RM, 0)} · terra ${n(p.deadlift1RM, 0)} `
    + `· total ${n(p.total, 0)} · DOTS ${n(p.dots)}`,
  );

  if (bw.latest) {
    lines.push(
      `Peso ${n(bw.latest.weightKg)} kg (${day(bw.latest.date)})`
      + (bw.d7 ? ` · 7d ${n(bw.d7.weightKg)}` : '')
      + (bw.d28 ? ` · 28d ${n(bw.d28.weightKg)}` : '')
      + (bw.trendKgPerWeek != null ? ` · tendência ${n(bw.trendKgPerWeek, 2)} kg/sem` : '')
      + (bw.dotsDelta28 != null ? ` · DOTS 28d ${bw.dotsDelta28 >= 0 ? '+' : '−'}${n(Math.abs(bw.dotsDelta28))}` : ''),
    );
  }

  const records = (state?.records ?? []).slice(0, 5);
  if (records.length) {
    lines.push(
      'PRs: ' + records.map((r) => `${r.name} ${n(r.e1rm)} (${n(r.weight, 0)}×${r.reps}@${r.rpe})`).join(' · '),
    );
  }
  return lines;
}

function renderTrendTable(weeks) {
  if (weeks.length < 2) return [];
  const lines = ['', '## Tendência', '', '| Sem | Sessões | Séries | Tonelagem | sRPE load | Prontidão | Peso | DOTS | Reps válidas |', '|---|---|---|---|---|---|---|---|---|'];
  for (const w of [...weeks].reverse()) {
    lines.push(
      `| ${w.weekNumber}${w.isDeload ? ' D' : ''} `
      + `| ${w.adherence.sessionsCompleted}/${w.adherence.sessionsPrescribed} `
      + `| ${w.adherence.setsCompleted}/${w.adherence.setsPrescribed} `
      + `| ${nf0.format(w.tonnage.total)} `
      + `| ${n(w.surveys.sRPELoad, 0)} `
      + `| ${n(w.surveys.readinessScore)} `
      + `| ${n(w.bodyweight.end)} `
      + `| ${n(w.bodyweight.dotsEnd)} `
      + `| ${pct(w.compliance.validRepPct)} |`,
    );
  }
  return lines;
}

function renderCompliance(c) {
  const lines = ['', '### Padrão de competição'];
  lines.push(
    `Julgadas ${c.judgedSets}/${c.sets} séries · ${c.validReps}/${c.judgedReps} reps válidas (${pct(c.validRepPct)}) · ${c.videos} vídeos`,
  );
  if (c.judgedSets === 0) lines.push('> Nenhuma série julgada nesta semana — o histórico da semana é ambíguo em padrão IPF.');

  const squat = c.byLift?.squat;
  if (squat) {
    const depth = topEntries(squat.depth).map(([k, v]) => `${DEPTH_LABELS[k] ?? k} ${v}`).join(' / ');
    lines.push(`- Agacho: ${squat.judgedSets}/${squat.sets} julgadas · ${pct(squat.validRepPct)} válidas${depth ? ` · profundidade ${depth}` : ''}`);
  }
  const bench = c.byLift?.bench;
  if (bench) {
    lines.push(
      `- Supino: ${bench.judgedSets}/${bench.sets} julgadas · ${pct(bench.validRepPct)} válidas`
      + (bench.pausedSets ? ` · ${bench.pausedSets} pausadas, média ${n(bench.avgPauseSec, 2)}s` : ' · sem pausa registrada'),
    );
  }
  const dl = c.byLift?.deadlift;
  if (dl) {
    lines.push(
      `- Terra: ${dl.judgedSets}/${dl.sets} julgadas · ${pct(dl.validRepPct)} válidas`
      + (dl.deadStopSets ? ` · ${dl.deadStopSets} parada morta` : '')
      + (dl.strapSets ? ` · ⚠️ ${dl.strapSets} com STRAP` : ''),
    );
  }

  const gear = topEntries(c.equipment).map(([k, v]) => `${GEAR_LABELS[k] ?? k} ${v}`).join(' · ');
  if (gear) lines.push(`Equipamento: ${gear}`);
  const bars = topEntries(c.bars).map(([k, v]) => `${BAR_LABELS[k] ?? k} ${v}`).join(' · ');
  const plates = topEntries(c.plates).map(([k, v]) => `${PLATE_LABELS[k] ?? k} ${v}`).join(' · ');
  if (bars || plates) lines.push(`Material: ${[bars, plates].filter(Boolean).join(' | ')}`);
  return lines;
}

function renderWeek(w, full) {
  const lines = ['', `## Semana ${w.weekNumber} — ${w.blockName}${w.isDeload ? ' (DELOAD)' : ''} · ${day(w.firstDate)}–${day(w.lastDate)}`];

  for (const flag of w.flags ?? []) lines.push(`⚑ ${flag}`);
  if (w.flags?.length) lines.push('');

  const a = w.adherence;
  lines.push(
    `Aderência ${a.sessionsCompleted}/${a.sessionsPrescribed} sessões · ${a.setsCompleted}/${a.setsPrescribed} séries (${pct(a.completionPct)})`
    + ` · plano: ${a.planAdherence.full} full, ${a.planAdherence.partial} parcial, ${a.planAdherence.none} nenhum`,
  );
  if (a.exercisesSkipped?.length) {
    lines.push('Pulados: ' + a.exercisesSkipped.map((e) => `${e.name} (${e.sessions}×)`).join(' · '));
  }

  const t = w.tonnage;
  lines.push(
    `Tonelagem ${kg(t.total)} — agacho ${kg(t.byLift.squat)} · supino ${kg(t.byLift.bench)} · terra ${kg(t.byLift.deadlift)}`
    + (t.byLift.ohp ? ` · OHP ${kg(t.byLift.ohp)}` : '')
    + ` · outros ${kg(t.byLift.other)}`,
  );

  const s = w.surveys;
  if (s.n > 0) {
    const d = s.deltaPrevWeek ?? {};
    lines.push(
      `Surveys (n=${s.n}): sono ${n(s.averages.sleepQuality)}${signed(d.sleepQuality)} · ${n(s.averages.sleepHours)}h`
      + ` · energia ${n(s.averages.energyLevel)}${signed(d.energyLevel)}`
      + ` · estresse ${n(s.averages.stressLevel)}${signed(d.stressLevel)}`
      + ` · motivação ${n(s.averages.motivation)}${signed(d.motivation)}`
      + ` · sRPE ${n(s.averages.sessionRPE)}${signed(d.sessionRPE)}`
      + ` · qualidade ${n(s.averages.sessionQuality)}${signed(d.sessionQuality)}`,
    );
    lines.push(
      `Prontidão ${n(s.readinessScore)} · carga sRPE ${n(s.sRPELoad, 0)}`
      + ` · força percebida: ${s.strengthPerception.above} acima / ${s.strengthPerception.normal} normal / ${s.strengthPerception.below} abaixo`,
    );
  }

  const bw = w.bodyweight;
  if (bw.n > 0) {
    lines.push(
      `Peso ${n(bw.start)} → ${n(bw.end)} kg${signed(bw.deltaKg, 2)}`
      + (bw.dotsEnd != null ? ` · DOTS ${n(bw.dotsStart)} → ${n(bw.dotsEnd)}${signed(bw.dotsDelta)}` : ''),
    );
  }

  if (w.pain?.length) {
    lines.push('Dor: ' + w.pain.map((p) => `${PAIN_LABELS[p.region] ?? p.region} ${p.occurrences}× (pico ${p.maxIntensity}/10)`).join(' · '));
  }

  if (!full) return lines;

  // --- e1RM de topo ---
  const tops = Object.entries(w.topE1rm ?? {}).sort((a2, b2) => b2[1].e1rm - a2[1].e1rm);
  if (tops.length) {
    lines.push('', '### e1RM de topo', '', '| Exercício | e1RM | Série | Δ sem. ant. |', '|---|---|---|---|');
    for (const [, top] of tops.slice(0, 12)) {
      lines.push(`| ${top.name} | ${n(top.e1rm)} | ${n(top.weight, 0)}×${top.reps}@${top.rpe}${top.isPR ? ' **PR**' : ''} | ${top.deltaPrevWeek != null ? n(top.deltaPrevWeek) : '—'} |`);
    }
  }

  lines.push(...renderCompliance(w.compliance));

  // --- Volume por grupo ---
  const vol = w.volumeByMuscle;
  const muscles = Object.keys(vol.prescribed ?? {}).length
    ? Object.keys(vol.prescribed)
    : Object.keys(vol.actual ?? {});
  if (muscles.length) {
    const parts = muscles
      .map((m) => ({ m, actual: vol.actual?.[m] ?? 0, presc: vol.prescribed?.[m] ?? 0, delta: vol.delta?.[m] ?? 0 }))
      .filter((x) => x.actual || x.presc)
      .sort((a2, b2) => b2.presc - a2.presc)
      .map((x) => `${x.m} ${n(x.actual)}/${n(x.presc)}${Math.abs(x.delta) >= 1 ? `**${signed(x.delta)}**` : ''}`);
    lines.push('', '### Volume por grupo (séries reais/prescritas)', '', parts.join(' · '));
  }

  // --- Desvios ---
  if (w.deviations?.length) {
    lines.push('', '### Desvios vs prescrito', '', '| Exercício | Séries | Δ reps | Δ RPE | Δ carga | Δ séries |', '|---|---|---|---|---|---|');
    for (const d of w.deviations.slice(0, 10)) {
      lines.push(`| ${d.name} | ${d.sets} | ${d.avgRepsDelta != null ? n(d.avgRepsDelta, 2) : '—'} | ${d.avgRpeDelta != null ? n(d.avgRpeDelta, 2) : '—'} | ${d.avgLoadDeltaPct != null ? pct(d.avgLoadDeltaPct) : '—'} | ${d.setsDelta || '0'} |`);
    }
  }

  // --- Sessões ---
  if (w.sessions?.length) {
    lines.push('', '### Sessões', '', '| Data | Dia | Séries | Tonelagem | sRPE | Qual | Top set |', '|---|---|---|---|---|---|---|');
    for (const s2 of w.sessions) {
      const top = s2.topSet ? `${s2.topSet.name} ${n(s2.topSet.weight, 0)}×${s2.topSet.reps}@${s2.topSet.rpe}` : '—';
      lines.push(
        `| ${day(s2.date)} | ${dayLabel(s2.dayType)} | ${s2.setsCompleted}/${s2.setsPrescribed} `
        + `| ${nf0.format(s2.tonnage)} | ${n(s2.sessionRPE)} | ${n(s2.sessionQuality)} | ${top} |`,
      );
    }
  }

  // --- Notas ---
  if (w.notes?.length) {
    lines.push('', '### Notas do atleta');
    for (const note of w.notes) {
      lines.push(`- ${day(note.date)}${note.exerciseName ? ` · ${note.exerciseName}` : ''}: ${note.text}`);
    }
  }

  return lines;
}

function renderSessions(sessions) {
  if (!sessions.length) return [];
  const lines = ['', '## Sessões recentes — detalhe por exercício'];
  for (const s of sessions) {
    lines.push('', `### ${day(s.date)} · ${dayLabel(s.dayType)}${s.durationMin ? ` · ${s.durationMin} min` : ''}`);
    lines.push('', '| Exercício | Prescrito | Feito | Top set | Δ RPE | Padrão |', '|---|---|---|---|---|---|');
    for (const ex of s.exercises) {
      const top = ex.topSet ? `${n(ex.topSet.weight, 0)}×${ex.topSet.reps}@${ex.topSet.rpe} (${n(ex.topSet.e1rm)})` : '—';
      const comp = ex.compliance?.judgedSets
        ? `${ex.compliance.validReps}/${ex.compliance.judgedReps} válidas`
        : '—';
      lines.push(
        `| ${ex.name}${ex.skipped ? ' (pulado)' : ''} | ${ex.prescribed.sets}×${ex.prescribed.reps}@${ex.prescribed.rpe} `
        + `| ${ex.setsCompleted} | ${top} | ${ex.avgRpeDelta != null ? n(ex.avgRpeDelta, 2) : '—'} | ${comp} |`,
      );
    }
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }

  loadEnv();

  const config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  const email = process.env.FIREBASE_EMAIL;
  const password = process.env.FIREBASE_PASSWORD;

  const missing = [
    ...Object.entries(config).filter(([, v]) => !v).map(([k]) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`),
    ...(email ? [] : ['FIREBASE_EMAIL']),
    ...(password ? [] : ['FIREBASE_PASSWORD']),
  ];
  if (missing.length) {
    console.error(`Faltam variáveis no .env: ${missing.join(', ')}\nVeja .env.example e docs/firebase-setup.md`);
    process.exit(1);
  }

  const { initializeApp } = await import('firebase/app');
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  const { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs } =
    await import('firebase/firestore');

  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  let reads = 0;

  const athleteSnap = await getDoc(doc(db, `athletes/${uid}`));
  reads += 1;
  const stateSnap = await getDoc(doc(db, `athletes/${uid}/state/current`));
  reads += 1;

  if (!athleteSnap.exists()) {
    console.error('Nenhum dado no Firestore para esta conta. Abra o app, entre na conta e use "Reenviar tudo".');
    process.exit(1);
  }

  const athlete = athleteSnap.data();
  const state = stateSnap.exists() ? stateSnap.data() : null;
  const programId = state?.activeProgramId ?? athlete.activeProgramId;

  const defaultWeeks = Number(process.env.BRIEFING_WEEKS) || 4;
  const howMany = args.week ? 1 : (args.weeks || defaultWeeks);
  const weeksQuery = args.week
    ? query(
        collection(db, `athletes/${uid}/weeks`),
        where('programId', '==', programId),
        where('weekNumber', '==', args.week),
        limit(1),
      )
    : query(
        collection(db, `athletes/${uid}/weeks`),
        where('programId', '==', programId),
        orderBy('weekNumber', 'desc'),
        limit(howMany),
      );

  const weeksSnap = await getDocs(weeksQuery);
  reads += weeksSnap.size;
  const weeks = weeksSnap.docs.map((d) => d.data());

  let sessions = [];
  if (args.sessions && weeks[0]?.sessions?.length) {
    for (const row of weeks[0].sessions) {
      const snap = await getDoc(doc(db, `athletes/${uid}/sessions/${row.id}`));
      reads += 1;
      if (snap.exists()) sessions.push(snap.data());
    }
  }

  if (args.json) {
    const payload = JSON.stringify({ athlete, state, weeks, sessions }, null, 2);
    if (args.out) writeFileSync(resolve(ROOT, args.out), payload);
    else process.stdout.write(payload);
    process.exit(0);
  }

  const lines = [
    ...renderHeader(athlete, state),
    ...renderTrendTable(weeks),
  ];

  weeks.forEach((w, i) => {
    lines.push(...renderWeek(w, args.allWeeks || i === 0));
  });

  lines.push(...renderSessions(sessions));

  if (weeks.length === 0) {
    lines.push('', '> Nenhuma semana sincronizada ainda. No app: Config → Nuvem → "Reenviar tudo".');
  }

  lines.push('', '---', `_${reads} leituras no Firestore · gerado em ${new Date().toISOString()}_`);

  const output = lines.join('\n') + '\n';
  if (args.out) {
    writeFileSync(resolve(ROOT, args.out), output);
    console.error(`Briefing gravado em ${args.out} (${reads} leituras).`);
  } else {
    process.stdout.write(output);
  }

  process.exit(0);
}

// Exportado para teste do formato sem tocar na rede.
export const __render = { renderHeader, renderTrendTable, renderWeek, renderSessions };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Falhou: ${error?.message ?? error}`);
    process.exit(1);
  });
}
