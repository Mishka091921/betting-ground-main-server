// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { ReactionPostUseCase } from '../application/use-cases/create-reaction.use-case';
import { CreateReactionDTO } from '../application/dto/create-reaction.dto';
import { UserDto } from '@betting-ground/prisma-lib';


@Injectable()
export class ReactionService {
  constructor(
    private readonly reactionPostUseCase : ReactionPostUseCase,
  ) {}

  async toggleReaction(body:CreateReactionDTO, user:UserDto){
    return this.reactionPostUseCase.execute(body, user);
  } 
}
