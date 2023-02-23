import React from 'react'
import { MdSaveAlt } from 'react-icons/md'

/**
 * A component that displays an image.
 *
 * @param {string} text - The source of the image to display.
 * @returns {JSX.Element} - A JSX element representing the image.
 */
const Image = (props) => {

  const onBotClick = (url) => {
    const content = {
      url: props.url
    }
    props.onBotClick(content)
  }

  return (
    <div className="message__wrapper">
      <img className='message__img' src={props.url} alt='dalle generated' loading='lazy' />
      <button onClick={() => onBotClick(props.url)} className='message__save'><MdSaveAlt size={24} title="Save File" /></button>
    </div>)
}

export default Image