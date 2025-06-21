'use client'

import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { AxiosError } from 'axios'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const metadata:Metadata = {
   title: "New Password",
}

const New_Password = () => {
   const router = useRouter()
   const [form, setForm] = useState({ password: '', confirm_password: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if ((form.password && form.confirm_password)) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}
      if (form.password.length < 6) newError.password = 'Password too short'
      if (form.password !== form.confirm_password) newError.confirm_password = 'Passwords do not match'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         try {
            const updatePasswordToken = sessionStorage.getItem('updatePasswordToken')
            if (!updatePasswordToken) {
               showToast('error', 'Failed to change password')
               router.replace('/auth/password-recovery/')
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${updatePasswordToken}`;
            await api.patch('auth/change-password', { newPassword: form.password })
            showToast('success', 'Password changed successfully')
            sessionStorage.removeItem('updatePasswordToken')
            router.replace('/auth/login')
         } catch (err) {
            console.error('Change-Password Error:', err);
            const message =
               err instanceof AxiosError
                  ? err.response?.data?.message || 'Unexpected API error'
                  : 'An unexpected error occurred';
            showToast('error', message);
         }
      }
   }
   return (
      <form onSubmit={handleSubmit} className="p-10 w-full max-w-md">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Login</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Reclaim your access. Reclaim<br />your impact</p>

         {['password', 'confirm_password'].map((field) => (
            <div key={field} className="mb-[30px]">
               <div className='flex gap-3.5'>
                  <input
                     id={field}
                     name={field}
                     type='password'
                     value={form[field as keyof typeof form]}
                     onChange={handleChange}
                     className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                           ? 'border-[var(--color6)] text-[var(--color6)]'
                           : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                        }`}
                     placeholder={field.split('_').join(' ')}
                     autoComplete={field === 'password' ? 'new-password' : ''}
                  />
               </div>
               {error[field] && (
                  <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
               )}
            </div>
         ))}

         <button
            type="submit"
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
         >
            Confirm
         </button>
      </form>
   )
}

export default New_Password