#!/usr/bin/env node
/**
 * ENDEREÇOS `[Rnn @mm:ss]` — o formato pelo qual o PROGRAMA.md cita a base.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE MÓDULO EXISTE
 *
 * A base tem duas maneiras de apontar para uma claim, e só uma delas tinha
 * trava. `check-claims.mjs` e `check-evidence.mjs` conferem ids `Vnnn-nn`; o
 * `PROGRAMA.md`, que é o documento que vira TREINO, não usa ids — ele cita
 * `[R79 @03:35]`. Até 12/08/2026 `check-evidence.mjs` filtrava a linha de
 * comando por `/^[A-Z]\d{3}-\d+$/` e todo endereço caía fora EM SILÊNCIO:
 * passar `"R79 @03:35"` junto de um id imprimia "Resolvendo 1 id(s)".
 *
 * O custo disso foi medido: cinco endereços errados do §1.2 do `PROGRAMA.md`
 * sobreviveram a SEIS ondas de auditoria. Não porque ninguém olhou — porque a
 * trava não enxergava o formato que o documento usa.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE TOLERÂNCIA, E POR QUE ELA NÃO É CHUTADA
 *
 * A tentação é comparar por igualdade exata. Isso foi tentado numa onda anterior
 * e produziu um número falso: por igualdade exata, 230 dos 263 endereços do
 * próprio `PROGRAMA.md` seriam "inexistentes" — 87 % do documento, o que
 * denunciaria o instrumento, não o documento.
 *
 * A causa é que os dois lados falam de tempos diferentes:
 *
 *   - o `at` de uma claim é o início do BLOCO em que a extração a encontrou, e
 *     os blocos são quantizados;
 *   - o endereço no documento é o instante FALADO da frase, em algum ponto
 *     dentro desse bloco.
 *
 * Logo o erro esperado não é zero: é "onde no bloco a frase caiu". A tolerância
 * correta é METADE do passo da grade, porque além de meio passo já existe uma
 * marca mais próxima e o endereço deixa de identificar um bloco só.
 *
 * `toleranciaDaGrade()` MEDE o passo do corpus em vez de fixá-lo: mediana dos
 * intervalos entre marcas consecutivas dentro de cada fonte. No corpus de
 * 12/08/2026 isso dá 15 s (2.701 intervalos de 15 s e 632 de 16 s, em 3.863),
 * portanto ±7 s. Se a extração mudar de granularidade, a trava acompanha.
 *
 * A escolha da MEDIANA e não da média é deliberada: a cauda de intervalos longos
 * (silêncio, corte de edição — o máximo medido é 564 s) puxaria a média e
 * afrouxaria a trava exatamente onde ela precisa apertar.
 *
 * A validação independente fecha: a distância assinada dos 259 endereços do
 * `PROGRAMA.md` até a marca mais próxima tem CORPO de −7 s a +7 s (249
 * endereços), depois um VALE (nada em −10, −9, −8, nem em +9 a +13) e uma CAUDA
 * de 10 endereços a 8, 11, 14, 15 e 27 s. O corte de ±7 s cai no vale — não foi
 * escolhido para caber, foi derivado da grade e depois conferido contra a
 * distribuição.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ESTE MÓDULO AFIRMA E O QUE ELE NÃO AFIRMA
 *
 * `resolverEndereco` responde UMA pergunta: *existe bloco nesta marca?* Ela não
 * responde *o texto citou a claim certa?* nem *o rótulo `[GERAL]`/`[PESSOAL]`
 * está certo?* — e é a segunda que mais custou aqui. Dos cinco endereços que uma
 * onda chamou de "fabricados", todos resolvem e dois apontam para a claim certa;
 * o defeito real era de `scope`/`modo`. Por isso `resolverEndereco` devolve as
 * claims do bloco em vez de um booleano: quem chama tem de LER.
 *
 * `veredito`:
 *   - `'sem-fonte'`  — não existe `Rnnn` na base. Este é o único caso em que
 *                      "fabricado" é a palavra certa.
 *   - `'fora-de-faixa'` — a fonte existe, nenhum bloco a ±tolerância. A claim
 *                      citada pode existir noutra marca; o endereço é que erra.
 *   - `'resolve'`    — há bloco. Confira `scope`/`modo` das claims devolvidas.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE `'fora-de-faixa'` SIGNIFICA DE FATO — a propriedade que o teste revelou
 *
 * Numa grade densa de 15 s, a janela de ±7 s LADRILHA a linha do tempo: um
 * instante a 8 s de uma marca está a 7 s da seguinte. Portanto, dentro de um
 * trecho continuamente extraído, NENHUM endereço cai fora — e isso é correto,
 * porque todo instante falado pertence a algum bloco.
 *
 * Logo `'fora-de-faixa'` só pode significar uma coisa: o endereço caiu num
 * BURACO da grade, um trecho de onde a extração não tirou claim nenhuma. É o
 * sinal que se quer — a citação aponta para onde não há nada. O caso real é
 * `[R4 @02:33]` na nota do Crucifixo no Peck Deck: R004 tem marcas em 02:17 e
 * 02:47, um buraco de 30 s, e o endereço fica a 16 s e 14 s das bordas.
 *
 * Consequência prática para quem lê um relatório: a contagem de
 * `'fora-de-faixa'` é PEQUENA por construção (10 em 259 no `PROGRAMA.md`), e uma
 * varredura que devolva centenas está com a tolerância errada, não com o
 * documento errado.
 */

/** `[R79 @03:35]`, `R79 @03:35`, `[R11 @02:36-03:07]`. */
export const ENDERECO_RE = /^\[?R(\d{1,3})\s*@\s*(\d{1,2}:\d{2})(?:-(\d{1,2}:\d{2}))?\]?$/;

/** O mesmo padrão, para varrer prosa em vez de validar um argumento inteiro. */
export const ENDERECO_RE_GLOBAL = /\[R(\d{1,3})\s*@\s*(\d{1,2}:\d{2})(?:-(\d{1,2}:\d{2}))?\]/g;

/** `mm:ss` → segundos. */
export function emSegundos(marca) {
  const [m, s] = String(marca).split(':').map(Number);
  return m * 60 + s;
}

/** `2:05` e `02:05` são o mesmo endereço; o corpus grava com dois dígitos. */
export const normalizarMarca = (t) => (String(t).length === 4 ? `0${t}` : String(t));

/** Só marcas `mm:ss` entram na grade: `F001` endereça por `§4.1.3`. */
export const marcaDeTempo = (at) => /^\d{1,2}:\d{2}$/.test(String(at ?? ''));

/**
 * Um endereço solto → `{ original, src, marcas }`, ou `null` se não for endereço.
 * `marcas` tem duas entradas quando o texto cita uma FAIXA (`@02:36-03:07`):
 * as duas pontas valem, porque a citação cobre o trecho inteiro.
 */
export function parsearEndereco(texto) {
  const m = ENDERECO_RE.exec(String(texto).trim());
  if (!m) return null;
  return {
    original: String(texto).trim(),
    src: `R${String(m[1]).padStart(3, '0')}`,
    marcas: [normalizarMarca(m[2]), ...(m[3] ? [normalizarMarca(m[3])] : [])],
  };
}

/**
 * Passo da grade de `at` e a tolerância derivada dele — ver o cabeçalho.
 * Devolve `{ passo, tolerancia, intervalos }`; `passo` é `null` num corpus sem
 * marcas de tempo suficientes, e aí a tolerância é 0 (igualdade exata), que é o
 * comportamento conservador correto: sem grade medida, não se inventa folga.
 */
export function toleranciaDaGrade(claims) {
  const porSrc = new Map();
  for (const c of claims) {
    if (!marcaDeTempo(c.at)) continue;
    if (!porSrc.has(c.src)) porSrc.set(c.src, new Set());
    porSrc.get(c.src).add(emSegundos(c.at));
  }
  const intervalos = [];
  for (const marcas of porSrc.values()) {
    const ordenadas = [...marcas].sort((a, b) => a - b);
    for (let i = 1; i < ordenadas.length; i += 1) {
      const d = ordenadas[i] - ordenadas[i - 1];
      if (d > 0) intervalos.push(d);
    }
  }
  if (intervalos.length === 0) return { passo: null, tolerancia: 0, intervalos: 0 };
  intervalos.sort((a, b) => a - b);
  const passo = intervalos[Math.floor(intervalos.length / 2)];
  return { passo, tolerancia: Math.floor(passo / 2), intervalos: intervalos.length };
}

/**
 * Resolve um endereço contra as claims de sua fonte.
 *
 * `claimsDaFonte` é a lista JÁ filtrada por `src` (quem chama tem o índice).
 * Devolve `{ veredito, dentro, proximas, tolerancia }`, com `dentro` e
 * `proximas` como `{ claim, distancia }` ordenados por distância.
 */
export function resolverEndereco(endereco, claimsDaFonte, tolerancia) {
  if (!claimsDaFonte || claimsDaFonte.length === 0) {
    return { veredito: 'sem-fonte', dentro: [], proximas: [], tolerancia };
  }
  const alvos = endereco.marcas.map(emSegundos);
  const comDistancia = claimsDaFonte
    .filter((c) => marcaDeTempo(c.at))
    .map((claim) => ({
      claim,
      distancia: Math.min(...alvos.map((alvo) => Math.abs(emSegundos(claim.at) - alvo))),
    }))
    .sort((a, b) => a.distancia - b.distancia);

  const dentro = comDistancia.filter((x) => x.distancia <= tolerancia);
  return {
    veredito: dentro.length > 0 ? 'resolve' : 'fora-de-faixa',
    dentro,
    proximas: comDistancia.slice(0, 3),
    tolerancia,
  };
}

/** Índice `src → claims`, que é como `resolverEndereco` quer receber. */
export function indexarPorFonte(claims) {
  const porSrc = new Map();
  for (const c of claims) {
    if (!porSrc.has(c.src)) porSrc.set(c.src, []);
    porSrc.get(c.src).push(c);
  }
  return porSrc;
}
