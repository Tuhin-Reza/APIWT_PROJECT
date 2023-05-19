import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    MaxFileSizeValidator,
    NotFoundException,
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
    UseInterceptors
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UserDto } from './dto/userDto';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { BookNotFoundxception, UniqueEmailException, UniquePasswordException } from './http-exception.filter';
import { AuthenticatedGuard, SessionGuard } from './session.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BookDetailEntity } from './entity/bookDetail';
import { ReviewEntity } from './entity/review';
import { AddChartEntiy } from './entity/addChart';
import { validate } from 'class-validator';
import { CreateReviewDto } from './dto/reviewsDto';
import { FileEntity } from './entity/fileEntity';
import { AddressDTO } from './dto/addressDto';
import { SignInDto } from './dto/signinDto';
import { userUpdateDto } from './dto/useUpdateDto';
import { forgrtPassDto } from './dto/forgetPassDto';

@Controller('customers')
export class CustomersController {
    service: any;
    constructor(private customerService: CustomersService) { }

    @Get()
    getHello(): string {
        return "Hello";
    }

    /**************************************************************** */
    @Post('/signup')
    // @UsePipes(new ValidationPipe())
    async signup(
        @Body() dto: UserDto,): Promise<any> {
        const email = await this.customerService.findEmail(dto.email);
        if (email) {
            console.log("email found");
            throw new UniqueEmailException();
        } else {
            const defaultFilename = 'login.png';
            return this.customerService.signup(dto, defaultFilename);
        }

    }

    /**************************************************************** */
    @Post('/login')
    async login(@Session() session, @Body() dto: SignInDto): Promise<any> {
        try {
            const user = await this.customerService.validateUserCredential(dto);
            if (this.customerService.validateUserCredential(dto)) {
                session.email = user.email;
                session.user = user;
                //session.id = user.id;
                //console.log("User Id: " + session.user.id);
                // console.log(session.user);
                // const id = session.user.id;
                // console.log(session.user.id);
                return user;
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                if (error.message === 'Email not found') {
                    return 'provide correct email';
                } else if (error.message === 'Password not matching') {
                    return 'provide correct password';
                }
            }
            throw error;
        }
    }


    /**************************************************************** */
    @Get('getUser/:id')
    getUserById(@Param('id') userId: number): Promise<any> {
        return this.customerService.getUserById(userId);
    }
    /**************************************************************** */
    @Put('userUpdateInfo/:userId')
    updateUser(
        @Param('userId') userId: number,
        @Body() updateUserDto: userUpdateDto,
    ) {
        return this.customerService.updateUser(userId, updateUserDto);
    }

    /**************************************************************** */
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

    /**************************************************************** */
    @Patch('/forgetpass')
    //@UsePipes(new ValidationPipe())
    forgrtPass(
        @Body() dto: forgrtPassDto): any {
        return this.customerService.forgetPassword(dto);
    }


    /**************************************************************** */
    @Put('/updatepass/:userId')
    update(
        @Param('userId') userId: number,
        @Body() dto: UpdatePasswordDto): any {
        return this.customerService.updateUserPassword(userId, dto);
    }

    /**************************************************************** */
    @Post('/image/:userId')
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
        @Param('userId') userId: number,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 3000000 })//30 kilobytes.1 MB is equal to 1024 KB.
                ],
            }),
        ) file: Express.Multer.File) {
        // Handle uploaded file here
        const file2 = file.filename;
        //console.log(file2);
        return this.customerService.updateImage(userId, file2);
    }

    /**************************************************************** */
    @Get('/getUserPhotos/:userId')
    async getFile(
        @Param('userId') userId: number,
        @Res() res): Promise<FileEntity> {
        const file = await this.customerService.getFileByUserId(userId);
        return res.sendFile(file.filename, { root: './upload-images' });
    }

    /**************************************************************** */
    @Get('/bookdetails')
    // @UseGuards(SessionGuard)
    async getBookDetails() {
        const bookDetails = await this.customerService.getAllBookDetails();
        return { bookDetails };
    }

    /**************************************************************** */
    @Get('/serchbookByGenre')
    //@UseGuards(SessionGuard)
    async searchBooks(@Query('genre') genre: string): Promise<any> {
        return this.customerService.searchBooks(genre);
    }

    /**************************************************************** */
    @Post('/addChart/:userId/:bookId')
    //@UseGuards(SessionGuard)
    async addChart(
        @Param('userId') userId: number,
        @Param('bookId') bookId: number,
    ): Promise<BookDetailEntity> {
        const book = await this.customerService.findBookById(bookId);
        const bookDetails = await this.customerService.ChartBook(userId, bookId);
        return bookDetails;
    }

    /**************************************************************** */
    @Get('/getChartBooks/:userId')
    // @UseGuards(SessionGuard)
    async getChartBooks(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<any[]> {
        return this.customerService.getChartBooksByUserId(userId);
    }

    /**************************************************************** */
    @Delete('/removeChart/:userId/:chartId')
    //@UseGuards(SessionGuard)
    async removeChart(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('chartId', ParseIntPipe) chartId: number
    ): Promise<{ message: string }> {
        await this.customerService.removeChart(userId, chartId);

        return { message: 'Chart Book removed successfully' };
    }



    /**************************************************************** */
    @Get('getAddress/:userId')
    //@UseGuards(SessionGuard)
    async getAddress(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<any> {
        return await this.customerService.getAddressById(userId);
    }

    /**************************************************************** */
    @Post('createAddress/:userId')
    // @UseGuards(SessionGuard)
    async createAddress(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() addressDTO: AddressDTO,
    ): Promise<any> {
        return await this.customerService.createAddress(userId, addressDTO);
    }


    /**************************************************************** */
    @Post('/orderConfirmation/:userId')
    // @UseGuards(SessionGuard)
    async createOrder(
        @Param('userId', ParseIntPipe) userId: number,
        @Session() session: Record<string, any>) {
        const order = await this.customerService.orderConfirmation(userId);
        return {
            message: 'Order created successfully',
            order,
        };
    }

    /**************************************************************** */
    @Get('orderhistory/:userId')
    //@UseGuards(SessionGuard)
    async getOrderHistoryByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Session() session: Record<string, any>) {
        const orderDetails = await this.customerService.getOrderDetailsByUserId(userId);
        return orderDetails;
    }

    /**************************************************************** */
    @Get('reviewOrderhistory/:userId')
    //@UseGuards(SessionGuard)
    async reviewgetOrderHistoryByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Session() session: Record<string, any>) {
        const orderDetails = await this.customerService.reviewgetOrderDetailsByUserId(userId);
        return orderDetails;
    }

    /**************************************************************** */
    @Post('/createreview/:userId/:bookId/:orderId')
    //@UseGuards(SessionGuard)
    async createReview(
        @Body() createReviewDto: CreateReviewDto,
        @Param('userId', ParseIntPipe) userId: number,
        @Param('bookId') bookId: number,
        @Param('orderId') orderId: number,
        @Session() session: Record<string, any>,
    ): Promise<ReviewEntity> {
        const review = await this.customerService.putReviewBookIdAndUserId(userId, bookId, orderId, createReviewDto);
        return review;
    }

    /**************************************************************** */
    @Get('/getreview/:bookId')
    //@UseGuards(SessionGuard)
    async getReviewsByBookId(@Param('bookId') bookId: number): Promise<ReviewEntity[]> {
        return this.customerService.getReviewsByBookId(bookId);
    }

    /**************************************************************** */
    @Get('/reviewAllBook')
    async findAll(): Promise<BookDetailEntity[]> {
        return this.customerService.getreviewAllBook();
    }

    /**************************************************************** */
    @Post('/sendemail')
    sendEmail(@Body() mydata) {
        return this.customerService.sendEmail(mydata);
    }
}
