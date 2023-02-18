import { createContext } from 'react'
import useKeyCollection from '../hooks/useKey'

const KeyContext = createContext("")

const KeyContextProvider = (props) => {
  const [key, setKey, clearKey] = useKeyCollection("")

  return (
    <KeyContext.Provider value={[key, setKey, clearKey]}>
      {props.children}
    </KeyContext.Provider>
  )
}

export { KeyContext, KeyContextProvider }