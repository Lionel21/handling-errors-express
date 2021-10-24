import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import wilderRouter from './routes/wilder';
import InputError from './errors/InputError';
import NotFoundError from "./errors/NotFoundError";

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

interface MongoError extends Error {
    code: number;
}

function isMongoError(error: Error): error is MongoError {
    return error.name === 'MongoError';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    // TODO : do not rely on mongo error
    if (isMongoError(error)) {
        switch (error.code) {
            case 11000:
                res.status(400);
                res.json({success: false, message: 'The name is already used'});
                break;
            default:
                res.status(400);
                res.json({success: false, message: 'An error occured'});
        }
    }
    // TODO : use a better validation method (express-validator)
    if (error instanceof InputError) {
        res.status(400).json({
            status: 400,
            errors: error.validationErrors.map(
                ({msg}) => msg
            )
        });
    }
    if (error instanceof  NotFoundError) {
        res.status(404).json({
            status: 404,
            errors: ['Ressource not found']
        })
    }
});

// Start Server
// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Server started on 5000'));
