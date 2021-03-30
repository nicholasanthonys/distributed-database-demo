
import BookSampleController from 'controller/BookSampleController';
import { Router, Request, Response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import ApiService from 'utils/ApiService';

var bookSampleRouter = Router();

bookSampleRouter.post('/', async (req: Request, res: Response) => {
})

bookSampleRouter.put('/', async (req: Request, res: Response) => {
    const { id, bookId, lendable, location }: { id: Number, bookId: Number, location: string, lendable: boolean } = req.body
    if (location == process.env.SITE_LOCATION) {
        // update now in server jkt
        try {
            await BookSample.update({
                bookId,
                lendable,
                location

            }, {
                where: {
                    id: Number(id),
                },
                returning: true,

            })

            let book = await Book.findOne({
                where: {
                    id: Number(id)
                }
            })
        } catch (error) {
            return res.status(500).send({
                message: error
            })
        }
    }

    // make a put request to server bandung
})


bookSampleRouter.get('/', async (req: Request, res: Response) => {
    const bookId = req.query.bookId as string || null;
    const location = req.query.location as String;
    var bookSampleBdg = [];

    const bookSampleController = new BookSampleController();
    // if there are no parameter book id, then it must be get all
    if (bookId) {

        if (location) {
            if (location == process.env.SITE_LOCATION) {
                try {
                    let response = await bookSampleController.getCurrentSite(req.headers.authorization, bookId);
                    return res.send(response.data);
                } catch (error) {
                    return res.status(500).send({
                        messge: error
                    })
                }
            }

            // get data from other site
            try {
                let result = await bookSampleController.getBandung(req.headers.authorization, bookId)
                return res.send(result);
            } catch (error) {
                return res.status(500).send({
                    messge: error
                })
            }

        }

        try {
            if (process.env.SITE_LOCATION == "jakarta") {
                let resultJKT = await bookSampleController.getByBookId(bookId);
                return res.send(resultJKT);
            }
            let resultBDG = await bookSampleController.getByBookId(bookId);
            return res.send(resultBDG);
        } catch (error) {
            return res.status(500).send({
                messge: error
            })
        }


    }

    // return all data if book is not specified and location is not specified
    let bookSamplesJakarta = await BookSample.findAll() as Array<BookSample>;
    try {
        let response = await bookSampleController.getBandung(req.headers.authorization, null);
        let bookSampleBDG = response.data as Array<BookSample>
        let result = [...bookSamplesJakarta, ...bookSampleBDG];
        return res.send(result);
    } catch (error) {
        return res.status(500).send({
            messge: error
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

        if (process.env.SITE_LOCATION == "jakarta") {
            // make request to bandung
            try {
                ApiService.init(process.env.SITE_URL_BDG, req.headers.authorization);
                let response = await ApiService.get(`/book-sample/${id}`, {});
                return response.data;
            } catch (error) {
                return error;
            }
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


bookSampleRouter.put('/:id/book-sample', async (req: Request, res: Response) => {


});

bookSampleRouter.delete('/:idBookSample', async (req: Request, res: Response) => {

});

bookSampleRouter.delete('/:id', async (req: Request, res: Response) => {

})


export default bookSampleRouter;

