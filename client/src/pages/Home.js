import SideBar from '../components/SideBar';
import ChatView from '../components/ChatView';
import React, { useState } from 'react'
import ErrorBoundary from '../components/ErrorBoundary';
import { ChatContext } from '../context/chatContext';

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(1)
  const handleChatChange = (id) => {
    setSelectedChat(id)
  }

  return (
    <div className="flex transition duration-500 ease-in-out">
      <ErrorBoundary>
        <SideBar  handleChatChange={handleChatChange}/>
        <ChatView chat={selectedChat} />
      </ErrorBoundary>
    </div>
  )
}

export default Home