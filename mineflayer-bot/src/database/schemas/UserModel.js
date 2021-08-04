const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema(
  {
    serverName: {
      type: String,
      required: true,
    },
    webhookId: {
      type: String,
      required: true,
    },
    webhookToken: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  discordTag: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  trackerSlots: {
    type: Number,
    required: true,
    default: 4,
  },
  trackers: [TrackerSchema],
});

module.exports = mongoose.model("user", UserSchema);
