import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Corrected import

// Generate JWT token
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
    console.log('Register request body:', req.body);
    const { email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    console.log('User exists:', userExists);
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    try {
        // Create user (password will be hashed by pre-save hook)
        const user = await User.create({
            email,
            password,
            role,
        });
        console.log('User created:', user);

        if (user) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (err) {
        console.error('Error during user creation:', err);
        res.status(500);
        throw err;
    }
});

// Login an existing user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
