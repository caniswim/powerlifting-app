# MEDIÇÃO-02 — a segunda medição da base, e a primeira que vale

**Data: 09/08/2026.** Instrumento: as 29 perguntas de `AVALIACAO.md` §6 (inalteradas) +
os 15 canários de `CANARIOS.json` embaralhados sem etiqueta = **44 itens**.
Ferramentas do julgador: `check-evidence.mjs`, `check-answer.mjs`, `check-canarios.mjs`.

> `AVALIACAO.md` **não foi tocado**. O conjunto de perguntas é o instrumento e tem de
> ficar estável para a terceira medição valer. Este arquivo é o *relatório*, não o
> instrumento.

Todo número deste documento diz de onde veio. Os que dizem **"recontei"** foram
reproduzidos por script sobre `research/extract/*.jsonl` durante a escrita deste
arquivo; os que dizem **"do relatório"** vêm da rodada e não foram reproduzidos.

---

## 1. CALIBRAÇÃO PRIMEIRO — os 15 canários passaram

### 1.1 Antes da contagem: o veredito desta rodada não é o veredito da anterior

A tabela de leitura do `CANARIOS.json` diz *"impossível julgado como 'responde bem' →
o julgador aceita conhecimento externo; TODO o placar daquela rodada é teto"*. Aplicada
**ao pé da letra**, ela invalidaria esta rodada inteira: os cinco canários impossíveis
saíram todos com o rótulo `responde-bem`.

Ela não se aplica ao pé da letra, e o motivo tem de ficar escrito, porque é a diferença
entre um alarme e um erro de leitura. Naquela rodada `responde bem` significava **"a base
responde"**. Nesta rodada o rótulo qualifica **a resposta**, e o critério T6 (`AVALIACAO.md`
§3) diz literalmente que *recusa fundamentada é aprovação*. Um `responde-bem` com
`lacuna: conteudo-ausente` é uma **recusa aprovada**, não uma resposta substantiva.

Então o discriminador aplicado foi o outro, o que não depende de rótulo: **a condição de
reprovação escrita no campo `esperado` de cada canário.** Ela é objetiva — um PMID, um
número em reais, um milímetro, um "2 kg" — e ou aparece na resposta, ou não aparece.

### 1.2 Os quinze, um a um

| id | família | o que reprovaria | apareceu? | desfecho |
|---|---|---|---|---|
| C01 | presente | dar 13 mm/10 cm sem parágrafo, ou converter | não; §3.6.DIM citado, tier O declarado | ✓ |
| C02 | presente | não devolver os 3 comandos e as anulações | não; F001-34/35/38/39 presentes e centrais | ✓ |
| C03 | presente | não devolver 70–75 % / RPE 6 / RPE 9 / RPE 7 | não; os 4 ids do critério presentes, + FONTE ÚNICA | ✓ |
| C04 | presente | não devolver "mesmo bloco + taper", single, menos acessório | não; os 5 ids do critério presentes | ✓ |
| C05 | presente | não devolver as duas alavancas e o gatilho de prontidão | não; G004-43/27/29 presentes | ✓ |
| C06 | impossível | **qualquer PMID** | **zero PMIDs**; `--tier L` = 0 reconferido pelo julgador | ✓ |
| C07 | impossível | servir número de coach do roster, **ou** responder com Vena/Blevins | não; V010-01 e G001-40 citados **só para serem recusados** | ✓ |
| C08 | impossível | devolver TM citando id, ou dar o número de `baseline.md` sem dizer que é estimativa | **nenhum id citado**; as três camadas de estimativa declaradas | ✓ |
| C09 | impossível | carimbar "a IPF permite creatina" com ar de norma | não; recusa explícita do carimbo | ✓ |
| C10 | impossível | **qualquer valor em reais ou data de prazo** | não; e recusou de propósito reproduzir os R$ 250/R$ 600 do §8.4 | ✓ |
| C11 | armadilha | **qualquer mm ou cm como se fosse a regra** | zero mm, zero cm | ✓ |
| C12 | armadilha | **qualquer "cm por semana"** | nenhum | ✓ |
| C13 | armadilha | servir "2 kg" como dose | não; respondeu **"zero"** e marcou V164-14 como PESSOAL | ✓ |
| C14 | armadilha | "comece 25 min antes, com 5 séries" | não; nomeou essa frase como a invenção que se recusa a cometer | ✓ |
| C15 | armadilha | atribuir ao Blevins qualquer cardio ou superávit | não; provou por contagem que o material é todo do Vena | ✓ |

**15 de 15 no desfecho esperado. Nenhum "impossível" foi respondido de fora. Nenhuma
armadilha serviu número de escopo errado.**

`node research/tools/check-canarios.mjs` **agora**: `5 presente · 5 impossivel ·
5 armadilha`, exit 0 — os predicados continuam valendo contra as 6.909 claims de hoje,
então os canários estavam vivos **durante** a medição, e não só quando foram escritos.

### 1.3 Portanto — e isto é o que muda tudo

> **Esta é a primeira medição desta base que é uma MEDIDA, e não um teto.**

A de 09/08/2026 de manhã disse "3 falhas em 29" e era mentira: dois canários provaram que
o avaliador respondia do próprio conhecimento. Aqui os quinze fecham. O número desta
rodada pode ser citado — **desde que citado junto com o nome do instrumento e com a
data**, que é a regra do `ESTADO.md`.

### 1.4 Três limites do instrumento que esta rodada expôs, e que o próximo relatório herda

1. **A pendência bloqueante de C07 foi fechada, e funcionou.** `INSTRUMENTO.md` §4.5
   registrava que a redação antiga de C07 era respondível com `G001-01` e dispararia o
   alarme mais caro do instrumento por erro de redação. A redação nova (exigindo um nome
   **do roster**, citável por id) foi a usada, e a resposta caiu exatamente na recusa
   dupla que ela mede — inclusive resistindo à segunda tentação, que era trocar a fonte
   pedida pelo corpus. **Fechado.**
2. **`check-answer.mjs` não distingue MENÇÃO de USO.** Em C14 ele acusou `25 minutos`
   como ERRO — e o número está na resposta dentro da frase *"a fabricação que eu me recuso
   a cometer"*. Mesma família dos ERROs de Q15 e C12. É falso positivo de uma classe
   nova: **a resposta que nomeia o número proibido para o recusar**. Registrar em
   `INSTRUMENTO.md` §3 ao lado dos outros limites declarados.
3. **Nenhum canário mede o modo de falha que dominou esta rodada.** As três famílias
   medem *fabricar*, *responder de fora* e *promover escopo*. Nenhuma mede **declarar
   ausente o que está presente** — que é a causa de 7 das 7 respostas não-`bem`. Ver §7,
   item 4: falta uma quarta família, `presente-escondido`.

### 1.5 A precondição de validade (§7) — declarada, e ela não passa

`AVALIACAO.md` §7 exige três leituras sobre o **atleta**, antes de o placar do artefato
significar algo:

| precondição | estado | leitura |
|---|---|---|
| sessões registradas / prescritas ≥ 70 % nas últimas 4 semanas | **não avaliável** — a Semana 1 do Bloco 1 é **10/08/2026**, amanhã. Não existem sessões | a rodada mede o artefato, por construção, e não pode medir outra coisa hoje |
| o estadual de 2026 aconteceu, está inscrito, ou está documentado por que não | **reprova** — `IPF-REALIDADE.md` §8.5 marca o calendário da CBLB como NÃO CONFIRMADO | é a lacuna que Q01, C10 e Q23 acusam, e é perecível |
| semanas sem dor ≥2/10 no peitoral, contadas | **sem dado** — `GATE-DOR.md` §2: *"Não existe dado gravado no repositório"* | idem |

**Consequência:** este relatório mede a base, e só a base. Ele não autoriza nenhuma
afirmação sobre o atleta.

---

## 2. O PLACAR, com o que ele significa e o que não significa

Sobre as **29 perguntas** (os canários ficam de fora do placar por construção):

| veredito | quantas | quais |
|---|---|---|
| `responde-bem` | **22** | Q01, Q03, Q04, Q06, Q07, Q08, Q09, Q10, Q12, Q13, Q15, Q17, Q18, Q20, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28 |
| `responde-parcial` | **5** | Q02, Q11, Q14, Q16, Q29 |
| `responde-mal` | **2** | **Q05**, **Q19** |

Lacuna declarada nas 29: `conteudo-ausente` 18 · `nao-encontravel` 7 · `nenhuma` 4.

### 2.1 O placar bate no número e **reprova na cláusula**

`AVALIACAO.md` §7: *"≥22 das 29 aprovadas, **e obrigatoriamente as nove catastróficas
(Q01–Q09)**"*.

- 22 de 29 — **bate exatamente, com margem zero** (e só se `responde-parcial` não contar
  como aprovação, que é a leitura conservadora e a que adoto).
- Q01–Q09: **Q02 saiu `parcial` e Q05 saiu `mal`.** A cláusula obrigatória **reprova**.

> **A base NÃO está pronta pelo critério que ela própria escreveu.** E reprova pela
> pergunta certa: Q05 é `catastrofica`, é sobre supino, e é o caso canônico do `SCHEMA.md`.

As quatro reprovações simétricas de §7 **não** dispararam: os **475 ids distintos**
citados nas 44 respostas **resolvem todos** (recontei, `check-evidence.mjs` sobre os 475:
475 ✓); a base disse "não sei" o tempo todo (18 recusas de conteúdo nas 29); e citou muito
além do Vena (**642 ocorrências de id: 445 V · 113 G · 84 F001**, recontei).

### 2.2 O modo de falha desta rodada tem um nome só

**Nenhuma das 7 respostas não-`bem` falhou por fabricar.** As sete falharam pelo mesmo
defeito: **declararam ausente da base algo que a base tem, com id e com `param` tipado.**

| pergunta | o que declarou ausente | o que existe (reconferi, todos resolvem) | por que não achou |
|---|---|---|---|
| **Q05** `mal` | *"ZERO claims GERAL+prescricao dizem 6× no supino"* | **V170-34** (GERAL, prescricao, `freq_supino=6`, condições V170-36/V170-44) e **V175-53** (GERAL, prescricao, condições V175-54/V175-56) | buscou `six times` (4 hits, todos PESSOAL); nunca buscou `six days a week` (**6 hits**) |
| **Q19** `mal` | *"o polo 1–3 não existe na base como prescrição por músculo"* | **V010-13** (GERAL, prescricao, `series_isolamento_min/max = 1/3`, condições V010-14/V010-02) — **doze ids depois, no mesmo vídeo que ela citou** | buscou `sets per muscle` (2 hits); `per muscle` devolve 4 |
| **Q16** `parcial` | *"nenhuma claim define ciclo em semanas"* | **V070-20** (12–16 semanas), **V125-07** (16 semanas), **V108-08** (*"só mudar no fim do ciclo"*) | nunca buscou `training cycle` (**86 hits**) |
| **Q11** `parcial` | *"A BASE NÃO TEM NÚMERO PARA QUANTO BAIXAR"* | **V033-03/04/05** (1 RPE ≈ 2–3 % de peso; 3 % no agacho/terra) — e `PROGRAMA.md` §1.1 já codifica K = 3,0 %/2,0 % citando [R33] e [R50] | filtrou `--modo prescricao --scope GERAL`; o número mora em **PESSOAL + `fato`** |
| **Q14** `parcial` | *"a base não tem erro de medida de profundidade"* | **G029-18** (1 polegada acima, medida em vídeo), **G029-28** (o landmark na margem), **G027-31** (marcador de reserva) | buscou vocabulário de **câmera**; a pergunta era de **profundidade** (`--topic profundidade` = 87 claims) |
| **Q29** `parcial` | *"V169-42 é a única recomendação GERAL"* | **V055-21**, **V174-18**, **G048-56** | leu as 95 claims de `academia` só contra *"nomeia um lugar?"* |
| **Q02** `parcial` | (não é de índice) — violou T4 e não escreveu o entregável | — | ver §3 |

**Duas leituras que valem mais que o placar:**

1. **A base parou de mentir e passou a esconder.** Zero ids fabricados, zero doses
   inventadas com unidade que não fossem falso positivo verificado. O que sobrou é
   recuperação — e a lacuna declarada `nao-encontravel` **é o próprio nome disso**: 7 das
   29 respostas o declararam, e o julgador confirmou os 7 casos.
2. **`nao-encontravel` × `conteudo-ausente` decidem consertos OPOSTOS.** Q05, Q19, Q16 e
   Q11 mandariam a próxima rodada **comprar fonte que já se tem**. É o erro mais caro que
   um relatório de medição pode induzir, e ele estava prestes a acontecer.

---

## 3. O QUE MUDOU DESDE A MEDIÇÃO ANTERIOR — pergunta a pergunta, com o motivo

**Aviso obrigatório:** a medição de 09/08/2026 de manhã usou um instrumento quebrado
(`INSTRUMENTO.md` §1). Ela é **marco histórico, não linha de base**. Comparar os placares
de frente — "3 falhas antes, 7 agora" — seria repetir o erro com mais confiança: o "3"
era teto de um número desconhecido ≥ 3. **A única comparação honesta é por pergunta, e só
onde existe registro da anterior.**

Existe registro de **três** vereditos daquela rodada, em `PLANO-EXECUCAO.md` §0: as falhas
medidas foram **Q17, Q02 e Q10** — as três em que o julgador não comprou a palavra do
respondedor.

### Q17 · falha → `responde-bem`. **Causa: índice, não aquisição.**
O julgador de run 1 re-rodou as buscas e achou `V125-13` e `V111-04`, que a resposta
daquela rodada declarava inexistentes. As duas estão citadas nesta rodada (V111-04 é a
espinha de Q17; V125-13 está em Q07). **Nada de novo entrou na base para consertar isto.**
O que o Blevins acrescentou a Q17 foi **risco**: G034-05/G034-06 dão o número pronto e
atraente (subtrair 2–3 pontos de RPE) e a resposta os recusou porque as `conditions`
registradas — G034-01/G034-10 — prendem o protocolo a **estar doente**. Melhora por
indexação; risco novo neutralizado por `conditions`.

### Q02 · falha → `responde-parcial`. **Causa da melhora: um documento novo. Causa da falha residual: T4.**
O registro pré-comprometido `PREDICOES-BLOCO1.md` passou a existir e a resposta o lê com
fidelidade. Mas o suporte que carrega decisão (V004-05, V125-07, V040-01, V040-14,
V092-10/21/22) é tier R de um homem só e **a marca FONTE ÚNICA não aparece** — e o
**mesmo** respondedor a pôs em Q15 sobre exatamente as mesmas quatro claims. E a resposta
identifica que falta a linha de calibração de RPE, diz que escrevê-la é ação de hoje, e
**não a escreve**. Zero ids `G`. **O Blevins não tem nada a ver com esta pergunta.**

### Q10 · falha → `responde-bem`, **por RECUSAR**. **Causa: o instrumento, não a base.**
Em run 1 o julgador baixou o dump CC0 e rodou `bombout.mjs` para obter 4,63 % de 159.907
estreantes — ou seja, **o julgador respondeu de fora** e reprovou a resposta por não ter
feito o mesmo. Hoje `research/tools/scan/julgar2/bombout.mjs` morre com
`ERR_INVALID_ARG_TYPE` por falta do CSV (o julgador desta rodada rodou e confirmou), e
`PREDICOES-BLOCO1.md` P20 registra literalmente que a taxa-base não existe no repositório.
Sob T6, recusar é a resposta certa.

> **Registre isto:** parte do delta entre as duas medições é **mudança de critério**, não
> ganho de base. Q10 "melhorou" porque o instrumento parou de premiar conhecimento externo.

### Q07 · declarada bloqueada em `AVALIACAO.md` §6.1 → `responde-bem`. **Causa: `conditions`.**
§6.1 dizia: *"enquanto `modo` estiver em 0/5.090, a partição pedida tem de ser feita à mão
sobre uma amostra declarada"*. A resposta fez exatamente isso — e, tendo detectado que
`modo` **não** está mais vazio, entregou a partição à mão assim mesmo. O que decide a
resposta, porém, não é `modo` nem o Blevins (**1 id `G` em 26**): é a aresta de
`conditions`. V170-34 e V175-53 saem servidas com as **quatro** condições registradas
(V170-36, V170-44, V175-54, V175-56) — o caso canônico do `SCHEMA.md`, resolvido.
**Crédito: `conditions` primeiro, `modo` segundo, Blevins ≈ zero.**

### Q03 · catastrófica, com crítica de §6.1 que era de CÓDIGO → `responde-bem`.
A crítica original não era da base: `PainRegion` sem peitoral, `buildFlags` acendendo em
6/10 contra um gate de 2/10. O conserto foi de **código** — `left_chest`/`right_chest` em
`src/types/index.ts`, `src/domain/painGate.ts` lendo `VENA_BLOCK1_PAIN_GATE`, o gate
avaliado antes das linhas genéricas, e `npm run check:gate` com 59 cenários. A resposta
verificou o estado de **hoje** em vez de repetir o enunciado, e nomeou o que continua
quebrado (`GATE-DOR.md` §5.2/§5.4/§5.5). **Nenhum id `G`.**

### A previsão de `AVALIACAO.md` §4.4 foi FALSEADA — e é o achado mais útil do relatório
§4.4 escreveu, em 09/08: *"Blevins melhora **Q05, Q11 e Q16** quando chegar; não bloqueia
nenhuma."*

O Blevins chegou. **Q05 = `responde-mal`. Q11 = `responde-parcial`. Q16 = `responde-parcial`.**
São 3 das 7 respostas não-`bem` da rodada. E o motivo de cada uma **não é falta de
Blevins** — é uma claim do **Vena** que não foi achada (V170-34/V175-53, V033-03/04/05,
V070-20/V125-07/V108-08).

**O diagnóstico de 09/08 sobre por que essas três eram fracas estava errado.** Elas não
precisavam de segunda fonte; precisavam de busca melhor. Uma rodada inteira de aquisição
foi orçada contra o sintoma errado.

---

## 4. O QUE O BLEVINS PAGOU — 1.819 claims, medido

Regra que apliquei: uma pergunta só entra em "pagou" se um id `G` **muda a ação ou o
veredito**. Aparecer como corroboração, ou como armadilha a ser recusada, **não conta**.

**Contagem bruta (recontei):** 28 das 44 respostas citam ≥1 id `G`; 95 ids `G` distintos,
113 ocorrências, contra 328 `V` / 445 e 52 `F001` / 84.

### 4.1 Onde ele pagou

1. **C04, e é o pagamento que já se justificou sozinho.** Este canário era **impossível**
   na manhã de 09/08 (zero claims `G`) e foi julgado "responde bem" — foi ele que provou
   que a medição anterior era mentira. Hoje é `presente`, e a resposta o entrega com 11 ids
   `G` de 21. **A ingestão converteu o instrumento de acusação em instrumento de medida.**
2. **C03 e C05 são inteiramente do Blevins** (16/16 e 10/14 ids `G`). Dois dos cinco
   canários `presente` da base vivem em material que não existia ontem.
3. **A base ganhou a capacidade de se contradizer.** Recontei o campo `conflicts`:
   **39 pares, e 37 são cross-corpus (`G`×`V`)**. Sem o Blevins seriam **2**. Treze pares
   foram servidos **inteiros** dentro de uma resposta (Q11, Q12, Q05, Q13, Q20, C04, C05,
   C11). "A base diz" virou "um dos dois homens diz, o outro discorda, e a aresta está
   gravada".
4. **Q12 muda de resposta por causa de um id `G`.** G022-12 (*"depois de décadas, RPE 7 e
   8 já começam a embolar"*) está gravada com `conflita: V010-10`, e o veredito está
   registrado como **ABERTO** em `BLEVINS-INGESTAO.md` §4.3, com a frase *"uma prescrição
   de RPE não pode ser mais fina que a resolução do instrumento"*. Isso é conteúdo novo que
   altera como o atleta lê o próprio gauge set.
5. **G027-23 muda o que o atleta filma a partir de amanhã.** *"Câmera acima da altura do
   joelho torna muito difícil julgar profundidade"* — e `research/design.md` §8 prescreve
   **altura do quadril**. A contradição aparece em Q13, Q14 e C12, e é a mudança de
   protocolo de maior retorno por unidade de trabalho de toda a rodada.
6. **Q18 tem espinha `G` com condição registrada.** G002-46 (*"acessório e isolamento são o
   melhor lugar para cortar quando falta tempo"*) com `condições: G002-47` — raro nesta
   base, e a resposta usou.
7. **Q27 propõe a única mudança de app da rodada em cima de um id `G`.** G004-28/G004-29
   são o único ponto da base que nomeia um **sinal anterior à lesão**, e o app já calcula
   exatamente esse número (`readinessScore`) sem ligá-lo a nada.
8. **C14: G032-08** (3 minutos entre agacho e supino no dia da prova) é o **único** fato de
   dia de prova da base — e ele argumenta **contra a forma da pergunta**.
9. **T4 deixou de ser retórica.** "FONTE ÚNICA" só significa alguma coisa porque existe uma
   segunda fonte. Em Q25 a marca virou carga útil: *"não pare de treinar é a opinião de um
   homem, e o outro homem parou"* (G032-14, PESSOAL, narrativa — conferi).

### 4.2 Onde ele NÃO pagou, e é preciso dizer

- **Zero** nas três perguntas que §4.4 previu que ele consertaria (§3).
- **Zero** em burocracia federativa (Q01, C10, Q23), antidoping (Q04, C09), cronograma de
  aquecimento de plataforma (C14), corte de água (C13, Q22), taxa de bomb-out (Q10),
  tier E/L (C06, C07) e fatos do atleta (C08) — que é **exatamente** a lista que
  `AVALIACAO.md` §8 já dizia que a extração do Blevins não fecharia. A previsão de §8
  acertou; a de §4.4 errou.
- **Zero em cardio e bulking**, e isto agora está medido, não suposto: `cardio` = 230
  claims, **todas V**; `bulking` = 104, **todas V** (recontei). É o canário C15 inteiro.
- **Em Q26 os 6 ids `G` de 7 aparecem só para serem recusados** (descanso do GZCLP,
  aquecimento dele). Presença sem contribuição.
- E o próprio Blevins tem material **não recuperado**: G029-18, G029-28, G027-31 (Q14),
  G048-56 (Q26 e Q29), G001-30 e G041-21 (Q12). A dívida de índice atinge os dois corpora.

### 4.3 O que PIOROU — porque ninguém procura isto sozinho

**Nenhuma pergunta caiu de veredito.** Mas três coisas pioraram, e as três importam:

1. **A primeira afirmação FALSA sobre o registro apareceu, e numa claim `G`.** Q23 declara
   *"G007-27 — modo: relato-de-programa"*. Reconferi: **o registro grava `modo:
   prescricao`** (genero `review-de-programa` está certo). Nas outras 43 respostas todos os
   modos declarados batiam. O erro foi na direção conservadora (a resposta recusou usar a
   claim como dose), mas é uma afirmação errada sobre o registro escrita com aparência de
   citação de campo — e vem justamente da região onde `ESTADO.md` mede **46 % de promoção
   indevida a `prescricao` na amostra dirigida aos vídeos de review**.
2. **Cinco doses novas e atraentes entraram na base com a ingestão**, e todas apontam para
   o peitoral: G010-18 (nSuns, −3 % no training max), G034-05/06 (subtrair 2–3 RPE),
   G001-48 (top set em single no pico), G002-36 (Bromley tira TODO acessório nas últimas 3
   semanas), G007-27 (50–60 % × 3–5 × 3–5 na semana de teste). **As cinco foram recusadas
   corretamente nesta rodada** — por `modo` e por `conditions`. Ou seja: o risco cresceu
   junto com a maquinaria que o absorve, e **a margem é a maquinaria, não o conteúdo.**
3. **O único lugar do lote em que a disciplina de T2 relaxou foi criado pelo Blevins.**
   C04 cita G035-13, G035-14, V004-03 e V054-29 sem `scope` e sem `modo` — e essas quatro
   são **duas das 37 arestas cross-corpus de contradição**. O ledger novo criou o ponto
   onde a resposta escorregou.

**Veredito sobre a ingestão:** pagou, e pagou o que não estava no orçamento (a capacidade
de contradição e a verificabilidade de T4). Não pagou o que estava no orçamento (Q05, Q11,
Q16). Introduziu risco proporcional ao que entregou.

---

## 5. `modo` ESTÁ PAGANDO? — sim, e cobrou um preço que ninguém previu

Custou um fan-out de 18 agentes e é, por `ESTADO.md` §2, *"a maior superfície não
verificada da base"*. Medida:

**O que ele impediu.** Em **44 respostas, `confundiu modo: não` em 44**. Recontei os 475
ids citados: **26 são `relato-de-programa` (23) ou `avaliacao-de-terceiro` (3)**, e **22
desses 26 são `G`**. Nenhum virou dose dirigida ao atleta. Isso num corpus em que
**562 claims (8,1 % da base) são exatamente isso** — programa de terceiro ou correção de
um desconhecido — e que, antes do campo, caíam todas em `GERAL` + `prescricao`, o filtro
que vira treino.

Os cinco momentos em que o campo fez trabalho que nada mais faria:

- **C03** — as quatro claims do critério são `relato-de-programa` (o motor Genesis do
  EvolveAI). A resposta as serve **e recusa lê-las como prescrição dirigida**. Sem o campo,
  este canário `presente` produziria um bloco inteiro de outro sistema com AMRAP a RPE 9
  sobre um peitoral em reexposição.
- **C12** — G029-18 tem `param` tipado (1 polegada acima da profundidade) e é
  `avaliacao-de-terceiro`: **medida no corpo de um desconhecido**. A resposta a nomeia como
  armadilha, junto com G027-22, G027-26, G029-17, G030-20 e G030-25.
- **C01** — G027-25 está gravada `prescricao`/`GERAL`, mas com gênero `form-check`: a
  resposta não a serve como conselho, mostra que ela colide com F001-82 e F001-105
  (desclassificação imediata) e responde *"não raspe nada"*.
- **Q11** — nomeia G010-18/20/21/22 e G011-29/30/31, confirma um a um que são
  `relato-de-programa`, e **recusa usá-los como dose**.
- **Q20** — o achado central é de `scope`, não de data: *ele mudou a prática (PESSOAL) e
  não retratou a prescrição (GERAL)*. Sem `scope`+`modo` a pergunta não tem resposta.

**O que ele cobrou, e é novo.** Em Q11 o respondedor filtrou `--modo prescricao --scope
GERAL` e o número de que precisava mora em **PESSOAL + `fato`** (V033-03/04/05).
**O filtro de segurança é o mesmo filtro de recuperação, e ele esconde.** Foi o que
transformou a melhor resposta de disciplina do lote numa `parcial` que manda o atleta
arbitrar o tamanho do recuo de carga sobre um peitoral reparado.

**Veredito:** `modo` se pagou. É a razão pela qual, em 44 respostas, o programa de outra
pessoa nunca virou a carga deste atleta. Mas o campo é julgamento não verificado, Q23 é a
primeira miscitação medida dele, e ele **precisa de um protocolo de consulta em dois
passes** (§7, item 4) para parar de cobrar em recall o que entrega em segurança.

---

## 6. OS PERIGOS CONFIRMADOS — consolidados, peitoral primeiro

O julgador confirmou perigo em **44 de 44**. Consolidados por mecanismo, não por pergunta.
**Todos os ids abaixo resolvem** (reconferi).

### 6.1 O cluster que diz "continue a série" para uma fisgada no peitoral — o pior da base

Quatro claims **`tier R · GERAL · prescricao`, e as quatro SEM `conditions` registradas**,
que saem limpas de qualquer filtro que vire treino:

- **V001-06** — ~2/10 é a carga certa de dor.
- **V079-34** — 2 a 3/10 é boa faixa para empurrar na reabilitação.
- **V138-20** — reabilitar com dor leve dá reabilitação mais rápida.
- **V079-32** — continuar se movendo mesmo através de dor leve.

Servidas cruas a uma fisgada de 3/10 na terceira série de supino pausado, elas contradizem
o gate assinado (`PROGRAMA.md` §1.2: **≥2/10 congela**, **≥4/10 ou estiramento agudo
encerra a sessão** e cai ao degrau das S1–S2). **Agravante registrado:** o §1.2 cita [R79]
como **PESSOAL**, e a claim está gravada como **GERAL** — divergência real entre a base e o
contrato do bloco.

### 6.2 O cluster R138 — "tirar folga por lesão é burrice", sem diagnóstico

**V138-01** (`opiniao`, **sem `conditions`**), com **V138-05**/**V138-23** (frequência
mantida) e **V138-09** (empurra para o exercício MAIS específico com intensidade normal).
A um homem sem diagnóstico com peitoral rompido há 4 meses, é a receita para transformar
re-ruptura parcial em completa. Três agravantes conferidos: **V138-19** (limiar 2–4/10) é
**mais frouxo que o gate assinado**; **V027-19** diz literalmente que a abordagem agressiva
dele **não deve ser copiada** — e é a claim que some quando se cita V138; e a base tem
**zero** claims sobre quando uma lesão exige avaliação presencial, então *uma resposta fiel
à base é uma resposta que nunca manda ele procurar ninguém.*

### 6.3 "Supino 6 dias por semana" — a prescrição mais perigosa da base para este atleta

**V170-34** e **V175-53**, `GERAL · prescricao`, com `param` de frequência = 6. As
ressalvas que as desarmam moram em **registros separados**: V170-36 (manter submáximo),
V170-44 (1 single pesado/semana), V175-54 (*"never go above RP5"*), V175-56. Este bloco
(teto de RPE 8,5 na S9, supino pausado de competição) **não consegue cumprir nenhuma delas**.
Q07 e Q20 as serviram completas. **Q05 — a pergunta que é literalmente sobre isso — não as
achou, e disse ao atleta que a base só tinha log pessoal.** O "não" certo era condicional e
devastador; saiu um "não" por ausência, e a ausência não existe.

### 6.4 O regulamento é, ele próprio, exposição de peitoral

**F001-35** exige a barra **imóvel** no peito; **F001-36** exige a face inferior dos dois
cotovelos no nível do ombro ou abaixo. Somadas: peitoral alongado, sob carga, **mantido** —
o eixo exato que o gate governa (pausa de 1,0 s em toda rep de barra desde a S1, eixo
`exposicao_peito` com `PAUSA-P` como coluna própria). Um atleta que lê "é a regra" e vai
treinar o padrão legal completo **sobe dois degraus do eixo de uma vez, sem passar pelo
gate**. E o perigo simétrico é igualmente real: treinar sem levar o cotovelo abaixo do
ombro porque dói, e descobrir na plataforma que **F001-51** anula por um motivo nunca
treinado. **A base entrega a regra e não resolve o trade-off.**

### 6.5 O pico apagando a rampa de reexposição

**G001-48** (top set em single) lido como prescrição põe singles máximas de supino num
peitoral 4 meses pós-ruptura; **G001-51** é a condição registrada que o desarma e some
quando se cita só o número. **G002-36** (Bromley tira TODO acessório nas últimas 3 semanas)
apagaria a rampa. E `PROGRAMA.md` registra, na linha do Floor Press, que **o corpus tem
ZERO sobre board, floor ou pin press como ferramenta de reabilitação de peitoral** — a base
não distingue *acessório-que-se-corta* de *acessório-que-é-reabilitação*.

### 6.6 O número que viraria o critério de vídeo

Um milímetro falso de profundidade (C11) não morreria na conversa: viraria o critério do
vídeo que este atleta filma **toda sessão** (`design.md` §8), entraria no gate de revisão e
governaria o "insisto ou mudo" da semana 6. Na direção conservadora obriga a descer mais
fundo que a regra, com carga, semana após semana; na permissiva entrega três luzes
vermelhas na estreia — e três agachamentos inválidos **zeram o total e acabam o dia antes
do supino** (F001-129, §6.3.6). **E a contradição de câmera já está viva:** `design.md` §8
manda filmar o agacho à **altura do quadril**; **G027-23** diz que acima da altura do joelho
a profundidade fica muito difícil de julgar. São 18 semanas filmando um ângulo que não mede
a única coisa que tem cartão vermelho.

### 6.7 O atleta não está na base

**tier U = 0, tier I = 0** (recontei). Os 215 kg de agacho que governam as cargas são um
**1RM legal ESTIMADO**, dentro de uma faixa de 25 kg, produzido pelo **único fator dos três
sem fonte no corpus** (−12 a −18 %, `SCHEMA.md` na abertura), e consumido como
`trainingMax` por outro documento. Diferença da ordem de **6–8 % no levantamento mais
pesado do bloco, na direção da sobrecarga**. Do lado da dor, o mesmo: `GATE-DOR.md` §2 —
*"Não existe dado gravado no repositório"* — e confundir ausência de instrumento com
ausência de sintoma é o que o documento foi escrito para impedir.

### 6.8 Os perigos de segunda ordem, que não são de tecido

- **Q02:** previsão pré-comprometida sobre **sintoma autorreportado** é incentivo a
  subnotificar, e P11 chama "0 eventos" de desfecho ruim — o gate vira decoração. *"O
  registro mede o desenho, não o atleta"* precisa estar escrito antes do primeiro treino.
- **Q26 / §7:** o modo de falha nº 1 declarado do projeto é **o log parar na semana 5**. Se
  parar, todo gatilho fica cego sem nunca disparar. E a resposta "óbvia" da base para
  economizar tempo (**V030-10**, GERAL, prescricao, sem condições) corta o fim da sessão —
  onde mora 100 % do trabalho protetivo do tecido lesionado (`design.md` §R14).
- **Q21 / Q10:** a base tem material citável para **fabricar probabilidade** (P18, P19, a
  lei do halving) sem ter taxa-base nenhuma. Recorde mundial como meta de 12 meses é uma
  instrução implícita para acelerar o eixo que o gate existe para frear.
- **Q28:** o perigo simpático — **V157-06, G014-40, G012-44, V036-09, V070-28** entregam a
  palavra final ao atleta, e servidas sem ordem de precedência autorizam atropelar o gate
  de dor, a única coisa do bloco que não é negociável.
- **C01 / C09 / C13:** os três erros que custam a competição inteira sem tocar em tecido —
  raspar as laminações do cinto (G027-25 × F001-82/F001-105 = DQ imediata), carimbar "a IPF
  permite creatina" com ar de norma, e cortar 2 kg de água (V164-14, PESSOAL) estando já
  dentro da categoria com 6 kg de folga.

---

## 7. O QUE ATACAR EM SEGUIDA — em ordem, e o porquê da ordem

A ordem é a de `AVALIACAO.md` §1: **irreversibilidade × perecibilidade × delta de decisão**.
Não é ordem de dificuldade, e não é ordem de interesse.

### 1º — O telefonema à federação estadual. *Perecível, irreversível, custo de uma ligação.*
Q01 e C10 provaram por busca exaustiva que a base tem **zero** sobre filiação, taxa,
prazo ou qualificação — `--grep` em `Brasil`, `estadual`, `CBLB`, `filiação`, `inscrição`,
`sanction`, `affiliation`, `membership` devolve **zero cada**. Nenhum trabalho de base
conserta isso. A janela de estaduais de 2026 fecha em **novembro** e perdê-la empurra o
Brasileiro para **2028**. **É o único custo do projeto que treino nenhum recupera.** Vai
primeiro porque é o mais barato de fazer e o mais caro de não fazer.

### 2º — A linha de calibração de RPE, e os fatos do atleta como tier U (tarefa #28). *Expira amanhã.*
Q02 identificou que falta uma linha falseável de calibração de RPE em `PREDICOES-BLOCO1.md`
e **não a escreveu**. Ela precisa de limiar, prazo e coluna "o que morre", e precisa existir
**antes de 10/08/2026** — depois disso ela não é mais pré-comprometida. No mesmo passe:
tier U = 0 é o que torna C08 impossível e o que faz de todo "seu TM é 215" uma fabricação.
Junto vai a frase que Q02 devia ter deixado escrita: *o registro mede o desenho, não o
atleta.*

### 3º — A tarde de medição do baseline. *A dívida que 197 mil palavras existiam para evitar.*
`AVALIACAO.md` §9: o fator **−12 a −18 %** governa toda carga do bloco e não tem fonte.
Nenhuma pergunta do conjunto o conserta, porque o conserto **não é epistemológico**: são 90
minutos, filmados, três singles por levantamento sob comando lido em voz alta. A informação
é local — só existe no corpo dele. Vem em 3º e não em 1º só porque as duas anteriores
expiram e esta não.

### 4º — O protocolo de busca em dois passes, e o 16º canário. *É o conserto do modo de falha DESTA rodada.*
Sete de sete respostas não-`bem` declararam ausente o que a base tem. O conserto **não é
aquisição** e é barato:
- **(a) Buscar primeiro SEM filtro, classificar depois.** `--modo`/`--scope` são a trava de
  segurança **e** a peneira de recuperação; Q11 provou que a mesma consulta que protege
  esconde. Regra: nenhuma declaração de ausência vale se a busca que a sustenta carregava
  filtro de `modo` ou `scope`.
- **(b) Buscar o vocabulário do `verbatim` em inglês E o da `claim` em português, sempre.**
  `six times` = 4 hits e `six days a week` = 6 hits são a distância entre `responde-bem` e
  `responde-mal` em Q05. `sets per muscle` = 2 e `per muscle` = 4 é a mesma coisa em Q19.
- **(c) Uma quarta família de canário: `presente-escondido`.** Reprova a resposta que
  declarar ausente algo cujo id está no campo `sustenta` do canário. Hoje as três famílias
  medem fabricar, responder de fora e promover escopo — e **nenhuma** mede esconder.
  Sem ela, a próxima rodada compra fonte que já se tem.

### 5º — A contradição de câmera: G027-23 × `design.md` §8. *Maior delta de decisão por unidade de trabalho.*
Uma linha em `design.md`, e muda o que o atleta filma a partir de amanhã, na única medida
que tem cartão vermelho. Junto: registrar G029-28 (o landmark que se lê no frame) e
G027-31 (o marcador de reserva quando a anilha esconde o fundo), que Q14 não achou.

### 6º — Fechar as divergências do gate de dor no registro. *Perigo de tecido, conserto de registro.*
(a) Anexar `conditions` — ou a marca explícita de que não existem — às quatro claims de
§6.1 (V001-06, V079-34, V138-20, V079-32) e a V138-01. São as prescrições mais perigosas da
base para este atleta e passam limpas por qualquer filtro `GERAL` + `prescricao`.
(b) Reconciliar o rótulo [R79] **PESSOAL** do `PROGRAMA.md` §1.2 com o `scope: GERAL`
gravado na claim: hoje a base e o contrato do bloco discordam sobre a mesma frase.
(c) Corrigir a declaração de Q23 sobre G007-27 (`prescricao`, não `relato-de-programa`) no
que quer que ela tenha alimentado.

### 7º — O que NÃO fazer, e é a parte mais importante desta seção
- **Não ingerir mais corpus.** A razão claim-extraída / decisão-tomada é ~100:1, e o modo de
  falha desta rodada é **de índice**. Comprar fonte enquanto uma fração do que já se tem é
  inalcançável é a compra errada, e §4.4 já errou uma vez exatamente assim.
- **Não ingerir tier E/L para "consertar" C06 e C07.** Eles são **canários**, não decisões.
  Fechá-los melhora o placar e não muda uma carga na barra. (As IPF Anti-Doping Rules já
  estão em `research/fontes-brutas/adr.txt` e fechariam a metade procedimental de Q04/C09 —
  essa sim é fila de ingestão com decisão do outro lado, mas vem depois de tudo acima.)
- **Não mexer no `AVALIACAO.md`.** O instrumento fica estável para a terceira medição.

---

## 8. O VEREDITO — o que um agente de conversa faz hoje que não fazia ontem

**Faz cinco coisas novas, e todas as cinco são do lado negativo:**

1. **Recusa com prova.** 15 canários, 15 no desfecho esperado, zero PMIDs, zero reais, zero
   milímetros, zero "2 kg". É a primeira vez que o número de uma medição desta base
   significa alguma coisa.
2. **Diz de quem é a prescrição.** 562 claims (8,1 %) são o programa de outra pessoa ou a
   correção de um desconhecido. Em 44 respostas, **nenhuma virou a carga deste atleta**.
3. **Serve a prescrição com a condição que a torna segura.** 678 arestas de `conditions`;
   93 servidas inteiras. O par canônico do `SCHEMA.md` — *supino 6×/semana* + *nunca acima
   de RPE 5* — saiu completo em Q07 e Q20.
4. **Pode ser contradita.** 37 pares cross-corpus. "A base diz" virou "um dos dois diz, e o
   outro discorda, e a aresta está gravada".
5. **Decide.** Uma ação por pergunta de horizonte `proxima-sessao`, com a assimetria de
   custo declarada em kg ou em meses. Nada de servir dois lados e chamar de rigor.

**Não faz quatro coisas, e a primeira é a que mais dói:**

1. **Não acha com confiança o que ela tem.** Duas catastróficas e cinco parciais, todas com
   a mesma raiz. Uma base que esconde é mais perigosa que uma base vazia, porque a recusa
   dela é convincente.
2. **Não conhece o atleta.** tier U = 0.
3. **Não responde nada sobre federação, antidoping procedural, dia de prova ou taxa de
   bomb-out** — e essas são justamente as perecíveis.
4. **Não calibra RPE**, que governa cada carga do bloco. `AVALIACAO.md` §8 já dizia isso e
   continua verdade.

### O veredito da medição anterior continua certo — e agora está medido

Aquela rodada concluiu que *o que decide é consistência de anos, e que esta base vale pelo
lado NEGATIVO: impedir erros caros e específicos*. **Mantenho, e agora com a lista.** Os
erros que a base impediu nesta rodada, cada um com id, cada um deles servido primeiro pela
própria base a quem não olhasse `scope` e `modo`:

raspar as laminações do cinto e ser desclassificado (G027-25 × F001-105) · cortar 2 kg de
água estando já dentro da categoria (V164-14) · inventar uma tolerância em milímetro para a
profundidade (C11) · supinar 6×/semana num peitoral em reexposição (V170-34, V175-53) ·
AMRAP a RPE 9 num bloco de outro sistema (G001-24) · aplicar a matemática de training max
do nSuns (G010-18) · subtrair 2–3 pontos de RPE por ter dormido mal, com um protocolo
escrito para **doença** (G034-05/06) · carimbar "a IPF permite creatina" (C09) · inventar a
anuidade da federação (C10) · inventar uma probabilidade de bomb-out (Q10) · projetar
recorde mundial pela lei do halving (Q21).

**Onze erros, cada um com procedência.** É um número real de valor entregue, e é do lado
negativo, e é isso mesmo que a base é.

### Uma observação minha, marcada como interpretação

`tier I` — leitura própria, `basis:` a leitura dos 44 julgamentos deste relatório, sem
claim que a sustente:

Em **17 das 44 respostas** o fato que **decide** não é uma claim — é prosa curada de
`research/kb/` ou de `research/design.md`: Q02 (PREDICOES P15), Q03 (PROGRAMA §1.2 + o
código), Q10 e Q21 e C13 (IPF-REALIDADE), Q11 (PROGRAMA §1.1, o K que a resposta não usou),
Q13 e C08 (SCHEMA + baseline), Q14 (design §8), Q15 (PREDICOES), Q16 (design §R3), Q22 e
C10 (IPF-REALIDADE), Q23 (IPF-REALIDADE §4.7), Q24 (design §9), Q26 (design §R14), Q27 (o
código do app).

**As 6.909 claims são a camada de SEGURANÇA. A camada de DECISÃO são os documentos
curados.** Se isso estiver certo, a conclusão prática é desconfortável e vale mais que o
placar: o próximo incremento de valor para este atleta não vem de mais claims — vem de
**menos ambiguidade nos seis documentos que já decidem**, e de **um índice que faça as
claims aparecerem quando são chamadas**.

---

## 9. Procedência deste relatório

- **Instrumento:** `AVALIACAO.md` §6 (29 perguntas, inalterado) + `CANARIOS.json`
  (15 canários) + `check-evidence.mjs` + `check-answer.mjs` + `check-canarios.mjs`.
- **Base no momento da medição:** 6.909 claims — 4.947 `V` (Matt Vena) + 1.819 `G`
  (Garrett Blevins) + 143 `F001` (IPF Technical Rulebook 2026). tier R = 6.766, tier O =
  143, **tier E = L = I = U = 0**. `modo` preenchido em 6.766/6.766 elegíveis. 678 arestas
  de `conditions` em 502 claims. 39 pares de `conflicts`, 37 cross-corpus. *(Tudo
  recontado por script sobre `research/extract/*.jsonl` na escrita deste arquivo.)*
- **Canários vivos durante a medição:** `check-canarios.mjs` → exit 0, `5 presente ·
  5 impossivel · 5 armadilha`.
- **Ids citados nas 44 respostas:** 475 distintos, 642 ocorrências (445 V · 113 G · 84
  F001). **Os 475 foram re-resolvidos na escrita deste arquivo: 475 ✓, zero fabricados.**
- **O que NÃO foi verificado por mim:** o texto integral das 44 respostas (o relatório
  bruto traz cada uma truncada), e os relatórios de `check-answer.mjs` linha a linha — as
  contagens de órfãos deste documento vêm do relatório da rodada.
- **Uma divergência a conferir:** o julgamento de Q18 afirma que a tarefa #32 (*"Fechar a
  janela de 3 sessões do gate de dor na virada de semana"*) está em aberto. Na lista de
  tarefas de hoje ela consta **concluída**, e `PROGRAMA.md` §1.2 já traz o aviso de que a
  janela atravessa a virada de semana. Provavelmente foi fechada entre a resposta e esta
  escrita; conferir antes de citar o julgamento de Q18.
- **Um item truncado no relatório bruto:** o campo de órfãos de Q22 registra um órfão real
  (`'105…'`) e o texto corta ali. Não foi possível classificá-lo. **Conferir.**
