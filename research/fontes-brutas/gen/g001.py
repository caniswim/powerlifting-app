from common import P, emit

c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="mecanismo", topic=["volume","hipertrofia"],
  claim="Manter o músculo já construído custa cerca de 5 séries semanais, contra cerca de 20 séries semanais para construí-lo.",
  verbatim="if it takes me 20 sets a week to grow muscle, but it takes me five sets a week to maintain the muscle I've already grown",
  params=[P("series_para_crescer",20,"séries/semana","series"),P("series_para_manter",5,"séries/semana","series")]))

A(dict(at="00:16", scope="PESSOAL", modo="fato", topic=["programacao","meta-metodologia"],
  claim="O Genesis é o programa de powerlifting mais novo do Evolve e só agora se tornou público.",
  verbatim="It's the newest powerlifting program you've probably never heard of because it is just now coming public"))

A(dict(at="00:31", scope="PESSOAL", modo="fato", topic=["programacao","meta-metodologia"],
  claim="Ele desenvolveu o motor de coaching Genesis com Zach Robinson e Josh Peland, além da equipe do Evolve.",
  verbatim="very fortunate to be working with Dr. Zach Robinson and Josh Peland as well as continuing on the team Kristen Dunore here at Evolve as we are bringing forward a new powerlifting coaching engine"))

A(dict(at="01:17", scope="PESSOAL", modo="narrativa", topic=["programacao","meta-metodologia"],
  claim="Ele passou os últimos 6 meses codificando o conhecimento de coaching deles num sistema especialista.",
  verbatim="code that into an expert system over the last 6 months has just been a wild ride",
  params=[P("duracao_desenvolvimento",6,"meses","meses")]))

A(dict(at="01:32", scope="GERAL", modo="opiniao", topic=["programacao","meta-metodologia"],
  claim="O Genesis não é uma combinação mágica de séries, repetições e intensidade, e sim princípios aplicados a blocos e protocolos.",
  verbatim="because it's not just a like this is the magic set rep intensity combination. Instead, this is principles that are applied to various blocks and training protocols"))

A(dict(at="02:18", scope="GERAL", modo="fato", topic=["periodizacao","capacidade-trabalho"],
  claim="O motor Genesis acrescentou blocos de capacidade de trabalho ao sistema.",
  verbatim="one of the cool things that's been added to the Evolve ecosystem with the Genesis engine is work capacity blocks"))

A(dict(at="02:18", scope="GERAL", modo="mecanismo", topic=["capacidade-trabalho","recuperacao","periodizacao"],
  claim="O bloco de capacidade de trabalho serve para você prosperar nos blocos de força e recuperar semana a semana do trabalho pesado.",
  verbatim="What it's going to do is it's going to allow you to really thrive in your strength blocks and recover week to week from the heavy work because you have really established the foundation to work from"))

A(dict(at="02:34", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","condicionamento"],
  claim="O powerlifter não precisa ir com tudo em capacidade de trabalho nem virar atleta de CrossFit Games.",
  verbatim="You don't need to be doing a bunch of stuff to make you a CrossFit Games athlete. You don't need to go full force into work capacity"))

A(dict(at="02:49", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","selecao-exercicio","periodizacao"],
  claim="Mesmo no bloco de capacidade de trabalho, o dia principal de força mantém o levantamento de competição.",
  verbatim="the first thing is for your main strength day, you're still going to do the competition lift even in work capacity"))

A(dict(at="03:04", scope="GERAL", modo="opiniao", topic=["series-reps","programacao"],
  claim="Ele avisa que a repetição prescrita não é mágica e que o sistema pode dar faixas vizinhas dependendo do ponto do macrociclo.",
  verbatim="don't think that it's a magic rep and you have to do it at fives and not sixes or fours"))

A(dict(at="03:20", scope="GERAL", modo="prescricao", topic=["intensidade","rpe","capacidade-trabalho"],
  claim="No bloco de capacidade de trabalho o levantamento pesado fica em torno de 70 a 75% do 1RM, com alvo de RPE 6.",
  verbatim="it's going to be with you know maybe 70 to 75% of your one rep max and that might because it is an RP based target of usually RP6 for a work",
  params=[P("intensidade_min",70,"% do 1RM","pct_1RM"),P("intensidade_max",75,"% do 1RM","pct_1RM"),P("rpe_alvo",6,"RPE","RPE")]))

A(dict(at="03:35", scope="GERAL", modo="prescricao", topic=["progressao","capacidade-trabalho","programacao"],
  claim="O slot do movimento principal não deve subir semana a semana no bloco de capacidade de trabalho: é progressão plana.",
  verbatim="the point is not to increase that particular slot for your main squat bench and deadlift movement week to week. It's a flat progression"))

A(dict(at="03:35", scope="GERAL", modo="prescricao", topic=["rpe","capacidade-trabalho"],
  claim="O alvo é RPE 6 em todas as semanas do bloco de capacidade de trabalho.",
  verbatim="That means that you're doing RP6 as your target for every week of work capacity",
  params=[P("rpe_alvo",6,"RPE","RPE")]))

A(dict(at="03:50", scope="GERAL", modo="mecanismo", topic=["progressao","agacho"],
  claim="No exemplo dele, um levantador levou 16 semanas para subir 10 lb no agacho, indo de 315 para 325 lb.",
  verbatim="let's say it took you um 16 weeks to increase your squat by 10 lbs and you went from squatting 315 to 325",
  params=[P("duracao",16,"semanas","semanas"),P("ganho",10,"lb","lb"),P("carga_inicial",315,"lb","lb"),P("carga_final",325,"lb","lb")]))

A(dict(at="04:06", scope="GERAL", modo="mecanismo", topic=["capacidade-trabalho","selecao-exercicio","progressao"],
  claim="Se você parar de agachar por completo no bloco de capacidade de trabalho, o seu máximo não vai mais ser 325 lb quando voltar.",
  verbatim="If you completely stop squatting and you move into a work capacity block and all you're doing is sled drags and sets of 20 and you're not even doing competition squat, when you come back to you to squat, your max is no longer going to be 325",
  params=[P("reps_trabalho_generico",20,"reps","reps"),P("carga_perdida",325,"lb","lb")]))

A(dict(at="04:06", scope="GERAL", modo="mecanismo", topic=["aprendizado-motor","capacidade-trabalho","intensidade"],
  claim="A perda vem tanto da proficiência técnica no padrão de movimento quanto da capacidade de tolerar peso pesado.",
  verbatim="You'll have drained in the technical proficiency of the movement pattern as well as just your ability to tolerate heavy weights because you've been using lighter weights for lots of reps"))

A(dict(at="04:21", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","selecao-exercicio","periodizacao"],
  claim="Deixar um único slot semiespecífico no bloco já mantém as qualidades desenvolvidas.",
  verbatim="But if you just leave one slot that's semi-specific, you can maintain the qualities that you've developed all that time"))

A(dict(at="04:21", scope="GERAL", modo="mecanismo", topic=["capacidade-trabalho","progressao"],
  claim="Sem isso você gasta de 4 a 6 semanas rastejando de volta para onde já poderia estar.",
  verbatim="slowly crawl your way over four to six weeks to get back to where you could have been if you had just left a little bit of heavy training in your program",
  params=[P("semanas_perdidas_min",4,"semanas","semanas"),P("semanas_perdidas_max",6,"semanas","semanas")]))

A(dict(at="04:36", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","series-reps"],
  claim="O trabalho pesado do bloco de capacidade de trabalho é feito em séries de 5 e não progride semana a semana.",
  verbatim="So work capacity blocks are still going to have heavy work in them, usually sets of five, but it's not going to be progressed week to week",
  params=[P("reps_trabalho_pesado",5,"reps","reps")]))

A(dict(at="04:51", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","selecao-exercicio","hipertrofia"],
  claim="O foco do bloco de capacidade de trabalho passa a ser repetições mais altas em exercícios ainda desafiadores e menos específicos.",
  verbatim="The focus instead is going to be on increased higher reps with still challenging uh exercises. They're going to be less specific than they'll be in future blocks"))

A(dict(at="04:51", scope="GERAL", modo="prescricao", topic=["selecao-exercicio","agacho","barra-alta"],
  claim="Os exercícios menos específicos do bloco podem ser agacho barra alta, safety squat bar, belt squat ou hack squat.",
  verbatim="so you might be doing high bar squat or safety squat bar squat or belt squats or hack squats"))

A(dict(at="05:06", scope="GERAL", modo="prescricao", topic=["series-reps","capacidade-trabalho","hipertrofia"],
  claim="Nesses exercícios você usa faixas de 8 a 12 repetições.",
  verbatim="Now you are going to be using higher rep ranges for those even very specific exercises. Think like 8 to 12",
  params=[P("reps_min",8,"reps","reps"),P("reps_max",12,"reps","reps")]))

A(dict(at="05:06", scope="GERAL", modo="prescricao", topic=["series-reps","capacidade-trabalho"],
  claim="Pelo menos um desses exercícios vai terminar num AMRAP.",
  verbatim="and probably on at least one of those going to an AM wrap. Now with the heavier compound movements"))

A(dict(at="05:21", scope="GERAL", modo="prescricao", topic=["rpe","hipertrofia","series-reps"],
  claim="Nos compostos mais pesados o AMRAP não é máximo: é levado até RPE 9, deixando 1 repetição na reserva.",
  verbatim="the AM wrap will probably be not maximal. That is like an AM wrap to RP9. So, you still leave one rep in the tank, but you really push it",
  params=[P("rpe_amrap",9,"RPE","RPE"),P("rir_amrap",1,"RIR","RIR")]))

A(dict(at="05:21", scope="GERAL", modo="mecanismo", topic=["hipertrofia","rpe"],
  claim="Proximidade da falha é muito importante para crescer músculo.",
  verbatim="proximity to failure is very important for growing muscle"))

A(dict(at="05:36", scope="GERAL", modo="prescricao", topic=["capacidade-trabalho","progressao"],
  claim="No bloco de capacidade de trabalho a meta semanal é a sessão ficar mais fácil, e não adicionar peso à barra.",
  verbatim="even though you're not trying to add weight to the bar, you're trying to have the workouts be easier"))

A(dict(at="05:51", scope="GERAL", modo="mecanismo", topic=["capacidade-trabalho","fadiga"],
  claim="Voltar para um bloco de capacidade de trabalho depois de força e pico é brutal, mas em 2 semanas fica bem mais fácil.",
  verbatim="these can be brutal. But two weeks in, all of a sudden, things start to get a lot easier",
  params=[P("tempo_ate_aliviar",2,"semanas","semanas")]))

A(dict(at="06:07", scope="GERAL", modo="prescricao", topic=["acessorios","series-reps","capacidade-trabalho"],
  claim="No bloco de capacidade de trabalho os acessórios ficam na faixa de 10 a 15 repetições.",
  verbatim="And those are going to be probably 10 to 15 reps at this point",
  params=[P("reps_min",10,"reps","reps"),P("reps_max",15,"reps","reps")]))

A(dict(at="06:37", scope="GERAL", modo="prescricao", topic=["acessorios","hipertrofia"],
  claim="Nos acessórios de isolamento os AMRAPs vão até a falha de verdade.",
  verbatim="And the AM wraps if there are if they are on those protocols will likely be all the way to failure"))

A(dict(at="06:37", scope="GERAL", modo="mecanismo", topic=["rpe","autorregulacao","aprendizado-motor"],
  claim="O AMRAP serve para você aprender como é a falha e calibrar se o RPE 8 que você acha que está fazendo é mesmo um RPE 8.",
  verbatim="this is to really help you understand what does failure feel like",
  params=[P("rpe_referencia",8,"RPE","RPE")]))

A(dict(at="06:52", scope="GERAL", modo="prescricao", topic=["recuperacao","fadiga","acessorios"],
  claim="Como o AMRAP tem demanda de recuperação alta, é preciso ser estratégico sobre quantas vezes usá-lo.",
  verbatim="but again, because there's so much recovery demand, you want to be strategic about how often you use them"))

A(dict(at="07:08", scope="GERAL", modo="prescricao", topic=["hipertrofia","series-reps","periodizacao"],
  claim="No bloco de hipertrofia o levantamento de competição continua presente, em 4 séries de 3 repetições.",
  verbatim="You're still going to get to do competition squat, bench, deadlift, four sets of three in a hypertrophy block",
  params=[P("series",4,"séries","series"),P("reps",3,"reps","reps")]))

A(dict(at="07:23", scope="GERAL", modo="prescricao", topic=["hipertrofia","series-reps","progressao"],
  claim="No bloco de hipertrofia entra um top set que precede as séries seguintes, com 3 repetições no top set e 3 nas de back-off.",
  verbatim="In a hypertrophy block, you will have a top set that precedes the following sets. But top set will be three reps, the back off will be three reps",
  params=[P("reps_top_set",3,"reps","reps"),P("reps_back_off",3,"reps","reps")]))

A(dict(at="07:38", scope="GERAL", modo="prescricao", topic=["hipertrofia","volume"],
  claim="No bloco de hipertrofia o objetivo é maximizar volume, aumentando duração e tempo sob tensão perto da falha.",
  verbatim="for hypertrophy again we want to maximize the volume. The whole point is to increase that duration and time under tension while being close to proximity to failure"))

A(dict(at="07:38", scope="GERAL", modo="prescricao", topic=["hipertrofia","progressao","intensidade"],
  claim="No bloco de hipertrofia a intensidade do top set progride um pouco semana a semana.",
  verbatim="And you are going to progress the intensity a little bit week to week most likely on that top set for your hypertrophy block"))

A(dict(at="07:53", scope="GERAL", modo="prescricao", topic=["hipertrofia","series-reps","acessorios"],
  claim="Os compostos acessórios pesados caem da faixa de 8 a 12 do bloco de capacidade para 6 a 10 no de hipertrofia.",
  verbatim="you might be going from 8 to 12 what you were doing in work capacity down to 6 through 10 in hypertrophy",
  params=[P("reps_capacidade_min",8,"reps","reps"),P("reps_capacidade_max",12,"reps","reps"),P("reps_hipertrofia_min",6,"reps","reps"),P("reps_hipertrofia_max",10,"reps","reps")]))

A(dict(at="08:08", scope="GERAL", modo="prescricao", topic=["hipertrofia","series-reps","acessorios"],
  claim="Os movimentos de isolamento caem de 10 a 15 repetições para 8 a 12 no bloco de hipertrofia.",
  verbatim="those are going to be coming down from 10 to 15 down to 8 to 12",
  params=[P("reps_antes_min",10,"reps","reps"),P("reps_antes_max",15,"reps","reps"),P("reps_depois_min",8,"reps","reps"),P("reps_depois_max",12,"reps","reps")]))

A(dict(at="08:23", scope="GERAL", modo="mecanismo", topic=["hipertrofia","volume","rpe"],
  claim="A proximidade da falha e o número de séries levadas perto da falha impactam massivamente a hipertrofia obtida no bloco.",
  verbatim="The proximity to failure and the number of sets you can take to uh to failure or close to failure is going to massively impact the hypertrophy that you're going to get from the block"))

A(dict(at="08:38", scope="GERAL", modo="prescricao", topic=["recuperacao","volume","fadiga"],
  claim="É preciso prestar atenção à recuperação: não dá para ir com tudo em toda série.",
  verbatim="At the same time, you have to pay attention to recovery. You can't just go all out on every single set"))

A(dict(at="08:38", scope="GERAL", modo="mecanismo", topic=["volume","hipertrofia"],
  claim="Num exemplo hipotético dele, 4 séries de agacho renderiam 1 lb de músculo na perna e dobrar para 8 séries renderia 1.75 lb.",
  verbatim="let's say if you did four sets of squat or a squatting movement, you would gain one pound of muscle in your legs. But if you double that up to eight sets, you would get 1.75",
  params=[P("series_base",4,"séries","series"),P("ganho_base",1,"lb","lb"),P("series_dobro",8,"séries","series"),P("ganho_dobro",1.75,"lb","lb")]))

A(dict(at="09:09", scope="GERAL", modo="mecanismo", topic=["volume","hipertrofia"],
  claim="No mesmo exemplo, 16 séries só levariam o ganho a 2 lb de músculo.",
  verbatim="you might only go up to two pounds of muscle with 16",
  params=[P("series",16,"séries","series"),P("ganho",2,"lb","lb")]))

A(dict(at="09:09", scope="GERAL", modo="mecanismo", topic=["volume","hipertrofia","meta-metodologia"],
  claim="A lei dos retornos decrescentes aplicada à hipertrofia diz que cada série adicional é menos efetiva, mas não que ela deixe de produzir efeito.",
  verbatim="As you do more and more work, each set is less effective at producing the desired result. But it's not that it doesn't produce it"))

A(dict(at="09:24", scope="GERAL", modo="mecanismo", topic=["volume","deload","fadiga"],
  claim="Fazer 30 séries atrás de 2.1 lb de músculo não funciona na prática, porque esse volume força semanas de deload e longos períodos de overtraining.",
  verbatim="I'll do 30 sets and even if that's for 2.1, hey, that's 0.1 more. Well, it's probably not going to work that way because if you do that many sets and you're working super hard, there are going to be weeks where you have to de lo",
  params=[P("series",30,"séries","series"),P("ganho_hipotetico",2.1,"lb","lb"),P("ganho_marginal",0.1,"lb","lb")]))

A(dict(at="09:40", scope="GERAL", modo="mecanismo", topic=["volume","meta-metodologia"],
  claim="Na média de um ano de desenvolvimento você não termina com mais volume total do que teria com uma dose sustentável.",
  verbatim="when you average that out on a like looking at a whole year in long-term development, you are not going to actually end up with more total volume than you would have otherwise"))

A(dict(at="09:40", scope="GERAL", modo="prescricao", topic=["volume","hipertrofia","lesao"],
  claim="Se você tolera, aumente um pouco o volume no bloco de hipertrofia; se não tolera, faça o que for sustentável para não parar de treinar nem se lesionar.",
  verbatim="So if you can tolerate it in a hypertrophy block, yeah, pump the volume a little bit. But if you can't, do what you can that is sustainable so you don't have to take time away from training or get injured"))

A(dict(at="09:55", scope="GERAL", modo="estudo", topic=["hipertrofia","rpe","volume"],
  claim="Ele diz que os estudos mostram repetidamente que a proximidade da falha é melhor indicador da qualidade das séries.",
  verbatim="We have seen time and time again in studies that the proximity to failure is a better tell of the quality of those sets"))

A(dict(at="10:10", scope="GERAL", modo="mecanismo", topic=["hipertrofia","volume"],
  claim="É o número de séries de alta qualidade, e não o mesmo número de séries de baixa qualidade, que dirige a hipertrofia.",
  verbatim="it is the number of highquality sets over just or if you compare to the same number of lowquality sets that will drive hypertrophy"))

A(dict(at="11:11", scope="GERAL", modo="prescricao", topic=["intensidade","series-reps","pico"],
  claim="No bloco de força o movimento principal desce para singles no top set, e o mesmo vale no bloco de pico.",
  verbatim="So for a strength block, your main movement is going to move down to singles for your top set. That's going to be true in strength and peaking"))

A(dict(at="11:11", scope="GERAL", modo="opiniao", topic=["periodizacao","pico","taper"],
  claim="Força e pico podem ser considerados o mesmo bloco: a única diferença do pico é o taper que leva ao teste.",
  verbatim="you can effectively consider strength and peaking the same block. The only difference with peaking is that you're going to have a taper that then leads"))

A(dict(at="11:26", scope="GERAL", modo="opiniao", topic=["intensidade","periodizacao"],
  claim="Não há impedimento em ficar em singles por múltiplos blocos seguidos, e isso não significa que você vai drenar.",
  verbatim="There's no reason that you you can't be in singles for multiple blocks. That doesn't mean that you're going to drain"))

A(dict(at="11:41", scope="GERAL", modo="prescricao", topic=["intensidade","periodizacao","fadiga"],
  claim="Se tudo o que você faz é single, provavelmente não vai funcionar bem: você precisa passar períodos fora disso.",
  verbatim="Now, if all you ever do is singles, that's probably not going to work out too well. you do need to spend times out of it"))

A(dict(at="11:41", scope="GERAL", modo="opiniao", topic=["intensidade","periodizacao"],
  claim="Muita gente treina com singles o ano todo em algum ponto do bloco, e ele não considera isso necessário, ainda que não seja ruim.",
  verbatim="Lots of people train with singles year round um at some point in their block. I don't think that's necessary"))

A(dict(at="11:57", scope="GERAL", modo="prescricao", topic=["frequencia","series-reps","programacao"],
  claim="No bloco de força você tem 1 dia por semana com agacho, supino e terra de competição, com um single de top set e triplas de back-off.",
  verbatim="for strength, you're going to have one day per week with your competition squat, bench, and deadlift. And those are going to have a single for your top set with triples as the backoff",
  params=[P("frequencia_movimento_competicao",1,"dia/semana","x_semana"),P("reps_back_off",3,"reps","reps")]))

A(dict(at="11:57", scope="GERAL", modo="prescricao", topic=["rpe","progressao","intensidade"],
  claim="O single do bloco de força sobe de RPE semana a semana.",
  verbatim="The single is going to have an RP increase week to week"))

A(dict(at="11:57", scope="GERAL", modo="mecanismo", topic=["intensidade","pico"],
  claim="Blocos de força e de pico existem para expressar força, e isso exige produção máxima de força com movimentos específicos de competição progredidos semana a semana.",
  verbatim="the point of a strength block and a peaking block is to be able to display your strength and actually get stronger. That requires maximal force production"))

A(dict(at="12:27", scope="GERAL", modo="prescricao", topic=["progressao","meta-metodologia","teste-de-forca"],
  claim="O critério de sucesso de um bloco de força é progredir semana a semana ou pelo menos ter PRs em alguns levantamentos no fim do bloco.",
  verbatim="And the judge of a successful strength block is that you are progressing week to week in your strength or at least by the very end of that block you have some PRs"))

A(dict(at="12:42", scope="GERAL", modo="prescricao", topic=["series-reps","progressao","programacao"],
  claim="No bloco de força há também um slot secundário, normalmente com duplas, que também progride em intensidade.",
  verbatim="you're going to have a secondary movement usually with doubles that's also going to progress in intensity"))

A(dict(at="12:42", scope="GERAL", modo="prescricao", topic=["fadiga","recuperacao","hipertrofia"],
  claim="A demanda de recuperação extra do bloco de força é compensada raspando fora os AMRAPs.",
  verbatim="the way that we're going to offset those recovery demands is by scraping away the am wraps"))

A(dict(at="12:57", scope="GERAL", modo="prescricao", topic=["fadiga","programacao","recuperacao"],
  claim="No bloco de força há intencionalmente sessões mais fáceis do que poderiam ter sido, em que você teria conseguido mostrar mais se tivesse forçado.",
  verbatim="that means intentionally there are going to be sessions within your strength blocks that are easier than they could have been"))

A(dict(at="13:12", scope="GERAL", modo="prescricao", certainty="implied", topic=["acessorios","rpe","progressao"],
  claim="No bloco de força o acessório não progride: fica plano nas semanas, batendo em torno de RPE 7.",
  verbatim="the accessory work isn't going to progress. It's going to stay flat uh across the weeks. Just, you know, hit at seven with those exercises",
  params=[P("rpe_acessorio",7,"RPE","RPE")]))

A(dict(at="13:27", scope="GERAL", modo="prescricao", topic=["acessorios","recuperacao","selecao-exercicio"],
  claim="O objetivo do acessório no bloco de força não é progredir, e sim garantir que você esteja recuperado para os dias dos levantamentos específicos.",
  verbatim="the focus is to make sure you're recovered and ready for the days when you have your competition specific lifts"))

A(dict(at="13:43", scope="GERAL", modo="prescricao", topic=["periodizacao","hipertrofia","capacidade-trabalho"],
  claim="O macrociclo do Genesis encadeia bloco de capacidade de trabalho, bloco de hipertrofia e bloco de força/pico.",
  verbatim="that's the difference between a work capacity, hypertrophy or strength/ peaking block in the Genesis system",
  conflicts=["V111-16","V076-19"]))

A(dict(at="13:58", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele considera o Genesis um treino concorrente.",
  verbatim="It really is concurrent training though if you think about it"))

A(dict(at="13:58", scope="GERAL", modo="mecanismo", topic=["periodizacao","hipertrofia","capacidade-trabalho"],
  claim="Não existe um bloco perfeito que maximize capacidade de trabalho, hipertrofia e força ao mesmo tempo.",
  verbatim="it's not that you're training all the properties as though there's one perfect block that would maximize work capacity, hypertrophy, and strength all in one. No, that's not possible"))

A(dict(at="14:28", scope="GERAL", modo="prescricao", topic=["periodizacao","agacho","capacidade-trabalho"],
  claim="Ao entrar no bloco de capacidade de trabalho você não precisa apagar o agacho de competição do ciclo: ele só deixa de ser o foco.",
  verbatim="you don't have to completely erase that lift from your training cycle when you go into work capacity. You just don't make it the focus"))

A(dict(at="14:44", scope="GERAL", modo="prescricao", topic=["periodizacao","volume","meta-metodologia"],
  claim="Dá para manter uma qualidade baixando o foco dela de dez sobre dez para dois sobre dez, em vez de zerar.",
  verbatim="You can maintain the qualities by dialing something from maybe a 10 out of 10 focus to a 2 out of 10 focus instead of taking it to zero"))

A(dict(at="15:14", scope="GERAL", modo="fato", topic=["periodizacao","meta-metodologia"],
  claim="Segundo ele, Zach e Josh antes desprezavam os planos de treino plurianuais e hoje veem valor no treino concorrente de variáveis.",
  verbatim="They used to poo poo that, but now looking at it from a more nuanced lens of what we found out recently in research, they're realizing, oh, there's a lot of value to the concurrent training of variables"))

A(dict(at="15:44", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia","capacidade-trabalho"],
  claim="Pensar capacidade de trabalho, hipertrofia e força como um controle deslizante, e não como um interruptor de liga e desliga, é importante para produzir o melhor resultado.",
  verbatim="thinking of it more as a a mixture or a slider rather than an onoff switch with work capacity, hypertrophy, and strength is very important to produce the best training results"))

A(dict(at="15:59", scope="PESSOAL", modo="narrativa", topic=["periodizacao","capacidade-trabalho"],
  claim="Ele acabou de completar uma progressão de capacidade de trabalho, hipertrofia e força e vai voltar para capacidade de trabalho.",
  verbatim="I just finished through a work capacity hypertrophy strength progression. I'm about to head back into work capacity"))

A(dict(at="21:48", scope="GERAL", modo="opiniao", topic=["meta-metodologia","programacao"],
  claim="Zach e Josh não acreditam que exista um programa perfeito de bala de prata para todo mundo, e sim princípios governantes.",
  verbatim="they don't believe that there's one silver bullet perfect program for everybody. Instead, there's governing principles"))

A(dict(at="22:03", scope="GERAL", modo="opiniao", topic=["antropometria","programacao","equipamento"],
  claim="As mudanças que você vai querer fazer num bom programa são únicas da sua situação: comprimento de alavanca, preferências, tempo disponível e equipamento da academia.",
  verbatim="there are things you want to change that are unique to your situation, to your lever length, to your personal preferences, to your time that you have in the gym"))

A(dict(at="22:33", scope="PESSOAL", modo="narrativa", topic=["supino","teste-de-forca"],
  claim="Ele bateu 495 lb no supino no fim desse bloco de força, marca que não atingia havia anos e que acha ter batido umas 4 vezes na vida.",
  verbatim="I just hit 495 on bench uh at the end of this strength block, which I haven't hit that in years. I think I've maybe hit it like four times in my life",
  params=[P("carga_supino",495,"lb","lb"),P("vezes_na_vida",4,"vezes","contagem")]))

emit("G001", c)
