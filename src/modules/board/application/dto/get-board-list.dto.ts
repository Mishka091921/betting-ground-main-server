// src/modules/board-post/application/dto/board-query.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsIn,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BoardCategory } from '../../domain/enums/board-category.enum';
import { BoardSubCategory } from '../../domain/enums/board-sub-category.enum';

export class BoardQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  read_count: number;

  @IsEnum(BoardCategory)
  @IsNotEmpty()
  category: BoardCategory;

  @IsEnum(BoardSubCategory)
  @IsOptional()
  sub_category: BoardSubCategory;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @IsString()
  orderby_type?: string = 'asc';
  
  @IsOptional()
  @IsString()
  orderby_key?: string;

  @IsOptional()
  @IsString()
  search_key?: string;

  @IsOptional()
  @IsString()
  search_word?: string;

  @IsOptional()
  @IsString()
  event_filter?: string;
}
