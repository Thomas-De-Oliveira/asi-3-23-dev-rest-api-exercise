import apiRoutes from "@/apiRoutes.js"
import PageList from "@/components/business/PageList.jsx"
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

  const { data } = await axios(apiRoutes.pages.read.collection(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  return {
    props: {
      pages: data,
      token: token,
    },
  }
}

const NavPage = (props) => {
  const {
    pages: { result },
    token,
  } = props

  const [pages, setPages] = useState(result)

  const deletePage = useCallback(
    async (pageId) => {
      await axios.delete(apiRoutes.pages.delete(pageId), {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPages((pages) => pages.filter(({ id }) => id !== pageId))
    },
    [token]
  )

  return (
    <Page title="List of all users" token={token}>
      <PageList pages={pages} deletePage={deletePage} />
      <Button className="m-10">
        <Link href={routes.pages.create()}>Create Page</Link>
      </Button>
    </Page>
  )
}

export default NavPage
