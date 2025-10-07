import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing 'address' query param" }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Server missing GOOGLE_MAPS_API_KEY" }, { status: 500 });
  }

  // Call Google Geocoding API (server-side)
  const geocodeUrl = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  geocodeUrl.searchParams.set("address", address);
  geocodeUrl.searchParams.set("key", key);

  const res = await fetch(geocodeUrl.toString());
  if (!res.ok) {
    return NextResponse.json({ error: `Geocode request failed (${res.status})` }, { status: 502 });
  }

  const data = await res.json();
  if (data.status !== "OK" || !data.results?.length) {
    return NextResponse.json({ error: data.status || "Not found" }, { status: 404 });
  }

  const loc = data.results[0].geometry.location; // { lat, lng }
  return NextResponse.json({ lat: loc.lat, lng: loc.lng, formatted: data.results[0].formatted_address });
}
