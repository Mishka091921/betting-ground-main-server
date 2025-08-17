// modules/user/application/use-cases/get-profile.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';

@Injectable()
export class PostMemberChangePassUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(member_idx: number, body:any): Promise<{message: string }> {


    if(!body.is_validated){
      throw new Error("Please Confirm Your Password")
    }

    if(body.new_password !== body.confirm_new_password) {
      throw new Error('Passwords do not match');
    }
    
    const user = await this.userRepo.changePassword(member_idx, body);
    if (!user) throw new Error('User not found');

    return user;
  }
}
