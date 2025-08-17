// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { CreateUserUseCase } from '../../application/use-cases/auth/create-user.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { GetProfileUseCase } from '../../application/use-cases/auth/get-profile.use-case';
import { LogoutUseCase } from '../../application/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { Request, Response } from 'express';
import { NicknameCheckUseCase } from '../../application/use-cases/auth/nickname-check.use-case';
import { IdCheckUseCase } from '../../application/use-cases/auth/id-check.use-case';
import { MemberAccountType } from '@betting-ground/prisma-lib';
@Injectable()
export class AuthService {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly getProfile: GetProfileUseCase,
    private readonly logoutUser: LogoutUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly nickCheckUser: NicknameCheckUseCase,
    private readonly idCheckUser: IdCheckUseCase,
  ) {}

   async create(dto: CreateUserDto,rule_type: MemberAccountType = MemberAccountType.REGULAR) {
    return this.createUser.execute(dto, rule_type);
  }

  async login(dto: LoginDto, req: Request,res: Response, ) {
    return this.loginUser.execute(dto, req, res);
  }

  async profile(userId: string) {
    return this.getProfile.execute(userId);
  }

  async logout(res: Response) {
    return this.logoutUser.execute(res);
  }

  async refresh(req: Request) {
    return this.refreshToken.execute(req);
  }

  async checkId(userId: string,res: Response){ 
     return this.nickCheckUser.execute(userId,res);
  }

  async checkNickname(nick_name: string,res: Response) {
    return this.nickCheckUser.execute(nick_name,res);
  }

  
}
