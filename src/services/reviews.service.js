const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');
const sendNotificationToDevice = require('../utils/sendNotificationFirebase');
const { createNotification } = require('./notifications.service');

const prisma = new PrismaClient();

const review = async (data) => {
  try {
    const newReview = await prisma.review.create({
      data,
      include: {
        Profile: true,
        recipient: true,
      },
    });
    const notificationTitle = `${newReview.Profile.name} left a ${newReview.rating} star review for you`;
    const notificationDescription = `${newReview.Profile.name} left a ${newReview.rating} star review for you. ${newReview.comment}`;
    sendNotificationToDevice(
      newReview.recipient.notificationToken,
      notificationTitle,
      notificationDescription
    );

    await createNotification({
      profileId: newReview.recipientId,
      subject: notificationTitle,
      description: notificationDescription,
      isSystem: false,
      refrenceId: newReview.profileId,
      type: 'review',
    });

    return {
      status: StatusCodes.CREATED,
      message: messages.REVIEW_CREATED_SUCCESSFULLY,
      success: true,
      data: newReview,
    };
  } catch (error) {
    console.log('ERrrors', error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

const getReviews = async (filters = {}) => {
  try {
    const reviews = await prisma.review.findMany({
      where: filters,
      include: {
        Profile: true,
        recipient: true,
      },
    });

    return {
      status: StatusCodes.OK,
      message: messages.REVIEWS_FETCHED_SUCCESSFULLY,
      success: true,
      data: reviews,
    };
  } catch (err) {
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

module.exports = {
  review,
  getReviews,
};
