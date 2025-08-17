import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';

@Injectable()
export class CommentDeleteUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService
  ) {}

  async execute(comment_document_id: string, member_idx: number): Promise<any> {
      return this.memberCommentService.memberCommentDelete(
        comment_document_id,
        member_idx,
      );
  }
}
