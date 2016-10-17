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
      let organization = {"name": "the-name", "slug": "the-slug"};

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
      let organization = new Organization({"name": "the-name", "slug": "the-slug"});
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

  describe('/GET organizations/:id', () => {

    it('should return an organization', (done) => {
      let organization = new Organization({"name": "the-name", "slug": "the-slug"});
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

  describe('/GET organizations', () => {

    it('should return all organizations', (done) => {
      let organization = new Organization({"name": "the-name", "slug": "the-slug"});
      let otherOrganization = new Organization({"name": "the-other-name", "slug": "the-other-slug"});
      organization.save()
        .then(() => otherOrganization.save())
        .then(() => {
          chai.request(app)
            .get('/organizations')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.deep.property('[0].name').equal('the-name');
              expect(res.body).to.have.deep.property('[0].slug').equal('the-slug');
              expect(res.body).to.have.deep.property('[1].name').equal('the-other-name');
              expect(res.body).to.have.deep.property('[1].slug').equal('the-other-slug');
              done();
            });
        });
    });

    it('should return all organizations limited by the limit parameter', (done) => {
      let organization = new Organization({"name": "the-name", "slug": "the-slug"});
      let otherOrganization = new Organization({"name": "the-other-name", "slug": "the-other-slug"});
      organization.save()
        .then(() => otherOrganization.save())
        .then(() => {
          chai.request(app)
            .get('/organizations?limit=1')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.deep.property('name').equal('the-name');
              expect(res.body).to.have.deep.property('slug').equal('the-slug');
              done();
            });
        });
    });
  });
});