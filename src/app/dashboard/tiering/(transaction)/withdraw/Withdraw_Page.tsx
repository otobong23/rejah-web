'use client';
import SUPPORTED_BANKS from '@/constant/SUPPORTED_BANKS';
import { TRANSACTION_RULES_WITHDRAWAL } from '@/constant/Tier';
import { useLoader } from '@/store/LoaderContext';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js'
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const WithdrawPage = () => {
   const { user, setUser } = useUserContext()
   const router = useRouter()
   const [stack, setStack] = useState<number>(1);
   const [amount, setAmount] = useState<string>('');
   const [bankName, setBankName] = useState<string>(user.bankName || '');
   const [accountName, setAccountName] = useState<string>(user.accountName || '');
   const [accountNumber, setAccountNumber] = useState<string>(user.accountNumber || '');
   const [selectedBank, setSelectedBank] = useState<Bank | null>(SUPPORTED_BANKS.find(bank => bank.name === user.bankName) || null);
   const [showBankDropdown, setShowBankDropdown] = useState<boolean>(false);
   const [isResolvingAccount, setIsResolvingAccount] = useState<boolean>(false);
   const [isWithdrawalPassword] = useState<boolean>(Boolean(user.walletPassword));
   const [form, setForm] = useState<FormType>({ bank_name: '', account_name: '', account_number: '', Withdrawal_Password: '', Confirm_Withdrawal_Password: '' })
   const [error, setError] = useState<ErrorType>({})
   const [active, setActive] = useState<boolean>(false)
   const [withdrawalPassword, setWithdrawalPassword] = useState<string>('');
   const { showPageLoader, hidePageLoader } = useLoader()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value })
      setError({ ...error, [e.target.name]: '' })
   }

   useEffect(() => {
      if (!user.bankName && !user.accountName && !user.accountNumber) {
         setStack(1); // go to setup
      } else if (user.walletPassword) {
         setStack(2); // skip setup, go to amount input
      } else {
         setStack(1); // no withdrawal password, go to setup
      }
   }, [user]);

   useEffect(() => {
      if (form.bank_name && form.account_name && form.account_number && form.Withdrawal_Password && form.Confirm_Withdrawal_Password) {
         setActive(true)
      } else {
         setActive(false)
      }
   }, [form])

   // Account name resolution function
   const resolveAccountName = async (accountNumber: string, bankCode: string) => {
      if (accountNumber.length !== 10) return;

      setIsResolvingAccount(true);
      try {
         const response = await api.post(
            '/transaction/resolve_account',
            {
               account_number: accountNumber,
               account_bank: bankCode
            }
         );

         const data = await response.data;

         if (data.status === 'success') {
            if (stack === 1) {
               setForm(prev => ({ ...prev, account_name: data.data.account_name }));
            } else {
               setAccountName(data.data.account_name);
            }
            showToast('success', 'Account name resolved successfully!');
         } else {
            showToast('error', 'Could not resolve account name');
         }
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
            if (stack === 1) {
               setForm(prev => ({ ...prev, account_name: '' }));
            } else {
               setAccountName('');
            }
         } else {
            showToast('error', 'An error occurred')
         }
      } finally {
         setIsResolvingAccount(false);
      }
   };

   const handleAccountDetails = () => {
      if (form.account_number.length === 10) {
         // Auto-resolve if bank is selected
         if (selectedBank) {
            resolveAccountName(form.account_number, selectedBank.code);
         }
      }
   }

   // Handle bank selection
   const handleBankSelect = (bank: Bank) => {
      setSelectedBank(bank);
      setForm({ ...form, bank_name: bank.name });
      setBankName(bank.name);
      setShowBankDropdown(false);
      setError({ ...error, bank_name: '' });

      // Auto-resolve account if account number is already entered
      if (stack === 1 && form.account_number.length === 10) {
         resolveAccountName(form.account_number, bank.code);
      } else if (stack === 2 && accountNumber.length === 10) {
         resolveAccountName(accountNumber, bank.code);
      }
   };

   // Handle account number change in stack 2
   const handleAccountNumberChange = (value: string) => {
      setAccountNumber(value);
      if (value.length === 10 && selectedBank) {
         resolveAccountName(value, selectedBank.code);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (!form.account_number) newError.account_number = 'Bank account is required';
      if (!form.account_name) newError.account_name = 'Bank account name is required';
      if (!form.bank_name) newError.bank_name = 'Bank name is required';
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
               bankName: bankName.trim(),
               accountName: accountName.trim(),
               accountNumber: accountNumber.trim(),
               walletPassword: form.Withdrawal_Password.trim(),
            })
            setUser(response.data)
            hidePageLoader()
            showToast('success', 'Password Changed successfully!')
            setStack(2)
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

   const [withdrawError, setWithdrawError] = useState<ErrorType>()
   const handleWithdraw = async (e: React.FormEvent) => {
      e.preventDefault()
      const newError: typeof error = {}

      if (!withdrawalPassword) newError.withdrawalPassword = 'Withdrawal password is required'
      if (withdrawalPassword !== user.walletPassword) newError.withdrawalPassword = 'Passwords do not match'
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
         newError.amount = 'Enter a valid amount';
      }

      setWithdrawError(newError)
      if (Object.keys(newError).length === 0) {
         showPageLoader()
         try {
            const response = await api.post<UserType>('/transaction/withdraw', {
               amount: Number(amount),
               bankName: bankName.trim(),
               accountName: accountName.trim(),
               accountNumber: accountNumber.trim(),
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
         <div className="flex justify-between items-center">
            <h1 className="text-[40px] font-bold mb-8">Withdraw</h1>
            <Link href='/dashboard/vault/history'>
               <Icon icon='icon-park-outline:history-query' className="text-(--color2) text-3xl" />
            </Link>
         </div>

         <div className='max-w-[396px] mx-auto'>
            {stack === 1 && <div>
               {['account_number', 'bank_name', 'account_name', 'Withdrawal_Password', 'Confirm_Withdrawal_Password'].map((field) => (
                  <div key={field} className="mb-3">
                     <label htmlFor={field} className='text-sm capitalize font-light mb-2.5'>{field !== 'Confirm_Withdrawal_Password' && 'Enter'} {field.split('_').join(' ')}</label>

                     {field === 'bank_name' ? (
                        <div className='relative'>
                           <div
                              onClick={() => setShowBankDropdown(!showBankDropdown)}
                              className={`w-full px-3 py-[18px] rounded-[15px] border-2 cursor-pointer flex justify-between items-center bg-none text-lg
                                 ${error[field]
                                    ? 'border-[var(--color6)] text-[var(--color6)]'
                                    : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                                 }`}
                           >
                              <div className='flex items-center gap-2'>
                                 {selectedBank && (
                                    <img
                                       src={selectedBank.logo}
                                       alt={selectedBank.name}
                                       className="w-6 h-6 object-contain"
                                       onError={(e) => {
                                          e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                       }}
                                    />
                                 )}
                                 <span className={selectedBank ? 'text-[var(--color2)]' : 'text-[#424545]'}>
                                    {selectedBank ? selectedBank.name : 'Select Bank'}
                                 </span>
                              </div>
                              <Icon icon={showBankDropdown ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="text-xl" />
                           </div>

                           {showBankDropdown && (
                              <div className='absolute z-10 w-full mt-1 bg-(--background) border-2 border-[#424545] rounded-[15px] max-h-60 overflow-y-auto shadow-lg'>
                                 {SUPPORTED_BANKS.map((bank) => (
                                    <div
                                       key={bank.code}
                                       onClick={() => handleBankSelect(bank)}
                                       className='flex items-center gap-3 px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                                    >
                                       <img
                                          src={bank.logo}
                                          alt={bank.name}
                                          className="w-8 h-8 object-contain"
                                          onError={(e) => {
                                             e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                          }}
                                       />
                                       <span className='text-[var(--color2)] text-sm'>{bank.name}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className='flex gap-3.5 relative'>
                           <input
                              id={field}
                              name={field}
                              maxLength={field === 'account_number' ? 10 : 100}
                              type={field === 'Withdrawal_Password' || field === 'Confirm_Withdrawal_Password' ? 'password' : 'text'}
                              value={form[field as keyof typeof form]}
                              onChange={(e) => { handleChange(e) }}
                              onKeyUp={() => { field === 'account_number' && handleAccountDetails() }}
                              className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                                 ${error[field]
                                    ? 'border-[var(--color6)] text-[var(--color6)]'
                                    : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                                 }`}
                              placeholder={field.split('_').join(' ')}
                              autoComplete={['bank_name', 'account_name', 'account_number'].includes(field) ? 'text' : field === 'Withdrawal_Password' ? 'current-password' : ''}
                           />
                           {field === 'account_number' && isResolvingAccount && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                 <Icon icon="eos-icons:loading" className="text-xl text-[var(--color2)]" />
                              </div>
                           )}
                        </div>
                     )}

                     {error[field] && (
                        <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
                     )}
                  </div>
               ))}
               <button
                  type="submit"
                  onClick={e => { handleSubmit(e) }}
                  className={`w-full bg-[#0000FF] text-white text-lg font-bold py-[18px] mt-[25px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
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
                  <div className='flex flex-col gap-3'>
                     <div className='relative'>
                        <input type="text"
                           placeholder='Account Number'
                           className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                           value={accountNumber}
                           onChange={(e) => handleAccountNumberChange(e.target.value)}
                           maxLength={10}
                        />
                        {isResolvingAccount && (
                           <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Icon icon="eos-icons:loading" className="text-xl text-[var(--color2)]" />
                           </div>
                        )}
                     </div>
                     <div>
                        <input type="text"
                           placeholder='Account Name'
                           className={`py-[15px] px-3 rounded-[15px] border border-(--color2)/20 text-lg font-medium w-full`}
                           value={accountName}
                           onChange={(e) => setAccountName(e.target.value)}
                        />
                     </div>
                     <div className='relative'>
                        <div
                           onClick={() => setShowBankDropdown(!showBankDropdown)}
                           className={`w-full py-[15px] px-3 rounded-[15px] border border-(--color2)/20 cursor-pointer flex justify-between items-center text-lg font-medium`}
                        >
                           <div className='flex items-center gap-2'>
                              {selectedBank && (
                                 <img
                                    src={selectedBank.logo}
                                    alt={selectedBank.name}
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                       e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                    }}
                                 />
                              )}
                              <span className={selectedBank ? 'text-[var(--color2)]' : 'text-[#424545]'}>
                                 {selectedBank ? selectedBank.name : 'Select Bank'}
                              </span>
                           </div>
                           <Icon icon={showBankDropdown ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="text-xl" />
                        </div>

                        {showBankDropdown && (
                           <div className='absolute z-10 w-full mt-1 bg-(--foreground) border-2 border-[#424545] rounded-[15px] max-h-60 overflow-y-auto shadow-lg'>
                              {SUPPORTED_BANKS.map((bank) => (
                                 <div
                                    key={bank.code}
                                    onClick={() => handleBankSelect(bank)}
                                    className='flex items-center gap-3 px-3 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                                 >
                                    <img
                                       src={bank.logo}
                                       alt={bank.name}
                                       className="w-8 h-8 object-contain"
                                       onError={(e) => {
                                          e.currentTarget.src = 'https://nigerianbanks.xyz/logo/default-image.png';
                                       }}
                                    />
                                    <span className='text-[var(--color2)] text-sm'>{bank.name}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                  <button
                     onClick={() => setStack(3)}
                     className={`w-full bg-[#0000FF] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${accountName && accountNumber && bankName ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!(accountName && accountNumber && bankName)}
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
                     className={`w-full bg-[#0000FF] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${withdrawalPassword ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!withdrawalPassword}
                  >
                     Confirm
                  </button>
               </div>
            )}
         </div>
         <div className='bg-[#040439] text-white p-4 pb-[46px] text-xs rounded-[15px] mt-[25px] max-w-[396px] mx-auto'>
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

export default WithdrawPage