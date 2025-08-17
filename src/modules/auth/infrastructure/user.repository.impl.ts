// modules/user/infrastructure/user.repository.impl.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaReadService, PrismaWriteService } from '@betting-ground/prisma-lib';
import { UserRepository } from '../domain/user.repository';
import { UserEntity,UserNickNameEntity } from '../domain/user.entity';
import * as bcrypt from 'bcryptjs';
import { compare } from 'bcryptjs';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    
    private prismaReadService: PrismaReadService,
    private prismaWriteService: PrismaWriteService
  
  ) {
    super();
  }

  async checkPassword(member_idx: number, password: string): Promise<{ valid: boolean } | null> {
    const user = await this.prismaReadService.member.findUnique({
      where: { idx: member_idx },
    });
    if (!user) return null;

    const isValid = await compare(password, user.password);
    return { valid: isValid };
  }

  async changePassword(member_idx:number, body:any): Promise<any> {
    const user = await this.prismaWriteService.member.findUnique({
      where: { idx: member_idx },
    });
    if (!user) throw new BadRequestException('User not found');


    const hashed_password = await bcrypt.hash(body.new_password, 10);
    
      await this.prismaWriteService.member.update({
      where: { idx: member_idx },
      data: {
        password: hashed_password,
      },
    });
    return {
      message : 'Password changed successfully',
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const account = await this.prismaReadService.member.findUnique({ where: { id: id } });
    if (!account) return null;

    return new UserEntity(
      Number(account.idx),
      account.id,
      account.nick_name ?? '',
      account.password,
      account.rule_type ?? 'regular',
      account.status,
      account.point ?? 0,
      account.created_at ? account.created_at.toISOString() : '',
      account.level ?? 0,
      account.money ?? 0,
      Number(account.token_version)
    );
  }

  async findByUserNickname(nick_name: string): Promise<UserNickNameEntity | null> {
    const account = await this.prismaReadService.member.findUnique({ where: { nick_name: nick_name } });
    if (!account) return null;

    return new UserNickNameEntity(

      Number(account.idx),
      account.id,
      account.nick_name ?? '',
      account.password,
      account.rule_type ?? 'regular',
      account.status,
      account.point ?? 0,
      account.created_at ? account.created_at.toISOString() : '',
      account.level ?? 0,
    );
  }
  
  async create(user: Partial<UserEntity> & { id: string;nick_name:string}):  Promise<UserEntity> {
    const account = await this.prismaWriteService.member.create({
      data: {
        id: user.id,
        nick_name: user.nick_name,
        password: user.password ?? '',
        rule_type: user.rule_type ?? 'regular',
        status: 1,
        point: user.point,
      }
    });

    return new UserEntity(
      Number(account.idx),
      account.id,
      account.nick_name ?? '',
      account.password,
      account.rule_type ?? 'regular',
      account.status,
      account.point ?? 0,
      account.created_at ? account.created_at.toISOString() : '',
      account.level ?? 0,
      account.money ?? 0,
    );

  }

  async updateUserInfo(
    member_idx: number,
    data: Partial<UserEntity>,
    modifierId: number,
  ): Promise<Partial<UserEntity>> {
    const existingUser = await this.prismaWriteService.member.findUnique({
      where: { idx: member_idx },
    });

    if (!existingUser) throw new Error('User not found');

    const updatedUser = await this.prismaWriteService.member.update({
      where: { idx: member_idx },
      data,
    });

    // Detect changes
    const changes: { field: string; before: any; after: any }[] = [];
    for (const key of Object.keys(data)) {
      const before = (existingUser as any)[key];
      const after = (updatedUser as any)[key];
      if (before !== after) {
        changes.push({ field: key, before, after });
      }
    }

    //Preparation for changes
    // Log changes
    // await Promise.all(
    //   changes.map((change) =>
    //     this.prismaWriteService.auditLog.create({
    //       data: {
    //         user_idx: userIdx,
    //         field_name: change.field,
    //         before_value: String(change.before ?? ''),
    //         after_value: String(change.after ?? ''),
    //         modified_by: modifierId,
    //         modified_at: new Date(),
    //       },
    //     }),
    //   ),
    // );

    return {
      id: updatedUser.id,
      nick_name: updatedUser.nick_name ?? '',
      rule_type: updatedUser.rule_type ?? 'regular',
      status: updatedUser.status,
      point: updatedUser.point ?? 0,
    };
  }

  async getMemberInfo(member_idx:number): Promise <Partial<UserEntity>> {
    
    const account = await this.prismaReadService.member.findUnique({
      where: {idx: member_idx}
    })

    if(!account){
      throw new Error("User Not Found");
    }

    return new UserEntity(
        Number(account.idx),
        account.id,
        account.nick_name ?? '',
        account.password,
        account.rule_type ?? 'regular',
        account.status,
        account.point ?? 0,
        account.created_at ? account.created_at.toISOString() : '',
        account.level ?? 0,
        account.money ?? 0,
      );
  }

  async incrementTokenVersion(member_idx): Promise<any>{
      return this.prismaWriteService.member.update({
          where: { idx: member_idx },
          data: {
            token_version: { increment: 1 },
          },
        });
  }

}
