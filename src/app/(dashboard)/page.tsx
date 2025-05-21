'use client'

import { TOP_CARD_LIST } from "@/constant/Home"
import { Icon } from "@iconify/react/dist/iconify.js"


export default function HomeScreen() {
   return (
      <div className="min-h-screen bg-[var(--color4)] text-[var(--color2)] px-4 pb-24 pt-6 space-y-6">
         {/* Top Card */}
         {TOP_CARD_LIST.map(({ subTitle, title, titleIcon, description, descriptionIcon, description2, descriptionIcon2, image }, index) => (
            <div style={{ backgroundImage: `url(${image.src})` }} className={`bg-right bg-no-repeat object-contain rounded-xl p-4 text-sm relative overflow-hidden`} key={index}>
               <h3 className="text-[--color2] text-xs font-medium">{subTitle}</h3>
               <div className="flex items-center">
                  <Icon icon={titleIcon} className="text-4xl" />
                  <h1 className="text-2xl font-bold">{title}</h1>
               </div>
               <div className="flex items-center">
                  <Icon icon={descriptionIcon} className="text-2xl" />
                  <p className="">{description}</p>
               </div>
               <div className="flex items-center">
                  <Icon icon={descriptionIcon2} className="text-2xl" />
                  <p className="">{description2}</p>
               </div>
            </div>
         ))}

         {/* Callouts */}
         <div className="grid grid-cols-2 gap-4 text-[#424545] text-sm font-medium">
            <div className="bg-[#E8E3D3] rounded-xl p-3 space-y-1">
               <h2 className="text-lg font-bold text-[#103444]">Start.<br />Grow.<br />Earn</h2>
               <ul className="text-xs list-disc pl-4">
                  <li>Choose your Pack</li>
                  <li>Activate & Earn Daily</li>
                  <li>Withdraw or Reinvest</li>
               </ul>
            </div>
            <div className="bg-[#E8E3D3] rounded-xl p-3 space-y-1">
               <h2 className="text-lg font-bold text-[#103444]">We’ve<br />Got<br />Clarity.</h2>
               <p className="text-xs">Browse all FAQs.</p>
            </div>
            <div className="bg-[#E8E3D3] rounded-xl p-3 col-span-2">
               <h2 className="text-lg font-bold text-[#103444]">Powered by Purpose</h2>
               <p className="text-xs mt-1">
                  Trusted by 15,000+ users across 100+ countries. Inspired by plastic-to-utility.
               </p>
            </div>
         </div>

         {/* Grid Menu */}
         <div className="grid grid-cols-3 gap-4 bg-[#0F2230] p-4 rounded-xl text-center text-xs font-semibold text-[#E8E3D3]">
            {[
               ['💵', 'Withdraw'],
               ['💳', 'Deposit'],
               ['⬇️', 'Updates'],
               ['❓', 'FAQ'],
               ['ℹ️', 'About Us'],
               ['🎥', 'Videos'],
               ['♻️', 'Recycler'],
               ['👥', 'Crew'],
            ].map(([icon, label]) => (
               <div key={label} className="flex flex-col items-center space-y-1">
                  <div className="text-2xl">{icon}</div>
                  <span>{label}</span>
               </div>
            ))}
         </div>

         {/* Compare Tiers */}
         <div className="bg-[#06656F] rounded-xl p-4 text-[#E8E3D3] flex justify-between items-center">
            <div className="flex items-center space-x-2">
               <span className="text-2xl">♻️</span>
               <div>
                  <p className="font-bold">Compare Tiers</p>
                  <p className="text-xs">Choose a plan that works best for you</p>
               </div>
            </div>
            <div className="text-xl">🏢</div>
         </div>

         {/* Footer */}
         {/* <div className="fixed bottom-0 left-0 right-0 bg-[#0B1720] border-t border-[#1A2A35] px-8 py-3 flex justify-around items-center">
        <Home className="text-[#B8FF5E]" />
        <Database className="text-[#E8E3D3]" />
        <DollarSign className="text-[#E8E3D3]" />
      </div> */}
      </div>
   )
}
