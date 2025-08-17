import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { BaseResponse, UserDto } from '@betting-ground/prisma-lib';

describe('CommentsController - deleteComment', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            deleteComment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should call service with correct comment_document_id and member_idx, and return success response', async () => {
    const mockCommentId = 'doc123';
    const mockUser: UserDto = { member_idx: 42 } as any;

    (service.deleteComment as jest.Mock).mockResolvedValue(undefined);

    const result: BaseResponse<any> = await controller.deleteComment(mockCommentId, mockUser);

    expect(service.deleteComment).toHaveBeenCalledWith('doc123', 42);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Deleted A Comment');
    expect(result.data).toEqual([]);
  });
});
