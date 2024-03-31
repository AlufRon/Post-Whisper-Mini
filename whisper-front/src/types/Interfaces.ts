import { UseDataFetchFunction } from "./StateSummary";

interface DataSection<T> {
    title: string;
    useDataFetch: UseDataFetchFunction<T>;
    widthModifier?: number;
}

export interface CustomGridProps<T> {
    dataSections: DataSection<T>[];
}

export type Bot = {
    id: string;
    email: string;
    name: string;
    status: string;
    accessToken: string | null;
    accessTokenSecret: string | null;
    personalityTraits: string[];
    createdAt: Date;
    updatedAt: Date;
    Actions: any[];
}

export type Post = {
    id: string;
    link?: string;
    content: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}
export type Action = {
    id: string;
    botId: string;
    postId: string;
    comment?: string;
    twitterPostId?: string;
    actionType: ActionType;
    status: ActionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export type PostWithActions = Post & { actions: Action[] };
export type BotFormState = Omit<Bot, 'id' | 'createdAt' | 'updatedAt' | 'email' | 'name' | 'Actions'>;
export type CreateBotState = Omit<Bot, 'id' | 'createdAt' | 'updatedAt' | 'Actions' | 'updatedAt' | 'status'>;
export type CreatePostState = Omit<Post, 'id' |  'updatedAt' | 'createdAt'>;

export type BotWithActionCount = Omit<Bot, 'actions'> & {
    actionCount: number;
};

export interface UseDataUpdateReturn<T> {
    updateData: (data: T, id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    response: T | null;
}

export type CreateActionsRequest = {
    postId: string;
    actionTypes: ActionType[];
    excludedBots?: string[];
};

export interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    reqFuest?: any;
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DOWN = "DOWN",
    MAINTENANCE = "MAINTENANCE",
}
export enum PostType {
    TWEET = "TWEET",
    RETWEET = "REWTEET",
    REPLY = "REPLY",
}

export enum ActionType {
    LIKE = "LIKE",
    RETWEET = "RETWEET",
    REPLY = "REPLY",
    SHARE = "SHARE",
}

export enum ActionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}