import apiRoutes from "@/apiRoutes.js"
import NavForm from "@/components/business/NavForm.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback } from "react"
import cookie from "cookie"

export const getServerSideProps = async ({ req }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )

  return {
    props: {
      token: token,
    },
  }
}

const CreateNavPage = (props) => {
  const { token } = props

  const handleSubmit = useCallback(
    async ({ name }, { resetForm }) => {
      await axios.post(
        apiRoutes.nav.create(),
        {
          name,
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
    <Page title="Create a Menu" token={token}>
      <NavForm onSubmit={handleSubmit} />
    </Page>
  )
}

export default CreateNavPage
