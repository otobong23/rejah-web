import { Metadata } from 'next'
import React from 'react'
import Reset from './Reset'

export const metadata:Metadata = {
   title: "Code",
}

const page = () => {
  return (
    <Reset />
  )
}

export default page