import apiRoutes from "../apiRoutes.js"
import UserList from "../components/business/UserList.jsx"
import Page from "../components/Pages.jsx"
import axios from "axios"
import Button from "@/components/ui/Button.jsx"
import Link from "next/link.js"
import routes from "@/routes.js"
import { useCallback, useState } from "react"
import cookie from "cookie"

export const getServerSideProps = async ({ req }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const { data } = await axios(apiRoutes.users.read.collection(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  return {
    props: {
      users: data,
      token: token,
    },
  }
}

const UsersPage = (props) => {
  const {
    users: { result },
    token,
  } = props

  const [users, setUsers] = useState(result)

  const deleteUser = useCallback(
    async (userId) => {
      await axios.delete(apiRoutes.users.delete(userId), {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUsers((users) => users.filter(({ id }) => id !== userId))
    },
    [token]
  )

  return (
    <Page title="List of all users" token={token}>
      <UserList users={users} deleteUser={deleteUser} />
      <Button className="m-10">
        <Link href={routes.users.create()}>Create User</Link>
      </Button>
    </Page>
  )
}

export default UsersPage
