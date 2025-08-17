import { IsNumber, IsString } from 'class-validator';

export class GetPicksterListDto {
  @IsString()
  read_count: string;
}