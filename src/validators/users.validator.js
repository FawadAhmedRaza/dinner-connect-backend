const { body, check } = require('express-validator');

const profileValidationSchema = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
  body('isPhoneVerified')
    .optional()
    .isBoolean()
    .withMessage('isPhoneVerified must be a boolean'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Phone number must be a string')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  body('bio')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Bio must not exceed 255 characters'),
  body('mood')
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage('Mood must not exceed 20 characters'),
  body('gender')
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage('Gender must not exceed 20 characters'),
  body('maritalStatus')
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage('maritalStatus must not exceed 20 characters'),
  body('languages')
    .optional()
    .isJSON()
    .withMessage('Languages must be an array')
    .custom((languages) =>
      JSON.parse(languages).every((lang) => typeof lang === 'string')
    )
    .withMessage('Languages must be an array of strings'),
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
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of Birth must be a valid date'),
];

// Validation schema for sending verification code
const sendVerificationCodeSchema = [
  check('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .isMobilePhone()
    .withMessage('Invalid phone number format.'),
];

// Validation schema for confirming verification code
const confirmVerificationCodeSchema = [
  check('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required.')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits.')
    .isNumeric()
    .withMessage('OTP must be numeric.'),
];

const uploadImageValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('type')
    .notEmpty()
    .withMessage('Image type is required')
    .isIn(['PERSONAL', 'DINNER', 'HOME'])
    .withMessage('Invalid image type'),
];

module.exports = {
  profileValidationSchema,
  sendVerificationCodeSchema,
  confirmVerificationCodeSchema,
  uploadImageValidation,
};
