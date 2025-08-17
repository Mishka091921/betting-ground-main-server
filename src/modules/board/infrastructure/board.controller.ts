// modules/user/user.controller.ts

import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BoardService } from "./board.service";
import { 
  SwaggerLatestBoardList,
    SwaggerRqBoardDetail, 
    SwaggerRqBoardList, 
    SwaggerRqBoardPostComplete, 
    SwaggerRqBoardPostEditComplete
  } from "../application/swagger/board.swagger";
import { CreateBoardDTO } from "../application/dto/create-board.dto";
import { Roles, MemberAccountType, User } from "@betting-ground/prisma-lib";
import { BoardQueryDto } from "../application/dto/get-board-list.dto";
import { buildResponse, BaseResponse } from "@betting-ground/prisma-lib";
import { CreateMemberBoardResponse, MemberBoardResponse } from "../domain/interfaces/board-interface";
import { UpdateBoardDto } from "../application/dto/update-board.dto";
import { UserDto } from "@betting-ground/prisma-lib";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Public } from "@betting-ground/prisma-lib";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { GetPersonalBoardDto } from "../application/dto/get-personal-board.dto";

@ApiTags('Board')
@Controller({ path: 'board', version: '3' })
export class BoardController {
  constructor(private readonly service: BoardService) {}

  @Public()
  @Get('getBoardList')
  @SwaggerRqBoardList()
    async findAllBoards(
      @Query() query:BoardQueryDto
    ):Promise<BaseResponse<MemberBoardResponse>> {
    const data = await this.service.getBoardList(query);
    return buildResponse(1,"Successfully fetched Board List",data);
  }

  @Get('personalBoard')
  @SwaggerRqBoardList()
    async personalBoard(
      @Query() query:GetPersonalBoardDto,
      @User() user: UserDto
    ):Promise<BaseResponse<MemberBoardResponse>> {
    const { member_idx } = user;
    const data = await this.service.getPersonalBoard(query,member_idx);
    return buildResponse(1,"Successfully fetched Board List",data);
  }

  @Public()
  @Get('getLatestBoardList')
  @SwaggerLatestBoardList()
    async findLatestBoard():Promise<BaseResponse<MemberBoardResponse>>{
    const data = await this.service.getLatestBoardList();
    return buildResponse(1,"Successfully Created A post", data);
  }

  @Public()
  @Get(':board_document_id')
    @SwaggerRqBoardDetail()
    async getDetailBoardInfo(
      @Param('board_document_id') board_document_id: string,
      @User() user: UserDto
    ):Promise<BaseResponse<MemberBoardResponse>>{
    const member_idx = user ? user.member_idx : 0;
    const data = await this.service.getDetailBoardInfo(board_document_id,member_idx);
    return buildResponse(1,"Get Post", data);
  }

  @Roles(MemberAccountType.REGULAR, MemberAccountType.PICKSTER)
  @Post('createBoard')
  @SwaggerRqBoardPostComplete()
  @UseInterceptors(AnyFilesInterceptor({
   limits: { fileSize: 10 * 1024 * 1024 }
  }))
    async postBoard(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() body: CreateBoardDTO,
      @Req() req,
      @User() user:UserDto
    ):Promise<BaseResponse<CreateMemberBoardResponse>>{
      const dtoInstance = plainToInstance(CreateBoardDTO, body);
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        throw new Error("VALIDATION_ERROR");
      }
  
      if (body.category === 'PANEL' && user.type !== MemberAccountType.PICKSTER) {
        throw new BadRequestException("Only PICKSTER accounts can create PANEL posts");
      }
    
      const data = await this.service.postBoard(body, user, files);
      return buildResponse(1,"Successfully Created A post", data);
  }

  @Roles(MemberAccountType.REGULAR)
  @Patch(':board_document_id')
  @SwaggerRqBoardPostEditComplete()
    async patchBoard(
      @Param('board_document_id') board_document_id: string, 
      @Body() body: UpdateBoardDto,
      @User() user: UserDto
    ):Promise<BaseResponse<MemberBoardResponse>>
  {
    const { member_idx } = user;
    const data = await this.service.updateBoard(board_document_id, body,member_idx);
    return buildResponse(1, 'Successfully updated post', data);
  }
  
  @Delete('bulk') 
  async deleteBulkBoard(
    @Body('board_document_ids') board_document_ids: string[],
    @User() user: UserDto,
  ): Promise<BaseResponse<any>> {
    const { member_idx } = user;
    await this.service.deleteBulkBoard(board_document_ids, member_idx);
    return buildResponse(1, "Successfully Deleted Posts", []);
  }

  @Delete('all')
  async deleteAllBoards(
    @User() user: UserDto,
  ): Promise<BaseResponse<any>> {
    const { member_idx } = user;
    await this.service.deleteAllBoards(member_idx);
    return buildResponse(1, "Successfully Deleted All Posts", []);
  }  
  
  @Delete(':board_document_id')
    async deleteBoard(
      @Param('board_document_id') board_document_id: string, 
      @User() user:UserDto
    ): Promise<BaseResponse<null>> {
    const { member_idx} = user;
    await this.service.deleteBoard(board_document_id,member_idx);
    return buildResponse(1, 'Successfully deleted post', null);
  }

}
