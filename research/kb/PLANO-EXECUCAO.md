# PLANO-EXECUCAO — o que será construído, em que ordem, e o que não será

**Escrito em 09/08/2026**, contra o commit `55f6807` da base (5.090 claims) e o estado do
código em `main` (`136582c`). Tudo o que este documento afirma sobre o repositório foi
medido hoje, com o comando ao lado. Tudo o que ele afirma sobre a *qualidade das respostas*
vem de uma medição que sabidamente falhou — e a §0 diz o que isso custa.

---

## 0. CALIBRAÇÃO PRIMEIRO — o que os canários fazem com este plano

Quatro canários entraram misturados às 29 perguntas. **Dois divergiram, e os dois na mesma
direção:** C3 (literatura, tier L = 0 claims) e C4 (Blevins, tier G = 0 claims) foram
julgados "responde-bem". Confirmei o denominador hoje:

```
tiers na base: { O: 143, R: 4947 }        ← L, E, U, G, W em ZERO
```

Uma resposta com PMID ou com Blevins não podia ter vindo da base. Veio do agente. Logo:

**O placar não é uma medida da base — é o teto otimista dela.** "3 falhas em 29" só é
verdade se o avaliador nunca respondeu de fora nas outras 26, e já sabemos que ele
respondeu em pelo menos 2 casos onde dava para provar. O número real de falhas é
desconhecido e é **≥ 3**.

**O que isso proíbe:** priorizar por placar. Não posso dizer "26 estão bem, ataque as 3".

**O que sobrevive, e é sobre isso que este plano é construído:**

1. **As três falhas medidas (Q17, Q02, Q10)**, porque o julgador não aceitou a palavra do
   respondedor: ele re-rodou as buscas e achou `V125-13` e `V111-04` que a resposta de Q17
   declarou inexistentes, e baixou o dump CC0 e rodou `bombout.mjs` para obter 4,63% de
   159.907 estreantes. Isso é verificação contra o repositório e contra a fonte, não
   opinião sobre prosa.
2. **Tudo o que eu mesmo conferi no repositório hoje**, que não depende de nenhum
   julgamento: `PainRegion` sem peitoral, `buildFlags` disparando em 6/10 contra um gate de
   2/10, `--limit` default 40 com 56 de 68 tópicos acima disso, `modo` 0/5090, `conditions`
   0/5090, `conflicts` 3, proteína gravada como `6 g/lb` e `8 g/lb`, `F001` sem fonte
   registrada em `sources.mjs`.

**Consequência operacional, e é o item 0 da ordem:** antes de qualquer construção nova,
o instrumento é reconstruído. Um segundo relatório sobre o mesmo instrumento produz a mesma
ilusão com mais confiança. Plano ambicioso sobre medição furada é a pior entrega possível,
e a §0 existe para que este não seja um.

---

## 1. A regra de separação, e o limite dela

**Onde um compilador pode verificar, agente não deve.** Foi essa regra que pegou um
verbatim inexistente e um número sem unidade que a revisão por prosa aprovou na rodada
anterior.

**O limite, declarado:** determinismo prova **fidelidade à fonte** e não diz nada sobre
**correção da fonte**. `check-claims.mjs` aprovou `proteina_por_lb = 8 g/lb` — 1.536 g de
proteína por dia para 87 kg — porque o `verbatim` confere com a transcrição, e a
transcrição diz `about8` (o ponto decimal caiu no ASR). O checker fez exatamente o que
promete. Uma base perfeitamente fiel a um homem de 120 kg que não compete testado pode
estar perfeitamente errada para um natural de 87 kg, e nenhum lint jamais vai notar.

Por isso as travas determinísticas abaixo são todas **prova**, nunca estimativa:

- Regra que erra manda gente consertar o que estava certo. `52 séries/semana` existe mesmo
  no corpus — nenhuma faixa de plausibilidade toca `frame: series`.
- Aviso sem conserto ensina a ignorar avisos. Toda trava abaixo **quebra o build** ou
  **imprime o conserto**; nenhuma é warning decorativo.

---

## 2. DETERMINÍSTICO — só o que é prova

### D1 · `PainRegion` não tem peitoral · `src/types/index.ts:465`
```ts
export type PainRegion =
  | 'lower_back' | 'upper_back' | 'left_knee' | 'right_knee'
  | 'left_shoulder' | 'right_shoulder' | 'left_hip' | 'right_hip'
  | 'left_elbow' | 'right_elbow' | 'left_wrist' | 'right_wrist'
  | 'neck' | 'other';
```
O único gate de segurança do bloco (`PROGRAMA.md` §1.2, linhas 404–406) é escrito sobre
dor no **peitoral**, em três momentos por sessão de supino. O enum não tem peitoral. Uma
fisgada de 3/10 no peito só pode ser registrada como `other` — e `other` não é o eixo
`exposicao_peito`, então **congelamento de degrau, recuo e encerramento de sessão nunca
disparam**. Isto não é lacuna de conhecimento; é bug de enum.
**Conserto:** `chest`, `left_pec`/`right_pec`, `triceps`, `lat`, `adductor`, `hamstring`
— e uma trava que exige que toda região citada por `PROGRAMA.md` §1.2 exista no enum.
**Resolve:** Q03, Q05, Q25, Q27, e P10–P12 de `predicoes.md`.

### D2 · `buildFlags` dispara em 6/10 contra um gate que para em 4/10 · `src/services/sync/weeklyRollup.ts:404`
```ts
if (p.occurrences >= 3 || p.maxIntensity >= 6) { … }
```
`PROGRAMA.md` §1.2: **≥2/10 congela**, **≥4/10 encerra a sessão**. O rollup semanal só
levanta a mão em **≥6**. Os dois números estão escritos, discordam, e o mais frouxo é o que
o código executa. **Não é estimativa: é dois limiares literais em desacordo.**
**Conserto:** limiar por região — `≥2` nas regiões do eixo `exposicao_peito`, `≥4` no
resto; e o flag carrega qual degrau congelou.
**Resolve:** Q03, Q11, Q27.

### D3 · Truncagem silenciosa · `research/tools/check-evidence.mjs:42`
```js
const LIMITE = Number(arg('--limit') ?? 40);
```
Medido hoje: **56 dos 68 tópicos passam de 40 claims**. `--topic sono` devolve 54. A
resposta de Q17 escreveu "`--topic sono` → 20+ claims, **todas** de higiene de sono" e a
claim que respondia a pergunta (`V176-05`) estava na posição 54 de 54. A ferramenta imprimiu
`(mostrando 40)` e isso virou prova de ausência.
**Conserto:** `⚠️ TRUNCADO: 40 de 54` em destaque **e a lista dos 14 ids omitidos** (só id,
uma linha cada). O conjunto nunca fica silenciosamente parcial.
**Resolve:** Q17, Q08, Q16, Q20.

### D4 · A ferramenta não alcança metade da base · `check-evidence.mjs:31`
`const EXTRACT = join(ROOT, 'research/extract')` — todo `research/kb/*.md`, `design.md`,
`baseline.md`, `RUNBOOK.md` está fora de alcance. Q10 precisava de `ROSTER-CURADO.md`
§4.1 (linha 580: a URL do zip CC0, as colunas, "tentativa negativa = tentativa falhada").
O agente rodou `find . -iname "*openpowerlifting*"`, que só olha **nomes de arquivo**, e
concluiu que a fonte não existia — com a receita escrita num documento do próprio briefing.
**Conserto:** `--docs <regex>`, grep sobre `research/**/*.md` fora de `extract/`, imprimindo
`arquivo:§seção:linha`.
**Resolve:** Q10, Q04, Q22, Q23, Q29.

### D5 · Faixa de plausibilidade por frame, quebrando o build · `check-claims.mjs`
Erros confirmados hoje:

| claim | gravado | verbatim | real |
|---|---|---|---|
| `V041-21` GERAL | `proteina_por_lb = 6 g/lb` | *"something like 6 g per pound"* | 0,6 |
| `V041-22` GERAL | `proteina_por_lb_dedicado = 8 g/lb` | *"go for 8 g or 1 g"* | 0,8 |
| `V043-27` GERAL | `proteina_por_lb = 8 g/lb` | *"no benefits beyond about8 g per pound"* | 0,8 |
| `V050-01` | `agacho_terra = 8800 lb [1RM_treino]` | *"8,800 lb squat and deadlift"* | soma de ciclo |
| `V033-10` | `delta_rpe_ciclo_b = 12 RPE` | *"2 and 12 to 3 RP"* | 2,5 |
| `V013-16`, `V019-02`, `V122-01`, `V175-08`, `V175-40` | ano civil em `frame: anos` | — | data, não duração |

`8 g/lb` = 17,6 g/kg = **11× o registro da MESMA meta-análise** em `V041-05`/`V041-07`
(`1.6 g_por_kg`). Para 87 kg dá 1.536 g/dia. A base já se contradiz sozinha e ninguém viu.
**Conserto (prova, não estimativa):** faixa física apenas onde ela é incontroversa —
`g_por_lb ∈ [0,2; 2,0]`, `g_por_kg ∈ [0,5; 4]`, `RPE ∈ [0;10]`, `RIR ∈ [0;10]`,
`escala_dor ∈ [0;10]`, `pct_1RM ∈ [0;110]`, `1RM_treino` em lb ≤ 1200, `x_semana ≤ 14`,
`anos ≤ 100`. **`frame: series` fica de fora** — 52 séries/semana existe mesmo, e a regra
que o incluísse mandaria consertar o que está certo. Mais o detector de decimal caído:
`verbatim` casando `/\babout ?\d\b/` ou `/something like \d g per (pound|lb)/` sem ponto
decimal → erro nomeado.
Correção grava `params[].asrFix` com o token literal, para que a claim continue fiel ao
verbatim e o número continue verdadeiro.
**Resolve:** Q06, Q19, Q20, Q24, Q02.

### D6 · Aviso obrigatório de condição ausente
`conditions` está em **0 de 5.090** — medido. E há **401 claims `GERAL` com param**. Cada
uma delas é uma prescrição numérica servida sem a condição que a torna segura. O caso
canônico, verificado hoje: `V170-33` [PESSOAL] — *"i do it six days a week … and i think
most people should do it"* — e a condição que a torna segura, `V175-53` [GERAL] — *"very
attainable for most people **as long as you keep it really sub-maximal**"* — estão em
**vídeos diferentes**, sem nenhuma aresta entre elas. O par curto (`V154-07` → `V154-08`,
um id de distância) também não tem aresta.
**Conserto:** enquanto `conditions === 0`, toda claim `GERAL` com param impressa por
`check-evidence` sai com `⚠️ condição não registrada — abra o R{n}.jsonl vizinho no
timestamp antes de agir`. É fato sobre o campo, não julgamento.
**Resolve:** Q05, Q06, Q17, Q19.

### D7 · `--vizinhos <id>` — ±3 no mesmo `R{n}.jsonl`
O par prescrição/condição foi extraído; o que falta é a aresta. Enquanto ela não existe,
a recuperação por proximidade é mecânica e barata.
**Resolve:** Q05, Q13, Q17.

### D8 · Trava de id em documentos, não só em claims
`check-claims.mjs` recusa o build se um id citado em `research/kb/*.md`,
`research/synth/*.md`, `design.md`, `baseline.md` ou `predicoes.md` não resolver. É a mesma
trava que já protege a extração, estendida à camada que governa as cargas. Junto: a tabela
`research/kb/CITACOES-EXTERNAS.md`, uma linha por sobrenome citado em `design.md` /
`PROGRAMA.md`, mapeando para um id tier L **ou** para a marca `SEM FONTE NA BASE`. Hoje
`grep -rnE "PMID|doi|10\.[0-9]{4}" research/` devolve **zero**, e `design.md` prescreve
taper, corte de volume, teto de RPE e abertura apoiado em Travis, Zourdos, Pak, Schumann,
Helms — sobrenomes que não resolvem em lugar nenhum. Sob "Pak" convivem três números
diferentes em três documentos.
**Resolve:** Q02, Q06, Q15, Q19, Q28.

### D9 · Prefixos e fontes sem manifesto de vídeo · `research/tools/sources.mjs`
`PREFIXOS_RESERVADOS = {E,L,I,U,V,O}`, `SOURCES` só tem `vena` e `blevins`, e `paths()`
assume `manifest.json` + `transcripts/` + `captions/`. **`F001` existe em
`research/extract/F001.jsonl` sem fonte registrada.** Um paper e um CSV não têm manifesto
de vídeo, então nenhuma claim de literatura ou de dados tem hoje prefixo legal — e
`AVALIACAO.md` T1 reprova a rodada inteira com um id não resolvível. Ingerir literatura
antes deste conserto produz evidência que o julgador é obrigado a rejeitar.
**Conserto:** `P` (papers), `W` (dados públicos), `F` (normativo, formalizando o que já
existe); tipo de fonte `documento` que dispensa manifesto; `resolveSource` aceita as três.
**Resolve:** desbloqueia F1–F5 abaixo, logo Q03, Q10, Q12, Q17, Q22.

### D10 · `testado` exige `basis`
`sources.mjs:63` grava `testado: false` para o Vena, com um comentário afirmativo. A base
diz o contrário com dez claims que resolvem — `V173-09` (*"as a top level lifter in ipf,
that is the drug tested side… i have to tell them every three months where i'm gonna be"*),
`V173-10`, `V173-11`, `V173-12`, `V051-21`, mais os manifestos `R083` (Canadian Nationals),
`R022`, `R154` (World Championships). O booleano governa `mandaEm`, e portanto o desempate
entre fontes quando o Blevins chegar.
**Conserto determinístico (só isto):** o campo deixa de ser booleano, passa a exigir
`basis: [ids]` e o build falha sem ele. **Qual valor ele recebe é julgamento — vai para
A4.** Carimbar `false` e carimbar `true` reprovam igualmente por `AVALIACAO.md` §5 / I-1.
**Resolve:** Q07, Q20, Q21.

### D11 · Gate de vivacidade do log
`AVALIACAO.md`: abaixo de **70% de sessões registradas nas últimas 4 semanas** a rodada não
é executada. Isso é computável do rollup e hoje não é computado. O modo de falha nº 1 deste
projeto não é responder errado — é o log parar na semana 5.
**Conserto:** script que imprime a taxa e sai com código ≠ 0 abaixo de 70%; a conversa de
domingo não abre sem ele.
**Resolve:** Q11, Q17, Q26, Q27 (e é pré-condição de todas as outras).

---

## 3. AGENTES — o que exige julgamento

Nenhum item aqui entra sem `comoVerificar`. Agente sem verificação é a receita que já
falhou uma vez neste projeto — foi assim que o fator de −12 a −18% chegou ao programa.

**A0 · Reconstruir o instrumento de avaliação.** Canários novos, com trava: toda afirmação
factual da resposta tem de vir com id que resolve, e o julgador descarta a afirmação sem id
**antes** de julgar. Pelo menos 3 canários de tier vazio.
*Verificar:* se um canário de tier vazio voltar a ser "responde-bem", a rodada inteira é
descartada e não vira plano.

**A1 · Cindir `frame: series` em `series_por_semana` × `series_por_sessao`** e varrer os
**138** params medidos hoje. É o único frame errado que produziu uma contradição fantasma
que chegou ao `design.md`.
*Verificar:* `check-claims` rejeita `frame: series` cru; os 138 reclassificados um a um com
o verbatim que decidiu; a contradição fantasma some e o teste que a reproduzia falha.

**A2 · Preencher `modo`** (0/5.090 hoje), começando pelas **401 GERAL com param**.
`scope: GERAL` não é prescrição — `AUDITORIA-SCOPE.md` mediu 17%.
*Verificar:* amostra cega de 50 reclassificada por um segundo agente, concordância ≥ 85%;
e a fração `modo: prescricao` bate com os 17% da auditoria dentro de ±3 pontos.

**A3 · A aresta prescrição→condição.** Proposta mecânica por proximidade (mesmo `src`,
|Δseq| ≤ 2 — cobre ~68%) **revisada à mão, nunca gravada direto**; mais os casos distantes
que a proximidade não pega — todos verificados hoje: `V039-10` e `V019-24` condicionando
`V006-25`; `V064-22` condicionando `V016-29`; `V175-53` condicionando `V170-33`
(vídeos diferentes).
*Verificar:* 100% das 401 GERAL com param têm `conditions` **ou** a marca
`condicao-nao-registrada`; e um teste de regressão em que consultar "supino 6 dias por
semana" devolve `V175-53` (*"as long as you keep it really sub-maximal"*) na mesma saída.

**A4 · Decidir o eixo de desconto da fonte, e escrever `testado` com basis.** O eixo não é
farmacológico — `ANTIDOPING-BR.md` §3.2 mediu mediana **idêntica** (535,0 kg) entre meets
testados e não testados na faixa 74–93 kg. O eixo medido é **carga absoluta** (`V143-07`,
`V114-20`, `V049-27`), e ele aponta para **cima**.
*Verificar:* `mandaEm` deixa de derivar de `testado`; o comentário cita os ids dos dois
lados; e nenhuma resposta da rodada seguinte usa status farmacológico como razão de dose.

**A5 · Decidir a variação de pausa acima do paralelo.** A base devolve com redundância
(`V016-29`, `V099-05`, `V099-07`, `V099-08`, `V124-23`, `V132-27`) uma pausa **5 cm acima
do paralelo** — o padrão motor exato que o Bloco 1 existe para desfazer num atleta com
exposição zero à profundidade legal. `V099-05` é GERAL e é um swap de programa **sem** a
condição (descer tudo, pegar o bounce, pausar na subida).
*Verificar:* `PROGRAMA.md` não contém nenhuma linha de pausa acima do paralelo no Bloco 1;
a claim sai da consulta com a condição ligada; teste que falha se ela reentrar.

**A6 · Escrever o protocolo da tarde de medição** — três singles por levantamento sob
comando lido em voz alta, filmados de dois ângulos, com o erro de medição declarado. O
produto do agente é **o protocolo**, não o número: o número é do corpo dele. É o que mata o
fator de −12 a −18% que hoje governa 215/160/240 e portanto toda carga do bloco, e que
`baseline.md` §1 é o único dos três a citar **nenhuma** fonte.
*Verificar:* `baseline.md` §1 passa a citar o vídeo e a data; o fator sem fonte sai;
P01–P03 de `predicoes.md` ficam anotáveis contra um denominador medido.

**A7 · Registrar o atleta como claims tier U.** Peitoral rompido, nunca fez single, mudou a
técnica na semana 1, 87 kg, manutenção 2.600 kcal verificada, marcas de treino. Hoje tier U
= 0, e toda conversa de domingo recomeça do nada.
*Verificar:* os ids `U0xx` resolvem em `check-evidence`; uma conversa sem contexto de prompt
responde Q03 e Q17 corretamente.

**A8 · O ledger de contradições.** Hoje **3 arestas** em 5.090, contra 25 catalogadas na
rodada anterior. Contradição é para decidir, não para catalogar.
*Verificar:* ≥25 arestas bidirecionais; e **toda** aresta em horizonte de próxima sessão
termina em `decisao` escrita, com a assimetria de custo em números ou em tempo perdido.

**A9 · `INDEX.md` + `LEXICO.md` + TRÊS sínteses** (`dia-ruim`, `primeira-competicao`,
`profundidade`) — não doze. Só as amarradas às falhas medidas. Cada síntese tem a seção
obrigatória **OS DOIS POLOS**, com os dois lados lado a lado (é ela que teria trazido
`V111-04`, o contra-argumento do placebo negativo, que está em `mentalidade` e não em
`sono`), e a seção de **ausência com a busca que a estabeleceu**.
*Verificar:* re-rodar Q17 e Q10 com `INDEX.md` como primeira leitura obrigatória — a
afirmação falsa "todas de higiene de sono" tem de ser impossível de escrever, e `V176-05` e
`V111-04` têm de aparecer; D8 passa nos arquivos novos.

---

## 4. FONTES NOVAS — o que só se resolve trazendo material de fora

Todas dependem de **D9**. Antes dele, uma claim tier L não tem prefixo legal.

**F1 · Dump CC0 do OpenPowerlifting** (`openipf-latest.zip`, ~66 MB, verificado HTTP 200 em
08/08/2026). Não é corpus: é tabela + script que a regenera. Fecha a taxa de bomb-out
(4,63% de 159.907 estreantes M/Raw/SBD/IPF), a razão real entre tentativas, a coorte de
progressão pós-estreia e a distribuição de totais na 83/93. `research/tools/scan/julgar2/
bombout.mjs` já existe e roda em três minutos.
*Verificar:* o script regenera o número do zero e bate no mesmo snapshot; a data do dump
fica gravada na claim `W`.
**Resolve:** Q10, Q21, Q22, Q23, e P18–P20 de Q02.

**F2 · Prontidão** — Saw 2016 (PMID 26423706: medidas subjetivas superam objetivas, é o que
autoriza `PreWorkoutSurvey` a ser instrumento) e Craven 2022 (PMID 35708888: −7,56%,
~0,4%/hora acordado, **efeito concentrado à tarde e quase nulo de manhã**), mais 4–8 papers.
O segundo dá o lado que falta: se ele treina de manhã, o gatilho de Q17 tem de ser mais
frio — que é exatamente o que `V111-04` acusa.
*Verificar:* a regra de Q17 passa a ter basis externo **e** os dois sentidos; tier L passa
no `check-claims` (PMID obrigatório, já implementado).
**Resolve:** Q17, Q11, Q12, Q27.

**F3 · A camada probatória que já governa o bloco** — ~15 papers dos quais um número de
`design.md` já depende: Travis 2020 (32917000), Travis 2021 (34846328), Travis 2021 Front
Physiol (34777004), Burke 2023 (37639652 — testa a cessação que `design.md` §C2 declarou
métrica separada e ninguém sabia existir), Robinson/Zourdos 2024 (38970765),
Androulakis-Korakakis 2020 (31797219).
*Verificar:* `CITACOES-EXTERNAS.md` (D8) fecha — zero sobrenomes em `design.md` sem id L ou
sem a marca `SEM FONTE NA BASE`; e a atribuição "Pak", hoje com **três números distintos em
três documentos**, resolve num número com PMID ou vira ausência declarada.
**Resolve:** Q02, Q06, Q15, Q19.

**F4 · Peitoral** — Yu 2019 (30543493), Tarity 2014 (25295775, média de 111 dias perdidos),
Sahota 2020 (31821104), Kowalczuk 2022 (35025841), mais Barbell Medicine como tier E.
**Marca obrigatória junto da ingestão:** são coortes cirúrgicas e de futebol americano, não
estiramento conservador em levantador raw. Compram horizonte, não progressão de retorno ao
supino. Ingerir sem a marca troca uma lacuna por uma falsa âncora.
*Verificar:* toda claim carrega a população; e Q25 ou passa a ter horizonte com fonte ou
declara explicitamente que a progressão de retorno não existe na literatura ingerida.
**Resolve:** Q03, Q25, e P10–P12 de Q02.

**F5 · Tabelas de *fatigue percent* do RTS** — duas URLs, uma hora, ~10 claims tier E. As
duas versões publicadas **conflitam entre si** (3/5/7% vs. 2–4/4–8/8–12%) e ambas são
ancoradas em top set @8; não existe tabela para @4→@6, que é onde o bloco roda.
*Verificar:* entram como duas claims com a aresta de conflito declarada; e toda regra do app
que corte série por subida de RPE passa a citar o domínio, ou é marcada fora dele.
**Resolve:** Q11, Q12.

**F6 · Blevins, faixa alta** (51 vídeos, 121.207 palavras, download 100% pago, zero claims
extraídas). É o item mais caro da lista, **4–6 dias**, e é o único que compra
**segunda-fonte** em vez de cobertura: medido em `AVALIACAO.md` §8, mesmo a faixa alta não
fecha dia de prova, seleção de tentativa, corte de peso nem peitoral. As três falhas
medidas continuariam falhando com ele dentro. Vai por último, e **só depois** de a regra de
desempate declarar que credencial vence data nos tópicos de `mandaEm` — 93% do canal é de
2013–2018 e sob recência crua ele perde todo empate.
*Verificar:* a reprovação simétrica de `AVALIACAO.md` §7 deixa de ser automática — a rodada
cita fonte fora do Vena em Q07, Q20 e Q21; e a regra de desempate tem um caso testado.
**Resolve:** Q07, Q20, Q21.

---

## 5. NÃO RESOLVÍVEL — e como a base declara isso em vez de disfarçar

Registrar "não se sabe" é resposta legítima e superior a inventar. Cada item abaixo ganha
uma linha em `INDEX.md` §4 (ausência **com a busca que a estabeleceu** e a data), para que
o próximo agente não re-derive nem declare errado.

| # | O que fica aberto | Como a base declara | Resolve |
|---|---|---|---|
| N1 | **O telefonema à federação estadual.** Nenhum documento substitui, e é **perecível**: a janela de estaduais de 2026 fecha em novembro e o Brasileiro exige estadual no ano anterior | linha em `design.md` com data-limite **30/09/2026** e o custo do atraso (12 meses), amarrada a P22 | Q01, Q23 |
| N2 | **O fisioterapeuta que põe a mão no peitoral.** F4 compra arcabouço e horizonte; não compra a decisão | `INDEX.md` §4 + teto declarado dentro da própria síntese de dor | Q03, Q25 |
| N3 | **A calibração de RPE.** Impossível sozinho, e governa toda carga | toda carga derivada de RPE sai com `RPE não calibrado — viés desconhecido`, até A6 medir | Q12, Q11, Q06 |
| N4 | **O árbitro federado olhando três vídeos.** `IPF-CHECKLIST.md` ensina a aferir sozinho; ninguém sabe o erro dessa aferição | P08 já está marcada **hoje infalsificável** em `predicoes.md`; fica assim, não é removida | Q13, Q09, Q14 |
| N5 | **Recorde mundial: meta ou fantasia.** ~240 kg de distância. Sob qualquer resposta possível o plano dos próximos 24 meses é idêntico | UMA resposta, ≤400 palavras, com **data de reabertura**; quatro perguntas para um delta de decisão zero é consumo de ansiedade | Q21 |
| N6 | **Status farmacológico da fonte.** Discordância irredutível I-1 | fica em `AVALIACAO.md` §5, e o eixo de ajuste declarado é carga absoluta (A4) — que aponta para cima | Q07 |
| N7 | **Academia com barra rígida e anilha calibrada.** Logística local | `INDEX.md` §4, com o flag que já existe (`thick_plastic`) como medida do dano | Q29 |

---

## 6. ORDEM — e por que reparo vem antes de síntese

Erro de dado vira norma para o próximo agente. Aconteceu três vezes nesta rodada, com
agentes copiando convenção errada dos arquivos vizinhos e chamando de precedente. Nada de
síntese é escrito antes de a base parar de mentir com procedência tipada.

1. **A0** — reconstruir o instrumento. Sem isto, o resto é medido pelo agente, não pela base.
2. **D1 + D2** — peitoral no enum, limiar do flag. É o único gate de segurança do bloco e
   ele não pode disparar. Mais barato do que qualquer outra coisa da lista.
3. **D3 + D4** — truncagem e `--docs`. ~50 linhas somadas; sozinhas teriam mudado o veredito
   de Q17 e de Q10.
4. **D5 + D6** — faixa por frame e aviso de condição ausente. Reparo do dado antes de
   qualquer camada que o consuma.
5. **D9** — prefixos `P`/`W`/`F` e fontes sem manifesto. Desbloqueio de tudo o que é externo.
6. **D8 + D10 + D11** — travas de id, `testado` com basis, gate de vivacidade do log.
7. **F1** — dump do OpenPowerlifting. Um dia, e fecha a única falha medida que era só
   preguiça de busca.
8. **D7 + A3** — `--vizinhos`, depois as arestas prescrição→condição.
9. **A1 + A2** — cindir `series`, preencher `modo`.
10. **F2 + F5** — prontidão e RTS. Meio dia e uma hora, e disparam toda semana.
11. **A6** — protocolo de medição; então a tarde de medição do atleta.
12. **A7** — o atleta entra na base como tier U.
13. **F3** — o núcleo de literatura; fecha `CITACOES-EXTERNAS.md`.
14. **A4 + A5** — as duas decisões vivas: eixo de desconto da fonte, e a variação de agacho.
15. **A8** — ledger de contradições, agora que há duas fontes para contradizer.
16. **A9** — `INDEX.md`, `LEXICO.md` e as três sínteses. Síntese por último, sempre.
17. **F4** — peitoral.
18. **F6** — Blevins faixa alta, depois da regra de desempate.
19. Reexecutar as 29 com os canários de A0. Se um canário de tier vazio passar, a rodada é
    descartada e volta-se ao passo 1.

Passos 1–7 somam **~2 dias** e cobrem as três falhas medidas. Passo 18 sozinho custa 4–6
dias e não fecha nenhuma delas — está por último por isso, e essa é a única recomendação
deste documento que contraria o instinto de terminar o que já foi começado.

---

## 7. VEREDITO

**Não. Esta base não leva um natural de 87 kg a um recorde mundial — e nenhuma base leva.**
O que leva é consistência de anos, massa magra, sono, e não se machucar. A distância é de
~240 kg para o recorde da 93 kg (927,5 kg) e de ~57 kg para o terceiro lugar do Brasileiro.
Sob qualquer resposta possível a "recorde é meta ou fantasia", o plano dos próximos 24 meses
é idêntico: ficar legal, competir num estadual, comer, dormir, ganhar massa magra, não se
machucar.

**O que a base serve, e é real, é do lado negativo:** ela existe para impedir erros caros e
específicos — abrir num agachamento onde a profundidade nunca passou, rasgar o peitoral de
novo subindo frequência sem gate, cortar para 83 kg com um déficit prescrito por um homem
que come 5.000 kcal, e escolher uma variação de pausa que reforça o padrão que o bloco
existe para desfazer. Nesse papel ela é boa: a camada de dor está alinhada com literatura
corrente, o volume absurdo está corretamente marcado `PESSOAL`, não há uma única
contradição com a regra da IPF, e o extrator foi fiel mesmo com o ASR contra ele.

**O que muda a resposta**, na ordem: (1) o gate de dor voltar a poder disparar — hoje uma
fisgada de 3/10 no peito não tem onde ser registrada, e isso não é opinião, é o enum;
(2) o log continuar vivo — abaixo de 70% de sessões registradas nada aqui vale nada, e o
modo de falha nº 1 do projeto é o log parar na semana 5, não a base responder errado;
(3) 215/160/240 deixarem de ser estimativa — um número sem fonte governando toda carga do
bloco é o defeito que já produziu o fator de −12 a −18%, e ele se conserta com uma tarde de
medição, não com mais corpus; (4) o telefonema à federação, que é catastrófico, perecível, e
não está em nenhum documento.

197 mil palavras de transcrição existem, entre outras coisas, para evitar uma tarde de
medição e um telefonema. Essa é a armadilha, e este plano é escrito contra ela.
