// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';


import { Request, Response } from 'express';
@Injectable()
export class NoticeService {
  constructor(
  ) {}

  async getNoticeList() {
    return 'Notice List';
  }

  async getDetailNoticeInfo(){
    return "Notice Detail Info";
  }
}
