import Loader from "@/components/ui/Loader.jsx"
import signInService from "@/services/SignIn.js"
import { createContext, useCallback, useEffect, useState } from "react"
import createAPIClient from "@/createAPIClient"
import parseSession from "@/parseSession"

const SESSION_LOADING = Symbol("session is loading")

const initialState = {
  session: SESSION_LOADING,
}

export const AppContextProvider = (props) => {
  const { isPublicPage, ...otherProps } = props
  const [session, setSession] = useState(initialState)
  const [jwt, setJWT] = useState(null)
  const api = createAPIClient({ jwt })

  const signIn = signInService({ api, setSession, setJWT })
  const signOut = useCallback(() => {
    localStorage.removeItem("app_session")
    setSession(SESSION_LOADING)
    const date = new Date()
    date.setDate(date.getDate() - 1)
    document.cookie = `token=; expires=${date}; path=/;`
  }, [])

  useEffect(() => {
    const jwt = localStorage.getItem("app_session")

    if (!jwt) {
      return
    }

    const session = parseSession(jwt)

    setSession(session)
    setJWT({ jwt })
  }, [setSession])

  if (!isPublicPage && session === SESSION_LOADING) {
    return (
      <div className="fixed inset-0 bg-white z-1000 flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    )
  }

  return (
    <AppContext.Provider
      {...otherProps}
      value={{ state: { session }, signIn, signOut }}
    />
  )
}

const AppContext = createContext()

export default AppContext
