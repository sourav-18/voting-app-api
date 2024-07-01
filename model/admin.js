const mongoose = require("mongoose");
const admin = new mongoose.Schema({
    name: { type: String },
    password: { type: String },
  });
  const Admin = mongoose.model("admin", admin);
  module.exports=Admin