#!/usr/bin/env node
/**
 * Gera src/data/program/vena-block1/generated.ts a partir do markdown de origem
 * em src/data/program/vena-block1/source/PROGRAMA.md.
 *
 * Arquitetura (SPEC_REV2 §3):
 *   1. Blocos declarativos: entradas, restricoes, procedencias, eixos,
 *      derivacoes, ancoras, calibracao, papeis.
 *   2. 5 templates de dia (D1–D5) no formato de 8 colunas do repo, com {VAR} em
 *      QUALQUER célula (séries, reps, %1RM, RPE, notas).
 *   3. Três grades de rampa de 18 linhas, uma coluna por variável.
 *   4. Semanas 17–18: dias explícitos (o taper muda a estrutura).
 *
 * Regras que este gerador impõe, e que são o ponto do formato:
 *   - MEDIÇÃO DIGITADA É PROIBIDA. Não existe bloco de números medidos no
 *     markdown: minutos, séries por grupo, EXP, razão axial e reduções do taper
 *     saem daqui em VENA_BLOCK1_MEASURES. Não há onde digitar um 47.
 *   - BIJEÇÃO: chave em `restricoes` sem checker em INVARIANT_CHECKS, ou
 *     checker sem chave, é erro de build.
 *   - Célula de carga em kg é erro de build (o app recomputa em runtime).
 *
 * Uso: node scripts/build-vena-block1.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EXERCISE_MAP } from './exercise-map.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');
const SRC_CONTEXTO = join(ROOT, 'src/data/program/vena-block1/source/CONTEXTO.md');
const OUT = join(ROOT, 'src/data/program/vena-block1/generated.ts');

const EXPECTED_TEMPLATES = 5;
const EXPECTED_EXPLICIT_DAYS = 6;
const EXPECTED_WEEKS = 18;

/** Contra qual levantamento o percentual de cada exercício é lido. */
const PERCENT_REF_LIFT = {
  agachamento_low_bar_legal: 'agacho',
  agachamento_high_bar: 'agacho',
  supino_pausado_competicao: 'supino',
  terra_sumo_sem_strap: 'terra',
};
const PERCENT_REF_KEY = { agacho: 'squat', supino: 'bench', terra: 'deadlift' };

/** Faixa de percentual por papel (SPEC §2; a de `volume` vale para 5–7 reps). */
const ROLE_BANDS = {
  forca: [86, 92],
  pico: [85, 92.5],
  backoff: [82, 88],
  volume: [70, 80],
  gauge: [65, 80],
  pratica: [40, 70],
  leve: [55, 85],
  facil: [55, 75],
};

const TEMPLATE_DAY_TYPES = [
  'vb_squat_tertiary',  // D1
  'vb_bench_force',     // D2
  'vb_squat_volume',    // D3
  'vb_squat_force',     // D4
  'vb_deadlift_force',  // D5
];
const EXPLICIT_DAY_TYPES = {
  '17-1': 'vb_deadlift_force',
  '17-2': 'vb_squat_volume',
  '17-3': 'vb_squat_force',
  '17-4': 'vb_bench_force',
  '18-1': 'vb_taper',
  '18-2': 'vb_mock_meet',
};

const WEEK_META = [
  {
    weeks: [1, 2, 3],
    macrocycle: 1,
    blockName: 'Bloco 1 — Calibração',
    blockType: 'accumulation',
    blockObjective:
      'Descobrir o máximo técnico legal por teto de RPE (6 → 7 → 8), com uma âncora de Noriega por semana: gauge na 1 (70%), back-off na 2 (80%), top set na 3 (90%). Não existe single na semana 1. A pausa de supino já é de 1 s em toda rep de barra.',
  },
  {
    weeks: [4, 5, 6, 7, 8],
    macrocycle: 1,
    blockName: 'Bloco 1 — Acumulação',
    blockType: 'accumulation',
    blockObjective:
      'O máximo achado na calibração virou o trainingMax e todas as cargas passam a ser percentual dele. O top set sai de 86% e sobe até 92% na semana 16; o que rampla no supino é a contagem de séries pausadas, não a duração da pausa.',
  },
  {
    weeks: [9, 10, 11, 12, 13, 14, 15, 16],
    macrocycle: 1,
    blockName: 'Bloco 1 — Intensificação',
    blockType: 'intensification',
    blockObjective:
      'Mesmo esqueleto, top set chegando a 92% do trainingMax corrente e back-offs percorrendo RPE 7,5 a 9,5 — a faixa de Pak, sem prescrever um quilo acima do teto. Dose cheia de reps pausadas a partir da semana 9.',
  },
  {
    weeks: [17],
    macrocycle: 2,
    blockName: 'Taper',
    blockType: 'deload',
    blockObjective:
      'Taper de 10 dias, 4 sessões, acessórios a zero. Volume-carga cai 30 a 50% com a intensidade mantida acima de 85%. Últimas pesadas na ordem de recuperação de R116: terra a 10 dias, agacho a 7, supino a 5.',
    isDeload: true,
  },
  {
    weeks: [18],
    macrocycle: 2,
    blockName: 'Semana Final e Simulado',
    blockType: 'realization',
    blockObjective:
'Dia fácil a 3 dias out, com ensaio de comandos e nenhuma carga acima de 70%, e o simulado com três tentativas por levantamento. Só a abertura do TERRA é um peso já executado no taper (os 3×1 de D−10): a do agacho é 2,5 kg mais pesada que qualquer agacho dos 10 dias, e a do supino não aparece em nenhuma sessão. Barra + presilhas = 25 kg e o menor passo entre tentativas é 2,5 kg.',
  },
];

function metaForWeek(weekNumber) {
  const meta = WEEK_META.find((m) => m.weeks.includes(weekNumber));
  if (!meta) throw new Error(`Semana ${weekNumber} sem mesociclo definido`);
  return meta;
}

// --- Utilitários ------------------------------------------------------------

/** "3 MIN" -> {min:180,max:180} · "1-1.5 MIN" -> {min:60,max:90} */
function parseRest(raw) {
  if (!raw || raw === 'N/A') return undefined;
  const m = raw.match(/^([\d.,]+)(?:\s*[-–]\s*([\d.,]+))?\s*MIN$/i);
  if (!m) throw new Error(`Descanso não reconhecido: "${raw}"`);
  const lo = Number(m[1].replace(',', '.'));
  const hi = m[2] ? Number(m[2].replace(',', '.')) : lo;
  return { min: Math.round(lo * 60), max: Math.round(hi * 60) };
}

function parsePercentCell(raw) {
  if (!raw || raw === 'N/A') return undefined;
  const m = raw.match(/^([\d.,]+)%$/);
  if (!m) return undefined;
  return Number(m[1].replace(',', '.')) / 100;
}

function fmtPercent(pct) {
  const rounded = Math.round(pct * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}%`;
}

function fmtKg(kg) {
  return String(kg).replace('.', ',');
}

function round5(n) {
  return Math.round(n * 100000) / 100000;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function roundGuarded(kg, guard, step = 2.5) {
  if (guard === 'floor') return Math.floor(kg / step + 1e-9) * step;
  if (guard === 'ceiling') return Math.ceil(kg / step - 1e-9) * step;
  return Math.round(kg / step) * step;
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function isTableRow(line) {
  return line.startsWith('| ') && !line.includes('|---');
}

function block(md, name) {
  const m = md.match(new RegExp('```' + name + '\\n([\\s\\S]*?)```'));
  if (!m) throw new Error(`Bloco \`\`\`${name}\`\`\` não encontrado no markdown`);
  return m[1].split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}

// --- Parsing dos blocos declarativos ---------------------------------------

function parseEntradas(md) {
  const out = {};
  for (const line of block(md, 'entradas')) {
    const m = line.match(/^([a-z0-9_]+)\s*=\s*(.+)$/);
    if (!m) throw new Error(`Linha de entrada não reconhecida: "${line}"`);
    out[m[1]] = m[2].trim();
  }
  return out;
}

function parseProcedencias(md) {
  return block(md, 'procedencias').flatMap((l) => l.split(/\s{2,}|\s(?=[A-ZR])/)).map((t) => t.trim()).filter(Boolean);
}

/** Tags admitidas na 4ª coluna de ```restricoes``` (SPEC §3.2, auditoria N3). */
const RESTRICAO_TAGS = new Set(['GERAL', 'PESSOAL', 'interpretação', 'externo', 'entrada']);

/**
 * Bijeção `procedencias` ↔ corpo, exigida nos dois sentidos e sobre os DOIS
 * arquivos-fonte. O parser lia só PROGRAMA.md, e CONTEXTO.md — para onde foi o
 * material de design §9/§12/§13 — ficava fora de qualquer trava: citava R15 e
 * R37 sem declará-los. A bijeção é exigida só para as claims do corpus (Rnnn):
 * os outros tokens (`design §`, `Pak2021`, …) são famílias de procedência, não
 * endereços, e casá-los 1:1 produziria ruído em vez de achado.
 *
 * `[design §13-B/R7]` NÃO é citação de corpus: é referência a uma seção de
 * design. Por isso o reconhecedor exige que o `R` abra o colchete.
 */
function checkProcedenciaBijection(sources, procTokens) {
  const declared = new Set(procTokens.filter((t) => /^R\d+$/.test(t)));
  const cited = new Set();
  for (const text of sources) {
    for (const m of text.matchAll(/\[(R\d+)\b/g)) cited.add(m[1]);
    for (const m of text.matchAll(/(?:^|[\s·])(R\d+)@/gm)) cited.add(m[1]);
  }
  const orfas = [...declared].filter((t) => !cited.has(t));
  const naoDeclaradas = [...cited].filter((t) => !declared.has(t));
  if (naoDeclaradas.length) {
    throw new Error(`Citação fora do bloco \`\`\`procedencias\`\`\`: ${naoDeclaradas.join(', ')}`);
  }
  if (orfas.length) {
    throw new Error(`Procedência declarada e nunca citada (bijeção): ${orfas.join(', ')}`);
  }
  return cited.size;
}

function parseRestricoes(md, procTokens) {
  const out = [];
  for (const line of block(md, 'restricoes')) {
    const parts = line.split('|').map((p) => p.trim());
    const m = parts[0].match(/^([a-z0-9_]+)\s*(<=|>=|=|>|∈)\s*(.+)$/);
    if (!m) throw new Error(`Linha de restrição não reconhecida: "${line}"`);
    const [, key, cmp, rawValue] = m;
    let value = rawValue.trim();
    let range = null;
    let column = null;
    let refKey = null;
    if (cmp === '∈') {
      const r = value.match(/^([\d.]+)\s*-\s*([\d.]+)$/);
      if (!r) throw new Error(`Faixa não reconhecida em "${line}"`);
      range = [Number(r[1]), Number(r[2])];
    } else if (/^coluna:/.test(value)) {
      column = value.replace('coluna:', '');
    } else if (/^-?[\d.]+$/.test(value)) {
      // número puro: fica em `value`
    } else if (/^[a-z][a-z0-9_]*$/.test(value)) {
      refKey = value;
    } else {
      throw new Error(`Valor não reconhecido em "${line}"`);
    }
    const scope = (parts[1] ?? '').match(/semana\s+(\d+)-(\d+)/);
    const proc = (parts[2] ?? '').trim();
    // 4ª coluna: TAG da procedência. Sem ela o bloco `restricoes` era o único
    // lugar do documento onde [PESSOAL] virava [GERAL] por construção.
    const tag = (parts[3] ?? '').trim();
    if (!RESTRICAO_TAGS.has(tag)) {
      throw new Error(`Restrição "${key}" sem tag válida (4ª coluna). Use uma de: ${[...RESTRICAO_TAGS].join(', ')}`);
    }
    for (const token of proc.split('·').map((t) => t.trim()).filter(Boolean)) {
      const head = token.split(/\s/)[0];
      const ok = procTokens.includes(token) || procTokens.includes(head)
        || procTokens.includes(`${head} §`) || /^R\d+/.test(head);
      if (!ok) throw new Error(`Procedência "${token}" fora do bloco \`\`\`procedencias\`\`\` (${key})`);
    }
    out.push({
      key,
      cmp,
      value: range ? null : (column || refKey ? null : Number(value)),
      range,
      column,
      refKey,
      from: scope ? Number(scope[1]) : 1,
      to: scope ? Number(scope[2]) : EXPECTED_WEEKS,
      proc,
      tag,
    });
  }
  return out;
}

function parseEixos(md) {
  const out = {};
  for (const line of block(md, 'eixos')) {
    const p = line.split('|').map((s) => s.trim());
    if (p.length !== 4) throw new Error(`Linha de eixo não reconhecida: "${line}"`);
    out[p[0]] = { eixo: p[1], unidade: p[2], regra: p[3] };
  }
  return out;
}

function parseDerivacoes(md) {
  const out = [];
  for (const line of block(md, 'derivacoes')) {
    const [expr, ...mods] = line.split('|').map((s) => s.trim());
    const m = expr.match(/^([A-Z0-9-]+)\s*=\s*(.+)$/);
    if (!m) throw new Error(`Derivação não reconhecida: "${line}"`);
    const rhs = m[2];
    let rule = null;
    let a = rhs.match(/^([A-Z0-9-]+)\s*([-+])\s*([\d.]+)pp$/);
    if (a) rule = { kind: 'offset', from: a[1], sign: a[2] === '-' ? -1 : 1, pp: Number(a[3]) };
    if (!rule) {
      a = rhs.match(/^([\d.]+)\s*-\s*([A-Z0-9-]+)$/);
      if (a) rule = { kind: 'complement', total: Number(a[1]), from: a[2] };
    }
    if (!rule) {
      a = rhs.match(/^([\d.]+)\s*\+\s*([A-Z0-9-]+)$/);
      if (a) rule = { kind: 'plus', base: Number(a[1]), from: a[2] };
    }
    if (!rule) throw new Error(`Derivação não reconhecida: "${line}"`);
    const clamp = mods.map((s) => s.match(/^clamp\s+([\d.]+)-([\d.]+)$/)).find(Boolean);
    out.push({ target: m[1], ...rule, clamp: clamp ? [Number(clamp[1]), Number(clamp[2])] : null });
  }
  return out;
}

function parsePapeis(md) {
  const out = new Map();
  for (const line of block(md, 'papeis')) {
    const p = line.split('|').map((s) => s.trim());
    if (p.length !== 7) throw new Error(`Linha de papel não reconhecida (${p.length} campos): "${line}"`);
    const [local, exerciseId, papel, esquema, pausaRaw, round, conta] = p;
    const pausa = pausaRaw.replace(/^pausa\s+/, '');
    if (!['floor', 'ceiling', 'nearest'].includes(round)) {
      throw new Error(`roundGuard inválido em "${line}"`);
    }
    if (out.has(local)) throw new Error(`Papel duplicado para ${local}`);
    out.set(local, { local, exerciseId, papel, esquema, pausa, round, conta });
  }
  return out;
}

function parseTextBlock(md, name) {
  return block(md, name);
}

// --- Grades de rampa --------------------------------------------------------

function parseGrade(md) {
  const lines = md.split('\n');
  let inSection = false;
  let header = null;
  const byWeek = new Map();
  const columns = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inSection) break;
      inSection = /TABELA DE PROGRESSÃO/.test(line);
      continue;
    }
    if (!inSection) continue;
    if (line.startsWith('### ')) { header = null; continue; }
    if (!isTableRow(line)) continue;
    const cols = splitRow(line);
    if (!header) {
      if (cols[0] !== 'Semana') continue;
      header = cols.slice(1);
      for (const name of header) if (name !== 'Rótulo' && !columns.includes(name)) columns.push(name);
      continue;
    }
    const weekNumber = Number(cols[0]);
    if (!Number.isInteger(weekNumber)) throw new Error(`Semana inválida na grade: "${cols[0]}"`);
    if (cols.length !== header.length + 1) {
      throw new Error(`Semana ${weekNumber}: ${cols.length - 1} células, esperado ${header.length}`);
    }
    if (!byWeek.has(weekNumber)) byWeek.set(weekNumber, { vars: {}, label: undefined });
    const row = byWeek.get(weekNumber);
    header.forEach((name, i) => {
      const raw = cols[i + 1];
      if (name === 'Rótulo') { if (raw && raw !== '—') row.label = raw; return; }
      if (name in row.vars) throw new Error(`Coluna ${name} declarada duas vezes (semana ${weekNumber})`);
      row.vars[name] = raw;
    });
  }
  if (byWeek.size !== EXPECTED_WEEKS) {
    throw new Error(`Grade: esperado ${EXPECTED_WEEKS} semanas, veio ${byWeek.size}`);
  }
  return { byWeek, columns };
}

/** Valor numérico de uma célula da grade ("86%", "4", "1.0 s") ou null. */
function cellNumber(raw) {
  if (raw === undefined || raw === null) return null;
  const t = String(raw).trim();
  if (!t || t === '—' || /^RPE/.test(t)) return null;
  const m = t.match(/^([\d.,]+)\s*(%|s)?$/);
  if (!m) return null;
  return Number(m[1].replace(',', '.'));
}

function checkDerivacoes(grade, derivacoes) {
  for (const week of grade.byWeek.keys()) {
    const vars = grade.byWeek.get(week).vars;
    for (const d of derivacoes) {
      const target = cellNumber(vars[d.target]);
      const source = cellNumber(vars[d.from]);
      if (target === null || source === null) continue;
      let expected;
      if (d.kind === 'offset') expected = source + d.sign * d.pp;
      else if (d.kind === 'complement') expected = d.total - source;
      else expected = d.base + source;
      if (d.clamp) expected = Math.min(Math.max(expected, d.clamp[0]), d.clamp[1]);
      if (Math.abs(expected - target) > 1e-9) {
        throw new Error(
          `Semana ${week}: ${d.target} = ${target} diverge da derivação declarada (${d.from} → ${expected})`,
        );
      }
    }
  }
}

function checkEixos(grade, eixos) {
  const violations = [];
  for (const name of grade.columns) {
    if (!eixos[name]) throw new Error(`Coluna ${name} da grade sem eixo declarado`);
  }
  for (const name of Object.keys(eixos)) {
    if (!grade.columns.includes(name)) throw new Error(`Eixo ${name} declarado sem coluna na grade`);
  }
  const weeks = [...grade.byWeek.keys()].sort((a, b) => a - b);
  for (const [name, spec] of Object.entries(eixos)) {
    const series = weeks
      .map((w) => ({ w, v: cellNumber(grade.byWeek.get(w).vars[name]) }))
      .filter((s) => s.v !== null);
    const recuo = spec.regra.match(/recuo\s+S(\d+)/);
    const osc = spec.regra.match(/oscilante\s+([\d.]+)-([\d.]+)/);
    for (let i = 1; i < series.length; i += 1) {
      const prev = series[i - 1];
      const cur = series[i];
      const recuoAqui = recuo && cur.w === Number(recuo[1]);
      if (/monotonica/.test(spec.regra) && cur.v < prev.v - 1e-9 && !recuoAqui) {
        violations.push(`${name} cai de ${prev.v} para ${cur.v} na semana ${cur.w}`);
      }
      if (/decrescente/.test(spec.regra) && cur.v > prev.v + 1e-9) {
        violations.push(`${name} sobe de ${prev.v} para ${cur.v} na semana ${cur.w}`);
      }
      if (/constante/.test(spec.regra) && Math.abs(cur.v - prev.v) > 1e-9) {
        violations.push(`${name} muda de ${prev.v} para ${cur.v} na semana ${cur.w}`);
      }
      if (recuo && cur.v < prev.v - 1e-9 && cur.w !== Number(recuo[1])) {
        violations.push(`${name} recua na semana ${cur.w}, mas o eixo declara recuo em S${recuo[1]}`);
      }
    }
    if (osc) {
      for (const s of series) {
        if (s.v < Number(osc[1]) - 1e-9 || s.v > Number(osc[2]) + 1e-9) {
          violations.push(`${name} vale ${s.v} na semana ${s.w}, fora da oscilação declarada`);
        }
      }
    }
  }
  return violations;
}

// --- Templates e dias explícitos -------------------------------------------

function parseDays(md) {
  const lines = md.split('\n');
  const templates = [];
  const explicit = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) { current = null; continue; }
    const tpl = line.match(/^### TEMPLATE D(\d) \((.+)\)\s*$/);
    if (tpl) {
      current = { kind: 'template', index: Number(tpl[1]) - 1, dayLabel: tpl[2], rows: [] };
      templates.push(current);
      continue;
    }
    const exp = line.match(/^### SEMANA (\d+) - DIA (\d+) \((.+)\)\s*$/);
    if (exp) {
      current = {
        kind: 'explicit',
        weekNumber: Number(exp[1]),
        dayNumber: Number(exp[2]),
        dayLabel: exp[3],
        rows: [],
      };
      explicit.push(current);
      continue;
    }
    if (!current) continue;
    const rest = line.match(/^\*\*DESCANSO SUGERIDO:\s*(\d+)\s*DIAS?\*\*\s*$/i);
    if (rest) { current.restDaysAfter = Number(rest[1]); continue; }
    if (!isTableRow(line)) continue;
    const cols = splitRow(line);
    if (cols[0] === 'Exercício') continue;
    if (cols.length !== 8) throw new Error(`Linha com ${cols.length} colunas: ${line}`);
    current.rows.push(cols);
  }

  if (templates.length !== EXPECTED_TEMPLATES) {
    throw new Error(`Esperado ${EXPECTED_TEMPLATES} templates, encontrado ${templates.length}`);
  }
  templates.forEach((t, i) => {
    if (t.index !== i) throw new Error(`Templates fora de ordem: D${t.index + 1} na posição ${i + 1}`);
  });
  if (explicit.length !== EXPECTED_EXPLICIT_DAYS) {
    throw new Error(`Esperado ${EXPECTED_EXPLICIT_DAYS} dias explícitos, encontrado ${explicit.length}`);
  }
  return { templates, explicit };
}

function applyVars(text, weekNumber, grade) {
  const vars = grade.byWeek.get(weekNumber).vars;
  return text.replace(/\{([A-Z][A-Z0-9-]*)\}/g, (match, name) => {
    if (!(name in vars)) throw new Error(`Semana ${weekNumber}: variável {${name}} não existe na grade`);
    const value = vars[name];
    if (value === '—') throw new Error(`Semana ${weekNumber}: variável {${name}} sem valor nesta semana`);
    return value;
  });
}

function buildExercise(rawCols, weekNumber, dayNumber, index, grade, refs, papeis, localKey) {
  const cols = rawCols.map((c) => applyVars(c, weekNumber, grade));
  const [label, warmRaw, workRaw, reps, pctRaw, rpeRaw, restRaw, notesRaw] = cols;

  const entry = EXERCISE_MAP[label];
  if (!entry) throw new Error(`Exercício não mapeado: "${label}" (semana ${weekNumber}, dia ${dayNumber})`);

  const papel = papeis.get(localKey);
  if (!papel) throw new Error(`Linha sem papel declarado: ${localKey} ("${label}")`);
  if (papel.exerciseId !== entry.id) {
    throw new Error(`${localKey}: papel declara ${papel.exerciseId}, template usa ${entry.id}`);
  }

  if (/^\s*[\d.,]+\s*kg/i.test(pctRaw)) {
    throw new Error(`${localKey} semana ${weekNumber}: célula de carga em kg — o formato é % do trainingMax`);
  }

  const sets = Number(workRaw);
  if (!Number.isInteger(sets) || sets < 0) {
    throw new Error(`Séries inválidas em ${localKey} (semana ${weekNumber}): "${workRaw}"`);
  }

  // O esquema declarado no bloco `papeis` tem que bater com o template, semana a
  // semana. É o que mata a classe de erro "prosa declara 4×6, template dá 5×6".
  const esquema = applyVars(papel.esquema, weekNumber, grade);
  if (esquema !== `${sets}x${reps}`) {
    throw new Error(`${localKey} semana ${weekNumber}: papel declara ${esquema}, template prescreve ${sets}x${reps}`);
  }

  let percent = parsePercentCell(pctRaw);
  let rpe = rpeRaw;
  const rpeCell = pctRaw.match(/^RPE\s+([\d.,]+)$/);
  if (rpeCell) rpe = rpeCell[1].replace(',', '.');

  let notes = notesRaw;
  if (percent !== undefined) {
    const lift = PERCENT_REF_LIFT[entry.id];
    if (!lift) throw new Error(`"${label}" tem %1RM mas não está em PERCENT_REF_LIFT`);
    const band = ROLE_BANDS[papel.papel];
    const pct = percent * 100;
    if (band && (pct < band[0] - 1e-9 || pct > band[1] + 1e-9)) {
      throw new Error(
        `${localKey} semana ${weekNumber}: ${pct}% fora da faixa ${band[0]}–${band[1]}% do papel "${papel.papel}"`,
      );
    }
    const kg = roundGuarded(percent * refs[lift], papel.round);
    notes = `${notesRaw} · Alvo ≈ ${fmtKg(kg)} kg @ TM ${fmtKg(refs[lift])}`;
  }

  const ex = {
    blockId: `w${weekNumber}d${dayNumber}b${index}`,
    exerciseId: entry.id,
    exerciseName: label,
    rawLabel: label,
    sets,
    reps,
    rpe,
    warmupSets: Number(warmRaw),
    role: papel.papel,
    countsAs: papel.conta,
  };
  if (notes) ex.notes = notes;

  const rest = parseRest(restRaw);
  if (rest) {
    ex.restSec = rest.min;
    ex.restSecMin = rest.min;
    ex.restSecMax = rest.max;
    ex.restLabel = restRaw;
  }
  if (percent !== undefined) {
    ex.percent1RM = fmtPercent(percent * 100);
    ex.percentMin = round5(percent);
    ex.percentMax = round5(percent);
    ex.percentRef = PERCENT_REF_KEY[PERCENT_REF_LIFT[entry.id]];
    // Grade de arredondamento = o que a barra do atleta consegue montar, lido
    // da declaração `incremento_minimo_barra_kg`. Estava cravado em 2.5 e a
    // declaração não governava nada: mudar o markdown não mudava a carga.
    ex.roundToKg = refs.incrementoKg;
    ex.roundGuard = papel.round;
  }
  // A pausa pode ser variável por semana ({PAUSA-P}) e a célula da grade vem
  // com unidade ("2.0 s") — daí o parseFloat depois da substituição.
  const pausa = parseFloat(applyVars(papel.pausa, weekNumber, grade).replace(',', '.'));
  if (Number.isFinite(pausa) && pausa > 0) ex.pauseSec = pausa;
  if (entry.alt) {
    ex.alternatives = entry.alt.map(([name]) => name);
    ex.alternativeIds = entry.alt.map(([, id]) => id);
  }
  return ex;
}

// --- Medições (a máquina escreve o número) ----------------------------------

const TIME_BASE_MIN = 8;
const TIME_WARMUP_MIN = 1.5;
const TIME_SET_EXEC_MIN = 0.75;
/** Troca de aparelho entre exercícios: montar/desmontar, andar, ajustar. */
const TIME_TRANSITION_MIN = 1.0;

/**
 * Duração estimada da sessão. Duas correções contra o motor anterior:
 *   - NÃO se cobra descanso depois da ÚLTIMA série de cada exercício. O motor
 *     antigo cobrava `sets × (exec + rest)`, ou seja, 3 min sentado depois da
 *     última série de cada bloco — em D1, com 9 exercícios, ~18,5 min.
 *   - COBRA-SE a TRANSIÇÃO entre exercícios, que o motor antigo dava de graça:
 *     trocar de aparelho (1 min) MAIS o descanso exigido pelo exercício que
 *     ENTRA, porque começar a primeira série do próximo bloco exige estar
 *     recuperado para ele.
 * O saldo é o oposto do que o nome sugere: a sessão fica MAIS LONGA, não mais
 * curta — o crédito fictício do último descanso escondia o custo real das
 * transições. D1 sai de 94,3 para ~99 min, e a margem contra o teto de 100 é
 * de ~1 min, não de 6.
 */
function sessionMinutes(day) {
  let total = TIME_BASE_MIN;
  const restOf = (ex) => (ex.restSecMax ?? ex.restSec ?? 150) / 60;
  day.exercises.forEach((ex, i) => {
    total += (ex.warmupSets ?? 0) * TIME_WARMUP_MIN;
    const sets = ex.sets ?? 0;
    total += sets * TIME_SET_EXEC_MIN + Math.max(0, sets - 1) * restOf(ex);
    if (i > 0) total += TIME_TRANSITION_MIN + restOf(ex);
  });
  return round2(total);
}

const LIFT_OF_ID = {
  agachamento_low_bar_legal: 'agacho',
  agachamento_high_bar: 'agacho',
  supino_pausado_competicao: 'supino',
  terra_sumo_sem_strap: 'terra',
};

function measureWeek(week, refs) {
  const direct = {};
  const forceDose = { agacho: 0, supino: 0, terra: 0 };
  const topPct = { agacho: 0, supino: 0, terra: 0 };
  const topPctRealizado = { agacho: 0, supino: 0, terra: 0 };
  const gaugeEstruturaAnterior = {};
  const backoffPct = [];
  const freq = { agacho: new Set(), supino: new Set(), terra: new Set() };
  let exp = 0;
  let pausedSets = 0;
  let pausedReps = 0;
  let benchSets = 0;
  let highBarSets = 0;
  let squatSets = 0;
  let accessorySets = 0;
  let sbdSets = 0;
  let volumeLoad = 0;
  let minPause = Infinity;
  const axial = {};
  const sessions = [];

  for (const [i, day] of week.days.entries()) {
    const dayNum = (day.dayIndex ?? i) + 1;
    sessions.push({ dayNum, minutes: sessionMinutes(day) });
    let dayAxial = 0;
    const seenBefore = [];
    for (const ex of day.exercises) {
      if (ex.role === 'gauge') {
        gaugeEstruturaAnterior[`D${dayNum}#${ex.exerciseId}`] = seenBefore.join(' + ') || '(nada antes)';
      }
      seenBefore.push(`${ex.exerciseId}:${ex.sets}x${ex.reps}@${ex.percent1RM ?? ex.rpe}`);
      direct[ex.countsAs] = (direct[ex.countsAs] ?? 0) + ex.sets;
      const lift = LIFT_OF_ID[ex.exerciseId];
      const reps = Number(String(ex.reps).match(/^\d+/)?.[0] ?? 0);
      if (lift) {
        freq[lift].add(dayNum);
        sbdSets += ex.sets;
        if (ex.percentMin !== undefined) {
          const kg = ex.percentMin * refs[lift];
          volumeLoad += ex.sets * reps * kg;
          if (lift !== 'supino') dayAxial += ex.sets * reps * kg;
          if (ex.percentMin > topPct[lift]) topPct[lift] = ex.percentMin;
          // O que a barra de fato carrega: percentual × TM já passado pelo
          // roundGuard do papel na grade de 2,5 kg.
          const realizado = roundGuarded(ex.percentMin * refs[lift], ex.roundGuard ?? 'nearest') / refs[lift];
          if (realizado > topPctRealizado[lift]) topPctRealizado[lift] = realizado;
          if (ex.percentMin >= 0.8 && reps >= 1 && reps <= 5) forceDose[lift] += ex.sets;
          if (ex.role === 'backoff') backoffPct.push(ex.percentMin * 100);
        }
      } else {
        accessorySets += ex.sets;
      }
      if (ex.exerciseId === 'agachamento_high_bar') highBarSets += ex.sets;
      if (lift === 'agacho') squatSets += ex.sets;
      if (ex.exerciseId === 'supino_pausado_competicao') {
        benchSets += ex.sets;
        pausedSets += ex.sets;
        pausedReps += ex.sets * reps;
        minPause = Math.min(minPause, ex.pauseSec ?? 0);
        if (ex.percentMin !== undefined) exp += ex.sets * reps * (ex.pauseSec ?? 0) * ex.percentMin;
      }
      if (ex.countsAs === 'supino_acessorio') benchSets += ex.sets;
    }
    axial[dayNum] = round2(dayAxial);
  }

  return {
    weekNumber: week.weekNumber,
    sessions,
    minutosMin: Math.min(...sessions.map((s) => s.minutes)),
    minutosMax: Math.max(...sessions.map((s) => s.minutes)),
    direct,
    forceDose,
    topPct,
    topPctRealizado,
    backoffMin: backoffPct.length ? Math.min(...backoffPct) : null,
    backoffMax: backoffPct.length ? Math.max(...backoffPct) : null,
    frequencia: {
      agacho: freq.agacho.size, supino: freq.supino.size, terra: freq.terra.size,
    },
    exp: round2(exp),
    supinoSeries: benchSets,
    supinoPausadas: pausedSets,
    repsPausadas: pausedReps,
    pausaMinima: minPause === Infinity ? null : minPause,
    highBarPct: squatSets ? round2((highBarSets / squatSets) * 100) : null,
    acessorioSeries: accessorySets,
    sbdSeries: sbdSets,
    volumeCarga: Math.round(volumeLoad),
    axial,
    razaoAxial: axial[5] ? round2((axial[4] ?? 0) / axial[5]) : null,
    // R15 cobre o par ERRADO. A invariante declarada é D4/D5, que já foi
    // consertado; o desequilíbrio migrou para D3, que concentra ~49% do axial
    // da semana. Estes dois números existem para que isso pare de ser
    // invisível — e R15 fica declarado ABERTO enquanto eles não tiverem faixa.
    razaoAxialD3D4: axial[4] ? round2((axial[3] ?? 0) / axial[4]) : null,
    razaoAxialMaximaEntreDias: (() => {
      const vals = Object.values(axial).filter((v) => v > 0);
      return vals.length ? round2(Math.max(...vals) / Math.min(...vals)) : null;
    })(),
    gaugeEstruturaAnterior,
  };
}

/** Linha do tempo em dias: cada sessão ocupa 1 dia + os `restDaysAfter`. */
function buildTimeline(weeks) {
  const out = [];
  let offset = 0;
  for (const week of weeks) {
    for (const [i, day] of week.days.entries()) {
      out.push({ week: week.weekNumber, dayNum: (day.dayIndex ?? i) + 1, day, offset });
      offset += 1 + (day.restDaysAfter ?? 0);
    }
  }
  return out;
}

function daysOut(weeks, lift, minPercent) {
  const timeline = buildTimeline(weeks);
  const sim = timeline[timeline.length - 1];
  let last = null;
  for (const s of timeline) {
    if (s === sim) continue;
    const hit = s.day.exercises.some((ex) => LIFT_OF_ID[ex.exerciseId] === lift
      && (minPercent === null || (ex.percentMin ?? 0) >= minPercent));
    if (hit) last = s;
  }
  return last ? sim.offset - last.offset : null;
}

/**
 * Tabela de conversão RPE↔% de §0.3 do markdown, NORMATIVA e única.
 *   1 rep : RPE 8 = 92%, 3 pp por ponto
 *   3 reps: RPE 7 = 81%, 2 pp por ponto
 *   5 reps: RPE 6 ≈ 76%  ⚠️ [interpretação] — Noriega só publica a de 7 reps
 *   7 reps: RPE 6–7 = 70% (ponto médio 6,5), 2 pp por ponto ⚠️ [interpretação]
 */
function rpeToPct(reps, rpe) {
  if (reps === 1) return 92 + (rpe - 8) * 3;
  if (reps === 3) return 81 + (rpe - 7) * 2;
  if (reps === 5) return 76 + (rpe - 6) * 2;
  if (reps === 7) return 70 + (rpe - 6.5) * 2;
  return null;
}

/** Reps de cada coluna de carga de supino (SUP-F varia: 3, 3, 1). */
const BENCH_LOAD_REPS = {
  'SUP-F': (vars) => cellNumber(vars['SUP-F-REPS']),
  'SUP-V1-PCT': () => 5,
  'SUP-P': () => 3,
  'SUP-V4-PCT': () => 7,
  'SUP-G': () => 7,
};

/** Percentual EQUIVALENTE de uma célula de carga de supino: "86%" ou "RPE 7". */
function benchLoadPct(vars, column) {
  const raw = vars[column];
  const direct = cellNumber(raw);
  if (direct !== null) return direct;
  const m = String(raw ?? '').trim().match(/^RPE\s+([\d.,]+)$/);
  if (!m) return null;
  const reps = BENCH_LOAD_REPS[column]?.(vars);
  if (!reps) return null;
  return rpeToPct(reps, Number(m[1].replace(',', '.')));
}

// --- Registro de checkers (bijeção com `restricoes`) ------------------------

function buildChecks(ctx) {
  const { measures, weeks, grade, refs } = ctx;
  const inScope = (r) => measures.filter((m) => m.weekNumber >= r.from && m.weekNumber <= r.to);
  const each = (fn) => (r) => inScope(r).map((m) => ({ week: m.weekNumber, value: fn(m) })).filter((s) => s.value !== null && s.value !== undefined);
  const one = (value) => () => [{ week: null, value }];

  const rampa = (lift) => {
    const series = measures.filter((m) => m.weekNumber >= 4 && m.weekNumber <= 16).map((m) => m.topPct[lift]);
    const first = series[0];
    const last = series[series.length - 1];
    return round2(((last - first) / first) * 100);
  };

  // UM-EIXO: em toda semana em que qualquer coluna do eixo `exposicao_peito`
  // muda, nenhuma coluna de carga de supino pode subir
  // ("mude poucas coisas de uma vez — idealmente apenas uma por levantamento",
  // R63 @02:01). O eixo de exposição é LIDO do bloco ```eixos```, não
  // hard-coded: quando FP-SETS/FP4-SETS migraram para `exposicao_peito`, a
  // checagem passou a cobri-los sem edição de código.
  //
  // A célula `RPE n` é convertida para percentual pela tabela normativa §0.3
  // ANTES de comparar. Sem isso, todas as colunas de carga de supino das S1–S3
  // eram null e a checagem passava por CEGUEIRA — foi assim que a S3
  // (SUP-V1 2→3 junto com RPE-SUP 6,5→7 e a estreia do single) escapou.
  const umEixo = () => {
    const exposicao = Object.keys(ctx.eixos).filter((c) => ctx.eixos[c].eixo === 'exposicao_peito');
    const carga = ['SUP-F', 'SUP-V1-PCT', 'SUP-P', 'SUP-V4-PCT'];
    let violations = 0;
    for (let w = 2; w <= 16; w += 1) {
      const prev = grade.byWeek.get(w - 1).vars;
      const cur = grade.byWeek.get(w).vars;
      const moved = exposicao.some((c) => {
        const a = cellNumber(prev[c]); const b = cellNumber(cur[c]);
        return a !== null && b !== null && b !== a;
      });
      if (!moved) continue;
      const rose = carga.some((c) => {
        const a = benchLoadPct(prev, c); const b = benchLoadPct(cur, c);
        return a !== null && b !== null && b > a + 1e-9;
      });
      if (rose) violations += 1;
    }
    return violations;
  };

  // GAUGE-POS: o gauge é a 1ª série de trabalho DAQUELE levantamento no dia
  // (SPEC §4.2 — não "do dia", que reprovaria D2 e D3 por construção).
  const gaugePos = () => {
    for (const week of weeks) {
      for (const day of week.days) {
        const seen = new Set();
        for (const ex of day.exercises) {
          const lift = LIFT_OF_ID[ex.exerciseId];
          if (!lift) continue;
          if (ex.role === 'gauge' && seen.has(lift)) return 0;
          seen.add(lift);
        }
      }
    }
    return 1;
  };

  const blockMeasures = measures.filter((m) => m.weekNumber >= 4 && m.weekNumber <= 16);
  const meanLoad = blockMeasures.reduce((n, m) => n + m.volumeCarga, 0) / blockMeasures.length;
  const meanSbd = blockMeasures.reduce((n, m) => n + m.sbdSeries, 0) / blockMeasures.length;
  const taper = measures.find((m) => m.weekNumber === 17);

  return {
    // Medidas sobre o QUILO REALIZADO (percentual × TM com o roundGuard da
    // grade de 2,5 kg aplicado), não sobre o percentual declarado: era a
    // divergência que fazia `86-92` passar verde com 84,88% na barra.
    teto_pct_do_tm_corrente: each((m) => Math.max(...Object.values(m.topPctRealizado)) * 100 || null),
    piso_pct_serie_de_forca: each((m) => (m.backoffMin ?? null)),
    papel_forca_top_set_pct: each((m) => Math.max(...Object.values(m.topPctRealizado)) * 100 || null),
    backoff_pct_minimo: each((m) => m.backoffMin),
    backoff_pct_maximo: each((m) => m.backoffMax),
    backoff_offset_pp_do_top: each((m) => round2(m.topPct.agacho * 100 - m.backoffMax)),
    series_forca_agacho_semana: each((m) => m.forceDose.agacho),
    series_forca_supino_semana: each((m) => m.forceDose.supino),
    series_forca_terra_semana: each((m) => m.forceDose.terra),
    rampa_carga_agacho_pct: one(rampa('agacho')),
    rampa_carga_supino_pct: one(rampa('supino')),
    rampa_carga_terra_pct: one(rampa('terra')),
    frequencia_agacho_por_semana: each((m) => m.frequencia.agacho),
    frequencia_supino_por_semana: each((m) => m.frequencia.supino),
    frequencia_terra_por_semana: each((m) => m.frequencia.terra),
    supino_series_semana: each((m) => m.supinoSeries),
    supino_series_pausadas_semana: each((m) => m.supinoPausadas),
    pausa_supino_minima_s: each((m) => m.pausaMinima),
    costas_series_diretas_semana: each((m) => m.direct.costas ?? 0),
    biceps_series_diretas_semana: each((m) => m.direct.biceps ?? 0),
    delt_lateral_series_diretas_semana: each((m) => m.direct.delt_lateral ?? 0),
    delt_lat_post_series_diretas: each((m) => (m.direct.delt_lateral ?? 0) + (m.direct.delt_posterior ?? 0)),
    delt_anterior_series_diretas: each((m) => m.direct.delt_anterior ?? 0),
    eretores_series_diretas_semana: each((m) => m.direct.eretores ?? 0),
    isquiotibiais_series_diretas_semana: each((m) => m.direct.isquiotibiais ?? 0),
    high_bar_pct_series_agacho: each((m) => m.highBarPct),
    exp_supino_semana: each((m) => m.exp),
    razao_axial_d4_sobre_d5: each((m) => m.razaoAxial),
    gauge_pos_primeira_serie_do_lift: one(gaugePos()),
    um_eixo_supino_violacoes: one(umEixo()),
    minutos_por_sessao_bloco: (r) => inScope(r).flatMap((m) => m.sessions.map((s) => ({ week: m.weekNumber, value: s.minutes }))),
    minutos_por_sessao_taper: (r) => inScope(r).flatMap((m) => m.sessions.map((s) => ({ week: m.weekNumber, value: s.minutes }))),
    taper_reducao_volume_carga_pct: one(taper ? round2((1 - taper.volumeCarga / meanLoad) * 100) : null),
    taper_reducao_series_sbd_pct: one(taper ? round2((1 - taper.sbdSeries / meanSbd) * 100) : null),
    taper_intensidade_de_pico_pct: one(taper ? round2(Math.max(...Object.values(taper.topPct)) * 100) : null),
    acessorio_series_semana_taper: each((m) => m.acessorioSeries),
    ultimo_pesado_agacho_dias_out: one(daysOut(weeks, 'agacho', 0.85)),
    ultimo_pesado_terra_dias_out: one(daysOut(weeks, 'terra', 0.85)),
    ultimo_pesado_supino_dias_out: one(daysOut(weeks, 'supino', 0.85)),
    cessacao_dias_out: one(Math.max(
      daysOut(weeks, 'agacho', null) ?? 0,
      daysOut(weeks, 'supino', null) ?? 0,
      daysOut(weeks, 'terra', null) ?? 0,
    )),
  };
}

function runChecks(restricoes, checks) {
  const declared = new Set(restricoes.map((r) => r.key));
  const implemented = new Set(Object.keys(checks));
  for (const key of declared) {
    if (!implemented.has(key)) throw new Error(`Restrição "${key}" declarada sem checker (bijeção, SPEC §3.2)`);
  }
  for (const key of implemented) {
    if (!declared.has(key)) throw new Error(`Checker "${key}" sem chave declarada em \`\`\`restricoes\`\`\` (bijeção)`);
  }

  const rows = [];
  for (const r of restricoes) {
    const raw = checks[r.key];
    const samples = typeof raw === 'function' ? raw(r) : raw;
    if (!samples.length) throw new Error(`Restrição "${r.key}" não produziu nenhuma medição no escopo declarado`);
    const fails = [];
    for (const s of samples) {
      const v = s.value;
      let ok = true;
      if (r.cmp === '<=') {
        if (r.column) {
          const ceiling = cellNumber(r.ceilingByWeek?.get(s.week));
          ok = ceiling === null || v <= ceiling + 1e-9;
        } else ok = v <= r.value + 1e-9;
      } else if (r.cmp === '>=') {
        if (r.refKey) {
          const other = typeof checks[r.refKey] === 'function' ? checks[r.refKey](r) : checks[r.refKey];
          const peer = other.find((o) => o.week === s.week) ?? other[0];
          ok = peer ? v >= peer.value - 1e-9 : true;
        } else ok = v >= r.value - 1e-9;
      }
      else if (r.cmp === '=') ok = Math.abs(v - r.value) < 1e-9;
      else if (r.cmp === '∈') ok = v >= r.range[0] - 1e-9 && v <= r.range[1] + 1e-9;
      else if (r.cmp === '>') {
        const other = typeof checks[r.refKey] === 'function' ? checks[r.refKey](r) : checks[r.refKey];
        const peer = other.find((o) => o.week === s.week);
        ok = peer ? v > peer.value : true;
      }
      if (!ok) fails.push(`S${s.week ?? '—'}=${v}`);
    }
    const values = samples.map((s) => s.value);
    rows.push({
      chave: r.key,
      comparador: r.cmp,
      alvo: r.range ? `${r.range[0]}-${r.range[1]}` : (r.column ? `coluna:${r.column}` : (r.refKey ?? r.value)),
      tag: r.tag,
      medido: values.length === 1 ? values[0] : `${Math.min(...values)}–${Math.max(...values)}`,
      escopo: `S${r.from}-S${r.to}`,
      ok: fails.length === 0,
    });
    if (fails.length) {
      throw new Error(`INVARIANTE "${r.key}" ${r.cmp} ${rows[rows.length - 1].alvo} violada em: ${fails.join(', ')}`);
    }
  }
  return rows;
}

// --- Build ------------------------------------------------------------------

function build() {
  const md = readFileSync(SRC, 'utf8');

  const contexto = readFileSync(SRC_CONTEXTO, 'utf8');
  const entradas = parseEntradas(md);
  const procTokens = parseProcedencias(md);
  const procBlock = md.match(/```procedencias\n[\s\S]*?```/)[0];
  checkProcedenciaBijection([md.replace(procBlock, ''), contexto], procTokens);
  const restricoes = parseRestricoes(md, procTokens);
  const eixos = parseEixos(md);
  const derivacoes = parseDerivacoes(md);
  const papeis = parsePapeis(md);
  const ancoras = parseTextBlock(md, 'ancoras');
  const calibracao = parseTextBlock(md, 'calibracao');
  const grade = parseGrade(md);
  const { templates, explicit } = parseDays(md);

  const refs = {
    agacho: Number(entradas.tm_partida_agacho_kg),
    supino: Number(entradas.tm_partida_supino_kg),
    terra: Number(entradas.tm_partida_terra_kg),
  };
  for (const [lift, kg] of Object.entries(refs)) {
    if (!Number.isFinite(kg) || kg <= 0) throw new Error(`trainingMax de partida inválido para ${lift}: ${kg}`);
  }

  // A grade de arredondamento das cargas prescritas É o menor incremento que a
  // barra do atleta monta. Declarado uma vez, aqui, e usado em toda prescrição.
  refs.incrementoKg = Number(entradas.incremento_minimo_barra_kg);
  if (!Number.isFinite(refs.incrementoKg) || refs.incrementoKg <= 0) {
    throw new Error(`incremento_minimo_barra_kg inválido: ${entradas.incremento_minimo_barra_kg}`);
  }

  checkDerivacoes(grade, derivacoes);
  const eixoViolations = checkEixos(grade, eixos);
  if (eixoViolations.length) throw new Error(`Eixos violados: ${eixoViolations.join(' · ')}`);

  const templateWeeks = Number(entradas.semanas_bloco);
  const byWeek = new Map();

  for (let weekNumber = 1; weekNumber <= templateWeeks; weekNumber += 1) {
    const days = templates.map((tpl) => {
      const dayNumber = tpl.index + 1;
      return {
        dayType: TEMPLATE_DAY_TYPES[tpl.index],
        dayLabel: tpl.dayLabel,
        dayIndex: tpl.index,
        restDaysAfter: tpl.restDaysAfter ?? 0,
        exercises: tpl.rows.map((cols, i) =>
          buildExercise(cols, weekNumber, dayNumber, i, grade, refs, papeis, `D${dayNumber}#${i + 1}`)),
      };
    });
    byWeek.set(weekNumber, days);
  }

  for (const day of explicit) {
    const key = `${day.weekNumber}-${day.dayNumber}`;
    const dayType = EXPLICIT_DAY_TYPES[key];
    if (!dayType) throw new Error(`Dia explícito sem DayType: semana ${day.weekNumber}, dia ${day.dayNumber}`);
    const entry = {
      dayType,
      dayLabel: day.dayLabel,
      dayIndex: day.dayNumber - 1,
      restDaysAfter: day.restDaysAfter ?? 0,
      exercises: day.rows.map((cols, i) =>
        buildExercise(cols, day.weekNumber, day.dayNumber, i, grade, refs, papeis,
          `S${day.weekNumber}D${day.dayNumber}#${i + 1}`)),
    };
    if (!byWeek.has(day.weekNumber)) byWeek.set(day.weekNumber, []);
    byWeek.get(day.weekNumber).push(entry);
  }

  const usedLocals = new Set();
  for (const [weekNumber, days] of byWeek) {
    const prefix = (d) => (weekNumber > templateWeeks ? `S${weekNumber}D${d.dayIndex + 1}` : `D${d.dayIndex + 1}`);
    for (const d of days) d.exercises.forEach((_, j) => usedLocals.add(`${prefix(d)}#${j + 1}`));
  }
  for (const local of papeis.keys()) {
    if (!usedLocals.has(local)) throw new Error(`Papel ${local} declarado sem linha correspondente no template`);
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
    const label = grade.byWeek.get(weekNumber)?.label;
    if (label) week.weekLabel = label;
    return week;
  });

  if (weeks.length !== EXPECTED_WEEKS) throw new Error(`Esperado ${EXPECTED_WEEKS} semanas, encontrado ${weeks.length}`);
  const totalSessions = weeks.reduce((n, w) => n + w.days.length, 0);
  if (totalSessions !== Number(entradas.sessoes_total)) {
    throw new Error(`sessoes_total=${entradas.sessoes_total} diverge das ${totalSessions} sessões geradas`);
  }
  for (const week of weeks.slice(0, templateWeeks)) {
    if (week.days.length !== Number(entradas.dias_por_semana_bloco)) {
      throw new Error(`Semana ${week.weekNumber} com ${week.days.length} dias`);
    }
  }
  // Trava derivada contra parse incompleto: linhas cruas de tabela de dia
  // contadas no markdown x linhas parseadas.
  const rawDayRows = templates.reduce((n, t) => n + t.rows.length, 0) * templateWeeks
    + explicit.reduce((n, d) => n + d.rows.length, 0);
  const rowCount = weeks.reduce((n, w) => n + w.days.reduce((m, d) => m + d.exercises.length, 0), 0);
  if (rowCount !== rawDayRows) throw new Error(`Parse incompleto: ${rowCount} blocos contra ${rawDayRows} linhas de tabela`);

  const measures = weeks.map((w) => measureWeek(w, refs));
  const expCeiling = new Map([...grade.byWeek.entries()].map(([w, r]) => [w, r.vars['EXP-TETO']]));
  for (const r of restricoes) if (r.column === 'EXP-TETO') r.ceilingByWeek = expCeiling;

  const checks = buildChecks({ measures, weeks, grade, refs, eixoViolations, eixos });
  const invariantRows = runChecks(restricoes, checks);

  const sourceHash = createHash('sha256').update(md).digest('hex').slice(0, 16);

  const header = `/**
 * ARQUIVO GERADO — não edite à mão.
 *
 * Origem: src/data/program/vena-block1/source/PROGRAMA.md
 * Gerador: scripts/build-vena-block1.mjs
 * sha256(origem): ${sourceHash}
 *
 * ${weeks.length} semanas · ${totalSessions} sessões · ${rowCount} blocos de prescrição.
 * Para regenerar: npm run build:vena
 */
import type { PrescribedWeek } from '../../../types';

/** Hash do markdown de origem que produziu este arquivo. */
export const VENA_BLOCK1_SOURCE_HASH = '${sourceHash}';

/** Levantamentos que exigem \`trainingMax\` no perfil antes de sugerir carga. */
export const VENA_BLOCK1_REQUIRES_TRAINING_MAX = ['squat', 'bench', 'deadlift'] as const;

/** Bloco \`\`\`entradas\`\`\` do markdown: dados de entrada, não medições. */
export const VENA_BLOCK1_ENTRADAS: Readonly<Record<string, string>> = ${JSON.stringify(entradas, null, 2)};

/**
 * Bloco \`\`\`restricoes\`\`\` conferido contra o programa gerado. O autor escreve
 * comparador, faixa e procedência; o NÚMERO MEDIDO é escrito aqui pela máquina.
 */
export const VENA_BLOCK1_INVARIANTS: ReadonlyArray<{
  chave: string; comparador: string; alvo: string | number; tag: string; medido: string | number; escopo: string; ok: boolean;
}> = ${JSON.stringify(invariantRows, null, 2)};

/** Eixos declarados por coluna da grade de rampas. */
export const VENA_BLOCK1_AXES: Readonly<Record<string, { eixo: string; unidade: string; regra: string }>> = ${JSON.stringify(eixos, null, 2)};

/** Âncoras de tradução RPE↔% e protocolo de calibração das semanas 1–3. */
export const VENA_BLOCK1_CALIBRATION: Readonly<{ ancoras: string[]; protocolo: string[] }> = ${JSON.stringify({ ancoras, protocolo: calibracao }, null, 2)};

/** Medições por semana. Nenhum destes números existe no markdown. */
export const VENA_BLOCK1_MEASURES = ${JSON.stringify(measures, null, 2)} as const;

export const venaBlock1Weeks: PrescribedWeek[] = `;

  const body = JSON.stringify(weeks, null, 2);
  return { content: `${header}${body};\n`, weeks: weeks.length, totalSessions, rowCount };
}

function i0(x) { return x; }

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
    console.error('vena-block1/generated.ts está desatualizado. Rode: npm run build:vena');
    process.exit(1);
  }
  console.log(`OK — ${result.weeks} semanas, ${result.totalSessions} sessões, ${result.rowCount} blocos.`);
} else {
  writeFileSync(OUT, result.content);
  console.log(
    `Gerado ${OUT}\n  ${result.weeks} semanas · ${result.totalSessions} sessões · ${result.rowCount} blocos de prescrição.`,
  );
}
