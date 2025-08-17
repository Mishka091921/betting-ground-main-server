// modules/user/user.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@betting-ground/prisma-lib';
import { AuthService } from './auth.service';
import { LoginDto } from '../../application/dto/login.dto';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { Request, Response } from 'express';
import { User, Roles, MemberAccountType, RolesGuard } from '@betting-ground/prisma-lib';

import {
  ApiTags,
} from '@nestjs/swagger';

import { 
  SwaggerRegister ,
  SwaggerLogin,
  SwaggerLogout,
  SwaggerRefresh,
  SwaggerTestRole,
  SwaggerNickname,
  SwaggerCheckId,

} from '../../application/swagger/auth.swagger';
import { Public, buildResponse, BaseResponse } from '@betting-ground/prisma-lib';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '3' })
export class AuthController {
  constructor(private readonly service: AuthService) {}


@Throttle({ limit: 60, ttl: 60 } as any)
@Public()
@Post('signUp')
@SwaggerRegister()
async create(
    @Body() dto: CreateUserDto,
  ): Promise<BaseResponse<{ id: string; nick_name: string }[]>> {
    const data = await this.service.create(dto);

    return buildResponse(1, 'Successfully registered a player', [
      {
        id: data.id,
        nick_name: data.nick_name ?? '',
      },
    ]);
  }

  @Throttle({ limit: 60, ttl: 60 } as any)
  @Public()
  @Post('login')
  @SwaggerLogin()
  login(@Body() dto: LoginDto, @Res() res: Response, @Req() req: Request) {
    return this.service.login(dto,req, res,);
  }

  @Public()
  @Post('checkNickName')
  @SwaggerNickname()
  checkNickName(@Query('nickname') nickname: string,@Res() res: Response) {
    return this.service.checkNickname(nickname,res);
} 

  @Public()
  @Post('checkId')
  @SwaggerCheckId()
  checkId(@Query('id') id: string,@Res() res: Response) {
    return this.service.checkId(id,res);
  }

  @Post('logout')
  @SwaggerLogout()
  logout(@Res() res: Response) {
    return this.service.logout(res);
  }

  @Get('refresh')
  @SwaggerRefresh()
  refresh(@Req() req: Request) {
    return this.service.refresh(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberAccountType.REGULAR)
  @Get('test-role')
  @SwaggerTestRole()
  getSomething(@Req() req: Request) {
    return { message: 'Role check passed!', user: req.user };
  }
}
