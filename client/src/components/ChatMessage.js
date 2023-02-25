import React from 'react'
import { MdComputer, MdError, MdInfo, MdInfoOutline, MdOpenInBrowser, MdOpenInNew, MdOutlineSaveAlt, MdPersonOutline, MdSave, MdSaveAlt, MdWarning } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import moment from 'moment'
import Image from './Image'
import { SiProbot } from 'react-icons/si';
/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, chat, createdAt, text, ai = false, initial = false, error = false, selected } = props.message

  const onBotClick = (content) => {
    if (typeof content === 'object') {
      content.message = props.message
    }
    if (window.electronAPI) {
      window.electronAPI.openSave(content)
    }
  }

  return (
    <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
      {
        selected === 'DALL·E' && ai ?
          <Image onBotClick={onBotClick} url={text} />
          :
          <div className='message__wrapper'>
            <ReactMarkdown className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
              children={text}
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || 'language-js')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={atomDark} language={match[1]} PreTag="div" {...props}
                    />
                  ) : (<code className={className} {...props}>{children} </code>)
                }
              }} />

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
                {/*
                  error &&
                  <div className="message__key">
                    <MdOpenInNew size={24} /> &nbsp; 
                    <a href="https://platform.openai.com/account/api-keys" target="_blank">Create or Retrieve your API Key</a>
                  </div>
              */}
              </div>

            </div>
          }

      <div className="message__pic">
        {
          ai ? (<SiProbot />) : <MdPersonOutline />
        }
      </div>
    </div>
  )
}

export default ChatMessage