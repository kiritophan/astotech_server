import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';


@Injectable()
export class ProductsService {
  searchByTitle(q: string): any {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) { }

  async create(createProductDto: CreateProductDto) {
    try {
      let newProduct = await this.products.save(createProductDto);
      if (!newProduct) {
        return [false, "lỗi", null]
      }
      let newProductDetail = await this.products.findOne({
        where: {
          id: newProduct.id
        },
        relations: {
          options: {
            pictures: true
          }
        }
      })

      if (!newProductDetail) {
        return [false, "lỗi", null]
      }
      return [true, "Create ok", newProductDetail]
    } catch (err) {
      return [false, "lỗi model", null]
    }
  }

  async findAll() {
    try {
      let productList = await this.products.find({
        relations: {
          options: {
            pictures: true
          }
        }
      });
      if (!productList) {
        return [false, "lỗi", null]
      }
      return [true, "Get products ok", productList]
    } catch (err) {
      return [false, "lỗi model", null]
    }
  }

  async findOne(id: string) {
    try {
      let product = await this.products.findOne({
        where: { id }, relations: {
          category: true,
          options: {
            pictures: true
          }
        }
      })
      return {
        message: "Lấy product thành công",
        data: product
      }
    } catch (err) {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findByCategory(id: string) {
    try {
      let products = await this.products.find({
        where: {
          categoryId: id
        },
        relations: {
          category: true,
          options: {
            pictures: true
          }
        }
      })
      return {
        status: true,
        message: "get products by category successfully",
        data: products
      }
    } catch (err) {
      return {
        status: false,
        data: null
      }
    }
  }

  async searchByName(name: string) {
    try {
      let categories = await this.products.find({
        where: {
          name: ILike(`%${name}%`),
        },
        relations: {
          options: {
            pictures: true
          }
        }
      }
      );
      return {
        data: categories,
        message: "Get products successfully"
      }
    } catch (err) {
      throw new HttpException('Loi Model', HttpStatus.BAD_REQUEST);
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
