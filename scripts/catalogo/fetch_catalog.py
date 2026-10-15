"""Lee el Excel de lanzamientos y busca cada título en Apple Music (iTunes API) y Deezer."""
import json, re, sys, time, unicodedata, urllib.parse, urllib.request
from difflib import SequenceMatcher
from pathlib import Path
import openpyxl

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
XLSX = r"C:\Users\DANICAR SOUND\Downloads\Control de Cargas Vaneza y Believe.xlsx"
CACHE = HERE / "cache.json"
cache = json.loads(CACHE.read_text("utf-8")) if CACHE.exists() else {}


def get(url, pause=0.0):
    if url in cache:
        return cache[url]
    for intento in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.loads(r.read().decode("utf-8"))
            cache[url] = data
            CACHE.write_text(json.dumps(cache, ensure_ascii=False), "utf-8")
            time.sleep(pause)
            return data
        except Exception as e:
            print("  reintento", intento, e, url[:90])
            time.sleep(10 * (intento + 1))
    return None


def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    s = s.replace("´", "'").replace("volumen", "vol").replace("vol.", "vol ")
    s = re.sub(r"\b(k)(umbia|uarteto)", r"c\2", s)
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = re.sub(r"\binnolvidables\b", "inolvidables", s)
    return re.sub(r"\s+", " ", s).strip()


def nums(s):
    return re.findall(r"\d+", norm(s))


def score(t1, a1, t2, a2):
    n1, n2 = norm(t1), norm(t2)
    if nums(t1) != nums(t2):
        return 0
    st = SequenceMatcher(None, n1, n2).ratio()
    if n1 in n2 or n2 in n1:
        st = max(st, 0.9)
    sa = SequenceMatcher(None, norm(a1), norm(a2)).ratio()
    if norm(a1.split(",")[0]) in norm(a2) or norm(a2) in norm(a1):
        sa = max(sa, 0.9)
    return st * 0.75 + sa * 0.25


# ---------- 1. Excel ----------
wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb.worksheets[0]
filas = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0] and str(row[0]).strip():
        filas.append({"titulo": str(row[0]).strip(), "artista": str(row[1] or "").strip(),
                      "distribuidora": "VmusicE", "estado": str(row[2] or "").strip(), "nota": row[4]})
    if row[6] and str(row[6]).strip():
        filas.append({"titulo": str(row[6]).strip(), "artista": str(row[7] or "").strip(),
                      "distribuidora": "Believe", "tiendas": row[8], "nota": row[10]})

vistos, unicos = set(), []
for f in filas:
    k = (norm(f["titulo"]), norm(f["artista"].split(",")[0]))
    if k in vistos:
        continue
    vistos.add(k)
    unicos.append(f)
print(len(filas), "filas ->", len(unicos), "únicos")


# ---------- 2. Apple Music ----------
def itunes_buscar(f):
    term = f"{f['titulo']} {f['artista'].split(',')[0]}"
    q = urllib.parse.urlencode({"term": term, "entity": "album", "country": "co", "limit": 15})
    d = get("https://itunes.apple.com/search?" + q, pause=3.2) or {"results": []}
    res = d.get("results", [])
    if not res:  # sólo título
        q = urllib.parse.urlencode({"term": f["titulo"], "entity": "album", "country": "co", "limit": 25})
        res = (get("https://itunes.apple.com/search?" + q, pause=3.2) or {}).get("results", [])
    mejor, ms = None, 0
    for a in res:
        s = score(f["titulo"], f["artista"], a["collectionName"], a["artistName"])
        if s > ms:
            mejor, ms = a, s
    if mejor and ms >= 0.72:
        return {"score": round(ms, 2), "titulo": mejor["collectionName"], "artista": mejor["artistName"],
                "fecha": mejor.get("releaseDate", "")[:10], "tracks": mejor.get("trackCount"),
                "genero": mejor.get("primaryGenreName"), "id": mejor["collectionId"],
                "url": mejor["collectionViewUrl"].split("?")[0],
                "cover": re.sub(r"/\d+x\d+bb\.jpg$", "/1000x1000bb.jpg", mejor.get("artworkUrl100", ""))}
    return None


# ---------- 3. Deezer ----------
deezer_artistas = {}


def deezer_albums(nombre):
    if nombre in deezer_artistas:
        return deezer_artistas[nombre]
    q = urllib.parse.urlencode({"q": nombre, "limit": 10})
    d = get("https://api.deezer.com/search/artist?" + q, pause=0.15) or {}
    albums = []
    for art in d.get("data", []):
        if SequenceMatcher(None, norm(art["name"]), norm(nombre)).ratio() < 0.8:
            continue
        url = f"https://api.deezer.com/artist/{art['id']}/albums?limit=500"
        albums += [dict(a, _artist=art["name"]) for a in (get(url, pause=0.15) or {}).get("data", [])]
    deezer_artistas[nombre] = albums
    return albums


def deezer_buscar(f):
    cands = []
    for nombre in {f["artista"].split(",")[0].strip(), f["artista"].strip()}:
        cands += deezer_albums(nombre)
    if not cands:
        q = urllib.parse.urlencode({"q": f["titulo"], "limit": 25})
        cands = [dict(a, _artist=a["artist"]["name"]) for a in
                 (get("https://api.deezer.com/search/album?" + q, pause=0.15) or {}).get("data", [])]
    mejor, ms = None, 0
    for a in cands:
        s = score(f["titulo"], f["artista"], a["title"], a["_artist"])
        if s > ms:
            mejor, ms = a, s
    if mejor and ms >= 0.72:
        det = get(f"https://api.deezer.com/album/{mejor['id']}", pause=0.15) or {}
        return {"score": round(ms, 2), "titulo": mejor["title"], "artista": mejor["_artist"],
                "fecha": mejor.get("release_date"), "id": mejor["id"], "url": f"https://www.deezer.com/album/{mejor['id']}",
                "cover": mejor.get("cover_xl"), "upc": det.get("upc"), "tracks": det.get("nb_tracks"),
                "sello": det.get("label")}
    return None


out = []
for i, f in enumerate(unicos, 1):
    r = dict(f)
    r["apple"] = itunes_buscar(f)
    r["deezer"] = deezer_buscar(f)
    print(f"{i:3}/{len(unicos)} {'A' if r['apple'] else '-'}{'D' if r['deezer'] else '-'} {f['titulo']} — {f['artista']}")
    out.append(r)
    (HERE / "catalogo.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), "utf-8")
print("Apple:", sum(1 for r in out if r["apple"]), "Deezer:", sum(1 for r in out if r["deezer"]),
      "Alguno:", sum(1 for r in out if r["apple"] or r["deezer"]))
