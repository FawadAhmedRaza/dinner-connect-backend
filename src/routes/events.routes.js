const express = require('express');
const {
  create,
  list,
  getById,
  update,
  remove,
  invitation,
  invitationsByUser,
  sendInvite,
} = require('../controllers/events.controller');
const ENDPOINTS = require('./endpoints.routes');
const {
  createEventValidation,
  getEventByIdValidation,
  updateEventValidation,
  invitationValidation,
  sendInviteValidation,
} = require('../validators/events.validator');
const validateRequest = require('../validators/validate.schema');
const { getByIdSchema } = require('../validators/common.validator');

const router = express.Router();

// CRUD APIs for events
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
  ENDPOINTS.events.invitationByUser,
  getByIdSchema,
  validateRequest,
  invitationsByUser
);
router.post(
  ENDPOINTS.events.invitation,
  invitationValidation,
  validateRequest,
  invitation
);
router.post(
  ENDPOINTS.events.invite,
  sendInviteValidation,
  validateRequest,
  sendInvite
);

module.exports = router;
