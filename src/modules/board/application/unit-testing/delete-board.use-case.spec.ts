import { Test, TestingModule } from '@nestjs/testing';
import { StrapiMemberBoardService } from '../../../../strapi-gateway/services/board/strapi-member-board.service';
import { BoardDeleteUseCase } from '../use-cases/delete-board.use-case';

describe('BoardDeleteUseCase', () => {
  let useCase: BoardDeleteUseCase;
  let strapiService: StrapiMemberBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardDeleteUseCase,
        {
          provide: StrapiMemberBoardService,
          useValue: {
            deleteBoard: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<BoardDeleteUseCase>(BoardDeleteUseCase);
    strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
  });

  it('should delete the board by ID and return confirmation', async () => {
    const board_post_id = 'abc-123';
    const member_idx = 2

    const mockResponse = {
      success: true,
      message: 'Board deleted successfully',
    };

    (strapiService.deleteBoard as jest.Mock).mockResolvedValue(mockResponse);

    const result = await useCase.execute(board_post_id,member_idx);

    expect(result).toEqual(mockResponse);
    expect(strapiService.deleteBoard).toHaveBeenCalledWith(board_post_id,member_idx);
  });
});
