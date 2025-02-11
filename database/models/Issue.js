const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  description: { type: String, required: true },
  issueType: { type: String, required: true },
  priority: { type: String, required: true },
  contactInfo: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  locationName: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: "pending" },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Issue', issueSchema);
