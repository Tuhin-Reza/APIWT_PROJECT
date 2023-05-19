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
        super('Chart Book Not Found', HttpStatus.CONFLICT);
    }
}

export class userOrderBookNotFoundxception extends HttpException {
    constructor() {
        super('Buying Book First Then Create a Review and Comment', HttpStatus.CONFLICT);
    }
}

export class orderDetailsOrderIdNotFoundxception extends HttpException {
    constructor() {
        super('This Book you are not Buying', HttpStatus.CONFLICT);
    }
}

export class reviewAlredyGivenExcetion extends HttpException {
    constructor() {
        super('you already given this book review ', HttpStatus.CONFLICT);
    }
}

export class noDataFoundException extends HttpException {
    constructor() {
        super('No Data Found', HttpStatus.CONFLICT);
    }
}
export class reviewNotDataFoundException extends HttpException {
    constructor() {
        super('review not available at this time ', HttpStatus.CONFLICT);
    }
}