'use client';
import { useLoader } from '@/store/LoaderContext';
import { useUserContext } from '@/store/userContext';
import { showToast } from '@/utils/alert';
import api from '@/utils/axios';
import toBase64 from '@/utils/file';
import { validateEmail } from '@/utils/validators';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression';
import Cookies from "js-cookie";

const page = () => {
  const { showPageLoader, hidePageLoader } = useLoader()
  const { user, setUser } = useUserContext()
  const router = useRouter()
  const [form, setForm] = useState({ email: user.email, whatsapp_no: user.whatsappNo || '', facebook: user.facebook || '', telegram: user.telegram || '' })
  const [profileImage, setProfileImage] = useState<File | undefined>()
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [active, setActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }
  const MAX_FILE_SIZE_MB = 5;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected && selected.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      alert('File too large. Max size is 5MB.');
      return;
    }
    try {
      const options = {
        maxSizeMB: MAX_FILE_SIZE_MB,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selected, options);
      setProfileImage(compressedFile);
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreviewImage(objectUrl);
    } catch (error) {
      console.error('Image compression error:', error);
      showToast('error', 'Failed to compress image.');
    }
  }

  useEffect(() => {
    setActive(!!(form.whatsapp_no || form.facebook || form.telegram || profileImage));
  }, [form, profileImage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newError: typeof error = {}

    if (!validateEmail(form.email)) newError.email = 'Email is invalid'

    setError(newError)
    if (Object.keys(newError).length === 0) {
      showPageLoader()
      let imageBase64 = ''
      if (profileImage) imageBase64 = await toBase64(profileImage);
      try {
        const response = await api.patch<UserType>('/profile/update', {
          whatsappNo: form.whatsapp_no.trim(),
          facebook: form.facebook.trim(),
          telegram: form.telegram.trim(),
          profileImage: imageBase64
        })
        setUser(response.data)
        hidePageLoader()
        showToast('success', 'Saved successfully!')
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
  const handleConfirm = async () => {
    try {
      const response = await api.delete<{ message: string }>('/profile/')
      showToast('info', response.data.message)
      router.replace('auth/login')
    } catch (err) {
      if (err instanceof AxiosError) {
        showToast('error', err.response?.data.message)
      } else {
        showToast('error', 'An error occurred during signup')
      }
    }
    setConfirmModal(false)
  }
  const handleCancel = () => { setConfirmModal(false) }
  const handleDelete = () => { setConfirmModal(true) }

  const handleLogout = () => {
    const userToken = Cookies.get("userToken");
    if (!userToken) {
      router.replace("/auth/login");
      return;
    }
    Cookies.remove("userToken");
    router.replace("/auth/login");
  }
  return (
    <div>
      <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-[99] items-center  ${confirmModal ? 'flex' : 'hidden'}`}>
        <div className='w-full py-[75px] text-(--color2) text-sm rounded-[32px] border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col item-center px-[50px]'>
          <h1 className='text-center text-[40px] font-bold'>Cycle complete</h1>
          <p className='text-center flex flex-col items-center'>
            <span>You can now withdraw your earnings or reinvest to start a new cycle.</span>
          </p>
          <div className='flex flex-col gap-2'>
            <button onClick={handleConfirm}
              className={`w-full bg-[#6EBA0E] flex-1 text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition opacity-100 hover:scale-90`}>
              confirm
            </button>
            <button onClick={handleCancel}
              className={`w-full bg-[#C0C0C063] flex-1 text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition opacity-100 hover:scale-90`}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button onClick={() => router.back()} className="flex items-center mb-2 space-x-2 transition-all duration-300 cursor-pointer hover:opacity-80">
        <Icon icon='fluent:ios-arrow-24-regular' className="" />
      </button>
      <h1 className="text-[40px] font-bold mb-8">Settings</h1>
      <div className='mt-[35px]'>
        <div className='flex items-center justify-center'>
          <input type="file" name="profileImage" className='hidden' id="profileImage" accept="image/*" onChange={handleFileChange} />
          <label htmlFor='profileImage' className='w-[98px] h-[98px] overflow-hidden rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
            {
              previewImage
                ? <img src={previewImage} alt="Profile preview" className='w-full object-cover' />
                : user.profileImage
                  ? <img src={user.profileImage} alt="Profile preview" className='w-full object-cover' />
                  : <Icon icon="solar:user-bold" className='text-[#808080]' width={48} />
            }
            <span className='absolute bottom-5 right-3'><Icon icon="mingcute:edit-3-line" className='text-[#000914] text-xl' /></span>
          </label>
        </div>
        <div className='mt-9 max-w-[396px] mx-auto'>
          {['email', 'whatsapp_no', 'facebook', 'telegram'].map((field) => (
            <div key={field} className="mb-[30px]">
              <div className='flex gap-3.5'>
                {/* {field === 'phone' && <div className='px-3 py-[18px] rounded-[15px] border-2 border-[#424545] text-lg text-[var(--color2)]'>+234</div>} */}
                <input
                  id={field}
                  name={field}
                  disabled={field === 'email'}
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className={`w-full px-3 py-[18px] rounded-[15px] border-2 focus:outline-none bg-none text-lg placeholder:capitalize placeholder:text-[#424545]
                ${error[field]
                      ? 'border-[var(--color6)] text-[var(--color6)]'
                      : 'border-[#424545] focus:border-[var(--color2)] text-[var(--color2)]'
                    }`}
                  placeholder={field.split('_').join(' ')}
                  autoComplete={field === 'email' ? 'email' : field === 'whatsapp_no' ? 'phone' : ''}
                />
              </div>
              {error[field] && (
                <p className="text-sm mt-1 text-[#D54244]">{error[field]}</p>
              )}
            </div>
          ))}

          <div className='my-12 flex flex-col gap-3.5 items-center text-lg font-medium text-(--color2)'>
            <button onClick={handleDelete} className='opacity-100 cursor-pointer hover:opacity-50 transition-all duration-300'>Delete Account</button>
            <button onClick={handleLogout} className='opacity-100 cursor-pointer hover:opacity-50 transition-all duration-300'>Logout</button>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
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