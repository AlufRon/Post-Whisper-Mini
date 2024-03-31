import React from 'react';
import BotTable from './Components/BotTable';
import Header from '../.Components/Header'
import { NoteAddIcon } from '../../Styles/icons';
import { IconButton, Tooltip } from '@mui/material/';
import { useNavigate } from 'react-router-dom';

const BotPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header title='Bots'>
                <Tooltip title="Create new bot" placement="left">
                    <IconButton onClick={() => navigate('/addBot')} aria-label="edit">
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
            </Header>
            <BotTable />

        </>
    );
};

export default BotPage;
