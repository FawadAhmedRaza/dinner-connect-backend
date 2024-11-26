const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  handleInvitation,
  getInvitationsByUser,
  sendEventInvitation,
} = require('../services/events.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

const create = async (req, res) => {
  try {
    const result = await createEvent(req.body);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const list = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getEvents(filters);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getEventById(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};
const invitationsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getInvitationsByUser(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateEvent(id, req.body);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteEvent(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const invitation = async (req, res) => {
  try {
    const { eventId, userId, action } = req.body; // `action` can be 'accept' or 'decline'
    const result = await handleInvitation(eventId, userId, action);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const sendInvite = async (req, res) => {
  try {
    const { eventId, userId } = req.body; // List of user IDs to invite
    const result = await sendEventInvitation(eventId, userId);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  invitation,
  sendInvite,
  invitationsByUser,
};
