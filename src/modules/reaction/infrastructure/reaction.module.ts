// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { ReactionPostUseCase } from '../application/use-cases/create-reaction.use-case';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [ReactionController],
  providers: [
    ReactionPostUseCase,
    StrapiMemberReactionService,
    ReactionService,
  ],
})
export class ReactionModule {}
