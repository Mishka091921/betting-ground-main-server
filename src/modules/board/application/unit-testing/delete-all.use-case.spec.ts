import { Test, TestingModule } from '@nestjs/testing';
import { StrapiMemberBoardService } from '../../../../strapi-gateway/services/board/strapi-member-board.service';
import { BoardDeleteAllUseCase } from '../use-cases/delete-all-board.use-case';

describe('BoardDeleteAllUseCase', () => {
  let useCase: BoardDeleteAllUseCase;
  let strapiService: StrapiMemberBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardDeleteAllUseCase,
        {
          provide: StrapiMemberBoardService,
          useValue: {
            deleteAllBoards: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<BoardDeleteAllUseCase>(BoardDeleteAllUseCase);
    strapiService = module.get<StrapiMemberBoardService>(StrapiMemberBoardService);
  });

  it('should delete all boards for a member and return confirmation', async () => {
    const member_idx = 2;
    const mockResponse = {
      success: true,
      message: 'All boards deleted successfully',
    };

    (strapiService.deleteAllBoards as jest.Mock).mockResolvedValue(mockResponse);

    const result = await useCase.execute(member_idx);

    expect(result).toEqual(mockResponse);
    expect(strapiService.deleteAllBoards).toHaveBeenCalledWith(member_idx);
  });

  it('should handle errors thrown by the service', async () => {
    const member_idx = 3;
    const error = new Error('Failed to delete boards');
    (strapiService.deleteAllBoards as jest.Mock).mockRejectedValue(error);

    await expect(useCase.execute(member_idx)).rejects.toThrow('Failed to delete boards');
    expect(strapiService.deleteAllBoards).toHaveBeenCalledWith(member_idx);
  });
});