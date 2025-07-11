'use client';
import { useLoader } from '@/store/LoaderContext';
import api from '@/utils/axios';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { showToast } from '@/utils/alert';
import imageCompression from 'browser-image-compression';
import { AxiosError } from 'axios';

const page = () => {
   const { showPageLoader, hidePageLoader } = useLoader()
   const router = useRouter()
   const [file, setFile] = useState<File | null>(null)
   const [transactionID, setTransactionID] = useState('')
   const [active, setActive] = useState(false)

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
         setFile(compressedFile);
      } catch (error) {
         console.error('Image compression error:', error);
         showToast('error', 'Failed to compress image.');
      }
   };
   useEffect(() => {
      if(file && transactionID) setActive(true);
      else setActive(false)
   }, [file, transactionID])


   const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file); // includes mime type like "data:image/png;base64,..."
         reader.onload = () => resolve(reader.result as string);
         reader.onerror = reject;
      });

   const handleUpload = async () => {
      showPageLoader();
      const number = sessionStorage.getItem('depositAmount');
      if (!number) {
         router.replace('/dashboard/tiering/deposit/');
         return;
      }
      if (!file) return;

      const imageBase64 = await toBase64(file);
      const userToken = Cookies.get("userToken");

      if (!userToken) {
         router.replace("/auth/login");
         return;
      }

      try {
         api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
         const response = await api.post('/transaction/deposit', {
            amount: Number(number),
            image: imageBase64,
            transactionID
         });
         console.log(response);
         showToast('success', 'Deposit request submitted successfully')
         router.replace('/dashboard/vault/history/')
      } catch (err) {
         console.log(err)
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }

      hidePageLoader(2000);
   };

   return (
      <div>
         {/* Header */}
         <button onClick={() => router.back()} className="flex items-center space-x-2 mb-2 cursor-pointer hover:opacity-80 transition-all duration-300">
            <Icon icon='fluent:ios-arrow-24-regular' className="" />
         </button>
         <h1 className="text-[40px] font-bold mb-8">Upload receipt</h1>

         <div className='max-w-[396px] mx-auto'>
            <div className='flex flex-col items-center gap-5 justify-center mt-11'>
               <div>
                  <label htmlFor='reciept' className='w-[115px] h-[115px] rounded-full bg-(--color2) flex items-center justify-center'>
                     <span>
                        <Icon icon='mingcute:upload-3-fill' className='text-[72px] text-[#121A24]' />
                     </span>
                  </label>
                  <div className='hidden'>
                     <input type="file" name="reciept" id="reciept" accept="image/*,application/pdf" onChange={handleFileChange} />
                  </div>
               </div>

               <div className='w-full'>
                  <label htmlFor='transactionId' className='text-xs pb-2'>Transaction ID</label>
                  <div className='w-full'>
                     <input
                        type="password"
                        placeholder="*******"
                        id='transactionId'
                        className="py-[15px] px-3 outline-0 rounded-[15px] border border-(--color2)/20 focus:border-(--color2)/70 text-lg font-medium w-full"
                        value={transactionID}
                        onChange={e => setTransactionID(e.target.value)}
                     />
                  </div>
               </div>
            </div>

            <button
               onClick={handleUpload}
               className={`w-full bg-[#6EBA0E] text-white text-lg font-bold py-[18px] mt-[35px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90' : 'opacity-50 cursor-not-allowed'}`} disabled={!active}
            >
               Upload
            </button>
         </div>
         {/* <div>
            {img && <a
               href={img}           // your Base64 string from MongoDB
               download="receipt.png"      // desired filename
               className="bg-blue-600 text-white px-4 py-2 rounded"
            >
               Download Receipt
            </a>}
         </div> */}
      </div>
   )
}

export default page