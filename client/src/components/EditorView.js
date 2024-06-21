import React, { useRef, useState } from 'react'
import Editor from "@monaco-editor/react";
import { SiProbot } from 'react-icons/si';
import { MdImage } from 'react-icons/md';

const EditorView = (props) => {
    const inputRef = useRef()
    const [formValue, setFormValue] = useState('')
    const [toast, setToast] = useState(false)
    const options = ['ChatGPT', 'DALL·E']
    const editorOptions = {
        "fontSize": "16px",
        "minimap": false
    }

    const sendMessage = () => {
        
    }

  return (
    <div className="editor__wrapper chatview">
        <Editor
        className='chatview__chatarea'
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            theme="vs-dark"
            options={editorOptions}
        />

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
    </div>)
}

export default EditorView