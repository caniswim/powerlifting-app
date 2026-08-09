# Fontes brutas — o material de trabalho que estava fora do repositório

Isto é o diretório de rascunho de várias sessões de pesquisa, promovido para dentro
do repositório em 2026-08-09. Não é curado e não é bonito: são os PDFs oficiais que
foram lidos, os CSVs que saíram deles, os scripts que fizeram as contas, e os
resultados intermediários.

Ele existe por um motivo específico. O `MEMORY.md` deste projeto registra que **a
base inteira já foi perdida uma vez por morar em `/tmp`**, e a regra que saiu dali é
que artefato caro nasce em `research/` e é commitado no mesmo dia. Este material
tinha voltado a violar a regra — 2,6 GB de trabalho fora do git.

## O que está aqui

| o quê | onde | por que importa |
|---|---|---|
| Relatórios anuais da ABCD | `abcd*.pdf` + `.txt` | a evidência de que o antidoping doméstico é praticamente inexistente (7 amostras de powerlifting no Brasil em 3 anos). Publicação de governo, e governo reorganiza site. |
| Regulamentos de federação | `rb2026.pdf`, `ipl.pdf`, `trb.pdf`, `lr.pdf`, `w24.pdf` + `.txt` | regra de competição, que é o único tier onde discordar não é opção |
| Resultados de meets | `m*.csv`, `napf_*.csv`, `fesupo_*.csv` | o campo real contra o qual o atleta compete |
| `ipf_intl_men.csv` | derivado do dump | recorte internacional já filtrado |
| Scripts de análise | `*.mjs`, `*.py`, `gen/` | **a parte mais valiosa.** O número sem o script que o produziu é opinião com casas decimais. |
| `G0*.jsonl`, `backup-pre-id/` | claims do Blevins | cópias de trabalho anteriores à normalização de id; procedência do que hoje está em `research/extract/` |

## O que ficou de fora, e como trazer de volta

Excluído porque é grande **e** mecanicamente regenerável — não porque é
descartável. Se algum número deste repositório depender dele, o script que o
consome está aqui.

| o quê | tamanho | como refazer |
|---|---|---|
| `opl/`, `openpowerlifting-2026-08-08/`, `opl.zip` | ~1,7 GB | dump aberto do OpenPowerlifting: <https://openpowerlifting.gitlab.io/opl-csv/files/openpowerlifting-latest.zip> |
| `openipf-2026-08-08/`, `openipf.zip` | ~390 MB | o mesmo dump já filtrado para a IPF: <https://openpowerlifting.gitlab.io/opl-csv/files/openipf-latest.zip> |
| `ipf_raw_men.csv` | 38 MB | recorte do dump acima, feito pelos scripts deste diretório |
| `wenv/` | ~500 MB | virtualenv de Python do Whisper. `python3 -m venv wenv && pip install faster-whisper` |

O dump é datado de **2026-08-08**. Refazer o download hoje traz dados mais novos e
**os números não vão bater exatamente** — se você for reproduzir uma conta, use a
data como parte da citação.

## Restrições que valem para este material

- **`goodlift.info` proíbe extração e desautoriza o ClaudeBot por nome.** Nada aqui
  veio de lá por crawl, e nada deve vir. Dado de competição sai do dump aberto.
- **Stronger by Science** declara `ai-train=no` e desautoriza o ClaudeBot no
  `robots.txt`. Entra como referência por URL, nunca por ingestão.

## O que este diretório NÃO é

Não é fonte de verdade de nada. A base é `research/extract/*.jsonl`, verificada por
`research/tools/check-claims.mjs`. Isto aqui é o andaime: serve para auditar de onde
um número veio, e para não refazer trabalho caro. Nenhum arquivo daqui deve ser
citado como se fosse claim.
