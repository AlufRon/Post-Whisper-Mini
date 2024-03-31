import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { CustomPaper } from '../../../Styles/CustomStyles';
import CustomPieChart from './CustomPieChart';
import { CustomGridProps } from '../../../types/Interfaces';

const baseWidth = 330;
const paddingWidth = 36
const ChartsGrid = <T,>({ dataSections }: CustomGridProps<T>) => {

    return (
        <>
            {dataSections.map(({ title, useDataFetch, widthModifier }, index) => {
                const modifiedWidth = widthModifier ? baseWidth + widthModifier : baseWidth;
                const gridWidth = modifiedWidth + paddingWidth
                return (
                    <Grid key={index} xs={4} sx={{ maxWidth: `${gridWidth}px`, flexBasis: `${gridWidth}px`, flexGrow: 0 }}>
                        <CustomPaper sx={{ width: `${modifiedWidth}px`, height: '180px', alignContent: 'center' }}>
                            <CustomPieChart<T> title={title} useDataFetch={useDataFetch} />
                        </CustomPaper>
                    </Grid>
                );
            })}
        </>
    );
};

export default ChartsGrid;
