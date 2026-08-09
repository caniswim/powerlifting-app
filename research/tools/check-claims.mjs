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
// Os enumerados moram em `kb.mjs` desde que o `check-canarios.mjs` passou a
// precisar deles: duas cópias da mesma lista fechada é o defeito que o SCHEMA.md
// documenta na abertura, e não vale a pena reintroduzi-lo por conveniência.
import {
  TIERS, SCOPES, CERTAINTY, MODOS, MODOS_DESCRITIVOS, FRAMES, FRAMES_DOSE, FRAMES_ESCALA,
  SUSPECT_WHY, GENEROS, GENEROS_SEM_PRESCRICAO, carregarTopicos,
} from './kb.mjs';

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

const TOPICS = carregarTopicos(ROOT);

/**
 * `mandaEm` declara em que assuntos uma fonte vence outra quando discordam, e só
 * significa alguma coisa se apontar para tópicos que as claims realmente usam.
 * Um typo (`competicoes` por `competicao`) não quebraria nada visivelmente: a
 * regra de precedência simplesmente nunca casaria, e o empate voltaria a ser
 * decidido pela data — que é o comportamento errado que ela existe para impedir,
 * de novo em silêncio.
 *
 * Dois donos do mesmo tópico também é erro: seria uma regra de desempate que não
 * desempata.
 */
(() => {
  const dono = new Map();
  for (const s of Object.values(SOURCES)) {
    for (const t of s.mandaEm ?? []) {
      if (!TOPICS.has(t)) {
        throw new Error(`sources.mjs: fonte "${s.id}" manda em "${t}", que não é tópico do vocabulário`);
      }
      if (dono.has(t)) {
        throw new Error(`sources.mjs: "${t}" tem dois donos ("${dono.get(t)}" e "${s.id}") — precedência ambígua`);
      }
      dono.set(t, s.id);
    }
  }
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

/**
 * A REGRA DE ID, e por que ela é assimétrica.
 *
 * O `SCHEMA.md` dizia `V{ref}-{seq}` e chamava a colisão de "impossível por
 * construção". Era verdade com uma fonte só. Com duas, `ref = G010` produz
 * `V010-01`, que já é do `R010.jsonl` do Vena — e os seis agentes que extraíram
 * o Blevins bateram nisso e resolveram cada um do seu jeito: metade escreveu
 * `G001-01`, metade escreveu `VG028-01`. As 702 do segundo grupo ficaram
 * irresolvíveis pelo `check-evidence.mjs`, cuja regex é `^[A-Z]\d{3}-\d+$`, **em
 * silêncio**: a ferramenta respondia "nada a fazer" em vez de "não existe".
 *
 * A regra real, agora travada:
 *
 *   arquivo `{refPrefix}{NNN}.jsonl`  →  id `{idPrefix}{NNN}-{seq}`
 *
 * `idPrefix` vem de `sources.mjs` e é igual ao `refPrefix` para toda fonte nova.
 * Só o Vena carrega `V`, porque os 4.947 ids dele já estão citados por
 * `conflicts`, `basis` e `conditions` e renumerar id publicado é a única coisa
 * que o esquema proíbe em letras grandes. Corpus sem fonte registrada (o
 * regulamento, `F001.jsonl`) usa o próprio prefixo do arquivo.
 *
 * Não travar isso custou meia ingestão de arestas inverificáveis. Travar custa
 * doze linhas.
 */
const FORMA_DO_ID = /^[A-Z]\d{3}-\d+$/;
for (const src of Object.values(SOURCES)) {
  if (!/^[A-Z]$/.test(src.idPrefix ?? '')) {
    console.error(
      `sources.mjs: fonte "${src.id}" precisa de idPrefix de UMA letra maiúscula ` +
        `(o check-evidence.mjs resolve id por /^[A-Z]\\d{3}-\\d+$/)`,
    );
    process.exit(1);
  }
}
function idEsperadoDoArquivo(file) {
  const m = /^([A-Za-z]+)(\d{3,})$/.exec(file.replace(/\.jsonl$/, ''));
  if (!m) return null;
  return `${fontePorPrefixo.get(m[1])?.idPrefix ?? m[1]}${m[2]}`;
}

/**
 * Refs escritos na prosa da claim, de qualquer corpus — `[R159 @03:05]`, `G042`.
 *
 * Duas alternativas, e a ordem entre elas é a correção de um furo real. A versão
 * anterior era uma só, `\[?[RGF]\d+[^\]]*\]?`, e o `[^\]]*` é GULOSO: numa claim
 * como "como ele já dizia em R159, o volume sobe para 47 séries", o casamento
 * começa em `R159` e vai até o fim da frase, porque não há `]` para pará-lo. O
 * `47` some junto com o ref, e a trava de "número sem procedência" — a que
 * impede um fator inventado de entrar — fica DESLIGADA para todo número que
 * venha depois de uma citação na prosa. Nenhuma claim de hoje exibe o defeito, e
 * é justamente por isso que ele passou: a forma `[R159 @03:05]` que o protocolo
 * ensina traz o `]` que estanca o casamento, e a forma sem colchete ainda não
 * apareceu. O passe que vai preencher `conditions` e escrever claims `I` citando
 * outras é onde ela aparece.
 *
 * A forma entre colchetes precisa ser consumida inteira (o `@03:05` de dentro
 * não é dado da claim). A forma nua é exatamente `{LETRA}{NNN}` e nada além.
 */
const PREFIXOS = [...fontePorPrefixo.keys()].join('');
const REF_NA_PROSA = new RegExp(`\\[[${PREFIXOS}]\\d+[^\\]]*\\]|\\b[${PREFIXOS}]\\d{3}\\b`, 'g');

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

    // A regra de id — ver o bloco grande acima. Vale para o extract inteiro e
    // não só para o recorte de `--only`: id fora do padrão é invisível para a
    // ferramenta que resolve citação, e invisível é pior do que errado.
    if (!FORMA_DO_ID.test(c.id)) {
      errors.push(`${where}: id "${c.id}" não tem a forma {LETRA}{NNN}-{seq} — o check-evidence.mjs não resolve`);
    } else {
      const esperado = idEsperadoDoArquivo(file);
      if (esperado && !c.id.startsWith(`${esperado}-`)) {
        errors.push(`${where}: id "${c.id}" não pertence a ${file} — o arquivo aloca ${esperado}-NN`);
      }
    }
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
  // `modo` ficou sem trava do começo da base até aqui, apesar de estar no
  // SCHEMA.md como enumerado fechado desde o primeiro dia. Vale exatamente pelo
  // motivo do `topic`: é campo de RECUPERAÇÃO, e filtrar `modo: prescricao` é a
  // consulta que decide o que pode virar treino. Um valor fora da lista não
  // quebra nada visivelmente — só some da consulta.
  if (c.modo && !MODOS.has(c.modo)) errors.push(`${w}: modo "${c.modo}" fora do enumerado`);
  if (!c.claim?.trim()) errors.push(`${w}: claim vazia`);

  // Regra normativa não tem modo pelo mesmo motivo que não tem scope: ela não é
  // opinião, mecanismo nem narrativa, e `tier: O` já diz tudo o que `modo` diria.
  if (c.tier === 'O' && c.modo) {
    errors.push(`${w}: tier O não leva modo — regra não é prescrição de ninguém, é norma`);
  }

  // O aviso que o SCHEMA.md promete desde o primeiro dia e que nunca existiu no
  // código: prescrição com dose e sem `conditions`. O achado mais grave da
  // auditoria de escopo foi "supino 6× por semana" extraído sem "nunca acima de
  // RPE 5", que ele diz na mesma frase. Separada da condição, a prescrição não
  // fica incompleta — fica perigosa, porque parece completa.
  //
  // Aviso e não erro porque prescrição incondicional existe de verdade. Mas é
  // aqui que o passe de `conditions` tem de olhar, e é a lista dele.
  //
  // A DOSE DE DOR tem eixo próprio, e o eixo NÃO é `modo`. A trava acima usa
  // `modo === 'prescricao'` para decidir o que é instrução, e para número de dor
  // esse eixo mente — provado em 2026-08-09: `V138-19` tem quatro params em
  // `escala_dor`, dá um limiar de 2 a 4/10 cujo topo é o gatilho de encerrar a
  // sessão do PROGRAMA.md §1.2, e é `modo: opiniao`. Apagar as `conditions`
  // dela não mudava uma linha da saída deste arquivo, enquanto o
  // `DOR-E-TREINO.md` §5 afirmava que qualquer número de dor sem condição
  // pararia o build. O documento estava mentindo sobre o código.
  //
  // O eixo certo é **para quem o número é** (`scope: GERAL`) × **se o modo
  // entrega um alvo** (todos, menos `MODOS_DESCRITIVOS`). Ver `kb.mjs` para por
  // que a lista é de exclusão e não de inclusão, e para o que fica de fora.
  //
  // ERRO, e não aviso como a dose comum, por duas razões que não valem lá:
  //   - o custo do falso negativo aqui é tecido, não uma série a mais — este
  //     repositório serve um atleta com histórico de lesão de peitoral num
  //     bloco de reexposição do supino;
  //   - `escala_dor` são 3 claims em 6.912, e as três já carregam `conditions`.
  //     Uma trava que hoje acusa zero não vira lista de avisos que ninguém lê:
  //     ou está calada, ou parou o build.
  // A saída para um número de dor genuinamente incondicional não é afrouxar
  // isto: é escrever a claim no modo que a descreve, ou ligar a ressalva que a
  // fonte disse. Ressalva fabricada é pior que ressalva ausente.
  const doseDeDor = (c.params ?? []).filter((p) => p.frame === 'escala_dor');
  const doseDeDorCrua =
    doseDeDor.length > 0 && c.scope === 'GERAL' && !MODOS_DESCRITIVOS.has(c.modo) && !(c.conditions?.length);
  if (doseDeDorCrua) {
    errors.push(
      `${w}: número de dor (${doseDeDor.map((p) => `${p.name}=${p.value}`).join(', ')}) em GERAL/${c.modo} ` +
        `sem conditions — um limiar de dor servido cru vira alvo. Ligue a ressalva que a fonte disse, ` +
        `ou reclassifique se a claim descreve em vez de mandar (ver DOR-E-TREINO.md §5)`,
    );
  } else if (c.modo === 'prescricao' && !(c.conditions?.length) && (c.params ?? []).some((p) => FRAMES_DOSE.has(p.frame))) {
    warnings.push(`${w}: prescrição com dose e sem conditions — confirmar se é mesmo incondicional`);
  }

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
  // `conditions` é, segundo o próprio SCHEMA.md, "a aresta mais importante da
  // base" — e era a única lista de ids que ninguém resolvia. `basis` e
  // `conflicts` tinham trava desde o primeiro dia; esta não. Um id de condição
  // que não existe não deixa a prescrição incompleta, deixa ela PARECENDO
  // condicionada: o consumidor vê que há uma condição, não consegue abri-la, e
  // segue mesmo assim. É o modo de falha exato que a auditoria de escopo
  // descreveu, agora com um carimbo de segurança por cima.
  for (const x of c.conditions ?? []) {
    if (x === c.id) errors.push(`${w}: conditions aponta para a própria claim`);
    else if (!byId.has(x)) errors.push(`${w}: conditions aponta para ${x}, que não existe`);
    // "A limita B" e "B limita A" ao mesmo tempo não é uma relação de limitação,
    // é um par de arestas em que uma das duas está invertida. A auditoria de
    // `conditions` achou 5 pares mútuos na base e mostrou o molde: a REGRA GERAL
    // apontada como condição do EXEMPLO que ela mesma gera (`V112-14` ↔
    // `V112-15`). Isso é `basis`, não `conditions` — e o dano é o de sempre, a
    // prescrição parecendo qualificada por algo que não a qualifica. Assimetria
    // é verificável sem agente nenhum, então é erro e não aviso.
    else if ((byId.get(x).conditions ?? []).includes(c.id)) {
      errors.push(
        `${w}: conditions é assimétrica e ${c.id} ↔ ${x} apontam um para o outro — ` +
          `uma das duas arestas está invertida (regra geral apontando para o próprio exemplo é basis, não conditions)`,
      );
    }
  }

  // `scope: PESSOAL` + `modo: prescricao` é contradição de definição: PESSOAL é
  // "ele descreve o que ELE faz", prescricao é "ele diz para VOCÊ fazer". A
  // auditoria de escopo abriu as 13 ocorrências que existiam e 10 estavam
  // erradas — o Blevins narrando a própria autorregulação ("I'll probably have
  // to pull back on the single") gravado como ordem para o leitor. Aviso e não
  // erro porque as 3 restantes eram `scope` errado, não `modo`, e as duas saídas
  // são legítimas; erro forçaria o agente a escolher uma sem olhar a fonte.
  if (c.scope === 'PESSOAL' && c.modo === 'prescricao') {
    warnings.push(
      `${w}: scope PESSOAL com modo prescricao — o esquema define os dois como excludentes; ` +
        `ou a claim narra o que ele faz (modo) ou é endereçada ao leitor (scope)`,
    );
  }

  // Números: unidade e frame obrigatórios, enumerado fechado.
  for (const p of c.params ?? []) {
    if (!p.name) errors.push(`${w}: param sem name`);
    if (p.value === undefined || p.value === null) errors.push(`${w}: param ${p.name} sem value`);
    if (!p.frame) errors.push(`${w}: param ${p.name} sem frame — foi assim que 215 kg virou training max`);
    else if (!FRAMES.has(p.frame)) errors.push(`${w}: param ${p.name} com frame "${p.frame}" fora do enumerado`);
    // Valor fora da escala fechada do próprio frame. `RPE 12` não é alto, é
    // inexistente — e o único caso da base nasceu de legenda quebrada ("2 and a
    // half to 3 RPE" virando "2 and 12 to 3"). É a família dos gramas gravados
    // como `kg`, uma camada abaixo: o frame está certo e o valor não cabe nele.
    //
    // `suspect: true` rebaixa para aviso, e essa é a saída HONESTA e não a
    // frouxa: `suspect` quer dizer "este número está declarado como provável
    // defeito de ASR e o passe de Whisper é o dono dele". Sem a válvula, a única
    // forma de o build passar seria eu adivinhar o número que a fonte disse —
    // que é o defeito que esta base existe para não ter.
    else if (FRAMES_ESCALA.has(p.frame) && typeof p.value === 'number') {
      const [min, max] = FRAMES_ESCALA.get(p.frame);
      if (p.value < min || p.value > max) {
        const msg = `${w}: param ${p.name} vale ${p.value} e o frame "${p.frame}" só admite ${min}–${max}`;
        if (c.suspect) warnings.push(`${msg} — declarado suspect, é alvo do passe de Whisper`);
        else errors.push(`${msg} — número fora da escala não é valor alto, é valor inexistente`);
      }
    }
  }

  // `suspectWhy` é enumerado fechado no PROTOCOLO-EXTRACAO.md e nunca teve trava.
  if (c.suspectWhy && !SUSPECT_WHY.has(c.suspectWhy)) {
    errors.push(
      `${w}: suspectWhy "${c.suspectWhy}" fora do enumerado — o passe de Whisper precisa saber ` +
        `se procura "numero" ou "negacao", e texto livre não diz`,
    );
  }
  if (c.suspectWhy && !c.suspect) {
    errors.push(`${w}: suspectWhy sem suspect — a razão da suspeita sem a suspeita não é lida por ninguém`);
  }

  // `pct_XRM` sem dizer QUAL X é pior do que não ter o frame: "85 %" com cara de
  // percentual de máximo, e um 5RM está uns 15 % abaixo de um 1RM. O X é a metade
  // do dado, então ele é obrigatório e mora num param próprio, onde dá para
  // consultá-lo — e não escondido na prosa, onde só um leitor humano o encontra.
  const params = c.params ?? [];
  if (params.some((p) => p.frame === 'pct_XRM')) {
    const xb = params.find((p) => p.name === 'xrm_base');
    if (!xb) {
      errors.push(
        `${w}: frame pct_XRM exige um param companheiro "xrm_base" com o X (frame reps) — ` +
          `85 % de um 5RM não é 85 % de um 1RM`,
      );
    } else if (xb.frame !== 'reps') {
      // A mensagem acima já dizia "(frame reps)" e nada conferia. Mensagem que
      // promete o que a trava não cobra é a mesma divergência silenciosa entre
      // documento e código, só que dentro de uma linha. O X de um XRM é sempre
      // um número de repetições; `xrm_base` em `kg` seria a carga, e aí "85 %"
      // volta a não ter base declarada — que é o buraco inteiro do `pct_XRM`.
      errors.push(
        `${w}: xrm_base tem frame "${xb.frame}" — o X de um XRM é número de repetições (frame reps)`,
      );
    }
  }

  // Todo número na prosa precisa ter param correspondente. Número solto na
  // claim é número sem procedência, e é assim que um fator inventado entra.
  const declared = new Set();
  for (const p of params) {
    const v = String(p.value).replace(',', '.');
    declared.add(v);
    // Valor textual (`5/3/1`, `5x5`, `T3`, `RPE 8-9`) carrega dígitos que a prosa
    // repete um a um. Sem isto, declarar o nome do programa como `rotulo` não
    // satisfaria a regra, e o agente voltaria a fabricar `series: 5, reps: 5`
    // para uma frase que não prescreve série nenhuma — que foi o que aconteceu
    // em G019-20/G020-01/G020-41 antes desta linha existir.
    for (const d of v.matchAll(/\d+(?:[.,]\d+)?/g)) declared.add(d[0].replace(',', '.'));
  }
  // Id ANTES de ref, e não o contrário: `G001-01` é id de claim e `G001` é ref
  // de vídeo, e o prefixo de um é o prefixo do outro. Removido o ref primeiro,
  // sobra `-01` e o `01` vira "número sem procedência" — um erro inventado pela
  // ordem de duas substituições.
  const stripped = (c.claim ?? '')
    .replace(/\b[A-Z]\d{3}-\d+\b/g, ' ')  // ids de claim, de qualquer corpus
    .replace(REF_NA_PROSA, ' ')           // refs de vídeo, de qualquer corpus
    .replace(/\b1RM\b/gi, ' ');
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
  // `[ôóo]` e não `[óo]`: a claim V044-11 escreve "ômega três" com circunflexo, a
  // exclusão nunca casou, e o aviso ficou ali de aviso permanente sem conserto —
  // que é exatamente o efeito que este bloco de comentário diz querer evitar. A
  // exclusão do provérbio ("dois passos à frente, um passo atrás", G006-16) entra
  // pelo mesmo motivo, e é estreita de propósito: "dar dois passos para trás" no
  // walkout É medida, e continua avisando.
  const NAO_E_MEDIDA =
    /\b(?:os|as|nos|nas|d[oa]s|aos|às|ambos|ambas|nenhum dos|nenhuma das)\s+(?:dois|duas|tr[êe]s)\b|(?<![a-zà-ÿ])[ôóo]mega\s+tr[êe]s\b|\bdois passos [àa] frente\b|\b(?:dois|duas|tr[êe]s)\s+(?:cotovelos?|m[ãa]os?|joelhos?|p[ée]s?|ombros?|esc[áa]pulas?|movimentos?)\b/gi;
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

/**
 * A CATRACA DO `modo` — como um campo obrigatório entra numa base que já tem
 * 4.947 registros sem ele.
 *
 * Exigir `modo` hoje reprovaria o corpus inteiro do Vena e o build junto. Não
 * exigir nunca é como o campo passou a ingestão inteira sem trava. A saída é uma
 * dívida COM TETO: quantas claims ainda podem estar sem `modo`, e o teto só
 * desce. Quando chegar a zero, `modo` virou obrigatório sem que ninguém precise
 * se lembrar de ligar nada.
 *
 * O teto é conferido contra o extract INTEIRO, e não contra o recorte de
 * `--only`: senão cada agente rodando no próprio lote veria um teto folgado e a
 * soma estouraria sem ninguém ver.
 *
 * **O teto é POR PREFIXO DE ID, e isso é a correção de um furo real.** Um teto
 * global só de número vaza da forma mais fácil de encontrar: preencher `modo` em
 * uma claim antiga do Vena abre exatamente uma vaga para uma claim NOVA nascer
 * sem `modo`, e a soma não se move. O documento afirmava em três lugares que
 * "lote novo sem modo estoura o teto e falha o build", e era falso — bastava
 * qualquer preenchimento no mesmo passe para o build sair verde. E o passe
 * seguinte faz as duas coisas ao mesmo tempo, com dezoito agentes em paralelo,
 * que é o cenário exato.
 *
 * A dívida real não é um número, é um conjunto: as 4.947 claims do Vena escritas
 * antes de o campo existir, todas com id `V###`. Corpus nenhum mais tem direito
 * a ela — o Blevins nasceu com o campo em 1.819 de 1.819. Então o teto vira um
 * mapa, o do Vena desce conforme o passe avança, e todo prefixo ausente do mapa
 * vale ZERO: uma claim nova sem `modo` falha o build no primeiro registro,
 * qualquer que seja o que aconteça com a dívida antiga.
 *
 * **A dívida foi paga em 2026-08-09 e o mapa está VAZIO de propósito.** As
 * 4.947 claims do Vena foram preenchidas em dois passes (18 agentes, mais o
 * lote que ficou de fora e foi rodado no fechamento: R012, R030, R048, R066,
 * R084, R102, R120, R138, R156, R174, 278 claims). Prefixo ausente vale zero,
 * então `modo` é agora OBRIGATÓRIO para toda claim que não seja `tier: O`, sem
 * que ninguém tenha precisado ligar nada — que era exatamente o desenho. Não
 * reabra uma linha aqui para deixar um lote novo passar: a catraca só desce.
 */
const TETO_SEM_MODO = {};
const semModo = allClaims.filter((c) => c.tier !== 'O' && !c.modo);
const semModoPorPrefixo = new Map();
for (const c of semModo) {
  const p = String(c.id ?? '?')[0];
  semModoPorPrefixo.set(p, [...(semModoPorPrefixo.get(p) ?? []), c]);
}
for (const [p, lista] of semModoPorPrefixo) {
  const teto = TETO_SEM_MODO[p] ?? 0;
  if (lista.length > teto) {
    errors.push(
      `${lista.length} claims sem modo com id ${p}###, e o teto declarado para ${p} é ${teto} — ` +
        `claim nova tem de nascer com modo (ex.: ${lista.slice(0, 3).map((c) => c.id).join(', ')})`,
    );
  } else if (lista.length > 0 && lista.length < teto) {
    warnings.push(
      `${lista.length} claims ${p}### ainda sem modo — baixe TETO_SEM_MODO.${p} em check-claims.mjs para ${lista.length}`,
    );
  }
}

/**
 * A CATRACA DO `genero` — `modo: prescricao` vindo de vídeo que expõe material
 * de OUTRA pessoa.
 *
 * O defeito que ela mede é o mais caro que esta base ainda tem em aberto: "o
 * nSuns manda AMRAP a 95 % do training max" gravado com a mesma autoridade de
 * "faça AMRAP a 95 % do training max". O discriminador nunca esteve no texto da
 * claim — `G028-02` é *"manter a cabeça em posição mais neutra e para cima no
 * agachamento"*, indistinguível de prescrição geral para quem lê o JSONL, que é
 * o que o agente lê. O discriminador é o VÍDEO, e agora ele está no manifesto.
 *
 * **MEDE, NÃO REPROVA — e o desenho é o do `TETO_SEM_MODO`.** A rodada que ligou
 * esta trava tinha proibição explícita de editar claim (uma medição da base
 * rodava em paralelo, e medir alvo móvel foi o erro que aquela rodada existia
 * para não repetir). Uma regra que reprovasse hoje derrubaria o build sobre 76
 * claims já existentes, e o conserto pelo caminho mais fácil seria afrouxar a
 * regra — que é como uma trava morre. Então: teto POR `src`, com o número de
 * hoje, e o teto só desce.
 *
 * Por `src` e não global, pela mesma razão que o `TETO_SEM_MODO` é por prefixo:
 * um teto global vaza pelo caminho mais fácil de achar. Consertar uma claim do
 * `G020` abriria exatamente uma vaga para uma claim nova nascer errada num
 * vídeo de review qualquer, e a soma não se moveria. Vídeo ausente do mapa vale
 * ZERO — então uma claim nova só passa se alguém escrever o ref aqui à mão.
 *
 * **O piso não é necessariamente zero, e isto não é uma desculpa.** Sobra
 * prescrição legítima nesses vídeos: o conselho do próprio autor sobre adotar
 * um programa alheio, o padrão técnico universal que ele enuncia no meio de um
 * form check. O que a catraca garante é que cada uma que ficar tenha sido
 * aberta por alguém, e que o número não suba sozinho. A lista de baixo é o
 * produto: ela nomeia, vídeo a vídeo, o que a onda 2 tem de repassar.
 */
/*
 * ONDA 2, 2026-08-09 — as 76 foram abertas uma a uma, com o `verbatim` e a
 * transcrição em volta, e o teto desceu de **76 para 74**. Só duas mudaram, e o
 * motivo de tão poucas está no discriminador que o `PROTOCOLO-EXTRACAO.md`
 * declara: **de quem é o imperativo**, não o rótulo do vídeo. O grosso desta
 * fila é o Blevins saindo do material alheio para enunciar regra dele própria
 * ("I would advise…", "my general recommendation here is…", "that's how I would
 * adjust this protocol"), que é a exceção legítima que a própria trava prevê.
 *
 *   G020: 7 → 6. `G020-17` (*"three times per week is really the frequency you
 *   want for squat"*) é a frequência de agacho DO StrongLifts, narrada entre
 *   `G020-03/04/05` (a estrutura A/B) e `G020-18` (a progressão 45→50→55), e
 *   condicionada a `G020-12` — que também é `relato-de-programa`. Era a única
 *   das 76 com dose de frequência (`frequencia = 3 x_semana`) em `GERAL` +
 *   `prescricao`: a linha mais diretamente consumível da fila inteira, e o
 *   programa de outra pessoa. → `relato-de-programa`.
 *
 *   G027: 4 → 3. `G027-01` (*"YouTube is a really good way to [submit], it is
 *   far better than sending me the video files"*) é logística do canal: não é
 *   imperativo de outro autor nem conselho calibrado para um corpo, e é a única
 *   da fila que **não pode virar treino sob leitura nenhuma**. O irmão do mesmo
 *   arquivo sobre o mesmo assunto (`G027-27`, ordem da fila de vídeos) já estava
 *   fora de `prescricao`, em `fato`. → `opiniao`.
 *
 * O que NÃO desceu, e por quê — para não ser reaberto por engano:
 *   - `G011-32` e `G011-34`, que a primeira leitura do `GENERO.md` §6 chamou de
 *     "os casos claros" pelo texto da claim ("ele manda"). O `verbatim` diz o
 *     contrário: *"I would say stick with the five…"* e *"I would lean towards
 *     the lower end"*. A regra do nSuns já está gravada ao lado, em `G011-30` e
 *     `G011-31`, como `relato-de-programa`. O defeito ali é do texto da claim,
 *     não do `modo`.
 *   - As modificações que ele propõe ao programa alheio (`G005-33`, `G007-38`,
 *     `G016-44/46`, `G017-32/33/34`, `G020-10`): o imperativo é dele.
 *   - Os padrões técnicos universais dos form checks (`G029-38` punho sobre
 *     cotovelo, `G030-13` joelho sobre o segundo dedo, `G029-43` glúteo no
 *     banco). Rebaixá-los para caber na trava é o dano do falso positivo que o
 *     `PROTOCOLO-EXTRACAO.md` nomeia: some da base uma regra boa, sem rastro.
 */
const TETO_PRESCRICAO_EM_GENERO_RESTRITO = {
  // Blevins — os 16 vídeos de review (`G001`–`G020` menos `G004`, `G006` e
  // `G008`, que são tese própria e não resenha) e os 5 form checks.
  G001: 8, G002: 5, G005: 3, G007: 4, G009: 2, G011: 2, G012: 4, G013: 2,
  G014: 2, G016: 5, G017: 4, G018: 2, G019: 4, G020: 6,
  G027: 3, G029: 7, G030: 5, G031: 2,
  // Vena — o único vídeo de review do canal: ele resenha o programa que o
  // ChatGPT escreveu para ele.
  R047: 4,
};

const generoDeSrc = (ref) => byRef.get(ref)?.genero;
const violaGenero = (c) =>
  c.tier === 'R' && c.modo === 'prescricao' && GENEROS_SEM_PRESCRICAO.has(generoDeSrc(c.src));

// Gênero ausente ou fora do enumerado é ERRO e não catraca: aqui não há dívida
// histórica a amortizar — os 551 vídeos foram semeados de uma vez. O que esta
// trava pega é o manifesto reconstruído sem passar pelo `seed-genero.mjs`, caso
// em que a regra de cima ficaria desligada em silêncio, que é o pior desfecho
// possível para uma trava.
// Uma linha por VÍDEO e não por claim: um manifesto sem gênero produziria 6.766
// mensagens idênticas, o corte de 30 erros esconderia todo o resto, e o defeito
// (que é do manifesto, não das claims) ficaria irreconhecível no meio delas.
const semGenero = new Map();
for (const c of allClaims) {
  if (c.tier !== 'R' || !c.src || !byRef.has(c.src)) continue;
  const g = generoDeSrc(c.src);
  if (g === undefined || g === null || !GENEROS.has(g)) semGenero.set(c.src, g ?? null);
}
for (const [ref, g] of [...semGenero].sort()) {
  errors.push(
    g === null
      ? `o vídeo ${ref} tem claim e não tem \`genero\` no manifesto — rode ` +
        `\`node research/tools/seed-genero.mjs\` (sem o campo, a trava de prescrição em gênero restrito se desliga em silêncio)`
      : `o vídeo ${ref} declara genero "${g}", fora do enumerado de kb.mjs`,
  );
}

const violacoesPorSrc = new Map();
for (const c of allClaims) {
  if (!violaGenero(c)) continue;
  violacoesPorSrc.set(c.src, [...(violacoesPorSrc.get(c.src) ?? []), c]);
}
for (const [ref, lista] of [...violacoesPorSrc].sort()) {
  const teto = TETO_PRESCRICAO_EM_GENERO_RESTRITO[ref] ?? 0;
  const g = generoDeSrc(ref);
  if (lista.length > teto) {
    errors.push(
      `${lista.length} claims com modo prescricao vindas de ${ref}, que é ${g}, e o teto declarado é ${teto} — ` +
        `o imperativo desse vídeo é de outra pessoa (ex.: ${lista.slice(0, 3).map((c) => c.id).join(', ')})`,
    );
  } else {
    for (const c of lista) {
      warnings.push(
        `${c._where} ${c.id}: prescricao num vídeo de gênero ${g} — ${ref} expõe material de outra ` +
          `pessoa; confirmar se a claim generaliza de verdade ou se é relato/avaliação`,
      );
    }
    if (lista.length < teto) {
      warnings.push(
        `${ref}: ${lista.length} prescrições em gênero restrito, teto ${teto} — ` +
          `baixe TETO_PRESCRICAO_EM_GENERO_RESTRITO.${ref} em check-claims.mjs para ${lista.length}`,
      );
    }
  }
}

/**
 * A CATRACA DO `suspectWhy`, no mesmo desenho da do `modo` — e pelo mesmo motivo.
 *
 * O `PROTOCOLO-EXTRACAO.md` fecha o campo em `numero`/`negacao` e escreve o
 * porquê: é o mesmo passe de reparo com Whisper que resolve os dois, e ele
 * precisa saber o que procurar. Sem o campo, `list-suspects.mjs` assume `numero`
 * e a família `negacao` some — a marcação de quem de fato leu o trecho é jogada
 * fora e trocada por heurística.
 *
 * Exigir presença hoje reprovaria 53 claims que já existem. Não exigir nunca é
 * como o campo atravessou duas ingestões inteiras sem uma linha de código. Então
 * teto declarado, que só desce: claim nova sem `suspectWhy` estoura, e quando o
 * passe de Whisper zerar a dívida o campo vira obrigatório sozinho. Foi
 * exatamente esta mecânica que tornou detectável o lote de 278 claims que um dos
 * 18 agentes nunca rodou — trava que só desce vale mais que 18 confirmações.
 */
const TETO_SEM_SUSPECT_WHY = 53;
const semPorque = allClaims.filter((c) => c.suspect && !c.suspectWhy);
if (semPorque.length > TETO_SEM_SUSPECT_WHY) {
  errors.push(
    `${semPorque.length} claims com suspect e sem suspectWhy, e o teto declarado é ${TETO_SEM_SUSPECT_WHY} — ` +
      `claim nova tem de dizer se a suspeita é "numero" ou "negacao" ` +
      `(ex.: ${semPorque.slice(-3).map((c) => c.id).join(', ')})`,
  );
} else if (semPorque.length > 0 && semPorque.length < TETO_SEM_SUSPECT_WHY) {
  warnings.push(
    `${semPorque.length} claims com suspect e sem suspectWhy — ` +
      `baixe TETO_SEM_SUSPECT_WHY em check-claims.mjs para ${semPorque.length}`,
  );
}

/**
 * A CATRACA DA `anedota` — o valor que o protocolo já proibiu e o código ainda
 * aceita.
 *
 * Em 2026-08-09 o `PROTOCOLO-EXTRACAO.md` passou a escrever, em caixa alta,
 * *"Não emita `anedota` em lote novo. Use `narrativa`"*, e o
 * `FRONTEIRA-MODO.md` §2.2 registra o porquê: a fronteira que os 18 lotes
 * usaram era tempo verbal, o tempo verbal já está no `verbatim`, e o campo era
 * uma cópia lossy dele. Só que `MODOS` continua aceitando `anedota` — e tem de
 * continuar, porque as 243 claims que estão lá ainda não migraram.
 *
 * Uma regra que só existe em markdown é o defeito nº 3 desta casa: documento e
 * código divergindo em silêncio. O `genero` acabou de ser ligado por causa dele.
 * Sem esta catraca, o intervalo entre a proibição e a onda 2 é uma janela em que
 * lote novo escreve `anedota`, o build sai verde, e a dívida que a onda 2 vai
 * pagar cresce enquanto ela é escrita.
 *
 * **POR PREFIXO, e não global — é a lição já paga do `TETO_SEM_MODO`.** Um teto
 * global de número vaza pelo caminho mais fácil de achar: retagar uma `anedota`
 * antiga do Vena abre exatamente uma vaga para uma `anedota` NOVA nascer, e a
 * soma não se move. É o cenário exato da onda 2, que retaga e ingere ao mesmo
 * tempo. Prefixo ausente vale ZERO: fonte nova nasce sem direito à dívida.
 *
 * A ordem que o `FRONTEIRA-MODO.md` §5 exige continua valendo e esta catraca não
 * a atropela: `'anedota'` só sai de `MODOS` quando a última claim sair dela. O
 * que a catraca garante é que o número não suba enquanto isso não acontece.
 */
const TETO_ANEDOTA = { V: 196, G: 47 };
const anedotaPorPrefixo = new Map();
for (const c of allClaims.filter((c) => c.modo === 'anedota')) {
  const p = String(c.id ?? '?')[0];
  anedotaPorPrefixo.set(p, [...(anedotaPorPrefixo.get(p) ?? []), c]);
}
for (const [p, lista] of anedotaPorPrefixo) {
  const teto = TETO_ANEDOTA[p] ?? 0;
  if (lista.length > teto) {
    errors.push(
      `${lista.length} claims em modo anedota com id ${p}###, e o teto declarado para ${p} é ${teto} — ` +
        `o protocolo manda usar narrativa em lote novo (ex.: ${lista.slice(-3).map((c) => c.id).join(', ')})`,
    );
  } else if (lista.length > 0 && lista.length < teto) {
    warnings.push(
      `${lista.length} claims ${p}### ainda em anedota — baixe TETO_ANEDOTA.${p} em check-claims.mjs para ${lista.length}`,
    );
  }
}

const tierCount = new Map();
const topicCount = new Map();
const modoCount = new Map();
for (const c of claims) {
  tierCount.set(c.tier, (tierCount.get(c.tier) ?? 0) + 1);
  modoCount.set(c.modo ?? '—', (modoCount.get(c.modo ?? '—') ?? 0) + 1);
  for (const t of c.topic ?? []) topicCount.set(t, (topicCount.get(t) ?? 0) + 1);
}

console.log(`\nBase de conhecimento — ${claims.length} claims em ${files.length} lote(s)`);
console.log(`  tiers ..................... ${[...tierCount].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  ')}`);
console.log(`  tópicos distintos ......... ${topicCount.size}`);
console.log(`  vídeos com claim .......... ${new Set(claims.filter((c) => c.src).map((c) => c.src)).size}`);
console.log(`  contradições registradas .. ${claims.filter((c) => c.conflicts?.length).length}`);
console.log(`  condições registradas ..... ${claims.filter((c) => c.conditions?.length).length}`);
console.log(`  modos ..................... ${[...modoCount].sort((a, b) => b[1] - a[1]).map(([m, n]) => `${m}:${n}`).join('  ')}`);

// O gênero do vídeo em números, porque é a superfície que a rodada seguinte tem
// de baixar. As duas linhas respondem "quanto ainda falta" e "quanto disso nem
// dá para perguntar" — a segunda é a honestidade do campo: vídeo
// `indeterminado` não tem trava e não deve fingir que tem.
const totalViolacoes = [...violacoesPorSrc.values()].reduce((s, l) => s + l.length, 0);
const totalTeto = Object.values(TETO_PRESCRICAO_EM_GENERO_RESTRITO).reduce((s, n) => s + n, 0);
const emIndeterminado = claims.filter((c) => c.tier === 'R' && generoDeSrc(c.src) === 'indeterminado').length;
console.log(
  `  prescricao em gênero restrito  ${totalViolacoes} em ${violacoesPorSrc.size} vídeo(s) ` +
    `· teto ${totalTeto} (só desce)`,
);
console.log(`  claims de vídeo indeterminado  ${emIndeterminado} — gênero não decidido, nenhuma trava se aplica`);

if (VERBOSE) {
  console.log('\n  tópicos mais densos:');
  for (const [t, n] of [...topicCount].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`    ${String(n).padStart(4)}  ${t}`);
  }
}

// Avisos saem AGRUPADOS POR ESPÉCIE, e não numa lista corrida cortada em 15.
// Assim que a checagem de `conditions` entrou, um único tipo de aviso passou a
// ocupar a lista inteira e escondeu os cinco avisos de número por extenso — que
// são os que alguém consegue resolver hoje. Uma espécie ruidosa não pode enterrar
// uma espécie acionável só por ser mais numerosa.
if (warnings.length > 0) {
  const especie = (msg) => {
    const corpo = msg.split(/: /).slice(1).join(': ') || msg;
    return corpo.replace(/ \(.*$/, '').replace(/ —.*$/, '');
  };
  const porEspecie = new Map();
  for (const x of warnings) {
    const k = especie(x);
    porEspecie.set(k, [...(porEspecie.get(k) ?? []), x]);
  }
  console.log(`\n${warnings.length} aviso(s), em ${porEspecie.size} espécie(s):`);
  for (const [k, lista] of [...porEspecie].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  ${lista.length}× ${k}`);
    for (const x of lista.slice(0, VERBOSE ? lista.length : 4)) console.log(`    ⚠ ${x}`);
    if (!VERBOSE && lista.length > 4) console.log(`    … e mais ${lista.length - 4} (--verbose mostra tudo)`);
  }
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 30)) console.error(`  ✗ ${e}`);
  if (errors.length > 30) console.error(`  … e mais ${errors.length - 30}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ toda claim resolve, todo verbatim existe, todo número tem frame\n');
