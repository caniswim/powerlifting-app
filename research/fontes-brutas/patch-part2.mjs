#!/usr/bin/env node
// Parte 2: números por extenso que merecem param agora que a gaveta existe.
// Só `claim` (prosa) e `params` mudam. `verbatim` NUNCA.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const D = '/Users/brunnovert/Documents/Dev/powerlifting-app/research/extract/';

const P = (name, value, unit, frame) => ({ name, value, unit, frame });
const kcal = (n, v) => P(n, v, 'kcal', 'kcal');
const g = (n, v) => P(n, v, 'g', 'g');
const sem = (n, v) => P(n, v, 'semanas', 'semanas');
const dias = (n, v) => P(n, v, 'dias', 'dias');
const mes = (n, v) => P(n, v, 'meses', 'meses');
const hrs = (n, v) => P(n, v, 'horas', 'horas');
const cnt = (n, v, u) => P(n, v, u, 'contagem');

const PATCH = {
  'V006-24': { claim: 'No pico de peso corporal e com o nível de atividade dele, a manutenção fica em cerca de 5500 calorias por dia.', params: [kcal('manutencao_kcal', 5500)] },
  'V006-25': { claim: 'Para a maioria das pessoas o déficit vai ficar na faixa de 1000 a 1500 calorias, por 2 ou 3 semanas, e o resto do ciclo é bulk.', params: [kcal('deficit_min', 1000), kcal('deficit_max', 1500), sem('duracao_min', 2), sem('duracao_max', 3)] },
  'V024-19': { claim: 'Na gravação faltavam pouco mais de 3 semanas para o meet.', params: [sem('semanas_ate_meet', 3)] },
  'V026-08': { claim: 'Ele manteve esse incremento semanal em todas as semanas do ciclo até aqui, 10 semanas seguidas.', params: [sem('semanas_consecutivas', 10)] },
  'V029-31': { claim: 'A janela anabólica depois do exercício pode ser curta, talvez 36 horas, o que abriria espaço para alguma atrofia se o músculo demorar mais que isso para ser treinado de novo.', params: [hrs('janela_anabolica', 36)] },
  'V029-38': { claim: 'O cardio que ele faz é de zona 2.', params: [cnt('zona_cardio', 2, 'zona')] },
  'V031-05': { claim: 'Treinadores observando visualmente não conseguiram identificar mais de 20 graus de flexão da coluna.', params: [P('flexao_nao_detectada', 20, 'graus', 'graus')] },
  'V031-07': { claim: 'Apesar de acharem que mantinham a coluna neutra, os levantadores não chegaram perto disso, com cerca de 20 graus de movimento.', params: [P('flexao_observada', 20, 'graus', 'graus')] },
  'V033-01': { claim: 'Ele está a 12 semanas do campeonato nacional e no dia um do ciclo de treino.', params: [sem('semanas_ate_nacional', 12)] },
  'V033-20': { claim: 'No supino ele usa microciclos de 3 semanas com progressão estilo Hepburn.', params: [sem('duracao_microciclo', 3)] },
  'V034-03': { claim: 'Ele mira 14 gramas de fibra por 1000 calorias pelos benefícios de saúde.', params: [g('fibra', 14), kcal('por_kcal', 1000)] },
  'V034-06': { claim: 'Ele mira 400 gramas totais de frutas e vegetais por dia, cerca de 5 porções, pelos benefícios de saúde.', params: [g('frutas_vegetais_dia', 400), cnt('porcoes', 5, 'porções')] },
  'V034-15': { claim: 'Cafeína consumida até 9 horas antes de dormir ainda pode afetar a qualidade do sono.', params: [hrs('antecedencia_cafeina', 9)] },
  'V034-25': { claim: 'No peso mais alto dele, a manutenção fica acima de 5000 calorias por dia.', params: [kcal('manutencao_kcal', 5000)] },
  'V034-26': { claim: 'Mesmo com o déficit agressivo dele, sobram cerca de 2500 calorias de comida por dia.', params: [kcal('kcal_ingeridas', 2500)] },
  'V035-09': { claim: 'Com 2 dias de agacho na semana, aliviar demais o dia leve para performar no pesado reduz o volume total da semana.', params: [P('frequencia_agacho', 2, 'dias/semana', 'x_semana')] },
  'V037-09': { claim: 'A frequência cardíaca de repouso dele também caiu cerca de 10 batimentos por minuto.', params: [P('queda_fc_repouso', 10, 'bpm', 'bpm')] },
  'V039-01': { claim: 'O estudo usado para dizer que bulking é inútil tinha 3 grupos: manutenção, superávit pequeno e superávit grande.', params: [cnt('n_grupos', 3, 'grupos')] },
  'V039-08': { claim: 'O estudo durou apenas 8 semanas e teve só 17 participantes.', params: [sem('duracao_estudo', 8), P('n_participantes', 17, 'pessoas', 'n_amostra')] },
  'V039-27': { claim: 'Ele olha a tendência de peso por pelo menos 2 semanas, ou um mês inteiro, antes de ajustar calorias.', params: [sem('janela_tendencia', 2)] },
  'V040-01': { claim: 'A resposta dele para com que frequência testar o máximo é a cada 16 semanas.', params: [sem('intervalo_teste', 16)] },
  'V040-14': { claim: 'O intervalo de 16 semanas vem anedoticamente do trabalho dele como treinador, onde encontrou um ponto ótimo.', params: [sem('intervalo_teste', 16)] },
  'V040-17': { claim: 'Num programa mais curto, 1 ou 2 semanas ruins pesam proporcionalmente muito mais e podem impedir os PRs sem que o programa seja ruim.', params: [sem('semanas_ruins_min', 1), sem('semanas_ruins_max', 2)] },
  'V040-18': { claim: '16 semanas é o limite superior em que o teste ainda fica no horizonte e não dá para procrastinar.', params: [sem('intervalo_teste', 16)] },
  'V040-20': { claim: 'Ele teve um ano em que fez algo como 6 competições em 13 meses e terminou muito queimado.', params: [cnt('n_meets', 6, 'competições'), mes('periodo', 13)] },
  'V040-24': { claim: 'Num período muito bom de treino, dá para testar o máximo depois de 10 ou 12 semanas.', params: [sem('intervalo_min', 10), sem('intervalo_max', 12)] },
  'V040-25': { claim: 'Depois de algumas semanas ruins ou de um mês ruim, dá para esticar o ciclo até cerca de 20 semanas.', params: [sem('ciclo_esticado', 20)] },
  'V041-04': { claim: 'Ele enquadra o tema em 2 conceitos: retornos decrescentes e as desvantagens da otimização estrita para a maioria das pessoas.', params: [cnt('n_conceitos', 2, 'conceitos')] },
  'V041-10': { claim: '2 outras meta-análises posteriores, que não assumiram ponto de quebra, mostraram benefícios crescentes com ingestões mais altas.', params: [cnt('n_metanalises', 2, 'estudos')] },
  'V043-13': { claim: 'Ele se limita a 3 bebidas cafeinadas por dia e nenhuma no fim do dia.', params: [cnt('bebidas_cafeinadas_dia', 3, 'bebidas/dia')] },
  'V044-12': { claim: 'A pressão arterial dele fica em torno de 130 por 80, o que ele mesmo considera um pouco alto.', params: [P('pa_sistolica', 130, 'mmHg', 'mmHg'), P('pa_diastolica', 80, 'mmHg', 'mmHg')] },
  'V044-18': { claim: 'Ele come cerca de 10 porções de frutas e vegetais por dia.', params: [cnt('porcoes_dia', 10, 'porções')] },
  'V054-22': { claim: 'Ao se aproximar do meet ele reduziu a intensidade do cardio, saindo do trabalho de zona 4 para zona 2.', params: [cnt('zona_inicial', 4, 'zona'), cnt('zona_final', 2, 'zona')] },
  'V054-29': { claim: 'Ele decidiu começar o taper 2 semanas antes do meet, mantendo alguma carga de trabalho para preservar as adaptações.', params: [sem('inicio_taper', 2)] },
  'V056-04': { claim: 'Esse foi o primeiro single de supino que ele fez em 19 semanas.', params: [sem('intervalo_sem_single', 19)] },
  'V056-23': { claim: 'Ele considera alcançáveis supino de 3 anilhas e agacho e terra de 5 anilhas, tendo visto isso em centenas de pessoas que treinou.', params: [cnt('anilhas_supino', 3, 'anilhas'), cnt('anilhas_agacho_terra', 5, 'anilhas')] },
  'V059-01': { claim: 'Ele escolheu para o vídeo 3 pontos que ajudaram o próprio terra e o de quem ele treina, aplicáveis tanto ao convencional quanto ao sumo.', params: [cnt('n_pontos', 3, 'itens')] },
  'V060-03': { claim: 'Ele cita um estudo com quase 15000 praticantes cuja regra básica é que a taxa de progresso cai pela metade com o tempo.', params: [P('n_amostra', 15000, 'pessoas', 'n_amostra')] },
  'V062-11': { claim: 'Ele recomenda em geral que as pessoas fiquem na zona 2 do modelo de 5 zonas de cardio.', params: [cnt('zona_cardio', 2, 'zona'), cnt('n_zonas_modelo', 5, 'zonas')] },
  'V074-08': { claim: 'A maioria das pessoas tem uma agenda e não pode passar 3 horas na academia todo dia.', params: [hrs('duracao_treino', 3)] },
  'V078-02': { claim: 'Ele está na semana 6 de um ciclo de 12 semanas e só vai maxar no fim dele.', params: [sem('semana_corrente', 6), sem('duracao_ciclo', 12)] },
  'V078-08': { claim: 'Durante o cut ele dormiu pelo menos 7 e normalmente 8 horas por noite.', params: [hrs('sono_min', 7), hrs('sono_tipico', 8)] },
  'V078-09': { claim: 'Durante o cut ele manteve proteína muito alta, normalmente na faixa de 250 a 280 gramas por dia.', params: [g('proteina_min', 250), g('proteina_max', 280)] },
  'V079-05': { claim: 'Só existe um estudo de verdade que olhou variáveis de treino de powerlifters e a associação delas com lesão, com amostra de 1900.', params: [P('n_amostra', 1900, 'pessoas', 'n_amostra')] },
  'V079-34': { claim: 'Anedoticamente, ele achou que um nível de dor de 2 a 3 numa escala de 10 é uma boa faixa para empurrar na reabilitação, ajustando ao que faz os sintomas melhorarem com o tempo.', params: [P('dor_min', 2, 'escala 0-10', 'escala_dor'), P('dor_max', 3, 'escala 0-10', 'escala_dor'), P('escala_max', 10, 'escala 0-10', 'escala_dor')] },
  'V080-18': { claim: 'O palpite educado dele é que, com proteína, sono e gordura corporal em ordem, dá para sustentar um déficit de pelo menos 1000 calorias.', params: [kcal('deficit_sustentavel', 1000)] },
  'V080-19': { claim: 'Ele mesmo está fazendo um déficit de 2000 calorias.', params: [kcal('deficit_proprio', 2000)] },
  'V080-31': { claim: 'A tendência de peso deve ser acompanhada por 2 semanas antes de qualquer ajuste, porque muita gente superajusta por causa de mudança de curto prazo de conteúdo intestinal e água.', params: [sem('janela_tendencia', 2)] },
  'V080-32': { claim: 'Para cuts ele indica rápido e curto, com déficits de 1000 a 2000 calorias conforme o que a pessoa aguenta e quanto tem para perder.', params: [kcal('deficit_min', 1000), kcal('deficit_max', 2000)] },
  'V081-04': { claim: 'Em 2 dos 3 movimentos o progresso do ciclo não foi bom.', params: [cnt('movimentos_ruins', 2, 'movimentos'), cnt('movimentos_total', 3, 'movimentos')] },
  'V081-19': { claim: 'Ele fez o último treino 3 dias antes do meet por causa da viagem, mas rende melhor com 2 dias.', params: [dias('antecedencia_real', 3), dias('antecedencia_preferida', 2)] },
  'V081-23': { claim: 'Ele está comendo cerca de 2000 calorias a menos por dia.', params: [kcal('deficit_proprio', 2000)] },
  'V083-05': { claim: 'O pico pode não ter sido o melhor porque ficaram 3 dias entre a última sessão e o dia do meet, quando ele costuma usar 2.', params: [dias('antecedencia_real', 3), dias('antecedencia_preferida', 2)] },
  'V085-09': { claim: 'Faça um dia bem leve 2 ou 3 dias antes e continue se movimentando leve.', params: [dias('antecedencia_min', 2), dias('antecedencia_max', 3)] },
  'V085-21': { claim: 'Ele vai tentar mais um título de campeão nacional, e já tem 3.', params: [cnt('titulos_nacionais', 3, 'títulos')] },
  'V087-01': { claim: 'Ele fez o primeiro single pesado de supino desde o dia de máximo, há mais de 2 meses, e foi muito bem.', params: [mes('intervalo_sem_single', 2)] },
  'V087-09': { claim: 'O primeiro single depois de 2,5 meses sem nenhum não deu sensação estranha com peso pesado.', params: [mes('intervalo_sem_single', 2.5)] },
  'V087-20': { claim: 'A 2 semanas do Nationals ele começa um taper no fim daquela semana, e parte do trabalho de acessórios já foi cortada do programa.', params: [sem('semanas_ate_meet', 2)] },
  'V153-04': { claim: 'Ele sabia que seria uma disputa apertada com outros 2 competidores e que precisaria acertar todas as tentativas para vencer.', params: [cnt('n_concorrentes', 2, 'pessoas')] },
  'V153-28': { claim: 'Ele considera não ideal fazer 2 competições seguidas dentro de um mês, mas aceitou a situação.', params: [cnt('n_meets', 2, 'competições')] },
  'V155-12': { claim: 'As pessoas se dividem em 2 grupos: para umas arredondar é ganho líquido, para outras não.', params: [cnt('n_grupos', 2, 'grupos')] },
};

const seen = new Set();
for (const file of readdirSync(D).filter((f) => f.endsWith('.jsonl')).sort()) {
  if (file === 'F001.jsonl') continue;
  const path = D + file;
  const lines = readFileSync(path, 'utf8').split('\n');
  let dirty = false;
  const out = lines.map((line) => {
    if (!line.trim()) return line;
    const c = JSON.parse(line);
    const p = PATCH[c.id];
    if (!p) return line;
    seen.add(c.id);
    c.claim = p.claim;
    c.params = p.params;
    dirty = true;
    return JSON.stringify(c);
  });
  if (dirty) writeFileSync(path, out.join('\n'));
}
const missing = Object.keys(PATCH).filter((k) => !seen.has(k));
console.log(`aplicados: ${seen.size}/${Object.keys(PATCH).length}`);
if (missing.length) console.log('NÃO ENCONTRADOS:', missing.join(', '));
