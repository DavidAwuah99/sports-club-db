function DataTable({ columns, rows, onRowClick, emptyMessage = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-gray-500">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, index) => (
            <tr
              key={row.id ?? index}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer transition-colors hover:bg-indigo-50/40' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
