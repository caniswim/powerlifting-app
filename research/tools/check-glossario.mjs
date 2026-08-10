#!/usr/bin/env node
/**
 * A TRAVA DO VOCABULÁRIO DE ENTRADA — `research/kb/GLOSSARIO-TOPICOS.json`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELA COBRA, E POR QUE CADA UMA DAS QUATRO COISAS
 *
 * 1. **Tópico fora dos 74.** O alvo é uma lista FECHADA declarada no
 *    `PROTOCOLO-EXTRACAO.md`, e é isso que torna o roteamento conferível por
 *    compilador em vez de plausível. Um nome com typo nunca casa claim nenhuma,
 *    fica em zero para sempre, e zero é indistinguível de "a camada quebrou".
 *    Os oito lotes já entregaram dois: `dor-e-treino` (que é o nome de um
 *    DOCUMENTO) e `recorde`, os dois dentro de `naoConfundirCom`.
 *
 * 2. **Tópico dos 74 sem glosa.** A glosa é a Porta A inteira: é a linha que o
 *    modelo lê para escolher a gaveta. Gaveta sem glosa é gaveta invisível para
 *    a porta que vale em produção.
 *
 * 3. **Termo de entrada reivindicado por dois tópicos SEM regra de desempate.**
 *    É o bug do `peso-corporal`, e é o motivo de esta trava existir. Em
 *    10/08/2026 `levantar peso já conta como exercício pro coração` roteava para
 *    `peso-corporal` com 0,73 porque a palavra `peso` foi lida como peso
 *    CORPORAL, e `cardio` — 230 claims que respondem exatamente isso — nunca
 *    abria. A ambiguidade existia e ninguém sabia. **Ambiguidade declarada é
 *    dado; ambiguidade silenciosa é aquele bug.**
 *
 * 4. **Regra de desempate que ninguém consegue verificar.** `vence` com dois
 *    tópicos é uma AFIRMAÇÃO SOBRE A BASE: "estes dois assuntos andam juntos, e
 *    a pergunta que usa esta palavra toca os dois". Aqui isso é reconferido
 *    contra `research/extract`: cada par de vencedores tem de co-etiquetar ao
 *    menos uma claim de verdade. Sem esta linha, `vence: [todos]` seria um
 *    encolher de ombros com cara de decisão — e foi assim que a colisão de
 *    `pegada fechada` (que reúne `bracos` e `setup`, dois tópicos que NUNCA
 *    aparecem juntos numa claim) foi descoberta.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELA **NÃO** COBRA, E ISSO É DELIBERADO
 *
 * **Termo morto.** O `check-vocabulario.mjs` recusa termo do `VOCABULARIO.md`
 * que não casa nenhuma claim, e está certíssimo: aquele arquivo expande a busca
 * por TEXTO, e um termo que não existe no corpus lá é índice envelhecendo em
 * silêncio. Aqui é o oposto. `fisgada` **não existe em claim nenhuma das 6.912**
 * e é o termo mais importante deste arquivo, porque é o que o atleta digita
 * quando o peitoral dá um aviso. Cobrar vida no corpus seria cobrar o contrário
 * do que este artefato é, e apagaria exatamente a ponte que ele existe para
 * construir.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A REGRA DE HIGIENE
 *
 * Este arquivo **não importa constante nenhuma de `roteador.mjs` nem de
 * `glossario.mjs`** — nem peso, nem piso, nem idf. Ele confere a FORMA e a
 * COERÊNCIA do dado contra a base; quem confere o comportamento do roteamento é
 * o `check-rotas.mjs`, com os canários do `ROTAS.json`. Se os dois lessem os
 * mesmos números, seriam a mesma trava contada duas vezes.
 *
 * Uso:
 *   node research/tools/check-glossario.mjs [--extract <dir>] [--verbose]
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from './kb.mjs';
import { chaveDoTermo } from './glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const EXTRACT = arg('--extract') ?? join(ROOT, 'research/extract');
const ARQUIVO = join(ROOT, 'research/kb/GLOSSARIO-TOPICOS.json');
const VERBOSE = process.argv.includes('--verbose');

if (!existsSync(ARQUIVO)) {
  console.error(`✗ ${ARQUIVO} não existe — rode node research/tools/build-glossario.mjs`);
  process.exit(2);
}

/**
 * O tamanho mínimo de uma lista de entrada. Vinte foi o que os oito lotes
 * receberam como instrução; onze é o menor que chegou (`barra-baixa`). O número
 * está AQUI, na trava, e não no artefato: um mínimo que morasse no dado
 * verificado seria o dado dizendo se ele mesmo passa.
 */
const MIN_TERMOS = 10;

/** O que pode existir num tópico e numa regra. Campo com typo é ignorado em
 *  silêncio, e um artefato que perdeu metade dos termos por causa de um `s` a
 *  mais continua verde — já aconteceu nesta casa, em dois arquivos diferentes. */
const CAMPOS_TOPICO = new Set(['topico', 'glosa', 'entrada', 'naoConfundirCom']);
const CAMPOS_NCC = new Set(['topico', 'termoAmbiguo', 'comoDistinguir']);
const CAMPOS_REGRA = new Set(['termo', 'topicos', 'vence', 'coEtiquetadas', 'porque']);

const doc = JSON.parse(readFileSync(ARQUIVO, 'utf8'));
const fechados = carregarTopicos(ROOT);
const { claims } = carregarClaims(EXTRACT);
if (claims.length === 0) {
  console.error(`✗ nenhuma claim em ${EXTRACT}`);
  process.exit(2);
}

const erros = [];

// ── 1 e 2: as 74 gavetas, cada uma com glosa ────────────────────────────────

const vistos = new Set();
const entradaDe = new Map();
for (const t of doc.topicos ?? []) {
  const onde = `tópico "${t.topico}"`;
  for (const k of Object.keys(t)) {
    if (!CAMPOS_TOPICO.has(k)) erros.push(`${onde}: campo "${k}" não existe no formato — campo com typo é ignorado em silêncio`);
  }
  if (!fechados.has(t.topico)) {
    erros.push(
      `${onde} está FORA do vocabulário fechado de ${fechados.size} termos do PROTOCOLO-EXTRACAO.md. `
        + 'Nome que não é da lista nunca casa claim nenhuma e fica em zero para sempre.',
    );
    continue;
  }
  if (vistos.has(t.topico)) erros.push(`${onde} aparece duas vezes no glossário`);
  vistos.add(t.topico);

  if (!String(t.glosa ?? '').trim()) {
    erros.push(
      `${onde} não tem glosa. A glosa é a Porta A inteira — é a linha que o modelo lê para escolher `
        + 'a gaveta. Gaveta sem glosa é gaveta invisível na porta que vale em produção.',
    );
  }
  const entrada = t.entrada ?? [];
  if (entrada.length < MIN_TERMOS) {
    erros.push(`${onde}: só ${entrada.length} termo(s) de entrada (mínimo ${MIN_TERMOS}) — lista curta demais não é ponte`);
  }
  const dentro = new Set();
  for (const e of entrada) {
    const k = chaveDoTermo(e);
    if (!k) {
      erros.push(`${onde}: termo de entrada vazio`);
      continue;
    }
    if (dentro.has(k)) erros.push(`${onde}: termo "${e}" repetido dentro do próprio tópico (chave "${k}")`);
    dentro.add(k);
  }
  entradaDe.set(t.topico, dentro);

  const paraQuem = new Set();
  for (const n of t.naoConfundirCom ?? []) {
    for (const k of Object.keys(n)) {
      if (!CAMPOS_NCC.has(k)) erros.push(`${onde} naoConfundirCom: campo "${k}" não existe no formato`);
    }
    if (!fechados.has(n.topico)) {
      erros.push(
        `${onde} naoConfundirCom aponta para "${n.topico}", que NÃO é um dos ${fechados.size} tópicos. `
          + 'Um vizinho que não existe é um aviso que nunca dispara.',
      );
    }
    if (n.topico === t.topico) erros.push(`${onde} naoConfundirCom aponta para ele mesmo`);
    if (paraQuem.has(n.topico)) erros.push(`${onde} naoConfundirCom repete "${n.topico}"`);
    paraQuem.add(n.topico);
    if (!String(n.comoDistinguir ?? '').trim()) {
      erros.push(`${onde} naoConfundirCom "${n.topico}": sem "comoDistinguir" — o par sozinho não distingue nada`);
    }
  }
}
for (const t of fechados) {
  if (!vistos.has(t)) {
    erros.push(
      `o tópico "${t}" do vocabulário fechado NÃO tem entrada no glossário. Nenhuma pergunta na voz `
        + 'do atleta consegue abrir essa gaveta, e a Porta A não sabe que ela existe.',
    );
  }
}

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * 5. A ÂNCORA NO CORPUS — o buraco que o ataque cego de 12/08/2026 mediu
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * O ATAQUE, LITERAL: trocar a lista `entrada` inteira de um tópico por dez
 * strings sem sentido (`zzqa`…`zzqj`), regerar o artefato e rodar `npm run
 * check:kb` e `npm run check:gate` deixava **26 dos 74 tópicos VERDES** — entre
 * eles `descanso-entre-series`, que é a gaveta cuja falha criou esta camada
 * inteira, e `genetica`, `cinto`, `sono`, `rpe`, `mobilidade`, `profundidade`,
 * `training-max`, `recuperacao`, `terra`, `intensidade`, `comandos-ipf`. Trinta
 * e cinco por cento do artefato que oito agentes escreveram não era testado por
 * nada. É o modo de falha nº 4 desta casa — trava que se testa a si mesma — em
 * escala nova: as travas 1–4 acima conferem FORMA (nome fechado, glosa
 * presente, colisão declarada), e forma sobrevive intacta a uma lista de lixo.
 *
 * A ÂNCORA. Cada termo de entrada é confrontado com o texto das claims que a
 * BASE etiquetou naquele tópico — dado independente, extraído meses antes deste
 * artefato, e que nenhuma edição do glossário move. Um termo conta como
 * ancorado quando alguma palavra dele de 4+ letras compartilha os 5 primeiros
 * caracteres (sem acento) com alguma palavra do texto daquela gaveta.
 *
 * O PISO É BAIXO DE PROPÓSITO, E ISSO É A PARTE IMPORTANTE. Medido em
 * 12/08/2026 sobre as 74 gavetas: a mediana ancora **92 %** e a pior gaveta é
 * `dor` com **53 %**. O piso está em 35 % — folga de dezoito pontos sobre a pior
 * — porque esta trava existe para recusar LIXO, não para empurrar o artefato na
 * direção do corpus. **Um vocabulário de entrada bom é justamente o que NÃO está
 * no corpus:** `fisgada` não aparece em nenhuma das 6.912 claims e é o termo
 * mais importante deste arquivo. Subir o piso inverteria o propósito do artefato
 * e faria o autor da próxima gaveta encher a lista com palavras da base —
 * exatamente o modo de falha nº 2 (a trava estreita empurra o dado para fora
 * dela). Se uma gaveta legítima cair abaixo de 35 %, o conserto NÃO é acolchoar
 * a lista com jargão: é dizer isso em voz alta e mudar este número com o motivo
 * escrito ao lado.
 *
 * O QUE ELA NÃO PEGA, dito antes que alguém confie demais: ela recusa lixo, não
 * recusa uma lista de termos reais porém ERRADOS para aquela gaveta. Trocar a
 * entrada de `sono` pela entrada de `fadiga` passa aqui. Quem cobra acerto de
 * roteamento é `check-rotas.mjs` e os canários; esta trava só garante que existe
 * dado, e não enchimento, do outro lado.
 */
const FRACAO_MINIMA_ANCORADA = 0.35;
const SEM_ACENTO = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PALAVRAS = (s) => SEM_ACENTO(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
const RAIZ = (w) => w.slice(0, 5);

const raizesDoTopico = new Map();
for (const c of claims) {
  for (const t of c.topic ?? []) {
    if (!raizesDoTopico.has(t)) raizesDoTopico.set(t, new Set());
    const alvo = raizesDoTopico.get(t);
    for (const w of PALAVRAS(`${c.claim ?? ''} ${c.verbatim ?? ''} ${c.verbatimWhisper ?? ''}`)) alvo.add(RAIZ(w));
  }
}

const ancoragem = [];
for (const t of doc.topicos ?? []) {
  if (!fechados.has(t.topico)) continue;
  const raizes = raizesDoTopico.get(t.topico) ?? new Set();
  const entrada = t.entrada ?? [];
  if (entrada.length === 0) continue;
  const ancorados = entrada.filter((e) => PALAVRAS(e).some((w) => raizes.has(RAIZ(w))));
  const fracao = ancorados.length / entrada.length;
  ancoragem.push({ topico: t.topico, ancorados: ancorados.length, de: entrada.length, fracao });
  if (fracao < FRACAO_MINIMA_ANCORADA) {
    erros.push(
      `tópico "${t.topico}": só ${ancorados.length} de ${entrada.length} termos de entrada `
        + `(${(fracao * 100).toFixed(0)} %) têm QUALQUER parentesco com o texto das claims que a base `
        + `etiquetou nessa gaveta — mínimo ${(FRACAO_MINIMA_ANCORADA * 100).toFixed(0)} %. `
        + 'Uma lista sem nenhuma âncora no corpus passa em toda trava de FORMA deste arquivo: foi '
        + 'assim que 26 das 74 gavetas puderam virar dez strings sem sentido com o check:kb verde. '
        + 'Se esta gaveta é legitimamente slang puro, não acolchoe a lista com jargão da base — '
        + 'mude FRACAO_MINIMA_ANCORADA com o motivo escrito ao lado.',
    );
  }
}

// ── 3 e 4: as colisões e o desempate ────────────────────────────────────────

const dono = new Map();
for (const [topico, termos] of entradaDe) {
  for (const k of termos) {
    if (!dono.has(k)) dono.set(k, new Set());
    dono.get(k).add(topico);
  }
}
const colisoes = new Map([...dono.entries()].filter(([, s]) => s.size > 1));

const co = new Map();
for (const c of claims) {
  const ts = [...new Set(c.topic ?? [])].sort();
  for (let i = 0; i < ts.length; i += 1) {
    for (let j = i + 1; j < ts.length; j += 1) co.set(`${ts[i]}×${ts[j]}`, (co.get(`${ts[i]}×${ts[j]}`) ?? 0) + 1);
  }
}
const coDe = (a, b) => co.get([a, b].sort().join('×')) ?? 0;

const regras = new Map();
for (const r of doc.desempate ?? []) {
  for (const k of Object.keys(r)) {
    if (!CAMPOS_REGRA.has(k)) erros.push(`desempate "${r.termo}": campo "${k}" não existe no formato`);
  }
  if (regras.has(r.termo)) erros.push(`desempate "${r.termo}": duas regras para o mesmo termo`);
  regras.set(r.termo, r);

  const reivindicam = colisoes.get(r.termo);
  if (!reivindicam) {
    erros.push(
      `desempate "${r.termo}": REGRA MORTA — este termo não é reivindicado por dois tópicos (nem por `
        + 'um). Regra que não desempata nada envelhece em silêncio e ensina o próximo leitor que a '
        + 'ambiguidade foi resolvida quando ela nem existe mais.',
    );
    continue;
  }
  const declarados = [...(r.topicos ?? [])].sort().join(',');
  const reais = [...reivindicam].sort().join(',');
  if (declarados !== reais) {
    erros.push(
      `desempate "${r.termo}": a regra diz que quem reivindica é [${declarados}] e hoje quem `
        + `reivindica é [${reais}]. Um tópico entrou ou saiu do termo depois de a regra ser escrita — `
        + 'a decisão precisa ser tomada de novo, não herdada.',
    );
  }
  const vence = r.vence ?? [];
  if (vence.length === 0) erros.push(`desempate "${r.termo}": "vence" vazio — o termo não fica com ninguém e some do roteamento`);
  for (const v of vence) {
    if (!reivindicam.has(v)) erros.push(`desempate "${r.termo}": "${v}" vence um termo que ele não reivindica`);
  }
  if (!String(r.porque ?? '').trim()) {
    erros.push(`desempate "${r.termo}": sem "porque". Desempate sem motivo escrito é a mesma ambiguidade silenciosa com um campo a mais.`);
  }
  for (let i = 0; i < vence.length; i += 1) {
    for (let j = i + 1; j < vence.length; j += 1) {
      const n = coDe(vence[i], vence[j]);
      if (n === 0) {
        erros.push(
          `desempate "${r.termo}": "vence" diz que o termo é de "${vence[i]}" E de "${vence[j]}", mas `
            + 'NENHUMA claim da base etiqueta os dois ao mesmo tempo. Isso não é ambiguidade legítima — '
            + 'é um encolher de ombros: os dois assuntos não se encontram nesta base, então o termo é '
            + 'de um deles e a regra tem de dizer de qual.',
        );
      }
      const declarado = (r.coEtiquetadas ?? {})[`${vence[i]}×${vence[j]}`];
      if (declarado !== undefined && declarado !== n) {
        erros.push(
          `desempate "${r.termo}": a regra registra ${vence[i]}×${vence[j]} = ${declarado} claims `
            + `co-etiquetadas e a base tem ${n} agora. Rode node research/tools/build-glossario.mjs.`,
        );
      }
    }
  }
}

for (const [termo, quem] of colisoes) {
  if (regras.has(termo)) continue;
  erros.push(
    `AMBIGUIDADE SILENCIOSA: o termo de entrada "${termo}" é reivindicado por ${quem.size} tópicos `
      + `(${[...quem].sort().join(', ')}) e NÃO tem regra de desempate.\n`
      + '        Foi assim que `peso` — reivindicado por meia base — roteou *levantar peso já conta como\n'
      + '        exercício pro coração* para `peso-corporal` e deixou `cardio` fechado, com 230 claims\n'
      + '        que respondiam a pergunta. Declare o desempate em research/kb/GLOSSARIO-TOPICOS.json\n'
      + '        (via build-glossario.mjs): quem fica com o termo, e por quê.',
  );
}

// ── saída ───────────────────────────────────────────────────────────────────

if (VERBOSE) {
  const nTermos = [...entradaDe.values()].reduce((a, s) => a + s.size, 0);
  console.log(`  ℹ  ${vistos.size} tópicos, ${nTermos} termos de entrada, ${colisoes.size} colisão(ões)`);
  for (const [termo, quem] of [...colisoes.entries()].sort()) {
    const r = regras.get(termo);
    console.log(`     "${termo}" ${[...quem].sort().join(' + ')} → vence ${(r?.vence ?? []).join(' + ') || '(sem regra)'}`);
  }
  console.log('  ℹ  âncora no corpus, as 8 gavetas mais frouxas:');
  for (const a of [...ancoragem].sort((x, y) => x.fracao - y.fracao).slice(0, 8)) {
    console.log(`     ${a.topico.padEnd(24)} ${a.ancorados}/${a.de}  ${(a.fracao * 100).toFixed(0)} %`);
  }
}

if (erros.length > 0) {
  console.error('');
  for (const e of erros) console.error(`✗ ${e}`);
  console.error(`\n✗ ${erros.length} problema(s) em research/kb/GLOSSARIO-TOPICOS.json`);
  process.exit(1);
}

const nTermos = [...entradaDe.values()].reduce((a, s) => a + s.size, 0);
console.log(
  `\nGlossário de entrada — ${vistos.size} de ${fechados.size} gavetas com glosa, ${nTermos} termos na voz `
    + `do atleta, recontados contra ${claims.length} claims`,
);
const pior = [...ancoragem].sort((x, y) => x.fracao - y.fracao)[0];
console.log(
  `✓ nenhum tópico fora da lista fechada, nenhuma gaveta sem glosa, e as ${colisoes.size} colisões têm `
    + 'desempate declarado e co-etiquetado na base',
);
console.log(
  `✓ toda gaveta ancora ao menos ${(FRACAO_MINIMA_ANCORADA * 100).toFixed(0)} % dos termos de entrada no `
    + `texto das claims que a base etiquetou nela — a mais frouxa é "${pior.topico}" com `
    + `${pior.ancorados}/${pior.de} (${(pior.fracao * 100).toFixed(0)} %)`,
);
process.exit(0);
