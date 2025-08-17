// modules/user/user.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { User, UserDto } from "@betting-ground/prisma-lib";
import { Throttle } from "@nestjs/throttler";
import { Public } from "@betting-ground/prisma-lib";
import { UpdateCommentDto } from "../application/dto/update-comment.dto";
import { GetCommentDto } from "../application/dto/get-comment.dto";
import { buildResponse, BaseResponse } from "@betting-ground/prisma-lib";
import { CommentLatestResponse, CommentListResult, CreateCommentResponse, MemberCommentListResponse, UpdatedCommentResponse } from "../domain/interfaces/comment-interface";
import { CreateCommentDto } from "../application/dto/create-comment.dto";
import { GetPersonalBoardDto } from "src/modules/board/application/dto/get-personal-board.dto";

@ApiTags('Comments')
@Controller({ path: 'comments', version: '3' })
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Public()
  @Get('getListComments')
    async getComments(
      @Query() query: GetCommentDto, 
      @User() user:UserDto 
    ): Promise<BaseResponse<MemberCommentListResponse>>{
    const member_idx = user  ? user.member_idx : 0;
    const data = await this.service.getCommentsList(query.board_document_id, member_idx);
    return buildResponse(1,"Successfully Fetch Comments List",data);
  }
  
  @Get('personalComments')
    async personalComments(
      @Query() query: GetPersonalBoardDto, 
      @User() user:UserDto 
    ): Promise<BaseResponse<MemberCommentListResponse>>{
      const member_idx = user  ? user.member_idx : 0;
      const data = await this.service.getPersonalComments(query, member_idx);
    return buildResponse(1,"Successfully Fetch Comments List",data);
  }
  
  @Public()
  @Get('getLatestComments')
  async getLatestComments() : Promise<BaseResponse<CommentLatestResponse>>{
    const data = await this.service.getCommentsLatest();
    return buildResponse(1,"Successfully Fetch Latest Comments",data);
  }

  @Throttle({ limit: 60, ttl: 60 } as any)
  @Post()
  async postComment(@Body() body: CreateCommentDto, @User() user: UserDto): Promise<BaseResponse<CreateCommentResponse>>{
    const data = await this.service.postComment(body, user);
    return buildResponse(1, "Successfully Created A Comment", data);
  } 

  @Patch(':comment_document_id')
  async updateComment(
    @Param('comment_document_id') comment_document_id: string,
    @Body() body: UpdateCommentDto,
    @User() user: UserDto,
  ): Promise<BaseResponse<UpdatedCommentResponse>> {
    const { member_idx } = user;
    const data = await this.service.updateComment(comment_document_id, body, member_idx);
    return buildResponse(1, "Successfully Updated A Comment", data);
  }

  @Delete('bulk')
  async deleteBulkComment(
    @Body('comment_document_ids') comment_document_ids: string[],
    @User() user: UserDto,
  ): Promise<BaseResponse<any>> {
    const { member_idx } = user;
    await this.service.deleteBulkComment(comment_document_ids, member_idx);
    return buildResponse(1, "Successfully Deleted Comments", []);
  }

  @Delete('all')
  async deleteAllComments(
    @User() user: UserDto,
  ): Promise<BaseResponse<any>> {
    const { member_idx } = user;
    await this.service.deleteAllComments(member_idx);
    return buildResponse(1, "Successfully Deleted All Comments", []);
  } 

  @Delete(':comment_document_id')
  async deleteComment(
    @Param('comment_document_id') comment_document_id: string,
    @User() user: UserDto,
  ): Promise<BaseResponse<any>> {
    const { member_idx } = user
    await this.service.deleteComment(comment_document_id, member_idx);
    return buildResponse(1, "Successfully Deleted A Comment", []);
  }
  
}
