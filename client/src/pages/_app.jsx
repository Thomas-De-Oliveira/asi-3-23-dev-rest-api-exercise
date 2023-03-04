import "@/globals.css"
import Page from "@/web/components/Pages"

const App = ({ Component, pageProps }) => {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  )
}

export default App
