import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    p_id: number;

    @Column()
    p_name: string;

    @Column()
    p_price: number;

    @Column()
    p_description: string;

    @Column({nullable: true})
    p_image: string;

    @Column()
    p_category: string;

    @Column()
    p_stock: number;

}
