# `genero` — o tipo do vídeo, e a trava que ele liga

> Escrito em 2026-08-09, no passe que transformou a atribuição de
> `relato-de-programa` e `avaliacao-de-terceiro` de julgamento de agente em
> propriedade declarada do vídeo.
>
> **Nenhum vídeo foi reaberto para escrever este arquivo.** Todo o sinal saiu de
> coisas que já existiam no repositório: a `TRIAGEM.md` do Blevins e os títulos
> do manifesto. Onde nem uma nem outro decidiram, o valor é `indeterminado` — que
> é resposta, não buraco.

## 1. O defeito que este campo conserta

`ENUMERADOS.md` §8 já tinha escrito o diagnóstico e não tinha como aplicá-lo:

> As duas gavetas estão certas na distinção e erradas no lugar onde foram
> penduradas. O discriminador de ambas é uma propriedade do **vídeo**, não da
> claim.

Concretamente: `G028-02` é *"Manter a cabeça em posição mais neutra e para cima
no agachamento"*. Lida no JSONL — que é o que o agente lê —, essa frase é
indistinguível de prescrição geral. O que a torna `avaliacao-de-terceiro` é o
fato de o vídeo ser um *Form Assessment Saturday*, com o conselho calibrado para
o corpo de um desconhecido que mandou um vídeo. Esse fato morava no manifesto do
canal, e só chegava à claim se o agente lembrasse de abrir o manifesto.

Dezoito agentes lembraram de formas diferentes. As 562 claims em
`relato-de-programa` (447) e `avaliacao-de-terceiro` (115) **não eram
reproduzíveis**: refazer o passe com outros agentes daria outro conjunto.

Com `genero` no manifesto, o discriminador vira dado, a trava vira compilador, e
"o que revisar" vira consulta.

## 2. O enumerado

Vive em `research/tools/kb.mjs` (`GENEROS`), que é a lista viva — este arquivo é
a decisão, não o catálogo. `verify-manifest.mjs` recusa vídeo sem gênero e gênero
fora da lista; `check-claims.mjs` recusa claim cujo vídeo declare gênero
desconhecido.

| valor | o que é | restringe `prescricao`? |
|---|---|---|
| `aula` | o autor ensina o **próprio** método: didático, tutorial, tese, tier list | não |
| `review-de-programa` | o assunto principal é o método **de outra pessoa** — 5/3/1, nSuns, Cube, PHUL, o livro de outro, o programa que uma IA escreveu | **sim** |
| `form-check` | análise da execução **de outra pessoa**, a partir do vídeo que ela enviou | **sim** |
| `coaching-call` | aconselhamento dirigido a **um** praticante nomeado | **sim** |
| `log-de-treino` | o que aconteceu no treino/no dia dele: vlog de sessão, prep em vlog, *full day of eating*, análise do próprio vídeo | não |
| `competicao` | recap de meet, filmagem de plataforma, mock meet | não |
| `perguntas` | ele responde perguntas do público | não |
| `institucional` | anúncio de canal, oferta de coaching, lançamento de produto/app | não |
| `clipe` | filmagem curta sem prosa: PR de academia, compilação, filmagem de terceiro sem comentário | não |
| `indeterminado` | o título não decide e ninguém reabriu o vídeo | não |

### Por que dez e não os três do `ESTADO.md`

O `ESTADO.md` §4 sugeriu `review-de-programa | form-check | vlog`. Os dois
primeiros ficaram; `vlog` foi recusado porque teria de engolir log de sessão,
filmagem de meet, oferta de coaching, Q&A e clipe de PR — cinco coisas cujo único
traço comum é "não é aula". **Enumerado curto não é recusado, é contornado**, e o
contorno de trava é o modo de falha nº 2 desta casa (a trava estreita que empurra
o dado para fora dela, como o frame que faltava para gramas). Um `vlog` que
significa cinco coisas não responde nem a pergunta mais óbvia que se faz a este
corpus — *o que ele diz na plataforma, em competição de verdade?* — porque a
filmagem de meet estaria misturada com o anúncio do app.

As três gavetas que existem além do óbvio, e o caso concreto que abriu cada uma:

- **`coaching-call`** — `G101` e `G106` são atendimento a um praticante nomeado.
  É a mesma família do `form-check` (conselho calibrado para um caso), com nome
  diferente porque não é a execução que está sendo avaliada, é o programa dele.
  Sem esta gaveta os dois cairiam em `aula`, que é a leitura perigosa.
- **`perguntas`** — `R169` e `R171`. Não restringe, porque a resposta a uma
  pergunta do público costuma ser generalizável; existe porque é a fronteira
  mais próxima dos três restritos e um dia alguém vai querer revisar isso por
  consulta em vez de por memória.
- **`clipe`** — 34 vídeos sem prosa, a maioria com menos de 90 s (o mais curto
  tem 11 s), mais as montagens de progresso. Sem a gaveta eles virariam
  `log-de-treino` e inflariam em ~15 % um conjunto que alguém vai usar para
  perguntar "como ele narra a própria sessão".

### O que foi RECUSADO, e por quê

- **`regra`**, sugerido em `ENUMERADOS.md` §8 para o regulamento da IPF. O
  regulamento é `kind: 'normativo'`, **não tem manifesto e não tem vídeo** — o
  gênero não teria onde morar. E o discriminador dele já existe e é mais forte:
  `tier: O`, que o checker já usa para isentar a claim de `modo` e de `scope`.
  Dois campos dizendo a mesma coisa divergem, e a divergência é silenciosa
  (`ENUMERADOS.md` §1, critério 4).
- **`entrevista`/`podcast`.** Nenhum dos dois canais tem o formato. Abrir gaveta
  vazia promete uma distinção que os dados não têm — foi com esse argumento que
  `scope: TERCEIRO` foi recusado. Fica registrado aqui para que a próxima fonte
  que tenha podcast saiba que a gaveta é para abrir, não para improvisar.
- **`reacao`** separado de `clipe`. `G311`–`G313` são filmagem do Dan Green e do
  Jesse Norris sem uma palavra de comentário metodológico: é clipe de terceiro,
  não reação. Se algum dia entrar uma reação COM análise, ela é `form-check` se
  fala da execução e `review-de-programa` se fala do método — as duas gavetas já
  existem e as duas já restringem.

## 3. A assimetria que governa a atribuição

**Só três gêneros ligam trava. Marcar de menos neles custa o status quo; marcar
de mais custa uma trava falsa.**

Deixar de marcar um vídeo de review como review devolve exatamente o
comportamento de ontem: nenhuma trava, a claim entra como sempre entrou. Marcar
como review um vídeo que não é põe uma trava por cima de prescrição legítima —
e o `ESTADO.md` já registra que trava errada é pior do que trava ausente, porque
o conserto pelo caminho fácil é afrouxar a regra.

Daí as três consequências práticas, que valem para quem for classificar vídeo
novo:

1. Na dúvida entre um gênero restrito e qualquer outro, **escolha o outro**.
2. Onde o título não decide nada, **`indeterminado`** — não o gênero mais
   provável.
3. `aula` é o fall-through liberal de propósito: um `aula` errado não liga trava
   nenhuma.

É a mesma forma da regra "na dúvida, `PESSOAL`" do `PROTOCOLO-EXTRACAO.md`.

## 4. Como o campo foi semeado

`research/tools/seed-genero.mjs`, uma vez, sobre os dois manifestos. Ordem:
**override à mão** → **regras da fonte, na ordem escrita** → `indeterminado`.

O script é idempotente: rodado de novo, só preenche vídeo sem gênero. Só
`--refresh` re-deriva tudo — e re-derivar apaga correção feita à mão no
manifesto, então o padrão não faz isso. `build-manifest.mjs` carrega o gênero
adiante por `videoId` numa reconstrução, porque `genero` é o único campo do
manifesto que **não** é derivável do yt-dlp.

### Blevins — a TRIAGEM é a fonte, o título é o desempate

`research/corpus/blevins/TRIAGEM.md` tem título, data, duração, prioridade e o
**porquê** de cada uma das 354 refs, escrito por um agente que leu os 354
títulos um a um. O script lê a tabela e usa duas colunas.

A decisão de desenho mais importante: **a coluna "por quê" decide ANTES do
título.** O canal de 2013–2018 embute um segmento metodológico dentro de quase
todo vlog de sessão — `G120` se chama *"How I Deload C2W6D1"* e é, ao mesmo
tempo, o protocolo de deload dele e o dia 1 da semana 6. Lido só pelo título,
ele é log de sessão, e a única coisa que alguém vai procurar ali desapareceria da
consulta. A TRIAGEM diz *"deload: o protocolo dele, explícito"*, e é isso que
governa. Onde a TRIAGEM ficou em branco — a faixa "baixa", 228 vídeos de log —,
aí sim o título decide.

Ordem das regras: `form-check` → `coaching-call` → série PPST → série *Program
Review* → TRIAGEM diz vlog → TRIAGEM diz qualquer outra coisa (`aula`) →
filmagem de meet → código de sessão (`C4W2D1`) → anúncio → menos de 90 s →
sobra de log.

Duas regras merecem nota:

- **A série PPST é `review-de-programa`.** São onze vídeos em que o Blevins
  percorre, capítulo a capítulo, o *Practical Programming for Strength Training*
  de Rippetoe e Baker. O método é do livro, e o imperativo que sai dali é dos
  autores dele. Nenhuma dessas claims foi extraída ainda; a marcação existe para
  que a extração futura já nasça travada.
- **O título de duas cabeças.** *"IG Announcement! Heavy Squat, Bench and
  Deadlift"* nomeia um anúncio e uma sessão. Quem governa é a **sessão**, porque
  é ela que produz claim — anúncio não vira conhecimento. Está no código como um
  `nao:` na regra de `institucional`.

### Vena — só o título, e o título é melhor do que parece

Não há TRIAGEM para o Vena. O único sinal é o título do manifesto — mas o
formato do canal ajuda: short didático de 2 a 6 minutos, com um título que **é**
a tese (*"Why I NEVER do DELOADS"*, *"The SIMPLE WAY to tell how many SETS to
do"*). Ler isso como `aula` é leitura, não chute.

A regra lê sempre a **cabeça** do título, o pedaço antes do primeiro `|`. Uns 25
vídeos terminam em `| Training Log & QnA`, que é o formato de publicação e não o
assunto: classificar *"Why I NEVER do DELOADS | Training Log & QnA"* como log por
causa do sufixo esconderia a tese de qualquer consulta.

**Um único vídeo do Vena é `review-de-programa`: `R047`**, em que ele resenha o
programa que o ChatGPT escreveu para ele. A armadilha vizinha é `R050`, *"My
800LBS SQUAT PROGRAM (REVIEW)"* — a palavra "REVIEW" está lá e o programa é
**dele**: é reflexão sobre o próprio ciclo, e virou `log-de-treino` à mão.

### O que ficou indeterminado

**Um vídeo, `G072`, "Getting back to it !"** — 6 min 44 s, faixa baixa, sem
motivo escrito na TRIAGEM, título que não diz nada. Não tem claim extraída.

Zero no Vena. Isso é uma afirmação forte e ela está sujeita a revisão: quer
dizer que, lendo os 197 títulos, cada um decidiu — e não que cada um decidiu
**bem**. Os casos em que o título decidia mal foram para o `OVERRIDES` com o
motivo escrito, inclusive dois (`R007`, `R026`) em que a decisão saiu da
transcrição porque o título sozinho não bastava.

### Distribuição

| | Vena (197) | Blevins (354) |
|---|---|---|
| `aula` | 151 | 64 |
| `log-de-treino` | 19 | 211 |
| `clipe` | 16 | 18 |
| `competicao` | 8 | 16 |
| `review-de-programa` | 1 | 31 |
| `perguntas` | 2 | 0 |
| `institucional` | 0 | 6 |
| `form-check` | 0 | 5 |
| `coaching-call` | 0 | 2 |
| `indeterminado` | 0 | 1 |

## 5. A trava, e por que ela mede em vez de reprovar

`check-claims.mjs`, `TETO_PRESCRICAO_EM_GENERO_RESTRITO`: uma claim `tier: R` com
`modo: prescricao` cujo vídeo é `review-de-programa`, `form-check` ou
`coaching-call` conta como violação, **por `src`**, contra um teto declarado. Teto
ausente vale zero. O teto só desce.

Reprovar de saída derrubaria o build sobre 76 claims que já existem, e a rodada
que ligou a trava tinha proibição explícita de editar claim (uma medição da base
rodava em paralelo, e medir alvo móvel foi o erro que aquela rodada existia para
não repetir). Uma trava que quebra o build no dia em que nasce é uma trava que
alguém afrouxa na mesma tarde.

Por `src` e não global, pela mesma razão que o `TETO_SEM_MODO` é por prefixo de
id: **teto global vaza pelo caminho mais fácil de achar.** Consertar uma claim do
`G020` abriria exatamente uma vaga para uma claim nova nascer errada em qualquer
vídeo de review, e a soma não se moveria. Foi esse furo, no teto do `modo`, que o
`SCHEMA.md` documenta como já tendo custado um lote inteiro de 278 claims.

**O piso não é necessariamente zero, e isso não é desculpa.** Sobra prescrição
legítima nesses vídeos: o conselho do próprio autor sobre adotar um programa
alheio, o padrão técnico universal que ele enuncia no meio de um form check. O
que a catraca garante é que cada uma que ficar tenha sido aberta por alguém, e
que o número não suba sozinho.

### O que a trava NÃO faz

- Não olha `relato-de-programa` com dose e sem `conditions` — são 174 claims e o
  aviso continua desligado de propósito (`RUNBOOK.md` §8, item 16).
- Não recusa `prescricao` vinda de `perguntas` nem de `log-de-treino`. A primeira
  é a fronteira mais próxima e ficou de fora por falta de evidência de que erre;
  a segunda é onde o autor genuinamente prescreve.
### O jeito de a trava morrer, e o que impede

Esta trava não morre com erro: ela morre **em silêncio**. Um manifesto
reconstruído sem passar pelo `seed-genero.mjs` deixa `genero` ausente,
`GENEROS_SEM_PRESCRICAO` para de casar com qualquer coisa, e a contagem de
violações cai para zero — que é exatamente o número que a catraca reporta como
sucesso. Quem impede é o `verify-manifest.mjs`, o único lugar do repositório que
exige o campo.

O caso "vídeo sem `genero`" **não cabe no teste do compilador de claims**: ele
monta um extract sintético mas lê os manifestos reais. A primeira versão deste
documento parava aqui, e dizia que o invariante estava coberto por
`verify-manifest.mjs` — uma frase sobre código que ninguém tinha executado, que é
o modo de falha nº 4 desta casa.

Hoje quem cobre é **`research/tools/verify-manifest.test.mjs`**, dentro do
`npm run check:kb`, com 14 casos: manifesto real das duas fontes como controle,
`genero` ausente em cada uma delas, `genero: null`, `genero: "vlog"` (o valor que
o `ESTADO.md` sugeriu e o §2 recusou — um typo qualquer provaria menos), o `G001`
perdendo o gênero, e os três invariantes de deslocamento que o verificador já
prometia e também nunca tinham sido executados. Cada caso exige a **mensagem**
certa, não só o código de saída: manifesto mutilado reprova por vários motivos ao
mesmo tempo, e sem casar o texto o teste ficaria verde no dia em que a checagem
de `genero` fosse apagada. Apagar o bloco de `genero` do verificador derruba 5
deles — foi conferido apagando.

O `--manifest <caminho>` do verificador existe só para isso, e é estreito de
propósito: redireciona o manifesto e deixa o `PROGRAMA.md` das âncoras e as
transcrições reais no lugar, para que a reprovação nunca seja por arquivo
ausente.

### O segundo jeito de a trava morrer: o REBAIXAMENTO

A versão acima deste documento parava no parágrafo anterior, e cobria só o caso
de o campo **sumir**. Sobrava o caminho mais curto de todos, achado ao atacar
esta entrega:

```
node -e "…m.videos.find(v=>v.ref==='G020').genero = 'aula'…"
node research/tools/verify-manifest.mjs --source blevins   # passava
node research/tools/check-claims.mjs                       # passava, exit 0
```

`aula` é um valor legítimo, o campo continua lá, e as sete violações do `G020`
somem. A única pegada era a linha de resumo caindo de 76 para 69 —
indistinguível de alguém ter consertado sete claims. E é justamente o atalho que
um build vermelho convida a tomar, porque rebaixar o gênero é mais rápido do que
reabrir a claim. Modo de falha nº 4 outra vez, num lugar novo.

Quem impede é o roster `GENERO_TRAVADO` do `verify-manifest.mjs`: os 39 vídeos
que hoje declaram gênero restrito, congelados por ref e valor. Rebaixar um deles
— ou o ref sumir do manifesto — é erro, e o conserto é editar a lista à mão com o
motivo, que é exatamente a fricção desejada. **De mão única, de propósito:**
vídeo que GANHA gênero restrito não precisa ser registrado, porque mais trava é o
lado seguro e cobrar registro no lado seguro é a fricção que faz alguém desistir
de marcar (§3). Dois dos 14 casos do teste são de aceitação, e existem para
impedir que a checagem vire bidirecional; esvaziar o roster derruba 4 casos.

O roster paga mais caro onde ninguém olharia: `G101`, `G106`, a série PPST,
`G135`, `G176` e `G242` não têm claim extraída nenhuma. Um rebaixamento ali não
mexe em número de hoje — só apareceria como prescrição aceita numa extração
futura, quando ninguém mais lembrasse.

### E quem escreve o campo também não fazia o que dizia

`seed-genero.mjs` **não conseguia gravar** `genero` em vídeo cuja entrada já
tivesse a chave — incluindo o `genero: null` que o `build-manifest.mjs` escreve
numa reconstrução. O laço copiava o valor velho por cima do recém-derivado
(`genero` vem logo depois de `title` no manifesto), e o script imprimia
`354 de 551 vídeos receberam gênero` e `→ manifesto escrito` sobre um arquivo
inalterado. Consequências: `--refresh` nunca re-derivou nada, ao contrário do que
o §4 e o cabeçalho do script prometiam; e o conserto que o `verify-manifest.mjs`
manda fazer na mensagem de erro não funcionava justamente no caso em que é
preciso, dizendo que tinha funcionado — trava vermelha permanente com o conserto
documentado quebrado é como alguém acaba apagando a checagem.

O `--refresh --dry` usado como prova de reprodutibilidade não podia pegar isso:
ele compara valor derivado com valor no arquivo e **nunca passa pelo caminho da
escrita**. Hoje quem prova é `research/tools/seed-genero.test.mjs`, no
`check:kb`: o caso central zera os 551 gêneros das duas fontes, roda a semeadura
sobre o manifesto encenado (`--source <id> --manifest <arq>`) e exige que os 551
voltem **iguais aos commitados** — gravação e reprodutibilidade provadas de uma
vez. Reintroduzir o defeito derruba 6 dos 11 casos.

### O primeiro dividendo, medido

O `ESTADO.md` conta "94 claims em `prescricao` nos 20 vídeos de review
(`G001`–`G020`)". O gênero mostra que a faixa contígua cobrava demais: `G004`
(deload), `G006` (periodização) e `G008` (stress index) são **tese própria do
Blevins**, não resenha — e sozinhos respondem por 40 das 94. O número certo é
**54**, e as outras 40 nunca deveriam entrar numa fila de revisão.

## 6. As 76 violações — repassadas em 9/8/2026, e o teto foi para 74

> **ONDA 2 — leia isto antes da lista.** As 76 foram abertas uma a uma, com o
> `verbatim` e a transcrição em volta de cada `at`. **Duas mudaram; 74 ficaram**,
> e o teto de `check-claims.mjs` desceu de 76 para 74 (`G020`: 7→6, `G027`: 4→3).
> A justificativa claim a claim mora no comentário da catraca, em
> `check-claims.mjs`, que é onde quem for baixar o teto de novo vai olhar.
>
> **O que mudou**
>
> - **`G020-17` → `relato-de-programa`.** *"three times per week is really the
>   frequency you want for squat"* é a frequência de agacho **do StrongLifts**,
>   narrada entre `G020-03/04/05` (a estrutura A/B) e `G020-18` (a progressão
>   45→50→55), e condicionada a `G020-12`, que também é `relato-de-programa`.
>   Era a **única** das 76 com dose de frequência (`frequencia = 3 x_semana`) em
>   `GERAL` + `prescricao` — a linha mais diretamente consumível da fila inteira,
>   e o programa de outra pessoa.
> - **`G027-01` → `opiniao`.** *"YouTube is a really good way to [submit], it is
>   far better than sending me the video files"* é logística de canal: não é
>   imperativo de outro autor, não é conselho calibrado para um corpo, e é a
>   única da fila que **não pode virar treino sob leitura nenhuma**. O irmão do
>   mesmo arquivo sobre o mesmo assunto (`G027-27`, ordem da fila de vídeos) já
>   estava fora de `prescricao`, em `fato`.
>
> **Duas correções à leitura que esta seção fazia**
>
> - **`G011-32` e `G011-34` NÃO são o alvo**, ao contrário do que o texto abaixo
>   diz. A leitura anterior foi feita pelo texto da claim (*"ele manda"*); o
>   `verbatim` diz o contrário — *"I would say stick with the five with the upper
>   body movements"* e *"I would lean towards the lower end"*. A regra do nSuns
>   já está gravada ao lado, em `G011-30` e `G011-31`, como `relato-de-programa`.
>   O defeito ali é do **texto da claim**, não do `modo` — e é exatamente a
>   ambiguidade que o item 2 do fecho desta seção nomeia.
> - **Nos form checks a leitura "18 de 18 não são o alvo" quase se sustenta**, e
>   a exceção é a de logística, não a técnica. Os cues universais
>   (`G029-38` punho sobre cotovelo, `G030-13` joelho sobre o segundo dedo,
>   `G029-43` glúteo no banco, `G031-10` o teste de reversibilidade) ficam, pela
>   regra escrita no `PROTOCOLO-EXTRACAO.md`: *um cue que valeria igual em
>   qualquer vídeo do canal é `prescricao` mesmo dito dentro de um form check*.
>   Os dois de filmagem (`G030-34/35`) também ficam, e por um motivo que a
>   leitura anterior não tinha: **ângulo de câmera vira protocolo neste
>   repositório** (`design.md` §8), então "ajuda na análise" é conhecimento
>   consumível, e não recado de caixa de entrada.
>
> **O que a fila era, medido:** 74 de 76 são o autor saindo do material alheio
> para enunciar regra dele. A previsão escrita no fecho desta seção — *"o piso
> realista está bem acima de zero, e provavelmente perto do número de hoje"* —
> **acertou**, e é o segundo caso registrado nesta base de uma previsão escrita
> antes valer mais que a contagem depois.

### A lista original, como foi produzida

Esta é a fila da onda 2. Cada id abaixo é uma claim `modo: prescricao` num vídeo
que expõe material de outra pessoa. **Nem todas estão erradas** — a revisão é que
decide, claim a claim, se é `relato-de-programa`, `avaliacao-de-terceiro` ou
generalização legítima do próprio autor. Baixar o teto do vídeo em
`check-claims.mjs` é parte do conserto.

Para reproduzir, sem confiar nesta lista:

```
node research/tools/check-claims.mjs --verbose | grep "gênero"
node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao --limit 0
node research/tools/check-evidence.mjs --genero form-check --modo prescricao --limit 0
```

### `review-de-programa` — 58 claims em 15 vídeos

| vídeo | n | claims |
|---|---|---|
| `G001` GENESIS | 8 | `G001-08` `-17` `-31` `-39` `-45` `-51` `-65` `-66` |
| `G020` StrongLifts 5x5 | 7 | `G020-10` `-15` `-16` `-17` `-27` `-37` `-41` |
| `G002` Bullmastiff (Bromley) | 5 | `G002-14` `-33` `-34` `-46` `-47` |
| `G016` 5/3/1 | 5 | `G016-08` `-10` `-29` `-44` `-46` |
| `G007` Candito | 4 | `G007-02` `-20` `-27` `-38` |
| `G012` Cube | 4 | `G012-38` `-39` `-40` `-44` |
| `G017` Texas Method | 4 | `G017-23` `-32` `-33` `-34` |
| `G019` Starting Strength | 4 | `G019-10` `-37` `-39` `-54` |
| `R047` programa do ChatGPT | 4 | `V047-10` `-18` `-21` `-23` |
| `G005` Candito parte 2 | 3 | `G005-29` `-33` `-45` |
| `G009` PHUL | 2 | `G009-26` `-32` |
| `G011` nSuns | 2 | `G011-32` `-34` |
| `G013` PPL | 2 | `G013-27` `-28` |
| `G014` GreySkull LP | 2 | `G014-13` `-40` |
| `G018` Madcow 5x5 | 2 | `G018-30` `-31` |

### `form-check` — 18 claims em 5 vídeos

| vídeo | n | claims |
|---|---|---|
| `G029` FAS 3 | 7 | `G029-23` `-24` `-34` `-38` `-40` `-43` `-52` |
| `G030` FAS 2 | 5 | `G030-04` `-13` `-18` `-34` `-35` |
| `G027` FAS 6 | 4 | `G027-01` `-05` `-19` `-25` |
| `G031` FAS 1 | 2 | `G031-10` `-29` |
| `G028` FAS 4 | 0 | — |

### O que a fila é de verdade, lida claim a claim

As 76 foram abertas e lidas uma a uma ao atacar esta entrega, e o resultado
muda o que a onda 2 deve esperar — **a maioria não é o defeito que a trava
procura**:

- **`form-check`, 18 de 18 não são o alvo.** Três (`G027-01`, `G030-34`,
  `G030-35`) são logística do canal — *"mande o vídeo por link do YouTube"*,
  *"filme em 3/4"* — e nem deveriam estar em `prescricao`. As outras quinze são
  padrão técnico universal enunciado no meio do form check: *"o joelho passa por
  cima do segundo dedo"*, *"o punho por cima do cotovelo"*, *"o glúteo não sai do
  banco"*. Nenhuma é conselho calibrado para o corpo de quem mandou o vídeo. Isso
  não é falha da trava: as calibradas de verdade já estavam em
  `avaliacao-de-terceiro`, e é por isso que não aparecem aqui. O que sobra é o
  resíduo.
- **`review-de-programa`, a minoria é o alvo.** Os casos claros são os que a
  própria claim entrega com "ele manda": `G011-32` e `G011-34` (o incremento e o
  training max **do nSuns**). O grosso é o Blevins generalizando por conta
  própria enquanto resenha — `G001-08` (*"você não precisa virar atleta de
  CrossFit Games"*), `G020-41` (*"como powerlifter de elite, eu recomendo o
  StrongLifts 5x5"*), `G020-16` (*"foco em forma e técnica"*) —, e um bloco
  intermediário que são as MODIFICAÇÕES que ele propõe ao programa alheio
  (`G016-46`, `G017-32`–`34`, `G007-38`), que são dele e sobre o programa do
  outro ao mesmo tempo.

Duas consequências práticas:

1. **O piso realista está bem acima de zero**, e provavelmente perto do número de
   hoje. Quem for baixar o teto deve esperar confirmar a maioria, não reescrever.
   Uma onda 2 que chegue com a expectativa de zerar vai forçar reclassificação
   onde não há defeito — que é o dano do falso positivo: mandar reescrever o que
   estava certo.
2. **A ambiguidade que atrapalha não é do `genero`, é do texto da claim.** "Ele
   manda", "ele aconselha", "a recomendação dele" não dizem se "ele" é o autor do
   programa ou o Blevins. Isso é anterior ao gênero e não se resolve por
   compilador nenhum — mas é o que a revisão vai ter de decidir em cada linha.

`G028` aparece com zero e é o controle desta tabela: das 34 claims dele, nenhuma
está em `prescricao` — 21 em `avaliacao-de-terceiro` e 13 em `mecanismo`. É a
prova de que o piso zero é alcançável quando quem extraiu traçou a linha inteira,
e é o mesmo arquivo cujo `G028-02` serve de exemplo de que o texto da claim, só
ele, não distingue nada.

### `coaching-call` — 0 claims

`G101` e `G106` ainda não foram extraídos. O teto deles vale zero, então a
extração futura nasce travada.

## 7. Quem consulta

```
# o que revisar, hoje
node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao --limit 0

# tudo o que veio de um form check, qualquer modo
node research/tools/check-evidence.mjs --genero form-check --limit 0

# o que o autor prescreve de verdade sobre um assunto, sem material de terceiro
node research/tools/check-evidence.mjs --topic supino --modo prescricao --genero aula
```

`check-evidence.mjs` resolve `genero` a partir de `src` contra os manifestos e o
imprime em toda claim que lista. Valor fora do enumerado sai com a lista dos
válidos e código 2 — e não com zero resultados, porque "0 claims" e "esse gênero
não existe" mandam consertos opostos.
