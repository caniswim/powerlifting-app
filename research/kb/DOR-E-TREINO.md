# DOR E TREINO — o cluster que manda continuar, e o que ele está mesmo dizendo

> Escrito em **2026-08-09**, sobre o que o `MEDICAO-02.md` §6.1 chama de *"o pior da
> base"*: quatro claims `tier R · GERAL · prescricao` que autorizam treinar com dor e
> saem limpas de qualquer filtro que vire treino, dirigidas a um atleta cujo bloco é
> um protocolo de reexposição de peitoral.
>
> **Nenhum vídeo foi reaberto por adivinhação.** Todo o sinal deste arquivo saiu das
> transcrições que já estavam em `research/corpus/transcripts/`, lidas inteiras em volta
> de cada `at`. Onde a base não tem a resposta, este arquivo diz que não tem — e não
> preenche.

---

## 1. A pergunta que decidia tudo, e a resposta

A instrução era: *ele está falando de reabilitação de lesão crônica sob gestão de carga,
ou de dor aguda no meio de uma série?* **Não conserte antes de saber qual é.**

**As quatro falam de reabilitação programada de uma lesão já conhecida, com a carga
escolhida ANTES da série, e julgada de uma sessão para a outra.** Nenhuma das quatro fala
de dor nova dentro de uma série. Isso não é leitura de tom: os quatro vídeos declaram o
enquadramento no próprio texto, e o critério operacional de todas elas é medido num
horizonte maior que o de uma série.

| id | vídeo | a frase que fixa o enquadramento |
|---|---|---|
| **V001-06** | `R001` *How I Got Over 3 YEARS OF INJURIES* | vem logo depois de *"the question becomes, how heavy do we load it?"*, e termina em *"that's around the right workload"* — é **escolha de carga de trabalho** |
| **V079-34** | `R079` *How SAFE is POWERLIFTING* | a frase anterior é *"…which tells us how we should be **rehabbing our injuries**"* |
| **V138-20** | `R138` *STOP TAKING TIME OFF FROM INJURY* | o vídeo se abre em *"a generalized guide as to how to alter your program **when you get injured**"* |
| **V079-32** | `R079` | mesmo bloco de `V079-34`, e a frase seguinte é literalmente *"Be cautious still."* |

E o teste que fecha o argumento, porque é mecânico e não interpretativo — **o critério de
cada uma é definido numa escala de tempo maior do que uma série:**

- `V138-18`, que é a definição do limiar de que `V138-20` depende: *"to the point where we
  feel some pain but we **don't feel worse the next session**"*.
- `V001-07`: *"you're looking to be making progress **session to session**, slowly adding
  more load without increases in pain"*.
- `V086-21`: *"your symptoms should be **trending better over time**"*.
- `V027-26`: *"move as much as you can while still seeing your pain symptoms **trending
  down over time**"*.

**Nenhum desses critérios é avaliável durante a terceira série de supino pausado.** Servir
`V001-06` ou `V079-34` a uma fisgada de 3/10 no meio da série não é aplicar a claim: é
aplicá-la fora do horizonte em que o próprio autor a definiu. O defeito não é a claim ser
falsa — é a base ter achatado **duas perguntas diferentes numa gaveta só**:

- **(a) que carga eu escolho para as próximas sessões no exercício que dói?** — a base
  responde, com número, com condição e com critério de revisão.
- **(b) apareceu dor agora, dentro da série: eu termino?** — **a base não responde.** Ver §6.

---

## 2. A varredura — quem mais autoriza treinar com dor

A medição olhou uma amostra e achou quatro. A varredura foi feita por dois caminhos
independentes, porque um só esconde (é o modo de falha da rodada passada, `MEDICAO-02.md`
§7-4b):

1. **Vocabulário do `verbatim`, em inglês**: `push through`, `work through`, `train
   through`, `train around`, `pain is okay`, `discomfort`, `tolerable`, `pain threshold`,
   `some pain`, `light pain`, `minor pain`, `keep moving`, `grind through`, `suck it up`.
   → **33 claims**.
2. **Tópico, sem filtro de `modo` nem de `scope`**: `--topic dor` ∪ `--topic lesao`
   → **412 claims**, das quais **88** em `GERAL` + `prescricao`.

Do cruzamento sai a família real: **as claims que autorizam carregar um tecido que dói.**
Delas, as que estavam **sem `conditions`** — isto é, as que saíam cruas — eram estas
**nove**, e não quatro:

| id | o que autoriza | tinha `conditions`? |
|---|---|---|
| `V001-06` | ~2/10 é a carga de trabalho aproximadamente certa | **não** |
| `V079-34` | 2 a 3/10 é boa faixa para empurrar | **não** |
| `V138-19` | o limiar costuma ficar em torno de **2 a 4**/10 | **não** |
| `V138-01` | *"tirar folga por lesão é burrice"* | **não** |
| `V138-08` | continuar no movimento primário é a chave | **não** |
| `V138-13` | o movimento principal continua mesmo no caso extremo | **não** |
| `V138-24` | cada dia se trabalha até o peso que fica sob o limiar | **não** |
| `V171-14` | *"just work through it"* | **não** |
| `V138-18` | a definição do limiar de dor | **não** |
| `V079-32` | continuar se movendo através de dor leve | sim (`V079-33`, `V079-34`) |
| `V138-20` | reabilitar com dor leve dá reabilitação mais rápida | sim (`V138-18`) |

**`V138-19` é a mais perigosa das nove e não estava na lista da medição** — o topo da faixa
dela, 4/10, é exatamente o gatilho de **encerrar a sessão** do `PROGRAMA.md` §1.2. Ela
escapou de duas listas porque é `modo: opiniao`, e a busca da medição estava em
`prescricao`. **Escapou de uma terceira pelo mesmo motivo, e essa era código:** a trava do
`check-claims.mjs` também tinha `prescricao` no predicado — ver §5.2.

**As nove foram fechadas em dois passes, e o segundo demorou um dia:** cinco no §4.1,
quatro no **§4.4**, que é onde está escrito o que cada uma das quatro ganhou e por quê. A
tabela acima é o estado de ANTES; nenhuma das nove sai crua hoje.

Já estavam conditionadas e **não** precisavam de tratamento: `V001-04`, `V001-05`,
`V086-21`, `V027-26`, `V108-27`, `V177-11`, `V177-13`, `V138-04`, `V138-05`, `V138-22`.

---

## 3. A condição que faltava EXISTE no corpus — e onde ela estava

Este é o achado que decide o conserto. A ressalva não precisou ser inventada em nenhum dos
casos. Ela estava em três lugares, todos dentro do corpus:

### 3.1 Dita no vídeo, na mesma frase, e nunca extraída — 3 claims novas

| nova | vídeo, `at` | verbatim (literal, conferido pelo compilador) |
|---|---|---|
| **`V001-29`** | `R001` @01:00 | *"every person and every injury is different, so it might take some adjusting"* |
| **`V079-39`** | `R079` @03:47 | *"Be cautious still"* |
| **`V138-33`** | `R138` @02:32 | *"everybody and every injury is different and we have different pain tolerances"* |

As três estão **coladas** na claim perigosa — mesma sentença ou a seguinte, mesmo bloco de
transcrição. `V079-39` é a frase que separa *"keep moving even through minor pain"* de
*"many people overdo it"*, e o extrator pulou por cima dela. **Isto não é ressalva
fabricada: é extração que faltava**, e o `check-claims.mjs` confere cada `verbatim` contra
a transcrição, dentro da janela de `at`.

### 3.2 Dita em OUTRO vídeo, pelo mesmo autor — e é a mais forte

**`V027-23`** (`R027` @05:06, `GERAL`, `opiniao`):

> *"i actually find more minor injuries end up being moved more than they should. and
> that's because it's easier to train through these minor injuries"*

É a inversão exata do cluster, do mesmo homem, e continua com o exemplo dele: **`V027-24`**
— *"i've dealt with years of pec tendon issues on bench"* — e **`V027-25`**:

> *"that pain did impact my training quality a bit. so i just kind of end up spinning my
> wheels and not making progress, and the pain doesn't get any better, either"*

**Peitoral. No supino. Anos.** É o desfecho empírico de ter feito exatamente o que as
quatro claims mandam, no mesmo tecido e no mesmo levantamento deste atleta, contado pelo
autor das quatro. O `PROGRAMA.md` §1.2 já cita esse trecho (`[R27 @05:08]`) como *"o modo
de falha a evitar"* — mas até hoje **nada ligava as duas pontas dentro da base**.

### 3.3 A data — porque "o recente vence" é regra executável aqui

| vídeo | data (manifesto) | o limiar que ele dá |
|---|---|---|
| `R001` | **2026-08-01** | **2/10** |
| `R027` | 2026-01-31 | sem número; *"o máximo que der enquanto os sintomas caem"* |
| `R079` | 2025-04-10 | 2–3/10 |
| `R138` | 2024-03-24 | 2–4/10 |

**Lido do mais recente para o mais antigo, o número converge para baixo, e converge para o
gate.** O 4/10 que colide com o *encerra a sessão* do §1.2 é a posição dele de **2024**; a
de **2026** é 2/10, que é o limiar de congelamento do gate. Isso não estava escrito em
lugar nenhum e sai só de cruzar `conflicts` com a data do manifesto.

---

## 4. O tratamento aplicado — `conditions` e `conflicts`, sem apagar nada

Nenhuma claim foi apagada, nenhum texto de `claim` foi reescrito, nenhum `verbatim` foi
tocado. O que mudou são arestas e tópicos.

### 4.1 `conditions` acrescentadas

| claim | `conditions` depois | por quê |
|---|---|---|
| `V001-06` | `V001-07`, `V001-29`, `V027-23` | `V001-07` é o critério de revisão (*sessão a sessão, sem aumento de dor*) que torna o 2/10 legítimo; `V001-29` é a ressalva da frase seguinte; `V027-23` é o modo de falha |
| `V079-34` | `V079-39`, `V027-23`, `V086-21` | `V079-39` é o *"be cautious still"* que o extrator perdeu; `V086-21` é o teste de desfecho (*sintomas melhorando ao longo do tempo*), de outro vídeo |
| `V079-32` | `V079-33`, `V079-34`, **`V079-39`**, **`V027-23`** | as duas antigas mais o freio e o modo de falha |
| `V138-20` | `V138-18`, **`V138-33`**, **`V027-23`** | `V138-18` já estava e é a definição operacional; `V138-33` é a ressalva da frase anterior |
| `V138-19` | `V138-18`, `V138-33`, `V027-23` | a faixa mais frouxa da base ganha as três |
| `V138-01` | `V138-18`, `V138-30`, `V027-23` | *"tirar folga é burrice"* passa a abrir no limiar e na honestidade sobre a carga antiga |
| `V171-14` | `V027-23` | *"just work through it"*, de 2021, passa a abrir na correção de 2026 |

Ciclo conferido: `V027-23`, `V001-29`, `V138-33`, `V079-39`, `V138-30` e `V138-18` não têm
`conditions`, então nenhuma das arestas novas fecha o par mútuo que a trava 8b do
`SCHEMA.md` recusa. O `check-claims.mjs` confirma.

### 4.2 `conflicts` acrescentados — e **bidirecionais**

| aresta | o que se contradiz |
|---|---|
| `V027-25` ↔ `V079-34` | *"2–3/10 é boa faixa para empurrar"* × *"eu tinha um pouco de dor, treinava normal através dela, e patinei sem progresso e sem melhora da dor"* |
| `V027-25` ↔ `V138-20` | *"reabilitar com dor leve dá reabilitação mais rápida"* × o mesmo desfecho, no peitoral, no supino |
| `V027-25` ↔ `V138-01` | *"tirar folga por lesão é burrice"* × os anos que ele passou sem tirar folga |
| `V001-06` ↔ `V138-19` | **2/10** × **2 a 4/10** para a mesma grandeza, do mesmo autor, com dois anos e meio de distância |

**Escritas nos dois sentidos, de propósito.** As 40 arestas de `conflicts` que já existiam
são de mão única (só `V090-15`/`V090-16` volta), e mão única esconde a contradição
justamente do lado perigoso: quem chega em `V138-20` numa consulta sobre dor **não** veria
a aresta se ela morasse só em `V027-25`. Isto adianta a tarefa #25 (*ledger de contradições
com link bidirecional*) para as quatro arestas que tratam de tecido.

### 4.3 `topic` corrigidos — a parte que muda a consulta

| claim | tópicos antes | tópicos depois |
|---|---|---|
| `V027-23` | `lesao`, `erro-comum`, `fadiga` | **+ `dor`** |
| `V027-25` | `dor`, `progressao`, `erro-comum` | **+ `supino`, `peito`** |

Sem isso o freio não aparecia na mesma gaveta do acelerador: `V027-23` não saía em
`--topic dor`, e `V027-25` — a única claim da base que conta o desfecho de treinar com dor
**no peitoral, no supino** — não saía em `--topic supino`. Os dois tópicos são fiéis: a
frase de `V027-25` é a continuação direta de `V027-24`, que é *"years of pec tendon issues
on bench"*.

### 4.4 As quatro que o §4.1 deixou cruas — e a quinta que apareceu ao fechá-las

O §2 listou **nove** claims sem `conditions`; o §4.1 fechou cinco e não escreveu uma linha
sobre as outras quatro. Silêncio num documento que se apresenta como varredura é pior do
que lacuna declarada: quem lê a tabela do §2 e a do §4.1 lado a lado conclui que as nove
foram tratadas. **Não foram.** `V138-08`, `V138-13`, `V138-24` e `V138-18` continuaram
cruas por um dia inteiro depois de o arquivo dizer que o cluster estava tratado.

As quatro foram reabertas na transcrição de `R138`, lida inteira em volta de cada `at`.
**Nenhuma ressalva foi inventada.** Todas as arestas abaixo são do mesmo autor, quatro
delas do mesmo vídeo, e três estão **nomeadas dentro do próprio `verbatim`** da claim que
recebeu a aresta.

| claim | `at` | `conditions` | por quê |
|---|---|---|---|
| `V138-08` | 01:01 | `V138-18`, `V027-23` | ver abaixo |
| `V138-13` | 01:32 | `V138-18` | ver abaixo |
| `V138-24` | 03:17 | `V138-18`, `V138-30` | ver abaixo |
| `V138-18` | 02:17 | `V138-33` | ver abaixo |

**`V138-08`** — *"so still doing our primary movement and rebuilding our confidence with it
is key"*. É a autorização inteira para continuar carregando o tecido que dói, e o argumento
que ela carrega é **mental**: as duas claims imediatamente anteriores no mesmo bloco são
`V138-06` (*dor é em parte mental, medo do movimento eleva o nível de dor*) e `V138-07`
(*e isso pode ser independente de haver dano tecidual*). Servida crua a um peitoral em
reexposição, ela diz *continue supinando, o problema é o medo*. `V138-18` é a metade que
falta e está no mesmo vídeo, 76 s depois: no exercício doloroso se **reduz peso absoluto e
proximidade da falha**. A irmã dela, `V138-05` em 00:46 — *"o exercício que causa dor
continua sendo feito"* —, já abria em `V138-18`; `V138-08` é a mesma instrução dita de novo
e tinha ficado sem. `V027-23` porque é a correção que o autor fez a si mesmo em 2026:
*lesão pequena acaba sendo movida mais do que deveria, e é justamente porque é fácil
treinar através dela.*

**`V138-13`** — *"even if it's something like having a squat just body weight to half depth
we have to start somewhere"*. É o ramo do caso extremo, e já carrega o próprio piso de dose
no texto (peso corporal, meia profundidade). O que faltava é o teto: `V138-18`, que governa
quanto aquele movimento pode ser carregado enquanto dói. **Não recebeu `V027-23`, e a
ausência é decisão, não esquecimento:** `V027-23` fala de lesão **menor** sendo movida
demais, e `V138-13` é o ramo da lesão **grave** em que a carga já é zero. Pendurar ali a
ressalva de outro caso por semelhança de assunto seria exatamente a ressalva fabricada que
o §6 recusa.

**`V138-24`** — *"each day we work up to a weight we can do while staying under **our pain
threshold**"*. A condição está **dentro do verbatim**, e o id dela é `V138-18`: sem a
aresta, o leitor recebe a instrução e não recebe a definição do limiar a que ela obedece —
a forma exata do defeito que `conditions` existe para impedir. `V138-30` é para a segunda
metade da frase, que é uma promessa: *"done correctly we will naturally get back to our old
or near our old strength levels"*. O mesmo vídeo, 45 s depois, manda desconfiar do
**"old"**: *"be honest with yourself on if your old workload in terms of intensity and
volume combined was too much"*. É o mesmo par que o §4.1 montou para `V138-01`.

**`V138-18`** — a definição do limiar, e a claim de que as outras seis dependem. Ela **não**
recebe as ressalvas das outras porque ela **é** a ressalva das outras: é a única do cluster
que manda **reduzir** — peso absoluto e proximidade da falha —, e o critério dela, *não se
sentir pior na sessão seguinte*, é o próprio teste de segurança que o §1 usa para provar
que o cluster inteiro fala numa escala de tempo maior que uma série. O que faltava nela é o
hedge que o autor pendura na frase **seguinte**, 15 s depois e sobre este exato limiar:
`V138-33`, *"everybody and every injury is different and we have different pain
tolerances"*. Sem ciclo: `V138-33` não tem `conditions`, então o par mútuo que a trava 8b
do `SCHEMA.md` recusa não se fecha — o `check-claims.mjs` confirma.

**E a quinta, que apareceu ao fechar as quatro: `V138-21`** (02:47) — *"warm up gradually
with small jumps and you should be able to stay under **this pain threshold** easily"*.
Mesmo caso literal de `V138-22` e `V138-24`: nomeia o limiar no próprio verbatim e não
abria nele. Recebeu `V138-18`. **Ela não estava nas nove do §2** porque não tem número nem
nenhuma das palavras do vocabulário da varredura — o que diz que a varredura do §2 também
tem borda, e que *"o verbatim nomeia uma coisa que a claim não carrega em `conditions`"* é
um predicado mecânico que ainda ninguém rodou sobre a base inteira. Fica registrado como
dívida, não como feito.

---

## 5. A trava que não enxergava a dose — dois eixos, e os dois estavam errados

`check-claims.mjs` avisa quando uma `modo: prescricao` **com dose** não tem `conditions`.
É a checagem escrita para exatamente este defeito. **Ela nunca acusou nenhuma das três
claims que carregam número de dor**, e não por um motivo, por dois — um em cada eixo do
predicado. O primeiro foi consertado na manhã de 9/8/2026. O segundo, à noite; e a versão
de manhã desta seção afirmava sobre ele uma coisa falsa.

### 5.1 O eixo do frame — `escala_dor` fora de `FRAMES_DOSE`

Modo de falha nº 2 desta casa, num lugar novo: `FRAMES_DOSE`, em `kb.mjs`, nasceu pensando
em carga, série, percentual e frequência — `series`, `reps`, `x_semana`, `RPE`, `kg`,
`lb`… **A dose destas claims está em `escala_dor`**, e a lista não tinha essa gaveta. Uma
prescrição que diz *quanto pode doer* é dose como qualquer outra, e escapava pela borda da
própria trava desenhada para pegá-la.

`escala_dor` entrou em `FRAMES_DOSE`, e o custo de ruído foi zero: `V001-06` e `V079-34`
foram fechadas no mesmo passe, e a contagem de *prescrição com dose e sem conditions* ficou
em 23 antes e 23 depois.

### 5.2 O eixo do modo — e a frase falsa que ficou aqui um dia

O que a versão de manhã desta seção escreveu, e que virou dívida no mesmo dia:

> ~~*qualquer claim futura que prescreva um número de dor sem condição para o build.*~~

**Era falso, e o contraexemplo estava dentro da própria família.** A trava exigia
`modo === 'prescricao'`, e `V138-19` — limiar de **2 a 4**/10, quatro params em
`escala_dor`, topo exatamente no gatilho de *encerrar a sessão* do `PROGRAMA.md` §1.2 — é
**`modo: opiniao`**. Apagar as `conditions` dela não mudava uma linha da saída do checker.
Ampliou-se o eixo do frame e deixou-se aberto o eixo do modo — e foi justamente por ser
`opiniao` que ela já tinha escapado da medição original (§2). **A mesma porta, duas vezes,
no mesmo dia.**

**E o eixo do modo não se conserta apertando `prescricao`.** Olhe o par:

| claim | verbatim | `modo` |
|---|---|---|
| `V079-34` | *"**Anecdotally, I have found that** two to three out of 10 pain level is a good amount to push at"* | `prescricao` |
| `V138-19` | *"**anecdotally** … on the pain scale of 1 to 10 **I find** the usual level to be around the 2 to four"* | `opiniao` |

Mesmo autor, mesma forma de frase, mesmo número para a mesma decisão do leitor, gavetas
diferentes. **A fronteira `prescricao` × `opiniao` é julgamento de extrator** — o
`FRONTEIRA-MODO.md` mede o tamanho desse borrão em outros pares —, e uma trava cujo eixo o
extrator desliga sem querer não é trava. Uma lista de **inclusão** com os dois modos seria
desligada pela mesma deriva na terceira vez: modo de falha nº 2 outra vez, a trava estreita
empurrando o dado para fora dela.

**O eixo que ficou**, e ele é por EXCLUSÃO: para `escala_dor`, *para quem o número é*
(`scope: GERAL`) × *se o modo entrega um alvo* — todos, **menos**
`MODOS_DESCRITIVOS = {mecanismo, fato, estudo}`.

A exclusão é o conteúdo da decisão, e é ela o freio contra o excesso. `mecanismo` explica
**por que** algo acontece — na própria `R138`, `V138-06` é *"dor é em parte mental e não só
física"*. Um número de dor dentro desses três — *"nociceptores respondem a partir de X"*,
*"o protocolo do estudo limitava a 5 de 10"* — **descreve, não manda**, e varrê-los junto
produziria a lista de avisos que ninguém lê, que é o outro jeito de uma trava morrer.
Medido em 9/8/2026: alargar `opiniao` para **todos** os frames de dose acrescentaria 43
avisos `GERAL` + 19 `PESSOAL` sobre os 23 de hoje — quase o triplo. Restrita a
`escala_dor`, a trava governa **3 claims em 6.912**.

**Erro, e não aviso** — ao contrário da dose comum, por duas razões que não valem lá:

1. o custo do falso negativo aqui é tecido, não uma série a mais — este repositório serve
   um atleta com histórico de lesão de peitoral, num bloco de reexposição do supino;
2. como as três claims de `escala_dor` já carregam `conditions`, a trava hoje acusa zero, e
   uma trava que acusa zero não tem como degenerar em lista ignorada. Ou está calada, ou
   parou o build.

A saída para um número de dor genuinamente incondicional **não** é afrouxar isto: é ligar a
ressalva que a fonte disse, ou escrever a claim no modo que a descreve. Ressalva fabricada
é pior que ressalva ausente (§6).

### 5.3 A prova por mutação — as duas metades

Trava silenciosa é indistinguível de trava desligada, e trava que se testa contra si mesma
é o modo de falha nº 4. Então as duas metades, **executadas e não deduzidas**:

```
$ (apaga "conditions" de V138-19 em research/extract/R138.jsonl)
$ node research/tools/check-claims.mjs
  ✗ R138.jsonl:19 V138-19: número de dor (escala_min=1, escala_max=10, limiar_min=2,
    limiar_max=4) em GERAL/opiniao sem conditions — um limiar de dor servido cru vira
    alvo. Ligue a ressalva que a fonte disse, ou reclassifique se a claim descreve em
    vez de mandar (ver DOR-E-TREINO.md §5)
$ echo $?          → 1

$ (restaura as conditions)
$ node research/tools/check-claims.mjs ; echo $?
  ✓ toda claim resolve, todo verbatim existe, todo número tem frame   → 0
```

E os dois lados entraram no `check-claims.test.mjs`, que é onde eles sobrevivem a quem
mexer aqui depois:

- **recusa** — *número de dor em GERAL sem conditions, num modo que não é prescricao*.
  Montado em `opiniao` de propósito: montado em `prescricao` ficaria verde pela trava
  velha e não provaria nada.
- **aceita** — *número de dor em mecanismo, que descreve em vez de mandar*. É este que
  decide se a trava está num eixo ou se apenas varreu tudo. Se ele ficar vermelho, a trava
  virou aviso universal sobre toda menção a dor.

---

## 6. O QUE A BASE NÃO TEM — e que eu me recusei a inventar

Duas ausências, ambas contadas por busca exaustiva, ambas dirigidas ao caso deste atleta.
**Condição fabricada é pior que condição ausente**, então elas ficam aqui, escritas, e não
viraram claim.

### 6.1 Zero claims sobre dor que APARECE dentro da série

`--grep` em `mid-set`, `stop the set`, `during the set`, `sharp pain`, `pop`, `popped`,
`tear`, `acute`. **Nenhuma claim descreve o que fazer quando uma dor nova surge no meio de
uma série.** O corpus inteiro fala de dor **já conhecida**, com a carga escolhida antes.
`V138-29` chega perto — *"tive uma das piores lesões da vida numa série de aquecimento"* —
e é `PESSOAL`/`anedota`, sem nenhuma instrução.

Consequência prática, e é a mais importante deste arquivo: **para a pergunta (b) do §1, a
base não tem resposta, e o `PROGRAMA.md` §1.2 tem.** A linha *"≥4/10 ou estiramento agudo
encerra a sessão"* não é um desvio da base — é o preenchimento de um vazio que a base não
cobre. Quem responder sobre dor no supino tem de dizer isso nesses termos, e não fingir que
está arbitrando entre duas fontes.

### 6.2 Zero claims mandando procurar avaliação presencial

`--grep`: `doctor` **0** · `diagnos` **0** · `imaging` **0** · `MRI` **0** · `surgeon` **0**
· `physio` 5 hits, **todos** `physiology`/`physiological` · `medical` 1 hit, é fita de
polegar no regulamento (`F001-100`) · `professional` 1 hit, é *"as a professional power
lifter"* (`G020-01`).

O mais perto que a base chega é `V171-03`, *"I really like Barbell Medicine stuff,
especially for injuries"* — **uma recomendação de leitura, não um encaminhamento.**

> **Uma resposta 100 % fiel a esta base é uma resposta que nunca manda ele procurar
> ninguém.** O `MEDICAO-02.md` §6.2 já tinha registrado isso; aqui está recontado, com o
> vocabulário testado. **Isto não se conserta com `conditions`** — não há a que ligar. É
> aquisição de fonte, e é o único item deste arquivo que uma rodada de índice não resolve.

---

## 7. A contradição com o §1.2 — o que foi feito, e o que NÃO deu para fazer

O `PROGRAMA.md` §1.2 é norma assinada **para este atleta**; as quatro claims são conselho
geral de um canal. Onde brigam, quem lê precisa ver as duas.

| | limiar | o que acontece |
|---|---|---|
| `PROGRAMA.md` §1.2 | **≥2/10** | congela `TM_supino` e o degrau de exposição, **sem recuo** |
| `PROGRAMA.md` §1.2 | **≥4/10** ou estiramento agudo | **encerra a sessão**, cai ao degrau das S1–S2 |
| `V001-06` (2026) | ~2/10 | é *"a carga de trabalho aproximadamente certa"* |
| `V079-34` (2025) | 2–3/10 | é *"boa faixa para empurrar"* |
| `V138-19` (2024) | 2–4/10 | é *"onde o limiar costuma ficar"* |

**A briga é menor do que parecia, e o lugar dela é preciso.** Somando `V001-06` com a
condição que ela agora carrega — `V001-07`, *progredir sessão a sessão **sem aumento de
dor*** — o que sai é: *pode treinar naquele nível, não pode subir carga*. Que é,
literalmente, a linha `congela … sem recuo` do §1.2. **A norma e a claim mais recente
concordam sobre o degrau de 2/10.** O que colide de verdade é o **4/10 de `V138-19`**, de
2024, contra o *encerra a sessão* — e essa aresta agora está registrada
(`V001-06` ↔ `V138-19`).

### O que NÃO deu para fazer, e por quê

**A contradição norma × claim não virou aresta de `conflicts`, e não dava para virar.**
`conflicts` só aceita id de claim, e o `PROGRAMA.md` não é claim: não é `tier: O` (o
compilador confere `tier: O` contra `research/corpus/ipf/rulebook-2026.md`, e o §1.2 não
está lá), e uma claim `tier: I` não tem onde morar — a regra de id amarra **toda** claim a
um arquivo de extract de um corpus de vídeo (`SCHEMA.md`, *A regra de id*). Abrir corpus
novo para hospedar uma interpretação seria trava estreita empurrando dado para fora da
trava, que é o modo de falha nº 2.

**O que foi feito no lugar, e funciona:** a ponte foi construída inteira com claims. O §1.2
já cita `[R27 @05:08]` como o modo de falha a evitar; agora `V027-25` — a claim daquele
trecho — está ligada por `conflicts` às três permissões, **nos dois sentidos**, e carrega
os tópicos `supino` e `peito`. Quem chegar por qualquer uma das cinco pontas vê as outras.

### Duas divergências que ficam ABERTAS, e são de outro dono

1. **`[R79]` está rotulado `[PESSOAL]` no `PROGRAMA.md` §1.2 e `scope: GERAL` na base.**
   Reli o verbatim inteiro: *"Anecdotally, I have found that two to three out of 10 pain
   level is a good amount to push at though ultimately **adjust to what you need** for your
   symptoms to improve over time"*. Ele não descreve o que faz — ele recomenda, e endereça
   o ouvinte. **`GERAL` está certo; o rótulo do `PROGRAMA.md` está errado**, e erra na
   direção conservadora (desconta a claim, não afrouxa nada). De quebra, o `@03:35` do §1.2
   aponta um bloco antes do trecho: a frase está em `[03:47]`.
2. **Não editei o `PROGRAMA.md`.** Ele estava com modificações não commitadas no momento
   deste passe, é lido por máquina (`scripts/gate-dor.mjs` → `VENA_BLOCK1_PAIN_GATE`) e é a
   fonte do `generated.ts`. Mexer nele em paralelo com outro dono é o jeito de a tabela do
   gate divergir do app em silêncio, que é o defeito que o §1.2 existe para não repetir. O
   conserto é de uma palavra e está especificado acima.

---

## 8. Dois defeitos do próprio `MEDICAO-02.md` §6.1

Registrados aqui porque §6.1 vai ser citado, e porque o §9 daquele arquivo pede
justamente que o que não foi verificado seja conferido.

1. **"as quatro SEM `conditions` registradas" é falso, e era falso no commit que publicou
   a medição.** Em `f19c304`, `V138-20` já trazia `conditions: ["V138-18"]` e `V079-32` já
   trazia `["V079-33","V079-34"]`. Sem `conditions` estavam **duas**: `V001-06` e
   `V079-34`. Conferido com `git show f19c304:research/extract/…`.
2. **O agravante do §6.1 está com o sinal invertido.** Ele registra a divergência
   `[R79] PESSOAL` × `scope: GERAL` como se a base estivesse errada. É o `PROGRAMA.md` que
   está — ver §7, item 1.

E um terceiro, que a medição não podia ter visto porque é de código: **o cluster passava
limpo pela trava desenhada para ele**, por `escala_dor` estar fora de `FRAMES_DOSE`
(§5). *"As quatro saem limpas de qualquer filtro"* era ainda mais verdade do que a frase
dizia.

---

## 9. A VERIFICAÇÃO — a consulta antes e depois

Conserto que não muda a consulta não conserta nada. Estas são as buscas que um agente de
conversa faz sobre *"dor no supino"*, reproduzíveis linha a linha.

### 9.1 `--topic supino --grep pain` — a consulta mais direta

Rodada sobre o `HEAD` e sobre a árvore de agora, pelo mesmo predicado:

```
ANTES : V012-14 V020-12 V021-12 V089-20 V095-23 V095-24 V164-34 V167-17
AGORA : V012-14 V020-12 V021-12 V027-25 V089-20 V095-23 V095-24 V164-34 V167-17
NOVO  : V027-25
```

E `V027-25` sai **carregando as três arestas**:

```
V027-25  R027@05:21  tier:R scope:PESSOAL modo:anedota genero:aula
  tópicos: dor, progressao, erro-comum, supino, peito
  A dor moderada piorava a qualidade do treino dele, e o resultado foi patinar
  sem progresso enquanto a dor também não melhorava.
  conflita: V079-34, V138-01, V138-20
```

**A consulta sobre dor no supino agora entrega, por si só, o desfecho de treinar com dor no
peitoral e os ids das três claims que dizem para fazer isso.** Antes ela não entregava
nenhum dos quatro.

### 9.2 `--topic dor --modo prescricao --scope GERAL` — o filtro que vira treino

25 claims. As duas que mais importam saem assim:

```
V001-06  …  params: dor_alvo=2 dor_0a10 [escala_dor]
  condições: V001-07, V001-29, V027-23
  conflita: V138-19

V079-34  …  params: dor_min=2  dor_max=3  escala_max=10 [escala_dor]
  condições: V079-39, V027-23, V086-21
  conflita: V027-25
```

Antes as duas saíam **sem uma linha de `condições` e sem uma linha de `conflita`** — sete
palavras a mais de contexto e nada mais. **É essa a diferença entre um número servido cru e
um número servido com o freio.**

### 9.3 A consulta que este bloco existe para responder — rodada inteira

Documento bom e trava verde não provam nada se a base ainda serve o número cru. Então a
pergunta real do atleta, palavra por palavra:

> *"senti uma fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"*

```
$ node research/tools/check-evidence.mjs --busca "senti uma fisgada de 3/10 no peitoral \
    na terceira série de supino pausado, continuo?"

0 claim(s) …  ⚠ RESULTADO VAZIO
VIZINHANÇA: V145-26 · G007-28 · G022-28 · G003-23 · V118-17 · V142-25 …
```

**Nenhuma claim de dor no resultado.** A busca casou `terceira série`, `supino` e `pausado`
e foi inteira para pegada fechada, índice de estresse e log de treino. `3/10` vira dois
números soltos e `fisgada` não está no `VOCABULARIO.md`. Isto é **defeito da camada de
busca, não do conserto deste arquivo** — é de outro dono, e está registrado aqui porque a
saída é a evidência. O efeito é conservador por acidente (não serve o número), não por
desenho.

Reformulando com a palavra que a base usa — que é o que o próprio aviso de resultado vazio
manda fazer —, a claim aparece, **e aparece com o freio grudado**:

```
$ node research/tools/check-evidence.mjs --busca "dor 3 de 10 no supino, continuo?"

 1º  casou: dor, escala, #10, pain, #3, de
    V079-34  R079@03:47  tier:R scope:GERAL modo:prescricao genero:aula explicit
      tópicos: dor, lesao, autorregulacao
      Anedoticamente, ele achou que um nível de dor de 2 a 3 numa escala de 10 é uma boa
      faixa para empurrar na reabilitação, ajustando ao que faz os sintomas melhorarem…
      params: dor_min=2  dor_max=3  escala_max=10 [escala_dor]
      condições: V079-39, V027-23, V086-21
      conflita: V027-25
```

E as três `condições` resolvem em uma linha cada:

- `V079-39` — *"Be cautious still"*
- `V027-23` — *lesões menores acabam sendo movimentadas mais do que deveriam, justamente
  porque é fácil treinar através delas*
- `V086-21` — *treinar com dor leve pode ser aceitável, mas os sintomas precisam estar
  melhorando ao longo do tempo*

Mesma coisa por `--busca "limiar de dor para continuar treinando"`, que devolve `V001-05`,
`V138-19`, `V138-21`, `V138-22`, `V177-11` e `V079-34` — e as seis saem com `condições`
preenchidas, porque as quatro do §4.4 e a quinta fecharam as últimas cruas do cluster.

**O que a resposta correta a essa pergunta ainda tem de dizer, e nenhuma claim diz:** o
2–3/10 do `V079-34` é escolha de carga **antes** da série, julgada de uma sessão para a
outra (§1); a fisgada nova no meio da terceira série é a pergunta (b), e para ela **a base
não tem resposta** (§6.1). Quem responde manda congelar em ≥2/10 e encerrar em ≥4/10 pelo
`PROGRAMA.md` §1.2, e diz que é o §1.2 que está mandando — não a base. A trava do §5 impede
que o número saia cru; ela não substitui essa frase.

### 9.4 O caminho inverso continua fechado

`--grep "pec tendon"` devolve `V027-24` e `V095-23`; `V027-24` é vizinha de `V027-25` no
mesmo vídeo e leva ao mesmo lugar. E `--grep doctor|diagnos|MRI|surgeon` continua devolvendo
**zero** — a lacuna do §6.2 **não** foi mascarada por este passe, e não deve ser.

---

## 10. Procedência e estado

- **Comandos que provam este arquivo:**
  ```
  npm run check:kb            # verde
  npm run build               # verde
  npm run check:gate          # verde, 59 cenários
  node research/tools/check-evidence.mjs V001-06 V079-34 V138-20 V079-32 V138-19 V138-01 \
                                         V027-23 V027-25 V001-29 V079-39 V138-33 V171-14
  node research/tools/check-evidence.mjs --topic supino --grep pain --limit 0
  node research/tools/check-evidence.mjs --topic dor --modo prescricao --scope GERAL --limit 0
  ```
- **Base antes → depois:** 6.909 → **6.912** claims (tier R 6.766 → **6.769**).
  `condições registradas` 502 → **512** claims (678 → **702** arestas), sendo o segundo
  passe (§4.4) 5 claims e 7 arestas — nenhuma claim nova foi criada nele.
  `contradições registradas` 31 → **37** claims (40 → **48** arestas).

  > **Estes dois totais já estiveram errados, e o modo de falha é o nº 5 desta casa.** A
  > versão de 9/8/2026 dizia `511 claims / 701 arestas` e `5 claims e 6 arestas` no segundo
  > passe. Os dois números foram fechados **antes** de `V138-21` — a quinta do §4.4, achada
  > ao fechar as outras quatro — entrar, e ninguém recontou depois: `V138-21` acrescenta
  > exatamente 1 claim e 1 aresta, que é a diferença inteira. A soma do passe também estava
  > internamente torta, com a quinta contada nas claims (5) e não nas arestas (6 em vez de
  > 7 — são 2+1+2+1+1). Número escrito à mão em prosa não tem quem o verifique, que é o
  > oposto do princípio desta base. **Recontagem, e ela é a autoridade sobre as linhas
  > acima:**
  >
  > ```
  > cat research/extract/*.jsonl | node -e 'let s="";process.stdin.on("data",d=>s+=d)
  >   .on("end",()=>{let cc=0,ca=0,fc=0,fa=0;for(const l of s.trim().split("\n")){
  >   if(!l.trim())continue;const c=JSON.parse(l);
  >   if((c.conditions||[]).length){cc++;ca+=c.conditions.length}
  >   if((c.conflicts||[]).length){fc++;fa+=c.conflicts.length}}
  >   console.log("condicoes",cc,"/",ca,"  contradicoes",fc,"/",fa)})'
  > → condicoes 512 / 702   contradicoes 37 / 48
  > ```
  >
  > Rode antes de citar qualquer um dos quatro. E note o que a recontagem **não** separa:
  > ela mede a base inteira, e os `G*.jsonl` são de outro dono nesta onda — se o total
  > subir sem que nenhum `R*.jsonl` desta família mude, a diferença é de lá, não daqui.
- **`check-canarios.mjs`** continua `5 presente · 5 impossivel · 5 armadilha`, exit 0, e
  passa a imprimir a deriva `total de claims: 6909 → 6912`. **O `baseNoMomento` do
  `CANARIOS.json` NÃO foi atualizado**: aquele bloco registra a base no dia em que os
  canários foram escritos, e sobrescrevê-lo apagaria exatamente o aviso que ele existe para
  dar. O aviso é o comportamento correto.
- **Arquivos tocados:** `research/extract/R001.jsonl`, `R027.jsonl`, `R079.jsonl`,
  `R138.jsonl`, `R171.jsonl`; `research/tools/kb.mjs` (`escala_dor` em `FRAMES_DOSE` e o
  novo `MODOS_DESCRITIVOS`, com o motivo no comentário); `research/tools/check-claims.mjs`
  (a trava do §5.2) e `research/tools/check-claims.test.mjs` (os dois casos do §5.3).
  **Nenhum `G*.jsonl` foi tocado** — eles são de outro dono nesta onda, e o `git status`
  confirma `G020`/`G027` modificados por lá. **`check-evidence.mjs` também não**: o defeito
  de busca do §9.3 é da camada de outro dono, e consertá-lo aqui em paralelo é o jeito de
  os dois consertos se atropelarem.
- **O que NÃO foi verificado por mim:** se o §1.2 do `PROGRAMA.md` foi editado por outro
  agente durante este passe — ele já estava sujo quando comecei. Quem for aplicar o conserto
  de uma palavra do §7-1 tem de reler o parágrafo antes.
- **Limite declarado, e vale para tudo acima:** o determinismo aqui prova **fidelidade à
  fonte** — que cada `verbatim` está na transcrição, que cada id resolve, que nenhuma aresta
  fecha ciclo. **Ele não prova que a fonte está certa.** As nove claims desta família são
  `tier R` de **um homem só**, sem literatura por trás (`tier L = 0`), e o que decide contra
  elas neste bloco é o `PROGRAMA.md` §1.2, que é norma assinada — não é a base ganhando a
  discussão.
