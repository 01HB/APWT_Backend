import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ProductEntity } from '../product/product.entity';
import { CartItemEntity } from 'src/cart/cart.entity'
import { OrderDto, PaymentDto } from './order.dto';
import { checkOutParams, checkOutProps } from 'src/utils/types';


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) 
        private orderRepo: Repository<OrderEntity>,
        @InjectRepository(CustomerEntity) 
        private customerRepo: Repository<CustomerEntity>,
        @InjectRepository(ProductEntity) 
        private productRepo: Repository<ProductEntity>,
        @InjectRepository(CartItemEntity) 
        private cartRepo: Repository<CartItemEntity>,
    ) {}

    async checkoutFromCart(email: string): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email})
        const cartData = await this.cartRepo.find({
            where: { customer: customer_data },
        });
        if (cartData.length>0) {
            // let ItemsName = [];
            // let ItemsImg = [];
            // let ItemsQty = [];
            // let ItemsTotal = [];
            // let Total = 0;
            // cartData.forEach(element => {
            //     const { ci_name, ci_image, ci_quantity, ci_total } = element;
            //     ItemsName.push(ci_name);
            //     ItemsImg.push(ci_image);
            //     ItemsQty.push(ci_quantity);
            //     ItemsTotal.push(ci_total);
            //     Total += ci_total;
            // });
            // const checkout = {
            //     items: ItemsName,
            //     images: ItemsImg,
            //     quantity: ItemsQty,
            //     itemtotal: ItemsTotal,
            //     total: Total,
            // };
            // return checkout;
            return cartData;
        } else {
            return false;
        }
    }

    async proceedToPayment(checkoutdetails: checkOutParams, orderDto: OrderDto): Promise<any> {
        const { items, total } = checkoutdetails;
        const checkoutinfo = {
            o_items: items,
            o_amount: total,
            o_address: orderDto.o_address,
        };
        return checkoutinfo;
    }

    async placeOrder(email: string, checkoutinfo: checkOutProps, payment: PaymentDto): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const orderData = {
            o_items: checkoutinfo.o_items,
            o_date: new Date(),
            o_amount: checkoutinfo.o_amount,
            payment_method: payment.payment_method,
            o_address: checkoutinfo.o_address,
            customer: customer_data,
        };
        await this.orderRepo.save(orderData);
        const cartData = await this.cartRepo.find({
            where: { customer: customer_data },
        });
        for (const element of cartData) {
            await this.cartRepo.delete({ci_id: element.ci_id});
        }
        return 'order placed successfully';
    }

    async getOrders(email: string): Promise<any> {
        const customer_data = await this.customerRepo.findOneBy({email: email});
        const id = customer_data.id;
        const query = this.orderRepo
        .createQueryBuilder('order')
        .select(['order.o_id', 'order.o_items', 'order.o_date', 'order.o_amount', 'order.o_status', 'order.payment_method', 'order.o_address', 'order.payment_status'])
        .where('order.customerId = :id ', { id })
        .orderBy('order.o_date', 'DESC');
        return await query.getMany();
    }



}
