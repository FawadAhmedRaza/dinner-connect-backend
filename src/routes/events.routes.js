const express = require('express');
const {
  create,
  list,
  getById,
  update,
  remove,
  requestsByHost,
  requestsByUser,
  uploadEventImages,
  sendRequest,
} = require('../controllers/events.controller');
const ENDPOINTS = require('./endpoints.routes');
const {
  createEventValidation,
  getEventByIdValidation,
  updateEventValidation,
  invitationValidation,
  sendRequestValidation,
  eventImagesValidation,
} = require('../validators/events.validator');
const validateRequest = require('../validators/validate.schema');
const { getByIdSchema } = require('../validators/common.validator');
const { handleRequest } = require('../services/events.service');
const { multerStorage } = require('../middlewares/googleCloudUpload');

const router = express.Router();

// CRUD APIs for events

router.post(
  ENDPOINTS.events.images,
  multerStorage.array('images'),
  eventImagesValidation,
  validateRequest,
  uploadEventImages
);
router.post(
  ENDPOINTS.events.root,
  createEventValidation,
  validateRequest,
  create
);
router.get(ENDPOINTS.events.root, list);
router.get(
  ENDPOINTS.events.byId,
  getEventByIdValidation,
  validateRequest,
  getById
);
router.put(
  ENDPOINTS.events.byId,
  updateEventValidation,
  validateRequest,
  update
);
router.delete(
  ENDPOINTS.events.byId,
  getEventByIdValidation,
  validateRequest,
  remove
);

// Invite actions
router.get(
  ENDPOINTS.events.requestByUser,
  getByIdSchema,
  validateRequest,
  requestsByUser
);
router.get(
  ENDPOINTS.events.requestByHost,
  getByIdSchema,
  validateRequest,
  requestsByHost
);
router.post(
  ENDPOINTS.events.handleRequest,
  invitationValidation,
  validateRequest,
  handleRequest
);
router.post(
  ENDPOINTS.events.request,
  sendRequestValidation,
  validateRequest,
  sendRequest
);

module.exports = router;
