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
      include: { participants: true },
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
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
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
    const eventParticipant = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!eventParticipant) {
      throw {
        message: messages.INVITATION_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    if (action === 'accept') {
      await prisma.eventParticipant.update({
        where: { eventId_userId: { eventId, userId } },
        data: { status: 'ACCEPTED' },
      });

      return {
        message: messages.INVITATION_ACCEPTED,
        statusCode: StatusCodes.OK,
      };
    }

    if (action === 'decline') {
      await prisma.eventParticipant.update({
        where: { eventId_userId: { eventId, userId } },
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
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const sendEventInvitation = async (eventId, userIds) => {
  try {
    // Check if the event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw {
        message: messages.EVENT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    // Create invitations for all users
    const invitations = userIds.map((userId) => ({
      eventId,
      userId,
      status: 'PENDING', // Default status for new invitations
    }));

    await prisma.eventParticipant.createMany({
      data: invitations,
      skipDuplicates: true, // Skip if the invitation already exists
    });

    return {
      message: messages.INVITATION_SENT,
      data: invitations,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
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
  sendEventInvitation,
  updateEvent,
  deleteEvent,
  handleInvitation,
};
