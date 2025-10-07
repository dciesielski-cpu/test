import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-indigo-950 text-slate-200">
      {/* Pomarańczowa linia u góry jak w zrzucie */}
      <div className="h-1 w-full bg-orange-500" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Kontakt (mail + tel) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-300" />
              <a href="mailto:obozy@aprlampart.pl" className="hover:text-white transition">
                obozy@aprlampart.pl
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-300" />
              <a href="tel:+48519400071" className="hover:text-white transition">
                +48 519 400 071
              </a>
            </div>
          </div>


          {/* Logo / CTA bok (opcjonalne) */}
          <div className="md:text-right text-sm">
            <p className="opacity-80">polityka cookies</p>
            <p className="opacity-80">regulamin</p>
          </div>
        </div>

        {/* Linia oddzielająca */}
        <div className="my-6 h-px bg-slate-700/60" />

        {/* Informacja prawna jak w zrzucie */}
        <p className="text-xs leading-relaxed text-slate-300/80 max-w-5xl">
          Organizatorem obozów jest Sportwin Sp. z o.o., ul. Źródlana 19/1A, 60-642 Poznań.
          Numer w rejestrze organizatorów turystyki: 1122. Organ nadzorujący: Marszałek Województwa Wielkopolskiego.
        </p>

        {/* Dolny pasek copyright */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sportwin. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
