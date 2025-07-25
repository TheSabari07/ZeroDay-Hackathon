import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Corrected import path

// Middleware to protect routes by verifying JWT
export const protect = expressAsyncHandler(async (req, res, next) => {
	// Get token from headers
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select('-password');
		if (!req.user) {
			res.status(401);
			throw new Error('Not authorized, user not found');
		}
		next();
	} catch (error) {
		res.status(401);
		throw new Error('Not authorized, token failed');
	}
});

// Middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			res.status(403);
			throw new Error('Access denied, insufficient permissions');
		}
		next();
	};
};
