import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { useActionData } from '../../../services/actionService';
import { Action, ActionType, ActionStatus } from '../../../types/Interfaces';
import { useNavigate } from 'react-router-dom';
import { ContentCopyIcon, EditIcon } from '../../../Styles/icons';

type Order = 'asc' | 'desc';
interface ActionIds {
  id: string;
  botId: string;
  postId: string;
}

type ActionWithEdit = Action & {
  edit: string
};
const headCells: { id: keyof ActionWithEdit; label: string }[] = [
  { id: 'id', label: 'ID' },
  { id: 'botId', label: 'Bot ID' },
  { id: 'postId', label: 'Post ID' },
  { id: 'comment', label: 'Comment' },
  { id: 'twitterPostId', label: 'Twitter Post ID' },
  { id: 'actionType', label: 'Type' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: 'edit', label: 'Edit' },
];

const ActionTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [orderBy, setOrderBy] = useState<keyof ActionWithEdit>('createdAt');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string>("");

  const [order, setOrder] = useState<Order>('asc');
  const navigate = useNavigate();
  const { data: actions, isLoading, error, totalCount } = useActionData(
    page + 1,
    rowsPerPage,
  );

  const sortedActions: Action[] = useMemo(() => {
    if (orderBy !== "edit") {
      const sorted = [...actions].sort((a, b) => {
        const getSortableValue = (value: any): string | number => {
          if (value instanceof Date) {
            return value.getTime();
          } else if (value !== null) {
            return value;
          }
          return '';
        };

        const aValue = getSortableValue(a[orderBy]);
        const bValue = getSortableValue(b[orderBy]);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          return 0;
        }

    });
  return sorted;} else{
    return actions
  }
}, [actions, orderBy, order]);
const handleChangePage = (event: unknown, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const handleIdClick = (id: string | undefined, key: string) => {
  if (id) {
    if (expandedRowId === id && expandedId === key ) {
      setExpandedRowId(null);
      setExpandedId("")
    } else {
      setExpandedRowId(id);
      setExpandedId(key)
    }
  }
};

const handleRequestSort = (property: keyof ActionWithEdit) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

const createSortHandler = (property: keyof ActionWithEdit) => () => {
  handleRequestSort(property);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }, (err) => {
    console.error('Could not copy text: ', err);
  });
};


if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error loading data</p>;

return (
  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
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
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedActions.map((action) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={action.id} sx={{
              '&:nth-of-type(even)': { backgroundColor: '#f3f3f3' }
            }}>
              {(["id", "botId", "postId"] as (keyof ActionIds)[]).map((field) => (
                <TableCell onClick={() => handleIdClick(action[field], action.id)} style={{ cursor: 'pointer' }} sx={{ minWidth: '90px' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(action[field]);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(action[field]);
                    }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                  {expandedRowId === action[field] && expandedId === action.id  ? action[field] : `${action[field].slice(0, 5)}...`}
                </TableCell>
              ))}
              <TableCell onClick={() => handleIdClick(action.comment, action.id)} style={{ cursor: 'pointer' }} sx={{ minWidth: '90px' }}>
                {action.comment ? expandedRowId === action.comment ?
                  action.comment : `${action.comment.slice(0, 80)}...` : ""}
              </TableCell>
              <TableCell>{action.twitterPostId}</TableCell>
              <TableCell>{action.actionType}</TableCell>
              <TableCell sx={{ color: action.status === "COMPLETED" ? 'Green' : 'inherit' }}>{action.status}</TableCell>
              <TableCell>{new Date(action.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(action.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell sx={{ alignItems: "center" }}>
                <EditIcon
                  onClick={(e) => {
                    navigate(`/edit-post/${action.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 100]}
      component="div"
      count={totalCount || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
);
};

export default ActionTable;