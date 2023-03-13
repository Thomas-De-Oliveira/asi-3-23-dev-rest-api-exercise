import apiRoutes from "@/apiRoutes.js"
import UserFormEdit from "@/components/business/UserFormEdit.jsx"
import Page from "@/components/Pages.jsx"
import ErrorMessages from "@/components/ui/ErrorMessages.jsx"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { formatUser } from "@/dataFormatters.js"

export const getServerSideProps = async ({ params }) => {
  const userId = params.userId
  const { data } = await axios(apiRoutes.roles.read.collection())

  return {
    props: {
      roles: data,
      userId: userId,
    },
  }
}

const EditUserPage = (props) => {
  const {
    roles: { result },
    userId,
  } = props
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const handleSubmit = useCallback(
    async ({ firstName, lastName, email, roleId }) => {
      setError("")

      try {
        const {
          data: { result },
        } = await axios.patch(apiRoutes.users.update(userId), {
          firstName,
          lastName,
          email,
          roleId,
        })

        setUser(formatUser(result))
      } catch (err) {
        setError(err.response?.data?.error || "Oops, something went wrong.")
      }
    },
    [userId]
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
    <Page title={`Editing user #${userId}`}>
      {error && (
        <ErrorMessages className="max-w-xl mx-auto my-8" errors={error} />
      )}
      <UserFormEdit
        onSubmit={handleSubmit}
        initialValues={user[0]}
        roles={result}
      />
    </Page>
  )
}

export default EditUserPage
