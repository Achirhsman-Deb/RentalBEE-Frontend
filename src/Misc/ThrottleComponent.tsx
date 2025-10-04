import { useRef, useCallback } from "react";

export function useThrottledCallback(callback: () => void, delay: number) {
    const lastCalledRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const throttledFunction = useCallback(() => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCalledRef.current;

        if (timeSinceLastCall >= delay) {
            lastCalledRef.current = now;
            callback();
        } else if (!timeoutRef.current) {
            const timeRemaining = delay - timeSinceLastCall;
            timeoutRef.current = setTimeout(() => {
                lastCalledRef.current = Date.now();
                callback();
                timeoutRef.current = null;
            }, timeRemaining);
        }
    }, [callback, delay]);

    const cancel = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return [throttledFunction, cancel] as const;
}
