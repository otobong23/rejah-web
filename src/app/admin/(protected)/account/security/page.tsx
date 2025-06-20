'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import api from '@/utils/axios';
import { showToast } from '@/utils/alert';
import { AxiosError } from 'axios';
import { useAdminContext } from '@/store/adminContext';

const page = () => {
   const router = useRouter()
   const { admin, setAdmin } = useAdminContext()
   const [form, setForm] = useState({ email: admin.email || '', password: admin.password || '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }
   useEffect(() => {
      setActive(!!(form.email || form.password));
   }, [form])

   const handleSubmit = async () => {
      try {
         const response = await api.patch<adminType>("/admin/updateAdmin", {
            email: form.email,
            password: form.password
         });
         console.log(response.data)
         setAdmin(response.data)
         showToast('info', 'Changes Made successfully')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      }
   }
   return (
      <div className='text-(--color2)'>
         <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300"
         >
            <Icon icon="fluent:ios-arrow-24-regular" />
         </button>
         <div className='flex justify-between items-center pb-10'>
            <h1 className="text-[40px] font-bold">Security</h1>
            <div className='flex items-center justify-center'>
               <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                  <Icon icon="solar:user-bold" className='text-[#808080]' width={23} />
               </div>
            </div>
         </div>

         <div className='mt-9 max-w-[396px] mx-auto'>
            {['email', 'password'].map((field) => (
               <div key={field} className="mb-[30px]">
                  <label htmlFor={field} className='text-sm font-light mb-2.5 capitalize'>{field.split('_').join(' ')}</label>
                  <div className='flex gap-3.5'>
                     <input
                        id={field}
                        name={field}
                        disabled={field === 'email'}
                        type={field === 'password' ? 'password' : 'email'}
                        value={form[field as keyof typeof form]}
                        onChange={handleChange}
                        className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                              ? 'border-[var(--color6)] text-[var(--color6)]'
                              : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                           }`}
                        placeholder={field.split('_').join(' ')}
                        autoComplete={field === 'password' ? 'password' : 'email'}
                     />
                  </div>
                  {error[field] && (
                     <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
                  )}
               </div>
            ))}

            <button
               type="submit"
               onClick={handleSubmit}
               className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default page