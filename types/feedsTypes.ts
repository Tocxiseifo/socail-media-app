export interface FeedResponse {
    msg: string
    feeds: Feed[]
}

export interface Feed{
    id: string 
    likeCount:number
    commentCount:number
    content:string
    createdAt: string
    updatedAt: string
    image?: string[] 
    author: FeedAuthor
}

export interface FeedAuthor {
    id: string
    username: string
    displayName: string
    avatar: string | null
}