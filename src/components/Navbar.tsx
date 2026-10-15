"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/musica", label: "Música" },
  { href: "/artistas", label: "Artistas" },
  { href: "/historia", label: "Historia" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-[#080808]/95 backdrop-blur border-b border-[#1f1f1f]"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 h-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-icono.png"
            alt="Oreo Rekords"
            width={46}
            height={46}
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)) ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>


        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#080808] border-t border-[#1f1f1f] px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-300"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
