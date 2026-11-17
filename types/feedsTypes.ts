import { BackendPost } from "./BackEndPost"

export interface FeedResponse {
    msg: string
    feeds: BackendPost[]
}

