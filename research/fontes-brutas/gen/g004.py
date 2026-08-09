from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="opiniao", topic=["deload","meta-metodologia"],
  claim="Deload é um tema controverso e mal entendido, que gera muita discussão e confusão.",
  verbatim="a topic that is somewhat controversial misunderstood leads to a lot of arguments and a lot of confusion"))

A(dict(at="00:16", scope="GERAL", modo="fato", topic=["deload","meta-metodologia"],
  claim="Não existe uma definição única do que é um deload, nem nos estudos científicos nem na comunidade em geral.",
  verbatim="we don't have a single definition whether in scientific studies or just in the broader community of what makes a DLo"))

A(dict(at="00:16", scope="GERAL", modo="fato", topic=["deload","taper","meta-metodologia"],
  claim="Também não há distinção acordada entre deload e taper, nem entre deload e semana leve.",
  verbatim="what's the difference between a D Lo and a taper what's the difference between a DLo and a light week"))

A(dict(at="01:16", scope="GERAL", modo="opiniao", topic=["deload","autorregulacao"],
  claim="Ele acha que disparar o deload de forma reativa é provavelmente a melhor maneira de fazê-lo.",
  verbatim="I think triggering a d reactively is probably the best way to do it"))

A(dict(at="01:31", scope="GERAL", modo="fato", topic=["deload","periodizacao"],
  claim="O primeiro tipo é o deload planejado, e o programa do Jim Wendler é o exemplo clássico de deload pré-programado.",
  verbatim="we've got planned D Lo so if you're familiar with the program series that I've been putting out look at the 531 video this is a classic example of a pre-program"))

A(dict(at="01:47", scope="GERAL", modo="fato", topic=["deload","progressao"],
  claim="Wendler passou a dizer mais recentemente que talvez não se deva fazer deload em todos os ciclos iniciais, porque você começa com um training max mais baixo.",
  verbatim="Jim Wendler has put out more recently that maybe you shouldn't de load for all the beginning cycles and that's because you start with a lower training Max"))

A(dict(at="01:47", scope="GERAL", modo="mecanismo", topic=["deload","fadiga","progressao"],
  claim="As primeiras passagens pela onda de 3 semanas desse programa não batem tão forte, então pode não haver necessidade de deload.",
  verbatim="first few runs through that 3-week wave really doesn't hit you that hard so you might not need a de lo",
  params=[P("duracao_onda",3,"semanas","semanas")]))

A(dict(at="02:02", scope="GERAL", modo="fato", topic=["deload","periodizacao"],
  claim="Na versão normal do programa do Wendler você faz deload a cada quarta semana, pré-programado e fixo na estrutura.",
  verbatim="the normal version of 531 where you Deo every fourth week when you pre-program them and it's set in stone for the structure"))

A(dict(at="02:17", scope="GERAL", modo="mecanismo", topic=["deload","fadiga","recuperacao"],
  claim="A vantagem do deload planejado é que você provavelmente não vai trabalhar demais e é menos provável que fique overtreinado.",
  verbatim="the advantages a planned D Lo is that you're not going to probably overwork in an organized training structure you're getting your time to rest to release that fatigue"))

A(dict(at="02:17", scope="GERAL", modo="mecanismo", topic=["deload","volume","progressao"],
  claim="A desvantagem do deload planejado é que você pode não precisar dele, e aí sobram semanas de treino em cima da mesa.",
  verbatim="the con is that you might not need the D Lo and what that means is if you're taking every fourth week off and you actually don't need it there's a lot of training weeks left on the table"))

A(dict(at="02:32", scope="GERAL", modo="opiniao", topic=["deload","progressao","meta-metodologia"],
  claim="Fazer deload a cada quarta semana significa passar 25% do tempo em deload, e ao longo de anos isso é muito tempo de treino e de ganho perdidos.",
  verbatim="where you're de loading 25% of the time every fourth week that's a lot of loss training time and gains left on the table",
  params=[P("proporcao_do_tempo_em_deload",25,"%","pct")]))

A(dict(at="02:47", scope="GERAL", modo="fato", topic=["deload","autorregulacao"],
  claim="O segundo tipo é o deload reativo, que é uma forma elegante de dizer que você toma um quando precisa.",
  verbatim="the next type of D Lo that you might look into is a reactive D Lo and what a reactive de lo is fancy way of saying hey you take one when you need one"))

A(dict(at="02:47", scope="GERAL", modo="fato", topic=["deload","programacao"],
  claim="Os dois exemplos de deload reativo dentro de programas de template são o StrongLifts e o método GZCLP.",
  verbatim="there's two great examples of that within template based programs one is strong lifts 5x5 and the other is the gzclp method",
  params=[P("series_stronglifts",5,"séries","series"),P("reps_stronglifts",5,"reps","reps")]))

A(dict(at="03:02", scope="GERAL", modo="fato", topic=["deload","progressao"],
  claim="No StrongLifts o deload reativo vem primeiro e, quando ele não basta para sustentar a progressão linear, aí sim muda o protocolo de treino.",
  verbatim="uses a reactive D Lo that then is followed when that delad is not sufficient enough to continue"))

A(dict(at="03:02", scope="GERAL", modo="fato", topic=["deload","progressao"],
  claim="No GZCLP é o contrário: primeiro muda o protocolo de treino e só depois vem o deload.",
  verbatim="the gzclp goes the other way where you change the training protocol first and then you do the D Lo afterwards"))

A(dict(at="03:17", scope="GERAL", modo="fato", topic=["deload","progressao","intensidade"],
  claim="Quando você falha as séries no StrongLifts, a instrução é derrubar 10% do peso que estava usando.",
  verbatim="you would drop 10% of whatever weight you used and then you would use that for your next",
  params=[P("reducao_carga",10,"%","pct")]))

A(dict(at="03:48", scope="GERAL", modo="fato", topic=["deload","progressao"],
  claim="No exemplo, quem falhou com 200 lb volta para 180 lb e tenta passar de 200 outra vez.",
  verbatim="if you failed to do your 5x5 with 200 lb you're going to drop that back to 180",
  params=[P("carga_falhada",200,"lb","lb"),P("carga_reduzida",180,"lb","lb"),P("series",5,"séries","series"),P("reps",5,"reps","reps")]))

A(dict(at="04:03", scope="GERAL", modo="fato", topic=["deload","volume","series-reps"],
  claim="Depois de bater na parede algumas vezes você muda o protocolo de 5 séries de 5 para 3 séries de 5, cortando 2 séries.",
  verbatim="you actually change the training protocol from 5x5 to 3x5 so you're dropping two sets",
  params=[P("series_antes",5,"séries","series"),P("reps",5,"reps","reps"),P("series_depois",3,"séries","series"),P("series_cortadas",2,"séries","series")]))

A(dict(at="04:18", scope="GERAL", modo="mecanismo", topic=["deload","volume","fadiga"],
  claim="Baixar o volume geral libera fadiga e permite mostrar a aptidão e a força que você vinha desenvolvendo o tempo todo.",
  verbatim="because you've lowered your overall volume and that's going to allow you to release some of that fatigue and then show that actual Fitness and that strength that you've been developing"))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["deload","series-reps","volume"],
  claim="A progressão desce depois para 3 séries de 3 e, no fim, para 1 série de 3 seguida de 2 séries de 3 a menos 5% do top set.",
  verbatim="to a 3X3 so now you're dropping the Reps until finally you drop to one set of three and then two sets of three at minus 5% from the top set",
  params=[P("series",3,"séries","series"),P("reps",3,"reps","reps"),P("series_top",1,"séries","series"),P("series_back_off",2,"séries","series"),P("reducao_back_off",5,"%","pct")]))

A(dict(at="04:49", scope="GERAL", modo="fato", topic=["deload","intensidade","volume"],
  claim="No StrongLifts, portanto, você deloada primeiro pela intensidade, com queda de 10%, e só depois pelo volume.",
  verbatim="you're Del loading with a 10% drop on intensity before you start dropping volume by changing the protocol",
  params=[P("queda_intensidade",10,"%","pct")]))

A(dict(at="04:49", scope="GERAL", modo="fato", topic=["deload","series-reps"],
  claim="No GZCLP o protocolo básico é 5 séries de 3 com AMRAP na última série.",
  verbatim="you're basically doing five sets of three plus the last set",
  params=[P("series",5,"séries","series"),P("reps",3,"reps","reps")]))

A(dict(at="05:04", scope="GERAL", modo="fato", topic=["deload","volume","series-reps"],
  claim="Ao falhar no GZCLP você passa para 6 séries de 2, indo de 15 para 12 repetições de trabalho.",
  verbatim="you would move to the next protocol which would be six sets of two so as you can tell 15 working reps here you got 12 working reps",
  params=[P("series",6,"séries","series"),P("reps",2,"reps","reps"),P("reps_trabalho_antes",15,"reps","reps"),P("reps_trabalho_depois",12,"reps","reps")]))

A(dict(at="05:19", scope="GERAL", modo="fato", topic=["deload","series-reps","intensidade"],
  claim="A progressão do GZCLP desce até 10 singles com um AMRAP no último.",
  verbatim="all the way down to 10 singles with a an AM wrap on that last single",
  params=[P("singles",10,"séries","series")]))

A(dict(at="05:19", scope="GERAL", modo="fato", topic=["deload","taper","recuperacao"],
  claim="Quando você falha em toda a progressão, o deload do GZCLP é mais parecido com um taper: 2 a 3 dias de descanso daquele levantamento.",
  verbatim="then you Delo by taking really what's a little bit more like a taper a 2 to three day rest period from that lift",
  params=[P("descanso_min",2,"dias","dias"),P("descanso_max",3,"dias","dias")]))

A(dict(at="05:19", scope="GERAL", modo="fato", topic=["deload","teste-de-forca","progressao"],
  claim="Depois desse descanso você reteste o máximo de 5 repetições e usa 85% dele para recomeçar a progressão.",
  verbatim="your five rep max and then using 85% of that five rep max to restart another round of five sets of three plus",
  params=[P("reps_do_teste",5,"reps","reps"),P("intensidade_reinicio",85,"% do 5RM","pct_1RM")]))

A(dict(at="05:34", scope="GERAL", modo="prescricao", topic=["deload","autorregulacao"],
  claim="O deload reativo é situacional: você o toma quando precisa, idealmente com algo dentro do programa que dispare o gatilho.",
  verbatim="A reactive D Lo is going to be situational you're going to take it when you need it hopefully within your program there's something that can trigger that"))

A(dict(at="05:49", scope="GERAL", modo="prescricao", topic=["autorregulacao","recuperacao","fadiga"],
  claim="Um gatilho possível é um score de prontidão: um checklist diário em que você monitora a prontidão e observa tendências.",
  verbatim="you're doing something daily where you've got a checklist and you're monitoring your Readiness and you're seeing Trends"))

A(dict(at="05:49", scope="GERAL", modo="prescricao", topic=["autorregulacao","lesao","deload"],
  claim="Se a prontidão despenca, é sinal de que o desempenho está sofrendo e de que você pode estar caminhando para uma lesão, e é hora de deloadar.",
  verbatim="if you see that dip way down deep that's how you're going to know hey my performance is suffering I might be heading towards an injury maybe I should take a D Lo right now"))

A(dict(at="06:35", scope="GERAL", modo="opiniao", topic=["deload","autorregulacao","meta-metodologia"],
  claim="Disparar o deload reativamente é provavelmente a melhor forma, ainda que algumas pessoas gostem da estrutura do deload pré-planejado, e nenhum dos dois é certo ou errado.",
  verbatim="when you're looking at reactives it's when you need it this is probably the best way to trigger a D Lo um rather than pre-planning it although some people like the structure and the pattern of pre-planned D loads it's not that one is right or wrong"))

A(dict(at="06:35", scope="GERAL", modo="prescricao", topic=["deload","meta-metodologia","autorregulacao"],
  claim="A melhor forma de descobrir qual estratégia de deload funciona para você é experimentar treinar com cada uma delas.",
  verbatim="you just need to figure out what works best for you and best way to do that is actually to kind of try some training with each of them"))

A(dict(at="06:50", scope="GERAL", modo="fato", topic=["deload","periodizacao"],
  claim="A terceira opção é não fazer deload nenhum, como no método Cube.",
  verbatim="the third option for D loads is no D Lo and that's like something like the cube method"))

A(dict(at="06:50", scope="GERAL", modo="prescricao", topic=["deload","periodizacao","fadiga"],
  claim="Se você não vai fazer deload nem ter um sistema reativo, precisa assar o deload dentro do próprio programa.",
  verbatim="basically if you're not going to de lo at all and you're not even going to have a reactive Del Lo system what you need to do is bake the D Lo in"))

A(dict(at="07:05", scope="GERAL", modo="prescricao", topic=["deload","periodizacao","volume"],
  claim="A forma de assar o deload no programa é usar um estilo ondulatório de treino, ou fases com semanas fáceis de transição no começo.",
  verbatim="the way you're going to do that is by having an undulating style of training or phases that have easy weeks at the beginning of them like transition weeks"))

A(dict(at="07:20", scope="GERAL", modo="fato", topic=["deload","frequencia","periodizacao"],
  claim="No Cube o dia de velocidade acontece a cada terceira exposição ao levantamento e funciona efetivamente como deload, sem que uma semana inteira seja dedicada a isso.",
  verbatim="there's a heavy day a rep day and a speed day and the speed day is going to be every third time you're exposed to a lift and it's effectively a D Lo"))

A(dict(at="07:20", scope="GERAL", modo="mecanismo", topic=["deload","fadiga","recuperacao"],
  claim="O ponto de qualquer estratégia de deload é manter a fadiga num nível razoável para você não overtreinar.",
  verbatim="the whole point is you're trying to keep your fatigue at a reasonable level so that you're not overtraining"))

A(dict(at="07:36", scope="GERAL", modo="mecanismo", topic=["progressao","selecao-exercicio","erro-comum"],
  claim="Outro risco é ficar preso na monotonia de sempre treinar do mesmo jeito: você se aclimata e para de progredir porque o treino é parecido demais.",
  verbatim="you're not getting so stuck in the same type of training monotony that you acclimate to it and you're not making any progress because your training is too similar",
  conflicts=["V061-19"]))

A(dict(at="07:36", scope="GERAL", modo="fato", topic=["deload","periodizacao"],
  claim="Muitas vezes o deload sinaliza o fim de um protocolo de treino, depois do qual você passa para outra coisa.",
  verbatim="often times D Lo signal the end of a training protocol"))

A(dict(at="07:51", scope="GERAL", modo="fato", topic=["deload","periodizacao","volume"],
  claim="Num estilo de programação por blocos o deload costuma ficar estacionado exatamente entre o primeiro e o segundo bloco.",
  verbatim="often times the D Lo will be stationed right in between block one and block two"))

A(dict(at="08:06", scope="GERAL", modo="mecanismo", topic=["deload","taper","fadiga"],
  claim="O ponto principal é que deloads e tapers liberam fadiga para permitir uma expressão maior da aptidão.",
  verbatim="the main point D loads and tapers release fatigue to allow for higher display of fitness"))

A(dict(at="08:22", scope="GERAL", modo="fato", topic=["teste-de-forca","competicao","meta-metodologia"],
  claim="No powerlifting, aptidão quer dizer a capacidade de expressar o 1RM no agacho, no supino e no terra.",
  verbatim="specifically in powerlifting your Fitness is your ability ility to display your one rep max ability in the squat bench and deadlift"))

A(dict(at="08:22", scope="GERAL", modo="mecanismo", topic=["deload","fadiga"],
  claim="Você faz deload para diminuir a fadiga que está mascarando a sua capacidade real.",
  verbatim="you're trying to diminish the fatigue that is masking your actual ability"))

A(dict(at="08:37", scope="GERAL", modo="prescricao", topic=["deload","volume","intensidade"],
  claim="Há duas formas de deloadar: baixar volume, baixar intensidade, ou as duas coisas ao mesmo tempo.",
  verbatim="you're going to do it two ways either lower volume or lower intensity or both you can do one or the other or both",
  params=[P("formas_de_deloadar",2,"formas","contagem")]))

A(dict(at="09:07", scope="GERAL", modo="fato", topic=["deload","volume","intensidade"],
  claim="No sistema dele tanto o deload pré-planejado quanto o disparado por gatilho baixam volume e intensidade juntos.",
  verbatim="we take volume and intensity down in the pre-planned de loads as well as a triggered D Lo"))

A(dict(at="09:23", scope="GERAL", modo="mecanismo", topic=["deload","fadiga","lesao"],
  claim="A razão de baixar os dois é liberar fadiga o mais rápido possível para permitir supercompensação ou evitar lesão por excesso de treino.",
  verbatim="because we're trying to release that fatigue as fast as possible to make sure that you can then have a super compensation"))

A(dict(at="09:38", scope="GERAL", modo="mecanismo", topic=["fadiga","recuperacao","meta-metodologia"],
  claim="O processo por trás disso é a curva de estímulo, recuperação e adaptação.",
  verbatim="this is often called like the uh the SR curve the stimulus recovery adaptation"))

A(dict(at="09:53", scope="GERAL", modo="mecanismo", topic=["recuperacao","progressao"],
  claim="Recuperando de forma adequada você se adapta ao estímulo de treino e fica um pouco mais forte.",
  verbatim="as you recover properly you're adapting to whatever this training stimulus was and your body should get a little stronger"))

A(dict(at="10:08", scope="GERAL", modo="mecanismo", topic=["capacidade-trabalho","progressao","dor"],
  claim="No exemplo dele, alguém sedentário que passa a fazer 100 agachamentos com peso corporal por dia não consegue nem andar no dia seguinte.",
  verbatim="you start doing 100 body weight squats a day which sounds awful",
  params=[P("reps_diarias",100,"reps","reps")]))

A(dict(at="10:23", scope="GERAL", modo="mecanismo", topic=["dor","recuperacao","aprendizado-motor"],
  claim="Pelo repeated bout effect, a mesma sessão passa a doer menos e a dor tardia dura menos a cada exposição.",
  verbatim="the next time you do it as part of the repeated bout effect it's not going to be as painful your Doms aren't going to last as long"))

A(dict(at="10:38", scope="GERAL", modo="mecanismo", topic=["progressao","capacidade-trabalho"],
  claim="Você acaba chegando a um teto em que para de progredir, porque já se adaptou àquele estímulo.",
  verbatim="you're also going to top out where you're not going to be able to continue to make progress"))

A(dict(at="10:53", scope="GERAL", modo="prescricao", topic=["progressao","intensidade"],
  claim="A saída ao chegar no teto é entrar num estímulo de sobrecarga progressiva, tornando o treino cada vez mais difícil.",
  verbatim="you start getting on a progressive overloading stimulus so that you make this training harder and harder"))

A(dict(at="11:08", scope="GERAL", modo="prescricao", topic=["fadiga","recuperacao","frequencia"],
  claim="Você não quer colocar outro dia de treino no ponto mais baixo e mais fatigado, porque isso te afunda ainda mais.",
  verbatim="you wouldn't want to have another training day when you're at your lowest most fatigued Point that's going to dip you down further"))

A(dict(at="11:24", scope="GERAL", modo="mecanismo", topic=["progressao","volume","capacidade-trabalho"],
  claim="Quanto mais adaptado você fica ao tipo de treino que faz, mais estímulo é necessário para passar da linha de base anterior.",
  verbatim="as you adapt further and further and further to the type of training that you're doing you actually need more and more training uh stimulus"))

A(dict(at="12:10", scope="GERAL", modo="mecanismo", topic=["fadiga","progressao","rpe"],
  claim="Quando o progresso estagna nesses programas, você já vinha falhando AMRAPs e trabalhando em RPEs muito altos.",
  verbatim="you have just been grinding through some maximal weights where you're failing am wraps in the case of those programs so you were working at very high rpes before you failed"))

A(dict(at="12:10", scope="GERAL", modo="mecanismo", topic=["deload","fadiga","periodizacao"],
  claim="Além do estímulo ter deixado de ser efetivo, você acumulou muita fadiga e precisa liberá-la para poder começar o próximo ciclo.",
  verbatim="you also have incurred a lot of fatigue and you need to release that fatigue so that you can start your next cycle",
  conflicts=["V102-12","V102-13"]))

A(dict(at="12:25", scope="GERAL", modo="mecanismo", topic=["deload","progressao","fadiga"],
  claim="Enquanto você libera fadiga descansando, não há estímulo dirigindo adaptação, e por isso há alguma regressão nesse período.",
  verbatim="as you release the fatigue and you rest you're not having a stimulus that dries adaptation and that's why there's going to be some regression"))

A(dict(at="12:40", scope="GERAL", modo="mecanismo", topic=["deload","recuperacao"],
  claim="Se o descanso se estende, em algum momento você destreina e a aptidão volta a cair.",
  verbatim="eventually as you rest as we all know you will detrain and come back down"))

A(dict(at="12:40", scope="GERAL", modo="prescricao", topic=["deload","fadiga","periodizacao"],
  claim="O deload precisa ser estruturado e normalmente dura uma semana, às vezes duas, dependendo do tamanho do buraco de fadiga em que você se meteu.",
  verbatim="so a D Lo needs to be structured usually they're a week we just as human beings seem to think in that term sometimes there two though it just depends how deep of a hole you've dug yourself into with fatigue",
  params=[P("duracao_tipica",1,"semanas","semanas"),P("duracao_maxima",2,"semanas","semanas")],
  conflicts=["V102-12","V102-13","V102-15"]))

A(dict(at="12:55", scope="GERAL", modo="prescricao", topic=["deload","erro-comum","recuperacao"],
  claim="Você não quer deloadar por tempo demais, nem de forma agressiva demais, nem fazer absolutamente nada.",
  verbatim="you don't want to de lo too long you don't want to de lo too aggressively you don't want to do absolutely nothing"))

A(dict(at="13:10", scope="GERAL", modo="prescricao", topic=["deload","volume"],
  claim="Deload não significa não treinar: significa treino mais fácil ou diferente do que você vinha fazendo.",
  verbatim="Del loads don't mean no training it means easier or different training than what you've been doing"))

A(dict(at="13:26", scope="GERAL", modo="mecanismo", topic=["deload","progressao","periodizacao"],
  claim="Depois da semana de deload a aptidão cai um pouco, e é esse nível que vira a nova base de onde a próxima fase começa.",
  verbatim="let's say you take a D Lo week on six and your Fitness does you know drop a little bit but this is the new starting point"))

A(dict(at="13:41", scope="GERAL", modo="prescricao", topic=["deload","selecao-exercicio","periodizacao"],
  claim="É bom que a próxima fase de treino tenha um estímulo diferente do anterior, porque uma semana de deload não ressensibiliza o corpo por completo.",
  verbatim="it'd be good if the next phase of training had a different training stimulus than what you got over from because one week of D loading isn't going to completely resensitize your body",
  params=[P("duracao_deload",1,"semanas","semanas")]))

A(dict(at="13:56", scope="GERAL", modo="mecanismo", topic=["progressao","periodizacao"],
  claim="O estímulo novo é o que continua o progresso e permite empilhar blocos em escada, repetindo o processo.",
  verbatim="that novel stimulus is going to continue your progress so that you can continue to stair step up and you should be stacking your blocks together to repeat that over and over"))

A(dict(at="14:11", scope="GERAL", modo="mecanismo", topic=["deload","lesao","fadiga"],
  claim="O papel do deload é apenas manter esse processo rodando: mitigar a chance de lesão, ressensibilizar ao treino, dar uma pausa mental e física e baixar a fadiga.",
  verbatim="the role of a D Lo is simply to keep that process going to mitigate the chance of injury to resensitize you to training to give you a mental and physical break to lower fatigue"))

A(dict(at="14:26", scope="GERAL", modo="prescricao", topic=["deload","taper","competicao","pico"],
  claim="Deloadar ou fazer taper para uma competição serve para mostrar força máxima, enquanto deloadar para outro bloco serve para chegar o mais pronto possível para aquele bloco.",
  verbatim="if you Delo or you taper into a meat you want to show your maximal strength but if you're Del loing into another block you want to be as ready as possible for that next block"))

emit("G004", c)
