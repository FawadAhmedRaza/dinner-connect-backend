const {
  getWishlists,
  createWishlist,
  updateWishlist,
  deleteWishlist,
} = require('../services/wishlist.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

const fetchWishlists = async (req, res) => {
  try {
    const { query } = req;
    const result = await getWishlists(query);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const addWishlist = async (req, res) => {
  try {
    const { body } = req;
    const result = await createWishlist(body);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const modifyWishlist = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const result = await updateWishlist(id, body);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const removeWishlist = async (req, res) => {
  try {
    const {
      body: { eventId, profileId },
    } = req;
    const result = await deleteWishlist(eventId, profileId);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

module.exports = {
  fetchWishlists,
  addWishlist,
  modifyWishlist,
  removeWishlist,
};
