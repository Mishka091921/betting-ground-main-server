// board-patch.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BoardPatchUseCase } from '../use-cases/patch-board.use-case';
import { StrapiMemberBoardService } from '../../../../strapi-gateway/services/board/strapi-member-board.service';

describe('BoardPatchUseCase', () => {
  let useCase: BoardPatchUseCase;
  let strapiService: StrapiMemberBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardPatchUseCase,
        {
          provide: StrapiMemberBoardService,
          useValue: {
            updateBoardInStrapi: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<BoardPatchUseCase>(BoardPatchUseCase);
    strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
  });

  it('should update a board and return the updated response', async () => {
    const documentId = 'abc-123';
    const updatePayload = {
      title: 'CHANGE TITLE',
    };
    const member_idx = 2

    const mockResponse = {
    data: [
        {
          id: 16,
          documentId: 'abc-123',
          idx: 1,
          member_idx: 'member-001',
          title: 'CHANGE TITLE',
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
          category: 'General',
          sub_category: 'Sub',
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

    (strapiService.updateBoardInStrapi as jest.Mock).mockResolvedValue(mockResponse);

    const result = await useCase.execute(documentId, updatePayload,member_idx);

    expect(result).toEqual(mockResponse);
    expect(strapiService.updateBoardInStrapi).toHaveBeenCalledWith(documentId, updatePayload,member_idx);
  });
});
