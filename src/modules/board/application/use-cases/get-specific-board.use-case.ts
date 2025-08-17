import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import {
  MemberBoardResponse,
  MemberBoardSpecificResponse,
} from '../../domain/interfaces/board-interface';
import { PrismaReadService } from '@betting-ground/prisma-lib';
import { formatDate } from '@betting-ground/prisma-lib';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { BoardIncreaseViewsUseCase } from './increment-board-views.use-case';

@Injectable()
export class BoardSpecificUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService,
    private readonly prismaReadService: PrismaReadService,
    private readonly memberReactionStrapi: StrapiMemberReactionService,
    private readonly memberCommentStrapi: StrapiCommentsService,
    private readonly boardIncreaseViewsUseCase: BoardIncreaseViewsUseCase,
  ) {}

  async execute(
    board_document_id: string,
    member_idx: number,
  ): Promise<MemberBoardSpecificResponse> {
    const post = await this.memberBoardStrapi.getSpecificMemberBoard(board_document_id);
    const current = post.data[0];

    if (post.data.length == 0) {
      throw new Error('POST_NOT_FOUND');
    }

    await this.boardIncreaseViewsUseCase.execute(board_document_id);

    const post_data = post.data[0];
    const member_info = await this.prismaReadService.member.findMany({
      where: { idx: Number(post_data.member_idx) },
      select: { idx: true, level: true, id: true, nick_name: true },
    });

    post_data.my_reaction = 'none';

    if (member_idx > 0) {
      const my_reaction = await this.memberReactionStrapi.getMyReaction(
        board_document_id,
        member_idx,
      );
      post_data.my_reaction = my_reaction.data[0]?.reaction || 'none';
    }

    const count = await this.memberCommentStrapi.getCommentCount(board_document_id);

    post_data.author_id = member_info[0]?.id ?? '';
    post_data.author_nick_name = member_info[0]?.nick_name ?? '';
    post_data.user_level = member_info[0]?.level ?? 0;
    post_data.formatted_created_time_date = formatDate(post_data.createdAt);
    post_data.comment_count = count;
    const current_created_at = current.createdAt;
    const previous_res = await this.memberBoardStrapi.getPreviousPost(
      current_created_at,
      post_data.category,
    );
    const next_res = await this.memberBoardStrapi.getNextPost(
      current_created_at,
      post_data.category,
    );

    const previous_id = previous_res?.data?.[0]?.documentId || null;
    const next_id = next_res?.data?.[0]?.documentId || null;

    post.others = {
      previous: previous_id ?? '',
      next: next_id ?? '',
    };
    return post;
  }
}
