import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';

@Injectable()
export class BoardDeleteUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

async execute(board_document_id:string,member_idx:number): Promise<MemberBoardResponse> {

  return this.memberBoardStrapi.deleteBoard(board_document_id,member_idx);
}
}