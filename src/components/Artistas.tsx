import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import Portada from "./Portada";
import { artistasCatalogo } from "@/data/releases";

export default function Artistas() {
  return (
    <SectionWrapper id="artistas" className="bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          label="Nuestros Artistas"
          title="Artistas"
          subtitle={`${artistasCatalogo.length} artistas y agrupaciones que han lanzado su música con Oreo Rekords.`}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {artistasCatalogo.map((a) => (
            <Link
              key={a.slug}
              href={`/musica?artista=${a.slug}`}
              className="group bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#e50000]/50 transition-colors"
            >
              <div className="overflow-hidden">
                <Portada
                  release={a.ultimo}
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-[1.03] grayscale-[35%] group-hover:grayscale-0"
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-white leading-snug group-hover:text-[#e50000] transition-colors">
                    {a.nombre}
                  </h3>
                  <ArrowUpRight size={16} className="shrink-0 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {a.lanzamientos} {a.lanzamientos === 1 ? "lanzamiento" : "lanzamientos"} · desde {a.desde}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
