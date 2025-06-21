import { Metadata } from 'next'
import React from 'react'
import Vault from './Vault'

export const metadata:Metadata = {
   title: "Vault",
}

const page = () => {
  return (
    <Vault />
  )
}

export default page