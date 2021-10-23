import { useContext } from 'react'
import styles from './App.module.scss'
import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'
import { SendMessageBox } from './components/SendMessageBox'
import { AuthContext } from './contexts/Auth'

export function App() {
  const { user } = useContext(AuthContext)

  return (
    <main className={`${styles.contentMain} ${!user ? '' : styles.contentSigned}`}>
      <MessageList />
      {!user ? <LoginBox /> : <SendMessageBox />}
    </main>
  )

}
