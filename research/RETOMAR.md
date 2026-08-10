# Retomar — parado em 9 de agosto de 2026, 20h15

A onda 2B foi **pausada no meio**, a pedido. Nada quebrou; o build está verde. Este
arquivo existe para que amanhã não comece com arqueologia.

## O comando

```bash
cd /Users/brunnovert/Documents/Dev/powerlifting-app
npm run check:kb && npm run check:gate && npm run build   # confirmar que ainda está verde
```

E para retomar o workflow de onde parou:

```
Workflow({ scriptPath: "research/workflows/onda2b.js",
           resumeFromRunId: "wf_626a69ef-699" })
```

O script saiu de `/tmp` e mora em `research/workflows/onda2b.js`, **com conteúdo
idêntico**. O cache do resume casa por `(prompt, opts)` de cada `agent()`, não pelo
caminho do arquivo, então mudar de lugar não invalida nada.

**Se o resume não pegar** (ele é, em princípio, da mesma sessão — hoje funcionou
atravessando duas, mas não conte com isso): nada de importante se perde. Os dois
agentes que terminaram gravaram o trabalho deles no repositório, e o que eles
devolveram está salvo em `research/kb/CANARIOS-ESCONDIDOS.json` e
`research/kb/DIVIDA-DOR-RELATO.md`. O pior caso é relançar do zero e pagar de novo
por dois agentes.

## Onde a onda 2B parou

| agente | estado | onde está o resultado |
|---|---|---|
| `canarios` | ✅ terminou, e **já absorvido** | os 18 entraram em `research/kb/CANARIOS.json` como `presente-escondido` com bloco `perguntaDoAtleta`, medidos e vermelhos. `CANARIOS-ESCONDIDOS.json` fica como o registro do que o terceiro escreveu |
| `divida-dor` | ✅ terminou | código e claims já no repo; raciocínio em `research/kb/DIVIDA-DOR-RELATO.md` |
| `roteamento` | ✅ entregue e medido | `research/tools/roteador.mjs`, `check-rotas.mjs`, `ROTAS.json` — **15** canários de roteamento verdes |
| `atacar` | ✅ terminou | o ataque cego mediu **3 de 18** e diagnosticou roteamento; achados no `RECUPERACAO.md` §18 e no `RUNBOOK.md` §8.36–38 |
| `fechar` | ✅ terminou (10/08) | canários gravados e ligados ao `check-canarios.mjs`; veredito no topo do `RECUPERACAO.md`; fila nova em `research/kb/ONDA-2C.md` |

## ⚠️ A parte cega, e como não estragá-la

Os 18 canários de `CANARIOS-ESCONDIDOS.json` foram escritos **antes** do conserto,
por um agente que não viu a ferramenta, e o agente que constrói a busca **nunca os
recebeu**. É isso que faz o teste valer: na onda anterior o construtor escreveu o
próprio canário e calibrou os termos de busca *sobre a resposta*
(`buscaCega.termos = ["2 a 3%"]`), o que mede exatamente zero, porque nenhum atleta
digita a resposta que está procurando.

Salvei o arquivo no repositório porque perder 18 canários é pior do que o risco
abaixo — mas o risco existe e é este: **se o agente de roteamento for relançado do
zero, ele pode LER esse arquivo enquanto navega o repositório e otimizar para ele.**

Duas saídas, e a primeira é melhor:

1. **Retomar pelo `resumeFromRunId`.** O agente de roteamento continua com o prompt
   original, que não contém os canários. A cegueira se mantém.
2. **Se for relançar do zero:** mover `CANARIOS-ESCONDIDOS.json` para fora da árvore
   antes, e devolver depois da fase de construção.

## O que a onda 2B ainda tem de responder

A pergunta que paga a onda, e ela ainda não foi feita: **dos 18 canários, quantos a
camada nova de fato encontra?** E: **das sete falhas medidas — Q02, Q05, Q11, Q14,
Q16, Q19, Q29 — quantas o roteamento destrava, verificado às cegas?**

Na onda 2A o construtor relatou destravadas que o ataque cego não conseguiu
reproduzir. Por isso o número que vale é o do atacante, nunca o de quem consertou.

## Contexto que não pode ser reaprendido

- **Não ingerir mais corpus.** `MEDICAO-02.md` mediu que o gargalo não é conteúdo, e
  falseou a previsão de que o Blevins consertaria as três piores perguntas — as três
  eram claim do **Vena** que ninguém achou.
- **A correção de rumo desta onda:** roteamento por **tópico fechado** (74 termos),
  não busca por texto livre. O caso que provou isso é `descanso-entre-series`: a
  busca livre não achava nada nas 40 primeiras, e `--topic` devolve as 12 claims na
  hora.
- **Nenhuma trava pode ler a constante que ela verifica.** Modo de falha nº 4 desta
  casa, e ontem apareceu três vezes — uma delas dentro do arquivo que cita esse modo
  de falha.
- **Nenhum número de qualidade da base** pode ser citado sem dizer com que
  instrumento foi obtido e se os canários daquele instrumento passaram.

## Depois da 2B

`research/kb/ONDA-2C.md` (a escrever no fechamento), na ordem:

1. **Triagem de banalidade** (tarefa #34) — o atleta pediu, reagindo a `V014-03`
   ("ficar adequadamente hypado") pesar o mesmo que `V014-12` ("rotacionar sob a
   barra"). **Marcar, não apagar.** Exige calibração: dois agentes independentes na
   mesma amostra de 150, e **abaixo de ~85 % de concordância o campo é ruído e não
   deve ser construído**.
2. **Fatos do atleta como tier U** (tarefa #28) — tier U = 0 hoje. A calibração de
   RPE fica **fora**: depende de ele treinar, e ele não vai treinar esta semana.
3. **Whisper nos 53 `suspect`** (tarefa #31).
4. **Ledger de contradições e sínteses + INDEX** (tarefas #25, #26) — **por último**,
   porque reparo vem antes de síntese: erro de dado vira norma para o próximo agente.

E, só depois de tudo isso, a **revisão do programa de treino já gerado** — que é o
que o atleta pediu para deixar por último.

## O que é dele, não meu

Fora do caminho crítico, e ele resolve quando der: o telefonema à federação (o
Brasileiro exige estadual no ano anterior, o que empurra um estadual para out/nov de
2026), a tarde de medição filmada que tira 215/160/240 de estimativa, e a linha de
calibração de RPE.
