import { CustomError } from './CustomError';

export class VevNotFoundError extends CustomError {
    constructor(message: string = 'Vev was not found') {
        super(404, message);
    }
}
