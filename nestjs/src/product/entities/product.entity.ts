import { Entity, PrimaryGeneratedColumn, Column, IntegerType} from 'typeorm';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'varchar', length:255, nullable : true})
    name!: string | null;

    @Column({type: 'decimal', nullable: true})
    price!: IntegerType | null
}