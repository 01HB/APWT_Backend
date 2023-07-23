import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';

@Entity()
export class CartItemEntity {

    @PrimaryGeneratedColumn()
    ci_id: number;

    @Column()
    ci_product_id: number;

    @Column()
    ci_name: string;

    @Column()
    ci_price: number;

    @Column({nullable: true})
    ci_image: string;

    @Column()
    ci_quantity: number;

    @Column()
    ci_total: number;

    @ManyToOne(() => CustomerEntity, customer => customer.cart_items)
    customer: CustomerEntity;

}