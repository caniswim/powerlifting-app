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
saude  aprendizado-motor
```

**Nunca force um número numa gaveta errada para satisfazer o checker.** Um lote
mapeou gramas e calorias para o frame `kg` e semanas para `anos` — que é
exatamente o erro de unidade que este esquema existe para impedir, reintroduzido
pelo contorno da trava. Se faltar frame, relate no resumo final e deixe o número
por extenso; aviso é barato, dado errado não é.

Precisou de um tópico que não está aqui? **Não invente.** Use o mais próximo e
registre a falta no relatório final. O vocabulário cresce por decisão, não por
acúmulo.

## Um arquivo por vídeo

As claims do vídeo `R014` vão para `research/extract/R014.jsonl`. Uma claim por
linha.

**Lote é divisão de trabalho, não unidade de conhecimento.** Você recebe um lote
de vídeos porque alguém precisava repartir a tarefa, mas o arquivo nunca é
`lote_07`: quem consulta a base parte de uma citação `[R014 @03:05]` e o caminho
tem que sair dela sozinho, sem índice no meio. Isso também torna a regeneração
idempotente — refazer um vídeo reescreve um arquivo e não mexe em mais nada.

## Alocação de id

`V{ref}-{sequência}`, começando em 01 dentro de cada vídeo:

`R014` → `V014-01`, `V014-02`, `V014-03`, …

Colisão é impossível por construção, mesmo com vinte agentes trabalhando ao mesmo
tempo, e o id carrega a procedência à vista. Nunca reutilize, nunca renumere —
contradições e sínteses vão apontar para esses ids.

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
