// 태그 관련 타입 정의

export interface Tag {
  id: number;
  name: string;
}

export interface TagListApiResponse {
  code: number;
  status: string;
  message: string;
  data: Tag[];
}
