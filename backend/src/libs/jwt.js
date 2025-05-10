import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) return reject(err);
                resolve(token);
            }
        );
    });
}

export function createRefreshToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) return reject(err);
                resolve(token);
            }
        );
    });
}