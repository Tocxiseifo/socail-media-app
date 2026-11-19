import { BackendPost } from "@/types/BackEndPost";
import { PostDTO } from "../types/post";

export  function mapPostToDTO(post:BackendPost) :PostDTO {
    return{
        id:post._id,
        imageUrl:post.Image[0] ?? null,
        author:{
            id:post.author._id,
            username:post.author.username,
            displayName:post.author.displayName,
            avatarUrl:post.author.avatar ?? null //add ?? to return the value if the result equal to undefined
        },
        likeCount:post.likeCount,
        text:post.content,
        commentCount:post.commentCount,
        editedAt:post.updatedAt,
        createdAt:post.createdAt,
        likedByMe: Boolean(post.likedByMe) ?? true
    }
}   