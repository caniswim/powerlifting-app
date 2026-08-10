# ONDA 2C — a lista de trabalho, em ordem

**Aberta em 10/08/2026**, no fechamento da onda 2B. A ordem abaixo não é
arbitrária: **reparo vem antes de síntese.** Sintetizar sobre uma base cujas
contradições não estão ligadas e cujas banalidades não estão marcadas é
multiplicar o erro por escrito, com aparência de conclusão.

> **NÃO PROPONHA INGERIR MAIS CORPUS.** O `MEDICAO-02.md` mediu, o ataque cego
> de 10/08 remediu e o **terceiro ataque cego, de 12/08, confirmou pela segunda
> vez: o gargalo não é conteúdo.** As 21 claims esperadas pelas 12 perguntas
> cegas existem, estão etiquetadas nas gavetas certas, e **forçando a gaveta com
> `--topic` 9 das 12 devolvem na hora**. Comprar fonte contra esse sintoma é o
> erro mais caro que um relatório de medição pode induzir, e é o erro que a
> `MEDICAO-02` quase induziu em 4 de 7 casos.

---

## 0. O que está aberto ANTES da lista — não é mais o roteamento

**Atualizado em 12/08/2026 pelo terceiro ataque cego. O item mudou de nome e de
tamanho, e mudou pelo número CEGO, não pelo público.**

```
conjunto PÚBLICO (P01–P18, que o construtor enxergava)
    8 de 18 devolvem ALGUM id esperado
conjunto CEGO (B01–B12, escrito pelo ataque, ninguém enxergava)
    0 de 12 devolvem ALGUM id esperado, por qualquer definição de tela
```

Os dois saem separados a cada `node research/tools/check-canarios.mjs`. **Some-os
e você lê `8 de 30`, que é a média e é a mentira.**

### 0.1 O roteamento SAI da fila — ele generalizou

A onda de 11/08 atacou roteamento e o número de roteamento melhorou de verdade,
inclusive fora do conjunto que ela viu: **em 10 dos 12 cegos a camada abriu uma
gaveta que contém a resposta.** Só B02 e B05 são falha de roteamento pura.
**Não gaste mais nada em roteamento.** O que sobra dele são dois casos escritos e
vermelhos, e eles esperam a próxima onda de vocabulário, não uma onda inteira.

### 0.2 O SOTERRAMENTO entra no lugar, com o mecanismo medido

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

### 0.3 A decisão que o atleta pediu: a frota de modelo barato

Ele perguntou se vale usar uma frota de modelo barato para dar a cada claim uma
linha de *"que pergunta esta claim responde"*. **O número que decide isso é o
0.2, e ele diz NÃO AGORA.**

- **O que a linha por claim consertaria:** casamento pergunta→claim dentro da
  gaveta. Isso é ORDENAÇÃO, e ajudaria — mas só depois de haver vaga. Em B11 a
  gaveta certa recebe **1 vaga de 40**; nenhuma qualidade de descrição por claim
  coloca duas respostas dentro de uma vaga.
- **O custo, com a base medida:** são **6.912 claims**. Uma linha curta por claim,
  com a claim e o verbatim no prompt, fica na ordem de **300–600 tokens de entrada
  e ~40 de saída** por claim — grosso modo **2 a 4 M de tokens de entrada e ~0,3 M
  de saída** para a base inteira. Num modelo da faixa barata isso custa **dólares
  de um dígito, não centenas**; o custo real não é dinheiro, é que o artefato
  gerado **não tem trava** — e a §8.43 acabou de mostrar o que acontece com um
  artefato de julgamento sem trava (26 das 74 gavetas do glossário podiam virar
  lixo com os três gates verdes). Uma linha por claim escrita por frota exigiria a
  mesma calibração de dois agentes independentes que o item 1 exige.
- **A ordem certa:** cota por gaveta primeiro (é código, é determinístico, é
  barato, e o canário para medi-la já existe). Se depois dela o número cego
  continuar baixo, aí a linha por claim passa a ser a hipótese seguinte — e aí ela
  terá um número contra o qual se medir, que hoje ela não tem.

### 0.4 A regra que esta onda comprou caro

**Conjunto de teste publicado vira conjunto de treino.** Os P01–P18 foram escritos
às cegas em 10/08 e em 12/08 já estavam absorvidos: das 8 públicas que passam,
só **2** sobrevivem a uma paráfrase leve, e a pergunta-vitrine da onda colapsa ao
trocar *"coração"* por *"cardiovascular"*. Os B01–B12 estão publicados agora e
estão igualmente queimados. **A próxima onda de recuperação precisa de um conjunto
cego NOVO, escrito por quem não viu a ferramenta nem o `CANARIOS.json`, ANTES de
qualquer conserto.** Sem isso o placar seguinte mede o conserto de quem o
escreveu — o modo de falha nº 5, que já apareceu cinco vezes nesta casa.

**A regra de trabalho, e ela vale para os cinco itens abaixo também:** escreva o
canário do caso ANTES de tocar em código.

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
- **Não aposenta canário vermelho.** P01–P18 e B01–B12 continuam registrados como
  falham, com o número ao lado, até alguém consertar a camada e reescrever o
  registro — e reescrever o registro é uma decisão que vai junto com o veredito do
  topo do `RECUPERACAO.md`.
- **Não mede a próxima onda com B01–B12.** Eles estão publicados; ver §0.4.
