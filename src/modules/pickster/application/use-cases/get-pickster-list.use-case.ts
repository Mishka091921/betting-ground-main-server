import { Injectable } from '@nestjs/common';
import { PicksterRepository } from '../../domain/pickster.repository';
import { PicksterInfoResponse, PicksterReturn } from '../../domain/interface/pickster.interface';

@Injectable()
export class PicksterListUseCase {
  constructor(
    private readonly picksterRepo: PicksterRepository,
  ) {}

  async execute(query): Promise<PicksterReturn> {
    const page = 1;
    const page_size = Number(query.read_count) || 9;

    const [data, total] = await Promise.all([
      this.picksterRepo.findMany(page, page_size),
      this.picksterRepo.count(),
    ]);


    return {
      data,
      meta: {
        pagination: {
          page,
          page_size,
          pageCount: Math.ceil(total / page_size),
          total,
        },
      },
    };
  }
}
