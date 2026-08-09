from common import P, emit
c = []
A = c.append

A(dict(at="00:00", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele considera a periodização um conceito muito mal entendido.",
  verbatim="Garrett Blevens here again today to talk about a very misunderstood"))

A(dict(at="00:15", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="A tese dele é que todo treino é basicamente os mesmos princípios, só empacotados de formas diferentes.",
  verbatim="you're going to realize that all training is basically the same principles. It's just packaged in different ways"))

A(dict(at="00:30", scope="GERAL", modo="opiniao", topic=["periodizacao","erro-comum"],
  claim="As pessoas se exaltam com os tipos de periodização e começam a misturar termos de um jeito que não ajuda ninguém.",
  verbatim="get all up in arms about this type of periodization, linear, classic, block, dup, and they actually start mixing and matching terms in a way that's not helpful for anybody"))

A(dict(at="00:45", scope="GERAL", modo="opiniao", topic=["periodizacao","programacao"],
  claim="Qualquer sabor de periodização que siga os princípios fundamentais corretos vai gerar ganhos.",
  verbatim="why any flavor that follows the correct foundational training principles is going to put you on the gains"))

A(dict(at="01:00", scope="GERAL", modo="fato", topic=["periodizacao","series-reps"],
  claim="O programa do Ed Coan é um modelo de periodização linear: 2 séries em tudo, descendo de 10 para 8, 5, 3, duplas e finalmente um single.",
  verbatim="It's a linear periodization model where basically you're starting with two sets across the board until you get down to where you're doing your single, and you're starting with tens, you're moving to eights, fives,",
  params=[P("series",2,"séries","series"),P("reps_inicio",10,"reps","reps"),P("reps_etapa2",8,"reps","reps"),P("reps_etapa3",5,"reps","reps"),P("reps_etapa4",3,"reps","reps")]))

A(dict(at="01:16", scope="GERAL", modo="fato", topic=["progressao","autorregulacao","mentalidade"],
  claim="Coan escolhia os pesos com muito cuidado, sem falhar no treino e deixando um pouco no tanque a cada semana.",
  verbatim="He was very careful about what weights he would do, not missing in training, but making sure to build and leave a little bit in the tank each week as he progressed through"))

A(dict(at="01:31", scope="GERAL", modo="fato", topic=["progressao","intensidade","teste-de-forca"],
  claim="No programa do Coan você deveria estabelecer máximos novos e até dobrar máximos antigos ao longo do ciclo.",
  verbatim="In his program, you are supposed to be setting new maxes, even doubling uh old maxes"))

A(dict(at="02:01", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele prefere chamar periodização em blocos de programação em blocos, porque é uma estrutura de programação e não a periodização inteira.",
  verbatim="block periodization or what I might better term block programming"))

A(dict(at="02:16", scope="GERAL", modo="fato", topic=["intensidade","series-reps","periodizacao"],
  claim="No modelo padrão a intensidade sobe basicamente toda semana e as repetições descem a cada par de semanas.",
  verbatim="You've got your intensity increasing basically every week. You've got your reps stepping down every couple of weeks"))

A(dict(at="02:31", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="Um bloco pode ter de 1 semana a 7 ou 8 semanas de treino, e blocos diferentes podem ter comprimentos diferentes.",
  verbatim="you're going to have different blocks which are going to be composed of anywhere from even one week of training to who knows, maybe seven or eight weeks of training. Different blocks can be of different lengths",
  params=[P("duracao_minima",1,"semanas","semanas"),P("duracao_maxima_a",7,"semanas","semanas"),P("duracao_maxima_b",8,"semanas","semanas")]))

A(dict(at="02:46", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="É bastante arbitrário onde você desenha as linhas que separam os blocos no papel.",
  verbatim="It's really arbitrary where you draw the lines on the paper"))

A(dict(at="03:32", scope="GERAL", modo="fato", topic=["deload","periodizacao","intensidade"],
  claim="Cada bloco pode ou não ter uma semana de deload, com queda de intensidade e possivelmente também de volume.",
  verbatim="Each block may or may not have a uh a D lo week. Like right here is a D lo, right here is a D lo where there's a drop in intensity for that week and possibly also a drop in volume"))

A(dict(at="03:47", scope="GERAL", modo="fato", topic=["volume","progressao","periodizacao"],
  claim="Dentro do bloco você geralmente sobe o volume em degraus a cada semana.",
  verbatim="But you're going to be generally stairstepping up your volume each week"))

A(dict(at="04:02", scope="GERAL", modo="fato", topic=["periodizacao","volume","intensidade"],
  claim="No sistema dele há também um modo alternado, em que você sobe e desce a carga em vez de só subir, mais parecido com o estilo do Cube.",
  verbatim="we also have alternating where you're kind of jumping up, jumping down, jumping up, jumping down"))

A(dict(at="04:18", scope="GERAL", modo="fato", topic=["periodizacao","intensidade","progressao"],
  claim="Ao mudar de bloco, mesmo com repetições menores, você provavelmente volta a uma faixa de percentual já coberta no bloco anterior e reconstrói dali.",
  verbatim="when you stair step down to the next block, even though your reps might be decreasing, you're probably going to jump back into a percentage range you've already covered in a previous block"))

A(dict(at="04:33", scope="GERAL", modo="fato", topic=["periodizacao","progressao"],
  claim="Essa lógica de dois passos à frente e um passo atrás é o que distingue a programação em blocos da linear.",
  verbatim="it's kind of this two steps forward, one step back, two steps forward, one step back way of programming"))

A(dict(at="04:48", scope="GERAL", modo="mecanismo", topic=["periodizacao","recuperacao"],
  claim="É esse vaivém que permite um pouco mais de recuperação.",
  verbatim="This is what allows for a little bit more recovery"))

A(dict(at="04:48", scope="GERAL", modo="prescricao", topic=["periodizacao","selecao-exercicio"],
  claim="A programação em blocos permite focar por períodos definidos nas capacidades em que você é fraco.",
  verbatim="you can really start to focus in for different periods of time on certain abilities that you're training or that you're working towards where you're weak"))

A(dict(at="05:03", scope="GERAL", modo="prescricao", topic=["hipertrofia","volume","periodizacao"],
  claim="Se você precisa construir mais massa muscular, passe mais tempo em fases de volume e repetições mais altas.",
  verbatim="So if you need to build more muscle mass, you might spend more time in higher volume, higher rep phases"))

A(dict(at="05:18", scope="GERAL", modo="prescricao", topic=["peso-corporal","intensidade","periodizacao"],
  claim="Se você já maxou a sua categoria de peso e já está num peso corporal razoável, vai querer passar mais tempo nos blocos de intensidade e força, de repetições mais baixas.",
  verbatim="But if you've already maxed out your weight class, you're already at a reasonable body weight, you're probably going to want to spend more time in the intensity or strength blocks"))

A(dict(at="05:33", scope="GERAL", modo="fato", topic=["intensidade","pico","series-reps"],
  claim="Isso avança até intensidades acima de 90%, trabalhadas em duplas, triplas e singles, antes do taper para a competição.",
  verbatim="moving into those 90% plus intensities where you're going to work with those for doubles, triples, singles, and then you're going to taper and go into a meet",
  params=[P("intensidade_pico",90,"% do 1RM","pct_1RM")]))

A(dict(at="05:33", scope="GERAL", modo="fato", topic=["taper","competicao","periodizacao"],
  claim="Praticamente todo ciclo de programação em blocos tem algum tipo de taper entrando na competição.",
  verbatim="almost consistently with all block period or block programming uh cycles. You're going to have some sort of taper into the meet"))

A(dict(at="05:49", scope="GERAL", modo="prescricao", topic=["taper","peso-corporal","recuperacao","competicao"],
  claim="Alguns atletas menores, que recuperam mais rápido, fazem um taper de apenas 3 dias, enquanto outros levam múltiplas semanas: isso é muito individual.",
  verbatim="There are some people that do just a three-day taper for smaller athletes that recover quicker. Some people are taking even multiple weeks as their taper. That's going to be really individual for you",
  params=[P("taper_curto",3,"dias","dias")]))

A(dict(at="06:04", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele prefere chamar a periodização ondulatória diária de programação ondulatória diária.",
  verbatim="which is DUP, often termed daily undulating periodization. Again, let's try to change that to daily undulating programming"))

A(dict(at="06:19", scope="GERAL", modo="fato", topic=["periodizacao","programacao"],
  claim="O programa do Layne Norton tem 4 fases, mas a última fase dura apenas 1 semana.",
  verbatim="He has four phases, but really the last phase is just one week",
  params=[P("fases",4,"fases","contagem"),P("duracao_ultima_fase",1,"semanas","semanas")]))

A(dict(at="06:34", scope="GERAL", modo="opiniao", topic=["periodizacao"],
  claim="No sentido mais amplo, dá para pensar num bloco de treino como algo menor que uma semana, até meia semana.",
  verbatim="you could even in the most broad sense think of a block of training as less than a week, half a week"))

A(dict(at="06:34", scope="GERAL", modo="prescricao", topic=["meta-metodologia","periodizacao"],
  claim="Ele recomenda o curso Emerging Strategies do Mike Tuchscherer para quem quer aprender a organizar blocos e estruturas, apesar de ser caro.",
  verbatim="if you look at Mike Dashar's emerging strategies course, which is an awesome course. It's a little pricey"))

A(dict(at="06:34", scope="GERAL", modo="fato", topic=["rpe","autorregulacao","meta-metodologia"],
  claim="Mike Tuchscherer é um pioneiro dentro do powerlifting e foi quem trouxe o RTS e o RPE para a frente do esporte.",
  verbatim="Mike T uh is a pioneer within powerlifting brought RTS uh or RP to the the forefront of powerlifting"))

A(dict(at="07:05", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Blocos e fases são termos intercambiáveis.",
  verbatim="Blocks and phase really are interchangeable"))

A(dict(at="07:20", scope="GERAL", modo="fato", topic=["periodizacao","series-reps","intensidade"],
  claim="No modelo ondulatório você tem um dia leve de repetições altas, um dia médio e um dia de repetições baixas, com a intensidade inversa das repetições.",
  verbatim="you're going from your light uh your lighter day, which is your higher rep day, you've got a medium rep day, and you've got a low rep day. And the intensity is inverse of those"))

A(dict(at="07:50", scope="GERAL", modo="fato", topic=["periodizacao","series-reps","intensidade"],
  claim="Da primeira para a segunda fase desse programa as repetições descem uma e a intensidade sobe dois e meio por cento.",
  verbatim="the difference between phase one and phase two, the reps shift down by one, the intensity bumps up by two and a half percent",
  params=[P("queda_reps",1,"reps","reps"),P("aumento_intensidade",2.5,"pontos percentuais","pct")]))

A(dict(at="07:50", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele afirma que isso não tem a menor diferença em relação ao que se chama de periodização em blocos.",
  verbatim="That's really not a lick of difference from what we call block periodization"))

A(dict(at="08:05", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Chamar uma unidade de fase não faz dela algo que não seja um bloco.",
  verbatim="Just calling this a phase doesn't make it not a block"))

A(dict(at="08:05", scope="GERAL", modo="fato", topic=["periodizacao","series-reps","intensidade"],
  claim="O que acontece dentro dos blocos é sempre o mesmo: você derruba as repetições e aumenta a intensidade ao longo deles.",
  verbatim="you're dropping the reps as you go through them and you're increasing the intensity as you go through them"))

A(dict(at="08:20", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Ele demonstra que dá para transformar o programa linear do Ed Coan, o exemplo clássico de periodização linear, numa sequência de blocos.",
  verbatim="You want me to turn Ed Cohen's the classic example of linear periodization into a block? Okay. Block one, block two"))

A(dict(at="08:52", scope="GERAL", modo="opiniao", topic=["volume","intensidade","periodizacao"],
  claim="Toda programação efetiva se parece com a mesma figura: o volume acaba caindo em algum momento enquanto a intensidade sobe.",
  verbatim="What makes effective programming? It's going to look something like these every time, which is the red is intensity, the blue is volume. The volume is going to come down at some point"))

A(dict(at="09:08", scope="GERAL", modo="mecanismo", topic=["volume","pico","fadiga"],
  claim="Você derruba o volume para permitir alguma supercompensação, liberando fadiga e permitindo mostrar a força que foi desenvolvida no ciclo inteiro.",
  verbatim="you're going to drop your volume to allow for some sort of super compensation as you release the fatigue and you allow yourself to display the strength"))

A(dict(at="09:23", scope="GERAL", modo="opiniao", topic=["meta-metodologia","periodizacao"],
  claim="Mike Tuchscherer é o único exemplo que ele consegue lembrar de alguém que de fato questiona esse arcabouço.",
  verbatim="He's probably the only example of someone I can think of that actually says maybe we can question this framework"))

A(dict(at="09:23", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Na opinião dele, toda a briga entre os defensores do DUP e os da periodização em blocos, e as guerras dentro das comunidades científicas, é bobagem.",
  verbatim="But all the fighting between the DUP pundits or the block periodization people and all the wars within the scientific communities, it's all a bunch of baloney in my opinion",
  conflicts=["V061-22"]))

A(dict(at="09:38", scope="GERAL", modo="estudo", topic=["periodizacao","meta-metodologia"],
  claim="Ele desqualifica os estudos que pegam 3 pessoas num estudo de 12 semanas e declaram o DUP superior, e os estudos simétricos que declaram a periodização em blocos superior.",
  verbatim="you look at these studies that say, \"Oh, look how DUP made these three people in this 12-week study so much stronger. Oh, that's statistically valuable. Hooray.\"",
  params=[P("tamanho_amostra",3,"pessoas","n_amostra"),P("duracao_estudo",12,"semanas","semanas")],
  conflicts=["V061-22"]))

A(dict(at="09:38", scope="GERAL", modo="opiniao", topic=["periodizacao","meta-metodologia"],
  claim="Todas essas estruturas de periodização são efetivas, e houve recordistas mundiais em toda categoria de peso usando cada uma delas.",
  verbatim="we know that all of these structures are effective. There are amazing athletes that have used every single one of these and they have been world record holders in every weight class",
  conflicts=["V061-22"]))

A(dict(at="10:08", scope="GERAL", modo="opiniao", topic=["periodizacao","programacao","meta-metodologia"],
  claim="Elas são efetivas quando você as organiza apropriadamente para a sua necessidade, e é nesse como que mora o mérito.",
  verbatim="They're effective when you organize them properly for your needs. Now, how you do that is where the genius comes in"))

A(dict(at="10:08", scope="GERAL", modo="prescricao", topic=["programacao","meta-metodologia","erro-comum"],
  claim="Nenhum template é individualizado para você, então ele pode não ser apropriado, principalmente se for muito diferente do treino que você acabou de fazer.",
  verbatim="that's where any of these templates that you might look to, they're not individualized for your needs. So, they might not be appropriate for you, especially if it's very different from the training you were just doing"))

A(dict(at="10:23", scope="GERAL", modo="prescricao", topic=["volume","intensidade","erro-comum"],
  claim="Disparar o volume e o número de séries por semana, ou usar intensidades às quais você não está acostumado, é o que torna um template inapropriado.",
  verbatim="If you're skyrocketing your volume and the number of sets per week that you use. If you're using intensities that you're not used to"))

A(dict(at="10:23", scope="GERAL", modo="prescricao", topic=["intensidade","mentalidade","erro-comum"],
  claim="Se você gosta de treino submáximo e pula para um programa com percentuais gigantes acima de 100% do 1RM, isso pode te moer.",
  verbatim="let's say you like doing submaximal training. Well, if you jump into something like this where you're using giant percentages uh over 100% of your one rep max, that may grind you into the ground",
  params=[P("intensidade_extrema",100,"% do 1RM","pct_1RM")]))

A(dict(at="10:38", scope="GERAL", modo="prescricao", topic=["mentalidade","meta-metodologia"],
  claim="Você precisa achar uma filosofia de treino que combine com a sua para ter crença no sistema.",
  verbatim="You need to find a philosophy that matches with your own training philosophy so that you have that belief in the system"))

A(dict(at="10:38", scope="GERAL", modo="opiniao", topic=["mentalidade","meta-metodologia"],
  claim="Acreditar no que você está fazendo, em si mesmo e no seu programa é uma parte incrivelmente subvalorizada e muito importante do processo.",
  verbatim="It's an incredibly undervalued"))

A(dict(at="11:09", scope="GERAL", modo="prescricao", topic=["mentalidade","periodizacao"],
  claim="Ele manda parar de brigar sobre periodização e parar de fingir que os modelos são completamente diferentes.",
  verbatim="stop the hate. Stop fighting with each other. Stop pretending like they're completely different"))

A(dict(at="10:54", scope="GERAL", modo="prescricao", topic=["meta-metodologia","programacao"],
  claim="O que quer que você escolha fazer, garanta ter um bom entendimento dos princípios de treino que sustentam aquilo.",
  verbatim="make sure you have a solid background of the training principles undergirling"))

emit("G006", c)
