# Ingestão do corpus Garrett Blevins

Relatório de fechamento da segunda fonte da base. Escrito depois de rodar o
compilador na base inteira, de abrir as duas pontas de cada aresta de
contradição registrada pelos seis agentes de extração, e de varrer ativamente os
tópicos onde `research/tools/sources.mjs` diz que o Blevins manda.

O que este documento **não** é: um resumo do que o Blevins ensina. Isso mora nas
claims. Aqui está o que a ingestão fez com a base, o que ela consertou, o que ela
descobriu que estava errado, e — a parte mais importante — o que ela **não**
resolveu.

---

## 1. O que entrou

| | |
|---|---|
| arquivos `G*.jsonl` | 50 (G001–G051, sem G033) |
| claims do Blevins | **1.819** |
| base total depois da ingestão | **6.909** claims em 231 lotes |
| participação do Blevins | 26,3 % (era 0 %) |
| arestas de contradição | 37 confirmadas (51 registradas, 16 removidas, 2 acrescentadas) |
| claims marcadas `suspect` | 20 (16 `numero`, 4 `negacao`) |

Distribuição do lote G: `GERAL` 1.256 / `PESSOAL` 563. Por `modo`: `fato` 466,
`prescricao` 390, `narrativa` 334, `mecanismo` 318, `opiniao` 260, `anedota` 47,
`estudo` 3.

**Aviso de consumo, e é o mais importante desta seção.** 466 das 1.819 claims são
`modo: fato`, e boa parte delas é *descrição de programa de terceiro* — "o Ph3
manda agachar 3x por semana", "o terra do StrongLifts é 1x5". Metade do corpus G
é review de programa alheio. Quem filtrar `scope: GERAL` sem filtrar
`modo: prescricao` vai receber a descrição do programa dos outros com a mesma
autoridade da prescrição do Blevins. **O filtro correto para "o que o Blevins
manda fazer" é `scope: GERAL` + `modo: prescricao`** — 390 claims, não 1.256.
Cinco dos seis relatos de campo levantaram isso de forma independente; é o defeito
de esquema mais consequente que a ingestão expôs, e ele não se conserta com dado,
se conserta com uma gaveta nova em `modo` (algo como `relato-de-programa`).

Datas dos 50 vídeos extraídos: 2016 (13), 2017 (11), 2018 (1), 2022 (2), 2023
(17), 2024 (5), 2025 (1). Isso corrige uma premissa do `sources.mjs`: ele antecipa
que "93 % do canal é de 2013–2018" e que a regra da recência mataria o Blevins nos
empates. Do que de fato foi extraído, **metade é de 2022 em diante**. A triagem já
tinha feito o trabalho. A regra de credencial-primeiro continua certa, mas ela é
menos necessária do que se supunha.

---

## 2. Dois defeitos estruturais consertados antes de qualquer análise

### 2.1 O esquema de id estava rachado ao meio — normalizado para `G0XX-NN`

Os seis agentes se dividiram: G001–G027 escreveram `G001-01`; G028–G051
escreveram `VG028-01`. Duas convenções vivas no mesmo corpus, 702 ids do lado
errado.

Isso não era questão de gosto. O `check-evidence.mjs` — a ferramenta que o
protocolo manda usar para resolver citação — filtra id por `/^[A-Z]\d{3}-\d+$/`.
`VG036-01` **não casa**. Consequência: toda aresta de contradição e todo `basis`
apontando para uma claim de G028+ era irresolvível pela ferramenta, **em
silêncio** — o comando respondia "nada a fazer" em vez de "não existe". Metade das
arestas desta ingestão estava inverificável, e ninguém teria percebido.

Normalizei os 702 ids de `VG0XX-NN` para `G0XX-NN`, junto com as referências em
`conflicts`, `conditions` e `basis`. Critério, nesta ordem: (a) é a única das duas
formas que a ferramenta obrigatória resolve; (b) segue o único precedente
não-Vena que já existia na base (`F001.jsonl` usa `F001-01`, id casado com o
arquivo); (c) nenhuma claim `G0XX-NN` tinha sido citada fora do próprio corpus
ainda, então não houve renumeração de id publicado.

Registro a causa raiz para quem for editar o `SCHEMA.md` (que eu não devo tocar):
a frase **"colisão é impossível por construção"** só era verdadeira com uma fonte
só. `V{ref}-{seq}` com `ref = G010` produz `V010-01`, que já é do `R010.jsonl` do
Vena. Os seis agentes bateram nisso e cada um resolveu sozinho. Não é falha de
agente, é falha de especificação.

### 2.2 O compilador não valida `modo` — achei uma claim com valor inválido

`G015-19` estava com `modo: "erro-comum"`, que é um **tópico**, não um modo. O
`check-claims.mjs` passou limpo mesmo assim: ele não valida esse campo contra o
enumerado do `SCHEMA.md`. Corrigi a claim para `modo: "fato"` (é uma afirmação
sobre o mundo — que o peso de 5x5 é ~85 % do 1RM — enunciada como correção de um
erro comum).

**Não** adicionei a validação ao checker, de propósito: as ~4.900 claims do Vena
ainda estão sem `modo` (é a tarefa #29, pendente), então um validador estrito
reprovaria a base inteira hoje. A ordem certa é preencher o `modo` do Vena e só
então ligar a trava. Fica anotado como dívida com causa conhecida, não como coisa
esquecida.

### 2.3 Estado do compilador

```
node research/tools/check-claims.mjs
Base de conhecimento — 6909 claims em 231 lote(s)
  tiers ..................... R:6766  O:143
  tópicos distintos ......... 68
  vídeos com claim .......... 230
  contradições registradas .. 31
✓ toda claim resolve, todo verbatim existe, todo número tem frame
```

Zero erro. Cinco avisos remanescentes, todos de número por extenso sem gaveta de
frame (`G001-66` escala subjetiva 0–10, `G006-16`, `G044-03` temperatura em °F,
`G044-12` volume culinário, `V044-11`). São os quatro frames que faltam, não erros
de extração — ver §6.

---

## 3. As arestas de contradição: 51 registradas, 16 removidas, 2 acrescentadas, **37 confirmadas**

O teste que apliquei a cada uma, e que declaro aqui para poder ser contestado:

> Uma aresta é real quando (a) os dois lados falam do **mesmo objeto de decisão**,
> (b) sob o **mesmo antecedente**, e (c) **seguir um implica desobedecer o outro**.

Falhar em (a) ou (b) é o modo de falha mais comum — duas frases sobre coisas
diferentes que compartilham uma palavra-chave. Falhar em (c) é o segundo: um
narra o que aconteceu com ele, e narrativa não é instrução.

### 3.1 As 16 arestas que removi, e por quê

**Cinco caíram porque o próprio Blevins concorda com o Vena em outro ponto do
corpus.** Uma fonte não pode simultaneamente afirmar e negar a mesma coisa; quando
isso aparece, a aresta é que está errada.

| removida | por quê |
|---|---|
| `G020-23 x V102-09` | O "deload" do Blevins ali é um **reset de carga de 10 % num movimento travado de progressão linear de iniciante**. O `V102-09` do Vena é sobre **frequência de deload de fadiga em atleta avançado**. Objetos diferentes; seguir um não viola o outro. |
| `G020-25 x V102-12` | Mesma razão: o vaivém do `G020-25` é o ciclo de exaustão de uma LP de novato, não oscilação de carga de trabalho em torno do ótimo. |
| `G037-30 x V102-09` | **Um** deload planejado no meio de um prep não contradiz "deloadar com *muita frequência* é sinal de trabalho demais". |
| `G038-19 x V102-09` | Idem: uma semana de singles leves é instância, não frequência. |
| — | O que sela as quatro acima: em `G015-34` e `G015-35` o Blevins diz, com todas as letras, que deload a cada quarta semana "é frequente demais para a maioria" e que "você não precisa deloadar tão often". Ele **sustenta** o `V102-09`. |

**Três caíram porque o Vena, em outro vídeo, diz o mesmo que o Blevins.**

| removida | por quê |
|---|---|
| `G004-37 x V061-19`, `G008-06 x V061-19`, `G008-07 x V061-19` | O "novelty can be a bit overrated" do Vena é uma deflação suave, e o entorno dele desmonta a aresta: `V061-21` ("trabalhar numa faixa de repetições um pouco diferente mantém o treino menos repetitivo") e sobretudo `V040-10` ("deixar o ciclo se alongar demais fica chato e leva a apatia") — que é **exatamente** o modo de falha que o Blevins descreve. Os dois estão avisando de pontas opostas do mesmo eixo: o Vena, de trocar sempre e nunca sobrecarregar; o Blevins, de 15–18 semanas sem trocar nada. Nenhum dos dois defende o erro do outro. |
| `G048-43 x V003-07` | O Blevins leva ~40 min até o primeiro single pesado. Em `V003-06` o **Vena leva ~45 min** da chegada até a top single. Eles concordam. O `V003-07` (aquecimentos até 80 % podem ser back-to-back) fala de descanso *entre séries de aquecimento*, não de duração total da rampa. |
| `G048-58 x V038-02` | A caricatura das "3 horas" do Vena é sobre sessão dispersa; ele mesmo endossa descansos longos em `V038-03`/`V038-04` e pratica 8 min antes das top singles (`V003-05`). A divergência real de densidade é a aresta 17 abaixo, que fica. |

**Quatro caíram por escopo — narrativa lida como prescrição.** É o erro que o
`modo` existe para prevenir e que passou mesmo assim.

| removida | por quê |
|---|---|
| `G038-04 x V102-16` | `modo: narrativa`. Ele **relata** que uma top set de terra comprometeu a semana seguinte. Relato de evento não é prescrição concorrente; não há o que seguir. A versão normativa dessa discordância existe e está mantida (arestas 10 e 11). |
| `G038-05 x V102-16` | Ele vai pegar leve no terra na semana seguinte — isso é o **corretivo**, não uma contraprescrição. E autorregular é o que o Vena manda fazer. |
| `G040-04 x V077-20` | A claim registra o Blevins **passando a pausar** entre as repetições em vez do touch and go. Ele está andando *na direção* do Vena. Aresta invertida. As arestas reais de touch and go (24, 28, 29, 33, 34) ficam. |
| `G051-21 x V018-28` | "Hoje não foco em leg drive nenhum **porque meu corpo já faz sozinho**" é um elite com o padrão automatizado; o "problema nº 1" do Vena é sobre quem não usa leg drive. Antecedentes diferentes. A versão geral e afiada (`G051-22`) fica, em duas arestas. |

**Duas caíram por leitura literal do que o Vena afirmou.**

| removida | por quê |
|---|---|
| `G001-62 x V076-19` | O `V076-19` diz que blocos de hipertrofia rendem **pior do que trabalhar força e hipertrofia juntas**. O bloco de hipertrofia do Genesis mantém SBD de competição em 4×3 (`G001-32`) e o próprio Blevins chama o sistema de *concurrent training* (`G001-63`) — ele trabalha as duas juntas. A claim do Vena, lida como está escrita, não alcança o Genesis. A discordância que sobra é sobre **fase de ênfase**, e ela está registrada na aresta 1. |
| `G015-26 x V036-01` | `G015-26` é `modo: fato` glosando o que o **GZCLP** exige ("2 reps no tanque" = AMRAP em RPE 8) — ver `G015-25`, onde o sujeito é o programa. Atribuir esse alvo ao Blevins como prescrição dele é exatamente o achatamento de review de terceiro. O endosso dele existe e está na aresta 14 (`G015-28`). |

**Uma foi retargetada, não removida.** `G051-12 x V015-27` apontava para o
enquadramento ("enxergo meu tempo parado como trabalho"), que não contradiz nada.
A claim que de fato conflita com o "tempo programado de fazer nada" do Vena é
`G051-11` — "ele está sempre trabalhando e não tira muito tempo simplesmente
parado". Movi a aresta para lá.

### 3.2 A aresta que acrescentei

`G030-24 x F001-01` — **profundidade de agachamento, contra o regulamento da
IPF.** O Blevins diz que um agachamento "exatamente no paralelo" está na
profundidade mínima e "pode não passar em algumas competições". O `F001-01`
(regulamento técnico da IPF, §4.1.3, tier `O`) exige que a superfície superior das
pernas na articulação do quadril fique **mais baixa** que o topo dos joelhos —
paralelo não é margem, é luz vermelha, e `F001-25` confirma que falta de
profundidade é a única coisa que o cartão vermelho do agachamento significa.

Registrei porque o consumidor desta base compete na IPF, e "paralelo é
limítrofe" é a forma exata de perder uma tentativa. **Resolução: `F001` prevalece,
e não por ponderação** — o `SCHEMA.md` separa o tier `O` justamente porque regra
não se pondera contra opinião. Note que o próprio Blevins, na claim seguinte
(`G030-25`), manda descer mais para garantir a validação; a aresta é contra a
frase, não contra a orientação dele.

**Não** registrei `G029-28` ("topo do joelho na altura da dobra do quadril está na
profundidade ou ligeiramente abaixo") pelo mesmo motivo, apesar de ser tentador:
"right at depth" é gíria de levantador que costuma querer dizer "passa raspando",
e uma aresta construída sobre ambiguidade de gíria é o tipo de aresta falsa que
ensina a base a duvidar do que estava certo. Fica aqui como suspeita anotada.

---

## 4. As 37 arestas confirmadas, e quem prevalece

A regra é a do `sources.mjs`: **credencial primeiro, por assunto; data como
desempate dentro da mesma faixa de credencial.** `credencial` só vale como
justificativa quando o tópico da aresta está no `mandaEm` do vencedor.

### 4.1 Onde o Blevins prevalece (tópico no `mandaEm` dele)

| # | aresta | assunto | resolução |
|---|---|---|---|
| 10, 11 | `G010-44 x V102-12`, `x V102-16` | overreaching deliberado na semana de pico | **Blevins** — `pico`. Mas condicional, e a condição vem do próprio Vena: `V110-18` diz que ele abandonou a supercompensação porque, ficando mais forte em termos absolutos, passou a tolerá-la pior — que é o mesmo mecanismo do `G045-15/16`. Ou seja: overreaching de pico é legítimo, e a tolerância cai com a carga absoluta. Não é "um está certo". |
| 21 | `G035-13 x V054-29` | quando o taper começa (3 semanas x 2 semanas) | **Blevins** — `taper`. Corroborado internamente por `G034-29` (volume dele cai a partir de ~3 semanas). Divergência quantitativa, não de princípio. |
| 22 | `G035-14 x V004-03` | direção da intensidade na reta final | **Blevins** — `pico`. Mesma janela, direções opostas: intensidade pica a 5–6 semanas e cai (Blevins) x saltos maiores nas 3 últimas semanas (Vena). Esta é decisiva para montar o bloco final e as duas leituras não se somam. |
| 23 | `G036-38 x V004-22` | passar da própria abertura em treino | **Blevins** — `pico`/`competicao`. E o corpus do Vena **concorda com o Blevins**: `V085-05` ("raramente é preciso passar de 95 %") e `V110-23` ("não vá pesado demais antes do máximo") são prescrições dele mesmo; `V004-22` é a prática que ele desmentiu depois — em `V004-24` ele conta que fritou as costas e puxou menos no Nationals. Aresta resolvida por dentro. |
| 30, 32 | `G045-12 x V169-33`, `G048-42 x V169-33` | volume baixo é desperdício? | **Blevins** — `volume`/`recuperacao`, e a credencial é literal: ele fala de agacho na casa de 650–711 lb testado. A resolução correta **não** é "volume baixo é bom": é que o custo de recuperação escala com a carga **absoluta**, não relativa (`G045-15/16`), e a prescrição de volume do Vena é para quem está muito abaixo daquela carga. Para um natural de 87 kg, o Vena provavelmente está mais certo hoje e o Blevins fica mais certo com o tempo. |
| 31 | `G045-13 x V015-01` | volume/frequência sobem ou descem com o avanço? | **Condicional, Blevins com a última palavra** — `volume`. Reconcilia-se pelo mesmo mecanismo de carga absoluta, e o Vena assina esse mecanismo em `V114-20` (enhanced treinam menos frequentemente porque mais força gera mais fadiga) e `V110-18`. |
| 20 | `G030-24 x F001-01` | profundidade legal | **`F001` (tier `O`)** — regra não se pondera. |
| 35 | `G051-11 x V015-27` | tempo programado de fazer nada | **Sem vencedor.** `recuperacao` está no `mandaEm` do Blevins, mas isto é gestão de estresse e estilo de vida, não dose de treino; nenhum dos dois tem credencial no assunto. Fica registrada como divergência, não como decisão. |

### 4.2 Onde o Vena prevalece (tópico no `mandaEm` dele)

| # | aresta | assunto | resolução |
|---|---|---|---|
| 24, 28, 29, 33, 34 | `G040-05`, `G042-10`, `G049-10` x `V077-20`/`V123-07` | touch and go no terra | **Vena** — `tecnica`, `convencional`. Cinco arestas, o eixo mais denso do lote. O Blevins defende o touch and go por posição melhor na segunda repetição e por atingir melhor a musculatura; o Vena manda soltar e resetar para praticar achar a posição toda vez. Note que os dois **concordam no mecanismo** (reflexo de estiramento facilita) e divergem na conclusão. |
| 25, 26 | `G040-25 x V042-02`, `x V042-07` | precisa treinar pegada? | **Vena** — `pegada`. E o argumento dele é mais forte que a credencial: `V042-07` dá o mecanismo de que a ausência de problema de pegada é *causada* pelo estímulo que o Blevins propõe remover. O condicional do Blevins ("se você nunca teve problema") é justamente o que o mecanismo do Vena invalida. |
| 27 | `G040-27 x V174-12` | efeito da strap na força | **Vena**, com ressalva — `pegada`/`equipamento`. O Blevins é `PESSOAL` (ele fica mais fraco com strap por não entrar em posição tão boa); o Vena é `GERAL` sobre o gap academia-x-competição. Não se anulam: a strap ajuda a maioria e atrapalha o setup de alguns. Registrar como condição, não como derrota. |
| 36, 37 | `G051-22 x V018-28`, `x V056-21` | leg drive no supino | **Vena** — `tecnica`, `supino`. Mas é a aresta mais interessante do lote como contraevidência: o Blevins supina 495 lb testado e diz que leg drive não é terrivelmente importante, o que é exatamente o regime de carga máxima em que o `V056-21` afirma que a importância cresce exponencialmente. O veredito fica com o Vena por credencial declarada; a contraevidência merece ficar visível no ledger. |
| 17 | `G023-19 x V074-23` | até onde cortar descanso | **Vena** — `programacao`. O Blevins corta descanso de propósito até séries de RPE 6/7/8 virarem ~10, aceitando menos peso por densidade; o Vena manda cortar só até onde **não** prejudica o desempenho. Ressalva honesta: o Blevins fala de acessório e dá dois motivos declarados (fluxo sanguíneo, `G023-18`; caber numa agenda cheia, `G023-20`). Se o objetivo for hipertrofia de acessório, ele não está errado — está respondendo outra pergunta. |
| 18, 19 | `G026-12 x V122-31`, `G026-27 x V166-08` | individualização e template estático | **Vena** — `meta-metodologia`. E há um agravante de procedência: as duas claims do Blevins são de peça comercial do EvolveAI ("melhor que qualquer template existente", "arrasa qualquer template estático"). Alegação de vendedor contra a proporção medida do Vena (80 % vem do básico, 10 % é individualização) e contra uma prescrição concreta dele (Sheiko para quem lida bem com volume). O consumidor deve ler as duas do Blevins com ceticismo. |

### 4.3 Onde nenhum dos dois manda no tópico — e o que fazer

Estas nove arestas caem em tópicos que **não estão no `mandaEm` de ninguém**.
`credencial` não é resposta legítima aqui, e a regra de desempate cai para a data.

| # | aresta | assunto | resolução |
|---|---|---|---|
| 1 | `G001-62 x V111-16` | bloco de hipertrofia dedicado é necessário? | Sem vencedor por credencial. Vena é 2024–2026, Blevins `G001` é 2025 — mesma faixa, data não desempata. **Fica aberta.** É uma escolha de estrutura, e a §3.1 mostra que o desacordo é mais estreito do que parece: os dois fazem força e hipertrofia juntas, discordam sobre rotular uma fase de ênfase. |
| 2–6 | `G004-55`, `G004-58` x `V102-12`/`-13`/`-15` | semana de deload dedicada | **Fica aberta**, e é a aresta mais estreita e mais sólida do lote. Não é "never deload x always deload": os dois concordam que deload pesado demais destreina (`G004-59` x `V102-07`), que deload não é parar de treinar (`G004-60` x `V002-23`), que deload frequente demais é erro (`G003-38`, `G015-34/35` x `V102-09`), e o Blevins aceita treino sem deload nenhum como opção legítima (`G004-32/33`). O que resta é **uma semana dedicada caber ou não no ciclo**, com o `V102-15` como o desacordo mais concreto: o Vena substitui a semana de deload por semanas leves que carregam **mais** trabalho. |
| 7, 8, 9 | `G006-39/40/41 x V061-22` | DUP x periodização em blocos | **Blevins tem o argumento melhor**, sem ter o tópico. Ele não afirma o contrário do Vena: afirma que a evidência não sustenta nenhum dos lados (`G006-40`, estudos de 3 pessoas em 12 semanas) e que houve recordista mundial em toda categoria usando cada estrutura (`G006-41`). Contra uma claim de superioridade, ceticismo calibrado ganha. **Recomendo não usar o `V061-22` como base de decisão de estrutura.** |
| 12, 13, 14, 16 | `G012-32 x V036-01`/`V029-16`, `G015-28 x V036-01`, `G022-12 x V010-10` | **proximidade da falha** | **Fica aberta, e é a divergência mais consequente do lote.** O Vena defende que treinar em torno de ~10 RIR é "até mais ótimo" e prescreve trabalho de força em RPE 3–6; o Blevins, testado e medalhista IPF, treinava compostos em RPE ~8 no dia de repetições e chama a progressão por AMRAP submáximo de altamente eficaz. A aresta 16 é a mais afiada e é epistêmica, não doutrinária: depois de décadas treinando, o Blevins diz que só reconhece bem RPE 8, 9 e 10, e que entre 6 e 7 não sabe dizer — ou seja, a faixa RPE 3–6 que o Vena prescreve é **a faixa que um elite declara não conseguir resolver**. Uma prescrição de RPE não pode ser mais fina que a resolução do instrumento. |
| 15 | `G018-26 x V117-06` | "fritar o CNS" é restrição real? | Sem vencedor por credencial (`fadiga` não está em nenhum `mandaEm`). O Blevins usa a expressão de passagem, dentro de um mecanismo maior; o Vena ataca o alarmismo diretamente. **Fica aberta**, mas é a mais fraca das 37 — o Blevins não defende a tese, ele usa o jargão. |

---

## 5. O que esta fonte trouxe que a base não tinha

Isto é o resultado da ingestão. As arestas foram o trabalho; a cobertura de
lacuna é o valor.

**A credencial, agora citável.** `G001-72` (supino de 495 lb em 2025, competindo
testado), `G032-01` (IPF Classic Worlds descrito como o teto do raw drug-free),
`G036-03/05/06` (convocado como suplente para o Classic Worlds e 3 Nationals),
`G051-38` (12–14 anos de treino), `G051-31` (4 anos só de powerlifting). Toda
prescrição do corpus G pode ser lida como "vindo de alguém que fez isso testado".
Nenhuma claim do Vena pode.

**Taper escalado pelo tamanho do atleta.** `G006-23` — atletas menores, que
recuperam mais rápido, fazem taper de 3 dias; outros levam múltiplas semanas.
`G005-31` — agachar pesado na segunda e competir no sábado seguinte é tempo demais
para o intermediário, "agora, se você agacha na casa de 700 lb, aí sim isso é
apropriado". **É literalmente a regra que impede o consumidor de copiar o taper de
um cara de 400 kg**, e nada no corpus do Vena a fornecia. Não gera aresta porque
não briga com claim nenhuma; vale mais que várias das que geram.

**Custo de recuperação por carga absoluta.** `G045-15/16` — um single de 315 lb e
um de 650 lb podem ser ambos 95 % do 1RM, e o de 650 é muito mais caro.
`G045-17/18/19` — composição corporal muda a recuperação mesmo com peso corporal
igual. Este é o mecanismo que **reconcilia** metade das arestas de volume acima e
explica por que copiar volume de quem agacha 400 kg quebra um natural de 87 kg.

**Ordem dos movimentos na semana do meet.** `G005-33` — o terra demora mais para
recuperar que o agacho, então ele inverte os dois na semana anterior, deixando o
terra mais longe da competição.

**Dose de manutenção e dose de taper.** `G007-29` (50–60 % por 3–5 séries de 3–5
reps na semana de teste, só para não destreinar), `G007-37` (cortar o estresse pela
metade, nunca a um quarto), `G002-38` (o estresse sobe exponencialmente ao sair de
70–80 % e entrar em 90 %+), `G001-01` (5 séries para manter contra 20 para
crescer).

**Critério para auditar um programa antes de rodá-lo.** `G008` inteiro. É o único
vídeo da base que ensina isso. Junto com `G013-28` (ao trocar de programa, olhe o
número de séries e não pule mais de ~20 % de uma vez) e `G010-45/46/47`
(pré-requisitos de frequência antes de entrar num programa de alto volume).

**Taxa de progresso medida, não estimada.** `G016-39` — dos números reais de
usuários do EvolveAI, 70 a 100 lb de total em 4 a 6 meses é frequente entre
novatos; `G016-40/41/42` definem novato (< 2 anos) e avançado (10–12 anos
estagnado). Âncora de expectativa que faltava.

**Sheiko em primeira mão.** `G011-09/13` — o Blevins foi treinado pessoalmente pelo
Sheiko, e `G011-15` descreve a regra de autorregulação dele: remover volume quando
o atleta sustenta a dose com técnica e velocidade limpas a 70–75 %.

**Fragmentos de IPF de verdade.** `G027-19` (glúteo no banco, não posterior de
coxa, sob pena de luz vermelha), `G027-25` (checar a regra da federação sobre
manipulação de cinto), `G023-11` (aquecer de menos no supino de propósito, porque
é assim numa competição), `G032-08` (~3 min entre agacho e supino no Mundial),
`G040-29` (você tem de saber competir e obedecer à federação).

---

## 6. O que a ingestão NÃO resolveu

Esta seção existe para que ninguém leia o resto como conclusão.

### 6.1 A lacuna `natural-vs-enhanced` continua aberta — e é a razão pela qual o Blevins foi ingerido

O tópico tem **6 claims do Blevins contra ~30 do Vena**. Nenhum dos 50 vídeos toca
em teto atingível sem farmacologia, dose de volume sustentável para testado, ou
natural x enhanced como tese. As claims que a base usa hoje para responder "o que é
atingível sendo natural" continuam sendo do Vena — `V122-22` (os melhores naturais
ficam por volta de 600 DOTS), `V056-08`, `V172-17` —, que é exatamente a testemunha
que o `sources.mjs` declara errada para esse assunto. **A ingestão trocou a
testemunha em taper, pico, volume e recuperação, e não trocou em natural.**

Nuance factual que encontrei e que ninguém deveria ignorar antes de mexer no
`sources.mjs`: o Vena afirma, em `V173-05/06`, não usar esteroides e nunca ter
tomado nenhuma forma de droga de melhora de desempenho, e `V051-21/22` narra ter
passado por antidoping em competição duas vezes. O `testado: false` do registro de
fontes deve significar "não compete no lado testado da IPF", não "não é natural" —
e as duas coisas justificam pesos diferentes. Não alterei o `sources.mjs`; sinalizo
porque a regra de precedência inteira depende dessa leitura.

Fechar a lacuna exige outros refs do canal ou outra fonte. Não fecha aqui.

### 6.2 Os 20 `suspect` continuam suspeitos

16 `numero` e 4 `negacao`, esperando o passe de Whisper (tarefa #24). Os que mais
importam, porque propagam para dose:

- `G021-22` — "87 ish" do máximo para uma tripla em RPE 8,5–9; esse número governa um bloco inteiro de treino dele.
- `G043-30` — RPE 9 dando 96–98 % de intensidade relativa e RPE 9,5 dando "closer to 95 %", o que inverte a escala que ele mesmo acabou de definir.
- `G003-29`, `G005-20`, `G005-22`, `G007-19` — os quatro do mesmo tipo: percentual com casa decimal embaralhado pela legenda automática ("RP 67", "87 1.2%", "855", "87 A5"). Um passe nessas quatro janelas resolve os quatro.
- `G011-45` e `G012-45` — negação/dupla negação; a leitura emitida é a sustentada pelo argumento em volta, mas é a superfície onde um `n't` decide o sentido.

### 6.3 O `G033` não foi extraído

Sem transcrição: `transcript: null` e `source: null` no manifesto, sem legenda em
`transcripts/` nem em `captions/`. 50 de 51.

### 6.4 O `G024` saiu magro de propósito

Marcado alta prioridade, rendeu 4 claims. Fora da abertura e do fecho, é música,
treino filmado e fala de convidados não identificáveis. Há conteúdo bom ali
(tendinite de cotovelo, volume em belt squat/SSB poupando movimentos de
competição, supino picando na quinta semana enquanto agacho e terra vão até a
sexta) que **não** foi extraído porque "ele" não é a mesma pessoa em cada trecho, e
emitir seria atribuir ao Blevins prática de terceiro. Precisa de diarização ou do
vídeo aberto.

### 6.5 Frames e tópicos que faltam no enumerado

Levantados de forma convergente pelos seis lotes. Não inventei gaveta; os números
que não couberam ficaram por extenso (e geram os avisos do §2.3) ou fora da claim.

**Frames ausentes:** moeda (preço de ebook, curso, coaching, bloco do app —
aparece em `G003`, `G006`, `G026`, `G037`, `G042`); temperatura em °F (`G041`,
`G044`); unidade de estresse do *stress index* (`G005`, `G007`, `G008` — o conceito
central de `G008` inteiro); escala subjetiva arbitrária 0–10 (`G001-66`);
percentual de um XRM que não é 1RM ("85 % do seu 5RM", `G015`, `G017`); percentual
de carga de referência e percentual abaixo do abridor (`G034`); rótulo/índice que
não mede nada (tier 1/2/3, onda 1/2/3, semana T1/T2/T3); nome de programa que
contém dígito (5/3/1, 5x5, Ph3, nSuns) — a trava de "número sem procedência" não
distingue nome próprio de medida, então o nome saiu da claim em pt-BR e ficou só no
`verbatim`; pés/ft; hora do relógio; xícara.

**Tópicos ausentes:** `stress-index`/`carga-de-treino` (conceito central de 5
vídeos, caiu em `meta-metodologia` + `volume`); `analise-de-programa-de-terceiro`
(os reviews não têm tópico que os identifique como tal — este é o mesmo buraco do
§1); `powerbuilding` (objetivo declarado do consumidor, tema de `G009` e `G013`);
`training-max` (governa quase todo o bloco G010–G018 e cada programa o define
diferente); `amrap`/`proximidade-da-falha` (mecanismo de progressão de 7 dos 9
vídeos do lote 2 — e é o eixo das arestas 12–14 e 16, o que significa que **a
divergência mais consequente da base não tem tópico próprio**);
`descanso-entre-series`; `plato`/`estagnacao`; `app`/`ferramenta-de-coaching`
(`G024`–`G026` inteiros, 43 claims); `walkout`; `avaliacao-de-forma`;
`equipamento-de-barra` (SSB); `massagem`/`tecido-mole` (`G048` tem o achado mais
acionável: liberação miofascial profunda a menos de 48 h do treino piora o
desempenho); `gestao-de-tempo`.

### 6.6 O que os relatos de campo registraram e eu não pude fechar

- Conteúdo devocional/teológico ocupa 40–60 % do tempo de `G036`, `G038`–`G041` e boa parte de `G047`. Não foi extraído — não é conhecimento de treino. O baixo número de claims de `G047` **não** é falha de cobertura.
- A `TRIAGEM.md` e os briefings dos agentes discordam sobre prioridade em pelo menos dois lotes (vídeos marcados média/baixa renderam mais que os de alta). Os agentes seguiram o conteúdo, não o rótulo. A triagem merece uma revisão.

---

## 7. Pendência operacional — e ela é urgente

**Os 50 arquivos `G*.jsonl`, as 1.819 claims e este documento estão hoje apenas
em:**

```
/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/
  a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/wt-blevins/
```

Isso é `/tmp`. O `MEMORY.md` do projeto registra, em letras grandes, que **a base
inteira já foi perdida exatamente assim uma vez**, e que artefato caro nasce em
`research/` e é commitado no mesmo dia. Os seis relatos de campo levantaram isso
de forma independente; é o item mais repetido de toda a rodada.

Trabalhei no worktree e não usei git porque foi o que me foi instruído. A promoção
precisa acontecer assim que a medição do tree principal liberar:

```
cp <worktree>/research/extract/G0*.jsonl  /Users/brunnovert/Documents/Dev/powerlifting-app/research/extract/
cp <worktree>/research/kb/BLEVINS-INGESTAO.md /Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/
```

e commit no mesmo dia. Nenhum arquivo do corpus Vena foi tocado; os únicos
arquivos modificados por esta tarefa são os 50 `G*.jsonl` (normalização de id,
remoção/adição de aresta, um `modo` corrigido) e este documento.

---

## 8. O que fazer a seguir, em ordem

1. **Promover e commitar** (§7). Antes de tudo.
2. **Construir o ledger de contradições** (tarefa #25) a partir das 37 arestas desta §4, com link bidirecional — hoje elas são unidirecionais G→V e o lado do Vena não sabe que está numa aresta.
3. **Preencher `modo` no corpus do Vena** (tarefa #29) e **só então** ligar a validação de `modo` no `check-claims.mjs` (§2.2).
4. **Abrir gaveta para descrição de programa de terceiro** — em `modo` e em `topic`. É o defeito que mais achata este corpus (§1, §6.5).
5. **Passe de Whisper** nas 20 janelas `suspect` (§6.2), com prioridade para `G021-22`, `G043-30` e as quatro de percentual decimal.
6. **Fechar `natural-vs-enhanced`** com outra fonte ou outros refs (§6.1). A base ainda responde essa pergunta com a testemunha que ela própria declara errada.
