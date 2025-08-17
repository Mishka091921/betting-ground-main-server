// dto/create-forum-post.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BoardCategory } from '../../domain/enums/board-category.enum';
import { BoardSubCategory } from '../../domain/enums/board-sub-category.enum';

export class CreateBoardDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(BoardCategory)
  category: BoardCategory;

  @IsEnum(BoardSubCategory)
  sub_category:BoardSubCategory;

  @IsString()
  @IsOptional()
  thumbnail?: string
}
