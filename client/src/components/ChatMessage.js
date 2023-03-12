import React, { useState, useEffect } from 'react'
import { MdOutlineSaveAlt, MdPersonOutline, MdImage, MdCode, MdOpenInFull } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import moment from 'moment'
import Image from './Image'
import { SiProbot } from 'react-icons/si';
import Editor from '@monaco-editor/react'
const editorOptions = {
  "fontSize": "16px",
  "minimap": {
    enabled: false
  }
}
/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, chat, createdAt, text, ai = false, initial = false, error = false, selected } = props.message
  const [lang, setLang] = useState('javascript')
  const [full, setFull] = useState(false)

  useEffect(() => {
    if (full) {
      console.log('go full')
    } else {
      console.log("return from full")
    }
  }, [full])

  const onBotClick = (content) => {
    if (typeof content === 'object') {
      content.message = props.message
    }
    if (window.electronAPI) {
      window.electronAPI.openSave(content)
    }
  }

  const MessageActions = (props) => {
    return (
      <div className={`${ai ? 'text-left message__actions' : 'text-right'}`}>
        {
          ai && !initial && !error ?
          <div className='message__save' onClick={() => onBotClick(text)}>
            <MdOutlineSaveAlt size={20} title="Save File" />
          </div>
          : ''
        }
      <div className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>
        &nbsp;&nbsp; {moment(createdAt).fromNow()}
        </div>
      </div>
    )
  }

  const MarkdownMessage = (props) => {
    return (
      <div className='message__wrapper'>
        <ReactMarkdown 
          className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
          children={text}
          //disallowedElements={['p']}
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || 'language-js')
              //!inline && 
              return match ? (
                <SyntaxHighlighter
                  //.replace(/\n$/, '')
                  children={String(children)}
                  style={materialDark} 
                  language={match[1]} 
                  //PreTag="div" {...props}
                />
              ) : (<code className={className} {...props}>{children} </code>)
            }
          }} 
          />
          <MessageActions props={props} />
        </div>
    )
  }

  const EditorMessage = (props) => {
    return (
      <div className='message__wrapper'>
        <Editor
          className='message__editor'
              height='250px'
              language={lang}
              defaultValue={text}
              theme="vs-dark"
              options={editorOptions}
          />
        <div className="dropdown dropdown-top dropdown-start dropdown-hover">
          <label tabIndex={0} className="btn btn-sm m-1">{lang}</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
          <li><button className='btn-sm' onClick={() => setLang('html')}> <MdCode /> {'HTML'}</button></li>
          <li><button className='btn-sm' onClick={() => setLang('css')}> <MdCode /> {'CSS'}</button></li>
            <li><button className='btn-sm' onClick={() => setLang('javascript')}> <MdCode /> {'JavaScript'}</button></li>
            <li><button className='btn-sm' onClick={() => setLang('python')}><MdCode /> {'Python'}</button></li>
            <li><button className='btn-sm' onClick={() => setLang('bash')}> <MdCode /> {'Bash'}</button></li>
          </ul>
        </div>
        <button className='btn-sm' onClick={() => setFull(!full)}><MdOpenInFull /></button>
      </div>
    )
  }

  const Message = (props) => {
    switch (selected) {
      case 'DALL·E':
        if (ai) {
          return (<Image onBotClick={onBotClick} url={text} />)
        } else {
          return (<MarkdownMessage props={props} />)
        }
      case 'ChatGPT':
        return (<MarkdownMessage props={props} />)
      case 'Codex': 
      if (ai) {
        return (<EditorMessage props={props} />)
      } else {
        return (<MarkdownMessage props={props} />)
      }
      default:
        return (<MarkdownMessage props={props} />)
    }
  }

  return (
    <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
      <Message props={props} />
      <div className="message__pic">
        { ai ? (<SiProbot />) : <MdPersonOutline /> }
      </div>
    </div>
  )
}

export default ChatMessage