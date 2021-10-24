import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import wilderRouter from './routes/wilder';
import NotFoundError from "./errors/NotFoundError";
import errorMiddleware from './middlewares/error';

const app = express();

// Database
mongoose
    .connect('mongodb://127.0.0.1:27017/wilderdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
    // eslint-disable-next-line no-console
    .then(() => console.log('Connected to database'))
    // eslint-disable-next-line no-console
    .catch((err: Error) => console.log(err));

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(wilderRouter);

// TODO : handle not found error in the error middleware
app.get('*', () => {
    const error = new NotFoundError();
    throw error;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorMiddleware);

// Start Server
// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Server started on 5000'));
