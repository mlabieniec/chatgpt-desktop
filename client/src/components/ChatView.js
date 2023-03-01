import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'
import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import { KeyContext } from '../context/keyContext';
import Thinking from './Thinking'
import { SiProbot } from 'react-icons/si';
import { MdCode, MdImage } from 'react-icons/md';
import useApi from '../hooks/useApi';


/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = (props) => {
  const messagesEndRef = useRef()
  const inputRef = useRef()
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E', 'Codex']
  const [messages, addMessage] = useContext(ChatContext)
  const [toast, setToast] = useState(false)
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [props.chat])

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected, error = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const newMsg = {
      id: id,
      chat: props.chat,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`
    }
    if (error) newMsg.error = true
    addMessage(newMsg)
    if (window.electronAPI) {
      window.electronAPI.setChats({
        chats: messages,
        message: newMsg
      })
    }
  }

  const sendMessage = async (aiModel) => {
    
    if (!formValue) {
      setToast("Please enter a message to send")
      return setTimeout(() => setToast(false), 5000)
    }

    const newMsg = formValue
    let result = ""
    setThinking(true)
    setFormValue('')
    updateMessage(newMsg, false, aiModel)
    try {
      let response = null;
      if (aiModel === 'DALL·E') {
        if (window.electronAPI) {
          response = await window.electronAPI.getImage({
            'text': newMsg
          })
        }
      } else if(aiModel === 'ChatGPT') {
        if (window.electronAPI) {
          response = await window.electronAPI.getText({
            'text': newMsg
          })
        }
      } else if(aiModel === 'Codex') {
        console.log('[client] getting code: ', newMsg)
        if (window.electronAPI) {
          response = await window.electronAPI.getCode({
            'text': newMsg
          })
        }
      }
      result = (aiModel === 'ChatGPT' || aiModel === 'Codex')?response.choices[0].text:response.data[0].url
      updateMessage(result, true, aiModel)
    } catch (error) {
      result = error
      updateMessage(result, true, aiModel, true)
    }
    setThinking(false)
  }

  const onFileSave = (filePath) => {
    console.log('onFileSave: ', filePath)
  }

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="chatview">
      <main className='card chatview__chatarea'>

        {messages[props.chat].map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} onSave={onFileSave}/>
        ))}

        {thinking && <Thinking />}
          
        <div ref={messagesEndRef}></div>
      </main>

      <div className='form'>
        <textarea ref={inputRef} className='textarea sm:w-screen ml-3 mr-3 mb-3' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <div className="dropdown dropdown-top dropdown-end dropdown-hover" disabled={!formValue}>
          <label tabIndex={0} className="btn btn-lg m-1">Send</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button onClick={() => sendMessage(options[0])}> <SiProbot /> {options[0]}</button></li>
            <li><button onClick={() => sendMessage(options[1])}><MdImage /> {options[1]}</button></li>
            <li><button onClick={() => sendMessage(options[2])}> <MdCode /> {options[2]}</button></li>
          </ul>
        </div>
      </div>

      { toast &&
        <div className="toast toast-top toast-end">
          <div className="alert alert-warning shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{toast}</span>
          </div>
          </div>
        </div>
      }

    </div>
  )
}
export default ChatView