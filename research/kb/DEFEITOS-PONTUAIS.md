# Seis defeitos pontuais — o que foi feito, e o que não deu

Passe de 09/08/2026. Seis defeitos apontados um a um, cada um com um jeito de
conferir que não depende de acreditar neste documento.

`check-claims.mjs`, `SCHEMA.md` e `PROTOCOLO-EXTRACAO.md` **não foram tocados** —
outro agente é dono deles nesta fase. Onde um conserto exigiria mexer lá, está
relatado no §7 em vez de feito.

Estado no fim do passe: `npm run check:kb` passa; 6.909 claims, 70 avisos, 0 erros.

---

## 1. Proteína gravada como `8 g/lb`

### O que era

`V043-27` afirmava que a meta-análise não mostra benefício de proteína **além de
8 g por libra de peso corporal**. Oito gramas por libra são 17,6 g/kg — para o
atleta de 87 kg desta base, 1,5 kg de proteína por dia. O mesmo canal, no mesmo
assunto, grava o mesmo limiar como **1,6 g/kg** em `V041-05` e `V041-07`, com o
decimal intacto na legenda. Erro de 10× convivendo com o número certo a dois
vídeos de distância.

Não era um caso isolado. `V041-21` dizia `6 g/lb` e `V041-22` dizia `8 g/lb` e
`1 g/lb` — uma escada 6 → 8 → 1 que não sobe, o que já denuncia o defeito.

### O que era de verdade

A legenda automática do YouTube **come o `0.` de decimais menores que 1**. Não é
teoria: o áudio foi ao `large-v3-turbo`, na janela declarada, pelo passe que já
existe para isso.

| id | legenda (YouTube) | áudio (Whisper, sem prompt) |
|---|---|---|
| `V041-21` | `6 g per pound` | `0.6 grams per pound` |
| `V041-22` | `8 g or 1 g` | `0.8 grams or 1 grams` |
| `V043-27` | `about8 g per pound` | `about 20` / `about 28` — instável |

`0,6 → 0,8 → 1 g/lb` é uma escada que sobe, é a faixa que o próprio canal
prescreve em `V069-06` e `V069-09` (*"1 g per pound of body weight or higher"*), e
é coerente com ele comer 300 g/dia a 120 kg.

### O que foi feito

- **`V041-21`, `V041-22`** — `params` e `claim` seguem o áudio (`0.6`, `0.8`, `1`),
  `verbatim` **não** mudou, `verified: "whisper"` com `verbatimWhisper`, `suspect`
  removido. É exatamente o mecanismo que o `check-claims.mjs` já documentava e que
  nenhuma claim usava ainda.
- **`V043-27`** — o `param` foi **removido** e a `claim` reescrita sem número. O
  áudio não resolve: sem prompt, o `large-v3` diz `20` e o `large-v3-turbo` diz
  `28`, com probabilidade de palavra 0,52–0,72, e os dois discordam entre si. Com
  um `initial_prompt` mencionando `0.8` os dois devolvem `0.8` — mas prompt que
  sugere a resposta não é evidência, e essa transcrição não entrou em lugar
  nenhum. A claim continua `suspect: true`, com `nota` explicando, e o limiar
  correto continua legível em `V041-05`/`V041-07`.
  **Número errado é pior que número ausente**: `8 g/lb` seria consumido por
  qualquer agente sem uma linha de aviso; um campo vazio não.
- **`V093-22`** — a varredura achou a mesma família noutro lugar: peso corporal
  gravado como `25,6 lb`. Áudio: `255.6 pounds`. Bate com `V005-01` (256,2 lb) e
  `V095-15` (255,5 lb). Corrigido com `verified: "whisper"`.
- **`V045-02`** — `75 lb` no agachamento. Áudio: `705 pounds`. Bate com `V157-02`
  (700 lb × 2). Corrigido com `verified: "whisper"`.

Veredito humano dos cinco gravado em `research/kb/suspeitos-whisper.json`
(`vereditoHumano` + `nota`), que passou de 6 para 11 entradas.

### O defeito atrás do defeito: o comparador estava cego

`verify-suspects.mjs` deu **`CONFIRMADO` automático** para `V041-21` e `V041-22`.
Ele comparava legenda com áudio depois de passar os dois por `norm()`, e o
`norm()` apagava toda pontuação — inclusive o ponto decimal. `0.8` virava `0 8`,
o `8` da legenda era encontrado, e o comparador cravava "bate".

Ou seja: a única ferramenta construída para pegar erro de número era **cega
exatamente para o erro de décimo**, que é a forma mais cara de errar número numa
claim de nutrição. Corrigido: `norm()` agora protege o separador entre dígitos
antes de limpar a pontuação (ponto final de frase continua virando espaço, senão
o alinhamento perderia palavras). Depois do conserto, os dois alvos saem
`DIVERGENTE`, que é o certo.

O `RUNBOOK.md` §7 já suspeitava do comparador — pela razão oposta, "6/6
divergente no `R002`". O defeito era mais grave que o suspeitado: falso
`CONFIRMADO`, não falso `DIVERGENTE`.

### Como conferir

```
node research/tools/check-evidence.mjs V041-21 V041-22 V043-27 V093-22 V045-02
node -e 'JSON.parse(require("fs").readFileSync("research/kb/suspeitos-whisper.json","utf8")).forEach(r=>console.log(r.id,r.vereditoHumano??r.veredito))'
```

### O que a varredura cobriu — e o que não cobriu

Coberto: os 8 `params` com `frame` `g_por_lb`/`g_por_kg` da base inteira; os 239
`params` de toda claim com tópico `nutricao`, `peso-corporal`, `cutting` ou
`bulking`; a assinatura de decimal colado (`about8`) em todas as transcrições dos
dois corpora — **uma única ocorrência**, o próprio `V043-27`; e os dois `suspect`
de nutrição restantes (`V093-22`, `V045-02`), ambos confirmados como corrupção de
separador decimal e corrigidos.

**Não coberto:** os outros 137 alvos de `list-suspects.mjs`. A perda do `0.` não
tem assinatura textual confiável — em `R041` a legenda escreveu `6 g` com espaço
normal, indistinguível de um seis legítimo. Só o áudio separa os dois casos, e
isso é o passe do `verify-suspects.mjs` rodando até o fim, não uma varredura de
texto. Com o comparador consertado, agora ele pode achar.

---

## 2. `F001` não estava registrado em `sources.mjs`

### O que era

143 claims `tier: O`, o único tier da base onde discordar não é opção, e o
registro de fontes não conhecia a fonte. Funcionava por acidente: o
`check-claims.mjs` cai no prefixo do arquivo quando não acha a fonte, e claim
`tier: O` nunca passa pelo laço de `byRef`. Três coisas quebravam mesmo assim:

1. o prefixo `F` não estava protegido contra colisão — uma fonte nova podia
   pegá-lo e ninguém reclamaria antes do estrago;
2. `REF_NA_PROSA` é montado a partir das chaves deste registro, então uma claim
   que citasse `F001` na prosa tinha os três dígitos lidos como "número sem
   procedência";
3. **a tabela de precedência dava `regras-ipf` e `comandos-ipf` ao Blevins** — um
   YouTuber ganhando do regulamento no que o regulamento diz —, simplesmente
   porque não havia mais ninguém reivindicando os dois tópicos.

### Ele cabia no registro?

Não como estava. Todo campo do registro é de canal: `channelId`, `handle`,
`postRun1`, `testado`, `dir` com `transcripts/`, `captions/` e `dates.json`. Um
PDF preenchendo isso seria mentira em cinco campos, e mentira em registro é o que
produz o agente que "seguiu o padrão existente" para o lugar errado.

Então o registro passou a ter **duas formas**, discriminadas por `kind`:

| | `kind: 'canal'` | `kind: 'normativo'` |
|---|---|---|
| identidade | `channelId` / `handle` | nome do documento |
| corpus | manifesto + transcrição + legenda + data por vídeo | um documento, uma vigência |
| `postRun1`, `testado` | sim | **não existem** — documento não publica em série nem compete |
| prefixo, `idPrefix`, `mandaEm` | sim | sim — é para isso que o registro serve |

E as funções passaram a recusar em vez de improvisar:

- `resolveSource()` só devolve `kind: 'canal'`. Os quatro chamadores dela
  (`build-manifest`, `fetch-captions`, `fetch-dates`, `verify-manifest`) são
  pipeline de YouTube; `--source ipf` agora sai com mensagem, não com `yt-dlp`
  apontado para um PDF.
- `paths()` devolve para fonte normativa **só** `dir` e `manifest`. Não devolve
  `transcripts`, `captions`, `dates` nem `tmp`: quem pedir recebe `undefined` e
  quebra alto, em vez de receber um caminho plausível para uma pasta que não
  existe. O `manifest` é devolvido de propósito, apontando para arquivo que nunca
  vai existir, porque é assim que o `check-claims.mjs` — que chama `paths()` para
  toda fonte — pula a fonte normativa sem precisar de um `if` dentro dele.
- `channelVideosUrl()` lança para fonte normativa.

**O que deliberadamente não entrou:** versão, vigência, URL e caminho do PDF. Isso
já mora em `source` dentro de cada uma das 143 claims, que é onde o checker
confere o verbatim. Repetir aqui criaria a 144ª cópia — e seria a cópia que
ninguém atualizaria quando saísse o rulebook de 2027.

### A consequência de precedência

`comandos-ipf` e `regras-ipf` saíram do Blevins e foram para `ipf`. Ele continua
mandando em `natural-vs-enhanced`, `competicao`, `pico`, `taper`, `volume` e
`recuperacao` — é a melhor testemunha de **como** a regra é aplicada na
plataforma; não é autoridade sobre **o que** a regra diz. `competicao` fica com
ele de propósito: como é o dia de competição não está escrito em regulamento
nenhum.

A fonte `ipf` também **não** pegou `profundidade`: a regra define o critério de
validade, não a técnica para atingi-lo.

### Como conferir

```
node research/tools/check-claims.mjs                 # o laço de mandaEm recusa dono duplo
node research/tools/fetch-dates.mjs --source ipf     # recusa com mensagem, não com stack
node research/tools/check-evidence.mjs F001-01
```

---

## 3. A premissa dos "93 % do Blevins"

O comentário de precedência do `sources.mjs` dizia: *"93 % do canal do Blevins é
de 2013–2018 contra um Vena que publicou este mês"*, e concluía que a data mataria
o Blevins em quase todo empate.

**Contado:** os 93 % são verdade sobre o canal e falsos sobre a base.

| | vídeos | claims |
|---|---:|---:|
| canal inteiro, 2013–2018 | 329 de 354 (**92,9 %**) | — |
| **extraído**, 2016–2018 | 25 de 50 | **781 de 1.819 (42,9 %)** |
| **extraído**, 2022 em diante | 25 de 50 | **1.038 de 1.819 (57,1 %)** |

A triagem filtrou pesado: dos 270 vídeos de 2013–2015 do canal, **nenhum** foi
extraído. O mais antigo na base é de 12/09/2016; o mais novo, de 11/06/2025. O
Vena vai até 08/08/2026.

A regra de credencial-primeiro continua valendo, e a justificativa certa é mais
estreita: as 781 claims antigas são justamente onde mora o material de competição
dele — `competicao` 86 contra 19, `pico` 61 contra 30, `regras-ipf` 14 contra 0,
`comandos-ipf` 9 contra 0, comparando a metade antiga com a recente. Data crua não
apagaria o Blevins inteiro; apagaria exatamente a parte pela qual ele foi
ingerido, e deixaria de pé a metade recente, que é mais genérica.

O comentário foi reescrito com esses números e com o registro de qual era a
alegação anterior — comentário que só mostra o número novo não ensina ninguém a
desconfiar do próximo.

### A consulta que produziu os números

```js
// node -e '...'  a partir da raiz do repositório
const fs = require('fs');
const b = require('./research/corpus/blevins/manifest.json');
const dataDe = new Map(b.videos.map((v) => [v.ref, v.date]));
const porAno = {};
let total = 0;
for (const f of fs.readdirSync('research/extract').filter((x) => /^G\d+\.jsonl$/.test(x))) {
  const n = fs.readFileSync(`research/extract/${f}`, 'utf8').split('\n').filter((l) => l.trim()).length;
  const ano = String(dataDe.get(f.replace('.jsonl', ''))).slice(0, 4);
  porAno[ano] = (porAno[ano] ?? 0) + n;
  total += n;
}
console.log(porAno, total);
// { '2016': 353, '2017': 394, '2018': 34, '2022': 8, '2023': 708, '2024': 250, '2025': 72 } 1819
```

---

## 4. O default de `--limit` do `check-evidence.mjs`

### O que era

Default 40, calibrado para uma base menor. Hoje são 6.909 claims em 74 tópicos, e
**62 dos 74 tópicos passam de 40**. O aviso de corte existia — `990 claim(s) para
topic=agacho (mostrando 40)` — e era tecnicamente correto e praticamente
invisível. Quem lê "40 de 990" de passagem conclui que viu o assunto, e decide com
4 % da evidência achando que decidiu com tudo. É a leitura errada mais cara que
esta ferramenta pode induzir, porque produz exatamente a confiança que ela existe
para tirar.

### O default novo: 120, e por que esse número

**120 é a mediana do tamanho dos tópicos hoje.** É o único número disponível que
não é chute: metade dos tópicos sai completa. Subir até cobrir `agacho` (990
claims, ~6.000 linhas) não é opção — despejar isso no contexto de um agente
destrói a consulta seguinte, e corte anunciado é melhor que contexto estourado. O
número é recalculável quando a base crescer, e o comentário no arquivo diz como.

`--limit 0` desliga o corte. `--limit` não numérico agora sai com erro em vez de
virar `NaN` silencioso.

### O aviso novo

Aparece **duas vezes** — antes e depois da listagem, porque saída longa se lê
pelas pontas — em bloco delimitado, e:

- conta o que **ficou de fora**, não o que entrou (`FICARAM 870 CLAIMS DE FORA`);
- declara que o corte é por ordem de arquivo, **não** por relevância;
- mostra a composição do que sumiu, por `modo` e por `tier` — ver "ficaram 870
  fora, sendo 43 prescrições" torna impossível confundir a amostra com o assunto;
- entrega o comando pronto para copiar, com os mesmos filtros e `--limit 0`;
- fecha com a frase que o leitor precisa não poder ignorar: *"Enquanto não vir
  tudo, a frase 'a base diz X sobre isto' não se sustenta."*

### Como conferir

```
node research/tools/check-evidence.mjs --topic agacho | head -14
node research/tools/check-evidence.mjs --topic agacho | tail -12
node research/tools/check-evidence.mjs --topic powerbuilding   # 5 claims, sem aviso
node research/tools/check-evidence.mjs --topic agacho --limit abc   # sai 2
```

---

## 5. O `G033`

### Por que não foi extraído

*"Garrett Blevins - Arnold 2017 3 IPF World Records"*, 2:45. **Não tem fala.** É
filmagem de plataforma com trilha sonora. Duas evidências independentes:

1. `yt-dlp --list-subs` responde `has no automatic captions` e `has no subtitles`.
   O YouTube não legenda faixa sem fala detectada — a ausência de legenda é o
   sintoma, não a causa.
2. O áudio inteiro no `large-v3-turbo` devolve só alucinação de silêncio: `Music`
   ×5, `Transcription by CastingWords` ×2, `We'll be right back` ×2, `Thank you`.
   O modelo ainda "transcreve" 11 s além da duração do vídeo, que é a assinatura
   clássica de faixa sem voz.

### Portanto, não é extraível

Sem fala não há `verbatim`, e sem `verbatim` não há claim `tier: R` — o
`PROTOCOLO-EXTRACAO.md` não deixa margem e está certo. O fato valioso do vídeo,
três recordes mundiais IPF no Arnold 2017, está no **título e no metadado**, não
no corpus. Se for entrar na base, entra como credencial `tier: E` com URL, num
passe que não é o de extração, e nunca como `R`.

**Nenhuma claim foi emitida.** Emitir aqui seria inventar evidência com a
justificativa de que o vídeo é importante — e é justamente quando o assunto
importa que essa tentação aparece.

### O conserto que sobrevive a este passe

O problema não era o `G033`; era `transcript: null` significar duas coisas com
consertos opostos — "ninguém buscou ainda" e "buscamos, e não existe o que
buscar". Os 21 nulos do Blevins misturavam os dois casos, e o `G033` custou uma
investigação inteira para redescobrir um fato que o pipeline já sabia e jogou
fora.

`fetch-captions.mjs` agora grava o motivo no manifesto:

```json
"semLegenda": { "motivo": "sem legenda em inglês", "verificadoEm": "2026-08-09" }
```

Sucesso posterior apaga o campo; `--force` tenta de novo. Aplicado ao `G033`
rodando a própria ferramenta, não à mão — o diff no manifesto é de uma entrada só.

`BLEVINS-INGESTAO.md` §6.3 recebeu o fechamento com as duas evidências.

### Como conferir

```
node -e 'console.log(require("./research/corpus/blevins/manifest.json").videos.find(v=>v.ref==="G033"))'
yt-dlp --list-subs "https://www.youtube.com/watch?v=gN3fmewCW9E"
```

---

## 6. `research/predicoes.md`

### O veredito: presta, e ficou

Auditado antes de decidir. O que foi conferido mecanicamente:

- os **24 ids** `V###-##` citados resolvem, todos, contra a base. O arquivo
  afirmava isso de si mesmo no rodapé; agora a afirmação foi **executada** em vez
  de acreditada;
- os rótulos `[GERAL]` / `[PESSOAL]` batem com o `scope` gravado, nos **15 ids**
  em que o texto declara escopo — 15 conferem, 0 divergem. Achatar os dois é o erro
  mais caro desta base e o mais fácil de cometer escrevendo prosa;
- as paráfrases entre aspas dos 8 ids de maior carga (`V115-22`, `V115-24`,
  `V040-24`, `V116-15`, `V092-22`, `V027-23`, `V001-08`, `V101-14`) conferem com a
  `claim` e o `verbatim` — nenhuma distorce a fonte;
- `F001 §6.3.6`, citado em **P20**, existe e diz o que P20 diz que diz
  (`F001-129`: três tentativas falhas em qualquer movimento eliminam o atleta).

E o conteúdo se sustenta: é o único artefato do repositório que pode **errar de
forma visível**. Tem prazo, limiar de falseamento e, em cada linha, a claim que
morre em cada desfecho. Declara as próprias fraquezas em vez de escondê-las —
`P08` está marcada como hoje infalsificável por falta de protocolo de medida, e
`P20` como feita sem taxa-base.

### O que estava errado era o endereço

Estava em `research/predicoes.md`, fora de `research/kb/`, fora do `RUNBOOK.md`,
sem ninguém tendo decidido que devia existir — e escrito numa rodada cuja
instrução era não editar nada. Arquivo sem dono não fica neutro: vira autoridade
por antiguidade.

Feito:

- movido para **`research/kb/PREDICOES-BLOCO1.md`**;
- cabeçalho de procedência: como nasceu, o que foi conferido, **o que não foi**, e
  por que fica;
- registrado na tabela de fontes de verdade do `RUNBOOK.md`;
- **nenhuma linha de previsão foi tocada.** A regra do próprio arquivo — só
  anotação a partir de 10/08/2026 — foi respeitada: a mudança aconteceu em
  09/08/2026, antes do prazo.

### O que não foi conferido, e não dá para conferir

Se as previsões são **boas**. Determinismo prova fidelidade à fonte, não correção
da fonte. Os intervalos saem de `design.md` e `baseline.md`, cuja fragilidade o
próprio arquivo declara no aviso de procedência: as referências 215/160/240 são
estimadas, e o fator de profundidade que produz os 215 kg não tem fonte no corpus.
Um id que resolve não vira um número que acerta.

### Como conferir

```
node research/tools/check-evidence.mjs $(grep -oE 'V[0-9]{3}-[0-9]+' research/kb/PREDICOES-BLOCO1.md | sort -u | tr '\n' ' ')
```

---

## 7. O que NÃO foi feito, e por quê

### Relatado em vez de consertado — exige tocar em arquivo de outro dono

`check-claims.mjs`, `SCHEMA.md` e `PROTOCOLO-EXTRACAO.md` estão sob outro agente
nesta fase, e o enumerado de `frame` é um objeto só com o documento. Estes cinco
`params` estão na gaveta errada e o conserto passa por lá:

| id | param | hoje | o que é |
|---|---|---|---|
| `V164-16` | `agua_reposta` | `8 litros` no frame `ml` | ou vira `8000 ml`, ou precisa do frame `l` (que já existe) |
| `V104-27` | `altura_pes`, `altura_com_sapato` | `5` e `6` **pés** no frame `cm` | falta o frame de pés/polegadas como par |
| `V102-25` | `met_minutos_semana` | `12200 MET-min/semana` no frame `min` | MET-minuto não é minuto; falta gaveta |
| `V044-07` | `bri_min`, `bri_max` | `4,5`–`5,5` **BRI** no frame `pct` | índice corporal não é percentual; `IMC` tem gaveta própria, BRI não |
| `V081-15` e 3 irmãs | `aumento_taxa_ganho_muscular` | `value: "1/3"` — **string**, não número | fração literal escapa de toda aritmética do checker |

Os quatro primeiros são o defeito conhecido: **a trava estreita empurrou o dado
para fora da trava**. O quinto é pior de um jeito diferente — um `value` que é
string passa por toda checagem numérica sem ser vista.

Nada disso foi tocado. Pertence à tarefa de reparo de `frame` (#27) e à #31.

### Deixado aberto de propósito

- **`research/kb/SUSPEITOS-VERIFICADOS.md` continua não existindo.** O
  `verify-suspects.mjs --report` o geraria a partir do JSON, mas o JSON tem 11 de
  148 alvos. Um relatório com esse nome, gerado agora, pareceria a conclusão do
  passe de verificação e não é — e criar um documento que parece completo é
  exatamente o modo de falha do §6. Fica para a tarefa #24, com o comparador já
  consertado.
- **Os 137 alvos restantes do `list-suspects.mjs`.** Cada um custa download de
  áudio e uma janela de Whisper. Rodar em escala agora, com o comparador recém
  consertado, é o próximo passo natural — e só agora ele vale, porque antes o
  comparador dava `CONFIRMADO` falso em decimal.
- **Os outros 20 vídeos do Blevins sem transcrição.** Só o `G033` estava dentro da
  faixa triada para extração. Os demais (`G078`, `G246`, `G3xx`) nunca foram alvo.
  Passar `fetch-captions.mjs` neles agora gravaria o `semLegenda` de cada um e
  fecharia a ambiguidade do `null` para o corpus inteiro — não foi feito porque
  são 20 chamadas de rede fora do escopo deste passe.
