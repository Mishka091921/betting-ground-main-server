import { Injectable } from '@nestjs/common';
import { PrismaReadService } from '@betting-ground/prisma-lib';

@Injectable()
export class GetMemberStartLoginUseCase {
  constructor() {}

  async execute(created_at: string): Promise<any> {
    const today = new Date();

    const created_at_date = new Date(created_at);
    const duration_ms = today.getTime() - created_at_date.getTime();
    const duration_days = Math.floor(duration_ms / (1000 * 60 * 60 * 24)) + 1;

    return duration_days;
  }
}
