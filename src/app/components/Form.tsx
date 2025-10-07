"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "fail">(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSent(null);
    // TODO: podmień na realne API (np. /api/contact)
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent("ok");
  }

  return (
    <section className="w-full mt-12 py-14 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">
          Skontaktuj się z nami
        </h2>

        <div className="relative mt-10 md:mt-14">
          <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-slate-300/80 shadow-md" />
          <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-slate-300/80 shadow-md" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* FORMULARZ */}
            <form
              onSubmit={onSubmit}
              className="relative bg-slate-200 p-6 md:px-12 md:py-16 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Imię" name="firstName" placeholder="Jan" required />
                <Field label="Nazwisko" name="lastName" placeholder="Kowalski" required />
              </div>

              <div className="mt-4">
                <Field label="Email" type="email" name="email" placeholder="jan@gmail.com" required />
              </div>

              <div className="mt-4">
                <FieldTextarea label="Treść zapytania" name="message" placeholder="Napisz kilka słów…" required />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-500/90 hover:bg-orange-500 text-white px-5 py-3 font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Wysyłanie…" : "Wyślij"}
                </button>

                {sent === "ok" && (
                  <span className="text-sm text-emerald-600 font-medium">
                    Dziękujemy! Wiadomość została wysłana.
                  </span>
                )}
                {sent === "fail" && (
                  <span className="text-sm text-rose-600 font-medium">
                    Ups! Spróbuj ponownie.
                  </span>
                )}
              </div>

              {/* Dolna linia akcentowa */}
              <span className="pointer-events-none absolute inset-x-6 bottom-0 h-1 rounded-t-full bg-orange-500/80" />

              {/* ⬇️ Ta nakładka była problemem — dodane pointer-events-none */}
              <div className="pointer-events-none absolute inset-0 ring-0 ring-orange-500/0 transition-[box-shadow,transform] duration-300 hover:shadow-2xl hover:-translate-y-0.5 hover:ring-4 hover:ring-orange-500/30" />
            </form>

            {/* OBRAZ */}
            <div className="hidden md:block md:relative overflow-hidden min-h-[320px] md:min-h-[480px] bg-slate-300">
              <Image
                src="https://picsum.photos/id/1015/1200/900"
                alt="Ilustracja kontaktowa"
                fill
                priority
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-0 ring-orange-500/0 transition-[box-shadow] duration-300 hover:ring-8 hover:ring-orange-500/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition"
      />
    </label>
  );
}

function FieldTextarea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        rows={6}
        className="mt-1 w-full border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition resize-none"
      />
    </label>
  );
}
