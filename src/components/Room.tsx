"use client"

import { useSession } from 'next-auth/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { chatIdContext } from '@/context/ContextProvider'
import { io } from 'socket.io-client'

const socket = io("http://localhost:5500", {
  autoConnect: false
})

export default function Room() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(Array())
  const [isConnected, setIsConnected] = useState(false)

  const msgRef = useRef(null)
  const { currentChatId } = useContext(chatIdContext)
  

  const {data: session} = useSession()
  const username = session?.user.username
  
  

  const sendMessage = (e: any) => {
    e.preventDefault()

    socket.emit("message", {message, name: session?.user.username})
    
    setMessage("")
    

    // if (username && message && currentChatId){
    //   socket.emit("message", {
    //     text: message,
    //     name: username
    //   })

    //   setMessage("")
    // }

    // // (msgRef.current! as HTMLElement).focus()
  }

  // const enterRoom = () => {
  //   // e.preventDefault()

  //   console.log("outside");
    
  //   if (username && currentChatId){
  //     console.log("insideroom");
      
  //     socket.emit("enterRoom", {
  //       name: username,
  //       room: currentChatId
  //     })
  //   }
  // }

  useEffect(() => {
    console.log("test", currentChatId);
    // enterRoom()
    
  }, [currentChatId])

  useEffect(() => {
    socket.connect()
    console.log(socket);
    
    socket.on("connect", () => setIsConnected(true))
    socket.on("message", (msgObj) => {
      setMessages(prev => [...prev, msgObj])
    })
    

    return () => {
      socket.disconnect()
      socket.off("message")
      socket.off("connect")
      setIsConnected(false)
      // socket.off("disconnect", () => setIsConnected(false))
    }
  }, [])

  // socket.on("message", async({name, text, time}: any) => {
    
  //   try {
  //     const res = await axios.post("/api/messages/send", {userId: session?.user._id, chatId: currentChatId})
  //     console.log(res);
  //   } catch (err) {
  //     console.log("Error sending message", err);
      
  //   }

  // })

  return (
    <div className="w-full h-full flex flex-col">
      <h1>Room</h1>
      <h2>{isConnected ? "Socket Connected" : "Socket Disconnected"}</h2>

      <div className="h-full ">
        <ul className="h-full bg-slate-800">
          {messages.map(({message, name}) => (
            <li className={`flex ${name === session?.user.username ? "text-green-500 justify-start" : "text-orange-500 justify-end"} text-xl`}>{name}: {message}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={sendMessage} className="flex">
        <Input className="bg-gray-700" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button className="dark:bg-green-400 hover:dark:bg-green-600 active:dark:bg-green-800 text-xl font-bold dark:text-blue-700" type='submit'>Send</Button>
      </form>
    </div>
  )
}
