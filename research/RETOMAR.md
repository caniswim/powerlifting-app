# Retomar — parado em 10 de agosto de 2026, fim do dia

A onda 2E foi **pausada de propósito**, logo depois de o construtor terminar e antes de o
atacante começar. Nada quebrou; `check:kb`, `check:gate` e `build` estão verdes.

## O comando de amanhã — um só

```
Workflow({ scriptPath: "research/workflows/onda2f-ataque.js" })
```

**Lançamento novo, NÃO `resumeFromRunId`.** O resume falhou hoje duas vezes atravessando
fronteira de sessão: ele dá cache miss, recomeça da fase 1 e gera canários cegos DIFERENTES,
o que jogaria fora a medição. Por isso os 12 canários E## estão **embutidos no script**
(38 kB, sintaxe conferida) — amanhã não depende de cache, de journal, nem de mim lembrar de
nada.

Antes, se quiser confirmar que a noite não mexeu em nada:

```bash
cd /Users/brunnovert/Documents/Dev/powerlifting-app
npm run check:kb && npm run check:gate && npm run build
```

## O que a onda 2E entregou (commitado)

A tela plana de 40 vagas virou **uma seção por gaveta**, cada uma com bloco de declaradas e
bloco de afins. `montarSecaoDeGaveta` não recebe as outras gavetas, então a invariante de
não-diluição vale por construção; `secoes.test.mjs` a cobra em 107 perguntas / 1.644
comparações.

**Placar auto-reportado pelo construtor** — ele enxergava esses 42 canários, então isto é
conjunto de treino, não veredito:

| conjunto | algum id | todos os ids |
|---|---|---|
| D01-D12 | 2 → 5 de 12 | 0 → 0 |
| B01-B12 | 2 → 3 de 12 | 0 → 1 |
| P01-P18 | 7 → 11 de 18 | 2 → 6 |
| os 42 | 11 → 19 | 2 → 7 |

**A fisgada** — o caso mais caro desta base, atleta com histórico de peitoral: as CINCO claims
do limiar de dor chegam sem `--topic`, juntas na seção `dor` (#5, #9, #28, #30, #31), e a
paráfrase sem jargão vai a **5 de 5** (era 3). **Se isso regredir, é o achado mais importante
do próximo relatório.**

**Preço:** a saída dobrou, ~14 kB → ~31 kB na pergunta mais larga.

**Falha aberta que o próprio construtor declarou** (e isso é o comportamento certo): D05
entrega 1 de 3, e a seção de `convencional` é bit a bit a mesma com 1 ou 5 gavetas — **a
invariante vale e não basta.** O alvo seguinte é `ordenarNoTopico`.

## Duas correções que a onda 2E fez no diagnóstico anterior

1. **A demonstração do soma-zero não existia.** `--topic` lê UM valor: `--topic convencional
   sumo terra` e `--topic convencional` são o mesmo comando e devolvem as mesmas 3 claims. O
   atacante da 2D montou um achado inteiro em cima de um artefato de parsing. O soma-zero era
   real; a prova, não. **Modo de falha novo desta casa: a prova que não prova.**
2. **A diluição maior era DENTRO da gaveta.** `conjuntoDoTopico` injetava até 60 claims afins
   das gavetas grandes na mesma fila das declaradas — em D06 a resposta era a 34ª declarada e
   sumia. Era essa a diferença entre `--topic <gaveta>` e a mesma gaveta roteada.

## O que a onda 2F vai medir, e por que a segunda metade importa mais

**Metade 1 — o ataque cego.** Os 12 E## contra as seções. Números da onda.

**Metade 2 — o caminho do agente, medido pela primeira vez em seis ondas.** Três agentes
recebem só as 12 perguntas e a porta `--topicos` (as 74 gavetas com glosa), escolhem onde
procurar sem ver os ids esperados, e um quarto pontua o que eles escolheram contra o gabarito.

A razão: gastamos seis ondas consertando `--pergunta`, o roteador determinístico. Ele existe
porque **um compilador não pode ter modelo dentro dele** — não há chave de API neste
repositório. Mas quem consome esta base em produção **é um agente**, que lê as gavetas e
escolhe. Deixou-se "o que é mensurável" virar "o que é o produto", e o caminho real nunca foi
medido uma vez sequer. Se ele pontuar alto, o `--pergunta` vira conveniência e paramos de
pagar por ele.

## Estado dos arquivos que só existiam na memória do workflow

| arquivo | o que é |
|---|---|
| `research/kb/CANARIOS-CEGOS-E.json` | os 12 canários cegos E01–E12, extraídos do journal na pausa |
| `research/kb/ONDA-2E-CONSTRUTOR.md` | o relato do construtor — o código estava no repo, o raciocínio não |
| `research/tools/auditoria-onda2c/` | 44 arquivos resgatados de `/tmp/aud`, com `_LEIA.md` mapeando script → achado |

Os E## também estão embutidos no `onda2f-ataque.js`. **São duas cópias do mesmo canário, e
isso é dívida deliberada de uma noite:** o fechamento da 2F tem instrução de absorvê-los no
`CANARIOS.json` e **apagar o `CANARIOS-CEGOS-E.json`**, porque duas cópias divergem em
silêncio — modo de falha nº 3.

## Contexto que não pode ser reaprendido

- **Não ingerir mais corpus.** Medido duas vezes: o gargalo não é conteúdo.
- **O índice está certo.** As claims de dor estão em `dor`, as de coração em `cardio`.
  `--topic <gaveta certa>` sozinho responde a maioria das perguntas cegas. O que falha é a
  camada de recuperação, nunca a base.
- **Conjunto de teste publicado vira conjunto de treino.** Já custou quatro ondas. Os 42
  canários P##/B##/D## são públicos; os E## são o teste de amanhã e serão publicados depois.
- **`grep -a` em `research/tools/roteador.mjs`** — havia um byte NUL que fazia o grep devolver
  zero linhas em silêncio e custou três rodadas a um agente. O construtor da 2E removeu e
  `secoes.test.mjs` recusa a volta dele; se voltar, é isto.
- **Script de reprodução nasce em `research/tools/auditoria-<onda>/`, nunca em `/tmp`.**
- **Nenhum número de qualidade da base** pode ser citado sem dizer com que instrumento foi
  obtido e se os canários daquele instrumento passaram.

## Depois da 2F

`research/kb/ONDA-2C.md` tem a fila: triagem de banalidade (#34, com calibração de dois
agentes na mesma amostra de 150 e corte em 85 % de concordância), fatos do atleta como tier U
(#28), Whisper nos 53 `suspect` (#31), e por último ledger de contradições e sínteses (#25,
#26) — porque reparo vem antes de síntese.

E, só depois de tudo isso, a **revisão do programa de treino já gerado**, que é o que o atleta
pediu para deixar por último.

## O que é dele, não meu

Fora do caminho crítico: o telefonema à federação (o Brasileiro exige estadual no ano
anterior, o que empurra um estadual para out/nov de 2026), a tarde de medição filmada que tira
215/160/240 de estimativa, e a linha de calibração de RPE.
