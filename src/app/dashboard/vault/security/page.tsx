'use client';
import { useLoader } from '@/store/LoaderContext';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const metadata:Metadata = {
   title: "Security",
}

const page = () => {
  const { user, setUser } = useUserContext()
  const router = useRouter()
  const [form, setForm] = useState({ usdt_wallet: user.usdtWallet || '', withdrawal_password: user.walletPassword || '', confirm_withdrawal_password: user.walletPassword || '' })
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [active, setActive] = useState(false)
  const { showPageLoader, hidePageLoader } = useLoader()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  useEffect(() => {
    if (form.usdt_wallet && form.withdrawal_password && form.confirm_withdrawal_password) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newError: typeof error = {}

    if (!form.usdt_wallet) newError.usdt_wallet = 'USDT account is required'
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
          usdtWallet: form.usdt_wallet.trim(),
          walletPassword: form.withdrawal_password.trim(),
        })
        setUser(response.data)
        hidePageLoader()
        showToast('success', 'Password Changed successfully!')
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
          {['usdt_wallet', 'withdrawal_password', 'confirm_withdrawal_password'].map((field) => (
            <div key={field} className="mb-[30px]">
              <label htmlFor={field} className='text-lg font-medium text-(--color2) pb-4'>{field !== 'usdt_wallet' ? field.split('_').join(' ').toLowerCase() : 'USDT ' + field.split('_')[1]}</label>
              <div className='flex gap-3.5'>
                <input
                  id={field}
                  name={field}
                  type={field === 'usdt_wallet' ? 'text' : 'password'}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                    ${error[field]
                      ? 'border-[var(--color6)] text-[var(--color6)]'
                      : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                    }`}
                  autoComplete={field === 'usdt_wallet' ? 'text' : 'password'}
                />
              </div>
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

export default page