# Os enumerados da base: o que entrou, o que não entrou, e como isso cresce

Escrito em 2026-08-09, imediatamente antes do passe que vai preencher `modo` e
`conditions` em 6.909 claims. A ordem é essa de propósito: **vocabulário curto
não é recusado, é contornado**, e contorno de trava foi como um lote gravou
gramas no frame `kg`. Se as gavetas fossem abertas depois, dezoito agentes já
teriam improvisado dezoito soluções.

O que está aqui é decisão, não catálogo. O catálogo vivo é
`research/tools/kb.mjs` (frames, modos, tiers) e o bloco de tópicos do
`PROTOCOLO-EXTRACAO.md`, que o compilador lê do próprio markdown.

---

## 1. A regra que governa as duas listas — e por que elas crescem ao contrário

`frame` e `topic` parecem o mesmo tipo de enumerado e não são. Eles têm funções
opostas, e por isso critérios opostos de admissão.

**`frame` é uma trava.** Ele não ajuda ninguém a achar nada; ele impede que um
número atravesse duas semânticas sem conversor declarado. Uma gaveta a mais custa
uma linha. Uma gaveta a menos custa um número em gaveta errada — `kg` para
gramas, `anos` para semanas, `horas` para hora do relógio — e esse número
continua parecendo certo para sempre. **Frame na dúvida: aceita.**

**`topic` é o índice.** Sem banco vetorial, é o único mecanismo de recuperação
que a base tem. Uma gaveta a mais custa poder de discriminação: se todo assunto
vira tópico, filtrar por tópico deixa de estreitar. E como `--grep` já varre
claim e verbatim, um assunto raro já é alcançável sem tópico próprio. **Topic na
dúvida: recusa.**

O teste que apliquei a cada tópico candidato, nesta ordem:

1. Alguém vai **filtrar** por isso — ou só ler de passagem? Filtro é o que
   justifica gaveta; leitura o `--grep` resolve.
2. A ausência **força um erro**, ou só um encaixe imperfeito? Encaixe imperfeito
   não é motivo.
3. O tópico mais próximo devolveria **quantas** claims a mais? `powerbuilding`
   dentro de `hipertrofia` são 5 dentro de 355: a gaveta estreita de verdade.
4. Ele **duplica** uma distinção que outro campo já faz? Se sim, recusa — dois
   campos dizendo a mesma coisa divergem, e essa divergência é silenciosa.

---

## 2. `modo` — dois valores novos, e por que a distinção é de `modo` e não de `scope`

| valor | entra quando |
|---|---|
| `relato-de-programa` | ele descreve o método **de outra pessoa** |
| `avaliacao-de-terceiro` | ele corrige **uma pessoa específica**, a partir do vídeo dela |

Cinco dos seis lotes de extração do Blevins pediram o primeiro, de forma
independente, sem se falarem. É o sinal mais forte que uma rodada de extração
consegue emitir.

**O problema, concretamente.** Metade do corpus G é review de programa alheio —
5/3/1, nSuns, PHUL, StrongLifts, Candito, Sheiko. Hoje isso vira `scope: GERAL` +
`modo: prescricao`, que é exatamente o filtro que o `SCHEMA.md` declara ser "o
único que pode virar programa". A base não distingue **"ele descreveu o 5/3/1 do
Wendler"** de **"ele prescreve isso a você"**. A série *Form Assessment Saturday*
é a mesma falha de outro ângulo: ele diz "sente mais para trás" para um
desconhecido cujo vídeo acabou de assistir, e o conselho é calibrado para o corpo
e o defeito daquela pessoa. Copiado para o seu treino, é prescrição sem a
condição que a torna segura — o achado mais grave da auditoria de escopo,
reencenado.

**Por que `modo` e não um terceiro `scope`.** `scope: TERCEIRO` é defensável:
"para quem" tem mesmo três respostas, não duas. Recusei assim mesmo, por um
motivo operacional que vale mais que a elegância: `modo` está prestes a ser
preenchido em 6.909 claims por dezoito agentes; `scope` não está no roteiro de
ninguém. Um enumerado declarado e nunca preenchido é pior do que enumerado
ausente — ele promete uma distinção que os dados não têm, e o consumidor confia
no filtro. Fica registrado como **questão aberta**: se um passe futuro tocar
`scope` em toda a base, `TERCEIRO` é a primeira coisa a reconsiderar.

Os dois valores novos bastam para o efeito que importa: nenhum dos dois é
`prescricao`, então nada disso pode virar treino por acidente.

**O teste de decisão** está no `PROTOCOLO-EXTRACAO.md`, em três perguntas
ordenadas. A primeira é a que mais erra: uma frase no imperativo dentro de um
review continua sendo `relato-de-programa` — o imperativo é do Wendler.

### `modo` agora é validado

A ingestão do Blevins achou `G015-19` com `modo: "erro-comum"` — um **tópico**
gravado como modo — e o compilador daquele dia aprovou. A trava existe desde
2026-08-09 e recusa no build.

**Presença era dívida com teto declarado, e a dívida foi paga em 2026-08-09.**
4.947 claims do Vena foram escritas antes de o campo existir; exigir `modo`
naquele dia reprovaria a base inteira, e não exigir nunca é como ele passou uma
ingestão inteira sem trava. O `check-claims.mjs` guardava `TETO_SEM_MODO`, que só
descia. **Chegou a zero: o mapa está vazio e `modo` é obrigatório para toda claim
que não seja `tier: O`** — sem ninguém ter precisado lembrar de ligar nada, que
era o desenho. A catraca pegou, no fechamento, o único dos 18 lotes do fan-out
que nunca rodou (R012, R030, R048, R066, R084, R102, R120, R138, R156, R174 —
278 claims), e ele foi preenchido antes de o mapa esvaziar.

**O teto era por prefixo de id (`{ V: 4947 }`), e prefixo ausente vale zero.** A
primeira versão era um número global, e um número global vaza pelo caminho mais
fácil de encontrar: preencher `modo` em uma claim antiga do Vena abre exatamente
uma vaga para uma claim NOVA nascer sem ele, e a soma não se move. Este documento
e o `SCHEMA.md` afirmavam que "lote novo sem `modo` estoura o teto e falha o
build"; a auditoria mostrou que era falso — copiar o extract, acrescentar uma
claim sem `modo` e preencher uma única do Vena no mesmo passe fazia o build sair
verde. E o passe seguinte faz exatamente as duas coisas ao mesmo tempo, com
dezoito agentes em paralelo. A dívida real nunca foi um número: é o conjunto
`V###`, e nenhum corpus novo tem direito a ela.

---

## 3. `frame` — onze gavetas novas

| frame | resolve | evidência do problema |
|---|---|---|
| `pct_XRM` | "85 % do seu 5RM" | mesma forma de `pct_1RM`, dose ~15 % diferente. Exige o param `xrm_base` com o X |
| `ordinal` | semana 3, bloco 2, onda 1, tier 2 | `G019-12/13/23` escreveram "fase um" por extenso para escapar da trava |
| `rotulo` | 5/3/1, 5x5, Ph3, T1 | `G019-20`, `G020-01`, `G020-41` declararam `series: 5, reps: 5` para frases que não prescrevem série nenhuma |
| `hora_do_dia` | "às 6 h" ≠ "6 horas" | `V171-32/33`, `V112-22/23` gravaram hora do relógio como duração; dois params já traziam `unit: "hora do dia"` sobre `frame: "horas"` |
| `indice_estresse` | a unidade do *stress index* | `G007-28` gravou "6.9 séries duras" com frame `series` — meia série não existe |
| `escala_subjetiva` | "foco 2 de 10" | `G001-66`, escrito por extenso. `escala_dor` fica separado: é instrumento clínico |
| `grau_C`, `grau_F` | temperatura | `graus` é ângulo; `G044-03` ficou por extenso |
| `l` | litro | `V112-22` gravou "meio litro" com frame **`kg`** — o bug dos gramas, ainda vivo |
| `xicara` | medida culinária | `G044-12`, por extenso. A alternativa era o agente converter para ml sozinho |
| `pes` | pé/ft | mesma razão: sem a gaveta, o agente converte |

O caso do `rotulo` merece nome próprio, porque é o pior modo de falha que este
esquema pode ter: **a trava fabricou a medida que ela existe para proteger.** A
regra "todo número na claim precisa de param" não distingue medida de
identificador, então "o StrongLifts 5x5 traz menos terra" — uma frase sobre
frequência de terra — saiu da extração declarando cinco séries de cinco. Quem
consultasse "séries prescritas" receberia uma dose que ninguém prescreveu. A
trava agora também aceita dígitos que aparecem **dentro** de um valor textual, o
que é o que permite declarar `{"value": "5x5", "frame": "rotulo"}` e satisfazer a
regra sem inventar nada.

`pct` continua sendo o percentual genérico cuja base está dita na prosa, e é onde
cai "10 % abaixo do abridor". Não abri `pct_referencia` — ver §5.

---

## 3-bis. `frame` — oito gavetas de 2026-08-09 (onda 2), e a metade que ficou aberta

Escrito no passe que moveu os params que `node research/tools/params-gaveta-errada.mjs`
enumerava. A regra do §1 vale inteira aqui: **frame na dúvida, aceita** — e as
oito abaixo existem porque, sem elas, o número já estava numa gaveta que mentia.

| frame | resolve | evidência do problema |
|---|---|---|
| `ano_calendario` | 2019, 2024, 2025 | seis params gravavam ano com frame `anos` ou `contagem`. `V175-40` tem o ano e três cargas na mesma claim: a duração falsa fica encostada em medida de verdade |
| `indice_adimensional` | BRI (4,5–5,5), R² (0–1) | cinco params em `pct`. Um R² de 0,9 lido como 0,9 % erra por duas ordens de grandeza, e `V044-07` põe um índice corporal na mesma gaveta de percentual de carga |
| `horas_semana`, `horas_dia`, `min_semana`, `min_dia`, `lb_semana`, `MET_min_semana` | **taxa** — algo por período | `4 h/semana` gravado como `4` com frame `horas`, encostado em `treino de 3 h` gravado como `3` com frame `horas`. `V102-25` gravava 12200 MET-min/semana como frame `min` — 203 horas por semana, que não cabe numa semana |

**Uma gaveta por par unidade × período, e não um `taxa` genérico.** Um frame que
dissesse só "por semana" voltaria a achatar `4 h/semana`, `4 sessões/semana` e
`4 lb/semana` — o mesmo achatamento que o §1 chama de contorno de trava. E
`horas_semana` convive com `min_semana` pela mesma razão que `horas` já convivia
com `min`: converter é trabalho de conversor declarado, não de quem extrai. O
sufixo copia o `x_semana` que já existia, para que a família se reconheça sozinha.

### O que ficou aberto, e por que não é preguiça

`params-gaveta-errada.mjs` tinha uma regra de taxa **estreita** — olhava só
`frame ∈ {min, seg, horas}` — e por isso reportava 19. A regra larga (`unit` tem
barra e `frame` não carrega período) acha **111 params em 69 claims**: 68 em
`series` (*"séries/semana"* gravado como `series`), 18 em `lb`, 16 em `contagem`,
9 em `reps`. A regra do detector foi alargada no mesmo passe, porque **regra
estreita que reporta número pequeno é pior que regra ausente: ela faz o passe
parecer terminado.**

Os 111 **não** foram movidos, e a razão é uma trava:

> `series`, `reps` e `lb` estão em **`FRAMES_DOSE`**. Abrir `series_semana` e
> mover 68 params para lá os tira da lista de dose e **desliga em silêncio** o
> aviso de *"prescrição com dose e sem `conditions`"* para todos eles.

Trocar um defeito de tipagem pelo desligamento da trava mais cara da base é
exatamente o modo de falha nº 2 desta casa, com o sinal invertido. O passe que
fechar esta família tem de mexer em `FRAMES_DOSE` no mesmo commit, e é passe
próprio.

### `value` string — decidido: número, e `rotulo` é a única exceção

Onze params guardavam string. Duas famílias, dois destinos opostos:

- **Fração vira decimal, com a fração preservada por escrito no `unit`.** `"2/3"`
  com frame `pct_1RM` virou `66.7` com `unit: "% do 1RM (dois terços)"`. O
  `verbatim` continua dizendo `2/3` e nada se perde; o que se ganha é o número
  caber na escala fechada do frame e poder ser comparado. Oito params.
- **Em `rotulo`, a string é o registro certo.** `"5x5"` não mede nada, e `rotulo`
  é a gaveta que declara isso — o `check-claims.mjs` já extrai os dígitos de
  dentro do valor textual para satisfazer a regra de procedência, e há caso de
  aceitação para isso no teste dele. Forçar `5x5` a virar número seria fabricar
  a medida que `rotulo` foi aberto para impedir, que é literalmente o defeito de
  `G019-20`. Três params, e ficam.

### Dois params que saíram

- `V169-42` `preco = 300 USD`: dinheiro está declarado fora de escopo no §5
  deste arquivo. O frame `contagem` que ele ocupava era o contorno.
- `V013-15` `conviccao = 100 %`: "100 % convicto" não mede coisa nenhuma. O
  número não aparece na `claim`, só no `verbatim`, então nada se perdeu.

`V166-05` continua de pé e **não** é gaveta errada: a claim inteira é uma nota de
artefato de extração (*"o número que a transcrição registra é 45 lb, valor
implausível"*) ocupando gaveta de `fato`. Remover claim não é passe de enumerado.

---

## 4. `topic` — seis gavetas novas

| tópico | claims semeadas | por que passou |
|---|---|---|
| `proximidade-da-falha` | 144 | AMRAP e distância da falha são o eixo das arestas de contradição 12–14 e 16. **A divergência mais consequente da base não tinha tópico próprio.** `rpe` cobre a escala, não o método |
| `estagnacao` | 51 | "estou travado" é a pergunta mais frequente de um atleta, e as respostas (deload, trocar programa, mexer no volume) moram em três tópicos diferentes |
| `training-max` | 45 | cada programa define TM de um jeito, e foi confundir 1RM com TM que originou este esquema inteiro |
| `descanso-entre-series` | 17 | parâmetro que o app consome literalmente. `recuperacao` (368 claims) é entre sessões — misturar responde a pergunta errada |
| `carga-de-treino` | 13 | o *stress index* é o tema central de cinco vídeos e é o que unifica volume, intensidade e fadiga numa medida só |
| `powerbuilding` | 5 | 5 claims dentro de `hipertrofia` (355). É o objetivo declarado do consumidor desta base, e a gaveta estreita 70× |

`powerbuilding` com 5 claims é o caso limite e entrou pelo critério 3: o valor de
um tópico é o quanto ele **estreita**, não o quanto ele acumula. `faixa` (9),
`genetica` (12) e `idade` (3) já viviam na base pela mesma razão.

### A semeadura, e o que ela não é

Os seis tópicos foram semeados por regra **literal e apenas aditiva**: a claim
recebe o tópico quando o termo aparece escrito nela ou no verbatim
(`/\bamraps?\b/`, `/training max/`, `/stress index/`, `/plat[ôo]|estagn/`, …).
Nenhum tópico foi removido, nenhuma ordem mudou.

Revisei o resultado claim a claim nas gavetas pequenas e tirei dois falsos
positivos: `G010-08` e `G019-11` falam de **dia** de descanso entre sessões, que
é `recuperacao`, e casaram com `descanso entre` por acidente. É a confusão exata
que o tópico existe para evitar, cometida pela regra que o semeou — motivo de
sobra para a semeadura ser lida e não confiada.

**A auditoria seguinte achou mais três, na mesma gaveta, e a lição é que "revisei
claim a claim" não é verificação.** `descanso-entre-series` caiu de 15 para 12:

- `G019-47` — "esse rodízio aumenta o intervalo entre as **sessões** de terra e é
  isso que amplia a recuperação". Verbatim: *"more time in between your
  deadlifts… increase your recovery"*. É exatamente a classe `G010-08`/`G019-11`,
  a que a revisão manual declarou ter varrido, sobrevivendo dentro dela.
- `G051-12` — *"even my downtime I see is work because it's recovery time"*. É
  descanso de vida, não intervalo dentro da sessão.
- `V166-25` — "buscar temas como **tempo de descanso** ou frequência no Google
  Scholar". A claim é sobre método de estudo; "tempo de descanso" aparece só como
  exemplo de busca. Casamento literal puro.

Três de quinze é 20 % de ruído numa gaveta cuja justificativa inteira era
"misturar os dois responde a pergunta errada" — e o tempo de descanso é
parâmetro que o app consome literalmente.

Isso é precisão alta com cobertura parcial, **de propósito e declarado**: uma
claim que fala de proximidade da falha sem usar a palavra continua sem o tópico.
A alternativa — deixar as seis gavetas vazias até alguém retaggear a base — é
pior de um jeito específico: um tópico sem claim nenhuma responde "não existe
nada sobre isso" quando existe, e é indistinguível de uma lacuna real. Uma
retaggeação semântica completa é trabalho de outro passe e está listada em §7.

---

## 5. O que foi RECUSADO

A recusa é tão entregável quanto a aceitação, e vale mais escrita: sem isto, o
próximo agente que esbarrar em preço vai reabrir a discussão do zero e
provavelmente decidir o contrário.

### Frames

**Moeda (`USD`, `BRL`) — recusado, e o problema não é o frame.** Preço de ebook,
de coaching e de bloco de app aparece em `G003`, `G025`, `G026`, `G037`, `G042`.
O frame resolveria o número; a pergunta certa é anterior. **Ninguém vai consultar
esta base para saber quanto custa o ebook do Bromley**, e a claim de preço
envelhece em semanas enquanto a base é escrita para durar anos. A decisão foi
declarar preço, promoção, cupom e oferta **fora do escopo da base**, e isso está
no `PROTOCOLO-EXTRACAO.md` em "O que NÃO virar claim". Abrir o frame teria feito o
contrário: convidado mais claims de preço, com autoridade de dado tipado.

O que continua entrando é o **conflito de interesse**, que é conhecimento de
verdade — "ele vende o programa que está recomendando" é uma claim legítima,
`modo: fato`, sem número nenhum. Sai o preço, fica a informação que muda como se
lê a recomendação.

*Nota de dívida:* as claims de preço que já existem (`G025-04`, `G026-17`,
`G026-32`, `G026-33` e mais algumas) ficaram como estão, com o número por
extenso, em `meta-metodologia`. Não as removi porque remover claim é destrutivo e
o passe de hoje é de enumerado. Ficam listadas aqui como candidatas a uma curadoria
de relevância.

**Temperatura — aceita, mas pela razão oposta à que se supõe.** `grau_C` e
`grau_F` entraram, e isso **não** é um voto a favor de extrair a temperatura do
frango. É a separação que o §1 estabelece: **frame não decide relevância; `topic`
decide.** Enquanto `nutricao` for tópico legítimo e a claim do `G044-03` existir,
os 190 °F dela ou têm gaveta ou ficam por extenso gerando um aviso que ninguém
pode resolver — e aviso sem conserto ensina a ignorar avisos. Temperatura
ambiente (garagem fria, `G041`) tem consequência real de aquecimento, o que
sozinho já pagaria a gaveta.

**`pct_referencia` (percentual de uma carga de referência que não é 1RM nem TM) —
recusado.** `pct` genérico já existe e já é o pouso seguro; a base do percentual
("10 % abaixo do abridor") está sempre nomeada na prosa, e um frame que diz
"percentual de algo" não diz mais do que `pct`. Diferente do `pct_XRM`, que entrou
porque é **confundível**: tem a mesma forma de `pct_1RM`, é consumido como carga
direta, e trocar um pelo outro erra a dose em cerca de 15 %.

### Tópicos

**`analise-de-programa-de-terceiro` — recusado, porque `modo` já carrega.** Este é
o mesmo buraco que `relato-de-programa` fecha. Marcar a mesma distinção em dois
campos cria exatamente a divergência silenciosa que este projeto já sofreu:
claims com o modo e sem o tópico, e vice-versa, e nenhum jeito de saber qual dos
dois está certo. Quem quiser "tudo sobre o 5/3/1" usa `--grep`.

**`preco` / `negocio` — recusado** pelo mesmo motivo do frame de moeda.

**`app` / `ferramenta-de-coaching` — recusado**, apesar das 43 claims de
`G024`–`G026`. É conteúdo de produto, e o conjunto de decisões deste atleta não
inclui "qual app de coaching assinar". As claims continuam em
`meta-metodologia`, onde já estavam.

**`avaliacao-de-forma` — recusado.** A substância de um form check é técnica e
erro comum, e esses tópicos existem. O que faltava não era o assunto, era a
**postura** — conselho endereçado a um corpo específico — e isso virou
`modo: avaliacao-de-terceiro`. Assunto é `topic`; postura é `modo`.

**`bfr` (4 claims), `walkout` (7), `massagem`/`tecido-mole` (4),
`equipamento-de-barra`/SSB, `gestao-de-tempo` — recusados por volume.** Cada um é
alcançável por um tópico existente mais `--grep`. Uma gaveta com quatro claims
não estreita nada e cobra o preço mesmo assim: mais uma linha que todo agente
precisa considerar em cada claim. `walkout` é o mais próximo de passar — é um
modo de falha real para quem nunca competiu — e reabre na hora em que o corpus
tiver umas 25 claims sobre ele.

**`amrap` como tópico separado de `proximidade-da-falha` — recusado.** São o mesmo
eixo: o AMRAP é o instrumento, a proximidade da falha é a variável. Dois tópicos
para um eixo só espalham as claims em vez de reuni-las.

---

## 6. Como o vocabulário cresce daqui pra frente

1. **Ninguém amplia enumerado sozinho, no meio de um lote.** Agente que esbarra
   numa falta faz o que o protocolo manda: usa o mais próximo, ou deixa o número
   por extenso, e **relata no resumo final**. Um enumerado que cresce dentro de um
   lote cresce dezoito vezes em paralelo, com dezoito nomes diferentes para a
   mesma coisa.
2. **A ampliação acontece entre passes, num commit próprio**, com este documento
   atualizado no mesmo commit. Ampliar sem escrever o porquê é como a lista de
   `frame` cresceu no código enquanto o `SCHEMA.md` descrevia outra coisa.
3. **Mudou o enumerado, mudou nos três lugares no mesmo passe**: `kb.mjs` (a
   trava), `SCHEMA.md` (o registro) e `PROTOCOLO-EXTRACAO.md` (a instrução). Os
   tópicos já são um objeto só por construção — o compilador lê a lista do
   markdown —, e essa é a forma que os outros deveriam ter.
4. **Frame novo entra com um teste que passa e um que falha** em
   `check-claims.test.mjs`. O teste que passa não é decorativo: um checker fica
   trivialmente "correto" recusando tudo, e foi recusando demais que a trava
   fabricou `series: 5` para o nome de um programa.
5. **A pergunta para admitir tópico é "alguém vai filtrar por isso"; para admitir
   frame é "que número fica errado sem ele".** Se a resposta do tópico for "seria
   bom ter", é não. Se a resposta do frame for "nenhum, ainda", pode ser sim —
   `pct_XRM` entrou preventivamente, porque o erro que ele evita é caro e a
   extração já relatou o caso.
6. **Recusar é uma entrega.** Escreva a recusa aqui, com o motivo. Uma recusa não
   escrita volta como proposta a cada rodada.

---

## 7. O que este passe NÃO fez

- **Não retaggeou a base semanticamente.** Os seis tópicos novos foram semeados
  por casamento literal (§4). Claim que trata do assunto sem dizer a palavra
  continua sem o tópico. Um passe de retaggeação semântica é trabalho próprio.
- **Não preencheu `modo`** nas 4.947 claims do Vena. É o passe seguinte, e o teto
  `TETO_SEM_MODO` está esperando por ele.
  → **Feito em 2026-08-09.** O teto chegou a zero e o mapa está vazio. Ver
  `ESTADO.md` para o que sobrou de julgamento não verificado nessa atribuição.
- **Não atribuiu `relato-de-programa` nem `avaliacao-de-terceiro` a nenhuma claim,
  de propósito.** Os dois valores estão hoje em zero, e isso **não** significa que
  o corpus não tenha o material — significa que atribuir modo é decisão semântica
  por claim, e uma regra literal erraria de um jeito caro: uma frase no imperativo
  dentro de um review parece prescrição para qualquer regex. Semear meia dúzia de
  exemplos seria pior ainda, porque criaria dentro do mesmo arquivo dois vizinhos
  com modos diferentes para claims parecidas, e agente copia vizinho. O teste de
  três perguntas do `PROTOCOLO-EXTRACAO.md` é o que substitui a semente.
  Candidatos densos, para quem começar: `G011` inteiro (nSuns), `G009`/`G013`
  (PHUL, powerbuilding), `G012` (Cube), `G014` (Greyskull), `G019`/`G020`
  (Starting Strength, StrongLifts), `G004` (Wendler/GZCLP) para
  `relato-de-programa`; `G027`, `G030` e `G031` para `avaliacao-de-terceiro`.
- **Não removeu as claims de preço** (§5), que hoje são dado fora de escopo,
  tolerado.
- **Não abriu `scope: TERCEIRO`** (§2), que continua sendo a questão aberta mais
  interessante do esquema.
- **Não resolveu a ambiguidade do frame `min`** (tarefa #31), que é anterior a
  este passe e continua de pé.

---

## 8. O achado da auditoria: as duas gavetas novas de `modo` não são atribuíveis a partir do registro

Escrito depois de tentar, de verdade, classificar as claims que motivaram
`relato-de-programa` e `avaliacao-de-terceiro`. **As duas gavetas estão certas na
distinção e erradas no lugar onde foram penduradas.**

O discriminador de ambas é uma propriedade do **vídeo**, não da claim:

| gaveta | o discriminador real |
|---|---|
| `relato-de-programa` | o vídeo é um *Professional Powerlifter Reviews* — o programa é de outra pessoa |
| `avaliacao-de-terceiro` | o vídeo é um *Form Assessment Saturday* — o conselho é para um corpo específico |

E o registro não carrega esse discriminador, porque a extração já normalizou a
claim para prosa geral **antes de a gaveta existir**. Medido:

- **20 vídeos de review (`G001`–`G020`), 938 claims. 206 já estão em
  `modo: prescricao`, e 169 delas (82 %) não nomeiam o programa no texto.**
  `G001-22` é literalmente "Nesses exercícios **você** usa faixas de 8 a 12
  repetições" — segunda pessoa, para um programa que o Blevins está *resenhando*.
  `G001-11`, `-13`, `-19`, `-24`, `-26`, `-28` são a mesma coisa em sequência.
- **5 vídeos de form check (`G027`–`G031`), 204 claims. 97 em `modo: prescricao`,
  e 87 delas (90 %) não têm marcador nenhum de pessoa específica.** `G028-02` é
  "Manter a cabeça em posição mais neutra e para cima no agachamento". Do texto
  da claim, isso é indistinguível de prescrição geral.

O agente que vai preencher `modo` lê o JSONL, não o vídeo. **Pior: o teste de
três perguntas do `PROTOCOLO-EXTRACAO.md` o manda ativamente para a resposta
errada** — a pergunta 3 diz "ele generaliza a partir do caso? → aí sim
`prescricao`, e a claim tem de estar escrita na forma geral", e todas as 87 e as
169 *estão* escritas na forma geral. Seguindo o protocolo à letra, as duas
gavetas ficam em zero e o achatamento que elas existem para desfazer sobrevive
intacto, agora com um enumerado que promete tê-lo desfeito.

**A correção é a regra da casa: onde um compilador pode verificar, agente não
deve.** O gênero é do vídeo e o vídeo tem manifesto. Um campo `genero` por vídeo
em `sources.mjs`/manifesto (`review-de-programa`, `form-check`, `vlog`, `regra`)
resolve os três problemas de uma vez:

1. dá ao agente o sinal que a claim perdeu, sem ele ter de reabrir o vídeo;
2. deixa o `check-claims.mjs` **recusar** `modo: prescricao` em claim vinda de
   vídeo `review-de-programa` ou `form-check` — o gate determinístico sobre
   1.142 claims que hoje dependem de 18 julgamentos independentes;
3. transforma "quais claims revisar" numa consulta, e a resposta é **303 claims
   em `modo: prescricao` hoje** vindas desses 25 vídeos.

O título do vídeo não serve de substituto: `G027` se chama só "FAS 6" e `G028`
"FAS 4", então nem a heurística de título acha os cinco form checks.

Enquanto o campo não existir, `relato-de-programa` e `avaliacao-de-terceiro` são
enumerado declarado que ninguém preenche — exatamente o defeito que o §2 usou
para **recusar** `scope: TERCEIRO`. O argumento vale contra as duas gavetas que
foram aceitas na mesma rodada.

### RESOLVIDO em 2026-08-09 — o campo existe, com dez valores e não quatro

`genero` está no manifesto dos dois canais, em 551 de 551 vídeos, e o registro da
decisão é `research/kb/GENERO.md`. Três diferenças em relação ao que este §8
propunha, e cada uma é uma aplicação de regra desta casa:

1. **Dez valores, não `review-de-programa | form-check | vlog | regra`.** `vlog`
   teria de engolir log de sessão, filmagem de meet, oferta de coaching, Q&A e
   clipe de PR. Enumerado curto não é recusado, é contornado — o §1 diz isso
   sobre `frame`, e `genero` é uma trava, não um índice: **na dúvida, aceita**.
   Entraram `aula`, `log-de-treino`, `competicao`, `perguntas`, `institucional`,
   `clipe`, `coaching-call` e `indeterminado`.
2. **`regra` foi RECUSADO.** O regulamento da IPF é `kind: 'normativo'`: não tem
   manifesto e não tem vídeo, então o gênero não teria onde morar. E o
   discriminador já existe e é mais forte — `tier: O`, que o checker usa para
   isentar a claim de `modo` e de `scope`. É o critério 4 do §1: dois campos
   dizendo a mesma coisa divergem, e a divergência é silenciosa.
3. **A trava MEDE, não recusa.** Este §8 pedia que o `check-claims.mjs`
   *recusasse* `prescricao` vinda de review ou form check. Recusar de saída
   derrubaria o build sobre 76 claims existentes, na rodada que tinha proibição
   explícita de editar claim — e trava que quebra o build no dia em que nasce é
   trava que alguém afrouxa na mesma tarde. Virou catraca por `src`
   (`TETO_PRESCRICAO_EM_GENERO_RESTRITO`), no molde do `TETO_SEM_MODO`, que só
   desce.

**E os números de antes não fecham entre si — o que o compilador conta agora é
76.** Este §8 diz "303 claims em `prescricao` vindas desses 25 vídeos"; o
`ESTADO.md`, contando depois do conserto, diz 94 nos vinte de review mais 18 nos
cinco de form check, que dá 112. As duas contas não podem estar certas ao mesmo
tempo e nenhuma das duas é reproduzível por comando — que é exatamente a doença
que o campo `genero` existe para curar, cometida dentro do documento que a
diagnostica.

O que dá para reconstruir do 112 é: menos 40 (as prescrições de `G004`, `G006` e
`G008`, que estão na faixa contígua `G001`–`G020` e são **tese própria** do
Blevins, não resenha), mais 4 do `R047` do Vena, que nenhuma das duas contas
enxergava por olharem só o corpus G. Dá 76, e é o número que
`node research/tools/check-claims.mjs` imprime. **O 303 continua sem explicação,
e fica registrado como não explicado** — número de qualidade sem instrumento é
opinião com cara de medida, e vale para os desta casa também.
