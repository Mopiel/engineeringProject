import mongoose from "mongoose";
export const Beacon = mongoose.model("Beacon", {
  name: String,
  positions: [
    {
      device: String,
      rssi: [Number],
      date: String,
      txpower: Number,
      alarmcode: Number,
      x: Number,
      y: Number,
    },
  ],
});
