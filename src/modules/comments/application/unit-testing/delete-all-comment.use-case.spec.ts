import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { BaseResponse, UserDto } from '@betting-ground/prisma-lib';

describe('CommentsController - deleteAllComments', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            deleteAllComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should call service with member_idx and return success response', async () => {
    const mockUser: UserDto = { member_idx: 55 } as any;

    (service.deleteAllComments as jest.Mock).mockResolvedValue(undefined);

    const result: BaseResponse<any> = await controller.deleteAllComments(mockUser);

    expect(service.deleteAllComments).toHaveBeenCalledWith(55);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Deleted All Comments');
    expect(result.data).toEqual([]);
  });
});
