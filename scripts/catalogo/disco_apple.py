"""Discografía completa en Apple Music de cada artista que ya tiene algún disco del sello."""
import json, sys, time, urllib.parse, urllib.request
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
site = json.load(open(r"C:\laragon\www\oreorekords\src\data\releases.json", encoding="utf-8"))

def get(u):
    for i in range(6):
        try:
            r = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read())
            time.sleep(3.2)
            return r
        except Exception as e:
            print("reintento", e); time.sleep(15 * (i + 1))

ids = [s["links"]["appleMusic"].rstrip("/").split("/")[-1] for s in site if "appleMusic" in s["links"]]
artistas = {}
for k in range(0, len(ids), 150):
    for r in get("https://itunes.apple.com/lookup?country=co&id=" + ",".join(ids[k:k+150]))["results"]:
        if r.get("artistId"):
            artistas[r["artistId"]] = r["artistName"]
print(len(artistas), "artistas en Apple")
albums = {}
for aid, nombre in artistas.items():
    res = get(f"https://itunes.apple.com/lookup?country=co&entity=album&limit=200&id={aid}")["results"]
    for a in res:
        if a.get("wrapperType") == "collection":
            albums[a["collectionId"]] = {"id": a["collectionId"], "titulo": a["collectionName"], "artista": a["artistName"],
                "fecha": a.get("releaseDate", "")[:10], "tracks": a.get("trackCount"), "copyright": a.get("copyright"),
                "url": a["collectionViewUrl"].split("?")[0], "cover": a.get("artworkUrl100", "").replace("100x100bb", "1000x1000bb")}
    print(nombre, len(res) - 1)
(HERE / "disco_apple.json").write_text(json.dumps(list(albums.values()), ensure_ascii=False, indent=1), "utf-8")
print("total álbumes", len(albums))
