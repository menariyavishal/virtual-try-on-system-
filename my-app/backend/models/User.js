const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  scannedData: Object,  // Store body scan data here
});

module.exports = mongoose.model('User', userSchema);
