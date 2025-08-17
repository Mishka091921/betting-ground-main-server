// modules/user/user.controller.ts

import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReactionService } from "./reaction.service";
import { User, UserDto } from "@betting-ground/prisma-lib";
import { CreateReactionDTO } from "../application/dto/create-reaction.dto";
import { BaseResponse, buildResponse } from "@betting-ground/prisma-lib";


@ApiTags('Reaction')
@Controller({ path: 'reaction', version: '3' })
export class ReactionController {
  constructor(private readonly service: ReactionService) {}

  @Post()
  async getMyInfo(
    @Body() body: CreateReactionDTO, 
    @User() user: UserDto
  ): Promise<BaseResponse<{reaction: string}>>{

    const data = await this.service.toggleReaction(body, user);
    return buildResponse(1, "Successfully toggled reaction", data);
  }
}
