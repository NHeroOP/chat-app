import React, { useContext, useEffect, useState } from 'react'
import MenuBar from '@/components/MenuBar'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { chatIdContext } from '@/context/ContextProvider'

export default function SideBar() {
  const [userChats, setUserChats] = useState([])
  const [loading, setLoading] = useState(true)
  const {data: session, status} = useSession()
  const userId = session?.user._id

  const { setCurrentChatId } = useContext(chatIdContext)

  const router = useRouter()

  const getUserChats = async() => {
    if (!userId) return

    try {
      const res = await axios.post("/api/chatrooms", {userId})
      setUserChats(res.data.data)
      
    } catch (err) {
      console.error(err)
    }    
  }

  useEffect(() => {
    getUserChats()
  }, [status])


  const handleChatClick = (e: any, chatId: any) => {
    setCurrentChatId(chatId)
    router.push("/chat")
  }

  return (
    <section className="bg-gray-900 border-gray-700 border-r-2 px-4" >
      <div className="flex items-center gap-4 mt-4">
        <MenuBar />

        <label className="input input-bordered rounded-full flex items-center gap-2">
          <button className="cursor-pointer">
            <Search />
          </button>

          <input type="text" className="grow" placeholder="Search" />
        </label>
      </div>

      <div>
        <ul>
          {userChats.length > 0 && (
            userChats.map((chat: any) => (
              <li key={chat._id} className="text-lg w-[375px] max-h-[72px] hover:bg-gray-800">
                <Link href={"/chat"} onClick={(e) => {
                  handleChatClick(e, chat._id)
                }}>
                  <div className="flex gap-[8px] items-center px-[8px] py-[11.5px]">
                    <img src={`https://ui-avatars.com/api/?rounded=true&name=${chat.roomName}&background=random`} alt="" className="w-[49px] h-[49px]"/>

                    <div className="flex flex-col gap-[2px]">
                      <h3 className="text-gray-50 font-[20px]">{chat.roomName}</h3>
                      <p className="text-gray-500 font-[16px]">{chat.description}</p>
                    </div>
                  </div>
                </Link>
              </li>  
            ))
          )}
        </ul>
      </div>
    </section>
  )
}
