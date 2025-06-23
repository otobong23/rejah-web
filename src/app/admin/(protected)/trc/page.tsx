'use client'
import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { Icon } from '@iconify/react/dist/iconify.js'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import Link from 'next/link'

const page = () => {
   const router = useRouter()
   const [totalUsers, setTotalUsers] = useState(0)
   const [totalCrews, setTotalCrews] = useState(0)

   useEffect(() => {
      const getTotal = async () => {
         const adminToken = Cookies.get("adminToken");

         if (!adminToken) {
            router.replace("/admin/auth/login");
            return;
         }
         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
            const totalUsersResponse = await api<number>('/admin/totalUsers')
            const totalCrewsResponse = await api<number>('/admin/totalCrews')
            setTotalUsers(totalUsersResponse.data)
            setTotalCrews(totalCrewsResponse.data)
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
         }
      }
      getTotal()
   }, [])
   return (
      <div className='flex flex-col justify-between h-[calc(100vh_-_120px)]'>
         <div>
            <button
               onClick={() => router.back()}
               className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300"
            >
               <Icon icon="fluent:ios-arrow-24-regular" />
            </button>
            <div className='flex justify-between items-center pb-10'>
               <h1 className="text-[40px] font-bold">TRC</h1>
            </div>

            <div className={`px-5 py-4 mb-9 rounded-[15px] bg-[#0A1D28]`}>
               <h1 className={`text-lg font-medium mb-1`}>Total Users</h1>
               <h2 className={`text-4xl font-extrabold pb-5`}>{totalUsers}</h2>
               <h1 className={`text-lg font-medium mb-1`}>Total Crews</h1>
               <h2 className={`text-4xl font-extrabold`}>{totalCrews}</h2>
            </div>
            <div className='text-xs font-medium flex justify-between items-center'>
               <span>0%</span>
               <span>100%</span>
            </div>
            <div className='w-full h-[9px] rounded-[10px] bg-white/60 mt-1 relative overflow-hidden'>
               <div style={{ width: 50 + '%' }} className={`h-full rounded-[10px] absolute top-0 left-0 bg-[#3D6354]`}></div>
            </div>
         </div>
         <div className='flex flex-col gap-3'>
            {['users', 'crews'].map(item => <Link href={`trc/${item}`} key={item} className={`w-full flex justify-center items-center text-2xl font-semibold text-(--color2) py-6 rounded-[20px] ${item === 'users' ? 'bg-[#101924]' : 'bg-[#003B46]'}`}>View All {item}</Link>)}
         </div>
      </div>
   )
}

export default page