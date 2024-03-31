import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { TransformFunction, UseDataFetchReturn } from '../types/StateSummary';
import { AxiosResponse, Bot } from '../types/Interfaces';

const BASE_URL: string = process.env.REACT_APP_DATABASE_URL || '';

export const useDataFetch = <T>(endpoint: string, transform: TransformFunction<T>): UseDataFetchReturn<T> => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await axios.get(`${BASE_URL}/${endpoint}`);
                const transformedData = response.data.data.map(transform);
                setData(transformedData);
                setTotalCount(response.data.count);
                setIsLoading(false);
            } catch (error: unknown) {
                let message = "An unknown error occurred";
                if (error instanceof Error) {
                    message = error.message;
                } else if (axios.isAxiosError(error)) {
                    const axiosError = error;
                    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                        message = axiosError.response.data.message;
                    } else if (axiosError.message) {
                        message = axiosError.message;
                    }
                }
                setError(message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint, transform]);
    return { data, isLoading, error, totalCount };
};

export function useDataUpdate<T>() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<T | null>(null);

    const updateData = useCallback(async (endpoint: string, data: T) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.put(`${BASE_URL}/${endpoint}`, data);
            setResponse(res.data);
            setIsLoading(false);
        } catch (error: any) {
            let message = "An unknown error occurred";
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data.message || error.message;
            }
            setError(message);
            setIsLoading(false);
            setResponse(null);
        }
    }, []);

    return { updateData, isLoading, error, response };
}

export function useDataCreate<TRequest, TResponse>() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<AxiosResponse<TResponse> | null>(null);

    const createData = useCallback(async (endpoint: string, data: TRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.post<TResponse>(`${BASE_URL}/${endpoint}`, data);
            setResponse(res);
        } catch (error: any) {
            let message = "An unknown error occurred";
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data.message || error.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { createData, isLoading, error, response };
}

export function useDataDelete<T>() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<AxiosResponse<any> | null>(null);

    const deleteData = useCallback(async (endpoint: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.delete(`${BASE_URL}/${endpoint}`);
            setResponse(res);
        } catch (error: any) {
            let message = "An unknown error occurred";
            if (axios.isAxiosError(error) && error.response) {
                message = error.response.data.message || error.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { deleteData, isLoading, error, response };
}