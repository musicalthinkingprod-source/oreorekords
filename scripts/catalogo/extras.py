"""Discos del sello (Deezer label:"Oreo Rekords" + Apple ℗ Oreo/Vmusice) que no están en el Excel -> extras.json."""
import json, re, sys, time, urllib.request
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from validar import sim_titulo
import ytm

site = json.load(open(r"C:\laragon\www\oreorekords\src\data\releases.json", encoding="utf-8"))
usados_dz = {s["links"]["deezer"].rstrip("/").split("/")[-1] for s in site if "deezer" in s["links"]}
usados_ap = {s["links"]["appleMusic"].rstrip("/").split("/")[-1] for s in site if "appleMusic" in s["links"]}
dz = [a for a in json.load(open(HERE / "sello_deezer.json", encoding="utf-8")) if str(a["id"]) not in usados_dz]
ap = [a for a in json.load(open(HERE / "disco_apple.json", encoding="utf-8"))
      if any(k in (a["copyright"] or "").lower() for k in ("oreo", "vmusice")) and str(a["id"]) not in usados_ap]

def get(u):
    for i in range(5):
        try:
            r = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read())
            time.sleep(3.2); return r
        except Exception as e:
            print("reintento", e); time.sleep(15 * (i + 1))

def apple_dict(a):
    return {"titulo": a["titulo"], "artista": a["artista"], "fecha": a["fecha"], "tracks": a["tracks"], "id": a["id"], "url": a["url"], "cover": a["cover"]}

extras, ap_usados = [], set()
for d in dz:
    m = None
    if d.get("upc"):
        res = [x for x in (get(f"https://itunes.apple.com/lookup?upc={d['upc']}&entity=album&country=co") or {}).get("results", []) if x.get("wrapperType") == "collection"]
        if res:
            x = res[0]
            m = {"titulo": x["collectionName"], "artista": x["artistName"], "fecha": x.get("releaseDate", "")[:10], "tracks": x.get("trackCount"),
                 "id": x["collectionId"], "url": x["collectionViewUrl"].split("?")[0],
                 "cover": re.sub(r"/\d+x\d+bb\.jpg$", "/1000x1000bb.jpg", x.get("artworkUrl100", ""))}
    if m and str(m["id"]) in usados_ap:
        continue  # ya está en la página por Apple
    if m: ap_usados.add(m["id"])
    extras.append({"deezer": d, "apple": m})
for a in ap:
    if a["id"] in ap_usados: continue
    # mismo disco que un extra de Deezer sin UPC coincidente
    if any(e["apple"] is None and sim_titulo(e["deezer"]["titulo"], a["titulo"]) >= 0.9 for e in extras):
        e = next(e for e in extras if e["apple"] is None and sim_titulo(e["deezer"]["titulo"], a["titulo"]) >= 0.9)
        e["apple"] = apple_dict(a); continue
    extras.append({"deezer": None, "apple": apple_dict(a)})

for e in extras:
    b = e["apple"] or e["deezer"]
    q = f"{b['titulo']} {b['artista']}"
    try:
        res = ytm.buscar_albums(q)
    except Exception as ex:
        print("ytm error", ex); res = []
    e["ytm"] = None
    for r in res:
        if sim_titulo(r["titulo"], b["titulo"]) >= 0.9 and any(w in r["sub"].lower() for w in b["artista"].lower().split()[:2]):
            try:
                pl = ytm.playlist_id(r["browseId"])
            except Exception:
                pl = None
            e["ytm"] = {"titulo": r["titulo"], "browseId": r["browseId"], "playlistId": pl}
            break
    time.sleep(0.6)
    print(("D" if e["deezer"] else "-") + ("A" if e["apple"] else "-") + ("Y" if e["ytm"] else "-"), b["artista"], "|", b["titulo"], "|", (e["deezer"] or {}).get("upc"))
json.dump(extras, open(HERE / "extras.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(extras), "extras")
