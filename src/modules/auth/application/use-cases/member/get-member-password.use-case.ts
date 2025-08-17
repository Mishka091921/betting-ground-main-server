// modules/user/application/use-cases/get-profile.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';
import { MemberInfoDto } from '../../dto/member-info.dto';

@Injectable()
export class GetMemberCheckPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(member_idx: number, password: string): Promise<{ valid: boolean }> {
    const user = await this.userRepo.checkPassword(member_idx, password);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
