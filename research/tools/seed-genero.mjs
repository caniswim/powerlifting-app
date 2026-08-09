#!/usr/bin/env node
/**
 * Semeia `genero` por vídeo nos manifestos, sem reabrir vídeo nenhum.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE ──────────────────────────────────────────────
 *
 * `relato-de-programa` e `avaliacao-de-terceiro` foram atribuídos por 18 agentes
 * que dependiam de lembrar de abrir o manifesto do canal, e traçaram 18 linhas
 * diferentes. O discriminador dos dois valores não está no texto da claim — está
 * no VÍDEO —, e o vídeo tem manifesto. Onde um compilador pode verificar, agente
 * não deve; e para o compilador poder verificar, o manifesto precisa carregar o
 * gênero. Ver `research/kb/GENERO.md` para o enumerado e o critério.
 *
 * ── DE ONDE VEM O SINAL ──────────────────────────────────────────────────────
 *
 * Nenhum vídeo foi reaberto. Duas fontes de sinal, e as duas já existiam:
 *
 *   Blevins — `research/corpus/blevins/TRIAGEM.md`, que tem título, data,
 *     duração e o PORQUÊ de cada uma das 354 refs, lido um a um por um agente.
 *     Ele já separa review de terceiro, form check, log de sessão e filmagem de
 *     meet, em prosa. Este arquivo lê a tabela e usa as duas colunas.
 *   Vena — só o título do manifesto. É o único sinal disponível, e é bem menos
 *     do que a TRIAGEM: por isso o fall-through do Vena é `indeterminado`.
 *
 * ── A ASSIMETRIA QUE GOVERNA TODAS AS REGRAS ─────────────────────────────────
 *
 * Só três gêneros ligam trava (`GENEROS_SEM_PRESCRICAO`). Deixar de marcar um
 * deles custa exatamente o status quo — nenhuma trava, que é onde a base estava
 * ontem. Marcar um deles por engano custa uma trava FALSA em cima de claim
 * legítima, e o `ESTADO.md` já registra que trava errada é pior do que trava
 * ausente. Então as regras de `review-de-programa`, `form-check` e
 * `coaching-call` são estreitas e quase todas nominais; as outras podem ser
 * largas; e o que não casa em nada vira `indeterminado`, que é resposta final e
 * não buraco.
 *
 * ── ORDEM ────────────────────────────────────────────────────────────────────
 *
 * 1. `OVERRIDES` — decisão à mão, por ref. Ganha de tudo.
 * 2. `REGRAS` da fonte, na ordem em que estão escritas. A primeira que casa vale.
 * 3. `indeterminado`.
 *
 * Uso:
 *   node research/tools/seed-genero.mjs              # preenche só o que está vazio
 *   node research/tools/seed-genero.mjs --refresh    # re-deriva TUDO (apaga mão)
 *   node research/tools/seed-genero.mjs --dry        # não escreve, só relata
 *   node research/tools/seed-genero.mjs --listar     # imprime ref/gênero/título
 *   node research/tools/seed-genero.mjs --source blevins --manifest <arq>   # (teste)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SOURCES, paths } from './sources.mjs';
import { GENEROS, comGenero } from './kb.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REFRESH = process.argv.includes('--refresh');
const DRY = process.argv.includes('--dry');
const LISTAR = process.argv.includes('--listar');

/**
 * `--source <id> --manifest <caminho>`: semeia UMA fonte, sobre um manifesto que
 * não é o do repositório.
 *
 * Existe para `seed-genero.test.mjs`, e a razão é a mesma do `--manifest` do
 * `verify-manifest.mjs`: enquanto não houvesse como rodar a semeadura sobre um
 * manifesto encenado, o único jeito de "provar" que ela funciona era o `--dry`,
 * que compara valores derivados e **nunca passa pelo caminho da escrita**. Foi
 * exatamente ali que morava o defeito que fazia o seed relatar 354 gravações e
 * não gravar nenhuma.
 *
 * Estreito de propósito: só o arquivo do manifesto muda de lugar. A `TRIAGEM.md`
 * continua sendo a de verdade, senão o teste passaria a exercitar heurística de
 * título e não a semeadura que roda no repositório.
 */
const argDe = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};
const SO_FONTE = argDe('--source');
const MANIFESTO = argDe('--manifest');
if (SO_FONTE && !SOURCES[SO_FONTE]) {
  console.error(`fonte "${SO_FONTE}" desconhecida — conhecidas: ${Object.keys(SOURCES).join(', ')}`);
  process.exit(1);
}
if (MANIFESTO && !SO_FONTE) {
  console.error('--manifest exige --source: sem ele, um caminho só serviria para todas as fontes ao mesmo tempo');
  process.exit(1);
}

/**
 * A TRIAGEM em forma de dado: `ref` → { prio, porque }.
 *
 * O parser é deliberadamente burro e barulhento: se a tabela mudar de forma, ele
 * devolve zero linhas e a semeadura do Blevins inteira cai para as regras de
 * título, que são muito piores. Então zero linha é erro, não silêncio.
 */
function carregarTriagem() {
  const path = join(ROOT, 'research/corpus/blevins/TRIAGEM.md');
  const md = readFileSync(path, 'utf8');
  const porRef = new Map();
  for (const m of md.matchAll(/^\|\s*`(G\d{3})`\s*\|([^|]*)\|([^|]*)\|([^|]*)\|(.*)\|([^|]*)\|\s*$/gm)) {
    porRef.set(m[1], {
      prio: m[4].replace(/\*/g, '').trim(),
      titulo: m[5].trim(),
      porque: m[6].trim(),
    });
  }
  if (porRef.size < 300) {
    throw new Error(
      `TRIAGEM.md rendeu só ${porRef.size} linhas — a tabela mudou de forma e a semeadura do ` +
        `Blevins cairia para heurística de título. Conserte o parser antes de semear.`,
    );
  }
  return porRef;
}

const TRIAGEM = carregarTriagem();

// ── 1. As decisões à mão ─────────────────────────────────────────────────────
//
// Cada entrada é uma leitura de título (mais a coluna "por quê" da TRIAGEM,
// quando existe) que uma regra não pegaria, ou pegaria errado. O motivo fica
// escrito: override sem justificativa é folclore em três meses.

const OVERRIDES = {
  // ── Blevins: os vídeos de review, nominalmente ─────────────────────────────
  // Estes três não trazem "Review" no título e são review mesmo assim.
  G001: ['review-de-programa', 'GENESIS é creditado no vídeo a Zach Robinson e Josh Pelland (Data Driven Strength); a especificação é de outro'],
  G002: ['review-de-programa', 'BULLMASTIFF é template do Alexander Bromley'],
  G003: ['review-de-programa', 'template do Alexander Bromley'],
  // Estes três estão DENTRO da faixa G001–G020 que o ESTADO.md chama de "os 20
  // vídeos de review", e não são review: são tese própria do Blevins. Foi o
  // primeiro dividendo do campo — a faixa contígua cobrava 40 claims a mais do
  // que o gênero cobra.
  G004: ['aula', 'tese própria sobre deload; está na faixa dos reviews por vizinhança, não por conteúdo'],
  G006: ['aula', 'tese própria sobre periodização'],
  G008: ['aula', 'a régua dele para julgar programa (stress index); ensina a ferramenta, não resenha um programa'],
  // ── Blevins: form check e coaching call, nominalmente ──────────────────────
  // `G027` se chama só "FAS 6" e `G028` só "FAS 4": nenhuma heurística de título
  // acha os cinco, e é por isso que a TRIAGEM é a fonte e não o título.
  G027: ['form-check', 'Form Assessment Saturday 6 (TRIAGEM: avaliação de forma de terceiros)'],
  G028: ['form-check', 'Form Assessment Saturday 4 (TRIAGEM: avaliação de forma de terceiros)'],
  // ── Blevins: o que uma regra classificaria errado ──────────────────────────
  G024: ['institucional', 'o app Evolve explicado pelo criador — é produto, não aula'],
  G042: ['log-de-treino', 'título de duas cabeças (oferta + prep); a metade que produz claim é a sessão'],
  G044: ['aula', '"How To: chicken shake" — receita, didático, sem sessão'],
  G053: ['aula', 'programa próprio, gratuito, exposto por ele'],
  G061: ['institucional', 'anúncio puro do Guided Programming'],
  G066: ['log-de-treino', 'comparação de forma dentro da própria sessão — NÃO é form check de terceiro'],
  G079: ['aula', 'programação guiada explicada; a venda é acessória'],
  G135: ['review-de-programa', 'visão geral do programa da TSA, que é de outro time de treinadores'],
  G176: ['review-de-programa', 'Texas Method — método de terceiro, exposto'],
  G206: ['aula', 'TRIAGEM: visão geral do programa PRÓPRIO (KingRTS-Predator) + planejamento de meet'],
  G242: ['review-de-programa', 'Cube Predator Bench Program, de Brandon Lilly'],
  G271: ['aula', 'TRIAGEM: explicação integral de um programa próprio'],
  G341: ['clipe', 'agacho de academia gravado antes do meet — a federação está no título, a plataforma não'],
  G304: ['clipe', 'filmagem do terra de um terceiro (Josh), sem comentário'],
  G311: ['clipe', 'filmagem do Dan Green, sem comentário metodológico'],
  G312: ['clipe', 'filmagem do Jesse Norris, sem comentário metodológico'],
  G313: ['clipe', 'filmagem do Dan Green, sem comentário metodológico'],
  G342: ['log-de-treino', 'análise em vídeo do PRÓPRIO agacho — form check é sempre sobre outra pessoa'],
  G350: ['log-de-treino', 'análise em vídeo do PRÓPRIO supino'],

  // ── Vena: o único review do canal, e as armadilhas em volta dele ───────────
  R047: ['review-de-programa', 'ele resenha o programa que o ChatGPT escreveu — o método é de outro autor'],
  R050: ['log-de-treino', '"(REVIEW)" no título é reflexão sobre o PRÓPRIO ciclo, não resenha de programa alheio'],
  R053: ['aula', '"How I Make Powerlifting Programs" — método próprio, não resenha'],
  R131: ['aula', '"MY FREE PROGRAM" — programa próprio exposto'],
  R175: ['log-de-treino', 'histórico dos programas que ELE rodou, narrado; o vídeo é log, não resenha'],
  R012: ['log-de-treino', '"Training Update" governa; o mundial é o assunto, não a filmagem'],
  R154: ['log-de-treino', 'anúncio de que vai ao mundial, dentro de update de treino'],
  R022: ['log-de-treino', 'uma semana fora: update de treino, não filmagem de meet'],
  R106: ['competicao', 'mock meet + recap do ciclo'],
  // Sete títulos que a regra de forma didática não pega porque não começam por
  // pronome interrogativo nem trazem marcador do canal. Os cinco primeiros são
  // tese enunciada; os dois últimos são sessão, e foram conferidos na
  // transcrição porque o título sozinho não dizia.
  R071: ['aula', 'tese sobre técnica ("não existe forma perfeita"), didática do início ao fim'],
  R080: ['aula', 'tema de nutrição exposto de forma didática'],
  R142: ['aula', 'tese: powerlifter deveria treinar mais como fisiculturista'],
  R155: ['aula', 'causa e conserto do arredondamento no terra — tutorial'],
  R165: ['aula', 'tese contra o cue "stacked joints"'],
  R007: ['log-de-treino', 'transcrição abre com "I just failed that squat" — é sessão, não tese'],
  R026: ['log-de-treino', 'transcrição abre com "week 11, day one" — é sessão'],
  // Seis títulos que a forma didática pegaria por acidente: começam por "My" ou
  // trazem o emoji do canal, e são sessão, marco ou anúncio de calendário.
  R023: ['log-de-treino', 'PR de terra e supino na sessão — não é tese'],
  R024: ['log-de-treino', 'tentativa filmada contra o recorde: sessão'],
  R025: ['log-de-treino', 'subida de carga até um PR: sessão'],
  R032: ['log-de-treino', 'ele declara as próprias metas — material PESSOAL, não aula'],
  R054: ['log-de-treino', 'anúncio da próxima competição dentro do calendário dele'],
  R056: ['log-de-treino', 'marco de total: sessão'],
  R187: ['log-de-treino', 'desafio de repetições filmado com narração'],
  R193: ['competicao', 'total de recorde nacional, filmagem de plataforma'],
};

// ── 2. As regras por fonte ───────────────────────────────────────────────────

const rx = (re) => (ctx) => re.test(ctx.titulo);

/** Código de sessão: `C4W2D1`, `W7D3`, `C1W11D3`, `Wk 16`, `W8-9`. É a marca do
 *  vlog de sessão do Blevins e cobre sozinho quase toda a era 2013–2018. */
const CODIGO_DE_SESSAO = /\b(?:C\d+)?W(?:k\s*)?\d+(?:[-.]\d+)?(?:D\d+(?:[-.]\d+)?)?\b/i;

const REGRAS = {
  blevins: [
    { g: 'form-check', re: /Form Assessment|\bFAS\s*\d/i, why: 'série Form Assessment Saturday' },
    { g: 'coaching-call', re: /Coaching Call/i, why: 'atendimento a um praticante nomeado' },
    // A série PPST é o Blevins percorrendo, capítulo a capítulo, o *Practical
    // Programming for Strength Training* — livro de Rippetoe e Baker. O método
    // exposto é do livro, e o imperativo que sai dali é dos autores dele.
    { g: 'review-de-programa', re: /\bPPST\b|Practical Programming for Strength Training/i, why: 'exposição do livro de Rippetoe/Baker, capítulo a capítulo' },
    { g: 'review-de-programa', re: /Powerlifter Reviews|Program Review|Review\s*\||Explained\s*\|/i, why: 'série de resenha de programa de terceiro' },
    // ── A TRIAGEM DECIDE ANTES DO TÍTULO, e essa ordem é a decisão de desenho
    // mais importante deste arquivo. O canal de 2013–2018 embute um segmento
    // metodológico dentro de quase todo vlog de sessão: "How I Deload C2W6D1" é,
    // ao mesmo tempo, o protocolo de deload dele e o dia 1 da semana 6. O título
    // sozinho enxerga só o código de sessão e mandaria os dois para
    // `log-de-treino`, apagando a única coisa que alguém vai procurar ali. A
    // coluna "por quê" da TRIAGEM é justamente o julgamento de quem leu os 354
    // títulos e disse o que cada um carrega — então ela governa, e o título só
    // decide onde ela ficou em branco (a faixa "baixa", que é log de sessão).
    { g: 'log-de-treino', porque: /vlog|prep de competição|sessão|dentro da sessão|estado de treino|pico em execução|semanas fora|preparação imediata/i, why: 'TRIAGEM descreve como vlog/sessão' },
    { g: 'aula', porque: /\S/, why: 'TRIAGEM registra motivo metodológico (prio alta/média)' },
    // Filmagem de plataforma: federação + total, ou "mock meet". O total com
    // classe de peso (`1895@231`, `837.5@110KG`) é a forma que ele usa há dez
    // anos. O `nao` separa a filmagem do meet do vlog de CAMINHO para o meet —
    // "Road to USAPL Raw Nationals 645x1 Squat" é treino, não plataforma.
    {
      g: 'competicao',
      re: /USAPL|\bIPF\b|Raw Nationals|State Games|Spartan Raw|Boss of Nor Cal|Mock[- ]?(Gym )?Meet|\d+(\.\d+)?\s*@\s*\d{2,3}\b/i,
      nao: /Road to|Prep\b|Update/i,
      why: 'filmagem/recap de competição',
    },
    { g: 'log-de-treino', re: CODIGO_DE_SESSAO, why: 'código de sessão no título (CxWyDz)' },
    // A REGRA DO TÍTULO DE DUAS CABEÇAS. "IG Announcement! Heavy Squat, Bench and
    // Deadlift" nomeia um anúncio e uma sessão. Quem governa é a sessão, porque é
    // ela que produz claim — anúncio não vira conhecimento. Daí o `nao`: só é
    // `institucional` o vídeo em que o anúncio é a única coisa no título.
    {
      g: 'institucional',
      re: /Announcement|Channel Update|Coaching Offer|Online Coaching|Sponsorship|FUTURE of Strength Training/i,
      nao: /\d{3}|Squat|Bench|Deadlift|Lift|Press|Pull/i,
      why: 'anúncio, oferta ou produto, e nada de treino no título',
    },
    // Sobra a faixa "baixa" sem motivo escrito. Curto e sem prosa é clipe; o
    // resto é sessão narrada, que é o que 228 vídeos daquela faixa são.
    { g: 'clipe', dur: 90, why: 'menos de 90 s, sem prosa' },
    {
      g: 'log-de-treino',
      re: /\b\d{3,4}\s*(lbs?|x\d)|\bPR\b|Squat|Bench|Deadlift|Press|Pull|Training|Lift|Week|Day|vlog|Gym|life talk/i,
      why: 'faixa baixa da TRIAGEM: log de sessão',
    },
  ],

  // O Vena não tem TRIAGEM. O único sinal é o título — e o formato do canal
  // (short didático, 2 a 6 min, um título que É a tese) faz dele um sinal melhor
  // do que parece. A leitura é sempre da CABEÇA do título, o pedaço antes do
  // primeiro `|`: uns 25 vídeos terminam em `| Training Log & QnA`, que é o
  // formato de publicação e não o assunto. "Why I NEVER do DELOADS | Training
  // Log & QnA" é uma aula sobre deload com sessão de B-roll, e classificá-lo
  // como log por causa do sufixo esconderia a tese de qualquer consulta.
  vena: [
    { g: 'perguntas', cab: /Questions? and Answers?/i, why: 'Q&A dedicado' },
    { g: 'competicao', re: /(RECAP|Meet Recap)/i, why: 'recap de competição' },
    { g: 'log-de-treino', cab: /^(Training Log|Full Day of Eating)/i, why: 'log declarado na cabeça do título' },
    // A forma didática do canal: a cabeça do título é tese, pergunta
    // metodológica ou instrução. É leitura do título, não chute — "Why I NEVER
    // do DELOADS" declara o que o vídeo é.
    {
      g: 'aula',
      cab: /^(How|Why|What|When|Where|Do |Does |Is |Are |Should |Can |Could |The |My |Stop|Not |Less|Getting|Use |Proper|Powerlifting Programming|Range of|You |This |That|These|Your|POWERLIFTER|LIFTING|HEAVY|RPE|IT'?S|“IT|NUTRITION|BULKING|PLATEAUS|PROGRESSIVE|MOBILITY)/i,
      why: 'cabeça do título em forma de tese/pergunta metodológica',
    },
    // Só DEPOIS da forma didática: o canal publica short de 89 s que é aula
    // ("Stop Changing Your Program", 1:29). Duração curta só decide onde o
    // título não disse nada.
    { g: 'clipe', dur: 90, why: 'menos de 90 s e sem tese no título: clipe de levantamento' },
    // Montagem de progresso e compilação. Também depois da forma didática: "How
    // I Made More Progress In 1 Year Than The Previous 6" casa "Progress In" e
    // não é montagem nenhuma — é aula, e a ordem é o conserto.
    { g: 'clipe', re: /Compilation|Transformation|Progress( In|\.)|Squat Off|Pound.?x?\d|Deadlift for \d/i, why: 'compilação/montagem/clipe de levantamento' },
    { g: 'aula', re: /TIER LIST|ACCESSORIES for|PROGRAMMING|OVERRATED|UNDERRATED|MYTH|TUTORIAL|MISTAKE|CUES|⁉️|❌|✅|🤡/i, why: 'marcador didático do canal' },
    // O que sobra é log de sessão declarado no sufixo e nada mais.
    { g: 'log-de-treino', re: /Training Log|QnA|Qna/i, why: 'sufixo de log de sessão, e a cabeça não traz tese' },
  ],
};

// ── 3. A semeadura ───────────────────────────────────────────────────────────

function classificar(fonteId, v) {
  const mao = OVERRIDES[v.ref];
  if (mao) return { genero: mao[0], why: mao[1], fonte: 'mão' };

  const t = TRIAGEM.get(v.ref);
  const titulo = v.title ?? '';
  const ctx = {
    titulo,
    // A cabeça do título: o pedaço antes do primeiro `|`. É onde mora o assunto;
    // o resto é formato de publicação (`| Training Log & QnA`, `| Professional
    // Powerlifter Reviews`).
    cabeca: titulo.split('|')[0].trim(),
    porque: t?.porque ?? '',
    dur: v.durationSec ?? 0,
  };
  for (const r of REGRAS[fonteId] ?? []) {
    const casou =
      (r.re && r.re.test(ctx.titulo)) ||
      (r.cab && r.cab.test(ctx.cabeca)) ||
      (r.porque && ctx.porque && r.porque.test(ctx.porque)) ||
      (r.dur !== undefined && ctx.dur > 0 && ctx.dur <= r.dur);
    if (casou && !(r.nao && r.nao.test(ctx.titulo))) return { genero: r.g, why: r.why, fonte: 'regra' };
  }
  return { genero: 'indeterminado', why: 'o título não decide e ninguém reabriu o vídeo', fonte: 'fall-through' };
}

let total = 0;
let escritos = 0;
const relatorio = [];

for (const src of Object.values(SOURCES)) {
  if (SO_FONTE && src.id !== SO_FONTE) continue;
  const file = MANIFESTO ?? paths(src, ROOT).manifest;
  if (!existsSync(file)) continue; // fonte normativa não tem manifesto — e não tem vídeo
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  const dist = new Map();
  let mudou = false;

  manifest.videos = (manifest.videos ?? []).map((v) => {
    total += 1;
    const jaTem = typeof v.genero === 'string' && v.genero.length > 0;
    const r = jaTem && !REFRESH ? { genero: v.genero, why: 'já no manifesto', fonte: 'manifesto' } : classificar(src.id, v);
    if (!GENEROS.has(r.genero)) throw new Error(`${v.ref}: gênero "${r.genero}" fora do enumerado de kb.mjs`);
    dist.set(r.genero, (dist.get(r.genero) ?? 0) + 1);
    if (v.genero !== r.genero) {
      mudou = true;
      escritos += 1;
    }
    if (LISTAR) relatorio.push(`${v.ref}  ${r.genero.padEnd(18)} ${r.fonte.padEnd(12)} ${String(r.why).slice(0, 46).padEnd(48)} ${v.title}`);
    // A gravação mora em `kb.mjs` e tem teste próprio: a versão embutida aqui
    // copiava o `genero` velho por cima do recém-derivado e fazia o script
    // relatar escrita que não acontecia. Ver o comentário de `comGenero`.
    return comGenero(v, r.genero);
  });

  console.log(`\n${src.name} (${src.id}) — ${manifest.videos.length} vídeos`);
  for (const [g, n] of [...dist].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${g}`);
  }

  if (mudou && !DRY) {
    writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`  → ${file} escrito`);
  } else if (mudou) {
    console.log('  (--dry: nada escrito)');
  } else {
    console.log('  (sem mudança)');
  }
}

if (LISTAR) {
  console.log('');
  for (const l of relatorio) console.log(l);
}

console.log(`\n${escritos} de ${total} vídeos receberam gênero${DRY ? ' (simulado)' : ''}.\n`);
