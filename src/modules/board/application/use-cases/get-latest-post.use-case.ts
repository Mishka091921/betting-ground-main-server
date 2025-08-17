import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { BoardQueryDto } from '../dto/get-board-list.dto';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';

@Injectable()
export class BoardLatestUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

  async execute(): Promise<MemberBoardResponse> {
       return this.memberBoardStrapi.getLatestMemberBoard();
  } 
}