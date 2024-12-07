const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');
const sendNotificationToDevice = require('../utils/sendNotificationFirebase');
const { createNotification } = require('./notifications.service');
const { uploadFileToGCS } = require('../middlewares/googleCloudUpload');

const prisma = new PrismaClient();

const createEvent = async (data) => {
  try {
    const newEvent = await prisma.event.create({ data });

    return {
      message: messages.EVENT_CREATED,
      data: newEvent,
      statusCode: StatusCodes.CREATED,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getEvents = async (filters) => {
  try {
    const events = await prisma.event.findMany({
      where: { ...filters },
      include: {
        restaurant: {
          include: {
            RestaurantImages: true,
          },
        },
        EventImages: true,
        profile: true,
      },
    });

    return {
      message: messages.EVENT_FETCHED,
      data: events,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getEventById = async (id) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        restaurant: {
          include: {
            RestaurantImages: true,
          },
        },
        EventImages: true,
        profile: true,
      },
    });

    if (!event) {
      throw {
        message: messages.EVENT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    return {
      message: messages.EVENT_FETCHED,
      data: event,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const updateEvent = async (id, data) => {
  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw {
        message: 'Event not found',
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
    });

    return {
      message: messages.EVENT_UPDATED,
      data: updatedEvent,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error?.message || messages.SERVER_ERROR,
      statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const deleteEvent = async (id) => {
  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw {
        message: messages.EVENT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    await prisma.event.delete({ where: { id } });

    return {
      message: messages.EVENT_DELETED,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const cancelRequest = async (id) => {
  try {
    const eventParticipant = await prisma.eventRequest.findFirst({
      where: { id },
      include: {
        profile: true,
        Event: true,
        host: true,
      },
    });
    if (!eventParticipant) {
      throw {
        message: messages.REQUEST_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    const notificationSub = `${eventParticipant.profile.name} cancel the invitation request.`;
    const notificationDes = `${eventParticipant.profile.name} cancel your invitaion request for ${eventParticipant?.Event?.name}`;

    await prisma.eventRequest.update({
      where: { id: eventParticipant.id },
      data: { status: 'CANCELLED' },
    });
    await sendNotificationToDevice(
      eventParticipant.host.notificationToken,
      notificationSub,
      notificationDes
    );
    await createNotification({
      profileId: eventParticipant.hostId,
      subject: notificationSub,
      description: notificationDes,
      isSystem: false,
      requestId: eventParticipant?.id,
      type: 'cancelRequest',
      refrenceId: eventParticipant.profileId,
    });
    return {
      success: true,
      message: messages.REQUEST_CANCELLED,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
const handleRequest = async (id, action) => {
  try {
    const eventParticipant = await prisma.eventRequest.findFirst({
      where: { id },
      include: {
        profile: true,
        Event: true,
        host: true,
      },
    });

    const invity = await prisma.profile.findUnique({
      where: {
        id: eventParticipant.Event.profileId,
      },
    });

    if (!eventParticipant) {
      throw {
        message: messages.REQUEST_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    if (eventParticipant.status !== 'PENDING') {
      throw {
        message: `You can't ${action}. ${eventParticipant?.status?.toLowerCase()} Request `,
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }

    if (action === 'accept') {
      await prisma.eventRequest.update({
        where: { id: eventParticipant.id },
        data: { status: 'ACCEPTED' },
      });
      const notificationSub = `Congratulations: ${eventParticipant.host.name} accept your invitaion.`;
      const notificationDes = `${eventParticipant.host.name} accept your invitaion for ${eventParticipant?.Event?.name}`;
      await sendNotificationToDevice(
        eventParticipant.profile.notificationToken,
        notificationSub,
        notificationDes
      );
      await createNotification({
        profileId: eventParticipant.profileId,
        subject: notificationSub,
        description: notificationDes,
        isSystem: false,
        requestId: eventParticipant?.id,
        refrenceId: invity.id,
        type: 'acceptRequest',
      });
      return {
        message: messages.REQUEST_ACCEPTED,
        statusCode: StatusCodes.OK,
      };
    }

    if (action === 'decline') {
      await prisma.eventRequest.update({
        where: { id: eventParticipant.id },
        data: { status: 'REJECTED' },
      });

      const notificationSub = `Opps!: ${eventParticipant.host.name} decline your invitaion.`;
      const notificationDes = `${eventParticipant.host.name} decline your invitaion for ${eventParticipant?.Event?.name}`;
      await sendNotificationToDevice(
        eventParticipant?.profile?.notificationToken,
        notificationSub,
        notificationDes
      );
      await createNotification({
        profileId: eventParticipant?.profileId,
        subject: notificationSub,
        description: notificationDes,
        isSystem: false,
        refrenceId: invity?.id,
        requestId: eventParticipant?.id,
        type: 'declineRequest',
      });

      return {
        message: messages.REQUEST_DECLINE,
        statusCode: StatusCodes.OK,
      };
    }

    throw {
      message: messages.INVALID_ACTION,
      statusCode: StatusCodes.BAD_REQUEST,
    };
  } catch (error) {
    console.log(error);
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getRequestByUser = async (profileId) => {
  const requests = await prisma.eventRequest.findMany({
    where: {
      profileId,
      NOT: {
        status: 'CANCELLED',
      },
    },
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
  });

  return {
    message: 'Requests Fetched successfully',
    data: requests,
    statusCode: StatusCodes.OK,
  };
};
const getRequestByHost = async (profileId, status) => {
  const requests = await prisma.eventRequest.findMany({
    where: { hostId: profileId, status: status || 'PENDING' },
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
  });

  return {
    message: 'Requests Fetched successfully',
    data: requests,
    statusCode: StatusCodes.OK,
  };
};

const sendEventRequest = async (eventId, profileId, hostId) => {
  try {
    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { profile: true },
    });

    if (!event) {
      throw {
        message: messages.EVENT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    const checkRequest = await prisma.eventRequest.findFirst({
      where: {
        profileId,
        eventId,
        hostId,
      },
    });

    if (checkRequest) {
      throw {
        message: messages.REQUEST_ALREADY_SENT,
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }

    const newRequest = await prisma.eventRequest.create({
      data: {
        profileId,
        eventId,
        hostId,
      },
      include: {
        profile: true,
        host: true,
      },
    });
    const notificaitonTitle = `Request from ${event?.profile?.name}`;
    const notificaitonDes = `${event?.profile?.name} request you for ${event?.name}`;
    await sendNotificationToDevice(newRequest?.host?.notificationToken);

    await createNotification({
      profileId: newRequest?.host.id,
      subject: notificaitonTitle,
      description: notificaitonDes,
      isSystem: false,
      refrenceId: event?.profile?.id,
      type: 'newRequest',
    });
    return {
      message: messages.REQUEST_SENT,
      data: newRequest,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const saveImagesEvent = async (data, files) => {
  try {
    let uploadedImages = [];

    if (files) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadFileToGCS(file, 'events-images'))
      );
    }

    await prisma.eventImages.createMany({
      data: uploadedImages?.map((url) => ({ eventId: data.eventId, url })),
    });

    const updatedEvent = await prisma.event.update({
      where: { id: data.eventId },
      data: {
        location: data.location,
      },
      include: {
        EventImages: true,
        restaurant: {
          include: {
            RestaurantImages: true,
          },
        },
      },
    });

    return {
      message: messages.RESTAURANT_CREATED,
      data: updatedEvent,
      statusCode: StatusCodes.CREATED,
    };
  } catch (error) {
    console.log(error);
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  sendEventRequest,
  updateEvent,
  deleteEvent,
  handleRequest,
  getRequestByUser,
  getRequestByHost,
  saveImagesEvent,
  cancelRequest,
};
