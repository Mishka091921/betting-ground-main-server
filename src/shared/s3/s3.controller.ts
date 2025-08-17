// src/s3/s3.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Public } from '@betting-ground/prisma-lib';

@Controller({ path: 'upload', version: '1' })
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.s3Service.uploadFile(file);
    return { url };
  }
}
