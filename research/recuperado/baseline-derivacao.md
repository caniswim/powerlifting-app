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
