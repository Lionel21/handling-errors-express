import { ValidationError } from 'express-validator';

class InputError extends Error {
  validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super('Validation errors occured in input');
    this.name = 'InputError';
    this.validationErrors = validationErrors;
  }
}

export default InputError;
