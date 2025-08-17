import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { BaseResponse, UserDto } from '@betting-ground/prisma-lib';

describe('CommentsController - deleteBulkComment', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            deleteBulkComment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should call service with correct IDs and member_idx, and return success response', async () => {
    const mockCommentIds = ['c1', 'c2', 'c3'];
    const mockUser: UserDto = { member_idx: 99 } as any;

    (service.deleteBulkComment as jest.Mock).mockResolvedValue(undefined);

    const result: BaseResponse<any> = await controller.deleteBulkComment(mockCommentIds, mockUser);

    expect(service.deleteBulkComment).toHaveBeenCalledWith(mockCommentIds, 99);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Deleted Comments');
    expect(result.data).toEqual([]);
  });
});
