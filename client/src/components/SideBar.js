import React, { useState, useContext, useEffect, useRef } from 'react'
import { MdClose, MdMenu, MdAdd, MdOutlineLogout, MdOutlineQuestionAnswer, MdOutlineSecurity, MdOutlineBolt, MdOpenInNew, MdDelete, MdChatBubble, MdOpenInBrowser, MdOpenInFull, MdOpenInNewOff, MdOutlineOpenInNew, MdOutlineSupport, MdLogout, MdAccountBox, MdSettings } from 'react-icons/md'
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
  const [chats, setChats] = useState([1])
  const [selectedChat, setSelectedChat] = useState(1)
  const [inputValue, setInputValue] = useState("")
  const [channelValue, setChannelValue] = useState("")
  const [profile, setProfile] = useState({})

  const onChangeHandler = event => {
    setInputValue(event.target.value)
  }

  const onChannelChangeHandler = event => {
    setChannelValue(event.target.value)
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
          if (data.chats) {
            initMessages(data.chats)
          }
        })
        window.electronAPI.getKey()
        window.electronAPI.getProfile()
          .then(data => setProfile(data))
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
 
  const loadChat = (chat) => {
    props.handleChatChange(chat)
    setSelectedChat(chat)
    scrollToBottom()
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
      window.electronAPI.setChats({
        chats: messages,
        message: chat
      })
    }
  }

  const newChat = async (chatName) => {
    props.handleChatChange(chatName)
    addChat(chatName)
    setChats(Object.keys(messages))
    setSelectedChat(chatName)
    setTimeout(scrollToBottom, 200)

    if (window.electronAPI) {
      window.electronAPI.setChats({
        chats: messages,
        message: chatName
      })
    }
  }

  const logout = () => {
    if (window.electronAPI) {
      window.electronAPI.logOut()
    }
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
        <label htmlFor="channel-modal" className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` } onClick={() => setChannelValue("Channel")}>
          <div className='nav__icons'>
            <MdAdd />
          </div>
          <h1 className={`${!open && "hidden"}`}>New Channel</h1>
        </label>
      </div>
      
      <div className='nav__chats'>
        {chats.map((chat, index) => (
          <div className="nav" key={index}>
            <span className={`${open ? "gap-x-4 w-screen chats__item" : "chats__item"} ${(selectedChat === chat) && 'bg-light-white'}`}>
              <label htmlFor='settings-modal' className='nav__icons'>
                <MdSettings onClick={() => loadChat(chat)} title="Load this chat"/>
              </label>
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
          <label htmlFor="key-modal" className={ ` ${open ? "nav__item items-center gap-x-4 w-screen" : "nav__item"} ` }>
            <div className="nav__icons">
              <MdAccountBox />
            </div>
            <h1 className={`${!open && "hidden"}`}>
              Account
            </h1>
          </label>
        </div>
      </div>

      <input type="checkbox" id="channel-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Channel</h3>
          <p className="py-4">Enter a name for your new channel</p>
          <div className="form-control w-full">
              <label className='label'>
                <span className='label-text'>Channel Name</span>
              </label>
              <input 
                type="text" 
                placeholder='Enter a Channel Name' 
                className="input input-bordered w-full" 
                onChange={onChannelChangeHandler}
                value={channelValue} />
          </div>
          <div className="modal-action">
            <label 
              htmlFor="channel-modal" 
              className={ `${(!channelValue)?'disabled glass':''} btn btn-primary ` } 
              onClick={() => newChat(channelValue)}
              >Save</label>
              <label htmlFor="channel-modal" className="btn">Cancel</label>
          </div>
        </div>
      </div>
      
      <input type="checkbox" id="key-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">My Account</h3>
          { /* Google Profile */}
            { (profile.sub && profile.sub.split("-").includes('google')) &&
                <p className="py-4">
                  You are authenticated with Google
                </p>
            }
          
          <div className="modal-action">
            <label 
              htmlFor="key-modal" 
              className={ `${(!inputValue)?'disabled glass':''} btn btn-warning ` } 
              onClick={logout}
              >Log Out</label>
              <label htmlFor="key-modal" className="btn">Close</label>
          </div>

        </div>
      </div>

      <input type="checkbox" id="settings-modal" className="modal-toggle" />
      <div className='modal'>
        <div className='modal-box'>
        <h3 className="font-bold text-lg">Channel {selectedChat} Settings</h3>
        <p className="py-4">Render Settings</p>
        <div className="modal-action">
          <label htmlFor="settings-modal" className="btn">Close</label>
        </div>
        </div>
      </div>
    </section >
  )
}

export default SideBar