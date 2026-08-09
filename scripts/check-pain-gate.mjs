#!/usr/bin/env node
/**
 * Trava o gate de dor de peitoral: a TABELA de `PROGRAMA.md §1.2` contra o
 * COMPORTAMENTO REAL do rollup semanal.
 *
 * Por que este arquivo existe. O gate morava em dois lugares — a prosa do §1.2 e
 * um `if` em `weeklyRollup.ts` — e os dois divergiram sem ninguém notar: o
 * programa manda congelar o supino a partir de 2/10 e o app não levantava
 * bandeira antes de 6/10, num atleta com histórico de lesão de peitoral. Prosa e
 * código não se comparam sozinhos; passam a se comparar aqui.
 *
 * O que é verificado, e nenhuma parte disto é uma reimplementação da regra:
 *   1. O que o gerador gravou em `VENA_BLOCK1_PAIN_GATE` é o que a tabela diz.
 *   2. Para TODA intensidade da escala declarada, a bandeira que `buildWeekDoc`
 *      produz é exatamente o degrau que a tabela manda — inclusive o silêncio
 *      abaixo do limiar.
 *   3. A janela de eventos (`N eventos em M sessões`) é respeitada nos dois
 *      sentidos: dispara dentro da janela, não dispara fora dela.
 *   4. Toda região de peitoral do enumerado é coberta, e região fora do gate não
 *      dispara o gate.
 *
 * As entradas do teste são derivadas da TABELA (limiar, limiar−1, nº de eventos,
 * tamanho da janela). Rodar com `--source` apontando para um markdown adulterado
 * é o que prova que esta checagem está viva — é o que `check-pain-gate.test.mjs`
 * faz.
 *
 * Uso: node scripts/check-pain-gate.mjs [--source <PROGRAMA.md>] [--verbose]
 */

import './ts-resolve.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { parseGateDor } from './gate-dor.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_SRC = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');
const srcArg = argv.indexOf('--source');
const SRC = srcArg >= 0 ? resolve(argv[srcArg + 1]) : DEFAULT_SRC;
/**
 * Desliga só a comparação tabela ↔ constante gerada, deixando a comparação
 * tabela ↔ COMPORTAMENTO de pé. Existe para o teste conseguir provar que o braço
 * comportamental está vivo: com a tabela adulterada, ele tem de reprovar sozinho,
 * sem ajuda da comparação de constante. Não use no build.
 */
const SKIP_GENERATED = argv.includes('--no-generated-check');

const { buildWeekDoc } = await import(join(ROOT, 'src/services/sync/weeklyRollup.ts'));
const { VENA_BLOCK1_PAIN_GATE, venaBlock1Weeks } = await import(
  join(ROOT, 'src/data/program/vena-block1/generated.ts')
);
const { painGateChestRegions, painGateAmbiguousRegions } = await import(
  join(ROOT, 'src/domain/painGate.ts')
);
const { painRegionLabels } = await import(join(ROOT, 'src/domain/painRegions.ts'));

const table = parseGateDor(readFileSync(SRC, 'utf8'));
const errors = [];
const checked = [];

// --- 1. Tabela ↔ constante gerada -------------------------------------------

const asJson = (v) => JSON.stringify(v);
if (!SKIP_GENERATED && asJson(table) !== asJson(VENA_BLOCK1_PAIN_GATE)) {
  errors.push(
    'VENA_BLOCK1_PAIN_GATE diverge da tabela do §1.2 lida agora.\n' +
      `    tabela  : ${asJson(table)}\n` +
      `    gerado  : ${asJson(VENA_BLOCK1_PAIN_GATE)}\n` +
      '    Se você editou o PROGRAMA.md, rode: npm run build:vena',
  );
}

// --- Montagem de um rollup mínimo mas real ----------------------------------

const WEEK = venaBlock1Weeks[0];

/**
 * O §1.2 manda colher o log em TRÊS momentos — pré-sessão, 1ª pausada e
 * pós-sessão. No rollup, o pré cai em `pre.pain` e o pós em `post.newPain`, e
 * são dois campos diferentes lidos por dois `??` diferentes em
 * `buildGateReadings`. Toda cena é montada nos DOIS campos: até esta revisão a
 * checagem só usava `pre`, e o gate podia ficar cego ao log pós-sessão — o
 * momento em que uma fisgada de peitoral do supino tem mais chance de aparecer —
 * com o `npm run build` inteiro verde.
 */
const PHASES = ['pre', 'post'];

function session(date, painEntries, phase = 'pre') {
  return {
    schemaVersion: 1,
    updatedAt: `${date}T12:00:00.000Z`,
    id: `s-${date}`,
    date: `${date}T12:00:00.000Z`,
    programId: 'vena-block1',
    weekId: 'vena-block1-w1',
    weekNumber: 1,
    macrocycle: 1,
    dayIndex: 0,
    dayType: WEEK.days[0].dayType,
    blockName: WEEK.blockName,
    blockType: WEEK.blockType,
    completed: true,
    durationMin: 60,
    setsPrescribed: 1,
    setsCompleted: 1,
    tonnage: 0,
    tonnageByLift: {},
    volumeByMuscle: {},
    exercises: [],
    compliance: {
      sets: 0, judgedSets: 0, reps: 0, judgedReps: 0, validReps: 0, validRepPct: null,
      videos: 0, byLift: {},
      equipment: { belt: 0, straps: 0, kneeSleeves: 0, wristWraps: 0 },
      bars: {}, plates: {},
    },
    pre: {
      sleepQuality: 7, sleepHours: 8, energyLevel: 7, stressLevel: 3, motivation: 7,
      pain: phase === 'pre' ? painEntries : [],
      supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: phase === 'post'
      ? {
        sessionQuality: 7, sessionRPE: 8,
        strengthPerception: 'normal', planAdherence: 'full',
        newPain: painEntries,
      }
      : null,
  };
}

/** Bandeiras de uma semana montada com as leituras de dor dadas. */
function flagsFor(sessionsPain, phase = 'pre') {
  const sessions = sessionsPain.map((entries, i) =>
    session(`2026-03-0${i + 1}`, entries, phase));
  const doc = buildWeekDoc({
    programId: 'vena-block1',
    programName: 'Vena Bloco 1',
    week: WEEK,
    sessions,
    workouts: [],
    bodyweight: [],
  });
  return doc.flags;
}

/** Qual degrau da tabela a bandeira anuncia, se algum. */
function firedStep(flags) {
  const line = flags.find((f) => f.startsWith('GATE DE PEITORAL'));
  if (!line) return null;
  const hit = table.degraus.filter((d) => line.includes(d.sinal));
  if (hit.length !== 1) {
    errors.push(`Bandeira do gate não casa com exatamente um sinal da tabela: "${line}"`);
    return null;
  }
  return hit[0].id;
}

function expect(what, actual, expected) {
  checked.push(what);
  if (actual !== expected) {
    errors.push(`${what}\n    esperado pela tabela: ${expected ?? '(nenhum degrau)'}\n    produzido pelo app  : ${actual ?? '(nenhum degrau)'}`);
  }
}

// --- 2. Varredura exaustiva da escala, um evento -----------------------------

const [minEscala, maxEscala] = table.escala;
const region = painGateChestRegions[0];

/** Degrau que a tabela manda para UM evento de intensidade `i`. */
function expectedForSingle(i) {
  const d = table.degraus.find((x) => x.eventos === 1 && i >= x.limiar);
  return d ? d.id : null;
}

for (const phase of PHASES) {
  for (let i = minEscala; i <= maxEscala; i += 1) {
    const flags = i === 0 ? flagsFor([[]], phase) : flagsFor([[{ region, intensity: i }]], phase);
    expect(
      `1 evento de ${i}/10 em ${region} (log ${phase}-sessão)`,
      firedStep(flags),
      i === 0 ? null : expectedForSingle(i),
    );
  }
}

// --- 3. Janela de eventos, nos dois sentidos ---------------------------------

for (const degrau of table.degraus.filter((d) => d.eventos > 1)) {
  const { eventos, limiar, janelaSessoes, id } = degrau;

  // Dentro da janela: N eventos em N sessões seguidas → o degrau tem de sair.
  const dentro = Array.from({ length: janelaSessoes }, (_, i) =>
    (i < eventos ? [{ region, intensity: limiar }] : []));
  expect(`${eventos} eventos de ${limiar}/10 em ${janelaSessoes} sessões colhidas`,
    firedStep(flagsFor(dentro)), id);

  // Fora da janela: os mesmos N eventos espaçados por sessões COLHIDAS a mais
  // do que a janela comporta → só o degrau de 1 evento pode sair.
  const espacado = [];
  for (let e = 0; e < eventos; e += 1) {
    espacado.push([{ region, intensity: limiar }]);
    if (e < eventos - 1) {
      for (let g = 0; g < janelaSessoes; g += 1) {
        espacado.push([{ region, intensity: Math.max(minEscala, limiar - 1) }]);
      }
    }
  }
  expect(`${eventos} eventos de ${limiar}/10 espaçados além de ${janelaSessoes} sessões`,
    firedStep(flagsFor(espacado)), expectedForSingle(limiar));
}

// --- 4. Cobertura de regiões -------------------------------------------------

const limiarMin = table.limiarMinimo;

for (const r of painGateChestRegions) {
  for (const phase of PHASES) {
    expect(`região ${r} a ${limiarMin}/10 (log ${phase}-sessão)`,
      firedStep(flagsFor([[{ region: r, intensity: limiarMin }]], phase)),
      expectedForSingle(limiarMin));
  }
}

/**
 * Nenhuma região de peitoral do ENUMERADO pode ficar fora do escopo do gate.
 *
 * `painGateChestRegions` é uma lista escrita à mão: apagar um lado dela, ou
 * acrescentar uma região de peitoral ao enumerado sem acrescentá-la ao gate,
 * não produz erro de compilação nenhum — e a lista é justamente de onde os
 * cenários acima tiram as regiões que testam, então ela nunca reprovaria a si
 * mesma. `painRegionLabels` é `Record<PainRegion, string>`, então o `tsc`
 * garante que ele tem TODAS as chaves do enumerado; é a única enumeração
 * exaustiva disponível fora do sistema de tipos. É a lição de "faltar gaveta é
 * pior que ter gaveta demais", aplicada à gaveta que o gate governa.
 */
for (const r of Object.keys(painRegionLabels)) {
  if (!/chest/.test(r)) continue;
  checked.push(`região "${r}" do enumerado está no escopo do gate`);
  if (!painGateChestRegions.includes(r)) {
    errors.push(
      `A região "${r}" existe em PainRegion mas está FORA de painGateChestRegions: ` +
        'dor registrada nela não é avaliada pelo gate do §1.2.',
    );
  }
}

// Os dois lados somam no MESMO tecido: um evento de cada lado, em duas sessões
// dentro da janela, tem de alcançar o degrau de dois eventos.
const doisLados = table.degraus.find((d) => d.eventos === 2);
if (doisLados && painGateChestRegions.length >= 2) {
  expect(
    `1 evento em cada lado (${painGateChestRegions.join(' + ')}) dentro da janela`,
    firedStep(flagsFor([
      [{ region: painGateChestRegions[0], intensity: doisLados.limiar }],
      [{ region: painGateChestRegions[1], intensity: doisLados.limiar }],
    ])),
    doisLados.id,
  );
}

// Região fora do gate não dispara o gate, nem no limiar dele.
expect(`left_knee a ${limiarMin}/10 não dispara o gate`,
  firedStep(flagsFor([[{ region: 'left_knee', intensity: limiarMin }]])), null);

// A gaveta ambígua não é o gate, mas não pode ficar muda no limiar dele.
for (const r of painGateAmbiguousRegions) {
  const flags = flagsFor([[{ region: r, intensity: limiarMin }]]);
  checked.push(`região ambígua ${r} a ${limiarMin}/10`);
  if (firedStep(flags) !== null) {
    errors.push(`Região ambígua "${r}" disparou o gate como se fosse peitoral confirmado`);
  }
  if (!flags.some((f) => f.includes(table.secao))) {
    errors.push(
      `Região ambígua "${r}" a ${limiarMin}/10 não produziu nenhuma bandeira apontando para ${table.secao}. ` +
        'Todo registro antigo de dor de peito caiu nessa gaveta.',
    );
  }
}

// --- Relatório ---------------------------------------------------------------

console.log(`\nGate de dor de peitoral — ${table.secao} de ${SRC.replace(`${ROOT}/`, '')}`);
console.log(`  escala .................... ${table.escala[0]}–${table.escala[1]}`);
console.log(`  limiar mínimo ............. ${table.limiarMinimo}/10`);
for (const d of table.degraus) {
  console.log(`  ${d.id.padEnd(15)} ...... ${d.eventos} evento(s) ≥${d.limiar}/10${d.janelaSessoes ? ` em ${d.janelaSessoes} sessões` : ''}`);
}
console.log(`  retorno ................... ${table.retorno.semanas} semanas com pico ≤${table.retorno.picoMaximo}/10`);
console.log(`  cenários exercitados ...... ${checked.length}`);

if (VERBOSE) for (const c of checked) console.log(`    · ${c}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} DIVERGÊNCIA(S) entre a tabela do §1.2 e o comportamento do app:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ o rollup obedece a tabela do §1.2 em todos os cenários\n');
