import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPersonalBoardDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search_key?: string;

  @IsOptional()
  @IsString()
  search_word?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  read_count?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  member_idx?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
