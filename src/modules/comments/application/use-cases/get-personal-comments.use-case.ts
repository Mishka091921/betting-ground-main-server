import { Injectable } from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UserDto } from '@betting-ground/prisma-lib';
import { CreateCommentResponse, MemberCommentListResponse } from '../../domain/interfaces/comment-interface';
import { formatDate } from '@betting-ground/prisma-lib';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';

@Injectable()
export class CommentPersonalUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService,
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

async execute(quey:any, member_idx:number): Promise<MemberCommentListResponse> {
  const data = await this.memberCommentService.memberCommentPersonalList(quey, member_idx); 

  if(data.data && data.data.length > 0) {
    const total_views = await this.memberBoardStrapi.getPersonalBoardViews(member_idx);


    data.total_count = data.meta?.pagination?.total ?? 0;
    data.total_views_board = total_views ?? 0;  

    for(const comment of data.data) {
      comment.formatted_created_time_date = formatDate(comment.createdAt);
    }
  }


  return data;

}
}