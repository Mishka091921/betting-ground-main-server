import { Injectable } from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CommentTreeBuilder } from '../utils/comment-tree-builder.service';
import { formatDate } from '@betting-ground/prisma-lib';
import { CommentLatestResponse } from '../../domain/interfaces/comment-interface';

@Injectable()
export class CommentGetLatestUseCase {
  constructor(private readonly memberCommentService: StrapiCommentsService) {}

  async execute(): Promise<CommentLatestResponse> {
    const latest_comments = await this.memberCommentService.memberCommentLatest();

    if (latest_comments.data && Array.isArray(latest_comments.data)) {
      latest_comments.data.map((comment) => {
        comment.formatted_created_time_date = formatDate(comment.createdAt);
      });
    }
    return latest_comments;
  }
}
