export const meta = {
  name: 'lista-a-onda-1',
  description: 'Fecha a janela do gate na virada de semana, cria o campo genero por vídeo, e escreve a regra de fronteira narrativa/anedota/fato',
  phases: [
    { title: 'Construir', detail: 'gate cross-week, genero por vídeo, regra de fronteira' },
    { title: 'Atacar', detail: 'cada entrega é quebrada por quem não a construiu' },
    { title: 'Fechar', detail: 'build verde e o que ficou aberto' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. NÃO use git — quem commita é o orquestrador. Português do Brasil em documento,
comentário e mensagem. Nada de emoji em código.

**UMA MEDIÇÃO DA BASE ESTÁ RODANDO AGORA, EM PARALELO, EM CIMA DESTE REPOSITÓRIO.**
Ela lê \`research/extract/*.jsonl\`. Você **NÃO PODE editar nenhuma claim** — nem \`modo\`,
nem \`conditions\`, nem nada dentro de \`research/extract/\`. Medir alvo móvel foi o erro que
esta rodada existe para não repetir. Se o seu trabalho exigir tocar em claim, **especifique a
mudança e deixe para a onda 2**, que roda depois. Manifesto, documentos, ferramentas, testes e
código do app estão liberados.

O PROJETO. Base de conhecimento para um powerlifter NATURAL de 87 kg, 28 anos, classe 93 kg
da IPF, mirando recorde, nunca competiu, **com histórico de lesão de peitoral**. O bloco de
treino atual foi desenhado em torno de um protocolo de reexposição gradual do supino. A base
alimenta uma conversa semanal e um app que já roda.

A BASE: 6.909 claims em \`research/extract/*.jsonl\`, um arquivo por vídeo. 4.947 do Matt Vena
(R###, não compete testado), 1.819 do Garrett Blevins (G###, compete testado na IPF), 143 do
regulamento IPF 2026 (F001, tier O). Campos: tier, scope (GERAL/PESSOAL), certainty, modo
(prescricao/opiniao/mecanismo/fato/estudo/anedota/narrativa/relato-de-programa/
avaliacao-de-terceiro), conditions, conflicts, topic[] fechado, claim pt-BR, verbatim literal
em inglês, params[] com unit e frame.

LEIA ANTES DE COMEÇAR: \`research/kb/ESTADO.md\` (o estado de hoje, com o que é provado por
compilador e o que é julgamento), \`research/RUNBOOK.md\` (§8 tem as divergências abertas),
\`research/kb/SCHEMA.md\` e \`research/kb/ENUMERADOS.md\`.

O PRINCÍPIO DA CASA: **onde um compilador pode verificar, agente não deve.** E o limite dele,
declarado: determinismo prova FIDELIDADE À FONTE, não CORREÇÃO DA FONTE.

MODOS DE FALHA QUE JÁ ACONTECERAM AQUI:
1. Agente copiou convenção errada do arquivo vizinho e justificou como "padrão existente".
2. Trava estreita empurrou o dado para FORA da trava (faltando frame para gramas, um lote
   gravou gramas como \`kg\`). Faltar gaveta é pior que ter gaveta demais.
3. Documento e código divergiram em silêncio por meses.
4. Uma trava que se testava a si mesma passava verde quando o alvo era apagado.

FERRAMENTAS: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`,
\`node research/tools/check-evidence.mjs --grep "x" --topic y --modo z --limit 0\`.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Construir')

const entregas = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: A JANELA DO GATE DE DOR TRUNCA NA VIRADA DE SEMANA\n\n` +
        `É SEGURANÇA, e é o que sobrou aberto do conserto de ontem.\n\n` +
        `\`src/data/program/vena-block1/source/PROGRAMA.md\` §1.2 manda: **2 eventos ≥2/10 em 3 ` +
        `SESSÕES de supino** → recua um degrau do eixo que mudou mais recentemente e segura 2 ` +
        `semanas. Mas \`buildGateReadings\` só enxerga as sessões da semana corrente, e o ` +
        `\`WeekDoc\` não carrega leitura nenhuma para a semana seguinte.\n\n` +
        `Reproduzido ontem: um evento 2/10 na última sessão da S1 e outro na primeira da S2, com ` +
        `UMA sessão colhida entre eles — bem dentro da janela de 3 — produz \`congela\` nas duas ` +
        `semanas, e **o degrau de recuo NUNCA sai**. O controle, com o mesmo espaçamento dentro da ` +
        `mesma semana, sai. Com supino 4×/semana, cerca de 1 em cada 4 pares qualificados ` +
        `atravessa a fronteira.\n\n` +
        `### O que fazer\n\n` +
        `1. **Confirme o defeito você mesmo antes de consertar.** Escreva o cenário que o exibe e ` +
        `veja falhar. Conserto de bug que você não reproduziu é conserto de bug que talvez não ` +
        `exista, e o ataque desta rodada vai cobrar isso.\n` +
        `2. **Persista as leituras do gate no \`WeekDoc\`** e faça \`buildWeekDoc\` usar o \`prev\` ` +
        `que ele já recebe. Você tem autorização para: acrescentar campo novo ao documento, subir ` +
        `\`ROLLUP_SCHEMA_VERSION\`, e escrever o código que tolera o campo ausente em documento ` +
        `antigo. **Não tem autorização para:** apagar campo existente, migração destrutiva, ` +
        `mudar as regras de segurança do Firestore, ou qualquer coisa que exija habilitar ` +
        `cobrança. Documento velho sem o campo tem de continuar carregando e degradar para o ` +
        `comportamento de hoje, não quebrar.\n` +
        `3. **A janela é de SESSÕES DE SUPINO, não de dias nem de semanas.** Uma semana de deload ` +
        `sem supino não deve consumir a janela. Diga como você resolveu isso e por quê.\n` +
        `4. **A linha \`RETORNO\` é parseada e nenhum código a consome** — \`grep -rn retorno src/\` ` +
        `mostra isso. Ela diz: re-sobe um degrau só após 2 semanas consecutivas com pico ≤1/10 em ` +
        `todas as sessões de supino. Com histórico entre semanas, ela passa a ser implementável. ` +
        `**Implemente**, e faça a trava cobrir a célula — hoje trocar "2 semanas" por "9 semanas" ` +
        `no PROGRAMA.md passa verde e o app não muda.\n` +
        `5. **Teste que prova, nos dois sentidos.** O cenário cross-week tem de produzir o recuo. ` +
        `E quebrar a tabela do PROGRAMA.md de propósito tem de reprovar o build. Sem o segundo, a ` +
        `trava pode estar morta.\n\n` +
        `\`npm run build\` e \`npm run check:gate\` verdes no fim. Atualize ` +
        `\`research/kb/GATE-DOR.md\` com o que mudou, a decisão de migração, e o que continua ` +
        `aberto.`,
      { label: 'gate-cross-week', phase: 'Construir', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: \`genero\` POR VÍDEO — TRANSFORMAR JULGAMENTO EM COMPILADOR\n\n` +
        `O \`ESTADO.md\` §4 chama isto de o maior retorno por linha de código de tudo que resta, e ` +
        `concordo.\n\n` +
        `### O problema\n\n` +
        `562 claims estão hoje em \`modo: relato-de-programa\` (447) e \`avaliacao-de-terceiro\` ` +
        `(115). Essas gavetas existem porque metade do corpus do Blevins é ele **expondo o programa ` +
        `dos outros** (5/3/1, nSuns, PHUL, GZCLP, Cube, Texas Method, Greyskull, Madcow, Ph3, ` +
        `Genesis) ou **corrigindo um desconhecido** a partir de um vídeo enviado (a série *Form ` +
        `Assessment Saturday*). Antes, tudo isso virava \`GERAL\` + \`prescricao\`: *"o nSuns manda ` +
        `AMRAP a 95 % do training max"* com a mesma autoridade de *"faça AMRAP a 95 % do training ` +
        `max"*.\n\n` +
        `Mas a classificação dependeu de **cada agente lembrar de abrir o manifesto do canal**, e ` +
        `18 agentes traçaram 18 linhas. **As 562 claims não são reproduzíveis.**\n\n` +
        `### O que fazer\n\n` +
        `1. **Acrescente \`genero\` por vídeo no manifesto**, em \`research/corpus/*/manifest.json\`. ` +
        `Você decide o enumerado; \`review-de-programa | form-check | vlog\` foi a sugestão do ` +
        `\`ESTADO.md\`, mas ela é do canal do Blevins — **julgue se serve para o Vena e para o ` +
        `regulamento também**, e se falta gênero. Enumerado curto demais empurra o dado para fora ` +
        `da trava, que é o modo de falha nº 2 desta casa.\n` +
        `2. **Semeie sem reabrir vídeo.** \`research/corpus/blevins/TRIAGEM.md\` tem título, data e ` +
        `o porquê de cada uma das 354 refs, lido um a um por um agente. Ele já separa review de ` +
        `terceiro, form check, log de sessão e filmagem de meet. Use isso. Para o Vena, o título no ` +
        `manifesto é o sinal disponível — e onde o título não decidir, **marque como indeterminado ` +
        `em vez de chutar**. Gênero errado vira trava errada, que é pior que trava ausente.\n` +
        `3. **Ligue ao compilador.** Com \`genero\` no manifesto, \`check-claims.mjs\` pode recusar ` +
        `\`modo: prescricao\` numa claim cujo vídeo é \`review-de-programa\` ou \`form-check\`. ` +
        `**Cuidado com a ordem:** você NÃO pode editar claims nesta onda, então uma regra que ` +
        `reprove hoje quebraria o build. Implemente a regra e deixe-a **medindo, não reprovando** — ` +
        `uma catraca com o teto no número de violações de hoje, como \`TETO_SEM_MODO\` fez, para a ` +
        `onda 2 baixar até zero. Relate quantas violações existem e em que arquivos: essa lista **é ` +
        `o produto**, porque ela nomeia exatamente o que a onda 2 tem de repassar.\n` +
        `4. **"O que revisar" vira consulta.** Faça \`check-evidence.mjs\` aceitar filtro por ` +
        `gênero, ou entregue um script que responda "que claims de vídeo de review estão marcadas ` +
        `como prescrição". Sem isso o campo é decorativo.\n` +
        `5. Documente em \`research/kb/SCHEMA.md\` e \`research/kb/PROTOCOLO-EXTRACAO.md\` — ` +
        `documento e trava são um objeto só nesta casa — e escreva ` +
        `\`research/kb/GENERO.md\` com o enumerado, o critério de cada valor, como o campo foi ` +
        `semeado, e o que ficou indeterminado.\n\n` +
        `\`npm run check:kb\` verde no fim.`,
      { label: 'genero', phase: 'Construir', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: ESCREVER A FRONTEIRA \`narrativa\` × \`anedota\` × \`fato\`\n\n` +
        `**Você escreve a regra. Você NÃO retagueia nada** — a medição está rodando e o retag é da ` +
        `onda 2. Sua entrega é a regra e a lista do que ela muda.\n\n` +
        `### O problema\n\n` +
        `**17 dos 18 lotes que preencheram \`modo\` declararam ter inventado esta fronteira ` +
        `sozinhos.** Enquanto ela não estiver escrita, qualquer consulta que dependa desses valores ` +
        `lê três convenções misturadas — e o \`ESTADO.md\` §2 nomeia o valor de \`modo\` em 6.766 ` +
        `claims como a maior superfície não verificada da base.\n\n` +
        `Os quatro casos que colidem:\n` +
        `- **\`narrativa\`** — o que aconteceu no treino, sem tese\n` +
        `- **\`anedota\`** — história dele ou de terceiro\n` +
        `- **\`fato\`** — afirmação sobre o mundo, verificável fora dele\n` +
        `- **prática habitual** — "eu agacho duas vezes por semana". Hoje isso é \`scope: PESSOAL\` ` +
        `com \`modo\` ambíguo, e é a categoria que MAIS importa para este atleta, porque é o que ele ` +
        `tende a copiar de um homem de 120 kg que não compete testado.\n\n` +
        `### Como decidir\n\n` +
        `1. **Vá aos dados antes de teorizar.** O \`ESTADO.md\` aponta R034, R043, R106, R185 e ` +
        `R151 como material denso. Amostre com \`check-evidence.mjs --modo narrativa\`, ` +
        `\`--modo anedota\`, \`--modo fato\`, e veja **como cada lote de fato decidiu**. A regra tem ` +
        `de nascer do que está lá, não de uma taxonomia bonita que obrigue a reescrever tudo.\n` +
        `2. **Decida se abre \`pratica-pessoal\`.** É a pergunta central. A favor: separa o que ele ` +
        `FAZ do que ele CONTA, e é a distinção que protege um natural de copiar um outlier. Contra: ` +
        `mais uma gaveta é mais uma fronteira para 18 agentes traçarem de 18 jeitos. **Decida e ` +
        `justifique** — e se decidir abrir, diga quantas claims mudam e quais.\n` +
        `3. **Escreva o teste de decisão, não a definição.** Definição de dicionário não resolve ` +
        `caso de fronteira; o que resolve é uma pergunta que separa. O \`PROTOCOLO-EXTRACAO.md\` já ` +
        `faz isso bem noutros pontos ("se você não aponta os segundos, não é claim") — siga esse ` +
        `padrão. Inclua **casos de fronteira reais do corpus, com id**, resolvidos e explicados. É ` +
        `o que um agente vai copiar.\n` +
        `4. **Diga o que a regra muda.** Amostre e estime: quantas claims estão hoje do lado errado ` +
        `da fronteira que você acabou de traçar? Se for perto de zero, a fronteira ratifica a ` +
        `prática e é barata. Se for grande, diga o tamanho — a onda 2 precisa saber se é um repasse ` +
        `dirigido ou um fan-out.\n` +
        `5. **Considere honestamente não mudar nada.** Se a análise mostrar que a distinção não ` +
        `muda consulta nenhuma que este atleta vá fazer, a resposta certa é fundir gavetas em vez de ` +
        `refinar a fronteira, e dizer isso. Vocabulário que cresce por acúmulo perde o poder de ` +
        `recuperar.\n\n` +
        `Escreva a regra em \`research/kb/PROTOCOLO-EXTRACAO.md\` (e o que for de esquema no ` +
        `\`SCHEMA.md\`), e o raciocínio + a lista do que muda em ` +
        `\`research/kb/FRONTEIRA-MODO.md\`. \`npm run check:kb\` verde.`,
      { label: 'fronteira-modo', phase: 'Construir', effort: 'high' },
    ),
])

log(`construção: ${entregas.filter(Boolean).length}/3 entregues`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Atacar')

const VEREDITO = {
  type: 'object',
  required: ['aprovado', 'furos', 'resumo'],
  properties: {
    aprovado: { type: 'boolean' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito, com o comando exato que o reproduz' },
    consertados: { type: 'array', items: { type: 'string' } },
    resumo: { type: 'string' },
  },
}

const ATACAR = (nome, relato, como) =>
  agent(
    `${CTX}\n\n## VOCÊ ATACA O QUE OUTRO AGENTE ACABOU DE ENTREGAR: ${nome}\n\n` +
      `Relato de quem construiu:\n\n${relato}\n\n` +
      `NÃO acredite no relato. Quem constrói é a pior pessoa para dizer se funciona — testa os ` +
      `casos que imaginou, e o defeito mora nos que não imaginou. Ontem, três travas foram ` +
      `entregues como prontas e as três tinham furo grave; uma delas **se testava a si mesma** e ` +
      `passava verde quando o alvo era apagado.\n\n${como}\n\n` +
      `MÉTODO: quebre de propósito. Para cada coisa que a entrega promete, construa o caso que a ` +
      `exibe e rode. Se passar quando devia falhar, é furo — reporte com o comando que reproduz. ` +
      `Conserte o que for seguro consertar; especifique o que for grande.\n\n` +
      `Julgue também o INVERSO: recusa coisa legítima? Falso positivo manda gente reescrever o que ` +
      `estava certo, e o dano real é ensinar a ignorar o aviso.\n\n` +
      `**Lembre da restrição:** a medição está rodando, então **nem você nem ele podem editar ` +
      `claims**. Se a entrega editou algo em \`research/extract/\`, isso é violação e tem de ` +
      `aparecer no seu relatório com o id.\n\n` +
      `\`aprovado: true\` só se você TENTOU quebrar e não conseguiu.`,
    { label: `atacar:${nome}`, phase: 'Atacar', schema: VEREDITO, effort: 'high' },
  )

const ataques = await parallel([
  () =>
    ATACAR(
      'gate-cross-week',
      entregas[0] ?? '(sem relato)',
      `Em jogo: o atleta tem histórico de lesão de peitoral e o bloco é um protocolo de ` +
        `reexposição do supino.\n\n` +
        `Ataque: o cenário cross-week produz mesmo o recuo? E o de três sessões separadas por uma ` +
        `semana de deload SEM supino — a janela foi consumida indevidamente? Documento antigo, sem ` +
        `o campo novo, ainda carrega e degrada sem quebrar? O bump de schema quebra algum consumidor ` +
        `que você ache no código? A célula RETORNO agora prende: troque "2 semanas consecutivas com ` +
        `pico ≤1/10" por outra coisa no PROGRAMA.md, rode \`npm run build:vena\` e ` +
        `\`npm run check:gate\`, e exija reprovação. Rode \`npm run build\`.`,
    ),
  () =>
    ATACAR(
      'genero',
      entregas[1] ?? '(sem relato)',
      `Em jogo: 562 claims cuja classificação hoje não é reproduzível.\n\n` +
        `Ataque a SEMEADURA, que é onde mora o erro: pegue uma amostra de refs e confira o gênero ` +
        `atribuído contra o título e a transcrição de verdade. Quantos estão errados? Vídeo que é ` +
        `metade review e metade opinião própria caiu onde? Ataque a TRAVA: mude o gênero de um vídeo ` +
        `para \`review-de-programa\` e exija que a catraca acuse; confirme que o teto não está ` +
        `frouxo a ponto de não acusar nada — \`TETO_SEM_MODO\` já esteve em 4947 quando o real era ` +
        `278, e por isso um lote inteiro sumido passou despercebido. Ataque a LISTA de violações: ` +
        `ela é a entrega para a onda 2, então confira uma amostra dela à mão. E confirme que ` +
        `manifesto, SCHEMA.md e check-claims.mjs dizem a mesma coisa.`,
    ),
  () =>
    ATACAR(
      'fronteira-modo',
      entregas[2] ?? '(sem relato)',
      `Em jogo: o valor de \`modo\` em 6.766 claims é a maior superfície não verificada da base.\n\n` +
        `Ataque pela APLICABILIDADE, que é o único teste que importa numa regra: pegue 40 claims ` +
        `reais dos valores em disputa, **sem ver a resposta dele**, aplique a regra escrita e veja ` +
        `se ela decide. Regra que precisa de bom senso em 30 % dos casos não é regra — é a mesma ` +
        `ambiguidade com mais páginas. Meça a taxa de indecisão e reporte-a como número.\n\n` +
        `Ataque a DECISÃO sobre \`pratica-pessoal\`: se ele abriu, a gaveta nova tem fronteira ` +
        `nítida com \`narrativa\` e \`anedota\`, ou criou duas ambiguidades onde havia uma? Se não ` +
        `abriu, "eu agacho 2x por semana" fica recuperável para um atleta que precisa distinguir o ` +
        `que o Vena FAZ do que ele MANDA?\n\n` +
        `E ataque o custo: a estimativa do que muda bate? Confira a amostra dele com a sua.`,
    ),
])

const furos = ataques.filter(Boolean).flatMap((a) => a.furos ?? [])
const reprovadas = ataques.filter(Boolean).filter((a) => !a.aprovado).length
log(`ataques: ${reprovadas} reprovada(s), ${furos.length} furo(s)`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 1\n\n` +
    `### Entregas\n` +
    `**Gate cross-week:** ${entregas[0] ?? '(sem relato)'}\n\n` +
    `**Gênero por vídeo:** ${entregas[1] ?? '(sem relato)'}\n\n` +
    `**Fronteira de modo:** ${entregas[2] ?? '(sem relato)'}\n\n` +
    `### Ataques\n` +
    ataques.filter(Boolean).map((a) => `- ${a.aprovado ? 'APROVADA' : 'REPROVADA'}: ${a.resumo}\n${(a.furos ?? []).map((f) => `    furo: ${f}`).join('\n')}\n${(a.consertados ?? []).map((c) => `    consertado: ${c}`).join('\n')}`).join('\n\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\` e \`npm run check:gate\` verdes.** Conserte o que ` +
    `estiver quebrado. Nada sai daqui vermelho.\n\n` +
    `2. **Confirme que nenhuma claim foi editada.** A medição está rodando em cima de ` +
    `\`research/extract/\`. Verifique mecanicamente (\`git status\`, \`git diff --stat\`) e, se ` +
    `alguém encostou, **reverta só esses arquivos** e diga quais. Isto é mais importante que ` +
    `qualquer entrega desta onda: uma claim editada agora contamina uma medição de 90 minutos.\n\n` +
    `3. **Consolide o backlog da onda 2** em \`research/kb/ONDA-2.md\`, que é a entrega mais útil ` +
    `deste fechamento. Ela vai ser executada por um fan-out, então precisa ser **lista de trabalho, ` +
    `não prosa**: os arquivos e ids que violam a regra de gênero, as claims que a fronteira de ` +
    `\`modo\` reclassifica, os 19 params em gaveta errada com a lista pronta que já existe no ` +
    `\`ESTADO.md\` §3, os 53 \`suspect\` para o passe de Whisper, e as claims \`tier U\` do atleta ` +
    `que ainda não existem. Para cada item: **quantos, onde, e como se verifica que ficou certo**.\n\n` +
    `4. **Atualize \`research/RUNBOOK.md\` §8** — a lista de divergências documento-versus-código. ` +
    `As resolvidas saem, as novas entram, **as não resolvidas continuam lá**. Divergência que some ` +
    `sem ser resolvida é como este projeto perdeu coisa antes.\n\n` +
    `5. **Atualize \`research/kb/ESTADO.md\`**: o que saiu da coluna "julgamento de agente" para a ` +
    `coluna "provado por compilador", e o que continua onde estava. Essa tabela é o produto ` +
    `principal daquele documento.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return { reprovadas, furos, fecho }
