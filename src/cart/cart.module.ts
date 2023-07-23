import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './cart.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity, CustomerEntity, ProductEntity])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
