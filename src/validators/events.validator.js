const { body, param } = require('express-validator');

const createEventValidation = [
  body('name').notEmpty().withMessage('Event name is required'),
  body('numberofGuests')
    .optional()
    .isInt()
    .withMessage('numberofGuests is integar'),
  body('gift').optional().isString().withMessage('gift must be a string'),
  body('date')
    .isISO8601()
    .withMessage('Event date must be a valid ISO8601 date'),
  body('eventType')
    .isIn(['ATRESTURANT', 'ATHOME'])
    .withMessage('Event type must be either ATRESTURANT or ATHOME'),

  body('priceType')
    .optional()
    .isIn(['SPLIT', 'FULL'])
    .withMessage('Price type must be either SPLIT or FULL'),
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  body('cuisine').optional().isArray().withMessage('Cuisine must be an array'),
  body('ambience')
    .optional()
    .isArray()
    .withMessage('Ambience must be an array'),
  body('houseRules')
    .optional()
    .isArray()
    .withMessage('House Rules must be an array'),
  body('afterDinnerActivities')
    .optional()
    .isArray()
    .withMessage('After Dinner Activities must be an array'),
  body('desert').optional().isArray().withMessage('Deserts must be an array'),
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
  body('id')
    .notEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('id must be a string'),
  body('action')
    .notEmpty()
    .withMessage('action is required')
    .isIn(['accept', 'decline'])
    .withMessage('action must be either accept or decline'),
];
const cancelRequestValidation = [
  body('id')
    .notEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('id must be a string'),
];

const sendRequestValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('userId').notEmpty().withMessage('User id must be a string'),
  body('hostId').notEmpty().withMessage('Host Id must be a string'),
];

const getEventByIdValidation = [
  param('id').notEmpty().withMessage('Event ID is required'),
];
const eventImagesValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('location').notEmpty().withMessage('location is required'),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  sendRequestValidation,
  getEventByIdValidation,
  eventImagesValidation,
  invitationValidation,
  cancelRequestValidation,
};
