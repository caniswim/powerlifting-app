# GATE — onda de auditoria do peitoral, 12/08/2026

> Extraído do journal `wf_5ebac2a2-b42` depois de o agente `exposicao` morrer
> por `API Error: The response stopped arriving`. Salvo porque só existia na memória do workflow.

> ⚠️ **CORREÇÃO POSTERIOR — leia antes do resto.** Trabalho PARCIAL de um agente que morreu no
> meio da auditoria, preservado como REGISTRO e não como conclusão. Nada aqui foi derrubado
> pela auditoria adversarial posterior: este arquivo é sobre INSTRUMENTO (o que o app coleta),
> e não faz nenhuma acusação de endereço fabricado. A acusação que caiu — a de que endereços
> como `R79 @03:35` e `[R1 @01:04]` "não existem" — está em `BASE.md` e em `ATAQUE.md`, e o
> bloco de correção deles explica por quê.

# O QUE O GATE NÃO ENXERGA — parecer com o código na mão

**Sonda escrita e executável:** `/Users/brunnovert/Documents/Dev/powerlifting-app/research/tools/auditoria-peito/sonda-repouso.mjs`
Ela monta cenas e entrega ao `buildWeekDoc` **de produção** (não reimplementa regra nenhuma); todos os números do §1.2 saem da tabela via `parseGateDor`. Rode com `node research/tools/auditoria-peito/sonda-repouso.mjs`.

**Nada de produção foi tocado.** `npm run check:gate` (33 testes + 59 cenários), `npm run check:kb` e `npm run build` verdes.

---

## 1. Dor em repouso, fora de sessão: o buraco é REAL — confirmado

**Confirmado. O sintoma que ele tem hoje é literalmente invisível para o app inteiro.**

Medido, não suposto:

- `PreWorkoutSurvey` e `PostWorkoutSurvey` (`/Users/brunnovert/Documents/Dev/powerlifting-app/src/types/index.ts:491,513`) têm ambas `workoutId: string` como primeiro campo. Não existe pesquisa sem treino.
- `PainSelector` é montado em **exatamente duas** telas, e as duas são folhas de pesquisa de treino: `PreWorkoutSurveySheet.tsx` e `PostWorkoutSurveySheet.tsx`.
- `savePreSurvey`/`savePostSurvey` indexam por `workoutId` (`/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/storage/surveyRepository.ts`) — um registro sem treino não tem chave onde morar.
- `useWorkoutSurveys` só entra na fase `pre` quando existe um `WorkoutLog` não concluído. Dia sem treino não tem fase nenhuma.
- No rollup, as **únicas** fontes de dor são `sess.pre?.pain` e `sess.post?.newPain` (`buildPain` e `buildGateReadings` em `/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/sync/weeklyRollup.ts`).

E a prova pelo negativo, medida: a semana em que ele **não treinou** produz
`flags: ["0/5 sessões concluídas","aderência de séries em 0%","sono caiu 7 vs semana anterior"]` e `pain: []`.
A semana desta onda — a semana em que ele está com dor — sai do app dizendo **que não houve dor**. Pior: o `WeekDoc` nem chega a ser reescrito (§4 abaixo).

**O único contorno que existe hoje, e o que ele custa — medido:** abrir um treino só para preencher o pré e marcar Peitoral 2/10. A dor **chega** ao gate (`buildGateReadings` não descarta evento colhido por falta de volume de peitoral, e o degrau `congela` dispara corretamente). O preço:
- cria uma leitura `{peak:2}` que **consome uma das 3 vagas da janela** de sessões — uma vaga gasta com um dia que não foi exposição;
- polui a aderência: `"1/5 sessões concluídas"`, `"aderência de séries em 1%"`.

Ou seja: hoje ele escolhe entre **não registrar** (e o dado some) ou **mentir na estrutura** (e a janela e a aderência pagam). Não há terceira opção.

### E isto é o achado grave, porque é onde a BASE e o INSTRUMENTO divergem

A base não prescreve "dor durante a série". Ela prescreve **trajetória entre sessões** — e é exatamente essa a variável que o app não mede:

- `V138-18` `[GERAL]` `[prescricao]` — *"we want to reduce the loading... to the point where we feel some pain but we don't feel worse **the next session**"* `[R138 @02:17]`
- `V027-26` `[GERAL]` `[prescricao]` — *"you want to move as much as you can while still seeing your pain symptoms trending down **over time**"* `[R027 @05:38]`
- `V086-21` `[GERAL]` `[prescricao]` — *"training through light pain can be okay or even better... but your symptoms should be **trending better over time**"* `[R086 @02:47]`
- `V027-28` `[GERAL]` `[prescricao]` — *"if you're having those spikes a lot or you're really just plateauing in pain or even getting worse, you've got to reduce the load more"* `[R027 @05:53]`

O §1.2 **cita R27@05:38** para justificar seu limiar, e depois instrumenta só o pico intra-sessão. A regra de decisão que a base escreve é *"pior na sessão seguinte?"* / *"a dor está caindo ao longo do tempo?"* — e a série temporal que responde isso precisa dos dias **sem treino**. O app não tem um único ponto desses.

O modo de falha que o próprio §1.2 declara `[PESSOAL]` `[R27 @05:08]` (`V027-25`: *"spinning my wheels and not making progress, and the pain doesn't get any better"*) tem o formato "dói pouco, dá pra treinar" repetido por meses — e **é indetectável sem justamente a série que falta**. O instrumento é cego precisamente para o modo de falha que ele existe para evitar.

---

## 2. `estiramento agudo`: continua sem comportamento — a declaração do §1.2 segue verdadeira

**Confirmado, sem mudança.** O flag é lido, travado e emitido — e **nenhuma linha de produção o consome**. As únicas ocorrências em `src/` são no arquivo gerado:

```
src/data/program/vena-block1/generated.ts:631   estiramentoAgudo: boolean;
src/data/program/vena-block1/generated.ts:650   "estiramentoAgudo": true
```
(mais a declaração do tipo em `scripts/build-vena-block1.mjs:1170` e o parser em `scripts/gate-dor.mjs:100`)

Zero leitores em `src/domain/`, `src/services/`, `src/features/`. Nenhum campo em `src/types/index.ts` casa com `estiramento|strain|ruptur`. A célula `≥4/10 **ou estiramento agudo**` só governa a conversa; o app só a alcança se o atleta **também** marcar ≥4/10. Um estiramento agudo que ele registre como 3/10 dispara `congela`, não `encerra a sessão`.

---

## 3. Janela de 3 sessões e RETORNO num hiato sem supino

### O `RETORNO` **não** é satisfeito vacuamente — derrubei a hipótese, com teste

Todas as três formas de "duas semanas sem supinar" **reprovam** corretamente:

| cena | RETORNO sai? |
|---|---|
| 2 semanas limpas com supino (controle) | **SIM** — controle vivo |
| 2 semanas **sem nenhuma sessão** | **NÃO** — `weeks` gravadas: `[[2,0,null],[3,0,null]]` |
| 2 semanas treinadas **sem peitoral** | **NÃO** |
| 1 sessão limpa depois de 2 semanas paradas | **NÃO** — `weeks`: `[[3,0],[4,1]]` |

O guarda é `semanaLimpa()` em `/Users/brunnovert/Documents/Dev/powerlifting-app/src/domain/painGate.ts`, que exige `benchSessions > 0` **e** `loggedSessions >= benchSessions` **e** `peak <= picoMaximo`, mais a checagem de `weekNumber` consecutivo em `evaluateGateReturn`. Ausência de dado não vira evidência de tolerância. **Este ponto está bem construído e já tem cenário travado em `check-pain-gate.mjs`.**

### Mas há uma vacuidade DE FATO, e ela é de segundo grau

**`collectedLog(sess)` é um OU, não um E.** Em `/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/sync/weeklyRollup.ts`:

```js
function collectedLog(sess) {
  return sess.pre != null || sess.post != null;
}
```

Medido: uma semana em que **toda** sessão de supino colheu **só o pré** — ou **só o pós** — conta como `loggedSessions == benchSessions`, é declarada **limpa**, e **libera o RETORNO**. As duas cenas saem `SIM` na sonda.

O §1.2 manda colher **três** momentos. O app tem dois campos e aceita **um**. O RETORNO é a única linha da tabela que **aumenta carga sobre o tecido lesionado**, e ele pode ser liberado por uma semana medida com um terço do instrumento. Isso é exatamente "re-subir por ausência de dado" — só que a ausência está dentro da sessão, não entre semanas.

O terceiro momento (*1ª série pausada com carga de trabalho*, o mais informativo dos três porque é o tecido **sob carga**) não tem campo nenhum: nada em `src/types/index.ts` casa com `pausada|midSession|intraSession`. Já registrado como §5.4 de `GATE-DOR.md`, e continua exatamente assim.

### A janela: atravessa o hiato, e não tem relógio

Medido: com evento na S1, S2 e S3 **vazias**, e novo evento na S4, a cauda sobrevive e o degrau dispara:

```
GATE DE PEITORAL §1.2 — 2 eventos ≥2/10 em 3 sessões de supino
(pico 2/10, 2× em 2026-03-01, 2026-03-22 — a janela atravessa a virada de semana):
recua um degrau...
```

Cauda gravada após o hiato: `[{"date":"2026-03-01","weekNumber":1,"peak":2}]`.

Isso é **fiel à tabela** (*"em 3 sessões de supino"*, não "em 3 semanas") e conservador na direção certa — o gate aperta, não afrouxa. Mas registre o limite: **não há uma única aritmética de tempo decorrido em `painGate.ts`** (sem `new Date`, `Date.now`, `getTime`). Um evento de três meses atrás pesa igual a um de ontem. Para o degrau de agravamento isso é seguro; é o `RETORNO` (§4 abaixo) que sangra por aí.

---

## 4. O caminho da conversa: o agente fica sem o contexto que decide

**Não existe tela de conversa semanal dentro do app** (zero arquivos `.tsx` mencionando o conceito). A conversa é `npm run briefing` → markdown → colar. Então "o que a conversa recebe" é literalmente a saída de `/Users/brunnovert/Documents/Dev/powerlifting-app/scripts/weekly-briefing.mjs`. Medido:

| | recebe? |
|---|---|
| as bandeiras (`⚑ w.flags`) — inclusive a linha do gate | **SIM** (linha 252) |
| a linha `Dor: <região> N× (pico X/10)` | **SIM** (linha 297) |
| o bloco `w.gate` — leituras, cauda, semanas | **NÃO** |
| a tabela do §1.2 / o limiar / as claims de dor | **NÃO** |
| há quantos dias o rollup não é atualizado | **NÃO** |

Consequências concretas, em ordem de gravidade:

**(a) A bandeira chega, o raciocínio não.** O agente recebe a string `"GATE DE PEITORAL §1.2 — ... congela TM_supino"`, e não recebe: quantas sessões de supino há na janela, quais foram limpas, quanto falta para o `RETORNO`, nem uma única claim. Ele não tem como responder *"por que 2/10 e não 4?"*, nem citar `V001-06` `[R1 @01:04]` `[GERAL]` (o limiar), nem `V027-25` `[R27 @05:08]` **[PESSOAL]** (o modo de falha), nem `V138-18` (o critério "pior na sessão seguinte"). O material existe em `research/kb/` e nas 6.912 claims; o briefing não o puxa. Quem tiver a conversa precisa abrir a gaveta à mão — e se não abrir, o agente improvisa em cima de uma frase de bandeira.

**(b) O `WeekDoc` não é reescrito numa semana sem treino, e a bandeira de `RETORNO` fica congelada dentro dele.** Confirmado em `/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/FirestoreStorageService.ts`: `weekKey` só é marcado sujo por `saveWorkout`, `savePreSurvey` e `savePostSurvey` — todos exigem treino. Medido: um `WeekDoc` de semana limpa carrega, gravada em `flags`:

```
RETORNO DO GATE §1.2 — 2 semanas consecutivas com pico ≤1/10 em todas as sessões
de supino: re-sobe um degrau só após 2 semanas consecutivas com pico ≤1/10...
```

**Este é o cenário desta onda, exatamente.** Se a última semana treinada saiu limpa, esse texto é a última coisa gravada, e é o que o briefing imprime agora — enquanto ele tem dor no peitoral em repouso e não treinou. O briefing não diz que o documento tem uma semana de idade, porque não imprime `updatedAt`. **O app hoje pode recomendar re-subir degrau enquanto o atleta está com dor no tecido lesionado, e essa recomendação está lastreada em dado velho que o hiato não invalidou.** Isto não é hipótese: é o comportamento medido do código.

---

## Propostas — diff descrito, NÃO aplicado

Não apliquei nenhuma. As três primeiras são instrumentação pura (não movem número de treino); a quarta e a quinta mudam semântica e são decisão do atleta.

**P1 — Registro de dor fora de sessão (fecha §1).** Novo tipo `RestPainLog { date: string; painEntries: PainEntry[]; context: 'repouso' | 'manha' | 'apos_esforco_cotidiano'; notes?: string }` em `src/types/index.ts`, indexado por `date` (não por `workoutId`); `restPainRepository.ts` espelhando `surveyRepository.ts`; entrada no Dashboard reaproveitando o `PainSelector` que já existe. **Decisão explícita e deliberada: essa leitura NÃO entra em `buildGateReadings`** — ela não é sessão de supino, não pode consumir a janela de 3 sessões nem mudar degrau. Ela vira um bloco novo `WeekDoc.restPain` e uma bandeira própria (`DOR EM REPOUSO §1.2 — fora do escopo da tabela; N registros, pico X/10`), que anuncia sem atuar. Isso mantém a tabela do §1.2 governando o que ela governa e para de perder o dado.

**P2 — `estiramento agudo` ganha campo (fecha §2).** `PainEntry` passa a `{ region, intensity, acute?: boolean }` (opcional, retrocompatível); toggle "fisgada/estiramento agudo agora" ao lado do slider no `PainSelector`; `sessionRollup` propaga; `evaluatePainGate` passa a satisfazer o degrau `encerra_sessao` por `degrau.estiramentoAgudo && reading.acute`, além do limiar numérico. Nenhum número muda — a célula da tabela já manda isso e hoje é letra morta.

**P3 — Briefing carrega o contexto do gate (fecha §4a e §4b).** Em `weekly-briefing.mjs`: (i) imprimir `w.gate` — leituras da janela com data e pico, cauda que atravessou a semana, semanas do `RETORNO` com `benchSessions`/`loggedSessions`; (ii) imprimir a tabela do §1.2 lida de `VENA_BLOCK1_PAIN_GATE` (o script já importa `.ts` direto, o precedente de `painRegions.ts` está pronto); (iii) **imprimir `updatedAt` e a idade do documento em dias, com aviso explícito quando > 7**, para que nenhuma bandeira de `RETORNO` velha seja lida como recomendação de hoje; (iv) uma seção "evidência do limiar" com as claims `modo: prescricao` de `dor`+`lesao` (`V001-06`, `V027-26`, `V027-28`, `V086-21`, `V138-18`, `V079-32`) e o alerta `[PESSOAL]` de `V027-25`. Zero risco de treino: é só transporte de contexto.

**P4 — `collectedLog` de OU para E (muda semântica — NÃO aplicar sem o atleta).** Trocar `sess.pre != null || sess.post != null` por `&&` fecha a vacuidade do §3, mas **aperta o `RETORNO`** (semanas hoje limpas deixam de ser) e portanto é decisão dele. Alternativa mais honesta e mais barata: manter o OU para os degraus de agravamento (errar para o lado de olhar demais) e exigir o E **só** em `semanaLimpa`, que é a única linha que afrouxa. Isso é a leitura literal do §1.2 e é o que eu recomendaria — mas exige o consentimento dele, e `check:gate` precisará de cenário novo.

**P5 — Terceiro momento (1ª pausada com carga de trabalho).** Campo `midSessionPain` novo, colhido durante o treino. É o momento mais informativo dos três e o único que mede o tecido sob carga. Muda o que "sessão colhida" significa e portanto interage com P4; é um passe próprio.

**Trava que falta e que eu recomendo escrever junto de qualquer uma dessas:** `check:gate` hoje tem 59 cenários e não tem **nenhum** que prove que `collectedLog` exige os dois momentos — apagar o `||` e pôr `true` mantém a suíte inteira verde. Todo item acima precisa nascer com o cenário que o mata.

---

## O limite que não atravesso

Nada aqui é avaliação clínica e eu não sou fisioterapeuta. O que este parecer estabelece é estritamente sobre **instrumento**: o app não tem onde registrar o que ele está sentindo, o `RETORNO` pode ser liberado com menos medição do que o §1.2 exige, e a conversa pode receber uma recomendação de re-subir degrau lastreada em documento velho. **Nada disso responde se ele deve ou não treinar.**

Dor **em repouso**, no lado onde houve lesão de peitoral, com histórico de lesão, é um sintoma que a base trata como qualitativamente diferente de dor sob carga — e o §1.2 **não tem célula para ele**: a tabela inteira é sobre pico dentro de sessão. Nem a tabela nem as claims `modo: prescricao` que reuni acima dão um limiar para dor em repouso. **A base e o programa não têm resposta para o que ele descreveu.** Uma primeira reexposição depois de uma semana parada, num tecido com histórico de ruptura e sintoma presente em repouso, é o tipo de decisão que pede avaliação presencial por um profissional — e essa é a recomendação honesta, não um rodapé.
