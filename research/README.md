# Camada de pesquisa

A base de conhecimento que sustenta o Bloco 1 **morava em `/private/tmp` e foi apagada
pela limpeza do sistema em 9 de agosto de 2026, ~08:46**. Este diretório existe para que
isso não se repita: o que sobreviveu está aqui, versionado no git, e não em disco temporário.

O programa em si nunca esteve em risco — `src/data/program/vena-block1/source/PROGRAMA.md`,
`CONTEXTO.md` e o `generated.ts` estão commitados desde o começo. O que se perdeu foi a
camada de pesquisa que os produziu.

## O que está aqui

### Íntegro, recuperado dos snapshots de edição do harness

| Arquivo | O que é |
|---|---|
| `design.md` | **O contrato do bloco.** 669 linhas. Cada decisão fixa, com a procedência. É o documento do qual o `PROGRAMA.md` é a expansão mecânica. |
| `baseline.md` | **A conversão das marcas declaradas para o padrão de competição.** 162 linhas. A cadeia 250/170/268 → 215/160/240, fator a fator. |
| `verification.md` | **A arquitetura anti-alucinação.** 99 linhas. As quatro camadas de verificação e o princípio "onde um compilador pode verificar, agente não deve". |

### Parcial, extraído do transcript da sessão (`recuperado/`)

Não são os arquivos originais — são relatórios de agente que os leram e citaram
literalmente. Preservam as conclusões e boa parte das citações, não o texto integral.

| Arquivo | Cobre |
|---|---|
| `kb-sintese.md` | As ~16 regras de decisão com `[Rxxx]`, as contradições C1–C25 (internas, contra elites, contra literatura) e as lacunas G1–G35. É o substituto mais próximo de `DECISION_RULES.md` + `CONTRADICTIONS.md` + `GAPS.md`. |
| `programa-estrutura.md` | O esqueleto completo das 18 semanas: 5 templates de dia, grades de rampa, o gate da S3/S4, as 43 invariantes. |
| `baseline-derivacao.md` | A derivação da linha de base com trechos literais, incluindo as três inconsistências encontradas na auditoria. |
| `params_bracos_ombros.md` | Praticamente completo — os parâmetros de braço e ombro. |
| `terra-sumo-vs-convencional.md`, `pino-box-o-que-a-base-diz.md` | Recortes temáticos. |
| `_transcript-blocos-grandes.md` | Bruto: todos os 55 blocos > 3 mil caracteres do transcript, sem curadoria. Consultar quando faltar algo específico. |

## O que se perdeu de vez

Nada disso tem cópia — SSD com APFS e TRIM não permite recuperação por setor, não havia
Time Machine configurada e não havia snapshot local.

- `corpus/` — **178 transcrições completas** dos vídeos do canal (~15 h de vídeo).
- `extract/lote_01..18` — as **3.154 claims atômicas** com `[Rxxx]` e timestamp (~136 mil palavras).
- `synth/` — 13 sínteses temáticas (~84 mil palavras).
- `kb/raw/` — roster de 12 elites da IPF (~105 mil palavras), 6 frameworks de coach, e
  `evidence.md` com 52 PMIDs verificados.
- `kb/INDEX.md`, e o texto integral de `DECISION_RULES.md`, `CONTRADICTIONS.md`, `GAPS.md`.
- `prog/` — `SPEC_REV2.md`, `params_vena_fase2.md`, `params_tecnica.md`, `params_elites.md`,
  as auditorias de citação e as quatro revisões adversariais.

Total aproximado: **564 mil palavras**.

## Por que a perda é menor do que o número sugere

O `PROGRAMA.md` carrega **7.741 citações** no formato `[Rxxx @mm:ss]`, distribuídas nos
614 blocos de prescrição. Cada instrução do programa aponta para o vídeo e o segundo de
onde veio. **A base foi apagada, mas o índice para ela sobreviveu dentro do próprio programa.**

E o corpus é regenerável: os 178 vídeos continuam no YouTube, o pipeline era `yt-dlp` +
Whisper, e a numeração `[Rxxx]` segue ordem de recência do canal (`lote_01` = R1–R5, os
mais recentes). Refazer é caro em tempo de máquina, não em decisão — e as decisões, que
são a parte que não se refaz, estão em `design.md`.

## Regra que passa a valer

Nada de pesquisa vai para o scratchpad de sessão. Artefato que custa caro para produzir
nasce em `research/` e é commitado no mesmo dia.
