import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@betting-ground/prisma-lib';
import { AuthModule } from './modules/auth/infrastructure/auth/auth.module';
import { SocketModule } from './modules/socket/infrastucture/socket.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard, JwtAuthGuard } from '@betting-ground/prisma-lib';
import { StrapiGatewayModule } from './strapi-gateway/strapi.gateway.module';
import { S3Module } from './shared/s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { MemberModule } from './modules/auth/infrastructure/member/member.module';
import { NoticeModule } from './modules/notice/infrastructure/notice.module';
import { PicksterModule } from './modules/pickster/infrastructure/pickster.module';
import { BoardModule } from './modules/board/infrastructure/board.module';
// PrismaExceptionFilter removed - using AllExceptionsFilter from lib package
import { AllExceptionsFilter } from '@betting-ground/prisma-lib';
import { CommentsModule } from './modules/comments/infrastructure/comments.module';
import { I18nService } from './shared/i18/i18.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ReactionModule } from './modules/reaction/infrastructure/reaction.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60_000,
          limit: 200,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    MemberModule,
    NoticeModule,
    PicksterModule,
    BoardModule,
    CommentsModule,
    ReactionModule,
    SocketModule,
    StrapiGatewayModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [
    I18nService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // PrismaExceptionFilter provider removed - using AllExceptionsFilter from lib package
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
