import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

type HeaderProps = {
    children?: ReactNode;
    title: string;
};

const Header: React.FC<HeaderProps> = ({ children, title }) => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="body1" component="div" sx={{ flexGrow: 1, fontSize: 28 }}>
                        {title}
                    </Typography>
                    {children}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
