export const TableHeader = (props) => (
  <th
    {...props}
    className="bg-slate-200 p-4 border-l first:border-l-0 border-l-slate-300"
  />
)

export const TableCell = (props) => (
  <td {...props} className="p-4 border-l first:border-l-0 border-l-slate-300" />
)

const Table = (props) => {
  const { children } = props

  return <table className="w-full border-b">{children}</table>
}

export default Table
