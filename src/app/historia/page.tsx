import Navbar from "@/components/Navbar";
import Historia from "@/components/Historia";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Historia — Oreo Rekords",
};

export default function HistoriaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Historia />
      </main>
      <Footer />
    </>
  );
}
