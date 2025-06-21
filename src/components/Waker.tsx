"use client";
import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';

const Waker = ({ children }: { children: React.ReactNode }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchData = async () => {
            while (attempts < maxAttempts) {
                try {
                    const greetData = await api({});
                    console.log(greetData);
                    setLoaded(true);
                    break; // Exit loop on success
                } catch (err) {
                    attempts++;
                    if (err instanceof AxiosError) {
                        showToast('error', err.response?.data.message ?? "No Internet Connection, Please try again later");
                    } else {
                        showToast('error', 'An error occurred, please reload');
                    }
                    if (attempts >= maxAttempts) break;
                    await delay(3000); // Wait 3 seconds before retrying
                }
            }
        };

        fetchData();
    }, []);

    return <>{children}</>;
};

export default Waker;
