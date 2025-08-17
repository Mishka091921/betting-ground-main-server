// src/modules/board/context/board-context.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { UserDto } from '@betting-ground/prisma-lib';

@Injectable({ scope: Scope.REQUEST })
export class UserContext {
  private user: UserDto;

  setUser(user: UserDto) {
    this.user = user;
  }

  get userId(): number {
    return this.user.member_idx;
  }

  get currentUser(): UserDto {
    return this.user;
  }
}
