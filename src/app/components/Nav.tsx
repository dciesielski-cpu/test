"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Youtube, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/oferta", label: "OFERTA ZIMA 2026" },
  { href: "/kontakt", label: "KONTAKT I PYTANIA" },
  { href: "/galeria", label: "GALERIA" },
  { href: "/kadra", label: "KADRA" },
  { href: "/do-pobrania", label: "DO POBRANIA" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <header className="sticky top-0 z-[9999] w-full bg-orange-500 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative h-10 w-10 md:h-12 md:w-12">
              <Image src="/logo.png" alt="Sportwin" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center justify-center">
            <ul className="flex items-center gap-6 lg:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold tracking-wide hover:text-indigo-950/95 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social + burger */}
          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com/"
              aria-label="Facebook"
              className="grid place-items-center h-8 w-8 rounded-full bg-white/90 hover:bg-white text-orange-600 shadow-sm"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href="https://youtube.com/"
              aria-label="YouTube"
              className="grid place-items-center h-8 w-8 rounded-full bg-white/90 hover:bg-white text-orange-600 shadow-sm"
            >
              <Youtube className="h-4 w-4" />
            </Link>
            <button
              className="md:hidden grid place-items-center h-9 w-9 rounded-md bg-white/10 hover:bg-white/15 relative z-[9999]"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen mobile nav */}
      {open && (
        <div className="fixed inset-0 z-50 bg-orange-600/95 flex flex-col items-center justify-center gap-6 p-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-white hover:text-indigo-950 transition"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-4 mt-10">
            <Link href="https://facebook.com/" aria-label="Facebook" className="h-10 w-10 rounded-full bg-white text-orange-600 grid place-items-center">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://youtube.com/" aria-label="YouTube" className="h-10 w-10 rounded-full bg-white text-orange-600 grid place-items-center">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
