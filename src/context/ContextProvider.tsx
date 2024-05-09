import React, { createContext, useState } from 'react'

export const chatIdContext = createContext({currentChatId: "", setCurrentChatId: (id: string) => {}})

export function ContextProvider({children}: {children: React.ReactNode}) {
  const [currentChatId, setCurrentChatId] = useState("")
  return (
    <chatIdContext.Provider value={{currentChatId, setCurrentChatId}}>
      {children}
    </chatIdContext.Provider>
  )
}
