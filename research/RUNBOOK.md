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
| `research/kb/*.md` (ROSTER-CURADO, IPF-REALIDADE, PADROES-EXTERNOS, FONTES-ADICIONAIS) | Pesquisa curada, escrita à mão, com procedência linha a linha. |
| `research/tools/*.mjs`, `whisper-window.py` | O pipeline. |
| `research/corpus/ipf/rulebook-2026.md` | O regulamento IPF 2026 em markdown citável — é contra ele que o checker confere todo `tier: O`. |

### Derivado — regenerável, e por isso descartável

| Caminho | Quem gera | Custo de refazer |
|---|---|---|
| `research/corpus/manifest.json` | `build-manifest.mjs` | ~15 min (rede) |
| `research/corpus/dates.json` | `fetch-dates.mjs` | ~12 min (rede) |
| `research/corpus/transcripts/*.md` | `fetch-captions.mjs` | ~15 min para 197 |
| `research/corpus/captions/*.json3.gz` | `fetch-captions.mjs` | idem (é o bruto guardado) |
| `research/kb/suspeitos-whisper.json` | `verify-suspects.mjs` | horas (áudio + Whisper) |

### NUNCA se edita à mão

- **`research/corpus/manifest.json`** — é derivado da ordem do canal e amarra `[Rxxx]` a
  `videoId`. Editar à mão é a forma mais rápida de deslocar a base inteira em silêncio.
  Se precisar mudar, mude `build-manifest.mjs`/`sources.mjs` e regenere. E rode
  `verify-manifest.mjs` **depois**, sempre.
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
`research/synth/` (as sínteses com `basis`) estão **vazios**, e não há gerador. Ver §9.

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
node research/tools/verify-manifest.mjs
#    Se isto falhar, PARE. Não siga para transcrição. Ver §3.

# 3. LEGENDAS → transcrição citável. ~15 min para 197 vídeos (conc. 4)
node research/tools/fetch-captions.mjs
#    Resumível: pula o que já tem `transcript` no manifesto. --force refaz.
#    --only R159 para um vídeo só.

# 4. EXTRAÇÃO — agentes lendo transcrição e emitindo claims JSONL.
#    ~15–20 min por lote de 10 vídeos. Teto de 20 subagentes simultâneos (§6).
#    O agente recebe PROTOCOLO-EXTRACAO.md + SCHEMA.md e roda, no próprio loop:
node research/tools/check-claims.mjs --only R014

# 5. CHECAGEM COMPLETA. <1 s cada.
node research/tools/check-claims.test.mjs   # o checker ainda pega o que promete?
node research/tools/check-claims.mjs        # 5.090 claims em ~0,3 s
npm run check:kb                            # os três acima, encadeados

# 6. REPARO CIRÚRGICO COM WHISPER — opcional, caro, e o último passo.
node research/tools/list-suspects.mjs              # o que vale escutar
node research/tools/verify-suspects.mjs --only R002 # baixa áudio, corta janela, transcreve
#    Carregar o large-v3-turbo custa ~2 min; por isso todas as janelas vão num load só.
#    A saída é EVIDÊNCIA, não veredito: só `CONFIRMADO` é automático.
```

Fonte nova (Blevins) usa os mesmos passos 1 e 3 com `--source blevins`. Os passos 2 e 5
**ainda não aceitam `--source`** — ver §9.

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
`source.{document,version,url,effective}` e `at` no formato `§4.1.3`.

### O checker tem teste próprio

`check-claims.mjs` carimba 5 mil claims com "toda citação resolve, todo verbatim existe,
todo número tem frame". **Checker silenciosamente quebrado é pior que checker nenhum**:
sem checker você desconfia; com um quebrado você para de desconfiar. O modo de falha é
banal — alguém "melhora" a normalização até ela apagar caracteres demais, qualquer string
vira prefixo de qualquer outra, e o `✓` continua verde.

`check-claims.test.mjs` monta um extract sintético a partir de uma claim **real já
aprovada**, muta-a de 14 formas específicas, e exige que o checker recuse cada uma **pela
mensagem certa** (aceitar qualquer erro seria satisfeito por um typo no próprio teste).
Estado atual: 14/14. Se você adicionar uma regra ao checker, adicione o caso aqui — senão
a regra não tem garantia nenhuma.

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

**Teto de 20 subagentes simultâneos.** É o limite do harness. Lote de 10 vídeos por agente,
até 20 agentes: ~200 vídeos por rodada, ~15–20 min. Passar disso não acelera, enfileira.
E os workers de rede são propositalmente baixos (yt-dlp conc. 3–4) porque o throttle do
YouTube é por IP: subir isso com outro processo yt-dlp rodando atrasa os dois.

**Aviso não é erro.** `check-claims.mjs` emite ~77 avisos de "número por extenso sem param"
(`quatorze dias`). A lista tem falso positivo demais para barrar commit ("um" é artigo),
mas serve de alvo para o passe de reparo. Não os trate como ruído permanente.

---

## 6. O que NÃO fazer

**Não coloque pesquisa no scratchpad da sessão.** É literalmente como os 564 mil palavras
morreram. Artefato caro nasce em `research/` e é commitado no mesmo dia. Scratchpad serve
para log de build e arquivo intermediário descartável, nada mais.

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

## 7. Estado atual (snapshot de 9/8/2026, ~10:00)

Deduzido do repositório. Reconfira com os comandos do §4 antes de confiar.

**Vena (`R`) — corpus principal**
- [x] Manifesto: 197 vídeos, 196 citáveis, 15,1 h. Todos os 197 com `date`.
- [x] `verify-manifest.mjs` passa: 6 âncoras, 258 timestamps, offset único.
- [x] `dates.json`: 197/197.
- [x] Transcrições: **181 de 197**. Os 16 sem transcrição são `R178`–`R196` (vlogs
      antigos de PR, sem legenda automática em inglês). Nenhum deles tem citação no
      `PROGRAMA.md` — perda aceitável, mas confirme antes de citar qualquer um.
- [x] Legendas brutas: 181 `.json3.gz` guardados.
- [x] Extração: **181 arquivos** (180 vídeos + `F001`), **5.090 claims** (`R:4947`,
      `O:143`), 180 vídeos com claim. Todo vídeo citável com transcrição tem extract.
- [~] **`R191.jsonl` está vazio** (0 byte). Passa em qualquer contagem por nome. Verificar
      se é vídeo sem conteúdo extraível ou lote perdido.
- [x] `check-claims.mjs` passa: 0 erros, 79 avisos de número por extenso.
- [x] `check-claims.test.mjs`: 14/14.
- [~] Contradições registradas: **apenas 3** `conflicts` em 5 mil claims. Baixo demais para
      um corpus onde a run 1 achou C1–C25. Provável subregistro — ver §5 (`--only`).

**IPF (`F`) — documento normativo**
- [x] `research/corpus/ipf/rulebook-2026.md` (52 KB) + os 2 PDFs oficiais, versionados.
- [x] `research/extract/F001.jsonl`: 143 claims `tier: O`, todas conferidas contra o
      markdown do rulebook (parágrafo existe + verbatim literal presente).

**Blevins (`G`) — segunda fonte**
- [~] `build-manifest.mjs --source blevins` **rodando agora**: 354 vídeos, 41,2 h,
      225/354 datados no último check.
- [ ] Transcrições: 0.
- [ ] Extração: 0.
- [ ] **Bloqueado**: `verify-manifest.mjs` e `check-claims.mjs` não aceitam `--source`
      (§9). Extrair claim `G###` hoje produziria claim que nenhum checker valida.

**Verificação com Whisper**
- [~] `list-suspects.mjs`: 128 alvos (58 marcados `suspect:true` + 70 candidatos de
      negação, de 1.948 varridos).
- [~] `verify-suspects.mjs`: rodado só para `R002` — 6 janelas, **6 `DIVERGENTE`, 0
      `CONFIRMADO`**. Precisa de julgamento humano antes de rodar em escala; 6/6
      divergente pode ser sinal de problema no comparador, não nas claims.
- [ ] `research/kb/SUSPEITOS-VERIFICADOS.md` — referenciado por `verify-suspects.mjs`
      como destino do veredito humano, **não existe**.

**Sínteses e visões**
- [ ] `research/synth/` — vazio.
- [ ] `research/kb/topics/*.md` — não existe, e não há gerador.
- [ ] Substitutos de `DECISION_RULES.md` / `CONTRADICTIONS.md` / `GAPS.md`: só o que
      `research/recuperado/kb-sintese.md` preservou da run 1.

---

## 8. Divergências entre o que os documentos dizem e o que o código faz

Encontradas ao escrever este RUNBOOK. Nenhuma é fatal hoje; todas mordem depois.

1. **`npm run check:kb` não está no `npm run build`.** O cabeçalho do `check-claims.mjs`
   diz "este arquivo recusa os dois, **no build**", e o commit que o introduziu se chama
   "liga a base ao build". Mas `scripts.build` é
   `check:program && check:vena && validate:program && check:notes && tsc -b && vite build`
   — `check:kb` não está lá. Hoje a base só é verificada por quem lembrar de rodar.
2. **`verify-manifest.mjs` e `check-claims.mjs` são hardcoded no Vena.** Ambos abrem
   `research/corpus/manifest.json` direto e ignoram `--source`, enquanto
   `build-manifest.mjs`, `fetch-captions.mjs` e `fetch-dates.mjs` já foram generalizados
   via `sources.mjs`. Consequência concreta: o corpus Blevins pode ser construído e
   transcrito, mas **nenhuma claim `G###` seria validável**.
3. **`verify-manifest.mjs` aponta para um símbolo que não existe mais.** Sua mensagem de
   erro diz "ajuste `POST_RUN1` em `build-manifest.mjs`"; a constante virou
   `SOURCE.postRun1`, em `sources.mjs`. Quem seguir a mensagem no meio de um incidente vai
   procurar no arquivo errado.
4. **`fetch-captions.mjs` cita `repair-numbers.mjs`, que nunca existiu.** O passe de reparo
   é `list-suspects.mjs` + `verify-suspects.mjs` + `whisper-window.py`.
5. **`fetch-captions.mjs` afirma que "o manifesto do Vena não tem o campo `date`".** Tem —
   todos os 197. O comentário é anterior ao passe de datação e a lógica `?? null` que ele
   justifica virou inofensiva, mas o comentário mente.
6. **O manifesto do Vena não tem `source`, `refPrefix`, `builtAt` nem `channelItemCount`.**
   Ele foi construído antes da generalização. Isso significa que a defesa "compare o
   `channelItemCount` de hoje com o gravado para detectar deslocamento" — o mecanismo que
   `build-manifest.mjs` descreve como o mínimo para tornar deslocamento respondível — **não
   está disponível justamente para o corpus que tem 7.741 citações apontando para ele**. O
   Blevins tem. Rodar `--refresh` no Vena preencheria os campos, mas é uma operação de
   risco (§6) e exige `verify-manifest.mjs` logo em seguida.
7. **`SCHEMA.md` prescreve `date` no registro da claim; nenhuma das 5.090 claims tem, e o
   checker não exige.** A regra "o recente vence" é executável no nível do *vídeo*
   (`manifest.json` e `dates.json`), não no nível da claim. Ou o schema muda, ou o checker
   passa a derivar `date` do `src` — a segunda parece melhor, porque duplicar a data em
   cada claim é justamente o tipo de cópia que diverge.
8. **`suspectWhy` está documentado e não é usado por ninguém.** As 58 claims com
   `suspect: true` não têm o campo; `list-suspects.mjs` já trata a ausência como
   `"numero"`, então a família "negação" depende inteiramente da pontuação heurística e
   nunca da marcação do extrator.
9. **`SCHEMA.md` descreve `research/kb/topics/*.md` como "geradas, não editar" — não
   existem e não há gerador.** O mesmo vale para `research/synth/`, que o `SCHEMA.md` e o
   `PROTOCOLO-EXTRACAO.md` citam como o lugar onde mora síntese com `basis`.
10. **A tabela de `frame` do `SCHEMA.md` está desatualizada** (falta `mm` e `m`, que o
    checker aceita). O próprio `SCHEMA.md` já avisa que a lista viva é a do
    `check-claims.mjs`, então isto é sabido — mas o exemplo de `conflicts` no mesmo arquivo
    usa `"V0088"`, que não é um id válido pelo formato `V{ref}-{seq}` que ele mesmo define.
11. **Tiers `E` e `U` não têm nenhuma trava no checker.** `SCHEMA.md` diz que `E` exige
    fonte com URL e `U` exige a data da conversa; `check-claims.mjs` valida procedência
    apenas para `R`, `I`, `L` e `O`. Hoje não morde — não há claim `E` nem `U` na base —
    mas morderá no passe de elites, que é exatamente onde o roster curado entra.
12. **`.tmp` não está no `.gitignore`.** `research/corpus/.tmp/` e
    `research/corpus/blevins/.tmp/` recebem os `.json3` brutos do yt-dlp e só são limpos no
    caminho feliz do `fetch-captions.mjs`. Se ele morrer no meio, os arquivos ficam lá — e
    um `git add research/` os varre (§5). Só `.audio/` e `.venv-whisper/` estão ignorados.
