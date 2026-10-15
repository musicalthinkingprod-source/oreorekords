import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import SectionTitle from "@/components/SectionTitle";
import Catalogo from "@/components/Catalogo";
import { releases } from "@/data/releases";

export const metadata = {
  title: "Música — Oreo Rekords",
  description: "Todos los lanzamientos de Oreo Rekords en Spotify, Apple Music, YouTube Music, Tidal, Deezer y más.",
};

export default function MusicaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <SectionWrapper id="musica" className="bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              label="Discografía"
              title="Música"
              subtitle={`${releases.length} lanzamientos del sello, del más reciente al primero. Escúchalos en tu plataforma favorita.`}
            />
            <Suspense>
              <Catalogo />
            </Suspense>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
