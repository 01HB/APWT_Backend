import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItemEntity } from './wishlist.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class WishlistService {

    constructor(
        @InjectRepository(WishlistItemEntity)
        private wishlistRepo: Repository<WishlistItemEntity>,
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,
        @InjectRepository(CustomerEntity)
        private customerRepo: Repository<CustomerEntity>
    ) {}

    async addToWishlist(email: string, pid: number): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({ email: email });
        const wldata = await this.wishlistRepo.findOne({
            where: { wi_product_id: pid, customer: customer_data },
        });
        if (wldata) {
            return 'item already exists in the wishlist';
        } else {
            const product = await this.productRepo.findOneBy({ p_id: pid });
            const { p_id, p_name, p_price, p_description, p_image } = product;
            const wishlistItem = {
                wi_product_id: p_id,
                wi_name: p_name,
                wi_price: p_price,
                wi_description: p_description,
                wi_image: p_image,
                customer: customer_data,
            };
            await this.wishlistRepo.save(wishlistItem);
            return 'item added to the wishlist';
        }
    }

    async checkfromWishlist(email: string, pid: number): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({ email: email });
        const wldata = await this.wishlistRepo.findOne({
            where: { wi_product_id: pid, customer: customer_data },
        });
        if (wldata) {
            return true;
        } else {
            return false;
        }
    }

    async viewWishlist(email: string): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const id = customer_data.id;
        const query = this.wishlistRepo
        .createQueryBuilder('wishlist')
        .select(['wishlist.wi_product_id', 'wishlist.wi_name', 'wishlist.wi_price', 'wishlist.wi_description', 'wishlist.wi_image'])
        .where('wishlist.customerId = :id ', { id })
        .orderBy('wishlist.wi_product_id', 'ASC');
        return await query.getMany();
    }

    async removeFromWishlist(email: string, pid: number): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const data = await this.wishlistRepo.findOne({
            where: {wi_product_id: pid, customer: customer_data},
        });
        if(data) {
            const id = data.wi_id;
            await this.wishlistRepo.delete(id);
            return true;
        } else {
            return false;
        }
    }

}
