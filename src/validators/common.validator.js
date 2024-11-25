const { param } = require('express-validator');

const getByIdSchema = [
  param('id').trim().notEmpty().withMessage('User ID is required.'),
];

const getByUserIdSchema = [
  param('id').trim().notEmpty().withMessage('User ID is required.'),
];

module.exports = {
  getByIdSchema,
  getByUserIdSchema,
};
