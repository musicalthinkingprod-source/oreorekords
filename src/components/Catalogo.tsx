"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { releases, artistasCatalogo } from "@/data/releases";
import ReleaseCard from "./ReleaseCard";

const POR_PAGINA = 24;

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Catalogo() {
  const params = useSearchParams();
  const [artista, setArtista] = useState(params.get("artista") ?? "");
  const [texto, setTexto] = useState("");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const filtrados = useMemo(() => {
    const q = normalizar(texto.trim());
    return releases.filter(
      (r) =>
        (!artista || r.artistaSlug === artista) &&
        (!q || normalizar(`${r.titulo} ${r.artista}`).includes(q))
    );
  }, [artista, texto]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <label className="relative flex-1">
          <span className="sr-only">Buscar lanzamiento</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="search"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setVisibles(POR_PAGINA);
            }}
            placeholder="Buscar por título o artista"
            className="w-full h-12 pl-11 pr-4 bg-[#111] border border-[#1f1f1f] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e50000]"
          />
        </label>
        <label className="sm:w-72">
          <span className="sr-only">Filtrar por artista</span>
          <select
            value={artista}
            onChange={(e) => {
              setArtista(e.target.value);
              setVisibles(POR_PAGINA);
            }}
            className="w-full h-12 px-4 bg-[#111] border border-[#1f1f1f] text-sm text-white focus:outline-none focus:border-[#e50000]"
          >
            <option value="">Todos los artistas</option>
            {artistasCatalogo.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.nombre} ({a.lanzamientos})
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-600 mb-6">
        {filtrados.length} {filtrados.length === 1 ? "lanzamiento" : "lanzamientos"}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtrados.slice(0, visibles).map((r) => (
          <ReleaseCard key={r.slug} release={r} />
        ))}
      </div>

      {visibles < filtrados.length && (
        <div className="flex justify-center mt-12">
          <button
            type="button"
            onClick={() => setVisibles(visibles + POR_PAGINA)}
            className="h-12 px-8 border border-[#333] text-zinc-300 text-xs font-bold tracking-widest uppercase hover:border-white hover:text-white transition-colors"
          >
            Cargar más ({filtrados.length - visibles})
          </button>
        </div>
      )}
    </div>
  );
}
