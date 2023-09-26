import { Allow } from 'class-validator';

export class CreateProductDto {
    @Allow()
    name: string;

    @Allow()
    price: number;

    @Allow()
    desc: string;

    @Allow()
    quantity: number;

    @Allow()
    categoryId: string;

}
