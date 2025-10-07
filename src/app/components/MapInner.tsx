// ===============================
// 1) .env.local
// ===============================
// Keep your API key ONLY on the server. Do NOT expose it to the client.
// Create .env.local in your project root with:
//
// GOOGLE_MAPS_API_KEY=YOUR_SECRET_SERVER_KEY
//
// If you also run on Vercel, add this env var there as well.


// ===============================
// 2) app/api/geocode/route.ts  (Next.js 13/14 App Router)
// ===============================


// ===============================
// 3) components/MapWithOffers.tsx
// ===============================
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L, { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import {
  Tent,
  School,
  MapPin,
  CalendarDays,
  ArrowUpDown,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ===== Types ===== */
export type PointType = "obozy" | "polkolonie";
export type OfferPoint = {
  id: string;
  title: string;
  city: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  address: string; // e.g. "Łazienkowska 6A, 00-449 Warszawa, Polska"
  type: PointType;
  price: number;       // PLN
  image: string;       // URL or /public path
  desc: string;        // short description for card
};

export type MapProps = {
  points?: OfferPoint[];
  center?: LatLngTuple;
  zoom?: number;
};

/* ===== Teardrop pins (SVG) ===== */
function makeTearIcon(color: "orange" | "navy") {
  const fill = color === "orange" ? "#f97316" : "#0f172a";
  return L.divIcon({
    className: "",
    html: `
      <svg width="28" height="40" viewBox="0 0 64 92" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-opacity=".35"/></filter></defs>
        <path d="M32 2C16 2 2 16 2 32c0 19 22 40 28.2 56 .3 .8 1.3 .8 1.6 0C40 72 62 51 62 32 62 16 48 2 32 2z"
              fill="${fill}" filter="url(#s)"/>
        <circle cx="32" cy="34" r="10" fill="white" opacity=".9"/>
      </svg>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}
const ORANGE_PIN = makeTearIcon("orange");
const NAVY_PIN = makeTearIcon("navy");

/* ===== Demo data (address only) ===== */
const DEMO: OfferPoint[] = [
  {
    id: "obo-waw",
    title: "Adapt Camp Halloween\nWeekendowy obóz z rodzicem",
    city: "Licheń Stary",
    start: "2025-10-18",
    end: "2025-10-19",
    address: "ul. Klasztorna 4, 62-563 Licheń Stary, Polska",
    type: "obozy",
    price: 1090,
    image: "/demo/obozy1.jpg",
    desc:
      "Wyjątkowy weekendowy obóz dla dzieci i ich rodziców – buduje pewność siebie i samodzielność w obozowej atmosferze.",
  },
  {
    id: "pol-waw",
    title: "Półkolonie Warszawa – Mokotów",
    city: "Warszawa",
    start: "2025-07-01",
    end: "2025-07-05",
    address: "Mokotów, Warszawa, Polska",
    type: "polkolonie",
    price: 1190,
    image: "/demo/polkolonie1.jpg",
    desc:
      "Aktywne półkolonie w sercu Mokotowa: boiska, gry zespołowe i świetna kadra.",
  },
  {
    id: "obo-gda",
    title: "Obóz Gdańsk – Oliwa",
    city: "Gdańsk",
    start: "2025-07-10",
    end: "2025-07-16",
    address: "Oliwa, Gdańsk, Polska",
    type: "obozy",
    price: 1990,
    image: "/demo/obozy2.jpg",
    desc:
      "Treningi nad morzem, integracja i zwiedzanie Trójmiasta – intensywny tydzień w super atmosferze.",
  },
  {
    id: "pol-poz",
    title: "Półkolonie Poznań – Winogrady",
    city: "Poznań",
    start: "2025-07-18",
    end: "2025-07-22",
    address: "Winogrady, Poznań, Polska",
    type: "polkolonie",
    price: 990,
    image: "/demo/polkolonie2.jpg",
    desc:
      "Dużo ruchu, zabawy i zajęcia tematyczne – idealne na aktywne wakacje w mieście.",
  },
];

// --- Simple client cache to reduce API calls across navigations
const localCacheKey = (addr: string) => `geo:${addr.toLowerCase()}`;
function getCached(addr: string): { lat: number; lng: number; formatted?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(localCacheKey(addr));
    return raw ? JSON.parse(raw) : null;
  } catch {}
  return null;
}
function setCached(addr: string, value: any) {
  try { localStorage.setItem(localCacheKey(addr), JSON.stringify(value)); } catch {}
}

// Fetch coordinates for one address via our server route
async function geocodeAddress(address: string) {
  const cached = getCached(address);
  if (cached) return cached;
  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
  const data = await res.json();
  setCached(address, data);
  return data as { lat: number; lng: number; formatted?: string };
}

// Helper: fit map to markers once loaded
function FitBoundsOnce({ coords }: { coords: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || !coords.length) return;
    const bounds = coords.reduce((b, c) => b.extend([c.lat, c.lng] as any), new LatLngBounds([[coords[0].lat, coords[0].lng], [coords[0].lat, coords[0].lng]]));
    map.fitBounds(bounds.pad(0.15));
    fitted.current = true;
  }, [coords, map]);
  return null;
}

export default function MapInner({
  points = DEMO,
  center = [52.1, 19.4] as LatLngTuple,
  zoom = 6,
}: MapProps) {
  /* filters */
  const [selectedTypes, setSelectedTypes] = useState<Set<PointType>>(
    () => new Set(["obozy", "polkolonie"]) 
  );
  const [city, setCity] = useState("Wybierz lokalizację");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  /* sorting */
  type SortBy = "price" | "date" | "name";
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [asc, setAsc] = useState<boolean>(true);
  const [sortOpen, setSortOpen] = useState(false);

  const cities = useMemo(
    () => ["Wybierz lokalizację", ...Array.from(new Set(points.map(p => p.city)))],
    [points]
  );

  const toggleType = (t: PointType) =>
    setSelectedTypes(prev => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      if (n.size === 0) n.add(t); // safeguard
      return n;
    });

  // === Geocode unique addresses ===
  type Coords = { lat: number; lng: number; formatted?: string };
  const [coordsById, setCoordsById] = useState<Record<string, Coords | null>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Record<string, string>>({});

  useEffect(() => {
    let isCancelled = false;
    async function run() {
      const unique = new Map<string, string>(); // address -> any id
      points.forEach(p => unique.set(p.address, p.id));

      for (const p of points) {
        if (coordsById[p.id] || loadingIds.has(p.id)) continue;
        setLoadingIds(s => new Set(s).add(p.id));
        try {
          const c = await geocodeAddress(p.address);
          if (isCancelled) return;
          setCoordsById(prev => ({ ...prev, [p.id]: c }));
        } catch (e: any) {
          if (isCancelled) return;
          setErrorIds(prev => ({ ...prev, [p.id]: e?.message || "Geocode error" }));
          setCoordsById(prev => ({ ...prev, [p.id]: null }));
        } finally {
          setLoadingIds(s => { const n = new Set(s); n.delete(p.id); return n; });
          // Gentle throttle to avoid QPS limits (optional)
          await new Promise(r => setTimeout(r, 120));
        }
      }
    }
    run();
    return () => { isCancelled = true; };
  }, [points]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    const list = points.filter(p => {
      if (!selectedTypes.has(p.type)) return false;
      const byCity = city === "Wybierz lokalizację" || p.city === city;
      const byDate = (!from || p.end >= from) && (!to || p.start <= to);
      const byQ =
        !qq ||
        p.title.toLowerCase().includes(qq) ||
        p.city.toLowerCase().includes(qq) ||
        p.address.toLowerCase().includes(qq);
      return byCity && byDate && byQ;
    });

    const sorted = [...list].sort((a, b) => {
      let r = 0;
      if (sortBy === "price") r = a.price - b.price;
      if (sortBy === "name") r = a.title.localeCompare(b.title, "pl");
      if (sortBy === "date") r = a.start.localeCompare(b.start);
      return asc ? r : -r;
    });

    return sorted;
  }, [points, selectedTypes, city, from, to, q, sortBy, asc]);

  /* helpers */
  const fmtPrice = (pln: number) => `od ${pln.toLocaleString("pl-PL")} zł`;

  // Build markers from geocoded coords
  const markers = filtered
    .map(p => ({ p, c: coordsById[p.id] }))
    .filter(x => !!x.c) as Array<{ p: OfferPoint; c: Coords }>;

  return (
    <section className="w-full sticky">
      {/* ===== Control bar (as in your original) ===== */}
      <div className="w-full bg-orange-500 z-[9999]">
        <div className="px-2 sm:px-4">
          <div className="flex flex-wrap items-stretch gap-2 py-2">
            {/* pseudo-checkboxes */}
            <button
              onClick={() => toggleType("obozy")}
              className={`flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 ${
                selectedTypes.has("obozy")
                  ? "bg-orange-600 text-white"
                  : "bg-transparent text-white/90"
              }`}
              title="Obozy"
            >
              <Tent className="h-4 w-4" />
              <span className="text-sm font-semibold">Obozy</span>
            </button>
            <button
              onClick={() => toggleType("polkolonie")}
              className={`flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 ${
                selectedTypes.has("polkolonie")
                  ? "bg-[#0f172a] text-white"
                  : "bg-transparent text-white/90"
              }`}
              title="Półkolonie"
            >
              <School className="h-4 w-4" />
              <span className="text-sm font-semibold">Półkolonie</span>
            </button>

            {/* city */}
            <div className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black min-w-[220px]">
              <MapPin className="h-4 w-4 text-slate-700" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              >
                {cities.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* dates */}
            <div className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black">
              <CalendarDays className="h-4 w-4 text-slate-700" />
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="bg-transparent outline-none text-sm"
              />
              <span className="opacity-70 text-sm">–</span>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="bg-transparent outline-none text-sm"
              />
            </div>

            {/* sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black"
              >
                <ArrowUpDown className="h-4 w-4 text-slate-700" />
                <span className="text-sm">Sortuj według</span>
                {sortOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {sortOpen && (
                <div className="absolute z-[9999] mt-1 w-52 rounded-md border border-slate-200 bg-white shadow">
                  {[
                    { key: "price", label: "Ceny" },
                    { key: "date", label: "Daty (start)" },
                    { key: "name", label: "Nazwy" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortBy(opt.key as any);
                        setSortOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                        sortBy === (opt.key as any) ? "font-semibold" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <div className="border-t" />
                  <button
                    onClick={() => setAsc(a => !a)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    Kierunek: {asc ? "Rosnąco" : "Malejąco"}
                  </button>
                </div>
              )}
            </div>

            {/* search */}
            <div className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black flex-1 min-w-[220px]">
              <Search className="h-4 w-4 text-slate-700" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Szukaj"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Map ===== */}
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4">
        <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] rounded-lg overflow-hidden shadow">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%"}}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {markers.map(({ p, c }) => (
              <Marker
                key={p.id}
                position={[c.lat, c.lng]}
                icon={p.type === "polkolonie" ? NAVY_PIN : ORANGE_PIN}
              >
                <Popup>
                  <div className="min-w-[240px]">
                    <h4 className="font-semibold text-slate-800 whitespace-pre-line">{p.title}</h4>
                    <p className="text-sm text-slate-600">
                      {p.city} • {new Date(p.start).toLocaleDateString()} –{" "}
                      {new Date(p.end).toLocaleDateString()}
                    </p>
                    <a
                      href={`/oferta/${p.id}`}
                      className="mt-2 inline-block rounded-md bg-orange-500 px-3 py-1 text-sm hover:bg-orange-600"
                    >
                      Zobacz ofertę
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ===== Offers grid ===== */}
      <div className="mx-auto max-w-7xl px-2 sm:px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              {/* image + price badge */}
              <div className="relative h-52 sm:h-60">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute right-3 bottom-3 bg-slate-100/95 text-slate-900 font-semibold rounded-md px-3 py-2 shadow">
                  {fmtPrice(p.price)}
                </div>
              </div>

              {/* content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-slate-900 whitespace-pre-line">
                  {p.title}
                </h3>

                <div className="mt-2 flex items-center justify-between text-orange-600 font-semibold">
                  <button
                    onClick={() => {
                      const c = coordsById[p.id];
                      if (c) (window as any).__flyTo?.(c.lat, c.lng);
                    }}
                    className="hover:underline disabled:opacity-50"
                    disabled={!coordsById[p.id]}
                  >
                    {coordsById[p.id] ? "Pokaż na mapie" : (loadingIds.has(p.id) ? "Ładowanie…" : (errorIds[p.id] ? "Brak lokalizacji" : "Pokaż na mapie"))}
                  </button>
                  <span>{p.city}</span>
                </div>

                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {p.desc}
                </p>

                <button className="mt-4 w-full rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 transition">
                  Rezerwuj / Szczegóły
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

