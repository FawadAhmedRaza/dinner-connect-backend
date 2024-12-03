const express = require('express');
const {
  fetchAllNotifications,
  markNotificationAsRead,
} = require('../controllers/notifications.controller');
const ENDPOINTS = require('./endpoints.routes');

const router = express.Router();

// Routes
router.get(ENDPOINTS.notifications.byProfile, fetchAllNotifications); // Get all notifications for a user

router.post(ENDPOINTS.notifications.byId, markNotificationAsRead); // Mark notification as read

module.exports = router;
