const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  handleRequest,
  sendEventRequest,
  getRequestByHost,
  saveImagesEvent,
  getRequestByUser,
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
const requestsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getRequestByUser(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};
const requestsByHost = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const result = await getRequestByHost(id, status);
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

const uploadEventImages = async (req, res) => {
  try {
    const result = await saveImagesEvent(req.body, req.files);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const requestHandler = async (req, res) => {
  try {
    const { id, action } = req.body; // `action` can be 'accept' or 'decline'
    const result = await handleRequest(id, action);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const sendRequest = async (req, res) => {
  try {
    console.log('TRGIRED');
    const { eventId, userId, hostId } = req.body; // List of user IDs to invite
    const result = await sendEventRequest(eventId, userId, hostId);
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
  requestHandler,
  sendRequest,
  requestsByHost,
  requestsByUser,
  uploadEventImages,
};
