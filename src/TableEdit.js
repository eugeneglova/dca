import React, { useState, useEffect } from 'react'
import { EditingState } from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
  TableInlineCellEditing,
} from '@devexpress/dx-react-grid-material-ui'

const getRowId = row => row.id

const FocusableCell = ({ onClick, ...restProps }) => (
  <Table.Cell {...restProps} tabIndex={0} onFocus={onClick} />
)

function TableEdit({ rows: initRows, columns, onChange = () => {} }) {
  const [rows, setRows] = useState(initRows)
  const [editingCells, setEditingCells] = useState([])

  useEffect(() => {
    setRows(initRows)
  }, [initRows])

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ]
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row))
    }
    if (deleted) {
      const deletedSet = new Set(deleted)
      changedRows = rows.filter(row => !deletedSet.has(row.id))
    }
    setRows(changedRows)
    onChange(changedRows)
  }

  const addEmptyRow = () => commitChanges({ added: [{}] })

  return (
    <Grid rows={rows} columns={columns} getRowId={getRowId}>
      <EditingState
        onCommitChanges={commitChanges}
        editingCells={editingCells}
        onEditingCellsChange={setEditingCells}
        addedRows={[]}
        onAddedRowsChange={addEmptyRow}
      />
      <Table cellComponent={FocusableCell} />
      <TableHeaderRow />
      <TableInlineCellEditing selectTextOnEditStart />
      <TableEditColumn showAddCommand showDeleteCommand />
    </Grid>
  )
}

export default TableEdit
