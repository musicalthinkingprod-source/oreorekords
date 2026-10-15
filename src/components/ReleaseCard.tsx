import Link from "next/link";
import type { Release } from "@/data/releases";
import Portada from "./Portada";
import PlataformasLinks from "./PlataformasLinks";

export default function ReleaseCard({ release }: { release: Release }) {
  return (
    <article className="group bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors flex flex-col">
      <Link href={`/musica/${release.slug}`} className="block overflow-hidden">
        <Portada
          release={release}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <Link href={`/musica/${release.slug}`}>
            <h3 className="text-sm font-black uppercase tracking-wide text-white leading-snug line-clamp-2 hover:text-[#e50000] transition-colors">
              {release.titulo}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 mt-1 truncate">
            {release.artista} · {release.año}
          </p>
        </div>
        <PlataformasLinks release={release} />
      </div>
    </article>
  );
}
