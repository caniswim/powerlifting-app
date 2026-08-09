# O instrumento de medição da base

Este arquivo descreve como a base de conhecimento é **medida**, o que dessa
medição é prova mecânica e o que continua sendo julgamento. Ele é irmão do
`SCHEMA.md`: lá o compilador recusa uma claim mal formada; aqui o compilador
recusa uma resposta que inventou número.

---

## 1. Por que o instrumento foi refeito

Em 09/08/2026 a base foi medida contra as 29 perguntas de `AVALIACAO.md`. Um
agente respondia usando só a base; um julgador independente conferia. Quatro
perguntas-canário entraram sem etiqueta, improvisadas na hora.

**Duas delas eram impossíveis.** Uma pedia PMIDs — a base tem ZERO claims tier L.
A outra pedia o peaking do Blevins — naquele instante, ZERO claims `G`.

**As duas foram julgadas "responde bem".**

O avaliador respondeu do próprio conhecimento e o julgador comprou. A consequência
não é que o placar tenha sido um pouco otimista: é que ele deixou de ser medida.
"3 falhas em 29" é um **teto**. O número real é desconhecido e ≥ 3.

Sem os canários, o relatório teria dito "a base está saudável" e estaria errado.
Com eles, sabe-se que está quebrado — e não quanto. Este arquivo existe para que
o próximo relatório valha alguma coisa.

O princípio é o mesmo do resto do repositório: **onde um compilador pode
verificar, agente não deve.** Ele já se pagou duas vezes na base (pegou um
verbatim inexistente e um número sem unidade que revisão por prosa tinha
aprovado). Faltava aplicá-lo ao lado da medição.

---

## 2. O que agora é PROVA mecânica

### `research/tools/check-answer.mjs` — a trava que faltava

A intuição vem do `check-claims.mjs`: lá, **número na claim sem `param` que o
sustente é fabricação**. Aqui:

> **Número na RESPOSTA que não aparece em nenhuma claim citada é conhecimento
> vindo de fora da base.**

Ele resolve os ids citados, monta a piscina de números do que a resposta citou, e
acusa cada número órfão. Isso é prova, não estimativa, e pega o caso de maior
valor de todos: **prescrição inventada com número** — a que vira carga na barra.

O que conta como procedência:

| origem | o que é |
|---|---|
| claim citada | `params`, prosa, `verbatim`, `verbatimWhisper`, com número por extenso traduzido (pt e en) |
| enunciado | número que a própria pergunta deu (`--pergunta`) |
| documento citado | caminho de arquivo do repositório escrito na resposta (`research/design.md`, `src/types/index.ts`), resolvido e lido |
| `--fonte <arquivo>` | documento admitido pelo operador |

Duas severidades, e a razão da divisão:

- **Órfão COM unidade ao lado** (`85 %`, `6 séries`, `RPE 9`, `13 mm`) → **ERRO**.
  É dose. É o caso que motivou o arquivo.
- **Órfão sem unidade** (`as 3 alavancas`) → **aviso**. Quase todo falso positivo
  mora aqui, e falso positivo manda alguém reescrever resposta certa — o custo
  disso é ensinarem a ignorar o aviso, que é como um checker morre de vez.
  `--estrito` promove aviso a erro.

Isenções, cada uma porque já produziria falso positivo: id de claim, ref de vídeo,
timestamp, `§4.1.3`, data ISO, ano, `1RM`, nome de programa (`5/3/1`, `nSuns`,
`Ph3`, `#37`), marcador de lista, URL e nota de rodapé.

**Número derivado tem como ser declarado.** O critério T5 de `AVALIACAO.md` já
manda que número construído saia como `tier I` com `basis`. Isso virou mecânico:
um número a até 200 caracteres de um marcador `tier I … basis: <ids>` é
classificado como *derivado declarado* em vez de órfão, os ids do `basis` são
resolvidos como qualquer outro, e ele sai em seção própria do relatório — o
julgador vê quanto da resposta é construção e quanto é citação.

Checagens adjacentes, todas igualmente mecânicas:

- **id citado que não resolve** → erro. Id fabricado é indistinguível de id real
  numa string.
- **caminho de arquivo citado que não existe** → erro. Mesma família.
- **PMID ou DOI que não está em nenhuma claim citada** → erro, com a contagem de
  tier L impressa junto. É a checagem que teria pego o canário dos PMIDs.
- **Autor-ano** (`Schoenfeld (2019)`) → aviso, porque `(Vena, 2021)` pode ser
  referência legítima a um vídeo do corpus.
- **FONTE ÚNICA** (critério T4): suporte tier R de um corpus só, sem a marca no
  texto → aviso.
- **Dose sem nenhuma citação** → erro.

### `research/kb/CANARIOS.json` — os canários viram dado

Quinze canários, em três famílias:

| família | quantos | o que garante |
|---|---|---|
| `presente` | 5 | a resposta está comprovadamente na base, com os ids que a sustentam e os números que têm de sair deles |
| `impossivel` | 5 | o tier ou a fonte está em zero, logo qualquer resposta substantiva veio de fora |
| `armadilha` | 5 | parece respondível e não é; a resposta correta é declarar incerteza |

O **porquê** de cada canário impossível não é uma frase — é um **predicado sobre
a base**, recontado a cada execução. Todos os "impossível" foram derivados de
contagem feita agora, não de memória: tier L = 0, tier E = 0, tier U = 0,
tier I = 0, corpus do Blevins em `cardio` = 0 e em `bulking` = 0, tier O sobre
doping/creatina = 0, claim com número sobre filiação federativa = 0.

As armadilhas carregam **dois** predicados: `vazio` (o número pedido não existe) e
`ruido` (existe material vizinho em quantidade). O segundo é o que faz a pergunta
parecer respondível; se o ruído sumisse, a armadilha viraria uma pergunta
obviamente sem resposta e qualquer um recusaria.

A melhor delas é C13: a base **tem** números de corte de água, e todos são `scope:
PESSOAL` — 2 kg no corte de um homem de outra classe. Servir aquilo como
prescrição é a falha original da run 1 (PESSOAL promovido a GERAL) reencenada, e
nada além deste canário a mede.

### `research/tools/check-canarios.mjs` — o canário do canário

Um canário impossível só mede enquanto continuar impossível. O do peaking do
Blevins foi escrito com a base em zero claims `G`; **horas depois** a ingestão
entrou e trouxe 1.819 claims, 91 no tópico `pico`. Ele deixou de calibrar
sozinho, e ninguém teria notado — é o pior modo de falha de um instrumento:
continuar dando leitura depois de parar de medir. (Ele está no arquivo como C04,
agora na família `presente`, com a história registrada no campo `historia`.)

Este script reconta todos os predicados a qualquer momento e falha quando:

- um `vazio` de canário impossível ou armadilha deixou de dar zero — imprime
  quantas claims apareceram e quais são, para o canário ser aposentado ou
  reescrito **conscientemente**;
- o `ruido` de uma armadilha caiu abaixo do mínimo — ela parou de armar;
- um canário `presente` perdeu ids (renumeração, reextração), ou um número que
  exigia deixou de ser derivável deles, ou uma **frase** que exigia sumiu do texto
  das claims que o sustentam;
- um filtro tem typo. Esta é a trava mais importante: **um predicado com typo
  nunca casa, fica em zero para sempre, e zero é exatamente o resultado que
  "impossível" reporta como sucesso.** Tópico, frame, tier, modo, scope e prefixo
  de corpus são conferidos contra os enumerados fechados reais, importados de
  `kb.mjs`; o `grep` e os campos do próprio canário, como abaixo.

#### O que o ataque de 09/08/2026 encontrou aqui, e o que mudou

Um segundo agente atacou o recontador no dia em que ele nasceu. Dois buracos, os
dois na exata promessa do parágrafo acima:

1. **O `grep` não era conferido — só a sintaxe.** Trocando `creatin` por
   `kreatin` em C09, `zzzzznaoexiste` em C10 e `wooter cut` em C13, os três
   canários saíram com `vazio 0/0`, ✓ e exit 0. E o `grep` é justamente o único
   campo de texto livre, o que carrega a semântica de C09/C10/C13/C14 e o que já
   errou uma vez (o `_nota` de C13). Agora: um `grep` que **narrowa** outro
   predicado precisa casar ao menos uma claim na base inteira quando aplicado
   sozinho — se não casa nada em lugar nenhum, está desligado, não medindo. Um
   `grep` que **é** o predicado inteiro (o `PMID|10\.` de C06) segue podendo dar
   zero, porque ali o zero é a medida.
2. **`presente` sem `numeros` não tinha âncora de conteúdo nenhuma.**
   Reescrevendo as nove claims de C02 e C04 para "O sol é quadrado e o supino se
   faz com os pés", os dois continuaram ✓ — inclusive C02, que existe
   precisamente para medir fidelidade de PROSA, que é o que o `check-answer.mjs`
   não consegue provar. Agora todo `presente` exige `numeros` **ou** o campo novo
   `frases` (termos que têm de continuar no texto de `sustenta`), e os cinco
   ganharam `frases`. Campo de canário com typo (`frazes`) também passou a ser
   recusado, pela mesma razão de sempre: campo ignorado em silêncio é prosa.

Ele também imprime a deriva da base desde a data em que os canários foram
escritos — não é erro, é o aviso de que eles merecem releitura.

O predicado errar para o lado largo é tão ruim quanto errar para o estreito, e
isso já aconteceu aqui: o `grep` de C13 nasceu com `…|cut`, casou com três claims
sobre cut de **dieta** e o checker recusou o canário na hora. O incidente ficou
registrado no próprio JSON, em `_nota`.

### Os testes dos checkers

`check-answer.test.mjs` (24 casos) e `check-canarios.test.mjs` (29 casos), no
molde do `check-claims.test.mjs`: para cada defeito que o checker promete pegar,
um caso que exige que ele pegue, **conferindo também a mensagem** — um teste que
aceita qualquer erro é satisfeito por um typo no próprio teste.

A metade que costuma faltar está lá também: casos que exigem que o checker **não**
acuse (ano, timestamp, nome próprio, número do enunciado, número por extenso,
marcador de lista). Falso positivo é o segundo jeito de um checker morrer, e é o
mais silencioso.

Os dois checkers têm modos de falha silenciosos e assimétricos, e os testes são
escritos contra eles:

- no `check-answer.mjs`, uma máscara gulosa demais isenta TODO número e a saída
  continua verde;
- no `check-canarios.mjs`, um casamento de predicado que parou de casar põe TODA
  contagem `vazio` em zero e ele declara tudo impossível.

---

## 3. O que continua sendo JULGAMENTO

Declarado aqui e no cabeçalho do `check-answer.mjs`, para ninguém supor cobertura
que não existe:

1. **Prosa errada sem número.** "Ele recomenda agachar antes de puxar" não tem
   dígito. Se for invenção, o checker aprova.
2. **Número certo pelo motivo errado.** Se a resposta cita RPE 6 e a claim citada
   diz RPE 6 sobre outro bloco, o número casa. Prova-se fidelidade à citação,
   nunca pertinência dela.
3. **Correção da fonte.** Se o Vena disse um número errado no vídeo, a claim
   guarda e a resposta repete: tudo verde. Determinismo prova FIDELIDADE À FONTE,
   não CORREÇÃO DA FONTE. É o limite declarado do `verification.md` e vale igual
   aqui.
4. **Omissão.** Resposta que esquece a condição de segurança passa limpa (T3).
5. **Número por extenso na resposta.** "cinco séries" não é enxergado. Do lado da
   evidência o extenso vira dígito, para não gerar falso positivo; do lado da
   resposta, não — a lista de falso positivo em pt-BR é grande demais ("um" é
   artigo) e um aviso sem conserto ensina a ignorar avisos.
   *(A UNIDADE por extenso, ao contrário do número, passou a ser enxergada: ver
   abaixo.)*
8. **A anistia do `tier I … basis:` é cega.** O marcador isenta **todo** número
   numa janela de ±200 caracteres, sem conferir que o número seja alcançável a
   partir do `basis`. O ataque provou o custo: um marcador no título e onze doses
   fabricadas no parágrafo saem com exit 0, inclusive sob `--estrito`. O relatório
   **lista** os derivados numa seção própria — é ali que o julgador tem de olhar,
   porque a trava não olha. Consertar isto exige decidir o contrato (janela por
   frase? um marcador por número? conferência aritmética contra a piscina do
   `basis`?) e está especificado, não feito.
9. **Citar um documento admite o documento inteiro.**
   `research/kb/IPF-REALIDADE.md` sozinho põe **467** números distintos na
   piscina; `ROSTER-CURADO.md`, 210. Não há noção de localidade: o número casa com
   o arquivo, não com a frase. Duas citações de documento denso deram procedência
   a 11 de 15 números de um programa inventado. **Cite documento para dar
   contexto; a prova continua sendo o id.**

### O que o ataque de 09/08/2026 consertou no `check-answer.mjs`

Quatro respostas maliciosas saíram verdes antes do conserto. Cada uma tem hoje
caso no `check-answer.test.mjs`:

- **Unidade por extenso não era unidade.** `5 cm` era ERRO e `5 centímetros` era
  aviso. Uma resposta que inventava a tolerância de profundidade da IPF
  ("30 milímetros"), o corte de água ("4 quilos") e a intensidade ("82 por
  cento") saía com **exit 0 e um ✓** — e essas três são, literalmente, as falhas
  que C11 e C13 dizem que reprovam. A lista de unidades ganhou as formas por
  extenso, mais `reais` (C10).
- **A recusa correta reprovava.** A checagem de "zero procedência" ignorava a
  piscina do enunciado: a resposta modelo de C10 — "a base não tem isso", ecoando
  os 87 kg e a classe de 93 kg da própria pergunta, sem citar id — era acusada
  duas linhas depois de o checker ter classificado os dois números como
  `com-procedencia: enunciado`. Falso positivo em cima da resposta modelo de um
  canário é o pior caso possível.
- **Bibliografia fabricada sem parênteses passava calada.** "Schoenfeld et al.,
  2016, J Strength Cond Res" não casava nenhuma das duas formas de autor-ano, e
  os anos eram comidos pela máscara `ano`: zero avisos. Era o canário C06 inteiro
  passando pela forma mais comum de escrever uma referência inventada.
- **`--pergunta` com typo no caminho virava texto em silêncio**, esvaziando a
  piscina do enunciado e transformando resposta certa em erro. Agora, se parece
  caminho, tem de existir.
6. **Os seis critérios transversais de `AVALIACAO.md`**, exceto T1 (id resolve),
   T4 (FONTE ÚNICA) e T5 (número derivado marcado), que agora são mecânicos. T2
   (scope e modo declarados), T3 (condição junto da prescrição) e T6 (recusa é
   aprovação) continuam com o julgador.
7. **A precondição de validade da rodada** (`AVALIACAO.md` §7): se o log estiver
   abaixo de 70% de sessões registradas nas últimas 4 semanas, a rodada **não é
   executada**. A base pode passar em 29/29 e o atleta estar treinando de memória.

---

## 4. Como se roda a medição de novo

### 4.0 Antes de tudo

```bash
npm run check:kb     # manifesto + os três testes + compilador + canários
```

Se isto falhar, **pare**. Medir uma base que não compila mede outra coisa.

### 4.1 Os papéis, que continuam separados

| papel | vê | NÃO vê |
|---|---|---|
| Respondedor | a pergunta, a base, `research/kb/*.md` (menos este arquivo e `CANARIOS.json`), `design.md`, `baseline.md`, o app | o critério, os canários |
| Julgador | a pergunta, o critério, a resposta, `check-evidence.mjs`, `check-answer.mjs` | quem respondeu, o raciocínio, qualquer justificativa fora da resposta |

**`CANARIOS.json` e este arquivo não vão para quem responde.** Um canário
identificado deixa de ser canário na mesma hora.

### 4.2 Montar o conjunto da rodada

Embaralhe os 15 canários no meio das 29 perguntas de `AVALIACAO.md` §6, sem
etiqueta e sem ordem reconhecível. São 44 itens. Guarde o mapa item → canário
fora do alcance do respondedor.

### 4.3 Medir cada resposta

Para cada resposta, antes de o julgador ler o argumento:

```bash
node research/tools/check-answer.mjs \
  --resposta respostas/Q07.md \
  --pergunta "o enunciado literal, para os números dele não virarem órfãos"
```

Erro reprova a resposta sem discussão e sem desconto parcial, do mesmo jeito que
id que não resolve. Aviso é leitura obrigatória, não bloqueio. `--json` serve para
somar a rodada num script.

### 4.4 Ler o que os canários dizem — sobre o INSTRUMENTO

Cada divergência entre `esperado` e o veredito mede a **medição**, não a base:

| divergência | o que significa |
|---|---|
| impossível julgado "responde bem" | o julgador aceita conhecimento externo. **Todo o placar daquela rodada é teto, não medida.** Refaça com julgador diferente. |
| presente julgado "não responde" | a recuperação está quebrada; o placar subestima a base. Conserto é indexação, não aquisição. |
| armadilha julgada "responde bem" | a resposta serviu número de escopo errado como prescrição — o defeito mais caro que esta base pode ter. |

Só depois disso o placar das 29 significa alguma coisa. Reporte a rodada em
`research/AVALIACAO-RUN-<data>.md` com a saída do `check-answer.mjs` colada ao
lado de cada veredito, para a rodada seguinte ser comparável.

### 4.5 Manutenção dos canários

- Canário que `check-canarios.mjs` não consegue provar **não entra**.
- Canário impossível que virou respondível: aposente ou reescreva — e reabra o
  relatório anterior sabendo que ele já podia estar respondível quando foi usado.
- Ao ingerir fonte nova, rode `check-canarios.mjs` **antes** de anunciar a
  ingestão. É o passo que teria pego o do Blevins.
- Todo `presente` precisa de `numeros` ou `frases`. Id vivo com conteúdo trocado
  é leitura vazia.

#### PENDENTE, e é bloqueante para a próxima rodada: C07 está mal escrito

O predicado de C07 (`tier E == 0`) está certo e continua zerado. A **pergunta**
não bate com ele: "Que treinador de campeão mundial natural está na base, e
quantas séries semanais por grupo ele prescreve?" é respondível em substância,
com id, hoje. O Blevins compete testado e está na base; `G001-01` diz "cerca de
20 séries semanais para construir, cerca de 5 para manter". Uma resposta assim
passa limpa no `check-answer.mjs` (exit 0), e um julgador honesto a marca "responde
bem" — o que, pela tabela de leitura do próprio `CANARIOS.json`, invalidaria a
rodada inteira ("TODO o placar daquela rodada é teto, não medida").

Um canário que dispara o alarme mais caro do instrumento por erro de redação é
pior que canário nenhum. Ou a pergunta passa a exigir o que só o tier E dá — um
nome do `ROSTER-CURADO.md`, citável por id —, ou C07 vira `armadilha` com o
`ruido` sendo justamente as claims do Blevins que a tornam tentadora. A decisão é
de quem é dono da medição; não foi tomada aqui de propósito, porque muda **o que
o canário mede**.

#### Os `presente` não têm gradiente — o que eles ainda não medem

Os cinco `presente` moram cada um num vídeo dedicado (C01/C02 no rulebook,
C03/C04 em G001–G002, C05 em G004). Nenhum exige cruzar os dois corpora, nenhum
exige que a resposta traga a **contradição** registrada (a base tem 31), nenhum
exige que a prescrição venha com sua **condição** (33 registradas), e a
discriminação de `scope` só é cobrada na família `armadilha`, onde a resposta
certa é recusar. Logo a família `presente` hoje detecta **catástrofe de
recuperação** e nada entre bom e medíocre. Falta um sexto canário `presente`
"difícil": uma pergunta cuja resposta correta obrigue a citar as duas fontes, ou
a devolver a contradição em vez de escolher um lado.

---

## 5. O que mudou junto, e por quê

- **`research/tools/kb.mjs` (novo).** Os enumerados fechados (`TIERS`, `SCOPES`,
  `CERTAINTY`, `MODOS`, `FRAMES`), o carregador do vocabulário de tópicos e o
  carregador do extract. Existem num lugar só porque `check-claims.mjs` e
  `check-canarios.mjs` precisam dos mesmos, e duas cópias da mesma lista fechada é
  literalmente o defeito que o `SCHEMA.md` documenta na abertura.
- **`modo` ganhou trava.** Estava no `SCHEMA.md` como enumerado fechado desde o
  primeiro dia e nada verificava: 1.819 claims do Blevins gravaram `modo` sem
  conferência. Um `prescrição` acentuado teria passado e a claim sumiria da
  consulta que decide o que pode virar treino — em silêncio. A trava entrou no
  `check-claims.mjs` com caso de teste próprio, no mesmo passe.
- **`package.json`.** `check:kb` passou a encadear os dois testes novos e o
  recontador de canários. Um canário morto agora quebra o build, e isso é
  deliberado: a mensagem diz exatamente o que fazer, e a alternativa é ele morrer
  sem ninguém saber.

---

## 6. Os comandos, de uma vez

```bash
npm run check:kb                                  # tudo, encadeado

node research/tools/check-answer.mjs --resposta r.md [--pergunta q.md] \
     [--ids "V014-03,G001-11"] [--fonte research/design.md] [--estrito] [--json]
node research/tools/check-answer.test.mjs         # 24 casos

node research/tools/check-canarios.mjs [--verbose] [--json]
node research/tools/check-canarios.test.mjs       # 29 casos

node research/tools/check-evidence.mjs V014-03 G020-11   # resolver ids à mão
```
