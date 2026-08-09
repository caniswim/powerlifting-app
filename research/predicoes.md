# Registro pré-comprometido — Bloco 1

**Escrito em 2026-08-09, ANTES da primeira sessão.**
Semana 1 = 10/08/2026 (seg) a 16/08/2026. Semana *n* termina em `09/08/2026 + 7n`.

> **Este arquivo perde a maior parte do seu valor depois do primeiro treino.** Ele existe
> para ser falseável, e falseabilidade morre no instante em que o primeiro dado entra: a
> partir daí toda previsão pode ser escrita já sabendo. Nenhuma linha abaixo pode ser
> editada depois de 10/08/2026 — só **anotada** com o resultado, a data da anotação e
> quem anotou. Corrigir uma previsão é apagar a medição.

> **O que este arquivo NÃO é:** não é plano, não é meta e não é motivação. Uma previsão
> que se cumpre não prova que o desenho está certo; uma que falha prova que alguma coisa
> escrita em `design.md`, `baseline.md` ou no corpus estava errada, e a coluna
> "o que morre" diz exatamente o quê.

> **Aviso de procedência, válido para o arquivo inteiro.** As três referências de partida
> (215 / 160 / 240 kg) são **ESTIMADAS**, não medidas. O fator de profundidade do
> agachamento (−12 a −18%) que produz os 215 kg **não tem fonte no corpus** e circula com
> autoridade de citação — está registrado assim em `research/kb/SCHEMA.md` (abertura) e em
> `research/kb/AVALIACAO.md` §9. Toda previsão que use esses números herda a incerteza.

---

## Tabela 1 — Descontos de legalidade (o que o gate da semana 4 vai achar)

`design.md` §11-A2: entre a S3 e a S4 o máximo legal é extrapolado e gravado em
`trainingMax`; divergência > 7% contra 215/160/240 vai para a conversa semanal.

| # | previsão | limiar de falseamento | prazo | data | o que morre em cada desfecho |
|---|---|---|---|---|---|
| **P01** | `TM_agacho` no gate ∈ **[195, 215] kg**, ponto **205** | fora de [195, 215] | S4 | **06/09/2026** | **> 215:** o crédito de +5–8% do pin squat de `baseline.md` §1 estava subestimado e o −12/−18% superestimado. **< 195:** `baseline.md` §1 erra na outra direção **e** `V115-22` (*"se atinge profundidade até a faixa de 80%, estabilidade e mobilidade estão resolvidas"*) é falseada para ele — o corte não é só de carga maximal. Em qualquer dos dois casos, o que morre não é uma claim: é um número `tier I` sem `basis`, e isso é o achado |
| **P02** | `TM_supino` no gate ∈ **[150, 165] kg**, ponto **157,5** | fora de [150, 165] | S4 | **06/09/2026** | **Esta é declaradamente a mais frágil das três** (`baseline.md` §3: n=1, três datapoints). **> 165:** `V083-13` [PESSOAL] (PR de meet 190 = −10 kg do PR de academia, −5%) não transfere para 87 kg, e o crédito de setup de R4 domina. **< 150:** o −5/−7% da pausa é insuficiente e o custo real da pausa de competição é maior do que qualquer coisa que a base registra |
| **P03** | `TM_terra` no gate ∈ **[232,5, 250] kg**, ponto **240** | fora de [232,5, 250] | S4 | **06/09/2026** | Declarada a mais firme (`baseline.md` §3, ancorada em gap medido). **Se falhar**, morre a transferência de `V174-08` [PESSOAL] (melhor terra em competição 672 lb) + `V174-26` [PESSOAL] (672 legal > 700 de academia) como base do desconto de −8 a −12% |
| **P04** | O **supino** é o lift com a **maior divergência percentual** contra a referência, dos três | se \|Δsupino\| não for a maior das três em pontos percentuais | S4 | **06/09/2026** | Se o supino **não** for o mais divergente, a ordem de confiança declarada em `baseline.md` §4 (terra > agacho > supino) está errada, e a auditoria de fragilidade precisa ser refeita antes de o bloco continuar |
| **P05** | Pelo menos **um** dos três diverge **> 7%** e dispara o gate de `design.md` §11-A2 | os três dentro de ±7% | S4 | **06/09/2026** | Se os três ficarem dentro de ±7%, a conversão de `baseline.md` acertou melhor do que ela mesma se dá crédito — e a advertência de `AVALIACAO.md` §9 perde urgência (mas não deixa de ser verdadeira: acertar por sorte não é ter fonte) |

## Tabela 2 — Convergência técnica do agachamento

| # | previsão | limiar de falseamento | prazo | data | o que morre |
|---|---|---|---|---|---|
| **P06** | Fração de reps do **top set** de agacho que um revisor cego reprovaria por profundidade: **S1 ≥ 50%**, **S8 ≤ 20%**, **S16 ≤ 5%** | qualquer um dos três marcos fora | S1 / S8 / S16 | **16/08** · **04/10** · **29/11/2026** | **Se S16 > 5%:** morre a tese central de `design.md` §1 (*"a prioridade não é ficar mais forte, é ficar legal; aprendizado técnico responde em semanas"*), e com ela `V115-24` (*"sobrecarregue progressivamente o percentual no qual você atinge profundidade com confiança"*) como método suficiente. **Se S1 < 50%:** a análise de vídeo que produziu o −12/−18% mediu errado, e P01 cai junto |
| **P07** | O **percentual do `trainingMax` no qual ele bate profundidade sem hesitar** (a métrica de `V115-24`) sobe de **≤ 70% na S1** para **≥ 88% na S16** | < 85% na S16 | S16 | **29/11/2026** | Se travar em ≤ 80%, `V115-22` diz que o problema **não** é estabilidade nem mobilidade e sim confiança sob carga maximal (`V115-21`) — e nenhuma das duas tem prescrição de taxa no corpus. Vira o caso de `Q09` (lacuna declarada) |
| **P08** | Ângulo de tronco no fundo legal cai de **~50°** (previsão de `design.md` §2 para a mecânica atual descendo até o fundo) para **≤ 42°** na S16 | > 42° na S16, **medido com protocolo de erro declarado** | S16 | **29/11/2026** | ⚠️ **Esta previsão é hoje INFALSIFICÁVEL e isso está escrito de propósito.** Não existe protocolo de repetibilidade de medida de vídeo (ver `Q14`): com ±3 cm de incerteza de vestuário (`design.md` §8) e ±5–8 cm na posição da barra (`PROGRAMA.md` §3), 8° de correção estão dentro do ruído do instrumento. **Se ninguém construir o protocolo até a S2, P08 morre por falta de instrumento, não por falta de adaptação** — e esse é um resultado sobre o sistema, não sobre o atleta |
| **P09** | O agacho é o lift com o **maior ganho absoluto de `trainingMax`** entre S4 e S16: **+12,5 a +25 kg** | ganho do agacho não for o maior dos três, ou ficar fora de [+12,5, +25] | S16 | **29/11/2026** | Se não for o maior, `design.md` §1 e §2 erraram o diagnóstico — o gargalo dele não era técnico, e o bloco inteiro foi desenhado contra o gargalo errado |

## Tabela 3 — Peitoral e ombro sob aumento de frequência de supino

Contexto: supino **4×/semana** com pausa de 1,0 s em toda rep desde a S1, sobre tecido
rompido há 4 meses e assintomático (`design.md` §0, §4-B, `PROGRAMA.md` §1.2).

| # | previsão | limiar de falseamento | prazo | data | o que morre |
|---|---|---|---|---|---|
| **P10** | **Zero** eventos de dor de peitoral **≥ 4/10** ou estiramento agudo em 16 semanas | 1 evento basta | S16 | **29/11/2026** | Se acontecer: morre a suficiência da rampa de `design.md` §4-B / `PROGRAMA.md` §1.2, e ficam feridas `V092-10` (*recuperação é não linear, dividir em mais dias permite mais carga*), `V092-21` (*variação de movimento ligada a menos lesão*) e `V092-22` (*estudo com 1900 powerlifters não achou associação entre frequência e lesão*) — as três **GERAL**, as três usadas para autorizar 4×/semana |
| **P11** | Eventos de dor de peitoral **≥ 2/10**: **entre 1 e 6 no total**, e **nenhum a partir da S9** | 0 no total, > 6 no total, ou qualquer um na S9+ | S16 | **29/11/2026** | **0 eventos:** o gate nunca dispara e o bloco rodou sem instrumento de segurança testado — o gate é indistinguível de decoração. **> 6 ou algum na S9+:** morre `V001-08` (*"uma sessão mais dolorosa não significa que a reabilitação não esteja funcionando"*) como política, e vale `V027-23` (*lesões menores acabam sendo movimentadas mais do que deveriam*) |
| **P12** | **Zero** eventos de dor de **ombro** ≥ 2/10 em 16 semanas | 1 evento basta | S16 | **29/11/2026** | Se acontecer: `V101-14` (*boa parte dos problemas de ombro vem de hiperespecificidade sem variação*) é ferida — o bloco **tem** variação (floor press, high bar, prática a 40–70%) e mesmo assim inflamou. E `V087-05` [PESSOAL] (*os singles fatigavam o trabalho principal e agravavam lesões de ombro*) passa a ser o mecanismo mais provável, o que retroalimenta P17 |
| **P13** | Ganho de `TM_supino` entre S4 e S16 ≤ **+5 kg** | > +7,5 kg | S16 | **29/11/2026** | Se passar de +7,5 kg, morre `design.md` §13-B/R3 (*"o supino é o lift com menor progressão do programa"*) e ganha `V116-15` (*o trabalho de supino deveria ser ≈ agacho + terra somados*) — que é a claim que mandou subir para ≥22 séries/semana |
| **P14** | Ganho de `TM_terra` entre S4 e S16 ∈ **[+7,5, +15] kg** | fora da faixa | S16 | **29/11/2026** | Abaixo de +7,5: o intervalo de 3 dias entre D2 e D5 é o suspeito nº 1 (`design.md` §10, contraponto de Sean Noriega, n=1) e a primeira alavanca a mexer |

## Tabela 4 — A aposta das 16 semanas

`design.md` §11-C declara isto como **a aposta mais contestável do desenho**: Vena prescreve
12–20 semanas com ideal 16 (`V004-05` [PESSOAL], `V125-07`, `V040-01`, `V040-14`, `V040-18`),
contra pesquisa de 6–12, metade dos coaches de elite em 6–8, Sitko 4–5, Perkins 5, Rouska 4.

| # | previsão | limiar de falseamento | prazo | data | o que morre |
|---|---|---|---|---|---|
| **P15** | Na **S8**, pelo menos **2 de 3** lifts têm tendência de gauge set **não decrescente** nas semanas 5–8 (RPE do gauge não subiu ≥1 ponto contra a S5 com a mesma carga relativa) | 2 ou mais lifts com gauge deteriorando | S8 | **04/10/2026** | Se falhar: as 16 semanas perdem para o resto da base, e ficam feridas `V004-05` [PESSOAL], `V125-07` [GERAL], `V040-01` [GERAL] e `V040-14` [GERAL] (que **ela mesma** declara que o número é anedótico do trabalho de coach dele). O substituto tem número na base: `V040-24` — *"num período muito bom de treino dá para testar o máximo depois de 10 ou 12 semanas"* |
| **P16** | O gauge set re-ancora `TM_agacho` **para cima** ≥ **4 vezes** entre S4 e S16, e `TM_supino` ≤ **2 vezes** | agacho < 4, ou supino > 3 | S16 | **29/11/2026** | Se o supino re-ancorar ≥4 vezes, `V087-13` [PESSOAL] (*no supino o trabalho de repetições transfere para a força máxima*) transfere para ele, e `design.md` §13-B/R3 estava pessimista demais. Se o agacho re-ancorar < 4, o motor de re-ancoragem (`design.md` §13-B/R1) não funciona e a rampa de P17 não acontece |
| **P17** | Rampa de carga realizada entre S4 e S16 fica dentro de **5–9%** em pelo menos **2 de 3** lifts | 2 ou mais lifts fora de 5–9% | S16 | **29/11/2026** | `design.md` §11-A prescreve 5–9%; `PROGRAMA.md` §1.1 já mede o programa gerado partindo de **84,9 / 85,9 / 85,4%** com ganho líquido **−5,8 / −8,6 / −6,7%** — ou seja, **a spec e o programa já discordam antes de o bloco começar**. Se a rampa realizada ficar fora de 5–9%, morre a leitura de `V033-08`/`V033-09`/`V033-14` [todas PESSOAL] como precedente transferível: os 7,5%/5%/2,5% dele saem de max out + deload + corte agressivo, e **este atleta não tem nenhum dos três** |

## Tabela 5 — Primeira competição

| # | previsão | limiar de falseamento | prazo | data | o que morre |
|---|---|---|---|---|---|
| **P18** | **Total do primeiro meet ∈ [560, 640] kg**, ponto **600 kg** | fora de [560, 640] | 1º meet | **estadual out/nov 2026 ou simulado da S17–S18, 13/12/2026** | Deriva do `TM` da S16 + carryover de Perkins (agacho +10 a +15 · supino ±0 a +2,5 · terra +7,5 a +10, `design.md` §10) **menos** tentativas conservadoras. **Se > 640:** o desconto de legalidade de `baseline.md` foi pessimista demais e P01–P03 caem juntas. **Se < 560:** a estreia comeu tentativas, e a causa vai estar em P19 |
| **P19** | **6 a 8 tentativas válidas de 9**, e **pelo menos 1 luz vermelha por profundidade** no agacho | 9/9 válidas, ou 0 vermelhas de profundidade, ou < 6 válidas | 1º meet | idem | 9/9 na estreia falsearia `IPF-CHECKLIST.md` §6 (*"a abertura de agacho tem que ser um peso onde a profundidade nunca falha"*) na direção boa. < 6 válidas aponta para `design.md` §13-B/R12 — **zero comandos de competição em 18 semanas** — como causa, e é a única linha do desenho que corrige isso de graça |
| **P20** | **Não haverá bomb-out** (3 falhas no mesmo movimento, `F001` §6.3.6) | 1 bomb-out basta | 1º meet | idem | ⚠️ **Previsão feita sem taxa-base medida.** A base **não tem** a taxa de bomb-out de estreantes do dump do OpenPowerlifting — o CSV não está no repositório e não há script que a regenere. O único dado é anedótico (`IPF-REALIDADE.md` §7: *"dois atletas ficaram sem total no Brasileiro 2026 na 83 kg"*). Se houver bomb-out, o que morre é a **confiança nesta previsão**, não uma claim — e a lacuna que ela expõe é a de `Q10` |
| **P21** | Peso corporal na S16 ∈ **[85,5, 88,5] kg** **com DOTS subindo** contra 405 | fora da faixa, ou DOTS caindo | S16 | **29/11/2026** | `design.md` §9 põe o DOTS como árbitro. Se o peso ficar e o DOTS cair, a recomposição em manutenção não funcionou para ele, e `design.md` §12 (1 kg magro vale ~3× 1 kg economizado) manda ir para superávit |
| **P22** | **O estadual de 2026 vai colidir com o bloco.** A janela histórica de estaduais é abr–nov (`IPF-REALIDADE.md` §8.5) e o bloco de 18 semanas termina em **13/12/2026**. Previsão: **ou o estadual entra dentro do bloco cortando o taper, ou o Brasileiro escorrega para 2028** | o estadual acontecer depois de 13/12/2026 **e** ainda habilitar para o Brasileiro 2027 | — | **decidido até 30/09/2026** | Não é previsão de treino, é de calendário — e é a única deste arquivo cujo erro custa **12 meses** e não uma semana. `IPF-REALIDADE.md` §8.5: o Brasileiro Clássico Open é sempre em fevereiro e exige estadual no ano anterior |

---

## Como isto é conferido

1. Cada linha só admite **anotação**, nunca edição. Formato: `→ [data] RESULTADO: … · anotado por: …`.
2. O gate da S4 (`design.md` §11-A2) confere P01–P05 **antes** de recomputar carga alguma.
3. A conversa da S8 confere P15 e decide se as 16 semanas continuam.
4. A conversa da S16 confere P06, P07, P09, P10–P14, P16, P17, P21.
5. P08 **não é conferível** enquanto o protocolo de vídeo com erro declarado não existir.
   Isso é dívida registrada, não desculpa.

**Ids citados neste arquivo, todos resolvíveis em `check-evidence.mjs`:**
`V115-22` `V115-24` `V115-21` `V083-13` `V174-08` `V174-26` `V092-10` `V092-21` `V092-22`
`V001-08` `V027-23` `V101-14` `V087-05` `V087-13` `V116-15` `V004-05` `V125-07` `V040-01`
`V040-14` `V040-18` `V040-24` `V033-08` `V033-09` `V033-14`
