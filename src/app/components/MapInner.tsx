"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L, { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import {
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
  start: string;
  end: string;
  address: string;
  type: PointType;
  price: number;
  image: string;
  desc: string;
};

export type MapProps = {
  points?: OfferPoint[];
  center?: LatLngTuple;
  zoom?: number;
};

/* ===== Helper: skracanie tekstu ===== */
const truncate = (str: string = "", n: number = 120) =>
  str.length > n ? str.slice(0, n).trimEnd() + "…" : str;

/* ===== Teardrop pins (SVG) – wersje zwykłe i „ciemniejsze” ===== */
function makeTearIconHex(hex: string) {
  return L.divIcon({
    className: "",
    html: `
      <svg width="28" height="40" viewBox="0 0 64 92" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-opacity=".35"/></filter></defs>
        <path d="M32 2C16 2 2 16 2 32c0 19 22 40 28.2 56 .3 .8 1.3 .8 1.6 0C40 72 62 51 62 32 62 16 48 2 32 2z" fill="${hex}" filter="url(#s)"/>
        <circle cx="32" cy="34" r="10" fill="white" opacity=".9"/>
      </svg>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}
function PinSvg({ color }: { color: "orange" | "navy" }) {
  const fill = color === "orange" ? "#f97316" : "#0f172a";
  return (
    <svg width="16" height="22" viewBox="0 0 64 92" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M32 2C16 2 2 16 2 32c0 19 22 40 28.2 56 .3 .8 1.3 .8 1.6 0C40 72 62 51 62 32 62 16 48 2 32 2z" fill={fill} />
      <circle cx="32" cy="34" r="10" fill="white" opacity=".9" />
    </svg>
  );
}
const PIN_ORANGE = makeTearIconHex("#f97316");
const PIN_ORANGE_DARK = makeTearIconHex("#f9731650");
const PIN_NAVY = makeTearIconHex("#0f172a");
const PIN_NAVY_DARK = makeTearIconHex("#0f172a50");

/* ===== Checkbox z pinem ===== */
function PinCheckbox({
  label,
  color,
  checked,
  onClick,
}: {
  label: string;
  color: "orange" | "navy";
  checked: boolean;
  onClick: () => void;
}) {
  const borderColor = checked ? "border-black" : "border-black/60";
  const textColor = checked ? "text-black" : "text-black/90";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center gap-2 px-3 py-2 border-[3px] bg-white border-orange-600 ${textColor}`}
      title={label}
      aria-pressed={checked}
    >
      {/* Kwadrat checkboxa */}
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-sm border ${borderColor} bg-white/10`}
      >
        {checked ? <PinSvg color={color} /> : null}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

/* ===== Demo data ===== */
const DEMO: OfferPoint[] = [
  {
    id: "obo-waw",
    title: "Adapt Camp Halloween\nWeekendowy obóz z rodzicem",
    city: "Wielkopolskie",
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
    city: "Mazowieckie",
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
    city: "Pomorskie",
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
    city: "Wielkopolskie",
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

/* ===== Local cache for geocoding ===== */
const localCacheKey = (addr: string) => `geo:${addr.toLowerCase()}`;
function getCached(addr: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(localCacheKey(addr));
    return raw ? JSON.parse(raw) : null;
  } catch {}
  return null;
}
function setCached(addr: string, value: any) {
  try {
    localStorage.setItem(localCacheKey(addr), JSON.stringify(value));
  } catch {}
}
async function geocodeAddress(address: string) {
  const cached = getCached(address);
  if (cached) return cached;
  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);
  const data = await res.json();
  setCached(address, data);
  return data as { lat: number; lng: number; formatted?: string };
}

/* ===== Helpers for map ===== */
function FitBoundsOnce({ coords }: { coords: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || !coords.length) return;
    const bounds = coords.reduce(
      (b, c) => b.extend([c.lat, c.lng] as any),
      new LatLngBounds([[coords[0].lat, coords[0].lng], [coords[0].lat, coords[0].lng]])
    );
    map.fitBounds(bounds.pad(0.15));
    fitted.current = true;
  }, [coords, map]);
  return null;
}

/** Rejestruje globalną funkcję, by przycisk „Pokaż na mapie” mógł flyTo do markera */
function MapFlyControl() {
  const map = useMap();
  useEffect(() => {
    (window as any).__flyTo = (lat: number, lng: number) =>
      map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
    return () => { delete (window as any).__flyTo; };
  }, [map]);
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
      if (n.size === 0) n.add(t);
      return n;
    });

  // === Geocode ===
  type Coords = { lat: number; lng: number; formatted?: string };
  const [coordsById, setCoordsById] = useState<Record<string, Coords | null>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Record<string, string>>({});

  useEffect(() => {
    let isCancelled = false;
    async function run() {
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
          await new Promise(r => setTimeout(r, 120));
        }
      }
    }
    run();
    return () => { isCancelled = true; };
  }, [points]); // eslint-disable-line

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

  const fmtPrice = (pln: number) => `od ${pln.toLocaleString("pl-PL")} zł`;

  const markers = filtered
    .map(p => ({ p, c: coordsById[p.id] }))
    .filter(x => !!x.c) as Array<{ p: OfferPoint; c: Coords }>;

  const coords = markers.map(m => m.c!);

  /* dropdown ui state */
  const [cityOpen, setCityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  /* synchronizacja karta ↔ pin */
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <section className="w-full">
      {/* ===== Pasek sterowania ===== */}
      <div
        className="z-[9999] sticky bg-orange-500 top-[80px]"
        onClick={() => { setCityOpen(false); setDateOpen(false); setSortOpen(false); }}
      >
        <div className="px-2 sm:px-4 border-indigo-900/20 border-t-2">
          <div className="flex flex-wrap text-black items-stretch max-w-7xl gap-2 py-2 mx-auto">
            {/* checkboxy z pinami */}
            <PinCheckbox
              label="Obozy"
              color="orange"
              checked={selectedTypes.has("obozy")}
              onClick={() => toggleType("obozy")}
            />
            <PinCheckbox
              label="Półkolonie"
              color="navy"
              checked={selectedTypes.has("polkolonie")}
              onClick={() => toggleType("polkolonie")}
            />

            {/* prawa strona */}
            <div className="flex items-stretch gap-2 flex-1 min-w-[320px]">
              {/* lokalizacja */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setCityOpen(v => !v); setDateOpen(false); setSortOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black min-w-[220px]"
                >
                  <MapPin className="h-4 w-4 text-slate-700" />
                  <span className="text-sm">{city || "Wybierz lokalizację"}</span>
                  {cityOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                </button>

                {cityOpen && (
                  <div className="absolute z-[9999] mt-1 w-[260px] rounded-md border border-slate-200 bg-white shadow">
                    {cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setCityOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${city === c ? "font-semibold" : ""}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* daty */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setDateOpen(v => !v); setCityOpen(false); setSortOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black"
                >
                  <CalendarDays className="h-4 w-4 text-slate-700" />
                  <span className="text-sm">{from || to ? `${from || "od"} – ${to || "do"}` : "Wybierz daty"}</span>
                  {dateOpen ? <ChevronUp className="ml-12 h-4 w-4" /> : <ChevronDown className="ml-12 h-4 w-4" />}
                </button>

                {dateOpen && (
                  <div className="absolute z-[9999] mt-1 w-[220px] rounded-md border border-slate-200 bg-white shadow p-3">
                    <div className="items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md bg-white text-black">
                        <span className="text-xs text-slate-600">Od</span>
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent outline-none text-sm w-[100%]" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md bg-white text-black">
                        <span className="text-xs text-slate-600">Do</span>
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent outline-none text-sm w-[100%]" />
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <button className="text-sm px-2 py-1 rounded hover:bg-slate-50" onClick={() => { setFrom(""); setTo(""); setDateOpen(false); }}>
                        Wyczyść
                      </button>
                      <button className="text-sm px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600" onClick={() => setDateOpen(false)}>
                        Zastosuj
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* sort + search */}
              <div className="flex gap-2 flex-1 min-w-[280px]">
                <div className="relative basis-1/2 flex-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setSortOpen(v => !v); setCityOpen(false); setDateOpen(false); }}
                    className="w-full justify-between flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-slate-700" />
                      <span className="text-sm">Sortuj według</span>
                    </span>
                    {sortOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {sortOpen && (
                    <div className="absolute z-[9999] mt-1 w-full rounded-md border border-slate-200 bg-white shadow">
                      {[
                        { key: "price", label: "Ceny" },
                        { key: "date", label: "Daty (start)" },
                        { key: "name", label: "Nazwy" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => { setSortBy(opt.key as any); setSortOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${sortBy === (opt.key as any) ? "font-semibold" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <div className="border-t" />
                      <button onClick={() => setAsc(a => !a)} className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50">
                        Kierunek: {asc ? "Rosnąco" : "Malejąco"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 px-3 py-2 border-[3px] border-orange-600 bg-white text-black basis-1/2 flex-1 min-w-[160px]">
                  <Search className="h-4 w-4 text-slate-700" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Szukaj"
                    className="bg-transparent outline-none text-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Dwukolumnowy układ: lewa lista, prawa mapa (sticky) ===== */}
      <div className="mx-auto max-w-7xl px-2 sm:px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* LEWA kolumna: oferty */}
          <div>
            <div className="grid pt-6 grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  ref={(el) => { cardRefs.current[p.id] = el; }}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId((id) => (id === p.id ? null : id))}
                  className={
                    "flex flex-col h-full border border-slate-200 overflow-hidden bg-white " +
                    "shadow-none hover:shadow-sm transition " +
                    (activeId === p.id ? "ring-2 ring-orange-500" : "")
                  }
                >
                  <div className="relative h-42">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute right-2 bottom-2 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded px-2.5 py-1 shadow-sm">
                      {fmtPrice ? fmtPrice(p.price) : p.price}
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">
                      {p.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      {truncate(p.desc, 140)}
                    </p>

                    <button
                      className="mt-auto w-full rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200 transition"
                      aria-label={`Zobacz szczegóły oferty ${p.title}`}
                    >
                      Zobacz szczegóły
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {/* extra spacer, aby sticky mapa „odczepiła się” przy końcu listy */}
            <div className="h-8 lg:h-16" />
          </div>

          {/* PRAWA kolumna: mapa (sticky) */}
          <div className="lg:pl-2">
            <div className="sticky top-[120px] hidden lg:block">
              {/* wysokość pełnego viewportu minus drobny margines; na mobile mapa i tak spada pod listę */}
              <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] pt-8 pb-18 rounded-lg overflow-hidden">
                <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
                  <MapFlyControl />

                  {markers.map(({ p, c }) => {
                    const isHovered = hoveredId === p.id;
                    const isActive = activeId === p.id;
                    const dark = isHovered || isActive;
                    const icon =
                      p.type === "polkolonie"
                        ? dark ? PIN_NAVY_DARK : PIN_NAVY
                        : dark ? PIN_ORANGE_DARK : PIN_ORANGE;

                    return (
                      <Marker key={p.id} position={[c!.lat, c!.lng]} icon={icon}>
                        <Popup>
                          <div className="min-w-[240px]">
                            <h4 className="font-semibold text-slate-800 whitespace-pre-line">{p.title}</h4>
                            <p className="text-sm text-slate-600">
                              {p.address} <br></br> {new Date(p.start).toLocaleDateString()} – {new Date(p.end).toLocaleDateString()}
                            </p>
                            <a
                              href={`/oferta/${p.id}`}
                              onClick={() => {
                                setActiveId(p.id);
                                const el = cardRefs.current[p.id];
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                                  el.classList.add("ring-2", "ring-orange-500");
                                  setTimeout(() => el.classList.remove("ring-2", "ring-orange-500"), 1200);
                                }
                              }}
                              className="mt-2 inline-block bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600"
                            >
                              Zobacz ofertę
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
