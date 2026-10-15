import Navbar from "@/components/Navbar";
import Artistas from "@/components/Artistas";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Artistas — Oreo Rekords",
};

export default function ArtistasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Artistas />
      </main>
      <Footer />
    </>
  );
}
