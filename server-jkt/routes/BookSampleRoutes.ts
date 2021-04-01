
import BookSampleController from 'controller/BookSampleController';
import { Router, Request, Response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import ApiService from 'utils/ApiService';

var bookSampleRouter = Router();

bookSampleRouter.post('/', async (req: Request, res: Response) => {
    const { lendable, location, bookId }: { lendable: boolean, location: string, bookId: number } = req.body;
    try {
        let bookSample = await BookSample.create({
            lendable,
            location,
            bookId
        })
        return bookSample;
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
})

bookSampleRouter.put('/', async (req: Request, res: Response) => {
    const { id, bookId, lendable, location }: { id: Number, bookId: Number, location: string, lendable: boolean } = req.body
    // update now in server jkt
    try {
        await BookSample.update({
            bookId,
            lendable,

        }, {
            where: {
                id: Number(id),
            },
            returning: true,

        })

        let bookSample = await BookSample.findOne({
            where: {
                id: Number(id)
            }
        })

        res.send(bookSample)
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }

    // make a put request to server bandung
})


bookSampleRouter.get('/', async (req: Request, res: Response) => {
    const bookId = req.query.bookId as string || null;
    // const location = req.query.location as String;
    try {
        if (bookId) {
            let result = await BookSample.findAll({
                where: {
                    bookId
                }
            })
            return result
        }

        let result = BookSample.findAll();
        return res.send(result);
    } catch (error) {
        return res.status(500).send({
            message: error
        })

    }

})

bookSampleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        let id = req.params.id;
        let bookSample = await BookSample.findByPk(id);
        if (bookSample) {
            return res.send(bookSample);
        }

        return res.status(400).send({
            message: "book sample with id " + id + " not found"
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
})


bookSampleRouter.put('/', async (req: Request, res: Response) => {
    const { id, lendable, location, bookId }: { id: string, lendable: boolean, location: string, bookId: number } = req.body
    let bookSample = BookSample.findByPk(id);
    try {
        if (bookSample) {
            await BookSample.update({
                lendable,
                location,
                bookId
            }, {
                where: {
                    id
                }
            });
            let updatedBookSample = BookSample.findByPk(id);
            return res.send(updatedBookSample);
        }

        return res.status(400).send({
            message: "boook sample not found"
        })

    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }



});

bookSampleRouter.delete('/:id', async (req: Request, res: Response) => {

    let idBookSample = req.params.id as string;
    try {
        await BookSample.destroy({
            where: {
                id: idBookSample
            }
        })
        return res.send({
            message: "Deleted"
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }

});


export default bookSampleRouter;

