import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { BoardQueryDto } from '../dto/get-board-list.dto';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { PrismaReadService } from '@betting-ground/prisma-lib';
import { formatDate } from '@betting-ground/prisma-lib';
import { BoardCategory } from '../../domain/enums/board-category.enum';

@Injectable()
export class BoardListUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService,
    private readonly memberCommentStrapi: StrapiCommentsService,
    private readonly prismaReadService: PrismaReadService,
  ) {}


async execute(query: BoardQueryDto): Promise<MemberBoardResponse> {
  const member_board = await this.memberBoardStrapi.getMemberBoard(query);
  
  if(query.category != BoardCategory.EVENT){
    const admin_board = await this.memberBoardStrapi.getAdminBoard(query);

    if (Array.isArray(admin_board?.data)) {
    admin_board.data.forEach(board => {
      board.formatted_created_time_date = formatDate(board.createdAt);
    });
    member_board.admin_notice = admin_board.data;
  }
  }

  if (Array.isArray(member_board?.data) && member_board.data.length > 0) {
    const member_idx_list = [...new Set(member_board.data.map(b => Number(b.member_idx)))];

    const members = await this.prismaReadService.member.findMany({
      where: { idx: { in: member_idx_list } },
      select: { idx: true, level: true, id: true, nick_name: true },
    });

    const member_map = new Map(members.map(m => [m.idx, m]));

    member_board.data.forEach(board => {
      const member_info = member_map.get(BigInt(board.member_idx)) as { id: string; nick_name: string; level: number } | undefined;
      board.author_id = member_info?.id ?? '';
      board.author_nick_name = member_info?.nick_name ?? '';
      board.user_level = member_info?.level ?? 0;
      board.formatted_created_time_date = formatDate(board.createdAt);
    });
  }

  return member_board;
}
}