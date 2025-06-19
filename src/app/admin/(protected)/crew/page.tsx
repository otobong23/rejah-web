'use client'
import { useLoader } from '@/store/LoaderContext'
import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { Icon } from '@iconify/react/dist/iconify.js'
import { AxiosError } from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  const [crews, setCrews] = useState<CrewType[]>()
  useEffect(() => {
    const getCrews = async () => {
      const adminToken = Cookies.get("adminToken");

      if (!adminToken) {
        router.replace("/admin/auth/login");
        return;
      }
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
        const response = await api.get<CrewResponse>("/admin/crews?limit=50&page=1");
        setCrews(response.data.crews);
      } catch (err) {
        if (err instanceof AxiosError) {
          showToast('error', err.response?.data.message)
        } else {
          showToast('error', 'An error occurred')
        }
      }
    };
    getCrews()
  }, [])
  return (
    <div className='text-(--color2)'>
      <div className='flex justify-between items-center pb-10'>
        <h1 className="text-[40px] font-bold">Crew POD</h1>
        <div className='flex items-center justify-center'>
          <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
            <Icon icon="eos-icons:admin" className='text-[#808080]' width={23} />
          </div>
        </div>
      </div>

      <div className='max-w-[652px] flex p-[13px] gap-5 items-center border border-(--color2) rounded-[15px]'>
        <button>
          <Icon icon="material-symbols:search" className='text-xl text-(--color2)' />
        </button>
        <input type="text" placeholder='Search' className='text-lg w-full' />
      </div>

      <div className='max-w-[652px] mx-auto max-h-[500px] overflow-scroll no-scrollbar flex flex-col gap-3 mt-4'>
        {Array.isArray(crews) && crews ? crews.map(({ userID, totalCrewDeposits }, i) => (
          <Link href={'crew/' + userID} key={userID + i} className='py-3 px-[25px] rounded-[15px] bg-white/7 flex items-center gap-3'>
            <div className='w-[50px] h-[50px] flex justify-center items-center bg-(--color2) rounded-full'>
              <Icon icon='solar:user-bold' className='text-2xl text-[#808080]' />
            </div>
            <div>
              <h2 className='text-[#C3C3C3] text-sm font-semibold'>Crew_{userID}</h2>
              <p className='text-(--color2)/50 text-xs'>1</p>
              <p className='text-(--color2)/50 text-xs'>Total Deposit | {totalCrewDeposits}</p>
            </div>
          </Link>
        )) : <p className="text-center text-sm text-white/60">No Crew yet.</p>}
      </div>
    </div>
  )
}

export default page