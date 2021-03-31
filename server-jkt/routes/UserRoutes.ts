import { Router, Request, Response, response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import Lend from 'models/Lend';
import User from 'models/User';
import ApiService from 'utils/ApiService';
import decodeToken from 'utils/decodeToken';
import { BookSamplesJKT, BookSampleWithLend, LendInterface, LendResponseBDG, UserLendResponseUniversal, UserResponseJKT } from '../interface/LendResponseInterface'

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
            console.log(loggedUser)
            if (!loggedUser.isAdmin) {
                return res.status(401).send({
                    message: "Only admin can access this route to list all lends"
                })
            }
            const users = await User.findAll(
                {
                    include: [
                        {
                            model: BookSample,
                            include: [{
                                model: Book,

                            }
                            ]
                        }
                    ]
                }
            );


            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization)
            let response = await ApiService.get('/lend', {
                userId: loggedUser.id
            });

            let LendsBDG = response.data as LendResponseBDG[];


            console.log(response.data)
            // format response
            let usersResponse = users as unknown as UserLendResponseUniversal[]
            console.log(users);
            let lendResponsesUniversal: Array<UserLendResponseUniversal> = [];
            usersResponse.forEach((user) => {
                let lendResponse: UserLendResponseUniversal = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    BookSamples: [],

                }
                console.log("book samples is ")
                console.log(user.BookSamples);
                user.BookSamples.forEach(bs => {
                    let bookSampleWithLend: BookSampleWithLend = {
                        id: bs.id,
                        lendable: bs.lendable,
                        location: bs.location,
                        bookId: bs.bookId,
                        createdAt: bs.createdAt,
                        updatedAt: bs.updatedAt,
                        Book: bs.Book,
                        Lends: bs.Lend ? [bs.Lend] : [],
                        Lend: bs.Lend

                    }
                    delete bookSampleWithLend.Lend
                    LendsBDG.forEach(lend => {
                        ``
                        if (lend.BookSample.bookId == bs.Book.id) {
                            console.log("push")
                            // bookSampleWithLend.Lends.push(bs.Lend)
                            let lendBdg: LendInterface = {
                                id: lend.id,
                                returnedAt: lend.returnedAt,
                                bookSampleId: lend.bookSampleId,
                                userId: lend.userId,
                                createdAt: lend.createdAt,
                                updatedAt: lend.updatedAt
                            }
                            bookSampleWithLend.Lends.push(lendBdg)
                        }
                    })

                    lendResponse.BookSamples.push(bookSampleWithLend)

                })
                lendResponsesUniversal.push(lendResponse)


            });


            console.log("lend response universal is ")
            console.log(lendResponsesUniversal);

            return res.send(lendResponsesUniversal)

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
    const { id, returnedAt }: { id: number, bookSampleId: string, returnedAt: Date } = req.body
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


userRouter.delete('/lends/:id', async (req : Request, res : Response) => {
    let id = req.params.id as string; 
    let idNumber = Number(id);
    try {
       let lend = await Lend.findByPk(idNumber);
       if(lend){
           await Lend.destroy({
            where : {
                id : idNumber
            }
           })
           return res.send({
               message : "Lend deleted"
           })
       }
       // make a delete request to server bdg
       ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
       let response = await ApiService.delete(`/lends/${idNumber}`, {});
       return res.send(response.data);
    } catch (error) {
        console.log(error);
       return res.status(500).send({
           message : error
       }) 
    }
})

export default userRouter