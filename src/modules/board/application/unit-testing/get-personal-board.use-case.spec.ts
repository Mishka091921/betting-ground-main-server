import { BoardPersonalUseCase } from '../use-cases/get-personal-board.use-case';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';
import { formatDate } from '@betting-ground/prisma-lib';

describe('BoardPersonalUseCase', () => {
  let useCase: BoardPersonalUseCase;
  let memberBoardStrapi: any;

  beforeEach(() => {
    memberBoardStrapi = {
      getPersonalBoard: jest.fn(),
      getPersonalBoardViews: jest.fn(),
    };

    useCase = new BoardPersonalUseCase(memberBoardStrapi);
  });

  it('should return formatted personal board data', async () => {
    const query = { page: 1 };
    const member_idx = 123;

    const mockData: MemberBoardResponse = {
      data: [
        {
          id: 1,
          documentId: 'doc-1',
          idx: null,
          member_idx: '123',
          title: 'Test Board',
          content: 'Content',
          thumbnail_path: '',
          img_path_list: '',
          link_url: '',
          video_url: '',
          view_count: '10',
          like_count: '2',
          dislike_count: '0',
          tag_list: '',
          createdAt: '2025-08-10T10:00:00Z',
          updatedAt: '',
          publishedAt: '',
          category: '',
          sub_category: '',
          day_date: '',
          pkey: '',
          author_id: 'user1',
          author_nick_name: 'John',
          my_reaction: 'none',
          formatted_created_time_date: '',
        },
      ],
      meta: {
        pagination: { total: 1, page: 1, pageSize: 10, pageCount: 1 },
      },
    };

    memberBoardStrapi.getPersonalBoard.mockResolvedValue(mockData);
    memberBoardStrapi.getPersonalBoardViews.mockResolvedValue(50);

    const result = await useCase.execute(query, member_idx);

    expect(memberBoardStrapi.getPersonalBoard).toHaveBeenCalledWith(query, member_idx);
    expect(memberBoardStrapi.getPersonalBoardViews).toHaveBeenCalledWith(member_idx);

    expect(result.total_count).toBe(1);
    expect(result.total_views).toBe(50);

    expect(result.data[0].formatted_created_time_date).toBe(formatDate(mockData.data[0].createdAt));
  });

  it('should handle empty board data', async () => {
    const query = {};
    const member_idx = 123;

    const mockData: MemberBoardResponse = {
      data: [],
      meta: {
        pagination: { total: 0, page: 1, pageSize: 10, pageCount: 0 },
      },
    };

    memberBoardStrapi.getPersonalBoard.mockResolvedValue(mockData);
    memberBoardStrapi.getPersonalBoardViews.mockResolvedValue(0);

    const result = await useCase.execute(query, member_idx);

    expect(result.total_count).toBe(0);
    expect(result.total_views).toBe(0);
    expect(result.data.length).toBe(0);
  });
});
