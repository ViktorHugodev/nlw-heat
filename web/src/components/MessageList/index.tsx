import { useEffect, useState } from 'react'
import logoImg from '../../assets/logo.svg'
import { api } from '../../services/api'
import styles from './styles.module.scss'
import { io } from 'socket.io-client'

type Message = {
  id: string,
  text: string
  user: {
    name: string,
    avatar_url: string
  }
}

const messagesQueu: Message[] = []

const socket = io('http://localhost:4000')
socket.on('new_message', (newMessage: Message) => {
  messagesQueu.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueu.length > 0) {
        setMessages(oldState => [
          messagesQueu[0],
          oldState[0],
          oldState[1],
        ].filter(Boolean))

        messagesQueu.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('/messages/last3').then(response => setMessages(response.data))
  }, [])

  return (
    <div className={styles.containerMessage}>
      <img src={logoImg} alt="Logo DoWhile" />
      <ul className={styles.messageList}>

        {messages.map(message => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>

          )
        })}

      </ul>


    </div>
  )
}