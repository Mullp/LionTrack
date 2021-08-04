const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  sent: {
    type: Number,
    required: true,
  },
  to: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("player", PlayerSchema);
