import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Thank you for using the Online Book Store Management System';
  }
}
