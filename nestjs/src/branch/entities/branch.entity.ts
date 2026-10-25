import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Product } from 'src/product/entities/product.entity';


@Entity('branch')

export class Branch {
  @OneToMany(() => Product, (product) => product.branch)
Product!: Product[];

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name!: string | null;

  @OneToMany(() => Role, (role) => role.branch)
  roles!: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
    product: any;
}
