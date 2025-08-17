import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../infrastructure/comments.controller';
import { CommentsService } from '../../infrastructure/comments.service';
import { BaseResponse } from '@betting-ground/prisma-lib';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { UserDto } from '@betting-ground/prisma-lib';

describe('CommentsController - updateComment', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            updateComment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should return updated comment in BaseResponse format', async () => {
    const mockCommentId = 'comment123';
    const mockBody: UpdateCommentDto = {
      content: 'Updated comment content',
      is_private: false,
    } as any;

    const mockUser: UserDto = { member_idx: 42 } as any;

    const mockResponse = {
      data: {
        id: 1,
        documentId: 'comment123',
        content: 'Updated comment content',
        author_id: 'user1',
        author_idx: '42',
        comment_depth: 0,
        is_deleted: 0,
        createdAt: '2025-08-13T10:00:00Z',
        updatedAt: '2025-08-13T11:00:00Z',
        publishedAt: '2025-08-13T10:00:00Z',
        is_private: false,
        board_document_id: 'board123',
        author_nick_name: 'John Doe',
        parent_comment_document_id: null,
      },
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 1,
        },
      },
    };

    (service.updateComment as jest.Mock).mockResolvedValue(mockResponse);

    const result: BaseResponse<any> = await controller.updateComment(
      mockCommentId,
      mockBody,
      mockUser,
    );

    expect(service.updateComment).toHaveBeenCalledWith(mockCommentId, mockBody, 42);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully Updated A Comment');
    expect(result.data).toEqual(mockResponse);
  });
});
