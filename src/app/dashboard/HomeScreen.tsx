'use client'

import Carousel from "@/components/Carousel"
import { HOME_NAV_LIST, STE, TOP_CARD_LIST } from "@/constant/Home"
import { Icon } from "@iconify/react/dist/iconify.js"
import { SwiperSlide } from "swiper/react"
import { Nunito_Sans } from "next/font/google"
import questionMark from '@/assets/Home/question-mark.png'
import recycle from '@/assets/Home/recycle.png'
import Image from "next/image"
import slide1 from '@/assets/Home/slide1.png'
import slide2 from '@/assets/Home/slide2.png'
import slide3 from '@/assets/Home/slide3.png'
import Link from "next/link"
import { showToast } from "@/utils/alert"
import { AiFillNotification } from "react-icons/ai";
import { useUserContext } from "@/store/userContext"
import { AxiosError } from "axios"
import api from "@/utils/axios"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { formatInTimeZone } from "date-fns-tz"


const nunito = Nunito_Sans({
   subsets: ['latin'],
   variable: '--font-nunito',
})

export default function HomeScreen() {
   const router = useRouter()
   const { user, setUser } = useUserContext()
   const [transaction, setTransaction] = useState<UserTransaction[]>()

   const getTransaction = async (page: number = 1) => {
      const userToken = Cookies.get("userToken");

      if (!userToken) {
         router.replace("/auth/login");
         return;
      }

      try {
         api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
         const response = await api.get<transactionResponseType>(`/transaction?limit=10&page=${page}`);
         setTransaction(response.data.transactions)
      } catch (err) {
         if (err instanceof AxiosError) {
            console.log(err)
            showToast('error', err.response?.data.message)
         } else {
            console.error(err)
            showToast('error', 'An error occurred during signup')
         }
      }
   }
   useEffect(() => {
      getTransaction()
   }, [])

   return (
      <div>
         {/* Top Card */}
         {/* <Carousel>
            {TOP_CARD_LIST.map(({ subTitle, title, titleIcon, description, descriptionIcon, description2, descriptionIcon2, image }, index) => (
               <SwiperSlide style={{ backgroundImage: `url(${image.src})` }} className={`bg-right bg-no-repeat bg-cover min-h-[166px] lg:min-h-[calc(166px*1.5)] rounded-xl p-3 relative overflow-hidden`} key={index}>
                  <h3 className="text-(--color2) text-[10px] font-light mb-1.5">{subTitle}</h3>
                  <div className="flex items-center gap-1.5">
                     <Icon icon={titleIcon} className="text-4xl lg:text-6xl" />
                     <h1 className="text-3xl font-bold lg:text-6xl">{title}</h1>
                  </div>
                  <div className="flex items-start gap-[10px] mt-1.5">
                     <div><Icon icon={descriptionIcon} className="text-xl lg:text-2xl" /></div>
                     <p className="text-sm lg:text-2xl">{description}</p>
                  </div>
                  <div className="flex items-start gap-[10px] mt-1.5">
                     <div><Icon icon={descriptionIcon2} className="text-xl lg:text-2xl" /></div>
                     <p className="text-sm lg:text-2xl">{description2}</p>
                  </div>
               </SwiperSlide>
            ))}
         </Carousel> */}
         <Carousel>
            {[slide1, slide2, slide3].map((image, index) => (
               <SwiperSlide key={index} className="rounded-xl overflow-hidden">
                  <Image src={image} alt="Slide Image" className="w-full h-auto object-cover" />
               </SwiperSlide>
            ))}
         </Carousel>

         <div className="flex flex-col gap-4 md:flex-row-reverse">
            {/* Grid Menu */}
            <div className="md:flex-2 grid grid-cols-4 md:grid-cols-3 gap-4 md:grid-3 bg-[#040439] p-4 rounded-xl text-center text-xs font-semibold text-[#E8E3D3]">
               {HOME_NAV_LIST.map(({ title, icon, path }) => (
                  <Link href={'/dashboard' + path} key={title} className="flex flex-col items-center space-y-1" onClick={(e) => {
                     if (title === 'Updates' || title === 'Videos') {
                        e.preventDefault()
                        showToast("info", "Coming soon")
                     }
                  }}>
                     <div className="text-2xl">
                        <Icon icon={icon} className="text-[40px]" />
                     </div>
                     <span className="text-sm">{title}</span>
                  </Link>
               ))}
            </div>
         </div>

         <div className="bg-[#040439]/10 text-[#040439] px-4 py-5 rounded-[8px] my-3">
            <div className="flex gap-2 text-[#040439CC] text-xl">
               <div className="px-[17px] py-[8px] rounded-lg bg-[#040439]/20 flex-1 flex items-center justify-center gap-1">
                  <Icon icon='mdi:wallet' />
                  <h1>Total Assets</h1>
               </div>
               <div className="px-[17px] py-[8px] rounded-lg bg-[#040439]/20 flex-1 flex items-center justify-center gap-1">
                  <Icon icon='vaadin:connect' />
                  <h1>Ref Bonus</h1>
               </div>
            </div>

            <div className="flex gap-2 mt-[5px] text-3xl font-bold">
               <h1 className="flex-1 flex items-center justify-center gap-1">${Number(user.balance).toLocaleString()}</h1>
               <h1 className="flex-1 flex items-center justify-center gap-1">${Number(user.totalYield).toLocaleString()}</h1>
            </div>
         </div>

         {/* Compare Tiers */}
         <div className="bg-[#040439] mb-4 rounded-xl p-4 mt-3 text-white flex items-center justify-between px-[26px] py-5 text-lg">
            <h1>Notification</h1>
            <AiFillNotification color="#5ADA5A" />
         </div>
         <div className="flex flex-col gap-3 overflow-scroll no-scrollbar w-full">
            {transaction?.length ? transaction.map((item, index) => (
               <div key={item.type + index} className='flex flex-col py-2.5 px-5 bg-[#3C3C3C21] text-[#000914] gap-3 rounded-[15px]'>
                  <div className='flex justify-between'>
                     <h1 className='text-sm font-semibold mb-1 capitalize'>
                        {item.type} {item.status === 'pending' ? 'pending' : item.status === 'completed' ? 'successful' : 'failed'}
                     </h1>
                     <p>${item.amount.toLocaleString()}</p>
                  </div>
                  <div className='flex justify-between text-xs font-normal text-[#000914]'>
                     <p>{formatInTimeZone(item.updatedAt ?? Date.now(), 'Africa/Lagos', 'HH:mm')}</p>
                     <p>{formatInTimeZone(item.updatedAt ?? Date.now(), 'Africa/Lagos', 'dd/MM/yy')}</p>
                  </div>
               </div>
            )) : <p className="text-center text-sm text-[#272E37]">No Recent Transaction Found yet.</p>}
         </div>

         <p className="text-center my-4 text-[#272E37]">NOVA Copyright, 2025.</p>
      </div>
   )
}
