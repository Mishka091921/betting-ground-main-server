// modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardPostUseCase } from '../application/use-cases/create-board.use-case';
import { MediaExtractionService } from 'src/shared/media-extraction/media-extraction.service';
import { S3Module } from 'src/shared/s3/s3.module';
import { S3Service } from 'src/shared/s3/s3.service';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { StrapiBaseService } from 'src/strapi-gateway/services/strapi-base.service';
import { HttpModule } from '@nestjs/axios';
import { BoardListUseCase } from '../application/use-cases/get-board-list.use-case';
import { BoardSpecificUseCase } from '../application/use-cases/get-specific-board.use-case';
import { BoardPatchUseCase } from '../application/use-cases/patch-board.use-case';
import { BoardIncreaseViewsUseCase } from '../application/use-cases/increment-board-views.use-case';
import { BoardDeleteUseCase } from '../application/use-cases/delete-board.use-case';
import { BoardLatestUseCase } from '../application/use-cases/get-latest-post.use-case';
import { StrapiCommentsService } from 'src/strapi-gateway/services/comments/strapi-member-comments.service';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';
import { BoardPersonalUseCase } from '../application/use-cases/get-personal-board.use-case';
import { BoardDeleteBulkUseCase } from '../application/use-cases/delete-bulk-board.use-case';
import { BoardDeleteAllUseCase } from '../application/use-cases/delete-all-board.use-case';

@Module({
  imports: [
    S3Module,
    HttpModule,
  ],
  controllers: [BoardController],
  providers: [
    BoardPostUseCase,
    BoardListUseCase,
    BoardSpecificUseCase,
    BoardPatchUseCase,
    BoardService,
    BoardDeleteUseCase,
    BoardIncreaseViewsUseCase,
    BoardLatestUseCase,
    BoardPersonalUseCase,
    BoardDeleteBulkUseCase,
    BoardDeleteAllUseCase,
    MediaExtractionService,
    S3Service,
    StrapiBaseService,
    StrapiMemberBoardService,
    StrapiMemberReactionService,
    StrapiCommentsService
  ],
})
export class BoardModule {}
