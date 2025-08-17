// modules/user/application/use-cases/create-member-attendance.use-case.ts
import { Injectable } from '@nestjs/common';
import { PrismaReadService, PrismaWriteService } from '@betting-ground/prisma-lib';
@Injectable()
export class CreateMemberAttendanceUseCase {
  constructor(
    private readonly prismaReadService: PrismaReadService,
    private readonly prismaWriteService: PrismaWriteService,
  ) {}

  async execute(member_idx: number): Promise<any> {
    const todayStr = new Date().toISOString().split('T')[0];

    const existing = await this.prismaReadService.member_attendance_record.findFirst({
      where: {
        member_idx,
        attendance_date: todayStr,
      },
    });

    if (!existing) {
      await this.prismaWriteService.member_attendance_record.create({
        data: {
          member_idx,
          attendance_date: todayStr,
        },
      });
    }
    return { created: !existing };
  }
}
