import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase';
import { Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try {
      let productRes = await this.productsService.create(createProductDto)
      res.status(productRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(productRes)
    } catch (err) {
      console.log("err", err);

      throw new HttpException('Lỗi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('q') q: string) {
    try {
      return res.status(HttpStatus.OK).json(await this.productsService.findAll())
    } catch (err) {
      throw new HttpException('Lỗi controller', HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(id);
      return res.status(HttpStatus.OK).json(product);
    } catch (err) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let productRes = await this.productsService.remove(id)
      res.status(productRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(productRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }
}
