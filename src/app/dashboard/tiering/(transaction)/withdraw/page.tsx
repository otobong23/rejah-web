'use client';
import { TRANSACTION_RULES_WITHDRAWAL } from '@/constant/Tier';
import { useLoader } from '@/store/LoaderContext';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js'
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
   const { user, setUser } = useUserContext()
   const router = useRouter()
   const [stack, setStack] = useState(1);
   const [amount, setAmount] = useState('');
   const [address, setAddress] = useState(user.usdtWallet || '');
   const [isWithdrawalPassword] = useState(Boolean(user.walletPassword));
   const [form, setForm] = useState({ USDT_Wallet: '', Withdrawal_Password: '', Confirm_Withdrawal_Password: '' })
   const [error, setError] = useState<{ [key: string]: string }>({})
   const [active, setActive] = useState(false)
   const [withdrawalPassword, setWithdrawalPassword] = useState('');
   const { showPageLoader, hidePageLoader } = useLoader()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (isWithdrawalPassword) setStack(2);
      else setStack(1);
   }, [isWithdrawalPassword])
   useEffect(() => {
      if (form.USDT_Wallet && form.Withdrawal_Password && form.Confirm_Withdrawal_Password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (!form.USDT_Wallet) newError.USDT_Wallet = 'USDT account is required'
      if (!form.Withdrawal_Password) newError.Withdrawal_Password = 'Withdrawal password is required'
      if (form.Withdrawal_Password !== form.Confirm_Withdrawal_Password) {
         newError.confirm_withdrawal_password = 'Passwords do not match'
      }
      if (form.Withdrawal_Password.length < 6) {
         newError.Withdrawal_Password = 'Withdrawal password must be at least 6 characters'
      }

      setError(newError)
      if (Object.keys(newError).length === 0) {
         showPageLoader()
         try {
            const response = await api.patch<UserType>('/profile/update', {
               usdtWallet: form.USDT_Wallet.trim(),
               walletPassword: form.Withdrawal_Password.trim(),
            })
            setUser(response.data)
            hidePageLoader()
            showToast('success', 'Password Changed successfully!')
         } catch (err) {
            hidePageLoader()
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
         }
      }
   }
   const [withdrawError, setWithdrawError] = useState<{ [key: string]: string }>()
   const handleWithdraw = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (!withdrawalPassword) newError.withdrawalPassword = 'Withdrawal password is required'
      if (withdrawalPassword !== user.walletPassword) newError.withdrawalPassword = 'Passwords do not match'

      setWithdrawError(newError)
      if (Object.keys(newError).length === 0) {
         showPageLoader()
         try {
            const response = await api.post<UserType>('/transaction/withdraw', {
               amount: Number(amount),
               walletAddress: address,
            })
            setUser(response.data)
            hidePageLoader()
            showToast('success', 'Withdrawal request submitted successfully!')
            router.replace('/dashboard/vault/history/')
         } catch (err) {
            hidePageLoader()
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred during Processing')
            }
         }
      }
   }
   return (
      <div className='text-(--color2)'>
         {/* Header */}
         <button onClick={() => stack > 1 ? setStack(prev => prev - 1) : router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Withdraw</h1>

         <div className='max-w-[396px] mx-auto'>
            {stack === 1 && <div>
               {['USDT_Wallet', 'Withdrawal_Password', 'Confirm_Withdrawal_Password'].map((field) => (
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
                  onClick={e => { handleSubmit(e), setStack(2) }}
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
                        placeholder='Wallet Address'
                        className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                     />
                  </div>
                  <button
                     onClick={() => setStack(3)}
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${address ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!address}
                  >
                     Confirm
                  </button>
               </div>
            )}

            {stack === 3 && (
               <div>
                  <h3 className='pb-2 text-xs'>Enter withdrawal password</h3>
                  <div>
                     <div>
                        <input type="password"
                           placeholder='*******'
                           className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                           value={withdrawalPassword}
                           onChange={(e) => setWithdrawalPassword(e.target.value)}
                        />
                     </div>
                     {(withdrawError?.['withdrawalPassword']) && (
                        <p className="text-sm mt-1 text-[#D54244]">{withdrawError?.['withdrawalPassword']}</p>
                     )}
                  </div>
                  <button
                     onClick={handleWithdraw}
                     className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${withdrawalPassword ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!withdrawalPassword}
                  >
                     Confirm
                  </button>
               </div>
            )}
         </div>
         <div className='bg-[#121A24] text-(--color2) p-4 pb-[46px] text-xs rounded-[15px] mt-[25px] max-w-[396px] mx-auto'>
            {TRANSACTION_RULES_WITHDRAWAL.map((rule, index) => (
               <div className='flex items-start gap-2 mb-4' key={index}>
                  <span>{index + 1}.</span>
                  <p>{rule}</p>
               </div>
            ))}
         </div>
      </div>
   )
}

export default page