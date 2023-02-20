import { useEffect, useState } from 'react'

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */
const useMessageCollection = () => {
  const initialMsg = {
    id: 1,
    chat: "1",
    createdAt: Date.now(),
    text: '**Hello!** *How can I help you today?*',
    ai: true,
    initial: true
  }
  const [messages, setMessages] = useState({
    1: [initialMsg]
  })


  const initMessages = (data) => {
    if (data)
      setMessages(data)
    else 
      setMessages({
        1: [initialMsg]
      })
  }
  /**
  * A function for adding a new message to the collection.
  *
  * @param {Object} message - The message to add to the collection.
  */
  const addMessage = (message) => {
    setMessages((prev) => {
      const result = prev
      const item = (prev && prev[message.chat])?[...prev[message.chat], message]:[message]
      result[message.chat] = item
      return result
    });
  }

  const clearMessages = (chat) => {
    setMessages((prev) => {
      const result = prev
      if (Object.keys(result).length === 1) {
        result[chat] = [initialMsg]
      } else {
        delete result[chat]
      }
      return result
    })
  }

  const addChat = (id) => {
    setMessages(() => {
      let result = messages
      let newDefaultMessage = {
        id: Date.now() + Math.floor(Math.random() * 1000000),
        chat: id,
        createdAt: Date.now(),
        text: `**Hello!** *How can I help you today?*`,
        ai: true,
        initial: true
      };
      result[id] = [newDefaultMessage]
      return result;
    })
  }

  return [messages, addMessage, clearMessages, addChat, initMessages];
}

export default useMessageCollection