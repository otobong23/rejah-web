import { Icon } from "@iconify/react/dist/iconify.js";

export const VIP = ({ iconColor = 'text-white', bg = 'bg-[#B8FF5E]', number = 1 }) => (
   <div className={`flex items-center gap-1 px-[10px] py-1 rounded-[20px] ${bg}`}>
      <span><Icon icon='streamline:star-badge-solid' className={`text-sm ${iconColor}`} /></span>
      <div className='h-[20px] w-[1px] bg-white block self-stretch'></div>
      <p className='text-sm font-extrabold text-white'>VIP {number}</p>
   </div>
)