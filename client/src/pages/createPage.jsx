import apiRoutes from "@/apiRoutes.js"
import PageForm from "@/components/business/PageForm.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback } from "react"
import cookie from "cookie"

export const getServerSideProps = async ({ req }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  
  const { data } = await axios(apiRoutes.nav.read.collection(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  return {
    props: {
      navigation: data,
      token: token,
    },
  }
}

const CreatePage = (props) => {
  const { navigation: {result}, token } = props

  const handleSubmit = useCallback(
    async ({ title, content, slug, status, navId }, { resetForm }) => {
      await axios.post(
        apiRoutes.pages.create(),
        {
            title,
            content,
            slug,
            status,
            navId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      resetForm()
    },
    [token]
  )

  return (
    <Page title="Create a user">
      <PageForm onSubmit={handleSubmit} navigation={result}/>
    </Page>
  )
}

export default CreatePage
