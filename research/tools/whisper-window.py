#!/usr/bin/env python
"""
Worker de transcrição — o único lugar do repositório que carrega o Whisper.

Existe como processo separado, e recebendo TODAS as janelas de uma vez, por um
motivo só: carregar o `large-v3-turbo` custa ~2 min nesta máquina. Chamar o
Whisper uma vez por janela pagaria isso 126 vezes. Aqui o modelo carrega uma
vez e as janelas passam por ele em fila.

Contrato: recebe o caminho de um JSON `[{id, wav}, ...]`, escreve um JSON
`[{id, text, segments, avgLogprob, noSpeechProb}, ...]`. Node manda e recebe;
Python só transcreve. Nenhuma decisão sobre a base mora aqui.

    python whisper-window.py jobs.json out.json

`large-v3-turbo` em int8 é o mesmo modelo que a run 1 usou — trocar de modelo
tornaria as duas verificações incomparáveis, e comparabilidade é metade do
valor deste passe.
"""

import json
import sys

from faster_whisper import WhisperModel

jobs_path, out_path = sys.argv[1], sys.argv[2]
with open(jobs_path, encoding="utf-8") as f:
    jobs = json.load(f)

# i5-13600KF: 14 núcleos, 20 threads, sem CUDA. int8 no CPU é o que torna o
# large-v3-turbo viável aqui; float32 seria ~4x mais lento sem ganho audível
# para o que estamos medindo (número e negação, não estilo).
model = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=18)

results = []
for i, job in enumerate(jobs, 1):
    print(f"[{i}/{len(jobs)}] {job['id']}", file=sys.stderr, flush=True)
    try:
        segments, info = model.transcribe(
            job["wav"],
            language="en",
            beam_size=5,
            # A janela é um recorte no meio de uma frase: não existe "texto
            # anterior" legítimo para condicionar. Deixar ligado faz o modelo
            # inventar continuidade — exatamente o tipo de alucinação plausível
            # que este passe existe para NÃO introduzir.
            condition_on_previous_text=False,
            # Sem VAD: silêncio recortado deslocaria os tempos e a gente precisa
            # saber onde, dentro da janela, cada coisa foi dita.
            vad_filter=False,
        )
        segs = [
            {"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
             "avgLogprob": round(s.avg_logprob, 3), "noSpeechProb": round(s.no_speech_prob, 3)}
            for s in segments
        ]
        results.append({
            "id": job["id"],
            "text": " ".join(s["text"] for s in segs).strip(),
            "segments": segs,
            "avgLogprob": round(sum(s["avgLogprob"] for s in segs) / len(segs), 3) if segs else None,
        })
    except Exception as exc:  # noqa: BLE001 — falha de uma janela não derruba a fila
        results.append({"id": job["id"], "text": "", "segments": [], "erro": str(exc)})

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=1)

print(f"ok — {len(results)} janela(s)", file=sys.stderr)
