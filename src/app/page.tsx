"use client"

import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

import axios from 'axios'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SideBar from '@/components/SideBar'


export default function Home() {
  const {data: session, status} = useSession()
  
  const user = status === 'authenticated' && session?.user;
  const [chatData, setChatData] = useState({
    roomName: "",
    description: "",
    createdBy: "",
    users: Array(),
  })
  const [chatId, setChatId] = useState("");
  const [chats, setChats] = useState(Array())

  const handleCreateChat = async (e: any  ) => {
    const res = await axios.post('/api/chatrooms/create');
    console.log(res);
    console.log('create chat');
    
  }

  const handleInputChange = (e: any) => {
    const name = e.target.name
    const value = e.target.value

    setChatData(prev => ({...prev, [name]: value}))
  }

  const onSubmit = async (e: any) => {
    if (!user || !user?._id){
      console.error("No valid Session")
      return;
    }
    const userId = user?._id
    console.log(userId);
    
    const users = [userId!]
    
    
    try {
      console.log(chatData);
      const res = await axios.post('/api/chatrooms/create', {...chatData, createdBy: userId, users});
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    
  }

  const getUsersInChat = async(e: any) => {
    console.log("get users in chat");
    const res = await axios.post('/api/chatrooms/get-users', ({userId: session?.user?._id, roomId: chatId}));
    console.log(res);
    
    
  }
  const fetchChats = async () => {
    if (!user || user?._id){
      console.error("No valid Session")
      return;
    }
    const res = await axios.post('/api/chatrooms', {userId: session?.user?._id})
    setChats(res.data.data)
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchChats();
    }
  }, [status]);

 
  return (
    <div className="flex h-screen">
      <SideBar />

      {status === 'loading' && <p>Loading...</p>}

      {status === 'authenticated' && 
      (<section>
        <h1 className="text-3xl font-bold m-4">Hello {user && user.username}</h1> 
        <button 
          onClick={() => signOut()}
          className="bg-orange-500 py-2 px-3 rounded-lg font-bold"
        >Logout</button>  
        <button 
          className="bg-orange-500 py-2 px-3 rounded-lg font-bold"
          onClick={handleCreateChat}
        >Create Chat</button>  

        <Button onClick={fetchChats}>Fetch Chats</Button>

        <Select onValueChange={(e) => setChatId(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chats" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem> */}
            {
              chats.map((chat: any) => (
                <SelectItem key={chat._id} value={chat._id}>{chat.roomName}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Button onClick={getUsersInChat}>Get User in a chat</Button>

        <form onSubmit={onSubmit}>
          <Dialog >
            <DialogTrigger asChild>
              <Button variant="outline">Create Chat</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Chat</DialogTitle>
                <DialogDescription>
                  Create Chat
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Chat Name
                  </Label>
                  <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Funny Chat"
                    className="col-span-3"
                    name="roomName"
                    value={chatData.roomName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    autoComplete="off"
                    id="description"
                    placeholder="This is a funny chat"
                    className="col-span-3"
                    name="description"
                    value={chatData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter onSubmit={(e) => {console.log("hello");
              }}>
                <DialogClose>
                  <Button type="submit" onClick={onSubmit} >Create Chat</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>

      </section>)}
    </div>
  )
}
