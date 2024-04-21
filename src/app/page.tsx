"use client"

import React, { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { Search } from 'lucide-react'
import MenuBar from '@/components/MenuBar'
import axios from 'axios'


export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
      return;
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeQuery.matches ? 'dark' : 'light');
  }, []);

  const handleCreateChat = async (e: any  ) => {
    const res = await axios.post('/api/chatrooms/create');
    console.log(res);
    console.log('create chat');
    
  }

  return (
    <div className="flex h-screen">
      <section className="border-gray-700 border-r-2 px-4" >

        <div className="flex items-center gap-4 mt-4">
          <MenuBar />

          <label className="input input-bordered rounded-full flex items-center gap-2">
            <button className="cursor-pointer">
              <Search />
            </button>

            <input type="text" className="grow" placeholder="Search" />
          </label>
        </div>
      </section>

      <section>
        <h1>Home</h1> 
        <button 
          onClick={() => signOut()}
          className="bg-orange-500 py-2 px-3 rounded-lg font-bold"
        >Logout</button>  
        <button 
          className="bg-orange-500 py-2 px-3 rounded-lg font-bold"
          onClick={handleCreateChat}
        >Create Chat</button>  
      </section>
    </div>
  )
}
