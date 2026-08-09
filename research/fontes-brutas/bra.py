import csv,math
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
for d in ("2026-02-22","2025-02-19","2024-03-08"):
    for wc in ("83","93"):
        R=[r for r in rows if r["Date"]==d and r["WeightClassKg"] in (wc,wc+".0") and "pen" in r["Division"]]
        if not R: continue
        R.sort(key=lambda r:(f(r["TotalKg"]) is None,-(f(r["TotalKg"]) or 0)))
        print("\n== Campeonato Brasileiro Clássico %s — %s kg Open (n=%d) =="%(d,wc,len(R)))
        for i,r in enumerate(R,1):
            print("  %2d. %-30s tot=%-7s (%s/%s/%s) bw=%s GL=%s"%(i,r["Name"][:30],r["TotalKg"] or "NM",
              r["Best3SquatKg"],r["Best3BenchKg"],r["Best3DeadliftKg"],r["BodyweightKg"],r["Goodlift"]))

# GL points
def gl(total,bw,A=1199.72839,B=1025.18162,C=0.00921):
    return total*100.0/(A-B*math.exp(-C*bw))
print("\n\n### IPF GL POINTS — Men Classic Total (A=1199.72839 B=1025.18162 C=0.00921)")
print("%-34s %8s %8s %9s"%("cenário","total","bw","GL pts"))
for lab,t,bw in [("Declarado treino 688 @87",688,87),
                 ("688 descontado -8% =633 @87",633,87),
                 ("688 cortando p/83 (-5%)=654 @83",654,83),
                 ("Rec.mundial 83 (Borenstein 890)",890,82.84),
                 ("Rec.mundial 93 (Ball 927.5)",927.5,91.4),
                 ("Ouro mundial 83 2026 (882.5)",882.5,82.5),
                 ("Bronze mundial 83 2026 (845)",845,82.7),
                 ("Bronze mundial 93 2026 (897.5)",897.5,92.65),
                 ("Rec.BR 93 (Coimbra 812.5)",812.5,92.65),
                 ("688 @93 (sem cortar)",688,93)]:
    print("%-34s %8.1f %8.2f %9.2f"%(lab,t,bw,gl(t,bw)))
