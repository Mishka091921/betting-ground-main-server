import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Board Document ID is required.' })
  board_document_id: string;

  @IsString()
  @IsOptional()
  parent_comment_document_id?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Comment depth is required.' })
  comment_depth: number;

  @IsBoolean()
  @IsNotEmpty({ message: 'is_private is required.' })
  is_private: boolean;
}