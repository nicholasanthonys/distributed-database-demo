import { Router, Request, Response, response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import Lend from 'models/Lend';
import User from 'models/User';
import ApiService from 'utils/ApiService';
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

userRouter.get('/mylends', async (req : Request, res : Response) => {
    const user = decodeToken(req);
    if(user){
        let lend = await Lend.findAll({
            where : {
                userId : user.id
            }
        })
        
        // find from site bandung
        ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
        let response = await ApiService.get('/lend', {
            userId : user.id
        });
        let result = [...lend, ...response.data] ;
        return res.send(result);

    }
    return response.status(401).send({
        message : "access denied"
    })
});


userRouter.get('/lends', async (req: Request, res: Response) => {
    try {
        const loggedUser = decodeToken(req);
        if (loggedUser) {
            console.log(loggedUser)
            if (!loggedUser.isAdmin) {
                return res.status(401).send({
                    message: "Only admin can access this route to list all lends"
                })
            }
            const lends = await Lend.findAll();


            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization)
            let response = await ApiService.get('/lend', {
                userId: loggedUser.id
            });

            let LendsBDG = response.data as Lend[];
            let result = [...lends, ...LendsBDG]


            return res.send(result)

        }
        return res.status(401).send({
            message: "Access denied"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: error
        })
    }

});

userRouter.post('/lends', async (req: Request, res: Response) => {
    const { bookSampleId, returnedAt }: { bookSampleId: string, returnedAt: Date } = req.body
    try {
        const loggedUser = decodeToken(req);
        if (loggedUser) {
            // find book sample id, 
            let bookSample = await BookSample.findByPk(bookSampleId);
            console.log("book sample is ")
            console.log(bookSample);
            // if booksample is found and book sample location is jakarta
            if (bookSample && bookSample.location == "jakarta") {
                let lend = await Lend.create({
                    bookSampleId,
                    userId: loggedUser.id,
                    returnedAt
                })
                return res.send(lend);

            }

            //  make a post request to server bandung
            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
            let response = await ApiService.post('/lend', {
                userId: loggedUser.id,
                bookSampleId,
                returnedAt
            })

            return res.send(response.data);
        }
        return res.status(401).send({
            message: "Access denied"
        });

    } catch (error) {
        return res.status(500).send(error)
    }
});

userRouter.put('/lends', async (req: Request, res: Response) => {
    const { id, returnedAt }: { id: string, bookSampleId: string, returnedAt: Date } = req.body
    let lend = await Lend.findByPk(id)
    const loggedUser = decodeToken(req);
    if (loggedUser && loggedUser.isAdmin) {
        if (lend) {
            let updatedLend = await Lend.update({
                returnedAt,

            }, {
                where: {
                    id
                }
            })
            return res.send(updatedLend);
        }

        // make a put request to sevrer bandung
        try {
            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization)
            let response = await ApiService.put(`/lends/${id}`, { returnedAt });
            return response.data();
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }


    }
    return res.status(401).send({
        message: "access denied"
    })
});

userRouter.get('/lends/:id', async (req: Request, res: Response) => {
    let id = req.params.id as string;
    try {
        let lend = await Lend.findByPk(id, {
        });
        if (lend) {
            // from site jakarta
            let user = await User.findByPk(lend.userId);
            let bookSample = await BookSample.findByPk(lend.bookSampleId);
            if (bookSample) {
                let book = await Book.findByPk(bookSample.bookId);
                return res.send({
                    lend,
                    user,
                    book,
                    bookSample
                })
            }
            return res.status(400).send({
                message: "Book sample not found"
            })

        }

        // find lend from bdg
        ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
        let lendResponse = await ApiService.get(`/lend/${id}`, {});
        lend = lendResponse.data as Lend
        if (lend) {
            let user = await User.findByPk(lend.userId);
            let bookSampleResponse = await ApiService.get(`/book-sample/${lend.bookSampleId}`, {});
            let bookSample = bookSampleResponse.data as BookSample
            let book = await Book.findByPk(bookSample.bookId);
            return res.send({
                lend,
                user,
                book,
                bookSample
            })

        }
        return res.status(400).send({
            message : "Lend not found"
        })

    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

userRouter.delete('/lends/:id', async (req: Request, res: Response) => {
    let id = req.params.id as string;
    let idNumber = Number(id);
    try {
        let lend = await Lend.findByPk(idNumber);
        if (lend) {
            await Lend.destroy({
                where: {
                    id: idNumber
                }
            })
            return res.send({
                message: "Lend deleted"
            })
        }
        // make a delete request to server bdg
        ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
        let response = await ApiService.delete(`/lends/${idNumber}`, {});
        return res.send(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error
        })
    }
})

export default userRouter