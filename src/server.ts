import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import cors from 'cors';

import { body } from 'express-validator';
import wilderController from './controllers/wilder';
import InputError from './errors/InputError';

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post(
  '/api/wilders',
  [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters'),
    body('city').isString().withMessage('City must be a string'),
    body('skills.*.title')
      .isLength({ min: 2 })
      .withMessage('SKill title must be at least 2 characters.'),
    body('skills.*.vote')
      .isInt({ min: 0 })
      .withMessage('Skill votes must be an integer greater of equal to 0'),
  ],
  asyncHandler(wilderController.create)
);
app.get('/api/wilders', asyncHandler(wilderController.read));
app.put('/api/wilders', asyncHandler(wilderController.update));
app.delete('/api/wilders', asyncHandler(wilderController.delete));

// TODO : handle not found in the error middleware
app.get('*', (req, res) => {
  res.status(404);
  res.send({ success: false, message: 'Wrong adress' });
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
        res.json({ success: false, message: 'The name is already used' });
        break;
      default:
        res.status(400);
        res.json({ success: false, message: 'An error occured' });
    }
  }
  // TODO : use a better validation method (express-validator)

  if (error instanceof InputError) {
    res.json({ success: false, message: 'An input error occured', error });
  }
});

// Start Server
// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Server started on 5000'));
