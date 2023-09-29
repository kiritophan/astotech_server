import { Injectable } from '@nestjs/common';
import { CreateOptionPictureDto } from './dto/create-option-picture.dto';
import { UpdateOptionPictureDto } from './dto/update-option-picture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionPicture } from './entities/option-picture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionPicturesService {

  constructor(@InjectRepository(OptionPicture) private readonly optionPictures: Repository<OptionPicture>) { }

  async create(pictures: {
    icon: string,
    optionId: string
  }[]) {
    try {
      for (let picture of pictures) {
        await this.optionPictures.save(picture);
      }
      let pictureList = await this.optionPictures.find({
        where: {
          optionId: pictures[0].optionId
        }
      })
      if (!pictureList) return [false, "Lỗi", null]
      return [true, "ok", pictureList]
    } catch (err) {
      return [false, "Model error", null]
    }
  }
}