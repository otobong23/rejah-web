'use client';
import { showToast } from '@/utils/alert';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
  const router = useRouter()
  const [form, setForm] = useState({ usdt_account: '', withdrawal_password: '', confirm_withdrawal_password: ''})
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [active, setActive] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  useEffect(() => {
    if (form.usdt_account && form.withdrawal_password && form.confirm_withdrawal_password) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [form])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newError: typeof error = {}

    if (!form.usdt_account) newError.usdt_account = 'USDT account is required'
    if (!form.withdrawal_password) newError.withdrawal_password = 'Withdrawal password is required'
    if (form.withdrawal_password !== form.confirm_withdrawal_password) {
      newError.confirm_withdrawal_password = 'Passwords do not match'
    }
    if (form.withdrawal_password.length < 6) {
      newError.withdrawal_password = 'Withdrawal password must be at least 6 characters'
    }


    setError(newError)
    if (Object.keys(newError).length === 0) {
      // Perform login logic here
      showToast('success', 'Password Changed successfully!')
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
              <div className='w-[98px] h-[98px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                <Icon icon="solar:user-bold" className='text-[#808080]' width={48} />
                <span className='absolute bottom-5 right-3'><Icon icon="mingcute:edit-3-line" className='text-[#000914] text-xl' /></span>
              </div>
            </div>
            <div className='mt-9 max-w-[396px] mx-auto'>
              {['usdt_account', 'withdrawal_password', 'confirm_withdrawal_password'].map((field) => (
                <div key={field} className="mb-[30px]">
                  <label htmlFor={field} className='text-lg font-medium text-(--color2) pb-4'>{field !== 'usdt_account' ? field.split('_').join(' ').toLowerCase() : 'USDT '+field.split('_')[1]}</label>
                  <div className='flex gap-3.5'>
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
                      autoComplete={field === 'email' ? 'email' : field === 'whatsapp_no' ? 'phone' : ''}
                    />
                  </div>
                  {error[field] && (
                    <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
                  )}
                </div>
              ))}
    
              <div className='my-12 flex flex-col gap-3.5 items-center text-lg font-medium text-(--color2)'>
                <button className='opacity-100 hover:opacity-50 transition-all duration-300'>Forget Password</button>
              </div>
    
              <button
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