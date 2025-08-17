// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentPostUseCase } from '../application/use-cases/create-comment.use-case';
import { HttpModule } from '@nestjs/axios';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { CommentGetListUseCase } from '../application/use-cases/get-comment.use-case';
import { CommentGetLatestUseCase } from '../application/use-cases/get-latest-comment.use-case';
import { CommentUpdateUseCase } from '../application/use-cases/update-comment.use-case';
import { CommentDeleteUseCase } from '../application/use-cases/delete-comment.use-case';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';
import { CommentPersonalUseCase } from '../application/use-cases/get-personal-comments.use-case';
import { CommentDeleteAllUseCase } from '../application/use-cases/delete-all-comment.use-case';
import { CommentDeleteBulkUseCase } from '../application/use-cases/delete-bulk-comment.use-case';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService, 
    CommentPostUseCase,
    CommentGetListUseCase,
    CommentGetLatestUseCase,
    CommentUpdateUseCase,
    CommentDeleteUseCase,
    CommentPersonalUseCase,
    CommentDeleteBulkUseCase,
    CommentDeleteAllUseCase,
    StrapiMemberBoardService,
    StrapiMemberReactionService,
    StrapiCommentsService
  ],
})
export class CommentsModule {}
