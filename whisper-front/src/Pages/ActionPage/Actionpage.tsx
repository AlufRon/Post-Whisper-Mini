import React from 'react';
import Header from '../.Components/Header'
import { NoteAddIcon } from '../../Styles/icons';
import { IconButton, Tooltip } from '@mui/material/';
import { useNavigate } from 'react-router-dom';
import ActionTable from './Components/ActionTable';

const ActionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header title='Actions'>
                <Tooltip title="Create new Actions" placement="left">
                    <IconButton onClick={() => navigate('/addAction')} aria-label="edit">
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
            </Header>
            <ActionTable />
        </>
    );
};

export default ActionPage;
