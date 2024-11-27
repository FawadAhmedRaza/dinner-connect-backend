const express = require('express');
const {
  fetchAllNotifications,
  markNotificationAsRead,
} = require('../controllers/notifications.controller');

const router = express.Router();

// Routes
router.get('/notifications/:profileId', fetchAllNotifications); // Get all notifications for a user

router.patch('/notifications/:id', markNotificationAsRead); // Mark notification as read

module.exports = router;
