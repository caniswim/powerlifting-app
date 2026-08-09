import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
irows=list(csv.DictReader(open("ipf_intl_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
def place(group,t):
    tot=sorted([f(r["TotalKg"]) for r in group if f(r["TotalKg"])],reverse=True)
    p=sum(1 for x in tot if x>t)+1
    return p,len(tot)
meets=[
 ("Camp. Brasileiro Clássico 2026 (22/02/2026)", lambda wc:[r for r in rows if r["Date"]=="2026-02-22" and r["Federation"]=="CBLB" and "Brasileiro" in r["MeetName"] and r["WeightClassKg"]==wc and "pen" in r["Division"]]),
 ("Camp. Brasileiro Clássico 2025 (19/02/2025)", lambda wc:[r for r in rows if r["Date"]=="2025-02-19" and r["Federation"]=="CBLB" and "Brasileiro" in r["MeetName"] and r["WeightClassKg"]==wc and "pen" in r["Division"]]),
 ("Camp. Sul-Americano 2025 (20/09/2025)", lambda wc:[r for r in rows if r["Date"]=="2025-09-20" and r["Federation"]=="FESUPO" and r["WeightClassKg"]==wc and "pen" in r["Division"]]),
 ("Mundial Clássico IPF 2026 (13/06/2026)", lambda wc:[r for r in rows if r["Date"]=="2026-06-13" and r["Federation"]=="IPF" and "World Classic" in r["MeetName"] and r["WeightClassKg"]==wc and "pen" in r["Division"]]),
 ("Mundial Clássico IPF 2025 (08/06/2025)", lambda wc:[r for r in rows if r["Date"]=="2025-06-08" and r["Federation"]=="IPF" and "World Classic" in r["MeetName"] and r["WeightClassKg"]==wc and "pen" in r["Division"]]),
]
for T in (688,647.5,627.5):
    print("\n### Onde um total de %.1f kg teria colocado (masc. clássico open)"%T)
    print("  %-42s %-14s %-14s"%("evento","83 kg","93 kg"))
    for name,fn in meets:
        out=[]
        for wc in ("83","93"):
            g=fn(wc)
            if not g: out.append("s/ dados"); continue
            p,n=place(g,T); out.append("%dº de %d"%(p,n))
        print("  %-42s %-14s %-14s"%(name,out[0],out[1]))
