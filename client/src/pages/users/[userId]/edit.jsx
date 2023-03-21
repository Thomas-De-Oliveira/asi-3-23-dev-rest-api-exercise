import apiRoutes from "@/apiRoutes.js"
import UserFormEdit from "@/components/business/UserFormEdit.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { formatUser } from "@/dataFormatters.js"
import cookie from "cookie"

export const getServerSideProps = async ({ req, params }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const userId = params.userId
  const { data } = await axios(apiRoutes.roles.read.collection())

  return {
    props: {
      roles: data,
      userId: userId,
      token: token,
    },
  }
}

const EditUserPage = (props) => {
  const {
    roles: { result },
    userId,
    token,
  } = props

  const [user, setUser] = useState(null)
  const handleSubmit = useCallback(
    async ({ firstName, lastName, email, roleId }) => {
      const {
        data: { result },
      } = await axios.patch(
        apiRoutes.users.update(userId),
        {
          firstName,
          lastName,
          email,
          roleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUser(formatUser(result))
    },
    [token, userId]
  )

  useEffect(() => {
    ;(async () => {
      const {
        data: { result },
      } = await axios(apiRoutes.users.read.single(userId))

      setUser(formatUser(result))
    })()
  }, [userId])

  if (!user) {
    return "Loading..."
  }

  return (
    <Page title={`Editing user #${userId}`} token={token}>
      <UserFormEdit
        onSubmit={handleSubmit}
        initialValues={user[0]}
        roles={result}
      />
    </Page>
  )
}

export default EditUserPage
