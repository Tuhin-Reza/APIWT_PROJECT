import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/userDto';
import { UserEntity } from './entity/userEntity';
import { FileEntity } from './entity/fileEntity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { UpdatePasswordDto } from './dto/updatePasswordDto';
import { MailerService } from "@nestjs-modules/mailer/dist";
import { BookNotFoundxception, ChartEmptyFoundxception, ChartNotFoundxception, OrderItemNotFoundxception, SerschBookexception, UserNotFoundexception } from './http-exception.filter';
import { BookDetailEntity } from './entity/bookDetail';
import { BookAddToCartEntity } from './entity/bookAddChartEntity';
import { OrderItem } from './entity/orderItem';
import { CustomerBill } from './entity/customerBill';

@Injectable()
export class CustomersService {
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
        private readonly bookAddToCartEntityRepo: Repository<BookAddToCartEntity>,

        @InjectRepository(OrderItem)
        private readonly OrderItemRepo: Repository<OrderItem>,

        @InjectRepository(CustomerBill)
        private readonly CustomerBillRepo: Repository<CustomerBill>,

        @InjectRepository(FileEntity)
        private readonly FileEntityRepo: Repository<FileEntity>,

        private readonly mailerService: MailerService,
    ) { }

    findEmail(email: string): any {
        return this.userRepo.findOneBy({ email });
    }


    async signup(dto: UserEntity): Promise<UserEntity> {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(dto.password, salt)

        const userEntity = new UserEntity();
        userEntity.email = dto.email;
        userEntity.password = password;

        await this.mailerService.sendMail({
            to: "tuhin.aiub2020@gmail.com",
            subject: "account uses",
            text: "Your account is now using OBSMS",
        });
        return await this.userRepo.save(userEntity);
    }


    async validateUserCredential(dto): Promise<{ id: number; email: string }> {
        const user = await this.findEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('email not found');
        }

        const passwordMatch = await compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('password not found');
        }
        return { id: user.id, email: user.email };
    }

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

    async updateUserPassword(email: string, dto: UpdatePasswordDto): Promise<any> {
        const user = await this.userRepo.findOne({
            where: { email }
        });
        console.log(dto.password);


        user.password = await bcrypt.hash(dto.password, 10);
        console.log(user.password);
        await this.userRepo.save(user);
        return "Password updated successfully";
    }

    async sendEmail(mydata) {
        return await this.mailerService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text,
        });
    }

    async updateImage(id: number, fileDto): Promise<FileEntity> {
        const file = await this.fileRepo.findOneBy({ id });
        const user = await this.userRepo.findOneBy({ id });
        console.log(user);
        if (!file) {
            const file = new FileEntity();
            file.filename = fileDto;
            file.user = user;
            return await this.fileRepo.save(file);
        }
        file.filename = fileDto;
        file.user = user;
        return this.fileRepo.save(file);
    }

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

    async getAllBookDetails(): Promise<BookDetailEntity[]> {
        return await this.bookDetailRepository.find();
    }

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

    async getBookDetailById(id1: number, id2: number,): Promise<{ title: string, price: number }> {
        const cus = await this.userRepo.findOne({
            where: { id: id1 }
        });
        console.log(cus);

        const bookDetail = await this.bookDetailRepository
            .createQueryBuilder("book")
            .select(["book.title", "book.price"])
            .where("book.id = :id2", { id2 })
            .getOne();
        console.log(bookDetail);

        if (!bookDetail) {
            throw new BookNotFoundxception();
        }
        console.log(bookDetail.title);
        const addChart = new BookAddToCartEntity();
        addChart.title = bookDetail.title;
        addChart.price = bookDetail.price;
        addChart.user = cus;
        console.log(addChart);

        await this.bookAddToCartEntityRepo.save(addChart);

        // return { title: bookDetail.title, price: bookDetail.price };
        return;
    }

    async getBookChartHistory(id: number): Promise<any> {
        const chart = await this.bookAddToCartEntityRepo.find({
            where: { userId: id },
            relations: ['user'],
        });
        if (chart.length === 0) {
            throw new ChartNotFoundxception();
        }
        console.log(chart);
        return chart;
    }

    async removeChartItemById(id: number): Promise<void> {
        const cartItem = await this.bookAddToCartEntityRepo.findOne({
            where: { id }
        });
        if (!cartItem) {
            throw new ChartNotFoundxception();
        }
        await this.bookAddToCartEntityRepo.delete(id);
    }

    async moveBooksToOrderItem(userId: number): Promise<void> {
        // Find all book cart items for the user
        const bookCarts = await this.bookAddToCartEntityRepo.find({ where: { userId } });
        if (bookCarts.length === 0) {
            throw new ChartEmptyFoundxception();
        }
        // Calculate total number of books and total bill amount
        const totalBooks = bookCarts.length;
        const totalBill = bookCarts.reduce((total, bookCart) => total + bookCart.price, 0);

        // Create a new customer bill entity and save it to the customer bill repository
        const customerBill = new CustomerBill();
        customerBill.totalBooks = totalBooks;
        customerBill.totalBill = totalBill;
        await this.CustomerBillRepo.save(customerBill);

        console.log(customerBill);

        // Create an OrderItem entity for each book cart item and save to OrderItem repository with the customer bill as a foreign key
        await Promise.all(bookCarts.map(async (bookCart) => {
            const orderItem = new OrderItem();
            orderItem.bookName = bookCart.title;
            orderItem.price = bookCart.price;
            orderItem.userId = bookCart.userId;
            orderItem.customerBill = customerBill;
            console.log(orderItem);
            await this.OrderItemRepo.save(orderItem);
        }));
        // Remove book cart items
        await this.bookAddToCartEntityRepo.remove(bookCarts);

        await this.mailerService.sendMail({
            to: "tuhin.aiub2020@gmail.com",
            subject: "Buying Book",
            text: "Total Book: " + totalBooks + " Total Bill: " + totalBill + " Order is Processing Delivered Book Soon",
        });
    }

    async getOrderItem(id: number): Promise<any> {
        const orderItem = await this.OrderItemRepo.find({
            where: { userId: id },
            relations: ['customerBill', 'user'],
        });
        if (!orderItem || orderItem.length === 0) {
            throw new OrderItemNotFoundxception();
        }
        console.log(orderItem);
        return orderItem;
    }


    async getHello(): Promise<any> {
        await this.mailerService.sendMail({
            to: "tuhin.aiub2020@gmail.com",
            subject: "check",
            text: "i am working",
        });
        return 'Hello';
    }


}
