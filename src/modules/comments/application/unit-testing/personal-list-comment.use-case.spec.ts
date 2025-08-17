import { Test, TestingModule } from '@nestjs/testing';

import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { BaseResponse, UserDto } from '@betting-ground/prisma-lib';

describe('CommentsController - personalComments', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            getPersonalComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should return personal comments list with BaseResponse format', async () => {
    const mockQuery = { page: 1, pageSize: 10 };
    const mockUser: UserDto = { member_idx: 20 } as any;

    const mockData = {
      data: [
        {
          id: 1,
          documentId: 'doc1',
          content: 'My personal comment',
          my_reaction: 'none',
          formatted_created_time_date: '2025-08-13',
          replies: [],
        },
      ],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } },
    };

    (service.getPersonalComments as jest.Mock).mockResolvedValue(mockData);

    const result: BaseResponse<any> = await controller.personalComments(mockQuery, mockUser);

    expect(service.getPersonalComments).toHaveBeenCalledWith(mockQuery, 20);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Fetch Comments List');
    expect(result.data).toEqual(mockData);
  });
});
