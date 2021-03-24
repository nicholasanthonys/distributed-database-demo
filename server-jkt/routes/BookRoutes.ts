import { Router, Request, Response } from 'express'
import  Book from 'models/Book';

var bookRouter = Router();

bookRouter.post('/',async (req: Request, res: Response) => {
   const {title, publisher} : {title : String,publisher : String}= req.body;
   let newBook = await Book.create({
      title,
      publisher
   });
   return res.send(newBook).status(201);
})

bookRouter.get('/', (req : Request, res : Response) => {
   return 
})

export default bookRouter;

