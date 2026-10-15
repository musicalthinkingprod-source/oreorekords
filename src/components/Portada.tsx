import Image from "next/image";
import { Disc3 } from "lucide-react";
import type { Release } from "@/data/releases";

interface Props {
  release: Release;
  sizes: string;
  preload?: boolean;
  className?: string;
}

export default function Portada({ release, sizes, preload, className = "" }: Props) {
  return (
    <div className={`relative aspect-square bg-[#141414] overflow-hidden ${className}`}>
      {release.cover ? (
        <Image
          src={release.cover}
          alt={`${release.titulo} — ${release.artista}`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
          <Disc3 size={48} />
        </div>
      )}
    </div>
  );
}
