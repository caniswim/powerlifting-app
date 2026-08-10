# Retomar — 12 de agosto de 2026, fechamento da onda do glossário de entrada

**Nada está pendente no meio.** Os três gates estão verdes, o trabalho da onda está
absorvido no repositório, e a fila está em `research/kb/ONDA-2C.md`. Este arquivo é curto
de propósito: o que ele tem é o que **não** está escrito em outro lugar.

## O comando

```bash
cd /Users/brunnovert/Documents/Dev/powerlifting-app
npm run check:kb && npm run check:gate && npm run build
```

`check:kb` imprime, ao passar, o placar da recuperação **por conjunto**. Verde ali quer
dizer *"a medida não mudou"*, nunca *"a camada acha"*.

## O estado, em quatro números que não podem ser somados

```
conjunto PÚBLICO  (P01–P18, que o construtor da onda enxergava)
    0 de 18 devolvem TODOS os ids  ·  8 de 18 devolvem ALGUM  ·  1 de 18 sem gaveta

conjunto CEGO     (B01–B12, escrito pelo ataque depois do conserto)
    0 de 12 devolvem TODOS os ids  ·  0 de 12 devolvem ALGUM  ·  2 de 12 sem gaveta
```

**O número que manda é o cego: ZERO.** A distância entre 44 % e 0 % é o tamanho da
absorção do conjunto público pela construção. Somar os dois dá `8 de 30`, que é a média e
apaga a distância — por isso o `check-canarios.mjs` exige o campo `conjunto` e imprime os
dois separados.

**E o diagnóstico é o oposto do que o zero sugere:** em **10 dos 12** a gaveta com a
resposta ABRIU e a resposta não chegou à tela; forçando com `--topic`, **9 dos 12**
devolvem na hora. O gargalo deixou de ser roteamento e virou **soterramento** — a tela não
tem cota de vagas por gaveta.

## Onde ler o resto, nesta ordem

1. **`research/kb/RECUPERACAO.md`** — o veredito de duas linhas está no topo; a **PARTE V
   (§24)** é o ataque cego de 12/08 inteiro, com o mecanismo do soterramento medido caso a
   caso e os dois consertos que este fechamento fez.
2. **`research/kb/ONDA-2C.md`** — a fila. O **item 0** mudou de nome: era roteamento, hoje
   é cota de vagas por gaveta, e o **§0.3** responde com número a pergunta da frota de
   modelo barato (resposta: não agora, e por quê).
3. **`research/RUNBOOK.md` §8** — as **29** divergências abertas. As novas desta rodada são
   a **44** (duas definições de tela), a **45** (o painel fraco) e a **46** (precisão); a
   **43** e a **47** entraram e foram fechadas no mesmo passe, riscadas, porque a lição de
   cada uma não fecha com o item.
4. **`research/kb/ESTADO.md`** — o que está provado por compilador e o que continua sendo
   julgamento.

## A parte cega, e a regra que não pode ser reaprendida

**Conjunto de teste publicado vira conjunto de treino.** Os P01–P18 foram escritos às cegas
em 10/08 e em 12/08 já estavam absorvidos: das 8 que passam, só 2 sobrevivem a uma
paráfrase leve, e a pergunta-vitrine da onda colapsa ao trocar *"coração"* por
*"cardiovascular"*. **Os B01–B12 estão publicados em `research/kb/CANARIOS.json` a partir
deste commit e estão igualmente queimados.**

**A próxima onda de recuperação precisa de um conjunto cego NOVO**, escrito por quem não
viu a ferramenta nem o `CANARIOS.json`, **antes** de qualquer conserto. Se o construtor e o
avaliador forem o mesmo, o número não mede a camada — mede o conserto. Aconteceu cinco
vezes nesta casa, a última dentro do documento de verificação que existia para pegá-la.

Operacionalmente: se a onda for tocada por agentes, o agente que constrói **não** recebe o
arquivo de canários no prompt, e o agente que ataca escreve as perguntas **antes** de ver
qualquer diff.

## Contexto que não pode ser reaprendido

- **Não ingerir mais corpus.** Medido três vezes, a última em 12/08: as 21 claims esperadas
  pelos 12 cegos existem, estão nas gavetas certas, e `--topic` devolve 9 de 12 na hora.
  **O gargalo é seleção e ordenação, não conteúdo.**
- **Nenhuma trava pode ler a constante que ela verifica** (modo de falha nº 4). A variante
  nova, medida nesta rodada: uma trava que confere só a FORMA de um artefato de julgamento
  não é trava — 26 das 74 gavetas do glossário passavam com dez strings sem sentido.
- **Nenhum número de qualidade da base** pode ser citado sem dizer com que instrumento foi
  obtido, **de que conjunto**, e se os canários daquele instrumento passaram.
- **`npm run lint` está vermelho e já estava** (17 erros em `src/pages/*.tsx`, React). Não é
  um dos três gates, e o `eslint.config.js` não cobre `research/tools/` — divergência 42.

## O que é dele, não meu

Fora do caminho crítico, e ele resolve quando der: o telefonema à federação (o Brasileiro
exige estadual no ano anterior, o que empurra um estadual para out/nov de 2026), a tarde de
medição filmada que tira 215/160/240 de estimativa, e a linha de calibração de RPE — que
fica fora do passe de tier `U` porque depende de ele treinar.
