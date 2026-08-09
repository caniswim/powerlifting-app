/**
 * O registro de fontes do corpus.
 *
 * Existe porque a base deixou de ter uma fonte só. Enquanto era só o Vena, o id
 * do canal podia morar hardcoded dentro do script que o usava; com a segunda
 * fonte isso vira duas cópias divergentes da mesma verdade, e a terceira já
 * seria erro de digitação silencioso apontando para o canal errado.
 *
 * O prefixo de ref é a parte que NÃO pode colidir: `[R042]` e `[G042]` são
 * vídeos de pessoas diferentes, e um checker que confunde os dois valida uma
 * citação inexistente sem reclamar. Por isso o prefixo é declarado aqui, uma vez,
 * junto com os tiers reservados que ele não pode assumir.
 *
 * `dir` do Vena é a RAIZ de `research/corpus/`, não uma subpasta. Isso é feio de
 * propósito: mover os 197 arquivos dele para `research/corpus/vena/` quebraria
 * todo `transcript` já gravado no manifesto e toda claim já extraída. A dívida de
 * layout é mais barata que a migração — fontes novas nascem em subpasta, e o
 * Vena fica onde está.
 *
 * ── NEM TODA FONTE É UM CANAL: o campo `kind` ───────────────────────────────
 *
 * O regulamento da IPF são 143 claims, é a fonte de primeira ordem da base (o
 * único tier onde discordar não é opção, ver `SCHEMA.md`) e ficou fora deste
 * registro por meses, porque o registro só sabia descrever canal de YouTube.
 * Ficar de fora não era inofensivo: o prefixo `F` não estava reservado contra
 * colisão, `REF_NA_PROSA` do `check-claims.mjs` é montado a partir das chaves
 * daqui e portanto não reconhecia `F001` escrito na prosa de uma claim (os três
 * dígitos viravam "número sem procedência"), e — o pior — a tabela de precedência
 * dava `regras-ipf` e `comandos-ipf` a um YouTuber, porque não havia quem mais
 * reivindicasse.
 *
 * A saída errada seria fingir que o PDF é um canal: inventar `channelId`, `dir`
 * com `transcripts/` e `captions/`, `postRun1: 0`, `testado: false`. Todo campo
 * desses seria mentira, e mentira em registro é o que produz o agente que "segue
 * o padrão existente" para o lugar errado.
 *
 * Então o registro passa a ter duas formas, discriminadas por `kind`:
 *
 *   `kind: 'canal'`     — YouTube. Tem `channelId`/`handle`, corpus por vídeo com
 *                         manifesto, transcrição, legenda e data por item, e
 *                         `postRun1`. É o que as ferramentas de ingestão consomem.
 *   `kind: 'normativo'` — documento. Não tem canal, não tem manifesto, não tem
 *                         data por item (o documento tem UMA vigência) e não tem
 *                         `testado` (regra não compete). Tem `dir` porque o
 *                         corpus existe em disco, e tem prefixo e `mandaEm`
 *                         porque é para isso que este registro serve.
 *
 * O que NÃO entra aqui: versão, URL, parágrafo e caminho do PDF do regulamento.
 * Isso já mora em `source` dentro de cada claim `tier: O`, que é onde o
 * `check-claims.mjs` confere o verbatim contra o documento. Repetir aqui criaria
 * a 144ª cópia da mesma verdade, e é a cópia que ninguém atualizaria quando saísse
 * o rulebook de 2027.
 */

/**
 * Prefixos que um tier do `SCHEMA.md` já ocupa (`R` como tier de vídeo é
 * ambíguo com `R` como prefixo do Vena por acidente histórico, e é o único caso
 * tolerado). Uma fonte nova que tentasse usar `E`, `L`, `I`, `U` ou `V` criaria
 * ambiguidade real entre "ref de vídeo" e "tier de claim" / "id de claim".
 */
export const PREFIXOS_RESERVADOS = new Set(['E', 'L', 'I', 'U', 'V', 'O']);

/**
 * QUEM VENCE QUANDO DUAS FONTES DISCORDAM.
 *
 * A regra ingênua é "o recente vence", e ela é uma armadilha aqui — mas não pela
 * razão que este comentário alegava até 09/08/2026. A alegação era "93 % do canal
 * do Blevins é de 2013–2018, então a data o mata em quase todo empate". Os 93 %
 * são verdade sobre o CANAL (329 dos 354 vídeos do manifesto) e falsos sobre a
 * BASE: a triagem filtrou pesado, nada anterior a 12/09/2016 foi extraído, e das
 * 1.819 claims dele **1.038 (57 %) são de 2022 em diante**, vindas de 25 dos 50
 * vídeos extraídos. O mais novo do Blevins na base é de 11/06/2025; o do Vena, de
 * 08/08/2026.
 *
 * A armadilha real é mais estreita e continua sendo uma armadilha: as 781 claims
 * de 2016–2018 (43 %) são justamente onde mora o material de competição dele —
 * `competicao` 86 contra 19, `pico` 61 contra 30, `regras-ipf` 14 contra 0,
 * `comandos-ipf` 9 contra 0, comparando a metade antiga com a nova. Aplicar data
 * crua não apagaria o Blevins inteiro; apagaria exatamente a parte pela qual ele
 * foi ingerido, e deixaria a metade recente, que é mais genérica.
 *
 * Os números acima saem de `manifest.json` do Blevins cruzado com os `G*.jsonl`;
 * a consulta que os produziu está em `research/kb/DEFEITOS-PONTUAIS.md` §3, para
 * que recontar não dependa de acreditar neste comentário.
 *
 * A ordem certa é credencial primeiro, data como desempate dentro da mesma
 * faixa. E credencial não é global: é por assunto. Ninguém tem autoridade sobre
 * tudo, e uma fonte que manda em pico de competição não manda em fisiologia.
 *
 * `mandaEm` lista tópicos do vocabulário fechado de `PROTOCOLO-EXTRACAO.md` — os
 * mesmos que a claim usa. Não é decorativo: quando o ledger de contradições for
 * construído, cada aresta entre fontes tem de declarar por que um lado venceu, e
 * `credencial` só é resposta legítima se o tópico da contradição estiver aqui.
 *
 * O critério do atleta, na palavra dele: o recente vence quando quem diz é BEM
 * relevante — atleta com mundial natural, ou treinador de atleta mundial
 * natural. Pelo critério literal, o Vena NÃO passa: não é natural, não tem
 * mundial, não treina campeão mundial. Ele está na base assim mesmo, e isso é
 * uma decisão curada, não um fato derivável. Fica escrita aqui exatamente por
 * isso — uma exceção não declarada é uma exceção que alguém vai "corrigir".
 */
export const SOURCES = {
  vena: {
    id: 'vena',
    kind: 'canal',
    name: 'Matt Vena',
    channelId: 'UC4ogvS0mhrPjsoCOjIKlovA',
    refPrefix: 'R',
    /**
     * O `V` é o acidente histórico documentado no SCHEMA.md: os ids nasceram
     * como `V{ref}-{seq}` quando havia uma fonte só e `V` queria dizer "vídeo".
     * Com a segunda fonte a regra quebrou — `G010` daria `V010-01`, que já é do
     * `R010.jsonl` do Vena. Fontes novas usam o próprio `refPrefix` como
     * `idPrefix`; o Vena fica com o `V` porque renumerar 4.947 ids já citados por
     * `conflicts`, `basis` e `conditions` é exatamente o que o esquema proíbe.
     */
    idPrefix: 'V',
    // Raiz, por compatibilidade retroativa — ver comentário do topo.
    dir: 'research/corpus',
    /** Vídeos publicados depois da run 1 ficam fora da numeração citável. */
    postRun1: 1,
    testado: false,
    /**
     * Não é atleta testado nem coach de campeão mundial natural: entra por
     * exposição sistemática de método, que é raro e é o que a base consome.
     * Manda no que é mecânica e didática de execução — não no que é atingível
     * sem farmacologia, onde ele é justamente a testemunha errada.
     */
    mandaEm: ['tecnica', 'setup', 'pegada', 'barra-alta', 'barra-baixa', 'sumo', 'convencional', 'selecao-exercicio', 'erro-comum', 'meta-metodologia'],
  },

  blevins: {
    id: 'blevins',
    kind: 'canal',
    name: 'Garrett Blevins',
    handle: 'gjmjblevins',
    refPrefix: 'G',
    /** Fonte pós-colisão: `idPrefix` = `refPrefix`, e o id sai do ref. */
    idPrefix: 'G',
    dir: 'research/corpus/blevins',
    // Fonte nova: nada foi citado ainda, então não há numeração legada a
    // preservar e todo vídeo é citável.
    postRun1: 0,
    testado: true,
    /**
     * Compete testado na IPF. Onde a pergunta é "quanto disso é possível sem
     * farmacologia" ou "como é a competição de verdade", ele tem uma coisa que
     * nenhuma data de publicação compra — e vence o Vena mesmo sendo de 2016.
     *
     * `comandos-ipf` e `regras-ipf` saíram daqui em 09/08/2026 e foram para a
     * fonte `ipf`. Ele continua sendo a melhor testemunha de COMO a regra é
     * aplicada na plataforma; ele não é autoridade sobre O QUE a regra diz, e
     * enquanto o regulamento não estava registrado a tabela de precedência
     * respondia que era. Um vídeo de 2017 descrevendo comando de árbitro perde,
     * sem discussão, para o texto vigente desde 01/03/2026.
     */
    mandaEm: ['natural-vs-enhanced', 'competicao', 'pico', 'taper', 'volume', 'recuperacao'],
  },

  ipf: {
    id: 'ipf',
    kind: 'normativo',
    name: 'IPF Technical Rulebook',
    refPrefix: 'F',
    /** Fonte pós-colisão: `idPrefix` = `refPrefix`. `F001.jsonl` → `F001-01`. */
    idPrefix: 'F',
    /**
     * O corpus existe em disco — PDF baixado e transcrição citável em markdown —
     * mas não tem manifesto, porque não há vídeos a manifestar. Versão, vigência,
     * URL e parágrafo moram em `source`, dentro de cada claim; ver o comentário
     * do topo sobre por que não são repetidos aqui.
     */
    dir: 'research/corpus/ipf',
    /**
     * Manda no que a regra DIZ, e é o único lugar da base onde "manda" é literal:
     * `tier: O` não se pondera contra opinião de YouTube nem perde para vídeo
     * mais recente. Note o que NÃO está na lista — `profundidade` fica com quem
     * ensina a atingi-la, porque a regra define o critério de validade e não a
     * técnica de execução, e `competicao` fica com o Blevins, porque como é o dia
     * da competição de verdade não está escrito em regulamento nenhum.
     */
    mandaEm: ['regras-ipf', 'comandos-ipf'],
  },
};

/**
 * Resolve a fonte pedida em `--source <id>`; default `vena` por compatibilidade.
 *
 * Só devolve fonte `kind: 'canal'`. Todos os quatro chamadores desta função
 * — `build-manifest`, `fetch-captions`, `fetch-dates`, `verify-manifest` — são
 * pipeline de YouTube, e nenhum deles tem o que fazer com um PDF. Recusar aqui,
 * uma vez, é mais barato do que quatro guardas espalhadas, e infinitamente mais
 * barato do que `yt-dlp` sendo apontado para uma fonte que não tem canal.
 */
export function resolveSource(argv = process.argv) {
  const i = argv.indexOf('--source');
  const id = i >= 0 ? argv[i + 1] : 'vena';
  const src = SOURCES[id];
  // Erro de CLI merece mensagem, não stack: quem digitou `--source blevin` quer
  // ver a lista de fontes, não o interno do loader de módulos.
  if (!src) {
    const canais = Object.values(SOURCES).filter((s) => s.kind === 'canal').map((s) => s.id);
    console.error(`fonte "${id}" desconhecida — canais conhecidos: ${canais.join(', ')}`);
    process.exit(1);
  }
  if (src.kind !== 'canal') {
    console.error(
      `fonte "${id}" é ${src.kind}, não canal — não tem vídeo, manifesto nem legenda para esta ferramenta buscar.\n` +
        `  O corpus dela está em ${src.dir} e as claims em research/extract/${src.refPrefix}001.jsonl.`,
    );
    process.exit(1);
  }
  if (PREFIXOS_RESERVADOS.has(src.refPrefix)) {
    console.error(`fonte "${id}" usa prefixo "${src.refPrefix}", que é tier reservado no SCHEMA.md`);
    process.exit(1);
  }
  return src;
}

/**
 * Caminhos derivados de `dir`. Um lugar só decide o layout de cada fonte.
 *
 * Fonte normativa devolve `dir` e `manifest`, e mais nada. `manifest` aponta para
 * um arquivo que não existe e nunca vai existir — de propósito: o
 * `check-claims.mjs` faz `paths(src, ROOT).manifest` para TODA fonte do registro
 * e lê ausência como "corpus ainda não construído", que é como a fonte normativa
 * atravessa o laço de vídeo sem precisar de um `if (kind)` dentro do checker.
 *
 * As chaves de vídeo (`transcripts`, `captions`, `dates`, `tmp`) NÃO são
 * devolvidas para uma fonte normativa. Quem pedir recebe `undefined` e quebra
 * alto no primeiro uso — que é o comportamento certo. Devolver
 * `research/corpus/ipf/captions` seria um caminho plausível para uma pasta que
 * não existe e não deveria existir, e caminho plausível é como um lote acaba
 * gravando gramas na gaveta de quilos.
 */
export function paths(src, root) {
  const base = `${root}/${src.dir}`;
  if (src.kind !== 'canal') {
    return { dir: base, manifest: `${base}/manifest.json` };
  }
  return {
    dir: base,
    manifest: `${base}/manifest.json`,
    transcripts: `${base}/transcripts`,
    captions: `${base}/captions`,
    dates: `${base}/dates.json`,
    tmp: `${base}/.tmp`,
  };
}

/** A aba /videos do canal, por id quando existe (estável) ou por handle. */
export function channelVideosUrl(src) {
  if (src.kind !== 'canal') {
    throw new Error(`fonte "${src.id}" é ${src.kind} e não tem canal de YouTube`);
  }
  return src.channelId
    ? `https://www.youtube.com/channel/${src.channelId}/videos`
    : `https://www.youtube.com/@${src.handle}/videos`;
}

/** `G` + 3 dígitos. O padStart fixo é o que faz `G007` e `G070` ordenarem certo. */
export function refOf(src, n) {
  return `${src.refPrefix}${String(n).padStart(3, '0')}`;
}
