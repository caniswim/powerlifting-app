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
 *   5. A janela é de SESSÕES DE SUPINO: ela atravessa a virada de semana pelo
 *      `prev` do rollup, uma sessão de supino limpa a consome, e uma semana sem
 *      supino não a consome.
 *   6. A linha `RETORNO` governa comportamento: o número de semanas e o teto de
 *      pico da tabela decidem se a bandeira de retorno sai.
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
const {
  painGateChestRegions, painGateAmbiguousRegions, gateWindowSessions, gateLookbackWeeks,
  evaluatePainGate, describePainGate,
} = await import(join(ROOT, 'src/domain/painGate.ts'));
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

// --- 1.1 As constantes de ALCANCE também saem da tabela ----------------------
//
// `gateWindowSessions` e `gateLookbackWeeks` decidem quanto passado o gate
// enxerga: a primeira é o tamanho da janela deslizante e o teto da cauda
// gravada no `WeekDoc`; a segunda é quantas semanas `buildWeekPayload`
// reconstrói antes da corrente. As duas são DERIVADAS da tabela em
// `painGate.ts`, e nenhum cenário de comportamento as alcança — a checagem
// monta o `prev` à mão, então ela continua verde com as duas fixadas em
// qualquer número.
//
// Isto foi medido, não suposto: com `gateLookbackWeeks` fixado em 1 — que é o
// defeito original de volta, o `prev` chegando sem cauda — os 52 cenários e o
// `npm run build` inteiro passavam. A trava de acoplamento do §6 não pega
// porque ela olha a EXPRESSÃO em `documentBuilders.ts`, e a expressão continua
// lá; quem muda é o valor que ela lê.
//
// A comparação é contra a TABELA lida agora, nunca contra a própria constante:
// medir a constante contra ela mesma é a tautologia que deixou o teto da cauda
// passar com a janela inflada de 3 para 9.

const janelaDaTabela = Math.max(1, ...table.degraus.map((d) => d.janelaSessoes ?? 1));

checked.push('gateWindowSessions é a maior janela declarada na tabela');
if (gateWindowSessions !== janelaDaTabela) {
  errors.push(
    `gateWindowSessions vale ${gateWindowSessions}, e a maior janela da tabela é ${janelaDaTabela}. `
      + 'Menor trunca a janela deslizante e a cauda gravada; maior infla o documento toda semana.',
  );
}

const alcanceDaTabela = Math.max(janelaDaTabela, table.retorno.semanas);
checked.push('gateLookbackWeeks alcança a janela de sessões e as semanas do RETORNO');
if (gateLookbackWeeks !== alcanceDaTabela) {
  errors.push(
    `gateLookbackWeeks vale ${gateLookbackWeeks}; a tabela exige ${alcanceDaTabela} `
      + `(janela de ${janelaDaTabela} sessões, RETORNO de ${table.retorno.semanas} semanas). `
      + 'Abaixo disso o `prev` chega sem cauda e a janela volta a truncar na virada de semana.',
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

/** Dia `n` (1-based) da série sintética de datas, em ISO. */
function isoDay(n) {
  const d = new Date(Date.UTC(2026, 2, 1));
  d.setUTCDate(d.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}

/**
 * `chest` liga o volume de peitoral da sessão — é o que faz dela uma "sessão de
 * supino" para a janela do §1.2. `semLog` monta a sessão sem pesquisa nenhuma:
 * treinou peitoral e não colheu o log, que é o caso que o §1.2 proíbe e o app
 * não conseguia distinguir.
 */
function session(date, painEntries, phase = 'pre', weekNumber = 1, opts = {}) {
  const { chest = false, semLog = false } = opts;
  return {
    schemaVersion: 2,
    updatedAt: `${date}T12:00:00.000Z`,
    id: `s-${date}`,
    date: `${date}T12:00:00.000Z`,
    programId: 'vena-block1',
    weekId: `vena-block1-w${weekNumber}`,
    weekNumber,
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
      pain: phase === 'pre' ? painEntries : [],
      supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: !semLog && phase === 'post'
      ? {
        sessionQuality: 7, sessionRPE: 8,
        strengthPerception: 'normal', planAdherence: 'full',
        newPain: painEntries,
      }
      : null,
  };
}

/**
 * Uma sessão da cena, normalizada.
 *
 * Aceita a forma curta (só a lista de dores, herdando `chest`/`semLog` da
 * semana) e a forma longa (`{ pain, chest, semLog }`), que é o que permite
 * montar uma semana MISTA — uma sessão de supino colhida e outra de supino sem
 * log, por exemplo. Sem controle por sessão, as duas primeiras condições de
 * "semana limpa" não têm como ser isoladas: toda cena que as violava também
 * ficava sem leitura nenhuma, e quem reprovava era a terceira condição.
 */
function normalizeSession(item, defaults) {
  const base = Array.isArray(item) ? { pain: item } : item;
  return {
    pain: base.pain ?? [],
    chest: base.chest ?? defaults.chest,
    semLog: base.semLog ?? defaults.semLog,
  };
}

/** Documento de uma semana, montado pelo `buildWeekDoc` de produção. */
function weekDocFor(sessionsPain, phase = 'pre', opts = {}) {
  const { weekNumber = 1, prev = null, firstDay = 1, chest = false, semLog = false } = opts;
  const sessions = sessionsPain.map((item, i) => {
    const spec = normalizeSession(item, { chest, semLog });
    return session(isoDay(firstDay + i), spec.pain, phase, weekNumber, {
      chest: spec.chest,
      semLog: spec.semLog,
    });
  });
  return buildWeekDoc({
    programId: 'vena-block1',
    programName: 'Vena Bloco 1',
    // A semana prescrita só empresta a forma; o NÚMERO dela é o que o gate usa
    // para encadear, e ele precisa passar de 18 quando a tabela adulterada
    // exigir mais semanas de retorno do que o bloco tem.
    week: { ...WEEK, weekNumber },
    sessions,
    workouts: [],
    bodyweight: [],
  }, prev);
}

/** Bandeiras de uma semana montada com as leituras de dor dadas. */
function flagsFor(sessionsPain, phase = 'pre', opts = {}) {
  return weekDocFor(sessionsPain, phase, opts).flags;
}

/**
 * Encadeia semanas pelo `prev`, exatamente como `buildWeekPayload` faz, e
 * devolve o documento da ÚLTIMA. É o único jeito de exercitar a memória do gate
 * pelo caminho de produção em vez de fabricar o histórico à mão.
 */
function chainWeeks(specs) {
  let prev = null;
  let day = 1;
  for (const [i, spec] of specs.entries()) {
    prev = weekDocFor(spec.pain, spec.phase ?? 'pre', {
      weekNumber: i + 1,
      prev,
      firstDay: day,
      chest: spec.chest ?? true,
      semLog: spec.semLog ?? false,
    });
    day += Math.max(7, spec.pain.length + 1);
  }
  return prev;
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

// --- 3.1 A janela é de SESSÕES DE SUPINO, e atravessa a virada de semana ------
//
// A semana do calendário não é unidade nenhuma para o §1.2. Estes cenários
// montam o MESMO espaçamento de sempre e só mudam onde cai a fronteira: se o
// resultado mudar, o gate está contando semanas. A memória entre semanas passa
// pelo `prev` do `buildWeekDoc`, que é o caminho de produção.

const EVENTO = (i) => [{ region, intensity: i }];
const LIMPA = [];

for (const degrau of table.degraus.filter((d) => d.eventos > 1 && d.janelaSessoes)) {
  const { eventos, limiar, janelaSessoes, id } = degrau;
  const enchimento = Math.max(0, janelaSessoes - eventos);
  const rep = (n, v) => Array.from({ length: n }, () => v);

  // A janela cheia: primeiro evento, as sessões limpas que cabem, e os eventos
  // restantes. Cortada logo depois do primeiro evento — ele fica na semana
  // anterior, o resto na semana corrente.
  const janela = [EVENTO(limiar), ...rep(enchimento, LIMPA), ...rep(eventos - 1, EVENTO(limiar))];

  expect(
    `${eventos} eventos de ${limiar}/10 dentro de ${janelaSessoes} sessões, ATRAVESSANDO a virada de semana`,
    firedStep(chainWeeks([{ pain: [janela[0]] }, { pain: janela.slice(1) }]).flags),
    id,
  );

  // Os mesmos eventos, agora com sessões de supino colhidas o bastante entre
  // eles para a janela não alcançar os dois. Atravessar a semana não pode
  // inventar o degrau que a tabela não manda.
  const fora = [EVENTO(limiar), ...rep(janelaSessoes, LIMPA), ...rep(eventos - 1, EVENTO(limiar))];
  expect(
    `${eventos} eventos de ${limiar}/10 além de ${janelaSessoes} sessões, atravessando a virada de semana`,
    firedStep(chainWeeks([{ pain: [fora[0]] }, { pain: fora.slice(1) }]).flags),
    expectedForSingle(limiar),
  );

  // Sessão de supino LIMPA consome a janela como qualquer outra — é o que
  // impede que dois eventos separados por um mês de treino limpo contem como
  // "N eventos em M sessões".
  expect(
    `${janelaSessoes} sessões de supino limpas entre os eventos saem da janela`,
    firedStep(flagsFor(fora, 'pre', { chest: true })),
    expectedForSingle(limiar),
  );

  // Semana sem supino no meio: as sessões existem e colhem pesquisa, mas não
  // tocam o peitoral. Elas não são sessões de supino e não podem consumir a
  // janela.
  expect(
    `semana sem supino entre os eventos não consome a janela de ${janelaSessoes} sessões`,
    firedStep(chainWeeks([
      { pain: [janela[0]] },
      { pain: [LIMPA, LIMPA], chest: false },
      { pain: janela.slice(1) },
    ]).flags),
    id,
  );

  // O degrau já disparou na semana passada e esta semana não trouxe evento
  // nenhum: a cauda ainda alcança o par, mas reanunciá-lo faria a mesma dor
  // ressurgir como bandeira nova toda semana enquanto a janela a alcançasse.
  // Um degrau com janela só sai se ao menos um dos eventos for DESTA semana.
  //
  // Os eventos ficam no FIM da semana anterior de propósito: a cauda guarda as
  // últimas `janelaSessoes - 1` leituras, e só assim ela carrega os eventos
  // TODOS. Com eles no começo da semana a cauda levaria só um, o degrau não
  // dispararia de qualquer jeito, e o cenário passaria sem testar nada.
  const noFim = [...rep(enchimento, LIMPA), ...rep(eventos, EVENTO(limiar))];
  expect(
    `${id} não é reanunciado na semana seguinte, sem evento novo`,
    firedStep(chainWeeks([{ pain: noFim }, { pain: [LIMPA] }]).flags),
    null,
  );

  // A bandeira TEM de distinguir a janela que atravessou a fronteira daquela
  // que coube na semana: quem lê a bandeira na conversa semanal precisa saber
  // que um dos eventos é de antes de segunda-feira. O veredito é lido do
  // `evaluatePainGate` de produção sobre o bloco `gate` que o documento gravou,
  // e a comparação de texto é entre as DUAS descrições que a produção gera —
  // nenhum pedaço do texto da bandeira é copiado para cá.
  const dentroDaSemana = weekDocFor(janela, 'pre', { chest: true });
  const atravessando = chainWeeks([{ pain: [janela[0]] }, { pain: janela.slice(1) }]);

  for (const [rotulo, doc, esperado] of [
    [`${id} dentro da semana não se anuncia como travessia`, dentroDaSemana, false],
    [`${id} atravessando a virada de semana se anuncia como travessia`, atravessando, true],
  ]) {
    const v = evaluatePainGate(doc.gate?.readings ?? [], doc.gate?.carry ?? []);
    checked.push(rotulo);
    if (!v) {
      errors.push(`${rotulo}: nenhum degrau saiu do bloco \`gate\` gravado no documento.`);
    } else if (v.atravessaSemana !== esperado) {
      errors.push(`${rotulo}: atravessaSemana=${v.atravessaSemana}, esperado ${esperado}.`);
    } else if (describePainGate({ ...v, atravessaSemana: true })
      === describePainGate({ ...v, atravessaSemana: false })) {
      errors.push(
        `${rotulo}: a bandeira sai IGUAL nos dois casos. Quem lê não tem como saber que a `
          + 'janela alcançou uma semana anterior.',
      );
    }
  }
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

// --- 5. RETORNO: a linha que era lida e não era consumida ---------------------
//
// Até esta revisão o `RETORNO` era parseado, emitido na constante gerada e
// nenhum código o consumia — trocar "2 semanas" por "9 semanas" no §1.2 passava
// verde e o app não mudava. Os cenários abaixo são derivados da própria linha
// (número de semanas e teto de pico), e cada um deles muda de resposta quando a
// célula muda.

const { semanas: retSemanas, picoMaximo: retPico } = table.retorno;

/** Uma sessão de supino colhida no teto do retorno: limpa, no limite. */
const NO_TETO = retPico > 0 ? [{ region, intensity: retPico }] : [];
/** Uma sessão logo acima do teto: a semana deixa de ser limpa. */
const ACIMA_DO_TETO = [{ region, intensity: retPico + 1 }];

const rotuloRetorno = (b) => (b ? 'bandeira de RETORNO' : 'nenhuma bandeira de RETORNO');
const retornoSaiu = (flags) =>
  flags.some((f) => f.startsWith('RETORNO DO GATE') && !f.includes('bloqueado'));

/** `n` semanas limpas encadeadas; a última pode ser sobrescrita. */
function semanasLimpas(n, ultima = null) {
  const specs = Array.from({ length: n }, () => ({ pain: [NO_TETO, NO_TETO] }));
  if (ultima && specs.length > 0) specs[specs.length - 1] = ultima;
  return chainWeeks(specs);
}

expect(
  `${retSemanas} semanas consecutivas com pico ≤${retPico}/10 liberam o RETORNO`,
  rotuloRetorno(retornoSaiu(semanasLimpas(retSemanas).flags)),
  rotuloRetorno(true),
);

if (retSemanas > 1) {
  expect(
    `${retSemanas - 1} semanas limpas ainda NÃO liberam o RETORNO`,
    rotuloRetorno(retornoSaiu(semanasLimpas(retSemanas - 1).flags)),
    rotuloRetorno(false),
  );
}

expect(
  `pico de ${retPico + 1}/10 na última semana derruba o RETORNO`,
  rotuloRetorno(retornoSaiu(semanasLimpas(retSemanas, { pain: [NO_TETO, ACIMA_DO_TETO] }).flags)),
  rotuloRetorno(false),
);

expect(
  'semana sem supino nenhum não conta como semana limpa',
  rotuloRetorno(retornoSaiu(semanasLimpas(retSemanas, { pain: [[], []], chest: false }).flags)),
  rotuloRetorno(false),
);

// As duas cenas acima reprovam por FALTA DE LEITURA, não pela condição que
// nomeiam: sem supino e sem dor, a semana também não tem pico, e quem barra é
// "pico é nulo". As duas abaixo isolam cada condição — elas têm leitura, têm
// pico DENTRO do teto, e a única coisa que pode reprová-las é a condição sob
// teste. Sem elas, apagar `benchSessions > 0` ou `loggedSessions >=
// benchSessions` de `semanaLimpa` mantinha a suíte inteira verde, e o RETORNO é
// a ÚNICA linha do §1.2 que aumenta carga sobre o tecido lesionado.
if (retPico > 0) {
  expect(
    'semana com dor de peitoral mas NENHUMA sessão de supino não é semana limpa',
    rotuloRetorno(retornoSaiu(
      semanasLimpas(retSemanas, { pain: [NO_TETO], chest: false }).flags,
    )),
    rotuloRetorno(false),
  );
}

// Sessão de supino que não colheu o log não pode ser declarada limpa: o §1.2
// manda colher em toda sessão com supino ou peitoral, e o que não foi medido
// não vira evidência de tolerância.
const semLog = semanasLimpas(retSemanas, { pain: [NO_TETO, NO_TETO], semLog: true });
expect(
  'semana com sessão de supino sem log não conta como semana limpa',
  rotuloRetorno(retornoSaiu(semLog.flags)),
  rotuloRetorno(false),
);

// Semana MISTA: uma sessão de supino colhida e limpa, outra de supino sem log
// nenhum. A semana tem pico dentro do teto e mesmo assim não é limpa — uma
// sessão medida não cobre a que não foi.
const semLogMisto = semanasLimpas(retSemanas, {
  pain: [NO_TETO, { pain: [], semLog: true }],
});
expect(
  'semana com UMA sessão de supino sem log, entre sessões colhidas, não é limpa',
  rotuloRetorno(retornoSaiu(semLogMisto.flags)),
  rotuloRetorno(false),
);
checked.push('a sessão sem log da semana mista é anunciada');
if (!semLogMisto.flags.some((f) => f.startsWith('RETORNO DO GATE') && f.includes('bloqueado'))) {
  errors.push(
    'Semana com uma sessão de supino sem log entre sessões colhidas não produziu bandeira: '
      + 'a omissão do log some quando as outras sessões da semana foram colhidas.',
  );
}
checked.push('sessão de supino sem log é anunciada em vez de ficar muda');
if (!semLog.flags.some((f) => f.startsWith('RETORNO DO GATE') && f.includes('bloqueado'))) {
  errors.push(
    'Semana com sessão de supino sem log de dor não produziu nenhuma bandeira: '
      + 'a omissão do log passou em silêncio.',
  );
}

// O histórico do gate tem de estar NO DOCUMENTO — é ele que atravessa a virada
// de semana quando o app recarrega do Firestore em vez de recalcular.
checked.push('WeekDoc carrega o bloco `gate` com leituras, cauda e semanas');
const comHistorico = chainWeeks([{ pain: [EVENTO(table.limiarMinimo)] }, { pain: [LIMPA] }]);
if (!comHistorico.gate || comHistorico.gate.carry.length === 0) {
  errors.push(
    'O `WeekDoc` da segunda semana não carrega leitura nenhuma da primeira em `gate.carry`: '
      + 'a janela de sessões volta a truncar na virada de semana assim que o rollup for relido.',
  );
}
if (comHistorico.gate && comHistorico.gate.weeks.length < Math.min(2, retSemanas)) {
  errors.push('O `WeekDoc` não carrega o histórico por semana que a linha RETORNO exige.');
}

// O bloco `gate` é escrito em TODO rollup semanal e vai para o Firestore. Ele
// carrega histórico, então é a única parte do `WeekDoc` que poderia crescer sem
// teto — e um documento que cresce toda semana é uma conta que cresce toda
// semana. Os dois tetos saem da TABELA, e é isso que se verifica aqui: uma
// cadeia longa, com muito mais sessões e semanas do que a tabela alcança, não
// pode produzir listas maiores do que ela manda guardar.
const cadeiaLonga = chainWeeks(
  Array.from({ length: retSemanas + gateLookbackWeeks + 2 }, () => ({
    pain: Array.from({ length: gateWindowSessions + 2 }, () => LIMPA),
  })),
);
// O teto sai da TABELA (`janelaDaTabela`), não de `gateWindowSessions`: medir a
// constante contra ela mesma é tautologia, e era. Com `gateWindowSessions`
// fixado em 9 o documento passava a guardar 8 leituras por semana e esta
// verificação continuava verde, porque os dois lados da comparação inflavam
// juntos.
const cauda = Math.max(0, janelaDaTabela - 1);
checked.push(`cauda do gate limitada às ${cauda} leituras que a janela da tabela alcança`);
if (cadeiaLonga.gate.carry.length > cauda) {
  errors.push(
    `\`gate.carry\` tem ${cadeiaLonga.gate.carry.length} leituras, acima das ${cauda} que a `
      + 'maior janela da tabela pode precisar: o documento cresce sem teto a cada semana.',
  );
}
checked.push(`histórico por semana limitado às ${retSemanas} semanas que o RETORNO exige`);
if (cadeiaLonga.gate.weeks.length > retSemanas) {
  errors.push(
    `\`gate.weeks\` tem ${cadeiaLonga.gate.weeks.length} semanas, acima das ${retSemanas} que a `
      + 'linha RETORNO exige: o documento cresce sem teto a cada semana.',
  );
}

// Sessão de supino colhida e SEM dor nenhuma grava `peak: 0`, não "sem leitura"
// e não um valor qualquer. É contra esse número que o teto do RETORNO é
// comparado — se a leitura limpa nascesse com 1, uma tabela que baixasse o teto
// para ≤0/10 deixaria de reconhecer semana limpa nenhuma, em silêncio.
const semanaLimpaDoc = weekDocFor([LIMPA, LIMPA], 'pre', { chest: true });
checked.push('leitura de sessão de supino sem dor nasce com pico 0');
if (semanaLimpaDoc.gate.readings.length !== 2
  || !semanaLimpaDoc.gate.readings.every((r) => r.peak === 0)) {
  errors.push(
    'Sessão de supino colhida e sem dor não gravou `peak: 0`: '
      + `${JSON.stringify(semanaLimpaDoc.gate.readings)}`,
  );
}

// Reconstruir a MESMA semana não pode empilhar as leituras dela mesma na cauda.
// O rollup é reconstruído do zero a cada sincronização e no "Reenviar tudo": se
// o documento já gravado entrasse como `prev` de si mesmo, a janela passaria a
// contar cada sessão duas vezes e o degrau de recuo sairia sozinho.
const umaSemana = chainWeeks([{ pain: [EVENTO(table.limiarMinimo), LIMPA] }]);
const refeita = weekDocFor([EVENTO(table.limiarMinimo), LIMPA], 'pre', {
  weekNumber: umaSemana.weekNumber, prev: umaSemana, chest: true,
});
checked.push('reconstruir a mesma semana é idempotente para a cauda do gate');
if (refeita.gate.carry.some((r) => r.weekNumber >= refeita.weekNumber)) {
  errors.push(
    'Reconstruir a semana com o documento dela mesma como `prev` levou as próprias leituras '
      + `para \`gate.carry\`: ${JSON.stringify(refeita.gate.carry)}`,
  );
}
if (firedStep(refeita.flags) !== firedStep(umaSemana.flags)) {
  errors.push(
    'Reconstruir a mesma semana mudou o degrau: '
      + `${firedStep(umaSemana.flags)} → ${firedStep(refeita.flags)}.`,
  );
}

// "Consecutivas" é exigido nos DOIS sentidos: as semanas têm de ser limpas e ter
// números seguidos. Um buraco no histórico — semana fora do programa, cadeia
// interrompida — não pode ser costurado em silêncio, e o RETORNO é a única
// linha do §1.2 que aumenta carga sobre o tecido lesionado.
const limpasSeguidas = semanasLimpas(retSemanas);
const depoisDoBuraco = weekDocFor([NO_TETO, NO_TETO], 'pre', {
  weekNumber: limpasSeguidas.weekNumber + retSemanas + 1,
  prev: limpasSeguidas,
  firstDay: 200,
  chest: true,
});
expect(
  'semanas limpas com buraco de numeração no meio não liberam o RETORNO',
  rotuloRetorno(retornoSaiu(depoisDoBuraco.flags)),
  rotuloRetorno(false),
);

// Documento antigo (schemaVersion 1, sem o bloco `gate`) tem de degradar, não
// quebrar: é o contrato da migração declarada em rollupTypes.ts.
checked.push('WeekDoc sem o bloco `gate` (schemaVersion 1) continua carregando');
const antigo = { ...comHistorico, schemaVersion: 1 };
delete antigo.gate;
const depoisDoAntigo = weekDocFor([EVENTO(table.limiarMinimo)], 'pre', { weekNumber: 9, prev: antigo });
if (firedStep(depoisDoAntigo.flags) !== expectedForSingle(table.limiarMinimo)) {
  errors.push('Documento sem o bloco `gate` mudou o veredito da semana seguinte em vez de degradar.');
}

// --- 6. O caminho de produção reconstrói fundo o bastante ---------------------
//
// Tudo acima exercita `buildWeekDoc`, que recebe o `prev` pronto. Quem MONTA o
// `prev` é `buildWeekPayload`, e ele lê do localStorage — fora do alcance deste
// script. Se ele voltar a encadear uma única semana, todos os cenários acima
// continuam verdes e o gate volta a truncar assim que o app recalcular: foi
// exatamente assim que o defeito original sobreviveu.
//
// Esta é uma trava de ACOPLAMENTO, não de comportamento, e vale declarar o que
// ela não faz: ela não prova que a cadeia funciona, só que a profundidade
// continua saindo da tabela em vez de um número digitado. Cobrir o resto exige
// stub da camada de armazenamento, e está declarado como aberto em GATE-DOR.md.
//
// O texto é lido SEM comentários de propósito: um `// era weekNumber -
// gateLookbackWeeks` acima de um `weekNumber - 1` satisfazia a expressão
// regular e a trava passava verde. Trava que casa com prosa não é trava.
checked.push('buildWeekPayload deriva a profundidade da cadeia de `gateLookbackWeeks`');
const builders = readFileSync(join(ROOT, 'src/services/sync/documentBuilders.ts'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
if (!/weekNumber\s*-\s*gateLookbackWeeks/.test(builders)) {
  errors.push(
    'buildWeekPayload não encadeia `gateLookbackWeeks` semanas: o `prev` chega sem cauda e a '
      + `janela de ${gateWindowSessions} sessões volta a truncar na virada de semana.`,
  );
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
