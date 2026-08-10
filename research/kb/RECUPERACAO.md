# RECUPERAÇÃO — a base escondia o que tinha, e o conserto está na ferramenta

> **VEREDITO — 10/08/2026, medido pelos canários `presente-escondido` P01–P18 de
> `research/kb/CANARIOS.json`, contra 6.912 claims, teto de tela 40.**
>
> **NÃO. A camada de recuperação não acha o que a base tem: 0 de 18 perguntas
> escritas na voz do atleta devolvem todos os ids que respondem, 3 de 18 devolvem
> algum, e em 7 de 18 nenhuma gaveta aberta contém a resposta.** O número sai
> impresso a cada `node research/tools/check-canarios.mjs`; verde ali quer dizer
> que a medida não mudou, não que a camada acha.

**Data: 09/08/2026.** Este arquivo é o conserto do modo de falha que a
`MEDICAO-02.md` mediu, e ele existe porque o conserto que aquele relatório
propôs — *"protocolo de busca em dois passes"* — não bastava.

> **ADENDO DE 10/08/2026 — leia antes dos §1–§9.** A camada descrita abaixo
> (`busca.mjs`, `--busca`) **reprovou no ataque cego de 09/08** e ganhou uma
> segunda porta, que hoje é a principal: **`--pergunta`, que resolve
> *pergunta → tópico → claims*** em vez de *pergunta → texto*. A **PARTE II**
> (§10 em diante) descreve a porta nova, mede o que ela fecha e o que não
> fecha, e registra as duas regras de higiene que os §1–§9 violaram.
>
> **Os §1–§9 continuam válidos e não foram reescritos.** Eles descrevem a porta
> livre, que continua existindo, continua sendo o instrumento certo para *"quem
> diz exatamente isto?"*, e continua sendo cobrada por canário. O que mudou é
> qual porta um agente abre primeiro para responder ao atleta: **é a nova.**

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

---
---

# PARTE II — A PORTA NOVA: `pergunta → tópico → claims`

**Data: 10/08/2026.** A PARTE I acima é de 09/08 e continua de pé. Esta parte
existe porque a camada dela **reprovou no ataque cego do mesmo dia**, e porque
as três reprovações apontam todas para o mesmo lugar.

---

## 10. Por que a busca livre estava resolvendo um problema já resolvido

Os três furos do ataque, e o terceiro é o que muda o desenho:

1. **A precisão foi destruída pela expansão de vocabulário.** Uma seção inteira
   do `VOCABULARIO.md` disparava quando **uma** palavra de 4+ letras casava, e
   `semana` está em toda pergunta de planejamento. Medido:
   `--busca "quantas horas de sono por semana"` devolvia **0 de 40** claims sobre
   sono e punha **V170-34/V170-33 — *supinar seis dias por semana* — em 1º e 2º**.
   *Para um atleta com o peitoral rompido há quatro meses.* Consertado no mesmo
   dia (`longas.every`), e **nada travava o conserto**.
2. **`TETO_VIZINHANCA` era os dois lados da comparação.** O canário importava a
   constante da ferramenta que ele mede: `40 → 400` deixava o `check:kb` inteiro
   verde.
3. **`busca.test.mjs` roda sobre 12 claims sintéticas** e não cobre a fiação:
   `const relaxada = false` apagava a vizinhança inteira e os 35 casos passavam.

E o caso que decidiu o desenho: **`descanso-entre-series`**.
`--busca "quanto descansar entre as séries"` devolvia, do conjunto todo, **só
G015-11** — `relato-de-programa` do GZCLP, exatamente a gaveta que esta base
manda nunca tratar como prescrição. `--topic descanso-entre-series` devolve as
**12** na hora, com `param` tipado em minutos.

> **A base já tinha resolvido o problema que a busca livre estava tentando
> resolver.** Existe um vocabulário **FECHADO de 74 tópicos**, declarado no
> `PROTOCOLO-EXTRACAO.md`, cobrado pelo `check-claims.mjs` em **toda** claim.

O roteamento certo é **pergunta → tópico → claims**, e ele é melhor por três
razões — a terceira é a que decide:

1. **o alvo é fechado e pequeno**: 74 gavetas, não 6.912 textos;
2. **mapear pergunta a assunto é o que um modelo faz bem**, e a base já mapeou
   cada claim ao assunto dela uma vez, na extração;
3. **um compilador pode conferir o resultado.** Tópico inventado é **erro**, não
   silêncio. Uma busca por texto que erra devolve lixo plausível; um roteamento
   que erra devolve um nome que ou está na lista fechada ou é recusado por
   `rotasValidas()` — e `responder()` **lança** se algum passar.

O texto livre não sai de cena: ele **desce um nível**. Deixa de ser a porta e
vira a **ordenação dentro do tópico**, medida com `df` recontado **dentro** do
tópico (`subIndice`) — porque `squat` não distingue nada entre 990 claims de
agacho.

---

## 11. A FERRAMENTA — `research/tools/roteador.mjs`

### 11.1 De onde vem o sinal do mapeamento — três canais, nenhum inventado

| canal | o que é | cobertura |
|---|---|---|
| **corpus** | para cada tópico, quais raízes aparecem MUITO nele e pouco fora (`perfilarTopicos`, `pesoDoTermo`) | **os 74**, sem ninguém escrever nada |
| **nome do tópico** | dado da lista fechada: `descanso-entre-series` casa a pergunta que diz "descanso entre séries" | os 74 |
| **`VOCABULARIO.md`** | expressão de duas palavras ou mais, casada INTEIRA, **confirma** um tópico | 10 dos 74 |

O peso de um termo para um tópico é **frequência dentro × log do lift**.
`log(lift)` sozinho premia o acidente (uma raiz em 2 claims da base, as duas no
mesmo tópico, teria lift 3.000); multiplicar pela frequência dentro é o que
transforma *"esta palavra é rara fora"* em *"esta palavra é a palavra deste
assunto"*. Lift ≤ 1 vale **zero**, e não negativo: palavra comum não é evidência
CONTRA um assunto.

**O canal do corpus fecha de graça o buraco que o §8.1 declarou inalcançável.**
`ciclo` e `cycle` não compartilham raiz nenhuma e nenhuma radicalização os junta
— mas **as duas são fortemente distintivas de `periodizacao`**, porque a claim é
pt-BR e o `verbatim` é inglês e as duas línguas moram no mesmo tópico. Medido:
`assinaturaDoTopico(PERFIS, 'periodizacao')` traz `ciclo` **e** `cycle`, e há um
caso em `roteador.test.mjs` que exige isso. **Sem dicionário e sem embedding.**

**O uso do `VOCABULARIO.md` aqui é o OPOSTO do que quebrou a precisão em 09/08.**
Lá ele **injetava termos na consulta**; aqui ele apenas **confirma um tópico**.
Confirmação errada custa um nome a mais numa lista de no máximo cinco, impressa
com o termo e a contagem que a justificam. Injeção errada custava *supinar seis
dias por semana* no topo de uma pergunta sobre sono.

### 11.2 A família de prefixo, e por que ela existe SÓ no roteamento

A pergunta é escrita por humano e conjuga (*agachando*, *supinar*, *descansar*);
a base é declarativa e nomeia (*agachamento*, *supino*, *descanso*). A
radicalização de `busca.mjs` é plural e só plural — de propósito, porque stemmer
erra em silêncio dentro de um texto metade inglês.

Aqui a assimetria é legítima, e vale escrever por quê: **o custo de um erro de
prefixo no roteamento é limitado e visível.** No pior caso acrescenta um nome a
uma lista curta, que sai impressa com a justificativa e que um compilador confere
contra a lista fechada.

A regra é a mais burra que resolve: **5 letras iniciais em comum, valendo ≥ 0,6
da palavra mais curta, com diferença de comprimento ≤ 5.** Os três números foram
medidos nos dois sentidos antes de serem escritos:

- casam: `agachando`/`agachamento`, `descansar`/`descanso`, `treinando`/`treino`,
  `peitoral`/`peito`, `joelheira`/`joelho`;
- **não** casam: `powerlifting`/`powerbuilding` (5 de 12 — dois assuntos com
  opinião oposta um sobre o outro nesta base), `power`/`powerlifting` (diferença
  7 — sem esta terceira condição, *"preciso fazer cardio treinando
  powerlifting?"* roteava para `powerbuilding` (5 claims) na frente de `cardio`
  (230)), `pesado`/`pesagem`, `cinto`/`cintura`, `banco`/`bancada`,
  `morto`/`morte`.

### 11.3 Os dois canais que NÃO são roteamento, e por que saem em seções próprias

**O NOME DO PARAM.** `peso_por_rpe_min` não é prosa: é o dado que a Q11
procurava, tipado, com `frame` e unidade. Uma pergunta que diz *"quanto **peso**
quando o **RPE** vem acima do alvo"* nomeia **duas** peças desse nome — e a claim
que carrega o param é a resposta **mesmo quando a prosa dela não compartilha
verbo nenhum com a pergunta** (a claim diz *subir*; a pergunta diz *baixar*).
Duas peças e não uma, porque `peso` sozinho está em metade dos params da base.

Ele sai como seção própria e não misturado ao roteamento, e a razão é medida:
bônus multiplicativo dentro do tópico levantou o alvo da Q11 de 72º para 47º
(ainda fora da tela) **e empurrou o alvo da Q19 para fora**. Canal separado só
acrescenta.

**A PÁGINA AO LADO.** É a regra 3 do protocolo do §5, e a porta nova **nasceu
sem ela** — a medição de 10/08 mostrou o custo: V033-05 (*"3 % para mim, que
agacho 800 lb, são 25 lb"*) **não chega por canal nenhum**. `pct_por_rpe` nomeia
uma peça só, e a prosa dela fala de 800 lb e 25 lb, não de RPE. Ela chega por ser
a claim **imediatamente adjacente** a V033-04, no mesmo vídeo.

`vizinhosNoMesmoSrc` é **uma função só, usada pelas duas portas** — duas cópias
divergiriam em silêncio, que é o modo de falha nº 3. Extraí-la obrigou a
consertar dois defeitos que a versão embutida tinha:

- **corte por ordem de fila.** Servir cada foco até o limite antes de passar ao
  próximo faz o primeiro comer o orçamento inteiro: medido, os seis primeiros
  focos do canal de param consumiam as 12 vagas e V033-05 nunca era alcançada.
  É o mesmo defeito que esta ferramenta denuncia no banner de alargamento de
  filtro, cometido dentro dela.
- **ordem de arquivo decidindo distância.** *Abrir a página ao lado* é literal:
  o vizinho de distância 1 vem antes do de distância 2. Sem ordenar, quem
  decidia era a ordem de varredura, e a claim anterior ganhava da seguinte por
  acidente.

### 11.4 A etiqueta erra, e a afinidade é quem conserta

O `topic` foi escrito claim a claim, por lote, por agentes diferentes. Ele é
fechado e é conferido pelo compilador — **mas conferido contra a lista, não
contra o conteúdo**. Medido, e é o caso que originou a peça:

> **V038-07** — *"pode haver benefício em descansar 8 minutos em vez de 5"*,
> `GERAL`, `descanso_longo=8 min` — está etiquetada `recuperacao, agacho, terra`.
> **Não** está em `descanso-entre-series`. **V074-10** — *"descansar 10 minutos
> ajuda o agacho"* — idem.

Rotear para `descanso-entre-series` e olhar só as 12 claims declaradas devolve
**uma** das três que a pergunta pedia. **Roteamento puro por etiqueta herda todo
erro de etiquetagem, em silêncio** — o mesmo modo de falha da camada de ontem com
outra roupa.

A `afinidade` é o perfil do tópico aplicado de volta a cada claim: *esta claim
fala como as claims deste tópico falam?* A saída marca **`declarado` × `afim`**
de forma diferente, porque afirmar que uma claim está num tópico em que ela não
está é uma mentira barata de contar e cara de descobrir. E a claim afim vale
**0,6** da declarada: sem o desconto, *"quantas horas de sono por semana"*
devolvia em 1º, 2º e 4º claims de `cardio` — porque `hora` é raro dentro do
conjunto de `sono` e "horas de cardio" casava melhor que "dormir". **0,6 e não
zero**, porque eliminar seria a trava estreita do modo de falha nº 2, e é por
aqui que as claims da C20 que a etiqueta esqueceu entram.

**Tópico forçado não ganha afins**, e a assimetria é a razão de a afinidade
existir: ela conserta a etiqueta quando o ROTEADOR está adivinhando a gaveta;
quando um humano digita `--topic cinto`, ele não está adivinhando. Medido:
`cinto` tem 54 claims declaradas, e com 60 afins junto o par F001-83/F001-84 (as
duas dimensões do regulamento IPF, tier O, tipadas) caía para 64º e 67º.

---

## 12. OS DOIS CASOS QUE MORDEM

### 12.1 A pergunta que não mapeia para tópico nenhum

**Dizer isso é melhor que devolver lixo** — e há **duas** maneiras de não mapear,
que mandam consertos opostos. É a mesma distinção `vazio` × `pobre` do §3.5, um
nível acima, e a `MEDICAO-02` §2.2 mediu que confundi-las custa uma rodada de
aquisição inteira.

```
$ node research/tools/check-evidence.mjs --pergunta "qual a capital da França?"
  palavras de assunto: capital franca
  ⚠  2 NÃO existe(m) em claim nenhuma: capital, franca

  ⚠  ESTA PERGUNTA NÃO MAPEIA PARA NENHUM DOS 74 TÓPICOS.
     FORA DE DOMÍNIO: nenhuma palavra de assunto desta pergunta aparece em
     claim nenhuma. A base não fala disto, e dizer isso é a resposta certa.
```

```
$ node research/tools/check-evidence.mjs --pergunta "quem ganhou o Oscar de melhor filme?"
  ⚠  ESTA PERGUNTA NÃO MAPEIA PARA NENHUM DOS 74 TÓPICOS.
     SEM ASSUNTO: as palavras existem na base, mas nenhuma DISTINGUE um tópico
     — são palavras que aparecem em todo lugar. Reescreva a pergunta com o
     substantivo do assunto (o exercício, a variável, o equipamento), ou use
     --topic <tópico> para escolher a gaveta você mesmo.

     os mais próximos, TODOS abaixo do piso de 0.65:
       bulking                  0.61  (ganhou)
       …
     ISTO NÃO É "A BASE NÃO TEM". É "esta pergunta não achou a gaveta".
```

A última linha é deliberada: **a recusa do roteamento nunca pode ser lida como
lacuna de conteúdo**, que é o erro que a `MEDICAO-02` orçou uma rodada contra.

**O piso é 0,65, e ele é julgamento com a medição ao lado.** As duas populações
que o fixam moram no `ROTAS.json` — 25 perguntas na voz do atleta que **têm** de
mapear, 10 que **não podem** —, e foram escritas **antes** de o piso ter valor.
`check-rotas.mjs` roda as duas a cada execução e reporta a margem:

```
ℹ  calibração do piso: 25 perguntas de dentro (menor score 0.72) × 10 de fora (maior 0.61)
```

**A margem é estreita de um lado só, e está escrita para não ser confundida com
folga**: o pior caso de fora é *"quem ganhou o Oscar de melhor filme?"*, porque
`ganhou` é palavra desta base (ganhar peso, ganhar massa). Se as duas populações
se cruzarem, o checker **recusa** com a mensagem certa: *não existe piso que
separe as duas; o roteamento precisa de sinal NOVO, não de um número diferente.*

E **a trava não sabe qual é o piso**: ela afirma *"toda pergunta de dentro mapeia,
nenhuma de fora mapeia"*, que é a coisa que se quer verdadeira. Mover o piso para
qualquer lado quebra um dos dois lados.

### 12.2 A pergunta que mapeia para tópico grande demais

`agacho` tem **990**. Três coisas saem na tela, e nenhuma é "confie no rank":

1. **o tamanho, ao lado do nome** (`← GRANDE`), porque ver 40 de 990 não é ver o
   assunto;
2. **a gaveta INTEIRA como comando**, com a nota `(cabe numa leitura)` quando o
   tópico é pequeno. Para `cinto` (54) **ver tudo é estritamente melhor que
   ranquear**;
3. **o estreitamento que de fato funciona**: entre as claims que a pergunta
   puxou, quais **outros** tópicos aparecem junto — com o comando pronto.
   **Cruzar dois tópicos é filtro de conjunto, verificável — não mais uma
   palavra.**

E a ordenação interna usa raridade recontada **dentro** do tópico, mais o peso da
rota **ao quadrado** da razão para o primeiro colocado: um segundo tópico com
70 % do score contribui com 49 %, um com 40 % contribui com 16 %. Isso admite o
tópico secundário (recall) sem deixá-lo disputar o topo da tela (precisão).
Linear, o quarto tópico de uma lista empatada empurrava claim de outro assunto
para o 1º lugar — **que é o defeito de 09/08 com outra roupa**.

---

## 13. A PROVA — contra os casos MEDIDOS, com o comando e a saída

Posições medidas em 10/08/2026 contra as 6.912 claims. `lista` é a lista roteada
(40 na tela: 8 inteiras + índice); `param` é o canal do nome do param (12 na
tela); `ao lado` é a página ao lado.

### 13.1 Q05 — `six times` × `six days a week`

```
$ node research/tools/check-evidence.mjs --pergunta "posso supinar seis vezes por semana?"

  ROTEOU PARA 2 de 74 tópicos do vocabulário FECHADO:

     frequencia  ·  score 1.99  ·  245 claims etiquetadas  ← GRANDE
         0.81  semana                       em 124 das 245 claims do tópico, 669 na base
         0.50  vezes por semana             VOCABULARIO.md
         0.46  vez                          em 66 das 245 claims do tópico, 315 na base
         0.14  supinar → supino             em 45 das 245 claims do tópico, 557 na base

     supino  ·  score 1.83  ·  694 claims etiquetadas  ← GRANDE
         1.25  supinar → supino             em 429 das 694 claims do tópico, 557 na base
         0.90  supino                       nome do tópico
   …
   4º  frequencia + supino
      V170-34  R170@07:30  tier:R scope:GERAL modo:prescricao genero:aula explicit
        A chave para o supino é seis dias por semana ou outra frequência alta, bem
        submáximo, alto volume, mais muito trabalho acessório de hipertrofia.
        params: freq_supino=6 dias/semana [x_semana]
        condições: V170-36, V170-44
```

**V170-34 em 4º, V175-53 em 7º.** A pergunta nunca disse `six`, `days` nem
`week` — disse *"supinar seis vezes por semana"*. E as duas `conditions` que
desarmam V170-34 saem junto, que é o caso canônico do `SCHEMA.md`.

### 13.2 Q16 — o ciclo, e o par `ciclo`/`cycle` sem dicionário

```
$ node research/tools/check-evidence.mjs --pergunta "quanto tempo deve durar um ciclo de treino?"

     periodizacao  ·  score 1.01  ·  332 claims etiquetadas  ← GRANDE
         0.53  ciclo                        em 90 das 332 claims do tópico, 250 na base
         0.50  ciclo de treino              VOCABULARIO.md
         0.14  treino                       em 55 das 332 claims do tópico, 465 na base
```

**V070-20 em 1º, V125-07 em 7º, V108-08 em 14º.** Os três dentro da tela.

**V125-07 é o caso que o §8.1 declarava inalcançável** — *"16 semanas é a duração
ótima de um ciclo de treino"*, com `param duracao_ciclo=16`. Pela porta livre ela
saía em **60º** a partir de `training cycle length`, fora do teto de 40, e o §8.1
escreveu, com todas as letras, que *"a ferramenta não fecha este caso"*. **Ela
está fechada.** O que a fecha não é vocabulário novo: é a gaveta.

### 13.3 Q19 — doze ids depois, no mesmo vídeo

```
$ node research/tools/check-evidence.mjs --pergunta "quantas séries por músculo por semana?"

  ROTEOU PARA 5 de 74: proximidade-da-falha(132), frequencia(245), series-reps(367),
                       hipertrofia(355), volume(750)
```

**V010-13 em 25º**, dentro da tela, no índice compacto. A `ONDA-2B` §10 registrou
este caso como *"destravado, frágil"* pela porta livre; aqui ele é estrutural — a
claim mora nas gavetas que a pergunta abriu.

**E é o caso que mostra por que a cobertura não pode ser trava estreita:** com
piso de cobertura valendo para todo canal, esta pergunta roteava para `taper` (só
`semana` casou) e para `descanso-entre-series` (só `serie`), e os dois ocupavam
as vagas de `hipertrofia` e `volume` — onde V010-13 mora. Coincidência de uma
palavra não é assunto; nome de gaveta é.

### 13.4 Q11 — o filtro de segurança, e a formulação REALISTA

A `ONDA-2B` §10 registrou que a Q11 na formulação realista devolvia **zero** de
V033-03/04/05 pela porta livre, e que o C19 só passava porque a busca cega dele
(`2 a 3%`) **já contém a resposta** — *nenhum agente digita `2 a 3%` sem já saber
o número*.

```
$ node research/tools/check-evidence.mjs --pergunta "quanto baixar o peso quando o RPE vem acima do alvo?"

  O NOME DO DADO, NÃO A PROSA — 20 claim(s) têm `param` cujo NOME contém
  duas ou mais palavras da sua pergunta.

    V033-04   PESSOAL fato    aula   No agacho e no terra ele fica na ponta alta dessa faixa, 3% por RPE.
                                     [peso_por_rpe=3]   ← nomeia: peso + rpe
    V033-03   PESSOAL fato    aula   Para ele, subir 1 RPE na barra corresponde a cerca de 2 a 3% de peso.
                                     [delta_rpe=1 peso_por_rpe_min=2 peso_por_rpe_max=3]   ← nomeia: peso + rpe

  A PÁGINA AO LADO — 20 claim(s) adjacentes, no MESMO vídeo, ao que já saiu acima.

    V033-05   PESSOAL fato    aula   Para ele, que agacha e puxa 800 lb, 3% equivale a cerca de 25 lb.
                                     [pct_por_rpe=3 carga_referencia=800 equivalente_kg_lb=25]   ← ao lado de V033-04
```

**As três, sem que a pergunta contenha o número.** V033-03 em 12º e V033-04 em
10º **no canal de param**; V033-05 **pela página ao lado**. Nenhuma delas sai
pela lista roteada — o assunto delas é `rpe`, mas o que as identifica é o **nome
do dado**, não a prosa.

E a razão de fundo continua valendo, impressa em toda saída roteada: **nenhum
filtro de `modo`/`scope`/`tier` é aplicado no roteamento.** As três são
`PESSOAL` + `fato`. Filtro de segurança estreita a SAÍDA, não a busca.

### 13.5 O C20, que a camada de ontem não resolvia

```
$ node research/tools/check-evidence.mjs --pergunta "quanto descansar entre as séries?"
  ROTEOU PARA 1 de 74: descanso-entre-series (12 claims)  (cabe numa leitura)
```

**V074-23 em 6º, V038-07 em 16º, V074-10 em 20º** — e duas delas **não estão
etiquetadas** no tópico (§11.4). Pela porta livre, esta pergunta devolvia só
G015-11, `relato-de-programa` do GZCLP.

**C20 continua vermelho pela porta velha** e por isso continua em
`CANARIOS-CANDIDATOS.json`, fora do `check:kb`, como manda a regra: canário
vermelho de nascença dentro do build é como se desliga uma trava. O caso está
fechado **pela porta nova**, e é o T05 do `ROTAS.json` que o cobra.

### 13.6 Q14 — o caso que o §8.4 recusou virar canário

```
$ node research/tools/check-evidence.mjs --pergunta "qual profundidade o agacho precisa ter para valer na competição?"
  ROTEOU PARA 3 de 74: profundidade(87), agacho(990), competicao(457)
```

**G029-28 em 8º** (era 22º) e **G027-31 em 19º** (era 49º). **G029-18 continua
fora**, e não vou fingir que não. O §8.4 diagnosticou este caso como *"tópico
errado, não vocabulário"* — o diagnóstico estava certo, e é por isso que dois dos
três subiram. O terceiro é dívida, registrada no §16.

---

## 14. AS TRAVAS — e as duas regras de higiene, cumpridas e conferidas

### 14.1 `research/kb/ROTAS.json` + `research/tools/check-rotas.mjs`

14 canários sobre a **base real**, dentro do `npm run check:kb`, em três famílias
que apontam em direções **opostas**:

| família | quantos | o que cobra |
|---|---|---|
| `mapeia` | 9 | **recall** — a pergunta abre as gavetas NOMEADAS e os ids saem dentro do teto |
| `sem-injecao` | 3 | **precisão** — ids de outro assunto **não** podem aparecer |
| `nao-mapeia` | 2 | **recusa** — e com o `motivo` certo, porque `fora-de-dominio` e `sem-assunto` mandam consertos opostos |

`--rotas <arquivo>` existe para que **um conjunto de canários escrito por outra
pessoa, que este autor nunca viu, possa ser rodado sem tocar em código**. É a
única forma honesta de medir alcance: canário escrito por quem fez a ferramenta
mede a ferramenta contra si mesma.

### 14.2 Regra 1 — nenhuma trava lê a constante que ela verifica

**Violada em dois lugares, consertada nos dois.**

- **`check-rotas.mjs` não importa constante nenhuma de `roteador.mjs`** — só
  funções. O teto é `tetoDeTela`, campo do `ROTAS.json`, e **a ausência dele é
  ERRO**, não um default silencioso vindo da ferramenta (que seria a mesma trava
  com uma linha a menos).
- **`check-canarios.mjs` importava `TETO_VIZINHANCA` de `busca.mjs`** — a
  ferramenta que ele mede — e o escrevia na mensagem de falha. Corrigido:
  `tetoDeTela` passou a morar no `CANARIOS.json` (no topo, com override por
  `buscaCega.tetoDeTela`), a ausência é erro, e `check-canarios.test.mjs` ganhou
  **três casos que neutralizam os dois lados**: um exige a recusa quando o campo
  some, e dois exigem que **o número impresso seja o do arquivo** (1, 7 e 3 —
  nunca 40).

**Conferido neutralizando os dois lados**, que é a instrução do `ONDA-2B` §1.1:

| mutação | antes de 10/08 | agora |
|---|---|---|
| `TETO_VIZINHANCA 40 → 400` em `busca.mjs` | `check:kb` **verde** | **inerte** — o checker não lê mais essa constante |
| `tetoDeTela 40 → 5` no `CANARIOS.json` | (campo não existia) | **C16 e C18 vermelhos**, com `dentro das 5 primeiras` na mensagem |
| `tetoDeTela` removido | (campo não existia) | **exit 2**, com a mensagem que nomeia o defeito |

### 14.3 Regra 2 — teste sobre corpus sintético não prova recuperação

`roteador.test.mjs` é dividido **explicitamente**: a primeira metade testa as
peças sobre um corpus de bolso (um teste de peça precisa de um corpus cujo
conteúdo ele conheça exatamente); **a segunda metade chama `responder()` — a
mesma função da CLI e do `check-rotas.mjs` — sobre `research/extract/*.jsonl`**,
e afirma coisas que só são verdadeiras se o caminho inteiro estiver ligado.
46 casos, e **nenhum número esperado é importado de `roteador.mjs`**.

### 14.4 A família `sem-injecao` quase virou vaga ocupada — e o que se fez

Isto é o achado mais desconfortável desta rodada e ele fica escrito.

**Rodei 14 mutações contra `roteador.mjs`** — teto, piso, fração, `MAX_TOPICOS`,
afinidade, `TETO_AFINS`, canal de param, peso do nome, cobertura, peso da rota ao
quadrado, e combinações. **Nenhuma delas fez T09/T10/T11 acusarem.** As
regressões que existem aparecem como **perda de recall na família `mapeia`**:

| mutação | quem mordeu |
|---|---|
| `MIN_PECAS_DO_PARAM 2 → 9` (canal de param desligado) | T04 |
| `TETO_AFINS 60 → 0` (afinidade desligada) | T05 |
| `PESO_NOME 0.9 → 0` | T08 |
| cobertura desligada (`score` = soma pura) | T03 |
| `PESO_AFIM 0.6 → 1` + `TETO_AFINS 600` | T05 |
| peso da rota linear em vez de ao quadrado, **+** `FRACAO 0,05` **+** `MAX 20` | T02, T05 |
| tudo junto | T01, T02, T05 |
| `PISO_ROTA 0.65 → 0.2` | **calibração** (duas perguntas de fora mapearam) |
| `vizinhos = []` (página ao lado desligada) | T04 **e** 2 casos de `roteador.test.mjs` |
| `TETO_ROTEADO 40 → 400`; `FRACAO 0.4 → 0.05`; `PESO_AFIM 0.6 → 0`; peso linear sozinho | **ninguém** |

> **CORREÇÃO DE 10/08, à noite — esta tabela errava 2 das 4 mutações que declarava
> verdes, e a lista não era confiável como lista.** Rerodadas uma a uma pelo
> ataque cego: `TETO_ROTEADO 40 → 400` dá **VERMELHO** (`roteador.test.mjs`, caso
> *"a saída PADRÃO cabe"*) e `PESO_AFIM 0.6 → 0` dá **VERMELHO** (caso
> *"fiação: alça"*). Sobrevivem de verdade só `FRACAO_DO_MELHOR 0.4 → 0.05` e o
> peso da rota linear — e a elas somavam-se **duas que esta tabela não listava**,
> `DETALHE_ROTEADO 8 → 0` e `PESO_NOME_COMPOSTO 1.2 → 0`. As duas foram fechadas
> no mesmo dia (§18). Uma lista de buracos conhecidos escrita por quem fez o
> conserto não é medida: é o modo de falha nº 5 desta casa em forma de tabela.

A razão de T09/T10/T11 não morderem é estrutural e é boa notícia: **o roteamento
não chama `expandirPorVocabulario`**, então a injeção de 09/08 é impossível pela
porta nova. Só que o defeito **continuava vivo do outro lado** — e nada o media:

```
$ sed -i '' 's/longas.every/longas.some/' research/tools/busca.mjs
$ npm run check:kb     # → exit 0, VERDE, com V170-34 de volta ao topo de "sono"
```

**Um canário que nenhuma mutação faz morder ocupa a vaga.** O conserto foi fazer
a família cobrar **as duas portas**: campo `tambemPelaBuscaLivre` no `ROTAS.json`,
e os mesmos `proibidos` passam também por `recuperar()`, que é o que `--busca`
usa. Depois disso:

```
✗ rota T09: PRECISÃO REGREDIU NA BUSCA LIVRE — --busca "quantas horas de sono por
  semana?" devolveu V170-34, V170-33, V175-53, que é de outro assunto.
✗ rota T10: … "quando fazer deload na semana?" devolveu V170-34, V170-33 …
✗ rota T11: … "quantas calorias por dia na semana de corte de peso?" devolveu … 
✗ 3 problema(s) em 14 canário(s) de roteamento
```

Revertida a mutação, os 14 voltam a verde. **É o item §2 do `ONDA-2B` fechado —
não pela família nova que aquele item propôs, e sim no lugar onde o defeito de
fato mora.**

**O que continua sem trava, e está escrito para não ser esquecido:** quatro
mutações da tabela acima passam verdes. Três delas afrouxam o roteamento sem que
nenhum id errado apareça (medido: com `FRACAO 0,05` e `MAX 20`, *"quantas horas
de sono por semana"* roteia para 10 tópicos e **ainda assim** não devolve
V170-34, porque o peso ao quadrado reduz `frequencia` a 4,6 % de contribuição).
`TETO_ROTEADO 40 → 400` é inerte por construção (regra 1). **Isto não é prova de
que não há um quinto buraco.**

---

## 15. AS DUAS PORTAS, e qual se abre primeiro

| | `--pergunta` (10/08) | `--grep` / `--busca` (09/08) |
|---|---|---|
| resolve | pergunta → **tópico** → claims | pergunta → **texto** |
| alvo | **fechado**, 74 nomes | aberto, 6.912 textos |
| erro | **recusado por compilador** | resultado ruim que passa por bom |
| use para | *"do que a base fala quando eu pergunto isto?"* | *"quem diz exatamente isto?"* |
| trava | `check-rotas.mjs` (**15**) + `roteador.test.mjs` (46) | `busca.test.mjs` (35) |
| trava comum | `check-canarios.mjs` — **37** canários, dos quais **18** medem esta porta (`perguntaDoAtleta`) e 4 medem a livre (`buscaCega`) | idem |

**As duas continuam existindo, e isso não é indecisão.** `--grep` é o instrumento
certo para conferir uma citação, e é o que os canários `presente-escondido` usam
como busca cega — eles precisam da busca **literal** que a medição registrou. A
mudança é qual porta um agente abre primeiro para responder ao atleta, e a
resposta é: **a nova**.

O protocolo do §5 continua valendo inteiro, com uma linha na frente:

> **0. Comece por `--pergunta`.** Se ela não mapear, leia qual das duas recusas
> saiu antes de escrever qualquer coisa: `fora-de-dominio` e `sem-assunto`
> mandam consertos opostos, e nenhuma das duas é *"a base não tem"*.

---

## 16. O QUE A CAMADA NOVA **NÃO** RESOLVE — medido em 10/08

1. **G029-18 (Q14) continua fora da tela.** Dois dos três subiram (§13.6); o
   terceiro não. O `## tecnica` e o `## setup` continuam sem seção no
   `VOCABULARIO.md`, e a dívida do §8.4 continua aberta.
2. **A margem do piso é de 0,11, e estreita de um lado só.** `ganhou` é palavra
   desta base. Uma pergunta de fora escrita com mais palavras ambíguas pode
   atravessar. O que existe contra isso é a calibração de 25 × 10 rodada a cada
   `check:kb`, e ela **recusa** quando as duas populações se cruzam — o que é
   melhor que um número diferente, mas não é uma prova.
3. **A afinidade admite 60 claims não etiquetadas por tópico.** É o que conserta
   a etiqueta esquecida (V038-07) e é, por construção, uma porta lateral. Ela sai
   marcada `(afim)` na tela e vale 0,6 — mas quem lê depressa vai ler `afim` como
   `declarado`.
4. **O roteamento não conhece `conditions`.** Ele acha V170-34; o que a torna
   segura para este atleta são as `conditions` (V170-36, V170-44) e o `modo`, que
   o formatador imprime **sempre**. **O determinismo desta camada prova fidelidade
   à recuperação, não correção da fonte.** V170-34 continua sendo *"supine seis
   dias por semana"* dito por um homem que não compete testado, para um atleta com
   o peitoral rompido há quatro meses.
5. **Não existe estimativa de recall na base inteira.** Para tê-la seriam
   precisos muito mais que 14 pares (pergunta, ids corretos). **Este documento
   prova que os buracos conhecidos fecharam. Ele não prova que não há um quinto.**
6. ~~**Quatro mutações passam verdes** (§14.4).~~ **Eram duas, e havia duas
   outras não listadas — e hoje NENHUMA das seis conhecidas passa verde.** Ver a
   correção no §14.4 e a tabela do §18.3. A lista conhecida ficou vazia, o que
   não é o mesmo que não haver uma sétima.
7. **O gargalo não é ordenação, é ROTEAMENTO — e o número é 7 de 18.** Ver §18.

---

## 17. Procedência da PARTE II

- **Arquivos novos:** `research/tools/roteador.mjs`,
  `research/tools/roteador.test.mjs` (46 casos, metade sobre a base real),
  `research/tools/check-rotas.mjs`, `research/kb/ROTAS.json` (14 canários + as
  duas populações de calibração).
- **Arquivos alterados:** `research/tools/check-evidence.mjs` (`--pergunta`,
  `--topic` forçado, a seção da página ao lado), `research/tools/busca.mjs`
  (`vizinhosNoMesmoSrc` extraída e compartilhada pelas duas portas, com os dois
  defeitos de seleção consertados), `research/tools/check-canarios.mjs` e
  `research/kb/CANARIOS.json` + `CANARIOS-CANDIDATOS.json` (`tetoDeTela` deixou
  de ser importado da ferramenta), `research/tools/check-canarios.test.mjs`
  (3 casos novos, 45 no total), `package.json` (`check:kb` encadeia
  `roteador.test.mjs` e `check-rotas.mjs`), este arquivo.
- **Base no momento:** **6.912 claims**, **74 tópicos**, contados por
  `check-claims.mjs` e `carregarTopicos(PROTOCOLO-EXTRACAO.md)`. Nenhum número
  desta parte veio de memória.
- **As mutações do §14.4** foram aplicadas, medidas e **revertidas** nesta
  sessão, uma a uma, com `check:kb` verde antes e depois.
- **`npm run check:kb`:** verde, exit 0 — 19 canários de conteúdo + **14 de
  roteamento** (9 mapeia · 3 sem-injecao · 2 nao-mapeia), 73 termos vivos e 26
  mortos no índice, 45 casos em `check-canarios.test.mjs`, 46 em
  `roteador.test.mjs`. **`npm run build`:** verde, exit 0. `eslint` limpo.
- **O que NÃO foi feito:** `AVALIACAO.md` continua **intocado** — o instrumento
  fica estável para a terceira medição. Nenhuma claim foi editada, nenhuma fonte
  foi ingerida, nenhum tópico foi acrescentado ao vocabulário fechado. Este
  trabalho é inteiramente de recuperação.

---

## 18. O ATAQUE CEGO DE 10/08 (à noite), e o que ele mudou

Um terceiro reescreveu 18 perguntas na **voz do atleta** — sem a palavra da
resposta dentro — e mediu esta camada contra elas. Os 18 pares (pergunta, ids)
entraram em `research/kb/CANARIOS.json` como família `presente-escondido` com o
bloco `perguntaDoAtleta` (P01–P18), **medidos e vermelhos**, e o placar sai
impresso a cada `check-canarios.mjs`:

```
  RECUPERAÇÃO PELA PORTA NOVA (--pergunta), medida e registrada:
    0 de 18 devolvem TODOS os ids esperados dentro do teto de tela
    3 de 18 devolvem ALGUM id esperado
    7 de 18 não roteiam para gaveta NENHUMA que contenha a resposta
```

### 18.1 A frase do construtor não é a frase do atleta

O §13 mede seis casos e diz que a camada os destrava. O ataque reproduziu
**dois** (Q05 e Q19). A diferença não está na camada, está na **pergunta**: as
frases da tabela do §13 já contêm a palavra da resposta — *quanto **baixar** o
peso*, *quanto tempo dura um **ciclo*** —, e quando a mesma dúvida é escrita como
o atleta a escreve (*"minha série de aferição veio em RPE 8 pela terceira semana
seguida, o que faço com a carga"*), Q11, Q14, Q16 e Q29 voltam a não achar nada.
**O §13 não está errado nos números; está errado no que os números medem.**

### 18.2 O defeito dominante é de roteamento, não de ordenação

Em 7 dos 18 (P02, P06, P09, P10, P14, P15, P16) **nenhum tópico roteado contém
um id esperado** — ordenar melhor dentro da gaveta não alcança uma claim que não
está no conjunto. O pior é o **P16**: `levantar peso já conta como exercício pro
coração` roteia para `peso-corporal` com 0,73 (piso 0,65) porque o `peso` de
*levantar peso* foi lido como peso **corporal**; `cardio` (onde V013-04/05/06
respondem exatamente isso) nunca abre, e a tela sai cheia, plausível e errada —
o mesmo lixo que a família `nao-mapeia` foi escrita para proibir, e que nenhum
canário pegava. **A precisão, essa, está boa** e não é onde gastar a próxima
onda: as três recusas testadas saem certas e com o motivo certo, e o piso é
cobrado dos dois lados (0,65 → 0,60 e 0,65 → 0,73 dão vermelho).

### 18.3 As três travas que estavam mortas, e as repro que passaram a falhar

| o que estava morto | repro que hoje falha |
|---|---|
| `DETALHE_ROTEADO 8 → 0` matava o canal inteiro da PÁGINA AO LADO com `check:kb` verde. O único teste que citava o canal (V033-05) passava porque V033-05 vem de `vizParam`, o **outro** canal. | `vizinhos` passou a declarar `canal`, e o T05 do `ROTAS.json` ganhou `viaPaginaAoLado: ["V003-18","V074-24"]` — o *5 min em agacho e terra, 3 no supino* e a condição de V074-23, que **só** chegam à tela por esse canal. `sed 's/DETALHE_ROTEADO = 8/= 0/'` → `check-rotas` exit 1. |
| `PESO_NOME_COMPOSTO 1.2 → 0` verde: nenhum caso dependia do nome composto da gaveta. | T15, `quanto vale a carga de treino da semana?`. Com o peso, `carga-de-treino` sai em 1º; com 0, o tópico **desaparece** e a pergunta cai em `[frequencia, taper, periodizacao, deload]` — que é exatamente o P14. `sed` → exit 1. |
| O `"tetoDeTela": 40` do **topo** do `ROTAS.json` era letra morta (todo caso carrega o seu), e `check-rotas.mjs:180` escrevia `teto: teto ?? 40` — o 40 hardcoded dentro da ferramenta que o arquivo diz não poder tê-lo. | O teto do topo é lido antes de qualquer caso e a ausência é erro de carga; o `?? 40` saiu. `sed 's/"tetoDeTela": 40,/"MORTO": 40,/'` → exit 2. |

**E as duas que a correção do §14.4 deixou de pé caíram sozinhas, pelos 18 canários
novos.** Rodadas depois de gravá-los, uma a uma, com reversão e `md5` conferido:

| mutação | quem morde hoje |
|---|---|
| `FRACAO_DO_MELHOR 0.4 → 0.05` | `check-canarios.mjs` — P02 passa a abrir `dor`, P05 ganha `ombros`, e outros; a **medida** muda e o registro acusa |
| peso da rota `** 2 → ** 1` (linear) | `check-canarios.mjs`, mesma via |
| `TETO_ROTEADO 40 → 400` | `roteador.test.mjs` |
| `PESO_AFIM 0.6 → 0` | `roteador.test.mjs`, `check-rotas.mjs` **e** `check-canarios.mjs` |
| `DETALHE_ROTEADO 8 → 0` | `check-rotas.mjs` (T05, `viaPaginaAoLado`) |
| `PESO_NOME_COMPOSTO 1.2 → 0` | `check-rotas.mjs` (T15) |

**Das seis mutações conhecidas, nenhuma passa mais verde.** Isso não quer dizer que
não há uma sétima — quer dizer que a lista conhecida ficou vazia, o que é o máximo
que uma lista pode dizer sobre si mesma. E note **por que** as duas primeiras caem:
não por uma trava escrita contra elas, e sim porque afrouxar o roteamento move a
medida de 18 perguntas reais. Um canário que registra uma medida ruim vale mais como
detector do que um que registra uma boa.

### 18.4 O canário que falha entra assim mesmo

`perguntaDoAtleta` não cobra **passar** — cobra que a **medida** continue a
mesma. `recuperados`, `abriuOTopico` e `gavetasComResposta` são registro, e
divergência é erro **nos dois sentidos**: melhorar também acusa. É a única forma
de um canário vermelho não virar verde em silêncio, e de o número deste veredito
não poder mudar sem alguém escrevê-lo. `check-canarios.test.mjs` tem 8 casos
novos (53 no total) que provam o mecanismo, incluindo os três que rodam o mesmo
canário com `tetoDeTela` 1, 2 e 3 e obtêm três listas diferentes — que é a prova
de que o limite de **posição** vem do canário, e não de `roteador.mjs`.

### 18.5 O item mais caro que continua aberto: Q03/P02

`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?`
devolve 40 claims de peito/supino e **nenhuma** de V079-34, V001-06, V138-19,
V086-21 ou V027-23, pelas **duas** portas. A palavra `fisgada` não existe na base,
e a gaveta `dor` só abre quando a palavra literal *dor* está na pergunta. A
camada não responde nem certo nem errado: **responde com ar de completa**, sem
sinal nenhum de que existe um limiar de 2–3/10 e uma ressalva do outro lado.
Para este atleta — peitoral rompido, bloco de reexposição — é o caso que mais
custa. O `§9.3` chamava isto de *"de outro dono"*; não é: é o item 1 da
`ONDA-2C.md`.

---

### 18.6 Procedência do §18

- **Arquivos alterados:** `research/kb/CANARIOS.json` (18 canários
  `presente-escondido` novos, P01–P18, com `perguntaDoAtleta`; `_leia`
  ampliado), `research/tools/check-canarios.mjs` (o bloco da porta nova e o
  placar impresso), `research/tools/check-canarios.test.mjs` (segunda base de
  bolso + 8 casos, 53 no total), `research/tools/roteador.mjs` (`vizinhos`
  passou a declarar `canal`), `research/tools/check-rotas.mjs` (teto do topo
  cobrado, `?? 40` removido, `viaPaginaAoLado`), `research/kb/ROTAS.json`
  (T05 ganhou `viaPaginaAoLado`, T15 é novo — 15 casos), este arquivo,
  `research/kb/ESTADO.md`, `research/RUNBOOK.md` §8, `research/kb/ONDA-2C.md`
  (novo).
- **Nenhuma claim foi editada**, nenhuma fonte foi ingerida, nenhum tópico
  entrou no vocabulário fechado. `MEDICAO-02.md` mediu que o gargalo não é
  conteúdo.
- **As perguntas P01–P18 e os ids esperados foram escritos por um terceiro**, que
  não participou do conserto de 10/08, e chegaram em
  `research/kb/CANARIOS-ESCONDIDOS.json`. O que este passe fez foi torná-los
  executáveis e registrar a medida — não escolhê-los.
- **Verificação:** `npm run check:kb` exit 0 · `npm run check:gate` exit 0 ·
  `npm run build` exit 0 · `eslint` limpo nos arquivos tocados. As três mutações
  do §18.3 foram aplicadas, medidas, e revertidas com `md5` conferido.
