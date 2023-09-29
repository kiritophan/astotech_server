import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    categoryId: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    des: string;
}