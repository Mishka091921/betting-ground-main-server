// modules/user/application/dto/create-user.dto.ts
import { PartialType, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Matches,
  Length,
} from 'class-validator';
import { LoginDto } from './login.dto';

export class CreateUserDto extends PickType(LoginDto, ['id', 'password']) {

  @IsString()
  @IsNotEmpty({ message: 'Nickname is required.' })
  @Matches(/^[A-Za-z0-9가-힣]+$/, {
    message:
      'Nick name can only include English letters, Korean characters, and numbers.',
  })
  @Length(4, 24, {
    message: 'Nick name must be between 4 and 24 characters long.',
  })
  nick_name?: string;

  @IsString()
  @IsOptional()
  @Length(4, 16, {
    message: 'Confirm password must be between 4 and 16 characters long.',
  })
  @Matches(/^[\S]{4,16}$/, {
    message: 'Confirm password must not contain spaces.',
  })
  confirm_password?: string;

  @IsString()
  @IsOptional()
  acquisition_source?: string;
  

}
