export interface ProfilePost {
  postId: number;
  title: string;
  userName: string;
  imageUrls: string[];
  archived: number;
  tags?: string[];
}

export interface ProfilePostsPage<T = ProfilePost> {
  content: T[];
  totalElements: number;
  last: boolean;
  pageable: { pageNumber: number };
}
