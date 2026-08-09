# O esquema da claim

Este arquivo define o registro atômico da base. Ele existe porque a run 1 guardou
conhecimento como prosa em markdown, e prosa não sabe recusar nada.

## Por que tipar

Dois defeitos da run 1 chegaram até o programa e sobreviveram a uma auditoria de
citações marcada como concluída:

**O fator de profundidade do agachamento (−12 a −18%) não tinha fonte no corpus.**
O do supino tinha (R83/R4). O do terra tinha (R174). Esse era interpretação
circulando com a autoridade de citação.

**A conversão 1RM → `trainingMax` nunca foi aplicada.** O `baseline.md` rotula
215/160/240 como 1RM legal estimado; o `design.md` consome os mesmos números como
`trainingMax`, que é ~92–94% de um 1RM. Dois documentos, duas semânticas, nenhum
alarme.

Os dois são a mesma falha: **prosa verificando prosa**. O `verification.md` já
enunciava o princípio certo — *onde um compilador pode verificar, agente não
deve* — mas ele só tinha sido aplicado ao programa, nunca à base que o alimenta.

Aqui a claim vira registro tipado para que `check-claims.mjs` possa recusar, no
build, o que um revisor humano cansado deixa passar.

## Fonte de verdade

**O JSONL é a fonte; o markdown é gerado.** É o inverso do que o repositório faz
com `PROGRAMA.md` → `generated.ts`, e de propósito: o que o checker verifica
precisa ser a fonte, senão a checagem descola do que as pessoas leem. Agente
escreve markdown mais fluente do que JSONL — mas markdown não recusa um número
sem unidade.

- `research/extract/R014.jsonl` — uma claim por linha, **um arquivo por vídeo**. **Fonte.**
- `research/kb/topics/*.md` — visões temáticas legíveis. **Geradas. Não editar.**

O arquivo é por vídeo, e não por lote de trabalho, porque quem consulta a base
parte de uma citação `[R014 @03:05]`: o caminho tem que sair da própria citação,
sem índice no meio. Também torna a regeneração idempotente — refazer um vídeo
reescreve um arquivo e não toca em nenhum outro.

## O registro

```jsonc
{
  "id": "V014-03",         // {idPrefix do corpus}{NNN}-{seq} — ver "A regra de
                           // id", abaixo. Estável e imutável, carrega a
                           // procedência à vista. Nunca renumerar:
                           // contradições, sínteses e conditions apontam pra cá.
  "src": "R159",           // ref do manifesto. Tem que existir e ser citável.
  "at": "03:05",           // onde a evidência começa. Dentro da duração do vídeo.
  // NÃO existe campo `date` na claim: a data mora no manifesto, por vídeo, e se
  // deriva de `src`. Duplicá-la aqui criaria duas verdades para o mesmo fato e
  // uma delas envelheceria. O que importa é que "o recente vence" seja
  // computável — e é, via manifesto.

  "tier": "R",             // procedência. Enumerado FECHADO — ver abaixo.
  "scope": "GERAL",        // GERAL = ele prescreve para os outros
                           // PESSOAL = ele descreve o que faz
                           // A run 1 misturou os dois e virou prescrição.
  "certainty": "explicit", // explicit = ele diz. implied = você inferiu do que ele diz.
  "modo": "prescricao",    // QUE TIPO de afirmação é — ortogonal a `scope`.
  "conditions": ["V175-53"], // as claims que limitam esta. Ver abaixo: é a aresta
                             // mais importante da base.

  "topic": ["agacho", "tecnica"],

  "claim": "…",            // pt-BR. UMA afirmação. Se tem "e" no meio, são duas claims.
  "verbatim": "…",         // trecho LITERAL da transcrição, em inglês, minúsculo.
                           // O checker confere que está mesmo lá, perto de `at`.

  "params": [              // todo número citável mora aqui, nunca solto na prosa.
    { "name": "rpe_alvo", "value": 8, "unit": "RPE", "frame": "RPE" }
  ],

  "conflicts": ["V088-12"] // opcional. Vira aresta no ledger de contradições.
}
```

### A regra de id, e por que ela é assimétrica

Este documento dizia `V{ref}-{seq}` e chamava a colisão de "impossível por
construção". **Era falso, e a base nunca usou essa regra.** Com uma fonte só a
fórmula funcionava; com duas, `ref = G010` produz `V010-01`, que já é do
`R010.jsonl` do Vena. Os seis agentes que extraíram o Blevins bateram nisso e
resolveram cada um do seu jeito — metade escreveu `G001-01`, metade escreveu
`VG028-01` — e as 702 do segundo grupo ficaram invisíveis para o
`check-evidence.mjs`, cuja regex é `^[A-Z]\d{3}-\d+$`. Invisíveis em silêncio: a
ferramenta respondia "nada a fazer" em vez de "não existe", e metade das arestas
daquela ingestão estava inverificável sem que nada reclamasse.

A regra real, agora travada no compilador:

```
research/extract/{refPrefix}{NNN}.jsonl   →   id {idPrefix}{NNN}-{seq}

G008.jsonl → G008-01   F001.jsonl → F001-01   R014.jsonl → V014-01
```

`idPrefix` é declarado por fonte em `sources.mjs` e é **igual** ao `refPrefix`
para toda fonte. O Vena é a única exceção, com `V`, porque os ids dele nasceram
antes de existir uma segunda fonte e hoje são 4.947 identificadores já citados
por `conflicts`, `basis` e `conditions`. Renumerar id publicado é a única coisa
que este esquema proíbe sem exceção, então a assimetria fica declarada no
registro de fontes — uma exceção não declarada é uma exceção que alguém vai
"corrigir".

O checker recusa id que não case com o arquivo e id fora da forma
`{LETRA}{NNN}-{seq}`.

### `tier` — enumerado fechado, sem promoção

| tier | o que é |
|---|---|
| `R` | dito no corpus de vídeo. Exige `src` + `at` + `verbatim`. |
| `E` | atleta de elite ou coach do roster curado. Exige fonte com URL. |
| `L` | literatura. Exige PMID ou DOI. |
| `I` | **interpretação minha.** Exige `basis`: os IDs das claims de onde saiu. |
| `U` | dito por você. Exige a data da conversa. |
| `O` | **documento normativo** — regulamento da IPF, regra de federação. Exige `source` com documento, versão e parágrafo. |

`O` existe separado de `L` porque regra não é evidência: não se pondera contra
outro estudo, não perde para achado mais recente, e não admite interpretação
"é discutível". Ou o joelho passou da linha ou não passou. Numa base cheia de
opinião de YouTube, é o único tier onde discordar não é uma opção.

**`I` nunca vira `R`.** Foi exatamente essa lavagem que produziu o fator de
profundidade. O checker recusa uma claim `I` sem `basis`, e recusa uma claim `R`
cujo `verbatim` não aparece na transcrição.

### `modo` — porque `scope` sozinho achata cinco coisas

A auditoria de escopo mediu: **só 17% do que está marcado `GERAL` é prescrição.**
O resto é opinião, mecanismo, fato do mundo e narração de estudo. A run 1
achatou `GERAL` contra `PESSOAL`; separar os dois e parar aí só empurrou o
achatamento para dentro do `GERAL`.

Isso quebra a consulta que mais importa. Filtrar `scope: GERAL` devolve "ele acha
o deltoide anterior subestimado" junto com "agache duas vezes por semana", como
se fossem a mesma categoria de instrução — e é a segunda que vira treino.

| modo | o que é |
|---|---|
| `prescricao` | ele diz para **você** fazer. **É o único que pode virar programa.** |
| `relato-de-programa` | ele descreve o método **de outra pessoa** |
| `avaliacao-de-terceiro` | ele corrige **uma pessoa específica**, a partir do vídeo dela |
| `opiniao` | ele acha, sem prescrever |
| `mecanismo` | por que funciona — fisiologia, alavanca, causa alegada |
| `estudo` | ele narra literatura. Não vira `tier: L` — continua sendo ele contando. |
| `pratica-pessoal` | **o que ele faz de rotina.** Muitas datas. Exige `scope: PESSOAL` |
| `narrativa` | um episódio. Uma data |
| `fato` | o que ele **é**, ou o que o mundo **é**. Nenhuma data |
| ~~`anedota`~~ | **em fusão com `narrativa`** — ver abaixo |

`scope` diz **para quem**; `modo` diz **que tipo de coisa**. São perguntas
diferentes e precisam de campos diferentes.

**A fronteira entre os três de baixo é uma pergunta de contagem, não de
dicionário: *quantas datas cabem nesta frase?*** Nenhuma → `fato`; uma →
`narrativa`; muitas → `pratica-pessoal`. O teste completo, com os casos de
fronteira resolvidos por id, está no `PROTOCOLO-EXTRACAO.md`; o registro da
decisão e o tamanho do que ela move, em `FRONTEIRA-MODO.md`.

**`pratica-pessoal` é o terceiro andar do mesmo achatamento.** `scope` separou
"para você" de "para mim"; `relato-de-programa` e `avaliacao-de-terceiro`
separaram, dentro do `GERAL`, o que é dele do que é de outro. Dentro do `PESSOAL`
sobrou a mistura que mais importa para o consumidor desta base: *"ele agachou
825 lb semana passada"* e *"ele supina 6 dias por semana"* moram na mesma gaveta,
e só a segunda vira uma linha do treino de alguém. Pior: a gaveta em que as duas
moram chama-se `narrativa` e é definida como episódio, então o campo afirma
justamente o contrário do que o consumidor precisa saber. `pratica-pessoal` é o
conjunto que precisa carregar o aviso — *o hábito de um homem de 120 kg que não
compete testado não é prescrição para ninguém* — e hoje esse conjunto não é
enumerável.

**`anedota` sai porque a fronteira nunca existiu.** Os 18 lotes a separaram de
`narrativa` por tempo verbal, e medido em 9/8/2026 o passado aparece em 32 % das
`narrativa` contra 48 % das `anedota` — smear, não fronteira. E nenhuma consulta
desta base pede uma sem a outra: as duas são episódio único, do mesmo homem, com
o mesmo peso de evidência. O que o campo guardava está no `verbatim`, que é a
fonte; o campo era uma cópia lossy, e é o critério 4 do `ENUMERADOS.md` §1 —
*dois campos dizendo a mesma coisa divergem, e essa divergência é silenciosa*.

**Nenhuma das duas mudanças está no `kb.mjs` ainda, e isso é deliberado.**
Enumerado declarado e vazio promete uma distinção que os dados não têm — foi com
esse argumento que `scope: TERCEIRO` foi recusado (`ENUMERADOS.md` §2). A linha do
enumerado, a trava e o retag entram no **mesmo** commit, na onda 2. `anedota` só
sai de `MODOS` quando a última claim sair dela.

**`relato-de-programa` e `avaliacao-de-terceiro` são o mesmo achatamento, uma
camada abaixo.** Metade do corpus do Blevins é ele expondo o programa dos outros
(5/3/1, nSuns, PHUL, Sheiko) ou corrigindo um desconhecido a partir de um vídeo
enviado — e as duas coisas caíam em `GERAL` + `prescricao`, que é o filtro que
vira treino. "O nSuns manda AMRAP a 95 % do training max" com a mesma autoridade
de "faça AMRAP a 95 % do training max"; um conselho calibrado para o corpo de
outra pessoa com a mesma autoridade de um conselho geral. Separar `GERAL` de
`PESSOAL` e parar aí só empurrou o achatamento para dentro do `GERAL` de novo.

`tier: O` não leva `modo`, pelo mesmo motivo que não leva `scope`: norma não é
prescrição de ninguém.

**A presença de `modo` é obrigatória, e a dívida foi paga.** As 4.947 claims
escritas antes de o campo existir eram todas do Vena, todas com id `V###`; o
Blevins nasceu com o campo em 1.819 de 1.819. `TETO_SEM_MODO`, no
`check-claims.mjs`, é um mapa **por prefixo de id**, **todo prefixo ausente do
mapa vale zero**, e **desde 2026-08-09 o mapa está vazio**: a catraca chegou ao
fim e `modo` é obrigatório para toda claim que não seja `tier: O`, sem que
ninguém precisasse lembrar de ligar nada. Foi exatamente esse desenho que pegou
o único lote que não rodou no fan-out (R012, R030, R048, R066, R084, R102, R120,
R138, R156, R174 — 278 claims, um dos 18 agentes), preenchido no fechamento.

Por prefixo e não global porque um teto global vaza pelo caminho mais fácil de
encontrar: preencher `modo` numa claim antiga abre exatamente uma vaga para uma
claim nova nascer sem ele, e a soma não se move. Este documento afirmou por um
tempo que "um lote novo que esqueça o campo estoura o teto e falha o build", e
era falso — bastava qualquer preenchimento no mesmo passe para o build sair
verde. O passe que preenche o Vena faz as duas coisas ao mesmo tempo, com dezoito
agentes em paralelo, que é o cenário exato.

### `conditions` — a aresta que impede prescrição perigosa

O achado mais grave da auditoria: **a prescrição e a condição que a torna segura
moram em registros diferentes e não têm como se reencontrar.** "Supino 6× por
semana" foi extraído sem "nunca acima de RPE 5", que ele diz junto. Separada da
condição, a prescrição não fica incompleta — fica perigosa, porque parece
completa.

Então prescrição que tem condição declarada **precisa** apontar para ela. E
`check-claims.mjs` avisa quando uma `modo: "prescricao"` com número de volume,
intensidade ou frequência não tem `conditions` — não é erro, porque prescrição
incondicional existe, mas é o lugar certo para olhar duas vezes.

Todo id em `conditions` tem de resolver, e o checker recusa quando não resolve.
`basis` e `conflicts` tinham essa trava desde o primeiro dia; `conditions`, que
este documento chama de a aresta mais importante da base, ficou sem ela até
2026-08-09. Condição que não abre é pior do que condição ausente: o consumidor vê
que a prescrição é condicionada, não consegue ler a condição, e segue mesmo
assim — a mesma prescrição perigosa, agora com carimbo de segurança.

### `frame` — a trava que faltou nos 215 kg

Todo número carrega unidade **e frame**. Unidade diz "kg"; frame diz *kg de quê*.

| frame | significa |
|---|---|
| `1RM_treino` | máximo em treino, sem padrão de competição |
| `1RM_legal` | máximo que passaria nos comandos da IPF |
| `TM` | training max — a base dos percentuais do programa |
| `pct_TM` | percentual do training max corrente |
| `pct_1RM` | percentual de um 1RM |
| `pct_XRM` | percentual de um XRM que **não** é 1RM. Exige o param `xrm_base` com o X |
| `pct` | percentual genérico, cuja base está dita na prosa da claim |
| `RPE`, `RIR`, `kg`, `lb`, `reps`, `series` | intensidade e volume |
| `indice_estresse` | unidade do *stress index*: ~1 série dura em RPE 8–9 |
| `seg`, `min`, `horas`, `dias`, `semanas`, `meses`, `anos`, `x_semana` | duração e frequência |
| `hora_do_dia` | hora do relógio. **Não é duração** — "às 6 h" não é "6 horas" |
| `g`, `kcal`, `ml`, `l`, `xicara`, `g_por_kg`, `g_por_lb`, `IMC` | nutrição e composição |
| `cm`, `mm`, `m`, `polegadas`, `pes`, `graus`, `bpm`, `pct_FCmax`, `mmHg` | medida física (`graus` é ângulo) |
| `grau_C`, `grau_F` | temperatura |
| `contagem`, `idade`, `n_amostra`, `escala_dor`, `escala_subjetiva`, `DOTS` | contagem e escala |
| `ano_calendario` | ano do calendário: 2019, 2025. **Não é duração** — "2019" com frame `anos` se lê como dois mil e dezenove anos |
| `indice_adimensional` | índice sem unidade cujo significado mora na prosa: BRI, R². **Não é `pct`** — um R² de 0,9 lido como 0,9 % erra por duas ordens de grandeza |
| `horas_semana`, `horas_dia`, `min_semana`, `min_dia`, `lb_semana`, `MET_min_semana` | **TAXA** — algo por período. `4` com frame `horas` e `4` com frame `horas_semana` são coisas diferentes |
| `ordinal` | posição numa sequência: semana 3, bloco 2, onda 1, tentativa 2, tier 2 |
| `rotulo` | dígito que faz parte de um **nome**: 5/3/1, 5x5, Ph3, T1. Não soma, não converte. **É o único frame que admite `value` em string** |

**A lista viva é a de `research/tools/kb.mjs`, não esta**, e as decisões de
crescimento moram em `ENUMERADOS.md`. O enumerado cresceu cinco vezes, sempre
pelo mesmo motivo: um agente esbarrava numa unidade que não tinha gaveta e ou
escrevia o número por extenso, ou — pior — enfiava numa gaveta errada (`kg` para
gramas, `anos` para semanas, `horas` para hora do relógio). Faltar frame é pior
do que ter frame demais, então quando faltar, **amplie o enumerado**; não force o
número e não peça ao agente que se vire.

`ordinal` e `rotulo` existem porque a trava de "número na claim sem param" não
distingue medida de identificador, e forçou os dois erros opostos: `G019-12`
escreveu "fase um" por extenso para fugir dela, e `G019-20` declarou
`series: 5, reps: 5` para a frase "o StrongLifts 5x5 traz menos terra" — que não
prescreve série nenhuma. A trava fabricando a medida que ela existe para
proteger é o pior modo de falha possível deste esquema, e vale mais uma gaveta do
que uma medida inventada.

### `value` — número, e `string` só em `rotulo`

Decidido em 2026-08-09, no passe que moveu os params de gaveta errada. `value`
em string foge de toda aritmética do checker: da escala fechada do frame, da
comparação com o número da prosa, de qualquer soma futura. Havia onze na base.

- **Fração vira número, e a fração fica escrita no `unit`.** `"2/3"` com frame
  `pct_1RM` virou `66.7` com `unit: "% do 1RM (dois terços)"`. Nada se perde: o
  `verbatim` continua dizendo `2/3`, o `unit` repete a fração por escrito, e o
  número passa a caber na escala do frame. Foram oito (`V001-02`, `V002-19`,
  `V081-15`, `V081-26` ×2, `V087-18`, `V091-19`, `V096-05`).
- **Em `rotulo` a string é o registro CERTO, e é o único lugar.** `"5x5"` não é
  medida, e `rotulo` é exatamente a gaveta que declara isso. O checker já extrai
  os dígitos de dentro do valor textual para satisfazer a regra de procedência
  — sem isso, `G019-20`/`G020-01`/`G020-41` voltariam a declarar `series: 5,
  reps: 5` para uma frase que não prescreve série nenhuma, que é o defeito que
  `rotulo` existe para impedir. Há caso de aceitação para isso em
  `check-claims.test.mjs`.

### TAXA — a família que faltava, e a metade dela que continua aberta

`4 h/semana` estava gravado como `4` com frame `horas`, ao lado de `treino de
3 h` gravado como `3` com frame `horas`. O `/semana` morava só no `unit`, que é
texto livre; o `frame`, que é o que o consumidor lê, dizia "duração". É o bug dos
gramas em `kg` outra vez: **quando falta a gaveta do denominador, o denominador
cai fora.**

As seis gavetas acima fecham as unidades de tempo e de peso corporal. **Falta a
metade maior**, e ela está declarada aqui em vez de virar promessa em lista de
tarefas: `node research/tools/params-gaveta-errada.mjs` acha **111 params em 69
claims** com `unit` em barra e frame de magnitude pura — 68 em `series`
(*"séries/semana"*), 18 em `lb`, 16 em `contagem`, 9 em `reps`.

Eles não foram movidos de propósito, e o motivo é uma trava e não preguiça:
`series`, `reps` e `lb` estão em `FRAMES_DOSE`. Abrir `series_semana` e mover 68
params para lá **desliga em silêncio** o aviso de *"prescrição com dose e sem
`conditions`"* para todos eles — trocaria um defeito de tipagem por um buraco na
trava mais cara da base. O passe que fechar esta família tem de mexer em
`FRAMES_DOSE` no mesmo commit.

**Frame não decide relevância; `topic` decide.** Que exista `grau_F` não
autoriza extrair a temperatura do frango — autoriza que, se a claim existir, o
número não vire outra coisa. O que não deve entrar na base está no
`PROTOCOLO-EXTRACAO.md`, em "O que NÃO virar claim".

Cruzar frame exige conversor declarado. `1RM_legal` × 0,92–0,94 = `TM`, e essa
multiplicação tem que aparecer como claim `I` com `basis`, não acontecer de
fininho entre dois documentos.

## O que o checker recusa

1. `src` que não existe no manifesto, ou aponta para vídeo pós-run-1.
2. `at` além da duração do vídeo.
3. `verbatim` que não aparece na transcrição dentro da janela de `at`.
4. `tier: "R"` sem `src`/`at`/`verbatim`; `tier: "I"` sem `basis`; `tier: "L"` sem PMID/DOI.
5. Número em `claim` que não tem `param` correspondente — número sem procedência.
6. `param` sem `frame`, ou com `frame` fora do enumerado.
7. `id` duplicado, fora da forma `{LETRA}{NNN}-{seq}`, ou que não case com o arquivo.
8. `conflicts`, `basis` ou `conditions` apontando para claim inexistente.
8b. **Ciclo em `conditions`**: `A` condiciona `B` e `B` condiciona `A`.
    Limitação é assimétrica; par mútuo quer dizer que uma das duas arestas está
    invertida — quase sempre a regra geral apontada como condição do exemplo que
    ela mesma gera, que é `basis` com nome errado.
9. `scope`, `certainty` ou `modo` fora do enumerado.
10. `tier: O` com `scope` ou `modo` — norma não é nem uma coisa nem outra.
11. `pct_XRM` sem o param `xrm_base` dizendo qual XRM, ou com `xrm_base` em
    frame que não seja `reps` — o X de um XRM é número de repetições, não carga.
11b. **Valor fora da escala fechada do próprio frame** (`FRAMES_ESCALA` em
    `kb.mjs`): `RPE`/`escala_dor` fora de 0–10, `RIR` fora de 0–15, `pct_*` fora
    de 0–150. `RPE 12` não é um valor alto, é um valor que não existe — e o único
    caso da base nasceu de legenda quebrada ("2 and a half to 3 RPE" saindo do
    ASR como "2 and 12 to 3"). `suspect: true` **rebaixa para aviso**, porque
    `suspect` já declara que o número é provável defeito de ASR e que o passe de
    Whisper é o dono dele; sem essa válvula a única saída seria adivinhar o que a
    fonte disse. Os limites são frouxos de propósito — a trava é contra o
    impossível, não contra o incomum.
11c. `suspectWhy` fora de `numero`/`negacao`, `suspectWhy` sem `suspect`, ou mais
    claims com `suspect` e sem `suspectWhy` do que `TETO_SEM_SUSPECT_WHY`
    (hoje **53**, e o teto só desce). Mesma catraca do `modo`.
12. Mais claims sem `modo`, **num dado prefixo de id**, do que o teto declarado
    para aquele prefixo em `TETO_SEM_MODO`. **O mapa está vazio desde 2026-08-09**,
    então prefixo nenhum tem folga: `modo` é obrigatório para toda claim que não
    seja `tier: O`.
12b. Mais claims com `modo: prescricao` **num dado `src`** do que o teto
    declarado para aquele vídeo em `TETO_PRESCRICAO_EM_GENERO_RESTRITO`, quando o
    gênero do vídeo é `review-de-programa`, `form-check` ou `coaching-call`.
    Vídeo ausente do mapa vale zero, o teto só desce, e por `src` e não global
    pelo mesmo motivo do item 12: teto global vaza — consertar uma claim antiga
    abriria vaga para uma nova nascer errada, e a soma não se moveria. Abaixo do
    teto sai como aviso, uma linha por claim, e essa lista É a fila de revisão
    (`GENERO.md` §6). Também é erro o vídeo com claim não ter `genero` no
    manifesto, ou declarar um fora do enumerado.
13. **ESPECIFICADO, AINDA NÃO IMPLEMENTADO — entra com o retag da onda 2:**
    `modo: pratica-pessoal` com `scope: GERAL`. Rotina de terceiro é
    `avaliacao-de-terceiro` ou `relato-de-programa`; a gaveta que existe para
    dizer "cuidado, é o hábito DELE" não pode guardar hábito de qualquer um. É a
    irmã da trava 10 e do aviso de `PESSOAL` + `prescricao`, e é erro e não
    aviso porque aqui o checker **sabe** qual dos dois campos está errado: quem
    escolheu `pratica-pessoal` já afirmou que a frase é sobre ele.
    Este item está aqui, e não numa lista de tarefas, porque documento
    prometendo trava que não existe é como `suspectWhy` passou duas ingestões
    inteiras — e a diferença entre uma promessa e uma dívida é ela dizer em voz
    alta que ainda não foi paga.

E o checker **avisa** (não recusa) em:

- prescrição com dose e sem `conditions` — o lugar de olhar duas vezes;
- `scope: PESSOAL` com `modo: prescricao`, que o próprio esquema define como
  excludentes. A auditoria abriu as 13 ocorrências que existiam e 10 estavam
  erradas: o Blevins narrando a própria autorregulação gravado como ordem para o
  leitor. Aviso e não erro porque nas outras 3 quem estava errado era o `scope`,
  e o checker não tem como escolher qual dos dois campos consertar.
- `modo: prescricao` num vídeo de gênero restrito — ver a seção seguinte. É
  aviso **enquanto o teto por vídeo não for estourado**; acima do teto vira erro.

## `genero` — o campo que mora no VÍDEO, e a trava que ele liga

`modo` diz que tipo de afirmação a claim é. `genero` diz que tipo de vídeo a
produziu, e vive em `research/corpus/*/manifest.json`, um valor por vídeo. Ele
não é do registro da claim de propósito: derivar de `src` é grátis e duplicar
seria criar uma segunda verdade que envelhece — o mesmo argumento pelo qual a
claim não tem `date`.

Ele existe porque `relato-de-programa` e `avaliacao-de-terceiro` estavam
pendurados no lugar errado. O discriminador dos dois **não está no texto da
claim**: `G028-02` é *"manter a cabeça em posição mais neutra e para cima no
agachamento"*, indistinguível de prescrição geral para quem lê o JSONL, que é
exatamente o que o agente lê. O que decide é o vídeo ser um *Form Assessment
Saturday* — e isso morava no manifesto, alcançável só para o agente que
lembrasse de abri-lo. Dezoito lembraram de dezoito jeitos, e as 562 claims
nessas duas gavetas não são reproduzíveis.

O enumerado fechado vive em `kb.mjs` (`GENEROS`); o critério de cada valor, como
o campo foi semeado e o que ficou indeterminado estão em `GENERO.md`. Em resumo:
`aula`, `review-de-programa`, `form-check`, `coaching-call`, `log-de-treino`,
`competicao`, `perguntas`, `institucional`, `clipe`, `indeterminado`.

**Três deles restringem `prescricao`** (`GENEROS_SEM_PRESCRICAO`):
`review-de-programa`, `form-check` e `coaching-call` — os vídeos em que o
material é de outra pessoa, ou calibrado para uma pessoa específica. Uma
`modo: prescricao` vinda de lá conta contra `TETO_PRESCRICAO_EM_GENERO_RESTRITO`
no `check-claims.mjs`: teto **por `src`**, vídeo ausente vale zero, e o teto só
desce. Hoje são **76 violações em 19 vídeos**, listadas uma a uma em `GENERO.md`
§6, e a trava mede em vez de reprovar porque a rodada que a ligou não podia
editar claim — não porque 76 seja aceitável.

`verify-manifest.mjs` exige `genero` em todo vídeo e recusa valor fora do
enumerado. Sem isso a trava acima se desligaria em silêncio no dia em que alguém
reconstruísse um manifesto, que é o pior desfecho possível para uma trava —
`build-manifest.mjs` carrega o campo adiante por `videoId` pela mesma razão.

Exigir presença e enumerado não basta, porque sobra o caminho mais fácil:
**trocar o valor por outro válido**. `G020.genero = 'aula'` é legítimo em ambas as
checagens, e as sete violações dele evaporam com o build verde. Por isso
`verify-manifest.mjs` também congela um roster dos 39 vídeos que hoje declaram
gênero restrito (`GENERO_TRAVADO`) e recusa o rebaixamento de qualquer um deles,
ou o sumiço do ref. A checagem é de mão única: ganhar gênero restrito é o lado
seguro e não passa por registro.

`verify-manifest.test.mjs` prova que tudo isso ainda é executado: 14 casos com
mensagem obrigatória, entre eles `genero` ausente nas duas fontes, `genero:
"vlog"`, o rebaixamento de `G020` e de `R047`, e dois casos de aceitação que
impedem a checagem de virar bidirecional. Sem esse teste, "o verificador exige
gênero" era uma afirmação sobre código que ninguém tinha rodado.

Quem ESCREVE o campo é `seed-genero.mjs`, e ele tem teste próprio
(`seed-genero.test.mjs`, no `check:kb`) porque a primeira versão não gravava: o
laço copiava o `genero` velho por cima do recém-derivado, de modo que
`--refresh` era um no-op e o conserto que o verificador manda fazer num manifesto
reconstruído (onde o campo vem `null`) não fazia nada — relatando que tinha
feito. O caso central do teste zera os 551 gêneros e exige que a semeadura
devolva exatamente os valores commitados, o que prova gravação e
reprodutibilidade de uma vez.

## Granularidade

Uma claim é uma afirmação verificável contra um trecho. Não é um parágrafo, não é
um tópico, não é "o que ele acha de agachamento".

- ❌ "Ele prefere low bar e acha que a maioria agacha ereto demais e recomenda mais inclinação."
- ✅ três claims, cada uma com seu `at` e seu `verbatim`.

O teste: se você não consegue apontar os segundos onde aquilo é dito, não é uma
claim — é uma síntese, e síntese mora em `synth/` com `basis`.
