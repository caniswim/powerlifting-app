import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
for wc in ("83","93"):
    R=[r for r in rows if r["WeightClassKg"] in (wc,wc+".0")]
    print("="*70); print("WEIGHT CLASS",wc,"kg — total rows",len(R))
    for field,label in (("TotalKg","TOTAL"),("Best3SquatKg","SQUAT"),("Best3BenchKg","BENCH"),("Best3DeadliftKg","DEADLIFT")):
        print("\n--- TOP 12 %s (all IPF-affiliated, raw, men, SBD meets) ---"%label)
        S=[r for r in R if f(r[field])]
        S.sort(key=lambda r:-f(r[field]))
        seen=set(); c=0
        for r in S:
            if r["Name"] in seen: continue
            seen.add(r["Name"]); c+=1
            print("%7.1f  %-24s %-9s %-5s bw=%-6s %s | %s | %s"%(
              f(r[field]), r["Name"][:24], r["Federation"], r["Date"][:4],
              r["BodyweightKg"], r["Date"], r["MeetName"][:42], r["Division"][:12]))
            if c>=12: break
