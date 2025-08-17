import { Injectable } from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UserDto } from '@betting-ground/prisma-lib';
import { CreateCommentResponse } from '../../domain/interfaces/comment-interface';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';

@Injectable()
export class CommentPostUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService,
    private readonly memberBoardService: StrapiMemberBoardService
  ) {}

async execute(body:CreateCommentDto, user: UserDto): Promise<CreateCommentResponse> {

  const { content, board_document_id,parent_comment_document_id, comment_depth,is_private} = body
  const payload = {
    content, 
    parent_comment_document_id,
    author_idx:Number(user.member_idx),
    comment_depth,
    is_private,
    board_document_id,
    member_board: board_document_id
  }
  
  const comment = await this.memberCommentService.memberCommentCreate(payload);
  if (!comment || !comment.data) {
    throw new Error("comment Not Found");
  }
  await this.memberBoardService.incrementBoardCommentCount(body.board_document_id);
  return comment;
}
}