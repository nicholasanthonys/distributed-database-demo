
import dotenv from 'dotenv'
//* load environment variable
dotenv.config();

import express, { Application} from 'express'
import cors from 'cors'
import sequelize from 'database/sequelize'
import { syncrhonize } from 'models';
import validateToken from 'middleware/validate-token';
import bookRoutes from './routes/BookRoutes';
import AuthRoutes from './routes/AuthRoutes'
const app: Application = express();

const port = process.env.PORT || 3000;

//* middleware body parser
app.use(express.json());
app.use(cors())

sequelize.authenticate().
  then(() => console.log("connected to db"))
  .catch(err => console.log(err));

// synchronize to drop and recreate the table
// syncrhonize();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/auth', AuthRoutes)


app.use(validateToken)
app.use('/book', bookRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
