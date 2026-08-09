#!/usr/bin/env node
/**
 * Teste do gate de dor de peitoral. Duas metades, e a segunda é a que importa.
 *
 * A primeira metade prova que o gate DISPARA: um registro de dor de peito de
 * 2/10 tem de levantar bandeira no rollup semanal. É a regressão concreta que
 * motivou tudo — o app só reagia a partir de 6/10, e nem tinha a região.
 *
 * A segunda metade prova que a CHECAGEM está viva. Uma checagem que nunca
 * reprova é indistinguível de uma checagem morta, e uma trava morta é pior que
 * nenhuma trava porque compra confiança sem entregar nada. Aqui a tabela do
 * §1.2 é adulterada numa cópia do markdown e `check-pain-gate.mjs` TEM de sair
 * com código diferente de zero — inclusive com a comparação de constante
 * desligada, o que isola o braço que compara tabela contra comportamento real.
 *
 * Uso: node scripts/check-pain-gate.test.mjs
 */

import './ts-resolve.mjs';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseGateDor } from './gate-dor.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');
const CHECKER = join(ROOT, 'scripts/check-pain-gate.mjs');

const { buildWeekDoc } = await import(join(ROOT, 'src/services/sync/weeklyRollup.ts'));
const { venaBlock1Weeks } = await import(join(ROOT, 'src/data/program/vena-block1/generated.ts'));
const { PAIN_GATE, evaluatePainGate } = await import(join(ROOT, 'src/domain/painGate.ts'));

let passed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
    console.log(`  ✗ ${name}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const WEEK = venaBlock1Weeks[0];

/**
 * `phase` (`pre` · `post` · `ambos`) escolhe em qual dos momentos do §1.2 o log
 * foi colhido. O pré cai em `pre.pain`, o pós em `post.newPain`, e o rollup os lê
 * por dois caminhos diferentes: uma checagem que só monta `pre` aprova um gate
 * cego ao log pós-sessão sem nenhum erro de tipo.
 */
function weekWith(painBySession, phase = 'pre') {
  const sessions = painBySession.map((pain, i) => ({
    schemaVersion: 1,
    updatedAt: '2026-03-01T12:00:00.000Z',
    id: `s${i}`,
    date: `2026-03-0${i + 1}T12:00:00.000Z`,
    programId: 'vena-block1',
    weekId: 'vena-block1-w1',
    weekNumber: 1,
    macrocycle: 1,
    dayIndex: i,
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
      pain: phase === 'pre' || phase === 'ambos' ? pain : [],
      supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: phase === 'post' || phase === 'ambos'
      ? {
        sessionQuality: 7, sessionRPE: 8,
        strengthPerception: 'normal', planAdherence: 'full',
        newPain: pain,
      }
      : null,
  }));
  return buildWeekDoc({
    programId: 'vena-block1',
    programName: 'Vena Bloco 1',
    week: WEEK,
    sessions,
    workouts: [],
    bodyweight: [],
  });
}

const gateFlags = (doc) => doc.flags.filter((f) => f.startsWith('GATE DE PEITORAL'));

console.log('\nGate de dor de peitoral — comportamento');

// --- 1. O gate dispara -------------------------------------------------------

test('dor de peito 2/10 numa única sessão levanta a bandeira do gate', () => {
  const doc = weekWith([[{ region: 'left_chest', intensity: 2 }]]);
  const flags = gateFlags(doc);
  assert(flags.length === 1, `esperava 1 bandeira de gate, veio ${flags.length}: ${JSON.stringify(doc.flags)}`);
  assert(flags[0].includes('congela'), `a bandeira devia mandar congelar: "${flags[0]}"`);
});

test('a mesma dor a 2/10 NÃO era detectada pelo limiar antigo de 6/10', () => {
  // Guarda contra reintrodução da heurística global: se alguém voltar o limiar
  // do peitoral para 6, este teste e o de cima caem juntos.
  assert(PAIN_GATE.limiarMinimo === 2, `limiar do gate virou ${PAIN_GATE.limiarMinimo}`);
  assert(PAIN_GATE.limiarMinimo < 6, 'o limiar do gate não pode alcançar a heurística geral de 6/10');
});

test('dor de peito 2/10 no log PÓS-sessão levanta a mesma bandeira', () => {
  // O §1.2 colhe em três momentos e o pós-sessão é o que tem mais chance de
  // pegar uma fisgada vinda do supino daquele dia. Ele entra no rollup por
  // `post.newPain`, um campo DIFERENTE do pré — apagar esse lado de
  // `buildGateReadings` não quebra nenhum tipo.
  const flags = gateFlags(weekWith([[{ region: 'left_chest', intensity: 2 }]], 'post'));
  assert(flags.length === 1 && flags[0].includes('congela'),
    `o log pós-sessão não chegou ao gate: ${JSON.stringify(flags)}`);
});

test('pré e pós da MESMA sessão contam um evento só, não dois', () => {
  // Três momentos por sessão não podem virar três eventos: a tabela conta
  // eventos de SESSÃO, e o degrau de recuo exige duas sessões distintas.
  const flags = gateFlags(weekWith([[{ region: 'left_chest', intensity: 2 }]], 'ambos'));
  assert(flags.length === 1 && flags[0].includes('1 evento ≥'),
    `pré + pós da mesma sessão deviam ser um evento só: ${JSON.stringify(flags)}`);
});

test('1/10 fica em silêncio — pico isolado abaixo do limiar não é evento', () => {
  assert(gateFlags(weekWith([[{ region: 'right_chest', intensity: 1 }]])).length === 0,
    'gate disparou abaixo do limiar da tabela');
});

test('4/10 encerra a sessão, não apenas congela', () => {
  const flags = gateFlags(weekWith([[{ region: 'left_chest', intensity: 4 }]]));
  assert(flags.length === 1 && flags[0].includes('encerra a sessão'),
    `esperava o degrau de encerrar sessão: ${JSON.stringify(flags)}`);
});

test('dois eventos de 2/10 em três sessões recuam um degrau', () => {
  const flags = gateFlags(weekWith([
    [{ region: 'left_chest', intensity: 2 }],
    [],
    [{ region: 'left_chest', intensity: 2 }],
  ]));
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `esperava o degrau de recuo: ${JSON.stringify(flags)}`);
});

test('os dois lados somam no mesmo tecido', () => {
  const flags = gateFlags(weekWith([
    [{ region: 'left_chest', intensity: 2 }],
    [{ region: 'right_chest', intensity: 2 }],
  ]));
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `esquerdo + direito deviam contar dois eventos: ${JSON.stringify(flags)}`);
});

test('dor de joelho a 2/10 não dispara o gate do peitoral', () => {
  assert(gateFlags(weekWith([[{ region: 'left_knee', intensity: 2 }]])).length === 0,
    'gate do peitoral disparou para região fora do gate');
});

test('a gaveta "Outro" a 2/10 aponta para o §1.2 sem se passar por peitoral', () => {
  const doc = weekWith([[{ region: 'other', intensity: 2 }]]);
  assert(gateFlags(doc).length === 0, '"Outro" não pode disparar o gate como evento confirmado');
  assert(doc.flags.some((f) => f.includes(PAIN_GATE.secao)),
    `"Outro" a 2/10 ficou mudo: ${JSON.stringify(doc.flags)}`);
});

test('sem leitura de peitoral, nenhum degrau é inventado', () => {
  assert(evaluatePainGate([]) === null, 'gate disparou sem leitura nenhuma');
});

// --- 2. A checagem está viva -------------------------------------------------

console.log('\nGate de dor de peitoral — a checagem reprova quando deve');

function runChecker(sourcePath, extra = []) {
  return spawnSync(process.execPath, [CHECKER, '--source', sourcePath, ...extra], {
    cwd: ROOT, encoding: 'utf8',
  });
}

const tmp = mkdtempSync(join(tmpdir(), 'gate-dor-'));
try {
  const original = readFileSync(SRC, 'utf8');

  test('a checagem passa contra o markdown real', () => {
    const r = runChecker(SRC);
    assert(r.status === 0, `esperava sucesso, saiu ${r.status}:\n${r.stdout}\n${r.stderr}`);
  });

  // A mutação sobe o limiar de 2 para 3 — um degrau, o bastante para a tabela e
  // o app discordarem em 2/10, e pouco o bastante para continuar sendo uma
  // tabela internamente coerente (3 < 4 do degrau de encerrar). Uma mutação
  // grosseira seria barrada pelas travas de sanidade do parser e não provaria
  // nada sobre a comparação com o comportamento.
  test('limiar adulterado na tabela (2/10 → 3/10) reprova a checagem', () => {
    const path = join(tmp, 'PROGRAMA-limiar.md');
    const mutated = original
      .replace('| **1 evento ≥2/10** |', '| **1 evento ≥3/10** |')
      .replace('| **2 eventos ≥2/10 em 3 sessões de supino** |',
        '| **2 eventos ≥3/10 em 3 sessões de supino** |');
    assert(mutated !== original, 'a mutação não achou as linhas da tabela');
    writeFileSync(path, mutated);
    const r = runChecker(path);
    assert(r.status !== 0, `a checagem passou com a tabela adulterada:\n${r.stdout}`);
  });

  test('o braço tabela↔comportamento reprova sozinho, sem a comparação de constante', () => {
    const path = join(tmp, 'PROGRAMA-limiar.md');
    const r = runChecker(path, ['--no-generated-check']);
    assert(r.status !== 0, `o braço comportamental não reprovou:\n${r.stdout}`);
    assert(/produzido pelo app/.test(r.stderr),
      `a reprovação não veio da comparação com o comportamento:\n${r.stderr}`);
  });

  test('janela adulterada (3 → 1 sessão) reprova a checagem', () => {
    const path = join(tmp, 'PROGRAMA-janela.md');
    writeFileSync(path, original.replace('em 3 sessões de supino', 'em 1 sessões de supino'));
    const r = runChecker(path, ['--no-generated-check']);
    assert(r.status !== 0, `a checagem passou com a janela adulterada:\n${r.stdout}`);
  });

  test('degrau removido da tabela reprova o parser', () => {
    const path = join(tmp, 'PROGRAMA-sem-degrau.md');
    writeFileSync(path, original.split('\n')
      .filter((l) => !l.startsWith('| **≥4/10 ou estiramento agudo**')).join('\n'));
    const r = runChecker(path);
    assert(r.status !== 0, `a checagem passou sem o degrau de encerrar sessão:\n${r.stdout}`);
  });

  test('ordem invertida (encerrar mais barato que congelar) reprova o parser', () => {
    const md = original.replace('| **≥4/10 ou estiramento agudo** |', '| **≥1/10 ou estiramento agudo** |');
    let erro = null;
    try { parseGateDor(md); } catch (e) { erro = e.message; }
    assert(erro && /Ordem invertida/.test(erro), `esperava erro de ordem, veio: ${erro}`);
  });

  test('escala fora do declarado reprova o parser', () => {
    const md = original.replace('| **≥4/10 ou estiramento agudo** |', '| **≥14/10 ou estiramento agudo** |');
    let erro = null;
    try { parseGateDor(md); } catch (e) { erro = e.message; }
    assert(erro && /fora da escala/.test(erro), `esperava erro de escala, veio: ${erro}`);
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n${passed} passaram, ${failures.length} falharam`);
if (failures.length > 0) {
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}
console.log('');
