/* eslint-disable global-require */
const userRoutes = require('./user.routes');
const eventsRoutes = require('./events.routes');
const resturantsRoutes = require('./resturants.routes');

module.exports = function router(app) {
  app.use('/api', userRoutes, eventsRoutes, resturantsRoutes);
};
