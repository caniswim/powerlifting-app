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
 * A regra ingênua é "o recente vence", e ela é uma armadilha aqui. 93 % do canal
 * do Blevins é de 2013–2018 contra um Vena que publicou este mês: aplicada crua,
 * a data faz o Blevins perder quase todo empate — e a perspectiva de competidor
 * TESTADO, que é a única razão de ele estar na base, vira decoração.
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
    name: 'Matt Vena',
    channelId: 'UC4ogvS0mhrPjsoCOjIKlovA',
    refPrefix: 'R',
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
    name: 'Garrett Blevins',
    handle: 'gjmjblevins',
    refPrefix: 'G',
    dir: 'research/corpus/blevins',
    // Fonte nova: nada foi citado ainda, então não há numeração legada a
    // preservar e todo vídeo é citável.
    postRun1: 0,
    testado: true,
    /**
     * Compete testado na IPF. Onde a pergunta é "quanto disso é possível sem
     * farmacologia" ou "como é a competição de verdade", ele tem uma coisa que
     * nenhuma data de publicação compra — e vence o Vena mesmo sendo de 2016.
     */
    mandaEm: ['natural-vs-enhanced', 'competicao', 'pico', 'comandos-ipf', 'regras-ipf', 'taper', 'volume', 'recuperacao'],
  },
};

/** Resolve a fonte pedida em `--source <id>`; default `vena` por compatibilidade. */
export function resolveSource(argv = process.argv) {
  const i = argv.indexOf('--source');
  const id = i >= 0 ? argv[i + 1] : 'vena';
  const src = SOURCES[id];
  // Erro de CLI merece mensagem, não stack: quem digitou `--source blevin` quer
  // ver a lista de fontes, não o interno do loader de módulos.
  if (!src) {
    console.error(`fonte "${id}" desconhecida — conhecidas: ${Object.keys(SOURCES).join(', ')}`);
    process.exit(1);
  }
  if (PREFIXOS_RESERVADOS.has(src.refPrefix)) {
    console.error(`fonte "${id}" usa prefixo "${src.refPrefix}", que é tier reservado no SCHEMA.md`);
    process.exit(1);
  }
  return src;
}

/** Caminhos derivados de `dir`. Um lugar só decide o layout de cada fonte. */
export function paths(src, root) {
  const base = `${root}/${src.dir}`;
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
  return src.channelId
    ? `https://www.youtube.com/channel/${src.channelId}/videos`
    : `https://www.youtube.com/@${src.handle}/videos`;
}

/** `G` + 3 dígitos. O padStart fixo é o que faz `G007` e `G070` ordenarem certo. */
export function refOf(src, n) {
  return `${src.refPrefix}${String(n).padStart(3, '0')}`;
}
