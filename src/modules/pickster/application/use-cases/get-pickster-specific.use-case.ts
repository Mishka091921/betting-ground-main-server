import { Injectable } from '@nestjs/common';
import { StrapiMemberBoardService } from 'src/strapi-gateway/services/board/strapi-member-board.service';
import { PicksterRepository } from '../../domain/pickster.repository';
import { PicksterInfoResponse } from '../../domain/interface/pickster.interface';

@Injectable()
export class PicksterSpecificUseCase {
  constructor(
    private readonly strapiMemberBoard: StrapiMemberBoardService,
    private readonly picksterRepos: PicksterRepository
  ) {}

  async execute(member_idx:number): Promise<PicksterInfoResponse> {

    const member_view_count = await this.strapiMemberBoard.getPersonalBoardViews(member_idx);
    const pickster_info = await this.picksterRepos.findOne(member_idx);

    if (!pickster_info) {
      throw new Error(`Pickster with member_idx ${member_idx} not found`);
    }

    pickster_info.view_count = member_view_count ?? 0;
    return pickster_info;
  }
}
