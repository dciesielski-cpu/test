"use client";

import dynamic from "next/dynamic";
import type { OfferPoint, MapProps } from "./MapInner";

// Ładujemy MapInner tylko w przeglądarce (naprawia „window is not defined”)
const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export default function Map(props: MapProps) {
  // wrapper nie importuje leaflet/react-leaflet – tylko przekazuje props
  return <MapInner {...props} />;
}

export type { OfferPoint };