export interface MemberBoard {
  id: number;
  documentId: string;
  idx: number | null;
  member_idx: string;
  title: string;
  content: string;
  thumbnail_path: string;
  img_path_list: string;
  link_url: string;
  video_url: string;
  view_count: string;
  like_count: string;
  dislike_count: string;
  tag_list: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: string;
  sub_category: string;
  day_date:string,
  pkey:string,
  comment_count?:number,
  user_level?:number
  formatted_created_time_date:string,
  author_id: string,
  author_nick_name: string,
  my_reaction: string // 'like', 'dislike', 'none'
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface MemberBoardResponse {
  data: MemberBoard[];
  admin_notice?:MemberBoard[];
  meta: {
    pagination: PaginationMeta;
  };
  total_count?: number; 
  total_views?: number;
}

export interface MemberBoardSpecificResponse{
  data: MemberBoard[];
  meta:{
    pagination: PaginationMeta
  },
  others?:{
    previous: string,
    next: string
  }
}

export interface CreateMemberBoardResponse{
  data:MemberBoard;
  meta:{}
}

export interface UpdateViewCountResponse{
  document_id:string,
  view_count:number
}
