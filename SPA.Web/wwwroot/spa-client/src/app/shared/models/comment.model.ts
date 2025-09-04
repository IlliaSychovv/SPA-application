export interface Comment {
  id: string;
  text: string;
  userId: string;
  name: string;
  created: Date;
  parentId?: string;
  replies: Comment[];
  files: FileInfo[];
}

export interface CreateComment {
  name: string;
  email: string;
  text: string;
  homePage?: string;
  captcha: string;
  captchaSessionId: string;
  files?: File[];
}

export interface CommentReply {
  text: string;
  name: string;
}

export interface CommentReplyWithFiles {
  text: string;
  userId: string;
  name: string;
  created: Date;
  files?: File[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  homePage?: string;
}

export interface Captcha {
  imageBase64: string;
  sessionId: string;
}

export interface PagedResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface CommentFilters {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  filterByName?: string;
  filterByDate?: Date;
}

export interface FileInfo {
  id: string;
  fileName: string;
  path: string;
  type: string;
  size: number;
  sizeFormatted: string;
} 