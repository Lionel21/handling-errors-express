import { ValidationError } from 'express-validator';

class InputError extends Error {
  constructor(public validationErrors: ValidationError[]) {
    super('Validation errors occured in input');
  }
}

export default InputError;
