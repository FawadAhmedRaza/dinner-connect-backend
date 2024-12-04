const { body } = require('express-validator');

const reviewValidation = [
  body('rating').isInt().notEmpty().withMessage('Rating name is required'),
  body('comment').optional().isString().withMessage('comment must be a string'),
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient Id is required')
    .isString()
    .withMessage('Recipient Id must be a string'),
  body('profileId')
    .notEmpty()
    .withMessage('Profile Id is required')
    .isString()
    .withMessage('Profile Id must be a string'),
];

module.exports = {
  reviewValidation,
};
