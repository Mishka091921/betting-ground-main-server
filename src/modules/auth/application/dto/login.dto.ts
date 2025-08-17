// modules/user/application/dto/login.dto.ts
import { IsString, IsNotEmpty, IsBoolean, Matches, Length, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'ID is required.' })
  @Matches(/^[A-Za-z0-9가-힣]+$/, {
    message:
      'ID can only include English letters, Korean characters, and numbers.',
  })
  @Length(4, 24, { message: 'ID must be between 4 and 24 characters long.' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(4, 16, {
    message: 'Password must be between 4 and 16 characters long.',
  })
  @Matches(/^[\S]{4,16}$/, {
    message: 'Password must not contain spaces.',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean
}
