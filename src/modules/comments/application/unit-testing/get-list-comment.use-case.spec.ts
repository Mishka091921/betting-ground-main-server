import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { UserDto, BaseResponse } from '@betting-ground/prisma-lib';
import { GetCommentDto } from '../dto/get-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            getCommentsList: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should return comments list with BaseResponse format', async () => {
    const mockQuery: GetCommentDto = { board_document_id: 'board123' } as any;
    const mockUser: UserDto = { member_idx: 10 } as any;
    const mockData = {
      data: [
        {
          id: 1,
          documentId: 'doc1',
          content: 'Test comment',
          my_reaction: 'none',
          formatted_created_time_date: '2025-08-13',
          replies: [],
        },
      ],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } },
    };

    (service.getCommentsList as jest.Mock).mockResolvedValue(mockData);

    const result: BaseResponse<any> = await controller.getComments(mockQuery, mockUser);

    expect(service.getCommentsList).toHaveBeenCalledWith('board123', 10);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Fetch Comments List');
    expect(result.data).toEqual(mockData);
  });
});
