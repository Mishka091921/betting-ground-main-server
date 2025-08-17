// modules/user/user.controller.ts

import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NoticeService } from "./notice.service";

import { 
  SwaggerMyNoticeList,
  SwaggerMyDetailNoticeInfo
} from "../application/swagger/notice.swagger";

@ApiTags('Notice')
@Controller({ path: 'notice', version: '3' })
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Get('rqNoticeList')
  @SwaggerMyNoticeList()
  async getBaseUserInfo() {
    return this.service.getNoticeList();
  }

  @Get('rqDetailNoticeInfo')
  @SwaggerMyDetailNoticeInfo()
  async getMyInfo(){
    return this.service.getDetailNoticeInfo()
  }

}
