import { Metadata } from 'next'
import React from 'react'
import WithdrawPage from './Withdraw_Page'

export const metadata:Metadata = {
   title: "Wihdraw",
}

const page = () => {
  return (
    <WithdrawPage />
  )
}

export default page