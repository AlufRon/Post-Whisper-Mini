import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface MyDialogProps {
    title: string;
    content: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    okButtonText?: string;
    backButtonText?: string;
    nav: string;
    extraAction?: (...args: any[]) => void;
}

const MyDialog: React.FC<MyDialogProps> = ({ title, content, open, setOpen, okButtonText = 'OK', nav = "", backButtonText = "", extraAction}) => {
    const navigate = useNavigate();

    const handleOk = () => {
        setOpen(false);
        if(extraAction)
            extraAction()
        if (nav !== "") {
            navigate(nav);
        }
    };
    const handleBack = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} onClose={(event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                setOpen(false);
            }
        }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {backButtonText !== "" &&
                    <Button onClick={handleBack} color="primary">
                        {backButtonText}
                    </Button>
                }
                <Button onClick={handleOk} sx={{border: 1, borderColor:"rgba(25, 118, 210, 0.5)"}} color="primary" autoFocus>
                    {okButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MyDialog;