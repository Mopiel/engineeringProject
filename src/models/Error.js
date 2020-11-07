import mongoose from "mongoose";
export const Error = mongoose.model("Error", {
  code: Number,
  message: String,
});
