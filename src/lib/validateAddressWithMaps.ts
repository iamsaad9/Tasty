// import axios from "axios";

// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// export async function validateAddressWithMaps(
//   fullAddress: string,
//   selectedArea: string
// ): Promise<{
//   isValid: boolean;
//   resolvedAddress?: string;
//   message?: string;
// }> {
//   if (!GOOGLE_MAPS_API_KEY) {
//     return {
//       isValid: false,
//       message: "Missing Google Maps API key",
//     };
//   }

//   try {
//     const encodedAddress = encodeURIComponent(fullAddress);
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

//     const { data } = await axios.get(url);

//     if (data.status !== "OK" || !data.results.length) {
//       return {
//         isValid: false,
//         message: "Address could not be found. Please check again.",
//       };
//     }

//     const result = data.results[0];
//     const resolvedAddress = result.formatted_address;
//     const addressComponents = result.address_components.map((comp: any) =>
//       comp.long_name.toLowerCase()
//     );

//     const normalizedArea = selectedArea.trim().toLowerCase();

//     const match = addressComponents.some((component: string) =>
//       component.includes(normalizedArea)
//     );

//     return {
//       isValid: match,
//       resolvedAddress,
//       message: match
//         ? "Address validated successfully."
//         : `Address does not appear to be in ${selectedArea}.`,
//     };
//   } catch (error) {
//     console.error("Google Maps API error:", error);
//     return {
//       isValid: false,
//       message: "Failed to validate address. Try again later.",
//     };
//   }
// }
