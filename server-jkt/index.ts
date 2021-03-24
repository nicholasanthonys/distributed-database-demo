
import express, { Application, Request, Response, NextFunction } from 'express'
import Connection from 'db/connection'

//* Cors Middleware
import cors from 'cors';

const app: Application = express();

const port = 3000;


const connection = new Connection("localhost", "postgres","postgres","5432","db_books_jkt")
connection.testConnection();

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
