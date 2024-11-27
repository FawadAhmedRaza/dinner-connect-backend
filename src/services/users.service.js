const { PrismaClient } = require('@prisma/client');

const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages.dictionary');
const { uploadFileToGCS } = require('../middlewares/googleCloudUpload');

const prisma = new PrismaClient();
const verifyPhone = async (data) => {
  const { phoneNumber } = data;

  try {
    await admin.auth().createSessionCookie(phoneNumber, {
      expiresIn: 60 * 5000,
    });

    return {
      message: messages.VERIFICATION_SENT,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    return {
      message: error.message || messages.VERIFICATION_SENT_ERROR,
      statusCode: StatusCodes.BAD_REQUEST,
    };
  }
};

const verifyConfirm = async (req) => {
  const { otp } = req.body;

  try {
    // Verify the OTP with Firebase
    await admin.auth().verifyIdToken(otp);

    return {
      message: messages.PHONE_VERIFIED,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    return {
      message: messages.PHONE_UNVERIFIED,
      statusCode: StatusCodes.UNAUTHORIZED,
    };
  }
};

const getUsers = async (filters) => {
  try {
    const users = await prisma.profile.findMany({
      where: {
        ...filters, // Prisma automatically matches filterable fields
        ...(filters.mood && { mood: filters.mood }),
        ...(filters.cuisines && {
          cuisines: { hasSome: JSON.parse(filters.cuisines) },
        }),
        ...(filters.ambience && {
          ambience: { hasSome: JSON.parse(filters.ambience) },
        }),
        ...(filters.languages && {
          languages: { hasSome: JSON.parse(filters.languages) },
        }),
      },
    });

    return {
      message: messages.USERS_FETCHED,
      data: users,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.USERS_FETCHED_ERROR,
      statusCode: StatusCodes.BAD_REQUEST,
    };
  }
};

const createEditProfile = async (userId, data, files) => {
  try {
    let profileImageUrl;
    let coverImageUrl;
    // Upload profileImage and coverImage to Google Cloud Storage
    if (files && files.profileImage) {
      profileImageUrl = await uploadFileToGCS(
        files.profileImage[0],
        'profile-images'
      );
    }
    if (files && files.coverImage) {
      coverImageUrl = await uploadFileToGCS(
        files.coverImage[0],
        'cover-images'
      );
    }

    const existingProfile = await prisma.profile.findFirst({
      where: { email: data.email },
    });
    const payloadData = {
      ...data,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
      ...(coverImageUrl && { coverImage: coverImageUrl }),
      ...(data.ambience && { ambience: JSON.parse(data.ambience) }),
      ...(data.cuisines && { cuisines: JSON.parse(data.cuisines) }),
      ...(data.languages && { languages: JSON.parse(data.languages) }),
      ...(data.dateOfBirth && {
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      }),
    };

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: payloadData,
      });

      return {
        message: 'Profile updated successfully',
        data: updatedProfile,
        statusCode: StatusCodes.OK,
      };
    }
    // Create new profile
    const newProfile = await prisma.profile.create({
      data: payloadData,
    });

    return {
      message: 'Profile created successfully',
      data: newProfile,
      statusCode: StatusCodes.CREATED,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
const deleteProfile = async (id) => {
  try {
    await prisma.profile.delete({ where: { id } });

    return {
      message: messages.PROFILE_DELETED,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getProfileByUserId = async (userId) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      throw {
        message: messages.PROFILE_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    return {
      message: messages.PROFILE_FETCHED,
      data: profile,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
const getProfileByEmail = async (email) => {
  try {
    const profile = await prisma.profile.findFirst({ where: { email } });

    if (!profile) {
      throw {
        message: messages.PROFILE_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    return {
      message: messages.PROFILE_FETCHED,
      data: profile,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};
const getImagesByProfileId = async (id) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw {
        message: messages.PROFILE_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }
    const images = await prisma.userImages.findMany({
      where: {
        userId: id,
      },
    });
    return {
      message: messages.IMAGES_FETCHED,
      data: images,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

const getProfileById = async (id) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw {
        message: messages.PROFILE_NOTFOUND,
        statusCode: StatusCodes.NOT_FOUND,
      };
    }

    return {
      message: messages.PROFILE_FETCHED,
      data: profile,
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    throw {
      message: error.message || messages.SERVER_ERROR,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

/**
 * Upload and save the user image
 */
const uploadUserImage = async ({ userId, type, file }) => {
  try {
    // Upload file to Google Cloud Storage
    const imageUrl = await uploadFileToGCS(file);

    // Save the image details in the UserImages table
    const userImage = await prisma.userImages.create({
      data: {
        userId,
        type,
        image: imageUrl,
      },
    });

    return {
      message: 'Image uploaded and saved successfully',
      statusCode: StatusCodes.OK,
      data: userImage,
    };
  } catch (error) {
    throw {
      message: messages.SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  verifyConfirm,
  getUsers,
  getProfileByUserId,
  deleteProfile,
  getProfileById,
  getImagesByProfileId,
  createEditProfile,
  verifyPhone,
  uploadUserImage,
  getProfileByEmail,
};
