"use client";
import React, { useEffect, useState } from 'react'
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';

const Waker = ({ children }: { children: React.ReactNode }) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;

        const interval = setInterval(async () => {
            try {
                const greetData = await api({});
                console.log(greetData);
                setLoaded(true);
                clearInterval(interval); // Stop retrying if successful
            } catch (err) {
                attempts += 1;
                if (err instanceof AxiosError) {
                    showToast('error', err.response?.data.message ?? "No Internet Connection, Please try again later")
                } else {
                    showToast('error', 'An error occurred please reload')
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval); // Stop after maxAttempts
                }
            }
        }, 3000); // Every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <>{children}</>
    )
}

export default Waker;
   