// src/scripts/create-pickster-info.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';

import { BoardService } from '../modules/board/infrastructure/board.service';
import { AuthService } from 'src/modules/auth/infrastructure/auth/auth.service';
import { BoardCategory } from 'src/modules/board/domain/enums/board-category.enum';
import { BoardSubCategory } from 'src/modules/board/domain/enums/board-sub-category.enum';
import { MemberService } from 'src/modules/auth/infrastructure/member/member.service';
import { MemberAccountType } from '@betting-ground/prisma-lib';
import { PicksterService } from 'src/modules/pickster/infrastructure/pickster.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('CreatePicksterInfoScript');

  try {
    const authService = app.get(AuthService);
    const boardService = app.get(BoardService);
    const memberService = app.get(MemberService);
    const picksterService = app.get(PicksterService);

    for (let i = 1; i <= 7; i++) {
      const userDto = {
        id: `test-fixter-${i}`,
        nick_name: `test-fixter-${i}`,
        password: `test-fixter-${i}`,
        confirm_password: `test-fixter-${i}`,
      };

      try {
        const createdUser = await authService.create(userDto, MemberAccountType.PICKSTER);
        console.log(`✅ Created user: ${createdUser.id}`);
        const member_info = await memberService.getBaseInfo(createdUser.member_idx);

        await picksterService.createPickster({
          member_idx: createdUser.member_idx,
          alias_name: `${createdUser.id}-lebron-james`,
          thumbnail_path: '',
          intro:
            ' Iam a professional basketball player, known for my scoring ability and leadership on the court.',
        });

        const panel_data1 = {
          category: BoardCategory.PANEL,
          sub_category: BoardSubCategory.BASKETBALL,
          content: '<p>This is sample sports analysis data for basketball</p>',
          title: 'April Basketbal Win-Draw-Loss Predictions',
        };

        const panel_data2 = {
          category: BoardCategory.PANEL,
          sub_category: BoardSubCategory.SOCCER,
          content: '<p>This is sample sports analysis data for Soccer</p>',
          title: 'April Soccer Win-Draw-Loss Predictions',
        };

        const panel_data_3 = {
          category: BoardCategory.PANEL,
          sub_category: BoardSubCategory.HOCKEY,
          content: '<p>This is sample sports analysis data for Soccer</p>',
          title: 'April HOCKEY Win-Draw-Loss Predictions',
        };

        await boardService.postBoard(panel_data1, member_info, []);
        await boardService.postBoard(panel_data2, member_info, []);
        await boardService.postBoard(panel_data_3, member_info, []);
      } catch (err) {
        logger.error(`❌ Failed to create user: ${userDto.id}`, err);
      }
    }
    logger.log('✅ All Pickster info processed');
  } catch (error) {
    logger.error('❌ Failed to execute Pickster info script', error);
  } finally {
    await app.close();
  }
}

bootstrap();
