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

const nunito = Nunito_Sans({
   subsets: ['latin'],
   variable: '--font-nunito',
})

export default function HomeScreen() {
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
            <div className="md:flex-2 grid grid-cols-4 md:grid-cols-3 gap-4 md:grid-3 bg-(--color7) p-4 rounded-xl text-center text-xs font-semibold text-[#E8E3D3]">
               {HOME_NAV_LIST.map(({title, icon, path}) => (
                  <Link href={'/dashboard'+path} key={title} className="flex flex-col items-center space-y-1" onClick={(e) => {
                     if(title === 'Updates' || title === 'Videos') {
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

         {/* Compare Tiers */}
         <div className="bg-(--color1) rounded-xl p-4 mt-3 text-[var(--color2)]">
            <div className="flex items-center justify-center gap-5 space-x-2">
               <div className="flex items-center gap-2">
                  <Icon icon="fa:recycle" className="text-2xl" />
                  <Icon icon="lsicon:arrow-right-outline" className="text-2xl" />
                  <Icon icon="material-symbols:factory" className="text-2xl" />
               </div>
               <div>
                  <p className="text-lg font-bold">Compare Tiers</p>
                  <p className="text-xs">Choose a plan that works best for you</p>
               </div>
            </div>
         </div>

         <p className="text-center my-4 text-[#272E37]">Powered by Innovation plc</p>
      </div>
   )
}
