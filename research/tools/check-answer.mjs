#!/usr/bin/env node
/**
 * O compilador da RESPOSTA — a trava que faltava na medição.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE ARQUIVO EXISTE
 *
 * Em 09/08/2026 a base foi medida contra 29 perguntas. Quatro perguntas-canário
 * entraram sem etiqueta; duas delas eram IMPOSSÍVEIS — uma pedia PMIDs (a base
 * tem zero claims tier L) e a outra pedia o peaking do Blevins (na hora, zero
 * claims G). As duas foram julgadas "responde bem".
 *
 * O avaliador respondeu do próprio conhecimento e o julgador comprou. Isso não
 * torna o placar "3 falhas em 29" pessimista ou otimista por pouco: torna-o um
 * TETO. O número real de falhas é desconhecido e ≥3, e sem os canários o
 * relatório teria dito "a base está saudável".
 *
 * O `check-claims.mjs` já resolveu a versão deste problema do lado da base:
 * número na claim sem `param` que o sustente é fabricação, e o build recusa.
 * Este arquivo é a mesma intuição do lado da resposta:
 *
 *     NÚMERO NA RESPOSTA QUE NÃO APARECE EM NENHUMA CLAIM CITADA
 *     É CONHECIMENTO VINDO DE FORA DA BASE.
 *
 * Isso é PROVA, não estimativa, e pega o caso de maior valor de todos:
 * prescrição inventada com número — a que vira carga na barra.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELE **NÃO** PEGA — leia antes de confiar
 *
 * 1. **Prosa errada sem número.** "Ele recomenda agachar antes de puxar" não tem
 *    dígito nenhum; se for invenção, este arquivo aprova. Continua sendo
 *    trabalho do julgador humano ler o verbatim das claims citadas.
 * 2. **Número certo pelo motivo errado.** Se a resposta cita RPE 6 e a claim
 *    citada diz RPE 6 sobre OUTRO bloco, o número casa e passa. Ele prova
 *    FIDELIDADE À CITAÇÃO, não pertinência da citação.
 * 3. **Correção da fonte.** Se o Vena disse um número errado no vídeo, a claim
 *    guarda e a resposta repete: tudo verde. Determinismo prova fidelidade à
 *    fonte, nunca correção da fonte. É o limite declarado do `verification.md`
 *    e vale aqui igual.
 * 4. **Número por extenso na resposta.** "cinco séries" não é enxergado. Do lado
 *    da EVIDÊNCIA o extenso é traduzido para dígito (para não gerar falso
 *    positivo); do lado da RESPOSTA, não — a lista de falso positivo em pt-BR é
 *    grande demais ("um" é artigo) e um aviso que ninguém consegue resolver
 *    ensina a ignorar avisos.
 * 5. **Omissão.** Resposta que esquece a condição de segurança passa limpa. É o
 *    critério T3 da AVALIACAO.md, e é julgamento.
 * 6. **A anistia do `tier I … basis:` é CEGA e larga.** O marcador isenta TODO
 *    número numa janela de ±200 caracteres (≈400 no total, uns 60 termos), sem
 *    conferir que o número seja aritmeticamente alcançável a partir do `basis`.
 *    Um ataque real: um marcador no título e 11 doses fabricadas no parágrafo
 *    saem com exit 0, inclusive com `--estrito`. O relatório LISTA os derivados
 *    numa seção própria — é ali que o julgador tem de olhar, porque a trava não
 *    olha. Ver `research/kb/INSTRUMENTO.md`.
 * 7. **Citar um documento admite o documento INTEIRO.** `research/kb/IPF-REALIDADE.md`
 *    sozinho põe 467 números distintos na piscina, sem nenhuma noção de
 *    localidade: o número casa com o arquivo, não com a frase. Duas citações de
 *    documento denso dão procedência a ~3/4 de um programa inventado. Cite
 *    documento para dar contexto; a prova continua sendo o id.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE CONTA COMO PROCEDÊNCIA (a "piscina" de números)
 *
 *   a) as claims cujos ids a resposta cita — `params`, prosa da claim, verbatim
 *      e verbatimWhisper, com números por extenso (pt e en) traduzidos;
 *   b) o enunciado da pergunta (`--pergunta`) — número que o próprio enunciado
 *      deu não é conhecimento externo;
 *   c) os documentos do repositório que a RESPOSTA cita pelo caminho
 *      (`research/design.md`, `src/types/index.ts`), resolvidos e lidos. Citar um
 *      caminho que não existe é erro, pelo mesmo motivo que id que não resolve.
 *   d) `--fonte <arquivo>` na linha de comando, para o caso de o operador querer
 *      admitir um documento que a resposta não nomeou.
 *
 * Conversão de unidade NÃO é procedência: 225 lb citado e 102 kg na resposta é
 * número novo. O SCHEMA.md já exige que cruzar frame apareça como claim `I` com
 * `basis`; aqui a exigência é a mesma, e a saída é declarar (ver abaixo).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * COMO DECLARAR UM NÚMERO DERIVADO
 *
 * O critério T5 da AVALIACAO.md já manda: número que a base não tem e o
 * respondedor construiu sai como `tier I` com `basis: [ids]`. Aqui isso vira
 * mecânico — um número dentro de uma janela de 200 caracteres de um marcador
 *
 *     tier I ... basis: V014-03, G001-11
 *
 * é classificado como DERIVADO DECLARADO em vez de órfão, e os ids do `basis`
 * são resolvidos como qualquer outro. Ele aparece em seção própria no relatório,
 * para o julgador ver quanto da resposta é construção e não citação.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DUAS SEVERIDADES, E POR QUÊ
 *
 * Órfão COM UNIDADE ao lado ("85 %", "6 séries", "RPE 9", "13 mm") é ERRO: é
 * prescrição, é o que vira carga, e é o caso que motivou o arquivo.
 * Órfão SEM UNIDADE ("as 3 alavancas") é AVISO: quase todo falso positivo mora
 * aqui, e falso positivo manda alguém reescrever resposta certa — o custo disso
 * é ensinarem a ignorar o aviso, que é como se perde um checker.
 * `--estrito` promove aviso a erro quando se quer o rigor máximo.
 *
 * Uso:
 *   node research/tools/check-answer.mjs --resposta r.md [--pergunta q.md]
 *   node research/tools/check-answer.mjs --resposta - --ids "V014-03,G001-11"
 *   node research/tools/check-answer.mjs --resposta r.md --json --estrito
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, paraNumero, RX_NUMERO, numerosCrus, numerosPorExtenso, numerosDaClaim } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};
const args = (flag) => {
  const out = [];
  process.argv.forEach((a, i) => {
    if (a === flag && process.argv[i + 1]) out.push(process.argv[i + 1]);
  });
  return out;
};

const EXTRACT = arg('--extract') ?? join(ROOT, 'research/extract');
const JSON_OUT = process.argv.includes('--json');
const ESTRITO = process.argv.includes('--estrito');
/** Distância máxima, em caracteres, entre o marcador `tier I … basis:` e o número que ele cobre. */
const JANELA_DERIVADO = 200;
/** Documento citado maior que isto não entra na piscina: seria admitir o repositório inteiro. */
const MAX_DOC_BYTES = 512 * 1024;

// ── entrada ──────────────────────────────────────────────────────────────────

const respostaPath = arg('--resposta');
if (!respostaPath) {
  console.error(
    'uso: check-answer.mjs --resposta <arquivo|-> [--pergunta <arquivo|texto>] [--ids "a,b"] [--fonte <arquivo>] [--json] [--estrito]',
  );
  process.exit(2);
}

function lerTexto(p, rotulo) {
  if (p === '-') return readFileSync(0, 'utf8');
  if (existsSync(p)) return readFileSync(p, 'utf8');
  // `--pergunta` aceita o texto direto porque o enunciado costuma ser uma linha
  // e obrigar um arquivo para isso só produziria enunciado não passado.
  if (rotulo === 'pergunta') {
    // Aceitar texto direto é conveniente e tem um preço: um typo no caminho vira
    // enunciado silenciosamente, a piscina do enunciado esvazia, e a resposta
    // certa passa a acusar cada número que o atleta trouxe da pergunta. Se
    // PARECE caminho, cobra-se que exista.
    if (/[\\/]/.test(p) || /\.(md|txt|json)$/i.test(p)) {
      console.error(`✗ --pergunta "${p}" parece um caminho e não existe — sem o enunciado, todo número dele vira órfão`);
      process.exit(2);
    }
    return p;
  }
  console.error(`✗ ${rotulo} não encontrada: ${p}`);
  process.exit(2);
}

const resposta = lerTexto(respostaPath, 'resposta');
const perguntaArg = arg('--pergunta');
const pergunta = perguntaArg ? lerTexto(perguntaArg, 'pergunta') : '';

const { claims, porId } = carregarClaims(EXTRACT);
if (claims.length === 0) {
  console.error(`✗ nenhuma claim em ${EXTRACT} — não há contra o que medir a resposta`);
  process.exit(2);
}

// ── números ─────────────────────────────────────────────────────────────────
//
// `paraNumero`, `numerosCrus`, `numerosPorExtenso` e `numerosDaClaim` moram em
// `kb.mjs`. Moraram aqui, duplicadas no `check-canarios.mjs`, e as duas cópias já
// tinham divergido em silêncio — que é o defeito que este projeto documenta na
// abertura do SCHEMA.md e acabou cometendo dentro do próprio instrumento.
//
// A assimetria segue de propósito: o extenso é traduzido do lado da EVIDÊNCIA
// (uma claim diz "cinco séries" e a resposta escreve "5", que é a tradução
// correta — sem a tabela, resposta certa viraria órfão) e NÃO do lado da
// resposta, onde a lista de falso positivo em pt-BR é grande demais.

// ── ids citados ──────────────────────────────────────────────────────────────

const RX_ID = /\b[A-Z]\d{3}-\d+\b/g;
const idsExtras = (arg('--ids') ?? '').split(/[\s,;]+/).filter((x) => /^[A-Z]\d{3}-\d+$/.test(x));
const idsCitados = [...new Set([...String(resposta).matchAll(RX_ID)].map((m) => m[0]), ...idsExtras)];

const erros = [];
const avisos = [];

const claimsCitadas = [];
const idsMortos = [];
for (const id of idsCitados) {
  const c = porId.get(id);
  if (c) claimsCitadas.push(c);
  else {
    idsMortos.push(id);
    // O mesmo veredito do check-evidence.mjs, e pela mesma razão: id fabricado é
    // indistinguível de id real numa string, e uma medição que aceita evidência
    // fabricada mede o agente, não a base.
    erros.push(`id ${id} citado NÃO EXISTE na base — evidência fabricada, descarte a resposta inteira`);
  }
}

// ── documentos do repositório citados pela resposta ──────────────────────────

const RX_CAMINHO = /\b(?:research|src|scripts|public|docs)\/[\w./-]+\.(?:md|mjs|ts|tsx|js|jsonc?|jsonl|py)\b/g;
const caminhosCitados = [...new Set([...String(resposta).matchAll(RX_CAMINHO)].map((m) => m[0]))];
const documentos = [];
for (const rel of [...caminhosCitados, ...args('--fonte')]) {
  if (rel.includes('*')) continue;
  const full = join(ROOT, rel);
  if (!existsSync(full)) {
    erros.push(`caminho ${rel} citado na resposta não existe no repositório — citação fabricada`);
    continue;
  }
  if (statSync(full).isDirectory()) continue;
  if (statSync(full).size > MAX_DOC_BYTES) {
    avisos.push(`documento ${rel} é grande demais (>${MAX_DOC_BYTES} bytes) e não entrou na procedência`);
    continue;
  }
  documentos.push({ rel, texto: readFileSync(full, 'utf8') });
}

// ── as piscinas ──────────────────────────────────────────────────────────────

const poolClaims = new Set();
for (const c of claimsCitadas) for (const n of numerosDaClaim(c)) poolClaims.add(n);

const poolPergunta = new Set([
  ...numerosCrus(pergunta).map((x) => x.n),
  ...numerosPorExtenso(pergunta),
]);

const poolDoc = new Map(); // número → primeiro documento onde apareceu
for (const d of documentos) {
  for (const x of numerosCrus(d.texto)) if (!poolDoc.has(x.n)) poolDoc.set(x.n, d.rel);
  for (const n of numerosPorExtenso(d.texto)) if (!poolDoc.has(n)) poolDoc.set(n, d.rel);
}

// ── mascaramento: o que NÃO é número de prescrição ───────────────────────────
//
// Cada classe abaixo já produziu, ou produziria, um falso positivo. Falso
// positivo aqui manda alguém reescrever uma resposta certa — e o preço disso é
// ensinarem a ignorar o aviso, que é o único jeito de perder um checker de vez.
// Mascarar preserva os índices (troca por espaço do mesmo tamanho) para o
// contexto impresso no relatório continuar batendo com o texto original.

const srcConhecidos = [...new Set(claims.map((c) => String(c.src)).filter(Boolean))]
  .sort((a, b) => b.length - a.length)
  .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const prefixosDeId = [...new Set(claims.map((c) => /^([A-Z]+)/.exec(String(c.id ?? ''))?.[1]).filter(Boolean))];

const MASCARAS = [
  ['id-de-claim', RX_ID],
  // PMID e DOI têm checagem própria, logo abaixo, com mensagem própria. Deixá-los
  // também na varredura de números daria dois alarmes para o mesmo defeito, e
  // alarme duplicado treina quem lê a somar em vez de agir.
  ['identificador-de-literatura', /\bPMID:?\s*\d{6,9}\b/gi],
  ['identificador-de-literatura', /\b10\.\d{4,9}\/[^\s)>,;]+/g],
  ['ref-de-video', srcConhecidos.length ? new RegExp(`\\b(?:${srcConhecidos.join('|')})\\b`, 'g') : /$^/g],
  ['ref-de-video', prefixosDeId.length ? new RegExp(`\\b[${prefixosDeId.join('')}]\\d{2,4}\\b`, 'g') : /$^/g],
  ['url', /https?:\/\/\S+/g],
  ['caminho', RX_CAMINHO],
  ['data-iso', /\b\d{4}-\d{2}-\d{2}\b/g],
  ['timestamp', /\b\d{1,2}:\d{2}(?::\d{2})?\b/g],
  ['paragrafo', /§\s*\d[\w.]*/g],
  ['ano', /\b(?:19|20)\d{2}\b/g],
  // `1RM`, `3RM`: o "RM" é a unidade, o dígito é o nome dela. `check-claims.mjs`
  // faz o mesmo strip do lado da claim.
  ['nome-1rm', /\b\d+\s*RM\b/gi],
  // Nome de programa: 5/3/1, 5-3-1, Sheiko #37, Ph3, GZCL, T3. A regra genérica
  // é LETRA-antes-de-dígito (Ph3, T3, Q07, Semana1) — nunca dígito-antes-de-letra,
  // que engoliria "93kg" e esconderia uma prescrição de verdade.
  ['nome-proprio', /\b\d+[/-]\d+[/-]\d+\b/g],
  ['nome-proprio', /#\d+\b/g],
  // O `i` é obrigatório: sem ele o lookahead era case-sensitive e "RPE9" ficava
  // visível enquanto "rpe9" era mascarado como nome próprio e sumia da varredura.
  ['nome-proprio', /\b(?!(?:RPE|RIR|RM|kg|lb)\d)[A-Za-zÀ-ú]{1,8}\d+(?:[A-Za-zÀ-ú]\d*)*\b/gi],
  // Marcador de lista e de nota de rodapé. "1." abrindo linha é numeração de
  // item, não dose.
  ['marcador-de-lista', /^[ \t]*\d+[.)](?=\s)/gm],
  ['nota', /\[\d{1,3}\]/g],
];

let mascarado = String(resposta);
const isentos = [];
for (const [classe, rx] of MASCARAS) {
  mascarado = mascarado.replace(rx, (m, ...rest) => {
    const idx = typeof rest.at(-2) === 'number' ? rest.at(-2) : rest.at(-3);
    if (/\d/.test(m)) isentos.push({ classe, texto: m, idx });
    return ' '.repeat(m.length);
  });
}

// ── janelas de derivação declarada (`tier I … basis:`) ───────────────────────

const RX_DERIVADO = /tier\s*:?\s*["']?I["']?[\s\S]{0,120}?basis\s*:?\s*\[?([^\]\n.;]*)/gi;
const janelasDerivado = [];
for (const m of String(resposta).matchAll(RX_DERIVADO)) {
  const basis = [...String(m[1]).matchAll(RX_ID)].map((x) => x[0]);
  if (basis.length === 0) {
    erros.push(
      'marcador `tier I` sem basis com ids que resolvam — interpretação sem base declarada ' +
        'é exatamente a lavagem de I para R que o SCHEMA.md proíbe',
    );
    continue;
  }
  for (const b of basis) {
    if (!porId.has(b)) erros.push(`basis ${b} do marcador tier I não existe na base — derivação sem base real`);
  }
  janelasDerivado.push({ ini: m.index - JANELA_DERIVADO, fim: m.index + m[0].length + JANELA_DERIVADO, basis });
}
const dentroDeDerivado = (i) => janelasDerivado.find((j) => i >= j.ini && i <= j.fim) ?? null;

// ── unidade colada no número ─────────────────────────────────────────────────
//
// A fronteira entre ERRO e AVISO. Unidade ao lado é o que transforma um dígito
// em dose; é o mesmo raciocínio do `frame` no SCHEMA.md, aplicado a prosa livre.

// A lista nasceu só com as ABREVIAÇÕES, e isso abria o buraco mais caro que este
// arquivo já teve: "5 cm" era ERRO e "5 centímetros" era aviso. Uma resposta que
// inventava a tolerância de profundidade da IPF ("30 milímetros"), o corte de
// água ("4 quilos") e a intensidade ("82 por cento") saía com exit 0 e um ✓ — e
// esses três são, literalmente, as falhas que os canários C11 e C13 dizem que
// reprovam. Unidade por extenso é a forma NORMAL de escrever em pt-BR; deixá-la
// de fora não é conservadorismo, é medir a grafia em vez da dose.
const UNIDADE_DEPOIS =
  /^\s*(?:%|por\s*cento|kgs?|quilogramas?|quilos?|lbs?|libras?|reps?|repeti[çc][õo]es|s[ée]ries?|sets?|semanas?|dias?|m[êe]s(?:es)?|anos?|min\b|minutos?|seg\b|segundos?|h\b|horas?|kcal|cal\b|calorias?|gramas?|g\b|ml\b|mililitros?|litros?|l\b|cm\b|cent[íi]metros?|mm\b|mil[íi]metros?|m\b|metros?|polegadas?|graus?|°|bpm|mmHg|DOTS|RPE|RIR|pontos?|reais?|vezes|x\s*(?:\/|por)\s*semana|x\b|×)/i;
// `i` pelo mesmo motivo da máscara: "rpe 9" e "RPE 9" são a mesma dose, e a
// severidade não pode depender do caps lock de quem respondeu.
const UNIDADE_ANTES = /(?:RPE|RIR|DOTS|semanas?|s[ée]ries?|sets?|reps?|zona|n\s*=)\s*$/i;

// ── varredura ────────────────────────────────────────────────────────────────

const CTX = 42;
const contexto = (i, len) =>
  String(resposta)
    .slice(Math.max(0, i - CTX), i + len + CTX)
    .replace(/\s+/g, ' ')
    .trim();

const numeros = [];
for (const m of mascarado.matchAll(RX_NUMERO)) {
  const n = paraNumero(m[0]);
  if (n === null) continue;
  const idx = m.index;
  const depois = String(resposta).slice(idx + m[0].length, idx + m[0].length + 16);
  const antes = String(resposta).slice(Math.max(0, idx - 12), idx);
  const temUnidade = UNIDADE_DEPOIS.test(depois) || UNIDADE_ANTES.test(antes);

  let origem = null;
  if (poolClaims.has(n)) origem = 'claim-citada';
  else if (poolPergunta.has(n)) origem = 'enunciado';
  else if (poolDoc.has(n)) origem = `documento:${poolDoc.get(n)}`;

  const der = origem ? null : dentroDeDerivado(idx);
  const classe = origem
    ? 'com-procedencia'
    : der
      ? 'derivado-declarado'
      : temUnidade
        ? 'orfao-com-unidade'
        : 'orfao-sem-unidade';

  numeros.push({ n, bruto: m[0], idx, classe, origem, temUnidade, basis: der?.basis ?? null, contexto: contexto(idx, m[0].length) });
}

for (const x of numeros) {
  if (x.classe === 'orfao-com-unidade') {
    erros.push(
      `número ${x.bruto} não aparece em nenhuma claim citada — conhecimento vindo de fora\n` +
        `        …${x.contexto}…`,
    );
  } else if (x.classe === 'orfao-sem-unidade') {
    avisos.push(`número ${x.bruto} sem procedência e sem unidade — …${x.contexto}…`);
  }
}

// ── literatura: PMID e DOI ───────────────────────────────────────────────────
//
// O canário que passou pedia PMIDs numa base com ZERO claims tier L. Um PMID é
// verificável sem julgamento nenhum: ou ele está numa claim citada, ou a
// resposta o trouxe de fora. Isto é a checagem que teria pego aquele caso.

const tierL = claims.filter((c) => c.tier === 'L').length;
const RX_PMID = /\bPMID:?\s*\d{6,9}\b/gi;
const RX_DOI = /\b10\.\d{4,9}\/[^\s)>,;]+/g;
const jsonCitadas = claimsCitadas.map((c) => JSON.stringify(c)).join(' ');
for (const rx of [RX_PMID, RX_DOI]) {
  for (const m of String(resposta).matchAll(rx)) {
    if (!jsonCitadas.includes(m[0])) {
      erros.push(
        `identificador de literatura "${m[0]}" não aparece em nenhuma claim citada ` +
          `(a base tem ${tierL} claim(s) tier L) — literatura fabricada`,
      );
    }
  }
}

// Autor-ano é a forma educada da mesma coisa, nas duas grafias que aparecem:
// "(Schoenfeld, 2019)" e "Schoenfeld (2019)". Fica em AVISO, não em erro, porque
// "(Vena, 2021)" pode ser referência a um vídeo do próprio corpus — barrar isso
// seria falso positivo em cima de uma resposta correta.
//
// A terceira forma entrou depois de um ataque: as duas primeiras exigiam
// PARÊNTESES em algum lugar, e a bibliografia normal não usa parênteses —
// "Schoenfeld et al., 2016, J Strength Cond Res" saía com exit 0 e ZERO avisos,
// com os anos comidos pela máscara `ano`. Era o canário C06 inteiro passando pela
// forma mais comum de escrever uma referência inventada.
//
// A terceira forma exige `et al.` ou dois sobrenomes ligados por e/and/&, e não
// só "Sobrenome, ano" — senão "Vena, 2021" e "IPF, 2026" virariam ruído, e ruído
// no aviso é como se ensina a ignorar o aviso.
const RX_AUTOR_ANO = [
  /\(([A-ZÀ-Ú][\wÀ-ú.'-]+(?:\s+(?:e|and|&)\s+[\wÀ-ú.'-]+|\s+et\s+al\.?)?),\s*(?:19|20)\d{2}\)/g,
  /\b([A-ZÀ-Ú][\wÀ-ú-]{2,}(?:\s+(?:e|and|&)\s+[A-ZÀ-Ú][\wÀ-ú-]{2,})?(?:\s+et\s+al\.?)?)\s*,?\s*\((?:19|20)\d{2}\)/g,
  /\b([A-ZÀ-Ú][\wÀ-ú-]{2,}(?:\s+(?:e|and|&)\s+[A-ZÀ-Ú][\wÀ-ú-]{2,}|\s+et\s+al\.?))\s*,\s*(?:19|20)\d{2}\b/g,
];
const autoresVistos = new Set();
for (const rx of RX_AUTOR_ANO) {
  for (const m of String(resposta).matchAll(rx)) {
    // A chave de deduplicação é só o AUTOR: a mesma referência casa em mais de uma
    // forma, e dois avisos para uma citação treinam quem lê a somar em vez de agir.
    const chave = m[1].replace(/\s+/g, ' ').replace(/\.$/, '').toLowerCase();
    if (autoresVistos.has(chave)) continue;
    autoresVistos.add(chave);
    avisos.push(`citação autor-ano "${m[1]}" sem claim tier L que a sustente (tier L na base: ${tierL})`);
  }
}

// ── FONTE ÚNICA (critério T4 da AVALIACAO.md), mecanizado ────────────────────

const prefixosCitados = new Set(claimsCitadas.filter((c) => c.tier === 'R').map((c) => String(c.src).slice(0, 1)));
if (prefixosCitados.size === 1 && claimsCitadas.some((c) => c.tier === 'R') && !/FONTE\s+ÚNICA/i.test(resposta)) {
  avisos.push(
    `todo o suporte tier R vem de um corpus só (prefixo ${[...prefixosCitados][0]}) e a resposta não carrega a marca ` +
      '"FONTE ÚNICA" — T4 da AVALIACAO.md',
  );
}

// Resposta com dose e nenhuma citação: não é lacuna de procedência, é ausência dela.
//
// O `!x.origem` não é detalhe. Sem ele, a RECUSA CORRETA reprovava: o canário C10
// espera "a base não tem isso" repetindo os 87 kg e a classe de 93 kg do próprio
// enunciado, sem citar id nenhum — e o checker acusava "zero procedência" duas
// linhas depois de ter classificado os dois números como `com-procedencia:
// enunciado`. Falso positivo em cima da resposta modelo de um canário é o pior
// caso possível: ensina a ignorar exatamente a saída que mede.
if (idsCitados.length === 0 && documentos.length === 0 && numeros.some((x) => x.temUnidade && !x.origem)) {
  erros.push('a resposta traz número com unidade e não cita nenhum id nem nenhum documento — zero procedência');
}

// ── relatório ────────────────────────────────────────────────────────────────

const conta = (c) => numeros.filter((x) => x.classe === c).length;
const resumo = {
  resposta: respostaPath,
  palavras: String(resposta).trim().split(/\s+/).filter(Boolean).length,
  idsCitados: idsCitados.length,
  idsMortos,
  documentosCitados: documentos.map((d) => d.rel),
  numeros: numeros.length,
  comProcedencia: conta('com-procedencia'),
  derivadosDeclarados: conta('derivado-declarado'),
  orfaosComUnidade: conta('orfao-com-unidade'),
  orfaosSemUnidade: conta('orfao-sem-unidade'),
  isentos: isentos.length,
  tierLNaBase: tierL,
};

if (ESTRITO) {
  for (const a of avisos.splice(0)) erros.push(`(estrito) ${a}`);
}

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: erros.length === 0, resumo, erros, avisos, numeros }, null, 2));
  process.exit(erros.length > 0 ? 1 : 0);
}

console.log(`\nResposta: ${respostaPath} — ${resumo.palavras} palavras, medida contra ${claims.length} claims`);
console.log(`  ids citados ................ ${resumo.idsCitados}${idsMortos.length ? `  (${idsMortos.length} NÃO RESOLVEM)` : ''}`);
console.log(`  documentos citados ......... ${documentos.length}${documentos.length ? `  (${documentos.map((d) => d.rel).join(', ')})` : ''}`);
console.log(`  números na resposta ........ ${resumo.numeros}  (+${resumo.isentos} isentos: ref, timestamp, ano, nome próprio)`);
console.log(`    com procedência .......... ${resumo.comProcedencia}`);
console.log(`    derivados declarados (I) . ${resumo.derivadosDeclarados}`);
console.log(`    órfãos COM unidade ....... ${resumo.orfaosComUnidade}`);
console.log(`    órfãos sem unidade ....... ${resumo.orfaosSemUnidade}`);

if (resumo.derivadosDeclarados > 0) {
  console.log('\n  derivados declarados — são construção do respondedor, não citação:');
  for (const x of numeros.filter((y) => y.classe === 'derivado-declarado')) {
    console.log(`    ${x.bruto}  basis ${x.basis.join(', ')}  …${x.contexto}…`);
  }
}

if (avisos.length > 0) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos.slice(0, 20)) console.log(`  ⚠ ${a}`);
  if (avisos.length > 20) console.log(`  … e mais ${avisos.length - 20}`);
}

if (erros.length > 0) {
  console.error(`\n${erros.length} ERRO(S):`);
  for (const e of erros.slice(0, 30)) console.error(`  ✗ ${e}`);
  if (erros.length > 30) console.error(`  … e mais ${erros.length - 30}`);
  console.error(
    '\nLembrete do limite: isto prova que todo NÚMERO tem citação. Não prova que a\n' +
      'prosa está certa, que a citação é pertinente, nem que a fonte estava certa.\n',
  );
  process.exit(1);
}

// A frase precisa dizer a verdade quando há derivado declarado: ali o número NÃO
// aparece no que a resposta cita — ele foi construído, e a anistia da janela do
// `tier I … basis:` é cega. Anunciar "todo número tem citação" com onze doses
// derivadas na tela é o tipo de mensagem que faz alguém confiar no verde.
if (resumo.derivadosDeclarados > 0) {
  console.log(
    `\n✓ todo id resolve. ${resumo.comProcedencia} número(s) vêm do que a resposta cita; ` +
      `${resumo.derivadosDeclarados} são DERIVAÇÃO DECLARADA e não estão em claim nenhuma —\n` +
      '  a trava não confere se a derivação fecha. Leia a lista acima antes de aceitar.\n',
  );
} else {
  console.log('\n✓ todo id resolve, e todo número da resposta aparece em algo que ela cita\n');
}
console.log(
  '  (o que continua sem prova: prosa sem número, pertinência da citação,\n' +
    '   correção da fonte e omissão de condição — isso é do julgador)\n',
);
