'use strict';

const AlreadyExistsError = require('../error/already-exists-error');
const NotFoundError = require('../error/not-found-error');

const Organization = require('../model/organization');

class OrganizationService {

  create (organization) {
    return Organization.exists(organization.slug)
      .then(this._throwIfAlreadyExists)
      .then(this._doCreate(organization));
  }

  _doCreate (organization) {
    return () => Organization.create(organization);
  }

  _throwIfAlreadyExists (exists) {
    if (exists) {
      throw new AlreadyExistsError();
    }
  }

  findBySlug(slug) {
    return Organization.findOne({slug: slug}).exec()
      .then(this._returnOrThrow);

  }

  _returnOrThrow(organization) {
    if (!organization) {
      throw new NotFoundError();
    }

    return organization;
  }
}

module.exports = OrganizationService;