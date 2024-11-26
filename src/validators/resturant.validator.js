const { body, param } = require('express-validator');

const createRestaurantValidation = [
  body('name').notEmpty().withMessage('Restaurant name is required'),
  body('openingTime')
    .isISO8601()
    .withMessage('Opening time must be a valid ISO8601 date'),
  body('closingTime')
    .isISO8601()
    .withMessage('Closing time must be a valid ISO8601 date'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('ambience')
    .optional()
    .isJSON()
    .withMessage('Ambience must be an array')
    .custom((languages) =>
      JSON.parse(languages).every((lang) => typeof lang === 'string')
    )
    .withMessage('Ambience must be an array of strings'),
  body('cuisines')
    .optional()
    .isJSON()
    .withMessage('Cuisines must be an array')
    .custom((cuisines) =>
      JSON.parse(cuisines).every((lang) => typeof lang === 'string')
    )
    .withMessage('Cuisines must be an array of strings'),
];

const updateRestaurantValidation = [
  param('id').notEmpty().withMessage('Restaurant ID is required'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('openingTime')
    .optional()
    .isISO8601()
    .withMessage('Opening time must be a valid ISO8601 date'),
  body('closingTime')
    .optional()
    .isISO8601()
    .withMessage('Closing time must be a valid ISO8601 date'),
];
const getRestaurantByIdValidation = [
  param('id').notEmpty().withMessage('Restaurant ID is required'),
];

module.exports = {
  createRestaurantValidation,
  updateRestaurantValidation,
  getRestaurantByIdValidation,
};
