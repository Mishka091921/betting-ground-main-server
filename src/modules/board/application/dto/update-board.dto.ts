// application/dto/update-board.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateBoardDTO } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDTO) {}
