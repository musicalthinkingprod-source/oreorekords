"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 120;
      const barWidth = canvas.width / bars;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth;
        const wave1 = Math.sin((i / bars) * Math.PI * 6 + offset) * 0.5;
        const wave2 = Math.sin((i / bars) * Math.PI * 3 + offset * 0.7) * 0.3;
        const wave3 = Math.sin((i / bars) * Math.PI * 12 + offset * 1.3) * 0.2;
        const amplitude = (wave1 + wave2 + wave3) * centerY * 0.7;

        const alpha = 0.3 + Math.abs(wave1) * 0.7;
        ctx.fillStyle = `rgba(229, 0, 0, ${alpha})`;
        ctx.fillRect(x, centerY - Math.abs(amplitude), barWidth - 1, Math.abs(amplitude) * 2);
      }

      offset += 0.025;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#080808]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080808]/20 to-[#080808]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-10 md:pt-28 md:pb-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="shrink-0"
        >
          <Image
            src="/logo-oscuro.png"
            alt="Oreo Rekords"
            width={150}
            height={150}
            preload
            className="object-contain w-24 h-24 md:w-36 md:h-36"
          />
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#e50000] text-xs font-bold tracking-[0.4em] uppercase mb-3"
          >
            Sello Discográfico — Bogotá, Colombia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white"
          >
            OREO <span className="text-[#e50000]">REKORDS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed mt-4 mb-6"
          >
            Música colombiana producida en Bogotá y disponible en todas las plataformas: salsa, cumbia, bolero, balada y mucho más.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
          >
            <Link
              href="/musica"
              className="inline-flex items-center justify-center h-11 px-6 bg-[#e50000] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#b30000] transition-colors"
            >
              Escuchar Música
            </Link>
            <Link
              href="/historia"
              className="inline-flex items-center justify-center h-11 px-6 border border-[#333] text-zinc-300 text-xs font-bold tracking-widest uppercase hover:border-white hover:text-white transition-colors"
            >
              Nuestra Historia
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
