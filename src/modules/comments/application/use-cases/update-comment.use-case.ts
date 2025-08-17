import { Injectable } from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CommentTreeBuilder } from '../utils/comment-tree-builder.service';
import { UpdatedCommentResponse } from '../../domain/interfaces/comment-interface';

@Injectable()
export class CommentUpdateUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService
  ) {}

  async execute(comment_document_id: string, body:any, member_idx:number): Promise<UpdatedCommentResponse> {
    return this.memberCommentService.memberCommentUpdate(comment_document_id, body,member_idx);
  }
}
