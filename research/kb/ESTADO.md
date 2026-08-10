# ESTADO da base de conhecimento — 9 de agosto de 2026

> **Leia isto antes de citar qualquer número de qualidade desta base.**
>
> A medição de 9/8/2026 disse **"3 falhas em 29"** e era mentira. Dois canários provaram
> que o avaliador estava respondendo do próprio conhecimento em vez da base, e o placar
> inteiro daquela rodada virou **teto, não medida**.
>
> **Nenhum número de qualidade da base pode ser citado no futuro sem dizer com que
> instrumento foi obtido e se os canários daquele instrumento passaram.** "A base acerta
> 90 %" sem instrumento nomeado não é um resultado fraco — é um número inventado com
> aparência de resultado. Se você não consegue dizer *qual* medição, *quando* e *se os
> canários dela estavam vivos*, não escreva o número.
>
> Isto vale para este documento também. Cada número abaixo diz de onde veio.

> **O número da onda 2A, e ele é baixo: das SETE perguntas que a MEDICAO-02 mediu como
> falhas de recuperação, o conserto destrava DUAS** (Q05 e Q29). Duas só com a palavra
> canônica (Q19, Q16), duas continuam escondidas (Q11, Q14), uma está fora do alcance
> (Q02). O número vem do **ataque**, que respondeu às cegas com consultas próprias — não de
> quem consertou, que contou 4 de 4. A onda existiu para produzir este número; a tabela e a
> prova estão no §2, e o trabalho que sobrou está em `research/kb/ONDA-2B.md`.

> **O número da onda 2B, e ele é pior que o da 2A porque agora é medida e não teto:
> das 18 perguntas escritas na VOZ DO ATLETA, a camada de recuperação devolve todos os
> ids que respondem em ZERO delas, algum id em TRÊS, e em SETE não abre gaveta nenhuma
> que contenha a resposta.** O número vem dos canários `presente-escondido` P01–P18 de
> `CANARIOS.json` (`node research/tools/check-canarios.mjs` o imprime a cada execução) e
> foi escrito por um terceiro, não por quem consertou. O veredito de uma linha está no
> topo do `RECUPERACAO.md`. **O gargalo é ROTEAMENTO, não ordenação**: em sete casos
> nenhum ranqueamento alcança uma claim que não está no conjunto aberto. O trabalho que
> sobrou está em `research/kb/ONDA-2C.md`.
>
> **E a lição do instrumento, outra vez:** o relato da onda 2B declarou cinco casos
> destravados; o ataque cego reproduziu dois. A diferença não é a camada, é a frase — as
> perguntas da tabela do construtor já continham a palavra da resposta. **Modo de falha
> nº 5 desta casa, agora em forma sutil: medir com o instrumento calibrado no próprio
> conserto.**

Este arquivo é curto de propósito. O mapa do sistema está em `research/RUNBOOK.md`; o
registro está em `SCHEMA.md`; o porquê de cada gaveta está em `ENUMERADOS.md`; como a base
é medida está em `INSTRUMENTO.md`. Aqui está só: **onde a base está, o que foi provado, o
que ainda está errado, e o que atacar primeiro.**

---

## 1. O que a base sabe fazer hoje que não sabia ontem

**Ontem ela tinha uma fonte e um campo de escopo. Hoje ela tem três fontes, um campo de
tipo de afirmação, e a aresta que impede prescrição perigosa.**

**Distinguir de quem é a prescrição.** `scope` separava "para você" de "para mim" e parava
aí — e metade do corpus do Blevins é ele expondo o programa dos outros (5/3/1, nSuns,
PHUL, GZCLP, Cube, Texas Method, Greyskull, Madcow, Ph3, Genesis) ou corrigindo um
desconhecido a partir do vídeo enviado. As duas coisas caíam em `GERAL` + `prescricao`,
que é o filtro que vira treino: *"o nSuns manda AMRAP a 95 % do training max"* com a mesma
autoridade de *"faça AMRAP a 95 % do training max"*. Hoje `modo` está preenchido em
**6.766 de 6.766** claims elegíveis (as 143 `tier: O` são isentas por regra), com **447
`relato-de-programa`** e **115 `avaliacao-de-terceiro`** que antes eram zero.

**Reunir a prescrição com a condição que a torna segura.** O achado mais grave da auditoria
de escopo era que *"supino 6× por semana"* e *"nunca acima de RPE 5"* moravam em registros
diferentes sem como se reencontrar. Separada da condição, a prescrição não fica incompleta
— fica **perigosa, porque parece completa**. Hoje há **695 arestas de `conditions` em 507
claims** (recontado em 9/8 no fechamento da onda 2A; eram 678/502 na MEDICAO-02), e o caso
que o `SCHEMA.md` nomeia como razão de existir do campo está resolvido:
`V092-01` e `V020-22` estão condicionados, e `V092-01` ganhou no fechamento a ressalva que
mais importa para este atleta — **a variação de padrão de movimento** (`V092-19/20/21`),
que o próprio vídeo introduz como resposta ao medo de lesão por overuse na alta frequência.

**Segunda fonte que compete testado.** 1.819 claims do Garrett Blevins (`G###`), que é o
que a base não tinha: o Vena não compete testado. Mais 143 claims `tier: O` do regulamento
IPF 2026, com o discriminador `kind: 'normativo'` em `sources.mjs` para que fonte sem canal
não finja ter `channelId`.

**Medir a si mesma.** `check-answer.mjs` acusa todo número de uma resposta que não aparece
em nada que ela cita; `CANARIOS.json` + `check-canarios.mjs` medem o **julgador**, com 15
perguntas de desfecho conhecido por contagem. Tudo dentro do `npm run build`, então
**canário morto quebra o build**.

**Um lote inteiro que tinha sumido.** 278 claims do Vena (R012, R030, R048, R066, R084,
R102, R120, R138, R156, R174 — a fatia do agente nº 12 dos 18, progressão aritmética de
passo 18) nunca foram tocadas pelo fan-out e ficaram invisíveis a todo filtro de `modo`.
Foram preenchidas no fechamento. **Quem as encontrou não foi a leitura dos 18 relatórios,
que diziam todos que estava tudo certo — foi a catraca `TETO_SEM_MODO`.**

---

## 2. O que foi PROVADO mecanicamente, e o que continua sendo julgamento

Esta separação é o produto principal deste documento. **Determinismo prova FIDELIDADE À
FONTE, não CORREÇÃO DA FONTE**, e nenhuma trava desta base prova a segunda.

### Provado por compilador — `npm run check:kb`, exit 0

| O que está provado | Como |
|---|---|
| Todo `src` existe no manifesto e não é pós-run-1 | `check-claims.mjs` |
| Todo `verbatim` de `tier: R` **existe literalmente na transcrição**, dentro de 45 s do `at` | idem — é a trava que pegou um verbatim inexistente |
| Todo número de `claim` tem `param` com `unit` **e `frame`** | idem — foi assim que 215 kg virou training max |
| Todo valor cabe na escala fechada do frame (RPE 0–10 etc.) | novo em 9/8 |
| Todo id em `basis`, `conflicts` e `conditions` resolve | idem |
| `conditions` é **assimétrica** — par mútuo é erro | novo em 9/8; 5 pares desfeitos |
| `modo`, `scope`, `certainty`, `topic`, `frame`, `suspectWhy` dentro dos enumerados fechados | `kb.mjs` é a fonte única dos seis |
| `modo` **presente** em toda claim que não seja `tier: O` | catraca `TETO_SEM_MODO`, hoje vazia |
| A numeração `[Rxxx]` não deslizou | `verify-manifest.mjs`: 6 âncoras + 258 timestamps, 0 violações no offset adotado contra 52/42/47/50 nos vizinhos |
| O compilador ainda pega o que promete | `check-claims.test.mjs`: **34 recusas + 2 sinalizações + 3 aceitações**, todas exigindo a mensagem certa |
| O verificador do manifesto ainda exige `genero` — o campo de que a trava de `prescricao` depende para não se desligar em silêncio | `verify-manifest.test.mjs`: **12 recusas + 2 aceitações** com mensagem obrigatória, sobre o manifesto real mutado. Apagar o bloco de `genero` do verificador derruba 5 delas |
| O gênero de um vídeo restrito não cai sozinho para um valor sem trava | `verify-manifest.mjs`, roster `GENERO_TRAVADO` com os 39 vídeos restritos: rebaixar `G020` para `aula` era aceito pelos dois checkers e sumia com 7 violações em silêncio. Esvaziar o roster derruba 4 casos do teste |
| A semeadura de `genero` grava o que diz que grava | `seed-genero.test.mjs`: zera os 551 gêneros e exige que o seed devolva **exatamente** os valores commitados, pelo caminho da escrita. O `--dry` que servia de prova antes nunca passava por ele — e escondia um laço que copiava o valor velho por cima do derivado |
| O gate de dor do app obedece a tabela do `PROGRAMA.md` §1.2 | `npm run check:gate`: **59** cenários pelo `buildWeekDoc` **de produção**, nos dois momentos de coleta, com a janela atravessando a virada de semana e a linha `RETORNO` incluída |
| As constantes do gate são **derivadas da tabela**, não medidas contra si mesmas | idem: `gateWindowSessions` e `gateLookbackWeeks` são recalculados do `PROGRAMA.md` lido agora e comparados às constantes. Antes, o teto de `gate.carry` era `gateWindowSessions − 1` **dos dois lados** — tautologia, não trava: fixar a janela em 9 passava verde |
| Uma edição LEGÍTIMA da tabela do §1.2 muda o app num passe só, e não acusa o inocente | `check-pain-gate.test.mjs`: todos os números saem de `PAIN_GATE` e as mutações do markdown são construídas do que o parser leu. Das quatro edições medidas, só a que **afrouxa** o limiar clínico reprova — por um teste, com mensagem que diz o que fazer |
| `modo: 'anedota'` não cresce em lote novo | catraca `TETO_ANEDOTA = { V: 196, G: 47 }` em `check-claims.mjs`, **por prefixo** de id. A proibição existia só em markdown; teto global vazaria, porque retagar uma anedota antiga abre exatamente uma vaga para uma nova |
| **Prescrição com dose de DOR e sem `conditions` acusa** — novo em 9/8 | `escala_dor` entrou em `FRAMES_DOSE` (`kb.mjs:322`), que é a gaveta onde a dose de dor mora e que o aviso não olhava: modo de falha nº 2 num lugar novo. Provado que **arma**, não que se testa a si mesmo: apagar `conditions` de `V001-06` move o contador de `23×` para `24×` em `npm run check:kb`; restaurar volta a 23×. **Limite declarado: o predicado ainda exige `modo === 'prescricao'`**, e `V138-19` (limiar 2 a 4/10, quatro params `escala_dor`) é `modo: opiniao` — apagar as `conditions` dela não move nada. Ampliou-se o eixo do frame e deixou-se aberto o eixo do modo (`ONDA-2B.md` §4.1) |
| A base já não serve o número de dor cru no filtro que vira treino | `check-evidence.mjs:160-161` é o **único** formatador de claim do repositório e imprime `condições:` e `conflita:` **sempre** — em modo id, `--grep`, `--topic` e na vizinhança; `research/kb/topics/` não existe, então não há segunda visão por onde o número vaze. `--grep "push at"` e `--grep "out of 10"` devolvem V079-34 e V001-06 com as arestas. **Este invariante quebra no dia em que as visões geradas existirem** (`ONDA-2B.md` §11.2) |
| Os canários da medição continuam vivos | `check-canarios.mjs`: 5 presentes, **22 `presente-escondido`** (4 pela busca cega + **18 pela pergunta do atleta**), 5 impossíveis, 5 armadilhas — **37 no total** |
| **A recuperação é MEDIDA, e a medida não pode mudar em silêncio** — novo em 10/8 | `check-canarios.mjs`, bloco `perguntaDoAtleta` dos canários P01–P18. Cada um registra `recuperados`, `abriuOTopico` e `gavetasComResposta`, e a divergência é erro **nos dois sentidos**: melhorar acusa igual a piorar, que é o que impede um canário vermelho de virar verde sem alguém escrever o número novo. O placar sai impresso mesmo com tudo verde, porque verde aqui quer dizer *"a medida não mudou"*, não *"a camada acha"*. **O que ele diz hoje: 0/18, 3/18, 7/18** |
| O limite de POSIÇÃO da tela é dado do canário, e está ligado | `check-canarios.test.mjs`: três casos rodam o **mesmo** canário com `tetoDeTela` 1, 2 e 3 sobre a mesma base e obtêm três listas diferentes de ids. Um checker que lesse o teto de `roteador.mjs` daria a mesma resposta nas três |
| O canal *"a página ao lado"* do roteamento entrega pelo NOME do canal | `check-rotas.mjs`, campo `viaPaginaAoLado` do T05. Até 10/8, `DETALHE_ROTEADO 8 → 0` matava o canal inteiro com `check:kb` verde — o único teste que o citava passava porque o id vinha do **outro** canal. Hoje a mutação dá exit 1 |
| O nome COMPOSTO do tópico pesa, e alguém cobra | `check-rotas.mjs`, T15 (`quanto vale a carga de treino da semana?`). `PESO_NOME_COMPOSTO 1.2 → 0` fazia a gaveta `carga-de-treino` desaparecer da rota com `check:kb` verde; hoje dá exit 1 |
| O `tetoDeTela` do topo do `ROTAS.json` não é decoração | `check-rotas.mjs` o lê antes de qualquer caso e recusa a ausência; o `teto ?? 40` hardcoded dentro do checker foi removido. Renomear a linha do JSON → exit 2 |
| A camada de recuperação acha **os quatro casos que a MEDICAO-02 nomeou**, pela busca cega que a medição registrou | `check-canarios.mjs`, família `presente-escondido` (C16–C19). Cobra os dois lados: a busca cega continua não achando no literal, **e** `recuperar()` acha os ids. Desligar a vizinhança (`relaxada = false`) derruba os quatro — medido por mutação em 9/8. **Leia o parágrafo abaixo da tabela antes de citar esta linha: o TETO da tela e o aviso de alargamento NÃO estão travados, e os 35 casos de `busca.test.mjs` não cobrem a fiação.** Ver `RECUPERACAO.md` e `ONDA-2B.md` §1 |
| Todo termo do índice de vocabulário ainda acha, e todo termo declarado morto ainda não acha | `check-vocabulario.mjs`: 73 termos vivos conferidos **dentro do tópico que os declara** e 26 termos mortos conferidos contra a base inteira. A trava recusou o arquivo na primeira execução — a redação inicial dava `six days per week` como morto, e V114-19 diz isso. Confirmado em 9/8 contra a acusação de que ele só varria a prosa: ele usa `textoDaClaim` (`busca.mjs:141`), que inclui `params` e `topic` |
| As **funções** da camada de recuperação fazem o que prometem, sobre um corpus sintético | `busca.test.mjs`: **35 casos** em pares — para cada mecanismo, um que TEM de ser achado e um que NÃO pode ser. **Isto não é cobertura do corpus real**: são ~12 claims `V901-*` e as funções são chamadas diretamente. Ver abaixo |

> ### A camada de recuperação, medida de fora — leia antes de citar qualquer linha dela
>
> **Onda 2A (9/8/2026), auditada por ataque independente e reconferida por mutação nesta
> árvore.** A camada nova (`busca.mjs`, `VOCABULARIO.md`, C16–C19) é conserto real, e é
> **menor do que o relatório que a entregou dizia**. As duas coisas são verdade e as duas
> precisam estar escritas aqui, porque é este arquivo que vai ser citado.
>
> **A pergunta que pagou a onda: das SETE perguntas que falharam na MEDICAO-02, quantas o
> conserto de fato destrava? — DUAS.** Não quatro. O número vem do ataque, que respondeu
> às cegas com consultas próprias, e não de quem consertou:
>
> | | quais | o que significa |
> |---|---|---|
> | **destravadas de verdade** | **Q05, Q29** | a pergunta na forma natural devolve os ids, no topo |
> | destravadas só com a palavra canônica | Q19, Q16 | `--busca "supino parado há 5 semanas platô"` — a pergunta com as palavras dela mesma — devolve zero sobre ciclo ou platô |
> | continuam escondidas | Q11, Q14 | Q11 só aparece quando a consulta **já contém a resposta** (`2 a 3%`); Q14 devolve 1 dos 3 ids |
> | fora do alcance deste conserto | Q02 | é T4 e entregável não escrito, não é índice — e o relatório da onda não a reivindicou |
>
> **O furo maior não estava em nenhum relatório, e nenhum teste o media: PRECISÃO.** A
> expansão do índice disparava uma seção inteira quando **uma** palavra de 4+ letras
> aparecia na consulta. Medido: `--busca "quantas horas de sono por semana"` devolvia
> **0 de 40** claims sobre sono e punha **V170-34/V170-33 — supinar seis dias por semana —
> em 1º e 2º**. Idem para calorias, corte de peso e `deload`. **Para um atleta com o
> peitoral rompido, a claim mais perigosa da base estava sendo injetada no topo de quase
> toda pergunta de planejamento semanal.** Consertado em 9/8 (`expandirPorVocabulario`
> passou a exigir **todas** as palavras longas do termo); **nada trava o conserto** —
> reverter `every` para `some` passa verde em tudo. É o `ONDA-2B.md` §2.
>
> **Três mecanismos que a camada descreve como travados não são travados por nada.**
> Medido por mutação nesta árvore em 9/8, e revertido:
>
> | mutação | resultado | leitura |
> |---|---|---|
> | `TETO_VIZINHANCA = 40` → `400` em `busca.mjs:103` | `check:kb` **exit 0**, nenhum canário pisca | **modo de falha nº 4** — a constante é o corte da busca **e** o limite que o canário cobra, no arquivo cujo comentário diz *"achado no lugar 400 não é achado"* |
> | apagar `...alargamento.flatMap(...)` de `idsMostrados` (`busca.mjs:641`) | `check:kb` **exit 0** | o aviso de alargamento de filtro — **a peça inteira da história da Q11** — pode sumir da tela sem que C19 reclame |
> | `const relaxada = pobre` → `false` (a vizinhança some) | `busca.test.mjs` **exit 0**, `check-canarios.mjs` **exit 1** | os 35 casos não cobrem a fiação; a rede que pega é a dos canários |
>
> **E C19 é calibrado sobre a resposta.** A `buscaCega` dele é `2 a 3%`, e o próprio campo
> `descricao` admite ser *"a consulta CERTA"*. A Q11 medida não digitou isso — ela concluiu
> *"a base não tem número"* justamente por não saber que o número era 2–3 %.
>
> **Um canário `presente-escondido` novo, de um caso que a onda não usou, FALHA.** C20
> (descanso entre séries; V038-07, V074-10, V074-23, todos `GERAL` com param tipado) está
> em `research/kb/CANARIOS-CANDIDATOS.json`, **fora do `check:kb` de propósito**, e
> `check-canarios.mjs --canarios` o reprova nas duas buscas cegas. O alcance medido da
> camada é, hoje, **os casos para os quais ela foi construída**.

### Nem uma coisa nem outra — o que virou COMANDO sem virar trava

Categoria que este documento não tinha e precisava ter. São listas que deixaram de ser
copiadas à mão e passaram a ser recontáveis por qualquer pessoa — **mas não reprovam
nada**, e portanto não impedem reincidência. Cada uma tem a data em que vira trava.

| O que | Comando | Por que ainda não é trava |
|---|---|---|
| Os params em gaveta errada | `node research/tools/params-gaveta-errada.mjs` | **Sete das oito famílias foram fechadas em 9/8 (onda 2)**; a oitava, TAXA, tem **111 params em 69 claims** e não pode ser fechada sem mexer em `FRAMES_DOSE` no mesmo commit (§3) — mover 68 params de *"séries/semana"* para uma gaveta nova **desligaria em silêncio** o aviso de dose sem `conditions` para todos eles |
| ~~"Enquanto a lista não zerar, virar recusa fecharia o build sobre dado legítimo"~~ | — | **ESTA FRASE ERA FALSA e ficou gravada aqui, que é onde ela ia impedir a catraca de nascer.** O detector emite **por família**, e sete famílias emitem **zero**. `ano_calendario` e `indice_adimensional` podem virar recusa hoje, a custo zero de build — provado reintroduzindo um defeito de cada num tree copiado: o detector acusa, `check-claims.mjs` continua exit 0. O argumento de TAXA é bom **para TAXA e só para TAXA**. Trabalho no `ONDA-2B.md` §8 |
| O universo e o intervalo de `pratica-pessoal` | `candidatos-pratica-pessoal.mjs --ic` e `--recall` | o instrumento é um detector com **recall medido de 22 %**; a catraca especificada em cima dele ficaria verde com ~300 claims de dívida (`RUNBOOK.md` §8.21) |
| A fila de revisão de gênero | `check-evidence.mjs --genero <g> --modo prescricao` | a catraca `TETO_PRESCRICAO_EM_GENERO_RESTRITO` **mede e não reprova**. **O teto desceu de 76 para 74 em 9/8**, e a catraca foi atacada por mutação: devolver `G020-17` a `prescricao` dá exit 1; promover uma claim de `G028`, que não está no mapa, dá `teto declarado é 0` e exit 1; baixar `G020` para 5 nomeia o número exato. **Não é trava que se testa a si mesma** — o mapa é literal, e a soma 57 (review) + 17 (form-check) = 74 é recontada de fora |
| ~~A precisão da camada de recuperação~~ | `node research/tools/check-rotas.mjs` | **VIROU TRAVA em 10/8, nas duas portas.** A família `sem-injecao` do `ROTAS.json` (T09/T10/T11) cobra os `proibidos` no roteamento **e**, pelo campo `tambemPelaBuscaLivre`, contra `recuperar()` — que é onde o defeito de 9/8 morava. Reconferido: `sed 's/longas.every/longas.some/'` em `busca.mjs` → exit 1 nomeando V170-34. **O que ainda não é trava é o RECALL**, e a medida dele é a linha de baixo |
| O RECALL da camada de recuperação | `node research/tools/check-canarios.mjs` (o placar sai impresso) | **É medida, e não é trava — de propósito.** Os 18 canários P01–P18 estão registrados como **falhando**, com o número ao lado: 0/18 completos, 3/18 parciais, 7/18 sem gaveta. Transformá-los em erro fecharia o build sobre um defeito conhecido; o que a trava garante é que **a medida não mude em silêncio**, nos dois sentidos. Conserto: item 0 da `ONDA-2C.md` |

### Julgamento de agente — nenhum compilador olhou

**O valor de `modo` em 6.766 claims.** É a maior superfície não verificada da base. Cada
um dos 18 agentes declarou a própria regra de desempate, e elas **divergem**, com o
registro dizendo onde: `narrativa` × `anedota` × `fato` para material PESSOAL não tem
critério escrito em lugar nenhum, e 17 dos 18 relatórios dizem ter inventado o seu.
Auditoria por amostra estratificada (n=190, 9/8/2026): **promoção indevida a `prescricao`
em 12,6 %** — 8,2 % no Vena, 23,5 % no Blevins, e **46 % na amostra dirigida aos vídeos de
review**. Os três focos sistemáticos foram consertados no fechamento (§3), então esse
número é **anterior ao conserto e não vale mais como estimativa**; não há medição
posterior, e este documento não vai inventar uma.

**A atribuição de `relato-de-programa` e `avaliacao-de-terceiro`.** O discriminador real é
o **gênero do vídeo**, não o texto da claim — e a extração normalizou a claim para prosa
geral **antes de as gavetas existirem**. `G028-02` é *"Manter a cabeça em posição mais
neutra e para cima no agachamento"*: indistinguível de prescrição geral para quem lê o
JSONL, que é o que o agente lê. Medido pela auditoria de escopo (9/8/2026, antes do
conserto): nos 20 vídeos de review do Blevins, **82 %** das claims então em `prescricao`
não nomeavam o programa no texto; nos 5 de form check, **90 %** não tinham marcador de
pessoa específica.

Estado depois do conserto, contado agora: `G001–G020` (review) têm 938 claims, **427 em
`relato-de-programa`** e 94 ainda em `prescricao`; `G027–G031` (form check) têm 204,
**114 em `avaliacao-de-terceiro`** e 18 em `prescricao`. Os restos são defensáveis — são
conselho do próprio Blevins sobre adotar um programa alheio, ou padrão técnico universal —
**mas onde exatamente a linha foi traçada é decisão de agente, e 18 agentes traçaram 18
linhas.** Cada um que acertou, acertou abrindo o manifesto do canal à mão. Ver §5.1.

**Isto deixou de ser julgamento em 9/8/2026, para a parte que um compilador alcança.** O
manifesto passou a declarar `genero` por vídeo, e a pergunta "esta claim veio de um vídeo
de review?" tem resposta determinística (`GENERO.md`). O que o compilador ainda **não**
prova é se a claim individual é relato ou generalização legítima: ele nomeia as 76 que
precisam ser abertas e conta que o número não suba. Julgamento continua sendo julgamento —
mas agora sobre uma lista fechada, reproduzível por comando, em vez de sobre 6.766 claims
e a memória de quem passou por elas.

**Se a ressalva do Vena está certa.** As 695 arestas de `conditions` apontam para claims
que existem e estão perto no tempo. Isso é tudo o que o compilador pode dizer. Se a
condição de fato limita, e se a lista de condições está completa, **é leitura**. A
auditoria de `conditions` (n=100, estratificada) mediu ~10 % de aresta falsa, com 42 % nas
cross-vídeo contra 9 % dentro do mesmo vídeo. As falsas nomeadas foram desfeitas; restam
**7 arestas cross-vídeo** na base, todas listadas em §3.

**A DIREÇÃO de `conflicts` — e aqui nem julgamento houve, houve convenção nascendo em
silêncio.** A base tem **48 arestas de contradição em 37 claims**, **8 de mão dupla e 40 de
mão única**, e **nada diz qual é a certa**: `SCHEMA.md:77` só registra *"opcional. Vira
aresta no ledger de contradições"*. É o modo de falha nº 1 servido de bandeja — o próximo
agente copia a do vizinho. E a propriedade de segurança apodrece sem ninguém ver: apagar
`conflicts` de `V027-25` deixa `check:kb` em **exit 0**, e a claim volta a sair sem a linha
`conflita` enquanto V079-34/V138-01/V138-20 continuam apontando para ela. Mão única esconde
justamente do lado perigoso. Decisão e trava no `ONDA-2B.md` §4.3.

**As nove claims que autorizam treinar dentro da dor — cinco foram condicionadas, quatro
não.** O passe do cluster de dor (`DOR-E-TREINO.md`) tratou V001-06, V079-34, V138-19,
V138-01 e V171-14. **V138-08, V138-13, V138-24 e V138-18 continuam sem `conditions` e sem
menção**, e V138-03 e V108-29 nem foram achadas pela varredura (a primeira por conjugação:
o termo buscado era `keep moving`, o verbatim diz `keepING moving`). A pior é **V138-18** —
*"reduz o peso até o ponto em que se sente ALGUMA DOR mas não se sente pior na sessão
seguinte"*, `GERAL` + `prescricao`, a **autorização definicional** que as outras citam como
limiar — e ela sai crua na própria consulta que o documento usa como prova do conserto.
`ONDA-2B.md` §4.2.

**Se a base está certa sobre treinar.** Nada aqui prova isso, e nada aqui pode. O Vena e o
Blevins podem estar errados; a base garante que estamos citando o que eles disseram, na
forma em que disseram, com a ressalva que disseram junto.

---

## 3. O que sabidamente ainda está errado — com id e tamanho

### Consertado hoje (registrado para não voltar)

| Defeito | Tamanho | Conserto |
|---|---|---|
| Lote 12 do fan-out nunca rodou | 278 claims, 10 arquivos | preenchido; catraca zerada |
| `G001` era o único de 17 arquivos de review com zero `relato-de-programa` — a especificação do programa Genesis (creditado no vídeo a Zach Robinson e Josh Pelland) entrou como ordem do Blevins | 29 claims | → `relato-de-programa` |
| `G029`/`G030`: a correção calibrada para o corpo de um desconhecido ficou em `prescricao` enquanto a observação, no mesmo arquivo, virou `avaliacao-de-terceiro` | 10 claims | → `avaliacao-de-terceiro` |
| `scope: PESSOAL` + `modo: prescricao`, que o esquema define como excludentes | 13 claims | 10 viraram `narrativa`/`opiniao`; 3 tiveram o `scope` corrigido (`V039-26`, `V167-23`) — hoje **zero**, e virou aviso do checker |
| Arestas de `conditions` falsas, nomeadas pela auditoria | 12 arestas | removidas (`V058-21`, `V142-18`, `V061-16`, `G012-29`, `V131-10`, `G016-44`, `G020-37`, `V053-11`, `V126-07`) |
| Ciclos em `conditions` | 5 pares | desfeitos, e agora são erro de compilação |
| `V033-21`: a cauda da claim foi editada para longe do verbatim (`up in baseline` → "do que na vez anterior") | 1 claim | revertida para *"5 lb a mais na base"* |
| Canário `C07` respondível com id pelo corpus — um julgador honesto respondendo bem invalidaria a rodada inteira | 1 canário | pergunta reescrita para exigir o roster |
| `TETO_SEM_MODO` declarava 4.947 com 278 reais | 1 constante + 2 documentos | catraca em zero, docs corrigidos no mesmo passe |

### Não consertado, e por quê

**Números em gaveta errada — 50 dos 52 foram movidos em 9/8 (onda 2); sobrou uma
família, e ela é maior do que a lista dizia.**

> **Onda 2, 9/8/2026.** Oito gavetas abertas em `kb.mjs` (`ano_calendario`,
> `indice_adimensional`, e a família de taxa `horas_semana` / `horas_dia` /
> `min_semana` / `min_dia` / `lb_semana` / `MET_min_semana`), com a decisão em
> `ENUMERADOS.md` §3-bis e a tabela em `SCHEMA.md`. Foram movidos **50 params**;
> saíram 2 (o preço de `V169-42` e a convicção de `V013-15`); as frações em
> string viraram decimal com a fração preservada por escrito no `unit`; e
> `value` string ficou **legítimo só em `frame: rotulo`**, onde `"5x5"` é o
> registro certo.
>
> **O achado que muda o tamanho do trabalho:** a regra de taxa do detector era
> estreita (olhava só `frame ∈ {min, seg, horas}`) e por isso reportava 19. A
> regra larga acha **111 params em 69 claims** — 68 em `series`
> (*"séries/semana"* gravado como `series`), 18 em `lb`, 16 em `contagem`, 9 em
> `reps`. A regra foi alargada; os 111 **não** foram movidos, porque `series`,
> `reps` e `lb` estão em `FRAMES_DOSE` e movê-los **desliga em silêncio** o aviso
> de *"prescrição com dose e sem `conditions`"*. Fechar essa família é passe
> próprio, e tem de mexer em `FRAMES_DOSE` no mesmo commit.

O que segue é o registro do estado anterior, mantido porque é ele que explica por
que cada gaveta foi aberta. É o bug dos gramas gravados como `kg`.

> **Correção de 9/8/2026, registrada em vez de apagada.** Esta seção trazia a lista **à
> mão** e o §4 dela derivava *"as 19 params"*. Ambos os números estavam errados, e a lista
> estava incompleta: faltavam **19 params de TAXA** e **2 anos de calendário**. Lista
> copiada dentro de um documento é o defeito nº 3 desta casa, cometido no inventário dos
> defeitos. **A lista agora é comando:**
> `node research/tools/params-gaveta-errada.mjs` (`--ids`, `--json`).
> Ele é **detector, não verificador**, está fora do `check:kb` de propósito
> (`RUNBOOK.md` §8.19) e some quando cada regra dele virar recusa do `check-claims.mjs`.

As famílias, com o destino e se a gaveta existe:

- **19 params de TAXA tipada como a duração sozinha** — *família que a lista à mão não
  tinha*. `"4 h/semana"` gravado como `4` com frame `horas`, ao lado de `"treino de 3 h"`
  gravado como `3` com frame `horas`. O `unit` guarda o `/semana`; `frame` é a gaveta que o
  consumidor lê. Em `V005`, `V006`, `V013`, `V019`, `V044`, `V048`, `V102`.
  **Falta gaveta.**
- **6 anos de calendário** com frame de duração ou contagem: `V013-16`, `V019-02`,
  `V122-01`, `V152-24`, `V175-08`, `V175-40`. **Falta gaveta** — ano de calendário não é
  duração nem posição.
- **5 índices adimensionais com `frame: pct`**: `V044-07` (BRI ×2), `V142-08` (R² ×2),
  `V142-11`. **Falta gaveta.** E `V142-08` tem `r2_min = 65` ao lado de `r2_max = 0.9`:
  duas escalas no mesmo par, um dos dois errado por 100×.
- **5 horas do relógio como duração**: `V112-22` ×2, `V112-23` ×3 — e em `V112-23` o
  meio-dia virou `value: 1`, então o número nem é a hora que a claim diz. Gaveta
  `hora_do_dia` **pronta**.
- **3 comprimentos em pé com `frame: cm`**: `V104-27` ×2, `V114-17`. Gaveta `pes` **pronta**.
- **2 volumes em litro**: `V164-16` (8 litros com `frame: ml`), `V112-22` (meio litro com
  `frame: kg`). Gaveta `l` **pronta**.
- **1 preço** (`V169-42`, USD com `frame: contagem`) — dinheiro está declarado fora de
  escopo em `ENUMERADOS.md` §5, então o param **sai**.
- **11 params com `value` string** em 10 claims (`V001-02`, `V002-19`, `V081-15`,
  `V081-26` ×2, `V087-18`, `V091-19`, `V096-05`, `G019-20`, `G020-01`, `G020-41`): frações
  `"1/3"` e rótulos `"5x5"` escapam de toda aritmética do checker.

**Gaveta aberta e nunca usada é meio conserto.** `pes`, `l`, `pct_XRM` e `grau_C` foram
abertas em 9/8 e têm **zero** uso — o enumerado cresceu e o dado não se mexeu. `pes` foi
aberta citando `G051-37`, que continua sem param nenhum; `l` foi aberta citando `V112-22`,
que continua em `kg`.

**Dois números que não medem nada, no mesmo passe e com decisão diferente:**

- `V013-15` *"100 % convicto"* — percentual de convicção não mede coisa nenhuma.
- `V166-05` — **a claim não é uma claim.** O conteúdo dela é *"o número que a transcrição
  registra é 45 lb, valor implausível"*: uma nota de artefato de extração ocupando gaveta
  de `fato`, com o número quebrado tipado num `param`. Ela sai.

Por que não consertei: cada um exige decidir se a gaveta certa já existe, se falta uma, ou
se o número devia sair da base — e ampliar enumerado no fechamento de uma rodada é
exatamente como o enumerado divergiu do documento da outra vez. É um passe próprio, curto,
e agora com **lista recontável em vez de lista pronta**. Plano em `ONDA-2.md` item 4.

**Números corrompidos por ASR, ainda circulando tipados.** `V095-18` (`agacho_antes: 45 lb`
para um contexto de 422 lb), `V117-01` e `V112-04` (supino de 45 lb onde o resto do corpus
diz 405), `V153-03` (292,5 kg gravado como 622 lb, sendo 645), `V037-06` (total de 92,5 kg),
`V175-01` (678 lb gravado como 37,5 kg), `V160-30`, `V070-26/27` (números sem unidade de
massa), `V043-27` (o áudio não resolve: `large-v3` diz 20, `turbo` diz 28). **74 claims com
`suspect: true`, 53 sem `suspectWhy`** — o passe de Whisper recebe 53 janelas sem saber se
procura número ou negação. A trava nova impede que a dívida cresça; ela não a paga.

**As 7 arestas de `conditions` que cruzam vídeo**, que é o estrato de 42 % de erro:
`V064-05→V010-04`, `V086-26→V032-07`, `V086-26→V032-08`, `V090-18→V072-22`,
`V094-01→V130-10`, `V094-01→V130-11`, `V118-08→V028-10`. Nenhuma é fabricada e todas foram
defendidas por escrito pelo agente que as criou; são 7 leituras à mão, não um passe.

**174 claims `relato-de-programa` com dose e sem `conditions`**, invisíveis ao aviso do
checker, que só olha `modo: prescricao`. `85 % do 5RM`, `+10 lb/semana`, `3 a 5 min de
descanso` ficam citáveis sem que nada reclame. **Deliberadamente não liguei o aviso**:
seriam 174 avisos que a fonte quase nunca permite resolver, e aviso impossível de zerar é
como se ensina alguém a ignorar avisos. O conserto é do lado do consumidor — quem lê a base
nunca pode tratar `relato-de-programa` como prescrição.

**O aviso de número por extenso é suprimido por qualquer `param`.** A condição no código é
*"tem número por extenso E **nenhum** param"*, então basta um param de qualquer coisa para
o aviso sumir, mesmo que o número por extenso seja outro. Medido em 9/8/2026 com método
declarado — `numerosPorExtenso(claim)`, descartando `1` (que é artigo em português), em
claims que **têm** param, exigindo que o valor não apareça em nenhum `param.value`:
**103 claims**, e nenhuma emite aviso. Exemplos: `G009-04` (*"variações de seis e de 3
dias"*), `G051-37` (*"com seis pés de altura"*) — e `G051-37` foi justamente a claim citada
para ABRIR o frame `pes`, que continua com **zero** usos na base. O "zero avisos restantes"
de um relatório anterior é artefato dessa supressão. O conserto (trocar "não tem param
nenhum" por "este extenso não bate com nenhum valor declarado") é o trabalho todo, porque a
composição — *"oitenta e um"*, *"dois vírgula cinco"*, *"treze milímetros"* onde "mil" é
falso positivo — é onde uma versão malfeita produz dezenas de avisos sem conserto.

**Buracos do gate de dor** (detalhe em `GATE-DOR.md`). Dois foram fechados em 9/8/2026
(`GATE-DOR.md` §7): a janela de "3 sessões" **atravessa a virada de semana** — ela é
contada em sessões de supino, persistida em `WeekDoc.gate` e a semana sem supino não a
consome — e a linha `RETORNO` **passou a ser consumida por código**, com as duas mutações
da célula (`2 semanas` e `pico ≤1/10`) reprovando o build. Continuam abertos: o gatilho
`estiramento agudo` não tem campo na pesquisa; o parser degrada em silêncio se o número de
eventos for escrito por extenso; linha de tabela com 3 colunas é descartada sem um pio;
sessão de supino sem log só é anunciada dentro da janela do `RETORNO`; e o gate
**sinaliza, não age**.

**E o achado que importa mais que a lista acima: o comportamento estava certo e a TRAVA
estava morta.** Duas auditorias por mutação (`GATE-DOR.md` §8 e §9) encontraram, somadas,
**15 travas mortas** em `check-pain-gate.mjs` — mutações no código de **produção** que
passavam verde com o `npm run build` inteiro. As piores foram de duas famílias:

- **Cenário com o nome certo que testa outra coisa.** `semanaLimpa` tem três condições;
  havia cenários nomeando as condições 1 e 2, e os dois passavam pela condição 3. Apagar as
  condições 1 e 2 não mexia em nada, e com isso *uma semana de deload — ou uma semana parada
  pela própria dor — contava como evidência de tolerância*, com o app anunciando a condição
  de re-subir o degrau tendo medido **zero** exposições de peitoral.
- **A trava medindo a constante contra ela mesma.** O teto de `gate.carry` era
  `gateWindowSessions − 1` **dos dois lados** da comparação; `gateLookbackWeeks` fixado em 1
  (que é o defeito original de volta) passava porque a única cobertura era uma expressão
  regular que verifica **onde** o valor é usado, não **qual** valor é — e essa expressão
  casava até com o nome escrito num **comentário**.

Achou-se também um **falso positivo** na direção inversa: editar a tabela do §1.2 de
propósito derrubava o `check:gate` com mensagens acusando o app, quando o app estava certo.
Os dois estão consertados; 45 → **59** cenários, produção intocada. **A moral fica: verde
não é evidência de que a trava está viva.** É o modo de falha nº 4 desta casa, e ele
reincidiu duas vezes na mesma rodada.

**Dois limites abertos do `check-answer.mjs`**, declarados no cabeçalho dele e no
`INSTRUMENTO.md` §3: a anistia de `tier I … basis:` é cega e isenta todo número numa janela
de ±200 caracteres (11 doses fabricadas passaram com `--estrito`); e citar um documento
admite o documento inteiro sem noção de localidade (`IPF-REALIDADE.md` sozinho põe 467
números na piscina).

**Buracos de infraestrutura.** `R191.jsonl` tem **0 byte** e passa em toda contagem por
nome. `R132.jsonl` pula `V132-25` e `V132-28`. `research/synth/` e `research/kb/topics/`
continuam vazios apesar de o `SCHEMA.md` os descrever. `SUSPEITOS-VERIFICADOS.md` continua
**não existindo de propósito** — gerá-lo com 11 de 148 alvos criaria um documento que
parece completo.

**Uma contradição que a base tem com o app, e que ninguém registrou como `conflicts`:**
`V138-18`/`V138-19`/`V138-20` prescrevem reabilitar **treinando com dor de 2 a 4/10**,
enquanto o gate do `PROGRAMA.md` §1.2 manda **congelar a 2/10 no peitoral**. As duas estão
certas nos seus contextos (uma é reabilitação geral, o outro é uma lesão específica com
histórico), mas a base não diz isso em lugar nenhum, e é a claim mais perigosa a circular
solta para este atleta.

---

## 4. O que a próxima rodada tem de atacar, em ordem

> ## ⇒ A FILA DE HOJE É `research/kb/ONDA-2C.md` (10/08/2026)
>
> **Escrita no fechamento da onda 2B, depois do segundo ataque cego.** Ela traz, na
> ordem: **consertar o roteamento** (item 0 — os canários P01–P18 já estão escritos e já
> estão vermelhos), a triagem de banalidade com o portão de calibração de dois agentes na
> mesma amostra de 150 e corte em 85 % (#34), os fatos do atleta em `tier U` (#28, com a
> calibração de RPE **fora**), o Whisper nos 53 `suspect` (#31), e — por último, e a ordem
> não é negociável — o ledger de contradições e as sínteses (#25, #26). **Reparo vem
> antes de síntese.** E ela repete o que já foi medido duas vezes: **não ingira mais
> corpus, o gargalo não é conteúdo.**
>
> ### A fila anterior, `research/kb/ONDA-2B.md`
>

> **Escrita no fechamento da onda 2A (9/8/2026), depois do ataque.** É ela que traz o
> trabalho que sobrou, na ordem, com *quantos* / *onde* / *como se verifica*: as três
> travas mortas da camada de recuperação, o canário de precisão que não existe, C20, os
> quatro buracos do cluster de dor, a triagem de banalidade (#34, **com portão de
> calibração**), os fatos do atleta em `tier U` (#28), o Whisper (#31), a família TAXA, a
> reconciliação dos documentos que discordam, e — **por último, e a ordem não é
> negociável** — o ledger e as sínteses (#25, #26).
>
> **O `ONDA-2.md` está desatualizado e sabe-se onde:** os critérios de aceite dele
> (*"o detector imprime zero achados"*, *"cada regra vira uma recusa e este arquivo é
> apagado"*) foram deferidos e **não foram reescritos lá**. Ele contradiz este arquivo e o
> `ENUMERADOS.md` em silêncio. Conserto especificado no `ONDA-2B.md` §9.2. **Até lá, leia
> o 2B.**

> A fila anterior está em `research/kb/ONDA-2.md` — com *quantos*, *onde* e *como se
> verifica que ficou certo* para cada item, as colisões entre as filas contadas, e os
> comandos que geram cada lista de ids. Esta seção é o **porquê da ordem**; aquela é o
> trabalho. O que mudou na ordem no fechamento de 9/8:
>
> - **A contradição `V138-*` × §1.2 subiu para primeiro.** Estava no fim do §3 como
>   observação. É a única entrada da fila que pode fazer o app dizer a **este** atleta para
>   treinar dentro da dor do tecido que ele rompeu, e ela **não pode ser registrada** hoje:
>   `conflicts` liga claim a claim, e o gate do app não é uma claim.
> - **`tier U` subiu junto**, porque é ele que destrava a anterior (item 5 do `ONDA-2.md`).
>   Continuava em A7 do `PLANO-EXECUCAO.md`, fora desta ordem.

**1. ~~Campo `genero` por vídeo, no manifesto.~~ FEITO em 9/8/2026 — sobrou a fila de
revisão, que agora é uma consulta.** O campo está em 551 de 551 vídeos dos dois
manifestos, semeado a partir da `TRIAGEM.md` e dos títulos sem reabrir vídeo nenhum
(`research/tools/seed-genero.mjs`); o enumerado fechado tem dez valores e mora em
`kb.mjs`; a decisão inteira está em **`research/kb/GENERO.md`**. `verify-manifest.mjs`
exige o campo, `check-evidence.mjs --genero` responde "o que revisar", e
`check-claims.mjs` conta `modo: prescricao` vinda de vídeo que expõe material de outra
pessoa contra uma catraca por `src`.

**A fila de 76 foi repassada em 9/8/2026 (onda 2), uma a uma, com o `verbatim` e a
transcrição em volta. O teto desceu de 76 para 74**, e as duas que mudaram estão
justificadas por escrito no `check-claims.mjs`, ao lado da catraca: `G020-17` (*"three
times per week is really the frequency you want for squat"* — a frequência de agacho **do
StrongLifts**, e a única da fila com dose de frequência em `GERAL` + `prescricao`) virou
`relato-de-programa`, e `G027-01` (*"mande o vídeo por link do YouTube"* — logística de
canal, a única da fila que não pode virar treino sob leitura nenhuma) virou `opiniao`.

**As outras 74 são exceção legítima, e é isso que a fila era.** O discriminador do
`PROTOCOLO-EXTRACAO.md` é *de quem é o imperativo*, e nas 74 ele é do próprio autor
saindo do material alheio: *"I would advise…"*, *"my general recommendation here is…"*,
*"that's how I would adjust this protocol"*. Duas correções de leitura ficaram
registradas: `G011-32` e `G011-34`, que a primeira passagem chamou de "os casos claros"
lendo o texto da claim (*"ele manda"*), são do Blevins pelo `verbatim` (*"I would say
stick with the five…"*) — a regra do nSuns já está gravada ao lado, em `G011-30/31`, como
`relato-de-programa`. **O defeito ali é do texto da claim, não do `modo`**, e continua de
pé: *"ele manda"*, *"a recomendação dele"* não dizem quem é "ele".

Primeiro dividendo já medido: este documento dizia "94 claims em `prescricao` nos 20
vídeos de review (`G001`–`G020`)". A faixa contígua cobrava demais — `G004` (deload),
`G006` (periodização) e `G008` (stress index) são tese própria do Blevins, não resenha, e
respondem por 40 das 94.

**2. ~~Escrever a regra de `narrativa` × `anedota` × `fato` × prática habitual~~ — a regra
está escrita; falta retaggear.** Feito em 9/8/2026: `PROTOCOLO-EXTRACAO.md` ganhou o teste
("quantas datas cabem nesta frase?"), `pratica-pessoal` foi decidida e `anedota` foi
declarada em fusão com `narrativa`. O registro da decisão, as recusas e a lista do que ela
move estão em `FRONTEIRA-MODO.md`; o `RUNBOOK.md` §8.18 tem a dívida.
**Nenhuma claim foi tocada, e o enumerado de `kb.mjs` não foi ampliado** — enumerado
declarado e vazio é o que fez `scope: TERCEIRO` ser recusado, e a medição estava rodando
sobre `research/extract/` no dia. O que sobra é um fan-out, não um repasse dirigido: a
estimativa e o intervalo estão no `FRONTEIRA-MODO.md` §4, com o método de amostragem
declarado e recontável por script. **Continua em segundo porque é pré-requisito de qualquer
medição desses campos — e agora a parte cara dele é a única que resta.**

**3. ~~Passe de gaveta errada — 52 params em 39 claims.~~ FEITO em 9/8/2026 (onda 2) para
50 deles; sobrou a família de TAXA, e ela é 111 params.** As três gavetas que faltavam
foram abertas — `ano_calendario`, `indice_adimensional` e a família de taxa —, `value`
string foi decidido (número, e `rotulo` é a única exceção), e a decisão está em
`ENUMERADOS.md` §3-bis. **O que sobrou não é resto: é a família maior**, escondida por uma
regra de detector estreita, e ela não fecha sem `FRAMES_DOSE` no mesmo commit, senão o
aviso de "prescrição com dose e sem `conditions`" se desliga em silêncio para 68 params de
`séries/semana` — a trava se apagando pelo conserto, que é o modo de falha nº 4 desta casa.
`node research/tools/params-gaveta-errada.mjs`.

**4. Passe de Whisper nos 53 `suspect` sem `suspectWhy` e nos números do §3.** Caro (áudio
+ modelo), mas é o único que resolve número corrompido sem adivinhação, e a ferramenta já
existe e já teve o `CONFIRMADO` falso consertado. **Quarto porque é caro e porque o dano de
hoje é contido: os números estão marcados.**

**5. Fechar os dois limites do `check-answer.mjs`.** Ambos exigem decidir contrato — janela
por frase? um marcador por número? conferência aritmética contra a piscina do `basis`?
localidade dentro do documento citado? — e mudar o contrato muda o significado de T5 para
quem já escreve resposta. **Quinto porque é decisão de design, não de execução, e o
instrumento hoje é honesto sobre onde é cego.**

**6. O ledger de contradições e as sínteses.** 48 arestas de `conflicts` em 37 claims, numa
base de 6.912 claims com
duas fontes que discordam é subregistro quase certo. **A primeira aresta a registrar saiu
daqui e virou o item 1 do `ONDA-2.md`**, porque ela não é subregistro: é uma contradição que
a base **não tem como expressar** enquanto `tier U = 0`.

---

## 5. Duas coisas que não podem ser esquecidas

**5.1 — Onde um compilador pode verificar, agente não deve.** Este princípio se pagou
quatro vezes só nesta rodada: pegou um verbatim inexistente, um número sem unidade, o lote
de 278 claims que 18 relatórios diziam estar em ordem, e 5 ciclos de `conditions`. Toda vez
que este documento diz "julgamento de agente", leia como **"aqui o princípio ainda não foi
aplicado"** — não como "aqui ele não se aplica".

**5.2 — Número de qualidade sem instrumento é opinião com cara de medida.** Está no topo
deste arquivo, está no §6 do `RUNBOOK.md` e está no `INSTRUMENTO.md`, em três lugares de
propósito. A medição que mentiu não mentiu por descuido: ela produziu um número plausível,
bem formatado, e só dois canários impediram que ele virasse fato citável. **O placar de uma
rodada cujos canários não passaram é teto, não medida — e teto não se cita como resultado.**
