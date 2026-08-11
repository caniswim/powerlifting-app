export const meta = {
  name: 'onda-2e-secoes',
  description: 'Troca a tela plana de 40 vagas por uma secao por gaveta: a alocacao soma-zero e o desenho que garante o soterramento, nao um peso mal calibrado',
  phases: [
    { title: 'Cegos', detail: '12 canarios novos (E##) — os 61 anteriores viraram publicos' },
    { title: 'Construir', detail: 'uma secao por gaveta aberta, com a invariante de nao-diluicao travada' },
    { title: 'Atacar', detail: 'o numero cego, a invariante, e a precisao que se paga por ela' },
    { title: 'Fechar', detail: 'veredito, e a decisao sobre continuar ou repensar a consulta' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

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

ARMADILHA REAL, e ela já custou três rodadas a um agente: **\`grep\` devolve ZERO linhas em
\`research/tools/roteador.mjs\` sem avisar nada**, porque um byte NUL faz o arquivo passar por
binário. Use \`grep -a\`.

O PRINCÍPIO: **onde um compilador pode verificar, agente não deve.** Limite: determinismo
prova fidelidade à fonte, não correção da fonte.

MODOS DE FALHA DESTA CASA, todos reincidentes:
1. Copiar convenção errada do vizinho e chamar de padrão.
2. Trava estreita empurra o dado para fora da trava.
3. **Documento e código divergem em silêncio** — ontem havia DUAS definições de "tela" (o
   \`telaDe()\` corta em 40, o CLI imprime 68) e a divergência produziu um erro de relatório.
4. **Trava que se testa a si mesma.** Ontem \`PISO_VAGAS=3\` era testado por
   \`alocacao.test.mjs:118\` afirmando \`magra >= 3\`, que é a constante reescrita.
5. **Relatório de agente que diz sucesso sem sucesso.** Cinco ondas seguidas. Na última, os
   números do resumo reproduziam e **as varreduras que escolheram as constantes, não**.
`

const DIAGNOSTICO = `
## POR QUE ESTA ONDA EXISTE — o desenho é o defeito, não o peso

Três ondas consertaram sintomas e o número cego foi de 0 para 2 de 12. O ataque de ontem achou
a causa, e ela é arquitetural:

**A alocação é SOMA-ZERO.** A resposta é UMA tela plana de 40 vagas repartida entre as gavetas
abertas. Então cada gaveta a mais dilui as outras, e **abrir a gaveta certa MAIS uma vizinha é
pior que não abrir nenhuma**:

    node research/tools/check-evidence.mjs --pergunta "<D05>" --topic convencional
      -> devolve os 3 ids esperados
    node research/tools/check-evidence.mjs --pergunta "<D05>" --topic convencional sumo terra
      -> devolve NADA

    idem D06: --topic comandos-ipf devolve F001-11; com "agacho" junto, devolve NADA.

Isto explica o paradoxo das três ondas: **melhorar o roteamento PIORA a entrega**, porque
roteamento melhor abre mais gavetas e cada gaveta a mais rouba vagas das outras. Soterramento
subiu de 10 para 11 de 12 na mesma onda em que o roteamento melhorou.

E o contraste que prova que o conteúdo está lá: **\`--topic <a gaveta certa>\` sozinho funciona
em 9 dos 12 cegos.** A ferramenta sabe achar. Ela não sabe APRESENTAR.

O único ganho real da onda passada, e ele importa para o corpo do atleta: a pergunta da
fisgada entrega as CINCO claims do limiar de dor sem \`--topic\` (posições 13/18/36/38/39).
**Margem de duas vagas, e ela não sobrevive a paráfrase** (cai para 3 de 5). Qualquer
regressão aí é inaceitável.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Cegos')

const CANARIO_SCHEMA = {
  type: 'object',
  required: ['canarios'],
  properties: {
    canarios: {
      type: 'array',
      description: '12 perguntas presente-escondido NOVAS',
      items: {
        type: 'object',
        required: ['id', 'pergunta', 'idsEsperados', 'topicosCertos', 'comoVoceProvou', 'porqueEhEscondido', 'jaPassaHoje'],
        properties: {
          id: { type: 'string', description: 'E01, E02, …' },
          pergunta: { type: 'string' },
          idsEsperados: { type: 'array', items: { type: 'string' } },
          topicosCertos: { type: 'array', items: { type: 'string' } },
          comoVoceProvou: { type: 'string', description: 'o comando exato, incluindo o --topic que prova que a resposta sai quando a gaveta e forcada' },
          porqueEhEscondido: { type: 'string' },
          jaPassaHoje: { type: 'boolean', description: 'false obrigatoriamente' },
          gavetasQueDisputam: { type: 'number', description: 'quantas gavetas plausiveis a pergunta abre hoje — quanto mais, mais ela mede diluicao' },
        },
      },
    },
  },
}

const cegos = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## SUA TAREFA: O CONJUNTO DE TESTE CEGO — 12 CANÁRIOS NOVOS (E01–E12)\n\n` +
    `\`research/kb/CANARIOS.json\` tem 61 canários, e P##, C##, B## e D## são todos **públicos**: ` +
    `quem conserta os enxerga. Conjunto de teste publicado vira conjunto de treino — é a regra ` +
    `que esta casa comprou caro, quatro vezes.\n\n` +
    `### Método\n\n` +
    `1. **Ache primeiro, pergunte depois.** \`--topic X --limit 0\`, ache claims que respondem, ` +
    `anote ids **e o tópico onde moram**, e só então escreva a pergunta do atleta, sem as ` +
    `palavras da claim.\n` +
    `2. **Prove duas coisas, não uma.** Que os ids existem, E que \`--pergunta ... --topic <a ` +
    `gaveta certa>\` os devolve. O segundo comando é obrigatório: ele separa "a base não tem" de ` +
    `"a apresentação não mostra", que é exatamente o que esta onda mede.\n` +
    `3. **Rode \`--pergunta\` sem \`--topic\` e DESCARTE a que já funciona.** \`jaPassaHoje\` false ` +
    `nas 12.\n` +
    `4. **Leia os 61 para não repetir frase.** Assunto repetido pode.\n` +
    `5. **Esta onda mede DILUIÇÃO, então calibre o conjunto para ela.** Pelo menos **sete** dos ` +
    `12 devem ser perguntas que abrem **três ou mais gavetas plausíveis** hoje — é onde a tela ` +
    `plana mata a resposta. O caso canônico: uma pergunta sobre terra convencional abre ` +
    `\`convencional\`, \`sumo\` e \`terra\`, e as três juntas devolvem menos que \`convencional\` ` +
    `sozinha. Rode \`--pergunta\` e conte as gavetas abertas; registre em \`gavetasQueDisputam\`.\n` +
    `6. **Pelo menos três de peitoral, supino e dor.** É onde o erro machuca este atleta.\n` +
    `7. **Ao menos dois de resposta ESTREITA** — sim/não com uma claim só, tipo regulamento. E ` +
    `ao menos um cuja resposta esteja em gaveta MINÚSCULA disputando com uma enorme.\n` +
    `8. **Leia o \`GLOSSARIO-TOPICOS.json\`** e escreva perguntas cuja palavra NÃO está na lista ` +
    `de entrada de ninguém — senão você testa a lista, não a camada. Na onda 2C a vitrine ` +
    `dependia da palavra literal \`coração\` e caía trocando para \`cardiovascular\`.\n\n` +
    `**NÃO conserte nada. NÃO grave arquivo nenhum** — nem em \`research/\`, nem em \`/tmp\`, nem ` +
    `no scratchpad. Sua entrega é o objeto estruturado e nada mais.`,
  { label: 'cegos', phase: 'Cegos', schema: CANARIO_SCHEMA, effort: 'high' },
)

const listaCega = cegos?.canarios ?? []
log(`${listaCega.length} canários cegos (E##) — mediana de gavetas em disputa: ${listaCega.map((c) => c.gavetasQueDisputam ?? 0).sort((a, b) => a - b)[Math.floor(listaCega.length / 2)] ?? '?'}`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Construir')

const obra = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## SUA TAREFA: UMA SEÇÃO POR GAVETA, NO LUGAR DA TELA PLANA\n\n` +
    `Pare de calibrar a repartição das 40 vagas. **Mude a forma da resposta.** Cada gaveta ` +
    `aberta ganha a **própria seção rotulada, com o próprio topo**, em vez de disputar um ` +
    `orçamento único. \`dor\` entrega as dela, \`supino\` entrega as dele, e a gaveta pequena ` +
    `nunca é diluída pela grande.\n\n` +
    `Quem lê esta saída é um agente de conversa, que lida bem com cinco blocos rotulados. E é ` +
    `literalmente o que \`--topic\` já produz, um de cada vez — a prova de que funciona é que ` +
    `\`--topic <gaveta certa>\` acerta 9 dos 12 cegos.\n\n` +
    `### A INVARIANTE, e ela é o coração desta tarefa\n\n` +
    `**Acrescentar uma gaveta ao conjunto roteado NUNCA pode remover um id que já aparecia na ` +
    `seção de outra gaveta.** É a negação exata do defeito medido, e é uma propriedade ` +
    `verificável por compilador, sem modelo nenhum: para uma pergunta, compare a saída com N ` +
    `gavetas e com N+1, e exija que a segunda contenha a primeira, seção por seção.\n\n` +
    `**Construa esse teste e faça o \`check:kb\` cobrá-lo**, sobre a base real e sobre um número ` +
    `honesto de perguntas — não sobre três casos escolhidos a dedo. Se a sua implementação ` +
    `violar a invariante em algum caso, **o caso é o achado**: registre em vez de esconder.\n\n` +
    `### O que mais precisa ser verdade\n\n` +
    `1. **A saída continua cabendo num prompt.** Teto por seção e teto de seções (\`MAX_TOPICOS\` ` +
    `hoje é 5). O produto dos dois é o custo, e ele é seu para escolher — mas **um teto global ` +
    `que corte seções de baixo reintroduz o soma-zero pela porta dos fundos.** Se você precisar ` +
    `de um, que ele corte a seção INTEIRA e a saída diga que cortou, em vez de comer as vagas ` +
    `dela em silêncio.\n` +
    `2. **UMA definição de tela, e ela é escrita.** Hoje há duas — \`telaDe()\` corta em 40, o CLI ` +
    `imprime 68 — e a divergência já produziu erro de medição. Documente qual é o contrato e ` +
    `faça o gate medir exatamente aquilo. Modo de falha nº 3.\n` +
    `3. **A fisgada não pode regredir.** \`--pergunta "fisgada de 3/10 no peitoral na terceira ` +
    `série de supino pausado, continuo?"\` entrega hoje as CINCO (V079-34, V001-06, V138-19, ` +
    `V086-21, V027-23) nas posições 13/18/36/38/39 — margem de duas vagas. Com seções, elas ` +
    `deveriam ficar juntas e altas na seção \`dor\`. **Cole a saída.** E teste a paráfrase sem ` +
    `jargão (*"senti uma pontada nível 3 de 10 no peito na 3ª série do supino com pausa, sigo o ` +
    `treino"*), que hoje cai para 3 de 5.\n` +
    `4. **Mate o \`PISO_VAGAS\`, ou justifique-o com medição que reproduz.** Ele é trava que se ` +
    `testa a si mesma (\`alocacao.test.mjs:118\` afirma \`magra >= 3\`, a constante reescrita), e ` +
    `a bancada do próprio construtor mostra \`piso=1\` ganhando em toda coluna. Com seções, ` +
    `provavelmente ele deixa de existir — melhor ainda.\n` +
    `5. **A precisão do topo tem de melhorar, não piorar.** A posição mediana da resposta certa ` +
    `foi de 6 para 8 na onda passada, e no topo da fisgada os 2º e 3º são lixo ` +
    `relevante-por-pouco enquanto a claim do limiar está em 13º. Meça antes e depois.\n` +
    `6. **Tire o byte NUL de \`roteador.mjs\`** ou documente-o onde o próximo agente vai olhar. ` +
    `Ele fez \`grep\` mentir em silêncio e custou três rodadas.\n\n` +
    `### Higiene\n\n` +
    `Toda constante nova precisa de canário que a mate **nos dois sentidos, apertar E afrouxar** ` +
    `— as mutações que sobreviveram nesta casa foram todas do lado que afrouxa, porque o teste só ` +
    `cobria o que aperta. **Prove por mutação e cole o vermelho.** E nenhuma trava pode importar ` +
    `a constante que verifica.\n\n` +
    `**Não reescreva o que não é seu:** roteamento (pergunta → tópico) está consertado e não é ` +
    `desta onda; glossário idem. Se você mexer neles, as medições se misturam.\n\n` +
    `Existe um conjunto de 12 canários novos (E##) que você **não vai ver**. Os 61 do ` +
    `\`CANARIOS.json\` você enxerga e pode usar, mas casá-los sem consertar a forma aparece em uma ` +
    `linha do relatório do atacante — aconteceu nas quatro ondas anteriores.\n\n` +
    `\`npm run check:kb\`, \`npm run check:gate\` e \`npm run build\` verdes. Atualize ` +
    `\`research/kb/RECUPERACAO.md\`.`,
  { label: 'secoes', phase: 'Construir', effort: 'high' },
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const ATAQUE_SCHEMA = {
  type: 'object',
  required: ['cegosPassaram', 'cegosTotal', 'cegosCompletos', 'soterrados', 'invarianteVale', 'fisgadaCompleta', 'furos', 'veredito'],
  properties: {
    cegosPassaram: { type: 'number', description: 'dos 12 E##, quantos devolvem ALGUM id esperado — o número da onda' },
    cegosTotal: { type: 'number' },
    cegosCompletos: { type: 'number', description: 'dos 12 E##, quantos devolvem TODOS os ids esperados' },
    soterrados: { type: 'number', description: 'dos 12, em quantos a gaveta certa abriu e a resposta nao chegou — era 11 de 12' },
    invarianteVale: { type: 'boolean', description: 'acrescentar gaveta nunca remove id de outra secao — testado por voce, nao pelo teste dele' },
    fisgadaCompleta: { type: 'boolean', description: 'as CINCO do limiar de dor chegam sem --topic' },
    fisgadaParafrase: { type: 'number', description: 'quantas das cinco chegam com a parafrase sem jargao' },
    publicosPassaram: { type: 'number' },
    publicosTotal: { type: 'number' },
    posicaoMediana: { type: 'number', description: 'posicao mediana da resposta certa na tela — era 8, antes disso 6' },
    telaEstreita: { type: 'boolean' },
    decorou: { type: 'boolean' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito com o comando que reproduz' },
    veredito: { type: 'string' },
  },
}

const ataque = await agent(
  `${CTX}\n${DIAGNOSTICO}\n\n` +
    `## VOCÊ JULGA A MUDANÇA DE FORMA — E VOCÊ TEM O QUE ELE NÃO TEVE\n\n` +
    `Relato de quem construiu:\n\n${obra ?? '(sem relato)'}\n\n` +
    `**Não acredite no relato.** Cinco ondas seguidas de relatório otimista. Na última os ` +
    `números do resumo reproduziam e **as varreduras que escolheram as constantes, não** — ` +
    `confira sempre o número que DECIDIU alguma coisa, não só o que foi publicado.\n\n` +
    `### O CONJUNTO DE TESTE — 12 canários que ninguém viu\n\n` +
    listaCega
      .map((c) => `**${c.id}** (${c.gavetasQueDisputam ?? '?'} gavetas em disputa) ${c.pergunta}\n   espera: ${(c.idsEsperados ?? []).join(' ')}\n   gaveta certa: ${(c.topicosCertos ?? []).join(', ')}\n   prova forçada: ${c.comoVoceProvou}`)
      .join('\n\n') +
    `\n\n### O que fazer, nesta ordem\n\n` +
    `**1. Rode os 12 cegos, a pergunta EXATAMENTE como escrita, sem \`--topic\`.** Quantos ` +
    `devolvem algum id? Quantos devolvem TODOS? **Estes são os números da onda.** Diga por qual ` +
    `definição de tela mediu, e confira se o código tem uma só — ontem tinha duas.\n\n` +
    `**2. ATAQUE A INVARIANTE, que é o que esta onda promete.** Para cada cego e para uma ` +
    `amostra maior de perguntas: a saída com N+1 gavetas contém a saída com N, seção por seção? ` +
    `**Não rode o teste dele — escreva o seu.** O caso que originou tudo: \`--topic convencional\` ` +
    `devolvia 3 ids e \`--topic convencional sumo terra\` devolvia zero. Isso ainda acontece em ` +
    `algum lugar? Procure com afinco: uma invariante que vale nos casos do autor e falha nos seus ` +
    `é o resultado típico desta casa.\n\n` +
    `**3. Separe soterramento de roteamento.** Gaveta certa aberta e resposta ausente é ` +
    `soterramento — **era 11 de 12 e é o alvo desta onda.**\n\n` +
    `**4. A fisgada, verificada duas vezes.** As CINCO chegam sem \`--topic\`? Em que posições, e ` +
    `em qual seção? E a paráfrase sem jargão — hoje cai para 3 de 5. **Regressão aqui é ` +
    `inaceitável e tem de aparecer em destaque no seu relatório**, porque é o caso que pode ` +
    `machucar o atleta.\n\n` +
    `**5. O preço da mudança, que sempre existe.** Seções por gaveta podem encher a tela de ` +
    `seções irrelevantes e empurrar a boa para o rodapé. Meça: a posição mediana da resposta ` +
    `certa melhorou (era 8)? Perguntas estreitas devolvem pouco? Pergunta fora de domínio ainda ` +
    `diz que não sabe? **E o custo em tamanho de saída — cabe num prompt?**\n\n` +
    `**6. Mutação.** Toda constante nova: zere, infle, inverta, exija VERMELHO. Ataque o lado ` +
    `que AFROUXA, que é por onde escaparam todas as sobreviventes desta casa. E teste o caso ` +
    `insidioso: dá para fazer uma seção sumir com o build verde?\n\n` +
    `**7. Os públicos e a paráfrase.** Se os públicos subirem muito mais que os cegos, ` +
    `otimizou-se o visível. E reescreva as que passam preservando o sentido: na onda passada 2 de ` +
    `8 sobreviviam, e o conserto melhorava quando a paráfrase usava o jargão da gaveta — ou seja, ` +
    `**a camada acha quando o atleta já sabe o vocabulário**, que é o oposto do que ela existe ` +
    `para fazer.\n\n` +
    `Seja específico e sem diplomacia. Se o número cego continuar baixo, **diga o número baixo**, ` +
    `e diga se a causa é a forma nova ou outra coisa — essa distinção decide se vale continuar ` +
    `nesta linha.`,
  { label: 'atacar', phase: 'Atacar', schema: ATAQUE_SCHEMA, effort: 'high' },
)

log(
  `cegos: ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length} ` +
    `(completos ${ataque?.cegosCompletos ?? '?'}) · soterrados: ${ataque?.soterrados ?? '?'} (era 11) · ` +
    `invariante: ${ataque?.invarianteVale ?? '?'} · fisgada: ${ataque?.fisgadaCompleta ?? '?'}`,
)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 2E — SEÇÕES POR GAVETA\n\n` +
    `**Construtor:** ${obra ?? '(sem relato)'}\n\n` +
    `**Ataque:** cegos ${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? '?'} ` +
    `(completos ${ataque?.cegosCompletos ?? '?'}), soterrados ${ataque?.soterrados ?? '?'} (era 11), ` +
    `invariante=${ataque?.invarianteVale ?? '?'}, fisgada completa=${ataque?.fisgadaCompleta ?? '?'} ` +
    `(paráfrase ${ataque?.fisgadaParafrase ?? '?'}/5), posição mediana ${ataque?.posicaoMediana ?? '?'} (era 8), ` +
    `públicos ${ataque?.publicosPassaram ?? '?'}/${ataque?.publicosTotal ?? '?'}, decorou=${ataque?.decorou ?? '?'}\n` +
    `${ataque?.veredito ?? ''}\n` +
    (ataque?.furos ?? []).map((f) => `- furo: ${f}`).join('\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\`, \`npm run check:gate\` verdes.**\n\n` +
    `2. **Grave os 12 cegos em \`research/kb/CANARIOS.json\`** como E01–E12, **com o resultado ` +
    `medido, inclusive os que falham.** Confira que ficaram lá — na onda passada o ataque ` +
    `registrou que os D## não tinham sido absorvidos. Eles são:\n\n` +
    `\`\`\`json\n${JSON.stringify(listaCega, null, 1).slice(0, 7000)}\n\`\`\`\n\n` +
    `3. **O veredito no topo do \`RECUPERACAO.md\`**, com o número cego, o de soterramento e se a ` +
    `invariante vale. Sem adjetivo.\n\n` +
    `4. **Atualize \`ESTADO.md\` e o \`RUNBOOK.md\` §8.** Não resolvidas continuam na lista — ` +
    `incluindo a dívida de mutação que sobrou (68/74 no ataque \`troca\`, com \`agacho\`, ` +
    `\`aprendizado-motor\`, \`barra-alta\`, \`convencional\`, \`core\` e \`intensidade\` ` +
    `descobertas; a cobertura de 74/74 do ataque \`lixo\` é uma regra contada duas vezes) e as 3 ` +
    `mutações sobreviventes do ledger esparso.\n\n` +
    `5. **A DECISÃO, e é o item mais importante deste fechamento.** Cinco ondas de conserto de ` +
    `recuperação. Escreva em \`research/kb/RECUPERACAO.md\`, com os números na frente e sem ` +
    `diplomacia, **qual das três é a verdade agora**:\n\n` +
    `   (a) a forma nova resolveu e o que falta é acabamento;\n` +
    `   (b) a forma nova ajudou e sobrou um defeito NOMEADO, com o próximo passo definido;\n` +
    `   (c) o problema não está na apresentação, e insistir nesta linha é jogar dinheiro fora — ` +
    `nesse caso **diga o que você faria em vez disso**, sabendo que ingerir mais corpus está ` +
    `descartado por medição e que a base tem a resposta (\`--topic\` sozinho acerta a maioria).\n\n` +
    `   O atleta vai decidir com base nisso. Um (b) confortável escrito onde a verdade é (c) é a ` +
    `pior coisa que este arquivo pode conter.\n\n` +
    `6. **\`research/kb/ONDA-2C.md\` e \`research/RETOMAR.md\`**: atualize para o estado de agora. ` +
    `E responda, com o número na frente, a pergunta que o atleta fez e que ainda está aberta: ` +
    `**vale pagar uma frota de modelo barato para dar a cada uma das 6.912 claims uma linha de ` +
    `"que pergunta esta claim responde"?**\n\n` +
    `**Não proponha ingerir mais corpus.** Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  cegos: `${ataque?.cegosPassaram ?? '?'}/${ataque?.cegosTotal ?? listaCega.length}`,
  cegosCompletos: ataque?.cegosCompletos,
  soterrados: ataque?.soterrados,
  invarianteVale: ataque?.invarianteVale,
  fisgadaCompleta: ataque?.fisgadaCompleta,
  fisgadaParafrase: ataque?.fisgadaParafrase,
  posicaoMediana: ataque?.posicaoMediana,
  decorou: ataque?.decorou,
  furos: ataque?.furos ?? [],
  veredito: ataque?.veredito,
  fecho,
}
