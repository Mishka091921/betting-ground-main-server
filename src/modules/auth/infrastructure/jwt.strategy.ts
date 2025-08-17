// modules/user/infrastructure/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../application/dto/jwt-payload.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { MemberService } from './member/member.service';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepo: UserRepository

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.userRepo.findById(payload.id); 
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.token_version !== payload.token_version) {
      throw new UnauthorizedException({
        code: 'TOKEN_VERSION_MISMATCH',
        message: 'You have been logged out due to login from another device.',
      });
    }

    return payload;
  }
}
