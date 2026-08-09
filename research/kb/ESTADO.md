# ESTADO da base de conhecimento — 9 de agosto de 2026

> **Leia isto antes de citar qualquer número de qualidade desta base.**
>
> A medição de 9/8/2026 disse **"3 falhas em 29"** e era mentira. Dois canários provaram
> que o avaliador estava respondendo do próprio conhecimento em vez da base, e o placar
> inteiro daquela rodada virou **teto, não medida**.
>
> **Nenhum número de qualidade da base pode ser citado no futuro sem dizer com que
> instrumento foi obtido e se os canários daquele instrumento passaram.** "A base acerta
> 90 %" sem instrumento nomeado não é um resultado fraco — é um número inventado com
> aparência de resultado. Se você não consegue dizer *qual* medição, *quando* e *se os
> canários dela estavam vivos*, não escreva o número.
>
> Isto vale para este documento também. Cada número abaixo diz de onde veio.

Este arquivo é curto de propósito. O mapa do sistema está em `research/RUNBOOK.md`; o
registro está em `SCHEMA.md`; o porquê de cada gaveta está em `ENUMERADOS.md`; como a base
é medida está em `INSTRUMENTO.md`. Aqui está só: **onde a base está, o que foi provado, o
que ainda está errado, e o que atacar primeiro.**

---

## 1. O que a base sabe fazer hoje que não sabia ontem

**Ontem ela tinha uma fonte e um campo de escopo. Hoje ela tem três fontes, um campo de
tipo de afirmação, e a aresta que impede prescrição perigosa.**

**Distinguir de quem é a prescrição.** `scope` separava "para você" de "para mim" e parava
aí — e metade do corpus do Blevins é ele expondo o programa dos outros (5/3/1, nSuns,
PHUL, GZCLP, Cube, Texas Method, Greyskull, Madcow, Ph3, Genesis) ou corrigindo um
desconhecido a partir do vídeo enviado. As duas coisas caíam em `GERAL` + `prescricao`,
que é o filtro que vira treino: *"o nSuns manda AMRAP a 95 % do training max"* com a mesma
autoridade de *"faça AMRAP a 95 % do training max"*. Hoje `modo` está preenchido em
**6.766 de 6.766** claims elegíveis (as 143 `tier: O` são isentas por regra), com **447
`relato-de-programa`** e **115 `avaliacao-de-terceiro`** que antes eram zero.

**Reunir a prescrição com a condição que a torna segura.** O achado mais grave da auditoria
de escopo era que *"supino 6× por semana"* e *"nunca acima de RPE 5"* moravam em registros
diferentes sem como se reencontrar. Separada da condição, a prescrição não fica incompleta
— fica **perigosa, porque parece completa**. Hoje há **678 arestas de `conditions` em 502
claims**, e o caso que o `SCHEMA.md` nomeia como razão de existir do campo está resolvido:
`V092-01` e `V020-22` estão condicionados, e `V092-01` ganhou no fechamento a ressalva que
mais importa para este atleta — **a variação de padrão de movimento** (`V092-19/20/21`),
que o próprio vídeo introduz como resposta ao medo de lesão por overuse na alta frequência.

**Segunda fonte que compete testado.** 1.819 claims do Garrett Blevins (`G###`), que é o
que a base não tinha: o Vena não compete testado. Mais 143 claims `tier: O` do regulamento
IPF 2026, com o discriminador `kind: 'normativo'` em `sources.mjs` para que fonte sem canal
não finja ter `channelId`.

**Medir a si mesma.** `check-answer.mjs` acusa todo número de uma resposta que não aparece
em nada que ela cita; `CANARIOS.json` + `check-canarios.mjs` medem o **julgador**, com 15
perguntas de desfecho conhecido por contagem. Tudo dentro do `npm run build`, então
**canário morto quebra o build**.

**Um lote inteiro que tinha sumido.** 278 claims do Vena (R012, R030, R048, R066, R084,
R102, R120, R138, R156, R174 — a fatia do agente nº 12 dos 18, progressão aritmética de
passo 18) nunca foram tocadas pelo fan-out e ficaram invisíveis a todo filtro de `modo`.
Foram preenchidas no fechamento. **Quem as encontrou não foi a leitura dos 18 relatórios,
que diziam todos que estava tudo certo — foi a catraca `TETO_SEM_MODO`.**

---

## 2. O que foi PROVADO mecanicamente, e o que continua sendo julgamento

Esta separação é o produto principal deste documento. **Determinismo prova FIDELIDADE À
FONTE, não CORREÇÃO DA FONTE**, e nenhuma trava desta base prova a segunda.

### Provado por compilador — `npm run check:kb`, exit 0

| O que está provado | Como |
|---|---|
| Todo `src` existe no manifesto e não é pós-run-1 | `check-claims.mjs` |
| Todo `verbatim` de `tier: R` **existe literalmente na transcrição**, dentro de 45 s do `at` | idem — é a trava que pegou um verbatim inexistente |
| Todo número de `claim` tem `param` com `unit` **e `frame`** | idem — foi assim que 215 kg virou training max |
| Todo valor cabe na escala fechada do frame (RPE 0–10 etc.) | novo em 9/8 |
| Todo id em `basis`, `conflicts` e `conditions` resolve | idem |
| `conditions` é **assimétrica** — par mútuo é erro | novo em 9/8; 5 pares desfeitos |
| `modo`, `scope`, `certainty`, `topic`, `frame`, `suspectWhy` dentro dos enumerados fechados | `kb.mjs` é a fonte única dos seis |
| `modo` **presente** em toda claim que não seja `tier: O` | catraca `TETO_SEM_MODO`, hoje vazia |
| A numeração `[Rxxx]` não deslizou | `verify-manifest.mjs`: 6 âncoras + 258 timestamps, 0 violações no offset adotado contra 52/42/47/50 nos vizinhos |
| O compilador ainda pega o que promete | `check-claims.test.mjs`: **34 recusas + 2 sinalizações + 3 aceitações**, todas exigindo a mensagem certa |
| O gate de dor do app obedece a tabela do `PROGRAMA.md` §1.2 | `npm run check:gate`: 33 cenários pelo `buildWeekDoc` **de produção**, nos dois momentos de coleta |
| Os canários da medição continuam vivos | `check-canarios.mjs`: 5 presentes, 5 impossíveis, 5 armadilhas |

### Julgamento de agente — nenhum compilador olhou

**O valor de `modo` em 6.766 claims.** É a maior superfície não verificada da base. Cada
um dos 18 agentes declarou a própria regra de desempate, e elas **divergem**, com o
registro dizendo onde: `narrativa` × `anedota` × `fato` para material PESSOAL não tem
critério escrito em lugar nenhum, e 17 dos 18 relatórios dizem ter inventado o seu.
Auditoria por amostra estratificada (n=190, 9/8/2026): **promoção indevida a `prescricao`
em 12,6 %** — 8,2 % no Vena, 23,5 % no Blevins, e **46 % na amostra dirigida aos vídeos de
review**. Os três focos sistemáticos foram consertados no fechamento (§3), então esse
número é **anterior ao conserto e não vale mais como estimativa**; não há medição
posterior, e este documento não vai inventar uma.

**A atribuição de `relato-de-programa` e `avaliacao-de-terceiro`.** O discriminador real é
o **gênero do vídeo**, não o texto da claim — e a extração normalizou a claim para prosa
geral **antes de as gavetas existirem**. `G028-02` é *"Manter a cabeça em posição mais
neutra e para cima no agachamento"*: indistinguível de prescrição geral para quem lê o
JSONL, que é o que o agente lê. Medido pela auditoria de escopo (9/8/2026, antes do
conserto): nos 20 vídeos de review do Blevins, **82 %** das claims então em `prescricao`
não nomeavam o programa no texto; nos 5 de form check, **90 %** não tinham marcador de
pessoa específica.

Estado depois do conserto, contado agora: `G001–G020` (review) têm 938 claims, **427 em
`relato-de-programa`** e 94 ainda em `prescricao`; `G027–G031` (form check) têm 204,
**114 em `avaliacao-de-terceiro`** e 18 em `prescricao`. Os restos são defensáveis — são
conselho do próprio Blevins sobre adotar um programa alheio, ou padrão técnico universal —
**mas onde exatamente a linha foi traçada é decisão de agente, e 18 agentes traçaram 18
linhas.** Cada um que acertou, acertou abrindo o manifesto do canal à mão. Ver §5.1.

**Se a ressalva do Vena está certa.** As 678 arestas de `conditions` apontam para claims
que existem e estão perto no tempo. Isso é tudo o que o compilador pode dizer. Se a
condição de fato limita, e se a lista de condições está completa, **é leitura**. A
auditoria de `conditions` (n=100, estratificada) mediu ~10 % de aresta falsa, com 42 % nas
cross-vídeo contra 9 % dentro do mesmo vídeo. As falsas nomeadas foram desfeitas; restam
**7 arestas cross-vídeo** na base, todas listadas em §3.

**Se a base está certa sobre treinar.** Nada aqui prova isso, e nada aqui pode. O Vena e o
Blevins podem estar errados; a base garante que estamos citando o que eles disseram, na
forma em que disseram, com a ressalva que disseram junto.

---

## 3. O que sabidamente ainda está errado — com id e tamanho

### Consertado hoje (registrado para não voltar)

| Defeito | Tamanho | Conserto |
|---|---|---|
| Lote 12 do fan-out nunca rodou | 278 claims, 10 arquivos | preenchido; catraca zerada |
| `G001` era o único de 17 arquivos de review com zero `relato-de-programa` — a especificação do programa Genesis (creditado no vídeo a Zach Robinson e Josh Pelland) entrou como ordem do Blevins | 29 claims | → `relato-de-programa` |
| `G029`/`G030`: a correção calibrada para o corpo de um desconhecido ficou em `prescricao` enquanto a observação, no mesmo arquivo, virou `avaliacao-de-terceiro` | 10 claims | → `avaliacao-de-terceiro` |
| `scope: PESSOAL` + `modo: prescricao`, que o esquema define como excludentes | 13 claims | 10 viraram `narrativa`/`opiniao`; 3 tiveram o `scope` corrigido (`V039-26`, `V167-23`) — hoje **zero**, e virou aviso do checker |
| Arestas de `conditions` falsas, nomeadas pela auditoria | 12 arestas | removidas (`V058-21`, `V142-18`, `V061-16`, `G012-29`, `V131-10`, `G016-44`, `G020-37`, `V053-11`, `V126-07`) |
| Ciclos em `conditions` | 5 pares | desfeitos, e agora são erro de compilação |
| `V033-21`: a cauda da claim foi editada para longe do verbatim (`up in baseline` → "do que na vez anterior") | 1 claim | revertida para *"5 lb a mais na base"* |
| Canário `C07` respondível com id pelo corpus — um julgador honesto respondendo bem invalidaria a rodada inteira | 1 canário | pergunta reescrita para exigir o roster |
| `TETO_SEM_MODO` declarava 4.947 com 278 reais | 1 constante + 2 documentos | catraca em zero, docs corrigidos no mesmo passe |

### Não consertado, e por quê

**Números em gaveta errada — 25 claims, todas nomeadas abaixo.** É o bug dos gramas
gravados como `kg`, ainda vivo, agora com as gavetas certas já abertas:

- `V164-16` 8 **litros** com `frame: ml` · `V112-22` meio **litro** com `frame: kg`
- `V104-27` e `V114-17` **pés** com `frame: cm` (o frame `pes` existe desde 9/8)
- `V112-22`/`V112-23` **hora do relógio** com `frame: horas`, que é duração — e em
  `V112-23` o meio-dia virou `value: 1`, então o número nem é a hora que a claim diz
- `V013-16`, `V175-08`, `V175-40` **ano de calendário** com `frame: anos`; `V152-24` com
  `frame: contagem`. **Falta gaveta**: ano de calendário não é duração nem posição.
- `V044-07` **BRI** (índice adimensional) e `V142-08`/`V142-11` **R²** com `frame: pct`
- `V102-25` **MET-min/semana** com `frame: min` · `V169-42` **preço em USD** com
  `frame: contagem` (preço está declarado fora de escopo em `ENUMERADOS.md` §5)
- `V013-15` *"convicção 100 %"* — percentual de convicção não mede nada
- **`value` como string** em 10 claims (`V081-15`, `V001-02`, `V091-19`, `V002-19`,
  `V081-26`, `V087-18`, `V096-05`, `G019-20`, `G020-01`, `G020-41`): frações `"1/3"` e
  rótulos `"5x5"` escapam de toda aritmética do checker

Por que não consertei: cada um exige decidir se a gaveta certa já existe, se falta uma, ou
se o número devia sair da base — e ampliar enumerado no fechamento de uma rodada é
exatamente como o enumerado divergiu do documento da outra vez. É um passe próprio, curto e
com lista pronta.

**Números corrompidos por ASR, ainda circulando tipados.** `V095-18` (`agacho_antes: 45 lb`
para um contexto de 422 lb), `V117-01` e `V112-04` (supino de 45 lb onde o resto do corpus
diz 405), `V153-03` (292,5 kg gravado como 622 lb, sendo 645), `V037-06` (total de 92,5 kg),
`V175-01` (678 lb gravado como 37,5 kg), `V160-30`, `V070-26/27` (números sem unidade de
massa), `V043-27` (o áudio não resolve: `large-v3` diz 20, `turbo` diz 28). **74 claims com
`suspect: true`, 53 sem `suspectWhy`** — o passe de Whisper recebe 53 janelas sem saber se
procura número ou negação. A trava nova impede que a dívida cresça; ela não a paga.

**Uma claim que não é claim.** `V166-05` tem como conteúdo *"o número que a transcrição
registra é 45 lb, valor implausível"* — é uma nota de artefato de extração ocupando uma
gaveta de `fato`, com o número quebrado tipado num `param`.

**As 7 arestas de `conditions` que cruzam vídeo**, que é o estrato de 42 % de erro:
`V064-05→V010-04`, `V086-26→V032-07`, `V086-26→V032-08`, `V090-18→V072-22`,
`V094-01→V130-10`, `V094-01→V130-11`, `V118-08→V028-10`. Nenhuma é fabricada e todas foram
defendidas por escrito pelo agente que as criou; são 7 leituras à mão, não um passe.

**174 claims `relato-de-programa` com dose e sem `conditions`**, invisíveis ao aviso do
checker, que só olha `modo: prescricao`. `85 % do 5RM`, `+10 lb/semana`, `3 a 5 min de
descanso` ficam citáveis sem que nada reclame. **Deliberadamente não liguei o aviso**:
seriam 174 avisos que a fonte quase nunca permite resolver, e aviso impossível de zerar é
como se ensina alguém a ignorar avisos. O conserto é do lado do consumidor — quem lê a base
nunca pode tratar `relato-de-programa` como prescrição.

**O aviso de número por extenso é suprimido por qualquer `param`.** A condição no código é
*"tem número por extenso E **nenhum** param"*, então basta um param de qualquer coisa para
o aviso sumir, mesmo que o número por extenso seja outro. Medido em 9/8/2026 com método
declarado — `numerosPorExtenso(claim)`, descartando `1` (que é artigo em português), em
claims que **têm** param, exigindo que o valor não apareça em nenhum `param.value`:
**103 claims**, e nenhuma emite aviso. Exemplos: `G009-04` (*"variações de seis e de 3
dias"*), `G051-37` (*"com seis pés de altura"*) — e `G051-37` foi justamente a claim citada
para ABRIR o frame `pes`, que continua com **zero** usos na base. O "zero avisos restantes"
de um relatório anterior é artefato dessa supressão. O conserto (trocar "não tem param
nenhum" por "este extenso não bate com nenhum valor declarado") é o trabalho todo, porque a
composição — *"oitenta e um"*, *"dois vírgula cinco"*, *"treze milímetros"* onde "mil" é
falso positivo — é onde uma versão malfeita produz dezenas de avisos sem conserto.

**Buracos do gate de dor** (detalhe em `GATE-DOR.md`): a janela de "3 sessões" é truncada na
virada de semana (com supino 4×/semana, ~1 em cada 4 pares qualificados atravessa a
fronteira e o degrau nunca sai); a linha `RETORNO` é parseada, emitida e **não consumida
por código nenhum**; o parser degrada em silêncio se o número de eventos for escrito por
extenso; linha de tabela com 3 colunas é descartada sem um pio; e o gate **sinaliza, não
age**.

**Dois limites abertos do `check-answer.mjs`**, declarados no cabeçalho dele e no
`INSTRUMENTO.md` §3: a anistia de `tier I … basis:` é cega e isenta todo número numa janela
de ±200 caracteres (11 doses fabricadas passaram com `--estrito`); e citar um documento
admite o documento inteiro sem noção de localidade (`IPF-REALIDADE.md` sozinho põe 467
números na piscina).

**Buracos de infraestrutura.** `R191.jsonl` tem **0 byte** e passa em toda contagem por
nome. `R132.jsonl` pula `V132-25` e `V132-28`. `research/synth/` e `research/kb/topics/`
continuam vazios apesar de o `SCHEMA.md` os descrever. `SUSPEITOS-VERIFICADOS.md` continua
**não existindo de propósito** — gerá-lo com 11 de 148 alvos criaria um documento que
parece completo.

**Uma contradição que a base tem com o app, e que ninguém registrou como `conflicts`:**
`V138-18`/`V138-19`/`V138-20` prescrevem reabilitar **treinando com dor de 2 a 4/10**,
enquanto o gate do `PROGRAMA.md` §1.2 manda **congelar a 2/10 no peitoral**. As duas estão
certas nos seus contextos (uma é reabilitação geral, o outro é uma lesão específica com
histórico), mas a base não diz isso em lugar nenhum, e é a claim mais perigosa a circular
solta para este atleta.

---

## 4. O que a próxima rodada tem de atacar, em ordem

**1. Campo `genero` por vídeo, no manifesto.** É o maior retorno por linha de código de
tudo o que resta. Hoje `relato-de-programa` e `avaliacao-de-terceiro` dependem de o agente
lembrar de abrir o manifesto do canal, e 18 agentes traçaram 18 linhas diferentes — o que
significa que **as 562 claims nessas duas gavetas não são reproduzíveis** (447 + 115,
contado em 9/8/2026). Com
`genero: 'review-de-programa' | 'form-check' | 'vlog'` por vídeo, `check-claims.mjs` pode
**recusar** `modo: prescricao` vindo de review e de form check, e "o que revisar" vira
consulta em vez de julgamento. O sinal já existe em prosa:
`research/corpus/blevins/TRIAGEM.md` tem título e gênero por ref, e serve para semear o
campo sem reabrir vídeo nenhum. **Primeiro porque transforma julgamento em compilador, que
é o princípio da casa.**

**2. Escrever a regra de `narrativa` × `anedota` × `fato` × prática habitual — e só então
retaggear.** Não é ampliação de enumerado, é a fronteira que 17 lotes disseram ter
inventado sozinhos. Enquanto ela não estiver escrita no `PROTOCOLO-EXTRACAO.md`, qualquer
consulta que dependa desses valores está lendo três convenções misturadas. Se a decisão for
abrir `pratica-pessoal`, o material denso está em R034, R043, R106, R185 e R151.
**Segundo porque é barato, e porque é pré-requisito de qualquer medição desses campos.**

**3. Passe de gaveta errada — as 19 params de §3, com a lista pronta.** Inclui decidir duas
gavetas que faltam (`ano_calendario` e um frame adimensional para índice) e o que fazer com
`value` string. **Terceiro porque é finito, nomeado, e cada dia que fica é um dia em que um
agente pode copiar a convenção errada do vizinho** — que é o modo de falha nº 1 deste
projeto.

**4. Passe de Whisper nos 53 `suspect` sem `suspectWhy` e nos números do §3.** Caro (áudio
+ modelo), mas é o único que resolve número corrompido sem adivinhação, e a ferramenta já
existe e já teve o `CONFIRMADO` falso consertado. **Quarto porque é caro e porque o dano de
hoje é contido: os números estão marcados.**

**5. Fechar os dois limites do `check-answer.mjs`.** Ambos exigem decidir contrato — janela
por frase? um marcador por número? conferência aritmética contra a piscina do `basis`?
localidade dentro do documento citado? — e mudar o contrato muda o significado de T5 para
quem já escreve resposta. **Quinto porque é decisão de design, não de execução, e o
instrumento hoje é honesto sobre onde é cego.**

**6. O ledger de contradições e as sínteses.** 31 `conflicts` numa base de 6.909 claims com
duas fontes que discordam é subregistro quase certo, e a primeira contradição a registrar
está nomeada no fim do §3.

---

## 5. Duas coisas que não podem ser esquecidas

**5.1 — Onde um compilador pode verificar, agente não deve.** Este princípio se pagou
quatro vezes só nesta rodada: pegou um verbatim inexistente, um número sem unidade, o lote
de 278 claims que 18 relatórios diziam estar em ordem, e 5 ciclos de `conditions`. Toda vez
que este documento diz "julgamento de agente", leia como **"aqui o princípio ainda não foi
aplicado"** — não como "aqui ele não se aplica".

**5.2 — Número de qualidade sem instrumento é opinião com cara de medida.** Está no topo
deste arquivo, está no §6 do `RUNBOOK.md` e está no `INSTRUMENTO.md`, em três lugares de
propósito. A medição que mentiu não mentiu por descuido: ela produziu um número plausível,
bem formatado, e só dois canários impediram que ele virasse fato citável. **O placar de uma
rodada cujos canários não passaram é teto, não medida — e teto não se cita como resultado.**
