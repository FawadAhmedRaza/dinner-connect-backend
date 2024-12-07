const USERS = '/users';
const RESTURANTS = '/resturants';
const EVENTS = '/events';
const REVIEWS = '/reviews';
const WISHLIST = '/wishlist';

const ENDPOINTS = {
  users: {
    root: USERS,
    profile: `${USERS}/profile/:id`,
    byId: `${USERS}/:id`,
    byEmail: `${USERS}/email/:email`,
    verify: `${USERS}/verify`,
    confirmVerify: `${USERS}/confirmVerify`,
    images: `${USERS}/images`,
    imagesById: `${USERS}/images/:id`,
  },
  reviews: {
    root: `${REVIEWS}`,
  },
  resturants: {
    root: RESTURANTS,
    byId: `${RESTURANTS}/:id`,
  },
  events: {
    root: EVENTS,
    images: `${EVENTS}/images`,
    byId: `${EVENTS}/:id`,
    invite: `${EVENTS}/sendInvite`,
    invitation: `${EVENTS}/invitation`,
    invitationByUser: `${EVENTS}/invitation/:id`,
    request: `${EVENTS}/sendRequest`,
    handleRequest: `${EVENTS}/handleRequest`,
    cancelRequest: `${EVENTS}/cancelRequest`,
    requestByUser: `${EVENTS}/requests/:id`,
    requestByHost: `${EVENTS}/requests/host/:id`,
  },
  notifications: {
    root: `/notifications`,
    byProfile: `/notifications/:profileId`,
    byId: `/notifications/:id`,
  },
  wishlist: {
    root: `${WISHLIST}`,
    byId: `${WISHLIST}/:id`,
    delete: `${WISHLIST}/delete`,
  },
};

module.exports = ENDPOINTS;
