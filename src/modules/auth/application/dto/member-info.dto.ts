// user.dto.ts
export class MemberInfoDto {
  member_idx:number;
  id: string;
  nick_name?: string;
  level: number;
  money?:number;
  point?: number;
  type: string;
  duration_membership: number;
  consecutive_days?:number
  comment_count?: number;
  post_count?: number;  
}
