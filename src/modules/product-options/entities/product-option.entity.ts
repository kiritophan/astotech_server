import { OptionPicture } from "src/modules/option-pictures/entities/option-picture.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (Product) => Product.options)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    price: number;

    @Column({
        default: false
    })
    status: boolean;

    @Column()
    title: string;

    @OneToMany(() => OptionPicture, (optionPicture) => optionPicture.option)
    pictures: OptionPicture[];
    sold: any;
}