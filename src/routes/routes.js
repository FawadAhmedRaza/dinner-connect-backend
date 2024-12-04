/* eslint-disable global-require */
const userRoutes = require('./user.routes');
const eventsRoutes = require('./events.routes');
const resturantsRoutes = require('./resturants.routes');
const notificationsRoutes = require('./notifications.routes');
const reviewsRoutes = require('./reviews.routes');
const wishlistRoutes = require('./wishlist.routes');

module.exports = function router(app) {
  app.use(
    '/api',
    userRoutes,
    eventsRoutes,
    notificationsRoutes,
    resturantsRoutes,
    reviewsRoutes,
    wishlistRoutes
  );
};
