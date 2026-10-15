import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { releases, artistasCatalogo } from "@/data/releases";
import { plataformas } from "@/lib/plataformas";

const pilares = [
  {
    numero: "01",
    titulo: "Producimos",
    descripcion: "Grabamos, arreglamos y producimos cada proyecto cuidando el sonido y la identidad de cada artista.",
  },
  {
    numero: "02",
    titulo: "Distribuimos",
    descripcion: "Llevamos cada lanzamiento a las principales plataformas digitales del mundo.",
  },
  {
    numero: "03",
    titulo: "Construimos catálogo",
    descripcion: "Salsa, cumbia, bolero, balada, música infantil, instrumental y más: un catálogo que crece cada año.",
  },
];

export default function Historia() {
  const años = releases.map((r) => r.año);
  const desde = años.length ? Math.min(...años) : new Date().getFullYear();

  const porAño = Object.entries(
    releases.reduce<Record<number, number>>((acc, r) => {
      acc[r.año] = (acc[r.año] ?? 0) + 1;
      return acc;
    }, {})
  ).sort(([a], [b]) => Number(a) - Number(b));
  const max = Math.max(1, ...porAño.map(([, n]) => n));

  const stats = [
    { value: releases.length, label: "Lanzamientos" },
    { value: artistasCatalogo.length, label: "Artistas" },
    { value: plataformas.length, label: "Plataformas" },
    { value: desde, label: "Primer lanzamiento" },
  ];

  return (
    <>
      <SectionWrapper id="historia" className="bg-[#080808]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle
              label="Nuestra Historia"
              title="Un sello que construye legados"
              subtitle="Oreo Rekords nació en Bogotá con una misión clara: producir música colombiana y llevarla al mundo."
            />
            <p className="text-zinc-400 leading-relaxed mb-6">
              Somos un sello independiente que trabaja con artistas de todos los géneros —salsa, cumbia, bolero,
              balada, tropical, música infantil e instrumental—, apostando por su música a largo plazo.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Nuestra inspiración viene de los grandes sellos que construyeron la historia de la música: Codiscos,
              Discos Fuentes, Capitol Records, Atlantic. Esa herencia nos guía hacia un estándar que no negocia visión
              ni calidad.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="border border-[#1f1f1f] p-6 md:p-8 bg-[#111]">
                <p className="text-4xl md:text-5xl font-black text-[#e50000] leading-none mb-2">{s.value}</p>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="como-trabajamos" className="bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <SectionTitle label="Cómo Trabajamos" title="El Proceso del Sello" />
          <div className="grid md:grid-cols-3 gap-6">
            {pilares.map((p) => (
              <div key={p.numero} className="relative border border-[#1f1f1f] bg-[#111] p-8">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#e50000]" />
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-600 mb-2">Paso {p.numero}</p>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{p.titulo}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {porAño.length > 1 && (
        <SectionWrapper id="linea-de-tiempo" className="bg-[#080808]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              label="Línea de Tiempo"
              title="Lanzamientos por año"
              subtitle="Cada barra es un año de música publicada por el sello."
            />
            <div className="flex items-end gap-2 md:gap-3 h-56 border-b border-[#1f1f1f]">
              {porAño.map(([año, n]) => (
                <div key={año} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <span className="text-xs font-bold text-zinc-500 group-hover:text-white mb-2">{n}</span>
                  <div
                    className="w-full bg-[#e50000]/70 group-hover:bg-[#e50000] transition-colors"
                    style={{ height: `${(n / max) * 80}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 md:gap-3 mt-3">
              {porAño.map(([año]) => (
                <span key={año} className="flex-1 text-center text-[10px] md:text-xs font-bold text-zinc-600">
                  {año}
                </span>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
