import React, { ReactNode, useState } from 'react';
import { Paper, Box, Divider, Typography, Card, CardContent, Link, IconButton, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, SelectChangeEvent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ActionType, CreateActionsRequest, } from '../../../types/Interfaces';
import SelectPost from './SelectPost';
import { useGetPostById } from '../../../services/postService';
import { ClearIcon } from '../../../Styles/icons';
type CreateActionFormProps = {
    createAction: (data: CreateActionsRequest) => void; 
    loading: boolean;
};

const CreateActionForm: React.FC<CreateActionFormProps> = ({ createAction, loading }) => {
    const buttonTitle = "SELECT A POST"
    const [selectedPost, setSelectedPost] = useState(buttonTitle);
    const { data, isLoading, error } = useGetPostById(selectedPost)
    const [selectedActionTypes, setSelectedActionTypes] = useState<ActionType[]>([]);
    const postData = data[0]


    const renderValue = (selected: ActionType[]) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
                <Chip key={value} label={value} />
            ))}
        </Box>
    );
    const handleActionTypeChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setSelectedActionTypes(typeof value === 'string' ? [value as ActionType] : value.map(v => v as ActionType));
    };
    const handleSubmit = async () => {
        if (postData) {
            const actionRequest: CreateActionsRequest = {
                postId: postData.id, 
                actionTypes: selectedActionTypes,
            };
            await createAction(actionRequest);
        }
    };
    return (
        <Paper style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Create Actions With Post</h2>
            <Divider style={{ marginBottom: '20px' }} />
            <Box gap={2}>
                <Box display="flex" alignContent={'center'} justifyContent={'center'} gap={1}>
                    <SelectPost selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
                    {selectedPost !== buttonTitle && <IconButton
                        aria-label="clear selection"
                        size="small"
                        onClick={() => setSelectedPost(buttonTitle)}
                    >
                        <ClearIcon fontSize="inherit" />
                    </IconButton>}
                </Box>
                <Box sx={{ my: 2 }}>
                    {selectedPost === buttonTitle ? "" : isLoading ? (
                        <Typography variant="body1">Loading...</Typography>
                    ) : error ? (
                        <Typography variant="body2" color="error">{error}</Typography>
                    ) : postData ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1, alignItems: 'center' }}>
                            <Typography variant="body2" color="textSecondary">Content:</Typography>
                            <Typography variant="body2">
                                {postData.content}
                            </Typography>


                            <Typography variant="body2" color="textSecondary">Type:</Typography>
                            <Typography variant="body2">{postData.type}</Typography>

                            <Typography variant="body2" color="textSecondary">Link:</Typography>
                            <Link href={postData.link} target="_blank" rel="noopener" variant="body2">{postData.link}</Link>

                            <Typography variant="body2" color="textSecondary">Created:</Typography>
                            <Typography variant="body2">{new Date(postData.createdAt).toLocaleString()}</Typography>

                            <Typography variant="body2" color="textSecondary">Updated:</Typography>
                            <Typography variant="body2">{new Date(postData.updatedAt).toLocaleString()}</Typography>
                        </Box>
                    ) : (
                        <Typography variant="body1">No post selected or found.</Typography>
                    )}
                </Box>
                {selectedPost !== buttonTitle && <FormControl fullWidth margin="normal">
                    <InputLabel id="action-type-select-label"
                        sx={{
                            ...(selectedActionTypes.length === 0 && {
                                transform: 'translate(14px, 10px) scale(1)',
                            }),
                        }}
                    >
                        Action Types
                    </InputLabel>
                    <Select
                        labelId="action-type-select-label"
                        id="action-type-select"
                        multiple
                        value={selectedActionTypes}
                        onChange={handleActionTypeChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Action Types" />}
                        renderValue={renderValue}
                    >
                        {Object.values(ActionType).map((actionType) => (
                            <MenuItem key={actionType} value={actionType}>
                                {actionType}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>}
            </Box>
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

export default CreateActionForm;
{/* <Box display="flex" gap={2}>
                <TextField
                    fullWidth
                    error={nameError}
                    helperText={nameError ? "Name cannot be empty" : ""}
                    label="Name"
                    value={newBot.name}
                    onChange={(event) => handleChange(event, 'name')}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    error={emailError}
                    helperText={emailError ? "Invalid email address" : ""}
                    label="Email"
                    value={newBot.email}
                    onChange={(event) => handleChange(event, 'email')}
                    margin="normal"
                />
            </Box>
            <TextField
                fullWidth
                label="Access Token (optional)"
                value={newBot.accessToken || ''}
                onChange={(event) => handleChange(event, 'accessToken')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Access Token Secret (optional)"
                value={newBot.accessTokenSecret || ''}
                onChange={(event) => handleChange(event, 'accessTokenSecret')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Personality Traits (comma-separated)"
                value={newBot.personalityTraits.join(', ')}
                onChange={(event) => handleChange(event, 'personalityTraits')}
                margin="normal"
            /> */}