import { ValidationError } from 'express-validator';
import CustomError from "./CustomError";

class InputError extends CustomError {
  status = 400;
  constructor(public validationErrors: ValidationError[]) {
    super('Validation errors occured in input');
  };

  serializeError(): { status: number; errors: string[] } {
    return {
      status: this.status,
      errors: this.validationErrors.map(({msg}) => msg)
    }
  };
}

export default InputError;
