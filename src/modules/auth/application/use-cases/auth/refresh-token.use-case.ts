// application/use-cases/refresh-token.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from '../../../domain/user.repository';
import { LoginTrackerService } from '../../../domain/services/login-tracker.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly loginTracker: LoginTrackerService
  ) {}

  async execute(req: Request) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.userRepo.findById(payload.id);
      if (!user) throw new UnauthorizedException('User not found');

     await this.loginTracker.trackLogin(user,req)

      const newAccessToken = this.jwtService.sign(
        {
          member_idx: user.idx,
          id: user.id,
          nick_name: user.nick_name,
          level: user.level,
          type: user.rule_type,
        },
        { expiresIn: '1d' },
      );

      return {
        access_token: newAccessToken,
        user: {
          member_idx: user.idx,
          id: user.id,
          nick_name: user.nick_name,
          level: user.level,
          type: user.rule_type,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
