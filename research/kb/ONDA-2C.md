# ONDA 2C — a lista de trabalho, em ordem

**Aberta em 10/08/2026**, no fechamento da onda 2B. A ordem abaixo não é
arbitrária: **reparo vem antes de síntese.** Sintetizar sobre uma base cujas
contradições não estão ligadas e cujas banalidades não estão marcadas é
multiplicar o erro por escrito, com aparência de conclusão.

> **NÃO PROPONHA INGERIR MAIS CORPUS.** O `MEDICAO-02.md` mediu, e o ataque
> cego de 10/08 remediu: **o gargalo não é conteúdo.** Em 7 das 18 perguntas do
> ataque a resposta estava na base e a camada nunca abriu a gaveta que a
> continha. Comprar fonte contra esse sintoma é o erro mais caro que um relatório
> de medição pode induzir, e é o erro que a `MEDICAO-02` quase induziu em 4 de 7
> casos.

---

## 0. O que está aberto ANTES da lista — o roteamento

Não é item de fila, é a dívida que a onda 2B fechou medindo e não consertando.
O veredito está no topo do `RECUPERACAO.md` e o número sai a cada
`node research/tools/check-canarios.mjs`:

```
0 de 18 devolvem TODOS os ids esperados dentro do teto de tela
3 de 18 devolvem ALGUM id esperado
7 de 18 não roteiam para gaveta NENHUMA que contenha a resposta
```

**Consertar ROTEAMENTO (pergunta → tópico), não ordenação dentro do tópico.** Os
canários que medem isso já existem e já estão vermelhos: P01–P18 em
`research/kb/CANARIOS.json`. O caso mais caro para **este** atleta é o P02/Q03 —
*"dá pra treinar sentindo um incômodo leve no peitoral"* não alcança nenhuma das
cinco claims de dor por nenhuma das duas portas, e a tela que volta não tem sinal
nenhum de que falta alguma coisa (`RECUPERACAO.md` §18.5).

**A regra de trabalho, e ela vale para os quatro itens abaixo também:** escreva o
canário do caso ANTES de tocar em código. Foi assim que o §13 do `RECUPERACAO.md`
mediu cinco destravadas onde havia duas — o construtor mediu com o instrumento
calibrado no próprio conserto.

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
- **Não aposenta canário vermelho.** P01–P18 continuam registrados como falham,
  com o número ao lado, até alguém consertar a camada e reescrever o registro.
