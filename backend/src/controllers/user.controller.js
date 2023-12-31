import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    // Get the credentials from the frontend
    const { username, email, password } = req.body;

    // validate credentials
    if (username === '') {
        throw new ApiError(400, 'Username is required');
    }
    if (email === '') {
        throw new ApiError(400, 'Email is required');
    }
    if (password === '') {
        throw new ApiError(400, 'Password is required');
    }

    // Check if the user already exists before creating the user
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    // Create the user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    });

    // Get the user
    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    // Check if the user has been created successfully or not before returning
    if (!createdUser) {
        throw new ApiError(500, 'Failed to create user');
    }

    // All ok! Return the user
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, 'User created successfully!!'));
});

export { registerUser };
