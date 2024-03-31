import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { PostWithActions } from '../../../types/Interfaces';
import { useNavigate } from 'react-router-dom';
import { ContentCopyIcon, EditIcon } from '../../../Styles/icons';
import { usePostData } from '../../../services/postService';


type Order = 'asc' | 'desc';
type PostWithActionCount = Omit<PostWithActions, 'actions'> & {
    actionCount: number;
    edit: string
};
const headCells: { id: keyof PostWithActionCount; label: string }[] = [
    { id: 'id', label: 'ID' },
    { id: 'link', label: 'Link' },
    { id: 'content', label: 'Content' },
    { id: 'actionCount', label: 'Actions' },
    { id: 'type', label: 'Type' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'updatedAt', label: 'Updated At' },
    { id: 'edit', label: 'Edit' },
];

interface PostTableProps {
    onSelectPost?: (postId: string) => void;
}

const PostTable: React.FC<PostTableProps> = ({ onSelectPost }) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [orderBy, setOrderBy] = useState<keyof PostWithActionCount>('type');
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
    const { data: posts, isLoading, error, totalCount } = usePostData(
        page + 1,
        rowsPerPage,
    );

    const postsWithActionCount: PostWithActionCount[] = useMemo(() => posts.map(post => ({
        ...post,
        actionCount: post.actions ? post.actions.length : 0,
        edit: "edit"
    })), [posts]);

    const sortedPosts: PostWithActionCount[] = useMemo(() => {
        const sorted = [...postsWithActionCount].sort((a, b) => {
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
    }, [postsWithActionCount, orderBy, order]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };


    const handleRequestSort = (property: keyof PostWithActionCount) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: keyof PostWithActionCount) => () => {
        handleRequestSort(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (postId: string) => {
        if (onSelectPost) {
            onSelectPost(postId);
        } else {
            handleIdClick(postId);
        }
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
                        {sortedPosts.map((post) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={post.id} sx={{
                                '&:nth-of-type(even)': { backgroundColor: '#f3f3f3' }
                            }} onClick={() => handleRowClick(post.id)}>
                                <TableCell onClick={() => handleIdClick(post.id)} style={{ cursor: 'pointer' }} sx={{ minWidth: '90px' }}>
                                    {!onSelectPost && <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(post.id);
                                        }}
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(post.id);
                                        }}
                                    >
                                        <ContentCopyIcon fontSize="inherit" />
                                    </IconButton>}
                                    {(onSelectPost || expandedRowId === post.id) ? post.id : `${post.id.slice(0, 5)}...`}
                                </TableCell>
                                <TableCell>{post.link}</TableCell>
                                <TableCell onClick={() => handleIdClick(post.content)} style={{ cursor: 'pointer' }} sx={{ minWidth: '90px' }}>
                                    {expandedRowId === post.content ? post.content : `${post.content.slice(0, 80)}...`}
                                </TableCell>
                                <TableCell>{post.actionCount}</TableCell>
                                <TableCell>{post.type}</TableCell>
                                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell sx={{ alignItems: "center" }}>
                                    <EditIcon
                                        onClick={(e) => {
                                            navigate(`/edit-post/${post.id}`);
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
export default PostTable;
