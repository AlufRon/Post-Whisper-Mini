import React, { useState } from 'react';
import { TextField, Paper, Box, Divider, FormControlLabel, Checkbox, MenuItem, Select } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { CreatePostState, PostType } from '../../../types/Interfaces';

type CreatePostFormProps = {
    createPost?: (data: CreatePostState) => void;
    loading: boolean;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ createPost, loading }) => {
    const [newPost, setNewPost] = useState<CreatePostState>({
        link: '',
        content: '',
        type: PostType.TWEET,
    });
    const [checks, setChecks] = useState({
        createActionsForAllBots: false,
        moveToCreateActions: false,
    })

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>,
        field: keyof CreatePostState
    ) => {
        const { value } = event.target as HTMLInputElement;
        setNewPost({ ...newPost, [field]: value });
    };

    const handleCheckboxChange = (field: keyof typeof checks ) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChecks({
            ...checks,
            [field]: event.target.checked,
            ...(field === 'createActionsForAllBots' ? { moveToCreateActions: false } : { createActionsForAllBots: false })
        });
    };

    const handleSubmit = async () => {
        if (createPost) {
            await createPost(newPost);
        }
    };

    return (
        <Paper style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Create New Post</h2>
            <Divider style={{ marginBottom: '20px' }} />
            <TextField
                fullWidth
                label="Link (optional)"
                value={newPost.link || ''}
                onChange={(event) => handleChange(event, 'link')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Content"
                required
                value={newPost.content}
                onChange={(event) => handleChange(event, 'content')}
                margin="normal"
                multiline
                rows={4}
            />
            <TextField
                select
                fullWidth
                label="Type"
                value={newPost.type}
                onChange={(event) => handleChange(event, 'type')}
                margin="normal"
            >
                {Object.values(PostType).map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checks.createActionsForAllBots}
                        onChange={handleCheckboxChange('createActionsForAllBots')}
                        name="createActionsForAllBots"
                    />
                }
                label="Create actions for all bots"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checks.moveToCreateActions}
                        onChange={handleCheckboxChange('moveToCreateActions')}
                        name="moveToCreateActions"
                    />
                }
                label="Move to action creator and choose bots"
            />
            <Box display="flex" justifyContent="center" gap={2}>
                <LoadingButton
                    type="submit"
                    fullWidth
                    onClick={handleSubmit}
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Create
                </LoadingButton>
            </Box>
        </Paper>
    );
};

export default CreatePostForm;
