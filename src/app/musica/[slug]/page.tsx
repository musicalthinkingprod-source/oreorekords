import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Portada from "@/components/Portada";
import PlataformaIcono from "@/components/PlataformaIcono";
import ReleaseCard from "@/components/ReleaseCard";
import { releases, getRelease } from "@/data/releases";
import { plataformas } from "@/lib/plataformas";

export const dynamicParams = false;

export function generateStaticParams() {
  return releases.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const release = getRelease((await params).slug);
  if (!release) return {};
  return {
    title: `${release.titulo} — ${release.artista} | Oreo Rekords`,
    description: `Escucha ${release.titulo} de ${release.artista} en Spotify, Apple Music, YouTube Music, Tidal, Deezer y más.`,
    openGraph: release.cover ? { images: [release.cover] } : undefined,
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const release = getRelease((await params).slug);
  if (!release) notFound();

  const disponibles = plataformas.filter((p) => release.links[p.id]);
  const delArtista = releases.filter((r) => r.artistaSlug === release.artistaSlug && r.slug !== release.slug).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#080808]">
        <section className="px-6 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/musica"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors mb-10"
            >
              <ArrowLeft size={14} /> Toda la música
            </Link>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <Portada release={release} sizes="(min-width: 768px) 40vw, 100vw" preload className="shadow-2xl shadow-[#e50000]/10" />

              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e50000] mb-4">{release.año}</p>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] mb-3">
                  {release.titulo}
                </h1>
                <Link
                  href={`/musica?artista=${release.artistaSlug}`}
                  className="text-lg text-zinc-300 hover:text-[#e50000] transition-colors"
                >
                  {release.artista}
                </Link>
                {release.tracks ? (
                  <p className="text-sm text-zinc-600 mt-1">
                    {release.tracks} {release.tracks === 1 ? "canción" : "canciones"}
                  </p>
                ) : null}

                <p className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-500 mt-10 mb-4">Escúchalo en</p>
                <ul className="border-t border-[#1f1f1f]">
                  {disponibles.map((p) => (
                    <li key={p.id} className="border-b border-[#1f1f1f]">
                      <a
                        href={release.links[p.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 py-4 group"
                      >
                        <span style={{ color: p.color }}>
                          <PlataformaIcono plataforma={p} size={22} />
                        </span>
                        <span className="flex-1 text-sm font-bold uppercase tracking-wider text-zinc-200 group-hover:text-white">
                          {p.nombre}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-zinc-600 group-hover:text-[#e50000] transition-colors">
                          {release.busquedas.includes(p.id) ? "Buscar" : "Escuchar"} <ArrowUpRight size={12} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {delArtista.length > 0 && (
          <section className="px-6 md:px-16 lg:px-24 pb-24">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e50000]">Más de {release.artista}</p>
                <Link
                  href={`/musica?artista=${release.artistaSlug}`}
                  className="text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  Ver todo <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {delArtista.map((r) => (
                  <ReleaseCard key={r.slug} release={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
