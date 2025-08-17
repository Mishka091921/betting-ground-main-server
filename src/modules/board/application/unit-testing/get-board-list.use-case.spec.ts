import { Test, TestingModule } from '@nestjs/testing';
import {StrapiMemberBoardService} from '../../../../strapi-gateway/services/board/strapi-member-board.service'
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';
import { MemberBoard } from '../../domain/interfaces/board-interface';
import { BoardListUseCase } from '../use-cases/get-board-list.use-case';
import { BoardCategory } from '../../domain/enums/board-category.enum';
import { BoardSubCategory } from '../../domain/enums/board-sub-category.enum';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { PrismaReadService } from '@betting-ground/prisma-lib';
describe('BoardListUseCase', () => {
  let useCase: BoardListUseCase;
  let strapiService: StrapiMemberBoardService;
  let prismaReadService: PrismaReadService;
  let strapiCommentsService: StrapiCommentsService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BoardListUseCase,
      {
        provide: StrapiMemberBoardService,
        useValue: {
          getMemberBoard: jest.fn(),
          getAdminBoard: jest.fn(),
        },
      },
      {
        provide: StrapiCommentsService,
        useValue: {
          getCommentsForBoard: jest.fn(),
          getLatestComment: jest.fn(),
          getCommentCount: jest.fn(), // <-- mock this too
        },
      },
      {
        provide: PrismaReadService,
        useValue: {
          member: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
          },
        },
      },
    ],
  }).compile();

  useCase = module.get<BoardListUseCase>(BoardListUseCase);
  strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
  prismaReadService = module.get<PrismaReadService>(PrismaReadService);
  strapiCommentsService = module.get<StrapiCommentsService>(StrapiCommentsService);
  });

it('should return a list of member boards', async () => {

  const mockBoard: MemberBoard = { 

      id: 1,
      documentId: 'doc-001',
      idx: 1,
      member_idx: '1000',
      title: 'Hello World',
      content: 'This is the content',
      thumbnail_path: '/thumbnails/hello.jpg',
      img_path_list: '/images/hello.jpg',
      link_url: 'https://example.com',
      video_url: 'https://youtube.com/watch?v=abc',
      view_count: '10',
      like_count: '2',
      dislike_count: '0',
      tag_list: 'news,sports',
      createdAt: '2025-07-30T10:00:00.000Z',
      updatedAt: '2025-07-30T10:00:00.000Z',
      publishedAt: '2025-07-30T10:00:00.000Z',
      category: BoardCategory.SPORTS_INFO,
      sub_category: BoardSubCategory.SOCCER,
      day_date: '2025-08-02',
      pkey: '202508',
      formatted_created_time_date:'2025-07-30 10:00:00',
      author_id: 'joshyy',
      author_nick_name: 'joshyy',
      my_reaction: 'none' // 'like', 'dislike', 'none'
  };
  const mockResponse: MemberBoardResponse = { data: [mockBoard], meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } } };

  (strapiService.getMemberBoard as jest.Mock).mockResolvedValue(mockResponse);
  (prismaReadService.member.findMany as jest.Mock).mockResolvedValue([
    { idx: 1, level: 'gold', id: '1000', nick_name: 'joshyy' },
  ]);
  (strapiCommentsService.getCommentCount as jest.Mock).mockResolvedValue(0);

  const query = { category: BoardCategory.SPORTS_INFO, sub_category: BoardSubCategory.SOCCER, orderby_type: 'desc', orderby_key: 'create_dt', search_key: 'title', search_word: 'update', read_count: 10, page: 1 };

  const result = await useCase.execute(query);

  expect(strapiService.getMemberBoard).toHaveBeenCalledWith(query);
  expect(result).toEqual(mockResponse);
});
});
