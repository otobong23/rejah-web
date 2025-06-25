'use client'
import { showToast } from '@/utils/alert'
import api from '@/utils/axios'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { VIP } from '@/components/VIP';
import Vault_List from '@/components/Vault_List';
import { PREMIUM_TIER_LIST, REBOUND_TIER_LIST } from '@/constant/Tier';
import { Icon } from '@iconify/react/dist/iconify.js'
import { Nunito_Sans } from 'next/font/google'
import { useLoader } from '@/store/LoaderContext'

const nunitoSans = Nunito_Sans({
   variable: "--font-nunito_sans",
   subsets: ["latin"],
});

const actions = [
   { icon: 'mingcute:history-anticlockwise-fill', label: 'history' },
   { icon: 'lsicon:setting-filled', label: 'setting' },
   { icon: 'flowbite:download-solid', label: 'Download App' },
   { icon: 'material-symbols:shield', label: 'security' }
];

const BUTTON_LIST = [
   'Activate account',
   'Suspend account',
]

const page = () => {
   const router = useRouter()
   const { email } = useParams()
   const [user, setUser] = useState<UserType>({} as UserType)
   const [crew, setCrew] = useState<CrewType>({} as CrewType)
   const [confirmModal, setConfirmModal] = useState(false)
   const {showPageLoader, hidePageLoader} = useLoader()

   useEffect(() => {
      const getCrews = async () => {
         const adminToken = Cookies.get("adminToken");

         if (!adminToken) {
            router.replace("/admin/auth/login");
            return;
         }
         try {
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
            const userResponse = await api.get<UserType>(`/admin/user/${email}`);
            setUser(userResponse.data)
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
         }
      };
      getCrews()
   }, [])

   const handleConfirm = async () => {
      showPageLoader()
      try {
         const response = await api.patch('/admin/detachUser/', { userID: user.userID })
         showToast('info', response.data.message)
         router.replace('/admin/trc/users')
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message)
         } else {
            showToast('error', 'An error occurred during signup')
         }
      }
      hidePageLoader()
      setConfirmModal(false)
   }
   const handleCancel = () => { setConfirmModal(false) }
   const handleDelete = () => { setConfirmModal(true) }

   const handlePlans = (param: UserType) => {
      const plans = param.currentPlan || []; // Default to empty array if undefined
      const Rebound: TIER_LIST_TYPE[] = REBOUND_TIER_LIST.filter(a =>
         plans?.some(b => b.title === a.title)
      );
      const Premium: TIER_LIST_TYPE[] = PREMIUM_TIER_LIST.filter(a =>
         plans?.some(b => b.title === a.title)
      );
      return [...Rebound, ...Premium];
   }

   const handleCRV = (plans: TIER_LIST_TYPE[]) => {
      let CRV: number = 0
      plans.forEach(a => {
         const daily_yield = Number(a.details.daily_yield.split('$')[1])
         const duration = Number(a.details.duration.split(' ')[0])
         CRV += duration * daily_yield
      })
      return CRV
   }
   const handleTotalInvested = (param: TIER_LIST_TYPE[]) => {
      const plans = param || [];
      let totalInvested = 0
      plans.forEach(a => {
         const price = Number(a.details.price.split('$')[1])
         totalInvested += price
      })
      return totalInvested
   }

   const CRV = () => {
      const plans = handlePlans(user)
      const crv = handleCRV(plans)
      return crv
   }

   const TOTAL_ASSET = {
      title: 'Total Assets',
      icon: 'tabler:chart-pie-filled',
      details: {
         balance: '$' + ((user?.balance || 0).toLocaleString()),
         total_invested: '$' + ((handleTotalInvested(user?.currentPlan ?? []) || 0).toLocaleString()),
         total_yield_earned: '$' + ((user?.totalYield || 0).toLocaleString()),
         total_withdrawn: '$' + ((user?.totalWithdraw || 0).toLocaleString()),
         CRV: '$' + ((CRV() || 0).toLocaleString()),
      }
   }
   const TOTAL_SUMMARY = {
      title: 'Team Summary',
      icon: 'tabler:chart-pie-filled',
      details: {
         total_investment: '$' + (crew.totalCrewDeposits ?? 0),
         total_withdrawn: '$' + (crew.totalCrewWithdrawals ?? 0),
         active_members: (crew.totalMembers ?? 0)
      }
   };
   useEffect(() => {
      if (user.userID) {
         const getCrew = async () => {
            const response = await api.get<CrewType>(`/admin/crew?userID=${user.userID}`);
            setCrew(response.data)
         }
         getCrew()
      }
   }, [user])
   const handleText = () => {
      const tc = crew?.totalCrewDeposits ?? 0;
      let level = 0;

      if (tc < 3000) {
         level = 3000
      } else if (tc >= 3000 && tc < 5000) {
         level = 5000
      } else {
         level = 1000;
      }
      return level
   }

   const handleClick = (label: string) => {
      if (label === 'history') {
         router.push('/admin/transactions')
         return
      }
      if (label === 'Data summary') {
         router.push('/admin/dashboard')
         return
      }
      router.push(`/admin/account/${label}`)
   }

   const handleActivation = (params: string) => {
      const activateAccount = async (params: boolean) => {
         try {
            const response = await api.patch(`/admin/user/${email}`, {
               ActivateBot: params
            })
            showToast('success', 'User Account has been updated successfully')
         } catch (err) {
            if (err instanceof AxiosError) {
               showToast('error', err.response?.data.message)
            } else {
               showToast('error', 'An error occurred')
            }
         }
      }
      if (params === 'Activate account') {
         activateAccount(true)
      } else {
         activateAccount(false)
      }
   }

   return (
      <div>
         <div className={`fixed top-0 left-0 min-w-screen h-screen p-8 bg-black/70 z-[99] items-center  ${confirmModal ? 'flex' : 'hidden'}`}>
            <div className='w-full py-[75px] text-(--color2) text-sm rounded-[32px] border-2 border-[#F5F5F552]/50 bg-white/5 backdrop-blur-sm flex flex-col item-center px-[50px]'>
               <h1 className='text-center text-[40px] font-bold'>Confirm</h1>
               <p className='text-center flex flex-col items-center'>
                  <span>Please are you sure you want to delete this account and it&apos;s crew? The User&apos;s progress will be lost!!!</span>
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
         <div className='py-[34px] lg:py-[52px] px-[15px] lg:px-[73px] rounded-[15px] lg:rounded-[23px] bg-(--color1) flex items-center gap-3'>
            <div>
               <div className='w-[90px] lg:w-[151px] h-[90px] overflow-hidden lg:h-[151px] relative rounded-full bg-[#EFEFEF] flex items-center justify-center'>
                  {user.profileImage
                     ? <img src={user.profileImage} alt="Profile preview" className='w-full object-cover' />
                     : <Icon icon="solar:user-bold" className='text-[#808080]' width={48} />}
               </div>
            </div>
            <div className={`${nunitoSans.className} w-full text-(--color2)`}>
               <div className={`flex justify-between`}>
                  <h1 className='text-xl lg:text-4xl font-semibold'>User_<span className='uppercase'>{user.userID}</span></h1>
                  <div>
                     {user.vip === 0 && ''}
                     {user.vip === 1 && <VIP iconColor='text-[#295F4B]' />}
                     {user.vip === 2 && <VIP bg='bg-[linear-gradient(180deg,_#F59E0B_0%,_#F97316_100%)]' number={2} />}
                     {user.vip === 3 && <VIP bg='bg-[linear-gradient(180deg,_#FFD700_0%,_#A56409_128.07%)]' number={3} />}
                  </div>
               </div>
               <p className='text-sm lg:text-lg opacity-50'>ID: <span className='uppercase'>{user.userID}</span></p>
               <p className='text-sm lg:text-lg opacity-50'>Phone No: {user.whatsappNo ? user.whatsappNo : 'Unknown'}</p>
               <div className='w-full relative h-[2px] bg-white/30 mt-[5px]'>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'></span>
                  <p className='z-[99] text-[8px] text-[#003B46] px-2 py-1 rounded-[20px] bg-white leading-tight absolute top-1/2 transform -translate-y-1/2' style={{
                     left: user.meter + '%'
                  }}>{crew?.totalCrewDeposits}/{handleText()}</p>
                  <span className='w-2.5 h-2.5 block bg-white/50 rounded-full absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-50'></span>
               </div>
               <div className='flex justify-between text-[#4C767D] text-[10px] lg:text-lg mt-2'>
                  {user.vip === 0 && <>
                     <span></span>
                     <span>VIP 1</span>
                  </>}
                  {user.vip === 1 && <>
                     <span>VIP 1</span>
                     <span>VIP 2</span>
                  </>}
                  {user.vip === 2 && <>
                     <span>VIP 2</span>
                     <span>VIP 3</span>
                  </>}
                  {user.vip === 3 && <>
                     <span>VIP 2</span>
                     <span>VIP 3</span>
                  </>}
               </div>
            </div>
         </div>
         <div className={`pt-[15px] pb-7 flex flex-col lg:flex-row gap-3 overflow-y-hidden`}>
            <Vault_List VAULT_LIST={TOTAL_ASSET} />
         </div>
         <div className={`pt-[15px] pb-7 flex flex-col lg:flex-row gap-3 overflow-y-hidden`}>
            <Vault_List VAULT_LIST={TOTAL_SUMMARY} bg='bg-[linear-gradient(180deg,#F59E0B_0%,#F97316_100%)]' iconColor='text-[#F59E0B]' />
         </div>

         <div className="flex items-center justify-between bg-[#121A24] mt-3 py-6 lg:py-[52px] px-4 lg:px-32 rounded-[15px] gap-3">
            {actions.map(({ icon, label }, index) => (
               <button
                  onClick={() => handleClick(label)}
                  key={index}
                  className="flex flex-col items-center p-3 cursor-pointer"
               >
                  <div>
                     <Icon icon={icon} className='text-[40px] lg:text-[52px] text-(--color2)' />
                  </div>
                  <p className="text-xs lg:text-base text-center text-white capitalize">{label}</p>
               </button>
            ))}
         </div>

         <div className="flex items-center lg:not-visited:justify-center w-full gap-3 my-3">
            {BUTTON_LIST.map(title => (
               <button key={title} onClick={() => handleActivation(title)} className={`text-(--color2) rounded-[20px] px-4 py-5 flex-1 max-w-[316px] flex justify-center items-center gap-5 transition-all duration-300 ${user.ActivateBot && title === 'Activate account' ? 'bg-[#003B46]' : !user.ActivateBot && title === 'Suspend account' ? 'bg-[#003B46]' : 'bg-[#101924]'
                  }`}>
                  {title}
               </button>
            ))}
         </div>
         <button onClick={handleDelete} className='w-full flex justify-center items-center bg-[#003B46] text-(--color2) font-semibold text-2xl py-6 rounded-[20px] transition-all duration-300 transform scale-100 hover:scale-90 focus:scale-90'>Delete Team Leader</button>
      </div>
   )
}

export default page