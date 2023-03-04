import clsx from "clsx"
import Head from "next/head.js"
import { useState } from "react"
import Link from "./Link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

const Page = (props) => {
  const { title, children, classNames } = props

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
                href={`/`}
                onClick={handleIsOpenClick}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {" "}
                Mes commandes
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <section className={clsx("flex flex-col", classNames)}>
        {children}
      </section>
    </main>
  )
}

export default Page
