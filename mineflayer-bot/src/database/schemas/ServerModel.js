const mongoose = require("mongoose");

const ServerSchema = new mongoose.Schema({
  serverName: {
    type: String,
    required: true,
    unique: true,
  },
  received: {
    type: Number,
    required: true,
  },
  from: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("server", ServerSchema);
