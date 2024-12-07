const express = require('express');
const {
  fetchWishlists,
  addWishlist,
  modifyWishlist,
  removeWishlist,
} = require('../controllers/wishlists.controller');
const ENDPOINTS = require('./endpoints.routes');
const { wishlistValidation } = require('../validators/wishlist.validator');
const validateRequest = require('../validators/validate.schema');

const router = express.Router();

router.get(ENDPOINTS.wishlist.root, fetchWishlists);
router.post(
  ENDPOINTS.wishlist.root,
  wishlistValidation,
  validateRequest,
  addWishlist
);
router.put(
  ENDPOINTS.wishlist.byId,
  wishlistValidation,
  validateRequest,
  modifyWishlist
);
router.post(ENDPOINTS.wishlist.delete, removeWishlist);

module.exports = router;
