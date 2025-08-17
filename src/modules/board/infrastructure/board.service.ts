// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { BoardPostUseCase } from '../application/use-cases/create-board.use-case';
import { BoardListUseCase } from '../application/use-cases/get-board-list.use-case';
import { BoardQueryDto } from '../application/dto/get-board-list.dto';
import { BoardSpecificUseCase } from '../application/use-cases/get-specific-board.use-case';
import { UserDto } from '@betting-ground/prisma-lib';
import { BoardPatchUseCase } from '../application/use-cases/patch-board.use-case';
import { BoardDeleteUseCase } from '../application/use-cases/delete-board.use-case';
import { BoardLatestUseCase } from '../application/use-cases/get-latest-post.use-case';
import { BoardPersonalUseCase } from '../application/use-cases/get-personal-board.use-case';
import { BoardDeleteBulkUseCase } from '../application/use-cases/delete-bulk-board.use-case';
import { BoardDeleteAllUseCase } from '../application/use-cases/delete-all-board.use-case';


@Injectable()
export class BoardService {
  
  constructor(
    private readonly createBoardUseCase: BoardPostUseCase,
    private readonly getBoardListUseCase: BoardListUseCase,
    private readonly getBoardSpecificUseCase: BoardSpecificUseCase,
    private readonly patchBoardUseCase: BoardPatchUseCase,
    private readonly deleteBoardUseCase: BoardDeleteUseCase,
    private readonly getLatestBoardUseCase: BoardLatestUseCase,
    private readonly boardPersonalUseCase: BoardPersonalUseCase,
    private readonly deleteBoardBulkUseCase: BoardDeleteBulkUseCase,
    private readonly deleteBoardAllUseCase: BoardDeleteAllUseCase
    
  ) {}

  async getBoardList(query:BoardQueryDto) {
    return this.getBoardListUseCase.execute(query);
  }

  async getPersonalBoard(query: any, member_idx: number) {
    return this.boardPersonalUseCase.execute(query,member_idx);
  } 

  async getLatestBoardList(){
    return this.getLatestBoardUseCase.execute();
  }

  async getDetailBoardInfo(board_document_id:string,member_idx:number){
   return this.getBoardSpecificUseCase.execute(board_document_id,member_idx);
  }
  
  async postBoard(body: any,user:UserDto, files: any) {
    return this.createBoardUseCase.execute(body,user,files);    
  }

  async updateBoard(board_document_id:string ,body: any,member_idx) {
    return this.patchBoardUseCase.execute(board_document_id,body,member_idx);
  }

  async deleteBoard(board_document_id:any,member_idx:number){
    return this.deleteBoardUseCase.execute(board_document_id,member_idx);
  }

  async deleteBulkBoard(board_document_ids: string[], member_idx: number) {
    return this.deleteBoardBulkUseCase.execute(board_document_ids, member_idx);
  }

  async deleteAllBoards(member_idx: number) {
    return this.deleteBoardAllUseCase.execute(member_idx);
  }


}
