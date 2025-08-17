// get-pickster-info.usecase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PicksterInfoResponse } from '../../domain/interface/pickster.interface';
import { PicksterSpecificUseCase } from '../use-cases/get-pickster-specific.use-case';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { PicksterRepository } from '../../domain/pickster.repository';

describe('PicksterSpecificUseCase', () => {
  let useCase: PicksterSpecificUseCase;
  let picksterRepo: jest.Mocked<PicksterRepository>;
  let strapiMemberBoard: jest.Mocked<StrapiMemberBoardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PicksterSpecificUseCase,
        {
          provide: PicksterRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: StrapiMemberBoardService,
          useValue: {
            getPersonalBoardViews: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<PicksterSpecificUseCase>(PicksterSpecificUseCase);
    picksterRepo = module.get(PicksterRepository);
    strapiMemberBoard = module.get(StrapiMemberBoardService);
  });

  it('should return pickster info with view_count', async () => {
    const mockPickster: PicksterInfoResponse = {
      member_idx: '1',
      alias_name: 'JohnDoe',
      thumbnail_path: null,
      intro: 'Some intro',
      update_dt: '2025-08-14T00:00:00Z',
      created_dt: '2025-08-01T00:00:00Z',
    };

    strapiMemberBoard.getPersonalBoardViews.mockResolvedValue(42);
    picksterRepo.findOne.mockResolvedValue({ ...mockPickster });

    const result = await useCase.execute(1);

    expect(result.view_count).toBe(42);
    expect(result).toMatchObject(mockPickster);
    expect(strapiMemberBoard.getPersonalBoardViews).toHaveBeenCalledWith(1);
    expect(picksterRepo.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw error if pickster not found', async () => {
    strapiMemberBoard.getPersonalBoardViews.mockResolvedValue(0);
    picksterRepo.findOne.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(
      'Pickster with member_idx 999 not found',
    );
  });
});
