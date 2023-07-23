import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';
import { OrderEntity } from '../order/order.entity';
import { WishlistItemEntity } from '../wishlist/wishlist.entity';
import { CartItemEntity } from '../cart/cart.entity';
import { ProductEntity } from 'src/product/product.entity';
import { OrderModule } from '../order/order.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { OrderService } from 'src/order/order.service';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerEntity, OrderEntity, WishlistItemEntity, CartItemEntity, ProductEntity]),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                ignoreTLS: true,
                secure: true,
                auth: {
                    user: 'hasanbithto2@gmail.com',
                    pass: 'oczwirmhmlxzkezl',
                },
            },
        }),
    ],
    controllers: [CustomerController],
    providers: [CustomerService, OrderService, WishlistService, CartService, ProductService],
})
export class CustomerModule {}
