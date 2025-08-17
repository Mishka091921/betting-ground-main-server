// modules/user/user.controller.ts

import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MemberService } from "./member.service";
import { 
  SwaggerBaseUserInfo,
  SwaggerMyInfo,
  swaggerChangePassword,
} from "../../application/swagger/member.swagger";
import { User } from "@betting-ground/prisma-lib";
import { MemberInfoDto } from "../../application/dto/member-info.dto";
import { BaseResponse, buildResponse, UserDto } from "@betting-ground/prisma-lib";

@ApiTags('Member')
@Controller({ path: 'member', version: '3' })
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Get('memberInfo')
  @SwaggerBaseUserInfo()
  async getBaseUserInfo(@User() user:any):  Promise<BaseResponse<MemberInfoDto>>  {
    const { member_idx } = user;
    const data =  await this.service.getBaseInfo(member_idx);
    return buildResponse(1, 'Successfully fetched member info', data);
  }

  @Get('memberBasic')
  async getBasicInfo(@User() user:any):Promise<any>{
    const { member_idx } = user;
    const data = await this.service.getBasicInfo(member_idx);
    return buildResponse(1, 'Successfully fetched basic member info', data);  
  }

  @Post('checkPassword')
  async checkPassword(
    @Body() body:any,
    @User() user:UserDto
  ): Promise<BaseResponse<{ valid: boolean }>> {
    const { member_idx } = user;
    const { password } = body;
    const data = await this.service.checkPassword(member_idx, password);
    return buildResponse(1, 'Password check successful', data);
  }

  @Post('changePassword')
  async changePassword(
    @Body() body:any,
    @User() user:UserDto
  ): Promise<BaseResponse<{message: string}>> {
    const { member_idx } = user;
    const data = await this.service.changePassword(member_idx, body);
    return buildResponse(1, 'Password changed successfully', data);
  }


}
