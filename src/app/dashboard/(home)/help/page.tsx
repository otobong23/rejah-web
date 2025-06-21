import React from 'react'
import { Metadata } from "next";
import HelpScreen from './Help';

export const metadata:Metadata = {
   title: "Help",
}

const page = () => {
  return (
    <HelpScreen />
  )
}

export default page