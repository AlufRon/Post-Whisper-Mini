import { AxiosResponse } from 'axios';
import { Bot, CreateBotState } from '../types/Interfaces';
import { StatusCount, TransformFunction } from '../types/StateSummary';
import { useDataCreate, useDataDelete, useDataFetch, useDataUpdate } from './globalService';
import { useCallback } from 'react';
const BASE_ROUTE: string = 'bots'


const transformBotStateSummary: TransformFunction<StatusCount> = (item: any, index: number) => ({
  id: index,
  value: item._count.status,
  label: item.status,
});

export const useBotStateSummary = () => {
  return useDataFetch<StatusCount>(`${BASE_ROUTE}/summary`, transformBotStateSummary);
};

const transformBotSummary: TransformFunction<Bot> = (item: any, index: number) => ({
  id: item.id,
  email: item.email,
  name: item.name,
  status: item.status,
  accessToken: item.accessToken,
  accessTokenSecret: item.accessTokenSecret,
  personalityTraits: item.personalityTraits,
  createdAt: new Date(item.createdAt),
  updatedAt: new Date(item.updatedAt),
  Actions: item.Actions ? item.Actions.length : 0,
});

export const useBotData = (page: Number, pageSize: Number,) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const endpoint = `${BASE_ROUTE}/with-actions?${queryParams.toString()}`;
  return useDataFetch<Bot>(endpoint, transformBotSummary);
};
export const useGetBotById = (id: string) => {
  const queryParams = new URLSearchParams({
    id: id
  });

  const endpoint = `${BASE_ROUTE}?${queryParams.toString()}`;
  return useDataFetch<Bot>(endpoint, transformBotSummary);
}
export const useGetbotByIdWithActions = (id: string) => {
  const queryParams = new URLSearchParams({
    id: id
  });

  const endpoint = `${BASE_ROUTE}/with-actions?${queryParams.toString()}`;
  return useDataFetch<Bot>(endpoint, transformBotSummary);
}
export function useUpdateBot() {
  const { updateData, isLoading, error, response } = useDataUpdate<Bot>();

  const updateBot = useCallback((botId: string, data: Bot) => {
    const endpoint = `${BASE_ROUTE}/${botId}`;
    updateData(endpoint, data);
  }, [updateData]);

  return { updateBot, isLoading, error, response };
}

export function useCreateBot() {
  const { createData, isLoading, error, response } = useDataCreate<Bot, AxiosResponse<Bot>>();

  const createBot = useCallback((data: CreateBotState) => {
    createData(`${BASE_ROUTE}`, data as Bot);
  }, [createData]);

  return { createBot, isLoading, error, response };
}

export function useDeleteBot() {
  const { deleteData, isLoading, error, response } = useDataDelete<string>();
  const deleteBot = useCallback((botId: string) => {
    const endpoint = `${BASE_ROUTE}/${botId}`;
    deleteData(endpoint);
  }, [deleteData]);

  return { deleteBot, isLoading, error, response };
}