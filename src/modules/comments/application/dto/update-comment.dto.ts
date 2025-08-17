import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {

  @IsString()
  @IsNotEmpty({ message: 'Nickname is required.' })
  content: string;
}
