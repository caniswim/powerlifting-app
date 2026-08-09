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
