// modules/user/application/use-cases/create-user.use-case.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { MemberAccountType } from '@betting-ground/prisma-lib';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository, 
  ) {}

  async execute(
    createUserDto: CreateUserDto,
    rule_type: MemberAccountType = MemberAccountType.REGULAR
  ): Promise<{ member_idx: number; id: string; nick_name: string }> {
    const { password, confirm_password, ...rest } = createUserDto;

    if (password !== confirm_password) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user_created = await this.userRepo.create({
      ...rest,
      password: hashed_password,
      rule_type,
    });

    return {
      member_idx : user_created.idx ?? 0,
      id: user_created.id ?? '',
      nick_name: user_created.nick_name ?? '',
    };
  }
}
