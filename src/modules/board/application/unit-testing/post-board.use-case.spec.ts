import { Test, TestingModule } from '@nestjs/testing';
import { StrapiMemberBoardService } from '../../../../strapi-gateway/services/board/strapi-member-board.service';
import { BoardPostUseCase } from '../use-cases/create-board.use-case';
import { MediaExtractionService } from 'src/shared/media-extraction/media-extraction.service';
import { S3Service } from 'src/shared/s3/s3.service';

describe('BoardPostUseCase', () => {
  let useCase: BoardPostUseCase;
  let strapiService: StrapiMemberBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardPostUseCase,
       {
          provide: MediaExtractionService,
          useValue: {
            extractMediaFromHtml: jest.fn().mockReturnValue({
              mediaList: [],
              html_payload: 'test',
              linkList: [],
            }),
          },
        },
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: StrapiMemberBoardService,
          useValue: {
            postMemberBoard: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<BoardPostUseCase>(BoardPostUseCase);
    strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
  });

  it('should create a new board post and return data with metadata', async () => {
    const mockDto = {
      category: 'General',
      sub_category: 'Sub',
      thumbnail: '',
      content:"test",
      title: 'Sub',
    };

    const mockUser = {
      id: 'user-123',
      member_idx: 42,
      nick_name: 'Joshyy',
    };

    const mockFiles = []; 
    
    const mockResponse = {
      data: [
        {
          id: 16,
          documentId: 'abc-123',
          idx: 1,
          member_idx: 42,
          title: 'Sub',
          content: 'test',
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
          author_id: 'user-123',
          author_nick_name: 'Joshyy',
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

    (strapiService.postMemberBoard as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await useCase.execute(mockDto as any, mockUser as any, mockFiles as any);

    expect(strapiService.postMemberBoard).toHaveBeenCalledWith(expect.objectContaining({
      category: 'General',
      sub_category: 'Sub',
      member_idx: 42,
      title: 'Sub',
      content:"test"
    }));

    expect(result).toEqual(mockResponse);
  });
});
