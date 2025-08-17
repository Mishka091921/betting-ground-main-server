// modules/user/application/use-cases/get-profile.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';
import { MemberInfoDto } from '../../dto/member-info.dto';
import { GetConsecutiveDaysUseCase } from './get-consecutive-days.use-case';
import { GetMemberStartLoginUseCase } from './get-member-created-at.use-case';

@Injectable()
export class GetMemberBasicUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly getMemberStartLoginUseCase: GetMemberStartLoginUseCase
  ) {}

  async execute(member_idx: number): Promise<MemberInfoDto> {
    const user = await this.userRepo.getMemberInfo(member_idx);
    
    
    if (!user) throw new NotFoundException('User not found');
    
      if (!user.created_at) {
        throw new NotFoundException('User creation date not found');
      }
      const duration_days = await this.getMemberStartLoginUseCase.execute(user.created_at);
      if (!user.id) {
        throw new NotFoundException('User ID not found');
      }
      return {
        member_idx: user.idx ?? 0,
        id: user.id,
        nick_name: user.nick_name,
        level: user.level ?? 0,
        point: user.point,
        type: user.rule_type ?? '',
        duration_membership: duration_days,
        money: user.money ?? 0,
      };

  }
}
