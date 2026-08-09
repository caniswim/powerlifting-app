from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["frequencia","agacho","terra"],
  claim="No programa do Candito você agacha e puxa duas vezes por semana na maior parte do tempo.",
  verbatim="basically most of the time you're going to have squat and Deads twice a week",
  params=[P("frequencia",2,"x/semana","x_semana")]))

A(dict(at="00:00", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="O programa toma a teoria da periodização em blocos e trata cada semana como se fosse uma onda própria.",
  verbatim="it's kind of taking the theory of block periodization each week is kind of considered its own wave"))

A(dict(at="00:00", scope="GERAL", modo="opiniao", topic=["volume","taper","pico"],
  claim="Não há muito estresse total nesse programa, especialmente na quinta semana.",
  verbatim="there's not a ton of total stress especially here in the fifth week"))

A(dict(at="02:17", scope="GERAL", modo="fato", topic=["agacho","terra","selecao-exercicio"],
  claim="Candito diz no PDF que agacho e terra bastam para taxar todo o inferior e que não precisa acrescentar exercícios.",
  verbatim="Johnny says in his PDF basically he sticks with the squat and the Deads he finds that that's enough to tax all of his lower body he doesn't need to add additional exercises"))

A(dict(at="02:33", scope="GERAL", modo="fato", topic=["acessorios","series-reps","pernas"],
  claim="A variante explosiva opcional para inferiores é de 3 séries de 4 repetições.",
  verbatim="you're going to do three sets if it's explosive if it's jumps if it's that sort of stuff you're going to do four reps per set for all three uh of the sets",
  params=[P("series",3,"séries","series"),P("reps",4,"reps","reps")]))

A(dict(at="02:48", scope="GERAL", modo="fato", topic=["acessorios","hipertrofia","series-reps"],
  claim="A variante de hipertrofia opcional é de 3 séries de 8 a 12, feita duas vezes por semana.",
  verbatim="hypertrophy is going to be for your standard three sets at 8 to 12 again you're hitting that up twice a week",
  params=[P("series",3,"séries","series"),P("reps_min",8,"reps","reps"),P("reps_max",12,"reps","reps"),P("frequencia",2,"x/semana","x_semana")]))

A(dict(at="03:34", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="Por ser um programa de 6 semanas voltado ao intermediário, não há tempo para blocos separados, e cada semana vira uma onda.",
  verbatim="well this is a six- we program geared towards intermediate so there's not this time for all these different blocks or all these waves instead each week is kind of considered",
  params=[P("duracao",6,"semanas","semanas")]))

A(dict(at="03:49", scope="GERAL", modo="fato", topic=["periodizacao","intensidade"],
  claim="As duas primeiras semanas são de condicionamento muscular, a primeira com intensidades um pouco mais baixas.",
  verbatim="you've got muscular conditioning for the first two weeks the first one is uh medium level muscular conditioning where the intensities are a little lower",
  params=[P("semanas_de_condicionamento",2,"semanas","semanas")]))

A(dict(at="04:05", scope="GERAL", modo="fato", topic=["periodizacao","intensidade","hipertrofia"],
  claim="A terceira fase é o linear max OT, ou overload training, que faz a ponte do trabalho de volume para os pesos pesados.",
  verbatim="what he calls linear Max OT it's overload training and this is basically getting you ready and starting to bridge the gap from the hypertrophy or the more volume based work"))

A(dict(at="04:20", scope="GERAL", modo="fato", topic=["periodizacao","volume","intensidade"],
  claim="Depois vem uma semana de aclimatação a peso pesado e então uma redução pesada de volume na semana de força de alta intensidade.",
  verbatim="it moves into a weight heavyweight acclimation and then a pretty heavy volume reduction in the high-intensity strength week"))

A(dict(at="04:20", scope="GERAL", modo="fato", topic=["deload","teste-de-forca","periodizacao"],
  claim="A sexta semana pode voltar para a primeira com os máximos atualizados, ser um deload seguido de repetição, ou ser a semana de teste.",
  verbatim="week six could just rotate back into week one use your updated Maxes from the max tests uh figure out what your for rep Maxes or however many reps you accomplish and you just run back into it you could deload and then repeat"))

A(dict(at="04:50", scope="GERAL", modo="fato", topic=["volume","agacho","terra"],
  claim="Há mais séries de agacho do que de terra no programa, o que é comum em muitos programas.",
  verbatim="you're going to have more sets of squatting than you are deadlifting as you see here that's common in many programs"))

A(dict(at="04:50", scope="GERAL", modo="fato", topic=["terra","fadiga","volume"],
  claim="O terra é muito fatigante, então muita gente foge desse volume e passa mais tempo agachando.",
  verbatim="it's basically the same thing where deadlifts are very fatiguing so a lot of people stay away from that volume they spend more time with squatting"))

A(dict(at="05:35", scope="GERAL", modo="fato", topic=["autorregulacao","series-reps","progressao"],
  claim="No Candito o número de séries de back-off depende do resultado do teste de repetições: podem ser 10, 8, 5 ou nenhuma série de 3 com 10 lb a menos.",
  verbatim="depending on the number of reps that you get on that test you're either going to do 10 triples that's 10 sets yeah 10 sets of three or eight sets of three or five sets of three or no sets of three with 10 pounds less",
  params=[P("series_opcao_alta",10,"séries","series"),P("series_opcao_media",8,"séries","series"),P("series_opcao_baixa",5,"séries","series"),P("reps",3,"reps","reps"),P("reducao_carga",10,"lb","lb")]))

A(dict(at="06:06", scope="GERAL", modo="prescricao", topic=["terra","rpe","selecao-exercicio"],
  claim="Na variação de terra você precisa sentir o quanto ir pesado, numa faixa de RPE 7 a 8.",
  verbatim="it could be like kind of that RP 7 to8 range for what you do there",
  params=[P("rpe_min",7,"RPE","RPE"),P("rpe_max",8,"RPE","RPE")]))

A(dict(at="06:06", scope="GERAL", modo="opiniao", topic=["terra","frequencia","erro-comum"],
  claim="Existe hoje nas comunidades um medo de puxar terra e de puxar com frequência.",
  verbatim="there's a fear of deadlifting and deadlifting too frequently out there in the communities today"))

A(dict(at="06:21", scope="GERAL", modo="fato", topic=["erro-comum","intensidade","progressao"],
  claim="Um erro comum de quem lê a planilha é achar que a segunda semana é 80% quando na verdade é 80% mais 5 lb.",
  verbatim="when he talks about 80% Max reps on this day squat 2 on week 2 it's 80% plus 5 lbs",
  params=[P("intensidade",80,"% do 1RM","pct_1RM"),P("acrescimo",5,"lb","lb")]))

A(dict(at="06:36", scope="GERAL", modo="opiniao", topic=["progressao","programacao"],
  claim="Há uma sobrecarga progressiva bem leve embutida dentro da semana, o que ele considera raro e cuidadoso.",
  verbatim="there is a very slight Progressive overload built into this week which is kind of interesting I don't see that a lot"))

A(dict(at="06:51", scope="GERAL", modo="fato", topic=["intensidade","series-reps"],
  claim="Na terceira semana são 85% mais 5 lb para 3 séries de 4 a 6 repetições, um dia pesado.",
  verbatim="you've got 85% plus 5 lb for three sets of four to six reps that's going to be a heavy day",
  params=[P("intensidade",85,"% do 1RM","pct_1RM"),P("acrescimo",5,"lb","lb"),P("series",3,"séries","series"),P("reps_min",4,"reps","reps"),P("reps_max",6,"reps","reps")]))

A(dict(at="07:06", scope="GERAL", modo="fato", topic=["intensidade","fadiga"],
  claim="Depois vêm 2 séries a quase 90%, que começam a taxar de verdade o sistema nervoso central e a acumular fadiga.",
  verbatim="following that up you got 87 1.2% two sets less sets but still a lot of heavy work at almost 90% it's is going to start to really tax CNS",
  params=[P("series",2,"séries","series"),P("intensidade",90,"% do 1RM","pct_1RM")],
  suspect=True, suspectWhy="numero"))

A(dict(at="07:21", scope="GERAL", modo="fato", topic=["intensidade","series-reps"],
  claim="Na sequência vem 85% mais 10 lb para 1 série.",
  verbatim="then you move into 85 plus 10 lbs for one set",
  params=[P("intensidade",85,"% do 1RM","pct_1RM"),P("acrescimo",10,"lb","lb"),P("series",1,"séries","series")]))

A(dict(at="07:36", scope="GERAL", modo="fato", topic=["intensidade","periodizacao"],
  claim="O foco dessa semana é se acostumar a trabalhar em ou acima de 85% do máximo.",
  verbatim="this week's focus is really about getting used to that heavy weight getting above at or at 855 or above for your percentage",
  params=[P("intensidade_alvo",85,"% do 1RM","pct_1RM")],
  suspect=True, suspectWhy="numero"))

A(dict(at="07:36", scope="GERAL", modo="fato", topic=["intensidade","series-reps"],
  claim="Na quarta semana são 90% menos 5 lb, 90% e 90% mais 5 lb, todos para triplas.",
  verbatim="so 90% minus 5 lb 90% And then 90 plus 5 all for",
  params=[P("intensidade",90,"% do 1RM","pct_1RM"),P("ajuste_carga",5,"lb","lb"),P("reps",3,"reps","reps")]))

A(dict(at="07:51", scope="GERAL", modo="fato", topic=["terra","intensidade"],
  claim="No terra há um desvio: 90% mais 5 lb e depois 95%, a maior porcentagem antes da semana de teste.",
  verbatim="there's a slight deviation here where you're doing 90 plus 5 and then 95% the highest percentage that you're going to see",
  params=[P("intensidade_base",90,"% do 1RM","pct_1RM"),P("acrescimo",5,"lb","lb"),P("intensidade_maxima",95,"% do 1RM","pct_1RM")]))

A(dict(at="08:06", scope="GERAL", modo="fato", topic=["volume","intensidade","fadiga"],
  claim="É uma semana muito pesada, com volume baixo em repetições totais mas ainda muito taxante para o sistema nervoso central.",
  verbatim="this is a really heavy week it's pretty low volume in terms of the total reps that you're doing but still very taxing on the CNS"))

A(dict(at="08:22", scope="GERAL", modo="fato", topic=["intensidade","teste-de-forca"],
  claim="Na quinta semana você sobe a 97.5% para 1 série buscando 4 repetições.",
  verbatim="you're working up to 97.5% for one set of hopefully four get a four rep max with 97.5%",
  params=[P("intensidade",97.5,"% do 1RM","pct_1RM"),P("series",1,"séries","series"),P("reps",4,"reps","reps")]))

A(dict(at="08:37", scope="GERAL", modo="fato", topic=["terra","aprendizado-motor","recuperacao"],
  claim="No terra dessa semana há um pouco de volume de recuperação ativa, com repetições e intensidades muito baixas, só para manter a aquisição de habilidade.",
  verbatim="very low rep ranges with very low intensities this is really just to keep your skill acquisition up"))

A(dict(at="08:52", scope="GERAL", modo="opiniao", topic=["taper","pico","erro-comum"],
  claim="A principal objeção dele é que fazer um agacho pesadíssimo como único agacho da semana e só competir no sábado seguinte é muito tempo para destreinar.",
  verbatim="if you're going to use the sixth week as a test week and it's not like till Saturday that you're actually going to go in and have your meet this is a long time to detrain"))

A(dict(at="09:07", scope="GERAL", modo="prescricao", topic=["taper","aprendizado-motor","competicao"],
  claim="Mesmo na semana de teste você deve ter alguns toques leves, para não destreinar e não perder a habilidade.",
  verbatim="you should have some touches you should make sure that you don't detrain and lose your skill"))

A(dict(at="09:07", scope="GERAL", modo="opiniao", topic=["taper","recuperacao","competicao"],
  claim="Para a maioria dos intermediários, ficar da segunda até o meet do sábado seguinte sem outro agacho pesado é tempo demais, e provavelmente eles não precisam de tanta recuperação.",
  verbatim="and for most intermediates to hit something like this on a Monday and then not have another heavy squat all the way till a meet on a Saturday the next week that's a long time you probably don't need that much recovery"))

A(dict(at="09:22", scope="GERAL", modo="opiniao", topic=["taper","recuperacao","peso-corporal"],
  claim="Para quem agacha na casa de 700 lb, esse tanto de recuperação antes do meet pode de fato ser apropriado.",
  verbatim="now if you're squatting like 6 or 700 lb sure that could definitely be appropriate",
  params=[P("carga_de_referencia",700,"lb","lb")]))

A(dict(at="09:22", scope="PESSOAL", modo="opiniao", topic=["taper","pico","competicao"],
  claim="Escalar o taper e garantir que o pico caia no lugar certo é algo em que ele investe muito tempo pensando.",
  verbatim="but scaling your taper and and making sure your Peak lines up properly is something that I take a lot of time to think about"))

A(dict(at="09:52", scope="GERAL", modo="prescricao", topic=["terra","agacho","taper","recuperacao"],
  claim="A recomendação dele é inverter os dias de agacho e de terra na quinta semana, porque o terra parece demorar mais para recuperar.",
  verbatim="I would flip-flop those at the very first cuz deadlift does seem to take a little bit longer to cover from"))

A(dict(at="10:07", scope="GERAL", modo="fato", topic=["meta-metodologia","rpe","volume"],
  claim="No stress index uma unidade de estresse equivale a cerca de uma série dura, feita em RPE 8 a 9 ou com 1 a 2 repetições em reserva.",
  verbatim="one unit of stress equals about one hard set think about like if you're doing one set at rpe 8 to9",
  params=[P("rpe_min",8,"RPE","RPE"),P("rpe_max",9,"RPE","RPE"),P("rir_min",1,"RIR","RIR"),P("rir_max",2,"RIR","RIR")]))

A(dict(at="10:53", scope="GERAL", modo="fato", topic=["volume","meta-metodologia"],
  claim="No Candito a média semanal fica em cerca de 6 unidades de estresse para o agacho e 4 para o terra, somando 10 por semana para o inferior.",
  verbatim="an a average of about six and four for the weekly stress of squat and deadlift respectively throughout the program which is obviously 10 total stress average per week",
  params=[P("estresse_agacho",6,"unidades de estresse/semana","contagem"),P("estresse_terra",4,"unidades de estresse/semana","contagem"),P("estresse_total",10,"unidades de estresse/semana","contagem")]))

A(dict(at="11:09", scope="GERAL", modo="fato", topic=["volume","meta-metodologia","programacao"],
  claim="No programa do Wendler os números equivalentes são 5.5 para cada um, totalizando 11 por semana.",
  verbatim="if you compare this with 531 it's going to be 5 and a half 5 1/2 with uh a total obviously of 11",
  params=[P("estresse_por_levantamento",5.5,"unidades de estresse/semana","contagem"),P("estresse_total",11,"unidades de estresse/semana","contagem")]))

A(dict(at="11:24", scope="GERAL", modo="fato", topic=["volume","meta-metodologia"],
  claim="No Texas Method dá 5.5 e 6 se você contar os power cleans com estresse equivalente, mas ele acha que talvez devesse ser mais perto de 3, porque o levantamento olímpico não taxa da mesma forma.",
  verbatim="Texas Method you've got 5.5 and six if you count the power cleans or the snatches with equal stress and honestly you might want to reduce that it's probably maybe even more like three",
  params=[P("estresse_agacho",5.5,"unidades de estresse/semana","contagem"),P("estresse_contando_olimpicos",6,"unidades de estresse/semana","contagem"),P("estresse_corrigido",3,"unidades de estresse/semana","contagem")]))

A(dict(at="11:39", scope="GERAL", modo="fato", topic=["meta-metodologia"],
  claim="O stress index ainda está em construção e Mike Tuchscherer vem trabalhando duro para quantificar essas séries de estresse.",
  verbatim="the stress index is still you know it's still under uh construction"))

A(dict(at="11:54", scope="GERAL", modo="fato", topic=["volume","frequencia","programacao"],
  claim="O Starting Strength tem estresse mais alto, por causa da frequência alta e do fato de você ir grindando trabalho pesado.",
  verbatim="starting strength is going to be higher stress you have such high frequency there and you're also going to be really grinding through some pretty heavy work"))

A(dict(at="12:10", scope="GERAL", modo="fato", topic=["terra","agacho","volume"],
  claim="No StrongLifts o estresse vai de 1.5 no terra a 10.5 no agacho, o que mostra o medo de terra presente ali.",
  verbatim="strong lifts oh my gosh 1.5 to 10.5 just the fear of deadlifts is present there",
  params=[P("estresse_terra",1.5,"unidades de estresse/semana","contagem"),P("estresse_agacho",10.5,"unidades de estresse/semana","contagem")]))

A(dict(at="12:10", scope="GERAL", modo="fato", topic=["terra","progressao","volume"],
  claim="Em muitos programas de progressão linear o terra vai sendo puxado para fora enquanto o agacho é mantido constante.",
  verbatim="and that's something you see in a lot of those linear progression programs as deadlift slowly gets pulled out as you keep the squatting"))

A(dict(at="12:25", scope="GERAL", modo="opiniao", topic=["volume","programacao"],
  claim="O estresse total do Candito é comparável ou menor do que o de outros programas de novato ou intermediário.",
  verbatim="it's very comparable or lower to other novice or intermediate programs"))

A(dict(at="12:40", scope="GERAL", modo="opiniao", topic=["volume","taper","periodizacao"],
  claim="Boa parte do peso do estresse está nas semanas iniciais e ele cai muito no fim do programa.",
  verbatim="a lot of the waiting of the stress is earlier in the weeks it really drops off"))

A(dict(at="12:40", scope="GERAL", modo="opiniao", topic=["taper","competicao","erro-comum"],
  claim="A preocupação dele é destreino entrando no teste: você pode ter um ótimo ciclo e falhar na competição por não ter mantido a carga de trabalho alta na parte final.",
  verbatim="my concern is about dra trining going into the test you might have a great training cycle and then fall flat at the meat because you haven't been keeping the workload high enough throughout that final part"))

A(dict(at="12:55", scope="GERAL", modo="prescricao", topic=["taper","volume","pico"],
  claim="Ele diz que a carga de trabalho na parte final precisa ser aumentada, não derrubada.",
  verbatim="you really want to chip that up"))

A(dict(at="12:55", scope="GERAL", modo="opiniao", topic=["periodizacao","programacao","progressao"],
  claim="Fora essa objeção, ele gosta da progressão e a considera uma boa ponte de um programa de novato para um macrociclo periodizado em blocos.",
  verbatim="I really like the overall progression I think this is a great way to get your feet wet and stair step in from a novice program into something approaching a normal block periodized macro cycle"))

emit("G005", c)
