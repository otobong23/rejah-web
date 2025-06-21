import { Metadata } from 'next'

import React from 'react'
import New_Password from './NewPassword'
export const metadata:Metadata = {
   title: "New Password",
}

const page = () => {
  return (
    <New_Password />
  )
}

export default page