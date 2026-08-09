# Protocolo de extração

Instrução única para todos os agentes que transformam transcrição em claim.
Leia junto com `SCHEMA.md`, que define o registro.

## O trabalho

Ler um lote de transcrições e emitir claims atômicas em JSONL. Não é resumir o
vídeo. Não é avaliar se o Vena tem razão. É **registrar o que ele diz, de forma
que dê para conferir depois** — e separar o que ele diz do que você concluiu.

## Vocabulário de tópicos — FECHADO

Sem banco vetorial, o `topic` é o mecanismo de recuperação. Vocabulário livre
mata isso: `agacho`, `agachamento`, `squat` e `sq` viram quatro gavetas para a
mesma coisa e o grep de nenhuma delas acha tudo. Use **exclusivamente** estes:

```
agacho  supino  terra  tecnica  profundidade  pegada  setup  barra-alta  barra-baixa
sumo  convencional  comandos-ipf  regras-ipf
programacao  volume  intensidade  frequencia  progressao  periodizacao  taper  deload
rpe  autorregulacao  selecao-exercicio  tier-list  series-reps
acessorios  hipertrofia  bracos  ombros  costas  peito  pernas  posterior  core
lesao  dor  mobilidade  aquecimento  fadiga  recuperacao  sono
equipamento  cinto  faixa  sapato  strap
nutricao  peso-corporal  cutting  bulking
mentalidade  competicao  pico  teste-de-forca  cardio  condicionamento
natural-vs-enhanced  erro-comum  meta-metodologia
antropometria  genetica  capacidade-trabalho  rom  ordem-exercicio
saude  aprendizado-motor  idade
carga-de-treino  training-max  proximidade-da-falha  descanso-entre-series
estagnacao  powerbuilding
```

As seis últimas entraram em 2026-08-09; `research/kb/ENUMERADOS.md` registra por
que elas e não as outras catorze que foram pedidas. Em resumo:

- `carga-de-treino` — quanto estresse o treino custa, medido: o *stress index*
  e a banda em que ele é mantido ao longo de um bloco.
- `training-max` — como o TM é definido, ajustado e recalculado. Cada programa
  faz diferente, e foi confundir 1RM com TM que originou este esquema.
- `proximidade-da-falha` — AMRAP, treinar até a falha, quantas reps sobram. É o
  eixo da divergência mais consequente da base, e não tinha gaveta.
- `descanso-entre-series` — o intervalo dentro da sessão. `recuperacao` é entre
  sessões; misturar os dois responde a pergunta errada.
- `estagnacao` — o platô e o que fazer com ele.
- `powerbuilding` — combinar força e tamanho, que é o objetivo declarado do
  consumidor desta base.

Esta lista não é decorativa: `check-claims.mjs` a lê deste arquivo e **recusa
qualquer tópico que não esteja aqui**. Documento e trava são o mesmo objeto de
propósito — já erramos deixando o enumerado de `frame` crescer no código
enquanto o `SCHEMA.md` descrevia outra coisa.

**Nunca force um número numa gaveta errada para satisfazer o checker.** Um lote
mapeou gramas e calorias para o frame `kg` e semanas para `anos` — que é
exatamente o erro de unidade que este esquema existe para impedir, reintroduzido
pelo contorno da trava. Se faltar frame, relate no resumo final e deixe o número
por extenso; aviso é barato, dado errado não é.

Precisou de um tópico que não está aqui? **Não invente.** Use o mais próximo e
registre a falta no relatório final. O vocabulário cresce por decisão, não por
acúmulo — e a decisão fica escrita em `ENUMERADOS.md`, com as recusas junto das
aceitações. Tópico é o mecanismo de recuperação: se todo assunto vira tópico, o
filtro por tópico deixa de estreitar qualquer coisa.

Frame é o contrário e a assimetria é de propósito: **faltar frame é pior do que
ter frame demais**, porque frame não serve para achar nada — serve para impedir
que um número atravesse duas semânticas sem ninguém ver. Se o número que você
tem não cabe em nenhuma gaveta, relate; a gaveta provavelmente vai ser aberta.

## Um arquivo por vídeo

As claims do vídeo `R014` vão para `research/extract/R014.jsonl`. Uma claim por
linha.

**Lote é divisão de trabalho, não unidade de conhecimento.** Você recebe um lote
de vídeos porque alguém precisava repartir a tarefa, mas o arquivo nunca é
`lote_07`: quem consulta a base parte de uma citação `[R014 @03:05]` e o caminho
tem que sair dela sozinho, sem índice no meio. Isso também torna a regeneração
idempotente — refazer um vídeo reescreve um arquivo e não mexe em mais nada.

## Alocação de id

O id sai do **nome do arquivo**, com a sequência começando em 01 dentro de cada
vídeo:

```
research/extract/G008.jsonl  →  G008-01, G008-02, …
research/extract/F001.jsonl  →  F001-01, F001-02, …
research/extract/R014.jsonl  →  V014-01, V014-02, …   ← só o Vena
```

O prefixo do id é igual ao prefixo do ref para **toda** fonte, menos o Vena, que
usa `V`. A assimetria é histórica e está travada em `sources.mjs` (`idPrefix`):
os ids do Vena nasceram como `V{ref}` quando havia uma fonte só e `V` queria
dizer "vídeo". Com a segunda fonte a fórmula quebrou — `G010` daria `V010-01`,
que já é do `R010.jsonl` — e renumerar os 4.947 ids do Vena, já citados por
`conflicts`, `basis` e `conditions`, é a única coisa que este esquema proíbe sem
exceção. Então a exceção fica no registro de fontes, declarada, em vez de virar
folclore.

O `check-claims.mjs` recusa id que não case com o arquivo e id que não tenha a
forma `{LETRA}{NNN}-{seq}`. A segunda regra não é cosmética: o
`check-evidence.mjs` — a ferramenta que este protocolo manda usar para resolver
citação — só reconhece essa forma, e **em silêncio**. Meia ingestão do Blevins
saiu como `VG036-01` e toda aresta que apontava para lá ficou inverificável sem
uma linha de reclamação.

Nunca reutilize, nunca renumere — contradições e sínteses vão apontar para esses
ids.

## O que é uma claim

Uma afirmação que você consegue amarrar a segundos específicos da transcrição.

**Sim:**
- uma prescrição (`GERAL`): "manter 2 a 3 repetições na reserva na maioria das séries"
- uma prática dele (`PESSOAL`): "ele treina agachamento duas vezes por semana"
- um mecanismo alegado: "inclinar mais o tronco aproveita melhor os extensores de quadril"
- um número: qualquer série, repetição, percentual, RPE, quilo, minuto
- uma negação: "ele não usa deload de rotina"
- um erro que ele nomeia: "tentar ficar ereto demais no agachamento"

**Não:**
- "ele fala sobre agachamento" — não é afirmação
- "o vídeo é bem argumentado" — é opinião sua sobre o vídeo
- "ele prefere low bar e acha que a maioria agacha ereto demais e sugere mais inclinação" — são três claims espremidas em uma

O teste: se você não aponta os segundos, não é claim. É síntese, e síntese mora
em `synth/` com `basis`.

## `scope` — a distinção que a run 1 perdeu

O Matt Vena alterna entre prescrever para o espectador e narrar o próprio treino,
e a run 1 achatou os dois em prescrição. É a diferença entre "faça singles pesados"
e "eu faço singles pesados" — para um atleta natural de 87 kg copiando um cara que
agacha 400 kg, essa diferença é a coisa mais importante da base inteira.

- `GERAL` — ele está dizendo o que **você** deve fazer.
- `PESSOAL` — ele está dizendo o que **ele** faz.

Na dúvida, `PESSOAL`. Promover pessoal a geral é o erro caro; o contrário é só
conservador.

## `modo` — que tipo de afirmação é

Enumerado FECHADO, travado pelo `check-claims.mjs`. `scope` diz **para quem**;
`modo` diz **que tipo de coisa**.

| modo | quando |
|---|---|
| `prescricao` | ele manda **você** fazer. **É o único que pode virar treino.** |
| `relato-de-programa` | ele descreve o método **de outra pessoa** — 5/3/1, nSuns, PHUL, Sheiko, StrongLifts |
| `avaliacao-de-terceiro` | ele corrige **uma pessoa específica** a partir do vídeo dela |
| `opiniao` | ele acha, sem mandar fazer |
| `mecanismo` | por que funciona — fisiologia, alavanca, causa alegada |
| `estudo` | ele narra literatura. Continua sendo ele contando: não vira `tier: L`. |
| `pratica-pessoal` | **o que ele faz de rotina** — o que alguém poderia copiar |
| `narrativa` | um episódio: aconteceu uma vez, tem data |
| `fato` | o que ele **é** ou o que o mundo **é** — sem ocorrência, sem data |

Os dois do topo são a distinção que a ingestão do Blevins pediu cinco vezes, de
forma independente. Metade do corpus dele é review de programa alheio, e "o nSuns
manda AMRAP a 95 % do training max" ficava indistinguível de "faça AMRAP a 95 %
do training max". Para quem monta treino a partir daqui, essa confusão é do mesmo
tamanho da que separa `GERAL` de `PESSOAL`.

**O teste de quem fala, nesta ordem:**

1. Ele está enunciando o que **outro programa** manda? → `relato-de-programa`,
   mesmo que a frase esteja no imperativo. O imperativo é do Wendler, não dele.
2. Ele está falando do corpo, do vídeo ou do caso **de uma pessoa específica**?
   → `avaliacao-de-terceiro`. O contexto que justifica aquele conselho é o dela,
   e você não tem esse contexto.
3. Ele generaliza a partir do caso ("todo mundo que faz X deveria Y")? → aí sim
   `prescricao`, e a claim tem de estar escrita na forma geral.

Na dúvida entre `prescricao` e os dois, escolha um dos dois. Promover relato a
prescrição é o erro caro; o contrário é só conservador.

### ANTES do teste de quem fala: abra o `genero` do vídeo

**O teste acima, sozinho, manda você para a resposta errada — e isso foi
medido.** A pergunta 3 diz "ele generaliza a partir do caso? → aí sim
`prescricao`, e a claim tem de estar escrita na forma geral". Só que a extração
normaliza a claim para prosa geral de qualquer jeito: nos 20 vídeos de review do
Blevins, **82 %** das claims então em `prescricao` não nomeavam o programa no
texto; nos 5 de form check, **90 %** não tinham marcador de pessoa específica.
`G028-02` é *"manter a cabeça em posição mais neutra e para cima no
agachamento"* — segue o protocolo à letra e vira `prescricao`, e é conselho para
um desconhecido que mandou um vídeo.

O sinal que falta não está na claim. Está no vídeo, e desde 2026-08-09 está
declarado no manifesto, no campo `genero`:

```
node -e "const m=require('./research/corpus/blevins/manifest.json');
         console.log(m.videos.find(v=>v.ref==='G016').genero)"   # review-de-programa
```

**A regra, e ela vem antes de tudo:**

| `genero` do vídeo | o que sai dali |
|---|---|
| `review-de-programa` | o método é de outro autor → `relato-de-programa`, mesmo em imperativo |
| `form-check` | o conselho é para um corpo específico → `avaliacao-de-terceiro` |
| `coaching-call` | idem, para um praticante nomeado → `avaliacao-de-terceiro` |
| qualquer outro | siga o teste de quem fala normalmente |

`prescricao` vinda de um dos três primeiros é **exceção que você tem de
defender**, não o caso comum: só quando ele sai do material alheio e enuncia uma
regra dele ("independentemente do programa, faça X"). O `check-claims.mjs` conta
essas ocorrências contra um teto por vídeo, e o teto só desce — lote novo que
passar do teto **falha o build**.

**"Exceção que você defende" não quer dizer "raridade".** As 76 que hoje ocupam a
fila foram lidas uma a uma, e a maioria é exceção legítima: nos cinco form
checks, as 18 são padrão técnico universal (*"o joelho passa por cima do segundo
dedo"*, *"o glúteo não sai do banco"*) ou logística do canal, e **nenhuma** é
conselho calibrado para o corpo de quem mandou o vídeo — as calibradas de verdade
já estavam em `avaliacao-de-terceiro`, e por isso não aparecem na fila. Ver
`GENERO.md` §6.

O discriminador continua sendo **de quem é o imperativo**, não o rótulo do vídeo.
Um cue que valeria igual em qualquer vídeo do canal é `prescricao` mesmo dito
dentro de um form check; o que vira `avaliacao-de-terceiro` é o que só faz
sentido para aquele corpo, e o que vira `relato-de-programa` é o que só faz
sentido dentro daquele programa. Rebaixar cue universal para caber na trava é o
dano do falso positivo — some da base uma regra que era boa, e some sem deixar
rastro.

O enumerado completo de `genero`, o critério de cada valor e a lista das 76
claims que hoje violam esta regra estão em `research/kb/GENERO.md`.

### O teste de que tipo de coisa é — `pratica-pessoal` × `narrativa` × `fato`

Os três acima resolvem **de quem é a fala**. Sobra decidir, no material que é
dele, **que tipo de coisa a frase é** — e era aqui que não havia regra nenhuma:
17 dos 18 lotes que preencheram `modo` relataram ter inventado a sua. O registro
da decisão, com o tamanho do que ela move, está em `FRONTEIRA-MODO.md`.

Rode as duas perguntas primeiro, porque elas tiram da frente o que não é
ocorrência nenhuma:

- A frase diz o que ele **acha**, sem mandar fazer? → `opiniao`.
- A frase diz **por que** algo funciona? → `mecanismo`.

Sobrou uma frase sobre o que ele faz, fez ou é. Então:

> **A PERGUNTA QUE SEPARA: quantas datas cabem nesta frase?**
>
> - **Nenhuma** — não é uma ocorrência, é como ele ou o mundo *é*. → `fato`
> - **Uma** — aconteceu uma vez, e daria para dizer o dia. → `narrativa`
> - **Muitas** — acontece de novo, e ele espera que continue. → `pratica-pessoal`

É a mesma forma do teste que abre este documento ("se você não aponta os
segundos, não é claim"): uma pergunta que se responde olhando a frase, não uma
definição que se responde olhando o dicionário.

**Quando bater "uma" e "muitas" ao mesmo tempo, ganha `pratica-pessoal`.** É o
caso de `V117-11` — *"ele já fez 68 séries de supino por semana no próprio
programa, e credita a isso o supino de 405 lb"*: tem um episódio (o 405) e tem
uma dose que se repete (68 séries por semana). A dose vence porque a dose é o que
se copia, e `pratica-pessoal` é a gaveta que carrega o aviso de que aquilo é o
hábito de um homem de 120 kg que não compete testado. Se a tese ("foi isso que me
deu o 405") importa, ela é **outra claim**, com `basis` apontando para a
primeira — a regra de granularidade deste documento já mandava separar.

**Por que `pratica-pessoal` existe, em uma frase.** `scope: PESSOAL` diz que a
frase é sobre ele; não diz se é algo que dá para copiar. *"Ele agachou 825 lb
semana passada"* e *"ele supina 6 dias por semana"* são as duas `PESSOAL`, e só a
segunda vira uma linha do treino de alguém. Sem a gaveta, a segunda mora em
`narrativa` — que este documento define como episódio —, o que diz ao consumidor
exatamente o contrário do que ele precisa saber.

**A pergunta operacional. Ela não é só desempate — ela tem VETO:**

> **Se este atleta copiasse a frase para a própria semana, ela viraria uma linha
> do treino, da dieta ou da rotina dele?**

Se vira linha, é `pratica-pessoal`. Se não vira — porque é um resultado que já
aconteceu, ou uma propriedade do corpo dele — é `narrativa` ou `fato`.

**E quando as duas perguntas brigam, esta ganha.** A contagem de datas erra num
sentido só, e sempre para o mesmo lado: frases que descrevem uma *observação*
repetida, e não uma *rotina*, aceitam muitas datas e caem em `pratica-pessoal`
sem serem copiáveis. `V117-08` — *"ele viu isso ao programar trabalho até a falha
para dezenas de alunos"* — cabe em dezenas de datas e não é linha de treino de
ninguém: é `narrativa`. Regra: **"muitas datas" só leva a `pratica-pessoal` se a
frase também passar na pergunta operacional.**

### Os três empates que a contagem não resolve sozinha

Medido às cegas em 40 claims (`candidatos-pratica-pessoal.mjs --recall`), a
contagem de datas decide sozinha em 31 e trava em 9 — **22,5 %**. Os nove caem em
três formas, e cada uma tem desempate declarado abaixo. Sem eles, o agente
inventa o seu, que é o defeito que esta secção existe para não ter.

**1. Nenhuma × uma (`fato` × `narrativa`).** "A academia dele instalou plataformas
novas" (`V024-06`), "o supino dele saiu de 215 para 265 lb" (`V057-09`), "antes
dessa fase ele não lidava com muito workload" (`V065-08`): dá para ler como
estado ou como o momento em que o estado mudou.

> **Empate entre nenhuma e uma → `narrativa`.**

Pelo mesmo motivo que `scope` na dúvida é `PESSOAL`: promover um episódio a
`fato` transforma um n = 1 em propriedade do homem, e é o erro caro. Ler um
estado como episódio é só conservador.

**2. Nenhuma × muitas (`fato` × `pratica-pessoal`).** "Os treinos dele levam ~2,5 h"
(`V003-02`), "ele segura a barra com o polegar do mesmo lado" (`V157-20`). A
contagem não decide porque estado e rotina se descrevem com a mesma gramática — é
o mesmo caso do `V003-18` na tabela abaixo.

> **Use a pergunta operacional, e nada mais.** Vira linha da semana dele →
> `pratica-pessoal`. Não vira, porque é propriedade do corpo ou da execução →
> `fato`.

A régua entre os dois: **uma escolha que ele poderia ter feito diferente é
rotina; uma coisa que o corpo dele faz é propriedade.** Pegada, stance, ordem do
equipamento e duração da sessão são escolhas → `pratica-pessoal`. Sticking point,
alavanca, metabolismo e status testado/natural são propriedades → `fato`.

**3. A frase é uma rotina COM a razão ou o juízo colado.** "Ele abriu a stance no
terra **porque** descobriu que fica mais forte assim" (`G037-07`), "ele usa
cadeira extensora **para** trabalhar quadríceps sem carga axial" (`V095-25`), "ele
está indo para uma pegada mais aberta **e acha** que está funcionando melhor"
(`V020-36`). Lidas ao pé da letra, as duas pré-perguntas do topo desta secção
engolem as três: elas dizem *por que* funciona e dizem o que ele *acha*.

> **As duas pré-perguntas não são portões sobre rotina.** Quando a frase é *"ele
> faz X, porque/e Y"*, ela é **duas claims** — a rotina e o mecanismo (ou a
> opinião) — e partir vem antes de etiquetar, exatamente como no caso `ele + você`
> logo abaixo. Se você não vai partir, a gaveta é a da **oração principal**: o
> sujeito da frase é o que ele FAZ, não a razão.

Sem esta linha, todo hábito que vem com a sua justificativa — e quase todos vêm —
escorrega para `mecanismo`, e a gaveta que existe para dizer "não copie" fica
vazia justamente nos casos em que a razão torna o hábito mais tentador de copiar.

### O que `pratica-pessoal` NÃO promete

A gaveta diz *"isto é uma dose que se repete e que dá para copiar"*. Ela **não**
diz que é atual, nem que deu certo, nem que ele ainda faz. Três coisas moram lá
com o mesmo rótulo:

- rotina de hoje — `V088-19`, *"6 séries por semana em agacho e terra"*;
- rotina abandonada — `V135-12`, *"tentou 15 séries de agacho por semana e
  continuou exausto e sobretreinado"*;
- plano futuro — `V081-26`, *"depois do corte ele pretende ganhar 1/3 a 1/2 lb por
  semana"*.

Isso é deliberado: `modo` diz *que tipo de coisa é*, e as três são a mesma coisa.
**A janela — hoje, antes, depois — mora na prosa da `claim` e em `conditions`**,
como já vale para `V152-19`. Mas então a prosa tem de dizê-la: uma claim de
`pratica-pessoal` que não diz *quando* é uma dose sem validade, e para um atleta
que vai ler "o que ele faz" isso é pior do que estar em `narrativa`. **Se você
marcar `pratica-pessoal` numa rotina abandonada ou hipotética e a prosa não
disser, conserte a prosa.**

**Casos de fronteira reais, resolvidos:**

| id | claim | vai para | por quê |
|---|---|---|---|
| `V170-03` | "o formato geral do programa dele é seis dias por semana com um dia de folga" | `pratica-pessoal` | muitas datas; vira linha de treino direto |
| `V024-02` | "na semana anterior ele agachou 825 lb, PR de todos os tempos" | `narrativa` | uma data; um PR não é uma linha que se copia |
| `V044-01` | "ele compete na categoria de 120 kg e chega a ~260 lb" | `fato` | nenhuma data — é o que ele é |
| `V173-05` | "não usa esteroides" | `fato` | é **status**, não rotina de treino. Status testado/natural é a coisa que mais qualifica esta base inteira e não pode virar item de rotina |
| `V152-19` | "em certo momento ele treinava agacho, supino e terra 6× por semana" | `pratica-pessoal` | hábito no passado ainda é hábito. A janela ("em certo momento") mora na prosa da claim ou em `conditions`, não no `modo` |
| `V003-18` | "ele cronometra todos os descansos: 5 min em agacho e terra, 3 min no supino" | `pratica-pessoal` | hoje está em `fato`, porque foi escrita como estado. Agenda e rotina descritas como estado continuam sendo rotina |
| `V028-08` | "ele andou entre as séries como de costume, e a sensação foi melhorando" | `narrativa` | o episódio é o assunto; o "como de costume" é pano de fundo. O hábito, se vale claim, é uma claim própria |
| `V083-03` | "o sticking point dele é pronunciado e ele agacha bem fundo" | `fato` | propriedade da execução dele, não algo que se agende |
| `V009-20` | "um cliente dele consegue treinar 3 dias por semana" | `avaliacao-de-terceiro` | a rotina é de outra pessoa. `pratica-pessoal` é só dele — ver a trava abaixo |
| `V175-11` | "o programa que o levou até ali foi o Starting Strength, 3×5 de agacho em toda sessão" | `relato-de-programa` | a frequência é do programa alheio; o teste de quem fala vem antes e ganha |

**ANTES de escolher a gaveta, veja se a frase é UMA coisa só.** Se o hábito vem
grudado num conselho para todo mundo, a frase tem de ser partida — e partir vem
antes de etiquetar, porque nenhuma etiqueta está certa para uma frase que é duas.
O caso real é `V170-33`: *"ele supina seis dias por semana, uma frequência
altíssima, **e acha que a maioria das pessoas deveria fazer o mesmo**"*. O começo
é `pratica-pessoal` + `PESSOAL`; o fim é `prescricao` + `GERAL`. Etiquetar a
frase inteira de `pratica-pessoal` **esconde a prescrição dentro da gaveta que
existe para dizer "isto é dele, não copie"** — e quem consome a base filtrando
`prescricao` nunca mais a encontra. O sinal de que você está diante disso é
gramatical e barato: **um "e" ligando um sujeito que é ele a um sujeito que é
você.**

**`pratica-pessoal` exige `scope: PESSOAL`.** Rotina de terceiro é
`avaliacao-de-terceiro` ou `relato-de-programa`, nunca isto — senão a gaveta que
existe para dizer "cuidado, é o hábito DELE" passa a guardar hábito de qualquer
um. É invariante de compilador, e entra no `check-claims.mjs` junto com o
enumerado, na onda 2 (`SCHEMA.md`, "o que o checker recusa", item 13).

### `anedota` está em fusão com `narrativa`

`anedota` era "história dele ou de terceiro" e `narrativa` era "o que aconteceu
no treino". Os 18 lotes separaram os dois **por tempo verbal** — passado virava
`anedota`, presente virava `narrativa` —, e nem isso se sustentou: medido em
9/8/2026, 32 % das `narrativa` e 48 % das `anedota` têm marcador de passado no
verbatim. Isso não é uma fronteira, é um borrão.

E o borrão não paga por si: **nenhuma consulta desta base separa os dois.** Os
dois são episódio único, do mesmo homem, com o mesmo peso de evidência (n = 1); o
filtro que decide alguma coisa é `prescricao`, e o aviso que decide alguma coisa
é `PESSOAL`. Pelo próprio teste de admissão do `ENUMERADOS.md` §1 — "alguém vai
filtrar por isso?", "a ausência força um erro?" — `anedota` não entraria hoje. E
o que ela guardava não se perde: o tempo verbal está no `verbatim`, que é a fonte;
o campo era uma cópia lossy dele, e cópia que diverge em silêncio é o defeito nº 3
deste projeto.

**Não emita `anedota` em lote novo. Use `narrativa`** — que passa a significar
*um episódio, dele ou de terceiro, contado como episódio*. As 243 claims que ainda
estão lá migram na onda 2 (§ `FRONTEIRA-MODO.md` §5); o valor só sai do enumerado
de `kb.mjs` quando a última claim sair dele, e não antes.

**E isto é travado, não é só texto.** `check-claims.mjs` tem a catraca
`TETO_ANEDOTA`, por prefixo de id (`V: 196`, `G: 47`) e **só desce**: `anedota`
continua sendo valor legal — tem de ser, senão o build cai sobre as 243 —, mas o
número não pode subir. Fonte nova tem teto zero e estoura no primeiro registro.
Por prefixo e não global pela lição já paga do `TETO_SEM_MODO`: um teto global
vaza porque retagar uma `anedota` antiga abre exatamente uma vaga para uma nova, e
a onda 2 retaga e ingere ao mesmo tempo. Sem a catraca, a proibição acima seria
markdown puro, e o intervalo entre ela e a onda 2 seria a janela em que a dívida
cresce — que é o defeito nº 3 desta casa em estado puro.

### Estas duas mudanças ainda não estão no `kb.mjs`

`pratica-pessoal` **ainda não é valor legal**, de propósito. O `ENUMERADOS.md` §2
recusou `scope: TERCEIRO` com o argumento certo — *"um enumerado declarado e nunca
preenchido é pior do que enumerado ausente: ele promete uma distinção que os dados
não têm, e o consumidor confia no filtro"* —, e abrir a gaveta antes do retag
reencena exatamente isso. **A linha do enumerado e o retag entram no mesmo
commit**, que é a onda 2.

Até lá, lote de extração novo: use `narrativa` para prática habitual, e **liste no
relatório final os ids que você teria marcado `pratica-pessoal`**. É a mesma regra
que este documento já aplica a tópico que falta — não invente a gaveta, registre a
falta.

## O que NÃO virar claim

Preço, promoção, cupom, link de afiliado, número de inscritos, oferta de
lançamento. Não existe frame de moeda no enumerado e isso é deliberado: ninguém
vai consultar esta base para saber quanto custa o ebook de alguém, e a claim de
preço envelhece em semanas enquanto a base é escrita para durar.

Conflito de interesse **é** conhecimento e continua entrando — "ele vende o
programa que está recomendando" é uma claim legítima, `modo: fato`. O que sai é o
número.

## `certainty`

- `explicit` — ele diz. O verbatim contém a afirmação.
- `implied` — segue do que ele diz, mas com uma inferência sua no meio.

Não existe terceira opção. Se você precisa de duas inferências, é `tier: "I"`.

## Números — a superfície de risco

O corpus vem de ASR automático. Erro de palavra é quase inofensivo (`squadrons`
por `squatters` não muda nada). **Erro de número é fatal**: "3 séries" virando
"30 séries" envenena a base.

Então, para toda claim com número:

1. O número entra em `params` com `unit` **e** `frame` (ver `SCHEMA.md`).
2. O `verbatim` tem que conter o número escrito.
3. Se o número parecer implausível para o contexto (mais de 10 séries, RPE acima
   de 10, percentual acima de 110), marque `"suspect": true`. Um passe posterior
   re-transcreve esses trechos com Whisper e confere. **Não conserte por conta
   própria** — chutar o que "devia" ser dito é exatamente o que a base não pode ter.

### Duas armadilhas de `frame` que já custaram um passe de reparo

**"Algo POR período" não é a magnitude sozinha.** *"4 horas de cardio por
semana"* não é `4` com frame `horas` — isso é o que se escreve para *"treino de
4 h"*, e as duas coisas passam a somar juntas para quem filtra por frame. O
denominador tem de estar no `frame`, não só no `unit`: `horas_semana`,
`horas_dia`, `min_semana`, `min_dia`, `lb_semana`, `x_semana`. **Se a sua unidade
tem barra e não existe frame com o período dentro, pare e relate** — é gaveta
faltando, e a base tem hoje 111 params exatamente assim (`SCHEMA.md`, "TAXA").

**`value` é número.** A única exceção é `frame: rotulo`, onde `"5x5"` é o
registro certo porque é um nome e não uma medida. Fração vira decimal com a
fração preservada por escrito no `unit` — `"2/3"` com frame `pct_1RM` vira
`66.7` com `unit: "% do 1RM (dois terços)"`. String em qualquer outro frame foge
da escala fechada e de toda aritmética do checker, e ninguém percebe.

E os dois que parecem duração e não são: **ano de calendário** é
`ano_calendario` e não `anos` (2019 com frame de duração se lê como dois mil e
dezenove anos), e **hora do relógio** é `hora_do_dia` e não `horas`.

## Negação — a outra superfície de risco

Números não são o único ponto onde o ASR estraga sentido. **Um `n't` perdido
inverte a afirmação inteira**, e ao contrário de um número absurdo isso não
parece errado: sai uma frase gramatical, plausível, e completamente ao contrário
do que foi dito.

Casos reais achados no corpus:

- `"energy availability doesn't play a role in protein metabolism"` — dito logo
  depois de ele argumentar exatamente o contrário.
- `"if you're doing none currently, any amount you add won't give you big benefits"`
  — inverte a conclusão do próprio parágrafo.

Então: se a negação de um trecho **briga com o argumento em volta**, marque
`"suspect": true` com `"suspectWhy": "negacao"`. Se a claim ficaria perigosa
estando invertida, prefira não emitir e relate no resumo final.

Números levam `"suspectWhy": "numero"`. É o mesmo passe de reparo com Whisper
que resolve os dois, e ele precisa saber o que procurar.

**Isso passou a ser travado em 2026-08-09**, depois de duas ingestões inteiras em
que o campo era enumerado no documento e não existia no código: valor fora de
`numero`/`negacao` é erro, `suspectWhy` sem `suspect` é erro, e a ausência é uma
dívida com teto (`TETO_SEM_SUSPECT_WHY = 53`, só desce). Lote novo que marcar
`suspect` sem dizer o quê estoura o teto e falha o build.

**E o valor tem de caber na escala do frame.** `RPE` e `escala_dor` vão de 0 a
10, `RIR` de 0 a 15, `pct_*` até 150. `RPE 12` não é um valor alto, é um valor
que não existe — o único da base veio do ASR partindo "2 and a half to 3 RPE" em
"2 and 12 to 3", e o extrator gravou o `12`. Se o número que você lê não cabe na
escala, **é sinal de legenda quebrada**: marque `suspect` com `suspectWhy`, não
conserte. Com `suspect` a trava vira aviso, e o passe de Whisper assume.

## `verbatim`

Copie **literal** da transcrição, em inglês, como está lá — minúsculo, sem
pontuação. Mínimo de 12 caracteres úteis, e longo o bastante para que alguém
lendo só o verbatim concorde com a claim. Não limpe, não conserte, não traduza.

O `claim` é português e é sua leitura. O `verbatim` é a evidência crua. A
distância entre os dois é o que o revisor precisa poder medir.

## O compilador roda no seu loop

Antes de encerrar, rode:

```
node research/tools/check-claims.mjs --only R014
```

Corrija tudo e rode de novo até passar limpo. **Não entregue lote com erro e não
descreva o erro no relatório em vez de consertar.** O checker confere que o
verbatim existe mesmo na transcrição, no instante declarado — se ele reclama, ou
a citação está errada ou o texto foi inventado, e as duas coisas são graves.

Aviso de transcrição ausente é aceitável; erro não.

## Não faça

- Não edite `manifest.json`, transcrições, ou lote que não é seu.
- Não crie tópico fora do vocabulário.
- Não emita `tier` diferente de `R` neste passe. Interpretação (`I`), elite (`E`)
  e literatura (`L`) entram em passes próprios, com outras regras.
- Não infira data — ela vem de `dates.json`.
- Não faça `git add .`.
