import React, { useState, useContext, useEffect, useRef } from 'react'
import { MdClose, MdMenu, MdAdd, MdOutlineLogout, MdOutlineQuestionAnswer, MdOutlineSecurity, MdOutlineBolt, MdOpenInNew, MdDelete, MdChatBubble, MdOpenInBrowser, MdOpenInFull, MdOpenInNewOff, MdOutlineOpenInNew } from 'react-icons/md'
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

  const updateKey = async () => {
    try {
      if (key);
        setLast4(key.substr(key.length-4, 4));
    } catch (error) {}
    const msg = (last4)?`Your current API Key ends in "${last4}"`:''
    const key = await smalltalk.prompt("Please enter your OpenAI API Key", msg)
    if (!key) return;
    setLast4(key.substr(key.length-4, 4));
    addKey(key);

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
            <SiProbot size={32} />
          </span>
        </div>
        <h1 className={`sidebar__app-title ${!open && "scale-0 hidden"}`}>
          My ChatGPT
        </h1>
        <div className='sidebar__btn-close' onClick={() => setOpen(!open)}>
          {open ? <MdClose className='sidebar__btn-icon' /> : <MdMenu className='sidebar__btn-icon' />}
        </div>
      </div>
      <div className="nav">
        <span className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={newChat}>
          <div className='nav__icons'>
            <MdAdd />
          </div>
          <h1 className={`${!open && "hidden"}`}>New Chat</h1>
        </span>
      </div>
      
      <div className='nav__chats'>
        {chats.map((chat, index) => (
          <div className="nav" key={index}>
            <span className={`${open ? "gap-x-4 w-screen chats__item" : "chats__item"} ${(selectedChat === chat) && 'bg-light-white'}`}>
              <div className='nav__icons'>
                <MdChatBubble onClick={() => loadChat(chat)} title="Load this chat"/>
              </div>
              <h1 onClick={() => loadChat(chat)} className={`${!open && "hidden"} nav-chat-name`}>{chat === '1' && 'Chat' || chat}</h1>
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
          <span className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={updateKey}>
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
          </span>
        </div>
        <div className="nav">
          <a href='https://github.com/mlabieniec/chatgpt-desktop' target="_blank" className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` }>
            <div className="nav__icons">
              <MdOutlineQuestionAnswer />
            </div>
            <h1 className={`${!open && "hidden"}`}>Update & FAQ</h1>
          </a>
        </div>
          { /*
          <div className="nav">
            <span className="nav__item" onClick={SignOut}>
              <div className="nav__icons">
                <MdOutlineLogout />
              </div>
              <h1 className={`${!open && "hidden"}`}>Clear Chat</h1>
            </span>
          </div>
          */ }
      </div>

    </section >
  )
}

export default SideBar