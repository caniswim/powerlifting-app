# RECUPERAÇÃO — a base escondia o que tinha, e o conserto está na ferramenta

> **VEREDITO — 12/08/2026 (noite), medido contra o conjunto cego D01–D12, que
> ninguém tinha visto. 6.912 claims, teto de tela 40.**
>
> ```
> CEGO       (D01-D12)   2 de 12 devolvem ALGUM id · 0 de 12 devolvem TODOS ·  3 de 33 ids (9 %)
> PÚBLICO    (P01-P18)   7 de 18 devolvem ALGUM id · 2 de 18 devolvem TODOS
> SOTERRADOS             11 de 12 cegos abrem a gaveta com a resposta e não a entregam
> ```
>
> **A distância entre cego e público é de 22 pontos percentuais em "algum id"
> (16,7 % contra 38,9 %) e de 11 pontos em "todos os ids" (0 % contra 11,1 %). O
> visível está 2,3 vezes acima do cego.** Os números saem separados por conjunto
> a cada `node research/tools/check-canarios.mjs`; a soma dos três conjuntos é
> impressa depois de todos eles e nunca sozinha, porque a média apaga essa
> distância, que é a única coisa que um conjunto cego mede.
>
> **O ganho é real e é minúsculo.** Contra o estado de 11/08 rodado no mesmo
> comando (`node research/tools/auditoria/legado.mjs`), os mesmos doze cegos
> saem de **0 de 12 para 2 de 12** e de **0 de 33 ids para 3 de 33**. O atleta
> continua sem resposta em **10 das 12** perguntas dele.
>
> **O defeito que esta onda existiu para matar PIOROU.** O soterramento era 10
> de 12 e é **11 de 12**. Em nove casos a gaveta com a resposta ABRIU e nenhum id
> chegou; só o D11 é falha de roteamento pura. A alocação por gaveta trocou *"a
> gaveta grande come tudo"* por *"as vagas se repartem entre gavetas erradas"* — e
> a prova é contraintuitiva e está gravada: em D05, `--topic convencional`
> devolve as três claims e `--topic convencional sumo terra` devolve **zero**.
> **Abrir a gaveta certa mais uma vizinha é pior do que abrir só a certa**, e
> nenhuma trava vê isso (§8.48).
>
> **O que é verdade do relatório da tarde, reproduzido duas vezes:** a FISGADA
> entrega as CINCO sem `--topic` (13/18/36/38/39); a ORDEM (B11) reproduz linha
> por linha; a tela MEDIANA caiu de 40 para 34; as regressões declaradas do
> público (P11 perde G004-11, P13 perde V119-20) reproduzem exatas.
>
> **O ganho global, na régua de hoje.** O relatório da tarde publicou *"48 → 59
> ids em 127, completos 13 → 17"*. **Esses números não reproduzem mais, e não
> porque estivessem errados: a entrada dos D01–D12 no `CANARIOS.json` acrescentou
> 12 casos e 33 ids à bancada.** Hoje
> `node research/tools/medir-alocacao.mjs` lê **48 → 62 ids em 160**, com
> `--legado` imprimindo `completos: 14` contra 17 agora. A conta fecha exata —
> `59 + 3 = 62`, `127 + 33 = 160`, `53 + 12 = 65` casos —, e os `+3` são
> justamente os três ids que o conjunto cego novo devolve. O `13` do relatório era
> `14` desde sempre (§8.53).
>
> **O que era mentira útil, e por que fica escrito:** as varreduras que
> ESCOLHERAM as constantes não reproduzem (§8.53), e a asserção que "matava" o
> mutante `PISO_VAGAS 3→1` era a constante reescrita como asserção — modo de
> falha nº 4 dentro do arquivo escrito para provar que as constantes foram
> ganhas. Removida (§8.49). **E o preço que ninguém tinha medido: a posição
> MEDIANA da resposta certa foi de 6 para 8** — dos 45 ids presentes nas duas
> telas, 17 desceram e 11 subiram (§8.55).
>
> **A doença seguinte tem nome, e não é alocação.** Forçando sozinha a gaveta que
> contém a resposta, **28 dos 33 ids chegam** — para esses o que falta é VAGA.
> Os outros **5 de 33 não chegam nem assim**: estão soterrados DENTRO da gaveta
> certa, e o caso puro é o D09, em que abre UMA gaveta, a certa (`dor`), a tela
> sai com 35 das 40 vagas ocupadas, e as duas claims não aparecem nem forçando.
> **O próximo alvo é ORDENAÇÃO DENTRO DA GAVETA** (§8.50), e é esse mesmo número
> que responde por escrito a pergunta do atleta sobre a frota de modelo barato,
> no `ONDA-2C.md` §0.3: `node research/tools/auditoria/vale-a-frota.mjs`.
>
> **D01–D12 estão publicados a partir deste commit e, portanto, queimados**, como
> os B01–B12 antes deles. A próxima onda precisa de conjunto cego novo, escrito
> antes do conserto por quem não viu a ferramenta.

<details>
<summary>Veredito anterior — 12/08/2026 (tarde), o relatório da alocação por gaveta, antes da auditoria cega</summary>

> **VEREDITO — 12/08/2026 (tarde), os três números, contra 6.912 claims, teto de
> tela 40.**
>
> **CEGO (B01–B12, escrito pelo ataque antes desta onda): 2 de 12 devolvem algum
> id esperado — era 0 de 12. PÚBLICO (P01–P18): 7 de 18 — era 8 de 18.**
>
> **O número público CAIU, e ele caiu de propósito.** P11 perdeu o único id que
> tinha na tela (G004-11, que saía em 29º pelo ranking global) quando a rota
> deixou de ocupar as 40 vagas sozinha. Em compensação, os canários que devolvem
> **TODOS** os ids esperados foram de **0 de 18 para 2 de 18** (P06 e P07): a tela
> passou a completar respostas em vez de encostar nelas. A distância entre cego e
> público caiu de 44 para **22 pontos percentuais** (16,7 % contra 38,9 %) — e
> parte dessa queda é o público piorando, não só o cego melhorando. Está dito
> assim porque a média de um número que sobe com outro que desce é a forma mais
> barata de um relatório mentir.
>
> **SOTERRADOS: 10 dos 12 cegos tinham a gaveta certa aberta e a resposta fora da
> tela. Hoje são 8.** Sobre o conjunto inteiro de 53 canários com id esperado
> (os 19 do `ROTAS.json` + os 34 do `CANARIOS.json` + os três casos nomeados da
> onda), os ids que chegam à tela vão de **46 de 127 para 59 de 127** — **48 → 59**
> se o ganho da alocação for isolado do desempate da página ao lado, que mudou
> junto —, e os casos em que TODOS os ids chegam vão de **13 para 17**.
>
> **O caso mais caro desta base está fechado.** *"fisgada de 3/10 no peitoral na
> terceira série de supino pausado, continuo?"*, **sem `--topic`**, devolve as
> CINCO claims do limiar de dor — V079-34 (13º), V001-06 (18º), V027-23 (36º),
> V086-21 (38º), V138-19 (39º). Em 11/08 chegava uma, em 36º.
>
> **E a tela aprendeu a devolver pouco:** o tamanho MEDIANO caiu de 40 para 34, e
> *"o cinto pode ter mais de 13 mm de espessura na IPF"* devolve 31 linhas com
> F001-84 em 2º, contra 40 linhas antes.
>
> **O que se pagou:** dois canários públicos perderam um id cada (P11 perde
> G004-11, P13 perde V119-20) porque a rota deixou de ocupar as 40 vagas
> sozinha. Está gravado no `CANARIOS.json`, com o veredito medido, inclusive nos
> que falham. Ver **PARTE VI (§25)**.
>
> Os números saem separados por conjunto a cada
> `node research/tools/check-canarios.mjs` — somá-los imprimiria a média e
> apagaria a distância. **B01–B12 estão publicados e queimados**; a próxima onda
> precisa de conjunto cego novo.

<details>
<summary>Veredito anterior — 12/08/2026 (manhã), o diagnóstico do soterramento</summary>

> **VEREDITO — 12/08/2026, os dois números, contra 6.912 claims, teto de tela 40.**
>
> **No conjunto PÚBLICO (P01–P18, que o construtor enxergava): 8 de 18 devolvem
> algum id esperado. No conjunto CEGO (B01–B12, escrito depois pelo ataque, que
> ninguém enxergava): 0 de 12. A distância é 44 pontos percentuais.**
>
> **Em 10 dos 12 cegos a gaveta que contém a resposta ABRIU e a resposta não
> chegou à tela; só B02 e B05 são falha de roteamento. Forçando a gaveta com
> `--topic`, 9 dos 12 devolvem na hora. O que falta não é roteamento: as 40 vagas
> da tela são distribuídas pelo ranking global e não por gaveta, então
> `agacho`(990 claims) leva 39 vagas e `sapato`(18) leva zero.**
>
> Os dois números saem separados a cada `node research/tools/check-canarios.mjs`,
> por conjunto — somá-los imprimiria `8 de 30`, que é a média dos dois e apaga a
> distância. A próxima onda precisa de um conjunto cego NOVO: B01–B12 estão
> publicados a partir deste commit e, por isso, queimados.


</details>

<details>
<summary>Veredito anterior — 11/08/2026, medido só no conjunto público</summary>

> **VEREDITO — 11/08/2026, medido pelos canários `presente-escondido` P01–P18 de
> `research/kb/CANARIOS.json`, contra 6.912 claims, teto de tela 40.**
>
> **O ROTEAMENTO FOI CONSERTADO; A RECUPERAÇÃO AINDA NÃO ENTREGA.**
>
> | o que se mede | 10/08 | 11/08 |
> |---|---|---|
> | abrem a gaveta em que a resposta está etiquetada | 5 de 18 | **11 de 18** |
> | **não** abrem gaveta nenhuma que contenha a resposta | 7 de 18 | **1 de 18** |
> | devolvem **algum** id esperado dentro do teto de tela | 3 de 18 | **8 de 18** |
> | devolvem **todos** os ids esperados | 0 de 18 | **0 de 18** |
>
> A última linha não se mexeu, e não se mexeu de propósito: esta onda atacou
> **uma** das duas doenças. `7 → 1` é o ROTEAMENTO, que era o alvo. `0 de 18` é o
> SOTERRAMENTO — a gaveta certa abre e a claim sai em 945º de 1.038 —, que é
> ordenação DENTRO do tópico e ficou fora do escopo para que as duas medições não
> se misturassem. **Nenhum dos 18 ficou pior:** nenhum perdeu id que já saía,
> nenhum fechou gaveta que já abria.
>
> Os quatro números saem impressos a cada `node research/tools/check-canarios.mjs`;
> verde ali quer dizer que a medida não mudou, não que a camada acha.
>
> **O que mudou de mecanismo:** o roteamento deixou de casar a pergunta contra o
> CORPUS e passa a casá-la contra um **vocabulário de entrada na voz do atleta**
> — `research/kb/GLOSSARIO-TOPICOS.json`, 74 gavetas, 1.988 termos, consolidado
> dos oito lotes de `research/kb/entrada/`. Ver **PARTE III (§19)**.

</details>

**Data: 09/08/2026.** Este arquivo é o conserto do modo de falha que a
`MEDICAO-02.md` mediu, e ele existe porque o conserto que aquele relatório
propôs — *"protocolo de busca em dois passes"* — não bastava.

> **ADENDO DE 11/08/2026 — a PARTE III (§19) descreve o roteamento como ele é
> hoje.** Os §10–§18 descrevem a porta nova como ela nasceu, com o roteamento
> LÉXICO derivado do corpus. Esse casamento léxico foi substituído pelo glossário
> de entrada em 11/08; a arquitetura (tópico → conjunto → ordenação, os canais
> declarados, os tetos de tela) continua exatamente a mesma.
>
> **ADENDO DE 10/08/2026 — leia antes dos §1–§9.** A camada descrita abaixo
> (`busca.mjs`, `--busca`) **reprovou no ataque cego de 09/08** e ganhou uma
> segunda porta, que hoje é a principal: **`--pergunta`, que resolve
> *pergunta → tópico → claims*** em vez de *pergunta → texto*. A **PARTE II**
> (§10 em diante) descreve a porta nova, mede o que ela fecha e o que não
> fecha, e registra as duas regras de higiene que os §1–§9 violaram.
>
> **Os §1–§9 continuam válidos e não foram reescritos.** Eles descrevem a porta
> livre, que continua existindo, continua sendo o instrumento certo para *"quem
> diz exatamente isto?"*, e continua sendo cobrada por canário. O que mudou é
> qual porta um agente abre primeiro para responder ao atleta: **é a nova.**

---

## 1. O defeito, com o número na mão

A `MEDICAO-02` foi a primeira medição confiável desta base: 15 canários no
desfecho esperado, 475 ids citados resolvendo, **zero fabricação**. Placar 22
bem / 5 parcial / 2 mal, e **reprovada** pela cláusula das catastróficas.

As sete respostas não-`bem` falharam pelo **mesmo** defeito, e nenhuma por
fabricar: **declararam ausente da base algo que a base tem, com id e com `param`
tipado.**

| caso | o que o agente digitou | o que existia | por que não achou |
|---|---|---|---|
| **Q05** `mal` | `six times` → 4, todos PESSOAL | **V170-34**, **V175-53** — `GERAL` + `prescricao`, `freq_supino=6` | nunca tentou `six days a week` (**6 hits**) |
| **Q19** `mal` | `sets per muscle` → 2 | **V010-13** — `GERAL` + `prescricao`, 1–3 séries por músculo | está **doze ids depois** de V010-01, **no mesmo vídeo que ela já citava** |
| **Q16** `parcial` | vocabulário de "ciclo" | **V070-20**, **V125-07**, **V108-08** | nunca tentou `training cycle` (**86 hits**) |
| **Q11** `parcial` | a consulta certa, **com `--modo prescricao --scope GERAL`** | **V033-03/04/05** — 1 RPE ≈ 2–3 % | o número mora em **PESSOAL + `fato`** |
| **Q14** `parcial` | vocabulário de câmera | **G029-18**, **G029-28**, **G027-31** | a pergunta era de **profundidade** (87 claims) |
| **Q29** `parcial` | leu `academia` só contra "nomeia um lugar?" | **V055-21**, **V174-18**, **G048-56** | idem |

> **Uma base que esconde é mais perigosa que uma base vazia, porque a recusa dela
> é convincente.** E `nao-encontravel` × `conteudo-ausente` mandam consertos
> OPOSTOS: quatro dessas respostas mandariam a próxima rodada **comprar fonte que
> já se tem**. O `AVALIACAO.md` §4.4 já orçou uma rodada inteira contra o sintoma
> errado, uma vez.

## 2. Por que "protocolo" sozinho não era o conserto

O relatório propôs instruir o agente a buscar duas vezes. Sozinho, isso é
**instruir o agente a se esforçar mais** — e é a receita que já falhou aqui: o
modo de falha nº 1 da casa é o agente copiar a convenção errada do vizinho e
chamá-la de padrão. Uma busca que só casa substring literal vai continuar errando
`six days a week` quando se digitou `six times`, por mais protocolo que se
escreva em cima dela.

**Onde um compilador pode verificar, agente não deve.** Achar `six` dentro de
`six days a week` é exatamente o que um compilador pode fazer. Então a ordem do
conserto foi: **ferramenta → índice → protocolo**, e o protocolo ficou por
último, curto, e com ferramenta atrás dele.

---

## 3. A FERRAMENTA — `research/tools/busca.mjs`

Cinco mecanismos. Cada um ataca um caso medido, e a §6 mostra qual carrega qual.

### 3.1 Todo campo, não só a prosa
O `--grep` era regex sobre `claim` e `verbatim`. Agora casa também `params.name`,
`params.unit`, `params.value`, `params.frame` e `topic` — **`freq_supino` é o nome
do dado que a Q05 procurava e não fazia parte de busca nenhuma.**

O que casou **fora da prosa** sai contado em separado (`N casaram em
claim/verbatim — a contagem que os relatórios antigos citam — e M casaram só em
params/tópico`). Mudar em silêncio a contagem que os relatórios citam seria o
modo de falha nº 3 (documento e código divergindo sem avisar).

### 3.2 Busca por raiz e por número
A consulta vira um conjunto de raízes (plural pt+en, acento dobrado) mais os
**números** que ela contém. O número é a ponte bilíngue que não precisa de
dicionário: `six`, `seis` e `6` são o mesmo 6, e quem já sabia ler os três era o
`numerosPorExtenso`/`numerosCrus` do `kb.mjs` — **importado, não recopiado**, que
é a regra desta casa desde que duas leituras de dígito divergiram em silêncio.

Ranqueamento por IDF (termo raro decide), cobertura da consulta, bônus de frase,
e normalização por tamanho da claim. O termo numérico entra com peso 0,6: é ponte,
não evidência — com peso cheio ele virava o ranqueador.

### 3.3 As sementes: olhar em volta do pouco que se achou
**Medido, não suposto:** só com IDF, `six times` deixava V170-34 fora dos 20
primeiros. `six` e o número 6 são comuns demais para decidir sozinhos, e a outra
palavra da consulta (`times`) simplesmente não existe na claim alvo. Consulta
fraca é justamente o caso que a ferramenta existe para atender.

O que decide é o que um humano faria: os poucos resultados literais viram
**semente**, e a vizinhança é medida em relação a elas — mesmo tópico (×1,6) e
sobretudo **mesmo vídeo** (×2,2 quando a menos de 20 ids). As quatro sementes de
`six times` estão todas no tópico `frequencia`, onde V170-34 e V175-53 moram.

### 3.4 O vizinho de arquivo
A Q19 parou **doze ids antes** de V010-13, **no mesmo vídeo que já estava
citando**. O extrator emitiu as claims na ordem em que o assunto foi dito, então a
claim ao lado costuma ser a que completa a resposta — a condição que desarma a
prescrição, o "e no agacho eu uso 3 %" logo depois do "2 a 3 %". A ferramenta
puxa ±3 ids no mesmo `src` a partir do que já está na tela. Não é ranqueamento: é
abrir a página ao lado.

### 3.5 Vazio × pobre, e o filtro como suspeito
- **Vazio** (`0 hits`) e **pobre** (`< 8 hits`) saem com banners diferentes e
  texto diferente, porque mandam consertos opostos e até hoje tinham a mesma
  cara. O piso 8 é julgamento declarado: **o dobro da pior falha medida** (as
  buscas cegas devolveram 4 e 2). `--piso` sobrescreve.
- **O filtro é reportado como suspeito.** Com filtro ativo, cada um é removido em
  separado *e* os de segurança (`modo`/`scope`/`tier`/`genero`) são removidos
  **todos juntos** — porque no caso Q11 remover um por vez não revela nada (a
  claim é barrada pelo outro), e a remoção uma-a-uma teria dito, com ar de rigor,
  que o filtro não escondia nada. `--topic` também é reportado: foi ele o culpado
  na Q14.

### 3.6 O que a ferramenta NÃO é
Não é busca semântica e não vai virar. Não há banco vetorial e **não vai haver**:
o consumidor é um modelo de janela grande lendo arquivos, a busca é grep, e isso
é restrição dura e provavelmente vantagem — o que se recupera é auditável. Um
sinônimo que não compartilha raiz nem número com a consulta continua inalcançável
por aqui. Esse buraco é fechado à mão, e é a §4.

---

## 4. O ÍNDICE — `research/kb/VOCABULARIO.md`

Nesse mundo sem embedding, o índice faz o trabalho que o embedding faria. Por
tópico: os sinônimos, o inglês, a expressão que **o canal de fato usa** —
derivada do corpus (`vocabularioDoTopico` lista os termos e bigramas distintivos
de qualquer tópico), escrita à mão, com a nota de *por que a busca ingênua falha
ali*.

Duas coisas o tiram de "documento que ninguém lê":

1. **Ele é executável.** `busca.mjs` expande a consulta com a seção que ela toca.
   Quem digita `training cycle` recebe `ciclo de treino`; quem digita `six times`
   recebe `six days a week`. Termos emprestados entram com peso 0,45 e a saída
   declara de qual seção vieram — palpite do índice não pode se passar por
   palavra do usuário. E uma **expressão do índice casada inteira** vale bônus:
   é o índice dizendo "é assim que se fala disto" e a claim dizendo exatamente
   isso.
2. **Ele tem trava.** `check-vocabulario.mjs`, dentro do `npm run check:kb`:
   - todo termo de `usa:` tem de casar **≥1 claim daquele tópico** — termo morto
     manda o próximo agente buscar palavra que não existe, **e confirma, com a
     autoridade do índice, uma lacuna que não existe**;
   - todo termo de `não usa:` tem de casar **zero na base inteira** — se
     ressuscitar, a nota que explica a falha virou falsa.

   Nenhum dos dois lados é derivado do outro nem de si mesmo: os termos são
   escritos à mão e conferidos contra o corpus. É a diferença entre esta trava e
   a **trava que se testa a si mesma**, que é o modo de falha nº 4 desta casa e
   aconteceu três vezes num dia só. **A trava já pagou:** a primeira redação da
   seção `frequencia` listava `six days per week` como morto, e o checker recusou
   o arquivo na primeira execução — V114-19 diz exatamente isso.

**Cobertura, declarada: 10 dos 74 tópicos** — os seis que falharam na medição
(`frequencia`, `acessorios`, `periodizacao`, `rpe`, `profundidade`,
`equipamento`) e quatro que governam o peitoral deste atleta (`supino`, `lesao`,
`dor`, `volume`). Nos outros 64 a busca é só raiz + número.

**A linha mais importante do índice é um zero:** em `## lesao`, os termos
`pec tear`, `torn pec`, `fisioterapeuta`, `physical therapist`, `see a doctor` e
`ver um médico` casam **zero claims na base inteira**, e a trava reconfere isso a
cada execução. É o agravante da `MEDICAO-02` §6.2 virado predicado: *uma resposta
fiel à base é uma resposta que nunca manda ele procurar ninguém.*

---

## 5. O PROTOCOLO — quatro linhas, e agora com ferramenta atrás

1. **Nenhuma declaração de ausência vale se a busca que a sustenta carregava
   `--modo` ou `--scope`.** Busque sem filtro; classifique depois. (A ferramenta
   avisa, mas a regra é sua.)
2. **Poucos resultados são a BEIRADA do assunto, não o assunto.** Abaixo de 8, a
   ferramenta abre a vizinhança sozinha — leia-a antes de escrever "a base não
   tem".
3. **Leia os vizinhos do id que você já achou.** Doze ids depois, no mesmo vídeo.
4. **Antes de declarar lacuna de conteúdo, rode `--vocab <topico>`** e confira
   contra a palavra que o canal usa. Se o tópico não tiver seção no
   `VOCABULARIO.md`, escreva uma — é o trabalho mais barato desta camada.

---

## 6. A PROVA — contra os quatro casos medidos

### 6.1 Q05: a busca que a Q05 fez acha V170-34?

```
$ node research/tools/check-evidence.mjs --grep "six times"

4 claim(s) para /six times/i:
  … V015-03, V053-07, V152-19, V170-04 — os mesmos 4 de antes, todos PESSOAL …

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠  RESULTADO POBRE — 4 de 6912, abaixo do piso de 8.
     Precedente (MEDICAO-02): `six times` devolveu 4, a resposta concluiu que a base
     só tinha log pessoal, e as duas claims GERAL+prescricao estavam sob `six days a
     week`. Poucos resultados são a BEIRADA do assunto, não o assunto.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A consulta foi EXPANDIDA pelo research/kb/VOCABULARIO.md:
     ## frequencia  (casou `times per week`)  →  `six days a week` · `days a week` · …

  VIZINHANÇA — 40 claim(s) por raiz e por número, ordenadas por raridade
  do termo, proximidade de tópico e MESMO VÍDEO. …

   1º  casou: six, freq, #6, frequency, x, high …+8  ·  mesmo tópico  ·  mesmo vídeo, 30 ids
      V170-34  R170@07:30  tier:R scope:GERAL modo:prescricao genero:aula explicit
        tópicos: supino, frequencia, volume, hipertrofia
        A chave para o supino é seis dias por semana ou outra frequência alta, bem
        submáximo, alto volume, mais muito trabalho acessório de hipertrofia.
        params: freq_supino=6 dias/semana [x_semana]
        verbatim: "is just six days a week or some other high frequency very sub
                   maximal high volume and also tons of accessory hypertrophy work"
        condições: V170-36, V170-44
```

**Sim.** V170-34 sai em **1º**, com as duas `conditions` que a desarmam junto —
que é o caso canônico do `SCHEMA.md`. V175-53 sai no índice compacto da mesma
vizinhança.

### 6.2 Q19

```
$ node research/tools/check-evidence.mjs --grep "sets per muscle"
2 claim(s) para /sets per muscle/i:   (V010-01, V145-28 — os mesmos 2 de antes)
…
   1º  casou: per, muscle, isolamento, trabalho, serie, volume …+2  ·  mesmo tópico  ·  mesmo vídeo, 12 ids
      V010-13  …  scope:GERAL modo:prescricao
        No trabalho de isolamento, ele costuma achar que 1 a 3 séries por músculo é o
        que dá para bancar.
        params: series_isolamento_min=1  series_isolamento_max=3
        condições: V010-14, V010-02
```

**1º lugar, e a saída diz "mesmo vídeo, 12 ids"** — a distância exata que a
`MEDICAO-02` registrou.

### 6.3 Q11 — o filtro, não o vocabulário

```
$ node research/tools/check-evidence.mjs --grep "2 a 3%" --modo prescricao --scope GERAL
1 claim(s) para /2 a 3%/i · modo=prescricao · scope=GERAL:   (V099-09)
…
   4º  V033-03  …  scope:PESSOAL modo:fato
        Para ele, subir 1 RPE na barra corresponde a cerca de 2 a 3% de peso.
…
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠  O FILTRO É QUE ESTREITOU — não necessariamente a base.
     modo=prescricao + scope=GERAL JUNTOS: 1 com eles, 3 sem eles — escondem 2 claim(s)
        V033-03(PESSOAL/fato) V050-21(PESSOAL/fato)
        sem eles: node research/tools/check-evidence.mjs --grep "2 a 3%"
     REGRA: declaração de ausência não vale se a busca que a sustenta carregava
     --modo ou --scope. Busque primeiro SEM filtro; classifique depois.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

`1 com eles, 3 sem eles` é literalmente o número que a `MEDICAO-02` §7 registrou.
V033-04 e V033-05 entram pelo vizinho de arquivo (mesmo `src`, ids adjacentes).

### 6.4 Quem carrega quem — a atribuição, medida

Rodando cada busca cega com e sem cada mecanismo, contra as 6.912 claims:

| canário | busca cega | completo | sem `VOCABULARIO.md` | sem sementes/vizinho |
|---|---|---|---|---|
| C16 | `six times` | 2/2 | 2/2 | 2/2 |
| C16 | `6 vezes por semana` | 2/2 | **0/2** | 2/2 |
| C17 | `sets per muscle` | 1/1 | 1/1 | 1/1 |
| C18 | `training cycle length` | 2/2 | 2/2 | **1/2** |
| C19 | `2 a 3%` + filtro | 3/3 | 3/3 | **1/3** |

**Nenhum mecanismo é decorativo, e nenhum sozinho resolve tudo.** Raiz+número
basta para C16/C17; o índice é o único caminho para a consulta em português de
C16; as sementes e o vizinho de arquivo são o que salva C18 e C19.

---

## 7. A QUARTA FAMÍLIA DE CANÁRIO — `presente-escondido`

As três famílias antigas medem **fabricar**, **responder de fora** e **promover
escopo**. Nenhuma media **esconder** — e os 15 canários passaram todos numa
rodada em que 7 de 7 respostas ruins falharam exatamente por isso. *O instrumento
estava cego para o modo de falha da rodada que ele mediu.*

C16–C19 saem dos quatro casos reais, com os ids que o julgador confirmou. Cada um
carrega em `buscaCega` **o que a medição registrou que o agente digitou**, e o
`check-canarios.mjs` cobra **os dois lados**:

1. a busca cega, **literal e sobre a prosa** (o `--grep` de antes), continua **não
   achando** os ids. Se achar, o esconderijo acabou e o canário virou um
   `presente` comum — falha com `DEIXOU DE SER ESCONDIDO`;
2. a mesma busca cega, passada pela camada de recuperação, **acha todos** dentro
   das 40 primeiras — o que cabe na tela. Falha com `A CAMADA DE RECUPERAÇÃO
   REGREDIU`, e a mensagem diz, em voz alta: *isto não é perda de conteúdo, não
   saia comprando fonte nova.*

**Isto não é uma trava que se testa a si mesma.** Os termos vêm da medição, os
ids vêm do julgador, e as duas cobranças apontam em direções opostas — nenhum
lado é derivado do outro. Além disso `check-evidence.mjs` e `check-canarios.mjs`
usam **a mesma função** `recuperar()`: se fossem duas implementações, o canário
estaria medindo a si mesmo.

**Prova de que os canários mordem** (regressão simulada: `pobre = false` em
`busca.mjs`, o que desliga a vizinhança):

```
✗ canário C16: A CAMADA DE RECUPERAÇÃO REGREDIU — a busca cega "six times" não
  devolve V170-34, V175-53 dentro das 40 primeiras.
✗ canário C17: … "sets per muscle" não devolve V010-13 …
✗ canário C18: … "training cycle length" não devolve V070-20, V108-08 …
✗ canário C19: … "2 a 3%" (com --modo prescricao --scope GERAL) não devolve
  V033-04, V033-05 …
```

Revertida a regressão, os 19 voltam a verde. `npm run check:kb` encadeia tudo,
então **canário de recuperação morto quebra o build**.

---

## 8. O QUE CONTINUA INALCANÇÁVEL — e é a parte que não pode faltar

### 8.1 O sinônimo que não compartilha raiz nem número
`ciclo` e `cycle`, `peitoral` e `pec`, `agacho` e `squat`. **Nenhuma
radicalização junta esses pares**, e nenhuma vai juntar sem dicionário. É o único
buraco que o índice fecha, e o índice cobre 10 de 74 tópicos.

**O exemplo concreto, e ele é um dos ids da Q16: V125-07** — *"16 semanas é a
duração ótima de um ciclo de treino"*, `GERAL`, com `param duracao_ciclo=16`.
Medido: a partir de `training cycle length` ela sai em **60º**, fora do teto de
40. Ela **não** está em `sustenta` de C18 por isso, e não vou fingir que está.
O caminho que funciona é de dois passos, e é o que o `VOCABULARIO.md` existe para
encurtar: `--vocab periodizacao` → a seção diz `ciclo de treino` → o grep literal
dessa expressão devolve V125-07 na hora. **A ferramenta não fecha este caso; o
índice mais uma consulta fecham.**

### 8.2 A pergunta escrita como pergunta
`duração do ciclo`, `quantas semanas`, `how long should a block be` casam **zero**
e não são resgatadas. As claims são declarativas; a consulta interrogativa não
compartilha quase nada com elas. Registrado em `## periodizacao` sob `não usa:`.

Medido, e o resultado é ambíguo de um jeito que vale registrar:
`--busca "quanto peso tirar da barra por ponto de RPE"` devolve **V050-21**
(*"1 ponto de RPE equivale a cerca de 2 a 3 % do máximo"*) e **não** devolve
V033-03. A resposta certa sai; **o id que a `MEDICAO-02` nomeou, não.** Para
responder ao atleta isso basta; para um canário, não — canário que aceita
"qualquer claim equivalente" mede menos do que parece, e por isso C19 usa a busca
`2 a 3%` com o filtro da Q11, que é o que a medição de fato registrou.

### 8.3 O que a §6.4 não mediu
A atribuição da §6.4 é sobre os **quatro casos que já sabíamos**. Ela não é
estimativa de recall na base inteira, e não existe estimativa dessas aqui: para
tê-la seria preciso um conjunto de pares (pergunta, ids corretos) muito maior que
19. **Este documento prova que quatro buracos conhecidos fecharam. Ele não prova
que não há um quinto.**

### 8.4 Os dois casos da medição que NÃO viraram canário
Q14 (câmera × profundidade) e Q29 (academia) estão no `VOCABULARIO.md` com os
termos e as notas, mas **não** viraram `presente-escondido`. Medido, a partir de
`camera angle depth judging`: G029-28 sai em **22º** (dentro do teto), G027-31 em
**49º** e G029-18 em **98º** — os dois últimos fora. Um canário que exigisse os
três falharia de nascença, e canário vermelho permanente é como se desliga uma
trava.

E o diagnóstico honesto de Q14 não é de vocabulário: é de **tópico errado**. A
resposta procurou no assunto errado, e o que serve ali é o alargamento de
`--topic`, que já sai na saída. Fica registrado como dívida: quando `## tecnica`
e `## setup` tiverem seção no índice, vale reavaliar.

### 8.5 O piso 8 é julgamento
Não é derivado de nada além das duas falhas medidas (4 e 2). Se aparecer uma
terceira falha de recuperação com mais de 8 hits literais, o número sobe **com a
medição na mão**, e não por palpite.

### 8.6 O limite de sempre
O determinismo desta camada prova **fidelidade à recuperação**, não **correção da
fonte**. Achar V170-34 é um ganho de recuperação; V170-34 continua sendo
*"supine seis dias por semana"* dito por um homem que não compete testado, para
um atleta com o peitoral rompido há quatro meses. O que a torna segura são as
`conditions` (V170-36, V170-44) e o `modo` — não o fato de a busca a ter achado.

---

## 9. Procedência

- **Arquivos novos:** `research/tools/busca.mjs`, `research/tools/busca.test.mjs`
  (35 casos), `research/tools/check-vocabulario.mjs`,
  `research/kb/VOCABULARIO.md`, este arquivo.
- **Arquivos alterados:** `research/tools/check-evidence.mjs` (usa `recuperar()`,
  ganha `--busca`, `--vocab`, `--piso`, `--vizinhos`),
  `research/tools/check-canarios.mjs` (quarta família),
  `research/tools/check-canarios.test.mjs` (6 casos novos, 41 no total),
  `research/kb/CANARIOS.json` (C16–C19; 19 canários), `package.json`
  (`check:kb` encadeia `busca.test.mjs` e `check-vocabulario.mjs`),
  `research/RUNBOOK.md`.
- **Base no momento:** **6.912 claims** (a `MEDICAO-02` mediu 6.909; o
  `check-canarios.mjs` reporta a deriva de +3 em tier R). Todos os números deste
  arquivo foram reproduzidos por script contra `research/extract/*.jsonl`
  durante a escrita.
- **`npm run check:kb`:** verde, exit 0 — 19 canários (5 presente ·
  4 presente-escondido · 5 impossivel · 5 armadilha), 73 termos vivos e 26 termos
  mortos declarados no índice, todos reconferidos.
- **O que NÃO foi feito:** `AVALIACAO.md` continua **intocado** — o instrumento
  fica estável para a terceira medição. Nenhuma claim foi editada, nenhuma fonte
  foi ingerida. Este trabalho é inteiramente de recuperação.

---
---

# PARTE II — A PORTA NOVA: `pergunta → tópico → claims`

**Data: 10/08/2026.** A PARTE I acima é de 09/08 e continua de pé. Esta parte
existe porque a camada dela **reprovou no ataque cego do mesmo dia**, e porque
as três reprovações apontam todas para o mesmo lugar.

---

## 10. Por que a busca livre estava resolvendo um problema já resolvido

Os três furos do ataque, e o terceiro é o que muda o desenho:

1. **A precisão foi destruída pela expansão de vocabulário.** Uma seção inteira
   do `VOCABULARIO.md` disparava quando **uma** palavra de 4+ letras casava, e
   `semana` está em toda pergunta de planejamento. Medido:
   `--busca "quantas horas de sono por semana"` devolvia **0 de 40** claims sobre
   sono e punha **V170-34/V170-33 — *supinar seis dias por semana* — em 1º e 2º**.
   *Para um atleta com o peitoral rompido há quatro meses.* Consertado no mesmo
   dia (`longas.every`), e **nada travava o conserto**.
2. **`TETO_VIZINHANCA` era os dois lados da comparação.** O canário importava a
   constante da ferramenta que ele mede: `40 → 400` deixava o `check:kb` inteiro
   verde.
3. **`busca.test.mjs` roda sobre 12 claims sintéticas** e não cobre a fiação:
   `const relaxada = false` apagava a vizinhança inteira e os 35 casos passavam.

E o caso que decidiu o desenho: **`descanso-entre-series`**.
`--busca "quanto descansar entre as séries"` devolvia, do conjunto todo, **só
G015-11** — `relato-de-programa` do GZCLP, exatamente a gaveta que esta base
manda nunca tratar como prescrição. `--topic descanso-entre-series` devolve as
**12** na hora, com `param` tipado em minutos.

> **A base já tinha resolvido o problema que a busca livre estava tentando
> resolver.** Existe um vocabulário **FECHADO de 74 tópicos**, declarado no
> `PROTOCOLO-EXTRACAO.md`, cobrado pelo `check-claims.mjs` em **toda** claim.

O roteamento certo é **pergunta → tópico → claims**, e ele é melhor por três
razões — a terceira é a que decide:

1. **o alvo é fechado e pequeno**: 74 gavetas, não 6.912 textos;
2. **mapear pergunta a assunto é o que um modelo faz bem**, e a base já mapeou
   cada claim ao assunto dela uma vez, na extração;
3. **um compilador pode conferir o resultado.** Tópico inventado é **erro**, não
   silêncio. Uma busca por texto que erra devolve lixo plausível; um roteamento
   que erra devolve um nome que ou está na lista fechada ou é recusado por
   `rotasValidas()` — e `responder()` **lança** se algum passar.

O texto livre não sai de cena: ele **desce um nível**. Deixa de ser a porta e
vira a **ordenação dentro do tópico**, medida com `df` recontado **dentro** do
tópico (`subIndice`) — porque `squat` não distingue nada entre 990 claims de
agacho.

---

## 11. A FERRAMENTA — `research/tools/roteador.mjs`

### 11.1 De onde vem o sinal do mapeamento — três canais, nenhum inventado

| canal | o que é | cobertura |
|---|---|---|
| **corpus** | para cada tópico, quais raízes aparecem MUITO nele e pouco fora (`perfilarTopicos`, `pesoDoTermo`) | **os 74**, sem ninguém escrever nada |
| **nome do tópico** | dado da lista fechada: `descanso-entre-series` casa a pergunta que diz "descanso entre séries" | os 74 |
| **`VOCABULARIO.md`** | expressão de duas palavras ou mais, casada INTEIRA, **confirma** um tópico | 10 dos 74 |

O peso de um termo para um tópico é **frequência dentro × log do lift**.
`log(lift)` sozinho premia o acidente (uma raiz em 2 claims da base, as duas no
mesmo tópico, teria lift 3.000); multiplicar pela frequência dentro é o que
transforma *"esta palavra é rara fora"* em *"esta palavra é a palavra deste
assunto"*. Lift ≤ 1 vale **zero**, e não negativo: palavra comum não é evidência
CONTRA um assunto.

**O canal do corpus fecha de graça o buraco que o §8.1 declarou inalcançável.**
`ciclo` e `cycle` não compartilham raiz nenhuma e nenhuma radicalização os junta
— mas **as duas são fortemente distintivas de `periodizacao`**, porque a claim é
pt-BR e o `verbatim` é inglês e as duas línguas moram no mesmo tópico. Medido:
`assinaturaDoTopico(PERFIS, 'periodizacao')` traz `ciclo` **e** `cycle`, e há um
caso em `roteador.test.mjs` que exige isso. **Sem dicionário e sem embedding.**

**O uso do `VOCABULARIO.md` aqui é o OPOSTO do que quebrou a precisão em 09/08.**
Lá ele **injetava termos na consulta**; aqui ele apenas **confirma um tópico**.
Confirmação errada custa um nome a mais numa lista de no máximo cinco, impressa
com o termo e a contagem que a justificam. Injeção errada custava *supinar seis
dias por semana* no topo de uma pergunta sobre sono.

### 11.2 A família de prefixo, e por que ela existe SÓ no roteamento

A pergunta é escrita por humano e conjuga (*agachando*, *supinar*, *descansar*);
a base é declarativa e nomeia (*agachamento*, *supino*, *descanso*). A
radicalização de `busca.mjs` é plural e só plural — de propósito, porque stemmer
erra em silêncio dentro de um texto metade inglês.

Aqui a assimetria é legítima, e vale escrever por quê: **o custo de um erro de
prefixo no roteamento é limitado e visível.** No pior caso acrescenta um nome a
uma lista curta, que sai impressa com a justificativa e que um compilador confere
contra a lista fechada.

A regra é a mais burra que resolve: **5 letras iniciais em comum, valendo ≥ 0,6
da palavra mais curta, com diferença de comprimento ≤ 5.** Os três números foram
medidos nos dois sentidos antes de serem escritos:

- casam: `agachando`/`agachamento`, `descansar`/`descanso`, `treinando`/`treino`,
  `peitoral`/`peito`, `joelheira`/`joelho`;
- **não** casam: `powerlifting`/`powerbuilding` (5 de 12 — dois assuntos com
  opinião oposta um sobre o outro nesta base), `power`/`powerlifting` (diferença
  7 — sem esta terceira condição, *"preciso fazer cardio treinando
  powerlifting?"* roteava para `powerbuilding` (5 claims) na frente de `cardio`
  (230)), `pesado`/`pesagem`, `cinto`/`cintura`, `banco`/`bancada`,
  `morto`/`morte`.

### 11.3 Os dois canais que NÃO são roteamento, e por que saem em seções próprias

**O NOME DO PARAM.** `peso_por_rpe_min` não é prosa: é o dado que a Q11
procurava, tipado, com `frame` e unidade. Uma pergunta que diz *"quanto **peso**
quando o **RPE** vem acima do alvo"* nomeia **duas** peças desse nome — e a claim
que carrega o param é a resposta **mesmo quando a prosa dela não compartilha
verbo nenhum com a pergunta** (a claim diz *subir*; a pergunta diz *baixar*).
Duas peças e não uma, porque `peso` sozinho está em metade dos params da base.

Ele sai como seção própria e não misturado ao roteamento, e a razão é medida:
bônus multiplicativo dentro do tópico levantou o alvo da Q11 de 72º para 47º
(ainda fora da tela) **e empurrou o alvo da Q19 para fora**. Canal separado só
acrescenta.

**A PÁGINA AO LADO.** É a regra 3 do protocolo do §5, e a porta nova **nasceu
sem ela** — a medição de 10/08 mostrou o custo: V033-05 (*"3 % para mim, que
agacho 800 lb, são 25 lb"*) **não chega por canal nenhum**. `pct_por_rpe` nomeia
uma peça só, e a prosa dela fala de 800 lb e 25 lb, não de RPE. Ela chega por ser
a claim **imediatamente adjacente** a V033-04, no mesmo vídeo.

`vizinhosNoMesmoSrc` é **uma função só, usada pelas duas portas** — duas cópias
divergiriam em silêncio, que é o modo de falha nº 3. Extraí-la obrigou a
consertar dois defeitos que a versão embutida tinha:

- **corte por ordem de fila.** Servir cada foco até o limite antes de passar ao
  próximo faz o primeiro comer o orçamento inteiro: medido, os seis primeiros
  focos do canal de param consumiam as 12 vagas e V033-05 nunca era alcançada.
  É o mesmo defeito que esta ferramenta denuncia no banner de alargamento de
  filtro, cometido dentro dela.
- **ordem de arquivo decidindo distância.** *Abrir a página ao lado* é literal:
  o vizinho de distância 1 vem antes do de distância 2. Sem ordenar, quem
  decidia era a ordem de varredura, e a claim anterior ganhava da seguinte por
  acidente.

### 11.4 A etiqueta erra, e a afinidade é quem conserta

O `topic` foi escrito claim a claim, por lote, por agentes diferentes. Ele é
fechado e é conferido pelo compilador — **mas conferido contra a lista, não
contra o conteúdo**. Medido, e é o caso que originou a peça:

> **V038-07** — *"pode haver benefício em descansar 8 minutos em vez de 5"*,
> `GERAL`, `descanso_longo=8 min` — está etiquetada `recuperacao, agacho, terra`.
> **Não** está em `descanso-entre-series`. **V074-10** — *"descansar 10 minutos
> ajuda o agacho"* — idem.

Rotear para `descanso-entre-series` e olhar só as 12 claims declaradas devolve
**uma** das três que a pergunta pedia. **Roteamento puro por etiqueta herda todo
erro de etiquetagem, em silêncio** — o mesmo modo de falha da camada de ontem com
outra roupa.

A `afinidade` é o perfil do tópico aplicado de volta a cada claim: *esta claim
fala como as claims deste tópico falam?* A saída marca **`declarado` × `afim`**
de forma diferente, porque afirmar que uma claim está num tópico em que ela não
está é uma mentira barata de contar e cara de descobrir. E a claim afim vale
**0,6** da declarada: sem o desconto, *"quantas horas de sono por semana"*
devolvia em 1º, 2º e 4º claims de `cardio` — porque `hora` é raro dentro do
conjunto de `sono` e "horas de cardio" casava melhor que "dormir". **0,6 e não
zero**, porque eliminar seria a trava estreita do modo de falha nº 2, e é por
aqui que as claims da C20 que a etiqueta esqueceu entram.

**Tópico forçado não ganha afins**, e a assimetria é a razão de a afinidade
existir: ela conserta a etiqueta quando o ROTEADOR está adivinhando a gaveta;
quando um humano digita `--topic cinto`, ele não está adivinhando. Medido:
`cinto` tem 54 claims declaradas, e com 60 afins junto o par F001-83/F001-84 (as
duas dimensões do regulamento IPF, tier O, tipadas) caía para 64º e 67º.

---

## 12. OS DOIS CASOS QUE MORDEM

### 12.1 A pergunta que não mapeia para tópico nenhum

**Dizer isso é melhor que devolver lixo** — e há **duas** maneiras de não mapear,
que mandam consertos opostos. É a mesma distinção `vazio` × `pobre` do §3.5, um
nível acima, e a `MEDICAO-02` §2.2 mediu que confundi-las custa uma rodada de
aquisição inteira.

```
$ node research/tools/check-evidence.mjs --pergunta "qual a capital da França?"
  palavras de assunto: capital franca
  ⚠  2 NÃO existe(m) em claim nenhuma: capital, franca

  ⚠  ESTA PERGUNTA NÃO MAPEIA PARA NENHUM DOS 74 TÓPICOS.
     FORA DE DOMÍNIO: nenhuma palavra de assunto desta pergunta aparece em
     claim nenhuma. A base não fala disto, e dizer isso é a resposta certa.
```

```
$ node research/tools/check-evidence.mjs --pergunta "quem ganhou o Oscar de melhor filme?"
  ⚠  ESTA PERGUNTA NÃO MAPEIA PARA NENHUM DOS 74 TÓPICOS.
     SEM ASSUNTO: as palavras existem na base, mas nenhuma DISTINGUE um tópico
     — são palavras que aparecem em todo lugar. Reescreva a pergunta com o
     substantivo do assunto (o exercício, a variável, o equipamento), ou use
     --topic <tópico> para escolher a gaveta você mesmo.

     os mais próximos, TODOS abaixo do piso de 0.65:
       bulking                  0.61  (ganhou)
       …
     ISTO NÃO É "A BASE NÃO TEM". É "esta pergunta não achou a gaveta".
```

A última linha é deliberada: **a recusa do roteamento nunca pode ser lida como
lacuna de conteúdo**, que é o erro que a `MEDICAO-02` orçou uma rodada contra.

**O piso é 0,65, e ele é julgamento com a medição ao lado.** As duas populações
que o fixam moram no `ROTAS.json` — 25 perguntas na voz do atleta que **têm** de
mapear, 10 que **não podem** —, e foram escritas **antes** de o piso ter valor.
`check-rotas.mjs` roda as duas a cada execução e reporta a margem:

```
ℹ  calibração do piso: 25 perguntas de dentro (menor score 0.72) × 10 de fora (maior 0.61)
```

**A margem é estreita de um lado só, e está escrita para não ser confundida com
folga**: o pior caso de fora é *"quem ganhou o Oscar de melhor filme?"*, porque
`ganhou` é palavra desta base (ganhar peso, ganhar massa). Se as duas populações
se cruzarem, o checker **recusa** com a mensagem certa: *não existe piso que
separe as duas; o roteamento precisa de sinal NOVO, não de um número diferente.*

E **a trava não sabe qual é o piso**: ela afirma *"toda pergunta de dentro mapeia,
nenhuma de fora mapeia"*, que é a coisa que se quer verdadeira. Mover o piso para
qualquer lado quebra um dos dois lados.

### 12.2 A pergunta que mapeia para tópico grande demais

`agacho` tem **990**. Três coisas saem na tela, e nenhuma é "confie no rank":

1. **o tamanho, ao lado do nome** (`← GRANDE`), porque ver 40 de 990 não é ver o
   assunto;
2. **a gaveta INTEIRA como comando**, com a nota `(cabe numa leitura)` quando o
   tópico é pequeno. Para `cinto` (54) **ver tudo é estritamente melhor que
   ranquear**;
3. **o estreitamento que de fato funciona**: entre as claims que a pergunta
   puxou, quais **outros** tópicos aparecem junto — com o comando pronto.
   **Cruzar dois tópicos é filtro de conjunto, verificável — não mais uma
   palavra.**

E a ordenação interna usa raridade recontada **dentro** do tópico, mais o peso da
rota **ao quadrado** da razão para o primeiro colocado: um segundo tópico com
70 % do score contribui com 49 %, um com 40 % contribui com 16 %. Isso admite o
tópico secundário (recall) sem deixá-lo disputar o topo da tela (precisão).
Linear, o quarto tópico de uma lista empatada empurrava claim de outro assunto
para o 1º lugar — **que é o defeito de 09/08 com outra roupa**.

---

## 13. A PROVA — contra os casos MEDIDOS, com o comando e a saída

Posições medidas em 10/08/2026 contra as 6.912 claims. `lista` é a lista roteada
(40 na tela: 8 inteiras + índice); `param` é o canal do nome do param (12 na
tela); `ao lado` é a página ao lado.

### 13.1 Q05 — `six times` × `six days a week`

```
$ node research/tools/check-evidence.mjs --pergunta "posso supinar seis vezes por semana?"

  ROTEOU PARA 2 de 74 tópicos do vocabulário FECHADO:

     frequencia  ·  score 1.99  ·  245 claims etiquetadas  ← GRANDE
         0.81  semana                       em 124 das 245 claims do tópico, 669 na base
         0.50  vezes por semana             VOCABULARIO.md
         0.46  vez                          em 66 das 245 claims do tópico, 315 na base
         0.14  supinar → supino             em 45 das 245 claims do tópico, 557 na base

     supino  ·  score 1.83  ·  694 claims etiquetadas  ← GRANDE
         1.25  supinar → supino             em 429 das 694 claims do tópico, 557 na base
         0.90  supino                       nome do tópico
   …
   4º  frequencia + supino
      V170-34  R170@07:30  tier:R scope:GERAL modo:prescricao genero:aula explicit
        A chave para o supino é seis dias por semana ou outra frequência alta, bem
        submáximo, alto volume, mais muito trabalho acessório de hipertrofia.
        params: freq_supino=6 dias/semana [x_semana]
        condições: V170-36, V170-44
```

**V170-34 em 4º, V175-53 em 7º.** A pergunta nunca disse `six`, `days` nem
`week` — disse *"supinar seis vezes por semana"*. E as duas `conditions` que
desarmam V170-34 saem junto, que é o caso canônico do `SCHEMA.md`.

### 13.2 Q16 — o ciclo, e o par `ciclo`/`cycle` sem dicionário

```
$ node research/tools/check-evidence.mjs --pergunta "quanto tempo deve durar um ciclo de treino?"

     periodizacao  ·  score 1.01  ·  332 claims etiquetadas  ← GRANDE
         0.53  ciclo                        em 90 das 332 claims do tópico, 250 na base
         0.50  ciclo de treino              VOCABULARIO.md
         0.14  treino                       em 55 das 332 claims do tópico, 465 na base
```

**V070-20 em 1º, V125-07 em 7º, V108-08 em 14º.** Os três dentro da tela.

**V125-07 é o caso que o §8.1 declarava inalcançável** — *"16 semanas é a duração
ótima de um ciclo de treino"*, com `param duracao_ciclo=16`. Pela porta livre ela
saía em **60º** a partir de `training cycle length`, fora do teto de 40, e o §8.1
escreveu, com todas as letras, que *"a ferramenta não fecha este caso"*. **Ela
está fechada.** O que a fecha não é vocabulário novo: é a gaveta.

### 13.3 Q19 — doze ids depois, no mesmo vídeo

```
$ node research/tools/check-evidence.mjs --pergunta "quantas séries por músculo por semana?"

  ROTEOU PARA 5 de 74: proximidade-da-falha(132), frequencia(245), series-reps(367),
                       hipertrofia(355), volume(750)
```

**V010-13 em 25º**, dentro da tela, no índice compacto. A `ONDA-2B` §10 registrou
este caso como *"destravado, frágil"* pela porta livre; aqui ele é estrutural — a
claim mora nas gavetas que a pergunta abriu.

**E é o caso que mostra por que a cobertura não pode ser trava estreita:** com
piso de cobertura valendo para todo canal, esta pergunta roteava para `taper` (só
`semana` casou) e para `descanso-entre-series` (só `serie`), e os dois ocupavam
as vagas de `hipertrofia` e `volume` — onde V010-13 mora. Coincidência de uma
palavra não é assunto; nome de gaveta é.

### 13.4 Q11 — o filtro de segurança, e a formulação REALISTA

A `ONDA-2B` §10 registrou que a Q11 na formulação realista devolvia **zero** de
V033-03/04/05 pela porta livre, e que o C19 só passava porque a busca cega dele
(`2 a 3%`) **já contém a resposta** — *nenhum agente digita `2 a 3%` sem já saber
o número*.

```
$ node research/tools/check-evidence.mjs --pergunta "quanto baixar o peso quando o RPE vem acima do alvo?"

  O NOME DO DADO, NÃO A PROSA — 20 claim(s) têm `param` cujo NOME contém
  duas ou mais palavras da sua pergunta.

    V033-04   PESSOAL fato    aula   No agacho e no terra ele fica na ponta alta dessa faixa, 3% por RPE.
                                     [peso_por_rpe=3]   ← nomeia: peso + rpe
    V033-03   PESSOAL fato    aula   Para ele, subir 1 RPE na barra corresponde a cerca de 2 a 3% de peso.
                                     [delta_rpe=1 peso_por_rpe_min=2 peso_por_rpe_max=3]   ← nomeia: peso + rpe

  A PÁGINA AO LADO — 20 claim(s) adjacentes, no MESMO vídeo, ao que já saiu acima.

    V033-05   PESSOAL fato    aula   Para ele, que agacha e puxa 800 lb, 3% equivale a cerca de 25 lb.
                                     [pct_por_rpe=3 carga_referencia=800 equivalente_kg_lb=25]   ← ao lado de V033-04
```

**As três, sem que a pergunta contenha o número.** V033-03 em 12º e V033-04 em
10º **no canal de param**; V033-05 **pela página ao lado**. Nenhuma delas sai
pela lista roteada — o assunto delas é `rpe`, mas o que as identifica é o **nome
do dado**, não a prosa.

E a razão de fundo continua valendo, impressa em toda saída roteada: **nenhum
filtro de `modo`/`scope`/`tier` é aplicado no roteamento.** As três são
`PESSOAL` + `fato`. Filtro de segurança estreita a SAÍDA, não a busca.

### 13.5 O C20, que a camada de ontem não resolvia

```
$ node research/tools/check-evidence.mjs --pergunta "quanto descansar entre as séries?"
  ROTEOU PARA 1 de 74: descanso-entre-series (12 claims)  (cabe numa leitura)
```

**V074-23 em 6º, V038-07 em 16º, V074-10 em 20º** — e duas delas **não estão
etiquetadas** no tópico (§11.4). Pela porta livre, esta pergunta devolvia só
G015-11, `relato-de-programa` do GZCLP.

**C20 continua vermelho pela porta velha** e por isso continua em
`CANARIOS-CANDIDATOS.json`, fora do `check:kb`, como manda a regra: canário
vermelho de nascença dentro do build é como se desliga uma trava. O caso está
fechado **pela porta nova**, e é o T05 do `ROTAS.json` que o cobra.

### 13.6 Q14 — o caso que o §8.4 recusou virar canário

```
$ node research/tools/check-evidence.mjs --pergunta "qual profundidade o agacho precisa ter para valer na competição?"
  ROTEOU PARA 3 de 74: profundidade(87), agacho(990), competicao(457)
```

**G029-28 em 8º** (era 22º) e **G027-31 em 19º** (era 49º). **G029-18 continua
fora**, e não vou fingir que não. O §8.4 diagnosticou este caso como *"tópico
errado, não vocabulário"* — o diagnóstico estava certo, e é por isso que dois dos
três subiram. O terceiro é dívida, registrada no §16.

---

## 14. AS TRAVAS — e as duas regras de higiene, cumpridas e conferidas

### 14.1 `research/kb/ROTAS.json` + `research/tools/check-rotas.mjs`

14 canários sobre a **base real**, dentro do `npm run check:kb`, em três famílias
que apontam em direções **opostas**:

| família | quantos | o que cobra |
|---|---|---|
| `mapeia` | 9 | **recall** — a pergunta abre as gavetas NOMEADAS e os ids saem dentro do teto |
| `sem-injecao` | 3 | **precisão** — ids de outro assunto **não** podem aparecer |
| `nao-mapeia` | 2 | **recusa** — e com o `motivo` certo, porque `fora-de-dominio` e `sem-assunto` mandam consertos opostos |

`--rotas <arquivo>` existe para que **um conjunto de canários escrito por outra
pessoa, que este autor nunca viu, possa ser rodado sem tocar em código**. É a
única forma honesta de medir alcance: canário escrito por quem fez a ferramenta
mede a ferramenta contra si mesma.

### 14.2 Regra 1 — nenhuma trava lê a constante que ela verifica

**Violada em dois lugares, consertada nos dois.**

- **`check-rotas.mjs` não importa constante nenhuma de `roteador.mjs`** — só
  funções. O teto é `tetoDeTela`, campo do `ROTAS.json`, e **a ausência dele é
  ERRO**, não um default silencioso vindo da ferramenta (que seria a mesma trava
  com uma linha a menos).
- **`check-canarios.mjs` importava `TETO_VIZINHANCA` de `busca.mjs`** — a
  ferramenta que ele mede — e o escrevia na mensagem de falha. Corrigido:
  `tetoDeTela` passou a morar no `CANARIOS.json` (no topo, com override por
  `buscaCega.tetoDeTela`), a ausência é erro, e `check-canarios.test.mjs` ganhou
  **três casos que neutralizam os dois lados**: um exige a recusa quando o campo
  some, e dois exigem que **o número impresso seja o do arquivo** (1, 7 e 3 —
  nunca 40).

**Conferido neutralizando os dois lados**, que é a instrução do `ONDA-2B` §1.1:

| mutação | antes de 10/08 | agora |
|---|---|---|
| `TETO_VIZINHANCA 40 → 400` em `busca.mjs` | `check:kb` **verde** | **inerte** — o checker não lê mais essa constante |
| `tetoDeTela 40 → 5` no `CANARIOS.json` | (campo não existia) | **C16 e C18 vermelhos**, com `dentro das 5 primeiras` na mensagem |
| `tetoDeTela` removido | (campo não existia) | **exit 2**, com a mensagem que nomeia o defeito |

### 14.3 Regra 2 — teste sobre corpus sintético não prova recuperação

`roteador.test.mjs` é dividido **explicitamente**: a primeira metade testa as
peças sobre um corpus de bolso (um teste de peça precisa de um corpus cujo
conteúdo ele conheça exatamente); **a segunda metade chama `responder()` — a
mesma função da CLI e do `check-rotas.mjs` — sobre `research/extract/*.jsonl`**,
e afirma coisas que só são verdadeiras se o caminho inteiro estiver ligado.
46 casos, e **nenhum número esperado é importado de `roteador.mjs`**.

### 14.4 A família `sem-injecao` quase virou vaga ocupada — e o que se fez

Isto é o achado mais desconfortável desta rodada e ele fica escrito.

**Rodei 14 mutações contra `roteador.mjs`** — teto, piso, fração, `MAX_TOPICOS`,
afinidade, `TETO_AFINS`, canal de param, peso do nome, cobertura, peso da rota ao
quadrado, e combinações. **Nenhuma delas fez T09/T10/T11 acusarem.** As
regressões que existem aparecem como **perda de recall na família `mapeia`**:

| mutação | quem mordeu |
|---|---|
| `MIN_PECAS_DO_PARAM 2 → 9` (canal de param desligado) | T04 |
| `TETO_AFINS 60 → 0` (afinidade desligada) | T05 |
| `PESO_NOME 0.9 → 0` | T08 |
| cobertura desligada (`score` = soma pura) | T03 |
| `PESO_AFIM 0.6 → 1` + `TETO_AFINS 600` | T05 |
| peso da rota linear em vez de ao quadrado, **+** `FRACAO 0,05` **+** `MAX 20` | T02, T05 |
| tudo junto | T01, T02, T05 |
| `PISO_ROTA 0.65 → 0.2` | **calibração** (duas perguntas de fora mapearam) |
| `vizinhos = []` (página ao lado desligada) | T04 **e** 2 casos de `roteador.test.mjs` |
| `TETO_ROTEADO 40 → 400`; `FRACAO 0.4 → 0.05`; `PESO_AFIM 0.6 → 0`; peso linear sozinho | **ninguém** |

> **CORREÇÃO DE 10/08, à noite — esta tabela errava 2 das 4 mutações que declarava
> verdes, e a lista não era confiável como lista.** Rerodadas uma a uma pelo
> ataque cego: `TETO_ROTEADO 40 → 400` dá **VERMELHO** (`roteador.test.mjs`, caso
> *"a saída PADRÃO cabe"*) e `PESO_AFIM 0.6 → 0` dá **VERMELHO** (caso
> *"fiação: alça"*). Sobrevivem de verdade só `FRACAO_DO_MELHOR 0.4 → 0.05` e o
> peso da rota linear — e a elas somavam-se **duas que esta tabela não listava**,
> `DETALHE_ROTEADO 8 → 0` e `PESO_NOME_COMPOSTO 1.2 → 0`. As duas foram fechadas
> no mesmo dia (§18). Uma lista de buracos conhecidos escrita por quem fez o
> conserto não é medida: é o modo de falha nº 5 desta casa em forma de tabela.

A razão de T09/T10/T11 não morderem é estrutural e é boa notícia: **o roteamento
não chama `expandirPorVocabulario`**, então a injeção de 09/08 é impossível pela
porta nova. Só que o defeito **continuava vivo do outro lado** — e nada o media:

```
$ sed -i '' 's/longas.every/longas.some/' research/tools/busca.mjs
$ npm run check:kb     # → exit 0, VERDE, com V170-34 de volta ao topo de "sono"
```

**Um canário que nenhuma mutação faz morder ocupa a vaga.** O conserto foi fazer
a família cobrar **as duas portas**: campo `tambemPelaBuscaLivre` no `ROTAS.json`,
e os mesmos `proibidos` passam também por `recuperar()`, que é o que `--busca`
usa. Depois disso:

```
✗ rota T09: PRECISÃO REGREDIU NA BUSCA LIVRE — --busca "quantas horas de sono por
  semana?" devolveu V170-34, V170-33, V175-53, que é de outro assunto.
✗ rota T10: … "quando fazer deload na semana?" devolveu V170-34, V170-33 …
✗ rota T11: … "quantas calorias por dia na semana de corte de peso?" devolveu … 
✗ 3 problema(s) em 14 canário(s) de roteamento
```

Revertida a mutação, os 14 voltam a verde. **É o item §2 do `ONDA-2B` fechado —
não pela família nova que aquele item propôs, e sim no lugar onde o defeito de
fato mora.**

**O que continua sem trava, e está escrito para não ser esquecido:** quatro
mutações da tabela acima passam verdes. Três delas afrouxam o roteamento sem que
nenhum id errado apareça (medido: com `FRACAO 0,05` e `MAX 20`, *"quantas horas
de sono por semana"* roteia para 10 tópicos e **ainda assim** não devolve
V170-34, porque o peso ao quadrado reduz `frequencia` a 4,6 % de contribuição).
`TETO_ROTEADO 40 → 400` é inerte por construção (regra 1). **Isto não é prova de
que não há um quinto buraco.**

---

## 15. AS DUAS PORTAS, e qual se abre primeiro

| | `--pergunta` (10/08) | `--grep` / `--busca` (09/08) |
|---|---|---|
| resolve | pergunta → **tópico** → claims | pergunta → **texto** |
| alvo | **fechado**, 74 nomes | aberto, 6.912 textos |
| erro | **recusado por compilador** | resultado ruim que passa por bom |
| use para | *"do que a base fala quando eu pergunto isto?"* | *"quem diz exatamente isto?"* |
| trava | `check-rotas.mjs` (**15**) + `roteador.test.mjs` (46) | `busca.test.mjs` (35) |
| trava comum | `check-canarios.mjs` — **37** canários, dos quais **18** medem esta porta (`perguntaDoAtleta`) e 4 medem a livre (`buscaCega`) | idem |

**As duas continuam existindo, e isso não é indecisão.** `--grep` é o instrumento
certo para conferir uma citação, e é o que os canários `presente-escondido` usam
como busca cega — eles precisam da busca **literal** que a medição registrou. A
mudança é qual porta um agente abre primeiro para responder ao atleta, e a
resposta é: **a nova**.

O protocolo do §5 continua valendo inteiro, com uma linha na frente:

> **0. Comece por `--pergunta`.** Se ela não mapear, leia qual das duas recusas
> saiu antes de escrever qualquer coisa: `fora-de-dominio` e `sem-assunto`
> mandam consertos opostos, e nenhuma das duas é *"a base não tem"*.

---

## 16. O QUE A CAMADA NOVA **NÃO** RESOLVE — medido em 10/08

1. **G029-18 (Q14) continua fora da tela.** Dois dos três subiram (§13.6); o
   terceiro não. O `## tecnica` e o `## setup` continuam sem seção no
   `VOCABULARIO.md`, e a dívida do §8.4 continua aberta.
2. **A margem do piso é de 0,11, e estreita de um lado só.** `ganhou` é palavra
   desta base. Uma pergunta de fora escrita com mais palavras ambíguas pode
   atravessar. O que existe contra isso é a calibração de 25 × 10 rodada a cada
   `check:kb`, e ela **recusa** quando as duas populações se cruzam — o que é
   melhor que um número diferente, mas não é uma prova.
3. **A afinidade admite 60 claims não etiquetadas por tópico.** É o que conserta
   a etiqueta esquecida (V038-07) e é, por construção, uma porta lateral. Ela sai
   marcada `(afim)` na tela e vale 0,6 — mas quem lê depressa vai ler `afim` como
   `declarado`.
4. **O roteamento não conhece `conditions`.** Ele acha V170-34; o que a torna
   segura para este atleta são as `conditions` (V170-36, V170-44) e o `modo`, que
   o formatador imprime **sempre**. **O determinismo desta camada prova fidelidade
   à recuperação, não correção da fonte.** V170-34 continua sendo *"supine seis
   dias por semana"* dito por um homem que não compete testado, para um atleta com
   o peitoral rompido há quatro meses.
5. **Não existe estimativa de recall na base inteira.** Para tê-la seriam
   precisos muito mais que 14 pares (pergunta, ids corretos). **Este documento
   prova que os buracos conhecidos fecharam. Ele não prova que não há um quinto.**
6. ~~**Quatro mutações passam verdes** (§14.4).~~ **Eram duas, e havia duas
   outras não listadas — e hoje NENHUMA das seis conhecidas passa verde.** Ver a
   correção no §14.4 e a tabela do §18.3. A lista conhecida ficou vazia, o que
   não é o mesmo que não haver uma sétima.
7. **O gargalo não é ordenação, é ROTEAMENTO — e o número é 7 de 18.** Ver §18.

---

## 17. Procedência da PARTE II

- **Arquivos novos:** `research/tools/roteador.mjs`,
  `research/tools/roteador.test.mjs` (46 casos, metade sobre a base real),
  `research/tools/check-rotas.mjs`, `research/kb/ROTAS.json` (14 canários + as
  duas populações de calibração).
- **Arquivos alterados:** `research/tools/check-evidence.mjs` (`--pergunta`,
  `--topic` forçado, a seção da página ao lado), `research/tools/busca.mjs`
  (`vizinhosNoMesmoSrc` extraída e compartilhada pelas duas portas, com os dois
  defeitos de seleção consertados), `research/tools/check-canarios.mjs` e
  `research/kb/CANARIOS.json` + `CANARIOS-CANDIDATOS.json` (`tetoDeTela` deixou
  de ser importado da ferramenta), `research/tools/check-canarios.test.mjs`
  (3 casos novos, 45 no total), `package.json` (`check:kb` encadeia
  `roteador.test.mjs` e `check-rotas.mjs`), este arquivo.
- **Base no momento:** **6.912 claims**, **74 tópicos**, contados por
  `check-claims.mjs` e `carregarTopicos(PROTOCOLO-EXTRACAO.md)`. Nenhum número
  desta parte veio de memória.
- **As mutações do §14.4** foram aplicadas, medidas e **revertidas** nesta
  sessão, uma a uma, com `check:kb` verde antes e depois.
- **`npm run check:kb`:** verde, exit 0 — 19 canários de conteúdo + **14 de
  roteamento** (9 mapeia · 3 sem-injecao · 2 nao-mapeia), 73 termos vivos e 26
  mortos no índice, 45 casos em `check-canarios.test.mjs`, 46 em
  `roteador.test.mjs`. **`npm run build`:** verde, exit 0. `eslint` limpo.
- **O que NÃO foi feito:** `AVALIACAO.md` continua **intocado** — o instrumento
  fica estável para a terceira medição. Nenhuma claim foi editada, nenhuma fonte
  foi ingerida, nenhum tópico foi acrescentado ao vocabulário fechado. Este
  trabalho é inteiramente de recuperação.

---

## 18. O ATAQUE CEGO DE 10/08 (à noite), e o que ele mudou

Um terceiro reescreveu 18 perguntas na **voz do atleta** — sem a palavra da
resposta dentro — e mediu esta camada contra elas. Os 18 pares (pergunta, ids)
entraram em `research/kb/CANARIOS.json` como família `presente-escondido` com o
bloco `perguntaDoAtleta` (P01–P18), **medidos e vermelhos**, e o placar sai
impresso a cada `check-canarios.mjs`:

```
  RECUPERAÇÃO PELA PORTA NOVA (--pergunta), medida e registrada:
    0 de 18 devolvem TODOS os ids esperados dentro do teto de tela
    3 de 18 devolvem ALGUM id esperado
    7 de 18 não roteiam para gaveta NENHUMA que contenha a resposta
```

### 18.1 A frase do construtor não é a frase do atleta

O §13 mede seis casos e diz que a camada os destrava. O ataque reproduziu
**dois** (Q05 e Q19). A diferença não está na camada, está na **pergunta**: as
frases da tabela do §13 já contêm a palavra da resposta — *quanto **baixar** o
peso*, *quanto tempo dura um **ciclo*** —, e quando a mesma dúvida é escrita como
o atleta a escreve (*"minha série de aferição veio em RPE 8 pela terceira semana
seguida, o que faço com a carga"*), Q11, Q14, Q16 e Q29 voltam a não achar nada.
**O §13 não está errado nos números; está errado no que os números medem.**

### 18.2 O defeito dominante é de roteamento, não de ordenação

Em 7 dos 18 (P02, P06, P09, P10, P14, P15, P16) **nenhum tópico roteado contém
um id esperado** — ordenar melhor dentro da gaveta não alcança uma claim que não
está no conjunto. O pior é o **P16**: `levantar peso já conta como exercício pro
coração` roteia para `peso-corporal` com 0,73 (piso 0,65) porque o `peso` de
*levantar peso* foi lido como peso **corporal**; `cardio` (onde V013-04/05/06
respondem exatamente isso) nunca abre, e a tela sai cheia, plausível e errada —
o mesmo lixo que a família `nao-mapeia` foi escrita para proibir, e que nenhum
canário pegava. **A precisão, essa, está boa** e não é onde gastar a próxima
onda: as três recusas testadas saem certas e com o motivo certo, e o piso é
cobrado dos dois lados (0,65 → 0,60 e 0,65 → 0,73 dão vermelho).

### 18.3 As três travas que estavam mortas, e as repro que passaram a falhar

| o que estava morto | repro que hoje falha |
|---|---|
| `DETALHE_ROTEADO 8 → 0` matava o canal inteiro da PÁGINA AO LADO com `check:kb` verde. O único teste que citava o canal (V033-05) passava porque V033-05 vem de `vizParam`, o **outro** canal. | `vizinhos` passou a declarar `canal`, e o T05 do `ROTAS.json` ganhou `viaPaginaAoLado: ["V003-18","V074-24"]` — o *5 min em agacho e terra, 3 no supino* e a condição de V074-23, que **só** chegam à tela por esse canal. `sed 's/DETALHE_ROTEADO = 8/= 0/'` → `check-rotas` exit 1. |
| `PESO_NOME_COMPOSTO 1.2 → 0` verde: nenhum caso dependia do nome composto da gaveta. | T15, `quanto vale a carga de treino da semana?`. Com o peso, `carga-de-treino` sai em 1º; com 0, o tópico **desaparece** e a pergunta cai em `[frequencia, taper, periodizacao, deload]` — que é exatamente o P14. `sed` → exit 1. |
| O `"tetoDeTela": 40` do **topo** do `ROTAS.json` era letra morta (todo caso carrega o seu), e `check-rotas.mjs:180` escrevia `teto: teto ?? 40` — o 40 hardcoded dentro da ferramenta que o arquivo diz não poder tê-lo. | O teto do topo é lido antes de qualquer caso e a ausência é erro de carga; o `?? 40` saiu. `sed 's/"tetoDeTela": 40,/"MORTO": 40,/'` → exit 2. |

**E as duas que a correção do §14.4 deixou de pé caíram sozinhas, pelos 18 canários
novos.** Rodadas depois de gravá-los, uma a uma, com reversão e `md5` conferido:

| mutação | quem morde hoje |
|---|---|
| `FRACAO_DO_MELHOR 0.4 → 0.05` | `check-canarios.mjs` — P02 passa a abrir `dor`, P05 ganha `ombros`, e outros; a **medida** muda e o registro acusa |
| peso da rota `** 2 → ** 1` (linear) | `check-canarios.mjs`, mesma via |
| `TETO_ROTEADO 40 → 400` | `roteador.test.mjs` |
| `PESO_AFIM 0.6 → 0` | `roteador.test.mjs`, `check-rotas.mjs` **e** `check-canarios.mjs` |
| `DETALHE_ROTEADO 8 → 0` | `check-rotas.mjs` (T05, `viaPaginaAoLado`) |
| `PESO_NOME_COMPOSTO 1.2 → 0` | `check-rotas.mjs` (T15) |

**Das seis mutações conhecidas, nenhuma passa mais verde.** Isso não quer dizer que
não há uma sétima — quer dizer que a lista conhecida ficou vazia, o que é o máximo
que uma lista pode dizer sobre si mesma. E note **por que** as duas primeiras caem:
não por uma trava escrita contra elas, e sim porque afrouxar o roteamento move a
medida de 18 perguntas reais. Um canário que registra uma medida ruim vale mais como
detector do que um que registra uma boa.

### 18.4 O canário que falha entra assim mesmo

`perguntaDoAtleta` não cobra **passar** — cobra que a **medida** continue a
mesma. `recuperados`, `abriuOTopico` e `gavetasComResposta` são registro, e
divergência é erro **nos dois sentidos**: melhorar também acusa. É a única forma
de um canário vermelho não virar verde em silêncio, e de o número deste veredito
não poder mudar sem alguém escrevê-lo. `check-canarios.test.mjs` tem 8 casos
novos (53 no total) que provam o mecanismo, incluindo os três que rodam o mesmo
canário com `tetoDeTela` 1, 2 e 3 e obtêm três listas diferentes — que é a prova
de que o limite de **posição** vem do canário, e não de `roteador.mjs`.

### 18.5 O item mais caro que continua aberto: Q03/P02

`fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?`
devolve 40 claims de peito/supino e **nenhuma** de V079-34, V001-06, V138-19,
V086-21 ou V027-23, pelas **duas** portas. A palavra `fisgada` não existe na base,
e a gaveta `dor` só abre quando a palavra literal *dor* está na pergunta. A
camada não responde nem certo nem errado: **responde com ar de completa**, sem
sinal nenhum de que existe um limiar de 2–3/10 e uma ressalva do outro lado.
Para este atleta — peitoral rompido, bloco de reexposição — é o caso que mais
custa. O `§9.3` chamava isto de *"de outro dono"*; não é: é o item 1 da
`ONDA-2C.md`.

---

### 18.6 Procedência do §18

- **Arquivos alterados:** `research/kb/CANARIOS.json` (18 canários
  `presente-escondido` novos, P01–P18, com `perguntaDoAtleta`; `_leia`
  ampliado), `research/tools/check-canarios.mjs` (o bloco da porta nova e o
  placar impresso), `research/tools/check-canarios.test.mjs` (segunda base de
  bolso + 8 casos, 53 no total), `research/tools/roteador.mjs` (`vizinhos`
  passou a declarar `canal`), `research/tools/check-rotas.mjs` (teto do topo
  cobrado, `?? 40` removido, `viaPaginaAoLado`), `research/kb/ROTAS.json`
  (T05 ganhou `viaPaginaAoLado`, T15 é novo — 15 casos), este arquivo,
  `research/kb/ESTADO.md`, `research/RUNBOOK.md` §8, `research/kb/ONDA-2C.md`
  (novo).
- **Nenhuma claim foi editada**, nenhuma fonte foi ingerida, nenhum tópico
  entrou no vocabulário fechado. `MEDICAO-02.md` mediu que o gargalo não é
  conteúdo.
- **As perguntas P01–P18 e os ids esperados foram escritos por um terceiro**, que
  não participou do conserto de 10/08, e chegaram em
  `research/kb/CANARIOS-ESCONDIDOS.json`. O que este passe fez foi torná-los
  executáveis e registrar a medida — não escolhê-los.
- **Verificação:** `npm run check:kb` exit 0 · `npm run check:gate` exit 0 ·
  `npm run build` exit 0 · `eslint` limpo nos arquivos tocados. As três mutações
  do §18.3 foram aplicadas, medidas, e revertidas com `md5` conferido.

---

# PARTE III — O ROTEAMENTO PASSOU A LER A VOZ DO ATLETA

**Data: 11/08/2026.** A PARTE II montou a arquitetura certa — pergunta → tópico
→ conjunto → ordenação, com alvo fechado e conferível por compilador — e a
encheu com o sinal errado. Esta parte troca o sinal. **Nada da arquitetura
mudou.**

## 19. O defeito era léxico, e era estrutural

O diagnóstico de 10/08 separou as duas doenças da camada, e esta onda atacou
**só a primeira**:

- **7 de 18 eram ROTEAMENTO:** o roteador nunca abria uma gaveta que contivesse
  a resposta.
- **~4 de 18 são SOTERRAMENTO:** a gaveta certa abre e a resposta sai em 945º de
  1.038. **Fora do escopo desta onda, de propósito.**

E o índice está CERTO — não é problema de etiqueta. As claims de dor estão em
`dor`, as de coração estão em `cardio`. Era o roteador que não abria.

### 19.1 Por que o casamento léxico não tinha como funcionar

O roteador de 10/08 tirava o sinal do **corpus**: para cada tópico, que raízes
aparecem muito nele e pouco fora. É uma boa medida de *"como esta gaveta fala"*
e é a medida errada para *"o que este atleta digitou"*. Os dois casos que
fecharam o diagnóstico são os dois lados do mesmo erro:

| caso | o que acontecia | por quê |
|---|---|---|
| `fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?` | roteava para `peito` e `supino`, 40 claims, **nenhuma** das cinco que carregam o limiar de dor | **`fisgada` não existe em claim nenhuma das 6.912.** A ferramenta AVISAVA isso (`⚠ 1 NÃO existe em claim nenhuma: fisgada`) e roteava errado assim mesmo. Sinal derivado do corpus é cego para a palavra que o corpus não tem — e a palavra que o corpus não tem é justamente a que o atleta usa quando está com medo. |
| `levantar peso já conta como exercício pro coração` | roteava para `peso-corporal` com 0,73; `cardio` (230 claims, V013-04/05/06 respondem isso) nunca abria | `peso` aparece em **141 das 238** claims de `peso-corporal`. O corpus não tem como saber que o `peso` de *levantar peso* é outro peso. **Ambiguidade silenciosa.** |

### 19.2 O artefato — `research/kb/GLOSSARIO-TOPICOS.json`

Oito agentes leram as 74 gavetas e escreveram `research/kb/entrada/lote-1.json` a
`lote-8.json`. `research/tools/build-glossario.mjs` consolida os oito num
artefato só e o `--check` dele roda dentro do `npm run check:kb`, então o
consolidado não pode divergir dos lotes em silêncio.

**Cobertura conferida:** 74 de 74 tópicos, um por tópico, todos dentro do
vocabulário fechado do `PROTOCOLO-EXTRACAO.md`. **1.988 termos** de entrada.
Nenhum lote faltou.

**Os defeitos que os lotes trouxeram, e o que foi feito com cada um** — a tabela
`CORRECOES` do gerador, seis linhas, cada uma com o motivo escrito:

| onde | o quê | por quê |
|---|---|---|
| `lesao.naoConfundirCom` | `dor-e-treino` → `dor` | `dor-e-treino` não existe no vocabulário fechado; é o nome de um DOCUMENTO. |
| `pico.naoConfundirCom` | `recorde` → `competicao` | `recorde` não existe no vocabulário fechado. A própria `comoDistinguir` do lote diz "estratégia de tentativas no dia do meet". |
| `sumo.entrada` | `sumô` e `terra sumo` removidos | chave repetida depois de normalizar. |
| `dor.entrada` | `caibra` removido | chave repetida (`cãibra`). |
| `cardio.entrada` | **`coração` acrescentado** | **é o único acréscimo, e o que mais precisa de desconto de quem for medir.** `coração` é a palavra do atleta para `cardio`, está no lote 3 (`condicionamento`: *correr pra saúde do coração*) e no lote 4 (`saude`: *saúde do coração*), e falta no lote 1, que escreveu `frequência cardíaca`, `batimento` e `fôlego` e pulou o órgão. Os três tópicos etiquetam as MESMAS claims (V013-04 é `cardio, condicionamento, saude`), então é inconsistência entre autores. Declarado para poder ser descontado. |

**O que ficou de fora:** `exemplosDePergunta`. Nenhuma das duas portas precisa
deles, e um dos exemplos do lote 1 é, palavra por palavra, a pergunta do canário
P16. Artefato que carrega a pergunta do canário dentro é a trava que se testa a
si mesma pelo caminho mais barato.

### 19.3 O DESEMPATE — ambiguidade declarada é dado

**114 dos 1.988 termos são reivindicados por mais de um tópico.** Cada um sai com
uma regra: quem reivindica, quem `vence`, e o `porque`. A regra é aplicada na
montagem do índice — tópico que perde um termo não recebe nem o termo nem as
palavras dele —, então trocar um `vence` muda o roteamento.

E a regra não é um encolher de ombros: `coEtiquetadas` conta, **contra a base de
verdade**, quantas claims etiquetam cada par de vencedores ao mesmo tempo, e o
`check-glossario.mjs` **recusa** um `vence` cujo par nunca apareça junto numa
claim. Foi essa conta que achou a única colisão de verdade dos oito lotes:
`pegada fechada` é reivindicado por `bracos`, `pegada`, `setup` e `supino`, e
**`bracos` × `setup` = 0 claims**. Nesta base *close grip* é largura de pegada no
supino; o termo fica com `pegada` e `supino`, e quem procura tríceps digita
tríceps. As outras 113 são `ambos`, com o par mais fraco medido ao lado.

### 19.4 As DUAS PORTAS, e as duas leem o mesmo artefato

**Porta A — `--topicos`. É a que vale em produção.** Quem consome esta base é um
agente de conversa, ou seja, um modelo: ele não precisa de heurística, precisa
VER as 74 gavetas com a glosa e o tamanho, e escolher. São 74 linhas, cabe num
prompt.

```
$ node research/tools/check-evidence.mjs --topicos
  AS 74 GAVETAS DESTA BASE — escolha uma e abra
  6912 claims · glosas de research/kb/GLOSSARIO-TOPICOS.json
  ...
  cardio                  230  Responde sobre exercício aeróbico/condicionamento: quanto cardio fazer, qual modalidade, e o impacto do cardio na recuperação e nos levantamentos.
  carga-de-treino          13  responde o conceito de stress index (Tuchscherer): como quantificar e comparar o quanto um treino ou programa pesou...
  ...
  a gaveta inteira ....: node research/tools/check-evidence.mjs --topic <nome> --limit 0
```

`--topicos --verbose` acrescenta os termos de entrada e os vizinhos declarados de
cada gaveta.

**Porta B — `--pergunta`. É a que o `check:kb` mede**, porque não há chave de API
neste repositório e um teste que precisa de modelo não roda no compilador.

### 19.5 O mecanismo da Porta B — a raridade mudou de espaço

O roteador antigo pesava um termo por raridade **no corpus**. O novo pesa por
raridade **no glossário**: em quantas das 74 gavetas aquela palavra aparece. São
dois números diferentes, e o segundo é o que a pergunta pede:

```
coracao   → 3 gavetas de 74   → idf 0,745
fisgada   → 3 gavetas         → idf 0,745
peso      → 15 gavetas        → idf 0,371
treino    → 38 gavetas        → idf 0,155
```

**É aqui que o bug do `peso` morre.** Ele continua valendo alguma coisa — zerá-lo
seria a trava estreita do modo de falha nº 2 —, mas deixou de decidir sozinho.

Os canais, em ordem de força, e cada um sai impresso com o termo que o
justificou:

1. **glossário (frase inteira)** — `categoria de peso` casado por completo. Quem
   escreveu a frase já desambiguou.
2. **glossário (frase espalhada)** — as DUAS palavras do termo dentro de uma
   janela de cinco. É o que faz *de quantas em quantas semanas eu preciso pegar
   leve* achar `semana leve` e abrir `deload`.
3. **glossário (termo)** — a palavra É um termo de entrada, pesada pelo idf.
4. **nome do tópico** — inalterado desde 10/08.
5. **`VOCABULARIO.md`** — confirmação, inalterado.
6. **corpus, amortecido** — meio peso, multiplicado palavra a palavra pelo idf do
   glossário. **O corpus só fala sobre palavra que o glossário conhece.**
7. **`naoConfundirCom`** — o único canal em que uma gaveta fala de OUTRA: se `A`
   foi roteada e `A` declara que se confunde com `B`, e `B` casou alguma coisa
   sozinha, `B` sobe. Limitado pelo próprio score de `B`, para levantar candidato
   em vez de criar um.

A calibração do piso, re-medida com as mesmas duas populações escritas antes de o
piso ter valor: **menor de dentro 0,92, maior de fora 0,47**, piso em 0,65. Em
10/08 era 0,72 × 0,61.

## 20. A PROVA — os dois casos do diagnóstico, com o comando e a saída

### 20.1 A fisgada no peitoral

```
$ node research/tools/check-evidence.mjs --pergunta "fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PERGUNTA → TÓPICO → CLAIMS
  "fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  palavras de assunto: fisgada peitoral terceira serie supino pausado continuo
  ⚠  1 NÃO existe(m) em claim nenhuma: fisgada

  ROTEOU PARA 3 de 74 tópicos do vocabulário FECHADO:

     peito  ·  score 2.26  ·  31 claims etiquetadas
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic peito --limit 0   (cabe numa leitura)
         0.90  peito                        nome do tópico
         0.79  peitoral                     em 12 das 31 claims do tópico, 19 na base
         0.70  fisgada no peitoral          glossário (frase espalhada)
         0.22  supino                       em 20 das 31 claims do tópico, 557 na base

     supino  ·  score 1.71  ·  694 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic supino --limit 0
         0.90  supino                       nome do tópico
         0.70  supino com pausa             glossário (frase espalhada)
         0.25  supino                       em 429 das 694 claims do tópico, 557 na base
         0.05  peitoral → peito             em 39 das 694 claims do tópico, 62 na base

     dor  ·  score 1.64  ·  119 claims etiquetadas
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic dor --limit 0   (cabe numa leitura)
         0.80  peito e supino declara(m): não confundir com dor naoConfundirCom
         0.74  fisgada                      glossário (termo)
         0.42  continuo treinando com dor   glossário (dentro de frase)
         0.03  peitoral                     em 3 das 119 claims do tópico, 19 na base
```

**`dor` abre.** Ela não abria. E o que a abre é `fisgada` — a palavra que a
própria ferramenta declara não existir em claim nenhuma, na linha de cima da
mesma tela.

> **CORREÇÃO DE 12/08/2026 — o parágrafo abaixo estava errado, e o erro tinha
> causa.** Ele dizia *"`V079-34` e `V027-23`, duas das cinco claims que carregam
> o limiar de dor, chegam à tela"*. **É UMA, não duas.** Medido com o `telaDe()`
> do próprio `check-canarios.mjs`, que é a definição que o gate usa:
> **`V079-34` sai em 36º de 40** (linha comprimida do índice, prosa truncada, sem
> verbatim) e **`V027-23` sai na posição 56 — além do teto de 40.** `V001-06`,
> `V138-19` e `V086-21` não são recuperadas por canal nenhum. **A causa é a
> divergência de definição de tela** (RUNBOOK §8.44): o gate mede 40 e o CLI
> imprime 68, e quem escreveu a frase contou pela tela do CLI. O texto original
> fica abaixo, riscado, porque apagá-lo apagaria o rastro de que foi afirmado
> assim — modo de falha nº 5 desta casa, pela quarta vez.

~~`V079-34` e `V027-23`, duas das cinco claims que carregam o limiar de dor,
chegam à tela; `V001-06`, `V138-19` e `V086-21` continuam fora.~~ **Isso é o
soterramento, e está registrado como falha aberta no §21.**

Note também de onde vem o `0.80` de `dor`: `peito` e `supino`, as duas gavetas
que a pergunta abriu, DECLARAM no glossário que se confundem com `dor` —
`peito` escreve com todas as letras que *"QUALQUER sintoma no peitoral vai para
dor, mesmo mencionando a palavra peito"*. O aviso saiu de quem escreveu a gaveta,
não de um peso escolhido a dedo.

### 20.2 Levantar peso conta como exercício pro coração

```
$ node research/tools/check-evidence.mjs --pergunta "levantar peso já conta como exercício pro coração"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PERGUNTA → TÓPICO → CLAIMS
  "levantar peso já conta como exercício pro coração"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  palavras de assunto: levantar peso conta exercicio pro coracao

  ROTEOU PARA 5 de 74 tópicos do vocabulário FECHADO:

     selecao-exercicio  ·  score 0.80  ·  468 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic selecao-exercicio --limit 0
         0.40  ordem-exercicio declara(m): não confundir com selecao-exercicio naoConfundirCom
         0.26  qual variação pro ponto fraco glossário (dentro de frase)
         0.24  qual exercício fazer         glossário (dentro de frase)
         0.07  exercicio                    em 71 das 468 claims do tópico, 153 na base

     cardio  ·  score 0.74  ·  230 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic cardio --limit 0
         0.74  coração                      glossário (termo)
         0.24  fazer exercício aeróbico     glossário (dentro de frase)
         0.01  levantar → levantamento      em 9 das 230 claims do tópico, 163 na base

     series-reps  ·  score 0.70  ·  367 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic series-reps --limit 0
         0.50  contagem de reps             glossário (dentro de frase)
         0.37  quantas vezes levantar       glossário (dentro de frase)
         0.00  peso                         em 29 das 367 claims do tópico, 500 na base
         0.00  exercicio                    em 9 das 367 claims do tópico, 153 na base

     peso-corporal  ·  score 0.49  ·  238 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic peso-corporal --limit 0
         0.25  cardio e saude declara(m): não confundir com peso-corporal naoConfundirCom
         0.22  peso                         em 141 das 238 claims do tópico, 500 na base
         0.19  categoria de peso            glossário (dentro de frase)
         0.00  levantar → levantador        em 5 das 238 claims do tópico, 120 na base

     condicionamento  ·  score 0.46  ·  123 claims etiquetadas  ← GRANDE
        a gaveta INTEIRA: node research/tools/check-evidence.mjs --topic condicionamento --limit 0
         0.37  correr pra saúde do coração  glossário (dentro de frase)
         0.23  saude declara(m): não confundir com condicionamento naoConfundirCom
         0.01  levantar → levantamento      em 5 das 123 claims do tópico, 163 na base
```

**`cardio` abre em 2º com 0,74, e `peso-corporal` caiu para 4º com 0,49** — de
1º com 0,73. O `porQue` mostra a troca inteira: `coração` vale 0,74 (3 gavetas de
74) e `peso` vale 0,22 depois do amortecimento (15 gavetas de 74), contra 1,21
antes. `V013-04` e `V013-05` chegam à tela; o P16 saiu de zero ids para dois.

`selecao-exercicio` em 1º é ruído honesto e está declarado: ele vem de dois
termos de entrada casados por palavra solta mais um aviso de `ordem-exercicio`.
A gaveta certa abriu, que é o que esta onda foi consertar; qual delas sai em 1º é
ordenação.

## 21. O QUE ESTA ONDA **NÃO** RESOLVEU

1. **O soterramento.** `0 de 18` canários devolvem TODOS os ids esperados, exatamente
   como em 10/08. É a doença nº 2, é ordenação dentro do tópico, e mexer nela
   junto tornaria impossível dizer o que consertou o quê.
2. **O P10** (`com quanto por cento do meu melhor levantamento eu monto as
   porcentagens do treino`) continua sem abrir gaveta nenhuma que contenha a
   resposta — é o único dos sete que sobrou.
3. **`lesao` não abre na pergunta da fisgada.** Ela fica em 4º com **0,74** —
   ACIMA do piso de 0,65 — e perde no corte da fração (0,4 × 2,26 = 0,90), atrás
   de `peito`, `supino` e `dor`. Como as cinco claims de limiar estão TAMBÉM em
   `dor`, o custo medido é zero hoje; a assimetria está registrada em `T16.nota`
   no `ROTAS.json` para não ser confundida com sucesso.
   **Desde 12/08 a tela NOMEIA a gaveta que ficou de fora** (§21.1), então o
   leitor deixou de precisar deste parágrafo para saber que faltou olhar ali.
4. **A gaveta que não casou NADA continua invisível às duas portas.**
   `autorregulacao` etiqueta V001-06 e V138-19 — duas das cinco claims de limiar
   de dor — e não é nomeada na pergunta da fisgada nem pelo aviso novo, porque
   não pontuou por conta própria em canal nenhum. É a mesma condição que
   `rotear()` exige para o bônus de `naoConfundirCom` (*o aviso levanta um
   candidato, nunca inventa um*), e mudá-la só na tela criaria um segundo
   critério para divergir do primeiro. Fica aberto e escrito.
5. **A base continua sem uma única claim sobre quando uma lesão exige avaliação
   presencial.** Isso é conteúdo, não recuperação, e continua sendo o agravante
   mais caro deste corpus (`MEDICAO-02` §6.2).

### 21.1 O aviso da gaveta que não abriu — o que a tela passou a dizer

`rotear()` sempre calculou `candidatos`, e até 12/08/2026 essa lista só era
impressa no ramo do **"não mapeia"**: quando a pergunta não achava gaveta
nenhuma, a tela dizia o que quase achou; quando ela achava três de quatro, a tela
saía **cheia e muda**. É o pior dos dois, é o que o `RUNBOOK.md` §8.37 chamou de
*"responder com ar de completa"*, e agora a tela imprime:

```
  ⚠  GAVETAS QUE PONTUARAM E **NÃO** ABRIRAM — a tela abaixo não as inclui.
     Vagas: 3 de 5 · corte = 40 % do 1º lugar = 0.90 · piso de mapeamento = 0.65
       lesao                  0.74  acima do piso, perdeu a vaga no corte
       competicao             0.68  acima do piso, perdeu a vaga no corte  ←  supino declara(m) "não confundir com competicao"
       ombros                 0.52  abaixo do piso  ←  peito e supino declara(m) "não confundir com ombros"
     Uma tela cheia não é uma tela completa. Estas gavetas existem e não foram lidas.
```

**É DIAGNÓSTICO, não recuperação, e a distinção é o que o torna barato:** nenhuma
claim entra ou sai por causa dele. O bloco vive em `check-evidence.mjs`, não toca
`responder()` nem `idsMostrados` — que é o que os canários medem —, e a medida
dos 18 continuou **exatamente** a mesma depois dele (0/8/1/11).

Só entra gaveta que **pontuou sozinha**, e a regra é a mesma do bônus de
`naoConfundirCom` de propósito. Sem ela vira ruído, e foi medido: `descanso-entre-series`
declara que se confunde com `sono`, então *quanto descansar entre as séries* — a
pergunta mais bem roteada desta base, um tópico só, score 3,45 — passava a
imprimir `sono` como gaveta não lida.

## 22. AS TRAVAS, E A PROVA POR MUTAÇÃO

Duas travas novas no `npm run check:kb`:

- **`node research/tools/build-glossario.mjs --check`** — reconstrói o
  consolidado a partir dos oito lotes mais a tabela `CORRECOES` e falha se
  divergir. Edição à mão no JSON aparece como divergência.
- **`node research/tools/check-glossario.mjs`** — recusa tópico fora dos 74,
  tópico dos 74 sem glosa, `naoConfundirCom` apontando para nome inexistente,
  termo repetido dentro do mesmo tópico, **termo reivindicado por dois tópicos
  sem regra de desempate**, regra de desempate MORTA (que não desempata mais
  nada), e `vence` cujo par nunca co-etiqueta claim nenhuma.
  Ele **não** cobra termo morto no corpus, e isso é deliberado: `fisgada` não
  existe em claim nenhuma e é o termo mais importante do arquivo.

E um campo novo no `ROTAS.json`: **`topicosProibidos`** — a gaveta que NÃO pode
abrir. `topicos` só fica vermelho quando a camada aperta demais; `proibidos` só
pega id de outro assunto. Faltava a coisa do meio, que é o defeito que o
diagnóstico descreveu: **a gaveta errada abrindo**, sem id proibido nenhum e sem
tópico faltando. Três mutações passavam verdes sem ele.

### 22.1 A tabela de mutação — comando, e quem ficou vermelho

> **CORRIGIDO EM 12/08/2026, por remedição.** A frase que estava aqui era *"Cada
> constante desta camada foi mutada e o `check:kb` rodado. Nenhuma sobreviveu."*
> **Ela era falsa nas duas metades.** A tabela abaixo tem 21 mutações e a camada
> tem 29 constantes; oito nunca foram mutadas, e das mutadas só um dos dois
> sentidos foi tentado em quase todas. A remedição varreu **as 29, nos dois
> sentidos — 56 mutações**: **50 ficaram vermelhas e 6 sobreviveram**, e as seis
> estão nomeadas no §22.2. Nenhuma constante mudou de valor por causa disso; o
> que mudou foi a frase, que dizia sucesso sem sucesso — o modo de falha nº 5
> desta casa, escrito no documento que existe para não cometê-lo.

| mutação (em `roteador.mjs` / `glossario.mjs`) | quem ficou vermelho |
|---|---|
| `PESO_CORPUS 0.5 → 1.0` | `roteador.test` · `check-canarios` · **rotas T16, T17** |
| `amortecimento = idfDoGlossario(...)` → `= 1` | `roteador.test` · `check-canarios` · **rotas calibração, T13, T16** |
| `PESO_CONFUSAO 0.4 → 0` | `roteador.test` · `check-canarios` · **rotas T16** |
| `PESO_CONFUSAO 0.4 → 2` | **rotas T19** |
| `PISO_ROTA 0.65 → 2` | `roteador.test` · `check-canarios` · **rotas calibração + 9 casos** |
| `FRACAO_DO_MELHOR 0.4 → 0.95` | `roteador.test` · `check-canarios` · **rotas T01, T03, T04, T07, T16** |
| `MAX_TOPICOS 5 → 1` | `roteador.test` · `check-canarios` · **rotas T01, T03, T04, T07, T16** |
| `PESO_NOME 0.9 → 0` | `roteador.test` · `check-canarios` · **rotas calibração, T01, T08** |
| `PESO_NOME_COMPOSTO 1.2 → 0` | **rotas T15** |
| `DETALHE_ROTEADO 8 → 0` | **rotas T05, T16** |
| `TETO_ROTEADO 40 → 400` | `roteador.test` |
| `PESO_FRASE 1.0 → 0` | `check-canarios` · **rotas T02, T18** |
| `PESO_FRASE_ESPARSA 0.7 → 0` | `check-canarios` · **rotas T16** |
| `PESO_TERMO_UNICO 1.0 → 0` | `roteador.test` · `check-canarios` · **rotas T16, T17** |
| `PESO_PALAVRA_EM_FRASE 0.5 → 0` | `check-canarios` · **rotas calibração** |
| `PALAVRAS_ESPARSA 2 → 1` | `check-canarios` · **rotas T16, T17** |
| `PALAVRAS_ESPARSA 2 → 3` | `check-canarios` · **rotas T16** |
| `JANELA_ESPARSA 5 → 99` | **rotas T02** |
| `PREFIXO_GLOSSARIO 5 → 2` | `roteador.test` · `check-canarios` · **rotas calibração, T13, T16, T17** |
| curto-circuito da palavra exata removido em `familiaNoGlossario` | `check-canarios` · **rotas T16, T18** |
| **o `vence` do desempate ignorado** (`if (false) continue`) | `roteador.test` · **rotas T18** |

**Três constantes NÃO tinham canário nomeado quando esta onda começou a medir, e
as três foram tratadas em vez de deixadas passar:**

- `PESO_CONFUSAO` **para cima** sobrevivia a tudo → nasceu **T19**
  (`qual a ordem dos exercícios na sessão?`, `topicosProibidos: [frequencia]`).
- **o desempate ignorado** sobrevivia a tudo → nasceu **T18**
  (`vale a pena trocar pra pegada fechada no supino?`, `topicosProibidos: [bracos]`).
- `JANELA_ESPARSA` para cima sobrevivia a tudo → **T02** ganhou
  `topicosProibidos: [idade]`, e `topicos` ganhou `programacao`, que é o que mata
  `PESO_FRASE → 0`.

**E uma constante foi APAGADA por não ter como ser defendida.** `PISO_IDF_CORPUS
= 0,2` existia para que a palavra desconhecida do glossário ainda pesasse um
quinto no corpus, com a justificativa de que o corpus atravessa a fronteira de
língua. A justificativa não sobreviveu à medição: com o piso, `o que a base diz
sobre hypertrophy?` e `treinar até failure vale a pena?` continuavam sem mapear
(a ponte não existia), o placar dos 18 canários era **idêntico**, a margem de
calibração era **pior** (maior de fora 0,51 contra 0,47), e nenhum canário
nomeado morria quando ele ia a zero. Constante que só o registro de medida
defende é constante que ninguém pode mexer com segurança.

**Uma exclusão continua sem canário, e está declarada com o número:** tirar
`glossário (dentro de frase)` do conjunto `CANAIS_AUTORITATIVOS` — a decisão de
que uma palavra arrancada de dentro de um termo maior não carrega uma pergunta
sozinha. Ela era obrigatória quando o glossário era o único canal (as populações
de calibração se CRUZAVAM: 0,40 de dentro contra 0,50 de fora). Hoje, com o
corpus de volta como canal amortecido, ela compra **0,03** de margem (maior de
fora 0,47 contra 0,50) e nenhum caso depende dela. Está escrito assim, com o
número, em vez de continuar repetindo a justificativa de quando ela decidia.

### 22.2 A varredura completa — 12/08/2026, as 29 constantes nos dois sentidos

As **29** constantes de `roteador.mjs` e `glossario.mjs` foram zeradas E
infladas, uma de cada vez, com este subconjunto do `check:kb` rodado a cada
mutação (subconjunto próprio: vermelho aqui é vermelho no `check:kb` inteiro):

```
node research/tools/roteador.test.mjs && node research/tools/check-canarios.test.mjs \
 && node research/tools/build-glossario.mjs --check && node research/tools/check-glossario.mjs \
 && node research/tools/check-canarios.mjs && node research/tools/check-rotas.mjs
```

**56 mutações · 50 vermelhas · 6 verdes.** As 50 estão cobertas e não se repetem
aqui. **As seis que sobreviveram, e é isso que importa:**

| mutação que passou VERDE | o que ela de fato muda, medido |
|---|---|
| `DETALHE_ROTEADO 8 → 40` | nada na tela: a tela enche com 40 claims roteadas antes de a página ao lado ser consultada, então focos a mais não cabem. O sentido que morde é o outro, e `8 → 0` fica **vermelho** (T05, T16). |
| `PESO_NOME_COMPOSTO 1.2 → 12` | nenhum caso travado tem um nome composto disputando vaga; `1.2 → 0` fica **vermelho** (T15). Só o lado de baixo tem canário. |
| `TETO_PARAM 12 → 120` | o canal de param tem 11 casamentos na maior pergunta travada — o teto nunca corta. `12 → 0` fica **vermelho**. |
| `FRACAO_DA_PALAVRA_GLOSSARIO 0.6 → 0` | **era o pior dos seis, e foi fechado.** Sem a fração, `powerlift` passa a alcançar `powerbuilding` — os dois assuntos que esta base declara ter opinião oposta um sobre o outro. O teste que existia (`power` não junta `powerlifting`) **não defendia esta constante**: `power` É termo do glossário e o curto-circuito da palavra exata o resolve antes das três condições rodarem. Canário novo em `roteador.test.mjs`, sobre `powerlift`, que não é termo do glossário — a mutação agora fica **vermelha**. |
| `DIFERENCA_MAXIMA_GLOSSARIO 5 → 99` | continua **sem canário**, e está declarado com o número: sobre as 279 palavras distintas das 91 perguntas travadas, ela muda **3** (`sobre`→`sobrecarregado`, `condicao`→`condicionamento`, `desce`→`descendente`), e as três são ampliações benignas ou corretas. A justificativa que o comentário dá (`power` não casa `powerlifting`) é entregue pelo curto-circuito, não por ela. É uma guarda copiada do lado do corpus — onde `DIFERENCA_MAXIMA 5 → 99` fica **vermelha** — cuja necessidade do lado do glossário não está demonstrada. |
| `MIN_TERMOS 10 → 0` (`check-glossario.mjs`) | é constante de TRAVA, não de camada: afrouxá-la não pode ficar vermelho, por construção. O sentido que prova que ela está ligada é o outro, e `10 → 20` fica **vermelho** (`barra-baixa` tem 11 termos). |

**O padrão vale mais que a lista: todas as seis sobreviventes são no sentido de
AFROUXAR.** Apertar sempre foi pego. Um teto que sobe e um piso que desce passam
porque a camada continua achando o que já achava — e é exatamente assim que uma
camada apodrece sem nenhum vermelho, que é o que aconteceu com
`TETO_VIZINHANCA 40 → 400` em 09/08 (§18.3).

## 23. Procedência da PARTE III

- **Arquivos novos:** `research/kb/GLOSSARIO-TOPICOS.json`,
  `research/tools/glossario.mjs`, `research/tools/build-glossario.mjs`,
  `research/tools/check-glossario.mjs`.
- **Arquivos alterados:** `research/tools/roteador.mjs` (o canal do glossário, o
  amortecimento do corpus, o bônus de `naoConfundirCom`, o glossário obrigatório),
  `research/tools/check-evidence.mjs` (`--topicos`), `research/tools/check-rotas.mjs`
  (`topicosProibidos`), `research/tools/check-canarios.mjs` e
  `research/tools/roteador.test.mjs` (fiação do glossário, 60 casos),
  `research/kb/ROTAS.json` (T16–T19 novos, T02 reforçado, calibração re-medida),
  `research/kb/CANARIOS.json` (as 18 medidas da porta nova regravadas), `package.json`,
  este arquivo.
- **Nenhuma claim foi editada**, nenhuma fonte foi ingerida, nenhum tópico entrou
  no vocabulário fechado, e a ORDENAÇÃO dentro do tópico não foi tocada.
- **O vocabulário de entrada foi escrito por outros oito agentes**, em
  `research/kb/entrada/`. O que este passe fez foi consolidar, conferir, declarar
  as seis correções e ligar o resultado ao roteamento.
- **Verificação:** `npm run check:kb` exit 0 · `npm run check:gate` exit 0 ·
  `npm run build` exit 0. As 21 mutações da tabela do §22.1 foram aplicadas,
  medidas e revertidas.

### 23.1 O passe de VERIFICAÇÃO de 12/08/2026

O agente que construiu a PARTE III **morreu por falha de harness durante a
verificação final**, não por defeito do trabalho — então a parte menos confiável
era justamente a que ele estava rodando. Este passe não reconstruiu nada; ele
conferiu, e mexeu só onde achou defeito.

- **Conferido e correto, sem alteração:** as 74 gavetas estão no glossário, sem
  repetido, todo nome dentro da lista fechada, todas com glosa; **114** colisões
  de termo e **114** regras de desempate, **zero** ambiguidade silenciosa e
  **zero** regra morta (recontado à mão, fora do `check-glossario.mjs`); os oito
  lotes estão todos presentes (10+10+9+9+9+9+9+9 = 74). Os quatro números do
  placar (`0/8/1/11`) batem, um a um, com o que está gravado em
  `perguntaDoAtleta` nos 18 canários. A Porta A (`--topicos`) existe, está
  documentada no `_leia` do artefato e cabe num prompt (**84 linhas, ~15 KB**).
- **Defeito corrigido — a frase do §22.1** que declarava cobertura total de
  mutação. Ver o aviso lá e a varredura completa no §22.2.
- **Defeito corrigido — o teste vazio de `power`.** Ele passava pelo
  curto-circuito da palavra exata e não exercia as constantes que dizia
  defender; `FRACAO_DA_PALAVRA_GLOSSARIO 0.6 → 0` passava VERDE. Canário novo
  sobre `powerlift` em `roteador.test.mjs` (61 casos agora, eram 60).
- **Defeito corrigido — a tela muda.** Ver §21.1.
- **Código morto removido:** `carregarRotas()` em `roteador.mjs` — exportada,
  documentada com uma regra de higiene, e **chamada por ninguém**
  (`check-rotas.mjs` lê o JSON direto) — mais o `readFileSync` que só ela usava;
  e o import `raiz` em `glossario.mjs`, que nunca foi usado. Nenhum dos dois é
  pego pelo `npm run lint`: o `eslint.config.js` só cobre `**/*.{ts,tsx}`, então
  `research/tools/*.mjs` não é lintado. **Isso continua aberto.**
- **NÃO foi tocado:** ordenação dentro do tópico, valor de constante nenhuma,
  `GLOSSARIO-TOPICOS.json`, os lotes, `CANARIOS.json`, `ROTAS.json` e as claims.

---

## PARTE V — O ATAQUE CEGO DE 12/08/2026, E O QUE ELE MEDIU

### 24.1 Os dois números, e por que a média é proibida

O terceiro ataque cego desta base escreveu **doze perguntas novas** (B01–B12 em
`research/kb/CANARIOS.json`, família `presente-escondido`, conjunto
`cego-2026-08-12`) contra as 6.912 claims, **sem ver a ferramenta e sem ver os
dezoito canários públicos**. As 21 claims que elas esperam foram achadas por
busca própria e conferidas uma a uma com `check-evidence.mjs`.

| | público P01–P18 | cego B01–B12 |
|---|---|---|
| devolvem **todos** os ids esperados | 0 de 18 | **0 de 12** |
| devolvem **algum** id esperado | 8 de 18 (44 %) | **0 de 12 (0 %)** |
| **não** abrem gaveta nenhuma com a resposta | 1 de 18 | **2 de 12** |
| abrem o `topicoDaResposta` declarado | 11 de 18 | **4 de 12** |

O zero vale pelas **três** definições de tela que esta camada tem: o teto de 40
do `check-canarios.mjs`, as 68 claims que o CLI de fato imprime, e o bloco de
detalhe das 8 primeiras. Não é diferença de régua.

**A distância entre 44 % e 0 % é a medida de quanto o conjunto público foi
absorvido pela construção.** Ela não é ruído de amostra: das 8 públicas que
passam, apenas **2** sobrevivem a uma paráfrase leve, e a pergunta-vitrine da
onda do glossário colapsa ao trocar uma única palavra —
`--pergunta "levantar peso já conta como exercício cardiovascular"` **não abre
`cardio`**, e `"musculação sozinha já serve de exercício cardiovascular"` não
mapeia para tópico nenhum (`cardio` em 0,63 contra o piso de 0,65). O conserto
de 11/08 foi na FRASE, não no conceito.

Por isso `check-canarios.mjs` passou a imprimir o placar **por conjunto** e a
exigir o campo `conjunto` em todo canário da porta nova: somados, os dois dão
`8 de 30`, que é a média de 44 % com 0 % e apaga exatamente a quantidade que o
conjunto cego existe para medir.

### 24.2 O diagnóstico é o oposto do que o zero sugere

**Em 10 dos 12 a camada ABRIU uma gaveta que contém a resposta e a resposta não
chegou à tela.** Só B02 e B05 são falha de roteamento pura. E o conteúdo está a
um comando de distância: forçando a gaveta com `--topic`, **9 dos 12 devolvem na
hora** — B11 com `--topic ordem-exercicio` devolve G014-10 e G016-10; B05 com
`--topic descanso-entre-series`; B07 com `--topic faixa`; B08 com
`--topic estagnacao`; B10 com `--topic genetica`; B12 com `--topic sapato`. A
pergunta da fisgada com `--topic dor` devolve **as cinco** claims do limiar.

**O mecanismo, medido caso a caso:** as 40 vagas da tela são preenchidas pelo
ranking global, então cada gaveta leva vagas na proporção do próprio tamanho.

```
B07   competicao(457):36   equipamento(199):4        F001-94 mora em equipamento
B11   supino(694):26  agacho(990):24  ordem-exercicio(29):1   as DUAS respostas em ordem-exercicio
B12   agacho(990):39                                          a resposta é de sapato(18)
B10   progressao(741):36  genetica(45):—                      as duas respostas em genetica
FISG  peito(31):19  supino(694):33  dor(119):5                as cinco claims em dor
```

**A doença nº 2 come integralmente o conserto da doença nº 1.** Consertar
roteamento sem consertar alocação de vagas por gaveta era garantidamente zero, e
foi. Uma gaveta roteada acima do piso precisa de **vagas garantidas independentes
do tamanho dela**, e o bloco de detalhe de 8 precisa reservar espaço para a
gaveta MENOR, não para a maior. Isso é a divergência §8.39 do RUNBOOK, agora com
o mecanismo medido, e é o item 0 da `ONDA-2C.md`.

### 24.3 O que ficou de pé, dito sem generosidade

- **O roteamento generalizou.** 10 de 12 abrem a gaveta certa em perguntas que
  ninguém otimizou. O trabalho dos oito agentes que escreveram o vocabulário de
  entrada leva o atleta à gaveta certa; é o que vem depois que perde.
- **Fora de domínio, 3 de 3.** Bolo de cenoura, nginx/ssl e embreagem de carro
  dizem `NÃO MAPEIA` e a camada distingue *fora de domínio* de *sem assunto*.
- **O índice está certo, pela segunda vez confirmado.** As 21 claims esperadas
  pelos 12 cegos existem e estão etiquetadas nas gavetas certas. **Não é problema
  de etiqueta e não é falta de conteúdo** — não compre corpus contra este
  sintoma.
- **O painel `GAVETAS QUE PONTUARAM E NÃO ABRIRAM` é instrumento real e fraco:**
  nomeia uma gaveta que de fato contém a resposta em **2 de 12** (B08
  `progressao`, B12 `tecnica`) e em **nenhuma** das duas falhas de roteamento. O
  filtro *"só gaveta que pontuou sozinha"*, que existe para tirar ruído, engoliu
  o sinal útil em B03 (`mentalidade`) e B09 (`lesao`). Divergência §8.45.

### 24.4 Os dois consertos que este fechamento fez, e o que eles não fazem

**(a) O placar por conjunto** — `check-canarios.mjs`, descrito no §24.1. Campo
`conjunto` obrigatório na porta nova, dois casos novos em
`check-canarios.test.mjs` (55 casos agora, eram 53): um exige a recusa quando o
campo falta, o outro exige que dois conjuntos imprimam dois placares e não a
média.

**(b) A âncora no corpus** — `check-glossario.mjs`. O ataque provou, contra o
gate REAL, que **26 das 74 gavetas podiam ter a lista `entrada` inteira
substituída por dez strings sem sentido com `npm run check:kb` e
`npm run check:gate` em exit 0** — entre elas `descanso-entre-series`, a gaveta
cuja falha criou esta camada. Trinta e cinco por cento do artefato desta onda não
era testado por nada: as travas que existiam conferem FORMA, e forma sobrevive a
uma lista de lixo. A trava nova confronta cada termo de entrada com o texto das
claims que a base etiquetou naquela gaveta — dado independente, extraído meses
antes do glossário. **Piso em 35 %, mediana medida em 92 %, pior gaveta `dor` com
53 %.**

O piso é baixo de propósito e essa é a parte que não pode ser esquecida: **um
vocabulário de entrada bom é justamente o que NÃO está no corpus** — `fisgada`
não aparece em nenhuma das 6.912 claims e é o termo mais importante do arquivo.
Subir o piso inverteria o propósito do artefato e faria o próximo autor encher a
lista com jargão da base, que é o modo de falha nº 2 desta casa.

**O que a âncora NÃO pega, dito antes que alguém confie demais:** ela recusa
lixo, não recusa uma lista de termos reais porém ERRADOS para aquela gaveta.
Trocar a entrada de `sono` pela de `fadiga` passa. Quem cobra acerto de
roteamento continua sendo `check-rotas.mjs` e os canários.

**Verificação dos dois:** varredura das 74 gavetas trocando a `entrada` por
`zzqa`…`zzqj` → **0 de 74 ficam verdes** (eram 26), com o arquivo restaurado byte
a byte. E o caminho real do ataque, ponta a ponta: mutar `descanso-entre-series`
em `research/kb/entrada/lote-6.json`, rodar `build-glossario.mjs` e
`npm run check:kb` → **exit 1**.

### 24.5 O que este fechamento NÃO consertou, e por quê

- **A alocação de vagas por gaveta** (§8.39). É o item 0 da fila e não cabia
  aqui: mexer nela move a medida dos 30 canários, e a medida acabou de ser
  gravada. Quem mexer reescreve o registro e diz o número novo em voz alta.
- **As 5 mutações de constante que ficam verdes** (§8.41), todas no sentido de
  AFROUXAR: `DETALHE_ROTEADO 8→80`, `DIFERENCA_MAXIMA_GLOSSARIO 5→50`,
  `MIN_TERMOS 10→0`, `PESO_NOME_COMPOSTO 1.2→12`, `TETO_PARAM 12→120`.
- **As duas definições de tela** (§8.44): o gate mede 40, o CLI imprime 68. O
  placar não muda com a régua — 8/18 e 0/12 valem para as duas —, mas foi essa
  divergência que produziu o erro corrigido no §20.1.
- **A precisão** (§8.46): 32 de 33 perguntas devolvem exatamente 40 claims. Não
  existe resposta estreita nesta camada, nem para uma pergunta de sim/não sobre
  uma única claim de regulamento.


---

# PARTE VI — A ALOCAÇÃO DE VAGAS POR GAVETA (12/08/2026)

## 25. O defeito era de ALOCAÇÃO, e ele custava a resposta inteira

### 25.1 O mecanismo, medido

A onda de 11/08 consertou o roteamento e entregou zero: em 10 dos 12 canários
cegos a gaveta que contém a resposta ABRIU e a resposta não chegou à tela. O
passo seguinte era o culpado, e ele era literalmente uma linha:

```js
const claimsRoteadas = [...acumulado.values()]
  .sort((a, b) => b.score - a.score)
  .slice(0, teto);            // <- as 40 vagas, por ranking global
```

Cada gaveta despejava até 40 claims num balaio comum, ordenava-se tudo junto e
cortava-se em 40. **Ordenar tudo junto e cortar é dar as vagas por TAMANHO de
gaveta**, porque a gaveta grande tem mais bilhetes na rifa:

| pergunta | como as 40 vagas eram divididas |
|---|---|
| B11 | `supino`(694):29 `agacho`(990):25 **`ordem-exercicio`(29):9** |
| B07 | `competicao`(457):36 `equipamento`(199):4 ← F001-94 está aqui |
| B12 | `agacho`(990):39 |
| fisgada | `peito`(31):33 `supino`(694):9 **`dor`(119):6** ← as 5 estão aqui |

### 25.2 Quantas vagas uma gaveta merece, e por quê

A resposta tem três partes, e as três estão em `vagasPorGaveta` /`alocarVagas`
em `research/tools/roteador.mjs`.

**1. Um PISO por gaveta aberta (`PISO_VAGAS = 3`).** O roteador não é confiável o
bastante na ORDEM em que abre as gavetas para que a última leve zero: em 8 dos 10
soterrados a gaveta da resposta abriu e não era a primeira. Varrido de 1 a 8
contra os 53 canários: 1, 2 e 3 empatam em 60 ids; 4 cai para 58, 5 para 57, 8
para 55. **3 é o maior valor que ainda não custa nada** — o mais forte que a
propriedade "vaga garantida" consegue ser de graça.

**2. A sobra por `score × SURPRESA DO TAMANHO`, com a surpresa ao cubo.**
`agacho` pontuar 0,90 numa pergunta deste atleta não é notícia: são 990 claims e
ele agacha em toda pergunta que faz. `ordem-exercicio` pontuar 0,86 com 29 claims
é notícia — a pergunta teve de ser SOBRE ordem de exercício. A forma é o idf da
gaveta, `log(N/n)`, que é a mesma conta que o `pesoDoTermo` já faz um nível
abaixo. Varrido:

| expoente | ids na tela | casos completos |
|---|---|---|
| 1 | 57 de 127 | 16 |
| 2 | 57 | 16 |
| **3** | **60** | **17** |
| 4 | 59 | 16 |
| 5 | 60 | 17 |

**3 é o menor inteiro do platô.** Com 1, `ordem-exercicio` leva 9 das vagas da
rota na B11 e G014-10 (14ª DENTRO da gaveta) não sai; com 3 ela leva 16 e sai.

**3. E a vaga é TETO, não é direito.** A sobra NÃO volta ao bolo: se `cinto` tem
duas claims para dizer, as outras vagas dela evaporam em vez de irem para
`competicao`(457), que tem distribuição chapada. É isso que faz a tela encolher.

### 25.3 A EXCEÇÃO que a própria base declara

A surpresa aponta para o lado errado num caso, e é o mais caro: na pergunta da
fisgada, `peito`(31) é mais surpreendente que `dor`(119) e levaria mais vagas —
e as cinco claims do limiar de dor estão em `dor`.

O desempate não é heurística nova: está no `naoConfundirCom` do glossário, e
`peito` declara, no lote 1, que *"QUALQUER sintoma no peitoral vai para dor,
mesmo mencionando a palavra peito"*. A regra é uma frase: **quando o dono de uma
gaveta aberta diz por escrito que a resposta é na gaveta ao lado, a gaveta ao
lado não sai da tela com menos vagas do que quem a apontou.** Sem ela, `dor` leva
7 vagas e V001-06 (9ª dentro de `dor`) não chega; com ela, `dor` empata com
`peito` em 16.

### 25.4 As 40 vagas são de QUATRO canais, e três deles não existiam para a medição

O segundo defeito, e ele estava escondido atrás do primeiro: quem conta a tela
(`telaDe()` do `check-canarios.mjs`, e o `check-rotas.mjs`) enfileira
`claims → params → vizinhos` e corta em 40. **Com a rota ocupando as 40, os
outros canais eram calculados, impressos e cortados fora da tela.** O caso que
prova: *quanto baixar o peso quando o RPE vem acima do alvo* tem a resposta
(V033-03/04/05) no canal de PARAM, e o canal de param nunca chegava à tela.

Hoje a rota leva `FRACAO_DA_ROTA = 0,55` do teto — 22 das 40 —, e os outros três
têm orçamento próprio (`TETO_PARAM` 12, `VAGAS_DA_LIGACAO` 8, `DETALHE_ROTEADO`
8 por canal de vizinhança). A fração é FRAÇÃO e não número absoluto de propósito:
com absoluto, `TETO_ROTEADO 40 → 400` vira mutação inerte e a constante passa a
mentir.

### 25.5 O LEDGER — o canal que não casa palavra nenhuma

Toda claim desta base carrega `conditions` e `conflicts`: 543 das 6.912 declaram
ao menos um. É a única coisa nesta base que já é um grafo, e até 12/08 a
recuperação não a lia.

V086-21 — *"treinar com dor leve pode ser aceitável, MAS os sintomas precisam
estar melhorando ao longo do tempo"* — **não compartilha uma palavra** com
*"fisgada de 3/10 no peitoral…"*. Nenhuma ordenação por texto pode alcançá-la, e
nenhuma alocação de vaga conserta isso: não é vaga que falta, é caminho. O
caminho existe, tipado, na claim que já está na tela: V079-34 declara
`conditions: V079-39, V027-23, V086-21` e `conflicts: V027-25`.

**A razão é de segurança, não de placar.** Dizer a um atleta com histórico de
ruptura de peitoral que 2–3/10 de dor é faixa boa para empurrar, sem dizer que
lesão menor é justamente a que se treina através demais, é pior do que não
responder. Por isso o foco do canal é a **prescrição** (`MODO_QUE_PUXA_LIGACAO`):
é a prescrição que pode machucar, e é a condição dela que tem de viajar junto.

O canal viaja dentro de `r.vizinhos` com `canal: 'ligacao'` — e não num campo
novo. Um campo `ligacoes` que o `telaDe()` não enfileira seria conteúdo
calculado, impresso e invisível para toda medição, que é o defeito que esta onda
existe para consertar, cometido de novo com outro nome.

### 25.6 O que foi tentado e MEDIDO NÃO FUNCIONAR

Está escrito porque a próxima onda vai ter a mesma ideia.

- **Penhasco por gaveta (`QUEDA_NA_GAVETA`).** Cada gaveta pararia de oferecer
  abaixo de uma fração do 1º lugar dela. A forma parecia dar razão (`cinto` cai
  1,00 · 0,86 · **0,40**), mas a MESMA forma aparece onde a resposta está na
  cauda: `descanso-entre-series` cai 1,00 · 0,67 · 0,62 · 0,35 e as três claims
  do T05 vivem entre 0,11 e 0,18. Varrido: queda 0 → 60 ids; 0,15 → 55; 0,45 →
  36. **A forma do score dentro da gaveta não distingue "achou" de "não tem mais
  o que dizer" nesta base.** A constante saiu; a frase ficou.
- **Foco da página ao lado na tela inteira.** O argumento era que
  `vizinhosNoMesmoSrc` disputa a vaga por DISTÂNCIA, então foco largo só
  acrescenta candidato melhor. Com 22 focos há mais candidatos de distância 1 do
  que vagas, e o desempate vira a ordem do foco: o T05 perdia V003-18 e V074-24,
  que são os dois ids que o `viaPaginaAoLado` cobra POR CANAL. 58 ids contra 57 e
  a página ao lado de 1 de 2: não compensa. O que consertou de verdade foi o
  desempate em `busca.mjs` — **entre a página anterior e a seguinte, a SEGUINTE é
  a que completa** (o desempate era alfabético, que dá o mesmo que "a anterior
  primeiro").
- **Cota fixa para a claim AFIM.** `TETO_AFINS` é 60 e `ordem-exercicio` tem 29
  declaradas: dois terços da gaveta passavam a ser claims de outro lugar, e
  G014-10 caía de 12º para 30º dentro da própria gaveta. Mas cota fixa quebra o
  caso oposto: V170-34 (*supinar seis dias por semana*) é AFIM de `frequencia` e
  caía de 4º para 11º. A regra que ficou é condicional e é um FATO, não um
  ajuste: **a cota só existe quando a gaveta inteira não cabe nas vagas dela.**

### 25.7 O placar, e o que se pagou

Contra os 53 canários com id esperado (19 do `ROTAS.json`, 34 do `CANARIOS.json`,
mais os três casos nomeados da onda), medido por
`node research/tools/medir-alocacao.mjs` — que roda o estado anterior no mesmo
comando (`--legado`) para o "antes" não depender de ninguém lembrar:

| | 11/08 (ranking global) | 12/08 (vaga por gaveta) |
|---|---|---|
| ids que chegam à tela | 46 de 127 · 48 hoje¹ | **59 de 127** |
| canários com TODOS os ids | 13 de 53 · 14 hoje¹ | **17 de 53** |
| canários com ALGUM id | 28 de 53 · 29 hoje¹ | **31 de 53** |
| tamanho MEDIANO da tela | 40 | **34** |
| `viaPaginaAoLado` (canal cobrado por nome) | 2 de 2 | 2 de 2 |
| injeção (id de outro assunto) | 0 | 0 |

¹ A primeira coluna tem dois números porque **duas coisas mudaram nesta onda**, e
somá-las numa só seria atribuir à alocação um ganho que não é dela. `46` é o que
o ranking global entregava no início da onda; `48` é o que ele entrega HOJE,
depois de o desempate da página ao lado passar a preferir a página SEGUINTE
(§25.6). O ganho da alocação, isolado, é **48 → 59**. Rode os dois no mesmo
comando: `node research/tools/medir-alocacao.mjs --legado` e sem a flag.

> **A TABELA ACIMA NÃO REPRODUZ MAIS, e a razão não é regressão.** Em 12/08 à
> noite os canários cegos **D01–D12 entraram no `CANARIOS.json`**, e a bancada lê
> o arquivo: os 53 casos viraram **65** e os 127 ids viraram **160**. Hoje o mesmo
> comando imprime **48 → 62 ids em 160**, com `--legado` dando `completos: 14`
> contra 17 agora. A conta fecha exata — `59 + 3 = 62` e `127 + 33 = 160` —, e os
> `+3` são precisamente os três ids que o conjunto cego novo devolve. Ou seja:
> **os números desta tabela continuam certos para a régua em que foram medidos, e
> qualquer comparação futura tem de usar a régua de hoje.** Ver §26 e §8.53.

**E o que piorou, que é a parte que não pode faltar.** Dois canários públicos
perderam um id cada, e os dois pelo mesmo motivo — a rota deixou de ocupar as 40
vagas sozinha:

- **P11** (*de quantas em quantas semanas eu preciso pegar leve*) perde G004-11,
  que saía em 29º pelo ranking global — e como era o ÚNICO id dele na tela, o
  canário sai da coluna "devolve algum". **É por isso que o placar público cai de
  8 para 7.**
- **P13** (*meu supino para no meio do caminho e não sobe mais*) perde V119-20,
  que saía em 36º, e continua devolvendo V170-42.

Os dois estavam no rodapé da tela cheia. É o preço declarado da tela que encolhe,
e está gravado no `CANARIOS.json` com o veredito medido — inclusive nos que
falham. Do outro lado da mesma conta, P06 e P07 passaram a devolver TODOS os ids
(0 de 18 → 2 de 18 na coluna que mais importa), e é essa a troca: menos canários
encostando na resposta, mais canários COMPLETANDO.

### 25.8 O que esta onda NÃO resolveu

- **B11 continua incompleto.** G014-10 chega (21º); **G016-10 não chega e não vai
  chegar por aqui**: ela casa UMA palavra da pergunta (`e`), não tem `conditions`
  nem `conflicts`, e o único caminho seria a página ao lado a partir de G016-09 —
  que precisaria de um orçamento de vizinhança maior do que a tela inteira
  comporta. É recuperação por conteúdo, não por alocação.
- **A precisão do topo não foi medida contra um julgador.** `injecao` continua em
  0 pelos `topicosProibidos` do `ROTAS.json`, que é uma medida estreita: ela pega
  gaveta errada aberta, não claim relevante-por-pouco ocupando o 3º lugar.
- **Três mutações de AFROUXAMENTO do ledger sobrevivem** —
  `VAGAS_DA_LIGACAO 8→80`, `TETO_LIGACAO 8→80`, `LIGACOES_POR_FOCO 4→40` — e o
  motivo está medido: **o ledger é esparso.** Nenhuma das 53 perguntas põe mais
  de 8 ligações na tela, então subir o teto não muda saída nenhuma. Não é trava
  faltando: é constante folgada num grafo que ainda não é denso. Quando o ledger
  bidirecional da tarefa #25 existir, ela aperta. **Dívida declarada, não
  arredondada.**
- **`TETO_PARAM 12→120` continua verde**, como já estava antes desta onda
  (§24.5) e pelo mesmo motivo: nenhuma pergunta medida produz mais de 12
  casamentos de nome de param, então o teto não corta nada e subi-lo não muda
  saída nenhuma. `DETALHE_ROTEADO 8→80`, que estava na mesma lista, **morreu**
  nesta onda.

### 25.9 As travas, e a prova por mutação

`research/tools/alocacao.test.mjs` (21 casos, dentro do `npm run check:kb`) roda
sobre as **6.912 claims reais** — corpus de bolso não prova recuperação — e
**não importa constante nenhuma de `roteador.mjs`**: os números são literais
escritos à mão a partir da varredura. Cada constante nova tem DOIS casos, um para
cada sentido.

Prova por mutação, com o arquivo restaurado byte a byte depois de cada uma:

As colunas são quantos casos ficam VERMELHOS em cada trava: `aloc` =
`alocacao.test.mjs`, `rotas` = `check-rotas.mjs`, `rot` = `roteador.test.mjs`,
`can` = `check-canarios.mjs`.

```
PISO_VAGAS = 3 → 1                                 aloc:3  rotas:0  rot:0  can:0  VERMELHO
PISO_VAGAS = 3 → 8                                 aloc:3  rotas:0  rot:2  can:3  VERMELHO
EXPOENTE_SURPRESA = 3 → 1                          aloc:4  rotas:0  rot:0  can:3  VERMELHO
EXPOENTE_SURPRESA = 3 → 30                         aloc:3  rotas:5  rot:0  can:2  VERMELHO
COTA_AFIM = 0 → 1                                  aloc:3  rotas:0  rot:0  can:2  VERMELHO
FRACAO_DA_ROTA = 0.55 → 1                          aloc:13 rotas:0  rot:2  can:3  VERMELHO
FRACAO_DA_ROTA = 0.55 → 0.2                        aloc:10 rotas:16 rot:4  can:7  VERMELHO
VAGAS_DA_LIGACAO = 8 → 0                           aloc:3  rotas:3  rot:0  can:1  VERMELHO
VAGAS_DA_LIGACAO = 8 → 80                          aloc:0  rotas:0  rot:0  can:0  *** SOBREVIVEU ***
TETO_LIGACAO = 8 → 1                               aloc:3  rotas:3  rot:0  can:1  VERMELHO
TETO_LIGACAO = 8 → 80                              aloc:0  rotas:0  rot:0  can:0  *** SOBREVIVEU ***
LIGACOES_POR_FOCO = 4 → 1                          aloc:3  rotas:3  rot:0  can:1  VERMELHO
LIGACOES_POR_FOCO = 4 → 40                         aloc:0  rotas:0  rot:0  can:0  *** SOBREVIVEU ***
MODO_QUE_PUXA_LIGACAO 'prescricao' → 'narrativa'   aloc:3  rotas:3  rot:0  can:1  VERMELHO
TETO_ROTEADO = 40 → 400                            aloc:14 rotas:0  rot:3  can:3  VERMELHO
TETO_ROTEADO = 40 → 4                              aloc:11 rotas:0  rot:4  can:0  VERMELHO
DETALHE_ROTEADO = 8 → 80                           aloc:3  rotas:0  rot:0  can:1  VERMELHO
TETO_PARAM = 12 → 120                              aloc:0  rotas:0  rot:0  can:0  *** SOBREVIVEU ***
TETO_AFINS = 60 → 600                              aloc:5  rotas:4  rot:3  can:5  VERMELHO
PESO_AFIM = 0.6 → 6                                aloc:5  rotas:7  rot:0  can:6  VERMELHO
```

**17 de 20 vermelhas, e 10 delas no sentido de AFROUXAR** — que era exatamente o
lado que as travas desta casa não cobriam. Duas dívidas antigas foram pagas de
quebra: **`DETALHE_ROTEADO 8 → 80` estava na lista de sobreviventes de 11/08
(§24.5) e agora morre**, porque a página ao lado passou a ter teto cobrado por
canário. As três que sobrevivem estão nomeadas no §25.8 com o motivo medido.

**E duas constantes foram REMOVIDAS por mentirem**: `VAGAS_DO_PARAM`, que
duplicava `TETO_PARAM` (a mutação `12 → 120` era matematicamente inerte, que é a
forma mais barata de uma constante mentir), e `VAGAS_DO_LADO`, que duplicava
`DETALHE_ROTEADO`.

### 25.10 Procedência da PARTE VI

- A alocação: `research/tools/roteador.mjs` — `surpresaDaGaveta`,
  `vagasPorGaveta`, `alocarVagas`, `porLigacaoDeclarada`.
- A bancada de calibração: `research/tools/medir-alocacao.mjs` (a varredura completa,
  com `--legado` para o estado anterior) e `research/tools/medir-vagas.mjs` (os
  casos nomeados, com a distribuição de vagas impressa).
- As travas: `research/tools/alocacao.test.mjs`.
- Nenhum número desta parte veio de memória: todos saem de um dos dois comandos
  acima, na base real.

---

# PARTE VII — A AUDITORIA CEGA DE 12/08/2026 (noite), E O QUE ELA DESMONTOU

A PARTE VI é o relatório de quem construiu a alocação por gaveta. Esta parte é o
que sobrou dele depois de um ataque que não tinha visto a ferramenta, escreveu
doze perguntas novas contra a BASE, e remediu tudo. **O relatório da tarde é o
mais honesto das cinco ondas — e ainda assim foi honesto nos números que ele
escolheu publicar, não nos que decidiram as constantes.** É por isso que esta
parte existe.

## 26. Os três números, e a distância entre eles

```
CEGO       (D01-D12)   2 de 12 algum id · 0 de 12 todos ·  3 de 33 ids (9 %)
PÚBLICO    (P01-P18)   7 de 18 algum id · 2 de 18 todos
SOTERRADOS             11 de 12 abrem a gaveta com a resposta e não a entregam
```

`node research/tools/check-canarios.mjs` imprime os três conjuntos separados.
Contra o estado de 11/08 rodado no mesmo comando
(`node research/tools/auditoria/legado.mjs`): os mesmos doze cegos saíam de
**0 de 12 e 0 de 33 ids**. O ganho é real, é atribuível à alocação, e é de
**três ids em trinta e três**.

## 26.1 O defeito-alvo piorou: a alocação é SOMA ZERO

Soterramento de 10 para **11 de 12**. Em nove casos (D01 D02 D03 D04 D06 D07 D09
D10 D12) a gaveta com a resposta ABRIU e nenhum id chegou; em dois chegou parte
(D05 1/3, D08 2/3); só D11 é roteamento puro.

**O mecanismo, que ninguém tinha medido e nenhuma trava vê**
(`node research/tools/auditoria/diagnostico.mjs`):

| caso | forçando a gaveta certa SOZINHA | forçando ela MAIS as vizinhas |
|---|---|---|
| D05 | `--topic convencional` → **os 3** | `--topic convencional sumo terra` → **ZERO** |
| D06 | `--topic comandos-ipf` → **F001-11** | `--topic comandos-ipf agacho` → **ZERO** |

**Abrir a gaveta certa mais uma vizinha é pior do que abrir só a certa.** A
alocação por gaveta trocou *"a gaveta grande come tudo"* por *"as vagas se
repartem entre gavetas erradas"*. Divergência §8.48 do RUNBOOK.

## 26.2 A LINHA QUE SEPARA VAGA DE ORDEM — e é ela que decide a próxima onda

`node research/tools/auditoria/vale-a-frota.mjs` força, uma de cada vez, cada
gaveta que etiqueta algum id esperado, e conta:

```
ids esperados pelas 12 perguntas cegas ........................ 33
ids que chegam HOJE, sem --topic .............................. 3
ids que chegam FORÇANDO a gaveta certa sozinha ................ 28   (85 %)
perguntas COMPLETAS forçando a gaveta certa sozinha ........... 9 de 12
```

**28 de 33 estão a uma VAGA de distância** — a claim já está bem ordenada dentro
da gaveta dela e o que faltou foi orçamento. **5 de 33 não chegam nem assim**, e
esses estão soterrados DENTRO da gaveta certa:

| caso | id | gavetas |
|---|---|---|
| D03 | V008-10 | `sono` `nutricao` `recuperacao` |
| D09 | V001-22 | `dor` `lesao` |
| D09 | V001-21 | `dor` |
| D10 | V001-24 | `mentalidade` `lesao` |
| D10 | V001-25 | `mentalidade` `lesao` |

**O D09 é o caso puro e o mais caro desta base depois da fisgada:** abre UMA
gaveta, a certa (`dor`, 119 claims), a tela sai com **35 das 40 vagas ocupadas**,
e V001-21 e V001-22 não aparecem nem forçando `dor`, nem forçando `lesao`. Sobra
espaço na tela e a resposta não entra: isso não é alocação, é ORDENAÇÃO.
Divergência §8.50, e é o alvo da onda seguinte.

## 26.3 A trava que se testava a si mesma, dentro do arquivo que provava as constantes

`alocacao.test.mjs` afirmava `magra >= 3`, que é `PISO_VAGAS >= 3` reescrito como
asserção. Ele "matava" o mutante `3→1` sem medir saída nenhuma — modo de falha
nº 4 desta casa, no arquivo escrito para provar que as constantes foram ganhas.
Duas medições o desmontam:

- `node research/tools/auditoria/piso.mjs` — piso 1, 2, 3 e 4 devolvem as CINCO
  da fisgada nas MESMAS posições 13/18/36/38/39. **O piso não muda a saída da
  pergunta em cujo bloco a asserção estava escrita.**
- `node research/tools/medir-alocacao.mjs --pisos 1,2,3,4 --expoentes 3 --cotas 0`
  — piso 1 dá **63/160 ids e 18/65 completos**; piso 3 dá **62/160 e 17/65**.

A asserção foi **removida**, e nenhuma foi posta no lugar: escrevi uma
substituta ("toda gaveta aberta entrega ao menos uma linha"), mutei seis
constantes contra ela, e ela não ficou vermelha em nenhuma. **Trava que não sabe
morrer é decoração**, e este arquivo existe para não ter decoração.

**`PISO_VAGAS` não ficou descoberto**, e isto foi medido mutando `roteador.mjs`:
`3→1` e `3→0` morrem em `EXPOENTE_SURPRESA ↑`; `3→8` morre em
`EXPOENTE_SURPRESA ↓`. As duas são asserções de SAÍDA, com número diferente do
da constante. O que fica aberto é uma **escolha** — a bancada prefere 1, as
travas de saída preferem 3 — e ela é §8.49, não é lacuna de teste.

## 26.4 O preço que o relatório da tarde não mediu

`node research/tools/auditoria/topo.mjs`: dos 45 ids presentes nas duas telas,
**17 desceram e 11 subiram**, e a **posição MEDIANA da resposta certa foi de 6
para 8**. O relatório da tarde escreveu *"precisão do topo não foi medida"* — era
um comando, e o resultado é negativo (§8.55).

`node research/tools/auditoria/parafrase.mjs`: a fisgada entrega **5 de 5** com a
frase escrita e **3 de 5** sob paráfrase sem jargão. Em compensação D05 vai de
1/3 para 3/3 e D08 de 2/3 para 3/3 — **porque a paráfrase usou a jargona da
gaveta**. A camada acha quando o atleta já sabe o vocabulário, que é o oposto do
que a família `presente-escondido` existe para cobrar (§8.56).

## 26.5 Procedência da PARTE VII

A bancada inteira está em **`research/tools/auditoria/`**, e ela está aí por um
motivo que vale registrar: ela nasceu em `research/tools/scan/`, que é
**gitignored**, e o instrumento que produziu este veredito teria nascido perdido
— que é exatamente o erro que o relatório auditado dizia ter evitado (§8.51).

- `auditoria-onda2d.mjs` — a tela, e ela é a MESMA `telaDe()` do
  `check-canarios.mjs`, cortada no `tetoDeTela` do `CANARIOS.json`.
- `cegos.mjs` — as doze perguntas e a medição do conjunto cego.
- `diagnostico.mjs` — gaveta a gaveta, forçada sozinha e em conjunto.
- `vale-a-frota.mjs` — a linha que separa VAGA de ORDEM, e o número que responde
  a pergunta do atleta sobre a frota de modelo barato.
- `legado.mjs` · `topo.mjs` · `parafrase.mjs` · `piso.mjs` · `estreitas.mjs` ·
  `tres-saidas.mjs` · `publicos.mjs` · `duas-telas.mjs` · `precisao.mjs` ·
  `fisgada.mjs`.
