'use client'

import { showToast } from '@/utils/alert'
import { validatePhone } from '@/utils/validators'
import { useEffect, useState } from 'react'

export default function Signup() {
   const [form, setForm] = useState({ phone: '', username: '', password: '', confirm_password: '', recruiter_code: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (form.phone && form.username && form.password && form.confirm_password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      // if (!form.phone.length) newError.phone = 'Phone number is required'
      // if (!form.username.length) newError.username = 'Username is required'
      //  if (!form.recruiter_code.includes('@')) newError.recruiter_code = 'Enter a valid email'
      // if (!form.password.length) newError.password = 'Password is required'
      // if (!form.confirm_password.length) newError.confirm_password = 'Confirm password is required'


      if (!validatePhone(form.phone)) newError.phone = 'Phone number is invalid'
      if (form.username.length < 3) newError.username = 'Username too short'
      if (form.username.includes(' ')) newError.username = 'Username cannot contain spaces'
      if (form.password.length < 6) newError.password = 'Password too short'
      if (form.confirm_password !== form.password) newError.confirm_password = 'Passwords do not match'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         // Perform signup logic here
         showToast('success','Signed up!')
      }
   }

   return (
      <form onSubmit={handleSubmit} className="p-10 w-full max-w-md">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Signup</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Welcome to REJA — where<br />impact meets innovation.</p>

         {['phone', 'username', 'password', 'confirm_password', 'recruiter_code'].map((field) => (
            <div key={field} className="mb-[30px]">
               {field === 'confirm_password' && <label htmlFor={field} className="block mb-[10px] text-[var(--color2)] text-sm capitalize">
                  {field.split('_').join(' ')}
               </label>}
               <div className='flex gap-3.5'>
                  {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>}
                  <input
                     id={field}
                     name={field}
                     type={field === 'password' || field === 'confirm_password' ? 'password' : 'text'}
                     value={form[field as keyof typeof form]}
                     onChange={handleChange}
                     className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                           ? 'border-[var(--color6)] text-[var(--color6)]'
                           : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                        }`}
                     placeholder={field.split('_').join(' ') + (field === 'recruiter_code' ? ' (optional)' : '')}
                     autoComplete={field === 'phone' ? 'tel' : field === 'username' ? 'username' : field === 'password' ? 'new-password' : field === 'confirm_password' ? 'new-password' : ''}
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
