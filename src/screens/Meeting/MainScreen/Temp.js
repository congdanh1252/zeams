import React, { useState } from "react"

import BottomStack from "./BottomStack"
import { ChatBox } from "./ChatBox"
import TwoPeerLayout from "./PeerSection/TwoPeerLayout"

export const Temp = () => {
  const [showChat, setShowChat] = useState(false)

  const toggleChatBox = () => {
    setShowChat(!showChat)
  }

  return (
    <>
      <TwoPeerLayout />

      <BottomStack openChatBox={toggleChatBox}/>

      {
        showChat && <ChatBox closeCallback={toggleChatBox}/>
      }
    </>
  )
} 