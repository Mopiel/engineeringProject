import { strict } from "assert";
import mongoose from "mongoose";
export const Beacon = mongoose.model("Beacon", {
  name: String,
  positions: [{ device: String, rssi: Number, date: String }],
});
