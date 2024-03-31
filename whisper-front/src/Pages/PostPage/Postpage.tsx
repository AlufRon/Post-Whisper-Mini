import React from 'react';
import PostTable from './Components/PostTable';
import Header from '../.Components/Header'
import { PostAddIcon } from '../../Styles/icons';
import { IconButton, Tooltip } from '@mui/material/';
import { useNavigate } from 'react-router-dom';

const PostPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header title='Posts'>
                <Tooltip title="Create new Post" placement="left">
                    <IconButton onClick={() => navigate('/addPost')} aria-label="edit">
                        <PostAddIcon />
                    </IconButton>
                </Tooltip>
            </Header>
            <PostTable />
        </>
    );
};

export default PostPage;
