/**
 * Os enumerados fechados do SCHEMA.md e o carregador do extract, num lugar só.
 *
 * Eles moraram dentro do `check-claims.mjs` enquanto ele era o único que
 * precisava deles. Deixou de ser: `check-canarios.mjs` também precisa validar
 * `frame`, `topic` e `modo` — porque um canário com typo no filtro fica em zero
 * para sempre, e "zero" é exatamente o resultado que ele reporta como sucesso.
 * Um predicado com typo é um canário morto que se declara vivo.
 *
 * Copiar as listas para o segundo arquivo repetiria o defeito que o próprio
 * SCHEMA.md documenta na abertura: enumerado crescendo em um lugar enquanto o
 * outro descreve outra coisa, em silêncio, por meses. Então elas moram aqui e
 * todo mundo importa daqui.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SOURCES, paths } from './sources.mjs';

export const TIERS = new Set(['R', 'E', 'L', 'I', 'U', 'O']);
export const SCOPES = new Set(['GERAL', 'PESSOAL']);
export const CERTAINTY = new Set(['explicit', 'implied']);

/**
 * `modo` — QUE TIPO de afirmação é, ortogonal a `scope`. Estava no SCHEMA.md
 * desde o começo e nunca teve trava: durante toda a extração do Blevins, 1.819
 * claims gravaram `modo` sem nada conferir se o valor pertencia à lista. Um
 * `prescrição` acentuado ou um `prescription` em inglês teria passado, e a
 * consulta que mais importa — filtrar o que pode virar programa — devolveria
 * menos do que existe, sem uma linha de reclamação.
 */
export const MODOS = new Set([
  'prescricao', 'opiniao', 'mecanismo', 'fato', 'estudo', 'anedota', 'narrativa',
  // Ver ENUMERADOS.md para o registro da decisão. Em resumo: metade do corpus do
  // Blevins é ele descrevendo o programa DE OUTRA PESSOA (5/3/1, Candito, PHUL,
  // StrongLifts) ou corrigindo a técnica de um desconhecido a partir de um vídeo
  // enviado. Sem estes dois valores, as duas coisas caem em `prescricao`, e
  // `prescricao` é o único modo que pode virar treino. Um consumidor filtrando
  // `scope: GERAL` + `modo: prescricao` receberia "o nSuns manda AMRAP a 95 % do
  // training max" como se fosse o Blevins mandando você fazer isso.
  'relato-de-programa',
  'avaliacao-de-terceiro',
]);

/**
 * `genero` — QUE TIPO DE VÍDEO é, declarado no manifesto, um valor por vídeo.
 *
 * Existe porque `relato-de-programa` e `avaliacao-de-terceiro` estavam
 * pendurados na gaveta errada. O discriminador dos dois NÃO é o texto da claim:
 * `G028-02` é "Manter a cabeça em posição mais neutra e para cima no
 * agachamento", indistinguível de prescrição geral para quem lê o JSONL — e o
 * agente lê o JSONL. O discriminador é uma propriedade do VÍDEO: aquilo é um
 * *Form Assessment Saturday*, o conselho foi calibrado para o corpo de um
 * desconhecido, e quem sabia disso era o manifesto do canal. Dezoito agentes
 * dependeram de lembrar de abri-lo, e traçaram dezoito linhas: as 562 claims
 * nessas duas gavetas não são reproduzíveis. Ver `research/kb/GENERO.md`.
 *
 * O enumerado é maior que os três valores sugeridos no `ESTADO.md`
 * (`review-de-programa | form-check | vlog`) pelo motivo de sempre nesta casa:
 * **enumerado curto empurra o dado para fora da trava**. `vlog` sozinho teria
 * que engolir log de sessão, filmagem de meet, oferta de coaching, Q&A e clipe
 * de PR — cinco coisas cujo único traço comum é "não é aula" —, e a primeira
 * pergunta que alguém faz à base ("o que ele diz na plataforma?") não teria
 * como ser feita.
 *
 * A ASSIMETRIA DE ATRIBUIÇÃO, que é a regra mais importante daqui: os três
 * gêneros restritos (abaixo) são os únicos que ligam trava. Marcar de menos
 * neles custa o status quo — nenhuma trava, que é onde a base já estava.
 * Marcar de mais custa uma trava FALSA sobre claim legítima, e trava errada é
 * pior do que trava ausente. Então, na dúvida entre um gênero restrito e
 * qualquer outro, escolha o outro; e onde o título não decide nada, use
 * `indeterminado` em vez de chutar.
 */
export const GENEROS = new Set([
  /** O autor ensina o próprio método: didático, tutorial, tese, tier list. */
  'aula',
  /** O assunto principal é o método DE OUTRA PESSOA — 5/3/1, nSuns, Cube, PHUL,
   *  o livro de outro, o programa que uma IA escreveu. O imperativo que aparece
   *  aqui é do autor do programa, não de quem está falando. */
  'review-de-programa',
  /** Análise da execução de OUTRA pessoa, a partir do vídeo que ela enviou
   *  (a série *Form Assessment Saturday*). O contexto que justifica o conselho é
   *  o corpo dela, e quem lê a base não tem esse contexto. */
  'form-check',
  /** Aconselhamento dirigido a UM praticante nomeado (as *Coaching Call*). Mesma
   *  família do `form-check` — conselho calibrado para um caso —, nome
   *  diferente porque não é a execução que está sendo avaliada, é o programa
   *  dele. Sem esta gaveta o vídeo cairia em `aula`, que é a leitura perigosa. */
  'coaching-call',
  /** O que aconteceu no treino/no dia dele: vlog de sessão, prep em vlog, full
   *  day of eating, análise do PRÓPRIO vídeo. */
  'log-de-treino',
  /** Competição: recap de meet, filmagem de plataforma, mock meet. */
  'competicao',
  /** Ele responde perguntas do público. Não restringe — a resposta costuma ser
   *  generalizável —, mas é a fronteira mais próxima dos três restritos, e a
   *  gaveta existe para que dê para revisar isso por consulta um dia. */
  'perguntas',
  /** Anúncio de canal, oferta de coaching, lançamento de produto/app. */
  'institucional',
  /** Filmagem curta sem prosa: PR de academia, compilação, filmagem de
   *  terceiro sem comentário metodológico. */
  'clipe',
  /** O título não decide e ninguém reabriu o vídeo. **É um valor legítimo e
   *  final**, não um buraco: gênero chutado vira trava errada, e trava errada é
   *  pior do que trava ausente. */
  'indeterminado',
]);

/**
 * Os gêneros em que `modo: prescricao` é suspeito — o material é de outra
 * pessoa, ou calibrado para uma pessoa específica.
 *
 * A trava correspondente em `check-claims.mjs` MEDE, não reprova: é uma catraca
 * por `src`, com o teto no número de violações do dia em que foi ligada, e o
 * teto só desce. Reprovar de saída derrubaria o build sobre 76 claims que já
 * existem, e a rodada que ligou a trava não tinha permissão de editar claim.
 *
 * **O piso da catraca não é necessariamente zero.** Sobra prescrição legítima
 * nesses vídeos — o conselho do próprio autor sobre adotar um programa alheio, o
 * padrão técnico universal que ele enuncia no meio de um form check. O que a
 * catraca garante é que cada uma que ficar tenha sido olhada, e que nenhuma nova
 * entre sem alguém abaixar um número à mão.
 */
export const GENEROS_SEM_PRESCRICAO = new Set(['review-de-programa', 'form-check', 'coaching-call']);

/**
 * `ref` do vídeo → `genero`, lido dos manifestos de todas as fontes.
 *
 * Mora aqui, e não copiado dentro de cada ferramenta, pelo motivo da abertura
 * deste arquivo: `check-claims.mjs` e `check-evidence.mjs` precisam da mesma
 * resposta, e duas leituras do manifesto divergem em silêncio. Fonte sem
 * manifesto (o regulamento da IPF, `kind: 'normativo'`) simplesmente não
 * contribui — claim `tier: O` não vem de vídeo e não tem gênero.
 */
export function carregarGeneroPorRef(root) {
  const porRef = new Map();
  for (const src of Object.values(SOURCES)) {
    const file = paths(src, root).manifest;
    if (!existsSync(file)) continue;
    for (const v of JSON.parse(readFileSync(file, 'utf8')).videos ?? []) {
      porRef.set(v.ref, v.genero ?? null);
    }
  }
  return porRef;
}

/**
 * Devolve uma cópia do vídeo do manifesto com `genero` gravado logo depois de
 * `title` — que é onde ele é lido: quem abre o manifesto para conferir um gênero
 * está olhando para o título.
 *
 * ── POR QUE ISTO É UMA FUNÇÃO, E TESTADA ────────────────────────────────────
 *
 * A primeira versão morava embutida no `seed-genero.mjs` e tinha um defeito que
 * desligava o seed inteiro sem uma linha de reclamação:
 *
 *     for (const [k, val] of Object.entries(v)) {
 *       out[k] = val;                              // ← quando k === 'genero',
 *       if (k === 'title') out.genero = r.genero;  //   copia o valor VELHO por
 *     }                                            //   cima do recém-derivado
 *
 * No manifesto, `genero` vem logo DEPOIS de `title`. Então, para todo vídeo que
 * já tivesse a chave — inclusive com o `genero: null` que o `build-manifest.mjs`
 * escreve numa reconstrução —, o valor derivado era sobrescrito pelo antigo. O
 * script contava a mudança, imprimia "354 de 551 vídeos receberam gênero" e
 * "→ manifesto escrito", e gravava o arquivo inalterado. Duas consequências, e a
 * segunda é a cara:
 *
 *   - `--refresh` nunca re-derivou nada, ao contrário do que o cabeçalho do
 *     script e o `GENERO.md` §4 prometiam.
 *   - o conserto que o `verify-manifest.mjs` manda fazer quando acha vídeo sem
 *     gênero ("rode `seed-genero.mjs`") não funcionava justamente no caso em que
 *     é preciso — manifesto reconstruído —, e dizia que tinha funcionado. Trava
 *     vermelha para sempre com o conserto documentado não funcionando é como se
 *     desliga uma trava: alguém apaga a checagem.
 *
 * O `--dry` que a auditoria anterior usou como prova de reprodutibilidade não
 * podia pegar isto: ele compara valor derivado com valor no arquivo e nunca
 * passa pelo caminho da escrita.
 */
export function comGenero(video, genero) {
  const out = {};
  for (const [k, val] of Object.entries(video)) {
    // A chave antiga é PULADA, não copiada: é ela que voltava por cima.
    if (k === 'genero') continue;
    out[k] = val;
    if (k === 'title') out.genero = genero;
  }
  // Manifesto sem `title` (não deveria existir, mas o campo é do yt-dlp): o
  // gênero vai para o fim em vez de sumir.
  if (!('genero' in out)) out.genero = genero;
  return out;
}

/**
 * Enumerado fechado, mas não pequeno por esporte: faltar gaveta é pior do que
 * ter gaveta demais. Sem `semanas` e `contagem`, o primeiro lote escreveu os
 * números por extenso para não inventar frame — a trava empurrou o dado para
 * fora da trava, que é o oposto do que ela existe para fazer.
 *
 * `mm` e `m` entraram com o regulamento: a IPF mede equipamento em milímetro e
 * metro (13 mm de cinto, 1 m de faixa de punho). Sem essas duas gavetas, 13 mm
 * viraria 1,3 cm na conversão do agente — que é exatamente o erro de unidade que
 * o enumerado existe para barrar.
 */
export const FRAMES = new Set([
  '1RM_treino', '1RM_legal', 'TM', 'pct_TM', 'pct_1RM',
  'RPE', 'RIR', 'kg', 'lb', 'reps', 'series', 'pct', 'cm',
  'seg', 'min', 'horas', 'dias', 'semanas', 'meses', 'anos', 'x_semana',
  'contagem', 'idade', 'DOTS',
  'g', 'kcal', 'ml', 'graus', 'bpm', 'pct_FCmax', 'mmHg', 'g_por_kg', 'g_por_lb',
  'polegadas', 'escala_dor', 'n_amostra', 'IMC',
  'mm', 'm',

  // ── Ampliação de 2026-08-09, antes do passe que preenche `modo` e
  // `conditions` em 6.909 claims. Justificativa completa em ENUMERADOS.md; o
  // resumo de cada uma está aqui porque é aqui que o próximo agente vai olhar.

  /** % de um XRM que NÃO é 1RM ("85 % do seu 5RM"). Mesma forma de `pct_1RM`,
   *  dose completamente diferente: confundir os dois é o bug dos 215 kg outra
   *  vez. Exige o param companheiro `xrm_base` dizendo qual é o X. */
  'pct_XRM',
  /** Dígito que identifica POSIÇÃO numa sequência e não mede quantidade:
   *  semana 3, bloco 2, onda 1, tentativa 2, tier 2. Sem esta gaveta os lotes
   *  escreveram "fase um" por extenso (G019-12/13/23) para fugir da trava —
   *  ou, pior, gravaram a posição como duração (`semanas`). */
  'ordinal',
  /** Dígito que faz parte de um NOME: 5/3/1, 5x5, Ph3, T1. Não mede nada, não
   *  soma, não converte. Foi a falta desta gaveta que fez `G019-20` declarar
   *  `series: 5` e `reps: 5` para a frase "o StrongLifts 5x5 traz menos terra",
   *  que não prescreve série nenhuma — a trava fabricando a medida que ela
   *  existe para proteger. */
  'rotulo',
  /** Escala subjetiva arbitrária 0–10 que não é dor nem RPE ("foco 2 de 10").
   *  `escala_dor` continua separado: é instrumento clínico com significado
   *  próprio, e fundir os dois perderia isso. */
  'escala_subjetiva',
  /** A unidade do *stress index* (Tuchscherer/Bromley): ~1 série dura em RPE
   *  8–9. É magnitude de verdade — soma, compara, tem banda alvo —, e não tem
   *  nenhuma outra gaveta onde caiba sem virar `contagem` de coisa nenhuma. */
  'indice_estresse',
  /** Hora do relógio, que NÃO é duração. `V171-32` gravou "dormir das 22 h às
   *  6 h" com frame `horas`, e "6" com frame de duração se lê como seis horas
   *  de sono. Dois dos params já traziam `unit: "hora do dia"` — o agente
   *  documentou o empréstimo por escrito porque não tinha para onde ir. */
  'hora_do_dia',
  'grau_C', 'grau_F',   // temperatura. `graus` é ÂNGULO e continua sendo.
  'l',                  // litro. `V112-22` gravou "meio litro" como `kg`.
  'xicara',             // medida culinária. Alternativa era o agente converter para ml — e conversão de agente é o que este enumerado existe para impedir.
  'pes',                // pé/ft. Mesma razão: sem a gaveta, o agente converte para cm sozinho.

  // ── Ampliação de 2026-08-09 (onda 2), no passe que moveu os 52 params em
  // gaveta errada. Justificativa em ENUMERADOS.md §7; a lista de origem sai de
  // `node research/tools/params-gaveta-errada.mjs`.

  /** Ano do CALENDÁRIO — 2019, 2024, 2025. Não é duração (`anos`) e não é
   *  contagem: "2019" com frame `anos` se lê como dois mil e dezenove anos, e
   *  qualquer aritmética de duração sobre ele é lixo. Seis params da base
   *  estavam assim (`V013-16`, `V019-02`, `V122-01`, `V152-24`, `V175-08`,
   *  `V175-40`), e dois deles moram na mesma claim que uma duração de verdade
   *  — que é como a confusão passa despercebida. */
  'ano_calendario',

  /** Índice ADIMENSIONAL cujo significado mora na prosa da claim: BRI (índice
   *  de redondeza corporal, faixa saudável 4,5–5,5) e R² (0–1). Cinco params
   *  estavam em `pct`, e um R² de 0,9 lido como 0,9 % é errado por duas ordens
   *  de grandeza. NÃO tem escala fechada de propósito: BRI e R² são
   *  adimensionais em faixas diferentes, e uma escala única aqui reprovaria um
   *  dos dois. */
  'indice_adimensional',

  // TAXA — "algo por período". Família que a lista à mão do ESTADO.md não tinha
  // e que o detector encontrou: 19 params gravavam `4 h/semana` como `4` com
  // frame `horas`, ao lado de `treino de 3 h` gravado como `3` com frame
  // `horas`. O `/semana` morava só no `unit`, que é texto livre; o `frame`, que
  // é o que o consumidor lê, dizia "duração". Duas semânticas, mesma gaveta —
  // o bug dos gramas em `kg`, outra vez.
  //
  // Uma gaveta por par unidade×período, e não um `taxa` genérico, pelo motivo
  // de sempre: um frame que diz só "por semana" volta a achatar 4 h/semana,
  // 4 sessões/semana e 4 lb/semana. E `horas_semana` convive com `min_semana`
  // pela mesma razão que `horas` convive com `min` — converter é trabalho de
  // conversor declarado, não de quem extrai. O sufixo segue o `x_semana` que já
  // existia.
  'horas_semana',       // V005-06/09, V006-15/16, V013-27, V019-28, V044-14
  'horas_dia',          // V019-31
  'min_semana',         // V013-09, V048-03/04/05
  'min_dia',            // V044-15
  'lb_semana',          // V081-26 — ganho de peso corporal por semana
  /** MET-minutos por semana: volume de atividade física da epidemiologia, não
   *  duração. `V102-25` gravava 12200 com frame `min` — 203 horas por semana,
   *  que não cabe numa semana. A claim está `suspect: true` e o número segue
   *  sendo do passe de Whisper; a gaveta só impede que ele seja lido como
   *  tempo enquanto isso. */
  'MET_min_semana',
]);

/**
 * Frames de DOSE — os que fazem uma prescrição virar treino de verdade.
 *
 * Serve à checagem que o SCHEMA.md prometia desde o primeiro dia e que nunca
 * existiu: prescrição com dose e sem `conditions` é o defeito mais grave que a
 * auditoria de escopo encontrou ("supino 6× por semana" extraído sem "nunca
 * acima de RPE 5"). Separada da condição, a prescrição não fica incompleta —
 * fica perigosa, porque parece completa.
 *
 * `escala_dor` entrou em 2026-08-09, e o motivo é o modo de falha nº 2 desta
 * casa — a trava estreita empurra o dado para FORA dela. A lista nasceu pensando
 * em carga, série e frequência, e por isso o pior cluster da base passou limpo
 * por ela: `V001-06` ("2 de 10 é a carga de trabalho aproximadamente certa") e
 * `V079-34` ("2 a 3 de 10 é uma boa faixa para empurrar") são prescrição com
 * dose e sem condição, mas a dose está numa escala de DOR, e a checagem não
 * enxergava esse frame. Duas claims dirigidas a um peitoral em reexposição,
 * exatamente o defeito que este conjunto existe para acusar, e o build saía
 * verde. Um número que decide quanto doer é dose como qualquer outro.
 * Ver `research/kb/DOR-E-TREINO.md`.
 */
export const FRAMES_DOSE = new Set([
  'series', 'reps', 'x_semana', 'RPE', 'RIR',
  'pct_1RM', 'pct_TM', 'pct_XRM', 'TM', '1RM_treino', '1RM_legal', 'kg', 'lb',
  'escala_dor',
]);

/**
 * Os modos que DESCREVEM o mundo, em oposição aos que entregam um alvo.
 *
 * Existe por causa da trava do número de dor (`check-claims.mjs`), e o desenho
 * é por EXCLUSÃO de propósito. A trava anterior era por inclusão — `modo ===
 * 'prescricao'` — e o pior número da base escapou por ali: `V138-19` ("on the
 * pain scale of 1 to 10 I find the usual level to be around the 2 to four",
 * quatro params em `escala_dor`, topo em 4/10, que é o gatilho de ENCERRAR A
 * SESSÃO do PROGRAMA.md §1.2) está em `opiniao`. A irmã dela, `V079-34`
 * ("Anecdotally, I have found that two to three out of 10 pain level is a good
 * amount to push at"), está em `prescricao`. Mesma frase, mesmo autor, mesma
 * decisão do leitor, gavetas diferentes: a fronteira `prescricao` × `opiniao` é
 * julgamento de extrator, e uma lista de inclusão de dois modos seria desligada
 * pela mesma deriva que produziu o defeito — modo de falha nº 2, a trava
 * estreita empurrando o dado para fora dela.
 *
 * Estes três ficam de FORA da trava, e a exclusão é o conteúdo da decisão:
 * `mecanismo` explica por que algo acontece ("dor é em parte mental",
 * `V138-06`), `fato` diz o que o mundo é, `estudo` narra literatura. Um número
 * de dor dentro deles — *"nociceptores respondem a partir de X"*, *"o protocolo
 * do estudo limitava a 5 de 10"* — descreve, não manda. Varrê-los junto
 * produziria a lista de avisos que ninguém lê, que é o outro jeito de a trava
 * morrer.
 *
 * `pratica-pessoal` não está aqui porque ainda não está em `MODOS`: quando
 * entrar, entra pela porta do `scope: PESSOAL`, que já a tira da trava.
 */
export const MODOS_DESCRITIVOS = new Set(['mecanismo', 'fato', 'estudo']);

// Subconjunto declarado à mão tem de continuar sendo subconjunto. Quando a onda
// 2 mexer em `MODOS`, um valor renomeado aqui viraria trava que nunca casa — e
// trava que nunca casa é indistinguível de trava ausente, em silêncio.
for (const m of MODOS_DESCRITIVOS) {
  if (!MODOS.has(m)) throw new Error(`kb.mjs: MODOS_DESCRITIVOS tem "${m}", que não é modo do enumerado`);
}

/**
 * Frames que carregam ESCALA FECHADA — e o intervalo que a escala admite.
 *
 * `RPE 12` não é um valor alto, é um valor que não existe: a escala vai a 10.
 * A base tinha um, `V033-10`, e ele nasceu de legenda quebrada — "2 and a half
 * to 3 RPE" saiu do ASR como "2 and 12 to 3", e o extrator gravou o `12` como
 * se fosse um RPE. Passou por toda trava porque `12` é um número sintaticamente
 * válido num campo numérico, e é exatamente a mesma família dos gramas gravados
 * como `kg`: o frame existe, o valor não cabe nele, e ninguém pergunta.
 *
 * Os limites são frouxos de propósito. `pct_1RM` vai a 150 e não a 100 porque
 * overload excêntrico e trabalho supramáximo existem; `RIR` vai a 15 porque
 * acessório em rep alta declara RIR alto de verdade. A trava é contra o
 * impossível, não contra o incomum — trava estreita empurra o dado para fora
 * dela, que é o modo de falha nº 2 deste projeto.
 */
export const FRAMES_ESCALA = new Map([
  ['RPE', [0, 10]],
  ['RIR', [0, 15]],
  ['escala_dor', [0, 10]],
  ['pct_1RM', [0, 150]],
  ['pct_TM', [0, 150]],
  ['pct_XRM', [0, 150]],
  ['pct_FCmax', [0, 100]],
]);

/**
 * `suspectWhy` — enumerado fechado desde o PROTOCOLO-EXTRACAO.md, nunca travado.
 *
 * O protocolo fecha em dois valores e escreve o porquê: "é o mesmo passe de
 * reparo com Whisper que resolve os dois, e ele PRECISA SABER O QUE PROCURAR".
 * Sem o campo, `list-suspects.mjs` assume `numero`, e a família `negacao` passa
 * a depender inteiramente de heurística — a marcação de quem leu o trecho é
 * jogada fora. Mesmo padrão do `modo`: caixa alta no documento, zero linha no
 * código, até 2026-08-09.
 */
export const SUSPECT_WHY = new Set(['numero', 'negacao']);

/**
 * O vocabulário de tópicos, lido do PRÓPRIO protocolo.
 *
 * `PROTOCOLO-EXTRACAO.md` diz, em caixa alta, que o vocabulário é FECHADO — e
 * durante toda a extração nada verificou isso. Uma claim usou o tópico `idade`,
 * que nunca existiu na lista, e passou. Regra sem trava é sugestão, e uma gaveta
 * inventada é pior do que parece: sem banco vetorial, `topic` É o mecanismo de
 * recuperação, e um sinônimo solto esconde a claim de quem procura.
 *
 * A lista é lida do markdown em vez de duplicada aqui porque já erramos assim
 * uma vez: o enumerado de `frame` cresceu no código e o SCHEMA.md ficou
 * descrevendo outra coisa. Documento e trava precisam ser o mesmo objeto.
 */
export function carregarTopicos(root) {
  const md = readFileSync(join(root, 'research/kb/PROTOCOLO-EXTRACAO.md'), 'utf8');
  const bloco = /## Vocabulário de tópicos[^\n]*\n[\s\S]*?```\n([\s\S]*?)```/.exec(md);
  if (!bloco) throw new Error('vocabulário de tópicos não encontrado em PROTOCOLO-EXTRACAO.md');
  return new Set(bloco[1].split(/\s+/).filter(Boolean));
}

// ── números: a regra ÚNICA de leitura de dígito ──────────────────────────────
//
// Ela morava duplicada no `check-answer.mjs` e no `check-canarios.mjs`, e as duas
// cópias JÁ tinham divergido: a segunda não sabia separador de milhar (`1.500`
// virava 1,5) nem número por extenso, embora o comentário dela dissesse "mesma
// regra do check-answer.mjs". É o defeito que a abertura do SCHEMA.md descreve —
// duas descrições da mesma coisa afastando-se em silêncio — cometido dentro do
// próprio instrumento que existe para pegá-lo.

/**
 * `1.500` é mil e quinhentos; `1.5` é um e meio; `92,5` é noventa e dois e meio.
 * Sem esta distinção um separador de milhar viraria decimal e a comparação nunca
 * casaria — o falso positivo mais chato possível, porque a resposta ESTÁ certa.
 */
export function paraNumero(bruto) {
  let s = String(bruto).trim();
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
  else s = s.replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export const RX_NUMERO = /\d+(?:[.,]\d+)*/g;

/** Os dígitos do texto, com posição — o lado da RESPOSTA precisa do índice. */
export function numerosCrus(texto) {
  const out = [];
  for (const m of String(texto ?? '').matchAll(RX_NUMERO)) {
    const n = paraNumero(m[0]);
    if (n !== null) out.push({ n, bruto: m[0], idx: m.index });
  }
  return out;
}

const EXTENSO = new Map(Object.entries({
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13,
  quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18,
  dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60,
  setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, mil: 1000,
  meio: 0.5, meia: 0.5, metade: 0.5, dúzia: 12, duzia: 12,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, half: 0.5, dozen: 12, couple: 2,
}));

export function numerosPorExtenso(texto) {
  const out = [];
  const palavras = String(texto ?? '').toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  for (let i = 0; i < palavras.length; i += 1) {
    const v = EXTENSO.get(palavras[i]);
    if (v === undefined) continue;
    out.push(v);
    // "setenta e cinco" / "twenty five": dezena redonda seguida de unidade também
    // é UM número, e é a forma como o ASR escreve percentual falado.
    if (v >= 20 && v <= 90 && v % 10 === 0) {
      const prox = palavras[i + 1] === 'e' ? palavras[i + 2] : palavras[i + 1];
      const u = EXTENSO.get(prox);
      if (u !== undefined && u >= 1 && u <= 9) out.push(v + u);
    }
  }
  return out;
}

/** Tudo o que uma claim pode legitimamente ter emprestado a uma resposta. */
export function numerosDaClaim(c) {
  const alvo = [
    c.claim, c.verbatim, c.verbatimWhisper,
    ...(c.params ?? []).map((p) => String(p.value)),
  ].filter(Boolean).join(' \n ');
  return [...numerosCrus(alvo).map((x) => x.n), ...numerosPorExtenso(alvo)];
}

/**
 * Lê o extract inteiro. JSON quebrado é ignorado aqui de propósito: quem
 * reclama de sintaxe é o `check-claims.mjs`, e uma linha corrompida não pode
 * derrubar a ferramenta que está tentando medir a base.
 */
export function carregarClaims(extractDir) {
  if (!existsSync(extractDir)) return { claims: [], porId: new Map() };
  const claims = [];
  for (const f of readdirSync(extractDir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const linha of readFileSync(join(extractDir, f), 'utf8').split('\n')) {
      if (!linha.trim()) continue;
      try {
        claims.push(JSON.parse(linha));
      } catch {
        /* o check-claims.mjs é quem reclama de JSON quebrado */
      }
    }
  }
  return { claims, porId: new Map(claims.map((c) => [c.id, c])) };
}
