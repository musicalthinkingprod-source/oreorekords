"""Validación estricta de coincidencias: el título debe parecerse por sí solo y el artista compartir nombre."""
import re, unicodedata
from difflib import SequenceMatcher

RUIDO = re.compile(r"\s*(-\s*(single|ep)$|\((feat|en concierto|sesion|volumen)[^)]*\)|\[[^\]]*\])", re.I)
ALIAS = {"nestoro neura": "nestor neira", "munoz": "munoz", "salsaoko": "salsaoko"}


def base(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    s = s.replace("´", "'").replace("innolvidables", "inolvidables").replace("muzicalizadas", "musicalizadas")
    s = re.sub(r"\bk(umbia|uarteto|ubason|lassick|oncert)", r"c\1", s)
    s = re.sub(r"\bvol(umen)?\b\.?", " vol ", s)
    return s


def titulo_norm(s):
    s = RUIDO.sub("", base(s))
    s = RUIDO.sub("", s)
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s)).strip()


def artista_tokens(s):
    s = re.sub(r"[^a-z0-9 ]", " ", base(s))
    stop = {"grupo", "orquesta", "the", "los", "las", "la", "el", "de", "y", "feat", "and", "su", "banda", "rey", "nueva"}
    return {w for w in s.split() if len(w) >= 3 and w not in stop}


def nums(s):
    return re.findall(r"\d+", titulo_norm(s))


def sim_titulo(a, b):
    ta, tb = titulo_norm(a), titulo_norm(b)
    if nums(a) != nums(b):
        return 0.0
    s = SequenceMatcher(None, ta.replace(" ", ""), tb.replace(" ", "")).ratio()
    # un título contiene al otro (p. ej. "Néstor Neira Explorando" vs "Explorando")
    if ta and tb and (ta in tb or tb in ta) and min(len(ta), len(tb)) >= 6:
        s = max(s, 0.85)
    return s


def valido(t_excel, a_excel, t_match, a_match=None, umbral=0.82):
    if sim_titulo(t_excel, t_match) < umbral:
        return False
    if a_match is None:
        return True
    ea, ma = artista_tokens(a_excel), artista_tokens(a_match)
    # si el título incluye el nombre del artista (p. ej. "Kiki Y Su Banda"), también vale
    ea |= artista_tokens(t_excel) & ma
    return bool(ea & ma) or not ea


# Revisadas a mano: el título difiere pero es el mismo álbum
ACEPTAR = {42, 44, 52, 63, 65, 71, 73, 97, 99, 116, 118, 120, 122}


def match_valido(i, r, fuente):
    m = r.get(fuente)
    if not m:
        return None
    # sello_ok: confirmado contra el catálogo del sello (aplicar_sello.py)
    if i in ACEPTAR or r.get("sello_ok") or valido(r["titulo"], r["artista"], m["titulo"], m.get("artista")):
        return m
    return None
