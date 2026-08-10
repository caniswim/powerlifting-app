# Retomar — 12 de agosto de 2026 (noite), fechamento da onda 2D e da auditoria cega dela

**Nada está pendente no meio.** Os três gates estão verdes, o trabalho da onda e o da
auditoria que a reprovou estão absorvidos no repositório, e a fila está em
`research/kb/ONDA-2C.md`. Este arquivo é curto de propósito: o que ele tem é o que **não**
está escrito em outro lugar.

## O comando

```bash
cd /Users/brunnovert/Documents/Dev/powerlifting-app
npm run check:kb && npm run check:gate && npm run build
```

`check:kb` imprime, ao passar, o placar da recuperação **por conjunto** — hoje são três.
Verde ali quer dizer *"a medida não mudou"*, nunca *"a camada acha"*.

## O estado, em números que não podem ser somados

```
conjunto PÚBLICO  (P01–P18, que o construtor da onda 2B enxergava)
    2 de 18 devolvem TODOS os ids  ·  7 de 18 devolvem ALGUM  ·  1 de 18 sem gaveta

conjunto CEGO     (B01–B12, escrito pelo ataque de 12/08 de manhã — QUEIMADO)
    0 de 12 devolvem TODOS os ids  ·  2 de 12 devolvem ALGUM  ·  2 de 12 sem gaveta

conjunto CEGO     (D01–D12, escrito pela auditoria de 12/08 à noite — QUEIMADO)
    0 de 12 devolvem TODOS os ids  ·  2 de 12 devolvem ALGUM  ·  1 de 12 sem gaveta
                                      3 de 33 ids esperados chegam à tela  (9 %)
```

**O número que manda é o cego: 2 de 12, ZERO completos, 3 ids de 33.** O visível está
**2,3 vezes** acima do cego. Somar os conjuntos imprime a média e apaga essa distância —
por isso o `check-canarios.mjs` exige o campo `conjunto` e imprime os três separados, com o
total só depois e nunca sozinho.

**O ganho da onda é real e é minúsculo.** Contra o estado de 11/08 rodado no mesmo comando
(`node research/tools/auditoria/legado.mjs`), os mesmos doze cegos saíam de **0 de 12 e
0 de 33 ids**. O atleta continua sem resposta em **10 das 12** perguntas dele.

**E o defeito-alvo piorou: soterramento de 10 para 11 de 12.** A alocação por gaveta trocou
*"a gaveta grande come tudo"* por *"as vagas se repartem entre gavetas erradas"*. A prova
cabe em duas linhas e é contraintuitiva:

```
D05  --topic convencional            -> os 3 ids
     --topic convencional sumo terra -> ZERO
```

## Onde ler o resto, nesta ordem

1. **`research/kb/RECUPERACAO.md`** — o veredito está no topo, com os três números. A
   **PARTE VII (§26)** é a auditoria cega inteira: o que do relatório da onda 2D é verdade,
   o que era mentira útil, e a linha que separa VAGA de ORDEM.
2. **`research/kb/ONDA-2C.md`** — a fila. O **item 0** mudou de nome pela segunda vez: era
   roteamento, virou cota de vagas por gaveta, e hoje é **§0.2-bis** (a alocação é soma
   zero) mais **§0.2-ter** (ordenação dentro da gaveta). O **§0.3** responde com número a
   pergunta da frota de modelo barato — **a resposta é NÃO, e o número é 28 contra 5**. A
   **§0.5** é a fila do item 0 em ordem.
3. **`research/RUNBOOK.md` §8** — as **39** divergências abertas. As dez novas desta rodada
   são a **48** (alocação soma zero), a **49** (`PISO_VAGAS`), a **50** (ordenação dentro da
   gaveta), a **52** (o `grep` mudo), a **53** (as varreduras não reproduzem), a **54** (o
   canário do cinto), a **55** (a precisão do topo), a **56** (paráfrase), a **57** (os
   buracos de "não sei") e a **58** (a cobertura de mutação do vocabulário). A **51**
   entrou e foi fechada no mesmo passe.
4. **`research/kb/ESTADO.md`** — o que está provado por compilador e o que continua sendo
   julgamento.

## A bancada, e por que ela está onde está

**`research/tools/auditoria/`** — os treze arquivos que produziram os números acima.
`cegos.mjs` (as doze perguntas), `diagnostico.mjs` (gaveta a gaveta, forçada sozinha e em
conjunto), **`vale-a-frota.mjs`** (o 28 contra 5, que decide a pergunta do atleta),
`legado.mjs`, `topo.mjs`, `parafrase.mjs`, `piso.mjs`, `estreitas.mjs`, `tres-saidas.mjs`,
`publicos.mjs`, `duas-telas.mjs`, `precisao.mjs`, `fisgada.mjs`.

Eles nasceram em `research/tools/scan/`, que está no **`.gitignore`**. O instrumento citado
por um veredito publicado teria nascido perdido — que é exatamente o erro que o relatório
auditado dizia ter evitado. **`scan/` continua ignorado e continua certo para rascunho
descartável; artefato caro nasce em `research/` e é commitado no mesmo dia.**

## A parte cega, e a regra que não pode ser reaprendida

**Conjunto de teste publicado vira conjunto de treino.** Agora com duas confirmações
independentes: os P01–P18 foram escritos às cegas em 10/08 e estavam absorvidos em 12/08;
os B01–B12 foram publicados de manhã; **os D01–D12 estão publicados a partir deste commit e
estão igualmente queimados.**

**A próxima onda de recuperação precisa de um conjunto cego NOVO**, escrito **antes** de
qualquer conserto por quem não viu a ferramenta, nem o `CANARIOS.json`, **nem o
`GLOSSARIO-TOPICOS.json`** — esta última exigência é nova e foi medida: a camada acha
quando o atleta já sabe o vocabulário. Sob paráfrase sem jargão a fisgada cai de 5 de 5
para **3 de 5**, enquanto D05 e D08 MELHORAM, porque a paráfrase usou a jargona da gaveta.

Operacionalmente: se a onda for tocada por agentes, o agente que constrói **não** recebe o
arquivo de canários no prompt, e o agente que ataca escreve as perguntas **antes** de ver
qualquer diff.

## Contexto que não pode ser reaprendido

- **Não ingerir mais corpus.** Medido quatro vezes, a última em 12/08 à noite: os 33 ids
  esperados pelos doze cegos existem, estão nas gavetas certas, e **forçando a gaveta certa
  sozinha 28 deles chegam**. O gargalo é seleção e ordenação, não conteúdo.
- **Nenhuma trava pode ler a constante que ela verifica** (modo de falha nº 4). A variante
  desta rodada estava dentro do arquivo escrito para provar que as constantes foram ganhas:
  `alocacao.test.mjs` afirmava `magra >= 3`, que é `PISO_VAGAS >= 3` reescrito. Removida.
  **E a variante seguinte, que também custou:** a asserção que escrevi para substituí-la não
  ficou vermelha em nenhuma de seis mutações — **trava que não sabe morrer é decoração**, e
  foi removida também. Antes de escrever uma trava, mute contra ela.
- **Relatório de agente escolhe quais números publicar mesmo quando não mente em nenhum.**
  Das dez divergências novas, **seis** eram números a um comando de distância que não foram
  rodados. O construtor não fecha o próprio item.
- **`grep` devolve zero em silêncio em `research/tools/roteador.mjs`** — o arquivo tem um
  byte NUL deliberado e o `grep` o trata como binário. **Use `grep -a`.** Divergência 52.
- **Nenhum número de qualidade da base** pode ser citado sem dizer com que instrumento foi
  obtido, **de que conjunto**, e se os canários daquele instrumento passaram.
- **`npm run lint` está vermelho e já estava** (17 erros em `src/pages/*.tsx`, React). Não é
  um dos três gates, e o `eslint.config.js` não cobre `research/tools/` — divergência 42.

## O que é dele, não meu

Fora do caminho crítico, e ele resolve quando der: o telefonema à federação (o Brasileiro
exige estadual no ano anterior, o que empurra um estadual para out/nov de 2026), a tarde de
medição filmada que tira 215/160/240 de estimativa, e a linha de calibração de RPE — que
fica fora do passe de tier `U` porque depende de ele treinar.
