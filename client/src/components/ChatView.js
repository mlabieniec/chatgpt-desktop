import React, { useState, useRef, useEffect, useContext } from 'react'
import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import { KeyContext } from '../context/keyContext';
import Thinking from './Thinking'
import { Configuration, OpenAIApi } from 'openai'
import smalltalk from 'smalltalk'
/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef()
  const inputRef = useRef()
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E']
  const [selected, setSelected] = useState(options[0])
  const [messages, addMessage] = useContext(ChatContext)
  const [key] = useContext(KeyContext)

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`
    }

    addMessage(newMsg)
  }

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault()

    if (!key)
      return await smalltalk.alert(
        "API Key Required", 
        "Click on API Key in the sidebar and add an API key from <a href='https://openai.com/' target='_blank'><ul>openai.com</ul></a>")
    
    const newMsg = formValue
    const aiModel = selected
    setThinking(true)
    setFormValue('')
    updateMessage(newMsg, false, aiModel)
      try {
      const openai = new OpenAIApi(new Configuration({
        apiKey: key,
      }))
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
          max_tokens: 500,
          top_p: 0.5,
          frequency_penalty: 0.5,
          presence_penalty: 0.2,
        })
      }
      const result = (aiModel === 'ChatGPT')?response.data.choices[0].text:response.data.data[0].url
      updateMessage(result, true, aiModel)
    } catch (error) {
      const message = error + ". Is your API Key Correct?"
      updateMessage(message, false, aiModel)
    }

    setThinking(false)
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
      <main className='chatview__chatarea'>

        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="dropdown" >
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <textarea ref={inputRef} className='chatview__textarea-message' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</button>
      </form>
    </div>
  )
}

export default ChatView