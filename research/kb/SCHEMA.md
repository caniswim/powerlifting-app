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
  "id": "V014-03",         // V{ref}-{seq}. Estável e imutável, e carrega a
                           // procedência à vista. Colisão é impossível por
                           // construção, mesmo com 20 agentes em paralelo.
                           // Nunca renumerar: contradições e sínteses apontam pra cá.
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

  "conflicts": ["V0088"]   // opcional. Vira aresta no ledger de contradições.
}
```

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
| `prescricao` | ele diz para fazer. **É o único que pode virar programa.** |
| `opiniao` | ele acha, sem prescrever |
| `mecanismo` | por que funciona — fisiologia, alavanca, causa alegada |
| `fato` | afirmação sobre o mundo, verificável fora dele |
| `estudo` | ele narra literatura. Não vira `tier: L` — continua sendo ele contando. |
| `anedota` | história dele ou de terceiro |
| `narrativa` | o que aconteceu no treino, sem tese |

`scope` diz **para quem**; `modo` diz **que tipo de coisa**. São perguntas
diferentes e precisam de campos diferentes.

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

### `frame` — a trava que faltou nos 215 kg

Todo número carrega unidade **e frame**. Unidade diz "kg"; frame diz *kg de quê*.

| frame | significa |
|---|---|
| `1RM_treino` | máximo em treino, sem padrão de competição |
| `1RM_legal` | máximo que passaria nos comandos da IPF |
| `TM` | training max — a base dos percentuais do programa |
| `pct_TM` | percentual do training max corrente |
| `pct_1RM` | percentual de um 1RM |
| `RPE`, `RIR`, `kg`, `lb`, `reps`, `series`, `pct` | intensidade e volume |
| `seg`, `min`, `horas`, `dias`, `semanas`, `meses`, `anos`, `x_semana` | tempo e frequência |
| `g`, `kcal`, `ml`, `g_por_kg`, `g_por_lb`, `IMC` | nutrição e composição |
| `cm`, `polegadas`, `graus`, `bpm`, `pct_FCmax`, `mmHg` | medida física |
| `contagem`, `idade`, `n_amostra`, `escala_dor`, `DOTS` | contagem e escala |

**A lista viva é a do `check-claims.mjs`, não esta.** O enumerado cresceu quatro
vezes durante a extração, sempre pelo mesmo motivo: um agente esbarrava numa
unidade que não tinha gaveta e ou escrevia o número por extenso, ou — pior —
enfiava numa gaveta errada (`kg` para gramas, `anos` para semanas). Faltar frame
é pior do que ter frame demais, então quando faltar, **amplie o enumerado**; não
force o número e não peça ao agente que se vire.

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
7. `id` duplicado, ou `conflicts` apontando para claim inexistente.
8. `scope` ou `certainty` fora do enumerado.

## Granularidade

Uma claim é uma afirmação verificável contra um trecho. Não é um parágrafo, não é
um tópico, não é "o que ele acha de agachamento".

- ❌ "Ele prefere low bar e acha que a maioria agacha ereto demais e recomenda mais inclinação."
- ✅ três claims, cada uma com seu `at` e seu `verbatim`.

O teste: se você não consegue apontar os segundos onde aquilo é dito, não é uma
claim — é uma síntese, e síntese mora em `synth/` com `basis`.
