const express = require('express');
const {
  createReview,
  fetchReviews,
} = require('../controllers/reviews.controller');
const ENDPOINTS = require('./endpoints.routes');
const { reviewValidation } = require('../validators/review.validator');
const validateRequest = require('../validators/validate.schema');

const router = express.Router();

router.get(ENDPOINTS.reviews.root, fetchReviews);

router.post(
  ENDPOINTS.reviews.root,
  reviewValidation,
  validateRequest,
  createReview
);

module.exports = router;
