import Table, { TableCell, TableHeader } from "../ui/Table.jsx"
import routes from "@/routes.js"
import Link from "next/link.js"
import { useCallback } from "react"

const headers = ["Name"]
const itemKeys = ["name"]

const NavList = (props) => {
  const { navigation, deleteNav } = props
  const handleClickDelete = useCallback(
    async (event) => {
      const navId = Number.parseInt(
        event.currentTarget.getAttribute("data-user-id"),
        10
      )

      deleteNav(navId)
    },
    [deleteNav]
  )

  return (
    <Table headers={headers} itemKeys={itemKeys} items={navigation}>
      <thead>
        <tr>
          {headers.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
          <TableHeader colSpan={2}>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {navigation.map((nav) => (
          <tr key={nav.id}>
            {itemKeys.map((itemKey) => (
              <TableCell key={itemKey}>
                <div className="flex justify-center">{nav[itemKey]}</div>
              </TableCell>
            ))}
            <TableCell>
              <Link
                href={routes.nav.update(nav.id)}
                className="flex justify-center"
              >
                Edit
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <button data-user-id={nav.id} onClick={handleClickDelete}>
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

export default NavList
