import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { UserAttributes } from '../models/User';

//* middleware to validate token
const decodeToken = (req: Request):  UserAttributes | null => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Example : Bearer kdjdkaidkwkk(this is the token). Split by space
        const token = authHeader.split(' ')[1];
        try {
            //* Decode the json web token, usually contain user payload
            const decoded = jsonwebtoken.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);

            return (decoded as UserAttributes)

        } catch (err) {
            return null;
        }
    }

    return null;

};

export default decodeToken;