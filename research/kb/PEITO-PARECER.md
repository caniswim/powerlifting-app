# PARECER — dor leve no peitoral, do lado da lesão antiga

**12/08/2026.** Escrito para você ler, não para um agente ler. Sem jargão de ferramenta:
onde precisar de um id (`V138-18`, `V001-06`) é porque a frase veio de algum lugar e você
tem o direito de conferir de onde.

O dado é seu e é este: *"levemente dolorido"*, *"bem leve, não é nada sério"*, no lado onde
houve a ruptura, **presente em repouso**, e você não treinou esta semana. Não vou dramatizar
e não vou minimizar. Vou dizer o que a base manda, o que ela não sabe, e — a parte mais
importante — **o que o app promete e não cumpre**.

---

## 1. O QUE FAZER NESTA SEMANA

1. **Anote um número hoje, e amanhã de novo.** Escolha um 0–10 para a dor em repouso, ao
   acordar, e depois de um esforço comum do dia (carregar compra, empurrar porta pesada).
   Anote no papel ou no bloco de notas — **o app não tem onde guardar isso** (§4). Sem dois
   ou três dias de números não existe *trajetória*, e trajetória é o único critério que a
   base inteira usa para decidir entre treinar e não treinar (`V086-21`, `V027-26`).
2. **Se voltar a mover esta semana, não volte pela grade do programa e não conte com o gate
   para segurar você** — nem a grade nem o gate tiram carga do peitoral (§2 e §3). A única
   redução que existe hoje é a que você fizer à mão, e a base é específica sobre qual é:
   **peso absoluto e proximidade da falha, os dois ao mesmo tempo** (`V138-18`, GERAL,
   `prescricao`).
3. **Marque a avaliação presencial antes de reexpor o tecido em comprimento máximo.** O
   critério concreto, com prazo e sinal, está no §7 — e "se piorar" não é o critério.

### A versão que depende da semana do bloco

**Não dá para saber daqui em que semana você está.** A posição fica no seu telefone
(Firestore) e este repositório não tem a credencial para consultá-la; sem sessão gravada, o
código responde "semana 1". Então aqui estão **todas** as versões, e você lê a sua:

| se você está em | o que a grade manda nesta semana | o que o "recua um degrau" faria de fato | o que de fato reduz carga aqui |
|---|---|---|---|
| **S1–S3** | supino pausado 13 séries + floor press 9, tudo a RPE ≤8, sem trabalho pesado | baixa só o teto de RPE do floor press — **zero série a menos** | é o degrau mais leve do bloco; o que pesa são as 22 séries de barra e os 18 aquecimentos |
| **S4–S9** | entra o back-off de D2: **4×3 pausado a 82 % com teto de RPE 9,5**, toda semana | troca 1 série de supino pausado por 1 de floor press — **total idêntico** | tirar o back-off de D2, ou baixá-lo de RPE 9,5 para RPE 7 |
| **S10–S11** | o bloco de 2 s (D3, 4×3 a 65 %, RPE 6) + o mesmo back-off a 82–83 % | idem: troca 1:1, total idêntico | o back-off. **Não o bloco de 2 s** — ver §3 |
| **S12–S16** | back-off sobe a 83–86 %, top single chega a 92 %, peck deck/inclinado vai a 6 séries | o eixo mais recente é `PEC-SETS`: **−2 séries reais**, o único recuo que remove alguma coisa | `PEC-SETS` (funciona) e o back-off de D2 (não está em degrau nenhum) |
| **S17–S18 (taper)** | 11 e 6 séries de barra; o simulado da S18 chega a 92,2 % | nada — os degraus acabaram | o gate aqui governa a 3ª tentativa do simulado, e nada além |

Em **nenhuma** dessas linhas o app faz a redução sozinho. Em todas elas, a redução é sua e
é manual.

---

## 2. O DEFEITO DO RECUO — a parte mais importante deste documento

**Hoje o programa troca supino pausado por floor press na proporção de um para um: cada
série de pausado que sai é uma série de floor press que entra, e o total de barra sobre o
peitoral fica em 22 por semana, invariável da S1 à S16.** Portanto, quando o gate de dor
manda *"recua um degrau"*, o app tira uma série do movimento em comprimento máximo e põe
uma série do movimento truncado no lugar — o peitoral continua recebendo exatamente a mesma
quantidade de barra, e a promessa de que o programa recuou é uma promessa que ele não
cumpriu.

Isso não é interpretação. Está escrito em duas linhas do programa
(`FP-SETS = 7 − SUP-V1` e `FP4-SETS = 5 − SUP-V4`), o gerador **reprova o build** se a
grade divergir disso, e a medição bate em todas as 16 semanas: as duas somas ficam em
`FP-SETS + SUP-V1 = 7` e `FP4-SETS + SUP-V4 = 5`, sem uma exceção, e o subtotal de barra
fica em 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22.

⚠️ **Corrigido em 13/8/2026, e a correção importa para você:** o número 22 é o subtotal das
duas linhas de **barra** (supino pausado + floor press). **O seu total semanal de séries
sobre o peitoral não é invariante e nunca é 22 — ele SOBE ao longo do bloco, de 24 a 28
séries por semana:**

| semanas | séries de trabalho sobre o peitoral |
|---|---|
| S1–S5 | **24** |
| S6–S13 | **26** |
| S14–S16 | **28** |

O que sobe é o trabalho direto (`PEC-SETS`: supino inclinado com halter + peck deck, 1 → 2
→ 3 séries em cada uma das duas linhas). O subtotal de barra é que fica parado em 22.
Medido no programa gerado, contando as séries de trabalho de todo exercício que carrega
peitoral: `node research/tools/auditoria-peito/series-peito.mjs`. **Nada disso enfraquece o
parágrafo acima** — o que trava o recuo são as duas somas de par, não o total, e elas
continuam valendo 7 e 5 em todas as 16 semanas. A frase que caiu foi *"o volume semanal
sobre o peitoral é invariante em 22 séries"*; a conclusão que fica de pé é **recuar supino
pausado não alivia o seu peitoral, porque o floor press entra 1:1 no lugar** — e ainda por
cima o total está subindo enquanto isso.

Testei o recuo dos **oito** eixos que o §1.2 nomeia, em toda semana em que cada um tem valor
anterior distinto. O resultado:

| eixo que o gate congela/recua | o que o recuo remove do peitoral |
|---|---|
| `SUP-V1` | **nada** — `FP-SETS` sobe na mesma medida, em 13 semanas testadas |
| `SUP-V4` | **nada** — `FP4-SETS` sobe na mesma medida, em 12 semanas |
| `FP-SETS`, `FP4-SETS` | **nada**, e pior: recuá-los exige que o supino pausado **suba** |
| `PAUSA-P` | **nada** em série; e a direção literal é *aumentar* a pausa (§3) |
| `FP-RPE`, `FP4-RPE` | **nada** em série — só o teto de RPE do floor press |
| `PEC-SETS` | **−2 séries**, em 11 semanas. **É o único que remove alguma coisa.** |

**Consequência que fica escrita:** dos quatro degraus da tabela do §1.2, nenhum abaixo de
4/10 remove uma única série de carga do peitoral. O primeiro degrau (*congela*) só impede
que a carga suba mais — e nem isso ele faz direito, porque os nomes congelados são todos de
contagem de séries e de pausa, e **nenhuma das colunas de peso do supino está na lista**.
Com o gate disparado e o TM parado em 160 kg, da S4 à S16 continuam subindo: o volume de D1
de 115,2 para 124,8 kg, o top single de 137,6 para 147,2 kg, o back-off de 131,2 para
137,6 kg. A base manda o oposto, e é explícita nas duas variáveis: *"reduce the loading in
terms of both **absolute weight** and **proximity to failure**"* (`V138-18`, GERAL,
`prescricao`).

**E há uma terceira camada que nenhum degrau toca.** As contagens acima — inclusive a regra
R3 do programa, *"supino ≥ 22 séries/semana"* — contam só séries de trabalho. O bloco tem
mais **18 séries de aquecimento por semana sobre o peitoral**, invariantes nas 16 semanas,
das quais 14 são de supino pausado, e o programa manda pausar 1,0 s *"inclusive nos 3
aquecimentos"*. A exposição real do seu peitoral é de **42 a 46 séries por semana**, das
quais 27 a 31 pausadas no peito. Nenhum degrau do gate enxerga essas 18.

**Eu não consertei isso, de propósito** — é a única coisa desta auditoria que mudaria o seu
treino, e mudar o treino de alguém com lesão sem essa pessoa na sala não é meu papel. A
proposta, para você decidir, está no §8.1.

---

## 3. O PICO DE TENSÃO NÃO ESTÁ ONDE O PROGRAMA APONTA

O §1.2 diz: *"Se o gate disparar entre S8 e S11, o bloco de 2 s é a PRIMEIRA coisa que
sai."* Medido linha a linha, isso está de cabeça para baixo.

- **O bloco de 2 s** existe em **duas linhas do programa inteiro** (S10 D3 e S11 D3): 4×3 a
  **65 % do TM**, teto de **RPE 6**. É a linha mais leve e mais longe da falha entre todas
  as pausadas do bloco.
- **O back-off de D2** é 4×3 pausado a **82 → 86 % do TM**, teto de **RPE 9,5**, em **13 das
  16 semanas sem exceção**. Somando o top single, são **13 repetições por semana em
  comprimento máximo acima de 80 % do TM**, da S4 à S16.

E a claim que o próprio programa invoca para justificar a pausa diz que pausa **reduz**
tensão, não aumenta: *"a useful workaround is doing slow velocity variations, things like
tempo work or pauses — **tendon strain is based off weight and speed we move it at**"*
(`V089-25`, GERAL, `prescricao`). Se o critério for tensão sobre o tecido, a primeira coisa
a sair é o back-off de 9,5, não o bloco de 2 s.

⚠️ **Ressalva que não omito:** `V089-25` está no mesmo trecho de `V089-24`, dentro de um
bloco sobre **tendinite** — "workaround" ali é workaround de tendinite. **Você não tem esse
diagnóstico.** A contradição fica registrada; não fica resolvida.

⚠️ **E um detalhe que morde:** nas S12–S16, *"recua um degrau do eixo que mudou mais
recentemente"* aponta para `PAUSA-P`, cujo valor anterior era **2,0 s**. Lido ao pé da
letra, o recuo **aumenta** o tempo sob tensão em comprimento máximo. A única guarda escrita
proíbe descer abaixo de 1,0 s e não diz nada sobre subir. Se você for executar o recuo à
mão nessas semanas, **não** suba a pausa.

---

## 4. O QUE O APP NÃO VÊ — e por que a sua semana sai dele dizendo que não houve dor

Percorri isto pelo código de produção que monta o documento semanal, não por
reimplementação.

**A sua semana, exatamente como ela é (nenhum treino, dor em repouso):** o documento sai com
`dor: []` e as bandeiras *"0/5 sessões concluídas"* e *"aderência de séries em 0%"*. **A
semana em que você está com dor sai do app afirmando que não houve dor nenhuma.**

Não é descuido de preenchimento: **não existe caminho**. As duas pesquisas de dor (pré e
pós-treino) começam pelo campo `workoutId` — sem treino aberto, não há onde a entrada morar.
O tipo `RestPainLog` está declarado, a função que descreveria a dor em repouso está escrita,
e a versão do esquema chegou a ser incrementada citando um campo `restPain`. Medido: o tipo
tem **um** uso, a própria declaração; a função tem **zero** chamadas; o campo **não existe**.
Era andaime completo sem porta — e o comentário que anunciava o campo como pronto foi
corrigido neste passe (`src/services/sync/rollupTypes.ts`).

**O contorno que existe hoje custa caro:** abrir um treino falso só para marcar 2/10 no pré.
A dor chega ao gate e o degrau *congela* dispara corretamente — mas essa leitura **gasta uma
das 3 vagas da janela** do §1.2 com um dia que não foi exposição, e polui a aderência.
Você escolhe entre perder o dado e sujar a medição. Não há terceira opção hoje.

**Mais três buracos medidos, todos reais e nenhum consertado por mim:**

1. **O alerta da tela só lê o pré-treino.** Dor de peitoral registrada apenas no pós-treino
   nunca acende nada na tela, embora o documento semanal a enxergue.
2. **"Estiramento agudo" tem leitor e não tem escritor.** A célula `≥4/10 ou estiramento
   agudo` está no código, o degrau sabe respondê-la — e não há botão no seletor de dor para
   marcá-la. Uma fisgada aguda que você pontuar como 3/10 dispara *congela*, não *encerra a
   sessão*.
3. **O app sabe dizer se dói. Não sabe dizer se está melhorando.** Não existe uma única
   função no código que compare o pico desta semana com o da anterior — o gate é um detector
   de eventos, não um medidor de tendência, e não há nenhuma conta de tempo decorrido nele
   (um evento de três meses atrás pesa igual a um de ontem). Um platô em 2/10 por seis
   semanas dispara *congela* toda semana, **sem nunca escalar e sem nunca ser nomeado como
   platô** — que é exatamente o que aconteceu com o Vena (`V027-25`) e exatamente o que
   `V027-28` (`prescricao`) manda tratar como falha. **É por isso que o §1.1 pede os números
   diários no papel: hoje a trajetória é sua, não do app.**
4. **O pós-treino só pergunta por dor NOVA.** A sua dor já estava e não mudou — ela não é
   nova, e nada garante que apareça no registro pós-sessão.
5. **As bandeiras do gate não chegam a lugar nenhum acionável.** Elas viram texto no
   documento semanal, e o único leitor é o script do briefing — que não roda sem
   credenciais. Na tela, o gate produz um rótulo e um alerta. **Nenhuma prescrição muda.**
   O módulo que faria o congelamento valer existe, está correto, e **não tem um chamador em
   todo o repositório** — e ele é o mesmo módulo que deveria gravar o seu TM pela mediana
   das três âncoras da S3. O 160 kg que sustenta toda a aritmética de carga acima é um
   número digitado à mão nas configurações, carimbado como "calibrado" sem calibração
   nenhuma.

---

## 5. O QUE A BASE MANDA — e o que ela não manda

Cada linha com o id, o `scope` e o `modo`. **Só `prescricao` vira treino nesta casa**;
`opiniao`, `mecanismo`, `anedota` e `narrativa` são contexto e estão marcados como tal.

### Manda (é `prescricao` e é `GERAL`)

| o quê | id | verbatim, resumido |
|---|---|---|
| **Não parar completamente** | `V001-04` | *"complete rest is not the best idea when it comes to injuries"* |
| …mas nunca sozinho: sempre "não parar **E** achar o limiar mais leve" | `V001-05` | *"find the threshold where you can keep it moving, experiencing some light discomfort is okay"* |
| **Reduzir peso E proximidade da falha, ao mesmo tempo** | `V138-18` | *"reduce the loading in terms of both absolute weight and proximity to failure"* |
| **Reduzir volume também** | `V001-09` | *"You should probably be doing less volume, too"* |
| **Recuar de verdade, não simbolicamente** | `V017-15` | *"sometimes you just need to really dial back"* |
| **Dividir o volume** entre o exercício doloroso e um segundo menos doloroso | `V138-04`, `V138-15` | *"split the volume between it and a second less painful exercise"* |
| O secundário é o **mais específico que dê para fazer sem dor** | `V138-09`, `V177-12`, `V108-30` | *"the most specific movement we can do with a normal training intensity with no or nearly no pain"* |
| **Fazer o movimento doloroso também**, para reabilitar a tolerância a ele | `V108-27`, `V017-22` | *"you're not really rehabbing the injury if you aren't getting better at the actual movement itself"* |
| **Frequência NÃO muda** | `V138-23` | *"we're keeping our same frequency as before"* |
| **O critério é trajetória**, não o número de um dia | `V086-21`, `V027-26` | *"your symptoms should be trending better over time"* |
| **Platô conta como falha**, não só piora | `V027-28` | *"if you're… really just plateauing in pain or even getting worse, you've got to reduce the load more"* |
| **Não deixe o ego impedir de ir leve o bastante** | `V086-22` | *"…and just drags out the injury for months"* |
| Continuar movendo com dor leve dá melhor desfecho | `V079-32`, `V138-20` | *"rehab with light pain does lead to quicker rehab times"* |
| O limiar de dor tolerável | `V001-06` (≈2/10) e `V079-34` (2–3/10) | as duas são `GERAL` + `prescricao`, e discordam |

### É contexto, e por isso NÃO vira instrução

| o quê | id | `modo` |
|---|---|---|
| *"lesões menores acabam sendo movidas mais do que deviam, porque é fácil treinar através delas"* | `V027-23` | `opiniao` — **e é a condição declarada dos TRÊS limiares**. Descreve o seu caso com precisão desconfortável. |
| *"uma sessão mais dolorosa não significa que o programa não funciona"* | `V001-08` | `opiniao` — e é a **única** âncora do 1º degrau do §1.2 |
| *"um dia isolado de pico de dor é normal"* | `V027-27` | `fato` |
| O limiar de 2–4/10 | `V138-19` | `opiniao` — por isso nunca esteve na disputa |
| Vena passou anos treinando através de dor pequena com tendinite de peitoral e **patinou sem progresso** | `V027-25` | `PESSOAL` / `anedota` — **é o modo de falha a evitar**, não é instrução |
| Dor no bíceps costuma ser tendão do peitoral | `V095-23` (`mecanismo`), `V095-24` (`opiniao`) | ver §5.1 |
| Com tendinite, não descansar completamente / usar pausas como contorno | `V089-24`, `V089-25` | `prescricao`, mas **sobre tendinite** — diagnóstico que você não tem |

### 5.1 A regra do bíceps: decisão de desenho, não derivação

O §1.2 manda *"dor referida na região do bíceps entra no log de peitoral até prova em
contrário"*. Procurei a prescrição que sustenta isso e **ela não existe**: as duas claims
por trás são `V095-23` (`mecanismo`) e `V095-24` (`opiniao`, é dela o número dos 90 %).
Zero prescrição. A regra continua valendo porque errar para o lado de registrar é o lado
seguro num tecido com histórico de ruptura — **mas ela é escolha do desenho, e agora está
declarada como tal no `PROGRAMA.md`**, não citada como se a base a mandasse.

### 5.2 O 2/10 da base é ALVO; o 2/10 do programa é FREIO

`V001-06` diz que 2/10 *"is usually **good** for most people"* e `V079-34` que 2–3/10 é
*"a good amount to **push at**"*. Nas duas, 2/10 é o ponto **onde você quer estar**. No
§1.2, é o ponto onde tudo congela. É o mesmo número com o sinal invertido. Isso é
conservador, e conservador é a direção certa para um tecido com histórico — mas é escolha,
não derivação, e agora está escrito no programa.

---

## 6. O QUE A BASE **NÃO** SABE SOBRE O SEU CASO

Esta seção não pode ficar vazia, e não fica.

1. **A base não tem uma única prescrição sobre peitoral + dor.** Cruzei as 6.912 claims:
   `topic: peito` ∩ (`dor` ∪ `lesao`) dá **2 claims**, e as duas são não-prescrição —
   `V027-25` (`PESSOAL`/`anedota`) e `V095-24` (`GERAL`/`opiniao`). **Toda** instrução do §5
   acima é claim de **lesão genérica transplantada para o peitoral**. É legítimo e é o
   melhor que existe; não é o mesmo que a base falar do seu tecido.
2. **A base é o canal de um atleta não testado de ~120 kg. Você é natural, 87 kg, 28 anos,
   classe 93 kg IPF, e nunca competiu.** As recomendações de dose desse canal saem de um
   corpo com outra recuperação farmacológica, outra massa e outra história de plataforma.
   O que transplanta melhor são os princípios (trajetória, dividir volume, reduzir peso e
   proximidade da falha); o que transplanta pior são números.
3. **A base não tem limiar para dor EM REPOUSO.** A tabela inteira do §1.2 é sobre pico
   **dentro de sessão**. Dor presente em repouso, no lado de uma ruptura prévia, não tem
   célula, não tem número e não tem degrau. Ela também não tem instrumento no app (§4).
4. **A base não distingue "reagravamento" de "dor nova".** `V001-13` (*"people just try to
   come back way too quickly and just re-aggravate their injury"*) e `V027-16` (respostas
   protetoras persistem depois de o tecido curar) descrevem dois quadros com **a mesma
   apresentação** — *"levemente dolorido"* — e manejos opostos. Nada na base separa os dois.
   Um exame separa.
5. **A base não tem nada sobre carga em posição alongada e risco de peitoral.** Varri as
   gavetas `rom` e `peito`: zero. E é exatamente a variável que mais sobe neste bloco — o
   trabalho em comprimento máximo vai de 15 para 23 séries por semana, e o halter inclinado
   e o peck deck (a posição mais alongada do bloco) **triplicam**, de 2 para 6 séries.
6. **A base não sabe converter *"bem leve, não é nada sério"* num número 0–10.** O gate
   inteiro depende desse número, e o valor que você escolher decide sozinho entre "abaixo do
   limiar" e "congela". Não existe mapeamento de palavra para escala, nem no programa nem na
   base.
7. **A base tem quase nada sobre procurar avaliação presencial.** A consulta por
   `doctor|diagnos|MRI|surgeon` devolve **zero**. O §7 abaixo é, portanto, critério do
   desenho — não citação.

**O contrapeso, porque não dramatizar também é obrigação.** A base é maciça e consistente
em que dor não equivale a dano (`V001-20`, `fato`: *"we can have pain with absolutely no
damage"*), em que medo de movimento **aumenta** risco de lesão e de dor (`V150-16`,
`estudo`), e em que catastrofizar piora o desfecho (`V138-20`). Nada aqui autoriza tratar
"levemente dolorido" como emergência.

---

## 7. QUANDO ISTO VIRA CONVERSA COM FISIOTERAPEUTA

Critério concreto — prazo, tendência e sinal. **"Se piorar" não é critério**, porque o modo
de falha que a base descreve (`V027-25`) é justamente o que **não** piora: dói pouco, dá
para treinar, e some o ano.

**Marque agora, sem esperar sinal nenhum, se qualquer uma for verdade hoje:**

- a dor está **presente em repouso** no lado de uma ruptura prévia — **é o seu caso hoje**;
- houve fisgada aguda em qualquer momento, com qualquer intensidade;
- há perda de força perceptível, ou assimetria visível entre os lados.

**Marque em até 7 dias se, com os números diários do §1.1 na mão:**

- o número em repouso **não caiu** em 7 dias — platô conta como falha, não só piora
  (`V027-28`, `prescricao`);
- ou ele **subiu** em qualquer dia acima do valor de hoje;
- ou você precisou evitar um movimento comum do dia a dia por causa dele.

**Se você retomar o supino, pare e marque quando:**

- o número **na sessão seguinte** for maior que o da anterior — este é literalmente o limiar
  que a base define (`V138-18`, `prescricao`: *"we don't feel worse **the next session**"*);
- ou a dor aparecer **dentro** de uma série, e não só antes ou depois. A base **não tem
  nada** sobre dor que aparece dentro da série — zero claims —, e o app não tem campo para
  registrá-la. Sinal sem instrumento e sem literatura é sinal para levar a um profissional,
  não para autorregular.

**Antes de qualquer reexposição em comprimento máximo** — o supino pausado, o halter
inclinado, o peck deck — a decisão de reexpor um tecido com histórico de ruptura e sintoma
presente pede avaliação presencial. **Isto é recomendação, não rodapé.**

---

## 8. AS PROPOSTAS — o que eu NÃO fiz, e por quê

### 8.1 A invariante dos dois pares — **DECIDIDO: opção C, pelo atleta, em 13/08/2026**

✅ **IMPLEMENTADO.** O atleta escolheu a **opção C**. O 2º degrau do §1.2 do `PROGRAMA.md`
passou a nomear `PEC-SETS`, e o `generated.ts` foi regerado; `npm run check:gate` verde,
62 cenários. As opções A e B ficam abaixo **como registro do que foi recusado e por quê** —
não são trabalho pendente. As duas ressalvas que a redação original desta seção fazia à C
**caíram na medição, e as duas caíram a favor dela**:

- *"só funciona da S6 em diante, antes disso `PEC-SETS` não tem valor anterior"* — **falso**.
  A curva é `PEC-SETS` = 1 (S1–S5), 2 (S6–S13), 3 (S14–S16) e **0 na S17**. O piso 0 já é
  valor de produção, então nas S1–S5 o recuo é 1 → 0: sai o bloco de peitoral isolado
  inteiro, −2 séries, e todo o supino de barra fica de pé.
- *"−2 séries é menos do que a base pede"* — verdade, mas o denominador estava errado.
  `PEC-SETS` não é *um* eixo entre vários: `total = 22 + 2 × PEC-SETS`, logo ele é o
  **único** eixo que move o total. −2 é tudo o que existe para tirar sem tocar na barra.
- **Um brinde não previsto:** `PEC-RPE = 5 + PEC-SETS` (`PROGRAMA.md:309`), então o recuo
  baixa o teto de esforço junto, de graça — 7 → 6 nas S6–S13, 8 → 7 nas S14–S16.

⚠️ **E uma promessa desta seção que eu preciso desmentir, porque ela era minha.** Escrevi
que a tabela *"é lida por máquina, então o app acompanha no mesmo passe"*. É verdade pela
metade: `scripts/gate-dor.mjs:27` casa **só o verbo** (`/recua um degrau/i`) e **nunca
extrai o eixo**. O texto do eixo viaja inteiro para dentro da bandeira que aparece na tela —
confirmado em `generated.ts:656` —, mas **o app não executa o recuo**, ele o anuncia. Quem
executa é o atleta, à mão, nas duas linhas de `peito_alongado` de D5. Como
`trainingMaxProgression.ts` está sem chamador (§4), execução manual é o regime de tudo neste
bloco, e nada foi perdido em relação a A ou B — mas "o app acompanha" era mais do que o
código faz.



O problema, em uma frase: `FP-SETS = 7 − SUP-V1` e `FP4-SETS = 5 − SUP-V4` amarram **dois
pares** em soma constante — `FP-SETS + SUP-V1 = 7` e `FP4-SETS + SUP-V4 = 5`, medido, em
todas as S1–S16 sem exceção —, então recuar supino pausado troca a série por floor press
**1:1** e nunca reduz carga sobre o peitoral.

⚠️ **Corrigido em 13/8/2026.** Esta seção se chamava *"a invariante das 22 séries"* e dizia
que as duas derivações *"amarram o total em 22 por construção"*. **O total não é invariante
e nunca é 22.** Medido no programa gerado, contando as séries de trabalho de todo exercício
que carrega peitoral (supino pausado, floor press, supino inclinado com halter, peck deck),
a curva **sobe** ao longo do bloco: **24** nas S1–S5, **26** nas S6–S13, **28** nas
S14–S16 — de 24 a 28 séries/semana, porque `PEC-SETS` rampla 1 → 2 → 3 em cada uma das duas
linhas de trabalho direto. O 22 era o subtotal só das duas linhas de **barra**, esse sim
invariante nas 16 semanas, e foi lido como se fosse o total.
Reprodução: `node research/tools/auditoria-peito/series-peito.mjs`.
**O que a correção NÃO muda:** as duas somas de par são invariantes, o recuo é 1:1, e
portanto as três opções abaixo continuam sendo as três saídas, com o mesmo custo cada uma.

Três desenhos possíveis, com o custo de cada um. **Nenhum foi implementado.**

**Opção A — o par derivado passa a ter uma folga de recuo.**
`FP-SETS = max(0, 7 − SUP-V1 − RECUO)`, com `RECUO` sendo uma coluna nova do eixo
`exposicao_peito` que vale 0 normalmente e 1 enquanto o gate estiver disparado. Efeito: um
recuo tira **1 série real** por par, 2 no total (D1+D4). Custo: uma coluna nova no bloco
`eixos`, um ajuste no `checkDerivacoes` do gerador, e a regra R3 (*supino ≥ 22
séries/semana*) passa a ser violada nas semanas de recuo — o que exige que R3 ganhe uma
exceção declarada, ou o build reprova.

**Opção B — o gate deixa de recuar por eixo e passa a recuar por total.**
O degrau vira *"reduza o total de barra sobre o peitoral em N séries, tirando primeiro do
back-off de D2"*. É o desenho que mais se aproxima do que a base manda (`V138-18` +
`V001-09`: peso, proximidade da falha e volume juntos). Custo: é a mudança maior — o gate
hoje é um congelador de colunas, e isso o transforma num modificador de prescrição. Exige
que o módulo de progressão do TM passe a ser efetivamente chamado (§4, item 5).

**Opção C — não mexer na grade e mudar o degrau.**
Trocar o texto do 2º degrau de *"recua um degrau do eixo que mudou mais recentemente"* para
*"recua `PEC-SETS`"* — que é, medido, o único eixo cujo recuo remove séries de verdade (−2,
em 11 semanas). É a mudança de **uma linha da tabela**, e ela é lida por máquina, então o
app acompanha no mesmo passe. Custo: só funciona da S6 em diante (antes disso `PEC-SETS` não
tem valor anterior), e −2 séries de peck deck/inclinado é menos do que a base pede.

**A minha leitura, que é leitura e não decisão:** a **C** é barata e honesta e para de
mentir; a **B** é a que a base descreve; a **A** é meio-termo com o custo escondido na regra
R3. Você escolhe, e depois disso alguém implementa **com você olhando**.

### 8.2 Dor em repouso — o campo, com o diff descrito. **Não implementado.**

Deliberadamente **sem nenhuma mudança de comportamento do gate**: este registro **não** entra
na janela de 3 sessões, **não** dispara degrau e **não** consome vaga. Ele só para de perder
o dado.

```
1. src/types/index.ts
   `RestPainLog` e `RestPainContext` JÁ EXISTEM. Nada a fazer.

2. src/services/storage/restPainRepository.ts                              [ARQUIVO NOVO]
   Espelha surveyRepository.ts, mas indexa por `date` + `context`, não por `workoutId`.
   save(log) / listByWeek(programId, weekNumber) / listByRange(from, to)

3. src/services/sync/rollupTypes.ts
   + restPain?: {
   +   n: number;
   +   byContext: Record<RestPainContext, { n: number; maxIntensity: number }>;
   +   peakByRegion: { region: PainRegion; occurrences: number; maxIntensity: number }[];
   + };
   (reintroduz o import de RestPainContext, removido neste passe justamente porque
    o campo não existia e o comentário do esquema mentia dizendo que existia)

4. src/services/sync/weeklyRollup.ts
   + buildRestPain(logs)  →  WeekDoc.restPain
   NÃO tocar em buildGateReadings. A separação é o ponto.

5. src/services/FirestoreStorageService.ts
   saveRestPainLog marca a semana como suja — hoje só treino e survey de treino
   marcam, e é por isso que uma semana sem treino nem chega a ser reescrita.

6. src/domain/painGate.ts
   `describeRestPain` e `describeReturnWithRestPain` JÁ EXISTEM e não têm chamador.
   Passam a ser chamadas por buildFlags, produzindo uma bandeira PRÓPRIA:
   "DOR EM REPOUSO — fora do escopo da tabela do §1.2; N registro(s), pico X/10".
   Anuncia; não atua.

7. src/features/…/RestPainSheet.tsx                                        [ARQUIVO NOVO]
   Reaproveita o PainSelector que já existe. Entrada pelo Dashboard, sem treino.

8. scripts/check-pain-gate.test.mjs                                        [CENÁRIO NOVO]
   O cenário que MATA o conserto: um RestPainLog de 5/10 na semana NÃO pode
   alterar gate.readings, gate.weeks nem degrau nenhum. Sem essa trava, a
   separação some no primeiro refactor.
```

### 8.3 O que **foi** feito neste passe (instrumentação, nada de treino)

1. **A trava de endereços que faltou por seis ondas.** `check-evidence.mjs` passou a
   enxergar o formato `[Rnn @mm:ss]` — antes ele descartava esse formato **em silêncio**, e
   é literalmente por isso que os endereços errados do §1.2 sobreviveram. Nasceu junto
   `research/tools/check-enderecos.mjs`, que varre **todo** endereço do `PROGRAMA.md` e
   **reprova o build** se algum apontar para lugar nenhum. Hoje: 264 endereços, 264
   resolvem. A tolerância (±7 s) é **medida** do passo da grade da base, não chutada — o
   teste de igualdade exata condenaria 230 de 263 endereços corretos, e uma onda anterior
   caiu nessa armadilha.
2. **Os endereços errados do §1.2, corrigidos um a um**, com `scope` e `modo` escritos ao
   lado: `[R79 @03:35]` → `V079-34` `[R79 @03:47]`, **`GERAL`/`prescricao`** (o §1.2 o
   chamava de `[PESSOAL]`, e esse rótulo falso era o **único** argumento escrito para adotar
   2/10 em vez de 2–3/10); `[R1 @01:04]`, que servia a **duas** claims com `modo` diferente
   → `V001-06` `[R1 @01:00]` (`prescricao`) e `V001-08` `[R1 @01:30]` (**`opiniao`**);
   `[R27 @05:08]` → `V027-25` `[R27 @05:21]`; `[R95 @03:10]` → `V095-23`/`V095-24`
   `[R95 @03:16]`; `[R112 @02:10]` → `V112-14` `[R112 @02:16]`. O mesmo erro do `[R1 @01:04]`
   estava também no §1.1, apontando para o bloco do limiar de dor quando a claim usada é
   `V001-08` — corrigido, e a consequência declarada: **as duas metades do documento que
   amortecem o primeiro sinal estão ancoradas na mesma opinião.**
3. **A regra do bíceps** ficou marcada no `PROGRAMA.md` como **decisão de desenho**, não
   derivação (§5.1).
4. **O comentário mentiroso do esquema de rollup** foi corrigido: ele anunciava
   `WeekDoc.restPain` como pronto, e o campo não existe.
5. **O build voltou ao verde.** Estava vermelho no estado commitado: primeiro em
   `check:gate`, e depois — assim que o gate passou — em dois erros de tipo que o gate
   vermelho escondia, um deles justamente o campo `acute` do estiramento agudo, que
   trafegava em runtime enquanto o tipo dizia que não existia.

**Nada de produção que mude prescrição foi tocado.** Duas coisas de código mudaram: um
comentário e dois tipos que estavam mentindo.

---

## 9. COMO CONFERIR TUDO ISTO

```
node research/tools/auditoria-peito/conferencia-curva.mjs     # a curva, as 22, o recuo eixo a eixo
node research/tools/auditoria-peito/curva-peito.mjs --linhas  # toda linha do bloco, com kg
node research/tools/auditoria-peito/sonda-gate-hoje.mjs       # o que o gate faz hoje, 4 cenários
node research/tools/check-enderecos.mjs --verbose             # todo endereço do programa
node research/tools/check-evidence.mjs V138-18 V138-04 V138-15 V001-06 V001-08 V001-09 \
     V079-34 V086-21 V086-22 V027-23 V027-25 V027-26 V027-28 V089-24 V089-25 \
     V095-23 V095-24 V108-27 V112-14 V138-19 V138-23 V138-28 V150-16 V001-20
node research/tools/check-evidence.mjs "[R79 @03:47]" "[R1 @01:30]" "[R112 @02:16]"
npm run build            # verde
npm run check:kb         # verde
npm run check:gate       # verde, 33 testes + 62 cenários
```

---

**Este parecer foi produzido por agentes lendo uma base derivada de vídeos de um canal de
YouTube, foi atacado por um agente adversarial que derrubou parte do que a versão anterior
afirmava, e não é avaliação clínica. Ninguém aqui é fisioterapeuta.**
