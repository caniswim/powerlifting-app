import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
S=[r for r in rows if r["Federation"] in ("FESUPO","NAPF","PA") ]
print("Meets (FESUPO/NAPF/PA) since 2023:")
for d,m,fed in sorted({(r["Date"],r["MeetName"],r["Federation"]) for r in S if r["Date"]>="2023"}): print("  ",d,fed,"|",m)
for key in ("Sudamericano","Pan-American","Panamerican","South American"):
    for wc in ("83","93"):
        R=[r for r in S if key.lower() in r["MeetName"].lower() and r["WeightClassKg"] in (wc,wc+".0") and "pen" in r["Division"] and r["Date"]>="2024"]
        if not R: continue
        for d in sorted({r["Date"] for r in R}):
            G=[r for r in R if r["Date"]==d]
            G.sort(key=lambda r:(f(r["TotalKg"]) is None,-(f(r["TotalKg"]) or 0)))
            print("\n== %s %s | %s kg OPEN (n=%d) =="%(G[0]["MeetName"][:40],d,wc,len(G)))
            for i,r in enumerate(G[:10],1):
                print("  %2d. %-28s %-12s tot=%-7s (%s/%s/%s) GL=%s"%(i,r["Name"][:28],r["Country"][:12],r["TotalKg"] or "NM",r["Best3SquatKg"],r["Best3BenchKg"],r["Best3DeadliftKg"],r["Goodlift"]))
