import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { useBotData } from '../../../services/botService';
import { Bot } from '../../../types/Interfaces';
import { useNavigate } from 'react-router-dom';
import { ContentCopyIcon, EditIcon } from '../../../Styles/icons';


type Order = 'asc' | 'desc';
type BotWithActionCount = Omit<Bot, 'actions'> & {
  actionCount: number;
  edit: string
};
const headCells: { id: keyof BotWithActionCount; label: string }[] = [
  { id: 'id', label: 'ID' },
  { id: 'email', label: 'Email' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'actionCount', label: 'Actions' },
  { id: 'accessToken', label: 'Token' },
  { id: 'accessTokenSecret', label: 'Secret' },
  { id: 'personalityTraits', label: 'Traits' },
  { id: 'createdAt', label: 'Created' },
  { id: 'updatedAt', label: 'Updated' },
  { id: 'edit', label: 'Edit' },

];

const BotTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [orderBy, setOrderBy] = useState<keyof BotWithActionCount>('name');
  const [order, setOrder] = useState<Order>('asc');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleIdClick = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };
  const { data: bots, isLoading, error, totalCount } = useBotData(
    page + 1,
    rowsPerPage,
  );

  const botsWithActionCount: BotWithActionCount[] = useMemo(() => bots.map(bot => ({
    ...bot,
    actionCount: typeof bot.Actions === 'number' ? bot.Actions : 0,
    edit: "edit"
  })), [bots]);

  const sortedBots: BotWithActionCount[] = useMemo(() => {
    const sorted = [...botsWithActionCount].sort((a, b) => {
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
    return sorted;
  }, [botsWithActionCount, orderBy, order]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };


  const handleRequestSort = (property: keyof BotWithActionCount) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property: keyof BotWithActionCount) => () => {
    handleRequestSort(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            {sortedBots.map((bot) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={bot.id} sx={{
                '&:nth-of-type(even)': { backgroundColor: '#f3f3f3' }
              }}>
                <TableCell onClick={() => handleIdClick(bot.id)} style={{ cursor: 'pointer' }} sx={{ minWidth: '90px' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent TableCell onClick
                      copyToClipboard(bot.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(bot.id);
                    }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                  {expandedRowId === bot.id ? bot.id : `${bot.id.slice(0, 5)}...`}
                </TableCell>
                <TableCell>{bot.email}</TableCell>
                <TableCell>{bot.name}</TableCell>
                <TableCell sx={{ color: bot.status !== 'ACTIVE' ? 'Red' : 'Green' }}>
                  {bot.status}</TableCell>
                <TableCell>{bot.actionCount}</TableCell>
                <TableCell sx={{ color: !bot.accessToken ? 'firebrick' : 'inherit' }}>{bot.accessToken || 'N/A'}</TableCell>
                <TableCell sx={{ color: !bot.accessTokenSecret ? 'firebrick' : 'inherit' }}>{bot.accessTokenSecret || 'N/A'}</TableCell>
                <TableCell>{bot.personalityTraits.join(', ')}</TableCell>
                <TableCell>{bot.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>{bot.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell sx={{ alignItems: "center" }}>
                  <EditIcon
                    onClick={(e) => {
                      navigate(`/edit-bot/${bot.id}`);
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
}
export default BotTable;
