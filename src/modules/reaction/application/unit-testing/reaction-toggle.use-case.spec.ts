import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from '../../infrastructure/reaction.controller';
import { ReactionService } from '../../infrastructure/reaction.service';
import { BaseResponse, UserDto } from '@betting-ground/prisma-lib';
import { CreateReactionDTO } from '../dto/create-reaction.dto';

describe('ReactionController', () => {
  let controller: ReactionController;
  let service: ReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [
        {
          provide: ReactionService,
          useValue: {
            toggleReaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReactionController>(ReactionController);
    service = module.get<ReactionService>(ReactionService);
  });

  it('should call service.toggleReaction and return BaseResponse', async () => {
    const mockBody: CreateReactionDTO = {
      parent_document_id: 'doc123',
      reaction: 'like',
      type: 'comment',
    };
    const mockUser: UserDto = { member_idx: 99 } as any;
    const mockResponse = { reaction: 'like' };

    (service.toggleReaction as jest.Mock).mockResolvedValue(mockResponse);

    const result: BaseResponse<{ reaction: string }> = await controller.getMyInfo(
      mockBody,
      mockUser,
    );

    expect(service.toggleReaction).toHaveBeenCalledWith(mockBody, mockUser);
    expect(result.result).toBe(1);
    expect(result.message).toBe('Successfully toggled reaction');
    expect(result.data).toEqual(mockResponse);
  });
});
