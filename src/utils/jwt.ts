import jwt from 'jsonwebtoken';
import { AppJwtPayload } from '../types/jwt';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}

/**
 * Generates a signed JWT token from the given payload.
 * @param payload - User info to encode (id, email, role)
 * @returns JWT string
 */
export const generateToken = (payload: AppJwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies and decodes a JWT token.
 * @param token - JWT string from Authorization header
 * @returns Decoded payload (with id, email, role)
 */
export const verifyToken = (token: string): AppJwtPayload => {
    return jwt.verify(token, JWT_SECRET) as AppJwtPayload;
};
