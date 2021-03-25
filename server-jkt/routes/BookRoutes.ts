import { Router, Request, Response } from 'express'
import Book from 'models/Book';
import { where } from 'sequelize';

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

bookRouter.get('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as String
   try {
      let book = await Book.findOne({
         where: {
            id: Number(id)
         }
      })
      if (book) {
         return res.status(200).send(book)
      }

      return res.status(400).send({
         message : "Not found"
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

