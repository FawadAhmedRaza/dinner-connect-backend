const USERS = '/users';
const RESTURANTS = '/resturants';
const EVENTS = '/events';

const ENDPOINTS = {
  users: {
    root: USERS,
    profile: `${USERS}/profile/:id`,
    byId: `${USERS}/:id`,
    verify: `${USERS}/verify`,
    confirmVerify: `${USERS}/confirmVerify`,
    images: `${USERS}/images`,
    imagesById: `${USERS}/images/:id`,
  },
  resturants: {
    root: RESTURANTS,
    byId: `${RESTURANTS}/:id`,
  },
  events: {
    root: EVENTS,
    byId: `${EVENTS}/:id`,
    invite: `${EVENTS}/sendInvite`,
    invitation: `${EVENTS}/invitation`,
    invitationByUser: `${EVENTS}/invitation/:id`,
  },
};

module.exports = ENDPOINTS;
