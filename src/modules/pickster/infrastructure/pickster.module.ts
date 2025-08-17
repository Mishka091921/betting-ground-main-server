// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { PicksterService } from './pickster.service';
import { PicksterController } from './pickster.controller';
import { PicksterCreateUseCase } from '../application/use-cases/create-pickster.use-case';
import { HttpModule } from '@nestjs/axios';
import { PicksterListUseCase } from '../application/use-cases/get-pickster-list.use-case';
import { PicksterSpecificUseCase } from '../application/use-cases/get-pickster-specific.use-case';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { PicksterRepository } from '../domain/pickster.repository';
import { PicksterRepositoryImpl } from './pickster.repository.impl';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [PicksterController],
  providers: [
    PicksterCreateUseCase,
    PicksterListUseCase,
    PicksterSpecificUseCase,
    PicksterService,
    StrapiMemberBoardService,
    {
      provide: PicksterRepository,
      useClass: PicksterRepositoryImpl,
    },
  ],
})
export class PicksterModule {}
