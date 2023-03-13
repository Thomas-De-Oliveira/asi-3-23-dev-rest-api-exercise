import Table, { TableCell, TableHeader } from "../ui/Table.jsx"
import routes from "@/routes.js"
import Link from "next/link.js"
import { useCallback } from "react"

const headers = ["First name", "Last name", "E-mail", "role"]
const itemKeys = ["firstName", "lastName", "email", "role"]

const UserList = (props) => {
  const { users, deleteUser } = props
  const handleClickDelete = useCallback(
    async (event) => {
      const userId = Number.parseInt(
        event.currentTarget.getAttribute("data-user-id"),
        10
      )

      deleteUser(userId)
    },
    [deleteUser]
  )

  return (
    <Table headers={headers} itemKeys={itemKeys} items={users}>
      <thead>
        <tr>
          {headers.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
          <TableHeader colSpan={2}>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            {itemKeys.map((itemKey) => (
              <TableCell key={itemKey}>{user[itemKey]}</TableCell>
            ))}
            <TableCell>
              <Link href={routes.users.update(user.id)}>Edit</Link>
            </TableCell>
            <TableCell>
              <div className="flex ">
                <button data-user-id={user.id} onClick={handleClickDelete}>
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

export default UserList
