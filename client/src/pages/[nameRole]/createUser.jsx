import apiRoutes from "@/apiRoutes.js"
import UserForm from "@/components/business/UserForm.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback } from "react"

export const getServerSideProps = async ({ params }) => {
  const sessionRole = params.nameRole
  const { data } = await axios(apiRoutes.roles.read.collection())

  return {
    props: {
      roles: data,
      nameRole: sessionRole,
    },
  }
}

const CreateUserPage = (props) => {
  const {
    roles: { result },
    nameRole,
  } = props

  const handleSubmit = useCallback(
    async ({ firstName, lastName, email, password, roleId }, { resetForm }) => {
      await axios.post(apiRoutes.users.create(nameRole), {
        firstName,
        lastName,
        email,
        password,
        roleId,
      })

      resetForm()
    },
    [nameRole]
  )

  return (
    <Page title="Create a user">
      <UserForm onSubmit={handleSubmit} roles={result} />
    </Page>
  )
}

export default CreateUserPage
