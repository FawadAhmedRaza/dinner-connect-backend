const {
  getAllNotifications,
  markAsRead,
} = require('../services/notifications.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

// Get all notifications for a user
const fetchAllNotifications = async (req, res) => {
  const { profileId } = req.params;

  try {
    const { data, message, statusCode } = await getAllNotifications(profileId);
    successResponse(res, message, data, statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, statusCode, message } = await markAsRead(id);
    successResponse(res, message, data, statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

module.exports = {
  fetchAllNotifications,
  markNotificationAsRead,
};
