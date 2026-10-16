"""Descarga todo el catálogo de Deezer con label:"Oreo Rekords" (con detalle: UPC, artista, fecha)."""
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent

def get(u):
    for i in range(5):
        try:
            return json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read())
        except Exception as e:
            print("reintento", e); time.sleep(5)

albums, idx = [], 0
while True:
    d = get("https://api.deezer.com/search/album?" + urllib.parse.urlencode({"q": 'label:"Oreo Rekords"', "limit": 100, "index": idx}))
    albums += d["data"]
    idx += 100
    if idx >= d["total"]: break
print("lista", len(albums))
out = []
for a in albums:
    det = get(f"https://api.deezer.com/album/{a['id']}")
    out.append({"id": a["id"], "titulo": det["title"], "artista": det["artist"]["name"],
                "contrib": [c["name"] for c in det.get("contributors", [])],
                "fecha": det.get("release_date"), "upc": det.get("upc"), "tracks": det.get("nb_tracks"),
                "sello": det.get("label"), "cover": det.get("cover_xl"), "url": f"https://www.deezer.com/album/{a['id']}"})
    time.sleep(0.12)
(HERE / "sello_deezer.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), "utf-8")
print("ok", len(out), "únicos", len({o["id"] for o in out}))
