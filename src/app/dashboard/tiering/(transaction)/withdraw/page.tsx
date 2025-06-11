'use client';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
   const router = useRouter()
   const [stack, setStack] = useState(1);
   const [amount, setAmount] = useState('');
   const [account, setAccount] = useState('');
   const [isWithdrawalPassword, setIsWithdrawalPassword] = useState(false);
   const [form, setForm] = useState({ USDT_Account: '', Withdrawal_Password: '', Confirm_Withdrawal_Password: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)
   const [withdrawalPassword, setWithdrawalPassword] = useState('');

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (isWithdrawalPassword) setStack(2);
      else setStack(1);
   }, [isWithdrawalPassword])
   useEffect(() => {
      if (form.USDT_Account && form.Withdrawal_Password && form.Confirm_Withdrawal_Password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   // const handleSubmit = (e: React.FormEvent) => {
   //    e.preventDefault()
   //    const newError: typeof error = {}

   //    if (!validatePhone(form.phone)) newError.phone = 'Phone number is invalid'
   //    if (form.username.length < 3) newError.username = 'Username too short'
   //    if (form.username.includes(' ')) newError.username = 'Username cannot contain spaces'
   //    if (form.password.length < 6) newError.password = 'Password too short'

   //    setError(newError)
   //    if (Object.keys(newError).length === 0) {
   //       // Perform login logic here
   //       showToast('success', 'Logged In successfully!')
   //    }
   // }
   return (
      <div className='text-(--color2)'>
         {/* Header */}
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Withdraw</h1>

         <div className='max-w-[396px] mx-auto'>
            {stack === 1 && <div>
               {['USDT_Account', 'Withdrawal_Password', 'Confirm_Withdrawal_Password'].map((field) => (
                  <div key={field} className="mb-3">
                     <label htmlFor={field} className='text-sm font-light mb-2.5'>{field !== 'Confirm_Withdrawal_Password' && 'Enter'} {field.split('_').join(' ')}</label>
                     <div className='flex gap-3.5'>
                        <input
                           id={field}
                           name={field}
                           type={field === 'Withdrawal_Password' || field === 'Confirm_Withdrawal_Password' ? 'password' : 'text'}
                           value={form[field as keyof typeof form]}
                           onChange={handleChange}
                           className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                                 ? 'border-[var(--color6)] text-[var(--color6)]'
                                 : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                              }`}
                           placeholder={field.split('_').join(' ')}
                           autoComplete={field === 'USDT_Account' ? 'number' : field === 'Withdrawal_Password' ? 'current-password' : ''}
                        />
                     </div>
                     {error[field] && (
                        <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
                     )}
                  </div>
               ))}
               <button
                  type="submit"
                  onClick={() => setStack(2)}
                  className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[25px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
               >
                  Confirm
               </button>
            </div>}

            {stack === 2 && (
               <div className='flex flex-col mt-6'>
                  <h3 className='pb-2 text-xs'>Enter Amount</h3>
                  <div className='flex items-stretch gap-2 pb-3'>
                     <div className='flex justify-center items-center text-lg py-3.5 px-7 rounded-[15px] border-white border'>USDT</div>
                     <input type="text"
                        placeholder='600,000.00'
                        className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                     />
                  </div>
                  <div>
                     <input type="text"
                        placeholder='Account Number'
                        className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                     />
                  </div>
                  <button
                     onClick={() => setStack(3)}
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${account ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!account}
                  >
                     Confirm
                  </button>
               </div>
            )}

            {stack === 3 && (
               <div>
                  <h3 className='pb-2 text-xs'>Enter withdrawal password</h3>
                  <div>
                     <input type="password"
                        placeholder='*******'
                        className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                        value={withdrawalPassword}
                        onChange={(e) => setWithdrawalPassword(e.target.value)}
                     />
                  </div>
                  <button
                     onClick={() => setStack(3)}
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${account ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!account}
                  >
                     Confirm
                  </button>
               </div>
            )}
         </div>
      </div>
   )
}

export default page