

================================================================================
## BLOCO 0 — 28619 chars
================================================================================

Encontrei a base. Diretório existe: `/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/kb/` — os quatro arquivos pedidos estão lá (`INDEX.md` 219 linhas, `DECISION_RULES.md` 444, `CONTRADICTIONS.md` 193, `GAPS.md` 287). Nenhum arquivo faltando.

---

# 1. As regras de decisão que de fato mudam como se programa

A notação da própria base: `[P]` = Vena sobre si mesmo (não generalizável), `[G]` = Vena prescrevendo a terceiros, `n=X` = menções independentes, `META` = peer-reviewed, `ELITE` = prática observada de elite IPF.

**R1 — Dentro de um bloco, só a CARGA varia** `[GERAL]`+`[PESSOAL]` n=4
Fixos: seleção de exercícios, esquemas de reps, frequência, estrutura de dias, formato DUP. Variável: a carga. Fonte `[R4]` `[R170 @01:00]` `[R33]` `[R99]`. A base chama isso de "a definição do modelo, não uma preferência" (regra F1). É a restrição arquitetural: qualquer app que permita trocar exercício no meio do bloco está fora do modelo.

**R2 — Progressão dupla no supino (Hepburn): progrida por REPS antes de progredir por carga** `[GERAL]` n=6
Num 3×4–6: sem.1 = 4 reps, sem.2 = 5, sem.3 = 6, sem.4 reseta em 4 reps +2,5 kg. Líquido: +2,5 kg a cada 3 semanas. Compare sempre semana 1 contra semana 1. Fonte `[R169]` `[R175]` `[R33]` `[R120]` `[R99]` `[R61]`. É explicitamente "a mais repetida e testada da base", usada "com centenas de lifters", de totais de 1.300 a 1.990 lb `[R61]` (regra P2).

**R3 — Trabalho de SBD longe da falha; acessórios perto da falha** `[GERAL]` n=3 + `META` forte
SBD a 2–4 RIR dirigido por percentual; acessório a 0–1 RIR dirigido por RIR. Fonte `[R112 @02:10]` `[R96]` `[R126]` + Robinson et al. 2024 (*Sports Medicine*): força é **indiferente** à proximidade da falha (β=0,003; IC −0,012 a 0,018), hipertrofia melhora perto da falha. A base a chama de "a regra de programação mais defensável de toda a base — é o mecanismo pelo qual força e estética param de competir" (regra A2).

**R4 — Não faça deload de meio de bloco; a oscilação já está no desenho ("ride the line")** `[GERAL]` n=1 formulação, 11 mecanismos periféricos
"Se você **precisa** deloadar, o volume está calibrado alto demais. Corrija o volume, não a semana." Fonte `[R102]`. Apoiada pelo único RCT direto em treinados: o grupo com deload ficou **mais fraco** (Coleman, `kb/raw/evidence.md` §4.1). Regra N5.

**R5 — O reset de início de bloco É o deload** `[GERAL]` n=5
Partir de ~95% da força corrente, contando ~5% de queda por fadiga do teste + taper. Fórmula: **82% − 2% por rep** (duplas → 78%; triplas → 76%; 5 reps → 72%). Fonte `[R33]` `[R29]` `[R126]` `[R133]` `[R6]` `[R122]`. Regra P4. É o mecanismo nº 2 dos 11 que sustentam o "ride the line".

**R6 — Espere que a progressão seja quase invisível — não a acelere por isso** `[PESSOAL]` n=1, núcleo aritmético
12 sem × +5 lb = +60 lb = +7,5% ≈ +2,5–3 pontos de RPE; menos os 5% de queda inicial → **+2,5% de dificuldade líquida no bloco inteiro**. "Sentir fácil é o desenho funcionando." `[R33 @01:02, 01:33]`. Regra P5.

**R7 — Encerre o bloco pelo RPE, não pelo calendário** `[GERAL]` n=4
Quando o que era RPE leve virar RPE 7 beirando 8 no mesmo esquema → testar máximo, resetar mais leve, novo bloco. Fonte `[R65]` `[R70]` `[R125]` `[R126]`. A base nota que este critério "decide o fim do bloco mais do que as 16 semanas" (regra N7).

**R8 — Matriz progresso × sensação decide a direção do workload** `[GERAL]` n=5, `COACH` (Tuchscherer/RTS)
bom/boa → não mexer · ruim/boa → **ADICIONAR** workload · ruim/ruim → **REDUZIR** · bom/ruim → cautela. Fonte `[R63]` `[R120]` `[R129]` `[R145]` `[R146]`. "A alavanca mais simples de puxar", palavras dele. Regra N4.

**R9 — Antes de mexer no programa, cheque o que está FORA da academia** `[GERAL]` n=1 como algoritmo
Ordem literal: (1) confirmar que é platô mesmo (≥ um ciclo, não uma semana); (2) proteína, calorias, sono, estresse; (3) só então workload; (4) só então uma variável específica. `[R63]`. A base a chama de "o algoritmo mais acionável da base" (N3).

**R10 — Uma variável técnica por levantamento, e só na virada de bloco** `[GERAL]` n=4 (T1) + n=4 (T5)
"Mude poucas coisas de uma vez — idealmente apenas uma por levantamento." Não mudar frequência + volume + seleção no mesmo ciclo. Ideias de meio de bloco: anotar, aplicar na virada — e na virada, 2–3 coisas, não 10. `[R63]` `[R166]` `[R114]` `[R125]` `[R108]` `[R170]`.

**R11 — Toda correção de forma acontece no SETUP, nunca sob carga** `[GERAL]` n=3
Mudar largura de base, largura de pegada, posição em relação à barra. Cue de execução no meio da rep é suspeito. Dado citado: olímpicos instruídos a manter coluna neutra a 70% **achavam** que estavam — havia ~20° de movimento. `[R31]` `[R97]` `[R150]`. Corolário (T3, n=5): além do estágio iniciante, cue consciente durante o lift **piora** a performance; no dia de máximo, nenhum cueing.

**R12 — Na dor, o critério não é o número, é a DERIVADA** `[GERAL]` n=2
Mover o máximo possível **desde que os sintomas estejam em tendência de queda**. Um treino isolado mais doloroso não invalida nada; picos frequentes ou dor que platôa/piora → reduzir mais. `[R27 @05:38]` `[R1 @01:34]` (D2). O número de teto é ~2/10, resolvido por recência: 2–4/10 `[R138]` → 2–3/10 `[R79]` → **~2/10** `[R1]` (D1).

**R13 — Repouso completo é a pior conduta; monte a estrutura de dois exercícios** `[GERAL]` n=3 e n=5
D3: repouso destreina o tecido e ele volta "mais fraco e mais sensível à dor" `[R1]` `[R27]` `[R138]`. D4 (o protocolo mais completo da base): **(1) primário — o que dói, MANTIDO**, mesmo que seja peso corporal ou meia amplitude; **(2) secundário — o mais específico que NÃO dói**, empurrado "tão forte quanto o lift antigo". Volume redistribuído 50/50, não eliminado. Progressão: **volume → peso → especificidade**. `[R138]` `[R108]` `[R79]` `[R177]` `[R17]`.

**R14 — Taper: começa 2 semanas antes, volume cai a ~metade, intensidade preservada** `[PESSOAL]`+`[GERAL]` n=9
Cronograma completo em K1 (5 sem: começa a empurrar singles · 2 sem: início do taper · ~1 sem: última sessão pesada de agacho · ~0,5 sem: última de supino · 2 dias: agacho/terra 2×2 a ~60%, supino 3×2 a ~70%). `[R54 @02:33]` `[R87]` `[R106]` `[R116]` `[R110]` `[R26]` `[R4]` `[R164]` `[R85]`. É o único ponto onde a base diz que Vena está **duplamente** apoiado: três surveys independentes convergem com Bosquet em corte de ~41–50% do volume com intensidade preservada — "o achado prático mais robusto de todas as sete controvérsias".

**R15 — Critérios de corte de exercício** `[GERAL]` n=1 cada, mas os mais acionáveis
C3: um exercício só existe se (1) trabalha a forma, (2) constrói músculo específico, ou (3) é gestão de carga `[R89]`. C2: "se depois de um tempo ainda não parece mais forte e você tem certeza de que está executando direito, provavelmente nunca será mais forte para você" `[R82]` — a base chama isso de "o critério mais acionável do canal". C1: trocar variação só quando vai terrivelmente mal ou a progressão nela se esgotou `[R185]`.

**R16 — Creatina 5 g/dia com selo de terceiros** `[GERAL]` n=17 vídeos distintos
A claim mais repetida de toda a base (`[R34][R43][R51][R57][R60][R63][R66][R68][R70][R72][R74][R78][R87][R89][R91][R96][R104]`). Selo Informed Sport ou NSF — a IPF é responsabilidade objetiva.

Duas regras `[PESSOAL]` fortes o suficiente para virarem guardrail:
- **E4** — "uma única single pesada fora de lugar pode custar o bloco inteiro": uma single de 195 kg derrubou o desempenho dele até a competição `[R81]` `[R83]`. Reforço `ELITE`: Perkins **nunca faz singles de agacho** no treino.
- **E5** — subir intensidade e cortar volume no supino falhou **3 vezes**: −40 lb, −20 lb, −15 lb, com retorno de dor de ombro nas três `[R36]` `[R20]` `[R21]` `[R48]`. "O achado replicado mais forte de toda a base sobre um único atleta" — mas ele é outlier declarado e diz "ajuste os números a você" `[R36]`.

---

# 2. Onde a base contraria o senso comum do powerlifting

**Deload é rejeitado.** "Why I NEVER do deloads" `[R102]`. E o registro é honesto: a base mostra que aqui a evidência apoia Vena (o único RCT direto mostra o grupo com deload **mais fraco**) e que a tensão é com a **prática**, não com os dados — "quando alguém invocar 'todo mundo deloada', isso é um argumento de costume, não de dado" (C17b, item 2).

**Repouso e "descansar até passar" são a pior conduta na lesão.** D3, n=3, "tese central do canal". Treina-se através da dor a ~2/10, mantendo o exercício que dói no programa (D4).

**Corretivos, mobilidade e "causa raiz" são rejeitados.** D9: corretivos que funcionam funcionam por (1) gestão de carga disfarçada, (2) história natural, (3) placebo. Causa raiz é "geralmente inútil — mesmo achando a causa a conduta continua sendo ir mais leve". Narrativas de "músculo fraco / desequilíbrio" criam **nocebo** `[R1]` `[R27]` `[R125]`.

**"Acessórios para atacar suas fraquezas" foi revertido.** Hoje: "algo tem que ser o ponto mais fraco, e mudá-lo muitas vezes só te deixa mais fraco" `[R82]`. Sticking point por **alavanca** ou por padrão motor já eficiente não merece trabalho corretivo (C5/C7).

**Periodização em blocos (hipertrofia → força → peak) está rejeitada.** "Pesquisa mostra nenhum benefício ou benefício levemente negativo"; blocos dedicados de hipertrofia rendem **pior** que treinar força e hipertrofia juntos `[R116]` `[R76]` `[R111]` (F3).

**MEV/MAV/MRV não existem como quantidade mensurável.** "Nunca foram validados experimentalmente como quantidades individuais mensuráveis. Busca no PubMed: zero resultados." E **nenhum elite do roster usa landmarks** (C18).

**O cue de tronco vertical no agacho é rejeitado frontalmente:** "STOP TRYING TO SQUAT UPRIGHT" `[R159]` é o cue-bandeira do canal.

**Sub-estímulo é tão comum quanto excesso, e mais difícil de ver.** "O erro mais comum é ficar **abaixo** do ótimo por medo de fadiga" `[R117]`. Teste: "se um exercício não vale a pena tentar melhorar e bater PR nele, não vale a energia de estar no programa" (X4).

**Não persiga PR em acessório.** Krawczyk, citado como reforço: "meu set de oito na pegada fechada ficou no mesmo peso toda semana... mas meu supino de competição está subindo, e isso já é indicador suficiente" (C1).

**Uma semana ruim não é gatilho de nada.** "Sentir fadiga um dia não significa rever recuperação" `[R147]` (N2). E o e1RM é tendência, nunca leitura semanal (E1).

**Cardio não custa força.** Contra a prática dos elites (1/12 faz aeróbico estruturado), a base põe Schumann (43 estudos, 1.090 sujeitos): SMD = −0,06, p = 0,45 para força; prejudicou apenas força explosiva. Veredito explícito: "este é o caso em que a prática dos elites e a evidência divergem, e a evidência é mais forte que o costume" (C17).

**"Ele é natural, então precisa de menos volume e mais deloads" não se sustenta.** C24: nenhum estudo compara tolerância a volume, cinética de recuperação ou frequência ótima entre drug-free e enhanced. "Toda vez que alguém disser 'mas ele é natural, então…', a base **não** sustenta a inferência."

**Programas de baixo volume são "o maior desperdício de tempo"** do treino dele `[R169]`; "3×5 de supino uma vez e meia por semana não é nem de longe volume suficiente" `[R175]`.

**Crescer de classe é ruim negócio.** A 87 kg numa classe de 93, 1 kg de massa magra vale ~3× mais que 1 kg de peso economizado; subir para 105 custaria **+41,7 kg de total só para empatar** (B3).

---

# 3. As contradições internas (CONTRADICTIONS.md)

Regra de resolução declarada: **R menor vence** (vídeo mais recente) — mas o lado perdedor é preservado inteiro, porque "em vários casos a posição antiga era certa sob outras condições de contorno". Três classes: **A** = internas a Vena (resolve por recência), **B** = Vena × elites IPF (recência não se aplica), **C** = Vena × literatura.

### Classe A — internas

| # | Contradição | Resolução declarada |
|---|---|---|
| **C1** | Volume máximo recuperável (51 séries/sem de agacho+terra, 62–68 de supino) `[R151][R135][R2][R117][R175]` **vs** 5–6 séries/semana `[R128][R143][R88]` | Recente vence **formalmente**, mas ele condiciona: "quando minha capacidade de trabalho era altíssima, o volume máximo recuperável funcionava bem; quando ela caiu... esse estilo parou de funcionar" `[R151]`. **A base declara que a condição de contorno não se aplica a um intermediário** — "nada disso é conselho para um total de 683 kg". Uso prático: **não copiar as 5–6 séries** |
| **C2** | Progressão linear pura (+5 lb/sem) `[R4]` **vs** ele se declarar "50/50" e dizer que "a maioria no nível dele NÃO progride linearmente" `[R50]` | **Indeterminado por admissão própria.** A linear se justifica por memória muscular pós-lesão + subida de categoria. Preferir a progressão dupla Hepburn (n=6) |
| **C3** | Cortar volume 5 dias antes `[R164]` **vs** taper de 2 semanas `[R54][R87]` | Recente vence; **reconciliáveis** se "cortar volume" em R164 = corte total dos acessórios. Preservado: 3 semanas (Worlds 2019) foi "absolutely awful" |
| **C4** | "Never deload" `[R102]` **vs** taper pré-meet estrutural `[R33][R54][R87][R108]` | **Não é contradição estrita** — "never deload" é sobre deload de rotina/meio de bloco. "Mas confundir os dois numa conversa semanal é erro fácil" |
| **C5** | "Todo powerlifter deveria manter singles o ano inteiro, ≥1×/sem a ~90%" `[R170]` **vs** zero singles pesados no supino `[R4][R20][R87][R104]` | Recente vence **só para o supino**. Em agacho/terra a regra sobreviveu `[R105][R49]`. Motivo do corte é uma lesão de ombro `[P]` — sem ela, a regra antiga vale |
| **C6** | Above-parallel pause squat: **B tier** `[R113]` **vs** "o acessório de agacho nº 1 dele" `[R168]` | R113 mais recente ⇒ tier B — **mas o critério declarado do tier list torna o rebaixamento incoerente. Contradição de ênfase real, NÃO resolvida** |
| **C7** | "Acessórios que atacam suas fraquezas" `[R119][R121][R124]` **vs** `[R82]` | R82 vence. Leitura: fraqueza **muscular** ou de **posição/skill** merece acessório; sticking point por alavanca, não |
| **C8** | Pause deadlift: parou de fazer `[R58][R81]` mas **ainda programa para quase todos os alunos** `[R58]` | Não é reversão — é `[P]` ≠ `[G]` **admitido**. Idem stiff-legged: `[G]` prescreve 20–25% do volume de terra em hinge `[R88]` (número que aparece **uma única vez em 3.154 claims**), `[P]` ele tirou do próprio programa `[R4]`. Deficit deadlift: "variação favorita" `[R170][R171]` → **D tier** `[R107]` |
| **C9** | Sete menores | Janela anabólica 36 h `[R29]` vs 48 h `[R92]` (ambos n=1, "não usar para justificar frequência") · Spoto press carrega mais `[R103]` vs menos `[R170]` o ombro (indeterminado) · volume de supino dele 25 vs 42 séries/sem · pausa above-parallel 1–2 pol `[R141]` vs 2–3 `[R132]` · **volume por músculo acessório 1–3 séries `[R10]` vs 8–15 `[R145]` — "nunca reconciliados"** |
| **C10** | "Seja obcecado, dedique a vida ao levantamento" **vs** "o excesso de volume/dedicação me travou por 38 meses" | **Ele nunca reconcilia.** A base registra uma leitura interpretativa própria (obsessão em **adesão**, não em volume por sessão) e marca explicitamente: "não é afirmação dele" |

### Classe B — Vena × elites (recência não resolve)

Aviso metodológico importante: **Orhii, Olivares, Lawrence e Cayco têm o mesmo treinador (Joey Flexx)** — qualquer prática comum aos quatro conta **uma vez, não quatro** (*coaching-lineage clustering*). E duas atribuições correntes foram refutadas na fonte: Orhii **não** usa JuggernautAI; Lawrence **não** é treinada por Bryce Lewis.

- **C11 Frequência — amplitude de 6×:** Vena (agacho 2×, supino 6×, terra 2×) vs Olivares, maior total raw de todos os tempos, **4 dias/semana** ("literalmente agacho uma vez por semana") vs Sitko **SBD 7×/semana**. Reconciliação de Olivares: "você pode fazer seis vezes por semana, mas talvez dois desses dias sejam pesados, dois médios" ⇒ **copiar um número de frequência sozinho é inútil**.
- **C12 Deload — o choque frontal:** Sitko e Perkins: nenhum deload. Pana: todo programa termina em deload/taper. Gibbs: pivot blocks de ~1/3 do ciclo. **A ressalva que corta contra Vena:** o treinador de Sitko usa blocos de recuperação de 3 semanas **para os atletas masculinos dele**, tendo descoberto que omiti-los produzia dor e queda **após ~3 meses**. "'Sem deload' pode ser efeito de sexo, tamanho ou carga de trabalho — não generalize."
- **C13 Volume:** Atwood ~55.000 lb/semana de agacho e Sitko 200–250 lifts de supino/semana a 68% de intensidade média **vs** Rouska: "2 ou 3 séries semanais a mais de low bar e a coisa toda simplesmente desmoronou". O treinador de Sitko diz que **aumentar a frequência consertou as lesões dela** — "o oposto exato da experiência de Rouska, e os dois são de nível mundial".
- **C14 Singles:** Perkins **nunca** faz singles de agacho (a lesão que encerrou Sheffield 2025 veio "da dupla pesada final no agacho") vs **Pana: "erro nº 1 é não fazer singles"**, 88–95% o ano inteiro. Olivares mantém singles mas "explicitamente como primer, não como teste".
- **C15 Taper:** Atwood/TSG — "o taper É o método" vs Perkins/Stanek **treinam direto no meet** (mudaram depois que o taper custou o supino no Nationals 2023) vs Sitko "pico sem taper". Modelo FLEXX: taper 21–10 dias fora e **específico por levantamento** — convencional de Olivares para 9–10 dias antes, **sumô de Lawrence treinado até 72 h antes**.
- **C16 Faixa de reps:** Vena nunca mais de 2 reps em SBD; Pana rejeita 8–12 ("com oito reps a técnica normalmente é lixo"); Orhii agacha 315 kg × 7 e Gibbs credita o supino a "reps de 8 e acima". **"Discordância genuína e não resolvível pela base."**
- **C17 Cardio:** elites 1/12 vs Vena 3–4 h/sem de zona 2 vs Schumann. **A evidência ganha.**

### Classe C — Vena × literatura

- **C17b, as duas assimetrias que governam qualquer disputa de volume:** (1) força é **muito** menos sensível a volume que hipertrofia (Ralston 0,82/0,98/1,01; Schoenfeld 2019: 1 = 3 = 5 séries para força); (2) prática e evidência divergem mais agudamente justamente nos deloads.
- **C18 Landmarks:** RP publica números, Helms vai ao contrário ("faça o suficiente para progredir, não o máximo possível"), Nuckols rejeita as duas molduras (~25 séries só porque "a densidade de dados cai acima disso"; o ponto de inflexão do U invertido **não foi encontrado**). Resolução proposta: volume de força dos comp lifts **no meio da faixa** (~5–9 séries/exercício/semana), orçamento de volume no acessório.
- **C19 Bulk:** Vena `[G]` 250 kcal / 0,5 lb/sem **converge** com a literatura; o `[P]` de 1 lb/semana **diverge** — Garthe 2013: ~500 kcal/dia extra produziu 2,6× o ganho de peso, **5× o ganho de gordura, zero massa magra extra, zero força extra**. Dado elite: Pana ganha 700–900 g/mês com superávit de 200–300 kcal.
- **C20 Proximidade da falha:** Robinson **confirma** Vena para força — mas o corolário corta contra ele: a acurácia de RIR **melhora perto da falha**, logo **RPE 3–6 é exatamente a região onde o instrumento é pior**. Daí a regra derivada A3 (SBD por percentual, acessórios por RIR).
- **C21 Comprimento de bloco:** Vena 16 sem vs elites 4–16 vs pesquisa 6–12 (50% dos coaches de elite dizem 6–8). Israetel: "para lifters muito avançados... só 3–4 semanas de acumulação" ⇒ **quanto mais avançado, mais CURTOS os blocos — o inverso do que Vena faz**.
- **C22 Periodização em blocos:** Bazyler/Stone (n=9): CSA do vasto lateral sobe na fase de resistência de força (d=1,90) e **cai** na fase de força-potência (d=−1,61); RFD faz o inverso. "Não existe fase em que você está simultaneamente no pico de tamanho e no pico de força." Estado: `MODERATE` — não derruba Vena, mas impede tratar a rejeição como fechada.
- **C23 Seleção de tentativas:** TSA e Krawczyk convergem independentemente (abertura 90–92%, segunda 95–97%, terceira 100–105%; salto maior do 1º→2º). **Usar os números externos, não os de Vena.**
- **C24 Natural vs enhanced:** ver seção 2.
- **C25** é específica do atleta deste projeto: o cue-bandeira `[R159]` **não se aplica a ele** — a direção da correção é a inversa da doutrina.

---

# 4. As lacunas (GAPS.md) — onde qualquer programa está extrapolando

O arquivo declara sua própria função: "impedir que eu prescreva achando que estou apoiado. Se a pergunta cai aqui, a resposta correta é: 'a base não responde isso — o que eu disser é palpite meu'." 37 lacunas, severidade 🔴/🟡/⚪.

**As sete mais destrutivas para um app de programação (🔴, disparam semanalmente e não têm número):**

1. **G1 — A amplitude do "ride the line" nunca é quantificada.** O mecanismo que **substitui o deload no modelo inteiro** não tem "nem % de carga, nem % de volume, nem número de séries, nem periodicidade em lugar nenhum do corpus". Registrada como "a lacuna mais grave do modelo anti-deload". Único proxy: o microciclo Hepburn de 3 semanas — que ele **nunca chama de ride the line**.
2. **G2 — Deload quantificado não existe, e o número que todo mundo cita é falso.** 19 claims sobre deload, **nenhuma prescrição de corte**. E o "deload reativo disparado por queda de ~5–10% no e1RM" é **reconstrução**; `kb/raw/rts_tsa.md` §1.7 marca literalmente "Nenhum limiar numérico de queda de e1RM é publicado. **UNVERIFIED**".
   **G2b** — "quantas sessões de queda dispara ação" (2 sessões seguidas, a regra intuitiva) **não existe em lugar nenhum da base**.
3. **G3 — "Período longo de treino ruim" é o gatilho declarado para mudar o programa `[R147]` e "longo" nunca vira número.** Sem isso, N2 não tem contraparte positiva.
4. **G4 — Quanto recuar em rehab:** um único datapoint `[PESSOAL]` (~700 lb → 405 lb ≈ 58% `[R17]`), nunca generalizado, nunca repetido; "quanto tempo leva" nunca é dito. **Ausente também: volume mínimo para não destreinar durante a lesão.**
   **G4b** — a regra de cortar séries por subida de RPE está **fora do domínio do próprio instrumento**: as tabelas de *fatigue percent* do RTS são ancoradas em top sets **@8**; não existe tabela para @4 → @6. Pior: as duas tabelas do RTS conflitam entre si (3/5/7% vs 2–4/4–8/8–12%).
5. **G5 — "Se não melhorar rápido, abandone": "rápido" nunca vira semanas ou sessões.** E não existe cadência de rotação de exercício em nenhuma fonte.
   **G5b** — o limiar de dor 2/10 tem **zero contraparte externa**: "nenhuma escala de dor, nenhum limiar de 'dor tolerável', nenhum protocolo de retorno e nenhuma progressão de reabilitação existe em nenhum dos 6 frameworks de coach".
6. **G6 — Taxa segura de mudança técnica sob carga:** princípio sim, número nenhum. Sem cm/semana, sem % de carga, sem duração de permanência numa posição nova.
7. **G7/G8 — Volume:** 1–3 vs 8–15 séries/músculo nunca reconciliados; e **não existe nenhum número de volume-alvo por nível de força** — "não existe 'para um total de 615 kg, faça X séries'". Ele próprio varia de 5 a 68 séries/semana ao longo da carreira.

**Ferramentas e tópicos com ZERO cobertura:**
- **G9 — Box squat e pin squat: zero claims em 3.154.** Todo trabalho de altura fixa que ele prescreve é pausa livre.
- **G11 — Tempo em lockout no supino: zero claims.**
- **G16 — Regras IPF 2026: todos os vídeos são anteriores.** Altura da barra no agacho: zero das 226 claims TECH-SQ. **Lockout geométrico do terra: zero claims — e é a regra que mais muda para sumô.**
- **G27 — Zero dados sobre programação específica para SUMÔ.** Um único datapoint (FLEXX, 72 h vs 9–10 dias), dois atletas, sem mecanismo.
- **G18 — Largura de pegada em função do comprimento de úmero: nenhuma linha.** Nunca cita o limite de 81 cm da IPF.
- **G28 — "NENHUM estudo testou se adicionar trabalho acessório de bodybuilding a um programa avançado de powerlifting melhora ou prejudica o total"** — "o experimento mais relevante para este documento, e ele não foi feito".

**Lacunas de método (🟡/⚪):** protocolo de lesão de peitoral inexistente (G12); critérios de encaminhamento médico e "quando é seguro voltar a singles pesados" (G13); como aferir profundidade objetivamente — "ele prescreve rigor de profundidade e nunca ensina a medir" (G14); transição low bar ↔ high bar e sumô ↔ convencional sem cronograma (G15); prática do comando de pausa nunca prescrita (G17); **nenhuma hierarquia de qual correção vem primeiro** (G19); como sair da fase de alto volume — "ele saiu por colapso, não por decisão planejada" (G20); macrociclo anual (G21); **nenhuma prescrição por sexo, idade ou nível competitivo — zero** (G22).

**Lacunas descobertas na consolidação (§3 do arquivo), incluindo duas que a própria base prevê que vão disparar:** G23 (nenhum critério para saber quando a fase de calibração acabou — "isto vai disparar na semana 3 e não tem resposta na base") e **G24** (nenhuma regra para quando a variável técnica do bloco **conflita** com a progressão de carga — "o conflito mais provável do Bloco 1 e não tem precedente na base"). Mais: a conversão "1 RPE ≈ 2–3% do 1RM" nunca validada para outro atleta (G25); nenhum critério para interpretar vídeo semanal — o checklist diz **o que olhar**, não **quando dar por resolvido** (G26); faixa ótima de %BF inexistente (G29); "essencialmente todo número da base é extrapolado de populações menos treinadas" (G30); o roster de elites não tem **ninguém** simultaneamente 83–93 kg, natural verificado, sumô e documentado (G31); cut agressivo no início de ciclo longo nunca estudado (G33); curva de destreino inexistente (G34); flutuação diária real do 1RM não isolável do erro de medição — "precisamente o que a regra E1 precisaria saber" (G35).

**§4 do GAPS é uma lista negra explícita** de 11 afirmações que existem mas **não sustentam prescrição** — inclui a própria faixa **RPE 3–6** (aparece uma única vez; todo o resto do canal fala em RPE 6–8), os "20–25% de volume em hinge", "1/9 do volume para manutenção", e avisos de ASR (o nome "Hepburn" aparece como "hip burn"/"HEPA burn"; `[R152]`/`[R64]` são prováveis inversões de "could/couldn't").

---

# 5. Tamanho e forma da base

**Corpus primário:** **178 transcrições** completas de vídeos do canal (`scratchpad/corpus/`, marcada como "não abrir"), destiladas em **3.154 claims atômicas** com identificador `[Rxxx]` e timestamp, distribuídas em **18 lotes** (`extract/lote_01.md` … `lote_18.md`, ~136k palavras). **Os lotes seguem ordem de recência**: `lote_01` = R1–R5 (mais recentes) … `lote_18` = R~180+ (mais antigos) — é isso que torna operacional a regra "R menor vence".

**Cinco camadas, do mais denso ao mais bruto** (a tabela §0 do INDEX):

| Camada | Conteúdo | Tamanho |
|---|---|---|
| `kb/DECISION_RULES.md` | as regras acionáveis — 12 seções, ~60 regras nomeadas (P1–P6, N1–N7, E1–E4, X1–X5, D1–D10, A1–A7, C1–C5, T1–T6, B1–B8, K1–K4, F1–F4) | ~6k palavras |
| `prog/*.md` | o programa e parâmetros filtrados para o atleta deste projeto (18 arquivos: design, baseline, params_*, e 8 relatórios de auditoria/review) | ~112k palavras |
| `synth/*.md` | **13 sínteses temáticas** de Vena, todas com o mesmo esqueleto: §1 posição atual · §2 evolução · **§3 pessoal vs recomendado** · §4 números concretos · §5 lacunas · §6 marcadores de confiança | ~84k palavras |
| `extract/lote_*.md` | as 3.154 claims com `[R]` e timestamp | ~136k palavras |
| `kb/*.md` + `kb/raw/*.md` | fontes **externas** a Vena: 12 elites IPF, 6 frameworks de coach, literatura primária, regras IPF, análise de vídeo do atleta | ~424k palavras |

**A camada externa é maior que toda a camada Vena somada** — é uma base deliberadamente adversarial contra o próprio canal que ela destila. Seus componentes: roster de 12 elites IPF (`elite_ipf_roster.md`, 105k palavras, fatiado em 7 `sec_*.md`) com um arquivo dedicado de convergência/divergência (`_roster_analysis.md`: 12 convergências C1–C12, 8 divergências D0–D10); 6 frameworks de coach (RTS/TSA, Calgary Barbell/Gibbs, SBS/Juggernaut, RP/3DMJ, Prilepin/Sheiko/Matveyev); e **`kb/raw/evidence.md` — 52 PMIDs verificados por recuperação direta, organizados por 7 controvérsias**, que o INDEX chama de "o arquivo mais valioso da base inteira para resolver disputa" e que termina com uma seção `Gaps, Unverified Items, and Explicit Non-Findings` ("leia esta última antes de citar número").

**Forma de uso declarada:** `DECISION_RULES.md` primeiro e sozinho; `INDEX.md` como mapa assunto → arquivo → seção quando uma regra precisa ser aprofundada; `GAPS.md` como trava contra invenção; `CONTRADICTIONS.md` como consulta obrigatória antes de aplicar qualquer regra marcada com ⚠. A §12 do DECISION_RULES define até a **ordem de leitura da conversa semanal**: dor → semana fechou no alvo → RPE bate com a carga → vídeo → tendências de e1RM/peso → progresso × sensação → mudanças propostas → distância do meet.

================================================================================
## BLOCO 1 — 25368 chars
================================================================================

audit_citacoes_v2.md
audit_citacoes.md
baseline.md
design.md
params_bracos_ombros.md
params_elites.md
params_tecnica.md
params_vena_fase2.md
review_dose_v2.md
review_dose.md
review_fidelidade_v2.md
review_fidelidade.md
review_orcamento_v2.md
review_orcamento.md
review_seguranca_v2.md
review_seguranca.md
SPEC_REV2.md
verification.md
=== entradas no PROGRAMA.md ===
22:> `trainingMax` CORRENTE** (`SPEC_REV2` §0.1), nunca do 1RM histórico e nunca das marcas
23:> **declaradas** 250/170/268, que não aparecem em lugar nenhum deste programa. Partida:
27:> **O QUE É O `trainingMax`, ESCRITO AQUI E NÃO EM NOTA DE EXERCÍCIO** (`SPEC_REV2` §0.1).
29:> **Brett Gibbs**, que fica em **≈92–94% do máximo real**. Não é o 1RM de academia e não é
30:> o total projetado. **Consequência prática, e é a que morde: se você digitar o 1RM real
33:> `trainingMax` ausente como bloqueio de sugestão de carga, de propósito.
145:**Denominador das reduções do taper, declarado aqui porque só existia no código:**
172:`roundGuard` aplicado na grade de 2,5 kg), não sobre o percentual declarado — e é por isso
194:ele cita `[R15]` e `[R37]`, que não estavam declarados aqui. **10 procedências declaradas
196:citada não era declarada; a lista acima é o resultado da conciliação. **R7 e R185
249:coluna e variável declarada que nenhum template usa são **erro de build**.
300:⚠️ `SUP-V1-PCT` foi declarada com `round 0.5` e **não** com `round 1pp`: a série de
316:o `trainingMax` de agacho e terra em ~2,2%** justamente no gate que fixa 13 semanas de
317:carga. Quem governa é **§0.3**, porque é a única tabela declarada normativa e é dela que
324:gate     | apos_semana 3 | grava trainingMax = mediana das 3 | alerta_divergencia_pct 7
334:três âncoras, usar a **mediana** (nunca a maior), gravar em `profile.trainingMax` (não
335:toca no 1RM histórico), gravar `trainingMaxInicialBloco`, e **as cargas das S4–S18
547:**percentual do `trainingMax` corrente**; célula `RPE n` significa *carga descoberta por
604:| 4 | 86% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 1 | 6 | Primeira semana por percentual. O gate da S4 gravou o trainingMax e tudo abaixo é % dele. Top set ≈ RPE 6,0 · back-off ≈ RPE 7,5 pela tabela normativa. Degrau de exposição SUP-V1 2→3, vindo da S3: aqui ele é livre porque toda coluna de carga de supino CAI ao mudar de denominador (RPE 7 a 1 rep = 89% por §0.3 → 86% prescrito) |
634:faixa escolhida, **R15 fica declarado ABERTO** — a reestruturação de D3 é decisão de coach
648:⚠️ **Limitação estrutural declarada:** `EXP-TETO` é `1,25 ×` a própria medição das semanas
700:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
702:| Agachamento Low Bar (Profundidade Legal) | 3 | 2 | 3 | {AG-P} | {RPE-AG} | 3 MIN | PAPEL PRÁTICA (40–70%). PAUSA DE 1 s NA PROFUNDIDADE LEGAL — é a única exposição pausada NA amplitude que é a variável do bloco [design §13-B/R11]. REGRA, verbatim: "the top surface of the legs at the hip joint is lower than the top of the knees" [IPF-TR2026 §3.2]; as 3 reps filmadas falham por 4–8 cm [VÍDEO-SQ §3]. PAUSA COM TENSÃO MANTIDA: "pausa de 1 segundo é suficiente; mais que isso só limita carga sem ajudar mais na estabilidade — contar até 2 mentalmente equivale a cerca de 1 segundo real" [R124 @01:02] [GERAL]. POR QUE PAUSAR NO FUNDO: "elimina o momento do reflexo de estiramento e ensina a atravessar o sticking point, que fica logo acima do paralelo, mantendo boa posição" [R170 @04:38] [GERAL]; "forçam a manutenção de bom equilíbrio no midfoot na posição inferior" [R132 @02:36] [GERAL]; "punem qualquer desequilíbrio" [R16 @03:34] [GERAL]. CORREÇÃO MESTRA, METADE 1 — JOELHOS: "na posição de pausa, foque em empurrar os joelhos para frente e para fora; o efeito upstream mantém o quadril para frente e sob o corpo e o peito para cima — pensar dos joelhos para cima funciona melhor do que cuear quadril e peito diretamente" [R168 @02:11] [GERAL] ⚠️ [interpretação]: R168 diz isso da pausa ACIMA do paralelo. PROIBIDO cuear "peito para cima" ou "quadril para baixo" — é o que ele diz NÃO funcionar melhor. CORREÇÃO MESTRA, METADE 2 — ÂNGULO DE TRONCO: você agacha ~15° MAIS INCLINADO do que suas alavancas exigem (40° estando 5–8 cm ACIMA do paralelo; o esperado no fundo legal é 30–38°) e a inclinação extra NÃO vira carga útil [VÍDEO-SQ §4, §5]. O que transfere é o ESPELHAMENTO: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL]; "já iniciar a subida com o tronco na posição para a qual seu corpo naturalmente vai no sticking point" [R16 @04:05] [GERAL]. ⚠️ A doutrina "quem quer agachar o máximo de peso em geral não deve estar super ereto" [R159 @00:00] [GERAL] NÃO se aplica a você — "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação, e ainda encurta o braço de momento" [R159 @04:21] [GERAL] [interpretação de design §2]. CARGA: é o passo 3 de R115 em tabela — recue até bater profundidade sem hesitação, acumule reps no limiar, e só então "sobrecarregue progressivamente o percentual em que você bate a profundidade com confiança" [R115] [GERAL]; ⚠️ R115 não dá % nem prazo, LACUNA declarada. "Faça TODA repetição funda, desde a barra vazia e os aquecimentos, até virar segunda natureza" [R115 @03:05] [GERAL] — vale para os 3 aquecimentos. RIGOR: é a única exceção declarada do canal ao próprio anti-purismo — "em profundidade de agacho vale ser rígido" [R115 @03:05] [GERAL]. PARADA (RPE 10 operacional): encerre na primeira rep que perder a profundidade legal OU passar de ~38° da vertical, mesmo com RPE abaixo do teto. PEGADA, REGRA NOVA 2026 — "hands, thumbs, and fingers must be in complete contact with the bar" [IPF-TR2026 §3.2]: NADA de polegar por cima (thumbless/suicide grip), em nenhuma série e em nenhum aquecimento. É setup, custo zero, e é causa de DQ. COMANDOS DESDE A S1 [design §13-B/R12]: cinto, walkout de no máximo 3 passos — "mais de três passos no walkout desperdiça energia e cada passo é uma oportunidade a mais de algo dar errado" [R14 @04:36] [GERAL]; imóvel e pronto em 5 s, senão é "Replace" [IPF-TR2026 §3.2]; a janela inteira é de 60 s [IPF-TR2026 §3.7]; alguém dá "Squat" e "Rack". VÍDEO perpendicular, altura do quadril, 3–4 m |
706:| Puxada Vertical | 1 | 4 | 8-10 | N/A | 9 | 2 MIN | Segundo acessório mais recorrente do roster, 5/10 — Sitko, Pana, Perkins, Orhii, Olivares [elites §3.3]. Entra por R4; com estas 4 mais 4 de remada em D1 e 4 de puxada neutra em D2, costas fecha em 12 séries diretas por semana, acima de bíceps (11) e de delt lateral (9). ⚠️ CORREÇÃO EXIGIDA PELA AUDITORIA, contra o próprio repositório: a versão anterior desta nota dizia que "o deltoide POSTERIOR é servido de graça por esta linha e pela remada", e por isso R5 teria sido resolvido como lateral 9 + posterior 3 em vez de 8 + 4. OS DADOS DIZEM O CONTRÁRIO: `one_arm_row` e `wide_grip_lat_pulldown` têm `muscleMap = { costas: 1.0, bíceps: 0.5 }` em `src/data/exercises/powerbuilding.ts` — ZERO deltoide posterior. O crédito parcial que a justificativa invocava NÃO EXISTE no mapa dessas duas linhas. Quem de fato dá crédito parcial de posterior é a PUXADA NEUTRA de D2 (`puxada_neutra`, 0,5 × 4 séries), então a ponderada real é 3 + 2 = 5 séries por semana — não as 9 que `SPEC_REV2` §1.5 declara, e não 3. A escolha 9+3 fica de pé como ESCOLHA de orçamento de ombro, não como consequência de crédito indireto — e é assim que está declarada aqui. O gerador publica as duas contagens (direta e ponderada) em `VENA_BLOCK1_MEASURES` com nomes distintos, para que a divergência não volte a ser invisível. Perto da falha porque a especificidade é baixa [R112 @02:10] [GERAL] |
707:| Stiff-Legged Deadlift | 1 | 1 | 8 | N/A | 4-5 | 2 MIN | MIGRADO DE D5 [SPEC §1.2] — é metade da realocação que resolve os dois lados de R14. RPE 4–5 É LITERAL: "não programa esses hinges pesados como muita gente faz: mantém em RPE 4 a 5, porque o objetivo é praticar a habilidade — leve demais não trabalha nada, pesado demais faz o corpo transformar naturalmente num movimento mais convencional" [R11 @02:36-03:07] [GERAL]. STIFF E NÃO RDL, PELA ALAVANCA: "quem tem boas alavancas de terra (braços longos) faz stiff-legged, se conseguir manter o hinge estrito na amplitude completa" [R11 @02:05] [GERAL] — envergadura 184, índice +6. FREQUÊNCIA: "todos os atletas sumo dele fazem stiff-legged ou romeno UMA VEZ POR SEMANA" [R11 @03:07] [GERAL]. EXECUÇÃO: flexão de joelho mínima, "só o suficiente para manter equilíbrio e acessar flexão de quadril mais profunda" [R88 @01:31] [GERAL]. ⚠️ DOSE ABAIXO DA PRESCRIÇÃO, e é declarado: "para quem puxa sumô, ele costuma recomendar que 20–25% do volume de deadlift seja convencional ou variações dele" [R88 @02:02] [GERAL] — 1 série em 8 de terra é 12,5%. O que sustenta a dose mínima é o precedente [PESSOAL] (ele mesmo roda 6 séries por semana de terra). ⚠️ CONTRAPONTO MAIS RECENTE, [PESSOAL]: ele TIROU o stiff-legged do próprio programa — "adicionou achando que faltava treino de hinge para destravar o terra, mas concluiu que não era o caso… melhor fazer mais prática de sumô" [R4 @06:07]. CRITÉRIO DE CORTE ao fim do bloco: se não der sinal, cortar e devolver o volume para sumo. ⚠️ E carrega custo: "RDL e stiff carregam muito as costas, ruim para quem não aguenta muito volume de terra" [R107 @03:10] [GERAL] — é o motivo de ficar em 1 série e em D1, três dias antes do terra de força. ⚠️ A DISTÂNCIA PARA TRÁS, QUE A NOTA ANTERIOR OMITIA E É A QUE MORDE: D1 cai **24 h depois de D5**, que é o maior estímulo axial da semana (single a 86–92% + 3×3 a 82–86% de terra). Ou seja, a distância para o terra pesado seguinte é de 3 dias, mas para o terra pesado ANTERIOR é de ZERO dias. É por isso que a dose aqui é 1 série e RPE 4–5 LITERAL, e é por isso que a Extensão Lombar da linha seguinte não sobe de 3 séries: as duas somadas são o que cai sobre eretores recém-carregados. Se o terra estagnar, esta dupla é o primeiro candidato a realocação, junto com o layout de D3 |
708:| Extensão Lombar (Hiperextensão) | 0 | 3 | 10-15 | N/A | 9 | 1-1.5 MIN | MIGRADA DE D5 [SPEC §1.2]. Extensão de quadril ou hiper aparece em 5/10 do roster de elites, e para Pana é a escolha nº 1 de acessório de terra, 1–2×/semana [elites §3.3, §8]. ⚠️ CITAÇÃO CORRIGIDA — a versão anterior apagava duas palavras DE DENTRO DAS ASPAS. O verbatim é: "hyperextension é um ótimo exercício PARA ADUTORES desde que a máquina caiba na sua anatomia de quadril e não seja estranha de carregar — se estender demais, o apoio crava no estômago; se for baixo demais, não chega à articulação do quadril" [R11 @04:40] [GERAL], e a claim vizinha confirma o contexto ("como ele mantém o hinge e o próprio SBD submáximos, prefere atacar os ADUTORES com trabalho acessório", [R11 @04:40] [GERAL]). R11 endossa o exercício PARA ADUTORES, não para eretores — e esta linha paga `eretores_series_diretas_semana >= 4`. QUEM SUSTENTA O PAPEL DE ERETORES é [elites §3.3, §8] (Pana: extensão de quadril/hiper é a escolha nº 1 de acessório de terra, 1–2×/semana), que já estava nesta linha; R11 fica como AJUSTE DE MÁQUINA e como crédito de adutor, que é bônus. ⚠️ EQUIPAMENTO FORA DO INVENTÁRIO CONFIRMADO: design §0-B não lista banco de extensão lombar. Se não houver, a substituição declarada é GOOD MORNING COM BARRA na mesma dose (o rack e a barra existem), e ela está no campo de alternativas desta linha. Descanso 1–1,5 MIN é prescrição honesta em vez da faixa "1-2 MIN" que escondia 1 min por série no orçamento |
716:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
718:| Supino Pausado (Competição) | 6 | 1 | {SUP-F-REPS} | {SUP-F} | {RPE-SUP} | 3 MIN | ⚠️ SÃO 6 AQUECIMENTOS, NÃO 4, E ISSO É CORREÇÃO DE SEGURANÇA CONTRA O ORÇAMENTO: partindo da barra vazia, 4 séries não fecham a regra da base — saltos de 5–10% com os DOIS ÚLTIMOS a 4–7,5% [R52 @02:02] [R110] —, e esta é a série mais pesada da semana num atleta com peitoral lesionado. Custa ~3 min por sessão, e a regra de prioridade aplicada é explícita: segurança acima do orçamento de tempo. HANDOFF: peça o handoff a um parceiro SEMPRE que houver um, desde a S1 — hoje ele retira e recoloca a barra sozinho, e "em prova, com handoff, o groove muda" [VÍDEO-BP §4 item 9]; o simulado não é lugar para estrear isso. TOP SET. O % é do trainingMax CORRENTE, não do 1RM. PAUSA DE 1,0 s em toda semana e em todo aquecimento — D2 é o dia de tensão de PICO (chega a 92% do TM) e por isso carrega a duração MÍNIMA legal; o bloco de 2 s vive em D3 a 65%. 1,0 s é PISO, não alvo: a pausa da IPF tem duração INDEFINIDA e é encerrada pelo árbitro [IPF-TR2026 §3.3] — segure imóvel até o "Press", nunca auto-cronometre a saída. Calibração mental: "contar até 2 mentalmente equivale a cerca de 1 segundo real" [R124 @01:02] [GERAL] ⚠️ [interpretação]: a claim é sobre pause SQUAT, a transferência para o supino é leitura minha. TRAVE OS BRAÇOS ANTES DO "Start" — cartão azul se não travar [IPF-TR2026 §3.3, NOVA 2026]. Da retirada ao início da descida em até 3 s: hoje ele fica ~11 s em lockout, carga isométrica quase máxima ANTES da posição de maior risco [VÍDEO-BP §3.10, §7.1] ⚠️ achado do relatório de vídeo, ZERO claims no corpus sobre tempo no topo [tecnica §3.6]. COMANDO DADO POR TERCEIRO sempre que houver parceiro — "as condições de competição podem ser mais difíceis mesmo que a pausa não seja mais longa, simplesmente porque o atleta não controla o comando" [R83 @01:37] [GERAL] ⚠️ o canal NUNCA prescreve treinar com comando de terceiro, só long pause e spoto, que são autocontrolados [tecnica §3.4, LACUNA]. NÃO EXISTE SINGLE NA S1 NEM NA S2: {SUP-F-REPS} roda 3 e a leitura da S2 é a back-off. FILME DE LADO, pré-condição do bloco. GATE DE DOR, três momentos — §1.2 |
719:| Supino Pausado (Competição) | 0 | 4 | 3 | {SUP-F-BO} | {RPE-SUP-BO} | 3 MIN | BACK OFF — 4 séries, FIXO, não oscila em nenhuma semana: oscilar aqui derrubaria a semana leve para 21 séries de supino e violaria R3, que pede ≥22 SEMPRE. É esta linha que entrega a dose pesada do bloco: com clamp(TOP−6pp, 82, 88) estas 4 séries mais o top set percorrem RPE 7,5 → 9,5, que é exatamente a faixa peer-reviewed de Pak Androulakis-Korakakis 2021 (3–6 séries de 1–5 reps por levantamento por semana acima de 80% 1RM), SEM prescrever um quilo acima de 92% do TM. REGRA DE PARADA: encerre a série quando ela passar de RPE 9,5 OU quando UMA REP SAIR DO PADRÃO LEGAL — o que vier primeiro. ⚠️ O esquema de reps das back-offs é [interpretação]: design §10 dá o offset e a parada, NÃO dá o esquema. RPE 10 aqui NÃO é falha muscular: é "a barra não fica imóvel na pausa, ou a costela desce além do afundamento da barra". CUES DA PAUSA: arco firme sem colapsar ao tocar o peito, empurrar constantemente com as pernas, rolar a barra para baixo com movimento liderado pelo cotovelo, mover cotovelo, antebraço, mão e barra como um bloco sólido [R93 @04:18] [GERAL]. ANTI-THRUST, que é o que a regra NOVA de 2026 pune: "escolha um ponto de referência no fundo e garanta que as costelas não desçam além do afundamento da barra no peito" [R119 @01:36] [GERAL]. SINAL DIAGNÓSTICO de perda de tightness, VISTO DE LADO: depois de tocar o peito os cotovelos começam a se mover em relação à barra [R160 @03:53] [GERAL] |
720:| Terra Sumo (Sem Strap) | 3 | 1 | 5 | {TER-G} | {RPE-TER-G} | 3 MIN | FILME PERPENDICULAR, ALTURA DO QUADRIL — §3 exige vídeo de "todo top set e todo gauge de terra" e esta é uma das duas linhas que cumprem a regra. GAUGE SET — é a ÚNICA coisa que move o trainingMax do terra. PRIMEIRA SÉRIE DE TRABALHO DO TERRA NO DIA, sempre nesta posição — fonte literal: "subsequent sessions use a gauge set: FIRST WORK SET at a target %" [Noriega], e a posição fixa é o que permite "comparar com pontos equivalentes" [R114 @00:31] [GERAL]. Fica em D2, o dia LEVE de terra, e não em D5: leitura em estado fresco, imune à oscilação de back-offs, e tira 30% da tonelagem axial de D4. 5 reps e não 7 porque "quando você chega em oito reps ou mais, a técnica normalmente é lixo" e "você não quer que o terra vire um exercício de cardio" [Pana]. A carga é 76% do TM, FIXA — ⚠️ a âncora de 5 reps é [interpretação]: Noriega só publica a de 7 reps. RPE NÃO É ALVO NEM TETO AQUI: É A LEITURA. Referência 6,5; ao re-ancorar, a referência RESETA para 6,5 e a semana seguinte é linha de base. Sem strap, reset a cada rep, padrão legal completo. ⚠️ REGRA DE INVALIDAÇÃO: se a série for encerrada por FALHA DE PEGADA e não por esforço de tração, a leitura é INVÁLIDA NOS DOIS SENTIDOS — registre e descarte, não ajuste o TM. 5 reps a 76% sem strap é plausivelmente limitado por pegada, e um instrumento limitado por outra coisa não mede. ⚠️ PROCEDÊNCIA CORRIGIDA: a regra de invalidação é [interpretação] DO DESENHO — não existe no corpus nenhuma claim sobre invalidar uma medida por pegada. O que a base dá é o FATO que a motiva: "costumava sempre soltar o terra pela pegada, mesmo tendo a força para o levantamento" [R42 @00:02] [PESSOAL]. A citação anterior ([R42 @01:33]) apontava para uma claim sobre ciclo vicioso de mãos machucadas, que não sustenta a regra. ⚠️ LIMITE DO INSTRUMENTO, escrito porque a promessa anterior era falsa: a estrutura que PRECEDE este gauge NÃO é invariante entre semanas — o top set de supino de D2 é 1×3 nas S1–S2 e 1×1 da S3 em diante. A comparabilidade semana a semana vale a partir da S3; a leitura da S1 contra a da S2 carrega essa diferença e não deve mover o TM sozinha. Se a mão for o limitante, use grip holds contando até 10 no fim da série [R42 @00:32] [PESSOAL] em vez de strap |
724:| Tríceps Overhead na Polia | 0 | 3 | 10-12 | N/A | 8 | 1-1.5 MIN | Vem por ÚLTIMO na sessão de propósito: "isolamento de tríceps constrói tríceps e ajuda o supino no longo prazo, mas não se deve destruir o tríceps no treino anterior a um máximo de supino — é preciso achar o ponto de corte" [R54 @02:33] [GERAL]. Overhead e não pushdown porque a cabeça longa cruza o ombro e o supino não a treina — "só duas das três cabeças do tríceps são realmente usadas no supino: a cabeça longa cruza a articulação do ombro e atua como extensora de ombro, e como no supino queremos flexionar o ombro, o corpo escolhe não ativá-la tanto" [R101 @01:37] [GERAL], mesma claim em [R30 @02:34]. Suporte externo: Maeo et al., 21 sujeitos, 12 semanas, RM — cabeça longa +28,5% overhead vs +19,6% pushdown (p<0,001); ⚠️ Stasinaki et al. 2018 NÃO replicou, e o próprio Vena alerta contra reagir demais a achado único não replicado [R100 @02:45] — não é fato consolidado [bracos §4.4]. ⚠️ NÃO afirmar que overhead "trabalha a cabeça longa" citando Vena: o que [R119 @04:49] [GERAL] de fato diz é o inverso — "movendo o ombro durante os exercícios de tríceps dá para EVITAR ativar a cabeça longa" — e que evitá-la vale "talvez um pequeno benefício teórico" [R119 @05:23]. Seleção governada por "o exercício exato de tríceps não importa muito… faça aquele em que você aguenta mais volume" [R119 @05:23] [GERAL]. ⚠️ Mesma contradição de volume [R10 @02:08] × [R145 @05:13], declarada em §1 |
730:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
732:| Agachamento Low Bar (Profundidade Legal) | 3 | 1 | 7 | {AG-G} | {RPE-AG} | 3 MIN | GAUGE SET — PRIMEIRO BLOCO DA SESSÃO e primeira série de trabalho de agacho do dia. É INSTRUMENTO, NÃO ESTÍMULO: é a única série do programa que move o trainingMax, com regra bidirecional (§1.1). ALVO RPE 6,5, nunca perseguido — 7 reps a 70% do TM é a âncora "série de 7 a RPE 6–7 = 70%" [Noriega]. Só é comparável contra o gauge de agacho da SEMANA ANTERIOR: "para avaliar progresso fora do pico, compare com pontos equivalentes de ciclos de treino passados — e por isso ao iniciar um novo ciclo mude poucas coisas de cada vez, para manter os ciclos comparáveis" [R114 @00:31] [GERAL]. PORTA: se qualquer rep sair fora da profundidade legal, a leitura NÃO SOBE o TM nesta semana — "agache mais fundo começando com pesos mais leves, onde você bate profundidade sem hesitação, mesmo que precise recuar bastante a carga" [R115 @02:34] [GERAL]. Os 3 aquecimentos são NA PROFUNDIDADE LEGAL: "faça toda repetição funda, desde a barra vazia e os aquecimentos, até virar segunda natureza" [R115 @03:05] [GERAL]. Filme perpendicular, altura do quadril, 3–4 m ⚠️ [interpretação]: o canal prescreve rigor com profundidade mas nunca ensina a aferir [tecnica §1.6, LACUNA] |
733:| Agachamento High Bar | 2 | 8 | 5 | {AG-V} | {RPE-AG} | 3 MIN | PAPEL VOLUME (70–80% × 5–7), não esforço máximo — é o que justifica 3 MIN e não 5 [desvio da prescrição literal, registrado]. 8 séries = 50,0% das 16 séries de agacho da semana [design §13-B/R7, que mede em SÉRIES]; base: "faz cerca de metade de todo o seu volume de agacho com high bar" [R18 @00:33] [PESSOAL] e "high bar é item fixo nos programas dos clientes dele: todo cliente que agacha low bar também faz high bar" [R18 @00:33] [GERAL]. REGRA DURA DE EXECUÇÃO: "programar o high bar com os mesmos cues do low bar: mesma largura de stance, mesma quantidade de inclinação de tronco — NÃO stance estreito, superereto, com joelhos muito à frente"; o estilo ereto "tem lugar se o objetivo for isolar quads, mas negligencia os extensores de quadril" [R18 @01:34] [GERAL]. POR QUE HIGH BAR AQUI: "mais fácil atingir a profundidade e, por não exigir tanta inclinação de tronco quanto o low bar, mais fácil se manter sobre o meio do pé e equilibrado" [R68 @01:31] [GERAL]. CORREÇÃO MESTRA, METADE 1 — ÂNGULO DE TRONCO: você agacha ~15° mais inclinado do que suas alavancas exigem [VÍDEO-SQ §4] ⚠️ [interpretação] de design §2, não é claim do canal. O princípio que transfere é ESPELHAR: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL], "sem mudança de posição do tronco entre a excêntrica e a concêntrica" [R87 @03:12] [GERAL]. ⚠️ A DIREÇÃO da doutrina do canal ("as pessoas deveriam agachar um pouco mais curvadas", [R159 @05:58]) NÃO se aplica a você — [R159 @04:21] [GERAL]: "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação". E a inclinação extra não vira carga: "no good morning squat involuntário, joelhos e quadril vão para trás e para cima mas a barra não sobe nem desce — só transfere carga do joelho para quadril e coluna" [R159 @02:14] [GERAL]. CORREÇÃO MESTRA, METADE 2 — JOELHOS: "empurrar ativamente os joelhos para frente e para fora, sem deixá-los recuar, resolve grande parte do problema" [R169 @14:14] [GERAL], e "manter a posição de joelho permite dirigir corretamente com os quadríceps através do sticking point" [R168 @01:35] [GERAL]. NÃO cuear "peito para cima" nem "quadril para baixo". REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE: encerre a série na rep que perde a profundidade legal ou em que o tronco muda de ângulo entre descida e subida [R115 @03:05] [GERAL]. ⚠️ PRIORIDADE INVERTIDA NESTA REVISÃO, e o motivo está escrito: se alguma série antes da 8ª chegar ao teto de RPE, CORTE A SÉRIE E ENCERRE O EXERCÍCIO — e congele o degrau de {AG-V} na semana seguinte. A regra anterior mandava completar as 8 séries "porque são o requisito de R7", o que CANCELAVA a regra de parada declarada em §0.1 deste mesmo arquivo e em [R10 @00:34] [GERAL], e prescrevia séries na zona em que a rep sai alta — no exercício escolhido justamente por ser o mais barato para exigir rigor. R7 (~50% do volume de agacho em high bar) é [interpretação] e é cota de CONTAGEM; a profundidade legal é a tese do bloco. Legalidade vence cota. DESCIDA EM VELOCIDADE CONSTANTE: "muita gente acelera no fundo, o que anula o propósito; use uma única velocidade consistente do começo ao fim" [R132 @03:38] [GERAL]. Altura do rack: "mirar na parte baixa do peito" e "é sempre melhor errar para baixo do que para cima" [R14 @00:32, @01:02] [GERAL]. Walkout de 3 passos [R14 @04:36] [GERAL]. ⚠️ 8×5 e não 8×6, E ISSO É DIVERGÊNCIA DECLARADA DA SPEC: `SPEC_REV2` §1.3/D3 e §3.4 prescrevem 8×6 e o entregue é 8×5 — −16,7% de reps do secundário. Nenhum checker acusa porque a métrica travada (R7) é em SÉRIES, e por isso a divergência fica escrita aqui e em §9. Motivo: com 8×6 este vira o maior dia axial da semana, dois dias antes do single primário, e as últimas séries passariam do teto de RPE 8. ⚠️ DESCONTO DE HIGH BAR, DECLARADO PARA QUE A INTENSIDADE REAL SEJA COMPUTÁVEL: {AG-V} é percentual do trainingMax de LOW BAR aplicado ao high bar. Adotado `TM_high_bar ≈ 0,90 × TM_low_bar` [interpretação: NÃO existe número no corpus para high bar dividido por low bar, tecnica §2.5 — 10% é a folclórica do esporte e está aqui como número explícito em vez de número escondido]. Logo os 70–74% desta coluna são 77,8–82,2% da capacidade REAL de high bar, e a S16 (74%) sai a ~82% por 5 reps ≈ RPE 9 — ACIMA do teto declarado de 8, em 8 séries semanais. É por isso que a regra de parada aqui é a PROFUNDIDADE e o corte de série acima, e não o RPE. Resolver de verdade exigiria uma âncora própria de high bar, que é número novo e não foi criada |
743:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
757:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
810:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
819:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
828:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
838:| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |

================================================================================
## BLOCO 2 — 25062 chars
================================================================================

# Análise do campo de texto longo — `vena-block1/generated.ts`

## 1. Qual é o campo

**Existe UM só campo de texto longo: `notes`.** Não há `note`, `cue`, `tecnica` nem `aquecimento` no nível de bloco.

Declarado em `/Users/brunnovert/Documents/Dev/powerlifting-app/src/types/index.ts`:

```ts
// linha 353
export interface PrescribedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  rpe: string;
  notes?: string;     // ← linha 359 — o campo
  ...
}
```

Varrendo todas as strings da árvore `venaBlock1Weeks` (18 semanas → 86 dias → 614 blocos), os únicos campos de texto livre são:

| campo | tipo TS | n | max | avg |
|---|---|---|---|---|
| `PrescribedExercise.notes` | `notes?: string` | **614/614 (100 %)** | **4584** | 1592 |
| `PrescribedWeek.weekLabel` | `weekLabel?: string` | 18 | 511 | 157 |
| `PrescribedWeek.blockObjective` | `blockObjective: string` | 18 | 380 | 228 |
| `PrescribedDay.dayLabel` | `dayLabel: string` | 86 | 74 | 53 |

Campos declarados no tipo mas **não emitidos** por este gerador: `PrescribedDay.restNote`, `PrescribedSet.note`, `setPlan` (zero ocorrências). Ou seja: se você vai desenhar um renderizador, só precisa lidar com `notes`. `weekLabel` e `blockObjective` são prosa corrida curta, sem a gramática de cabeçalhos.

## 2. Distribuição de tamanho (`notes`, n = 614)

| | min | p25 | mediana | p75 | p90 | max |
|---|---|---|---|---|---|---|
| **chars** | 60 | 863 | **1388** | 2084 | 2799 | **4584** |
| **palavras** | 15 | 151 | **245** | 392 | 503 | 819 |

Contagem acumulada:

| limiar | blocos | % |
|---|---|---|
| > 200 chars | 610 | 99,3 % |
| **> 400 chars** | **586** | **95,4 %** |
| > 600 chars | 548 | 89,3 % |
| **> 1000 chars** | **451** | **73,5 %** |
| > 1500 chars | 224 | 36,5 % |
| **> 2000 chars** | **176** | **28,7 %** |
| > 3000 chars | 48 | 7,8 % |
| > 4000 chars | 16 | 2,6 % |

Isso não é um "campo de observação". É um documento por bloco. O caso mediano já é maior que a maioria dos cards de UI.

## 3. Gramática interna

### 3.1 Anatomia geral

O texto é uma **sequência linear de segmentos** `CABEÇALHO_CAIXA_ALTA` + delimitador (`:` ou ` — `) + corpo em prosa com citações inline. Não há newlines: `notes` é sempre **uma única linha** (zero `\n` em todos os 614). A segmentação é 100 % tipográfica.

Abertura canônica: **48 blocos** abrem com `PAPEL <ROLE> (<faixa>%)` (ex. `PAPEL PRÁTICA (40–70%).`, `PAPEL VOLUME (70–80% × 5–7)`). **237 blocos** abrem com algum cabeçalho em caixa alta. Os demais (sobretudo `role: "acessorio"`, 352 blocos) abrem em prosa.

Cabeçalhos por bloco: min 0 · mediana 2 · p90 8 · max 11. **126 blocos têm zero cabeçalho** (prosa pura, acessórios). Total 1742 ocorrências / 105 cabeçalhos distintos.

Sufixo gerado por máquina: **226 blocos** terminam exatamente em ` · Alvo ≈ <n> kg @ TM <n>` (anexado pelo builder, ver §7). Esse trecho **não** faz parte da autoria e deve ser renderizado à parte.

### 3.2 Os cabeçalhos mais frequentes (top 40 de 105)

| # | n | cabeçalho |
|---|---|---|
| 1 | 48 | CUES DA PAUSA |
| 2 | 32 | PARADA |
| 3 | 32 | PAPEL VOLUME |
| 4 | 32 | EXECUÇÃO |
| 5 | 32 | CITAÇÃO CORRIGIDA |
| 6 | 32 | CONTRADIÇÃO DA PRÓPRIA BASE, DECLARADA |
| 7 | 32 | FILME PERPENDICULAR, ALTURA DO QUADRIL |
| 8 | 32 | GAUGE SET |
| 9 | 32 | DIA DE PRÁTICA |
| 10 | 32 | SUBSTITUIÇÃO DECLARADA |
| 11 | 32 | PORTA |
| 12 | 32 | SÃO 6 AQUECIMENTOS, NÃO 4 |
| 13 | 32 | LOCKOUT |
| 14 | 17 | GATE DE DOR OBRIGATÓRIO, TRÊS MOMENTOS |
| 15 | 16 | PAPEL PRÁTICA |
| 16 | 16 | PAUSA DE 1 s NA PROFUNDIDADE LEGAL |
| 17 | 16 | PAUSA COM TENSÃO MANTIDA |
| 18 | 16 | POR QUE PAUSAR NO FUNDO |
| 19 | 16 | CORREÇÃO MESTRA, METADE 1 — JOELHOS |
| 20 | 16 | CORREÇÃO MESTRA, METADE 2 — ÂNGULO DE TRONCO |
| 21 | 16 | CARGA |
| 22 | 16 | RIGOR |
| 23 | 16 | PEGADA, REGRA NOVA 2026 |
| 24 | 16 | COMANDOS DESDE A S1 |
| 25 | 16 | O QUE RAMPLA NESTE DIA É A CONTAGEM |
| 26 | 16 | DUAS CAUSAS SEPARADAS DE LUZ VERMELHA |
| 27 | 16 | ANTI-THRUST |
| 28 | 16 | LOCKOUT ANTES DE DESCER |
| 29 | 16 | VÍDEO |
| 30 | 16 | O TETO DE RPE É COLUNA |
| 31 | 16 | PEGADA |
| 32 | 16 | ESTRUTURA DO BLOCO |
| 33 | 16 | LACUNA DECLARADA |
| 34 | 16 | SEM STRAPS |
| 35 | 16 | POR QUE COSTAS ESTÁ ACIMA DE BRAÇO E OMBRO NA FILA |
| 36 | 16 | OS DADOS DIZEM O CONTRÁRIO |
| 37 | 16 | MIGRADO DE D5 |
| 38 | 16 | RPE 4–5 É LITERAL |
| 39 | 16 | STIFF E NÃO RDL, PELA ALAVANCA |
| 40 | 16 | FREQUÊNCIA |

Cauda (n=16 cada, ainda relevante para taxonomia): CONTRAPONTO MAIS RECENTE · EQUIPAMENTO FORA DO INVENTÁRIO CONFIRMADO · REPS ALTAS PORQUE É FÁCIL ROUBAR · HANDOFF · BACK OFF · REGRA DE PARADA · RPE NÃO É ALVO NEM TETO AQUI · REGRA DE INVALIDAÇÃO · PROCEDÊNCIA CORRIGIDA · REGRA NOVA 2026 · PRESCRIÇÃO · REGRA DE CORTE DE SÉRIES · É INSTRUMENTO, NÃO ESTÍMULO · REGRA DURA DE EXECUÇÃO · POR QUE HIGH BAR AQUI · CORREÇÃO MESTRA, METADE 1 — ÂNGULO DE TRONCO · CORREÇÃO MESTRA, METADE 2 — JOELHOS · REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE · DESCIDA EM VELOCIDADE CONSTANTE · DESCONTO DE HIGH BAR… · GAUGE · PAUSA DE 1,0 s EM TODA SEMANA, INCLUSIVE S10–S11 · COMANDOS, OS TRÊS, DADOS POR TERCEIRO, DESDE A S1 · PAUSA · PEGADA 2026 · TOP SET PRIMÁRIO · NAS S1 E S2 ESTA LINHA RODA COMO TRIPLO · EXPOSIÇÃO GRADUADA · TETO DE RPE POR COLUNA · LACUNA · CORREÇÃO EXPLÍCITA · CONTRADIÇÃO DECLARADA · POR QUE EXISTE UM SINGLE AQUI · SEM STRAP DESDE A PRIMEIRA REP… · ESCOLHA UMA PEGADA NA S1 E NÃO MEXA MAIS · ANTI-CUE EXPLÍCITO · ESTA LINHA GANHOU COLUNA DE RPE PRÓPRIA · DESCANSO DE 4 MIN É DESVIO CONSCIENTE · TETO DE RPE 8, NUNCA À FALHA · POR QUE ESTE TRABALHO EXISTE… · A VARIÁVEL É DOSE, NÃO POSIÇÃO · TETO DE EQUIPAMENTO REAL · LACUNA, NÃO CITAÇÃO · POR QUE BRAÇO E OMBRO DEPOIS DO TERRA NÃO É IMPRUDÊNCIA · PROGRESSÃO DUPLA · DESVIO REGISTRADO. Mais 10 hapax nas S17–S18 (ÚLTIMA PESADA DO TERRA/AGACHO/SUPINO, A CARGA DESTA SÉRIE É EXATAMENTE A ABERTURA DO SIMULADO, GATE DE DOR GOVERNA ESTA TENTATIVA, O SUPINO NÃO GANHA NADA COM O TAPER…).

**Taxonomia útil para desenho** (os cabeçalhos caem em ~7 classes):
- *Papel/dose*: `PAPEL …`, `PRESCRIÇÃO`, `ESTRUTURA DO BLOCO`, `PROGRESSÃO DUPLA`, `FREQUÊNCIA`, `CARGA`
- *Execução/cue*: `EXECUÇÃO`, `CUES DA PAUSA`, `PAUSA…`, `LOCKOUT`, `PEGADA…`, `HANDOFF`, `DESCIDA EM VELOCIDADE CONSTANTE`, `CORREÇÃO MESTRA, METADE n — …`
- *Regra de parada / teto*: `PARADA`, `REGRA DE PARADA`, `TETO DE RPE …`, `REGRA DE CORTE DE SÉRIES`, `RPE NÃO É ALVO NEM TETO AQUI`
- *Instrumento / medição*: `GAUGE`, `GAUGE SET`, `PORTA`, `REGRA DE INVALIDAÇÃO`, `É INSTRUMENTO, NÃO ESTÍMULO`
- *Vídeo/registro*: `VÍDEO`, `FILME PERPENDICULAR, ALTURA DO QUADRIL`
- *Regra IPF*: `REGRA NOVA 2026`, `PEGADA 2026`, `COMANDOS…`, `DUAS CAUSAS SEPARADAS DE LUZ VERMELHA`
- *Meta-honestidade (o mais característico deste corpus)*: `LACUNA`, `LACUNA DECLARADA`, `LACUNA, NÃO CITAÇÃO`, `CITAÇÃO CORRIGIDA`, `PROCEDÊNCIA CORRIGIDA`, `CORREÇÃO EXPLÍCITA`, `CONTRADIÇÃO DECLARADA`, `CONTRADIÇÃO DA PRÓPRIA BASE, DECLARADA`, `DESVIO REGISTRADO`, `SUBSTITUIÇÃO DECLARADA`, `ANTI-CUE EXPLÍCITO`, `OS DADOS DIZEM O CONTRÁRIO`, `CONTRAPONTO MAIS RECENTE`

Note o par recorrente **`CORREÇÃO MESTRA, METADE 1 — X` / `METADE 2 — Y`** (32+32): é um sub-cabeçalho de duas partes, e o em-dash aqui é *parte* do cabeçalho, não delimitador. Qualquer parser ingênuo em `—` quebra isso.

### 3.3 Regex dos cabeçalhos

A regex que funcionou melhor (aceita a continuação `— SUBPARTE`, aceita minúsculas só de unidades/preposições `s kg cm min de do da e em na no por x é`, aceita uma citação `[...]` colada antes do delimitador, e ancora em fronteira de sentença, `]`, ou `⚠️`):

```js
const HEADER = /(?:^|(?<=[.;!?]\s)|(?<=\]\s)|(?<=⚠️\s)|(?<=⚠\s))((?:[A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ][A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ]+|[A-Z0-9À-Ü§%°º,\/"“”\-–]+|\d+(?:[,.]\d+)?|s|kg|cm|min|de|do|da|e|em|na|no|por|x|é)(?:[ ](?:[A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ0-9§%°º,\/"“”\-–—]+|s|kg|cm|min|de|do|da|e|em|na|no|por|x|é)){0,14})(?:\s*\[[^\]]{1,60}\])?\s*(?=[:—(])/g;
// pós-filtro obrigatório: descartar match cujo conteúdo alfabético maiúsculo tenha < 3 letras;
// e aparar vírgula/hífen finais.
```

**Teste em amostra de 30 textos únicos** (amostragem determinística, 1 a cada ~4 dos 132 únicos): 109 matches, 62 cabeçalhos distintos, **0 falso-positivo identificável** na amostra.

**No corpus inteiro** (1742 matches): 2 formas são FP claros — `NOVA 2026` (16×, rematch do rabo de `PEGADA, REGRA NOVA 2026 — "…" [IPF-TR2026 §3.2]:`, ou seja o segundo `:` da mesma frase) e `DO DESENHO` (16×, ênfase no meio de frase: `a regra de invalidação é [interpretação] DO DESENHO —`). **Precisão ≈ 98,2 %** (1710/1742). Um FP menor de forma: `QUEM SUSTENTA O PAPEL DE ERETORES é` captura o `é` minúsculo final (limpar com `/\s+é$/`).

**Recall**: sobram 73 candidatos maiúsculos seguidos de `:` não capturados, quase todos **ênfase intra-frase e não cabeçalho** (`o princípio que transfere é ESPELHAR:`, `ÂNGULO DE TRONCO:`, `NÃO CONSTANTE:`, `VISTO DE LADO:`). Falsos negativos genuínos: `SPOTO PRESS REJEITADO:` (7×) e `TOP SET.` seguido de `NAS S1 E S2 RODA COMO TRIPLO` (16×, o `.` interno divide o cabeçalho em dois). Recall efetivo ≈ 96–98 %.

Se você quiser recall total às custas de precisão, relaxe a âncora removendo o lookbehind — mas aí `ESPELHAR:`, `NÃO:` e afins entram. Recomendo manter a âncora e tratar caps-intra-frase como um *segundo* token de marcação (ênfase inline), não como cabeçalho.

### 3.4 Citações

Regex geral: `/\[([^\]]+)\]/g` — **7741 ocorrências**, média **12,6 citações por bloco**, 607/614 blocos têm ≥1.

| forma | regex | n |
|---|---|---|
| `[R115 @03:05]` (vídeo + timestamp) | `/\[R\d+ @\d{2}:\d{2}\]/g` | **3062** |
| `[GERAL]` (escopo) | `/\[GERAL\]/g` | **2531** |
| `[PESSOAL]` (escopo) | `/\[PESSOAL\]/g` | **418** |
| `[design §13-B/R11]` | `/\[design §[^\]]*\]/g` | **352** |
| `[interpretação]`, `[interpretação de design §2]`, `[interpretação: …]` | `/\[interpretação[^\]]*\]/g` | **338** |
| `[IPF-TR2026 §3.2]` | `/\[IPF-TR2026 §[^\]]*\]/g` | **233** |
| `[VÍDEO-SQ §4, §5]`, `[VÍDEO-BP §3.2]` | `/\[VÍDEO-[A-Z]{2} §[^\]]*\]/g` | **160** |
| `[SPEC §2.2]` | `/\[SPEC[^\]]*\]/g` | **112** |
| `[R115]` (sem timestamp) | `/\[R\d+\](?! @)/g` | **98** |
| `[tecnica §2.1, §2.3]` | `/\[tecnica §[^\]]*\]/g` | 145 (81 + 64 com `, LACUNA`) |
| `[bracos §…]` | | 64 |
| `[elites §3.3, §8]` | | 96 |
| `[R14 @04:36, @01:02]` (multi-timestamp) | `/\[R\d+ @\d{2}:\d{2}(?:, @\d{2}:\d{2})+\]/` | 16 |
| `[R168 @02:11-03:00]` (range) | `/\[R\d+ @\d{2}:\d{2}-\d{2}:\d{2}\]/` | 16 |
| `[Noriega]`, `[Pana]`, `[Nippard PB1.2]` | autor nu | 32 / 16 / 32 |
| `[desvio da prescrição literal, registrado]` | prosa entre colchetes | 16 |

Regex unificada sugerida (uma passada, com grupo de tipo):

```js
/\[(?<v>R\d+)(?<ts>(?: @\d{2}:\d{2}(?:-\d{2}:\d{2})?)(?:, @\d{2}:\d{2})*)?\]|\[(?<scope>GERAL|PESSOAL)\]|\[(?<doc>design|SPEC|tecnica|bracos|elites|IPF-TR2026|VÍDEO-[A-Z]{2})(?<sec>[^\]]*)\]|\[(?<meta>interpretação|LACUNA)(?<rest>[^\]]*)\]|\[(?<free>[^\]]+)\]/g
```

Existe **encadeamento canônico**: `"citação verbatim" [R124 @01:02] [GERAL]` — vídeo seguido de escopo. Ao renderizar, os pares `[Rn @ts][GERAL|PESSOAL]` devem virar UM chip, não dois.

Nada bate `[FOTO…]` nem `[LACUNA]` como colchete isolado — `LACUNA` aparece como palavra em prosa e dentro de `[tecnica §x, LACUNA]`.

### 3.5 Marcadores de alerta

| marcador | ocorrências | blocos que contêm |
|---|---|---|
| `⚠️` (sempre U+26A0 + U+FE0F; nunca aparece sem VS16) | **1290** | **536 / 614 (87 %)** |
| `NÃO` (palavra em caixa alta) | 874 | 423 |
| `ZERO` | 224 | 224 |
| `LACUNA` | 144 | 144 |
| `NUNCA` | 112 | 80 |
| `OBRIGATÓRI*` | 33 | 33 |
| `PROIBIDO` | 16 | 16 |
| `ANTI-CUE` | 16 | 16 |

`⚠️` é o marcador dominante e quase sempre inicia um segmento (por isso está no lookbehind da regex de cabeçalho). Trate-o como *nível de segmento*, não como emoji decorativo.

### 3.6 Trechos verbatim entre aspas duplas

- **2956 ocorrências**, **172 strings únicas** (alta reutilização — são as citações do corpus Vena/IPF).
- Tamanho: média **85 chars**, mediana **79**, máx **302**.
- **575 / 614 blocos (93,6 %)** contêm pelo menos um trecho entre aspas.
- Regex: `/"([^"]{2,})"/g`. Cuidado: no arquivo `.ts` elas estão escapadas (`\"`), mas após `JSON.parse` são aspas retas U+0022. Há também `“ ”` no corpus, em quantidade muito menor.
- Padrão canônico: `"<verbatim>" [<fonte>] [<escopo>]` — a aspa sempre precede a citação.

## 4. Texto mais longo, completo (4584 chars)

`blockId: w4d3b1` · Agachamento High Bar · semana 4 · `role: "volume"`

> PAPEL VOLUME (70–80% × 5–7), não esforço máximo — é o que justifica 3 MIN e não 5 [desvio da prescrição literal, registrado]. 8 séries = 50,0% das 16 séries de agacho da semana [design §13-B/R7, que mede em SÉRIES]; base: "faz cerca de metade de todo o seu volume de agacho com high bar" [R18 @00:33] [PESSOAL] e "high bar é item fixo nos programas dos clientes dele: todo cliente que agacha low bar também faz high bar" [R18 @00:33] [GERAL]. REGRA DURA DE EXECUÇÃO: "programar o high bar com os mesmos cues do low bar: mesma largura de stance, mesma quantidade de inclinação de tronco — NÃO stance estreito, superereto, com joelhos muito à frente"; o estilo ereto "tem lugar se o objetivo for isolar quads, mas negligencia os extensores de quadril" [R18 @01:34] [GERAL]. POR QUE HIGH BAR AQUI: "mais fácil atingir a profundidade e, por não exigir tanta inclinação de tronco quanto o low bar, mais fácil se manter sobre o meio do pé e equilibrado" [R68 @01:31] [GERAL]. CORREÇÃO MESTRA, METADE 1 — ÂNGULO DE TRONCO: você agacha ~15° mais inclinado do que suas alavancas exigem [VÍDEO-SQ §4] ⚠️ [interpretação] de design §2, não é claim do canal. O princípio que transfere é ESPELHAR: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL], "sem mudança de posição do tronco entre a excêntrica e a concêntrica" [R87 @03:12] [GERAL]. ⚠️ A DIREÇÃO da doutrina do canal ("as pessoas deveriam agachar um pouco mais curvadas", [R159 @05:58]) NÃO se aplica a você — [R159 @04:21] [GERAL]: "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação". E a inclinação extra não vira carga: "no good morning squat involuntário, joelhos e quadril vão para trás e para cima mas a barra não sobe nem desce — só transfere carga do joelho para quadril e coluna" [R159 @02:14] [GERAL]. CORREÇÃO MESTRA, METADE 2 — JOELHOS: "empurrar ativamente os joelhos para frente e para fora, sem deixá-los recuar, resolve grande parte do problema" [R169 @14:14] [GERAL], e "manter a posição de joelho permite dirigir corretamente com os quadríceps através do sticking point" [R168 @01:35] [GERAL]. NÃO cuear "peito para cima" nem "quadril para baixo". REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE: encerre a série na rep que perde a profundidade legal ou em que o tronco muda de ângulo entre descida e subida [R115 @03:05] [GERAL]. ⚠️ PRIORIDADE INVERTIDA NESTA REVISÃO, e o motivo está escrito: se alguma série antes da 8ª chegar ao teto de RPE, CORTE A SÉRIE E ENCERRE O EXERCÍCIO — e congele o degrau de 70% na semana seguinte. A regra anterior mandava completar as 8 séries "porque são o requisito de R7", o que CANCELAVA a regra de parada declarada em §0.1 deste mesmo arquivo e em [R10 @00:34] [GERAL], e prescrevia séries na zona em que a rep sai alta — no exercício escolhido justamente por ser o mais barato para exigir rigor. R7 (~50% do volume de agacho em high bar) é [interpretação] e é cota de CONTAGEM; a profundidade legal é a tese do bloco. Legalidade vence cota. DESCIDA EM VELOCIDADE CONSTANTE: "muita gente acelera no fundo, o que anula o propósito; use uma única velocidade consistente do começo ao fim" [R132 @03:38] [GERAL]. Altura do rack: "mirar na parte baixa do peito" e "é sempre melhor errar para baixo do que para cima" [R14 @00:32, @01:02] [GERAL]. Walkout de 3 passos [R14 @04:36] [GERAL]. ⚠️ 8×5 e não 8×6, E ISSO É DIVERGÊNCIA DECLARADA DA SPEC: \`SPEC_REV2\` §1.3/D3 e §3.4 prescrevem 8×6 e o entregue é 8×5 — −16,7% de reps do secundário. Nenhum checker acusa porque a métrica travada (R7) é em SÉRIES, e por isso a divergência fica escrita aqui e em §9. Motivo: com 8×6 este vira o maior dia axial da semana, dois dias antes do single primário, e as últimas séries passariam do teto de RPE 8. ⚠️ DESCONTO DE HIGH BAR, DECLARADO PARA QUE A INTENSIDADE REAL SEJA COMPUTÁVEL: 70% é percentual do trainingMax de LOW BAR aplicado ao high bar. Adotado \`TM_high_bar ≈ 0,90 × TM_low_bar\` [interpretação: NÃO existe número no corpus para high bar dividido por low bar, tecnica §2.5 — 10% é a folclórica do esporte e está aqui como número explícito em vez de número escondido]. Logo os 70–74% desta coluna são 77,8–82,2% da capacidade REAL de high bar, e a S16 (74%) sai a ~82% por 5 reps ≈ RPE 9 — ACIMA do teto declarado de 8, em 8 séries semanais. É por isso que a regra de parada aqui é a PROFUNDIDADE e o corte de série acima, e não o RPE. Resolver de verdade exigiria uma âncora própria de high bar, que é número novo e não foi criada · Alvo ≈ 152,5 kg @ TM 215

Repare em dois detalhes de renderização: há **crases de markdown inline** (`` `SPEC_REV2` ``, `` `TM_high_bar ≈ 0,90 × TM_low_bar` ``, `` `gaugeEstruturaAnteriorVaria` ``) — código inline dentro de `notes`. E o texto termina **sem ponto final**, porque o ` · Alvo ≈ …` é concatenado pela máquina.

## 5. Exemplo mediano, completo (1388 chars)

`blockId: w16d3b2` · Supino Pausado (Competição) · semana 16 · `role: "gauge"`

> GAUGE — primeira série de trabalho de supino do dia. PAUSA DE 1,0 s EM TODA SEMANA, INCLUSIVE S10–S11: sem isso o gauge mede aclimatação à pausa, não força. ALVO RPE 6,5. Os 2 aquecimentos também são pausados 1,0 s — invariante PAUSA-1S, nenhuma rep de barra de supino de competição abaixo de 1,0 s em nenhuma semana. ⚠️ Este gauge é lido DEPOIS de 8 séries de high bar: é comparável SÓ contra o gauge de supino da semana anterior, nunca contra o supino de D1, D2 ou D4 [R114 @00:31] [GERAL]. ⚠️ E A ESTRUTURA ANTERIOR A ELE VARIA, contra o que esta nota prometia: as 8 séries de high bar que o precedem sobem 74% 70% → 72% (S9) → 74% (S13), ou seja, a fadiga a montante CRESCE MONOTONICAMENTE ao longo do bloco. A promessa foi removida em vez de mantida falsa. O viés é CONSERVADOR — mais fadiga antes empurra a leitura para baixo, e leitura para baixo não sobe o TM —, mas o gauge de supino deve ser lido sabendo disso, e o gerador publica \`gaugeEstruturaAnteriorVaria\` em \`VENA_BLOCK1_MEASURES\` para que a variação seja auditável. PORTA: se qualquer coluna do eixo exposicao_peito subiu nesta semana (SUP-V1, SUP-V4, PAUSA-P, PEC-SETS), a leitura é INVÁLIDA PARA SUBIR; só a direção de descer age. Do rack ao início da descida em até 3 s ⚠️ [VÍDEO-BP §7.1, interpretação] — LACUNA TOTAL registrada: zero claims no corpus sobre tempo em lockout [tecnica §3.6] · Alvo ≈ 112,5 kg @ TM 160

E o mais curto (60 chars), `w17d4b2`: `Idem. Sem strap, reset a cada rep · Alvo ≈ 172,5 kg @ TM 240` — note o `Idem.`, que é uma referência anafórica ao bloco anterior. Existe esse padrão de continuação; um renderizador que colapsa/reordena blocos quebra o sentido.

## 6. Dedupe

**132 textos únicos para 614 blocos.** 

- 83 grupos com repetição, 49 textos aparecem 1 única vez.
- **O padrão dominante é ×16**: o mesmo texto idêntico nas semanas 1→16. Ex.: Remada Unilateral com Halter (1250 chars) ×16, Puxada Vertical (1369) ×16, Stiff-Legged Deadlift (2264) ×16, Terra Sumo Sem Strap (2428) ×16, Extensão Lombar (1417) ×16, Elevação Lateral (1029) ×16, Rosca na Polia (1245) ×16, Face Pull (757) ×16, Tríceps Overhead (1396) ×16, Leg Press (380) ×16, Mesa Flexora (860) ×16, Puxada Neutra (830) ×16.
- Os textos únicos (1×) concentram-se nas **semanas 17–18** (taper e simulado), que vêm de tabelas explícitas e não de template.
- Os blocos com `%1RM` variam entre semanas **só pelo sufixo ` · Alvo ≈ X kg @ TM Y`** — ou seja, quando o hash difere entre semanas para o mesmo exercício, muitas vezes é apenas esse sufixo numérico. Se você deduplicar *ignorando o sufixo*, o número de únicos cai ainda mais.

**Implicação de desenho**: o texto é essencialmente **por linha-de-template (59 linhas no markdown)**, não por semana. Vale cachear/renderizar uma vez por `exerciseId+role` e sobrepor a parte variável.

## 7. Origem no PROGRAMA.md e transporte pelo builder

### Onde nasce

`/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/vena-block1/source/PROGRAMA.md`

O texto é a **8ª e última coluna, chamada `Notas`**, das tabelas markdown de 8 colunas:

```
linha 700: | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
linha 701: |---|---|---|---|---|---|---|---|
linha 702: | Agachamento Low Bar (Profundidade Legal) | 3 | 2 | 3 | {AG-P} | {RPE-AG} | 3 MIN | PAPEL PRÁTICA (40–70%). PAUSA DE 1 s NA PROFUNDIDADE LEGAL — …
```

A linha 702 tem **3760 chars** — a tabela markdown carrega o documento inteiro numa única célula de pipe-table.

Duas famílias de tabelas alimentam `notes`:

- **`## 6. TEMPLATES DE DIA (semanas 1 a 16)`** — linha 696. Cinco templates: `### TEMPLATE D1` (698), `D2` (714), `D3` (730), `D4` (743), `D5` (757), cabeçalho de 8 colunas nas linhas 700, 716, 730, 743, 757.
- **Dias explícitos** — `## 7. SEMANA 17 — TAPER` (772) e `## 8. SEMANA 18` (848), com `### SEMANA 17 - DIA 1` (808), `DIA 2` (817), `DIA 3` (826), `DIA 4` (836), `### SEMANA 18 - DIA 1` (850), `DIA 2` (866), e mais tabelas nas linhas 810, 819, 828, 838, 858, 919.

Total: **59 linhas de tabela de 8 colunas**; coluna `Notas` com média 1183 chars, máx **4563 chars na linha 733** (Agachamento High Bar do TEMPLATE D3 — é a origem do texto de 4584 chars da §4). **8 das 59** contêm placeholders `{VAR}` dentro da própria coluna Notas.

### Como o builder transporta

`/Users/brunnovert/Documents/Dev/powerlifting-app/scripts/build-vena-block1.mjs`

1. **Linhas 168–174** — tokenização crua da tabela. É aqui que a gramática impõe uma restrição forte: `splitRow` faz `split('|')`, portanto **`|` é proibido dentro do texto** e não há escape.
   ```js
   function splitRow(line) {
     return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map((c) => c.trim());
   }
   function isTableRow(line) { return line.startsWith('| ') && !line.includes('|---'); }
   ```
   O `.trim()` por célula também significa que **espaços de borda são perdidos** e que o texto é forçosamente uma linha só (sem `\n`) — daí o achado da §3.1.

2. **Linhas 460–505** (`parseDays`) — separa `templates` (`### TEMPLATE Dn (…)`) de `explicit` (`### SEMANA n - DIA n (…)`, regex na linha 474). Linha **492** trava a aridade: `if (cols.length !== 8) throw new Error(...)`. As linhas cruas vão para `current.rows`.

3. **Linhas 508–517** (`applyVars`) — substitui `{VAR}` por valores da grade de rampas da semana, aplicado a **todas as 8 células**, inclusive `Notas` (linha 519: `const cols = rawCols.map((c) => applyVars(c, weekNumber, grade))`). Variável sem valor na semana (`—`) é erro fatal. É por isso que os 614 `notes` finais têm **zero `{VAR}` sobrando**.

4. **Linha 520** — a extração posicional. `notesRaw` é literalmente a 8ª célula:
   ```js
   const [label, warmRaw, workRaw, reps, pctRaw, rpeRaw, restRaw, notesRaw] = cols;
   ```

5. **Linha 552** — `let notes = notesRaw;` (passa-através, sem sanitização, sem parsing, sem validação de conteúdo — o builder **não** conhece a gramática de cabeçalhos/citações).

6. **Linha 564** — a única mutação do texto, quando o bloco tem `%1RM`:
   ```js
   notes = `${notesRaw} · Alvo ≈ ${fmtKg(kg)} kg @ TM ${fmtKg(refs[lift])}`;
   ```
   Explica os 226/614 blocos com sufixo. É o único trecho de `notes` gerado por máquina.

7. **Linha 579** — `if (notes) ex.notes = notes;` (por isso `notes` é opcional no tipo, embora na prática 614/614 tenham).

8. **Linhas 1036–1049** — expansão: `for (let weekNumber = 1; weekNumber <= templateWeeks; weekNumber += 1)` roda os 5 templates ×16 semanas chamando `buildExercise` (1045). É a fonte do padrão ×16 da §6. Linhas **1051–1062** processam os dias explícitos das S17–S18 (fonte dos hapax).

9. **Linhas 1157–1159 e 1181** — emissão:
   ```js
   export const venaBlock1Weeks: PrescribedWeek[] = `;
   const body = JSON.stringify(weeks, null, 2);
   ...
   writeFileSync(OUT, result.content);
   ```
   `JSON.stringify` é o que escapa as aspas duplas verbatim como `\"` no `.ts` — no runtime elas voltam a ser `"`.

**Resumo do caminho**: `PROGRAMA.md` coluna 8 `Notas` → `splitRow` (168) → `parseDays.rows` (492) → `applyVars` (519) → `notesRaw` (520) → `notes` (552) → `+ sufixo Alvo` (564) → `ex.notes` (579) → ×16 semanas (1036) → `JSON.stringify` (1159) → `generated.ts` linhas 2172–17373 (`venaBlock1Weeks`).

Nenhum arquivo foi modificado. Um detalhe de operação: o array `venaBlock1Weeks` ocupa as linhas 2172–17373 do `generated.ts` e é JSON puro após remover o prefixo `export const … = ` e o `;` final — dá para carregar com `JSON.parse` sem transpilar, que é como todas as medições acima foram feitas.

================================================================================
## BLOCO 3 — 24136 chars
================================================================================

Li o arquivo inteiro (999 linhas — o cabeçalho diz 981, mas o arquivo tem 999). Segue o esqueleto, sem as colunas de Notas.

Arquivo: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/vena-block1/source/PROGRAMA.md`
Companheiro: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/vena-block1/source/CONTEXTO.md`
Saída gerada: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/vena-block1/generated.ts`

---

# 1. Os 5 templates de dia (§6, linhas 696–770)

Ordem da semana (§5, l.661): `D1 · descanso · D2 · D3 · descanso · D4 · D5`. Formato de 8 colunas; `Aquec`/`Trab` = séries de aquecimento / de trabalho.

### D1 — "Agacho pausado NA profundidade legal · Supino volume · Costas · Extensores"
Papel: prática de agacho na amplitude legal + volume de supino + o dia de costas/eretores (sem tríceps, de propósito, porque D2 é o supino de força).

| # | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|
| 1 | Agachamento Low Bar (Profundidade Legal) | 3 | 2 | 3 | {AG-P} | {RPE-AG} | 3 MIN |
| 2 | Supino Pausado (Competição) | 3 | {SUP-V1} | 5 | {SUP-V1-PCT} | {RPE-SUP} | 3 MIN |
| 3 | Floor Press (Barra) | 1 | {FP-SETS} | 8 | N/A | {FP-RPE} | 2 MIN |
| 4 | Remada Unilateral com Halter | 1 | 4 | 6-8 | N/A | 9 | 2 MIN |
| 5 | Puxada Vertical | 1 | 4 | 8-10 | N/A | 9 | 2 MIN |
| 6 | Stiff-Legged Deadlift | 1 | 1 | 8 | N/A | 4-5 | 2 MIN |
| 7 | Extensão Lombar (Hiperextensão) | 0 | 3 | 10-15 | N/A | 9 | 1-1.5 MIN |
| 8 | Elevação Lateral (DB) | 0 | 2 | 10-15 | N/A | 9 | 1-1.5 MIN |
| 9 | Rosca na Polia | 0 | 2 | 8-12 | N/A | 9 | 1-1.5 MIN |

Descanso sugerido: 1 dia.

### D2 — "Força de Supino · Gauge e Prática de Terra · Costas"
Papel: o único dia de FORÇA de supino (top single + back-off) + gauge/prática de terra.

| # | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|
| 1 | Supino Pausado (Competição) | 6 | 1 | {SUP-F-REPS} | {SUP-F} | {RPE-SUP} | 3 MIN |
| 2 | Supino Pausado (Competição) | 0 | 4 | 3 | {SUP-F-BO} | {RPE-SUP-BO} | 3 MIN |
| 3 | Terra Sumo (Sem Strap) | 3 | 1 | 5 | {TER-G} | {RPE-TER-G} | 3 MIN |
| 4 | Terra Sumo (Sem Strap) | 0 | 3 | 3 | {TER-P} | 6 | 3 MIN |
| 5 | Puxada Vertical (Pegada Neutra) | 1 | 4 | 5-8 | N/A | 8 | 2 MIN |
| 6 | Face Pull na Polia | 0 | 3 | 15-20 | N/A | 8 | 1-1.5 MIN |
| 7 | Tríceps Overhead na Polia | 0 | 3 | 10-12 | N/A | 8 | 1-1.5 MIN |

Descanso sugerido: 0 dias.

### D3 — "Gauges · High Bar secundário · Supino prática"
Papel: dia dos instrumentos (gauge de agacho e de supino na 1ª série) + o volume de high bar como agacho secundário; é o maior dia axial da semana.

| # | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|
| 1 | Agachamento Low Bar (Profundidade Legal) | 3 | 1 | 7 | {AG-G} | {RPE-AG} | 3 MIN |
| 2 | Agachamento High Bar | 2 | 8 | 5 | {AG-V} | {RPE-AG} | 3 MIN |
| 3 | Supino Pausado (Competição) | 2 | 1 | 7 | {SUP-G} | {RPE-SUP} | 3 MIN |
| 4 | Supino Pausado (Competição) | 0 | 4 | 3 | {SUP-P} | 6 | 3 MIN (pausa {PAUSA-P}) |
| 5 | Leg Press 45° | 1 | 3 | 10-12 | N/A | 9 | 2 MIN |
| 6 | Mesa Flexora | 0 | 4 | 10-12 | N/A | 9 | 1-1.5 MIN |

Descanso sugerido: 1 dia.

### D4 — "Agacho Low Bar PRIMÁRIO · Supino volume · Ombro e Braço"
Papel: o single primário de agacho + back-off; supino é volume; braço/ombro.

| # | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|
| 1 | Agachamento Low Bar (Profundidade Legal) | 6 | 1 | {AG-F-REPS} | {TOP-AG} | {RPE-AG} | 5 MIN |
| 2 | Agachamento Low Bar (Profundidade Legal) | 0 | {AGBO} | 3 | {BO-AG} | {RPE-AG-BO} | 5 MIN |
| 3 | Supino Pausado (Competição) | 3 | {SUP-V4} | 7 | {SUP-V4-PCT} | {RPE-SUP} | 3 MIN |
| 4 | Floor Press (Barra) | 0 | {FP4-SETS} | 8-10 | N/A | {FP4-RPE} | 2 MIN |
| 5 | Tríceps Testa | 0 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN |
| 6 | Elevação Lateral (DB) | 0 | 3 | 10-15 | N/A | 9 | 1-1.5 MIN |
| 7 | Rosca na Polia | 0 | 3 | 8-12 | N/A | 9 | 1-1.5 MIN |

Descanso sugerido: 0 dias.

### D5 — "Terra sumo FORÇA · Braço, ombro e peito alongado"
Papel: o dia de FORÇA de terra (no dia seguinte ao agacho primário, por Perkins) + toda a dose de peito alongado e braço.

| # | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|
| 1 | Terra Sumo (Sem Strap) | 6 | 1 | {TER-F-REPS} | {TOP-TER} | {RPE-TER} | 4 MIN |
| 2 | Terra Sumo (Sem Strap) | 0 | 3 | 3 | {BO-TER} | {RPE-TER-BO} | 4 MIN |
| 3 | Supino Inclinado com Halter | 2 | {PEC-SETS} | 8-10 | N/A | {PEC-RPE} | 2 MIN |
| 4 | Crucifixo no Peck Deck | 1 | {PEC-SETS} | 12-15 | N/A | {PEC-RPE} | 1-1.5 MIN |
| 5 | Elevação Lateral (DB) | 1 | 4 | 10-15 | N/A | 9 | 1-1.5 MIN |
| 6 | Rosca Inclinada (DB) | 1 | 3 | 8-10 | N/A | 9 | 1-1.5 MIN |
| 7 | Rosca Martelo | 0 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN |
| 8 | Tríceps Overhead na Polia | 1 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN |

Descanso sugerido: 0 dias.

Papéis formais de cada linha (bloco ```papeis```, §2, l.425–504), com `roundGuard` por papel: `forca`/`pico` → floor, `volume` → ceiling, `backoff`/`gauge`/`pratica`/`acessorio` → nearest. Faixa de % por papel: `forca`/`pico` 86–92 · `backoff` 82–88 · `volume` 70–80 · `gauge` 65–80 · `pratica` 40–70 · `leve` 55–85 · `facil` 55–75 · `tentativa` isento.

---

# 2. Arquitetura de fases das 18 semanas

| Fase | Semanas | O que é | Seção |
|---|---|---|---|
| Calibração | 1–3 | 3 semanas, 3 instrumentos distintos, um por semana. S1 = gauge set (7 reps; terra 5) a teto RPE 6, âncora 70% (terra 76%). S2 = back-off (triplo a teto RPE 7), âncora 80%. S3 = top set, o primeiro single do bloco, a teto RPE 8, âncora 90% (supino RPE 7). Não existe single em S1/S2: o top set roda como triplo nos três lifts. Cargas prescritas por teto de RPE (células `RPE n`), não por %. | ```calibracao``` §1 (l.325) + GRADE C rótulos (l.597) |
| Gate | entre S3 e S4 | Grava o `trainingMax` e converte tudo para %. | §1 (l.331–351) |
| Bloco por percentual | 4–16 | 13 semanas. Toda carga é % do `trainingMax` corrente. Templates D1–D5 fixos; só as colunas da grade mudam. Rampa monotônica com semanas leves em S5, S7 e S11 (`AGBO` 4→3, só o agacho, só para baixo). Ponto de revisão fixado na S8 (a aposta das 16 semanas + o teto de EXP). | §4 GRADES A/B/C, §6 |
| Taper | 17 | 10 dias, 4 sessões, dias explícitos (fora da regra "só a carga varia"). Acessórios a ZERO. | §7 (l.772) |
| Dia fácil + simulado | 18 | D−3 dia fácil com ensaio de comandos; D0 simulado com 3 tentativas por levantamento. | §8 (l.848) |

Contexto: `sessoes_total = 86`, `dias_por_semana_bloco = 5`, `semanas_calibracao = 3`, `semanas_bloco = 16`, `taper_dias = 10`. A aposta de 16 semanas está declarada como o ponto mais contestável do desenho (l.38): a base aponta 4–12 semanas, revisão obrigatória na S8.

---

# 3. Grades de rampa — variáveis e valores nas semanas 1, 4, 8, 12, 16

Eixos declarados em ```eixos``` (§1, l.250–288). `RPE n` = carga descoberta por teto de RPE; `NN%` = percentual do TM corrente. Célula em kg é erro de build.

### GRADE A — agacho (l.551)

| Var | Eixo / governa | S1 | S4 | S8 | S12 | S16 |
|---|---|---|---|---|---|---|
| TOP-AG | carga_agacho, monotônica — top set de D4 | RPE 6 | 86% | 88% | 90% | 92% |
| AG-F-REPS | instrumento_calibracao (recuo S3) — reps do top set | 3 | 1 | 1 | 1 | 1 |
| BO-AG | carga_agacho — back-off de D4 | RPE 6 | 82% | 82% | 84% | 86% |
| AGBO | volume_agacho, oscilante 3–4 — nº de séries de back-off | 4 | 4 | 4 | 4 | 4 |
| RPE-AG | parada_agacho (teto) | 6 | 8 | 8 | 8 | 8 |
| RPE-AG-BO | parada_agacho back-off (teto) | 6 | 9.5 | 9.5 | 9.5 | 9.5 |
| AG-G | instrumentação, constante — gauge de agacho (D3#1, 7 reps) | RPE 6 | 70% | 70% | 70% | 70% |
| AG-V | carga_agacho — high bar 8×5 de D3 | RPE 6 | 70% | 70% | 72% | 74% |
| AG-P | carga_agacho — prática pausada de D1 | RPE 5 | 62% | 63.5% | 65% | 66% |

### GRADE B — supino (l.574)

| Var | Eixo / governa | S1 | S4 | S8 | S12 | S16 |
|---|---|---|---|---|---|---|
| SUP-F | carga_supino — top set D2 | RPE 6 | 86% | 87.5% | 89% | 92% |
| SUP-F-REPS | instrumento_calibracao | 3 | 1 | 1 | 1 | 1 |
| SUP-F-BO | carga_supino — back-off D2 (= SUP-F − 6pp) | RPE 6 | 82% | 82% | 83% | 86% |
| RPE-SUP | parada_supino (teto) | 6 | 7.5 | 7.5 | 8 | 8 |
| RPE-SUP-BO | parada back-off | 6 | 9.5 | 9.5 | 9.5 | 9.5 |
| SUP-V1 | exposicao_peito — nº séries do volume de D1 | 2 | 3 | 4 | 4 | 4 |
| SUP-V1-PCT | carga_supino (= SUP-F − 14pp, clamp 70–80) | RPE 5 | 72% | 73.5% | 75% | 78% |
| FP-SETS | exposicao_peito, decrescente (= 7 − SUP-V1) — floor press D1 | 5 | 4 | 3 | 3 | 3 |
| FP-RPE | parada_peito | 6 | 8 | 8 | 8 | 8 |
| SUP-V4 | exposicao_peito — nº séries do volume de D4 | 1 | 1 | 2 | 3 | 3 |
| SUP-V4-PCT | carga_supino, constante | RPE 6 | 70% | 70% | 70% | 70% |
| FP4-SETS | exposicao_peito (= 5 − SUP-V4) — floor press D4 | 4 | 4 | 3 | 2 | 2 |
| FP4-RPE | parada_peito | 6 | 8 | 8 | 8 | 8 |
| SUP-G | instrumentação, constante — gauge de supino (D3#3, 7 reps) | RPE 6 | 70% | 70% | 70% | 70% |
| SUP-P | carga_supino — prática de D3 | RPE 4 | 62% | 65% | 65% | 67% |
| PAUSA-P | exposicao_peito, em segundos, recuo S12 — duração da pausa na prática de D3 | 1.0 s | 1.0 s | 1.0 s | 1.0 s | 1.0 s |
| EXP-TETO | instrumentação (teto) — teto semanal de exposição do peitoral | — | 39.00 | 59.05 | 76.31 | 67.69 |

`PAUSA-P` sobe a 2,0 s apenas em S10–S11 (só nas 4 séries de prática de D3, a 65%) e recua a 1,0 s na S12.

### GRADE C — terra e peito alongado (l.597)

| Var | Eixo / governa | S1 | S4 | S8 | S12 | S16 |
|---|---|---|---|---|---|---|
| TOP-TER | carga_terra — top set D5 | RPE 6 | 86% | 88% | 90% | 92% |
| TER-F-REPS | instrumento_calibracao | 3 | 1 | 1 | 1 | 1 |
| BO-TER | carga_terra — back-off D5 (= TOP-TER − 6pp) | RPE 6 | 82% | 82% | 84% | 86% |
| RPE-TER | parada_terra (teto) | 6 | 8 | 8 | 8 | 8 |
| RPE-TER-BO | parada back-off | 6 | 9.5 | 9.5 | 9.5 | 9.5 |
| TER-G | instrumento_gauge, constante — gauge de terra (D2#3, 5 reps) | RPE 6 | 76% | 76% | 76% | 76% |
| RPE-TER-G | leitura_gauge (referência) | 6 | 6.5 | 6.5 | 6.5 | 6.5 |
| TER-P | carga_terra, constante — prática de terra D2 | 65% | 65% | 65% | 65% | 65% |
| PEC-SETS | exposicao_peito — séries de peito alongado (D5, ×2 exercícios) | 1 | 1 | 2 | 2 | 3 |
| PEC-RPE | parada_peito (= 5 + PEC-SETS) | 6 | 6 | 7 | 7 | 8 |

Derivações (```derivacoes```, l.290–297): `BO-AG = TOP-AG − 6pp | clamp 82-88 | round 0.5`; `SUP-F-BO = SUP-F − 6pp`; `BO-TER = TOP-TER − 6pp`; `SUP-V1-PCT = SUP-F − 14pp | clamp 70-80 | round 0.5`; `FP-SETS = 7 − SUP-V1`; `FP4-SETS = 5 − SUP-V4`; `PEC-RPE = 5 + PEC-SETS`.

Fórmula do EXP-TETO: `EXP = Σ_reps (duração_s × %TM/100)` sobre toda rep de barra de supino; `teto(w) = 1,25 × max(EXP(w−2), EXP(w−1))`, semeada em S4 com o próprio EXP(S4). O markdown declara que a invariante nunca morde (folga de 9% a 43%) — é o autor validado contra o autor.

---

# 4. O gate da semana 3/4 (§1, l.325–351)

Bloco literal:

```
calibracao
semana 1 | instrumento gauge_set | reps 7 (terra 5) | rpe 6   | ancora 70 (terra 76)
semana 2 | instrumento backoff   | reps 3           | rpe 7   | ancora 80
semana 3 | instrumento top_set   | reps 1           | rpe 8   | ancora 90
gate     | apos_semana 3 | grava trainingMax = mediana das 3 | alerta_divergencia_pct 7
```

Como funciona, literal do texto (l.331–335):

> **Gate obrigatório entre a S3 e a S4** (`design.md` §11-A2 · SPEC §4.1): extrapolar pelas três âncoras, usar a **mediana** (nunca a maior), gravar em `profile.trainingMax` (não toca no 1RM histórico), gravar `trainingMaxInicialBloco`, e **as cargas das S4–S18 recomputam em runtime**. Divergência > 7% contra 215/160/240 vai para a conversa semanal **antes** de seguir.

O que grava: `profile.trainingMax` e `trainingMaxInicialBloco`. Não toca no 1RM histórico. Limite de divergência: **7%** (`alerta_divergencia_pct 7`) contra as partidas 215/160/240 — não bloqueia, dispara conversa semanal antes de seguir.

Portas de invalidação do gate (l.336–351): "**âncora colhida em rep fora do padrão legal é DESCARTADA** — não entra na mediana, e a semana é repetida para recolher aquela âncora". Rep fora do padrão = a definição operacional de RPE 10 de §0.2 (agacho: perdeu profundidade legal ou tronco passou de ~38°; supino: barra não ficou imóvel na pausa ou costela desceu; terra: deltoide não fechou atrás da linha da barra, ou soltou). No terra vale também invalidação por falha de pegada.

**A regra bidirecional** é a do gauge set, §1.1 (l.352–390) — o instrumento que move o TM durante o bloco:

- `acumulador += (rpe_anterior − rpe_hoje)`.
- Para CIMA: com `acumulador ≥ 1,0`, `K` = 3,0% (agacho, terra) ou 2,0% (supino); `ganho = min(acumulador × K, 5%)`; teto de `tm_inicial × 1,10`; aplicado à **semana seguinte**.
- Para BAIXO, e é **assimétrica**: "Queda de ≥1 ponto na **primeira** leitura **não baixa o TM** — segura a carga uma semana; duas leituras consecutivas baixam por `K`; queda de ≥2 pontos corta a sessão."
- Portas avaliadas ANTES de qualquer ajuste: leitura inválida (ex.: gauge de terra encerrado por falha de pegada) é descartada **nos dois sentidos**; rep fora do padrão legal **proíbe subida**; e no supino, se qualquer coluna do eixo `exposicao_peito` subiu na semana (`SUP-V1`, `SUP-V4`, `PAUSA-P`, `PEC-SETS`, `FP-SETS`, `FP4-SETS`), a leitura é **inválida para subir**.
- Consequência aritmética declarada: com o clamp ×1,10 e o teto de 92%, a faixa de chegada real do bloco é **100–101,2%** do TM inicial, não os "100–105%" do design.

Âncoras usadas pelo gate (```ancoras```, l.310–318, projeção da tabela normativa §0.3): `single_rpe_8 → 92`, `single_rpe_7 → 89`, `triple_rpe_7 → 81`, `triple_rpe_6 → 79`, `serie_7_rpe_6_7 → 70`, `serie_5_rpe_6 → 76`.

---

# 5. Volume semanal

Invariantes declaradas no bloco ```restricoes``` (§0, l.90–135) que fixam volume:

| Invariante | Valor | Janela | Procedência |
|---|---|---|---|
| `series_forca_agacho_semana` | ∈ 4–5 | S4–16 | Pak2021 · design §13-B/R9 · externo |
| `series_forca_supino_semana` | = 5 | S4–16 | Pak2021 · externo |
| `series_forca_terra_semana` | = 4 | S4–16 | Pak2021 · SPEC §2.4 · externo |
| `supino_series_semana` | ≥ 22 | S1–16 | design §13-B/**R3** · interpretação |
| `supino_series_pausadas_semana` | ≤ 17 | S1–16 | SPEC §2.3 · design §4-B |
| `costas_series_diretas_semana` | ≥ 12 | S1–16 | design §13-B/**R4** |
| `biceps_series_diretas_semana` | ∈ 8–15 | S1–16 | Nippard · Pelland2025 · externo |
| `delt_lateral_series_diretas_semana` | ∈ 8–12 | S1–16 | design §10-B · Nippard · externo |
| `delt_lat_post_series_diretas` | ≤ 12 | S1–16 | design §13-B/**R5** · externo |
| `delt_anterior_series_diretas` | = 0 | S1–16 | design §10-B |
| `eretores_series_diretas_semana` | ≥ 4 | S1–16 | design §6 · SPEC §1.5 |
| `isquiotibiais_series_diretas_semana` | = 4 | S1–16 | SPEC §1.5 |
| `high_bar_pct_series_agacho` | ∈ 46–54 | S1–16 | design §13-B/**R7** · R18@00:33 · **PESSOAL** |
| `frequencia_agacho_por_semana` | = 3 | S1–16 | design §10 |
| `frequencia_supino_por_semana` | = 4 | S1–16 | design §10 |
| `frequencia_terra_por_semana` | = 2 | S1–16 | design §10 |

Não há invariante declarada de tríceps. As contagens reais por semana aparecem em prosa na §7 (l.789–792), na lista do que "vai a ZERO" no taper — é o inventário mais explícito de volume acessório do documento: **costas 12 · bíceps 11 · delt lateral 9 · delt posterior 3 · tríceps 9 · peito alongado 6 · eretores 4 · quadríceps 3 · isquiotibiais 4 · floor press 5**.

Séries diretas de barra por semana, somando os templates:
- **Agacho: 16 séries de trabalho** (D1 2 · D3 1 gauge + 8 high bar · D4 1 + {AGBO} 4). O texto confirma "9 das 16 séries de agacho" em D3 → high bar = 50%, dentro de 46–54.
- **Supino (barra de competição): 17 séries pausadas na S16** (D1 {SUP-V1}=4 · D2 1+4 · D3 1+4 · D4 {SUP-V4}=3), no teto de `supino_series_pausadas_semana ≤ 17`; + 5 de floor press = **22**, que é o piso de `supino_series_semana ≥ 22`.
- **Terra: 8 séries** (D2 1 gauge + 3 prática · D5 1 + 3 back-off), das quais **4 de força** (D5).

Nota declarada e não resolvida: **R9 fica PARCIALMENTE IMPLEMENTADA** — a oscilação de semana leve é de 1 série em ~104 (≈1%), não os ~10% pretendidos. E **R15 fica ABERTO**: a invariante `razao_axial_d4_sobre_d5 ≤ 1,30` cobre o par errado; D3 concentra ~49% da tonelagem axial da semana, ~3,1× D4 e ~3,6× D5 (`razaoAxialD3D4` e `razaoAxialMaximaEntreDias` publicados em `VENA_BLOCK1_MEASURES`).

---

# 6. As 43 restrições declaradas (bloco ```restricoes```, l.90–135)

Formato original: `chave | operador valor | janela | procedência | tag`. Bijeção exigida nos dois sentidos contra `INVARIANT_CHECKS` (chave sem checker ou checker sem chave = erro de build).

| # | Chave | Valor | Janela | Tag |
|---|---|---|---|---|
| 1 | `teto_pct_do_tm_corrente` | ≤ 92 | S1–17 | externo |
| 2 | `piso_pct_serie_de_forca` | ≥ 80 | S4–16 | externo |
| 3 | `papel_forca_top_set_pct` | ∈ 85–92 | S4–16 | interpretação |
| 4 | `backoff_pct_minimo` | ≥ 82 | S4–16 | externo |
| 5 | `backoff_pct_maximo` | ≤ 88 | S4–16 | externo |
| 6 | `backoff_offset_pp_do_top` | ≤ 6 | S4–16 | interpretação |
| 7 | `series_forca_agacho_semana` | ∈ 4–5 | S4–16 | externo |
| 8 | `series_forca_supino_semana` | = 5 | S4–16 | externo |
| 9 | `series_forca_terra_semana` | = 4 | S4–16 | externo |
| 10 | `rampa_carga_agacho_pct` | ∈ 5–9 | S4–16 | externo |
| 11 | `rampa_carga_supino_pct` | ∈ 5–9 | S4–16 | externo |
| 12 | `rampa_carga_terra_pct` | ∈ 5–9 | S4–16 | externo |
| 13 | `frequencia_agacho_por_semana` | = 3 | S1–16 | interpretação |
| 14 | `frequencia_supino_por_semana` | = 4 | S1–16 | interpretação |
| 15 | `frequencia_terra_por_semana` | = 2 | S1–16 | interpretação |
| 16 | `supino_series_semana` | ≥ 22 | S1–16 | interpretação |
| 17 | `supino_series_pausadas_semana` | ≤ 17 | S1–16 | interpretação |
| 18 | `pausa_supino_minima_s` | ≥ 1.0 | S1–18 | externo |
| 19 | `costas_series_diretas_semana` | ≥ 12 | S1–16 | interpretação |
| 20 | `costas_series_diretas_semana` | > `biceps_series_diretas_semana` | S1–16 | interpretação |
| 21 | `costas_series_diretas_semana` | > `delt_lateral_series_diretas_semana` | S1–16 | interpretação |
| 22 | `biceps_series_diretas_semana` | ∈ 8–15 | S1–16 | externo |
| 23 | `delt_lateral_series_diretas_semana` | ∈ 8–12 | S1–16 | externo |
| 24 | `delt_lat_post_series_diretas` | ≤ 12 | S1–16 | externo |
| 25 | `delt_anterior_series_diretas` | = 0 | S1–16 | interpretação |
| 26 | `eretores_series_diretas_semana` | ≥ 4 | S1–16 | interpretação |
| 27 | `isquiotibiais_series_diretas_semana` | = 4 | S1–16 | interpretação |
| 28 | `high_bar_pct_series_agacho` | ∈ 46–54 | S1–16 | PESSOAL |
| 29 | `exp_supino_semana` | ≤ coluna `EXP-TETO` | S4–16 | interpretação |
| 30 | `razao_axial_d4_sobre_d5` | ≤ 1.30 | S4–16 | interpretação |
| 31 | `gauge_pos_primeira_serie_do_lift` | = 1 | S1–16 | externo |
| 32 | `um_eixo_supino_violacoes` | = 0 | S1–16 | GERAL |
| 33 | `minutos_por_sessao_bloco` | ∈ 75–100 | S1–16 | entrada |
| 34 | `minutos_por_sessao_taper` | ∈ 30–100 | S17–18 | interpretação |
| 35 | `taper_reducao_volume_carga_pct` | ∈ 30–50 | S17 | externo |
| 36 | `taper_reducao_series_sbd_pct` | ∈ 30–50 | S17 | externo |
| 37 | `taper_intensidade_de_pico_pct` | ≥ 85 | S17 | externo |
| 38 | `acessorio_series_semana_taper` | = 0 | S17–18 | externo |
| 39 | `ultimo_pesado_agacho_dias_out` | ∈ 7–10 | S17–18 | externo |
| 40 | `ultimo_pesado_terra_dias_out` | ∈ 7–10 | S17–18 | GERAL |
| 41 | `ultimo_pesado_terra_dias_out` | ≥ `ultimo_pesado_agacho_dias_out` | S17–18 | GERAL |
| 42 | `ultimo_pesado_supino_dias_out` | ≤ 6 | S17–18 | GERAL |
| 43 | `cessacao_dias_out` | ≤ 7 | S17–18 | externo |

São exatamente 43. Denominador declarado: `taper_reducao_volume_carga_pct` e `taper_reducao_series_sbd_pct` são medidas contra a **MÉDIA das S4–16**, não contra a S16 (a redução de séries fica a 0,13 pp do piso de 30%).

Entradas (```entradas```, l.79–89): `programa_id = vena-block1`, `semanas_total = 18`, `semanas_bloco = 16`, `semanas_calibracao = 3`, `dias_por_semana_bloco = 5`, `sessoes_total = 86`, `incremento_minimo_barra_kg = 1`, `tm_partida_agacho_kg = 215`, `tm_partida_supino_kg = 160`, `tm_partida_terra_kg = 240`, `taper_dias = 10`.

---

# 7. Semana 17 (taper) e 18 (simulado)

### S17 — taper de 10 dias, 4 sessões (§7, l.772–845)
Tudo indexado ao dia do simulado (D0). S17 = janela D−10…D−4; S18 = D−3…D0. Ordem das últimas pesadas entregue: **terra 10 d · agacho 7 d · supino 5 d**. Acessórios a ZERO a partir de D−10 (11 dias de cessação de acessório, não 14; a última exposição é o último dia da S16). Caminhada em D−8, D−6, D−4, D−2, D−1. Manter 2600 kcal / 220 g proteína / sono constante.

| Dia | Rótulo | Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|---|---|
| D1 (D−10) | TERRA PICO + supino volume | Terra Sumo | 4 | 3 | 1 | 88% | 8 | 4 MIN |
| | | Supino Pausado | 3 | 3 | 6 | 72% | 8 | 3 MIN |
| D2 (D−9) | High bar secundário + supino prática com comandos | Agacho High Bar | 3 | 5 | 5 | 72% | 8 | 3 MIN |
| | | Supino Pausado | 2 | 2 | 6 | 67% | 6 | 3 MIN |
| D3 (D−7) | AGACHO PICO | Agacho Low Bar | 4 | 3 | 2 | 87.5% | 8 | 5 MIN |
| | | Supino Pausado | 3 | 3 | 4 | 76% | 8 | 3 MIN |
| | | Terra Sumo | 3 | 2 | 3 | 65% | 6 | 3 MIN |
| D4 (D−5) | SUPINO PICO | Supino Pausado | 3 | 3 | 2 | 87.5% | 8 | 3 MIN |
| | | Agacho Low Bar | 2 | 2 | 3 | 75% | 6 | 3 MIN |
| | | Terra Sumo | 2 | 2 | 2 | 72% | 6 | 4 MIN |

Descansos: D1→0, D2→1, D3→1, D4→1 dia. Papéis (```papeis```): S17D1#1 `pico`, S17D1#2 `volume`, S17D2#1 `volume`, S17D2#2 `pratica`, S17D3#1 `pico`, S17D3#2 `leve`, S17D3#3 `pratica`, S17D4#1 `pico`, S17D4#2 `leve`, S17D4#3 `leve`. Reduções alvo: volume-carga 30–50%, séries SBD 30–50% (ambas contra a média S4–16), intensidade de pico ≥ 85%, acessório = 0, cessação ≤ 7 dias.

### S18 D1 (D−3) — dia fácil + ensaio de comandos
Papel `facil` (faixa 55–75%). Descanso sugerido: 2 dias.

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc |
|---|---|---|---|---|---|---|
| Agacho Low Bar | 2 | 2 | 2 | 62% | 5 | 3 MIN |
| Supino Pausado | 2 | 3 | 2 | 70% | 5 | 3 MIN |
| Terra Sumo | 2 | 2 | 2 | 62% | 5 | 3 MIN |

### S18 D2 (D0) — SIMULADO, 3 tentativas por levantamento
Ordem de competição agacho → supino → terra. Só os três de competição, nada depois. Aquecimento igual ao de treino normal. Papel `tentativa` (isento de faixa de %, porque é medição).

| Levantamento | 1ª | 2ª | 3ª |
|---|---|---|---|
| Agacho Low Bar | 88.4% / RPE 7 / 5 MIN (5 aquec) | 94.2% / RPE 8.5 | 97.7% / RPE 9.5 |
| Supino Pausado | 84.4% / RPE 5.5 (4 aquec) | 89.1% / RPE 7 | 92.2% / RPE 8 |
| Terra Sumo | 87.5% / RPE 6.5 (4 aquec) | 92.7% / RPE 8 | 95.8% / RPE 9.5 |

**Como as tentativas são escolhidas** (§8.1, l.878):
1. Parte-se da **terceira**, derivada do carryover treino→plataforma de Perkins aplicado ao top set da S16: agacho **+10 a +15 kg**, terra **+7,5 a +10 kg**, supino **±0 a 2,5 kg**.
2. Abertura e segunda saem das **médias reais da IPF: 90,9 / 96,3 / 99,6%** da terceira (Travis/Zourdos 2021).
3. Arredondamento para a grade de **2,5 kg** (micro-anilhas 1,25 kg, par). Ratios de fato entregues após arredondar: 90,5 / 96,4 / 100 (agacho) e 91,5 / 96,6 / 100 (supino) — o gerador computa, e é o computado que vale.
4. Aritmética de prova: **barra + presilhas = 25 kg** sempre; tentativa declarada em peso carregável; **progressão mínima entre tentativas = 2,5 kg**; tentativa queimada → a seguinte **repete o mesmo peso** (não existe 4ª).
5. A **3ª tentativa de supino** é governada pelo gate de dor de peitoral (§1.2), decidida com o log das duas semanas anteriores (S17 e S18).

Correções declaradas nesse bloco: só a abertura do **terra** (210,0 kg) é um peso já executado no taper; o agacho abre a 190,0 kg contra máximo de 187,5 kg no taper (2,5 kg mais pesado que qualquer coisa feita nos 10 dias) e o supino abre a 135,0 kg, peso que não aparece em nenhuma sessão do bloco. As aberturas foram mantidas (mexer quebraria as médias IPF). Conflito declarado com R110: os últimos saltos ficam em 3,3–3,7%, abaixo do piso de 4–7,5%.

================================================================================
## BLOCO 4 — 22597 chars
================================================================================

1	---
2	name: watch
3	version: "0.2.0"
4	description: Watch a video (URL or local path). Downloads with yt-dlp, extracts auto-scaled frames with ffmpeg, pulls the transcript from captions (or Whisper API fallback), and hands the result to Claude so it can answer questions about what's in the video.
5	argument-hint: "<video-url-or-path> [question]"
6	allowed-tools: Bash, Read, AskUserQuestion
7	homepage: https://github.com/bradautomates/claude-video
8	repository: https://github.com/bradautomates/claude-video
9	author: bradautomates
10	license: MIT
11	user-invocable: true
12	---
13	
14	# /watch
15	
16	You don't have a video input; this skill gives you one. A Python script gets captions first, optionally downloads the video, extracts frames as JPEGs (scene-aware, or fast keyframes at `efficient` detail), gets a timestamped transcript (native captions first, then Whisper API as fallback), and prints frame paths. You then `Read` each frame path to see the images and combine them with the transcript to answer the user.
17	
18	## Resolve `SKILL_DIR` (do this before any command)
19	
20	Every `python3 ...` command below runs a bundled script under `SKILL_DIR/scripts/`. Set `SKILL_DIR` to the **absolute path of the directory containing THIS SKILL.md you just Read** — your harness told you that path in the Read result. The scripts are always a direct sibling of this file (`SKILL_DIR/scripts/watch.py`), in every install layout:
21	
22	```
23	Read ~/.claude/plugins/cache/claude-video/watch/<ver>/skills/watch/SKILL.md → SKILL_DIR=…/skills/watch
24	Read ~/.codex/skills/watch/SKILL.md                                          → SKILL_DIR=~/.codex/skills/watch
25	Read ~/.agents/skills/watch/SKILL.md                                         → SKILL_DIR=~/.agents/skills/watch
26	```
27	
28	Substitute that literal path for `${SKILL_DIR}` in every command. This works on every harness (Claude Code, Codex, Cursor, Gemini CLI, …) without relying on any harness-specific environment variable. Guard once at the start of a run:
29	
30	```bash
31	SKILL_DIR="<absolute path of the directory containing the SKILL.md you Read>"
32	if [ ! -f "$SKILL_DIR/scripts/watch.py" ]; then
33	  echo "ERROR: scripts/watch.py not found under SKILL_DIR=$SKILL_DIR" >&2
34	  echo "Re-check the directory of the SKILL.md you Read and substitute it as SKILL_DIR." >&2
35	  exit 1
36	fi
37	```
38	
39	## Step 0 — Setup preflight (runs every `/watch` invocation, silent on success)
40	
41	**Python interpreter:** every `python3 ...` command in this skill is for macOS/Linux. On **Windows**, substitute `python` — the `python3` command on Windows is the Microsoft Store stub and will not run the script.
42	
43	On the first `/watch` invocation in a session, use structured preflight so you can detect first-run setup:
44	
45	```bash
46	python3 "${SKILL_DIR}/scripts/setup.py" --json
47	```
48	
49	Branch on two fields:
50	
51	- **`can_proceed: true` and `first_run: false`** → setup is already done (the user may have deliberately skipped a Whisper key — that's allowed). Proceed to Step 1 without comment.
52	- **`first_run: true`** → genuine first-time setup. Do these in order:
53	  1. If `missing_binaries` is non-empty, run the installer first (it auto-installs on macOS / prints commands elsewhere — see below) and confirm the binaries land. **Do not skip this and jump to preferences.**
54	  2. Run the installer once more if needed so it scaffolds `~/.config/watch/.env` (it only writes the template when the file is absent, so let it create the file *before* you write any values into it).
55	  3. Encourage a Whisper API key and ask the watch-preference questions below, then write the selected values into `~/.config/watch/.env` and set `SETUP_COMPLETE=true`.
56	- **`can_proceed: false` and `first_run: false`** → setup was finished before but the environment regressed (e.g. `missing_binaries` after an OS change). Run the installer to remediate, then proceed. Don't re-ask preferences.
57	
58	A missing Whisper key is *encouraged to fix, not required*: on a genuine first run `status` will read `needs_key` even when binaries are present — that's your cue to encourage a key, not a blocker.
59	
60	On follow-up `/watch` calls in the same session, use the silent check:
61	
62	```bash
63	python3 "${SKILL_DIR}/scripts/setup.py" --check
64	```
65	
66	This is a <100ms lookup. Exit 0 means /watch can run — this **includes a user who finished setup without a Whisper key** (keyless is allowed). On exit 0 the script emits **nothing** — proceed to Step 1 without comment. **Do NOT announce "setup is complete" to the user** — they don't need a status message on every turn. The only acceptable user-visible output from Step 0 is when remediation is required.
67	
68	On non-zero exit, follow the table:
69	
70	| Exit | Meaning | Action |
71	|------|---------|--------|
72	| `2` | Missing binaries (`ffmpeg` / `ffprobe` / `yt-dlp`) | Run installer |
73	| `3` | Genuine first run with no Whisper API key | Run installer to scaffold `.env`, then encourage a key (the user may decline — proceed with `--no-whisper`) |
74	| `4` | Both missing | Run installer, then encourage a key |
75	
76	Exit `3` only fires before the user has completed setup. Once `SETUP_COMPLETE=true` is written, a keyless install returns exit 0 and is never nagged again.
77	
78	The installer is idempotent — safe to re-run:
79	
80	```bash
81	python3 "${SKILL_DIR}/scripts/setup.py"
82	```
83	
84	On macOS with Homebrew, it auto-installs `ffmpeg` and `yt-dlp`. On Linux/Windows, it prints the exact install commands for the user to run. It scaffolds `~/.config/watch/.env` with commented placeholders and default watch settings at `0600` perms.
85	
86	**If an API key is still missing after install:** use `AskUserQuestion` to ask the user whether they have a Groq API key (preferred — cheaper, faster) or an OpenAI key. Then write it into `~/.config/watch/.env` — set the matching `GROQ_API_KEY=...` or `OPENAI_API_KEY=...` line. If they don't want to set up Whisper, proceed with `--no-whisper` and tell them videos without native captions will come back frames-only.
87	
88	**First-run watch preference:** after the installer has scaffolded `~/.config/watch/.env`, use `AskUserQuestion` to ask one question:
89	
90	- Default detail (one dial). Present these as `AskUserQuestion` options in this exact order — lightest to heaviest — and keep `(recommended)` on `balanced` even though it is not first (do **not** reorder to put the recommended option first):
91	  - `transcript` — no frames at all, transcript only (skips video download when captions exist).
92	  - `efficient` — fast keyframe pass (cap 50).
93	  - `balanced` (recommended) — scene-aware frames (cap 100, default).
94	  - `token-burner` — scene-aware, uncapped (maximum fidelity; high token cost).
95	
96	Write the answer directly into `~/.config/watch/.env` by setting the bare key on its own line — **no trailing inline comment** (a `# note` after the value can break parsing):
97	
98	```bash
99	WATCH_DETAIL=balanced
100	```
101	
102	Use the user's selected value. If they skip the question, keep the recommended default. Once dependencies, the API-key choice, and this preference are handled, write or update `SETUP_COMPLETE=true` in the same file. Do not ask this preference question again when `SETUP_COMPLETE=true`.
103	
104	**Structured mode (optional):** `python3 "${SKILL_DIR}/scripts/setup.py" --json` emits `{status, can_proceed, first_run, setup_complete, missing_binaries, whisper_backend, has_api_key, config_file, watch_detail, platform}` where `status` is one of `ready | needs_install | needs_key | needs_install_and_key`. `status` describes the *ideal* state (a key is encouraged, so a keyless first run reads `needs_key`); `can_proceed` is the operational gate (binaries present AND a key is set OR setup was already completed). Branch on `can_proceed`/`first_run` to decide whether to run; use `status` to decide what to encourage.
105	
106	Within a single session, you can skip Step 0 on follow-up `/watch` calls — once `--check` returned 0, nothing about the environment changes between turns.
107	
108	## When to use
109	
110	- User pastes a video URL (YouTube, Vimeo, X, TikTok, Twitch clip, most yt-dlp-supported sites) and asks about it.
111	- User points at a local video file (`.mp4`, `.mov`, `.mkv`, `.webm`, etc.) and asks about it.
112	- User types `/watch <url-or-path> [question]`.
113	
114	## Recommended limits
115	
116	- **Best accuracy: videos under 10 minutes.** Frame coverage scales inversely with duration.
117	- **Universal rate cap: 2 fps.** The script never samples faster than 2 fps, even when a budget or `--fps` would imply more.
118	- **The frame ceiling is set by the detail mode** (`WATCH_DETAIL` in `~/.config/watch/.env`, or `--detail`), not a single global cap:
119	  - `transcript` → no frames
120	  - `efficient` → up to **50** (keyframes)
121	  - `balanced` (default) → up to **100** (scene-aware)
122	  - `token-burner` → **uncapped** (scene-aware; a soft warning prints past 250 frames)
123	  - `--max-frames N` overrides whichever cap the mode would otherwise use.
124	- **Full-video frame budget by duration.** Token cost grows with frame count, so the script targets a budget by duration. This budget sets the fps and the uniform-sampling fallback; scene-aware selection can fill up to the detail cap above, whichever is lower:
125	  - ≤30s → ~12-30 frames
126	  - 30s-1min → ~40 frames
127	  - 1-3min → ~60 frames
128	  - 3-10min → ~80 frames
129	  - \>10min → up to the detail cap, sparsely spaced (warning printed)
130	- If the user hands you a long video, consider asking whether they want a specific section before burning tokens on a sparse scan.
131	
132	## How to invoke
133	
134	**Step 1 — parse the user input.** Separate the video source (URL or path) from any question the user asked. Example: `/watch https://youtu.be/abc what language is this in?` → source = `https://youtu.be/abc`, question = `what language is this in?`.
135	
136	**Step 2 — run the watch script.** Pass the source verbatim. Do not shell-escape it yourself beyond normal quoting:
137	
138	```bash
139	python3 "${SKILL_DIR}/scripts/watch.py" "<source>"
140	```
141	
142	Optional flags:
143	- `--detail transcript|efficient|balanced|token-burner` — fidelity/speed dial. `transcript` = no frames (transcript only, skips video download when captions exist); `efficient` = fast keyframes (cap 50); `balanced` = scene-aware frames (cap 100); `token-burner` = scene-aware, uncapped.
144	- `--start T` / `--end T` — focus on a section. Accepts `SS`, `MM:SS`, or `HH:MM:SS`. When either is set, fps auto-scales denser (see "Focusing on a section" below).
145	- `--timestamps T1,T2,…` — grab a frame at each of these absolute timestamps (`SS`, `MM:SS`, or `HH:MM:SS`). Use this after reading the transcript to capture deictic moments the presenter flags ("look here", "as you can see", "notice this") that visual selection alone may miss. See "Transcript-cue frames" below.
146	- `--max-frames N` — override the preset cap for tighter token budget (e.g. `--max-frames 40`)
147	- `--resolution W` — change frame width in px (default 512; bump to 1024 only if the user needs to read on-screen text)
148	- `--fps F` — override auto-fps (clamped to 2 fps max)
149	- `--out-dir DIR` — keep working files somewhere specific (default: an auto-generated tmp dir)
150	- `--whisper groq|openai` — force a specific Whisper backend (default: prefer Groq if both keys exist)
151	- `--no-whisper` — disable the Whisper fallback entirely (frames-only if no captions)
152	- `--no-dedup` — keep near-duplicate frames. By default a frame-delta pass drops frames that are visually near-identical to the previous kept one (held slides, static screen recordings, paused video) so the frame budget goes to distinct content; the report's **Frames** line notes how many were dropped. Pass this only if the user needs every sampled frame (e.g. judging subtle frame-to-frame motion).
153	
154	### Focusing on a section (higher frame rate)
155	
156	When the user asks about a specific moment — "what happens at the 2 minute mark?", "zoom into 0:45 to 1:00", "the first 10 seconds" — pass `--start` and/or `--end`. The script switches to focused-mode budgets, which are denser than full-video budgets (still capped at 2 fps, and still bounded by the detail-mode cap — the counts below assume the default `balanced` cap of 100; `efficient` tops out at 50):
157	
158	- ≤5s → 2 fps (up to 10 frames)
159	- 5-15s → 2 fps (up to 30 frames)
160	- 15-30s → ~2 fps (up to 60 frames)
161	- 30-60s → ~1.3 fps (up to 80 frames)
162	- 60-180s → ~0.6 fps (100 frames, capped)
163	
164	Focused mode is the right call for:
165	- Any moment/range the user names explicitly ("around 2:30", "the intro", "the last 30 seconds").
166	- Any video longer than ~10 minutes where the user's question is about a specific part — running focused on the relevant section is far more useful than a sparse scan of the whole thing.
167	- Re-runs after a full scan didn't have enough detail in some region.
168	
169	Transcript is auto-filtered to the same range. Frame timestamps are absolute (real video timeline, not offset-from-start).
170	
171	Examples:
172	```bash
173	# Last 10 seconds of a 1 minute video
174	python3 "${SKILL_DIR}/scripts/watch.py" video.mp4 --start 50 --end 60
175	
176	# Zoom into 2:15 → 2:45 at 2 fps (60 frames)
177	python3 "${SKILL_DIR}/scripts/watch.py" "$URL" --start 2:15 --end 2:45 --fps 2
178	
179	# From 1h12m to the end of the video
180	python3 "${SKILL_DIR}/scripts/watch.py" "$URL" --start 1:12:00
181	```
182	
183	**Step 3 — Read every frame path the script lists.** The Read tool renders JPEGs directly as images for you. Read all frames in a single message (parallel tool calls) so you see them together. The frames are in chronological order with a `t=MM:SS` timestamp so you can align them to the transcript.
184	
185	**Step 4 — answer the user.** You now have two streams of evidence:
186	- **Frames** — what's on screen at each timestamp
187	- **Transcript** — what's said at each timestamp. The report's header shows the source (`captions` = yt-dlp pulled native subs; `whisper (groq)` or `whisper (openai)` = transcribed by API).
188	
189	If the user asked a specific question, answer it directly citing timestamps. If they didn't ask anything, summarize what happens in the video — structure, key moments, notable visuals, spoken content.
190	
191	This holds for `transcript` detail too: even with no frames, produce a **summary** like the other modes — do not paste the full transcript into chat. Synthesize structure, key moments, and spoken content with timestamps; quote only the lines that matter. Offer the raw transcript only if the user explicitly asks for it.
192	
193	**Step 5 — clean up.** The script prints a working directory at the end. If the user isn't going to ask follow-ups about this video, delete it with `rm -rf <dir>`. If they might, leave it in place.
194	
195	## Detail and frames
196	
197	Default behavior comes from `~/.config/watch/.env`:
198	
199	- `WATCH_DETAIL=transcript|efficient|balanced|token-burner` (default: `balanced`)
200	
201	At `transcript` detail, captions are enough to return a report without downloading video. If captions are missing, the script downloads audio only and tries Whisper. If no transcript can be produced, it reports the limitation clearly; re-run with `--detail balanced` for frames.
202	
203	At `efficient` detail, the script downloads the video and extracts **keyframes only** (`ffmpeg -skip_frame nokey`) — a near-instant pass that lands frames on scene cuts. If a clip has fewer than 4 keyframes it falls back to uniform sampling.
204	
205	At `balanced` / `token-burner` detail, the script extracts **scene-aware** frames: ffmpeg scene-change selection first, falling back to uniform sampling only when the video is effectively static. `balanced` caps at 100 frames; `token-burner` is uncapped. Frame report lines include both timestamp and selection reason. Extracted images are clamped to a maximum 1998px height for Claude Read compatibility.
206	
207	## Transcript-cue frames
208	
209	Visual frame selection (scene/keyframe) can miss the moments a presenter explicitly flags — "look here", "as you can see", "notice this", "watch what happens" — because pointing at a slide is often a *low* visual change. `--timestamps` lets you force a frame at those exact moments. **You** decide which moments matter, by reading the transcript:
210	
211	1. Run once at `--detail transcript` (or any detail) to get the timestamped transcript.
212	2. Scan it for deictic cues — phrases where the speaker directs attention to something on screen. This is a judgment call (ignore rhetorical "look, the point is…"); that's why it's done by you, not a regex.
213	3. Re-run with `--timestamps 4:32,7:10,9:55` (absolute source times). For a URL, point the second run at the **downloaded local file** in the work dir so it doesn't re-download.
214	
215	Behavior:
216	- **Additive by default.** Cue frames (`reason=transcript-cue`) are merged into whatever `--detail` already selected, in chronological order.
217	- **Pinned and counted first.** Cue frames are reserved against the frame cap before the detail engine runs, so they're never evicted by even-sampling.
218	- **Honors focus mode.** With `--start/--end`, any cue timestamp outside the window is dropped (reported in the summary). Coordinates are always absolute source time.
219	- **Cue-only frames.** `--detail transcript --timestamps …` skips scene/keyframe sampling and returns *only* the cue frames (it will download the video to do so, since frames need pixels).
220	
221	## Transcription
222	
223	The script gets a timestamped transcript in one of two ways:
224	
225	1. **Native captions (free, preferred).** yt-dlp pulls manual or auto-generated subtitles from the source platform if available.
226	2. **Whisper API fallback.** If no captions came back (or the source is a local file), the script extracts audio (`ffmpeg -vn -ac 1 -ar 16000 -b:a 64k`, ~0.5 MB/min) and uploads it to whichever Whisper API has a key configured:
227	   - **Groq** — `whisper-large-v3`. Preferred default: cheaper, faster. Get a key at console.groq.com/keys.
228	   - **OpenAI** — `whisper-1`. Fallback. Get a key at platform.openai.com/api-keys.
229	
230	Both keys live in `~/.config/watch/.env`. The script prefers Groq when both are set; override with `--whisper openai` to force OpenAI. Use `--no-whisper` to skip the fallback entirely.
231	
232	## Failure modes and handling
233	
234	- **Setup preflight failed** → run `python3 "${SKILL_DIR}/scripts/setup.py"` (auto-installs ffmpeg/yt-dlp via brew on macOS, scaffolds the `.env`). For API key, ask the user via `AskUserQuestion` and write it to `~/.config/watch/.env`.
235	- **No transcript available** → captions missing AND (no Whisper key OR Whisper API failed). Script prints a hint pointing to setup. Proceed frames-only and tell the user.
236	- **Long video warning printed** → acknowledge it in your answer. Offer to re-run focused on a specific section via `--start`/`--end` rather than a sparse full-video scan.
237	- **Download fails** → yt-dlp's error goes to stderr. If it's a login-required or region-locked video, tell the user plainly; do not keep retrying.
238	- **Whisper request fails** → the error is printed to stderr (likely: invalid key or rate limit). Audio over the API's 25 MB upload cap is split into chunks and transcribed automatically, so length alone won't fail it; if some chunks fail the transcript is partial and the dropped chunks are noted on stderr. The report will say "none available" only if every chunk fails. You can retry with `--whisper openai` if Groq failed (or vice versa).
239	
240	## Token efficiency
241	
242	This skill burns tokens primarily on frames. Order of magnitude:
243	- 80 frames at 512px wide is roughly 50-80k image tokens depending on aspect ratio.
244	- The transcript is cheap (a few thousand tokens at most for a 10-minute video).
245	- Bumping `--resolution` to 1024 roughly quadruples the image tokens per frame. Only do it when necessary.
246	
247	If you already watched a video this session and the user asks a follow-up, do **not** re-run the script — you already have the frames and transcript in context. Just answer from what you have.
248	
249	## Security & Permissions
250	
251	**What this skill does:**
252	- Runs `yt-dlp` locally to download the video and pull native captions when the source supports them (public data; the request goes directly to whatever host the URL points at)
253	- Runs `ffmpeg` / `ffprobe` locally to extract frames as JPEGs and, when Whisper is needed, a mono 16 kHz audio clip
254	- Sends the extracted audio clip to Groq's Whisper API (`api.groq.com/openai/v1/audio/transcriptions`) when `GROQ_API_KEY` is set (preferred — cheaper, faster)
255	- Sends the extracted audio clip to OpenAI's audio transcription API (`api.openai.com/v1/audio/transcriptions`) when `OPENAI_API_KEY` is set and Groq is not, or when `--whisper openai` is forced
256	- Writes the downloaded video, frames, audio, and an intermediate transcript to a working directory under the system temp dir (or `--out-dir` if specified) so Claude can `Read` them
257	- Reads / creates `~/.config/watch/.env` (mode `0600`) to store the Whisper API key(s) and a `SETUP_COMPLETE` marker. As a fallback, also reads `.env` in the current working directory
258	
259	**What this skill does NOT do:**
260	- Does not upload the video itself to any API — only the extracted audio goes out, and only when native captions are missing AND Whisper is not disabled with `--no-whisper`
261	- Does not access any platform account (no login, no session cookies, no posting) — yt-dlp only ever requests public data
262	- Does not share API keys between providers (Groq key only goes to `api.groq.com`, OpenAI key only goes to `api.openai.com`)
263	- Does not log, cache, or write API keys to stdout, stderr, or output files
264	- Does not persist anything outside the working directory and `~/.config/watch/.env` — clean up the working directory when you're done (Step 5)
265	
266	**Bundled scripts:** `scripts/watch.py` (entry point), `scripts/download.py` (yt-dlp wrapper), `scripts/frames.py` (ffmpeg frame extraction), `scripts/transcribe.py` (caption selection + Whisper orchestration), `scripts/whisper.py` (Groq / OpenAI clients), `scripts/setup.py` (preflight + installer)
267	
268	Review scripts before first use to verify behavior.
269	

================================================================================
## BLOCO 5 — 16965 chars
================================================================================

Mapeamento completo da tela de execução de treino.

---

## 1. Rota, página e árvore de componentes

**Rota:** `/workout` (HashRouter → `#/workout`)

- `/Users/brunnovert/Documents/Dev/powerlifting-app/src/main.tsx:24-32` — `HashRouter` > `StorageProvider` > `App`
- `/Users/brunnovert/Documents/Dev/powerlifting-app/src/App.tsx:7` — `const Workout = lazy(() => import('./pages/Workout'))`
- `/Users/brunnovert/Documents/Dev/powerlifting-app/src/App.tsx:39` — `<Route path="/workout" element={<Workout />} />`
- `/Users/brunnovert/Documents/Dev/powerlifting-app/src/App.tsx:32,46` — nesta rota a bottom-nav é escondida (`isWorkoutActive`) e o padding inferior removido

**Árvore, de cima para baixo, como renderizada em `src/pages/Workout.tsx:203-407`:**

| Ordem | Componente | Arquivo | Linha do uso |
|---|---|---|---|
| — | `Workout` (page, default export) | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/pages/Workout.tsx` | 25 |
| 1 | `WorkoutHeader` (sticky + progresso) | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/WorkoutHeader.tsx` | Workout.tsx:205-213 |
| 2 | chips numerados 1..9 (inline, sem componente próprio) | `src/pages/Workout.tsx` | 217-253 |
| 3 | `TrainingMaxGate` | `.../workout/components/TrainingMaxGate.tsx` | Workout.tsx:255 |
| 4 | card/link "PROTOCOLO DE AQUECIMENTO" (inline `<Link to="/warmup">`) | `src/pages/Workout.tsx` | 258-268 |
| 5 | `RestTimer` (condicional) | `.../workout/components/RestTimer.tsx` | Workout.tsx:271-278 |
| 6 | `PRFlashBanner` (condicional) | `.../workout/components/PRFlashBanner.tsx` | Workout.tsx:281 |
| 7 | `ExercisePrescriptionCard` (métricas + parágrafo azul de info) | `.../workout/components/ExercisePrescriptionCard.tsx` | Workout.tsx:286-290 |
| 8 | `CompletedSetsList` | `.../workout/components/CompletedSetsList.tsx` | Workout.tsx:291-295 |
| 9 | `SetInputForm` (título do exercício, stepper, PESO/REPS/RPE) | `.../workout/components/SetInputForm.tsx` | Workout.tsx:296-316 |
| 9a | └ `CompetitionStandardPanel` | `.../workout/components/CompetitionStandardPanel.tsx` | SetInputForm.tsx:322-329 |
| 10 | botões Notas / Pular / + Extra (inline) | `src/pages/Workout.tsx` | 321-341 |
| 11 | `AddExercisePanel` | `.../workout/components/AddExercisePanel.tsx` | Workout.tsx:359-363 |
| 12 | `SetEditSheet` | `.../workout/components/SetEditSheet.tsx` | Workout.tsx:367-379 |
| 13 | `PreWorkoutSurveySheet` / `PostWorkoutSurveySheet` | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/survey/components/` | Workout.tsx:167, 384 |

Hooks que alimentam a tela (`src/features/workout/hooks/`): `useWorkoutSession` (carrega o treino da sessão), `useLoadSuggestion` (inputs + sugestão de carga), `useSetCompletion` (completar/editar série, PR), `useRestWarning`, `useWorkoutSurveys`.

---

## 2. Componente do parágrafo longo de instrução

`/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/ExercisePrescriptionCard.tsx:46-53`

```jsx
{exercise.prescribedNotes && (
  <div className="flex gap-2 items-start bg-accent-blue/5 border border-accent-blue/20 rounded px-2 py-1.5">
    <Info size={13} className="text-accent-blue flex-shrink-0 mt-0.5" />
    <p className="text-xs font-display text-text-secondary leading-relaxed">
      {exercise.prescribedNotes}
    </p>
  </div>
)}
```

O ícone azul é `Info` de `lucide-react` (import na linha 1), cor `text-accent-blue` (#2563EB). Não há truncamento, clamp nem "ver mais" — o texto inteiro é renderizado.

---

## 3. Campo de dado e caminho do tipo

- **Campo renderizado:** `ExerciseLog.prescribedNotes?: string`
  - `/Users/brunnovert/Documents/Dev/powerlifting-app/src/types/index.ts:188` (declarado em `ExercisePrescription`, comentário: "Notas prescritas pelo programa (distintas das notas do usuário)")
  - `ExerciseLog extends ExercisePrescription` — `src/types/index.ts:221-225` (o `notes?` na linha 223 é a nota **do usuário**, campo diferente)
- **Campo de origem:** `PrescribedExercise.notes?: string` — `/Users/brunnovert/Documents/Dev/powerlifting-app/src/types/index.ts:353-360`
- **Ponto de conversão** (`notes` → `prescribedNotes`): `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useWorkoutSession.ts:76`
  ```ts
  ...(ex.notes ? { prescribedNotes: ex.notes } : {}),
  ```
  dentro de `toExerciseLog(ex: PrescribedExercise): ExerciseLog` (linhas 51-100).
- **Dado literal** ("PAPEL PRÁTICA (40–70%)…"): `/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/vena-block1/generated.ts:2198`, dentro do bloco `blockId: "w1d1b0"` / `exerciseId: "agachamento_low_bar_legal"` (linhas 2187-2200), em `days[0].exercises[0]`.
  - Arquivo **gerado** — cabeçalho em `generated.ts:1-10`: origem `src/data/program/vena-block1/source/PROGRAMA.md` (a mesma nota está em `PROGRAMA.md:702`), gerador `scripts/build-vena-block1.mjs`, `npm run build:vena`. Não editar `generated.ts` à mão.
- **Caminho de leitura em runtime:** `useWorkoutSession` → `getSessionData()` (`src/data/programData.ts:13` re-exporta de `/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/scheduling.ts:42`).

---

## 4. Card do exercício (título, stepper, PESO/REPS/RPE)

`/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/SetInputForm.tsx` (373 linhas).

**Título "AGACHAMENTO LOW BAR (PROFUNDIDADE LEGAL)"** — linhas 127-149 (o uppercase é CSS, o dado vem em Title Case):

```jsx
{/* Exercise header */}
<div>
  <div className="flex items-center gap-2 flex-wrap">
    {exercise.supersetGroup && (
      <span className="inline-flex items-center justify-center px-1.5 h-6 rounded bg-accent-purple/20 text-accent-purple text-xs font-mono font-bold flex-shrink-0">
        {exercise.supersetGroup}{exercise.supersetOrder ?? ''}
      </span>
    )}
    <span className="text-lg font-display font-bold text-text-primary uppercase tracking-wider">
      {exercise.exerciseName}
    </span>
    {exercise.optional && (
      <span className="px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px] font-display uppercase tracking-wider">
        Opcional
      </span>
    )}
  </div>
  {currentRecord && (
    <div className="text-xs font-mono text-accent-gold mt-0.5">
      PR: {currentRecord.e1rm.toFixed(1)} e1RM ({currentRecord.weight}x{currentRecord.reps} @{currentRecord.rpe})
    </div>
  )}
</div>
```

**Stepper de séries (barrinhas por série) + linha "Série X de Y"** — linhas 151-191:

```jsx
{/* Set indicators — aquecimento separado das séries de trabalho */}
<div className="flex gap-1.5">
  {exercise.sets.map((s, i) => (
    <div
      key={i}
      className={`flex-1 h-2 rounded-full ${
        s.setType === 'warmup' ? 'opacity-50' : ''
      } ${
        s.completed ? (s.isPR ? 'bg-accent-gold' : 'bg-accent-green')
        : i === activeSetIdx ? 'bg-text-secondary' : 'bg-bg-tertiary'
      }`}
    />
  ))}
</div>

<div className="flex items-center justify-center gap-2 flex-wrap">
  <span className={`px-2 py-0.5 rounded text-[10px] font-display font-semibold uppercase tracking-wider ${setTypeBadgeClass[setType]}`}>
    {setTypeLabels[setType]}
  </span>
  <span className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
    {isWarmup ? `Aquecimento ${warmupIdx} de ${exercise.warmupSets ?? 0}` : `Série ${workingIdx} de ${workingSets.length}`}
  </span>
</div>
```

**Stepper numérico −/input/+** (componente local `Stepper`, mesmo arquivo, linhas 34-75):

```jsx
<div className="flex items-center gap-2">
  <button type="button" onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
    className={`w-12 ${height} bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border`}>−</button>
  <input type="number" inputMode="decimal" value={value || ''}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    className={`flex-1 ${height} bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold ${text} text-text-primary focus:border-accent-gold focus:outline-none`}
    onFocus={(e) => e.target.select()} />
  <button type="button" onClick={() => onChange(Math.round((value + step) * 100) / 100)}
    className={`w-12 ${height} bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border`}>+</button>
</div>
```

**PESO** — linhas 197-216 (`<Stepper value={inputWeight} step={increment} …>`, incremento por equipamento, `SetInputForm.tsx:109`).
**REPS** — linhas 283-291 (`<Stepper value={inputReps} step={1} …>`, label "Reps (Alvo: …)").
**RPE** — linhas 293-320 (grade de botões de `RPE_VALUES = [6 … 10]`, linha 10; cor por `getRPEColor`, texto RIR por `getRIRText`, de `/Users/brunnovert/Documents/Dev/powerlifting-app/src/domain/rpe.ts`).
Botão final "Completar série N" — linhas 348-360. Wrapper do card com `pr-glow` — linhas 124-126.

---

## 5. Header sticky + barra de progresso

`/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/WorkoutHeader.tsx:27-54`

```jsx
{/* Top Bar */}
<div className="sticky top-0 z-40 bg-bg-secondary border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
  <div className="max-w-lg mx-auto px-4 py-2">
    <div className="flex justify-between items-center">
      <button onClick={onBack} className="text-text-muted font-display text-sm">
        <ArrowLeft size={16} className="inline mr-1" />Voltar
      </button>
      <div className="text-xs font-mono text-text-muted">
        Sessão {sessionIndex + 1}/{getTotalSessions(workout.programId)} · {completedSets}/{totalSets} séries
      </div>
      {workout.completed && (
        <span className="text-xs font-display font-semibold text-accent-green uppercase tracking-wider">
          Concluído
        </span>
      )}
    </div>
    {/* Progress bar */}
    <div className="h-1 bg-bg-tertiary rounded-full mt-2">
      <div className="h-1 bg-accent-gold rounded-full transition-all duration-300"
        style={{ width: `${progressPercent}%` }} />
    </div>
  </div>
</div>
```

Abaixo dele (não-sticky), linhas 56-85: "S1 — <bloco>", label do dia (`dayTypeLabels`, `/Users/brunnovert/Documents/Dev/powerlifting-app/src/domain/dayTypeLabels.ts`) e badges MINI/ARM DAY/DELOAD.

Cálculo dos números: `src/pages/Workout.tsx:173-192` — `totalSets`/`completedSets` ignoram `setType === 'warmup'` e exercícios `skipped`; `progressPercent = completedSets/totalSets*100`; `sessionIndex = storage.getSessionIndex()`. O "86" vem de `getTotalSessions()` (`/Users/brunnovert/Documents/Dev/powerlifting-app/src/services/scheduling.ts:34`), que conta as sessões do programa ativo (`vena-block1`: 18 semanas / 86 sessões, `generated.ts:8`).

---

## 6. Card de métricas AQUEC./SÉRIES/REPS/RPE/DESCANSO

Mesmo componente do item 2: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/ExercisePrescriptionCard.tsx:21-44`

Montagem dos chips (21-31):
```ts
if (exercise.warmupSets) chips.push({ label: 'Aquec.', value: `${exercise.warmupSets}` });
chips.push({ label: 'Séries', value: `${exercise.prescribedSets}${exercise.perSide ? ' /lado' : ''}` });
chips.push({ label: 'Reps', value: exercise.prescribedReps });
if (exercise.percent1RM) chips.push({ label: '%1RM', value: exercise.percent1RM });
chips.push({ label: 'RPE', value: exercise.prescribedRPE });
if (exercise.restLabel) chips.push({ label: 'Descanso', value: exercise.restLabel });
```

JSX (33-44), grid de 3 colunas:
```jsx
<div className="bg-bg-card border border-border rounded-lg p-3 space-y-2">
  <div className="grid grid-cols-3 gap-1.5">
    {chips.map((chip) => (
      <div key={chip.label} className="bg-bg-tertiary rounded px-2 py-1.5 text-center">
        <div className="text-[9px] font-display uppercase tracking-wider text-text-muted">
          {chip.label}
        </div>
        <div className="text-sm font-mono font-bold text-text-primary">{chip.value}</div>
      </div>
    ))}
  </div>
```
Linhas 55-79 do mesmo arquivo: seletor de "Variação:" (chips de alternativas), só aparece se `alternatives` não vazio.

**Chips numerados 1..9** (os do topo, um por exercício) ficam inline em `src/pages/Workout.tsx:217-253` — ativo `bg-accent-gold text-black`, concluído `bg-accent-green/20`, pulado `line-through`, prefixo roxo de superset em `font-mono` quando `ex.supersetGroup`.

**Card "PROTOCOLO DE AQUECIMENTO"** — `src/pages/Workout.tsx:258-268`, `<Link to="/warmup">` com ícone `Flame`, só renderiza se `!workout.completed && completedSets === 0`. Destino: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/pages/Warmup.tsx` (191 linhas), que consome `/Users/brunnovert/Documents/Dev/powerlifting-app/src/data/program/powerbuilding2/warmup.ts`.

---

## 7. Tokens de design

**Não existe `tailwind.config.js`/`.ts` neste repo.** É Tailwind v4 via plugin do Vite (`@tailwindcss/vite`, `/Users/brunnovert/Documents/Dev/powerlifting-app/vite.config.ts:3,9`), com o tema declarado em CSS.

Fonte única de tokens: `/Users/brunnovert/Documents/Dev/powerlifting-app/src/index.css:1-27`

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Barlow+Condensed:wght@400;500;600;700&display=swap');

@theme {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  --color-bg-tertiary: #1a1a1a;
  --color-bg-card: #161616;
  --color-bg-input: #1e1e1e;
  --color-border: #2a2a2a;
  --color-border-light: #333333;
  --color-text-primary: #e5e5e5;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #6b6b6b;
  --color-accent-gold: #D4A017;
  --color-accent-gold-bright: #E8B930;
  --color-accent-red: #DC2626;
  --color-accent-red-dim: #991B1B;
  --color-accent-green: #16A34A;
  --color-accent-green-dim: #15803D;
  --color-accent-blue: #2563EB;
  --color-accent-purple: #A855F7;
  --color-accent-purple-dim: #7C3AED;
  --color-pr-glow: #D4A017;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-display: 'Barlow Condensed', sans-serif;
}
```

Utilitários/classes de tema no mesmo arquivo:
- `index.css:29-37` — `html` usa `font-display` e `bg-primary`, `color-scheme: dark`
- `index.css:46-49` — `input/select/textarea { font-size: max(16px, 1em) }` (anti auto-zoom iOS)
- `index.css:85-91` — `.font-mono` / `.font-display` explícitos
- `index.css:93-101` — `.pr-glow` + `@keyframes pr-pulse` (usado em `SetInputForm.tsx:125`)
- `index.css:103-110` — `.animate-fade-in`
- `index.css:112-119` — `.animate-slide-up`
- `index.css:121-127` — `.scrollbar-none` (usado na faixa de chips, `Workout.tsx:217`)
- `index.css:61-66` — `@media (display-mode: standalone)` com `env(safe-area-inset-top)`

Cor do tema PWA (`#0a0a0a`) duplicada em `vite.config.ts:19-20`.

---

## 8. Todos os arquivos em `src/features/workout/**` (2140 linhas no total)

| Linhas | Arquivo |
|---:|---|
| 373 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/SetInputForm.tsx` |
| 292 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useSetCompletion.ts` |
| 280 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useWorkoutSession.ts` |
| 262 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/CompetitionStandardPanel.tsx` |
| 208 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useLoadSuggestion.ts` |
| 201 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/SetEditSheet.tsx` |
| 88 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useWorkoutSurveys.ts` |
| 88 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/WorkoutHeader.tsx` |
| 82 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/ExercisePrescriptionCard.tsx` |
| 65 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/RestTimer.tsx` |
| 60 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/CompletedSetsList.tsx` |
| 49 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/TrainingMaxGate.tsx` |
| 41 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useRestWarning.ts` |
| 32 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/AddExercisePanel.tsx` |
| 19 | `/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/components/PRFlashBanner.tsx` |

Arquivos fora dessa pasta que a tela também usa: `src/pages/Workout.tsx` (409), `src/pages/Warmup.tsx` (191), `src/domain/setPlan.ts`, `src/domain/rpe.ts`, `src/domain/setTypeLabels.ts`, `src/domain/dayTypeLabels.ts`, `src/domain/exerciseRegistry.ts`, `src/domain/competitionStandard.ts`, `src/domain/trainingMaxGuard.ts`, `src/services/scheduling.ts`, `src/utils/calculations.ts`.

Nada foi modificado.

================================================================================
## BLOCO 6 — 14231 chars
================================================================================

Li o arquivo inteiro (162 linhas). Caminho: `/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/prog/baseline.md`

Aviso importante de forma: **o documento não contém aritmética passo a passo em lugar nenhum.** Ele lista fatores em faixas percentuais e depois salta direto para "Líquido: ≈ X kg". A conta que amarra os dois é reconstrução minha, e marco isso onde ocorre.

---

## 1. Cadeia de derivação, levantamento a levantamento

### AGACHO — 250 → 215 (linhas 15–33)

Marca declarada e condição (linhas 19–20):
> | Declarado | 250 kg |
> | Condição medida | Pin squat, pinos 5–8 cm acima da posição de competição; falha a profundidade IPF por 4–8 cm (3 reps analisadas em vídeo) |

Fatores (linhas 22–28) — literalmente dois, em direções opostas:
> Dois ajustes em direções opostas:
>
> - **−12 a −18%** por descer os 4–8 cm que faltam. É a faixa mais cara da amplitude:
>   o ponto de aderência do agachamento fica logo acima do paralelo, e ele está
>   parando antes de chegar nele.
> - **+5 a +8%** de crédito porque parada morta no pino é mais difícil que agachamento
>   livre na mesma profundidade — não há reflexo de estiramento nem reversão elástica.

Resultado (linha 30):
> Líquido: **≈ 215 kg legal** (faixa plausível 210–235).

Aritmética (reconstruída por mim, **não está no doc**): a única combinação que produz 215 é a pior ponta do desconto com a pior ponta do crédito, multiplicativamente: 250 × 0,82 × 1,05 = 215,25. A ponta otimista da mesma fórmula dá 250 × 0,88 × 1,08 = 237,6. Ou seja, **215 é o extremo pessimista da própria faixa do documento, não o ponto central** (o centro seria ~226). Se as faixas fossem lidas aditivamente (−18+8=−10%; −12+5=−7%) o intervalo seria 225–232,5 e 215 ficaria fora dele.

### SUPINO — 170 → 160 (linhas 35–53)

Declarado e condição (linhas 39–40):
> | Declarado | 173 estimado / **170 real** |
> | Condição medida | 0,20 s no fundo — reversão de barra, não pausa. Sem comando. |

Fator 1, o único quantificado (linhas 42–46):
> - **−5 a −7%** pela pausa de competição real. Base empírica: R83 [PESSOAL], PR de
>   meet 190 kg contra PR de academia 200 kg = **−5%**. Contrapeso recente: R4 credita
>   **+30 lb** a replicar o banco de competição (tapete antiderrapante) — ou seja,
>   parte do "imposto da pausa" é na verdade imposto de *setup*, e é recuperável.
>   ⚠️ n=1, três datapoints. É a estimativa mais frágil das três.

Fator 2, explicitamente **não** quantificado (linhas 47–51):
> - **Crédito não quantificado:** ele segura **~11 s em lockout** antes de descer, nos
>   dois vídeos. Gasto isométrico puro de deltoide e tríceps antes de a repetição
>   começar. ⚠️ **Zero claims no corpus sobre tempo no topo ou custo isométrico** — o
>   único análogo é "walkout com mais de 3 passos desperdiça energia" (R14). Isto é
>   **hipótese original da análise de vídeo, não achado da base.** Tratar como tal.

Resultado (linha 53):
> Líquido: **≈ 160 kg pausado** (faixa 152–164).

Aritmética (minha): 170 × 0,95 = 161,5 e 170 × 0,93 = 158,1 → 160 é o meio (−5,9%). Mas **a faixa declarada 152–164 é mais larga do que os fatores declarados permitem** (eles dariam 158,1–161,5); o alargamento não é justificado no texto. O crédito de lockout (fator 2) não entra em nenhuma conta.

### TERRA — 268 → 240 (linhas 55–106)

Etapa A, reconciliação do máximo (linhas 57–74) — não é desconto, é validação do ponto de partida:
> - Declarado: máximo 260–270 kg sumo.
> - Datapoint novo: **220 kg × 5 "tranquilo"**, estimativa dele de "**umas 10 até a morte**".
>
> Se 220 fosse um 10RM verdadeiro, o 1RM sairia em **293–301 kg** — irreconciliável
> com 260–270.
> [...]
> Reconciliando pelo fato medido: 220 / 268 = **82% do máximo declarado**, e 82% por
> 5 reps corresponde a **RPE ~8** [...] **O conflito se dissolve: os 220×5 confirmam o
> máximo declarado de ~265–270, e a estimativa de 10 reps é o outlier.**

Etapa B, o único fator de desconto (linhas 97–98):
> Aplicando o gap de Vena, atenuado porque whip escala com a carga e ele puxa 347 kg
> contra os 268 do atleta: **−8 a −12%**.

Resultado (linhas 100–101):
> Líquido: **≈ 240 kg legal** (faixa 235–250), sem strap, parada morta, barra rígida,
> anilha calibrada.

Aritmética (minha): 268 × 0,88 = 235,8; 268 × 0,92 = 246,6; 240 = −10,4%, aproximadamente o centro. Consistente.

---

## 2. 1RM legal estimado ou trainingMax?

**No baseline.md a palavra `trainingMax` não aparece uma única vez.** Os rótulos usados são:

Linha 115 (tabela §4):
> | **Legal estimado** | 215 | 160 | 240 | **615** | **405** | **83,1** |

Linha 30 / 53 / 100: "≈ 215 kg legal", "≈ 160 kg pausado", "≈ 240 kg legal".

Linhas 149–153 (tabela §6), sob o cabeçalho "Valores de partida para as semanas de calibração":
> | Levantamento | Referência de trabalho | Observação |
> | Agachamento low bar (profundidade legal) | **215 kg** | descobrir por RPE nas semanas 1–3 |

Linha 160–162:
> **Nenhum desses números deve ser testado em máximo durante a calibração.** Eles são
> encontrados por extrapolação de séries com teto de RPE [...]

Leitura literal: são apresentados como **1RM legal estimado** ("Legal estimado", e comparados diretamente contra os declarados 250/170/268 para calcular DOTS 405 e GL 83,1 — o que só faz sentido para 1RM, já que DOTS/GL são calculados sobre total de competição). O rótulo "Referência de trabalho" em §6 é ambíguo, mas nunca diz trainingMax.

**Conflito com o design.md** (mesmo diretório): lá os mesmos números são consumidos *como se fossem* trainingMax, sem nenhuma conversão de 92–94%:
- `design.md:632` — "semana 4 com `trainingMax` 215 → top set a 90% = 193,5"
- `design.md:396` — "Se o valor descoberto divergir de 215/160/240 em mais de 7%, isso é assunto da conversa semanal"
- `design.md:421` — "O bloco **começa em ~95% do `trainingMax`**"

Ou seja: baseline.md declara 1RM legal; design.md usa o mesmo número como trainingMax. **A conversão 1RM→TM nunca é feita em nenhum dos dois.** Nenhum texto do baseline.md declara "isto é o trainingMax".

---

## 3. TERRA — evidência usada

**Sim, o 220×5 aparece** (linha 60):
> - Datapoint novo: **220 kg × 5 "tranquilo"**, estimativa dele de "**umas 10 até a morte**".

E é o eixo do argumento (linhas 65–74):
> - `220 × 5` é um **fato medido**.
> - `~10 até a morte` é um **palpite não executado**. Levantador que nunca treina
>   faixa alta de reps superestima sistematicamente reps até a falha, e o terra é o
>   levantamento onde a relação carga×reps mais degrada (pegada, respiração, perda
>   de posição rep a rep).
>
> Reconciliando pelo fato medido: 220 / 268 = **82% do máximo declarado**, e 82% por
> 5 reps corresponde a **RPE ~8** — compatível com "tranquilo" se "tranquilo"
> significa sólido e não um grinder.

**Sim, o gap de ~100 lb do Vena (R174) está lá, literal** (linhas 76–81):
> Restam os descontos de padrão — e aqui o corpus tem **evidência direta e forte**,
> melhor do que qualquer estimativa a priori minha:
>
> > [PESSOAL, R174 01:41] Melhor terra de Vena **em competição: 672 lb**. Na academia:
> > **700 lb × 5**, **765 lb × 1**, e tirou **805 lb do chão**. Ele mesmo chama de
> > *"um gap de 100 lb"*. → 672/765 = **−12,2%** contra um single de academia.

Mecanismos nomeados (linhas 83–95), com citações do corpus:
> Os componentes, nomeados no corpus (R174 [02:15], R98 [02:38], R175 [15:21]):
> - **Straps** — *"a barra fica praticamente pendurada fora da mão, cortando ainda
>   mais amplitude"*. Na IPF não existem.
> - **Anilha grossa de academia** — peso mais para fora → mais whip, e *"as anilhas
>   mais externas continuam tocando o chão enquanto você tira o whip da barra"*: não
>   se levanta todo o peso de uma vez.
> - **Barra com whip** — *"o bar whip vira fator por volta de um terra de 400 lb"*
>   (181 kg; ele está bem acima disso). Barra IPF é stiff e quase não whipa nem com
>   700 lb.
> - **Touch-and-go** na série de 5 → em competição cada rep parte do chão morto.
>
> Somados, R174: *"é quase como fazer um **block pull de algumas polegadas** em vez
> de puxar do chão."*

**Menção a 260: sim, três vezes**, sempre como faixa 260–270, nunca um levantamento isolado de 260 kg:
- linha 58: "Declarado: máximo 260–270 kg sumo."
- linha 63: "irreconciliável com 260–270"
- linha 74: "os 220×5 confirmam o máximo declarado de ~265–270"

Não há nenhuma menção a "um levantamento de 260" como execução específica/datada. O valor usado na conta (268) aparece nas linhas 71 ("220 / 268 = 82%"), 98 ("os 268 do atleta") e 114 (tabela).

Advertência acoplada (linhas 103–106):
> > ⚠️ Advertência do corpus, marcada como a mais importante deste caso:
> > **validar o sumo no padrão de competição ANTES de comparar estilos.** Comparar um
> > sumo inflado por equipamento contra um convencional novo enviesa o teste na
> > direção errada.

---

## 4. SUPINO — justificativa do 170 → 160 e evidência de vídeo

Justificativa completa já colada acima (linhas 42–51). Os dois pilares literais:

Empírico, único citado: `R83 [PESSOAL], PR de meet 190 kg contra PR de academia 200 kg = **−5%**`, com contrapeso `R4 credita **+30 lb** a replicar o banco de competição (tapete antiderrapante)`.

**Evidência de execução em vídeo** — o documento não usa o rótulo "VÍDEO-BP" em lugar nenhum; grep no arquivo não retorna essa string. O que existe são duas observações de vídeo:
- Linha 40: `Condição medida | 0,20 s no fundo — reversão de barra, não pausa. Sem comando.`
- Linhas 47–48: `ele segura **~11 s em lockout** antes de descer, nos dois vídeos.`

E a linha 51 desqualifica explicitamente a segunda como base: *"Isto é **hipótese original da análise de vídeo, não achado da base.** Tratar como tal."* Os 0,20 s → 1 s reaparecem em `design.md:355` como fundamento da rampa de pausa ("o tempo sob alongamento máximo subindo **5×** (0,20 s medidos → 1 s)").

---

## 5. AGACHO — como o custo dos 4–8 cm é quantificado

Trecho literal (linhas 24–28), já colado em §1. A quantificação é esta e só esta:
> - **−12 a −18%** por descer os 4–8 cm que faltam. É a faixa mais cara da amplitude:
>   o ponto de aderência do agachamento fica logo acima do paralelo, e ele está
>   parando antes de chegar nele.

**Não há fonte, citação de corpus, referência R\* nem estudo para os −12 a −18%.** É o único dos três levantamentos cujo fator principal não traz âncora citada: o supino tem R83/R4, o terra tem R174/R98/R175, o agacho tem apenas o raciocínio mecânico acima ("ponto de aderência fica logo acima do paralelo"). O mesmo vale para o crédito de +5 a +8% pela parada morta no pino — sem citação.

O que é medido (e o documento é claro em separar isso) é a **geometria**, não o preço em kg. Linhas 122–123:
> 2. **Agachamento** — ancorado em medição de vídeo (altura de pino aferida contra
>    altura esperada de profundidade legal para 178 cm).

Ou seja: a lacuna de 4–8 cm é medida; a conversão dessa lacuna em −12 a −18% é **estimativa a priori do autor**, sem fonte. Contrasta com a linha 77, onde o próprio documento reconhece a diferença de status epistêmico ao falar do terra: *"melhor do que qualquer estimativa a priori minha"*.

---

## 6. Incerteza, faixas de erro e plano de recalibração

Sim, em vários pontos. Os literais:

Método, linhas 8–11:
> Cada levantamento tem um "imposto de legalidade": o quanto a marca cai quando a
> execução passa a obedecer a regra. O imposto é estimado aqui e **confirmado nas
> semanas de calibração** — nenhuma carga do bloco depende de o imposto estar certo,
> porque as primeiras semanas descobrem a carga por RPE em vez de prescrevê-la por %.

Faixas por levantamento: linha 30 `(faixa plausível 210–235)`, linha 53 `(faixa 152–164)`, linha 100 `(faixa 235–250)`.

Ranking de confiança, linhas 119–125:
> Confiança por levantamento, do mais firme ao mais frágil:
> 1. **Terra** — ancorado em gap medido de 100 lb no próprio Vena, com mecanismo
>    nomeado item a item. É a estimativa mais bem sustentada.
> 2. **Agachamento** — ancorado em medição de vídeo (altura de pino aferida contra
>    altura esperada de profundidade legal para 178 cm).
> 3. **Supino** — n=1, três datapoints, e com contrapeso recente empurrando para cima.
>    É a estimativa que mais deve se mover na calibração.

Plano de recalibração, linhas 146–147 e 160–162:
> Valores de partida para as semanas de calibração (a serem substituídos pelos
> valores descobertos por RPE):
> [...]
> **Nenhum desses números deve ser testado em máximo durante a calibração.** Eles são
> encontrados por extrapolação de séries com teto de RPE, exatamente para não gastar
> as primeiras semanas do bloco em tentativas máximas.

Histórico de revisão dos próprios números, linhas 155–158:
> > Estes são os números canônicos, e são os que `design.md` §11 e o programa usam.
> > (Versões anteriores desta tabela traziam 156 e 252, de antes da revisão do supino
> > com os datapoints de R83/R4 e da revisão do terra com o gap medido de 100 lb em
> > R174. Corrigido.)

O gate numérico de recalibração está **fora** do baseline.md, em `design.md:388–396`:
> as cargas das semanas 4–16 estavam fixadas em kg derivados de 215/160/240, sem regra de recálculo. Se a calibração achasse o piso das faixas de `baseline.md`, essas cargas virariam **94–95%** — acima do teto de 92% [...]
> 2. **Gravar em `trainingMax`** (o campo novo do app). Não toca no 1RM histórico.
> 4. Se o valor descoberto divergir de 215/160/240 em mais de 7%, isso é assunto da conversa semanal antes de seguir.

---

## Três inconsistências que encontrei ao reconstruir a aritmética

1. **Agacho:** 215 só sai combinando −18% com +5%; é o extremo pessimista, enquanto o texto apresenta as faixas como se o líquido fosse o centro. Centro seria ~226. Nenhuma linha explica a escolha da ponta.
2. **Supino:** faixa declarada 152–164 é mais larga que os fatores declarados (−5 a −7% ⇒ 158–161,5) permitem. O alargamento não é derivado de nada no texto.
3. **1RM vs trainingMax:** baseline.md rotula "Legal estimado" e calcula DOTS/GL com esses valores (comportamento de 1RM); design.md os consome como `trainingMax` sem aplicar os 92–94%. Se a intenção era trainingMax, o DOTS 405 / GL 83,1 da linha 115 está subestimado; se era 1RM, as cargas de design.md estão ~7% altas.

================================================================================
## BLOCO 7 — 12897 chars
================================================================================

total=196
duracao total = 15.0h  media=4.6min
  1 |   9:19 |    3100 | How I Got Over 3 YEARS OF INJURIES ✅
  2 |  10:26 |    3700 | The PROBLEM With Science Based Lifting ❌
  3 |   9:44 |    4500 | Why My Workouts Take Over 3 HOURS (And Yours Shouldn’t ❌)
  4 |  11:58 |    7400 | The PROGRAM That Got Me A 400KG SQUAT ✅
  5 |   8:25 |    4200 | How Fast Can A 400KG Squatter Run A Mile⁉️
  6 |   5:52 |   28000 | How I Made More Progress In 1 Year Than The Previous 6 ✅
  7 |   5:45 |   13000 | 400 Kilograms
  8 |   6:30 |    1800 | How EMOTIONS Are Making You A WORSE LIFTER ✅
  9 |   5:48 |   10000 | Why I NEVER Do More Than 2 REPS ✅
 10 |   3:18 |    5000 | The SIMPLE WAY to tell how many SETS to do ✅
 11 |   6:47 |    5900 | How I Got SO GOOD at DEADLIFTS ✅
 12 |   2:04 |    1900 | Training Update: WORLD CHAMPIONSHIPS ⁉️
 13 |   5:09 |    2500 | Do Not Neglect HEALTH with POWERLIFTING ✅
 14 |   6:09 |    4200 | How I Make 800LBS+ Feel LIGHT On My Back ✅
 15 |   7:07 |    4900 | How I MAXIMIZED RECOVERY to SBD 6x PER WEEK ✅
 16 |   5:55 |   12000 | How I Got SO GOOD at SQUATS ✅
 17 |   6:55 |    6300 | The PROGRAM that FIXED MY INJURIES ✅
 18 |   5:04 |    3400 | Why I LOVE the HIGH BAR SQUAT ✅
 19 |  11:04 |    4300 | How I Added 300LBS To My Total After A 3 Year Plateau ✅
 20 |   9:34 |    6900 | My NEW POWERLIFTING PROGRAM ✅ (v3?)
 21 |   9:08 |    5500 | 951KG/2,096LBS TOTAL | NATIONALS RECAP
 22 |   3:44 |    2200 | 1 WEEK OUT FROM NATIONALS ‼️
 23 |   3:44 |    3500 | New DEADLIFT & BENCH PR ⁉️
 24 |   4:12 |    4300 | TRYING TO OUTSQUAT THE WORLD RECORD ✅
 25 |   4:08 |    3300 | Working up to a SQUAT PR ✅
 26 |   5:16 |    2300 | LIGHTWEIGHT BABY 🥜
 27 |   7:46 |    2500 | How I Deadlifted 760LBS Two Days After My Back Injury ✅
 28 |   5:22 |    7600 | What SQUATS did to my BACK 😢
 29 |   9:41 |    6100 | My Program: Detailed Breakdown ✅
 30 |   6:45 |    4700 | Are Hamstrings USELESS For POWERLIFTING⁉️
 31 |   3:51 |    1600 | Some LIFTING CUES are actually USELESS⁉️
 32 |   1:56 |    2700 | My Powerlifting GOALS ✅
 33 |   4:46 |    4700 | How to Build MOMENTUM in your TRAINING ✅
 34 |   5:51 |    4000 | Full Day of Eating: Losing 5LBS/WEEK & NOT LOSING STRENGTH
 35 |   3:30 |    4500 | Is Going Heavy WORSE For STRENGTH ⁉️
 36 |   4:39 |    5700 | Getting STRONGER with 10 REPS IN RESERVE ⁉️
 37 |   3:55 |    4600 | What 5 HOURS OF CARDIO did to my GAINS ✅
 38 |   3:43 |    3000 | How SHORTER RESTS helped my GAINS ✅
 39 |   5:07 |    6300 | IS BULKING VAULTED⁉️
 40 |   3:58 |    4300 | How often to MAX OUT for POWERLIFTING ✅
 41 |   4:37 |    6300 | Why I Eat OVER 300GRAMS of PROTEIN PER DAY ✅
 42 |   2:00 |    3800 | How I FIXED my GRIP ISSUES ✅
 43 |   4:27 |    5200 | FULL DAY OF EATING | 120KG POWERLIFTER
 44 |   4:21 |    8700 | What POWERLIFTING did to my HEALTH
 45 |   3:01 |    5000 | What losing 15LBS in 15 DAYS did to my strength ✅
 46 |   3:52 |    3700 | The most OVERRATED factors for POWERLIFTING 🤡
 47 |   3:38 |    6100 | PRO POWERLIFTER rates CHAT GPT PROGRAM
 48 |   2:56 |    4800 | Why I'm Doing 5 HOURS OF CARDIO (NEW PROGRAM)
 49 |   3:19 |   15000 | Why I NEVER do reps over 80% ❌
 50 |   3:31 |    7500 | My 800LBS SQUAT PROGRAM (REVIEW) ✅
 51 |   3:55 |    8100 | NORTH AMERICAN CHAMPION | POWERLIFTING MEET RECAP
 52 |   2:33 |    2900 | What To Do BEFORE You Max Out
 53 |   3:04 |   12000 | How I Make Powerlifting Programs ✅
 54 |   3:07 |    3000 | My Next Competition ✅
 55 |   3:04 |    5200 | POWERLIFTER vs COMMERCIAL GYM 😳
 56 |   2:47 |    8200 | My First 2,000LBS Total
 57 |   3:18 |    5600 | What gaining 100LBS did to my STRENGTH ✅
 58 |   2:53 |    5400 | Why I SQUATTED more than my DEADLIFT
 59 |   2:41 |    6200 | My 3 TIPS for a BIG DEADLIFT ✅
 60 |   2:35 |    4500 | How STRONG can you REALISTICALLY GET ⁉️
 61 |   2:51 |    8600 | How I Progressively Overloaded From NOOB to ELITE ✅
 62 |   3:23 |    6200 | POWERLIFTING PROGRAMMING | CARDIO
 63 |   2:50 |    3000 | PLATEAUS for POWERLIFTING: What To Do ✅
 64 |   3:01 |    4000 | My TOP TIPS for SQUATTING 500+LBS ✅
 65 |   2:46 |    7000 | My NEW POWERLIFTING PROGRAM (2025) ✅
 66 |   3:08 |    3900 | Does POWERLIFTING have a ROM PROBLEM⁉️
 67 |   2:54 |    7400 | Why I ALWAYS Bench Before I Squat/Deadlift ✅
 68 |   2:33 |    7900 | Why I Started Squatting HIGH BAR ✅
 69 |   2:29 |    7800 | NUTRITION for POWERLIFTING ✅
 70 |   3:37 |    6500 | PROGRESSIVE OVERLOAD for POWERLIFTING ✅
 71 |   2:51 |    3500 | Your FORM is TERRIBLE 🤣
 72 |   3:22 |   11000 | The BIGGEST MISTAKES of LIFETIME INTERMEDIATES ✅
 73 |   3:09 |   12000 | Why TOO MUCH SQUAT/BENCH/DEADLIFT is SUB-OPTIMAL ❌
 74 |   2:35 |    5200 | Less REST = More GAINS ⁉️
 75 |   2:40 |   18000 | What TRIPLING MY CARDIO did to my GAINS ✅
 76 |   3:04 |    6900 | GETTING FAT vs GETTING STRONG
 77 |   2:13 |    3100 | STOP making this DEADLIFT MISTAKE 🛑
 78 |   2:44 |    8300 | What losing 20LBS did to my STRENGTH⁉️
 79 |   4:36 |    7700 | How SAFE is POWERLIFTING⁉️
 80 |   3:20 |    6900 | BULKING AND CUTTING FOR POWERLIFTING
 81 |   3:23 |    6900 | My NEW PROGRAM ✅
 82 |   2:56 |    5000 | Why you should STOP TRAINING your WEAKPOINTS ❌
 83 |   3:04 |    5500 | POWERLIFTING MEET RECAP: CANADIAN NATIONALS
 84 |   2:41 |    4300 | Not ALL BENCH PRESSES are THE SAME ✅
 85 |   2:49 |    6500 | HOW TO: One Rep Max ✅
 86 |   4:30 |    6900 | What I Wish I Knew When I Started Powerlifting
 87 |   3:56 |    6900 | What QUITTING SINGLES Did To My BENCH PRESS ✅
 88 |   3:37 |    6100 | Why EVERY POWERLIFTER should DEADLIFT CONVENTIONAL ✅
 89 |   3:58 |    6300 | POWERLIFTING PROGRAMMING | CHOOSING ACCESSORIES
 90 |   3:43 |    9200 | How I Added 100LBS to my deadlift in 100 DAYS ✅
 91 |   4:46 |    7600 | POWERLIFTING PROGRAMMING | REP RANGES
 92 |   3:29 |    9000 | Why EVERYBODY should BENCH MORE OFTEN ✅
 93 |   4:37 |    5200 | Why I NEVER Squat & Deadlift On The Same Day | Training Log & QnA
 94 |   3:47 |    4100 | Why you should ALWAYS lift weights FAST ✅
 95 |   4:11 |    4100 | The MINDSET to MAKE GAINS | Training Log & QnA
 96 |   3:09 |    5200 | POWERLIFTERS need to train more like BODYBUILDERS | Training Log & QnA
 97 |   2:37 |    3500 | My Top 3 UNDERRATED Powerlifting Cues ✅
 98 |   4:22 |    9000 | How To Fix A POVERTY LIFT | Training Log & Qna
 99 |   3:01 |    7900 | My New SQUAT Program ✅
100 |   4:27 |    7900 | POWERLIFTER vs COMMERCIAL GYM | Training Log & QnA
101 |   2:42 |   11000 | The Most UNDERRATED MUSCLES For POWERLIFTING ✅
102 |   4:20 |    5800 | Why I NEVER do DELOADS | Training Log & QnA
103 |   3:14 |    7000 | BENCH PRESS EXERCISE TIER LIST ✅
104 |   5:23 |    8100 | My NEW Program 3.0 | Training Log & QnA
105 |   3:39 |    9000 | Why I’m QUITTING HEAVY SINGLES ❌
106 |   3:50 |    7900 | MOCK MEET | TRAINING CYCLE RECAP
107 |   4:01 |    8100 | DEADLIFT EXERCISE TIER LIST ✅
108 |   4:32 |    4600 | My NEW PROGRAM = NEW GAINS | Training Log & QnA
109 |   3:46 |    4900 | How To Program For Beginner, Intermediate, & Advanced Lifters
110 |   6:07 |    3500 | Do THIS before you MAX OUT | Training Log
111 |   4:24 |    5000 | THAT’S TOO FATIGUING | Training Log & QnA
112 |   5:36 |    5600 | You’ll NEVER lift THIS MUCH ⁉️ | Training Log & QnA
113 |   4:36 |    9700 | Squat Exercise TIER LIST ✅
114 |   5:52 |    6900 | You CANNOT make these gains NATURALLY | Training Log & QnA
115 |   3:50 |    5700 | The SOLUTION to SQUATTING DEEPER
116 |   5:59 |    7300 | POWERLIFTERS don’t have REAL STRENGTH | Training Log & QnA
117 |   5:23 |   19000 | Why EVERYBODY should try HIGH FREQUENCY LIFTING ✅
118 |   5:58 |   15000 | This lift is USELESS for POWERLIFTING | Training Log & QnA
119 |   6:02 |   29000 | BENCH ACCESSORIES for EVERY WEAKNESS 💪
120 |   6:49 |    7800 | Stop SQUATTING like a P*SSY 🐱 | Training Log & QnA
121 |   5:18 |   25000 | DEADLIFT ACCESSORIES for EVERY WEAKNESS 💪
122 |   8:00 |    8900 | My NEW Program | Training Log & QNA
123 |   2:38 |    7800 | STOP MAKING this DEADLIFT MISTAKE ❌
124 |   5:06 |   15000 | SQUAT ACCESSORIES for EVERY WEAKNESS 💪
125 |   2:58 |    4800 | Why I NEVER do MOBILITY WORK | Powerlifting QnA
126 |   3:38 |   12000 | POWERLIFTING PROGRAMMING PART 3 | INTENSITY
127 |   2:47 |   10000 | LESS WEIGHT = MORE GAINS 🤯
128 |   2:50 |   15000 | Why I NEVER used machines to build STRENGTH ✅
129 |   4:35 |   13000 | RPE IS FOR P*SSIES 🤡
130 |   1:50 |    5900 | STOP WORRYING ABOUT TIME UNDER TENSION 🤡
131 |   2:30 |   16000 | MY FREE PROGRAM
132 |   4:06 |   10000 | STOP WORRYING ABOUT GOOD MORNING SQUATS 🤡
133 |   4:07 |   10000 | “ITS ALL GENETICS AND STEROIDS” = COPE 🤡
134 |   2:58 |   13000 | THE MYTH ABOUT REP RANGES ❌
135 |   3:07 |   24000 | MY PROGRAM (PREPARE TO ☠️)
136 |   2:55 |   14000 | (LACK OF) CARDIO IS KILLING YOUR GAINS ❌
137 |   3:35 |   16000 | HEAVY SINGLES = NO GAINS ⁉️
138 |   5:09 |    8700 | STOP TAKING TIME OFF FROM INJURY 🤡
139 |   3:08 |    9400 | LIFTING BELTS ARE OVERRATED 🤡
140 |   4:02 |   10000 | LIFTING CUES ARE OVERRATED ❌
141 |   3:44 |   21000 | STOP WORRYING ABOUT SQUAT BAR PATH 🤡
142 |   4:38 |   22000 | POWERLIFTERS should train more like BODYBUILDERS
143 |   2:48 |   17000 | WHY PROGRESSIVE OVERLOAD IS OVERRATED 🤡
144 |   2:33 |   17000 | WHY YOUR DEADLIFT SUCKS OFF THE FLOOR ❌
145 |   6:32 |   34000 | Powerlifting Programming Part 2 | VOLUME
146 |   4:19 |   53000 | Powerlifting Programming Part 1 | FREQUENCY
147 |   1:29 |   21000 | Stop Changing Your Program ❌
148 |   5:03 |   24000 | 750LBS SQUAT | CANADIAN NATIONALS RECAP
149 |   4:03 |   19000 | HOW I NEVER HAVE BAD WORKOUTS ❌
150 |   3:56 |   23000 | WHY I STOPPED CARING ABOUT MY FORM ❌
151 |   3:02 |   44000 | WHY IT TOOK ME 3 YEARS TO LIFT 5LBS MORE 🤡
152 |   3:36 |   22000 | WHY I STARTED DOING CARDIO EVERYDAY‼️
153 |   6:12 |   22000 | 💩 MYSELF SQUATTING | CANADIAN NATIONALS RECAP
154 |   3:50 |   15000 | GOING TO THE WORLD CHAMPIONSHIPS
155 |   5:35 |   27000 | DEADLIFT BACK ROUNDING | CAUSE AND FIX
156 |   6:58 |   15000 | WHY CORE STRENGTH IS OVERRATED FOR SQUATS/DEADLIFTS
157 |   8:30 |   46000 | HOW TO SQUAT TUTORIAL: ARM/ELBOW/HAND/WRIST POSITION
158 |   4:17 |   10000 | WHY EVERYBODY SHOULD BENCH WITH AN ARCH
159 |   7:00 |   20000 | STOP TRYING TO SQUAT UPRIGHT (LONG VERSION)
160 |   8:29 |   26000 | USE THE STRETCH REFLEX TO INSTANTLY LIFT MORE WEIGHT
161 |   2:28 |   40000 | HOW TO INSTANTLY FIND THE PERFECT DEADLIFT START POSITION (SUMO OR CONVENTIONAL)
162 |  10:14 |   40000 | RANGE OF MOTION DOESN’T MAKE SUMO DEADLIFTS EASIER (BUT IT’S STILL EASIER FOR MOST PEOPLE)
163 |   3:32 |  118000 | STOP TRYING TO BE UPRIGHT DURING SUMO DEADLIFTS
164 |  11:57 |   19000 | IPF World Championships | Full Meet Recap
165 |   4:29 |   42000 | Stacked Joints = Terrible Advice
166 |  10:01 |   37000 | How To Program For Yourself
167 |   4:53 |   81000 | Proper Bench Press Bar Path | Increase Your Bench By 35%
168 |   3:25 |  128000 | The Best Squat Accessory (How I Squatted 700lbs)
169 |  16:55 |   11000 | Questions and Answers 2
170 |  15:30 |   43000 | My Program
171 |  13:20 |    9400 | Question and Answer #1 | 655lbs Squat
172 |   7:39 |    8700 | Are Sumo Deadlifts Cheating?
173 |   7:42 |   13000 | Am I A Fake Natty? | Training Log 605lbsx5 Squat
174 |   6:50 |   11000 | Do I Use Fake Weights? | Training Log
175 |  19:17 |   55000 | What Programs Did I Do To Get Where I Am? | 678LBS Squat | 683Lbs Deadlift
176 |   4:04 |   17000 | How Strong Was I When I First Started? | 672Lbs Squat & 678Lbs Deadlift
177 |   4:30 |    2800 | 666Lbs Squat 672Lbs Deadlift | Training Log
178 |   0:54 |    8900 | JJ Watt vs Powerlifter: Squat Off
179 |   0:18 |   11000 | 405x2 Bench Press PR
180 |   0:11 |   13000 | 700Lbs Deficit Deadlift
181 |   2:25 |   78000 | People Mirin Me Lifting Compilation Part 3
182 |   0:31 |   86000 | 405Lbs Bench Press Fail
183 |   1:05 |   40000 | 405Lbs Bench Press Comeback
184 |   0:26 |   33000 | 675Lbs Tempo Squat PR
185 |  10:07 |   11000 | Training Log: Weeks 1&2 - Post Quarantine Gains
186 |   3:07 |   67000 | 4 Year Squat Transformation | 315lbs to 700lbs
187 |   7:22 |   19000 | 405x24 Squat For Candito Squat Challenge
188 |   1:14 |   26000 | 405x23 squat but the camera died
189 |   2:00 |  704000 | People Mirin Me Lifting Compilation 2
190 |   2:00 |    9400 | 440lbs Deadlift Progress In 3.5 Years.
191 |   2:00 |   10000 | 3.5 Year Squat Progress. 345lbs to 675lbs
192 |   3:13 | 10000000 | People Mirin Me Lifting Compilation
193 |   1:52 |    2100 | 575/1267.7 Total at 79.7/175.7 17 Years Old Canadian National Record Total
194 |   1:24 |   23000 | 217 Pound Deadlift Progress in 14 months 335-552 16-17 Years Old
195 |   0:30 |    5300 | 530 Poundx2 Deadlift PR 17 Years Old 180 Pounds
196 |   0:35 |   11000 | 405 Deadlift for 3 Reps at 17 Years Old
Shell cwd was reset to /Users/brunnovert/Documents/Dev/powerlifting-app

================================================================================
## BLOCO 8 — 11326 chars
================================================================================

1	#!/usr/bin/env node
2	/**
3	 * Gera src/data/program/powerbuilding2/generated.ts a partir do markdown de
4	 * origem em src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md.
5	 *
6	 * O markdown é a fonte de verdade: o gerador normaliza as 8 colunas de cada
7	 * linha da tabela sem interpretar nada além do necessário (reps, %1RM, RPE e
8	 * notas saem verbatim). A expansão de cada linha em séries individuais
9	 * acontece em runtime, em src/domain/setPlan.ts.
10	 *
11	 * Uso: node scripts/build-program.mjs [--check]
12	 *   --check  não escreve nada; falha se o arquivo gerado estiver desatualizado.
13	 */
14	import { readFileSync, writeFileSync } from 'node:fs';
15	import { createHash } from 'node:crypto';
16	import { fileURLToPath } from 'node:url';
17	import { dirname, join } from 'node:path';
18	import { EXERCISE_MAP } from './exercise-map.mjs';
19	
20	const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
21	const SRC = join(ROOT, 'src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md');
22	const OUT = join(ROOT, 'src/data/program/powerbuilding2/generated.ts');
23	
24	/** Contagens esperadas — travas contra parse silenciosamente incompleto. */
25	const EXPECTED_DAYS = 54;
26	const EXPECTED_ROWS = 373;
27	
28	/**
29	 * Mesociclos. O markdown não nomeia blocos; a única marcação explícita é a
30	 * semana 8 ("SEMI-DELOAD WEEK") e a 12 ("FINAL WEEK). O restante é a leitura
31	 * do progresso de intensidade ao longo das 12 semanas.
32	 */
33	const WEEK_META = {
34	  block1: {
35	    weeks: [1, 2, 3, 4],
36	    macrocycle: 1,
37	    blockName: 'Bloco 1 — Acumulação',
38	    blockType: 'accumulation',
39	    blockObjective: 'Construir base de volume e técnica alternando semanas full body (5 dias) e upper/lower (4 dias).',
40	  },
41	  block2: {
42	    weeks: [5, 6, 7],
43	    macrocycle: 2,
44	    blockName: 'Bloco 2 — Intensificação',
45	    blockType: 'intensification',
46	    blockObjective: 'Top sets mais pesadas mantendo o volume acessório.',
47	  },
48	  deload: {
49	    weeks: [8],
50	    macrocycle: 2,
51	    blockName: 'Semi-Deload',
52	    blockType: 'deload',
53	    blockObjective: 'Semana mais leve: evite a falha, treine com cargas reduzidas.',
54	    isDeload: true,
55	  },
56	  block3: {
57	    weeks: [9, 10, 11],
58	    macrocycle: 3,
59	    blockName: 'Bloco 3 — Pico de Intensidade',
60	    blockType: 'intensification',
61	    blockObjective: 'Singles e duplas pesadas nos básicos, densidade máxima nos acessórios.',
62	  },
63	  final: {
64	    weeks: [12],
65	    macrocycle: 3,
66	    blockName: 'Semana Final',
67	    blockType: 'realization',
68	    blockObjective: 'Fechamento do ciclo com AMRAPs e trabalho de qualidade. Não há teste formal de 1RM.',
69	  },
70	};
71	
72	function metaForWeek(weekNumber) {
73	  for (const meta of Object.values(WEEK_META)) {
74	    if (meta.weeks.includes(weekNumber)) return meta;
75	  }
76	  throw new Error(`Semana ${weekNumber} sem mesociclo definido`);
77	}
78	
79	/** Rótulo do dia (verbatim do markdown) -> DayType. */
80	function dayTypeFor(label, dayIndex) {
81	  const l = label.toLowerCase();
82	  if (l.includes('arm &')) return 'arms_hypertrophy';
83	  if (l.startsWith('full body')) {
84	    if (l.includes('strength')) return 'fb_strength';
85	    if (l.includes('hypertrophy')) return 'fb_hypertrophy';
86	    // "Full Body - Continued" aparece duas vezes na semana; o índice desempata.
87	    return dayIndex <= 1 ? 'fb_continued_a' : 'fb_continued_b';
88	  }
89	  if (l.startsWith('lower body')) {
90	    return l.includes('continued') || l.includes('final') ? 'lower_body_continued' : 'lower_body';
91	  }
92	  if (l.startsWith('upper body')) {
93	    return l.includes('continued') || l.includes('final') ? 'upper_body_continued' : 'upper_body';
94	  }
95	  throw new Error(`Rótulo de dia não reconhecido: "${label}"`);
96	}
97	
98	/** "3-4 MIN" -> 180 | "0 MIN" -> 0 | "N/A" -> undefined */
99	function parseRest(raw) {
100	  if (!raw || raw === 'N/A') return undefined;
101	  const m = raw.match(/^(\d+)(?:-(\d+))?\s*MIN$/i);
102	  if (!m) throw new Error(`Descanso não reconhecido: "${raw}"`);
103	  return Number(m[1]) * 60;
104	}
105	
106	/** "82.5-87.5%" -> { min: 0.825, max: 0.875 } */
107	function parsePercent(raw) {
108	  if (!raw || raw === 'N/A') return undefined;
109	  const m = raw.match(/^([\d.]+)(?:-([\d.]+))?%$/);
110	  if (!m) throw new Error(`%1RM não reconhecido: "${raw}"`);
111	  const min = Number(m[1]) / 100;
112	  const max = m[2] ? Number(m[2]) / 100 : min;
113	  return { min, max };
114	}
115	
116	function parse(md) {
117	  const lines = md.split('\n');
118	  const days = [];
119	  let current = null;
120	  let pendingWeekLabel = new Map();
121	
122	  for (const line of lines) {
123	    const weekHeader = line.match(/^## WEEK (\d+)(?:\s*\((.+)\))?\s*$/);
124	    if (weekHeader) {
125	      if (weekHeader[2]) pendingWeekLabel.set(Number(weekHeader[1]), weekHeader[2]);
126	      continue;
127	    }
128	
129	    const dayHeader = line.match(/^### WEEK (\d+) - DAY (\d+) \((.+)\)\s*$/);
130	    if (dayHeader) {
131	      current = {
132	        weekNumber: Number(dayHeader[1]),
133	        dayNumber: Number(dayHeader[2]),
134	        dayLabel: dayHeader[3],
135	        rows: [],
136	        restNote: undefined,
137	      };
138	      days.push(current);
139	      continue;
140	    }
141	
142	    if (!current) continue;
143	
144	    const restNote = line.match(/^\*\*(SUGGESTED REST DAY.*?)\*\*\s*$/);
145	    if (restNote) {
146	      current.restNote = restNote[1];
147	      continue;
148	    }
149	
150	    if (!line.startsWith('| ') || line.includes('|---') || line.startsWith('| Exercise')) continue;
151	    const cols = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
152	    if (cols.length !== 8) throw new Error(`Linha com ${cols.length} colunas: ${line}`);
153	    current.rows.push(cols);
154	  }
155	
156	  return { days, weekLabels: pendingWeekLabel };
157	}
158	
159	function buildExercise(cols, weekNumber, dayNumber, index) {
160	  const [rawLabel, warmRaw, workRaw, reps, pctRaw, rpe, restRaw, notes] = cols;
161	
162	  const superset = rawLabel.match(/^([A-C])([12]):\s*(.+)$/);
163	  let label = superset ? superset[3] : rawLabel;
164	
165	  const entry = EXERCISE_MAP[label];
166	  if (!entry) throw new Error(`Exercício não mapeado: "${label}" (semana ${weekNumber}, dia ${dayNumber})`);
167	
168	  const optional = / \(Optional\)$/.test(label);
169	  // O nome exibido preserva o rótulo do programa, menos o marcador de opcional
170	  // e o "[OR ...]" — a variação vira campo próprio.
171	  const exerciseName = label.replace(/ \(Optional\)$/, '').replace(/\s*\[OR .+?\]$/, '');
172	
173	  const percent = parsePercent(pctRaw);
174	  const perSide = / each$/.test(workRaw) || /each/.test(reps);
175	  const unit = /sec$/.test(reps) ? 'seconds' : undefined;
176	
177	  const ex = {
178	    blockId: `w${weekNumber}d${dayNumber}b${index}`,
179	    exerciseId: entry.id,
180	    exerciseName,
181	    rawLabel,
182	    sets: Number(workRaw.replace(' each', '')),
183	    reps,
184	    rpe,
185	    warmupSets: Number(warmRaw),
186	  };
187	  if (notes) ex.notes = notes;
188	  if (superset) {
189	    ex.supersetGroup = superset[1];
190	    ex.supersetOrder = Number(superset[2]);
191	  }
192	  const restSec = parseRest(restRaw);
193	  if (restSec !== undefined) {
194	    ex.restSec = restSec;
195	    ex.restLabel = restRaw;
196	  }
197	  if (percent) {
198	    ex.percent1RM = pctRaw;
199	    ex.percentMin = percent.min;
200	    ex.percentMax = percent.max;
201	  }
202	  if (perSide) ex.perSide = true;
203	  if (optional) ex.optional = true;
204	  if (unit) ex.unit = unit;
205	  if (entry.alt) {
206	    ex.alternatives = entry.alt.map(([name]) => name);
207	    ex.alternativeIds = entry.alt.map(([, id]) => id);
208	  }
209	  return ex;
210	}
211	
212	function build() {
213	  const md = readFileSync(SRC, 'utf8');
214	  const { days, weekLabels } = parse(md);
215	
216	  if (days.length !== EXPECTED_DAYS) {
217	    throw new Error(`Esperado ${EXPECTED_DAYS} dias, encontrado ${days.length}`);
218	  }
219	  const rowCount = days.reduce((n, d) => n + d.rows.length, 0);
220	  if (rowCount !== EXPECTED_ROWS) {
221	    throw new Error(`Esperado ${EXPECTED_ROWS} linhas de exercício, encontrado ${rowCount}`);
222	  }
223	
224	  const byWeek = new Map();
225	  for (const day of days) {
226	    const dayIndex = day.dayNumber - 1;
227	    const exercises = day.rows.map((cols, i) => buildExercise(cols, day.weekNumber, day.dayNumber, i));
228	    const entry = {
229	      dayType: dayTypeFor(day.dayLabel, dayIndex),
230	      dayLabel: day.dayLabel,
231	      dayIndex,
232	      exercises,
233	    };
234	    if (day.restNote) {
235	      entry.restNote = day.restNote;
236	      entry.restDaysAfter = 1;
237	    } else {
238	      entry.restDaysAfter = 0;
239	    }
240	    if (!byWeek.has(day.weekNumber)) byWeek.set(day.weekNumber, []);
241	    byWeek.get(day.weekNumber).push(entry);
242	  }
243	
244	  const weeks = [...byWeek.keys()].sort((a, b) => a - b).map((weekNumber) => {
245	    const meta = metaForWeek(weekNumber);
246	    const week = {
247	      weekNumber,
248	      macrocycle: meta.macrocycle,
249	      blockName: meta.blockName,
250	      blockType: meta.blockType,
251	      blockObjective: meta.blockObjective,
252	      isDeload: meta.isDeload === true,
253	      days: byWeek.get(weekNumber),
254	    };
255	    const label = weekLabels.get(weekNumber);
256	    if (label) week.weekLabel = label;
257	    return week;
258	  });
259	
260	  const sourceHash = createHash('sha256').update(md).digest('hex').slice(0, 16);
261	  const totalSessions = weeks.reduce((n, w) => n + w.days.length, 0);
262	
263	  const header = `/**
264	 * ARQUIVO GERADO — não edite à mão.
265	 *
266	 * Origem: src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md
267	 * Gerador: scripts/build-program.mjs
268	 * sha256(origem): ${sourceHash}
269	 *
270	 * ${weeks.length} semanas · ${totalSessions} sessões · ${rowCount} blocos de prescrição.
271	 * Para regenerar: npm run build:program
272	 */
273	import type { PrescribedWeek } from '../../../types';
274	
275	/** Hash do markdown de origem que produziu este arquivo. */
276	export const POWERBUILDING2_SOURCE_HASH = '${sourceHash}';
277	
278	export const powerbuilding2Weeks: PrescribedWeek[] = `;
279	
280	  const body = JSON.stringify(weeks, null, 2);
281	  return { content: `${header}${body};\n`, weeks: weeks.length, totalSessions, rowCount };
282	}
283	
284	const result = build();
285	const check = process.argv.includes('--check');
286	
287	if (check) {
288	  let existing = '';
289	  try {
290	    existing = readFileSync(OUT, 'utf8');
291	  } catch {
292	    /* arquivo ainda não existe */
293	  }
294	  if (existing !== result.content) {
295	    console.error('generated.ts está desatualizado em relação ao markdown. Rode: npm run build:program');
296	    process.exit(1);
297	  }
298	  console.log(`OK — ${result.weeks} semanas, ${result.totalSessions} sessões, ${result.rowCount} blocos.`);
299	} else {
300	  writeFileSync(OUT, result.content);
301	  console.log(`Gerado ${OUT}\n  ${result.weeks} semanas · ${result.totalSessions} sessões · ${result.rowCount} blocos de prescrição.`);
302	}
303	

================================================================================
## BLOCO 9 — 11235 chars
================================================================================

1	/** Natureza de uma série dentro de um bloco de prescrição. */
2	export type SetType =
3	  | 'warmup'   // série de aquecimento (pirâmide) — não conta volume, PR nem e1RM
4	  | 'working'  // série de trabalho normal
5	  | 'top'      // top set / single pesado
6	  | 'backoff'  // série mais leve após a top set
7	  | 'amrap'    // as many reps as possible
8	  | 'dropset'  // série com redução de carga no meio
9	  | 'cluster'  // 21s, rest-pause e afins (múltiplos segmentos, mesma carga)
10	  | 'timed';   // isometria medida em segundos
11	
12	/** Unidade em que a série é contada. */
13	export type RepUnit = 'reps' | 'seconds';
14	
15	/** Levantamento de referência para prescrições em %1RM. */
16	export type PercentRef = 'squat' | 'bench' | 'deadlift' | 'ohp';
17	
18	/**
19	 * Sub-parte de uma série: as duas fases de um dropset, os três blocos de um 21s,
20	 * os lados de um exercício unilateral, os clusters de um rest-pause.
21	 */
22	export interface PrescribedSegment {
23	  /** Rótulo curto exibido na UI: "1", "2", "Esq", "Dir", "Drop", "Topo". */
24	  label: string;
25	  /** Reps verbatim do markdown ("7", "15", "4", "AMRAP"). */
26	  reps: string;
27	  unit?: RepUnit;
28	  /** Redução de carga sugerida vs. o segmento anterior (0.3 = -30%). */
29	  loadDropPct?: number;
30	  note?: string;
31	}
32	
33	/** Prescrição de UMA série. É o nível de fidelidade exigido pelo markdown. */
34	export interface PrescribedSet {
35	  setNumber: number;
36	  type: SetType;
37	  /** Reps verbatim do markdown: "4-6", "AMRAP", "7/7/7", "20-30 sec". */
38	  reps: string;
39	  unit: RepUnit;
40	  rpe?: string;
41	  /** %1RM verbatim: "82.5-87.5%". */
42	  percent1RM?: string;
43	  percentMin?: number;
44	  percentMax?: number;
45	  percentRef?: PercentRef;
46	  /** Descanso após a série, em segundos (extremo inferior do range). 0 = emendar. */
47	  restSec?: number;
48	  /** Descanso verbatim: "3-4 MIN". */
49	  restLabel?: string;
50	  /** Série executada em cada lado. */
51	  perSide?: boolean;
52	  segments?: PrescribedSegment[];
53	  /** Só para aquecimento: fração da carga da primeira série de trabalho. */
54	  warmupFraction?: number;
55	  note?: string;
56	}
57	
58	/** Sub-parte executada de uma série. */
59	export interface SetSegmentLog {
60	  label: string;
61	  weight: number;
62	  reps: number;
63	  seconds?: number;
64	}
65	
66	export interface SetLog {
67	  setNumber: number;
68	  weight: number;
69	  reps: number;
70	  rpe: number;
71	  e1rm: number;
72	  completed: boolean;
73	  isPR: boolean;
74	  setType?: SetType;
75	  unit?: RepUnit;
76	  /** Duração executada, para séries isométricas. */
77	  durationSec?: number;
78	  perSide?: boolean;
79	  segments?: SetSegmentLog[];
80	  /** Snapshot da prescrição desta série específica. */
81	  prescribed?: PrescribedSet;
82	}
83	
84	export interface ExercisePrescription {
85	  exerciseId: string;
86	  exerciseName: string;
87	  prescribedSets: number;
88	  prescribedReps: string;
89	  prescribedRPE: string;
90	  supersetGroup?: string;
91	  supersetOrder?: number;
92	  /** Identificador do bloco dentro do dia (um exercício pode repetir no mesmo dia). */
93	  blockId?: string;
94	  /** Rótulo verbatim do markdown, incluindo prefixo de superset e "[OR ...]". */
95	  rawLabel?: string;
96	  /** Notas prescritas pelo programa (distintas das notas do usuário). */
97	  prescribedNotes?: string;
98	  warmupSets?: number;
99	  restSec?: number;
100	  restLabel?: string;
101	  percent1RM?: string;
102	  percentRef?: PercentRef;
103	  perSide?: boolean;
104	  optional?: boolean;
105	  unit?: RepUnit;
106	  /** Variações permitidas, incluindo a padrão na primeira posição. */
107	  variations?: { exerciseId: string; name: string }[];
108	  /** Plano série a série, já materializado (aquecimentos + séries de trabalho). */
109	  setPlan?: PrescribedSet[];
110	}
111	
112	export interface ExerciseLog extends ExercisePrescription {
113	  sets: SetLog[];
114	  notes?: string;
115	  skipped?: boolean;
116	}
117	
118	export interface WorkoutLog {
119	  id: string;
120	  date: string;
121	  /** Programa a que este treino pertence. Ausente = programa legado de 52 semanas. */
122	  programId?: string;
123	  weekNumber: number;
124	  macrocycle: number;
125	  blockName: string;
126	  blockType: BlockType;
127	  dayType: DayType;
128	  /** Posição do dia dentro da semana — desambigua dias com o mesmo dayType. */
129	  dayIndex?: number;
130	  sessionIndex?: number;
131	  exercises: ExerciseLog[];
132	  notes?: string;
133	  completed: boolean;
134	  startedAt?: string;
135	  completedAt?: string;
136	}
137	
138	export interface WorkoutSummary {
139	  id: string;
140	  date: string;
141	  weekNumber: number;
142	  macrocycle: number;
143	  blockName: string;
144	  blockType: BlockType;
145	  dayType: DayType;
146	  completed: boolean;
147	  completedAt?: string;
148	}
149	
150	export interface WorkoutExercises {
151	  exercises: ReadonlyArray<{
152	    exerciseId: string;
153	    sets: ReadonlyArray<{ completed: boolean }>;
154	  }>;
155	}
156	
157	export type BlockType = 'accumulation' | 'transmutation' | 'intensification' | 'realization' | 'deload';
158	
159	export type DayType =
160	  // Programa legado de 52 semanas
161	  | 'squat_emphasis' | 'bench_emphasis' | 'deadlift_emphasis' | 'bench_volume' | 'arms_shoulders'
162	  // Powerbuilding Phase 2.0 — semanas ímpares (full body, 5 dias)
163	  | 'fb_strength' | 'fb_continued_a' | 'fb_hypertrophy' | 'fb_continued_b' | 'arms_hypertrophy'
164	  // Powerbuilding Phase 2.0 — semanas pares (upper/lower, 4 dias)
165	  | 'lower_body' | 'upper_body' | 'lower_body_continued' | 'upper_body_continued';
166	
167	export interface PersonalRecord {
168	  exerciseId: string;
169	  e1rm: number;
170	  weight: number;
171	  reps: number;
172	  rpe: number;
173	  date: string;
174	}
175	
176	export interface AthleteProfile {
177	  bodyweight: number;
178	  squat1RM: number;
179	  bench1RM: number;
180	  deadlift1RM: number;
181	  /** Desenvolvimento militar — exigido pelas prescrições em %1RM do Powerbuilding 2.0. */
182	  ohp1RM?: number;
183	  total: number;
184	  dots: number;
185	}
186	
187	export interface WeeklyVolume {
188	  weekNumber: number;
189	  muscleGroups: Record<string, number>;
190	}
191	
192	/**
193	 * Um bloco de prescrição = uma linha da tabela do programa.
194	 * O mesmo exercício pode aparecer em vários blocos no mesmo dia
195	 * (ex.: supino top set + back-off + série de reps altas).
196	 */
197	export interface PrescribedExercise {
198	  exerciseId: string;
199	  exerciseName: string;
200	  /** Séries de trabalho (não inclui aquecimento). */
201	  sets: number;
202	  reps: string;
203	  rpe: string;
204	  notes?: string;
205	  supersetGroup?: string;  // "A" | "B" | "C"
206	  supersetOrder?: number;  // 1 | 2 (A1, A2...)
207	  /** Chave estável do bloco dentro do dia. */
208	  blockId?: string;
209	  /** Rótulo verbatim do markdown. */
210	  rawLabel?: string;
211	  warmupSets?: number;
212	  restSec?: number;
213	  restLabel?: string;
214	  percent1RM?: string;
215	  percentMin?: number;
216	  percentMax?: number;
217	  percentRef?: PercentRef;
218	  perSide?: boolean;
219	  optional?: boolean;
220	  /** Variações aceitas pelo programa ("Box Squat", "Nordic Ham Curl"). */
221	  alternatives?: string[];
222	  /** Ids das variações, na mesma ordem de `alternatives`. */
223	  alternativeIds?: string[];
224	  unit?: RepUnit;
225	  /** Plano série a série (aquecimentos + séries de trabalho). */
226	  setPlan?: PrescribedSet[];
227	}
228	
229	export interface PrescribedDay {
230	  dayType: DayType;
231	  dayLabel: string;
232	  /** Posição do dia dentro da semana (0-based). */
233	  dayIndex?: number;
234	  /** Dias de descanso sugeridos após esta sessão. */
235	  restDaysAfter?: number;
236	  /** Texto de descanso verbatim do programa. */
237	  restNote?: string;
238	  exercises: PrescribedExercise[];
239	}
240	
241	export interface PrescribedWeek {
242	  weekNumber: number;
243	  macrocycle: number;
244	  blockName: string;
245	  blockType: BlockType;
246	  blockObjective: string;
247	  isDeload: boolean;
248	  /** Rótulo verbatim do cabeçalho da semana, quando houver. */
249	  weekLabel?: string;
250	  days: PrescribedDay[];
251	}
252	
253	/** Um programa de treino completo e selecionável. */
254	export interface TrainingProgram {
255	  id: string;
256	  name: string;
257	  author?: string;
258	  description: string;
259	  /** Procedência dos dados (arquivo markdown de origem, por exemplo). */
260	  source?: string;
261	  weeks: PrescribedWeek[];
262	}
263	
264	/** Uma sessão do programa, já resolvida na ordem linear de execução. */
265	export interface ProgramSession {
266	  sessionIndex: number;
267	  weekNumber: number;
268	  dayIndex: number;
269	  week: PrescribedWeek;
270	  day: PrescribedDay;
271	}
272	
273	export type MuscleGroup =
274	  | 'quads'
275	  | 'glúteos'
276	  | 'erectors'
277	  | 'hamstrings'
278	  | 'peito'
279	  | 'deltóide_anterior'
280	  | 'deltóide_posterior'
281	  | 'deltóide_lateral'
282	  | 'tríceps'
283	  | 'bíceps'
284	  | 'costas'
285	  | 'braquial'
286	  | 'panturrilha'
287	  | 'abdômen'
288	  | 'trapézio'
289	  | 'antebraço'
290	  | 'pescoço'
291	  | 'abdutores';
292	
293	export type ExerciseMuscleMap = Record<string, Partial<Record<MuscleGroup, number>>>;
294	
295	// Pain
296	export type PainRegion =
297	  | 'lower_back' | 'upper_back'
298	  | 'left_knee' | 'right_knee'
299	  | 'left_shoulder' | 'right_shoulder'
300	  | 'left_hip' | 'right_hip'
301	  | 'left_elbow' | 'right_elbow'
302	  | 'left_wrist' | 'right_wrist'
303	  | 'neck' | 'other';
304	
305	export interface PainEntry {
306	  region: PainRegion;
307	  intensity: number; // 1-10
308	}
309	
310	// Pre-Workout Survey
311	export interface PreWorkoutSurvey {
312	  workoutId: string;
313	  date: string;
314	  sleepQuality: number;     // 1-10
315	  sleepHours: number;       // 0-14, step 0.5
316	  energyLevel: number;      // 1-10
317	  stressLevel: number;      // 1-10
318	  motivation: number;       // 1-10
319	  hasPain: boolean;
320	  painEntries: PainEntry[];
321	  supplements: {
322	    creatine: boolean;
323	    protein: boolean;
324	    preWorkoutMeal: boolean;
325	  };
326	  skipped: boolean;
327	}
328	
329	// Post-Workout Survey
330	export type StrengthPerception = 'below' | 'normal' | 'above';
331	export type PlanAdherence = 'full' | 'partial' | 'none';
332	
333	export interface PostWorkoutSurvey {
334	  workoutId: string;
335	  date: string;
336	  sessionQuality: number;     // 1-10
337	  sessionRPE: number;         // 1-10
338	  strengthPerception: StrengthPerception;
339	  planAdherence: PlanAdherence;
340	  adherenceReason?: string;
341	  hasNewPain: boolean;
342	  painEntries: PainEntry[];
343	  pumpRating?: number;        // 1-5
344	  notes?: string;
345	  skipped: boolean;
346	}
347	
348	// AI Feedback
349	export type FeedbackPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';
350	
351	export interface AIFeedback {
352	  id: string;
353	  workoutId?: string;
354	  date: string;
355	  period: FeedbackPeriod;
356	  weekNumber?: number;
357	  macrocycle?: number;
358	  content: string;
359	  status: 'pending' | 'completed' | 'failed';
360	}
361	

================================================================================
## BLOCO 10 — 9983 chars
================================================================================

Approach this as the design lead at a small studio known for their versatility, giving every client a visual identity pitched at the treatment the task actually calls for. Make deliberate choices about palette, typography, and layout that are specific to this subject, and avoid templated designs.

## Read the request first

Calibrate treatment, not whether to design. A doc deserves the same craft as a landing page — what changes is the treatment that craft is delivered in.

Many requests call for a more utilitarian treatment: a plan, a memo, a demo. Make it polished: include real typographic hierarchy, considered spacing, and a proper palette, but avoid over-designing. Most pages do not need a flashy, gigantic hero. Keep flourishes tasteful and limited.

Some requests call for an editorial treatment: a landing page, a game, an app or tool they'll keep or share.

When unsure: a well-composed page is never the wrong answer; an over-designed visual identity sometimes is.

Fundamentals below apply to everything. The editorial process after that runs only when the read above says so.

## Fundamentals for every artifact

**Honor what's already there** Look for an existing design system first — CLAUDE.md, a tokens or theme file, existing component styles. When one exists, apply it; everything below fills gaps and never overrides. Precedence is always: the user's own words, then the project's existing system, then your choices.

**Ground it in the subject.** If the subject isn't already clear, pin it: one concrete subject, its audience, and the page's single job. The subject's own world — its materials, instruments, vernacular — is where distinctive choices come from. Build with real content throughout, never lorem.

**Pair typefaces** Typography carries the page even when the page isn't about typography. The Artifact CSP blocks font CDNs, so don't link a webfont URL and risk a silent fallback. Instead inline the face as a @font-face data URI. Keep running text near 65 characters wide; set a type scale and stay on it; give headings `text-wrap: balance`, body text room to breathe, and uppercase labels a touch of letter-spacing.

**Choose neutrals, don't default to them.** A pure mid-grey reads as unconsidered; a grey with a slight hue bias toward the page's accent reads as chosen. Pure white and near-black are fine grounds when they suit the subject — the point is that the neutral was picked, not inherited.

**Design both themes.** The page renders in the viewer's theme, and the viewer has three states, not two: an explicit choice stamps `data-theme="dark"` / `data-theme="light"` on the root element, and the default "system" setting stamps *nothing* — most viewers see the un-stamped document, where only `prefers-color-scheme` separates light from dark. Structure the CSS token-level for all three: the bare `:root` block defines the complete light palette (for a deliberately dark-first design, swap light and dark consistently through this whole pattern); `@media (prefers-color-scheme: dark)` redefines only the tokens, guarded as `:root:not([data-theme="light"])` so an explicit light choice beats a dark OS; `:root[data-theme="dark"]` redefines them again so the toggle also wins in the other direction. Style components through the tokens, never directly inside a media or `[data-theme]` block — a color whose only definition sits behind `[data-theme]` never applies in the un-stamped state, and the page renders one theme's text on the other theme's ground. Two more rules keep each theme resolving as a set: the artifact composites over a ground the viewer paints in *its* theme, so `body` must set an explicit `background` from a token — a transparent body silently borrows the host's ground; and every element that sets a color takes it from the same token set as the surface behind it, never a literal that only works in one theme. Before publishing, scan the stylesheet for any color declared only inside a media or `[data-theme]` block — that is the classic unreadable-artifact bug. Give the second theme the same care as the first — don't naively invert; keep contrast legible and the accent working on both grounds. A design that deliberately commits to one visual world (a neon arcade screen, a letterpress invitation) may stay single-theme — then skip the media query and stamps entirely but still paint the background and every color explicitly, so the page holds on either host ground; make it a choice, not an omission.

**Let layout do the spacing.** Lay out sibling groups with flex or grid and `gap`, not per-element margins that silently collapse or double. Wide content — tables, code, diagrams — gets `overflow-x: auto` on its own container so the page body never scrolls sideways. Reach for `font-variant-numeric: tabular-nums` wherever digits line up in columns.

**Avoid AI-generated design** AI-generated design currently clusters around a few looks: warm cream (#F4F1EA) with a serif display and terracotta accent; near-black with a lone acid-green or vermilion pop; broadsheet hairline rules with dense columns; a purple-to-blue gradient hero on white; Inter or Space Grotesk as the "safe" face; emoji as section markers; everything centered; `rounded-lg` everywhere; accent bar/rail on rounded cards. Where the user pins down a visual direction, follow it exactly — their words always win, including when they ask for one of these looks. Where nothing is specified, don't spend that freedom on one of these defaults.

**Build cleanly** Be cognizant of overlapping elements, cascade collisions, silent font fallbacks; visual bugs hide in the gap between source and output. Close every non-void element, double-quote attributes, give keyboard focus a visible state, respect `prefers-reduced-motion`. For generative or decorative graphics, reach for Canvas or WebGL rather than hand-authoring long SVG path data.

**CSS rules** When writing the CSS, watch your selector specificities. It is easy to generate classes that cancel each other out — a type-based selector like `.section` fighting an element-based one like `.cta` over padding and margins between sections. Structure the cascade so it doesn't silently undo your spacing.

**Writing the copy** Words are design material, not decoration. Write from the user's side of the screen — name things by what people recognize, not how the system is built (a person manages *notifications*, not *webhook config*). Active voice; a control says exactly what happens ("Publish", then a toast that says "Published"). Errors explain what went wrong and how to fix it — no apologies, no vagueness. Specific beats clever.

**Structure is information** Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

**When it's a UI, not a document** A dashboard or tool is scanned and operated, not read top-to-bottom, so the craft shifts from typography to information design. Surface the summary before the detail; encode state in form as well as number — a pill, a chip, a severity stripe — so what needs attention reads at a glance. Semantic color (good / warning / critical) is separate from the accent hue and doesn't count as your accent. Give sparklines and charts the same care as type: an area fill, a faint grid, an emphasized endpoint. What's interactive should look interactive.



## Process

Before writing code, sketch a short design plan — a compact token system with color, type, and layout:
- **Color**: describe the palette as 4–6 named hex values.
- **Type**: typefaces for 2+ roles — a characterful display face used with restraint, a complementary body face, and a utility face for captions or data if needed.
- **Layout**: a layout concept in one or two sentences.

Then build, following the plan and deriving every color and type decision from it.

## When the request is editorial

The stance shifts: the client has already rejected proposals that felt templated, and is paying for a distinctive point of view. Make opinionated calls, and take one real aesthetic risk where it serves the work.

Review the design plan against the subject before building: if any part of it reads like the generic default you would produce for any similar page, revise that part, and note what you changed and why. Only after you've confirmed the plan's uniqueness do you write the code, following the revised plan exactly.

**Principles** 

- The hero is a thesis: open with the most characteristic thing in the subject's world — headline, image, live demo, interactive moment. 
- Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content. 
- Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated. 
- Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.
- Spend your boldness in one place; keep everything around it quiet. If the accent fights the ground, shift it toward analogous or drop saturation rather than replacing it.


================================================================================
## BLOCO 11 — 8821 chars
================================================================================

══ SEMANA 1 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=—      RPE=5      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         2×5     %1RM=—      RPE=5      → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         1×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         4×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Gauges  Supino Pausado (Competição)         1×7     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Gauges  Supino Pausado (Competição)         4×3     %1RM=—      RPE=4      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   1×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         1×7     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              1×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE

══ SEMANA 2 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=—      RPE=5      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         2×5     %1RM=—      RPE=5.5    → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         1×3     %1RM=—      RPE=6.5    → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         4×3     %1RM=—      RPE=6.5    → SEM CARGA: descoberta por RPE
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=76%    RPE=6.5    → 182,5 kg (TM 240)
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=70%    RPE=7      → 150 kg (TM 215)
  Gauges  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=6.5    → 112,5 kg (TM 160)
  Gauges  Supino Pausado (Competição)         4×3     %1RM=—      RPE=5      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   1×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         1×7     %1RM=—      RPE=6.5    → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              1×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE

══ SEMANA 3 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         2×5     %1RM=—      RPE=6      → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         1×1     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Força   Supino Pausado (Competição)         4×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=76%    RPE=6.5    → 182,5 kg (TM 240)
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=70%    RPE=8      → 150 kg (TM 215)
  Gauges  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=7      → 112,5 kg (TM 160)
  Gauges  Supino Pausado (Competição)         4×3     %1RM=—      RPE=5      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   1×1     %1RM=—      RPE=8      → SEM CARGA: descoberta por RPE
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Agacho  Supino Pausado (Competição)         1×7     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              1×1     %1RM=—      RPE=8      → SEM CARGA: descoberta por RPE
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=—      RPE=7      → SEM CARGA: descoberta por RPE

══ SEMANA 4 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=62%    RPE=8      → 132,5 kg (TM 215)
  Agacho  Supino Pausado (Competição)         3×5     %1RM=72%    RPE=7.5    → 117,5 kg (TM 160)
  Força   Supino Pausado (Competição)         1×1     %1RM=86%    RPE=7.5    → 137,5 kg (TM 160)
  Força   Supino Pausado (Competição)         4×3     %1RM=82%    RPE=9.5    → 130 kg (TM 160)
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=76%    RPE=6.5    → 182,5 kg (TM 240)
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=70%    RPE=8      → 150 kg (TM 215)
  Gauges  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=7.5    → 112,5 kg (TM 160)
  Gauges  Supino Pausado (Competição)         4×3     %1RM=62%    RPE=6      → 100 kg (TM 160)
  Agacho  Agachamento Low Bar (Profundidade   1×1     %1RM=86%    RPE=8      → 182,5 kg (TM 215)
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=82%    RPE=9.5    → 177,5 kg (TM 215)
  Agacho  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=7.5    → 112,5 kg (TM 160)
  Terra   Terra Sumo (Sem Strap)              1×1     %1RM=86%    RPE=8      → 205 kg (TM 240)
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=82%    RPE=9.5    → 197,5 kg (TM 240)

══ SEMANA 8 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=63.5%  RPE=8      → 137,5 kg (TM 215)
  Agacho  Supino Pausado (Competição)         4×5     %1RM=73.5%  RPE=7.5    → 120 kg (TM 160)
  Força   Supino Pausado (Competição)         1×1     %1RM=87.5%  RPE=7.5    → 140 kg (TM 160)
  Força   Supino Pausado (Competição)         4×3     %1RM=82%    RPE=9.5    → 130 kg (TM 160)
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=76%    RPE=6.5    → 182,5 kg (TM 240)
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=70%    RPE=8      → 150 kg (TM 215)
  Gauges  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=7.5    → 112,5 kg (TM 160)
  Gauges  Supino Pausado (Competição)         4×3     %1RM=65%    RPE=6      → 105 kg (TM 160)
  Agacho  Agachamento Low Bar (Profundidade   1×1     %1RM=88%    RPE=8      → 187,5 kg (TM 215)
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=82%    RPE=9.5    → 177,5 kg (TM 215)
  Agacho  Supino Pausado (Competição)         2×7     %1RM=70%    RPE=7.5    → 112,5 kg (TM 160)
  Terra   Terra Sumo (Sem Strap)              1×1     %1RM=88%    RPE=8      → 210 kg (TM 240)
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=82%    RPE=9.5    → 197,5 kg (TM 240)

══ SEMANA 16 ────────────────────────────────────────
  Agacho  Agachamento Low Bar (Profundidade   2×3     %1RM=66%    RPE=8      → 142,5 kg (TM 215)
  Agacho  Supino Pausado (Competição)         4×5     %1RM=78%    RPE=8      → 125 kg (TM 160)
  Força   Supino Pausado (Competição)         1×1     %1RM=92%    RPE=8      → 145 kg (TM 160)
  Força   Supino Pausado (Competição)         4×3     %1RM=86%    RPE=9.5    → 137,5 kg (TM 160)
  Força   Terra Sumo (Sem Strap)              1×5     %1RM=76%    RPE=6.5    → 182,5 kg (TM 240)
  Força   Terra Sumo (Sem Strap)              3×3     %1RM=65%    RPE=6      → 155 kg (TM 240)
  Gauges  Agachamento Low Bar (Profundidade   1×7     %1RM=70%    RPE=8      → 150 kg (TM 215)
  Gauges  Supino Pausado (Competição)         1×7     %1RM=70%    RPE=8      → 112,5 kg (TM 160)
  Gauges  Supino Pausado (Competição)         4×3     %1RM=67%    RPE=6      → 107,5 kg (TM 160)
  Agacho  Agachamento Low Bar (Profundidade   1×1     %1RM=92%    RPE=8      → 197,5 kg (TM 215)
  Agacho  Agachamento Low Bar (Profundidade   4×3     %1RM=86%    RPE=9.5    → 185 kg (TM 215)
  Agacho  Supino Pausado (Competição)         3×7     %1RM=70%    RPE=8      → 112,5 kg (TM 160)
  Terra   Terra Sumo (Sem Strap)              1×1     %1RM=92%    RPE=8      → 220 kg (TM 240)
  Terra   Terra Sumo (Sem Strap)              3×3     %1RM=86%    RPE=9.5    → 207,5 kg (TM 240)

================================================================================
## BLOCO 12 — 8700 chars
================================================================================

836	## 6. TERRA SUMO vs CONVENCIONAL
837	
838	### 6.1 Convencional como ACESSÓRIO para quem compete sumo
839	
840	[GERAL] **O título do vídeo âncora (R88, *"Why EVERY POWERLIFTER should DEADLIFT CONVENTIONAL"*) é
841	enganoso, e a primeira frase do próprio vídeo desfaz o mal-entendido.** Transcrição literal
842	(R88, [00:00]):
843	
844	> *"Everybody should pull conventional. I mean, **you can still pull sumo in competition or whatever if
845	> you're stronger**. But even if you pull sumo, you should do some *training* conventional."*
846	
847	→ **É tese sobre VOLUME DE TREINO, não sobre ESTILO DE COMPETIÇÃO.** Ele **nunca**, em nenhum ponto do
848	canal, recomenda que um puxador de sumo compita em convencional. [GERAL] A posição de competição é o
849	oposto e é explícita: *"se você é melhor em alguma coisa, faça na competição — não fazer é burrice"*
850	(R172).
851	
852	[GERAL] **Percentual de volume: 20–25% do volume de terra em convencional ou variações**
853	(stiff-legged, RDL, snatch grip) para quem puxa sumo (R88 [02:02]). Reafirmado em R20 e R11.
854	⚠️ **Marcador de confiança:** *"Os 20–25% — só R88. **Nunca repetido com número em outro vídeo.**"*
855	(`synth/tech_deadlift.md` §6).
856	Precedente [PESSOAL]: adicionou **1 série de convencional nos dias secundários = 1/6 do volume**
857	(R104 [01:00]).
858	
859	[GERAL] **Propósito — dois benefícios que o sumo não entrega, mas que transferem para o sumo E para o
860	agacho (R88):**
861	1. **Extensores espinhais.** O convencional os carrega mais porque o tronco fica mais inclinado. São
862	   fator limitante nos dois grandes: no agacho, *"a extensão de joelho satura primeiro e você se
863	   inclina mais para usar extensão de quadril, mas o peito colapsa antes de esgotar a força de
864	   extensão de quadril — logo extensores espinhais mais fortes = mais agacho"* (R88 [00:31]).
865	2. **Aprender o "hinge"** — dobrar no quadril com flexão espinhal e de joelho mínima ou nula
866	   (R88, R11). Previne o erro de **"squatting your deadlift"**, válido em sumo e convencional, que
867	   *"arruína o equilíbrio sobre o meio do pé e impede usar a cadeia posterior"* (R88, R11, R123).
868	
869	[GERAL] **A assimetria é o núcleo e é explícita (R88 [02:32]):** *"Should conventional pullers try
870	sumo? My answer is **no**. We do conventional because it can work things that sumo doesn't. What does
871	sumo work that conventional doesn't? **Your quads.**"* — e quadríceps já é coberto pelo agacho.
872	Reforço: **não há diferença de engajamento de nenhum músculo do quadril entre sumo e convencional**;
873	"sumo usa mais quadril" é suposição derivada da posição aberta das pernas (R88 [03:03]).
874	
875	[GERAL] **Tier list (R107):** convencional para quem puxa sumo = **B tier**; sumo para quem puxa
876	convencional = **D tier**; trap bar = **F tier**.
877	
878	[GERAL] **Intensidade da dose (refinamento recente, R11 [02:36]):** programa os hinges em **RPE 4–5**,
879	porque *"o objetivo é praticar a habilidade — pesado demais faz o corpo transformar naturalmente num
880	movimento mais convencional"*. ⚠️ Afirmado **uma vez** (`synth/tech_deadlift.md` §6).
881	
882	[GERAL] **Escolha da variação por alavanca (R11 [02:05–02:36], R107, R121 [02:35]):**
883	**braços longos → stiff-legged** (consegue manter hinge estrito na amplitude completa);
884	braços curtos / hinge pior → **RDL**. → Para este atleta (envergadura 184, índice +6), o corpus indica
885	**stiff-legged**.
886	
887	[GERAL] **Exceções que dispensam o trabalho:** (a) quem é *"menos bem construído para o terra"* já se
888	inclina mais no puxo principal, logo já pratica hinge naturalmente (R11 [03:37]); (b) quem é sensível
889	à fadiga / limitado pela lombar — *"RDL/stiff carregam demais as costas; melhor gastar o volume
890	disponível em skill work mais específico"* (R107 [03:10], R11 [04:07]).
891	
892	⚠️ **Contraponto mais recente e importante [PESSOAL] (R4 [06:07]):** ele **tirou o stiff-legged do
893	próprio programa**. *"Adicionou achando que faltava treino de hinge para destravar o terra, concluiu
894	que **não era o caso** — em ciclos anteriores dava para perceber imediatamente a falta (o movimento
895	parecia estranho e a força subia rápido conforme recuperava a habilidade), e desta vez isso não
896	aconteceu. Conclusão: **melhor fazer mais prática de sumô**."* → **Não é revogação da regra geral**
897	(R20 e R11, recentes, reafirmam R88), mas define o critério de corte: se após um ciclo o convencional
898	não dá sinal (nem força própria, nem destravamento do sumo), **cortar e voltar à especificidade**.
899	
900	### 6.2 Straps — quando usar, quando não
901	
902	[GERAL] *"**Uso mínimo de straps**, para colher o máximo de estímulo de pegada"* (R42 [00:02]).
903	*"Straps arruínam a força de pegada se usados demais; use o mínimo possível **sem destruir as mãos**"*
904	(R108 [03:51]).
905	
906	[GERAL] *"**Se usar straps, ainda assim agarre a barra com força**, para não cortar amplitude
907	artificialmente e transformar o movimento em algo parecido com um block pull"* (R42 [00:02]).
908	
909	[GERAL] **Ciclo vicioso a evitar (R42 [01:33]):** *"mãos machucadas fazem você instintivamente não
910	agarrar tão forte ou usar mais straps por dor, o que reduz o estímulo de pegada e agrava o problema."*
911	
912	[GERAL] **Por que straps inflam o número — o mecanismo (R174 [02:48]):** *"com straps a barra fica
913	praticamente **pendurada fora da mão**, cortando ainda mais amplitude."*
914	
915	### 6.3 ⚠️ O terra dele pode estar inflado — o cálculo do corpus
916	
917	[GERAL] **Somatório (R174 [02:48]):** *"barra whippy + anilhas grossas + straps, é quase como fazer um
918	**block pull de algumas polegadas** em vez de puxar do chão."*
919	
920	Componentes, um a um:
921	- [GERAL] *"A barra de competição (ao menos no IPF) é stiff e quase não whipa nem com **700 lb**; uma
922	  barra comercial padrão com 700 lb whipa muito e **corta bastante amplitude**"* (R174 [02:15]).
923	- [GERAL] *"As anilhas de academia são relativamente grossas, então o peso fica bem para fora, o que
924	  causa ainda mais whip; **as anilhas mais externas continuam tocando o chão enquanto você tira o whip
925	  da barra**, então você não levanta todo o peso de uma vez — ganha momento e corta amplitude da
926	  posição inicial"* (R174 [02:15]).
927	- [GERAL] *"O **bar whip vira fator por volta de um terra de 400 lb** — por isso a especificidade de
928	  equipamento é mais importante no terra do que em qualquer outro lift"* (R98 [02:38]).
929	  ⚠️ Marcador: anedota pessoal (*"foi onde eu mesmo notei"*).
930	- [GERAL] Plataformas macias fazem os pés afundarem e as anilhas assentarem em covas, criando efeito de
931	  **déficit** (R55, R24).
932	
933	[PESSOAL] **A magnitude medida nele mesmo (R174 [01:41]):** melhor terra **em competição: 672 lb**;
934	na academia já fez **700 lb × 5**, **765 lb × 1** e tirou **805 lb do chão** — *"um **gap de 100 lb**"*.
935	[PESSOAL] E ele **prefere** o número de competição: *"considera o levantamento de 672 lb em competição,
936	com setup calibrado e profundidade, mais impressionante que o 700 lb double da academia"*
937	(R174 [05:33], BAIXA por ASR ambíguo).
938	
939	[GERAL] **A consequência prática (R174 [03:18]):** *"muita gente treina com straps, barra comercial e
940	anilhas de libra, e depois é **inesperadamente 'stapled' na competição** sem entender o que
941	aconteceu."*
942	
943	[GERAL] **R175 [15:21]:** *"Parte enorme dos números altos de academia vem do **padrão rebaixado**:
944	barra flexível, anilhas em libras desgastadas que não pesam o que dizem, alças no terra — versus barra
945	rígida, anilhas calibradas, sem alças, profundidade correta e pausa completa de competição."*
946	
947	> **Consequência de programa (`synth/tech_deadlift.md` §7.2, advertência marcada como "a mais
948	> importante deste caso"):** *"Ele nunca competiu. Pelo argumento de R174, os 260–270 kg de sumo podem
949	> estar **inflados por equipamento**, e a partir de ~400 lb o whip já é fator (R98). **Antes de
950	> comparar estilos, valide o sumo no padrão de competição** — barra stiff, anilhas calibradas, sem
951	> straps, sem touch and go, com hold no lockout. Comparar um sumo inflado contra um convencional novo
952	> **enviesa o teste na direção errada**."*
953	
954	[GERAL] Regra de execução que faz parte da validação: **não fazer touch and go nem afrouxar entre
955	reps** — resetar a posição a cada repetição (R77 [01:34]; R123 [00:30]).
956	
957	### 6.4 Antropometria: o que favorece sumo vs convencional — e o desmonte da leitura popular
958	
959	⚠️ **Esta é a seção onde o corpus mais contraria a intuição comum.** Reconstrução literal de
960	`synth/tech_deadlift.md` §7.1:

================================================================================
## BLOCO 13 — 8167 chars
================================================================================

1	import { getRPEColor, getRIRText } from '../../../domain/rpe';
2	import { calculateE1RM } from '../../../utils/calculations';
3	import { useStorage } from '../../../contexts/StorageContext';
4	import type { ExerciseLog } from '../../../types';
5	
6	const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
7	
8	interface SetEditSheetProps {
9	  exercise: ExerciseLog;
10	  setIdx: number;
11	  editWeight: number;
12	  editReps: number;
13	  editRPE: number;
14	  onWeightChange: (w: number) => void;
15	  onRepsChange: (r: number) => void;
16	  onRPEChange: (rpe: number) => void;
17	  onSave: () => void;
18	  onClose: () => void;
19	}
20	
21	export function SetEditSheet({
22	  exercise,
23	  setIdx,
24	  editWeight,
25	  editReps,
26	  editRPE,
27	  onWeightChange,
28	  onRepsChange,
29	  onRPEChange,
30	  onSave,
31	  onClose,
32	}: SetEditSheetProps) {
33	  const storage = useStorage();
34	  const editE1RM = editWeight > 0 && editReps > 0 ? calculateE1RM(editWeight, editReps, editRPE) : 0;
35	  const editRecord = storage.getRecordForExercise(exercise.exerciseId);
36	  const editWouldBePR = editE1RM > (editRecord?.e1rm || 0) && editE1RM > 0;
37	
38	  return (
39	    <div className="fixed inset-0 z-50 flex items-end justify-center">
40	      {/* Backdrop */}
41	      <div
42	        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
43	        onClick={onClose}
44	      />
45	
46	      {/* Sheet */}
47	      <div
48	        className="relative w-full max-w-lg bg-bg-card border-t border-border rounded-t-2xl p-4 space-y-4 animate-slide-up"
49	        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
50	      >
51	        {/* Handle */}
52	        <div className="flex justify-center">
53	          <div className="w-10 h-1 bg-border rounded-full" />
54	        </div>
55	
56	        {/* Header */}
57	        <div className="text-center">
58	          <div className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
59	            Editar Série {setIdx + 1}
60	          </div>
61	          <div className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">
62	            {exercise.exerciseName}
63	          </div>
64	        </div>
65	
66	        {/* Weight input */}
67	        <div>
68	          <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
69	            PESO (KG)
70	          </label>
71	          <div className="flex items-center gap-2">
72	            <button
73	              type="button"
74	              onClick={() => onWeightChange(Math.max(0, editWeight - 2.5))}
75	              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
76	            >
77	              −
78	            </button>
79	            <input
80	              type="number"
81	              inputMode="decimal"
82	              value={editWeight || ''}
83	              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
84	              className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
85	              onFocus={(e) => e.target.select()}
86	            />
87	            <button
88	              type="button"
89	              onClick={() => onWeightChange(editWeight + 2.5)}
90	              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
91	            >
92	              +
93	            </button>
94	          </div>
95	        </div>
96	
97	        {/* Reps input */}
98	        <div>
99	          <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
100	            REPS
101	          </label>
102	          <div className="flex items-center gap-2">
103	            <button
104	              type="button"
105	              onClick={() => onRepsChange(Math.max(1, editReps - 1))}
106	              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
107	            >
108	              −
109	            </button>
110	            <input
111	              type="number"
112	              inputMode="numeric"
113	              value={editReps || ''}
114	              onChange={(e) => onRepsChange(parseInt(e.target.value) || 0)}
115	              className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
116	              onFocus={(e) => e.target.select()}
117	            />
118	            <button
119	              type="button"
120	              onClick={() => onRepsChange(editReps + 1)}
121	              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
122	            >
123	              +
124	            </button>
125	          </div>
126	        </div>
127	
128	        {/* RPE selector */}
129	        <div>
130	          <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
131	            RPE
132	          </label>
133	          <div className="flex flex-wrap gap-1.5">
134	            {RPE_VALUES.map((rpe) => {
135	              const isSelected = editRPE === rpe;
136	              return (
137	                <button
138	                  key={rpe}
139	                  type="button"
140	                  onClick={() => onRPEChange(rpe)}
141	                  className={`min-w-[42px] h-11 rounded-lg font-mono text-sm font-bold transition-all ${
142	                    isSelected
143	                      ? `${getRPEColor(rpe)} ring-2 ring-white/30 scale-105`
144	                      : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
145	                  }`}
146	                >
147	                  {rpe}
148	                </button>
149	              );
150	            })}
151	          </div>
152	          <div className="text-xs font-mono text-text-muted mt-1.5 text-center">
153	            {getRIRText(editRPE)}
154	          </div>
155	        </div>
156	
157	        {/* e1RM preview */}
158	        {editE1RM > 0 && (
159	          <div className={`text-center py-2 rounded-lg ${
160	            editWouldBePR ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-bg-tertiary'
161	          }`}>
162	            <span className="text-xs font-display text-text-muted uppercase tracking-wider">
163	              e1RM:{' '}
164	            </span>
165	            <span className={`text-xl font-mono font-bold ${
166	              editWouldBePR ? 'text-accent-gold' : 'text-text-primary'
167	            }`}>
168	              {editE1RM.toFixed(1)}
169	            </span>
170	            {editWouldBePR && (
171	              <span className="text-xs font-display text-accent-gold ml-2 uppercase tracking-wider">
172	                NOVO PR!
173	              </span>
174	            )}
175	          </div>
176	        )}
177	
178	        {/* Action buttons */}
179	        <div className="flex gap-2">
180	          <button
181	            onClick={onClose}
182	            className="flex-1 h-12 bg-bg-tertiary border border-border rounded-lg font-display font-semibold text-sm text-text-muted uppercase tracking-wider active:bg-border transition-colors"
183	          >
184	            Cancelar
185	          </button>
186	          <button
187	            onClick={onSave}
188	            disabled={editWeight <= 0 || editReps <= 0}
189	            className={`flex-1 h-12 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all ${
190	              editWeight <= 0 || editReps <= 0
191	                ? 'bg-bg-tertiary text-text-muted'
192	                : 'bg-accent-gold text-black active:scale-[0.98]'
193	            }`}
194	          >
195	            Salvar
196	          </button>
197	        </div>
198	      </div>
199	    </div>
200	  );
201	}
202	

================================================================================
## BLOCO 14 — 7789 chars
================================================================================

**564 mil palavras persistidas em disco.** A conversa em si só carrega o que eu te reportei — a compactação perde narrativa, não conhecimento.

## Prompt de compactação

Cole isto:

```
Compacte esta conversa preservando o seguinte, e descartando o resto
(relatórios intermediários de agentes, status de progresso, narrativa de
depuração do pipeline):

## O QUE ESTAMOS FAZENDO
Construir o melhor programa de treino possível para o usuário: powerlifter
natural brasileiro mirando IPF, quer estética junto (powerbuilding, 80/20 a
favor da força). Fase atual: toda a pesquisa terminou; falta MONTAR O PROGRAMA.

## ONDE ESTÁ TUDO (nada precisa ser refeito)
Base em /private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/
- corpus/      178 vídeos do canal Matt Vena transcritos (Whisper large-v3-turbo
               nos 80 de ASR ruim). Nome = NNN_videoid.md, NNN = recência (001 = mais novo)
- extract/     18 lotes, 3.154 claims estruturadas, formato
               [R<recência>] TOPICO | [PESSOAL|GERAL] afirmação | números | timestamp | ALTA|BAIXA
- synth/       13 sínteses por tópico (84k palavras): freq_volume, intensity_reps,
               exercise, tech_squat, tech_bench, tech_deadlift, periodizacao,
               nutricao_peso, cardio_recuperacao, lesao, evolucao, mentalidade, diversos
- kb/          344k palavras de pesquisa: elite_pana, elite_ipf_roster (14 atletas),
               coach_frameworks (9 frameworks), natural_powerbuilding, ipf_reality
               (recordes + regras 2026), video_squat, video_bench, grip_measurement
Regra de resolução usada em todo o material: em contradição, o MAIS RECENTE vence
(R menor = mais novo), mas a contradição fica registrada.

## PERFIL DO USUÁRIO
28a, 178cm, 87kg, ~15% BF. Nunca competiu. 11 anos treinando, ~10 deles em
programas de bodybuilding (Nippard powerbuilding, PHAT), último ano app Evolve.
Antropometria: braçada 184 (índice +6), altura sentado 98 (55,1% — tronco longo),
fêmur 44 (24,7% — curto), fêmur:tíbia 1,04, úmero 31, antebraço 25 (razão 1,24 —
úmero longo), ombro 48, quadril 37, tornozelo 24, punho 18.
Marcas declaradas: agacho 250 low bar, supino 173 (170 real), terra 260-270 sumo.
Total ~683 kg = DOTS 449, GL 92,3.
PORÉM OS TRÊS ESTÃO INFLADOS vs padrão de competição: agacho falha profundidade
IPF por 4-8cm (pin squat, 3 reps analisadas), supino sem pausa (0,20s no fundo),
terra possivelmente com whip+anilha grossa+straps.
Lesão de peitoral perto da inserção no úmero há 4 meses, "zerado". Coincidiu com
abrir a pegada +4,7cm (de ~69,9 para os 65,2cm atuais — medidos por invariante
projetivo, erro <0,01%; 1,36× a largura de ombro; legal com folga).
Achado do vídeo de supino: ele segura ~11s em lockout antes de descer.
Academia: rack, barra olímpica de marcação dupla, halteres até 40kg, puxada,
leg press 45° e vertical, SEM GHD, mesa flexora DESCONHECIDA. Vai para a IronBerg
em ~6 meses. Sono 8h bom, trabalho fisicamente pesado, TDAH medicado (melhorou
performance). 2600 kcal, 220g proteína (2,53 g/kg). Sem pré-treino. Sem competição
marcada. Escolhas dele: 80/20 força, foco em construir sem data, low bar + sumo,
disse "posso treinar o quanto precisar" (risco de excesso, não vantagem).

## ACHADOS QUE CUSTARAM CARO — NÃO REDESCOBRIR
1. TRAJETÓRIA VENA: SS → Búlgaro → programação própria (terminou em 680kg de
   total) → alta freq + volume alto (680 → ~840kg) → platô 38 meses → volume
   mínimo → hoje 951kg. O USUÁRIO ESTÁ NO LIMIAR FASE 2/3 (683 vs 680kg).
   O que veio a seguir para Vena foi alta frequência com volume alto submáximo.
2. ARMADILHA: copiar o programa ATUAL do Vena (5 séries/sem de agacho e terra)
   é erro — é estratégia de reparo de quem teve capacidade de trabalho destruída
   por 3 anos de lesão, não o que o construiu.
3. CONVERGÊNCIA QUÁDRUPLA de frequência (Vena + 14 elites IPF + meta-análises +
   9 frameworks): agacho 2-3x, supino 3-4x, terra 1-2x/semana.
4. QUATRO CORREÇÕES a leituras erradas por título (verificadas no transcript):
   - "RPE IS FOR P*SSIES" é irônico — ele DEFENDE RPE, credita Tuchscherer
   - Ele NÃO migrou para high bar — compete low bar (abertura 360kg), high bar
     é ~50% do volume de TREINO. High bar p/ quem compete low bar = S tier
   - "Every powerlifter should deadlift CONVENTIONAL" é sobre VOLUME DE TREINO
     (20-25%), não estilo de competição. Regra de competição dele é o oposto
   - Pana puxa CONVENCIONAL, não sumo
5. "RIDE THE LINE" substitui deload: oscilação pequena permanente ancorada abaixo
   do teto. O "nunca deload" é sobre meio de bloco; ele faz taper de 2sem antes
   de todo teste/meet.
6. REGRA DE SEGURANÇA (lesão): uma variável por levantamento; mudanças de forma
   vão no SETUP, nunca sob carga; mover pegada devagar. O usuário tem fila grande
   de mudanças e empilhá-las repetiria o erro que o machucou.
7. IPF 2026: barra do agacho não abaixo do deltoide posterior (low bar extremo
   ilegal); lockout do terra geométrico; DQ por thrust de tronco no supino;
   pesagem 2h antes SEM provisão de 24h (zero water cut); NÃO existe 4ª tentativa.
8. Recorde mundial 93kg = 927,5kg (356/246/380). Tiers GL: nacional BR 85-95,
   campeão BR 100, melhor brasileiro da história 105, pódio mundial 110, WR 122,4.
   Elites progridem ~20kg de total/ano por uma década.
9. Base do powerbuilding: força é indiferente à proximidade da falha e exige >80%;
   hipertrofia melhora perto da falha e cresce em qualquer carga. Logo: básicos
   pesados e longe da falha; acessórios leves e perto da falha.
10. Volume: sempre normalizar séries/semana por RIR (as 42 séries de supino do
    Vena são a 12-15 RIR).

## PRÓXIMO PASSO
Montar o programa, usando as respostas do usuário às perguntas em aberto.
```

---

## Perguntas em aberto

Junto tudo o que ficou pendente. Responda no ritmo que der — só as **1 a 4** bloqueiam o desenho do programa.

**1. Disponibilidade real.** Você disse "o quanto precisar". Preciso de número honesto e sustentável por 16 semanas seguidas, contando trabalho pesado: quantos dias/semana e quantos minutos por sessão?

**2. Mesa flexora.** Sua academia tem? É o único item do arsenal dele sem substituto — o agachamento não treina isquiotibiais, e você puxa sumo.

**3. Equipamento que você já tem:** cinto? magnésio/chalk? sapato de levantamento? joelheira? munhequeira?

**4. Histórico de carga.** Tem os números do último ano (app Evolve ou planilha)? Saber que carga e volume você vinha tolerando muda o ponto de partida — sem isso eu tenho que ser conservador.

**5. Vídeos que faltam** (não bloqueiam, mas mudam decisões):
- Agachamento **de trás, 45°, altura do ombro** → decide a regra de barra IPF 2026
- Agachamento **livre, sem pino, de lado**, série pesada → profundidade real, base, sticking point
- Supino **dos pés olhando para a cabeça** → assimetria (seu lado direito está invisível nos dois vídeos, e a lesão foi unilateral)

**6. Pegada com fita:** distância entre os indicadores e entre os dois anéis. Só para confirmar os 65,2 cm.

**7. Creatina** — toma? Se sim, qual marca e tem selo de teste de terceiros?

**8. Outras dores** além do peitoral — joelho, lombar, ombro, cotovelo, punho? Mesmo pequenas.

**9. Classe de peso.** Não precisa decidir agora (o DOTS decide ao longo do caminho), mas: você **tem disposição** para cortar até ~83 kg se os dados apontarem? Ou prefere construir para encher a de 93?

**10. Duas mudanças técnicas que preciso do seu aval, porque são as de maior impacto:**
- Adicionar **high bar como dia secundário** (mantendo low bar no pesado)
- Adicionar **convencional em 20–25% do volume de terra** (mantendo sumo como estilo de competição)

**11. IronBerg** — confirma ~6 meses? Isso define se planejo dois blocos com equipamento limitado ou um só.

================================================================================
## BLOCO 15 — 7247 chars
================================================================================

111	### 1.5 Pino / box — o que a base diz e o que ela NÃO diz
112	
113	**LACUNA CRÍTICA:** **não existe uma única claim sobre "box squat" ou "pin squat/Anderson squat" nos
114	3.154 claims.** Varredura direta em `extract/*.md` por `box squat|pin squat|anderson|caixa|pino`
115	retorna zero. O canal não usa a ferramenta e não a discute. Todo o uso de altura fixa que ele
116	prescreve é **pause livre** (§1.4), nunca dead stop em suporte.
117	
118	O único material adjacente é sobre **altura de rack** (R14): mirar na parte baixa do peito; **sempre
119	errar para baixo**; subir 1–2 polegadas a mais não fatiga, mas rack alto demais obriga a estender
120	demais e perde-se posição e rigidez.
121	
122	[VÍDEO-SQ §3, §8.1] O que ele faz hoje é pin squat com o pino a **~105 cm do solo (±5 cm)**, quando
123	para 178 cm um low bar na profundidade legal fica em **98–103 cm** → **os pinos estão 5–8 cm acima da
124	posição de competição**. *"Ele está treinando uma parcial que para exatamente antes da faixa onde ele
125	é mais fraco e onde a competição é decidida."* Correção do analista: descer o pino **2 furos (5–8 cm)**
126	e recalibrar com vídeo até a dobra do quadril passar visivelmente abaixo do topo da patela; manter o
127	pin squat com o pino **na** profundidade legal ou 2 cm abaixo. Reduzir a pausa no fundo de **3–4 s
128	relaxado** para **1 s com tensão mantida**.
129	
130	**Convergência com o corpus:** a pausa de 3–4 s no pino viola diretamente R124 [01:02] —
131	[GERAL] *"Pausa de 1 segundo é suficiente; mais que isso só limita carga sem ajudar mais na
132	estabilidade — lembre que o tempo passa mais rápido na nossa cabeça enquanto levantamos: contar até 2
133	mentalmente equivale a cerca de 1 segundo real."*
134	
135	### 1.6 Sinais visuais e aferição
136	
137	**LACUNA (explicitada em `synth/tech_squat.md` §5):** *"Como medir a própria profundidade
138	objetivamente — prescreve rigor com profundidade (R115) mas **nunca ensina a aferir**: sem referência
139	a marcadores, ângulo de quadril vs joelho, filmagem lateral na altura correta, ou o que os juízes de
140	fato olham."* Também **LACUNA**: ângulos de tronco em graus (sempre relativo/sensorial, nunca alvo em
141	graus nem método de medir por vídeo).
142	
143	O que existe de aferição vem do relatório de vídeo, não do canal [VÍDEO-SQ §10]:
144	- Câmera **perpendicular, altura do quadril, 3–4 m**, do lado em que o disco NÃO fique entre a câmera
145	  e as costas.
146	- **Short curto e justo** ou marcadores nos pontos ósseos — short folgado custou ±3 cm de incerteza.
147	- Filmar **um top set pesado**, não um set de técnica.
148	- Todo top set filmado de lado, perpendicular, na altura do quadril [VÍDEO-SQ §8.1].
149	
150	### 1.7 Stance, abertura e ângulo de pé para fêmur curto + tronco longo
151	
152	[GERAL] **O teste sem peso é também o seletor de stance:** *"esse mesmo teste serve para achar a
153	largura de postura e o ângulo de pé ótimos: o que permitir agachar mais fundo provavelmente é o
154	melhor"* (R124 [00:00]).
155	
156	[GERAL] **Mito corrigido (R162):** stance mais largo **NÃO** tira carga do joelho para o quadril —
157	mantidos bar placement e profundidade, o momento extensor de joelho é **MAIOR** no stance largo. Como
158	o EMG de quads é idêntico entre stances, a conclusão dele é que **no stance largo os quads estão em
159	posição mais eficiente**. Para a mesma flexão de joelho, stances largos mostram melhor engajamento de
160	glúteo máximo e adutores (R162).
161	
162	[GERAL] *"O stance mais forte para a maioria **não** é estreito com pés para frente, e sim mais
163	aberto, pés mais apontados para fora, quadril mais abduzido e rodado externamente"* (R162).
164	Ressalva: abduzir mais permitiria ficar mais ereto, mas muda o alinhamento das fibras, o que pode ser
165	menos ótimo para produção de força — por isso **não se abduz ao máximo** (R159).
166	
167	[GERAL] Estudos de ativação mostram basicamente **nenhuma diferença** entre larguras; única exceção é
168	glúteo médio, maior no stance largo (R114). Bases largas **não** são necessariamente mais dominantes
169	de quadril, embora frequentemente sejam (R114).
170	
171	[GERAL] Para atingir profundidade o fêmur tem que se mover em **três dimensões**: sentar para trás /
172	hinge, avanço do joelho, e **abdução** (R159).
173	
174	[GERAL — fêmur curto, especificamente] *"Fêmur curto exige **menos movimento** para atingir
175	profundidade (logo **menos inclinação**) e ainda encurta o braço de momento"* (R159). E:
176	*"Squatters de elite super eretos são eretos **por causa das alavancas (fêmures curtos)** — não são
177	bons agachadores por serem eretos"* (R159).
178	
179	**LACUNA:** *"Antropometria quantificada — cita 'fêmur curto'/'fêmur longo' como categorias
180	qualitativas (R82, R159, R169) mas nunca dá razões, proporções ou como medir. Nunca menciona relação
181	fêmur:tíbia nem altura de tronco"* (`synth/tech_squat.md` §5). O mapeamento de "fêmur curto" para
182	"24,7% da altura, fêmur:tíbia 1,04" é **interpretação**, não claim dele.
183	
184	### 1.8 ⚠️ Contradição direta com o enquadramento do perfil
185	
186	O vídeo-bandeira do canal é **"STOP TRYING TO SQUAT UPRIGHT"** (R159), e a tese é que quase todo mundo
187	deveria agachar **mais inclinado**. **Isso não se aplica a este atleta.**
188	
189	[VÍDEO-SQ §4] Ele está a **40° da vertical estando 5–8 cm ACIMA do paralelo**. Se descesse até a
190	profundidade legal com a mesma mecânica, iria a **~50°**. O esperado para as alavancas dele no fundo
191	legal é **30–38°**. *"Ele está agachando ~15° mais inclinado do que suas alavancas exigem… a
192	inclinação dele NÃO é imposta pelas alavancas. É um erro técnico corrigível. Ele está herdando o
193	padrão de quem tem fêmur longo, sem ter fêmur longo."*
194	
195	[GERAL] E a inclinação extra **não está sendo convertida em carga útil** — R159: *"no good morning
196	squat involuntário, joelhos e quadril vão para trás/cima mas **a barra não sobe nem desce** — você não
197	fica nem mais perto nem mais longe de completar o agacho; só transfere carga do joelho para quadril e
198	coluna."* [VÍDEO-SQ §5] mede exatamente isso: joelho abre de ~90° para ~150° com o **tronco parado a
199	40°**; pernas praticamente travadas com o tronco ainda fletido; só no último frame o tronco ergue.
200	
201	**Direção correta do cue, portanto, é a inversa da doutrina do canal.** O princípio que transfere é
202	*"espelhar o ângulo de tronco entre excêntrica e concêntrica — zero mudança de posição"*
203	(R64, R87, R124, R132 [00:30], R159). A **direção** ("incline-se mais") **não** transfere.
204	
205	Cue substituto, este sim do canal e alinhado ao caso — [GERAL] **pensar a partir dos joelhos**: na
206	saída do buraco, empurrar ativamente os **joelhos para frente e para fora**, sem deixá-los recuar.
207	*"O efeito upstream mantém o quadril para frente e sob o corpo e o peito para cima — pensar dos
208	joelhos para cima funciona melhor do que cuear quadril e peito diretamente"* (R168). Manter a posição
209	de joelho é o que permite **dirigir com os quadríceps** através do sticking point (R168).
210	**Cuear "peito para cima" ou "quadril para baixo" é justamente o que ele diz NÃO funcionar** (R168).
211	
212	---
213	
214	## 2. POSIÇÃO DA BARRA
215	

================================================================================
## BLOCO 16 — 7084 chars
================================================================================

1	import type { PreWorkoutSurvey, PostWorkoutSurvey, WorkoutLog } from '../types';
2	
3	const SYSTEM_PROMPT = 'Você é um coach de powerlifting brasileiro. Seja direto, técnico e prático. Máximo 3 parágrafos. Use linguagem de treino de força.';
4	
5	export function buildDailyPrompt(
6	  pre: PreWorkoutSurvey | undefined,
7	  post: PostWorkoutSurvey,
8	  workout: WorkoutLog
9	): { role: 'system' | 'user'; content: string }[] {
10	  const completedSets = workout.exercises.reduce(
11	    (sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0
12	  );
13	  const totalSets = workout.exercises.reduce(
14	    (sum, ex) => sum + ex.sets.length, 0
15	  );
16	
17	  let userContent = `Análise da sessão de treino:\n`;
18	  userContent += `- Tipo: ${workout.dayType}, Bloco: ${workout.blockName} (${workout.blockType})\n`;
19	  userContent += `- Séries completadas: ${completedSets}/${totalSets}\n`;
20	
21	  if (pre && !pre.skipped) {
22	    userContent += `\nPré-treino:\n`;
23	    userContent += `- Sono: ${pre.sleepQuality}/10 (${pre.sleepHours}h)\n`;
24	    userContent += `- Energia: ${pre.energyLevel}/10\n`;
25	    userContent += `- Estresse: ${pre.stressLevel}/10\n`;
26	    userContent += `- Motivação: ${pre.motivation}/10\n`;
27	    if (pre.hasPain && pre.painEntries.length > 0) {
28	      userContent += `- Dor: ${pre.painEntries.map(p => `${p.region} (${p.intensity}/10)`).join(', ')}\n`;
29	    }
30	  }
31	
32	  if (!post.skipped) {
33	    userContent += `\nPós-treino:\n`;
34	    userContent += `- Qualidade: ${post.sessionQuality}/10\n`;
35	    userContent += `- RPE geral: ${post.sessionRPE}/10\n`;
36	    userContent += `- Força percebida: ${post.strengthPerception}\n`;
37	    userContent += `- Aderência ao plano: ${post.planAdherence}\n`;
38	    if (post.adherenceReason) userContent += `- Motivo: ${post.adherenceReason}\n`;
39	    if (post.hasNewPain && post.painEntries.length > 0) {
40	      userContent += `- Nova dor: ${post.painEntries.map(p => `${p.region} (${p.intensity}/10)`).join(', ')}\n`;
41	    }
42	  }
43	
44	  userContent += `\nDê um feedback breve sobre esta sessão. Destaque pontos positivos e alertas.`;
45	
46	  return [
47	    { role: 'system', content: SYSTEM_PROMPT },
48	    { role: 'user', content: userContent },
49	  ];
50	}
51	
52	export function buildWeeklyPrompt(
53	  preSurveys: PreWorkoutSurvey[],
54	  postSurveys: PostWorkoutSurvey[],
55	  workouts: WorkoutLog[]
56	): { role: 'system' | 'user'; content: string }[] {
57	  const activePre = preSurveys.filter(s => !s.skipped);
58	  const activePost = postSurveys.filter(s => !s.skipped);
59	
60	  let userContent = `Resumo semanal (${workouts.length} sessões):\n`;
61	
62	  if (activePre.length > 0) {
63	    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
64	    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
65	    const avgStress = activePre.reduce((s, p) => s + p.stressLevel, 0) / activePre.length;
66	    const avgMotivation = activePre.reduce((s, p) => s + p.motivation, 0) / activePre.length;
67	    userContent += `\nMédias pré-treino: Sono ${avgSleep.toFixed(1)}/10, Energia ${avgEnergy.toFixed(1)}/10, Estresse ${avgStress.toFixed(1)}/10, Motivação ${avgMotivation.toFixed(1)}/10\n`;
68	  }
69	
70	  if (activePost.length > 0) {
71	    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
72	    const avgRPE = activePost.reduce((s, p) => s + p.sessionRPE, 0) / activePost.length;
73	    userContent += `Médias pós-treino: Qualidade ${avgQuality.toFixed(1)}/10, RPE ${avgRPE.toFixed(1)}/10\n`;
74	  }
75	
76	  // Pain frequency
77	  const allPain = [
78	    ...activePre.flatMap(s => s.painEntries),
79	    ...activePost.flatMap(s => s.painEntries),
80	  ];
81	  if (allPain.length > 0) {
82	    const painCount: Record<string, number> = {};
83	    allPain.forEach(p => { painCount[p.region] = (painCount[p.region] || 0) + 1; });
84	    userContent += `Dor reportada: ${Object.entries(painCount).map(([r, c]) => `${r} (${c}x)`).join(', ')}\n`;
85	  }
86	
87	  userContent += `\nAnalise tendências da semana. Destaque progressos e riscos.`;
88	
89	  return [
90	    { role: 'system', content: SYSTEM_PROMPT },
91	    { role: 'user', content: userContent },
92	  ];
93	}
94	
95	export function buildMonthlyPrompt(
96	  preSurveys: PreWorkoutSurvey[],
97	  postSurveys: PostWorkoutSurvey[],
98	  workouts: WorkoutLog[]
99	): { role: 'system' | 'user'; content: string }[] {
100	  const activePre = preSurveys.filter(s => !s.skipped);
101	  const activePost = postSurveys.filter(s => !s.skipped);
102	
103	  let userContent = `Análise mensal (${workouts.length} sessões em ~4 semanas):\n`;
104	
105	  if (activePre.length > 0) {
106	    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
107	    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
108	    const avgStress = activePre.reduce((s, p) => s + p.stressLevel, 0) / activePre.length;
109	    userContent += `Médias do mês: Sono ${avgSleep.toFixed(1)}, Energia ${avgEnergy.toFixed(1)}, Estresse ${avgStress.toFixed(1)}\n`;
110	  }
111	
112	  if (activePost.length > 0) {
113	    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
114	    const avgRPE = activePost.reduce((s, p) => s + p.sessionRPE, 0) / activePost.length;
115	    userContent += `Qualidade média: ${avgQuality.toFixed(1)}, RPE médio: ${avgRPE.toFixed(1)}\n`;
116	  }
117	
118	  userContent += `\nAnalise tendências do mesociclo. Recomende ajustes para o próximo bloco.`;
119	
120	  return [
121	    { role: 'system', content: SYSTEM_PROMPT },
122	    { role: 'user', content: userContent },
123	  ];
124	}
125	
126	export function buildQuarterlyPrompt(
127	  preSurveys: PreWorkoutSurvey[],
128	  postSurveys: PostWorkoutSurvey[],
129	  workouts: WorkoutLog[]
130	): { role: 'system' | 'user'; content: string }[] {
131	  const activePre = preSurveys.filter(s => !s.skipped);
132	  const activePost = postSurveys.filter(s => !s.skipped);
133	
134	  let userContent = `Análise trimestral do macrociclo (${workouts.length} sessões):\n`;
135	
136	  if (activePre.length > 0) {
137	    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
138	    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
139	    userContent += `Médias gerais: Sono ${avgSleep.toFixed(1)}, Energia ${avgEnergy.toFixed(1)}\n`;
140	  }
141	
142	  if (activePost.length > 0) {
143	    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
144	    userContent += `Qualidade média das sessões: ${avgQuality.toFixed(1)}/10\n`;
145	  }
146	
147	  userContent += `\nFaça uma análise do macrociclo completo. Avalie evolução, pontos fortes, fraquezas e recomendações para o próximo macrociclo.`;
148	
149	  return [
150	    { role: 'system', content: SYSTEM_PROMPT },
151	    { role: 'user', content: userContent },
152	  ];
153	}
154	

================================================================================
## BLOCO 17 — 6624 chars
================================================================================

=== incremento no registro de exercícios ===
77:export function getEquipmentIncrement(equipment: EquipmentType): number {
78-  const increments: Record<EquipmentType, number> = {
79-    barbell: 2.5,
80-    machine: 5,
81-    dumbbell: 2,
82-    bodyweight: 0,
83-  };

=== 2.5 / 2,5 no programa e no validador ===
55:   câmera perpendicular de agacho, micro-anilhas de 1,25 kg (par → 2,5 kg na barra),
92:incremento_minimo_barra_kg  = 2.5
163:`roundGuard` aplicado na grade de 2,5 kg), não sobre o percentual declarado — e é por isso
164:que o piso é **85** e não 86: a grade de 2,5 kg custa até **1,1 pp** no denominador menor
715:| Agachamento High Bar | 2 | 8 | 5 | {AG-V} | {RPE-AG} | 3 MIN | PAPEL VOLUME (70–80% × 5–7), não esforço máximo — é o que justifica 3 MIN e não 5 [desvio da prescrição literal, registrado]. 8 séries = 50,0% das 16 séries de agacho da semana [design §13-B/R7, que mede em SÉRIES]; base: "faz cerca de metade de todo o seu volume de agacho com high bar" [R18 @00:33] [PESSOAL] e "high bar é item fixo nos programas dos clientes dele: todo cliente que agacha low bar também faz high bar" [R18 @00:33] [GERAL]. REGRA DURA DE EXECUÇÃO: "programar o high bar com os mesmos cues do low bar: mesma largura de stance, mesma quantidade de inclinação de tronco — NÃO stance estreito, superereto, com joelhos muito à frente"; o estilo ereto "tem lugar se o objetivo for isolar quads, mas negligencia os extensores de quadril" [R18 @01:34] [GERAL]. POR QUE HIGH BAR AQUI: "mais fácil atingir a profundidade e, por não exigir tanta inclinação de tronco quanto o low bar, mais fácil se manter sobre o meio do pé e equilibrado" [R68 @01:31] [GERAL]. CORREÇÃO MESTRA, METADE 1 — ÂNGULO DE TRONCO: você agacha ~15° mais inclinado do que suas alavancas exigem [VÍDEO-SQ §4] ⚠️ [interpretação] de design §2, não é claim do canal. O princípio que transfere é ESPELHAR: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL], "sem mudança de posição do tronco entre a excêntrica e a concêntrica" [R87 @03:12] [GERAL]. ⚠️ A DIREÇÃO da doutrina do canal ("as pessoas deveriam agachar um pouco mais curvadas", [R159 @05:58]) NÃO se aplica a você — [R159 @04:21] [GERAL]: "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação". E a inclinação extra não vira carga: "no good morning squat involuntário, joelhos e quadril vão para trás e para cima mas a barra não sobe nem desce — só transfere carga do joelho para quadril e coluna" [R159 @02:14] [GERAL]. CORREÇÃO MESTRA, METADE 2 — JOELHOS: "empurrar ativamente os joelhos para frente e para fora, sem deixá-los recuar, resolve grande parte do problema" [R169 @14:14] [GERAL], e "manter a posição de joelho permite dirigir corretamente com os quadríceps através do sticking point" [R168 @01:35] [GERAL]. NÃO cuear "peito para cima" nem "quadril para baixo". REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE: encerre a série na rep que perde a profundidade legal ou em que o tronco muda de ângulo entre descida e subida [R115 @03:05] [GERAL]. ⚠️ PRIORIDADE INVERTIDA NESTA REVISÃO, e o motivo está escrito: se alguma série antes da 8ª chegar ao teto de RPE, CORTE A SÉRIE E ENCERRE O EXERCÍCIO — e congele o degrau de {AG-V} na semana seguinte. A regra anterior mandava completar as 8 séries "porque são o requisito de R7", o que CANCELAVA a regra de parada declarada em §0.1 deste mesmo arquivo e em [R10 @00:34] [GERAL], e prescrevia séries na zona em que a rep sai alta — no exercício escolhido justamente por ser o mais barato para exigir rigor. R7 (~50% do volume de agacho em high bar) é [interpretação] e é cota de CONTAGEM; a profundidade legal é a tese do bloco. Legalidade vence cota. DESCIDA EM VELOCIDADE CONSTANTE: "muita gente acelera no fundo, o que anula o propósito; use uma única velocidade consistente do começo ao fim" [R132 @03:38] [GERAL]. Altura do rack: "mirar na parte baixa do peito" e "é sempre melhor errar para baixo do que para cima" [R14 @00:32, @01:02] [GERAL]. Walkout de 3 passos [R14 @04:36] [GERAL]. ⚠️ 8×5 e não 8×6, E ISSO É DIVERGÊNCIA DECLARADA DA SPEC: `SPEC_REV2` §1.3/D3 e §3.4 prescrevem 8×6 e o entregue é 8×5 — −16,7% de reps do secundário. Nenhum checker acusa porque a métrica travada (R7) é em SÉRIES, e por isso a divergência fica escrita aqui e em §9. Motivo: com 8×6 este vira o maior dia axial da semana, dois dias antes do single primário, e as últimas séries passariam do teto de RPE 8. ⚠️ DESCONTO DE HIGH BAR, DECLARADO PARA QUE A INTENSIDADE REAL SEJA COMPUTÁVEL: {AG-V} é percentual do trainingMax de LOW BAR aplicado ao high bar. Adotado `TM_high_bar ≈ 0,90 × TM_low_bar` [interpretação: NÃO existe número no corpus para high bar dividido por low bar, tecnica §2.5 — 10% é a folclórica do esporte e está aqui como número explícito em vez de número escondido]. Logo os 70–74% desta coluna são 77,8–82,2% da capacidade REAL de high bar, e a S16 (74%) sai a ~82% por 5 reps ≈ RPE 9 — ACIMA do teto declarado de 8, em 8 séries semanais. É por isso que a regra de parada aqui é a PROFUNDIDADE e o corte de série acima, e não o RPE. Resolver de verdade exigiria uma âncora própria de high bar, que é número novo e não foi criada |
871:  mais": se a 2ª subir e a 3ª tiver que ser conservadora, o menor passo legal é 2,5 kg.
903:| Agachamento Low Bar (Profundidade Legal) | 5 | 1 | 1 | 88.4% | 7 | 5 MIN | 1ª TENTATIVA — abridor, tem que sair fácil. ⚠️ CORREÇÃO: ele NÃO é mais leve que os 3×2 de D−7 — é 2,5 kg MAIS PESADO (190,0 contra 187,5), e é o único abridor dos três que não foi executado no taper. Trate-o como o que é: uma carga nova, no dia. Se a leitura de D−7 tiver sido dura (RPE 8+ por vídeo), ABRA um incremento abaixo — errar pelo conservador é a regra do dia [R110 @04:06] [GERAL]. Cinto, faixa de joelho, munhequeira. Comandos "Squat" e "Rack" por terceiro. Profundidade legal ou a tentativa não existe [R115] |
908:| Supino Pausado (Competição) | 0 | 1 | 1 | 92.2% | 8 | 5 MIN | 3ª TENTATIVA — ⚠️ O SUPINO NÃO GANHA NADA COM O TAPER: +2,5 kg sobre o melhor single da S16, que é o menor incremento que a academia permite, e é o número de Perkins (±0 a 2,5 kg). ⚠️ GATE DE DOR GOVERNA ESTA TENTATIVA: se houve qualquer evento ≥2/10 no log de peitoral nas duas semanas anteriores, ela NÃO sobe da tabela e o teto de RPE do supino cai de 9,5 para 8,5; se houve evento ≥4/10 ou estiramento agudo, o supino do simulado ENCERRA NA 2ª TENTATIVA. Sem exceção e sem negociação no dia |
84:const BAR_INCREMENT_KG = 2.5;
115:  pico: [85, 92.5],

=== bloco de restrições do programa ===

================================================================================
## BLOCO 18 — 6574 chars
================================================================================

195	  // Roda mesmo que a migração de schema não tenha rodado — dispositivo novo,
196	  // storage limpo, import de backup antigo.
197	  const missingTrainingMax = missingTrainingMaxRefs(
198	    storage.getProfile(),
199	    workout.programId ?? storage.getActiveProgramId(),
200	    workout.exercises,
201	  );
202	
203	  return (
204	    <div ref={containerRef} className="min-h-screen bg-bg-primary pb-4">
205	      <WorkoutHeader
206	        workout={workout}
207	        weekData={weekData}
208	        sessionIndex={sessionIndex}
209	        completedSets={completedSets}
210	        totalSets={totalSets}
211	        progressPercent={progressPercent}
212	        onBack={() => navigate('/')}
213	      />
214	
215	      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
216	        {/* Exercise nav tabs */}
217	        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-4 px-4">
218	          {workout.exercises.map((ex, i) => {
219	            const allComplete = ex.sets.filter(isWorkingSet).every((s) => s.completed);
220	            const isActive = i === activeExIdx;
221	            return (
222	              <button
223	                key={i}
224	                onClick={() => {
225	                  setActiveExIdx(i);
226	                  const nextSet = ex.sets.findIndex((s) => !s.completed);
227	                  setActiveSetIdx(nextSet >= 0 ? nextSet : 0);
228	                  prefillInputs(ex, nextSet >= 0 ? nextSet : 0);
229	                }}
230	                className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-display font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
231	                  ex.skipped
232	                    ? 'bg-bg-tertiary text-text-muted line-through'
233	                    : isActive
234	                    ? 'bg-accent-gold text-black'
235	                    : allComplete
236	                    ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
237	                    : 'bg-bg-card text-text-secondary border border-border'
238	                }`}
239	              >
240	                {ex.supersetGroup ? (
241	                  <span className="flex items-center gap-0.5">
242	                    <span className="text-[9px] text-accent-purple font-mono">
243	                      {ex.supersetGroup}{ex.supersetOrder ?? ''}
244	                    </span>
245	                    {i + 1}
246	                  </span>
247	                ) : (
248	                  i + 1
249	                )}
250	              </button>
251	            );
252	          })}
253	        </div>
254	
255	        <TrainingMaxGate missing={missingTrainingMax} />
256	
257	        {/* Aquecimento geral do programa */}
258	        {!workout.completed && completedSets === 0 && (
259	          <Link
260	            to="/warmup"
261	            className="flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 rounded-lg px-3 py-2 hover:bg-accent-gold/15 transition-colors"
262	          >
263	            <Flame size={15} className="text-accent-gold flex-shrink-0" />
264	            <span className="text-accent-gold text-xs font-display font-semibold tracking-wider uppercase">
265	              Protocolo de aquecimento
266	            </span>
267	          </Link>
268	        )}
269	
270	        {/* Cronômetro de descanso */}
271	        {rest && !workout.completed && (
272	          <RestTimer
273	            targetSec={rest.targetSec}
274	            label={currentExercise?.restLabel}
275	            startedAt={rest.startedAt}
276	            onDismiss={() => setRest(null)}
277	          />
278	        )}
279	
280	        {/* PR Flash */}
281	        {prFlash && <PRFlashBanner exerciseId={prFlash} e1rm={currentE1RM} />}
282	
283	        {/* Active Exercise Card */}
284	        {currentExercise && !currentExercise.skipped && (
285	          <>
286	            <ExercisePrescriptionCard
287	              exercise={currentExercise}
288	              alternatives={currentExercise.variations}
289	              onSwapVariation={swapExerciseVariation}
290	            />
291	            <CompletedSetsList
292	              sets={currentExercise.sets}
293	              exIdx={activeExIdx}
294	              onEditSet={editState.openEditSet}
295	            />
296	            <SetInputForm
297	              exercise={currentExercise}
298	              activeSetIdx={activeSetIdx}
299	              inputWeight={inputWeight}
300	              inputReps={inputReps}
301	              inputRPE={inputRPE}
302	              inputSeconds={inputSeconds}
303	              inputSegments={inputSegments}
304	              inputCompliance={inputCompliance}
305	              suggestion={suggestion}
306	              currentE1RM={currentE1RM}
307	              currentRecord={currentRecord}
308	              wouldBePR={wouldBePR}
309	              onWeightChange={setInputWeight}
310	              onRepsChange={setInputReps}
311	              onRPEChange={setInputRPE}
312	              onSecondsChange={setInputSeconds}
313	              onSegmentChange={updateSegment}
314	              onComplianceChange={updateCompliance}
315	              onCompleteSet={completeSet}
316	            />
317	          </>
318	        )}
319	
320	        {/* Action buttons */}
321	        <div className="flex gap-2">
322	          <button
323	            onClick={() => setShowNotes(!showNotes)}
324	            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-gold transition-colors"
325	          >
326	            Notas
327	          </button>
328	          <button
329	            onClick={skipExercise}
330	            disabled={!currentExercise || currentExercise.sets.filter(isWorkingSet).every((s) => s.completed)}
331	            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-red transition-colors disabled:opacity-30"
332	          >
333	            Pular
334	          </button>
335	          <button
336	            onClick={() => setShowAddExercise(!showAddExercise)}
337	            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-gold transition-colors"
338	          >
339	            + Extra
340	          </button>
341	        </div>
342	
343	        {/* Notes panel */}
344	        {showNotes && currentExercise && (

================================================================================
## BLOCO 19 — 6086 chars
================================================================================

Conferido. O dado muda parte da minha resposta e confirma parte da sua crítica. Vou por partes, e a terceira é a que interessa.

---

## 1. O que o bloco está tentando fazer

É o **Bloco 1 de ~3** até a prova daqui a 12 meses. A variável dele **não é carga — é profundidade legal**. Os cinco objetivos, em ordem de prioridade:

1. **Tornar a execução legal automática.** Suas marcas foram feitas em condições que a IPF não aceita: agacho em pino 5–8 cm acima do paralelo, supino com 0,20 s no fundo (reversão, não pausa), sumo com strap/barra com whip/anilha grossa. O bloco treina as versões legais dessas três coisas.
2. **Medir uma âncora de verdade em vez de chutar.** As semanas 1–3 descobrem carga por RPE e o gate da semana 4 grava o `trainingMax` medido.
3. **Expor o peitoral progressivamente sem repetir a lesão** — rampa de duração de pausa, gate de dor em três momentos por sessão.
4. **Manter a dose mínima eficaz de força** (Pak 2021: 3–6 séries de 1–5 reps acima de 80% por levantamento por semana). Isso está preservado mesmo com carga conservadora.
5. **Hipertrofia de braço e ombro onde não custa força** — 11 séries de bíceps e 9 de deltoide lateral por semana, que não recebem crédito nenhum do SBD.

## 2. O que veio da base do YouTube

O que é **claim do canal**, com procedência:

- **High bar em ~50% do volume de agacho** — R18: é o que ele faz e o que programa para todo cliente que agacha low bar.
- **Pausa de 1 s, não mais** — R124: "mais que isso só limita carga sem ajudar na estabilidade".
- **Stiff-legged e não RDL** pela sua envergadura de 184 — R11. Com o contraponto declarado: ele **tirou** o stiff do próprio programa (R4).
- **O gap de 100 lb academia→prova no terra** — R174. É a peça mais valiosa da base inteira e é ela que ancora seu terra: 672 lb em prova contra 765 lb de academia, com os mecanismos nomeados um a um (strap, anilha grossa, whip, touch-and-go).
- **Gauge set e comparabilidade entre ciclos** — R114.
- **Rigor de profundidade como a única exceção ao anti-purismo dele** — R115.
- **Sem strap** — R42: ele mesmo "sempre soltava o terra pela pegada mesmo tendo a força".
- Aquecimento em saltos de 5–10% com os dois últimos a 4–7,5% (R52, R110); tríceps overhead pela cabeça longa (R101/R119, com a contradição declarada).

O que **não** veio da base e está marcado como lacuna: a conversão de centímetros de profundidade em quilos, o desconto de high bar, e o tempo em lockout. Essas três são minhas.

---

## 3. Eu estimei baixo demais? Em parte sim — e achei dois erros meus

Fui verificar a cadeia inteira e encontrei coisas que você merece saber.

**Primeiro: a semana 1 quase não tem carga prescrita.** Dos 14 blocos de SBD da semana 1, **13 são descobertos por RPE** — o app não te dá número nenhum. O único com carga é a back-off de terra a 65%. As semanas 1–3 inteiras são calibração; a primeira semana por percentual é a **4**. Então o que você está vendo agora não é minha estimativa — é você descobrindo a carga.

Se o supino que te pareceu leve foi o gauge de **112,5 kg × 7 a RPE 6,5**, ele é *instrumento, não estímulo*: é justamente uma série que você tem que conseguir fazer sobrando. Se sair a RPE 4, o gauge diz que o `trainingMax` está baixo e o gate sobe ele. O sistema já está desenhado para te dar razão sem discussão.

**Segundo: errei em dois lugares, em direções opostas.**

- No agacho, a faixa que eu mesmo escrevi era −12 a −18% pela profundidade e +5 a +8% de crédito pelo pino. **Peguei os dois extremos pessimistas** e cheguei em 215. O centro da minha própria faixa é ~226, e a faixa declarada era 210–235. Não há justificativa escrita para eu ter pego a ponta. Pior: esse fator de −12 a −18% **não tem fonte nenhuma no corpus** — é estimativa minha, ao contrário do supino (R83/R4) e do terra (R174).
- Mas **nunca apliquei a conversão de 1RM legal para `trainingMax`**. O `trainingMax` é ~92–94% do máximo. Eu rotulei 215/160/240 como "legal estimado" e depois consumi os mesmos números como `trainingMax`, sem os 93%. Se eu tivesse aplicado minha própria cadeia à risca, os números seriam **200 / 149 / 223**.

Os dois erros se cancelam quase exatamente. O que está no app hoje é a **mais generosa** das duas leituras, não a mais dura.

**Terceiro: o 260 com 5 s de lockout é dado novo e muda o terra.** Ninguém segura um 1RM real de terra por 5 segundos travado. Isso põe aquele 260 em RPE ~8,5, o que implica máximo de academia em ~280–285, não 268. Aplicando o mesmo gap de R174: legal ~251, `trainingMax` ~235. Chega perto dos 240 que já estão lá — mas por um caminho diferente do meu.

**Onde você tem razão sem ressalva:** o topo do bloco na semana 16 é **agacho 197,5 · supino 145 · terra 220**. Você nunca é convidado a chegar perto do que já levantou. Eu já tinha marcado isso para revisão na semana 8 antes de você perguntar. É conservador de propósito — bloco 1 de 3, prova em 12 meses, peitoral lesionado — mas 18 semanas sem tocar o próprio máximo é muito tempo.

---

**O que eu preciso saber para corrigir de verdade, em vez de trocar um chute por outro:**

1. **O 260 foi com strap ou sem?** Essa é a pergunta que mais move o número. Strap é o maior componente isolado do gap de R174. Sem strap, o terra legal sobe para ~247–250 e o `trainingMax` para ~235–240 — o que já está lá. Com strap, a estimativa atual está certa.
2. **No supino, "várias reps" com qual carga exatamente, e com quantos segundos de pausa no peito?** 130 kg × 6 com 0,2 s de reversão e 130 kg × 6 com 1 s imóvel são levantadores diferentes. Se for com pausa de verdade, seu supino está subestimado e eu subo agora.
3. **No agacho** você diz que não baixaria tanto. Concordo que 215 foi pessimista demais dentro da minha própria faixa. A pergunta que resolve: **os 250 no pino, quanto você acha que sobra descendo os 5–8 cm até quebrar o paralelo?** Sua intuição aqui vale mais que minha estimativa sem fonte.

Me responde essas três e eu recalculo a partida hoje. As três semanas de calibração continuam sendo o juiz, mas não faz sentido você entrar nelas com uma partida que eu já sei que está torta.

================================================================================
## BLOCO 20 — 5524 chars
================================================================================

=== MOTIVO DAS FALHAS (amostra) ===
--- _4SYHDWVFtQ
ERROR: [youtube] _4SYHDWVFtQ: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp  for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies  for tips on effectively exporting YouTube cookies
WARNING: [youtube] _4SYHDWVFtQ: Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)
WARNING: [youtube] Unable to fetch GVS PO Token for web_safari client: Missing required Visitor Data. You may need to pass Visitor Data with --extractor-args "youtube:visitor_data=XXX"
--- 0SHlj0BaNM4
[info] There are no subtitles for the requested languages
ERROR: [youtube] 0SHlj0BaNM4: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp  for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies  for tips on effectively exporting YouTube cookies
WARNING: [youtube] 0SHlj0BaNM4: Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)
--- 2capo9VILVY
ERROR: [youtube] 2capo9VILVY: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp  for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies  for tips on effectively exporting YouTube cookies
WARNING: [youtube] 2capo9VILVY: Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)
WARNING: [youtube] Unable to fetch GVS PO Token for web_safari client: Missing required Visitor Data. You may need to pass Visitor Data with --extractor-args "youtube:visitor_data=XXX"
--- 5cN9fmuHATE
ERROR: [youtube] 5cN9fmuHATE: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp  for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies  for tips on effectively exporting YouTube cookies
WARNING: [youtube] 5cN9fmuHATE: Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)
WARNING: [youtube] Unable to fetch GVS PO Token for web_safari client: Missing required Visitor Data. You may need to pass Visitor Data with --extractor-args "youtube:visitor_data=XXX"

=== As 45 falhas sao videos antigos/curtos? ===
45 falhas | recencia min=147 max=196
duracao total perdida: 237 min
  #147  1:29  Stop Changing Your Program ❌
  #151  3:02  WHY IT TOOK ME 3 YEARS TO LIFT 5LBS MORE 🤡
  #154  3:50  GOING TO THE WORLD CHAMPIONSHIPS
  #155  5:35  DEADLIFT BACK ROUNDING | CAUSE AND FIX
  #156  6:58  WHY CORE STRENGTH IS OVERRATED FOR SQUATS/DEADLIFTS
  #157  8:30  HOW TO SQUAT TUTORIAL: ARM/ELBOW/HAND/WRIST POSITION
  #158  4:17  WHY EVERYBODY SHOULD BENCH WITH AN ARCH
  #159  7:00  STOP TRYING TO SQUAT UPRIGHT (LONG VERSION)
  #160  8:29  USE THE STRETCH REFLEX TO INSTANTLY LIFT MORE WEIGHT
  #161  2:28  HOW TO INSTANTLY FIND THE PERFECT DEADLIFT START POSITION (SUMO OR CON
  #162 10:14  RANGE OF MOTION DOESN’T MAKE SUMO DEADLIFTS EASIER (BUT IT’S STILL EAS
  #163  3:32  STOP TRYING TO BE UPRIGHT DURING SUMO DEADLIFTS
  #164 11:57  IPF World Championships | Full Meet Recap
  #165  4:29  Stacked Joints = Terrible Advice
  #166 10:01  How To Program For Yourself
  #167  4:53  Proper Bench Press Bar Path | Increase Your Bench By 35%
  #168  3:25  The Best Squat Accessory (How I Squatted 700lbs)
  #169 16:55  Questions and Answers 2
  #170 15:30  My Program
  #171 13:20  Question and Answer #1 | 655lbs Squat
  #172  7:39  Are Sumo Deadlifts Cheating?
  #173  7:42  Am I A Fake Natty? | Training Log 605lbsx5 Squat
  #174  6:50  Do I Use Fake Weights? | Training Log
  #175 19:17  What Programs Did I Do To Get Where I Am? | 678LBS Squat | 683Lbs Dead
  #176  4:04  How Strong Was I When I First Started? | 672Lbs Squat & 678Lbs Deadlif
  #177  4:30  666Lbs Squat 672Lbs Deadlift | Training Log
  #178  0:54  JJ Watt vs Powerlifter: Squat Off
  #179  0:18  405x2 Bench Press PR
  #180  0:11  700Lbs Deficit Deadlift
  #181  2:25  People Mirin Me Lifting Compilation Part 3
  #182  0:31  405Lbs Bench Press Fail
  #183  1:05  405Lbs Bench Press Comeback
  #184  0:26  675Lbs Tempo Squat PR
  #185 10:07  Training Log: Weeks 1&2 - Post Quarantine Gains
  #186  3:07  4 Year Squat Transformation | 315lbs to 700lbs
  #187  7:22  405x24 Squat For Candito Squat Challenge
  #188  1:14  405x23 squat but the camera died
  #189  2:00  People Mirin Me Lifting Compilation 2
  #190  2:00  440lbs Deadlift Progress In 3.5 Years.
  #191  2:00  3.5 Year Squat Progress. 345lbs to 675lbs
  #192  3:13  People Mirin Me Lifting Compilation
  #193  1:52  575/1267.7 Total at 79.7/175.7 17 Years Old Canadian National Record T
  #194  1:24  217 Pound Deadlift Progress in 14 months 335-552 16-17 Years Old
  #195  0:30  530 Poundx2 Deadlift PR 17 Years Old 180 Pounds
  #196  0:35  405 Deadlift for 3 Reps at 17 Years Old
Shell cwd was reset to /Users/brunnovert/Documents/Dev/powerlifting-app

================================================================================
## BLOCO 21 — 5363 chars
================================================================================

__pycache__
_dl_sorted.txt
_inj_sorted.txt
abcd_def.pdf
abcd_def.txt
ad_about-anti-doping.html
ad_education.html
ad_ipf-anti-doping-rules.html
ad_prohibited-list.html
ad_sanctions.html
ad_supplements.html
ad_testing.html
ad_tue.html
ad_wa.html
ad_whereabouts.html
adr.pdf
adr.txt
adr26.pdf
adr26.txt
all_ids.txt
assemble.sh
attempts.txt
atwood_orhii
audio
back_help.html
back_lm.png
batches.json
bc_hyp.html
bench
bg_videos.txt
br
br.html
build_corpus.py
bylaws.pdf
bylaws.txt
c_antidoping.html
c_campeonatos.html
c_criteriosparticipacao.html
c_nominacoes.html
c_rec.html
c.html
catalog.tsv
cb_videos.txt
cb.html
cb16.html
cb8.html
cbb.html
cblb_home.html
changes2026.pdf
changes2026.txt
channel_err.log
channel_raw.jsonl
chg-13.png
chg-14.png
chg-15.png
chg-16.png
chg-17.png
clean_vtt.py
clean.py
cookietest
corpus
corr.html
ddg.sh
ddg2.sh
dedup.py
dl_one.sh
dl_pj.sh
expl.pdf
expl.txt
expl2026.pdf
extract
EXTRACT_SPEC.md
f_88490e46bd2901b7db313104f9c43d8b.html
f_88490e46bd2901b7db313104f9c43d8b.txt
f_980e632eed60d8f11b06a81ef359ed91.html
f_aa61f23d6008649f3fe3f9ca736bc09c.html
f.html
g_32f3e9f4e8a90e7300e1fda37fcc8f85.html
g_32f3e9f4e8a90e7300e1fda37fcc8f85.txt
g_brettgibbs.csv
g_brettgibbs1.csv
g_d316d9678497044301c1997ae85168be.html
g_d316d9678497044301c1997ae85168be.txt
getaudio.sh
gl_M_ac0_classic.html
gl_M_ac0_equip.html
gl_M_ac1_classic.html
gl_M_ac2_classic.html
gl_M_ac4_classic.html
gl_M_ac5_classic.html
gl_M_ac6_classic.html
gl_M_ac7_classic.html
gl.html
glparse.py
glrec.html
grip
grip2
h_2ac6607dc5bab6ea527cd337e330f7d9.html
h_2ac6607dc5bab6ea527cd337e330f7d9.txt
h_af49afa959ad78a0c6680ced519db854.html
h_af49afa959ad78a0c6680ced519db854.txt
h_afb65b1575e53fffd8294fcecc2003c2.html
h_afb65b1575e53fffd8294fcecc2003c2.txt
h_e2b07e7e335ed8bf6b0af6d1b183d84b.html
h_e2b07e7e335ed8bf6b0af6d1b183d84b.txt
helms2016.html
helms2016.txt
ipf_home.html
ipf_records.html
ipf.html
ipf.pdf
ipf.txt
ipf2023.pdf
ipf2023.txt
ipf2025.pdf
ipf2025.txt
ipf2026.pdf
ipf2026.txt
ipfrec.html
kb
L_anarosacastellain.csv
L_biancasoares.csv
L_brunabisol.csv
L_ciceratavares.csv
L_davicardoso.csv
L_davidcardoso.csv
L_davidcoimbra.csv
L_davivaldez.csv
L_ericabatistabueno.csv
L_giuliacarvalho.csv
L_giuliacunhacostacarvalho.csv
L_guilhermemenezes.csv
L_guilhermemenezesdepaula.csv
L_leonardohermisdorf.csv
L_leonardohermisdorfferreira.csv
L_marinagarciadealmeida.csv
L_matheusdossantos.csv
L_matheusgarciacosta.csv
L_rogerioalmeidadesousa.csv
L_victorwillker.csv
list2026.pdf
list2026.txt
lm
lv.html
m2605.csv
nunez_bb.html
opl_agatasitko.html
opl_amandalawrence1.html
opl_jesusolivares.html
p_3ce430c30496a22ddc326200ec80045a.html
p_8e46e6efedab95dfb443aaffb39298ea.html
p.pdf
page.html
pana_catalog.tsv
pana_err.log
pana_ids.txt
pana_raw.jsonl
pana_txt
pana_vtt
parse_gl.py
pdf
pelland.pdf
pelland.txt
per.html
perkins.csv
pg_ab.html
pg_bicep.html
pg_calf.html
pg_chest.html
pg_forearm.html
pg_front-delt.html
pg_glute.html
pg_hamstring.html
pg_quad.html
pg_rear-delt.html
pg_side-delt.html
pg_trap.html
pg_triceps.html
pl.html
ptest
pyramid.txt
q_18502c4ff3806ef62f325a3aa5e7e9f4.html
q_71a503d19a221958c3d7545a0f57d5c5.html
q_d1143a222cfa86db8b3e04f5a14f021d.html
R_F_C.html
R_M_C.html
rank_br.json
rb2026.txt
RE_F.html
RE_M.html
rec_m_open_raw.html
rec1.html
rec2.html
rec3.html
rec4.html
records.css
recparse.py
reg.html
rep2021.pdf
rep2021.txt
reports
retry_ids.txt
robinson.pdf
robinson.txt
rp_back.html
rp_biceps.html
rp_calves.html
rp_chest.html
rp_guide.html
rp_hamstring.html
rp_quads.html
rp_side-delt.html
rp_triceps.html
rp.html
rpback.html
rpvl.html
rtp.pdf
rtp.txt
run_one.sh
s.html
sanc.html
sanc26.pdf
sanc26.txt
sanctions.pdf
sbs_test.html
sbs.html
sc.html
sec_work
sel_brazil_cblb_raw.json
sel_brazil_raw_men_2026.json
sel_brazil_raw_men.json
sel_brazil_raw_women.json
squat
subs
synth
SYNTH_SPEC.md
t.html
t.pdf
t1.csv
t1.jpg
t2.jpg
t2.pdf
t3.jpg
t4.jpg
tf.pdf
tf2023.pdf
tf2023.txt
tiers.txt
tmp.html
tp.pdf
tp.txt
traj.txt
trb.txt
trb2026.pdf
tri.html
tsa_bc.html
tsa_home.html
tsa12.html
tsa9.html
tue.html
u1.html
user_list.txt
vid
vtt.py
vtt2txt.py
vttclean.py
web
whisper_batch.sh
whisper_ids.txt
wl.html
work
wr_M.html
wr_W.html
wtrans
x.py
yt
--- KB ---
    4654 kb/_analysis.md
    6145 kb/_roster_analysis.md
     429 kb/_roster_header.md
   72178 kb/coach_frameworks.md
  105782 kb/elite_ipf_roster.md
   10952 kb/elite_pana.md
    2241 kb/grip_measurement.md
   17325 kb/ipf_reality.md
   18674 kb/natural_powerbuilding.md
   12864 kb/sec_atwood_orhii.md
    8438 kb/sec_brazil.md
   15015 kb/sec_cayco_rouska_stinn.md
    2272 kb/sec_context.md
   22660 kb/sec_gibbs_others.md
   33109 kb/sec_olivares_sitko_lawrence.md
    1756 kb/sec_osl_supplement.md
    3094 kb/sec_supplement.md
    3472 kb/video_bench.md
    2936 kb/video_squat.md
  343996 total
--- SYNTH ---
    6730 synth/cardio_recuperacao.md
    7108 synth/diversos.md
    4586 synth/evolucao.md
    7626 synth/exercise.md
    4447 synth/freq_volume.md
    4324 synth/intensity_reps.md
    6770 synth/lesao.md
    7258 synth/mentalidade.md
    6862 synth/nutricao_peso.md
    7029 synth/periodizacao.md
    4876 synth/tech_bench.md
    7873 synth/tech_deadlift.md
    8660 synth/tech_squat.md
   84149 total
--- EXTRACT ---
     157 extract/lote_17.md
     121 extract/lote_18.md
    4436 total
Shell cwd was reset to /Users/brunnovert/Documents/Dev/powerlifting-app

================================================================================
## BLOCO 22 — 4981 chars
================================================================================

1	# Bloco 1 — Ficar Legal (18 semanas)
2	
3	Fonte de verdade do programa. `scripts/build-vena-block1.mjs` expande este arquivo em
4	18 `PrescribedWeek`. **Não edite `generated.ts` à mão.**
5	
6	📄 **`CONTEXTO.md`** (ao lado deste arquivo) carrega o que governa o bloco mas não é
7	prescrição de série: **nutrição e creatina com selo** (`design.md` §9), **aritmética de
8	peso corporal** (§12) e **cardio** (§13).
9	
10	A estrutura tem três partes:
11	
12	1. **Blocos declarativos** (`entradas`, `restricoes`, `procedencias`, `eixos`,
13	   `derivacoes`, `ancoras`, `calibracao`, `papeis`) — o contrato legível por máquina.
14	2. **5 templates de dia** (D1–D5) no formato de 8 colunas do repositório, com `{VAR}` em
15	   qualquer célula.
16	3. **Três grades de rampa** de 18 linhas, uma coluna por variável.
17	
18	As semanas 17 e 18 (taper de 10 dias + simulado) são **dias explícitos**: o taper muda a
19	estrutura, e por isso está fora da regra "só a carga varia".
20	
21	> **REGRA MESTRA DE DENOMINADOR.** Todo `%` deste arquivo é **percentual do
22	> `trainingMax` CORRENTE** (`SPEC_REV2` §0.1), nunca do 1RM histórico e nunca das marcas
23	> **declaradas** 250/170/268, que não aparecem em lugar nenhum deste programa. Partida:
24	> **agacho 215 · supino 160 · terra 240** (`baseline.md` §4). Célula em kg é **erro de
25	> build**: o app recomputa em runtime.
26	
27	> **O QUE É O `trainingMax`, ESCRITO AQUI E NÃO EM NOTA DE EXERCÍCIO** (`SPEC_REV2` §0.1).
28	> É o **maior peso que você move sem degradar o padrão legal** — o *technical max* de
29	> **Brett Gibbs**, que fica em **≈92–94% do máximo real**. Não é o 1RM de academia e não é
30	> o total projetado. **Consequência prática, e é a que morde: se você digitar o 1RM real
31	> no perfil em vez do máximo técnico, TODO o bloco desloca ~7% para cima** — as S4–S18 são
32	> percentuais dele, e 86% de um número 7% maior é 92% do número certo. O app trata
33	> `trainingMax` ausente como bloqueio de sugestão de carga, de propósito.
34	> ⚠️ **A partida do supino é a mais frágil das três**: 160 kg vem de **n = 1**, três
35	> datapoints (`baseline.md` §4, `design.md` §14). Trate-a como hipótese até o gate da S4;
36	> se a mediana das três âncoras divergir >7%, é a estimativa que estava errada, não você.
37	
38	## ⚠️ A aposta mais contestável deste desenho: 16 semanas
39	
40	**Isto não é consenso, e a base inteira discorda.** Vena prescreve 12–20 semanas, ideal
41	16 `[R40]` `[R125]` `[R4]` — e `[R4]` é **[PESSOAL]** (descrição do programa dele), não
42	prescrição. Todo o resto aponta para blocos mais curtos: Frontiers 2021 reporta **6–12
43	semanas** e 50% dos coaches de elite dizem 6–8; Sitko roda **4–5**; Perkins **5**;
44	Rouska **4**. **Ponto de revisão fixado na semana 8**, junto com o teto de `EXP`.
45	
46	## O que o atleta precisa aceitar antes de começar
47	
48	1. **O supino do Bloco 1 é medido em SÉRIES, não em quilos.** Ele entra em 22
49	   séries/semana desde a S1 e as **reps pausadas** vão do valor da S1 ao valor da S9 —
50	   os dois números são `VENA_BLOCK1_MEASURES[].repsPausadas` (**medição do gerador, não
51	   digitada aqui**, SPEC §3.2 regra 1); a carga sobe ~7% (`rampa_carga_supino_pct`) e a
52	   terceira tentativa do simulado é **+2,5 kg** sobre o melhor single da S16 (Perkins: ±0
53	   a 2,5 kg). `SPEC_REV2` §7-#4.
54	2. **Pré-condições, não conforto** (`SPEC_REV2` §6): câmera **lateral** de supino,
55	   câmera perpendicular de agacho, micro-anilhas de 1,25 kg (par → 2,5 kg na barra),
56	   log de dor de peitoral por sessão em **três** momentos, e alguém para dar os comandos.
57	   Sem a lateral, a escala de RPE 10 de §0.3 é rótulo sem instrumento.
58	3. **DIAGNÓSTICO SEM CARGA, ANTES DA PRIMEIRA SÉRIE DA S1 — obrigatório e de custo zero**
59	   (`params_tecnica.md` §1.2; `design.md` §4). Verbatim: *"problemas de profundidade têm
60	   duas causas: mobilidade ou estabilidade; o teste é agachar sem peso com sua postura e
61	   ângulo de pé normais segurando em algo para apoio — se não atinge profundidade nesse
62	   teste, é mobilidade"* `[R124 @00:00]` `[GERAL]`. **Leitura:** falhou sem peso →
63	   **mobilidade**, e a dose de profundidade da S1 recua até onde ela existe; passou sem
64	   peso → **estabilidade ou confiança**, e o acessório indicado é o agacho pausado que D1
65	   já prescreve — *"se passa no teste de peso corporal, o problema é estabilidade e o
66	   acessório é o pause squat simples"* `[R124 @00:31]` `[GERAL]`. **O MESMO TESTE ACHA A
67	   ABERTURA E O ÂNGULO DE PÉ**: *"esse mesmo teste serve para achar a largura de postura e
68	   o ângulo de pé ótimos: o que permitir agachar mais fundo provavelmente é o melhor"*
69	   `[R124 @00:00]` `[GERAL]`. **Anote os dois números (abertura em cm, ângulo em graus) e
70	   não os mexa mais durante o bloco** — é setup, e UM-EIXO vale aqui também.
71	4. **Sem uma segunda pessoa, o simulado não é teste de legalidade** — é teste de força, e
72	   deve ser rotulado assim.
73	
74	---
75	

================================================================================
## BLOCO 23 — 4978 chars
================================================================================

Exit code 1
=== estrutura de ~/.claude ===
total 5144
drwx------  28 brunnovert  staff      896  9 ago 08:47 .
drwxr-x---+ 57 brunnovert  staff     1824  9 ago 08:47 ..
-rw-r--r--   1 brunnovert  staff       24  8 ago 10:51 .last-cleanup
-rw-r--r--   1 brunnovert  staff      161  8 ago 09:42 .last-update-result.json
drwxr-xr-x   7 brunnovert  staff      224  9 ago 08:47 backups
drwxr-xr-x   4 brunnovert  staff      128  8 ago 18:21 cache
drwxr-xr-x   3 brunnovert  staff       96  5 jan  2026 chrome
-rw-r--r--   1 brunnovert  staff      346 30 out  2025 CLAUDE.md
drwx------   6 brunnovert  staff      192  4 ago 21:27 daemon
-rw-r--r--   1 brunnovert  staff     2165  4 ago 21:27 daemon.log
drwx------   3 brunnovert  staff       96 12 mai 14:21 debug
drwxr-xr-x   2 brunnovert  staff       64 19 mar 07:24 downloads
drwxr-xr-x  18 brunnovert  staff      576  8 ago 14:10 file-history
-rw-r--r--   1 brunnovert  staff  2602106  9 ago 08:47 history.jsonl
drwxr-xr-x   2 brunnovert  staff       64 26 dez  2025 ide
drwxr-xr-x   3 brunnovert  staff       96  8 ago 19:11 image-cache
drwxr-xr-x   4 brunnovert  staff      128  4 ago 19:55 jobs
drwxr-xr-x   9 brunnovert  staff      288  8 ago 13:42 paste-cache
drwxr-xr-x   4 brunnovert  staff      128  5 ago 10:27 plans

=== procurando transcripts de agente / task outputs ===
/Users/brunnovert/.claude
/Users/brunnovert/.claude/ide
/Users/brunnovert/.claude/image-cache
/Users/brunnovert/.claude/tasks
/Users/brunnovert/.claude/cache
/Users/brunnovert/.claude/plans
/Users/brunnovert/.claude/projects
/Users/brunnovert/.claude/session-env
/Users/brunnovert/.claude/paste-cache
/Users/brunnovert/.claude/sessions
/Users/brunnovert/.claude/daemon
/Users/brunnovert/.claude/chrome
/Users/brunnovert/.claude/shell-snapshots
/Users/brunnovert/.claude/telemetry
/Users/brunnovert/.claude/jobs
/Users/brunnovert/.claude/file-history
/Users/brunnovert/.claude/downloads
/Users/brunnovert/.claude/backups
/Users/brunnovert/.claude/debug
/Users/brunnovert/.claude/image-cache/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed
/Users/brunnovert/.claude/tasks/7326e0ff-df09-4b77-b9cf-118ea0d8a1a3
/Users/brunnovert/.claude/tasks/3154f853-7d2b-43e1-bf16-fff91fb91d31
/Users/brunnovert/.claude/tasks/addfaa15-36f3-4e13-b64c-a66dd04a6400
/Users/brunnovert/.claude/tasks/a3275745-4bed-49ef-9eed-756724a775b1
/Users/brunnovert/.claude/tasks/a3b995a6-4d75-4c07-94bc-c7599eb4f3d8

=== algum .jsonl fora do principal? ===
    2,5M  /Users/brunnovert/.claude/history.jsonl
    892K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Downloads/564d9a0a-18b8-4801-9506-995007e0ffd7.jsonl
    1,0M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Downloads/eb03b53e-37d4-4d7f-9948-977bfdef3f8e.jsonl
    532K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/f9ccca3d-331e-4d79-ac79-6bf73863cec3.jsonl
    2,2M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/b8853c02-8228-41f9-b756-fdaebea8dce0.jsonl
    5,3M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/3154f853-7d2b-43e1-bf16-fff91fb91d31.jsonl
    2,0M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/d5583ac3-d3a8-4b58-a96b-a808bac1b922.jsonl
    2,6M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/35ad0e13-0e13-4ba7-875f-4f80d64313a0.jsonl
    3,8M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/e13e48f1-998c-4b0d-9149-02bd797690c3.jsonl
     10M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-finance/a3b995a6-4d75-4c07-94bc-c7599eb4f3d8.jsonl
     13M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed.jsonl
     92K  /Users/brunnovert/.claude/projects/-Volumes/6ee7ebc6-d890-4321-a5c7-b7d3a5da4c92.jsonl
    1,3M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-blazee-shopify/addfaa15-36f3-4e13-b64c-a66dd04a6400.jsonl
    516K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-blazee-shopify/90b47070-40ae-44da-bfeb-711f36a6f167.jsonl
     36K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee-blazee-shopify/f60a3755-6460-4221-acbe-bfbcc70d9eee.jsonl
    744K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev-Blazee/84313f07-87d6-49cf-b1fc-05c549789b48.jsonl
    716K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Downloads-provas-/8a8fca3d-67e9-4f5f-8f05-de06c76c228e.jsonl
    676K  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev/3e7cecc4-38b9-466d-b758-26d0487fd9b1.jsonl
    2,2M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev/7326e0ff-df09-4b77-b9cf-118ea0d8a1a3.jsonl
    4,0M  /Users/brunnovert/.claude/projects/-Users-brunnovert-Documents-Dev/980fff00-f26a-44dd-9484-24664ff85ece.jsonl

=== task output da outra sessão ===

================================================================================
## BLOCO 24 — 4843 chars
================================================================================

Parser de notas — 614 blocos, 132 textos únicos
  cabeçalhos distintos ...... 94
  blocos sem cabeçalho ...... 119 (19.4%)
  blocos com alvo numérico .. 226 (36.8%)
  citações extraídas ........ 7677
  sem destaque .............. 0
  tons ...................... dose:451  execucao:384  meta:305  prosa:298  ipf:129  parada:128  instrumento:112  registro:48

48 ERRO(S):
  ✗ w1 · Agachamento Low Bar (Profundidade Legal): parser perdeu ou duplicou texto (2656 → 2644 chars)
    diverge em 2389: esperado …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1DESIGN13BR12CINTOWALKOUTDENOMÁXIMO3PASSO…
                   obtido   …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1CINTOWALKOUTDENOMÁXIMO3PASSOSMAISDETRÊSP…
  ✗ w1 · Stiff-Legged Deadlift: parser perdeu ou duplicou texto (1705 → 1692 chars)
    diverge em 11: esperado …MIGRADODED5SPEC12ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOI…
                   obtido   …MIGRADODED5ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOISLADOS…
  ✗ w1 · Extensão Lombar (Hiperextensão): parser perdeu ou duplicou texto (1080 → 1070 chars)
    diverge em 651: esperado …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESÉELITES338PANAEXTENSÃODEQUADRILHIPERÉAES…
                   obtido   …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESPANAEXTENSÃODEQUADRILHIPERÉAESCOLHANº1DE…
  ✗ w2 · Agachamento Low Bar (Profundidade Legal): parser perdeu ou duplicou texto (2656 → 2644 chars)
    diverge em 2389: esperado …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1DESIGN13BR12CINTOWALKOUTDENOMÁXIMO3PASSO…
                   obtido   …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1CINTOWALKOUTDENOMÁXIMO3PASSOSMAISDETRÊSP…
  ✗ w2 · Stiff-Legged Deadlift: parser perdeu ou duplicou texto (1705 → 1692 chars)
    diverge em 11: esperado …MIGRADODED5SPEC12ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOI…
                   obtido   …MIGRADODED5ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOISLADOS…
  ✗ w2 · Extensão Lombar (Hiperextensão): parser perdeu ou duplicou texto (1080 → 1070 chars)
    diverge em 651: esperado …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESÉELITES338PANAEXTENSÃODEQUADRILHIPERÉAES…
                   obtido   …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESPANAEXTENSÃODEQUADRILHIPERÉAESCOLHANº1DE…
  ✗ w3 · Agachamento Low Bar (Profundidade Legal): parser perdeu ou duplicou texto (2656 → 2644 chars)
    diverge em 2389: esperado …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1DESIGN13BR12CINTOWALKOUTDENOMÁXIMO3PASSO…
                   obtido   …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1CINTOWALKOUTDENOMÁXIMO3PASSOSMAISDETRÊSP…
  ✗ w3 · Stiff-Legged Deadlift: parser perdeu ou duplicou texto (1705 → 1692 chars)
    diverge em 11: esperado …MIGRADODED5SPEC12ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOI…
                   obtido   …MIGRADODED5ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOISLADOS…
  ✗ w3 · Extensão Lombar (Hiperextensão): parser perdeu ou duplicou texto (1080 → 1070 chars)
    diverge em 651: esperado …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESÉELITES338PANAEXTENSÃODEQUADRILHIPERÉAES…
                   obtido   …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESPANAEXTENSÃODEQUADRILHIPERÉAESCOLHANº1DE…
  ✗ w4 · Agachamento Low Bar (Profundidade Legal): parser perdeu ou duplicou texto (2671 → 2659 chars)
    diverge em 2389: esperado …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1DESIGN13BR12CINTOWALKOUTDENOMÁXIMO3PASSO…
                   obtido   …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1CINTOWALKOUTDENOMÁXIMO3PASSOSMAISDETRÊSP…
  ✗ w4 · Stiff-Legged Deadlift: parser perdeu ou duplicou texto (1705 → 1692 chars)
    diverge em 11: esperado …MIGRADODED5SPEC12ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOI…
                   obtido   …MIGRADODED5ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOISLADOS…
  ✗ w4 · Extensão Lombar (Hiperextensão): parser perdeu ou duplicou texto (1080 → 1070 chars)
    diverge em 651: esperado …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESÉELITES338PANAEXTENSÃODEQUADRILHIPERÉAES…
                   obtido   …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESPANAEXTENSÃODEQUADRILHIPERÉAESCOLHANº1DE…
  ✗ w5 · Agachamento Low Bar (Profundidade Legal): parser perdeu ou duplicou texto (2670 → 2658 chars)
    diverge em 2389: esperado …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1DESIGN13BR12CINTOWALKOUTDENOMÁXIMO3PASSO…
                   obtido   …ETUPCUSTOZEROEÉCAUSADEDQCOMANDOSDESDEAS1CINTOWALKOUTDENOMÁXIMO3PASSOSMAISDETRÊSP…
  ✗ w5 · Stiff-Legged Deadlift: parser perdeu ou duplicou texto (1705 → 1692 chars)
    diverge em 11: esperado …MIGRADODED5SPEC12ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOI…
                   obtido   …MIGRADODED5ÉMETADEDAREALOCAÇÃOQUERESOLVEOSDOISLADOS…
  ✗ w5 · Extensão Lombar (Hiperextensão): parser perdeu ou duplicou texto (1080 → 1070 chars)
    diverge em 651: esperado …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESÉELITES338PANAEXTENSÃODEQUADRILHIPERÉAES…
                   obtido   …RETASSEMANA4QUEMSUSTENTAOPAPELDEERETORESPANAEXTENSÃODEQUADRILHIPERÉAESCOLHANº1DE…
  … e mais 33

================================================================================
## BLOCO 25 — 4696 chars
================================================================================

Dados excelentes — e alguns já mudam o desenho. Deixa eu registrar o essencial antes de responder.

Sobre o benchmark: o modelo quantizado deu 73s vs 79s — só **8% mais rápido**, não vale a troca. Fico com o modelo completo. Áudio baixando em background.

---

## Medidas — instruções exatas

Você já me deu pulso 18cm. Faltam as que definem suas **alavancas**, que é o que decide low bar vs high bar e sumo vs convencional. Faça descalço, com o mínimo de roupa, e meça 2x cada uma (se der diferença >1cm, meça a terceira).

**1. Envergadura (braçada)**
Encoste as costas na parede, abra os braços em cruz na altura dos ombros. Marque a ponta do dedo médio de cada lado na parede. Meça entre as marcas.
→ *Define seu ROM de supino e sua vantagem no terra.*

**2. Altura sentado**
Sente no chão de costas para a parede, pernas esticadas à frente, coluna e cabeça encostadas. Meça do chão ao topo da cabeça.
→ *Altura total menos esta = comprimento real de perna. Essa razão é o fator #1 na inclinação do seu agachamento.*

**3. Fêmur**
Em pé, ache o **trocânter maior**: a saliência óssea lateral do quadril — coloque a mão na lateral da coxa e gire a perna para dentro e para fora; o osso que rola sob seus dedos é ele. Meça dali até a **linha lateral do joelho** (a fenda que você sente entre fêmur e tíbia com o joelho a 90°).

**4. Tíbia**
Da mesma fenda lateral do joelho até o chão (com o pé apoiado, descalço).

**5. Úmero**
Do **acrômio** (a ponta óssea no topo do ombro) até o **epicôndilo lateral** (a saliência óssea na lateral do cotovelo), braço relaxado ao lado do corpo.

**6. Antebraço**
Do epicôndilo lateral até o **processo estiloide da ulna** (o caroço ósseo do lado do dedo mínimo no punho).

**7. Largura de ombro (biacromial)**
Distância entre as pontas externas dos dois acrômios, medida por trás. Precisa de ajuda de alguém.

**8. Largura de quadril**
Distância entre as bordas externas das cristas ilíacas (o osso do quadril que você sente ao pôr as mãos na cintura).

**9. Tornozelo**
Circunferência no ponto mais fino, logo acima dos maléolos.

**10. Pegada atual de supino**
Distância entre os dedos indicadores na barra, em cm. **Importante:** o limite IPF é **81cm entre os indicadores** — as marcas da barra. Se você migrou pra pegada wide estilo Pana, preciso confirmar que está dentro da regra, e essa pegada é candidata número um pela sua lesão no peito.

Manda como uma lista simples (`1. 182cm`, `2. 92cm`, …).

---

## O que seus dados já me dizem

**A notícia boa é maior do que parece.** Você tem ~11 anos de treino pesado, mas **quase 10 deles em programas de bodybuilding** (Nippard powerbuilding, PHAT) e **nunca competiu**. Isso significa que sua base muscular foi construída, mas sua **especificidade** — praticar os três levantamentos pesados sob regra, com técnica de competição — está praticamente inexplorada. Para força, isso é o oposto de um problema: é a maior reserva de progresso disponível.

**Suas proporções estão equilibradas.** 250/173/260 normalizado dá 1.00 : 0.69 : 1.04. A razão de elite clássica é ~1.00 : 0.68 : 1.05. Você não tem um lift descompensado — seu supino não está "adiantado", seu agachamento não está "atrasado" em termos relativos. O que está atrasado é o **nível geral**. Isso muda o diagnóstico: não é caso de corrigir ponto fraco, é caso de subir tudo com especificidade.

**Duas coisas que preciso sinalizar agora:**

A lesão no peito veio junto com a migração para pegada wide. Você ganhou força e atribuiu o ganho à pegada — mas pegada mais aberta encurta o ROM, então parte do "ganho" pode ser mecânico, não adaptativo, e o custo foi o ombro. Vou tratar isso com a medida de úmero + envergadura em mãos.

Sobre bater recorde mundial IPF: o agente de dados da IPF ainda está rodando e eu não vou te dar número chutado. Mas já adianto o enquadramento — você está em ~683kg de total aos 87kg, e recorde mundial na classe de 93kg está muito acima disso. Isso não é motivo pra abandonar o objetivo; é motivo pra ele estruturar uma **década**, não uma temporada. Quando os dados chegarem eu te mostro a distância exata em DOTS e o que cada tier realmente exige.

Uma correção de premissa, e essa é importante: você respondeu *"posso treinar o quanto precisar para máxima performance"*. Disposição não é o fator limitante — **recuperação é**. O próprio Matt Vena tem um vídeo chamado *"Why My Workouts Take Over 3 HOURS (And Yours Shouldn't)"*. Volume que excede sua capacidade de recuperar não vira força, vira fadiga e lesão. Vou dimensionar pelo que você recupera, não pelo que você aguenta fazer — e seu sono de 8h com estresse regulado é um ativo real nessa conta.

Enquanto o Whisper roda, me manda as 10 medidas.

================================================================================
## BLOCO 26 — 4691 chars
================================================================================

# Powerbuilding Phase 2.0 - Complete 12-Week Program
## All Workouts with Full Details

---

## WEEK 1

### WEEK 1 - DAY 1 (Full Body - Strength Focus)

| Exercise | Warm Sets | Work Sets | Reps | %1RM | RPE | Rest | Notes |
|----------|-----------|-----------|------|------|-----|------|-------|
| Back Squat | 4 | 1 | 2 | 82.5-87.5% | 7 | 3-4 MIN | TOP SET - Get comfortable with heavier loads while keeping perfect technique |
| Front Squat [OR Box Squat] | 0 | 3 | 8 | N/A | 7 | 3-4 MIN | If you low bar squat, do front squat. If you high bar squat, do barbell box squat |
| Barbell Bench Press | 4 | 1 | 4 | 80-85% | 8.5 | 3-4 MIN | TOP SET - Get comfortable with heavier loads while keeping perfect technique |
| Barbell Bench Press | 0 | 2 | 6 | 75-80% | 7 | 1-2 MIN | SUBMAXIMAL - Be hypercritical of form |
| Weighted Pull-up | 1 | 3 | 4-6 | N/A | 8 | 1-2 MIN | 1.5x shoulder width grip, pull your chest to the bar |
| Glute-Ham Raise [OR Nordic Ham Curl] | 1 | 3 | 6-8 | N/A | 7 | 1-2 MIN | Keep your hips straight, do Nordic ham curls if no GHR machine |
| Seated Face Pull | 0 | 4 | 15-20 | N/A | 9 | 1-2 MIN | Don't go too heavy, focus on mind-muscle connection |

**SUGGESTED REST DAY (1-2 DAYS OFF DEPENDING ON YOUR SCHEDULE)**

---

### WEEK 1 - DAY 2 (Full Body - Continued)

| Exercise | Warm Sets | Work Sets | Reps | %1RM | RPE | Rest | Notes |
|----------|-----------|-----------|------|------|-----|------|-------|
| Deadlift | 4 | 3 | 4 | 80% | 7 | 3-5 MIN | TECHNIQUE WORK - Avoid turning these into touch-and-go reps |
| Barbell Overhead Press | 3 | 4 | 5 | 75% | 8 | 3-4 MIN | Squeeze your glutes to keep your torso upright, press up and slightly back |
| Bulgarian Split Squat | 1 | 2 each | 8-10 | N/A | 9 | 2-3 MIN | Start with your weaker leg working. Squat deep |
| Meadows Row | 1 | 4 | 12-15 | N/A | 8 | 2-3 MIN | Brace with your other hand, stay light, emphasize form |
| Barbell or EZ Bar Curl | 1 | 3 | 8-10 | N/A | 8 | 1-2 MIN | Use minimal momentum, control the eccentric phase |
| Pec Flye | 1 | 2 | 12-15 | N/A | 8 | 1-2 MIN | Perform with cables, bands, or dumbbells. Use full ROM. Stretch your pecs at the bottom |

**SUGGESTED REST DAY (1-2 DAYS OFF DEPENDING ON YOUR SCHEDULE)**

---

### WEEK 1 - DAY 3 (Full Body - Hypertrophy Focus)

| Exercise | Warm Sets | Work Sets | Reps | %1RM | RPE | Rest | Notes |
|----------|-----------|-----------|------|------|-----|------|-------|
| Back Squat | 4 | 1 | 6 | 75-80% | 7 | 3-4 MIN | Sit back and down, keep your upper back tight to the bar |
| Pin Squat | 0 | 2 | 4 | 70% | 8 | 3-4 MIN | Set the pins to around parallel. Dead stop on the pins, don't bounce and go |
| Barbell Bench Press | 4 | 1 | 1 | 87.5-92.5% | 8 | 3-4 MIN | WORKING TOP SET - Build confidence with heavier loads |
| Barbell Bench Press | 0 | 1 | 5 | 80% | 8 | 3-4 MIN | Focus on perfecting technique, slight pause on the chest |
| Barbell Bench Press | 0 | 1 | 10 | 65% | 8 | 3-4 MIN | Try to stay fluid with these, think of them as "pause-and-go" |
| Chin-up | 1 | 3 | AMRAP | N/A | 8 | 3-4 MIN | AS MANY REPS AS POSSIBLE - Stop at RPE 8 |
| Single-leg Hip Thrust | 0 | 2 each | 10-12 | N/A | 8 | 1-2 MIN | Keep your chin tucked down and squeeze your glutes to move the weight |
| Cable Reverse Flye | 0 | 4 | 12-15 | N/A | 8 | 1-2 MIN | Keep elbows locked in place, squeeze the cable handles hard! |
| Standing Calf Raise | 0 | 3 | 8-10 | N/A | 9 | 1-2 MIN | 1-2 second pause at the bottom of each rep, full squeeze at the top |

**SUGGESTED REST DAY (1-2 DAYS OFF DEPENDING ON YOUR SCHEDULE)**

---

### WEEK 1 - DAY 4 (Full Body - Continued)

| Exercise | Warm Sets | Work Sets | Reps | %1RM | RPE | Rest | Notes |
|----------|-----------|-----------|------|------|-----|------|-------|
| 6" Block Pull | 4 | 2 | 6 | 90% | 9 | 4-6 MIN | Get very tight prior to pulling. Use 85% if not experienced with block pulls. Use standard deadlift 1RM for %s |
| Pause DB Incline Press | 3 | 4 | 6-8 | N/A | 8 | 3-4 MIN | 3-SECOND PAUSE - Sink the dumbbells as low as you comfortably can |
| Leg Curl (Choice) | 1 | 3 | 12-15 | N/A | 8 | 2-3 MIN | Use seated leg curl if available. Can use lying leg curl or Nordic ham curl if no machine |
| Chest-Supported Row | 1 | 4 | 10-12 | N/A | 8 | 2-3 MIN | Can use machine or dumbbells. Full stretch at the bottom, squeeze at the top |
| Rope Overhead Triceps Extension | 1 | 4 | 12-15 | N/A | 8 | 1-2 MIN | Focus on stretching the triceps at the bottom |
| Egyptian Lateral Raise | 1 | 4 | 8-10 | N/A | 8 | 1-2 MIN | Lean away from the cable. Focus on squeezing your delts |

### WEEK 1 - DAY 5 (Arm & Hypertrophy Day)

| Exercise | Warm Sets | Work Sets | Reps | %1RM | RPE | Rest | Notes |

================================================================================
## BLOCO 27 — 4230 chars
================================================================================

# Powerlifting App

PWA de acompanhamento de treino. Dois programas estão disponíveis: **Powerbuilding
Phase 2.0** (Jeff Nippard, 12 semanas — o padrão) e o programa legado de 52 semanas,
mantido para preservar o histórico já registrado.

## Programa a partir do markdown

O Powerbuilding 2.0 é gerado a partir do material de origem, não escrito à mão:

```
src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md   fonte de verdade (54 dias, 373 linhas)
src/data/program/powerbuilding2/source/WARMUP_ROUTINE.md      protocolo de aquecimento
scripts/exercise-map.mjs                                      rótulo do markdown -> exerciseId
scripts/build-program.mjs                                     gerador
src/data/program/powerbuilding2/generated.ts                  ARQUIVO GERADO — não editar
```

- `npm run build:program` regenera o TS a partir do markdown.
- `npm run check:program` falha se o gerado estiver defasado (roda dentro de `npm run build`).
- O gerador aborta se algum rótulo de exercício não estiver mapeado ou se as
  contagens de dias/linhas divergirem — nenhum exercício entra no app sem grupo
  muscular associado.

Cada linha da tabela vira um **bloco de prescrição** (`PrescribedExercise`) com as
oito colunas do documento. A expansão de um bloco nas séries individuais
(aquecimento em pirâmide, dropset, 21s, rest-pause, AMRAP, isometria, unilateral)
acontece em runtime, em `src/domain/setPlan.ts`.

## Stack

React 19 + TypeScript + Vite + Tailwind + Recharts, localStorage com backup em OPFS.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=== GITIGNORE ===
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.vercel

================================================================================
## BLOCO 28 — 4172 chars
================================================================================

Suas medidas são internamente consistentes — trocanter até o chão dá 93,5 cm = **52,5% da estatura**, exatamente na faixa normal de 50–53%. Isso significa que você achou os pontos ósseos certos. Os dados são confiáveis.

E eles contam uma história bem definida.

## Você é construído para agachar

| Medida | Você | Média | Leitura |
|---|---|---|---|
| Fêmur / altura | **24,7%** | 26–27% | fêmur curto |
| Fêmur : tíbia | **1,04** | 1,15–1,25 | fêmur curto |
| Altura sentado / altura | **55,1%** | ~52% | tronco longo |

Fêmur curto + tronco longo é a combinação que permite agachar **ereto**: menos inclinação de tronco, menos braço de momento no quadril, menos exigência lombar, profundidade IPF mais fácil de atingir. Duas medidas independentes concordam (a razão fêmur/altura não depende da minha estimativa de altura do tornozelo, e chega na mesma conclusão que a razão fêmur:tíbia).

**Isso reformula completamente seu agachamento travado.** Você tem alavancas de agachamento acima da média e está em 250 kg — abaixo do seu supino em termos proporcionais de potencial. Agachamento parado + alavanca favorável + nunca ter feito um programa de powerlifting = o problema é **técnica e programação, não anatomia**. Essa é a maior reserva de progresso que você tem, e é justamente o lift que você disse estar estagnado.

Um adendo: fêmur curto com tronco longo favorece **high bar** mais do que na média das pessoas — o argumento do Matt Vena pró-high bar se aplica a você com mais força do que ao lifter genérico. Não vou mandar você trocar ainda, mas fica registrado como candidato forte.

## Braços longos: bom no terra, caro no supino

**Índice de macaco +6 cm (103,4%).** Braço total de 56 cm.

No **terra**, braço longo encurta a amplitude e sobe a posição inicial — favorece **convencional**. Some a isso seu quadril estreito (37 cm), que é desfavorável ao sumo (sumo gosta de quadril largo e braço curto). Você puxa sumo hoje, mas suas alavancas apontam para convencional — o que, por coincidência, é a posição do Matt Vena *e* a escolha do Pana. Não vou trocar seu estilo com base só em régua; é hipótese a testar com carga, e vou montar o teste.

## O supino explica sua lesão

**Úmero:antebraço = 1,24** (média 1,15–1,20). Úmero longo dentro de um braço já longo — essa é a pior alavanca possível para supino, porque amplitude e estresse de ombro escalam com o comprimento do úmero.

Agora o ponto: você migrou pra pegada wide "estilo Pana" e lesionou o peito **perto da articulação do ombro**. Isso é a inserção do peitoral no úmero, e é exatamente o tecido que uma pegada larga demais sobrecarrega no fundo do movimento.

Fazendo a conta com seus números: pegada no máximo legal de **81 cm** deixa suas mãos **16,5 cm para fora de cada ombro**, o que com um úmero de 31 cm exige ~**32° de abdução horizontal**. Para um úmero longo, esse é o ângulo onde a junção peitoral-úmero recebe o pico de tensão.

Faixa que suas alavancas suportam:

| Pegada | Largura | Leitura |
|---|---|---|
| 1,4× ombro | **67 cm** | conservadora — provável ponto de partida na volta |
| 1,5× ombro | **72 cm** | padrão para o seu biacromial |
| 1,6× ombro | 77 cm | larga |
| máximo IPF | 81 cm | **provavelmente é onde você se machucou** |

Seu ombro largo (48 cm) te dá licença para usar *alguma* largura — mas o úmero longo cancela boa parte dessa licença. Quando você medir a pegada atual, se ela estiver em 78–81 cm, temos causa e efeito fechados.

Duas ressalvas honestas: isso é inferência a partir de alavancas, não observação de você levantando — vou querer ver vídeo dos três levantamentos antes de fechar qualquer mudança técnica. E você mesmo notou que os 48 cm de ombro podem estar subestimados pela musculatura das costas; se for mais largo, a faixa de pegada sobe proporcionalmente.

---

**Status:** Whisper em 10/79 (~2h30 restantes). Pesquisa de elites: Pana e powerbuilding natural fechados, roster IPF e frameworks de coaches ainda rodando. Quando tudo fechar, eu cruzo Vena × Pana × consenso de elite × evidência e monto o programa.

Quando puder, me manda a **pegada atual de supino** e, se der, **vídeo de lado** dos três levantamentos numa série pesada.

================================================================================
## BLOCO 29 — 3949 chars
================================================================================

Três frentes rodando em paralelo (programa + gerador, Firestore, empacotamento da base). Enquanto constroem, o desenho fechado:

## A tese do Bloco 1

**A prioridade não é ficar mais forte. É ficar legal.** Os ~73 kg entre declarado e legal são força que você já tem e não expressa dentro da regra — aprendizado técnico responde em semanas, adaptação fisiológica em anos. Nenhum outro bloco da sua carreira vai ter esse retorno por esforço.

## A correção mestra — e ela reorganiza tudo

Você agacha a **40° da vertical estando 5-8 cm ACIMA do paralelo**. Descendo até a profundidade legal com a mesma mecânica, você iria a ~50°. Suas alavancas pedem **30-38°**.

> Você está agachando ~15° mais inclinado do que suas alavancas exigem. Herdou o padrão de quem tem fêmur longo, sem ter fêmur longo.

E a inclinação extra não vira carga: o vídeo mede o good-morning involuntário — joelho abre de 90° para 150° com o **tronco parado a 40°**, pernas quase travadas e tronco ainda fletido; o tronco só ergue no último frame.

**Portanto profundidade e ângulo de tronco são UMA correção, não duas.** O excesso de inclinação é *a razão* pela qual a profundidade parece difícil — você gasta a amplitude de quadril antes de chegar lá embaixo. Isso também mantém a regra de uma variável por levantamento.

Duas consequências que corrigem o que eu te disse antes:

- **O cue-bandeira do canal ("STOP TRYING TO SQUAT UPRIGHT") não se aplica a você.** A direção da sua correção é a inversa da doutrina do Vena. O cue certo, esse sim dele: **empurrar os joelhos para frente e para fora na saída do buraco** — nunca "peito para cima" nem "quadril para baixo", que ele diz explicitamente que não funcionam.
- **O pin squat sai.** Eu tinha te dito que você já fazia o acessório nº 1 do Vena. Errado: **zero claims sobre box/pin/Anderson squat em 3.154** — o canal não usa a ferramenta. O que ele prescreve é sempre **pausa livre**, nunca parada morta em suporte. E seus pinos estão a ~105 cm quando a profundidade legal para 178 cm fica em 98-103. Você treina uma parcial que para exatamente antes da faixa onde é mais fraco.

## A semana

| Dia | Principal 1 | Principal 2 | Ênfase |
|---|---|---|---|
| D1 | Agacho low bar — **força** | Supino — **volume** | Remada |
| D2 | Supino — **força** | Terra sumo — **prática** | Puxada vertical |
| D3 | Agacho **high bar** — **volume** | Supino — **prática** | Leg press |
| D4 | Terra sumo — **força** | Supino — **volume** | Stiff-legged + posterior |
| D5 | Agacho pausa acima do paralelo (livre, 1 s) | — | **Estética** |

Agacho 3× · supino 4× · terra 2×. Papéis de sessão do Pana: força 88-92% single + back-offs, volume 70-80% × 5-7, prática 40-70%.

**Semanas 1-3 são calibração** — o papel "força" roda com teto de RPE (6, depois 7, depois 8) em vez de percentual, porque single a 90% de um máximo desconhecido é chute perigoso. O máximo legal sai por extrapolação, nunca por tentativa máxima.

**High bar entra na semana 1** e não é volume neutro: força tronco mais ereto, que é exatamente a direção que você precisa. É o corretivo, não um acessório.

## O que fica deliberadamente de fora

- **Pegada de supino.** Fechar não devolve amplitude (o delta de +4,7 cm mudou a ADM em 0,42 cm — ~1%; o ganho de força foi real). A ré foi o *delta*, não a largura, e a cota de variável do supino já foi gasta com a pausa.
- **Trocar sumo por convencional.** E o motivo é melhor do que eu tinha: **a antropometria não decide o estilo** — o braço de momento no quadril é o mesmo nos dois, braço longo e fêmur curto são neutros, e **tronco longo pesa contra o convencional**. Fica stiff-legged em dose mínima a RPE 4-5, com critério de corte definido.

E a advertência mais importante do corpus para o seu caso: **valide o sumo no padrão de competição antes de comparar estilos** — comparar um sumo inflado por equipamento contra um convencional novo enviesa o teste na direção errada.

Volto quando os agentes fecharem.

================================================================================
## BLOCO 30 — 3935 chars
================================================================================

scripts/build-program.mjs
scripts/exercise-map.mjs
src/App.tsx
src/assets/react.svg
src/components/ui/Badge.tsx
src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/index.ts
src/components/ui/NumericInput.tsx
src/components/ui/RPESelector.tsx
src/components/ui/ScaleSelector.tsx
src/contexts/StorageContext.tsx
src/data/exerciseMuscleMap.ts
src/data/exercises/definitions.ts
src/data/exercises/powerbuilding.ts
src/data/program/builders.ts
src/data/program/index.ts
src/data/program/macrocycles.ts
src/data/program/powerbuilding2/generated.ts
src/data/program/powerbuilding2/source/COMPLETE_WORKOUTS.md
src/data/program/powerbuilding2/source/WARMUP_ROUTINE.md
src/data/program/powerbuilding2/warmup.ts
src/data/program/programs.ts
src/data/program/progression.ts
src/data/programData.ts
src/domain/blockTypeConfig.ts
src/domain/dayTypeLabels.ts
src/domain/exerciseRegistry.ts
src/domain/muscleGroupLabels.ts
src/domain/painRegions.ts
src/domain/rpe.ts
src/domain/setPlan.ts
src/domain/setTypeLabels.ts
src/domain/surveyConfig.ts
src/domain/volumeTargets.ts
src/features/analytics/components/ChartShared.tsx
src/features/analytics/components/E1rmChart.tsx
src/features/analytics/components/MacrocycleFilter.tsx
src/features/analytics/components/PRTable.tsx
src/features/analytics/components/TotalChart.tsx
src/features/analytics/components/VolumeStackedChart.tsx
src/features/analytics/components/VolumeTargetBars.tsx
src/features/analytics/hooks/useAnalyticsData.ts
src/features/analytics/hooks/useE1rmChartData.ts
src/features/analytics/hooks/useEstimatedTotal.ts
src/features/analytics/hooks/usePRTableData.ts
src/features/analytics/hooks/useVolumeChartData.ts
src/features/analytics/types.ts
src/features/feedback/components/AIFeedbackCard.tsx
src/features/feedback/components/AlertsBanner.tsx
src/features/feedback/components/ReadinessIndicator.tsx
src/features/feedback/components/TrendSparklines.tsx
src/features/feedback/hooks/useFeedbackHistory.ts
src/features/feedback/hooks/useSurveyTrends.ts
src/features/survey/components/index.ts
src/features/survey/components/PainSelector.tsx
src/features/survey/components/PostWorkoutSurveySheet.tsx
src/features/survey/components/PreWorkoutSurveySheet.tsx
src/features/survey/components/SupplementChecklist.tsx
src/features/survey/hooks/index.ts
src/features/survey/hooks/usePostSurvey.ts
src/features/survey/hooks/usePreSurvey.ts
src/features/workout/components/AddExercisePanel.tsx
src/features/workout/components/CompletedSetsList.tsx
src/features/workout/components/ExercisePrescriptionCard.tsx
src/features/workout/components/PRFlashBanner.tsx
src/features/workout/components/RestTimer.tsx
src/features/workout/components/SetEditSheet.tsx
src/features/workout/components/SetInputForm.tsx
src/features/workout/components/WorkoutHeader.tsx
src/features/workout/hooks/useLoadSuggestion.ts
src/features/workout/hooks/useRestWarning.ts
src/features/workout/hooks/useSetCompletion.ts
src/features/workout/hooks/useWorkoutSession.ts
src/features/workout/hooks/useWorkoutSurveys.ts
src/hooks/useVolumeTracking.ts
src/index.css
src/main.tsx
src/pages/Analytics.tsx
src/pages/Calendar.tsx
src/pages/Dashboard.tsx
src/pages/Settings.tsx
src/pages/Warmup.tsx
src/pages/Workout.tsx
src/services/aiPrompts.ts
src/services/aiService.ts
src/services/feedbackOrchestrator.ts
src/services/LocalStorageService.ts
src/services/opfs.ts
src/services/scheduling.ts
src/services/storage.types.ts
src/services/storage/core.ts
src/services/storage/dataTransfer.ts
src/services/storage/feedbackRepository.ts
src/services/storage/index.ts
src/services/storage/init.ts
src/services/storage/profileRepository.ts
src/services/storage/recordRepository.ts
src/services/storage/sessionManager.ts
src/services/storage/settingsRepository.ts
src/services/storage/surveyRepository.ts
src/services/storage/workoutRepository.ts
src/types/index.ts
src/utils/calculations.ts
--- LOC ---
   15356 total

================================================================================
## BLOCO 31 — 3807 chars
================================================================================

Duas sínteses juntas, e elas me dão as **travas de segurança** do programa.

## Cardio: o agente pegou uma dedução que o próprio Vena não faz

A prescrição dele: piso de 5–10 min/dia, baseline de 60 min/semana, alvo confortável de **2 h/semana**, zona 2 (60–70% da FC máxima), **baixo impacto obrigatório** — bike, escada, caminhada inclinada. Corrida desaconselhada. Depois do treino, em dias de inferiores sem inferiores no dia seguinte.

Ele mesmo faz 220 min/semana, 100% zona 2 — 2 a 3,7× o que recomenda, e admite estar "no limite superior". E **reverteu sobre alta intensidade**: já fez HIIT a 90% e blocos a 85%, hoje diz que *"adaptações de topo não transferem para o powerlifting"*.

**Mas aqui está o ponto que te interessa.** A história dele é de alguém que **perdeu** 40 h/semana descarregando caminhões, viu a capacidade de trabalho desabar, e usou cardio para reconstruí-la. **Você ainda tem o trabalho pesado.** Pelo próprio raciocínio dele, seu retorno marginal do cardio é muito menor — mas ele nunca faz essa dedução, porque nunca considerou esse caso.

Somando ao fato de que **13 dos 14 elites da IPF não fazem condicionamento estruturado** (a exceção é militar), a posição dele é minoritária e o mecanismo já está coberto no seu caso. Vou prescrever o piso mínimo, não os 220 min.

Registro uma honestidade do agente: as duas correções do platô dele (cardio e corte de volume) foram **simultâneas**, e ele se contradiz sobre qual pesou mais. A contribuição isolada do cardio é indeterminada.

Outros números: descanso **5 min** agacho/terra e **3 min** supino, cronometrado — mas o argumento dele é trade-off de tempo, e ele **admite que os estudos favorecem descansos mais longos**. E: **estresse alto dobra o tempo de recuperação** (2 → 4 dias).

Nenhuma menção a TDAH ou estimulantes em todo o corpus de 178 vídeos.

## Lesão: "zerado" não é alta

Essa é a mais importante para você agora.

> **Alta não é ausência de dor. Alta é executar o supino de competição, com pegada de competição, velocidade normal, amplitude completa — e progredindo.**

Você não está lá: sua pausa é de 0,20 s, você nunca supinou sob comando, e o tecido pós-lesão está **desaclimatado**. Lesão prévia é o único preditor de lesão validado (n=1900).

O modelo dele: rehab = **gestão de carga + "cope"**, e diz que "mentalidade resiliente + ir mais leve + voltar devagar" resolve ~95% dos casos. Alvo de dor ~2/10 — mas **o critério não é o número, é a derivada**: mover o máximo possível *desde que os sintomas estejam em tendência de queda*. Pico isolado é ruído; picos frequentes ou platô significam reduzir mais.

Ferramenta técnica central: **desacelerar**. Força no tendão ≈ peso × velocidade. Tempo e pausas permitem carga alta com pouca tensão tendínea — que é exatamente por que tempo bench e long pause bench apareceram em tier A.

E o dado sobre o seu lift: **o supino dele é sensível a intensidade, não a volume.** Singles pesados foram o que sempre inflamou as lesões dele. Isso fecha com as quatro tentativas fracassadas de "menos volume, mais intensidade" no supino.

## A regra que restringe o programa inteiro

> **Mudanças de forma vão no setup, nunca sob carga. Uma variável por levantamento. Mover a pegada lentamente, dando tempo de aclimatação.**

Isso é uma trava dura sobre o que eu estava prestes a montar. Você tem uma fila grande de mudanças — profundidade, posição de barra, high bar, pausa real, cortar o lockout de 11 s, testar convencional, pegada. **Introduzir tudo junto viola a regra dele e é justamente o mecanismo que te machucou da última vez** (o delta abrupto de +4,7 cm).

O programa vai precisar **sequenciar** essas mudanças, não empilhá-las. Vou tratar isso como restrição de projeto, não como detalhe.

Três sínteses rodando: nutrição/peso, mentalidade e diversos.

================================================================================
## BLOCO 32 — 3720 chars
================================================================================

    1869 /tmp/t.txt
[00:03] I spent over 3 years not hitting a single PR in large part due to injuries. At my worst, I couldn't even squat and deadlift 2/3 of my max. So, I want to talk about some of the things I learned about helping me get over injuries that I've also applied to many of my clients over the years because frankly, there's a lot of out there about injuries. So, what I found is it mainly comes down to two factors. One is load management and second is cope. Like seriously, learning proper coping mechanisms and how to have a more calm
[00:33] and resilient mindset around pain are huge. But first, let's talk about load management. Now, this is pretty simple. We need to manage loads so we're not aggravating the tissue. We do want to still keep moving though. I think most people know that complete rest is not the best idea when it comes to injuries. So, the question becomes, how heavy do we load it? So, what I find is you need to find the threshold where you can keep it moving, experiencing some light discomfort is okay and possibly even better, but also not make it worse. You know, you should still be seeing progress from session to
[01:04] session. Now, the rough heuristic I found is about a 2 out of 10 level of pain is usually good for most people. That's around the right workload. But again, every person and every injury is different, so it might take some adjusting. Again, you're looking to be making progress session to session, slowly adding more load without increases in pain. And it's just like with lifting where you might have the occasional spike in pain here and there, right? If you have one weak session, that doesn't mean your program's not working. Similarly, if you have one more painful session, that doesn't mean your rehab program isn't
[01:34] working. If it's happening very often, of course, you're going to want to reassess things, but you know, just keep in mind, don't freak out every single time your pain gets worse. And when I talk about load management, you know, reducing weight is just one way you could do it. There are other things as well. You should probably be doing less volume, too, but you could also look at modifying your exercises with things like adding pauses or maybe variations that are less painful. You could have back pain that makes it hard for you to do a low bar squat, but high bar feels fine. That's a great way to work it. But again, don't go too far off the deep
[02:05] end with this because if you have to avoid, you know, certain uh descending too fast or you can't do low bar at all, right? Did you really rehab the injury if you can't do these certain movement patterns? No, I would say you didn't. The other big issue I see is people just try to come back way too quickly and just re-aggravate their injury. So, they end up in sort of a cycle where they start to feel better, they push it too hard, and they go back to square one, and they just drag out injuries way too long. I did this a lot, admittedly, and I look back and I kind of cringe thinking about, you know, how much
[02:36] smoother my progress and how much, you know, suffering from the pain I would have had to endure if I just kept my ego a bit better in check. So again, make sure you you keep your ego in check. Don't push too hard. Now, the second thing I want to talk about when it comes to load management is you'll see a lot of people talk about these exercises, right? Do this stretch or do this strengthening exercise and it'll fix your pain. Oh, you've got this tight muscle. You've got this imbalance. You you know, all these things that frankly, are just hypotheses with no
Shell cwd was reset to /Users/brunnovert/Documents/Dev/powerlifting-app

================================================================================
## BLOCO 33 — 3652 chars
================================================================================

Exit code 1

/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useRestWarning.ts
  30:7  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useRestWarning.ts:30:7
  28 |
  29 |     if (shouldShowRestWarning(lastCompleted.date, restDays)) {
> 30 |       setShowRestWarning(true);
     |       ^^^^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  31 |       setRecommendedDate(getNextTrainingDate(lastCompleted.date, restDays));
  32 |     }
  33 |   }, [storage]);  react-hooks/set-state-in-effect

/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useWorkoutSurveys.ts
  19:9  error    Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

/Users/brunnovert/Documents/Dev/powerlifting-app/src/features/workout/hooks/useWorkoutSurveys.ts:19:9
  17 |       const postSurvey = storage.getPostSurveyForWorkout(workout.id);
  18 |       if (postSurvey) {
> 19 |         setPhase('done');
     |         ^^^^^^^^ Avoid calling setState() directly within an effect
  20 |       } else {
  21 |         setPhase('post');
  22 |       }  react-hooks/set-state-in-effect
  33:6  warning  React Hook useEffect has a missing dependency: 'workout'. Either include it or remove the dependency array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              react-hooks/exhaustive-deps

✖ 3 problems (2 errors, 1 warning)

================================================================================
## BLOCO 34 — 3646 chars
================================================================================

=== ### TEMPLATE D1 (Agacho pausado NA profundidade legal · Supino volume · Costas · Extensores) ===
  Agachamento Low Bar (Profundidade Legal)     2 x 3          {AG-P}         RPE {RPE-AG}
  Supino Pausado (Competição)              {SUP-V1} x 5          {SUP-V1-PCT}   RPE {RPE-SUP}
  Floor Press (Barra)                        {FP-SETS} x 8          N/A            RPE {FP-RPE}
  Remada Unilateral com Halter                 4 x 6-8        N/A            RPE 9
  Puxada Vertical                              4 x 8-10       N/A            RPE 9
  Stiff-Legged Deadlift                        1 x 8          N/A            RPE 4-5
  Extensão Lombar (Hiperextensão)            3 x 10-15      N/A            RPE 9
  Elevação Lateral (DB)                      2 x 10-15      N/A            RPE 9
  Rosca na Polia                               2 x 8-12       N/A            RPE 9

=== ### TEMPLATE D2 (Força de Supino · Gauge e Prática de Terra · Costas) ===
  Supino Pausado (Competição)                1 x {SUP-F-REPS} {SUP-F}        RPE {RPE-SUP}
  Supino Pausado (Competição)                4 x 3          {SUP-F-BO}     RPE {RPE-SUP-BO}
  Terra Sumo (Sem Strap)                       1 x 5          {TER-G}        RPE {RPE-TER-G}
  Terra Sumo (Sem Strap)                       3 x 3          {TER-P}        RPE 6
  Puxada Vertical (Pegada Neutra)              4 x 5-8        N/A            RPE 8
  Face Pull na Polia                           3 x 15-20      N/A            RPE 8
  Tríceps Overhead na Polia                   3 x 10-12      N/A            RPE 8

=== ### TEMPLATE D3 (Gauges · High Bar secundário · Supino prática) ===
  Agachamento Low Bar (Profundidade Legal)     1 x 7          {AG-G}         RPE {RPE-AG}
  Agachamento High Bar                         8 x 5          {AG-V}         RPE {RPE-AG}
  Supino Pausado (Competição)                1 x 7          {SUP-G}        RPE {RPE-SUP}
  Supino Pausado (Competição)                4 x 3          {SUP-P}        RPE 6
  Leg Press 45°                               3 x 10-12      N/A            RPE 9
  Mesa Flexora                                 4 x 10-12      N/A            RPE 9

=== ### TEMPLATE D4 (Agacho Low Bar PRIMÁRIO · Supino volume · Ombro e Braço) ===
  Agachamento Low Bar (Profundidade Legal)     1 x {AG-F-REPS} {TOP-AG}       RPE {RPE-AG}
  Agachamento Low Bar (Profundidade Legal)   {AGBO} x 3          {BO-AG}        RPE {RPE-AG-BO}
  Supino Pausado (Competição)              {SUP-V4} x 7          {SUP-V4-PCT}   RPE {RPE-SUP}
  Floor Press (Barra)                        {FP4-SETS} x 8-10       N/A            RPE {FP4-RPE}
  Tríceps Testa                               3 x 10-12      N/A            RPE 9
  Elevação Lateral (DB)                      3 x 10-15      N/A            RPE 9
  Rosca na Polia                               3 x 8-12       N/A            RPE 9

=== ### TEMPLATE D5 (Terra sumo FORÇA · Braço, ombro e peito alongado) ===
  Terra Sumo (Sem Strap)                       1 x {TER-F-REPS} {TOP-TER}      RPE {RPE-TER}
  Terra Sumo (Sem Strap)                       3 x 3          {BO-TER}       RPE {RPE-TER-BO}
  Supino Inclinado com Halter                {PEC-SETS} x 8-10       N/A            RPE {PEC-RPE}
  Crucifixo no Peck Deck                     {PEC-SETS} x 12-15      N/A            RPE {PEC-RPE}
  Elevação Lateral (DB)                      4 x 10-15      N/A            RPE 9
  Rosca Inclinada (DB)                         3 x 8-10       N/A            RPE 9
  Rosca Martelo                                3 x 10-12      N/A            RPE 9
  Tríceps Overhead na Polia                   3 x 10-12      N/A            RPE 9

================================================================================
## BLOCO 35 — 3631 chars
================================================================================

## Pegada na época da lesão

Recalculando com as larguras de dedo que o agente mediu (2,46 / 2,19 / 2,01 / 1,84 cm):

| | Indicador–indicador | × ombro | Legal IPF? |
|---|---|---|---|
| Hoje | 65,2 cm | 1,36× | sim, 16 cm de folga |
| Na lesão | **~69,9 cm** | **1,46×** | **sim, 11 cm de folga** |

A mudança foi de **+4,7 cm (7,2%)**. E 1,46× a largura de ombro é pegada competitiva **normal** — não é extrema por nenhum critério.

Então a hipótese "pegada larga demais" está morta. O que sobra é a **transição, não a posição final**: abrir 4,7 cm de uma vez, sob carga alta, muda o padrão de carga do peitoral (mais abdução horizontal, músculo mais alongado no fundo) sem dar tempo de adaptação ao tendão. Machuca a mudança abrupta, não a largura em si. Já repassei isso ao agente do supino com instrução de checar controle excêntrico, perda de retração escapular e assimetria — e de verificar se o vídeo é anterior ou posterior à lesão medindo a pegada nele.

---

## Agachamento — e aqui tem um problema sério

`IMG_5300` é o pin squat; os outros dois são supino.

**As três reps falham em profundidade. Não é marginal: você está 4 a 8 cm acima da profundidade legal IPF.** No frame do fundo, o eixo do fêmur inclina 9–10° *para cima* na direção do quadril, e o centro do quadril fica ~7 cm acima do centro do joelho. Os pinos estão 5–8 cm acima da posição de competição. Como as três reps morrem no mesmo pino, a profundidade é idêntica nas três.

**A consequência desconfortável: seus 250 kg são provavelmente uma parcial.** Sob juiz IPF, o número real seria menor. Isso significa que os 683 kg de total e o GL 92,3 que calculei estão otimistas — não sei ainda por quanto, e não vou chutar. Vamos descobrir quando você agachar na profundidade válida.

**E a explicação do platô ficou clara.** Suas alavancas (fêmur 24,7% da altura, fêmur:tíbia 1,04, tronco 55,1%) preveem 30–38° de inclinação de tronco na profundidade legal. Você está a **40° estando ainda acima do paralelo** — ou seja, 15° mais inclinado do que sua anatomia exige. Some a isso o hip shoot que aparece na tira de 12 fps: o joelho abre de 90° para 150° com o tronco parado em 40°. As pernas travam antes do tronco subir.

**A inclinação é erro técnico, não restrição de alavanca.** É exatamente o que eu tinha suspeitado pelas medidas, agora confirmado em vídeo.

As três falhas, com o custo estimado de cada uma:

1. **O terço inferior da amplitude nunca é treinado** — ~20–25 kg. Você é forte no que treina e cego onde não vai.
2. **Inclinação excessiva + hip shoot** — ~15–20 kg.
3. **Nenhum padrão de powerlifting** — ~10 kg. Sem walkout, sem posição inicial travada, sem cinto, e 4 s relaxado no pino apagando a pressão intra-abdominal.

Boas notícias reais: sua trajetória de barra é vertical sobre o médio-pé (desvio de só 3 cm), lockout completo, descida controlada sem rebote. A base é boa.

**Expectativa: +20 a +40 kg em 2–3 blocos apenas reorganizando padrão e amplitude — sem construir um grama de músculo novo.**

---

Duas coisas de você:

**Refilmar o agachamento**, porque a regra de barra de 2026 ficou indeterminada — o disco de 45 cm cobre o ombro em 100% dos frames. Preciso de **vídeo de trás, a 45°, na altura do ombro**. A estimativa indireta deu low bar sobre a espinha da escápula (provavelmente legal), mas com erro de ±5–8 cm, maior que a própria regra. É risco em aberto.

**Um agachamento livre, sem pino, numa série pesada**, filmado de lado na altura do quadril. O pin squat não me deixa ver profundidade real, largura de base, ângulo de pé, valgo nem seu sticking point verdadeiro.

Os 18 lotes de extração seguem rodando.

================================================================================
## BLOCO 36 — 3579 chars
================================================================================

Fechou o agente de frameworks de coaches — 72 mil palavras de arquivo, e com ele já consigo **arbitrar o conflito Vena × Pana** com evidência em vez de preferência. Esse era o nó do projeto.

## Quem está certo em quê

**Deload — e aqui o Vena se sai melhor do que eu esperava.**
O único RCT direto em levantadores treinados (Coleman 2024) achou que o grupo que fez deload ficou **mais fraco**, e sem ganho psicológico. Os estudos de ressensibilização do Ogasawara terminaram empatados. Ao mesmo tempo, 100% dos atletas de elite pesquisados fazem deload. Resolução: deload se justifica por **fadiga, articulação e aderência — não por adaptação**, e deve ser **reativo** (por gatilho), não a cada 4 semanas no calendário. O "nunca faço deload" do Vena não é a loucura que parece; o "deload obrigatório todo bloco" do Pana paga o custo do Coleman sem o gatilho.

**RPE — os dois exageram.**
A validade da escala é boa (r = −0,88), mas a *acurácia* é feia: erro de 2,05 reps no RPE 9 e 5,15 no RPE 5. E superioridade **não está demonstrada** — o único RCT bem pareado (Helms 2018) deu nulo. O `"RPE IS FOR P*SSIES"` do Vena e o `"sem dúvida a melhor forma de treinar"` do Pana estão ambos além do que os dados sustentam. Híbrido vence: **percentual define o plano, RPE limita o dia**, e só confiável em ≤5 reps.

**Alta frequência — o Vena está superestimando o mecanismo.**
Grgic 2018: vantagem de frequência (ES 0,74 → 1,08) **colapsa para p = 0,421 quando o volume é equalizado**. Só membro superior sobrevive. Frequência é majoritariamente um *veículo de entrega de volume*, não um efeito próprio. Interseção defensável: **supino 3–4×, agachamento 2–3×, terra 1–2×**. Os 6× SBD dele funcionam pra ele, mas não pelo motivo que ele acredita.

**Reps — e é aqui que a síntese aparece.**
Vena nunca passa de 2 reps; Pana exige dia de 5–7 reps como pilar de hipertrofia. Os dois podem estar certos ao mesmo tempo, porque **força e hipertrofia têm curvas de dose diferentes**: força satura em ~5–9 séries/exercício/semana e é indiferente à proximidade da falha; hipertrofia continua pagando até 12–20+ séries e melhora perto da falha.

Ou seja — **básicos pesados, poucas reps, longe da falha (Vena está certo para força); hipertrofia vem dos acessórios, muitas reps, perto da falha (Pana está certo sobre a necessidade, errado sobre o veículo).** Isso não é um meio-termo covarde entre os dois: é a única posição consistente com as duas curvas, e é literalmente a definição de powerbuilding feito direito. Serve seu 80/20 sem que um objetivo canibalize o outro.

**Singles pesados — nenhum extremo sobrevive.**
O estudo que costumam citar contra (Mattocks 2017) foi em **destreinados, 8 semanas**. A restrição real é o U-invertido do González-Badillo 2006: 93 reps acima de 90% bateram tanto 46 quanto 184, com volume equalizado. Dose pequena e limitada, concentrada na fase de intensificação.

**Landmarks de volume (MEV/MAV/MRV) não têm nenhum estudo de validação** — as próprias páginas da RP dizem "médias baseadas na nossa experiência". O princípio se sustenta; os números não.

Uma advertência que vale registrar: **nenhum estudo compara tolerância a volume ou recuperação entre naturais e usuários.** "Natural precisa de menos volume" é heurística razoável com zero suporte direto. Vou tratar como heurística, não como lei.

---

**Status:** Whisper 16/79 (~2h). Falta só o roster IPF entre os agentes de pesquisa. Os 25 agentes de extração disparam quando o Whisper fechar.

Manda supino e agachamento quando gravar — o de frente no supino é o que decide a questão da pegada.

================================================================================
## BLOCO 37 — 3573 chars
================================================================================

1	import { Info, Repeat } from 'lucide-react';
2	import type { ExerciseLog } from '../../../types';
3	
4	interface ExercisePrescriptionCardProps {
5	  exercise: ExerciseLog;
6	  /** Variações que o programa permite, com os ids correspondentes. */
7	  alternatives?: { name: string; exerciseId: string }[];
8	  onSwapVariation?: (exerciseId: string, exerciseName: string) => void;
9	}
10	
11	/**
12	 * Mostra a linha do programa exatamente como está no material de origem:
13	 * séries de aquecimento, séries de trabalho, reps, %1RM, RPE, descanso e a
14	 * nota completa. É a parte que garante que nada da prescrição se perca.
15	 */
16	export function ExercisePrescriptionCard({
17	  exercise,
18	  alternatives,
19	  onSwapVariation,
20	}: ExercisePrescriptionCardProps) {
21	  const chips: { label: string; value: string }[] = [];
22	
23	  if (exercise.warmupSets) chips.push({ label: 'Aquec.', value: `${exercise.warmupSets}` });
24	  chips.push({
25	    label: 'Séries',
26	    value: `${exercise.prescribedSets}${exercise.perSide ? ' /lado' : ''}`,
27	  });
28	  chips.push({ label: 'Reps', value: exercise.prescribedReps });
29	  if (exercise.percent1RM) chips.push({ label: '%1RM', value: exercise.percent1RM });
30	  chips.push({ label: 'RPE', value: exercise.prescribedRPE });
31	  if (exercise.restLabel) chips.push({ label: 'Descanso', value: exercise.restLabel });
32	
33	  return (
34	    <div className="bg-bg-card border border-border rounded-lg p-3 space-y-2">
35	      <div className="grid grid-cols-3 gap-1.5">
36	        {chips.map((chip) => (
37	          <div key={chip.label} className="bg-bg-tertiary rounded px-2 py-1.5 text-center">
38	            <div className="text-[9px] font-display uppercase tracking-wider text-text-muted">
39	              {chip.label}
40	            </div>
41	            <div className="text-sm font-mono font-bold text-text-primary">{chip.value}</div>
42	          </div>
43	        ))}
44	      </div>
45	
46	      {exercise.prescribedNotes && (
47	        <div className="flex gap-2 items-start bg-accent-blue/5 border border-accent-blue/20 rounded px-2 py-1.5">
48	          <Info size={13} className="text-accent-blue flex-shrink-0 mt-0.5" />
49	          <p className="text-xs font-display text-text-secondary leading-relaxed">
50	            {exercise.prescribedNotes}
51	          </p>
52	        </div>
53	      )}
54	
55	      {alternatives && alternatives.length > 0 && onSwapVariation && (
56	        <div className="flex items-center gap-1.5 flex-wrap">
57	          <Repeat size={12} className="text-text-muted" />
58	          <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
59	            Variação:
60	          </span>
61	          {alternatives.map((alt) => {
62	            const active = exercise.exerciseId === alt.exerciseId;
63	            return (
64	              <button
65	                key={`${alt.exerciseId}-${alt.name}`}
66	                type="button"
67	                onClick={() => onSwapVariation(alt.exerciseId, alt.name)}
68	                className={`px-2 py-1 rounded text-[11px] font-display transition-colors ${
69	                  active
70	                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
71	                    : 'bg-bg-tertiary text-text-secondary border border-border hover:border-accent-gold/40'
72	                }`}
73	              >
74	                {alt.name}
75	              </button>
76	            );
77	          })}
78	        </div>
79	      )}
80	    </div>
81	  );
82	}
83	

================================================================================
## BLOCO 38 — 3506 chars
================================================================================

=== file-history/a255bdcd ===
total 1616
drwxr-xr-x  32 brunnovert  staff    1024  8 ago 23:05 .
drwxr-xr-x  18 brunnovert  staff     576  8 ago 14:10 ..
-rw-r--r--   1 brunnovert  staff   48315  8 ago 18:41 090307f2a5870815@v1
-rw-r--r--   1 brunnovert  staff   48974  8 ago 18:44 090307f2a5870815@v2
-rw-r--r--   1 brunnovert  staff    2934  8 ago 18:21 17affe84e123438b@v2
-rw-r--r--   1 brunnovert  staff    4534  8 ago 19:45 2e27d76aafa090be@v2
-rw-r--r--   1 brunnovert  staff    4037  8 ago 18:21 2e2ab7e016d18d04@v2
-rw-r--r--   1 brunnovert  staff    4710  8 ago 16:10 40ceee2c18bcaed8@v2
-rw-r--r--   1 brunnovert  staff   31178  8 ago 23:05 45abcc8e317fa6b4@v2
-rw-r--r--   1 brunnovert  staff   13807  8 ago 19:45 5df9fc4fe24dfcc6@v2
-rw-r--r--   1 brunnovert  staff    1448  8 ago 19:30 6946c279598e0634@v1
-rw-r--r--   1 brunnovert  staff    1529  8 ago 19:45 6946c279598e0634@v2
-rw-r--r--   1 brunnovert  staff    7639  8 ago 14:10 79f1ab2616633a0f@v2
-rw-r--r--   1 brunnovert  staff    7916  8 ago 15:08 79f1ab2616633a0f@v3
-rw-r--r--   1 brunnovert  staff    3344  8 ago 19:30 9ae8a3999c00b23a@v1
-rw-r--r--   1 brunnovert  staff    6793  8 ago 19:45 9ae8a3999c00b23a@v2
-rw-r--r--   1 brunnovert  staff    7219  8 ago 19:45 a2ccc0440cca736c@v2
-rw-------   1 brunnovert  staff   23759  8 ago 15:43 ad7e77b2adb6f7bc@v1
-rw-------   1 brunnovert  staff   30541  8 ago 15:45 ad7e77b2adb6f7bc@v2
-rw-------   1 brunnovert  staff   34323  8 ago 15:59 ad7e77b2adb6f7bc@v3
-rw-r--r--   1 brunnovert  staff    5657  8 ago 19:45 c647b9644223dc53@v2
-rw-r--r--   1 brunnovert  staff   22073  8 ago 16:25 dd507e7e75d4852c@v1
-rw-r--r--   1 brunnovert  staff   22201  8 ago 18:21 dd507e7e75d4852c@v2
-rw-r--r--   1 brunnovert  staff   22520  8 ago 18:44 dd507e7e75d4852c@v3
-rw-r--r--   1 brunnovert  staff  141939  8 ago 18:36 e10481a3920d140c@v1
-rw-r--r--   1 brunnovert  staff  141937  8 ago 18:41 e10481a3920d140c@v2
-rw-r--r--   1 brunnovert  staff    1414  8 ago 19:45 e2ab7c92fc77cef8@v2
-rw-r--r--   1 brunnovert  staff   14292  8 ago 14:10 e6b9b68e8bfc1da9@v2
-rw-r--r--   1 brunnovert  staff   34649  8 ago 15:08 e6b9b68e8bfc1da9@v3
-rw-r--r--   1 brunnovert  staff   37099  8 ago 15:41 e6b9b68e8bfc1da9@v4
-rw-r--r--   1 brunnovert  staff   37882  8 ago 15:45 e6b9b68e8bfc1da9@v5
-rw-r--r--   1 brunnovert  staff    5432  8 ago 15:08 f8aa1562c6d68ac9@v2

=== tasks/a255bdcd ===
total 128
drwxr-xr-x  19 brunnovert  staff  608  8 ago 18:44 .
drwxr-xr-x  11 brunnovert  staff  352  8 ago 09:59 ..
-rw-r--r--   1 brunnovert  staff    0  8 ago 09:59 .lock
-rw-r--r--   1 brunnovert  staff  342  8 ago 10:10 1.json
-rw-r--r--   1 brunnovert  staff  372  8 ago 14:51 10.json
-rw-r--r--   1 brunnovert  staff  492  8 ago 14:57 11.json
-rw-r--r--   1 brunnovert  staff  427  8 ago 14:57 12.json
-rw-r--r--   1 brunnovert  staff  412  8 ago 14:51 13.json
-rw-r--r--   1 brunnovert  staff  460  8 ago 18:44 14.json
-rw-r--r--   1 brunnovert  staff  538  8 ago 16:09 15.json
-rw-r--r--   1 brunnovert  staff  453  8 ago 16:17 16.json
-rw-r--r--   1 brunnovert  staff  348  8 ago 13:08 2.json
-rw-r--r--   1 brunnovert  staff  410  8 ago 13:37 3.json
-rw-r--r--   1 brunnovert  staff  331  8 ago 10:59 4.json
-rw-r--r--   1 brunnovert  staff  399  8 ago 14:05 5.json
-rw-r--r--   1 brunnovert  staff  457  8 ago 13:49 6.json
-rw-r--r--   1 brunnovert  staff  360  8 ago 18:44 7.json
-rw-r--r--   1 brunnovert  staff  363  8 ago 13:37 8.json
-rw-r--r--   1 brunnovert  staff  440  8 ago 14:51 9.json

================================================================================
## BLOCO 39 — 3475 chars
================================================================================

Dá para saber a **estrutura**, não os números. E vale dizer por quê, porque a razão é a mesma que governa o Bloco 1.

## O que decide o Bloco 2 são quatro medições que ainda não existem

A base é explícita: **o bloco acaba por RPE, não por calendário** (R65, R70, R125, R126 — quando o que era leve vira RPE 7 beirando 8 no mesmo esquema, testa, reseta mais leve, começa outro). Então quem escreve o Bloco 2 é o Bloco 1:

1. **A profundidade legal virou automática?** É a tese. Se sim, o Bloco 2 muda de variável. Se não, ele **repete a mesma variável** — você não passa de fase que não fechou. Isso é decisão de dado, não de vontade.
2. **O que o peitoral fez.** A derivada da dor ao longo de 16 semanas decide se o eixo de peito alongado continua crescendo ou se o supino vira protocolo de gestão.
3. **Os três números do simulado.** É ali que toda aquela discussão de estimativa morre: você sai com agacho, supino e terra **medidos** no padrão legal. Nunca mais precisamos chutar.
4. **A revisão da semana 8.** Se a rampa envelhecer antes da hora, o próprio Bloco 1 é cortado e o 2 começa mais cedo.

## O que já dá para afirmar, com fonte

- **A virada muda 2–3 coisas, não 10**, e no máximo uma variável técnica por levantamento (R63, R166, R114, R125, R108, R170). É restrição do modelo.
- **O reset de início de bloco É o deload** (R33, R29, R126, R133): parte-se de ~95% da força corrente, pela fórmula `82% − 2% por rep`. Por isso não existe semana de deload no meio.
- **Blocos ficam mais curtos conforme você avança**, não mais longos — a literatura aponta 6–12 semanas e Israetel diz 3–4 de acumulação para muito avançados. As 16 semanas do Bloco 1 já são a aposta contestável; o Bloco 2 provavelmente é menor.
- **A progressão dupla de Hepburn** — a regra mais testada de toda a base, n=6, usada com centenas de lifters — **não está sendo usada no Bloco 1**, que progride por percentual em rampa. Ela é a candidata natural para o supino do Bloco 2.

## O que eu apostaria, e marco como aposta

**O Bloco 2 muda o eixo para o terra.** Três razões convergem: é o levantamento que o Bloco 1 menos ataca (2×/semana, 8 séries, só 4 de força — a dose mínima); a regra nova de lockout geométrico da IPF 2026 é a que mais muda para sumo e tem **zero cobertura na base**; e o seu 260 com 5 s travado diz que é ali que está a sobra.

**O Bloco 3 é preparação de prova de verdade** — mais curto, taper específico por levantamento (o único dado que existe sobre sumo é o modelo FLEXX: sumo treinado até 72 h antes, contra 9–10 dias do convencional), tentativas ensaiadas e comandos dados por terceiro.

Na aritmética: 18 semanas são ~4 meses. Sobram ~8 meses, o que comporta bem Bloco 2 + preparação, com folga para um bloco a mais se algo atrasar.

## A ressalva honesta

**A base não tem macrociclo anual.** É uma lacuna declarada (G21) — 178 vídeos e nenhum plano de 12 meses. Então qualquer periodização anual que eu te entregasse hoje seria extrapolação minha vestida de citação, que é exatamente o que a arquitetura do projeto inteiro existe para evitar.

E é por isso que a conversa semanal é o mecanismo, não o plano. Não precisamos saber o Bloco 2 hoje: precisamos que o Bloco 1 produza os dados que o escrevem. O que eu faria de concreto é marcar **a semana 8** como o primeiro ponto em que essa conversa deixa de ser especulativa — lá você já vai ter cinco leituras de gauge por levantamento e um histórico de dor, e aí dá para falar de Bloco 2 com número na mão.

================================================================================
## BLOCO 40 — 3433 chars
================================================================================

Síntese de supino fechou, e ela é a mais diretamente acionável para o seu histórico.

## O que ataca sua lesão

**Não repousar totalmente é a recomendação dele** — usar **tempo e pausas**, porque a tensão no tendão depende de peso *e velocidade*. Ele viveu anos com tendinite de peitoral treinando através de dor pequena e, nas palavras dele, *"ficou patinando, sem progresso e sem melhora da dor"*.

Dado que vale registrar: **90% da "dor de bíceps" em powerlifters é tendinite de peitoral** na inserção. Se você sentir algo ali, já sabe.

Acessórios, com tier list dele:

| Tier | Exercício | Por quê |
|---|---|---|
| **S** | **Close grip bench** | Mais amplitude, previne overuse, vira exercício de tríceps |
| **A** | **Tempo bench (5 s excêntrico)** | **Reduz estresse tendíneo e alivia ombro — o mais relevante pro seu caso** |
| **A** | **Long pause bench** | Controle de pausa; 2 s reais ≈ contagem de 4 |
| B | Larsen, Spoto, inclinado | |
| D | Declinado | |

E um princípio que muda a estrutura: **a ~70% do 1RM o peitoral já satura**; tríceps e deltoides só ativam perto do máximo. A conclusão dele é muito supino submáximo + isolamento **só de tríceps e deltoide**. Ele não faz nenhum isolamento de peitoral. Para você, que quer estética, isso é uma tensão a resolver — mas para força a lógica é sólida.

## Sobre pegada, ele me contraria

Preciso temperar minha própria inclinação anterior. Eu vinha sugerindo estreitar. O dado dele: **81% dos homens da categoria open no Mundial usam pegada a menos de um dedo do máximo legal.** Ele destrói o dogma dos "stacked joints" — só um recorde IPF raw foi feito com essa configuração — e conclui que tudo se resume a alavancas individuais, achadas por **tentativa e erro**.

Ele **nunca conecta largura de pegada a comprimento de úmero**. Essa ligação é minha inferência, não posição dele, e o dado dos 81% empurra na direção oposta. Vou tratar sua pegada de 65,2 cm como aberta para teste — não como algo a corrigir. A regra que fica é a do ritmo: **máximo 1 cm por vez, mantendo 3–4 semanas.**

## Duas correções baratas

**O erro nº 1 no supino, segundo ele, é leg drive — e a causa costuma ser banco escorregadio.** Ele credita **+30 lb em um ano** só a replicar o banco de competição com tapete antiderrapante. Leg drive não é impulso: é tensão estática horizontal cravando **trapézio e pescoço** no banco, com o quadril flutuando. Ele chama isso de "o cue mais subestimado".

**Arco: sim, mas o argumento dele não é cortar amplitude** — é estabilidade e transferência do leg drive. Só o suficiente para pôr peso nos trapézios, 1 a 2 polegadas. Ele alerta que treinar só com técnicas que exploram alavanca "prejudicou seriamente muitos lifters", citando estudo em que o grupo de amplitude completa ficou mais forte **até nas amplitudes parciais**.

**Trajetória:** diagonal até a base do esterno, com flare na subida — reduz **35%** da demanda de flexão de ombro. O cue é mover os **cotovelos** em direção à cabeça, nunca a barra.

E **supino sempre primeiro na sessão** — menos fadiga sistêmica, prioriza o lift pior, e o arco aquece o quadril para o agachamento.

## Lacunas do canal para o seu caso

Ele não cobre: regras IPF 2026, praticar o comando com terceiro (só faz pausas autocontroladas), lesão aguda de inserção de peitoral (só tendinite), e pegada em medida absoluta. Essas eu preencho com a pesquisa de regras e com os frameworks.

Quatro sínteses rodando.

================================================================================
## BLOCO 41 — 3417 chars
================================================================================

Essa síntese endereça o seu risco central de frente.

## A tensão que define seu programa

Matt Vena diz que a diferença nº 1 entre quem chega e quem fica intermediário para sempre é **obsessão** — quanto da vida é organizada em torno do treino. Ele planejava trabalho e faculdade em torno das sessões.

E, ao mesmo tempo, os 38 meses parados dele são a autópsia de **excesso**. Ele foi de 15 séries semanais (pico de 30) para **6**, e bateu PR em 2 meses.

A resposta literal dele a quem já faz muito e pergunta o que mais fazer: **"nada — não se estresse mais."**

A leitura que resolve isso, e que vou usar: **a obsessão vai na adesão, não no volume por sessão.** Você tem motivação de sobra — ela precisa ser gasta em fazer o básico com consistência por anos, não em adicionar séries.

O mecanismo prático que ele dá é bonito: **+2,5 kg por semana em vez de +20 kg de uma vez, "porque gera 8 semanas de sucessos em vez de uma."** E errar sempre pelo conservador, para que o plano seja executável até no dia ruim.

Um sintoma que ele descreve e que vale você monitorar: quando o volume passava do recuperável, a força dele flutuava tanto dia a dia que ele **duvidava de si mesmo, porque não sabia sua própria força até começar a levantar**. Volume recuperável → consistência → confiança → resultado.

## Os erros do intermediário vitalício

Três diferenças controláveis que ele lista: dedicação, **baixo neuroticismo** (não surtar a cada revés; "minimizar dias ruins" mantendo sono, calorias e proteína e seguindo o programa), e manter-se saudável — porque tempo de reabilitação é tempo roubado da construção.

E um quarto, nomeado separadamente: **program hopping** — *"uma das maiores formas de acabar como intermediário vitalício"*. Depois de dez anos alternando entre Nippard, PHAT, Evolve e o treino deste projeto, essa é a que mais te ameaça. O que vou montar precisa durar 16 semanas sem você mexer.

A proporção que ele dá: **básico = 80% do progresso, dedicação extrema = +10%, individualização = os últimos 10%.**

E o único conselho de conteúdo dele para intermediários: retornos decrescentes são mais fortes no lado neural que no muscular, então **o intermediário tem mais a ganhar ficando maior**. No seu caso específico há uma exceção — a análise de vídeo mostrou que você tem reserva neural grande e não explorada (profundidade, padrão, pausa). Você tem as duas alavancas.

## Uma autocrítica que o agente fez ao nosso próprio método

O vídeo *"The PROBLEM With Science Based Lifting"* é crítica à **divulgação**, não à ciência — e o agente concluiu que não atinge o que estamos fazendo, já que cruzar evidência com prática é literalmente o método dele.

Mas atinge um risco concreto no meu trabalho: **comparar séries por semana sem normalizar por RIR.** As 42 séries semanais de supino dele a 12–15 RIR não são comparáveis a 42 séries a 2 RIR. Isso vale para todas as tabelas de volume que eu te apresentei — e vou explicitar RIR junto de qualquer número de séries no programa.

## Sobre seu TDAH

**Zero menções a TDAH ou medicação nos 196 vídeos.** O mais próximo são intervenções atencionais que ele usa e que servem bem: **cronometrar o descanso, não usar celular entre séries, ler entre séries**. Vou incorporar — cronometrar descanso resolve dois problemas seus de uma vez (dispersão e os 11 s de lockout no supino).

Falta uma síntese (diversos). Depois dela, cruzo tudo e monto o programa.

================================================================================
## BLOCO 42 — 3407 chars
================================================================================

=== _header.md (     263 palavras) ===
# Elite IPF (Drug-Tested) Powerlifters — Comparative Methodology Knowledge Base

Compiled 2026-08-08. Companion to `natural_powerbuilding.md` (physiology/evidence) and the Tarinidis research.

**Purpose.** Build a comparative picture of how the best drug-tested powerlifters in the world actually train, so a natural lifter targeting IPF world records can design a program from convergent elite practice rather than from theory or from enhanced-lifter templates.

**Why this population specifically.** These athletes ARE the drug-tested population. Their practices transfer to a natural lifter with no adjustment for pharmacology — unlike most publicly available powerlifting programming, which comes from untested lifters.

---

## How to read this file


=== sec_context.md (    2272 palavras) ===
## Context: The IPF Record Landscape (as of 2026)

This section grounds "targeting IPF world records" in actual current numbers, so the program design has a real target rather than an abstraction.

### Men's Classic (raw) Open — key classes

| Class | Lift | Record | Holder | Meet / date | Source |
|---|---|---|---|---|---|
| 74 kg | Squat | 341 kg | Austin Perkins (USA) | 2026 SBD Sheffield | [Fitness Volt](https://fitnessvolt.com/austin-perkins-breaks-raw-squat-deadlift-and-total-ipf-world-records-win-2026-sbd-sheffield-powerlifting-championships/) |
| 74 kg | Deadlift | 343 kg | Austin Perkins (USA) | 2026 SBD Sheffield | same |
| 74 kg | Total | 891.5 kg | Austin Perkins (USA) | 2026 SBD Sheffield (341 / 207.5 / 343) | same |
| 83 kg | Squat | 338 kg | Russel Orhii (USA) | 2025 | [BarBend](https://barbend.com/news/russel-orhii-ipf-raw-world-record-squat-321-kilograms/), [Fitness Volt](https://fitnessvolt.com/russel-orhii-321-kg-raw-squat-world-record/) |

=== sec_supplement.md (     960 palavras) ===
## Supplement: directly-verified training snapshots

These were fetched independently of the per-athlete dossiers and are included because they are rare instances of *specific loads at a specific distance from a meet* — the hardest thing to source in this whole project. Media "training watch" articles are third-party observation, not the athlete's own words, so treat loads as accurate but interpretation as inference.

### Taylor Atwood — squat session, 4 weeks out from 2025 Nationals
Source: https://barbend.com/news/taylor-atwood-squat-training-2025-powerlifting-nationals/

- Meet: 2025 Powerlifting America Raw Nationals, Atlanta GA, 3–6 April 2025. Class: 83 kg (**recently moved up from 74 kg**).
- Session: four lighter warm-up sets, then **3 sets of 3 reps at 225 kg**, then **1 set of 6 reps at 225 kg**.
- Accessories that session: belt squats (quad focus), standing leg curls (2 sets per leg), adductor machine.
- Reference points: competition squat PR **302.5 kg** (2021 USAPL Raw Nationals); recent total 830 kg at 2024 Scary Strong 3 as an 83 kg lifter.
- Article contains **no RPE, no bodyweight, and no direct programming quotes** from Atwood. The only quote is that he "expressed that he was pleased with his work under the bar."

=== raw/ ===
eastern_bloc.md
rts_tsa.md

=== tamanhos ===
     263 _header.md
   10952 elite_pana.md
   10060 ipf_reality.md
    7215 natural_powerbuilding.md
    2272 sec_context.md
     960 sec_supplement.md
   31722 total
Shell cwd was reset to /Users/brunnovert/Documents/Dev/powerlifting-app

================================================================================
## BLOCO 43 — 3400 chars
================================================================================

**Mapa completo:** https://claude.ai/code/artifact/f3b34606-3535-4386-a61c-aadf5a7733f3

Aqui o resumo do que importa.

## O que as 18 semanas fazem

**A variável do bloco é execução legal, não carga.** É a frase que explica todo o resto. Suas marcas foram feitas em condições que a IPF não aceita, e o bloco existe para converter isso em algo que um árbitro valida — e só então medir quanto sobra.

- **S1–S3, calibração.** Três semanas, três instrumentos diferentes, um por semana. Você não recebe carga nenhuma: descobre por RPE. Não existe single nas duas primeiras, de propósito.
- **Gate entre a S3 e a S4.** Extrapola pelas três âncoras e grava a **mediana, nunca a maior**. Âncora colhida em rep fora do padrão legal é descartada e a semana se repete.
- **S4–S16, treze semanas em que só a carga muda.** Top set 86% → 92%. Seis pontos percentuais em treze semanas. Exercícios, reps, frequência e estrutura de dia congelados.
- **S17, taper de 10 dias.** Acessório a zero. Terra sai 10 dias antes, agacho 7, supino 5.
- **S18, simulado.** Três tentativas, partindo da terceira e voltando pelas médias reais da IPF.

Cinco dias: D1 prática de agacho e volume de supino · D2 o único dia de força de supino · D3 dia dos instrumentos e high bar · D4 agacho primário · D5 força de terra.

## O que a base me ensinou de fato

Três coisas mudaram o desenho de verdade:

**Sem deload.** O canal rejeita (R102), e o único RCT direto em treinados mostrou o grupo *com* deload mais fraco. Não existe semana de deload no bloco.

**SBD longe da falha, acessório perto dela.** Robinson 2024: força é indiferente à proximidade da falha (β=0,003), hipertrofia não é. **É esse achado que paga suas 11 séries de bíceps e 9 de deltoide lateral sem custar um quilo de agacho** — os dois não recebem crédito nenhum do SBD, então o volume é aditivo. É o mecanismo pelo qual força e estética param de competir.

**O gap de 100 lb academia→prova no terra (R174).** Melhor terra dele em prova, 672 lb; na academia, 765 lb. Ele mesmo nomeia os componentes: strap, anilha grossa, whip de barra, touch-and-go. É a peça mais valiosa da base inteira e é o que ancora sua estimativa de terra.

## Duas coisas que eu não esperava

**A base contraria o senso comum do powerlifting com mais frequência do que o confirma.** Rejeita corretivos e "causa raiz", rejeita periodização em blocos, rejeita MEV/MAV/MRV como quantidade mensurável ("busca no PubMed: zero resultados"), e diz que sub-estímulo por medo de fadiga é tão comum quanto excesso.

**E ela é muda exatamente onde o seu caso precisa.** Box squat e pin squat: **zero claims em 3.154** — todo trabalho de altura fixa que ele prescreve é pausa livre. Tempo em lockout de supino: zero. Programação para sumo: essencialmente zero. Regras da IPF 2026: todos os vídeos são anteriores, e o lockout geométrico do terra é justamente o que mais muda para sumo. Protocolo de lesão de peitoral: não existe.

Por isso o programa tem **43 invariantes recomputadas pelo build**. Onde a base cala, o número tem que ficar visível e conferível — senão vira convicção disfarçada de citação.

E uma que vale repetir: **o cue-bandeira do canal não se aplica a você.** "STOP TRYING TO SQUAT UPRIGHT" é a tese de agacho dele, e o seu fêmur curto exige *menos* inclinação, não mais. A direção da correção é invertida no seu caso, e isso está escrito dentro do programa em vez de escondido.

================================================================================
## BLOCO 44 — 3333 chars
================================================================================

Correção importante, e é minha.

Eu te disse mais de uma vez que **o Matt Vena migrou de low bar para high bar**. Ele não migrou. Ele **compete low bar** — abertura de 360 kg — e adotou high bar como **~50% do volume de treino**. Os dois vídeos são "por que adicionei high bar como variação", não "por que troquei". Eu tinha lido os títulos, não o conteúdo.

Isso muda a recomendação para você: não é troca, é **coexistência**.

## Como ele realmente usa

Na tier list dele:

- **High bar para quem compete low bar = S tier**
- **Low bar para quem agacha high bar = D tier**

O motivo declarado não é o que eu supunha. Não é "mais quadríceps" — ele faz questão de corrigir isso, porque low bar também satura quadríceps. É **menos dominante de quadril**, e portanto **poupa a cadeia posterior**, que já apanha do terra. O ganho é acumular muito mais prática do padrão com menos fadiga.

E há uma regra dura de execução: **cuear high bar com a mesma stance e a mesma inclinação do low bar.** Nunca estreito, ereto, joelho à frente. Se você fizer high bar "estilo halterofilista", perde o ponto.

## O diagnóstico dele bate exatamente com o seu vídeo

Sobre hip shoot, a posição dele é contraintuitiva: **não resista.** O problema não é o quadril subir primeiro — é o *shift*. O critério que ele dá: *"joelhos e quadril sobem, mas a barra não sobe nem desce."*

No seu vídeo, o joelho abre de 90° para 150° com o tronco parado em 40°. Isso é a descrição literal do defeito que ele aponta.

O cue principal: **empurrar os joelhos para frente e para fora, sem deixá-los recuar.** E ele observa que *"pensar dos joelhos para cima funciona melhor do que cuear quadril e peito"*.

A correção estrutural que ele dá para inclinação excessiva é uma só: **barra mais alta nas costas.**

Sobre profundidade, ele lista três causas — mobilidade, estabilidade e **confiança** — e dá um teste: agachar sem peso segurando num apoio. Segundo ele, 90% dos "problemas de tornozelo" somem. E aqui está a única exceção declarada ao anti-purismo dele: ***"em profundidade de agachamento vale ser rígido."***

Também derruba um dogma que talvez você carregue: *"trajetória reta é mentira"* — a curva para frente na descida é esperada, e mais pronunciada quanto mais inclinado você agacha.

## O que isso significa para você

Você é o caso invertido: tem alavancas de agachador ereto executando padrão de fêmur longo. E a inclinação extra está sendo **desperdiçada no shift** em vez de carregada nos extensores de quadril. A profundidade falhada é sintoma, não doença — joelho que recua significa que o quadríceps não dirige através do sticking point.

O formato fiel ao método dele seria **coexistência**: high bar pausado no dia secundário, low bar no dia pesado. Não troca abrupta.

Mas registro a ressalva dele mesmo, porque é honesta e vai contra o entusiasmo: **intermediários e avançados raramente ganham com mudança de padrão**, e *"se em algumas semanas, executando direito, não parecer melhor, não vai parecer nunca."* Isso vira o critério de decisão do teste, com prazo definido.

**Lacuna crítica:** o Matt Vena nunca menciona regras da IPF — nem profundidade, nem a regra de posição de barra de 2026. Toda a camada de conformidade vem da pesquisa de regulamento, não dele.

Duas sínteses rodando. Continua pendente: sua academia tem mesa flexora?

================================================================================
## BLOCO 45 — 3313 chars
================================================================================

Essa síntese resolve o seu agachamento de um jeito que eu não esperava.

## Você já faz o acessório nº 1 dele — só que como levantamento principal

O acessório favorito do Matt Vena para agachamento é o **above parallel pause squat**: parar ~2 polegadas acima do paralelo, 1 segundo. Nas palavras dele: *"se alguma coisa me fez agachar 700 lb, foi isso."*

Seu pin squat está **4 a 8 cm acima da profundidade legal, com pausa morta de 3–4 s**. Ou seja: você está executando o acessório de maior valor do arsenal dele — mas como se fosse seu agachamento principal, e é por isso que os 250 kg não são um agachamento de competição.

A correção não é abandonar o movimento. É **reclassificá-lo**: ele vira acessório, e entra agachamento em profundidade válida como principal. Você não perde o trabalho que já vinha fazendo, só para de contá-lo como se fosse outra coisa.

## High bar: a recomendação é mais forte do que eu tinha dito

**High bar é S-tier e item fixo em todo cliente low bar dele. Metade do volume de agachamento dele é high bar.** Mesma stance, mesma inclinação do low bar.

Agora são três argumentos independentes convergindo pra você: suas alavancas (fêmur curto, tronco longo), a regra IPF 2026 (low bar extremo virou ilegal), e a prescrição padrão dele para quem agacha low bar.

Prioridade de agachamento dele, na ordem: **high bar → above parallel pause squat → pause squat no buraco → cadeira extensora → tempo squat → front squat**.

Sobre a extensora ele é categórico: *"quadríceps maior é o fator nº 1 do agachamento, não existe segredo."* Isso é conveniente pra você, que quer estética.

## Duas coisas que eu tinha lido errado no canal

**"Pare de treinar seus pontos fracos"** não é o que o título sugere. É sobre **sticking points**, não fraquezas. O argumento: algo *tem* que ser o elo mais fraco, e corrigir um sticking point causado por alavanca custa o seu ponto forte. **Fraqueza muscular e fraqueza de posição merecem acessório; sticking point por alavanca, não.**

**"Nunca usei máquinas"** é retrospectivo, não recomendação. Ele fez 760 lb sem máquinas, mas hoje usa extensora e mesa flexora, uma série à falha em cada.

E o maior erro que ele vê em atletas: **especialização precoce nos três levantamentos.** Rigidez excessiva de movimento *prejudica* o aprendizado motor. Depois de dez anos de Nippard e PHAT, isso joga a seu favor — sua variedade de padrões é ativo, não passivo.

## Seu setup aguenta quase tudo

Analisando contra sua academia: **nada crítico se perde.**

- Sem GHD → ele mesmo diz não achar necessário nada específico de lombar
- Sem SSB → **front squat** cobre a mesma função (dorsal alto)
- Sem hack squat → **leg press 45°** serve; ele diz que "alguns leg press são melhores que alguns hacks"
- Halteres só até 40 kg → incline com barra, o benefício citado é o ângulo
- Banco comercial escorregadio → **tapete antiderrapante**, e ele credita +30 lb a isso

**A única perda real seria a mesa flexora.** Ele é explícito que o agachamento não treina isquiotibiais (crescimento nulo em estudos), e não há substituto de baixa fadiga.

**Sua academia tem mesa flexora?** Você citou puxada, leg press deitado e em pé, mas não mencionou. Se não tiver, preciso resolver isso — e como você puxa sumo hoje, seus isquios importam ainda mais.

Três sínteses rodando.

================================================================================
## BLOCO 46 — 3284 chars
================================================================================

Essa é a síntese que eu estava esperando. Ela responde a pergunta que realmente importa.

## Você está no limiar exato entre a Fase 2 e a Fase 3 dele

Matt Vena encerrou a Fase 2 com **585/315/600 lb = 680 kg de total**.

Você tem **683 kg** (551/379/573 lb) — com supino proporcionalmente mais forte que o dele naquele ponto.

É o mesmo lugar. E o que veio depois, para ele, foi **o trecho mais produtivo de toda a carreira**: alta frequência com volume alto submáximo, que o levou de 680 kg para 700/405/765 lb.

*(Com a ressalva que já levantamos: seus 683 kg provavelmente estão um pouco inflados por profundidade, pausa e straps. Isso te coloca talvez um degrau antes, não depois — o que só reforça a conclusão.)*

## E aqui está a armadilha que quase todo mundo cai

**O erro mais provável seria copiar o programa ATUAL dele.**

As 5 séries semanais de agachamento e terra que ele faz hoje não são o que o levou de 680 kg a 951 kg. São a **solução de um agachador de 700 lb com capacidade de trabalho destruída por três anos de lesão**. Ele é explícito sobre essa condição de contorno.

O trajeto dele completo:

| Fase | O que fazia | Resultado |
|---|---|---|
| 0. Starting Strength | 3×5 diário | 0 → 315/175/315 lb em 3-4 meses. Depois **5 meses a mais rendendo +10 lb no agacho e ZERO em supino e terra** — hoje chama de "maior desperdício de tempo" |
| 1. Búlgaro | Agacho+supino 6 dias, single RPE 8-9 | 325 → 355 lb. Supino travou. **Terra estagnou de vez** |
| 2. Programação própria | Top double + muitas duplas back-off | 400/200/400 → **585/315/600 lb** ← **você está aqui** |
| **3. Alta freq. + volume alto** | **SBD 6 dias/semana**, até 51 séries/sem | **345→700 agacho, 175→405 supino, 365→765 terra** |
| 4. Platô | 15-30 séries/sem | **38 meses sem PR** |
| 5. Volume mínimo | 15 → 5 séries/sem | PR em 2 meses, 700→760 em 8 meses |
| 6/7. Hoje, 120 kg | 90% submáximo + isolamento à falha | 951 kg de total |

Sobre a Fase 3, que é a sua próxima, ele diz hoje: *"não era ótimo, mas é honestamente a razão de eu estar onde estou."*

Ou seja: ele não recomenda o volume absurdo da Fase 3 — mas reconhece que foi ela que construiu a base. E rejeita com igual força o extremo oposto: Starting Strength e programas de baixo volume em geral.

O seu programa vai morar **entre a Fase 3 e a versão madura dela** — alta frequência com volume alto e submáximo, sem os excessos que o levaram à doença no Nacional de 2019.

## As reversões que mais te protegem

Foram catalogadas **33**. As que mais importam para você:

1. *"Volume máximo recuperável sempre vence"* → **falso**, e foi a causa do platô de 38 meses
2. **Agachamento e terra no mesmo dia** → dias separados. O terra dele ficou anos atrás por pré-fadiga
3. **Supino com menos volume e mais intensidade** — tentou **quatro vezes**, regrediu 40, 20 e 15 lb com dor de ombro nas tentativas. Voltou ao alto volume submáximo e bateu 207,5 kg
4. **Zero máquinas de perna por 10 anos** → hoje usa extensora e mesa flexora

E a causa raiz de **21 das 33 reversões**: ficar mais forte em termos absolutos derruba a tolerância a volume. Traduzindo para você — o volume que funciona agora não é o que vai funcionar aos 800 kg de total. O programa tem que ter mecanismo de reavaliação embutido.

Cinco sínteses rodando.

================================================================================
## BLOCO 47 — 3227 chars
================================================================================

Análise do supino fechou, e ela **corrige algo que eu te disse**.

Eu sugeri que parte do seu ganho de força com a pegada mais aberta poderia ser mecânico, por encurtamento de amplitude. O agente calculou: a abertura de +4,7 cm encurtou a ADM em **0,42 cm — cerca de 1%**. Isso é irrelevante. **Seu ganho de força foi real, não artefato de amplitude.**

E isso reforça a hipótese principal em vez de enfraquecê-la: você ficou genuinamente mais forte → passou a carregar mais → sobre um tecido que ainda não tinha adaptado ao novo padrão de carga.

## O achado novo, e é o mais acionável

**Você segura ~11 segundos em lockout antes de iniciar a descida — nos dois vídeos.** Isso é carga isométrica quase máxima antes da repetição sequer começar. Você chega no fundo já fatigado, toda vez.

Isso é 100% corrigível e não custa nada. Correção: *tira da barra, duas respirações, um segundo, desce.* Máximo de 2 s em lockout.

## O que reprovaria sob juiz IPF

| # | Falha | Risco |
|---|---|---|
| 1 | **Sem pausa imóvel** — permanência no fundo de **0,20 s** | quase certo |
| 2 | **"Upper body thrust"** (regra nova 2026) | alto |
| 3 | Movimento descendente na subida | médio-baixo |
| 4 | Queda da caixa torácica (nova 2026) | baixo hoje |
| 5 | Glúteo / pés / cabeça | **muito baixo — seu ponto forte** |

Os 0,20 s no fundo não são pausa, são inversão de trajetória apoiada no reflexo de estiramento. Quando você for obrigado a parar 1 segundo de verdade, perde esse reflexo — e a compensação natural é justamente o thrust de tronco, que virou DQ este ano. Por isso o item 2 é risco alto mesmo você não fazendo hoje.

Ponto forte real: cabeça nunca sai, glúteo estável, pés planos e imóveis do começo ao fim. Os cinco pontos de contato estão sólidos.

## Sobre a lesão

**Excêntrica descontrolada está refutada** — 1,45 s e 3,2 s, velocidade uniforme, sem rebote. Mas é comportamento pós-lesão, então não prova o que você fazia antes.

O que resta:

- **Causa principal:** a transição abrupta de +4,7 cm sob carga alta. É o *delta*, não a posição.
- **Amplificador permanente:** seu úmero de 31 cm com arco apenas moderado. No fundo, **seu cotovelo desce até o nível da superfície do banco** e o esterno fica só 10–14 cm acima da linha do rosto. Seu peitoral trabalha em comprimento máximo em toda repetição. Isso é anatomia — não dá pra eliminar, dá pra gerenciar com mais arco.

Regra que sai disso: **nunca mude a pegada mais de ~1 cm por vez, mantendo cada largura por 3–4 semanas.**

## A lacuna que me incomoda

**Seu lado direito está 100% invisível nos dois vídeos** — a anilha oclui. E sua lesão foi unilateral. Assimetria de pressão é uma das causas mais comuns de lesão unilateral de peitoral, e eu não consigo nem confirmar nem descartar.

Preciso de mais ângulos, em ordem de prioridade:

1. **Dos pés, olhando para a cabeça** — assimetria. É a prioridade.
2. **De cima (overhead)** — flare real de cotovelo.
3. **Da cabeça, olhando para os pés** — escápulas.
4. **Lateral direita limpa**, sem anilha na frente — arco torácico vs lombar.

E do agachamento continuam pendentes: **de trás a 45°** (regra da barra 2026) e **agachamento livre de lado** numa série pesada.

Sete agentes de síntese por tópico rodando.

================================================================================
## BLOCO 48 — 3165 chars
================================================================================

Terceira correção, e essa é minha de novo.

O vídeo *"Why EVERY POWERLIFTER should DEADLIFT CONVENTIONAL"* **não é sobre estilo de competição.** A primeira frase do próprio vídeo desfaz o título:

> *"Todo mundo deveria puxar convencional. Quer dizer, você ainda pode puxar sumo na competição se for mais forte. Mas mesmo que você puxe sumo, você deveria fazer algum **treino** convencional."*

É tese de **volume de treino**. A regra de competição dele é o oposto: *"se você é melhor em alguma coisa, faça na competição — não fazer é burrice."*

A dose que ele prescreve: **20–25% do volume de terra em convencional**, pelos benefícios que transferem para o sumo *e* para o agachamento — carga nos extensores espinhais e aprendizado do *hinge*. E a assimetria é explícita: o inverso não vale. Segundo ele, **não há diferença de ativação de nenhum músculo do quadril entre os dois estilos** — o único acréscimo do sumo é quadríceps, já coberto pelo agachamento.

**E ele derruba meu argumento de alavancas.** Eu disse que seus braços longos e quadril estreito apontavam para convencional. Dentro do framework dele isso não se sustenta: ele rejeita explicitamente o raciocínio por amplitude, o braço de momento de quadril é o mesmo nos dois estilos (depende só do fêmur), e **seu tronco longo pesa CONTRA o convencional** — mais inclinação significa braço de momento espinhal maior. Largura de quadril ele nunca menciona.

A recomendação de testar convencional **sobrevive, mas por outro motivo**: você deveria estar puxando convencional 20–25% do volume de qualquer forma. O custo de oportunidade do teste é praticamente zero.

## O alerta que fecha um padrão preocupante

O agente sinalizou que seus **260–270 kg de sumo podem estar inflados** — barra com whip, anilhas grossas e straps aproximam o movimento de um block pull. O whip vira fator relevante acima de ~180 kg, e você puxa bem acima disso.

Junte com o que já sabíamos e o padrão fica claro:

| Levantamento | Marca declarada | Problema |
|---|---|---|
| Agachamento | 250 kg | **Falha profundidade IPF por 4–8 cm** |
| Supino | ~172 kg | **Sem pausa — 0,20 s no fundo** |
| Terra | 260 kg | Possível whip + anilhas grossas + straps |

**Os três levantamentos provavelmente estão inflados em relação ao padrão de competição.** Seu total real de plataforma é menor que 683 kg, e o GL 92,3 que calculei está otimista.

Isso não é má notícia — é calibração. E não muda nada no programa, porque a correção dos três é o mesmo trabalho: especificidade sob regra. O que muda é a **linha de base honesta** a partir da qual vamos medir progresso. Prefiro te dar um número menor e verdadeiro agora do que descobrir isso na sua primeira competição.

Método que ele dá para o teste de convencional: excêntrica lenta a 50–60% do 1RM para achar a posição inicial, stance por tentativa e erro, filmar de lado exigindo trajetória reta, **não mudar mais nada junto**. E o critério: *"se um for melhor, você percebe rápido."*

Custo de curto prazo real: **fadiga lombar**, agravada pelo seu tronco longo. Snatch grip serve de meio-termo.

Seis sínteses rodando (nutrição, cardio, lesão, evolução, mentalidade, diversos).

================================================================================
## BLOCO 49 — 3111 chars
================================================================================

=== file-history ===
total 0
drwxr-xr-x   18 brunnovert  staff   576  8 ago 14:10 .
drwx------   28 brunnovert  staff   896  9 ago 08:47 ..
drwxr-xr-x   32 brunnovert  staff  1024  7 ago 15:57 3154f853-7d2b-43e1-bf16-fff91fb91d31
drwxr-xr-x   30 brunnovert  staff   960  5 ago 17:30 5d334acc-2cdd-40c3-a1c3-252419e52905
drwxr-xr-x   29 brunnovert  staff   928  7 ago 19:26 6482bb6d-afbd-4177-92c8-2c6c4e79ad75
drwxr-xr-x   18 brunnovert  staff   576  4 ago 21:15 7326e0ff-df09-4b77-b9cf-118ea0d8a1a3
drwxr-xr-x    4 brunnovert  staff   128  7 ago 12:35 90b47070-40ae-44da-bfeb-711f36a6f167
drwxr-xr-x    8 brunnovert  staff   256  4 ago 18:43 90cbc28c-c0b1-444b-9585-3108a7b05379
drwxr-xr-x   44 brunnovert  staff  1408  6 ago 14:25 980fff00-f26a-44dd-9484-24664ff85ece
drwxr-xr-x   32 brunnovert  staff  1024  8 ago 23:05 a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed
drwxr-xr-x  111 brunnovert  staff  3552  5 ago 14:48 a3275745-4bed-49ef-9eed-756724a775b1
drwxr-xr-x   29 brunnovert  staff   928  6 ago 20:04 a3b995a6-4d75-4c07-94bc-c7599eb4f3d8
drwxr-xr-x    9 brunnovert  staff   288  5 ago 12:48 addfaa15-36f3-4e13-b64c-a66dd04a6400
drwxr-xr-x   24 brunnovert  staff   768  7 ago 09:35 b8853c02-8228-41f9-b756-fdaebea8dce0
drwxr-xr-x   35 brunnovert  staff  1120  5 ago 10:24 d5583ac3-d3a8-4b58-a96b-a808bac1b922
drwxr-xr-x   22 brunnovert  staff   704  5 ago 14:25 e13e48f1-998c-4b0d-9149-02bd797690c3
drwxr-xr-x    3 brunnovert  staff    96  4 ago 20:58 eb03b53e-37d4-4d7f-9948-977bfdef3f8e
drwxr-xr-x    6 brunnovert  staff   192  6 ago 14:05 f9ccca3d-331e-4d79-ac79-6bf73863cec3

=== backups ===
total 1560
drwxr-xr-x   7 brunnovert  staff     224  9 ago 08:47 .
drwx------  28 brunnovert  staff     896  9 ago 08:47 ..
-rw-------   1 brunnovert  staff  155924  8 ago 22:52 .claude.json.backup.1786240696017
-rw-------   1 brunnovert  staff  155924  8 ago 22:58 .claude.json.backup.1786240780743
-rw-------   1 brunnovert  staff  155924  8 ago 22:59 .claude.json.backup.1786241118313
-rw-------   1 brunnovert  staff  158407  8 ago 23:12 .claude.json.backup.1786275975055
-rw-------   1 brunnovert  staff  157652  9 ago 08:46 .claude.json.backup.1786276036025

=== tasks (só os desta sessão/projeto) ===
total 0
drwxr-xr-x  11 brunnovert  staff  352  8 ago 09:59 .
drwx------  28 brunnovert  staff  896  9 ago 08:47 ..
drwxr-xr-x   4 brunnovert  staff  128  7 ago 15:56 3154f853-7d2b-43e1-bf16-fff91fb91d31
drwxr-xr-x   4 brunnovert  staff  128  5 ago 17:19 5d334acc-2cdd-40c3-a1c3-252419e52905
drwxr-xr-x  14 brunnovert  staff  448  4 ago 21:14 7326e0ff-df09-4b77-b9cf-118ea0d8a1a3
drwxr-xr-x   4 brunnovert  staff  128  5 ago 15:30 8a8fca3d-67e9-4f5f-8f05-de06c76c228e
drwxr-xr-x  19 brunnovert  staff  608  8 ago 18:44 a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed
drwxr-xr-x   4 brunnovert  staff  128  4 ago 21:00 a3275745-4bed-49ef-9eed-756724a775b1
drwxr-xr-x  13 brunnovert  staff  416  6 ago 18:18 a3b995a6-4d75-4c07-94bc-c7599eb4f3d8
drwxr-xr-x   4 brunnovert  staff  128  5 ago 10:26 addfaa15-36f3-4e13-b64c-a66dd04a6400
drwxr-xr-x   4 brunnovert  staff  128  5 ago 13:56 e13e48f1-998c-4b0d-9149-02bd797690c3

================================================================================
## BLOCO 50 — 3090 chars
================================================================================

   qualquer célula.
3. **Três grades de rampa** de 18 linhas, uma coluna por variável.

As semanas 17 e 18 (taper de 10 dias + simulado) são **dias explícitos**: o taper muda a
estrutura, e por isso está fora da regra "só a carga varia".

> **REGRA MESTRA DE DENOMINADOR.** Todo `%` deste arquivo é **percentual do
> `trainingMax` CORRENTE** (`SPEC_REV2` §0.1), nunca do 1RM histórico e nunca das marcas
> **declaradas** 250/170/268, que não aparecem em lugar nenhum deste programa. Partida:
> **agacho 215 · supino 160 · terra 240** (`baseline.md` §4). Célula em kg é **erro de
> build**: o app recomputa em runtime.

> **O QUE É O `trainingMax`, ESCRITO AQUI E NÃO EM NOTA DE EXERCÍCIO** (`SPEC_REV2` §0.1).
> É o **maior peso que você move sem degradar o padrão legal** — o *technical max* de
> **Brett Gibbs**, que fica em **≈92–94% do máximo real**. Não é o 1RM de academia e não é
> o total projetado. **Consequência prática, e é a que morde: se você digitar o 1RM real
> no perfil em vez do máximo técnico, TODO o bloco desloca ~7% para cima** — as S4–S18 são
> percentuais dele, e 86% de um número 7% maior é 92% do número certo. O app trata
> `trainingMax` ausente como bloqueio de sugestão de carga, de propósito.
> ⚠️ **A partida do supino é a mais frágil das três**: 160 kg vem de **n = 1**, três
> datapoints (`baseline.md` §4, `design.md` §14). Trate-a como hipótese até o gate da S4;
> se a mediana das três âncoras divergir >7%, é a estimativa que estava errada, não você.

## ⚠️ A aposta mais contestável deste desenho: 16 semanas

**Isto não é consenso, e a base inteira discorda.** Vena prescreve 12–20 semanas, ideal
16 `[R40]` `[R125]` `[R4]` — e `[R4]` é **[PESSOAL]** (descrição do programa dele), não
prescrição. Todo o resto aponta para blocos mais curtos: Frontiers 2021 reporta **6–12
semanas** e 50% dos coaches de elite dizem 6–8; Sitko roda **4–5**; Perkins **5**;
Rouska **4**. **Ponto de revisão fixado na semana 8**, junto com o teto de `EXP`.

## O que o atleta precisa aceitar antes de começar

1. **O supino do Bloco 1 é medido em SÉRIES, não em quilos.** Ele entra em 22
   séries/semana desde a S1 e as **reps pausadas** vão do valor da S1 ao valor da S9 —
   os dois números são `VENA_BLOCK1_MEASURES[].repsPausadas` (**medição do gerador, não
   digitada aqui**, SPEC §3.2 regra 1); a carga sobe ~7% (`rampa_carga_supino_pct`) e a
   terceira tentativa do simulado é **+2,5 kg** sobre o melhor single da S16 (Perkins: ±0
   a 2,5 kg). `SPEC_REV2` §7-#4.
2. **Pré-condições, não conforto** (`SPEC_REV2` §6): câmera **lateral** de supino,
   câmera perpendicular de agacho, micro-anilhas de 1,25 kg (par → 2,5 kg na barra),
   log de dor de peitoral por sessão em **três** momentos, e alguém para dar os comandos.
   Sem a lateral, a escala de RPE 10 de §0.3 é rótulo sem instrumento.
3. **DIAGNÓSTICO SEM CARGA, ANTES DA PRIMEIRA SÉRIE DA S1 — obrigatório e de custo zero**
   (`params_tecnica.md` §1.2; `design.md` §4). Verbatim: *"problemas de profundidade têm
   duas causas: mobilidade ou estabilidade; o teste é agachar sem peso com sua postura e

================================================================================
## BLOCO 51 — 3051 chars
================================================================================

A fórmula GL validou exata contra os quatro recordes do agente, então esses números são confiáveis.

## Sua posição real: GL 92,3

| Marco | GL | Total @87kg | Distância |
|---|---|---|---|
| Qualificar / top-10 Brasil | 85–95 | 666 kg | **você já está aqui** |
| **Campeão brasileiro** | 100 | 740 kg | +57 kg |
| Melhor brasileiro da história | 105 | 777 kg | +94 kg |
| Pódio Mundial | 110 | 814 kg | +131 kg |
| Recorde mundial 93 kg | 122,4 | 905 kg | **+222 kg** |

Duas coisas honestas, e elas apontam em direções opostas.

**A boa:** você já pontua em nível de qualificação nacional brasileira **sem nunca ter competido nem treinado powerlifting**. Campeão brasileiro está a +57 kg de total — isso é um objetivo de 1 a 2 anos para alguém com sua base, não uma fantasia.

**A dura:** o recorde mundial exige GL 122,4. O **melhor total classic da história de um brasileiro** em meet IPF é ~105 GL (Leonardo Hermisdorf, 802,5 kg aos 93). Você precisaria não só bater o melhor brasileiro de todos os tempos, mas superá-lo por ~103 kg. Na base inteira da IPF raw, **19 homens** já chegaram a GL 120. O tempo mediano do primeiro meet até GL 110 é 3,9 anos; até GL 120, 6,5 anos — e isso entre os que *chegaram lá*.

Não estou dizendo pra desistir. Estou dizendo que o alvo operacional dos próximos 24 meses é **740 kg / GL 100**, e que perseguir isso é exatamente o mesmo treino que perseguir o recorde. A divergência só aparece muito depois.

## Duas mudanças de regra de 2026 que te afetam agora

**1. O agachamento low bar extremo virou ilegal.** A barra tem que ficar *"a uma altura não inferior ao nível do deltoide posterior"*. Se você agacha com a barra num apoio bem baixo, abaixo dos deltoides traseiros, isso **não passa mais**.

Isso converge com o que suas medidas já diziam: fêmur curto (24,7% da altura) + tronco longo (55,1%) favorecem **high bar** mais que na média. Agora a regra empurra na mesma direção. É o segundo argumento independente pra migração — e o momento é ideal, já que você não tem competição marcada e o agachamento é justamente seu lift estagnado.

**2. Lockout de terra agora é geométrico:** *"o feixe anterior do deltoide deve estar atrás da projeção imaginária da barra"*. Um lockout neutro pode ser reprovado.

**E não existem 4ª tentativas na IPF.** Verifiquei nos regulamentos de 2023, 2025 e 2026. Recorde tem que sair numa tentativa normal, e conta pro total. Não existe tiro grátis.

## Aviso prático imediato

**Higenamina é banida em todo momento** (lista S3) e é ingrediente comum em pré-treino. Se você usa qualquer pré-treino, me manda o rótulo — a IPF tem taxa de resultado analítico adverso de 5,9% contra 0,80% global, e a maioria não é doping intencional, é contaminação de suplemento. **Sinefrina é legal; oxilofrina não.**

---

**Status:** todos os 5 agentes de pesquisa fecharam. Whisper ~20/79. Os 25 agentes de extração disparam assim que ele terminar.

Manda os vídeos — o de agachamento virou mais importante agora, porque preciso ver onde sua barra senta em relação ao deltoide posterior.

================================================================================
## BLOCO 52 — 3034 chars
================================================================================

Duas coisas importantes chegaram enquanto o Whisper roda.

## Correção: Pana puxa convencional, não sumo

Eu te disse que a pesquisa do Pana seria mais relevante porque vocês dois puxam sumo. **Está errado.** Ele puxa convencional e é explícito sobre o motivo — falta de mobilidade de quadril. Nas palavras dele: *"I don't pull Sumo and I'm in a weight class where 99% of the lifters do pull Sumo."*

Isso não invalida a pesquisa dele, mas muda o que você aproveita: a metodologia de programação continua totalmente aplicável, a técnica de terra não. Sua pegada wide de supino "estilo Pana" é uma questão separada e continua de pé — vou verificar contra a medida do seu úmero.

## Pana e Matt Vena se contradizem em quase tudo

Esse é o achado central até agora, e é bom que seja assim — significa que copiar qualquer um dos dois cegamente seria um erro:

| Eixo | Matt Vena | Pana |
|---|---|---|
| RPE | *"RPE IS FOR P\*SSIES"* (título de vídeo) | *"RPE is without a doubt the best way to train"* |
| Deload | *"Why I NEVER do DELOADS"* | Obrigatório ao fim de todo bloco |
| Reps nos básicos | *"Why I NEVER Do More Than 2 REPS"* | Dia de volume de 5–7 reps é pilar da hipertrofia |
| Como sustenta alta frequência | Exposições pesadas | Sessões de "prática" a 40–60% |
| Progressão | Sobrecarga sessão a sessão | Chama isso do maior erro da carreira dele |

Ambos são atletas de elite testados. Quando dois caras nesse nível discordam frontalmente, quase sempre significa que a variável real é **quem está executando**, não qual está certo. É exatamente essa a lacuna que os outros agentes estão fechando.

## Sua calibração real — e é melhor do que eu esperava

Rodei seus números contra o dump do OpenPowerlifting (750 resultados de Mundial IPF Open masculino, 2023–2026):

**Você hoje: 683 kg @ 87 kg = DOTS 449.**

| Marco | Total necessário @87kg | Distância |
|---|---|---|
| p10 do Mundial IPF | 660 kg | **você já passou** |
| p25 do Mundial | 707 kg | +24 kg |
| **Mediana do Mundial IPF** | 749 kg | +66 kg |
| p90 do Mundial | 837 kg | +154 kg |
| Recorde mundial 93kg | 904–927 kg | +221 a +244 kg |

Leia a primeira linha com atenção: **você já está acima do percentil 10 do Campeonato Mundial da IPF** — sem nunca ter feito um programa de powerlifting, sem nunca ter competido, vindo de dez anos de PHAT e Nippard. Isso é um ativo real.

A mediana do Mundial está a +66 kg. Para alguém com sua base muscular que nunca treinou especificidade, isso é um alvo de 1–2 anos, não uma fantasia.

O recorde mundial (356 / 246 / 380) exige +106 no agachamento, +73 no supino e +120 no terra. Vou ser direto: isso é um projeto de década e pode não acontecer — mas o caminho até lá passa obrigatoriamente pela mediana primeiro, e é essa a meta que vou usar para desenhar o programa. Perseguir a mediana e perseguir o recorde produzem o mesmo treino nos próximos 24 meses; só divergem depois.

Whisper em 1/79. Enquanto isso, manda as 10 medidas — elas decidem low bar vs high bar e sumo vs convencional pro seu caso específico.

================================================================================
## BLOCO 53 — 3022 chars
================================================================================

Nutrição fechou, e ela traz o contra-dado mais útil do canal.

## O experimento que derruba "ganhe peso para ficar forte"

Todo mundo cita o dado favorável dele: **+100 lb de peso corporal → +1.000 lb de total** (74 → 83 kg rendeu +100 lb em agachamento e terra em 100 dias).

Mas ele mesmo publicou o contra-dado: **depois de encher a categoria de 105 kg, agachou 760 lb e levou 18 meses até o PR seguinte — +5 lb carregando 10 a 15 kg a mais.** Nas palavras dele, *"nem foi PR em sentido absoluto"*.

E o fechamento: **o melhor ano da carreira dele foi com +2 kg no ano inteiro** — "mesmo peso, proporcionalmente mais músculo".

Some a isso o experimento de corte: **−20 lb em 6 semanas**, velocidade de barra idêntica lado a lado, acessórios à falha intactos, e **medidas musculares maiores no mesmo peso** que quando era mais leve antes.

Ou seja: os dados dele apontam para **não correr para encher a classe de 93 kg**. Isso conversa direto com o que a pesquisa de powerbuilding já tinha dito — cortar *para dentro* da classe bate crescer *para fora* dela.

## O árbitro operacional

Ele não dá alvo de percentual de gordura em lugar nenhum do canal. O que dá é uma regra de decisão, e ela é boa:

> **Ao ganhar peso, o DOTS tem que subir. Se cair, é gordura demais — reduza a taxa ou corte.**

Isso resolve sua decisão de classe sem precisar escolher agora. Você ganha devagar e deixa o número decidir.

## Números

| Parâmetro | Prescrição dele | Você hoje |
|---|---|---|
| Bulk | **250 kcal de superávit, 0,5 lb/semana (~2 lb/mês)** | — |
| Cut | 1.000–1.500 kcal de déficit, 2–3 semanas, no início do ciclo | — |
| Proteína | **1 g/lb ≈ 2,2 g/kg** | **2,53 g/kg — já acima** |
| Creatina | 5 g/dia (+1/3 na taxa de ganho, repetido 13× no canal) | ? |
| Distribuição de proteína no dia | **irrelevante** (reverteu o "40 g a cada 3 h") | — |

Sua proteína já está boa — 220 g a 87 kg é mais do que ele prescreve. Não precisa dos 300 g dele; ele mesmo diz que acima de 300 g o benefício é "bem pequeno" e não vale para a pessoa média.

**Uma ressalva importante:** as taxas de corte dele pressupõem manutenção acima de 5.000 kcal. **Você come 2.600.** Um déficit de 1.000 kcal te deixaria em 1.600 e inviabilizaria os 220 g de proteína. Ele lista essa exceção explicitamente — quem já come pouco não pode cortar fundo. Se formos cortar para os 83 kg, tem que ser mais devagar do que o protocolo dele.

E a limitação de fundo: **Vena nunca desceu de categoria.** A trajetória dele foi 74 → 83 → 93 → 105 → 120. Cortar por coeficiente é um movimento que ele nunca modelou — para isso vou usar os dados de Garthe e do roster IPF, onde corte de peso mínimo é convergência entre elites.

Sobre estética ele é mais generoso do que eu esperava: minimizar gordura **só compensa na elite**, que já não tem hipertrofia a extrair; magreza extrema traz lesão; e ele legitima explicitamente a preferência pessoal por definição como critério válido.

Duas sínteses rodando: mentalidade e diversos. Depois disso, monto o programa.

================================================================================
## BLOCO 54 — 3010 chars
================================================================================

Feito e commitado (`136582c`, `caniswim <brunnovert98@gmail.com>`). **Não dei push** — isso dispara deploy no Vercel; me fala e eu subo.

## O diagnóstico

O problema não era estilo, era hierarquia. A nota de cada bloco tem **mediana de 1.388 caracteres e máximo de 4.584**, e estava indo para a tela como um `<p>` único acima do input. Peso/reps/RPE ficavam duas telas abaixo, e você lia procedência de citação com a barra nas costas. A prescrição estava completa e ilegível ao mesmo tempo.

O que resolveu foi perceber que **o texto já tem gramática**: 100 cabeçalhos em caixa alta, 7.741 citações em formato regular, `⚠️` em 87% dos blocos, aspas marcando verbatim. Então não reescrevi o `PROGRAMA.md` — o markdown continua sendo a fonte de verdade. A UI passou a ler a estrutura que já estava lá.

## O que mudou na tela

**O `Alvo ≈ X kg` subiu para a grade de números.** Era o item mais grave: o peso que você vai colocar na barra estava no fim de um parágrafo de 4.000 caracteres, depois de tudo. Agora é o primeiro chip, em ouro.

**O card mostra só o que se lê no intervalo entre séries** — regra de parada primeiro, cue de execução depois, recortados em duas linhas cada. No pior bloco do programa (high bar, semana 4), isso significa:

```
Alvo 152,5 kg · 8×5 · RPE 8
[REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE] ⚠
encerre a série na rep que perde a profundidade legal ou…
[REGRA DURA DE EXECUÇÃO]
"programar o high bar com os mesmos cues do low bar…"
              ▸ Instruções completas · 7 seções
```

**O resto vai para folha própria**, em três grupos: *como executar* / *dose e contexto* / *procedência e ressalvas*. Cada seção com trilho colorido e título, dá para descer lendo só os títulos.

**Procedência desligada por padrão**, com toggle persistido. São ~30% da massa de texto e nenhuma se lê sob a barra — mas continuam a um toque, porque são elas que deixam auditar de onde veio cada instrução.

## A verificação

Isso é uma suposição sobre o formato de um texto, e suposição sobre texto apodrece. Virou invariante executável em `check-notes-parser.mjs`, já no `npm run build`: **todo caractere significativo da nota crua tem que reaparecer no resultado do parser**, nos 614 blocos.

Ela pagou o custo na primeira execução — pegou dois defeitos reais antes de qualquer pixel:

1. O regex consumia a citação que fecha o cabeçalho (`COMANDOS DESDE A S1 [design §13-B/R12]:`) e depois a descartava. **48 blocos perdiam texto silenciosamente.**
2. Um parêntese com citações dentro subia para o título, escapando do toggle e da contagem.

Build verde de ponta a ponta: `check:program → check:vena → validate:program → check:notes → tsc → vite build`. Validador continua em 0 erros · 41 avisos.

Duas ressalvas honestas: **não consegui ver renderizado** — a extensão do Chrome não está conectada, então verifiquei a hierarquia em modo texto, não os pixels. E o `npm run lint` tem 2 erros pré-existentes em `useRestWarning.ts` e `useWorkoutSurveys.ts`, que não toquei e não entram no build.