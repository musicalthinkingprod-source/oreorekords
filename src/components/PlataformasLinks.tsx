"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { principales, secundarias } from "@/lib/plataformas";
import type { Release } from "@/data/releases";
import PlataformaIcono from "./PlataformaIcono";

interface Props {
  release: Release;
  // "iconos": fila compacta para tarjetas; "botones": botones con nombre para el destacado
  variante?: "iconos" | "botones";
}

function titulo(release: Release, id: keyof Release["links"], nombre: string) {
  return release.busquedas.includes(id) ? `Buscar en ${nombre}` : `Escuchar en ${nombre}`;
}

export default function PlataformasLinks({ release, variante = "iconos" }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const visibles = principales.filter((p) => release.links[p.id]);
  const otras = secundarias.filter((p) => release.links[p.id]);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", cerrar);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", cerrar);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  return (
    <div ref={ref} className="relative flex flex-wrap items-center gap-2">
      {visibles.map((p) =>
        variante === "botones" ? (
          <a
            key={p.id}
            href={release.links[p.id]}
            target="_blank"
            rel="noopener noreferrer"
            title={titulo(release, p.id, p.nombre)}
            className="inline-flex items-center gap-2 h-10 px-4 border border-[#2a2a2a] text-zinc-300 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = p.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            <span style={{ color: p.color }}>
              <PlataformaIcono plataforma={p} size={16} />
            </span>
            {p.nombre}
          </a>
        ) : (
          <a
            key={p.id}
            href={release.links[p.id]}
            target="_blank"
            rel="noopener noreferrer"
            title={titulo(release, p.id, p.nombre)}
            aria-label={titulo(release, p.id, p.nombre)}
            className="w-8 h-8 flex items-center justify-center border border-[#2a2a2a] text-zinc-500 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = p.color;
              e.currentTarget.style.borderColor = p.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
              e.currentTarget.style.borderColor = "";
            }}
          >
            <PlataformaIcono plataforma={p} size={14} />
          </a>
        )
      )}

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className={`inline-flex items-center justify-center gap-1 border text-xs font-bold tracking-widest uppercase transition-colors ${
          variante === "botones" ? "h-10 px-4" : "h-8 px-2"
        } ${abierto ? "border-[#e50000] text-white" : "border-[#2a2a2a] text-zinc-500 hover:text-white hover:border-white"}`}
      >
        <Plus size={variante === "botones" ? 14 : 12} />
        Más
      </button>

      {abierto && (
        <div className="absolute z-30 top-full left-0 mt-2 w-64 bg-[#111] border border-[#2a2a2a] shadow-2xl shadow-black/60 py-2">
          {otras.map((p) => (
            <a
              key={p.id}
              href={release.links[p.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              <span style={{ color: p.color }}>
                <PlataformaIcono plataforma={p} size={16} />
              </span>
              <span className="flex-1">{p.nombre}</span>
              {release.busquedas.includes(p.id) && (
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">buscar</span>
              )}
            </a>
          ))}
          <Link
            href={`/musica/${release.slug}`}
            className="flex items-center justify-between gap-3 px-4 pt-3 pb-1.5 mt-1 border-t border-[#2a2a2a] text-xs font-bold tracking-widest uppercase whitespace-nowrap text-[#e50000] hover:text-white transition-colors"
          >
            Todas las plataformas <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
