import Home from './pages/Home'
import { ChatContextProvider } from './context/chatContext'
import { KeyContextProvider } from './context/keyContext'

const App = () => {
  return (
    <KeyContextProvider>
      <ChatContextProvider>
        <div>
          <Home />
        </div>
      </ChatContextProvider>
    </KeyContextProvider>
  )
}


export default App