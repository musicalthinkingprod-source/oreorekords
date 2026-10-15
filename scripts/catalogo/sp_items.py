"""Genera la lista de entrada para la búsqueda en Spotify (desde catalogo.json, sólo coincidencias validadas)."""
import json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from validar import match_valido  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
cat = json.loads((Path(__file__).parent / "catalogo.json").read_text("utf-8"))
items = []
for i, r in enumerate(cat):
    dz = match_valido(i, r, "deezer")
    items.append({"i": i, "upc": (dz or {}).get("upc") or "", "titulo": r["titulo"], "artista": r["artista"]})
print(json.dumps(items, ensure_ascii=False, separators=(",", ":")))
