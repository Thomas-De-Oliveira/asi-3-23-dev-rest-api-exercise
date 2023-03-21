export const TableHeader = (props) => (
  <th
    {...props}
    className="bg-slate-200 p-4 border-l border-b first:border-l-0 border-l-slate-500 border-b-slate-500"
  />
)

export const TableCell = (props) => (
  <td
    {...props}
    className="p-4 border-l first:border-l-0 border-b border-l-slate-500 border-b-slate-500"
  />
)

const Table = (props) => {
  const { children } = props

  return <table>{children}</table>
}

export default Table
