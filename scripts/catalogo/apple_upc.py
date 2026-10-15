"""Completa Apple Music por UPC (iTunes lookup) donde Deezer dio UPC pero la búsqueda por título falló."""
import json, re, sys, time, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
CAT = HERE / "catalogo.json"
cat = json.loads(CAT.read_text("utf-8"))
n = 0
for r in cat:
    dz = r.get("deezer")
    if r.get("apple") or not dz or not dz.get("upc"):
        continue
    url = f"https://itunes.apple.com/lookup?upc={dz['upc']}&entity=album&country=co"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as resp:
            res = [a for a in json.loads(resp.read().decode())["results"] if a.get("wrapperType") == "collection"]
    except Exception as e:
        print("error", e); res = []
    time.sleep(3.2)
    if res:
        a = res[0]
        r["apple"] = {"score": 1, "titulo": a["collectionName"], "artista": a["artistName"],
                      "fecha": a.get("releaseDate", "")[:10], "tracks": a.get("trackCount"),
                      "genero": a.get("primaryGenreName"), "id": a["collectionId"],
                      "url": a["collectionViewUrl"].split("?")[0],
                      "cover": re.sub(r"/\d+x\d+bb\.jpg$", "/1000x1000bb.jpg", a.get("artworkUrl100", ""))}
        n += 1
        print("+", r["titulo"])
CAT.write_text(json.dumps(cat, ensure_ascii=False, indent=1), "utf-8")
print("Apple por UPC:", n)
