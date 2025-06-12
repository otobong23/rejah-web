import Image from 'next/image'
import { FC } from 'react'

const Tier_List: FC<Tier_List_Props> = ({
   TIER_LIST: {
      title,
      image,
      details
   },
   handleBUY,
   bg= 'bg-(--color1)',
   btn_bg = 'bg-[linear-gradient(180deg,_#424748_0%,_#003B46_145.74%)]'
}) => {
   return (
      <div className={`text-(--color2) rounded-[15px] p-[3px] shadow-lg ${bg}`}>
         <h2 className="text-lg font-semibold px-[22px] py-[9px]">{title}</h2>

         <div className="flex items-center gap-6 px-[15px] py-5 bg-[#121A24] rounded-xl">
            <div className='flex-1'>
               <Image src={image} alt={title} className="w-28 h-full object-cover" />
            </div>
            <div className='flex-[1.5]'>
               <table className="w-full text-sm text-left">
                  <tbody>
                     {Object.entries(details).map(([key, value]) => (
                        <tr key={title + '_' + key}>
                           <td className="px-[1px] py-[1px] text-[#A8A79E] capitalize">{key.replace('_', ' ')}:</td>
                           <td className="font-semibold px-[1px] py-[1px]">{value}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               {handleBUY && <div onClick={() => handleBUY(details)} className='flex justify-end mt-1.5'>
                  <button className={`text-sm py-1.5 px-10 rounded-[10px] transition-all duration-300 hover:scale-90 ${btn_bg}`}>
                     Buy
                  </button>
               </div>}
            </div>
         </div>
      </div>
   )
}

export default Tier_List