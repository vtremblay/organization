'use strict';
const config = require('config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const ErrorTranslator = require('./lib/error/translator');
const errorTranslator = new ErrorTranslator();

const OrganizationService = require('./lib/service/organization');
const organizationService = new OrganizationService();

app.get('/organizations/:slug', function(req, res, next) {
  organizationService.findBySlug(req.params.slug)
    .then((organization) => res.send(organization))
    .catch(next);
});

app.post('/organizations', function(req, res, next) {
  organizationService.create(req.body)
    .then((organization) => res.send(organization))
    .catch(next);
});

app.use(function(err, req, res, next) {
  res.status(errorTranslator.translate(err)).send(err.name);
  next();
});

app.listen(3000, function () {
  if (config.db.inMemory) {
    require('mockgoose')(mongoose).then(() => {
      mongoose.connect(config.db.url);
    });
  } else {
    mongoose.connect(config.db.url);
  }
  console.log('Listening on port 3000!');
});

module.exports = app;