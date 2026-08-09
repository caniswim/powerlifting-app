# ONDA 2 — lista de trabalho

> **Isto é uma fila para fan-out, não um relatório.** Cada item diz **quantos**,
> **onde** e **como se verifica que ficou certo**. Onde a lista de ids for longa,
> ela é **gerada por comando**, nunca copiada — lista copiada é o modo de falha
> nº 3 desta casa (documento e código divergindo em silêncio), e esta rodada
> pegou a `ESTADO.md` §4 dizendo "19 params" onde a contagem mecânica dá 52.
>
> **Contexto do consumidor, que decide a ordem:** natural, 87 kg, classe 93 kg da
> IPF, nunca competiu, **histórico de lesão de peitoral**, bloco atual construído
> em torno de um protocolo de reexposição gradual do supino. A ordem abaixo é por
> **risco para esse atleta**, não por facilidade.

**Estado ao abrir a fila (contado agora, não lido de prosa):**
`npm run build`, `npm run check:kb` e `npm run check:gate` saem **0**.
6.909 claims · `R:6766` `O:143` · Vena 4.947 · Blevins 1.819 · IPF 143.
`git status research/extract/` **vazio** — a onda 1 fechou sem tocar em claim.

---

## Regra de convivência da onda 2

Vários itens abaixo editam `research/extract/`. **Antes de a onda 2 começar,
confirme que nenhuma medição está rodando** (foi a proibição que governou a onda
1 inteira). E, dentro dela:

- **As filas se cruzam, e a colisão é em CLAIM, não em arquivo.** Contadas agora:

  | par | ids em comum | quais |
  |---|---|---|
  | 3b (Tier A) ∩ 6 (Whisper) | **13** | `V002-17` `V002-18` `V011-10` `V015-04` `V064-03` `V089-02` `V090-16` `V128-05` `V135-03` `V135-05` `V135-12` `V143-11` `V175-35` |
  | 3b (Tier A) ∩ 4 (params) | **8** | `V005-06` `V005-09` `V013-27` `V019-31` `V044-14` `V044-15` `V048-03` `V102-25` |
  | 4 (params) ∩ 6 (Whisper) | **1** | `V142-08` |
  | os três ao mesmo tempo | **0** | — |

  **Nas 13 do primeiro par, o Whisper vem primeiro.** Decidir se uma frase é
  hábito ou episódio depende do número que ela carrega, e 13 dessas frases têm o
  número sob suspeita. Retagar antes de verificar é decidir a gaveta com o dado
  errado. Reproduza os três pares com:
  ```
  node research/tools/candidatos-pratica-pessoal.mjs --tier A --ids | tail -n +2 | tr ' ' '\n' | grep . | sort -u > /tmp/a.txt
  node research/tools/params-gaveta-errada.mjs --ids | sort -u > /tmp/p.txt
  comm -12 /tmp/a.txt /tmp/p.txt
  ```
- **Toda catraca que baixar tem de baixar no mesmo passe da claim.** Deixar a
  claim consertada e o teto alto é como a trava morre em silêncio.
- **Toda trava nova nasce com o teste que a mata.** Neutralize o alvo, exija
  vermelho, restaure. É o modo de falha nº 4, e ele reincidiu duas vezes na onda 1.

---

## 1. A contradição que ninguém registrou — 3 claims

**Por que é a primeira:** é a única entrada da fila que pode fazer o app dizer a
este atleta para treinar dentro da dor do tecido que ele rompeu. Não é dívida de
esquema, é a claim mais perigosa da base circulando solta.

`V138-18`, `V138-19`, `V138-20` (todas `scope: GERAL`, duas `prescricao`)
prescrevem reabilitar **treinando na faixa de dor 2 a 4/10**. O gate do
`PROGRAMA.md` §1.2 **congela o degrau a 2/10 no peitoral**. As duas estão certas
nos seus contextos — uma é reabilitação genérica, o outro é uma lesão específica
com histórico — e a base **não diz isso em lugar nenhum**.

| | |
|---|---|
| quantos | 3 claims, 0 arestas de `conflicts` hoje |
| onde | `research/extract/R138.jsonl` linhas 18–20 |
| bloqueado por | o item 5: `conflicts` liga claim a claim, e **o gate do app não é uma claim** |

**Como se verifica que ficou certo:**
1. `node research/tools/check-evidence.mjs V138-18 V138-20` imprime `conflitos:`
   apontando para a claim `tier U` que registra o gate do bloco (item 5).
2. Um caso novo em `check-claims.test.mjs` exige a aresta: apagá-la fica vermelho.
3. `node research/tools/check-canarios.mjs` ganha um canário do tipo **armadilha**
   com a pergunta *"posso treinar supino com dor de 3/10?"* — a resposta certa é
   o gate, não o `V138-19`, e um julgador que responda `V138-19` sozinho reprova.

**Não faça:** apagar ou rebaixar as `V138-*`. Elas são fiéis à fonte. O defeito é
a ausência da aresta, não a presença da claim.

---

## 2. Gênero — 76 claims em 19 vídeos

A trava **mede e não reprova**: catraca `TETO_PRESCRICAO_EM_GENERO_RESTRITO` por
`src` em `research/tools/check-claims.mjs`, no valor de hoje, só desce.

| onde | ids |
|---|---|
| `G001` | 8 |
| `G020` | 7 |
| `G002`, `G016` | 5 cada |
| `G007`, `G012`, `G017`, `G019`, `R047` | 4 cada |
| `G005` | 3 |
| `G009`, `G011`, `G013`, `G014`, `G018` | 2 cada |
| `G029` | 7 |
| `G030` | 5 |
| `G027` | 4 |
| `G031` | 2 |

**A lista de ids é gerada, não copiada:**
```
node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao --limit 0   # 58
node research/tools/check-evidence.mjs --genero form-check          --modo prescricao --limit 0   # 18
node research/tools/check-claims.mjs --verbose | grep "gênero"
```

**O aviso de calibração, que é o que muda o trabalho:** a fila **não** é 76
defeitos. Lida claim a claim na onda 1 (registro em `GENERO.md` §6): nos form
checks, **18 de 18** são cue técnico universal (`G029-38` "o punho por cima do
cotovelo", `G029-43` "o glúteo não sai do banco") ou logística do canal
(`G027-01`, `G030-34`, `G030-35`) — nenhuma é conselho calibrado para o corpo de
terceiro, porque essas já estavam corretamente em `avaliacao-de-terceiro`. No
review, os casos claros são poucos: `G011-32` e `G011-34` (o incremento e o
training max **do nSuns**, entregues pelo próprio texto com "ele manda"). O grosso
é o Blevins generalizando por conta própria (`G020-41`, `G001-08`) ou propondo
modificação dele ao programa alheio (`G016-46`, `G017-32`–`34`).

> **O piso realista está bem acima de zero.** Rebaixar cue universal só para zerar
> a catraca apaga da base uma regra boa sem deixar rastro. O discriminador é **de
> quem é o imperativo**, não o rótulo do vídeo.

**Como se verifica que ficou certo:**
1. Para cada `src` tocado, `TETO_PRESCRICAO_EM_GENERO_RESTRITO.<src>` baixou para
   a contagem nova **no mesmo passe**; `npm run check:kb` sai 0 e o aviso
   *"baixe TETO_… para N"* não aparece para nenhum `src`.
2. Toda claim movida para `relato-de-programa` ou `avaliacao-de-terceiro` continua
   resolvendo em `check-evidence` com `verbatim` intocado — **o verbatim nunca se
   reescreve**, só o `modo`.
3. `node research/tools/verify-manifest.test.mjs` continua com 14 casos verdes: o
   roster `GENERO_TRAVADO` impede que alguém desligue a trava rebaixando o gênero
   do vídeo em vez de abrir a claim.

**Item de curadoria embutido, e ele é uma trava falsa esperando para nascer:**
`G195` e `G196` estão em `review-de-programa` por serem da série sobre o livro de
Rippetoe/Baker, mas são **metade tese própria do Blevins**; os 25 vlogs do ciclo
Cube Kingpin (`G296`–`G338`) estão em `log-de-treino` enquanto ele roda o programa
de Brandon Lilly — material de terceiro **sem trava nenhuma**. Nenhum dos dois
grupos tem claim extraída hoje, então o teto deles vale 0 e a **próxima** extração
reprova o build sobre prescrição legítima dele.
Reproduz: `node -e "const m=require('./research/corpus/blevins/manifest.json');for(const r of ['G195','G196','G302','G318'])console.log(r,m.videos.find(v=>v.ref===r).genero,m.videos.find(v=>v.ref===r).title)"`
**Decida antes de extrair, não depois.**

---

## 3. Fronteira de modo — abrir `pratica-pessoal`, fundir `anedota`

A regra está escrita (`PROTOCOLO-EXTRACAO.md`, "O teste de que tipo de coisa é":
*quantas datas cabem nesta frase?* nenhuma → `fato`, uma → `narrativa`, muitas →
`pratica-pessoal`), com os quatro desempates e o veto da pergunta operacional.
**Nenhuma claim foi retagueada e `pratica-pessoal` não está em `kb.mjs`** — de
propósito: enumerado declarado e vazio foi o argumento que recusou
`scope: TERCEIRO`.

### 3a. Retag mecânico — 243 claims, sem leitura

`anedota` → `narrativa`. Catraca `TETO_ANEDOTA = { V: 196, G: 47 }` em
`check-claims.mjs`, por prefixo, só desce. Exceção: as que a leitura do 3b levar
direto para `pratica-pessoal`.
**Verifica:** `TETO_ANEDOTA` chega a `{ V: 0, G: 0 }` e `npm run check:kb` sai 0;
`check-claims.test.mjs` mantém os dois casos (48 no prefixo G reprova, 47 passa).

### 3b. Retag lido — Tier A dirigido, depois o fan-out

| | |
|---|---|
| Tier A (dirigido, gerado por script) | **115 ids**, precisão ~92 %, 9 falsos positivos já nomeados |
| Tier B | 133 ids, precisão bem menor |
| universo real estimado | **~425 claims**, faixa **291–783** (IC de Wilson por `--ic`) |
| recall do detector, medido **de fora** | **22 %** (2/9 em amostra cega) — os dois tiers **não** são a fila |

```
node research/tools/candidatos-pratica-pessoal.mjs --tier A --ids   # os 115
node research/tools/candidatos-pratica-pessoal.mjs --ic             # universo e IC
node research/tools/candidatos-pratica-pessoal.mjs --recall         # a amostra cega
```

**Os 9 falsos positivos do Tier A, que têm de FICAR onde estão:** `V027-01`,
`V078-22`, `V009-20`, `V050-23`, `V106-02`, `V133-26`, `V175-63`, `V006-24`,
`V034-25`.

### 3c. Três claims que não são retag — partir ou corrigir `scope`

Estas se perdem num fan-out se ninguém as nomear.

- **`V170-33` — PARTIR, não mover.** *"ele supina seis dias por semana **e acha que
  a maioria das pessoas deveria fazer o mesmo**"*. Mover inteiro **enterra uma
  `prescricao` `GERAL` de alta frequência de supino dentro da gaveta que existe
  para dizer "não copie"**, e quem filtra `prescricao` nunca mais a acha. Num
  atleta com histórico de lesão de peitoral é o caso mais perigoso da lista.
- **`V169-08` — mesma forma**, achada num sorteio cego: hábito dele grudado numa
  regra para todo mundo. A classe inteira tem **6 candidatos** (`V170-33`,
  `V169-08` puros; `V047-06`, `V068-05` parentes) — é uma classe pequena, não um
  segundo fan-out. Sinal em `FRONTEIRA-MODO.md` §5.8.
- **`V009-20` — o `scope` vai junto com o `modo`.** Vai para
  `avaliacao-de-terceiro`, está em `PESSOAL`, e a rotina é do cliente. Mover só o
  `modo` a tornaria a única `avaliacao-de-terceiro` `PESSOAL` de 116.

### 3d. As travas que a onda 2 escreve

1. `kb.mjs`: `'pratica-pessoal'` entra em `MODOS`; `'anedota'` **não** sai
   enquanto houver uma só claim usando (enumerado vazio ≠ enumerado removido).
2. `check-claims.mjs`: `modo: 'pratica-pessoal'` com `scope: 'GERAL'` é **erro**.
3. Catraca `TETO_HABITUAL_SEM_PRATICA`. **Leia a especificação corrigida do
   `FRONTEIRA-MODO.md` §5.5 antes de escrever:** o universo **não pode ser a saída
   do detector** (recall 22 % → retagar os 115 zera a catraca e a congela com
   ~300 claims ainda misfiladas, para sempre), e **o piso é 9, não 0** (os falsos
   positivos têm de ficar). Se não houver universo honesto, **não tenha catraca e
   diga que não tem** — catraca que fica verde com a dívida de pé é pior que
   nenhuma.
4. `ENUMERADOS.md`: registrar a entrada e a fusão.

**Verifica:** `check-claims.test.mjs` ganha o caso `pratica-pessoal` + `GERAL` →
vermelho; neutralizar a regra deixa o teste vermelho (confira apagando).

### 3e. O que `pratica-pessoal` NÃO promete, e a onda 2 tem de decidir

A gaveta **não distingue rotina atual de rotina abandonada nem de plano**.
`V088-19` ("6 séries/semana hoje"), `V135-12` ("tentou 15 séries/semana e
continuou exausto") e `V081-26` ("pretende ganhar 1/3 a 1/2 lb/semana") recebem o
mesmo rótulo. Para quem vai ler *"o que ele faz"*, um experimento fracassado
indistinguível da prática vigente é **pior** do que estar em `narrativa`. Hoje a
janela mora só na prosa da claim e em `conditions`. **Decidir se quer um campo é
trabalho da onda 2, e não é retag.**

---

## 4. Números em gaveta errada — 52 params em 39 claims

**A lista virou comando nesta rodada.** `ESTADO.md` §3 a trazia copiada à mão e
§4 dela derivava "19 params"; a contagem mecânica encontra **52**, e duas
famílias que a lista à mão não tinha.

```
node research/tools/params-gaveta-errada.mjs          # relatório por família
node research/tools/params-gaveta-errada.mjs --ids    # 39 ids
node research/tools/params-gaveta-errada.mjs --json
```

| família | params | destino | gaveta existe? |
|---|---|---|---|
| **TAXA (algo por período) tipada como a duração sozinha** — *família nova* | **19** | não existe gaveta para "horas por semana" | **não** |
| `value` string (fração `"1/3"`, rótulo `"5x5"`) | 11 | fração vira número; rótulo perde o param | sim |
| **ano de calendário** tipado como duração ou contagem | **6** | `ano_calendario` | **não** |
| índice adimensional (BRI, R²) tipado como `pct` | 5 | `indice_adimensional` | **não** |
| hora do relógio tipada como duração | 5 | `hora_do_dia` | sim |
| comprimento em pé (ft) tipado como `cm` | 3 | `pes` | sim |
| volume em litro tipado como `kg`/`ml` | 2 | `l` | sim |
| dinheiro (fora de escopo, `ENUMERADOS.md` §5) | 1 | o param sai da claim | — |

**31 dos 52 não têm para onde ir sem ampliar o enumerado de `kb.mjs`.** Isso é o
modo de falha nº 2 em estado puro: **faltar gaveta é pior que ter gaveta demais**,
e foi faltar `frame` para gramas que fez um lote inteiro gravar gramas como `kg`.

**A família nova, porque ela muda o tamanho do passe.** *"4 h/semana de cardio"*
está gravado como `4` com frame `horas`, ao lado de *"treino de 3 h"* gravado como
`3` com frame `horas`. O `unit` guarda o `/semana`, mas `unit` é texto livre e
**`frame` é a gaveta que o consumidor lê** — quem filtra por frame soma laranja
com maçã. São 19 params em `V005`, `V006`, `V013`, `V019`, `V044`, `V048`,
`V102`. A lista à mão só tinha `V102-25`.

**Contraprova barata de que o passe de reparo ainda não aconteceu:** as gavetas
`pes`, `l`, `pct_XRM` e `grau_C` foram abertas em 9/8 e têm **zero uso**. Ampliar
o enumerado sem mover o dado para dentro dele é meio conserto — e é meio conserto
que parece conserto inteiro no documento.

**Dois números que não medem nada (mesmo passe, decisão diferente):**
`V013-15` *"100 % convicto"* — percentual de convicção não mede coisa nenhuma.
`V166-05` — a claim **é uma nota de artefato de extração** (*"o número que a
transcrição registra é 45 lb, valor implausível"*) ocupando gaveta de `fato`, com
o número quebrado tipado num `param`. Ela não é uma claim; sai.

**Também no mesmo passe (`V142-08`):** `r2_min = 65` e `r2_max = 0.9`, duas
escalas diferentes no mesmo par de params. Um deles está errado por 100×.

**Como se verifica que ficou certo:**
1. `node research/tools/params-gaveta-errada.mjs` imprime **zero** achados.
2. **Cada regra do detector vira uma recusa de `check-claims.mjs`** e este arquivo
   é apagado. Detector fora do `check:kb` não impede reincidência.
3. Cada recusa nova tem caso em `check-claims.test.mjs` **exigindo a mensagem**;
   neutralizar a recusa deixa o teste vermelho (confira neutralizando).
4. Nenhuma gaveta nova entra em `kb.mjs` sem o trecho correspondente em
   `ENUMERADOS.md` e `SCHEMA.md` **no mesmo passe** — o enumerado crescer no
   código e o documento descrever outra coisa já aconteceu aqui.

---

## 5. Registrar o atleta como claims `tier U` — hoje são 0

**Por que sobe na fila:** o item 1 está bloqueado por ele, e toda conversa de
domingo recomeça do nada.

`check-claims.mjs` já trava `tier U`: exige `source.date` em ISO (linha 378).
A trava chegou antes do dado, de propósito.

**O que registrar (fonte: `research/baseline.md` e as conversas):**

| | |
|---|---|
| Lesão | peitoral rompido, com a data — é o que governa o §1.2 inteiro |
| Marcas convertidas | agachamento ≈ **215 kg** legal (210–235), supino ≈ **160 kg** pausado (152–164), terra ≈ **240 kg**, **cada uma com o imposto de legalidade e a faixa**, nunca só a mediana |
| Antropometria e nutrição | 87 kg, classe 93 kg IPF, 28 anos, manutenção 2.600 kcal verificada |
| História competitiva | nunca competiu, nunca fez single sob comando |
| Mudança de técnica | a alteração da semana 1 |
| **O gate do bloco** | *"o gate do bloco 1 congela o degrau a 2/10 de dor no peitoral"* — é ela que dá alvo ao `conflicts` do item 1 |

**Como se verifica que ficou certo:**
1. Os ids `U0xx` resolvem em `node research/tools/check-evidence.mjs U001 …`.
2. `npm run check:kb` sai 0 com `tier U` presente — se `source.date` faltar ou não
   for ISO, ele reprova, e isso é a prova de que a trava está viva.
3. O `conflicts` do item 1 aponta para a claim do gate e o canário novo passa.
4. **Uma conversa sem contexto de prompt responde Q03 e Q17 corretamente** —
   é o teste que separa "está na base" de "está no prompt".

> **Nenhuma marca entra sem a faixa.** `baseline.md` §1 é o único dos três que
> hoje cita **nenhuma** fonte para o fator de −12 a −18 %, e é esse fator que
> governa 215/160/240 e portanto toda a carga do bloco. Gravar `215` como número
> seco em `tier U` congela um palpite como se fosse medida — e é exatamente o
> pecado que o `ESTADO.md` abre proibindo.

---

## 6. Passe de Whisper — 53 janelas cegas de 74 marcadas

Caro (áudio + modelo), mas é o único item que resolve número corrompido sem
adivinhação. A ferramenta existe e o `CONFIRMADO` falso dela já foi consertado
(`norm()` apagava o ponto decimal: `0.8` virava `0 8` e casava com o `8` da
legenda — a única ferramenta feita para pegar erro de número era cega justamente
para o erro de décimo).

| | |
|---|---|
| `suspect: true` | **74** |
| **sem `suspectWhy`** | **53** — o passe recebe a janela sem saber se procura número ou negação |
| com `suspectWhy` | 21 (**17** `numero`, **4** `negacao`) |
| catraca | `TETO_SEM_SUSPECT_WHY = 53` em `check-claims.mjs`, só desce |

**Os 53, gerados:**
```
node -e "const fs=require('fs'),p=require('path');const d='research/extract';const o=[];for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.jsonl')))for(const l of fs.readFileSync(p.join(d,f),'utf8').split('\n')){if(!l.trim())continue;try{const c=JSON.parse(l);if(c.suspect&&!c.suspectWhy)o.push(c.id)}catch{}}console.log(o.join(' '))"
```
```
V002-07 V002-08 V002-13 V002-16 V002-17 V002-18 V007-02 V009-24 V011-10 V015-04
V020-42 V029-11 V032-01 V033-09 V033-10 V033-14 V037-06 V049-03 V050-01 V051-10
V056-11 V057-23 V060-06 V064-03 V079-22 V083-09 V083-18 V083-20 V085-20 V089-02
V089-15 V090-16 V090-19 V095-18 V123-06 V128-05 V129-19 V135-03 V135-05 V135-12
V142-08 V143-11 V151-23 V153-03 V154-06 V154-20 V166-05 V170-54 V171-09 V175-01
V175-35 V177-16 V185-03
```

**Os números corrompidos já nomeados, que o passe tem de resolver:**
`V095-18` (`agacho_antes: 45 lb` num contexto de 422 lb) · `V117-01` e `V112-04`
(supino de 45 lb onde o resto do corpus diz 405) · `V153-03` (292,5 kg gravado
como 622 lb, sendo 645) · `V037-06` (total de 92,5 kg) · `V175-01` (678 lb gravado
como 37,5 kg) · `V160-30` · `V070-26/27` (sem unidade de massa) · `V043-27` (**o
áudio não resolve**: `large-v3` diz 20, `turbo` diz 28) · `V033-10` (o único valor
fora de escala da base: "2 and a half to 3 RPE" saiu do ASR como "2 and 12 to 3").

**Duas dessas 53 não são trabalho de Whisper, e gastar áudio nelas é desperdício:**
`V166-05` **não é uma claim** — é a nota de artefato de extração do item 4, e sai da base
inteira. `V142-08` é o par de R² com duas escalas (`65` e `0.9`), que é erro de tipagem, não
de ASR. Resolva as duas pelo item 4 e baixe o teto por elas também.

**Como se verifica que ficou certo:**
1. `TETO_SEM_SUSPECT_WHY` baixa para o número real, no mesmo passe; `check:kb` 0.
2. Toda claim verificada ganha `verified: "whisper"` e `verbatimWhisper` **ao lado**
   do `verbatim` original, que **nunca** é reescrito.
3. `V043-27` fica marcada como **irresolúvel pelo áudio** e não como resolvida —
   dois modelos discordando é resultado, não pendência.
4. **`SUSPEITOS-VERIFICADOS.md` só nasce quando a cobertura justificar.** Ele
   continua não existindo **de propósito**: gerá-lo com 11 de 148 alvos criaria um
   documento que parece completo.

---

## 7. Gate de dor — o que a onda 1 declarou aberto

Produção está correta e verificada por 59 cenários mais duas auditorias por
mutação (`GATE-DOR.md` §8 e §9). O que falta é **trava**, não comportamento.

| item | tamanho | onde |
|---|---|---|
| `check:gate:mutantes` — alvo que aplica as mutações e exige reprovação em todas | 24 mutações já escritas, com repro | `GATE-DOR.md` §9 |
| `buildWeekPayload` sem cenário de **comportamento** | exige stub de `getSessionIndex`/`getWorkouts`, importados no topo do módulo | `src/services/sync/documentBuilders.ts` |
| `estiramento agudo` **não tem campo na pesquisa** | 1 célula da tabela §1.2 | é a única do §1.2 sem trava possível |
| semana limpa não exige mínimo de sessões de supino | duas semanas com **uma** sessão cada satisfazem o `RETORNO`, num bloco que prescreve quatro | declarado, não consertado |

**Duas advertências que a onda 1 pagou para aprender:**
- **A automação das mutações prova a LISTA, não a trava.** Escreva o alvo com esse
  limite declarado no cabeçalho, senão ele vira a próxima trava que se testa a si
  mesma.
- **`PAIN_GATE.limiarMinimo === 2` é o único número da suíte fixado à mão**, de
  propósito, para que afrouxar o gate seja ato explícito. Quem mudar o §1.2 edita
  as duas coisas no mesmo passe — a mensagem de falha diz isso.

**Verifica:** `npm run check:gate` verde **e** `check:gate:mutantes` reprovando as
24; `git diff --stat src/` vazio se o passe for só de trava.

---

## 8. O aviso de número por extenso, que é suprimido por qualquer `param` — 103 claims

A condição no código é *"tem número por extenso **E nenhum** param"*, então basta
um param de qualquer coisa para o aviso sumir, **mesmo que o número por extenso
seja outro**. Medido em 9/8 com método declarado (`numerosPorExtenso(claim)`,
descartando `1`, em claims que **têm** param, exigindo que o valor não apareça em
nenhum `param.value`): **103 claims, nenhuma emite aviso**.

Exemplos: `G009-04` (*"variações de seis e de 3 dias"*), `G051-37` (*"com seis pés
de altura"*) — e `G051-37` foi justamente a claim citada para **abrir o frame
`pes`**, que segue com zero usos (ver item 4).

> **O "zero avisos restantes" de um relatório anterior é artefato desta supressão.**

O conserto (trocar *"não tem param nenhum"* por *"este extenso não bate com nenhum
valor declarado"*) é o trabalho todo, porque a composição — *"oitenta e um"*,
*"dois vírgula cinco"*, *"treze milímetros"* onde "mil" é falso positivo — é onde
uma versão malfeita produz dezenas de avisos sem conserto.

**Verifica:** os 103 passam a emitir aviso; a taxa de falso positivo do parser de
extenso é **medida e declarada** numa amostra, não afirmada.

---

## 9. Os dois limites do `check-answer.mjs`

Declarados no cabeçalho dele e no `INSTRUMENTO.md` §3. **Ambos exigem decidir
contrato**, e mudar o contrato muda o significado de T5 para quem já escreve
resposta — por isso é decisão de design, não item de fan-out.

- **A anistia de `tier I … basis:` é cega** e isenta todo número numa janela de
  ±200 caracteres: **11 doses fabricadas passaram com `--estrito`**.
- **Citar um documento admite o documento inteiro**, sem noção de localidade:
  `IPF-REALIDADE.md` sozinho põe **467 números** na piscina.

**Verifica:** as 11 doses fabricadas passam a reprovar, e os 34 casos de
`check-answer.test.mjs` continuam verdes com o contrato novo escrito no
`INSTRUMENTO.md` **no mesmo passe**.

---

## 10. Ledger de contradições e sínteses

31 `conflicts` numa base de 6.909 claims **com duas fontes que discordam** é
subregistro quase certo. A primeira aresta a registrar é o item 1.
`research/synth/` e `research/kb/topics/*.md` continuam vazios apesar de o
`SCHEMA.md` os descrever (`RUNBOOK.md` §8.9).

**Verifica:** ≥25 arestas bidirecionais; e **toda** aresta em horizonte de próxima
sessão termina em `decisao` escrita, com a assimetria de custo em números ou em
tempo perdido. Contradição é para decidir, não para catalogar.

---

## 11. Infraestrutura — pequeno, e cada um é uma contagem que mente

| item | onde | por que morde |
|---|---|---|
| `R191.jsonl` tem **0 byte** | `research/extract/R191.jsonl` | passa em toda contagem por nome; ninguém sabe se é vídeo sem conteúdo ou lote perdido |
| `R132.jsonl` pula `V132-25` e `V132-28` | idem | buraco de sequência sem explicação registrada |
| `.tmp` fora do `.gitignore` | `research/corpus/.tmp/`, `research/corpus/blevins/.tmp/` | um `fetch-captions.mjs` que morre no meio deixa `.json3` bruto, e `git add research/` varre tudo (`RUNBOOK.md` §8.12) |
| `SCHEMA.md` prescreve `date` na claim | nenhuma das 6.909 tem, e o checker não exige | `RUNBOOK.md` §8.7 — ou o schema muda, ou o checker deriva do `src` |

---

## O que esta fila NÃO conserta, dito antes de ela rodar

**Determinismo prova FIDELIDADE À FONTE, não CORREÇÃO DA FONTE.** Nenhum item
acima torna o Vena ou o Blevins certos sobre treinar. O `genero` prova de que
**vídeo** a claim veio, não se ela é relato ou generalização legítima; a regra de
`modo` decide a gaveta, não se a prática é boa; o passe de Whisper conserta o
dígito, não o conselho.

E o que continua valendo acima de tudo: **número de qualidade sem instrumento
nomeado é opinião com cara de medida.** Nenhum item desta fila fecha citando um
placar — cada um fecha com um comando que outra pessoa roda.
