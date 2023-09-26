import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ProductsService {
  searchByTitle(q: string): any {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectRepository(Product) private products: Repository<Product>) { }
  async create(createProductDto: CreateProductDto) {
    try {
      let product = await this.products.save(createProductDto)
      return {
        message: "Add product thanh cong",
        data: product
      }
    } catch (err) {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      let products = await this.products.find();
      return {
        data: products,
        message: "Lấy product thành công"
      }
    } catch {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try {
      let product = await this.products.findOne({ where: { id } })
      return {
        message: "Lấy product thành công",
        data: product
      }
    } catch (err) {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    try {
      let productId = await this.products.delete(id)
      return {
        message: "delete product thành công",
        data: productId
      }
    } catch (err) {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }
}
