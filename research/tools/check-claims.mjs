#!/usr/bin/env node
/**
 * O compilador da base de conhecimento.
 *
 * A run 1 verificou a base com revisão adversarial — agente lendo prosa de
 * agente. Dois defeitos passaram assim mesmo: um fator inventado com cara de
 * citação, e uma conversão de unidade que nunca aconteceu entre dois documentos
 * que usavam o mesmo número com semânticas diferentes.
 *
 * Nenhum dos dois é sutil para uma máquina. O primeiro é uma citação cujo
 * verbatim não existe na transcrição. O segundo é um número atravessando frames
 * sem conversor declarado. Este arquivo recusa os dois, no build.
 *
 * Uso: node research/tools/check-claims.mjs [--verbose]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(ROOT, 'research/corpus/manifest.json');
// `--extract <dir>` existe para o teste do próprio checker: ele monta um extract
// sintético com claims deliberadamente quebradas e exige que cada uma seja
// pega. Sem isso não haveria como saber se este arquivo ainda verifica alguma
// coisa — e um checker silenciosamente quebrado é pior do que checker nenhum,
// porque carimba 4 mil claims de aprovado.
const extractIdx = process.argv.indexOf('--extract');
const EXTRACT =
  extractIdx >= 0 ? process.argv[extractIdx + 1] : join(ROOT, 'research/extract');
const VERBOSE = process.argv.includes('--verbose');

/** Quanto o `at` da claim pode divergir de onde o verbatim realmente aparece. */
const AT_TOLERANCE_SEC = 45;

/**
 * `at` de claim normativa é parágrafo, não instante: `§4.1.3`, `§6.1.j`, `§2.9.RED`.
 * Aceita letra e caixa alta no último nível porque o regulamento numera itens com
 * letra ((b), (j)) e porque a tabela de cartões não tem número — inventar um para
 * caber na regex seria fabricar uma citação que não resolve no documento.
 */
const AT_PARAGRAFO = /^§\d+(?:\.[0-9A-Za-z_]+)*$/;

const TIERS = new Set(['R', 'E', 'L', 'I', 'U', 'O']);
const SCOPES = new Set(['GERAL', 'PESSOAL']);
const CERTAINTY = new Set(['explicit', 'implied']);
// Enumerado fechado, mas não pequeno por esporte: faltar gaveta é pior do que
// ter gaveta demais. Sem `semanas` e `contagem`, o primeiro lote escreveu os
// números por extenso para não inventar frame — a trava empurrou o dado para
// fora da trava, que é o oposto do que ela existe para fazer.
const FRAMES = new Set([
  '1RM_treino', '1RM_legal', 'TM', 'pct_TM', 'pct_1RM',
  'RPE', 'RIR', 'kg', 'lb', 'reps', 'series', 'pct', 'cm',
  'seg', 'min', 'horas', 'dias', 'semanas', 'meses', 'anos', 'x_semana',
  'contagem', 'idade', 'DOTS',
  'g', 'kcal', 'ml', 'graus', 'bpm', 'pct_FCmax', 'mmHg', 'g_por_kg', 'g_por_lb',
  'polegadas', 'escala_dor', 'n_amostra', 'IMC',
  // O regulamento mede equipamento em milímetro e metro (13 mm de cinto, 1 m de
  // faixa de punho). Sem estas duas gavetas, 13 mm viraria 1,3 cm na conversão do
  // agente — que é exatamente o erro de unidade que o enumerado existe para barrar.
  'mm', 'm',
]);

const toSec = (s) => String(s).trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0);

/** Minúsculo, sem pontuação, espaço colapsado — o denominador comum entre o
 *  verbatim que o agente copiou e o ASR cru do YouTube. */
const norm = (s) =>
  s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const byRef = new Map(manifest.videos.map((v) => [v.ref, v]));

/**
 * Carrega a transcrição já normalizada, com um mapa de deslocamento → segundo.
 * É o que permite responder "em que instante este trecho é dito" e comparar com
 * o `at` declarado.
 */
const transcriptCache = new Map();
function loadTranscript(ref) {
  if (transcriptCache.has(ref)) return transcriptCache.get(ref);
  const v = byRef.get(ref);
  if (!v?.transcript) return null;
  const path = join(ROOT, v.transcript);
  if (!existsSync(path)) return null;

  const body = readFileSync(path, 'utf8').split(/^---$/m).slice(2).join('---');
  let text = '';
  const offsets = []; // { at: charOffset, sec }
  for (const m of body.matchAll(/^\[([\d:]+)\]\s*(.*)$/gm)) {
    offsets.push({ at: text.length, sec: toSec(m[1]) });
    text += `${norm(m[2])} `;
  }
  const entry = { text, offsets };
  transcriptCache.set(ref, entry);
  return entry;
}

/**
 * Carrega o texto de um documento normativo (o markdown citável do regulamento).
 * O caminho vem da própria claim, em `source.text`, e não de uma tabela aqui
 * dentro: assim ingerir uma segunda federação não exige editar o compilador.
 */
const normativeCache = new Map();
function loadNormative(path) {
  if (normativeCache.has(path)) return normativeCache.get(path);
  const full = join(ROOT, path);
  const entry = existsSync(full)
    ? { raw: readFileSync(full, 'utf8'), text: norm(readFileSync(full, 'utf8')) }
    : null;
  normativeCache.set(path, entry);
  return entry;
}

function secAtOffset(t, off) {
  let best = 0;
  for (const o of t.offsets) {
    if (o.at > off) break;
    best = o.sec;
  }
  return best;
}

// `--only R014` deixa o agente extrator rodar o compilador contra o próprio
// arquivo enquanto trabalha, em vez de descobrir os erros num passe de revisão
// depois. Compilador no loop vale mais do que revisor no fim.
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1]?.replace(/\.jsonl$/, '') : null;

// O índice de ids lê SEMPRE o extract inteiro; `--only` restringe apenas o que
// é validado. A distinção não é detalhe: contradição interessante quase sempre
// cruza vídeo — "ele diz 4 a 5 h aqui e 5 a 6 h ali" — e se `--only` escondesse
// os outros arquivos, `conflicts` apontando para fora do lote viraria erro. Um
// agente esbarrou nisso e desistiu de registrar a aresta, que é exatamente o
// dado que a base existe para guardar.
const allFiles = existsSync(EXTRACT)
  ? readdirSync(EXTRACT).filter((f) => f.endsWith('.jsonl')).sort()
  : [];
const files = allFiles.filter((f) => !only || f.startsWith(only));

if (files.length === 0) {
  console.log('\nNenhum lote em research/extract/ ainda — nada a verificar.\n');
  process.exit(0);
}

const errors = [];
const warnings = [];
const seen = new Map();
const claims = [];
const allClaims = [];

for (const file of allFiles) {
  const lines = readFileSync(join(EXTRACT, file), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const where = `${file}:${i + 1}`;
    let c;
    try {
      c = JSON.parse(line);
    } catch (err) {
      errors.push(`${where}: JSON inválido — ${err.message}`);
      return;
    }
    c._where = where;
    c._file = file;
    allClaims.push(c);
    if (files.includes(file)) claims.push(c);

    if (!c.id) return errors.push(`${where}: sem id`);
    if (seen.has(c.id)) return errors.push(`${where}: id ${c.id} duplicado (já em ${seen.get(c.id)})`);
    seen.set(c.id, where);
  });
}

// Resolve referência contra a base inteira; valida só o recorte pedido.
const byId = new Map(allClaims.map((c) => [c.id, c]));

for (const c of claims) {
  const w = `${c._where} ${c.id ?? ''}`;

  // Enumerados fechados. Valor fora da lista é erro, não interpretação livre.
  if (!TIERS.has(c.tier)) errors.push(`${w}: tier "${c.tier}" fora do enumerado`);
  if (c.scope && !SCOPES.has(c.scope)) errors.push(`${w}: scope "${c.scope}" fora do enumerado`);
  if (c.certainty && !CERTAINTY.has(c.certainty)) {
    errors.push(`${w}: certainty "${c.certainty}" fora do enumerado`);
  }
  if (!c.claim?.trim()) errors.push(`${w}: claim vazia`);

  // Procedência exigida por tier — a trava contra interpretação virar citação.
  if (c.tier === 'R') {
    if (!c.src || !c.at || !c.verbatim) {
      errors.push(`${w}: tier R exige src, at e verbatim`);
    }
    if (!c.scope) errors.push(`${w}: tier R exige scope (GERAL prescreve, PESSOAL descreve)`);
  }
  if (c.tier === 'I' && !(Array.isArray(c.basis) && c.basis.length > 0)) {
    errors.push(`${w}: tier I é interpretação e exige basis com os ids que a sustentam`);
  }
  if (c.tier === 'L' && !/\b(PMID:\s*\d{6,9}|10\.\d{4,9}\/\S+)/i.test(JSON.stringify(c.source ?? ''))) {
    errors.push(`${w}: tier L exige source com PMID ou DOI`);
  }
  // Tier O é regra, e a procedência de uma regra não é "quem disse" — é "onde está
  // escrito, em que edição". Regulamento muda de ano para ano e a versão errada
  // anula tentativa igual: sem documento, versão, URL e data de vigência, a claim
  // é boato com autoridade de norma.
  if (c.tier === 'O') {
    for (const f of ['document', 'version', 'url', 'effective']) {
      if (!c.source?.[f]) errors.push(`${w}: tier O exige source.${f}`);
    }
    if (!c.at) errors.push(`${w}: tier O exige at com o parágrafo do regulamento`);
    else if (!AT_PARAGRAFO.test(c.at)) {
      errors.push(`${w}: at "${c.at}" não é parágrafo — tier O cita §4.1.3, não 03:05`);
    }
    if (!c.verbatim?.trim()) errors.push(`${w}: tier O exige verbatim — o texto literal da regra`);
    // Regra não prescreve para uma pessoa nem narra o que alguém faz: vale para
    // todo mundo que sobe na plataforma. `scope` aqui só poderia ser ruído.
    if (c.scope) errors.push(`${w}: tier O não leva scope — regra não é GERAL nem PESSOAL`);
  }
  for (const b of c.basis ?? []) {
    if (!byId.has(b)) errors.push(`${w}: basis aponta para ${b}, que não existe`);
  }
  for (const x of c.conflicts ?? []) {
    if (!byId.has(x)) errors.push(`${w}: conflicts aponta para ${x}, que não existe`);
  }

  // Números: unidade e frame obrigatórios, enumerado fechado.
  for (const p of c.params ?? []) {
    if (!p.name) errors.push(`${w}: param sem name`);
    if (p.value === undefined || p.value === null) errors.push(`${w}: param ${p.name} sem value`);
    if (!p.frame) errors.push(`${w}: param ${p.name} sem frame — foi assim que 215 kg virou training max`);
    else if (!FRAMES.has(p.frame)) errors.push(`${w}: param ${p.name} com frame "${p.frame}" fora do enumerado`);
  }

  // Todo número na prosa precisa ter param correspondente. Número solto na
  // claim é número sem procedência, e é assim que um fator inventado entra.
  const declared = new Set((c.params ?? []).map((p) => String(p.value).replace(',', '.')));
  const stripped = (c.claim ?? '')
    .replace(/\[?R\d+[^\]]*\]?/g, ' ')   // refs de vídeo
    .replace(/\b1RM\b/gi, ' ')
    .replace(/\bV\d{3}-\d+\b/g, ' ');     // ids de claim
  for (const m of stripped.matchAll(/\d+(?:[.,]\d+)?/g)) {
    const n = m[0].replace(',', '.');
    if (!declared.has(n) && !declared.has(String(Number(n)))) {
      errors.push(`${w}: número ${m[0]} aparece na claim mas não tem param — número sem procedência`);
    }
  }

  // Número por extenso escapa da regra acima, que só enxerga dígito — e
  // "quatorze dias" é tão numérico quanto "14 dias". Fica como aviso porque a
  // lista tem falso positivo demais para barrar commit ("um" é artigo, "cem por
  // cento" é expressão), mas serve para o passe de reparo saber onde olhar.
  const EXTENSO = /\b(dois|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|c?quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cento|mil)\b/gi;
  const spelled = [...new Set([...(c.claim ?? '').matchAll(EXTENSO)].map((m) => m[0].toLowerCase()))];
  if (spelled.length > 0 && (c.params ?? []).length === 0) {
    warnings.push(`${w}: número por extenso sem param (${spelled.join(', ')})`);
  }

  // A checagem central do tier O. Conferir contra o PDF não dá; conferir contra a
  // transcrição citável dá — e é ela que o leitor abre a partir da citação, então
  // é ela que precisa concordar. Duas travas: o parágrafo existe no documento, e o
  // texto literal está mesmo naquele documento. Uma regra que ninguém consegue
  // reabrir é indistinguível de uma regra inventada.
  if (c.tier === 'O') {
    const path = c.source?.text;
    const doc = path ? loadNormative(path) : null;
    if (!path) warnings.push(`${w}: source.text ausente — verbatim não verificado`);
    else if (!doc) warnings.push(`${w}: ${path} não existe — verbatim não verificado`);
    else {
      // `at` ausente já virou erro acima; aqui só não vale derrubar o processo com
      // TypeError e esconder os outros 4 mil registros por causa de um campo vazio.
      if (c.at) {
        const alvo = c.at.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`§${alvo}(?![\\w.])`).test(doc.raw)) {
          errors.push(`${w}: parágrafo ${c.at} não existe em ${path}`);
        }
      }
      const needle = norm(c.verbatim ?? '');
      if (needle.length < 12) {
        errors.push(`${w}: verbatim curto demais (${needle.length} chars) para ser evidência`);
      } else if (!doc.text.includes(needle)) {
        errors.push(
          `${w}: verbatim NÃO aparece em ${path}\n` +
            `        procurado: "${needle.slice(0, 90)}…"`,
        );
      }
    }
    continue;
  }

  if (c.tier !== 'R') continue;

  // Citação resolve para vídeo citável.
  const v = byRef.get(c.src);
  if (!v) {
    errors.push(`${w}: src ${c.src} não existe no manifesto`);
    continue;
  }
  if (v.postRun1) {
    errors.push(`${w}: src ${c.src} é vídeo pós-run-1 e está fora da numeração citável`);
    continue;
  }

  const at = toSec(c.at);
  if (v.durationSec && at > v.durationSec) {
    errors.push(`${w}: at ${c.at} passa da duração de ${c.src} (${v.durationSec}s)`);
    continue;
  }

  // A CHECAGEM CENTRAL: o verbatim existe mesmo, e no lugar declarado.
  const t = loadTranscript(c.src);
  if (!t) {
    warnings.push(`${w}: transcrição de ${c.src} ainda não baixada — verbatim não verificado`);
    continue;
  }
  const needle = norm(c.verbatim ?? '');
  if (needle.length < 12) {
    errors.push(`${w}: verbatim curto demais (${needle.length} chars) para ser evidência`);
    continue;
  }
  const found = t.text.indexOf(needle);
  if (found < 0) {
    errors.push(
      `${w}: verbatim NÃO aparece na transcrição de ${c.src}\n` +
        `        procurado: "${needle.slice(0, 90)}…"`,
    );
    continue;
  }
  const realSec = secAtOffset(t, found);
  if (Math.abs(realSec - at) > AT_TOLERANCE_SEC) {
    errors.push(
      `${w}: verbatim existe em ${c.src} mas em ~${Math.floor(realSec / 60)}:${String(realSec % 60).padStart(2, '0')}, ` +
        `não em ${c.at} (tolerância ${AT_TOLERANCE_SEC}s)`,
    );
  }
}

const tierCount = new Map();
const topicCount = new Map();
for (const c of claims) {
  tierCount.set(c.tier, (tierCount.get(c.tier) ?? 0) + 1);
  for (const t of c.topic ?? []) topicCount.set(t, (topicCount.get(t) ?? 0) + 1);
}

console.log(`\nBase de conhecimento — ${claims.length} claims em ${files.length} lote(s)`);
console.log(`  tiers ..................... ${[...tierCount].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  ')}`);
console.log(`  tópicos distintos ......... ${topicCount.size}`);
console.log(`  vídeos com claim .......... ${new Set(claims.filter((c) => c.src).map((c) => c.src)).size}`);
console.log(`  contradições registradas .. ${claims.filter((c) => c.conflicts?.length).length}`);

if (VERBOSE) {
  console.log('\n  tópicos mais densos:');
  for (const [t, n] of [...topicCount].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`    ${String(n).padStart(4)}  ${t}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} aviso(s):`);
  for (const x of warnings.slice(0, 15)) console.log(`  ⚠ ${x}`);
  if (warnings.length > 15) console.log(`  … e mais ${warnings.length - 15}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 30)) console.error(`  ✗ ${e}`);
  if (errors.length > 30) console.error(`  … e mais ${errors.length - 30}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ toda claim resolve, todo verbatim existe, todo número tem frame\n');
