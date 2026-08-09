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
 * A base tem mais de um corpus, e este arquivo não pede para saber qual: o
 * prefixo do ref já diz (`R159` é Vena, `G042` é Blevins). Ver o índice de
 * vídeos, mais abaixo, para o porquê de a claim não declarar a fonte.
 *
 * Uso: node research/tools/check-claims.mjs [--verbose]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SOURCES, paths } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
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

/**
 * O vocabulário de tópicos, lido do PRÓPRIO protocolo.
 *
 * `PROTOCOLO-EXTRACAO.md` diz, em caixa alta, que o vocabulário é FECHADO — e
 * durante toda a extração nada verificou isso. Uma claim usou o tópico `idade`,
 * que nunca existiu na lista, e passou. Regra sem trava é sugestão, e uma gaveta
 * inventada é pior do que parece: sem banco vetorial, `topic` É o mecanismo de
 * recuperação, e um sinônimo solto esconde a claim de quem procura.
 *
 * A lista é lida do markdown em vez de duplicada aqui porque já erramos assim
 * uma vez: o enumerado de `frame` cresceu no código e o SCHEMA.md ficou
 * descrevendo outra coisa. Documento e trava precisam ser o mesmo objeto.
 */
const TOPICS = (() => {
  const md = readFileSync(join(ROOT, 'research/kb/PROTOCOLO-EXTRACAO.md'), 'utf8');
  const bloco = /## Vocabulário de tópicos[^\n]*\n[\s\S]*?```\n([\s\S]*?)```/.exec(md);
  if (!bloco) throw new Error('vocabulário de tópicos não encontrado em PROTOCOLO-EXTRACAO.md');
  return new Set(bloco[1].split(/\s+/).filter(Boolean));
})();

const toSec = (s) => String(s).trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0);

/** Minúsculo, sem pontuação, espaço colapsado — o denominador comum entre o
 *  verbatim que o agente copiou e o ASR cru do YouTube. */
const norm = (s) =>
  s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

/**
 * O índice de vídeos é a UNIÃO dos manifestos existentes, não o de uma fonte
 * escolhida por flag.
 *
 * A claim não declara de que corpus veio, e não deve declarar: o prefixo do ref
 * (`R159`, `G042`) já carrega essa informação. Pedir que ela repita a fonte
 * criaria um segundo lugar onde a mesma verdade pode divergir — e uma claim com
 * `source: vena` e `src: G042` seria aceita por um checker que confiasse no
 * campo em vez do ref.
 *
 * O único jeito de isso dar errado é dois corpora usarem o mesmo prefixo.
 * `sources.mjs` proíbe, mas a checagem fica aqui também: sob colisão, um ref
 * ambíguo validaria uma citação inexistente sem uma linha de reclamação.
 */
const byRef = new Map();
const donoDoRef = new Map();
const fontePorPrefixo = new Map();
for (const src of Object.values(SOURCES)) {
  const anterior = fontePorPrefixo.get(src.refPrefix);
  if (anterior) {
    console.error(`prefixo "${src.refPrefix}" usado por "${anterior.id}" e por "${src.id}" — refs seriam ambíguos`);
    process.exit(1);
  }
  fontePorPrefixo.set(src.refPrefix, src);

  // Fonte declarada e ainda não construída é normal (o corpus nasce antes do
  // manifesto); só não pode ser confundida com fonte cujo manifesto sumiu.
  const file = paths(src, ROOT).manifest;
  if (!existsSync(file)) continue;
  for (const v of JSON.parse(readFileSync(file, 'utf8')).videos ?? []) {
    if (byRef.has(v.ref)) {
      console.error(`ref ${v.ref} existe em "${donoDoRef.get(v.ref)}" e em "${src.id}" — manifesto ambíguo`);
      process.exit(1);
    }
    byRef.set(v.ref, v);
    donoDoRef.set(v.ref, src.id);
  }
}
if (byRef.size === 0) {
  console.error('\nnenhum manifesto construído — rode build-manifest.mjs antes de checar claims.\n');
  process.exit(1);
}

/** Refs escritos na prosa da claim, de qualquer corpus — `[R159 @03:05]`, `G042`. */
const REF_NA_PROSA = new RegExp(`\\[?[${[...fontePorPrefixo.keys()].join('')}]\\d+[^\\]]*\\]?`, 'g');

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
  for (const t of c.topic ?? []) {
    if (!TOPICS.has(t)) {
      errors.push(`${w}: tópico "${t}" fora do vocabulário fechado do PROTOCOLO-EXTRACAO.md`);
    }
  }
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
  // Tier E é "um elite do roster disse". Sem QUEM e SEM ONDE, isso é boato com
  // sotaque de autoridade — e o roster curado existe justamente porque a run 1
  // carregava elites que ninguém conseguia reabrir. Nome sem URL não reabre;
  // URL sem nome não deixa auditar se a pessoa está mesmo no roster.
  if (c.tier === 'E') {
    for (const f of ['name', 'url']) {
      if (!c.source?.[f]) errors.push(`${w}: tier E exige source.${f}`);
    }
    if (c.source?.url && !/^https?:\/\//i.test(String(c.source.url))) {
      errors.push(`${w}: tier E exige source.url navegável (http/https), não "${c.source.url}"`);
    }
  }
  // Tier U é o que VOCÊ disse, e o que você diz muda: peso, lesão, meta de
  // competição. Sem a data da conversa não dá para aplicar "o recente vence" —
  // que no tier R vem de graça, do manifesto, e aqui só pode vir da claim.
  if (c.tier === 'U') {
    if (!c.source?.date) errors.push(`${w}: tier U exige source.date com a data da conversa`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(c.source.date))) {
      errors.push(`${w}: tier U exige source.date em ISO (YYYY-MM-DD), não "${c.source.date}"`);
    }
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
    .replace(REF_NA_PROSA, ' ')          // refs de vídeo, de qualquer corpus
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
  // Par anatômico, trio idiomático e nome próprio não são medida: "os dois
  // cotovelos" e "os três movimentos" enumeram coisas que já vêm em número fixo,
  // e "ômega três" é nome. Sem esta exclusão sobram 18 avisos que ninguém pode
  // resolver — e aviso que não tem conserto ensina a ignorar avisos.
  // Artigo definido antes do numeral marca enumeração de conjunto já conhecido
  // ("os dois sítios", "nos dois", "ambas as mãos"), não medida. Prescrição de
  // verdade sai escrita com dígito — "2 séries", não "as duas séries".
  const NAO_E_MEDIDA =
    /\b(?:os|as|nos|nas|d[oa]s|aos|às|ambos|ambas|nenhum dos|nenhuma das)\s+(?:dois|duas|tr[êe]s)\b|\b[óo]mega\s+tr[êe]s\b|\b(?:dois|duas|tr[êe]s)\s+(?:cotovelos?|m[ãa]os?|joelhos?|p[ée]s?|ombros?|esc[áa]pulas?|movimentos?)\b/gi;
  const prosa = (c.claim ?? '').replace(NAO_E_MEDIDA, ' ');
  const spelled = [...new Set([...prosa.matchAll(EXTENSO)].map((m) => m[0].toLowerCase()))];
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

  // ── claim corrigida por áudio: `verified: "whisper"` ─────────────────────
  //
  // O passe de verificação cirúrgica (`verify-suspects.mjs`) re-transcreve com
  // Whisper as janelas onde a legenda automática do YouTube pode ter estragado
  // um número ou comido um `n't`. Quando o áudio contradiz a legenda, o dado
  // certo é o do áudio — mas escrevê-lo em `verbatim` quebraria a checagem
  // central logo abaixo, que confere o verbatim contra a TRANSCRIÇÃO DA LEGENDA,
  // e a legenda continua com o texto errado.
  //
  // A saída fácil seria afrouxar aquela checagem. Seria a pior: ela é a única
  // trava que impede interpretação de virar citação, e o preço de abrandá-la é
  // grande demais para pagar por 4 claims.
  //
  // A decisão, então: `verbatim` NUNCA muda. Ele é o registro do que a fonte
  // citável diz, defeitos inclusive, e é o que mantém a procedência auditável —
  // quem abrir a transcrição no instante declarado tem que encontrar aquilo ali.
  // O texto do áudio entra em `verbatimWhisper`, campo próprio, e a divergência
  // entre os dois passa a ser DADO em vez de ser um erro apagado. `claim` e
  // `params` seguem o áudio, porque é o áudio que está certo.
  //
  // Daí esta regra: quem afirma ter sido corrigido por Whisper tem que exibir o
  // que o Whisper ouviu. Sem isso, `verified: "whisper"` viraria um carimbo que
  // dispensa evidência — que é exatamente a doença que esta base trata.
  if (c.verified === 'whisper') {
    const vw = norm(c.verbatimWhisper ?? '');
    if (vw.length < 12) {
      errors.push(`${w}: verified "whisper" exige verbatimWhisper com o que o áudio diz`);
    }
    if (c.suspect) errors.push(`${w}: verified "whisper" e suspect true ao mesmo tempo — ou resolveu ou não resolveu`);
  }

  if (c.tier !== 'R') continue;

  // Citação resolve para vídeo citável, em algum corpus. As duas falhas são
  // diferentes e merecem mensagens diferentes: prefixo desconhecido é ref de uma
  // fonte que ninguém registrou (erro de digitação ou corpus por declarar);
  // prefixo conhecido e número ausente é citação para vídeo que não existe.
  const v = byRef.get(c.src);
  if (!v) {
    const pfx = /^([A-Za-z]+)/.exec(String(c.src ?? ''))?.[1] ?? '';
    const fonte = fontePorPrefixo.get(pfx);
    errors.push(
      fonte
        ? `${w}: src ${c.src} não existe no manifesto de ${fonte.name}`
        : `${w}: src ${c.src} tem prefixo "${pfx}", que não pertence a nenhuma fonte conhecida ` +
          `(${[...fontePorPrefixo.keys()].join(', ')})`,
    );
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
