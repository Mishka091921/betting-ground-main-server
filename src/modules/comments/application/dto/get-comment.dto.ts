import { IsNotEmpty, IsString } from "class-validator";

export class GetCommentDto {

  @IsString()
  @IsNotEmpty({ message: 'Board Document ID is required.' })
  board_document_id: string;
}
