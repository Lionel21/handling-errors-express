import {Error} from "mongoose";

abstract class CustomError extends Error {
    abstract status: number; // status property

    abstract serializeError(): {status: number, errors: string[]};
}

export default CustomError;