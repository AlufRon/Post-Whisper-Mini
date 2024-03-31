import React, { useEffect } from 'react';
import { PieChart, PieChartProps, pieArcLabelClasses, HighlightScope } from '@mui/x-charts';
import { Box, Stack, Typography } from '@mui/material';
import { Skeleton } from '@mui/material';
import { UseDataFetchFunction } from '../../../types/StateSummary';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontWeight: 500,
    fontSize: 16,
}));


function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2 - 11}>
            {children}
        </StyledText>
    );
}

interface CustomPieChartProps<T> extends Omit<PieChartProps, 'series'> {
    title: string;
    useDataFetch: UseDataFetchFunction<T>;
}

const generatePieChartParams = (data: any[]): PieChartProps => ({
    series: [
        {
            data,
            arcLabel: (item) => `${item.value}`,
            innerRadius: 30,
            paddingAngle: 3,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 90,
            cy: '50%',
            cx: '50%',
        },
    ],
    sx: {
        [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
        },
    },
    margin: { top: 25, bottom: -50, left: 0, right: 0 },
    slotProps: {
        legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: { top: 0, bottom: 8, left: 0, right: 0 }
        }
    }
});

const renderSkeletonLoader = () => (
    <Stack direction={{ xs: 'column', md: 'column' }} alignItems="center" justifyContent="space-between" sx={{ width: '100%', height: '100%' }}>
        <Skeleton variant="rounded" width={80} height={24} sx={{ alignSelf: 'flex-start' }} />
        <Box sx={{ width: 200, height: 100, overflow: 'hidden', position: 'relative' }}>
            <Skeleton variant="circular" width={200} height={200} sx={{ position: 'absolute', bottom: -100 }} />
        </Box>
        <Skeleton variant="rounded" width={270} height={24} />
    </Stack>
);

const renderErrorMessage = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        Error loading data
    </div>
);

const CustomPieChart = <T,>({ title, useDataFetch, ...pieChartProps }: CustomPieChartProps<T>): React.ReactElement => {
    const { data, isLoading, error } = useDataFetch()
    const [highlighted, setHighlighted] = React.useState('item');
    const [faded, setFaded] = React.useState('global');
    const pieChartsParams = generatePieChartParams(data);
    const sumOfValues = data.reduce((acc, curr) => acc + (curr as { value: number }).value, 0);
    if (error) {
        return renderErrorMessage();
    }

    if (isLoading) {
        return renderSkeletonLoader();
    }
    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'flex-start' }}
            justifyContent="space-between"
            sx={{ width: '100%' }}>
            <Typography sx={{ position: 'absolute', marginLeft: "10px" }}>
                {title}
            </Typography>

            <PieChart
                {...pieChartsParams}
                series={pieChartsParams.series.map((series) => ({
                    ...series,
                    highlightScope: {
                        highlighted,
                        faded,
                    } as HighlightScope,
                }))}
            >
                <PieCenterLabel>{sumOfValues}</PieCenterLabel>
            </PieChart>
        </Stack>
    );
};

export default CustomPieChart;
