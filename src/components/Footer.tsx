const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconYoutube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const IconSpotify = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 13.5c2.5-1 5.5-1 8 0" />
    <path d="M7 10.5c3-1.3 7-1.3 10 0" />
    <path d="M9 16.5c2-0.7 4-0.7 6 0" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] bg-[#080808] px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <img
              src="/logo-oscuro.png"
              alt="Oreo Rekords"
              width={84}
              height={84}
              className="object-contain"
            />
            <p className="text-xs text-zinc-600 tracking-widest uppercase mt-1">
              Sello Discográfico — Bogotá, Colombia
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-9 h-9 border border-[#1f1f1f] flex items-center justify-center text-zinc-600 hover:text-white hover:border-white transition-colors"
              aria-label="Instagram"
            >
              <IconInstagram />
            </a>
            <a
              href="#"
              className="w-9 h-9 border border-[#1f1f1f] flex items-center justify-center text-zinc-600 hover:text-white hover:border-white transition-colors"
              aria-label="YouTube"
            >
              <IconYoutube />
            </a>
            <a
              href="#"
              className="w-9 h-9 border border-[#1f1f1f] flex items-center justify-center text-zinc-600 hover:text-white hover:border-white transition-colors"
              aria-label="Spotify"
            >
              <IconSpotify />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1f1f1f]">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Oreo Rekords. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-700 tracking-widest uppercase">
            Bogotá · Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
