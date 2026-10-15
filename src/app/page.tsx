import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LanzamientoDestacado from "@/components/LanzamientoDestacado";
import ReleaseCard from "@/components/ReleaseCard";
import SectionWrapper from "@/components/SectionWrapper";
import SectionTitle from "@/components/SectionTitle";
import Footer from "@/components/Footer";
import { releases, artistasCatalogo } from "@/data/releases";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  const [ultimo, ...resto] = releases;
  const recientes = resto.slice(0, 8);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {ultimo && <LanzamientoDestacado release={ultimo} />}

        {recientes.length > 0 && (
          <SectionWrapper id="recientes" className="bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <SectionTitle label="Discografía" title="Lanzamientos recientes" />
                <Link
                  href="/musica"
                  className="mb-16 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  Ver toda la música ({releases.length}) <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {recientes.map((r) => (
                  <ReleaseCard key={r.slug} release={r} />
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}

        {artistasCatalogo.length > 0 && (
          <section className="bg-[#080808] px-6 md:px-16 lg:px-24 py-24 border-t border-[#1f1f1f]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e50000] mb-3">Artistas</p>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                    {artistasCatalogo.length} voces, un sello
                  </h2>
                </div>
                <Link
                  href="/artistas"
                  className="text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  Ver artistas <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {artistasCatalogo.slice(0, 18).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/musica?artista=${a.slug}`}
                    className="px-4 py-2 border border-[#1f1f1f] text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:border-[#e50000] transition-colors"
                  >
                    {a.nombre}
                  </Link>
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
