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
 * DE ONDE VEM O SINAL — quatro canais, nenhum inventado
 *
 * 1. **O GLOSSÁRIO DE ENTRADA** (`research/kb/GLOSSARIO-TOPICOS.json`), e desde
 *    11/08/2026 ele é o canal principal. 74 gavetas, cada uma com glosa e 20–40
 *    termos **na voz do atleta**, escritos por oito agentes que leram as
 *    gavetas. É o canal que sabe o que é `fisgada` — palavra que **não existe em
 *    claim nenhuma** das 6.912 e que é exatamente o que se digita quando o
 *    peitoral dá um aviso. Ver `glossario.mjs` para o mecanismo e para o idf.
 * 2. **O corpus**, agora em segundo plano e AMORTECIDO pelo glossário. Para cada
 *    tópico, quais raízes aparecem MUITO nele e pouco fora. Continua valendo por
 *    dois motivos: ele cobre palavra que o glossário não previu, e ele atravessa
 *    a fronteira de língua que o `RECUPERACAO.md` §8.1 declarou inalcançável —
 *    `ciclo` e `cycle` não compartilham raiz nenhuma e as duas são distintivas
 *    de `periodizacao`, porque a claim é pt-BR e o `verbatim` é inglês. O que
 *    mudou é que ele deixou de DECIDIR sozinho: ver `PESO_CORPUS`.
 * 3. **O nome do tópico**, que é dado da lista fechada: `descanso-entre-series`
 *    casa a pergunta que diz "descanso entre séries".
 * 4. **O `VOCABULARIO.md`**, quando o tópico tem seção (10 dos 74). Aqui ele
 *    entra como CONFIRMAÇÃO de um tópico, não como injeção de termos na
 *    consulta — que era exatamente o mecanismo que destruiu a precisão.
 *
 * E um quinto que não pontua sozinho: o **`naoConfundirCom`** do glossário, que
 * é o único canal em que uma gaveta fala sobre OUTRA. Ver `PESO_CONFUSAO`.
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

import {
  palavras, raiz, normalizar, indexar, subIndice, buscarRelaxada,
  prosaDaClaim, VAZIAS, vizinhosNoMesmoSrc,
} from './busca.mjs';
import { casarGlossario, idfDoGlossario } from './glossario.mjs';

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

/**
 * ── O PESO DO CORPUS DEPOIS DE 11/08/2026, e por que ele não é mais 1 ────────
 *
 * O canal do corpus mede *"que palavras esta gaveta usa"*. É uma boa medida, e é
 * a medida errada para *"o que este atleta digitou"*. Os dois casos que fecharam
 * o diagnóstico de 10/08 são os dois lados do mesmo erro:
 *
 *   · `fisgada` não existe em claim nenhuma, então o corpus não tinha o que
 *     dizer sobre a pergunta mais cara desta base;
 *   · `peso` aparece em 141 das 238 claims de `peso-corporal`, então o corpus
 *     dizia com força que *levantar peso* é peso CORPORAL — e `cardio`, com 230
 *     claims que respondem a pergunta, nunca abria.
 *
 * O conserto não é apagar o corpus: ele é quem sabe QUAIS claims de um tópico
 * usam a palavra, e é ele que separa uma gaveta de 990 de uma de 13 quando as
 * duas reivindicam o mesmo termo de entrada. O conserto é ele parar de decidir
 * sozinho. Meio peso, e AMORTECIDO palavra a palavra pelo idf DO GLOSSÁRIO:
 * `peso`, que 15 das 74 gavetas reivindicam, entra valendo 0,37 do que valia;
 * `agachamento`, que é de uma gaveta só, entra quase inteiro; e a palavra que
 * NENHUMA gaveta reivindica entra valendo zero.
 *
 * Medido nos dois estados, com as duas populações de calibração do `ROTAS.json`:
 * com 1,0 o `peso-corporal` continua em 1º na pergunta do coração; com 0,5 ele
 * some da lista e `cardio` sai em 1º.
 *
 * ── E O ZERO DO FIM FOI UMA DECISÃO MEDIDA ──────────────────────────────────
 *
 * A primeira versão desta camada tinha um piso (`PISO_IDF_CORPUS = 0,2`) para a
 * palavra que o glossário não conhece, com a justificativa de que o corpus
 * atravessa a fronteira de língua: `cycle` e `ciclo` não compartilham raiz
 * nenhuma e as duas são de `periodizacao`. **A justificativa não sobreviveu à
 * medição.** Com o piso, `o que a base diz sobre hypertrophy?` e `treinar até
 * failure vale a pena?` continuavam sem mapear para gaveta nenhuma — a ponte não
 * existia —, o placar dos 18 canários da porta nova era exatamente o mesmo (8
 * com algum id, 1 sem gaveta, 11 abrindo o tópico da resposta), a margem de
 * calibração era PIOR (maior de fora 0,51 contra 0,47), e nenhum canário
 * NOMEADO morria quando o piso ia a zero — só o registro de medida acusava.
 * Constante que só o registro defende é constante que ninguém pode mexer com
 * segurança: saiu, e a regra ficou uma frase. **O corpus só fala sobre palavra
 * que o glossário conhece.**
 */
export const PESO_CORPUS = 0.5;

/**
 * ── O `naoConfundirCom`, e é o único canal em que uma gaveta fala de OUTRA ───
 *
 * Cada tópico do glossário declara com quem ele se confunde e como distinguir.
 * O texto do `comoDistinguir` é para o modelo (Porta A); o que a Porta B
 * consegue usar de forma determinística é o PAR: se a gaveta A foi roteada e A
 * declara que se confunde com B, e B também casou alguma coisa da pergunta,
 * então B recebe este bônus.
 *
 * O caso é o do peitoral, e ele está escrito no lote 1 com todas as letras:
 * `peito` declara que *"QUALQUER sintoma no peitoral vai para dor, mesmo
 * mencionando a palavra peito"*. Medido: `fisgada de 3/10 no peitoral na
 * terceira série de supino pausado, continuo?` põe `peito` em 2,60 e `dor` em
 * 0,79 — abaixo da fração do melhor. Com o bônus, `dor` sobe e a gaveta que
 * carrega o limiar de 2/10 abre.
 *
 * Duas condições, e as duas importam: quem dá o aviso precisa ter sido ROTEADO
 * (senão 74 tópicos espirram bônus uns nos outros), e quem recebe precisa ter
 * casado alguma coisa sozinho (o aviso levanta um candidato, não inventa um).
 */
export const PESO_CONFUSAO = 0.4;

/**
 * ── QUEM TEM DIREITO A CARREGAR A PERGUNTA SOZINHO ──────────────────────────
 *
 * O piso do score é o MAIOR peso individual, e só destes canais. A ideia é a
 * mesma de 10/08 — "você nomeou esta gaveta" não pode ser diluído por a pergunta
 * ter outras palavras —, e a lista cresceu junto com os canais:
 *
 *   · `nome do tópico` e `VOCABULARIO.md` — quem digitou o nome da gaveta;
 *   · `glossário (frase inteira)` — quem escreveu `categoria de peso` inteiro já
 *     desambiguou sozinho;
 *   · `glossário (frase espalhada)` — as DUAS palavras do termo, dentro de uma
 *     janela de cinco. É o canal que o P11 exige: sem o piso, `deload` fica em
 *     0,63 para *de quantas em quantas semanas eu preciso pegar leve* e a
 *     pergunta não mapeia para gaveta nenhuma;
 *   · `glossário (termo)` — a palavra É um termo de entrada do tópico.
 *
 * E fora dela ficam os dois canais fracos: `corpus` (coincidência de palavra não
 * é assunto) e **`glossário (dentro de frase)`** — uma palavra rara arrancada de
 * dentro de um termo maior, como `capital` dentro de um termo de `bracos`.
 *
 * ── O QUE ESSA EXCLUSÃO VALE HOJE, MEDIDO E SEM ADJETIVO ────────────────────
 *
 * Ela nasceu obrigatória: na primeira versão desta camada, quando o glossário
 * era o ÚNICO canal, `capital` dava 0,50 sozinha e as duas populações de
 * calibração se cruzavam (menor de dentro 0,40 contra maior de fora 0,50) — não
 * existia piso que separasse. Depois que o corpus voltou como canal amortecido,
 * a conta mudou: com o canal fraco DENTRO do piso, o maior score da população de
 * fora vai de 0,47 para 0,50, contra um piso de 0,65 e um menor-de-dentro de
 * 0,92. Ou seja: **hoje a exclusão compra 0,03 de margem e nenhum canário
 * nomeado depende dela.** Está escrito assim, com o número, em vez de continuar
 * repetindo a justificativa de quando ela era decisiva — documento e código
 * divergirem em silêncio é o modo de falha nº 3 desta casa, e a versão morta de
 * uma justificativa é uma divergência como qualquer outra.
 */
export const CANAIS_AUTORITATIVOS = new Set([
  'nome do tópico', 'VOCABULARIO.md', 'glossário (frase inteira)',
  'glossário (frase espalhada)', 'glossário (termo)',
]);

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
 *
 * **É TETO, e desde 12/08/2026 deixou de ser ALVO.** Até então a tela era
 * preenchida até 40 sempre que houvesse 40 claims roteadas — 32 de 33 perguntas
 * medidas devolviam exatamente 40, inclusive *"o cinto pode ter mais de 13 mm"*,
 * que tem uma resposta. Ver `vagasPorGaveta`.
 */
export const TETO_ROTEADO = 40;

/** Quantas saem com a claim inteira antes de a saída virar índice. */
export const DETALHE_ROTEADO = 8;

/**
 * ── AS 40 VAGAS SÃO DE QUATRO CANAIS, E NÃO SÓ DO ROTEAMENTO ────────────────
 *
 * O defeito, medido em 11/08: o canal da rota devolvia 40 e os outros três —
 * nome de param, página ao lado, ledger — eram calculados, impressos e
 * **cortados fora da tela**, porque quem conta a tela (`telaDe`, no
 * `check-canarios.mjs`, e o `check-rotas.mjs`) enfileira rota → param → ledger →
 * vizinho e corta em 40. Com a rota ocupando as 40, os outros três nunca
 * existiram para efeito de medição.
 *
 * O caso que prova: *quanto baixar o peso quando o RPE vem acima do alvo* tem a
 * resposta (V033-03/04/05) no canal de PARAM, e o canal de param nunca chegava à
 * tela. Zero de três, com a resposta calculada e descartada.
 *
 * É o mesmo argumento que este arquivo já faz duas vezes — *quem tem evidência
 * diferente não disputa a mesma vaga* — aplicado onde faltava. As frações são o
 * julgamento: a rota é o canal principal e leva a maioria; o param é o canal que
 * lê dado tipado e vale caro quando dispara; o ledger e a página ao lado são
 * completamentos do que já saiu e por isso são os menores.
 *
 * Medido contra os 53 canários com id esperado, no `medir-alocacao.mjs`: com a rota
 * levando as 40 (o estado de 11/08), 46 de 127 ids chegam à tela; com a rota em
 * 55 % do teto e os outros três com orçamento próprio, 60 de 127.
 *
 * A rota é FRAÇÃO do teto de tela e não um número absoluto, e isso não é estilo:
 * com um absoluto, `TETO_ROTEADO 40 → 400` vira mutação inerte (o `min` com o
 * absoluto engole) e a constante passa a mentir. Fração faz o teto continuar
 * mandando — 400 de teto viram 220 de rota, e o caso que cobra "a saída padrão
 * cabe numa leitura" fica vermelho como deve.
 *
 * O canal de param NÃO tem constante nova: ele já tinha `TETO_PARAM = 12`, e uma
 * segunda constante para a mesma coisa seria duas fontes para divergir — a
 * mutação `VAGAS_DO_PARAM 12 → 120` sobrevivia por ser matematicamente inerte,
 * o que é a forma mais barata de uma constante mentir.
 */
export const FRACAO_DA_ROTA = 0.55;
export const VAGAS_DA_LIGACAO = 8;

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
  topicos, glossario = null, vocabulario = [], piso = PISO_ROTA, max = MAX_TOPICOS,
  fracao = FRACAO_DO_MELHOR,
} = {}) {
  /**
   * O GLOSSÁRIO É OBRIGATÓRIO, e o erro é duro de propósito.
   *
   * Ele é o canal principal desde 11/08/2026. Se ele fosse opcional com default
   * vazio, apagar a linha que o carrega em qualquer chamador faria a camada
   * voltar em silêncio ao roteador léxico de 10/08 — que é o defeito que esta
   * onda existe para consertar — e o `check:kb` continuaria verde nos casos que
   * o corpus ainda resolve sozinho. Falha barulhenta, não degradação muda.
   */
  if (!glossario || !glossario.porPalavra) {
    throw new Error(
      'rotear() sem glossário: o vocabulário de entrada (research/kb/GLOSSARIO-TOPICOS.json) é o '
        + 'canal principal do roteamento, não um enfeite. Carregue-o com carregarGlossario/indexarGlossario.',
    );
  }
  const W = termosDaPergunta(pergunta);
  const q = normalizar(pergunta);

  const conhecidos = [...W].filter((t) => (perfis.dfGlobal.get(t) ?? 0) > 0);
  const desconhecidos = [...W].filter((t) => (perfis.dfGlobal.get(t) ?? 0) === 0);

  // O glossário casa a pergunta inteira de uma vez — ele é indexado por termo, e
  // varrer 74 tópicos × 1.988 termos por palavra seria a mesma conta feita 74
  // vezes.
  const doGlossario = casarGlossario(glossario, pergunta, W);

  const linhas = [];
  for (const topico of topicos) {
    const p = perfis.porTopico.get(topico);
    if (!p) continue;
    const porQue = [];
    let score = 0;

    // ── 1. O GLOSSÁRIO DE ENTRADA, o canal principal ─────────────────────────
    const g = doGlossario.get(topico);
    const cobertas = new Set();
    if (g) {
      score += g.peso;
      for (const x of g.porQue) porQue.push(x);
      for (const w of g.cobriu) cobertas.add(w);
    }

    // ── 2. O CORPUS, amortecido pelo idf do glossário ────────────────────────
    //
    // `pesoDaPalavra` é a mesma função de 10/08 e continua medindo a mesma
    // coisa. O que mudou é o que se faz com o número: ele é multiplicado por
    // `PESO_CORPUS` e pelo idf da palavra NO GLOSSÁRIO, que é quanto aquela
    // palavra discrimina no espaço em que a pergunta é escrita.
    for (const t of W) {
      const m = pesoDaPalavra(perfis, topico, t);
      if (m.peso <= 0) continue;
      const amortecimento = idfDoGlossario(glossario, t);
      const peso = PESO_CORPUS * m.peso * amortecimento;
      if (peso <= 0) continue;
      score += peso;
      porQue.push({
        palavraDaPergunta: t,
        termo: t, comoNaBase: m.termo, peso, bruto: m.peso, amortecimento,
        dentro: m.dentro, deQuantas: p.n, naBase: m.naBase, canal: 'corpus',
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
    for (const x of porQue) if (x.palavraDaPergunta) cobertas.add(x.palavraDaPergunta);
    const cobriu = cobertas.size;
    const cobertura = conhecidos.length ? Math.min(1, cobriu / conhecidos.length) : 0;
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
      .filter((x) => CANAIS_AUTORITATIVOS.has(x.canal))
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

  const ordenar = () => linhas.sort((a, b) => b.score - a.score || a.topico.localeCompare(b.topico));
  ordenar();

  /**
   * ── O AVISO DA GAVETA VIZINHA ────────────────────────────────────────────
   *
   * Segundo passe, e ele só existe porque o glossário traz um dado que nenhum
   * outro canal tem: cada tópico declara com QUEM ele se confunde. `peito` diz,
   * no lote 1, que *"QUALQUER sintoma no peitoral vai para dor"*. Quando `peito`
   * é roteado e `dor` também casou alguma coisa da pergunta, `dor` sobe.
   *
   * As duas condições são o que impede isto de virar espirro: quem avisa tem de
   * ter sido ROTEADO (não basta ter casado uma palavra), e quem recebe tem de
   * ter casado alguma coisa sozinho — o aviso levanta um candidato que já
   * existe, nunca inventa um. Dois avisos sobre a mesma gaveta somam, porque são
   * dois donos diferentes dizendo a mesma coisa.
   */
  {
    const provisorio = linhas[0]?.score ?? 0;
    if (provisorio >= piso) {
      const roteados = new Set(linhas.filter((l) => l.score >= provisorio * fracao).slice(0, max).map((l) => l.topico));
      const porNome = new Map(linhas.map((l) => [l.topico, l]));
      const avisos = new Map();
      for (const a of roteados) {
        for (const b of glossario.confusao?.get(a) ?? []) {
          if (roteados.has(b) || !porNome.has(b)) continue;
          if (!avisos.has(b)) avisos.set(b, []);
          avisos.get(b).push(a);
        }
      }
      for (const [b, quem] of avisos) {
        const alvo = porNome.get(b);
        /**
         * O TETO DO BÔNUS É O PRÓPRIO SCORE, e ele é a diferença entre um aviso
         * e um empurrão. Medido no P08 (*minha mão está descascando no terra,
         * uso alguma coisa pra segurar a barra*): sem teto, `lesao` — que casou
         * 0,38 de uma frase solta — recebia dois avisos, ia a 1,05 e ocupava a
         * vaga de `strap`, que é a gaveta da resposta. O aviso pode no máximo
         * DOBRAR quem já tinha evidência própria; ele nunca cria um candidato do
         * nada, e por isso um tópico que casou 0,05 continua valendo 0,10.
         *
         * Medido nas três variantes contra os 18 canários da porta nova: sem
         * teto, 8 canários devolvem algum id e o P08 perde o dele; com o teto
         * frouxo (`max(PESO_CONFUSAO, score)`), 7; com este, 8 e NENHUM canário
         * fica pior do que estava antes desta onda.
         */
        const bonus = Math.min(PESO_CONFUSAO * quem.length, alvo.score);
        alvo.score += bonus;
        /**
         * QUEM AVISOU FICA REGISTRADO, e não é enfeite: é o dado que a alocação
         * de vagas usa. Ver `vagasPorGaveta` — `peito` declarar *"qualquer
         * sintoma no peitoral vai para dor"* é a base dizendo, por escrito, que
         * a gaveta da resposta é a OUTRA, e uma gaveta que recebe esse aviso não
         * pode sair da tela com menos vagas do que quem a apontou.
         */
        alvo.avisadoPor = quem.slice();
        alvo.porQue.push({
          termo: `${quem.join(' e ')} declara(m): não confundir com ${b}`, peso: bonus, canal: 'naoConfundirCom',
        });
        alvo.porQue.sort((x, y) => y.peso - x.peso);
      }
      ordenar();
    }
  }

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
/**
 * A MEMÓRIA É POR ARRAY DE CLAIMS, e a chave fraca não é detalhe de estilo.
 *
 * O conjunto de um tópico não depende da pergunta — só da base e do tópico —, e
 * uma execução do `check-rotas.mjs` faz 19 perguntas × até 5 gavetas, cada uma
 * varrendo as 6.912 claims para calcular afinidade. Era o passo mais caro da
 * verificação inteira.
 *
 * `WeakMap` na PRÓPRIA lista de claims e não um cache global com chave de
 * string: se um teste montar um corpus diferente (o `BOLSO` do
 * `roteador.test.mjs` monta), ele é outro array e não encontra nada aqui. Cache
 * que responde pela base errada é o modo de falha nº 3 com outra roupa.
 */
const MEMO_CONJUNTO = new WeakMap();

export function conjuntoDoTopico(claims, perfis, topico, { afins = TETO_AFINS } = {}) {
  let porBase = MEMO_CONJUNTO.get(claims);
  if (!porBase) {
    porBase = new Map();
    MEMO_CONJUNTO.set(claims, porBase);
  }
  const chave = `${topico} ${afins}`;
  const guardado = porBase.get(chave);
  if (guardado) return guardado;
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
  const out = { declarado, afim: new Set(candidatos.slice(0, afins).map((x) => x.id)) };
  porBase.set(chave, out);
  return out;
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

// ── A ALOCAÇÃO DAS VAGAS DA TELA ─────────────────────────────────────────────
//
// ─────────────────────────────────────────────────────────────────────────────
// O DEFEITO DE 11/08/2026, MEDIDO PELO ATAQUE CEGO: **SOTERRAMENTO**
//
// A onda anterior consertou o ROTEAMENTO — em 10 dos 12 canários cegos a gaveta
// que contém a resposta ABRIU — e entregou zero ao atleta: 0 de 12 devolviam
// qualquer id esperado. O mecanismo estava no passo seguinte, e era este:
//
//   as 40 vagas eram um RANKING GLOBAL. Cada gaveta despejava até 40 claims num
//   balaio comum, ordenava-se tudo junto e cortava-se em 40.
//
// Ordenar tudo junto e cortar é dar as vagas por TAMANHO de gaveta, porque a
// gaveta grande tem mais bilhetes na rifa. Medido, com as vagas que cada gaveta
// levou das 40:
//
//   B11   supino(694):29   agacho(990):25   ordem-exercicio(29):9   <- a resposta
//   B07   competicao(457):36  equipamento(199):4                    <- F001-94 aqui
//   B12   agacho(990):39
//   fisgada  peito(31):33  supino(694):9  dor(119):6                <- as 5 aqui
//
// E o custo é o caso mais caro desta base: *fisgada de 3/10 no peitoral na
// terceira série de supino pausado, continuo?* abria `dor` em 3º lugar, dava a
// ela 6 vagas, e das cinco claims do limiar de dor UMA chegava à tela, em 36º.
//
// ─────────────────────────────────────────────────────────────────────────────
// A PERGUNTA QUE ESTE BLOCO RESPONDE: **QUANTAS VAGAS UMA GAVETA MERECE?**
//
// Três candidatas foram medidas contra os 12 canários cegos de 12/08 (B01–B12),
// os 18 públicos (P01–P18) e os três casos nomeados, e a medição está no
// `RECUPERACAO.md` §22:
//
//   · **igual entre as abertas** (rodízio puro, 40/k): B11 dá 8 vagas a
//     `ordem-exercicio`, e G014-10 está em 12º DENTRO da gaveta. Falha, e falha
//     por um motivo estrutural — cinco gavetas abertas cabem 8 vagas cada, e
//     nenhuma pergunta específica sobrevive a isso.
//   · **proporcional ao score da rota**: é o defeito com outra roupa. Em B11 os
//     scores são supino 0,98, agacho 0,90, `ordem-exercicio` 0,86 — quase
//     empatados —, e o desempate acaba sendo o tamanho de novo, porque a gaveta
//     grande casa mais palavra.
//   · **score × SURPRESA DO TAMANHO**, que é o que ficou. Ver abaixo.
//
// ─────────────────────────────────────────────────────────────────────────────
// A SURPRESA, E POR QUE ELA É A MEDIDA CERTA
//
// `agacho` pontuar 0,90 numa pergunta deste atleta não é notícia: são 990 claims
// e ele agacha em toda pergunta que faz. `ordem-exercicio` pontuar 0,86 com 29
// claims é notícia, porque a pergunta teve de ser SOBRE ordem de exercício para
// aquela gaveta aparecer. É a mesma conta que o `pesoDoTermo` já faz um nível
// abaixo (lift), aplicada um nível acima: **gaveta pequena que pontua é sinal
// forte, não fraco.**
//
// A forma é o idf da gaveta, `log(N / n)`, e ela não é escolhida por gosto — é a
// única função disponível que já está no vocabulário desta camada. Em B11:
// `ordem-exercicio` vale log(6912/29) = 5,4 e `agacho` vale log(6912/990) = 1,9.
// Multiplicado pelo score da rota, `ordem-exercicio` sai com ~15 vagas contra ~6
// de `agacho`, e G014-10 (12º dentro da gaveta) chega à tela.
//
// ─────────────────────────────────────────────────────────────────────────────
// E A PARTE QUE COSTUMA SER ESQUECIDA: **A VAGA É TETO, NÃO É DIREITO**
//
// A sobra NÃO é redistribuída. Se `cinto` só tem duas claims acima da própria
// gaveta, `cinto` leva 9 vagas e usa 8; as outras evaporam — não vão para
// `competicao`, que tem 457 claims e uma distribuição chapada.
//
// É isso que faz a tela saber devolver POUCO, e a medição de 11/08 dizia por que
// isso importa: 32 de 33 perguntas devolviam exatamente 40 claims, inclusive uma
// cuja resposta é uma linha do regulamento. **Tela sempre cheia é indistinguível
// de tela que achou** — foi assim que o caso da fisgada ficou cheio, plausível e
// silencioso.

/**
 * O PISO: quantas vagas uma gaveta ABERTA leva mesmo sendo a última da lista.
 *
 * Existe porque o roteador não é confiável o bastante na ORDEM em que abre as
 * gavetas para que a última possa levar zero: medido em 10/08, em 10 dos 12
 * cegos a gaveta da resposta abriu e em 8 deles ela não era a primeira. `dor`
 * abriu em 3º na pergunta da fisgada e carrega as cinco claims que respondem.
 *
 * 5 e não 8: com `MAX_TOPICOS = 5` gavetas abertas, um piso de 8 consome as 40
 * vagas inteiras e a distribuição por surpresa deixa de existir. Com 5, o piso
 * consome no máximo 25 e sobram 15 para o sinal decidir. Medido nos dois lados
 * no `alocacao.test.mjs`: com piso 0 a pergunta da fisgada perde V001-06, e com
 * piso 8 a B11 perde G014-10.
 */
export const PISO_VAGAS = 3;

/**
 * ── A QUEDA DENTRO DA GAVETA FOI TENTADA E MEDIDA, E NÃO FICOU ──────────────
 *
 * O desenho original desta onda tinha uma quarta peça: cada gaveta pararia de
 * oferecer claims quando a próxima caísse abaixo de uma fração do 1º lugar DELA
 * — um penhasco por gaveta, para a tela saber devolver pouco. A forma do sinal
 * parecia dar razão: `cinto` cai 1,00 · 0,86 · **0,40** na pergunta dos 13 mm.
 *
 * **A medição desmentiu.** A mesma forma aparece na gaveta em que a resposta
 * está na CAUDA: `descanso-entre-series` cai 1,00 · 0,67 · 0,62 · 0,35, e
 * V038-07, V074-10 e V074-23 — as três claims do T05 — vivem entre 0,11 e 0,18.
 * Varrida de 0 a 0,45 contra os 53 canários com id esperado, a queda só custa:
 *
 *   queda 0     → 60 de 127 ids · 17 casos completos
 *   queda 0,15  → 55 de 127     · 15
 *   queda 0,45  → 36 de 127     · 10
 *
 * A conclusão está escrita aqui em vez de a constante ficar valendo zero:
 * **a forma do score dentro da gaveta não distingue "achou" de "não tem mais o
 * que dizer" nesta base**, e a tela encolhe pelo outro lado — a vaga é TETO e a
 * sobra não volta ao bolo. Constante que só o registro defende é constante que
 * ninguém pode mexer com segurança; esta virou uma frase.
 */

/**
 * Quanto das vagas de uma gaveta a claim que entrou por AFINIDADE pode ocupar.
 *
 * A afinidade conserta etiqueta esquecida (V038-07, que fala de descanso em
 * minutos e não está em `descanso-entre-series`), e para isso ela precisa
 * existir. O que ela não pode é VIRAR a gaveta: `TETO_AFINS` é 60 e
 * `ordem-exercicio` tem 29 claims declaradas, ou seja, dois terços da gaveta
 * passavam a ser claims de outro lugar. Medido em B11, com a pergunta da ordem
 * dos exercícios:
 *
 *   afins=0  → a lista tem 25 e G014-10 sai em 12º
 *   afins=60 → a lista tem 83 e G014-10 sai em 30º
 *
 * O desconto de `PESO_AFIM` (0,6) não segura isso, porque as claims afins vêm de
 * `agacho` e `supino` e casam LITERALMENTE as palavras da pergunta. Cota é o que
 * segura: quem tem evidência diferente não disputa a mesma vaga — o mesmo
 * argumento que já separa o canal de param do canal de rota na vizinhança.
 *
 * 0,25: em 12 vagas, 3 são de afim. Com 1,0 (sem cota) B11 morre; com 0,0 a C20
 * perde as claims que a etiqueta esqueceu.
 */
export const COTA_AFIM = 0;

/**
 * O EXPOENTE DA SURPRESA — quanto o tamanho da gaveta pesa contra o score.
 *
 * Com 1, a surpresa é um fator entre outros e o score da rota decide quase tudo;
 * com 2, a especificidade da gaveta domina. Medido nos 53 canários com id
 * esperado (`medir-alocacao.mjs`), o número inteiro entre 1 e 3 que maximiza o
 * recall está escrito no `RECUPERACAO.md` §22 com a tabela ao lado.
 */
export const EXPOENTE_SURPRESA = 3;

/**
 * A surpresa de uma gaveta ter pontuado: o idf do tamanho dela.
 *
 * Separada em função própria porque é a peça que carrega a decisão de projeto, e
 * peça que carrega decisão tem de poder ser chamada por um teste sem montar a
 * base inteira.
 */
export function surpresaDaGaveta(nDaBase, nDaGaveta) {
  const n = Math.max(1, nDaGaveta);
  if (!(nDaBase > 0) || n >= nDaBase) return 0;
  return Math.log(nDaBase / n);
}

/**
 * QUANTAS VAGAS CADA GAVETA ABERTA LEVA.
 *
 * Entra a lista de rotas (com o score e o tamanho de cada gaveta) e quantas
 * claims cada uma tem ACIMA DA PRÓPRIA QUEDA; sai o teto de vagas de cada uma.
 *
 * Três propriedades, e a terceira é a que a onda anterior não tinha:
 *   1. toda gaveta aberta leva ao menos `piso`;
 *   2. a divisão é por `score × surpresa`, então gaveta pequena não é punida
 *      por ser pequena;
 *   3. **o número é TETO e a sobra não volta para o bolo** — gaveta sem o que
 *      dizer devolve pouco, e a tela encolhe junto.
 */
export function vagasPorGaveta(rotas, {
  teto = TETO_ROTEADO, piso = PISO_VAGAS, nDaBase = 0, expoente = EXPOENTE_SURPRESA,
} = {}) {
  if (rotas.length === 0) return new Map();
  const pesos = rotas.map((r) => Math.max(0, r.score)
    * ((surpresaDaGaveta(nDaBase, r.claims) || 1) ** expoente));
  const soma = pesos.reduce((a, b) => a + b, 0);
  const out = new Map();
  for (const [i, r] of rotas.entries()) {
    const fatia = soma > 0 ? Math.floor((teto * pesos[i]) / soma) : Math.floor(teto / rotas.length);
    out.set(r.topico, Math.max(1, Math.min(teto, Math.max(piso, fatia), r.elegiveis ?? teto)));
  }

  /**
   * ── E A EXCEÇÃO QUE A PRÓPRIA BASE DECLARA ────────────────────────────────
   *
   * A surpresa do tamanho é uma boa medida e ela aponta para o lado ERRADO num
   * caso, que é justamente o mais caro: na pergunta da fisgada, `peito` (31
   * claims) é mais surpreendente que `dor` (119) e leva mais vagas — e as cinco
   * claims que carregam o limiar de dor estão em `dor`.
   *
   * O desempate não é heurística nova: está escrito no glossário, no campo
   * `naoConfundirCom`, e é o único canal em que uma gaveta fala sobre OUTRA.
   * `peito` declara, no lote 1, *"QUALQUER sintoma no peitoral vai para dor,
   * mesmo mencionando a palavra peito"*. Quando o dono da gaveta diz por escrito
   * que a resposta é na gaveta ao lado, **a gaveta ao lado não pode sair da tela
   * com menos vagas do que quem a apontou.**
   *
   * As condições são as mesmas do bônus que gerou o aviso — quem avisa tem de
   * ter sido roteado, e quem recebe tem de ter pontuado sozinho —, então isto
   * não cria gaveta nenhuma: só reparte vaga entre gavetas que já abriram.
   *
   * Medido: sem esta regra, `dor` leva 7 das 24 vagas da rota na pergunta da
   * fisgada e V001-06 (9ª dentro de `dor`) não chega à tela; com ela, `dor`
   * empata com `peito` e as cinco chegam.
   */
  const abertas = new Set(rotas.map((r) => r.topico));
  for (const r of rotas) {
    const quem = (r.avisadoPor ?? []).filter((t) => abertas.has(t));
    if (quem.length === 0) continue;
    const teto_ = Math.max(...quem.map((t) => out.get(t) ?? 0));
    out.set(r.topico, Math.max(out.get(r.topico) ?? 0, Math.min(teto_, r.elegiveis ?? teto)));
  }
  return out;
}

/**
 * A DISTRIBUIÇÃO PROPRIAMENTE DITA — rodízio com teto por gaveta.
 *
 * O rodízio (uma claim por gaveta por rodada, na ordem do score da rota) existe
 * para que a gaveta que abriu em 3º apareça no TOPO da tela e não só no fim
 * dela. Sem ele, `dor` levaria as suas 9 vagas nas posições 32ª a 40ª — dentro
 * do teto e fora da leitura.
 *
 * A claim que aparece em DUAS gavetas abertas não consome duas vagas: ela soma
 * as duas parcelas de score (é o cruzamento de tópicos, que sempre foi o sinal
 * mais forte desta camada) e ocupa uma vaga só, contada na gaveta que a ofereceu
 * primeiro.
 */
export function alocarVagas(porTopico, {
  teto = TETO_ROTEADO, piso = PISO_VAGAS, cotaAfim = COTA_AFIM, nDaBase = 0,
  estrategia = 'gaveta', expoente = EXPOENTE_SURPRESA,
} = {}) {
  /**
   * `estrategia: 'global'` É A CAMADA DE 11/08, PRESERVADA DE PROPÓSITO.
   *
   * Ela existe por um motivo só: a bancada (`medir-alocacao.mjs`) precisa medir o
   * antes e o depois no MESMO comando, na base real, sem depender de alguém
   * lembrar o número. Um "melhorou" sem o número do estado anterior ao lado é o
   * modo de falha nº 5 desta casa, e a versão anterior de uma medição não se
   * recupera de um relatório — se recupera do código.
   *
   * Nenhuma trava a usa, e nada em produção a liga: `responder` não expõe o
   * campo, só a bancada.
   */
  if (estrategia === 'global') {
    const acumulado = new Map();
    const melhorRota = porTopico[0]?.score || 1;
    for (const r of porTopico) {
      const topo = r.resultados[0]?.score ?? 0;
      const pesoDaRota = (r.score / melhorRota) ** 2;
      for (const x of r.resultados) {
        const rel = topo > 0 ? x.score / topo : 0;
        const a = acumulado.get(x.c.id) ?? { c: x.c, score: 0, topicos: [], casou: x.casou };
        a.score += rel * pesoDaRota;
        a.topicos.push(r.topico);
        if (x.casou.length > a.casou.length) a.casou = x.casou;
        acumulado.set(x.c.id, a);
      }
    }
    return {
      claims: [...acumulado.values()]
        .sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id))
        .slice(0, teto),
      vagas: new Map(),
    };
  }
  /**
   * ── GAVETA FORÇADA NÃO TEM QUEDA, e é a mesma assimetria dos afins ─────────
   *
   * `--topic cinto` não é o roteador adivinhando: é um humano pedindo a gaveta.
   * Quem pede a gaveta quer a gaveta, não a parte dela que casa a frase — o T14
   * do `ROTAS.json` existe exatamente para isso e diz por escrito que o caso *é
   * sobre ver a GAVETA INTEIRA, não sobre ranquear dentro dela*. Por isso a cota
   * da gaveta forçada é a tela inteira e não a fatia calculada: F001-83 (a
   * largura do cinto) está em 49º, porque a pergunta diz `dimensões` e a claim
   * diz `largura`.
   */
  const filas = porTopico.map((r) => {
    const topo = r.resultados[0]?.score ?? 0;
    const elegiveis = r.resultados;
    return {
      r,
      topo,
      elegiveis,
      fila: elegiveis.slice(),
      tomou: 0,
      afins: 0,
      forcado: !!r.forcado,
    };
  });
  const vagas = vagasPorGaveta(
    filas.map((f) => ({
      topico: f.r.topico,
      score: f.r.score,
      claims: f.r.claims,
      elegiveis: f.elegiveis.length,
      avisadoPor: f.r.avisadoPor,
    })),
    { teto, piso, nDaBase, expoente },
  );

  const acumulado = new Map();
  const melhorRota = porTopico[0]?.score || 1;
  let ocupadas = 0;
  let mexeu = true;
  /**
   * ── PRIMEIRO UMA VOLTA IGUAL, DEPOIS A MAIOR SOBRA ────────────────────────
   *
   * A primeira rodada é rodízio puro: cada gaveta aberta entrega a SUA melhor
   * claim, na ordem do score da rota. É a propriedade 1 escrita como código —
   * gaveta que o roteador abriu tem vaga garantida, e ela aparece no topo da
   * tela e não no fim dela.
   *
   * Da segunda em diante a vaga vai para quem tem mais SOBRA de cota
   * (`cota − tomou`). Rodízio puro daqui para a frente seria o defeito de volta
   * com outro nome: com cinco gavetas abertas e 24 vagas, todo mundo leva 5 e a
   * cota calculada por surpresa não decide nada. Medido em B11 — a cota de
   * `ordem-exercicio` era 14 e a gaveta entregava 5, porque o rodízio empatava
   * tudo.
   */
  const proximaFila = () => {
    let melhor = null;
    for (const f of filas) {
      const cota = f.forcado ? teto : (vagas.get(f.r.topico) ?? 0);
      const sobra = cota - f.tomou;
      if (sobra <= 0 || f.fila.length === 0) continue;
      if (!melhor || sobra > melhor.sobra) melhor = { f, sobra };
    }
    return melhor?.f ?? null;
  };
  let primeiraVolta = true;
  while (ocupadas < teto && mexeu) {
    mexeu = false;
    const ordemDaRodada = primeiraVolta ? filas : filas.map(() => null);
    primeiraVolta = false;
    for (let idx = 0; idx < ordemDaRodada.length; idx += 1) {
      const f = ordemDaRodada[idx] ?? proximaFila();
      if (!f) break;
      if (ocupadas >= teto) break;
      const cota = f.forcado ? teto : (vagas.get(f.r.topico) ?? 0);
      if (f.tomou >= cota) continue;
      /**
       * ── A COTA DO AFIM ADIA, ELA NÃO PROÍBE ─────────────────────────────
       *
       * A claim que a cota barra NÃO sai da fila: ela é adiada. Quando a gaveta
       * fica sem claim DECLARADA para oferecer, a vaga volta para a primeira
       * afim adiada — é a diferença entre *"declarada primeiro"* e *"afim
       * nunca"*, e ela é o caso T05: `descanso-entre-series` tem 12 claims
       * declaradas, recebe ~20 vagas, e V038-07 (que fala de descansar 8 minutos
       * e cuja etiqueta esqueceu de pô-la ali) é AFIM. Proibir mataria o caso
       * que criou a afinidade; adiar põe as 12 declaradas na frente dela e a
       * mantém na tela.
       *
       * A fila é consumida por remoção e não por um ponteiro que avança: com
       * ponteiro, escolher uma declarada que estava DEPOIS de uma afim adiada
       * pulava a afim para sempre, e o "adiar" virava "proibir" em silêncio.
       */
      /**
       * ── A COTA SÓ EXISTE QUANDO A GAVETA NÃO CABE ─────────────────────────
       *
       * Se a gaveta tem MENOS claims declaradas do que vagas, não há disputa a
       * arbitrar: as declaradas cabem todas e a afim só ocupa o que sobrou. Nesse
       * caso a cota não se aplica e a ordem natural é preservada — e ela importa,
       * porque a ordem da tela é o foco do canal "página ao lado".
       *
       * Medido nos dois lados, e é por isso que a regra é condicional:
       *
       *   · `descanso-entre-series` tem 12 declaradas para ~24 vagas. Adiar as
       *     afins empurra V003-17 para fora das 8 primeiras da tela, e com ela
       *     some V003-18 (*5 minutos em agachamento e terra, 3 no supino*), que
       *     é um dos dois ids que o `viaPaginaAoLado` do T05 cobra POR CANAL;
       *   · `ordem-exercicio` tem 29 declaradas para ~15 vagas, e `TETO_AFINS`
       *     empilha 60 claims de `agacho` e `supino` na frente delas. Sem adiar,
       *     G014-10 sai em 30º dentro da própria gaveta.
       *
       * A condição separa os dois casos por um FATO e não por um ajuste: **a
       * gaveta inteira cabe nas vagas dela, ou não cabe.** Se cabe, não há
       * disputa a arbitrar — as declaradas entram todas e a afim só ocupa o que
       * sobra, na ordem natural.
       *
       * O número comparado é o tamanho DECLARADO da gaveta (`r.claims`) e não
       * quantas dela casaram a pergunta: com o segundo, `ordem-exercicio` (29
       * claims, 17 casando, 17 vagas) dava empate e a regra se desligava
       * justamente no caso que a motivou.
       */
      const tetoAfim = f.r.claims > cota ? Math.ceil(cotaAfim * cota) : cota;
      let escolhido = -1;
      let adiado = -1;
      for (let k = 0; k < f.fila.length; k += 1) {
        const x = f.fila[k];
        if (acumulado.has(x.c.id)) {
          // Já está na tela por outra gaveta: registra o cruzamento e some da
          // fila desta, porque ela não ocupa vaga duas vezes.
          const a = acumulado.get(x.c.id);
          if (!a.topicos.includes(f.r.topico)) {
            const rel = f.topo > 0 ? x.score / f.topo : 0;
            a.score += rel;
            a.topicos.push(f.r.topico);
            if (x.casou.length > a.casou.length) a.casou = x.casou;
          }
          f.fila.splice(k, 1);
          k -= 1;
          continue;
        }
        if (x.comoEntrou === 'afim' && f.afins + 1 > tetoAfim) {
          if (adiado < 0) adiado = k;
          continue;
        }
        escolhido = k;
        break;
      }
      if (escolhido < 0) escolhido = adiado;
      if (escolhido < 0) {
        f.fila.length = 0;
        continue;
      }
      const x = f.fila[escolhido];
      f.fila.splice(escolhido, 1);
      const rel = f.topo > 0 ? x.score / f.topo : 0;
      acumulado.set(x.c.id, {
        c: x.c,
        score: rel,
        topicos: [f.r.topico],
        casou: x.casou,
        ordem: ocupadas,
      });
      f.tomou += 1;
      if (x.comoEntrou === 'afim') f.afins += 1;
      ocupadas += 1;
      mexeu = true;
    }
  }

  /**
   * ── A ORDEM DA TELA É A ORDEM DO RODÍZIO, e não o score global ────────────
   *
   * Este é o segundo meio-conserto que a onda anterior teria feito. Dar 11 vagas
   * a `dor` e depois ordenar a tela pelo score global devolve as 11 nas posições
   * 29ª a 40ª: dentro do teto e fora da leitura. Medido na pergunta da fisgada,
   * com as vagas já corrigidas e a ordem ainda global — V079-34 saía em 29º e
   * V001-06 em 35º, e o canal do ledger, que se ancora nas primeiras da tela,
   * nunca via nenhuma das duas.
   *
   * A ordem do rodízio é `1ª de cada gaveta, 2ª de cada gaveta, …`, com as
   * gavetas na ordem do score da rota. O topo da tela passa a ser *o melhor de
   * cada gaveta que o roteador abriu*, que é a coisa que o leitor precisa ver
   * primeiro quando três gavetas diferentes reivindicam a pergunta.
   *
   * O `score` continua sendo calculado e continua saindo no objeto — ele é o que
   * soma quando a claim está em duas gavetas roteadas —, mas ele deixou de
   * DECIDIR quem aparece e em que ordem.
   */
  /**
   * ── A ORDEM DA TELA ──────────────────────────────────────────────────────
   *
   * Quem ENTRA é decidido pelas vagas; a ORDEM é decidida pelo score RELATIVO
   * dentro da gaveta, somado sobre as gavetas que ofereceram a claim.
   *
   * Duas coisas caem daí, e as duas foram medidas:
   *
   *   · o topo da tela vira *a melhor de cada gaveta aberta* — todas as
   *     primeiras colocadas empatam em 1,00 e o desempate é a ordem do rodízio.
   *     É a propriedade 1 aparecendo na leitura e não só no total: `dor` abriu
   *     em 3º na pergunta da fisgada e a claim dela sai em 3º, não em 29º;
   *   · **a claim que está em DUAS gavetas roteadas soma duas parcelas e sobe.**
   *     É o sinal mais forte desta camada e ele quase se perdeu nesta onda: com
   *     a ordem do rodízio puro, V170-34 (*supinar seis dias por semana*, que é
   *     de `frequencia` E de `supino`) caía de 4º para 11º no caso Q05.
   *
   * O peso da rota AO QUADRADO saiu do score e virou o que sempre deveria ter
   * sido: ele decide quantas VAGAS a gaveta leva (`vagasPorGaveta`), não a
   * posição de cada claim. Usar o mesmo número para as duas coisas era o que
   * fazia a gaveta secundária aparecer inteira no rodapé da tela.
   */
  const claims = [...acumulado.values()]
    .sort((a, b) => b.score - a.score || a.ordem - b.ordem);
  return { claims, vagas };
}

/**
 * ── O LEDGER, E ELE É O ÚNICO CANAL QUE NÃO CASA PALAVRA NENHUMA ─────────────
 *
 * Toda claim desta base carrega `conditions` e `conflicts`: os ids que
 * CONDICIONAM aquela prescrição e os que a CONTRADIZEM, escritos na extração,
 * conferidos pelo `check-claims.mjs`, tipados. É a única coisa nesta base que já
 * é um grafo, e até 12/08/2026 a recuperação não a lia.
 *
 * O caso que obriga, e ele é o mais caro deste atleta:
 *
 *   V079-34 — *"2 a 3 numa escala de 10 é uma boa faixa para empurrar na
 *   reabilitação"* — declara `conditions: V079-39, V027-23, V086-21` e
 *   `conflicts: V027-25`. V027-23 é *"lesões menores acabam sendo movimentadas
 *   mais do que deveriam, porque é fácil treinar através delas"* e V086-21 é
 *   *"pode ser aceitável, MAS os sintomas precisam estar melhorando ao longo do
 *   tempo"*.
 *
 * V086-21 não compartilha UMA palavra com a pergunta da fisgada. Nenhuma
 * ordenação por texto — nem a global, nem a de dentro do tópico — pode alcançá-la,
 * e nenhuma alocação de vaga conserta isso, porque não é vaga que falta: é
 * caminho. O caminho existe, tipado, e está escrito na claim que JÁ está na tela.
 *
 * E a razão é de segurança, não de placar: **uma prescrição que chega à tela sem
 * a condição que a desarma é a forma perigosa de acertar.** Dizer a um atleta com
 * histórico de ruptura de peitoral que 2–3/10 de dor é faixa boa para empurrar,
 * sem dizer que lesão menor é justamente a que se treina através demais, é pior
 * do que não responder.
 *
 * É a mesma família da `página ao lado` — trazer o que completa o que já saiu — e
 * por isso sai como canal PRÓPRIO, com cota própria e etiqueta própria: canário
 * que exige um id tem de poder cobrar por qual porta ele entrou.
 */
export const TETO_LIGACAO = 8;

/**
 * ── O FOCO DO LEDGER É A PRESCRIÇÃO, E SÓ ELA ───────────────────────────────
 *
 * Das 6.912 claims, 543 declaram `conditions` ou `conflicts`. Apontar o canal
 * para todas as que chegam à tela gasta o orçamento com o que não machuca: uma
 * claim de `mecanismo` sem a condição dela é uma explicação incompleta, e uma
 * de `prescricao` sem a condição dela é uma ORDEM incompleta.
 *
 * Medido na pergunta da fisgada, com 6 vagas: com foco em toda a tela, as vagas
 * vão para as condições de V020-24 (uma `opiniao`) e V086-21 e V138-19 — as duas
 * que faltavam ao atleta — ficam de fora por dois lugares. Com o foco na
 * prescrição, as duas prescrições da tela (V079-34 e V001-06) cobrem as suas
 * quatro ligações cada uma e as cinco claims do limiar de dor chegam.
 *
 * É a mesma regra do `check-answer.mjs` e do gate de dor: o que se cobra de uma
 * PRESCRIÇÃO é diferente do que se cobra de uma descrição.
 */
export const MODO_QUE_PUXA_LIGACAO = 'prescricao';

/** Quantas ligações cada prescrição do foco pode trazer. `conditions` costuma
 *  ter 2 a 3 ids e `conflicts` 1; 4 cobre a claim inteira sem deixar um foco
 *  comer a cota dos outros — é a mesma regra `porFoco` da vizinhança. */
export const LIGACOES_POR_FOCO = 4;

export function porLigacaoDeclarada(porId, foco, {
  vistos = new Set(), porFoco = LIGACOES_POR_FOCO, teto = TETO_LIGACAO,
} = {}) {
  const jaVi = new Set(vistos);
  const out = [];
  // Em rodadas e não em fila, pela mesma razão medida em `vizinhosNoMesmoSrc`:
  // servir o primeiro foco até o limite faz ele comer o orçamento inteiro.
  for (let rodada = 0; rodada < porFoco && out.length < teto; rodada += 1) {
    for (const f of foco) {
      if (out.length >= teto) break;
      const ligados = [...(f.conditions ?? []), ...(f.conflicts ?? [])];
      const meus = ligados.filter((id) => porId.has(id) && !jaVi.has(id));
      if (meus.length === 0) continue;
      const id = meus[0];
      jaVi.add(id);
      out.push({
        c: porId.get(id),
        deQuem: f.id,
        vinculo: (f.conditions ?? []).includes(id) ? 'condição de' : 'conflita com',
      });
    }
  }
  return out;
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
  topicos, glossario = null, vocabulario = [], idx = null, perfis = null,
  piso = PISO_ROTA, max = MAX_TOPICOS, teto = TETO_ROTEADO, porTopico = null, forcar = [],
  /**
   * A CALIBRAÇÃO DA ALOCAÇÃO ENTRA POR AQUI, e só a bancada de medição
   * (`research/tools/medir-vagas.mjs`) usa isto. Existe porque escolher os
   * números por gosto é o que esta casa proíbe: os quatro foram varridos contra
   * os 19 canários de `ROTAS.json` e os 34 de `CANARIOS.json`, e a varredura
   * está no `RECUPERACAO.md` §22. Nenhuma trava passa este parâmetro — trava que
   * escolhe a própria constante não mede nada.
   */
  vagas = {},
  /** Idem, para o orçamento de cada canal da tela. Só a bancada passa isto. */
  canais = {},
} = {}) {
  const orcamento = {
    rota: Math.round(teto * FRACAO_DA_ROTA),
    ligacao: VAGAS_DA_LIGACAO,
    lado: DETALHE_ROTEADO,
    ...canais,
  };
  const indice = idx ?? indexar(claims);
  const perfil = perfis ?? perfilarTopicos(claims);
  const bruto = rotear(perfil, pergunta, { topicos, glossario, vocabulario, piso, max });
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
    porTopicoResultado.push({ ...r, resultados: lista, afins: conjunto.afim.size });
  }

  /**
   * ── AQUI ESTAVA O SOTERRAMENTO ────────────────────────────────────────────
   *
   * Até 11/08/2026 este ponto do arquivo despejava as listas de todas as gavetas
   * num acumulador só, ordenava pelo score global e cortava em `teto`. O peso da
   * rota AO QUADRADO — que continua existindo, agora só como ORDEM da tela —
   * não impedia nada: `agacho` tem 990 bilhetes na rifa e `ordem-exercicio` tem
   * 29, e o corte por ranking global é a rifa.
   *
   * `alocarVagas` troca o ranking global por VAGA POR GAVETA, e é ele que
   * responde às três propriedades: piso por gaveta aberta, divisão por
   * `score × surpresa do tamanho`, e vaga como TETO — a sobra não volta ao bolo,
   * e é por isso que a tela agora encolhe quando não há o que dizer.
   */
  /**
   * A GAVETA FORÇADA LEVA A TELA INTEIRA. Quem digitou `--topic cinto` pediu a
   * gaveta, e os outros três canais viram complemento de uma coisa que já foi
   * escolhida — é a mesma assimetria dos afins.
   */
  const forcado = rota.rotas.some((r) => r.forcado);
  const alocarCom = (vagasDaRota) => alocarVagas(porTopicoResultado, {
    teto: vagasDaRota,
    piso: PISO_VAGAS,
    cotaAfim: COTA_AFIM,
    nDaBase: claims.length,
    ...vagas,
  });
  /**
   * ── E A DIVISÃO SÓ VALE PARA A TELA PADRÃO ────────────────────────────────
   *
   * `FRACAO_DA_ROTA` reparte as 40 vagas da tela entre os quatro canais. Abaixo
   * disso não há o que repartir: um canário que pede `tetoDeTela: 2` está
   * perguntando *"quais são as duas primeiras"*, e a resposta é as duas
   * primeiras do canal principal, não uma delas mais uma reserva vazia para um
   * ledger que não cabe. Com o teto pequeno, a rota leva tudo.
   */
  const orcamentoDaRota = forcado || teto < TETO_ROTEADO
    ? teto
    : Math.min(teto, orcamento.rota);

  /**
   * ── OS TRÊS CANAIS DE COMPLEMENTO, MONTADOS A PARTIR DO QUE A ROTA DEVOLVEU ─
   *
   * Fechados numa função porque eles são calculados DUAS vezes: ver o segundo
   * passe logo abaixo.
   */
  const montarCanais = (claimsRoteadas) => {
    const params = porNomeDeParam(claims, indice, perfil, pergunta, {
      teto: TETO_PARAM,
    });

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
    /**
     * ── O ORÇAMENTO DO VIZINHO ACOMPANHA A TELA ──────────────────────────────
     *
     * `teto: DETALHE_ROTEADO` fixo era uma tela cheia entrando pela porta dos
     * fundos: numa pergunta cuja resposta roteada tem TRÊS claims, oito vizinhos
     * mais doze de param devolviam 23 linhas para uma pergunta de sim/não. O
     * vizinho existe para completar o que saiu; ele não pode ser maior do que o
     * que saiu.
     */
    /**
     * ── O FOCO CONTINUA SENDO AS OITO PRIMEIRAS, E ISSO FOI RE-MEDIDO ────────
     *
     * Alargar o foco para a tela inteira foi tentado nesta onda, com o argumento
     * de que `vizinhosNoMesmoSrc` disputa a vaga por DISTÂNCIA e portanto foco
     * largo só acrescenta candidato melhor. **A medição desmentiu o argumento:**
     * com 24 focos há mais candidatos de distância 1 do que vagas, e o desempate
     * passa a ser a ordem do foco — o T05 perdia V003-18 e V074-24, que são
     * exatamente os dois ids que o `viaPaginaAoLado` do ROTAS.json cobra por
     * canal. Recall de 58 contra 57 e a página ao lado de 1 de 2 contra 2 de 2:
     * não compensa.
     *
     * O alvo que motivou a tentativa (G016-10 na B11, que casa UMA palavra da
     * pergunta e mora ao lado de G016-09) continua fora da tela, e está declarado
     * como falha aberta no `RECUPERACAO.md` §22.
     */
    const vizRoteado = vizinhosNoMesmoSrc(
      claims,
      claimsRoteadas.slice(0, DETALHE_ROTEADO).map((x) => x.c),
      {
        vistos: naTela,
        /**
         * DOIS POR FOCO, e o 2 é consequência da tela ter encolhido. Com a rota
         * ocupando 40 vagas, a claim de ANTES do foco quase sempre já estava na
         * tela e o único vizinho novo era a de depois; com 24, as duas são novas e
         * `porFoco: 1` escolhe uma por desempate de id — o T05 passava a devolver
         * V003-16 no lugar de V003-18, que é o id que o `viaPaginaAoLado` cobra.
         * O desempate certo era outro e foi para `busca.mjs`: entre a página
         * anterior e a seguinte, a SEGUINTE é a que completa.
         */
        porFoco: 1,
        teto: Math.min(orcamento.lado, claimsRoteadas.length),
        raio: 2,
      },
    );
    const vizParam = vizinhosNoMesmoSrc(
      claims,
      params.lista.map((x) => x.c),
      {
        vistos: new Set([...naTela, ...vizRoteado.map((v) => v.c.id)]),
        porFoco: 1,
        /**
         * O LADO DO PARAM MANTÉM O ORÇAMENTO CHEIO (`TETO_PARAM`), e não o do
         * canal de rota (`DETALHE_ROTEADO`). O motivo está medido no T04: V033-05 — *3 % são 25 lb
         * para mim* — é a claim ao lado de V033-04, que é a 10ª linha do canal de
         * param. Um orçamento de 8 vizinhos nunca chega ao 10º foco, e o número
         * que traduz a porcentagem em quilos some da tela.
         */
        teto: Math.min(TETO_PARAM, params.lista.length),
        raio: 2,
      },
    );
    /**
     * O LEDGER SAI DEPOIS DOS VIZINHOS e antes de mais nada: ele é o canal que
     * não casa palavra nenhuma, e o `vistos` acumulado impede que ele repita o que
     * as outras três portas já trouxeram. O foco é o TOPO da tela — as claims que
     * o leitor vai de fato ler inteiras.
     */
    const ligacoes = porLigacaoDeclarada(
      new Map(claims.map((c) => [c.id, c])),
      claimsRoteadas.map((x) => x.c).filter((c) => c.modo === MODO_QUE_PUXA_LIGACAO),
      {
        vistos: new Set([
          ...naTela, ...vizRoteado.map((v) => v.c.id), ...vizParam.map((v) => v.c.id),
        ]),
        porFoco: LIGACOES_POR_FOCO,
        teto: Math.min(TETO_LIGACAO, orcamento.ligacao, Math.max(1, claimsRoteadas.length)),
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
    /**
     * ── O LEDGER VIAJA NA MESMA LISTA DOS VIZINHOS, e isso é decisão de contrato ─
     *
     * Ele PODIA sair num campo novo, e sair num campo novo teria sido o erro mais
     * caro desta onda: quem conta a tela é o `telaDe()` do `check-canarios.mjs` e
     * o `check-rotas.mjs`, e os dois enfileiram `claims`, `params.lista` e
     * `vizinhos`. Um campo `ligacoes` que ninguém enfileira é conteúdo calculado,
     * impresso e **invisível para toda medição** — que é exatamente o defeito que
     * esta onda existe para consertar, cometido de novo com outro nome.
     *
     * As três portas já se distinguem por `canal`, e o `viaPaginaAoLado` do
     * ROTAS.json já cobra `canal === 'rota'` por nome. `ligacao` entra como a
     * terceira etiqueta, e continua cobrável separadamente.
     */
    /**
     * E O LEDGER VEM PRIMEIRO DENTRO DA LISTA. A ordem aqui decide quem sobrevive
     * ao corte de 40 quando os quatro canais somam mais do que isso, e o canal que
     * carrega a CONDIÇÃO DE UMA PRESCRIÇÃO é o último que pode ser cortado. Os
     * outros dois completam; este desarma.
     */
    const vizinhos = [
      ...ligacoes.map((v) => ({ ...v, canal: 'ligacao' })),
      ...vizParam.map((v) => ({ ...v, canal: 'param' })),
      ...vizRoteado.map((v) => ({ ...v, canal: 'rota' })),
    ];
    return { params, vizinhos };
  };

  const alocado = alocarCom(orcamentoDaRota);
  const canaisDaTela = montarCanais(alocado.claims);
  const claimsRoteadas = alocado.claims;
  const { params, vizinhos } = canaisDaTela;
  for (const t of porTopicoResultado) t.vagas = alocado.vagas.get(t.topico) ?? 0;

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

  return {
    pergunta,
    ...rota,
    porTopico: porTopicoResultado,
    claims: claimsRoteadas,
    params,
    vizinhos,
    ligacoes: vizinhos.filter((v) => v.canal === 'ligacao'),
    vagas: alocado.vagas,
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
