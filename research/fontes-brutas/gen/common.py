import json, os
WT = "/private/tmp/claude-501/-Users-brunnovert-Documents-Dev-powerlifting-app/a255bdcd-7dff-451d-b7e3-00ba9dd4b3ed/scratchpad/wt-blevins"
OUT = os.path.join(WT, "research/extract")

def P(name, value, unit, frame):
    return {"name": name, "value": value, "unit": unit, "frame": frame}

def emit(ref, claims):
    lines = []
    for i, c in enumerate(claims, 1):
        rec = {
            "id": "%s-%02d" % (ref, i),
            "src": ref,
            "at": c["at"],
            "tier": "R",
            "scope": c["scope"],
            "certainty": c.get("certainty", "explicit"),
            "modo": c["modo"],
            "topic": c["topic"],
            "claim": c["claim"],
            "verbatim": c["verbatim"],
        }
        if c.get("params"):
            rec["params"] = c["params"]
        if c.get("conditions"):
            rec["conditions"] = c["conditions"]
        if c.get("conflicts"):
            rec["conflicts"] = c["conflicts"]
        if c.get("suspect"):
            rec["suspect"] = True
            rec["suspectWhy"] = c["suspectWhy"]
        lines.append(json.dumps(rec, ensure_ascii=False))
    path = os.path.join(OUT, ref + ".jsonl")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(ref, len(lines), "claims ->", path)
