import React from 'react'
import cac_logo from '../images/cac-logo.png'
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

const CAC_Header = () => {
   return (
      <div>
         <header className="flex justify-between items-center lg:mx-[150px] px-[15px] py-[10px]">
            <Image src={cac_logo} alt="CAC Logo" width={50} height={50} />
            <Link href="/login" className="text-[#053e0d] font-bold flex items-center">
               <Icon icon="tabler:lock-filled" className="inline" width="16" height="16" />
               <span>Login</span>
               <Icon icon="heroicons:bars-3-20-solid" className='lg:hidden' width="34" height="34" />
            </Link>
         </header>
      </div>
   )
}

export default CAC_Header