'use client'
import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie";


const Login = () => {
   const router = useRouter()
   const [form, setForm] = useState({ username: '', password: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (form.username && form.password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (form.username.length < 3) newError.username = 'Username too short'
      if (form.username.includes(' ')) newError.username = 'Username cannot contain spaces'
      if (form.password.length < 6) newError.password = 'Password too short'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         try {
            const data = await api.post('/admin/auth/login', {
               username: form.username,
               password: form.password
            });
            Cookies.set('adminToken', data.data.access_token, { expires: 7, secure: true, sameSite: 'lax' })
            console.log('success', 'Logged in successfully!')
            router.replace('/admin/dashboard')
         } catch (err) {
            console.error(err)
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during signup')
            }
         }
      }
   }
   return (
      <div className="bg-(--color4) lg:bg-[url('/Desktop_bg.png')] bg-cover bg-no-repeat bg-center relative text-(--color2)">
         <div className="min-h-screen flex items-center justify-center ">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-10">
               <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Admin Login</h1>
               <p className='text-center text-sm mb-10 text-[var(--color2)]'>Welcome back Admin — check in<br />& control users actions daily.</p>

               {['username', 'password'].map((field) => (
                  <div key={field} className="mb-[30px]">
                     <div className='flex gap-3.5'>
                        {/* {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>} */}
                        <input
                           id={field}
                           name={field}
                           type={field === 'password' ? 'password' : 'text'}
                           value={form[field as keyof typeof form]}
                           onChange={handleChange}
                           className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                                 ? 'border-[var(--color6)] text-[var(--color6)]'
                                 : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                              }`}
                           placeholder={field.split('_').join(' ')}
                           autoComplete={field === 'username' ? 'username' : field === 'password' ? 'new-password' : ''}
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
            </form>
         </div>
      </div>
   )
}

export default Login