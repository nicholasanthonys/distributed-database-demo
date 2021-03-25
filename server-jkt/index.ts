
import dotenv from 'dotenv'
//* load environment variable
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express'
import { Sequelize } from 'sequelize';;
import cors from 'cors'
import bookRoutes from './routes/BookRoutes';
import sequelize from 'database/sequelize'
import { syncrhonize } from 'models';
const app: Application = express();

const port = process.env.PORT || 3000;

//* middleware body parser
app.use(express.json());
app.use(cors())

sequelize.authenticate().
  then(() => console.log("connected to db"))
  .catch(err => console.log(err));

syncrhonize();

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use('/book', bookRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
