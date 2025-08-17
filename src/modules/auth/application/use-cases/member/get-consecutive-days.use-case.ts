import { Injectable } from '@nestjs/common';
import { PrismaReadService } from '@betting-ground/prisma-lib';

@Injectable()
export class GetConsecutiveDaysUseCase {
  constructor(
    private readonly prismaReadService: PrismaReadService,
  ) {}

  async execute(member_idx: number): Promise<number> {
    // Get all attendance records for this member, ordered by date descending
    const records = await this.prismaReadService.member_attendance_record.findMany({
      where: { member_idx },
      orderBy: { attendance_date: 'desc' },
      select: { attendance_date: true },
    });

    if (!records.length) return 0;

    let consecutive = 1;
    let prevDate = new Date(records[0].attendance_date);

    for (let i = 1; i < records.length; i++) {
      const currDate = new Date(records[i].attendance_date);

      // Calculate the difference in days
      const diffTime = prevDate.getTime() - currDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        consecutive++;
        prevDate = currDate;
      } else if (diffDays > 1) {
        break;
      } else {
        // If same day or out of order, skip
        prevDate = currDate;
      }
    }

    return consecutive;
  }
}