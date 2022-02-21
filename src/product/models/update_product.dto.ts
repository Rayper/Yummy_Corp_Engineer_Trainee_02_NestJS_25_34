import { IsNotEmpty } from "class-validator";

export class UpdateProductDto {

    title?: string;

    description?: string;

    image?: string;

    price?: number;
}