# Auditoria da classificação GERAL vs PESSOAL

Data: 2026-08-09. Base auditada: `research/extract/*.jsonl` (178 arquivos, 5.004 claims).
Nenhum `.jsonl` foi editado. Tudo aqui é proposta.

## Por que esta auditoria existe

O consumidor da base é um homem de 28 anos, 87 kg, natural, que nunca competiu.
A fonte é Matt Vena: agacha 400 kg, pesa ~120 kg, compete numa federação testada
mas é um outlier em qualquer eixo que importe. A base só é segura se a fronteira
entre **"ele manda você fazer"** (`GERAL`) e **"ele conta o que ele faz"**
(`PESSOAL`) estiver correta.

A assimetria governa o julgamento: **errar para `GERAL` é caro** (hábito de um cara
de 400 kg vira ordem para um natural de 87 kg); **errar para `PESSOAL` é barato**
(perde-se um conselho, não se ganha uma lesão). Na dúvida, `PESSOAL`.

## Composição da amostra

| estrato | o que é | n |
|---|---|---|
| A | `GERAL` aleatória, 1 por vídeo, 100 vídeos distintos | 100 |
| B | `PESSOAL` aleatória, 1 por vídeo | 55 |
| C | `GERAL` **enriquecida**: `verbatim` em 1ª pessoa e sem "you" | 60 |
| D | `PESSOAL` **enriquecida**: `verbatim` sem marcador de 1ª pessoa | 40 |
| E | `GERAL` com condicional embutida ("if you…", "beginner", "advanced") | 40 |
| F | claims com marcador explícito de fronteira ("i don't recommend", "personally", "aggressive") | 48 |
| G | `GERAL` cujo **texto da claim** descreve o próprio Vena | 52 |
| H | `GERAL` de volume / frequência / intensidade / singles com número | ~70 |

**Total único auditado: 458 claims, em 141 dos 178 vídeos.**
344 `GERAL` (75%) e 114 `PESSOAL` (25%) — enviesado para `GERAL` de propósito,
que é onde mora o erro que machuca.

Os estratos A e B são não-enviesados e servem para estimar a taxa. Os estratos
C–H são caça dirigida e servem para o inventário de erros, não para a taxa.

---

## 1. Taxa de erro, separada por direção

### Direção GRAVE — `GERAL` que deveria ser `PESSOAL`

- Estrato A (100 `GERAL` aleatórias): **0 erros claros**, 5 casos estruturalmente
  ambíguos (seção 4).
- Estrato C (60 `GERAL` enriquecidas para 1ª pessoa, o balde de maior rendimento
  possível): **2 erros claros + 3 claims fundidas**.
- Estratos E, G, H (132 claims dirigidas): **4 erros claros**, todos anedota de
  terceiro.

**Total: 9 erros em 344 `GERAL` auditadas = 2,6%.**
Isolando só os erros integrais (excluindo as fundidas): **6/344 = 1,7%.**
Extrapolando a taxa do estrato aleatório A para as 3.237 `GERAL` da base, o
número esperado de erros integrais é baixo — a ordem de grandeza é dezenas, não
centenas.

### Direção LEVE — `PESSOAL` que deveria ser `GERAL`

- Estrato B (55 `PESSOAL` aleatórias): **0 erros**.
- Estrato D (40 `PESSOAL` enriquecidas): **1 erro claro**, 2 borderline.
- Varredura exaustiva de `PESSOAL` com linguagem prescritiva no `verbatim`
  (`you should`, `make sure you`, `i recommend`, …) em toda a base: retorna
  **3 registros no total**, dos quais 2 são erro.

**Total: 2 erros em 114 `PESSOAL` auditadas = 1,8%.**

### Leitura

As duas taxas são baixas e comparáveis. **Isso não é o resultado.** O resultado é
o que está na seção 3: os erros de direção grave **não estão nas claims de
prescrição**. Estão em narrativa, anedota de terceiro e citação de estudo. As
claims que de fato mandam fazer algo — dose, volume, frequência, intensidade —
estão bem classificadas. O que está quebrado é outra coisa: o rótulo `GERAL` não
significa "prescrição".

---

## 2. Todas as classificações erradas encontradas

### 2.1 `GERAL` → deveria ser `PESSOAL` (grave)

**V005-15** · R005 @03:48 · atual `GERAL`
> "There's a massive difference in the pace I can maintain based on how much water I get in during my workout"

n=1 puro sobre o ritmo de cardio dele. **→ `PESSOAL`.**
Agravante: a versão `GERAL` existe na frase seguinte da transcrição e **não foi
extraída** — "even if you're not doing cardio just for lifting, I'd really try
just like drinking quite a lot of water… I think you'll find it makes quite a
difference in your recovery between sets". A base guardou o n=1 como geral e
descartou o geral.

**V173-16** · R173 @04:22 · atual `GERAL`
> "this is a story from a friend of mine um he took a study drug um something like five months before his competition"

Anedota sobre um terceiro, num vídeo sobre testagem antidoping. Não é prescrição
nem prática dele. **→ `PESSOAL`** (ou tier de terceiro — ver seção 4).

**V055-19** · R055 @02:16 · atual `GERAL`
> "Reddit was literally crowdfunding a barbell for Ray Williams because he couldn't load over 700 lb on the bars at his gym"

Trivia sobre terceiro. **→ `PESSOAL`.** Mesma coisa em **V055-20** e **V030-31**.

**V090-14** · R090 @01:30 · atual `GERAL`
> "arguably the best powerlifter ever copied by six day per week sbd program… recently she's opted to seven times per week"

**V114-19** · R114 @02:33 · atual `GERAL`
> "Evan Jeric has done it for years. I got a sick quote that squats six days per week as well as every other lift"

**V114-21** · R114 @03:03 · atual `GERAL`
> "for example, would squat and deadlift once every two weeks"

Três anedotas sobre atletas de elite marcadas `GERAL`. As anedotas equivalentes
**V053-07** (Austin Perkins, 6×/semana) e **V060-01** (Elliot Sykes) estão
`PESSOAL`. Não existe regra: a base decide caso a caso. **→ `PESSOAL`**, por
consistência com V053-07 — e porque "a melhor lifter do mundo agacha 7×/semana"
marcado `GERAL` é exatamente prática de outlier com autoridade de recomendação.

**V054-24** · R054 @02:17 · atual `GERAL` · **claim fundida**
> "A big mistake I see lifters make is getting too sedentary though. Keeping up this light movement has helped me feel much more limber"

Duas afirmações num registro só, com `scope` único. A primeira é `GERAL`; a
segunda ("has helped **me**", dentro do taper dele para o North American
Championships) é `PESSOAL`. **→ dividir em duas claims.** Viola também a regra de
granularidade do `SCHEMA.md`.

**V011-27** · R011 @04:50 · atual `GERAL` · **claim fundida**
> "So, I try to hit it more with accessory work. Now, one great way to work this is hyperextensions."

Primeira metade `PESSOAL`, segunda `GERAL`. **→ dividir.**

**V034-14** · R034 @02:02 · atual `GERAL`
> "if I'm having it earlier in the day, it will not have as negative effects on sleep quality"

A claim ("Consumir a cafeína mais cedo no dia reduz os efeitos negativos sobre a
qualidade do sono") é geral; o `verbatim` citado é n=1 dentro de um vídeo de
"o que eu como num dia". **→ ou vira `PESSOAL`, ou troca-se o `verbatim` pelo da
linha seguinte**, que é o geral de verdade: "even if you're having caffeine
within 9 hours of bed, it can still affect your sleep quality".

### 2.2 `PESSOAL` → deveria ser `GERAL` (leve)

**V039-26** · R039 @04:17 · atual `PESSOAL`
> "You're going to want to make sure you're consistent with yourself naked every morning before eating or drinking anything"

Prescrição direta e literal ao espectador sobre protocolo de pesagem, marcada
`PESSOAL`. **→ `GERAL`.** É o erro barato: perde-se um conselho inofensivo.

**V170-33** · R170 @07:15 · atual `PESSOAL` · **prescrição escondida dentro de um registro `PESSOAL`**
> "i do it six days a week this is super high frequency and i think most people should do it"

O texto em pt-BR da claim diz, literalmente, "…e acha que a maioria das pessoas
deveria fazer o mesmo". **A prescrição está no corpo de um registro marcado
`PESSOAL`.** Quem filtrar por `scope` não vê; quem ler o texto da claim vê a
ordem. **→ dividir em duas: `PESSOAL` (ele supina 6×/semana) + `GERAL` (ele acha
que a maioria deveria).** Ver seção 5 — é a claim de maior consequência da
auditoria.

**V170-56** · R170 @12:37 · borderline. Explicação biomecânica genérica ("you're
gonna have to bend over more to get to the bar") dentro de um vídeo sobre o
programa dele. Defensável como `GERAL`; deixar como está é conservador e barato.

### 2.3 Defeitos que não são de `scope` mas apareceram no caminho

Não são erro de classificação, mas quebram a mesma cadeia de confiança:

- **V011-20** — claim diz "puxadores de sumô **devem sempre** incluir uma variação
  de hinge"; `verbatim` guardado é só "for sumo pullers, I find" — corta
  exatamente onde a prescrição começa. A transcrição confirma a claim ("for sumo
  pullers, I find you always want to include some variation like this"), então o
  `scope` está certo, mas o `verbatim` não sustenta nada. Mesmo padrão em
  **V010-11** (RIR 4–7) e **V099-24** (frequência de terra).
- **V175-53** — "Supinar 6 dias por semana é viável para a maioria das pessoas
  desde que se mantenha bem submáximo": condição preservada, mas a transcrição
  qualifica muito mais forte três linhas abaixo — "i like never go above rp5".
  A condição sobrevivente ("bem submáximo") é vaga; a condição verificável
  (**RPE 5**) foi perdida.
- **V170-11** — "Fazer singles o ano inteiro é algo que todo powerlifter deveria
  fazer" (`GERAL`, correto) **não carrega intensidade nenhuma**. Os ~90% moram no
  registro vizinho **V170-09**, marcado `PESSOAL`. Consumidas juntas, viram
  "single semanal a 90% para todo mundo".

---

## 3. O achado principal: `GERAL` não significa "prescrição"

Classificando as 3.237 claims `GERAL` pelo `verbatim`:

| o que a claim `GERAL` realmente é | n | % |
|---|---|---|
| opinião, explicação de mecanismo, fato do mundo | ~2.616 | **79%** |
| **prescrição explícita** (`you should`, `i recommend`, `make sure`, …) | ~554 | **17%** |
| narração de literatura ("this study found…") | ~127 | 4% |
| anedota sobre terceiro | ~25 | 1% |

**Só 17% do que está marcado `GERAL` é ele mandando você fazer algo.** O resto é
ele explicando um mecanismo, dando uma opinião, narrando um estudo ou contando
uma história sobre outro atleta.

A consequência é direta e é a mesma falha da run 1, um nível acima: a run 1
achatou `GERAL` e `PESSOAL` em prescrição; a run 2 separou os dois corretamente,
mas achatou **cinco coisas diferentes dentro de `GERAL`**. Qualquer consumidor
downstream que trate `scope == "GERAL"` como "isto é uma recomendação" está
importando 2.616 opiniões e 127 estudos como se fossem ordem.

Evidência dura do achatamento: **161 claims que narram estudo estão `GERAL` e 3
estão `PESSOAL`.** Não há decisão sendo tomada ali — é o valor default.

Proposta mínima (não implementada): um campo separado `modo` com
`prescricao | opiniao | mecanismo | literatura | anedota`, ortogonal a `scope`.
`scope` responde *sobre quem*; `modo` responde *que tipo de ato de fala*. Enquanto
não existir, **`GERAL` sozinho não pode governar nada no programa.**

---

## 4. Onde a fronteira é estruturalmente ambígua

Estes são os temas em que a distinção binária simplesmente não se sustenta com o
material disponível. Forçar uma classificação aqui é inventar informação.

**4.1 O que ele programa para os alunos.**
"basically all my sumo deadlifters are going to be doing stiff-legged deadlift
once per week" (V011-21), "It's a staple in my clients' programs" (V018-08),
"how I usually do it for other people is I'll add reps week to week" (V033-23).
É descrição da prática dele (`PESSOAL`) e prescrição a terceiros (`GERAL`) ao
mesmo tempo. Hoje está `GERAL`. O problema: os alunos dele são competidores, não
um natural de 87 kg que nunca competiu. É uma prescrição real, mas **para uma
população que não é a do consumidor** — e o campo `scope` não tem como dizer isso.

**4.2 Anedota sobre terceiros.**
24 `GERAL` contra 15 `PESSOAL`, sem regra discernível. Elliot Sykes é `PESSOAL`,
Evan Jeric é `GERAL`. Nenhum dos dois é nem uma coisa nem outra: é observação
sobre um terceiro. O `SCHEMA.md` tem tier `E` para "atleta de elite do roster
curado", mas o tier é sobre **procedência**, não sobre **quem é o sujeito da
afirmação**, e essas claims são `R` (ditas no corpus).

**4.3 Narração de literatura.**
127–161 claims. "this study found months of training with 1/nth of the original
volume was enough to maintain the gain" não é prescrição dele nem prática dele.
Marcá-las `GERAL` dá a elas o mesmo peso de "you should be squatting twice per
week". O `SCHEMA.md` reserva o tier `L` para literatura com PMID/DOI — mas quando
o Vena narra um estudo no vídeo, a claim é tier `R` e cai em `GERAL` por falta de
gaveta.

**4.4 Fato do mundo e trivia.**
"O Commonwealth é um evento da IPF, no Canadá, em setembro" (V012-04, `PESSOAL`).
"Esse é o recorde mundial de agacho mais antigo em vigor na IPF" (V024-17,
`GERAL`). Dois fatos verificáveis sobre o mundo, dois `scope` opostos. Nenhum dos
dois rótulos significa nada aqui.

**4.5 O "you" genérico do inglês falado.**
"sometimes you just got to erase it and just go for it" (V025-16, `PESSOAL`),
"it really just fuels your training and you perform so much better just being in
that slight surplus" (V019-22, `PESSOAL`). Em inglês falado, "you" alterna entre
"a gente" e "você" dentro da mesma frase, e o falante não marca a transição. **Em
nenhum dos dois casos dá para decidir a partir do texto.** A base foi
conservadora nos dois, que é a escolha certa dada a assimetria — mas é uma
escolha, não uma leitura.

**4.6 Opinião normativa em primeira pessoa.**
"my basic training philosophy is SBD should be more submaximal" (V089-09),
"my general view for powerlifting is the less specific an exercise is the closer
it should be pushed to failure" (V112-14). Primeira pessoa gramatical, conteúdo
prescritivo. Hoje `GERAL`, e isso está certo — mas o critério não é o pronome, é
o modal ("should"), e isso precisa estar escrito em algum lugar. **É a fonte mais
provável de erro futuro em extrações novas.**

**4.7 A generalização a partir do próprio corpo.**
"if somebody can get to as high body weights as me and maintain pretty decent
health markers, the average person has nothing to worry about" (V044-26, `GERAL`).
O `scope` está tecnicamente certo — ele está generalizando explicitamente. Mas a
evidência é n=1, e o n é um homem de 120 kg. `GERAL` não distingue "geral porque
há razão" de "geral porque ele resolveu generalizar de si mesmo". Padrão idêntico
em **V045-05** ("Você provavelmente aguenta cortes mais agressivos do que
imagina") e no bloco todo do supino 6×/semana, cuja evidência é ele ter ido de
363 lb para 405 lb (R170 @07:45).

---

## 5. As dez claims `GERAL` mais perigosas se o `scope` estiver errado

Critério: impacto sobre um natural de 87 kg, sem histórico de competição, caso a
claim seja lida como ordem. **Nenhuma destas dez foi julgada errada** — a lista
é de exposição, não de erro. A pergunta é: o que quebra se estiver errada.

| # | id | o que manda fazer | por que dói |
|---|---|---|---|
| 1 | **V170-33 / V170-34** · R170 @07:15 | supino **6×/semana** como "a chave" | A prescrição a "most people" está dentro de um registro **`PESSOAL`** (§2.2). A evidência é ele: 363→405 lb, 120 kg, num programa de 6 dias que ele próprio **não conseguiu manter** depois de adoecer (R175 @16:34). Se o scope se resolver para `GERAL` sem carregar "nunca acima de RPE 5", é a claim que mais reescreve a semana de treino de um natural. |
| 2 | **V092-01** · R092 @00:00 | "everybody on bench should try higher frequencies **three four or even more** times per week" | `GERAL` correto e sem condicional alguma na fonte — verificado na transcrição. Justamente por ser incondicional é a mais transferível para quem não deveria recebê-la. |
| 3 | **V170-11 + V170-09** · R170 @02:26 / @02:11 | **single pesado semanal em cada movimento**, a ~90% | O "todo powerlifter deveria" é `GERAL`; o "~90%" é `PESSOAL`. Consumidos juntos: single a 90% toda semana nos três. A versão segura existe (V137-14: RPE 6–8, 2–4 RIR, 85–90%) e precisa ser a que governa. |
| 4 | **V093-17** · R093 @01:46 | "basically every lifter should be squatting **at least twice per week**" | Piso de frequência incondicional, dito por quem agacha 400 kg. Verificado: não há condição na fonte. |
| 5 | **V117-24 / V146-18-21** · R117 @04:03, R146 @02:32 | 2–3 dias de agacho, 3–5 de supino, 1–2 de terra, **4–5 dias totais** | É o esqueleto semanal inteiro. Se estiver errado para `PESSOAL`, o programa do consumidor foi desenhado a partir da agenda de um profissional. |
| 6 | **V175-53** · R175 @16:49 | supino 6×/semana é "attainable for most people" | Condição preservada só como "bem submáximo"; a condição verificável (**RPE 5**) foi perdida na extração. Volume alto sem teto de RPE é a receita clássica de lesão de ombro num natural. |
| 7 | **V045-05 / V006-19** · R045 @00:15, R006 @02:46 | "você aguenta cortes **mais agressivos** do que imagina sem perder músculo" | O `scope` está certo, a evidência não é. Um homem de 120 kg tem margem de gordura e massa que um natural de 87 kg não tem. Aqui o erro não é de scope — é de população — e nenhum campo da base registra isso. |
| 8 | **V137-14 / V137-15** · R137 @01:47 | singles conservadores, RPE 6–8, **85–90% do 1RM** | Puxa na direção segura, mas define o teto de intensidade da base inteira. Se estiver errada para `PESSOAL`, o consumidor perde a única guarda explícita contra singles pesados. **É a claim `GERAL` cujo erro seria perigoso por remoção, não por adição.** |
| 9 | **V101-04 / V145-28** · R101 @00:30, R145 @05:19 | 8–15 séries por músculo; 18–20 séries semanais de agacho/terra como teto | Define a dose de volume. Números altos herdados da tolerância de um outlier de 120 kg. |
| 10 | **V036-31 / V049-21** · R036 @03:16, R049 @02:02 | precisa de trabalho "mais máximo" para calibrar tentativas; treinar só a 80% deixa o teste intimidador | Empurra o consumidor para carga máxima. Ele nunca competiu — não há tentativa a calibrar. A condição real ("quem vai competir ou testar máximo") está preservada em V036-31 e **ausente** em V049-21. |

Um padrão liga as dez: **as claims mais perigosas são todas de frequência,
volume e intensidade, e em todas elas o número seguro e o número perigoso moram
em registros diferentes** — às vezes com `scope` diferente, às vezes a segundos
de distância na mesma transcrição. O risco real da base não é uma claim mal
classificada. É a prescrição e a sua condição terem sido separadas na extração e
não terem como se reencontrar.

---

## 6. O que a base acertou, e vale registrar

**A fronteira explícita foi respeitada onde ele mesmo a marcou.** R027 @03:50:

> "I took a really aggressive approach uh to my back injury, **but I generally
> advise against that**. It's just, you know, I really know my body at this point."

A base separou corretamente: **V027-18** (`PESSOAL`, a abordagem agressiva) e
**V027-19** (`GERAL`, o desaconselhamento). Este é o caso-modelo, e é o que a run
1 teria achatado.

O mesmo acerto em R038 @00:30 (**V038-06**): "This isn't the case for me, but it
is for many people I coach" → `GERAL`. E em R006, onde o cut agressivo dele
(V006-26, `PESSOAL`, 1 lb/semana "cuz I've got short term performance goals") está
separado da regra geral (V006-19, `GERAL`).

**A varredura exaustiva de linguagem prescritiva em registros `PESSOAL` retorna
3 casos em 1.624.** A contaminação na direção leve é praticamente nula.
