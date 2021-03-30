import { Router, Request, Response, response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import Lend from 'models/Lend';
import User from 'models/User';
import decodeToken from 'utils/decodeToken';

var userRouter = Router();

userRouter.get('/current', async (req: Request, res: Response) => {
    const user = decodeToken(req);
    if (user != null) {
        return res.send(user);
    }
    return res.status(400).send({
        message: "user not found"
    });
});

userRouter.get('/lends', async (req: Request, res: Response) => {
    try {
        const loggedUser = decodeToken(req);
        if (loggedUser) {

            const user = await User.findByPk(loggedUser.id, {
                include:BookSample 
            });
            return res.send(user);

        }
        return res.status(401).send({
            message: "Access denied"
        });

    } catch (error) {

        return res.status(500).send({
            message : error
        })
    }

});



export default userRouter