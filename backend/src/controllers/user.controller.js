import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Unable to generate tokens');
    }
};

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

const loginUser = asyncHandler(async (req, res) => {
    // Get the login credentials
    const { username, email, password } = req.body;

    // Check if credentials are recieved or not
    if (!username) {
        throw new ApiError(400, 'Username is required');
    }
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }
    if (!password) {
        throw new ApiError(400, 'Password is required');
    }

    // Find the user using username and email
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    // Check if user has been returned by the DB or not
    if (!user) {
        throw new ApiError(
            404,
            'No user found with the following username and email'
        );
    }

    // Check for validity of the password using the method injected in the schema during model creation
    const validPassowrd = await user.isPasswordCorrect(password);
    if (!validPassowrd) {
        throw new ApiError(400, 'Password is incorrect');
    }

    // Generate access and refresh token for the user
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // Store the tokens in cookies and return the logged in user
    const options = {
        httpOnly: true,
        secure: true,
    };

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successfully'
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    // Find the user with their id in the database
    await User.findOneAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    // remove access and refresh tokens from the cookies
    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export { registerUser, loginUser, logoutUser };
