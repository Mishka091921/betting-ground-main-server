import { Injectable } from '@nestjs/common';
import { UserDto, getDayDate, getPkey } from '@betting-ground/prisma-lib';
import { StrapiMemberReactionService } from 'src/strapi-gateway/services/reaction/strapi-member-reaction.service';

@Injectable()
export class ReactionPostUseCase {
  constructor(
    private readonly memberReactionService: StrapiMemberReactionService
  ) {}

async execute(body:any, user: UserDto): Promise<{reaction: string}> {
  const payload = {
    parent_document_id: body.parent_document_id,
    reaction: body.reaction ? body.reaction : 'none',
    type: body.type,
    member_idx: user.member_idx,
    day_date:getDayDate(),
    pkey:getPkey(),
  };

  return await this.memberReactionService.memberReactionCreate(payload);
}
}