// modules/user/users.service.ts
import { Injectable } from '@nestjs/common';
import { GetMemberInfoUseCase } from '../../application/use-cases/member/get-member-info.use-case';
import { MemberInfoDto } from '../../application/dto/member-info.dto';
import { GetMemberCheckPasswordUseCase } from '../../application/use-cases/member/get-member-password.use-case';
import { GetMemberBasicUseCase } from '../../application/use-cases/member/get-member-basic.use-case';
import { PostMemberChangePassUseCase } from '../../application/use-cases/member/post-member-change-pass.use-case';
@Injectable()
export class MemberService {
  constructor(
    private getMemberinfoUseCase: GetMemberInfoUseCase,
    private getMemberCheckPasswordUseCase: GetMemberCheckPasswordUseCase,
    private getMemberBasicUseCase: GetMemberBasicUseCase,
    private postMemberChangePassUseCase:PostMemberChangePassUseCase
  ) {}

  async getBaseInfo(member_idx:number):Promise<MemberInfoDto>{
    return this.getMemberinfoUseCase.execute(member_idx);
  }

  async getBasicInfo(member_idx:number){
    return this.getMemberBasicUseCase.execute(member_idx);
  }

  async checkPassword(member_idx: number, password: string): Promise<any> {
    return this.getMemberCheckPasswordUseCase.execute(member_idx, password);
  }

  async changePassword(member_idx: number, body: any) {
    return this.postMemberChangePassUseCase.execute(member_idx, body);
  }
}
