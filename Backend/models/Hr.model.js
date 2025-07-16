const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hrSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: {
      type: String,
      required: true,
      set: (p) => bcrypt.hashSync(p, 10),
    },
  },
  { timestamps: true }
);

const Hr = mongoose.model("Hr", hrSchema);

module.exports = Hr;
