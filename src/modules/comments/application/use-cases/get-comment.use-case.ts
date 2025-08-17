import { Injectable } from '@nestjs/common';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CommentTreeBuilder } from '../utils/comment-tree-builder.service';
import { CommentListResult, MemberCommentListResponse } from '../../domain/interfaces/comment-interface';
import { PrismaReadService } from '@betting-ground/prisma-lib';
import { formatDate } from '@betting-ground/prisma-lib';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';

@Injectable()
export class CommentGetListUseCase {
  constructor(
    private readonly memberCommentService: StrapiCommentsService,
    private readonly prismaReadService: PrismaReadService,
    private readonly memberReactionStrapi: StrapiMemberReactionService
  ) {}
async execute(board_document_id: string, member_idx: number): Promise<MemberCommentListResponse> {
  const comments_response = await this.memberCommentService.memberCommentGetList(board_document_id);


  for (const comment of comments_response.data) {
    comment.my_reaction = 'none';
    comment.formatted_created_time_date = formatDate(comment.createdAt);

    if (member_idx == 0 && comment.is_private) {
      comment.content = '**********';
    }

    if (member_idx > 0) {
      const my_reaction = await this.memberReactionStrapi.getMyReaction(comment.documentId, member_idx);
      comment.my_reaction = my_reaction.data[0]?.reaction || 'none';
    }

    const comment_replies = await this.memberCommentService.memberCommentGetReply(comment.documentId);
    if (comment_replies) {
      for (const reply of comment_replies) {
        reply.my_reaction = 'none';
        reply.formatted_created_time_date = formatDate(reply.createdAt);

        if (member_idx == 0 && reply.is_private) {
          reply.content = '**********';
        }

        if (member_idx > 0) {
          const my_reaction = await this.memberReactionStrapi.getMyReaction(reply.documentId, member_idx);
          reply.my_reaction = my_reaction.data[0]?.reaction || 'none';
        }
      }
      comment.replies = comment_replies;
    } else {
      comment.replies = [];
    }
  }

    const author_idx_set = new Set<number>();

    for (const comment of comments_response.data) {
      if (comment.author_idx != null) {
        author_idx_set.add(Number(comment.author_idx));
      }
      for (const reply of comment.replies ?? []) {
        if (reply.author_idx != null) {
          author_idx_set.add(Number(reply.author_idx));
        }
      }
    }

    const authors = await this.prismaReadService.member.findMany({
      where: {
        idx: { in: Array.from(author_idx_set) },
      },
    });

    const authorMap = new Map<number, { id: string; nick_name: string,level: number }>();
    for (const author of authors) {
      authorMap.set(Number(author.idx), {
        id: author.id,
        nick_name: author.nick_name,
        level: author.level ?? 0
      });
    }

    for (const comment of comments_response.data) {
      const author = authorMap.get(Number(comment.author_idx));
      if (author) {
        comment.author_id = author.id;
        comment.author_nick_name = author.nick_name;
        comment.level = author.level;
      }

      for (const reply of comment.replies ?? []) {
        const replyAuthor = authorMap.get(Number(reply.author_idx));
        if (replyAuthor) {
          reply.author_id = replyAuthor.id;
          reply.author_nick_name = replyAuthor.nick_name;
          reply.level = replyAuthor.level;
        }
      }
    }
  return comments_response;
}

}
