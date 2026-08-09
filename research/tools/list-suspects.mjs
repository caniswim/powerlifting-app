#!/usr/bin/env node
/**
 * Levanta os alvos da verificação cirúrgica com Whisper.
 *
 * A base inteira é construída sobre legenda automática do YouTube. Erro de
 * palavra é inofensivo — `squadrons` no lugar de `squatters` não muda nada.
 * Duas coisas, porém, envenenam a base:
 *
 *   NÚMERO   — "3 séries" virando "30 séries" é dado errado com cara de dado.
 *   NEGAÇÃO  — um `n't` perdido inverte a afirmação e NÃO parece errado: sai
 *              uma frase gramatical, plausível, e ao contrário do que foi dito.
 *
 * A run 1 tratou isso re-transcrevendo o vídeo inteiro quando o ASR "parecia
 * ruim". Caro, e o critério era subjetivo. Aqui é o oposto: este arquivo
 * identifica MECANICAMENTE as janelas que importam, e só elas voltam para o
 * Whisper.
 *
 * Duas famílias de alvo:
 *
 *   1. `suspect: true` — o agente extrator já levantou a mão. Vai inteiro.
 *      Muitas dessas claims foram marcadas ANTES de `suspectWhy` existir;
 *      ausência do campo é tratada como `"numero"`, que era o único motivo
 *      previsto na época.
 *
 *   2. Candidatos a inversão de negação que ninguém marcou — porque o agente
 *      redigiu a claim para sobreviver às duas leituras, o que é honesto e
 *      justamente por isso invisível. São ~1000 claims com negação no corpus;
 *      verificar todas custaria mais do que a base vale, então aqui elas são
 *      PONTUADAS por risco e só o topo desce para o Whisper (ver SCORE).
 *
 * Uso:
 *   node research/tools/list-suspects.mjs            # listagem legível
 *   node research/tools/list-suspects.mjs --json     # alvos para verify-suspects.mjs
 *   node research/tools/list-suspects.mjs --top 80   # quantos candidatos de negação
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const topIdx = argv.indexOf('--top');
/** Quantos candidatos de negação descem para o Whisper. Corte de custo, não de risco. */
const TOP_NEG = topIdx >= 0 ? Number(argv[topIdx + 1]) : 70;

/**
 * Negação em duas classes, porque não erram do mesmo jeito no ASR.
 *
 * `n't` é um morfema átono colado na palavra anterior — o reconhecedor perde
 * isso com facilidade, e o resultado continua sendo inglês perfeito. Já "never"
 * e "no" são tônicos e ocupam sílaba própria; somem muito menos. Por isso
 * contração pesa mais na pontuação do que negação por palavra inteira.
 */
const NEG_CONTRACAO = /\b\w+n[''´]?t\b/i;
const NEG_PALAVRA = /\b(not|never|no|none|nothing|without|neither|nor)\b/i;

/**
 * Palavras onde a inversão da frase inverte a CONCLUSÃO, não só o tom.
 * "doesn't matter" ↔ "does matter" é uma prescrição ao contrário; "isn't red"
 * ↔ "is red" não muda nada que a base use.
 */
const EFEITO =
  /\b(matter|benefit|benefits|work|works|working|need|needs|help|helps|better|worse|difference|important|necessary|recommend|should|have to|point|useful|useless|worth|play a role|effective|enough|required|problem|issue|risk|safe|dangerous|hurt|injur)\w*/i;

/** Negação que o extrator propagou para a claim em pt-BR: se o ASR inverteu, a claim inverteu junto. */
const NEG_PT = /\b(não|nunca|nenhum|nenhuma|jamais|sem que|tampouco)\b/i;

const files = readdirSync(EXTRACT).filter((f) => f.endsWith('.jsonl')).sort();

const marcados = [];
const negacao = [];

for (const file of files) {
  const linhas = readFileSync(join(EXTRACT, file), 'utf8').split('\n');
  linhas.forEach((linha, i) => {
    if (!linha.trim()) return;
    let c;
    try {
      c = JSON.parse(linha);
    } catch {
      return; // JSON inválido é problema do check-claims, não deste levantamento.
    }
    const base = {
      id: c.id,
      src: c.src,
      at: c.at,
      file: `research/extract/${file}`,
      line: i + 1,
      claim: c.claim,
      verbatim: c.verbatim ?? '',
      params: c.params ?? [],
      scope: c.scope,
    };

    // Família 1: já marcado. `suspectWhy` ausente = "numero" (o campo nasceu depois).
    if (c.suspect === true) {
      if (c.whisperChecked === true) return; // já passou pelo Whisper num run anterior
      marcados.push({ ...base, origem: 'marcado', why: c.suspectWhy ?? 'numero' });
      return;
    }

    // Família 2: candidato a inversão de negação, não marcado.
    const v = base.verbatim;
    if (!v) return;
    const temContracao = NEG_CONTRACAO.test(v);
    const temPalavra = NEG_PALAVRA.test(v);
    if (!temContracao && !temPalavra) return;

    let score = 0;
    if (temContracao) score += 3;              // morfema que o ASR come
    if (base.params.length > 0) score += 2;    // as duas superfícies na mesma claim
    if (base.scope === 'GERAL') score += 2;    // prescrição invertida é a pior de todas
    if (EFEITO.test(v)) score += 2;            // a inversão muda a conclusão
    if (NEG_PT.test(base.claim ?? '')) score += 1; // a negação chegou até a claim
    if (c.certainty === 'explicit') score += 1;

    // Sem contração e sem número, a negação é tônica e a claim não carrega dado:
    // risco baixo demais para gastar uma janela de Whisper.
    if (!temContracao && base.params.length === 0) score -= 2;

    negacao.push({ ...base, origem: 'negacao', why: 'negacao', score });
  });
}

/**
 * Ordena por risco. Empate desempata por vídeo já presente na fila — o áudio
 * já vai ser baixado de qualquer jeito, então esses candidatos são de graça.
 * Custo desempata; nunca decide sozinho.
 */
const jaNaFila = new Set(marcados.map((t) => t.src));
negacao.sort(
  (a, b) =>
    b.score - a.score ||
    Number(jaNaFila.has(b.src)) - Number(jaNaFila.has(a.src)) ||
    a.id.localeCompare(b.id),
);

const alvos = [...marcados, ...negacao.slice(0, TOP_NEG)];
alvos.sort((a, b) => a.id.localeCompare(b.id));

if (JSON_OUT) {
  process.stdout.write(`${JSON.stringify(alvos, null, 2)}\n`);
} else {
  const porTipo = (t) => alvos.filter((a) => a.why === t).length;
  console.log(`\nAlvos da verificação com Whisper — ${alvos.length} claim(s)`);
  console.log(`  marcados suspect:true ..... ${marcados.length}`);
  console.log(`  candidatos de negação ..... ${Math.min(TOP_NEG, negacao.length)} de ${negacao.length} varridos`);
  console.log(`  por motivo ................ numero:${porTipo('numero')}  negacao:${porTipo('negacao')}`);
  console.log(`  vídeos distintos .......... ${new Set(alvos.map((a) => a.src)).size}\n`);

  for (const a of alvos) {
    const p = a.params.map((x) => `${x.value} ${x.unit ?? ''} [${x.frame}]`).join(' | ') || '—';
    console.log(`${a.id}  ${a.src} @${a.at}  (${a.why}${a.score !== undefined ? `, score ${a.score}` : ''})`);
    console.log(`   claim    : ${a.claim}`);
    console.log(`   verbatim : ${a.verbatim}`);
    console.log(`   params   : ${p}\n`);
  }
}
