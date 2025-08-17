import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { lookup } from 'mime-types';


@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('Missing AWS S3 configuration');
    }

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucket = bucket;
  }
    async uploadFile(file: Express.Multer.File, is_thumbnail = false): Promise<string> {
      const categoryFolder = this.getCategoryFolder(file.mimetype);
      const baseFolder = is_thumbnail ? 'thumbnails' : 'uploads';

      const key = `${process.env.NODE_ENV}/${baseFolder}/${categoryFolder}/${Date.now()}-${randomUUID()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
        ContentDisposition: 'inline',
        Metadata: { originalname: file.originalname },
      });

      await this.s3.send(command);
      return `${process.env.AWS_CLOUD_FRONT_URL}/${key}`;
    }

  private getCategoryFolder(mimeType: string ):string{
      if (!mimeType) return 'others';

      if (mimeType.startsWith('image/')) {
        return 'images';
      } 
      else if (mimeType.startsWith('video/')) {
        return 'videos';
      } 
      else if (mimeType.startsWith('audio/')) {
        return 'audio';
      } 
      else if (
        mimeType === 'application/pdf' ||
        mimeType === 'application/msword' ||
        mimeType.startsWith('application/vnd')
      ) {
        return 'documents';
      }
      
      return 'others';
  }






}
