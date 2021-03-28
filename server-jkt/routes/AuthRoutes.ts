import { Router } from 'express';

// const RefreshToken = require("../model/RefreshToken");
import RefreshToken, { RefreshTokenAttributes } from '../models/RefreshToken';
import { Request, Response } from 'express';
import User, { UserAttributes } from '../models/User';

import bcrypt from 'bcrypt';
import { registerValidation, loginValidation } from '../validation/validation';

import jwt from 'jsonwebtoken';


function generateAccessToken(name: string, email: string, id: number, isAdmin: Boolean, secret: string, expiresIn?: string | undefined): String {
    return jwt.sign(
        // payload data
        { name, email, id, isAdmin },
        secret,
        expiresIn ? { expiresIn } : undefined
    );
}

const router = Router();
// Register route
router.post("/register", async (req: Request, res: Response) => {
    console.log("register triggered");
    console.log(req.body);
    // validate request body
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Check if email already exists, throw error if email already exist
    const isEmailExist = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (isEmailExist)
        return res.status(400).json({ error: "Email already exists" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const isAdmin = req.body.isAdmin as boolean
    try {
        const user = await User.create({
            email: req.body.email,
            name: req.body.name,
            password, // hashed password
            isAdmin  
        });
        let newUser = await User.findOne({
            where : {
                id : user.id
            }
        })
        res.send(newUser);
    } catch (error) {
        res.status(400).json({ error });
    }
});

// login route
router.post("/login", async (req: Request, res: Response) => {
    // validate the user
    const { error } = loginValidation(req.body);
    // throw validation errors
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user: UserAttributes | null = await User.scope('withPassword').findOne({
        where: { email: req.body.email }
    });

    // throw error when email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });
    // check for password correctness;

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).json({ error: "Password is wrong" });

    const isAdmin = req.body.isAdmin as Boolean
    // create access token
    const accessToken: String = generateAccessToken(user.name, user.email, user.id, isAdmin, `${process.env.ACCESS_TOKEN_SECRET}`, `${process.env.ACCESS_TOKEN_LIFE}`);

    const refreshToken: String = generateAccessToken(
        user.name,
        user.email,
        user.id,
        isAdmin,
        `${process.env.REFRESH_TOKEN_SECRET}`, undefined
    );


    const newRefreshToken = await RefreshToken.create({
        refreshToken,
    });
    try {
        //* Save refresh token to database
        await newRefreshToken.save();
    } catch (error) {
        return res.status(400).json({ msg: "failed to save refreshToken" });
    }

    const response = { accessToken, refreshToken };

    return res.status(200).json(response);
});

// To generate new token
router.post("/refresh", async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null) return res.sendStatus(401);

    // Get refresh Token
    let savedRefreshToken = await RefreshToken.findOne({
        where: { refreshToken: refreshToken }
    })

    if (savedRefreshToken == null) return res.sendStatus(403);

    try {

        const decoded = await jwt.verify(savedRefreshToken.refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);

        let user = (decoded as UserAttributes);
        //* Generate new access token from refreshToken
        const accessToken: String = generateAccessToken(user.name, user.email, user.id, user.isAdmin, `${process.env.ACCESS_TOKEN_SECRET}`, `${process.env.ACCESS_TOKEN_LIFE}`);
        return res.status(200).send({ accessToken });
    } catch (err) {
        return res.status(403).send({ error: "Token is not valid" });
    }
});


router.delete("/logout", async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        await RefreshToken.destroy({ where: { refreshToken: refreshToken } })
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).send({ message: err });
    }
})

export default router
