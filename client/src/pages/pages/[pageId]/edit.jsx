import apiRoutes from "@/apiRoutes.js"
import Page from "@/components/Pages.jsx"
import PageFormContent from "@/components/business/PageFormContent.jsx"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { formatPage } from "@/dataFormatters.js"
import cookie from "cookie"

export const getServerSideProps = async ({ req, params }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  )

  const pageId = params.pageId

  return {
    props: {
      pageId: pageId,
      token: token,
    },
  }
}

const EditPageContent = (props) => {
  const { pageId, token } = props

  const [page, setPage] = useState(null)
  const handleSubmit = useCallback(
    async ({ content }) => {
      const {
        data: { result },
      } = await axios.patch(
        apiRoutes.pages.updateContent(pageId),
        {
          content,
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
    <Page title={`Editing content page #${pageId}`} token={token}>
      <PageFormContent onSubmit={handleSubmit} initialValues={page[0]} />
    </Page>
  )
}

export default EditPageContent
