export const meta = {
  name: 'blindar-e-preencher',
  description: 'Conserta o gate do peitoral, reconstrói o instrumento de medição, fecha as enumerações e preenche modo/conditions nas 6.909 claims',
  phases: [
    { title: 'Blindar', detail: 'gate de dor, instrumento de medição, enumerações, defeitos pontuais' },
    { title: 'Verificar travas', detail: 'cada trava é atacada por quem não a construiu' },
    { title: 'Preencher', detail: '18 lotes preenchem modo e conditions, compilador no loop' },
    { title: 'Auditar', detail: 'amostra do preenchimento re-julgada de forma adversarial' },
    { title: 'Fechar', detail: 'consolidar e registrar o que ficou aberto' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const CTX = `
REPO: ${REPO}. Trabalhe SEMPRE a partir daí. NÃO use git — quem commita é o orquestrador.
Português do Brasil em documento, comentário e mensagem. Nada de emoji em código.

O PROJETO. Base de conhecimento para um powerlifter NATURAL de 87 kg, 28 anos, ~15 % de
gordura, classe 93 kg da IPF, mirando recorde e nunca tendo competido. Marcas de treino:
agacho 250, supino 170, terra sumo 268. A base alimenta uma conversa semanal de planejamento
e um app de treino que já roda.

A BASE HOJE: 6.909 claims tipadas em \`research/extract/*.jsonl\`, um arquivo por vídeo.
4.947 do Matt Vena (refs R###, não compete testado), 1.819 do Garrett Blevins (refs G###,
compete testado na IPF), 143 do regulamento IPF 2026 (F001). Documentos em \`research/kb/\`:
SCHEMA.md (o registro), PROTOCOLO-EXTRACAO.md (como extrair, com o vocabulário FECHADO de
tópicos), BLEVINS-INGESTAO.md (o relatório da ingestão de hoje). \`research/RUNBOOK.md\`
mapeia o sistema inteiro.

O PRINCÍPIO QUE GOVERNA TUDO: **onde um compilador pode verificar, agente não deve.** Ele já
se pagou duas vezes — pegou um verbatim inexistente e um número sem unidade que revisão por
prosa tinha aprovado. E ele tem limite declarado: determinismo prova FIDELIDADE À FONTE, não
CORREÇÃO DA FONTE.

FERRAMENTAS:
  node research/tools/check-claims.mjs [--only R014] [--verbose]   # o compilador da base
  node research/tools/check-claims.test.mjs                        # o teste do compilador (19 casos)
  node research/tools/check-evidence.mjs V014-03 G020-11           # resolve ids
  node research/tools/check-evidence.mjs --grep "deload" --topic deload --scope GERAL --limit 60
  npm run check:kb                                                 # verify-manifest + teste + checker
  npm run build                                                    # tudo + tsc + vite

TRÊS COISAS QUE JÁ DERAM ERRADO NESTE PROJETO E VÃO DAR DE NOVO SE VOCÊ NÃO CUIDAR:
1. Agente abriu arquivo do vizinho, copiou convenção errada e justificou como "seguindo o
   padrão existente". O padrão é o SCHEMA.md. Vizinho que contradiz o schema está errado.
2. Trava estreita demais empurrou o dado para FORA da trava: faltando frame para gramas, um
   lote gravou gramas como \`kg\`. Faltar gaveta é pior que ter gaveta demais.
3. Documento e código divergiram em silêncio, e a divergência só apareceu meses depois. Se
   você mudar um enumerado, mude o documento e a trava no mesmo passe — eles são um objeto só.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Blindar')

const blindagem = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: O GATE DO PEITORAL NÃO CONSEGUE DISPARAR\n\n` +
        `É o achado mais grave do dia e é de SEGURANÇA. O atleta tem histórico de lesão de ` +
        `peitoral e o Bloco 1 inteiro foi desenhado em torno de um protocolo de reexposição ` +
        `gradual do supino.\n\n` +
        `\`src/data/program/vena-block1/source/PROGRAMA.md\` (por volta da linha 400) especifica a ` +
        `tabela do gate: **1 evento ≥2/10 congela o \`TM_supino\` e o degrau de exposição**; 2 ` +
        `eventos ≥2/10 em 3 sessões recuam um degrau; ≥4/10 ou estiramento agudo encerra a sessão. ` +
        `Leia a tabela inteira, com a nota de desvio consciente do \`design.md\` §4-B logo abaixo.\n\n` +
        `Mas no app:\n` +
        `- \`src/types/index.ts\`, \`PainRegion\`: **não existe peitoral**. Nem \`chest\`, nem \`pec\`. ` +
        `Uma fisgada no peito só cabe em \`other\`, misturada com qualquer outra dor.\n` +
        `- \`weeklyRollup.ts\` (~linha 404): a bandeira só sobe em \`p.occurrences >= 3 || ` +
        `p.maxIntensity >= 6\`.\n\n` +
        `Ou seja: o programa manda congelar a 2/10 e o app não percebe antes de 6/10, e nem sabe ` +
        `que foi o peitoral.\n\n` +
        `### O que fazer\n\n` +
        `1. **Investigue antes de mexer.** Ache TODO o caminho da dor: onde ela é digitada na UI, ` +
        `como é gravada, como chega ao rollup, onde os rótulos vivem, se há persistência no ` +
        `Firestore com esse enum, e se algum dado já gravado usa \`other\` para dor de peito. Não ` +
        `presuma que os três arquivos que eu citei são o caminho inteiro.\n` +
        `2. **Acrescente a região.** Decida entre \`chest\` único ou \`left_chest\`/\`right_chest\` ` +
        `e justifique — o padrão do enum é lateralizado para membros, e uma ruptura de peitoral é ` +
        `unilateral. Cuide dos rótulos em português e da ordem de exibição.\n` +
        `3. **Faça o limiar obedecer o programa.** O gate de 2/10 tem de disparar. Pense se o ` +
        `limiar deve ser por região (2/10 no peitoral, 6/10 no resto) ou global, e diga por quê.\n` +
        `4. **O CONSERTO DE VERDADE, e é isto que eu quero:** hoje o gate existe em dois lugares — ` +
        `prosa no \`PROGRAMA.md\` e um \`if\` no rollup — e eles divergiram sem ninguém notar. ` +
        `Faça deles **um objeto só**: o limiar declarado numa fonte única que o código consome, e ` +
        `uma checagem executável que falha quando a tabela do PROGRAMA.md e o comportamento do ` +
        `código discordarem. O repositório já tem esse padrão em \`npm run check:program\`, ` +
        `\`check:notes\` e \`validate:program\` — siga-o, e ligue a sua checagem ao \`npm run build\`.\n` +
        `5. **Teste que prova.** Um teste que monta um registro de dor de peito 2/10 e exige que a ` +
        `bandeira suba, e outro que quebra a tabela de propósito e exige que a checagem falhe. ` +
        `Sem o segundo, a checagem pode estar morta e ninguém sabe.\n\n` +
        `\`npm run build\` tem de passar no fim. Escreva o que você mudou e o que decidiu em ` +
        `\`research/kb/GATE-DOR.md\`, incluindo o que você NÃO consertou e por quê.`,
      { label: 'gate-peitoral', phase: 'Blindar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: RECONSTRUIR O INSTRUMENTO DE MEDIÇÃO\n\n` +
        `Hoje a base foi medida contra 29 perguntas por agentes que respondiam usando só a base, ` +
        `com um julgador independente conferindo. Misturei 4 perguntas-canário sem etiqueta. ` +
        `**Duas delas eram impossíveis** — pediam PMIDs (a base tem ZERO claims de tier L) e o ` +
        `peaking do Blevins (na hora, ZERO claims G). **As duas foram julgadas "responde-bem".**\n\n` +
        `O avaliador respondeu do próprio conhecimento e o julgador comprou. Logo o placar "3 ` +
        `falhas em 29" não é medida: é teto otimista. O número real é desconhecido e ≥3.\n\n` +
        `Sem os canários, o relatório teria dito "a base está saudável" e estaria errado. Com ` +
        `eles, sei que está quebrado mas não sei o quanto. **Seu trabalho é fazer o próximo ` +
        `relatório valer.**\n\n` +
        `### O que construir\n\n` +
        `**a) \`research/tools/check-answer.mjs\` — a trava que faltava.** A intuição é a mesma do ` +
        `\`check-claims.mjs\`: lá, número na claim sem \`param\` que o sustente é fabricação. Aqui, ` +
        `**número na RESPOSTA que não aparece em nenhuma claim citada é conhecimento vindo de ` +
        `fora**. Recebe a resposta e os ids citados, resolve os ids, e acusa cada número órfão.\n\n` +
        `Isso é PROVA, não estimativa, e pega o caso de maior valor: prescrição inventada com ` +
        `número. Não pega prosa errada sem número — declare esse limite no cabeçalho do arquivo em ` +
        `vez de deixar alguém supor que pega.\n\n` +
        `Cuide dos falsos positivos com o mesmo cuidado que o \`check-claims.mjs\` já teve: número ` +
        `por extenso, número que é parte de nome próprio (5/3/1, nSuns, Ph3), ano, número que veio ` +
        `do enunciado da pergunta e não da base. Falso positivo aqui manda alguém reescrever ` +
        `resposta certa, e o custo disso é ensinarem a ignorar o aviso.\n\n` +
        `**b) Canários viram dado, não improviso meu.** \`research/kb/CANARIOS.json\`: perguntas ` +
        `com resposta esperada e o PORQUÊ de ela ser conhecida. Duas famílias:\n` +
        `- **presente** — a resposta está comprovadamente na base, com os ids que a sustentam\n` +
        `- **impossível** — o tier ou a fonte está em zero, então qualquer resposta veio de fora\n` +
        `Quatro foram poucos e dois divergiram. Proponha um conjunto maior e mais variado, e ` +
        `derive os "impossível" de fatos que você CONFIRMOU contando a base agora — não de memória. ` +
        `Conte os tiers você mesmo. Inclua canário de ARMADILHA: pergunta que parece respondível e ` +
        `cuja resposta correta é declarar incerteza.\n\n` +
        `**c) \`research/tools/check-canarios.mjs\`** que recalcula, a qualquer momento, se cada ` +
        `canário "impossível" continua impossível. Um canário que silenciosamente vira respondível ` +
        `(porque a fonte foi ingerida) deixa de calibrar e ninguém percebe — foi o que quase ` +
        `aconteceu com o do Blevins, ingerido horas depois de eu escrevê-lo.\n\n` +
        `**d) Teste do seu próprio teste.** \`check-answer.test.mjs\` no molde do ` +
        `\`check-claims.test.mjs\`: para cada defeito que ele promete pegar, um caso que exige que ` +
        `ele pegue, conferindo também a mensagem. Um checker silenciosamente quebrado é pior que ` +
        `checker nenhum.\n\n` +
        `Ligue o que fizer sentido ao \`npm run check:kb\`. Escreva \`research/kb/INSTRUMENTO.md\`: ` +
        `o que agora é provável mecanicamente, o que continua dependendo de julgamento, e como ` +
        `alguém roda a medição de novo.`,
      { label: 'instrumento', phase: 'Blindar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: FECHAR AS ENUMERAÇÕES ANTES QUE ELAS SEJAM PREENCHIDAS\n\n` +
        `Logo depois de você, 18 agentes vão preencher \`modo\` e \`conditions\` em 6.909 claims. ` +
        `Se o vocabulário estiver curto, eles vão contornar — e contorno de trava é como gramas ` +
        `viraram \`kg\` na rodada passada. **Você decide o vocabulário. Eles não podem inventar.**\n\n` +
        `### O material\n\n` +
        `Os seis lotes de extração do Blevins relataram, de campo, o que não coube. Está em ` +
        `\`research/kb/BLEVINS-INGESTAO.md\` §6.5 e nos relatos. Um resumo do que pediram:\n\n` +
        `**Frames que faltaram:** moeda (preço de coaching, de ebook), temperatura (°F de garagem, ` +
        `de cozimento), escala subjetiva arbitrária ("foco 2 de 10"), unidade de stress index, ` +
        `percentual de um XRM que não é 1RM ("85 % do seu 5RM"), pés/altura, xícara/volume ` +
        `culinário, hora do relógio (≠ duração), rótulo/índice que não mede nada (tier 1/2/3, onda ` +
        `1/2/3, nome de programa com dígito), percentual de carga de referência que não é 1RM nem TM.\n\n` +
        `**Tópicos que faltaram:** stress-index/carga-de-treino (tema central de 5 vídeos), ` +
        `powerbuilding (é o objetivo declarado do atleta e não tem gaveta), amrap/proximidade-da-` +
        `falha, training-max, descanso-entre-series, plato/estagnacao, bfr, walkout, análise de ` +
        `programa de terceiro, app/software de coaching, preço/negócio, avaliação de forma de ` +
        `terceiro por vídeo.\n\n` +
        `**E um valor de \`modo\`, que CINCO dos seis lotes pediram independentemente:** algo como ` +
        `\`relato-de-programa\`. O Blevins passa vídeos inteiros descrevendo o programa DE OUTRA ` +
        `PESSOA (Wendler, Candito, Bromley) e analisando a série *Form Assessment Saturday*, em que ` +
        `orienta um desconhecido a partir de um vídeo. Hoje isso vira \`scope: GERAL\` + ` +
        `\`modo: prescricao\` — ou seja, a base não distingue "ele descreveu o 5/3/1 do Wendler" de ` +
        `"ele prescreve isso a você". Para um atleta montando treino a partir daqui, essa confusão ` +
        `é do mesmo tamanho da que separa GERAL de PESSOAL.\n\n` +
        `### Como decidir\n\n` +
        `**Não aceite tudo.** Vocabulário que cresce por acúmulo perde o poder de recuperar: se ` +
        `todo assunto vira tópico, o grep por tópico não estreita nada. Pergunte-se, para cada ` +
        `candidato: alguém vai PROCURAR por isso? A ausência dele força um erro, ou só um encaixe ` +
        `imperfeito? Recuse com justificativa escrita — a recusa é tão entregável quanto a ` +
        `aceitação.\n\n` +
        `Suspeite especialmente de preço, moeda e temperatura: são reais, e ao mesmo tempo é ` +
        `provável que o consumidor desta base nunca pergunte quanto custa o ebook do Bromley. ` +
        `Talvez a resposta certa seja que aquilo não deveria ter virado claim.\n\n` +
        `### O que entregar\n\n` +
        `1. Enumerados atualizados **nos três lugares ao mesmo tempo**: \`check-claims.mjs\` (a ` +
        `trava), \`SCHEMA.md\` e \`PROTOCOLO-EXTRACAO.md\` (o documento). Lembre que o checker LÊ o ` +
        `vocabulário de tópicos do markdown — documento e trava já são um objeto só ali, mantenha.\n` +
        `2. **\`modo\` passa a ser validado pelo compilador.** Hoje não é: a ingestão do Blevins ` +
        `achou uma claim com valor inválido de \`modo\` e o checker deixou passar. Enumerado ` +
        `fechado, recusa no build.\n` +
        `3. **Consertar o \`SCHEMA.md\`, que hoje documenta um esquema de id que a base não usa.** ` +
        `Ele diz \`V{ref}-{seq}\`. Isso era impossível para o corpus G: \`G007\` daria \`V007-01\`, ` +
        `que já existe vindo de \`R007\`. A base normalizou para \`G0XX-NN\` no corpus do Blevins e ` +
        `manteve \`V0XX-NN\` no do Vena. Documente a regra REAL, com o porquê da assimetria, e ` +
        `considere se o checker deve travá-la.\n` +
        `4. Um passe de reparo nas claims que hoje têm número por extenso ou frame emprestado por ` +
        `falta de gaveta, **só onde o novo enumerado resolve**. Não force nada.\n` +
        `5. \`research/kb/ENUMERADOS.md\`: o que entrou, o que foi recusado e por quê, e a regra de ` +
        `como o vocabulário cresce daqui pra frente.\n\n` +
        `\`npm run check:kb\` tem de passar no fim. Você é o dono de \`check-claims.mjs\` nesta ` +
        `fase — outro agente foi instruído a não tocar nele.`,
      { label: 'enumerados', phase: 'Blindar', effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: SEIS DEFEITOS PONTUAIS, CADA UM VERIFICÁVEL\n\n` +
        `NÃO toque em \`check-claims.mjs\`, \`SCHEMA.md\` nem \`PROTOCOLO-EXTRACAO.md\` — outro ` +
        `agente é dono deles nesta fase. Se um conserto seu exigir mexer lá, relate em vez de mexer.\n\n` +
        `**1. Proteína gravada como \`8 g/lb\`.** Ache a claim (\`check-evidence.mjs --grep protein\`). ` +
        `Ela carrega \`proteina_por_kg=1.6 g/kg\` e \`proteina_por_lb=8 g/lb\` no mesmo registro. ` +
        `1,6 g/kg são ~0,73 g/lb, não 8 — alguém está errado por 10×. Vá à transcrição, veja o que ` +
        `foi dito de fato, conserte o que estiver errado. Se o ASR for ambíguo, marque ` +
        `\`suspect\` em vez de chutar. Varra a base atrás do mesmo erro em outras claims de nutrição.\n\n` +
        `**2. \`F001\` não está registrado em \`research/tools/sources.mjs\`.** O regulamento da IPF ` +
        `é 143 claims e uma fonte de primeira ordem, e o registro de fontes não o conhece. Veja se ` +
        `ele CABE naquele registro (é PDF, não canal de YouTube — talvez precise de outro formato) ` +
        `e resolva de um jeito que não minta sobre o que ele é.\n\n` +
        `**3. Uma premissa errada minha, no comentário de \`sources.mjs\`.** Escrevi que "93 % do ` +
        `canal do Blevins é de 2013–2018" e que a regra da recência o mataria nos empates. Verdade ` +
        `sobre o canal inteiro, falso sobre o que foi extraído: a triagem filtrou, e metade das ` +
        `claims extraídas é de 2022 em diante. Confirme contando de verdade (\`manifest.json\` + ` +
        `os arquivos \`G*.jsonl\`) e reescreva o comentário com o número certo. A regra de ` +
        `credencial-primeiro continua valendo; a justificativa é que está inflada.\n\n` +
        `**4. \`check-evidence.mjs --limit\` default 40, e 56 dos 68 tópicos têm mais que isso.** ` +
        `Ele avisa que truncou, mas o default está calibrado para uma base que não existe mais. ` +
        `Escolha um default defensável e faça o aviso de truncamento impossível de não ver — quem ` +
        `lê "40 de 300" e conclui que viu o assunto inteiro toma decisão errada.\n\n` +
        `**5. \`G033\` não foi extraído** (ver \`BLEVINS-INGESTAO.md\` §6.3). Descubra por quê e, ` +
        `se for extraível, extraia seguindo o \`PROTOCOLO-EXTRACAO.md\` à risca, com o compilador ` +
        `no seu loop.\n\n` +
        `**6. \`research/predicoes.md\` apareceu sem dono.** Um agente da rodada de planejamento o ` +
        `criou, embora eu tenha pedido que não editassem nada. Leia, decida se presta, e ou ` +
        `integre direito ao \`research/kb/\` com procedência declarada, ou registre por que sai. ` +
        `Não deixe órfão: arquivo sem dono vira autoridade por antiguidade.\n\n` +
        `\`npm run check:kb\` tem de passar. Escreva o que fez e o que não deu em ` +
        `\`research/kb/DEFEITOS-PONTUAIS.md\`.`,
      { label: 'defeitos', phase: 'Blindar', effort: 'high' },
    ),
])

log(`blindagem: ${blindagem.filter(Boolean).length}/4 frentes concluídas`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Verificar travas')

const VEREDITO = {
  type: 'object',
  required: ['aprovado', 'furos', 'resumo'],
  properties: {
    aprovado: { type: 'boolean' },
    furos: { type: 'array', items: { type: 'string' }, description: 'cada defeito que a trava PROMETE pegar e não pega, com o caso concreto que você usou para provar' },
    resumo: { type: 'string' },
  },
}

const ATACAR = (nome, alvo, comoAtacar) =>
  agent(
    `${CTX}\n\n` +
      `## VOCÊ ATACA UMA TRAVA QUE OUTRO AGENTE ACABOU DE CONSTRUIR: ${nome}\n\n` +
      `Relato de quem construiu:\n\n${alvo}\n\n` +
      `NÃO acredite no relato. Quem constrói uma trava é a pior pessoa para dizer se ela trava — ` +
      `testa os casos que imaginou, e o defeito mora nos que não imaginou. Este projeto já teve ` +
      `um commit cuja mensagem dizia "liga a base ao build" sem ligar coisa nenhuma.\n\n` +
      `${comoAtacar}\n\n` +
      `MÉTODO: quebre de propósito. Para cada defeito que a trava promete pegar, construa o caso ` +
      `que o exibe e rode. Se passar, é furo — reporte com o comando exato que reproduz. Se você ` +
      `puder consertar sem risco, conserte; se o conserto for grande, especifique.\n\n` +
      `Julgue também o INVERSO, que é o custo esquecido: a trava recusa coisa legítima? Falso ` +
      `positivo manda gente reescrever o que estava certo, e o dano de verdade é ensinar a ignorar ` +
      `o aviso. Um aviso ignorado é pior que nenhum aviso.\n\n` +
      `Seja específico e sem diplomacia. \`aprovado: true\` só se você TENTOU quebrar e não ` +
      `conseguiu — não se você leu o código e achou razoável.`,
    { label: `atacar:${nome}`, phase: 'Verificar travas', schema: VEREDITO, effort: 'high' },
  )

const ataques = await parallel([
  () =>
    ATACAR(
      'gate-dor',
      blindagem[0] ?? '(a frente do gate não entregou relato)',
      `O que está em jogo: o atleta tem histórico de lesão de peitoral, e o \`PROGRAMA.md\` manda ` +
        `congelar o \`TM_supino\` a partir de UM evento de 2/10. Antes de hoje isso não disparava.\n\n` +
        `Ataque: registre uma dor de peitoral 2/10 pelo caminho que o app realmente usa e prove ` +
        `que a bandeira sobe. Prove que 1/10 NÃO sobe. Prove que a checagem de coerência falha ` +
        `quando você altera o limiar no \`PROGRAMA.md\` sem alterar o código, e falha também no ` +
        `caminho contrário. Confira se dado já gravado com \`other\` sobrevive à mudança de enum, ` +
        `e se há persistência (Firestore) que precisava de migração e não teve. E rode ` +
        `\`npm run build\`.`,
    ),
  () =>
    ATACAR(
      'instrumento',
      blindagem[1] ?? '(a frente do instrumento não entregou relato)',
      `O que está em jogo: sem este instrumento, a próxima medição da base mente com confiança, ` +
        `como a de hoje mentiu.\n\n` +
        `Ataque o \`check-answer.mjs\` escrevendo respostas maliciosas: uma que afirma "3 a 5 ` +
        `séries" citando uma claim que não fala de séries; uma com número escrito por extenso; ` +
        `uma que cita id existente mas irrelevante; uma sem número nenhum e completamente ` +
        `inventada (ele deve passar, e a documentação tem de dizer que passa — se não disser, é ` +
        `furo de honestidade, não de código). Ataque os falsos positivos com nome de programa ` +
        `(5/3/1, nSuns), ano, e número vindo do enunciado.\n\n` +
        `Ataque os canários: algum "impossível" já é respondível hoje? Recalcule contando a base. ` +
        `E ataque a premissa: se todos os canários "presente" forem fáceis, eles não calibram ` +
        `nada — um instrumento que só detecta o desastre não mede a diferença entre bom e medíocre.`,
    ),
  () =>
    ATACAR(
      'enumerados',
      blindagem[2] ?? '(a frente dos enumerados não entregou relato)',
      `O que está em jogo: 18 agentes vão preencher 6.909 claims logo depois desta fase. Um ` +
        `vocabulário curto vira contorno, e contorno vira dado errado que passa no checker.\n\n` +
        `Ataque pela FALTA: pegue uma amostra de verdade das claims — inclusive as do Blevins, que ` +
        `são novas — e tente classificar cada uma no \`modo\` novo. Ache as que não cabem. Tente ` +
        `especialmente as de análise de programa de terceiro e as de *Form Assessment Saturday*, ` +
        `que foram a motivação da gaveta nova; se elas ainda não couberem direito, a gaveta foi mal ` +
        `desenhada.\n\n` +
        `Ataque pelo EXCESSO: tópico que ninguém vai procurar é ruído que enfraquece o grep. Ache ` +
        `os que entraram e não deviam.\n\n` +
        `Ataque a TRAVA: escreva uma claim com \`modo\` inválido e exija recusa. Uma com tópico ` +
        `novo válido e exija aceitação. Confirme que \`SCHEMA.md\`, \`PROTOCOLO-EXTRACAO.md\` e ` +
        `\`check-claims.mjs\` dizem a MESMA coisa — divergência silenciosa entre documento e trava ` +
        `é o defeito recorrente deste projeto.`,
    ),
])

const furos = ataques.filter(Boolean).flatMap((a) => a.furos ?? [])
const reprovadas = ataques.filter(Boolean).filter((a) => !a.aprovado).length
log(`travas: ${reprovadas} reprovada(s), ${furos.length} furo(s) apontado(s)`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Preencher')

const LOTES = 18

const PREENCHER_SCHEMA = {
  type: 'object',
  required: ['arquivos', 'claimsTocadas', 'modoDistribuicao', 'conditionsCriadas', 'checkerLimpo'],
  properties: {
    arquivos: { type: 'array', items: { type: 'string' } },
    claimsTocadas: { type: 'number' },
    modoDistribuicao: { type: 'string', description: 'quantas de cada valor de modo' },
    conditionsCriadas: { type: 'number' },
    prescricaoSemCondicao: { type: 'number', description: 'prescrições com número de volume/intensidade/frequência que ficaram sem condição — o lugar de olhar duas vezes' },
    checkerLimpo: { type: 'boolean' },
    duvidas: { type: 'string', description: 'o que não coube, o que ficou ambíguo, onde você chutaria se fosse obrigado' },
  },
}

const preenchimentos = await parallel(
  [...Array(LOTES).keys()].map((i) => () =>
    agent(
      `${CTX}\n\n` +
        `## SUA TAREFA: PREENCHER \`modo\` E \`conditions\` — LOTE ${i + 1} DE ${LOTES}\n\n` +
        `Liste \`research/extract/*.jsonl\` em ordem alfabética. São ~231 arquivos. **O seu lote é ` +
        `todo arquivo cujo índice (base 0) satisfaz \`índice % ${LOTES} === ${i}\`.** Nenhum outro. ` +
        `Outros 17 agentes trabalham nos demais ao mesmo tempo; encostar em arquivo que não é seu ` +
        `perde o trabalho de alguém.\n\n` +
        `### Por que isto importa mais do que parece\n\n` +
        `Hoje \`modo\` está preenchido em **0 de 6.909** e \`conditions\` em **0 de 6.909**.\n\n` +
        `Uma auditoria mediu que **só 17 % do que está marcado \`scope: GERAL\` é prescrição de ` +
        `verdade** — o resto é opinião, mecanismo, fato do mundo, narração de estudo. Sem \`modo\`, ` +
        `filtrar \`GERAL\` devolve "ele acha o deltoide anterior subestimado" junto com "agache duas ` +
        `vezes por semana", como se fossem a mesma categoria de instrução. **É a segunda que vira ` +
        `treino.** Esta é a consulta que mais importa na base inteira e ela está quebrada.\n\n` +
        `E \`conditions\` é a aresta que impede prescrição perigosa. O achado mais grave de uma ` +
        `auditoria anterior: "supino 6× por semana" foi extraído SEM "nunca acima de RPE 5", que ` +
        `ele diz na mesma respiração. Separada da condição, a prescrição não fica incompleta — fica ` +
        `**perigosa, porque parece completa**. O consumidor é um natural de 87 kg com histórico de ` +
        `lesão de peitoral lendo o que um homem de 120 kg faz.\n\n` +
        `### Como preencher\n\n` +
        `Leia \`research/kb/SCHEMA.md\` (seções \`modo\` e \`conditions\`) e ` +
        `\`research/kb/ENUMERADOS.md\`, que outro agente acabou de escrever com o vocabulário ` +
        `final — inclusive uma gaveta nova para quando ele descreve o programa DE OUTRA PESSOA em ` +
        `vez de prescrever para você. **Use exclusivamente os valores de lá.** O compilador agora ` +
        `recusa \`modo\` fora do enumerado.\n\n` +
        `**\`modo\`, em toda claim.** \`scope\` diz PARA QUEM; \`modo\` diz QUE TIPO DE COISA. São ` +
        `perguntas diferentes. A distinção que mais importa acertar é \`prescricao\` contra o ` +
        `resto: só \`prescricao\` pode virar treino, então promover opinião a prescrição é o erro ` +
        `caro e o contrário é só conservador. **Na dúvida, não é prescrição.**\n\n` +
        `**\`conditions\`, onde houver.** Uma prescrição costuma vir com a ressalva do lado — no ` +
        `mesmo vídeo, quase sempre a poucos segundos. Você tem o arquivo inteiro do vídeo à mão: ` +
        `procure a claim que limita e aponte para o id dela. O checker recusa aresta para id ` +
        `inexistente, então id chutado não passa. **Não invente condição que ele não disse** — ` +
        `condição fabricada é pior que condição ausente, porque dá falsa sensação de completude.\n\n` +
        `Se a condição estiver em OUTRO vídeo, aponte assim mesmo: \`check-evidence.mjs --grep\` ` +
        `acha, e a base inteira é o índice. Priorize as prescrições com número de volume, ` +
        `intensidade ou frequência — são as que machucam quando circulam soltas.\n\n` +
        `### Disciplina\n\n` +
        `- Edite **só** os campos \`modo\` e \`conditions\`. Não reescreva \`claim\`, não mexa em ` +
        `\`verbatim\`, \`params\`, \`scope\`, \`at\` ou \`src\`. Se achar outro erro, **relate em ` +
        `\`duvidas\`, não conserte** — conserto fora de escopo em 18 agentes paralelos é como ` +
        `convenção errada se espalha.\n` +
        `- Uma claim por linha, JSON válido, ordem de campos preservada onde der.\n` +
        `- **O compilador roda no seu loop:** \`node research/tools/check-claims.mjs --only R014\` ` +
        `para cada arquivo seu, e corrija até passar limpo. Não entregue com erro e não descreva o ` +
        `erro no relatório em vez de consertar.\n` +
        `- Se um valor de \`modo\` não couber numa claim, **não force a mais próxima para calar o ` +
        `checker**. Relate em \`duvidas\`. Foi forçando gaveta que gramas viraram quilos.`,
      { label: `preencher:${i + 1}`, phase: 'Preencher', schema: PREENCHER_SCHEMA },
    ),
  ),
)

const ok = preenchimentos.filter(Boolean)
const tocadas = ok.reduce((n, p) => n + (p.claimsTocadas ?? 0), 0)
const arestas = ok.reduce((n, p) => n + (p.conditionsCriadas ?? 0), 0)
const sujos = ok.filter((p) => !p.checkerLimpo).length
log(`preenchimento: ${tocadas} claims em ${ok.length}/${LOTES} lotes · ${arestas} condições · ${sujos} lote(s) sujo(s)`)

const duvidas = ok.map((p, i) => `Lote ${i + 1}: ${p.duvidas ?? '—'}`).join('\n')

// ─────────────────────────────────────────────────────────────────────────────
phase('Auditar')

const AUDITORIA = {
  type: 'object',
  required: ['amostra', 'erros', 'taxaErro', 'veredito'],
  properties: {
    amostra: { type: 'number', description: 'quantas claims você abriu de verdade' },
    erros: { type: 'array', items: { type: 'string' }, description: 'id, o que está marcado, o que deveria estar, e por quê' },
    taxaErro: { type: 'string' },
    padrao: { type: 'string', description: 'os erros têm sistemática? um lote inteiro? um tipo de claim?' },
    veredito: { type: 'string' },
  },
}

const auditorias = await parallel([
  () =>
    agent(
      `${CTX}\n\n` +
        `## AUDITORIA: \`modo: "prescricao"\` É MESMO PRESCRIÇÃO?\n\n` +
        `18 agentes acabaram de preencher \`modo\` em 6.909 claims. \`prescricao\` é o único valor ` +
        `que pode virar treino, então é o único onde o erro tem consequência física.\n\n` +
        `Amostre pelo menos 120 claims marcadas \`prescricao\`, **de lotes diferentes e de ambos os ` +
        `corpora**, abra o \`verbatim\` de cada uma e julgue: ele está mandando fazer, ou está ` +
        `opinando, explicando mecanismo, narrando estudo, ou descrevendo o programa de outra ` +
        `pessoa? Use \`check-evidence.mjs\` e as transcrições.\n\n` +
        `A promoção indevida — opinião marcada como prescrição — é o erro caro. Meça a taxa e diga ` +
        `se ela tem sistemática: um lote inteiro pior que os outros, ou um tipo de claim que ` +
        `confunde todo mundo. Sistemática se conserta com uma regra; erro difuso, não.\n\n` +
        `Amostre TAMBÉM o inverso, ainda que menos: 40 claims marcadas com outro \`modo\` que ` +
        `deveriam ser \`prescricao\`. Subnotificação esconde instrução real do consumidor.`,
      { label: 'auditar:prescricao', phase: 'Auditar', schema: AUDITORIA, effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## AUDITORIA: AS ARESTAS \`conditions\` SÃO REAIS?\n\n` +
        `Amostre pelo menos 80 arestas \`conditions\` criadas agora. Para cada uma, abra os DOIS ` +
        `lados e responda: a claim apontada **limita mesmo** a prescrição, ou é só um assunto ` +
        `vizinho? Ele disse as duas coisas juntas, ou o agente aproximou duas coisas soltas?\n\n` +
        `Aresta falsa é pior que aresta ausente: ela faz a prescrição PARECER qualificada e ` +
        `desliga a desconfiança de quem lê. Meça a taxa de aresta falsa.\n\n` +
        `Depois faça a busca oposta, que é a mais importante: pegue as prescrições que ficaram SEM ` +
        `condição e que carregam número de volume, intensidade ou frequência, e verifique numa ` +
        `amostra se a condição estava lá na transcrição e foi perdida. **Uma prescrição de volume ` +
        `alto sem a ressalva que ele disse junto é o defeito que este campo existe para impedir.** ` +
        `Priorize supino e frequência, pelo histórico de peitoral do atleta.`,
      { label: 'auditar:conditions', phase: 'Auditar', schema: AUDITORIA, effort: 'high' },
    ),
  () =>
    agent(
      `${CTX}\n\n` +
        `## AUDITORIA: O PREENCHIMENTO ESTRAGOU ALGUMA COISA?\n\n` +
        `18 agentes editaram 231 arquivos em paralelo. Eles foram instruídos a mexer SÓ em ` +
        `\`modo\` e \`conditions\`. Verifique se obedeceram — e prefira uma verificação ` +
        `MECÂNICA à leitura: compare a base contra o estado anterior do git (\`git show\`, ` +
        `\`git diff\` em modo somente-leitura, sem alterar nada) e prove que nenhum outro campo ` +
        `mudou. Se algum \`verbatim\`, \`param\`, \`scope\` ou \`at\` foi alterado, isso é grave e ` +
        `tem de aparecer com o id exato.\n\n` +
        `Confira também: nenhuma claim sumiu, nenhuma nasceu, nenhum id duplicou, todo arquivo ` +
        `continua JSONL válido, a contagem por arquivo bate. Rode \`npm run check:kb\` e ` +
        `\`npm run build\`.\n\n` +
        `Relate cada dano com o comando que o reproduz. Se estiver tudo íntegro, diga isso com a ` +
        `mesma clareza — alarme falso aqui manda 18 lotes serem refeitos à toa.`,
      { label: 'auditar:integridade', phase: 'Auditar', schema: AUDITORIA, effort: 'high' },
    ),
])

// ─────────────────────────────────────────────────────────────────────────────
phase('Fechar')

const fecho = await agent(
  `${CTX}\n\n` +
    `## CONSOLIDAR A RODADA\n\n` +
    `### Blindagem\n` +
    `Gate do peitoral: ${blindagem[0] ?? '(sem relato)'}\n\n` +
    `Instrumento de medição: ${blindagem[1] ?? '(sem relato)'}\n\n` +
    `Enumerados: ${blindagem[2] ?? '(sem relato)'}\n\n` +
    `Defeitos pontuais: ${blindagem[3] ?? '(sem relato)'}\n\n` +
    `### Ataques às travas\n` +
    ataques.filter(Boolean).map((a) => `- ${a.aprovado ? 'APROVADA' : 'REPROVADA'}: ${a.resumo}\n${(a.furos ?? []).map((f) => `    furo: ${f}`).join('\n')}`).join('\n') +
    `\n\n### Preenchimento\n${tocadas} claims tocadas, ${arestas} condições criadas, ${sujos} lote(s) reportando checker sujo.\n\nDúvidas de campo:\n${duvidas}\n\n` +
    `### Auditorias\n` +
    auditorias.filter(Boolean).map((a) => `- amostra ${a.amostra}, taxa ${a.taxaErro}: ${a.veredito}\n  padrão: ${a.padrao ?? '—'}\n${(a.erros ?? []).slice(0, 15).map((e) => `    ${e}`).join('\n')}`).join('\n\n') +
    `\n\n### O QUE VOCÊ FAZ\n\n` +
    `1. **Rode \`npm run build\` e \`npm run check:kb\`.** Se falhar, conserte — este é o último ` +
    `passo antes de commitar e nada sai daqui quebrado.\n\n` +
    `2. **Conserte o que as auditorias acharem, se for pequeno e claro.** Erro sistemático de ` +
    `preenchimento (um lote inteiro, um tipo de claim) conserta-se agora. Erro difuso registre — ` +
    `não vale reescrever 6.909 claims por uma taxa de 3 %.\n\n` +
    `3. **Atualize \`research/RUNBOOK.md\`.** Ele mapeia o sistema e é o que o próximo agente lê ` +
    `antes de tudo. Precisa refletir: a segunda fonte, o \`modo\` e as \`conditions\` preenchidos, ` +
    `as travas novas, o instrumento de medição, e as divergências documento-versus-código que ` +
    `ainda existirem. **Divergência não resolvida vai na lista de divergências, não some.**\n\n` +
    `4. **Escreva \`research/kb/ESTADO.md\`**, curto e honesto, com estas seções:\n` +
    `   - o que a base sabe fazer hoje que não sabia ontem\n` +
    `   - o que foi PROVADO mecanicamente e o que continua sendo julgamento de agente\n` +
    `   - o que sabidamente ainda está errado, com id e tamanho\n` +
    `   - o que a próxima rodada tem de atacar, em ordem, e por quê\n\n` +
    `Uma coisa não pode faltar em nenhum dos dois documentos, porque é a lição mais cara do dia: ` +
    `a medição de hoje disse "3 falhas em 29" e era mentira — dois canários provaram que o ` +
    `avaliador respondia do próprio conhecimento. **Nenhum número de qualidade da base deve ser ` +
    `citado no futuro sem dizer com que instrumento foi obtido e se os canários daquele instrumento ` +
    `passaram.** Deixe isso escrito onde não dê para não ler.\n\n` +
    `Português do Brasil. NÃO use git.`,
  { label: 'fechar', phase: 'Fechar', effort: 'high' },
)

return {
  travasReprovadas: reprovadas,
  furos,
  claimsTocadas: tocadas,
  conditionsCriadas: arestas,
  lotesSujos: sujos,
  auditorias: auditorias.filter(Boolean).map((a) => ({ amostra: a.amostra, taxa: a.taxaErro, veredito: a.veredito })),
  fecho,
}
