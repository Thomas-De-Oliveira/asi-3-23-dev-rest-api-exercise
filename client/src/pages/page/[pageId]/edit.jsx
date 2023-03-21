import apiRoutes from "@/apiRoutes.js"
import Page from "@/components/Pages.jsx"
import PageForm from "@/components/business/PageForm"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { formatPage } from "@/dataFormatters.js"
import cookie from "cookie"

export const getServerSideProps = async ({ req, params }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )
  const { data } = await axios(apiRoutes.nav.read.collection(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  const pageId = params.pageId

  return {
    props: {
      navigation: data,
      pageId: pageId,
      token: token,
    },
  }
}

const EditPage = (props) => {
  const {
    navigation: { result },
    pageId,
    token,
  } = props

  const [page, setPage] = useState(null)
  const handleSubmit = useCallback(
    async ({ title, content, slug, status, navId }) => {
      const {
        data: { result },
      } = await axios.patch(
        apiRoutes.pages.update(pageId),
        {
          title,
          content,
          slug,
          status,
          navId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setPage(formatPage(result))
    },
    [token, pageId]
  )

  useEffect(() => {
    ;(async () => {
      const {
        data: { result },
      } = await axios(apiRoutes.pages.read.single(pageId), {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPage(formatPage(result))
    })()
  }, [token, pageId])

  if (!page) {
    return "Loading..."
  }

  return (
    <Page title={`Editing page #${pageId}`} token={token}>
      <PageForm
        onSubmit={handleSubmit}
        initialValues={page[0]}
        navigation={result}
      />
    </Page>
  )
}

export default EditPage
