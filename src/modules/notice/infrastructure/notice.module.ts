// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';

@Module({
  imports: [
  ],
  controllers: [NoticeController],
  providers: [
    NoticeService,
  ],
})
export class NoticeModule {}
