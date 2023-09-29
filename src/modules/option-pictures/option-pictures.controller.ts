import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { OptionPicturesService } from './option-pictures.service';
import { CreateOptionPictureDto } from './dto/create-option-picture.dto';
import { UpdateOptionPictureDto } from './dto/update-option-picture.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase'
@Controller('option-pictures')
export class OptionPicturesController {
  constructor(private readonly optionPicturesService: OptionPicturesService) { }

  @Post(":optionId")
  @UseInterceptors(FilesInterceptor('pictures'))
  async create(@UploadedFiles() files: Array<Express.Multer.File>, @Param('optionId') optionId: string, @Res() res: Response) {
    try {
      console.log("optionId", optionId)
      console.log("files", files)
      let pictures: {
        icon: string,
        optionId: string
      }[] = []
      for (let file of files) {
        let url = await uploadFileToStorage(file, "products", file.buffer)
        pictures.push({
          optionId,
          icon: url ? url : "xxx.jpg"
        })
      }
      let [status, message, data] = await this.optionPicturesService.create(pictures);
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller error"
      })
    }
  }
}