import math
A,B,C=1199.72839,1025.18162,0.00921
def gl(t,bw): return t*100.0/(A-B*math.exp(-C*bw))
def inv(g,bw): return g*(A-B*math.exp(-C*bw))/100.0

print("### 1. CENÁRIOS DE DESCONTO TREINO -> PADRÃO IPF (estimativa, conta explícita)")
sc={"Otimista (0% perda)":(250,170,268),
    "Realista (agacho -8%, supino -7%, terra -3%)":(250*.92,170*.93,268*.97),
    "Conservador (-12%/-10%/-5%)":(250*.88,170*.90,268*.95)}
for k,(s,b,d) in sc.items():
    # arredonda p/ multiplo de 2.5 (discos IPF permitem 1.25 mas atribuicoes usuais 2.5)
    r=lambda x: round(x*2)/2
    t=s+b+d
    print("  %-46s A=%6.1f S=%6.1f T=%6.1f -> TOTAL=%6.1f  GL@87=%.2f"%(k,s,b,d,t,gl(t,87)))

print("\n### 2. ESCOLHA DE CATEGORIA: mesmo GL, quanto total precisa em cada bw")
for t in (688,650,620):
    g=gl(t,87)
    print("  Total %d kg @87 kg -> GL %.2f  ==  %.1f kg @83.0 kg  ==  %.1f kg @93.0 kg"%(t,g,inv(g,83),inv(g,93)))
print("  Nota: subir de 83.0 para 93.0 kg de PC exige +%.1f kg de total p/ MESMO GL"%(inv(gl(688,87),93)-inv(gl(688,87),83)))

print("\n### 3. DISTÂNCIA HONESTA")
bench=[("Recorde mundial 83 (Borenstein, 08/06/2025)",890.0),
       ("Recorde mundial 93 (W. Ball, 13/06/2026)",927.5),
       ("Ouro Mundial 83 (2026)",882.5),("Ouro Mundial 93 (2026)",927.5),
       ("Bronze Mundial 83 (2026)",845.0),("Bronze Mundial 93 (2026)",897.5),
       ("Top-10 Mundial 83 (2026, 10º)",780.0),("Top-10 Mundial 93 (2026, 10º)",785.0),
       ("Último com total Mundial 83 (2026)",600.0),("Último com total Mundial 93 (2026)",650.0),
       ("Ouro Sul-Americano 83 (2025)",778.5),("Ouro Sul-Americano 93 (2025)",757.5),
       ("Bronze Sul-Americano 83 (2025)",732.5),("Bronze Sul-Americano 93 (2025)",735.0),
       ("Ouro Brasileiro 83 (2026)",715.0),("Ouro Brasileiro 93 (2026)",800.0),
       ("Bronze Brasileiro 83 (2026)",710.5),("Bronze Brasileiro 93 (2026)",737.5),
       ("Mediana Brasileiro 83 (2026)",557.5),("Mediana Brasileiro 93 (2026)",612.5),
       ("Recorde BR 93 (Coimbra, 16/03/2019)",812.5),
       ("Melhor BR 83 de sempre (M.dos Santos 2026 Mundial)",740.0)]
for lab,t in [("DECLARADO 688",688.0),("REALISTA ~647,5",647.5),("CONSERVADOR ~627,5",627.5)]:
    print("\n  -- Partindo de %s kg --"%lab)
    print("     %-52s %8s %8s %8s"%("alvo","alvo kg","faltam","% do alvo"))
    for n,v in bench:
        print("     %-52s %8.1f %8.1f %8.1f%%"%(n,v,v-t,100*t/v))
