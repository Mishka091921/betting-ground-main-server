import { Injectable } from '@nestjs/common';
import { PicksterRepository } from '../domain/pickster.repository';
import { PrismaReadService } from '@betting-ground/prisma-lib';
import { PicksterInfoResponse } from '../domain/interface/pickster.interface';

@Injectable()
export class PicksterRepositoryImpl extends PicksterRepository {
  constructor(private readonly prisma: PrismaReadService) {
    super();
  }

  async findMany(page: number, pageSize: number): Promise<PicksterInfoResponse[]> {
    const data = await this.prisma.member_pickster_info.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_dt: 'desc' },
    });

    return data.map((item) => ({
      member_idx: item.member_idx.toString(),
      alias_name: item.alias_name,
      thumbnail_path: item.thumbnail_path,
      intro: item.intro,
      update_dt: item.update_dt.toISOString(),
      created_dt: item.created_dt.toISOString(),
    }));
  }

  async count(): Promise<number> {
    return this.prisma.member_pickster_info.count();
  }

  async findOne(member_idx: number): Promise<PicksterInfoResponse> {
    const data = await this.prisma.member_pickster_info.findUnique({
      where: { member_idx },
    });

    if (!data) {
      throw new Error(`Pickster with member_idx ${member_idx} not found`);
    }
    return {
      member_idx: data.member_idx.toString(),
      alias_name: data.alias_name,
      thumbnail_path: data.thumbnail_path,
      intro: data.intro,
      update_dt: data.update_dt.toISOString(),
      created_dt: data.created_dt.toISOString(),
    };
  }
}
