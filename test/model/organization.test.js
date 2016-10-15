const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

const sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
const mongoose = require('mongoose');

const Organization = require('../../lib/model/organization');

describe('Organization', function () {
  describe('validate', () => {

    it('should be invalid if name is empty', function (done) {
      let organization = new Organization();

      organization.validate((err) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be invalid if slug is empty', function (done) {
      let organization = new Organization();

      organization.validate((err) => {
        expect(err.errors.slug).to.exist;
        done();
      });
    });

    it('should be invalid if slug contains special char other than "-"', function (done) {
      let organization = new Organization({ slug: '!@#$%^&*()' });

      organization.validate((err) => {
        expect(err.errors.slug).to.exist;
        done();
      });
    });

    it('should be valid if slug contains only alphanumerical characters', function (done) {
      let organization = new Organization({ slug: 'aA098bB' });

      organization.validate((err) => {
        expect(err.errors.slug).not.to.exist;
        done();
      });
    });
    it('should be valid if slug contains alphanumerical characters and "-"', function (done) {
      let organization = new Organization({ slug: 'aA098bB-a' });

      organization.validate((err) => {
        expect(err.errors.slug).not.to.exist;
        done();
      });
    });

    it('should be lowercasing slug', function () {
      let organization = new Organization({ slug: 'AAAAAAA' });

      expect(organization.slug).to.equal('aaaaaaa');
    });
  });

  describe('exists', () => {
    let OrganizationMock;

    beforeEach(() => {
      OrganizationMock = sinon.mock(Organization);
    });

    afterEach(() => {
      OrganizationMock.restore();
    });

    it('should return true if found', () => {
      OrganizationMock.expects('findOne').withArgs({slug: 'the-slug'})
        .chain('exec')
        .resolves({});

      return expect(Organization.exists('the-slug')).to.eventually.be.true;
    });

    it('should return false if not found', () => {
      OrganizationMock.expects('findOne').withArgs({slug: 'the-slug'})
        .chain('exec')
        .resolves(undefined);

      return expect(Organization.exists('the-slug')).to.eventually.be.false;
    });
  });
});