"""Discografía completa en Deezer de todos los artistas del sello; candidatos para las filas que faltan."""
import json, sys, time, urllib.request
from difflib import SequenceMatcher
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, ".")
from validar import titulo_norm, nums
def get(u):
    for i in range(4):
        try:
            r = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read()); time.sleep(0.12); return r
        except Exception as e: print("reintento", e); time.sleep(5)
sello = json.load(open("sello_deezer.json", encoding="utf-8"))
artistas = set()
for a in sello:
    d = get(f"https://api.deezer.com/album/{a['id']}")
    for c in d.get("contributors", []): artistas.add((c["id"], c["name"]))
print(len(artistas), "artistas")
albums = {}
for aid, nombre in artistas:
    for al in get(f"https://api.deezer.com/artist/{aid}/albums?limit=500").get("data", []):
        albums[al["id"]] = {"id": al["id"], "titulo": al["title"], "artista": nombre, "fecha": al.get("release_date")}
json.dump(list(albums.values()), open("disco_deezer.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(albums), "álbumes")
