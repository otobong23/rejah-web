'use client';
import SUPPORTED_BANKS from '@/constant/SUPPORTED_BANKS';
import { useLoader } from '@/store/LoaderContext';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Security = () => {
  const { user, setUser } = useUserContext()
  const router = useRouter()
  const [form, setForm] = useState({ account_number: user.accountNumber || '', account_name: user.accountName || '', withdrawal_password: user.walletPassword || '', confirm_withdrawal_password: user.walletPassword || '' })
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [active, setActive] = useState(false)
  const { showPageLoader, hidePageLoader } = useLoader()
  const [selectedBank, setSelectedBank] = useState<Bank | null>(SUPPORTED_BANKS.find(bank => bank.name === user.bankName) || null);
  const [showBankDropdown, setShowBankDropdown] = useState<boolean>(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

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
        setForm(prev => ({ ...prev, account_name: data.data.account_name}))
        showToast('success', 'Account name resolved successfully!');
      } else {
        showToast('error', 'Could not resolve account name');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        showToast('error', err.response?.data.message)
        setForm(prev => ({ ...prev, account_name: ''}))
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

   const handleBankSelect = (bank: Bank) => {
      setSelectedBank(bank);
      setShowBankDropdown(false);
      setError({ ...error, bank_name: '' });

      // Auto-resolve account if account number is already entered
      resolveAccountName(form.account_number, bank.code);
   };

  useEffect(() => {
    if (form.account_name && form.account_number && form.withdrawal_password && form.confirm_withdrawal_password) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newError: typeof error = {}

    if (!form.account_name) newError.account_name = 'Account name is required'
    if (!form.account_number) newError.account_number = 'Account number is required'
    if (!form.withdrawal_password) newError.withdrawal_password = 'Withdrawal password is required'
    if (form.withdrawal_password !== form.confirm_withdrawal_password) {
      newError.confirm_withdrawal_password = 'Passwords do not match'
    }
    if (form.withdrawal_password.length < 6) {
      newError.withdrawal_password = 'Withdrawal password must be at least 6 characters'
    }

    setError(newError)
    if (Object.keys(newError).length === 0) {
      showPageLoader()
      try {
        const response = await api.patch<UserType>('/profile/update', {
          bankName: selectedBank?.name.trim(),
          accountNumber: form.account_number.trim(),
          accountName: form.account_name.trim(),
          walletPassword: form.withdrawal_password.trim(),
        })
        setUser(response.data)
        hidePageLoader()
        showToast('success', 'User Account updated successfully!')
      } catch (err) {
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
    <div>
      <button onClick={() => router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
        <Icon icon='fluent:ios-arrow-24-regular' className="" />
      </button>
      <h1 className="text-[40px] font-bold mb-8">Security</h1>
      <div className='mt-[35px]'>
        <div className='flex items-center justify-center'>
          <div className='w-[98px] h-[98px] overflow-hidden rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
            {user.profileImage
              ? <img src={user.profileImage} alt="Profile preview" className='w-full object-cover' />
              : <Icon icon="solar:user-bold" className='text-[#808080]' width={48} />}
            <span className='absolute bottom-5 right-3'><Icon icon="mingcute:edit-3-line" className='text-[#000914] text-xl' /></span>
          </div>
        </div>
        <div className='mt-9 max-w-[396px] mx-auto'>
          {['account_number', 'bank_name', 'account_name', 'withdrawal_password', 'confirm_withdrawal_password'].map((field) => (
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

          <div className='my-12 flex flex-col gap-3.5 items-center text-lg font-medium text-(--color2)'>
            <Link href='/auth/password-recovery/' className='opacity-100 hover:opacity-50 transition-all duration-300'>Forget Password</Link>
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Security