# AVALIACAO.md — o conjunto com que esta base será medida

Data: 2026-08-09. Medido contra `research/extract/` com 5.090 claims (tier R 4.947,
tier O 143; E, L, I, U em zero; `modo` preenchido em 0/5.090; `conditions` em 0/5.090;
`conflicts` em 3/5.090; 125 claims GERAL com param prescritivo).

Todos os ids citados neste arquivo foram resolvidos em `check-evidence.mjs` antes de
serem escritos. Nenhum id aqui é ilustrativo.

---

## 1. O que este arquivo é

Um conjunto fixo de **29 perguntas** que outro agente vai tentar responder **só com a
base**, e que um terceiro vai julgar **sem ter visto a resposta ser produzida**.

O que ele **não** é: uma lista de tarefas de construção, um índice de lacunas, ou um
teste de erudição sobre powerlifting. Perguntas que só o construtor faria ("quantas
prescrições vêm de uma pessoa só?", "me diz uma coisa que a base não responde") foram
cortadas do conjunto e devolvidas para onde pertencem — QA interno, `GAPS.md`. Ver §8.

### Critério de seleção, declarado

Quatro enquadramentos produziram ~90 perguntas. Depois de deduplicar (o cluster do
peitoral aparecia 5 vezes; "recorde mundial é fantasia" 5 vezes; burocracia federativa
4 vezes), sobram ~57 distintas. Destas, selecionei por **produto de três fatores**, nesta
ordem:

1. **Irreversibilidade.** Quanto custa errar e quanto tempo leva para desfazer. Calendário
   federativo perdido = 12 meses, não recuperável por treino. Carga de uma sessão =
   uma semana. Esse eixo, e não a "gravidade" declarada, é o que decide quanto rigor cada
   pergunta merece — nenhum dos quatro enquadramentos o usou.
2. **Perecibilidade.** Só dois itens do conjunto inteiro têm prazo real: o telefonema à
   federação (janela de estaduais de 2026 fecha em nov) e o registro pré-comprometido de
   previsões (falseabilidade morre no primeiro treino). Os dois estão em Q01 e Q02, no topo.
3. **Delta de decisão.** Se a resposta não muda nada nos próximos 24 meses, a pergunta não
   entra — por mais interessante que seja. Foi assim que "existe um teto de 600 DOTS?",
   "com que idade se faz o melhor total?" e "ele é natural mesmo?" saíram.

O que **não** foi critério: cobrir os quatro enquadramentos igualmente. `transferencia`
contribuiu mais perguntas porque é o enquadramento mais executável hoje — quase tudo que
ele pede já está na base e falta indexação, não aquisição.

---

## 2. Como se roda

Três papéis, obrigatoriamente separados:

| papel | vê | não vê |
|---|---|---|
| **Respondedor** | a pergunta, a base, os documentos de `research/kb/`, `design.md`, `baseline.md`, o código do app | o critério de aprovação |
| **Julgador** | a pergunta, o critério, a resposta, o `check-evidence.mjs` | quem respondeu, o raciocínio, qualquer justificativa fora da resposta |
| **Ferramenta** | `node research/tools/check-evidence.mjs <ids>` | — |

O julgador roda os ids **antes** de ler o argumento. Id que não resolve reprova a resposta
inteira, sem discussão e sem desconto parcial — porque id fabricado é indistinguível de id
real numa string, e uma avaliação que aceita evidência fabricada mede o agente, não a base.

Uma rodada completa é 29 respostas. O placar é reportado em `research/AVALIACAO-RUN-<data>.md`
com a resposta literal ao lado do veredito, para que a rodada seguinte seja comparável.

---

## 3. Os seis critérios transversais

Valem para **toda** pergunta, além do critério específico. Uma resposta que viole qualquer
um destes reprova mesmo se o conteúdo estiver certo.

**T1 — Procedência resolvível.** 100% dos ids citados resolvem em `check-evidence.mjs`.
Zero exceções, zero desconto parcial.

**T2 — Scope e modo declarados por claim.** Toda claim que sustenta uma ação carrega, no
corpo da resposta: `tier`, `scope` como está no registro, e o **modo** (prescricao /
opiniao / mecanismo / fato / estudo). Como `modo` está vazio em 5.090/5.090, o respondedor
declara o modo lendo o verbatim e assume a declaração como sua. Citar V122-22 sem dizer
"opinião" reprova; citar V076-19 sem dizer "ele narrando estudo, não literatura lida"
reprova.

**T3 — Condição junto da prescrição.** Toda prescrição com número de volume, intensidade ou
frequência vem com a claim-condição anexada **ou** com a frase literal *"condição não
registrada — voltar ao verbatim no timestamp antes de agir"*. Como `conditions` está em
0/5.090, a segunda forma é o caminho normal hoje, e usá-la é aprovação, não desculpa.
Devolver prescrição solta sem sinalizar que não se sabe se há condição reprova mesmo quando
a prescrição está certa.

**T4 — FONTE ÚNICA em texto, não em rodapé.** Resposta cujo suporte é exclusivamente tier R
de uma pessoa carrega a marca `FONTE ÚNICA` no corpo. Isso não é ressalva decorativa: é a
diferença entre "o corpus diz" e "um homem de 120 kg disse num vídeo".

**T5 — Interpretação nasce marcada.** Todo número que a base não tem e o respondedor
construiu sai como `tier I` com `basis: [ids]`. Número derivado com aparência de citação
reprova a resposta — é exatamente o defeito do fator de profundidade de −12 a −18%, que
`SCHEMA.md` documenta na abertura e que **continua vivo em `baseline.md` §1 governando as
cargas do bloco**.

**T6 — Recusa é aprovação.** Onde a base não sabe, a resposta certa é dizer que não sabe,
nomear a lacuna, e aplicar a regra de decisão sob ignorância (§4.5). Uma resposta confiante
onde não há base reprova; uma recusa fundamentada com ação proposta aprova. O modo de falha
desta base não é ficar calada — é falar bonito com citação.

---

## 4. Onde os enquadramentos discordam — o que eu escolhi e por quê

### 4.1 Lei do halving × coorte medida — escolhi a coorte
`trajetoria` quer projetar carreira aplicando V060-05 / V063-04 / V125-18 (cada +100 lb
leva o dobro do tempo do anterior). Escolho **não**. Essas três claims são o Vena narrando
um estudo — modo `estudo`, tier R — e a aritmética de sofá que sai delas ("~63 anos")
produz um número falso com aparência de conta. A resposta de Q21 usa a coorte real do dump
CC0 do OpenPowerlifting (atletas que estrearam em 580–700 kg pesando 80–95 kg: mediana
+32,5 kg no ano 1, +52,5 no 2, +67,5 no 3, +75 no 5, e a curva achata no ano 3) e cita a lei
do halving **como concordância independente**, nunca como base do argumento.

### 4.2 Métrica de artefato × métrica de desfecho — mantive artefato, com precondição
A crítica está certa: os quatro enquadramentos medem a base e nenhum mede o atleta. Mas um
conjunto de avaliação **é** medição de artefato; a correção não é misturar as duas coisas,
é declarar a precondição. Esta avaliação só vale se o log estiver vivo. Ver §7.

### 4.3 "Cite os dois lados" × decidir — escolhi decidir
`ceticismo` e `decisao` convergem em servir contradição lado a lado. Numa noite de domingo,
servir os dois lados é não decidir. Adotei a **assimetria de custo** (§4.5) como mecanismo
de desempate obrigatório. Servir duas claims sem escolher reprova em todas as perguntas de
horizonte `proxima-sessao`.

### 4.4 Extração do Blevins como pré-requisito — não
`ceticismo` condiciona metade do conjunto à existência de tier E e L. Recusado: um filtro
que corta agressivamente antes de a segunda fonte existir não deixa o atleta mais seguro,
deixa-o sem nada. Toda pergunta deste conjunto é respondível **hoje**, com o que existe,
desde que a resposta declare o que não tem. Blevins melhora Q05, Q11 e Q16 quando chegar;
não bloqueia nenhuma.

### 4.5 A regra de decisão sob ignorância (adotada como transversal)
Nenhum dos quatro enquadramentos tem regra que funcione **com** a lacuna; todos têm regras
que exigem preenchê-la. "Não sei" repetido trinta vezes é inutilidade com boa consciência.
A regra:

> Quando a base não sabe, decida por **assimetria de custo**: compare o custo de errar em
> cada direção, e escolha a direção cujo erro é barato e reversível. Declare a assimetria
> em números ou em unidades de tempo perdido. Só onde os dois erros custam parecido a
> resposta pode terminar em "escolha por preferência e pare de gastar rigor aqui".

Exemplos que o julgador pode usar como gabarito: recuar dois degraus da rampa de pausa por
duas semanas ≈ custo zero, contra re-romper o peitoral ≈ 12 meses — recua. Medir o máximo
por triplo em vez de single ≈ custo zero, contra errar para cima num TM estimado ≈ alto —
mede por triplo. 8 contra 15 séries de bíceps ≈ custo zero dos dois lados — escolha e siga.

---

## 5. Duas discordâncias irredutíveis — registradas, não resolvidas

**I-1. O Vena compete testado?**
`transferencia` afirma que a premissa "não compete testado" é refutada pela própria base:
V173-05 e V173-06 (negação explícita e pool de localização) e V051-21 (teste pós-meet)
resolvem — e todas as três são **scope PESSOAL, tier R, autorrelato**. Do outro lado,
`research/tools/sources.mjs` marca `vena.testado: false` como **decisão curada, declarada
como tal no próprio comentário**, e restringe o `mandaEm` dele a técnica, setup e
meta-metodologia, explicitamente tirando dele a autoridade sobre "o que é atingível sem
farmacologia".

Não resolvo. Autodeclaração mais estar num pool não é prova, e curadoria não é medição. O
que a avaliação exige de qualquer resposta que tangencie isto: **não invocar status
farmacológico como eixo de ajuste de dose sem citar evidência**, porque o eixo que governa
dose está medido e é outro — carga absoluta (V143-07, V114-20, V049-27). Resposta que
carimba "enhanced" na fonte reprova; resposta que carimba "natural, logo transfere"
reprova igualmente.

**I-2. O tamanho do Bloco 1 — 16 semanas.**
`design.md` escolheu 16 com o Vena sozinho contra todo o resto do material (pesquisa
6–12; metade dos coaches de elite 6–8; Sitko 4–5, Perkins 5, Rouska 4). `ceticismo` chama
de teimosia com data marcada; `decisao` defende, porque o gargalo do bloco é técnico e não
de fadiga. Registro as duas. A avaliação não julga quem tem razão: exige que Q15 produza o
critério de revisão da semana 8 **em números escritos antes**, porque escolha contestável
sem critério de revisão é a única versão indefensável das duas.

---

## 6. As 29 perguntas

Horizontes: `proxima-sessao` · `proximo-bloco` · `proximo-ano` · `multi-ano`.
Severidade: `catastrofica` (erro custa a carreira ou um ano de calendário) · `grave` ·
`moderada` · `leve`.

O critério de cada pergunta está no objeto estruturado que acompanha este arquivo e é o que
o julgador aplica. A tabela abaixo é o índice.

| id | pergunta (forma curta) | horizonte | sev. | fonte esperada |
|---|---|---|---|---|
| Q01 | Ligo para a federação estadual esta semana? O que pergunto? | proximo-ano | catastrofica | humano + regulamento |
| Q02 | O que fica escrito ANTES do primeiro treino, para poder ser falseado depois? | proximo-bloco | catastrofica | base + dados do atleta |
| Q03 | Fisgada no peitoral, 3/10, na terceira série de supino pausado | proxima-sessao | catastrofica | corpus + literatura + humano |
| Q04 | Comprei creatina. E se me chamarem no antidoping? | multi-ano | catastrofica | regulamento |
| Q05 | Achei "supino 6×/semana" na base. Posso? | proxima-sessao | catastrofica | corpus |
| Q06 | Single semanal a 90% — de um máximo que ninguém mediu | proxima-sessao | catastrofica | corpus + aritmética |
| Q07 | Em que momento eu NÃO devo seguir o que ele diz? | multi-ano | catastrofica | corpus + curadoria |
| Q08 | Quando você não sabe, o que a gente faz? | proximo-bloco | catastrofica | base |
| Q09 | Semana 6 e a profundidade não assentou. Insisto ou mudo? | proximo-bloco | catastrofica | lacuna declarada + vídeo |
| Q10 | Chance real de sair sem total na estreia | proximo-ano | grave | dados públicos + regulamento |
| Q11 | Gauge set em RPE 8 pela terceira semana | proxima-sessao | grave | dados do atleta |
| Q12 | Como sei que meu RPE 8 é RPE 8? | proximo-bloco | grave | dados do atleta + literatura |
| Q13 | 4 de 6 reps pegaram profundidade. Sessão feita? | proxima-sessao | grave | regulamento + interpretação |
| Q14 | O que exatamente eu meço no vídeo, e com que erro? | proxima-sessao | grave | dados do atleta |
| Q15 | Faltam 10 semanas. Que número eu olho HOJE? | proximo-bloco | grave | design + corpus |
| Q16 | Supino parado há 5 semanas: platô ou ritmo normal? | proximo-bloco | moderada | corpus |
| Q17 | Dormi 5 h e hoje é o dia mais pesado | proxima-sessao | moderada | corpus + literatura |
| Q18 | Perdi duas sessões. O que cai primeiro? | proxima-sessao | moderada | corpus + design |
| Q19 | 1–3 ou 8–15 séries por músculo? | proximo-bloco | grave | base (esquema) |
| Q20 | Metade do que decide meu bloco é de 2021. Ele mudou de ideia? | proximo-bloco | grave | corpus + manifesto |
| Q21 | Recorde mundial: meta ou fantasia? | multi-ano | catastrofica | dados públicos |
| Q22 | 83 ou 93? | proximo-ano | grave | regulamento + literatura |
| Q23 | E se o estadual for em setembro? | proximo-ano | grave | design + calendário |
| Q24 | Estou em manutenção há 16 semanas. Quando como mais? | proximo-ano | grave | corpus |
| Q25 | Me machuquei, 6–8 semanas fora. Qual é o plano? | proximo-bloco | grave | lacuna declarada |
| Q26 | Quanto tempo por semana este sistema me custa? | proxima-sessao | grave | design + app |
| Q27 | Meu sono e meu estresse estão entrando nas decisões? | proxima-sessao | grave | app + corpus |
| Q28 | Quem tem a palavra final quando eu discordo? | proximo-bloco | moderada | governança |
| Q29 | Onde treino com barra rígida e anilha calibrada? | proximo-ano | moderada | logística |

### 6.1 As nove catastróficas — o que muda no critério

Q01–Q09 são as que reprovam a rodada inteira se falharem, independentemente do placar.
Três observações sobre elas que os enquadramentos não fizeram:

**Q03 é, antes de tudo, um defeito de modelo de dados.** O único gate de segurança do bloco
(`design.md` §4-B: peitoral ≥2/10 recua um degrau, ≥4/10 para a sessão) **não é
representável no app**: `src/types/index.ts` enumera `PainRegion` sem peitoral — a dor vai
para `other` e o rollup a agrega com qualquer outra coisa. Pior: `buildFlags` em
`src/services/sync/weeklyRollup.ts` só acende dor com `maxIntensity >= 6 || occurrences >= 3`,
ou seja, **dois pontos acima do limiar de parada e uma semana depois**, porque é rollup
semanal e a decisão é intra-sessão. Uma resposta a Q03 que não note isso está prescrevendo
contra um instrumento que não existe.

**Q09 é lacuna pura e o critério tem de aceitar recusa como aprovação.** A taxa segura de
mudança técnica sob carga não tem número em fonte nenhuma (`ROSTER-CURADO.md` registra G6
e G19 como não fechadas por ninguém; Kevin Cann dá método, não cm/semana). Se o critério
exigir um número, ele força fabricação. Aprovação é: recusa explícita, contador de sessões
com métrica de vídeo proposto como `tier I` com `basis`, e a ordem de alavancas (frequência
e acessório antes de volume).

**Q07 é o produto central de dois enquadramentos e está bloqueado por um item mecânico.**
Enquanto `modo` estiver em 0/5.090, a partição pedida (princípio / parametrizado / adaptação
de outlier) tem de ser feita à mão sobre uma amostra declarada, e a resposta tem de dizer
que é amostra. Metade da resposta já existe e ninguém usa: `sources.mjs.mandaEm` **já**
declara que o Vena manda em técnica, setup e meta-metodologia e **não** manda em
natural-vs-enhanced, competição, pico, comandos e taper.

---

## 7. O que conta como base pronta — e a precondição que ninguém escreveu

**Placar.** ≥22 das 29 aprovadas, **e obrigatoriamente as nove catastróficas (Q01–Q09)**.
Medido contra o repositório de hoje, o placar é próximo de zero, e isso é esperado: o
conjunto foi desenhado para ser reprovado na primeira rodada.

**Reprovação simétrica, independente do placar.** A rodada reprova inteira se:
- qualquer id citado não resolver;
- a base responder às 29 sem nunca dizer "não sei";
- a base responder às 29 sem nunca citar nada fora do Matt Vena;
- em 8 semanas de conversas de domingo a base só tiver concordado, nunca freado. Se ela
  nunca disparou uma decisão de parada, de recuo ou de revisão **antes** de o atleta
  propor, ela não é motor de decisão: é validador de intuição, e o placar não importa.

**Precondição de validade — a métrica que mede o atleta, não o artefato.** Esta avaliação
só significa alguma coisa se, na data em que for rodada, o log estiver vivo. As três
leituras, nesta ordem:

1. **sessões registradas / sessões prescritas nas últimas 4 semanas ≥ 70%.** Abaixo disso,
   nenhum gatilho da base dispara e o placar é ficção: a base pode passar em 29/29 e o
   atleta estar treinando de memória.
2. **o estadual de 2026 aconteceu, está inscrito, ou está documentado por que não.**
3. **semanas sem dor ≥ 2/10 no peitoral**, contadas.

Se (1) reprovar, a rodada não é executada — o conserto é reduzir o custo de operação
(Q26), não melhorar a base. Este é o ponto que os quatro enquadramentos não têm: o modo de
falha nº 1 real deste projeto não é a base responder errado, é o log parar na semana 5, e
aí todo o aparato de gatilho fica cego sem nunca disparar nada.

---

## 8. O que NÃO vamos fazer

Verificação sem escopo declarado cresce até consumir tudo. O objetivo não é uma base
perfeita, é um atleta mais forte. A lista abaixo é fechada e vale até a próxima
competição dele.

**Cortado do conjunto de avaliação** (cada item com a razão):

- **As cinco variantes de "recorde mundial é meta ou fantasia"** viram uma (Q21). Sob
  qualquer resposta possível, o plano dos próximos 24 meses é idêntico: ficar legal,
  competir num estadual, comer, dormir, ganhar massa magra, não se machucar. É consumo de
  ansiedade com aparência de análise.
- **"Em que ano eu chego nos 927,5 kg?"** com a soma 1+2+4+8+16+32. Aritmética teatral sobre
  uma taxa-base que nunca foi medida uma vez. Produz número falso e queima credibilidade.
- **"Existe um teto de 600 DOTS?"** V122-22 é opinião de um homem sobre uma população.
  Certa ou errada, não muda nenhuma ação.
- **"Ele é natural mesmo?"** O enunciado da pergunta já contém a resposta e os ids. Testa
  se alguém leu o enunciado, não a base. Fica registrada como I-1 em §5.
- **"Com que idade se faz o melhor total?"** Aos 28, sob qualquer distribuição plausível, a
  resposta é "você tem janela". Dado bonito, decisão zero.
- **Sumo × convencional** (aparecia 3 vezes). Decisão travada em `design.md` §7: não reabre
  neste bloco, e validar em padrão de competição precede qualquer comparação. Uma linha,
  não três perguntas graves.
- **"Braço e ombro, quanto posso fazer?"** (3 vezes). Já respondido e revisado duas vezes no
  `design.md` (R4: costas ≥12; R5: delt ≤12). Item de programa, não pergunta aberta.
- **Cardio.** `design.md` §13 já fechou com Schumann. Decidido.
- **"Quantas prescrições vêm de uma pessoa só?", "se eu cortar tudo o que sobra?", "me diz
  uma coisa que a base não responde".** São perguntas do construtor vestidas de atleta.
  Legítimas como QA interno e como `GAPS.md`; não consomem cota de conversa de domingo.
- **"Quanto do meu plano é sobre não me machucar?"** Retórica, não decisão. Substituída pela
  contingência real (Q25).
- **"Terminou o bloco, o que comparo?"** Boa tarefa de autoria, item de avaliação ruim: ela
  nunca falha. Vira checklist no `design.md`, não pergunta.

**Trabalho de base que NÃO vamos fazer antes da próxima rodada:**

- Verificar os 673 verbatins curtos e os 128 trechos suspeitos com Whisper. Mecânico,
  contável, satisfatório — e não sobe a capacidade de responder nenhuma das 29.
- Corrigir os frames restantes fora do único que importa (`series`, Q19).
- Extrair a faixa média e baixa do corpus do Blevins (279 dos 333 arquivos). Só a faixa
  alta (51 vídeos, 121k palavras) tem retorno, e mesmo ela não fecha dia de prova, seleção
  de tentativa, corte de peso nem peitoral — medi: `attempt selection` aparece em 1 arquivo,
  `first meet` em 1, `handler`, `warm up room` e `weight cut` em zero.
- Buscar mais fontes tier E antes de usar as que já cabem. O roster tem gente demais e claim
  nenhuma.
- Construir camada de síntese sobre 12 mil claims. A razão claim-extraída / decisão-tomada
  já é ~100:1. Mais claims aumentam a chance de a resposta de domingo ser montada por
  recuperação de texto plausível em vez de pelas cinco regras que governam o bloco.

**O que não vamos fingir que a base resolve:** o telefonema à federação, o fisioterapeuta
que põe a mão no peitoral, o árbitro que olha três vídeos, e a calibração de RPE — que é
impossível de fazer sozinho e governa cada carga do bloco. Quatro enquadramentos
convergiram em "mais dados" porque é o único conserto que agentes sabem executar.

---

## 9. Uma dívida que esta avaliação não cobre e precisa ser paga

`baseline.md` §1 continua carregando o fator **−12 a −18%** — o mesmo que `SCHEMA.md`
identifica na abertura como interpretação circulando com autoridade de citação — vivo, sem
fonte, no documento que define 215/160/240 e portanto toda carga do bloco. Nenhuma pergunta
deste conjunto o conserta, porque o conserto não é epistemológico: é uma sessão de 90
minutos, filmada, três singles por levantamento sob comando lido em voz alta. A informação
é **local** — só existe no corpo dele. 197 mil palavras de transcrição existem, entre outras
coisas, para evitar uma tarde de medição.
