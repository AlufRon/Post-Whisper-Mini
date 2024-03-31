import { useCallback } from 'react';
import { Action, CreateActionsRequest } from '../types/Interfaces';
import { StatusCount, TransformFunction } from '../types/StateSummary';
import { useDataCreate, useDataFetch } from './globalService';

const BASE_ROUTE: string = 'actions'


const transformActionStateSummary: TransformFunction<StatusCount> = (item: any, index: number) => ({
    id: index,
    value: item._count.status,
    label: item.status,
});

export const useActionStateSummary = () => {
    return useDataFetch<StatusCount>(`${BASE_ROUTE}/summary`, transformActionStateSummary);
};

export const transformAction: TransformFunction<Action> = (action: any) => {
    return {
        ...action,
        createdAt: new Date(action.createdAt),
        updatedAt: new Date(action.updatedAt),
    };
};

export const useGetActions = () => {
    return useDataFetch(`${BASE_ROUTE}/summary`, transformAction);
};

export const useActionData = (page: number, pageSize: number) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });
    const endpoint = `${BASE_ROUTE}?${queryParams.toString()}`;
    return useDataFetch(endpoint, transformAction);
};

export function useCreateActions() {
    const { createData, isLoading, error, response } = useDataCreate<CreateActionsRequest, { message: string }>();

    const createActionForBots = useCallback((data: CreateActionsRequest) => {
        createData(`${BASE_ROUTE}/for-bots`, data);
    }, [createData]);

    return { createActionForBots, isLoading, error, response };
}