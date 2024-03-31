import { useCallback } from 'react';
import { AxiosResponse, CreatePostState, Post, PostWithActions } from '../types/Interfaces';
import { StatusCount, TransformFunction } from '../types/StateSummary';
import { transformAction } from './actionService';
import { useDataCreate, useDataFetch } from './globalService';

const BASE_ROUTE: string = 'posts'


const transformPostStateSummary: TransformFunction<StatusCount> = (item: any, index: number) => ({
    id: index,
    value: item._count.type,
    label: item.type,
});

export const usePostStateSummary = () => {
    return useDataFetch<StatusCount>(`${BASE_ROUTE}/summary`, transformPostStateSummary);
};

const transformPost: TransformFunction<Post> = (item: any, index: number) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
});
export const useGetPostById = (id: string) => {
    const endpoint = `${BASE_ROUTE}/${id}`;
    return useDataFetch<Post>(endpoint, transformPost);
}
const transformPostSummary: TransformFunction<PostWithActions> = (item: any, index: number) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    actions: item.Actions ? item.Actions.map(transformAction) : [],
});

export const usePostData = (page: number, pageSize: number) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        actions: true.toString(),
    });

    const endpoint = `${BASE_ROUTE}?${queryParams.toString()}`;
    return useDataFetch<PostWithActions>(endpoint, transformPostSummary);
};

export function useCreatePost() {
    const { createData, isLoading, error, response } = useDataCreate<Post, AxiosResponse<Post>>();

    const createPost = useCallback((data: CreatePostState) => {
        createData(`${BASE_ROUTE}`, data as Post);
    }, [createData]);

    return { createPost, isLoading, error, response };
}