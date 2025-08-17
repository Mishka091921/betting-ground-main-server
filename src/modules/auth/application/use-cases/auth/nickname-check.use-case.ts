// modules/user/application/use-cases/create-user.use-case.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../domain/user.repository';
import { Response} from 'express';
@Injectable()
export class NicknameCheckUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(nickname: string, res: Response) {
    const user = await this.userRepo.findByUserNickname(nickname);
    if (user) {
      throw new BadRequestException('Nickname already exists');
    }

    const isValid = /^[a-zA-Z0-9가-힣]{4,24}$/.test(nickname);
    if (!isValid) {
      throw new BadRequestException(
        'Nickname must be 4–24 characters long and can only contain Korean, English letters, or digits.'
      );
    }

    return res.json({
      message: 'Successfully checked nickname',
      result: 1,
      data: [],
    });
  }
}
