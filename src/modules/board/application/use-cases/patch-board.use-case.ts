import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { MemberBoardResponse } from '../../domain/interfaces/board-interface';

@Injectable()
export class BoardPatchUseCase {
  constructor(
    private readonly memberBoardStrapi: StrapiMemberBoardService
  ) {}

async execute(board_document_id: string, body: any,member_idx:number): Promise<MemberBoardResponse> {
  const post = await this.memberBoardStrapi.updateBoardInStrapi(board_document_id, body,member_idx);
  if (!post || !post.data) {
    throw new Error("POST_NOT_FOUND");
  }
  return post;
}
}