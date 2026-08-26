export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PostDTO {
  id: string;
  author: PostAuthor;
  text: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  createdAt: string;
  editedAt: string | null;
}

export interface FeedPage {
  items: PostDTO[];
  nextCursor: string | null;
}

export interface CreatePostInput {
  text: string;
}
