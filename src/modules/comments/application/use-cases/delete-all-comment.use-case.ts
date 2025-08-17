import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';

@Injectable()
export class CommentDeleteAllUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService
  ) {}

  async execute( member_idx: number): Promise<any> {

    return this.memberCommentService.memberCommentDeleteAll(member_idx);

  }
}
