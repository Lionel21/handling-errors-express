import CustomError from "./CustomError";

class NotFoundError extends CustomError {
    status = 404;

    serializeError(): {status: number, errors: string[]} {
        return {
            status: this.status,
            errors: ['Ressource not found']
        }
    }

}

export default NotFoundError;
