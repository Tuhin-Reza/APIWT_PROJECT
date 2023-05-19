import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/userDto';
import { UserEntity } from './entity/userEntity';
import { FileEntity } from './entity/fileEntity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { userUpdateDto } from './dto/useUpdateDto';
import { MailerService } from "@nestjs-modules/mailer/dist";
import { BookNotFoundxception, ChartNotFoundxception, SerschBookexception, UserNotFoundexception, noDataFoundException, orderDetailsOrderIdNotFoundxception, reviewAlredyGivenExcetion, reviewNotDataFoundException, userOrderBookNotFoundxception } from './http-exception.filter';
import { BookDetailEntity } from './entity/bookDetail';
import { BookAddToCartEntity } from './entity/bookAddChartEntity';
import { ReviewEntity } from './entity/review';
import { AddChartEntiy } from './entity/addChart';
import { OrderEntity } from './entity/orderEntity';
import { OrderDetailEntity } from './entity/orderDetailEntity';
import { CreateReviewDto } from './dto/reviewsDto';
import { AddressEntity } from './entity/addressEntity';
import { AddressDTO } from './dto/addressDto';

@Injectable()
export class CustomersService {
    reviewRepository: any;
    addChartEntityRepo: any;
    bookRepository: any;
    constructor(
        // @InjectRepository(ProfileEntity)
        // private profileRepo: Repository<ProfileEntity>,

        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,

        @InjectRepository(FileEntity)
        private fileRepo: Repository<FileEntity>,

        @InjectRepository(BookDetailEntity)
        private readonly bookDetailRepository: Repository<BookDetailEntity>,

        @InjectRepository(BookAddToCartEntity)
        private readonly bBookAddToCartEntityRepo: Repository<BookAddToCartEntity>,

        @InjectRepository(ReviewEntity)
        private readonly reviewEntityRepository: Repository<ReviewEntity>,

        @InjectRepository(AddChartEntiy)
        private readonly addChartEntityRepository: Repository<AddChartEntiy>,

        @InjectRepository(OrderEntity)
        private readonly orderEntityRepository: Repository<OrderEntity>,

        @InjectRepository(OrderDetailEntity)
        private readonly orderDetailEntityRepository: Repository<OrderDetailEntity>,

        @InjectRepository(AddressEntity)
        private readonly addressEntityRepository: Repository<AddressEntity>,

        private readonly mailerService: MailerService,
    ) { }


    /**********************************************************************/
    findEmail(email: string): any {
        return this.userRepo.findOneBy({ email });
    }

    /**********************************************************************/
    async signup(dto: UserEntity, defaultFilename): Promise<UserEntity> {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(dto.password, salt)

        const userEntity = new UserEntity();
        userEntity.firstName = dto.firstName;
        userEntity.lastName = dto.lastName;
        userEntity.contact = dto.contact;
        userEntity.email = dto.email;
        userEntity.username = dto.username;
        userEntity.password = password;

        // create default image entity
        const defaultImage = new FileEntity();
        defaultImage.filename = defaultFilename;
        defaultImage.user = userEntity;

        // save user and default image entity
        await this.userRepo.save(userEntity);
        await this.fileRepo.save(defaultImage);
        // console.log(userEntity);
        // console.log(defaultImage);
        return userEntity;
    }

    /**********************************************************************/
    async getFileByUserId(userId: number): Promise<FileEntity> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['photos']
        });
        //console.log(user);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const file = await this.fileRepo.findOne({
            where: { user },
            relations: ['user'],
        });
        if (!file) {
            throw new NotFoundException('File not found');
        }
        return file;
    }


    /**********************************************************************/
    async validateUserCredential(dto): Promise<{ id: number; email: string; username: string }> {
        const user = await this.findEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        const passwordMatch = await compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Password not found');
        }
        console.log("Username: " + user.username); // Print the username
        return { id: user.id, email: user.email, username: user.username };
    }


    /**********************************************************************/
    async signin(mydto) {
        const mydata = await this.userRepo.findOneBy({ email: mydto.email });
        const isMatch = await bcrypt.compare(mydto.password, mydata.password);
        if (isMatch) {
            return 1;
        }
        else {
            return 0;
        }

    }

    /**********************************************************************/
    async getUserById(userId: number): Promise<UserEntity> {
        const user = await this.userRepo.findOne({
            where: { id: userId }
        });
        return user;
    }


    /**********************************************************************/
    async updateUser(userId: number, updateUserDto: userUpdateDto) {
        const user = await this.userRepo.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        user.firstName = updateUserDto.firstName;
        user.lastName = updateUserDto.lastName;
        user.contact = updateUserDto.contact;
        user.username = updateUserDto.username;
        return this.userRepo.save(user);;
    }


    /**********************************************************************/
    async updateUserPassword(userId: number, dto: UpdatePasswordDto): Promise<any> {
        const user = await this.userRepo.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        console.log(dto.password);
        user.password = await bcrypt.hash(dto.password, 10);
        console.log(user.password);

        await this.userRepo.save(user);
        return "Password updated successfully";
    }

    /**********************************************************************/
    async sendEmail(mydata) {
        return await this.mailerService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text,
        });
    }


    /**********************************************************************/
    async updateImage(userId: number, filename: string): Promise<FileEntity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        const file = await this.fileRepo.findOne({ where: { user } });
        if (!file) {
            throw new NotFoundException(`File not found for user with id ${userId}`);
        }
        file.filename = filename;
        return this.fileRepo.save(file);
    }


    /**********************************************************************/
    async forgetPassword(dto): Promise<any> {
        const email = dto.email;
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            throw new UserNotFoundexception();
        }
        user.password = await bcrypt.hash(dto.password, 10);
        console.log(user.password);
        await this.userRepo.save(user);
        return "password update successful";
    }


    /**********************************************************************/
    async getAllBookDetails(): Promise<BookDetailEntity[]> {
        return await this.bookDetailRepository.find();
    }


    /**********************************************************************/
    async searchBooks(genre: string): Promise<BookDetailEntity[]> {
        const books = await this.bookDetailRepository.find({
            where: { genre }
        });
        if (books.length === 0) {
            console.log(books.length);
            throw new SerschBookexception();
        }

        return books;
    }


    /**********************************************************************/
    async findBookById(id: number): Promise<BookDetailEntity> {
        const book = await this.bookDetailRepository.findOne({
            where: { id: +id },
            relations: ['addCharts'],
        });

        if (!book) {
            throw new BookNotFoundxception();
        }

        return book;
    }



    /**********************************************************************/
    async ChartBook(userId: number, bookDetailsId: number): Promise<BookDetailEntity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const bookDetails = await this.bookDetailRepository.findOne({ where: { id: bookDetailsId } });

        const addChart = new AddChartEntiy();
        addChart.user = user;
        addChart.bookDetails = bookDetails;

        const newAddChart = this.addChartEntityRepository.create(addChart);
        this.addChartEntityRepository.save(newAddChart);

        return bookDetails;
    }



    /**********************************************************************/
    async getChartBooksByUserId(userId: number) {
        const chartData = await this.addChartEntityRepository.find({
            where: { user: { id: userId } },
            relations: ['bookDetails'],
        });

        if (!chartData || chartData.length === 0) {
            throw new noDataFoundException();
        }

        return chartData;
    }


    /**********************************************************************/
    async removeChart(userId: number, chartId: number): Promise<void> {
        const chart = await this.addChartEntityRepository.findOne({ where: { id: chartId, user: { id: userId } } });
        if (!chart) {
            throw new ChartNotFoundxception();
        }
        const result = await this.addChartEntityRepository.delete(chartId);

        if (result.affected === 0) {
            throw new ChartNotFoundxception();
        }
        return;
    }


    /**********************************************************************/
    async getAddressById(userId: number): Promise<AddressEntity> {
        const address = await this.addressEntityRepository.findOne({ where: { user: { id: userId } } }); // Find address by its id
        return address;
    }
    async createAddress(userId: number, addressDTO: AddressDTO): Promise<AddressEntity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        console.log(user);
        if (!user) {
            throw new UserNotFoundexception();
        }
        const existingAddress = await this.addressEntityRepository.findOne({ where: { user: { id: userId } } });

        if (existingAddress) {
            existingAddress.street = addressDTO.street;
            existingAddress.city = addressDTO.city;
            existingAddress.state = addressDTO.state;
            existingAddress.country = addressDTO.country;

            return await this.addressEntityRepository.save(existingAddress);
        } else {
            const address = new AddressEntity();
            address.street = addressDTO.street;
            address.city = addressDTO.city;
            address.state = addressDTO.state;
            address.country = addressDTO.country;

            address.user = user;

            return await this.addressEntityRepository.save(address);
        }
    }


    /**********************************************************************/
    async orderConfirmation(userId: number): Promise<OrderEntity> {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const chartBooks = await this.addChartEntityRepository.find({
            where: { user },
            relations: ['bookDetails'],
        });
        if (!chartBooks || chartBooks.length === 0) {
            throw new noDataFoundException();
        }
        // console.log(chartBooks);

        let totalBookCount;
        let totalPrice = 0;
        chartBooks.forEach((chartBook) => {
            totalBookCount = chartBooks.length;
            totalPrice += chartBook.bookDetails.price;
        });

        const date = new Date();
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        const order = new OrderEntity();
        order.userId = user.id;
        order.userName = user.email;
        order.totalBookCount = totalBookCount;
        order.totalPrice = totalPrice;
        order.orderTime = formattedDate;
        console.log(order);
        const savedOrder = await this.orderEntityRepository.save(order);

        const orderDetails = chartBooks.map((chartBook) => {
            const orderDetail = new OrderDetailEntity();
            orderDetail.pricePerUnit = chartBook.bookDetails.price;
            orderDetail.order = savedOrder;
            orderDetail.book = chartBook.bookDetails;
            // console.log(orderDetail)
            return orderDetail;
        });
        console.log(orderDetails)
        await this.orderDetailEntityRepository.save(orderDetails);
        await this.addChartEntityRepository.remove(chartBooks);
        return savedOrder;
    }



    /**************************************************************** */
    async getOrderDetailsByUserId(userId: number): Promise<any[]> {
        const orders = await this.orderEntityRepository.find({
            where: { userId: userId },
        });

        if (orders.length === 0) {
            throw new noDataFoundException();
        }

        const orderIds = orders.map(order => order.id);
        const userName = orders[0].userName;
        console.log('userName:', userName);

        const orderDetails = await Promise.all(orderIds.map(async (orderId) => {
            const orderDetail = await this.orderDetailEntityRepository.find({
                where: { order: { id: orderId } },
                relations: ['book'],
            });
            return orderDetail;
        }));

        const result = orderDetails.flatMap((orderDetail, index) =>
            orderDetail.map(detail => ({
                bookName: detail.book.title,
                price: detail.pricePerUnit,
                orderTime: orders[index].orderTime,
                orderId: orders[index].id
            }))
        );

        console.log(result);

        return result;
    }



    /**************************************************************** */
    async putReviewBookIdAndUserId(userId: number, bookId: number, orderId: number, createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
        const orders = await this.orderEntityRepository.find(
            {
                where: { userId: userId },
            });
        console.log('orders:', orders);

        if (orders.length === 0) {
            throw new userOrderBookNotFoundxception();
        }

        const orderid = orders[0].id;
        const userName = orders[0].userName;
        console.log('userName:', userName);

        const orderDetails = await this.orderDetailEntityRepository.find({
            where: { book: { id: bookId }, order: { id: orderId } },
            relations: ['book', 'order'], // include the relation to the book and order entities
        });

        if (orderDetails.length === 0) {
            throw new orderDetailsOrderIdNotFoundxception();
        }

        const date = new Date();
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        const book = orderDetails[0].book;

        const review = new ReviewEntity();
        review.rating = createReviewDto.rating;
        review.comment = createReviewDto.comment;
        review.userName = userName;
        review.orderId = orderId,
            review.reviewTime = formattedDate,
            review.book = book;
        console.log(review);

        const createdReview = await this.reviewEntityRepository.save(review);
        return;
    }


    /**************************************************************** */
    async reviewgetOrderDetailsByUserId(userId: number): Promise<any[]> {
        const orders = await this.orderEntityRepository.find({
            where: { userId: userId },
        });

        if (orders.length === 0) {
            throw new userOrderBookNotFoundxception();
        }

        const uniqueBooks = new Set(); // Set to keep track of unique bookIds
        const result = [];

        for (const order of orders) {
            const orderId = order.id;
            const userName = order.userName;
            console.log('userName:', userName);

            const orderDetails = await this.orderDetailEntityRepository.find({
                where: { order: { id: orderId } },
                relations: ['book'], // include the relation to the book entity
            });

            for (const detail of orderDetails) {
                const bookId = detail.book.id;
                if (!uniqueBooks.has(bookId)) { // Check if bookId is already added
                    uniqueBooks.add(bookId); // Add bookId to set
                    result.push({
                        bookId: bookId,
                        orderId: orderId,
                        bookName: detail.book.title,
                        price: detail.pricePerUnit,
                        orderTime: order.orderTime,
                    });
                }
            }
        }
        // console.log(result);
        return result;
    }



    /**************************************************************** */
    async getReviewsByBookId(bookId: number): Promise<ReviewEntity[]> {
        const reviews = await this.reviewEntityRepository.find({
            where: { book: { id: bookId } }
        });
        if (!reviews || reviews.length === 0) {
            throw new reviewNotDataFoundException();
        }
        return reviews;
    }


    /**************************************************************** */
    async getreviewAllBook(): Promise<BookDetailEntity[]> {
        return this.bookDetailRepository.find({ relations: ['reviews'] });
    }
}
