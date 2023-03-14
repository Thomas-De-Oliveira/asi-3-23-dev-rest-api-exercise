import clsx from "clsx"
import Head from "next/head.js"
import AppContext from "@/components/AppContext.jsx"
import routes from "@/routes.js"
import { useState, useContext } from "react"
import Link from "./Link"
import { useRouter } from "next/router.js"
import { useCallback, useEffect } from "react"
import apiRoutes from "@/apiRoutes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

const Page = (props) => {
  const { title, children, classNames } = props
  const router = useRouter()

  const {
    state: { session },
  } = useContext(AppContext)

  const [navigation, setNav] = useState([])

  useEffect(() => {
    ;(async () => {
      const {
        data: { result },
      } = await axios(apiRoutes.nav.read.collectionWithPages())

      setNav(result)
    })()
  }, [])

  const { signOut } = useContext(AppContext)

  const handleSignOut = useCallback(async () => {
    await signOut()

    router.push("/")
  }, [signOut, router])

  const [isOpen, setIsOpen] = useState(false)

  const handleIsOpenClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <main className="flex flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="flex p-4 border-b bg-slate-400 sticky items-center">
        <nav className="flex items-center">
          <h1>Exercice Node</h1>
          <div className="flex items-center ml-auto transition-all transition-duration-200 ">
            <button
              className={`px-2 py-1 z-10 transition duration-200 ease-in-out transform ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
              onClick={handleIsOpenClick}
            >
              {isOpen ? (
                <FontAwesomeIcon icon={faXmark} className="h-6 text-black" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="h-6 text-black" />
              )}
            </button>
          </div>

          <div
            className={`${
              isOpen ? "pt-16 h-auto bg-stone-300" : "hidden"
            } z-[-1] md:z-0 absolute right-0 top-0 bg-white rounded-md shadow-md w-full overflow-scroll h-fit items-center md:w-80 md:h-screen`}
          >
            <div className="flex flex-col items-center">
              <Link
                href={routes.home()}
                onClick={handleIsOpenClick}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {" "}
                Accueil
              </Link>
              {navigation.map((nav, index) => (
                <div key={index} className="group">
                  <h1 className="text-lg font-semibold">{nav.name}</h1>
                  <div className="hidden group-hover:block hover:block">
                    {nav.pages.map((page, index) => (
                      <li key={index} className="text-sm text-gray-600 my-2.5">
                        <Link
                          href={"/"}
                          onClick={handleIsOpenClick}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          {" "}
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {session && !session.user ? (
              <div className="flex flex-col items-center">
                <Link
                  href={routes.sign.in()}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Me Connecter
                </Link>
              </div>
            ) : session.user.role === "admin" ? (
              <div className="flex flex-col items-center">
                <Link
                  href={routes.users.read.collection(session.user.role)}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Utilisateurs
                </Link>
                <Link
                  href={routes.users.create(session.user.role)}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Ajout utilisateur
                </Link>
                <Link
                  href={routes.nav.read.collection(session.user.role)}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Controle Navbar
                </Link>
                <Link
                  href={"/"}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Controle Pages
                </Link>
                <Link
                  href={"/"}
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Déconnexion
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Link
                  href={routes.users.read.single(session.user.id)}
                  onClick={handleIsOpenClick}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Mon compte
                </Link>
                <Link
                  href={"/"}
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {" "}
                  Déconnexion
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
      <section className={clsx("flex flex-col", classNames)}>
        {children}
      </section>
    </main>
  )
}

Page.isPublic = true

export default Page
