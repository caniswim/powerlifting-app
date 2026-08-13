# RUNBOOK da camada de pesquisa

Este arquivo existe porque em **9 de agosto de 2026, ~08:46**, a base de conhecimento
inteira deste projeto (~564 mil palavras) foi apagada: ela morava em `/private/tmp`, a
limpeza do sistema passou, e SSD com APFS + TRIM não devolve setor. Não havia Time
Machine, não havia snapshot. O que salvou o projeto foi o `PROGRAMA.md` estar no git com
**7.741 citações `[Rxxx @mm:ss]`** dentro — o índice sobreviveu dentro do produto.
`research/README.md` conta essa história inteira.

O risco agora é outro. Os arquivos estão no git; o que ainda mora só numa sessão de
conversa é **o conhecimento de como o sistema funciona**. Este RUNBOOK é a transferência
disso. Ele não repete o porquê das decisões — isso está nos comentários de cabeçalho de
cada arquivo em `research/tools/`, e eles são de leitura obrigatória antes de mexer em
qualquer um deles. Aqui está a operação: o que é cada coisa, em que ordem se roda, o que
quebra, e o que nunca se faz.

Antes de tocar em qualquer coisa, leia — na íntegra, não por diagonal:
`research/README.md`, `research/kb/SCHEMA.md`, `research/kb/PROTOCOLO-EXTRACAO.md`,
`research/verification.md`.

---

## 1. O mapa

### Fonte de verdade — só isto se edita à mão

| Caminho | O que é |
|---|---|
| `research/design.md` | **O contrato do bloco.** Cada decisão fixa, com procedência. O `PROGRAMA.md` é a expansão mecânica dele. |
| `research/baseline.md` | A conversão 250/170/268 declarado → 215/160/240 legal, fator a fator. |
| `research/verification.md` | A arquitetura anti-alucinação. O princípio *onde um compilador pode verificar, agente não deve*. |
| `research/kb/SCHEMA.md` | O registro tipado da claim. Enumerados, tiers, frames. |
| `research/kb/PROTOCOLO-EXTRACAO.md` | A instrução única do agente extrator. Vocabulário de tópicos fechado. |
| `research/kb/ENUMERADOS.md` | Por que cada gaveta de `frame`, `topic` e `modo` existe — **e por que as recusadas não existem**. Leia antes de propor ampliar qualquer enumerado. |
| `research/kb/FRONTEIRA-MODO.md` | A fronteira `pratica-pessoal` × `narrativa` × `fato`, a fusão de `anedota`, e o tamanho do retag que isso deixa para a onda 2. A regra em si mora no `PROTOCOLO-EXTRACAO.md`; aqui está o porquê e a lista. |
| `research/kb/GENERO.md` | O `genero` do **vídeo** (dez valores, no manifesto), o critério de cada um, como o campo foi semeado sem reabrir vídeo, e a lista das **74** claims que a trava dele acusa hoje (eram 76; a fila foi aberta uma a uma em 9/8 e 2 mudaram). É o conserto determinístico de `relato-de-programa` / `avaliacao-de-terceiro`. |
| `research/tools/kb.mjs` | Os enumerados fechados em código, importados por todo checker. A lista viva de `frame`, `modo` e `genero`. |
| `research/kb/INSTRUMENTO.md` | Como a base é **medida**: o que é prova mecânica, o que é julgamento, e como se roda a medição de novo. |
| `research/kb/CANARIOS.json` | Os canários da medição, com o predicado que prova cada um. **Não mostrar a quem responde.** Quatro famílias desde 9/8: `presente`, `presente-escondido`, `impossivel`, `armadilha`. |
| `research/kb/VOCABULARIO.md` | **O índice de vocabulário por tópico** — o que o canal de fato diz, o que ele NÃO diz, e por que a busca ingênua falha em cada assunto. Escrito à mão, derivado do corpus, e **executável**: `busca.mjs` expande consultas com ele e `check-vocabulario.mjs` recusa termo morto. |
| `research/kb/RECUPERACAO.md` | **A camada de recuperação**: o conserto do modo de falha da MEDICAO-02 (declarar ausente o que existe), a prova contra os quatro casos medidos, e o que continua inalcançável. |
| `research/tools/busca.mjs` | A busca: raiz, número como ponte bilíngue, vizinhança ancorada em sementes, vizinho de arquivo, e o diagnóstico de filtro. Importado por `check-evidence.mjs` e por `check-canarios.mjs` — **uma implementação só**, senão o canário mediria a si mesmo. |
| `research/kb/ESTADO.md` | **Onde a base está, hoje, e com que instrumento cada número foi obtido.** É o primeiro arquivo a ler depois deste. Diz o que foi provado por compilador, o que virou comando sem virar trava, e o que continua sendo julgamento de agente. |
| `research/kb/ONDA-2B.md` | **A FILA DE TRABALHO DE HOJE.** O que sobrou depois do ataque à onda 2A, na ordem, cada item com *quantos* / *onde* / *como se verifica* / *fan-out*: as três travas mortas da camada de recuperação, o canário de precisão que falta, C20, os quatro buracos do cluster de dor, a triagem de banalidade (**com portão de calibração — abaixo de ~85 % de concordância o campo não se constrói**), os fatos do atleta em `tier U`, o Whisper, TAXA, a reconciliação documental, e o ledger/sínteses **por último**. |
| `research/kb/ONDA-2.md` | A fila **anterior**. Ainda vale como registro do porquê de cada item, **mas os critérios de aceite dele estão desatualizados e contradizem o `ESTADO.md`** — ver §8.33. Leia o `ONDA-2B.md`. |
| `research/kb/CANARIOS-CANDIDATOS.json` | **Canários que ainda não passam, fora do `check:kb` de propósito.** Hoje: C20 (descanso entre séries), um `presente-escondido` de um caso que a onda 2A não usou — e ele **falha**, que é a medida honesta do alcance da camada. Roda com `check-canarios.mjs --canarios`. Só migra para o `CANARIOS.json` no dia em que ficar verde: canário vermelho de nascença dentro do build é como se desliga uma trava. |
| `research/kb/GATE-DOR.md` | O gate de dor do §1.2 do `PROGRAMA.md`: como a tabela vira comportamento do app, o que a trava cobre e o que ela **não** cobre. |
| `research/kb/DOR-E-TREINO.md` | O cluster que autoriza treinar com dor: o que as claims dizem mesmo (reabilitação programada, nunca dor aguda dentro da série), as `conditions` e os `conflicts` que passaram a ligá-las ao freio, e as duas coisas que a base **não** tem e que não viraram claim. Lado da base do gate do §1.2; o lado do app está em `GATE-DOR.md`. |
| `research/kb/PEITO-PARECER.md` | **Escrito PARA O ATLETA LER**, 12/8/2026, motivado por dor leve presente em repouso no lado da ruptura de peitoral. O que fazer na semana (com a versão de cada faixa do bloco, porque a semana dele não é determinável deste repositório), **por que o recuo do gate não tira carga do peitoral**, o que a base manda com id/`modo`/`scope`, o que a base **não** sabe sobre um natural de 87 kg lendo um canal de um atleta de 120 kg, e o critério concreto de quando isto vira conversa com fisioterapeuta. Contém as duas propostas **não implementadas**: a das 22 séries (§8.1, decisão dele) e a do campo de dor em repouso (§8.2, diff completo). Absorveu `research/kb/peito-parcial/`, que foi apagado no mesmo passe para não haver duas cópias divergindo em silêncio. |
| `research/kb/DEFEITOS-PONTUAIS.md` | Os seis defeitos nomeados de 9/8 e o conserto de cada um, inclusive o `CONFIRMADO` falso do `verify-suspects.mjs`. |
| `research/kb/*.md` (ROSTER-CURADO, IPF-REALIDADE, PADROES-EXTERNOS, FONTES-ADICIONAIS) | Pesquisa curada, escrita à mão, com procedência linha a linha. |
| `research/kb/PREDICOES-BLOCO1.md` | **O registro pré-comprometido do bloco 1.** 22 previsões falseáveis com prazo e com a claim que morre em cada desfecho. Só admite **anotação** a partir de 10/08/2026 — editar uma previsão é apagar a medição. Era `research/predicoes.md`, órfão; a procedência e a auditoria estão no cabeçalho dele. |
| `research/tools/*.mjs`, `whisper-window.py` | O pipeline. |
| `research/tools/params-gaveta-errada.mjs` | **Detector, não verificador, e fora do `check:kb` de propósito.** Enumera os params cujo número está tipado na gaveta errada — **111 hoje, todos da família TAXA**, depois de a regra estreita ter sido alargada em 9/8 (ela reportava 19). Existe porque essa lista era copiada à mão dentro do `ESTADO.md` §3 e o número derivado dela estava errado. Some quando cada regra virar recusa do `check-claims.mjs` — ver §8.19. |
| `research/corpus/ipf/rulebook-2026.md` | O regulamento IPF 2026 em markdown citável — é contra ele que o checker confere todo `tier: O`. |

### Derivado — regenerável, e por isso descartável

| Caminho | Quem gera | Custo de refazer |
|---|---|---|
| `research/corpus/manifest.json` | `build-manifest.mjs` + `seed-genero.mjs` | ~15 min (rede). **O `genero` não é derivável do canal** — ver a exceção declarada abaixo. |
| `research/corpus/dates.json` | `fetch-dates.mjs` | ~12 min (rede) |
| `research/corpus/transcripts/*.md` | `fetch-captions.mjs` | ~15 min para 197 |
| `research/corpus/captions/*.json3.gz` | `fetch-captions.mjs` | idem (é o bruto guardado) |
| `research/kb/suspeitos-whisper.json` | `verify-suspects.mjs` | horas (áudio + Whisper) |

### NUNCA se edita à mão

- **`research/corpus/manifest.json`** — é derivado da ordem do canal e amarra `[Rxxx]` a
  `videoId`. Editar à mão é a forma mais rápida de deslocar a base inteira em silêncio.
  Se precisar mudar, mude `build-manifest.mjs`/`sources.mjs` e regenere. E rode
  `verify-manifest.mjs` **depois**, sempre.
  **Uma exceção, declarada:** o campo `genero` **não** é derivável do canal — ele sai da
  `TRIAGEM.md` e da leitura dos títulos, e uma trava de claim depende dele. Quem o
  escreve é `seed-genero.mjs`, e a decisão de um vídeo específico se corrige lá (no
  `OVERRIDES`, com o motivo por escrito) e não no JSON, senão a correção morre no
  próximo `--refresh`. `build-manifest.mjs` carrega o campo adiante por `videoId` numa
  reconstrução, e `verify-manifest.mjs` recusa manifesto com vídeo sem gênero — o que
  `verify-manifest.test.mjs` prova encenando um manifesto sem o campo, porque a trava
  que depende dele não falha quando o campo some: ela se desliga em silêncio.
- **`research/corpus/transcripts/*.md`** — é a evidência contra a qual o checker confere
  verbatim. "Consertar" o ASR aqui faz uma claim errada passar a validar.
- **`research/corpus/captions/*.json3.gz`** — bruto do YouTube, existe para não depender
  do YouTube de novo.
- **`research/extract/*.jsonl` que não é seu** — um arquivo por vídeo, um dono por vez.
- **`research/recuperado/*`** — são relatórios de agente resgatados do transcript da
  sessão perdida. São *achado arqueológico*: valem como procedência (as seis âncoras de
  `verify-manifest.mjs` saem daí) exatamente porque não foram tocados.

### Ainda não existe, apesar de documentado

`research/kb/topics/*.md` (as visões temáticas geradas que o `SCHEMA.md` descreve) e
`research/synth/` (as sínteses com `basis`) estão **vazios**, e não há gerador. Ver §8.9.

---

## 2. Rodar o pipeline do zero

Ordem obrigatória. Cada passo depende do anterior existir e estar verificado.

```bash
# 0. dependências: node, yt-dlp, ffmpeg. Whisper só no passo 5.
cd /Users/brunnovert/Documents/Dev/powerlifting-app

# 1. MANIFESTO — a ponte [Rxxx] ↔ vídeo. ~15 min (1 chamada de rede por vídeo, conc. 3)
node research/tools/build-manifest.mjs --refresh
#    sem --refresh ele se recusa a sobrescrever, de propósito.
#    --skip-dates corta para ~20 s, mas aí falta a data e "o recente vence" deixa
#    de ser regra executável.

# 2. VERIFICAR O MANIFESTO — obrigatório, sempre, imediatamente. <1 s
node research/tools/verify-manifest.mjs [--source blevins]
#    Se isto falhar, PARE. Não siga para transcrição. Ver §3.
#    Fonte sem citação prévia não tem âncora: a saída diz, em voz alta, que o
#    deslocamento NÃO foi verificado — só a integridade do manifesto foi.

# 3. LEGENDAS → transcrição citável. ~15 min para 197 vídeos (conc. 4)
node research/tools/fetch-captions.mjs
#    Resumível: pula o que já tem `transcript` no manifesto. --force refaz.
#    --only R159 para um vídeo só.

# 4. EXTRAÇÃO — agentes lendo transcrição e emitindo claims JSONL.
#    ~15–20 min por lote de 10 vídeos. Teto de 20 subagentes simultâneos (§6).
#    O agente recebe PROTOCOLO-EXTRACAO.md + SCHEMA.md e roda, no próprio loop:
node research/tools/check-claims.mjs --only R014

# 5. CHECAGEM COMPLETA. <1 s cada.
node research/tools/seed-genero.test.mjs    # a semeadura de `genero` grava mesmo? (11 casos, 2 ponta a ponta)
node research/tools/verify-manifest.test.mjs # o verificador ainda exige `genero` e recusa rebaixamento? (14 casos)
node research/tools/check-claims.test.mjs   # o checker ainda pega o que promete? (34 recusas + 2 avisos + 3 aceitações)
node research/tools/check-claims.mjs        # 6.909 claims em ~0,3 s
node research/tools/check-answer.test.mjs   # 34 casos
node research/tools/busca.test.mjs          # a camada de recuperação faz o que promete? (33 casos)
node research/tools/check-canarios.test.mjs # 41 casos
node research/tools/check-vocabulario.mjs   # todo termo do VOCABULARIO.md ainda acha (e todo "não usa" ainda não)
node research/tools/check-canarios.mjs      # os canários ainda calibram? (ver INSTRUMENTO.md)
npm run check:kb                            # todos, encadeados — e está dentro do npm run build

# 5b. MEDIR UMA RESPOSTA — o outro lado do compilador. Ver research/kb/INSTRUMENTO.md.
node research/tools/check-answer.mjs --resposta r.md --pergunta "o enunciado"
#    Acusa todo número da resposta que não aparece em nada que ela cita.
#    Rode SEMPRE ao ingerir fonte nova: `check-canarios.mjs` é o passo que teria
#    pego o canário do Blevins virando respondível horas depois de escrito.

# 6. REPARO CIRÚRGICO COM WHISPER — opcional, caro, e o último passo.
node research/tools/list-suspects.mjs              # o que vale escutar
node research/tools/verify-suspects.mjs --only R002 # baixa áudio, corta janela, transcreve
#    Carregar o large-v3-turbo custa ~2 min; por isso todas as janelas vão num load só.
#    A saída é EVIDÊNCIA, não veredito: só `CONFIRMADO` é automático.
```

Fonte nova (Blevins) usa os mesmos passos 1 e 3 com `--source blevins`. O passo 2 **também
aceita** (`verify-manifest.mjs --source blevins`, e o `check:kb` roda as duas fontes). O
passo 5 **não precisa e não deve**: `check-claims.mjs` resolve `src` contra a **união** dos
manifestos, e o prefixo do ref já diz de qual corpus a claim vem — exigir o campo redundante
seria criar um segundo lugar para divergir. Ver §8.2.

> Este parágrafo dizia, até 9/8/2026, que "os passos 2 e 5 ainda não aceitam `--source`".
> Era falso nos dois: o passo 2 aceita desde o conserto do §8.2, e o passo 5 nunca aceitou
> por desenho. **Defeito nº 3 desta casa, dentro do arquivo que o cataloga.** Ver §8.25.

---

## 3. As invariantes, e o defeito que cada uma previne

### A numeração `[Rxxx]` não é "ordem do canal hoje"

A run 1 numerou com 196 vídeos no canal. Desde então entrou 1. Numerar por recência hoje
deslocaria tudo em 1 e faria **cada uma das 7.741 citações apontar para o vizinho** — o
pior tipo de erro, porque continua parecendo certo. Por isso: índice 1 = `R000`,
pós-run-1, fora da numeração citável; índices 2..197 = `R001..R196`.

Isso não é suposição. `verify-manifest.mjs` prova duas coisas a cada execução:

1. **Seis âncoras semânticas** colhidas de `research/recuperado/` — R1 (3 anos de lesão),
   R4 (400 kg squat), R102 (never deload), R113 (tier list), R159 (squat upright), R168
   (best squat accessory). Cada uma casa um número com um título que só aquele vídeo tem.
2. **Unicidade do offset**: os 258 pares (R, timestamp) do `PROGRAMA.md` são testados
   contra os offsets vizinhos. Medição atual: **0 violações no offset adotado, contra
   52/42/47/50 em −2/−1/+1/+2**. Não é "plausível", é *determinado pelos dados*.

Se as âncoras quebrarem, o canal publicou vídeo novo. A correção é ajustar `postRun1` em
`research/tools/sources.mjs` — não renumerar citação, nunca.

### Todo número carrega `frame`, não só `unit`

Na run 1 o `baseline.md` rotulou 215/160/240 como **1RM legal estimado** e o `design.md`
consumiu os mesmos números como **training max** — que é ~92–94% de um 1RM. Dois
documentos, duas semânticas, nenhum alarme, e uma auditoria de citações marcada como
concluída passou por cima. Unidade diz "kg"; frame diz *kg de quê*. `check-claims.mjs`
recusa `param` sem `frame` e `frame` fora do enumerado. Cruzar frame exige conversor
declarado como claim `I` com `basis` — não pode acontecer de fininho entre dois arquivos.

**Quando faltar gaveta, amplie o enumerado.** O enumerado já cresceu quatro vezes por
esse motivo. Faltar frame é pior do que ter frame demais.

### `tier: I` nunca vira `tier: R`

O fator de profundidade do agachamento (−12 a −18%) **não tinha fonte no corpus**. O do
supino tinha (R83/R4), o do terra tinha (R174). Era interpretação circulando com
autoridade de citação, e chegou ao programa. Agora: `R` exige `src` + `at` + `verbatim`
+ `scope`, e o verbatim tem que existir na transcrição dentro de 45 s do `at` declarado;
`I` exige `basis` com os ids que a sustentam; `L` exige PMID ou DOI; `O` exige
`source.{document,version,url,effective}` e `at` no formato `§4.1.3`; `E` exige
`source.name` + `source.url` navegável; `U` exige `source.date` em ISO (é o que torna
"o recente vence" computável para o que você diz, já que não há manifesto para consultar).

### O checker tem teste próprio

`check-claims.mjs` carimba 5 mil claims com "toda citação resolve, todo verbatim existe,
todo número tem frame". **Checker silenciosamente quebrado é pior que checker nenhum**:
sem checker você desconfia; com um quebrado você para de desconfiar. O modo de falha é
banal — alguém "melhora" a normalização até ela apagar caracteres demais, qualquer string
vira prefixo de qualquer outra, e o `✓` continua verde.

`check-claims.test.mjs` monta um extract sintético a partir de uma claim **real já
aprovada**, muta-a de formas específicas, e exige que o checker recuse cada uma **pela
mensagem certa** (aceitar qualquer erro seria satisfeito por um typo no próprio teste).
Estado atual: **34 recusas + 2 sinalizações + 3 aceitações**. As três aceitações não são decoração: um
checker fica trivialmente "correto" recusando tudo, e foi recusando demais que uma trava
já inventou uma dose. Se você adicionar uma regra ao checker, adicione o caso aqui — senão
a regra não tem garantia nenhuma.

### O que verifica a resposta, e não só a base

`check-claims.mjs` prova que a BASE é fiel à fonte. Ele não olha para o que um agente
responde usando a base. `check-answer.mjs` é o outro lado: resolve os ids que a resposta
cita, monta a piscina de números do que ela citou, e acusa todo número órfão — **órfão com
unidade ao lado é ERRO, órfão sem unidade é aviso** (`--estrito` promove). Os limites dele
estão declarados no próprio cabeçalho e no `INSTRUMENTO.md`; dois continuam abertos e
estão em §8.

`check-canarios.json` + `check-canarios.mjs` medem o **julgador**, não a resposta: 19
perguntas cujo desfecho é conhecido por contagem (5 respondíveis, **4
`presente-escondido`**, 5 impossíveis, 5 armadilhas). O recontador refaz as contagens e falha quando um canário morre — inclusive
quando um filtro tem typo, que é a falha silenciosa central, já que predicado que nunca
casa fica em zero para sempre e zero é o resultado que "impossível" reporta como sucesso.

**A lição mais cara de 9/8/2026 mora aqui.** A medição daquele dia disse "3 falhas em 29"
e era mentira: dois canários provaram que o avaliador estava respondendo do próprio
conhecimento, não da base. **Nenhum número de qualidade da base pode ser citado sem dizer
com que instrumento foi obtido e se os canários daquele instrumento passaram.** Número sem
instrumento é opinião com cara de medida.

---

## 4. Retomar trabalho interrompido

Três fontes de estado, todas em disco. Nenhuma depende de lembrar da sessão.

```bash
# O que já tem transcrição, e o que falta
node -e "const m=require('./research/corpus/manifest.json');
const s=m.videos.filter(v=>!v.transcript);
console.log(m.videos.length-s.length,'de',m.videos.length,'com transcrição');
console.log('faltando:', s.map(v=>v.ref).join(' '))"

# O que já foi extraído, e o que falta (um arquivo por vídeo, sempre)
node -e "const fs=require('fs'),m=require('./research/corpus/manifest.json');
const tem=new Set(fs.readdirSync('research/extract').filter(f=>f.endsWith('.jsonl')).map(f=>f.replace('.jsonl','')));
const alvo=m.videos.filter(v=>!v.postRun1&&v.transcript).map(v=>v.ref);
console.log('extraídos', tem.size, 'de', alvo.length);
console.log('SEM extract:', alvo.filter(r=>!tem.has(r)).join(' ')||'(nenhum)');
console.log('VAZIOS:', [...tem].filter(r=>!fs.readFileSync('research/extract/'+r+'.jsonl','utf8').trim()).join(' ')||'(nenhum)')"

# Quantas claims, de que tiers, quantas contradições
node research/tools/check-claims.mjs
```

Regras de retomada:

- **Todo passo de rede é resumível e checkpointado.** `fetch-captions.mjs` e
  `fetch-dates.mjs` pulam o que já está feito; ambos gravam a cada 20 itens, então Ctrl-C
  no minuto 12 não custa os 12 minutos. `build-manifest.mjs` grava a cada 25 datas.
  Rodar de novo é sempre seguro — nunca é "começar do zero".
- **Arquivo vazio não é arquivo feito.** Um `.jsonl` de 0 byte passa em toda contagem por
  nome. Use a checagem de vazios acima.
- **Um vídeo por arquivo torna a regeneração idempotente**: refazer `R014` reescreve
  `R014.jsonl` e não toca em mais nada. É por isso que lote nunca é unidade de arquivo.
- Antes de despachar um lote novo, rode `check-claims.mjs` sem `--only` para saber o
  ponto de partida. Depois, rode de novo — a diferença é o que o lote produziu.

---

## 5. Armadilhas conhecidas (todas aconteceram, todas em 9/8/2026)

**`git add research/` varre arquivo pela metade.** Enquanto um agente escrevia
`R159.jsonl`, o `git add research/` de outro processo pegou o arquivo truncado. Um JSONL
truncado é JSON inválido na última linha — o checker pega, mas só depois de o commit
existir. **Sempre adicione caminho específico** (`git add research/tools/check-claims.mjs
research/kb/SCHEMA.md`), nunca o diretório, enquanto houver agente rodando.

**Dois processos escrevendo `manifest.json`.** `fetch-captions.mjs` faz checkpoint no
manifesto a cada 20 vídeos; `build-manifest.mjs` faz a cada 25 datas. Rodar os dois juntos
faz um sobrescrever o trabalho do outro em silêncio — sem erro, sem conflito, só campos
que somem. Foi por isso que `fetch-dates.mjs` **não escreve no manifesto** e produz
`dates.json` à parte. Se for escrever no manifesto de dois lugares, use **escrita atômica**
(gravar em `manifest.json.tmp` e `rename`, que é atômico no mesmo filesystem) — hoje
nenhum dos dois faz isso; ambos usam `writeFileSync` direto. E, na prática: **rode um de
cada vez**.

**Erro em dado vira norma para o próximo agente.** Agentes copiam a convenção dos arquivos
vizinhos. Um lote escreveu `semanas` com o frame `anos` e gramas/calorias com frame `kg`,
e o relatório justificou: *"segui a convenção existente"*. Ou seja, a trava de unidade foi
contornada por dentro, reintroduzindo exatamente o defeito que ela existe para barrar, e
com aparência de conformidade. Duas consequências operacionais:
- Quando faltar frame, o `PROTOCOLO-EXTRACAO.md` manda **relatar no resumo final e deixar
  o número por extenso** — aviso é barato, dado errado não é.
- **Corrija dado errado imediatamente**, antes do próximo lote. Cada hora que um erro fica
  no `extract/` é uma hora em que ele pode ser copiado como padrão.

**`--only` escondia os outros arquivos.** A versão anterior de `check-claims.mjs` filtrava
os arquivos *antes* de montar o índice de ids. Resultado: `conflicts` apontando para uma
claim de outro vídeo virava erro "conflicts aponta para X, que não existe", e um agente
simplesmente desistiu de registrar a aresta — que é justamente o dado que a base existe
para guardar (contradição interessante quase sempre cruza vídeo). Hoje o índice lê
**sempre** o extract inteiro e `--only` restringe apenas o que é *validado*. Se você mexer
nessa parte, preserve a distinção.

**`--only` casa por prefixo.** `files.filter(f => f.startsWith(only))` — `--only R15`
valida `R150`…`R159`. Use o ref completo.

**Repartição de lote por aritmética modular perde e duplica lote, e ninguém percebe.** O
passe de `modo`/`conditions` foi repartido com `ls research/extract/*.jsonl | sort | awk
'NR%18==k'`. `NR` é 1-indexado e o `k` que os agentes usaram era 0-indexado: um agente
pegou a fatia de outro e escreveu por cima dela, e **a fatia do agente nº 12 nunca rodou**
— R012, R030, R048, R066, R084, R102, R120, R138, R156, R174, 278 claims, progressão
aritmética de passo 18, perfeitamente invisível. Só foi encontrada por auditoria, semanas
de trabalho depois. Três consequências operacionais:
- **Reparta por lista explícita**, escrita num arquivo, não por fórmula que cada agente
  reavalia. A fórmula tem de ser avaliada UMA vez, pelo orquestrador.
- **Confira a cobertura depois**, não a soma dos relatórios: `∪ lotes == todos os
  arquivos` é uma linha de código e cada relatório dizia que estava tudo certo.
- **A catraca é o que salva.** Foi `TETO_SEM_MODO` — e não a leitura dos relatórios — que
  tornou o lote perdido detectável. Trava que só desce vale mais que 18 confirmações.

**Commite um passe por vez.** A auditoria de fidelidade tentou isolar o dano de 18 agentes
comparando `HEAD` com a árvore, e não conseguiu: a árvore carregava vários passes não
commitados ao mesmo tempo, então cada mudança fora de escopo teve de ser atribuída
casando-a com decisão escrita nos documentos. **Evidência forte, não prova.** Um commit por
passe teria tornado aquela auditoria determinística. Adote isso antes do próximo fan-out.

**Teto de 20 subagentes simultâneos.** É o limite do harness. Lote de 10 vídeos por agente,
até 20 agentes: ~200 vídeos por rodada, ~15–20 min. Passar disso não acelera, enfileira.
E os workers de rede são propositalmente baixos (yt-dlp conc. 3–4) porque o throttle do
YouTube é por IP: subir isso com outro processo yt-dlp rodando atrasa os dois.

**Aviso não é erro, e a lista de avisos não é a lista de tarefas.** Hoje `check-claims.mjs`
emite **24 avisos**: 23 de "prescrição com dose e sem `conditions`" — o lugar de olhar
duas vezes, não uma fila a zerar. Foi exatamente tratar o contador de avisos como alvo que
produziu o pior defeito do passe de `conditions`: o aviso só enxerga `modo: prescricao`
com param em `FRAMES_DOSE`, então as 278 claims de um lote que nunca rodou não geraram um
único aviso e o build ficou verde com um décimo do corpus do Vena sem sequer a etiqueta
que permitiria olhar. **Quando o alvo vira o contador, o campo é preenchido onde o contador
olha e as arestas fracas nascem para zerar linhas.**

**Aresta de `conditions` que cruza vídeo erra muito mais.** Medição da auditoria: 42 % de
erro nas cross-vídeo (5 de 12) contra 9 % dentro do mesmo vídeo. Faz sentido: aresta
cross-vídeo é, por construção, o agente aproximando duas coisas que nunca foram ditas
juntas. Restaram **7** na base e elas estão nomeadas em `ESTADO.md`. Preferir aresta
ausente a aresta fabricada é a regra da casa — condição que não limita nada faz a
prescrição **parecer** qualificada, que é pior do que ela aparecer nua.

---

## 6. O que NÃO fazer

**Não cite nenhum número de qualidade da base sem dizer com que instrumento ele foi obtido
e se os canários daquele instrumento passaram.** Esta é a lição mais cara de 9/8/2026. A
medição daquele dia disse **"3 falhas em 29"** e era mentira: dois canários provaram que o
avaliador estava respondendo do próprio conhecimento em vez da base, e o placar inteiro
daquela rodada virou teto, não medida. "A base acerta 90 %" sem instrumento nomeado não é
um resultado fraco — é um número inventado com aparência de resultado. Se você não pode
dizer *qual* medição, *quando*, e *se os canários dela estavam vivos*, não escreva o
número. Ver `research/kb/INSTRUMENTO.md` e `research/kb/ESTADO.md`.

**Não coloque pesquisa no scratchpad da sessão.** É literalmente como os 564 mil palavras
morreram. Artefato caro nasce em `research/` e é commitado no mesmo dia. Scratchpad serve
para log de build e arquivo intermediário descartável, nada mais. E o scratchpad é
**compartilhado entre os agentes do fan-out**: num passe de 18 agentes, dois deles tiveram
o próprio script sobrescrito no meio do trabalho por um script de outro lote. Se for
escrever ferramenta de lote, use nome único por lote.

**Não trate `relato-de-programa` como prescrição.** São 447 claims que descrevem o método
de outra pessoa, 174 delas com dose completa (`85 % do 5RM`, `+10 lb/semana`). O campo
`modo` existe para essa distinção e nenhuma trava protege quem a ignora na hora de
consultar. O filtro que pode virar treino é, e só é, `scope: GERAL` + `modo: prescricao`.

**Não regenere o manifesto sem rodar `verify-manifest.mjs` depois.** `build-manifest.mjs
--refresh` seguido de `fetch-captions.mjs` sem verificação é o caminho curto para uma base
inteira um vídeo fora de fase, e nada quebra até você já ter treinado seis semanas em cima.

**Não faça crawl de `goodlift.info`.** O `robots.txt` desautoriza **ClaudeBot por nome**
(junto com GPTBot, CCBot, Google-Extended), com `Content-Signal: ai-train=no, use=reference`
e reserva de direitos sob o Art. 4 da DSM; o próprio site declara que "any form of data
extraction, scraping" é proibida e ofusca o texto contra extração. Os recordes em
`research/kb/IPF-REALIDADE.md` vieram do dump aberto do **OpenPowerlifting**, cruzados com
imprensa especializada, e o que não teve confirmação independente está marcado como tal.
Consulta por navegador, com olho humano, é outra coisa — automação em massa, não.

**Não faça crawl dos artigos do Stronger by Science.** Mesma situação, verificada com
`curl https://www.strongerbyscience.com/robots.txt` em 9/8/2026: `Content-Signal:
search=yes, ai-train=no, use=reference` e `User-agent: ClaudeBot / Disallow: /`. Lista
nominal, não boilerplate. Ver `research/kb/FONTES-ADICIONAIS.md` §2 para as rotas
alternativas e o grau de confiança de cada uma.

**Não commite áudio bruto.** `research/corpus/.audio/` e `research/tools/.venv-whisper/`
estão no `.gitignore`. Um único `.webm` de vídeo são ~11 MB; o corpus inteiro seriam
gigabytes de dado 100% regenerável. As transcrições e os `.json3.gz` (1,9 MB no total)
são o que vale versionar.

**Não conserte o ASR por conta própria.** Se um número parece implausível, marque
`"suspect": true` com `"suspectWhy": "numero"` ou `"negacao"`. Chutar o que "devia" ter
sido dito é precisamente o defeito que esta base existe para não ter. Nem
`verify-suspects.mjs` decide: ele emite `CONFIRMADO` só quando número e polaridade batem
exatamente, e tudo mais sai `DIVERGENTE` para julgamento humano.

**Não invente tópico nem promova `PESSOAL` a `GERAL`.** O vocabulário de tópicos é fechado
porque, sem banco vetorial, `topic` é o mecanismo de recuperação inteiro. E a distinção
"faça singles pesados" vs "eu faço singles pesados" é, para um natural de 87 kg copiando
um cara que agacha 400 kg, a coisa mais importante da base. Na dúvida, `PESSOAL`.

---

## 7. Estado atual (snapshot de 9/8/2026, fechamento da rodada)

Deduzido do repositório com os comandos do §4 e com `npm run check:kb`. **Todo número
abaixo veio de contagem mecânica, não de leitura.** Para o que é julgamento de agente e
não foi provado por compilador, leia `research/kb/ESTADO.md` — ele existe exatamente para
essa separação.

**Números da base — `node research/tools/check-claims.mjs`**

| | |
|---|---|
| claims | **6.909** em 231 lotes |
| por fonte | Vena `V###` **4.947** · Blevins `G###` **1.819** · IPF `F001` **143** |
| tiers | `R:6766` · `O:143` |
| vídeos com claim | 230 |
| tópicos distintos | 74 de 74 do vocabulário (nenhum morto; o menor tem 3) |
| `modo` | narrativa 1471 · mecanismo 1403 · **prescricao 1134** · opiniao 1119 · fato 595 · relato-de-programa 447 · anedota 243 · estudo 239 · avaliacao-de-terceiro 115 · sem modo 143 (são as `tier: O`, isentas por regra) |
| `conditions` | 502 claims condicionadas, **678 arestas**, das quais **7 cruzam vídeo** |
| `conflicts` | 31 |
| erros do checker | **0** |
| avisos | **24**: 23 de "prescrição com dose e sem `conditions`" + 1 de valor fora da escala do frame (`V033-10`, declarado `suspect`) |

**Vena (`R`) — corpus principal**
- [x] Manifesto: 197 vídeos, 196 citáveis, 15,1 h, todos com `date`.
- [x] `verify-manifest.mjs` passa: 6 âncoras, 258 timestamps, offset único.
- [x] Transcrições: **181 de 197**. Os 16 sem transcrição são `R178`–`R196` (vlogs antigos
      de PR, sem legenda automática em inglês) e nenhum tem citação no `PROGRAMA.md`.
- [x] Extração: 4.947 claims, `modo` em **4.947 de 4.947**.
- [~] **`R191.jsonl` continua com 0 byte.** Passa em qualquer contagem por nome. Ainda não
      se sabe se é vídeo sem conteúdo extraível ou lote perdido. Ver §5.
- [~] `R132.jsonl` pula os ids `V132-25` e `V132-28` — buraco de sequência, sem dano
      conhecido, sem explicação registrada.

**IPF (`F`) — documento normativo**
- [x] `research/corpus/ipf/rulebook-2026.md` + os 2 PDFs oficiais, versionados.
- [x] 143 claims `tier: O`, todas conferidas contra o markdown (parágrafo existe +
      verbatim literal presente). `tier: O` não leva `scope` nem `modo`, por regra.
- [x] `sources.mjs` ganhou o discriminador `kind: 'canal' | 'normativo'`: a fonte `ipf`
      entra sem `channelId`, sem `postRun1`, sem `testado`, e `channelVideosUrl()` lança
      em vez de montar uma URL que não existe.

**Blevins (`G`) — segunda fonte, compete testado na IPF**
- [x] Manifesto: 354 vídeos, 41,2 h. Transcrições: **333**.
- [x] Extração: **1.819 claims** em 50 vídeos. Nasceram todas com `modo`.
- [x] `G033` é **inextraível e isso está registrado no manifesto**, não deduzido: é
      filmagem de plataforma sem fala. `fetch-captions.mjs` grava
      `semLegenda: {motivo, verificadoEm}` porque `transcript: null` significava duas
      coisas com consertos opostos ("ainda não baixei" e "não existe legenda").

**Verificação com Whisper**
- [~] **74 claims com `suspect: true`; 53 delas sem `suspectWhy`.** O passe de Whisper
      recebe 53 janelas sem saber se procura número ou negação. Ver §8.8.
- [x] 4 claims com `verified: "whisper"` e `verbatimWhisper` ao lado do `verbatim`
      original, que **nunca** é reescrito.
- [x] O `CONFIRMADO` falso do comparador foi consertado: `norm()` apagava o ponto decimal,
      `0.8` virava `0 8` e casava com o `8` da legenda — a única ferramenta feita para
      pegar erro de número era cega justamente para o erro de décimo.
- [ ] `research/kb/SUSPEITOS-VERIFICADOS.md` continua **não existindo, de propósito**:
      gerá-lo com 11 de 148 alvos criaria um documento que parece completo.

**Instrumento de medição**
- [x] `check-answer.mjs` + 34 casos de teste; `CANARIOS.json` (**49** em 12/8/2026: 19
      originais + os 18 públicos P01–P18 + os 12 cegos B01–B12) + `check-canarios.mjs` +
      **55** casos. `npm run check:kb` encadeia tudo, então **canário morto quebra o
      build**, deliberadamente.
- [x] **O placar da porta nova sai POR CONJUNTO** (12/8/2026): `8 de 18` no público e
      `0 de 12` no cego, nunca a média `8 de 30`. `conjunto` é campo obrigatório do
      canário. Ver §8.47 — e a regra que veio junto: **conjunto de teste publicado vira
      conjunto de treino**, então a próxima onda de recuperação precisa de um conjunto
      cego NOVO, escrito por quem não viu a ferramenta nem o `CANARIOS.json`.
- [x] **A âncora no corpus em `check-glossario.mjs`** (12/8/2026): as 74 gavetas do
      vocabulário de entrada passaram a ter trava de CONTEÚDO, não só de forma. Antes,
      26 delas podiam virar dez strings sem sentido com os três gates verdes. Ver §8.43.
- [x] A quarta família, `presente-escondido` (C16–C19), e a camada de recuperação que ela
      mede (`busca.mjs`, `VOCABULARIO.md`, `check-vocabulario.mjs`). Ver
      `research/kb/RECUPERACAO.md`. As três famílias antigas mediam fabricar, responder de
      fora e promover escopo; **nenhuma media esconder**, que foi a causa de 7 das 7
      respostas não-`bem` da MEDICAO-02.
- [x] O canário `C07` estava mal escrito e foi reescrito em 9/8: a redação antiga era
      respondível com id pelo corpus, e um julgador honesto respondendo bem teria
      invalidado a rodada inteira pela tabela de leitura do próprio arquivo.

**Gate de dor (o lado do app que consome a base)**
- [x] `npm run check:gate` roda o `buildWeekDoc` **de produção** contra 33 cenários
      derivados da tabela do §1.2 do `PROGRAMA.md`, nos dois momentos de coleta (pré e
      pós-sessão), mais 16 testes. A tabela é a fonte única: nenhum limiar é digitado em
      código.
- [~] O que a trava **não** cobre está em `research/kb/GATE-DOR.md` e resumido em §8.

**Sínteses e visões — continuam vazias**
- [ ] `research/synth/` vazio; `research/kb/topics/*.md` não existe e não há gerador.

## 8. Divergências entre o que os documentos dizem e o que o código faz

Encontradas ao escrever este RUNBOOK e nas auditorias do fechamento. Nenhuma é fatal hoje;
todas mordem depois. As riscadas foram **resolvidas em 9/8/2026**; ficam registradas com o
conserto ao lado porque o defeito que elas descrevem volta na próxima fonte nova.
**Divergência não resolvida não some desta lista** — some só quando for consertada.

**A numeração é estável e nunca se reaproveita.** Item resolvido continua ocupando o número
dele, riscado: outros arquivos citam `§8.2`, `§8.8` e `§8.9` por número, e renumerar
transformaria uma referência certa em referência errada sem nada reclamar. Item novo entra
no fim.

> **ABERTAS HOJE — a lista de trabalho, para não ter de varrer as riscadas:**
> **7** (`date` na claim) · **8** (dívida: 53 sem `suspectWhy`) · **9** (`synth/` e
> `topics/` vazios) · **12** (`.tmp` fora do `.gitignore`) · **16** (deliberadamente não
> consertada) · **17** (dívida: **74** claims de gênero) · **18** (dívida: `pratica-pessoal`) ·
> **19** (dívida: **111** params de TAXA) · **20** · **21** · **22** · **23** · **24** ·
> **26** · **27** · **28** · **29** · **30** · **32** · **33** · **34** · **35** ·
> **40** (gaveta que não pontuou é invisível) · **41** (a cobertura de
> mutação declarada era falsa) · **42** (`npm run lint`
> não cobre `research/tools/`) · **45** (o painel de gavetas não abertas nomeia gaveta útil em 2 de 12) ·
> **46** (precisão: a tela aprendeu a encolher, mediana 40 → 34, mas 2 de 10 estreitas
> ainda devolvem 40) · **48** (a alocação é soma zero: abrir a gaveta certa MAIS uma
> vizinha devolve menos que abrir só a certa) · **49** (`PISO_VAGAS`: a asserção
> tautológica saiu; a ESCOLHA do valor fica aberta) · **50** (**ORDENAÇÃO DENTRO da gaveta: 29 de 54
> canários reprovam com a gaveta certa forçada no teto de 18 — a PRIMEIRA da fila**) · **53** (as varreduras que ESCOLHERAM as
> constantes não reproduzem) · **54** (o canário do cinto continua reprovado; o relatório
> exibiu outra frase) · **55** (a precisão do TOPO piorou: mediana da resposta certa 6 → 8) ·
> **56** (a fisgada perde 2 das 5 sob paráfrase) · **57** (buracos de roteamento com "não
> sei" silencioso sobre fato que a base tem literal) · **58** (a cobertura de mutação do
> vocabulário: o número que vale é `troca` **71/74**, não `lixo` 74/74) ·
> **59** (a invariante de não-diluição é uma TAUTOLOGIA: 38 violações em 1.832 quando se
> varia o `max` de verdade) · **60** (`--topic a b c` lê UM valor, e `--topic` DESCARTA a
> rota inteira enquanto o banner promete o contrário) · **61** (o teto de 34 kB é
> calibrado na pergunta errada: o máximo medido é **40,0 kB**) · **62** (o escape
> `--topic <gaveta certa>` regrediu de 12/12 para **10/12** e nada o mede) · **63**
> (`TETO_LIGACAO` 8→80 sobrevive à mutação e NÃO estava na dívida declarada) · **64** (o
> gate mede um caminho que o produto deixou de usar) · **65** (`regras-ipf` é
> gaveta-chamariz: **8 de 143** claims do regulamento a carregam) ·
> **66** (**o recuo do gate de peitoral não reduz carga: 22 séries invariantes; decisão do
> atleta, ver `PEITO-PARECER.md` §8.1**) · **67** (o "congela" do §1.2 não congela carga) ·
> **68** (dor em repouso sem porta de entrada; andaime completo) · **69** (**o módulo que
> implementaria o congelamento e o gate S3→S4 do TM tem ZERO chamadores**) · **70**
> (`acute` com leitor e sem escritor) · **71** (o alerta de dor da tela só lê o pré) ·
> **72** (as bandeiras do gate não chegam a ação nenhuma, e o `WeekDoc` velho pode
> recomendar re-subir degrau) · **73** (as 18 séries de aquecimento sobre o peitoral são
> invisíveis para todo degrau) · **74** (defeito de CONTEÚDO de endereço não é decidível por
> máquina — a trava nova cobre só o de endereço) · **75** (o terceiro momento do §1.2 não
> tem campo) · **76** (**não existe leitura de TENDÊNCIA, e a base decide por tendência: um
> platô em 2/10 nunca é nomeado**) · **77** (`post.newPain` só captura dor NOVA, e o quadro
> dele é dor preexistente).
> São **55**. O plano de execução das SETE primeiras — as que decidem esta linha de
> trabalho — está em **`research/kb/RECUPERACAO.md` §28.1**, que é a fila de hoje; o
> restante continua em **`research/kb/ONDA-2C.md`**
> (o `ONDA-2B.md` é a fila anterior; o `ONDA-2.md` é a de antes dela, e os critérios de
> aceite deste último estão desatualizados — ver §8.33).
>
> **Fechada em 10/8/2026, no fechamento da onda 2B:** a **31** (a parte que estava aberta:
> nada travava o conserto da precisão da busca livre) e a **38** (as mutações do roteador
> sem trava, fechada no mesmo passe que a abriu — ela fica escrita, riscada, porque a
> lição dela não fecha). Continuam abertas as outras 22 já listadas, e entraram duas
> novas — **36** e **37** —, ambas medidas pelo segundo ataque cego. A onda 2B fechou
> **duas** divergências e abriu **duas**; registrar isso é o ponto da lista, e o saldo é
> honesto: ela produziu MEDIDA, não conserto.
>
> **Fechadas em 11–12/8/2026, pelo glossário de entrada e pelo passe de verificação que
> veio depois dele:** a **36** (roteamento, 7 de 18 → **1 de 18**) e a **37** (`fisgada`
> alcança `dor`, e a tela passou a nomear a gaveta que não abriu). Entraram **quatro**
> novas: a **39** e a **40**, que são as metades que aquela onda declaradamente NÃO
> atacou, e a **41** e a **42**, achadas pelo passe de verificação — a primeira é uma
> afirmação FALSA de cobertura dentro do `RECUPERACAO.md`, a segunda é a razão de o
> código morto ter passado. **Saldo: fecharam duas e abriram quatro.** Isso não é
> regressão — é o que acontece quando alguém que não construiu vai conferir, e é
> exatamente por isso que o construtor não fecha o próprio item.
>
> **Fechamento de 12/8/2026, depois do TERCEIRO ataque cego (12 perguntas novas, B01–B12
> em `research/kb/CANARIOS.json`):** entraram **cinco** — a **43** e a **47**, as duas
> fechadas no mesmo passe que as abriu, e a **44**, a **45** e a **46**, abertas. A **39**
> e a **41** ganharam o número medido e continuam abertas. **Saldo: fecharam duas e
> abriram três.** O número que manda é o CEGO: **0 de 12**, contra 8 de 18 no conjunto
> público. Não some os dois — ver o placar por conjunto do `check-canarios.mjs`.
>
> **Fechamento de 12/8/2026 (noite), depois da AUDITORIA CEGA da onda 2D (12 perguntas
> novas, D01–D12 em `research/kb/CANARIOS.json`):** entraram **onze** — a **51**, fechada
> no mesmo passe que a abriu, e as dez abertas **48**, **49**, **50**, **52**, **53**,
> **54**, **55**, **56**, **57** e **58**. A **39** e a **46** ganharam número medido e
> continuam abertas; a **41** foi reescrita com a cobertura de mutação remedida.
> **Saldo: fechou uma e abriu dez.** Isso é o esperado quando um ataque mede o que o
> construtor não escolheu publicar, e não é regressão: **nove das dez já eram verdade
> antes, sem estarem escritas.** O número que manda continua sendo o CEGO: **2 de 12 e
> 3 de 33 ids**, contra 7 de 18 no conjunto público — 2,3 vezes de distância.
>
> **Fechamento de 12/8/2026 (fecho da onda do PEITORAL, motivada por um sintoma real do
> atleta):** entraram **doze** — **66** a **77** —, todas abertas, e todas sobre o gate de
> dor de peitoral e o que o app faz com ele. **Saldo: fechou zero e abriu doze**, e isso é
> honesto: esta onda produziu MEDIDA e CORREÇÃO DE DOCUMENTO, não conserto de
> comportamento. O que ela **fechou** não é item desta lista: o `npm run build` voltou ao
> verde (estava vermelho no estado commitado, primeiro em `check:gate` e depois em dois
> erros de tipo que o gate vermelho escondia); seis endereços do `PROGRAMA.md` foram
> corrigidos com `scope` e `modo` ao lado; e nasceu `check-enderecos.mjs`, a trava que
> faltava havia **seis ondas** (§8.74).
> **A lição desta onda, e ela é a mais cara aqui:** *o grep vazio não é prova de ausência.*
> A onda anterior escreveu *"grep de `congela|recua|SUP-V1` em `src/` = zero, logo nada
> implementa congelamento"*. O grep dava **3**, e atrás dele estava
> `trainingMaxProgression.ts` — 232 linhas corretas, com a porta do congelamento e o gate
> S3→S4 do TM, e **zero chamadores** (§8.69). O achado verdadeiro não era *"não existe
> código"*, era *"existe código certo que nunca executa"* — que é pior de descobrir e mais
> fácil de consertar, e que ninguém teria visto se o grep tivesse sido acreditado.
>
> **A regra que esta lista compra de novo, terceira vez:** o construtor não fecha o
> próprio item, e o relatório do construtor escolhe quais números publicar mesmo quando
> não mente em nenhum. Das dez novas, **seis** (49, 53, 54, 55, 56, 58) são números que
> estavam a um comando de distância e não foram rodados.
>
> **Fechamento de 13/8/2026, depois da onda 2E (tela por seção) e do QUINTO ataque cego
> E01–E12:** entraram **sete** — **59**, **60**, **61**, **62**, **63**, **64** e **65**,
> todas abertas. Fecharam **duas**: a **44** (há UMA definição de tela, `telaDaResposta()`,
> e a auditoria conferiu nos dois sentidos — 0 ids da tela ausentes da saída e 0 ids
> impressos fora da tela, em 17 perguntas) e a **52** (o byte NUL saiu do `roteador.mjs` e
> o `grep` voltou a funcionar). A **39** e a **50** ganharam número novo e continuam
> abertas. **Saldo: fecharam duas e abriram sete.**
>
> **A INVERSÃO QUE ESTE FECHAMENTO REGISTRA, e é o que muda a fila.** Pela primeira vez o
> número cego NÃO é o pior: **7 de 12 e 3 de 12** contra 11 de 18 e 6 de 18 no público —
> 58 %/25 % contra 61 %/33 %, quando em 12/08 a distância era de 2,3×. E pela primeira vez
> **zero** dos fracassos cegos é roteamento. As divergências **36**, **37**, **39** e
> **48** descreviam roteamento e alocação, e as três primeiras metades foram consertadas;
> o que sobrou é a **50**, ORDENAÇÃO DENTRO DA GAVETA, remedida aqui em **29 de 54**
> canários. **A fila deixou de ser "consertar o roteador" e passou a ser "travar a
> ordenação e tirar a escolha da gaveta do repositório"** — ver `RECUPERACAO.md` §28.
>
> **E a regra que esta lista compra pela QUARTA vez:** o relatório da onda 2E reproduz
> dígito a dígito — foi o primeiro que reproduziu — e ainda assim **cinco** das sete novas
> (59, 61, 62, 63, 65) são números que estavam a um comando de distância e não foram
> rodados. Honestidade no dígito publicado não é o mesmo que publicar o dígito que
> incomoda.

1. ~~**`npm run check:kb` não está no `npm run build`.**~~ **RESOLVIDO** — `scripts.build`
   agora roda `check:kb` antes do `tsc -b`. A base deixou de depender de quem lembrar.
2. ~~**`verify-manifest.mjs` e `check-claims.mjs` são hardcoded no Vena.**~~ **RESOLVIDO** —
   `verify-manifest.mjs` aceita `--source`; `check-claims.mjs` resolve `src` contra a
   **união** dos manifestos, sem a claim declarar fonte (o prefixo do ref já diz de qual
   corpus ela vem, e exigir o campo redundante seria criar um segundo lugar para divergir).
   Prefixo desconhecido e prefixo conhecido com número inexistente dão erros distintos.
3. ~~**`verify-manifest.mjs` aponta para um símbolo que não existe mais.**~~ **RESOLVIDO** —
   a mensagem agora manda ajustar `postRun1` da fonte em `research/tools/sources.mjs`.
4. ~~**`fetch-captions.mjs` cita `repair-numbers.mjs`, que nunca existiu.**~~ **RESOLVIDO** —
   o cabeçalho aponta para `list-suspects` → `verify-suspects` → `whisper-window.py`.
5. ~~**`fetch-captions.mjs` afirma que "o manifesto do Vena não tem `date`".**~~ **RESOLVIDO** —
   o comentário passou a dizer o que a linha faz de verdade: só preenche buraco, nunca
   sobrescreve a data canônica do passe de datação.
6. ~~**O manifesto do Vena não tem `source`, `refPrefix`, `builtAt` nem `channelItemCount`.**~~
   **RESOLVIDO sem reconstruir** — os quatro campos foram acrescentados por escrita atômica
   (`builtAt: 2026-08-09`, `channelItemCount: 197`), porque rodar `--refresh` para ganhar
   metadado arriscaria a numeração, que é a coisa mais valiosa do repositório.
   `verify-manifest.mjs` agora **exige** os quatro: manifesto sem eles não tem como
   responder "o canal andou quanto desde o build?".
7. **`SCHEMA.md` prescreve `date` no registro da claim; nenhuma das 5.090 claims tem, e o
   checker não exige.** A regra "o recente vence" é executável no nível do *vídeo*
   (`manifest.json` e `dates.json`), não no nível da claim. Ou o schema muda, ou o checker
   passa a derivar `date` do `src` — a segunda parece melhor, porque duplicar a data em
   cada claim é justamente o tipo de cópia que diverge.
8. ~~**`suspectWhy` está documentado, é enumerado fechado no `PROTOCOLO-EXTRACAO.md`, e não
   tem trava nenhuma.**~~ **RESOLVIDO parcialmente** — valor fora de `numero`/`negacao` é
   erro, `suspectWhy` sem `suspect` é erro, e a ausência virou catraca
   (`TETO_SEM_SUSPECT_WHY = 53`, só desce). **A dívida continua de pé: 74 claims com
   `suspect: true`, 53 sem `suspectWhy`**, e o passe de Whisper recebe essas 53 janelas
   sem saber se procura número ou negação. A trava impede que a dívida cresça; quem a paga
   é a tarefa #24.
9. **`SCHEMA.md` descreve `research/kb/topics/*.md` como "geradas, não editar" — não
   existem e não há gerador.** O mesmo vale para `research/synth/`, que o `SCHEMA.md` e o
   `PROTOCOLO-EXTRACAO.md` citam como o lugar onde mora síntese com `basis`.
10. ~~**A tabela de `frame` do `SCHEMA.md` está desatualizada**, e o exemplo de `conflicts`
    usa `"V0088"`, que não é id válido pelo formato que o próprio arquivo define.~~
    **RESOLVIDO** — a tabela foi reescrita com as 52 gavetas, o exemplo virou `V088-12`, e
    a regra de id que o arquivo documentava (`V{ref}-{seq}`, que a base nunca usou para o
    corpus G) foi substituída pela regra real, agora travada no compilador. As decisões de
    enumerado passaram a morar em `research/kb/ENUMERADOS.md`.
11. ~~**Tiers `E` e `U` não têm nenhuma trava no checker.**~~ **RESOLVIDO** — `E` exige
    `source.name` e `source.url` navegável; `U` exige `source.date` em ISO. Feito antes do
    passe de elites de propósito: trava que chega depois do dado chega tarde.
12. **`.tmp` não está no `.gitignore`.** `research/corpus/.tmp/` e
    `research/corpus/blevins/.tmp/` recebem os `.json3` brutos do yt-dlp e só são limpos no
    caminho feliz do `fetch-captions.mjs`. Se ele morrer no meio, os arquivos ficam lá — e
    um `git add research/` os varre (§5). Só `.audio/` e `.venv-whisper/` estão ignorados.
13. ~~**`TETO_SEM_MODO` declarava 4.947 e a realidade era 278.**~~ **RESOLVIDO** — a catraca
    chegou a **zero**: o mapa está vazio, prefixo ausente vale zero, e `modo` é obrigatório
    para toda claim que não seja `tier: O`. `SCHEMA.md` e `ENUMERADOS.md` foram corrigidos
    no mesmo passe, porque documento e constante divergindo em silêncio é o defeito nº 3
    deste projeto e ele acabara de se repetir dentro da própria trava que o descreve.
14. ~~**`conditions` aceitava ciclo.**~~ **RESOLVIDO** — par mútuo (`A` condiciona `B` e
    `B` condiciona `A`) agora é **erro**. Limitação é assimétrica; havia 5 pares e o molde
    era sempre o mesmo: a regra geral apontada como condição do exemplo que ela própria
    gera, que é `basis` com nome errado. Os 5 foram desfeitos.
15. ~~**`scope: PESSOAL` + `modo: prescricao` não tinha trava**, apesar de o `SCHEMA.md`
    definir os dois como excludentes.~~ **RESOLVIDO como aviso** — as 13 ocorrências foram
    abertas e corrigidas (10 eram `modo` errado, 3 eram `scope` errado), e hoje são zero.
    Aviso e não erro porque o checker não tem como escolher qual dos dois campos consertar.
16. **`relato-de-programa` com dose não dispara aviso nenhum, e são 174 claims.** O aviso
    de "dose sem `conditions`" só olha `modo: prescricao`. Mover a especificação de um
    programa alheio para `relato-de-programa` é certo para o filtro que vira treino e abre
    um buraco no gate de segurança: `85 % do 5RM`, `+10 lb/semana`, `3 a 5 min de descanso`
    ficam citáveis sem que nada reclame. **Deliberadamente NÃO liguei o aviso**, porque
    seriam 174 avisos que a fonte quase nunca permite resolver — aviso impossível de zerar
    é como se ensina alguém a ignorar avisos. O conserto certo é do lado do consumidor:
    quem lê a base nunca pode tratar `relato-de-programa` como prescrição.
17. ~~**Não existe campo `genero` por vídeo, e ele é o conserto determinístico de
    `relato-de-programa` / `avaliacao-de-terceiro`.**~~ **RESOLVIDO em 9/8/2026, com uma
    dívida declarada.** `genero` está em 551 de 551 vídeos dos dois manifestos, semeado
    por `research/tools/seed-genero.mjs` a partir da `TRIAGEM.md` e dos títulos, sem
    reabrir vídeo nenhum; o enumerado fechado (dez valores) mora em `kb.mjs` e a decisão
    em `research/kb/GENERO.md`. `verify-manifest.mjs` exige o campo nas duas fontes,
    `build-manifest.mjs` o carrega adiante por `videoId`, e `check-evidence.mjs --genero`
    torna "o que revisar" uma consulta.
    **A dívida, atualizada em 9/8/2026 (onda 2):** a trava do `check-claims.mjs` MEDE e não
    recusa — catraca por `src` (`TETO_PRESCRICAO_EM_GENERO_RESTRITO`), teto no valor de
    hoje, só desce. **O teto desceu de 76 para 74**: a fila foi aberta uma a uma com o
    `verbatim` e a transcrição em volta, e **2 mudaram** (`G020-17` → `relato-de-programa`,
    a frequência de agacho **do StrongLifts** e a única da fila com dose de frequência em
    `GERAL`+`prescricao`; `G027-01` → `opiniao`, logística de canal). **As outras 74 são
    exceção legítima** — o imperativo é do próprio autor saindo do material alheio
    (*"I would advise…"*, *"my general recommendation here is…"*). São **74 claims em
    `modo: prescricao` vindas de 19 vídeos**, listadas uma a uma em `GENERO.md` §6.
    A catraca foi atacada por mutação e morde: devolver `G020-17` a `prescricao` dá exit 1;
    promover uma claim de `G028`, que não está no mapa, dá `teto declarado é 0`. Recusar de saída derrubaria o build
    sobre elas, e a rodada que ligou a trava tinha proibição explícita de editar claim.
    O piso não é necessariamente zero; o que a catraca garante é que ninguém abaixe o
    número sem abrir as claims, e que ele não suba sozinho.
18. ~~**`research/kb/PROTOCOLO-EXTRACAO.md` não tem regra escrita para `narrativa` ×
    `anedota` × `fato` em material PESSOAL, e 17 dos 18 lotes relataram ter inventado a
    sua.**~~ **A REGRA FOI ESCRITA em 9/8/2026** — `PROTOCOLO-EXTRACAO.md`, secção "O teste
    de que tipo de coisa é": *quantas datas cabem nesta frase?* Nenhuma → `fato`, uma →
    `narrativa`, muitas → `pratica-pessoal`. A gaveta que faltava foi aberta e `anedota`
    foi fundida em `narrativa` (a fronteira entre as duas era tempo verbal, e nem isso
    segurou: 32 % de passado nas `narrativa` contra 48 % nas `anedota`). Decisão, recusas e
    tamanho em `research/kb/FRONTEIRA-MODO.md`.
    **A DÍVIDA CONTINUA DE PÉ, e é grande:** `pratica-pessoal` **não está no enumerado de
    `kb.mjs`** e nenhuma claim foi retagueada — de propósito, porque enumerado declarado e
    vazio é o que fez `scope: TERCEIRO` ser recusado (`ENUMERADOS.md` §2), e porque a
    medição da base estava rodando sobre `research/extract/` no dia. Onda 2: ~425 claims
    para `pratica-pessoal` (faixa 300–620, amostra à mão n=60, IC por
    `--ic`) mais 214 de fusão mecânica,
    a trava `pratica-pessoal` ⇒ `scope: PESSOAL` (`SCHEMA.md`, recusa 13) e a catraca
    `TETO_HABITUAL_SEM_PRATICA`. **Duas claims são exceção e estão nomeadas no
    `FRONTEIRA-MODO.md` §5.8: `V170-33` se parte (esconde uma `prescricao` `GERAL` de
    frequência de supino) e `V009-20` precisa do `scope` corrigido junto.** A lista de
    trabalho é gerada, não copiada:
    `node research/tools/candidatos-pratica-pessoal.mjs --tier A`.

19. **`ESTADO.md` §4 dizia "as 19 params de §3, com a lista pronta"; a contagem mecânica
    dá 52 params em 39 claims.** A lista do §3 era **copiada à mão dentro de um documento**
    — o defeito nº 3 no próprio inventário dos defeitos —, e duas famílias inteiras não
    estavam nela: **19 params de TAXA** (*"4 h/semana de cardio"* gravado como `4` com frame
    `horas`, ao lado de *"treino de 3 h"* gravado como `3` com frame `horas`: o `unit` guarda
    o `/semana`, mas `frame` é a gaveta que o consumidor lê) e **2 anos de calendário** a
    mais (`V019-02`, `V122-01`).
    **RESOLVIDO só o instrumento, e a dívida continua de pé:**
    `research/tools/params-gaveta-errada.mjs` torna a lista comando (`--ids`, `--json`).
    Ele é **detector, não verificador**, e está **fora do `check:kb` de propósito**: 31 dos
    52 não têm gaveta de destino, e travar contra um destino inexistente empurra o dado para
    fora da trava, que é o modo de falha nº 2.
    **Atualização de 9/8/2026 (onda 2): 50 dos 52 foram movidos, e a dívida CRESCEU.** Oito
    gavetas foram abertas em `kb.mjs`; 2 params saíram; frações em string viraram decimal.
    Mas a regra de TAXA do detector era estreita (olhava só `frame ∈ {min, seg, horas}`) e
    por isso reportava 19 — **a regra larga acha 111 params em 69 claims**: 68 em `series`
    (*"séries/semana"*), 18 em `lb`, 16 em `contagem`, 9 em `reps`. **Os 111 não foram
    movidos, e a recusa é justificada:** `series`, `reps` e `lb` estão em `FRAMES_DOSE`, e
    movê-los desligaria em silêncio o aviso de *"prescrição com dose e sem `conditions`"*
    para todos eles — o conserto apagando a trava, que é o modo de falha nº 4.
    **Quem fechar essa família mexe em `FRAMES_DOSE` no mesmo commit.**
    **O que continua sem desculpa:** `ano_calendario` e `indice_adimensional` reportam
    **zero** e podem virar recusa hoje a custo zero. A frase que dizia o contrário foi
    corrigida no `ESTADO.md`. Ver `ONDA-2B.md` §8.
20. **Gavetas abertas em 9/8 com ZERO uso: `pes`, `l`, `pct_XRM`, `grau_C`.** O enumerado
    cresceu e o dado não se mexeu — meio conserto que parece conserto inteiro no documento.
    `pes` foi aberta citando `G051-37` (*"com seis pés de altura"*), e `G051-37` continua sem
    param nenhum. `l` foi aberta citando `V112-22` (*"meio litro"* como `kg`), e `V112-22`
    continua em `kg`. Reproduz: `node research/tools/params-gaveta-errada.mjs` imprime a
    lista no rodapé.
21. **A catraca `TETO_HABITUAL_SEM_PRATICA` não existe, e a especificação que existia ficaria
    VERDE com ~300 claims de dívida.** Ela contava "Tier A que não está em `pratica-pessoal`",
    e o recall do detector medido **de fora** é **22 %** — retagar os 115 do Tier A (que é o
    que o `FRONTEIRA-MODO.md` §5.3 manda) zera a catraca e a congela lá para sempre, porque o
    universo é uma lista fixa de ids já tratados. Modo de falha nº 4 com o alvo **fora do
    campo de visão** em vez de apagado. **E o piso não é 0, é 9** (os falsos positivos
    nomeados no §4.3 têm de ficar), então "só desce" empurra contra o invariante
    `pratica-pessoal` = só dele. A especificação foi reescrita em `FRONTEIRA-MODO.md` §5.5,
    com a alternativa honesta ao lado: **não ter catraca e dizer que não tem**.
    Reproduz: `node research/tools/candidatos-pratica-pessoal.mjs --recall`.
22. **A auditoria por mutação do gate de dor é manual e não está no repositório.** Duas
    rodadas dela acharam, somadas, **15 travas mortas** em `check-pain-gate.mjs` — inclusive
    quatro da mesma raiz (*a trava media a constante contra ela mesma*) e um **falso positivo
    grave** na direção inversa, em que editar a tabela do §1.2 de propósito derrubava o
    `check:gate` com mensagens acusando o app. As 24 mutações estão escritas em prosa no
    `GATE-DOR.md` §9, com repro, e **ninguém as roda**. Falta o alvo `check:gate:mutantes`.
    **Escreva-o com o limite declarado no cabeçalho:** um alvo que aplica uma lista fixa de
    mutações prova a lista, não a trava.
23. **`buildWeekPayload` não tem cenário de comportamento.** Os 59 cenários exercitam
    `buildWeekDoc`, que recebe o `prev` pronto. A cobertura do encadeamento é (a) uma
    expressão regular sobre `documentBuilders.ts` — **trava de acoplamento** — e (b) a
    comparação de `gateLookbackWeeks` como VALOR contra a tabela, que fechou a parte da
    profundidade. Fechar o resto exige stub de `getSessionIndex`/`getWorkouts`, importados no
    topo do módulo.
24. **A contradição mais perigosa da base para este atleta não tem aresta, e não PODE ter
    hoje.** `V138-18`/`V138-19`/`V138-20` prescrevem reabilitar **treinando com dor de 2 a
    4/10**; o `PROGRAMA.md` §1.2 manda **congelar a 2/10 no peitoral**. As duas estão certas
    nos seus contextos. Mas `conflicts` liga **claim a claim**, e o gate do app **não é uma
    claim** — a base não tem como registrar uma contradição com o programa. Bloqueado por
    `tier U = 0` (`ONDA-2B.md` §6): registrar o gate como claim do atleta dá o alvo.
    **CONTINUA ABERTA em 9/8/2026, e o passe do cluster de dor a piorou de um jeito
    específico:** faltando o alvo certo, ele registrou `V001-06 ↔ V138-19` como
    contradição — e essas duas são **compatíveis** (*"2/10"* e *"2 a 4/10"*, do mesmo autor,
    uma mais precisa que a outra: 2 pertence a [2,4]). A colisão real é V138-19 contra o
    `PROGRAMA.md` §1.2, e ela continua sem como ser escrita. **Aresta a remover no
    `ONDA-2B.md` §4.4** — contradição inventada ensina a base a duvidar de duas afirmações
    consistentes, e é exatamente o custo que a onda mandava vigiar.
    Reproduz: `node research/tools/check-evidence.mjs V138-18` — continua sem `conflita:`,
    e **também sem `condições:`** sendo `GERAL`+`prescricao` (ver §8.28).
25. ~~**O §2 afirmava que "os passos 2 e 5 ainda não aceitam `--source`".**~~ **RESOLVIDO
    em 9/8/2026** — era falso nos dois: o passo 2 aceita desde o conserto do §8.2 (e o
    `check:kb` roda `verify-manifest.mjs` nas duas fontes), e o passo 5 **não deve** aceitar,
    porque `check-claims.mjs` resolve `src` contra a união dos manifestos de propósito. Uma
    frase sobre o código que ninguém executou, no arquivo que cataloga esse defeito.
26. **`PROGRAMA.md` §1.2 declara um gatilho que o app não tem como receber:** a linha de
    encerrar sessão é *"≥4/10 **ou estiramento agudo**"*, e `estiramento agudo` **não tem
    campo na pesquisa**. Hoje ele só chega ao sistema se o atleta também marcar intensidade.
    É a única célula da tabela sem trava possível, e o `check:gate` não pode cobri-la sem que
    o campo exista. Detalhe em `GATE-DOR.md` §5.2.

---

**Itens 27–35 entraram em 9/8/2026, no fechamento da onda 2A.** Sete deles foram achados
por um ataque independente e **reconferidos por mutação nesta árvore** antes de serem
escritos aqui — copiar acusação de relatório sem reproduzir é o modo de falha nº 1, e este
arquivo não pode ser o lugar onde ele acontece. O trabalho está em `research/kb/ONDA-2B.md`.

27. **`TETO_VIZINHANCA` é os dois lados da comparação — a trava que se testa a si mesma
    (modo de falha nº 4), no arquivo que cita esse modo de falha.**
    `check-canarios.mjs:85` importa a constante de `busca.mjs:103`, passa
    `teto: TETO_VIZINHANCA` para `recuperar()` (linha 379) **e** escreve
    `dentro das ${TETO_VIZINHANCA} primeiras` na mensagem de falha (linha 398).
    Reproduz (rodado e revertido em 9/8): trocar `= 40` por `= 400` — exatamente o que o
    comentário de `busca.mjs:500-501` proíbe (*"achado no lugar 400 não é achado"*) —
    e `npm run check:kb` sai **0**, `npm run build` sai **0**, nenhum canário pisca.
    O limite tem de ser dado do `CANARIOS.json`, não constante da ferramenta que ele mede.
28. **Quatro claims que autorizam treinar dentro da dor continuam sem `conditions`, e uma
    delas é a autorização definicional.** O `DOR-E-TREINO.md` §2 declara nove; §4.1 trata
    cinco. `V138-08`, `V138-13`, `V138-24` e **`V138-18`** ficaram sem aresta e sem menção
    em §4, §7 ou §10. V138-18 é `tier R · GERAL · prescricao` — *"reduz o peso até o ponto
    em que se sente ALGUMA DOR mas não se sente pior na sessão seguinte"* — e é o limiar
    que V138-04 e V138-22 citam por id. Mais dois irmãos que a varredura perdeu:
    **`V138-03`** (perdida por conjugação: o termo era `keep moving`, o verbatim diz
    `keepING moving`) e **`V108-29`** (alta por tolerância, sem critério de revisão).
    Reproduz: `node research/tools/check-evidence.mjs --topic dor --modo prescricao
    --scope GERAL --limit 0` → 25 claims, **10 sem nenhuma aresta**, V138-18 entre elas.
29. **A trava de dose de dor ampliou o eixo do FRAME e deixou aberto o eixo do MODO —
    modo de falha nº 2 dentro do passe que o cita.** `escala_dor` entrou em `FRAMES_DOSE`
    (`kb.mjs:322`), mas o predicado de `check-claims.mjs:346` continua exigindo
    `c.modo === 'prescricao'` — e `V138-19` (limiar *"2 a 4"*/10, quatro params
    `escala_dor`, a claim que colide de frente com o `≥4/10 encerra a sessão` do §1.2) é
    `modo: opiniao`. O `DOR-E-TREINO.md` §5 afirma cobrir *"qualquer claim futura que
    prescreva um número de dor sem condição"*, e não cobre.
    Reproduz: apagar `conditions` de V138-19 → o contador fica em `23×`; com V001-06
    (que é `prescricao`) vai a `24×`.
30. **A direção de `conflicts` não está declarada em lugar nenhum e não tem trava.**
    `SCHEMA.md:77` só diz *"opcional. Vira aresta no ledger de contradições"*. A base tem
    **8 arestas de mão dupla e 40 de mão única**, e nada diz qual é a certa — o próximo
    agente copia a do vizinho (modo de falha nº 1). Pior, a propriedade de segurança
    apodrece em silêncio: apagar `conflicts` de `V027-25` deixa `check:kb` em **exit 0**, e
    a claim volta a sair sem `conflita` enquanto V079-34/V138-01/V138-20 continuam
    apontando para ela — mão única esconde do lado perigoso.
31. **A PRECISÃO da camada de recuperação não é medida por nada, e já regrediu a zero em
    consultas comuns.** `expandirPorVocabulario` disparava a seção inteira do
    `VOCABULARIO.md` quando **uma** palavra de 4+ letras de um termo aparecia na consulta.
    Medido: `--busca "quantas horas de sono por semana"` devolvia **0 de 40** claims sobre
    sono (a base tem 62 para `/sono/`) e punha **V170-34/V170-33 — supinar seis dias por
    semana — em 1º e 2º**; idem para calorias, corte de peso e `deload` (via `## lesao`,
    porque `load management` contém `load`).
    **CONSERTADO em 9/8** (`busca.mjs:508-545`: exige **todas** as palavras longas do
    termo, cada uma como palavra inteira; palavras curtas ficam de fora, então
    `quantas séries por muscle` continua achando). ~~**A divergência que fica aberta é que
    nada trava o conserto:** reverter `every` para `some` passa verde em `check:kb`, em
    `busca.test.mjs` e nos 19 canários. Falta a quinta família de canário,
    `ausente-injetado`.~~ **RESOLVIDO em 10/8** — não pela família nova que este item
    propunha, e sim no lugar onde o defeito mora: o campo `tambemPelaBuscaLivre` no
    `ROTAS.json` faz os mesmos `proibidos` de T09/T10/T11 serem cobrados **também** contra
    `recuperar()`, que é a porta que `--busca` usa. Reconferido nesta árvore:
    `sed -i '' 's/longas.every/longas.some/' research/tools/busca.mjs` →
    `check-rotas.mjs` **exit 1** nomeando V170-34; revertido, exit 0.
32. **O aviso de alargamento de filtro pode ser apagado da tela sem que C19 reclame — o
    canário não testa o mecanismo pelo qual ele existe.** Reproduz (rodado e revertido):
    remover `...alargamento.flatMap((a) => a.amostra.map((c) => c.id)),` de `idsMostrados`
    (`busca.mjs:641`) → `npm run check:kb` **exit 0**. V033-03/04/05 chegam pela vizinhança
    de qualquer jeito, então a união achatada não distingue por onde o id chegou.
    **Agrava:** a amostra do banner é por **ordem de arquivo**, não por relevância
    (`alargarFiltro`, `revela.slice(0, teto)`), então `--grep "RPE" --modo prescricao
    --scope GERAL` diz *"escondem 185 claim(s)"* e lista oito ids de `review-de-programa`,
    nenhum útil. **E a `buscaCega` de C19 é `2 a 3%`** — a consulta que já contém a
    resposta; a Q11 medida não digitou isso, e é por não saber o número que ela concluiu
    que a base não o tinha.
33. **`ONDA-2.md` não foi tocado e agora contradiz `ESTADO.md` e `ENUMERADOS.md` em
    silêncio — modo de falha nº 3, no documento que carrega os critérios de aceite.**
    Ele continua declarando como definição de pronto *"`params-gaveta-errada.mjs` imprime
    **zero** achados"* e *"cada regra do detector vira uma recusa de `check-claims.mjs` e
    este arquivo é apagado"*. O detector imprime **111**, o arquivo existe, nenhuma regra
    virou recusa, e a decisão nova (TAXA precisa de `FRAMES_DOSE` no mesmo commit) foi
    escrita nos outros dois arquivos e não neste. Quem ler amanhã acha que o passe falhou —
    ou apaga o detector para "fechar" o item.
    Reproduz: `git status --short research/kb/ONDA-2.md` (vazio) e `sed -n '276,283p'
    research/kb/ONDA-2.md` contra `node research/tools/params-gaveta-errada.mjs | grep total`.
34. **A guarda `ABERTAS_EM_9_8` não cobre as gavetas do passe que a editou.**
    `params-gaveta-errada.mjs:277` lista 13 frames da onda anterior e **nenhuma** das oito
    abertas em 9/8 (`ano_calendario`, `indice_adimensional`, `horas_semana`, `horas_dia`,
    `min_semana`, `min_dia`, `lb_semana`, `MET_min_semana`) — e o arquivo foi editado no
    mesmo passe. O comentário logo acima diz *"é a contraprova barata de que o passe de
    reparo não aconteceu"*, e ela hoje mente sobre o próprio escopo. Não há defeito vivo,
    mas **três dessas gavetas têm exatamente UM usuário**: apagar essa claim mata a gaveta
    e a checagem que existe para acusar isso continua muda. Modo de falha nº 4 na guarda.
35. **`MEDICAO-02.md` §6.1 traz duas afirmações que o trabalho posterior provou falsas, e é
    esse arquivo que vai ser citado.** (a) *"as quatro SEM `conditions` registradas"* — era
    falso **no commit que a publicou** (`f19c304`): `V138-20` já tinha `["V138-18"]` e
    `V079-32` já tinha `["V079-33","V079-34"]`; sem condição estavam **duas**. (b) O
    agravante está **com o sinal invertido**: não é a base que diverge do `PROGRAMA.md`, é
    o `PROGRAMA.md` que erra o rótulo — o verbatim de [R79] é *"…is a good amount to push
    at though ultimately **adjust to what you need**"*, endereçado ao ouvinte, e o `GERAL`
    da base está certo (o `@03:35` também aponta um bloco antes: está em `[03:47]`).
    O conserto ficou só no `DOR-E-TREINO.md` §8, sem ponteiro no arquivo errado.
    **Corrija com nota datada ao lado, não por cima:** é um relatório de medição, e apagar
    a frase apaga o rastro de que ela foi citada assim.
36. ~~**A camada de recuperação não acha o que a base tem, e o defeito dominante é de
    ROTEAMENTO — 7 de 18.**~~ **RESOLVIDO em 11/8/2026, e remedido em 12/8** — o
    roteamento deixou de casar a pergunta contra o CORPUS e passou a casá-la contra o
    **vocabulário de entrada na voz do atleta** (`research/kb/GLOSSARIO-TOPICOS.json`,
    74 gavetas, 1.988 termos, escrito por oito agentes). O número saiu de **7 de 18** para
    **1 de 18** (só o P10), e as gavetas abertas com a resposta dentro foram de 5 para 11.
    O P16 citado abaixo agora abre `cardio` em 2º com 0,74 e `peso-corporal` cai para 4º.
    **O que NÃO foi resolvido é a outra metade e continua aberta na 39:** `0 de 18`
    devolvem TODOS os ids — isso é SOTERRAMENTO, ordenação dentro do tópico, e ficou fora
    do escopo daquela onda de propósito. O placar sai a cada
    `node research/tools/check-canarios.mjs`. O texto original fica abaixo porque a
    lição — *tela cheia e plausível é o pior desfecho* — não fecha com o item.
    Medido em 10/8 pelos canários `presente-escondido` P01–P18 de
    `research/kb/CANARIOS.json`, com as perguntas escritas na **voz do atleta**: **0 de 18**
    devolvem todos os ids que respondem, **3 de 18** devolvem algum, e em **7 de 18**
    (P02, P06, P09, P10, P14, P15, P16) **nenhum tópico roteado contém um id esperado** —
    ordenar melhor não alcança uma claim que não está no conjunto aberto. O pior é o
    **P16**: `levantar peso já conta como exercício pro coração` roteia para
    `peso-corporal` com 0,73 (piso 0,65) porque o `peso` de *levantar peso* foi lido como
    peso corporal, `cardio` (230+ claims, V013-04/05/06 respondem exatamente isso) nunca
    abre, e a tela sai cheia e plausível — o lixo que a família `nao-mapeia` existe para
    proibir. **Não é falta de conteúdo**, e a divergência é entre o que o `RECUPERACAO.md`
    §13 dava a entender e o que a camada faz com uma pergunta que não contém a palavra da
    resposta. Reproduz:
    `node research/tools/check-evidence.mjs --pergunta "levantar peso já conta como exercício pro coração"`.
    Os canários estão escritos e vermelhos; o conserto é o item 0 da `ONDA-2C.md`.
37. ~~**O vocabulário do SINTOMA não alcança a gaveta `dor`, e a tela não avisa.**~~
    **RESOLVIDO nas duas metades — a primeira em 11/8, a segunda em 12/8/2026.**
    (a) `fisgada` entrou no glossário de entrada como termo de `dor` e de `lesao`, e a
    pergunta da fisgada agora abre `dor` em 3º (1,64): **V079-34 sai pela rota e V027-23
    pela página ao lado.** (b) A tela deixou de ser muda: `check-evidence.mjs` imprime
    **GAVETAS QUE PONTUARAM E NÃO ABRIRAM**, e nesta pergunta ela nomeia `lesao` (0,74,
    acima do piso, perdeu a vaga no corte de 40 % do 1º lugar), com o comando para abrir.
    **Fica aberto, e virou a 40:** V001-06, V138-19 e V086-21 continuam fora da tela mesmo
    com `dor` aberta — é soterramento, não roteamento —, e `autorregulacao` (que etiqueta
    duas delas) não é nomeada nem pelo aviso, porque não pontuou sozinha em canal nenhum.
    O texto original fica abaixo pela mesma razão do item 36.
    Medido:
    `--pergunta "fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"`
    devolve 40 claims de peito/supino e **nenhuma** de V079-34, V001-06, V138-19, V086-21
    ou V027-23; `--busca` com a mesma frase idem. Trocando `fisgada` por `dor`, V079-34
    volta a sair com `+cond` e `!conflita`. **O perigo não é responder errado, é responder
    com ar de completa**: um agente lendo essa tela não vê sinal nenhum de que existe um
    limiar de 2–3/10 e ressalva do outro lado — para um atleta com o peitoral rompido há
    quatro meses. O `RECUPERACAO.md` §9.3 chamava isto de *"de outro dono"*; não é.
38. ~~**Duas mutações do roteador continuam passando verdes.**~~ **RESOLVIDO no mesmo
    passe, e não por trava escrita contra elas:** `FRACAO_DO_MELHOR 0.4 → 0.05` e o peso
    da rota **linear** em vez de ao quadrado passaram a dar exit 1 em
    `check-canarios.mjs`, porque afrouxar o roteamento move a medida dos 18 canários
    novos (P02 passa a abrir `dor`, P05 ganha `ombros`) e o registro acusa. **Das seis
    mutações conhecidas, nenhuma passa mais verde** — o que não é o mesmo que não haver
    uma sétima. Fica na lista porque a LIÇÃO continua aberta. Eram quatro no §16 do
    `RECUPERACAO.md` e a lista errava metade: `TETO_ROTEADO 40 → 400` e `PESO_AFIM 0.6 → 0`
    dão **vermelho** em `roteador.test.mjs`, e havia duas que ela não listava —
    `DETALHE_ROTEADO 8 → 0` e `PESO_NOME_COMPOSTO 1.2 → 0`, ambas **fechadas em 10/8**
    (`viaPaginaAoLado` no T05 e o caso T15 do `ROTAS.json`). **A lição vale mais que o
    item:** uma lista de buracos conhecidos escrita por quem fez o conserto não é medida.
    **E ela se repetiu, exatamente igual, em 11/8** — ver a 41.
39. ~~**O SOTERRAMENTO, e o MECANISMO dele, medido em 12/8/2026: a tela não tem cota por
    gaveta.**~~ **FECHADA em 13/8/2026 — ver o parágrafo final deste item.** É a segunda metade da 36 e não se mexeu entre 10/8 e 12/8. **`0 de 18`
    canários públicos e `0 de 12` cegos devolvem os ids esperados**, e o terceiro ataque
    cego mostrou que em **10 dos 12** a gaveta que contém a resposta ABRIU e a resposta
    não chegou à tela — só B02 e B05 são roteamento. Forçando a gaveta com `--topic`,
    **9 dos 12 devolvem na hora**.
    **A causa: as 40 vagas da tela são preenchidas pelo ranking GLOBAL, então cada gaveta
    leva vagas na proporção do próprio tamanho.** Medido por caso, `gaveta(tamanho):vagas`:
    B07 `competicao(457):36  equipamento(199):4` — a proibição que desclassifica na
    inspeção (F001-94) mora em `equipamento`; B11 `supino(694):26  agacho(990):24
    ordem-exercicio(29):1` — as DUAS respostas moram em `ordem-exercicio`; B12
    `agacho(990):39` com a resposta em `sapato(18)`; a fisgada `supino(694):33  dor(119):5`
    com as cinco claims do limiar em `dor`.
    **O conserto tem nome: uma gaveta roteada acima do piso precisa de vagas garantidas
    independentes do tamanho dela, e o bloco de detalhe de 8 precisa reservar espaço para
    a gaveta MENOR, não para a maior.** Enquanto isso não existir, consertar roteamento
    entrega zero — e entregou. Não confundir com falta de conteúdo: os ids existem, estão
    conferidos, e o `check-canarios.mjs` imprime os números por conjunto a cada execução.
    É o item 0 da `ONDA-2C.md`.
    **REMEDIDA EM 12/8/2026 (noite), contra o conjunto cego NOVO D01–D12, e o número
    PIOROU: soterramento de 10 para 11 de 12.** A cota por gaveta foi construída
    (`vagasPorGaveta` em `roteador.mjs`) e produziu ganho real e minúsculo — os doze cegos
    saem de **0 de 12 / 0 de 33 ids** para **2 de 12 / 3 de 33**
    (`node research/tools/auditoria/legado.mjs`). **O conserto nomeado acima não era o
    conserto suficiente**: trocou *"a gaveta grande come tudo"* por *"as vagas se repartem
    entre gavetas erradas"*, que é a §8.48. A parte desta divergência que a onda 2D de
    fato fechou é o mecanismo de tamanho (`agacho(990)` não leva mais 39 vagas); a parte
    que continua aberta é a que o atleta sente.
    **REMEDIDA EM 13/8/2026, contra o conjunto cego NOVO E01–E12, e a metade que era desta
    divergência FECHOU: soterramento de 11 de 12 para 9 de 12, e a metade de ROTEAMENTO
    foi a ZERO.** Em **12 de 12** a rota abre uma gaveta que CONTÉM a resposta etiquetada
    (`semGaveta` = 0 no `check-canarios.mjs`). A tela por seção da onda 2E matou a
    repartição soma-zero: `montarSecaoDeGaveta` não recebe as outras gavetas, então
    `agacho(990)` não come vaga de `sapato(18)` porque não há vaga comum a comer. **O que
    esta divergência descrevia — a tela sem cota por gaveta — deixou de existir.** O que
    restou não é dela: é a §8.50, ordenação DENTRO da gaveta. **FECHADA, e o trabalho
    migrou para a 50.**
40. **Gaveta que a pergunta não toca por canal nenhum é invisível às duas portas.**
    `autorregulacao` etiqueta V001-06 e V138-19 e não aparece na pergunta da fisgada nem
    no aviso novo de gavetas não abertas, porque não pontuou sozinha — e o aviso usa, de
    propósito, a mesma condição que `rotear()` usa para o bônus de `naoConfundirCom`
    (*levanta um candidato, nunca inventa um*). Afrouxar só no lado da tela criaria um
    segundo critério para divergir do primeiro. Aberta e escrita no `RECUPERACAO.md` §21.4.
41. **A lição da 38 se repetiu, e a frase que dizia o contrário estava no `RECUPERACAO.md`.**
    O §22.1 daquele arquivo afirmava *"Cada constante desta camada foi mutada e o
    `check:kb` rodado. Nenhuma sobreviveu."* A varredura de 12/8 mutou as **29**
    constantes de `roteador.mjs` e `glossario.mjs` **nos dois sentidos** — 56 mutações —
    e achou **6 verdes**, entre elas `FRACAO_DA_PALAVRA_GLOSSARIO 0.6 → 0`, que junta
    `powerlifting` com `powerbuilding`. Uma foi fechada com canário; as outras cinco estão
    nomeadas com o número no §22.2, e **todas as seis são no sentido de AFROUXAR** — o
    mesmo sentido de `TETO_VIZINHANCA 40 → 400` (§8.31). **A lição, terceira vez escrita:
    cobertura de mutação declarada por quem fez o conserto não é cobertura de mutação.**
    **Reconferido às cegas em 12/8:** sobrevivem **cinco**, não seis — a correção de
    `FRACAO_DA_PALAVRA_GLOSSARIO 0.6 → 0` é real e aquela mutação hoje é vermelha.
    Continuam verdes `DETALHE_ROTEADO 8→80`, `DIFERENCA_MAXIMA_GLOSSARIO 5→50`,
    `MIN_TERMOS 10→0`, `PESO_NOME_COMPOSTO 1.2→12` e `TETO_PARAM 12→120`. O subconjunto de
    checks usado é suficiente: `grep -l 'roteador.mjs\|glossario.mjs' research/tools/*.mjs`
    mostra que nenhum outro passo do `check:kb` importa esses módulos.
    **REMEDIDA EM 12/8/2026 (noite), e desta vez pela ferramenta e não à mão:**
    `node research/tools/mutacao-entrada.mjs --constantes` roda as 18 mutações contra o
    gate real e **18 de 18 morrem** — as cinco listadas acima estão todas fechadas,
    inclusive `TETO_PARAM 12→120`, que morre hoje em `roteador.test.mjs`. **E o relato de
    travas da onda 2D contém um achado FALSO na direção oposta:** ele declarou
    `DETALHE_ROTEADO 8→80` como *"mutante equivalente, 0 de 67 perguntas com saída
    diferente"*. Medido mutando `roteador.mjs` e rodando
    `node research/tools/medir-alocacao.mjs` nos dois estados, com restauração conferida
    por `cmp`: a mutação muda a **mediana da tela de 34 para 40 e o máximo de 56 para 60
    em TODAS as linhas da varredura**, e muda a contagem de ids. Não é equivalente, e ela
    morre no gate (`alocacao.test.mjs`). A
    lição, quarta vez escrita, agora nos dois sentidos: **cobertura de mutação declarada
    por quem fez o conserto não é cobertura, e "mutante equivalente" declarado por quem
    fez o conserto também não é.** Sobrevivem hoje **três**, todas no ledger e todas
    dívida honesta, nomeadas no `RECUPERACAO.md` §25.8. **Aberta**, porque a lição não
    fecha com o item.
42. **`npm run lint` não cobre `research/tools/`.** O `eslint.config.js` tem um bloco só,
    `files: ['**/*.{ts,tsx}']`, então nenhum dos ~30 `.mjs` do pipeline é lintado. Foi
    assim que `carregarRotas()` ficou exportada e sem chamador nenhum, e que o import
    `raiz` de `glossario.mjs` ficou sem uso — os dois removidos em 12/8, os dois achados à
    mão. Import morto e função órfã são o cheiro de edição interrompida, que é exatamente
    o que se procura depois de um agente morrer no meio de um passe.
43. ~~**26 das 74 gavetas do vocabulário de entrada não eram testadas por nada.**~~
    **RESOLVIDO em 12/8/2026, no mesmo passe que o mediu.** O terceiro ataque cego provou
    contra o gate REAL que trocar a lista `entrada` inteira de um tópico por dez strings
    sem sentido (`zzqa`…`zzqj`), regerar o artefato e rodar `npm run check:kb` e
    `npm run check:gate` deixava **26 tópicos em exit 0** — entre eles
    `descanso-entre-series`, que é a gaveta cuja falha criou esta camada, `genetica`,
    `cinto`, `sono`, `rpe`, `mobilidade`, `profundidade`, `training-max`, `recuperacao`,
    `terra`, `intensidade` e `comandos-ipf`. **Trinta e cinco por cento do artefato da
    onda do glossário não tinha trava**: as quatro travas de `check-glossario.mjs` conferem
    FORMA (nome dentro da lista fechada, glosa presente, colisão declarada, desempate
    co-etiquetado), e forma sobrevive intacta a uma lista de lixo. Modo de falha nº 4 em
    escala nova. **O conserto** é a quinta trava do mesmo arquivo, a **âncora no corpus**:
    cada termo de entrada é confrontado com o texto das claims que a BASE etiquetou naquela
    gaveta — dado independente, extraído meses antes do glossário e que nenhuma edição dele
    move. Piso `FRACAO_MINIMA_ANCORADA = 0.35`; medido, a mediana ancora 92 % e a pior
    gaveta é `dor` com 53 %. **Verificado nos dois sentidos:** varredura das 74 gavetas
    trocando `entrada` por lixo → **0 de 74 ficam verdes** (eram 26), arquivo restaurado
    byte a byte; e o caminho real do ataque, ponta a ponta, mutando
    `research/kb/entrada/lote-6.json` e rodando `build-glossario.mjs` + `npm run check:kb`
    → **exit 1**.
    **O RESIDUAL, que fica escrito porque a lição não fecha com o item:** o piso é baixo de
    propósito e **não deve subir**. Um vocabulário de entrada bom é justamente o que NÃO
    está no corpus — `fisgada` não aparece em nenhuma das 6.912 claims e é o termo mais
    importante do arquivo. Subir o piso inverteria o propósito do artefato e faria o
    próximo autor encher a lista com jargão da base, que é o modo de falha nº 2 desta casa.
    E a trava **recusa lixo, não recusa uma lista de termos reais porém ERRADOS** para
    aquela gaveta: trocar a entrada de `sono` pela de `fadiga` passa aqui. Quem cobra
    acerto de roteamento continua sendo `check-rotas.mjs` e os canários.
44. ~~**Duas definições de "tela" na mesma camada** (modo de falha nº 3).~~ **RESOLVIDA em
    13/8/2026 — ver o fim deste item.** `CANARIOS.json`
    declara `tetoDeTela: 40` e o `check-canarios.mjs` mede `telaDe(r).slice(0, 40)`; o
    `check-evidence.mjs` imprime **68 claims distintas** (40 roteadas + canal de param +
    página ao lado). Reproduz:
    `node research/tools/check-evidence.mjs --pergunta "..." | grep -cE '^ {4,8}[VGF][0-9]{3}-[0-9]{2}'`
    → 68. **Neste momento o placar não muda com a régua** — 8/18 e 0/12 valem para as duas
    —, mas **a divergência já produziu um erro publicado**: foi contando pela tela do CLI
    que o relatório de verificação de 12/8 afirmou que duas das cinco claims da fisgada
    chegavam à tela quando chega **uma** (V079-34 em 36º de 40; V027-23 na posição 56).
    Corrigido no `RECUPERACAO.md` §20.1, com o texto original riscado. A próxima medição
    pode mudar em silêncio enquanto as duas réguas existirem sem uma dizer o nome da outra.
    **RESOLVIDA em 13/8/2026, e conferida nos DOIS sentidos por quem não a construiu.** Há
    UMA definição, `telaDaResposta()` em `roteador.mjs`: a CLI imprime exatamente ela e
    toda trava conta exatamente ela. Em 17 perguntas, **0 ids da tela ausentes da saída do
    processo e 0 ids impressos fora da tela** — as únicas divergências aparentes eram a
    prosa fixa que cita V033-03 e os campos `condicoes:`/`conflita:` de claims que já
    estão na tela, conferidas uma a uma antes de não serem chamadas de furo. Os NÚMEROS
    continuam vindo do JSON do canário (`tela: { porSecao, secoes }`), então inflar
    `TETO_DA_SECAO` na ferramenta não muda uma linha do que as travas cobram.
    Reprodução: `node research/tools/auditoria-onda2f/tela.mjs`.
45. **O painel `GAVETAS QUE PONTUARAM E NÃO ABRIRAM` nomeia uma gaveta útil em 2 de 12, e
    em 0 das 2 falhas de roteamento.** Ele é instrumento novo e real — antes a tela saía
    cheia e muda —, mas nos doze cegos só imprime gaveta que de fato contém a resposta em
    B08 (`progressao`) e B12 (`tecnica`). Em B02 imprime `selecao-exercicio` e `tier-list`
    (a resposta está em `lesao`/`erro-comum`/`volume`); em B05 imprime
    `proximidade-da-falha` e `intensidade` (a resposta está em `descanso-entre-series`).
    **E o filtro que existe para tirar ruído engoliu sinal:** *"só gaveta que pontuou
    sozinha"* — a mesma condição que `rotear()` usa para o bônus de `naoConfundirCom` —
    deixou de fora `mentalidade` em B03 e `lesao` em B09, que pontuaram e contêm a
    resposta. Afrouxar só no lado da tela criaria um segundo critério para divergir do
    primeiro (é a mesma tensão da 40), então isto fica **aberto e escrito**, não
    consertado por palpite.
46. **Precisão: 32 de 33 perguntas devolvem exatamente 40 claims — não existe resposta
    estreita.** `node research/tools/check-evidence.mjs --pergunta "o cinto pode ter mais
    de 13 mm de espessura na IPF"` é uma pergunta de sim/não cuja resposta é UMA claim de
    regulamento, e ela abre 5 gavetas e devolve 40 claims. O topo é bom (F001-84 em 2º),
    e é justamente isso que torna o problema invisível: **o atleta não tem como distinguir
    "achou" de "encheu"**, porque a tela é sempre a mesma tela cheia. É a mesma superfície
    que produz a doença da 39 pelo outro lado, e o conserto provavelmente é o mesmo: se as
    vagas fossem por gaveta e a gaveta pequena tivesse cota, uma pergunta que casa uma
    gaveta pequena devolveria pouco. **Fora de domínio passa:** 3 de 3 (bolo de cenoura,
    nginx/ssl, embreagem de carro) dizem `NÃO MAPEIA` e separam corretamente *fora de
    domínio* de *sem assunto*.
    **REMEDIDA EM 12/8/2026 (noite): a previsão acima estava certa e o conserto funcionou
    em parte.** `node research/tools/auditoria/estreitas.mjs` — a tela MEDIANA caiu de 40
    para **34**, e **6 de 10** perguntas de resposta única devolvem menos de 35 linhas.
    **Fica aberto o que não encolheu, e são dois casos com diagnóstico oposto:** *"quanto
    tempo de descanso entre as séries de agacho pesado"* abre UMA gaveta de 12 claims e
    ainda devolve **40 linhas** — 28 delas de `param` e página ao lado, ou seja, a cota por
    gaveta encolheu a rota e os outros canais preencheram o buraco; e *"com quanta
    antecedência eu tenho que escolher a categoria de peso"* devolve 40 abrindo `bulking`
    e `cutting`, que é gaveta errada, não tela larga. **Aberta.**
47. ~~**O placar da porta nova somava conjuntos, e a soma escondia a medida.**~~
    **RESOLVIDO em 12/8/2026, no mesmo passe que o abriu.** No instante em que os 12
    canários CEGOS entraram ao lado dos 18 PÚBLICOS, o placar único do
    `check-canarios.mjs` passou a imprimir `8 de 30 devolvem ALGUM id` — que é verdade e é
    uma mentira ao mesmo tempo, porque é a média de **8 de 18** (conjunto que o construtor
    enxergava) com **0 de 12** (conjunto que ele não viu). **A média apaga exatamente a
    distância entre os dois, que é a única coisa que um conjunto cego mede.** Modo de falha
    nº 5 executado pela ferramenta que existe para pegar esse modo de falha. Conserto:
    `conjunto` é campo obrigatório em todo canário da porta nova, o placar sai por
    conjunto, e o total só sai depois de todos eles e nunca sozinho. Dois casos novos em
    `check-canarios.test.mjs` (55 agora, eram 53) fixam os dois lados: a recusa quando o
    campo falta, e a impressão de DOIS placares quando há dois conjuntos.
    **A lição, que não fecha com o item:** cegueira não é propriedade permanente de um
    canário. **Conjunto de teste publicado vira conjunto de treino** — os P## eram cegos em
    10/8 e estavam absorvidos em 12/8; os B## acabam de ser publicados e estão queimados a
    partir deste commit. Por isso o nome do conjunto carrega a data em que foi escrito: um
    número medido com um conjunto que já foi lido não é um número cego, e nada além da data
    avisa disso.
48. **A ALOCAÇÃO É SOMA ZERO: abrir a gaveta certa MAIS uma vizinha devolve menos do que
    abrir só a certa — e nenhuma trava vê isso.** Achado pela auditoria cega de 12/8
    (noite), com `node research/tools/auditoria/diagnostico.mjs`:
    `--topic convencional` devolve as 3 claims do D05 e `--topic convencional sumo terra`
    devolve **ZERO**; `--topic comandos-ipf` devolve F001-11 e `--topic comandos-ipf
    agacho` devolve **ZERO**. A vaga é TETO e a sobra não volta ao bolo (é decisão
    deliberada da onda 2D, `RECUPERACAO.md` §25), então cada gaveta a mais divide o
    orçamento e nenhuma delas recebe o suficiente para chegar à claim que responde.
    **É a causa direta de o soterramento ter subido de 10 para 11 de 12** (§8.39): o
    roteador melhorou e passou a abrir MAIS gavetas certas, e abrir mais gavetas certas
    piorou a resposta. **Nenhum dos 21 casos de `alocacao.test.mjs` cobre isto**, porque
    todos medem UMA pergunta contra a alocação que ela produz, e nunca a mesma pergunta com
    N e com N+1 gavetas. O canário que falta é comparativo, não absoluto. **Aberta**, e é
    o item 0 da próxima onda junto com a 50.
49. ~~**`alocacao.test.mjs` afirmava `magra >= 3`, que é `PISO_VAGAS >= 3` reescrito como
    asserção.**~~ **A ASSERÇÃO FOI REMOVIDA em 12/8/2026 (noite); a ESCOLHA do valor fica
    aberta.** Modo de falha nº 4 desta casa dentro do arquivo escrito para provar que as
    constantes foram ganhas — e o arquivo abre com a frase *"nenhuma trava pode ler a
    constante que ela verifica"*. Duas medições o desmontam:
    `node research/tools/auditoria/piso.mjs` mostra que piso 1, 2, 3 e 4 devolvem as CINCO
    da fisgada nas MESMAS posições 13/18/36/38/39 — **o piso não muda a saída da pergunta
    em cujo bloco a asserção estava escrita**; e
    `node research/tools/medir-alocacao.mjs --pisos 1,2,3,4 --expoentes 3 --cotas 0` dá
    piso 1 = **63/160 ids, 18/65 completos** contra piso 3 = **62/160, 17/65**.
    **Nenhuma asserção nova foi posta no lugar, e isso é deliberado:** escrevi uma
    substituta ("toda gaveta aberta entrega ao menos uma linha"), mutei seis constantes
    contra ela e ela não ficou vermelha em nenhuma — **trava que não sabe morrer é
    decoração**. O arquivo tem 20 casos agora, eram 21.
    **`PISO_VAGAS` NÃO ficou descoberto**, e isto foi medido mutando `roteador.mjs` e
    restaurando com `cmp`: `3→1` e `3→0` morrem em `EXPOENTE_SURPRESA ↑` (`agacho` e
    `supino` caem para uma linha cada na pergunta ORDEM); `3→8` morre em
    `EXPOENTE_SURPRESA ↓` (G014-10 sai da tela). As duas são asserções de SAÍDA, com número
    diferente do da constante. **O que fica ABERTO é uma escolha, não uma lacuna:** a
    bancada prefere 1 e as travas de saída preferem 3, e reescolher o valor reescreve o
    registro medido dos 42 canários da porta nova — é onda própria, com conjunto cego
    próprio, e não se decide dentro do passe que a descobriu.
50. **SOTERRAMENTO DENTRO DA GAVETA CERTA: 5 de 33 ids não chegam nem com a gaveta certa
    forçada sozinha. É a doença seguinte, e ela é ORDENAÇÃO, não alocação.**
    `node research/tools/auditoria/vale-a-frota.mjs` força, uma de cada vez, cada gaveta que
    etiqueta algum id esperado: **28 de 33 ids (85 %) chegam** — para esses o que falta é
    VAGA, e a claim já está bem ordenada dentro da gaveta dela. Os outros cinco não chegam
    de jeito nenhum: **V008-10** (D03, em `sono`/`nutricao`/`recuperacao`), **V001-21** e
    **V001-22** (D09, em `dor`/`lesao`), **V001-24** e **V001-25** (D10, em
    `mentalidade`/`lesao`).
    **O D09 é o caso puro:** a camada abre UMA gaveta, a certa (`dor`, 119 claims), a tela
    sai com **35 das 40 vagas ocupadas** — sobra espaço — e as duas claims não aparecem nem
    forçando `dor`, nem forçando `lesao`. Nenhuma quantidade de vaga alcança uma claim que
    está abaixo do corte de relevância dentro da própria gaveta. **É esta divergência, e o
    número 28/5, que responde por escrito a pergunta do atleta sobre a frota de modelo
    barato** — ver `ONDA-2C.md` §0.3.
    **REMEDIDA EM 13/8/2026 sobre TODOS os 54 canários da porta nova, e ela passou a ser a
    divergência PRINCIPAL desta camada.** `node research/tools/auditoria-onda2f/contrato-ordenacao.mjs`
    força, para cada id, a gaveta em que ele está ETIQUETADO (nunca a "parecida") e mede a
    posição:

    | conjunto | teto 18 (o que o atleta vê) | teto 60 (gaveta forçada) |
    |---|---|---|
    | P01–P18 | 7/18 canários · 31/49 ids | 11/18 · 40/49 |
    | B01–B12 | 5/12 · 12/21 | 10/12 · 19/21 |
    | D01–D12 | 5/12 · 23/33 | 10/12 · 29/33 |
    | E01–E12 | 8/12 · 19/23 | 11/12 · 22/23 |
    | **os 54** | **25/54 · 85/126** | **42/54 · 110/126** |

    **O teto que vale é 18, não 60:** 60 mede um caminho que o atleta não percorre e
    esconde 17 das 29 reprovações. Casos nomeados por posição: **F001-79 em #78 de 152**
    em `equipamento`, **F001-30 em #35 de 335** em `setup`, **V015-12 em #34 de 57** em
    `sono`.
    **E a mesma medida dá o MECANISMO, por número:** na gaveta PEQUENA a resposta está no
    topo — `strap` #2 de 20, `carga-de-treino` #1 de 17, `cinto` #5 de 56, `mobilidade`
    #1 de 92 — e na GRANDE ela afunda. É a mesma diferença entre a gaveta que os três
    modelos escolhem (mediana **117** claims) e a que `PESO_CORPUS` escolhe (mediana
    **245**). **O conserto tem dois nomes: `ordenarNoTopico` e `PESO_CORPUS`**, e a trava
    é o CONTRATO DE ORDENAÇÃO do `RECUPERACAO.md` §28.1, que nasce reprovando em 29 de 54.
    **Aberta, e é a primeira da fila.**
51. ~~**A bancada que produziu o veredito da auditoria nascia em diretório `gitignored`.**~~
    **RESOLVIDO em 12/8/2026, no mesmo passe que a abriu.** Os onze arquivos de medição da
    auditoria cega foram escritos em `research/tools/scan/`, que está no `.gitignore` desde
    9/8 (linha `research/tools/scan/`, junto com sobra de `fetch-captions` interrompido).
    **O instrumento citado por um veredito publicado teria nascido perdido** — que é
    exatamente o erro que o relatório auditado dizia ter evitado ao tirar
    `medir-alocacao.mjs` de lá. Conserto: a bancada mora em **`research/tools/auditoria/`**,
    que é versionada, com os `import` inalterados (mesma profundidade de diretório). O
    `scan/` continua ignorado e continua sendo o lugar certo para rascunho descartável;
    **a regra que fica é a da memória do projeto: artefato caro nasce em `research/` e é
    commitado no mesmo dia.**
52. ~~**`grep` devolve ZERO linhas em silêncio em `research/tools/roteador.mjs`.**~~
    **RESOLVIDA em 13/8/2026 — ver o fim deste item.** O arquivo
    contém um byte NUL — separador deliberado de chave de memo, `${topico}\0${afins}` — e
    isso faz o `grep` tratar 93 KB de JavaScript como binário e não imprimir nada, **sem
    aviso e com exit 1**, que é indistinguível de "o símbolo não existe". A auditoria de
    12/8 perdeu três rodadas concluindo que as constantes de alocação não estavam no
    arquivo. **Use `grep -a`.** Isto vai enganar o próximo agente exatamente como enganou
    este, e a divergência fica aberta porque o conserto tem dois lados ruins: trocar o
    separador mexe em código quente por razão de ferramenta, e um comentário no topo do
    arquivo não é lido por quem está usando `grep` justamente para não abrir o arquivo.
    **RESOLVIDA em 13/8/2026:** o NUL literal virou a sequência de escape `\u0000`, com o
    mesmo comportamento em execução, e `secoes.test.mjs` recusa a volta dele. Conferido:
    **0 bytes NUL** em 1.708 linhas, e `grep` volta a achar `conjuntoDoTopico` (4
    ocorrências) no arquivo. O lado ruim que o item previa — mexer em código quente por
    razão de ferramenta — foi pago, e foi barato.
53. **AS VARREDURAS QUE ESCOLHERAM AS CONSTANTES NÃO REPRODUZEM.** O `RECUPERACAO.md` §25
    justifica cada constante com uma varredura, e nenhuma das três bate com a bancada que o
    próprio documento cita. Remedido em 12/8 (noite), **com os D01–D12 já dentro do
    `CANARIOS.json`**, o que muda o total de ids esperados de 127 para 160 e por isso os
    números absolutos não são comparáveis linha a linha com os do relatório — **as
    ORDENS entre os valores são, e é isso que decidiu as constantes**:

    | o que o §25 escreveu | `node research/tools/medir-alocacao.mjs` hoje | veredito |
    |---|---|---|
    | *"piso 1/2/3 empatam em 60 ids"* | `--pisos 1,2,3,4` → **63 / 62 / 62 / 60** ids e **18 / 17 / 17 / 16** completos | **falso** — não há empate e **piso 1 ganha em todas as colunas** |
    | *"expoente 1→57, 2→57, 3→60, 4→59, 5→60; 3 é o menor inteiro do platô"* | `--pisos 3 --expoentes 1,2,3,4,5` → **57 / 59 / 62 / 62 / 62** | **números falsos, conclusão certa** — não existe o vale em 4 que o texto usou como razão, e o platô real começa em 3 |
    | *"canários completos antes: 13"* | `--legado` → `"completos":14` | **falso** |

    **Os números de manchete reproduzem** (mediana 34, legado 48 ids); são as varreduras de
    calibração que não. É o modo de falha nº 3 na forma mais cara: **a prosa que justifica
    um número não é gerada pelo comando que produz o número**, e ninguém confere
    justificativa — o leitor confere a manchete. O caso do expoente é o mais instrutivo
    porque a escolha estava CERTA e a razão escrita estava ERRADA, e uma razão errada não
    protege a constante na próxima vez. **Aberta**, e o conserto não é reescrever a prosa:
    é a bancada imprimir a tabela em formato colável e o documento citar a saída literal,
    nunca um resumo dela.
54. **O canário do cinto continua REPROVADO, e o relatório exibiu uma terceira frase.**
    O `RECUPERACAO.md` §25 mostra *"o cinto pode ter mais de 13 mm de espessura na IPF"*
    devolvendo 31 linhas com F001-84 em 2º — e isso reproduz. Mas essa frase é uma das
    perguntas ESTREITAS da bancada `medir-alocacao.mjs`, **não é a frase que o gate cobra**.
    Medido com `node research/tools/auditoria/tres-saidas.mjs`: o **C01** do `CANARIOS.json`
    (*"Vou comprar cinto para competir na IPF. Que dimensões o regulamento permite?"*)
    devolve 30 linhas com F001-83 e F001-84 **os dois FORA**; e o **T14** do `ROTAS.json`
    só passa com `forcaTopico: cinto` e `tetoDeTela: 60`, entregando F001-83 em 49º e
    F001-84 em 51º. Sem `--topic`, com teto 40 ou 60, os dois ficam fora.
    **Exibir uma frase que passa ao lado de um canário que reprova é a forma mais barata de
    um relatório dizer sucesso sem sucesso** (modo de falha nº 5). **Aberta.**
55. **A PRECISÃO DO TOPO PIOROU, e o relatório disse que ela "não foi medida" quando ela
    estava a um comando.** `node research/tools/auditoria/topo.mjs`: dos **45** ids
    presentes nas duas telas (legado e atual), **17 DESCERAM e 11 subiram**, e a **posição
    MEDIANA da resposta certa foi de 6 para 8**. No topo da própria pergunta-vitrine, o 2º
    e o 3º lugar são lixo relevante-por-pouco — G007-28, tabela de volume de supino de um
    programa, e G022-31, cortar supino inclinado com halteres — enquanto V079-34, a claim
    do limiar de dor, está em 13º. **A tela ficou mais completa e menos precisa**, e isso é
    um preço, não um empate: numa tela de 40 o atleta lê as primeiras. Continua valendo o
    que a §8.31 já dizia — não há julgador medindo precisão, e `injecao` continua 0, mas
    `injecao` só pega gaveta errada aberta, não lixo relevante-por-pouco em 3º. **Aberta.**
56. **A camada acha quando o atleta JÁ SABE o vocabulário — que é o oposto do que ela
    promete.** `node research/tools/auditoria/parafrase.mjs`: a fisgada entrega **5 de 5**
    com a frase escrita e **3 de 5** sob paráfrase sem jargão (*"senti uma pontada nível 3
    de 10 no peito na 3ª série do supino com pausa, sigo o treino"*) — caem V138-19 e
    V086-21, que ocupavam as vagas 38 e 39 de 40. **O caso mais caro desta base tem margem
    de duas vagas e não sobrevive à reescrita.** Dos 12 casos medidos, 10 continuam
    devolvendo algum id e **P16 e P13 perdem TUDO**. E o contra-exemplo que fecha o
    diagnóstico: **D05 vai de 1/3 para 3/3 e D08 de 2/3 para 3/3 sob paráfrase**, porque a
    paráfrase usou a jargona da gaveta (`terra sumo`, `convencional`, `barra nas costas`).
    É exatamente o que os canários `presente-escondido` existem para reprovar. **Aberta.**
57. **BURACOS DE ROTEAMENTO COM "NÃO SEI" SILENCIOSO SOBRE FATO QUE A BASE TEM LITERAL.**
    `node research/tools/auditoria/estreitas.mjs`: *"quantos minutos tenho para entrar na
    plataforma depois de chamado"* devolve **0 linhas** e imprime *"esta pergunta não achou
    a gaveta"* — e **F001-130 traz `prazo_iniciar_tentativa = 1 min`**, tier O, verbatim
    literal do rulebook. *"quantas tentativas eu tenho em cada movimento"* devolve **2
    linhas** e **F001-119 traz `tentativas_por_movimento = 3`**. As duas são perguntas que
    um estreante faz na semana da primeira competição, as duas têm resposta tipada em
    `params`, e as duas caem abaixo do piso de 0.65 — em uma delas a gaveta mais próxima é
    `ordem-exercicio` com 0.55. **O aviso da tela está correto e é honesto** (*"isto não é
    'a base não tem'"*), o que não impede o atleta de sair sem a resposta. **Aberta.**
58. **A cobertura de mutação do vocabulário de entrada: o número que vale é o do PIOR
    ataque, e ele NÃO é o `lixo` 74/74 que ficou circulando.** O relato de travas da onda
    2D publica quatro ataques de `mutacao-entrada.mjs` e o resumo que se repetiu foi o
    `lixo`, que é o mais fácil deles. **Remedido em 12/8 à noite, com os D01–D12 já dentro
    do gate** (`node research/tools/mutacao-entrada.mjs --ataque <nome> --jobs 8`, ~6,5 min
    cada):

    | ataque | cobertura | quem pega | gavetas descobertas |
    |---|---|---|---|
    | `lixo` | **74/74** | 65 `check-glossario.test.mjs` · 4 `alocacao.test.mjs` · 3 `roteador.test.mjs` · 2 `build-glossario.mjs` | — |
    | `troca` | **71/74** | 46 `check-glossario.test.mjs` · 12 `check-canarios.mjs` · 7 `alocacao.test.mjs` · 4 `roteador.test.mjs` · 2 `build-glossario.mjs` | `agacho`, `aprendizado-motor`, `core` |

    **`enchimento` (74/74) e `enchimento-ptbr` (70/74) são números herdados do relato da
    onda 2D e NÃO foram re-medidos aqui** — estão escritos como herdados de propósito, para
    não virarem medida por repetição.
    **A `troca` melhorou de 68/74 para 71/74 sem ninguém tocar em trava**, e a razão é boa:
    absorver os doze canários cegos no `CANARIOS.json` fez o `check-canarios.mjs` passar a
    pegar 12 mutações, e três gavetas antes descobertas (`barra-alta`, `convencional`,
    `intensidade`) ficaram cobertas. **Canário cego absorvido é cobertura de mutação de
    graça** — é um argumento a mais para absorver conjunto cego no commit em que ele é
    publicado, em vez de deixá-lo em arquivo solto.
    **A ressalva que agrava, e ela foi confirmada:** **65 das 74** mortes do `lixo` vêm de
    `check-glossario.test.mjs`, cujo caso 1 é a MESMA regra de âncora que o
    `check-glossario.mjs` já roda no gate — a cobertura de 74/74 é **uma regra contada duas
    vezes**, e se ela cair caem as 74 juntas. Na `troca`, que é o ataque honesto, a
    dependência daquele arquivo cai para 46 de 71 e os canários entram no lugar.
    O conserto das três da `troca` não é trava e sim canário no `ROTAS.json`: nenhuma regra
    determinística chama de lixo um vocabulário de termos REAIS porém errados para a gaveta
    sem chamar `fisgada` de lixo também (é o residual já escrito na §8.43). **Aberta.**

59. **A INVARIANTE DE NÃO-DILUIÇÃO É UMA TAUTOLOGIA, e o banner que ela justifica é
    falso.** `research/tools/secoes.test.mjs` varia `tela.secoes` de 1 a 6 e conclui, em
    1.644 comparações, que acrescentar uma gaveta nunca remove um id de outra seção. Mas
    `responder()` passa a `rotear()` sempre `max = MAX_TOPICOS`: `tela.secoes` **não
    decide quantas gavetas abrem** — o próprio construtor escreveu o desacoplamento e o
    comentário que o justifica. O que as 1.644 comparações provam é
    `lista.slice(0,n) ⊆ lista.slice(0,n+1)`, verdade sobre qualquer lista. **Modo de falha
    nº 4 desta casa: a trava que se testa a si mesma**, no arquivo escrito para provar que
    a invariante vale.
    **Variando o ÚNICO botão que decide quantas gavetas abrem** — o `max` do roteamento,
    usado dentro do passe de aviso em `roteados = linhas.filter(...).slice(0, max)` —:
    **38 violações em 1.832 comparações, TODAS do tipo "a seção inteira sumiu"**.
    Contra-exemplo nomeado: *"O que muda do bloco de força para o bloco de pico?"* —
    `max=2` abre `[pico, competicao]`, `max=3` abre `[pico, taper, periodizacao]`, e
    acrescentar uma vaga **APAGA a seção `competicao` inteira**. Idem 5→6 em *"levantar
    peso já conta como exercício pro coração"* (`selecao-exercicio` some) e na pergunta do
    ponto perto da axila (`lesao` some). **O banner que a CLI imprime ao atleta —
    *"NENHUMA seção rouba vaga de outra — acrescentar gaveta só ACRESCENTA bloco"* — é
    falso em geral.**
    **O que a invariante SALVA, dito com o mesmo rigor, porque a metade boa também é
    dado:** baixar `FRACAO_DO_MELHOR` de 0,8 a 0,2 (que é literalmente *abrir MAIS
    gavetas*) deu **0 violações em 2.044** comparações, e forçar `[A]` contra `[A,B]` deu
    **0 em 400**. A configuração embarcada nunca move o `max`. **O produto não dilui; o
    TESTE é que não prova isso.**
    Conserto: variar o `max` do roteamento em vez de `tela.secoes`, e então **ou** consertar
    a não-monotonicidade do passe de aviso **ou** apagar o banner. Uma das duas, não
    nenhuma. Reprodução: `node research/tools/auditoria-onda2f/invariante.mjs`. **Aberta.**

60. **`--topic` lê UM valor e descarta o resto em silêncio, E descarta a rota inteira
    enquanto imprime o banner que promete o contrário.** São dois defeitos no mesmo
    parâmetro e os dois estão abertos.
    **(a) A lista.** `--topic a b c` casa só `a`; `b` e `c` são descartados por não casarem
    o padrão de id. Conferido antes de qualquer conclusão, como manda o modo de falha nº 5:
    `--pergunta "<D05>" --topic convencional` e
    `--pergunta "<D05>" --topic convencional sumo terra` têm **sha1 IDÊNTICO**
    (`62639128209f`, 12,6 kB). Foi este artefato que produziu o achado falso da onda 2D —
    *"abrir a gaveta certa mais uma vizinha é pior"* —, cujos dois comandos comparados eram
    o mesmo comando. A afirmação foi riscada no `CANARIOS.json`; **a armadilha continua
    armada**.
    **(b) A rota.** `--pergunta X --topic t` não ACRESCENTA `t` à rota: ele **DESCARTA a
    rota inteira** e mostra só `t`. Em E03, cinco seções viram uma. E a mesma saída imprime
    *"NENHUMA seção rouba vaga de outra — acrescentar gaveta só ACRESCENTA bloco"*. **Modo
    de falha nº 3 — documento e código divergindo em silêncio — dentro do arquivo que
    documenta o modo de falha nº 3.**
    Reprodução: `node research/tools/auditoria-onda2f/topic-parse.mjs`. **Aberta.**

61. **O TETO DE 34 kB É CALIBRADO NA PERGUNTA ERRADA, e o preço declarado é o piso.**
    `secoes.test.mjs` mede DUAS perguntas (*"o cinto pode ter mais de 13 mm…"* e a fisgada)
    e chama a primeira de *"a pergunta mais LARGA que se mediu"*. Medindo os **63** canários
    com id esperado pela mesma régua: **maior 40,0 kB (D01)**, mediana 32,8 kB, e
    **24 de 63 passam de 34 kB** (D01 40,0 · C16 39,1 · B10 38,7 · P14 38,6 · B01 38,4 ·
    D04 37,9 · E01 37,9 · D11 37,2 · E09 37,1 …) — 17 dos 51 anteriores e **7 dos 12
    cegos**. A regra escrita —
    *o maior teto de seção que mantém a CLI abaixo de 34 kB na pergunta mais larga* —
    teria escolhido um `TETO_DA_SECAO` **menor** se aplicada à pergunta mais larga de
    verdade. O ~31 kB publicado é o piso, não o topo.
    Reprodução: `node research/tools/auditoria-onda2f/publicos.mjs`. **Aberta.**

62. **O ESCAPE MANUAL DOCUMENTADO REGREDIU E NADA O MEDE.** `--topic <gaveta certa>`
    entrega hoje **11/12 "algum" e 10/12 "todos"** nos doze cegos; o arquivo que os
    documentava registrava os 12 saindo pela gaveta forçada. Os dois que caem:
    **E05** — `--topic equipamento` abre 60 vagas, F001-79 (*meia de cano até a canela é
    OBRIGATÓRIA no terra*, IPF §3.5.d) está declarada em `equipamento` e cai em **#78 de
    152**; a saída imprime F001-80 (*"meia-calça, legging e meia de perna inteira são
    estritamente proibidas"*) e **OMITE a regra que obriga**. Para um atleta que nunca
    competiu, é a diferença entre passar e ser barrado na plataforma.
    **E12** — V127-13 não é declarada em `lesao`, e a decisão *"tópico forçado não ganha
    afim nenhuma"* apagou o único canal que a trazia: o caminho ROTEADO entrega as duas
    metades e o FORÇADO entrega uma, **invertendo a premissa da onda**.
    Reprodução: `node research/tools/auditoria-onda2f/cegos.mjs --forcado`. **Aberta.**

63. **`TETO_LIGACAO` 8 → 80 SOBREVIVE À MUTAÇÃO E NÃO ESTAVA NA DÍVIDA DECLARADA.**
    `montarSecaoDeGaveta` sempre passa `teto: FOCO_DA_SECAO * LIGACOES_POR_FOCO` (16), e
    `porLigacaoDeclarada` não tem outro chamador — logo o **8 é um default inalcançável**.
    É exatamente o defeito por que `LIGACOES_DA_SECAO` e `LADO_DA_SECAO` foram removidas no
    mesmo dia, deixado de pé num terceiro lugar.
    **E a dívida que ESTAVA declarada é maior do que um valor:** `LIGACOES_POR_FOCO` 4→5,
    4→6 **e** 4→40 sobrevivem às seis travas que importam `roteador.mjs`. O relato cita só
    o 4→40; a faixa 4–6 está sem trava, como o próprio §27.4 escreveu.
    **Placar completo da mutação: 36 de 40 mortas**, incluindo todas as que fariam uma
    seção inteira sumir (`MAX_TOPICOS` 5→1 e 5→4, `TETO_PARAM` 12→0,
    `MIN_PECAS_DO_PARAM` 2→6, `FOCO_DA_SECAO` 4→0, `LIGACOES_POR_FOCO` 4→0).
    Reprodução: `node research/tools/auditoria-onda2f/mutacao.mjs` e `mutacao2.mjs`.
    **Aberta.**

64. **O GATE MEDE UM CAMINHO QUE O PRODUTO DEIXOU DE USAR, e não diz isso.** Com a decisão
    do `RECUPERACAO.md` §28 — o `--pergunta` determinístico vira conveniência e a escolha
    da gaveta passa ao agente —, a linha *"roteamento OK"* do `check:kb` afirma algo sobre
    um caminho que ninguém percorre. **Confiança falsa é pior que gate nenhum**, e esta
    casa já registrou isso três vezes com outro nome.
    Conserto, e ele é de UMA linha de saída: o gate tem de dizer que mede **FIDELIDADE À
    FONTE** e **ORDENAÇÃO DENTRO DA GAVETA**, nunca *"a base responde bem"*. O que ele
    continua garantindo, e não é pouco: os 74 termos fechados, todo `topic[]` dentro do
    enumerado, todo id citado resolvendo — a trava contra citação fabricada fica MAIS
    importante, porque quem cita agora é um modelo — e o contrato de ordenação do §28.1.
    **Aberta.**

65. **`regras-ipf` É GAVETA-CHAMARIZ: 8 de 143 claims do regulamento IPF a carregam** (54
    em toda a base de 6.912). Os três modelos do caminho do agente apostaram nela em **5
    das 12** perguntas e ela devolveu **zero id esperado nas cinco**. Não custou acerto —
    sempre havia outra gaveta certa junto — mas queimou cerca de **um terço do orçamento de
    comandos**. O regulamento F001 está etiquetado por ASSUNTO (`equipamento` 38,
    `competicao` 36, `erro-comum` 33, `supino` 29, `agacho` 27, `comandos-ipf` 27) e quase
    nunca por FONTE, então quem procura *"a regra"* abre a gaveta que tem o nome certo e o
    conteúdo errado. **É conserto de BASE, barato, e melhora o caminho do agente sem tocar
    em uma linha de código.** Não é retroetiquetar tudo: é decidir se `regras-ipf` significa
    *"veio do regulamento"* (e então são 143) ou *"é uma regra de plataforma"* (e então o
    nome está errado) — hoje ela significa as duas coisas para leitores diferentes, que é o
    modo de falha nº 1. Reprodução: contar `topic[]` por prefixo de `src` em
    `research/extract/F001.jsonl`. **Aberta.**

66. **O RECUO DO GATE DE PEITORAL NÃO REDUZ CARGA — 22 SÉRIES DE BARRA POR SEMANA, INVARIANTES
    NAS S1–S16.** `PROGRAMA.md:295-296` declara `FP-SETS = 7 − SUP-V1` e
    `FP4-SETS = 5 − SUP-V4`, e `checkDerivacoes` em `scripts/build-vena-block1.mjs` **reprova
    o build** se a grade divergir. Logo, quando o §1.2 manda *"recua um degrau"* e o eixo é
    `SUP-V1` ou `SUP-V4` — os dois que mais se movem —, o app troca supino pausado por floor
    press **1:1** e o total sobre o tecido lesionado não cai. Medido, recuando os oito eixos
    nomeados em toda semana em que cada um tem valor anterior distinto: `SUP-V1` +0 em 13
    semanas, `SUP-V4` +0 em 12, `FP-SETS`/`FP4-SETS` +0 (e recuá-los EXIGE que o pausado
    suba), `PAUSA-P` +0, `FP-RPE`/`FP4-RPE` +0. **Um único eixo remove série: `PEC-SETS`,
    −2, em 11 semanas.** A base manda o contrário em quatro prescrições GERAL (`V138-04`,
    `V138-15`, `V001-09`, e `V138-28` chama workload de *"the main controllable Factor"*).
    **Conserto NÃO aplicado de propósito: é a única coisa desta auditoria que muda o treino
    de um atleta com lesão, e a decisão é dele.** Três opções desenhadas, com custo de cada
    uma, em `research/kb/PEITO-PARECER.md` §8.1.
    Reprodução: `node research/tools/auditoria-peito/conferencia-curva.mjs`. **Aberta.**

67. **O "CONGELA" DO §1.2 NÃO CONGELA CARGA.** Os 8 nomes que a célula congela são os 6 de
    `exposicao_peito` e os 2 de `parada_peito`. Ficam de fora `SUP-F`, `SUP-F-BO`,
    `SUP-V1-PCT`, `SUP-P` (`carga_supino`) e `RPE-SUP`, `RPE-SUP-BO` (`parada_supino`).
    Medido com o TM travado em 160 kg, o que continua subindo da S4 à S16 sob o degrau
    *congela*: D1 volume 115,2 → 124,8 kg, top single 137,6 → 147,2 kg, back-off
    131,2 → 137,6 kg, prática 99,2 → 107,2 kg, e `RPE-SUP` 7,5 → 8. `V138-18`
    (GERAL/`prescricao`) manda reduzir *"both absolute weight and proximity to failure"* — o
    degrau mais provável de disparar não toca em nenhuma das duas. **Aberta.**

68. **DOR EM REPOUSO NÃO TEM PORTA DE ENTRADA, E O ANDAIME ESTÁ INTEIRO.** `PreWorkoutSurvey`
    e `PostWorkoutSurvey` começam por `workoutId: string`; os dois únicos pontos de montagem
    do `PainSelector` são folhas de survey de treino. Existe `RestPainLog` +
    `RestPainContext` (`src/types/index.ts`), existem `describeRestPain` e
    `describeReturnWithRestPain` (`src/domain/painGate.ts`) — e **nenhum tem consumidor**.
    `WeekDoc` **não** tem campo `restPain`. O comentário de `ROLLUP_SCHEMA_VERSION = 3`
    anunciava esse campo como pronto e foi **corrigido em 12/8/2026** para dizer que ele é
    proposta. Consequência medida: a semana sem treino sai do app com `pain: []` — afirmando
    que não houve dor. O diff completo, deliberadamente **sem** mudança de comportamento do
    gate, está em `PEITO-PARECER.md` §8.2, e ele nasce com o cenário que o mata. **Aberta.**

69. **`src/domain/trainingMaxProgression.ts` (232 linhas) TEM ZERO CHAMADORES.** É o único
    módulo do app que modela o congelamento do §1.2 — a porta `degrau_de_exposicao_de_peito`
    nomeia `SUP-V1`, `SUP-V4`, `PAUSA-P`, `PEC-SETS`, `FP-SETS`, `FP4-SETS` e torna a leitura
    do gauge **inválida para subir** — e é também onde vivem `gravarGateSemana4` e
    `medianaDeAncoras`, o gate S3→S4. Grep de
    `applyGaugeReading|gravarGateSemana4|medianaDeAncoras|GAUGE_K|trainingMaxProgression`
    fora do próprio arquivo: **1 ocorrência, e é prosa** (`research/kb/GATE-DOR.md:315`).
    Está escrito, está correto, e nunca executa. **Arrasta um segundo defeito:** o único
    escritor de `profile.trainingMax` é `src/pages/Settings.tsx:52`, campo digitado à mão, e
    a linha 56 carimba `trainingMaxOrigin: 'calibrado'` para qualquer número > 0;
    `trainingMaxInicialBloco` não é escrito em lugar nenhum, logo o teto de `×1,10` do §1.1
    não tem denominador. **O TM de 160 kg que sustenta toda a aritmética de carga do bloco
    não vem de calibração nenhuma.** **Aberta.**

70. **`acute` (estiramento agudo) TEM LEITOR E NÃO TEM ESCRITOR.** `PainEntry.acute` existe,
    `buildGateReadings` o lê, `painGate.ts:223` satisfaz o degrau `≥4/10 ou estiramento
    agudo` por ele — e **não há toggle no `PainSelector`**. Grep de `acute` em
    `src/features` e `src/components`: **zero**. Uma fisgada aguda pontuada como 3/10 dispara
    *congela*, não *encerra a sessão*. O comentário em `src/types/index.ts` dizia que o
    defeito estava corrigido; ele **mudou de camada**, do gerador para a UI. Nota de
    12/8/2026: os dois tipos de `rollupTypes.ts` declaravam a entrada de dor sem `acute`
    enquanto o campo trafegava em runtime — `tsc` reprovava, e o `check:gate` vermelho
    escondia isso. Tipo corrigido; a porta continua faltando. **Aberta.**

71. **O ALERTA DE DOR NA TELA SÓ LÊ O PRÉ-TREINO.**
    `src/features/feedback/hooks/useSurveyTrends.ts:100` faz
    `const allPainEntries = preSurveys.flatMap(s => s.painEntries)` e nada mais — o
    `postSurveys` do mesmo hook nunca é lido para dor. Dor de peitoral registrada **apenas no
    pós-treino** nunca acende alerta na tela, embora `weeklyRollup.ts` leia as duas fontes.
    **Aberta.**

72. **AS BANDEIRAS DO GATE NÃO CHEGAM A NENHUMA AÇÃO.** Elas vão para `WeekDoc.flags` no
    Firestore e o **único** leitor é `scripts/weekly-briefing.mjs:252`, que não roda sem
    `FIREBASE_EMAIL`/`FIREBASE_PASSWORD` — ausentes do `.env`. Na tela, o gate produz duas
    coisas e nenhuma é ação: o rótulo inline de
    `src/features/survey/components/PainSelector.tsx:120-126` — que promete *"o supino não
    sobe carga nem degrau de exposição esta semana"*, e as **duas metades da promessa estão
    quebradas**, a de carga pelo §8.67 e a de degrau pelo §8.69 — e o alerta de
    `useSurveyTrends.ts:111`. **Nenhuma prescrição muda** (ver §8.69, o módulo que a
    mudaria não é chamado). E o `WeekDoc` **não é reescrito** numa semana sem treino
    (`weekKey` só é marcado sujo por `saveWorkout`/`savePreSurvey`/`savePostSurvey`), então a
    bandeira de `RETORNO` da última semana treinada fica congelada dentro dele — e o briefing
    não imprime `updatedAt`, logo não há como saber que o documento tem uma semana de idade.
    **É possível hoje o briefing recomendar re-subir degrau com o atleta em dor.**
    **Conserto proposto, e é só transporte de contexto — zero risco de treino:** o briefing
    passa a imprimir (i) o bloco `w.gate` — leituras da janela com data e pico, a cauda que
    atravessou a semana, as semanas do `RETORNO` com `benchSessions`/`loggedSessions`/
    `fullyLoggedSessions`; (ii) a tabela do §1.2 lida de `VENA_BLOCK1_PAIN_GATE`; (iii)
    `updatedAt` e a **idade do documento em dias**, com aviso explícito acima de 7; (iv) as
    claims `prescricao` de `dor`+`lesao` que sustentam o limiar. Hoje o agente da conversa
    recebe a string da bandeira e nenhum dos quatro, e improvisa em cima dela. **Aberta.**

73. **AS 18 SÉRIES DE AQUECIMENTO SOBRE O PEITORAL SÃO INVISÍVEIS PARA TODO DEGRAU E PARA A
    REGRA R3.** Medido no gerado: 18 séries de aquecimento por semana tocam o peitoral,
    invariantes nas 16 semanas, **14 delas de supino pausado** (D1:3, D2:6, D3:2, D4:3) — e o
    §2.2 manda pausa de 1,0 s *"INCLUSIVE NOS 3 AQUECIMENTOS"*. A exposição real é de **42 a
    46 séries/semana**, das quais 27 a 31 pausadas no peito. R3 (*"supino ≥ 22
    séries/semana"*) e todo o debate do gate contam só o trabalho. Declarado no §1.2 em
    12/8/2026; **nenhum degrau as toca.** **Aberta.**

74. **DEFEITO DE ENDEREÇO ≠ DEFEITO DE CONTEÚDO, E SÓ O PRIMEIRO É DECIDÍVEL POR MÁQUINA.**
    `research/tools/check-enderecos.mjs` entrou no `check:kb` em 12/8/2026 e reprova o build
    quando um `[Rnn @mm:ss]` do `PROGRAMA.md` aponta para fonte inexistente ou para um buraco
    da grade (264 endereços, 264 resolvem hoje). A tolerância de ±7 s é **medida** — mediana
    dos intervalos entre marcas do corpus, 15 s, dividida por dois — e não chutada: uma onda
    anterior testou igualdade exata e condenou **230 de 263** endereços corretos, 87 % do
    documento, quase publicando isso como "endereços fabricados".
    **O que a trava NÃO vê, e é o que mais custou:** endereço que resolve para o bloco errado
    dentro da mesma fonte; rótulo `[GERAL]`/`[PESSOAL]` trocado; claim `opiniao`/`mecanismo`
    sustentando prescrição. Os três exigem **ler a claim**, e ficam como leitura humana desta
    lista — não escondidos atrás de um número que parece medição. Os seis endereços do
    `PROGRAMA.md` com defeito de conteúdo foram corrigidos no mesmo passe (`PEITO-PARECER.md`
    §8.3). **Aberta** (a parte não automatizável).

75. **O TERCEIRO MOMENTO DO §1.2 NÃO EXISTE EM CAMPO NENHUM.** A seção declara três coletas —
    pré-sessão · **1ª série pausada com carga de trabalho** · pós-sessão — e o app tem dois
    campos. Nada em `src/types` casa `pausada|midSession|intraSession`. O momento que falta é
    o único que mede o tecido **sob carga em posição alongada**, o de maior valor
    diagnóstico. `check:gate` passa mesmo assim porque trava tabela↔rollup, e o rollup só
    conhece dois. Nota relacionada, e é deliberada: `collectedLog` é **OU** (pré *ou* pós)
    para os degraus de agravamento — errar para o lado de olhar demais — e `semanaLimpa`
    exige o **E**, porque o `RETORNO` é a única linha que aumenta carga. Essa assimetria está
    certa e travada; o terceiro momento é que falta. **Aberta.**

76. **NÃO EXISTE LEITURA DE TENDÊNCIA EM `painGate.ts`, E A BASE DECIDE POR TENDÊNCIA.**
    `evaluatePainGate` é teste de limiar; `evaluateGateReturn` conta semanas com
    `peak <= picoMaximo`, que é outro teste de limiar. **Nenhuma função compara o pico desta
    semana com o da anterior**, e não há uma única aritmética de tempo decorrido no arquivo
    (grep de `new Date|Date.now|getTime` = 0), logo um evento de três meses atrás pesa igual
    a um de ontem. A base é unânime e é `prescricao` GERAL na direção oposta: `V086-21`
    (*"symptoms should be trending better over time"*), `V027-26` (*"trending down over
    time"*) e `V027-28`, que conta **platô como falha**, não só piora. Consequência medida:
    um platô em 2/10 por seis semanas dispara `congela` toda semana, **sem nunca escalar e
    sem nunca ser nomeado como platô** — que é literalmente o modo de falha `[PESSOAL]`
    (`V027-25`) que o §1.2 existe para evitar. O instrumento é cego exatamente para o modo de
    falha que ele existe para pegar. **Aberta.**

77. **`post.newPain` SÓ CAPTURA DOR *NOVA*, E O QUADRO DO ATLETA É DOR PREEXISTENTE.**
    `buildGateReadings` lê `sess.post?.newPain`, que vem de `hasNewPain` na folha de
    pós-treino. Dor que já estava e não mudou — o quadro dele — **não é dor nova**, e nada
    garante que seja registrada no pós. Não há campo de "dor pós-sessão absoluta".
    Defeito irmão, menor: `PainEntry.intensity` está documentado como `1-10` enquanto a
    escala do gate é `0-10` (`VENA_BLOCK1_PAIN_GATE.escala`), e o `peak: 0` só existe por
    construção, nunca por digitação — sessão limpa e sessão em que a gaveta não foi aberta
    são **indistinguíveis** no valor gravado. **Aberta.**
