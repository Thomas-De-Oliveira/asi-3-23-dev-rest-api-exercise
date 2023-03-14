import apiRoutes from "@/apiRoutes.js"
import Page from "@/components/Pages.jsx"
import NavForm from "@/components/business/NavForm"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { formatNav } from "@/dataFormatters.js"
import cookie from "cookie"

export const getServerSideProps = async ({ req, params }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const navId = params.navId

  return {
    props: {
      navId: navId,
      token: token,
    },
  }
}

const EditNavPage = (props) => {
  const { navId, token } = props

  const [navigation, setNav] = useState(null)
  const handleSubmit = useCallback(
    async ({ name }) => {
      const {
        data: { result },
      } = await axios.patch(
        apiRoutes.nav.update(navId),
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setNav(formatNav(result))
    },
    [token, navId]
  )

  useEffect(() => {
    ;(async () => {
      const {
        data: { result },
      } = await axios(apiRoutes.nav.read.single(navId), {
        headers: { Authorization: `Bearer ${token}` },
      })

      setNav(formatNav(result))
    })()
  }, [token, navId])

  if (!navigation) {
    return "Loading..."
  }

  return (
    <Page title={`Editing user #${navId}`}>
      <NavForm onSubmit={handleSubmit} initialValues={navigation[0]} />
    </Page>
  )
}

export default EditNavPage
