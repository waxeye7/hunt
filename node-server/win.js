const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WinSchema = new Schema({
    amount: { type: Number },
  }, {
    collection: 'Wins'
  });

module.exports = mongoose.model('Win', WinSchema);