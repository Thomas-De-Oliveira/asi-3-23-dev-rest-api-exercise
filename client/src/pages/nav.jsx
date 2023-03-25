import apiRoutes from "@/apiRoutes.js"
import NavList from "@/components/business/NavList.jsx"
import Page from "@/components/Pages.jsx"
import axios from "axios"
import { useCallback, useState } from "react"
import cookie from "cookie"
import Button from "@/components/ui/Button.jsx"
import Link from "next/link.js"
import routes from "@/routes.js"

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
    <Page title="List of all nav title" token={token}>
      <NavList navigation={navigation} deleteNav={deleteNav} />
      <Button className="m-10">
        <Link
          href={routes.nav.create()}
          className="px-4 py-4 w-full h-full block"
        >
          Create NavBar title
        </Link>
      </Button>
    </Page>
  )
}

export default NavPage
