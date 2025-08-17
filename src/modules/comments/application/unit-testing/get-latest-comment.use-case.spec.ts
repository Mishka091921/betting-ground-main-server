import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { UserDto, BaseResponse } from '@betting-ground/prisma-lib';
describe('CommentsController - getLatestComments', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            getCommentsLatest: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should return latest comments list in BaseResponse format', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          documentId: 'doc1',
          content: 'Latest comment',
          createdAt: '2025-08-13T10:00:00Z',
          formatted_created_time_date: '2025-08-13',
        },
      ],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } },
    };

    (service.getCommentsLatest as jest.Mock).mockResolvedValue(mockData);

    const result: BaseResponse<any> = await controller.getLatestComments();

    expect(service.getCommentsLatest).toHaveBeenCalled();
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Fetch Latest Comments');
    expect(result.data).toEqual(mockData);
  });
});
