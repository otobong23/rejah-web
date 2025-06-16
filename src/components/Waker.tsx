"use client";
import React, { useEffect } from 'react'
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';


const Waker = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        const greet = async () => {
            try {
                const greetData = await api({})
                console.log(greetData)
            } catch (err) {
                if (err instanceof AxiosError) {
                    showToast('error', err.response?.data.message)
                } else {
                    showToast('error', 'An error occurred please reload')
                }
            }
        }
        greet()
    }, [])
    return (
        <>{children}</>
    )
}

export default Waker