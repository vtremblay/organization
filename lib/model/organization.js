'use strict';

const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9\-]*$/,
    lowercase: true
  }
});

organizationSchema.statics.exists = function exists (slug) {
  return this.findOne({ slug: slug }).exec()
    .then((organization) => organization ? true : false);
};

module.exports = mongoose.model('Organization', organizationSchema);
