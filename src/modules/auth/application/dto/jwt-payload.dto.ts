// modules/user/application/dto/jwt-payload.dto.ts
import { IsString, IsIn, IsNumber, isNumber } from 'class-validator';

export class JwtPayloadDto {
  @IsNumber()
  member_idx: number;

  @IsString()
  id: string;

  @IsString()
  nick_name:string

  @IsIn(['default', 'regular','pickster'])
  type: 'default' | 'regular' | 'pickster' ;

  @IsNumber()
  level: number;

  @IsNumber()
  token_version:number;
}