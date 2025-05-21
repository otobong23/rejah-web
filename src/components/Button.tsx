import React, { FC } from 'react'

type ButtonProps = {
   active: boolean
   handleSubmit?: (e: React.FormEvent) => void
   chiildren?: string
   className?: React.HTMLProps<HTMLButtonElement>['className']
}

const Button:FC<ButtonProps> = ({
   active,
   handleSubmit = (e) => e.preventDefault(),
   chiildren = 'Continue',
   className = '',
   ...props
}) => {
   return (
      <button
         type="submit"
         onClick={handleSubmit}
         {...props}
         className={`w-full bg-[#6EBA0E] text-white text-lg font-bold mt-12 py-[18px] rounded-[15px] transition ${active ? 'opacity-100 hover:scale-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${chiildren}`} disabled={!active}
      >
         {chiildren}
      </button>
   )
}

export default Button