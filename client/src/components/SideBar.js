import React, { useState, useContext } from 'react'
import { MdClose, MdMenu, MdAdd, MdOutlineLogout, MdOutlineQuestionAnswer, MdOutlineSecurity, MdOutlineBolt } from 'react-icons/md'
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
const SideBar = () => {
  const [open, setOpen] = useState(true)
  const [, , clearMessages] = useContext(ChatContext)
  const [key, addKey] = useContext(KeyContext);
  /**
   * Toggles the dark mode.
   */
  const clearChat = () => clearMessages()
  const SignOut = () => {
    clearChat()
    window.sessionStorage.clear()
  }

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
  }

  return (
    <section className={` ${open ? "w-72" : "w-20 "} sidebar`}>
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
        <span className='nav__item  bg-light-white' onClick={clearChat}>
          <div className='nav__icons'>
            <MdAdd />
          </div>
          <h1 className={`${!open && "hidden"}`}>New chat</h1>
        </span>
      </div>

      <div className="nav__bottom">
        <DarkMode open={open} />
        <div className="nav">
          <span className="nav__item" onClick={updateKey}>
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
          <a href='https://github.com/mlabieniec/chatgpt-clone' className="nav__item">
            <div className="nav__icons">
              <MdOutlineQuestionAnswer />
            </div>
            <h1 className={`${!open && "hidden"}`}>Update & FAQ</h1>
          </a>
        </div>
        <div className="nav">
          <span className="nav__item" onClick={SignOut}>
            <div className="nav__icons">
              <MdOutlineLogout />
            </div>
            <h1 className={`${!open && "hidden"}`}>Log out</h1>
          </span>
        </div>
      </div>
    </section >
  )
}

export default SideBar