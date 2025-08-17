// get-specific-board.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BoardSpecificUseCase } from '../use-cases/get-specific-board.use-case';
import {StrapiMemberBoardService} from '../../../../strapi-gateway/services/board/strapi-member-board.service'
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';
import { BoardCategory } from '../../domain/enums/board-category.enum';
import { BoardSubCategory } from '../../domain/enums/board-sub-category.enum';
import { PrismaReadService } from '@betting-ground/prisma-lib';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { BoardIncreaseViewsUseCase } from '../use-cases/increment-board-views.use-case';

describe('BoardSpecificUseCase', () => {
  let useCase: BoardSpecificUseCase;
  let strapiService: StrapiMemberBoardService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BoardSpecificUseCase,
      {
        provide: StrapiMemberBoardService,
        useValue: {
          getSpecificMemberBoard: jest.fn(),
          getPreviousPost: jest.fn(),
          getNextPost: jest.fn(),
        },
      },
      {
        provide: PrismaReadService,
        useValue: {
          member: {
            findMany: jest.fn().mockResolvedValue([
              { id: 'mock-author-id', nick_name: 'mock-nick', level: 1 }
            ]),
            findFirst: jest.fn().mockResolvedValue(
              { id: 'mock-author-id', nick_name: 'mock-nick', level: 1 }
            ),
          },
        },
      },
      {
        provide: StrapiMemberReactionService,
        useValue: {
          getReactionForBoard: jest.fn(),
          getMyReaction: jest.fn(),
        },
      },
      {
        provide: StrapiCommentsService,
        useValue: {
          getCommentsForBoard: jest.fn(),
          getCommentCount: jest.fn(),
        },
      },
      {
        provide: BoardIncreaseViewsUseCase,
        useValue: {
          execute: jest.fn(),
        },
      },
    ],
  }).compile();

  useCase = module.get<BoardSpecificUseCase>(BoardSpecificUseCase);
  strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
});

  it('should return specific board data', async () => {
    const documentId = 'abc-123';
    const member_idx = 2;

    const mockResponse: MemberBoardResponse = {
      data: [
        {
          id: 16,
          documentId: 'abc-123',
          idx: 1,
          member_idx: `member-00${member_idx}`,
          title: 'Test Title',
          content: 'Test Content',
          thumbnail_path: '',
          img_path_list: '',
          link_url: '',
          video_url: '',
          view_count: '100',
          like_count: '10',
          dislike_count: '1',
          tag_list: 'tag1,tag2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          category: BoardCategory.SPORTS_ANALYSIS,
          sub_category: BoardSubCategory.DEFAULT,
          day_date: '2025-08-02',
          pkey: '202508',
          formatted_created_time_date: '2025-07-30 10:00:00',
          author_id:'testing id',
          author_nick_name:'test author nick name',
          my_reaction: 'none',
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 1,
          pageCount: 1,
          total: 1,
        },
      },
    };

    (strapiService.getSpecificMemberBoard as jest.Mock).mockResolvedValue(mockResponse);
    (strapiService.getPreviousPost as jest.Mock).mockResolvedValue({ data: [] });
    (strapiService.getNextPost as jest.Mock).mockResolvedValue({ data: [] });

    // Mock getMyReaction to return an object with a data property
    const reactionService = (useCase as any).memberReactionStrapi;
    if (reactionService && reactionService.getMyReaction) {
      (reactionService.getMyReaction as jest.Mock).mockResolvedValue({ data: [] });
    }

    const result = await useCase.execute(documentId,member_idx);
    expect(result).toEqual(mockResponse);
    expect(strapiService.getSpecificMemberBoard).toHaveBeenCalledWith(documentId);
  });
});
