const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');

const prisma = new PrismaClient();

// Fetch all notifications for a user
const getAllNotifications = async (profileId) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
      include: {
        refrence: true,
        request: {
          include: {
            Event: {
              include: {
                restaurant: {
                  include: {
                    RestaurantImages: true,
                  },
                },
                profile: true,
              },
            },
            host: true,
            profile: true,
          },
        },
      },
    });
    return {
      data: notifications,
      statusCode: StatusCodes.OK,
      message: messages.EVENT_UPDATED,
    };
  } catch (error) {
    throw {
      messages: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

// Create a new notification
const createNotification = async ({
  profileId,
  subject,
  description,
  refrenceId,
  isSystem,
}) => {
  try {
    const notification = await prisma.notifications.create({
      data: {
        profileId,
        subject,
        description,
        refrenceId,
        isSystem,
      },
    });
    return notification;
  } catch (error) {
    return null;
  }
};

// Mark a notification as read
const markAsRead = async (id) => {
  try {
    const notification = await prisma.notifications.update({
      where: { id },
      data: { isReaded: true },
    });
    return notification;
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  markAsRead,
};
