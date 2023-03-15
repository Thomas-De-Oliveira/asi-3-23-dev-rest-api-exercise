import Table, { TableCell, TableHeader } from "../ui/Table.jsx"
import routes from "@/routes.js"
import Link from "next/link.js"
import { useCallback } from "react"

const headers = ["Title", "Content", "Slug", "Status", "First Name"]
const itemKeys = ["title", "content", "slug", "status", "firstName"]

const PageList = (props) => {
  const { pages, deletePage } = props
  const handleClickDelete = useCallback(
    async (event) => {
      const pageId = Number.parseInt(
        event.currentTarget.getAttribute("data-user-id"),
        10
      )

      deletePage(pageId)
    },
    [deletePage]
  )

  return (
    <Table headers={headers} itemKeys={itemKeys} items={pages}>
      <thead>
        <tr>
          {headers.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
          <TableHeader colSpan={2}>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {pages.map((page) => (
          <tr key={page.id}>
            {itemKeys.map((itemKey) => (
              <TableCell key={itemKey}>{page[itemKey]}</TableCell>
            ))}
            <TableCell>
              <Link href={routes.pages.update(page.id)}>Edit</Link>
            </TableCell>
            <TableCell>
              <div className="flex ">
                <button data-user-id={page.id} onClick={handleClickDelete}>
                  DELETE
                </button>
              </div>
            </TableCell>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default PageList
