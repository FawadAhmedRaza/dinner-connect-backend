const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require('../services/resturants.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

const create = async (req, res) => {
  try {
    const result = await createRestaurant(req.body, req.files);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const list = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getRestaurants(filters);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getRestaurantById(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateRestaurant(id, req.body, req.files);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteRestaurant(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
