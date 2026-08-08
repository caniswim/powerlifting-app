# Bloco 1 — Ficar Legal (18 semanas)

Fonte de verdade do programa. `scripts/build-vena-block1.mjs` expande este arquivo em
18 `PrescribedWeek`. **Não edite `generated.ts` à mão.**

📄 **`CONTEXTO.md`** (ao lado deste arquivo) carrega o que governa o bloco mas não é
prescrição de série: **nutrição e creatina com selo** (`design.md` §9), **aritmética de
peso corporal** (§12) e **cardio** (§13).

A estrutura tem três partes:

1. **Blocos declarativos** (`entradas`, `restricoes`, `procedencias`, `eixos`,
   `derivacoes`, `ancoras`, `calibracao`, `papeis`) — o contrato legível por máquina.
2. **5 templates de dia** (D1–D5) no formato de 8 colunas do repositório, com `{VAR}` em
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
   ângulo de pé normais segurando em algo para apoio — se não atinge profundidade nesse
   teste, é mobilidade"* `[R124 @00:00]` `[GERAL]`. **Leitura:** falhou sem peso →
   **mobilidade**, e a dose de profundidade da S1 recua até onde ela existe; passou sem
   peso → **estabilidade ou confiança**, e o acessório indicado é o agacho pausado que D1
   já prescreve — *"se passa no teste de peso corporal, o problema é estabilidade e o
   acessório é o pause squat simples"* `[R124 @00:31]` `[GERAL]`. **O MESMO TESTE ACHA A
   ABERTURA E O ÂNGULO DE PÉ**: *"esse mesmo teste serve para achar a largura de postura e
   o ângulo de pé ótimos: o que permitir agachar mais fundo provavelmente é o melhor"*
   `[R124 @00:00]` `[GERAL]`. **Anote os dois números (abertura em cm, ângulo em graus) e
   não os mexa mais durante o bloco** — é setup, e UM-EIXO vale aqui também.
4. **Sem uma segunda pessoa, o simulado não é teste de legalidade** — é teste de força, e
   deve ser rotulado assim.

---

## 0. METADADOS E CONTRATO

`entradas` são dados de entrada (tautologia por definição — o validador **não** os
compara contra constantes próprias). `restricoes` são promessas checáveis: cada chave
tem um checker em `INVARIANT_CHECKS`, e a **bijeção é exigida nos dois sentidos** —
chave sem checker ou checker sem chave é erro de build. **Não existe bloco de medição
digitada:** minutos, séries por grupo, `EXP`, razão axial e reduções do taper saem do
gerador em `VENA_BLOCK1_MEASURES`. Não há onde digitar um 47.

```entradas
programa_id                 = vena-block1
semanas_total               = 18
semanas_bloco               = 16
semanas_calibracao          = 3
dias_por_semana_bloco       = 5
sessoes_total               = 86
incremento_minimo_barra_kg  = 1
tm_partida_agacho_kg        = 215
tm_partida_supino_kg        = 160
tm_partida_terra_kg         = 240
taper_dias                  = 10
```

```restricoes
teto_pct_do_tm_corrente            <= 92       | semana 1-17  | design §10 · Pak2021 | externo
piso_pct_serie_de_forca            >= 80       | semana 4-16  | Pak2021 | externo
papel_forca_top_set_pct            ∈  85-92    | semana 4-16  | design §10 · SPEC §2.1 | interpretação
backoff_pct_minimo                 >= 82       | semana 4-16  | SPEC §2.1 · Pak2021 | externo
backoff_pct_maximo                 <= 88       | semana 4-16  | SPEC §2.1 · Pak2021 | externo
backoff_offset_pp_do_top           <= 6        | semana 4-16  | SPEC §2.1 · interpretação | interpretação
series_forca_agacho_semana         ∈  4-5      | semana 4-16  | Pak2021 · design §13-B/R9 | externo
series_forca_supino_semana         =  5        | semana 4-16  | Pak2021 | externo
series_forca_terra_semana          =  4        | semana 4-16  | Pak2021 · SPEC §2.4 | externo
rampa_carga_agacho_pct             ∈  5-9      | semana 4-16  | design §11-A · Pak2021 | externo
rampa_carga_supino_pct             ∈  5-9      | semana 4-16  | design §11-A · Pak2021 | externo
rampa_carga_terra_pct              ∈  5-9      | semana 4-16  | design §11-A · Pak2021 | externo
frequencia_agacho_por_semana       =  3        | semana 1-16  | design §10 | interpretação
frequencia_supino_por_semana       =  4        | semana 1-16  | design §10 | interpretação
frequencia_terra_por_semana        =  2        | semana 1-16  | design §10 | interpretação
supino_series_semana               >= 22       | semana 1-16  | design §13-B/R3 | interpretação
supino_series_pausadas_semana      <= 17       | semana 1-16  | SPEC §2.3 · design §4-B | interpretação
pausa_supino_minima_s              >= 1.0      | semana 1-18  | SPEC §2.2 · IPF-TR2026 | externo
costas_series_diretas_semana       >= 12       | semana 1-16  | design §13-B/R4 | interpretação
costas_series_diretas_semana       >  biceps_series_diretas_semana        | semana 1-16 | design §13-B/R4 | interpretação
costas_series_diretas_semana       >  delt_lateral_series_diretas_semana  | semana 1-16 | design §13-B/R4 | interpretação
biceps_series_diretas_semana       ∈  8-15     | semana 1-16  | Nippard · Pelland2025 | externo
delt_lateral_series_diretas_semana ∈  8-12     | semana 1-16  | design §10-B · Nippard | externo
delt_lat_post_series_diretas       <= 12       | semana 1-16  | design §13-B/R5 | externo
delt_anterior_series_diretas       =  0        | semana 1-16  | design §10-B | interpretação
eretores_series_diretas_semana     >= 4        | semana 1-16  | design §6 · SPEC §1.5 | interpretação
isquiotibiais_series_diretas_semana =  4       | semana 1-16  | SPEC §1.5 | interpretação
high_bar_pct_series_agacho         ∈  46-54    | semana 1-16  | design §13-B/R7 · R18@00:33 | PESSOAL
exp_supino_semana                  <= coluna:EXP-TETO | semana 4-16 | SPEC §2.2 · interpretação | interpretação
razao_axial_d4_sobre_d5            <= 1.30     | semana 4-16  | design §13-B/R15 | interpretação
gauge_pos_primeira_serie_do_lift   =  1        | semana 1-16  | Noriega · SPEC §4.2 | externo
um_eixo_supino_violacoes           =  0        | semana 1-16  | R63@02:01 · SPEC §3.6 | GERAL
minutos_por_sessao_bloco           ∈  75-100   | semana 1-16  | entrada · design §13-B/R14 | entrada
minutos_por_sessao_taper           ∈  30-100   | semana 17-18 | design §11-B · interpretação | interpretação
taper_reducao_volume_carga_pct     ∈  30-50    | semana 17-17   | Travis2020 | externo
taper_reducao_series_sbd_pct       ∈  30-50    | semana 17-17   | Travis2020 | externo
taper_intensidade_de_pico_pct      >= 85       | semana 17-17   | Travis2020 | externo
acessorio_series_semana_taper      =  0        | semana 17-18 | Pritchard2016 · design §11-B | externo
ultimo_pesado_agacho_dias_out      ∈  7-10     | semana 17-18 | Travis2021 | externo
ultimo_pesado_terra_dias_out       ∈  7-10     | semana 17-18 | Travis2021 · R116@04:42 | GERAL
ultimo_pesado_terra_dias_out       >= ultimo_pesado_agacho_dias_out       | semana 17-18 | R116@04:42 | GERAL
ultimo_pesado_supino_dias_out      <= 6        | semana 17-18 | Travis2021 · R116@04:42 | GERAL
cessacao_dias_out                  <= 7        | semana 17-18 | Travis2020 · design §13-C/C2 | externo
```

**Denominador das reduções do taper, declarado aqui porque só existia no código:**
`taper_reducao_volume_carga_pct` e `taper_reducao_series_sbd_pct` são medidas contra a
**MÉDIA das semanas 4–16**, não contra a S16. Não é detalhe: contra a S16 os números seriam
outros, e a redução de séries fica a **0,13 pp** do piso de 30% — margem que ninguém
enxergaria sem o denominador escrito. `minutos_por_sessao_taper` tem procedência
`design §11-B · interpretação` e **não** SPEC §3.2, que declara o oposto (piso de 75 min,
sem escopo): com acessórios a zero, uma sessão de taper não chega a 75 min, e inflar
descanso para passar num checker seria maquiagem.

**A 4ª coluna é a TAG da procedência, e ela existe porque este bloco era o único lugar do
documento onde `[PESSOAL]` desaparecia por construção.** Sem ela, `high_bar_pct_series_agacho`
— que sai de *"faz cerca de metade de todo o seu volume de agacho com high bar"*
`[R18 @00:33]` **[PESSOAL]** — passava a parecer prescrição geral. `externo` = evidência
peer-reviewed, regra da IPF ou roster de elites; `entrada` = dado do atleta. O build
recusa linha sem tag e tag fora do conjunto.

⚠️ **Duas mudanças de procedência feitas aqui, e o motivo:** (a) as três `rampa_carga_*`
citavam `R33@01:02`, cujas duas claims são **[PESSOAL]** e são *a mesma conta* que este
arquivo já retrata como não-transferível (max out + deload + corte de peso, nenhum dos
três presente neste atleta) — a faixa que de fato governa é a de `design.md` §11-A, e R33
fica como **precedente citado em prosa**, não como fonte de invariante; (b)
`um_eixo_supino_violacoes` citava `R31@02:32`, cujas claims são sobre **onde** pôr um cue
(no setup, não sob carga) e não sobre uma-variável-por-vez — o endereço certo é
*"mude poucas coisas de uma vez — idealmente apenas uma por levantamento"*
`[R63 @02:01]` `[GERAL]`.

⚠️ **`papel_forca_top_set_pct` é medido sobre o QUILO REALIZADO** (percentual × TM com o
`roundGuard` aplicado na grade de 2,5 kg), não sobre o percentual declarado — e é por isso
que o piso é **85** e não 86: a grade de 2,5 kg custa até **1,56 pp** no denominador menor
(supino, 2,5 kg ÷ 160 kg), e o mínimo de fato realizado no bloco é **85,94%**. O piso de
desenho continua sendo 86%; 85 é o que a barra permite executar. **A faixa 86–92 medida em quilo realizado é aritmeticamente insatisfazível junto
com `rampa_carga_supino_pct ∈ 5-9`**: entre 86% e 92% de 160 kg só existem três pesos
carregáveis (140 · 142,5 · 145), e a rampa máxima entre eles é +3,57%. Registrado, não
maquiado.

```procedencias
design §  baseline §  SPEC §  entrada  interpretação
Pak2021  Travis2020  Travis2021  Pritchard2016  Noriega  Pana  Nippard  Pelland2025
IPF-TR2026  VÍDEO-SQ  VÍDEO-BP  elites §  bracos §  tecnica §
R1 R4 R7 R10 R11 R14 R15 R16 R18 R20 R21 R22 R27 R30 R31 R33 R37 R40 R42 R47 R50 R52 R54
R63 R64 R66 R67 R68 R74 R76 R77 R79 R83 R87 R88 R89 R90 R93 R95 R96 R99 R100 R101 R102
R103 R107 R108 R110 R112 R114 R115 R116 R118 R119 R121 R122 R123 R124 R125 R132 R134
R136 R142 R145 R154 R155 R159 R160 R163 R164 R166 R167 R168 R169 R170 R171 R172 R174
R177 R185
```

**A bijeção `procedencias` ↔ corpo é exigida no build, e sobre os DOIS arquivos-fonte
(`PROGRAMA.md` e `CONTEXTO.md`).** Antes, o parser lia só `PROGRAMA.md`, e `CONTEXTO.md` —
para onde foi todo o material de `design.md` §9/§12/§13 — ficava fora de qualquer trava:
ele cita `[R15]` e `[R37]`, que não estavam declarados aqui. **10 procedências declaradas
nunca eram citadas** (R51, R106, R113, R126, R133, R136, R141, R143, R156 e R185) e uma
citada não era declarada; a lista acima é o resultado da conciliação. **R7 e R185
voltaram**, e não como decoração: são a única procedência do canal para o simulado com
anilhas calibradas (§8).

⚠️ **Duas remoções de citação exigidas pela auditoria e feitas aqui:** o *"dynamic RPE de
Agata Sitko"* **não existe** (zero ocorrências em `prog/` e `extract/`) — o precedente
real de rampa dentro do bloco é **Pana** (RPE 7→8→9 ao longo das semanas) mais **Pak** e
o precedente interno de §11; e *"calibrada para ser quase invisível"* **não existe na
base** — era paráfrase apresentada como citação. Os 2,5% de `[R33 @01:33]` **[PESSOAL]**
são o **resíduo percebido** depois de descontar ~5% de queda vinda de max out + deload +
cut, **não** um alvo de progressão: este atleta não teve nenhum dos três, então o número
não transfere e não é mais invariante deste programa.

### 0.1 Os três instrumentos (SPEC §0.2)

| Instrumento | Papel | Nunca |
|---|---|---|
| **% do TM corrente** | prescreve a carga | ser perseguido por RPE |
| **RPE** | teto / regra de parada | ser alvo |
| **Gauge set** | única coisa que **move o TM** | ser fonte de decisão intrassessão |

### 0.2 RPE 10 tem definição operacional, por levantamento (SPEC §0.3)

| Levantamento | RPE 10 = |
|---|---|
| Agacho | perde a profundidade legal, **ou** o tronco passa de ~38° da vertical |
| Supino | a barra não fica imóvel na pausa, **ou** a costela desce além do afundamento da barra |
| Terra | o deltoide não fecha atrás da linha da barra, **ou** solta a barra |

### 0.3 Tabela de conversão RPE↔% — NORMATIVA, uma só (SPEC §0.4)

| Reps | Âncora | Inclinação |
|---|---|---|
| 1 | RPE 8 = **92%** · RPE 7 = **89%** | 3 pp por ponto |
| 3 | RPE 7 = **81%** · RPE 6 = **79%** | 2 pp por ponto |
| 7 | RPE 6–7 = **70%** `[Noriega]` | 2 pp por ponto ⚠️ `[interpretação]` |
| 5 | RPE 6 ≈ **76%** | 2 pp por ponto ⚠️ `[interpretação]` — Noriega só publica a de 7 reps, e a linha de 5 nasceu para o terra |

Esta tabela é **a mesma** que o checker de UM-EIXO usa para comparar uma célula `RPE n`
com uma célula `NN%` (§4): sem ela, toda coluna de carga de supino das S1–S3 era invisível
para a checagem, e a S3 passava por **cegueira**, não por conformidade. As inclinações de
5 e 7 reps são `[interpretação]` e estão marcadas: a base publica âncora, não inclinação.

⚠️ **LACUNA registrada:** o conversor do próprio Vena (1 RPE ≈ 2–3%; 3% em agacho e terra
`[R33 @00:32]` `[R50 @02:06]`, **as duas [PESSOAL]**) diverge — por ele RPE 8 ≈ 94%. Como a
carga é prescrita em %, a divergência **nunca muda um quilo prescrito**; muda só como uma
regra de parada lê.

---

## 1. EIXOS, DERIVAÇÕES, ÂNCORAS E CALIBRAÇÃO

Toda variável que muda por semana é **coluna** da grade (§4). Coluna sem eixo, eixo sem
coluna e variável declarada que nenhum template usa são **erro de build**.

```eixos
TOP-AG      | carga_agacho           | pct    | monotonica
AG-F-REPS   | instrumento_calibracao | reps   | recuo S3
BO-AG       | carga_agacho           | pct    | monotonica
AGBO        | volume_agacho          | series | oscilante 3-4
RPE-AG      | parada_agacho          | rpe    | teto
RPE-AG-BO   | parada_agacho          | rpe    | teto
AG-G        | instrumentacao         | pct    | constante
AG-V        | carga_agacho           | pct    | monotonica
AG-P        | carga_agacho           | pct    | monotonica
SUP-F       | carga_supino           | pct    | monotonica
SUP-F-REPS  | instrumento_calibracao | reps   | recuo S3
SUP-F-BO    | carga_supino           | pct    | monotonica
RPE-SUP     | parada_supino          | rpe    | teto
RPE-SUP-BO  | parada_supino          | rpe    | teto
SUP-V1      | exposicao_peito        | series | monotonica
SUP-V1-PCT  | carga_supino           | pct    | monotonica
FP-SETS     | exposicao_peito        | series | decrescente
FP-RPE      | parada_peito           | rpe    | teto
SUP-V4      | exposicao_peito        | series | monotonica
SUP-V4-PCT  | carga_supino           | pct    | constante
FP4-SETS    | exposicao_peito        | series | decrescente
FP4-RPE     | parada_peito           | rpe    | teto
SUP-G       | instrumentacao         | pct    | constante
SUP-P       | carga_supino           | pct    | monotonica
PAUSA-P     | exposicao_peito        | s      | recuo S12
EXP-TETO    | instrumentacao         | exp    | teto
TOP-TER     | carga_terra            | pct    | monotonica
TER-F-REPS  | instrumento_calibracao | reps   | recuo S3
BO-TER      | carga_terra            | pct    | monotonica
RPE-TER     | parada_terra           | rpe    | teto
RPE-TER-BO  | parada_terra           | rpe    | teto
TER-G       | instrumento_gauge      | pct    | constante
RPE-TER-G   | leitura_gauge          | rpe    | referencia
TER-P       | carga_terra            | pct    | constante
PEC-SETS    | exposicao_peito        | series | monotonica recuo S17
PEC-RPE     | parada_peito           | rpe    | teto
```

```derivacoes
BO-AG      = TOP-AG - 6pp   | clamp 82-88 | round 0.5
SUP-F-BO   = SUP-F - 6pp    | clamp 82-88 | round 0.5
BO-TER     = TOP-TER - 6pp  | clamp 82-88 | round 0.5
SUP-V1-PCT = SUP-F - 14pp   | clamp 70-80 | round 0.5
FP-SETS    = 7 - SUP-V1
FP4-SETS   = 5 - SUP-V4
PEC-RPE    = 5 + PEC-SETS
```

⚠️ `SUP-V1-PCT` foi declarada com `round 0.5` e **não** com `round 1pp`: a série de
`SUP-F` redistribuída (S6 congelada) produz 73,5% e 1 pp de arredondamento inventaria
meio ponto que a derivação não tem. A rampa entregue é 72 → 78 = **+8,33%**.

```ancoras
single_rpe_8     -> 92   | Noriega · §0.3
single_rpe_7     -> 89   | Noriega · §0.3
triple_rpe_7     -> 81   | Noriega · §0.3
triple_rpe_6     -> 79   | Noriega · §0.3
serie_7_rpe_6_7  -> 70   | Noriega · §0.3
serie_5_rpe_6    -> 76   | interpretação · §0.3
```

⚠️ **`ancoras` foi ALINHADO a §0.3, que é a tabela normativa, e a diferença não era
cosmética:** a versão anterior dava `single_rpe_7_8 -> 90` e `triple_rpe_7 -> 80`,
misturando RPE 7 com RPE 8 numa linha só e ficando 2 pp abaixo do triplo — o que **inflava
o `trainingMax` de agacho e terra em ~2,2%** justamente no gate que fixa 13 semanas de
carga. Quem governa é **§0.3**, porque é a única tabela declarada normativa e é dela que
sai toda conversão RPE↔% do documento; `ancoras` é a projeção dela que o gate lê.

```calibracao
semana 1 | instrumento gauge_set | reps 7 (terra 5) | rpe 6   | ancora 70 (terra 76)
semana 2 | instrumento backoff   | reps 3           | rpe 7   | ancora 80
semana 3 | instrumento top_set   | reps 1           | rpe 8   | ancora 90
gate     | apos_semana 3 | grava trainingMax = mediana das 3 | alerta_divergencia_pct 7
```

**Três semanas, três âncoras distintas por levantamento → ✓ R8.** E **não existe single
na semana 1 em nenhum levantamento**: em S1 e S2 o "top set" roda como **triplo**
(`AG-F-REPS` = `SUP-F-REPS` = `TER-F-REPS` = 3), a leitura da S2 é a **back-off**, e o
single estreia na S3. É o tratamento único dos três dias — a versão anterior tinha três
tratamentos diferentes do mesmo protocolo.

**Gate obrigatório entre a S3 e a S4** (`design.md` §11-A2 · SPEC §4.1): extrapolar pelas
três âncoras, usar a **mediana** (nunca a maior), gravar em `profile.trainingMax` (não
toca no 1RM histórico), gravar `trainingMaxInicialBloco`, e **as cargas das S4–S18
recomputam em runtime**. Divergência > 7% contra 215/160/240 vai para a conversa semanal
**antes** de seguir.

⚠️ **PORTAS DE INVALIDAÇÃO DO GATE — as mesmas do gauge (§1.1) e da porta de R115, e
faltavam aqui.** Era uma assimetria do próprio documento: o gauge de terra tinha regra de
invalidação, a porta de profundidade tinha regra de invalidação, e o gate que fixa **13
semanas de carga** não tinha nenhuma. Regra: **âncora colhida em rep fora do padrão legal
é DESCARTADA** — não entra na mediana, e a semana é repetida para recolher aquela âncora.
Rep fora do padrão é a definição operacional de RPE 10 de §0.2 (agacho: perdeu a
profundidade legal ou o tronco passou de ~38°; supino: a barra não ficou imóvel na pausa
ou a costela desceu; terra: o deltoide não fechou atrás da linha da barra, ou soltou).
No terra vale também a invalidação por **falha de pegada** (§1.1). Isto importa em
particular na S3: o single da S3 é **o primeiro single da vida dele**, na zona (≈90–92%)
em que a análise de vídeo prevê que ele corta alto — é exatamente a leitura que a regra
existe para proteger `[R115 @02:34]` `[GERAL]`.

### 1.1 Regra de ação do gauge set — bidirecional e assimétrica (SPEC §4.3)

Portas, avaliadas **antes** de qualquer ajuste: leitura inválida (ex.: gauge de terra
encerrado por **falha de pegada**) é descartada nos dois sentidos — **a regra de
invalidação é `[interpretação]` do desenho**, e o que a base dá é o *fato* que a motiva:
*"costumava sempre soltar o terra pela pegada, mesmo tendo a força para o levantamento"*
`[R42 @00:02]` **[PESSOAL]**. Não existe no corpus nenhuma claim sobre invalidar uma
medida por pegada; existe a claim de que a pegada solta antes da força, que é o que torna
o instrumento cego. Rep fora do padrão legal **proíbe subida** `[R115]`; e no supino, se
**qualquer** coluna do eixo `exposicao_peito` subiu na semana (`SUP-V1`, `SUP-V4`,
`PAUSA-P`, `PEC-SETS`, `FP-SETS`, `FP4-SETS`), a leitura é **inválida para subir**.

`acumulador += (rpe_anterior − rpe_hoje)`. Com `acumulador ≥ 1,0`: `K` = 3,0% (agacho,
terra) ou 2,0% (supino) `[R33 @00:32]` `[R50 @02:06]` **[PESSOAL]**
`[interpretação: 2,0% para supino é a ponta baixa da faixa genérica de 2–3%; a base NÃO dá
número para supino, e os 3,0% são explicitamente a ponta alta DELE, num agachador/terrista
de 800 lb — vira multiplicador de carga de um atleta de 215/240 por decisão do desenho]`,
ganho = `min(acumulador × K, 5%)`, teto de `tm_inicial × 1,10`, aplicado à **semana
seguinte**. Queda de ≥1 ponto na **primeira**
leitura **não baixa o TM** — segura a carga uma semana `[R1 @01:04]` `[R27 @05:38]`; duas
leituras consecutivas baixam por `K`; queda de ≥2 pontos corta a sessão `[R10 @00:34]`.

⚠️ **RECONCILIAÇÃO EXIGIDA, e ela desmente duas frases do desenho.** (a) O topo do bloco é
**92% do TM corrente**; com o TM no teto de `×1,10` isso dá **101,2% do TM inicial** — logo
a faixa de chegada "100–105%" de `design.md` §11-A tem **1,2 ponto atingível e 105% é
aritmeticamente impossível** enquanto o clamp for 1,10 e o teto for 92%. Fica valendo o
clamp (é o freio de segurança); **a faixa de chegada correta deste bloco é 100–101,2%**.
(b) `design.md` §11-A especifica início em **~95% do TM**; o realizado na S4 é
**84,9% / 85,9% / 85,4%** (agacho/supino/terra, em quilo realizado) — 9 a 10 pp mais fundo.
**Isso é ESCOLHA, não erro de execução da spec**, e o motivo está no próprio §11-A: os
~95% de Vena são o que sobra depois de max out + deload + corte de peso, e **este atleta
não teve nenhum dos três** — não há déficit para recuperar, então não há de onde partir a
95%. O que o validador chama de "ganho líquido −5,8% / −8,6% / −6,7%" é a consequência
aritmética dessa escolha, e passa a sair como **AVISO**, não como nota.

⚠️ **O limiar literal de R1 ("cai ≥1 ponto vs a semana anterior") não dispara no caso que
o motivou** — +6,9 kg no agacho diluídos em 10 semanas dão 0,13 ponto/semana. Por isso o
**acumulador**; a correção pertence ao arquivo-fonte (`design.md` §13-B/R1), não só aqui.

### 1.2 Gate de dor de peitoral — obrigatório, três momentos (SPEC §4.4)

Colhido em **toda sessão que contenha supino ou peitoral**: **pré-sessão · 1ª série
pausada com carga de trabalho · pós-sessão**, escala 0–10. **Isto inclui as 4 sessões do
taper e o dia fácil da S18** — o gate não relaxa quando os degraus acabam, porque no taper
ele deixa de congelar degrau e passa a **governar a 3ª tentativa de supino do simulado**
(§8), que é decidida com o log das duas semanas anteriores, ou seja, S17 e S18.
**O floor press entra no gate como qualquer outra linha de peitoral**: são 9 séries
semanais sobre o tecido lesionado, e até esta revisão elas eram o único bloco de peitoral
que o gate não conseguia reduzir.

| Sinal | Ação |
|---|---|
| **1 evento ≥2/10** | congela `TM_supino` **e** o degrau de exposição (`SUP-V1`, `SUP-V4`, `PAUSA-P`, `PEC-SETS`, `FP-SETS`, `FP4-SETS`, `FP-RPE`, `FP4-RPE` não sobem). **Sem recuo.** |
| **2 eventos ≥2/10 em 3 sessões de supino** | recua um degrau do eixo **que mudou mais recentemente** e segura 2 semanas. A duração **nunca** desce abaixo de 1,0 s |
| **≥4/10 ou estiramento agudo** | encerra a sessão, cai ao degrau das S1–S2 por 1 semana, re-sobe **a metade da velocidade**, reporta |
| **RETORNO** | re-sobe um degrau só após **2 semanas consecutivas com pico ≤1/10** em todas as sessões de supino |

⚠️ **Desvio consciente de `design.md` §4-B, que recua no 1º evento** (SPEC §7-#3): a base
diz o oposto — *"um único treino mais doloroso não significa que o programa de reabilitação
não está funcionando"* `[R1 @01:04]` `[GERAL]` e *"picos isolados de dor um dia ou outro são
normais… mas se os picos são frequentes, a dor platôa ou piora, é preciso reduzir mais a
carga"* `[R27 @05:38]` `[GERAL]`. O limiar de 2/10 é `[R1 @01:04]` `[GERAL]`; `[R79 @03:35]`
dá 2–3/10 e é **[PESSOAL]**. **Se o gate disparar entre S8 e S11, o bloco de 2 s é a
PRIMEIRA coisa que sai.** ⚠️ **[PESSOAL]** o próprio Vena passou anos treinando através de
dor pequena com tendinite de tendão peitoral e *"ficou patinando sem progresso e sem
melhora da dor"* `[R27 @05:08]` — é o modo de falha a evitar.

⚠️ **Dor referida na região do bíceps entra no log de peitoral até prova em contrário:**
*"cerca de 90% dos casos de 'dor no bíceps' em powerlifters são na verdade tendinite de
peitoral, porque o tendão do peitoral se insere perto do bíceps"* `[R95 @03:10]` `[GERAL]`.

---

## 2. PAPÉIS DE SESSÃO — uma linha por linha de template

`local` é `D<dia>#<linha>` (templates) ou `S<semana>D<dia>#<linha>` (dias explícitos). O
gerador confere **1:1** contra as tabelas: papel sem linha, linha sem papel ou esquema
divergente é erro de build — é a classe de erro que produzia *"prosa declara 4×6 ·
template prescreve 5×6"*.

`round` é o `roundGuard`, fixado **por papel** e não por autor: `forca`/`pico` → `floor`
(série limitada por teto), `volume` → `ceiling` (limitada por piso de faixa),
`backoff` → `nearest`, `gauge`/`pratica`/`acessorio` → `nearest`.

```papeis
D1#1  | agachamento_low_bar_legal   | pratica   | 2x3             | pausa 1.0 | nearest | agacho
D1#2  | supino_pausado_competicao   | volume    | {SUP-V1}x5      | pausa 1.0 | ceiling | supino_pausado
D1#3  | floor_press                 | acessorio | {FP-SETS}x8     | pausa 0   | nearest | supino_acessorio
D1#4  | one_arm_row                 | acessorio | 4x6-8           | pausa 0   | nearest | costas
D1#5  | wide_grip_lat_pulldown      | acessorio | 4x8-10          | pausa 0   | nearest | costas
D1#6  | stiff_legged_deadlift       | acessorio | 1x8             | pausa 0   | nearest | eretores
D1#7  | back_extension              | acessorio | 3x10-15         | pausa 0   | nearest | eretores
D1#8  | elevacao_lateral            | acessorio | 2x10-15         | pausa 0   | nearest | delt_lateral
D1#9  | rosca_cabo                  | acessorio | 2x8-12          | pausa 0   | nearest | biceps
D2#1  | supino_pausado_competicao   | forca     | 1x{SUP-F-REPS}  | pausa 1.0 | floor   | supino_pausado
D2#2  | supino_pausado_competicao   | backoff   | 4x3             | pausa 1.0 | nearest | supino_pausado
D2#3  | terra_sumo_sem_strap        | gauge     | 1x5             | pausa 0   | nearest | terra
D2#4  | terra_sumo_sem_strap        | pratica   | 3x3             | pausa 0   | nearest | terra
D2#5  | puxada_neutra               | acessorio | 4x5-8           | pausa 0   | nearest | costas
D2#6  | face_pull                   | acessorio | 3x15-20         | pausa 0   | nearest | delt_posterior
D2#7  | triceps_overhead_cabo       | acessorio | 3x10-12         | pausa 0   | nearest | triceps
D3#1  | agachamento_low_bar_legal   | gauge     | 1x7             | pausa 0   | nearest | agacho
D3#2  | agachamento_high_bar        | volume    | 8x5             | pausa 0   | ceiling | agacho
D3#3  | supino_pausado_competicao   | gauge     | 1x7             | pausa 1.0 | nearest | supino_pausado
D3#4  | supino_pausado_competicao   | pratica   | 4x3             | pausa {PAUSA-P} | nearest | supino_pausado
D3#5  | leg_press                   | acessorio | 3x10-12         | pausa 0   | nearest | quadriceps
D3#6  | leg_curl                    | acessorio | 4x10-12         | pausa 0   | nearest | isquiotibiais
D4#1  | agachamento_low_bar_legal   | forca     | 1x{AG-F-REPS}   | pausa 0   | floor   | agacho
D4#2  | agachamento_low_bar_legal   | backoff   | {AGBO}x3        | pausa 0   | nearest | agacho
D4#3  | supino_pausado_competicao   | volume    | {SUP-V4}x7      | pausa 1.0 | ceiling | supino_pausado
D4#4  | floor_press                 | acessorio | {FP4-SETS}x8-10 | pausa 0   | nearest | supino_acessorio
D4#5  | triceps_testa               | acessorio | 3x10-12         | pausa 0   | nearest | triceps
D4#6  | elevacao_lateral            | acessorio | 3x10-15         | pausa 0   | nearest | delt_lateral
D4#7  | rosca_cabo                  | acessorio | 3x8-12          | pausa 0   | nearest | biceps
D5#1  | terra_sumo_sem_strap        | forca     | 1x{TER-F-REPS}  | pausa 0   | floor   | terra
D5#2  | terra_sumo_sem_strap        | backoff   | 3x3             | pausa 0   | nearest | terra
D5#3  | db_press_inclinado          | acessorio | {PEC-SETS}x8-10 | pausa 0   | nearest | peito_alongado
D5#4  | crucifixo_peck_deck         | acessorio | {PEC-SETS}x12-15| pausa 0   | nearest | peito_alongado
D5#5  | elevacao_lateral            | acessorio | 4x10-15         | pausa 0   | nearest | delt_lateral
D5#6  | rosca_inclinada             | acessorio | 3x8-10          | pausa 0   | nearest | biceps
D5#7  | rosca_martelo               | acessorio | 3x10-12         | pausa 0   | nearest | biceps
D5#8  | triceps_overhead_cabo       | acessorio | 3x10-12         | pausa 0   | nearest | triceps
S17D1#1 | terra_sumo_sem_strap      | pico      | 3x1             | pausa 0   | floor   | terra
S17D1#2 | supino_pausado_competicao | volume    | 3x6             | pausa 1.0 | nearest | supino_pausado
S17D2#1 | agachamento_high_bar      | volume    | 5x5             | pausa 0   | ceiling | agacho
S17D2#2 | supino_pausado_competicao | pratica   | 2x6             | pausa 1.0 | nearest | supino_pausado
S17D3#1 | agachamento_low_bar_legal | pico      | 3x2             | pausa 0   | floor   | agacho
S17D3#2 | supino_pausado_competicao | leve      | 3x4             | pausa 1.0 | nearest | supino_pausado
S17D3#3 | terra_sumo_sem_strap      | pratica   | 2x3             | pausa 0   | nearest | terra
S17D4#1 | supino_pausado_competicao | pico      | 3x2             | pausa 1.0 | floor   | supino_pausado
S17D4#2 | agachamento_low_bar_legal | leve      | 2x3             | pausa 0   | floor   | agacho
S17D4#3 | terra_sumo_sem_strap      | leve      | 2x2             | pausa 0   | nearest | terra
S18D1#1 | agachamento_low_bar_legal | facil     | 2x2             | pausa 0   | nearest | agacho
S18D1#2 | supino_pausado_competicao | facil     | 3x2             | pausa 1.0 | nearest | supino_pausado
S18D1#3 | terra_sumo_sem_strap      | facil     | 2x2             | pausa 0   | nearest | terra
S18D2#1 | agachamento_low_bar_legal | tentativa | 1x1             | pausa 0   | nearest | agacho
S18D2#2 | agachamento_low_bar_legal | tentativa | 1x1             | pausa 0   | nearest | agacho
S18D2#3 | agachamento_low_bar_legal | tentativa | 1x1             | pausa 0   | nearest | agacho
S18D2#4 | supino_pausado_competicao | tentativa | 1x1             | pausa 1.0 | nearest | supino_pausado
S18D2#5 | supino_pausado_competicao | tentativa | 1x1             | pausa 1.0 | nearest | supino_pausado
S18D2#6 | supino_pausado_competicao | tentativa | 1x1             | pausa 1.0 | nearest | supino_pausado
S18D2#7 | terra_sumo_sem_strap      | tentativa | 1x1             | pausa 0   | nearest | terra
S18D2#8 | terra_sumo_sem_strap      | tentativa | 1x1             | pausa 0   | nearest | terra
S18D2#9 | terra_sumo_sem_strap      | tentativa | 1x1             | pausa 0   | nearest | terra
```

**Faixa de percentual por papel** (checada pelo gerador e pelo validador): `forca`/`pico`
86–92 · `backoff` 82–88 · `volume` 70–80 · `gauge` 65–80 · `pratica` 40–70 · `leve`
55–85 · `facil` 55–75 · `tentativa` isento (é medição, não prescrição).
⚠️ A faixa de `volume` de Pana vale para **5–7 reps** e é assim que é aplicada — 8 reps a
75% é ~RPE 9 por Epley, e cobrar a mesma faixa ali acusaria prescrição correta.

---

## 3. PROTOCOLO DE VÍDEO (`design.md` §8)

| Quando | Ângulo |
|---|---|
| Todo top set e todo gauge de agachamento | Perpendicular, altura do quadril, 3–4 m, do lado em que o disco não fique entre a câmera e as costas |
| Todo supino de barra | **Dos pés na linha da barra E DE LADO** — só a lateral julga pausa, queda de costela e *upper body thrust* `[design §13-B/R13]` |
| Todo top set e todo gauge de terra | Perpendicular, altura do quadril |
| **Semana 1 E DE NOVO NA S16** | De trás, 45°, altura do ombro — a posição da barra contra a regra 2026 ("no lower than the posterior deltoid level") **hoje é NÃO VERIFICÁVEL**: margem de erro ±5–8 cm, maior que a margem da própria regra `[tecnica §2.1, §2.3]`. A **reconferência na S16** é obrigatória: entre a S1 e a S16 o agacho muda de profundidade e de ângulo de tronco, e a barra desliza junto |

Vestuário: **short curto e justo**, ou marcadores nos pontos ósseos — short folgado custou
±3 cm de incerteza `[design §8]`.

### 3.1 CONTINGÊNCIA DO VÍDEO DE TRÁS — o que muda se ele REPROVAR

A filmagem de trás era agendada uma vez e **não existia nada depois dela**. Fica escrito:

- **Critério de reprovação:** a barra aparece **abaixo do deltoide posterior**. A regra da
  IPF 2026 é imperativa quanto ao prazo — *"change it now"* `[IPF-TR2026 §3.7]` —, e é
  **causa de DQ**, não de perda de quilos.
- **Ação, e ela ataca três coisas de uma vez:** **SUBIR a barra** até o topo do deltoide
  posterior. `params_tecnica.md` §2.5 registra que subir a barra ataca **simultaneamente**
  a regra 2026, a inclinação de tronco (barra mais alta exige menos hinge) e a
  profundidade. É a única alavanca do bloco com três efeitos alinhados, e ela **nunca foi
  avaliada, nem para descartar**.
- **Como entra:** a mudança de posição da barra é **SETUP**, e setup se muda no setup e
  nunca sob carga `[R31 @02:32]` `[GERAL]`. Entra na **D1**, no agacho de prática a 62–66%,
  na semana seguinte ao vídeo — e **congela `TOP-AG` e `AG-V` por 2 semanas** (é mudança de
  eixo, e UM-EIXO vale para o agacho também).
- **Se reprovar de novo na S16:** o agacho do simulado roda com a barra na posição legal
  ainda que custe carga. **Legalidade acima de quilo**, que é a tese do bloco inteiro.
- ⚠️ **REGRA 2026 DE PEGADA DO AGACHO, que tinha ZERO menções neste programa:**
  *"hands, thumbs, and fingers must be in complete contact with the bar"*
  `[IPF-TR2026 §3.2]`. **Polegar por cima da barra (thumbless / suicide grip) é luz
  vermelha em 2026.** Vale desde a S1, em toda linha de agacho de prática, gauge, top set
  e back-off — e é setup, custo zero.

---

## 4. TABELA DE PROGRESSÃO

Três grades, uma por levantamento, merjadas por semana pelo gerador. Célula `NN%` é
**percentual do `trainingMax` corrente**; célula `RPE n` significa *carga descoberta por
teto de RPE*, não prescrita; `—` é semana de dia explícito. **Célula em kg é erro de
build.**

### GRADE A — agacho

| Semana | TOP-AG | AG-F-REPS | BO-AG | AGBO | RPE-AG | RPE-AG-BO | AG-G | AG-V | AG-P |
|---|---|---|---|---|---|---|---|---|---|
| 1 | RPE 6 | 3 | RPE 6 | 4 | 6 | 6 | RPE 6 | RPE 6 | RPE 5 |
| 2 | RPE 7 | 3 | RPE 7 | 4 | 7 | 7 | 70% | RPE 6.5 | RPE 5 |
| 3 | RPE 8 | 1 | RPE 7 | 4 | 8 | 7 | 70% | RPE 7 | RPE 6 |
| 4 | 86% | 1 | 82% | 4 | 8 | 9.5 | 70% | 70% | 62% |
| 5 | 86.5% | 1 | 82% | 3 | 8 | 9.5 | 70% | 70% | 62.5% |
| 6 | 87% | 1 | 82% | 4 | 8 | 9.5 | 70% | 70% | 62.5% |
| 7 | 87.5% | 1 | 82% | 3 | 8 | 9.5 | 70% | 70% | 63% |
| 8 | 88% | 1 | 82% | 4 | 8 | 9.5 | 70% | 70% | 63.5% |
| 9 | 88.5% | 1 | 82.5% | 4 | 8 | 9.5 | 70% | 72% | 63.5% |
| 10 | 89% | 1 | 83% | 4 | 8 | 9.5 | 70% | 72% | 64% |
| 11 | 89.5% | 1 | 83.5% | 3 | 8 | 9.5 | 70% | 72% | 64.5% |
| 12 | 90% | 1 | 84% | 4 | 8 | 9.5 | 70% | 72% | 65% |
| 13 | 90.5% | 1 | 84.5% | 4 | 8 | 9.5 | 70% | 74% | 65% |
| 14 | 91% | 1 | 85% | 4 | 8 | 9.5 | 70% | 74% | 65.5% |
| 15 | 91.5% | 1 | 85.5% | 4 | 8 | 9.5 | 70% | 74% | 66% |
| 16 | 92% | 1 | 86% | 4 | 8 | 9.5 | 70% | 74% | 66% |
| 17 | — | — | — | — | — | — | — | — | — |
| 18 | — | — | — | — | — | — | — | — | — |

### GRADE B — supino

| Semana | SUP-F | SUP-F-REPS | SUP-F-BO | RPE-SUP | RPE-SUP-BO | SUP-V1 | SUP-V1-PCT | FP-SETS | FP-RPE | SUP-V4 | SUP-V4-PCT | FP4-SETS | FP4-RPE | SUP-G | SUP-P | PAUSA-P | EXP-TETO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | RPE 6 | 3 | RPE 6 | 6 | 6 | 2 | RPE 5 | 5 | 6 | 1 | RPE 6 | 4 | 6 | RPE 6 | RPE 4 | 1.0 s | — |
| 2 | RPE 6.5 | 3 | RPE 6.5 | 6.5 | 6.5 | 2 | RPE 5.5 | 5 | 7 | 1 | RPE 6.5 | 4 | 7 | 70% | RPE 5 | 1.0 s | — |
| 3 | RPE 7 | 1 | RPE 7 | 7 | 7 | 2 | RPE 6 | 5 | 8 | 1 | RPE 7 | 4 | 8 | 70% | RPE 5 | 1.0 s | — |
| 4 | 86% | 1 | 82% | 7.5 | 9.5 | 3 | 72% | 4 | 8 | 1 | 70% | 4 | 8 | 70% | 62% | 1.0 s | 39.00 |
| 5 | 86% | 1 | 82% | 7.5 | 9.5 | 3 | 72% | 4 | 8 | 2 | 70% | 3 | 8 | 70% | 62% | 1.0 s | 48.43 |
| 6 | 86% | 1 | 82% | 7.5 | 9.5 | 3 | 72% | 4 | 8 | 2 | 70% | 3 | 8 | 70% | 62% | 1.0 s | 54.55 |
| 7 | 86% | 1 | 82% | 7.5 | 9.5 | 4 | 72% | 3 | 8 | 2 | 70% | 3 | 8 | 70% | 62% | 1.0 s | 54.55 |
| 8 | 87.5% | 1 | 82% | 7.5 | 9.5 | 4 | 73.5% | 3 | 8 | 2 | 70% | 3 | 8 | 70% | 65% | 1.0 s | 59.05 |
| 9 | 87.5% | 1 | 82% | 8 | 9.5 | 4 | 73.5% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 65% | 1.0 s | 59.90 |
| 10 | 87.5% | 1 | 82% | 8 | 9.5 | 4 | 73.5% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 65% | 2.0 s | 66.03 |
| 11 | 89% | 1 | 83% | 8 | 9.5 | 4 | 75% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 65% | 2.0 s | 75.78 |
| 12 | 89% | 1 | 83% | 8 | 9.5 | 4 | 75% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 65% | 1.0 s | 76.31 |
| 13 | 90% | 1 | 84% | 8 | 9.5 | 4 | 76% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 67% | 1.0 s | 76.31 |
| 14 | 90% | 1 | 84% | 8 | 9.5 | 4 | 76% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 67% | 1.0 s | 67.28 |
| 15 | 91% | 1 | 85% | 8 | 9.5 | 4 | 77% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 67% | 1.0 s | 67.28 |
| 16 | 92% | 1 | 86% | 8 | 9.5 | 4 | 78% | 3 | 8 | 3 | 70% | 2 | 8 | 70% | 67% | 1.0 s | 67.69 |
| 17 | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 18 | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |

### GRADE C — terra, peito alongado e rótulo da semana

| Semana | TOP-TER | TER-F-REPS | BO-TER | RPE-TER | RPE-TER-BO | TER-G | RPE-TER-G | TER-P | PEC-SETS | PEC-RPE | Rótulo |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | RPE 6 | 3 | RPE 6 | 6 | 6 | RPE 6 | 6 | 65% | 1 | 6 | Calibração 1/3 — instrumento é o GAUGE SET (7 reps, terra 5) a teto de RPE 6, âncora 70% (terra 76%). NÃO EXISTE SINGLE: o top set roda como triplo nos três levantamentos. Pausa de 1,0 s já em toda rep de barra e em todo aquecimento |
| 2 | RPE 7 | 3 | RPE 7 | 7 | 7 | 76% | 6.5 | 65% | 1 | 6 | Calibração 2/3 — instrumento é a BACK-OFF (triplo a teto RPE 7), âncora 80%. Os gauges já rodam em % do TM provisório. Supino roda um degrau abaixo dos outros dois lifts |
| 3 | RPE 8 | 1 | RPE 7 | 8 | 7 | 76% | 6.5 | 65% | 1 | 6 | Calibração 3/3 — instrumento é o TOP SET (primeiro single do bloco) a teto RPE 8, âncora 90%; supino a RPE 7. Depois desta semana roda o gate de re-ancoragem. ⚠️ NENHUM DEGRAU DE EXPOSIÇÃO NESTA SEMANA: o degrau SUP-V1 2→3 FOI MOVIDO PARA A S4. Ele estava aqui e violava UM-EIXO — na mesma semana subiam SUP-V1, o teto de RPE do supino (6,5→7) e a contagem de reps do top set (3→1, estreia do single), e é a semana que produz a âncora do TM. A checagem não pegava porque células `RPE n` eram invisíveis para ela |
| 4 | 86% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 1 | 6 | Primeira semana por percentual. O gate da S4 gravou o trainingMax e tudo abaixo é % dele. Top set ≈ RPE 6,0 · back-off ≈ RPE 7,5 pela tabela normativa. Degrau de exposição SUP-V1 2→3, vindo da S3: aqui ele é livre porque toda coluna de carga de supino CAI ao mudar de denominador (RPE 7 a 1 rep = 89% por §0.3 → 86% prescrito) |
| 5 | 86.5% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 1 | 6 | Semana leve (AGBO 4→3, só o agacho, só para baixo). Degrau de SUP-V4 (1→2) → carga do supino CONGELADA (UM-EIXO) |
| 6 | 87% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Degrau de PEC-SETS (1→2) → carga do supino CONGELADA. É a semana que a spec violava: aqui SUP-F fica em 86% e o degrau foi redistribuído para S8 |
| 7 | 87.5% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Semana leve. Degrau de SUP-V1 (3→4) → carga do supino CONGELADA |
| 8 | 88% | 1 | 82% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Meio do bloco. Degrau livre de carga de supino (86→87,5%) e de exposição (SUP-P 62→65%). PONTO DE REVISÃO: a aposta das 16 semanas e o teto de EXP |
| 9 | 88.5% | 1 | 82.5% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Degrau de SUP-V4 (2→3) → carga do supino congelada. DOSE CHEIA de reps pausadas alcançada (o número é `VENA_BLOCK1_MEASURES[8].repsPausadas`, medido, não digitado) — 9 semanas para chegar onde a versão anterior entrava na S1 |
| 10 | 89% | 1 | 83% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | PAUSA-P sobe a 2,0 s, só nas 4 séries de prática de D3, a 65% do TM. D1, D2 e D4 seguem em 1,0 s. Carga do supino congelada |
| 11 | 89.5% | 1 | 83.5% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Semana leve. Bloco de 2 s segue em D3; degrau livre de carga de supino (87,5→89%) |
| 12 | 90% | 1 | 84% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | PAUSA-P recua a 1,0 s — recuo também é movimento de eixo, então a carga do supino fica congelada |
| 13 | 90.5% | 1 | 84.5% | 8 | 9.5 | 76% | 6.5 | 65% | 2 | 7 | Degrau livre nos dois eixos de carga do supino (SUP-F 89→90%, SUP-P 65→67%) |
| 14 | 91% | 1 | 85% | 8 | 9.5 | 76% | 6.5 | 65% | 3 | 8 | Degrau de PEC-SETS (2→3) → carga do supino congelada. Peito alongado chega a 6 séries, no halter e no peck deck, sem barra |
| 15 | 91.5% | 1 | 85.5% | 8 | 9.5 | 76% | 6.5 | 65% | 3 | 8 | Degrau livre de carga de supino |
| 16 | 92% | 1 | 86% | 8 | 9.5 | 76% | 6.5 | 65% | 3 | 8 | Última semana do bloco. Top set = RPE ~8,0 · back-off = RPE ~9,5, que é a faixa de Pak, sem um quilo acima de 92% do TM. Rampa dos três: `rampa_carga_*_pct`, medida pelo gerador |
| 17 | — | — | — | — | — | — | — | — | 0 | — | TAPER de 10 dias — 4 sessões, acessórios a ZERO. Últimas pesadas: terra a 10 dias, agacho a 7, supino a 5 |
| 18 | — | — | — | — | — | — | — | — | 0 | — | Dia fácil a 3 dias out e SIMULADO. Três tentativas por levantamento, com comando |

**Semanas leves: S5, S7 e S11** — as três únicas livres de degrau de exposição do peitoral
e de degrau de carga do supino. `AGBO` cai de 4 para 3: **só o agacho, só para baixo**.
⚠️ **R9 fica PARCIALMENTE IMPLEMENTADA**: a oscilação entregue é de 1 série em ~104
(≈1%), não os ~10% que R9 imaginava. Oscilar para cima levaria a razão axial a 1,44× e
violaria R15; oscilar o supino derrubaria a semana leve para 21 séries e violaria R3;
oscilar o terra encostaria no piso exato de Pak. `design.md` §14 registra que a base **não
dá amplitude nenhuma** para "ride the line". **Registrado, não maquiado.**

⚠️ **R15 NÃO ESTÁ RESOLVIDO, e a invariante que existe cobre o par errado.**
`razao_axial_d4_sobre_d5 <= 1,30` passa porque foi escrita sobre o par que **já** tinha
sido consertado. O gerador agora publica também `razaoAxialD3D4` e
`razaoAxialMaximaEntreDias` em `VENA_BLOCK1_MEASURES`, e eles mostram para onde o
desequilíbrio migrou: **D3 concentra ~49% da tonelagem axial da semana** (9 das 16 séries
de agacho) e é ~**3,1× D4** e ~**3,6× D5**. Enquanto essa razão não estiver dentro de uma
faixa escolhida, **R15 fica declarado ABERTO** — a reestruturação de D3 é decisão de coach
e não foi feita aqui.

**`EXP-TETO`** é o teto semanal de exposição do peitoral, `EXP = Σ_reps (duração_s ×
%TM/100)` sobre toda rep de **barra** de supino. Regra da coluna: `teto(w) = 1,25 ×
max(EXP(w−2), EXP(w−1))`, semeada em S4 com o próprio `EXP(S4)`.

⚠️ **RÓTULO CORRIGIDO: isto é +25% POR SEMANA, não por quinzena.** O texto anterior dizia
"+25%/quinzena" e a fórmula que roda é a de cima — a diferença é o **dobro de
permissividade**, e ela é decisiva pelo menos uma vez: na **S10** a fórmula entregue dá
teto **66,03** e a regra quinzenal pura (`1,25 × EXP(w−2)`) daria **59,89**, contra um
`EXP(S10)` medido de **60,61**. Ou seja: **a S10 só passa porque o teto é semanal.**
Publicado, não escondido. ⚠️ **E o teto continua sendo `[interpretação]` pura** — a base
pede "progredir gradualmente" e **não dá amplitude nenhuma**.
⚠️ **Limitação estrutural declarada:** `EXP-TETO` é `1,25 ×` a própria medição das semanas
anteriores, então **o checker valida o autor contra o autor** — a folga real vai de 9% a
43% em toda semana do bloco e a invariante **nunca morde**. Um teto ABSOLUTO ancorado na
S4 (ex.: `EXP(w) ≤ 1,60 × EXP(S4)`) é o que faria dela um freio de verdade; o valor é
escolha de coach e está em aberto. LACUNA registrada; revisar com o log de dor na S8.

**Prova de não-coincidência dos picos** (exigida por `design.md` §4-B): duração máxima
(2,0 s) em **S10–S11**, em D3, a 65% e teto de RPE 8; carga máxima (92% do TM) em **S16**,
em D2, com duração de 1,0 s; exposição alongada acessória máxima (6 séries a RPE 8) em
**S14**, em D5, com halter e máquina. **Cinco semanas de separação, nunca no mesmo dia.**

---

## 5. ORDEM DA SEMANA — ASCENDENTE

`D1 · descanso · D2 · D3 · descanso · D4 · D5`

| Dia | Principal 1 | Principal 2 | Acessório |
|---|---|---|---|
| D1 | Agacho com pausa NA profundidade legal — prática | Supino — volume | Costas, extensores |
| D2 | Supino — **FORÇA** | Terra — gauge + prática | Costas, ombro posterior |
| D3 | Agacho high bar — **secundário** (gauges de agacho e supino) | Supino — prática | Perna |
| D4 | Agacho low bar — **PRIMÁRIO** | Supino — volume | Ombro e braço |
| D5 | Terra sumo — **FORÇA** | Peito alongado | Ombro e braço |

- **Os dias de agacho ASCENDEM**: prática → secundário → primário (Perkins; o layout
  inverso foi testado por ele e não funcionou). Secundário 2 dias antes do primário: D3 →
  D4 ✓.
- **O terra pesado vai no dia SEGUINTE ao agacho mais pesado** (Perkins), para o agacho
  não mascarar o terra. ⚠️ **Objeção registrada e não resolvida:** *"muita gente tem o
  terra prejudicado por fazê-lo no mesmo dia depois do agacho ou sempre no dia seguinte ao
  agacho; tente ter algum treino de terra com o corpo descansado"* `[R121 @00:30]`
  `[GERAL]`. A mitigação foi aritmética — a razão axial D4/D5 caiu de 1,68× para ~1,17×, e
  nas semanas leves D4 fica **mais leve** que D5 — não uma resposta à claim. **É o primeiro
  candidato a ajuste se o terra estagnar**, junto com o contraponto de Noriega.
- **D3 leva 1 dia de descanso depois**, e isso é decisão de integração: com 8 séries de
  high bar D3 é o maior dia axial da semana, e cair na véspera do single primário
  destruiria a colocação de Perkins.
- **Tríceps** é o único acessório com restrição de posicionamento: não destruí-lo no treino
  anterior a um máximo de supino `[R54 @02:33]` `[GERAL]` — por isso D1 não leva tríceps e
  o dia anterior a D2 é descanso.
- Acessório sempre **depois** do principal `[R67]` `[R118]` `[GERAL]`.
- **Ordem de ajuste quando algo não anda** (Joe Stanek): *"ajustar volume é a última coisa
  que eu faço, porque volume carrega risco de lesão"* — mexer primeiro em frequência e
  acessório.

---

## 6. TEMPLATES DE DIA (semanas 1 a 16)

### TEMPLATE D1 (Agacho pausado NA profundidade legal · Supino volume · Costas · Extensores)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 3 | 2 | 3 | {AG-P} | {RPE-AG} | 3 MIN | PAPEL PRÁTICA (40–70%). PAUSA DE 1 s NA PROFUNDIDADE LEGAL — é a única exposição pausada NA amplitude que é a variável do bloco [design §13-B/R11]. REGRA, verbatim: "the top surface of the legs at the hip joint is lower than the top of the knees" [IPF-TR2026 §3.2]; as 3 reps filmadas falham por 4–8 cm [VÍDEO-SQ §3]. PAUSA COM TENSÃO MANTIDA: "pausa de 1 segundo é suficiente; mais que isso só limita carga sem ajudar mais na estabilidade — contar até 2 mentalmente equivale a cerca de 1 segundo real" [R124 @01:02] [GERAL]. POR QUE PAUSAR NO FUNDO: "elimina o momento do reflexo de estiramento e ensina a atravessar o sticking point, que fica logo acima do paralelo, mantendo boa posição" [R170 @04:38] [GERAL]; "forçam a manutenção de bom equilíbrio no midfoot na posição inferior" [R132 @02:36] [GERAL]; "punem qualquer desequilíbrio" [R16 @03:34] [GERAL]. CORREÇÃO MESTRA, METADE 1 — JOELHOS: "na posição de pausa, foque em empurrar os joelhos para frente e para fora; o efeito upstream mantém o quadril para frente e sob o corpo e o peito para cima — pensar dos joelhos para cima funciona melhor do que cuear quadril e peito diretamente" [R168 @02:11] [GERAL] ⚠️ [interpretação]: R168 diz isso da pausa ACIMA do paralelo. PROIBIDO cuear "peito para cima" ou "quadril para baixo" — é o que ele diz NÃO funcionar melhor. CORREÇÃO MESTRA, METADE 2 — ÂNGULO DE TRONCO: você agacha ~15° MAIS INCLINADO do que suas alavancas exigem (40° estando 5–8 cm ACIMA do paralelo; o esperado no fundo legal é 30–38°) e a inclinação extra NÃO vira carga útil [VÍDEO-SQ §4, §5]. O que transfere é o ESPELHAMENTO: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL]; "já iniciar a subida com o tronco na posição para a qual seu corpo naturalmente vai no sticking point" [R16 @04:05] [GERAL]. ⚠️ A doutrina "quem quer agachar o máximo de peso em geral não deve estar super ereto" [R159 @00:00] [GERAL] NÃO se aplica a você — "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação, e ainda encurta o braço de momento" [R159 @04:21] [GERAL] [interpretação de design §2]. CARGA: é o passo 3 de R115 em tabela — recue até bater profundidade sem hesitação, acumule reps no limiar, e só então "sobrecarregue progressivamente o percentual em que você bate a profundidade com confiança" [R115] [GERAL]; ⚠️ R115 não dá % nem prazo, LACUNA declarada. "Faça TODA repetição funda, desde a barra vazia e os aquecimentos, até virar segunda natureza" [R115 @03:05] [GERAL] — vale para os 3 aquecimentos. RIGOR: é a única exceção declarada do canal ao próprio anti-purismo — "em profundidade de agacho vale ser rígido" [R115 @03:05] [GERAL]. PARADA (RPE 10 operacional): encerre na primeira rep que perder a profundidade legal OU passar de ~38° da vertical, mesmo com RPE abaixo do teto. PEGADA, REGRA NOVA 2026 — "hands, thumbs, and fingers must be in complete contact with the bar" [IPF-TR2026 §3.2]: NADA de polegar por cima (thumbless/suicide grip), em nenhuma série e em nenhum aquecimento. É setup, custo zero, e é causa de DQ. COMANDOS DESDE A S1 [design §13-B/R12]: cinto, walkout de no máximo 3 passos — "mais de três passos no walkout desperdiça energia e cada passo é uma oportunidade a mais de algo dar errado" [R14 @04:36] [GERAL]; imóvel e pronto em 5 s, senão é "Replace" [IPF-TR2026 §3.2]; a janela inteira é de 60 s [IPF-TR2026 §3.7]; alguém dá "Squat" e "Rack". VÍDEO perpendicular, altura do quadril, 3–4 m |
| Supino Pausado (Competição) | 3 | {SUP-V1} | 5 | {SUP-V1-PCT} | {RPE-SUP} | 3 MIN | PAPEL VOLUME (70–80% × 5–7). PAUSA DE 1,0 s EM TODA REP, INCLUSIVE NOS 3 AQUECIMENTOS, DESDE A S1 [SPEC §2.2]. O degrau de 0,5 s de design §4-B NÃO EXISTE AQUI: zero ocorrências de meio segundo no corpus, e pausa auto-cronometrada de 0,5 s não é rep legal — a pausa da IPF tem duração INDEFINIDA, encerrada pelo árbitro [IPF-TR2026 §3.3]. O QUE RAMPLA NESTE DIA É A CONTAGEM: {SUP-V1} vai de 2 a 4 séries pausadas (S1→S7) e as séries que saem viram floor press; o que [VÍDEO-BP §3.2] MEDE é a DURAÇÃO da pausa dele hoje — 0,20 s — e é só isso que essa procedência sustenta; a contagem de reps pausadas por semana é medição do gerador (`VENA_BLOCK1_MEASURES[].repsPausadas`, S1 → S9) e não número digitado nesta nota. A versão anterior emprestava a autoridade do relatório de vídeo a uma contagem de desenho. DUAS CAUSAS SEPARADAS DE LUZ VERMELHA: (a) "the underside of both elbow joints is lowered level with or below the top surface of each respective shoulder joint"; (b) barra IMÓVEL até o "Press" [IPF-TR2026 §3.3]. NOVA 2026: "utilizing upper body thrust to initiate upward movement of the bar from the chest" e "lowering of the rib cage after the 'Press' command" [IPF-TR2026 §3.3] — com 0,2 s ele usa o ciclo alongamento-encurtamento, e quando a pausa real chegar esse empurrão vira o mecanismo natural de compensação [VÍDEO-BP §3.6]. ANTI-THRUST: "escolha um ponto de referência no fundo e garanta que as costelas não desçam além do afundamento da barra no peito, mantendo o arco erguido e empurrando as costelas em direção à barra" [R119 @01:36] [GERAL]. CUES DA PAUSA: "manter o arco firme sem deixá-lo colapsar ao tocar o peito, empurrar constantemente com as pernas, rolar a barra para baixo com movimento liderado pelo cotovelo, e não deixar os cotovelos rodarem em relação à barra — mover cotovelo, antebraço, mão e barra como um bloco sólido" [R93 @04:18] [GERAL]; se rodarem demais "a barra deixa de ser suportada pelo antebraço e passa a ser suportada pelo peito" [R119 @01:36] [GERAL]. LOCKOUT ANTES DE DESCER: meta de 2 s (hoje ~11 s medidos), da retirada ao início da descida em até 3 s — "tira a barra, 2 respirações, 1 s pra assentar, desce" [VÍDEO-BP §3.10, §7.1]. ⚠️ Isto é hipótese do relatório de vídeo, NÃO achado da base: o corpus tem ZERO claim sobre tempo em lockout ou custo isométrico no topo [tecnica §3.6]; o único análogo é o walkout de 3 passos [R14 @04:36]. GATE DE DOR OBRIGATÓRIO, TRÊS MOMENTOS (pré-sessão · 1ª série pausada com carga de trabalho · pós-sessão), 0–10 — ver §1.2. VÍDEO: dos pés na linha da barra E DE LADO — só a lateral julga a pausa, a queda de costela e o thrust [design §13-B/R13] |
| Floor Press (Barra) | 1 | {FP-SETS} | 8 | N/A | {FP-RPE} | 2 MIN | ⚠️ O TETO DE RPE É COLUNA ({FP-RPE}), NÃO CONSTANTE: 6 → 7 → 8 nas S1–S3, e só então estaciona em 8 — como {PEC-RPE} já fazia. Antes esta linha entrava a RPE 8 fixo já na S1, com 9 séries semanais (a maior dose de peitoral da semana) sobre o tecido lesionado, enquanto TODO supino de barra estava capado a RPE 6 na mesma semana. PEGADA: ESCOLHA UMA NA S1 E NÃO MEXA MAIS — é setup, custo zero [R31 @02:32] [GERAL], e a mesma regra que o terra já tinha. {FP-SETS} está no eixo `exposicao_peito`: o gate de dor de §1.2 CONGELA esta linha, e a porta de invalidação do gauge de supino conta o movimento dela. Paga R3 (supino ≥22 séries/semana) SEM gastar exposição em comprimento máximo [SPEC §2.3]; é o par de {SUP-V1}, FP-SETS = 7 − SUP-V1. EXECUÇÃO: tríceps toca o chão sem largar a carga e SEM pausa mantida; amplitude para ~2 cm acima da profundidade da lesão. Cotovelo lidera, cotovelo, antebraço, mão e barra como bloco sólido [R93 @04:18] [GERAL]. RACIONAL DE AMPLITUDE, e a distinção importa: a claim [GERAL] vem com ressalva — pegada larga tem "menos amplitude, portanto menos fatigante para alguns e melhor para alguns ombros por não ir tão fundo em flexão, MAS PARA OUTROS TRABALHA MAIS O OMBRO" [R103 @00:33] [GERAL]. A claim sem ressalva é [PESSOAL]: "Spoto press tem menos amplitude absoluta nos ombros, sendo mais fácil na articulação — bom jeito de acumular volume dando descanso ao ombro" [R170 @08:30] [PESSOAL], e é sobre OMBRO, não peitoral. ESTRUTURA DO BLOCO: "estrutura boa de supino inclui trabalho de hipertrofia, uma variação que treina controle e outra que previne overuse" [R47 @01:32] [GERAL] — aqui o floor press é a que previne overuse, o pausado é o específico e o controle mora na pausa de 2 s de D3. RPE 8, NÃO à falha: "quanto MENOS específico o exercício, mais perto da falha ele deve ser empurrado" [R112 @02:10] [GERAL]; ⚠️ o número 8 é [interpretação] — Vena dá a direção, não o número. ❌ SPOTO PRESS REJEITADO: contradição interna não resolvida — [R103 @02:35] [GERAL] diz que pausar a 1 polegada do peito carrega MAIS o ombro, [R170 @08:30] [PESSOAL] diz o oposto; "indeterminado" não é lugar para pôr tecido lesionado. ❌ Não é halter: halter em posição alongada é o mesmo vetor de risco por outra porta, sem teto de amplitude. ⚠️ LACUNA DECLARADA: o corpus tem ZERO sobre board, floor ou pin press como ferramenta de reabilitação de peitoral [tecnica §5.1] — esta linha é prescrição do relatório de vídeo, NÃO do canal. ⚠️ R166 É VIOLADO POR ESTA ADIÇÃO, e fica escrito: "não mude muitas variáveis de uma vez (frequência + volume + seleção de exercícios no mesmo ciclo): se melhorar, você não sabe o que causou" [R166 @08:14] [GERAL]. Contra-argumento assumido, por analogia com o high bar de design §5: exercício novo entrando com carga leve não é mudança na execução do lift de competição |
| Remada Unilateral com Halter | 1 | 4 | 6-8 | N/A | 9 | 2 MIN | SEM STRAPS — Pana: remada unilateral com halter é "um padrão em qualquer treino sério de terra", 2–3×6–8, sem straps; "se minhas costas ficarem fortes pra caramba mas eu não conseguir transferir isso para o terra por causa de pegada fraca, não me ajuda como powerlifter" [elites §3.1, §3.3]. É o acessório mais recorrente do roster de elites, 6/10. ⚠️ 4 séries está ACIMA das 2–3 de Pana: o excedente existe para pagar R4 (costas ≥12/semana e acima de bíceps e delt lateral), e é escolha desta spec, não de Pana. POR QUE COSTAS ESTÁ ACIMA DE BRAÇO E OMBRO NA FILA: é o único ponto em que estética e força coincidem — espessura muscular subescapular foi o melhor preditor isolado de desempenho em CADA levantamento, agacho r = 0,79–0,91 (Brechue e Abe 2002, n=20) [elites §3.4]. E casa com o gargalo dele: "no agacho não se esgota a força de extensão de quadril porque os extensores espinhais falham antes e o peito colapsa" [R88 @00:31] [GERAL]; "tronco mais espesso permite resistir melhor à flexão espinhal, manter o peito estendido e levantar mais" [R16 @01:33] [GERAL]. REPS 6–8 e não menos: "é difícil ser rigoroso na forma em reps baixas, ex.: não usar impulso na rosca, ou seguir um caminho de braço específico na remada" [R134 @00:33] [GERAL] |
| Puxada Vertical | 1 | 4 | 8-10 | N/A | 9 | 2 MIN | Segundo acessório mais recorrente do roster, 5/10 — Sitko, Pana, Perkins, Orhii, Olivares [elites §3.3]. Entra por R4; com estas 4 mais 4 de remada em D1 e 4 de puxada neutra em D2, costas fecha em 12 séries diretas por semana, acima de bíceps (11) e de delt lateral (9). ⚠️ CORREÇÃO EXIGIDA PELA AUDITORIA, contra o próprio repositório: a versão anterior desta nota dizia que "o deltoide POSTERIOR é servido de graça por esta linha e pela remada", e por isso R5 teria sido resolvido como lateral 9 + posterior 3 em vez de 8 + 4. OS DADOS DIZEM O CONTRÁRIO: `one_arm_row` e `wide_grip_lat_pulldown` têm `muscleMap = { costas: 1.0, bíceps: 0.5 }` em `src/data/exercises/powerbuilding.ts` — ZERO deltoide posterior. O crédito parcial que a justificativa invocava NÃO EXISTE no mapa dessas duas linhas. Quem de fato dá crédito parcial de posterior é a PUXADA NEUTRA de D2 (`puxada_neutra`, 0,5 × 4 séries), então a ponderada real é 3 + 2 = 5 séries por semana — não as 9 que `SPEC_REV2` §1.5 declara, e não 3. A escolha 9+3 fica de pé como ESCOLHA de orçamento de ombro, não como consequência de crédito indireto — e é assim que está declarada aqui. O gerador publica as duas contagens (direta e ponderada) em `VENA_BLOCK1_MEASURES` com nomes distintos, para que a divergência não volte a ser invisível. Perto da falha porque a especificidade é baixa [R112 @02:10] [GERAL] |
| Stiff-Legged Deadlift | 1 | 1 | 8 | N/A | 4-5 | 2 MIN | MIGRADO DE D5 [SPEC §1.2] — é metade da realocação que resolve os dois lados de R14. RPE 4–5 É LITERAL: "não programa esses hinges pesados como muita gente faz: mantém em RPE 4 a 5, porque o objetivo é praticar a habilidade — leve demais não trabalha nada, pesado demais faz o corpo transformar naturalmente num movimento mais convencional" [R11 @02:36-03:07] [GERAL]. STIFF E NÃO RDL, PELA ALAVANCA: "quem tem boas alavancas de terra (braços longos) faz stiff-legged, se conseguir manter o hinge estrito na amplitude completa" [R11 @02:05] [GERAL] — envergadura 184, índice +6. FREQUÊNCIA: "todos os atletas sumo dele fazem stiff-legged ou romeno UMA VEZ POR SEMANA" [R11 @03:07] [GERAL]. EXECUÇÃO: flexão de joelho mínima, "só o suficiente para manter equilíbrio e acessar flexão de quadril mais profunda" [R88 @01:31] [GERAL]. ⚠️ DOSE ABAIXO DA PRESCRIÇÃO, e é declarado: "para quem puxa sumô, ele costuma recomendar que 20–25% do volume de deadlift seja convencional ou variações dele" [R88 @02:02] [GERAL] — 1 série em 8 de terra é 12,5%. O que sustenta a dose mínima é o precedente [PESSOAL] (ele mesmo roda 6 séries por semana de terra). ⚠️ CONTRAPONTO MAIS RECENTE, [PESSOAL]: ele TIROU o stiff-legged do próprio programa — "adicionou achando que faltava treino de hinge para destravar o terra, mas concluiu que não era o caso… melhor fazer mais prática de sumô" [R4 @06:07]. CRITÉRIO DE CORTE ao fim do bloco: se não der sinal, cortar e devolver o volume para sumo. ⚠️ E carrega custo: "RDL e stiff carregam muito as costas, ruim para quem não aguenta muito volume de terra" [R107 @03:10] [GERAL] — é o motivo de ficar em 1 série e em D1, três dias antes do terra de força. ⚠️ A DISTÂNCIA PARA TRÁS, QUE A NOTA ANTERIOR OMITIA E É A QUE MORDE: D1 cai **24 h depois de D5**, que é o maior estímulo axial da semana (single a 86–92% + 3×3 a 82–86% de terra). Ou seja, a distância para o terra pesado seguinte é de 3 dias, mas para o terra pesado ANTERIOR é de ZERO dias. É por isso que a dose aqui é 1 série e RPE 4–5 LITERAL, e é por isso que a Extensão Lombar da linha seguinte não sobe de 3 séries: as duas somadas são o que cai sobre eretores recém-carregados. Se o terra estagnar, esta dupla é o primeiro candidato a realocação, junto com o layout de D3 |
| Extensão Lombar (Hiperextensão) | 0 | 3 | 10-15 | N/A | 9 | 1-1.5 MIN | MIGRADA DE D5 [SPEC §1.2]. Extensão de quadril ou hiper aparece em 5/10 do roster de elites, e para Pana é a escolha nº 1 de acessório de terra, 1–2×/semana [elites §3.3, §8]. ⚠️ CITAÇÃO CORRIGIDA — a versão anterior apagava duas palavras DE DENTRO DAS ASPAS. O verbatim é: "hyperextension é um ótimo exercício PARA ADUTORES desde que a máquina caiba na sua anatomia de quadril e não seja estranha de carregar — se estender demais, o apoio crava no estômago; se for baixo demais, não chega à articulação do quadril" [R11 @04:40] [GERAL], e a claim vizinha confirma o contexto ("como ele mantém o hinge e o próprio SBD submáximos, prefere atacar os ADUTORES com trabalho acessório", [R11 @04:40] [GERAL]). R11 endossa o exercício PARA ADUTORES, não para eretores — e esta linha paga `eretores_series_diretas_semana >= 4`. QUEM SUSTENTA O PAPEL DE ERETORES é [elites §3.3, §8] (Pana: extensão de quadril/hiper é a escolha nº 1 de acessório de terra, 1–2×/semana), que já estava nesta linha; R11 fica como AJUSTE DE MÁQUINA e como crédito de adutor, que é bônus. ⚠️ EQUIPAMENTO FORA DO INVENTÁRIO CONFIRMADO: design §0-B não lista banco de extensão lombar. Se não houver, a substituição declarada é GOOD MORNING COM BARRA na mesma dose (o rack e a barra existem), e ela está no campo de alternativas desta linha. Descanso 1–1,5 MIN é prescrição honesta em vez da faixa "1-2 MIN" que escondia 1 min por série no orçamento |
| Elevação Lateral (DB) | 0 | 2 | 10-15 | N/A | 9 | 1-1.5 MIN | 2 aqui mais 3 em D4 mais 4 em D5 = 9 por semana; com 3 de delt posterior fecha 12, o teto de toda fonte publicada [design §13-B/R5]. Delt lateral recebe crédito ZERO do SBD — todo volume aqui é aditivo e não compete com nada [design §10-B; Pelland 2025, crédito de série indireta 0,5; Mannarino 0,47]. REPS ALTAS PORQUE É FÁCIL ROUBAR: "reps altas continuam úteis em movimentos onde é fácil roubar, como elevação lateral" [R76 @02:37] [GERAL]; "remada e elevação lateral (fáceis de usar impulso) → repetições mais altas, porque as reps iniciais são fáceis e dá para ser mais estrito" [R122 @02:04] [GERAL]. ⚠️ NENHUMA afirmação de vantagem de posição alongada para deltoide: os dados de comprimento muscular vêm de tríceps, isquiotibiais e bíceps, e há conflito frontal na base (Helms escolhe cabo PORQUE alonga; Stanek prescreve laterais no cabo e press-arounds ENCURTADOS) [design §10-B]. Halter aqui por disponibilidade e economia de tempo, não por superioridade. ⚠️ Não existe landmark por cabeça de deltoide em fonte nenhuma |
| Rosca na Polia | 0 | 2 | 8-12 | N/A | 9 | 1-1.5 MIN | Bíceps recebe crédito ZERO do SBD — todo volume é aditivo (Mannarino et al. 2021: flexores de cotovelo +11,06% com rosca vs +5,16% com remada, p = 0,009) [design §10-B]. ⚠️ CONTRADIÇÃO DA PRÓPRIA BASE, DECLARADA: [R10 @02:08] [GERAL] "no isolamento é preciso experimentar quantas séries você tolera; costuma achar 1 a 3 séries por músculo" CONTRA [R145 @05:13] [GERAL] "8 a 15 séries por músculo ou movimento cobre a maioria das pessoas". As duas são dele, com anos de diferença, e ele NUNCA as reconcilia. As 11 séries de bíceps por semana deste bloco ficam dentro de R145 e muito acima de R10; a escolha é explícita e ancorada em Nippard (≥8–10) e no empírico PB2.0 (10–16), NÃO em Vena. E o que ele FAZ é outra coisa ainda: [R170 @03:34] [PESSOAL] 3 séries de rosca ~5 dias por semana, [R154 @01:06] [PESSOAL] 4 séries todo dia. REPS 8–12 e não menos [R134 @00:33] [GERAL]. ⚠️ NÃO existe claim de que bíceps forte proteja o cotovelo no agachamento — zero em 3.154. As soluções documentadas para cotovelo no agacho são POSICIONAIS, e narrativa de "músculo fraco" é tratada como nocebo a evitar: "narrativas simplificadas criam nocebo e medo de certos movimentos" [R1 @06:11] [GERAL]. Bíceps entra por ESTÉTICA, que é razão suficiente e honesta |

**DESCANSO SUGERIDO: 1 DIA**

### TEMPLATE D2 (Força de Supino · Gauge e Prática de Terra · Costas)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Supino Pausado (Competição) | 6 | 1 | {SUP-F-REPS} | {SUP-F} | {RPE-SUP} | 3 MIN | ⚠️ SÃO 6 AQUECIMENTOS, NÃO 4, E ISSO É CORREÇÃO DE SEGURANÇA CONTRA O ORÇAMENTO: partindo da barra vazia, 4 séries não fecham a regra da base — saltos de 5–10% com os DOIS ÚLTIMOS a 4–7,5% [R52 @02:02] [R110] —, e esta é a série mais pesada da semana num atleta com peitoral lesionado. Custa ~3 min por sessão, e a regra de prioridade aplicada é explícita: segurança acima do orçamento de tempo. HANDOFF: peça o handoff a um parceiro SEMPRE que houver um, desde a S1 — hoje ele retira e recoloca a barra sozinho, e "em prova, com handoff, o groove muda" [VÍDEO-BP §4 item 9]; o simulado não é lugar para estrear isso. TOP SET. O % é do trainingMax CORRENTE, não do 1RM. PAUSA DE 1,0 s em toda semana e em todo aquecimento — D2 é o dia de tensão de PICO (chega a 92% do TM) e por isso carrega a duração MÍNIMA legal; o bloco de 2 s vive em D3 a 65%. 1,0 s é PISO, não alvo: a pausa da IPF tem duração INDEFINIDA e é encerrada pelo árbitro [IPF-TR2026 §3.3] — segure imóvel até o "Press", nunca auto-cronometre a saída. Calibração mental: "contar até 2 mentalmente equivale a cerca de 1 segundo real" [R124 @01:02] [GERAL] ⚠️ [interpretação]: a claim é sobre pause SQUAT, a transferência para o supino é leitura minha. TRAVE OS BRAÇOS ANTES DO "Start" — cartão azul se não travar [IPF-TR2026 §3.3, NOVA 2026]. Da retirada ao início da descida em até 3 s: hoje ele fica ~11 s em lockout, carga isométrica quase máxima ANTES da posição de maior risco [VÍDEO-BP §3.10, §7.1] ⚠️ achado do relatório de vídeo, ZERO claims no corpus sobre tempo no topo [tecnica §3.6]. COMANDO DADO POR TERCEIRO sempre que houver parceiro — "as condições de competição podem ser mais difíceis mesmo que a pausa não seja mais longa, simplesmente porque o atleta não controla o comando" [R83 @01:37] [GERAL] ⚠️ o canal NUNCA prescreve treinar com comando de terceiro, só long pause e spoto, que são autocontrolados [tecnica §3.4, LACUNA]. NÃO EXISTE SINGLE NA S1 NEM NA S2: {SUP-F-REPS} roda 3 e a leitura da S2 é a back-off. FILME DE LADO, pré-condição do bloco. GATE DE DOR, três momentos — §1.2 |
| Supino Pausado (Competição) | 0 | 4 | 3 | {SUP-F-BO} | {RPE-SUP-BO} | 3 MIN | BACK OFF — 4 séries, FIXO, não oscila em nenhuma semana: oscilar aqui derrubaria a semana leve para 21 séries de supino e violaria R3, que pede ≥22 SEMPRE. É esta linha que entrega a dose pesada do bloco: com clamp(TOP−6pp, 82, 88) estas 4 séries mais o top set percorrem RPE 7,5 → 9,5, que é exatamente a faixa peer-reviewed de Pak Androulakis-Korakakis 2021 (3–6 séries de 1–5 reps por levantamento por semana acima de 80% 1RM), SEM prescrever um quilo acima de 92% do TM. REGRA DE PARADA: encerre a série quando ela passar de RPE 9,5 OU quando UMA REP SAIR DO PADRÃO LEGAL — o que vier primeiro. ⚠️ O esquema de reps das back-offs é [interpretação]: design §10 dá o offset e a parada, NÃO dá o esquema. RPE 10 aqui NÃO é falha muscular: é "a barra não fica imóvel na pausa, ou a costela desce além do afundamento da barra". CUES DA PAUSA: arco firme sem colapsar ao tocar o peito, empurrar constantemente com as pernas, rolar a barra para baixo com movimento liderado pelo cotovelo, mover cotovelo, antebraço, mão e barra como um bloco sólido [R93 @04:18] [GERAL]. ANTI-THRUST, que é o que a regra NOVA de 2026 pune: "escolha um ponto de referência no fundo e garanta que as costelas não desçam além do afundamento da barra no peito" [R119 @01:36] [GERAL]. SINAL DIAGNÓSTICO de perda de tightness, VISTO DE LADO: depois de tocar o peito os cotovelos começam a se mover em relação à barra [R160 @03:53] [GERAL] |
| Terra Sumo (Sem Strap) | 3 | 1 | 5 | {TER-G} | {RPE-TER-G} | 3 MIN | FILME PERPENDICULAR, ALTURA DO QUADRIL — §3 exige vídeo de "todo top set e todo gauge de terra" e esta é uma das duas linhas que cumprem a regra. GAUGE SET — é a ÚNICA coisa que move o trainingMax do terra. PRIMEIRA SÉRIE DE TRABALHO DO TERRA NO DIA, sempre nesta posição — fonte literal: "subsequent sessions use a gauge set: FIRST WORK SET at a target %" [Noriega], e a posição fixa é o que permite "comparar com pontos equivalentes" [R114 @00:31] [GERAL]. Fica em D2, o dia LEVE de terra, e não em D5: leitura em estado fresco, imune à oscilação de back-offs, e tira 30% da tonelagem axial de D4. 5 reps e não 7 porque "quando você chega em oito reps ou mais, a técnica normalmente é lixo" e "você não quer que o terra vire um exercício de cardio" [Pana]. A carga é 76% do TM, FIXA — ⚠️ a âncora de 5 reps é [interpretação]: Noriega só publica a de 7 reps. RPE NÃO É ALVO NEM TETO AQUI: É A LEITURA. Referência 6,5; ao re-ancorar, a referência RESETA para 6,5 e a semana seguinte é linha de base. Sem strap, reset a cada rep, padrão legal completo. ⚠️ REGRA DE INVALIDAÇÃO: se a série for encerrada por FALHA DE PEGADA e não por esforço de tração, a leitura é INVÁLIDA NOS DOIS SENTIDOS — registre e descarte, não ajuste o TM. 5 reps a 76% sem strap é plausivelmente limitado por pegada, e um instrumento limitado por outra coisa não mede. ⚠️ PROCEDÊNCIA CORRIGIDA: a regra de invalidação é [interpretação] DO DESENHO — não existe no corpus nenhuma claim sobre invalidar uma medida por pegada. O que a base dá é o FATO que a motiva: "costumava sempre soltar o terra pela pegada, mesmo tendo a força para o levantamento" [R42 @00:02] [PESSOAL]. A citação anterior ([R42 @01:33]) apontava para uma claim sobre ciclo vicioso de mãos machucadas, que não sustenta a regra. ⚠️ LIMITE DO INSTRUMENTO, escrito porque a promessa anterior era falsa: a estrutura que PRECEDE este gauge NÃO é invariante entre semanas — o top set de supino de D2 é 1×3 nas S1–S2 e 1×1 da S3 em diante. A comparabilidade semana a semana vale a partir da S3; a leitura da S1 contra a da S2 carrega essa diferença e não deve mover o TM sozinha. Se a mão for o limitante, use grip holds contando até 10 no fim da série [R42 @00:32] [PESSOAL] em vez de strap |
| Terra Sumo (Sem Strap) | 0 | 3 | 3 | {TER-P} | 6 | 3 MIN | DIA DE PRÁTICA — teto RPE 6, e é AQUI que o lockout geométrico se aprende, NUNCA sob RPE 8 [design §13-B/R10]. REGRA NOVA 2026: "the front bundle of the deltoid muscle should be placed behind the imaginary projection of the bar" — 2025 dizia só "and the shoulders back", e um "neutral, straight-up finish MAY NOW BE JUDGED SHORT" [IPF-TR2026 §3.4]. PRESCRIÇÃO: travar passado o neutro, deltoide anterior ATRÁS da linha da barra, IMÓVEL até o "Down", e descer com as duas mãos — "practise the hold; practise NOT dropping" [IPF-TR2026 §3.7]. ⚠️ O corpus tem ZERO menções a esta regra: todo o conteúdo de lockout dele é sobre joelhos, hitch e extensão de coluna e quadril, NUNCA sobre geometria do ombro contra a barra [tecnica §6.5, LACUNA]; e o claim de que "na IPF a arbitragem não costuma marcar joelho mole em terras sumô" [R112 @05:16] [GERAL] é ANTERIOR a 2026 e deve ser tratado como NÃO CONFIÁVEL. O que do corpus casa com a regra: [R170 @11:06] [PESSOAL] "no sumo, deixar os ombros irem muito à frente ajuda a tirar do chão mas compromete a posição para o lockout" — sob a regra geométrica esse trade-off fica mais caro; e [R155 @01:36] [GERAL] "puxar com as costas muito arredondadas dificulta o lockout". O "desenrolar" a treinar é extensão total de quadril mais extensão torácica mais RETRAÇÃO ESCAPULAR [R121 @04:08] [GERAL]. SEM STRAP e RESET A CADA REP entram juntos na SEMANA 1: "não fazer touch and go nem afrouxar entre reps; resetar a posição a cada repetição para praticar encontrar a posição correta em todas elas" [R77 @01:34] [GERAL], "evite touch and go nas séries de trabalho; é bom soltar e até resetar a posição" [R123 @00:30] [GERAL]; e "uso mínimo de straps, para colher o máximo de estímulo de pegada" [R42 @00:02] [GERAL], porque "com straps a barra fica praticamente pendurada fora da mão, cortando ainda mais amplitude" [R174 @02:48] [GERAL]. ⚠️ R63 DECLARADO VIOLADO, com contra-argumento: entram três restrições no mesmo dia da S1 (sem strap, reset e lockout geométrico), contra "mude poucas coisas de uma vez — idealmente apenas uma por levantamento" [R63 @02:01] [GERAL]. Contra-argumento: as três são CONFORMIDADE COM A REGRA, não variáveis de carga, e a carga fica em 65%. Registrado, não omitido. O dynamic start [R160 @05:00] [GERAL] fica FORA do Bloco 1 de propósito: é a quarta mudança e é de performance, não de legalidade. Alguém dá o comando "Down" desde a S1 |
| Puxada Vertical (Pegada Neutra) | 1 | 4 | 5-8 | N/A | 8 | 2 MIN | É uma das 6 séries novas de costas que pagam R4 (12 diretas por semana, acima de bíceps 11 e de delt lateral 9). Dorsais são o único acessório que paga nos dois eixos: Brechue e Abe 2002 (n=20 powerlifters de elite, 4 campeões mundiais) — espessura muscular subescapular foi o melhor preditor isolado de desempenho em cada levantamento, agacho r = 0,79–0,91 [elites §3.2]. Esforço na faixa de acessório de Pak (RPE 7–9). REGRA DE CORTE DE SÉRIES: pare quando, para o mesmo peso e reps, o RPE subir 1 a 2 pontos [R10 @00:34] [GERAL]. ⚠️ SUBSTITUIÇÃO DECLARADA: o roster de elites faz BARRA FIXA COM PESO (Sitko, barra fixa 2×/semana, descrita pelo treinador como "a única coisa que ela realmente faz"), mas barra fixa NÃO está no inventário confirmado (design §0-B) e a máquina de puxada está. A dose foi preservada, o aparelho não |
| Face Pull na Polia | 0 | 3 | 15-20 | N/A | 8 | 1-1.5 MIN | As 3 únicas séries diretas de deltoide posterior da semana — ESCOLHA da spec: lateral 9 acima de posterior 3, porque design §10-B dá ao posterior crédito PARCIAL de remada e puxada e R4 acaba de dobrar as puxadas, enquanto o lateral não é servido por nada. Leve, foco na conexão. Justificativa do trabalho isolado de ombro EM PARALELO ao supino: "algumas pessoas sentem dor no ombro ao fazer flare; ele não acha que seja inerente ao movimento — é questão de dar tempo ao corpo, aclimatar devagar e fazer trabalho isolado de fortalecimento de ombro em paralelo" [R167 @03:11] [GERAL] — e isso é explicitamente DISTINTO de "corretivo", que a base rejeita [R1 @03:07]. Na polia da máquina de puxada, porque banda não está no inventário confirmado (design §0-B) |
| Tríceps Overhead na Polia | 0 | 3 | 10-12 | N/A | 8 | 1-1.5 MIN | Vem por ÚLTIMO na sessão de propósito: "isolamento de tríceps constrói tríceps e ajuda o supino no longo prazo, mas não se deve destruir o tríceps no treino anterior a um máximo de supino — é preciso achar o ponto de corte" [R54 @02:33] [GERAL]. Overhead e não pushdown porque a cabeça longa cruza o ombro e o supino não a treina — "só duas das três cabeças do tríceps são realmente usadas no supino: a cabeça longa cruza a articulação do ombro e atua como extensora de ombro, e como no supino queremos flexionar o ombro, o corpo escolhe não ativá-la tanto" [R101 @01:37] [GERAL], mesma claim em [R30 @02:34]. Suporte externo: Maeo et al., 21 sujeitos, 12 semanas, RM — cabeça longa +28,5% overhead vs +19,6% pushdown (p<0,001); ⚠️ Stasinaki et al. 2018 NÃO replicou, e o próprio Vena alerta contra reagir demais a achado único não replicado [R100 @02:45] — não é fato consolidado [bracos §4.4]. ⚠️ NÃO afirmar que overhead "trabalha a cabeça longa" citando Vena: o que [R119 @04:49] [GERAL] de fato diz é o inverso — "movendo o ombro durante os exercícios de tríceps dá para EVITAR ativar a cabeça longa" — e que evitá-la vale "talvez um pequeno benefício teórico" [R119 @05:23]. Seleção governada por "o exercício exato de tríceps não importa muito… faça aquele em que você aguenta mais volume" [R119 @05:23] [GERAL]. ⚠️ Mesma contradição de volume [R10 @02:08] × [R145 @05:13], declarada em §1 |

**DESCANSO SUGERIDO: 0 DIAS**

### TEMPLATE D3 (Gauges · High Bar secundário · Supino prática)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 3 | 1 | 7 | {AG-G} | {RPE-AG} | 3 MIN | GAUGE SET — PRIMEIRO BLOCO DA SESSÃO e primeira série de trabalho de agacho do dia. É INSTRUMENTO, NÃO ESTÍMULO: é a única série do programa que move o trainingMax, com regra bidirecional (§1.1). ALVO RPE 6,5, nunca perseguido — 7 reps a 70% do TM é a âncora "série de 7 a RPE 6–7 = 70%" [Noriega]. Só é comparável contra o gauge de agacho da SEMANA ANTERIOR: "para avaliar progresso fora do pico, compare com pontos equivalentes de ciclos de treino passados — e por isso ao iniciar um novo ciclo mude poucas coisas de cada vez, para manter os ciclos comparáveis" [R114 @00:31] [GERAL]. PORTA: se qualquer rep sair fora da profundidade legal, a leitura NÃO SOBE o TM nesta semana — "agache mais fundo começando com pesos mais leves, onde você bate profundidade sem hesitação, mesmo que precise recuar bastante a carga" [R115 @02:34] [GERAL]. Os 3 aquecimentos são NA PROFUNDIDADE LEGAL: "faça toda repetição funda, desde a barra vazia e os aquecimentos, até virar segunda natureza" [R115 @03:05] [GERAL]. Filme perpendicular, altura do quadril, 3–4 m ⚠️ [interpretação]: o canal prescreve rigor com profundidade mas nunca ensina a aferir [tecnica §1.6, LACUNA] |
| Agachamento High Bar | 2 | 8 | 5 | {AG-V} | {RPE-AG} | 3 MIN | PAPEL VOLUME (70–80% × 5–7), não esforço máximo — é o que justifica 3 MIN e não 5 [desvio da prescrição literal, registrado]. 8 séries = 50,0% das 16 séries de agacho da semana [design §13-B/R7, que mede em SÉRIES]; base: "faz cerca de metade de todo o seu volume de agacho com high bar" [R18 @00:33] [PESSOAL] e "high bar é item fixo nos programas dos clientes dele: todo cliente que agacha low bar também faz high bar" [R18 @00:33] [GERAL]. REGRA DURA DE EXECUÇÃO: "programar o high bar com os mesmos cues do low bar: mesma largura de stance, mesma quantidade de inclinação de tronco — NÃO stance estreito, superereto, com joelhos muito à frente"; o estilo ereto "tem lugar se o objetivo for isolar quads, mas negligencia os extensores de quadril" [R18 @01:34] [GERAL]. POR QUE HIGH BAR AQUI: "mais fácil atingir a profundidade e, por não exigir tanta inclinação de tronco quanto o low bar, mais fácil se manter sobre o meio do pé e equilibrado" [R68 @01:31] [GERAL]. CORREÇÃO MESTRA, METADE 1 — ÂNGULO DE TRONCO: você agacha ~15° mais inclinado do que suas alavancas exigem [VÍDEO-SQ §4] ⚠️ [interpretação] de design §2, não é claim do canal. O princípio que transfere é ESPELHAR: "fazer hinge suficiente no quadril na descida para que o ângulo do tronco na excêntrica espelhe essencialmente o da concêntrica" [R64 @02:02] [GERAL], "sem mudança de posição do tronco entre a excêntrica e a concêntrica" [R87 @03:12] [GERAL]. ⚠️ A DIREÇÃO da doutrina do canal ("as pessoas deveriam agachar um pouco mais curvadas", [R159 @05:58]) NÃO se aplica a você — [R159 @04:21] [GERAL]: "fêmur curto exige menos movimento para atingir profundidade, logo menos inclinação". E a inclinação extra não vira carga: "no good morning squat involuntário, joelhos e quadril vão para trás e para cima mas a barra não sobe nem desce — só transfere carga do joelho para quadril e coluna" [R159 @02:14] [GERAL]. CORREÇÃO MESTRA, METADE 2 — JOELHOS: "empurrar ativamente os joelhos para frente e para fora, sem deixá-los recuar, resolve grande parte do problema" [R169 @14:14] [GERAL], e "manter a posição de joelho permite dirigir corretamente com os quadríceps através do sticking point" [R168 @01:35] [GERAL]. NÃO cuear "peito para cima" nem "quadril para baixo". REGRA DE PARADA — É A PROFUNDIDADE, NÃO O RPE: encerre a série na rep que perde a profundidade legal ou em que o tronco muda de ângulo entre descida e subida [R115 @03:05] [GERAL]. ⚠️ PRIORIDADE INVERTIDA NESTA REVISÃO, e o motivo está escrito: se alguma série antes da 8ª chegar ao teto de RPE, CORTE A SÉRIE E ENCERRE O EXERCÍCIO — e congele o degrau de {AG-V} na semana seguinte. A regra anterior mandava completar as 8 séries "porque são o requisito de R7", o que CANCELAVA a regra de parada declarada em §0.1 deste mesmo arquivo e em [R10 @00:34] [GERAL], e prescrevia séries na zona em que a rep sai alta — no exercício escolhido justamente por ser o mais barato para exigir rigor. R7 (~50% do volume de agacho em high bar) é [interpretação] e é cota de CONTAGEM; a profundidade legal é a tese do bloco. Legalidade vence cota. DESCIDA EM VELOCIDADE CONSTANTE: "muita gente acelera no fundo, o que anula o propósito; use uma única velocidade consistente do começo ao fim" [R132 @03:38] [GERAL]. Altura do rack: "mirar na parte baixa do peito" e "é sempre melhor errar para baixo do que para cima" [R14 @00:32, @01:02] [GERAL]. Walkout de 3 passos [R14 @04:36] [GERAL]. ⚠️ 8×5 e não 8×6, E ISSO É DIVERGÊNCIA DECLARADA DA SPEC: `SPEC_REV2` §1.3/D3 e §3.4 prescrevem 8×6 e o entregue é 8×5 — −16,7% de reps do secundário. Nenhum checker acusa porque a métrica travada (R7) é em SÉRIES, e por isso a divergência fica escrita aqui e em §9. Motivo: com 8×6 este vira o maior dia axial da semana, dois dias antes do single primário, e as últimas séries passariam do teto de RPE 8. ⚠️ DESCONTO DE HIGH BAR, DECLARADO PARA QUE A INTENSIDADE REAL SEJA COMPUTÁVEL: {AG-V} é percentual do trainingMax de LOW BAR aplicado ao high bar. Adotado `TM_high_bar ≈ 0,90 × TM_low_bar` [interpretação: NÃO existe número no corpus para high bar dividido por low bar, tecnica §2.5 — 10% é a folclórica do esporte e está aqui como número explícito em vez de número escondido]. Logo os 70–74% desta coluna são 77,8–82,2% da capacidade REAL de high bar, e a S16 (74%) sai a ~82% por 5 reps ≈ RPE 9 — ACIMA do teto declarado de 8, em 8 séries semanais. É por isso que a regra de parada aqui é a PROFUNDIDADE e o corte de série acima, e não o RPE. Resolver de verdade exigiria uma âncora própria de high bar, que é número novo e não foi criada |
| Supino Pausado (Competição) | 2 | 1 | 7 | {SUP-G} | {RPE-SUP} | 3 MIN | GAUGE — primeira série de trabalho de supino do dia. PAUSA DE 1,0 s EM TODA SEMANA, INCLUSIVE S10–S11: sem isso o gauge mede aclimatação à pausa, não força. ALVO RPE 6,5. Os 2 aquecimentos também são pausados 1,0 s — invariante PAUSA-1S, nenhuma rep de barra de supino de competição abaixo de 1,0 s em nenhuma semana. ⚠️ Este gauge é lido DEPOIS de 8 séries de high bar: é comparável SÓ contra o gauge de supino da semana anterior, nunca contra o supino de D1, D2 ou D4 [R114 @00:31] [GERAL]. ⚠️ E A ESTRUTURA ANTERIOR A ELE VARIA, contra o que esta nota prometia: as 8 séries de high bar que o precedem sobem {AG-V} 70% → 72% (S9) → 74% (S13), ou seja, a fadiga a montante CRESCE MONOTONICAMENTE ao longo do bloco. A promessa foi removida em vez de mantida falsa. O viés é CONSERVADOR — mais fadiga antes empurra a leitura para baixo, e leitura para baixo não sobe o TM —, mas o gauge de supino deve ser lido sabendo disso, e o gerador publica `gaugeEstruturaAnteriorVaria` em `VENA_BLOCK1_MEASURES` para que a variação seja auditável. PORTA: se qualquer coluna do eixo exposicao_peito subiu nesta semana (SUP-V1, SUP-V4, PAUSA-P, PEC-SETS), a leitura é INVÁLIDA PARA SUBIR; só a direção de descer age. Do rack ao início da descida em até 3 s ⚠️ [VÍDEO-BP §7.1, interpretação] — LACUNA TOTAL registrada: zero claims no corpus sobre tempo em lockout [tecnica §3.6] |
| Supino Pausado (Competição) | 0 | 4 | 3 | {SUP-P} | 6 | 3 MIN | DIA DE PRÁTICA — trabalho de HABILIDADE. ⚠️ A 62–67% por 3 reps o RPE real é ~3–4: estas 4 séries NÃO CONTAM como volume de hipertrofia em tabela nenhuma [design §13-B/R6]. COMANDOS, OS TRÊS, DADOS POR TERCEIRO, DESDE A S1: "Start" → "Press" → "Rack" [IPF-TR2026 §3.3 — "any claim that IPF bench became a two-command lift is false"]. É a lacuna que ele reconhece e não fecha: "as condições de competição podem ser mais difíceis mesmo que a pausa não seja necessariamente mais longa, simplesmente porque o atleta não controla o comando, o que desconcerta muita gente" [R83 @01:37] [GERAL]; "pausa completa com barra imóvel e comando dado por terceiro que você não consegue antecipar" [R174 @05:01] [GERAL]. ⚠️ Prescrever comando de terceiro é [interpretação] — ele só prescreve long pause e spoto, que são AUTOCONTROLADOS [tecnica §3.4, LACUNA]. PAUSA: {PAUSA-P}. O BLOCO DE 2,0 s VIVE SÓ AQUI, nas S10–S11, nestas 4 séries, a 65% do TM — é o pico do eixo de duração, e fica 5 semanas separado do pico de carga (S16, D2, 1,0 s). Ferramenta sustentada: long pause bench = A tier, "trabalha o controle da pausa, permite testar toque suave, sincronizar o leg drive com a subida e construir velocidade saindo do peito" [R103 @01:03] [GERAL]; "pausa de 2 segundos — que normalmente equivale a uma contagem de 4 na cabeça" [R119 @02:08] [GERAL]. ⚠️ A COLOCAÇÃO em S10–S11 é [interpretação] da spec: R103 e R119 sustentam a FERRAMENTA, não o QUANDO. ANTI-THRUST [R119 @01:36] [GERAL]. CUES DA PAUSA [R93 @04:18] [GERAL]. Diagnóstico visto de lado [R160 @03:53] [GERAL]. Descida em velocidade consistente — "muita gente acelera e joga a barra no peito no fim, o que derrota o propósito do controle" [R119 @00:00] [GERAL]. GATE DE DOR, três momentos (§1.2): se disparar entre S8 e S11, O BLOCO DE 2 s É A PRIMEIRA COISA QUE SAI. Filme DE LADO além dos pés |
| Leg Press 45° | 1 | 3 | 10-12 | N/A | 9 | 2 MIN | Quadríceps SEM CUSTO AXIAL, num dia que já tem 9 séries de padrão de agacho. "Mais estímulo para o quadríceps com menos fadiga geral; a escolha da máquina depende mais da máquina específica — escolha a que parece boa, que você gosta e na qual vai empurrar forte" [R124 @04:13] [GERAL]. Acessório vai a 0–1 RIR [design §10, Robinson 2024] — o oposto do SBD do dia, que é habilidade |
| Mesa Flexora | 0 | 4 | 10-12 | N/A | 9 | 1-1.5 MIN | Isquiotibiais em FLEXÃO DE JOELHO — função que o agacho não treina: "no agacho o corpo tenta estender joelho e quadril ao mesmo tempo; os isquiotibiais puxam o joelho em flexão, então o corpo evita recrutá-los — daí a baixíssima ativação", e "estudos de hipertrofia com agachamento mostram crescimento negligível ou nulo dos isquiotibiais" [R30 @02:34] [GERAL]. Vale para o agacho por via MECÂNICA, não contrátil: "ter posteriores maiores ajuda no agacho porque a coxa encosta na panturrilha mais cedo, gerando pop na saída do fundo" [R30 @05:05] [GERAL]. E é o acessório certo para o dia de maior fadiga: "pode não dar para fazer mais séries de terra por fadiga, mas dá para fazer mesa flexora extra" [R142 @02:03] [GERAL]. 0–1 RIR. Sem GHD na academia [design §0-B]. A 4ª série existe para fechar as 4 séries diretas de isquiotibiais que §1.5 da spec declara |

**DESCANSO SUGERIDO: 1 DIA**

### TEMPLATE D4 (Agacho Low Bar PRIMÁRIO · Supino volume · Ombro e Braço)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 6 | 1 | {AG-F-REPS} | {TOP-AG} | {RPE-AG} | 5 MIN | ⚠️ SÃO 6 AQUECIMENTOS, NÃO 4: partindo da barra vazia, 4 séries não fecham a regra da base — saltos de 5–10%, os DOIS ÚLTIMOS a 4–7,5% [R52 @02:02] [R110] — e esta é a série mais pesada da semana num agacho cuja falha operacional é perder profundidade. Custa ~3 min; segurança acima do orçamento. CINTO E WALKOUT DE NO MÁXIMO 3 PASSOS, repetidos aqui de propósito porque esta é a série mais pesada do bloco: "mais de três passos no walkout desperdiça energia e cada passo é uma oportunidade a mais de algo dar errado" [R14 @04:36] [GERAL]; imóvel e pronto em 5 s [IPF-TR2026 §3.2]. PEGADA 2026: "hands, thumbs, and fingers must be in complete contact with the bar" [IPF-TR2026 §3.2] — polegar por cima é luz vermelha, inclusive nos 6 aquecimentos. TOP SET PRIMÁRIO — o single é INSTRUMENTO DE MEDIÇÃO, não estímulo: Perkins não faz single nenhum de agacho em treino [design §11]. NAS S1 E S2 ESTA LINHA RODA COMO TRIPLO (não existe single na S1, e um single na S2 duplicaria a âncora da S3). CORREÇÃO MESTRA, metade 1 de 2 — ÂNGULO DE TRONCO: você agacha ~15° MAIS INCLINADO do que suas alavancas exigem (40° estando 5–8 cm ACIMA do paralelo; o esperado no fundo legal é 30–38°) e a inclinação extra NÃO vira carga útil [VÍDEO-SQ §4, §5]. O princípio que transfere é ESPELHAR o ângulo de tronco entre excêntrica e concêntrica: "fazer hinge suficiente na descida para que o ângulo da excêntrica espelhe o da concêntrica" [R64 @02:02] [GERAL], já chegar na posição inclinada durante a descida para não haver mudança rápida ao sair do fundo [R132 @00:30] [GERAL] [R87 @03:12] [GERAL]. ⚠️ A DIREÇÃO da doutrina do canal ("STOP TRYING TO SQUAT UPRIGHT", R159) NÃO se aplica a você — [R159 @04:21] [GERAL] diz que fêmur curto exige MENOS movimento e portanto MENOS inclinação, e é o seu caso [interpretação de design §2]. RPE 10 aqui = perder a profundidade legal OU o tronco passar de ~38°. Filme perpendicular, altura do quadril, 3–4 m, do lado em que o disco não fique entre a câmera e as costas [design §8] |
| Agachamento Low Bar (Profundidade Legal) | 0 | {AGBO} | 3 | {BO-AG} | {RPE-AG-BO} | 5 MIN | BACK OFF = clamp(TOP − 6pp, 82, 88). É AQUI que mora a dose de força: estas séries percorrem RPE 7,5 (S4) → 9,5 (S16), que é exatamente a faixa de Pak — 5 séries por semana por levantamento sem prescrever um quilo acima de 92% do TM. CORREÇÃO MESTRA, metade 2 de 2 — CUE DOS JOELHOS: na saída do buraco empurre os joelhos PARA FRENTE E PARA FORA, sem deixá-los recuar — "se a inclinação for erro de forma (colapso), pense a partir dos joelhos: normalmente os joelhos disparam para trás na saída do buraco, o que joga o quadril para trás e te inclina para frente; empurrar ativamente os joelhos para frente e para fora, sem deixá-los recuar, resolve grande parte do problema" [R169 @14:14] [GERAL]. O efeito upstream mantém o quadril para frente e sob o corpo e o peito para cima, e pensar dos joelhos para cima funciona melhor do que cuear quadril e peito diretamente [R168 @02:11] [GERAL] ⚠️ [interpretação] na transferência: R168 dá o cue na posição de PAUSA do above-parallel pause squat; quem o estende à saída do buraco do low bar livre é R169. EXPOSIÇÃO GRADUADA: acumule reps exatamente no limiar de peso em que você ainda bate a profundidade antes de começar a cortar alto, e faça toda repetição funda, desde a barra vazia e os aquecimentos [R115 @03:05] [GERAL]. PARADA: encerre a série quando UMA REP SAIR DO PADRÃO LEGAL, ou quando o RPE do mesmo peso e reps subir 1 a 2 pontos [R10 @00:34] [GERAL], ou ao passar de RPE 9,5 — o que vier primeiro. AGBO cai de 4 para 3 nas semanas leves S5, S7 e S11: só o agacho, só para baixo |
| Supino Pausado (Competição) | 3 | {SUP-V4} | 7 | {SUP-V4-PCT} | {RPE-SUP} | 3 MIN | PAUSA DE 1,0 s EM TODA REP, INCLUSIVE AQUECIMENTOS, DESDE A S1 [SPEC §2.2 — substitui a rampa de 0,5 s de design §4-B; meio segundo não existe no corpus e não é rep legal]. Calibragem mental: contar até 2 mentalmente equivale a cerca de 1 segundo real [R124 @01:02] [GERAL] ⚠️ [interpretação]: a claim é sobre pause squat. O QUE RAMPLA NESTE DIA É A CONTAGEM DE SÉRIES PAUSADAS (1 → 2 na S5 → 3 na S9), não a duração e não a carga — o progresso do supino no Bloco 1 aparece em SÉRIES, não em quilos. CUES DA PAUSA: arco firme sem colapsar ao tocar o peito, empurrar constantemente com as pernas, rolar a barra para baixo com movimento liderado pelo cotovelo, mover cotovelo, antebraço, mão e barra como um bloco sólido [R93 @04:18] [GERAL]. ANTI-THRUST, regra nova IPF 2026: "escolha um ponto de referência no fundo e garanta que as costelas não desçam além do afundamento da barra no peito" [R119 @01:36] [GERAL]. Se depois do toque os cotovelos começarem a se mover em relação à barra, você perdeu tightness [R160 @03:53] [GERAL]. LOCKOUT: da retirada ao início da descida em até 3 s — hoje você segura ~11 s ⚠️ achado do relatório de vídeo, ZERO claims no corpus sobre custo isométrico no topo; o único análogo é "mais de três passos no walkout desperdiça energia" [R14 @04:36] [GERAL]. GATE DE DOR, três momentos (§1.2) |
| Floor Press (Barra) | 0 | {FP4-SETS} | 8-10 | N/A | {FP4-RPE} | 2 MIN | TETO DE RPE POR COLUNA ({FP4-RPE}): 6 → 7 → 8 nas S1–S3 e estaciona em 8 — o mesmo tratamento de {PEC-RPE}, e não mais RPE 8 fixo desde a S1. PEGADA ESCOLHIDA NA S1 E NÃO MEXIDA [R31 @02:32] [GERAL]. {FP4-SETS} está no eixo `exposicao_peito` e o gate de dor de §1.2 CONGELA esta linha. PARE ~2 cm ACIMA da profundidade em que a lesão aconteceu. Existe para pagar R3 (supino ≥22 séries por semana) SEM gastar exposição em comprimento máximo [SPEC §2.3]; é o par de {SUP-V4}, FP4-SETS = 5 − SUP-V4. Base honesta, e ela é mais fraca do que parece: [R103 @00:33] [GERAL] pegada larga tem menos amplitude, portanto menos fatigante para alguns e melhor para alguns ombros por não ir tão fundo em flexão — MAS PARA OUTROS TRABALHA MAIS O OMBRO; [R170 @08:30] [PESSOAL] o spoto press dele tem menos amplitude absoluta nos ombros e é bom jeito de acumular volume dando descanso; [R20 @03:36] [PESSOAL] ele usa machine chest press como trabalho diário de peito. ⚠️ As duas primeiras são sobre OMBRO, não peitoral, e a segunda é [PESSOAL]. ⚠️ LACUNA: o corpus tem ZERO sobre board, pin ou floor press como ferramenta de reabilitação de PEITORAL [tecnica §5.1] — esta prescrição vem do relatório de vídeo, não do canal. ⚠️ Esta adição VIOLA [R166 @08:14] [GERAL] ("não mude frequência mais volume mais seleção de exercícios no mesmo ciclo"); registrado com o contra-argumento: exercício novo entrando com carga leve não é mudança na execução do lift de competição, mesma lógica do high bar [design §5]. RPE 8, perto mas não na falha, por analogia com a regra dele para o incline dumbbell bench [R112 @02:41] [GERAL] [interpretação de transferência]. ⚠️ SUBSTITUIÇÃO DECLARADA: a spec pedia supino em MÁQUINA ou SMITH aqui; smith NÃO está no inventário confirmado (design §0-B), então esta linha é floor press também em D4 |
| Tríceps Testa | 0 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN | Extensão de tríceps é fácil de fazer estrito (basta cuidar do cotovelo), então vale repetições mais baixas e mais peso [R122 @02:04] [GERAL]. O exercício exato de tríceps importa pouco, as diferenças são mínimas — faça aquele em que você aguenta mais volume, porque ombro ou cotovelo de algumas pessoas sofre mais com uns do que com outros [R119 @05:23] [GERAL]. Isolamento se justifica porque o tríceps não parece ser ativado ao máximo no supino até percentuais próximos do máximo ou perto da falha [R119 @04:14] [GERAL]. Trabalho de membro superior é mais fácil de empurrar até a falha: menos fadiga sistêmica, menos massa e nenhuma carga axial [R112 @02:41] [GERAL]. ⚠️ NÃO destrua o tríceps no treino anterior a um máximo de supino [R54 @02:33] [GERAL] — aqui está seguro (o dia seguinte é terra), mas é a regra que barra mover este bloco para D1. ⚠️ CONTRADIÇÃO DECLARADA na base sobre volume de braço: [R10 @02:08] [GERAL] diz 1 a 3 séries por músculo no isolamento; [R145 @05:13] [GERAL] diz 8 a 15. Ele nunca resolve. As 9 séries de tríceps por semana deste programa ficam no meio, e a escolha é da spec, não dele |
| Elevação Lateral (DB) | 0 | 3 | 10-15 | N/A | 9 | 1-1.5 MIN | Deltoide lateral tem crédito ZERO do SBD, logo este volume é aditivo e não compete com nada [design §10-B]. Reps altas em movimento fácil de roubar: "remada e elevação lateral (fáceis de usar impulso) → repetições mais altas, porque as reps iniciais são fáceis e dá para ser mais estrito" [R122 @02:04] [GERAL], e "reps altas continuam úteis onde é fácil roubar, como elevação lateral" [R76 @02:37] [GERAL]. ⚠️ NÃO existe landmark por cabeça de deltoide em fonte nenhuma, e "posição alongada é superior para deltoide" é EXTRAPOLAÇÃO com conflito frontal na base — não use isso como critério de seleção [design §10-B]. Total de 9 séries por semana de lateral (2 em D1, 3 aqui, 4 em D5): é o topo da faixa que R5 libera, e é MENOS do que o desenho anterior dava, por decisão de orçamento e não por evidência |
| Rosca na Polia | 0 | 3 | 8-12 | N/A | 9 | 1-1.5 MIN | Migrada de D3 [SPEC §1.3]. Bíceps tem crédito ZERO do SBD: todo volume é aditivo [design §10-B]. Entra por ESTÉTICA, que é razão suficiente e honesta. ⚠️ CORREÇÃO EXPLÍCITA: "bíceps forte protege o cotovelo no low bar" NÃO EXISTE na base — zero claims em 3.154; as soluções documentadas para cotovelo no agachamento são POSICIONAIS, e narrativa de "músculo fraco" é tratada como nocebo a evitar [R1 @06:11] [GERAL]. ⚠️ CONTRADIÇÃO DECLARADA: [R10 @02:08] prescreve 1 a 3 séries por músculo; [R145 @05:13] prescreve 8 a 15; e o que ele FAZ é outra coisa ainda — [R170 @03:34] [PESSOAL] 3 séries de rosca cerca de 5 dias por semana, [R154 @01:06] [PESSOAL] 4 séries de rosca todo dia, [R171 @07:23] [PESSOAL] rosca 5×/semana e meia polegada de braço a mais. Ele recomenda 1–3 e faz ~15. As 11 séries por semana deste programa são escolha da spec dentro dessa lacuna |

**DESCANSO SUGERIDO: 0 DIAS**

### TEMPLATE D5 (Terra sumo FORÇA · Braço, ombro e peito alongado)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Terra Sumo (Sem Strap) | 6 | 1 | {TER-F-REPS} | {TOP-TER} | {RPE-TER} | 4 MIN | ⚠️ SÃO 6 AQUECIMENTOS, NÃO 4: da barra vazia até 86–92%, 4 séries não fecham os saltos de 5–10% com os dois últimos a 4–7,5% [R52 @02:02] [R110]. Custa ~3 min; segurança acima do orçamento. FILME PERPENDICULAR, ALTURA DO QUADRIL — §3 exige vídeo de todo top set de terra. TOP SET. NAS S1 E S2 RODA COMO TRIPLO — "as singles do programa ciclam por RPE 6, 7 e 8; ele espera um pouco para introduzir as singles, para construir momentum antes" [R99 @01:31] [GERAL], por isso o single estreia na S3 [interpretação de colocação]. ⚠️ CLÁUSULA DE SAÍDA DE PERKINS, que faltava: Perkins NÃO faz single nenhum de agacho em treino [design §11], e o princípio que governa este bloco é "se a medição doer mais do que informa, o instrumento sai" [design §2]. Aplicado aqui: se o single semanal de terra passar a custar mais do que mede — dor, mãos destruídas, queda de qualidade nas 3×3 seguintes por duas semanas seguidas —, ELE SAI e a leitura volta a ser a back-off, como já é nas S1–S2. POR QUE EXISTE UM SINGLE AQUI: "todo powerlifter deveria manter singles o ano inteiro, pelo menos uma vez por semana em cada levantamento" e "muitos lifters batem rep maxes enormes no treino e falham em traduzir isso num single na plataforma; a causa principal é falta de prática executando um single limpo no padrão de competição" [R170 @02:32] [GERAL] — que é literalmente o diagnóstico deste atleta. [R170 @02:00] [PESSOAL] ele mesmo roda esse single a ~90%, um pouco abaixo de RPE 8 — a mesma janela para onde esta rampa converge. ⚠️ A rampa 86→92% é da spec; o precedente de dose é dele. SEM STRAP DESDE A PRIMEIRA REP DE AQUECIMENTO DA S1: "uso mínimo de straps, para colher o máximo de estímulo de pegada" [R42 @00:02] [GERAL], "straps arruínam a força de pegada se usados demais" [R108 @03:51] [GERAL]; e o motivo aqui não é pegada, é MEDIÇÃO: "com straps a barra fica praticamente pendurada fora da mão, cortando ainda mais amplitude" [R174 @02:48] [GERAL] — somado a barra whippy e anilha grossa, "é quase como fazer um block pull de algumas polegadas". A anilha de plástico grossa da academia é exatamente o item que ele nomeia [design §0-B]. RESET A CADA REP, SEM TOUCH-AND-GO [R77 @01:34] [GERAL] [R123 @00:30] [GERAL] — entra junto com o sem strap na S1 porque são o mesmo padrão, não duas variáveis. CUSTO PREVISÍVEL, dito de frente: "fazer reps no terra é o que mais destrói as mãos, por causa do reset a cada rep" [R108 @03:51] [GERAL]; mitigação com o que a academia tem — magnésio [R42 @00:32] [PESSOAL] e abrir um pouco a pegada [R42 @01:03] [PESSOAL], ambas [PESSOAL]. ESCOLHA UMA PEGADA NA S1 E NÃO MEXA MAIS (é SETUP, custo zero [R31 @02:32] [GERAL]): "acha que hook grip é mais propenso a falhar em pesos mais pesados" [R102 @03:10] [GERAL], pegada mista "não causa desequilíbrios" [R108 @02:13] [GERAL]. LOCKOUT: aqui treina-se O HOLD — "no terra é preciso travar completamente os ombros e segurar no topo antes de descer, enquanto na academia muitos são soltos no topo" [R174 @05:01] [GERAL]; descer com as duas mãos. Nada de hitch [R112 @05:16] [GERAL]. ❌ O CRITÉRIO GEOMÉTRICO DA IPF 2026 NÃO É CUEADO AQUI: ele é ensinado no D2, na prática a RPE 6 [design §13-B/R10] — mudança de forma vai no SETUP, nunca sob carga [R31 @02:32] [GERAL], e material novo não estreia num single a RPE 8. ANTI-CUE EXPLÍCITO: não mandar o quadril para baixo — "erro muito comum: mandar o quadril para baixo artificialmente no sumo", porque "a altura do quadril é produto de quanta rotação externa e abdução você tem para uma dada quantidade de flexão de quadril — não é uma variável a ser forçada" [R163 @00:01] [GERAL], e "baixar o quadril faz você flexionar menos o quadril e mais o joelho — ruim para o sumo" [R163 @01:31] [GERAL]. Vídeo perpendicular, altura do quadril |
| Terra Sumo (Sem Strap) | 0 | 3 | 3 | {BO-TER} | {RPE-TER-BO} | 4 MIN | ⚠️ ESTA LINHA GANHOU COLUNA DE RPE PRÓPRIA ({RPE-TER-BO}) NESTA REVISÃO. Antes ela reusava {RPE-TER} = 8, que é o teto do SINGLE: de S12 em diante o teto ficava 0,5 a 1,5 ponto ABAIXO do que a carga da mesma célula implica pela tabela normativa de §0.3 (BO-TER 84% × 3 reps ≈ RPE 8,5; 86% × 3 ≈ RPE 9,5), e as duas prescrições não podiam ambas ser obedecidas — o app mostrava "3×3 @ 207,5 kg · RPE 8". O valor escolhido é 9,5, alinhado a {RPE-AG-BO} e {RPE-SUP-BO} e ao rótulo da própria GRADE C ("back-off = RPE ~9,5"); o teto de R2 foi descartado porque manteria a contradição. BACK OFF 3×3, FIXO, não oscila: oscilar o terra o levaria a 3 séries acima de 80%, o piso exato de Pak com margem zero. Mesmo padrão do top set, rep a rep. REGRA DE PARADA, não alvo: encerrar a série se a rep sair do padrão legal — RPE 10 no terra = o deltoide não fecha atrás da linha da barra, ou solta a barra. NA S2 A 1ª SÉRIE DESTA LINHA É A LEITURA DE CALIBRAÇÃO (triplo a teto RPE 7 → âncora 80%). ⚠️ DESCANSO DE 4 MIN É DESVIO CONSCIENTE: [R74 @01:32] [PESSOAL] ele cronometra 5 min em agacho e terra; cortei para 4 com base em "muitos lifters descansam tempo demais entre séries; encurtar o descanso pode gerar mais ganhos" [R74 @00:02] [GERAL] e no custo de oportunidade da sessão. ⚠️ [R74 @00:32] [GERAL] reconhece que "descanso de 10 minutos pode ajudar um pouco o agacho versus 5" — ou seja, ISTO CUSTA ALGUMA COISA; é o preço de manter as 13 séries de braço e ombro que R14 protege nominalmente |
| Supino Inclinado com Halter | 2 | {PEC-SETS} | 8-10 | N/A | {PEC-RPE} | 2 MIN | TETO DE RPE 8, NUNCA À FALHA: "incline dumbbell bench: programar em torno de RPE 8, perto mas não na falha, por ser razoavelmente específico e poder gerar fadiga que atrapalha o supino principal" [R112 @02:41] [GERAL]. PEC-RPE sobe 6 → 7 → 8 e PARA em 8. Escolha do exercício: supino inclinado é B tier — "trabalha mais os deltoides anteriores, que ele considera superestimados como músculo a treinar, mas variar movimentos previne overuse; considera uma variação subestimada" [R103 @02:04] [GERAL]. Apoio lateral: "exemplo de cliente: low-incline bench era completamente indolor mesmo com os ombros doendo muito no supino de competição" [R89 @02:44] [GERAL]. ⚠️ POR QUE ESTE TRABALHO EXISTE, E POR QUE NÃO É "PROTETIVO": não existe na base nenhuma claim de que treinar peitoral em posição alongada seja protetor — ZERO afirmações de proteção tecidual [bracos §7.1]. O princípio de comprimento longo aparece só como alavanca de HIPERTROFIA: "o melhor custo-benefício em hipertrofia é treinar perto da ou até a falha, com exercícios estáveis que isolem o músculo alvo, idealmente em comprimentos musculares longos" [R142 @02:34] [GERAL] — afirmado UMA ÚNICA VEZ. Chamar isto de "trabalho protetivo" (como faz design §10) é rótulo do desenho, não da base. ⚠️ E há contraponto vigente: [R96] [GERAL] a posição dele é que peitoral não precisa de isolamento se o volume de supino for suficiente — com supino 4×/semana, este dia é um DESVIO DECLARADO, justificado pelo úmero de 31 cm e pela lesão, não por citação. A VARIÁVEL É DOSE, NÃO POSIÇÃO: ⚠️ CITAÇÃO CORRIGIDA — [R79 @02:34] [GERAL] NÃO diz que "o mecanismo é sempre dose"; diz que a técnica age sobre o risco principalmente por AFETAR A GESTÃO DE CARGA, e nomeia explicitamente "forma não importa" como um dos dois extremos que REJEITA. Redação corrigida: a técnica age sobre o risco principalmente por afetar a gestão de carga [R79 @02:34] [GERAL], e a base NÃO endossa evitar a posição alongada — [R66] [GERAL] o grupo de amplitude completa ficou mais forte que o de amplitude parcial ATÉ NAS AMPLITUDES PARCIAIS. Por isso a rampa é 2 → 4 → 6 séries com o teto de RPE subindo junto, e não corte de amplitude. ⚠️ TETO DE EQUIPAMENTO REAL: halteres vão só até 40 kg, e 8–10 a RPE 8 para quem supina 160 esgota o incremento por volta da S10–S12; daí em diante a progressão vira reps e depois tempo e excêntrica [interpretação, apoiada em R177 @02:39 e R89 @03:14]. GATE DE DOR OBRIGATÓRIO, três momentos (§1.2) |
| Crucifixo no Peck Deck | 1 | {PEC-SETS} | 12-15 | N/A | {PEC-RPE} | 1-1.5 MIN | ⚠️ LACUNA, NÃO CITAÇÃO: grep independente em extract/ dá ZERO ocorrências de crucifixo, peck deck, voador ou flye em todo o corpus. Esta linha não tem procedência do canal: existe por [Nippard PB2.0] (Pec Flye como acessório de peitoral) e pelo princípio de dose acima, e é [interpretação] integral. REGRA DE EXECUÇÃO derivada de [R20 @03:36] [PESSOAL] — a dose que ele documenta como recuperável dia a dia é 1 série até a falha em máquina "bem estável", NÃO peso livre em alongamento — portanto PECK DECK PREFERIDO AO HALTER, e o halter no banco inclinado só se o peck deck estiver ocupado (as duas coisas existem, design §0-B). ⚠️ [R4 @02:33] [PESSOAL] registra que esse esquema quebrou no fim do ciclo, "com cargas mais altas" — o que casa com o padrão de sintoma deste atleta. ⚠️ [interpretação]: o CONTRASTE "carga absoluta subiu, não o volume" é raciocínio meu, acarretado pelo contexto da claim, e não é afirmação de R4. Teto de RPE 8, nunca à falha enquanto PEC-RPE < 8. GATE DE DOR obrigatório (§1.2) |
| Elevação Lateral (DB) | 1 | 4 | 10-15 | N/A | 9 | 1-1.5 MIN | Reps 10–15: "reps altas continuam úteis em movimentos onde é fácil roubar, como elevação lateral" [R76 @02:37] [GERAL]; [R122 @02:04] [GERAL] na mesma direção. 0–1 RIR. ⚠️ NÃO HÁ AFIRMAÇÃO DE SUPERIORIDADE DE POSIÇÃO ALONGADA PARA DELTOIDE e não vou fazer uma: a base contém as duas posições opostas de fontes igualmente credíveis — Helms escolhe cabo PORQUE alonga; Stanek prescreve "cable lateral raises (shortened)" — e NÃO EXISTE NENHUM ESTUDO de comprimento muscular para deltoide lateral ou posterior [bracos §4.6]. Halter aqui é escolha de orçamento e de inventário, não de mecanismo |
| Rosca Inclinada (DB) | 1 | 3 | 8-10 | N/A | 9 | 1-1.5 MIN | Braço atrás do corpo alonga mais e engrossa a porção PROXIMAL; a scott engrossa a distal — fazer as duas ou alternar [bracos §4.5]. 0–1 RIR. ⚠️ CONTRADIÇÃO DA PRÓPRIA BASE, DECLARADA (é a regra do briefing, e esta era a única das 5 notas de volume de braço que citava Vena sem declará-la): [R10 @02:08] [GERAL] "no isolamento é preciso experimentar quantas séries você tolera; costuma achar 1 a 3 séries por músculo" CONTRA [R145 @05:13] [GERAL] "8 a 15 séries por músculo ou movimento cobre a maioria das pessoas". As duas são dele, com anos de diferença, e ele NUNCA as reconcilia. ⚠️ As 6 séries de bíceps deste dia (11 por semana) NÃO SAEM DE VENA: saem de [Nippard PB2.0] (10–16) e de Pelland 2025, ficam dentro de R145 e muito acima de R10. O que é dele e é [PESSOAL]: [R170 @03:34] 3 séries ~5 dias por semana, [R171 @07:23] rosca 5×/semana com meia polegada de braço a mais, [R154 @01:06] 4 séries todo dia — e a base marca que ele NUNCA prescreve isso, é claramente estética pessoal. Não existe claim nenhuma de que bíceps proteja o cotovelo. ⚠️ POR QUE BRAÇO E OMBRO DEPOIS DO TERRA NÃO É IMPRUDÊNCIA: "o resto do corpo superior não envolvido no terra (supino, braços — exceto bíceps se você puxa com braços flexionados, ombros etc.) pode ser forçado normalmente, pois há pouca fadiga cruzada" [R90 @03:13] [GERAL]; no sumo com pegada mista o cotovelo fica estendido, então a ressalva não morde — se ele flexionar o braço no puxo, isso é defeito de execução a corrigir no vídeo |
| Rosca Martelo | 0 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN | PROGRESSÃO DUPLA: "escolha uma faixa de reps, comece com peso em que falha nas 6; quando conseguir 8 reps consistentemente, resete com mais peso voltando para 6" [R122 @02:04] [GERAL]. Auditoria da dose: levar OCASIONALMENTE uma série de isolamento à falha real para confirmar que a proximidade está calibrada [R47 @03:05] [GERAL] — nunca no supino inclinado nem nas linhas de peito enquanto PEC-RPE < 8 |
| Tríceps Overhead na Polia | 1 | 3 | 10-12 | N/A | 9 | 1-1.5 MIN | "Programa algum trabalho de tríceps overhead em programas de clientes, mas alerta para não reagir demais a um achado único ainda não replicado" [R100 @02:45] [GERAL]; [R100 @03:18] [PESSOAL] "vai misturar extensões de tríceps overhead na programação normal dele". ⚠️ NÃO afirmar que overhead "trabalha a cabeça longa" citando Vena — o que [R119 @04:49] [GERAL] diz é o inverso: "movendo o ombro durante os exercícios de tríceps dá para EVITAR ativar a cabeça longa", e evitá-la vale "talvez um pequeno benefício teórico" [R119 @05:23]. O argumento pró-overhead é EXTERNO (Maeo et al.), com contraponto (Stasinaki 2018). ⚠️ DESVIO REGISTRADO: [R122 @02:04] [GERAL] argumenta que extensão de tríceps deveria ir a reps mais baixas e mais peso; a spec fixa 10–12 e não foi mudada |

**DESCANSO SUGERIDO: 0 DIAS**

---

## 7. SEMANA 17 — TAPER (10 dias, 4 sessões)

Tudo é indexado ao dia do simulado (**D0**). A S17 é a janela **D−10 … D−4**; a S18 é
**D−3 … D0**. O taper começa na primeira sessão (D−10) e termina no simulado, que é o dia
11 da contagem. Calendário sugerido: D−10 na segunda, simulado na quinta da semana
seguinte — **o que importa são as distâncias em dias, não os nomes dos dias.**

**Ordem das últimas pesadas — é literal, não é do desenho:** *"última sessão pesada antes
de maxar: supino cerca de MEIA SEMANA antes, agacho cerca de UMA SEMANA antes, terra cerca
de UMA A DUAS SEMANAS antes"* `[R116 @04:42]` `[GERAL]`, porque *"supino recupera mais
rápido, agacho no meio, terra tanto quanto o agacho ou mais"* `[R116 @04:42]` `[GERAL]`.
Entregue: **terra 10 d · agacho 7 d · supino 5 d.** ⚠️ **A versão anterior tinha a ordem
INVERTIDA** (agacho 8 d, terra 7 d) e citava R116 para isso — a auditoria de citações pegou
o erro. ⚠️ Isto também diverge de `design.md` §11-B e de `SPEC §3.8`, que pediam terra a 8
dias; o terra vai a **10**, que é o que R116 sustenta, e os dois passam na faixa 7–10.

**ACESSÓRIOS VÃO A ZERO A PARTIR DE D−10.** Somem costas (12), bíceps (11), delt lateral
(9), posterior (3), tríceps (9), peito alongado (6), eretores (4), quadríceps (3),
isquiotibiais (4) e floor press (5). Base: **Pritchard 2016**, acessórios removidos ~2
semanas antes; entregue **11 dias** (última exposição no último dia da S16), **não 14** —
fechar os 14 exigiria zerar acessório nas duas últimas sessões da S16. ⚠️ **CONTRADIÇÃO
FRONTAL COM O CANAL, e ela é do lado oposto:** *"decidiu começar o taper 2 semanas antes do
meet, mantendo algum trabalho para manutenção, e fazer o taper completo dos acessórios
apenas na semana final"* `[R54 @02:33]` `[PESSOAL]` — Vena tira acessório **mais tarde** que
Pritchard. Escolhido Pritchard por ser n=11 de atletas raw de elite contra n=1.

**Não trocar acessório por sedentarismo:** *"erro comum no taper é ficar sedentário demais;
manter esse movimento leve o deixou muito mais solto"* `[R54 @02:03]` `[GERAL]`. Caminhada
em D−8, D−6, D−4, D−2 e D−1. **O aviso que mais derruba estreante, e é [GERAL]:** *"a causa
que ele vê com muito mais frequência é 'tirar o pé do acelerador'"* `[R22 @00:34]`; *"o
quanto se levanta é habilidade menos fadiga; ao tirar o pé do acelerador faz-se exatamente
o oposto do desejado"* `[R22 @01:37]`; *"deve-se tentar tão duro nessas sessões quanto nas
mais pesadas"* `[R22 @02:07]`. **E o afrouxamento não fica na academia:** *"as pessoas
relaxam na dieta e param de ser rigorosas com o sono"* `[R22 @01:06]`. Manter 2600 kcal,
220 g de proteína e horário de sono constante nestes 10 dias.

### SEMANA 17 - DIA 1 (D−10 · TERRA PICO + supino volume)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Terra Sumo (Sem Strap) | 4 | 3 | 1 | 88% | 8 | 4 MIN | ÚLTIMA PESADA DO TERRA — 10 dias fora. Esquema de pico de terra 3×1, o mais frequente em Travis 2021. A CARGA DESTA SÉRIE É EXATAMENTE A ABERTURA DO SIMULADO: a abertura não é descoberta no dia, é ensaiada três vezes aqui. "Muitos lifters batem rep maxes enormes no treino e falham em traduzir isso num single na plataforma; a causa é falta de prática executando um single limpo no padrão de competição" [R170 @02:32] [GERAL]. RPE real esperado ~6,5 — a regra de parada é o PADRÃO, não o esforço: RPE 10 = o deltoide não fecha atrás da linha da barra, ou solta a barra. Deltoide anterior ATRÁS da projeção da barra, imóvel até o "Down", descer com as duas mãos [IPF-TR2026 §3.4]. Sem strap, reset a cada rep. ⚠️ [R164 @06:36] [PESSOAL] registra o precedente OPOSTO — ele testou o abridor de terra 5 dias antes do meet e saiu fácil. É precedente pessoal, e não vence Travis 2021 mais R116; a versão anterior deste programa seguia esse precedente e por isso punha o último pesado de terra a 5 dias |
| Supino Pausado (Competição) | 3 | 3 | 6 | 72% | 8 | 3 MIN | Último bloco de VOLUME de supino do ciclo. Pausa 1,0 s em toda rep e todo aquecimento — a invariante PAUSA-1S NÃO relaxa no taper: a habilidade que o simulado vai cobrar é a pausa, não a carga. "Supino recupera mais rápido" [R116 @04:42] [GERAL] e por isso é o que menos afunila. RPE real esperado ~5. GATE DE DOR, três momentos (§1.2) — no taper o gate não congela degrau nenhum (não há degrau a congelar): ele GOVERNA A 3ª TENTATIVA DE SUPINO DO SIMULADO |

**DESCANSO SUGERIDO: 0 DIAS**

### SEMANA 17 - DIA 2 (D−9 · High bar secundário + supino prática com comandos)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento High Bar | 3 | 5 | 5 | 72% | 8 | 3 MIN | Cai de 8×5 (S16) para 5×5. Fica 2 DIAS ANTES do agacho primário — a colocação de Perkins que o bloco inteiro usa, preservada dentro do taper. Mesma abertura de pés e mesmo ângulo de tronco do low bar; NÃO stance estreito e superereto [R18 @01:34] [GERAL]. Regra de parada continua sendo A PROFUNDIDADE LEGAL, não o RPE [R115 @03:05] [GERAL] |
| Supino Pausado (Competição) | 2 | 2 | 6 | 67% | 6 | 3 MIN | PRÁTICA COM COMANDO. OS TRÊS COMANDOS, DADOS POR TERCEIRO: "Start" → "Press" → "Rack" [IPF-TR2026 §3.3 — "any claim that IPF bench became a two-command lift is false"]. É a última sessão do ciclo em que errar o comando é barato. "As condições de competição podem ser mais difíceis mesmo que a pausa não seja necessariamente mais longa, simplesmente porque o atleta não controla o comando" [R83 @01:37] [GERAL]. ⚠️ Prescrever comando de terceiro continua sendo [interpretação] — o canal só prescreve long pause e spoto, que são autocontrolados [tecnica §3.4]. Anti-thrust: "escolha um ponto de referência no fundo e garanta que as costelas não desçam além do afundamento da barra no peito" [R119 @01:36] [GERAL]. GATE DE DOR, TRÊS MOMENTOS (§1.2): é normativo e global, vale em toda sessão que contenha supino, e no taper ele GOVERNA A 3ª TENTATIVA DE SUPINO DO SIMULADO (§8) |

**DESCANSO SUGERIDO: 1 DIA**

### SEMANA 17 - DIA 3 (D−7 · AGACHO PICO)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 4 | 3 | 2 | 87.5% | 8 | 5 MIN | ÚLTIMA PESADA DO AGACHO — 7 dias fora, que é literalmente "agacho cerca de uma semana antes" [R116 @04:42] [GERAL]. Esquema de pico 3×2 [Travis 2021]. CINTO E WALKOUT DE NO MÁXIMO 3 PASSOS, repetidos aqui porque esta é a segunda série mais pesada do bloco e a última pesada de agacho: "mais de três passos no walkout desperdiça energia e cada passo é uma oportunidade a mais de algo dar errado" [R14 @04:36] [GERAL]; imóvel e pronto em 5 s [IPF-TR2026 §3.2]. Pegada em contato completo com a barra, regra 2026 [IPF-TR2026 §3.2]. NOTE QUE NÃO É MAIS LEVE QUE A S16: 3×2 a 87,5% é RPE ~7,9, a mesma dureza do single a 92% da S16 — o que cai é o VOLUME, não a intensidade. Correção mestra, as duas metades juntas: espelhar o ângulo de tronco entre excêntrica e concêntrica [R64 @02:02] [GERAL], e na saída empurrar os joelhos para frente e para fora sem deixá-los recuar [R169 @14:14] [GERAL] — NÃO cuear "peito para cima" nem "quadril para baixo". ⚠️ A doutrina "agache mais curvado" [R159] continua NÃO se aplicando a ele (fêmur curto → menos inclinação, [R159 @04:21] [GERAL]). RPE 10 = perder a profundidade legal OU o tronco passar de ~38°. Filme perpendicular, altura do quadril, 3–4 m |
| Supino Pausado (Competição) | 3 | 3 | 4 | 76% | 8 | 3 MIN | Ponte entre o volume de D−10 e o pico de D−5. Fica ABAIXO de 80% de propósito: a dose acima de 80% do supino no taper é UMA exposição, não duas. Pausa 1,0 s, comando por terceiro se houver parceiro. GATE DE DOR, TRÊS MOMENTOS (§1.2) — ele governa a 3ª tentativa de supino do simulado, e a regra da 3ª tentativa lê o log DESTAS duas semanas |
| Terra Sumo (Sem Strap) | 3 | 2 | 3 | 65% | 6 | 3 MIN | PRÁTICA. Sem strap, reset a cada rep [R77 @01:34] [GERAL] [R123 @00:30] [GERAL]. Não conta como pesada (65% < 85%) e é o que mantém o padrão vivo entre a pesada de D−10 e o simulado — "tomar descanso completo é a coisa mais estúpida que se pode fazer, pois se perde a prática técnica muito facilmente" [R110 @01:33] [GERAL] |

**DESCANSO SUGERIDO: 1 DIA**

### SEMANA 17 - DIA 4 (D−5 · SUPINO PICO)

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Supino Pausado (Competição) | 3 | 3 | 2 | 87.5% | 8 | 3 MIN | ÚLTIMA PESADA DO SUPINO — 5 dias fora (R116 diz "meia semana" ≈ 3,5 d; Travis 2021 diz menos de 7; 5 é o meio dos dois). ⚠️ DESVIO DECLARADO DO ESQUEMA DE PICO: Travis 2021 dá 3×3 para supino, e aqui são 3×2. Motivo ARITMÉTICO, verificável na tabela normativa de §0.3: a 3 reps, RPE 8 = 83% do TM, abaixo do piso de 85% de taper_intensidade_minima_pct; e 3 reps a 85% = RPE ~9,45, acima do teto de RPE 8 da S17. AS DUAS RESTRIÇÕES SÃO CONJUNTAMENTE INSATISFAZÍVEIS PARA UM TRIPLO DE SUPINO. A 2 reps (âncora interpolada RPE 8 ≈ 87,5%, [interpretação] — §0.3 não publica linha de 2 reps) as duas passam. Pausa 1,0 s, comando por terceiro se houver parceiro. "A velocidade do supino dele cai muito rápido — vai de uma repetição super suave direto para uma parede, o que torna a leitura das tentativas enganosa e obriga a priorizar acertar as tentativas" [R21 @02:04] [PESSOAL] — ESTA SÉRIE É A LEITURA QUE VAI ESCOLHER A 3ª TENTATIVA DE SUPINO. GATE DE DOR OBRIGATÓRIO, TRÊS MOMENTOS (§1.2), e aqui ele é decisivo: é esta leitura, junto com a da S18, que a regra da 3ª tentativa lê |
| Agachamento Low Bar (Profundidade Legal) | 2 | 2 | 3 | 75% | 6 | 3 MIN | Manutenção de padrão, não estímulo. 75% < 85% → NÃO move o último pesado de agacho |
| Terra Sumo (Sem Strap) | 2 | 2 | 2 | 72% | 6 | 4 MIN | Idem. Sem strap, reset a cada rep |

**DESCANSO SUGERIDO: 1 DIA**

---

## 8. SEMANA 18 — DIA FÁCIL E SIMULADO

### SEMANA 18 - DIA 1 (D−3 · DIA FÁCIL + ENSAIO DE COMANDOS)

Este dia é **literal do corpus**: *"em vez de descanso completo ele faz um dia bem fácil:
algo como 60% para 2×2 em agacho e terra, e 3×2 a cerca de 70% no supino"*
`[R110 @01:33]` **[PESSOAL]**. ⚠️ A versão anterior citava **R81** e **R83** para estes
números — **as duas citações são inventadas** (zero claims sobre 2×2, 60% ou dia fácil em
qualquer das duas) e foram removidas pela auditoria. **Só R110 sustenta esta linha.**

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 2 | 2 | 2 | 62% | 5 | 3 MIN | Com cinto, walkout de no máximo 3 passos [R14 @04:36] [GERAL], COMANDO DE TERCEIRO ("Squat" e "Rack"), imóvel e pronto em 5 s [IPF-TR2026 §3.2]. Ensaio de ritual, não de carga. Mover rápido e com confiança desde a primeira rep [R52 @01:32] [GERAL] |
| Supino Pausado (Competição) | 2 | 3 | 2 | 70% | 5 | 3 MIN | OS TRÊS COMANDOS, por terceiro. Pausa 1,0 s. Travar os braços ANTES do "Start" — cartão azul se não travar [IPF-TR2026 §3.3]. GATE DE DOR, TRÊS MOMENTOS (§1.2): é a ÚLTIMA leitura antes do simulado e entra na regra da 3ª tentativa de supino |
| Terra Sumo (Sem Strap) | 2 | 2 | 2 | 62% | 5 | 3 MIN | Ensaio do hold no topo e do "Down". Sem strap, reset a cada rep. ⚠️ NENHUMA CARGA DESTE DIA É A ABERTURA, e isso é propriedade de desenho: puxar o abridor real aqui (agacho 88,4%, terra 87,5% do TM) criaria exposição ≥85% a 3 dias e poria o último pesado dos dois em 3 dias, fora da faixa 7–10. É a armadilha da versão anterior, e ela está fechada por construção. ⚠️ Cessação do terra = 3 dias: Travis 2021 reporta média 5,8 ± 2,5, e 3 fica dentro da faixa 2–7 de Travis 2020 |

**DESCANSO SUGERIDO: 2 DIAS**

### SEMANA 18 - DIA 2 (D0 · SIMULADO — 3 tentativas por levantamento)

Ordem de competição: **agacho → supino → terra. Só os três de competição. Nada depois.**
Aquecimento **exatamente igual ao de um treino normal** `[R110 @05:37]` `[GERAL]`.

**POR QUE UM SIMULADO, E COM O QUÊ** — é precedente do canal e é **[PESSOAL]**: *"faz dia
de mock meet, dirigindo até uma academia com set de ANILHAS CALIBRADAS"* `[R7 @01:23]`
**[PESSOAL]**; *"sem competição marcada, considera fazer um mock meet com equipamento
específico de competição para ter um teste legítimo"* `[R185 @04:38]` **[PESSOAL]**. As
duas são precedente pessoal, não prescrição — e são a única procedência do canal para
este dia.

### 8.1 ARITMÉTICA DE PROVA — *gym math ≠ meet math* (`ipf_reality.md` §3.6)

Ele nunca competiu, e esta é a armadilha mais barata de evitar do dia inteiro:

- **BARRA + PRESILHAS = 25 kg**, sempre, e é assim que a tentativa é declarada. Na academia
  a conta costuma ser feita "barra = 20"; na plataforma as presilhas são obrigatórias e
  entram no número. Toda tentativa deste §8 já está nesta conta.
- **A tentativa é declarada em PESO CARREGÁVEL**, não em percentual: só existe o que a
  soma de anilhas calibradas mais barra e presilhas consegue montar. Com micro-anilhas de
  1,25 kg (par → 2,5 kg na barra), o grão do simulado é **2,5 kg**.
- **PROGRESSÃO MÍNIMA ENTRE TENTATIVAS = 2,5 kg.** Não existe "repetir com meio quilo a
  mais": se a 2ª subir e a 3ª tiver que ser conservadora, o menor passo legal é 2,5 kg.
- **Tentativa queimada:** a seguinte REPETE o mesmo peso (não existe 4ª). Isso também é
  aritmética: um total só conta com uma tentativa válida em cada levantamento.

**Terceiras derivadas do carryover treino → plataforma de Perkins** aplicado ao top set da
S16: agacho **+10 a +15 kg**, terra **+7,5 a +10 kg**, supino **±0 a 2,5 kg**. Abertura e
segunda pelas **médias reais da IPF: 90,9 / 96,3 / 99,6%** da terceira
`[Travis/Zourdos 2021]`.

⚠️ **DUAS AFIRMAÇÕES DA VERSÃO ANTERIOR ERAM FALSAS E FORAM RECOMPUTADAS:**

1. *"Toda abertura é um peso que ele já executou legalmente no taper"* é **verdade só no
   terra**. Recomputado: **terra abre a 210,0 kg**, que é exatamente os 3×1 de D−10 ✓;
   **agacho abre a 190,0 kg contra 187,5 kg de máximo do taper** — o abridor é **2,5 kg
   MAIS PESADO** que qualquer agacho executado nos 10 dias; **supino abre a 135,0 kg**,
   peso que **não aparece em nenhuma sessão** do bloco nem do taper. As aberturas foram
   **mantidas** (mexer nelas quebraria as médias da IPF, que são evidência fixa em
   `design.md` §11-B), e a afirmação foi **corrigida** para o que é verdade.
2. *"Cada terceira no meio da banda"* também é falso: a do terra sai a **+10,0 kg** sobre o
   top set da S16, que é o **TOPO** da banda de Perkins (7,5–10), não o meio.
3. E *"99,6% da terceira"*: 99,6% da terceira **é a própria terceira**. Os ratios de fato
   entregues, depois do arredondamento para 2,5 kg, são **90,5 / 96,4 / 100** (agacho) e
   **91,5 / 96,6 / 100** (supino) — o gerador computa, e é o computado que vale.

⚠️ **CONFLITO DECLARADO com o canal, no último salto:** *"os dois últimos saltos devem ser
de 4 a 7,5% do max estimado"* `[R110 @03:06]` `[GERAL]`. Os primeiros saltos ficam em
5,1–6,0% ✓, os últimos em **3,3–3,7%**, abaixo do piso de R110. Não corrigido: as médias da
IPF são evidência fixa em `design.md` §11-B, e R110 fala de **max-out em treino** (duas
subidas até um máximo verdadeiro), não de três tentativas de plataforma.

| Exercício | Aquec | Trab | Reps | %1RM | RPE | Desc | Notas |
|---|---|---|---|---|---|---|---|
| Agachamento Low Bar (Profundidade Legal) | 5 | 1 | 1 | 88.4% | 7 | 5 MIN | 1ª TENTATIVA — abridor, tem que sair fácil. ⚠️ CORREÇÃO: ele NÃO é mais leve que os 3×2 de D−7 — é 2,5 kg MAIS PESADO (190,0 contra 187,5), e é o único abridor dos três que não foi executado no taper. Trate-o como o que é: uma carga nova, no dia. Se a leitura de D−7 tiver sido dura (RPE 8+ por vídeo), ABRA um incremento abaixo — errar pelo conservador é a regra do dia [R110 @04:06] [GERAL]. Cinto, faixa de joelho, munhequeira. Comandos "Squat" e "Rack" por terceiro. Profundidade legal ou a tentativa não existe [R115] |
| Agachamento Low Bar (Profundidade Legal) | 0 | 1 | 1 | 94.2% | 8.5 | 5 MIN | 2ª TENTATIVA — salto grande primeiro, salto menor depois: "opener bem fácil, depois um salto muito grande, depois um salto menor" [R21 @03:34] [GERAL, escola de Marcellus]. Joelhos para frente e para fora na saída [R169 @14:14] [GERAL] |
| Agachamento Low Bar (Profundidade Legal) | 0 | 1 | 1 | 97.7% | 9.5 | 5 MIN | 3ª TENTATIVA — carryover esperado de treino para plataforma: +10 a +15 kg [Perkins]. A 3ª É DECIDIDA DEPOIS DA 2ª: se a 2ª sair a RPE ≤8 pela leitura de vídeo mantém; RPE 9+ cai um incremento; RPE ≤7 sobe um incremento, com teto de +5,0 kg sobre a tabela e nunca acima de RPE 9,5. "Errar sempre pelo conservador: é melhor garantir o peso e assegurar o PR do que ultrapassar a marca" [R110 @04:06] [GERAL] |
| Supino Pausado (Competição) | 4 | 1 | 1 | 84.4% | 5.5 | 5 MIN | 1ª TENTATIVA — ⚠️ 135,0 kg NÃO FOI EXECUTADO EM NENHUMA SESSÃO deste bloco nem do taper: fica entre a ponte de D−7 (76% = 122,5 kg) e o pico de D−5 (87,5% = 140 kg). É abridor por aritmética de tentativa, não por ensaio. HANDOFF pelo mesmo parceiro que dá os comandos, como em D2 desde a S1. Pausa imóvel com comando de terceiro, cotovelo abaixo do ombro [IPF-TR2026 §3.3]. FILMAR DE LADO E DOS PÉS. Sem uma segunda pessoa dando os comandos, o simulado não é teste de legalidade e deve ser rotulado como teste de força |
| Supino Pausado (Competição) | 0 | 1 | 1 | 89.1% | 7 | 5 MIN | 2ª TENTATIVA — sem afundar as costelas depois do "Press", DQ nova de 2026 [IPF-TR2026 §3.3] |
| Supino Pausado (Competição) | 0 | 1 | 1 | 92.2% | 8 | 5 MIN | 3ª TENTATIVA — ⚠️ O SUPINO NÃO GANHA NADA COM O TAPER: +2,5 kg sobre o melhor single da S16, que é o menor incremento que a academia permite, e é o número de Perkins (±0 a 2,5 kg). ⚠️ GATE DE DOR GOVERNA ESTA TENTATIVA: se houve qualquer evento ≥2/10 no log de peitoral nas duas semanas anteriores, ela NÃO sobe da tabela e o teto de RPE do supino cai de 9,5 para 8,5; se houve evento ≥4/10 ou estiramento agudo, o supino do simulado ENCERRA NA 2ª TENTATIVA. Sem exceção e sem negociação no dia |
| Terra Sumo (Sem Strap) | 4 | 1 | 1 | 87.5% | 6.5 | 5 MIN | 1ª TENTATIVA — é exatamente o peso dos 3×1 de D−10, já executado três vezes. É o ÚNICO dos três abridores com essa propriedade. Sem strap, magnésio, pegada escolhida na S1 e não mudada. Comando "Down" |
| Terra Sumo (Sem Strap) | 0 | 1 | 1 | 92.7% | 8 | 5 MIN | 2ª TENTATIVA — deltoide anterior atrás da linha da barra, imóvel até o "Down" [IPF-TR2026 §3.4]. Carryover esperado: +7,5 a +10 kg [Perkins] |
| Terra Sumo (Sem Strap) | 0 | 1 | 1 | 95.8% | 9.5 | 5 MIN | 3ª TENTATIVA — esta é a marca legal nova. Se uma tentativa for queimada, a seguinte REPETE o mesmo peso; não existe 4ª tentativa. LUZ VERMELHA POR PADRÃO CONTA COMO FALHA, e é o desfecho que este bloco inteiro existe para evitar |

**DESCANSO SUGERIDO: 0 DIAS**

---

## 9. O QUE FICOU DE FORA, E POR QUÊ

**Divergências declaradas contra `SPEC_REV2`, registradas aqui porque nenhum checker as
pega:**

- **High bar a 8×5, onde `SPEC_REV2` §1.3/D3 e §3.4 pedem 8×6.** −16,7% de reps do
  secundário. A métrica travada por R7 é em **séries**, então a divergência é silenciosa
  por construção. Motivo aceito: com 8×6, D3 vira o maior dia axial da semana dois dias
  antes do single primário, e as últimas séries passam do teto de RPE 8 (ver o desconto de
  high bar declarado na linha de D3). **Não restaurar 8×6 é decisão sustentada.**
- **Mesa flexora a 4×10–12, onde `SPEC_REV2` §1.3/D3 pede 3 séries.** A própria spec se
  contradiz: §1.5 declara 4 séries diretas de isquiotibiais por semana e D3 é o único lugar
  onde elas cabem. O construtor escolheu §1.5 e o registro dessa escolha faltava.
- **`design.md` §11-C sai dos invariantes de máquina** (`SPEC_REV2` §0.5). §11-C põe o
  máximo atual em ~87% do máximo projetado de competição em 12 meses — é um denominador
  DIFERENTE do `trainingMax`, e cruzar os dois produziria teto duplo e contraditório na
  mesma célula. Fica como referência de conversa semanal, não como checker.
- **A faixa de chegada "100–105% do TM inicial"** (`design.md` §11-A) não é atingível com o
  clamp de `×1,10` e o teto de 92%: o máximo aritmético é **101,2%**. Ver §1.1 — vale o
  clamp, e a faixa correta deste bloco é 100–101,2%.

- **Pausa ACIMA do paralelo.** Saiu do programa (`SPEC §7-#5`): R11 (REVISÃO 2) manda mais
  que `design.md` §3, e a exposição pausada deve estar na amplitude que **é a variável do
  bloco**. A base para o exercício é forte e isso precisa ser dito — *"o acessório de
  agachamento nº 1 dele"* `[R168 @00:00]` **[PESSOAL]** e *"melhora a forma, torna o
  agachamento mais seguro e ajuda a prevenir lesão"* `[R168 @00:34]` `[GERAL]` — mas manter
  as duas põe o piso não-high-bar em 10 séries e exigiria 10 séries de high bar num único
  dia. **Reversível:** volta como 3ª série de D1 a 15–20% menos carga que o trabalho normal
  `[R16 @04:35]` `[GERAL]`, custando 3,75 min.
- **Spoto press.** Contradição interna não resolvida: `[R103 @02:35]` `[GERAL]` diz que
  pausar a uma polegada do peito carrega **mais** o ombro; `[R170 @08:30]` **[PESSOAL]** diz
  o oposto. "Indeterminado" não é lugar para pôr tecido lesionado.
- **Supino em máquina / Smith.** Smith **não** está no inventário confirmado (§0-B). A dose
  foi para o floor press também em D4.
- **Barra fixa com peso** e **banda de face pull.** Fora do inventário confirmado; a dose
  foi para a máquina de puxada e para a polia.
- **Pin squat / box squat.** Zero claims em 3.154 `[tecnica §1.5]`.
- **Mudança de pegada do supino** `[R63]` e **troca de sumo por convencional** `[R172]`.
- **Bandas e correntes, parciais, board press, block pull.** 0/10 elites usam.
- **Panturrilha e abdominal.** 0/10 e 4/10 elites; cortados pelo orçamento.
- **Deltoide anterior isolado.** Crédito alto do supino 4×/semana; **zero** séries diretas.
- **Dynamic start no terra** `[R160 @05:00]` `[GERAL]` — seria a quarta mudança da S1 e é de
  performance, não de legalidade. Fica para o Bloco 2.

## 10. LACUNAS REGISTRADAS (auditáveis, nenhuma bloqueante)

- **Amplitude de rampa de exposição de tecido** — a base pede "progredir gradualmente" e não
  dá número. O teto de +25%/quinzena em `EXP` é `[interpretação]`.
- **Amplitude de "ride the line"** — operacionalmente indefinida em todo o corpus.
- **Âncora RPE↔% para 5 reps no terra** — Noriega só publica a de 7 reps.
- **Esquema de reps das back-offs** — §10 dá o offset e a parada, não o esquema.
- **Board, floor e pin press como reabilitação de peitoral** — zero no corpus.
- **Protocolo de transição high bar ÷ low bar** — nenhum número na base; resolver de verdade
  exigiria um `tm_high_bar` declarado, que é número novo.
- **Comando de terceiro como prescrição de treino** — o canal só prescreve long pause e
  spoto, que são autocontrolados.
- **Tempo em lockout de supino** — zero claims; a meta de 3 s vem do relatório de vídeo.
- **Regra geométrica de lockout da IPF 2026** — zero menções no corpus.
- **Posição da barra no agachamento** — pendente do vídeo de trás a 45° da S1.
- ⚠️ **Contradição de mecanismo NÃO resolvida pela base:** `VÍDEO-BP` §3.4 diz que o
  mecanismo de falha é **tempo em comprimento máximo**; o corpus diz o oposto (a pausa
  **poupa** o tendão — `[R177 @02:39]`, `[R89 @03:14]`, `[R103]`, `[R170 @10:36]`). O bloco
  fica **instrumentado para discriminar**: se a dor aparecer nas semanas em que a
  **exposição** sobe (S3, S5, S7, S9) e não nas em que a **carga** sobe (S13–S16),
  `VÍDEO-BP` ganha; se for o inverso, o corpus ganha.
