export interface BackendAuthor {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
}

export interface BackendPost {
    _id: string;
    author: BackendAuthor;
    content: string;
    Image: string[];
    commentCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
}