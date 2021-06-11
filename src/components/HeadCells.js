import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const headCells = [
    { id: 'id', numeric: false, disablePadding: true, label: 'id' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Fecha' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Descripción'},
    { id: 'nickname', numeric: false, disablePadding: false, label: 'Usuario' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Estado' },
];

export function EnhancedTableHead(props) {
    return (
      <TableHead style={{backgroundColor:'#2c387e'}} >
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell style={{color: 'white'}}
              key={headCell.id}
              align="left"
              padding="5%"
            >
                {headCell.label}
            </TableCell>
          ))}
            <TableCell />
            <TableCell />
            <TableCell />
        </TableRow>
      </TableHead>
    );
  }