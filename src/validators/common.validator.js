const { param } = require('express-validator');

const getByIdSchema = [
  param('id').trim().notEmpty().withMessage('User ID is required.'),
];

const getByUserIdSchema = [
  param('id').trim().notEmpty().withMessage('User ID is required.'),
];
const getByUserEmailSchema = [
  param('email')
    .trim()
    .isEmail()
    .withMessage('Email is Incorrect')
    .notEmpty()
    .withMessage('User Email is required.'),
];

module.exports = {
  getByIdSchema,
  getByUserEmailSchema,
  getByUserIdSchema,
};
