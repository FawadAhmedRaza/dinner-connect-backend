const { getReviews, review } = require('../services/reviews.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

const fetchReviews = async (req, res) => {
  try {
    const { query } = req;
    const result = await getReviews(query);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const createReview = async (req, res) => {
  try {
    const { body } = req;
    const result = await review(body);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

module.exports = { fetchReviews, createReview };
