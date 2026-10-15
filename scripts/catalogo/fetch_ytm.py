"""Añade YouTube Music / YouTube a catalogo.json."""
import json, re, sys, time, unicodedata
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import ytm  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
CAT = HERE / "catalogo.json"
YCACHE = HERE / "ytm_cache.json"
ycache = json.loads(YCACHE.read_text("utf-8")) if YCACHE.exists() else {}


def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    s = re.sub(r"\b(k)(umbia|uarteto)", r"c\2", s.replace("vol.", "vol "))
    s = re.sub(r"[^a-z0-9 ]", " ", s).replace("innolvidables", "inolvidables")
    return re.sub(r"\s+", " ", s).strip()


def score(t1, a1, t2, a2):
    if re.findall(r"\d+", norm(t1)) != re.findall(r"\d+", norm(t2)):
        return 0
    n1, n2 = norm(t1), norm(t2)
    st = max(SequenceMatcher(None, n1, n2).ratio(), 0.9 if (n1 in n2 or n2 in n1) else 0)
    a = norm(a1.split(",")[0])
    sa = max(SequenceMatcher(None, a, norm(a2)).ratio(), 0.9 if a and a in norm(a2) else 0)
    return st * 0.75 + sa * 0.25


cat = json.loads(CAT.read_text("utf-8"))
for i, r in enumerate(cat, 1):
    titulo = (r.get("apple") or r.get("deezer") or {}).get("titulo") or r["titulo"]
    artista = (r.get("apple") or r.get("deezer") or {}).get("artista") or r["artista"]
    q = f"{titulo} {artista.split(',')[0]}"
    if q not in ycache:
        try:
            ycache[q] = ytm.buscar_albums(q)
        except Exception as e:
            print("error", e); ycache[q] = []
        time.sleep(0.6)
    mejor, ms = None, 0
    for a in ycache[q]:
        partes = [p.strip() for p in a["sub"].split("•")]
        art = partes[1] if len(partes) > 1 else a["sub"]
        s = score(titulo, artista, a["titulo"], art)
        if s > ms:
            mejor, ms = a, s
    r["ytm"] = None
    if mejor and ms >= 0.72:
        key = "pl:" + mejor["browseId"]
        if key not in ycache:
            try:
                ycache[key] = ytm.playlist_id(mejor["browseId"])
            except Exception as e:
                print("error pl", e); ycache[key] = None
            time.sleep(0.6)
        r["ytm"] = {"score": round(ms, 2), "titulo": mejor["titulo"], "browseId": mejor["browseId"],
                    "playlistId": ycache[key]}
    YCACHE.write_text(json.dumps(ycache, ensure_ascii=False), "utf-8")
    print(f"{i:3}/{len(cat)} {'Y' if r['ytm'] else '-'} {r['titulo']}")
CAT.write_text(json.dumps(cat, ensure_ascii=False, indent=1), "utf-8")
print("YTM:", sum(1 for r in cat if r["ytm"]))
