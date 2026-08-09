export const meta = {
  name: 'remedir-base',
  description: 'Re-mede a base com o instrumento reconstruído e diz o que mudou de veredito — e o que mudou por causa do Blevins',
  phases: [
    { title: 'Carregar', detail: 'monta o conjunto: 29 perguntas + 15 canários, embaralhados' },
    { title: 'Medir', detail: '5 lotes respondem; um julgador independente confere cada um com as travas' },
    { title: 'Comparar', detail: 'o que mudou desde a medição que mentiu, e por causa de quê' },
  ],
}

const REPO = '/Users/brunnovert/Documents/Dev/powerlifting-app'

const ATLETA = `
O ATLETA. Homem, 28 anos, brasileiro, 87 kg, ~15 % de gordura, powerlifter NATURAL, classe
93 kg da IPF (83,01–93,00) com folga. Treina há anos, 5 dias/semana, 75–100 min. Marcas DE
TREINO, nunca sob comando de árbitro: agacho 250, supino 170, terra sumo 268. Está mudando a
técnica de agachamento. **Tem histórico de lesão de peitoral** e o bloco atual foi desenhado
em torno de um protocolo de reexposição gradual do supino. Nunca competiu. Objetivo declarado:
recorde mundial; também se importa com estética (powerbuilding, ~80/20 para força).

A REALIDADE MEDIDA: recorde mundial IPF clássico open 93 kg = 927,5 kg (ele está a ~240 kg).
Pódio do Brasileiro 2025 = 775/757,5/745 kg (a ~57 kg do terceiro). O gargalo dos 12 meses é
federativo: o Brasileiro exige estadual no ano anterior, o que empurra um estadual para
out/nov de 2026. Antidoping doméstico é quase inexistente, mas a IPF internacional testa.
`

const BASE = `
A BASE: \`research/extract/*.jsonl\`, 6.909 claims tipadas, um arquivo por vídeo.
- 4.947 do Matt Vena (refs R###) — NÃO compete testado, ~120 kg, agacha 400 kg
- 1.819 do Garrett Blevins (refs G###) — compete testado na IPF
- 143 do IPF Technical Rulebook 2026 (ref F001, tier O normativo)

Campos: id, src, at, tier (R corpus / O normativo / E elite / L literatura / I interpretação
/ U usuário), scope (GERAL = prescreve para você / PESSOAL = descreve o que ele faz),
certainty, **modo** (prescricao / opiniao / mecanismo / fato / estudo / anedota / narrativa /
relato-de-programa / avaliacao-de-terceiro), **conditions** (as claims que limitam esta),
conflicts, topic[] de vocabulário fechado, claim em português, verbatim literal em inglês,
params[] com unit e frame tipados.

**\`modo\` importa para você.** Só \`prescricao\` é ele mandando VOCÊ fazer.
\`relato-de-programa\` é ele descrevendo o programa de outra pessoa (5/3/1, nSuns, Cube);
\`avaliacao-de-terceiro\` é ele corrigindo um desconhecido a partir de um vídeo enviado.
Tratar essas duas como prescrição dirigida ao atleta é erro grave de leitura.

FERRAMENTAS:
  node research/tools/check-evidence.mjs V014-03 G020-11        # resolve ids; acusa fabricado
  node research/tools/check-evidence.mjs --grep "deload" --limit 0
  node research/tools/check-evidence.mjs --topic pico --modo prescricao --scope GERAL
  node research/tools/check-answer.mjs --resposta r.md --ids "V014-03,G001-11"
Documentos em \`research/kb/\`: SCHEMA.md, ESTADO.md, IPF-REALIDADE.md, IPF-CHECKLIST.md,
ANTIDOPING-BR.md, BLEVINS-INGESTAO.md, ENUMERADOS.md. E \`research/RUNBOOK.md\`.
`

const CTX = `REPO: ${REPO}\n${ATLETA}\n${BASE}`

// ─────────────────────────────────────────────────────────────────────────────
phase('Carregar')

const CONJUNTO_SCHEMA = {
  type: 'object',
  required: ['itens'],
  properties: {
    itens: {
      type: 'array',
      description: 'todas as perguntas de AVALIACAO.md e todos os canários de CANARIOS.json, numa lista só',
      items: {
        type: 'object',
        required: ['id', 'pergunta', 'criterio'],
        properties: {
          id: { type: 'string', description: 'Q01… para as de avaliação, C01… para canários — o id original, sem inventar' },
          pergunta: { type: 'string' },
          criterio: { type: 'string', description: 'o que uma resposta aprovada precisa conter — copiado do arquivo, não reescrito' },
          severidade: { type: 'string' },
          fonteEsperada: { type: 'string' },
        },
      },
    },
  },
}

const conjunto = await agent(
  `${CTX}\n\n` +
    `## SUA TAREFA: MONTAR O CONJUNTO DE MEDIÇÃO\n\n` +
    `Leia \`research/kb/AVALIACAO.md\` (29 perguntas Q01…) e \`research/kb/CANARIOS.json\` ` +
    `(15 canários C01…) e devolva **uma lista só**, com todos os 44 itens.\n\n` +
    `Para cada um: o id ORIGINAL, a pergunta como está escrita, e o critério de aprovação como ` +
    `está escrito. **Não reescreva o critério, não melhore a pergunta, não invente id.** Se um ` +
    `critério estiver vago no arquivo, deixe vago — mudar o critério agora invalidaria a ` +
    `comparação com a medição anterior, que é metade do produto desta rodada.\n\n` +
    `Para os canários, o campo de critério é o \`esperado\`. **Não copie o campo \`familia\` nem ` +
    `o \`porque\`** para dentro do critério: quem for responder não pode saber que aquilo é ` +
    `canário, nem qual é o desfecho conhecido. Um canário identificável não calibra nada.\n\n` +
    `Rode \`node research/tools/check-canarios.mjs\` antes de terminar e diga no fim se todos os ` +
    `15 continuam válidos — um canário "impossível" que virou respondível precisa ser sinalizado ` +
    `agora, não depois de contaminar a medição.\n\n` +
    `NÃO edite nada. NÃO use git.`,
  { label: 'carregar', phase: 'Carregar', schema: CONJUNTO_SCHEMA, effort: 'high' },
)

if (!conjunto?.itens?.length) throw new Error('não foi possível carregar o conjunto de medição — abortando antes de medir nada')

// Intercalação determinística: canários e perguntas reais alternam por posição, para
// nenhum lote receber só canário nem só pergunta real. Sem Math.random — o workflow
// precisa ser reexecutável.
const itens = conjunto.itens
const canarios = itens.filter((x) => /^C/i.test(x.id))
const reais = itens.filter((x) => !/^C/i.test(x.id))
const misturado = []
const passo = Math.max(1, Math.round(reais.length / Math.max(1, canarios.length)))
let ci = 0
reais.forEach((q, i) => {
  misturado.push(q)
  if (i % passo === passo - 1 && ci < canarios.length) misturado.push(canarios[ci++])
})
while (ci < canarios.length) misturado.push(canarios[ci++])

const N = 5
const LOTES = [...Array(N).keys()].map((i) => misturado.filter((_, j) => j % N === i)).filter((l) => l.length)
log(`conjunto: ${reais.length} perguntas + ${canarios.length} canários = ${misturado.length} itens em ${LOTES.length} lotes`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Medir')

const RESPOSTA_SCHEMA = {
  type: 'object',
  required: ['respostas'],
  properties: {
    respostas: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'resposta', 'evidenciaIds', 'caminho', 'lacunaPercebida', 'perigo'],
        properties: {
          id: { type: 'string' },
          resposta: { type: 'string', description: 'a resposta que a base sustenta. Se não sustenta nada, escreva exatamente: A BASE NÃO RESPONDE.' },
          evidenciaIds: { type: 'array', items: { type: 'string' } },
          evidenciaOutra: { type: 'string' },
          caminho: { type: 'string', description: 'os comandos que você rodou e os termos que tentou, em ordem' },
          lacunaPercebida: { type: 'string', enum: ['nenhuma', 'conteudo-ausente', 'conteudo-errado', 'nao-encontravel'] },
          usouModo: { type: 'boolean', description: 'true se você filtrou por modo para separar prescrição de relato-de-programa e avaliacao-de-terceiro' },
          perigo: { type: 'string', description: 'o que a base responderia aqui que seria nocivo a um natural de 87 kg com histórico de peitoral. Se nada, escreva exatamente: nenhum.' },
        },
      },
    },
  },
}

const JULGAMENTO_SCHEMA = {
  type: 'object',
  required: ['julgamentos'],
  properties: {
    julgamentos: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'veredito', 'evidenciaConfere', 'numerosOrfaos', 'justificativa', 'lacuna', 'perigo'],
        properties: {
          id: { type: 'string' },
          veredito: { type: 'string', enum: ['responde-bem', 'responde-parcial', 'responde-mal', 'nao-responde', 'responde-errado'] },
          evidenciaConfere: { type: 'string', enum: ['todos-resolvem', 'alguns-nao-resolvem', 'nenhum-id-citado', 'ids-fabricados'] },
          idsQueNaoResolvem: { type: 'array', items: { type: 'string' } },
          numerosOrfaos: { type: 'string', description: 'a saída do check-answer.mjs: que números da resposta não aparecem em nada citado' },
          respondeuDeFora: { type: 'boolean' },
          confundiuModo: { type: 'boolean', description: 'true se a resposta tratou relato-de-programa ou avaliacao-de-terceiro como prescrição dirigida ao atleta' },
          justificativa: { type: 'string' },
          lacuna: { type: 'string', enum: ['nenhuma', 'conteudo-ausente', 'conteudo-errado', 'nao-encontravel'] },
          perigo: { type: 'string' },
        },
      },
    },
  },
}

const porId = new Map(misturado.map((x) => [x.id, x]))

const medicoes = await pipeline(
  LOTES,
  (lote, _o, i) =>
    agent(
      `${CTX}\n\n## RESPONDA USANDO SÓ A BASE — LOTE ${i + 1}\n\n` +
        lote.map((q) => `**${q.id}** ${q.pergunta}\n   critério de aprovação: ${q.criterio}`).join('\n\n') +
        `\n\nResponda cada uma como um agente de conversa faria: \`check-evidence.mjs\` com ` +
        `\`--grep\`, \`--topic\`, \`--modo\`, \`--scope\`, os documentos de \`research/kb/\`, e as ` +
        `transcrições quando precisar de contexto.\n\n` +
        `**Use \`--modo\`.** É novo e é o que separa "ele manda VOCÊ fazer" de "ele está ` +
        `descrevendo o programa do Wendler" e de "ele está corrigindo um desconhecido num vídeo". ` +
        `Uma resposta que trate as duas últimas como instrução dirigida a este atleta está errada ` +
        `mesmo que cite id que resolve.\n\n` +
        `**VOCÊ NÃO JULGA A PRÓPRIA RESPOSTA.** Outro agente, que não te viu trabalhar, vai rodar ` +
        `\`check-evidence.mjs\` em cada id que você citar e \`check-answer.mjs\` na sua resposta ` +
        `inteira. Id que não resolve é evidência fabricada. **Número que aparece na sua resposta e ` +
        `não aparece em nada que você citou é conhecimento vindo de fora, e será acusado ` +
        `mecanicamente.** Então cite só o que abriu, e não escreva número que não veio da base.\n\n` +
        `**ISTO É UM TESTE DA BASE, NÃO DE VOCÊ.** Não complete lacuna com o que sabe de ` +
        `powerlifting. Se a base não sustenta, escreva "A BASE NÃO RESPONDE" — é um resultado ` +
        `valioso, não uma derrota sua. Há itens neste lote cuja resposta correta é exatamente ` +
        `essa, e outros cuja resposta correta é declarar incerteza apesar de a pergunta parecer ` +
        `respondível. Na medição anterior, dois avaliadores preencheram buraco com conhecimento ` +
        `próprio e destruíram o relatório inteiro.\n\n` +
        `Antes de declarar ausência, esgote vocabulário — português, inglês, gíria, o termo ` +
        `técnico, o termo do canal — e registre as tentativas em \`caminho\`.\n\n` +
        `E preencha **perigo** com atenção: a base responderia aqui algo nocivo para um natural de ` +
        `87 kg com histórico de lesão de peitoral? Prescrição de outlier sem ressalva, volume ` +
        `insustentável, conselho que ignora regra de competição?\n\n` +
        `NÃO edite a base. NÃO use git.`,
      { label: `responder:${i + 1}`, phase: 'Medir', schema: RESPOSTA_SCHEMA },
    ),
  (resp, lote, i) => {
    const rs = resp?.respostas ?? []
    if (!rs.length) return null
    return agent(
      `${CTX}\n\n## VOCÊ JULGA — LOTE ${i + 1}\n\n` +
        `Outro agente tentou responder usando só a base. Você não o viu trabalhar. Julgue a ` +
        `resposta, não a dedicação.\n\n` +
        rs
          .map((r) => {
            const q = porId.get(r.id)
            return (
              `### ${r.id} — ${q?.pergunta ?? '(não encontrada)'}\n` +
              `**Critério:** ${q?.criterio ?? '—'}\n` +
              `**Resposta:** ${r.resposta}\n` +
              `**Ids citados:** ${(r.evidenciaIds ?? []).join(' ') || '(nenhum)'}\n` +
              `**Outra evidência:** ${r.evidenciaOutra ?? '—'}\n` +
              `**Caminho:** ${r.caminho}\n` +
              `**Lacuna percebida:** ${r.lacunaPercebida} · **filtrou por modo:** ${r.usouModo ?? '—'}\n` +
              `**Perigo apontado:** ${r.perigo}`
            )
          })
          .join('\n\n') +
        `\n\n### PROCEDIMENTO, nesta ordem\n\n` +
        `**1. Rode as travas. Não leia a resposta e decida.**\n` +
        `   \`node research/tools/check-evidence.mjs <ids da pergunta>\` — cada id resolve ou é ` +
        `fabricado. Leia as claims que resolvem: elas dizem MESMO o que a resposta afirma? Claim ` +
        `que resolve mas não sustenta a afirmação é tão ruim quanto id inventado, e mais difícil ` +
        `de ver.\n` +
        `   \`node research/tools/check-answer.mjs --resposta <arquivo> --ids "..."\` — todo número ` +
        `órfão é número que não veio da base. Cole a saída em \`numerosOrfaos\`. Ele tem falso ` +
        `positivo conhecido (nome de programa como 5/3/1, ano, número vindo do enunciado): julgue ` +
        `o que ele acusa, não obedeça cegamente.\n\n` +
        `**2. \`modo\` foi respeitado?** Marque \`confundiuModo\` quando a resposta usar uma claim ` +
        `\`relato-de-programa\` ou \`avaliacao-de-terceiro\` como se fosse instrução dirigida a ` +
        `este atleta. É o erro que o campo novo existe para impedir, e ele não aparece na ` +
        `conferência de id — a citação resolve perfeitamente.\n\n` +
        `**3. Respondeu de fora?** Afirmação — número, prescrição, mecanismo — que a base não ` +
        `sustenta e só pode ter vindo do conhecimento do agente. É o defeito mais grave possível ` +
        `aqui: ele falsifica a medição inteira, não só o item.\n\n` +
        `**4. Julgue contra o critério**, não contra o que você acha da pergunta.\n\n` +
        `**5. Se declarou ausência, desconfie.** Refaça a busca com pelo menos dois vocabulários ` +
        `que ele não tentou. Informação que ESTÁ na base e não foi achada é \`nao-encontravel\` — ` +
        `conserto barato de índice — e confundir isso com \`conteudo-ausente\` manda a próxima ` +
        `rodada comprar fonte que já se tem.\n\n` +
        `**6. Confirme ou derrube o perigo.** Não copie o campo dele: abra as claims. Alarme falso ` +
        `manda reescrever o que estava certo.\n\n` +
        `Reprove sem constrangimento. Julgador generoso produz relatório bonito e base que falha na ` +
        `primeira conversa de verdade. Escreva arquivos temporários só em ` +
        `\`research/tools/scan/julgar${i + 1}/\`. NÃO edite a base. NÃO use git.`,
      { label: `julgar:${i + 1}`, phase: 'Medir', schema: JULGAMENTO_SCHEMA },
    ).then((j) => ({ respostas: rs, julgamentos: j?.julgamentos ?? [] }))
  },
)

const resp = medicoes.filter(Boolean).flatMap((m) => m.respostas)
const julg = medicoes.filter(Boolean).flatMap((m) => m.julgamentos)
const porResp = new Map(resp.map((r) => [r.id, r]))

const ehCanario = (id) => /^C/i.test(id)
const jc = julg.filter((j) => ehCanario(j.id))
const jr = julg.filter((j) => !ehCanario(j.id))

const reprovadas = jr.filter((j) => j.veredito !== 'responde-bem')
const deFora = julg.filter((j) => j.respondeuDeFora)
const fabricada = julg.filter((j) => j.evidenciaConfere === 'ids-fabricados' || j.evidenciaConfere === 'alguns-nao-resolvem')
const confundiu = julg.filter((j) => j.confundiuModo)
log(`canários julgados: ${jc.length} · perguntas: ${jr.length}, ${reprovadas.length} abaixo de "responde bem" · ${deFora.length} de fora · ${fabricada.length} com evidência que não resolve · ${confundiu.length} confundiram modo`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Comparar')

const dossie = julg
  .map((j) => {
    const q = porId.get(j.id)
    const r = porResp.get(j.id)
    return (
      `### ${j.id} [${j.veredito}] lacuna:${j.lacuna}\n` +
      `P: ${q?.pergunta ?? '—'}\n` +
      `R: ${(r?.resposta ?? '—').slice(0, 700)}\n` +
      `evidência: ${(r?.evidenciaIds ?? []).join(' ') || '(nenhuma)'} — ${j.evidenciaConfere}` +
      (j.idsQueNaoResolvem?.length ? ` (não resolvem: ${j.idsQueNaoResolvem.join(' ')})` : '') +
      `\nnúmeros órfãos: ${(j.numerosOrfaos ?? '—').slice(0, 300)}\n` +
      `de fora: ${j.respondeuDeFora ? 'SIM' : 'não'} · confundiu modo: ${j.confundiuModo ? 'SIM' : 'não'}\n` +
      `julgamento: ${j.justificativa}\n` +
      `perigo: ${j.perigo}`
    )
  })
  .join('\n\n')

const comparacao = await agent(
  `${CTX}\n\n` +
    `## SUA TAREFA: DIZER O QUE MUDOU, E POR CAUSA DE QUÊ\n\n` +
    `A base foi re-medida agora contra o mesmo conjunto de \`research/kb/AVALIACAO.md\`, mais 15 ` +
    `canários de \`research/kb/CANARIOS.json\` misturados sem etiqueta.\n\n` +
    `### Resultado bruto\n\n${dossie}\n\n` +
    `### O QUE VOCÊ FAZ\n\n` +
    `**1. Calibre ANTES de reportar qualquer número.** Confira o desfecho de cada canário contra ` +
    `o \`esperado\` do \`CANARIOS.json\`: os "presente" tinham de passar, os "impossível" tinham ` +
    `de ser recusados, e os "armadilha" tinham de terminar em declaração de incerteza. **Se um ` +
    `"impossível" foi aprovado, o avaliador respondeu de fora e todo "responde-bem" deste ` +
    `relatório vira teto otimista, não medida.** Diga isso em letras grandes no topo, se for o ` +
    `caso, antes de qualquer contagem.\n\n` +
    `**2. Compare com a medição anterior**, em \`research/kb/AVALIACAO.md\` e no que os ` +
    `documentos registram dela. Cuidado, e este cuidado é o ponto: **aquela medição usou um ` +
    `instrumento quebrado** — dois de quatro canários divergiram, e ela declarou "3 falhas em 29" ` +
    `sobre uma base em que o avaliador respondia do próprio conhecimento. Ela é **marco ` +
    `histórico, não linha de base**. Comparar os placares de frente seria repetir o erro com mais ` +
    `confiança. O que dá para comparar honestamente é **pergunta a pergunta, com o motivo**: Q07 ` +
    `mudou de \`nao-responde\` para \`responde-bem\` porque a base ganhou o quê?\n\n` +
    `**3. Separe o que mudou POR CAUSA DO BLEVINS.** É a pergunta que paga a ingestão de 1.819 ` +
    `claims. Para cada pergunta que melhorou, olhe os ids citados: são \`G###\`? Se a melhora veio ` +
    `de \`modo\`/\`conditions\` preenchidos, ou de o avaliador ter procurado melhor, diga isso — ` +
    `não credite ao Blevins o que foi de outra coisa. E **procure o inverso, que ninguém procura ` +
    `sozinho: alguma pergunta PIOROU?** Fonte nova pode introduzir contradição que confunde onde ` +
    `antes havia uma resposta simples e errada. Piorar assim pode ser progresso — mas tem de ` +
    `aparecer.\n\n` +
    `**4. \`modo\` está pagando?** Ele custou um fan-out de 18 agentes. As respostas filtraram por ` +
    `\`modo\`? Alguém tratou \`relato-de-programa\` ou \`avaliacao-de-terceiro\` como prescrição ` +
    `dirigida ao atleta? Se ninguém usou o campo, ou ele não estava onde precisava, isso vale mais ` +
    `do que qualquer placar.\n\n` +
    `**5. Os perigos.** Consolide os confirmados. Este atleta tem histórico de lesão de peitoral ` +
    `e o bloco atual é um protocolo de reexposição do supino — perigo nessa área é o mais grave ` +
    `que existe aqui.\n\n` +
    `**6. Escreva \`research/kb/MEDICAO-02.md\`.** Não sobrescreva \`AVALIACAO.md\`: o conjunto de ` +
    `perguntas é o instrumento e tem de ficar estável para a terceira medição valer. Estruture ` +
    `com: calibração primeiro, depois o que mudou e por quê, depois o que o Blevins pagou, depois ` +
    `os perigos, depois o que atacar em seguida — em ordem, com o porquê da ordem.\n\n` +
    `**7. E seja direto no fim:** com a base de hoje, o que um agente de conversa consegue fazer ` +
    `por este atleta que não conseguia ontem? Se a resposta honesta for "pouca coisa que decida ` +
    `treino", diga. O objetivo aqui nunca foi uma base bonita, é um atleta mais forte — e o ` +
    `veredito da medição anterior foi que o que decide é consistência de anos, e que esta base ` +
    `vale pelo lado NEGATIVO: impedir erros caros e específicos. Julgue se isso continua sendo a ` +
    `resposta certa.\n\n` +
    `Nenhum número de qualidade sem dizer com que instrumento foi obtido e se os canários ` +
    `passaram. Português do Brasil. NÃO use git.`,
  { label: 'comparar', phase: 'Comparar', effort: 'high' },
)

return {
  perguntas: jr.length,
  canarios: jc.length,
  reprovadas: reprovadas.length,
  respondidasDeFora: deFora.map((j) => j.id),
  evidenciaQueNaoResolve: fabricada.map((j) => j.id),
  confundiramModo: confundiu.map((j) => j.id),
  vereditos: julg.map((j) => `${j.id}:${j.veredito}`),
  medicaoConfiavel: deFora.length === 0,
  comparacao,
}
