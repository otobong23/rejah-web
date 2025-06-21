'use client'
import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { validateEmail } from '@/utils/validators'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { useLoader } from '@/store/LoaderContext'

const TIMER_KEY = 'twentyFourHourTimerStart';

const Login = () => {
   const {showPageLoader, hidePageLoader} = useLoader()
   const router = useRouter()
   const [form, setForm] = useState({ email: '', username: '', password: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      const startTime = localStorage.getItem(TIMER_KEY);
      if(startTime)localStorage.removeItem(TIMER_KEY);
   }, [])

   useEffect(() => {
      if (form.email && form.username && form.password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (!validateEmail(form.email)) newError.phone = 'Email is invalid'
      if (form.username.length < 3) newError.username = 'Username too short'
      if (form.username.includes(' ')) newError.username = 'Username cannot contain spaces'
      if (form.password.length < 6) newError.password = 'Password too short'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         showPageLoader()
         try {
            const data = await api.post('/auth/login', {
               email: form.email,
               password: form.password
            });
            Cookies.set('userToken', data.data.access_token, { expires: 7, secure: true, sameSite: 'lax' })
            console.log('success', 'Logged in successfully!')
            router.replace('/dashboard')
         } catch (err) {
            console.error(err)
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
         hidePageLoader()
      }
   }
   return (
      <form onSubmit={handleSubmit} className="w-full max-w-md p-10">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Login</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Welcome back user — check in<br />& claim your daily reward.</p>

         {['email', 'username', 'password'].map((field) => (
            <div key={field} className="mb-[30px]">
               <div className='flex gap-3.5'>
                  {/* {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>} */}
                  <input
                     id={field}
                     name={field}
                     type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                     value={form[field as keyof typeof form]}
                     onChange={handleChange}
                     className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                           ? 'border-[var(--color6)] text-[var(--color6)]'
                           : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                        }`}
                     placeholder={field.split('_').join(' ')}
                     autoComplete={field === 'email' ? 'email' : field === 'username' ? 'username' : field === 'password' ? 'new-password' : ''}
                  />
               </div>
               {error[field] && (
                  <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
               )}
            </div>
         ))}

         <button
            type="submit"
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
         >
            Continue
         </button>
         <p className='text-center text-sm mt-5 text-[var(--color2)]'>Don&apos;t have an account <Link className='text-[var(--color7)] hover:opacity-80 transition-all duration-300' href={'/auth/signup/'}>Sign-up</Link></p>
         <p className='text-center text-sm mt-1 text-[var(--color2)]'><Link className='text-[var(--color7)] hover:opacity-80 transition-all duration-300' href={'/auth/password-recovery/'}>Forgotten Password</Link></p>


         {/* Modal */}
         {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-[15px]">
            <div className="text-(--color2) bg-[radial-gradient(96.4%_96.4%_at_7.14%_3.6%,_rgba(0, 0, 0, 0.9)_0%,_rgba(40, 63, 11, 0.2)_0.01%,_rgba(15, 15, 34, 0.5)_100%)]/50 backdrop-blur-sm rounded-2xl border-2 shadow-lg w-full max-w-md p-6 relative">
               
            </div>
         </div> */}
      </form>
   )
}

export default Login