import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemEntity } from './wishlist.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItemEntity, CustomerEntity, ProductEntity])],
  providers: [WishlistService],
  controllers: [WishlistController]
})
export class WishlistModule {}
