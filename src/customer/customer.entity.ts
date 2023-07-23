import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { WishlistItemEntity } from '../wishlist/wishlist.entity';
import { CartItemEntity } from '../cart/cart.entity';

@Entity()
export class CustomerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'name', type: "varchar", length: 150})
    name: string;

    @Column({name:'email', type: "varchar", length: 100})
    email: string;

    @Column({name:'password', type: "varchar", length: 999})
    password: string;

    @Column({name:'contact', type: "varchar", length: 14})
    contact: string;

    @Column({name:'gender', type: "varchar", length: 10})
    gender: string;

    @Column({name:'address', nullable: true, type: "varchar", length: 150})
    address: string;

    @Column({name:'photo', nullable: true, type: "varchar"})
    photo: string;

    @OneToMany(() => OrderEntity, order => order.customer)
    orders: OrderEntity[];

    @OneToMany(() => WishlistItemEntity, wishlist_item => wishlist_item.customer)
    wishlist_items: WishlistItemEntity[];

    @OneToMany(() => CartItemEntity, cart_item => cart_item.customer)
    cart_items: CartItemEntity[];

}
