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
  "date": "2021-05-04",    // data de publicação. É o que torna "o recente vence"
                           // uma regra executável em vez de julgamento de agente.

  "tier": "R",             // procedência. Enumerado FECHADO — ver abaixo.
  "scope": "GERAL",        // GERAL = ele prescreve para os outros
                           // PESSOAL = ele descreve o que faz
                           // A run 1 misturou os dois e virou prescrição.
  "certainty": "explicit", // explicit = ele diz. implied = você inferiu do que ele diz.

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

**`I` nunca vira `R`.** Foi exatamente essa lavagem que produziu o fator de
profundidade. O checker recusa uma claim `I` sem `basis`, e recusa uma claim `R`
cujo `verbatim` não aparece na transcrição.

### `frame` — a trava que faltou nos 215 kg

Todo número carrega unidade **e frame**. Unidade diz "kg"; frame diz *kg de quê*.

| frame | significa |
|---|---|
| `1RM_treino` | máximo em treino, sem padrão de competição |
| `1RM_legal` | máximo que passaria nos comandos da IPF |
| `TM` | training max — a base dos percentuais do programa |
| `pct_TM` | percentual do training max corrente |
| `pct_1RM` | percentual de um 1RM |
| `RPE`, `RIR`, `kg`, `reps`, `series`, `min`, `seg`, `cm`, `pct` | literais |

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
