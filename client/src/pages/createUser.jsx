import apiRoutes from "@/apiRoutes.js"
import UserForm from "@/components/business/UserForm.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback } from "react"
import cookie from "cookie"

export const getServerSideProps = async ({ req }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const { data } = await axios(apiRoutes.roles.read.collection())

  return {
    props: {
      roles: data,
      token: token,
    },
  }
}

const CreateUserPage = (props) => {
  const {
    roles: { result },
    token,
  } = props

  const handleSubmit = useCallback(
    async ({ firstName, lastName, email, password, roleId }, { resetForm }) => {
      await axios.post(
        apiRoutes.users.create(),
        {
          firstName,
          lastName,
          email,
          password,
          roleId,
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
    <Page title="Create a user" token={token}>
      <UserForm onSubmit={handleSubmit} roles={result} />
    </Page>
  )
}

export default CreateUserPage
