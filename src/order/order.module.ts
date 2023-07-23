import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';
import { CartItemEntity } from '../cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, CustomerEntity, ProductEntity, CartItemEntity])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
