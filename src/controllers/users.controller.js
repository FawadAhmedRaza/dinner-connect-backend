const {
  verifyPhone,
  verifyConfirm,
  getProfileById,
  getProfileByUserId,
  deleteProfile,
  createEditProfile,
  getUsers,
  uploadUserImage,
  getUserImages,
} = require('../services/users.service');
const { errorResponse, successResponse } = require('../utils/response.handler');

const sendVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const result = await verifyPhone({ phoneNumber });
    successResponse(res, result.message, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const confirmVerificationCode = async (req, res) => {
  const { otp } = req.body;

  try {
    const result = await verifyConfirm({ otp });
    successResponse(res, result.message, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const fetchUsers = async (req, res) => {
  try {
    const filters = req.query; // Extract filters from search params
    const result = await getUsers(filters);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const createOrEditProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await createEditProfile(userId, req.body, req.files);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const removeProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteProfile(id);
    successResponse(res, result.message, null, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const fetchProfileByUserId = async (req, res) => {
  const { id } = req.params;
  console.log('req.params', req.params);
  try {
    const result = await getProfileByUserId(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const fetchProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await getProfileById(id);
    successResponse(res, result.message, result.data, result.statusCode);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode);
  }
};

const uploadImage = async (req, res) => {
  const { userId, type } = req.body;

  try {
    if (!req.file) {
      return errorResponse(res, 'No file provided', 400);
    }

    const result = await uploadUserImage({ userId, type, file: req.file });
    return successResponse(res, result.message, result.statusCode, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

const getUserImagesController = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await getUserImages(userId);
    successResponse(res, result.message, result.statusCode, result.data);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode || 500);
  }
};
module.exports = {
  sendVerificationCode,
  fetchProfileById,
  createOrEditProfile,
  removeProfile,
  fetchProfileByUserId,
  fetchUsers,
  confirmVerificationCode,
  getUserImagesController,
  uploadImage,
};
