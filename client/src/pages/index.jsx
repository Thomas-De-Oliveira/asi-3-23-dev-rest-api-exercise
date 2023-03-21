import Page from "@/components/Pages.jsx"
import cookie from "cookie"

export const getServerSideProps = async ({ req }) => {
  const { token } =
    req.headers.cookie !== undefined
      ? cookie.parse(req ? req.headers.cookie || "" : document.cookie)
      : { token: null }

  return {
    props: {
      token: token,
    },
  }
}

const IndexPage = (props) => {
  const { token } = props

  return (
    <Page title="Accueil" token={token}>
      Welcome~!
    </Page>
  )
}

IndexPage.isPublic = true

export default IndexPage
