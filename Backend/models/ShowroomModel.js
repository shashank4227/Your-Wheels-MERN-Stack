const mongoose = require('mongoose');

const showroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  opening_hours: { type: String, required: true }
});

const Showroom = mongoose.model('Showroom', showroomSchema);

module.exports = Showroom;
