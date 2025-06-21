import { Metadata } from 'next'
import React from 'react'
import Email from './PasswordRecovery'

export const metadata:Metadata = {
   title: "Password Recovery",
}

const page = () => {
  return (
    <Email />
  )
}

export default page