import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
for d in ("2026-02-22","2025-02-19","2024-03-08"):
    for wc in ("83","93"):
        R=[r for r in rows if r["Date"]==d and r["Federation"]=="CBLB" and "Brasileiro" in r["MeetName"]
           and r["WeightClassKg"] in (wc,wc+".0") and "pen" in r["Division"]]
        if not R: continue
        R.sort(key=lambda r:(f(r["TotalKg"]) is None,-(f(r["TotalKg"]) or 0)))
        print("\n== CAMP. BRASILEIRO CLÁSSICO %s | %s kg OPEN (n=%d) | %s =="%(d,wc,len(R),R[0]["MeetName"][:50]))
        for i,r in enumerate(R[:14],1):
            print("  %2d. %-32s tot=%-7s (%s/%s/%s) bw=%-6s GL=%s"%(i,r["Name"][:32],r["TotalKg"] or "NM",
              r["Best3SquatKg"],r["Best3BenchKg"],r["Best3DeadliftKg"],r["BodyweightKg"],r["Goodlift"]))
        got=[r for r in R if f(r["TotalKg"])]
        if got: print("     mediana=%.1f  último com total=%s kg"%(sorted(f(x["TotalKg"]) for x in got)[len(got)//2],got[-1]["TotalKg"]))
