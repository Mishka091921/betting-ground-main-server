import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';

@Injectable()
export class BoardIncreaseViewsUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}
  async execute(board_document_id:string): Promise<any> {
    await this.memberBoardStrapi.incrementViews(board_document_id);
  } 
}