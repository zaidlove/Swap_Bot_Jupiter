import express from "express";
import { json, urlencoded } from "body-parser";
import routes from "./routes"
import "dotenv/config";

const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const PORT = process.env.PORT
const app = express();

app.use(helmet());

app.use(cors());

app.use(json());

app.use(urlencoded({ extended: true }));

app.use("/api", routes)

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

app.use(morgan("tiny"))

const connectWithDb = require('./configs/db')
connectWithDb()

app.listen( PORT , () => {
  console.log(`server is running on port ${PORT}`);
})