"""Fusiona catalogo.json + spotify.json -> src/data/releases.json y descarga portadas."""
import json, re, sys, time, unicodedata, urllib.parse, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).parent
PROJ = Path(r"C:\laragon\www\oreorekords")
COVERS = PROJ / "public" / "covers"
COVERS.mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(HERE))
from validar import match_valido, valido, sim_titulo, ACEPTAR  # noqa: E402

cat = json.loads((HERE / "catalogo.json").read_text("utf-8"))

# spotify_raw.txt: índice|url|título|artista|año|vía (upc o título)
spotify = {}
for linea in (HERE / "spotify_raw.txt").read_text("utf-8").splitlines():
    if not linea.strip():
        continue
    i, url, titulo, artista, año, via = linea.split("|")
    spotify[int(i)] = {"url": url, "titulo": titulo, "artista": artista, "año": int(año), "via": via}


def spotify_valido(i, r):
    sp = spotify.get(i)
    if not sp:
        return None
    if i in ACEPTAR or cat[i].get("sello_ok"):
        return sp
    if sp["via"] == "upc":
        # el UPC ya identifica el álbum; basta con que el artista coincida y el título se parezca
        return sp if valido(r["titulo"], r["artista"], sp["titulo"], sp["artista"], umbral=0.6) else None
    return sp if valido(r["titulo"], r["artista"], sp["titulo"], sp["artista"]) else None


# browseId -> artista según el subtítulo del resultado ("Álbum • Artista • Año")
ytm_artista = {}
for clave, res in json.loads((HERE / "ytm_cache.json").read_text("utf-8")).items():
    if clave.startswith("pl:") or not isinstance(res, list):
        continue
    for a in res:
        partes = [p.strip() for p in a["sub"].split("•")]
        ytm_artista[a["browseId"]] = partes[1] if len(partes) > 2 else a["sub"]


def ytm_valido(i, r):
    yt = r.get("ytm")
    if not yt:
        return None
    if i in ACEPTAR or r.get("sello_ok"):
        return yt
    return yt if valido(r["titulo"], r["artista"], yt["titulo"], ytm_artista.get(yt["browseId"], "")) else None

ARTISTAS = {  # nombre normalizado -> nombre a mostrar
    "nestor neira": "Néstor Neira",
    "nestor neira el rey de la nueva cumbia": "Néstor Neira El Rey De La Nueva Kumbia",
    "nestor neira el rey de la nueva kumbia": "Néstor Neira El Rey De La Nueva Kumbia",
    "nestor neira y salsaoko": "Néstor Neira Y Salsaoko",
    "orquesta la pesada": "Orquesta La Pesada",
    "doktor korazon": "Doktor Korazón",
    "elektroakustik": "Elektroakústik",
    "elektroakustic": "Elektroakústik",
    "grupo akustiko": "Grupo Acústiko",
    "grupo acustiko": "Grupo Acústiko",
    "kubason": "Grupo Kubason",
    "grupo kubason": "Grupo Kubason",
    "juliana salazar": "Juliana Salazar",
    "grupo los chachos": "Grupo Los Chachos",
    "compania tributo": "Tributo Big Band",
    "los tenores": "Los Tenores",
    "grupo matiz": "Grupo Matiz",
    "alvaro gonzalez": "Álvaro González",
    "la banda del merengue": "La Banda Del Merengue",
}


def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s)).strip()


def slugify(s):
    return re.sub(r"\s+", "-", norm(s))[:80].strip("-")


def artista_principal(nombre):
    base = nombre.split(",")[0].strip()
    return ARTISTAS.get(norm(base), base.strip())


def descargar(url, destino):
    if destino.exists() and destino.stat().st_size > 1000:
        return True
    for intento in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                destino.write_bytes(r.read())
            return True
        except Exception as e:
            print("  error portada", e, url[:80])
            time.sleep(3)
    return False


def q(s):
    return urllib.parse.quote(s)


EXCLUIR = {132, 146, 165}  # pendientes o con coincidencias dudosas
# filas del Excel + discos del sello que no están en el Excel (extras.py)
fuentes = []
for i, r in enumerate(cat):
    if i in EXCLUIR:
        continue
    fuentes.append((f"#{i} {r['titulo']} — {r['artista']} ({r['distribuidora']})", r["titulo"], r["artista"],
                    match_valido(i, r, "apple"), match_valido(i, r, "deezer"), spotify_valido(i, r), ytm_valido(i, r)))
for e in json.loads((HERE / "extras.json").read_text("utf-8")):
    b = e["apple"] or e["deezer"]
    sp = {"url": e["spotify"], "titulo": b["titulo"]} if e.get("spotify") else None
    fuentes.append((f"[sello] {b['titulo']} — {b['artista']}", b["titulo"], b["artista"], e["apple"], e["deezer"], sp, e.get("ytm")))

salida, sin_datos, slugs, ids_vistos, duplicados = [], [], set(), set(), []
for etiqueta, titulo_excel, artista_excel, ap, dz, sp, yt in fuentes:
    if not (ap or dz or sp or yt):
        sin_datos.append(etiqueta.split(" ", 1)[1])
        continue
    ids = {f"sp:{sp['url']}" if sp else None, f"ap:{ap['id']}" if ap else None,
           f"dz:{dz['id']}" if dz else None, f"yt:{yt['browseId']}" if yt else None} - {None}
    if ids & ids_vistos:
        duplicados.append(etiqueta)
        ids_vistos |= ids
        continue
    ids_vistos |= ids
    r = {"titulo": titulo_excel, "artista": artista_excel}

    titulo = (ap or dz or {}).get("titulo") or (sp or {}).get("titulo") or r["titulo"]
    titulo = re.sub(r"\s+", " ", re.sub(r"\s+-\s+(Single|EP)$", "", titulo)).strip()
    artista = artista_principal(r["artista"])
    fecha = (ap or {}).get("fecha") or (dz or {}).get("fecha") or (f"{sp['año']}-01-01" if sp and sp.get("año") else "")
    if not fecha:
        fecha = "2000-01-01"

    slug = slugify(f"{artista} {titulo}")
    base, n = slug, 2
    while slug in slugs:
        slug, n = f"{base}-{n}", n + 1
    slugs.add(slug)

    links = {}
    busquedas = []
    if sp:
        links["spotify"] = sp["url"]
    if ap:
        links["appleMusic"] = ap["url"]
    if yt and yt.get("playlistId"):
        links["youtubeMusic"] = f"https://music.youtube.com/playlist?list={yt['playlistId']}"
        links["youtube"] = f"https://www.youtube.com/playlist?list={yt['playlistId']}"
    elif yt:
        links["youtubeMusic"] = f"https://music.youtube.com/browse/{yt['browseId']}"
    if dz:
        links["deezer"] = dz["url"]

    termino = f"{titulo} {artista}"
    links["tidal"] = f"https://tidal.com/search?q={q(termino)}"
    busquedas.append("tidal")
    links["amazonMusic"] = f"https://music.amazon.com/search/{q(termino)}"
    busquedas.append("amazonMusic")
    if ap:
        links["itunes"] = f"https://music.apple.com/co/album/{ap['id']}?app=itunes"
    for pid, url in (
        ("pandora", f"https://www.pandora.com/search/{q(termino)}/all"),
        ("soundcloud", f"https://soundcloud.com/search?q={q(termino)}"),
        ("audiomack", f"https://audiomack.com/search?q={q(termino)}"),
    ):
        links[pid] = url
        busquedas.append(pid)

    cover = None
    fuente = None
    if ap and ap.get("cover"):
        fuente = ap["cover"].replace("1000x1000bb", "600x600bb")
    elif dz and dz.get("cover"):
        fuente = dz["cover"].replace("1000x1000", "600x600")
    elif sp:
        try:
            oembed = f"https://open.spotify.com/oembed?url={q(sp['url'])}"
            with urllib.request.urlopen(urllib.request.Request(oembed, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as resp:
                fuente = json.loads(resp.read().decode()).get("thumbnail_url")
        except Exception as e:
            print("  error oembed", e)
    if fuente and descargar(fuente, COVERS / f"{slug}.jpg"):
        cover = f"/covers/{slug}.jpg"

    salida.append({
        "slug": slug,
        "titulo": titulo,
        "artista": artista,
        "artistaSlug": slugify(artista),
        "fecha": fecha,
        "año": int(fecha[:4]),
        "tracks": (ap or {}).get("tracks") or (dz or {}).get("tracks"),
        "cover": cover,
        "links": links,
        "busquedas": busquedas,
    })

(PROJ / "src" / "data" / "releases.json").write_text(json.dumps(salida, ensure_ascii=False, indent=1), "utf-8")
(HERE / "sin_datos.txt").write_text("\n".join(sin_datos), "utf-8")
print("Publicados:", len(salida), "| sin datos:", len(sin_datos), "| duplicados:", len(duplicados))
for k in ("spotify", "appleMusic", "youtubeMusic", "youtube", "deezer"):
    print(f"  {k}: {sum(1 for s in salida if k in s['links'])}")
print("\n".join(duplicados))
print("  portadas:", sum(1 for s in salida if s["cover"]))
