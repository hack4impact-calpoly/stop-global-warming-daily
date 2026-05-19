export type LocationCoordinates = number[];

export type LocationResult = {
  locationName: string;
  locationCoordinates: [number, number];
};

export async function findLocation(locationName: string): Promise<LocationResult | null> {
  const params = new URLSearchParams({
    q: locationName,
    format: "json",
    addressdetails: "1",
    limit: "1",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.length === 0) {
    return null;
  }

  const result = data[0];

  const city =
    result.address?.city || result.address?.town || result.address?.village || result.address?.county || locationName;

  const state = result.address?.state || "";
  const country = result.address?.country || "";

  const cleanName = [city, state || country].filter(Boolean).join(", ");

  const lat = Number(result.lat);
  const lng = Number(result.lon);

  return {
    locationName: cleanName,
    locationCoordinates: [lng, lat],
  };
}
