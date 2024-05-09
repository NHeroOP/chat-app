"use client"

import React from 'react'
import { useTheme } from 'next-themes'

import { AtSign, Menu, Moon, Pencil, Sun, User, Users } from 'lucide-react'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DialogBar from './DialogBar'
import { DialogTrigger } from './ui/dialog'


export default function MenuBar() {
  const {theme, setTheme} = useTheme()

  const handleThemeToggle = (e: any) => {
    const { checked } = e.target;
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <Menubar className="border-0 p-0 flex font-normal">
      
      <MenubarMenu>
        <MenubarTrigger className="p-0"><Menu size={36} className='dark:text-white text-black'/></MenubarTrigger>
        <MenubarContent className="p-0">
          <MenubarItem className="flex gap-[10px] pr-[16px] pl-[10px] py-[10px] text-[24px] leading-[24px] h-[56px] font-medium">
            <Avatar>
              <AvatarImage src="https://ui-avatars.com/api/?name=NHero&background=random" />
              <AvatarFallback>NH</AvatarFallback>
            </Avatar>
            <h1>NHero</h1>
          </MenubarItem>
          <MenubarItem className="flex gap-4 p-4 text-[20px] leading-[24px] h-[56px]">
            <AtSign /> Mentions 
          </MenubarItem>
          <DialogBar>
            
            <button><MenubarItem onClick={(e) => e.preventDefault()} >Test</MenubarItem></button>
          {/* <MenubarItem className="flex gap-4 p-4 text-[20px] leading-[24px] h-[56px]" onClick={(e) => {
            e.preventDefault();
          }}>
            <Pencil /> {" "} New Direct Message
          </MenubarItem> */}
          </DialogBar>
          <MenubarItem className="flex gap-4 p-4 text-[20px] leading-[24px] h-[56px]">
            <Users /> {" "} New Group
          </MenubarItem>
          <MenubarItem className="flex justify-between p-4 text-[20px] leading-[24px] h-[56px]">
            <div className="flex gap-4">
              {theme === 'dark' ? <Moon /> : <Sun />}
              <span>{theme?.charAt(0).toUpperCase()! + theme?.slice(1)} Mode</span>
            </div>

            <input 
              type="checkbox" 
              value="synthwave" 
              className="toggle theme-controller" 
              checked={theme === 'dark'}
              onChange={handleThemeToggle}
              onClick={(e) => e.stopPropagation()}
            />

          </MenubarItem>
          <MenubarItem className="flex gap-4 p-4 text-[20px] leading-[24px] h-[56px]">
            <User /> {" "} Sign Out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
