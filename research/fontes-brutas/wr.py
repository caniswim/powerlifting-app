import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
INTL={"IPF","EPF","NAPF","AsianPF","AfricanPF","ORPF","FESUPO","CommonwealthPF"}
print("### WORLD-RECORD-ELIGIBLE (international IPF/regional meets), Open division")
for wc in ("83","93"):
    R=[r for r in rows if r["WeightClassKg"] in (wc,wc+".0") and r["Federation"] in INTL and "pen" in r["Division"]]
    print("\n"+"="*72); print("CLASS",wc,"kg  — intl open rows:",len(R))
    for field,label in (("TotalKg","TOTAL"),("Best3SquatKg","SQUAT"),("Best3BenchKg","BENCH"),("Best3DeadliftKg","DEADLIFT")):
        S=sorted([r for r in R if f(r[field])],key=lambda r:-f(r[field]))
        print("  -- top6 %s --"%label)
        seen=set();c=0
        for r in S:
            if r["Name"] in seen: continue
            seen.add(r["Name"]);c+=1
            print("   %7.1f  %-24s %-6s %s  bw=%-6s %s"%(f(r[field]),r["Name"][:24],r["Federation"],r["Date"],r["BodyweightKg"],r["MeetName"][:40]))
            if c>=6: break

print("\n\n### WORLD CLASSIC CHAMPIONSHIPS — full placings 83 & 93, recent years")
for yr in ("2023","2024","2025","2026"):
    for wc in ("83","93"):
        R=[r for r in rows if r["WeightClassKg"] in (wc,wc+".0") and r["Federation"]=="IPF"
           and "World Classic Powerlifting" in r["MeetName"] and r["Date"].startswith(yr) and "pen" in r["Division"]]
        if not R: continue
        R.sort(key=lambda r: (f(r["TotalKg"]) is None, -(f(r["TotalKg"]) or 0)))
        print("\n-- Worlds %s / %s kg  (n=%d) --"%(yr,wc,len(R)))
        for i,r in enumerate(R[:12],1):
            print("   %2d. %-24s %-14s tot=%-7s (%s/%s/%s) GL=%s"%(i,r["Name"][:24],r["Country"][:14],
              r["TotalKg"] or "DQ/NM",r["Best3SquatKg"],r["Best3BenchKg"],r["Best3DeadliftKg"],r["Goodlift"]))
        got=[r for r in R if f(r["TotalKg"])]
        if got: print("      -> last with a total: %s kg (place %d of %d)"%(got[-1]["TotalKg"],len(got),len(R)))
