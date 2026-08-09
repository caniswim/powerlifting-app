import csv, sys
src="openpowerlifting-2026-08-08/openpowerlifting-2026-08-08-75457967.csv"
out=open("ipf_raw_men.csv","w",newline="")
w=None
n=0
with open(src, newline="", encoding="utf-8") as f:
    r=csv.DictReader(f)
    w=csv.DictWriter(out, fieldnames=r.fieldnames)
    w.writeheader()
    for row in r:
        if row["Sex"]!="M": continue
        if row["Equipment"]!="Raw": continue
        if row["Event"]!="SBD": continue
        if row["ParentFederation"]!="IPF": continue
        wc=row["WeightClassKg"]
        if wc not in ("83","93","83.0","93.0"): continue
        w.writerow(row); n+=1
out.close()
print("rows:",n)
