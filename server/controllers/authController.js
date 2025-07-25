import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Assuming a User model exists

// Generate JWT token
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
        role,
    });

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
});

// Login an existing user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
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
