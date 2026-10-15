import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Release } from "@/data/releases";
import Portada from "./Portada";
import PlataformasLinks from "./PlataformasLinks";
import SectionWrapper from "./SectionWrapper";

function fechaLarga(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LanzamientoDestacado({ release }: { release: Release }) {
  return (
    <SectionWrapper id="destacado" className="bg-[#080808] pt-6! md:pt-8!">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 md:gap-16 items-center">
        <Link href={`/musica/${release.slug}`} className="block shadow-2xl shadow-[#e50000]/10">
          <Portada release={release} sizes="(min-width: 768px) 45vw, 100vw" preload />
        </Link>

        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e50000] mb-4">
            Último lanzamiento
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-4">
            {release.titulo}
          </h2>
          <p className="text-lg text-zinc-300 mb-1">{release.artista}</p>
          <p className="text-sm text-zinc-600 mb-10">
            {fechaLarga(release.fecha)}
            {release.tracks ? ` · ${release.tracks} ${release.tracks === 1 ? "canción" : "canciones"}` : ""}
          </p>

          <p className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-500 mb-4">Escúchalo en</p>
          <PlataformasLinks release={release} variante="botones" />

          <Link
            href={`/musica/${release.slug}`}
            className="inline-flex items-center gap-1 mt-8 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
          >
            Ver lanzamiento <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
