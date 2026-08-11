export const meta = {
  name: 'onda-2f-ataque',
  description: 'Ataca as secoes por gaveta com os canarios cegos E##, e mede pela primeira vez o caminho que a producao vai usar: agente le o glossario, escolhe a gaveta, chama --topic',
  phases: [
    { title: 'Medir', detail: 'ataque cego as secoes, e em paralelo tres agentes roteando as mesmas 12 perguntas' },
    { title: 'Somar', detail: 'pontuar as escolhas dos agentes contra os ids esperados' },
    { title: 'Fechar', detail: 'veredito, e a decisao de continuar nesta linha ou mudar' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CEGOS = [
 {
  "id": "E01",
  "pergunta": "descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha",
  "idsEsperados": [
   "V089-24",
   "V089-25"
  ],
  "topicosCertos": [
   "dor",
   "lesao"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs V089-24 V089-25  -> 2 de 2 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha\"  -> abre 5 gavetas (peito 9 vagas · supino 3 · dor 3 · descanso-entre-series 8 · competicao 3) e NENHUM dos dois ids sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"descansar totalmente do supino ate o incomodo no peito sumir resolve ou atrapalha\" --topic dor  -> V089-24 E V089-25 saem dentro das 40.",
  "porqueEhEscondido": "A base chama isso de tendinite e responde no vocabulario clinico (V089-24: nao descansar completamente, porque piora; V089-25: variacoes de velocidade lenta, tempo e pausas, porque a tensao no tendao depende do peso E da velocidade). O atleta nao tem esse nome: ele diz incomodo no peito e descansar totalmente. Sem --topic a gaveta `dor` ABRE e mesmo assim recebe so 3 das 40 vagas, porque `peito` (31 claims, gaveta pequena que pontua alto) fica com 9 e `descanso-entre-series` com 8 — duas gavetas que nao tem a resposta comem 17 vagas. Para este atleta, com peitoral rompido, a resposta errada e a mais intuitiva: parar de vez.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E02",
  "pergunta": "abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar",
  "idsEsperados": [
   "V167-17",
   "V167-18"
  ],
  "topicosCertos": [
   "dor",
   "supino",
   "ombros"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs V167-17 V167-18  -> 2 de 2 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar\"  -> abre 3 gavetas (supino 3 vagas · ombros 12 · rom 7) e NENHUM dos dois sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"abrir mais o cotovelo no supino faz o ombro doer, e defeito do movimento ou e questao de acostumar\" --topic dor  -> V167-17 (1o) e V167-18 saem.",
  "porqueEhEscondido": "A palavra da base e `flare`, que o atleta nao usa; ele descreve o gesto (abrir mais o cotovelo). As duas claims moram nas TRES gavetas que a pergunta mais parece pedir — supino, ombros e dor — e mesmo assim `supino` (694) leva so 3 vagas e `dor` nem abre. E a resposta e de duas metades que precisam sair juntas: V167-17 admite que a dor acontece, V167-18 diz que ela nao e inerente ao movimento. Sair so a primeira metade manda o atleta abandonar uma forma que so precisava de aclimatacao — e para quem tem historico de peitoral, mudar trajetoria por medo e caro.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 3
 },
 {
  "id": "E03",
  "pergunta": "eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita",
  "idsEsperados": [
   "F001-37",
   "F001-47"
  ],
  "topicosCertos": [
   "cinto",
   "supino",
   "erro-comum"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs F001-37 F001-47  -> 2 de 2 existem (IPF-TR2026 §4.2.8 e §4.2.1.6). Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita\"  -> abre 5 gavetas (supino 3 vagas · barra-baixa 9 · setup 3 · comandos-ipf 6 · equipamento 3), `cinto` NAO abre, nenhum id sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"eu arqueio bastante e a barra desce quase na altura das costelas de baixo, se ela raspar na fivela o juiz aceita\" --topic cinto  -> F001-37 e F001-47 saem em 1o e 2o.",
  "porqueEhEscondido": "Resposta ESTREITA de sim/nao com duas claims de regulamento, e ela mora numa gaveta MINUSCULA (`cinto`, 54 claims) que disputa com uma enorme (`supino`, 694). A pergunta e visivelmente de supino, entao o roteador abre supino, setup, comandos-ipf, equipamento e ate barra-baixa — cinco gavetas plausiveis, nenhuma com a regra — e a unica que tem a resposta nunca entra na disputa. O atleta diz `fivela`, palavra que nao esta na lista de entrada de nenhuma das 74 gavetas; a base diz `cinto`. A resposta certa e dura: barra tocando o cinto anula a tentativa.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E04",
  "pergunta": "seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos",
  "idsEsperados": [
   "F001-14",
   "F001-28"
  ],
  "topicosCertos": [
   "pegada",
   "agacho",
   "supino"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs F001-14 F001-28  -> 2 de 2 existem (§4.1.1 e §4.2.2). Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos\"  -> abre 5 gavetas (supino 5 vagas · dor 5 · pegada 5 · regras-ipf 8 · lesao 3); `pegada` ABRE e mesmo assim nao entrega nenhum dos dois. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"seguro a barra com o dedao por cima e nao em volta, isso passa na plataforma nos tres movimentos\" --topic pegada  -> F001-14 e F001-28 saem os dois.",
  "porqueEhEscondido": "E o caso puro de diluicao: a gaveta certa ABRE e perde. Cinco gavetas repartem as 40 vagas e `pegada` fica com 5 — nao cabem as duas linhas de regulamento. Pior, a resposta e um PAR que se contradiz de proposito: no agacho o polegar NAO precisa envolver a barra (F001-14), no supino ele TEM de envolver (F001-28). Entregar so uma das duas produz a resposta errada para o outro movimento, e a pergunta pede explicitamente os tres. O atleta diz `dedao`, que nao esta na lista de entrada de nenhuma gaveta; a base diz `polegar` e `thumbless`.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E05",
  "pergunta": "o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo",
  "idsEsperados": [
   "F001-79"
  ],
  "topicosCertos": [
   "equipamento",
   "terra"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs F001-79  -> existe (§3.5.d). Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo\"  -> abre 3 gavetas (pernas 14 vagas · terra 3 · sumo 14), `equipamento` NAO abre, o id nao sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo\" --topic equipamento  -> F001-79 sai em 1o.",
  "porqueEhEscondido": "Resposta ESTREITA de uma claim so: meia de cano ate a canela e OBRIGATORIA no terra. A pergunta cai no buraco descrito no briefing: `perna` abre `pernas` (125) e `sumo` (145), duas gavetas de MUSCULO e de TECNICA, que juntas comem 28 das 40 vagas, enquanto a gaveta de REGRA nem entra. O contra-teste do vocabulario: `regras-ipf` tem literalmente `meia comprida pro terra` na lista de entrada, e esta pergunta nao usa nenhuma dessas palavras — ela diz `vestir da metade da perna pra baixo`, que nao esta em entrada nenhuma. E o item que desclassifica na inspecao de equipamento se o atleta descobrir no dia.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 3
 },
 {
  "id": "E06",
  "pergunta": "meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda",
  "idsEsperados": [
   "V174-12",
   "V174-16"
  ],
  "topicosCertos": [
   "strap",
   "terra",
   "equipamento"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs V174-12 V174-16  -> 2 de 2 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda\"  -> abre 3 gavetas (equipamento 15 vagas · volume 4 · series-reps 4); `equipamento` abre com 15 vagas e NAO entrega nenhum dos dois. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"meu numero de treino nunca se repete quando eu testo em outro lugar com equipamento oficial, o que muda\" --topic strap  -> V174-12 e V174-16 saem os dois.",
  "porqueEhEscondido": "Gaveta MINUSCULA (`strap`, 15 claims) contra enormes (`volume` 750, `equipamento` 199), e a minuscula nem e cogitada. A resposta e um numero que muda a estrategia de abridora deste atleta: o gap de cerca de 100 lb entre terra de academia e de competicao vem de tres coisas — barra, anilhas e straps (V174-12) — e com strap a barra fica pendurada fora da mao, cortando ainda mais amplitude (V174-16). Nenhuma palavra da pergunta e da lista de entrada de `strap` (`straps`, `alca de pulso`, `poupar a mao`): o atleta descreve o SINTOMA (o numero nao se repete), nao a causa, porque a causa e justamente o que ele nao sabe.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 3
 },
 {
  "id": "E07",
  "pergunta": "durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao",
  "idsEsperados": [
   "V015-10",
   "V015-12"
  ],
  "topicosCertos": [
   "sono",
   "recuperacao"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs V015-10 V015-12  -> 2 de 2 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao\"  -> abre 5 gavetas (recuperacao 4 vagas · dor 8 · periodizacao 3 · meta-metodologia 3 · deload 4); `sono` NAO abre e nenhum id sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"durmo umas sete horas mas cada dia numa hora diferente, isso conta contra a recuperacao\" --topic sono  -> V015-10 e V015-12 saem.",
  "porqueEhEscondido": "Uma pergunta literalmente sobre sono nao abre a gaveta `sono` (57). A lista de entrada dela tem `dormir`, `horario de dormir`, `consistencia de sono` — e a pergunta diz `durmo` e `cada dia numa hora diferente`, que nao estao em entrada nenhuma. E exatamente o defeito da onda 2C repetido em outro tema: a vitrine depende da palavra literal. As 40 vagas vao para cinco gavetas de treino (recuperacao, dor, periodizacao, meta-metodologia, deload) e a resposta contraintuitiva se perde: a consistencia do horario pode importar MAIS que a duracao (V015-12), e horario consistente e o item numero um da higiene de sono (V015-10). Sem isso a resposta vira `durma mais`, que e o conselho errado para quem ja dorme sete horas.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E08",
  "pergunta": "na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso",
  "idsEsperados": [
   "G031-37",
   "G031-38",
   "G029-17"
  ],
  "topicosCertos": [
   "antropometria",
   "profundidade",
   "agacho"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs G031-37 G031-38 G029-17  -> 3 de 3 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso\"  -> abre 5 gavetas (agacho 3 vagas · core 5 · frequencia 8 · ordem-exercicio 8 · cinto 5); `antropometria` e `profundidade` NAO abrem, nenhum id sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"na parte de baixo do agacho parece que eu amasso contra mim mesmo e a lombar enrola no ultimo pedaco, da pra treinar isso pra fora ou e do meu osso\" --topic antropometria  -> os TRES saem (G031-38, G031-37, G029-17).",
  "porqueEhEscondido": "`antropometria` (78) e `profundidade` (87) sao pequenas e perdem para `agacho` (990) — que abre e leva 3 vagas — e para tres gavetas que nao tem nada a ver (frequencia, ordem-exercicio, cinto) que juntas levam 21. A resposta muda a decisao inteira: o femur encosta no acetabulo (G031-37), a falta de profundidade vem de esbarrar em si mesmo (G029-17) e para esse levantador algum arredondamento da lombar e INEVITAVEL, porque e o que permite contornar a articulacao (G031-38). A resposta padrao — mobilidade, mais alongamento, corrigir a forma — e a errada e faz o atleta perseguir uma correcao que o osso dele nao permite. `amasso contra mim mesmo` e `do meu osso` nao estao na lista de entrada de nenhuma gaveta.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E09",
  "pergunta": "uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida",
  "idsEsperados": [
   "G008-27",
   "G008-29",
   "G008-43"
  ],
  "topicosCertos": [
   "carga-de-treino",
   "volume",
   "meta-metodologia"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs G008-27 G008-29 G008-43  -> 3 de 3 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida\"  -> abre 5 gavetas (series-reps 4 vagas · volume 3 · progressao 3 · capacidade-trabalho 10 · frequencia 3); `carga-de-treino` NAO abre, nenhum id sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"uma semana tem mais series e a outra tem mais carga, existe alguma conta que ponha as duas na mesma medida\" --topic carga-de-treino  -> os TRES saem (G008-29, G008-43, G008-27) em 1o, 2o e 3o.",
  "porqueEhEscondido": "A gaveta certa e a segunda MENOR desta base com resposta util (`carga-de-treino`, 13 claims) e ela disputa com `volume` (750) e `progressao` (741) — 1 para 57. As palavras da pergunta (`series`, `carga`, `semana`) sao exatamente as que pertencem as gavetas gigantes, entao a diluicao aqui e estrutural, nao acidental. A lista de entrada de `carga-de-treino` tem `stress index`, `quanto pesou o treino`, `comparar carga entre exercicios diferentes` — a pergunta nao usa nenhuma delas de proposito. A resposta e o nome de uma ferramenta que o atleta nao sabe que existe: o stress index do Tuchscherer, que serve justamente para comparar series de estresse diferentes entre si (G008-29) e explica por que certas progressoes funcionam, por manterem banda estreita (G008-43).",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E10",
  "pergunta": "posso passar esparadrapo no dedao pra segurar melhor a barra no terra",
  "idsEsperados": [
   "F001-100"
  ],
  "topicosCertos": [
   "equipamento",
   "pegada"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs F001-100  -> existe (§3.11). Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"posso passar esparadrapo no dedao pra segurar melhor a barra no terra\"  -> abre 4 gavetas (terra 3 vagas · setup 8 · costas 8 · pegada 7); `pegada` ABRE com 7 vagas e mesmo assim nao entrega o id; `equipamento` nao abre. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"posso passar esparadrapo no dedao pra segurar melhor a barra no terra\" --topic equipamento  -> F001-100 sai em 1o (e --topic pegada tambem o devolve).",
  "porqueEhEscondido": "Resposta ESTREITA de uma claim so, e a resposta e um `sim, mas` que o atleta nao adivinha: duas camadas de fita medica em volta dos polegares sao permitidas, E a fita nao pode ser usada como ajuda para segurar a barra — que e literalmente o motivo declarado na pergunta. Uma gaveta com a resposta (`pegada`) abre e perde por diluicao contra `terra` (748), `setup` (356) e `costas` (119). `esparadrapo` nao esta na lista de entrada de nenhuma das 74 gavetas; a base diz `fita medica` e `tape`.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 4
 },
 {
  "id": "E11",
  "pergunta": "no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa",
  "idsEsperados": [
   "F001-30"
  ],
  "topicosCertos": [
   "setup",
   "supino"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs F001-30  -> existe (§4.2.2). Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa\"  -> abre 5 gavetas (supino 3 vagas · dor 8 · recuperacao 3 · competicao 3 · proximidade-da-falha 5); `setup` NAO abre e o id nao sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"no supino meu pe se mexe quando eu empurro forte, isso queima a tentativa\" --topic setup  -> F001-30 sai dentro das 40.",
  "porqueEhEscondido": "Resposta ESTREITA de sim/nao com uma claim so, e ela e o contrario do que o atleta teme: movimento de pe E permitido no supino, desde que o pe continue plano na plataforma. Duas gavetas com a resposta existem (`setup` 356, `supino` 694) e a que a contem em posicao alta nao abre; em vez dela abrem `dor` (8 vagas), `recuperacao` e `proximidade-da-falha`, porque `forte`, `empurro` e `queima` sao lidos como esforco e ardencia, nao como regra de plataforma. `queima a tentativa` nao esta em entrada nenhuma — o regulamento diz `anula`, `nulo`, `luz vermelha`. Errar aqui faz o atleta amarrar o pe e perder leg drive por medo de uma regra que nao existe.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 },
 {
  "id": "E12",
  "pergunta": "meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca",
  "idsEsperados": [
   "V127-15",
   "V127-13"
  ],
  "topicosCertos": [
   "lesao",
   "dor",
   "selecao-exercicio"
  ],
  "comoVoceProvou": "node research/tools/check-evidence.mjs V127-15 V127-13  -> 2 de 2 existem. Roteamento cego: node research/tools/check-evidence.mjs --pergunta \"meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca\"  -> abre 5 gavetas (ombros 10 vagas · recuperacao 3 · supino 3 · programacao 3 · dor 5); nenhum dos dois sai. Gaveta forcada: node research/tools/check-evidence.mjs --pergunta \"meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca\" --topic lesao  -> V127-15 e V127-13 saem os dois dentro das 40.",
  "porqueEhEscondido": "A resposta so serve inteira, e as duas metades moram em gavetas diferentes: V127-15 (lesao/dor/volume) diz que SIM, quem se detona num movimento pode fazer a maior parte ou ate TODO o trabalho com variacoes auto-limitantes; V127-13 (selecao-exercicio/supino/volume) e a condicao que impede o estrago, porque variacao sem leg drive praticado deixa o leg drive deficiente no supino principal. Cinco gavetas plausiveis repartem a tela, `ombros` (110) leva 10 vagas sem ter a resposta e `lesao` (362) nem abre. Para este atleta — reexposicao gradual do supino apos peitoral rompido — devolver so o `pode` sem a condicao e o erro que custa a competicao.",
  "jaPassaHoje": false,
  "gavetasQueDisputam": 5
 }
]

const CTX = `
REPO: ${REPO}. NÃO use git. Português do Brasil. Sem emoji em código.

ATLETA: natural, 87 kg, 28 anos, classe 93 kg IPF, nunca competiu, **histórico de lesão de
peitoral** — o bloco atual é reexposição gradual do supino. Agacho 250 / supino 170 / terra
sumo 268 (treino).

BASE: 6.912 claims em \`research/extract/*.jsonl\`. Vena (R###/V###), Blevins (G###),
regulamento IPF (F001). Campos: tier, scope, certainty, modo, conditions, conflicts,
**topic[] de vocabulário FECHADO com 74 termos**, claim pt-BR, verbatim inglês, params[].

CONSULTA:
  node research/tools/check-evidence.mjs <ids>
  node research/tools/check-evidence.mjs --grep "termo" --topic X --modo Y --limit 0
  node research/tools/check-evidence.mjs --pergunta "pergunta em linguagem natural"
VERIFICAÇÃO: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`.

ONDE GRAVAR SCRIPT DE REPRODUÇÃO: \`research/tools/auditoria-onda2f/\`. **Nunca em /tmp.**
Esta casa já perdeu material caro em pasta temporária, e achado sem comando que o reproduza
vira boato em duas semanas.

O PRINCÍPIO: **onde um compilador pode verificar, agente não deve.** Limite: determinismo
prova fidelidade à fonte, não correção da fonte.

MODOS DE FALHA DESTA CASA, todos reincidentes:
1. Copiar convenção errada do vizinho e chamar de padrão.
2. Trava estreita empurra o dado para fora da trava.
3. Documento e código divergem em silêncio.
4. Trava que se testa a si mesma.
5. **Relatório que diz sucesso sem sucesso** — e a variante nova, achada ontem: **prova que
   não prova.** O ataque da onda 2D "demonstrou" que abrir a gaveta certa mais uma vizinha era
   pior, com \`--topic convencional sumo terra\` devolvendo zero. Era artefato de parsing:
   \`--topic\` lia UM valor e descartava os outros dois em silêncio, então os dois comandos
   comparados eram o mesmo comando. **Confira o que o seu comando de fato executa antes de
   concluir qualquer coisa dele.**
`

const ESTADO = `
## O QUE FOI CONSTRUÍDO NA ONDA 2E — leia \`research/kb/ONDA-2E-CONSTRUTOR.md\` inteiro

A tela plana de 40 vagas virou **uma seção por gaveta**, cada uma com bloco de declaradas e
bloco de afins. \`montarSecaoDeGaveta\` não recebe as outras gavetas — sem cota global, sem
dedup entre seções — então a invariante de não-diluição vale por construção, e
\`secoes.test.mjs\` a cobra em 107 perguntas reais / 1.644 comparações de seção.

O construtor achou que **a diluição maior era DENTRO da gaveta**: \`conjuntoDoTopico\` injetava
até 60 claims afins das gavetas grandes na mesma fila das declaradas; em D06 a resposta era a
34ª declarada e sumia.

**Placar auto-reportado** (os 42 canários P##/B##/D## são todos públicos e ele os enxergava):

    D01-D12    algum: 2 -> 5     todos: 0 -> 0
    B01-B12    algum: 2 -> 3     todos: 0 -> 1
    P01-P18    algum: 7 -> 11    todos: 2 -> 6
    os 42      algum: 11 -> 19   todos: 2 -> 7

**Fisgada**, o caso mais caro desta base: as CINCO chegam sem \`--topic\`, juntas na seção
\`dor\` (#5, #9, #28, #30, #31), e a paráfrase sem jargão vai a 5 de 5 (era 3).

**Falha aberta que ele declarou:** D05 entrega 1 de 3, e a seção de \`convencional\` é bit a
bit a mesma com 1 ou 5 gavetas — **a invariante vale e não basta**.

**Preço:** a saída dobrou, ~14 kB -> ~31 kB na pergunta mais larga.

**Dívida:** \`LIGACOES_POR_FOCO 4->40\` sobrevive à mutação (inerte acima de 6 por aritmética),
faixa 4->6 sem trava. Cobertura de mutação do vocabulário era 68/74 no ataque \`troca\`, com
\`agacho\`, \`aprendizado-motor\`, \`barra-alta\`, \`convencional\`, \`core\` e \`intensidade\`
descobertas.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Medir')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['cegosPassaram', 'cegosTotal', 'cegosCompletos', 'invarianteVale', 'fisgadaCompleta', 'furos', 'veredito'],
  properties: {
    cegosPassaram: { type: 'number', description: 'dos 12 E##, quantos devolvem ALGUM id esperado — o número da onda' },
    cegosTotal: { type: 'number' },
    cegosCompletos: { type: 'number' },
    soterrados: { type: 'number', description: 'dos 12, gaveta certa aberta e resposta ausente' },
    invarianteVale: { type: 'boolean', description: 'acrescentar gaveta nunca remove id de outra secao — pelo SEU teste, nao pelo dele' },
    fisgadaCompleta: { type: 'boolean' },
    fisgadaParafrase: { type: 'number', description: 'quantas das cinco chegam com a parafrase sem jargao' },
    publicosPassaram: { type: 'number', description: 'dos 42 publicos' },
    custoKB: { type: 'number', description: 'tamanho da saida na pergunta mais larga' },
    decorou: { type: 'boolean' },
    furos: { type: 'array', items: { type: 'string' } },
    veredito: { type: 'string' },
  },
}

const ROTA_SCHEMA = {
  type: 'object',
  required: ['escolhas'],
  properties: {
    escolhas: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'topicos', 'porque'],
        properties: {
          id: { type: 'string', description: 'E01..E12' },
          topicos: { type: 'array', items: { type: 'string' }, description: '1 a 4 tópicos do vocabulário FECHADO, em ordem de aposta' },
          porque: { type: 'string', description: 'uma linha' },
          incerto: { type: 'boolean', description: 'true se você não sabe onde isto mora' },
        },
      },
    },
  },
}

const PERGUNTAS_SO = CEGOS.map((c) => `${c.id}. ${c.pergunta}`).join('\n')

const medidas = await parallel([
  () =>
    agent(
      `${CTX}\n${ESTADO}\n\n` +
        `## VOCÊ JULGA AS SEÇÕES POR GAVETA — E VOCÊ TEM O QUE O CONSTRUTOR NÃO TEVE\n\n` +
        `### O CONJUNTO DE TESTE — 12 canários escritos ANTES dele e escondidos dele\n\n` +
        CEGOS.map(
          (c) =>
            `**${c.id}** ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}\n   prova forçada: ${c.comoVoceProvou}`,
        ).join('\n\n') +
        `\n\n### O que fazer, nesta ordem\n\n` +
        `**1. Rode os 12, a pergunta EXATAMENTE como escrita, sem \`--topic\`.** Quantos devolvem ` +
        `algum id? Quantos todos? **Estes são os números da onda.** Diga qual definição de tela ` +
        `usou — o construtor unificou em \`telaDaResposta()\`; confirme que é uma só de verdade.\n\n` +
        `**2. ATAQUE A INVARIANTE com o SEU teste, não o dele.** A saída com N+1 gavetas contém a ` +
        `saída com N, seção por seção? Ele afirma que vale por construção porque ` +
        `\`montarSecaoDeGaveta\` não vê as outras gavetas. Procure o contra-exemplo: o roteamento ` +
        `muda quando muda o conjunto? Alguma etapa a jusante — dedup, ordenação, corte de seção — ` +
        `reintroduz o acoplamento?\n\n` +
        `**3. Cuidado com a prova que não prova.** \`--topic\` lê UM valor. Antes de comparar dois ` +
        `comandos, imprima o que cada um realmente executou. Foi assim que o ataque anterior ` +
        `produziu um achado inteiro que não existia.\n\n` +
        `**4. A fisgada, verificada duas vezes.** \`--pergunta "fisgada de 3/10 no peitoral na ` +
        `terceira série de supino pausado, continuo?"\`: as CINCO (V079-34, V001-06, V138-19, ` +
        `V086-21, V027-23) chegam, e em que seção e posições? E a paráfrase sem jargão *"senti ` +
        `uma pontada nível 3 de 10 no peito na 3ª série do supino com pausa, sigo o treino"*. ` +
        `**Regressão aqui é o achado mais importante do seu relatório**, porque é o caso que pode ` +
        `machucar o atleta.\n\n` +
        `**5. O preço.** A saída dobrou para ~31 kB. Meça de novo, e diga se cabe num prompt junto ` +
        `com o resto do que um agente de conversa precisa carregar. Custo alto por +2 ids é um ` +
        `resultado, não um detalhe.\n\n` +
        `**6. Mutação, no lado que AFROUXA.** Toda constante nova de seção: zere, infle, exija ` +
        `vermelho. Dá para fazer uma seção inteira sumir com o build verde? E remeça a dívida ` +
        `declarada (\`LIGACOES_POR_FOCO\`, e as 6 gavetas descobertas no ataque \`troca\`).\n\n` +
        `**7. Os 42 públicos e a paráfrase.** Se os públicos subirem muito mais que os cegos, ` +
        `otimizou-se o visível — e desta vez o construtor declarou que varreu constantes contra ` +
        `os 64 canários com id esperado, o que **inclui** B## e D##. Diga o tamanho da distância.\n\n` +
        `Grave seus scripts em \`research/tools/auditoria-onda2f/\`. Seja específico e sem ` +
        `diplomacia. Se o número cego for baixo, **diga o número baixo.**`,
      { label: 'atacar', phase: 'Medir', schema: ATAQUE_SCHEMA, effort: 'high' },
    ),
  ...[1, 2, 3].map((n) => () =>
    agent(
      `REPO: ${REPO}. Português do Brasil. NÃO use git.\n\n` +
        `## VOCÊ É O AGENTE DE CONVERSA. ESCOLHA ONDE PROCURAR.\n\n` +
        `Um atleta de powerlifting faz uma pergunta. A base de conhecimento está organizada em ` +
        `**74 gavetas de vocabulário fechado**. Seu trabalho é só um: **para cada pergunta, dizer ` +
        `em qual ou quais gavetas a resposta mora.**\n\n` +
        `### A única ferramenta que você usa\n\n` +
        `\`\`\`\nnode research/tools/check-evidence.mjs --topicos\n\`\`\`\n\n` +
        `Isso imprime as 74 gavetas com uma glosa de uma linha e o tamanho de cada. Leia com ` +
        `calma: a escolha certa depende de distinguir gavetas parecidas, e a glosa existe para ` +
        `isso.\n\n` +
        `### Regras, e elas são o experimento\n\n` +
        `- **NÃO use \`--pergunta\`.** É a porta determinística, e é justamente contra ela que ` +
        `você está sendo comparado. Usá-la anula a medição.\n` +
        `- **NÃO abra \`research/kb/CANARIOS*.json\`, nem \`research/tools/auditoria*\`, nem ` +
        `\`research/kb/ONDA-*\`.** Esses arquivos contêm as respostas esperadas. Se você as ler, ` +
        `o número que sair daqui é lixo e o trabalho de quatro ondas vai junto.\n` +
        `- **Você PODE** ler o \`GLOSSARIO-TOPICOS.json\` e usar \`--topic X\` e \`--grep\` para ` +
        `entender do que uma gaveta trata — mas escolha pela pergunta, não caçando a resposta ` +
        `primeiro.\n` +
        `- **1 a 4 gavetas por pergunta**, em ordem de aposta. Se você não souber, marque ` +
        `\`incerto: true\` e escolha assim mesmo: um "não sei" honesto vale mais que um chute ` +
        `disfarçado, e a medição precisa saber a diferença.\n\n` +
        `### As 12 perguntas\n\n` +
        `${PERGUNTAS_SO}\n\n` +
        `Responda com o objeto estruturado. **Não grave arquivo nenhum.** Você é o roteador ` +
        `número ${n} de três rodando as mesmas 12 perguntas em paralelo: o que se mede é o ` +
        `acerto E a variância entre vocês, então não tente adivinhar o que os outros fariam.`,
      { label: `rota-${n}`, phase: 'Medir', schema: ROTA_SCHEMA, model: 'sonnet', effort: 'medium' },
    ),
  ),
])

const ataque = medidas[0]
const rotas = medidas.slice(1).filter(Boolean)
log(`ataque cego: ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? 12} · ${rotas.length}/3 roteadores-modelo responderam`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Somar')

const PLACAR_SCHEMA = {
  type: 'object',
  required: ['porRoteador', 'unanimidade', 'melhorQueDeterministico', 'veredito'],
  properties: {
    porRoteador: {
      type: 'array',
      items: {
        type: 'object',
        required: ['roteador', 'gavetaCerta', 'idsNaTela', 'completos'],
        properties: {
          roteador: { type: 'string' },
          gavetaCerta: { type: 'number', description: 'em quantas das 12 escolheu ao menos um topicosCertos' },
          idsNaTela: { type: 'number', description: 'em quantas das 12 a tela de --topic mostrou algum id esperado' },
          completos: { type: 'number', description: 'em quantas mostrou TODOS os ids esperados' },
        },
      },
    },
    unanimidade: { type: 'number', description: 'em quantas das 12 os tres roteadores escolheram a mesma gaveta principal' },
    melhorQueDeterministico: { type: 'boolean', description: 'o caminho do agente supera o --pergunta nos mesmos 12' },
    custoPorPergunta: { type: 'string', description: 'estimativa de tokens do caminho do agente por consulta' },
    veredito: { type: 'string', description: 'sem diplomacia: o --pergunta deve continuar sendo o produto, ou virar conveniencia?' },
  },
}

const placar = await agent(
  `${CTX}\n\n` +
    `## SUA TAREFA: PONTUAR O CAMINHO DO AGENTE CONTRA O DETERMINÍSTICO\n\n` +
    `Cinco ondas foram gastas consertando \`--pergunta\`, o roteador determinístico. Ele existe ` +
    `porque **um compilador não pode ter modelo dentro dele** — não há chave de API neste ` +
    `repositório, então só o que é determinístico pode entrar no \`check:kb\`.\n\n` +
    `Mas **quem vai consumir esta base em produção é um agente**, que lê as 74 gavetas e escolhe. ` +
    `Esse caminho nunca foi medido uma vez sequer. Deixou-se "o que é mensurável" virar "o que é ` +
    `o produto". Você mede agora.\n\n` +
    `### O gabarito — os 12 canários cegos, com os ids provados\n\n` +
    CEGOS.map((c) => `**${c.id}** ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}`).join('\n\n') +
    `\n\n### O que os três roteadores escolheram, sem ver o gabarito\n\n` +
    rotas
      .map((r, i) => `#### roteador ${i + 1}\n` + (r.escolhas ?? []).map((e) => `${e.id}: [${(e.topicos ?? []).join(', ')}]${e.incerto ? ' (incerto)' : ''} — ${e.porque}`).join('\n'))
      .join('\n\n') +
    `\n\n### Como pontuar\n\n` +
    `Para cada roteador e cada pergunta, rode a consulta como o agente rodaria: ` +
    `\`--pergunta "<a pergunta>" --topic <a gaveta que ELE escolheu>\`. **Atenção: \`--topic\` lê ` +
    `UM valor** — confirme como a ferramenta parseia hoje, e se for um só, rode um comando por ` +
    `gaveta escolhida e una as telas. Registre o comando exato; foi um erro de parsing que ` +
    `produziu um achado falso na onda 2D.\n\n` +
    `Conte três coisas por roteador: em quantas das 12 ele **escolheu** uma gaveta certa; em ` +
    `quantas a tela resultante **mostrou** algum id esperado; em quantas mostrou **todos**. A ` +
    `segunda é a que importa — escolher certo e não receber a resposta é o defeito que esta base ` +
    `tem.\n\n` +
    `Meça também a **unanimidade**: em quantas das 12 os três escolheram a mesma gaveta ` +
    `principal? Roteamento por modelo com variância alta é caro de confiar, e isso muda o ` +
    `veredito.\n\n` +
    `**Compare com o determinístico nos MESMOS 12**, rodando \`--pergunta\` sozinho. Um número ` +
    `contra o outro, na mesma tabela.\n\n` +
    `### O veredito que eu quero de você\n\n` +
    `Sem diplomacia, e é uma decisão de dinheiro: **o \`--pergunta\` determinístico deve ` +
    `continuar sendo o produto, ou virar conveniência de linha de comando enquanto o produto ` +
    `passa a ser o agente com o glossário?** Se for a segunda, diga o que o \`check:kb\` passa a ` +
    `poder garantir e o que deixa de poder — porque um gate que não mede o caminho real é pior ` +
    `que um gate ausente, já que dá confiança falsa.\n\n` +
    `Grave seus scripts em \`research/tools/auditoria-onda2f/\`.`,
  { label: 'placar', phase: 'Somar', schema: PLACAR_SCHEMA, effort: 'high' },
)

log(`caminho do agente: ${(placar?.porRoteador ?? []).map((p) => `${p.idsNaTela}/12`).join(' · ')} · unanimidade ${placar?.unanimidade ?? '?'}/12`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n${ESTADO}\n\n## FECHAR A ONDA 2F\n\n` +
    `**Ataque cego:** ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? '?'} algum, ` +
    `${ataque?.cegosCompletos ?? '?'} completos, invariante=${ataque?.invarianteVale ?? '?'}, ` +
    `fisgada=${ataque?.fisgadaCompleta ?? '?'} (paráfrase ${ataque?.fisgadaParafrase ?? '?'}/5), ` +
    `custo ${ataque?.custoKB ?? '?'} kB, decorou=${ataque?.decorou ?? '?'}\n${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n**Caminho do agente:** ${JSON.stringify(placar?.porRoteador ?? [])}, unanimidade ` +
    `${placar?.unanimidade ?? '?'}/12, melhor que o determinístico=${placar?.melhorQueDeterministico ?? '?'}\n` +
    `${placar?.veredito ?? ''}\n\n` +
    `### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.**\n\n` +
    `2. **Grave os 12 cegos em \`research/kb/CANARIOS.json\`** como E01–E12, **com o resultado ` +
    `medido, inclusive os que falham.** Confira que ficaram lá. Eles estão em ` +
    `\`research/kb/CANARIOS-CEGOS-E.json\`, e **apague esse arquivo depois de absorvê-los** — ` +
    `duas cópias do mesmo canário divergem em silêncio, que é o modo de falha nº 3.\n\n` +
    `3. **O veredito no topo do \`RECUPERACAO.md\`**, com o número cego, o do caminho do agente, ` +
    `e a distância entre público e cego. Sem adjetivo.\n\n` +
    `4. **Atualize \`ESTADO.md\` e o \`RUNBOOK.md\` §8.** Não resolvidas continuam na lista.\n\n` +
    `5. **A DECISÃO, e é o item mais importante deste fechamento.** Seis ondas de recuperação. ` +
    `Escreva em \`research/kb/RECUPERACAO.md\`, com os números na frente e sem diplomacia, qual ` +
    `das três é a verdade:\n\n` +
    `   (a) resolveu, e o que falta é acabamento;\n` +
    `   (b) ajudou, e sobrou um defeito NOMEADO com o próximo passo definido;\n` +
    `   (c) o problema não está onde estamos cavando — nesse caso **diga o que faria em vez ` +
    `disso**, sabendo que ingerir mais corpus está descartado por medição e que a base TEM a ` +
    `resposta.\n\n` +
    `   Um (b) confortável escrito onde a verdade é (c) é a pior coisa que este arquivo pode ` +
    `conter, e é a única forma de esta linha de trabalho continuar drenando dinheiro.\n\n` +
    `6. **Responda, com número na frente, as duas perguntas abertas do atleta:**\n` +
    `   - Vale pagar uma frota de modelo barato para dar a cada uma das 6.912 claims uma linha ` +
    `de "que pergunta esta claim responde"?\n` +
    `   - O \`--pergunta\` determinístico continua sendo o produto, ou o produto passa a ser o ` +
    `agente com o glossário e o \`--pergunta\` vira conveniência?\n\n` +
    `7. **\`research/kb/ONDA-2C.md\` e \`research/RETOMAR.md\`**: atualize para o estado de agora.\n\n` +
    `**Não proponha ingerir mais corpus.** Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  cegos: `${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? 12}`,
  cegosCompletos: ataque?.cegosCompletos,
  invarianteVale: ataque?.invarianteVale,
  fisgada: ataque?.fisgadaCompleta,
  fisgadaParafrase: ataque?.fisgadaParafrase,
  caminhoDoAgente: placar?.porRoteador,
  unanimidade: placar?.unanimidade,
  melhorQueDeterministico: placar?.melhorQueDeterministico,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  vereditoDoCaminho: placar?.veredito,
  fecho,
}
