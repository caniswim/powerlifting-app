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
