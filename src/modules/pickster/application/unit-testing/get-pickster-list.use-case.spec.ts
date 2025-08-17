// get-pickster-list.usecase.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PicksterListUseCase } from '../use-cases/get-pickster-list.use-case';
import { PicksterReturn, PicksterInfoResponse } from '../../domain/interface/pickster.interface';
import { PicksterRepository } from '../../domain/pickster.repository';

describe('PicksterListUseCase', () => {
  let useCase: PicksterListUseCase;
  let picksterRepo: jest.Mocked<PicksterRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PicksterListUseCase,
        {
          provide: PicksterRepository,
          useValue: {
            findMany: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<PicksterListUseCase>(PicksterListUseCase);
    picksterRepo = module.get(PicksterRepository);
  });

  it('should return paginated pickster list', async () => {
    const mockData: PicksterInfoResponse[] = [
      {
        member_idx: '1',
        alias_name: 'JohnDoe',
        thumbnail_path: null,
        intro: 'Test intro',
        update_dt: '2025-08-14T00:00:00Z',
        created_dt: '2025-08-01T00:00:00Z',
        view_count: 10,
      },
    ];

    picksterRepo.findMany.mockResolvedValue(mockData);
    picksterRepo.count.mockResolvedValue(1);

    const result: PicksterReturn = await useCase.execute({ read_count: 9 });

    expect(result.data).toEqual(mockData);
    expect(result.meta.pagination).toEqual({
      page: 1,
      page_size: 9,
      pageCount: 1,
      total: 1,
    });

    expect(picksterRepo.findMany).toHaveBeenCalledWith(1, 9);
    expect(picksterRepo.count).toHaveBeenCalled();
  });
});
