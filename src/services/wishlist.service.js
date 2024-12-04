const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');

const prisma = new PrismaClient();

const getWishlists = async (filters = {}) => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: filters,
      include: {
        Profile: true,
        Event: {
          include: {
            profile: true,
          },
        },
      },
    });

    return {
      status: StatusCodes.OK,
      message: messages.WISHLISTS_FETCHED_SUCCESSFULLY,
      success: true,
      data: wishlists,
    };
  } catch (err) {
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

const createWishlist = async (data) => {
  try {
    const newWishlist = await prisma.wishlist.create({
      data,
    });

    return {
      status: StatusCodes.CREATED,
      message: messages.WISHLIST_CREATED_SUCCESSFULLY,
      success: true,
      data: newWishlist,
    };
  } catch (error) {
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

const updateWishlist = async (id, data) => {
  try {
    const updatedWishlist = await prisma.wishlist.update({
      where: { id },
      data,
    });

    return {
      status: StatusCodes.OK,
      message: messages.WISHLIST_UPDATED_SUCCESSFULLY,
      success: true,
      data: updatedWishlist,
    };
  } catch (error) {
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

const deleteWishlist = async (id) => {
  try {
    await prisma.wishlist.delete({
      where: { id },
    });

    return {
      status: StatusCodes.OK,
      message: messages.WISHLIST_DELETED_SUCCESSFULLY,
      success: true,
      data: null,
    };
  } catch (error) {
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: messages.SERVER_ERROR,
    };
  }
};

module.exports = {
  getWishlists,
  createWishlist,
  updateWishlist,
  deleteWishlist,
};
