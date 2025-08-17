import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';

@Injectable()
export class BoardDeleteAllUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

async execute(member_idx:number): Promise<any> {
   return this.memberBoardStrapi.deleteAllBoards(member_idx);
}
}