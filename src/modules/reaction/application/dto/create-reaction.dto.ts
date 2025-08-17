import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateReactionDTO {
  @IsString()
  @IsNotEmpty({ message: 'Parent document ID is required.' })
  parent_document_id: string;

  @IsString()
  @IsOptional()
  reaction?: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required.' })
  type: string;
}
