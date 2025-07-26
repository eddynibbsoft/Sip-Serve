import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';

type MenuItems = {
  menu_id: string;
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  price: number;
  description: string;
};

type MenuTableProps = {
  rows: MenuItems[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MenuTable: React.FC<MenuTableProps> = ({ rows, onEdit, onDelete }) => {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof MenuItems>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (property: keyof MenuItems) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortRows = (rows: MenuItems[], comparator: (a: MenuItems, b: MenuItems) => number) => {
    return [...rows].sort(comparator);
  };

  const comparator = (a: MenuItems, b: MenuItems) => {
    if (orderBy === 'created_at' || orderBy === 'updated_at') {
      const dateA = parseISO(a[orderBy]);
      const dateB = parseISO(b[orderBy]);
      return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    const valueA = a[orderBy] as string | number;
    const valueB = b[orderBy] as string | number;
    return order === 'asc' ? (valueA < valueB ? -1 : 1) : (valueA > valueB ? -1 : 1);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'menu_id'}
                direction={order}
                onClick={() => handleRequestSort('menu_id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={order}
                onClick={() => handleRequestSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Description</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'created_at'}
                direction={order}
                onClick={() => handleRequestSort('created_at')}
              >
                Created
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'updated_at'}
                direction={order}
                onClick={() => handleRequestSort('updated_at')}
              >
                Updated
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortRows(rows, comparator)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.menu_id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
  {item.created_at ? formatDistanceToNow(parseISO(item.created_at), { addSuffix: true }) : 'N/A'}
</TableCell>
<TableCell>
  {item.updated_at ? formatDistanceToNow(parseISO(item.updated_at), { addSuffix: true }) : 'N/A'}
</TableCell>

                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => onEdit(item.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => onDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
