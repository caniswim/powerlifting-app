/**
 * A CAMADA DE RECUPERAÇÃO — o conserto do modo de falha medido em MEDICAO-02.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DEFEITO QUE ESTE ARQUIVO EXISTE PARA IMPEDIR
 *
 * Na medição de 09/08/2026 as sete respostas não-`bem` falharam pelo MESMO
 * defeito, e nenhuma delas por fabricar: **declararam ausente da base algo que a
 * base tem, com id e com `param` tipado.**
 *
 *   · Q05 buscou `six times` (4 resultados, todos PESSOAL) e nunca `six days a
 *     week` (6 resultados, dois deles GERAL + prescricao). Perdeu V170-34 e
 *     V175-53 — supino seis dias por semana, no atleta com peitoral rompido.
 *   · Q19 buscou `sets per muscle` (2) e parou doze ids antes de V010-13, no
 *     mesmo vídeo que já estava citando.
 *   · Q16 nunca tentou `training cycle`, que tem 86 claims.
 *   · Q11 filtrou `--modo prescricao --scope GERAL`; o número de que precisava
 *     mora em PESSOAL + `fato` (V033-03/04/05). **O filtro de segurança é o
 *     mesmo filtro de recuperação, e ele esconde.**
 *
 * O relatório propôs "protocolo de busca em dois passes". Sozinho isso é
 * instruir o agente a se esforçar mais, que é a receita que já falhou aqui três
 * vezes. Uma busca que só casa substring literal vai continuar errando
 * `six days a week` quando se digitou `six times`, por mais protocolo que se
 * escreva em cima dela. **Onde um compilador pode verificar, agente não deve** —
 * e achar `six` dentro de `six days a week` é exatamente o que um compilador
 * pode fazer.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AS QUATRO PEÇAS, E O CASO MEDIDO QUE CADA UMA ATACA
 *
 * 1. **Todo campo, não só a prosa.** O literal passa a casar também em
 *    `params.name` / `unit` / `value` e em `topic` — é onde `freq_supino` mora.
 *    Mas o que casou FORA da prosa sai numa seção própria: mudar em silêncio a
 *    contagem que os relatórios citam seria o defeito nº 3 da casa (documento e
 *    código divergindo sem avisar).
 *
 * 2. **Busca relaxada por raiz + número.** `six times` e `six days` compartilham
 *    o termo `six` e o número `6`. A consulta vira um conjunto de raízes, o
 *    número é lido pela regra ÚNICA do `kb.mjs` (que já sabe ler `six`, `seis` e
 *    `6` como o mesmo 6), e as claims são ordenadas por raridade dos termos que
 *    casaram. O número é a ponte entre inglês e português que não precisa de
 *    dicionário.
 *
 * 3. **Vizinhança de vocabulário.** Quando a busca devolve POUCO, o problema
 *    quase nunca é ausência — é o agente não saber qual palavra o canal usa.
 *    Então a saída mostra os termos e bigramas mais distintivos do tópico dos
 *    poucos resultados. É como `training cycle` aparece para quem procurou
 *    "duração do bloco".
 *
 * 4. **O aviso de que o FILTRO foi quem estreitou.** Com filtro ativo, cada um é
 *    removido em separado e a diferença é reportada com os ids que ele escondia.
 *    Zero resultados COM `--modo prescricao` e três SEM ele são diagnósticos
 *    opostos, e hoje se parecem.
 *
 * **RESULTADO POBRE E RESULTADO VAZIO MANDAM CONSERTOS OPOSTOS.** Vazio diz "este
 * vocabulário não acha"; pobre diz "achei a beirada do assunto". A saída separa
 * os dois em voz alta, porque a leitura errada de qualquer um dos dois manda a
 * próxima rodada comprar fonte que já se tem — o erro mais caro que um relatório
 * de medição pode induzir, e que §4.4 do `AVALIACAO.md` já cometeu uma vez.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIMITE DECLARADO
 *
 * Isto NÃO é busca semântica e não vai virar. Não há banco vetorial e não vai
 * haver: o consumidor é um modelo de janela grande lendo arquivos, e a busca é
 * grep. Um sinônimo que não compartilha raiz nem número com a consulta continua
 * inalcançável por aqui — `peitoral` não acha `pec`, `agacho` não acha `squat`.
 * Esse buraco é fechado à mão, por tópico, em `research/kb/VOCABULARIO.md`, e o
 * `check-vocabulario.mjs` recusa termo morto lá dentro. O que este arquivo prova
 * é FIDELIDADE À RECUPERAÇÃO, não cobertura semântica.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { numerosCrus, numerosPorExtenso, numerosDaClaim } from './kb.mjs';

/**
 * O PISO DE "RESULTADO POBRE", e por que 8.
 *
 * As duas buscas cegas medidas devolveram **4** (`six times`, Q05) e **2**
 * (`sets per muscle`, Q19) — e as duas foram lidas pelo respondedor como "vi o
 * assunto". O piso tem de ficar ACIMA da pior falha medida, senão não pega o
 * caso que existe para pegar, e abaixo do tamanho de um tópico de verdade
 * (mediana 120 claims), senão dispara em toda consulta bem-sucedida e vira
 * ruído que se aprende a ignorar.
 *
 * 8 é julgamento, e está declarado como julgamento: é o dobro da pior falha
 * medida. Se uma terceira falha de recuperação aparecer com mais de 8 hits
 * literais, este número sobe **com a medição na mão**, não por palpite.
 * `--piso` sobrescreve.
 */
export const PISO_POBRE = 8;

/**
 * Quantas claims da vizinhança entram na saída — e é o teto que o canário
 * `presente-escondido` cobra. Achado no lugar 400 não é achado.
 *
 * 40 e não 20 porque a saída da vizinhança é COMPACTA (uma linha por claim
 * depois das seis primeiras): 40 linhas de índice cabem numa leitura, 40 claims
 * inteiras não caberiam. O corte de detalhe é o que compra o alcance.
 */
export const TETO_VIZINHANCA = 40;

/** Quantas da vizinhança saem com a claim inteira, antes de virar índice. */
export const DETALHE_VIZINHANCA = 6;

// ── normalização ─────────────────────────────────────────────────────────────

export const semAcento = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');
export const normalizar = (s) => semAcento(s).toLowerCase();

/**
 * Radicalização deliberadamente burra: só plural, pt e en juntos.
 *
 * Um stemmer de verdade (Porter, RSLP) erraria mais do que acerta num texto que
 * é metade inglês falado e metade português escrito à mão, e erro de stemmer é
 * silencioso — junta `pesado` com `pesagem` e ninguém vê. Plural é a variação
 * que de fato separou `six times` de `six days`, `sets per muscle` de
 * `set per muscle`, e é a única que dá para acertar sem dicionário.
 *
 * Palavra com até 3 letras não é radicalizada: `mes`, `rep` e `set` perderiam a
 * identidade e passariam a casar com coisa nenhuma.
 */
export function raiz(p) {
  if (p.length <= 3) return p;
  if (/oes$/.test(p)) return `${p.slice(0, -3)}ao`;            // repeticoes → repeticao
  if (/(?:[szxr]|ch|sh)es$/.test(p)) return p.slice(0, -2);    // vezes → vez, meses → mes
  if (/s$/.test(p) && !/ss$/.test(p)) return p.slice(0, -1);   // days → day, times → time
  return p;
}

export const palavras = (texto) => normalizar(texto).split(/[^a-z0-9]+/).filter(Boolean);

/**
 * Todo campo em que um termo pode morar. `params.name` está aqui porque
 * `freq_supino` é o nome do dado que a Q05 procurava e nunca foi olhado; `topic`
 * está porque é o mecanismo de recuperação declarado do `PROTOCOLO-EXTRACAO.md`
 * e não fazia parte de nenhuma busca.
 */
export function textoDaClaim(c) {
  return [
    c.claim,
    c.verbatim,
    c.verbatimWhisper,
    ...(c.topic ?? []),
    ...(c.params ?? []).flatMap((p) => [p.name, p.unit, p.frame, String(p.value ?? '')]),
  ]
    .filter(Boolean)
    .join(' \n ');
}

/** Só a prosa — o que o `--grep` de antes enxergava. Existe para poder DIZER que
 *  o resultado mudou de lugar, em vez de mudar a contagem em silêncio. */
export const prosaDaClaim = (c) => `${c.claim ?? ''} ${c.verbatim ?? ''} ${c.verbatimWhisper ?? ''}`;

/**
 * As raízes de um texto, mais os NÚMEROS que ele contém marcados com `#`.
 *
 * O número é a ponte bilíngue barata: `six`, `seis` e `6` são o mesmo 6, e quem
 * já sabe ler os três é o `numerosPorExtenso`/`numerosCrus` do `kb.mjs`. Ela é
 * IMPORTADA e não recopiada — duas leituras de dígito afastando-se em silêncio é
 * o defeito de abertura do `SCHEMA.md`, e já foi cometido duas vezes aqui
 * dentro.
 */
export function termos(texto) {
  const out = new Set();
  for (const p of palavras(texto)) {
    if (/^\d+$/.test(p)) continue; // o dígito entra como número, abaixo
    out.add(raiz(p));
  }
  for (const n of [...numerosCrus(texto).map((x) => x.n), ...numerosPorExtenso(texto)]) out.add(`#${n}`);
  return out;
}

/** A sequência radicalizada, para o bônus de frase exata. */
export const sequencia = (texto) => palavras(texto).map(raiz).join(' ');

// ── o índice ─────────────────────────────────────────────────────────────────

/**
 * Um passe sobre as claims. Barato (6.909 claims, ~250 ms) e refeito a cada
 * execução de propósito: índice persistido é mais uma cópia para divergir da
 * base, e a base muda todo dia.
 */
export function indexar(claims) {
  const docs = claims.map((c) => {
    const texto = textoDaClaim(c);
    const t = new Set();
    for (const p of palavras(texto)) {
      if (/^\d+$/.test(p)) continue;
      t.add(raiz(p));
    }
    for (const n of numerosDaClaim(c)) t.add(`#${n}`);
    return { c, termos: t, seq: sequencia(texto) };
  });
  const df = new Map();
  for (const d of docs) for (const s of d.termos) df.set(s, (df.get(s) ?? 0) + 1);
  const tamMedio = docs.length ? docs.reduce((a, d) => a + d.termos.size, 0) / docs.length : 1;
  return { docs, df, N: docs.length, tamMedio, porId: new Map(docs.map((d) => [d.c.id, d])) };
}

/**
 * O MESMO índice, restrito a um subconjunto — e a raridade recontada DENTRO dele.
 *
 * Existe para o roteamento por tópico. Uma vez que a pergunta já foi resolvida
 * para `agacho`, ordenar as 990 claims de lá pela raridade GLOBAL não separa
 * nada: `squat`, `agacho` e `barra` são raros na base inteira e banais dentro do
 * tópico, então elas empatam no topo e o desempate vira ordem de id — sorteio.
 * Recontando o `df` só entre as 990, o termo que decide passa a ser o que
 * distingue uma claim de agacho das OUTRAS claims de agacho, que é exatamente o
 * que se quer de "texto livre como ordenação".
 *
 * É recontagem, não reindexação: os `docs` são os mesmos objetos.
 */
export function subIndice(idx, aceita) {
  const docs = idx.docs.filter((d) => aceita(d.c));
  const df = new Map();
  for (const d of docs) for (const s of d.termos) df.set(s, (df.get(s) ?? 0) + 1);
  const tamMedio = docs.length ? docs.reduce((a, d) => a + d.termos.size, 0) / docs.length : 1;
  return { docs, df, N: docs.length, tamMedio, porId: new Map(docs.map((d) => [d.c.id, d])) };
}

/**
 * O número vale MENOS que a palavra, de propósito. `#6` é uma ponte entre
 * `six`, `seis` e o `param` `freq_supino=6` — vale ouro para atravessar idioma,
 * e não vale nada como evidência de assunto: 6 séries, 6 semanas e 6 dias
 * empatam. Com peso cheio, a ponte virava o ranqueador.
 */
const idf = (idx, s) => Math.log(1 + idx.N / (1 + (idx.df.get(s) ?? 0))) * (s.startsWith('#') ? 0.6 : 1);

/** Os pares consecutivos de uma sequência radicalizada. */
function bigramas(seq) {
  const w = seq.split(' ').filter(Boolean);
  const o = [];
  for (let i = 0; i + 1 < w.length; i += 1) o.push(`${w[i]} ${w[i + 1]}`);
  return o;
}

const NUMERO_DO_ID = (id) => Number(String(id).split('-')[1] ?? NaN);

/**
 * Busca relaxada: casa QUALQUER termo da consulta e ordena por raridade.
 *
 * A ordenação é o que torna isto utilizável. `six` casa centenas de claims e
 * `time` casa mais de mil; sem peso, `six times` devolveria mil linhas e o
 * agente estaria pior do que com 4. Com IDF, o termo raro decide e a cobertura
 * (quantos termos da consulta casaram) desempata.
 *
 * ── AS SEMENTES, e por que a raridade sozinha NÃO bastava ────────────────────
 *
 * Medido, não suposto: com IDF apenas, `six times` deixava V170-34 fora dos 20
 * primeiros. `six` e o número 6 são comuns demais para decidir sozinhos, e o
 * resto da consulta (`times`) não existe na claim alvo. A consulta é fraca — e
 * consulta fraca é exatamente o caso que este arquivo existe para atender.
 *
 * O que decide é o que um humano faria: **olhar em volta do pouco que achou.**
 * Os poucos resultados literais viram SEMENTE, e a vizinhança é medida em
 * relação a eles — mesmo tópico, e sobretudo **mesmo vídeo**. As quatro sementes
 * de `six times` estão todas no tópico `frequencia`, onde V170-34 e V175-53
 * moram. E a Q19 parou **doze ids depois** de V010-01, no mesmo arquivo: a
 * proximidade dentro do `src` é o sinal mais forte da base, porque o extrator
 * emitiu as claims na ordem em que o assunto foi dito.
 *
 * Quem não compartilha nem tópico nem vídeo com as sementes não é eliminado —
 * só empurrado para baixo. Eliminar seria construir a mesma trava estreita que
 * empurra o dado para fora dela (modo de falha nº 2).
 *
 * `topico` (o `--topic` do usuário) é aplicado; `modo`/`scope`/`tier`/`genero`
 * NÃO são, e isso é a decisão de projeto mais importante daqui: foram eles que
 * esconderam V033-03/04/05 da Q11. Filtro de assunto estreita legitimamente;
 * filtro de segurança estreita a SAÍDA, não a busca.
 */
export function buscarRelaxada(idx, consulta, { teto = TETO_VIZINHANCA, topico = null, excluir = new Set(), sementes = [], expansao = [] } = {}) {
  const peso = new Map([...termos(consulta)].map((s) => [s, 1]));
  /**
   * A expansão vem do `VOCABULARIO.md` e entra com peso baixo. É o que faz o
   * índice escrito à mão ser EXECUTÁVEL em vez de decorativo: sem ele,
   * `ciclo`↔`training cycle` e `peitoral`↔`pec` continuam sendo prosa que
   * alguém precisa lembrar de ler. Peso 0,45 porque um sinônimo trazido de fora
   * da consulta é palpite do índice, não palavra do usuário — ele desempata,
   * não decide, e a saída diz de qual seção do índice ele veio.
   */
  for (const t of expansao) for (const s of termos(t)) if (!peso.has(s)) peso.set(s, 0.45);
  const q = [...peso.keys()];
  if (q.length === 0) return [];

  /**
   * A EXPRESSÃO DO ÍNDICE, INTEIRA, VALE MUITO MAIS QUE AS PALAVRAS DELA SOLTAS.
   *
   * Medido: `training cycle length` traz do índice o termo `ciclo de treino`.
   * Com os termos soltos e peso 0,45, V125-07 (*"16 semanas é a duração ótima de
   * um ciclo de treino"*, `GERAL`, a claim que a Q16 declarou inexistente) saía
   * em 128º — `ciclo`, `treino` e `de` são comuns demais separados. Com a
   * expressão casada INTEIRA e adjacente, ela é evidência forte: é o índice
   * dizendo "é assim que se fala disto aqui", e a claim dizendo exatamente isso.
   */
  const frasesExpandidas = expansao
    .map((t) => sequencia(t))
    .filter((s) => s.includes(' '));
  const seqQ = sequencia(consulta);
  const bigQ = bigramas(seqQ);

  const topicosSemente = new Set(sementes.flatMap((c) => c.topic ?? []));
  const srcSemente = new Map();
  for (const c of sementes) {
    const n = NUMERO_DO_ID(c.id);
    if (!srcSemente.has(c.src)) srcSemente.set(c.src, []);
    srcSemente.get(c.src).push(n);
  }

  const out = [];
  for (const d of idx.docs) {
    if (excluir.has(d.c.id)) continue;
    if (topico && !(d.c.topic ?? []).includes(topico)) continue;
    const casou = q.filter((s) => d.termos.has(s));
    if (casou.length === 0) continue;
    const base = casou.reduce((a, s) => a + idf(idx, s) * peso.get(s), 0);
    const cobertura = casou.reduce((a, s) => a + peso.get(s), 0) / q.reduce((a, s) => a + peso.get(s), 0);
    let score = base * (0.4 + 0.6 * cobertura);

    // A FRASE, em pedaços. Casar a consulta inteira é raro; casar `training
    // cycle` dentro de `training cycle length` é o que separa a claim que fala
    // do assunto da claim que só tem as duas palavras espalhadas. Sem isto,
    // V070-20 saía em 29º empatado com dezenas de outras — e empate ordenado por
    // id é sorteio.
    const frases = bigQ.filter((bg) => d.seq.includes(bg)).length;
    if (frases > 0) score *= 1 + 0.6 * frases;
    const daIndice = frasesExpandidas.filter((f) => d.seq.includes(f)).length;
    if (daIndice > 0) score *= 1 + 0.5 * daIndice;

    // Normalização por tamanho (a ideia do BM25, sem a maquinaria dele): a claim
    // curta que casa os termos fala DAQUILO; a claim longa que casa os mesmos
    // termos pode estar só passando por perto.
    score /= 0.55 + 0.45 * (d.termos.size / (idx.tamMedio || 1));

    const perto = [];
    if (sementes.length > 0) {
      const mesmoTopico = (d.c.topic ?? []).some((t) => topicosSemente.has(t));
      if (mesmoTopico) {
        score *= 1.6;
        perto.push('mesmo tópico');
      }
      const vizinhos = srcSemente.get(d.c.src);
      if (vizinhos) {
        const dist = Math.min(...vizinhos.map((n) => Math.abs(n - NUMERO_DO_ID(d.c.id))));
        score *= Number.isFinite(dist) && dist <= 20 ? 2.2 : 1.6;
        perto.push(Number.isFinite(dist) ? `mesmo vídeo, ${dist} ids` : 'mesmo vídeo');
      }
      if (!mesmoTopico && !vizinhos) score *= 0.45;
    }
    // `casou` sai ordenado pelo que PESA — quem lê a saída quer saber qual termo
    // raro puxou a claim, e não que ela também contém "a" e "por".
    casou.sort((x, y) => idf(idx, y) * peso.get(y) - idf(idx, x) * peso.get(x));
    out.push({ c: d.c, score, casou, perto });
  }
  out.sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id));
  return out.slice(0, teto);
}

// ── vizinhança de vocabulário ────────────────────────────────────────────────

/** Palavras que não informam nada sobre assunto nenhum. Lista curta e literal —
 *  uma lista grande viraria julgamento sobre o que é conteúdo. */
export const VAZIAS = new Set(
  ('a o e de da do das dos que em no na nos nas um uma para por com se ao aos as os ou'
    + ' ele ela isso esse essa este esta como mais menos ser ter fazer vai vou tem the of'
    + ' and to in is it you that this for on with as at be are was were do does don t s i'
    + ' my me we they there here just so not but if or your his her can will would from'
    + ' about into out up down all any some very really lot lots thing things going get got'
    + ' like know think want need make made when what which who how why then than also').split(/\s+/),
);

const util = (p) => p.length > 2 && !VAZIAS.has(p) && !/^\d+$/.test(p);

/**
 * Os termos e bigramas que DISTINGUEM um tópico do resto da base.
 *
 * Contagem crua devolveria `treino`, `peso` e `series` em todo tópico. O que
 * serve é o que aparece MUITO aqui e pouco lá fora — que é, literalmente, "a
 * palavra que o canal usa quando fala disto". `training cycle` sai assim para
 * `periodizacao`, e era o que faltava para a Q16.
 */
export function vocabularioDoTopico(idx, topico, n = 12, semTermos = new Set()) {
  const dentro = idx.docs.filter((d) => (d.c.topic ?? []).includes(topico));
  if (dentro.length === 0) return { unigramas: [], bigramas: [], claims: 0 };

  // Os próprios nomes de tópico saem: `topic` faz parte do texto indexado, então
  // sem isto a lista distintiva de `frequencia` começa com "frequencia" e
  // continua com os tópicos que costumam vir junto. Verdadeiro e inútil — o
  // agente quer a palavra do CANAL, não a etiqueta que o extrator pôs.
  const morto = (p) => semTermos.has(p);

  const contar = (docs, fn) => {
    const m = new Map();
    for (const d of docs) {
      for (const k of new Set(fn(d))) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  const uni = (d) => palavras(prosaDaClaim(d.c)).map(raiz).filter((p) => util(p) && !morto(p));
  const bi = (d) => {
    const w = palavras(prosaDaClaim(d.c)).map(raiz);
    const o = [];
    for (let i = 0; i + 1 < w.length; i += 1) {
      if (morto(w[i]) || morto(w[i + 1])) continue;
      if (!util(w[i]) && !util(w[i + 1])) continue;
      o.push(`${w[i]} ${w[i + 1]}`);
    }
    return o;
  };

  const dentroUni = contar(dentro, uni);
  const dentroBi = contar(dentro, bi);
  const foraUni = contar(idx.docs, uni);
  const foraBi = contar(idx.docs, bi);

  const ranquear = (dentroM, foraM, minimo) =>
    [...dentroM.entries()]
      .filter(([, c]) => c >= minimo)
      .map(([k, c]) => [k, c, (c / dentro.length) * Math.log(1 + idx.N / (1 + (foraM.get(k) ?? 0)))])
      .sort((a, b) => b[2] - a[2] || b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, n)
      .map(([k, c]) => ({ termo: k, claims: c }));

  return {
    claims: dentro.length,
    unigramas: ranquear(dentroUni, foraUni, Math.max(2, Math.ceil(dentro.length * 0.02))),
    bigramas: ranquear(dentroBi, foraBi, Math.max(2, Math.ceil(dentro.length * 0.02))),
  };
}

// ── o filtro como suspeito ───────────────────────────────────────────────────

const CASAM = {
  topic: (c, v) => (c.topic ?? []).includes(v),
  modo: (c, v) => c.modo === v,
  scope: (c, v) => c.scope === v,
  tier: (c, v) => c.tier === v,
};

/**
 * Retira UM filtro por vez e conta o que aparece. É o diagnóstico do caso Q11:
 * 0 resultados com `--modo prescricao`, 3 sem ele — e as duas saídas, hoje,
 * têm exatamente a mesma cara.
 *
 * `genero` entra por um casador injetado, porque ele é propriedade do vídeo e
 * mora no manifesto; a alternativa era esta função reabrir o manifesto e virar a
 * segunda leitura dele.
 */
export function alargarFiltro(claims, { rx = null, filtros = {}, casarGenero = null, teto = 8 } = {}) {
  const ativos = Object.entries(filtros).filter(([, v]) => v);
  if (ativos.length === 0) return [];
  const casaTudo = (c, ignorar) => {
    if (rx && !rx.test(textoDaClaim(c))) return false;
    for (const [k, v] of ativos) {
      if (k === ignorar) continue;
      const fn = k === 'genero' ? casarGenero : CASAM[k];
      if (!fn || !fn(c, v)) return false;
    }
    return true;
  };
  const comTudo = claims.filter((c) => casaTudo(c, null));
  const vistos = new Set(comTudo.map((c) => c.id));
  const out = [];
  for (const [k, v] of ativos) {
    const semEle = claims.filter((c) => casaTudo(c, k));
    const revela = semEle.filter((c) => !vistos.has(c.id));
    if (revela.length > 0) out.push({ filtro: k, valor: v, com: comTudo.length, sem: semEle.length, revela: revela.map((c) => c.id), amostra: revela.slice(0, teto) });
  }

  /**
   * ── E O CASO Q11, QUE UM POR VEZ NÃO PEGA ────────────────────────────────
   *
   * A Q11 filtrou `--modo prescricao --scope GERAL` e o número que ela
   * procurava mora em **PESSOAL + `fato`**. Tirar `--modo` sozinho não revela
   * nada (a claim continua barrada por `scope`), e tirar `--scope` sozinho
   * também não. Remoção uma-a-uma daria ZERO revelado — e a saída diria, com
   * ar de rigor, que o filtro não estava escondendo coisa alguma.
   *
   * Então os filtros de SEGURANÇA (`modo`, `scope`, `tier`, `genero`) também
   * saem todos juntos, num relatório à parte. `topic` fica: ele estreita
   * assunto, e assunto é o que o usuário quis dizer.
   */
  const seguranca = ativos.filter(([k]) => k !== 'topic');
  if (seguranca.length >= 2) {
    const semSeguranca = claims.filter((c) => {
      if (rx && !rx.test(textoDaClaim(c))) return false;
      const t = ativos.find(([k]) => k === 'topic');
      return !t || CASAM.topic(c, t[1]);
    });
    const revela = semSeguranca.filter((c) => !vistos.has(c.id));
    if (revela.length > 0) {
      out.push({
        filtro: 'todos os de segurança',
        valor: seguranca.map(([k, v]) => `${k}=${v}`).join(' + '),
        com: comTudo.length,
        sem: semSeguranca.length,
        revela: revela.map((c) => c.id),
        amostra: revela.slice(0, teto),
        conjunto: true,
      });
    }
  }

  out.sort((a, b) => b.revela.length - a.revela.length);
  return out;
}

// ── a recuperação inteira, num objeto só ─────────────────────────────────────

/**
 * O QUE O AGENTE VERIA. Uma função, um contrato.
 *
 * `check-evidence.mjs` imprime deste objeto e `check-canarios.mjs` cobra deste
 * objeto — o canário `presente-escondido` afirma que os ids saem em
 * `idsMostrados` a partir da busca CEGA que a medição registrou. Se as duas
 * coisas fossem implementações separadas, o canário estaria medindo a si mesmo,
 * que é o modo de falha nº 4 desta casa e aconteceu três vezes num dia só.
 *
 * `idsMostrados` conta só o que CABE na saída (o teto da vizinhança e a amostra
 * do alargamento): achado no lugar 400 não é achado.
 */
/**
 * Consulta → seções do `VOCABULARIO.md` que ela toca, e os termos que elas
 * emprestam. Casamento por substring normalizada, nos dois sentidos: quem
 * digitou `ciclo` acha a seção que registra `ciclo de treino`, e vice-versa.
 */
export function expandirPorVocabulario(consulta, entradas) {
  const q = normalizar(consulta);
  const usados = [];
  for (const e of entradas ?? []) {
    const gatilho = e.usa.find((t) => {
      const n = normalizar(t);
      if (q.includes(n)) return true;
      /**
       * TODAS as palavras longas da expressão, e não UMA delas — e cada uma
       * como palavra inteira.
       *
       * A regra anterior era "qualquer palavra com 4+ letras". Medido em
       * 09/08/2026: com ela, `## frequencia` (que registra `vezes por semana`)
       * disparava em QUALQUER consulta contendo `semana`, e os termos
       * emprestados punham V170-34/V170-33 — *supinar seis dias por semana* —
       * no topo de perguntas sobre sono, calorias e corte de peso. Para
       * `quantas horas de sono por semana`, 0 das 40 claims da vizinhança
       * falavam de sono; sem a expansão, 9 falavam. E `## lesao` disparava a
       * partir de `deload`, porque `load management` contém `load`.
       *
       * `per muscle` continua disparando em `quantas séries por muscle`: as
       * palavras curtas (`per`, `por`, `de`) não entram na exigência, então a
       * consulta meio em português e meio em inglês continua achando.
       */
      const longas = n.split(/\s+/).filter((w) => w.length >= 4);
      if (longas.length === 0) return false;
      return longas.every((w) => {
        try {
          return new RegExp(`(^|[^a-z0-9])(?:${w})([^a-z0-9]|$)`).test(q);
        } catch {
          return q.includes(w);
        }
      });
    });
    if (!gatilho) continue;
    usados.push({ topico: e.topico, gatilho, termos: e.usa.filter((t) => t !== gatilho) });
  }
  return usados;
}

export function recuperar(claims, { grep = null, filtros = {}, casarGenero = null, piso = PISO_POBRE, teto = TETO_VIZINHANCA, idx = null, vocabulario = [] } = {}) {
  const indice = idx ?? indexar(claims);
  const rx = grep ? new RegExp(grep, 'i') : null;
  const ativos = Object.entries(filtros).filter(([, v]) => v);
  const passaFiltros = (c) =>
    ativos.every(([k, v]) => {
      const fn = k === 'genero' ? casarGenero : CASAM[k];
      return fn ? fn(c, v) : false;
    });

  const prosa = [];
  const foraDaProsa = [];
  for (const c of claims) {
    if (!passaFiltros(c)) continue;
    if (!rx) {
      prosa.push(c);
      continue;
    }
    if (rx.test(prosaDaClaim(c))) prosa.push(c);
    else if (rx.test(textoDaClaim(c))) foraDaProsa.push(c);
  }
  const literal = [...prosa, ...foraDaProsa];

  const pobre = rx !== null && literal.length < piso;
  const vazio = rx !== null && literal.length === 0;

  const expansao = grep ? expandirPorVocabulario(grep, vocabulario) : [];
  const relaxada = pobre
    ? buscarRelaxada(indice, grep, {
      teto,
      topico: filtros.topic ?? null,
      excluir: new Set(literal.map((c) => c.id)),
      sementes: literal,
      expansao: expansao.flatMap((e) => e.termos),
    })
    : [];

  /**
   * ── OS VIZINHOS DE ARQUIVO, e a lição mais barata da MEDICAO-02 ───────────
   *
   * A Q19 parou **doze ids antes** de V010-13, **no mesmo vídeo que já estava
   * citando**. O extrator emitiu as claims na ordem em que o assunto foi dito,
   * então a claim ao lado da que você achou é, com frequência, a que completa a
   * resposta — a condição que desarma a prescrição, o número que a frase
   * anterior prometeu, o "e no agacho eu uso 3 %" logo depois do "2 a 3 %".
   *
   * Barato e literal: ±3 ids no mesmo `src`, a partir do que já está na tela.
   * Não é ranqueamento nenhum — é abrir a página ao lado.
   */
  const naTela = new Set([...literal.map((c) => c.id), ...relaxada.map((r) => r.c.id)]);
  const foco = [...literal.slice(0, 8), ...relaxada.slice(0, DETALHE_VIZINHANCA).map((r) => r.c)];
  const vizinhosDeArquivo = [];
  // Só quando o resultado é pobre — que é quando alguém está prestes a escrever
  // "a base não tem". Este conjunto entra em `idsMostrados`, e `idsMostrados` é
  // o contrato do canário: **o que o agente VÊ**. Calcular sem imprimir faria o
  // canário passar por causa de linhas que não existem na tela.
  if (pobre) {
    // Por foco, e não em ordem de arquivo: varrendo o disco, o primeiro vídeo da
    // lista consumia as 18 vagas e os vizinhos das outras claims nunca saíam —
    // exatamente o defeito de "corte por ordem de arquivo" que o aviso de
    // truncagem desta ferramenta já denuncia em outro lugar.
    const vistos = new Set(naTela);
    for (const f of foco) {
      let n = 0;
      for (const c of claims) {
        if (n >= 4 || vizinhosDeArquivo.length >= 18) break;
        if (vistos.has(c.id) || c.src !== f.src) continue;
        if (Math.abs(NUMERO_DO_ID(f.id) - NUMERO_DO_ID(c.id)) > 3) continue;
        vistos.add(c.id);
        vizinhosDeArquivo.push({ c, deQuem: f.id });
        n += 1;
      }
    }
  }

  const alargamento = alargarFiltro(claims, { rx, filtros, casarGenero });

  const topicosSemente = new Set();
  for (const c of [...literal.slice(0, 12), ...relaxada.slice(0, 8).map((r) => r.c)]) {
    for (const t of c.topic ?? []) topicosSemente.add(t);
  }
  // Os nomes de tópico saem da lista distintiva, e são derivados do próprio
  // corpus para não abrir uma segunda leitura do PROTOCOLO-EXTRACAO.md.
  const nomesDeTopico = new Set(claims.flatMap((c) => (c.topic ?? []).flatMap((t) => t.split('-'))));
  const vizinhanca = pobre
    ? [...(filtros.topic ? [filtros.topic] : [...topicosSemente].slice(0, 3))]
      .map((t) => ({ topico: t, ...vocabularioDoTopico(indice, t, 12, nomesDeTopico) }))
    : [];

  const idsMostrados = new Set([
    ...literal.map((c) => c.id),
    ...relaxada.map((r) => r.c.id),
    ...vizinhosDeArquivo.map((v) => v.c.id),
    ...alargamento.flatMap((a) => a.amostra.map((c) => c.id)),
  ]);

  return {
    indice, prosa, foraDaProsa, literal, pobre, vazio, relaxada,
    vizinhosDeArquivo, alargamento, vizinhanca, expansao, idsMostrados, piso, teto,
  };
}

// ── o índice de vocabulário escrito à mão ────────────────────────────────────

/**
 * `research/kb/VOCABULARIO.md` é lido, não duplicado em código, pelo mesmo
 * motivo que `carregarTopicos` lê o `PROTOCOLO-EXTRACAO.md`: documento e trava
 * têm de ser o MESMO objeto, senão divergem em silêncio (defeito nº 3).
 *
 * Formato, e ele é pobre de propósito — formato rico vira formato que ninguém
 * escreve à mão:
 *
 *     ## <topico>
 *     **usa:** `termo` · `outro termo` · …
 *     **não usa:** `termo que o canal NÃO diz` · …
 *     qualquer prosa aqui é ignorada pelo parser e lida por humano.
 */
export function carregarVocabulario(root) {
  const arquivo = join(root, 'research/kb/VOCABULARIO.md');
  if (!existsSync(arquivo)) return { arquivo, entradas: [] };
  return { arquivo, entradas: parsearVocabulario(readFileSync(arquivo, 'utf8')) };
}

export function parsearVocabulario(md) {
  const entradas = [];
  let atual = null;
  for (const linha of md.split('\n')) {
    const cab = /^##\s+([a-z0-9-]+)\s*$/.exec(linha.trim());
    if (cab) {
      atual = { topico: cab[1], usa: [], naoUsa: [], linha: 0 };
      entradas.push(atual);
      continue;
    }
    if (!atual) continue;
    const termosDaLinha = () => [...linha.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (/^\*\*usa:\*\*/.test(linha.trim())) atual.usa.push(...termosDaLinha());
    if (/^\*\*n(ã|a)o usa:\*\*/.test(linha.trim())) atual.naoUsa.push(...termosDaLinha());
  }
  return entradas;
}

/**
 * A trava do índice: **termo morto é mentira**.
 *
 * `usa` promete que o canal fala assim — então cada termo tem de casar ao menos
 * uma claim DAQUELE tópico. Um termo inventado que casa zero é pior que ausência:
 * manda o próximo agente buscar uma palavra que não existe e confirma a ele que
 * a base não tem o assunto.
 *
 * `não usa` promete o contrário — é o registro do que a Q05 digitou e não achou
 * — e por isso cobra ZERO na base INTEIRA. Se um dia casar, o índice está
 * desatualizado e a nota que ele carrega virou falsa.
 *
 * Nenhum dos dois lados é derivado do outro nem de si mesmo: os termos são
 * escritos à mão e conferidos contra as claims. É a diferença entre esta trava e
 * a que se testa a si mesma.
 */
export function validarVocabulario(entradas, claims, topicosValidos) {
  const erros = [];
  const vistos = new Set();
  for (const e of entradas) {
    const onde = `VOCABULARIO.md ## ${e.topico}`;
    if (topicosValidos && !topicosValidos.has(e.topico)) {
      erros.push(`${onde}: tópico fora do vocabulário fechado do PROTOCOLO-EXTRACAO.md`);
      continue;
    }
    if (vistos.has(e.topico)) erros.push(`${onde}: seção duplicada`);
    vistos.add(e.topico);
    if (e.usa.length === 0) erros.push(`${onde}: sem nenhum termo em **usa:** — seção sem conteúdo não indexa nada`);

    const doTopico = claims.filter((c) => (c.topic ?? []).includes(e.topico));
    for (const t of e.usa) {
      let rx;
      try {
        rx = new RegExp(t, 'i');
      } catch (err) {
        erros.push(`${onde}: termo \`${t}\` não é regex válida — ${err.message}`);
        continue;
      }
      const n = doTopico.filter((c) => rx.test(textoDaClaim(c))).length;
      if (n === 0) {
        const foraDoTopico = claims.filter((c) => rx.test(textoDaClaim(c))).length;
        erros.push(
          `${onde}: termo \`${t}\` casa ZERO claim deste tópico`
            + (foraDoTopico > 0 ? ` (casa ${foraDoTopico} fora dele — tópico errado?)` : ' e zero na base inteira')
            + ' — termo morto no índice manda o próximo agente buscar palavra que não existe',
        );
      }
    }
    for (const t of e.naoUsa) {
      let rx;
      try {
        rx = new RegExp(t, 'i');
      } catch (err) {
        erros.push(`${onde}: termo \`${t}\` (não usa) não é regex válida — ${err.message}`);
        continue;
      }
      const n = claims.filter((c) => rx.test(textoDaClaim(c))).length;
      if (n > 0) {
        erros.push(
          `${onde}: \`${t}\` está em **não usa:** mas casa ${n} claim(s) na base — `
            + 'a nota que explica por que este termo falha virou falsa; reescreva a seção',
        );
      }
    }
  }
  return erros;
}
