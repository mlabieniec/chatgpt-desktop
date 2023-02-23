import React, { useState, useContext, useEffect, useRef } from 'react'
import { MdClose, MdMenu, MdAdd, MdOutlineLogout, MdOutlineQuestionAnswer, MdOutlineSecurity, MdOutlineBolt, MdOpenInNew, MdDelete, MdChatBubble, MdOpenInBrowser, MdOpenInFull, MdOpenInNewOff, MdOutlineOpenInNew, MdOutlineSupport } from 'react-icons/md'
import { ChatContext } from '../context/chatContext'
import { KeyContext } from '../context/keyContext'
import DarkMode from './DarkMode'
import smalltalk from 'smalltalk'
import { SiProbot } from 'react-icons/si';

/**
 * A sidebar component that displays a list of nav items and a toggle 
 * for switching between light and dark modes.
 * 
 * @param {Object} props - The properties for the component.
 */
const SideBar = (props) => {
  const chatsEndRef = useRef()
  const [open, setOpen] = useState(true)
  const [messages, setMessages, clearMessages, addChat, initMessages] = useContext(ChatContext)
  const [key, addKey] = useContext(KeyContext)
  const [chats, setChats] = useState([1])
  const [selectedChat, setSelectedChat] = useState(1)
  const [inputValue, setInputValue] = useState("");

  const onChangeHandler = event => {
    setInputValue(event.target.value)
  }

  const scrollToBottom = () => {
    chatsEndRef.current?.scrollIntoView({behavior: "smooth"})
  }
  let init = false
  useEffect(() => {
    if (!init) {
      init = true
      if (window.electronAPI && window.electronAPI.api) {
        window.electronAPI.api.receive("key", (data) => {
          if (data.apiKey) {
            addKey(data.apiKey)
            setLast4(data.apiKey.substr(data.apiKey.length-4, 4))
          }
          if (data.chats) {
            initMessages(data.chats)
          }
        })
        window.electronAPI.getKey()
      }
    }
  }, [])

  useEffect(() => {
    if (messages) {
      setChats(Object.keys(messages))
    }
  }, [messages])

  useEffect(() => {
    setSelectedChat(chats[chats.length-1])
    props.handleChatChange(chats[chats.length-1])
  }, [chats])

  const [last4, setLast4] = useState("");

  const updateKey = async (value) => {
    if (!value) return
    try {
      if (key)
        setLast4(key.substr(key.length-4, 4))
    } catch (error) {}
    //const msg = (last4)?`Your current API Key ends in "${last4}"`:''
    //const key = await smalltalk.prompt("Please enter your OpenAI API Key", msg)
    const key = value
    if (!key) return
    setLast4(key.substr(key.length-4, 4))
    addKey(key)

    if (window.electronAPI) 
      window.electronAPI.setKey(key)
  }

  const loadChat = (chat) => {
    props.handleChatChange(chat)
    setSelectedChat(chat)
  }

  const deleteChat = async (chat) => {
    try {
      if (Object.keys(messages).length === 1) {
        await smalltalk.confirm('Confirm Delete', 'Are you sure you want to clear this entire chat history?')
      }
    } catch (error) {
      return error
    }
    clearMessages(chat)
    setChats(Object.keys(messages))
    if (window.electronAPI) {
      window.electronAPI.setChats(messages)
      setTimeout(initMessages)
    }
  }

  const newChat = async () => {
    let chats = Object.keys(messages)
    let nextId = chats.length + 1
    let chatName = await smalltalk.prompt('New Chat', `Enter a short descriptive name for your chat`, `Chat ${nextId}`)

    props.handleChatChange(chatName)
    addChat(chatName)
    setChats(Object.keys(messages))
    setSelectedChat(chatName)
    setTimeout(scrollToBottom, 200)
  }

  return (
    <section className={` ${open ? "w-72 p-5" : "w-20 "} sidebar`}>
      <div className="sidebar__app-bar">
        <div className={`sidebar__app-logo ${!open && "scale-0 hidden"}`}>
          <span className='w-8 h-8'>
            <SiProbot size={32} onClick={() => setOpen(!open)} />
          </span>
        </div>
        <h1 className={`sidebar__app-title ${!open && "scale-0 hidden"}`}>
          My ChatGPT
        </h1>
        <div className='sidebar__btn-close' onClick={() => setOpen(!open)}>
          {open ? <MdClose className='sidebar__btn-icon' /> : <SiProbot className='sidebar__btn-icon' />}
        </div>
      </div>
      <div className="nav">
        <span className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={newChat}>
          <div className='nav__icons'>
            <MdAdd />
          </div>
          <h1 className={`${!open && "hidden"}`}>New Channel</h1>
        </span>
      </div>
      
      <div className='nav__chats'>
        {chats.map((chat, index) => (
          <div className="nav" key={index}>
            <span className={`${open ? "gap-x-4 w-screen chats__item" : "chats__item"} ${(selectedChat === chat) && 'bg-light-white'}`}>
              <div className='nav__icons'>
                <MdChatBubble onClick={() => loadChat(chat)} title="Load this chat"/>
              </div>
              <h1 onClick={() => loadChat(chat)} className={`${!open && "hidden"} nav-chat-name`}>
                {chat === '1' && 'Default' || chat}
              </h1>
              <div className={`badge ${!open && "hidden"}`}>+{messages[chat].length}</div>
              <span className='nav__spacer'></span>
              <div className={`nav__actions ${!open && "hidden"}`}>
                <span className={`${!open && "hidden"} nav-chat-open`} onClick={() => loadChat(chat)} title="Load this chat">
                  <MdOutlineOpenInNew size={18} />
                </span>
                &nbsp;&nbsp;
                  <span className={`${!open && "hidden"} ${chat !== '1' && "nav-chat-delete"}`} onClick={() => deleteChat(chat)} title="Delete this chat">
                    <MdDelete size={18}/>
                  </span>
              </div>
            </span>
          </div>
        ))}
        <div ref={chatsEndRef}></div>
      </div>
      <div className="nav__bottom">
        <DarkMode open={open} />
        <div className="nav">
          <label for="key-modal" className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={() => setInputValue(key)}>
            <div className="nav__icons">
              <MdOutlineSecurity />
            </div>
            <h1 className={`${!open && "hidden"}`}>
              API Key (***
              {
                last4
              }
              )
            </h1>
          </label>
        </div>
        <div className="nav">
          <span className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={() => window.open('https://platform.openai.com/account/api-keys', '_blank')}>
            <div className="nav__icons">
              <MdOpenInNew />
            </div>
            <h1 className={`${!open && "hidden"}`}>OpenAI Account</h1>
          </span>
        </div>
        <div className="nav">
          <a href='https://github.com/mlabieniec/chatgpt-desktop/issues' target="_blank" className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` }>
            <div className="nav__icons">
              <MdOutlineSupport />
            </div>
            <h1 className={`${!open && "hidden"}`}>Support</h1>
          </a>
        </div>
      </div>

      <input type="checkbox" id="key-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">OpenAI Access</h3>
          <p class="py-4">Your API Key is used to communicate with openai.com models. You can get one for free from openai.com. Use the button 
          in the bottom left to get your API Key.</p>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Your OpenAI API Key</span>
              <span className="label-text-alt" onClick={() => window.open('https://platform.openai.com/account/api-keys', '_blank')}>Get One</span>
            </label>
            <input 
              type="text" 
              placeholder="Type here" 
              className="input input-bordered w-full"
              onChange={onChangeHandler}
              value={inputValue} />
          </div>
          <div class="modal-action">
          <label 
            for="key-modal" 
            className={ `${(!inputValue)?'disabled glass':''} btn btn-primary ` } 
            onClick={() => updateKey(inputValue)}
            >Save</label>
            <label for="key-modal" class="btn">Close</label>
          </div>
        </div>
      </div>

    </section >
  )
}

export default SideBar