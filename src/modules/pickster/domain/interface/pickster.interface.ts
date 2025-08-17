export interface PicksterInfoResponse {
  member_idx: string;
  alias_name: string;
  thumbnail_path: string | null;
  intro: string;
  update_dt: string;
  created_dt: string;
  view_count?: number; 
}

export interface PaginationMeta {
  pagination: {
    page: number;
    page_size: number;
    pageCount: number;
    total: number;
  };
}

export interface PicksterReturn {
  data: PicksterInfoResponse[];
  meta: PaginationMeta
}