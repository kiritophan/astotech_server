import { Category } from "src/modules/categories/entities/category.entity";
import { ProductOption } from "src/modules/product-options/entities/product-option.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, (Category) => Category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    name: string;

    @Column()
    des: string;

    @OneToMany(() => ProductOption, (productOption) => productOption.product)
    options: ProductOption[];
}