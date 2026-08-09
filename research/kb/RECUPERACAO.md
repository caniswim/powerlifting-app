# RECUPERAÇÃO — a base escondia o que tinha, e o conserto está na ferramenta

**Data: 09/08/2026.** Este arquivo é o conserto do modo de falha que a
`MEDICAO-02.md` mediu, e ele existe porque o conserto que aquele relatório
propôs — *"protocolo de busca em dois passes"* — não bastava.

---

## 1. O defeito, com o número na mão

A `MEDICAO-02` foi a primeira medição confiável desta base: 15 canários no
desfecho esperado, 475 ids citados resolvendo, **zero fabricação**. Placar 22
bem / 5 parcial / 2 mal, e **reprovada** pela cláusula das catastróficas.

As sete respostas não-`bem` falharam pelo **mesmo** defeito, e nenhuma por
fabricar: **declararam ausente da base algo que a base tem, com id e com `param`
tipado.**

| caso | o que o agente digitou | o que existia | por que não achou |
|---|---|---|---|
| **Q05** `mal` | `six times` → 4, todos PESSOAL | **V170-34**, **V175-53** — `GERAL` + `prescricao`, `freq_supino=6` | nunca tentou `six days a week` (**6 hits**) |
| **Q19** `mal` | `sets per muscle` → 2 | **V010-13** — `GERAL` + `prescricao`, 1–3 séries por músculo | está **doze ids depois** de V010-01, **no mesmo vídeo que ela já citava** |
| **Q16** `parcial` | vocabulário de "ciclo" | **V070-20**, **V125-07**, **V108-08** | nunca tentou `training cycle` (**86 hits**) |
| **Q11** `parcial` | a consulta certa, **com `--modo prescricao --scope GERAL`** | **V033-03/04/05** — 1 RPE ≈ 2–3 % | o número mora em **PESSOAL + `fato`** |
| **Q14** `parcial` | vocabulário de câmera | **G029-18**, **G029-28**, **G027-31** | a pergunta era de **profundidade** (87 claims) |
| **Q29** `parcial` | leu `academia` só contra "nomeia um lugar?" | **V055-21**, **V174-18**, **G048-56** | idem |

> **Uma base que esconde é mais perigosa que uma base vazia, porque a recusa dela
> é convincente.** E `nao-encontravel` × `conteudo-ausente` mandam consertos
> OPOSTOS: quatro dessas respostas mandariam a próxima rodada **comprar fonte que
> já se tem**. O `AVALIACAO.md` §4.4 já orçou uma rodada inteira contra o sintoma
> errado, uma vez.

## 2. Por que "protocolo" sozinho não era o conserto

O relatório propôs instruir o agente a buscar duas vezes. Sozinho, isso é
**instruir o agente a se esforçar mais** — e é a receita que já falhou aqui: o
modo de falha nº 1 da casa é o agente copiar a convenção errada do vizinho e
chamá-la de padrão. Uma busca que só casa substring literal vai continuar errando
`six days a week` quando se digitou `six times`, por mais protocolo que se
escreva em cima dela.

**Onde um compilador pode verificar, agente não deve.** Achar `six` dentro de
`six days a week` é exatamente o que um compilador pode fazer. Então a ordem do
conserto foi: **ferramenta → índice → protocolo**, e o protocolo ficou por
último, curto, e com ferramenta atrás dele.

---

## 3. A FERRAMENTA — `research/tools/busca.mjs`

Cinco mecanismos. Cada um ataca um caso medido, e a §6 mostra qual carrega qual.

### 3.1 Todo campo, não só a prosa
O `--grep` era regex sobre `claim` e `verbatim`. Agora casa também `params.name`,
`params.unit`, `params.value`, `params.frame` e `topic` — **`freq_supino` é o nome
do dado que a Q05 procurava e não fazia parte de busca nenhuma.**

O que casou **fora da prosa** sai contado em separado (`N casaram em
claim/verbatim — a contagem que os relatórios antigos citam — e M casaram só em
params/tópico`). Mudar em silêncio a contagem que os relatórios citam seria o
modo de falha nº 3 (documento e código divergindo sem avisar).

### 3.2 Busca por raiz e por número
A consulta vira um conjunto de raízes (plural pt+en, acento dobrado) mais os
**números** que ela contém. O número é a ponte bilíngue que não precisa de
dicionário: `six`, `seis` e `6` são o mesmo 6, e quem já sabia ler os três era o
`numerosPorExtenso`/`numerosCrus` do `kb.mjs` — **importado, não recopiado**, que
é a regra desta casa desde que duas leituras de dígito divergiram em silêncio.

Ranqueamento por IDF (termo raro decide), cobertura da consulta, bônus de frase,
e normalização por tamanho da claim. O termo numérico entra com peso 0,6: é ponte,
não evidência — com peso cheio ele virava o ranqueador.

### 3.3 As sementes: olhar em volta do pouco que se achou
**Medido, não suposto:** só com IDF, `six times` deixava V170-34 fora dos 20
primeiros. `six` e o número 6 são comuns demais para decidir sozinhos, e a outra
palavra da consulta (`times`) simplesmente não existe na claim alvo. Consulta
fraca é justamente o caso que a ferramenta existe para atender.

O que decide é o que um humano faria: os poucos resultados literais viram
**semente**, e a vizinhança é medida em relação a elas — mesmo tópico (×1,6) e
sobretudo **mesmo vídeo** (×2,2 quando a menos de 20 ids). As quatro sementes de
`six times` estão todas no tópico `frequencia`, onde V170-34 e V175-53 moram.

### 3.4 O vizinho de arquivo
A Q19 parou **doze ids antes** de V010-13, **no mesmo vídeo que já estava
citando**. O extrator emitiu as claims na ordem em que o assunto foi dito, então a
claim ao lado costuma ser a que completa a resposta — a condição que desarma a
prescrição, o "e no agacho eu uso 3 %" logo depois do "2 a 3 %". A ferramenta
puxa ±3 ids no mesmo `src` a partir do que já está na tela. Não é ranqueamento: é
abrir a página ao lado.

### 3.5 Vazio × pobre, e o filtro como suspeito
- **Vazio** (`0 hits`) e **pobre** (`< 8 hits`) saem com banners diferentes e
  texto diferente, porque mandam consertos opostos e até hoje tinham a mesma
  cara. O piso 8 é julgamento declarado: **o dobro da pior falha medida** (as
  buscas cegas devolveram 4 e 2). `--piso` sobrescreve.
- **O filtro é reportado como suspeito.** Com filtro ativo, cada um é removido em
  separado *e* os de segurança (`modo`/`scope`/`tier`/`genero`) são removidos
  **todos juntos** — porque no caso Q11 remover um por vez não revela nada (a
  claim é barrada pelo outro), e a remoção uma-a-uma teria dito, com ar de rigor,
  que o filtro não escondia nada. `--topic` também é reportado: foi ele o culpado
  na Q14.

### 3.6 O que a ferramenta NÃO é
Não é busca semântica e não vai virar. Não há banco vetorial e **não vai haver**:
o consumidor é um modelo de janela grande lendo arquivos, a busca é grep, e isso
é restrição dura e provavelmente vantagem — o que se recupera é auditável. Um
sinônimo que não compartilha raiz nem número com a consulta continua inalcançável
por aqui. Esse buraco é fechado à mão, e é a §4.

---

## 4. O ÍNDICE — `research/kb/VOCABULARIO.md`

Nesse mundo sem embedding, o índice faz o trabalho que o embedding faria. Por
tópico: os sinônimos, o inglês, a expressão que **o canal de fato usa** —
derivada do corpus (`vocabularioDoTopico` lista os termos e bigramas distintivos
de qualquer tópico), escrita à mão, com a nota de *por que a busca ingênua falha
ali*.

Duas coisas o tiram de "documento que ninguém lê":

1. **Ele é executável.** `busca.mjs` expande a consulta com a seção que ela toca.
   Quem digita `training cycle` recebe `ciclo de treino`; quem digita `six times`
   recebe `six days a week`. Termos emprestados entram com peso 0,45 e a saída
   declara de qual seção vieram — palpite do índice não pode se passar por
   palavra do usuário. E uma **expressão do índice casada inteira** vale bônus:
   é o índice dizendo "é assim que se fala disto" e a claim dizendo exatamente
   isso.
2. **Ele tem trava.** `check-vocabulario.mjs`, dentro do `npm run check:kb`:
   - todo termo de `usa:` tem de casar **≥1 claim daquele tópico** — termo morto
     manda o próximo agente buscar palavra que não existe, **e confirma, com a
     autoridade do índice, uma lacuna que não existe**;
   - todo termo de `não usa:` tem de casar **zero na base inteira** — se
     ressuscitar, a nota que explica a falha virou falsa.

   Nenhum dos dois lados é derivado do outro nem de si mesmo: os termos são
   escritos à mão e conferidos contra o corpus. É a diferença entre esta trava e
   a **trava que se testa a si mesma**, que é o modo de falha nº 4 desta casa e
   aconteceu três vezes num dia só. **A trava já pagou:** a primeira redação da
   seção `frequencia` listava `six days per week` como morto, e o checker recusou
   o arquivo na primeira execução — V114-19 diz exatamente isso.

**Cobertura, declarada: 10 dos 74 tópicos** — os seis que falharam na medição
(`frequencia`, `acessorios`, `periodizacao`, `rpe`, `profundidade`,
`equipamento`) e quatro que governam o peitoral deste atleta (`supino`, `lesao`,
`dor`, `volume`). Nos outros 64 a busca é só raiz + número.

**A linha mais importante do índice é um zero:** em `## lesao`, os termos
`pec tear`, `torn pec`, `fisioterapeuta`, `physical therapist`, `see a doctor` e
`ver um médico` casam **zero claims na base inteira**, e a trava reconfere isso a
cada execução. É o agravante da `MEDICAO-02` §6.2 virado predicado: *uma resposta
fiel à base é uma resposta que nunca manda ele procurar ninguém.*

---

## 5. O PROTOCOLO — quatro linhas, e agora com ferramenta atrás

1. **Nenhuma declaração de ausência vale se a busca que a sustenta carregava
   `--modo` ou `--scope`.** Busque sem filtro; classifique depois. (A ferramenta
   avisa, mas a regra é sua.)
2. **Poucos resultados são a BEIRADA do assunto, não o assunto.** Abaixo de 8, a
   ferramenta abre a vizinhança sozinha — leia-a antes de escrever "a base não
   tem".
3. **Leia os vizinhos do id que você já achou.** Doze ids depois, no mesmo vídeo.
4. **Antes de declarar lacuna de conteúdo, rode `--vocab <topico>`** e confira
   contra a palavra que o canal usa. Se o tópico não tiver seção no
   `VOCABULARIO.md`, escreva uma — é o trabalho mais barato desta camada.

---

## 6. A PROVA — contra os quatro casos medidos

### 6.1 Q05: a busca que a Q05 fez acha V170-34?

```
$ node research/tools/check-evidence.mjs --grep "six times"

4 claim(s) para /six times/i:
  … V015-03, V053-07, V152-19, V170-04 — os mesmos 4 de antes, todos PESSOAL …

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠  RESULTADO POBRE — 4 de 6912, abaixo do piso de 8.
     Precedente (MEDICAO-02): `six times` devolveu 4, a resposta concluiu que a base
     só tinha log pessoal, e as duas claims GERAL+prescricao estavam sob `six days a
     week`. Poucos resultados são a BEIRADA do assunto, não o assunto.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A consulta foi EXPANDIDA pelo research/kb/VOCABULARIO.md:
     ## frequencia  (casou `times per week`)  →  `six days a week` · `days a week` · …

  VIZINHANÇA — 40 claim(s) por raiz e por número, ordenadas por raridade
  do termo, proximidade de tópico e MESMO VÍDEO. …

   1º  casou: six, freq, #6, frequency, x, high …+8  ·  mesmo tópico  ·  mesmo vídeo, 30 ids
      V170-34  R170@07:30  tier:R scope:GERAL modo:prescricao genero:aula explicit
        tópicos: supino, frequencia, volume, hipertrofia
        A chave para o supino é seis dias por semana ou outra frequência alta, bem
        submáximo, alto volume, mais muito trabalho acessório de hipertrofia.
        params: freq_supino=6 dias/semana [x_semana]
        verbatim: "is just six days a week or some other high frequency very sub
                   maximal high volume and also tons of accessory hypertrophy work"
        condições: V170-36, V170-44
```

**Sim.** V170-34 sai em **1º**, com as duas `conditions` que a desarmam junto —
que é o caso canônico do `SCHEMA.md`. V175-53 sai no índice compacto da mesma
vizinhança.

### 6.2 Q19

```
$ node research/tools/check-evidence.mjs --grep "sets per muscle"
2 claim(s) para /sets per muscle/i:   (V010-01, V145-28 — os mesmos 2 de antes)
…
   1º  casou: per, muscle, isolamento, trabalho, serie, volume …+2  ·  mesmo tópico  ·  mesmo vídeo, 12 ids
      V010-13  …  scope:GERAL modo:prescricao
        No trabalho de isolamento, ele costuma achar que 1 a 3 séries por músculo é o
        que dá para bancar.
        params: series_isolamento_min=1  series_isolamento_max=3
        condições: V010-14, V010-02
```

**1º lugar, e a saída diz "mesmo vídeo, 12 ids"** — a distância exata que a
`MEDICAO-02` registrou.

### 6.3 Q11 — o filtro, não o vocabulário

```
$ node research/tools/check-evidence.mjs --grep "2 a 3%" --modo prescricao --scope GERAL
1 claim(s) para /2 a 3%/i · modo=prescricao · scope=GERAL:   (V099-09)
…
   4º  V033-03  …  scope:PESSOAL modo:fato
        Para ele, subir 1 RPE na barra corresponde a cerca de 2 a 3% de peso.
…
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠  O FILTRO É QUE ESTREITOU — não necessariamente a base.
     modo=prescricao + scope=GERAL JUNTOS: 1 com eles, 3 sem eles — escondem 2 claim(s)
        V033-03(PESSOAL/fato) V050-21(PESSOAL/fato)
        sem eles: node research/tools/check-evidence.mjs --grep "2 a 3%"
     REGRA: declaração de ausência não vale se a busca que a sustenta carregava
     --modo ou --scope. Busque primeiro SEM filtro; classifique depois.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

`1 com eles, 3 sem eles` é literalmente o número que a `MEDICAO-02` §7 registrou.
V033-04 e V033-05 entram pelo vizinho de arquivo (mesmo `src`, ids adjacentes).

### 6.4 Quem carrega quem — a atribuição, medida

Rodando cada busca cega com e sem cada mecanismo, contra as 6.912 claims:

| canário | busca cega | completo | sem `VOCABULARIO.md` | sem sementes/vizinho |
|---|---|---|---|---|
| C16 | `six times` | 2/2 | 2/2 | 2/2 |
| C16 | `6 vezes por semana` | 2/2 | **0/2** | 2/2 |
| C17 | `sets per muscle` | 1/1 | 1/1 | 1/1 |
| C18 | `training cycle length` | 2/2 | 2/2 | **1/2** |
| C19 | `2 a 3%` + filtro | 3/3 | 3/3 | **1/3** |

**Nenhum mecanismo é decorativo, e nenhum sozinho resolve tudo.** Raiz+número
basta para C16/C17; o índice é o único caminho para a consulta em português de
C16; as sementes e o vizinho de arquivo são o que salva C18 e C19.

---

## 7. A QUARTA FAMÍLIA DE CANÁRIO — `presente-escondido`

As três famílias antigas medem **fabricar**, **responder de fora** e **promover
escopo**. Nenhuma media **esconder** — e os 15 canários passaram todos numa
rodada em que 7 de 7 respostas ruins falharam exatamente por isso. *O instrumento
estava cego para o modo de falha da rodada que ele mediu.*

C16–C19 saem dos quatro casos reais, com os ids que o julgador confirmou. Cada um
carrega em `buscaCega` **o que a medição registrou que o agente digitou**, e o
`check-canarios.mjs` cobra **os dois lados**:

1. a busca cega, **literal e sobre a prosa** (o `--grep` de antes), continua **não
   achando** os ids. Se achar, o esconderijo acabou e o canário virou um
   `presente` comum — falha com `DEIXOU DE SER ESCONDIDO`;
2. a mesma busca cega, passada pela camada de recuperação, **acha todos** dentro
   das 40 primeiras — o que cabe na tela. Falha com `A CAMADA DE RECUPERAÇÃO
   REGREDIU`, e a mensagem diz, em voz alta: *isto não é perda de conteúdo, não
   saia comprando fonte nova.*

**Isto não é uma trava que se testa a si mesma.** Os termos vêm da medição, os
ids vêm do julgador, e as duas cobranças apontam em direções opostas — nenhum
lado é derivado do outro. Além disso `check-evidence.mjs` e `check-canarios.mjs`
usam **a mesma função** `recuperar()`: se fossem duas implementações, o canário
estaria medindo a si mesmo.

**Prova de que os canários mordem** (regressão simulada: `pobre = false` em
`busca.mjs`, o que desliga a vizinhança):

```
✗ canário C16: A CAMADA DE RECUPERAÇÃO REGREDIU — a busca cega "six times" não
  devolve V170-34, V175-53 dentro das 40 primeiras.
✗ canário C17: … "sets per muscle" não devolve V010-13 …
✗ canário C18: … "training cycle length" não devolve V070-20, V108-08 …
✗ canário C19: … "2 a 3%" (com --modo prescricao --scope GERAL) não devolve
  V033-04, V033-05 …
```

Revertida a regressão, os 19 voltam a verde. `npm run check:kb` encadeia tudo,
então **canário de recuperação morto quebra o build**.

---

## 8. O QUE CONTINUA INALCANÇÁVEL — e é a parte que não pode faltar

### 8.1 O sinônimo que não compartilha raiz nem número
`ciclo` e `cycle`, `peitoral` e `pec`, `agacho` e `squat`. **Nenhuma
radicalização junta esses pares**, e nenhuma vai juntar sem dicionário. É o único
buraco que o índice fecha, e o índice cobre 10 de 74 tópicos.

**O exemplo concreto, e ele é um dos ids da Q16: V125-07** — *"16 semanas é a
duração ótima de um ciclo de treino"*, `GERAL`, com `param duracao_ciclo=16`.
Medido: a partir de `training cycle length` ela sai em **60º**, fora do teto de
40. Ela **não** está em `sustenta` de C18 por isso, e não vou fingir que está.
O caminho que funciona é de dois passos, e é o que o `VOCABULARIO.md` existe para
encurtar: `--vocab periodizacao` → a seção diz `ciclo de treino` → o grep literal
dessa expressão devolve V125-07 na hora. **A ferramenta não fecha este caso; o
índice mais uma consulta fecham.**

### 8.2 A pergunta escrita como pergunta
`duração do ciclo`, `quantas semanas`, `how long should a block be` casam **zero**
e não são resgatadas. As claims são declarativas; a consulta interrogativa não
compartilha quase nada com elas. Registrado em `## periodizacao` sob `não usa:`.

Medido, e o resultado é ambíguo de um jeito que vale registrar:
`--busca "quanto peso tirar da barra por ponto de RPE"` devolve **V050-21**
(*"1 ponto de RPE equivale a cerca de 2 a 3 % do máximo"*) e **não** devolve
V033-03. A resposta certa sai; **o id que a `MEDICAO-02` nomeou, não.** Para
responder ao atleta isso basta; para um canário, não — canário que aceita
"qualquer claim equivalente" mede menos do que parece, e por isso C19 usa a busca
`2 a 3%` com o filtro da Q11, que é o que a medição de fato registrou.

### 8.3 O que a §6.4 não mediu
A atribuição da §6.4 é sobre os **quatro casos que já sabíamos**. Ela não é
estimativa de recall na base inteira, e não existe estimativa dessas aqui: para
tê-la seria preciso um conjunto de pares (pergunta, ids corretos) muito maior que
19. **Este documento prova que quatro buracos conhecidos fecharam. Ele não prova
que não há um quinto.**

### 8.4 Os dois casos da medição que NÃO viraram canário
Q14 (câmera × profundidade) e Q29 (academia) estão no `VOCABULARIO.md` com os
termos e as notas, mas **não** viraram `presente-escondido`. Medido, a partir de
`camera angle depth judging`: G029-28 sai em **22º** (dentro do teto), G027-31 em
**49º** e G029-18 em **98º** — os dois últimos fora. Um canário que exigisse os
três falharia de nascença, e canário vermelho permanente é como se desliga uma
trava.

E o diagnóstico honesto de Q14 não é de vocabulário: é de **tópico errado**. A
resposta procurou no assunto errado, e o que serve ali é o alargamento de
`--topic`, que já sai na saída. Fica registrado como dívida: quando `## tecnica`
e `## setup` tiverem seção no índice, vale reavaliar.

### 8.5 O piso 8 é julgamento
Não é derivado de nada além das duas falhas medidas (4 e 2). Se aparecer uma
terceira falha de recuperação com mais de 8 hits literais, o número sobe **com a
medição na mão**, e não por palpite.

### 8.6 O limite de sempre
O determinismo desta camada prova **fidelidade à recuperação**, não **correção da
fonte**. Achar V170-34 é um ganho de recuperação; V170-34 continua sendo
*"supine seis dias por semana"* dito por um homem que não compete testado, para
um atleta com o peitoral rompido há quatro meses. O que a torna segura são as
`conditions` (V170-36, V170-44) e o `modo` — não o fato de a busca a ter achado.

---

## 9. Procedência

- **Arquivos novos:** `research/tools/busca.mjs`, `research/tools/busca.test.mjs`
  (35 casos), `research/tools/check-vocabulario.mjs`,
  `research/kb/VOCABULARIO.md`, este arquivo.
- **Arquivos alterados:** `research/tools/check-evidence.mjs` (usa `recuperar()`,
  ganha `--busca`, `--vocab`, `--piso`, `--vizinhos`),
  `research/tools/check-canarios.mjs` (quarta família),
  `research/tools/check-canarios.test.mjs` (6 casos novos, 41 no total),
  `research/kb/CANARIOS.json` (C16–C19; 19 canários), `package.json`
  (`check:kb` encadeia `busca.test.mjs` e `check-vocabulario.mjs`),
  `research/RUNBOOK.md`.
- **Base no momento:** **6.912 claims** (a `MEDICAO-02` mediu 6.909; o
  `check-canarios.mjs` reporta a deriva de +3 em tier R). Todos os números deste
  arquivo foram reproduzidos por script contra `research/extract/*.jsonl`
  durante a escrita.
- **`npm run check:kb`:** verde, exit 0 — 19 canários (5 presente ·
  4 presente-escondido · 5 impossivel · 5 armadilha), 73 termos vivos e 26 termos
  mortos declarados no índice, todos reconferidos.
- **O que NÃO foi feito:** `AVALIACAO.md` continua **intocado** — o instrumento
  fica estável para a terceira medição. Nenhuma claim foi editada, nenhuma fonte
  foi ingerida. Este trabalho é inteiramente de recuperação.
