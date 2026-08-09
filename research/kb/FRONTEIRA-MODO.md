# A fronteira `narrativa` × `anedota` × `fato` × prática habitual

Escrito em 2026-08-09. A regra que saiu daqui está no `PROTOCOLO-EXTRACAO.md`
(secção "O teste de que tipo de coisa é") e no `SCHEMA.md`. Este arquivo é o
registro da decisão: **o que eu li antes de decidir, o que decidi, o que recusei,
e o tamanho exato do que isso obriga a onda 2 a mexer.**

Nada em `research/extract/` foi tocado. Uma medição da base estava rodando em
paralelo sobre esses arquivos enquanto isto era escrito, e medir alvo móvel foi o
erro que esta rodada existe para não repetir.

---

## 0. O problema, do jeito que ele aparece na base

O `ESTADO.md` §2 chama o valor de `modo` em 6.766 claims de "a maior superfície
não verificada da base", e o `RUNBOOK.md` §8 item 18 nomeia o buraco: **17 dos 18
lotes que preencheram `modo` declararam ter inventado sozinhos a fronteira entre
`narrativa`, `anedota` e `fato` para material PESSOAL**, e todos os 18 relataram a
mesma falta — não existe gaveta para prática habitual.

Distribuição contada em 9/8/2026, lendo os 231 arquivos de `research/extract/`:

| modo | total | GERAL | PESSOAL |
|---|---:|---:|---:|
| `narrativa` | 1.471 | 3 | **1.468** |
| `mecanismo` | 1.403 | 1.275 | 128 |
| `prescricao` | 1.134 | 1.134 | 0 |
| `opiniao` | 1.119 | 924 | 195 |
| `fato` | 595 | 434 | **161** |
| `relato-de-programa` | 447 | 439 | 8 |
| `anedota` | **243** | 18 | 225 |
| `estudo` | 239 | 238 | 1 |
| `avaliacao-de-terceiro` | 115 | 115 | 0 |
| (sem `modo`: `tier: O`) | 143 | — | — |

`PESSOAL` são 2.186 claims, e 1.468 delas — dois terços — estão numa única gaveta
chamada `narrativa`.

---

## 1. O que os dados dizem, antes de qualquer teoria

### 1.1 `narrativa` virou o depósito de tudo que é PESSOAL

`R043` (dia inteiro de alimentação) tem 28 claims, 22 em `narrativa`. Lidas uma a
uma, **quase nenhuma é episódio**: `V043-09` *"ele tenta consumir pelo menos 400 g
de frutas e vegetais sólidos por dia"*, `V043-13` *"ele se limita a 3 bebidas
cafeinadas por dia"*, `V043-22` *"ele mira menos de 10 % das calorias vindas de
gordura saturada"*, `V043-24` *"14 g de fibra a cada 1000 calorias"*. Isso é
política, não narração. `R034`, `R106`, `R151` e `R185` — os outros arquivos que o
`ESTADO.md` aponta como densos — têm o mesmo formato: 14 a 23 `narrativa` cada,
majoritariamente hábito.

O documento define `narrativa` como *"o que aconteceu no treino, sem tese"*. A
gaveta está sendo usada para o oposto disso: o que ele faz **toda** semana.

### 1.2 A fronteira `anedota` × `narrativa` que os lotes usaram foi o tempo verbal — e nem essa segurou

Lendo 45 `anedota` amostradas, o padrão é inconfundível: passado. *"I used to
always do deadlifts after squats"* (`V059-12`), *"I've done 68 sets of bench per
week"* (`V117-11`), *"I did that when I was in high school"* (`G019-35`). Nenhum
lote escreveu essa regra; todos convergiram para ela sozinhos, o que já é sinal de
que a distinção documentada ("história" × "o que aconteceu") não estava
decidindo nada.

Medido: marcador de passado no `verbatim` inglês aparece em **32 % das
`narrativa`** (472/1.468) e em **48 % das `anedota`** (108/225). Uma fronteira
sustentada devolve algo próximo de 0 % contra 100 %. 32 contra 48 é um borrão.

O instrumento é uma linha, não uma leitura minha, e recontável:

```
node research/tools/candidatos-pratica-pessoal.mjs --tempo
```

Um detector léxico erra nos dois sentidos, e é justamente por isso que ele serve
aqui: para *derrubar* uma fronteira, um instrumento grosseiro basta. Se as duas
gavetas fossem separadas por tempo verbal, nem um instrumento grosseiro as veria
tão perto.

### 1.3 A prática habitual está espalhada por três gavetas ao mesmo tempo

A mesma coisa — o que ele faz de rotina — aparece hoje em:

- `narrativa` — `V170-03` *"o formato geral do programa dele é seis dias por
  semana com um dia de folga"*
- `fato` — `V003-18` *"ele cronometra todos os descansos: 5 minutos em agachamento
  e terra e 3 minutos no supino"*, `G040-17` *"o primeiro dia da semana dele é o
  dia de foco em competição"*
- `anedota` — `V015-03` *"ele já treinou agacho, supino e terra seis vezes por
  semana"*, `V118-15` *"ele alterna a largura da pegada de supino a cada dia"*

Três agentes, três gavetas, a mesma frase. Isso não é fronteira mal traçada; é
fronteira ausente.

---

## 2. A decisão: **abrir `pratica-pessoal` e fundir `anedota` em `narrativa`**

O vocabulário de `modo` continua com **nove** valores. Uma gaveta entra, uma sai.

### 2.1 Por que abrir `pratica-pessoal`

**Porque é a única categoria da base que este atleta pode copiar por acidente.**
Ele tem 87 kg, é natural, nunca competiu, tem histórico de lesão de peitoral, e o
Vena tem ~120 kg e não compete testado. *"Ele agachou 825 lb semana passada"* não
é copiável — ninguém acorda e agacha 825. *"Ele supina 6 dias por semana"* é
copiável, cabe numa linha de programa, e carrega `params` que qualquer consulta
por dose vai recolher. As duas moram hoje na mesma gaveta.

**E a gaveta em que moram diz o contrário do que o consumidor precisa saber.**
`narrativa` está definida, no `SCHEMA.md` e no protocolo, como *episódio*. Uma
frase que descreve política semanal marcada como episódio informa ao leitor que
aquilo aconteceu uma vez. É o mesmo formato de erro do
`relato-de-programa`: não faltava informação, faltava a informação estar na gaveta
que muda a leitura.

**O `scope` sozinho não resolve.** `PESSOAL` diz "isto é sobre ele". Não diz
"isto é uma dose que se repete". A consulta que este projeto precisa poder fazer —
*enumerar tudo que é hábito dele para carimbar com o aviso de peso corporal e
status de teste* — hoje não existe: ela devolveria 2.186 claims, das quais dois
terços são o que aconteceu numa terça-feira.

**`modo` cresce pela regra do `frame`, não pela do `topic`.** O `ENUMERADOS.md`
§1 estabelece os dois critérios opostos — *frame na dúvida aceita, topic na dúvida
recusa* — e não diz de qual lado `modo` está. Está do lado do `frame`: `modo` não
é mecanismo de recuperação (`--grep` e `topic` são), é **trava** — a prova é que
`relato-de-programa` e `avaliacao-de-terceiro` foram abertos para *tirar* coisa de
`prescricao`, não para achar nada. E a regra do lado da trava é a que o protocolo
já escreve em caixa alta: *faltar gaveta é pior do que ter gaveta demais*, porque
gaveta que falta empurra o dado para dentro da gaveta errada, e lá ele fica
parecendo certo para sempre.

### 2.2 Por que fundir `anedota`, e por que isso não é perda

`anedota` reprova no próprio teste de admissão que o `ENUMERADOS.md` §1 aplica a
gaveta nova:

1. **Alguém vai filtrar por isso?** Não. `anedota` e `narrativa` são as duas
   episódio único, do mesmo homem, com o mesmo peso de evidência (n = 1). O filtro
   que decide alguma coisa nesta base é `prescricao`; o aviso que decide alguma
   coisa é `PESSOAL`. Nenhuma consulta pede uma sem a outra.
2. **A ausência força um erro?** Não. Sem `anedota`, tudo cai em `narrativa`, que
   é onde 32 % do passado já está.
3. **Duplica uma distinção que outro campo já faz?** Sim — e é o critério 4, o que
   manda recusar. O tempo verbal está no `verbatim`, que é a fonte literal e
   imutável. O campo era uma **cópia lossy do verbatim**, e cópia que diverge em
   silêncio é o defeito nº 3 deste projeto, medido aqui em 32 % contra 48 %.

O que se perde: nada que não seja recuperável por `--grep` no `verbatim`. O que se
ganha: uma fronteira a menos para 18 agentes traçarem de 18 jeitos, e o retag é
**mecânico** — `anedota` → `narrativa`, sem leitura.

### 2.3 O que eu recusei, e por quê

**Recusei ratificar a fronteira por tempo verbal** (`anedota` = passado,
`narrativa` = presente). Era a opção mais barata: zero retag, e "nasce do que está
lá", que é o que a tarefa pede. Recusei porque **os dados dizem que ela não está
lá** — 32 % contra 48 % não é uma convenção que os lotes seguiram, é ruído que
eles produziram. Ratificar ruído dá ao consumidor um filtro que promete separar e
não separa, que é pior do que não ter filtro.

**Recusei um quarto valor para episódio-com-tese.** Foi a minha primeira versão:
`anedota` sobreviveria como "episódio contado para sustentar uma tese", que é uma
distinção real e é o que a definição atual (*"sem tese"*) já insinuava. Recusei
porque "tem tese?" é julgamento puro, e este documento existe porque julgamento
puro produziu 18 linhas diferentes. Além disso a tese, quando existe, **já tem
lugar**: é uma claim própria com `basis` apontando para o episódio — a regra de
granularidade do protocolo sempre mandou separar *"eu fiz X"* de *"e foi X que me
deu Y"*.

**Recusei não fazer nada.** A alternativa honesta seria: se a distinção não muda
consulta nenhuma, funde tudo. Fundi o que não muda consulta (`anedota`). Mas
`pratica-pessoal` **muda a consulta que mais importa aqui**, e não abri-la deixaria
~400 doses copiáveis marcadas como episódio, num projeto cujo bloco atual foi
desenhado em torno de reexposição gradual de supino num peitoral lesionado.

**Recusei tocar `kb.mjs`.** Duas razões, e a segunda é a que decide. A primeira é
que o arquivo está sendo editado em paralelo (o campo `genero`, tarefa 1 do
`ESTADO.md` §4). A segunda é o `ENUMERADOS.md` §2, que recusou `scope: TERCEIRO`
com o argumento certo: *"um enumerado declarado e nunca preenchido é pior do que
enumerado ausente — ele promete uma distinção que os dados não têm, e o consumidor
confia no filtro"*. **A linha do enumerado, a trava e o retag entram no mesmo
commit.** Enquanto isso, `PROTOCOLO-EXTRACAO.md` manda lote novo usar `narrativa`
e listar no relatório os ids que teria marcado `pratica-pessoal` — a mesma regra
que ele já aplica a tópico que falta.

---

## 3. A regra, em uma linha

> **Quantas datas cabem nesta frase?** Nenhuma → `fato`. Uma → `narrativa`.
> Muitas → `pratica-pessoal`. Empate entre uma e muitas → `pratica-pessoal`.

O teste completo, com a pergunta operacional de desempate e dez casos de fronteira
resolvidos por id, está no `PROTOCOLO-EXTRACAO.md`. Ele é uma pergunta de
contagem, e não uma definição, pelo mesmo motivo que o teste de o-que-é-uma-claim
é *"se você não aponta os segundos, não é claim"*: definição de dicionário não
resolve caso de fronteira, pergunta resolve.

**Uma linha não bastou, e isso foi medido — 9/8/2026, segunda passagem.** Aplicada
às cegas a 40 claims dos valores em disputa
(`candidatos-pratica-pessoal.mjs --recall`, os mesmos 40 do §4.1c), a contagem
decide sozinha em 31 e **trava em 9 — 22,5 %**. Os nove não estão espalhados: caem
em três formas, e uma regra que não fecha as três é a mesma ambiguidade com mais
páginas.

1. **Nenhuma × uma** (`fato` × `narrativa`) — o desempate só existia para *uma ×
   muitas*; as outras duas arestas do triângulo estavam soltas. 4 dos 9.
2. **Nenhuma × muitas** (`fato` × `pratica-pessoal`) — estado e rotina se escrevem
   com a mesma gramática, e é exatamente onde o §4.2 diz que ~10 das 16 `fato`
   migram: a aresta mais consequente era a sem desempate.
3. **Rotina com a razão colada** — as duas pré-perguntas (`opiniao`, `mecanismo`)
   estão escritas como portões incondicionais, então *"ele faz X porque Y"* e
   *"ele faz X e acha que é melhor"* saem em `mecanismo`/`opiniao`. 3 dos 9, e
   contradiz o próprio §4.3, que manda os 4 `mecanismo` do Tier A ficarem onde
   estão pelo raciocínio inverso.

Um quarto caso não é empate, é decisão errada: `V117-08` (*"ele viu isso ao
programar falha para dezenas de alunos"*) cabe em muitas datas e a contagem manda
para `pratica-pessoal`, mas não é linha de treino de ninguém. A pergunta
operacional estava escrita como fallback *"para quando a contagem não decidir"* —
e aqui ela decide, e decide mal.

Os quatro desempates estão escritos no `PROTOCOLO-EXTRACAO.md`, na secção "Os três
empates que a contagem não resolve sozinha". Com eles, os 9 travados fecham.

---

## 4. O tamanho: quanto isto obriga a onda 2 a mexer

**Isto é um fan-out, não um repasse dirigido.** Dito na cara, porque a diferença
governa como a onda 2 é montada.

### 4.1 Como eu medi, e o que o número vale

Duas medidas, com métodos diferentes de propósito:

**(a) Amostra lida à mão, n = 60.** `narrativa` + `PESSOAL`, ordenadas por id, uma
a cada 24. Reproduzível:

```
node research/tools/candidatos-pratica-pessoal.mjs --amostra
```

Classificadas à mão: **15 são prática habitual sem ambiguidade** (25,0 %) e mais
**7 são mistas** — a claim junta hábito e episódio numa frase só, como `G035-07`
(*"515 lb virou o backoff regular dele… e nesse dia ele fez só 1 série"*), que
pela regra de granularidade já deveria ser duas claims.

Os 22 números abaixo saem de um comando, não da minha aritmética:

```
node research/tools/candidatos-pratica-pessoal.mjs --ic
```

- só as inequívocas: 15/60 = 25,0 % → **367 claims**, IC 95 % (Wilson) **232–547**
- somando as mistas: 22/60 = 36,7 % → **538 claims**, IC 95 % (Wilson) **376–724**

n = 60 compra essa faixa e nada mais estreito. Não vou inventar uma precisão que
a amostra não tem: o `ESTADO.md` abre dizendo que número de qualidade sem
instrumento nomeado é opinião com cara de medida.

**Correção de 9/8/2026, no mesmo dia:** a primeira versão deste parágrafo trazia
`210–524` e `354–702` com a etiqueta "(Wilson)", e nenhum dos dois é de Wilson —
eram uma aproximação normal malfeita, mais estreita à esquerda do que a amostra
sustenta. A única coisa que restou de leitura humana são as três constantes
`AMOSTRA_N`, `AMOSTRA_INEQUIVOCAS` e `AMOSTRA_MISTAS` no topo do `--ic`; o
universo e o intervalo passaram a ser calculados. **Um intervalo com método
nomeado que o método não produz é o defeito nº 3 desta casa — documento e código
divergindo em silêncio — cometido dentro do arquivo que o denuncia.** Onde um
compilador pode verificar, agente não deve, e isto inclui a estatística do
próprio relatório.

**(b) Detector léxico, para gerar lista de trabalho — não para medir.**
`research/tools/candidatos-pratica-pessoal.mjs`, sobre o `verbatim` inglês
(a fonte, não a minha tradução para pt-BR, que achata presente habitual e
episódico num tempo verbal só). Precisão: li os **115** acertos do Tier A um a um
e achei **9 falsos positivos**, todos nomeados no §4.3 — **~92 %**. A recall é
ruim, e o cabeçalho do arquivo diz por quê — hábito sem
advérbio (*"depois do cinto ele coloca as joelheiras"*, `G048-52`; *"o segundo dia
é Spoto press"*, `V170-38`) não tem marcador nenhum. **Ausência da lista não é
absolvição.**

**(c) Amostra CEGA, n = 40, para medir a recall de fora — 9/8/2026, segunda
passagem.** As duas medidas acima foram feitas por quem escreveu a regra, e um
detector conferido contra a lista de quem o escreveu mede concordância, não
cobertura. Esta terceira sorteia 40 claims de `narrativa` + `anedota` + `fato` em
`PESSOAL` **excluindo todos os ids citados nestes documentos**, e as classifica
aplicando a regra sem consultar as listas:

```
node research/tools/candidatos-pratica-pessoal.mjs --recall
```

- **Prevalência: 9/40 = 22,5 % → 417 claims, IC 95 % 228–695.** Isso
  **corrobora** o dimensionamento do §4.2 por um caminho independente — outro
  recorte, outra pessoa, outra amostra: 417 contra ~425.
- **Recall do detector: 2/9 = ~22 %**, IC 95 % 6–55 %. Os sete que ele não vê:
  `G012-03`, `G044-07`, `V033-06`, `V038-05`, `V081-26`, `V169-08`, `V175-05`.

A frase que estava aqui — *"Tier A + Tier B dão 248 ids… o detector enxerga pouco
mais da metade"* — estava errada por construção: divide **candidatos** por
**acertos**, isto é, conta os próprios falsos positivos como cobertura. Com a
precisão que o §4.3 declara, 248 candidatos valem ~170 acertos e "metade" já
viraria ~40 %. Medido de fora, 22 %. **Isto não muda o tamanho da onda 2 — muda
quem pode servir de universo para a catraca. Ver §5.**

### 4.2 O que muda, por gaveta de origem

| origem | universo | vão para `pratica-pessoal` | como estimei |
|---|---:|---:|---|
| `narrativa` \| PESSOAL | 1.468 | **367–538** (IC 232–724) | amostra à mão, n = 60 |
| `anedota` \| PESSOAL | 225 | **~29** | detector, Tier A (13) + Tier B (12), + folga de recall |
| `fato` \| PESSOAL | 161 | **~10** | detector devolve 16 (3 no Tier A, 13 no B), lidos um a um |
| `opiniao` \| PESSOAL | 195 | **~15** | Tier B dá 19; parte é opinião legítima ("ele *acha* que…") |
| `mecanismo` \| PESSOAL | 128 | **~5** | mecanismo continua mecanismo; só migra quando a frase é a rotina, não a causa |
| **total → `pratica-pessoal`** | | **~425 no ponto, faixa honesta 291–783** | soma das linhas acima |

A linha do `fato` estava escrita como "22 acertos do detector, ~15 são rotina":
o detector devolve **16**, não 22, e a recontagem à mão dos 16 dá **~10**. Os que
migram são rotina de treino ou de dieta descrita como estado — `V003-04`,
`V003-05`, `V003-10`, `V003-30`, `V075-03`, `V075-05`, `V039-27`, `G034-04`,
`G041-15`. Ficam em `fato` os que são propriedade e não agenda: `V033-03` e
`V033-04` (quanto vale 1 RPE no corpo dele), `V036-03` (quantas repetições ele faz
a 80 %), `V020-03` e `V173-12` (que nem são sobre ele).
| `anedota` → `narrativa` (fusão) | 243 | **214** | 243 menos os ~29 acima. **Mecânico, sem leitura.** |

**Cerca de 640 claims tocadas no ponto, ~9 % da base.** Das quais 214 são
substituição de string e ~425 exigem ler a claim.

**Correção de 9/8/2026, segunda passagem — o mesmo defeito que o §4.1 diz ter
consertado, uma linha abaixo dele.** A linha do total dizia `~425, faixa
300–620`, e `620` é **menor que o `724`** que a linha imediatamente acima declara
como topo do IC de uma única origem. Como as outras cinco linhas são todas ≥ 0,
uma faixa total abaixo do topo de uma parcela é aritmeticamente impossível: o
intervalo tinha sido escrito à mão, de novo, ao lado do intervalo que passou a ser
calculado. A soma honesta é `232 + 59 = 291` a `724 + 59 = 783` (as outras cinco
origens somam 59 no ponto e não têm IC próprio — são estimativas de leitura, não
amostras). Recontável:

```
node research/tools/candidatos-pratica-pessoal.mjs --ic
```

O topo estava subestimado em **163 claims**, ~26 % do trabalho, e é ele que
dimensiona a onda 2 no §4.4 e no §5. Registrado aqui em vez de apagado porque a
lição é a que interessa: **tornar UM número recontável não torna recontáveis os
números derivados dele**, e o derivado é onde o erro reapareceu.

### 4.3 A parte dirigida: 115 ids que dão para mover lendo só a claim

`--tier A` é `PESSOAL` + taxa de recorrência no `verbatim` (*per week*, *days a
week*, *every day*) + dose declarada em `params` + nenhum marcador de evento
único. É o subconjunto perigoso — recorrência **e** número — e é onde a precisão é
de ~92 %: 9 falsos positivos em 115, todos nomeados logo abaixo.

```
node research/tools/candidatos-pratica-pessoal.mjs --tier A
```

Hoje devolve 115: 94 `narrativa`, 13 `anedota`, 4 `mecanismo`, 3 `fato`, 1
`opiniao`.

```
G034-28 G036-26 G039-22 V002-17 V002-18 V004-01 V004-02 V004-03 V004-29 V004-31
V005-06 V005-09 V005-10 V006-24 V006-26 V009-13 V009-20 V011-09 V011-10 V013-27
V015-03 V015-04 V017-09 V018-19 V019-31 V020-22 V026-07 V026-08 V027-01 V033-16
V033-21 V034-25 V037-01 V037-02 V037-23 V037-25 V041-01 V043-09 V044-14 V044-15
V044-18 V044-19 V048-03 V048-10 V049-23 V049-24 V050-23 V050-28 V053-06 V054-23
V062-26 V064-03 V065-06 V065-11 V075-03 V075-04 V075-05 V076-09 V078-22 V081-21
V081-23 V088-19 V089-02 V090-02 V090-04 V090-16 V100-15 V102-25 V106-02 V117-01
V117-10 V117-11 V118-01 V118-15 V118-26 V120-12 V120-14 V120-22 V128-05 V128-10
V133-26 V133-27 V135-02 V135-03 V135-05 V135-12 V135-13 V135-16 V143-09 V143-11
V151-22 V151-24 V152-01 V152-12 V152-19 V154-07 V154-11 V170-03 V170-09 V170-16
V170-17 V170-18 V170-33 V170-44 V171-07 V171-25 V175-04 V175-34 V175-35 V175-46
V175-57 V175-58 V175-63 V177-18 V177-20
```

**Os falsos positivos que eu já achei nesta lista, para a onda 2 não os mover:**

- `V027-01` — *"menos de uma semana depois de lesionar as costas ele puxou 760 lb
  sem dor"*. Casou com `a week`; é episódio. Fica `narrativa`.
- `V078-22` — *"no pico do cut ele chegou a perder 4 lb por semana"*. Resultado,
  não rotina. Fica `narrativa`.
- `V009-20` — *"um cliente dele que treina para o Masters Worlds consegue treinar
  3 dias por semana"*. A rotina é de outra pessoa → `avaliacao-de-terceiro`,
  nunca `pratica-pessoal`. **E o `modo` não é o único campo errado nela:** está
  em `scope: PESSOAL`, que o protocolo define como *"o que **ele** faz"*, e quem
  treina 3 dias por semana é o cliente. As outras 115 claims em
  `avaliacao-de-terceiro` são todas `GERAL`; esta seria a única `PESSOAL` da
  gaveta. A onda 2 corrige os dois campos ou não corrige nenhum — mover só o
  `modo` cria a primeira exceção de uma regra que hoje não tem nenhuma.
- `V050-23`, `V106-02`, `V133-26`, `V175-63` — os quatro `mecanismo`. A frase
  explica **por que** a rotina funciona; a rotina em si é outra claim. Ficam
  `mecanismo`.
- `V006-24`, `V034-25` — manutenção calórica no peso máximo. É o metabolismo dele,
  não uma rotina que ele executa → `fato`.

`--tier B` (133 ids, recorrência sem taxa ou sem dose) é lista de **revisão**, com
precisão bem menor: mistura hábito de verdade (`V003-18`, `G048-16`, `V110-17`)
com opinião que começa por *"I usually think"*.

### 4.4 O risco desta onda, dito antes de ela rodar

~425 claims lidas à mão é o cenário exato que produziu o problema que este
documento conserta: fan-out grande, fronteira nova, 18 agentes. Três coisas
mudaram, e a terceira é a única que não depende de ninguém lembrar de nada:

1. A regra existe e é uma pergunta de contagem, não uma definição.
2. A parte dirigida (115 ids) é gerada por script, não julgada.
3. **A trava.** Ver §5.

---

## 5. O que a onda 2 tem de fazer — especificação, para não sobrar decisão

Na ordem, tudo no **mesmo commit**:

1. **`kb.mjs`:** acrescentar `'pratica-pessoal'` a `MODOS`. **Não** remover
   `'anedota'` — ela sai quando a última claim sair dela, e a mesma ordem vale ao
   contrário: o enumerado não abre antes do retag.
2. **Retag mecânico:** `anedota` → `narrativa` nas 243, exceto as ~29 que vão para
   `pratica-pessoal`. Depois disso, remover `'anedota'` de `MODOS`, e só então.
   A catraca `TETO_ANEDOTA` (`V: 196`, `G: 47`, por prefixo, só desce) já está no
   `check-claims.mjs` desde 9/8/2026 — **baixe os dois números no mesmo commit do
   retag**, senão ela vira teto folgado e para de significar alguma coisa. Ela
   entrou porque a proibição do protocolo tinha sido escrita sem nenhuma linha de
   código atrás dela, e a janela até a onda 2 é exatamente quando a dívida cresce.
3. **Retag lido:** Tier A (115, menos os falsos positivos do §4.3), depois Tier B
   (133), depois o varrimento dos arquivos densos que o detector não alcança —
   `R043`, `R034`, `R170`, `R003`, `R044`, `R135`, `R175` são os de maior
   densidade de hábito.
4. **`check-claims.mjs`:** `modo: 'pratica-pessoal'` com `scope: 'GERAL'` é
   **erro** (`SCHEMA.md`, "o que o checker recusa", item 13). É erro e não aviso
   porque aqui o checker sabe qual campo está errado: quem escreveu
   `pratica-pessoal` já afirmou que a frase é sobre ele.
5. **Catraca `TETO_HABITUAL_SEM_PRATICA`**, no molde do `TETO_SEM_MODO`, que foi o
   que achou o lote de 278 claims que 18 relatórios juravam estar em ordem.

   **A primeira versão desta linha especificava a catraca errada, e o erro é o
   modo de falha nº 4 numa roupa nova.** Ela dizia: *"contar as claims que o
   Tier A pega e que não estão em `pratica-pessoal`"*. Duas coisas quebram nisso,
   e a segunda é fatal:

   - **O piso não é zero, é 9.** Nove dos 115 do Tier A são falsos positivos
     nomeados no §4.3 e têm de **ficar** onde estão — inclusive `V009-20`, que é
     rotina de um cliente. Uma catraca que "só desce" cria pressão para levá-la a
     zero, e o único jeito de zerar é mover os nove — ou seja, **a trava empurra
     exatamente contra o invariante que o protocolo declara** ("`pratica-pessoal`
     é só dele"). Se esta catraca existir, o piso declarado é 9, por escrito,
     com os nove ids ao lado.
   - **O universo não pode ser a saída do detector.** A recall medida às cegas é
     ~22 % (§4.1c). Retagar os 115 ids do Tier A — que é exatamente o que o item 3
     manda fazer — leva a contagem a 9 e a deixa lá para sempre, com ~300 claims
     ainda misfiladas. **A catraca fica verde no dia em que a maior parte da
     dívida ainda existe**, e depois nunca mais se move, porque o universo dela é
     uma lista fixa de 115 ids que já foram tratados. É a trava que se testa a si
     mesma, com o alvo fora do campo de visão em vez de apagado.

   **A catraca que serve tem o universo do lado da dívida, não do detector:**
   `narrativa` + `fato` + `mecanismo` + `opiniao` em `scope: PESSOAL` que ainda
   não passaram por revisão — isto é, uma catraca sobre o **total não revisado**,
   semeada em ~1.950 e descendo conforme os arquivos são varridos, e não sobre o
   que um regex acha. Ela é grosseira de propósito: mede trabalho pendente, que é
   o que não pode virar dívida invisível, e não acerto do detector. Se isso for
   grande demais para a onda 2, a alternativa honesta é **não ter catraca e dizer
   que não tem** — uma catraca em zero sobre 300 claims erradas é pior do que
   catraca nenhuma, porque desliga a desconfiança.
6. **Teste da catraca, com o caso que já mordeu esta base:** o
   `check-claims.test.mjs` tem de incluir um fixture em que a claim-alvo é
   **apagada** e a catraca **não** pode ficar verde por isso. É o modo de falha nº
   4 deste projeto — trava que se testava a si mesma passava verde quando o alvo
   sumia — e uma catraca de contagem é exatamente a forma que sofre dele.
7. **`ENUMERADOS.md`:** registrar a entrada de `pratica-pessoal` e a saída de
   `anedota` na mesma tabela em que moram as outras decisões, com as recusas do §2.3
   junto — o arquivo diz que as recusas ficam registradas junto das aceitações.
8. **Três claims que NÃO são retag, e por isso se perdem num fan-out se não forem
   nomeadas aqui.** Duas estão no Tier A; a terceira não está em tier nenhum, e é
   assim que se descobre que "nomear os casos" não era suficiente. Todas quebram
   se alguém só trocar o `modo`:
   - **`V170-33` — partir, não mover.** Junta hábito dele, juízo sobre o hábito e
     *"a maioria das pessoas deveria fazer o mesmo"*, que sozinho é `prescricao` +
     `GERAL`. Remarcar a frase inteira como `pratica-pessoal` esconde uma
     prescrição de alta frequência de supino dentro da gaveta que existe para
     dizer "não copie" — e este atleta tem histórico de lesão de peitoral. Ver §6.
   - **`V009-20` — corrigir `scope` junto com `modo`.** Vai para
     `avaliacao-de-terceiro`, e o `scope` tem de sair de `PESSOAL`: a rotina é do
     cliente. Só o `modo` faria dela a única `avaliacao-de-terceiro` `PESSOAL` de
     116. Ver §4.3.
   - **`V169-08` — partir, não mover** (achada em 9/8/2026, na amostra cega do
     §4.1c). *"Ele trocou o desenvolvimento em pé por desenvolvimento sentado com
     halteres, que trabalha os mesmos músculos **e serve para quem não precisa
     especificamente do OHP**"*. É a forma exata do `V170-33`: hábito dele grudado
     numa regra para todo mundo. Está em `narrativa` e **não sai em nenhum dos
     dois tiers** — o detector procura taxa de recorrência e aqui não há nenhuma.

   **E o sinal "barato" do §6 nunca tinha sido rodado.** Ele existe em prosa desde
   a primeira versão — *"um `e` ligando um sujeito que é ele a um sujeito que é
   você"* — e bastavam quatro linhas de regex sobre o campo `claim` para
   enumerá-lo. Rodado, o universo inteiro devolve **6 candidatos**, dos quais 2
   são o caso puro (`V170-33`, `V169-08`) e 2 são parentes que a onda 2 tem de
   olhar (`V047-06`, `V068-05` — hábito dele com a regra geral colada no mesmo
   período):

   ```
   node -e "const fs=require('fs'),p='research/extract';let c=[];
   for(const f of fs.readdirSync(p).filter(f=>f.endsWith('.jsonl')))
     for(const l of fs.readFileSync(p+'/'+f,'utf8').trim().split('\n')) if(l.trim()) c.push(JSON.parse(l));
   const V=/\b(a maioria das pessoas|todo mundo|as pessoas deveriam|qualquer um|quem (?:não |nao )?(?:precisa|quer|treina|busca)|para iniciantes|voc[eê])\b/i;
   for(const x of c) if(x.scope==='PESSOAL' && /\bele\b/i.test(x.claim||'') && V.test(x.claim||''))
     console.log(x.id, '['+x.modo+']', x.claim);"
   ```

   **A boa notícia é o tamanho: a classe é de 6, não de 60.** Uma regra que manda
   partir frases sem dizer quantas são deixa o agente da onda 2 sem saber se está
   diante de um caso raro ou de um segundo fan-out. São seis, estão listados, e
   qualquer um pode recontá-los.

---

## 6. O que isto não conserta

**A regra não torna o `modo` reproduzível sozinha.** O `ESTADO.md` §4 põe o campo
`genero` por vídeo como tarefa 1 pelo motivo certo: onde um compilador pode
verificar, agente não deve. `pratica-pessoal` está do lado errado dessa linha —
é julgamento com regra escrita, que é melhor do que julgamento sem regra e pior do
que compilador. A única parte que vira compilador é a trava de `scope` e a
catraca.

**A regra não paga a dívida do consumidor.** O `RUNBOOK.md` §8 item 16 registra
que 174 `relato-de-programa` com dose não disparam aviso nenhum, e a decisão
deliberada de não ligar o aviso: seriam 174 avisos que a fonte quase nunca permite
resolver, e aviso impossível de zerar é como se ensina alguém a ignorar avisos.
**`pratica-pessoal` cai na mesma armadilha** — o Tier A sozinho são 115 doses sem
`conditions` — e a decisão é a mesma: **não ligar aviso de dose para
`pratica-pessoal`**. O conserto é do lado de quem lê: *nada em `pratica-pessoal`
pode virar treino, e citar uma dessas claims obriga a citar junto o peso corporal
e o status de teste da fonte.*

**A regra não diz se o Vena está certo.** Determinismo prova fidelidade à fonte,
não correção da fonte. O hábito de supinar seis dias por semana vai para
`pratica-pessoal` e continua sendo o hábito de um homem de ~120 kg que não compete
testado, agora com a etiqueta que diz isso.

**E a claim que carrega esse hábito não pode ser só remarcada — ela tem de ser
partida antes.** `V170-33`, na íntegra, é *"ele supina seis dias por semana, uma
frequência altíssima, e **acha que a maioria das pessoas deveria fazer o mesmo**"*.
São três coisas numa frase: um hábito dele, um juízo sobre esse hábito, e um
conselho para todo mundo — e a terceira, sozinha, seria `prescricao` + `GERAL`.
Trocar o `modo` para `pratica-pessoal` **enterraria a prescrição dentro da gaveta
que existe justamente para avisar "isto é dele, não copie"**, que é o erro
exatamente ao contrário do que este documento conserta. Pela regra de
granularidade do protocolo, é duas ou três claims com `basis` ligando-as. Está
listada no Tier A (é o único `opiniao` de lá) e a onda 2 tem de **partir, não
mover**. É o caso mais perigoso da lista inteira para este atleta, porque o
conselho embutido é aumentar frequência de supino num peitoral com histórico de
lesão.
