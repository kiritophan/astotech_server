import { Delete, HttpException, HttpStatus, Injectable, Param, Res } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private readonly categories: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let category = await this.categories.save(createCategoryDto);
      return {
        data: category,
        message: "Create ok! nhé"
      }
    } catch {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }
  async findAll() {
    try {
      let categories = await this.categories.find();
      return {
        data: categories,
        message: "Get all ok!"
      }
    } catch {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  async searchByTitle(searchString: string) {
    try {
      let categories = await this.categories.find({
        where: {
          title: ILike(`%${searchString}%`),
        }
      });
      return {
        data: categories,
        message: "Search ok!s"
      }
    } catch {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try {
      let product = await this.categories.findOne({ where: { id } })
      return {
        message: "Lấy Categories thành công",
        data: product
      }
    } catch (err) {
      throw new HttpException('Lỗi model', HttpStatus.BAD_REQUEST)
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: string) {
    try {
      let categoryId = await this.categories.delete(id)
      return {
        message: "delete success",
        data: categoryId
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }

  }


}
