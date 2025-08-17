// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../user.repository.impl';
import { UserRepository } from '../../domain/user.repository';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { GetMemberInfoUseCase } from '../../application/use-cases/member/get-member-info.use-case';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { HttpModule } from '@nestjs/axios';
import { GetMemberCheckPasswordUseCase } from '../../application/use-cases/member/get-member-password.use-case';
import { GetMemberBasicUseCase } from '../../application/use-cases/member/get-member-basic.use-case';
import { PostMemberChangePassUseCase } from '../../application/use-cases/member/post-member-change-pass.use-case';
import { GetConsecutiveDaysUseCase } from '../../application/use-cases/member/get-consecutive-days.use-case';
import { GetMemberStartLoginUseCase } from '../../application/use-cases/member/get-member-created-at.use-case';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [MemberController],
  providers: [
    GetMemberInfoUseCase,
    GetMemberCheckPasswordUseCase,
    GetMemberBasicUseCase,
    PostMemberChangePassUseCase,
    StrapiCommentsService,
    StrapiMemberBoardService,
    GetConsecutiveDaysUseCase,
    GetMemberBasicUseCase,
    GetMemberStartLoginUseCase,
    MemberService,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class MemberModule {}
