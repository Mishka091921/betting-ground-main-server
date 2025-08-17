// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { UserDto } from '@betting-ground/prisma-lib';
import { CommentPostUseCase } from '../application/use-cases/create-comment.use-case';
import { CommentGetListUseCase } from '../application/use-cases/get-comment.use-case';
import { CommentGetLatestUseCase } from '../application/use-cases/get-latest-comment.use-case';
import { CommentUpdateUseCase } from '../application/use-cases/update-comment.use-case';
import { CommentDeleteUseCase } from '../application/use-cases/delete-comment.use-case';
import { CreateCommentDto } from '../application/dto/create-comment.dto';
import { CommentPersonalUseCase } from '../application/use-cases/get-personal-comments.use-case';
import { CommentDeleteBulkUseCase } from '../application/use-cases/delete-bulk-comment.use-case';
import { CommentDeleteAllUseCase } from '../application/use-cases/delete-all-comment.use-case';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentPostUseCase: CommentPostUseCase,
    private readonly commentGetListUsecase: CommentGetListUseCase,
    private readonly commentGetLatestUseCase: CommentGetLatestUseCase,
    private readonly commentUpdateUseCase: CommentUpdateUseCase,
    private readonly commentDeleteUseCase: CommentDeleteUseCase,
    private readonly commentPersonalUseCase: CommentPersonalUseCase,
    private readonly commentDeleteBulkUseCase: CommentDeleteBulkUseCase,
    private readonly commentDeleteAllUseCase: CommentDeleteAllUseCase
  ) {}

  async getCommentsList(board_document_id:string, member_idx : number) {
    return this.commentGetListUsecase.execute(board_document_id,member_idx)
  }

  async getPersonalComments(query: any, member_idx: number) {
    return this.commentPersonalUseCase.execute(query, member_idx);
  }

  async getCommentsLatest(){
    return this.commentGetLatestUseCase.execute();
  }

  async postComment(body:CreateCommentDto, user:UserDto){
    return this.commentPostUseCase.execute(body,user)
  }

  async updateComment(comment_document_id: string, body:any, member_idx: number){
    return this.commentUpdateUseCase.execute(comment_document_id,body,member_idx)
  }

  async deleteComment(comment_document_id: string, member_idx: number){
    return this.commentDeleteUseCase.execute(comment_document_id, member_idx)
  }

  async deleteBulkComment(comment_document_ids: string[], member_idx: number) {
    return this.commentDeleteBulkUseCase.execute(comment_document_ids, member_idx);
  }

  async deleteAllComments(member_idx: number) {
    return this.commentDeleteAllUseCase.execute(member_idx);
  }
}
