import axios from 'axios';
import { ApiEndPoint } from '../../utils';

const api = axios.create({
    baseURL: ApiEndPoint,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void; }> = [];

const processQueue = (error: any | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(true);
        }
    });
    failedQueue = [];
};

// --- RESPONSE INTERCEPTOR ---

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const excludedEndpoints = ['/auth/sign-in', '/auth/sign-up', '/auth/refresh-token','/auth/google','/auth/forgot-pass','/auth/send-otp','/auth/logout'];

        if (
            error.response?.status === 401 && 
            !excludedEndpoints.includes(originalRequest.url) && 
            !originalRequest._retry 
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;
            originalRequest._retry = true;

            try {
                await api.get('/auth/refresh-token');
                isRefreshing = false;
                processQueue(null);
                return api(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;