const { body, param } = require('express-validator');

const createEventValidation = [
  body('name').notEmpty().withMessage('Event name is required'),
  body('date')
    .isISO8601()
    .withMessage('Event date must be a valid ISO8601 date'),
  body('eventType')
    .isIn(['ATRESTURANT', 'ATHOME'])
    .withMessage('Event type must be either ATRESTURANT or ATHOME'),
  body('profileId')
    .notEmpty()
    .isString()
    .withMessage('profile id must be a string'),
  body('priceType')
    .optional()
    .isIn(['SPLIT', 'FULL'])
    .withMessage('Price type must be either SPLIT or FULL'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  body('cuisine').optional().isArray().withMessage('Cuisine must be an array'),
];

const updateEventValidation = [
  param('id').notEmpty().withMessage('Event ID is required'),
  body('name').optional().isString().withMessage('Event name must be a string'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid ISO8601 date'),
];
const invitationValidation = [
  body('eventId')
    .notEmpty()
    .withMessage('Event id is required')
    .isString()
    .withMessage('Event id must be a string'),
  body('userId').notEmpty().isString().withMessage('User id must be a string'),
  body('action')
    .notEmpty()
    .withMessage('action is required')
    .isIn(['ACCEPTED', 'DECLINED'])
    .withMessage('action must be either DECLINED or ACCEPTED'),
];

const sendInviteValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('User IDs must be a non-empty array'),
];

const getEventByIdValidation = [
  param('id').notEmpty().withMessage('Event ID is required'),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  sendInviteValidation,
  getEventByIdValidation,
  invitationValidation,
};
