import axios from 'axios';
import { ApiEndPoint } from '../../utils';

const api = axios.create({
    baseURL: ApiEndPoint,
    withCredentials: true,
});

// Flag to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void; }> = [];

// Function to process the queue of failed requests
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

        if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh-token') {
            
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