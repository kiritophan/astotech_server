import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { Response } from 'express';

@Controller('product-options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) { }

  @Post()
  async create(@Body() createProductOptionDto: CreateProductOptionDto, @Res() res: Response) {
    try {
      let [status, message, data] = await this.productOptionsService.create(createProductOptionDto);
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller lỗi!"
      })
    }
  }
}