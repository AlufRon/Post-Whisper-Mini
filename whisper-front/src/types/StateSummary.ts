export interface StatusCount {
    id: number;
    value: number;
    label: string;
}
export interface BotSummary {
    id: string;
    email: string;
    name: string;
    status: string;
    accessToken: string | null;
    accessTokenSecret: string | null;
    personalityTraits: string[];
    createdAt: Date;
    updatedAt: Date;
    actionCount: number;
}
export interface UseStateSummaryReturn {
    data: StatusCount[];
    isLoading: boolean;
    error: any;
}

export interface UseDataFetchReturn<T> {
    data: T[];
    isLoading: boolean;
    error: any;
    totalCount?: number
}

export type TransformFunction<T> = (item: any, index: number) => T;

export interface FetchDataReturn<T> {
    data: T[];
    isLoading: boolean;
    error: any;
}
export type UseDataFetchFunction<T> = () => FetchDataReturn<T>;
