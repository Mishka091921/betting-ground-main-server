// strapi-gateway.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from 'src/modules/comments/application/dto/update-comment.dto';
import {
  CommentLatestResponse,
  CreateCommentResponse,
  MemberComment,
  MemberCommentListResponse,
  UpdatedCommentResponse,
} from 'src/modules/comments/domain/interfaces/comment-interface';
import { StrapiMemberBoardService } from '../board/strapi-member-board.service';
import { StrapiBaseService } from '../strapi-base.service';

@Injectable()
export class StrapiCommentsService extends StrapiBaseService {
  constructor(
    http: HttpService,
    private readonly memberBoardService: StrapiMemberBoardService,
  ) {
    super(http);
  }

  async memberCommentCreate(data): Promise<CreateCommentResponse> {
    return this.post('comments', data);
  }

  async memberCommentLatest(): Promise<CommentLatestResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/comments`);

    url.searchParams.append('filters[is_private][$eq]', 'false');
    url.searchParams.append('pagination[page]', '1');
    url.searchParams.append('pagination[pageSize]', '8');
    url.searchParams.append('sort', 'createdAt:desc');
    url.searchParams.append('fields[1]', 'content');
    url.searchParams.append('fields[2]', 'createdAt');

    return await this.get(url.toString());
  }

  async memberCommentGetList(board_document_id): Promise<MemberCommentListResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/comments`);
    url.searchParams.append('filters[board_document_id][$eq]', board_document_id);
    url.searchParams.append('filters[comment_depth]', '1');
    url.searchParams.append('pagination[pageSize]', '20');
    url.searchParams.append('sort', 'createdAt:desc');

    return await this.get(url.toString());
  }

  async memberCommentPersonalList(
    query: any,
    member_idx: number,
  ): Promise<MemberCommentListResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/comments`);

    url.searchParams.append('pagination[page]', query.page.toString());
    url.searchParams.append('pagination[pageSize]', query.read_count.toString());
    url.searchParams.append('filters[author_idx][$eq]', member_idx.toString());
    url.searchParams.append('sort', 'createdAt:desc');
    url.searchParams.append('populate', 'member_board');

    // Dynamic search
    if (query.search_key && query.search_word) {
      if (query.search_key === 'title') {
        // Search inside the related member_board's title
        url.searchParams.append(`filters[member_board][title][$contains]`, query.search_word);
      } else {
        // Normal search inside comment fields
        url.searchParams.append(`filters[${query.search_key}][$contains]`, query.search_word);
      }
    }
    // // Dynamic search
    // if (query.search_key && query.search_word) {
    //   url.searchParams.append(`filters[${query.search_key}][$contains]`, query.search_word);
    // }
    const data = await this.get(url.toString());
    return data;
  }

  async memberCommentGetReply(comment_document_id: string): Promise<MemberComment[]> {
    const url = new URL(`${process.env.STRAPI_URL}/api/comments`);
    url.searchParams.append('filters[parent_comment_document_id][$eq]', comment_document_id);
    url.searchParams.append('sort', 'createdAt:desc');
    const data = await this.get(url.toString());
    return data.data;
  }

  async memberCommentUpdate(
    comment_document_id: string,
    body: UpdateCommentDto,
    member_idx: number,
  ): Promise<UpdatedCommentResponse> {
    const url = `${process.env.STRAPI_URL}/api/comments/${comment_document_id}`;
    try {
      const response = await this.http.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
      });

      const board = response.data?.data;
      if (!board) {
        throw new Error('Board not found');
      }

      const owner_id = board.attributes?.member_idx;
      if (owner_id === member_idx) {
        throw new Error('USER_CANNOT_UPDATE_OTHER_COMMENTS');
      }
      return this.put(url, body);
    } catch (error: any) {
      console.error('Error in Update:', error.response?.data || error.message);
      throw new Error('Strapi update failed');
    }
  }

  async memberCommentDelete(comment_document_id: string, member_idx: number) {
    const url = `${process.env.STRAPI_URL}/api/comments/${comment_document_id}`;
    const response = await this.http.axiosRef.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
      validateStatus: () => true,
    });

    if (response.status === 404) {
      throw new Error('Comment not found');
    }
    const board = response.data?.data;
    const owner_id = board.author_idx;
    if (Number(owner_id) !== Number(member_idx)) {
      throw new Error('USER_CANNOT_DELETE_OTHER_COMMENT');
    }
    await this.delete(`comments/${comment_document_id}`);
    await this.memberBoardService.decrementCommentCount(board.documentId);
    return { message: 'Comment deleted successfully' };
  }

  async memberCommentBulkDelete(comment_document_ids: string[], member_idx: number) {
    const results: { comment_id: string; status: string }[] = [];

    for (const comment_id of comment_document_ids) {
      const url = `${process.env.STRAPI_URL}/api/comments/${comment_id}`;
      const response = await this.http.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
        validateStatus: () => true,
      });

      if (response.status === 404) {
        results.push({ comment_id, status: 'not_found' });
        continue;
      }

      const comment = response.data?.data;
      const owner_id = comment?.author_idx;

      if (Number(owner_id) !== member_idx) {
        results.push({ comment_id, status: 'forbidden' });
        continue;
      }
      // Delete comment
      await this.delete(`comments/${comment_id}`);
      await this.memberBoardService.decrementCommentCount(comment.board_document_id);

      results.push({ comment_id, status: 'deleted' });
    }
    return results;
  }

  async memberCommentDeleteAll(member_idx: number) {
    const url = `${process.env.STRAPI_URL}/api/comments?filters[author_idx][$eq]=${member_idx}&pagination[pageSize]=1000`;

    const response = await this.http.axiosRef.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch comments');
    }

    const comments = response.data?.data || [];
    const results: { comment_id: string; status: string }[] = [];

    for (const comment of comments) {
      await this.delete(`comments/${comment.documentId}`);
      await this.memberBoardService.decrementCommentCount(comment.board_document_id);
      results.push({ comment_id: comment.documentId, status: 'deleted' });
    }
    return results;
  }

  async getCommentCount(board_document_id: string): Promise<any> {
    const data = await this.post('comments/get-count', { board_document_id });
    return data.count ? data.count : 0;
  }

  async getCommentCountByIdx(member_idx: number): Promise<any> {
    const data = await this.post('comments/get-member-count', { member_idx });
    return data.count ? data.count : 0;
  }
}
