import {NextFunction, Request, Response} from 'express';
import CustomError from "../errors/CustomError";

export default (error: Error,
                req: Request,
                res: Response,
                _next: NextFunction
): Response => {
    // TODO : do not rely on mongo error
    if (error instanceof CustomError) {
        return res.status(error.status).json(error.serializeError());
    }

    console.error(error);
    return res.status(500).json({
        status: 500,
        errors: ['Something went wrong']
    })
}