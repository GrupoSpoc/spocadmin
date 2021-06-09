import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const headCells = [
    { id: 'id', numeric: false, disablePadding: true, label: 'id' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Descripción'},
    { id: 'nickname', numeric: false, disablePadding: false, label: 'Usuario' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Estado' },
];

export function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="left"
              padding="5%"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
            <TableCell />
            <TableCell />
            <TableCell />
        </TableRow>
      </TableHead>
    );
  }