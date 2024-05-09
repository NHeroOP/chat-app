"use client"

import MenuBar from '@/components/MenuBar'
import Room from '@/components/Room'
import SideBar from '@/components/SideBar'
import { Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { io } from 'socket.io-client'



export default function ChatPage() {

  return (
    <div className="flex h-screen">
      <SideBar />
      <Room />
    </div>
  )
}

