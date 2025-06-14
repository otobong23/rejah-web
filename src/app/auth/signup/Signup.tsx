'use client'

import { showToast } from '@/utils/alert'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { validateEmail } from '@/utils/validators'
import api from '@/utils/axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { AxiosError } from 'axios'
import Cookies from "js-cookie";
import { useLoader } from '@/store/LoaderContext'

export default function Signup() {
   const router = useRouter()
   const [form, setForm] = useState({ email: '', username: '', password: '', confirm_password: '', recruiter_code: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)
   const searchParams = useSearchParams();
   const refCode = searchParams.get('code');
   const filter = searchParams.get('filter')
   const {showPageLoader, hidePageLoader} = useLoader()
   useEffect(() => {
      console.log(filter)
      if(refCode) setForm(prev => ({
         ...prev, recruiter_code: refCode
      }));
   },[])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (form.email && form.username && form.password && form.confirm_password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      // if (!form.phone.length) newError.phone = 'Phone number is required'
      // if (!form.username.length) newError.username = 'Username is required'
      //  if (!form.recruiter_code.includes('@')) newError.recruiter_code = 'Enter a valid email'
      // if (!form.password.length) newError.password = 'Password is required'
      // if (!form.confirm_password.length) newError.confirm_password = 'Confirm password is required'


      if (!validateEmail(form.email)) newError.phone = 'Email is invalid'
      if (form.username.length < 3) newError.username = 'Username too short'
      if (form.username.includes(' ')) newError.username = 'Username cannot contain spaces'
      if (form.password.length < 6) newError.password = 'Password too short'
      if (form.confirm_password !== form.password) newError.confirm_password = 'Passwords do not match'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         // Perform signup logic here
         showPageLoader()
         try {
            const data = await api.post('/auth/signup', {
               email: form.email,
               username: form.username,
               password: form.password,
               referral_code: form.recruiter_code || undefined
            });
            console.log(data);
            Cookies.set('userToken', data.data.access_token, { expires: 7, secure: true, sameSite: 'lax' })
            hidePageLoader()
            router.replace('/dashboard')
         } catch (err) {
            console.error(err)
            hidePageLoader()
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }

      }
   }

   return (
      <form onSubmit={handleSubmit} className="w-full max-w-md p-10">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Signup</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Welcome to REJA — where<br />impact meets innovation.</p>

         {['email', 'username', 'password', 'confirm_password', 'recruiter_code'].map((field) => (
            <div key={field} className="mb-[30px]">
               {field === 'confirm_password' && <label htmlFor={field} className="block mb-[10px] text-[var(--color2)] text-sm capitalize">
                  {field.split('_').join(' ')}
               </label>}
               <div className='flex gap-3.5'>
                  {/* {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>} */}
                  <input
                     id={field}
                     name={field}
                     type={field === 'password' || field === 'confirm_password' ? 'password' : field === 'email' ? 'email' : 'text'}
                     value={form[field as keyof typeof form]}
                     onChange={handleChange}
                     disabled={field === 'recruiter_code' && refCode ? true : false}
                     className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                           ? 'border-[var(--color6)] text-[var(--color6)]'
                           : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                        }`}
                     placeholder={field.split('_').join(' ') + (field === 'recruiter_code' ? ' (optional)' : '')}
                     autoComplete={field === 'email' ? 'email' : field === 'username' ? 'username' : field === 'password' ? 'new-password' : field === 'confirm_password' ? 'new-password' : ''}
                  />
               </div>
               {error[field] && (
                  <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
               )}
            </div>
         ))}

         <button
            type="submit"
            className={`w-full bg-[var(--color7)] text-white text-lg font-bold py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
         >
            Continue
         </button>
         <p className='text-center text-sm mt-5 text-[var(--color2)]'>Already have an account <Link className='text-[var(--color7)] hover:opacity-80 transition-all duration-300' href={'/auth/login/'}>Login</Link></p>
      </form>
   )
}
