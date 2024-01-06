const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
    maxlength: 300,
  },
});

module.exports = mongoose.model('Note', noteSchema);