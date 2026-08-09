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
