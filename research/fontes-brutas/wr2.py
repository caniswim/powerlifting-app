import csv
rows=list(csv.DictReader(open("ipf_intl_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
for lo,hi,lab in ((74.0,83.0,"83 kg"),(83.0,93.0,"93 kg")):
    R=[r for r in rows if lo < f(r["BodyweightKg"]) <= hi and "pen" in r["Division"]]
    print("\n"+"="*74); print("CLASSE",lab,"— competições IPF internacionais (record-eligible), Open. n=%d"%len(R))
    for field,label in (("TotalKg","TOTAL"),("Best3SquatKg","AGACHO"),("Best3BenchKg","SUPINO"),("Best3DeadliftKg","TERRA")):
        S=sorted([r for r in R if f(r[field])],key=lambda r:-f(r[field]))
        print(" -- top6 %s --"%label); seen=set();c=0
        for r in S:
            if r["Name"] in seen: continue
            seen.add(r["Name"]);c+=1
            print("   %7.1f  %-26s %-12s %s  bw=%-6s %s"%(f(r[field]),r["Name"][:26],r["Country"][:12],r["Date"],r["BodyweightKg"],r["MeetName"][:38]))
            if c>=6: break
