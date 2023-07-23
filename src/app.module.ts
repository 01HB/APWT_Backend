import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '20423821',
    database: 'NNNP',
    autoLoadEntities: true,
    synchronize: true,
  }), CustomerModule, OrderModule, WishlistModule, CartModule, ProductModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
