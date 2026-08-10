# ONDA 2C — a lista de trabalho, em ordem

**Aberta em 10/08/2026**, no fechamento da onda 2B. A ordem abaixo não é
arbitrária: **reparo vem antes de síntese.** Sintetizar sobre uma base cujas
contradições não estão ligadas e cujas banalidades não estão marcadas é
multiplicar o erro por escrito, com aparência de conclusão.

> **NÃO PROPONHA INGERIR MAIS CORPUS.** O `MEDICAO-02.md` mediu, o ataque cego de
> 10/08 remediu, o terceiro ataque cego de 12/08 confirmou, e a **auditoria cega
> de 12/08 à noite confirmou pela quarta vez, com um conjunto novo: o gargalo não
> é conteúdo.** Os **33** ids esperados pelas 12 perguntas cegas D01–D12 existem,
> estão etiquetados nas gavetas certas, e **forçando a gaveta certa sozinha 28
> deles chegam à tela** (`node research/tools/auditoria/vale-a-frota.mjs`).
> Comprar fonte contra esse sintoma é o erro mais caro que um relatório de medição
> pode induzir, e é o erro que a `MEDICAO-02` quase induziu em 4 de 7 casos.

---

## 0. O que está aberto ANTES da lista — não é mais o roteamento, e não é mais a alocação

**Atualizado em 12/08/2026 (noite) pela AUDITORIA CEGA da onda 2D, com um conjunto
cego NOVO — D01–D12. O item mudou de nome pela segunda vez, e mudou pelo número
CEGO, não pelo público.**

```
conjunto PÚBLICO (P01–P18, que o construtor enxergava)
    7 de 18 devolvem ALGUM id esperado   ·   2 de 18 devolvem TODOS
conjunto CEGO (D01–D12, escrito pela auditoria, ninguém enxergava)
    2 de 12 devolvem ALGUM id esperado   ·   0 de 12 devolvem TODOS
                                         ·   3 de 33 ids esperados (9 %)
```

Os dois saem separados a cada `node research/tools/check-canarios.mjs`. **Some-os
e você lê a média, que apaga a distância — e a distância é a única coisa que um
conjunto cego mede.** O visível está **2,3 vezes** acima do cego.

**Contra o estado de 11/08, rodado no mesmo comando**
(`node research/tools/auditoria/legado.mjs`), os mesmos doze cegos saíam de
**0 de 12 e 0 de 33 ids**. A alocação por gaveta produziu ganho real, atribuível,
e de **três ids em trinta e três**.

### 0.1 O roteamento SAI da fila — ele generalizou

A onda de 11/08 atacou roteamento e o número de roteamento melhorou de verdade,
inclusive fora do conjunto que ela viu: **em 10 dos 12 cegos a camada abriu uma
gaveta que contém a resposta.** Só B02 e B05 são falha de roteamento pura.
**Não gaste mais nada em roteamento.** O que sobra dele são dois casos escritos e
vermelhos, e eles esperam a próxima onda de vocabulário, não uma onda inteira.

### 0.2 O SOTERRAMENTO entra no lugar, com o mecanismo medido

> **REESCRITO EM 12/08 (noite). A cota por gaveta foi CONSTRUÍDA e o soterramento
> SUBIU de 10 para 11 de 12.** O diagnóstico abaixo estava certo sobre a causa e
> errado sobre a suficiência do conserto. As duas partes novas estão em **0.2-bis**
> (a alocação é soma zero) e em **0.2-ter** (o soterramento que sobrou é dentro da
> gaveta certa, e é ORDENAÇÃO). O texto original fica porque é o que justificou a
> onda 2D, e apagá-lo apagaria a razão de a onda ter existido.

**Em 10 de 12 cegos a gaveta certa abriu e a resposta não apareceu.** A causa não
é mistério e não precisa de investigação nova: **as 40 vagas da tela são
preenchidas pelo ranking global, então cada gaveta leva vagas na proporção do
próprio tamanho.** Medido, `gaveta(tamanho):vagas`:

| caso | as vagas | onde a resposta mora |
|---|---|---|
| B07 | `competicao(457):36`  `equipamento(199):4` | `equipamento` — é a proibição que desclassifica na inspeção |
| B11 | `supino(694):26`  `agacho(990):24`  `ordem-exercicio(29):1` | `ordem-exercicio`, as **duas** claims |
| B12 | `agacho(990):39` | `sapato`, 18 claims |
| B10 | `progressao(741):36` | `genetica`, 45 claims |
| fisgada | `supino(694):33`  `dor(119):5` | `dor`, as **cinco** claims do limiar |

**O conserto tem nome:** uma gaveta roteada acima do piso precisa de **vagas
garantidas independentes do tamanho dela**, e o bloco de detalhe das 8 primeiras
precisa reservar espaço para a gaveta **menor**, não para a maior. É a divergência
§8.39 do RUNBOOK. Enquanto ela não for feita, qualquer conserto de roteamento
entrega zero ao atleta — e entregou.

**O que se ganha, em uma frase:** hoje o atleta com histórico de peitoral pergunta
sobre uma fisgada, a gaveta `dor` ABRE, e das cinco claims que carregam o limiar
uma sai em 36º e as outras quatro não saem. Com cota por gaveta, saem as cinco.

**E saíram: a fisgada entrega as CINCO sem `--topic`** (13/18/36/38/39), medido
duas vezes. Essa parte da previsão se cumpriu inteira. A outra não.

### 0.2-bis A ALOCAÇÃO É SOMA ZERO — e é por isso que o soterramento subiu

A cota por gaveta foi construída e o soterramento foi de 10 para **11 de 12**.
Em nove casos a gaveta com a resposta ABRIU e nenhum id chegou; só D11 é
roteamento puro. O mecanismo novo, medido com
`node research/tools/auditoria/diagnostico.mjs`:

| caso | forçando a gaveta certa SOZINHA | forçando ela MAIS as vizinhas |
|---|---|---|
| D05 | `--topic convencional` → **os 3** | `--topic convencional sumo terra` → **ZERO** |
| D06 | `--topic comandos-ipf` → **F001-11** | `--topic comandos-ipf agacho` → **ZERO** |

**Abrir a gaveta certa mais uma vizinha é pior do que abrir só a certa.** A vaga é
TETO e a sobra não volta ao bolo, então cada gaveta a mais divide o orçamento e
nenhuma recebe o suficiente. O roteador melhorou, passou a abrir MAIS gavetas
certas, e abrir mais gavetas certas piorou a resposta. **Nenhum dos 20 casos de
`alocacao.test.mjs` cobre isso**, porque todos medem uma pergunta contra a
alocação que ela produz, e nunca a mesma pergunta com N e com N+1 gavetas.
Divergência §8.48 do RUNBOOK — **é o item 0 da fila agora, junto com o 0.2-ter.**

### 0.2-ter O QUE SOBROU DO SOTERRAMENTO É ORDENAÇÃO DENTRO DA GAVETA

`node research/tools/auditoria/vale-a-frota.mjs` força, uma de cada vez, cada
gaveta que etiqueta algum id esperado:

```
ids esperados pelas 12 perguntas cegas ........................ 33
ids que chegam HOJE, sem --topic .............................. 3
ids que chegam FORÇANDO a gaveta certa sozinha ................ 28   (85 %)
perguntas COMPLETAS forçando a gaveta certa sozinha ........... 9 de 12
```

**28 de 33 estão a uma VAGA de distância.** Os **5 de 33** que não chegam nem
assim estão soterrados DENTRO da gaveta certa: V008-10 (D03), V001-21 e V001-22
(D09), V001-24 e V001-25 (D10).

**O D09 é o caso puro e o mais caro depois da fisgada:** abre UMA gaveta, a certa
(`dor`, 119 claims), a tela sai com **35 das 40 vagas ocupadas** — sobra espaço —
e as duas claims não aparecem nem forçando `dor`, nem forçando `lesao`. A
pergunta é *"a ressonância apontou uma alteração no tendão, isso explica o
incômodo"*, e a base responde com número: **96 % dos ombros assintomáticos têm
anormalidade de imagem**. Divergência §8.50.

### 0.3 A decisão que o atleta pediu: a frota de modelo barato

Ele perguntou se vale pagar uma frota de modelo barato para dar a cada uma das
**6.912** claims uma linha de *"que pergunta esta claim responde"*.

> **A RESPOSTA É NÃO, e o número que a decide é 28 contra 5.**
>
> `node research/tools/auditoria/vale-a-frota.mjs`

**Por que esse é o número certo, e não outro.** Uma linha por claim conserta
**uma** coisa: a ordem DENTRO da gaveta. Ela não muda quais gavetas abrem nem
quantas vagas cada uma leva — isso é `vagasPorGaveta` em `roteador.mjs`, é código
determinístico e não custa nada. Então o teste é decidível sem gastar um centavo:
forçar a gaveta certa sozinha e ver se o id chega.

- **28 de 33 ids (85 %) chegam.** Para esses, a claim JÁ está bem ordenada dentro
  da gaveta dela e o que faltou foi vaga. **A linha por claim não compra nada
  aqui** — ela reordena um conjunto que já está na ordem certa.
- **5 de 33 ids (15 %) não chegam.** Só esses são hipótese para a frota.

**A conta da compra, se ela for feita mesmo assim.** As gavetas que tocam esses
cinco ids somam **1.431 claims (20,7 % da base)**; a compra mínima — a gaveta mais
barata que cobre cada id, `dor` + `lesao` + `sono` — é **471 claims (6,8 %)**.
**Em nenhum cenário a compra é 6.912.** Pagar a base inteira para alcançar 15 %
dos ids é comprar 100 % de um artefato para usar 7 % dele.

**O que fazer com o dinheiro, em ordem, e o teste que falsifica isto por 1,7 % do
custo:**

1. **Nada de frota agora.** O item 0 é §8.48 (a alocação soma zero) e §8.50
   (ordenação dentro da gaveta), e os dois são código determinístico. O princípio
   desta casa vale aqui inteiro: **onde um compilador pode verificar, agente não
   deve.** Ordenar dentro de uma gaveta é ranqueamento, e ranqueamento se conserta
   com função e canário, não com julgamento comprado.
2. **Se, depois de consertados os dois, os 5 continuarem fora: compre UMA gaveta.**
   `dor`, 119 claims, **1,7 % da base**, que cobre V001-21 e V001-22 e é a gaveta
   que mais custa a este atleta. Re-meça D09 e D10. **Se os ids não se moverem, o
   defeito não é vocabulário e as 6.912 teriam sido queimadas** — e isso terá
   custado 1,7 % de descobrir.
3. **Só então, e só com o número na mão, discutir a base inteira.**

**O custo que continua não sendo dinheiro.** Em dólares a base inteira é de um
dígito. O custo é que o artefato gerado **não tem trava**, e a §8.43 mostrou o que
acontece com artefato de julgamento sem trava: 26 das 74 gavetas do glossário
podiam virar lixo com os três gates verdes. Uma linha por claim escrita por frota
exigiria a mesma calibração de dois agentes independentes que o item 1 exige — e,
pela §8.58, a trava que se conseguiria escrever recusaria lixo, não recusaria uma
linha REAL porém errada para aquela claim.

**O que mudou desde a versão anterior desta seção, e por que a resposta continua
"não" com razão diferente.** Em 12/08 de manhã a resposta era *"não AGORA, porque
falta vaga"*. A vaga foi construída. Hoje a resposta é *"não, porque 85 % dos ids
nunca precisaram disso"* — e a fração que precisa está medida, nomeada por id, e
cabe em três gavetas.

### 0.4 A regra que esta onda comprou caro

**Conjunto de teste publicado vira conjunto de treino.** Os P01–P18 foram escritos
às cegas em 10/08 e em 12/08 já estavam absorvidos: das 8 públicas que passam,
só **2** sobrevivem a uma paráfrase leve, e a pergunta-vitrine da onda colapsa ao
trocar *"coração"* por *"cardiovascular"*. Os B01–B12 estão publicados agora e
estão igualmente queimados. **A próxima onda de recuperação precisa de um conjunto
cego NOVO, escrito por quem não viu a ferramenta nem o `CANARIOS.json`, ANTES de
qualquer conserto.** Sem isso o placar seguinte mede o conserto de quem o
escreveu — o modo de falha nº 5, que já apareceu cinco vezes nesta casa.

**ATUALIZADO EM 12/08 (noite): os D01–D12 também já estão queimados.** Eles
entraram no `CANARIOS.json` neste commit, com o resultado medido ao lado — inclusive
nos dez que falham —, e é por isso que entraram: se não entrassem, a onda seguinte
voltaria a medir com B01–B12, que já foram vistos, **e o número cego viraria
otimização do visível outra vez**. A regra agora tem duas confirmações
independentes e não é mais hipótese.

**E a paráfrase deixou de ser suspeita e virou medida** (§8.56): a fisgada entrega
5 de 5 com a frase escrita e **3 de 5** sob paráfrase sem jargão, enquanto D05 e
D08 MELHORAM sob paráfrase porque a paráfrase usou a jargona da gaveta. **A camada
acha quando o atleta já sabe o vocabulário.** O conjunto cego novo precisa ser
escrito por quem não leu o `GLOSSARIO-TOPICOS.json` — não basta não ter lido o
`CANARIOS.json`.

**A regra de trabalho, e ela vale para os cinco itens abaixo também:** escreva o
canário do caso ANTES de tocar em código.

### 0.5 A fila do item 0, em ordem, depois da auditoria de 12/08

1. **§8.48 — a alocação é soma zero.** Canário COMPARATIVO (a mesma pergunta com N
   e com N+1 gavetas forçadas), depois o conserto. É o único defeito que a onda 2D
   INTRODUZIU, e o único cujo canário ainda não existe.
2. **§8.50 — ordenação dentro da gaveta.** 5 de 33 ids, nomeados, com D09 como caso
   puro. É o que sobra do soterramento depois de a vaga existir.
3. **§8.49 — reescolher `PISO_VAGAS`,** com o conjunto cego novo na mão e não antes:
   mexer nele reescreve o registro medido dos 42 canários da porta nova.
4. **§8.57 — os buracos de "não sei" sobre fato literal** (F001-130, F001-119). São
   perguntas de semana de competição e a resposta está tipada em `params`.

---

## 1. Triagem de banalidade (tarefa #34)

**O problema.** A base tem 6.912 claims e uma fração delas não muda decisão
nenhuma — *"consistência importa"*, *"aquecer é bom"*. Elas não são falsas; são
inertes. Numa tela de 40, cada banalidade servida ocupa a vaga de uma claim que
mudaria o treino da semana, e é por isso que isto vem antes da síntese.

**Como se faz, e a parte que não é negociável.** Marcar banalidade é
**julgamento**, e julgamento de um agente só entra na base com concordância
medida:

- amostra de **150 claims**, sorteada e fixa, gravada em arquivo;
- **dois agentes** classificam a MESMA amostra, sem ver a classificação do outro;
- corte em **85 % de concordância**. Abaixo disso o critério não está escrito com
  clareza suficiente para virar dado — reescreva o critério e recalibre, não
  negocie o número;
- só depois de passar o corte, o passe roda na base inteira.

**O que NÃO fazer:** não apagar claim banal. Marcar é reversível e auditável;
apagar destrói a única cópia. O campo entra como marca no registro, e o efeito é
de **ordenação** — a banal desce, não some.

---

## 2. Fatos do atleta como tier `U` (tarefa #28)

Hoje o que se sabe do atleta vive em prosa espalhada. Como `tier: U`, com
`source.date` em ISO (o `check-claims.mjs` já exige), esses fatos passam a ser
citáveis, conferíveis e datáveis como qualquer outra claim — e o gate de dor e o
briefing semanal deixam de depender de alguém lembrar.

**Entram:** natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu, histórico
de lesão de peitoral, bloco atual de reexposição gradual do supino, agacho 250 /
supino 170 / terra sumo 268 (treino).

**FICA DE FORA: a calibração de RPE.** Ele **não vai treinar esta semana**, e um
número de RPE registrado como fato do atleta sem a sessão que o produziu é
exatamente o tipo de dado que envelhece sem ninguém notar. Entra quando houver
sessão.

---

## 3. Whisper nos 53 `suspect` (tarefa #31, §8.8 do RUNBOOK)

São **53 claims com `suspect: true` e sem `suspectWhy`** — o passe de Whisper
recebe a janela sem saber se procura número ou negação. A catraca
(`TETO_SEM_SUSPECT_WHY = 53`) impede a dívida de crescer; ela não a paga.

Ferramentas prontas: `list-suspects.mjs` → `verify-suspects.mjs` →
`whisper-window.py`. Cada janela reprocessada preenche `verbatimWhisper` ou
corrige o número, e **a catraca desce junto** — se o número da constante não
descer no mesmo passe, o passe não aconteceu.

---

## 4. Ledger de contradições (tarefa #25)

A base tem **37 claims com `conflicts`, 48 arestas**, recontadas por comando (o
comando está no `DOR-E-TREINO.md` §10 e é autoridade sobre a prosa). Delas,
**8 são de mão dupla e 40 de mão única**, e nada diz qual é a certa — `SCHEMA.md`
só diz *"vira aresta no ledger"*. É a divergência §8.30 do RUNBOOK, e ela apodrece
do lado perigoso: apagar `conflicts` de `V027-25` deixa `check:kb` em exit 0 e a
claim volta a sair sem a marca `conflita`, enquanto três outras continuam
apontando para ela.

**Fazer nesta ordem:** decidir a direção (proposta: **mão dupla obrigatória**, com
a trava no compilador), rodar o reparo, e só então montar o ledger. Direção
decidida depois do ledger é ledger para refazer.

---

## 5. Sínteses temáticas e o INDEX (tarefa #26)

`research/synth/` e `research/kb/topics/*.md` estão descritos no `SCHEMA.md` como
*"geradas, não editar"*, **não existem e não têm gerador** (RUNBOOK §8.9).

**É o último item da fila de propósito.** Uma síntese escrita antes de #1 herda as
banalidades, e escrita antes de #4 escolhe um lado de uma contradição sem saber
que ela existe. Toda síntese carrega `basis` com os ids que a sustentam — sem isso
ela é prosa nova sem fonte, que é o que esta base inteira existe para não ser.

---

## O que esta onda NÃO faz

- **Não ingere corpus.** Ver o aviso do topo.
- **Não toca no `AVALIACAO.md`.** O instrumento fica estável até a terceira
  medição; mexer nele agora torna incomparáveis a MEDICAO-02 e o que vier.
- **Não aposenta canário vermelho.** P01–P18, B01–B12 e D01–D12 continuam
  registrados como falham, com o número ao lado, até alguém consertar a camada e
  reescrever o registro — e reescrever o registro é uma decisão que vai junto com o
  veredito do topo do `RECUPERACAO.md`.
- **Não mede a próxima onda com B01–B12 nem com D01–D12.** Os dois conjuntos estão
  publicados; ver §0.4.
- **Não compra a frota de modelo barato.** O número que decide está no §0.3 e diz
  não: 28 dos 33 ids nunca precisaram dela.
