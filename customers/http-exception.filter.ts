import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class UniqueEmailException extends HttpException {
    constructor() {
        super('account already created', HttpStatus.CONFLICT);
    }
}
export class UniquePasswordException extends HttpException {
    constructor() {
        super('please use unique password', HttpStatus.CONFLICT);
    }
}

export class UserNotFoundexception extends HttpException {
    constructor() {
        super('user not found', HttpStatus.CONFLICT);
    }
}
export class SerschBookexception extends HttpException {
    constructor() {
        super('this type of book not available at this time', HttpStatus.CONFLICT);
    }
}

export class BookNotFoundxception extends HttpException {
    constructor() {
        super('book not found', HttpStatus.CONFLICT);
    }
}
export class ChartNotFoundxception extends HttpException {
    constructor() {
        super('CartItem not found', HttpStatus.CONFLICT);
    }
}

export class ChartEmptyFoundxception extends HttpException {
    constructor() {
        super('please select item before order', HttpStatus.CONFLICT);
    }
}

export class OrderItemNotFoundxception extends HttpException {
    constructor() {
        super('Order Item Not Found', HttpStatus.CONFLICT);
    }
}