// modules/user/domain/user.entity.ts
export class UserEntity {
  constructor(
    public readonly idx: number,
    public readonly id: string,
    public readonly nick_name: string,
    public readonly password: string,
    public readonly rule_type: 'default' | 'regular' | 'pickster' , 
    public readonly status:number,
    public readonly point: number,
    public readonly created_at:string,
    public readonly level:number,
    public readonly money: number = 0,
    public readonly token_version?: number
  ) {}
}

export class UserNickNameEntity {
  constructor(
   
    public readonly idx: number,
    public readonly id: string,
    public readonly nick_name: string,
    public readonly password: string,
    public readonly rule_type: 'default' | 'regular' | 'pickster' , 
    public readonly status:number,
    public readonly point: number,
    public readonly created_at:string,
    public readonly level:number,
   ) {}


}
