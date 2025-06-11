import { Icon } from '@iconify/react/dist/iconify.js'
import { FC } from 'react'

const Vault_List: FC<Vault_List_Props> = ({
   VAULT_LIST: {
      title,
      icon = '',
      details
   },
   bg= 'bg-(--color1)',
   iconColor='text-(--color1)'
}) => {
   return (
      <div className={`flex-1 text-(--color2) rounded-[15px] p-[3px] shadow-lg ${bg}`}>
         <h2 className="text-lg font-semibold px-[22px] py-[9px]">{title}</h2>

         <div className="flex items-center gap-6 px-[15px] py-5 bg-[#121A24] rounded-xl">
            <div className='flex-1'>
               <Icon icon={icon} className={`text-8xl ${iconColor}`} />
            </div>
            <div className='flex-[1.5]'>
               <table className="w-full text-sm text-left">
                  <tbody>
                     {Object.entries(details).map(([key, value]) => (
                        <tr key={title + '_' + key}>
                           <td className="px-[1px] py-[1px] text-[#A8A79E]">{key.replace('_', ' ')}:</td>
                           <td className="font-semibold px-[1px] py-[1px]">{String(value)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}

export default Vault_List