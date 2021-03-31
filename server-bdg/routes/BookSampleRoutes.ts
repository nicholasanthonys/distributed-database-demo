
import { Router, Request, Response } from 'express'
import BookSample from 'models/BookSample';


var bookSampleRouter = Router();

bookSampleRouter.post('/', async (req: Request, res: Response) => {
    console.log("book sample post bandung triggered");
    const { lendable, location, bookId }: { lendable: boolean, location: string, bookId: number } = req.body;
    try {
        let bookSample = await BookSample.create({
            lendable,
            location,
            bookId
        })
        return res.send(bookSample);
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
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
            return res.send(result);
        }

        console.log("book id not specified");
        let result = await BookSample.findAll();
        console.log("result is ")
        console.log(result);
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
    const { id, lendable,  bookId }: {id: string , lendable: boolean,  bookId: number } = req.body
    let bookSample = BookSample.findByPk(id);
    try {
        if (bookSample) {
            console.log("book sample found");
            await BookSample.update({
                lendable,
                bookId
            }, {
                where: {
                    id
                }
            });
            let updatedBookSample = await BookSample.findByPk(id);
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

