import mongoose, { Schema, models } from "mongoose";

const DetailSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  Mobile: {
    type: String,
    required: true,
  },
  Class: {
    type: String,
    required: true,
  },
  Group: {
    type: String,
    default: "-",
  },
  Parents: {
    type: Number,
    required: true,
  },
  Delivered: {
    type: Number,
    default: 0,
  },
  ae_id: {
    type: String,
    required: true,
  },
},{ timestamps: true }
);

export const Details = mongoose.models.Details || mongoose.model('Details', DetailSchema);