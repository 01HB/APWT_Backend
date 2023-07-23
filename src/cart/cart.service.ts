import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from './cart.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(CartItemEntity) 
        private cartItemRepo: Repository<CartItemEntity>,
        @InjectRepository(CustomerEntity) 
        private customerRepo: Repository<CustomerEntity>,
        @InjectRepository(ProductEntity) 
        private productRepo: Repository<ProductEntity>,
    ) {}

    async getCartItems(email: string): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const id = customer_data.id;
        const query = this.cartItemRepo
        .createQueryBuilder('cart')
        .select(['cart.ci_product_id', 'cart.ci_name', 'cart.ci_price', 'cart.ci_image', 'cart.ci_quantity', 'cart.ci_total'])
        .where('cart.customerId = :id ', { id })
        .orderBy('cart.ci_product_id', 'ASC');
        return await query.getMany();
    }

    async addToCart(email: string, pid: number, quantity: number): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const cidata = await this.cartItemRepo.findOne({
            where: { ci_product_id: pid, customer: customer_data },
        });
        if(cidata) {
            return 'same item already exists in the cart';
        } else {
            const product = await this.productRepo.findOneBy({p_id: pid});
            const { p_id, p_name, p_price, p_image } = product;
            const cartItem = { 
                ci_product_id: p_id, 
                ci_name: p_name, 
                ci_price: p_price,  
                ci_image: p_image, 
                ci_quantity: quantity,
                ci_total: p_price * quantity,
                customer: customer_data,
            };
            await this.cartItemRepo.save(cartItem);
            return 'item added to the cart';
        }
    }

    async removeFromCart(email: string, pid: number): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const data = await this.cartItemRepo.findOne({
            where: {ci_product_id: pid, customer: customer_data},
        });
        if(data) {
            const id = data.ci_id;
            await this.cartItemRepo.delete(id);
            return true;
        } else {
            return false;
        }
    }

}
