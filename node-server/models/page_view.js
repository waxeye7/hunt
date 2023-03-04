const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PageViewsSchema = new Schema({
    amount: { type: Number },
  }, {
    collection: 'PageViews'
  });

module.exports = mongoose.model('PageView', PageViewsSchema);