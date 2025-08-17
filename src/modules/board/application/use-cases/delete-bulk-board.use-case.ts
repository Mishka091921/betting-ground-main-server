import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';

@Injectable()
export class BoardDeleteBulkUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

async execute(board_document_ids: string[], member_idx:number): Promise<any> {
   return this.memberBoardStrapi.deleteBulkBoards(board_document_ids, member_idx);
}
}