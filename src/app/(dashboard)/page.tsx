'use client'

import Carousel from "@/components/Carousel"
import { HOME_NAV_LIST, STE, TOP_CARD_LIST } from "@/constant/Home"
import { Icon } from "@iconify/react/dist/iconify.js"
import { SwiperSlide } from "swiper/react"
import { Nunito_Sans } from "next/font/google"
import questionMark from '@/assets/Home/question-mark.png'
import recycle from '@/assets/Home/recycle.png'
import Image from "next/image"
import Link from "next/link"

const nunito = Nunito_Sans({
   subsets: ['latin'],
   variable: '--font-nunito',
})

export default function HomeScreen() {
   return (
      <div>
         {/* Top Card */}
         <Carousel>
            {TOP_CARD_LIST.map(({ subTitle, title, titleIcon, description, descriptionIcon, description2, descriptionIcon2, image }, index) => (
               <SwiperSlide style={{ backgroundImage: `url(${image.src})` }} className={`bg-right bg-no-repeat bg-cover min-h-[166px] rounded-xl p-3 relative overflow-hidden`} key={index}>
                  <h3 className="text-(--color2) text-[10px] font-light mb-1.5">{subTitle}</h3>
                  <div className="flex items-center gap-1.5">
                     <Icon icon={titleIcon} className="text-4xl" />
                     <h1 className="text-3xl lg:text-4xl font-bold">{title}</h1>
                  </div>
                  <div className="flex items-start gap-[10px] mt-1.5">
                     <div><Icon icon={descriptionIcon} className="text-xl" /></div>
                     <p className="text-sm">{description}</p>
                  </div>
                  <div className="flex items-start gap-[10px] mt-1.5">
                     <div><Icon icon={descriptionIcon2} className="text-xl" /></div>
                     <p className="text-sm">{description2}</p>
                  </div>
               </SwiperSlide>
            ))}
         </Carousel>

         <div className="flex flex-col md:flex-row-reverse gap-4">
            {/* Callouts */}
            <div className="md:flex-3 grid grid-cols-2 gap-4 text-[var(--color1)] text-sm font-medium">
               <div className="bg-[var(--color2)] rounded-xl p-3 space-y-1 row-span-2 col-span-2 md:col-span-1 relative">
                  <h2 className="text-[40px] font-bold leading-[35px] pb-[11px] z-50">Start.<br />Grow.<br />Earn</h2>
                  <div className="absolute top-0 right-0">
                     <Image src={recycle} alt="recycle" className="w-[150px] md:w-[110px] lg:w-[150px] h-full object-cover" />
                  </div>
                  <ul className="text-xs">
                     {STE.map(({ title, description }, index) => (
                        <li key={index} className={`flex gap-1 ${nunito.className} antialiased items-start`}>
                           <Icon icon="bi:dot" className="text-2xl" />
                           <div>
                              <p>{title}</p>
                              <p>{description}</p>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-(--color2) rounded-xl p-3 space-y-1 relative flex items-center">
                  <h2 className="text-[30px] font-bold leading-[25px] pb-[11px]">We’ve<br />Got<br />Clarity.</h2>
                  <div className="absolute top-0 right-0">
                     <Image src={questionMark} alt="recycle" className="w-[58px] h-full object-cover" />
                  </div>
                  <p className="text-xs -mb-5 z-50">Browse all FAQs.</p>
               </div>
               <div className="bg-(--color2) rounded-xl p-3">
                  <h2 className="text-[30px] font-bold leading-[25px] pb-[11px]">Powered by Purpose</h2>
                  <p className="text-xs mt-1">
                     Trusted by 15,000+ users across 100+ countries. Inspired by plastic-to-utility.
                  </p>
               </div>
            </div>

            {/* Grid Menu */}
            <div className="md:flex-2 grid grid-cols-4 md:grid-cols-3 gap-4 md:grid-3 bg-[#121A24] p-4 rounded-xl text-center text-xs font-semibold text-[#E8E3D3]">
               {HOME_NAV_LIST.map(({title, icon, path}) => (
                  <Link href={path} key={title} className="flex flex-col items-center space-y-1">
                     <div className="text-2xl">
                        <Icon icon={icon} className="text-[40px]" />
                     </div>
                     <span className="text-sm">{title}</span>
                  </Link>
               ))}
            </div>
         </div>

         {/* Compare Tiers */}
         <div className="bg-(--color1) rounded-xl p-4 text-[var(--color2)]">
            <div className="flex items-center justify-center gap-5 space-x-2">
               <div className="flex items-center gap-2">
                  <Icon icon="fa:recycle" className="text-2xl" />
                  <Icon icon="lsicon:arrow-right-outline" className="text-2xl" />
                  <Icon icon="material-symbols:factory" className="text-2xl" />
               </div>
               <div>
                  <p className="font-bold text-lg">Compare Tiers</p>
                  <p className="text-xs">Choose a plan that works best for you</p>
               </div>
            </div>
         </div>

         <p className="text-center my-4 text-[#272E37]">Powered by Innovation plc</p>
      </div>
   )
}
