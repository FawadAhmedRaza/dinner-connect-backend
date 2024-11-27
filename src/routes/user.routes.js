const router = require('express').Router();
const controller = require('../controllers/users.controller');
const { multerStorage } = require('../middlewares/googleCloudUpload');
const {
  getByIdSchema,
  getByUserIdSchema,
  getByUserEmailSchema,
} = require('../validators/common.validator');
const {
  sendVerificationCodeSchema,
  confirmVerificationCodeSchema,
  profileValidationSchema,
  uploadImageValidation,
} = require('../validators/users.validator');
const validateRequest = require('../validators/validate.schema');
const ENDPOINTS = require('./endpoints.routes');

router.post(
  ENDPOINTS.users.root,

  multerStorage.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  profileValidationSchema,

  validateRequest,

  controller.createOrEditProfile
);

router.get(
  ENDPOINTS.users.byId,
  getByUserIdSchema,
  validateRequest,
  controller.fetchProfileByUserId
);
router.get(
  ENDPOINTS.users.byEmail,
  getByUserEmailSchema,
  validateRequest,
  controller.fetchProfileByEmail
);

router.delete(
  ENDPOINTS.users.byId,
  getByIdSchema,
  validateRequest,
  controller.removeProfile
);

router.get(ENDPOINTS.users.root, controller.fetchUsers);

router.get(
  ENDPOINTS.users.profile,
  getByIdSchema,
  validateRequest,
  controller.fetchProfileById
);

router.post(
  ENDPOINTS.users.verify,
  sendVerificationCodeSchema,
  validateRequest,
  controller.sendVerificationCode
);

router.post(
  ENDPOINTS.users.confirmVerify,
  confirmVerificationCodeSchema,
  validateRequest,
  controller.confirmVerificationCode
);
// Upload user image
router.post(
  ENDPOINTS.users.images,
  multerStorage.single('image'),
  uploadImageValidation,
  validateRequest,
  controller.uploadImage
);
router.get(
  ENDPOINTS.users.imagesById,
  getByIdSchema,
  validateRequest,
  controller.fetchImagesByProfileId
);

module.exports = router;
