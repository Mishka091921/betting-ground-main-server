import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';

@Injectable()
export class CommentDeleteBulkUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService
  ) {}

  async execute(comment_document_ids: string [], member_idx: number): Promise<any> {
    
    return this.memberCommentService.memberCommentBulkDelete(comment_document_ids, member_idx);

  }
}
