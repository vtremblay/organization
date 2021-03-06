'use strict';

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

const chai = require('chai');

const expect = chai.expect;

chai.use(require('chai-http'));

const Organization = require('../lib/model/organization');

describe('App', () => {
  let app;

  before((done) => {
    mockgoose(mongoose).then(() => {
      app = require('../index');
      done();
    });
  });

  beforeEach((done) => {
    Organization.remove({}, (err) => {
      done();
    });
  });

  describe('/POST organizations', () => {

    it('should create an organization', (done) => {
      let organization = { "name": "the-name", "slug": "the-slug" };

      chai.request(app)
        .post('/organizations')
        .send(organization)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.contains(organization);
          done();
        });
    });

    it('should send 409 conflict on duplicate organization', (done) => {
      let organization = new Organization({ "name": "the-name", "slug": "the-slug" });
      organization.save()
        .then(() => {
          chai.request(app)
            .post('/organizations')
            .send(organization)
            .end((err, res) => {
              expect(res).to.have.status(409);
              done();
            });
        });
    });
  });

  describe('/GET organizations', () => {

    it('should return an organization', (done) => {
      let organization = new Organization({ "name": "the-name", "slug": "the-slug" });
      organization.save()
        .then(() => {
          chai.request(app)
            .get('/organizations/the-slug')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('name').equal('the-name');
              expect(res.body).to.have.property('slug').equal('the-slug');
              done();
            });
        });
    });

    it('should return 404 if organization does not exists', (done) => {
      chai.request(app)
        .get('/organizations/the-slug')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});