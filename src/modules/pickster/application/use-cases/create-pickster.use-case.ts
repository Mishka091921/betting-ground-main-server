import { Injectable } from '@nestjs/common';
import { PrismaReadService, PrismaWriteService } from '@betting-ground/prisma-lib';

@Injectable()
export class PicksterCreateUseCase {
  constructor(
    private readonly prismaReadService: PrismaReadService,
    private readonly prismaWriteService: PrismaWriteService,
  ) {}

  async execute(body: any): Promise<any> {
    const created = await this.prismaWriteService.member_pickster_info.create({
      data: body,
    });

    return created;
  }
}
