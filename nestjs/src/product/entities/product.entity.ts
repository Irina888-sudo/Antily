import { Branch } from 'src/branch/entities/branch.entity';
import { Entity, PrimaryGeneratedColumn, Column, IntegerType, ManyToOne, JoinColumn} from 'typeorm';



@Entity('product')



export class Product {
@ManyToOne(() => Branch, (branch) => branch.product)   // plusieurs produits → UNE branche
@JoinColumn({ name: 'branch_id' })                        // nom de la colonne étiquette
Branch!: Branch;
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'varchar', length:255, nullable : true})
    name!: string | null;

    @Column({type: 'decimal', nullable: true})
    price!: IntegerType | null
  branch: any;
}