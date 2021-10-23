import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string
  name: string
  avatar_url: string
  login: string
}
type AuthContextData = {
  user: User | null
  signInUrl: string
  signOut: () => void
}

type AuthProvider = {
  children: ReactNode
}

type AuthResponse = {
  token: string
  user: {
    id: string
    name: string
    avatar_url: string
    login: string
  }
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=009a8625c896fce45359`

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('/authenticate', {
      code: githubCode
    })

    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)
    api.defaults.headers.common.authorization = `Bearer ${token}`
    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCOde = url.includes('?code=')

    if (hasGithubCOde) {
      const [urlWhithoutCode, githubCode] = url.split('?code=')
      window.history.pushState({}, '', urlWhithoutCode)
      signIn(githubCode)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}