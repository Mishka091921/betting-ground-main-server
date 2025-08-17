import { BoardDeleteBulkUseCase } from '../use-cases/delete-bulk-board.use-case';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';

describe('BoardDeleteBulkUseCase', () => {
  let useCase: BoardDeleteBulkUseCase;
  let memberBoardStrapi: jest.Mocked<StrapiMemberBoardService>;

  beforeEach(() => {
    memberBoardStrapi = {
      deleteBulkBoards: jest.fn(),
    } as any;
    useCase = new BoardDeleteBulkUseCase(memberBoardStrapi);
  });

  it('should call deleteBulkBoards with correct parameters', async () => {
    const boardIds = ['id1', 'id2'];
    const memberIdx = 123;
    memberBoardStrapi.deleteBulkBoards.mockResolvedValue('deleted');

    const result = await useCase.execute(boardIds, memberIdx);

    expect(memberBoardStrapi.deleteBulkBoards).toHaveBeenCalledWith(boardIds, memberIdx);
    expect(result).toBe('deleted');
  });

  it('should return the result from deleteBulkBoards', async () => {
    const expectedResult = { success: true };
    memberBoardStrapi.deleteBulkBoards.mockResolvedValue(expectedResult);

    const result = await useCase.execute(['id3'], 456);

    expect(result).toEqual(expectedResult);
  });

  it('should throw if deleteBulkBoards throws', async () => {
    memberBoardStrapi.deleteBulkBoards.mockRejectedValue(new Error('fail'));

    await expect(useCase.execute(['id4'], 789)).rejects.toThrow('fail');
  });

  it('should handle empty board_document_ids array', async () => {
    memberBoardStrapi.deleteBulkBoards.mockResolvedValue('empty');

    const result = await useCase.execute([], 101);

    expect(memberBoardStrapi.deleteBulkBoards).toHaveBeenCalledWith([], 101);
    expect(result).toBe('empty');
  });
});