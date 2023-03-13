import { AppContextProvider } from "@/components/AppContext.jsx"
import "@/globals.css"

const App = ({ Component, pageProps, router }) => {
  return (
    <AppContextProvider isPublicPage={Component.isPublic}>
      <Component {...pageProps} router={router} />
    </AppContextProvider>
  )
}

export default App
