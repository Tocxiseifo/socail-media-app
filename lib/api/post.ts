import {  FeedResponse } from "@/types/feedsTypes";
import { apiFetch } from "./client";

export const getFeed = async (): Promise<FeedResponse> => {
    return apiFetch<FeedResponse>('/api/posts/feed' ,{
        method:"GET",
    })
} 