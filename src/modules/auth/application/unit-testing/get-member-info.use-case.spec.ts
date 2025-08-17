import { GetMemberInfoUseCase } from '../use-cases/member/get-member-info.use-case';
import { UserRepository } from '../../domain/user.repository';

describe('GetMemberInfoUseCase', () => {
let useCase: GetMemberInfoUseCase;
let mockUserRepo: jest.Mocked<UserRepository>;
let mockMemberCommentStrapi: any;
let mockMemberBoardStrapi: any;

beforeEach(() => {
  mockUserRepo = {
    getMemberInfo: jest.fn(),
  } as any;

  mockMemberCommentStrapi = {
    getCommentCountByIdx: jest.fn().mockResolvedValue(0),
  };
  mockMemberBoardStrapi = {
    getMemberPostCount: jest.fn().mockResolvedValue(0),
  };

  useCase = new GetMemberInfoUseCase(
    mockUserRepo,
    mockMemberCommentStrapi,
    mockMemberBoardStrapi
  );
});

  it('should return member info with duration_membership', async () => {
    const mockUserIdx = 5;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - 10);
    const mockRepoResponse = {
      idx: 1,
      id: 'johndoe',
      nick_name: 'John',
      rule_type: 'regular' as const,
      point: 1500,
      created_at: createdAt.toISOString(),
      level: 1,
    };

    const expectedUseCaseResult = {
      member_idx:1,
      id: 'johndoe',
      nick_name: 'John',
      point: 1500,
      level: 1,
      type: 'regular',
      duration_membership: 10,
      comment_count: 0,
      post_count: 0,
    };
    mockUserRepo.getMemberInfo.mockResolvedValueOnce(mockRepoResponse);

    const result = await useCase.execute(mockUserIdx);

    expect(mockUserRepo.getMemberInfo).toHaveBeenCalledWith(mockUserIdx);
    expect(result).toEqual(expectedUseCaseResult);
      });
});


