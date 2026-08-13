# BASE — onda de auditoria do peitoral, 12/08/2026

> Extraído do journal `wf_5ebac2a2-b42` depois de o agente `exposicao` morrer
> por `API Error: The response stopped arriving`. Salvo porque só existia na memória do workflow.

> ⚠️ **CORREÇÃO POSTERIOR — leia antes do resto.** Trabalho PARCIAL de um agente que morreu no
> meio da auditoria, preservado como REGISTRO e não como conclusão.
> **DERRUBADO (linhas 182, 187 e 221 — eram 167, 172 e 206 antes deste bloco):** que os
> endereços `R79 @03:35` e `[R1 @01:04]` "NÃO EXISTEM". A acusação
> saiu de um teste de igualdade EXATA de timestamp, e esse teste condena **230 dos 263**
> endereços do `PROGRAMA.md` — inclusive os corretos. **249 dos 263** caem numa janela de 0 a
> 7 s da claim que citam, e os cinco endereços acusados estão a 2, 3, 4, 6 e 6 s — dentro
> dela, e dois apontam para a claim certa. Não existe a classe "endereço fabricado".
> **SOBREVIVEU:** `R79 @03:35` cai no bloco de `V079-30`/`V079-31` (medo e relesão), não no
> limiar 2–3/10, que é `V079-34` `@03:47` — erro de endereço real, mas UM caso. E o achado de
> RÓTULO: o §1.2 marcava `V079-34` como `[PESSOAL]`; a base grava `scope: GERAL`,
> `modo: prescricao`. Corrigido em `src/data/program/vena-block1/source/PROGRAMA.md:491-501`.
> **A LIÇÃO:** igualdade exata de timestamp é instrumento quebrado; a tolerância é **±7 s**, e
> é MEDIDA (mediana do passo da grade de `at`, 15 s, dividida por dois), não chutada.

## RESPOSTA — o que a base manda fazer com dor leve presente no peitoral

**Método:** gaveta, não texto livre. `--topic dor --limit 0` (119), `--topic lesao --modo prescricao --limit 0` (83 de 362), `--topic peito --limit 0` (31), e cruzamento com `autorregulacao`, `recuperacao`, `proximidade-da-falha`, `selecao-exercicio`, `supino`, `rom`. Todos os ids abaixo resolvem em `check-evidence.mjs` (testei uma citação inventada, `V089-28`, e a ferramenta acusou: *"NÃO EXISTE — esta citação é fabricada"*).

---

## 0. O BURACO: CONFIRMADO, E É MAIOR DO QUE VOCÊ ACHOU

Confirmado, com o código na mão:

- `src/services/sync/weeklyRollup.ts:409` — `buildGateReadings` lê **exatamente duas fontes**: `sess.pre?.pain` e `sess.post?.newPain`.
- `src/types/index.ts:475-527` — `PainEntry` só existe dentro de `PreWorkoutSurvey` e `PostWorkoutSurvey`, e **as duas carregam `workoutId` obrigatório**.
- `src/pages/Workout.tsx:167` é a **única** montagem de `PreWorkoutSurveySheet` em todo o app, e ela recebe `workout.id`.

**Não existe caminho no app para registrar dor sem abrir um treino.** Ele não treinou esta semana: `sessions = []` → `buildGateReadings` devolve `[]` → `evaluatePainGate` retorna `null` na primeira linha (`if (readings.length === 0) return null`). O sintoma que ele tem agora é literalmente invisível para as quatro linhas do §1.2.

**E há um segundo buraco que ninguém tinha escrito.** O §1.2 declara **três** momentos (pré-sessão · 1ª série pausada com carga de trabalho · pós-sessão) e a nota de linha do Supino Pausado repete os três. O app coleta **dois**. Não existe campo de dor intra-sessão em lugar nenhum — nem em `useWorkoutSurveys.ts`, nem em `rollupTypes.ts`, nem no `SetInputForm`. O momento que falta é justamente **o único dos três que mede o tecido sob carga de trabalho em posição alongada**, que é o momento de maior valor diagnóstico. `npm run check:gate` passa (33/33, 59 cenários) porque ele trava tabela↔rollup — e o rollup só sabe de dois momentos, então não há divergência a acusar.

Terceiro problema, menor mas real: `PainEntry.intensity` está documentado como `1-10`, enquanto a escala do gate é `0-10` (`VENA_BLOCK1_PAIN_GATE.escala = [0,10]`). O `peak: 0` só existe por construção (`entries.length > 0 ? max : 0`), nunca por digitação. Sessão limpa e sessão em que ele não abriu a gaveta são indistinguíveis no valor gravado.

---

## 1. TREINAR OU PARAR? — a base tem posição forte, e ela vale, MAS com três condições escritas

**A posição, e é `prescricao` + `GERAL` em todas as linhas:**

- `V001-04` — *"complete rest is not the best idea when it comes to injuries"*
- `V027-20` — repousar completamente é **a pior** das escolhas (`opiniao`, GERAL)
- `V027-21` — parar destreina o tecido e diminui as adaptações protetoras (`mecanismo`)
- `V089-24` — *"tendonitis is one of those things where you don't want to completely rest as that actually makes it worse"*
- `V138-03` — mover promove melhor cicatrização
- `V079-32` — *"keep moving even through minor pain which leads to better rehab outcomes"*
- `V138-20` — *"research has shown that rehab with light pain does lead to quicker rehab times"*
- `V108-27` — o exercício doloroso é **um dos dois** exercícios a fazer, para reabilitar a tolerância a ele
- `V017-22` — *"you're not really rehabbing the injury if you aren't getting better at the actual movement itself"*

**Agora as condições, que estão no campo `conditions` e mudam a leitura:**

`V001-04` → condiciona a `V001-05` (*"find the threshold where you can keep it moving, experiencing some light discomfort is okay"*) → que condiciona a `V001-06` (o ~2/10). A cadeia inteira é `prescricao`/GERAL. **"Não parar" nunca aparece sozinho na base: aparece sempre como "não parar E ir mais leve até achar o limiar".**

`V086-21` (*"training through light pain can be okay… but your symptoms should be trending better over time"*) condiciona a **duas** claims que vão na direção oposta ao instinto do atleta:
- `V086-20` — *"most people do not go as late as they need to to rehab the injury"* (`opiniao`)
- `V086-22` — *"don't be the type of person whose ego is too big to go light enough to let it heal properly and just drags out the injury for months"* (`prescricao`)

**E o achado que amarra tudo:** os **três** limiares — `V001-06`, `V079-34`, `V138-19` — condicionam-se, cada um deles, à mesma claim: **`V027-23`** — *"i actually find more minor injuries end up being moved more than they should. and that's because it's easier to train through these minor injuries"*. Essa é a condição comum aos três, e descreve **exatamente** este caso: dor leve, num tecido com histórico, fácil de treinar através. `V027-23` é `modo: opiniao`, GERAL — ou seja, **não vira instrução**, mas é a moldura declarada de leitura dos três limiares que **são** prescrição.

**Veredito.** A base manda **não parar completamente** — isso é `prescricao` GERAL, robusto, múltiplas fontes independentes dentro do corpus. Mas ela **não** manda "seguir o programa como está". As condições escritas mandam: continuar movendo, **em carga muito menor**, no movimento específico, monitorando trajetória. As duas coisas juntas.

**Ressalva de escopo que preciso escrever:** `V089-24` é sobre **tendinite**, um diagnóstico. Ele tem *"levemente dolorido"* num tecido com histórico de lesão — não tem diagnóstico. Aplicar `V089-24` exige assumir tendinopatia, e **isso não é uma inferência que a base autorize e não é uma inferência que eu possa fazer**. Ver §6.

**O que NÃO transplanta:** `V027-24` e `V027-25` (`PESSOAL`/`anedota`) — os anos de tendinopatia do Vena e o "patinar sem progresso". É contexto e é o modo de falha a evitar, como o §1.2 já escreve. Não é instrução, e o §1.2 acerta ao rotulá-lo `[PESSOAL]`. `V027-18`/`V027-19` idem, e `V027-19` é explícito: *"but i generally advise against that"* — ele desaconselha copiar a própria abordagem agressiva.

---

## 2. O QUE SAI PRIMEIRO? — a base declara uma ordem, e o §1.2 NÃO a seguiu

**A ordem está escrita, e é `V138-04` (`prescricao`, GERAL), que é uma fórmula completa:**

> *"we're going to take whatever exercise is painful, split the volume between it and a second less painful exercise, find tolerable intensity, and then progressively overload our way back towards normal"*

Desdobrada nas claims do mesmo bloco R138, todas `prescricao` GERAL:

| ordem | o que muda | id |
|---|---|---|
| 1 | **peso absoluto E proximidade da falha**, simultaneamente, no exercício doloroso | `V138-18` |
| 2 | **volume**: divide-se ao meio entre o movimento primário (doloroso) e um secundário sem dor | `V138-15`, `V138-05`, `V138-09` |
| 3 | **seleção de exercício**: entra um secundário mais específico possível, treinado em **intensidade normal** | `V138-09`, `V138-16`, `V079-35`, `V108-30` |
| — | **frequência: NÃO MUDA** — *"we're keeping our same frequency as before"* | `V138-23` |

Reforço independente para os degraus 1 e 2: `V001-09` (*"You should probably be doing less volume, too"*), `V017-15` (*"sometimes you just need to really dial back"*), `V027-17`, `V072-22`, `V138-28` (*"the main controllable Factor when it comes to injury is simply just workload"*).

**Amplitude não aparece na ordem.** Zero claims `prescricao` sobre reduzir ROM como manejo de dor de peitoral. A gaveta `rom` (76) tem uma única interseção com `lesao`, e é sobre saltos de carga no terra (`V110-30`). A amplitude do floor press (*"~2 cm acima da profundidade da lesão"*) é do relatório de vídeo, e o próprio `PROGRAMA.md` já declara: *"o corpus tem ZERO sobre board, floor ou pin press como ferramenta de reabilitação de peitoral"*.

**Pausa não aparece como algo que sai. Aparece como algo que ENTRA** — ver §3.

**O §1.2 inventou a ordem dele, e a ordem dele é diferente.** A tabela do §1.2:
- **1 evento ≥2/10** → congela `TM_supino` **e** o degrau de exposição. **Sem recuo.**
- **2 eventos ≥2/10 em 3 sessões** → recua **um** degrau do eixo que mudou mais recentemente.

Congelar não é nenhum dos três degraus de `V138-04`. Congelar mantém peso, mantém séries, mantém proximidade da falha — mantém **toda** a carga de trabalho, e só interrompe o *aumento*. A base não tem nenhuma claim `prescricao` que autorize "primeiro só congela". A claim usada para justificar o desvio é `V001-08` — *"if you have one more painful session, that doesn't mean your rehab program isn't working"* — e ela é **`modo: opiniao`**. Pela regra da casa, opinião é contexto, nunca instrução. **O desvio consciente de `design.md` §4-B está apoiado em `opiniao`, e o §1.2 o declara como desvio mas não declara que a âncora é opinião.**

Segundo: quando o §1.2 finalmente recua, ele recua **um** eixo, "o que mudou mais recentemente". `V138-04`/`V138-18` mandam mexer em peso **e** proximidade da falha **e** volume — três coisas, ao mesmo tempo, no exercício doloroso. O §1.2 é UM-EIXO por construção do bloco, e UM-EIXO é uma regra de **atribuição causal** (`R63 @02:01`, GERAL: *"mude poucas coisas de uma vez"*), não uma regra de manejo de lesão. **O bloco aplicou a regra de saber-o-que-causou ao problema de parar-de-machucar.** São problemas diferentes e a base não junta os dois.

---

## 3. O CONTORNO — a pergunta está certa e a resposta é: o programa e a base modelam a pausa de formas OPOSTAS

`V089-25` (`prescricao`, GERAL, sem `conditions`):

> *"a useful workaround is doing slow velocity variations things like tempo work or pauses — tendon strain is based off weight and speed we move it at"*

`V089-26` (`opiniao`): nessas variações lentas normalmente dá para trabalhar em intensidades bem altas. `V130-11` (`mecanismo`, GERAL): excêntricas mais lentas reduzem estresse tendíneo. `V001-10` (`prescricao`, GERAL): *"modifying your exercises with things like adding pauses"*. `V017-19` (`prescricao`, GERAL): o Vena escolheu **pausas** como a variação que aliviava as costas dele.

**Então a base é inequívoca: pausa é o CONTORNO. Quatro claims, três delas `prescricao` GERAL.**

**E o programa faz o contrário disso.** No bloco `eixos` do `PROGRAMA.md`, `PAUSA-P` está declarada assim:

```
PAUSA-P     | exposicao_peito        | s      | recuo S12
```

`PAUSA-P` é do eixo **`exposicao_peito`** — a mesma família de `SUP-V1`, `SUP-V4`, `PEC-SETS`, `FP-SETS`, `FP4-SETS`. O §1.2 a lista entre os degraus que o gate **congela**, e o gauge de supino declara a leitura **inválida para subir** se `PAUSA-P` subiu na semana. **O programa modela pausa mais longa como MAIS exposição ao tecido lesionado. A base modela pausa como MENOS tensão no tendão. É uma contradição direta, e o lado da base é `prescricao` GERAL enquanto o lado do programa é interpretação não citada.**

**Sendo justo com o desenho, três coisas atenuam:**

1. O eixo de pausa quase não se move. Lendo a grade: `PAUSA-P` fica em **1,0 s do S1 ao S9**, sobe a **2,0 s só nas S10–S11**, e **recua a 1,0 s na S12**. E o bloco de 2 s vive **só** em D3#4, **4 séries, a 65% do TM**. O que realmente rampa no bloco é a **contagem de séries** (`SUP-V1` 2→4, `SUP-V4` 1→3, `PEC-SETS` 1→3) — ou seja, **volume**, que é o degrau 2 de `V138-04` e o que `V001-09` manda cortar.
2. `V119-20` (`mecanismo`, GERAL) diz que a metade inferior da amplitude é biomecanicamente a parte mais difícil do supino, e `V096-17`/`V128-15`/`V142-25` (três fontes, GERAL) que o peitoral já está maximamente ativado a ~70% do 1RM. As 4 séries de 2 s estão a 65% — logo abaixo do platô de ativação. Isso é defensável.
3. O próprio §1.2 escreve: *"Se o gate disparar entre S8 e S11, o bloco de 2 s é a PRIMEIRA coisa que sai."* Ou seja, o desenho já sabe que essa é a peça de maior risco.

**Mas a lacuna real não é a duração da pausa — é a POSIÇÃO.** `V089-25` fala de *velocidade*: mais lento = menos strain. Uma pausa no peito não é apenas movimento lento; é **carga mantida em alongamento máximo do peitoral**, que é a posição da lesão. **A base não distingue as duas coisas em lugar nenhum.** Varri `rom` (76) e `peito` (31): zero claims sobre carga em posição alongada e risco de peitoral. O `PROGRAMA.md` já registra a mesma lacuna por outra porta quando rejeita o Spoto press por *"contradição interna não resolvida"* e quando declara *"ZERO sobre board, floor ou pin press como ferramenta de reabilitação de peitoral"*.

**Conclusão de §3:** o programa **não** está aumentando cegamente a variável que a base manda usar como contorno — porque a pausa mal se move e o que se move é volume. Mas ele **classificou** a pausa como exposição, e essa classificação contradiz `V089-25` sem citar nada em contrário. Se a decisão desta semana fosse "o que faço com o supino", `V089-25` diz para **manter a pausa e derrubar peso e séries**, não para tirar a pausa.

**E o item que a base coloca em primeiro lugar no corte, e que o §1.2 tratava como intocável, é o floor press.** São **9 séries semanais** sobre o tecido lesionado, `FP-SETS = 7 − SUP-V1` — construído para que cortar séries pausadas **aumente** floor press. Ele **não** é o contorno de `V089-25` (não é velocidade lenta — a nota diz *"SEM pausa mantida"*); é o menos específico dos três, e `V112 @02:10` (GERAL, citado no próprio programa) diz que quanto **menos** específico, **mais** perto da falha se empurra. Pela ordem de `V138-04`/`V138-09`, o floor press ocupa o lugar de *movimento secundário*, e o secundário tem de ser **sem dor ou quase** (`V138-09`, `V177-12`) — o que só é verdade enquanto for verdade, e ninguém mediu.

---

## 4. QUAL É O SINAL DE QUE ESTÁ INDO MAL? — a base pede uma trajetória e o app só sabe dizer um número

**O critério é unânime na base e é `prescricao` GERAL em quase toda linha:**

- `V086-21` — *"your symptoms should be trending better over time"*
- `V027-26` — *"move as much as you can while still seeing your pain symptoms trending down over time"*
- `V027-28` — *"if you're having those spikes a lot or you're really just plateauing in pain or even getting worse, you've got to reduce the load more"* (repare: **platô** conta como falha, não só piora)
- `V027-27` (`fato`) — um dia isolado de pico é normal
- `V001-07` — *"making progress session to session, slowly adding more load without increases in pain"*
- `V138-18` — o limiar é *"we feel some pain but we don't feel worse **the next session**"*
- `V138-22` — deve dar para adicionar peso a cada sessão sem cruzar o limiar

**Dá para medir isso com o que o app coleta hoje? Não. E o defeito tem duas metades.**

**Metade 1 — a unidade de medida da base é entre-sessões, e a do app é dentro-da-sessão.** `V138-18` define o limiar por *"não pior na sessão seguinte"* e `V001-07` por *"sessão a sessão"*. Isso é a comparação de um estado **entre** treinos. O app não tem estado entre treinos: `PainEntry` só existe pendurado num `workoutId`. **A grandeza que define o limiar da base é exatamente a grandeza que o app não pode gravar.**

**Metade 2 — o gate é um detector de eventos, não um estimador de tendência.** `evaluatePainGate` responde uma pergunta booleana por semana: "algum degrau da tabela está satisfeito?". `WeekGate.weeks` guarda `{weekNumber, benchSessions, loggedSessions, peak}` — há série temporal de `peak`, e ela **poderia** sustentar uma tendência. Mas nada no código a lê como tendência: `evaluateGateReturn` a consome só para contar semanas limpas com `peak <= 1`, o que é de novo um teste de limiar. **Não existe, em `painGate.ts` nem em `weeklyRollup.ts`, nenhuma função que compare o pico desta semana com o da anterior.** Um platô em 2/10 por seis semanas — o cenário de `V027-28`, e literalmente o modo de falha `[PESSOAL]` do `R27 @05:08` que o programa diz querer evitar — dispara `congela` toda semana, sem nunca escalar e sem nunca ser nomeado como platô.

Traduzindo para o sintoma de hoje: **dá para saber se dói. Não dá para saber se está melhorando.** E "está melhorando?" é a única pergunta que a base usa para decidir entre treinar e não treinar.

**Terceiro problema, específico deste caso:** `post.newPain` vem de `hasNewPain`. Dor **preexistente e inalterada** — que é o quadro dele — não é dor *nova*. Nada garante que ela seja registrada no pós-sessão. E o gate lê `post.newPain`, não uma dor pós-sessão absoluta.

**Quarto:** ele disse *"levemente dolorido"*, *"bem leve, não é nada sério"*. Não existe número. Nem a base nem o programa oferecem mapeamento de palavra para 0–10. O gate inteiro é numérico. **Não há, hoje, como converter a descrição dele em entrada do §1.2 — e o valor que ele escolher decide sozinho entre "abaixo do limiar" e `congela`.**

---

## 5. OS TRÊS LIMIARES — a escolha do 2/10 é defensável, mas a JUSTIFICATIVA ESCRITA está factualmente errada

**Os três, com `modo` e `scope` verificados no jsonl:**

| id | endereço | valor | scope | **modo** |
|---|---|---|---|---|
| `V001-06` | `R001@01:00` | ~2/10 | GERAL | **prescricao** |
| `V079-34` | `R079@03:47` | 2–3/10 | **GERAL** | **prescricao** |
| `V138-19` | `R138@02:32` | 2–4/10 | GERAL | **opiniao** |

O conflito declarado na base é apenas **`V001-06` ↔ `V138-19`** (bidirecional). `V079-34` **não** conflita com nenhum dos dois — o conflito dele é com `V027-25`, que é a anedota `PESSOAL` do Vena.

**O que o §1.2 escreve, verbatim:**

> *"O limiar de 2/10 é `[R1 @01:04]` `[GERAL]`; `[R79 @03:35]` dá 2–3/10 e é **[PESSOAL]**."*

**Isso está errado em dois pontos, e um deles é o que sustenta a escolha.**

1. **`R79 @03:35` não existe.** Listei todas as claims de R079 na janela: 03:17 (V079-27/28/29), 03:32 (V079-30/31), 03:47 (V079-32/33/34/39), 04:02 (V079-35/36/37). Não há nada em 03:35. O endereço mais próximo do conteúdo "2–3/10" é `R079@03:47` = **`V079-34`**.
2. **`V079-34` é `scope: GERAL`, não `PESSOAL`.** E é `modo: prescricao`. Sim, o verbatim começa com *"Anecdotally, I have found…"* — mas isso é o registro de origem da heurística, não o escopo do sujeito: a frase segue *"is a good amount to push at"*, sem sujeito pessoal, e o extrator classificou GERAL/prescricao. **O `[PESSOAL]` no §1.2 é rótulo aplicado à mão, contra o que está gravado na base.**

**A consequência é exatamente a pergunta que você fez.** O §1.2 descarta o 2–3/10 chamando-o de PESSOAL. Se o rótulo fosse verdadeiro, o descarte seria automático pela regra da casa. **Como é falso, o descarte não tem base: `V079-34` é `prescricao` GERAL, mesmo tier, mesma classe de autoridade que `V001-06`.** A comparação real é entre duas prescrições GERAL que discordam, e escolher a mais apertada **é uma preferência** — legítima, mas preferência.

**Também há erro de endereço no outro lado.** `[R1 @01:04]` não existe: `V001-06` (o 2/10) está em `R001@01:00` e `V001-08` (o "uma sessão pior não significa que não funciona") está em `R001@01:30`. **O §1.2 usa o mesmo endereço `[R1 @01:04]` para as duas claims**, que estão a 30 s de distância e têm `modo` diferente (`prescricao` vs `opiniao`). Mesmo padrão em `[R27 @05:08]` (o real é `V027-25` @05:21) e `[R95 @03:10]` (o real é `V095-23`/`V095-24` @03:16). Nenhum desses é fabricação — o conteúdo existe e a claim existe —, mas nenhum resolve por endereço, e é por isso que o erro de escopo do R79 passou por seis ondas sem ser pego.

**Agora, a escolha se sustenta por outro caminho?** Sim, parcialmente, e vale registrar o que de fato a sustenta:

- `V138-19`, a mais frouxa (2–4), é **`opiniao`**. Pela regra da casa, ela **não pode virar treino**, então nunca esteve na disputa. Descartá-la está certo — mas pelo motivo do `modo`, não pelo motivo que o §1.2 escreveu.
- Sobra `V001-06` (≈2) contra `V079-34` (2–3). Os dois são prescrição GERAL. Ambos condicionam-se a `V027-23` (*"minor injuries end up being moved more than they should"*), e `V079-34` condiciona-se **adicionalmente** a `V079-39` (*"Be cautious still"*) e a `V086-21` (sintomas têm de melhorar).
- `V086-20` e `V086-22` (a maioria não vai leve o bastante; o ego arrasta a lesão por meses) empurram, ambos, para o lado conservador.

**Veredito honesto: a conclusão (2/10) está certa; a derivação escrita está errada.** O 2/10 se sustenta por (a) `V138-19` ser `opiniao` e (b) as condições de cautela empilhadas em `V027-23`/`V079-39`/`V086-20`/`V086-22`. **Não** se sustenta por "`R79` é PESSOAL", que é o único motivo que o documento dá. **A frase do §1.2 é preferência disfarçada de derivação — e a derivação certa existe, e é outra.**

**Nota separada, e é a mais séria desta seção:** o limiar de **2/10 no §1.2 é limiar de FREIO**, e o **2/10 de `V001-06` é limiar de ALVO** — *"about a 2 out of 10 level of pain is usually good for most people"*, *"is usually **good**"*, a carga aproximadamente **certa**. `V079-34`: *"a good amount to **push at**"*. **A base usa 2/10 como o ponto onde você quer estar; o programa usa 2/10 como o ponto onde você congela.** É o mesmo número com o sinal invertido. Isso é conservador, e conservador é a direção certa para um tecido com histórico — mas significa que o §1.2 **não** deriva do `V001-06`: ele empresta o número e troca o significado. Isso não está escrito em lugar nenhum e deveria estar.

---

## 6. O LIMITE QUE NÃO SE ATRAVESSA

Isto não é avaliação clínica e eu não sou fisioterapeuta.

Três decisões que apareceram acima **exigem** um profissional e não podem sair da base:

1. **Se isto é tendinopatia.** `V089-24` e `V089-25` — as duas claims que mais empurram para "não pare, use pausas" — são **sobre tendinite**, um diagnóstico. Ele tem dor leve no local de uma lesão de peitoral prévia, sem diagnóstico. Aplicar `V089-24` é assumir o diagnóstico, e essa assunção é o passo que decide entre "continue movendo" e "isso é reagravamento".
2. **Se esta dor é reagravamento da lesão antiga ou dor nova.** `V001-13` (*"people just try to come back way too quickly and just re-aggravate their injury"*) e `V027-16` (respostas protetoras de guarding persistem após a cura do tecido) descrevem dois quadros com a mesma apresentação — *"levemente dolorido"* — e manejos diferentes. A base não oferece nada que os separe. Um exame separa.
3. **Como converter *"bem leve, não é nada sério"* num número 0–10.** O gate inteiro depende desse número e não existe instrumento no app nem na base para produzi-lo.

Um contrapeso, porque não dramatizar também é obrigação: `V001-20`, `V001-21`, `V001-22` (96% dos ombros assintomáticos têm anormalidade de imagem), `V027-15`, `V079-27`, `V079-30`, `V079-31`, `V138-06`, `V140-27`, `V150-16` — a base é maciça e consistente em que **dor não equivale a dano**, em que medo de movimento **aumenta** dor e risco de relesão, e em que catastrofizar piora o desfecho. Nada aqui autoriza tratar "levemente dolorido" como emergência.

---

## RESUMO EXECUTÁVEL

| # | achado | evidência | classe |
|---|---|---|---|
| 1 | Dor **em repouso, fora de sessão, não tem onde ser registrada**. Sem sessão, o gate é `null`. | `weeklyRollup.ts:409`, `types/index.ts:475-527`, `Workout.tsx:167` | **defeito confirmado** |
| 2 | O §1.2 declara **3 momentos**; o app coleta **2**. Falta a leitura sob carga na 1ª pausada. `check:gate` não pega, porque trava tabela↔rollup e o rollup só conhece dois. | `weeklyRollup.ts:409`, `useWorkoutSurveys.ts` | **defeito novo** |
| 3 | O §1.2 rotula `R79 @03:35` como `[PESSOAL]`. O endereço **não existe**, e a claim real (`V079-34`) é **`GERAL` + `prescricao`**. É o único argumento escrito para escolher 2/10 sobre 2–3/10, e ele é falso. | `V079-34` vs `PROGRAMA.md` §1.2 | **defeito novo, grave** |
| 4 | O desvio "congela, sem recuo" apoia-se em `V001-08`, que é **`opiniao`**. Pela regra da casa, não vira instrução. | `V001-08` | **defeito novo** |
| 5 | A base declara ordem de corte: peso+proximidade-da-falha → volume (dividido com secundário) → seleção; **frequência não muda**. Congelar não é nenhum dos três. | `V138-04`, `V138-18`, `V138-15`, `V138-23`, `V001-09` | divergência declarável |
| 6 | O programa classifica `PAUSA-P` como `exposicao_peito`; a base classifica pausa como **contorno que reduz strain**. Contradição direta, e o lado da base é `prescricao` GERAL. | `V089-25`, `V001-10`, `V017-19`, `V130-11` vs bloco `eixos` | divergência declarável |
| 7 | Não existe nenhuma função no app que leia **tendência** de dor. `V086-21`/`V027-26`/`V027-28` exigem trajetória; o gate só faz teste de limiar. Um platô em 2/10 nunca é nomeado como platô. | `painGate.ts` (íntegro), `V027-28` | **defeito confirmado** |
| 8 | `post.newPain` só captura dor **nova**. Dor preexistente e inalterada — o quadro dele — pode não entrar. | `weeklyRollup.ts:410` | **defeito novo** |
| 9 | 2/10 na base é **alvo** (*"is usually good"*, *"a good amount to push at"*); no §1.2 é **freio**. Mesmo número, sinal invertido, não declarado. | `V001-06`, `V079-34` vs §1.2 | não-declarado |
| 10 | Zero claims no corpus sobre **carga em posição alongada** e risco de peitoral. Gavetas `rom` (76) e `peito` (31) varridas. | lacuna | lacuna declarada |

**Nada foi alterado no repositório.** `npm run check:gate` roda limpo hoje (33 testes, 59 cenários) — o que ele trava continua travado; o que falta é o que ele nunca soube que existia.
