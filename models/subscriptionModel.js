import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Base", "Argent", "Gold"],
    required: true,
  },
  dateDeb: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  sectors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Sector",
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["updated", "expired", "deleted", "asked"],
    default: "updated",
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
