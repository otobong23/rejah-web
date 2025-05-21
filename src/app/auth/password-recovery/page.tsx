'use client'

import { showToast } from '@/utils/alert'
import { validatePhone } from '@/utils/validators'
import { useEffect, useState } from 'react'

const Email = () => {
   const [form, setForm] = useState({ phone: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (form.phone) {
         setActive(true)
      } else {
         setActive(false)
      }
   },[form])

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}
      if (!validatePhone(form.phone)) newError.phone = 'phone number is invalid'

      setError(newError)
      if (Object.keys(newError).length === 0) {
         // Perform login logic here
         showToast('success', 'Phone number is valid')
      }
   }
  return (
    <form onSubmit={handleSubmit} className="p-10 w-full max-w-md">
         <h1 className="text-[40px] leading-normal font-bold text-[var(--color2)] mb-[10px] text-center">Your Phone</h1>
         <p className='text-center text-sm mb-10 text-[var(--color2)]'>Reclaim your access. Reclaim<br />your impact</p>

         {['phone'].map((field) => (
            <div key={field} className="mb-[30px]">
               <div className='flex gap-3.5'>
                  {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>}
                  <input
                     id={field}
                     name={field}
                     type='phone'
                     autoComplete={field === 'phone' ? 'phone' : ''}
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