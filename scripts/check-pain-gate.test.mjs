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
const { PAIN_GATE, evaluatePainGate, painFlagDefault } = await import(join(ROOT, 'src/domain/painGate.ts'));

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
 * Os números deste arquivo saem da TABELA, e isso é conserto de um defeito real.
 *
 * Antes desta revisão os limiares apareciam como literais (`intensity: 2`,
 * `intensity: 4`) e as mutações eram trechos de markdown copiados à mão
 * (`'| **1 evento ≥2/10** |'`). O efeito: mudar o limiar na tabela DE PROPÓSITO
 * — que é a coisa que o §1.2 diz ser possível num passe só — derrubava o
 * `check:gate` com quatro falhas cujas mensagens apontam para o app ("dor de
 * peito 2/10 numa única sessão levanta a bandeira do gate ✗"), quando o app
 * estava certo e quem estava desatualizado era o teste. Falso positivo que
 * culpa o inocente ensina a ignorar o aviso, e este aviso governa um tecido
 * lesionado.
 *
 * `LIMIAR` e `LIMIAR_ENCERRA` valem só para montar cenas. O valor clínico de
 * hoje continua fixado — de propósito e num teste só, logo abaixo.
 */
const DEGRAU_ENCERRA = PAIN_GATE.degraus.find((d) => d.id === 'encerra_sessao');
const DEGRAU_RECUO = PAIN_GATE.degraus.find((d) => d.id === 'recua_degrau');
const DEGRAU_CONGELA = PAIN_GATE.degraus.find((d) => d.id === 'congela');
const LIMIAR = PAIN_GATE.limiarMinimo;
const LIMIAR_ENCERRA = DEGRAU_ENCERRA.limiar;
const JANELA = DEGRAU_RECUO.janelaSessoes;
const dor = (intensity, region = 'left_chest') => [{ region, intensity }];

/**
 * Adulteração do markdown a partir do SINAL que o parser leu, e não de um trecho
 * de tabela copiado à mão.
 *
 * O `sinal` do degrau é o texto da célula sem negrito nem crase, então ele é
 * substring literal da linha da tabela — trocar por cima dele acerta a célula
 * qualquer que seja o número escrito lá hoje. Com os trechos copiados, mudar a
 * tabela de propósito fazia estes testes morrerem com "a mutação não achou a
 * linha", que é uma falha sobre o teste vestida de falha sobre o app.
 */
function trocaSinal(md, degrau, novoSinal) {
  assert(md.includes(degrau.sinal), `o sinal "${degrau.sinal}" sumiu do §1.2`);
  return md.replace(degrau.sinal, novoSinal);
}
const comLimiar = (d, n) => d.sinal.replace(`≥${d.limiar}/10`, `≥${n}/10`);
/** O trecho da linha RETORNO que carrega os dois números, sem os negritos. */
const RETORNO_TRECHO = `${PAIN_GATE.retorno.semanas} semanas consecutivas com pico `
  + `≤${PAIN_GATE.retorno.picoMaximo}/10`;
function trocaRetorno(md, semanas, pico) {
  assert(md.includes(RETORNO_TRECHO), `o trecho "${RETORNO_TRECHO}" sumiu do §1.2`);
  return md.replace(RETORNO_TRECHO, `${semanas} semanas consecutivas com pico ≤${pico}/10`);
}

/** Dia `n` (1-based) da série de datas sintéticas, em ISO. */
function isoDay(n) {
  const d = new Date(Date.UTC(2026, 2, 1));
  d.setUTCDate(d.getUTCDate() + (n - 1));
  return `${d.toISOString().slice(0, 10)}T12:00:00.000Z`;
}

/**
 * `phase` (`pre` · `post` · `ambos`) escolhe em qual dos momentos do §1.2 o log
 * foi colhido. O pré cai em `pre.pain`, o pós em `post.newPain`, e o rollup os lê
 * por dois caminhos diferentes: uma checagem que só monta `pre` aprova um gate
 * cego ao log pós-sessão sem nenhum erro de tipo.
 *
 * `opts` existe para encadear semanas: `weekIndex` escolhe a semana prescrita,
 * `prev` é o `WeekDoc` da semana anterior (é por ele que o histórico do gate
 * atravessa a virada de semana), `firstDay` desloca as datas e `chest` liga o
 * volume de peitoral da sessão — que é o que a torna uma "sessão de supino" para
 * a janela do §1.2. `semLog` monta a sessão SEM pesquisa nenhuma: treinou
 * peitoral e não colheu o log.
 */
function weekWith(painBySession, phase = 'pre', opts = {}) {
  const { weekIndex = 0, prev = null, firstDay = 1, chest = false, semLog = false } = opts;
  const week = venaBlock1Weeks[weekIndex];
  const sessions = painBySession.map((pain, i) => ({
    schemaVersion: 1,
    updatedAt: '2026-03-01T12:00:00.000Z',
    id: `s${weekIndex}-${i}`,
    date: isoDay(firstDay + i),
    programId: 'vena-block1',
    weekId: `vena-block1-w${week.weekNumber}`,
    weekNumber: week.weekNumber,
    macrocycle: 1,
    dayIndex: i,
    dayType: week.days[0].dayType,
    blockName: week.blockName,
    blockType: week.blockType,
    completed: true,
    durationMin: 60,
    setsPrescribed: 1,
    setsCompleted: 1,
    tonnage: 0,
    tonnageByLift: {},
    volumeByMuscle: chest ? { peito: 5 } : {},
    exercises: [],
    compliance: {
      sets: 0, judgedSets: 0, reps: 0, judgedReps: 0, validReps: 0, validRepPct: null,
      videos: 0, byLift: {},
      equipment: { belt: 0, straps: 0, kneeSleeves: 0, wristWraps: 0 },
      bars: {}, plates: {},
    },
    pre: semLog ? null : {
      sleepQuality: 7, sleepHours: 8, energyLevel: 7, stressLevel: 3, motivation: 7,
      pain: phase === 'pre' || phase === 'ambos' ? pain : [],
      supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: !semLog && (phase === 'post' || phase === 'ambos')
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
    week,
    sessions,
    workouts: [],
    bodyweight: [],
  }, prev);
}

const gateFlags = (doc) => doc.flags.filter((f) => f.startsWith('GATE DE PEITORAL'));

console.log('\nGate de dor de peitoral — comportamento');

// --- 1. O gate dispara -------------------------------------------------------

test(`dor de peito ${LIMIAR}/10 numa única sessão levanta a bandeira do gate`, () => {
  const doc = weekWith([dor(LIMIAR)]);
  const flags = gateFlags(doc);
  assert(flags.length === 1, `esperava 1 bandeira de gate, veio ${flags.length}: ${JSON.stringify(doc.flags)}`);
  assert(flags[0].includes('congela'), `a bandeira devia mandar congelar: "${flags[0]}"`);
});

test('o limiar clínico de hoje continua sendo 2/10', () => {
  // ESTE é o único número desta suíte que NÃO sai da tabela, e é de propósito:
  // ele fixa o valor clínico vigente para que afrouxar o gate seja um ato
  // explícito e não efeito colateral. Se a tabela do §1.2 mudou de propósito, a
  // correção é editar a linha ABAIXO no mesmo passe — não é sinal de app
  // quebrado. Todo o resto desta suíte segue a tabela sozinho.
  assert(PAIN_GATE.limiarMinimo === 2,
    `o limiar do gate virou ${PAIN_GATE.limiarMinimo}/10. Se a mudança no §1.2 foi deliberada, `
    + 'atualize este teste no mesmo passe; se não foi, o gate acabou de afrouxar sozinho.');
  assert(PAIN_GATE.limiarMinimo < painFlagDefault.maxIntensity,
    'o limiar do gate não pode alcançar a heurística geral do app, que foi onde ele ficou escondido');
});

test('dor de peito 2/10 no log PÓS-sessão levanta a mesma bandeira', () => {
  // O §1.2 colhe em três momentos e o pós-sessão é o que tem mais chance de
  // pegar uma fisgada vinda do supino daquele dia. Ele entra no rollup por
  // `post.newPain`, um campo DIFERENTE do pré — apagar esse lado de
  // `buildGateReadings` não quebra nenhum tipo.
  const flags = gateFlags(weekWith([dor(LIMIAR)], 'post'));
  assert(flags.length === 1 && flags[0].includes('congela'),
    `o log pós-sessão não chegou ao gate: ${JSON.stringify(flags)}`);
});

test('pré e pós da MESMA sessão contam um evento só, não dois', () => {
  // Três momentos por sessão não podem virar três eventos: a tabela conta
  // eventos de SESSÃO, e o degrau de recuo exige duas sessões distintas.
  const flags = gateFlags(weekWith([dor(LIMIAR)], 'ambos'));
  assert(flags.length === 1 && flags[0].includes('1 evento ≥'),
    `pré + pós da mesma sessão deviam ser um evento só: ${JSON.stringify(flags)}`);
});

test(`${LIMIAR - 1}/10 fica em silêncio — pico isolado abaixo do limiar não é evento`, () => {
  assert(gateFlags(weekWith([dor(LIMIAR - 1, 'right_chest')])).length === 0,
    'gate disparou abaixo do limiar da tabela');
});

test(`${LIMIAR_ENCERRA}/10 encerra a sessão, não apenas congela`, () => {
  const flags = gateFlags(weekWith([dor(LIMIAR_ENCERRA)]));
  assert(flags.length === 1 && flags[0].includes('encerra a sessão'),
    `esperava o degrau de encerrar sessão: ${JSON.stringify(flags)}`);
});

test(`dois eventos de ${LIMIAR}/10 em ${JANELA} sessões recuam um degrau`, () => {
  const meio = Array.from({ length: Math.max(0, JANELA - 2) }, () => []);
  const flags = gateFlags(weekWith([dor(LIMIAR), ...meio, dor(LIMIAR)]));
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `esperava o degrau de recuo: ${JSON.stringify(flags)}`);
});

test('os dois lados somam no mesmo tecido', () => {
  const flags = gateFlags(weekWith([dor(LIMIAR), dor(LIMIAR, 'right_chest')]));
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `esquerdo + direito deviam contar dois eventos: ${JSON.stringify(flags)}`);
});

// --- 1.1 A janela de 3 SESSÕES atravessa a virada de semana -----------------
//
// O §1.2 conta a janela em SESSÕES DE SUPINO. A semana do calendário não é
// unidade nenhuma para ele. Os dois testes abaixo montam o MESMO espaçamento —
// evento, uma sessão de supino colhida, evento — e só mudam onde cai a fronteira
// da semana. Se o resultado dos dois diferir, o gate está contando semanas.

const EV = dor(LIMIAR);

test('controle: evento, 1 sessão colhida, evento — DENTRO da mesma semana recua', () => {
  const doc = weekWith([EV, [], EV], 'pre', { chest: true });
  const flags = gateFlags(doc);
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `esperava o degrau de recuo dentro da semana: ${JSON.stringify(doc.flags)}`);
});

test('o mesmo espaçamento ATRAVESSANDO a virada de semana também recua', () => {
  // S1 termina com o evento; S2 abre com uma sessão de supino colhida e o
  // segundo evento vem na sessão seguinte. São 3 sessões de supino entre o
  // primeiro e o segundo evento — dentro da janela da tabela.
  const s1 = weekWith([[], [], [], EV], 'pre', { weekIndex: 0, chest: true, firstDay: 1 });
  const s2 = weekWith([[], EV], 'pre', { weekIndex: 1, chest: true, firstDay: 8, prev: s1 });
  const flags = gateFlags(s2);
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `o segundo evento caiu na semana seguinte e o recuo sumiu: ${JSON.stringify(s2.flags)}`);
});

test('além da janela, atravessando a semana, NÃO recua — só congela', () => {
  // Mesmo par de eventos, agora com sessões de supino colhidas o bastante entre
  // eles para a janela de 3 não alcançar os dois.
  const s1 = weekWith([EV, [], [], []], 'pre', { weekIndex: 0, chest: true, firstDay: 1 });
  const s2 = weekWith([[], [], EV], 'pre', { weekIndex: 1, chest: true, firstDay: 8, prev: s1 });
  const flags = gateFlags(s2);
  assert(flags.length === 1 && flags[0].includes('congela') && !flags[0].includes('recua'),
    `esperava só o congelamento fora da janela: ${JSON.stringify(s2.flags)}`);
});

test('sessão de supino LIMPA consome a janela como qualquer outra', () => {
  // Uma sessão de supino colhida sem dor nenhuma é uma sessão de supino: ela
  // conta para a janela de 3. Sem isso, dois eventos separados por um mês de
  // treino limpo continuariam "dentro de 3 sessões".
  const entre = Array.from({ length: JANELA + 1 }, () => []);
  const doc = weekWith([EV, ...entre, EV], 'pre', { chest: true });
  const flags = gateFlags(doc);
  assert(flags.length === 1 && flags[0].includes('congela') && !flags[0].includes('recua'),
    `${entre.length} sessões de supino entre os eventos deviam sair da janela: ${JSON.stringify(doc.flags)}`);
});

test('semana sem supino NÃO consome a janela', () => {
  // Deload sem supino entre as duas semanas: as sessões existem, colhem
  // pesquisa, e não tocam no peitoral. A janela é de sessões de supino.
  const s1 = weekWith([[], [], [], EV], 'pre', { weekIndex: 0, chest: true, firstDay: 1 });
  const deload = weekWith([[], [], [], []], 'pre', { weekIndex: 1, chest: false, firstDay: 8, prev: s1 });
  const s3 = weekWith([[], EV], 'pre', { weekIndex: 2, chest: true, firstDay: 15, prev: deload });
  const flags = gateFlags(s3);
  assert(flags.length === 1 && flags[0].includes('recua um degrau'),
    `a semana sem supino consumiu a janela: ${JSON.stringify(s3.flags)}`);
});

test(`dor de joelho a ${LIMIAR}/10 não dispara o gate do peitoral`, () => {
  assert(gateFlags(weekWith([dor(LIMIAR, 'left_knee')])).length === 0,
    'gate do peitoral disparou para região fora do gate');
});

test(`a gaveta "Outro" a ${LIMIAR}/10 aponta para o §1.2 sem se passar por peitoral`, () => {
  const doc = weekWith([dor(LIMIAR, 'other')]);
  assert(gateFlags(doc).length === 0, '"Outro" não pode disparar o gate como evento confirmado');
  assert(doc.flags.some((f) => f.includes(PAIN_GATE.secao)),
    `"Outro" a 2/10 ficou mudo: ${JSON.stringify(doc.flags)}`);
});

test('sem leitura de peitoral, nenhum degrau é inventado', () => {
  assert(evaluatePainGate([]) === null, 'gate disparou sem leitura nenhuma');
});

// --- 1.2 RETORNO: a linha que era parseada e ninguém consumia ----------------

const retornoFlags = (doc) => doc.flags.filter((f) => f.startsWith('RETORNO DO GATE'));
const retornoLiberado = (doc) => retornoFlags(doc).some((f) => !f.includes('bloqueado'));

/** `n` semanas limpas encadeadas pelo `prev`, como o app encadeia. */
function semanasLimpas(n, ultima = null) {
  const teto = PAIN_GATE.retorno.picoMaximo;
  const limpa = teto > 0 ? dor(teto) : [];
  let doc = null;
  for (let i = 0; i < n; i += 1) {
    const spec = i === n - 1 && ultima ? ultima : { pain: [limpa, limpa] };
    doc = weekWith(spec.pain, 'pre', {
      weekIndex: i,
      prev: doc,
      firstDay: 1 + i * 7,
      chest: spec.chest ?? true,
      semLog: spec.semLog ?? false,
    });
  }
  return doc;
}

test('as semanas limpas que a tabela exige liberam o RETORNO', () => {
  const doc = semanasLimpas(PAIN_GATE.retorno.semanas);
  assert(retornoLiberado(doc),
    `${PAIN_GATE.retorno.semanas} semanas limpas não liberaram o retorno: ${JSON.stringify(doc.flags)}`);
});

test('uma semana limpa a menos NÃO libera o RETORNO', () => {
  if (PAIN_GATE.retorno.semanas < 2) return;
  const doc = semanasLimpas(PAIN_GATE.retorno.semanas - 1);
  assert(!retornoLiberado(doc), `retorno saiu cedo: ${JSON.stringify(doc.flags)}`);
});

test('semana com dor acima do teto do retorno zera a contagem', () => {
  const acima = dor(PAIN_GATE.retorno.picoMaximo + 1);
  const doc = semanasLimpas(PAIN_GATE.retorno.semanas, { pain: [acima, []] });
  assert(!retornoLiberado(doc), `retorno saiu com dor acima do teto: ${JSON.stringify(doc.flags)}`);
});

test('RETORNO e degrau de agravamento nunca saem na mesma semana', () => {
  // Se os dois saíssem juntos, a bandeira mandaria apertar e afrouxar ao mesmo
  // tempo. A tabela não permite: a semana que tem evento não é semana limpa.
  const doc = semanasLimpas(PAIN_GATE.retorno.semanas, { pain: [EV, []] });
  assert(gateFlags(doc).length === 1 && !retornoLiberado(doc),
    `degrau e retorno na mesma semana: ${JSON.stringify(doc.flags)}`);
});

test('sessão de supino sem log impede a semana limpa e é anunciada', () => {
  const doc = semanasLimpas(PAIN_GATE.retorno.semanas, { pain: [[], []], semLog: true });
  assert(!retornoLiberado(doc), `semana sem log foi declarada limpa: ${JSON.stringify(doc.flags)}`);
  assert(retornoFlags(doc).some((f) => f.includes('bloqueado')),
    `a omissão do log passou muda: ${JSON.stringify(doc.flags)}`);
});

// --- 1.3 Documento antigo (schemaVersion 1, sem o bloco `gate`) --------------

test('WeekDoc novo carrega o histórico do gate', () => {
  const s1 = weekWith([EV], 'pre', { weekIndex: 0, chest: true, firstDay: 1 });
  const s2 = weekWith([[]], 'pre', { weekIndex: 1, chest: true, firstDay: 8, prev: s1 });
  assert(s1.gate && s1.gate.readings.length === 1, 'a semana não gravou as próprias leituras');
  assert(s2.gate.carry.length === 1 && s2.gate.carry[0].weekNumber === s1.weekNumber,
    `a cauda da semana anterior não chegou ao documento: ${JSON.stringify(s2.gate)}`);
  assert(s2.gate.weeks.length >= Math.min(2, PAIN_GATE.retorno.semanas),
    `o histórico por semana não foi persistido: ${JSON.stringify(s2.gate.weeks)}`);
});

test('documento antigo sem o bloco `gate` degrada em vez de quebrar', () => {
  // Contrato da migração: `ROLLUP_SCHEMA_VERSION` foi de 1 para 2 e nenhum
  // documento gravado antes tem `gate`. Ler um deles como `prev` tem de produzir
  // o comportamento anterior — janela truncada na semana — e não um erro.
  const antigo = weekWith([EV], 'pre', { weekIndex: 0, chest: true, firstDay: 1 });
  delete antigo.gate;
  antigo.schemaVersion = 1;
  const s2 = weekWith([[], EV], 'pre', { weekIndex: 1, chest: true, firstDay: 8, prev: antigo });
  const flags = gateFlags(s2);
  assert(flags.length === 1 && flags[0].includes('congela'),
    `documento sem gate não degradou para o comportamento antigo: ${JSON.stringify(s2.flags)}`);
  assert(s2.gate && s2.gate.readings.length === 2,
    'o documento novo tem de voltar a gravar o bloco mesmo vindo de um antigo');
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
  test('limiar adulterado na tabela, um degrau, reprova a checagem', () => {
    const path = join(tmp, 'PROGRAMA-limiar.md');
    // Um degrau para cima quando cabe, um para baixo quando não cabe. Subir de
    // `encerra − 1` para `encerra` inverteria a ordem dos degraus e a checagem
    // reprovaria pelo PARSER, não pela comparação com o comportamento — que é o
    // que o teste seguinte exige isolar.
    const alvo = LIMIAR + 1 < DEGRAU_ENCERRA.limiar ? LIMIAR + 1 : LIMIAR - 1;
    assert(alvo > PAIN_GATE.retorno.picoMaximo && alvo >= PAIN_GATE.escala[0],
      `não há limiar vizinho coerente para adulterar a partir de ${LIMIAR}/10`);
    const mutated = trocaSinal(
      trocaSinal(original, DEGRAU_CONGELA, comLimiar(DEGRAU_CONGELA, alvo)),
      DEGRAU_RECUO, comLimiar(DEGRAU_RECUO, alvo),
    );
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

  test(`janela adulterada (${JANELA} → 1 sessão) reprova a checagem`, () => {
    const path = join(tmp, 'PROGRAMA-janela.md');
    writeFileSync(path, trocaSinal(original, DEGRAU_RECUO,
      DEGRAU_RECUO.sinal.replace(`em ${JANELA} sessões`, 'em 1 sessões')));
    const r = runChecker(path, ['--no-generated-check']);
    assert(r.status !== 0, `a checagem passou com a janela adulterada:\n${r.stdout}`);
  });

  // As duas mutações abaixo cobrem a CÉLULA DO RETORNO, que até esta revisão
  // era decorativa: o parser a lia, o gerador a emitia e nenhum código a
  // consumia, então trocar "2 semanas" por "9 semanas" passava verde e o app não
  // mudava. Ambas rodam com `--no-generated-check`: quem tem de reprovar é o
  // braço que compara a tabela contra o COMPORTAMENTO, sozinho.
  test(`RETORNO adulterado (${PAIN_GATE.retorno.semanas} → ${PAIN_GATE.retorno.semanas + 1} semanas) reprova a checagem`, () => {
    const path = join(tmp, 'PROGRAMA-retorno-semanas.md');
    const mutated = trocaRetorno(original, PAIN_GATE.retorno.semanas + 1, PAIN_GATE.retorno.picoMaximo);
    assert(mutated !== original, 'a mutação não achou a linha RETORNO');
    writeFileSync(path, mutated);
    const r = runChecker(path, ['--no-generated-check']);
    assert(r.status !== 0, `a checagem passou com o RETORNO adulterado:\n${r.stdout}`);
    assert(/produzido pelo app/.test(r.stderr),
      `a reprovação não veio da comparação com o comportamento:\n${r.stderr}`);
  });

  test(`teto do RETORNO adulterado (≤${PAIN_GATE.retorno.picoMaximo}/10 → ≤${PAIN_GATE.retorno.picoMaximo - 1}/10) reprova a checagem`, () => {
    const path = join(tmp, 'PROGRAMA-retorno-pico.md');
    assert(PAIN_GATE.retorno.picoMaximo > PAIN_GATE.escala[0],
      'o teto do RETORNO já está no piso da escala: não há mutação para baixo');
    const mutated = trocaRetorno(original, PAIN_GATE.retorno.semanas, PAIN_GATE.retorno.picoMaximo - 1);
    assert(mutated !== original, 'a mutação não achou o teto do RETORNO');
    writeFileSync(path, mutated);
    const r = runChecker(path, ['--no-generated-check']);
    assert(r.status !== 0, `a checagem passou com o teto do RETORNO adulterado:\n${r.stdout}`);
    assert(/produzido pelo app/.test(r.stderr),
      `a reprovação não veio da comparação com o comportamento:\n${r.stderr}`);
  });

  test('RETORNO sem semana nenhuma reprova o parser', () => {
    const md = trocaRetorno(original, 0, PAIN_GATE.retorno.picoMaximo);
    let erro = null;
    try { parseGateDor(md); } catch (e) { erro = e.message; }
    assert(erro && /ao menos 1 semana/.test(erro), `esperava erro de semanas, veio: ${erro}`);
  });

  test('degrau removido da tabela reprova o parser', () => {
    const path = join(tmp, 'PROGRAMA-sem-degrau.md');
    writeFileSync(path, original.split('\n')
      .filter((l) => !(l.startsWith('|') && l.includes(DEGRAU_ENCERRA.sinal))).join('\n'));
    const r = runChecker(path);
    assert(r.status !== 0, `a checagem passou sem o degrau de encerrar sessão:\n${r.stdout}`);
  });

  test('ordem invertida (encerrar mais barato que congelar) reprova o parser', () => {
    // Encerrar a sessão no MESMO limiar de congelar já é ordem invertida.
    const md = trocaSinal(original, DEGRAU_ENCERRA, comLimiar(DEGRAU_ENCERRA, DEGRAU_CONGELA.limiar));
    let erro = null;
    try { parseGateDor(md); } catch (e) { erro = e.message; }
    assert(erro && /Ordem invertida/.test(erro), `esperava erro de ordem, veio: ${erro}`);
  });

  test('escala fora do declarado reprova o parser', () => {
    const md = trocaSinal(original, DEGRAU_ENCERRA, comLimiar(DEGRAU_ENCERRA, PAIN_GATE.escala[1] + 1));
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
