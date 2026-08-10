/**
 * PERGUNTA → TÓPICO → CLAIMS. O roteamento, e por que ele substitui a porta de
 * entrada da busca livre.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O DEFEITO QUE ESTE ARQUIVO EXISTE PARA IMPEDIR
 *
 * A camada de 09/08 (`busca.mjs`, `--busca`) resolve *pergunta → texto*: casa
 * raiz, número e sinônimo do `VOCABULARIO.md` contra a prosa das 6.912 claims.
 * Ela reprovou no ataque cego do mesmo dia, e as três reprovações apontam todas
 * para o mesmo lugar:
 *
 *   · **precisão destruída pela expansão** — uma seção do índice disparava
 *     quando UMA palavra de 4+ letras casava, e `semana` está em toda pergunta;
 *     `quantas horas de sono por semana` devolvia *supinar seis dias por semana*
 *     em 1º, para um atleta com o peitoral rompido;
 *   · **`descanso-entre-series`** — `--busca "quanto descansar entre as séries"`
 *     devolvia só uma claim de `relato-de-programa` do GZCLP; `--topic
 *     descanso-entre-series` devolve as 12, com `param` tipado em minutos, na
 *     hora;
 *   · a busca livre estava **resolvendo um problema que a base já resolveu**.
 *
 * O alvo certo não é a prosa: é o `topic`, que é um **vocabulário FECHADO de 74
 * termos** declarado no `PROTOCOLO-EXTRACAO.md` e cobrado pelo
 * `check-claims.mjs` em toda claim da base. Três razões, e a terceira é a que
 * decide:
 *
 *   1. o alvo é fechado e pequeno — 74 gavetas, não 6.912 textos;
 *   2. mapear pergunta a assunto é o que um modelo faz bem, e a base já mapeou
 *      cada claim ao assunto dela uma vez, na extração;
 *   3. **um compilador pode conferir o resultado.** Tópico inventado é erro, não
 *      silêncio. Uma busca por texto que erra devolve lixo plausível; um
 *      roteamento que erra devolve um nome que ou está na lista fechada ou é
 *      recusado por `rotasValidas()`.
 *
 * O texto livre não sai de cena — ele **desce um nível**: deixa de ser a porta e
 * vira a ORDENAÇÃO dentro do tópico. E ali ele é medido com `df` recontado
 * DENTRO do tópico (`subIndice`), porque `squat` não distingue nada entre 990
 * claims de agacho.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DE ONDE VEM O SINAL — três canais, nenhum inventado
 *
 * 1. **O corpus.** Para cada tópico, quais raízes aparecem MUITO nele e pouco
 *    fora. É a mesma ideia do `vocabularioDoTopico` de `busca.mjs`, virada do
 *    avesso: lá se pergunta "que palavras descrevem este tópico", aqui "que
 *    tópico esta palavra denuncia". Cobre os **74**, sem ninguém escrever nada.
 *    E resolve de graça o buraco que o `RECUPERACAO.md` §8.1 declarou
 *    inalcançável: `ciclo` e `cycle` não compartilham raiz nenhuma, mas as duas
 *    são fortemente distintivas de `periodizacao` — porque a claim é pt-BR e o
 *    `verbatim` é inglês, e as duas línguas moram no mesmo tópico.
 * 2. **O nome do tópico**, que é dado da lista fechada: `descanso-entre-series`
 *    casa a pergunta que diz "descanso entre séries".
 * 3. **O `VOCABULARIO.md`**, quando o tópico tem seção (10 dos 74). Aqui ele
 *    entra como CONFIRMAÇÃO de um tópico, não como injeção de termos na
 *    consulta — que era exatamente o mecanismo que destruiu a precisão.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OS DOIS CASOS QUE MORDEM, E O QUE SE FAZ COM CADA UM
 *
 * · **Pergunta que não mapeia para tópico nenhum.** Dizer isso é melhor que
 *   devolver lixo. E há duas maneiras diferentes de não mapear, que mandam
 *   consertos opostos: as palavras da pergunta **não existem na base** (fora de
 *   domínio) ou existem e **não são distintivas de nada** ("quanto peso devo
 *   usar"). As duas saem com texto diferente.
 * · **Pergunta que mapeia para tópico grande demais** (`agacho` tem 990). O
 *   tamanho sai declarado, a ordenação interna usa raridade DENTRO do tópico, e
 *   a saída oferece o estreitamento que de fato funciona: os tópicos que mais
 *   coocorrem entre os melhores resultados, com o comando pronto. Cruzar dois
 *   tópicos é filtro de conjunto — verificável — e não mais uma palavra.
 */

import { readFileSync } from 'node:fs';
import {
  palavras, raiz, normalizar, indexar, subIndice, buscarRelaxada,
  prosaDaClaim, VAZIAS, vizinhosNoMesmoSrc,
} from './busca.mjs';

// ── constantes, todas declaradas como julgamento ─────────────────────────────

/**
 * Abaixo disto, "não mapeia".
 *
 * CALIBRADO, não chutado, e o número que importa é a separação entre as duas
 * populações — está medido no `RECUPERACAO.md` §4.3 e travado por dado no
 * `roteador.test.mjs`: perguntas reais na voz do atleta contra perguntas
 * claramente fora do domínio desta base. O teste NÃO importa esta constante:
 * ele afirma quais perguntas mapeiam e quais não, que é a coisa que se quer
 * verdadeira. Mover o piso para qualquer lado quebra um dos dois lados do teste.
 */
export const PISO_ROTA = 0.65;

/**
 * Um tópico só acompanha o primeiro se pontuar ao menos esta fração dele.
 * Sem isto, uma pergunta específica arrasta quatro tópicos genéricos junto, e
 * roteamento que devolve tudo não roteou nada.
 */
export const FRACAO_DO_MELHOR = 0.4;

/** Quantos tópicos, no máximo, uma pergunta resolve. Cinco e não três porque a
 *  etiqueta é multivalorada: *"quantas séries por músculo por semana"* toca
 *  `series-reps`, `volume`, `hipertrofia` e `frequencia` legitimamente, e o alvo
 *  medido da Q19 (V010-13) mora nos dois últimos da lista. O que impede a lista
 *  longa de virar despejo é o peso ao quadrado em `responder`, não este teto. */
export const MAX_TOPICOS = 5;

/**
 * Quantas claims cabem na resposta roteada. É o teto de TELA, e vale a mesma
 * regra do `TETO_VIZINHANCA`: achado no lugar 400 não é achado. Quem verifica
 * este número não pode importá-lo daqui.
 */
export const TETO_ROTEADO = 40;

/** Quantas saem com a claim inteira antes de a saída virar índice. */
export const DETALHE_ROTEADO = 8;

/**
 * Um termo só denuncia um tópico se aparecer em pelo menos duas claims dele.
 * Com uma, o "sinal" é uma frase solta — e tópicos pequenos (`idade` tem 3
 * claims) seriam roteados por acidente de vocabulário.
 */
export const MIN_CLAIMS_DO_TERMO = 2;

/**
 * Suavização de Laplace no lado de dentro: `dfIn / (nT + SUAVIZA)`.
 *
 * Sem ela, um termo em 2 das 3 claims de `idade` tem `p = 0,67` e ganha de
 * qualquer sinal legítimo de um tópico de 900. Com 5, o mesmo termo cai para
 * 0,25 e os tópicos grandes não são afetados (990 + 5). É o preço de admitir
 * tópicos de 3 claims na mesma escala que os de 990 — e admiti-los é
 * obrigatório: `descanso-entre-series` tem 12, e é o caso que originou esta
 * camada.
 */
export const SUAVIZA = 5;

/**
 * O peso de a pergunta conter o NOME do tópico, e por que ele é alto.
 *
 * Medido, e o número aqui saiu de um caso que quase passou batido: *"como
 * melhorar meu **agacho**?"* não mapeava. O corpus quase não escreve `agacho` —
 * diz `agachamento` (364 claims) e `squat` (455), e `agacho` aparece em 249 das
 * 990. **A etiqueta do tópico não é a palavra que o canal usa**, e é justamente
 * por isso que ela existe: ela é o nome ESCOLHIDO da gaveta, no
 * `PROTOCOLO-EXTRACAO.md`, e quem digita esse nome está nomeando a gaveta, não
 * casando texto.
 *
 * Não há risco de o nome inflar o lado de fora: uma pergunta que contém o nome
 * de um dos 74 tópicos é, por definição, uma pergunta desta base.
 */
export const PESO_NOME = 0.9;

/** Nome composto casado INTEIRO (`descanso entre series`) é mais raro e mais
 *  específico que um nome de uma palavra só. */
export const PESO_NOME_COMPOSTO = 1.2;

/** Quantas letras iniciais em comum fazem duas palavras serem a mesma, no
 *  roteamento. Ver `familiaDoTermo` para o porquê e para os pares que ela
 *  deliberadamente NÃO junta. */
export const PREFIXO = 5;

/**
 * E as cinco letras precisam ser esta fração da palavra mais curta.
 *
 * Sem a segunda condição, cinco letras bastam e `powerlifting` casa
 * `powerbuilding` — que são, nesta base, dois assuntos com opinião oposta um
 * sobre o outro. Com 0,6: `agachando`/`agachamento` casam (6 de 9),
 * `descansar`/`descanso` casam (7 de 8), e `powerlifting`/`powerbuilding` não
 * (5 de 12). Medido nos dois sentidos antes de o número ser escrito.
 */
export const FRACAO_DA_PALAVRA = 0.6;

/**
 * E as duas palavras não podem diferir em mais de três letras de comprimento.
 *
 * A fração sozinha não segura o caso em que a palavra curta É o prefixo:
 * `power` está no corpus, `power` contra `powerlifting` dá prefixo comum 5 sobre
 * mínimo 5 — 100 % —, e a pergunta *"preciso fazer cardio treinando
 * powerlifting?"* passava a rotear para `powerbuilding` (5 claims) na frente de
 * `cardio` (230). Medido, e é por isso que este número existe.
 *
 * Três letras é o tamanho das terminações que se quer atravessar (`-ar`, `-ndo`,
 * `-al`, `-o/-amento` fica em 2): `treinando`/`treino`, `peitoral`/`peito`,
 * `joelheira`/`joelho` passam; `power`/`powerlifting` (7) não.
 */
export const DIFERENCA_MAXIMA = 5;

/**
 * Palavras de pergunta. Não são "stopwords de assunto" — `VAZIAS` (de
 * `busca.mjs`) já cobre essas — são as que só existem porque a entrada agora é
 * uma PERGUNTA e não mais um termo de busca.
 *
 * A lista é curta e literal de propósito. Lista grande vira julgamento sobre o
 * que é conteúdo, e o modo de falha nº 2 desta casa é a trava estreita que
 * empurra o dado para fora dela. Nenhuma destas palavras carrega assunto em
 * pergunta nenhuma; `semana`, `peso` e `dor` carregam, e por isso não estão
 * aqui — quem as neutraliza é a matemática do lift, não uma lista.
 */
export const INTERROGATIVAS = new Set(
  ('quanto quanta quantos quantas qual quais quando onde quem porque porquê pra'
    + ' devo posso preciso deveria poderia consigo dever tenho tinha faco faço fazendo deve devem vem vao'
    + ' vale adianta serve certo errado bom ruim melhor pior sendo estou estava'
    + ' meu minha meus minhas seu sua seus suas nosso nossa dele dela deles delas aquele aquela'
    + ' should could would many much long often does did have has had will can'
    + ' im ive dont doesnt am was were be being been ok').split(/\s+/),
);

// ── os termos da pergunta ────────────────────────────────────────────────────

/**
 * As raízes de uma pergunta que podem denunciar um assunto.
 *
 * **Número fica de fora.** `#6` é a ponte bilíngue de `busca.mjs` e vale ouro
 * para ORDENAR (6 séries, `freq_supino=6`, `six`), e vale nada para ROTEAR: 6
 * séries, 6 semanas e 6 dias empatam, e um número comum arrastaria a pergunta
 * para o tópico que mais fala em números. Ele volta a contar um nível abaixo,
 * dentro do tópico, onde a `buscarRelaxada` o usa como sempre usou.
 */
export function termosDaPergunta(texto) {
  const out = new Set();
  for (const p of palavras(texto)) {
    if (/^\d+$/.test(p)) continue;
    if (p.length <= 2) continue;
    if (VAZIAS.has(p) || INTERROGATIVAS.has(p)) continue;
    const r = raiz(p);
    if (VAZIAS.has(r) || INTERROGATIVAS.has(r)) continue;
    out.add(r);
  }
  return out;
}

/** O texto de onde sai o perfil de um tópico: a prosa (pt + inglês) e o NOME dos
 *  params — `freq_supino` e `duracao_ciclo` dizem o assunto tão bem quanto a
 *  frase, e `escala_dor` é o único lugar em que a base escreve "escala". */
const textoDePerfil = (c) =>
  `${prosaDaClaim(c)} ${(c.params ?? []).map((p) => String(p.name ?? '').replace(/_/g, ' ')).join(' ')}`;

// ── o perfil dos 74 tópicos, derivado do corpus ──────────────────────────────

/**
 * Um passe sobre a base: para cada tópico, em quantas claims dele cada raiz
 * aparece; e o mesmo na base inteira.
 *
 * Derivado do corpus a cada execução, como o índice de `busca.mjs` e pela mesma
 * razão: perfil persistido é mais uma cópia para divergir da base, e a base muda
 * todo dia.
 */
export function perfilarTopicos(claims) {
  const porTopico = new Map();
  const dfGlobal = new Map();
  const termosPorClaim = new Map();
  let N = 0;
  let somaTermos = 0;
  for (const c of claims) {
    N += 1;
    const ts = new Set(palavras(textoDePerfil(c)).filter((p) => !/^\d+$/.test(p) && p.length > 2).map(raiz));
    termosPorClaim.set(c.id, ts);
    somaTermos += ts.size;
    for (const t of ts) dfGlobal.set(t, (dfGlobal.get(t) ?? 0) + 1);
    for (const topico of c.topic ?? []) {
      let p = porTopico.get(topico);
      if (!p) {
        p = { topico, n: 0, df: new Map() };
        porTopico.set(topico, p);
      }
      p.n += 1;
      for (const t of ts) p.df.set(t, (p.df.get(t) ?? 0) + 1);
    }
  }
  const porPrefixo = new Map();
  for (const t of dfGlobal.keys()) {
    if (t.length < PREFIXO) continue;
    const k = t.slice(0, PREFIXO);
    if (!porPrefixo.has(k)) porPrefixo.set(k, []);
    porPrefixo.get(k).push(t);
  }
  return {
    porTopico, dfGlobal, N, porPrefixo, termosPorClaim, tamMedio: N ? somaTermos / N : 1,
  };
}

/**
 * ── A FAMÍLIA DE PREFIXO, e por que ela existe SÓ no roteamento ──────────────
 *
 * A pergunta é escrita por um humano e conjuga: *agachando*, *supinar*,
 * *descansar*, *lesionar*. A base é declarativa e nomeia: *agachamento*,
 * *supino*, *descanso*, *lesão*. A radicalização de `busca.mjs` é plural e só
 * plural — de propósito, porque stemmer erra em silêncio dentro de um texto
 * metade inglês —, então nenhuma dessas quatro se encontra.
 *
 * Aqui a assimetria é legítima e vale escrever por quê: **o custo de um erro de
 * prefixo no roteamento é limitado e visível.** No pior caso ele acrescenta um
 * nome a uma lista de no máximo quatro, que sai impressa com o termo e a
 * contagem que a justificam, e que um compilador confere contra a lista fechada.
 * O mesmo erro dentro da busca por texto injeta uma claim no meio de 6.912 sem
 * dizer de onde veio — que foi como *supinar seis dias por semana* chegou ao
 * topo de uma pergunta sobre sono.
 *
 * A regra é a mais burra que resolve: **cinco letras iniciais em comum, com as
 * duas palavras tendo cinco letras ou mais.** `agachando`/`agachamento` casam
 * (`agach`), `descansar`/`descanso` casam (`desca`), e os pares que assustam não
 * casam: `pesado`/`pesagem` param em `pesa` (4), `cinto`/`cintura` em `cint`,
 * `banco`/`bancada` em `banc`, `morto`/`morte` em `mort`.
 *
 * O peso da família é o MÁXIMO dos membros, nunca a soma: `df` é contagem de
 * documentos, e somar `agachar` com `agachamento` contaria duas vezes a claim
 * que diz as duas.
 */
export function familiaDoTermo(perfis, termo) {
  if (termo.length < PREFIXO) return perfis.dfGlobal.has(termo) ? [termo] : [];
  const balde = perfis.porPrefixo.get(termo.slice(0, PREFIXO)) ?? [];
  return balde.filter((cand) => {
    if (cand === termo) return true;
    if (Math.abs(cand.length - termo.length) > DIFERENCA_MAXIMA) return false;
    let i = 0;
    while (i < cand.length && i < termo.length && cand[i] === termo[i]) i += 1;
    return i >= FRACAO_DA_PALAVRA * Math.min(cand.length, termo.length);
  });
}

/**
 * O peso de um termo para um tópico: **frequência dentro × log do lift**.
 *
 * `log(lift)` sozinho premia o acidente — uma raiz que aparece em 2 claims da
 * base, as duas em `sapato`, teria lift 3.000. Multiplicar pela frequência
 * DENTRO do tópico é o que transforma "esta palavra é rara fora" em "esta
 * palavra é a palavra deste assunto": um termo em metade das claims de um tópico
 * e em 5 % da base pesa 0,5 × log(10) = 1,15; o acidente das duas claims pesa
 * 0,04 × log(138) = 0,2.
 *
 * Lift ≤ 1 vale ZERO, e não negativo: uma palavra comum não é evidência CONTRA
 * um assunto, e penalizar transformaria pergunta longa em ruído contra tópico
 * grande.
 */
export function pesoDoTermo(perfis, topico, termo) {
  const p = perfis.porTopico.get(topico);
  if (!p) return 0;
  const dentro = p.df.get(termo) ?? 0;
  if (dentro < MIN_CLAIMS_DO_TERMO) return 0;
  const fora = perfis.dfGlobal.get(termo) ?? 0;
  const pIn = dentro / (p.n + SUAVIZA);
  const pOut = (fora + 1) / (perfis.N + 1);
  const lift = pIn / pOut;
  if (lift <= 1) return 0;
  return pIn * Math.log(lift);
}

/**
 * O peso de uma palavra da PERGUNTA para um tópico: o melhor membro da família
 * de prefixo dela. `agachando` na pergunta vale o que `agachamento` vale na
 * base, e a saída diz qual palavra da base respondeu — porque "casou por
 * prefixo" sem dizer com o quê é a mesma expansão opaca que quebrou a precisão.
 */
export function pesoDaPalavra(perfis, topico, termo) {
  let melhor = { peso: 0, termo, naBase: perfis.dfGlobal.get(termo) ?? 0, dentro: 0 };
  for (const cand of familiaDoTermo(perfis, termo)) {
    const peso = pesoDoTermo(perfis, topico, cand);
    if (peso > melhor.peso) {
      melhor = {
        peso, termo: cand, naBase: perfis.dfGlobal.get(cand) ?? 0,
        dentro: perfis.porTopico.get(topico)?.df.get(cand) ?? 0,
      };
    }
  }
  return melhor;
}

// ── o roteamento ─────────────────────────────────────────────────────────────

const partesDoNome = (t) => t.split('-').filter((x) => x.length > 2).map(raiz);

/**
 * PERGUNTA → TÓPICOS. Nunca devolve um nome que não esteja em `topicos`, que é a
 * lista fechada lida do `PROTOCOLO-EXTRACAO.md` — é o que torna o resultado
 * conferível por compilador em vez de plausível.
 *
 * `vocabulario` são as entradas do `VOCABULARIO.md`, e o uso aqui é o oposto do
 * uso que quebrou a precisão em 09/08: um termo `usa:` casado inteiro CONFIRMA o
 * tópico dono da seção, e não empresta palavra nenhuma para dentro da consulta.
 * Confirmação errada custa um tópico a mais na lista; injeção errada custava
 * *supinar seis dias por semana* no topo de uma pergunta sobre sono.
 */
export function rotear(perfis, pergunta, {
  topicos, vocabulario = [], piso = PISO_ROTA, max = MAX_TOPICOS, fracao = FRACAO_DO_MELHOR,
} = {}) {
  const W = termosDaPergunta(pergunta);
  const q = normalizar(pergunta);

  const conhecidos = [...W].filter((t) => (perfis.dfGlobal.get(t) ?? 0) > 0);
  const desconhecidos = [...W].filter((t) => (perfis.dfGlobal.get(t) ?? 0) === 0);

  const linhas = [];
  for (const topico of topicos) {
    const p = perfis.porTopico.get(topico);
    if (!p) continue;
    const porQue = [];
    let score = 0;
    for (const t of W) {
      const m = pesoDaPalavra(perfis, topico, t);
      if (m.peso <= 0) continue;
      score += m.peso;
      porQue.push({
        termo: t, comoNaBase: m.termo, peso: m.peso, dentro: m.dentro, deQuantas: p.n, naBase: m.naBase, canal: 'corpus',
      });
    }

    // O NOME DO TÓPICO, que é dado da lista fechada. `descanso entre series` na
    // pergunta é o próprio nome da gaveta, escrito por quem definiu a gaveta.
    const nome = topico.replace(/-/g, ' ');
    const partes = partesDoNome(topico);
    const casaParte = (parte) => [...W].some((w) => familiaDoTermo(perfis, w).includes(parte) || w === parte);
    const nomeInteiro = partes.length > 1 && partes.every(casaParte);
    const nomeSimples = partes.length === 1 && casaParte(partes[0]);
    if (nomeInteiro || nomeSimples) {
      const peso = nomeInteiro ? PESO_NOME_COMPOSTO : PESO_NOME;
      score += peso;
      porQue.push({ termo: nome, peso, canal: 'nome do tópico' });
    }

    // O ÍNDICE ESCRITO À MÃO, como confirmação. Só expressão de duas palavras ou
    // mais, e casada inteira: `bench` sozinho confirmaria `supino` a partir de
    // qualquer coisa, e é o passo que já custou caro uma vez.
    const e = vocabulario.find((x) => x.topico === topico);
    if (e) {
      const casou = e.usa.filter((t) => {
        const n = normalizar(t);
        return n.includes(' ') && q.includes(n);
      });
      if (casou.length > 0) {
        score += 0.5;
        porQue.push({ termo: casou.join(' · '), peso: 0.5, canal: 'VOCABULARIO.md' });
      }
    }

    /**
     * ── A COBERTURA DA PERGUNTA ──────────────────────────────────────────────
     *
     * Um tópico que responde a UMA palavra de uma pergunta de duas não está
     * falando do mesmo assunto que um que responde às duas. Medido: *"quanto de
     * proteína por dia"* roteava para `frequencia` (107 das 245 claims dizem
     * `dia`) quase tão forte quanto para `nutricao` — e `dia` sozinho, numa
     * pergunta sobre proteína, é coincidência de palavra, não assunto.
     *
     * O fator é o mesmo `0,4 + 0,6 × cobertura` de `buscarRelaxada`, e é o mesmo
     * pelo mesmo motivo: cobertura zerar um tópico seria trava estreita, e o
     * termo raro que casa sozinho às vezes É a resposta.
     */
    const cobriu = porQue.filter((x) => x.canal === 'corpus').length;
    const cobertura = conhecidos.length ? cobriu / conhecidos.length : 0;
    /**
     * O piso é só o dos canais AUTORITATIVOS — o nome do tópico e o
     * `VOCABULARIO.md`. Um deles casar significa "você nomeou esta gaveta", e
     * isso não deveria ser diluído por a pergunta ter outras palavras.
     *
     * Já um termo de CORPUS forte não recebe piso, e a diferença foi medida:
     * com o piso valendo para tudo, *"quantas séries por músculo por semana"*
     * roteava para `taper` (só `semana` casou, 1 de 3 palavras) e para
     * `descanso-entre-series` (só `serie`), e os dois ocupavam as vagas de
     * `hipertrofia` e `volume` — onde mora V010-13, o alvo medido da Q19.
     * Coincidência de uma palavra não é assunto; nome de gaveta é.
     */
    const maiorSozinho = porQue
      .filter((x) => x.canal !== 'corpus')
      .reduce((a, x) => Math.max(a, x.peso), 0);
    /**
     * ── E A COBERTURA NÃO PODE AFUNDAR UM SINAL FORTE ────────────────────────
     *
     * Medido, e é o defeito que quase entrou: *"como melhorar meu agacho?"*
     * deixava de mapear. `agacho` pesa 1,18 sozinho para o tópico `agacho`, mas
     * `melhorar` e `meu` também existem na base, a cobertura caía para 1 de 3 e
     * o produto ficava abaixo do piso. A pergunta mais óbvia que este atleta
     * pode fazer virava "não mapeia".
     *
     * O piso do score é o MAIOR peso individual: uma palavra suficientemente
     * distintiva carrega a pergunta sozinha, e a cobertura só pode somar. É
     * literalmente o modo de falha nº 2 desta casa — trava estreita empurrando o
     * dado para fora dela — e ele foi cometido aqui antes de ser desfeito.
     */
    score = Math.max(score * (0.4 + 0.6 * cobertura), maiorSozinho);

    if (score > 0) {
      porQue.sort((a, b) => b.peso - a.peso);
      linhas.push({
        topico, score, claims: p.n, porQue, cobertura, cobriu, deQuantos: conhecidos.length,
      });
    }
  }

  linhas.sort((a, b) => b.score - a.score || a.topico.localeCompare(b.topico));
  const melhor = linhas[0]?.score ?? 0;
  /**
   * O PISO DECIDE SE A PERGUNTA MAPEIA; A FRAÇÃO DECIDE QUANTOS TÓPICOS.
   *
   * São duas perguntas diferentes e por muito tempo aqui foram a mesma. O piso
   * responde *"esta pergunta é desta base?"* e por isso só olha o PRIMEIRO
   * colocado. A fração responde *"quantos assuntos ela toca?"* e é relativa ao
   * primeiro, porque um segundo tópico com 80 % do score do primeiro é sinal, e
   * o mesmo score absoluto numa pergunta forte seria ruído.
   */
  const rotas = melhor >= piso
    ? linhas.filter((l) => l.score >= melhor * fracao).slice(0, max)
    : [];

  /**
   * AS DUAS MANEIRAS DE NÃO MAPEAR, e elas mandam consertos opostos — a mesma
   * distinção que `vazio` × `pobre` faz um nível acima, e que a `MEDICAO-02`
   * §2.2 mediu custar uma rodada de aquisição.
   */
  let motivo = null;
  if (rotas.length === 0) {
    motivo = conhecidos.length === 0
      ? 'fora-de-dominio'   // nenhuma palavra da pergunta existe na base
      : 'sem-assunto';      // as palavras existem e não distinguem tópico nenhum
  }

  return {
    termos: [...W], conhecidos, desconhecidos, rotas, motivo, candidatos: linhas.slice(0, 8), piso,
  };
}

/**
 * Valida o resultado do roteamento contra a lista fechada. **Isto é a razão de o
 * roteamento ser melhor que a busca por texto**: um tópico fora da lista é ERRO,
 * e erro tem mensagem; texto errado é só um resultado ruim que passa por bom.
 *
 * Serve tanto para o roteamento automático (onde é um invariante) quanto para um
 * `--topic` digitado à mão, que é onde o typo de verdade acontece.
 */
export function rotasValidas(rotas, topicos) {
  return rotas
    .map((r) => (typeof r === 'string' ? r : r.topico))
    .filter((t) => !topicos.has(t));
}

// ── dentro do tópico: o texto livre, agora como ordenação ────────────────────

/**
 * Ordena as claims de um tópico contra a pergunta, com raridade recontada DENTRO
 * do tópico (`subIndice`). Reusa `buscarRelaxada` inteira — a cobertura, o bônus
 * de frase e a normalização por tamanho são os mesmos, e uma segunda
 * implementação de ranqueador divergiria da primeira em silêncio, que é o modo
 * de falha nº 3 desta casa.
 */
/**
 * ── A ETIQUETA ERRA, E ESTA É A PEÇA QUE CONSERTA ────────────────────────────
 *
 * O `topic` foi escrito claim a claim, por lote, por agentes diferentes. Ele é
 * fechado e é conferido pelo compilador, mas **conferido contra a lista, não
 * contra o conteúdo**. Medido, e é o caso que originou esta função:
 *
 *   V038-07 — *"pode haver benefício em descansar 8 minutos em vez de 5"*,
 *   `GERAL`, com `descanso_longo=8 min` — está etiquetada
 *   `recuperacao, agacho, terra`. **Não** está em `descanso-entre-series`.
 *   V074-10 — *"descansar 10 minutos ajuda o agacho"* — idem.
 *
 * Ou seja: rotear para `descanso-entre-series` e olhar só as 12 claims
 * declaradas devolve UMA das três que a pergunta pedia. Roteamento puro por
 * etiqueta herda todo erro de etiquetagem, em silêncio — que é o mesmo modo de
 * falha da camada de ontem com outra roupa.
 *
 * A afinidade é o perfil do tópico aplicado de volta a cada claim: *esta claim
 * fala como as claims deste tópico falam?* V038-07 diz `descansar`, `minutos`,
 * `5`, `8` — é o vocabulário de `descanso-entre-series` inteiro, e a afinidade
 * a coloca na gaveta em que a etiqueta esqueceu de pô-la.
 *
 * **A saída marca as duas coisas de forma diferente** (`declarado` × `afim`),
 * porque afirmar que uma claim está num tópico em que ela não está é uma mentira
 * barata de contar e cara de descobrir.
 */
export function afinidade(perfis, topico, claim) {
  const ts = perfis.termosPorClaim.get(claim.id);
  if (!ts) return 0;
  let s = 0;
  for (const t of ts) s += pesoDoTermo(perfis, topico, t);
  // Normaliza por tamanho pela mesma razão que `buscarRelaxada`: a claim longa
  // acumula peso por passar perto de tudo.
  return s / (0.5 + 0.5 * (ts.size / (perfis.tamMedio || 1)));
}

/**
 * Quantas claims NÃO etiquetadas entram na gaveta por afinidade.
 *
 * 60 é ~5 vezes o tamanho de `descanso-entre-series` (12), que é o tópico em que
 * o buraco de etiqueta foi medido, e é ruído desprezível dentro de `agacho`
 * (990). O ranqueamento seguinte é que decide quais delas aparecem — isto aqui
 * só abre a porta.
 */
export const TETO_AFINS = 60;

/**
 * O CONJUNTO de um tópico: o que está etiquetado nele, mais o que fala como ele.
 */
export function conjuntoDoTopico(claims, perfis, topico, { afins = TETO_AFINS } = {}) {
  const declarado = new Set();
  const candidatos = [];
  for (const c of claims) {
    if ((c.topic ?? []).includes(topico)) {
      declarado.add(c.id);
      continue;
    }
    const a = afinidade(perfis, topico, c);
    if (a > 0) candidatos.push({ id: c.id, a });
  }
  candidatos.sort((x, y) => y.a - x.a || x.id.localeCompare(y.id));
  return { declarado, afim: new Set(candidatos.slice(0, afins).map((x) => x.id)) };
}

/**
 * Ordena as claims de um tópico contra a pergunta, com raridade recontada DENTRO
 * do tópico (`subIndice`). Reusa `buscarRelaxada` inteira — a cobertura, o bônus
 * de frase e a normalização por tamanho são os mesmos, e uma segunda
 * implementação de ranqueador divergiria da primeira em silêncio, que é o modo
 * de falha nº 3 desta casa.
 */
export function ordenarNoTopico(idx, conjunto, pergunta, { teto = TETO_ROTEADO } = {}) {
  const sub = subIndice(idx, (c) => conjunto.declarado.has(c.id) || conjunto.afim.has(c.id));
  const out = buscarRelaxada(sub, pergunta, { teto: teto * 2 }).map((x) => {
    const declarado = conjunto.declarado.has(x.c.id);
    return { ...x, comoEntrou: declarado ? 'declarado' : 'afim', score: declarado ? x.score : x.score * PESO_AFIM };
  });
  out.sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id));
  return out.slice(0, teto);
}

/**
 * A claim que entrou por afinidade vale menos que a que está ETIQUETADA no
 * tópico, e isso não é detalhe.
 *
 * Medido: sem o desconto, *"quantas horas de sono por semana"* devolvia em 1º,
 * 2º e 4º claims de `cardio`/`condicionamento` — porque `hora` é raro dentro do
 * conjunto de `sono` e as claims que falam de "horas de cardio" casavam melhor
 * do que as claims que falam de dormir. A afinidade existe para consertar
 * etiqueta esquecida (V038-07), não para reabrir a porta lateral que a camada de
 * ontem fechou.
 *
 * 0,6 e não 0: eliminar seria a trava estreita do modo de falha nº 2, e as três
 * claims da C20 que a etiqueta esqueceu entram por aqui.
 */
export const PESO_AFIM = 0.6;

/**
 * ── O NOME DO PARAM É O NOME DO DADO ─────────────────────────────────────────
 *
 * `peso_por_rpe_min` não é prosa: é o dado que a Q11 procurava, tipado, com
 * `frame` e unidade. Uma pergunta que diz *"quanto **peso** quando o **RPE** vem
 * acima do alvo"* nomeia DUAS peças desse nome — e a claim que carrega o param
 * é literalmente a resposta, mesmo quando a prosa dela não compartilha verbo
 * nenhum com a pergunta (a claim diz *subir* 1 RPE; a pergunta diz *baixar*).
 *
 * Duas peças e não uma, porque `peso` sozinho está em metade dos params da base
 * e `rpe` sozinho em todo o tópico `rpe`. O par é que é evidência.
 *
 * É o único canal desta camada que lê o dado TIPADO em vez do texto, e por isso
 * ele não passa pelo roteamento: o nome do param não é um assunto, é o nome de
 * uma grandeza, e uma grandeza pode estar em qualquer gaveta.
 */
export const MIN_PECAS_DO_PARAM = 2;

/** Quantas claims do canal de param cabem na tela. */
export const TETO_PARAM = 12;

export function nomeiaOParam(perfis, W, claim) {
  const tokens = new Set(
    (claim.params ?? [])
      .flatMap((p) => palavras(String(p.name ?? '').replace(/_/g, ' ')).map(raiz))
      .filter((t) => t.length > 2 && !VAZIAS.has(t)),
  );
  if (tokens.size === 0) return [];
  return [...W].filter((w) => tokens.has(w) || familiaDoTermo(perfis, w).some((t) => tokens.has(t)));
}

/**
 * O canal de param, inteiro: quem tem um `param` cujo NOME contém duas ou mais
 * peças da pergunta, ordenado pelo texto da pergunta dentro desse conjunto.
 *
 * Sai como seção PRÓPRIA e não misturado ao roteamento, por duas razões. A
 * primeira é que ele mede outra coisa — não "de que assunto isto fala", e sim
 * "que dado tipado tem este nome" —, e misturar dois sinais numa nota só é como
 * se perde a capacidade de dizer por que uma claim apareceu. A segunda é
 * medida: bônus multiplicativo dentro do tópico levantou o alvo da Q11 de 72º
 * para 47º (ainda fora da tela) e **empurrou o alvo da Q19 para fora**. Canal
 * separado só acrescenta.
 */
export function porNomeDeParam(claims, idx, perfis, pergunta, { teto = TETO_PARAM } = {}) {
  const W = termosDaPergunta(pergunta);
  const casaram = new Map();
  for (const c of claims) {
    const m = nomeiaOParam(perfis, W, c);
    if (m.length >= MIN_PECAS_DO_PARAM) casaram.set(c.id, m);
  }
  if (casaram.size === 0) return { total: 0, lista: [] };
  const sub = subIndice(idx, (c) => casaram.has(c.id));
  const lista = buscarRelaxada(sub, pergunta, { teto })
    .map((x) => ({ ...x, pecas: casaram.get(x.c.id) }));
  return { total: casaram.size, lista };
}

/**
 * A RESPOSTA ROTEADA INTEIRA, num objeto só — o mesmo contrato que `recuperar()`
 * tem em `busca.mjs`: a CLI imprime deste objeto e a trava cobra deste objeto.
 * Se fossem duas implementações, a trava estaria medindo a si mesma.
 *
 * A fusão entre tópicos é por score RELATIVO (cada tópico normalizado pelo
 * próprio 1º lugar), porque scores de `agacho` e de `descanso-entre-series` não
 * são comparáveis — o `df` foi recontado em populações diferentes, de propósito.
 * O efeito colateral é o que se queria: **a claim que está nos DOIS tópicos
 * roteados sobe**, e cruzar dois tópicos é conjunto, não mais uma palavra.
 */
export function responder(claims, pergunta, {
  topicos, vocabulario = [], idx = null, perfis = null,
  piso = PISO_ROTA, max = MAX_TOPICOS, teto = TETO_ROTEADO, porTopico = null, forcar = [],
} = {}) {
  const indice = idx ?? indexar(claims);
  const perfil = perfis ?? perfilarTopicos(claims);
  const bruto = rotear(perfil, pergunta, { topicos, vocabulario, piso, max });
  /**
   * `forcar` é o `--topic` do usuário mandando no roteamento. Existe porque o
   * estreitamento que a saída sugere ("cruze com `profundidade`") precisa de um
   * comando que o leitor possa copiar, e porque um humano que já sabe a gaveta
   * não deve ter de convencer o roteador. O tópico forçado passa pela MESMA
   * validação contra a lista fechada — é onde o typo de verdade acontece.
   */
  const rota = forcar.length > 0
    ? {
      ...bruto,
      motivo: null,
      rotas: forcar.map((t) => ({
        topico: t,
        score: bruto.candidatos.find((c) => c.topico === t)?.score ?? 0,
        claims: perfil.porTopico.get(t)?.n ?? 0,
        porQue: [{ termo: t, peso: 0, canal: '--topic (forçado por quem digitou)' }],
        forcado: true,
      })),
    }
    : bruto;

  const invalidos = rotasValidas(rota.rotas, topicos);
  if (invalidos.length > 0) {
    throw new Error(`roteamento produziu tópico fora do vocabulário fechado: ${invalidos.join(', ')}`);
  }

  const tetoInterno = porTopico ?? teto;
  const porTopicoResultado = [];
  const acumulado = new Map();
  const melhorRota = rota.rotas[0]?.score || 1;
  for (const r of rota.rotas) {
    /**
     * TÓPICO FORÇADO NÃO GANHA AFINS, e a assimetria é a razão de a afinidade
     * existir. Ela conserta a etiqueta quando o ROTEADOR está adivinhando a
     * gaveta; quando um humano digita `--topic cinto`, ele não está adivinhando
     * — está pedindo a gaveta, e a gaveta é o conjunto etiquetado.
     *
     * Medido: `cinto` tem 54 claims declaradas, e com 60 afins junto o par
     * F001-83/F001-84 (as duas dimensões do regulamento IPF, tier O, tipadas)
     * caía para 64º e 67º. Sem os afins, a gaveta inteira cabe na tela.
     */
    const conjunto = conjuntoDoTopico(claims, perfil, r.topico, { afins: r.forcado ? 0 : TETO_AFINS });
    const lista = ordenarNoTopico(indice, conjunto, pergunta, { teto: tetoInterno });
    const topo = lista[0]?.score ?? 0;
    porTopicoResultado.push({ ...r, resultados: lista, afins: conjunto.afim.size });
    /**
     * O peso do tópico entra ao QUADRADO da razão para o primeiro. Um segundo
     * tópico com 70 % do score do primeiro contribui com 49 %, e um com 40 % com
     * 16 % — o roteamento admite o tópico secundário (recall) sem deixá-lo
     * disputar o topo da tela (precisão). Linear, o quarto tópico de uma lista
     * empatada empurrava claim de outro assunto para o 1º lugar, que é
     * exatamente o defeito de 09/08 com outra roupa.
     */
    const pesoDaRota = (r.score / melhorRota) ** 2;
    for (const x of lista) {
      const rel = topo > 0 ? x.score / topo : 0;
      const a = acumulado.get(x.c.id) ?? { c: x.c, score: 0, topicos: [], casou: x.casou };
      a.score += rel * pesoDaRota;
      a.topicos.push(r.topico);
      if (x.casou.length > a.casou.length) a.casou = x.casou;
      acumulado.set(x.c.id, a);
    }
  }

  // Ordena por score, e o cruzamento de tópicos NÃO é um critério à parte: ele
  // já é a soma. Uma claim que está em dois tópicos roteados soma duas parcelas
  // e sobe sozinha — enquanto ordenar primeiro por "quantos tópicos" punha uma
  // claim de dois tópicos fracos na frente do 1º lugar do tópico forte.
  const claimsRoteadas = [...acumulado.values()]
    .sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id))
    .slice(0, teto);

  /**
   * O ESTREITAMENTO PARA O TÓPICO GRANDE DEMAIS. Entre as claims que a pergunta
   * puxou, quais OUTROS tópicos aparecem junto — é o cruzamento que de fato
   * separa 990 de 87, e ele é conjunto (verificável), não mais uma palavra.
   */
  const coocorrencia = new Map();
  for (const x of claimsRoteadas) {
    for (const t of x.c.topic ?? []) {
      if (rota.rotas.some((r) => r.topico === t)) continue;
      coocorrencia.set(t, (coocorrencia.get(t) ?? 0) + 1);
    }
  }
  const estreitar = [...coocorrencia.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([topico, n]) => ({ topico, n }));

  const params = porNomeDeParam(claims, indice, perfil, pergunta);

  /**
   * ── A PÁGINA AO LADO, e ela é a regra 3 do protocolo ─────────────────────
   *
   * *"Leia os vizinhos do id que você já achou."* O `RECUPERACAO.md` §3.4 mediu
   * o caso: a Q19 parou doze ids antes de V010-13, no mesmo vídeo que já estava
   * citando. A porta livre faz isso desde 09/08; a porta nova nasceu sem, e a
   * medição de 10/08 mostrou o custo — `quanto baixar o peso quando o RPE vem
   * acima do alvo` devolvia V033-03 e V033-04 pelo canal de param e **não**
   * V033-05, que é a claim IMEDIATAMENTE ao lado e a que traduz os 3 % em 25 lb.
   *
   * Mesma função da porta livre (`vizinhosNoMesmoSrc`), e não uma segunda
   * implementação: duas cópias divergiriam em silêncio.
   *
   * O foco é o que está NA TELA em detalhe — as primeiras claims roteadas e as
   * do canal de param —, nunca a lista inteira: ±3 ids sobre 40 focos seriam
   * 240 ids, e uma lista de 240 não é abrir a página ao lado, é despejo. O raio
   * é 2 e não 3 porque aqui o foco já vem ordenado por relevância dentro de um
   * tópico, e não de uma busca pobre.
   */
  const naTela = new Set([
    ...claimsRoteadas.map((x) => x.c.id), ...params.lista.map((x) => x.c.id),
  ]);
  /**
   * CADA CANAL TEM SUA COTA, e isso foi medido. Com uma fila só, os oito focos
   * do roteamento consumiam as 16 vagas e o canal de param nunca chegava a
   * abrir vizinho nenhum — V033-05 (*3 % são 25 lb para mim*) ficava de fora
   * porque V033-04 é a 10ª linha do canal de param. É o mesmo defeito de "corte
   * por ordem de fila" que a `busca.mjs` já denuncia em outro lugar; a correção
   * é a mesma: quem tem evidência diferente não disputa a mesma vaga.
   *
   * O canal de param entra INTEIRO no foco porque ele sai inteiro na tela.
   */
  const vizRoteado = vizinhosNoMesmoSrc(
    claims,
    claimsRoteadas.slice(0, DETALHE_ROTEADO).map((x) => x.c),
    { vistos: naTela, porFoco: 1, teto: DETALHE_ROTEADO, raio: 2 },
  );
  const vizParam = vizinhosNoMesmoSrc(
    claims,
    params.lista.map((x) => x.c),
    {
      vistos: new Set([...naTela, ...vizRoteado.map((v) => v.c.id)]),
      porFoco: 1,
      teto: TETO_PARAM,
      raio: 2,
    },
  );
  /**
   * CADA VIZINHO DIZ DE QUAL CANAL VEIO, e isso não é enfeite de saída.
   *
   * Sem a etiqueta, os dois canais são indistinguíveis do lado de fora, e um
   * canário que exige "este id tem de sair" fica satisfeito por qualquer um dos
   * dois. Foi assim que `DETALHE_ROTEADO 8 → 0` sobreviveu verde ao ataque de
   * 10/08/2026: `vizRoteado` morria inteiro, o teste de V033-05 continuava
   * passando porque V033-05 vem de `vizParam`, e nada acusava. Com o canal
   * declarado, `viaPaginaAoLado` no ROTAS.json cobra o canal por nome.
   */
  const vizinhos = [
    ...vizRoteado.map((v) => ({ ...v, canal: 'rota' })),
    ...vizParam.map((v) => ({ ...v, canal: 'param' })),
  ];

  return {
    pergunta,
    ...rota,
    porTopico: porTopicoResultado,
    claims: claimsRoteadas,
    params,
    vizinhos,
    estreitar,
    // O contrato do canário: **o que o agente VÊ**. Tudo o que cabe na tela, e
    // nada além — achado no lugar 400 não é achado.
    idsMostrados: new Set([
      ...claimsRoteadas.map((x) => x.c.id),
      ...params.lista.map((x) => x.c.id),
      ...vizinhos.map((v) => v.c.id),
    ]),
    teto,
    indice,
    perfis: perfil,
  };
}

/**
 * O que o `--vocab` mostra de derivado, mas do lado do ROTEAMENTO: as raízes que
 * mais denunciam um tópico. Serve para auditar o perfil sem ler o corpus — e é a
 * lista que diz, em uma linha, por que `ciclo` e `cycle` roteiam os dois para
 * `periodizacao` sem dicionário nenhum.
 */
export function assinaturaDoTopico(perfis, topico, n = 14) {
  const p = perfis.porTopico.get(topico);
  if (!p) return [];
  return [...p.df.keys()]
    .map((t) => ({ termo: t, peso: pesoDoTermo(perfis, topico, t), dentro: p.df.get(t), naBase: perfis.dfGlobal.get(t) ?? 0 }))
    .filter((x) => x.peso > 0)
    .sort((a, b) => b.peso - a.peso || a.termo.localeCompare(b.termo))
    .slice(0, n);
}

/** As perguntas de calibração vivem em arquivo, não em código: quem verifica o
 *  piso não pode importar o piso. Ver `research/kb/ROTAS.json`. */
export function carregarRotas(arquivo) {
  return JSON.parse(readFileSync(arquivo, 'utf8'));
}
