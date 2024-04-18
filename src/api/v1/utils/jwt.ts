import jwt from 'jsonwebtoken'
import {User} from '../models'

export type TokenPayLoad = {
    id: string;
    name: string;
    email: string;
}

// default token life is 365 days :v implement refresh token later
const generateToken = (user: User, secretSignature: string, tokenLife: string = "365d"): Promise<string> =>
    new Promise((resolve, reject) => {
        const {id, name, email} = user;
        const payload: TokenPayLoad = {id, name, email};
        const options = {expiresIn: tokenLife};

        jwt.sign(payload, secretSignature, options, (error, token) => {
            if (error) {
                return reject(error);
            }
            if (typeof token === 'string') {
                resolve(token);
            } else {
                reject(new Error('Unexpected type of token.'));
            }
        });
    });

const verifyToken = (token: string, secretSignature: string): Promise<TokenPayLoad> =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secretSignature, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            return resolve(decoded as TokenPayLoad);
        });
    })

export {generateToken, verifyToken}