# ONDA 2B — a fila executável depois do ataque da onda 2A

**Data: 09/08/2026.** Este arquivo é **lista de trabalho**, não relatório. Cada item traz
**quantos**, **onde**, **como se verifica que ficou certo** e **se dá para paralelizar**.
Quem executar não precisa ler mais nada além do item e dos arquivos que ele nomeia.

> **Estado no início desta fila** (recontado por script sobre `research/extract/*.jsonl`
> em 09/08/2026): **6.912 claims** — 6.769 `tier R`, 143 `tier O`, **`tier E = L = I = U = 0`**.
> `conditions`: 507 claims / 695 arestas. `conflicts`: 37 claims / 48 arestas.
> `suspect: true` em 74 claims, **53 sem `suspectWhy`**. Campo `banal`: **não existe em
> nenhuma claim**. `npm run check:kb`, `npm run build` e `npm run check:gate` verdes.

---

## 0. A ordem, e por que ela é esta

Três regras produziram a ordem abaixo, nesta precedência:

1. **Instrumento antes de trabalho.** Os blocos 1–3 consertam as travas que mediriam
   todos os outros. Uma trava morta não é neutra: ela **certifica** o trabalho errado.
   Três mutações provaram, nesta árvore, que peças centrais da onda 2A passam verdes
   depois de desligadas (§1).
2. **Reparo antes de síntese.** Os blocos 4–9 são reparo. O bloco 11 (ledger, sínteses,
   INDEX) é síntese e vem por último: **erro de dado vira norma para o próximo agente**,
   e síntese escrita sobre dado torto é o defeito mais caro de desfazer que este
   repositório sabe produzir.
3. **Perecível antes de permanente.** O bloco 6 (`tier U`) sobe dentro da faixa de
   reparo porque destrava o §8.24 do `RUNBOOK.md` e porque o Bloco 1 começou.

**Não há item de aquisição nesta fila, e isso é decisão, não esquecimento.** Ver §12.

---

## 1. As três travas mortas da camada de recuperação — **primeiro, e bloqueante**

**Por quê:** a onda 2A entregou `busca.mjs` + os canários `presente-escondido` e declarou
a camada travada. Três mutações, rodadas nesta árvore em 09/08/2026 e revertidas, mostram
que ela não está. Enquanto isto não fechar, **nenhum número de recuperação desta base pode
ser citado** — é a regra do topo do `ESTADO.md` aplicada à camada nova.

### 1.1 `TETO_VIZINHANCA` é os dois lados da comparação (modo de falha nº 4)

- **Quantos:** 1 constante, 4 canários afetados (C16–C19).
- **Onde:** `research/tools/busca.mjs:103` (`export const TETO_VIZINHANCA = 40`) e
  `research/tools/check-canarios.mjs:85,379,398` — o mesmo símbolo é importado, **passado
  como `teto` para `recuperar()`** e **escrito na mensagem de falha**
  (`dentro das ${TETO_VIZINHANCA} primeiras`). O comentário de `busca.mjs:500-501` diz
  *"achado no lugar 400 não é achado"*, e é exatamente isso que a mutação faz passar.
- **Repro (rodado, e revertido):**
  ```
  sed -i '' 's/^export const TETO_VIZINHANCA = 40;/export const TETO_VIZINHANCA = 400;/' research/tools/busca.mjs
  npm run check:kb   # → exit 0, nenhum canário pisca
  ```
- **O conserto:** o teto tem de ser **dado do `CANARIOS.json`**, não constante da
  ferramenta que ele mede. Campo novo por canário (`tetoDeTela`, valor 40), lido pelo
  `check-canarios.mjs` e passado a `recuperar()`. `busca.mjs` mantém o próprio default
  para uso interativo; o canário deixa de perguntar à ferramenta qual é o limite dela.
- **Como se verifica que ficou certo:** com o campo no JSON, a mutação `40 → 400` em
  `busca.mjs` passa a **derrubar** C16–C19; e mexer no `tetoDeTela` do JSON para 400
  também derruba, porque `check-canarios.test.mjs` ganha um caso que fixa 40 com a
  mensagem. **Confira neutralizando os dois lados** — se só um deles morde, a trava
  continua tendo um lado livre.

### 1.2 O alargamento de filtro não é cobrado por canário nenhum

- **Quantos:** 1 linha, e é a peça inteira da história da Q11.
- **Onde:** `research/tools/busca.mjs:641` —
  `...alargamento.flatMap((a) => a.amostra.map((c) => c.id)),` dentro de `idsMostrados`.
- **Repro (rodado, e revertido):** apagar essa linha → `npm run check:kb` **exit 0**.
  Ou seja, o banner *"o filtro é que estreitou"* pode sumir da tela sem que nada reclame:
  V033-03/04/05 chegam a `idsMostrados` pelo vizinho de arquivo de qualquer jeito.
- **O conserto:** C19 precisa cobrar o **caminho**, não só o conjunto. Campo novo
  (`porOndeChega: "alargamento"`) para pelo menos um id, e o `check-canarios.mjs` verifica
  a proveniência dentro do objeto que `recuperar()` devolve, não a união achatada.
- **Como se verifica:** apagar a linha 641 derruba C19 com mensagem que **nomeia o
  alargamento**. Hoje derruba nada.

### 1.3 `busca.test.mjs` não cobre a fiação

- **Quantos:** 35 casos, todos sobre um corpus sintético de ~12 claims (`V901-*`),
  chamando `buscarRelaxada` diretamente.
- **Repro (rodado, e revertido):** em `recuperar`, trocar `const relaxada = pobre` por
  `const relaxada = false` (a vizinhança some inteira) → `node research/tools/busca.test.mjs`
  **exit 0**. `check-canarios.mjs` **exit 1** — só os canários pegam.
- **Leitura honesta:** isto é menos grave que 1.1 e 1.2, porque a rede de segurança existe
  (os canários) e mordeu. Mas os 35 casos provam que as **funções** funcionam sobre 12
  claims falsas; não provam que **o corpus real é recuperável**, e o `ESTADO.md` citava-os
  na coluna errada. Corrigido lá.
- **O conserto:** ≥3 casos de `busca.test.mjs` passam a chamar `recuperar()` (não
  `buscarRelaxada`) sobre o corpus sintético, um deles exigindo que a vizinhança apareça
  quando `pobre` é verdadeiro.
- **Como se verifica:** a mutação `relaxada = false` deixa `busca.test.mjs` **vermelho**.

**Fan-out:** 1 agente. Os três itens tocam os mesmos dois arquivos e um fan-out colidiria.

---

## 2. A precisão da recuperação — **nada mede, e ela já regrediu a zero uma vez**

**Por quê:** este foi o furo maior do ataque, e nenhum teste do repositório o media. A
expansão do `VOCABULARIO.md` disparava uma seção inteira quando **uma** palavra de 4+
letras de um termo aparecia na consulta. Efeito medido em 09/08: `--busca "quantas horas
de sono por semana"` devolvia **0 de 40** claims sobre sono (a base tem 62 para `/sono/`) e
punha **V170-34/V170-33 — supinar seis dias por semana — em 1º e 2º**. O mesmo para
calorias, corte de peso e `deload` (este último via `## lesao`, porque `load management`
contém `load`).

**Para um atleta com histórico de ruptura de peitoral, a claim mais perigosa da base
estava sendo injetada no topo de quase toda pergunta de planejamento semanal.**

- **Estado:** **consertado** em 09/08 (`expandirPorVocabulario`, `busca.mjs:508-545`:
  expressão de mais de uma palavra só dispara quando **todas** as suas palavras de 4+
  letras estão na consulta, cada uma como palavra inteira; palavras curtas — `per`, `por`,
  `de` — ficam fora da exigência, então `quantas séries por muscle` continua achando).
  Reconferido agora: `--busca "quantas horas de sono por semana"` volta a falar de sono.
- **O que falta, e é o item:** **nada trava isso.** Reverter o `every` para `some` passa
  verde em `check:kb`, `busca.test.mjs` e nos 19 canários.
- **O conserto:** uma **quinta família de canário — `ausente-injetado`**. Ela é o
  espelho de `presente-escondido` e cobra a direção oposta: dada uma consulta de um
  assunto, ids de **outro** assunto **não podem** aparecer nas N primeiras.
  - **Quantos:** 4 casos, os quatro medidos: sono, calorias, corte de peso, deload.
  - **Onde:** `research/kb/CANARIOS.json` + `research/tools/check-canarios.mjs`.
  - **Forma:** `consulta` + `proibidos: [V170-34, V170-33, ...]` + `esperados` (≥1 id do
    assunto certo dentro do teto). Os `proibidos` vêm da medição; os `esperados` vêm de
    `--topic sono` sem filtro. **Nenhum lado derivado do outro**, que é a regra que separa
    isto da trava que se testa a si mesma.
- **Como se verifica:** trocar `longas.every` por `longas.some` em `busca.mjs:534` deixa
  os quatro **vermelhos**, nomeando V170-34. Reverter volta a verde. **Confira
  neutralizando** — canário novo que não morde é pior que canário nenhum, porque ocupa a
  vaga.

**Fan-out:** 1 agente. Depende de §1 (o teto tem de sair da ferramenta antes de um canário
novo passar a citá-lo).

---

## 3. C20 — o canário `presente-escondido` que a onda 2A não construiu, e falha

**Por quê:** os quatro canários C16–C19 são os quatro casos **para os quais o conserto foi
construído**, e o `VOCABULARIO.md` tem uma seção escrita para cada um. Um caso novo,
escolhido de fora dessa lista, **falha**. Isso é a medida honesta do alcance da camada.

- **Quantos:** 1 canário, 2 buscas cegas, 3 ids.
- **Onde:** `research/kb/CANARIOS-CANDIDATOS.json` (já escrito, **fora do `check:kb` de
  propósito** — canário vermelho de nascença dentro do build é como se desliga uma trava).
- **Repro:**
  ```
  node research/tools/check-canarios.mjs --canarios research/kb/CANARIOS-CANDIDATOS.json
  # ✗ C20 (duas vezes): "rest between sets" e "descanso entre séries" não devolvem
  #   V038-07, V074-10 dentro das 40 primeiras
  ```
- **O material existe e está tipado:** tópico fechado `descanso-entre-series`; V038-07
  (8 min em vez de 5, `GERAL`, param em frame `min`), V074-10 (10 min ajuda mais que 5,
  `GERAL`, idem), V074-23 (a única `prescricao` `GERAL` do assunto). `--grep "rest between
  sets"` e `--grep "descanso entre séries"` casam **zero literal**.
- **Pior, e é o que decide a prioridade:** `--busca "quanto descansar entre as séries"`
  devolve, do conjunto todo, **só G015-11** — que é `relato-de-programa` do GZCLP,
  exatamente a gaveta que a base manda nunca tratar como prescrição.
- **O conserto:** escrever `## descanso-entre-series` no `VOCABULARIO.md` (11º dos 74
  tópicos) com os termos que o canal de fato usa — derive-os, não invente:
  `node -e` sobre `vocabularioDoTopico(indice, 'descanso-entre-series', 12, ...)`.
- **Como se verifica:** C20 fica verde **com a ferramenta dele**, e só então migra de
  `CANARIOS-CANDIDATOS.json` para `CANARIOS.json` (passando de 19 para 20 canários).
  Migrar antes de passar é proibido.
- **Depois de fechar C20, escreva um C21 de um caso que você também não usou.** Se C21
  falhar, o alcance da camada é "os casos para os quais ela foi feita, mais um" — e isso é
  um resultado, não um fracasso; escreva-o.

**Fan-out:** 1 agente. Depende de §2 (a seção nova do índice pode reintroduzir o problema
de precisão, e o canário `ausente-injetado` é quem pega).

---

## 4. Os quatro buracos que o passe do cluster de dor deixou abertos

**Por quê:** perigo de tecido, conserto de registro. É a única fila desta lista que pode
fazer a base dizer a **este** atleta para treinar dentro da dor do peitoral que ele rompeu.

### 4.1 A trava de dose ampliada continua cega no eixo do `modo`

- **Quantos:** 1 predicado, e a claim mais perigosa da base está do lado de fora dele.
- **Onde:** `research/tools/check-claims.mjs:346` — exige
  `c.modo === 'prescricao' && !(c.conditions?.length) &&` param em `FRAMES_DOSE`.
  `escala_dor` entrou em `FRAMES_DOSE` (`kb.mjs:322`), **mas `V138-19` (limiar 2 a 4/10,
  quatro params `escala_dor`) é `modo: opiniao`** — e o `DOR-E-TREINO.md` §2 diz que foi
  exatamente por ser `opiniao` que ela escapou da medição.
  **Ampliou-se o eixo do frame e deixou-se aberto o eixo do modo: modo de falha nº 2 dentro
  do passe que o cita.** O §5 do `DOR-E-TREINO.md` afirma cobertura que não existe.
- **Repro:** apagar `conditions` de V138-19 → `npm run check:kb` continua imprimindo
  `23× prescrição com dose e sem conditions`, sem uma linha sobre ela. Com V001-06 (que é
  `prescricao`) vai a `24×`.
- **O conserto:** o predicado passa a ser *"param em frame `escala_dor` **em qualquer
  `modo`** sem `conditions`"* — dor é o único frame em que `opiniao` já mostrou virar dose.
  Meça o custo **antes**: conte quantos avisos novos entram. Se forem muitos, o conserto é
  catraca por número, não recusa.
- **Como se verifica:** apagar `conditions` de V138-19 move o contador; restaurar volta.
  Caso em `check-claims.test.mjs` exigindo a mensagem. E corrija a frase do
  `DOR-E-TREINO.md` §5 no **mesmo** passe.

### 4.2 Quatro das nove claims declaradas cruas continuam cruas

- **Quantos:** 4 — `V138-08`, `V138-13`, `V138-24`, `V138-18`.
- **Onde:** `research/kb/DOR-E-TREINO.md` §2 lista nove; §4.1 trata cinco. As outras quatro
  não voltam a aparecer em §4, §7 ou §10 — o documento nunca diz por quê.
- **A pior é `V138-18`**, e é a que a própria "prova do conserto" (§9.2) devolve sem uma
  aresta: *"reduz o peso até o ponto em que se sente ALGUMA DOR mas não se sente pior na
  sessão seguinte"*, `GERAL` + `prescricao` — **é a autorização definicional, e é o número
  que todas as outras citam como limiar**. Agrava que a convenção diverge dentro do mesmo
  arquivo: V138-04 e V138-22 apontam `conditions: ["V138-18"]`, e V138-21 e V138-24, que
  também dizem "abaixo do limiar de dor", não apontam para nada.
- **Mais dois irmãos que a varredura perdeu:** `V138-03` (perdida por conjugação — o termo
  declarado é `keep moving`, o verbatim diz `keepING moving`; é a tese de abertura do R138,
  o vídeo mais permissivo da família) e `V108-29` (*"não dá para dizer que reabilitou se
  não trabalhou o exercício de volta até ele ficar tolerável"* — a definição de alta por
  tolerância, sem critério de revisão, `modo: opiniao`).
- **São 6 claims.** Cada uma: abrir a transcrição na janela do `at`, procurar a ressalva
  **dita colado** e nunca extraída, e ligar como `conditions`. **Não invente ressalva** —
  se não houver, registre que não há.
- **Como se verifica:**
  ```
  node research/tools/check-evidence.mjs --topic dor --modo prescricao --scope GERAL --limit 0
  ```
  hoje devolve 25 claims das quais **10 saem sem nenhuma aresta**
  (`G030-18 G043-13 V079-25 V079-35 V079-39 V089-24 V089-25 V091-27 V091-29 V138-18`).
  O número tem de cair, e **V138-18 tem de sair da lista**.

### 4.3 `conflicts` bidirecional não tem trava nem está declarado no `SCHEMA.md`

- **Quantos:** 48 arestas, **8 de mão dupla e 40 de mão única**, e nada diz qual é a certa.
  É o modo de falha nº 1 servido de bandeja: o próximo copia a do vizinho.
- **Onde:** `research/kb/SCHEMA.md:77` só diz *"opcional. Vira aresta no ledger de
  contradições"* — nada sobre direção.
- **Repro:** apagar `conflicts` de `V027-25` → `check:kb` **exit 0**, e V027-25 volta a sair
  sem a linha `conflita` enquanto V079-34/V138-01/V138-20 continuam apontando para ela.
  **A propriedade de segurança apodrece em silêncio.**
- **O conserto:** decidir a convenção, escrevê-la no `SCHEMA.md` e travá-la. Recomendação:
  **bidirecional obrigatório** (contradição é simétrica por definição, ao contrário de
  `conditions`, que é assimétrica e já tem a trava do ciclo). Fechar as 40 arestas de mão
  única é trabalho mecânico e vai junto — **e é aqui que a tarefa #25 começa**, não no
  bloco 11.
- **Como se verifica:** aresta de mão única vira **erro** de `check-claims.mjs`, com caso
  em `check-claims.test.mjs`. A mutação acima passa a derrubar o build.

### 4.4 Uma contradição registrada onde há refinamento — **remova**

- **Quantos:** 1 aresta (par), e é o custo que o briefing mandou vigiar.
- **Qual:** `V001-06 ↔ V138-19`. *"about a 2 out of 10 level of pain"* e *"the usual level
  to be around the 2 to four"* são **compatíveis** — 2 pertence a [2,4] — e são do mesmo
  autor, um mais preciso que o outro. Registrar isso como Vena-contra-Vena põe no ledger
  uma contradição que não existe e **ensina a base a duvidar de duas afirmações
  consistentes**.
- **A colisão real** é V138-19 contra o `PROGRAMA.md` §1.2 (*"≥4/10 encerra a sessão"*), e
  o §7 do próprio `DOR-E-TREINO.md` diz que ela **não cabe** em `conflicts`, porque norma
  não é claim. É o `RUNBOOK.md` §8.24, e destrava no bloco 6.
- **Como se verifica:** `node research/tools/check-evidence.mjs V001-06 V138-19` para de
  imprimir `conflita` uma para a outra; a contagem cai de 48 para 46 arestas; e o
  `DOR-E-TREINO.md` registra a remoção com o motivo (não apague a linha — o registro do
  excesso é o que impede o próximo de refazê-lo).

**Fan-out:** 2 agentes — um em 4.1+4.3 (código e trava), um em 4.2+4.4 (claims e
transcrição). **Não paralelize dentro de `research/extract/R138.jsonl`.**

---

## 5. Triagem de banalidade — tarefa #34 — **com portão de calibração antes de escalar**

**Por quê:** pedido explícito do atleta, reagindo a `V014-03` (*"o primeiro passo acontece
antes de tocar na barra: ficar adequadamente hypado"*) ter exatamente o mesmo peso de
`V014-12` (*"não basta colocar o meio do pé sob a barra: é preciso rotacionar por baixo da
barra para que o centro de massa fique sob ela"*). As duas são `tier R · GERAL ·
prescricao · genero aula · explicit`, do mesmo vídeo, a 78 segundos de distância. **Nada no
registro as separa hoje.**

**Ele optou por MARCAR, não apagar.** Claim banal continua citável, continua contando, e
continua saindo em `--limit 0`; ela só deixa de competir pelo topo da tela.

- **Quantos:** universo = 6.912 claims. Campo `banal` presente hoje em **0**.
- **Onde:** campo novo `banal: true` (booleano, opcional, só `true` — ausência é o
  default e não se grava `false`), em `research/extract/*.jsonl`. Declaração em
  `SCHEMA.md` e a decisão em `ENUMERADOS.md`, **no mesmo passe** que o `kb.mjs`.

### 5.1 O PORTÃO — e ele é o item, não um preâmbulo

**Não construa o campo antes de passar aqui.**

1. Escreva o critério **antes** de olhar as claims, em uma frase falseável, no
   `PROTOCOLO-EXTRACAO.md`. Proposta a bater: *"banal = a claim não muda decisão nenhuma
   deste atleta porque o comportamento contrário não é uma opção que alguém realmente
   considere"*. `V014-03` é banal por esse critério; `V014-12` não é, porque *não*
   rotacionar sob a barra é o que ele faz hoje.
2. **Amostra de 150**, sorteada por script com semente fixa e gravada em arquivo
   (`research/kb/banalidade-amostra.json`) — a amostra é dado, não escolha de quem julga.
3. **Dois agentes independentes**, sem ver o julgamento do outro, sobre a mesma amostra.
4. Concordância medida por script (Cohen κ **e** a concordância bruta, porque com classes
   desbalanceadas as duas divergem e citar só uma engana).
5. **Abaixo de ~85 % de concordância bruta, o campo é ruído e NÃO deve ser construído.**
   Escreva o número medido, encerre o item, e registre no `ESTADO.md` que o campo foi
   recusado por calibração. **Isso é um resultado, não um fracasso** — e é mais barato que
   6.912 marcações que ninguém pode citar.

### 5.2 Se o portão passar

- Fan-out de extração sobre os 197+ arquivos, com o critério e os 150 já julgados como
  **casos-âncora no prompt** (o discordante do par vai junto, com a resolução escrita).
- Catraca `TETO_BANAL` por prefixo em `check-claims.mjs`, **só sobe**, com o motivo — é o
  inverso das outras catracas desta base e por isso tem de vir com a justificativa ao lado.
- `check-evidence.mjs` ganha `--banal` / `--sem-banal`, e **`recuperar()` desempata por
  `banal` apenas no fim** (nunca exclui: banal escondido é o modo de falha nº 2, o dado
  empurrado para fora da trava).

### 5.3 Como se verifica que ficou certo

- O κ e a concordância bruta estão escritos, com n=150 e a semente da amostra.
- `--sem-banal` sobre `--topic setup` deixa de devolver V014-03 e continua devolvendo
  V014-12. **Este par é o caso de aceite, porque foi ele que originou o pedido.**
- Um canário `presente-escondido` existente continua verde **com `--sem-banal` ligado** —
  se marcar banal esconder um id que a medição exigia, a marcação está errada, não a busca.

**Fan-out:** 2 agentes no portão (obrigatoriamente independentes); depois, fan-out largo.

---

## 6. Os fatos do atleta como `tier U` — tarefa #28

**Por quê:** `tier U = 0` é o que torna C08 impossível, o que faz de todo *"seu TM é 215"*
uma fabricação, e o que bloqueia o `RUNBOOK.md` §8.24 (a contradição `V138-*` × §1.2 não
tem como ser registrada porque o gate do app **não é uma claim**). O `MEDICAO-02.md` §8
diz, na lista do que a base não faz: **"não conhece o atleta"**.

- **Quantos:** estimados **25–40** claims. A lista sai de `research/baseline.md` e do
  histórico da conversa, **não** de invenção.
- **O que entra:** as marcas declaradas com a condição em que foram medidas (agacho 250 em
  pin squat com os pinos 5–8 cm altos; supino 170 com 0,20 s no fundo e sem comando; terra
  sumo 268), peso e categoria (87 kg, classe 93 IPF), idade, 5 dias/semana, natural, nunca
  competiu, o histórico de ruptura de peitoral com a data, e **o gate do §1.2 como claim do
  atleta** — que é o alvo que o §8.24 pede.
- **O que NÃO entra, e é decisão:**
  - **a calibração de RPE fica de fora.** Ela depende de ele treinar, e ele **não vai
    treinar esta semana**. Claim `tier U` sobre RPE hoje seria estimativa carimbada de
    fato — exatamente o defeito que `tier U` existe para impedir.
  - os números **derivados** (o 1RM legal estimado de ≈215 kg, o fator −12 a −18 %). Eles
    são leitura do `baseline.md`, não coisa que o atleta disse. Se entrarem, entram como
    `tier I` com `basis` apontando para as `tier U` — nunca como `U`.
- **Onde:** arquivo novo `research/extract/U001.jsonl`. Confira **antes de escrever as 30**
  que um caso mínimo passa o compilador: `FORMA_DO_ID` é `/^[A-Z]\d{3}-\d+$/`
  (`check-claims.mjs:157`), `src`/`at`/`verbatim` só são exigidos para `tier R`
  (`check-claims.mjs:351`), e `tier U` exige `source.date` em ISO
  (`check-claims.mjs:378-381`). **Rode com uma claim só e leia a saída** — se o prefixo `U`
  precisar entrar em `sources.mjs`, descubra isso com 1 claim, não com 30.
- **Como se verifica:**
  1. `npm run check:kb` verde com o arquivo novo.
  2. `node research/tools/check-evidence.mjs --tier U --limit 0` devolve a lista inteira,
     e **nenhuma delas tem `certainty: explicit` sobre número derivado**.
  3. O canário **C08** (que é `impossivel` hoje) é reavaliado à mão: se ele virou
     respondível, ele **muda de família** e o `CANARIOS.json` registra a mudança com a
     data. Canário que muda de família em silêncio é o pior desfecho possível — foi assim
     que C04 acusou a medição que mentiu.
  4. `RUNBOOK.md` §8.24 sai da lista de abertas **só se** a aresta `V138-19 ↔ <a claim do
     gate>` estiver escrita e resolvendo.

**Fan-out:** 1 agente. É pequeno, é sensível, e paralelizar 30 claims sobre uma pessoa é
como se produzem 3 versões diferentes do peso dela.

---

## 7. Whisper nos `suspect` — tarefa #31

- **Quantos:** **74 claims** com `suspect: true`, das quais **53 sem `suspectWhy`**
  (recontado agora; `TETO_SEM_SUSPECT_WHY = 53` em `check-claims.mjs:893`, catraca que só
  desce). `research/kb/suspeitos-whisper.json` tem 11 janelas já preparadas.
- **Onde:** `research/RUNBOOK.md` §2, passo 6 —
  `list-suspects` → `verify-suspects` → `whisper-window.py`. Todas as janelas num
  **único** load do modelo (`large-v3-turbo` custa ~2 min só para carregar).
- **A regra que não pode ser afrouxada:** a saída do Whisper é **evidência, não veredito**.
  Só `CONFIRMADO` é automático. Divergência vai para julgamento à mão, com as duas
  transcrições lado a lado.
- **Junto vai `V142-08`, e ele é o caso que prova que o passe é necessário:** a claim grava
  `r2_min = 65` e `r2_max = 0.9`, e o passe anterior declarou *"a fonte está quebrada"* sem
  abrir a transcrição. **A transcrição desmente, uma linha depois:** `[01:16]` é o próprio
  Vena glosando *"that basically means **65 to 90%** of the difference in strength…"*. Ou
  seja **R² = 0,65 a 0,90** — o ASR comeu o *"point"*. A claim merece `suspect: true` +
  `suspectWhy: numero` no param, que é campo **de param** e é legítimo (64 ocorrências de
  `"suspect":true` na base). **Não converta 65 → 0,65 sem o Whisper confirmar**: o conserto
  certo é marcar, medir, e só então editar.
- **Como se verifica:** `TETO_SEM_SUSPECT_WHY` **desce** e o `check-claims.mjs` diz para
  qual número descê-lo (ele já imprime isso, `check-claims.mjs:904`). Cada claim tocada
  tem o `verbatimWhisper` gravado ao lado do `verbatim`, nunca por cima dele.
- **Também nesta fila, e é defeito conhecido:** `V112-23` grava hora de relógio em notação
  de 12 h (`almoco_hora = 1`, `lanche_hora = 4`, `shake_noite_hora = 7`). Converter para
  13/16/19 **quebra o build** (*"número 4 aparece na claim mas não tem param"*), porque a
  claim escreve *"às 4 da tarde"*. O conserto exige editar o **texto da claim** no mesmo
  passe. E `V166-05` é uma claim que inteira é nota de artefato de extração — ela sai, e
  remover claim é decisão que precisa de linha registrada, não de passe de params.

**Fan-out:** 1 agente (o modelo é um recurso serial).

---

## 8. A família TAXA — 111 params — e `FRAMES_DOSE` no mesmo commit

- **Quantos:** **111 params em 69 claims**: 68 em `series` (*"séries/semana"* gravado como
  `series`), 18 em `lb`, 16 em `contagem`, 9 em `reps`.
- **Onde:** `node research/tools/params-gaveta-errada.mjs` imprime a lista; `--ids` e
  `--json` a tornam consumível.
- **A armadilha, e é por isso que o passe anterior recusou (com razão):** `series`, `reps`
  e `lb` estão em `FRAMES_DOSE`. Abrir `series_semana` e mover 68 params para lá
  **desliga em silêncio** o aviso de *"prescrição com dose e sem `conditions`"* para todos
  eles — trocaria um defeito de tipagem pelo apagamento da trava mais cara da base.
  **Quem fechar esta família mexe em `FRAMES_DOSE` no mesmo commit, ou não mexe em nada.**
- **O que É barato e não foi feito, e o motivo escrito na base está errado:** as regras
  **`ano_calendario`** e **`indice_adimensional`** reportam **zero** hoje. Travá-las custa
  zero quebra de build. A frase gravada no `ESTADO.md` — *"enquanto a lista não zerar,
  virar recusa fecharia o build sobre dado legítimo"* — é falsa: **o detector emite por
  família, e sete famílias emitem zero.** Corrigida nesta rodada; o trabalho continua
  aberto.
- **Repro de que as duas regras estão vivas:** reintroduza um defeito de cada num tree
  copiado (`V013-16` → frame `anos`, `V142-11` → frame `pct`) e o detector acusa as duas,
  enquanto `check-claims.mjs` continua exit 0.
- **Guarda quebrada, e é modo de falha nº 4 na guarda que o passe invoca:**
  `params-gaveta-errada.mjs:277` (`ABERTAS_EM_9_8`) lista 13 frames da onda anterior e
  **não inclui nenhuma das 8 gavetas abertas em 9/8 pelo passe de params**
  (`ano_calendario`, `indice_adimensional`, `horas_semana`, `horas_dia`, `min_semana`,
  `min_dia`, `lb_semana`, `MET_min_semana`). O comentário logo acima diz *"é a contraprova
  barata de que o passe de reparo não aconteceu"* — e ela hoje **mente sobre o próprio
  escopo**. Não há defeito vivo, mas **três dessas gavetas têm exatamente UM usuário**:
  apagar essa única claim mata a gaveta e a checagem que existe para acusar exatamente
  isso continua muda.
- **Como se verifica:** as 8 gavetas entram em `ABERTAS_EM_9_8`; as duas regras em zero
  viram recusa de `check-claims.mjs` **com caso em `check-claims.test.mjs` exigindo a
  mensagem** (neutralize a recusa e veja o teste ficar vermelho); e o detector imprime o
  total novo. **O critério de aceite original — *"o detector imprime zero e o arquivo é
  apagado"* — não vale mais e foi reescrito** (§9).

**Fan-out:** 1 agente para as duas regras em zero + `ABERTAS_EM_9_8` (barato, isolado).
1 agente separado, depois, para TAXA + `FRAMES_DOSE`.

---

## 9. Reconciliação documental — três documentos que discordam em silêncio

**Por quê:** modo de falha nº 3. Nenhum destes é caro; todos são citados por número em
outros arquivos, e é o documento errado que vai ser citado.

| # | Onde | O que está errado | Como se verifica |
|---|---|---|---|
| 9.1 | `MEDICAO-02.md` §6.1 | *"as quatro SEM `conditions` registradas"* — **era falso no commit que a publicou** (`f19c304`): V138-20 já tinha `["V138-18"]` e V079-32 já tinha `["V079-33","V079-34"]`. Eram **duas**. E *"o §1.2 cita [R79] como PESSOAL e a claim está gravada como GERAL — divergência real"* está com **o sinal invertido**: é o `PROGRAMA.md` que erra o rótulo, não a base | `sed -n '/^### 6.1/,/^### 6.2/p' research/kb/MEDICAO-02.md` traz a correção **datada e ao lado**, e um ponteiro para `DOR-E-TREINO.md` §8. **Não reescreva a frase original** — este é um relatório de medição; corrigir por cima apaga o rastro de que ela foi citada assim |
| 9.2 | `ONDA-2.md` §*"Como se verifica que ficou certo"* (linhas 276-283) | Continua declarando como definição de pronto *"o detector imprime **zero** achados"* e *"cada regra vira uma recusa e este arquivo é apagado"*. O detector imprime **111**, o arquivo existe, nenhuma regra virou recusa. `ESTADO.md` e `ENUMERADOS.md` foram atualizados com a decisão nova; **o documento que carrega os critérios de aceite, não.** Quem ler amanhã acha que o passe falhou — ou apaga o detector para "fechar" o item | `git status --short research/kb/ONDA-2.md` deixa de estar vazio; os critérios passam a ser os do §8 acima, com a data e o motivo da mudança |
| 9.3 | `PROGRAMA.md` §1.2 | O rótulo `[R79] [PESSOAL]` está **errado**: o verbatim é *"…is a good amount to push at though ultimately **adjust to what you need**"*, recomendação endereçada ao ouvinte; `GERAL` da base está certo. E o `@03:35` aponta um bloco antes do trecho (está em `[03:47]`) | Conserto de uma palavra e um timestamp, especificado no `DOR-E-TREINO.md` §7. **`PROGRAMA.md` é lido por máquina** (`check-pain-gate.mjs` parseia a tabela do §1.2) — rode `npm run check:gate` no mesmo passe e confirme os 59 cenários |

**Uma afirmação do ataque que NÃO reproduz, e fica registrada para não ser recopiada:**
*"`check-vocabulario.mjs` só varre a prosa da claim"* é **falsa** nesta árvore. Ele usa
`validarVocabulario` → `textoDaClaim` (`busca.mjs:141-151`), que inclui
`params.name`, `params.unit`, `params.frame`, `params.value` e `topic`. A mensagem
*"zero na base inteira"* mede o que diz. **Não conserte o que não está quebrado.**

**Fan-out:** 1 agente. É tudo edição de documento, e três agentes em `research/kb/` colidem.

---

## 10. Os quatro casos da medição que a camada de recuperação **não** destravou

Isto não é um item de trabalho isolado — é a lista de aceite dos blocos 2 e 3, e o número
que o `ESTADO.md` passou a carregar. Registrado aqui para que o próximo passe **não
comemore de novo**.

| caso | consulta na forma realista | o que sai hoje | veredito |
|---|---|---|---|
| **Q11** | `--busca "quanto baixar o peso quando o RPE vem acima do alvo"` | **zero** de V033-03/04/05 **e zero de V050-21**. As três só aparecem quando a consulta **já contém a resposta** (`--grep "2 a 3%"`) | **continua escondida** |
| **Q14** | `--busca "ângulo da câmera para julgar profundidade no vídeo"` | só **G027-31**. Com `camera angle depth judging`: G029-28 em 22º, G027-31 em 49º, G029-18 em 98º | **continua parcial** |
| **Q16** | `--busca "supino parado há 5 semanas platô"` — a pergunta com as palavras dela mesma | zero literal, nada sobre ciclo nem platô. Só funciona com a palavra canônica (`quanto tempo dura um ciclo de treino` → V070-20 em 1º) | **destravada só com a palavra certa** |
| **Q19** | `--busca "quantas séries por músculo por semana"` | V010-13 volta a sair **depois do conserto de precisão de 09/08**, no índice compacto — não no topo | **destravada, frágil** |

**E o canário C19 é calibrado sobre a resposta.** `buscaCega.termos = ["2 a 3%"]`, e o
campo `descricao` admite: *"a consulta CERTA, com a trava de segurança da Q11 ligada por
cima"*. A Q11 medida **não digitou isso** — ela concluiu *"A BASE NÃO TEM NÚMERO PARA
QUANTO BAIXAR"* justamente por não saber que o número era 2–3 %. **Nenhum agente digita
`2 a 3%` sem já saber a resposta.** C19 tem de ganhar uma segunda `buscaCega` com uma
formulação que não contenha o número — e se ela falhar, C19 fica vermelho e vai para
`CANARIOS-CANDIDATOS.json` junto com C20, em vez de certificar um conserto que não houve.

**Um defeito de mecanismo que os dois casos acima compartilham:** a amostra do banner de
filtro é por **ordem de arquivo**, não por relevância (`alargarFiltro`,
`revela.slice(0, teto)` com teto 8). `--grep "RPE" --modo prescricao --scope GERAL` diz
*"escondem 185 claim(s)"* e lista oito ids de `review-de-programa`, nenhum útil. O banner
só serve quando o conjunto escondido já é minúsculo — que é o caso de C19, **e só porque a
consulta dele já contém a resposta**. Ordenar a amostra pelo mesmo score da vizinhança é
conserto de uma linha e vai no bloco 2.

**E um comentário de código que não reproduz** (modo de falha nº 3, dentro de `busca.mjs`):
o arquivo justifica os bônus de semente com *"Medido, não suposto: com IDF apenas, `six
times` deixava V170-34 fora dos 20 primeiros"*. Zerando os dois bônus (`×1,6` e `×2,2`) e
mantendo a penalidade de 0,45, **V170-34 continua em 1º** e tudo segue verde. Quem carrega
o peso é a penalidade, não os bônus — e os números 1,6 e 2,2 não são cobrados por nada.
Ou o comentário vira verdade (com o número que de fato muda), ou os bônus saem.

---

## 11. O ledger de contradições e as sínteses — tarefas #25 e #26 — **por último**

**Por que por último, e a ordem aqui não é negociável:** reparo vem antes de síntese porque
**erro de dado vira norma para o próximo agente**. Uma síntese com `basis` apontando para
V138-18 sem aresta, ou para V142-08 com R² = 65, produz um documento curado que o próximo
agente lê como verdade estabelecida — e o `MEDICAO-02.md` §8 já mediu que **a camada de
DECISÃO desta base são os documentos curados**, não as claims. Errar ali custa mais que
errar numa claim.

### 11.1 O ledger (#25)

- **Metade dele já está no bloco 4.3**: a convenção de direção, a trava, e as 40 arestas de
  mão única. Faça aquilo primeiro; o que sobra aqui é o **subregistro**.
- **Quantos:** 48 arestas em 6.912 claims, com duas fontes que discordam, é subregistro
  quase certo. O universo de busca são os pares mesma-`topic` / `modo` compatível com
  números conflitantes — **derive a lista, não a escreva à mão** (é o defeito nº 3 no
  próprio inventário dos defeitos, e já aconteceu no §3 do `ESTADO.md`).
- **A regra que separa contradição de refinamento** tem de estar escrita **antes** de abrir
  a lista, e o caso de teste dela é o §4.4: *"2/10"* e *"2 a 4/10"* do mesmo autor **não**
  são contradição. Sem essa regra escrita, o passe produz o excesso em escala.
- **Como se verifica:** o número de arestas sobe; **nenhuma aresta nova liga claims
  compatíveis** (amostra de 30, julgada contra a regra escrita); a trava de bidirecionalidade
  do 4.3 está ligada e o build morde quando uma aresta é apagada de um lado só.

### 11.2 As sínteses e o INDEX (#26)

- **Onde:** `research/synth/` e `research/kb/topics/*.md` — **os dois são citados pelo
  `SCHEMA.md` e pelo `PROTOCOLO-EXTRACAO.md` e nenhum dos dois existe** (`RUNBOOK.md` §8.9).
  Não há gerador. Isso é o item.
- **A trava que já existe e não pode ser furada:** `check-evidence.mjs:160-161` é hoje o
  **único** formatador de claim do repositório, e imprime `condições:` e `conflita:`
  **sempre**. É por isso que não há caminho de vazamento do número de dor cru. **Uma visão
  gerada em `topics/` é um segundo formatador** — e o dia em que ela existir é o dia em que
  esse invariante pode quebrar em silêncio.
  **Requisito duro:** as visões geradas usam **a mesma função** de formatação, ou o passe
  não é aceito. Se forem duas implementações, a segunda vai divergir — é o modo de falha
  nº 3, e desta vez com a claim de dor do outro lado.
- **Como se verifica:** um teste que gera a visão de `## dor` e exige que **toda** claim
  com `conditions` saia com a linha de condições. Apagar a linha do formatador deixa o
  teste vermelho **nas duas** saídas.

**Fan-out:** 1 agente no ledger, 1 nas sínteses, **em série**, nesta ordem.

---

## 12. O que NÃO fazer — e é a parte que se lê primeiro

1. **Não ingerir mais corpus.** O `MEDICAO-02.md` mediu que o gargalo **não é conteúdo**, e
   a previsão de `AVALIACAO.md` §4.4 — *"o Blevins conserta Q05, Q11 e Q16"* — foi
   **falseada**: as três eram claim do **Vena** que ninguém achou. Uma rodada inteira de
   aquisição já foi orçada contra o sintoma errado, uma vez. A razão claim-extraída /
   decisão-tomada é ~100:1.
2. **Não mexer no `AVALIACAO.md`.** O instrumento fica estável para a terceira medição.
   Ele continua intocado desde a MEDICAO-02, e essa é a única razão pela qual as duas
   medições vão ser comparáveis.
3. **Não migrar C20 (nem C21) para o `CANARIOS.json` antes de passar.** Canário vermelho de
   nascença dentro do `check:kb` é como se desliga uma trava — alguém remove o canário, não
   o defeito.
4. **Não construir o campo `banal` se a calibração ficar abaixo de ~85 %.** Recusar é o
   desfecho aprovado do item, e é mais barato que 6.912 marcações incitáveis.
5. **Não fechar a família TAXA sem tocar `FRAMES_DOSE` no mesmo commit.** Ver §8.
6. **Não "consertar" `check-vocabulario.mjs`** — a acusação de que ele só varre a prosa não
   reproduz nesta árvore (§9).
7. **Não escrever claim `tier U` de calibração de RPE.** Ele não vai treinar esta semana;
   a claim seria estimativa carimbada de fato, no campo que existe para impedir isso.

---

## 13. Procedência deste arquivo

Todo número aqui foi reproduzido por script ou por execução durante a escrita, em
09/08/2026, contra esta árvore:

- **Contagens** (6.912 claims, 507/695 `conditions`, 37/48 `conflicts`, 74 `suspect` /
  53 sem `suspectWhy`, `banal` em 0, `tier U = 0`): script sobre `research/extract/*.jsonl`.
- **As três mutações do §1**: aplicadas, medidas e **revertidas** nesta sessão.
  `TETO_VIZINHANCA 40 → 400` → `check:kb` exit 0. Remoção do `alargamento` de
  `idsMostrados` → `check:kb` exit 0. `relaxada = false` → `busca.test.mjs` exit 0 e
  `check-canarios.mjs` exit 1.
- **As consultas do §10**: `check-evidence.mjs --busca` rodado com cada formulação.
- **C20**: `check-canarios.mjs --canarios research/kb/CANARIOS-CANDIDATOS.json` → 2 falhas.
- **V142-08**: `research/corpus/transcripts/R142-*.md`, linha `[01:16]`, lida.
- **Os limites do compilador citados no §6**: `check-claims.mjs` linhas 157, 351, 378-381.
- **Estado das três verdes:** `npm run check:kb`, `npm run build` e `npm run check:gate`
  todos **exit 0** no início e no fim desta sessão.
- **O que NÃO foi verificado por mim:** o texto das 44 respostas da MEDICAO-02, e o
  julgamento de banalidade de qualquer claim além do par V014-03 / V014-12.
