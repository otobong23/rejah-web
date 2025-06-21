'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Nunito_Sans } from 'next/font/google';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Cookies from "js-cookie";
import Link from 'next/link';
import { useLoader } from '@/store/LoaderContext';
import copy from 'copy-to-clipboard';

const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const formatTime = (timestamp: string | number) => {
   const date = new Date(timestamp);
   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' });
};

const ImageDownload = (image: string) => image.startsWith('data:') ? image : `data:image/png;base64,${image}`;

const FILTER = [
   {
      title: 'All',
      type: 'all',
      stackValue: 1
   }, {
      title: 'New',
      type: 'new',
      stackValue: 2
   }, {
      title: 'Approved',
      type: 'completed',
      stackValue: 3
   }, {
      title: 'Pending',
      type: 'pending',
      stackValue: 4
   }, {
      title: 'Failed',
      type: 'failed',
      stackValue: 5
   }
]


const getFilterType = (stack: number) => {
   const found = FILTER.find(f => f.stackValue === stack);
   return found?.type ?? 'all';
};

const page = () => {
   const router = useRouter()
   const { showPageLoader, hidePageLoader } = useLoader()
   const [stack, setStack] = useState(1);
   const [status, setStatus] = useState<'approve' | 'decline' | null>(null)
   const [amount, setAmount] = useState(0)
   const [email, setEmail] = useState('')
   const [action, setAction] = useState('')
   const [transactionId, setTransactionId] = useState('')
   const [confirmModal, setConfirmModal] = useState(false)
   const [transaction, setTransaction] = useState<UserTransaction[]>([])
   const [copied, setCopied] = useState(false);


   useEffect(() => {
      const getTransaction = async () => {
         const adminToken = Cookies.get("adminToken");

         if (!adminToken) {
            router.replace("/admin/auth/login");
            return;
         }
         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
            const response = await api.get<{ transactions: UserTransaction[] }>("/admin/transactions?limit=50&page=1");
            setTransaction(response.data.transactions);
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
         }
      };
      getTransaction()
   }, [])

   const filteredTransactions = React.useMemo(() => {
      if (!transaction?.length) return [];

      const type = getFilterType(stack);
      let filtered = [];

      if (type === 'all') {
         filtered = transaction;
      } else if (type === 'new') {
         const now = Date.now();
         const oneDay = 24 * 60 * 60 * 1000;
         filtered = transaction.filter(item => {
            const createdAt = new Date(item.createdAt ?? '').getTime();
            return now - createdAt <= oneDay;
         });
      } else {
         filtered = transaction.filter(item => item.status === type);
      }

      // Sort pending first
      return filtered.sort((a, b) => {
         if (a.status === 'pending' && b.status !== 'pending') return -1;
         if (a.status !== 'pending' && b.status === 'pending') return 1;
         return 0; // keep original order otherwise
      });
   }, [transaction, stack]);


   const handlebutton = (params: 'approve' | 'decline', _id: string, amount: number, email: string, action: 'add' | 'minus') => {
      setStatus(params)
      setTransactionId(_id)
      setAmount(amount)
      setEmail(email)
      setAction(action)
      setConfirmModal(true)
   }
   const handleConfirm = async () => {
      showPageLoader()
      try {
         const res = await api.patch(`/admin/transactions/update?email=${email}&transactionID=${transactionId}`, {
            status: status === 'decline' ? "failed" : "completed",
            amount,
            action,
            image: ''
         });
         const response = await api.get<{ transactions: UserTransaction[] }>("/admin/transactions?limit=50&page=1");
         setTransaction(response.data.transactions);
         showToast('success', `Transaction ${status}d`);
         handleCancel()
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred')
         }
      }
      hidePageLoader()
   }
   const handleCancel = () => {
      setStatus(null)
      setConfirmModal(false)
      setTransactionId('')
      setAmount(0)
      setEmail('')
      setAction('')
   }

   const handleCopy = (value: string) => {
      copy(value);
      setCopied(true);
      showToast('success', "Copied Successfully")
      setTimeout(() => setCopied(false), 2000);
   };
   return (
      <div className={`text-(--color2) ${nunitoSans.className}`}>
         <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-[99] items-center  ${confirmModal ? 'flex' : 'hidden'}`}>
            <div className='w-full py-[75px] text-(--color2) text-sm rounded-[32px] border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col px-[50px]'>
               <h1 className='text-center text-[40px] font-bold'>Confirm</h1>
               <p className='text-center flex flex-col items-center'>
                  <span>Please are you sure you want to {status} this transaction? Please Confirm</span>
               </p>
               <div className='flex flex-col gap-1'>
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
         <div className='flex justify-between items-center pb-10'>
            <h1 className="text-[40px] font-bold">Transactions</h1>
            <div className='flex items-center justify-center'>
               <div className='w-[49px] h-[49px] rounded-full flex justify-center items-center relative bg-[#EFEFEF]'>
                  <Icon icon="eos-icons:admin" className='text-[#808080]' width={23} />
               </div>
            </div>
         </div>

         <div className="flex gap-2 my-3 overflow-scroll lg:overflow-auto no-scrollbar">
            {FILTER.map(({ title, type, stackValue }) => (
               <button key={title} onClick={() => setStack(stackValue)} className={`py-2 px-7 rounded-[15px] flex items-center justify-center transition-all duration-300 ${stack === stackValue ? 'bg-[#00273298]' : 'bg-[#002732]'}`}>{title}</button>
            ))}
         </div>
         <div className='flex flex-col gap-3 overflow-scroll no-scrollbar max-w-[649px] mx-auto'>
            {filteredTransactions.length ? filteredTransactions.map((a, i) => {
               if (a.status === 'pending') return <Pending image={a.image ?? ''} _id={a._id} handleClick={handlebutton} key={a.email + i} email={a.email} type={a.type} amount={a.amount} updatedAt={a.updatedAt ?? ''} walletAddress={a.withdrawWalletAddress} oncopy={handleCopy} />
               else return <Done key={a.email + i} email={a.email} type={a.type} amount={a.amount} updatedAt={a.updatedAt ?? ''} status={a.status} />
            }) : <p className="text-center text-sm text-white/60">No Transaction Found yet.</p>}
         </div>
      </div>
   )
}

export default page


const Done = ({ email, type, amount, updatedAt, status }: { email: string, type: string, amount: number, updatedAt: string, status: 'completed' | 'failed' }) => (
   <div className='px-[25px] py-[10px] rounded-[15px] bg-white/7 flex items-center gap-3'>
      <div>
         {status === 'completed' ? <Icon icon='ion:checkmark-done-circle' className='text-[#6EBA0E] text-3xl' /> : <Icon icon='material-symbols:sms-failed' className='text-[#F94E4E] text-3xl' />}
      </div>
      <div className='w-full'>
         <h1 className='font-semibold capitalize text-(--color2)'>{type}</h1>
         <p className='text-(--color2)/50'>{email}</p>
         <div className='flex justify-between text-(--color2)/50'>
            <p>{type} | ${amount} {status === 'failed' && <span className='text-[#F94E4E] ml-3'>Rejected</span>}</p>
            <p>{formatTime(updatedAt)}</p>
         </div>
      </div>
   </div>
)
const Pending = ({ email, image, type, amount, updatedAt, handleClick, _id, walletAddress = '', oncopy }: { email: string, image: string, type: string, amount: number, updatedAt: string, handleClick: (params: 'approve' | 'decline', _id: string, amount: number, email: string, action: 'add' | 'minus') => void, _id: string, walletAddress?: string, oncopy: (text: string) => void }) => {
   const [toggle, setToggle] = useState(false)
   return (
      <div className='px-[25px] py-[10px] rounded-[15px] bg-white/7 flex items-center gap-3 transition-all duration-300'>
         <div>
            <Icon icon='solar:money-bag-bold' className='text-[#10B981] text-3xl' />
         </div>
         <div className='w-full'>
            <div className='flex items-center justify-between' onClick={() => setToggle(prev => !prev)}>
               <h1 className='font-semibold capitalize text-(--color2) flex items-start'>{type}<span className='w-2 h-2 bg-[#F59E0B] block rounded-full'></span></h1>
               <span><Icon icon='tabler:chevron-down' className={`text-2xl text-(--color2) transition-all duration-300 ${toggle ? 'rotate-180' : 'rotate-0'}`} /></span>
            </div>
            <p className='text-(--color2)/50'>{email}</p>
            <div className='flex justify-between text-(--color2)/50'>
               <p>{type} | ${amount} <span className='text-[#F59E0B] ml-3'>Pending</span></p>
               <p>{formatTime(updatedAt)}</p>
            </div>
            <div className={`flex flex-col gap-2 mt-5 justify-end max-w-full overflow-hidden transition-all duration-300 ${toggle ? 'max-h-20' : 'max-h-0'}`}>
               {walletAddress && (<div className='flex text-(--color2) overflow-hidden'>
                  <p className='w-[250px] relative truncate'>Addr: <span>{walletAddress}</span></p>
                  <button className='cursor-pointer' onClick={() => oncopy(walletAddress)}>
                     <Icon icon='akar-icons:copy' className='text-[20px]' />
                  </button>
               </div>)}
               <div className='flex gap-[16px] justify-end'>
                  {image && <Link href={ImageDownload(image)} download={`${email}_${_id}_receipt.png`} target="_blank" rel="noopener noreferrer" className='capitalize px-[15px] py-[5px] rounded-[10px] font-semibold text-sm text-white bg-[#F59E0B]'>reciept</Link>}
                  {['approve', 'decline'].map(a => (<button key={a} onClick={() => handleClick(a as 'approve' | 'decline', _id, amount, email, type === 'deposit' ? 'add' : 'minus')} className={`capitalize px-[15px] py-[5px] rounded-[10px] font-semibold text-sm text-white ${a === 'approve' ? 'bg-(--color7)' : 'bg-[#C0C0C063]'}`}>{a}</button>))}
               </div>
            </div>
         </div>
      </div>
   )
};