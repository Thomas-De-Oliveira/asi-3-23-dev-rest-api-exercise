import apiRoutes from "../../apiRoutes.js"
import NavList from "../../components/business/NavList.jsx"
import Page from "../../components/Pages.jsx"
import axios from "axios"
import { useCallback, useState } from "react"
import cookie from "cookie"
import Button from "@/components/ui/Button.jsx"
import Link from "next/link.js"
import routes from "@/routes.js"

export const getServerSideProps = async ({ req, params }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const sessionRole = params.nameRole
  const { data } = await axios(apiRoutes.nav.read.collection(sessionRole), {
    headers: { Authorization: `Bearer ${token}` },
  })

  return {
    props: {
      navigation: data,
      token: token,
    },
  }
}

const NavPage = (props) => {
  const {
    navigation: { result },
    token,
  } = props

  const [navigation, setNav] = useState(result)

  const deleteNav = useCallback(
    async (navId) => {
      await axios.delete(apiRoutes.nav.delete(navId), {
        headers: { Authorization: `Bearer ${token}` },
      })

      setNav((navigation) => navigation.filter(({ id }) => id !== navId))
    },
    [token]
  )

  return (
    <Page title="List of all nav title">
      <NavList navigation={navigation} deleteNav={deleteNav} />
      <div className="mt-2">
        <Button>
          <Link href={routes.nav.create()}>Create NavBar title</Link>
        </Button>
      </div>
    </Page>
  )
}

export default NavPage
