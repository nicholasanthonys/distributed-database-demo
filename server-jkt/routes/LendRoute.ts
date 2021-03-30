import { Router, Request, Response, response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import Lend from 'models/Lend';
import User from 'models/User';
import decodeToken from 'utils/decodeToken';

var lendRouter = Router();

lendRouter.post('/', async (req: Request, res: Response) => {
    const { userId, bookSampleId, returnedAt }: { userId: number, bookSampleId: string, returnedAt: Date } = req.body;
    try {
        let lend = await Lend.create({
            userId,
            bookSampleId,
            returnedAt
        })
        return res.send(lend);
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
});

lendRouter.get('/lends', async (req: Request, res: Response) => {
    const userIdStr = req.query.userId as string;
    const bookSampleIdStr = req.query.bookSampleId as string;
    const userId = Number(userIdStr);
    const bookSampleId = Number(bookSampleIdStr);

    try {

        if (userId) {
            if (bookSampleId) {
                let lends = await Lend.findAll({
                    where: {
                        userId,
                        bookSampleId
                    }
                })
                return res.send(lends);

            }
            let lends = await Lend.findAll({
                where: {
                    userId,
                }
            })
            return res.send(lends);

        }

        if (bookSampleId) {

            let lends = await Lend.findAll({
                where: {
                    bookSampleId,
                }
            })
            return res.send(lends);

        }
        // return all
        let lends = await Lend.findAll()
        return res.send(lends);


    } catch (error) {
        console.log("error is ")
        console.log(error);
        return res.status(500).send({
            message: error
        })
    }

});

lendRouter.put('/lends/:id', async (req: Request, res: Response) => {
    const id = req.params.id as String
    const { returnedAt }: { returnedAt: Date } = req.body
    try {
        let updatedLend= await Lend.update(
            {
                returnedAt
            },
            {
                where: {
                    id: Number(id)
                }
            }
        )
        return res.send(updatedLend);
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default lendRouter