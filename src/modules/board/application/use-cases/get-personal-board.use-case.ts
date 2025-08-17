import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';
import { formatDate } from '@betting-ground/prisma-lib';

@Injectable()
export class BoardPersonalUseCase {
  constructor(private readonly memberBoardStrapi: StrapiMemberBoardService) {}

  async execute(query: any, member_idx: number): Promise<MemberBoardResponse> {
    const data = await this.memberBoardStrapi.getPersonalBoard(query, member_idx);
    const total_views = await this.memberBoardStrapi.getPersonalBoardViews(member_idx);

    if (data.data && data.data.length > 0) {
      for (const board of data.data) {
        board.formatted_created_time_date = formatDate(board.createdAt);
      }
    }
    data.total_count = data.meta?.pagination?.total ?? 0;
    data.total_views = total_views ?? 0;

    return data;
  }
}
