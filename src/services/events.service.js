const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');

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
    console.log(error);
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
        EventInvitation: true,
        restaurant: {
          include: {
            RestaurantImages: true,
          },
        },
      },
    });

    return {
      message: messages.EVENT_FETCHED,
      data: events,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    console.log(error);
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
      include: { participants: true },
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
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
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

const handleInvitation = async (eventId, userId, action) => {
  try {
    const eventParticipant = await prisma.eventInvitation.findFirst({
      where: { eventId, profileId: userId },
    });

    if (!eventParticipant) {
      throw {
        message: messages.INVITATION_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    if (action === 'accept') {
      await prisma.eventInvitation.update({
        where: { id: eventParticipant.id },
        data: { status: 'ACCEPTED' },
      });

      return {
        message: messages.INVITATION_ACCEPTED,
        statusCode: StatusCodes.OK,
      };
    }

    if (action === 'decline') {
      await prisma.eventInvitation.update({
        where: { id: eventParticipant.id },
        data: { status: 'DECLINED' },
      });

      return {
        message: messages.INVITATION_DECLINE,
        statusCode: StatusCodes.OK,
      };
    }

    throw {
      message: messages.INVALID_ACTION,
      statusCode: StatusCodes.BAD_REQUEST,
    };
  } catch (error) {
    console.log('Error', error);
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getInvitationsByUser = async (profileId, status) => {
  const invitations = await prisma.eventInvitation.findMany({
    where: { profileId, status: status || 'PENDING' },
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
    },
  });

  return {
    message: 'Invitations Fetched successfully',
    data: invitations,
    statusCode: StatusCodes.OK,
  };
};

const sendEventInvitation = async (eventId, userId) => {
  try {
    // Check if the event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw {
        message: messages.EVENT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    const checkInviation = await prisma.eventInvitation.findFirst({
      where: {
        profileId: userId,
        eventId,
      },
    });

    if (checkInviation) {
      throw {
        message: messages.INVITATION_ALREADY_SENT,
        statusCode: StatusCodes.BAD_REQUEST,
      };
    }
    const newInvitaion = await prisma.eventInvitation.create({
      data: {
        profileId: userId,
        eventId,
      },
    });

    return {
      message: messages.INVITATION_SENT,
      data: newInvitaion,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  sendEventInvitation,
  updateEvent,
  deleteEvent,
  handleInvitation,
  getInvitationsByUser,
};
