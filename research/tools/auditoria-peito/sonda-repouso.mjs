#!/usr/bin/env node
/**
 * SONDA — o que o gate de dor NAO enxerga.
 *
 * O atleta relata dor leve NO PEITORAL, EM REPOUSO, FORA DE SESSAO, e nao
 * treinou esta semana. Esta sonda percorre o caminho do dado com o codigo de
 * PRODUCAO na mao (`buildWeekDoc`, `evaluatePainGate`, `evaluateGateReturn`) e
 * responde quatro perguntas que a prosa nao resolve:
 *
 *   1. Existe onde registrar dor fora de sessao?
 *   2. `estiramento agudo` ainda e celula sem comportamento?
 *   3. A janela de 3 sessoes e o RETORNO sobrevivem a um hiato sem supino? O
 *      RETORNO e satisfeito VACUAMENTE por ausencia de dado?
 *   4. O que a conversa semanal recebe?
 *
 * Nada aqui e reimplementacao da regra: as cenas sao montadas e entregues ao
 * mesmo `buildWeekDoc` que o app grava no Firestore. Os numeros do §1.2 vem da
 * tabela, nunca digitados.
 *
 * Uso: node research/tools/auditoria-peito/sonda-repouso.mjs
 */
import '../../../scripts/ts-resolve.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const SRC = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');

const { parseGateDor } = await import(join(ROOT, 'scripts/gate-dor.mjs'));
const { buildWeekDoc } = await import(join(ROOT, 'src/services/sync/weeklyRollup.ts'));
const { venaBlock1Weeks } = await import(join(ROOT, 'src/data/program/vena-block1/generated.ts'));
const { painGateChestRegions, gateWindowSessions, gateLookbackWeeks } = await import(
  join(ROOT, 'src/domain/painGate.ts')
);

const tabela = parseGateDor(readFileSync(SRC, 'utf8'));
const WEEK = venaBlock1Weeks[3];
const REGIAO = painGateChestRegions[0];
const LIMIAR = tabela.limiarMinimo;
const RET = tabela.retorno;

// --- montagem de cena (mesma forma que `check-pain-gate.mjs` usa) -----------

function isoDay(n) {
  const d = new Date(Date.UTC(2026, 2, 1));
  d.setUTCDate(d.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}

function session(date, pain, weekNumber, { chest = true, semLog = false, momentos = 'pre' } = {}) {
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
    // `momentos` diz QUAIS dos momentos do §1.2 a sessao colheu: so o pre, so o
    // pos, ou os dois. O terceiro momento que o §1.2 pede — a 1a pausada com
    // carga de trabalho — nao tem campo no app e por isso nao tem valor aqui.
    pre: semLog || momentos === 'post' ? null : {
      sleepQuality: 7, sleepHours: 8, energyLevel: 7, stressLevel: 3, motivation: 7,
      pain, supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: semLog || momentos === 'pre' ? null : {
      sessionQuality: 7, sessionRPE: 8,
      strengthPerception: 'normal', planAdherence: 'full',
      newPain: pain,
    },
  };
}

/** Encadeia semanas pelo `prev`, como `buildWeekPayload` faz. Devolve todas. */
function cadeia(specs) {
  const docs = [];
  let prev = null;
  let dia = 1;
  for (const [i, spec] of specs.entries()) {
    const sessoes = (spec.sessoes ?? []).map((s, j) =>
      session(isoDay(dia + j), s.pain ?? [], i + 1, {
        chest: s.chest ?? true,
        semLog: s.semLog ?? false,
        momentos: s.momentos ?? 'ambos',
      }));
    prev = buildWeekDoc({
      programId: 'vena-block1',
      programName: 'Vena Bloco 1',
      week: { ...WEEK, weekNumber: i + 1 },
      sessions: sessoes,
      workouts: [],
      bodyweight: [],
    }, prev);
    docs.push(prev);
    dia += 7;
  }
  return docs;
}

const LIMPA = { pain: [] };
const NO_TETO = { pain: RET.picoMaximo > 0 ? [{ region: REGIAO, intensity: RET.picoMaximo }] : [] };
const EVENTO = { pain: [{ region: REGIAO, intensity: LIMIAR }] };
const VAZIA = { sessoes: [] };

const retornoSaiu = (f) => f.some((x) => x.startsWith('RETORNO DO GATE') && !x.includes('bloqueado'));
const gateSaiu = (f) => f.find((x) => x.startsWith('GATE DE PEITORAL')) ?? null;

const out = [];
const linha = (s = '') => out.push(s);
const R = (rotulo, veredito, detalhe = '') =>
  linha(`  ${veredito ? 'SIM ' : 'NAO '} ${rotulo}${detalhe ? `  ${detalhe}` : ''}`);

linha(`Tabela §1.2 lida agora: limiar minimo ${LIMIAR}/10 · janela ${gateWindowSessions} sessoes `
  + `· RETORNO ${RET.semanas} semanas com pico <=${RET.picoMaximo}/10 · lookback ${gateLookbackWeeks} semanas`);
linha();

// --- 1. Dor em repouso ------------------------------------------------------

linha('1. DOR EM REPOUSO, FORA DE SESSAO');
const tipos = readFileSync(join(ROOT, 'src/types/index.ts'), 'utf8');
const preTemWorkoutId = /interface PreWorkoutSurvey \{[^}]*workoutId: string/s.test(tipos);
const postTemWorkoutId = /interface PostWorkoutSurvey \{[^}]*workoutId: string/s.test(tipos);
R('PreWorkoutSurvey e chaveada por workoutId (exige sessao)', preTemWorkoutId);
R('PostWorkoutSurvey e chaveada por workoutId (exige sessao)', postTemWorkoutId);

// Toda escrita de PainEntry no app: quem chama o seletor de dor.
const { execSync } = await import('node:child_process');
const consumidores = execSync(
  `grep -rl "PainSelector" ${JSON.stringify(join(ROOT, 'src'))} --include=*.tsx | grep -v PainSelector.tsx || true`,
).toString().trim().split('\n').filter(Boolean).map((p) => p.replace(`${ROOT}/`, ''));
linha(`  Telas que escrevem PainEntry: ${consumidores.length}`);
for (const c of consumidores) linha(`    - ${c}`);
R('existe alguma tela de dor fora do fluxo de treino', consumidores.some((c) => !/Survey(Sheet)?\.tsx$/.test(c)));

// A dor so entra no rollup pelos dois campos de sessao.
const rollup = readFileSync(join(ROOT, 'src/services/sync/weeklyRollup.ts'), 'utf8');
const fontesDeDor = [...rollup.matchAll(/sess\.(pre\?\.pain|post\?\.newPain)/g)].map((m) => m[1]);
linha(`  Fontes de dor no rollup: ${[...new Set(fontesDeDor)].join(', ')}`);

// O unico contorno possivel hoje: abrir um treino so para preencher o pre e
// registrar a dor. O que isso custa, medido em vez de suposto.
const contorno = cadeia([{ sessoes: [{ pain: [{ region: REGIAO, intensity: LIMIAR }], chest: false, momentos: 'pre' }] }]).at(-1);
R('dor registrada num "treino" sem volume de peitoral chega ao gate',
  Boolean(gateSaiu(contorno.flags)),
  `\n       -> ${gateSaiu(contorno.flags) ?? ''}`);
linha(`  Custo do contorno — leitura criada na janela: ${JSON.stringify(contorno.gate.readings)}`);
linha(`  Custo do contorno — outras bandeiras: ${JSON.stringify(
  contorno.flags.filter((f) => !f.startsWith('GATE DE PEITORAL')))}`);
linha();

// --- 2. estiramento agudo ---------------------------------------------------

linha('2. ESTIRAMENTO AGUDO');
const degrauEstira = tabela.degraus.find((d) => d.estiramentoAgudo);
linha(`  Celula na tabela: "${degrauEstira?.sinal}" -> "${degrauEstira?.acao}"`);
const lidoNaProducao = execSync(
  `grep -rn "estiramentoAgudo" ${JSON.stringify(join(ROOT, 'src'))} --include=*.ts --include=*.tsx || true`,
).toString().trim().split('\n').filter(Boolean).map((l) => l.replace(`${ROOT}/`, ''));
const soNoGerado = lidoNaProducao.every((l) => l.includes('generated.ts'));
for (const l of lidoNaProducao) linha(`    ${l}`);
R('a celula tem campo na pesquisa', /estiramento|strain|ruptur/i.test(tipos));
R('algum codigo de producao LE o flag (fora do generated)', !soNoGerado);
linha();

// --- 3. Hiato sem supino: janela e RETORNO ----------------------------------

linha('3. HIATO SEM SUPINO — JANELA E RETORNO');

// 3a. As `RET.semanas` semanas limpas exigidas liberam o RETORNO (controle).
const controle = cadeia(Array.from({ length: RET.semanas }, () => ({ sessoes: [NO_TETO, NO_TETO] })));
R(`${RET.semanas} semanas com supino limpo liberam o RETORNO (controle)`,
  retornoSaiu(controle.at(-1).flags));

// 3b. Semanas SEM NENHUMA SESSAO no lugar das semanas limpas: vacuidade?
const vacuo = cadeia([
  { sessoes: [EVENTO, LIMPA] },
  ...Array.from({ length: RET.semanas }, () => VAZIA),
]);
R(`${RET.semanas} semanas SEM NENHUMA SESSAO satisfazem o RETORNO vacuamente`,
  retornoSaiu(vacuo.at(-1).flags),
  `(semanas limpas contadas: ${JSON.stringify(vacuo.at(-1).gate.weeks.map((w) => [w.weekNumber, w.benchSessions, w.peak]))})`);

// 3c. Semanas COM treino mas SEM peitoral (deload / so agacho e terra).
const semPeito = cadeia([
  { sessoes: [EVENTO, LIMPA] },
  ...Array.from({ length: RET.semanas }, () => ({ sessoes: [{ pain: [], chest: false }, { pain: [], chest: false }] })),
]);
R(`${RET.semanas} semanas treinadas SEM peitoral satisfazem o RETORNO`,
  retornoSaiu(semPeito.at(-1).flags));

// 3d. Volta ao supino depois do hiato: 1 sessao limpa ja basta?
const volta = cadeia([
  { sessoes: [EVENTO, LIMPA] },
  VAZIA,
  VAZIA,
  { sessoes: [NO_TETO] },
]);
R('1 sessao limpa depois de 2 semanas paradas ja libera o RETORNO',
  retornoSaiu(volta.at(-1).flags),
  `(semanas no doc: ${JSON.stringify(volta.at(-1).gate.weeks.map((w) => [w.weekNumber, w.benchSessions]))})`);

// 3e. A janela de sessoes sobrevive ao hiato? A cauda envelhece?
const cauda = cadeia([
  { sessoes: [EVENTO] },
  VAZIA,
  VAZIA,
  { sessoes: [EVENTO] },
]);
const degrauAposHiato = gateSaiu(cauda.at(-1).flags);
R('a cauda atravessa 2 semanas paradas e o par de eventos ainda dispara o recuo',
  degrauAposHiato !== null && /recua/i.test(degrauAposHiato ?? ''),
  degrauAposHiato ? `\n       -> ${degrauAposHiato}` : '');
linha(`  cauda gravada apos o hiato: ${JSON.stringify(cauda.at(1).gate.carry)}`);

// 3f. Ha alguma nocao de TEMPO na janela ou no RETORNO?
// Comentario nao e comportamento: tira comentario antes de procurar.
const semComentario = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const painGateSrc = semComentario(readFileSync(join(ROOT, 'src/domain/painGate.ts'), 'utf8'));
// Sem flag `i`: `a.date.localeCompare` casaria com /Date\./i e a sonda mentiria.
R('a janela/RETORNO faz alguma aritmetica de tempo decorrido',
  /new Date|Date\.now|getTime|\bdiasDecorridos\b/.test(painGateSrc));

// 3g/3h. O §1.2 manda colher TRES momentos. O app tem dois campos, e o rollup
// aceita QUALQUER UM deles como "sessao colhida" (`sess.pre != null || sess.post
// != null`). Semana inteira medida por metade do instrumento vira semana limpa?
for (const [rotulo, momentos] of [['so o PRE', 'pre'], ['so o POS', 'post']]) {
  const meio = cadeia(Array.from({ length: RET.semanas }, () => ({
    sessoes: [{ ...NO_TETO, momentos }, { ...NO_TETO, momentos }],
  })));
  R(`semana em que toda sessao de supino colheu ${rotulo} conta como LIMPA e libera o RETORNO`,
    retornoSaiu(meio.at(-1).flags));
}
R('existe campo para a 1a serie pausada com carga de trabalho (2o dos tres momentos)',
  /pausada|midSession|intraSession/i.test(tipos));
linha();

// --- 4. O que a conversa semanal recebe -------------------------------------

linha('4. O QUE A CONVERSA SEMANAL RECEBE');
const briefing = semComentario(readFileSync(join(ROOT, 'scripts/weekly-briefing.mjs'), 'utf8'));
R('o briefing imprime as bandeiras (`flags`)', /w\.flags/.test(briefing));
R('o briefing imprime o bloco `gate` (leituras, cauda, semanas)', /\bw\.gate\b/.test(briefing));
R('o briefing imprime a tabela do §1.2 / o limiar',
  /PAIN_GATE|VENA_BLOCK1_PAIN_GATE|painGate/.test(briefing));
R('o briefing marca ha quantos dias o rollup nao e atualizado',
  /updatedAt/.test(briefing));
const temTelaConversa = execSync(
  `grep -rl "conversa semanal" ${JSON.stringify(join(ROOT, 'src'))} --include=*.tsx || true`,
).toString().trim();
R('existe tela de conversa semanal dentro do app', Boolean(temTelaConversa));

// A semana em que ele NAO treinou: o que o rollup produz?
const semanaParada = cadeia([{ sessoes: [NO_TETO, NO_TETO] }, VAZIA]).at(-1);
linha(`  Semana sem treino nenhum -> flags: ${JSON.stringify(semanaParada.flags)}`);
linha(`  Semana sem treino nenhum -> pain: ${JSON.stringify(semanaParada.pain)}`);

// E o `WeekDoc` chega a ser reescrito numa semana sem treino? A sujeira e
// marcada por treino salvo e por survey de treino — nada mais.
const decorador = semComentario(readFileSync(join(ROOT, 'src/services/FirestoreStorageService.ts'), 'utf8'));
const gatilhosDeSemana = [...decorador.matchAll(/(\w+)\(([^)]*)\)\s*\{[^}]*weekKey/gs)].length;
R('o WeekDoc e reescrito por algo que nao seja treino/survey de treino',
  /weekKey/.test(decorador) && gatilhosDeSemana > 2);
linha(`  Escritas que marcam a semana suja: ${
  [...decorador.matchAll(/^\s{4}(\w+)\(/gm)].map((m) => m[1]).join(', ')}`);

// O ultimo `WeekDoc` gravado carrega suas `flags` congeladas. Se a ultima
// semana treinada saiu com a bandeira de RETORNO, ela e o que a conversa le
// depois do hiato — sem nenhum dado novo.
const ultimaComRetorno = controle.at(-1);
R('a bandeira de RETORNO fica gravada dentro do WeekDoc (e sobrevive ao hiato)',
  ultimaComRetorno.flags.some((f) => f.startsWith('RETORNO DO GATE')),
  `\n       -> ${ultimaComRetorno.flags.find((f) => f.startsWith('RETORNO DO GATE')) ?? ''}`);
linha();

console.log(out.join('\n'));
