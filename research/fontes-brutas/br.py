import csv
rows=list(csv.DictReader(open("ipf_raw_men.csv",newline="",encoding="utf-8")))
def f(x):
    try: return float(x)
    except: return None
BR=[r for r in rows if r["Federation"]=="CBLB" or r["Country"]=="Brazil" or r["MeetCountry"]=="Brazil"]
print("Brazil-linked IPF raw men 83/93 SBD rows:",len(BR))
print("Federations seen:",sorted({r["Federation"] for r in BR}))
print("Date range:",min(r["Date"] for r in BR),"->",max(r["Date"] for r in BR))
for wc in ("83","93"):
    R=[r for r in BR if r["WeightClassKg"] in (wc,wc+".0")]
    print("\n"+"="*72);print("BRAZIL — CLASS",wc,"kg  (n=%d)"%len(R))
    for field,label in (("TotalKg","TOTAL"),("Best3SquatKg","SQUAT"),("Best3BenchKg","BENCH"),("Best3DeadliftKg","DEADLIFT")):
        S=sorted([r for r in R if f(r[field])],key=lambda r:-f(r[field]))
        print(" -- top8 %s --"%label); seen=set();c=0
        for r in S:
            if r["Name"] in seen: continue
            seen.add(r["Name"]);c+=1
            print("   %7.1f  %-26s %-6s %s bw=%-6s %-30s [%s]"%(f(r[field]),r["Name"][:26],r["Federation"],r["Date"],r["BodyweightKg"],r["MeetName"][:30],r["Division"][:10]))
            if c>=8: break

print("\n\n### CAMPEONATO BRASILEIRO (CBLB national meets) — recent placings, Open")
import re
meets=sorted({(r["Date"],r["MeetName"]) for r in BR if r["Federation"]=="CBLB" and r["Date"]>="2024"})
for d,m in meets: print("  ",d,"|",m)
