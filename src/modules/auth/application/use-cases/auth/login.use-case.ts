// modules/user/application/use-cases/login.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../../domain/user.repository';
import { LoginDto } from '../../dto/login.dto';
import { LoginTrackerService } from '../../../domain/services/login-tracker.service';
import { Response,Request} from 'express';
import { access } from 'fs';
import { CreateMemberAttendanceUseCase } from '../member/create-member-attendance.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly loginTracker: LoginTrackerService,
    private readonly createMemberAttendanceUseCase: CreateMemberAttendanceUseCase
  ) {}

  async execute(loginDto: LoginDto, req: Request,res: Response,) {

    const user = await this.userRepo.findById(loginDto.id);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error("WRONG_CREDENTIALS");
    }

    await this.createMemberAttendanceUseCase.execute(user.idx);
    const updated_version = await this.userRepo.incrementTokenVersion(user.idx);
    const access_token = this.jwtService.sign(
      { 
          member_idx: user.idx, 
          id: user.id,
          nick_name: user.nick_name,
          type: user.rule_type,
          level: user.level,
          token_version:Number(updated_version.token_version)
      },
      { expiresIn: '1d' },
    );

    const refreshToken = this.jwtService.sign(
      { member_idx: user.idx },
      { expiresIn: loginDto.rememberMe ? '7d' : '1d' }
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: loginDto.rememberMe ? 7 * 86400000 : 86400000,
    });

  const return_object = {
    message:"Successfully logged in",
    result:1,
    data:[
      { 
          access_token,
          user: {
            member_idx: user.idx,
            id: user.id,
            nick_name: user.nick_name,
            level: user.level,
            type: user.rule_type,
            token_version:user.token_version
          },
      }
    ]
  }
  return res.json(return_object);
  }
}
