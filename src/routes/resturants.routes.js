const express = require('express');
const {
  create,
  list,
  getById,
  update,
  remove,
} = require('../controllers/resturants.controller');
const { multerStorage } = require('../middlewares/googleCloudUpload');
const ENDPOINTS = require('./endpoints.routes');
const {
  getRestaurantByIdValidation,
  updateRestaurantValidation,
  createRestaurantValidation,
} = require('../validators/resturant.validator');
const validateRequest = require('../validators/validate.schema');

const router = express.Router();

router.get(ENDPOINTS.resturants.root, list);
// CRUD APIs
router.post(
  ENDPOINTS.resturants.root,
  multerStorage.array('images'),
  createRestaurantValidation,
  validateRequest,
  create
);
router.get(
  ENDPOINTS.resturants.byId,
  getRestaurantByIdValidation,
  validateRequest,
  getById
);
router.put(
  ENDPOINTS.resturants.byId,
  multerStorage.array('images'),
  updateRestaurantValidation,
  validateRequest,
  update
);
router.delete(
  ENDPOINTS.resturants.byId,
  getRestaurantByIdValidation,
  validateRequest,
  remove
);

module.exports = router;
