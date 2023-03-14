import {
    BadRequestException,
    Body,
    Controller,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Res,
    Session,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Request,
    Delete,
    ValidationPipe
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UserDto } from './dto/userDto';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { UniqueEmailException, UniquePasswordException } from './http-exception.filter';
import { AuthenticatedGuard, SessionGuard } from './session.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BookDetailEntity } from './entity/bookDetail';
import { BookAddToCartEntity } from './entity/bookAddChartEntity';
import { OrderItem } from './entity/orderItem';

//import { SessionMiddleware } from '@nest-middlewares/express-session';

@Controller('customers')
export class CustomersController {
    service: any;
    constructor(private customerService: CustomersService) { }

    @Get()
    async getHello(): Promise<any> {
        return this.customerService.getHello();
    }

    @Post('/signup')
    // @UsePipes(new ValidationPipe())
    async signup(
        @Body() dto: UserDto,): Promise<any> {
        const email = await this.customerService.findEmail(dto.email);
        if (email) {
            console.log("email found");
            throw new UniqueEmailException();
        } else {
            return this.customerService.signup(dto);
        }

    }

    @Post('/login')
    async login(@Session() session, @Body() dto: UserDto): Promise<any> {
        try {
            const user = await this.customerService.validateUserCredential(dto);
            if (this.customerService.validateUserCredential(dto)) {
                session.email = user.email;
                session.user = user;
                console.log("User Id: " + session.user.id);
                console.log(session.user);
                const id = session.user.id;
                console.log(session.user.id);

                return 'Login successful';
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                if (error.message === 'email not found') {
                    return 'provide correct email';
                } else if (error.message === 'password not found') {
                    return 'provide correct password';
                }
            }
            throw error;
        }
    }

    @Put('/updatepass')
    @UseGuards(SessionGuard)
    //@UsePipes(new ValidationPipe())
    update(
        @Session() session,
        @Body('email') email: string,
        @Body() dto: UpdatePasswordDto): any {

        email = session.email;
        return this.customerService.updateUserPassword(email, dto);
    }

    @Get('/logout')
    logout(@Session() session, @Res() res: Response) {
        session.destroy(() => {
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
            res.redirect('/');
        });
    }


    @Post('/image')
    @UseGuards(SessionGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload-images',
            filename: (req, file, cb) => {
                cb(null, Date.now() + file.originalname)
            },
        }),
        fileFilter: (req, file, cb) => {
            // Check file type
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            // if (file.size > 10) { // 1 MB (1000000 bytes) limit
            //     return cb(new Error('File size should not exceed 1 MB!'), false);
            //   }
            cb(null, true);
        },
    }))
    async uploadFile(
        @Session() session,
        @Body('id', ValidationPipe) id: number,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 16000 })//30 kilobytes.1 MB is equal to 1024 KB.
                ],
            }),
        ) file: Express.Multer.File) {
        // Handle uploaded file here
        const file2 = file.filename;
        console.log(file2);
        return this.customerService.updateImage(session.user.id, file2);
        // return {
        //     filename: file.filename,
        // };
    }

    @Patch('/forgetpass')
    //@UsePipes(new ValidationPipe())
    forgrtPass(
        @Body() dto: UserDto): any {
        return this.customerService.forgetPassword(dto);
    }

    @Get('/bookdetails')
    @UseGuards(SessionGuard)
    async getBookDetails() {
        const bookDetails = await this.customerService.getAllBookDetails();
        return { bookDetails };
    }

    @Get('/serchbookByGenre')
    @UseGuards(SessionGuard)
    async searchBooks(@Query('genre') genre: string): Promise<any> {
        return this.customerService.searchBooks(genre);
    }

    @Get('/addChart/:id2')
    @UseGuards(SessionGuard)
    async getBookDetailById(
        @Session() session,
        @Param('id2', ParseIntPipe) id2: number
    ): Promise<any> {
        const id1 = session.user.id;
        console.log(id1);
        await this.customerService.getBookDetailById(id1, id2);
        return "add chart succeefully";
    }
    @Get('/charthistory')
    @UseGuards(SessionGuard)
    async getBookChartHistory(@Session() session): Promise<BookAddToCartEntity[]> {
        const userId = session.user.id;
        const chart = await this.customerService.getBookChartHistory(userId)
        return chart;
    }

    @Delete('/deleteCartItem/:id')
    @UseGuards(SessionGuard)
    async deleteCartItem(@Param('id') id: number) {
        const removeChartItem = await this.customerService.removeChartItemById(id);
        return "successfully removed chart item";
    }

    @Post('/moveBooksToOrderItem')
    @UseGuards(SessionGuard)
    async moveBooksToCart(
        @Session() session,
        @Param('userId') userId: number,
        @Body() mydata): Promise<void> {
        await this.customerService.moveBooksToOrderItem(session.user.id);
    }

    @Get('/orderHistory')
    @UseGuards(SessionGuard)
    async getAllOrderItems(
        @Session() session,): Promise<any> {
        const userId = session.user.id;
        return this.customerService.getOrderItem(session.user.id);
    }




    @Post('/sendemail')
    sendEmail(@Body() mydata) {
        return this.customerService.sendEmail(mydata);
    }


}
