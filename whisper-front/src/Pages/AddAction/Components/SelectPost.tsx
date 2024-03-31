import React, { useState } from 'react';
import { Select, MenuItem, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import PostTable from '../../PostPage/Components/PostTable';

type SelectPostProps = {
    selectedPost: string;
    setSelectedPost:  React.Dispatch<React.SetStateAction<string>>
}; 
const SelectPost: React.FC<SelectPostProps> = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const {selectedPost, setSelectedPost} = props

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };


    const handleSelectPost = (postId: string) => {
        setSelectedPost(postId);
        setOpenDialog(false);
    };

    return (
        <>
            <Button onClick={handleOpenDialog} variant="outlined" sx={{minWidth:"310px"}}>
                {selectedPost !== '' ? selectedPost : <em>Select Post</em>}
            </Button>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Select a Post</DialogTitle>
                <DialogContent>
                    <PostTable onSelectPost={handleSelectPost} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SelectPost