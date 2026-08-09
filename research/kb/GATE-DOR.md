# Gate de dor de peitoral — do `if` divergente à fonte única

Relatório do conserto do achado mais grave do dia. É de segurança: o atleta tem
histórico de lesão de peitoral, o Bloco 1 inteiro foi desenhado em torno de um
protocolo de reexposição gradual do supino, e o gate que governa esse protocolo
**não conseguia disparar**.

O que este documento **não** é: uma cópia da tabela do §1.2. Ela mora em
`src/data/program/vena-block1/source/PROGRAMA.md` e agora é lida por máquina —
copiá-la aqui recriaria exatamente o problema que este trabalho fechou. Aqui está
o diagnóstico, as decisões, o desenho da trava, e o que **não** foi consertado.

---

## 1. O defeito, medido

Três coisas, e as três precisavam ser verdade ao mesmo tempo para o gate morrer.

| | antes | depois |
|---|---|---|
| região de peitoral no enumerado `PainRegion` | **não existia** | `left_chest`, `right_chest` |
| intensidade que levanta bandeira no rollup | `>= 6/10` (ou 3 ocorrências) | `>= 2/10` no peitoral, lida do §1.2 |
| onde o limiar vivia | prosa no `PROGRAMA.md` **e** um `if` em `weeklyRollup.ts` | só na tabela do §1.2 |
| cópias do enumerado de rótulos | **3** (`painRegions.ts`, `useSurveyTrends.ts`, `weekly-briefing.mjs`) | 1 |

O programa manda **congelar `TM_supino` e o degrau de exposição a partir de
1 evento ≥2/10**. O app não reagia antes de 6/10 — três vezes o limiar — e, como
não havia região de peitoral, uma fisgada no peito só cabia em `other`, onde
ficava indistinguível de dor de punho. O gate estava desligado nas duas pontas
ao mesmo tempo: pelo valor e pela chave.

As três cópias do enumerado de rótulos são a mesma doença em outra forma, e a que
mais assusta: `useSurveyTrends.ts` e `weekly-briefing.mjs` teriam continuado
imprimindo `left_chest` cru — a chave, não o rótulo — **exatamente** na região que
o gate governa, sem nenhum erro de compilação.

---

## 2. Caminho completo da dor, mapeado antes de mexer

O enunciado citava três arquivos. São nove, e dois deles não apareceriam numa
busca por `PainRegion`.

```
PainSelector.tsx ── usePreSurvey / usePostSurvey ── surveyRepository
      │                                                   │
      │                                          LocalStorageService / OPFS
      │                                                   │
      └──> PainEntry{region,intensity} ──> sessionRollup.ts ──> SessionDoc.pre.pain
                                                                SessionDoc.post.newPain
                                                                     │
                                              weeklyRollup.ts ──> WeekDoc.pain + WeekDoc.flags
                                                                     │
                                        Firestore (athletes/{uid}/…) ──> weekly-briefing.mjs
                                                                     │
                                                    useSurveyTrends.ts (alertas na UI)
```

Achados do mapeamento que mudaram o plano:

- **Firestore não valida o enumerado.** `firestore.rules` autoriza por dono do
  `uid` e não olha forma de documento. Acrescentar região não exige migração de
  regra, e — o outro lado da mesma moeda — o banco nunca teria reclamado de um
  valor inválido.
- **Não há versionamento de dado de dor.** `ROLLUP_SCHEMA_VERSION` cobre a forma
  do rollup, não o enumerado; `pl_schema_version` no `LocalStorageService` não
  tem migração escrita para isto. Nada quebra ao ampliar o enumerado, e nada
  conserta o que já foi gravado.
- **`useSurveyTrends.ts` era um segundo avaliador de dor**, com limiar próprio
  (3 ocorrências) e tabela de rótulos própria. Não estava no enunciado.
- **`scripts/weekly-briefing.mjs` era o terceiro.**
- **Não existe dado gravado no repositório.** Nenhum fixture, seed ou export: o
  histórico do atleta vive só em Firestore/OPFS, fora do alcance deste passe.

---

## 3. Decisões

### 3.1 `left_chest` / `right_chest`, e não `chest`

Lateralizado, por três razões e uma ressalva.

1. **É o padrão do enumerado.** Tudo que é par já é lateralizado — joelho, ombro,
   quadril, cotovelo, punho. Um `chest` único seria a exceção, e exceção em
   enumerado é o começo da próxima divergência.
2. **A lesão é unilateral.** Ruptura e tendinopatia de peitoral acontecem de um
   lado. Saber o lado é o que distingue *recidiva do lado lesionado* de *dor nova
   do outro lado* — e essas duas leituras levam a decisões diferentes na conversa
   semanal.
3. **Colapsar destrói informação; agregar não.** De `left`+`right` sempre se
   deriva "peitoral"; do "peitoral" nunca se recupera o lado.

**A ressalva, e ela foi tratada:** o gate do §1.2 conta **eventos de peitoral**,
não eventos de lado. Se cada lado contasse sozinho, dois eventos de 2/10 em lados
diferentes contariam como um evento de cada — e o degrau de recuo, que exige dois
eventos, nunca sairia. Por isso `painGate.ts` **lateraliza o registro e agrega o
gate**: o pico da sessão é o maior valor entre os dois lados, e a contagem soma os
dois. Há teste para exatamente esse caso ("os dois lados somam no mesmo tecido").

**Ordem de exibição:** peitoral vem **primeiro** na grade de botões. É o tecido
lesionado e a única região com gate formal; região que exige registro fiel não
pode estar no fim de uma lista de 16 botões. Rótulos: `Peitoral Esq` /
`Peitoral Dir`.

**Bíceps não virou região, de propósito.** O §1.2 manda: *"dor referida na região
do bíceps entra no log de peitoral até prova em contrário"* `[R95 @03:10]`
`[GERAL]` — cerca de 90 % das "dores de bíceps" em powerlifters são tendinite de
peitoral, porque o tendão se insere perto. Abrir uma gaveta `bicep` faria o
registro correto escapar do gate. Em vez disso a instrução foi para onde o dedo
está: uma linha na `PainSelector`, junto dos botões.

### 3.2 Limiar por região, não global

**Por região.** Baixar o limiar global para 2/10 faria a bandeira subir em quase
toda semana de treino pesado — joelho e lombar a 2–3/10 são ruído de fundo num
bloco de força. Bandeira que sempre sobe é bandeira que ninguém lê, e o valor de
`buildFlags` é ser curta.

E é importante nomear o que aconteceu: **foi esse raciocínio, aplicado sem
exceção, que enterrou o peitoral atrás de 6/10.** O 6/10 não é um erro de
digitação; é uma heurística razoável aplicada onde existia prescrição. A correção
não é abandonar a heurística — é reconhecer que **onde o programa fala, o programa
manda**, e a heurística só governa o silêncio.

Ficou assim:

- **peitoral** — limiar do §1.2, lido da tabela. Nenhum número em código.
- **`other`** — limiar do §1.2 também, com mensagem própria (§3.3).
- **todo o resto** — `painFlagDefault` (3 ocorrências ou pico 6/10), declarado em
  `painGate.ts` e comentado como **heurística do app, não prescrição**. Não existe
  tabela para joelho, e fingir que existe seria inventar programa.

### 3.3 A gaveta `other` fica no limiar do gate

Todo registro anterior a esta revisão que fosse dor de peito **está em `other`**,
e `PainEntry` não guarda texto livre para desambiguar. A gaveta é ambígua por
construção.

Enquanto isso for verdade, `other` é avaliado no limiar do gate — mas com
mensagem separada, porque é **suspeita**, não evento confirmado: *"a gaveta 'Outro'
não distingue peitoral; confirme a região antes de descartar o gate §1.2"*. Não
entra na contagem de eventos do gate e não dispara degrau.

O custo de errar aqui é assimétrico: falso positivo custa uma linha de bandeira,
falso negativo custa o peitoral. É a mesma lição da migração de gramas para `kg` —
**faltar gaveta é pior que ter gaveta demais**, e a gaveta que faltava era esta.

---

## 4. O conserto de verdade: um objeto só

Antes, o gate existia em dois lugares que não se comparavam:

```
PROGRAMA.md §1.2 (prosa)          weeklyRollup.ts
   "1 evento ≥2/10 congela"   ✗    if (p.maxIntensity >= 6)
```

Agora existe em um, com o código pendurado nele:

```
PROGRAMA.md §1.2 ── TABELA (fonte única, nenhum limiar duplicado)
        │
        ├─ scripts/gate-dor.mjs ........... lê a tabela; grammar rígida
        │        │
        │        ├─ build-vena-block1.mjs ─> VENA_BLOCK1_PAIN_GATE (generated.ts)
        │        │                                  │
        │        │                          src/domain/painGate.ts
        │        │                                  │
        │        │                   weeklyRollup · PainSelector · useSurveyTrends
        │        │
        └────────┴─ scripts/check-pain-gate.mjs ── exercita buildWeekDoc REAL
                                                   contra a tabela, no build
```

**Nenhum limiar é digitado em código.** Não há o que editar em `painGate.ts`:
todos os números vêm de `VENA_BLOCK1_PAIN_GATE`, que o gerador extrai da tabela.
Mudar `≥2/10` para `≥3/10` na tabela muda o app no mesmo passe, ou o build cai.

### 4.1 O parser é rígido de propósito

`scripts/gate-dor.mjs` exige a gramática da tabela (`≥N/10`, `N eventos`,
`em N sessões`, `≤N/10`, e os verbos `congela` / `recua um degrau` /
`encerra a sessão`) e reprova:

- linha de tabela não reconhecida, ou degrau faltando;
- degrau duplicado, ou conjunto diferente dos três declarados;
- limiar fora da escala declarada no próprio §1.2;
- **ordem invertida** — encerrar a sessão num limiar ≤ o de congelar;
- pico de retorno que alcance o limiar de congelamento;
- degrau que exige N>1 eventos sem declarar a janela de sessões.

Reformatar a tabela **quebra o build** em vez de silenciosamente deixar de
reconhecer um degrau. Faltar degrau é o modo de falha caro: o gate deixaria de
disparar sem ninguém notar, que é literalmente o que aconteceu.

Uma nota em caixa alta foi acrescentada logo abaixo da tabela no `PROGRAMA.md`
avisando que ela é lida por máquina — o documento e a trava mudaram no mesmo
passe, porque são um objeto só.

### 4.2 A checagem compara tabela contra COMPORTAMENTO

`npm run check:gate` (ligado ao `npm run build`, entre `check:notes` e
`check:kb`) faz duas coisas, e a segunda é a que vale:

1. confere que `VENA_BLOCK1_PAIN_GATE` é o que a tabela diz **agora**;
2. monta semanas sintéticas e roda o **`buildWeekDoc` de produção** — não uma
   reimplementação da regra — exigindo que a bandeira produzida seja exatamente o
   degrau que a tabela manda, em 18 cenários:
   - **toda** intensidade da escala declarada (0 a 10), um evento, incluindo o
     silêncio abaixo do limiar;
   - a janela `N eventos em M sessões` nos **dois** sentidos: dispara dentro,
     não dispara fora;
   - cada região de peitoral do enumerado, e um lado de cada dentro da janela;
   - região fora do gate não dispara o gate;
   - `other` não se passa por peitoral, mas não fica muda.

As entradas dos cenários são **derivadas da tabela** (limiar, limiar−1, número de
eventos, tamanho da janela). Trocar o número na tabela troca o teste.

Para o `buildWeekDoc` real rodar dentro de um script Node existe
`scripts/ts-resolve.mjs`: um gancho `module.registerHooks` que resolve import
extensionless para `.ts`. Sem ele, uma checagem de build só alcançaria módulos
sem nenhum import — e a checagem valiosa é justamente a que exercita o código de
produção.

### 4.3 A checagem prova que está viva

`scripts/check-pain-gate.test.mjs`, 16 casos. Os dois exigidos:

- **o gate dispara** — registro de dor de peito 2/10 numa única sessão levanta a
  bandeira, e ela manda congelar;
- **a checagem reprova** — a tabela é adulterada numa cópia do markdown e
  `check-pain-gate.mjs` tem de sair diferente de zero.

A mutação sobe o limiar de 2 para **3**, não para 5. Uma mutação grosseira é
barrada pelas travas de sanidade do parser (5 > 4 inverte a ordem dos degraus) e
provaria só que o parser existe — não que a comparação com o comportamento
funciona. Com 3, a tabela continua internamente coerente e a única coisa que a
denuncia é o app disparando a 2/10 onde a tabela mandou silêncio.

E há a flag `--no-generated-check`, que existe **só para o teste**: com ela, a
comparação tabela↔constante é desligada e o braço tabela↔comportamento tem de
reprovar **sozinho**. Sem esse caso, o braço comportamental poderia estar morto
com a suíte inteira verde, escondido atrás da comparação de constante. O teste
ainda exige que a saída contenha `produzido pelo app`, para não aceitar uma
reprovação vinda de outro lugar.

---

## 5. O que NÃO foi consertado

Cinco coisas. As duas primeiras são limites de dado; as três últimas são escopo.

### 5.1 Os registros históricos em `other` não foram reclassificados

**Não dá, e tentar seria pior.** `PainEntry` é `{region, intensity}` — não há
texto livre, data de sintoma nem nada que permita decidir se um `other` de
março era peitoral ou punho. Reclassificar seria adivinhar, e adivinhar num
registro de segurança é fabricar evidência.

Mitigação implementada: `other` passa a ser avaliado no limiar do gate com
mensagem que aponta para o §1.2 (§3.3). Não recupera o passado; garante que
qualquer `other` relevante seja olhado.

**Recomendação para a conversa semanal:** varrer manualmente os `other` já
gravados junto com o atleta, uma vez, e anotar o que era peitoral. É trabalho de
humano com memória, não de migração.

### 5.2 `estiramento agudo` não tem campo

A tabela lista *"≥4/10 **ou estiramento agudo**"*. O segundo gatilho é
qualitativo e **não existe campo no app para registrá-lo** — o parser o lê e o
guarda em `estiramentoAgudo`, mas nenhum caminho de dado o alimenta. Um
estiramento agudo hoje só chega ao sistema se o atleta também marcar intensidade
≥4/10, o que é provável mas não é garantido.

Não consertei porque exige um campo novo na pesquisa pré/pós e a decisão de UI
que vem junto (um toggle? um tipo de dor?). Está declarado na constante gerada
para que a lacuna seja visível em vez de esquecida.

### 5.3 Sessão que devia colher o log e não colheu não é detectada

> ⚠️ **PARCIALMENTE FECHADO na revisão do §7.** O rollup passou a distinguir
> sessão de supino de sessão sem supino, e a omissão do log deixou de ser
> totalmente muda. O que continua aberto está no §7.6. O texto abaixo é o
> diagnóstico original.

O §1.2 manda colher o log em **toda sessão que contenha supino ou peitoral**, em
três momentos. O rollup só enxerga o que foi registrado: uma sessão de supino sem
nenhum log de peitoral é indistinguível de uma sessão sem supino.

Detectar isso exige o rollup saber quais sessões continham supino/peitoral. O
dado existe (`SessionDoc.volumeByMuscle`, e o campo `conta` do bloco ```papeis```
tem `supino_pausado`, `supino_acessorio`, `peito_alongado`), mas amarrar as duas
coisas é uma classificação nova de exercício, e classificação inventada às pressas
num arquivo de segurança é como o `other` nasceu. Fica registrado como o próximo
passo óbvio, e é o buraco mais relevante que sobra: **omissão de log ainda passa
em silêncio.**

### 5.4 Os três momentos não são distinguidos

O programa pede **pré-sessão · 1ª pausada com carga de trabalho · pós-sessão**. O
app tem `pre` e `post`; a leitura do meio não tem onde morar. O gate usa o pico da
sessão, o que é conservador (o pico é o maior dos momentos colhidos), mas a
leitura intra-sessão — a mais informativa das três, porque é a que acontece com o
tecido sob carga — simplesmente não é coletada.

### 5.5 O gate não age, só sinaliza

`buildFlags` produz "onde olhar primeiro"; nada no app congela `TM_supino` ou
trava o degrau de exposição sozinho. Isso é **deliberado e consistente com o resto
do sistema** — a conversa semanal decide, o app não altera prescrição — mas
significa que o gate depende de alguém ler a bandeira. A trava do
`trainingMaxProgression` já tem um caminho para "leitura inválida para subir";
ligar o veredito do gate a ele é trabalho de outro passe, com o cuidado de não
transformar um sinalizador em atuador sem que essa decisão seja tomada
explicitamente.

### 5.6 Escala 1–10 na UI contra 0–10 no programa

`ScaleSelector` na `PainSelector` vai de 1 a 10; o §1.2 declara escala 0–10. Na
prática 0 é "sem dor", que já é o botão NÃO, então nenhum valor é inalcançável.
Deixei como está para não mexer num componente compartilhado por outras
pesquisas, mas a escala declarada **é** verificada pelo parser contra os limiares,
então uma tabela que use um limiar 0 quebraria o build em vez de virar um botão
inexistente.

---

## 6. Inventário do que mudou

**Fonte do programa**
- `src/data/program/vena-block1/source/PROGRAMA.md` — nota abaixo da tabela do
  §1.2 declarando que ela é lida por máquina, com a gramática exigida e o motivo
  (as duas coisas já divergiram). A tabela em si **não** foi alterada.

**Geração e travas**
- `scripts/gate-dor.mjs` — **novo.** Lê a tabela do §1.2; travas de sanidade.
- `scripts/build-vena-block1.mjs` — emite `VENA_BLOCK1_PAIN_GATE`.
- `src/data/program/vena-block1/generated.ts` — regenerado.
- `scripts/check-pain-gate.mjs` — **novo.** Tabela ↔ comportamento do
  `buildWeekDoc` real, 18 cenários.
- `scripts/check-pain-gate.test.mjs` — **novo.** 16 casos, metade provando que a
  checagem reprova quando deve.
- `scripts/ts-resolve.mjs` — **novo.** Gancho de resolução para os scripts
  alcançarem os módulos `.ts` do app.
- `package.json` — `check:gate`, ligado ao `build`.

**App**
- `src/types/index.ts` — `left_chest` e `right_chest` em `PainRegion`, com o
  porquê da lateralização.
- `src/domain/painRegions.ts` — rótulos e ordem de exibição; peitoral primeiro.
- `src/domain/painGate.ts` — **novo.** Único consumidor do gate. Escopo por
  região, limiar por região, avaliação de degrau com janela deslizante.
- `src/services/sync/weeklyRollup.ts` — `buildGateReadings` + veredito do gate nas
  bandeiras; heurística geral rebaixada ao que ela é.
- `src/features/survey/components/PainSelector.tsx` — instrução do bíceps e aviso
  do gate no ponto de digitação.
- `src/features/feedback/hooks/useSurveyTrends.ts` — segunda cópia dos rótulos
  eliminada; alerta de peitoral no limiar do gate.
- `scripts/weekly-briefing.mjs` — terceira cópia dos rótulos eliminada.

`npm run build` passa.

---

## 7. Revisão de 9/8/2026 — a janela deixou de truncar na virada de semana

O §4 fechou a divergência entre a prosa e o `if`. Sobrou o defeito que a tabela
não tem como declarar sozinha: **a janela de "3 sessões" era contada dentro da
semana do calendário**, e a semana do calendário não é unidade nenhuma para o
§1.2.

### 7.1 O defeito, reproduzido antes de consertado

Dois cenários com o **mesmo espaçamento** — evento, uma sessão de supino colhida,
evento — mudando só onde cai a fronteira da semana:

| cenário | antes | depois |
|---|---|---|
| os três dentro da mesma semana | `recua um degrau` | `recua um degrau` |
| o primeiro evento na S1, o segundo na S2 | **`congela`** — o recuo nunca saía | `recua um degrau` |

Com supino 4×/semana, cerca de **1 em cada 4 pares qualificados** cai de lados
diferentes da fronteira. O degrau que a tabela manda tirar simplesmente não saía,
e nada no app dizia que faltava alguma coisa.

Os dois cenários foram escritos **primeiro**, e o segundo foi visto falhar antes
de qualquer linha de produção ser tocada — estão em `check-pain-gate.test.mjs`
como `controle: … DENTRO da mesma semana recua` e `o mesmo espaçamento
ATRAVESSANDO a virada de semana também recua`. Bug não reproduzido é bug que
talvez não exista.

**A reprodução achou um segundo defeito, na direção oposta.** `buildGateReadings`
só produzia leitura para sessões que registraram dor. Uma sessão de supino
**sem dor nenhuma** não existia para a janela — então dois eventos separados por
um mês de treino limpo continuavam contando como *"2 eventos em 3 sessões"*, e o
degrau de recuo saía onde a tabela manda silêncio. Um defeito escondia o outro:
a janela era curta demais no tempo e longa demais em sessões.

### 7.2 A janela é de SESSÕES DE SUPINO — como isso foi resolvido, e por quê

A pergunta que faltava responder era *"o que é uma sessão de supino?"*. Três
candidatos, e só um não inventa nada:

1. **dias** — errado por construção: o §1.2 não fala de dias, e um deload longo
   apagaria a janela;
2. **sessões que registraram dor** — o que existia. Faz uma semana de deload não
   consumir a janela (não há dor a registrar), mas também faz um mês limpo não
   consumir, que é o segundo defeito do §7.1;
3. **sessões que carregaram o peitoral** — `SessionDoc.volumeByMuscle['peito'] >
   0`. É a classificação que **já existe**: o `muscleMap` do registro de
   exercícios já declara `peito` para supino de competição, floor press,
   crucifixo e peck deck. Nenhum exercício foi reclassificado aqui.

Foi o 3, com uma ressalva que é a regra da casa aplicada ao caso: **evento
colhido nunca é descartado por causa da classificação do dia.** Uma sessão entra
na janela quando

- carregou o peitoral **e** colheu o log — mesmo sem dor, com `peak: 0`; **ou**
- registrou dor de peitoral, tenha o rollup visto volume de peitoral ou não.

O primeiro braço faz a sessão limpa consumir a janela. O segundo garante que uma
sessão abandonada, ou um exercício fora do registro, não faça uma fisgada de 2/10
desaparecer. **Faltar gaveta é pior que ter gaveta demais** — é a mesma lição da
migração de gramas para `kg`.

**Semana de deload sem supino não consome a janela**, e não por uma regra sobre
deload: porque não houve sessão de supino. Não existe nenhum `if` sobre `isDeload`
no gate, e não deve existir — o que governa é a exposição do tecido, não o rótulo
da semana. Há cenário para isso na trava (`semana sem supino entre os eventos não
consome a janela`) e teste no `check-pain-gate.test.mjs`.

### 7.3 A memória mora no `WeekDoc` — e o veredito, não

`WeekDoc.gate` tem três listas e **nenhum limiar**:

| campo | o que é | limite |
|---|---|---|
| `readings` | uma leitura por sessão de supino da semana que colheu o log | as sessões da semana |
| `carry` | a cauda das semanas anteriores que a janela ainda alcança | `gateWindowSessions − 1`, lido da tabela |
| `weeks` | o que cada semana recente observou: sessões de supino, quantas colheram o log, e o pico | `retorno.semanas`, lido da tabela |

**Só observação é persistida.** Se o documento gravasse "semana limpa: sim",
mudar o teto no markdown deixaria de mudar o app para tudo que já foi gravado — e
a tabela deixaria de ser a fonte única, que é exatamente a divergência que o §4
fechou. Os dois limites de tamanho também saem da tabela: o bloco não cresce, e
mudar o número no markdown muda quanto o documento guarda.

Três decisões dentro da avaliação, todas no lado conservador:

- **Degrau sem janela declarada continua lendo só a semana corrente.** `congela` e
  `encerra a sessão` não ganharam memória: a tabela não escreve por quanto tempo o
  congelamento vale, e inventar uma duração seria inventar programa.
- **Degrau com janela só dispara se ao menos um evento for desta semana.** Sem
  isso, o mesmo par de eventos seria reanunciado toda semana enquanto a cauda o
  alcançasse.
- **A bandeira diz quando a janela cruzou a fronteira** (`— a janela atravessa a
  virada de semana`), porque quem lê a bandeira precisa saber que um dos eventos
  é de antes de segunda-feira.

`buildWeekPayload` passou a reconstruir a cadeia de `gateLookbackWeeks` semanas
antes da corrente (hoje **3**, derivado da tabela) em vez de só a anterior — sem
isso o `prev` chega sem cauda e o conserto não vale para o segundo salto.

### 7.4 Migração: `ROLLUP_SCHEMA_VERSION` de 1 para 2

O que foi feito e o que **não** foi:

- **aditivo**: `WeekDoc.gate` é opcional. Nenhum campo foi removido, nenhum
  documento existente é reescrito, e nada foi apagado;
- **degrada, não quebra**: documento gravado na versão 1 não tem o bloco.
  `buildWeekDoc` trata a ausência como "sem histórico" e produz exatamente o
  comportamento anterior — janela truncada na semana, retorno indisponível. Há
  teste que apaga o campo de um documento e exige que a semana seguinte continue
  produzindo o degrau certo;
- **`firestore.rules` não foi tocado.** As regras autorizam por dono do `uid` e
  não olham forma de documento (§2), então campo novo não exige mudança de regra;
- **nenhum índice novo, nenhuma cobrança nova.** O bloco é escrito no mesmo
  `setDoc` do rollup semanal, e o `sanitize` do `syncEngine` já é genérico;
- **nada de migração destrutiva.** A versão 2 existe para que um consumidor futuro
  saiba se pode contar com o bloco, não para invalidar o que está gravado.

O custo real do bump é o declarado no comentário da constante: *"bumpar exige
reenviar tudo"* se alguém quiser o bloco preenchido no histórico antigo. O
reenvio já existe ("Reenviar tudo") e recalcula tudo do localStorage — não é
migração, é regeneração.

### 7.5 `RETORNO` deixou de ser decoração

A linha era parseada, emitida em `VENA_BLOCK1_PAIN_GATE` e **consumida por
ninguém**: trocar *"2 semanas"* por *"9 semanas"* passava verde e o app não
mudava. Com histórico entre semanas ela virou implementável, e foi implementada.

Uma semana só é limpa quando as **três** coisas valem — cada uma corresponde a um
jeito de *"pico ≤N/10 em todas as sessões de supino"* ser falso:

1. **houve sessão de supino**;
2. **todas elas colheram o log**;
3. **o pico ficou dentro do teto da tabela**.

A condição 1 é a mais discutível e a mais importante: **semana sem supino não é
semana limpa.** Ela não é evidência de tolerância, é ausência de evidência — e o
`RETORNO` é a **única** linha do §1.2 que aumenta carga sobre o tecido lesionado.
Aqui o erro barato é não subir; o erro caro é o peitoral. A condição 2 é a mesma
lógica: o que não foi medido não vira evidência, e a semana que só não é limpa
por causa de log faltando produz uma bandeira própria dizendo isso.

O app **não re-sobe degrau nenhum** — continua valendo o §5.5: ele diz que a
condição da tabela está satisfeita, e a conversa semanal decide. Ele também não
sabe se existe um degrau em baixa no momento (o app não guarda estado de degrau);
a bandeira afirma a condição, não o ato.

**A célula agora é presa pela trava, nos dois números.** Com a tabela adulterada
numa cópia e a comparação tabela↔constante desligada, o braço que compara tabela
contra COMPORTAMENTO reprova sozinho:

| mutação no §1.2 | cenário que denuncia | resultado |
|---|---|---|
| `2 semanas` → `3 semanas` | `semanas − 1` semanas limpas | app libera o retorno, tabela manda silêncio → reprova |
| `pico ≤1/10` → `≤0/10` | última semana com pico `picoMaximo + 1` | app declara limpa, tabela não → reprova |
| `2 semanas` → `0 semanas` | trava de sanidade do parser | reprova antes de gerar |

### 7.6 O que a trava cobre agora, e o que continua aberto

`npm run check:gate` são **45 cenários** derivados da tabela contra o
`buildWeekDoc` de produção, mais **33 casos** de teste, dos quais 10 provando que
a checagem reprova quando deve.

Fechado nesta revisão: a janela na virada de semana; a sessão de supino limpa
consumindo a janela; a semana de deload não consumindo; o `RETORNO`; e — parcial —
o §5.3, porque o rollup agora **distingue sessão de supino de sessão sem supino**
e a **omissão do log deixou de ser muda**.

Continua aberto, com o tamanho declarado:

- **§5.2 `estiramento agudo`** — segue sem campo na pesquisa. É a única célula da
  tabela que a trava não pode prender.
- **Omissão de log só é anunciada dentro da janela do `RETORNO`.** Uma sessão de
  supino sem log **não** bloqueia os degraus de agravamento e não aparece se a
  semana já estiver suja por outro motivo. Fechar isso de vez é decidir o que
  fazer com uma janela que tem buraco — e a resposta honesta ("tratar como
  desconhecido, não como zero") muda a semântica dos três degraus, o que é um
  passe próprio.
- **O alcance da cauda é de `gateLookbackWeeks` semanas** (3). Se o atleta passar
  mais de três semanas com uma única sessão de supino por semana, a leitura mais
  antiga da janela pode cair fora da reconstrução. É sobre-estimativa suficiente
  para 4 sessões/semana, que é o que o bloco prescreve, e é limite declarado, não
  esquecido.
- **§5.4 (os três momentos), §5.5 (o gate sinaliza, não age), §5.6 (escala 1–10 na
  UI) e §5.1 (os `other` históricos)** seguem exatamente como estão descritos.

### 7.7 Inventário desta revisão

**Fonte do programa**
- `src/data/program/vena-block1/source/PROGRAMA.md` — a nota abaixo da tabela do
  §1.2 dizia que o `RETORNO` não tinha comportamento; agora diz que tem, e declara
  que a janela é de sessões de supino e atravessa a semana. **A tabela não foi
  alterada** (só o hash do gerado mudou).

**Travas**
- `scripts/gate-dor.mjs` — sanidade nova: `RETORNO` com menos de 1 semana, e pico
  de retorno abaixo da escala declarada.
- `scripts/check-pain-gate.mjs` — cenários de virada de semana, de sessão limpa
  consumindo a janela, de semana sem supino, do `RETORNO` e do documento sem o
  bloco `gate`. 18 → 45 cenários.
- `scripts/check-pain-gate.test.mjs` — reprodução do defeito, `RETORNO`,
  degradação do documento antigo, e as duas mutações da célula do `RETORNO`.
  16 → 33 casos.

**App**
- `src/domain/painGate.ts` — `GateReading` ganhou `weekNumber`;
  `evaluatePainGate` recebe a cauda das semanas anteriores; `painGateMuscle`,
  `gateWindowSessions`, `gateLookbackWeeks`, `evaluateGateReturn` e as duas
  descrições do retorno.
- `src/services/sync/rollupTypes.ts` — `ROLLUP_SCHEMA_VERSION` 1 → 2 e
  `WeekDoc.gate` (opcional).
- `src/services/sync/weeklyRollup.ts` — `buildGateReadings` conta sessões de
  supino; `buildGateWeek` e `buildGate` montam a memória sobre a da semana
  anterior; `buildFlags` consome as duas regras.
- `src/services/sync/documentBuilders.ts` — `buildWeekPayload` encadeia
  `gateLookbackWeeks` semanas.

`npm run build` e `npm run check:gate` passam.

---

## 8. Auditoria por mutação do §7 — seis travas estavam mortas

O §7 entregou 45 cenários verdes. Verde não é evidência: **um cenário só vale se
reprovar quando o alvo dele é apagado**, e isso nunca tinha sido medido. Este
passe mediu, mutando o CÓDIGO DE PRODUÇÃO (não a tabela) e exigindo que
`npm run check:gate` reprovasse.

Nenhuma linha de produção foi alterada aqui. O defeito não estava no conserto do
§7 — estava na trava que dizia prendê-lo.

### 8.1 O que a auditoria achou

Nove mutações, uma por decisão que o §7 declara ter tomado. **Seis passaram
verde** — a suíte inteira, `npm run build` incluído, não reclamava:

| # | mutação na produção | antes | agora |
|---|---|---|---|
| M1 | `evaluatePainGate` ignora a cauda (o bug original de volta) | pega | pega |
| M2 | sessão de supino limpa volta a não consumir a janela | pega | pega |
| M3 | bandeira de `RETORNO` removida | pega | pega |
| M4 | **semana SEM supino passa a contar como limpa** | **verde** | pega |
| M5 | **sessão de supino sem log deixa de bloquear a semana limpa** | **verde** | pega |
| M6 | **degrau com janela deixa de exigir evento desta semana** | **verde** | pega |
| M7 | **cauda (`gate.carry`) sem teto** | **verde** | pega |
| M8 | **`buildWeekPayload` volta a encadear 1 semana** | **verde** | pega |
| M9 | **`gate.weeks` sem teto** | **verde** | pega |

45 → **52 cenários**. As nove mutações agora reprovam.

### 8.2 A pior delas: os dois cenários que reprovavam pelo motivo errado

M4 e M5 são as graves, e as duas falhavam do mesmo jeito.

O §7.5 declara que uma semana só é limpa quando **três** coisas valem: houve
sessão de supino, todas colheram o log, e o pico ficou no teto. Existiam
cenários nomeando as condições 1 e 2 — e os dois passavam por causa da
**condição 3**. Uma semana sem supino também não tem leitura nenhuma, então o
pico é `null`, e era `peak !== null` que reprovava. Apagar as condições 1 e 2 de
`semanaLimpa` não mexia em nada.

O cenário existia, tinha o nome certo, e não testava o que o nome dizia.

Isso importa mais que os outros cinco porque o `RETORNO` é a **única** linha do
§1.2 que **aumenta carga sobre o tecido lesionado**. Com M4 verde, uma semana de
deload — ou uma semana parada por causa da própria dor — contaria como evidência
de tolerância, e o app anunciaria a condição de re-subir o degrau tendo medido
exatamente **zero** exposições de peitoral. É o gate falhando para o lado caro.

O conserto foi dar controle **por sessão** aos cenários (`{ pain, chest, semLog }`
por sessão, não por semana). Só assim se monta uma semana que tem leitura, tem
pico dentro do teto, e mesmo assim não é limpa — que é o que isola cada
condição:

- **condição 1** — dor de peitoral registrada num dia SEM volume de peitoral:
  há pico, dentro do teto, e `benchSessions` é 0. Só a condição 1 pode reprovar;
- **condição 2** — semana MISTA: uma sessão de supino colhida e limpa, outra de
  supino sem log nenhum. Há pico, dentro do teto, e `loggedSessions <
  benchSessions`. Só a condição 2 pode reprovar. Este cenário também cobre um
  buraco de bandeira: a omissão do log sumia quando as outras sessões da semana
  tinham sido colhidas.

### 8.3 O cenário que eu escrevi errado primeiro

M6 (o degrau só dispara se um evento for desta semana) resistiu à primeira
tentativa. O cenário punha os dois eventos no **começo** da semana anterior — e a
cauda guarda só as últimas `janelaSessoes − 1` leituras, então ela levava **um**
evento, e o degrau não dispararia nem sem a trava. O cenário passava sem testar
nada.

Vale registrar porque é a mesma doença do §8.2 numa mutação diferente: **um
cenário verde não diz se o alvo existe.** Com os eventos no fim da semana a
cauda leva os dois, e a mutação morre.

### 8.4 Duas travas novas de tamanho, e uma de acoplamento

- **`gate.carry` e `gate.weeks` têm teto, e o teto sai da tabela** (M7, M9). O
  bloco `gate` é a única parte do `WeekDoc` que carrega histórico, então é a
  única que poderia crescer toda semana — e documento que cresce toda semana é
  conta que cresce toda semana. Uma cadeia longa, com mais sessões e semanas do
  que a tabela alcança, não pode produzir listas maiores do que ela manda
  guardar.
- **`buildWeekPayload` deriva a profundidade da cadeia de `gateLookbackWeeks`**
  (M8). Esta é uma trava de **acoplamento, não de comportamento**, e vale
  declarar o que ela não faz: ela verifica a fonte, não executa o caminho.
  Todos os 52 cenários exercitam `buildWeekDoc`, que recebe o `prev` **pronto**;
  quem monta o `prev` é `buildWeekPayload`, e ele lê do `localStorage`. Se ele
  voltasse a encadear uma semana só, todo o resto continuaria verde e o gate
  voltaria a truncar assim que o app recalculasse — que é exatamente como o
  defeito original sobreviveu.

### 8.5 O que continua aberto

Tudo do §7.6 segue valendo, e mais dois itens **novos**, que esta auditoria criou
ao declarar seus próprios limites:

- **`buildWeekPayload` não é exercitado de verdade.** Fechar isso exige stub da
  camada de armazenamento (`getSessionIndex`, `getWorkouts`), que hoje é
  importada no topo do módulo. É um passe próprio, e enquanto ele não acontece a
  cobertura ali é uma expressão regular sobre o código-fonte — melhor que nada,
  e honestamente pior que um teste.
- **A auditoria por mutação foi manual.** As nove mutações foram aplicadas por
  script no passe e revertidas; **nada no repositório as reproduz**. A próxima
  regressão nesta área não será pega por elas, só pelos 52 cenários que elas
  produziram. Automatizar (um alvo `check:gate:mutantes` que aplica as nove e
  exige reprovação em todas) é o próximo passo óbvio — e é o que impediria esta
  mesma auditoria de precisar ser refeita à mão.
- **`estiramento agudo` (§5.2)** segue sendo a única célula da tabela sem
  comportamento, e portanto sem trava possível. Nenhuma mutação a alcança porque
  não há o que mutar.

`npm run build` e `npm run check:gate` passam. Produção não foi tocada neste
passe: as 9 mutações foram revertidas e o diff de `src/` é idêntico ao do §7.

---

## 9. Segunda auditoria por mutação — nove travas mortas depois da primeira

O §8 mediu nove mutações, achou seis mortas e as consertou. Este passe repetiu a
medição com **outras vinte e quatro** mutações, escolhidas onde o §7 e o §8
declaram ter tomado uma decisão e nenhuma delas tinha sido mutada. **Nove
passaram verde**, e a lição é a mesma do §8 num nível acima: uma auditoria por
mutação só prova o que ela mutou, e quem escolhe as mutações é quem construiu a
trava.

Nenhuma linha de produção foi alterada aqui. `git diff --stat src/` é idêntico ao
do §7 e do §8.

### 9.1 O que passou verde

| # | mutação na produção | efeito se entrasse |
|---|---|---|
| M18 | **`gateLookbackWeeks` fixado em 1** | o defeito original de volta: `buildWeekPayload` reconstrói uma semana só, o `prev` chega sem cauda e a janela trunca no segundo salto |
| M28 | `gateLookbackWeeks` fixado em 99 | 99 semanas recalculadas a cada sincronização |
| M27 | **`gateWindowSessions` fixado em 9** | `gate.carry` passa a guardar 8 leituras por semana — o documento que o §8.4 diz ter teto |
| M30 | `weekNumber - gateLookbackWeeks` só num **comentário**, com `weekNumber - 1` no código | idem M18, e a trava do §8.4 casava com a prosa |
| M15 | `RETORNO` deixa de exigir semanas **consecutivas** | duas semanas limpas separadas por um buraco liberam o retorno |
| M12 | some o filtro de idempotência da cauda | reconstruir a mesma semana empilha as leituras dela mesma e o recuo sai sozinho |
| M13 | a bandeira deixa de dizer que a janela **atravessa a semana** | quem lê na conversa semanal não sabe que um dos eventos é de antes de segunda |
| M33 | leitura de sessão limpa nasce com `peak: 1` em vez de `0` | inerte com o teto de hoje (≤1/10); silencioso se a tabela baixar o teto para ≤0/10 |
| M16 | `semanasSemLog` varre o histórico inteiro | **não é defeito**: `gate.weeks` já é truncado em `retorno.semanas`, então as duas formas são o mesmo código. Fica registrado para não ser recontado como buraco. |

As outras quinze mutações — inclusive as nove do §8 — foram pegas.

### 9.2 As três de raiz, e elas têm um nome comum

M18, M27, M28 e M30 são **a mesma doença**: as travas mediam a constante contra
ela mesma.

- o teto da cauda era `Math.max(0, gateWindowSessions - 1)` **dos dois lados** —
  no `buildGate` de produção e na verificação. Inflar a constante inflava os dois
  juntos, e a comparação nunca podia falhar. Era tautologia, não trava;
- `gateLookbackWeeks` não era comparado com nada. A cobertura dele era a
  expressão regular do §8.4 sobre `documentBuilders.ts`, que verifica onde o
  valor é **usado** e não qual valor é. Zerar a constante mantinha a expressão no
  lugar.

O conserto é o princípio da casa aplicado onde ele não tinha sido: **os dois
números passam a ser derivados da TABELA e comparados contra as constantes**, do
mesmo jeito que a §1 já faz com `VENA_BLOCK1_PAIN_GATE`. `gateWindowSessions` tem
de ser a maior janela declarada no §1.2; `gateLookbackWeeks` tem de ser
`max(janela, semanas do RETORNO)`; e o teto da cauda gravada é medido contra a
janela **da tabela**, não contra a constante. A expressão regular do §8.4
continua, agora com os comentários removidos antes do teste — trava que casa com
prosa não é trava.

### 9.3 As outras quatro

- **M15** (`RETORNO` sem semanas consecutivas) é a mais grave depois das de raiz,
  pelo mesmo motivo do §8.2: o `RETORNO` é a única linha do §1.2 que aumenta
  carga sobre o tecido lesionado. A guarda existia e estava correta; o que não
  existia era o cenário. Agora há um: duas semanas limpas, um buraco de
  numeração, uma terceira semana limpa — e o retorno **não** sai.
- **M12** (idempotência) é a guarda que protege o "Reenviar tudo": o cenário novo
  reconstrói a mesma semana passando o documento dela mesma como `prev` e exige
  que a cauda não carregue as próprias leituras nem mude o degrau.
- **M13** foi fechada sem copiar o texto da bandeira para dentro da trava: o
  cenário lê o veredito do `evaluatePainGate` de produção sobre o bloco `gate` que
  o documento gravou, exige `atravessaSemana` verdadeiro num caso e falso no
  outro, e exige que as duas descrições que a produção gera sejam **diferentes**.
- **M33** virou uma asserção sobre o documento: sessão de supino colhida sem dor
  grava `peak: 0`.

45 → 52 (§8) → **59 cenários**.

### 9.4 O falso positivo: a trava culpava o inocente

Julgar só os falsos negativos é metade do trabalho. O outro lado estava pior do
que parecia.

`PROGRAMA.md §1.2` promete: *"Mudar um número em qualquer uma das quatro linhas
muda o app no mesmo passe"*. **Não mudava.** `check-pain-gate.test.mjs` guardava
os números da tabela como literais (`intensity: 2`, `intensity: 4`, quatro
sessões de enchimento para uma janela de três) e as mutações como trechos de
markdown copiados à mão (`'| **1 evento ≥2/10** |'`,
`'**2 semanas consecutivas com pico ≤1/10**'`).

Medido: editar a tabela de propósito e rodar `npm run build:vena && npm run
check:gate` derrubava o build com **quatro a sete falhas**, e as mensagens
apontavam para o app —

```
✗ dor de peito 2/10 numa única sessão levanta a bandeira do gate
✗ RETORNO adulterado (2 → 3 semanas): a mutação não achou a linha RETORNO
```

— quando o app estava certo e quem estava desatualizado era o teste. É o dano que
o §3.2 já nomeia por outro caminho: **aviso que acusa o inocente ensina a ignorar
o aviso**, e este aviso governa um peitoral com histórico de lesão.

Agora os números do teste saem de `PAIN_GATE` e as mutações são construídas a
partir do `sinal` que o parser leu. Depois do conserto, as quatro edições
legítimas medidas (`RETORNO` 2→3 semanas, janela 3→5 sessões, encerrar 4→5/10, e
congelar 2→3/10 nas duas linhas) passam limpas, **com uma exceção deliberada**:

> **O limiar clínico de hoje continua fixado num teste, e só num.**
> `PAIN_GATE.limiarMinimo === 2` é o único número desta suíte que não sai da
> tabela. Ele existe para que **afrouxar o gate seja um ato explícito** — e a
> mensagem de falha diz exatamente isso, em vez de fingir que o app quebrou.
> Quem sobe o limiar de propósito edita as duas coisas no mesmo passe.

### 9.5 O que continua aberto

Tudo do §7.6 e do §8.5 segue valendo. Novos daqui:

- **A auditoria por mutação continua manual, e agora isso é um achado com
  reincidência.** O §8.5 já apontava o alvo `check:gate:mutantes` como próximo
  passo; este passe é a prova de que ele é necessário, porque as nove mutações
  que faltavam não estavam no repositório para ninguém rodar. **A automação
  precisa ser escrita com o limite declarado:** um alvo que aplica uma lista fixa
  de mutações prova a lista, não a trava.
- **`buildWeekPayload` continua sem cenário de comportamento** (§8.5). Fechada só
  a parte da profundidade: ela agora é medida como VALOR contra a tabela, além da
  expressão regular sobre o código.
- **Semana limpa não exige um número mínimo de sessões de supino.** Duas semanas
  com **uma** sessão de supino cada, sem dor, satisfazem o `RETORNO` — e o bloco
  prescreve quatro por semana. É fiel à tabela (*"pico ≤N/10 em todas as sessões
  de supino"* não fala em quantas) e inventar um mínimo seria inventar programa,
  mas é um caminho para o app anunciar tolerância medida em duas exposições.
  Fica **declarado**, que é o que não estava.
- **`estiramento agudo` (§5.2)** segue sem campo e sem trava possível.

`npm run build` e `npm run check:gate` passam. Produção não foi tocada neste
passe.
