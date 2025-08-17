// modules/user/domain/services/login-tracker.service.ts
import { Injectable } from '@nestjs/common';
import { getClientIp, extractClientDeviceInfo, getCountryFromIP } from '@betting-ground/prisma-lib';
import { PrismaWriteService } from '@betting-ground/prisma-lib';

@Injectable()
export class LoginTrackerService {
  constructor(private readonly prismaWriteService: PrismaWriteService) {}

  async trackLogin(userId: any, request: any) {
    const ip = getClientIp(request);
    const { deviceType, browser, os } = extractClientDeviceInfo(request);
    const country = await getCountryFromIP(ip);
    const now = new Date();

    //Update Ip in main.member
    await this.prismaWriteService.member.update({
      where: { idx: userId },
      data: {
        last_login_ip: ip,
        // last_login: now,
      },
    });

    // Insert into logs.login_logs
  }
}
