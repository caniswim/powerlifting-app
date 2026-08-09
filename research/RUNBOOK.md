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
| `research/kb/GENERO.md` | O `genero` do **vídeo** (dez valores, no manifesto), o critério de cada um, como o campo foi semeado sem reabrir vídeo, e a lista das 76 claims que a trava dele acusa hoje. É o conserto determinístico de `relato-de-programa` / `avaliacao-de-terceiro`. |
| `research/tools/kb.mjs` | Os enumerados fechados em código, importados por todo checker. A lista viva de `frame`, `modo` e `genero`. |
| `research/kb/INSTRUMENTO.md` | Como a base é **medida**: o que é prova mecânica, o que é julgamento, e como se roda a medição de novo. |
| `research/kb/CANARIOS.json` | Os canários da medição, com o predicado que prova cada um. **Não mostrar a quem responde.** |
| `research/kb/ESTADO.md` | **Onde a base está, hoje, e com que instrumento cada número foi obtido.** É o primeiro arquivo a ler depois deste. Diz o que foi provado por compilador, o que virou comando sem virar trava, e o que continua sendo julgamento de agente. |
| `research/kb/ONDA-2.md` | **A fila de trabalho da próxima rodada**, em ordem de risco para o atleta. Cada item diz *quantos*, *onde* e *como se verifica que ficou certo*, com o comando que gera cada lista de ids e as colisões entre as filas já contadas. É lista de trabalho, não relatório — o *porquê* da ordem está no `ESTADO.md` §4. |
| `research/kb/GATE-DOR.md` | O gate de dor do §1.2 do `PROGRAMA.md`: como a tabela vira comportamento do app, o que a trava cobre e o que ela **não** cobre. |
| `research/kb/DEFEITOS-PONTUAIS.md` | Os seis defeitos nomeados de 9/8 e o conserto de cada um, inclusive o `CONFIRMADO` falso do `verify-suspects.mjs`. |
| `research/kb/*.md` (ROSTER-CURADO, IPF-REALIDADE, PADROES-EXTERNOS, FONTES-ADICIONAIS) | Pesquisa curada, escrita à mão, com procedência linha a linha. |
| `research/kb/PREDICOES-BLOCO1.md` | **O registro pré-comprometido do bloco 1.** 22 previsões falseáveis com prazo e com a claim que morre em cada desfecho. Só admite **anotação** a partir de 10/08/2026 — editar uma previsão é apagar a medição. Era `research/predicoes.md`, órfão; a procedência e a auditoria estão no cabeçalho dele. |
| `research/tools/*.mjs`, `whisper-window.py` | O pipeline. |
| `research/tools/params-gaveta-errada.mjs` | **Detector, não verificador, e fora do `check:kb` de propósito.** Enumera os 52 params cujo número está tipado na gaveta errada. Existe porque essa lista era copiada à mão dentro do `ESTADO.md` §3 e o número derivado dela estava errado. Some quando cada regra virar recusa do `check-claims.mjs` — ver §8.19. |
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
node research/tools/check-canarios.test.mjs # 35 casos
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

`check-canarios.json` + `check-canarios.mjs` medem o **julgador**, não a resposta: 15
perguntas cujo desfecho é conhecido por contagem (5 respondíveis, 5 impossíveis, 5
armadilhas). O recontador refaz as contagens e falha quando um canário morre — inclusive
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
- [x] `check-answer.mjs` + 34 casos de teste; `CANARIOS.json` (15) +
      `check-canarios.mjs` + 35 casos. `npm run check:kb` encadeia tudo, então **canário
      morto quebra o build**, deliberadamente.
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
> consertada) · **17** (dívida: 76 claims de gênero) · **18** (dívida: `pratica-pessoal`) ·
> **19** (dívida: 52 params em gaveta errada) · **20** · **21** · **22** · **23** · **24** ·
> **26**. São **14**. O plano de execução delas está em `research/kb/ONDA-2.md`.

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
    **A dívida:** a trava do `check-claims.mjs` MEDE e não recusa — catraca por `src`
    (`TETO_PRESCRICAO_EM_GENERO_RESTRITO`), teto no valor de hoje, só desce. São **76
    claims em `modo: prescricao` vindas de 19 vídeos** que expõem material de outra
    pessoa, listadas uma a uma em `GENERO.md` §6. Recusar de saída derrubaria o build
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
    fora da trava, que é o modo de falha nº 2. Quando a onda 2 abrir as gavetas, **cada
    regra dele vira uma recusa do `check-claims.mjs` e o arquivo é apagado.**
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
    `tier U = 0` (`ONDA-2.md` item 5): registrar o gate como claim do atleta dá o alvo.
    Reproduz: `node research/tools/check-evidence.mjs V138-18 V138-20` — nenhuma imprime
    `conflitos:`.
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
