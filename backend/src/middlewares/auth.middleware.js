import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        // Get the access token from the cookies
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Unauthorized Request');
        }

        // Verify the access token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Get the user using the _id in the payload
        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        );

        if (!user) {
            throw new ApiError(401, 'Invalid Access Token');
        }

        // return response
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Access Token');
    }
});
