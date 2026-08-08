#!/usr/bin/env node
/**
 * Camada 1 da arquitetura de verificação (verification.md §"Camada 1"):
 * invariantes executáveis sobre o programa GERADO do Bloco 1 (vena).
 *
 * Princípio: "onde um compilador pode verificar, agente não deve". Este script
 * não interpreta o desenho — ele afirma, de forma determinística, o que
 * `design.md` fixou. Cada constante abaixo cita a seção de origem.
 *
 * Uso:
 *   node scripts/validate-program.mjs [caminho/para/generated.ts]
 *
 * Códigos de saída:
 *   0  programa válido (ou ainda não gerado — não quebra o build de quem não gerou)
 *   1  o programa existe e viola pelo menos uma invariante
 *
 * Como o TypeScript é carregado sem bundler:
 *   Node >= 23 remove anotações de tipo de arquivos .ts nativamente. O único
 *   ponto que falta é a resolução de imports relativos sem extensão (estilo
 *   bundler), resolvido pelo hook de `node:module.register()` em `installTsLoader`.
 *   Nada aqui depende de vite/tsx/ts-node. Se o import falhar, há um caminho de
 *   recuo que lê o array JSON diretamente do texto do arquivo gerado.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve as resolvePath } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROGRAM_DIR = join(ROOT, 'src/data/program');

/**
 * O diretório do bloco ainda não tem nome fixo (`vena/`, `vena-block1/`…), então
 * a descoberta é por convenção: em `src/data/program`, qualquer diretório cujo
 * nome contenha "vena" e que tenha um `generated.ts` dentro.
 * Um caminho explícito na linha de comando sempre vence.
 */
function findProgram() {
  const dirs = existsSync(PROGRAM_DIR)
    ? readdirSync(PROGRAM_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.toLowerCase().includes('vena'))
      .map((d) => join(PROGRAM_DIR, d.name, 'generated.ts'))
    : [];
  return dirs.find((p) => existsSync(p)) ?? null;
}

// ---------------------------------------------------------------------------
// Constantes do desenho — cada uma com sua seção de origem
// ---------------------------------------------------------------------------

/** design.md §10 ("Os 5 dias") + §11 (3 semanas de calibração dentro do bloco). */
const EXPECTED_WEEKS = 18;
const EXPECTED_DAYS_PER_WEEK = 5;
/**
 * O taper muda a ESTRUTURA (SPEC §3.1: mudança de estrutura vira dia explícito),
 * então 5 dias/semana vale para as semanas de bloco e de calibração. As semanas
 * de taper e simulado declaram o próprio número de sessões.
 */
const EXPECTED_SESSIONS_MIN = 80;

/** design.md §10: "agacho 3× · supino 4× · terra 2×", conferido POR SEMANA. */
const EXPECTED_FREQUENCY = { squat: 3, bench: 4, deadlift: 2 };

/** design.md §11: semanas 1–3 acham a carga por teto de RPE, nunca por %. */
const CALIBRATION_WEEKS = [1, 2, 3];
/**
 * O teto de RPE das semanas de calibração vem do PROGRAMA (coluna RPE-* da
 * grade), não de uma constante deste arquivo. O que fica aqui é o teto absoluto
 * de segurança: nada no SBD passa de 8 na calibração (design §11).
 */
const CALIBRATION_RPE_ABS_CAP = 8;

/** design.md §10, tabela de papéis (Pana): papel "força" = 88–92%. 92% é o teto. */
const MAX_PERCENT = 0.92;

/**
 * trainingMax de PARTIDA. Preenchido a partir do bloco ```entradas``` do programa
 * gerado (SPEC §3.6 item 1): manter uma cópia hard-coded aqui faria o validador
 * medir volume-carga contra 215/160/240 depois do gate da S4 sem avisar ninguém.
 */
let LEGAL_REFERENCE_KG = { squat: 215, bench: 160, deadlift: 240 };

/** design.md §0: menor incremento carregável na barra com as micro-anilhas. */
const BAR_INCREMENT_KG = 1;
/** Tolerância de arredondamento ao comparar cargas implícitas, em kg. */
const KG_TOLERANCE = 0.1;

/**
 * design.md §11-A — a RAMPA de carga do bloco, que não é o ganho líquido.
 *
 * R33 traz duas medidas diferentes e elas foram confundidas uma vez:
 *   +7,5% = a rampa de carga, da primeira à última semana de bloco;
 *   −5%   = o déficit com que o bloco começa (Vena: max out, deload, corte de peso);
 *   +2,5% = o ganho líquido, que é a rampa menos o déficit.
 * O validador mede a RAMPA. O ganho líquido é derivado e reportado junto.
 *
 * ⚠️ Aqui o déficit inicial é ESCOLHA DE DESENHO (margem para a rampa), não
 * recuperação: este atleta não teve max out, nem deload, nem corte de peso.
 * Isso não muda a aritmética da checagem, só a leitura do número.
 */
const BLOCK_RAMP_TARGET = 7.0;
const BLOCK_RAMP_RANGE = [5.0, 9.0];
/**
 * Âncoras absolutas da rampa, em % do trainingMax CORRENTE. SPEC §2.1
 * re-denominou §11-A: a rampa CHEGA ao teto (86% → 92%) em vez de partir acima
 * dele. A frase "começa em ~95% e termina em ~102%" era o erro que fazia o
 * repositório não construir (0,95 × 215 = 95,3% > 92%).
 */
const BLOCK_START_RANGE = [84, 88];
const BLOCK_END_RANGE = [90, 93];

/** design.md §10, papéis de sessão (Pana): faixa de percentual por papel. */
const SESSION_ROLE_BANDS = {
  forca: [86, 92],
  pico: [85, 92.5],
  backoff: [82, 88],
  volume: [70, 80],
  gauge: [65, 80],
  pratica: [40, 70],
  leve: [55, 85],
  facil: [55, 75],
};
/**
 * A faixa 70–80% de Pana vale para 5–7 reps. Fora dessa janela de reps a faixa
 * não é conferida: 8 reps a 75% é ~RPE 9 por Epley, e cobrar a mesma faixa ali
 * acusaria prescrição correta (SPEC §3.6 item 6).
 */
const VOLUME_REP_WINDOW = [5, 7];

/** Exposição pesada: ≥85% do trainingMax. */
const HEAVY_SESSION_MIN_PERCENT = 0.85;
/**
 * design.md §13-C, C2 — duas métricas distintas, que antes eu tratava como uma:
 *
 *   último pesado (Travis 2021) — última sessão ≥85%. Agacho e terra 7–10 dias,
 *     supino menos de 7. AVISO fora da faixa.
 *   cessação total (Travis 2020) — última exposição de QUALQUER intensidade.
 *     ERRO acima de 7 dias, porque aí a força cai.
 *
 * Não se contradizem: último pesado a 8 dias com trabalho leve dentro dos 7.
 */
const LAST_HEAVY_RANGE_DAYS = { squat: [7, 10], bench: [0, 6], deadlift: [7, 10] };
const CESSATION_MAX_DAYS = 7;

/** design.md §11-B (Pritchard 2016): acessórios removidos ~2 semanas antes. */
const ACCESSORY_CUTOFF_WEEKS = 2;

/** design.md §0: "5 dias/semana, 75–100 min". 100 falha, 90 avisa. */
const SESSION_MINUTES_FAIL = 100;
/**
 * 90, alinhado ao comentário acima. Estava em 96 contra um máximo de programa
 * de 94,3 min: a faixa de aviso era INALCANÇÁVEL nas 80 sessões de bloco, ou
 * seja, o único sinal de "está apertado" estava desligado.
 */
const SESSION_MINUTES_WARN = 90;
/**
 * Piso de 75 min vale para a semana de TREINO. O taper viola por definição: uma
 * sessão com 40% menos volume-carga não chega a 75 min, e inflar descanso para
 * passar num checker é maquiagem (SPEC §3.2, pendência P1).
 */
const SESSION_MINUTES_FLOOR = 75;

/**
 * Estimativa de duração. NÃO vem de design.md — são premissas deste validador,
 * declaradas aqui para que o número seja auditável e não mágico.
 */
// EXEC_SEC_WORKING / EXEC_SEC_WARMUP / WARMUP_REST_SEC foram APAGADAS: eram
// uma segunda tabela de premissas, órfã, ao lado das TIME_*_SEC que o motor de
// fato usa. Duas tabelas no mesmo arquivo, uma morta, é convite a corrigir a
// errada.
const DEFAULT_REST_SEC = 150;  // quando o bloco não prescreve descanso

/**
 * design.md §11-B — taper e simulado.
 *
 * O teto de 92% e a frequência 3/4/2 valem para SEMANA DE TREINO. O simulado é,
 * por definição, ~100% do máximo ATUAL (que §11-C põe em ~87% do máximo projetado
 * de competição em 12 meses — os dois números têm denominadores diferentes e não
 * se contradizem). Por isso a semana de simulado é isenta daqueles tetos e recebe,
 * no lugar, as invariantes de tentativa abaixo.
 */
const SIMULATION_MIN_PERCENT = 0.96;   // abaixo disso não é simulado
const ATTEMPTS_PER_LIFT = 3;
/** Abertura ≈ 91% da terceira · segunda +5% · terceira +3% (médias IPF: 90,9/96,3/99,6). */
const ATTEMPT_OPENER_PCT_OF_THIRD = 91;
const ATTEMPT_SECOND_STEP_PCT = 105;
const ATTEMPT_THIRD_STEP_PCT = 103;
/** Tolerância dada para a abertura (±2 pontos percentuais), reusada nos dois degraus. */
const ATTEMPT_TOLERANCE_PP = 2;

/** Travis 2020: redução de volume 30–50% bate 50–70%; manter ≥85% 1RM. */
const TAPER_VOLUME_DROP_RANGE = [30, 50];
const TAPER_MIN_INTENSITY = 0.85;
/**
 * Teto próprio do taper: Travis 2021 (n=364) põe as sessões pesadas finais em
 * 90,0–92,5% 1RM. Não conflita com Pritchard (pico de intensidade ~1,9 semanas
 * antes do meet, ou seja, dentro do taper): Pritchard diz QUANDO a intensidade é
 * a mais alta do bloco, Travis diz QUANTO vale esse máximo. Acima de 92,5% não
 * há evidência que sustente.
 */
const TAPER_MAX_PERCENT = 0.925;

/** design.md §10 (dose de força, Pak): 3–6 séries de 1–5 reps acima de 80%. */
const FORCE_DOSE_RANGE = [3, 6];
const FORCE_DOSE_MIN_PERCENT = 0.80;

/**
 * Equipamento da academia (inventário do atleta): barra olímpica, rack, halteres
 * até 40 kg, leg press 45° e vertical, mesa flexora, máquinas de puxada, cinto,
 * magnésio, faixa de joelho, munhequeira, strap.
 * O que segue é o complemento: aparelhos que comprovadamente NÃO existem lá.
 * verification.md §"Camada 1" nomeia o GHD explicitamente.
 */
const ABSENT_EQUIPMENT = [
  [/\bghd\b|glute[\s_-]?ham|nordic/, 'GHD / glute-ham raise / nordic — NÃO existe na academia'],
  [/reverse[\s_-]?hyper/, 'reverse hyper — aparelho ausente'],
  [/(safety[\s_-]?squat|ssb)\b/, 'safety squat bar — barra especial ausente'],
  [/trap[\s_-]?bar|hex[\s_-]?bar/, 'trap/hex bar — barra especial ausente'],
  [/cambered/, 'cambered bar — barra especial ausente'],
  [/\bsled\b|prowler/, 'sled/prowler — aparelho ausente'],
  [/kettlebell|\bkb\b/, 'kettlebell — ausente'],
  [/smith/, 'smith machine — ausente'],
  [/belt[\s_-]?squat|pendulum/, 'belt squat / pendulum squat — ausente'],
  [/hip[\s_-]?thrust/, 'hip thrust — banco/aparelho não listado no inventário'],
  [/hack[\s_-]?squat/, 'hack squat — ausente (o que existe é leg press 45° e vertical)'],
  [/landmine/, 'landmine — ausente'],
];

/** Máquinas cobertas pelo inventário (leg press, mesa flexora, máquinas de puxada). */
const ALLOWED_MACHINE = /leg[\s_-]?press|flexora|leg[\s_-]?curl|puxada|pulldown|pull[\s_-]?down|polia|pulley|cabo|cable|remada|row|peck[\s_-]?deck|crucifixo|voador|extensora|panturrilha|face[\s_-]?pull/;

/** design.md §3: pin/box/Anderson squat saíram do programa. */
const FIXED_HEIGHT_FAIL = /pin[\s_-]?squat|box[\s_-]?squat|anderson/;
/** Altura fixa em suporte não nomeada em §3 — aviso, não falha. */
const FIXED_HEIGHT_WARN = /pin[\s_-]?press|block[\s_-]?(pull|deadlift)|rack[\s_-]?pull/;

/**
 * design.md §4: uma variável técnica por levantamento. A cota do supino foi gasta
 * com a pausa e a do terra com o reset sem strap — logo, mudança de PEGADA de
 * supino e troca de ESTILO de terra estão explicitamente fora do bloco.
 * `wide grip` não é flagrado: é a pegada atual dele, portanto não é mudança.
 */
const BENCH_GRIP_CHANGE = /close[\s_-]?grip|narrow|pegada[\s_-]?fechada|estreit|snatch[\s_-]?grip/;
const DEADLIFT_STYLE_CHANGE = /convencional|conventional/;

/** design.md §10: "Zero [elites] usam bandas ou correntes" nos levantamentos. */
const ACCOMMODATING_RESISTANCE = /banda|band\b|bands\b|corrente|chain/;

/**
 * Classificação por levantamento. Roda sobre `exerciseId + exerciseName`
 * normalizado (sem acento, minúsculo). A tabela de classificação é impressa no
 * relatório justamente para que um erro de classificação fique visível.
 */
const LIFT_PATTERNS = {
  squat: {
    include: /agach|squat/,
    exclude: /hack|leg[\s_-]?press|sissy|bulgar|split|goblet|belt[\s_-]?squat|pendulum|smith/,
  },
  bench: {
    include: /supino|bench|larsen|spoto|floor[\s_-]?press|pin[\s_-]?press/,
    // Inclinado/declinado e halteres são trabalho de peito (design §10, D5
    // "peito alongado"), não sessão de supino — não contam frequência.
    exclude: /leg[\s_-]?press|shoulder|ombro|militar|\bohp\b|overhead|desenvolvimento|inclinad|incline|declinad|decline|halter|dumbbell|\bdb\b|crucifixo|fly|voador|maquina|machine/,
  },
  deadlift: {
    include: /terra|deadlift|dead[\s_-]?lift/,
    exclude: /stiff|romanian|\brdl\b|good[\s_-]?morning|levantamento[\s_-]?terra[\s_-]?stiff/,
  },
};

// ---------------------------------------------------------------------------
// Infra
// ---------------------------------------------------------------------------

const violations = [];
const notes = [];

function report(level, category, where, message) {
  violations.push({ level, category, where, message });
}
const fail = (category, where, message) => report('ERRO', category, where, message);
const warn = (category, where, message) => report('AVISO', category, where, message);

/** "Semana 4 · D2 · supino_wide_grip" */
function at(week, day, ex) {
  const parts = [];
  if (week != null) parts.push(`S${week}`);
  if (day != null) parts.push(`D${day}`);
  if (ex) parts.push(ex);
  return parts.join(' · ') || '—';
}

function norm(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function round(n, digits = 2) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

/** Silencia só o ExperimentalWarning do type-stripping; o resto continua visível. */
function quietExperimentalWarnings() {
  process.removeAllListeners('warning');
  process.on('warning', (w) => {
    if (w.name === 'ExperimentalWarning') return;
    console.warn(`${w.name}: ${w.message}`);
  });
}

/**
 * Hook de resolução: permite importar `./exerciseRegistry` (sem extensão), que é
 * como o código de `src/` escreve os imports. Sem isso, o ESM do Node recusa.
 */
function installTsLoader() {
  const hook = `
    export function resolve(spec, ctx, next) {
      if (spec.startsWith('.') && !/\\.[a-zA-Z]+$/.test(spec)) {
        try { return next(spec + '.ts', ctx); } catch { /* cai no next original */ }
      }
      return next(spec, ctx);
    }`;
  register(`data:text/javascript,${encodeURIComponent(hook)}`, import.meta.url);
}

// ---------------------------------------------------------------------------
// Carga do programa e do registro de exercícios
// ---------------------------------------------------------------------------

function looksLikeWeeks(value) {
  return Array.isArray(value) && value.length > 0
    && typeof value[0] === 'object' && value[0] !== null
    && 'weekNumber' in value[0] && Array.isArray(value[0].days);
}

/**
 * Recuo sem execução: o gerador escreve os corpos como JSON puro. O arquivo pode
 * exportar mais de um array (semanas, agregados, invariantes), então cada
 * candidato é extraído por balanceamento de colchetes e testado.
 */
function parseWeeksFromText(text) {
  for (const m of text.matchAll(/=\s*\[/g)) {
    const start = text.indexOf('[', m.index);
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i += 1) {
      const c = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (c === '\\') escaped = true;
        else if (c === '"') inString = false;
        continue;
      }
      if (c === '"') inString = true;
      else if (c === '[') depth += 1;
      else if (c === ']') {
        depth -= 1;
        if (depth !== 0) continue;
        try {
          const parsed = JSON.parse(text.slice(start, i + 1));
          if (looksLikeWeeks(parsed)) return parsed;
        } catch { /* candidato não é JSON puro */ }
        break;
      }
    }
  }
  return null;
}

async function loadProgram(path) {
  const text = readFileSync(path, 'utf8');
  try {
    const mod = await import(pathToFileURL(path).href);
    for (const value of Object.values(mod)) {
      if (looksLikeWeeks(value)) return { weeks: value, how: 'import', mod };
    }
  } catch (err) {
    notes.push(`import de ${path} falhou (${err.message}); usando leitura textual do array.`);
  }
  const parsed = parseWeeksFromText(text);
  if (parsed) return { weeks: parsed, how: 'texto', mod: null };
  throw new Error(`não foi possível extrair PrescribedWeek[] de ${path}`);
}

/** Importa todo `src/data/exercises/*.ts` para popular o registro. */
async function loadRegistry() {
  const dir = join(ROOT, 'src/data/exercises');
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));
  // definitions.ts primeiro: os demais catálogos sobrescrevem por id, de propósito.
  files.sort((a, b) => (a === 'definitions.ts' ? -1 : b === 'definitions.ts' ? 1 : a.localeCompare(b)));
  for (const f of files) {
    await import(pathToFileURL(join(dir, f)).href);
  }
  return import(pathToFileURL(join(ROOT, 'src/domain/exerciseRegistry.ts')).href);
}

/**
 * O markdown de origem, ao lado do gerado em `source/`. Opcional.
 * Lê TODOS os .md do diretório e concatena: `source/` costuma ter mais de um
 * documento (programa + contexto), e escolher "o primeiro" faria a checagem
 * passar em silêncio sobre o arquivo errado.
 */
function loadSourceMarkdown(programPath) {
  const dir = join(dirname(programPath), 'source');
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (!files.length) return null;
  return {
    paths: files.map((f) => join(dir, f)),
    text: files.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n'),
  };
}

/**
 * Bloco ```entradas``` do markdown: `chave = valor`. São DADOS DE ENTRADA, não
 * medições — o validador os imprime e NÃO os compara contra constantes próprias
 * (SPEC §3.2 regra 2: entrada é tautologia por definição, e comparar tautologia
 * dá cobertura falsa). As promessas checáveis vivem em ```restricoes``` e são
 * recomputadas pelo gerador, que escreve o número medido em
 * VENA_BLOCK1_INVARIANTS.
 */
function parseDeclaredInvariants(text) {
  const block = text.match(/```entradas\n([\s\S]*?)```/);
  if (!block) return null;
  const out = {};
  for (const line of block[1].split('\n')) {
    const m = line.match(/^\s*([a-z0-9_]+)\s*=\s*(.+?)\s*$/i);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/**
 * A tabela `VENA_BLOCK1_INVARIANTS` é ESCRITA pelo gerador, e o gerador lança na
 * PRIMEIRA violação — então `ok:false` nunca chega ao arquivo gerado e o ramo
 * `if (r.ok === false)` era código morto por construção. A frase que este
 * arquivo imprimia ("43 restrições recomputadas pelo gerador, todas
 * conferidas") dava cobertura falsa: ler o campo que o autor da medida escreveu
 * NÃO é segunda leitura — é o modo de falha do `47`, um nível acima.
 *
 * Aqui a tabela é tratada como o que é (um relatório do gerador) e a segunda
 * leitura de verdade vive em `recheckVenaInvariants`, que RECOMPUTA a partir de
 * `venaBlock1Weeks`, sem olhar para nenhum campo escrito pelo gerador.
 */
function checkGeneratedInvariants(mod) {
  const rows = mod?.VENA_BLOCK1_INVARIANTS;
  if (!Array.isArray(rows) || !rows.length) {
    notes.push('programa não exporta VENA_BLOCK1_INVARIANTS — a camada de restrições declaradas não rodou.');
    return null;
  }
  for (const r of rows) {
    if (r.ok === false) {
      fail('RESTRIÇÃO', r.escopo ?? '—',
        `${r.chave} ${r.comparador} ${r.alvo}: medido ${r.medido} (bloco \`restricoes\` do markdown de origem)`);
    }
  }
  const semTag = rows.filter((r) => !r.tag).map((r) => r.chave);
  if (semTag.length) fail('RESTRIÇÃO', '—', `restrições sem tag de procedência: ${semTag.join(', ')}`);
  const pessoais = rows.filter((r) => r.tag === 'PESSOAL').map((r) => r.chave);
  notes.push(`${rows.length} restrição(ões) declaradas pelo gerador, lidas como RELATÓRIO (o gerador lança na 1ª violação, `
    + `então este campo nunca chega falso). A verificação independente é a de recheckVenaInvariants, abaixo.`);
  if (pessoais.length) {
    notes.push(`restrições ancoradas em claim [PESSOAL] do canal: ${pessoais.join(', ')}.`);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// SEGUNDA LEITURA INDEPENDENTE (SPEC §3.6/8)
//
// Recomputa, a partir de `venaBlock1Weeks` e SÓ dele, as seis checagens que
// antes existiam apenas dentro do gerador: UM-EIXO, PAUSA-1S, EXP, RAMPAS,
// GAUGE-POS e EIXO-AXIAL, mais as relações de DIRETAS (R4/R5). Um defeito na
// função de medida do gerador produziria invariante e medida erradas de forma
// consistente; esta função é a única coisa no repositório que lê o artefato com
// outra implementação.
// ---------------------------------------------------------------------------

const VENA_BENCH_ID = 'supino_pausado_competicao';

function venaBlockWeeks(weeks, kinds) {
  return weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco' || kinds.get(w.weekNumber) === 'calibração');
}

/** Exposição de peitoral da semana, nas quatro dimensões que o eixo declara. */
function chestExposure(week) {
  let pausedSets = 0;
  let pauseSecTotal = 0;
  let floorPressSets = 0;
  let stretchedSets = 0;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      if (ex.exerciseId === VENA_BENCH_ID) {
        pausedSets += ex.sets ?? 0;
        pauseSecTotal += (ex.sets ?? 0) * (ex.pauseSec ?? 0);
      }
      if (ex.countsAs === 'supino_acessorio') floorPressSets += ex.sets ?? 0;
      if (ex.countsAs === 'peito_alongado') stretchedSets += ex.sets ?? 0;
    }
  }
  return { pausedSets, pauseSecTotal, floorPressSets, stretchedSets };
}

/** Maior percentual prescrito de supino de competição na semana (null se não houver). */
function benchTopPercent(week) {
  let top = null;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      if (ex.exerciseId !== VENA_BENCH_ID) continue;
      const p = ex.percentMax ?? ex.percentMin;
      if (p !== undefined && (top === null || p > top)) top = p;
    }
  }
  return top;
}

/** EXP = Σ (séries × reps × duração_s × %TM) sobre toda rep de barra de supino. */
function benchExposureIndex(week) {
  let exp = 0;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      if (ex.exerciseId !== VENA_BENCH_ID) continue;
      const p = ex.percentMin;
      if (p === undefined) continue;
      const reps = repsMin(ex.reps) ?? 0;
      exp += (ex.sets ?? 0) * reps * (ex.pauseSec ?? 0) * p;
    }
  }
  return round(exp * 100, 2);
}

function recheckVenaInvariants(weeks, kinds) {
  const block = venaBlockWeeks(weeks, kinds);
  if (!block.length) return null;
  const out = {};

  // 1. PAUSA-1S — nenhuma rep de barra de supino de competição abaixo de 1,0 s,
  //    em NENHUMA semana, taper e simulado incluídos.
  let pausaViolations = 0;
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    if (ex.exerciseId !== VENA_BENCH_ID) continue;
    if ((ex.pauseSec ?? 0) < 1 - 1e-9) {
      pausaViolations += 1;
      fail('PAUSA-1S', at(week.weekNumber, dayNum, ex.exerciseId),
        `supino de competição com pausa de ${ex.pauseSec ?? 0} s, abaixo do piso legal de 1,0 s (SPEC §2.2)`);
    }
  }
  out.pausa1s = pausaViolations;

  // 2. UM-EIXO — semana em que a exposição de peitoral mexe não pode ter a carga
  //    de supino subindo. Recomputado do artefato, não da grade do markdown.
  //    ⚠️ LIMITE DECLARADO desta segunda leitura: nas semanas de CALIBRAÇÃO a
  //    carga é descoberta por teto de RPE e NÃO existe como percentual no
  //    artefato — o `percent1RM` daquelas semanas é só o do gauge. Comparar S3
  //    com S4 leria "70% → 86%", que é troca de denominador e não subida. Por
  //    isso a comparação roda entre semanas de BLOCO; a cobertura das S1–S3 vem
  //    do checker do gerador, que lê a grade e converte `RPE n` pela tabela
  //    normativa §0.3.
  const umEixoWeeks = block.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  let umEixo = 0;
  for (let i = 1; i < umEixoWeeks.length; i += 1) {
    const a = chestExposure(umEixoWeeks[i - 1]);
    const b = chestExposure(umEixoWeeks[i]);
    const moved = Object.keys(a).some((k) => Math.abs(a[k] - b[k]) > 1e-9);
    if (!moved) continue;
    const pa = benchTopPercent(umEixoWeeks[i - 1]);
    const pb = benchTopPercent(umEixoWeeks[i]);
    if (pa !== null && pb !== null && pb > pa + 1e-9) {
      umEixo += 1;
      fail('UM-EIXO', at(umEixoWeeks[i].weekNumber),
        `exposição de peitoral MUDOU e a carga de supino SUBIU na mesma semana `
        + `(${round(pa * 100, 1)}% → ${round(pb * 100, 1)}%) — R63@02:01: uma variável por levantamento`);
    }
  }
  out.umEixo = umEixo;

  // 3. EXP — teto de +25% por semana sobre o máximo das duas anteriores,
  //    semeado na primeira semana de percentual. Recomputado do zero.
  const expByWeek = new Map(block.map((w) => [w.weekNumber, benchExposureIndex(w)]));
  const firstPct = block.find((w) => benchTopPercent(w) !== null && kinds.get(w.weekNumber) === 'bloco');
  let expViolations = 0;
  if (firstPct) {
    for (const week of block) {
      if (week.weekNumber <= firstPct.weekNumber) continue;
      const prev1 = expByWeek.get(week.weekNumber - 1) ?? 0;
      const prev2 = expByWeek.get(week.weekNumber - 2) ?? 0;
      const ceiling = 1.25 * Math.max(prev1, prev2);
      const value = expByWeek.get(week.weekNumber) ?? 0;
      if (value > ceiling + 1e-6) {
        expViolations += 1;
        fail('EXP', at(week.weekNumber),
          `exposição de peitoral ${value} acima do teto recomputado ${round(ceiling, 2)} (+25%/semana sobre o máximo das duas anteriores)`);
      }
    }
  }
  out.exp = expViolations;

  // 4. RAMPAS — rampa de carga de S4 a S16 por levantamento, recomputada do
  //    artefato e comparada contra a faixa 5–9% de design §11-A.
  const pctWeeks = block.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  out.rampas = {};
  for (const lift of ['squat', 'bench', 'deadlift']) {
    const tops = pctWeeks.map((w) => {
      let top = 0;
      for (const day of w.days ?? []) {
        for (const ex of day.exercises ?? []) {
          if (liftOf(ex) !== lift) continue;
          const p = ex.percentMax ?? ex.percentMin;
          if (p !== undefined && p > top) top = p;
        }
      }
      return top;
    }).filter((v) => v > 0);
    if (tops.length < 2) continue;
    const ramp = round(((tops[tops.length - 1] - tops[0]) / tops[0]) * 100, 2);
    out.rampas[lift] = ramp;
    if (ramp < BLOCK_RAMP_RANGE[0] - 1e-9 || ramp > BLOCK_RAMP_RANGE[1] + 1e-9) {
      fail('RAMPA', '—', `${lift}: rampa recomputada de ${ramp}%, fora da faixa ${BLOCK_RAMP_RANGE.join('–')}% (design §11-A)`);
    }
  }

  // 5. GAUGE-POS — o gauge é a PRIMEIRA série de trabalho daquele levantamento
  //    no dia. Recomputado percorrendo cada dia.
  let gaugeViolations = 0;
  for (const week of weeks) {
    for (const [i, day] of (week.days ?? []).entries()) {
      const seen = new Set();
      for (const ex of day.exercises ?? []) {
        const lift = liftOf(ex);
        if (!lift) continue;
        if (ex.role === 'gauge' && seen.has(lift)) {
          gaugeViolations += 1;
          fail('GAUGE-POS', at(week.weekNumber, (day.dayIndex ?? i) + 1, ex.exerciseId),
            'gauge não é a primeira série de trabalho do levantamento no dia (Noriega · SPEC §4.2)');
        }
        seen.add(lift);
      }
    }
  }
  out.gaugePos = gaugeViolations;

  // 6. EIXO-AXIAL — tonelagem axial por dia. A invariante declarada cobre D4/D5;
  //    o desequilíbrio real está em D3, e isso sai como AVISO nomeado em vez de
  //    passar em silêncio (R15 declarado ABERTO no markdown).
  const last = pctWeeks[pctWeeks.length - 1];
  const axial = {};
  for (const [i, day] of (last?.days ?? []).entries()) {
    let tons = 0;
    for (const ex of day.exercises ?? []) {
      const lift = liftOf(ex);
      if (!lift || lift === 'bench') continue;
      const p = ex.percentMin;
      if (p === undefined) continue;
      tons += (ex.sets ?? 0) * (repsMin(ex.reps) ?? 0) * p * (LEGAL_REFERENCE_KG?.[lift] ?? 0);
    }
    axial[(day.dayIndex ?? i) + 1] = Math.round(tons);
  }
  const vals = Object.values(axial).filter((v) => v > 0);
  out.axial = axial;
  out.axialMaxRatio = vals.length ? round(Math.max(...vals) / Math.min(...vals), 2) : null;
  if (axial[3] && axial[4] && axial[3] / axial[4] > 1.3) {
    warn('EIXO-AXIAL', at(last.weekNumber),
      `D3 carrega ${round(axial[3] / axial[4], 2)}× o axial de D4 (a invariante declarada cobre D4/D5, que já foi consertado) `
      + '— R15 continua ABERTO e está declarado assim no markdown');
  }

  // 7. DIRETAS — R4 e R5 aplicados, não só impressos.
  const perWeek = block.map((week) => {
    const t = {};
    for (const day of week.days ?? []) {
      for (const ex of day.exercises ?? []) {
        if (!ex.countsAs) continue;
        t[ex.countsAs] = (t[ex.countsAs] ?? 0) + (ex.sets ?? 0);
      }
    }
    return { week: week.weekNumber, t };
  });
  for (const { week, t } of perWeek) {
    const costas = t.costas ?? 0;
    const biceps = t.biceps ?? 0;
    const lateral = t.delt_lateral ?? 0;
    const posterior = t.delt_posterior ?? 0;
    if (costas < 12) fail('DIRETAS', at(week), `costas com ${costas} séries diretas, abaixo do piso de 12 (design §13-B/R4)`);
    if (costas <= biceps) fail('DIRETAS', at(week), `costas (${costas}) não está acima de bíceps (${biceps}) — R4`);
    if (costas <= lateral) fail('DIRETAS', at(week), `costas (${costas}) não está acima de delt lateral (${lateral}) — R4`);
    if (lateral + posterior > 12) fail('DIRETAS', at(week), `delt lateral + posterior = ${lateral + posterior}, acima do teto de 12 (R5)`);
    if ((t.delt_anterior ?? 0) !== 0) fail('DIRETAS', at(week), 'delt anterior tem série direta, e design §10-B pede zero');
  }
  out.diretas = perWeek[0]?.t ?? {};

  notes.push('SEGUNDA LEITURA independente sobre venaBlock1Weeks: PAUSA-1S, UM-EIXO, EXP, RAMPAS, GAUGE-POS, '
    + 'EIXO-AXIAL e DIRETAS recomputados aqui, sem ler nenhum campo escrito pelo gerador.');
  return out;
}

/**
 * ⚠️ FUNÇÃO INERTE, MANTIDA COM AVISO EXPLÍCITO em vez de removida em silêncio.
 *
 * Ela nasceu para casar o esquema declarado em prosa (`4×6`) com o esquema
 * gerado, mas o regex abaixo espera um FORMATO DE TABELA que o markdown não usa
 * mais: os papéis vivem hoje num bloco ```papeis``` (pipe-separated, sem
 * `×`), e o casamento devolve ZERO linhas — a função retornava `null` em
 * silêncio e dava cobertura falsa.
 *
 * A checagem que ela pretendia fazer EXISTE e é mais forte: o gerador compara,
 * semana a semana, o esquema declarado em ```papeis``` com o do template, e
 * divergência é ERRO DE BUILD (`papel declara AxB, template prescreve CxD`).
 * Esta cópia frouxa não acrescenta nada; fica registrada como sem cobertura.
 */
function checkSchemeCoherence(markdown, weeks, kinds) {
  if (!markdown) return null;
  notes.push('checkSchemeCoherence NÃO cobre nada: o formato que o regex espera não existe mais no markdown. '
    + 'A checagem equivalente é erro de build no gerador (papeis × template, semana a semana).');
  const declared = new Map(); // `${dayNum}|${nome}` -> Set("4×6")
  for (const line of markdown.text.split('\n')) {
    const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*D(\d)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+)×(\d+)\s*\|/);
    if (!m) continue;
    const key = `${m[2]}|${norm(m[3]).replace(/\s+/g, ' ')}`;
    if (!declared.has(key)) declared.set(key, new Set());
    declared.get(key).add(`${m[5]}×${m[6]}`);
  }
  if (!declared.size) return null;

  const built = new Map();
  for (const week of weeks) {
    if (kinds.get(week.weekNumber) !== 'bloco') continue;
    for (const [i, day] of (week.days ?? []).entries()) {
      for (const ex of day.exercises ?? []) {
        const reps = repsMin(ex.reps);
        if (!reps) continue;
        const key = `${(day.dayIndex ?? i) + 1}|${norm(ex.exerciseName).replace(/\s+/g, ' ')}`;
        if (!built.has(key)) built.set(key, new Set());
        built.get(key).add(`${ex.sets}×${reps}`);
      }
    }
  }

  let checked = 0;
  for (const [key, schemes] of declared) {
    const actual = built.get(key);
    if (!actual) {
      warn('COERÊNCIA', key.replace('|', ' · '),
        `a tabela de papéis declara ${[...schemes].join(', ')} mas o programa não tem esse exercício nesse dia`);
      continue;
    }
    checked += 1;
    const missing = [...schemes].filter((s) => !actual.has(s));
    if (missing.length) {
      warn('COERÊNCIA', key.replace('|', ' · '),
        `prosa declara ${[...schemes].join(', ')} · template prescreve ${[...actual].join(', ')} — divergência em ${missing.join(', ')}`);
    }
  }
  return { declared: declared.size, checked };
}

/** O union DayType é lido do texto de types/index.ts — não existe em runtime. */
function readDayTypes() {
  const text = readFileSync(join(ROOT, 'src/types/index.ts'), 'utf8');
  const block = text.match(/export type DayType\s*=([\s\S]*?);/);
  if (!block) throw new Error('não encontrei o union DayType em src/types/index.ts');
  return new Set([...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]));
}

// ---------------------------------------------------------------------------
// Leitura do modelo prescrito
// ---------------------------------------------------------------------------

/**
 * Registro de exercícios, preenchido no `main`. É consultado pelo classificador
 * porque S/B/D de competição são, por definição, barra — máquina e halter nunca
 * contam frequência de levantamento.
 */
let REGISTRY = null;
/** Classificação de semanas, preenchida no `main` antes das checagens. */
let WEEK_KINDS = null;

function equipmentOf(id) {
  return REGISTRY?.getExercise(id)?.equipment ?? 'barbell';
}

function liftOf(ex) {
  if (equipmentOf(ex.exerciseId) !== 'barbell') return null;
  const hay = `${norm(ex.exerciseId)} ${norm(ex.exerciseName)}`;
  for (const [lift, { include, exclude }] of Object.entries(LIFT_PATTERNS)) {
    if (include.test(hay) && !exclude.test(hay)) return lift;
  }
  return null;
}

/** Percentuais distintos do bloco: nível de exercício + nível de série. */
function percentsOf(ex) {
  const out = new Set();
  const push = (min, max) => {
    if (typeof min === 'number') out.add(min);
    if (typeof max === 'number') out.add(max);
  };
  push(ex.percentMin, ex.percentMax);
  for (const set of ex.setPlan ?? []) push(set.percentMin, set.percentMax);
  return [...out];
}

function hasPercent(ex) {
  return percentsOf(ex).length > 0
    || typeof ex.percent1RM === 'string'
    || (ex.setPlan ?? []).some((s) => typeof s.percent1RM === 'string');
}

/** Maior RPE citado no bloco. Aceita "7", "RPE 7", "@7", "6-7", "7,5". */
function maxRpe(ex) {
  const sources = [ex.rpe, ...(ex.setPlan ?? []).map((s) => s.rpe)];
  let best = null;
  for (const raw of sources) {
    for (const m of String(raw ?? '').matchAll(/(\d+(?:[.,]\d+)?)/g)) {
      const n = Number(m[1].replace(',', '.'));
      if (n >= 1 && n <= 10 && (best === null || n > best)) best = n;
    }
  }
  return best;
}

/** Primeiro número da prescrição de reps ("3", "5-7", "1", "AMRAP" -> null). */
function repsMin(reps) {
  const m = String(reps ?? '').match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/**
 * Papel de cada semana, por METADADO — nunca pelo número da semana, porque o
 * tamanho do bloco pode mudar (design §11-C deixa isso explicitamente em aberto).
 *
 *   calibração — design §11 (as primeiras semanas, por RPE)
 *   simulado   — blockType 'realization' ou "simulado"/"mock" no rótulo
 *   taper      — "taper" no rótulo, ou deload nas ~2 semanas antes do simulado
 *   bloco      — o resto: as semanas de treino, onde valem teto e frequência
 */
function classifyWeeks(weeks) {
  const label = (w) => norm(`${w.blockName} ${w.blockObjective} ${w.weekLabel}`);
  const kinds = new Map();
  const simWeeks = [];

  for (const w of weeks) {
    if (w.blockType === 'realization' || /simulad|mock/.test(label(w))) simWeeks.push(w.weekNumber);
  }
  for (const w of weeks) {
    const n = w.weekNumber;
    if (simWeeks.includes(n)) { kinds.set(n, 'simulado'); continue; }
    if (CALIBRATION_WEEKS.includes(n)) { kinds.set(n, 'calibração'); continue; }
    const nearSim = simWeeks.some((s) => n < s && s - n <= 2);
    const isTaper = /taper/.test(label(w)) || ((w.isDeload === true || w.blockType === 'deload') && nearSim);
    kinds.set(n, isTaper ? 'taper' : 'bloco');
  }
  return kinds;
}

const eachExercise = function* (weeks) {
  for (const week of weeks) {
    for (const [i, day] of (week.days ?? []).entries()) {
      for (const ex of day.exercises ?? []) {
        yield { week, day, dayNum: (day.dayIndex ?? i) + 1, ex };
      }
    }
  }
};

// ---------------------------------------------------------------------------
// Invariantes — estrutura
// ---------------------------------------------------------------------------

function checkStructure(weeks, registry, dayTypes) {
  if (weeks.length !== EXPECTED_WEEKS) {
    fail('ESTRUTURA', '—', `esperado ${EXPECTED_WEEKS} semanas (design §10/§11), encontrado ${weeks.length}`);
  }

  let sessions = 0;
  for (const week of weeks) {
    const days = week.days ?? [];
    sessions += days.length;
    const kind = WEEK_KINDS?.get(week.weekNumber);
    if (kind !== 'taper' && kind !== 'simulado' && days.length !== EXPECTED_DAYS_PER_WEEK) {
      fail('ESTRUTURA', at(week.weekNumber), `esperado ${EXPECTED_DAYS_PER_WEEK} dias/semana (design §0), encontrado ${days.length}`);
    }
    for (const [i, day] of days.entries()) {
      if (!dayTypes.has(day.dayType)) {
        fail('ESTRUTURA', at(week.weekNumber, i + 1), `dayType "${day.dayType}" fora do union DayType de src/types/index.ts`);
      }
      if (!day.exercises?.length) {
        fail('ESTRUTURA', at(week.weekNumber, i + 1), 'dia sem exercícios');
      }
    }
  }
  if (sessions < EXPECTED_SESSIONS_MIN) {
    fail('ESTRUTURA', '—', `apenas ${sessions} sessões, abaixo do piso de ${EXPECTED_SESSIONS_MIN}`);
  }

  const unknown = new Set();
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    if (!ex.exerciseId || registry.getExercise(ex.exerciseId)) continue;
    if (unknown.has(ex.exerciseId)) continue;
    unknown.add(ex.exerciseId);
    fail('ESTRUTURA', at(week.weekNumber, dayNum, ex.exerciseId), 'exerciseId não registrado em src/data/exercises/');
  }
}

/** "S4, S5, S6, S9" — mantém o relatório legível quando o desvio é sistemático. */
function weekList(numbers) {
  return numbers.map((n) => `S${n}`).join(', ');
}

/**
 * design.md §10: frequência conferida semana a semana, não no agregado.
 * Semanas com o mesmo desvio são agrupadas numa linha só — 18 linhas idênticas
 * escondem o resto do relatório sem acrescentar informação.
 */
function checkFrequency(weeks, kinds) {
  const offenders = new Map(); // `${lift}|${count}` -> semanas
  for (const week of weeks) {
    // A frequência 3/4/2 descreve a semana de treino; o simulado tem a estrutura
    // do meet (design §11-B), não a do microciclo.
    const kind = kinds.get(week.weekNumber);
    if (kind === 'simulado' || kind === 'taper') continue;
    const daysWith = { squat: 0, bench: 0, deadlift: 0 };
    for (const day of week.days ?? []) {
      const lifts = new Set((day.exercises ?? []).map(liftOf).filter(Boolean));
      for (const lift of lifts) daysWith[lift] += 1;
    }
    for (const [lift, expected] of Object.entries(EXPECTED_FREQUENCY)) {
      if (daysWith[lift] === expected) continue;
      const key = `${lift}|${daysWith[lift]}`;
      if (!offenders.has(key)) offenders.set(key, []);
      offenders.get(key).push(week.weekNumber);
    }
  }
  for (const [key, list] of offenders) {
    const [lift, count] = key.split('|');
    fail('FREQUÊNCIA', weekList(list),
      `${lift}: ${count} dia(s) na semana, esperado ${EXPECTED_FREQUENCY[lift]} (design §10) — ${list.length} semana(s)`);
  }
}

// ---------------------------------------------------------------------------
// Invariantes — carga e progressão
// ---------------------------------------------------------------------------

/**
 * O levantamento de competição em si, distinguido das suas variações (high bar,
 * agacho com pausa): no catálogo, só os três de competição carregam `percentRef`.
 * Se nenhum exercício do programa tiver `percentRef`, o sinal não existe e todo
 * o family vira "principal" — conservador de propósito.
 */
function competitionLiftDetector(weeks, registry) {
  const anyRef = [...eachExercise(weeks)].some(({ ex }) => registry.getExercise(ex.exerciseId)?.percentRef);
  return (ex, lift) => {
    if (!anyRef) return true;
    return registry.getExercise(ex.exerciseId)?.percentRef === lift;
  };
}

/**
 * design.md §11: nas semanas 1–3 o papel "força" roda com teto de RPE em vez de
 * percentual. O teto é ERRO no levantamento de competição e AVISO nas variações
 * (o agacho com pausa do D5 é acessório por §10 e roda mais perto da falha).
 * A proibição de %1RM vale para todo o family: percentual de um máximo ainda
 * desconhecido não significa nada, seja no principal ou na variação.
 */
function checkCalibration(weeks, isCompetitionLift) {
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    if (!CALIBRATION_WEEKS.includes(week.weekNumber)) continue;
    const lift = liftOf(ex);
    if (!lift) continue;
    const where = at(week.weekNumber, dayNum, ex.exerciseId);
    const main = isCompetitionLift(ex, lift);
    const level = main ? fail : warn;

    // A proibição de %1RM na calibração é do papel que DESCOBRE a carga (top set
    // e back-off). Gauge e prática rodam em % do trainingMax provisório desde a
    // S2 de propósito (SPEC §4.2): o instrumento precisa de carga fixa para
    // medir, e prática a 65% não é extrapolação de máximo.
    const descobre = ex.role === 'forca' || ex.role === 'backoff' || ex.role === undefined;
    if (descobre && hasPercent(ex)) {
      fail('CALIBRAÇÃO', where,
        `papel "${ex.role ?? 'não declarado'}" com %1RM nas semanas 1–3 — a carga do top set e da back-off `
        + 'é descoberta por teto de RPE (design §11)');
    }
    const rpe = maxRpe(ex);
    if (rpe === null) {
      level('CALIBRAÇÃO', where, 'sem RPE prescrito na fase de calibração (design §11)');
      continue;
    }
    if (rpe > CALIBRATION_RPE_ABS_CAP && ex.role !== undefined) {
      level('CALIBRAÇÃO', where,
        `RPE ${rpe} acima do teto absoluto ${CALIBRATION_RPE_ABS_CAP} da calibração (design §11)`);
    }
  }
}

/**
 * Teto de percentual por papel de semana:
 *   bloco   92%   — design §10, papel "força" 88–92%
 *   taper   92,5% — design §11-B, Travis 2021: sessões pesadas finais 90–92,5%
 *   simulado —     isento: a tentativa vale ~100% do máximo atual (§11-B)
 *
 * Sem tolerância acima do teto: o programa é gerado, não digitado, então pode
 * ser exato. Tolerar 0,2 pp abriria precedente para 0,5 e depois 1,0, e o teto
 * deixaria de significar alguma coisa.
 */
function ceilingFor(kind) {
  if (kind === 'simulado') return null;
  if (kind === 'taper') return { limit: TAPER_MAX_PERCENT, fonte: 'design §11-B, Travis 2021: sessões pesadas finais 90–92,5%' };
  return { limit: MAX_PERCENT, fonte: 'design §10, papel "força" 88–92%' };
}

function checkPercentCeiling(weeks, kinds) {
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    const ceiling = ceilingFor(kinds.get(week.weekNumber));
    for (const p of percentsOf(ex)) {
      if (ceiling && p > ceiling.limit + 1e-9) {
        fail('CARGA', at(week.weekNumber, dayNum, ex.exerciseId),
          `${round(p * 100, 1)}% acima do teto de ${round(ceiling.limit * 100, 1)}% (${ceiling.fonte})`);
      }
      if (p <= 0 || p > 1.2) {
        fail('CARGA', at(week.weekNumber, dayNum, ex.exerciseId), `percentual implausível: ${p}`);
      }
    }
  }
}

/** Carga implícita do top set por levantamento por semana, contra a marca legal. */
function impliedTopLoads(weeks) {
  const table = [];
  for (const week of weeks) {
    const row = { weekNumber: week.weekNumber, week, isDeload: week.isDeload === true, top: {}, guard: {} };
    for (const day of week.days ?? []) {
      for (const ex of day.exercises ?? []) {
        const lift = liftOf(ex);
        if (!lift) continue;
        for (const p of percentsOf(ex)) {
          if (row.top[lift] == null || p > row.top[lift]) {
            row.top[lift] = p;
            // O guarda de arredondamento é do BLOCO, não do validador: sem ele a
            // carga implícita cai fora da grade de 2,5 kg e o teto de 92% é
            // violado em silêncio no supino (SPEC §3.7).
            row.guard[lift] = { guard: ex.roundGuard ?? 'nearest', step: ex.roundToKg ?? BAR_INCREMENT_KG };
          }
        }
      }
    }
    table.push(row);
  }
  return table;
}

/** Materializa % × trainingMax honrando o guarda declarado no bloco. */
function guardedKg(pct, tm, spec) {
  const step = spec?.step ?? BAR_INCREMENT_KG;
  const raw = pct * tm;
  if (spec?.guard === 'floor') return Math.floor(raw / step + 1e-9) * step;
  if (spec?.guard === 'ceiling') return Math.ceil(raw / step - 1e-9) * step;
  return Math.round(raw / step) * step;
}

function checkProgression(weeks, loads, kinds) {
  const workWeeks = weeks.filter((w) => !CALIBRATION_WEEKS.includes(w.weekNumber));

  // (a) semanas 4–18 precisam ter percentual nos três levantamentos
  for (const week of workWeeks) {
    const row = loads.find((r) => r.weekNumber === week.weekNumber);
    for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
      if (row?.top[lift] == null) {
        fail('CARGA', at(week.weekNumber), `${lift} sem %1RM prescrito fora da calibração (design §10/§11)`);
      }
    }
  }

  const summary = {};
  for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
    const ref = LEGAL_REFERENCE_KG[lift];
    // A progressão líquida é a do BLOCO: taper e simulado são descarga e teste,
    // não continuação da rampa (design §11-B). O guarda de teto fica junto para
    // que uma semana de treino fora do teto não contamine o número — ela já
    // falhou na checagem de teto.
    // A carga absoluta usa o trainingMax DA SEMANA quando o gerado o declara —
    // é o que faz a rampa capturar a re-ancoragem (design §13-C/C1). Sem esse
    // dado, cai no trainingMax inicial e a rampa mede só a parcela prescrita.
    const series = loads
      .filter((r) => r.top[lift] != null && kinds.get(r.weekNumber) === 'bloco' && r.top[lift] <= MAX_PERCENT + 1e-9)
      .map((r) => ({ ...r, pct: r.top[lift], kg: round(guardedKg(r.top[lift], trainingMaxFor(r.week, lift).kg, r.guard[lift]), 3) }));
    if (series.length < 2) continue;

    // (b) incremento realizável: a academia só monta múltiplos de 2,5 kg (design §0)
    const badSteps = [];
    const drops = [];
    for (let i = 1; i < series.length; i += 1) {
      const prev = series[i - 1];
      const cur = series[i];
      if (prev.isDeload || cur.isDeload) continue; // deload pode descer livremente
      const delta = round(cur.kg - prev.kg, 3);
      if (Math.abs(delta) <= KG_TOLERANCE) continue;
      const steps = delta / BAR_INCREMENT_KG;
      const off = Math.abs(steps - Math.round(steps)) * BAR_INCREMENT_KG;
      if (off > KG_TOLERANCE) badSteps.push({ week: cur.weekNumber, delta, from: prev.kg, to: cur.kg });
      if (delta < -KG_TOLERANCE) drops.push({ week: cur.weekNumber, delta });
    }
    if (badSteps.length) {
      const sample = badSteps.slice(0, 3)
        .map((s) => `S${s.week} ${s.from}→${s.to} (${s.delta > 0 ? '+' : ''}${s.delta} kg)`).join('; ');
      fail('PROGRESSÃO', weekList(badSteps.map((s) => s.week)),
        `${lift}: ${badSteps.length} incremento(s) implícito(s) sobre ${ref} kg fora da grade de ${BAR_INCREMENT_KG} kg `
        + `(design §0 — menor salto carregável na barra). Ex.: ${sample}`);
    }
    if (drops.length) {
      warn('PROGRESSÃO', weekList(drops.map((d) => d.week)),
        `${lift}: carga implícita cai em ${drops.length} transição(ões) sem semana marcada como deload`);
    }

    // aviso: carga implícita fora da grade de 2,5 kg (não é montável mesmo se o delta fecha)
    const offGrid = series.filter((p) => {
      const steps = p.kg / BAR_INCREMENT_KG;
      return Math.abs(steps - Math.round(steps)) * BAR_INCREMENT_KG > KG_TOLERANCE;
    });
    if (offGrid.length) {
      warn('PROGRESSÃO', weekList(offGrid.map((p) => p.weekNumber)),
        `${lift}: ${offGrid.length} semana(s) com carga implícita fora da grade de ${BAR_INCREMENT_KG} kg `
        + `(ex.: S${offGrid[0].weekNumber} ${round(offGrid[0].pct * 100, 1)}% × ${ref} kg = ${offGrid[0].kg} kg)`);
    }

    // (c) rampa de carga do bloco, e as âncoras absolutas contra o trainingMax
    const first = series[0];
    const last = series[series.length - 1];
    const ramp = (last.kg / first.kg - 1) * 100;
    const startPct = first.pct * 100;
    const endPct = last.pct * 100;
    const deficit = 100 - startPct;   // quanto abaixo do trainingMax o bloco começa
    const netGain = ramp - deficit;   // §11-A: "dos 7,5% subtrai-se os 5%"
    summary[lift] = { first, last, ramp: round(ramp, 2), startPct: round(startPct, 1), endPct: round(endPct, 1), deficit: round(deficit, 1), netGain: round(netGain, 2), ref };

    // Promovido de NOTA a AVISO: design §11-A projeta ~+2% de ganho líquido e o
    // entregue é negativo nos três levantamentos. Não é erro — é a consequência
    // aritmética de partir de ~85% do TM em vez dos ~95% de §11-A, e §1.1 do
    // markdown declara por escrito por que este atleta parte mais fundo (não
    // tem max out, deload nem corte de peso a recuperar). Mas é grande demais
    // para viver escondido numa linha de relatório.
    if (netGain < 0) {
      warn('RAMPA', lift,
        `ganho líquido ${round(netGain, 2)}% contra os ~+${BLOCK_RAMP_TARGET - 5}% que design §11-A projeta: o bloco começa a `
        + `${round(startPct, 1)}% do trainingMax, não aos ~95% da spec — reconciliação escrita em §1.1 do markdown`);
    }

    // Rampa e âncoras são AVISO, não erro (design §13-C/C1): elas são medidas
    // contra o trainingMax da semana 4 e dependem de re-ancoragem real, que é
    // adaptação medida e não prescrição. O que o programa prescreve é a parcela
    // abaixo; o resto tem que vir do gauge set subindo o trainingMax.
    const reanchorNeeded = ((1 + BLOCK_RAMP_TARGET / 100) / (1 + ramp / 100) - 1) * 100;
    if (ramp < BLOCK_RAMP_RANGE[0] || ramp > BLOCK_RAMP_RANGE[1]) {
      warn('PROGRESSÃO', `S${first.weekNumber}→S${last.weekNumber}`,
        `${lift}: rampa PRESCRITA de ${round(ramp, 2)}% fora da faixa ${BLOCK_RAMP_RANGE[0]}–${BLOCK_RAMP_RANGE[1]}% `
        + `(alvo ~${BLOCK_RAMP_TARGET}%, design §11-A) — fechar o alvo exige re-ancorar o trainingMax em `
        + `+${round(reanchorNeeded, 1)}% ao longo do bloco, que é medida do gauge set, não prescrição`);
    }
    if (startPct < BLOCK_START_RANGE[0] || startPct > BLOCK_START_RANGE[1]) {
      warn('PROGRESSÃO', `S${first.weekNumber}`,
        `${lift}: bloco começa em ${round(startPct, 1)}% do trainingMax inicial (${first.kg} kg de ${ref} kg), `
        + `fora de ${BLOCK_START_RANGE.join('–')}% (design §11-A)`);
    }
    if (endPct < BLOCK_END_RANGE[0] || endPct > BLOCK_END_RANGE[1]) {
      warn('PROGRESSÃO', `S${last.weekNumber}`,
        `${lift}: bloco termina em ${round(endPct, 1)}% do trainingMax INICIAL (${last.kg} kg de ${ref} kg), `
        + `fora de ${BLOCK_END_RANGE.join('–')}% (design §11-A) — só fecha com re-ancoragem durante o bloco`);
    }
  }
  return summary;
}

/**
 * design.md §13-C, C1 — os dois denominadores.
 *
 * O `trainingMax` por semana não existe no gerado, e não é omissão: o markdown
 * de origem (§2.2) grava que o app resolve a carga como `percentMin ×
 * trainingMax` do PERFIL, em runtime. Ou seja, o percentual guardado já é a
 * intensidade contra o `trainingMax` CORRENTE, seja ele qual for — é o
 * denominador do teto de 92%, e ele funciona sem dado novo.
 *
 * O denominador da rampa é outro: o `trainingMax` da semana 4. A trajetória do
 * `trainingMax` ao longo do bloco é DESCOBERTA pelo gauge set semanal (§2.3),
 * não prescrita — então o gerado não pode carregá-la sem virar previsão de
 * adaptação. O que dá para computar é a parcela PRESCRITA da rampa (a que
 * sobraria se o `trainingMax` não mudasse) e quanto de re-ancoragem falta para
 * fechar o alvo. É o que esta função reporta.
 *
 * Se algum dia o gerado passar a declarar `trainingMax` por semana, esta função
 * o usa: basta `week.trainingMax = { squat, bench, deadlift }`.
 */
function trainingMaxFor(week, lift) {
  const declared = week?.trainingMax?.[lift] ?? week?.trainingMax?.[{ squat: 'agacho', bench: 'supino', deadlift: 'terra' }[lift]];
  return typeof declared === 'number' && declared > 0
    ? { kg: declared, source: 'semana' }
    : { kg: LEGAL_REFERENCE_KG[lift], source: 'inicial' };
}

function trainingMaxIsPerWeek(weeks) {
  return weeks.some((w) => w.trainingMax && typeof w.trainingMax === 'object');
}

// ---------------------------------------------------------------------------
// Invariantes — simulado e taper (design §11-B)
// ---------------------------------------------------------------------------

/** Séries de trabalho da semana. */
function weekWorkingSets(week) {
  let sets = 0;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) sets += ex.sets ?? 0;
  }
  return sets;
}

/**
 * Volume-carga da semana (séries × reps × carga), que é a métrica que Travis
 * 2021 usa para a redução do taper — contagem de séries não serve, porque o
 * taper corta reps e carga junto.
 *
 * Só entram os blocos com percentual prescrito: acessório não carrega carga na
 * prescrição, então não há como computar tonelagem dele sem inventar número. A
 * cobertura (séries com carga / séries totais) sai no relatório para o número
 * ser lido com o denominador certo.
 */
function weekVolumeLoad(week) {
  let load = 0;
  let covered = 0;
  let total = 0;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      const sets = ex.sets ?? 0;
      total += sets;
      const lift = liftOf(ex);
      const reps = repsMin(ex.reps);
      const pcts = percentsOf(ex);
      if (!lift || !reps || !pcts.length) continue;
      load += sets * reps * Math.max(...pcts) * LEGAL_REFERENCE_KG[lift];
      covered += sets;
    }
  }
  return { load, covered, total };
}

/** Séries de acessório: tudo que não é agacho, supino ou terra. */
function weekAccessorySets(week) {
  let sets = 0;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) if (!liftOf(ex)) sets += ex.sets ?? 0;
  }
  return sets;
}

/**
 * Linha do tempo em dias absolutos. Cada sessão ocupa 1 dia mais os
 * `restDaysAfter` que ela declara — é o que torna "8 dias out" computável em vez
 * de declarado.
 */
function buildTimeline(weeks) {
  const sessions = [];
  let offset = 0;
  for (const week of weeks) {
    for (const [i, day] of (week.days ?? []).entries()) {
      sessions.push({ week: week.weekNumber, dayNum: (day.dayIndex ?? i) + 1, day, offset });
      offset += 1 + (day.restDaysAfter ?? 0);
    }
  }
  return sessions;
}

/**
 * design.md §11-B: dias entre a última sessão pesada de cada levantamento e o
 * simulado. "Pesado" = qualquer exposição ≥85% do trainingMax, com qualquer
 * número de séries — um single de abertura a 90,9% é exposição pesada para
 * efeito de cessação, mesmo que o documento o chame de ensaio.
 */
function checkCessation(weeks, kinds, timeline) {
  const simWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'simulado').map((w) => w.weekNumber);
  if (!simWeeks.length) return null;
  const simSession = [...timeline].reverse().find((s) => simWeeks.includes(s.week)
    && new Set((s.day.exercises ?? []).map(liftOf).filter(Boolean)).size === 3);
  if (!simSession) return null;

  const rows = [];
  for (const [lift, [lo, hi]] of Object.entries(LAST_HEAVY_RANGE_DAYS)) {
    const before = timeline.filter((s) => s.offset < simSession.offset);
    const heavy = before.filter((s) => (s.day.exercises ?? []).some((ex) => liftOf(ex) === lift
      && percentsOf(ex).some((p) => p >= HEAVY_SESSION_MIN_PERCENT)));
    const anyLoad = before.filter((s) => (s.day.exercises ?? []).some((ex) => liftOf(ex) === lift));
    const lastHeavy = heavy[heavy.length - 1];
    const lastAny = anyLoad[anyLoad.length - 1];

    const heavyDays = lastHeavy ? simSession.offset - lastHeavy.offset : null;
    const cessationDays = lastAny ? simSession.offset - lastAny.offset : null;
    rows.push({
      lift,
      heavyDays,
      cessationDays,
      lo,
      hi,
      heavyAt: lastHeavy ? `S${lastHeavy.week}D${lastHeavy.dayNum}` : '—',
      cessationAt: lastAny ? `S${lastAny.week}D${lastAny.dayNum}` : '—',
    });

    // Último pesado: AVISO. É janela de pico, e a evidência dá faixa, não ponto.
    if (heavyDays === null) {
      warn('CESSAÇÃO', at(), `${lift}: nenhuma sessão ≥${HEAVY_SESSION_MIN_PERCENT * 100}% antes do simulado`);
    } else if (heavyDays < lo || heavyDays > hi) {
      warn('CESSAÇÃO', at(lastHeavy.week, lastHeavy.dayNum),
        `${lift}: último pesado (≥${HEAVY_SESSION_MIN_PERCENT * 100}%) a ${heavyDays} dias do simulado, `
        + `fora da faixa ${lo}–${hi} (design §13-C/C2, Travis 2021)`);
    }
    // Cessação total: ERRO. Acima de 7 dias a força cai (Travis 2020).
    if (cessationDays !== null && cessationDays > CESSATION_MAX_DAYS) {
      fail('CESSAÇÃO', at(lastAny.week, lastAny.dayNum),
        `${lift}: cessação total de ${cessationDays} dias (última exposição de qualquer intensidade), `
        + `acima do teto de ${CESSATION_MAX_DAYS} (design §13-C/C2, Travis 2020: acima disso a força cai)`);
    }
  }
  return { simSession, rows };
}

/** design.md §11-B (Pritchard 2016): acessórios removidos ~2 semanas antes. */
function checkAccessoryCutoff(weeks, kinds) {
  const simWeek = weeks.find((w) => kinds.get(w.weekNumber) === 'simulado');
  if (!simWeek) return null;
  const tail = weeks.filter((w) => w.weekNumber > simWeek.weekNumber - ACCESSORY_CUTOFF_WEEKS
    && w.weekNumber <= simWeek.weekNumber);
  const rows = tail.map((w) => ({ week: w.weekNumber, sets: weekAccessorySets(w) }));
  const offenders = rows.filter((r) => r.sets > 0);
  if (offenders.length) {
    warn('TAPER', weekList(offenders.map((r) => r.week)),
      `acessórios ainda prescritos nas ${ACCESSORY_CUTOFF_WEEKS} semanas finais `
      + `(${offenders.map((r) => `S${r.week}: ${r.sets} séries`).join(', ')}) — design §11-B, Pritchard 2016: removidos ~${ACCESSORY_CUTOFF_WEEKS} semanas antes`);
  }
  return rows;
}

/**
 * Papel da sessão para um levantamento. Vem de dois campos ESTRUTURADOS do
 * gerado, nunca de prosa:
 *   1. `dayType` no formato `vb_<lift>_<papel>` — autoritativo para o
 *      levantamento principal do dia;
 *   2. `dayLabel`, nos segmentos "<Papel> de <Levantamento>" — para os demais.
 * Papéis fora de §10 (primário/secundário/terciário) devolvem null e a faixa
 * não é checada; a contagem deles sai no relatório.
 */
/**
 * O movimento de COMPETIÇÃO de cada levantamento, distinguido das variações: é o
 * exerciseId que carrega o maior percentual do bloco (só o de competição roda o
 * papel "força" a 88–92%). Não dá para usar `percentRef`, porque as variações
 * também o declaram — elas são prescritas contra o mesmo trainingMax.
 */
function competitionMovementIds(weeks, kinds) {
  const best = {};
  for (const { week, ex } of eachExercise(weeks)) {
    if (kinds.get(week.weekNumber) !== 'bloco') continue;
    const lift = liftOf(ex);
    if (!lift) continue;
    const top = Math.max(-1, ...percentsOf(ex));
    if (top < 0) continue;
    if (!best[lift] || top > best[lift].top) best[lift] = { id: ex.exerciseId, top };
  }
  return Object.fromEntries(Object.entries(best).map(([lift, v]) => [lift, v.id]));
}

const ROLE_WORDS = { forca: 'força', 'força': 'força', volume: 'volume', pratica: 'prática', 'prática': 'prática' };
const LABEL_LIFTS = { agacho: 'squat', supino: 'bench', terra: 'deadlift' };

function sessionRoleOf(day, lift) {
  const type = norm(day.dayType).match(/^vb_(squat|bench|deadlift)_(\w+)$/);
  if (type && type[1] === lift) {
    const role = { force: 'força', volume: 'volume', practice: 'prática', pratica: 'prática' }[type[2]];
    if (role) return role;
  }
  for (const segment of norm(day.dayLabel).split('+')) {
    const m = segment.match(/(forca|força|volume|pratica|prática)\s+de\s+(agacho|supino|terra)/);
    if (m && LABEL_LIFTS[m[2]] === lift) return ROLE_WORDS[m[1]];
  }
  return null;
}

/**
 * design.md §10: força 88–92%, volume 70–80%, prática 40–70%.
 * A faixa é conferida contra o TOPO do levantamento no dia — é o topo que define
 * o papel. Back-off e gauge set são, por construção, mais leves que a faixa
 * (§10: "single + back-offs"), e checá-los individualmente acusaria prescrição
 * correta.
 */
function checkRoleBands(weeks, kinds) {
  const offenders = new Map();
  let semPapel = 0;
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    const kind = kinds.get(week.weekNumber);
    if (kind === 'simulado' || kind === 'taper') continue;   // tentativa é medição
    if (!liftOf(ex)) continue;
    const pcts = percentsOf(ex);
    if (!pcts.length) continue;
    if (!ex.role) { semPapel += 1; continue; }
    const band = SESSION_ROLE_BANDS[ex.role];
    if (!band) continue;
    const reps = repsMin(ex.reps);
    if (ex.role === 'volume' && reps !== null
      && (reps < VOLUME_REP_WINDOW[0] || reps > VOLUME_REP_WINDOW[1])) continue;
    const top = Math.max(...pcts) * 100;
    if (top >= band[0] - 1e-9 && top <= band[1] + 1e-9) continue;
    const key = `${ex.exerciseId}|${ex.role}|${round(top, 1)}`;
    if (!offenders.has(key)) {
      offenders.set(key, { id: ex.exerciseId, role: ex.role, top: round(top, 1), band, weeks: [], dayNum });
    }
    offenders.get(key).weeks.push(week.weekNumber);
  }
  for (const o of offenders.values()) {
    fail('PAPEL', weekList([...new Set(o.weeks)]),
      `${o.id} no papel "${o.role}" (D${o.dayNum}): ${o.top}%, fora da faixa ${o.band[0]}–${o.band[1]}% `
      + `(SPEC §2 · design §10) — ${new Set(o.weeks).size} semana(s)`);
  }
  if (semPapel) {
    notes.push(`${semPapel} bloco(s) de S/B/D com %1RM e sem papel declarado — faixa não checada.`);
  }
}

/** Maior percentual prescrito na semana. */
function weekTopPercent(week) {
  let top = null;
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      for (const p of percentsOf(ex)) if (top === null || p > top) top = p;
    }
  }
  return top;
}

/**
 * O simulado roda no dia que tem os três levantamentos de competição. As três
 * tentativas de cada levantamento são os percentuais distintos daquele dia.
 */
function findSimulationDay(week) {
  let best = null;
  for (const [i, day] of (week.days ?? []).entries()) {
    const lifts = new Set((day.exercises ?? []).map(liftOf).filter(Boolean));
    if (lifts.size === 3) best = { day, dayNum: (day.dayIndex ?? i) + 1 };
  }
  return best;
}

function checkSimulation(weeks, kinds, isCompetitionLift) {
  for (const week of weeks) {
    if (kinds.get(week.weekNumber) !== 'simulado') continue;
    const found = findSimulationDay(week);
    if (!found) {
      warn('SIMULADO', at(week.weekNumber),
        'semana marcada como simulado mas nenhum dia reúne os três levantamentos de competição (design §11-B)');
      continue;
    }
    const { day, dayNum } = found;
    const where = at(week.weekNumber, dayNum);

    // "só os três de competição" — nada de acessório no dia do simulado.
    for (const ex of day.exercises ?? []) {
      const lift = liftOf(ex);
      if (!lift || !isCompetitionLift(ex, lift)) {
        fail('SIMULADO', at(week.weekNumber, dayNum, ex.exerciseId),
          `dia de simulado só comporta os três levantamentos de competição (design §11-B): "${ex.exerciseName}"`);
      }
    }

    for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
      const attempts = [...new Set(
        (day.exercises ?? [])
          .filter((ex) => liftOf(ex) === lift)
          .flatMap((ex) => percentsOf(ex)),
      )].sort((a, b) => a - b);

      if (attempts.length !== ATTEMPTS_PER_LIFT) {
        fail('SIMULADO', where,
          `${lift}: ${attempts.length} tentativa(s) distintas no simulado, esperado ${ATTEMPTS_PER_LIFT} (design §11-B)`
          + (attempts.length ? ` — ${attempts.map((p) => `${round(p * 100, 1)}%`).join(', ')}` : ''));
        continue;
      }

      const [a1, a2, a3] = attempts;
      // O piso de 96% é da TERCEIRA tentativa — é ela que diz se o dia é um
      // simulado. Não pode valer para as três: a própria §11-B põe a abertura em
      // ~91% da terceira, o que com terceira a 101% dá 91,9% de abertura. Exigir
      // 96% de todas contradiria a regra de seleção da mesma seção.
      if (a3 < SIMULATION_MIN_PERCENT) {
        warn('SIMULADO', where,
          `${lift}: terceira tentativa a ${round(a3 * 100, 1)}%, abaixo de ${SIMULATION_MIN_PERCENT * 100}% `
          + '— abaixo disso não é simulado (design §11-B)');
      }

      const steps = [
        ['abertura vs terceira', (a1 / a3) * 100, ATTEMPT_OPENER_PCT_OF_THIRD],
        ['segunda vs abertura', (a2 / a1) * 100, ATTEMPT_SECOND_STEP_PCT],
        ['terceira vs segunda', (a3 / a2) * 100, ATTEMPT_THIRD_STEP_PCT],
      ];
      for (const [name, actual, expected] of steps) {
        if (Math.abs(actual - expected) > ATTEMPT_TOLERANCE_PP) {
          fail('SIMULADO', where,
            `${lift}: ${name} em ${round(actual, 1)}%, esperado ${expected}% ±${ATTEMPT_TOLERANCE_PP} pp `
            + `(design §11-B; tentativas ${attempts.map((p) => `${round(p * 100, 1)}%`).join(' → ')})`);
        }
      }
    }
  }
}

/**
 * design.md §11-B (Travis 2020): taper de 1–2 semanas, volume −30 a −50% (faixa
 * que bate a de −50 a −70%), intensidade mantida ≥85% 1RM.
 */
function checkTaper(weeks, kinds) {
  const blockWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  const taperWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'taper');
  if (!taperWeeks.length || !blockWeeks.length) return null;

  const meanBlockLoad = blockWeeks.reduce((n, w) => n + weekVolumeLoad(w).load, 0) / blockWeeks.length;
  const meanBlockSets = blockWeeks.reduce((n, w) => n + weekWorkingSets(w), 0) / blockWeeks.length;
  const rows = [];
  for (const week of taperWeeks) {
    const { load, covered, total } = weekVolumeLoad(week);
    const sets = weekWorkingSets(week);
    const drop = round((1 - load / meanBlockLoad) * 100, 1);
    const setsDrop = round((1 - sets / meanBlockSets) * 100, 1);
    const top = weekTopPercent(week);
    rows.push({ week: week.weekNumber, sets, load, drop, setsDrop, top, covered, total });

    if (drop < TAPER_VOLUME_DROP_RANGE[0] || drop > TAPER_VOLUME_DROP_RANGE[1]) {
      fail('TAPER', at(week.weekNumber),
        `redução de VOLUME-CARGA de ${drop}% (${Math.round(load)} kg·rep contra média de ${Math.round(meanBlockLoad)} no bloco; `
        + `séries caem ${setsDrop}%, que é outra métrica), fora da faixa ${TAPER_VOLUME_DROP_RANGE.join('–')}% `
        + '— Travis 2021 mede volume-carga; Travis 2020: 30–50% supera 50–70% (design §11-B)');
    }
    if (top === null) {
      warn('TAPER', at(week.weekNumber), 'semana de taper sem percentual prescrito — intensidade não verificável');
    } else if (top < TAPER_MIN_INTENSITY) {
      warn('TAPER', at(week.weekNumber),
        `intensidade máxima de ${round(top * 100, 1)}%, abaixo do piso de ${TAPER_MIN_INTENSITY * 100}% do taper (design §11-B)`);
    }
  }
  return { meanBlockSets, meanBlockLoad, rows };
}

// ---------------------------------------------------------------------------
// Invariante de maior alavancagem: o bloco de metadados tem que bater com o
// computado. Metadado falso é pior que metadado ausente, porque dá garantia
// falsa — e uma promessa declarada só vale se alguém a recalcula.
// ---------------------------------------------------------------------------

/**
 * Cada chave declarada vira uma linha aqui, com o COMPARADOR explícito, porque
 * nem toda declaração é uma medição: umas são medida (`exact`), outras são
 * limite (`max`/`min`). Comparar um teto com `===` acusaria um programa correto
 * que simplesmente não encosta no teto.
 *
 * Chave declarada que não estiver nesta tabela é reportada como não recomputável
 * — assim a cobertura da checagem fica visível em vez de silenciosa.
 */
function declaredInvariantSpecs(ctx) {
  const { weeks, kinds } = ctx;
  const perWeekDays = [...new Set(weeks
    .filter((w) => kinds.get(w.weekNumber) === 'bloco' || kinds.get(w.weekNumber) === 'calibração')
    .map((w) => (w.days ?? []).length))];

  // SÓ o que é recomputável a partir do ARTEFATO. As 6 specs tautológicas
  // (comparar o declarado contra outra constante deste arquivo) foram apagadas
  // — davam cobertura falsa (SPEC §3.6 item 2). O resto das promessas vive em
  // ```restricoes``` e é conferido em checkGeneratedInvariants.
  return {
    semanas_total: { cmp: 'exact', value: weeks.length },
    semanas_calibracao: { cmp: 'exact', value: [...kinds.values()].filter((k) => k === 'calibração').length },
    sessoes_total: { cmp: 'exact', value: weeks.reduce((n, w) => n + (w.days?.length ?? 0), 0) },
    dias_por_semana_bloco: { cmp: 'exact', value: perWeekDays.length === 1 ? perWeekDays[0] : `variável (${perWeekDays.join('/')})` },
    // `incremento_minimo_barra_kg` SAIU: era comparado contra BAR_INCREMENT_KG,
    // uma constante deste mesmo arquivo — spec tautológica, exatamente a classe
    // que SPEC §3.6/2 mandou apagar, e que sobrevivia três linhas abaixo do
    // comentário que afirma que foram apagadas.
    //
    // As chaves abaixo são ENTRADAS declaradas: não são medições e não têm
    // contra o que ser comparadas. Ficam nomeadas aqui de propósito — assim
    // qualquer chave NOVA que apareça no markdown cai no ramo de FALHA de
    // cobertura em vez de sumir numa nota (SPEC §3.6/3).
    programa_id: { cmp: 'entrada' },
    semanas_bloco: { cmp: 'entrada' },
    incremento_minimo_barra_kg: { cmp: 'entrada' },
    tm_partida_agacho_kg: { cmp: 'entrada' },
    tm_partida_supino_kg: { cmp: 'entrada' },
    tm_partida_terra_kg: { cmp: 'entrada' },
    taper_dias: { cmp: 'entrada' },
  };
}

/**
 * Séries DIRETAS por semana de bloco para um músculo: séries de exercício em que
 * aquele músculo é o alvo principal (fração 1,0 e a maior do mapa). Trabalho em
 * que o músculo entra como sinergista não conta.
 */
function directSetsPerWeek(weeks, kinds, registry) {
  const blockWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  if (!blockWeeks.length) return {};
  const totals = {};
  for (const week of blockWeeks) {
    for (const day of week.days ?? []) {
      for (const ex of day.exercises ?? []) {
        const map = registry.getExercise(ex.exerciseId)?.muscleMap ?? {};
        const best = Math.max(0, ...Object.values(map));
        for (const [muscle, fraction] of Object.entries(map)) {
          if (fraction < 1 || fraction < best) continue;
          totals[muscle] = (totals[muscle] ?? 0) + (ex.sets ?? 0);
        }
      }
    }
  }
  for (const key of Object.keys(totals)) totals[key] = round(totals[key] / blockWeeks.length, 1);
  return totals;
}

/** Dias da semana em que cada levantamento aparece. */
function liftDayFrequency(week) {
  const out = { squat: 0, bench: 0, deadlift: 0 };
  for (const day of week.days ?? []) {
    for (const lift of new Set((day.exercises ?? []).map(liftOf).filter(Boolean))) out[lift] += 1;
  }
  return out;
}

/** Séries ≥80% em 1–5 reps por levantamento na semana (dose de força, §10). */
function forceDoseCounts(week) {
  const out = { squat: 0, bench: 0, deadlift: 0 };
  for (const day of week.days ?? []) {
    for (const ex of day.exercises ?? []) {
      const lift = liftOf(ex);
      if (!lift) continue;
      const top = Math.max(-1, ...percentsOf(ex));
      const r = repsMin(ex.reps);
      if (top >= FORCE_DOSE_MIN_PERCENT && r !== null && r >= 1 && r <= 5) out[lift] += ex.sets ?? 0;
    }
  }
  return out;
}

/**
 * Um valor declarado como "por semana" só é recomputável se for constante nas
 * semanas de bloco. Se variar, devolve null e a chave cai em não recomputável em
 * vez de acusar divergência contra uma média que ninguém declarou.
 */
function constantPerWeek(weeks, kinds, fn) {
  const blockWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  if (!blockWeeks.length) return {};
  const first = fn(blockWeeks[0]);
  const out = {};
  for (const key of Object.keys(first)) {
    const values = new Set(blockWeeks.map((w) => fn(w)[key]));
    out[key] = values.size === 1 ? first[key] : null;
  }
  return out;
}

/** O gauge set se identifica pela própria nota do programa. */
function gaugeSetSpec(weeks, kinds) {
  for (const { week, ex } of eachExercise(weeks)) {
    if (kinds.get(week.weekNumber) !== 'bloco') continue;
    if (!/gauge/.test(norm(`${ex.notes} ${ex.rawLabel}`))) continue;
    const pcts = percentsOf(ex);
    return { reps: repsMin(ex.reps), percent: pcts.length ? round(Math.max(...pcts) * 100, 1) : null };
  }
  return { reps: null, percent: null };
}

/** Abertura e segunda como % da terceira, no dia do simulado. */
function simulationAttemptRatios(weeks, kinds) {
  const week = weeks.find((w) => kinds.get(w.weekNumber) === 'simulado');
  if (!week) return null;
  const found = findSimulationDay(week);
  if (!found) return null;
  const ratios = [];
  for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
    const attempts = [...new Set((found.day.exercises ?? [])
      .filter((ex) => liftOf(ex) === lift).flatMap(percentsOf))].sort((a, b) => a - b);
    if (attempts.length === ATTEMPTS_PER_LIFT) {
      ratios.push({ opener: (attempts[0] / attempts[2]) * 100, second: (attempts[1] / attempts[2]) * 100 });
    }
  }
  if (!ratios.length) return null;
  const uniq = (key) => {
    const values = new Set(ratios.map((r) => round(r[key], 1)));
    return values.size === 1 ? [...values][0] : null;
  };
  return { openerPct: uniq('opener'), secondPct: uniq('second') };
}

function checkDeclaredInvariants(declared, ctx) {
  if (!declared || !Object.keys(declared).length) {
    notes.push('programa não exporta bloco de invariantes — checagem de metadado x realidade não rodou.');
    return null;
  }
  const specs = declaredInvariantSpecs(ctx);
  const naoRecomputavel = [];
  const entradasDeclaradas = [];
  const rows = [];

  for (const [key, rawDeclared] of Object.entries(declared)) {
    const spec = specs[key];
    if (spec?.cmp === 'entrada') { entradasDeclaradas.push(key); continue; }
    if (!spec || spec.skip) { naoRecomputavel.push(key); continue; }
    const declaredNum = Number(String(rawDeclared).replace(',', '.'));
    const computed = spec.value;
    if (computed === null || computed === undefined || Number.isNaN(declaredNum)) { naoRecomputavel.push(key); continue; }

    const tol = spec.tol ?? 1e-9;
    let ok;
    if (spec.cmp === 'max') ok = computed <= declaredNum + tol;
    else if (spec.cmp === 'min') ok = computed >= declaredNum - tol;
    else ok = typeof computed === 'number' ? Math.abs(computed - declaredNum) <= tol : String(computed) === String(rawDeclared);
    rows.push({ key, declared: rawDeclared, computed, cmp: spec.cmp, ok });

    if (!ok) {
      const relacao = spec.cmp === 'max' ? 'excede o teto declarado' : spec.cmp === 'min' ? 'fica abaixo do piso declarado' : 'diverge do declarado';
      fail('METADADO', key,
        `declarado ${rawDeclared}, computado ${typeof computed === 'number' ? round(computed, 2) : computed} — ${relacao} `
        + '(bloco `invariantes` do markdown de origem)');
    }
    if (spec.also !== undefined && spec.cmp === 'max' && Math.abs(declaredNum - spec.also) > 1e-9) {
      fail('METADADO', key, `declarado ${rawDeclared}, mas a invariante de desenho é ${spec.also} (design §10)`);
    }
  }

  if (entradasDeclaradas.length) {
    notes.push(`entradas declaradas (não são medições, não se comparam): ${entradasDeclaradas.join(', ')}`);
  }
  // SPEC §3.6/3: chave sem cobertura é FALHA, não nota. Uma chave nova que
  // ninguém recompute é exatamente o buraco que a camada existe para fechar.
  for (const key of naoRecomputavel) {
    fail('COBERTURA', key,
      'chave declarada em `entradas` sem recomputação nem declaração explícita de entrada em declaredInvariantSpecs');
  }
  return { rows, naoRecomputavel: entradasDeclaradas };
}

// ---------------------------------------------------------------------------
// Invariantes — segurança e restrições do atleta
// ---------------------------------------------------------------------------

/**
 * Restrições de equipamento e de variável técnica dependem só da IDENTIDADE do
 * exercício, não da semana — então são apuradas uma vez por exercício distinto e
 * reportadas com a primeira ocorrência e a contagem. Um exercício proibido que
 * aparece 36 vezes é um problema, não 36.
 */
function checkConstraints(weeks, registry) {
  const distinct = new Map();
  for (const { week, dayNum, ex } of eachExercise(weeks)) {
    const key = `${ex.exerciseId}|${ex.exerciseName}`;
    if (!distinct.has(key)) distinct.set(key, { ex, first: at(week.weekNumber, dayNum, ex.exerciseId), count: 0 });
    distinct.get(key).count += 1;
  }

  for (const { ex, first, count } of distinct.values()) {
    const hay = `${norm(ex.exerciseId)} ${norm(ex.exerciseName)} ${norm(ex.rawLabel)}`;
    const where = `${first} (×${count})`;
    const lift = liftOf(ex);

    for (const [pattern, label] of ABSENT_EQUIPMENT) {
      if (pattern.test(hay)) fail('EQUIPAMENTO', where, `${label} — "${ex.exerciseName}"`);
    }
    if (FIXED_HEIGHT_FAIL.test(hay)) {
      fail('EQUIPAMENTO', where, `altura fixa em suporte — design §3 tirou pin/box/Anderson do programa ("${ex.exerciseName}")`);
    }
    if (FIXED_HEIGHT_WARN.test(hay)) {
      warn('EQUIPAMENTO', where, `altura fixa em suporte não nomeada em §3 ("${ex.exerciseName}") — confirmar intenção`);
    }
    if (lift && ACCOMMODATING_RESISTANCE.test(hay)) {
      fail('EQUIPAMENTO', where, 'banda/corrente em levantamento principal — design §10: "Zero [elites] usam bandas ou correntes"');
    }
    if (lift === 'bench' && BENCH_GRIP_CHANGE.test(hay)) {
      fail('VARIÁVEL TÉCNICA', where, `mudança de pegada de supino em "${ex.exerciseName}" — a cota do supino no bloco é a pausa (design §4)`);
    }
    if (lift === 'deadlift' && DEADLIFT_STYLE_CHANGE.test(hay)) {
      fail('VARIÁVEL TÉCNICA', where, `troca de estilo de terra em "${ex.exerciseName}" — sumo permanece no bloco (design §4, R172)`);
    }
    // Máquina fora do inventário: aviso, porque o inventário nomeia categorias
    // ("máquinas de puxada") e não modelos.
    if (registry.getExercise(ex.exerciseId)?.equipment === 'machine' && !ALLOWED_MACHINE.test(hay)) {
      warn('EQUIPAMENTO', where, `máquina não coberta pelo inventário (leg press 45°/vertical, mesa flexora, máquinas de puxada): "${ex.exerciseName}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Invariante — orçamento de sessão
// ---------------------------------------------------------------------------

/**
 * Motor de tempo de SPEC §1.1, idêntico ao do gerador:
 *   8 min de aquecimento geral + 1,50 min por série de aquecimento
 *   + 0,75 min por série de trabalho + descanso ENTRE séries do mesmo bloco
 *   + transição entre exercícios (1 min de troca de aparelho MAIS o descanso
 *     exigido pelo exercício que ENTRA).
 * Lê `restSecMax`: enquanto o gerado guardava só o piso de "1-2 MIN", o
 * validador nunca enxergava o estouro (SPEC §1.1, achado colateral).
 *
 * Duas correções contra o motor anterior, que dava crédito de tempo indevido:
 * ele cobrava descanso DEPOIS da última série de cada exercício (em D1, com 9
 * exercícios, ~18,5 min sentado que ninguém faz) e cobrava ZERO por 8
 * transições. O saldo é o oposto do que parece: a sessão fica MAIS LONGA, e a
 * margem de D1 contra o teto de 100 min é de ~1 min, não de 6.
 */
const TIME_BASE_SEC = 8 * 60;
const TIME_WARMUP_SEC = 90;
const TIME_SET_EXEC_SEC = 45;
const TIME_TRANSITION_SEC = 60;

function estimateSessionSeconds(day) {
  let total = TIME_BASE_SEC;
  const restOf = (ex) => ex.restSecMax ?? ex.restSec ?? DEFAULT_REST_SEC;
  (day.exercises ?? []).forEach((ex, i) => {
    total += (ex.warmupSets ?? 0) * TIME_WARMUP_SEC;
    const sets = ex.sets ?? 0;
    total += sets * TIME_SET_EXEC_SEC + Math.max(0, sets - 1) * restOf(ex);
    if (i > 0) total += TIME_TRANSITION_SEC + restOf(ex);
  });
  return total;
}

function checkSessionBudget(weeks, kinds) {
  const durations = [];
  for (const week of weeks) {
    // O orçamento de 75–100 min é o da sessão de treino (design §0). Um simulado
    // roda no tempo do meet, com comando e espera entre tentativas.
    const isSim = kinds.get(week.weekNumber) === 'simulado';
    for (const [i, day] of (week.days ?? []).entries()) {
      const minutes = round(estimateSessionSeconds(day) / 60, 1);
      const dayNum = (day.dayIndex ?? i) + 1;
      durations.push({ week: week.weekNumber, dayNum, dayLabel: day.dayLabel, minutes });
      if (isSim) continue;
      const isTaper = kinds.get(week.weekNumber) === 'taper';
      if (!isTaper && minutes < SESSION_MINUTES_FLOOR) {
        fail('ORÇAMENTO', at(week.weekNumber, dayNum),
          `sessão estimada em ${minutes} min, abaixo do piso de ${SESSION_MINUTES_FLOOR} min (design §0)`);
      }
      if (minutes > SESSION_MINUTES_FAIL) {
        fail('ORÇAMENTO', at(week.weekNumber, dayNum), `sessão estimada em ${minutes} min, acima do teto de ${SESSION_MINUTES_FAIL} min (design §0)`);
      } else if (minutes > SESSION_MINUTES_WARN) {
        warn('ORÇAMENTO', at(week.weekNumber, dayNum), `sessão estimada em ${minutes} min, acima de ${SESSION_MINUTES_WARN} min`);
      }
    }
  }
  return durations;
}

// ---------------------------------------------------------------------------
// Relatórios (não falham)
// ---------------------------------------------------------------------------

function renderTable(headers, rows) {
  const all = [headers, ...rows].map((r) => r.map((c) => String(c ?? '')));
  const widths = headers.map((_, i) => Math.max(...all.map((r) => (r[i] ?? '').length)));
  const line = (cells) => cells.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join('  ');
  return [line(all[0]), widths.map((w) => '─'.repeat(w)).join('  '), ...all.slice(1).map(line)].join('\n');
}

/**
 * Uma linha por semana: papel, percentual máximo prescrito e o mesmo percentual
 * já convertido em kg contra a marca legal (215/160/240, baseline.md §6). É a
 * tabela de revisão semanal — "S12, agacho, 88% = 189,2 kg" sem fazer conta.
 */
function weekChainTable(weeks, kinds) {
  const rows = weeks.map((week) => {
    const top = weekTopPercent(week);
    const cell = (lift) => {
      let best = null;
      for (const day of week.days ?? []) {
        for (const ex of day.exercises ?? []) {
          if (liftOf(ex) !== lift) continue;
          for (const p of percentsOf(ex)) if (best === null || p > best) best = p;
        }
      }
      if (best === null) return '—';
      return `${round(best * 100, 1)}% = ${round(best * trainingMaxFor(week, lift).kg, 1)} kg`;
    };
    return [
      `S${week.weekNumber}`,
      kinds.get(week.weekNumber),
      top === null ? '—' : `${round(top * 100, 1)}%`,
      cell('squat'), cell('bench'), cell('deadlift'),
      weekWorkingSets(week),
    ];
  });
  return renderTable(
    ['semana', 'papel', '%máx', `agacho /${LEGAL_REFERENCE_KG.squat}`, `supino /${LEGAL_REFERENCE_KG.bench}`, `terra /${LEGAL_REFERENCE_KG.deadlift}`, 'séries'],
    rows,
  );
}

function liftVolumeTable(weeks) {
  const headers = ['levantamento', ...weeks.map((w) => `S${w.weekNumber}`), 'total'];
  const rows = [];
  for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
    const cells = weeks.map((week) => {
      let sets = 0;
      for (const day of week.days ?? []) {
        for (const ex of day.exercises ?? []) if (liftOf(ex) === lift) sets += ex.sets ?? 0;
      }
      return sets;
    });
    rows.push([lift, ...cells, cells.reduce((a, b) => a + b, 0)]);
  }
  return renderTable(headers, rows);
}

function forceDoseTable(weeks) {
  const headers = ['séries ≥80% × 1–5 reps', ...weeks.map((w) => `S${w.weekNumber}`)];
  const rows = [];
  for (const lift of Object.keys(EXPECTED_FREQUENCY)) {
    const cells = weeks.map((week) => {
      let sets = 0;
      for (const day of week.days ?? []) {
        for (const ex of day.exercises ?? []) {
          if (liftOf(ex) !== lift) continue;
          const top = Math.max(-1, ...percentsOf(ex));
          const r = repsMin(ex.reps);
          if (top >= FORCE_DOSE_MIN_PERCENT && r !== null && r >= 1 && r <= 5) sets += ex.sets ?? 0;
        }
      }
      return sets;
    });
    const off = weeks
      .map((week, i) => ({ week: week.weekNumber, n: cells[i] }))
      .filter(({ week, n }) => !CALIBRATION_WEEKS.includes(week) && (n < FORCE_DOSE_RANGE[0] || n > FORCE_DOSE_RANGE[1]));
    if (off.length) {
      const counts = [...new Set(off.map((o) => o.n))].sort((a, b) => a - b).join('/');
      warn('DOSE', weekList(off.map((o) => o.week)),
        `${lift}: ${off.length} semana(s) com ${counts} série(s) ≥80% em 1–5 reps, fora da faixa ${FORCE_DOSE_RANGE.join('–')} (design §10, Pak)`);
    }
    rows.push([lift, ...cells]);
  }
  return renderTable(headers, rows);
}

function muscleVolumeTable(weeks, prescribedWeeklyVolume) {
  const perWeek = weeks.map((w) => prescribedWeeklyVolume(w));
  const muscles = [...new Set(perWeek.flatMap((v) => Object.keys(v)))];
  muscles.sort((a, b) => {
    const sum = (m) => perWeek.reduce((n, v) => n + (v[m] ?? 0), 0);
    return sum(b) - sum(a);
  });
  const headers = ['grupo muscular', ...weeks.map((w) => `S${w.weekNumber}`), 'média'];
  const rows = muscles.map((m) => {
    const cells = perWeek.map((v) => round(v[m] ?? 0, 1));
    const mean = round(cells.reduce((a, b) => a + b, 0) / cells.length, 1);
    return [m, ...cells, mean];
  });
  return renderTable(headers, rows);
}

/**
 * DIRETA x PONDERADA lado a lado, por músculo e com NOMES DISTINTOS (SPEC §1.5).
 * As duas contagens existiam, mas em tabelas separadas e sem o par explícito —
 * e é exatamente aí que nasce a confusão entre R4, R5 e §10-B ("o posterior é
 * servido de graça pela remada" era justificativa escrita contra um muscleMap
 * que não dá crédito nenhum de posterior à remada nem à puxada aberta).
 * Direta = fração 1,0 no mapa; ponderada = soma das frações (indireta vale 0,5,
 * Pelland 2025 / Mannarino 0,47).
 */
function directVsWeightedTable(weeks, kinds, registry) {
  const blockWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco');
  if (!blockWeeks.length) return null;
  const direta = {};
  const ponderada = {};
  for (const week of blockWeeks) {
    for (const day of week.days ?? []) {
      for (const ex of day.exercises ?? []) {
        const map = registry.getExercise(ex.exerciseId)?.muscleMap ?? {};
        for (const [muscle, fraction] of Object.entries(map)) {
          ponderada[muscle] = (ponderada[muscle] ?? 0) + (ex.sets ?? 0) * fraction;
          if (fraction >= 1) direta[muscle] = (direta[muscle] ?? 0) + (ex.sets ?? 0);
        }
      }
    }
  }
  const n = blockWeeks.length;
  const muscles = [...new Set([...Object.keys(direta), ...Object.keys(ponderada)])]
    .sort((a, b) => (ponderada[b] ?? 0) - (ponderada[a] ?? 0));
  const rows = muscles.map((m) => [m, round((direta[m] ?? 0) / n, 1), round((ponderada[m] ?? 0) / n, 1)]);
  return renderTable(['músculo', 'séries_diretas/semana', 'séries_ponderadas/semana'], rows);
}

/** design.md §5: high bar a ~50% do volume de agachamento. Só reporta. */
function highBarShare(weeks) {
  let high = 0;
  let squat = 0;
  for (const { ex } of eachExercise(weeks)) {
    if (liftOf(ex) !== 'squat') continue;
    squat += ex.sets ?? 0;
    if (/high[\s_-]?bar/.test(`${norm(ex.exerciseId)} ${norm(ex.exerciseName)}`)) high += ex.sets ?? 0;
  }
  if (!squat) return null;
  const share = round((high / squat) * 100, 1);
  if (high === 0) warn('DOSE', '—', 'nenhum agachamento high bar no bloco — design §5 chama de "único item fixo obrigatório"');
  else if (share < 30 || share > 70) warn('DOSE', '—', `high bar em ${share}% do volume de agachamento; design §5 pede ~50%`);
  return share;
}

/**
 * Séries DIRETAS por semana, pela etiqueta autoral `countsAs` de cada linha do
 * programa (SPEC §1.5). NÃO é inferida do mapa muscular: inferir faria a remada
 * creditar deltoide posterior e o terra creditar costas, e aí adicionar costas
 * subiria os dois lados do comparativo de R4 ao mesmo tempo. A contagem
 * PONDERADA (mapa muscular, crédito indireto 0,5) sai na tabela de volume por
 * grupo, com nome distinto — confundir as duas é a origem de metade das
 * discordâncias entre R4, R5 e §10-B.
 */
function directLabelTable(weeks, kinds) {
  const blockWeeks = weeks.filter((w) => kinds.get(w.weekNumber) === 'bloco' || kinds.get(w.weekNumber) === 'calibração');
  if (!blockWeeks.length) return null;
  const totals = new Map();
  for (const week of blockWeeks) {
    for (const day of week.days ?? []) {
      for (const ex of day.exercises ?? []) {
        if (!ex.countsAs) continue;
        const cur = totals.get(ex.countsAs) ?? [];
        cur.push({ week: week.weekNumber, sets: ex.sets ?? 0 });
        totals.set(ex.countsAs, cur);
      }
    }
  }
  if (!totals.size) return null;
  const rows = [...totals.entries()].map(([grupo, entries]) => {
    const perWeek = new Map();
    for (const e of entries) perWeek.set(e.week, (perWeek.get(e.week) ?? 0) + e.sets);
    const values = [...perWeek.values()];
    return [grupo, String(Math.min(...values)), String(Math.max(...values))];
  }).sort((a, b) => Number(b[2]) - Number(a[2]));
  return renderTable(['grupo (etiqueta conta_direta)', 'mín/semana', 'máx/semana'], rows);
}

function classificationTable(weeks) {
  const map = new Map();
  for (const { ex } of eachExercise(weeks)) {
    const key = ex.exerciseId;
    if (!map.has(key)) map.set(key, { name: ex.exerciseName, lift: liftOf(ex), sets: 0 });
    map.get(key).sets += ex.sets ?? 0;
  }
  const rows = [...map.entries()]
    .sort((a, b) => b[1].sets - a[1].sets)
    .map(([id, v]) => [id, v.name, v.lift ?? 'acessório', v.sets]);
  return renderTable(['exerciseId', 'nome', 'classificado como', 'séries'], rows);
}

// ---------------------------------------------------------------------------
// Saída
// ---------------------------------------------------------------------------

function printReport({ path, how, weeks, durations, progression, share, tables }) {
  const errors = violations.filter((v) => v.level === 'ERRO');
  const warns = violations.filter((v) => v.level === 'AVISO');
  const sessions = weeks.reduce((n, w) => n + (w.days?.length ?? 0), 0);
  const blocks = [...eachExercise(weeks)].length;

  console.log('═'.repeat(78));
  console.log('VALIDAÇÃO DO PROGRAMA — invariantes de design.md (verification.md, Camada 1)');
  console.log('═'.repeat(78));
  console.log(`Arquivo : ${path}`);
  console.log(`Leitura : ${how}`);
  console.log(`Programa: ${weeks.length} semanas · ${sessions} sessões · ${blocks} blocos de prescrição`);
  console.log(`Estado  : ${errors.length} erro(s) · ${warns.length} aviso(s)`);
  for (const n of notes) console.log(`Nota    : ${n}`);
  console.log('');

  if (violations.length) {
    const byCategory = new Map();
    for (const v of violations) {
      if (!byCategory.has(v.category)) byCategory.set(v.category, []);
      byCategory.get(v.category).push(v);
    }
    for (const [category, list] of byCategory) {
      const e = list.filter((v) => v.level === 'ERRO').length;
      console.log(`── ${category} (${e} erro(s), ${list.length - e} aviso(s)) ${'─'.repeat(Math.max(0, 50 - category.length))}`);
      for (const v of list) console.log(`  ${v.level === 'ERRO' ? '✗' : '!'} ${v.level}  ${v.where}  ${v.message}`);
      console.log('');
    }
  } else {
    console.log('Nenhuma violação.\n');
  }

  console.log('── RAMPA DE CARGA DO BLOCO (contra o trainingMax INICIAL, design §11-A/§13-C) ──');
  if (Object.keys(progression).length === 0) {
    console.log('  (sem percentuais prescritos — nada a calcular)');
  } else {
    for (const [lift, p] of Object.entries(progression)) {
      console.log(`  ${lift.padEnd(9)} TM ${String(p.ref).padStart(3)} kg · início S${p.first.weekNumber} ${p.first.kg} kg (${p.startPct}%) → `
        + `fim S${p.last.weekNumber} ${p.last.kg} kg (${p.endPct}%)`);
      console.log(`  ${' '.repeat(9)} rampa ${p.ramp > 0 ? '+' : ''}${p.ramp}% [alvo ~${BLOCK_RAMP_TARGET}%, faixa ${BLOCK_RAMP_RANGE.join('–')}%] · `
        + `déficit inicial ${p.deficit}% · ganho líquido ${p.netGain > 0 ? '+' : ''}${p.netGain}% (rampa − déficit, design §11-A)`);
    }
  }
  console.log('');

  if (tables.cessation) {
    console.log('── CESSAÇÃO — duas métricas distintas (design §13-C/C2) ───────────────────');
    console.log(`  ${'lift'.padEnd(9)} último pesado ≥${HEAVY_SESSION_MIN_PERCENT * 100}%      cessação total (teto ${CESSATION_MAX_DAYS} d)`);
    for (const r of tables.cessation.rows) {
      console.log(`  ${r.lift.padEnd(9)} ${String(r.heavyDays ?? '—').padStart(2)} dias (${r.heavyAt}) [faixa ${r.lo}–${r.hi}]`
        + `   ${String(r.cessationDays ?? '—').padStart(2)} dias (${r.cessationAt})`);
    }
    console.log('');
  }
  if (tables.metadata) {
    const bad = tables.metadata.rows.filter((r) => !r.ok);
    console.log('── METADADO DECLARADO x COMPUTADO ────────────────────────────────────────');
    console.log(`  ${tables.metadata.rows.length} invariante(s) recomputada(s), ${bad.length} divergente(s), `
      + `${tables.metadata.naoRecomputavel.length} não recomputável(is)`);
    for (const r of bad) console.log(`  ✗ ${r.key}: declarado ${r.declared} · computado ${typeof r.computed === 'number' ? round(r.computed, 2) : r.computed}`);
    console.log('');
  }

  console.log('── ENCADEAMENTO POR SEMANA (percentual máximo prescrito) ──────────────────');
  console.log(tables.weekChain);
  if (tables.taper) {
    console.log(`\n  média nas semanas de bloco: ${round(tables.taper.meanBlockSets, 1)} séries · ${Math.round(tables.taper.meanBlockLoad)} kg·rep de volume-carga`);
    for (const r of tables.taper.rows) {
      console.log(`  taper S${r.week}: volume-carga −${r.drop}% (séries −${r.setsDrop}%, cobertura ${r.covered}/${r.total} séries) · intensidade máx `
        + `${r.top === null ? '—' : `${round(r.top * 100, 1)}%`} `
        + `[alvo: −${TAPER_VOLUME_DROP_RANGE.join(' a −')}%, intensidade ${TAPER_MIN_INTENSITY * 100}–${round(TAPER_MAX_PERCENT * 100, 1)}%]`);
    }
  }
  console.log('');

  const sorted = [...durations].sort((a, b) => a.minutes - b.minutes);
  if (sorted.length) {
    const median = sorted[Math.floor(sorted.length / 2)].minutes;
    console.log('── ORÇAMENTO DE SESSÃO (estimativa: 45 s/série, 30 s/aquecimento, descanso prescrito) ──');
    console.log(`  min ${sorted[0].minutes} min · mediana ${median} min · max ${sorted[sorted.length - 1].minutes} min `
      + `(S${sorted[sorted.length - 1].week} D${sorted[sorted.length - 1].dayNum})`);
    console.log('');
  }

  console.log('── CLASSIFICAÇÃO DOS EXERCÍCIOS (confira: erro aqui contamina frequência e volume) ──');
  console.log(tables.classification);
  console.log('');
  console.log('── SÉRIES DE TRABALHO POR LEVANTAMENTO POR SEMANA ────────────────────────');
  console.log(tables.liftVolume);
  console.log('');
  console.log('── DOSE DE FORÇA (design §10: 3–6 séries ≥80% em 1–5 reps por semana) ─────');
  console.log(tables.forceDose);
  if (share !== null) console.log(`\n  high bar = ${share}% do volume de agachamento (design §5 pede ~50%)`);
  console.log('');
  console.log('── VOLUME POR GRUPO MUSCULAR POR SEMANA (prescribedWeeklyVolume) ─────────');
  if (tables.directLabels) {
    if (tables.directVsWeighted) {
      console.log('\n── DIRETA x PONDERADA POR MÚSCULO (nomes distintos, SPEC §1.5) ────────────');
      console.log(tables.directVsWeighted);
    }
    console.log('\n── SÉRIES DIRETAS POR ETIQUETA `conta_direta` (semanas de bloco) ──────────');
    console.log(tables.directLabels);
  }
  console.log(tables.muscleVolume);
  console.log('');
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  quietExperimentalWarnings();
  installTsLoader();

  const arg = process.argv.slice(2).find((a) => !a.startsWith('-'));
  const path = arg ? resolvePath(process.cwd(), arg) : findProgram();

  if (!path || !existsSync(path)) {
    const onde = arg ? path : 'nenhum src/data/program/<dir com "vena">/generated.ts encontrado';
    console.log(`validate-program: programa ainda não gerado (${onde}). Nada a validar.`);
    process.exit(0);
  }

  const registry = await loadRegistry();
  REGISTRY = registry;
  const volume = await import(pathToFileURL(join(ROOT, 'src/domain/volumeTargets.ts')).href);
  const dayTypes = readDayTypes();
  const { weeks, how, mod } = await loadProgram(path);

  const kinds = classifyWeeks(weeks);
  WEEK_KINDS = kinds;
  const entradas = mod?.VENA_BLOCK1_ENTRADAS;
  if (entradas?.tm_partida_agacho_kg) {
    LEGAL_REFERENCE_KG = {
      squat: Number(entradas.tm_partida_agacho_kg),
      bench: Number(entradas.tm_partida_supino_kg),
      deadlift: Number(entradas.tm_partida_terra_kg),
    };
  }
  const isCompetitionLift = competitionLiftDetector(weeks, registry);
  const timeline = buildTimeline(weeks);
  const markdown = loadSourceMarkdown(path);

  notes.push(trainingMaxIsPerWeek(weeks)
    ? 'trainingMax por semana presente no gerado — teto de 92% conferido contra o trainingMax da semana corrente.'
    : 'trainingMax por semana ausente (o gerado guarda intensidade relativa ao trainingMax corrente do perfil, '
      + 'design §13-C/C1): teto de 92% confere direto; rampa e âncoras usam o trainingMax inicial e saem como aviso.');
  checkStructure(weeks, registry, dayTypes);
  checkFrequency(weeks, kinds);
  checkCalibration(weeks, isCompetitionLift);
  checkPercentCeiling(weeks, kinds);
  const progression = checkProgression(weeks, impliedTopLoads(weeks), kinds);
  checkSimulation(weeks, kinds, isCompetitionLift);
  const taper = checkTaper(weeks, kinds);
  const cessation = checkCessation(weeks, kinds, timeline);
  const accessoryTail = checkAccessoryCutoff(weeks, kinds);
  checkRoleBands(weeks, kinds);
  checkConstraints(weeks, registry);
  const durations = checkSessionBudget(weeks, kinds);
  const share = highBarShare(weeks);
  const schemes = checkSchemeCoherence(markdown, weeks, kinds);
  checkGeneratedInvariants(mod);
  recheckVenaInvariants(weeks, kinds);

  // Metadado declarado x realidade computada.
  const declared = (markdown && parseDeclaredInvariants(markdown.text))
    ?? Object.entries(mod ?? {}).map(([, v]) => v).find((v) => v && typeof v === 'object' && 'programa_id' in v)
    ?? null;
  const metadata = checkDeclaredInvariants(declared, {
    weeks,
    kinds,
    freq: constantPerWeek(weeks, kinds, (week) => liftDayFrequency(week)),
    forceDose: constantPerWeek(weeks, kinds, (week) => forceDoseCounts(week)),
    directSets: directSetsPerWeek(weeks, kinds, registry),
    gauge: gaugeSetSpec(weeks, kinds),
    simulado: simulationAttemptRatios(weeks, kinds),
    lastSessionDaysOut: cessation
      ? cessation.simSession.offset - (timeline[timeline.indexOf(cessation.simSession) - 1]?.offset ?? cessation.simSession.offset)
      : null,
    taper,
    cessation,
    progression,
  });

  // As tabelas são montadas ANTES do relatório: algumas delas também emitem
  // avisos (dose de força), e eles precisam entrar no sumário e na contagem.
  const tables = {
    weekChain: weekChainTable(weeks, kinds),
    taper,
    cessation,
    metadata,
    accessoryTail,
    schemes,
    classification: classificationTable(weeks),
    liftVolume: liftVolumeTable(weeks),
    forceDose: forceDoseTable(weeks),
    muscleVolume: muscleVolumeTable(weeks, volume.prescribedWeeklyVolume),
    directLabels: directLabelTable(weeks, kinds),
    directVsWeighted: directVsWeightedTable(weeks, kinds, registry),
  };

  printReport({ path, how, weeks, durations, progression, share, tables });

  const errors = violations.filter((v) => v.level === 'ERRO').length;
  if (errors) {
    console.error(`validate-program: ${errors} violação(ões) de invariante. Corrija o markdown de origem e regenere.`);
    process.exit(1);
  }
  console.log('validate-program: OK — todas as invariantes verificáveis passaram.');
}

main().catch((err) => {
  console.error(`validate-program: falha ao executar — ${err.stack ?? err.message}`);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// NÃO VERIFICÁVEL — invariantes de design.md que não viram checagem determinística.
// Listadas aqui de propósito: inventar a regra seria pior do que não checá-la.
//
// NÃO VERIFICÁVEL: "ride the line" (design §14) — o conceito é claro mas está
//   operacionalmente indefinido em todo o corpus: nenhuma amplitude, % ou
//   periodicidade. Não há número contra o qual comparar.
// NÃO VERIFICÁVEL: halteres até 40 kg — a prescrição carrega séries/reps/RPE, não
//   carga absoluta de halter. O teto de 40 kg só é conferível no log de execução.
// NÃO VERIFICÁVEL: "SBD a 2–4 RIR por percentual; acessório a 0–1 RIR" (design §10)
//   — conflita com o próprio papel "força" (single a 88–92% ≈ 0–1 RIR). A regra é
//   ambígua na fonte; checá-la produziria falha em prescrição correta.
// NÃO VERIFICÁVEL: dose do stiff-legged (design §6) — a fonte dá dois números
//   incompatíveis (20–25% do volume de terra, R88; e 1 série nos dias secundários
//   = 1/6, precedente pessoal) e decide por "dose mínima", sem fixar o valor.
// NÃO VERIFICÁVEL: protocolo de vídeo (design §8) e o vídeo de trás a 45° da
//   semana 1 — são instruções de coleta, não campos de PrescribedWeek.
// NÃO VERIFICÁVEL: correções de SETUP (design §4): reduzir os ~11 s de lockout no
//   supino, teste sem peso para abertura de pé, pausa de competição real ~1 s,
//   reset sem touch-and-go no terra. Vivem em `notes`/texto livre; qualquer
//   checagem viraria busca de substring frágil.
// NÃO VERIFICÁVEL: nutrição (§9), aritmética de peso corporal (§12) e cardio (§13)
//   — fora do modelo PrescribedWeek.
// NÃO VERIFICÁVEL: "uma variável técnica por levantamento" na forma geral (§4). O
//   que é checável é o caso nomeado — pegada de supino e estilo de terra — e é o
//   que este arquivo checa. Detectar uma variável técnica NOVA e não prevista
//   exigiria entender a intenção do exercício, o que é julgamento, não invariante.
// ---------------------------------------------------------------------------
