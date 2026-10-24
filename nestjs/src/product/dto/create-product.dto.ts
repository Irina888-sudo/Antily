import { IsOptional , IsNumber, IsString } from "class-validator";

export class createProductDto{
    @IsOptional()
    @IsString()
    name?: String;

    @IsOptional()
    @IsNumber()
    price?: number;

}