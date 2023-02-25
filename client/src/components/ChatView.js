import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'
import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import { KeyContext } from '../context/keyContext';
import Thinking from './Thinking'
import { SiProbot } from 'react-icons/si';
import { MdImage } from 'react-icons/md';
import useApi from '../hooks/useApi';


/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = (props) => {
  const messagesEndRef = useRef()
  const inputRef = useRef()
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E']
  const [messages, addMessage] = useContext(ChatContext)
  const [key] = useContext(KeyContext)
  const [toast, setToast] = useState(false)
  const [call, setCall] = useApi()
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
    if (!key) {
      setToast("An API Key is Required")
      return setTimeout(() => setToast(false), 5000)
    }
    
    if (!formValue) {
      setToast("Please enter a message to send")
      return setTimeout(() => setToast(false), 5000)
    }

    const newMsg = formValue
    let result = ""
    setThinking(true)
    setFormValue('')
    updateMessage(newMsg, false, aiModel)
    setCall({
      "message": newMsg
    })
    /*
    try {
      let response = null;
      if (aiModel === 'DALL·E') {
        response = await openai.createImage({
          prompt: `${newMsg}`,
          n: 1,
          size: "512x512",
        })
      } else {
        response = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `
    I want you to reply to all my questions in markdown format. 
    Q: ${newMsg}?.
    A: `,
          temperature: 0.5,
          max_tokens: 1024,
          //top_p: 0.5,
          frequency_penalty: 0.5,
          presence_penalty: 0.2,
        })
      }
      result = (aiModel === 'ChatGPT')?response.data.choices[0].text:response.data.data[0].url
      updateMessage(result, true, aiModel)
    } catch (error) {
      result = error + ". Is your API Key Correct?"
      updateMessage(result, true, aiModel, true)
    }
    */
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
    /*
    window.electronAPI.api.receive("save", (data) => {
      console.log('save returned for message: ', data)
    })
    */
  }, [])

  return (
    <div className="chatview">
      <main className='card chatview__chatarea'>

        {messages[props.chat].map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} onSave={onFileSave}/>
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>

      <div className='form'>
        <textarea ref={inputRef} className='textarea sm:w-screen ml-3 mr-3 mb-3' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <div className="dropdown dropdown-top dropdown-end dropdown-hover" disabled={!formValue}>
          <label tabIndex={0} className="btn btn-lg m-1">Send</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button onClick={() => sendMessage(options[0])}> <SiProbot /> {options[0]}</button></li>
            <li><button onClick={() => sendMessage(options[1])}><MdImage /> {options[1]}</button></li>
          </ul>
        </div>
      </div>

      { toast &&
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <div>
              <span>{toast}</span>
            </div>
          </div>
        </div>
      }

    </div>
  )
}
export default ChatView