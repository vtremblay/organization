'use strict';

const sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));


const AlreadyExistsError = require('../../lib/error/already-exists-error');
const NotFoundError = require('../../lib/error/not-found-error');

const Organization = require('../../lib/model/organization');
const OrganizationService = require('../../lib/service/organization');

describe('OrganizationService', () => {
  describe('new', () => {
    it('should create a new instance', () => {
      expect(new OrganizationService()).not.to.be.null;
    });
  });

  describe('create', () => {
    let OrganizationMock;

    beforeEach(() => {
      OrganizationMock = sinon.mock(Organization);
    });

    afterEach(() => {
      OrganizationMock.restore();
    });

    it('should reject with a AlreadyExistsError if organization already exists', () => {
      OrganizationMock.expects('exists')
        .withArgs('slug')
        .resolves(true);

      let service = new OrganizationService();

      return expect(service.create({name: 'name', slug: 'slug'})).to.be.rejectedWith(AlreadyExistsError);
    });

    it('should save the organization if it does not exists and return it', () => {
      let organization = {name: 'name', slug: 'slug'};
      let createdOrganization = {_id: 'AAAA', name: 'name', slug: 'slug'};

      OrganizationMock.expects('exists')
        .withArgs('slug')
        .resolves(false);

      OrganizationMock.expects('create')
        .withArgs(organization)
        .resolves(createdOrganization);

      let service = new OrganizationService();

      return expect(service.create(organization)).to.become(createdOrganization);
    });
  });

  describe('findBySlug', () => {
    let OrganizationMock;

    beforeEach(() => {
      OrganizationMock = sinon.mock(Organization);
    });

    afterEach(() => {
      OrganizationMock.restore();
    });

    it('should reject with a NotFoundError if organization does not exists', () => {
      OrganizationMock.expects('findOne')
        .withArgs({slug: 'the-slug'})
        .chain('exec')
        .resolves(undefined);

      let service = new OrganizationService();

      return expect(service.findBySlug('the-slug')).to.be.rejectedWith(NotFoundError);
    });

    it('should resolve the organization if it exists', () => {
      let organization = {_id: 'AAAA', name: 'name', slug: 'slug'};

      OrganizationMock.expects('findOne')
        .withArgs({slug: 'the-slug'})
        .chain('exec')
        .resolves(organization);

      let service = new OrganizationService();

      return expect(service.findBySlug('the-slug')).to.become(organization);
    });
  });
});