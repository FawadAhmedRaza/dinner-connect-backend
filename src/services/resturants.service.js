const { PrismaClient } = require('@prisma/client');
const { StatusCodes } = require('http-status-codes');
const { uploadFileToGCS } = require('../middlewares/googleCloudUpload');
const messages = require('../utils/messages.dictionary');

const prisma = new PrismaClient();

const createRestaurant = async (data, files) => {
  try {
    let uploadedImages = [];

    if (files) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadFileToGCS(file, 'restaurant-images'))
      );
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...data,
        RestaurantImages: {
          create: uploadedImages.map((url) => ({ url })),
        },
      },
    });

    return {
      message: messages.RESTAURANT_CREATED,
      data: newRestaurant,
      statusCode: StatusCodes.CREATED,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getRestaurants = async (filters) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        ...filters,
      },
      include: {
        RestaurantImages: true,
      },
    });

    return {
      message: messages.RESTAURANT_FETCHED,
      data: restaurants,
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

const getRestaurantById = async (id) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        RestaurantImages: true,
      },
    });

    if (!restaurant) {
      throw {
        message: messages.RESTAURANT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    return {
      message: messages.RESTAURANT_FETCHED,
      data: restaurant,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const updateRestaurant = async (id, data, files) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });

    if (!restaurant) {
      throw {
        message: messages.RESTAURANT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    let uploadedImages = [];

    if (files) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadFileToGCS(file, 'restaurant-images'))
      );

      await prisma.restaurantImages.createMany({
        data: uploadedImages.map((url) => ({ url, restaurantId: id })),
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      message: messages.RESTAURANT_UPDATED,
      data: updatedRestaurant,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const deleteRestaurant = async (id) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });

    if (!restaurant) {
      throw {
        message: messages.RESTAURANT_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    await prisma.restaurant.delete({ where: { id } });

    return {
      message: messages.RESTAURANT_DELETED,
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
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
