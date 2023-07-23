import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';

@Entity()
export class WishlistItemEntity {

    @PrimaryGeneratedColumn()
    wi_id: number;

    @Column()
    wi_product_id: number;

    @Column()
    wi_name: string;

    @Column()
    wi_price: number;

    @Column()
    wi_description: string;

    @Column({nullable: true})
    wi_image: string;

    @ManyToOne(() => CustomerEntity, customer => customer.wishlist_items)
    customer: CustomerEntity;

}