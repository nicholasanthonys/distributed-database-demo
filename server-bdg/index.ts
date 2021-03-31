
import dotenv from 'dotenv'
//* load environment variable
dotenv.config();

import express, { Application } from 'express'
import cors from 'cors'
import sequelize from 'database/sequelize'
import { syncrhonize } from 'models';
import validateToken from 'middleware/validate-token';
import BookSampleRoutes from './routes/BookSampleRoutes';
import LendRoutes from './routes/LendRoute';
const app: Application = express();

const port = process.env.PORT || 3001;

//* middleware body parser
app.use(express.json());
app.use(cors())

sequelize.authenticate().
  then(() => console.log("connected to db"))
  .catch(err => console.log(err));

// synchronize to drop and recreate the table
syncrhonize();

app.get("/", (req, res) => {
  res.send("Hello From server bandung!");
});



app.use(validateToken)


//only use this route to site bandung
app.use('/book-sample', BookSampleRoutes);
app.use('/lend',LendRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

});
