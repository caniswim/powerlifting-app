import csv,sys
for f in sys.argv[1:]:
    rows=list(csv.DictReader(open(f)))
    if not rows: print(f,'EMPTY'); continue
    print('#####',f, rows[0]['Name'], rows[0]['Country'])
    rows.sort(key=lambda r: r['Date'], reverse=True)
    print('  --- last 6 meets ---')
    for r in rows[:6]:
        print(f"  {r['Date']} {r['Federation']}/{r['ParentFederation']} tested={r['Tested']} {r['Division']} bw={r['BodyweightKg']} cls={r['WeightClassKg']} S{r['Best3SquatKg']} B{r['Best3BenchKg']} D{r['Best3DeadliftKg']} T{r['TotalKg']} GL={r['Goodlift']} :: {r['MeetName']}")
    best=sorted([r for r in rows if r['TotalKg']],key=lambda r: -float(r['TotalKg'] or 0))[:3]
    print('  --- best totals ---')
    for r in best:
        print(f"  {r['Date']} {r['Federation']}/{r['ParentFederation']} tested={r['Tested']} bw={r['BodyweightKg']} cls={r['WeightClassKg']} S{r['Best3SquatKg']} B{r['Best3BenchKg']} D{r['Best3DeadliftKg']} T{r['TotalKg']} GL={r['Goodlift']} :: {r['MeetName']}")
