import { Router, Request, Response } from 'express'
import Book from 'models/Book';
import BookSample from 'models/BookSample';
import ApiService from 'utils/ApiService';

var bookRouter = Router();

bookRouter.post('/', async (req: Request, res: Response) => {
   const { title, publisher, coverUrl, author }: { title: String, publisher: String, coverUrl: String, author: String } = req.body;
   try {
      let newBook = await Book.create({
         title,
         publisher,
         coverUrl,
         author
      });
      return res.send(newBook);

   } catch (error) {
      console.log(error)
      return res.send({
         "message": error
      })
   }
})

bookRouter.put('/', async (req: Request, res: Response) => {
   const { id, title, publisher, coverUrl, author }: { id: Number, title: String, publisher: String, coverUrl: String, author: String } = req.body;
   try {
      await Book.update({
         title,
         publisher,
         coverUrl,
         author,

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


      return res.send(book);

   } catch (error) {
      console.log(error)
      return res.send({
         "message": error
      })
   }
})


bookRouter.get('/', async (req: Request, res: Response) => {
   try {
      let books = await Book.findAll()
      return res.send(books);
   } catch (error) {
      console.log(error)
      return res.send({
         "message": error
      })
   }
})



bookRouter.get('/book-sample/:id', async (req: Request, res: Response) => {
   let bookSampleId = req.params.id as string;
   try {
      // get from jakarta 
      let bookSampleJkt = await BookSample.findByPk(bookSampleId)
      if (!bookSampleJkt) {
         ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization)
         let response = await ApiService.get(`/book-sample/${bookSampleId}`, {});
         return res.send(response.data)
      }
      return res.send(bookSampleJkt)

   } catch (error) {
      ;
      return res.send({
         message: error
      })
   }
})

bookRouter.get('/book-sample', async (req: Request, res: Response) => {
   const bookId = req.query.bookId as string;


   var bookSampleJKT: Array<BookSample> = [];
   var bookSampleBDG: Array<BookSample> = [];

   try {
      if (bookId) {
         bookSampleJKT = await BookSample.findAll({
            where: {
               bookId: Number(bookId)
            }
         })
      } else {
         bookSampleJKT = await BookSample.findAll();
      }

      console.log("book sample jkt is ")
      console.log(bookSampleJKT);
      // request to site bandung
      ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
      let response = await ApiService.get('/book-sample', {
         bookId
      })
      bookSampleBDG = response.data;
      console.log("response data is")
      console.log(response.data);

      // join result bandung and jakarta
      let result = [...bookSampleJKT, ...bookSampleBDG]
      return res.send(result);
   } catch (error) {
      console.log("error is ")
      console.log(error);
      return res.status(500).send({
         message: error
      })
   }
})

bookRouter.post('/:id/book-sample', async (req: Request, res: Response) => {
   let book = await Book.findOne({
      where: {
         id: req.params.id
      }
   });

   if (book) {
      const { location, lendable, bookId }: { location: string, lendable: boolean, bookId: number } = req.body
      try {
         if (location == "jakarta") {
            let bookSample = await BookSample.create({
               lendable,
               location,
               bookId: book.id
            })
            await book.addBookSample(bookSample)
            // let bookWithBookSample = await Book.findOne({
            //    where: {
            //       id: book.id
            //    },
            //    include: BookSample
            // });
            return res.send(bookSample);
         }

         try {
            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
            let response = await ApiService.post('/book-sample', {
               lendable,
               location,
               bookId: book.id
            })
            console.log("response data is ")
            console.log(response.data);
            return res.send(response.data);

         } catch (error) {
            console.log("error is");
            console.log(error);
            return res.status(500).send({
               message: error
            })
         }

      } catch (error) {
         return res.status(500).send({
            message: error
         })
      }

   }

   return res.status(400).send({
      message: "Book Not Found."
   })

});


bookRouter.put('/:id/book-sample', async (req: Request, res: Response) => {

   let book = await Book.findOne({
      where: {
         id: req.params.id
      }
   });

   console.log("id is ")
   console.log(req.params.id);

   if (book) {
      const { id, location, lendable, bookId }: { id: number, location: string, lendable: boolean, bookId: number } = req.body
      try {
         if (location == "jakarta") {
            console.log("jakarta")
           let updatedRows =  await BookSample.update({
               lendable,
               bookId
            }, {
               where: {
                  id
               },
               returning : true
            });

       
            return res.send(updatedRows);

         }

         if (location == "bandung") {
            ApiService.init(process.env.SITE_URL_BDG!, req.headers.authorization);
            await ApiService.put('/book-sample', {
               id,
               lendable,
               bookId: book.id
            })
         }

      } catch (error) {
         console.log("error is ")
         console.log(error)
         return res.status(500).send({
            message: error
         })
      }

   }

   return res.status(400).send({
      message: "Book Not Found."
   })


});

bookRouter.delete('/book-sample/:idBookSample', async (req: Request, res: Response) => {
   const idBookSample = req.params.idBookSample

   try {
      // delete from site jakarta if exist
      await BookSample.destroy({
         where: {
            id: idBookSample
         }
      })

      // delete form site bandung
      await ApiService.delete(`/book-sample/${idBookSample}`, {})
      return res.status(200).send({
         message: "Delete success"
      });

   } catch (error) {
      return res.status(500).send({
         message: error
      });
   }

});


bookRouter.get('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as string
   try {
      let book = await Book.findOne({
         where: {
            id
         }
      })
      if (book) {
         return res.status(200).send(book)
      }

      return res.status(400).send({
         message: "Not found"
      });
   } catch (error) {
      console.log(error)
      return res.send({
         "message": error
      })
   }
})



bookRouter.delete('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as String
   try {
      await Book.destroy({
         where: {
            id: Number(id)
         }
      })
      return res.send({
         "message": "Deleted"
      });
   } catch (error) {
      console.log(error)
      return res.send({
         "message": error
      })
   }
})
export default bookRouter;

