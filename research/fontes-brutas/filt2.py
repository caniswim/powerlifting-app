import csv
src="openpowerlifting-2026-08-08/openpowerlifting-2026-08-08-75457967.csv"
INTL={"IPF","EPF","NAPF","AsianPF","AfricanPF","ORPF","FESUPO","CommonwealthPF"}
out=open("ipf_intl_men.csv","w",newline="");w=None;n=0
with open(src,newline="",encoding="utf-8") as f:
    r=csv.DictReader(f); w=csv.DictWriter(out,fieldnames=r.fieldnames); w.writeheader()
    for row in r:
        if row["Sex"]!="M" or row["Equipment"]!="Raw" or row["Event"]!="SBD": continue
        if row["Federation"] not in INTL: continue
        try: bw=float(row["BodyweightKg"])
        except: continue
        if not (74.0 < bw <= 93.0): continue
        w.writerow(row); n+=1
out.close(); print("rows:",n)
