import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoardDTO } from '../dto/create-board.dto';
import { MediaExtractionService } from 'src/shared/media-extraction/media-extraction.service';
import { S3Service } from 'src/shared/s3/s3.service';
import axios from 'axios';
import { sanitizeHtml } from '@betting-ground/prisma-lib';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { CreateMemberBoardResponse } from '../../domain/interfaces/board-interface';
import { UserDto, getDayDate, getPkey } from '@betting-ground/prisma-lib';

import {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_VIDEO_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_THUMBNAIL_SIZE,
  MAX_VIDEO_SIZE,
} from 'src/constants/file-upload.constant';

@Injectable()
export class BoardPostUseCase {
  constructor(
    private readonly mediaExtract: MediaExtractionService,
    private readonly s3Service: S3Service,
    private readonly memberBoardStrapi: StrapiMemberBoardService,
  ) {}

  async execute(
    dto: CreateBoardDTO,
    user: UserDto,
    files: any,
  ): Promise<CreateMemberBoardResponse> {
    const content_images: any[] = [];
    const thumbnails: any[] = [];
    const content_videos: any[] = [];

    const sanitize_html = sanitizeHtml(dto.content);

    // Validate and Group Files
    for (const file of files) {
      // Validate MIME type & Size
      if (file.fieldname === 'content_images') {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype) || file.size > MAX_IMAGE_SIZE) {
          throw new BadRequestException(`Invalid content image file`);
        }
        content_images.push(file);
      } else if (file.fieldname === 'thumbnail') {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype) || file.size > MAX_THUMBNAIL_SIZE) {
          throw new BadRequestException(`Invalid thumbnail file`);
        }
        thumbnails.push(file);
      } else if (file.fieldname === 'content_video') {
        if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype) || file.size > MAX_VIDEO_SIZE) {
          throw new BadRequestException(`Invalid video file`);
        }
        content_videos.push(file);
      } else {
        throw new BadRequestException(`Unexpected file field: ${file.fieldname}`);
      }
    }
    // Upload Thumbnails (expecting only one)
    let thumbnail_url = '';
    if (thumbnails.length > 0) {
      thumbnail_url = await this.s3Service.uploadFile(thumbnails[0], true);
    }

    // Upload Content Images
    const content_images_url: string[] = [];
    for (const image of content_images) {
      const imageUrl = await this.s3Service.uploadFile(image, false);
      content_images_url.push(imageUrl);
    }
    //Handle Video Upload

    let final_content = sanitize_html;

    final_content = final_content.replace(
      /<img[^>]*data-img-index="(\d+)"[^>]*>/g,
      (match, index) => {
        const s3Url = content_images_url[parseInt(index, 10)] || '';
        if (!s3Url) return '';
        return `<img src="${s3Url}" />`;
      },
    );

    const image_string = content_images_url.join(',');

    let board_payload = {
      category: dto.category,
      sub_category: dto.sub_category,
      member_idx: user.member_idx,
      title: dto.title,
      thumbnail_path: thumbnail_url,
      img_path_list: image_string,
      content: final_content,
      tag_list: '',
      video_url: '',
      link_url: '',
      day_date: getDayDate(),
      pkey: getPkey(),
    };

    // //Strapi Gateway API
    return await this.memberBoardStrapi.postMemberBoard(board_payload);
  }
}
