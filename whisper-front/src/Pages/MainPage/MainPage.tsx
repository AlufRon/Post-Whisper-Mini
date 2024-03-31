import React from 'react';
import { Box } from '@mui/material';
import { useBotStateSummary } from '../../services/botService';
import { usePostStateSummary } from '../../services/postService';
import { useActionStateSummary } from '../../services/actionService';
import ChartsGrid from './Components/ChartsGrid';
import Header from '../.Components/Header';
import Grid from '@mui/material/Unstable_Grid2';

const dataSections = [
    { title: 'Bots', useDataFetch: useBotStateSummary },
    { title: 'Posts', useDataFetch: usePostStateSummary },
    { title: 'Actions', useDataFetch: useActionStateSummary },
];

const MainPage: React.FC = () => {
    return (
        <>
            <Header title='Post Whisper'></Header>
            <Box sx={{ flexGrow: 1, padding: "20px" }}>
                <Grid container spacing={2}>
                    <ChartsGrid dataSections={dataSections} />
                </Grid>

            </Box>
        </>
    );
};

export default MainPage;
