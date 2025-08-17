// strapi-gateway.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BoardQueryDto } from 'src/modules/board/application/dto/get-board-list.dto';
import { BoardCategory } from 'src/modules/board/domain/enums/board-category.enum';
import {
  CreateMemberBoardResponse,
  MemberBoardResponse,
  MemberBoardSpecificResponse,
  UpdateViewCountResponse,
} from 'src/modules/board/domain/interfaces/board-interface';
import { StrapiBaseService } from '../strapi-base.service';

@Injectable()
export class StrapiMemberBoardService extends StrapiBaseService {
  constructor(http: HttpService) {
    super(http);
  }

  async getMemberBoard(query: BoardQueryDto): Promise<MemberBoardResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);

    // Pagination
    url.searchParams.append('pagination[page]', query.page.toString());
    url.searchParams.append('pagination[pageSize]', query.read_count.toString());

    if (query.category && query.category !== 'ALL_BOARD') {
      url.searchParams.append('filters[category][$eq]', query.category);
    }

    if (query.sub_category && query.sub_category !== 'ALL') {
      url.searchParams.append('filters[sub_category][$eq]', query.sub_category);
    }

    // Dynamic search
    if (query.search_key && query.search_word) {
      url.searchParams.append(`filters[${query.search_key}][$contains]`, query.search_word);
    }
    if (query.category == BoardCategory.EVENT) {
      url.searchParams.append('filters[is_admin][$eq]', 'true');
    } else {
      url.searchParams.append('filters[is_admin][$eq]', 'false');
    }

    if (query.event_filter && query.event_filter != 'ALL') {
      url.searchParams.append('filters[is_progress_event][$eq]', query.event_filter);
    }

    const sortFields: string[] = [];

    if (query.orderby_key && query.orderby_type) {
      sortFields.push(`${query.orderby_key}:${query.orderby_type}`);
    }

    url.searchParams.append('sort', sortFields.join(','));

    const data = await this.get(url.toString());
    return data as MemberBoardResponse;
  }

  async getPersonalBoard(query: any, member_idx: any): Promise<MemberBoardResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);

    // Pagination
    url.searchParams.append('pagination[page]', query.page.toString());
    url.searchParams.append('pagination[pageSize]', query.read_count.toString());
    url.searchParams.append('filters[member_idx][$eq]', member_idx.toString());

    if (query.category && query.category == BoardCategory.PANEL) {
      url.searchParams.append('filters[category][$eq]', query.category);
      url.searchParams.append('filters[member_idx][$eq]', query.member_idx);
    }

    // Dynamic search
    if (query.search_key && query.search_word) {
      url.searchParams.append(`filters[${query.search_key}][$contains]`, query.search_word);
    }
    // Add is_admin = false filter
    url.searchParams.append('filters[is_admin][$eq]', 'false');

    const sortFields: string[] = [];

    url.searchParams.append('sort', sortFields.join(','));

    const data = await this.get(url.toString());
    return data as MemberBoardResponse;
  }

  async getPersonalBoardViews(member_idx: number): Promise<any> {
    const data = await this.post('member-boards/member-view-count', { member_idx });
    return data.total_views;
  }

  async getAdminBoard(query: BoardQueryDto): Promise<MemberBoardResponse> {
    const isAllBoard = query.category === BoardCategory.ALL_BOARD;

    if (isAllBoard) {
      // List of categories to fetch (excluding EVENT and ALL_BOARD itself)
      const categories: BoardCategory[] = [
        BoardCategory.DEFAULT,
        BoardCategory.NOTICE,
        BoardCategory.PANEL,
        BoardCategory.SPORTS_ANALYSIS,
        BoardCategory.SPORTS_INFO,
        BoardCategory.FREE_BOARD,
        BoardCategory.HUMOR_PHOTO,
        BoardCategory.EYE_CLEANSING,
      ];

      const results = await Promise.all(
        categories.map(async (cat) => {
          const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);
          url.searchParams.append('pagination[page]', '1');
          url.searchParams.append('pagination[pageSize]', '1');
          url.searchParams.append('filters[category][$eq]', cat);
          url.searchParams.append('filters[is_admin][$eq]', 'true');
          url.searchParams.append('sort', 'createdAt:desc');

          const data = await this.get(url.toString());
          return data.data?.[0] || null;
        }),
      );

      // Return merged results
      const filteredResults = results.filter(Boolean);
      return {
        data: filteredResults,
        meta: {
          pagination: {
            page: 1,
            pageSize: 1,
            pageCount: filteredResults.length,
            total: filteredResults.length,
          },
        },
      } as MemberBoardResponse;
    }

    // Normal mode for non-ALL_BOARD
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);
    url.searchParams.append('pagination[page]', '1');
    url.searchParams.append('pagination[pageSize]', '10');

    if (query.category) {
      url.searchParams.append('filters[category][$eq]', query.category);
    }

    // Exclude EVENT category
    url.searchParams.append('filters[category][$ne]', BoardCategory.EVENT);
    url.searchParams.append('filters[is_admin][$eq]', 'true');
    url.searchParams.append('sort', 'createdAt:desc');

    const data = await this.get(url.toString());
    return data as MemberBoardResponse;
  }

  async getLatestMemberBoard(): Promise<MemberBoardResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);

    // Hardcoded Pagination: Get first page with 8 items
    url.searchParams.append('pagination[page]', '1');
    url.searchParams.append('pagination[pageSize]', '8');
    url.searchParams.append('filters[is_admin][$eq]', 'false');

    url.searchParams.append('sort', 'createdAt:desc');

    // Select only required fields
    url.searchParams.append('fields[1]', 'title');
    url.searchParams.append('fields[2]', 'createdAt');
    url.searchParams.append('fields[3]', 'documentId');

    const data = await this.get(url.toString());
    return data as MemberBoardResponse;
  }

  async getSpecificMemberBoard(board_document_id: string): Promise<MemberBoardSpecificResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);
    url.searchParams.append('filters[documentId][$eq]', board_document_id.toString());
    const data = await this.get(url.toString());
    return data as MemberBoardSpecificResponse;
  }

  async getPreviousPost(createdAt: string, category: string): Promise<MemberBoardSpecificResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);
    url.searchParams.append('filters[category][$eq]', category);
    url.searchParams.append('filters[createdAt][$lt]', createdAt);
    url.searchParams.append('sort', 'createdAt:desc');
    url.searchParams.append('pagination[limit]', '1');
    const data = await this.get(url.toString());
    return data as MemberBoardSpecificResponse;
  }

  async getNextPost(createdAt: string, category: string): Promise<MemberBoardSpecificResponse> {
    const url = new URL(`${process.env.STRAPI_URL}/api/member-boards`);
    url.searchParams.append('filters[category][$eq]', category);
    url.searchParams.append('filters[createdAt][$gt]', createdAt);
    url.searchParams.append('sort', 'createdAt:asc');
    url.searchParams.append('pagination[limit]', '1');
    const data = await this.get(url.toString());
    return data as MemberBoardSpecificResponse;
  }

  async postMemberBoard(data): Promise<CreateMemberBoardResponse> {
    return this.post('member-boards', data);
  }

  async updateBoardInStrapi(
    board_document_id: string,
    body: any,
    member_idx: number,
  ): Promise<MemberBoardResponse> {
    const url = `${process.env.STRAPI_URL}/api/member-boards/${board_document_id}`;

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
        throw new Error('USER_CANNOT_UPDATE_OTHER_BOARDS');
      }

      return this.put(url, body);
    } catch (error: any) {
      console.error('Error in deleteBoard:', error.response?.data || error.message);
      throw new Error('Strapi deleteBoard failed');
    }
  }

  async incrementViews(board_document_id: string): Promise<UpdateViewCountResponse> {
    const url = `member-boards/${board_document_id}/increment-view`;
    return this.updateField(url);
  }

  async getMemberPostCount(member_idx: number): Promise<any> {
    const data = await this.post('member-boards/member-post-count', { member_idx });
    return data.count ? data.count : 0;
  }

  async incrementBoardCommentCount(board_document_id: string): Promise<any> {
    const data = await this.post('member-boards/member-increment-comment', { board_document_id });
    return data;
  }

  async decrementCommentCount(board_document_id: string): Promise<any> {
    const data = await this.post('member-boards/member-decrement-comment', { board_document_id });
    return data;
  }

  async deleteBoard(board_document_id: string, member_idx: number): Promise<MemberBoardResponse> {
    const url = `${process.env.STRAPI_URL}/api/member-boards/${board_document_id}`;

    try {
      const response = await this.http.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
      });

      const board = response.data?.data;
      if (!board) {
        throw new Error('BOARD_NOT_FOUND');
      }

      const owner_id = board.member_idx;

      if (Number(owner_id) !== member_idx) {
        throw new Error('USER_CANNOT_DELETE_OTHER_BOARD');
      }

      return this.delete(`member-boards/${board_document_id}`);
    } catch (error: any) {
      console.error('Error in deleteBoard:', error.response?.data || error.message);
      throw new Error('Strapi deleteBoard failed');
    }
  }

  async deleteBulkBoards(board_document_ids: string[], member_idx: number): Promise<any> {
    const results: { board_id: string; status: string }[] = [];

    for (const board_id of board_document_ids) {
      const url = `${process.env.STRAPI_URL}/api/member-boards/${board_id}`;
      const response = await this.http.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
        },
        validateStatus: () => true,
      });

      if (response.status === 404) {
        results.push({ board_id, status: 'not_found' });
        continue;
      }
      const board = response.data?.data;
      const owner_id = board.member_idx;

      if (Number(owner_id) !== Number(member_idx)) {
        results.push({ board_id, status: 'user_cannot_delete_other_board' });
        continue;
      }

      await this.delete(`member-boards/${board_id}`);
      results.push({ board_id, status: 'deleted' });
    }

    return results;
  }

  async deleteAllBoards(member_idx: number): Promise<any> {
    const url = `${process.env.STRAPI_URL}/api/member-boards?filters[member_idx][$eq]=${member_idx}&pagination[pageSize]=1000`;
    const response = await this.http.axiosRef.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch boards');
    }

    const boards = response.data?.data || [];
    const results: { board_id: string; status: string }[] = [];

    for (const board of boards) {
      await this.delete(`member-boards/${board.documentId}`);
    }

    return results;
  }
}
