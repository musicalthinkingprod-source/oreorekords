import { Music } from "lucide-react";
import type { Plataforma } from "@/lib/plataformas";

export default function PlataformaIcono({ plataforma, size = 16 }: { plataforma: Plataforma; size?: number }) {
  if (!plataforma.path) return <Music size={size} aria-hidden />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={plataforma.path} />
    </svg>
  );
}
