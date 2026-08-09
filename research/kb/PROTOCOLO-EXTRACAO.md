# Protocolo de extração

Instrução única para todos os agentes que transformam transcrição em claim.
Leia junto com `SCHEMA.md`, que define o registro.

## O trabalho

Ler um lote de transcrições e emitir claims atômicas em JSONL. Não é resumir o
vídeo. Não é avaliar se o Vena tem razão. É **registrar o que ele diz, de forma
que dê para conferir depois** — e separar o que ele diz do que você concluiu.

## Vocabulário de tópicos — FECHADO

Sem banco vetorial, o `topic` é o mecanismo de recuperação. Vocabulário livre
mata isso: `agacho`, `agachamento`, `squat` e `sq` viram quatro gavetas para a
mesma coisa e o grep de nenhuma delas acha tudo. Use **exclusivamente** estes:

```
agacho  supino  terra  tecnica  profundidade  pegada  setup  barra-alta  barra-baixa
sumo  convencional  comandos-ipf  regras-ipf
programacao  volume  intensidade  frequencia  progressao  periodizacao  taper  deload
rpe  autorregulacao  selecao-exercicio  tier-list  series-reps
acessorios  hipertrofia  bracos  ombros  costas  peito  pernas  posterior  core
lesao  dor  mobilidade  aquecimento  fadiga  recuperacao  sono
equipamento  cinto  faixa  sapato  strap
nutricao  peso-corporal  cutting  bulking
mentalidade  competicao  pico  teste-de-forca  cardio  condicionamento
natural-vs-enhanced  erro-comum  meta-metodologia
antropometria  genetica  capacidade-trabalho  rom  ordem-exercicio
saude  aprendizado-motor  idade
carga-de-treino  training-max  proximidade-da-falha  descanso-entre-series
estagnacao  powerbuilding
```

As seis últimas entraram em 2026-08-09; `research/kb/ENUMERADOS.md` registra por
que elas e não as outras catorze que foram pedidas. Em resumo:

- `carga-de-treino` — quanto estresse o treino custa, medido: o *stress index*
  e a banda em que ele é mantido ao longo de um bloco.
- `training-max` — como o TM é definido, ajustado e recalculado. Cada programa
  faz diferente, e foi confundir 1RM com TM que originou este esquema.
- `proximidade-da-falha` — AMRAP, treinar até a falha, quantas reps sobram. É o
  eixo da divergência mais consequente da base, e não tinha gaveta.
- `descanso-entre-series` — o intervalo dentro da sessão. `recuperacao` é entre
  sessões; misturar os dois responde a pergunta errada.
- `estagnacao` — o platô e o que fazer com ele.
- `powerbuilding` — combinar força e tamanho, que é o objetivo declarado do
  consumidor desta base.

Esta lista não é decorativa: `check-claims.mjs` a lê deste arquivo e **recusa
qualquer tópico que não esteja aqui**. Documento e trava são o mesmo objeto de
propósito — já erramos deixando o enumerado de `frame` crescer no código
enquanto o `SCHEMA.md` descrevia outra coisa.

**Nunca force um número numa gaveta errada para satisfazer o checker.** Um lote
mapeou gramas e calorias para o frame `kg` e semanas para `anos` — que é
exatamente o erro de unidade que este esquema existe para impedir, reintroduzido
pelo contorno da trava. Se faltar frame, relate no resumo final e deixe o número
por extenso; aviso é barato, dado errado não é.

Precisou de um tópico que não está aqui? **Não invente.** Use o mais próximo e
registre a falta no relatório final. O vocabulário cresce por decisão, não por
acúmulo — e a decisão fica escrita em `ENUMERADOS.md`, com as recusas junto das
aceitações. Tópico é o mecanismo de recuperação: se todo assunto vira tópico, o
filtro por tópico deixa de estreitar qualquer coisa.

Frame é o contrário e a assimetria é de propósito: **faltar frame é pior do que
ter frame demais**, porque frame não serve para achar nada — serve para impedir
que um número atravesse duas semânticas sem ninguém ver. Se o número que você
tem não cabe em nenhuma gaveta, relate; a gaveta provavelmente vai ser aberta.

## Um arquivo por vídeo

As claims do vídeo `R014` vão para `research/extract/R014.jsonl`. Uma claim por
linha.

**Lote é divisão de trabalho, não unidade de conhecimento.** Você recebe um lote
de vídeos porque alguém precisava repartir a tarefa, mas o arquivo nunca é
`lote_07`: quem consulta a base parte de uma citação `[R014 @03:05]` e o caminho
tem que sair dela sozinho, sem índice no meio. Isso também torna a regeneração
idempotente — refazer um vídeo reescreve um arquivo e não mexe em mais nada.

## Alocação de id

O id sai do **nome do arquivo**, com a sequência começando em 01 dentro de cada
vídeo:

```
research/extract/G008.jsonl  →  G008-01, G008-02, …
research/extract/F001.jsonl  →  F001-01, F001-02, …
research/extract/R014.jsonl  →  V014-01, V014-02, …   ← só o Vena
```

O prefixo do id é igual ao prefixo do ref para **toda** fonte, menos o Vena, que
usa `V`. A assimetria é histórica e está travada em `sources.mjs` (`idPrefix`):
os ids do Vena nasceram como `V{ref}` quando havia uma fonte só e `V` queria
dizer "vídeo". Com a segunda fonte a fórmula quebrou — `G010` daria `V010-01`,
que já é do `R010.jsonl` — e renumerar os 4.947 ids do Vena, já citados por
`conflicts`, `basis` e `conditions`, é a única coisa que este esquema proíbe sem
exceção. Então a exceção fica no registro de fontes, declarada, em vez de virar
folclore.

O `check-claims.mjs` recusa id que não case com o arquivo e id que não tenha a
forma `{LETRA}{NNN}-{seq}`. A segunda regra não é cosmética: o
`check-evidence.mjs` — a ferramenta que este protocolo manda usar para resolver
citação — só reconhece essa forma, e **em silêncio**. Meia ingestão do Blevins
saiu como `VG036-01` e toda aresta que apontava para lá ficou inverificável sem
uma linha de reclamação.

Nunca reutilize, nunca renumere — contradições e sínteses vão apontar para esses
ids.

## O que é uma claim

Uma afirmação que você consegue amarrar a segundos específicos da transcrição.

**Sim:**
- uma prescrição (`GERAL`): "manter 2 a 3 repetições na reserva na maioria das séries"
- uma prática dele (`PESSOAL`): "ele treina agachamento duas vezes por semana"
- um mecanismo alegado: "inclinar mais o tronco aproveita melhor os extensores de quadril"
- um número: qualquer série, repetição, percentual, RPE, quilo, minuto
- uma negação: "ele não usa deload de rotina"
- um erro que ele nomeia: "tentar ficar ereto demais no agachamento"

**Não:**
- "ele fala sobre agachamento" — não é afirmação
- "o vídeo é bem argumentado" — é opinião sua sobre o vídeo
- "ele prefere low bar e acha que a maioria agacha ereto demais e sugere mais inclinação" — são três claims espremidas em uma

O teste: se você não aponta os segundos, não é claim. É síntese, e síntese mora
em `synth/` com `basis`.

## `scope` — a distinção que a run 1 perdeu

O Matt Vena alterna entre prescrever para o espectador e narrar o próprio treino,
e a run 1 achatou os dois em prescrição. É a diferença entre "faça singles pesados"
e "eu faço singles pesados" — para um atleta natural de 87 kg copiando um cara que
agacha 400 kg, essa diferença é a coisa mais importante da base inteira.

- `GERAL` — ele está dizendo o que **você** deve fazer.
- `PESSOAL` — ele está dizendo o que **ele** faz.

Na dúvida, `PESSOAL`. Promover pessoal a geral é o erro caro; o contrário é só
conservador.

## `modo` — que tipo de afirmação é

Enumerado FECHADO, travado pelo `check-claims.mjs`. `scope` diz **para quem**;
`modo` diz **que tipo de coisa**.

| modo | quando |
|---|---|
| `prescricao` | ele manda **você** fazer. **É o único que pode virar treino.** |
| `relato-de-programa` | ele descreve o método **de outra pessoa** — 5/3/1, nSuns, PHUL, Sheiko, StrongLifts |
| `avaliacao-de-terceiro` | ele corrige **uma pessoa específica** a partir do vídeo dela |
| `opiniao` | ele acha, sem mandar fazer |
| `mecanismo` | por que funciona — fisiologia, alavanca, causa alegada |
| `fato` | afirmação sobre o mundo, verificável fora dele |
| `estudo` | ele narra literatura. Continua sendo ele contando: não vira `tier: L`. |
| `anedota` | história dele ou de terceiro |
| `narrativa` | o que aconteceu no treino, sem tese |

Os dois do meio são a distinção que a ingestão do Blevins pediu cinco vezes, de
forma independente. Metade do corpus dele é review de programa alheio, e "o nSuns
manda AMRAP a 95 % do training max" ficava indistinguível de "faça AMRAP a 95 %
do training max". Para quem monta treino a partir daqui, essa confusão é do mesmo
tamanho da que separa `GERAL` de `PESSOAL`.

**O teste, nesta ordem:**

1. Ele está enunciando o que **outro programa** manda? → `relato-de-programa`,
   mesmo que a frase esteja no imperativo. O imperativo é do Wendler, não dele.
2. Ele está falando do corpo, do vídeo ou do caso **de uma pessoa específica**?
   → `avaliacao-de-terceiro`. O contexto que justifica aquele conselho é o dela,
   e você não tem esse contexto.
3. Ele generaliza a partir do caso ("todo mundo que faz X deveria Y")? → aí sim
   `prescricao`, e a claim tem de estar escrita na forma geral.

Na dúvida entre `prescricao` e os dois, escolha um dos dois. Promover relato a
prescrição é o erro caro; o contrário é só conservador.

## O que NÃO virar claim

Preço, promoção, cupom, link de afiliado, número de inscritos, oferta de
lançamento. Não existe frame de moeda no enumerado e isso é deliberado: ninguém
vai consultar esta base para saber quanto custa o ebook de alguém, e a claim de
preço envelhece em semanas enquanto a base é escrita para durar.

Conflito de interesse **é** conhecimento e continua entrando — "ele vende o
programa que está recomendando" é uma claim legítima, `modo: fato`. O que sai é o
número.

## `certainty`

- `explicit` — ele diz. O verbatim contém a afirmação.
- `implied` — segue do que ele diz, mas com uma inferência sua no meio.

Não existe terceira opção. Se você precisa de duas inferências, é `tier: "I"`.

## Números — a superfície de risco

O corpus vem de ASR automático. Erro de palavra é quase inofensivo (`squadrons`
por `squatters` não muda nada). **Erro de número é fatal**: "3 séries" virando
"30 séries" envenena a base.

Então, para toda claim com número:

1. O número entra em `params` com `unit` **e** `frame` (ver `SCHEMA.md`).
2. O `verbatim` tem que conter o número escrito.
3. Se o número parecer implausível para o contexto (mais de 10 séries, RPE acima
   de 10, percentual acima de 110), marque `"suspect": true`. Um passe posterior
   re-transcreve esses trechos com Whisper e confere. **Não conserte por conta
   própria** — chutar o que "devia" ser dito é exatamente o que a base não pode ter.

## Negação — a outra superfície de risco

Números não são o único ponto onde o ASR estraga sentido. **Um `n't` perdido
inverte a afirmação inteira**, e ao contrário de um número absurdo isso não
parece errado: sai uma frase gramatical, plausível, e completamente ao contrário
do que foi dito.

Casos reais achados no corpus:

- `"energy availability doesn't play a role in protein metabolism"` — dito logo
  depois de ele argumentar exatamente o contrário.
- `"if you're doing none currently, any amount you add won't give you big benefits"`
  — inverte a conclusão do próprio parágrafo.

Então: se a negação de um trecho **briga com o argumento em volta**, marque
`"suspect": true` com `"suspectWhy": "negacao"`. Se a claim ficaria perigosa
estando invertida, prefira não emitir e relate no resumo final.

Números levam `"suspectWhy": "numero"`. É o mesmo passe de reparo com Whisper
que resolve os dois, e ele precisa saber o que procurar.

**Isso passou a ser travado em 2026-08-09**, depois de duas ingestões inteiras em
que o campo era enumerado no documento e não existia no código: valor fora de
`numero`/`negacao` é erro, `suspectWhy` sem `suspect` é erro, e a ausência é uma
dívida com teto (`TETO_SEM_SUSPECT_WHY = 53`, só desce). Lote novo que marcar
`suspect` sem dizer o quê estoura o teto e falha o build.

**E o valor tem de caber na escala do frame.** `RPE` e `escala_dor` vão de 0 a
10, `RIR` de 0 a 15, `pct_*` até 150. `RPE 12` não é um valor alto, é um valor
que não existe — o único da base veio do ASR partindo "2 and a half to 3 RPE" em
"2 and 12 to 3", e o extrator gravou o `12`. Se o número que você lê não cabe na
escala, **é sinal de legenda quebrada**: marque `suspect` com `suspectWhy`, não
conserte. Com `suspect` a trava vira aviso, e o passe de Whisper assume.

## `verbatim`

Copie **literal** da transcrição, em inglês, como está lá — minúsculo, sem
pontuação. Mínimo de 12 caracteres úteis, e longo o bastante para que alguém
lendo só o verbatim concorde com a claim. Não limpe, não conserte, não traduza.

O `claim` é português e é sua leitura. O `verbatim` é a evidência crua. A
distância entre os dois é o que o revisor precisa poder medir.

## O compilador roda no seu loop

Antes de encerrar, rode:

```
node research/tools/check-claims.mjs --only R014
```

Corrija tudo e rode de novo até passar limpo. **Não entregue lote com erro e não
descreva o erro no relatório em vez de consertar.** O checker confere que o
verbatim existe mesmo na transcrição, no instante declarado — se ele reclama, ou
a citação está errada ou o texto foi inventado, e as duas coisas são graves.

Aviso de transcrição ausente é aceitável; erro não.

## Não faça

- Não edite `manifest.json`, transcrições, ou lote que não é seu.
- Não crie tópico fora do vocabulário.
- Não emita `tier` diferente de `R` neste passe. Interpretação (`I`), elite (`E`)
  e literatura (`L`) entram em passes próprios, com outras regras.
- Não infira data — ela vem de `dates.json`.
- Não faça `git add .`.
