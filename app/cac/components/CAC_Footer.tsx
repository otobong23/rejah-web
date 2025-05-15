import React from 'react'
import Image from "next/image";
import Link from "next/link";
import cac_logo from '../images/cac-logo.png'
import { Icon } from "@iconify/react/dist/iconify.js";

const CAC_Footer = () => {
  return (
   <footer className="bg-white lg:mx-[150px] px-[15px] pt-[60px] pb-[35px]">
   <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-[28px]">
     <div>
       <Image src={cac_logo} alt="CAC Seal" width={510} height={510} className="object-cover w-full" />
     </div>

     <div>
       <h3 className="font-semibold mb-4 text-[#999]">ABOUT</h3>
       <ul className="space-y-2 cac-links">
         <li><Link href="#">Contact us</Link></li>
         <li><Link href="#">Help</Link></li>
         <li><Link href="#">FAQs</Link></li>
       </ul>
     </div>

     <div>
       <h3 className="font-semibold mb-4 text-[#999]">OTHER USEFUL LINKS</h3>
       <ul className="space-y-2 cac-links">
         <li><Link href="#">Director checker</Link></li>
         <li><Link href="#">Company name checker</Link></li>
         <li><Link href="#">Alphabetical company checker</Link></li>
         <li><Link href="#">Refunds, cancellation and return policy</Link></li>
         <li><Link href="#">Privacy Policy</Link></li>
         <li><Link href="#">Terms of Use</Link></li>
       </ul>
     </div>

     <div>
       <h3 className="font-semibold mb-4 text-[#999]">CONTACT WITH US</h3>
       <p className=" text-[#555] mb-[10px]"><Icon icon="gridicons:phone" className="inline text-[#00ad56]" width="16" height="16" /> +234 809-552-1924</p>
       <p className=" text-[#555] mb-[10px]"><Icon icon="bi:envelope" className="inline text-[#00ad56]" width="16" height="16" /> cservice@cac.gov.ng</p>
       <p className="text-[#555] mb-5">FOLLOW US</p>
       <div className="flex gap-4">
         <Link href="#"><Icon icon="fa:facebook" width="16" height="16" className="text-[#555]" /></Link>
         <Link href="#"><Icon icon="mdi:twitter" width="16" height="16" className="text-[#555]" /></Link>
         <Link href="#"><Icon icon="icomoon-free:instagram" width="16" height="16" className="text-[#555]" /></Link>
       </div>
     </div>
   </div>

   <div className="bg-[#00000039] h-[0.2px] w-full my-[15px]" />
   <div className="flex flex-col lg:flex-row justify-between lg:items-center text-sm text-[#555] pb-3">
     <p className="text-xs text-gray-500 mb-3">Terms and conditions &nbsp;&nbsp;| &nbsp;&nbsp; Privacy</p>
     <p className="text-xs text-gray-500">© Copyright 2019 - 2020 | CAC | All Rights Reserved</p>
   </div>
 </footer>
  )
}

export default CAC_Footer