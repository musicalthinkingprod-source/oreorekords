"""Asigna a filas del Excel los discos encontrados en el catálogo del sello (Deezer label / Apple ℗ Oreo).
Se publicaron con otro nombre de artista (p. ej. "Proyecto Cumbia Colombia", "Los Tenores") o otro título."""
import json, sys
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, ".")
from validar import sim_titulo
cat = json.load(open("catalogo.json", encoding="utf-8"))
dz = {a["titulo"]: a for a in json.load(open("sello_deezer.json", encoding="utf-8"))}
ap = json.load(open("disco_apple.json", encoding="utf-8"))
# fila del Excel -> título exacto del disco en Deezer (revisado a mano)
MAPA = {
    34: "Eres Todo Para Mí", 46: "Tuky Tuky Jazz Band Autocton", 49: "Proyecto Cumbia Vol. 1",
    134: "Proyecto Cumbia Vol. 2", 157: "Directo al Corazón Vol.2", 38: "Tenores 3", 77: "Tenores Vol. 4",
    32: "Las Mas hermosas Canciones de Amor", 140: "Tributo a Los Años Maravillosos de la Balada",
    148: "Époka Tributo A Los Años Maravillosos La Balada Vol. 2", 25: "Romántikos De La Cumbia (Volumen 1)",
}
for i, t in MAPA.items():
    d = dz[t]
    r = cat[i]
    r["deezer"] = {"score": 1, "titulo": d["titulo"], "artista": d["artista"], "fecha": d["fecha"], "id": d["id"],
                   "url": d["url"], "cover": d["cover"], "upc": d["upc"], "tracks": d["tracks"], "sello": d["sello"]}
    a = max(ap, key=lambda a: sim_titulo(a["titulo"], t))
    r["apple"] = ({"score": 1, "titulo": a["titulo"], "artista": a["artista"], "fecha": a["fecha"], "tracks": a["tracks"],
                   "id": a["id"], "url": a["url"], "cover": a["cover"]} if sim_titulo(a["titulo"], t) >= 0.85 else None)
    if r.get("ytm") and sim_titulo(r["ytm"]["titulo"], t) < 0.85:
        r["ytm"] = None
    r["sello_ok"] = True
    print(i, r["titulo"], "→", t, "| apple:", (r["apple"] or {}).get("titulo"), "| ytm:", (r.get("ytm") or {}).get("titulo"))
json.dump(cat, open("catalogo.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
