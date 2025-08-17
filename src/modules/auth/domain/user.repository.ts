// modules/user/domain/user.repository.ts
import { BaseResponse } from '@betting-ground/prisma-lib';
import { UserEntity,UserNickNameEntity } from './user.entity';
import { MemberInfoDto } from '../application/dto/member-info.dto';

export abstract class UserRepository {
  abstract findByUserNickname(nick_name: string): Promise<UserNickNameEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract create(user: Partial<UserEntity>): Promise<Partial<UserEntity>>
  abstract updateUserInfo(member_idx: number,data:Partial<UserEntity>,modified_id: number): Promise<Partial<UserEntity>>;
  abstract getMemberInfo(member_idx: number): Promise<Partial<UserEntity>>;
  abstract incrementTokenVersion(member_idx: number): Promise<any>;
  abstract checkPassword(member_idx: number, password: string): Promise<any>;
  abstract changePassword(member_idx: number, body: any): Promise<any>;
}
