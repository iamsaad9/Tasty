import mongoose, { Schema, Document } from "mongoose";

export interface ILocations extends Document {
  area: string;
  postalCode: string;
}

const LocationsSchema = new Schema<ILocations>({
  area: { type: String, required: true },
  postalCode: { type: String, required: true },
});

export default mongoose.models.Area || mongoose.model<ILocations>("Locations", LocationsSchema);
