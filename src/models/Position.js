import mongoose from "mongoose";
export const Position = mongoose.model("Position", {
  device: String,
  x: Number,
  y: Number,
});
