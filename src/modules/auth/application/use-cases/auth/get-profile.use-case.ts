// modules/user/application/use-cases/get-profile.use-case.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string) {
    return this.userRepo.findById(id);
  }
}
