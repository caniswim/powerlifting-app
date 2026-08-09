# Auditoria adversarial de fidelidade claim ↔ verbatim

**Data:** 2026-08-09 · **Escopo:** `research/extract/*.jsonl` (4.982 claims, 178 arquivos, 177 vídeos + 1 regulamento IPF) · **Método:** amostragem enviesada para risco + varredura mecânica da base inteira · **Nada foi editado.** Todas as correções abaixo são propostas.

## O que esta auditoria testa

O `check-claims.mjs` prova que o `verbatim` existe na transcrição, perto do `at`, e que todo número tem unidade e frame. Ele passa em ~4.800 claims sem erro. O que ele não sabe fazer é **ler**: não tem como saber se o português do campo `claim` representa fielmente o inglês do campo `verbatim`. Uma claim pode citar um trecho real e mesmo assim dizer outra coisa.

Esta auditoria foi conduzida como acusação, não como defesa: a amostra foi montada para maximizar a chance de achar erro, não para medir a base. Os números abaixo são portanto **teto de taxa de erro**, não estimativa central.

## Amostra

**163 claims, 108 vídeos distintos** (61% dos vídeos do corpus). Estratificada por quartil de densidade de claims por minuto de vídeo (D1 ≤ 5,02/min · D2 ≤ 6,63 · D3 ≤ 7,83 · D4 > 7,83), com teto de 3 claims por vídeo para forçar espalhamento.

Enviesamento deliberado — as células de maior risco:

| célula | por que é risco | n |
|---|---|---|
| `certainty: "implied"` | inferência, não transcrição | 8 (todas as 8 da base) |
| negação no verbatim | um `n't` perdido inverte a frase | 36 |
| claim com `params` | número trocado é dado errado com cara de dado | 36 |
| claim longa (>140 car.) | mais afirmação do que um trecho sustenta | 20 |
| verbatim curto em relação à claim | o trecho não cobre o que a claim afirma | 24 |
| `scope: GERAL` + verbo deôntico | "ele recomenda X" quando ele disse "eu às vezes faço X" | 20 |
| `tier: O` (regulamento IPF) | tradução de norma, onde discordar não é opção | 8 |
| aleatória por quartil | controle | 16 |

Para cada claim foi lido o entorno do timestamp em `research/corpus/transcripts/`, tipicamente quatro blocos de legenda (~60 s). Em 12 casos a leitura foi estendida para resolver referente ambíguo.

Além da amostra, cinco varreduras mecânicas rodaram sobre as 4.947 claims `tier: R` inteiras. Elas estão em "Padrão de erro" e são, na prática, o achado maior — porque medem a base toda em vez de uma amostra.

## Taxa por categoria

Sobre as 163 claims lidas uma a uma:

| categoria | n | % da amostra enriquecida |
|---|---:|---:|
| **fiel** | 149 | 91,4% |
| **imprecisa** (número, unidade ou sujeito trocado) | 8 | 4,9% |
| **exagerada** (afirma mais do que o verbatim sustenta) | 4 | 2,5% |
| **descontextualizada** (o entorno muda o sentido) | 2 | 1,2% |
| **invertida** (contradiz o verbatim) | **0** | **0,0%** |

Intervalo honesto: com n=163 e 14 não-fiéis, p̂ = 8,6%, IC 95% ≈ **[4,3%; 12,9%]** (Wald). Mas esse intervalo mede a *amostra enriquecida*, não a base. Como cada célula da amostra foi escolhida por ser mais arriscada que a média, **a taxa real sobre as 4.982 claims é menor que esse intervalo**. Não dá para dizer quanto menor sem uma amostra aleatória — que não foi feita, porque não era o pedido. O que dá para afirmar com honestidade: mesmo empilhando o baralho contra a base, nove em cada dez claims sobreviveram à leitura, e nenhuma foi invertida.

Um detalhe que merece ser dito porque foi tentado e falhou: procurei especificamente por inversão de polaridade, em 36 claims com negação. **Não achei nenhuma.** Em vários casos o extrator *decodificou corretamente uma legenda corrompida* — leu `felt 795` como "falhou 795", `weighing the meet` como "venceu o meet", `go later` como "vá mais leve", `a large suppress` como "Larsen press", `a f Ecentric` como "excêntrica rápida". Isso é o oposto do erro que eu estava procurando: os agentes leram melhor do que a legenda escreveu.

**Também não achei uma única claim inventada.** Todo verbatim conferido estava mesmo na transcrição, no lugar certo — o `check-claims.mjs` está fazendo o trabalho dele.

## As claims não-fiéis

### Exageradas

---

**`V052-07`** — R052 @00:30 · `GERAL` · gravidade **alta**

- **verbatim:** `The next is form cues. Don't use them`
- **claim:** "Na tentativa máxima não se deve usar cues de técnica."
- **problema:** a frase seguinte no mesmo bloco desfaz o absoluto: *"You should only use form cues that you really have down automatically"*, e o bloco seguinte prescreve ativamente um cue: *"try to use an external queue... like think of throwing the bar towards the ceiling on bench"*. A claim como está diz o contrário da recomendação operativa.
- **redação proposta:** "Na tentativa máxima só se deve usar cues de técnica que já estejam automáticos; para os demais, pensar em nada ou num cue externo simples."

---

**`V143-02`** — R143 @00:00 · `GERAL` · gravidade **alta**

- **verbatim:** `it is one of the most common lifting myths and it's a fundamental misunderstanding of cause and effect`
- **claim:** "Ele classifica a sobrecarga progressiva como um dos mitos mais comuns da musculação e uma confusão fundamental de causa e efeito."
- **problema:** o referente de *"it"* não é sobrecarga progressiva; é a regra absoluta enunciada duas frases antes — *"you need to do more than you did before to keep progressing... it isn't true"*. Ele não descarta sobrecarga progressiva: no mesmo canal ele a prescreve (`V070-27`, `V061-10`, `V099-16`). A claim transforma "a versão absoluta da regra é mito" em "a regra é mito", que é uma proposição que o programa não pode consumir.
- **redação proposta:** "Ele classifica como mito a versão absoluta da sobrecarga progressiva — a ideia de que é preciso fazer mais do que antes para continuar progredindo — e a chama de confusão fundamental de causa e efeito."

---

**`V107-14`** — R107 @01:16 · `PESSOAL` · gravidade **baixa**

- **verbatim:** `I just don't see these very useful and I never really programmed them so I'm going to go with f tier`
- **claim:** "Ele nunca programou trap bar e a coloca em F tier."
- **problema:** *"never really programmed"* vira "nunca programou". Hedge removido; a afirmação absoluta não é o que ele disse.
- **redação proposta:** "Ele praticamente nunca programou trap bar e a coloca em F tier."

---

**`V009-19`** — R009 @04:04 · `GERAL` · gravidade **baixa**

- **verbatim:** `do isolation work going to failure or near failure. That's where you get your hypertrophy in a less fatiguing way`
- **claim:** "A hipertrofia deve vir do trabalho de isolamento até a falha ou perto dela, que é a forma menos fatigante de consegui-la."
- **problema:** o "deve" é do extrator. Trinta segundos depois ele abre a exceção que anula a regra para uma fatia grande do público: *"sometimes people don't have the time... you might still want to approach hypertrophy a bit with your squat, bench, and deadlift sets"* (que a base registra, corretamente, em `V009-21`). Isolada, a claim lê como regra fechada.
- **redação proposta:** "A via preferida para hipertrofia é o trabalho de isolamento até a falha ou perto dela, que é a forma menos fatigante de consegui-la."

---

**Fora da amostra, achada na varredura de razão verbatim/claim — merece constar porque é a pior do gênero:**

**`V011-20`** — R011 @03:04 · `GERAL` · gravidade **alta (defeito de evidência, não de sentido)**

- **verbatim:** `for sumo pullers, I find` ← **isto não é uma proposição**
- **claim:** "puxadores de sumô devem sempre incluir uma variação de trabalho focado em hinge"
- **problema:** o verbatim armazenado é um fragmento sem predicado. O `check-claims.mjs` o aceitou porque a string existe na transcrição. A frase completa é *"for sumo pullers, I find you always want to include some variation like this to focus hinging work"* — ou seja, **a claim é verdadeira**, mas nada no registro prova isso. Um "sempre" universal sustentado por um verbatim de quatro palavras que não afirma nada é o pior caso possível de evidência auditável.
- **redação proposta:** manter a claim, trocar o verbatim por `for sumo pullers, I find you always want to include some variation like this to focus hinging work`.

### Descontextualizadas

---

**`V147-06`** — R147 @00:15 · `GERAL` · gravidade **média**

- **verbatim:** `even if you don't make progress for a little bit it doesn't mean anything's necessarily wrong`
- **claim:** "Mesmo ficar um tempo sem progredir não significa necessariamente que algo esteja errado, **a não ser em níveis mais avançados**."
- **problema:** a ressalva "a não ser em níveis mais avançados" não está no verbatim. Ela vem de *"feeling sore one day doesn't mean you need to instantly take a deload **unless you get more advanced**"* — a frase **anterior**, que fala de dor muscular e deload, não de progresso. O extrator enxertou o qualificador na proposição errada.
- **redação proposta:** "Mesmo ficar um tempo sem progredir não significa necessariamente que algo esteja errado." (A ressalva sobre nível avançado é outra claim, com outro `at` e outro verbatim.)

---

**`V038-07`** — R038 @00:30 · `GERAL` · gravidade **média**

- **verbatim:** `there could be a benefit of resting 8 minutes instead of 5 minutes`
- **claim:** "Numa série pesada de agacho ou terra pode haver benefício em descansar 8 minutos em vez de 5 minutos."
- **problema:** é uma concessão dentro de um argumento **contra** descanso longo. A frase seguinte é *"But what if it means dropping two working sets or cutting out an accessory lift because we don't have enough time?"* e ele conclui *"sometimes accepting slight [losses] in the recovery can be worth it"*. Lida sozinha, a claim é uma recomendação de descansar 8 min; no vídeo ela é a premissa que ele derruba.
- **redação proposta:** "Ele concede que numa série pesada de agacho ou terra pode haver benefício em descansar 8 em vez de 5 minutos, mas argumenta que para quem tem tempo limitado esse ganho não compensa perder séries de trabalho."

### Imprecisas

Sete das oito imprecisas da amostra são o **mesmo defeito**: `frame` que não corresponde à `unit`. Elas estão consolidadas na seção seguinte, porque a varredura mostrou que não são oito — são 72 na base inteira. Aqui só a que não é desse tipo:

---

**`V163-14`** — R163 @01:46 · `GERAL` · gravidade **baixa**

- **verbatim:** `Demands for knee flexion during sumo versus conventional are about 300% higher`
- **claim:** "As demandas no joelho durante o sumo são cerca de 300% maiores que no convencional."
- **problema:** "knee flexion" virou "no joelho". Perde a especificação do movimento, que é justamente o que o entorno usa para concluir *"sumo is way more a quad dominant movement"*.
- **redação proposta:** "As demandas de flexão de joelho durante o sumo são cerca de 300% maiores que no convencional."

---

**`V024-17`** — R024 @03:23 · `GERAL` · gravidade **baixa** (erra para menos, não para mais)

- **verbatim:** `the oldest squat world record in the ipf`
- **claim:** "Ele **acredita** que esse é o recorde mundial de agacho mais antigo em vigor na IPF."
- **problema:** ele afirma, não acredita — e a claim descarta o fato principal do trecho (*"I hit above the world record"*). Registro para completude: subafirmar é menos perigoso que superafirmar, mas ainda é desalinhamento.
- **redação proposta:** "Ele bateu, em treino, acima do que descreve como o recorde mundial de agacho mais antigo em vigor na IPF."

---

**`V033-09`** — R033 @01:00 · `PESSOAL` · gravidade **alta** — **fabricação de parâmetro**

- **verbatim:** `it's going to be about 7 12%`
- **claim:** "Esse acréscimo de ciclo representa cerca de 7 12% do peso segundo o que ele diz."
- **params:** `acrescimo_ciclo_pct_a = 7 %` **e** `acrescimo_ciclo_pct_b = 12 %`
- **problema:** `7 12%` é a legenda comendo a fração de `7 1/2%`. Confirma-se pelo entorno: a frase seguinte é `2 and 12 to 3 RP` (= 2 ½ a 3 RPE) e a taxa dele é 3% por RPE — 2,5 × 3 = 7,5%. A claim está honestamente marcada `suspect: true`, o que é a coisa certa. Mas os **params não estão**, e o extrator transformou um número corrompido em **dois números que não existem**. Quem consumir `params` vê 7% e 12% como dados. A flag `suspect` não se propaga para dentro do array.
- **redação proposta:** um único param, `acrescimo_ciclo_pct = 7.5 %` com `suspect: true` no próprio param, ou — mais seguro — nenhum param e a claim reescrita como "Ele cita um acréscimo percentual ao longo do ciclo que a legenda registra de forma corrompida (`7 12%`) e que o entorno indica ser 7,5%." Já está na fila do Whisper.

## Padrão de erro

Esta é a parte que vale mais que a lista.

### 1. Não há erro de tradução. Há erro de recorte.

Zero inversões, zero fabricações, e em oito ocasiões o extrator recuperou corretamente o sentido de uma legenda corrompida. O eixo "o português diz outra coisa que o inglês" — que era a hipótese central desta auditoria — **essencialmente não existe na base**. Os agentes de extração leram bem.

O que existe é **o verbatim parar antes da proposição**. Varredura sobre as 4.947 claims `R`:

- **376 claims (7,6%) têm `verbatim` que termina em palavra funcional** (`and`, `to`, `if`, `you`, `because`, `just`…), ou seja, cortado no meio da frase;
- **72 claims (1,5%) têm `verbatim` com menos de 35 caracteres.**

Nesses casos a claim quase sempre continua **verdadeira contra a transcrição** — mas o registro não a prova. Exemplos lidos: `V098-20` (`...you either aren't warmed up enough or you` — a segunda alternativa que a claim afirma está no bloco seguinte), `V002-21` (verbatim descreve só o aparato; a conclusão "por isso não são aplicáveis" está 15 s depois), `V040-09` (`if we need to actually max out to see if we're` — a apódose inteira está fora), `V169-17` (`third just limit stress` sustentando uma claim com três proposições), `V080-31`, `V027-19`, `V013-16`, `V007-10`, `V113-30`.

**Por que se concentra aí:** a legenda do YouTube quebra em blocos de ~15 s **no meio da frase**. O extrator ancora o verbatim no bloco do `at` e copia até o fim do bloco. Toda vez que a frase do Vena atravessa a fronteira — o que acontece o tempo todo, porque ele fala rápido e sem pausa — o verbatim fica truncado. Não é falta de cuidado do agente; é um artefato geométrico do formato do corpus.

**Consequência real:** a promessa arquitetural da base é que `verbatim` é a unidade auditável. Em ~8% dos casos ela não é. A claim é boa e a evidência é inconclusiva — que é exatamente o estado que o `SCHEMA.md` foi escrito para tornar impossível.

**O que fazer:** um passo mecânico que, para cada claim, estenda o verbatim até o próximo terminador de frase atravessando fronteira de bloco. É determinístico, não precisa de agente, e resolve os 376 casos de uma vez.

### 2. O `frame` não é verificado contra a `unit`. 72 params com a grandeza errada.

O checker recusa `frame` fora do enumerado (regra 6) mas **nunca compara `frame` com `unit`**. Resultado:

| defeito | n | ids |
|---|---:|---|
| `polegadas` → frame `cm` | 15 | V014-08 (×2), V016-29, V099-08, V104-27, V114-17, V119-08, V121-09 (×2), V132-27 (×2), V141-27 (×2), V168-09, V170-21 |
| `g` → frame `kg` | 14 | V012-01, V041-01, V041-15, V043-02, V043-04, V043-09, V043-14, V043-15, V043-19, V043-24, V043-25 (×2), V044-22 (×2) |
| `semanas` → frame `anos` | 12 | V012-05, V012-06, V019-17, V020-46 (×3), V048-24 (×2), V050-03, V050-23, V148-12, V148-13 |
| `h` → frame `min` | 8 | V003-01, V003-02 (×2), V003-33, V004-29, V004-31, V004-33, V009-13 |
| `semanas` → frame `min` | 6 | V004-03, V004-04 (×2), V004-05 (×3) |
| `meses` → frame `anos` | 5 | V017-13, V017-14, V019-03, V019-06, V063-04 |
| `horas` → frame `min` | 4 | V015-13, V015-17, V015-18, V046-18 |
| `dias` → frame `anos` | 4 | V015-26 (×2), V020-21, V045-01 |
| **`lb` → frame `kg`** | **2** | **V105-02 (385 lb), V106-10 (395 lb)** |
| `meses` → frame `min` | 1 | V009-01 |
| `polegada` → frame `cm` | 1 | V171-26 |

**Os dois últimos casos de massa são o bug dos 215 kg voltando.** `V105-02` registra um single de **385 lb** com `frame: "kg"`; `V106-10` registra **395 lb** com `frame: "kg"`. Um consumidor que confie no frame — que é literalmente para isso que o campo existe — lê 385 kg e 395 kg. É o mesmo mecanismo que produziu a confusão `1RM_legal`/`trainingMax` que o `SCHEMA.md` documenta na abertura: dois campos, duas semânticas, nenhum alarme. Só que desta vez está dentro do registro tipado que deveria impedi-lo.

`V012-01` é o mesmo defeito com sinal invertido: **500 g** com `frame: "kg"` — a margem pela qual ele perdeu o Nationals vira 500 kg.

**Onde se concentra e por quê — três causas distintas, não uma:**

- **Colisão de nome no enumerado.** `min` significa *minutos*, mas quinze params o usam como *mínimo* (`ciclo_min`, `duracao_inicial_min`, `descanso_curto`). Todos em vídeos com faixas ("entre 12 e 20 semanas"). Isto não é descuido de agente — é um enumerado que oferece uma gaveta com o nome errado bem na hora em que o agente precisa de uma. **Não há frame para "mínimo de uma faixa" e não deveria haver**: o par min/max é estrutura, não unidade.
- **Concentração por lote/tema.** As 14 trocas `g`→`kg` estão quase todas em **R041, R043, R044** — os vídeos de nutrição, um bloco de trabalho contíguo. Um agente pegou um hábito e o repetiu por três arquivos. Esse é o padrão clássico de erro em lote, e é o mais fácil de corrigir e de auditar.
- **Enumerado sem disciplina de uso.** As 16 trocas `polegadas`→`cm` estão espalhadas por 12 vídeos diferentes, sem agrupamento. Aqui não é um agente: é *todos* os agentes convergindo para o mesmo atalho, porque `cm` é o frame "de comprimento" mais óbvio da tabela e `polegadas` parece variante dele. Defeito de instrução, não de execução.

**Onde procurar depois:** `R041`, `R043`, `R044` inteiros (nutrição, `g`/`kg`); qualquer claim com `unit: "polegadas"`; todo param com `frame: "min"` (verificar se é minuto ou mínimo); `R004`, `R012`, `R015`, `R017`, `R019`, `R020`, `R048`, `R050`, `R148` — os training logs, onde toda duração vira `anos`.

**O que fazer:** uma nona regra no `check-claims.mjs` — `frame` e `unit` têm que ser da mesma grandeza física. É comparação de tabela, não julgamento, e é exatamente o tipo de coisa que o `verification.md` diz que agente não deve fazer.

### 3. A regra 5 tem uma porta lateral: número por extenso.

O checker exige `param` para todo número na `claim`, mas só enxerga **dígitos**. **368 claims** contêm um numeral escrito por extenso em português com contexto quantitativo e **zero params**:

- `V078-23` — "a mudança diária é de cerca de **um sétimo de libra**" (nenhum param para 1/7 lb)
- `V087-09` — "depois de **dois meses e meio** sem nenhum" (nenhum param para 2,5 meses)
- `V006-24` — "a manutenção fica em cerca de **cinco mil e quinhentas** calorias por dia"
- `V006-25` — "o déficit vai ficar na faixa de **mil a mil e quinhentas** calorias, por **duas ou três** semanas"
- `V006-28` — "abaixo de **meia libra** por semana"

Nenhuma dessas é infiel — todas conferem com o verbatim. Mas todas são exatamente o que o `SCHEMA.md` chama de "número sem procedência": um dado citável que não está em `params` e portanto não é consultável, não é convertível, e não é verificável pelo passe de Whisper (que rastreia `params`). Cinco mil e quinhentas calorias por dia é um número que o programa pode querer usar.

**O que fazer:** estender a regra 5 para reconhecer numerais por extenso em pt-BR. É lista fechada de ~40 palavras.

### 4. Remoção de hedge: 30 claims, dano baixo por unidade, sistêmico em agregado.

Trinta claims `scope: GERAL` têm verbatim hedgeado (`I think`, `I find`, `I'd say`, `for me`) e claim em forma deôntica nua, sem marcador de opinião em português. Exemplos: `V010-10` (`I think you should be in the RP3 to RP6` → "O trabalho focado em força **deve** ficar na faixa de RPE 3 a RPE 6"), `V018-12`, `V126-07`, `V146-04`, `V035-19`, `V064-09`.

Individualmente cada uma é defensável — o cara é coach, "I think you should" é uma recomendação. Em agregado, é a conversão silenciosa de "o que o Vena acha" em "o que se deve fazer", que é literalmente o defeito que o campo `scope` foi criado para impedir (*"A run 1 misturou os dois e virou prescrição"*). O campo `scope` separa PESSOAL de GERAL, mas **não existe campo que separe opinião de fato dentro de GERAL**, e o hedge do verbatim é a única coisa que carrega essa informação — e ela está sendo descartada na tradução.

**O que fazer:** ou preservar o hedge na redação em pt-BR ("ele considera que…"), ou — melhor, porque é verificável — reconhecer que `certainty` só tem dois valores hoje (`explicit`/`implied`) e que falta o eixo ortogonal *opinião declarada vs. asserção factual*.

### 5. Legenda corrompida onde a claim depende da polaridade — fila do Whisper.

**946 claims (19%)** têm negação no verbatim **e** negação na claim que depende dela. É população demais para verificar toda; a ferramenta `list-suspects.mjs` já as pontua e manda o topo para o Whisper. Correto.

O que esta auditoria acrescenta são **seis casos onde a legenda está visivelmente corrompida em torno da polaridade e que não estão na fila atual** (`--top 120`). Em todos, a claim está *certa* e o verbatim é que está errado — o inverso do que o `list-suspects` procura, e por isso invisível para ele:

| id | verbatim como está (corrompido) | o que quase certamente foi dito | por que importa |
|---|---|---|---|
| `V108-11` | `if you always worry about things you're going to get results` | `…you're going to hurt your results` | a legenda diz o **oposto** do sentido; a claim ("afeta seus resultados") está certa mas não é sustentada |
| `V116-23` | `some people feel as confident pulling with without the belt` | `some people don't feel as confident pulling without the belt` | `don't` comido; a claim leu certo |
| `V023-01` | `last week i felt 795` | `last week i failed 795` | a claim afirma falha; o verbatim não a sustenta |
| `V028-27` | `and then just go later and work your way back up` | `…just go lighter…` | a claim prescreve "ir mais leve"; o verbatim não diz isso |
| `V058-21` | `More work than the true failure, at least occasionally` | `…work to true failure…` | frase sem sentido sustentando prescrição de acessório |
| `V102-17` | `save that for in out or competing` | `save that for max out or competing` | menor, mas a claim usa "max out" |

Adicionar estes seis à fila. `V051-10` (`weighing the meet` = `winning the meet`) e `V033-09` já estão.

Nota lateral que merece checagem: **`V045-18` — o caso de `energy availability` que já era conhecido como invertido — não aparece na fila do `list-suspects.mjs --top 120`.** Ou já foi resolvido e a claim reescrita, ou o scoring está deixando passar exatamente o tipo de caso que o motivou. Vale confirmar antes do próximo passe.

## O que a base faz bem, e que deve ser preservado

Registrado porque uma auditoria que só lista defeito não diz onde está o acerto que se pode quebrar sem querer.

- **Números implausíveis são marcados, não maquiados.** `V117-01`, `V057-23` e `V166-05` todas registram o valor corrompido `45 lb` para o supino dele e **dizem no texto da claim** que a transcrição provavelmente o corrompeu, com `suspect: true` no param. É a resposta certa: nem chutar 445, nem fingir que 45 é dado.
- **Sarcasmo e hipótese são rotulados corretamente.** `V063-01` ("Ele **ridiculariza** a reação de trocar de programa…"), `V117-01` (a conclusão irônica sobre outliers), `V155-10` ("Mesmo **supondo** que arredondar as costas fosse totalmente seguro…"), `V061-24` ("Ele diz **de brincadeira** que…"). Nenhum desses virou prescrição. Era o risco mais óbvio de descontextualização e ele foi tratado.
- **Nomes próprios corrompidos não viram dado.** `a large suppress` (Larsen press) e `a,b squat` (800 lb squat) foram generalizados em vez de transcritos — `V127-13` diz "numa variação de supino em que não se pratica o leg drive" em vez de inventar um nome; `V100-05` diz "chegou àquele agachamento" em vez de arriscar o número.
- **As 8 claims `implied` estão todas corretamente rotuladas.** Nenhuma delas devia ser `explicit`.
- **As claims `tier: O` (regulamento IPF) conferem palavra por palavra** com o texto normativo. Amostra pequena (8), mas limpa.

## Ordem de trabalho sugerida

Em ordem de retorno por esforço, e todas mecanizáveis exceto a última:

1. **Regra 9 no checker: `frame` compatível com `unit`.** Trava os 72 params errados e impede a reincidência. Comparação de tabela.
2. **Estender verbatim até o fim da frase, atravessando fronteira de bloco.** Determinístico, resolve os 376 truncados, restaura a auditabilidade prometida.
3. **Regra 5 reconhecendo numeral por extenso em pt-BR.** Expõe os 368 números sem procedência.
4. **Seis alvos novos para o Whisper** (tabela acima) + confirmar o estado de `V045-18`.
5. **Corrigir as 8 claims não-fiéis listadas**, com as redações propostas. É o menor dos itens em volume, e de propósito: o problema desta base nunca foi o que ela diz, foi o que ela consegue provar.
