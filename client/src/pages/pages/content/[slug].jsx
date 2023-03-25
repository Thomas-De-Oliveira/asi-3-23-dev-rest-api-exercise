import Page from "@/components/Pages.jsx"
import apiRoutes from "@/apiRoutes"
import axios from "axios"
import cookie from "cookie"
import Button from "@/components/ui/Button"
import Link from "@/components/Link"
import routes from "@/routes"

export const getServerSideProps = async ({ req, params }) => {
  const slug = params.slug
  const { token } =
    req.headers.cookie !== undefined
      ? cookie.parse(req ? req.headers.cookie || "" : document.cookie)
      : { token: null }
  const { data } =
    token !== null
      ? await axios(apiRoutes.pages.read.contentPage(slug), {
          headers: { Authorization: `Bearer ${token}` },
        })
      : await axios(apiRoutes.pages.read.contentPage(slug))

  return {
    props: {
      page: data,
      token: token,
    },
  }
}

const ContentPage = (props) => {
  const {
    page: { result },
    token,
  } = props

  return (
    <Page title="Article" token={token}>
      {result.map((page) => (
        <div key={page.id} className="text-center pt-10">
          <h1 className="font-semibold text-2xl">{page.title}</h1>
          <p className="pt-10 text-xl">{page.content}</p>
          <Button className="mt-10" hidden={token !== undefined ? false : true}>
            <Link
              className="px-4 py-4 w-full h-full block"
              href={routes.pages.updateContent(page.id)}
            >
              Mettre a jour le contenu de la page
            </Link>
          </Button>
        </div>
      ))}
    </Page>
  )
}

ContentPage.isPublic = true

export default ContentPage
