# Retomar — parado em 13 de agosto de 2026, fechamento da onda 2F

A onda 2F **fechou**. `npm run build`, `npm run check:kb` e `npm run check:gate` estão
verdes. Os 12 canários cegos E01–E12 estão absorvidos no `research/kb/CANARIOS.json` com o
resultado medido — inclusive os nove que falham — e o `CANARIOS-CEGOS-E.json` foi apagado.

## A decisão que este fechamento tomou, e ela muda o que a próxima onda faz

**Seis ondas de recuperação. O veredito é (c): o problema não está onde estamos cavando.**
Não é (b). Está escrito, com os números na frente, em **`research/kb/RECUPERACAO.md` §28**.

```
                                        algum id     todos os ids
CEGO   E01-E12 (13/08, nunca visto)      7 de 12       3 de 12
PÚBLICO P01-P18                         11 de 18       6 de 18

OS MESMOS 12 CEGOS, pelos dois caminhos:
  determinístico (--pergunta sozinho)    7 de 12       3 de 12
  agente + glossário (3 modelos)         9 de 12    8 · 8 · 9 de 12
  controle: determinístico com o MESMO
  instrumento do agente                  6 de 12       3 de 12
```

**Três números forçam o (c):**

1. **0 de 12 cegos falham por roteamento.** Em 12 de 12 a rota abre uma gaveta que CONTÉM a
   resposta. Cinco ondas foram gastas afinando roteamento; ele está resolvido.
2. **O agente entrega o dobro em completude** — 8–9 de 12 contra 3 de 12 —, e completude é o
   que o atleta recebe. Meia resposta em E04 (o polegar) e em E12 (a variação sem leg drive)
   é a resposta ERRADA, não uma resposta parcial.
3. **O controle mata a desculpa do orçamento:** dando ao determinístico as gavetas que a
   própria rota escolheu, forçadas uma por comando com o mesmo teto de 60, ele PIORA para
   6/12 e 3/12. O agente não ganhou por olhar mais; ganhou por escolher melhor.

**A causa, e ela é devastadora para a heurística:** dos **69 pares roteador × id**, a causa
*"o modelo escolheu gaveta que não contém o id"* ocorreu **zero vezes**. Os 17 fracassos
foram todos gaveta certa com id abaixo do corte. `PESO_CORPUS` empurra para a gaveta gorda
(mediana 245 claims nas que só o determinístico escolhe, contra 117 dos modelos), e é na
gorda que a resposta afunda.

**Em uma frase:** o princípio da casa — *onde um compilador pode verificar, agente não deve*
— continua correto e foi aplicado no lugar errado. O compilador **não** pode verificar a
escolha da gaveta; ele **pode** verificar a ordenação dentro dela.

## O comando de amanhã

A fila de CÓDIGO é `research/kb/RECUPERACAO.md` §28.1, sete itens em ordem. O primeiro:

```bash
cd /Users/brunnovert/Documents/Dev/powerlifting-app
node research/tools/auditoria-onda2f/contrato-ordenacao.mjs
```

Ele imprime o CONTRATO DE ORDENAÇÃO medido antes de virar trava — **25 de 54 canários**
entregam todos os ids dentro do teto de 18 com a gaveta certa forçada; **29 não**. Essa é a
trava a escrever, e ela **nasce vermelha de propósito**. Um gate que já nasce vermelho é um
gate honesto, e é o oposto do que esta casa vinha fazendo.

Antes, se quiser confirmar que nada mexeu:

```bash
npm run check:kb && npm run check:gate && npm run build
```

## A fila, em ordem

**Código — `RECUPERACAO.md` §28.1:**

1. **CONTRATO DE ORDENAÇÃO no `check:kb`** — 29 de 54 reprovam hoje.
2. **`ordenarNoTopico` e `PESO_CORPUS`** — F001-79 em #78 de 152 em `equipamento`, F001-30
   em #35 de 335 em `setup`, V015-12 em #34 de 57 em `sono`.
3. **A invariante:** trocar o teste para o `max` do roteamento e então consertar a
   não-monotonicidade **ou apagar o banner** que promete ao atleta o que não vale.
4. **O teto de bytes** recalibrado contra os 40,0 kB medidos.
5. **`--topic` aceitando lista de verdade** e ACRESCENTANDO à rota.
6. **Etiquetar F001 com `regras-ipf`** — `ONDA-2C.md` §6. Conserto de base, barato.
7. **A linha de saída do gate** dizendo o que ele mede.

**Base — `ONDA-2C.md` §1 a §6:** triagem de banalidade (#34, com calibração de dois agentes
na mesma amostra de 150 e corte em 85 % de concordância), fatos do atleta como tier U (#28),
Whisper nos 53 `suspect` (#31), e por último ledger de contradições e sínteses (#25, #26) —
porque **reparo vem antes de síntese**.

E, só depois de tudo isso, a **revisão do programa de treino já gerado**, que é o que o
atleta pediu para deixar por último.

## As duas perguntas abertas do atleta — respondidas em 13/08

**1. Vale pagar uma frota de modelo barato para dar a cada uma das 6.912 claims uma linha de
"que pergunta esta claim responde"?** **Não agora**, e o número é o mesmo zero: o casamento
de gaveta erra em **0 dos 69** pares roteador × id. A hipótese que sobrou — que a linha na voz do atleta
conserte a ORDENAÇÃO — é plausível e não está medida. **O experimento que decide custa 2,9 %
da compra:** escrever a linha para as **199 claims da gaveta `equipamento` inteira** (a
gaveta inteira, nunca só os ids esperados) e re-medir E05, E06 e E10. Detalhe em
`ONDA-2C.md` §0.3.

**2. O `--pergunta` determinístico continua sendo o produto?** **Não. O produto passa a ser
o agente com o glossário; o `--pergunta` vira conveniência de linha de comando.** O limite
faz parte da resposta: "o agente" quer dizer o agente **mais** o glossário de 74 gavetas
**mais** a ordenação dentro da gaveta, e dois dos três continuam no repositório e continuam
verificáveis. E a variância entre repetições do MESMO modelo **não foi medida** — antes de
desligar qualquer coisa, ela precisa de um número.

## O que a auditoria da 2F derrubou, e cada item tem comando

| o que caiu | número | reprodução |
|---|---|---|
| a invariante de não-diluição é **tautologia** | 38 violações em 1.832 no `max` real | `auditoria-onda2f/invariante.mjs` |
| o preço não é ~31 kB | até **40,0 kB**, 24 de 63 acima do teto declarado | `auditoria-onda2f/publicos.mjs` |
| o escape `--topic <gaveta certa>` regrediu | 12/12 → **10/12**, e nada o mede | `auditoria-onda2f/cegos.mjs --forcado` |
| `--topic a b c` lê **um** valor | sha1 idêntico nos dois comandos | `auditoria-onda2f/topic-parse.mjs` |
| `TETO_LIGACAO` 8→80 sobrevive | 36 de 40 mutantes mortos, 4 vivos | `auditoria-onda2f/mutacao.mjs` |

Registradas como `RUNBOOK.md` §8.59 a §8.65. **Fecharam duas** (§8.44, uma definição de
tela, conferida nos dois sentidos; §8.52, o byte NUL) **e abriram sete.**

## Contexto que não pode ser reaprendido

- **Não ingerir mais corpus.** Medido cinco vezes: o gargalo não é conteúdo.
- **O índice está certo.** As claims de dor estão em `dor`, as de coração em `cardio`. O que
  falha é a camada de recuperação, nunca a base.
- **Conjunto de teste publicado vira conjunto de treino.** Já custou cinco ondas. Os **54**
  canários P##/B##/D##/E## são todos públicos agora. **A próxima medição precisa de um
  conjunto cego NOVO, escrito antes do conserto por quem não viu a ferramenta.**
- **Confira o que o seu comando de fato executa antes de concluir qualquer coisa dele.** A
  onda 2D publicou um achado inteiro construído sobre `--topic` descartando argumentos em
  silêncio. Modo de falha nº 5, variante nova: **a prova que não prova.**
- **Script de reprodução nasce em `research/tools/auditoria-<onda>/`, nunca em `/tmp`.**
- **Nenhum número de qualidade da base** pode ser citado sem dizer com que instrumento foi
  obtido e se os canários daquele instrumento passaram.
- **A distância público-cego fechou, e isso NÃO é prova de nada.** O arquivo dos doze cegos
  esteve no repositório em texto puro durante a onda inteira. "Escondido do construtor" não é
  verificável depois do fato.

## Onde está cada coisa

| arquivo | o que é |
|---|---|
| `research/kb/RECUPERACAO.md` | o veredito no topo e a DECISÃO no §28 — leia esses dois |
| `research/kb/CANARIOS.json` | os 54 canários da porta nova, E01–E12 inclusos e medidos |
| `research/kb/ESTADO.md` | o placar de cada onda, e o §4 com a fila |
| `research/RUNBOOK.md` §8 | as **43** divergências abertas, numeradas e com número medido |
| `research/kb/ONDA-2C.md` | a fila de BASE (§1–§6); o §0 está superado e diz onde |
| `research/kb/ONDA-2E-CONSTRUTOR.md` | o relato do construtor da tela por seção |
| `research/tools/auditoria-onda2f/` | os scripts de reprodução desta onda, um por achado |
| `research/tools/auditoria-onda2c/` | os 44 arquivos resgatados de `/tmp/aud`, com `_LEIA.md` |

## O que é dele, não meu

Fora do caminho crítico: o telefonema à federação (o Brasileiro exige estadual no ano
anterior, o que empurra um estadual para out/nov de 2026), a tarde de medição filmada que
tira 215/160/240 de estimativa, e a linha de calibração de RPE.
