# Auditoria da onda 2C — resgatada de `/tmp/aud`

Estes 24 scripts foram escritos pelo atacante cego da **onda 2C** (10/08/2026) e viveram em
`/tmp/aud` até serem trazidos para cá. Os achados daquela onda citam comandos como
`node /tmp/aud/medir.mjs` — **esses caminhos estão mortos**. O equivalente vivo é
`node research/tools/auditoria-onda2c/medir.mjs`.

Foram resgatados porque nesta casa já se perdeu base inteira em pasta temporária, e porque um
achado sem comando que o reproduza vira boato em duas semanas.

## O que cada um reproduz

| script | o achado |
|---|---|
| `medir.mjs` | o número da onda: 0 de 12 cegos devolvem qualquer id esperado |
| `cegos.mjs`, `cegos2.mjs` | os 12 canários cegos C## rodados um a um |
| `dcs.mjs` | mutação do vocabulário de UMA gaveta para lixo (`descanso-entre-series`) |
| `sweep.mjs`, `sweep2.mjs` | a varredura das 74 gavetas: 26 ficavam verdes com a entrada trocada por lixo |
| `mutar.mjs`, `casos.mjs` | as 56 mutações de constante; 5 sobreviviam, todas afrouxando |
| `vagas.mjs` | o mecanismo do soterramento: gaveta(tamanho):vagas por caso |
| `paraf.mjs` | paráfrase — só 2 das 8 públicas que passavam sobreviviam |
| `overfit.mjs` | a distância entre o conjunto público e o cego |
| `precisao.mjs`, `estreitas.mjs` | 32 de 33 perguntas devolviam exatamente 40 claims |
| `aviso.mjs` | o painel "gavetas que pontuaram e não abriram" nomeava gaveta útil em 2 de 12 |
| `tela.mjs`, `semteto.mjs` | as DUAS definições de tela (40 do gate contra 68 do CLI) |
| `ancora.mjs`, `glosmut.mjs` | ancoragem dos termos de entrada no texto das claims |
| `e2e.mjs`, `rotas.mjs`, `pub.mjs`, `est.mjs`, `gera.mjs`, `parse.mjs`, `run.mjs` | apoio |

## Aviso

São scripts de auditoria de UM momento da base. Eles leem caminhos e constantes que a onda
seguinte pode ter mudado — se um deles quebrar, isso é informação, não defeito: quer dizer que
a camada mudou de forma desde a medição que ele fez. **Não os conserte para ficarem verdes.**
