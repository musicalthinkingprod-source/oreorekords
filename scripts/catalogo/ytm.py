"""Búsqueda de álbumes en YouTube Music (endpoint público del cliente web)."""
import json, sys, time, urllib.request

CTX = {"client": {"clientName": "WEB_REMIX", "clientVersion": "1.20250101.01.00", "hl": "es", "gl": "CO"}}
ALBUM_FILTER = "EgWKAQIYAWoMEA4QChADEAQQCRAF"


def post(endpoint, body):
    req = urllib.request.Request(
        f"https://music.youtube.com/youtubei/v1/{endpoint}?prettyPrint=false",
        data=json.dumps({"context": CTX, **body}).encode(),
        headers={"Content-Type": "application/json", "Origin": "https://music.youtube.com",
                 "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def walk(o, key):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == key:
                yield v
            yield from walk(v, key)
    elif isinstance(o, list):
        for v in o:
            yield from walk(v, key)


def runs_text(col):
    return "".join(r.get("text", "") for r in col.get("text", {}).get("runs", []))


def buscar_albums(query):
    d = post("search", {"query": query, "params": ALBUM_FILTER})
    out = []
    for it in walk(d, "musicResponsiveListItemRenderer"):
        cols = [c["musicResponsiveListItemFlexColumnRenderer"] for c in it.get("flexColumns", [])]
        if len(cols) < 2:
            continue
        browse = next(walk(it.get("navigationEndpoint", {}), "browseId"), None)
        if not browse or not browse.startswith("MPREb"):
            continue
        sub = [r.get("text", "") for r in cols[1].get("text", {}).get("runs", [])]
        out.append({"titulo": runs_text(cols[0]), "sub": "".join(sub), "browseId": browse})
    return out


def playlist_id(browse_id):
    d = post("browse", {"browseId": browse_id})
    return next(walk(d, "audioPlaylistId"), None) or next(walk(d, "playlistId"), None)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    for a in buscar_albums(sys.argv[1]):
        print(a)
    time.sleep(0.5)
