import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ProductService } from "./product.service";
import { createProductDto } from "./dto/create-product.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly service:ProductService){}

    @Get()
    findAll(){
        return this.service.findAll();
    }
}