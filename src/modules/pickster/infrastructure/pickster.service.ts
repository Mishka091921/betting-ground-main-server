// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { PicksterCreateUseCase } from '../application/use-cases/create-pickster.use-case';
import { PicksterListUseCase } from '../application/use-cases/get-pickster-list.use-case';
import { PicksterSpecificUseCase } from '../application/use-cases/get-pickster-specific.use-case';


@Injectable()
export class PicksterService {
  constructor(
    private readonly picksterCreateUseCase : PicksterCreateUseCase,
    private readonly picksterListUseCase: PicksterListUseCase,
    private readonly picksterSpecificUseCase: PicksterSpecificUseCase
  ) {}

  async createPickster(body:any){
   return this.picksterCreateUseCase.execute(body);  
  }
  
  async getPicksterList(query:any) {
    return this.picksterListUseCase.execute(query);
  }

  async getSpecificPickster(member_idx){
    return this.picksterSpecificUseCase.execute(member_idx);
  }

  async getDetailsPicksterInfo(){
    return "Get Pickster Detail Info";
  }


}
