const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    amount: { type: Number },
  }, {
    collection: 'Visits'
  });

module.exports = mongoose.model('Visit', VisitSchema);