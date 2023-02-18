import { useState } from 'react'

const useKeyCollection = () => {
  const initialKey = ""
  const [key, setKey] = useState(initialKey);

  const addKey = (key) => {
    setKey(key);
  }

  const clearKey = () => setKey(initialKey)

  return [key, addKey, clearKey]
}

export default useKeyCollection