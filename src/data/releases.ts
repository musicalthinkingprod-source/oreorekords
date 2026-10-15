import data from "./releases.json";
import type { PlataformaId } from "@/lib/plataformas";

export interface Release {
  slug: string;
  titulo: string;
  artista: string;
  artistaSlug: string;
  fecha: string; // YYYY-MM-DD
  año: number;
  tracks: number | null;
  cover: string | null;
  links: Partial<Record<PlataformaId, string>>;
  // plataformas cuyo link es una búsqueda (no se encontró el álbum exacto)
  busquedas: PlataformaId[];
}

// Más reciente primero
export const releases: Release[] = (data as Release[])
  .slice()
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo));

export function getRelease(slug: string) {
  return releases.find((r) => r.slug === slug);
}

export interface ArtistaCatalogo {
  slug: string;
  nombre: string;
  lanzamientos: number;
  desde: number;
  ultimo: Release;
}

export const artistasCatalogo: ArtistaCatalogo[] = Object.values(
  releases.reduce<Record<string, ArtistaCatalogo>>((acc, r) => {
    const a = acc[r.artistaSlug];
    if (!a) {
      acc[r.artistaSlug] = { slug: r.artistaSlug, nombre: r.artista, lanzamientos: 1, desde: r.año, ultimo: r };
    } else {
      a.lanzamientos++;
      a.desde = Math.min(a.desde, r.año);
    }
    return acc;
  }, {})
).sort((a, b) => b.lanzamientos - a.lanzamientos || a.nombre.localeCompare(b.nombre));
