'use client'

import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { validateEmail } from '@/utils/validators'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Email = () => {
   const router = useRouter()
   const [form, setForm] = useState({ email: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (form.email) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}
      if (!validateEmail(form.email)) newError.email = 'Email Address is invalid'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         try {
            await api.patch('auth/sendVerificationCode', { email: form.email })
            showToast('success', 'Verification Code has been sent')
            sessionStorage.setItem('email', form.email)
            router.replace('/auth/password-recovery/reset')
         } catch (err) {
            console.error('Verification error:', err);
            const message =
               err instanceof AxiosError
                  ? err.response?.data?.message || 'Unexpected API error'
                  : 'An unexpected error occurred';
            showToast('error', message);
         }
      }
   }
   return (
      <form onSubmit={handleSubmit} className="w-full max-w-md p-10">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Your Email</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Reclaim your access. Reclaim<br />your impact</p>

         {['email'].map((field) => (
            <div key={field} className="mb-[30px]">
               <div className='flex gap-3.5'>
                  <input
                     id={field}
                     name={field}
                     type='email'
                     autoComplete={field === 'email' ? 'email' : ''}
                     value={form[field as keyof typeof form]}
                     onChange={handleChange}
                     className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                           ? 'border-[var(--color6)] text-[var(--color6)]'
                           : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                        }`}
                     placeholder={field.split('_').join(' ')}
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
            Continue
         </button>
      </form>
   )
}

export default Email