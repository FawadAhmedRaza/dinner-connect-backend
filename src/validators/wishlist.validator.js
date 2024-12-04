const { body } = require('express-validator');

const wishlistValidation = [
  body('profileId')
    .notEmpty()
    .withMessage('Profile ID is required')
    .isString()
    .withMessage('Profile ID must be a string'),
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isString()
    .withMessage('Event ID must be a string'),
];

module.exports = {
  wishlistValidation,
};
