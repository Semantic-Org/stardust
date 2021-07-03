import React from 'react'
import { Table } from 'semantic-ui-react'

const headerRow = ['Name', 'Status', 'Notes']
const renderBodyRow = ({ name, status, notes }, index) => ({
  key: index,
  cells: [name || { key: 0 }, status || { key: 1 }, notes || { key: 2 }],
})

const tableData = [
  { name: undefined, status: 'Repeat', notes: 'Repeat' },
  { name: 'Jimmy', status: 'Requires Action', notes: undefined },
  { name: 'Jamie', status: undefined, notes: 'Hostile' },
  { name: 'Jill', status: undefined, notes: undefined },
]

const TableExampleWithTableData = () => (
  <Table
    tableData={tableData}
    headerRow={headerRow}
    renderBodyRow={renderBodyRow}
  />
)

export default TableExampleWithTableData
