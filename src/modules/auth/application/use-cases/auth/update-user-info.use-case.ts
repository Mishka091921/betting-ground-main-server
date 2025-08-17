


// modules/user/application/use-cases/create-user.use-case.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(createUserDto: CreateUserDto) {
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepo.create({
      ...createUserDto,
      password: hashed,
      rule_type: 'regular',
    });
  }
}
