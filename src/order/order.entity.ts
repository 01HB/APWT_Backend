import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';

@Entity()
export class OrderEntity {

    @PrimaryGeneratedColumn()
    o_id: number;

    @Column()
    o_items: string;

    @Column()
    o_date: Date;

    @Column()
    o_amount: number;

    @Column({default: 'pending'})
    o_status: string;

    @Column()
    payment_method: string;

    @Column({default: 'pending'})
    payment_status: string;

    @Column()
    o_address: string;

    @ManyToOne(() => CustomerEntity, customer => customer.orders)
    customer: CustomerEntity;

}