export interface MemberCommentListResponse {
  data: MemberComment[];
  meta: {
    pagination: Pagination;
  };
  total_views_board?: number;
  total_count?: number;
}

export interface MemberComment {
  id: number;
  documentId: string;
  content: string;
  author_id: string;
  author_idx: string;
  comment_depth: number;
  is_deleted: number;
  createdAt: string; 
  updatedAt: string; 
  publishedAt: string; 
  is_private: boolean;
  board_document_id: string;
  author_nick_name: string;
  parent_comment_document_id: string | null;
  replies?:MemberComment[];
  member_board?:any;
  my_reaction: string; 
  formatted_created_time_date:string,
  level?: number
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}


export interface CommentData {
  id: number;
  documentId: string;
  content: string;
  author_id?: string;
  author_idx: string;
  comment_depth: number;
  is_deleted: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  is_private: boolean;
  board_document_id: string;
  author_nick_name?: string;
  parent_comment_document_id: string | null;
  replies: CommentData[];
  level?:number
}

export interface CommentListResult {
  data: CommentData[];
  meta: MemberCommentListResponse['meta']; 
}

export interface CommentItem {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  formatted_created_time_date?:string
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface CommentMeta {
  pagination: Pagination;
}

export interface CommentLatestResponse {
  data: CommentItem[];
  meta: CommentMeta;
}

export interface BaseComment {
  id: number;
  documentId: string;
  content: string;
  author_id: string;
  author_idx: string;
  comment_depth: number;
  is_deleted: number;
  createdAt: string; 
  updatedAt: string; 
  publishedAt: string; 
  is_private: boolean;
  board_document_id: string;
  author_nick_name: string;
  parent_comment_document_id: string;
}

export interface CreateCommentResponse {
  data: BaseComment;
  meta: CommentMeta;
}

export interface UpdatedCommentResponse {
  data: BaseComment;
  meta: CommentMeta;
}