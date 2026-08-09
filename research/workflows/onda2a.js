export const meta = {
  name: 'onda-2a-recuperacao',
  description: 'Conserta a recuperação (o modo de falha medido), o cluster de dor do peitoral, e as 76 violações de gênero',
  phases: [
    { title: 'Consertar', detail: 'ferramenta de busca, cluster do peitoral, violações de gênero, params' },
    { title: 'Atacar', detail: 'as sete falhas medidas são refeitas às cegas por quem não construiu o conserto' },
    { title: 'Fechar', detail: 'build verde, backlog da onda 2B' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. NÃO use git — quem commita é o orquestrador. Português do Brasil em documento,
comentário e mensagem. Nada de emoji em código.

O ATLETA. Natural, 87 kg, 28 anos, classe 93 kg da IPF, nunca competiu, mirando recorde,
**com histórico de lesão de peitoral** — o bloco atual é um protocolo de reexposição gradual
do supino. Treina 5 dias/semana. Marcas de treino: agacho 250, supino 170, terra sumo 268.

A BASE: 6.909 claims em \`research/extract/*.jsonl\`, um arquivo por vídeo. 4.947 do Matt Vena
(R###, não compete testado, ~120 kg), 1.819 do Garrett Blevins (G###, compete testado na
IPF), 143 do regulamento IPF 2026 (F001, tier O). Campos: tier, scope (GERAL/PESSOAL),
certainty, modo, conditions, conflicts, topic[] fechado, claim pt-BR, verbatim literal em
inglês, params[] com unit e frame. O vídeo tem \`genero\` no manifesto.

LEIA ANTES: \`research/kb/MEDICAO-02.md\` (a medição de ontem, e o motivo desta onda),
\`research/kb/ESTADO.md\`, \`research/kb/SCHEMA.md\`, \`research/kb/GENERO.md\`,
\`research/RUNBOOK.md\`.

FERRAMENTAS: \`npm run check:kb\`, \`npm run build\`, \`npm run check:gate\`,
\`node research/tools/check-evidence.mjs <ids> | --grep | --topic | --modo | --scope | --tier
| --genero | --limit 0\`, \`node research/tools/check-answer.mjs\`,
\`node research/tools/check-canarios.mjs\`.

O PRINCÍPIO DA CASA: **onde um compilador pode verificar, agente não deve.** Limite declarado:
determinismo prova FIDELIDADE À FONTE, não CORREÇÃO DA FONTE.

MODOS DE FALHA JÁ VISTOS AQUI, e todos reincidiram pelo menos uma vez:
1. Agente copia convenção errada do vizinho e chama de "padrão existente".
2. Trava estreita empurra o dado para FORA da trava.
3. Documento e código divergem em silêncio.
4. **Trava que se testa a si mesma** — compara um valor derivado contra o mesmo valor
   derivado, e passa verde quando o alvo é apagado. Aconteceu três vezes ontem.
5. **Relatório de agente que diz sucesso sem sucesso** — \`seed-genero.mjs\` dizia ter
   gravado 354 gêneros e gravava zero.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Consertar')

const consertos = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: A BASE ESCONDE O QUE TEM — E ESSE É O MODO DE FALHA MEDIDO\n\n` +
        `A medição de ontem (\`research/kb/MEDICAO-02.md\`) é a primeira confiável desta base: os ` +
        `15 canários passaram, 475 ids citados resolveram, zero fabricação. Placar 22 bem / 5 ` +
        `parcial / 2 mal — e **reprovada**, porque duas catastróficas ficaram abaixo da barra.\n\n` +
        `**As 7 respostas ruins têm a mesma raiz: declararam AUSENTE o que a base tem, com id e ` +
        `param na mão.**\n\n` +
        `- **Q05** buscou \`six times\` (4 resultados) e nunca \`six days a week\` (6). Perdeu ` +
        `V170-34 e V175-53 — supino de alta frequência, no atleta com histórico de peitoral.\n` +
        `- **Q19** parou doze ids antes, **no mesmo vídeo que já estava citando** (V010-13).\n` +
        `- **Q16** nunca tentou \`training cycle\`, que tem 86 claims. Perdeu V070-20, V125-07, ` +
        `V108-08.\n` +
        `- **Q11** se escondeu atrás do próprio filtro de segurança: \`--modo prescricao --scope ` +
        `GERAL\` sumiu com V033-03/04/05.\n` +
        `- **Q14** e **Q29** idem.\n\n` +
        `**Uma base que esconde é mais perigosa que uma base vazia, porque a recusa dela é ` +
        `convincente.**\n\n` +
        `### O conserto tem de estar na FERRAMENTA, não no esforço do agente\n\n` +
        `O relatório propôs "protocolo de busca em dois passes". Sozinho, isso é instruir o agente ` +
        `a se esforçar mais — e é a receita que já falhou aqui. Uma busca que só casa substring ` +
        `literal vai continuar errando \`six days a week\` quando se digitou \`six times\`.\n\n` +
        `Trabalhe nesta ordem de preferência:\n\n` +
        `**1. A ferramenta.** \`check-evidence.mjs --grep\` é regex literal sobre \`claim\` e ` +
        `\`verbatim\`. Você tem liberdade para desenhar o conserto, mas ele precisa atacar o caso ` +
        `medido. Algumas direções, e você julga quais prestam: casar em qualquer campo (hoje ignora ` +
        `\`params.name\`, que é onde \`frequencia_supino\` mora); busca por raiz/stem para \`six ` +
        `times\` e \`six days\` caírem juntos; um modo que, ao devolver POUCO, mostre os termos ` +
        `vizinhos de alta frequência dentro do mesmo tópico — porque o problema é o agente não ` +
        `saber qual palavra o canal usa; e um aviso quando o filtro em si é o que estreitou (o ` +
        `caso Q11: 0 resultados com \`--modo prescricao\`, 3 sem ele).\n` +
        `**Resultado pobre e resultado vazio mandam consertos opostos e hoje se parecem.**\n\n` +
        `**2. O índice de vocabulário.** Sem banco vetorial — e não vamos ter: o consumidor é um ` +
        `modelo de janela grande lendo arquivos, a busca é grep, e isso é restrição dura e ` +
        `provavelmente vantagem. Nesse mundo o índice faz o trabalho que o embedding faria. Por ` +
        `tópico: os sinônimos, o inglês, a gíria de academia, e **o termo que o canal de fato usa** ` +
        `— escrito à mão, derivado do corpus, não inventado. Comece pelos tópicos que falharam.\n\n` +
        `**3. O protocolo**, por último e curto, porque agora ele tem ferramenta atrás.\n\n` +
        `### E a parte que mede: canários \`presente-escondido\`\n\n` +
        `As três famílias de \`research/kb/CANARIOS.json\` (presente / impossível / armadilha) não ` +
        `medem isto. Acrescente a quarta: **pergunta cuja resposta ESTÁ na base, sob vocabulário ` +
        `que o agente não vai adivinhar.** Derive-as dos casos reais acima — Q05, Q16, Q19, Q11 são ` +
        `quatro prontas, com os ids já conhecidos. Um canário \`presente-escondido\` que falha diz ` +
        `que a camada de recuperação está quebrada, e é a única coisa que vai avisar quando ela ` +
        `regredir.\n\n` +
        `Ligue ao \`check-canarios.mjs\` e ao \`npm run check:kb\`. **Prove o conserto contra os ` +
        `casos medidos**: depois dele, a busca que Q05 fez acha V170-34? Mostre o comando e a ` +
        `saída. Escreva \`research/kb/RECUPERACAO.md\`, e seja honesto sobre o que continua ` +
        `inacessível.`,
      { label: 'recuperacao', phase: 'Consertar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: O CLUSTER QUE MANDA CONTINUAR A SÉRIE COM DOR NO PEITORAL\n\n` +
        `O \`MEDICAO-02.md\` §6.1 chama isto de **o pior da base**, e concordo. Quatro claims ` +
        `\`tier R · GERAL · prescricao\`, **as quatro sem \`conditions\`**, que saem limpas de ` +
        `qualquer filtro que vire treino:\n\n` +
        `- **V001-06** — ~2/10 é a carga de trabalho aproximadamente certa\n` +
        `- **V079-34** — 2 a 3/10 é boa faixa para empurrar na reabilitação\n` +
        `- **V138-20** — reabilitar com dor leve dá reabilitação mais rápida\n` +
        `- **V079-32** — continuar se movendo mesmo através de dor leve\n\n` +
        `Servidas cruas a uma fisgada de 3/10 na terceira série de supino pausado, elas ` +
        `**contradizem o gate assinado**: \`src/data/program/vena-block1/source/PROGRAMA.md\` §1.2 ` +
        `manda **congelar em ≥2/10** e **encerrar a sessão em ≥4/10 ou estiramento agudo**. E há um ` +
        `agravante registrado no §6.1: o próprio §1.2 cita [R79] — a mesma fonte — como base do ` +
        `desvio consciente.\n\n` +
        `### O que fazer\n\n` +
        `1. **Abra as quatro e leia o verbatim inteiro, com contexto na transcrição.** A pergunta ` +
        `real é: ele está falando de reabilitação de lesão crônica sob supervisão, ou de dor aguda ` +
        `no meio de uma série? São coisas diferentes e a base achatou as duas. **Não conserte antes ` +
        `de saber qual é.**\n` +
        `2. **Varra atrás dos irmãos.** Quatro é o que a medição achou; ela olhou uma amostra. ` +
        `Procure toda claim que autorize treinar através de dor, com qualquer vocabulário — ` +
        `\`push through\`, \`work through\`, \`train around\`, \`pain is okay\`, \`discomfort\`. Se ` +
        `houver mais, entram no mesmo tratamento.\n` +
        `3. **Trate com \`conditions\` e com \`conflicts\`, não apagando.** A condição que falta ` +
        `existe no corpus? Ache e ligue. E registre a contradição com o regime do bloco — o ` +
        `\`PROGRAMA.md\` §1.2 é norma assinada para ESTE atleta, e a claim é conselho geral de um ` +
        `canal. Onde a norma e o conselho brigam, quem lê precisa ver as duas.\n` +
        `4. **Se não houver como ligar a condição na base**, diga isso e proponha o tratamento — ` +
        `mas não invente ressalva que ele não disse. Condição fabricada é pior que condição ` +
        `ausente, porque dá falsa sensação de completude.\n` +
        `5. **Verifique que o conserto aparece na consulta.** Depois de mexer, refaça a busca que ` +
        `um agente de conversa faria sobre "dor no supino" e mostre que agora ele vê a ressalva ` +
        `junto. Conserto que não muda a consulta não conserta nada.\n\n` +
        `Você é dono destes arquivos de claim; outro agente cuida das violações de gênero em ` +
        `\`G*.jsonl\` e não vai encostar nos seus. \`npm run check:kb\` verde. Escreva o que ` +
        `decidiu em \`research/kb/DOR-E-TREINO.md\`.`,
      { label: 'cluster-dor', phase: 'Consertar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: AS 76 VIOLAÇÕES DE GÊNERO, E OS 19 PARAMS EM GAVETA ERRADA\n\n` +
        `### As 76 violações\n\n` +
        `A lista já é consulta, não julgamento — foi o produto da onda 1:\n\n` +
        `    node research/tools/check-evidence.mjs --genero review-de-programa --modo prescricao --limit 0\n` +
        `    node research/tools/check-evidence.mjs --genero form-check --modo prescricao --limit 0\n\n` +
        `58 em \`review-de-programa\` e 18 em \`form-check\`, detalhadas em \`research/kb/GENERO.md\` ` +
        `§6. São claims em que **o imperativo de outra pessoa** — do Wendler, do Candito, do nSuns — ` +
        `ou uma correção dirigida a **um desconhecido num vídeo** está gravada como \`prescricao\`, ` +
        `que é o filtro que vira treino deste atleta.\n\n` +
        `Repasse uma a uma. O valor certo costuma ser \`relato-de-programa\` ou ` +
        `\`avaliacao-de-terceiro\`, mas **não presuma**: um vídeo de review pode conter prescrição ` +
        `legítima do próprio autor no meio ("eu não faria isso, eu faria assim"), e essa continua ` +
        `\`prescricao\`. Abra o verbatim. A catraca do \`check-claims.mjs\` está com o teto em 76 — ` +
        `**baixe-a para o número real que sobrar**, e se sobrar zero, para zero.\n\n` +
        `### Os 19 params em gaveta errada\n\n` +
        `A lista pronta está em \`research/kb/ESTADO.md\` §3. Inclui decidir duas gavetas que faltam ` +
        `(\`ano_calendario\` e um frame adimensional para índice/rótulo) e o que fazer com \`value\` ` +
        `em string.\n\n` +
        `**A regra que não pode ser violada:** faltar gaveta é pior que ter gaveta demais, e forçar ` +
        `número em gaveta errada é como gramas viraram \`kg\`. Se o número não couber em enumerado ` +
        `nenhum, **amplie o enumerado** (nos três lugares: \`kb.mjs\`, \`SCHEMA.md\`, ` +
        `\`PROTOCOLO-EXTRACAO.md\`) ou deixe o número por extenso e relate. Nunca force.\n\n` +
        `### Disciplina\n\n` +
        `Edite só \`modo\` nas violações de gênero e só \`params\` nos 19. Outro agente é dono do ` +
        `cluster de dor (V001-06, V079-32, V079-34, V138-20 e irmãos) — **não encoste**. Se achar ` +
        `outro erro, relate em vez de consertar.\n\n` +
        `\`node research/tools/check-claims.mjs --only R014\` no seu loop, e \`npm run check:kb\` ` +
        `verde no fim. Relate quantas mudaram, quantas ficaram, e por quê.`,
      { label: 'genero-e-params', phase: 'Consertar', effort: 'high' },
    ),
])

log(`consertos: ${consertos.filter(Boolean).length}/3`)

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

const ataques = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## VOCÊ REFAZ AS SETE FALHAS, ÀS CEGAS — É O ÚNICO TESTE QUE IMPORTA\n\n` +
        `Alguém acabou de consertar a camada de recuperação da base. Relato dele:\n\n` +
        `${consertos[0] ?? '(sem relato)'}\n\n` +
        `**Não acredite no relato, e não leia a lista de ids que ele diz ter destravado antes de ` +
        `tentar.** Quem conserta é a pior pessoa para dizer se consertou: ele testa contra os casos ` +
        `que tinha na mão, e sabendo a resposta.\n\n` +
        `As sete perguntas que falharam estão em \`research/kb/AVALIACAO.md\` e o diagnóstico de ` +
        `cada uma em \`research/kb/MEDICAO-02.md\`: **Q02, Q05, Q11, Q14, Q16, Q19, Q29**.\n\n` +
        `**Responda as sete do zero, usando só a base**, como um agente de conversa faria. Depois — ` +
        `e só depois — compare com o que o \`MEDICAO-02.md\` diz que estava escondido em cada uma. ` +
        `Você achou V170-34 e V175-53 na Q05? V010-13 na Q19? V070-20/V125-07/V108-08 na Q16? ` +
        `V033-03/04/05 na Q11?\n\n` +
        `**Reporte quantas das sete o conserto de fato destrava, e quantas continuam escondidas.** ` +
        `Se a ferramenta nova não achar, diga com o comando exato que você rodou — é isso que diz ` +
        `se o conserto foi real ou se foi um índice bonito que ninguém consegue usar.\n\n` +
        `Depois ataque os canários \`presente-escondido\` que ele criou: eles são difíceis de ` +
        `verdade, ou foram desenhados para passar? Um canário que o próprio autor calibrou para ` +
        `passar não mede nada — é o modo de falha nº 4 desta casa, a trava que se testa a si mesma. ` +
        `Escreva um canário \`presente-escondido\` NOVO, de um caso que ele não usou, e veja se ` +
        `passa.\n\n` +
        `E o inverso: a busca nova traz lixo demais? Precisão que cai vira agente perdido em 200 ` +
        `resultados irrelevantes, e o efeito prático é o mesmo de não achar.`,
      { label: 'atacar:recuperacao', phase: 'Atacar', schema: VEREDITO, effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## VOCÊ ATACA O CONSERTO DO CLUSTER DE DOR — É SEGURANÇA\n\n` +
        `Relato de quem consertou:\n\n${consertos[1] ?? '(sem relato)'}\n\n` +
        `Em jogo: o atleta tem histórico de lesão de peitoral e está num protocolo de reexposição ` +
        `do supino. O \`PROGRAMA.md\` §1.2 manda congelar em ≥2/10.\n\n` +
        `**O teste é comportamental, não documental.** Simule a consulta de verdade: "senti uma ` +
        `fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?". Rode as buscas ` +
        `que um agente de conversa rodaria. **A base ainda serve "2 a 3/10 é boa faixa para ` +
        `empurrar" sem a ressalva do lado?** Se sim, o conserto não pegou, por mais bonito que ` +
        `esteja o documento.\n\n` +
        `Ataque a COBERTURA: ele varreu atrás dos irmãos? Procure você mesmo, com vocabulário que ` +
        `ele não usou — \`push through\`, \`work through\`, \`train around\`, \`soreness\`, ` +
        `\`tweak\`, \`niggle\`, \`it's fine to\`. Quantas claims que autorizam treinar com dor ` +
        `continuam sem condição?\n\n` +
        `Ataque o EXCESSO, que aqui é caro de um jeito diferente: ele condicionou coisa que não ` +
        `precisava? Uma base que responde "depende" a tudo é tão inútil quanto uma que responde ` +
        `"vai lá" a tudo, e o atleta para de perguntar. E se ele registrou contradição onde não há ` +
        `— o conselho geral e a norma do bloco podem conviver quando falam de situações diferentes ` +
        `—, isso ensina a base a duvidar do que estava certo.\n\n` +
        `\`npm run check:kb\` e \`npm run check:gate\` verdes.`,
      { label: 'atacar:dor', phase: 'Atacar', schema: VEREDITO, effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## VOCÊ ATACA O REPASSE DE GÊNERO E DE PARAMS\n\n` +
        `Relato:\n\n${consertos[2] ?? '(sem relato)'}\n\n` +
        `Ataque por AMOSTRAGEM CEGA: pegue 30 das claims que ele reclassificou, abra o verbatim ` +
        `**sem ler a justificativa dele**, e julgue por conta própria. Meça a discordância. Depois ` +
        `pegue 15 que ele DEIXOU como \`prescricao\` num vídeo de review e julgue se ele tinha ` +
        `razão — o caso legítimo existe (o autor prescrevendo o próprio método no meio de um review ` +
        `alheio), e distinguir isso é o trabalho todo.\n\n` +
        `Ataque a CATRACA: ele baixou o teto? Ela acusa se alguém reintroduzir uma violação? ` +
        `Reintroduza uma de propósito e exija erro. E confira o modo de falha nº 4: a catraca ` +
        `compara contra a lista real ou contra algo derivado dela mesma?\n\n` +
        `Ataque os PARAMS: para cada um dos 19, o valor novo bate com o que o verbatim diz? ` +
        `Confira contra a transcrição, não contra a claim em português — a claim é leitura de ` +
        `agente, o verbatim é a evidência. E se ele ampliou o enumerado, os três lugares ` +
        `(\`kb.mjs\`, \`SCHEMA.md\`, \`PROTOCOLO-EXTRACAO.md\`) dizem a mesma coisa?\n\n` +
        `E verifique o que ninguém verifica: ele tocou em campo que não era dele? Compare ` +
        `mecanicamente contra o git (somente leitura). Alguém mexeu nas quatro claims do cluster de ` +
        `dor, que são de outro agente?`,
      { label: 'atacar:genero-params', phase: 'Atacar', schema: VEREDITO, effort: 'high' },
    ),
])

const furos = ataques.filter(Boolean).flatMap((a) => a.furos ?? [])
const reprovadas = ataques.filter(Boolean).filter((a) => !a.aprovado).length
log(`ataques: ${reprovadas} reprovado(s), ${furos.length} furo(s)`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n## FECHAR A ONDA 2A\n\n` +
    `### Consertos\n` +
    `**Recuperação:** ${consertos[0] ?? '(sem relato)'}\n\n` +
    `**Cluster de dor:** ${consertos[1] ?? '(sem relato)'}\n\n` +
    `**Gênero e params:** ${consertos[2] ?? '(sem relato)'}\n\n` +
    `### Ataques\n` +
    ataques.filter(Boolean).map((a) => `- ${a.aprovado ? 'APROVADO' : 'REPROVADO'}: ${a.resumo}\n${(a.furos ?? []).map((f) => `    furo: ${f}`).join('\n')}\n${(a.consertados ?? []).map((c) => `    consertado: ${c}`).join('\n')}`).join('\n\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **\`npm run build\`, \`npm run check:kb\` e \`npm run check:gate\` verdes.** Conserte o que ` +
    `estiver vermelho. Nada sai daqui quebrado.\n\n` +
    `2. **Responda a pergunta que paga esta onda:** das sete perguntas que falharam na medição, ` +
    `quantas o conserto de recuperação de fato destrava? O ataque respondeu isso às cegas — use o ` +
    `número dele, não o de quem consertou. Se for baixo, **diga que foi baixo**: a onda existiu ` +
    `para isso e um número honesto vale mais que um conserto celebrado.\n\n` +
    `3. **Atualize \`research/kb/ESTADO.md\`** — o que saiu de "julgamento de agente" para "provado ` +
    `por compilador", e o que continua onde estava — e o \`RUNBOOK.md\` §8, com as divergências ` +
    `resolvidas saindo e as **não resolvidas continuando na lista**.\n\n` +
    `4. **Escreva \`research/kb/ONDA-2B.md\`** como lista de trabalho executável por fan-out, não ` +
    `como prosa. O que sobrou, na ordem, cada item com quantos / onde / como se verifica que ficou ` +
    `certo:\n` +
    `   - **triagem de banalidade** (tarefa #34): marcar \`banal: true\` nas claims que não mudam ` +
    `decisão nenhuma. **O atleta pediu explicitamente**, reagindo a V014-03 ("ficar adequadamente ` +
    `hypado") ter o mesmo peso de V014-12 ("rotacionar sob a barra"). Optou por MARCAR, não apagar. ` +
    `**Exige calibração antes de escalar:** dois agentes independentes na mesma amostra de 150, e ` +
    `abaixo de ~85 % de concordância o campo é ruído e NÃO deve ser construído.\n` +
    `   - **fatos do atleta como tier U** (tarefa #28) — tier U = 0 hoje, e o \`MEDICAO-02.md\` §8 ` +
    `diz que a base "não conhece o atleta". O que ele já contou está espalhado por \`baseline.md\` ` +
    `e pelo histórico; a calibração de RPE fica de fora, porque depende de ele treinar e ele não ` +
    `vai treinar esta semana.\n` +
    `   - **Whisper nos 53 \`suspect\`** (tarefa #31)\n` +
    `   - **ledger de contradições e sínteses + INDEX** (tarefas #25, #26) — **por último**, porque ` +
    `reparo vem antes de síntese: erro de dado vira norma para o próximo agente.\n` +
    `   - o que os ataques desta onda deixaram em aberto\n\n` +
    `5. **Não proponha ingerir mais corpus.** O \`MEDICAO-02.md\` mediu que o gargalo não é ` +
    `conteúdo, e a previsão de que o Blevins consertaria as três piores foi falseada — as três eram ` +
    `claim do Vena que ninguém achou.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return { reprovadas, furos, fecho }
