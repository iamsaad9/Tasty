import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Locations from "@/../models/locations";

const locations =[
  { "area": "Mission District", "postalCode": "94110" },
  { "area": "SOMA", "postalCode": "94103" },
  { "area": "Chinatown", "postalCode": "94108" },
  { "area": "Castro", "postalCode": "94114" },
  { "area": "Marina District", "postalCode": "94123" },
  { "area": "Financial District", "postalCode": "94104" },
  { "area": "Nob Hill", "postalCode": "94109" },
  { "area": "Tenderloin", "postalCode": "94102" },
  { "area": "Haight-Ashbury", "postalCode": "94117" },
  { "area": "Pacific Heights", "postalCode": "94115" },
  { "area": "North Beach", "postalCode": "94133" },
  { "area": "Bernal Heights", "postalCode": "94110" },
  { "area": "Sunset District", "postalCode": "94122" },
  { "area": "Bayview-Hunters Point", "postalCode": "94124" },
  { "area": "Inner Richmond", "postalCode": "94118" },
  { "area": "Outer Richmond", "postalCode": "94121" },
  { "area": "Western Addition", "postalCode": "94115" },
  { "area": "Glen Park", "postalCode": "94131" },
  { "area": "Excelsior", "postalCode": "94112" },
  { "area": "Presidio", "postalCode": "94129" }
]
;

export async function GET() {
  try {
    await connectDB();

    let storedLocations = await Locations.find({}).lean();

    if (storedLocations.length === 0) {
      await Locations.insertMany(locations);
      storedLocations = await Locations.find({}).lean();
    }

    return NextResponse.json(storedLocations);
  } catch (error) {
    console.error("Failed to fetch areas:", error);
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 });
  }
}
